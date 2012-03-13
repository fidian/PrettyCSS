var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var res = mod._cached ? mod._cached : mod();
    return res;
}

require.paths = [];
require.modules = {};
require.extensions = [".js",".coffee"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        var y = cwd || '.';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = x + '/package.json';
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = (Object.keys || function (obj) {
        var res = [];
        for (var key in obj) res.push(key)
        return res;
    })(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

require.define = function (filename, fn) {
    var dirname = require._core[filename]
        ? ''
        : require.modules.path().dirname(filename)
    ;
    
    var require_ = function (file) {
        return require(file, dirname)
    };
    require_.resolve = function (name) {
        return require.resolve(name, dirname);
    };
    require_.modules = require.modules;
    require_.define = require.define;
    var module_ = { exports : {} };
    
    require.modules[filename] = function () {
        require.modules[filename]._cached = module_.exports;
        fn.call(
            module_.exports,
            require_,
            module_,
            module_.exports,
            dirname,
            filename
        );
        require.modules[filename]._cached = module_.exports;
        return module_.exports;
    };
};

if (typeof process === 'undefined') process = {};

if (!process.nextTick) process.nextTick = (function () {
    var queue = [];
    var canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener
    ;
    
    if (canPost) {
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'browserify-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);
    }
    
    return function (fn) {
        if (canPost) {
            queue.push(fn);
            window.postMessage('browserify-tick', '*');
        }
        else setTimeout(fn, 0);
    };
})();

if (!process.title) process.title = 'browser';

if (!process.binding) process.binding = function (name) {
    if (name === 'evals') return require('vm')
    else throw new Error('No such module')
};

if (!process.cwd) process.cwd = function () { return '.' };

require.define("path", function (require, module, exports, __dirname, __filename) {
function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

});

require.define("/prettycss.js", function (require, module, exports, __dirname, __filename) {
require('./shim');
var stylesheet = require('./css/stylesheet');
var tokenizer = require('./tokenizer');
var util = require('./util');

var PrettyCSS = function (options) {
	this.options = util.setOptions(options);
	this.errors = [];
	this.warnings = [];
	this.stylesheet = null;
};

util.extend(PrettyCSS.prototype, {
	addError: function (code, token) {
		this.errors.push({
			"code": code,
			"token": token
		});
	},

	addWarning: function (code, token) {
		this.warnings.push({
			"code": code,
			"token": token
		});
	},

	debug: function (message) {
		if (! this.options.debug) {
			return;
		}

		console.log(message);
	},

	parse: function (tokens) {
		this.stylesheet = stylesheet.parse(tokens, this);
	},

	toString: function () {
		if (this.stylesheet) {
			return this.stylesheet.toString();
		}

		return "";
	}
});

exports.parse = function (str, options) {
	var p = new PrettyCSS(options);
	var t = tokenizer.tokenize(str, options);
	p.parse(t);
	return p;
};

exports.parseFile = function (filename, callback, options) {
	tokenizer.tokenizeFile(filename, function (err, t) {
		if (err) {
			callback(err);
		} else {
			p = new PrettyCSS(options);
			p.parse(t);
			callback(err, p);
		}
	}, options);
};

});

require.define("/shim.js", function (require, module, exports, __dirname, __filename) {
if (! Array.prototype.every) {
	Array.prototype.every = function (callback, context) {
		var l = this.length;
		var t = Object(this);
		var keepGoing = true;

		for (var i = 0; i < l; i ++) {
			if (i in t) {
				keepGoing = callback.call(context, this[i], i, this);
				if (! keepGoing) {
					return keepGoing;
				}
			}
		}

		return keepGoing;
	};
}

if (! Array.prototype.some) {
	Array.prototype.some = function (callback, context) {
		var l = this.length;
		var t = Object(this);
		for (var i = 0; i < l; i ++) {
			if (i in t) {
				if (callback.call(context, this[i], i, this)) {
					return true;
				}
			}
		}

		return false;
	};
}

if (! Array.prototype.forEach) {
	Array.prototype.forEach = function (callback, context) {
		for (var i = 0; i < l; i ++) {
			callback.call(context, this[i], i, this);
		}
	};
}

});

require.define("/css/stylesheet.js", function (require, module, exports, __dirname, __filename) {
var base = require('./base');
var atRule = require('./at-rule');
var cdc = require('./cdc');
var cdo = require('./cdo');
var comment = require('./comment');
var invalid = require('./invalid');
var ruleset = require('./ruleset');
var util = require('../util');
var whitespace = require('./whitespace');

// Do not use base.baseConstructor() since container is optional here
var Stylesheet = function (parser, container) {
	this.init();
	this.setParser(parser);

	if (container) {
		this.setContainer(container);
	}

	return this;
};

util.extend(Stylesheet.prototype, base.base, {
	name: "stylesheet",

	parseTokenList: [
		atRule,
		cdc,
		cdo,
		comment,
		ruleset,
		whitespace,
		invalid // Must be last
	],

	toString: function () {
		this.debug(this.name);
		this.debug('toString');
		var out = this.makeString(this.list);
		out = out.replace(/^[ \n\r\t\f]*|[ \n\r\t\f]*$/g, '');
		return out;
	}
});

exports.parse = function (tokens, parser, container) {
	var styles = new Stylesheet(parser, container);
	styles.debug('parse', tokens);

	while (tokens.anyLeft()) {
		styles.parseTokens(tokens);
	}

	return styles;
};

});

require.define("/css/base.js", function (require, module, exports, __dirname, __filename) {
exports.base = {
	add: function (t) {
		this.list.push(t);
	},

	addList: function (l) {
		for (var i in l) {
			this.list.push(l[i]);
		}
	},

	addWhitespace: function (type, data) {
		var opt = this.parser.options;
		var out = this.makeString(data);
		return opt[type + '_pre'] + out + opt[type + '_post'];
	},

	convertToString: function (token) {
		// Check if it is a token
		if (token.type && token.line) {
			return token.type + "@" + token.line + ":" + JSON.stringify(token.content);
		}

		// It probably is not - use its toString() method
		return token.toString();
	},

	debug: function (message, info) {
		if (! this.parser.options.debug) {
			return;
		}

		// Count depth
		var lead = "";
		var ptr = this.container;

		if (ptr) {
			while (ptr.container) {
				lead += "....";
				ptr = ptr.container;
			}
		}

		message = lead + "[" + this.name + "] " + message;

		if (typeof info == "object") {
			if (typeof info.getToken == "function") {
				// Tokenizer object
				message += "\n" + JSON.stringify(info.getToken());
			} else if (info instanceof Array) {
				// Array of tokens or CSS objects
				var outArr = [];
				message += "\n" + info.length;
				for (var i = 0; i < info.length; i ++) {
					outArr.push(this.convertToString(info[i]));
				}
				message += "\n[" + outArr.join(" ") + "]";
			} else {
				// Single token object or CSS object
				message += "\n" + this.convertToString(info);
			}
		} else if (typeof info != "undefined") {
			message += "\nUnknown type: " + typeof info;
		}

		this.parser.debug(message);
	},

	init: function () {
		this.container = null;
		this.list = [];
		this.parser = null;
	},

	makeString: function (data, joiner) {
		if (typeof data != 'object') {
			return data;
		}

		var out = "";

		data.forEach(function (elem) {
			out += elem.toString();
		});

		return out;
	},

	parseTokenList: [],

	parseTokens: function (tokens) {
		var token = tokens.getToken();
		var myself = this;

		var failed = this.parseTokenList.every(function (type) {
			if (type.canStartWith(token, tokens, myself)) {
				myself.add(type.parse(tokens, myself.parser, myself));

				// Return false - do not keep scanning
				return false;
			}

			// Return true - continue to next type
			return true;
		});

		if (failed) {
			throw new Error("Could not find valid type for token " + token.type);
		}
	},

	reindent: function (str) {
		var indent = this.parser.options.indent;

		if (! indent) {
			return str;
		}

		return str.replace(/\n/g, "\n" + indent);
	},

	setContainer: function (container) {
		if (! container) {
			throw new Error("Invalid container");
		}

		this.container = container;
	},

	setParser: function (parser) {
		if (! parser) {
			throw new Error("Invalid parser");
		}

		this.parser = parser;
	},

	toString: function () {
		throw new Error("Did not override toString() of base class");
	}
};

exports.baseConstructor = function () {
	return function (parser, container) {
		this.init();
		this.setParser(parser);
		this.setContainer(container);
		return this;
	};
};


});

require.define("/css/at-rule.js", function (require, module, exports, __dirname, __filename) {
var base = require('./base');
var block = require('./block');
var stylesheet = require('./stylesheet');
var tokenizer = require('../tokenizer');
var util = require('../util');

var At = base.baseConstructor();

util.extend(At.prototype, base.base, {
	name: "at-rule",

	toString: function () {
		this.debug('toString', this.list);
		var ws = this.parser.options.at_whitespace;
		var out = ""

		this.list.forEach(function (value) {
			if (value.type == "S") {
				out += ws;
			} else {
				out += value.content;
			}
		})

		if (this.stylesheet) {
			var block = this.stylesheet.toString();
			block = this.reindent(block);
			out += this.addWhitespace('atblock', block);
		}

		return this.addWhitespace('at', out);
	}
});

exports.canStartWith = function (token, tokens) {
	return token.type == 'AT_SYMBOL';
};

exports.parse = function (tokens, parser, container) {
	var at = new At(parser, container);
	at.debug('parse', tokens);
	at.block = null;
	var token = tokens.getToken();

	// Eat until the first semicolon or the ending of a block
	while (token && token.type != 'SEMICOLON' && token.type != 'BLOCK_OPEN') {
		at.add(token);
		token = tokens.nextToken();
	}

	if (! token) {
		return at;
	}

	if (token.type == 'SEMICOLON') {
		at.add(token);
		tokens.next();
		return at;
	}

	// Match braces and find the right closing block
	var depth = 1;
	token = tokens.nextToken();  // Consume BLOCK_OPEN
	var blockTokens = [];

	while (token && depth) {
		if (token.type == 'BLOCK_OPEN') {
			depth ++;
		} else if (token.type == "BLOCK_CLOSE") {
			depth --;
		}

		if (depth) {
			blockTokens.push(token);
		}

		token = tokens.nextToken();
	}
		
	// Send the block through the stylesheet parser
	var tempTokenizer = tokenizer.tokenize('', parser.options);
	tempTokenizer.tokens = blockTokens;
	at.stylesheet = stylesheet.parse(tempTokenizer, parser, at);

	return at;
};

});

require.define("/css/block.js", function (require, module, exports, __dirname, __filename) {
var atRule = require('./at-rule');
var base = require('./base');
var comment = require('./comment');
var invalid = require('./invalid');
var declaration = require('./declaration');
var util = require('../util');
var whitespace = require('./whitespace');

// Do not use base.baseConstructor() since container is optional here
var Block = function (parser, container) {
	this.init();
	this.setParser(parser);

	if (container) {
		this.setContainer(container);
	}

	return this;
};

util.extend(Block.prototype, base.base, {
	name: "block",

	parseTokenList: [
		atRule,
		exports,  // self-reference
		comment,
		whitespace,
		declaration,
		invalid // Must be last
	],

	toString: function () {
		this.debug('toString', this.list);
		var out = this.makeString(this.list);
		out = this.reindent(out);
		var out = this.addWhitespace('block', out);
		return out;
	}
});

exports.canStartWith = function (token, tokens) {
	return token.type == 'BLOCK_OPEN';
};

exports.parse = function (tokens, parser, container) {
	var block = new Block(parser, container);
	block.debug('parse', tokens);

	if (container) {
		// Consume open brace
		tokens.next();
	}

	while (tokens.anyLeft()) {
		var token = tokens.getToken();

		if (container && token.type == 'BLOCK_CLOSE') {
			// Done with this block
			tokens.next();
			return block;
		}

		block.parseTokens(tokens);
	}

	return block;
};

});

require.define("/css/comment.js", function (require, module, exports, __dirname, __filename) {
var base = require('./base');
var util = require('../util');

var Comment = base.baseConstructor();

util.extend(Comment.prototype, base.base, {
	name: 'comment',
	
	toString: function () {
		this.debug('toString', this.list);

		if (this.container.name == "stylesheet") {
			return this.addWhitespace('topcomment', this.list);
		}

		return this.addWhitespace('comment', this.list);
	}
});

exports.canStartWith = function (token, tokens) {
	return token.type == 'COMMENT';
};

exports.parse = function (tokens, parser, container) {
	var comment = new Comment(parser, container);
	comment.debug('parse', tokens);
	comment.add(tokens.getToken());
	tokens.next();
	return comment;
};

});

require.define("/util.js", function (require, module, exports, __dirname, __filename) {
exports.setOptions = function (override) {
	if (typeof override != "object") {
		override = {};
	}

	var options = {
		debug: false,
		fileEncoding: "utf-8",
		ruleset_pre: "",
		ruleset_post: "\n\n",
		combinator_pre: ' ',
		combinator_post: ' ',
		declaration_pre: '',
		declaration_post: '',
		selector_pre: "",
		selector_post: " ",
		selector_whitespace: " ", // Must contain whitespace
		selector_comma: ", ", // Must contain comma
		block_pre: "{",  // Must contain {
		block_post: "\n}",  // Must contain }
		indent: "\t",
		property_pre: "\n",
		property_post: "",
		value_pre: " ",
		value_post: "",
		at_pre: "",
		at_post: "\n\n",
		atblock_pre: "{\n\t",
		atblock_post: "\n}",
		at_whitespace: " ",
		important: " !important", // Must contain !{w}important
		cdo: "<!--\n", // Either {w} or {w}CDO{w}
		cdc: "\n-->", // Either {w} or {w}CDC{w}
		topcomment_pre: "",
		topcomment_post: "\n\n",
		comment_pre: "  ",
		comment_post: "",
		cssLevel: 3,
		propertiesLowerCase: true,
		valuesLowerCase: true,
		functionComma: ", " // Must contain comma
	};

	return exports.extend({}, options, override);
};

// Extend an object with properties from subsequent objects
// Code based heavily on jQuery's version with far less error checking
exports.extend = (function (undefined) {
	var exProp = function (dest, name, src) {
		if (! src.hasOwnProperty(name)) {
			return;
		}

		var srcName = src[name];

		// Recurse if merging objects, but not arrays nor functions
		if (typeof srcName == "object" && ! srcName instanceof Function && ! srcName instanceof Array) {
			dest[name] = exObj(dest[name], srcName);
		} else if (srcName !== undefined) {
			dest[name] = srcName;
		}
	};

	var exObj = function () {
		var target = arguments[0] || {},
			i = 1,
			length = arguments.length;

		while (i < arguments.length) {
			var addMe = arguments[i];

			for (var name in addMe) {
				exProp(target, name, addMe);
			}

			exProp(target, "constructor", addMe);
			exProp(target, "toString", addMe);
			exProp(target, "valueOf", addMe);

			i ++;
		}

		return target;
	};

	return exObj;
})();

// Expand a pattern into a RegExp object
var subPat = /{([a-z][a-z0-9_]*)}/ig;
exports.expandIntoRegExpPattern = function (pattern, expansion) {
	while (subPat.test(pattern)) {
		pattern = pattern.replace(subPat, function (str, p) {
			if (expansion[p]) {
				return "(" + expansion[p] + ")";
			}

			throw "Invalid pattern referenced: " + p;
		});
	}

	return pattern;
};

});

require.define("/css/invalid.js", function (require, module, exports, __dirname, __filename) {
var base = require('./base');
var block = require('./block');
var util = require('../util');

var Invalid = base.baseConstructor();

util.extend(Invalid.prototype, base.base, {
	name: "invalid",

	consume: function (tokens, parser, container) {
		var token = tokens.getToken();

		// Eat until the first semicolon or the ending of a block
		while (token && token.type != 'SEMICOLON' && token.type != 'BLOCK_OPEN') {
			this.add(token);
			token = tokens.nextToken();
		}

		if (! token) {
			return;
		}

		if (token.type == 'SEMICOLON') {
			this.add(token);
			tokens.next();
			return;
		}

		this.block = block.parse(tokens, this.parser, this);
	},

	toString: function () {
		this.debug('toString', this.list);
		return "";  // Remove invalid declarations
	}
});

exports.canStartWith = function (token, tokens) {
	return true;  // Invalid things can be anything
};

exports.parse = function (tokens, parser, container) {
	var invalid = new Invalid(parser, container);
	invalid.debug('parse', tokens);
	invalid.block = null;

	if (tokens) {
		parser.addError('invalid_token', tokens.getToken());
		invalid.consume(tokens);
	}

	return invalid;
};

});

require.define("/css/declaration.js", function (require, module, exports, __dirname, __filename) {
var base = require('./base');
var invalid = require('./invalid');
var property = require('./property');
var util = require('../util');
var value = require('./value');

// Mapping properties to value types
var propertyMapping = {
	'background-color': require('./values/background-color'),
	'clear': require('./values/clear'),
	'color': require('./values/color'),
	'display': require('./values/display'),
	'float': require('./values/float'),
	'font-size': require('./values/font-size'),
	'font-weight': require('./values/font-weight'),
	'height': require('./values/height'),
	'margin-bottom': require('./values/margin-width'),
	'margin-left': require('./values/margin-width'),
	'margin-right': require('./values/margin-width'),
	'margin-top': require('./values/margin-width'),
	'text-align': require('./values/text-align'),
	'width': require('./values/width')
};

var Declaration = base.baseConstructor();

util.extend(Declaration.prototype, base.base, {
	name: "declaration",

	toString: function () {
		this.debug('toString')
		var out = this.property.toString();
		out += ":";
		out += this.value.toString();
		out += ";";
		return this.addWhitespace('declaration', out);
	}
});

exports.canStartWith = function (token, tokens) {
	// Needs to match property + S* + COLON
	if (! property.canStartWith(token, tokens)) {
		return false;
	}

	var offset = 1;
	var t = tokens.getToken(offset);

	if (t && t.type == 'S') {
		offset ++;
		t = tokens.getToken(offset);
	}

	if (t && t.type == 'COLON') {
		return true;
	}
};

var isPartOfValue = function (token) {
	if (! token) {
		return false;
	}

	if (token.type == 'SEMICOLON' || token.type == 'BLOCK_CLOSE') {
		return false;
	}

	return true;
};

exports.parse = function (tokens, parser, container) {
	var declaration = new Declaration(parser, container);
	declaration.debug('parse', tokens);

	declaration.property = property.parse(tokens, parser, declaration);
	var nextToken = tokens.getToken();

	if (! nextToken || nextToken.type != "COLON") {
		parser.addError('colon_expected', nextToken);
		var invalidCss = invalid.parse(null, parser, container);
		invalidCss.addList(declaration.property.list);
		invalidCss.consume(tokens);
		return invalidCss;
	}

	tokens.next();
	declaration.value = value.parse(tokens, parser, declaration);

	// See if we can map properties to something we can validate
	var propertyName = declaration.property.getPropertyName().toLowerCase();

	if (! propertyMapping[propertyName]) {
		// Not a known property
		parser.addWarning('unknown_property', declaration.property.list[0]);
		return declaration;
	}

	if (declaration.value.getLength() == 0) {
		parser.addWarning("no_value_for_property", declaration.property.list[0]);
		return declaration;
	}

	// Attempt to map the value
	var valueType = propertyMapping[propertyName];
	var result = valueType.parse(declaration.value.getTokens(), parser, declaration);

	if (! result) {
		// Value did not match expected patterns
		parser.addWarning("invalid_value", declaration.value.firstToken());
		return declaration;
	}

	result.doWarnings();
	result.unparsed.skipWhitespace();

	if (result.unparsed.length()) {
		parser.addWarning("extra_tokens_after_value", result.unparsed.firstToken());
	}

	declaration.value.setTokens([ result, result.unparsed ]);
	return declaration;
};

});

require.define("/css/property.js", function (require, module, exports, __dirname, __filename) {
var base = require('./base');
var util = require('../util');

var Property = base.baseConstructor();

util.extend(Property.prototype, base.base, {
	name: "property",

	getPropertyName: function () {
		return this.list[0].toString();
	},

	toString: function () {
		this.debug('toString', this.list);
		var propertyName = this.getPropertyName();

		if (this.parser.options.propertiesLowerCase) {
			propertyName = propertyName.toLowerCase();
		}
		
		return this.addWhitespace('property', propertyName);
	}
});

exports.canStartWith = function (token, tokens) {
	return token.type == 'IDENT';
};

exports.parse = function (tokens, parser, container) {
	var property = new Property(parser, container);
	property.debug('parse', tokens);
	property.add(tokens.getToken());
	var nextToken = tokens.nextToken();

	if (nextToken && nextToken.type == 'S') {
		tokens.next();
	}
	
	return property;
};

});

require.define("/css/value.js", function (require, module, exports, __dirname, __filename) {
var base = require('./base');
var block = require('./block');
var util = require('../util');
var unparsed = require('./values/unparsed');

var Value = base.baseConstructor();

util.extend(Value.prototype, base.base, {
	important: false,
	name: "value",

	firstToken: function () {
		return this.list[0];
	},

	getTokens: function () {
		var t = new unparsed.constructor(this.list, this.parser, this);
		return t;
	},

	/* Sets flags on the object if this has a priority */
	handlePriority: function () {
		var last = this.lastToken();

		if (last && last.type == "IMPORTANT") {
			this.list.pop();
			this.length = this.list.length;
			this.important = true;
			this.removeWhitespaceAtEnd();
		}
	},

	lastToken: function () {
		if (! this.list.length) {
			return null;
		}

		return this.list[this.list.length - 1];
	},

	getLength: function () {
		return this.list.length;
	},

	prepend: function (value) {
		this.list.unshift(value);
	},

	/* Whitespace at the end can be safely removed */
	removeWhitespaceAtEnd: function () {
		last = this.lastToken();

		if (last && last.type == "S") {
			this.list.pop();
			this.length = this.list.length;
		}
	},

	setTokens: function (list) {
		this.list = list;
		this.length = this.list.length;
	},

	shift: function () {
		return this.list.shift();
	},

	toString: function () {
		this.debug('toString', this.list);
		out = "";
		this.list.forEach(function (v) {
			if (v.content) {
				// Token object
				out += v.content;
			} else {
				// Block or parsed value
				out += v.toString();
			}
		});

		if (this.important) {
			out += this.parser.options.important;
		}

		return this.addWhitespace('value', out);
	}
});


exports.canStartWith = function (token, tokens) {
	return false;  // Not used in automatic pattern matching
};

var isPartOfValue = function (token) {
	if (! token) {
		return false;
	}

	if (token.type == 'SEMICOLON' || token.type == 'BLOCK_CLOSE') {
		return false;
	}

	return true;
};

exports.parse = function (tokens, parser, container) {
	var value = new Value(parser, container);
	value.debug('parse', tokens);
	var token = tokens.getToken();

	if (token && token.type == "S") {
		token = tokens.nextToken();
	}

	while (isPartOfValue(token)) {
		if (token.type == 'BLOCK_OPEN') {
			value.add(block.parse(tokens, parser, value));
			token = tokens.getToken();
		} else {
			value.add(token);
			token = tokens.nextToken();
		}
	}

	value.removeWhitespaceAtEnd();
	value.handlePriority();

	if (token && token.type == "SEMICOLON") {
		tokens.next();
	}

	return value;
};

});

require.define("/css/values/unparsed.js", function (require, module, exports, __dirname, __filename) {
var base = require('./base');
var util = require('../../util');

var Unparsed = function (list, parser, container) {
	this.list = list;
	this.parser = parser;
	this.container = container;
};

util.extend(Unparsed.prototype, base.base, {
	name: 'unparsed',

	advance: function () {
		if (! this.list.length) {
			return null;
		}

		var out = this.list.shift();

		this.skipWhitespace();
		return out;
	},

	canMatch: function (possibilities, container) {
		if (! (possibilities instanceof Array)) {
			possibilities = [ possibilities ];
		}

		while (possibilities.length) {
			var t = possibilities.shift();
			if (typeof t == 'string') {
				if (this.list[0].content.toLowerCase() == t.toLowerCase()) {
					var tokens = this.clone();
					var v = tokens.advance();
					return {
						tokens: tokens,
						value: v
					};
				}
			} else if (typeof t == 'object') {
				if (typeof t.parse == 'function') {
					var parse = t.parse(this, container.parser, container);

					if (parse) {
						return parse;
					}
				} else {
					throw "canMatch against object without parse";
				}
			} else {
				throw "canMatch against " + (typeof t);
			}
		}

		return null;
	},

	clone: function () {
		return new Unparsed(this.list.slice(0), this.parser, this.container);
	},

	length: function () {
		return this.list.length;
	},

	getTokens: function () {
		return this.list;
	},

	isContent: function (content) {
		return this.list.length && this.list[0].content == content;
	},

	isTypeContent: function (type, content) {
		return this.list.length && this.list[0].type == type && this.list[0].content.toLowerCase() == content;
	},

	isType: function (type) {
		return this.list.length && this.list[0].type == type;
	},

	shift: function () {
		return this.list.shift();
	},

	skipWhitespace: function () {
		if (this.list.length && this.list[0].type == 'S') {
			this.list.shift();
		}
	}
});

exports.constructor = Unparsed;

});

require.define("/css/values/base.js", function (require, module, exports, __dirname, __filename) {
var util = require('../../util');

exports.base = {
	add: function (t) {
		this.list.push(t);
	},

	addWarning: function (warningCode, token) {
		this.warningList.push([warningCode, token]);
	},

	debug: function (message, tokens) {
		if (! this.parser || ! this.parser.options.debug) {
			return;
		}

		// Count depth
		var lead = "";
		var ptr = this.container;

		while (ptr.container) {
			lead += "....";
			ptr = ptr.container;
		}

		message = lead + "[" + this.name + "] " + message;
		this.parser.debug(message);

		if (typeof tokens != "undefined") {
			if (typeof tokens.getTokens != "undefined") {
				this.parser.debug(tokens.getTokens());
			} else {
				this.parser.debug(tokens);
			}
		}
	},

	doWarnings: function () {
		var myself = this;
		this.warningList.forEach(function (warningInfo) {
			myself.parser.addWarning.apply(myself.parser, warningInfo);
		});

		this.list.forEach(function (item) {
			if (item.doWarnings instanceof Function) {
				item.doWarnings();
			}
		});
	},

	firstToken: function () {
		if (this.list.length) {
			return this.list[0];
		}

		return null;
	},

	functionParser: function () {
		if (arguments.length < 1) {
			// Must have function name
			return null;
		}

		var args = Array.prototype.slice.call(arguments);
		var unparsed = this.unparsed.clone()
		var matchCount = 0;
		this.isFunction = true;

		while (args.length) {
			if (matchCount > 1) {
				// No comma after function name and first argument
				if (! unparsed.isTypeContent('OPERATOR', ',')) {
					return false;
				}

				unparsed.advance();  // Skip comma and possibly whitespace
			}

			var parsed = unparsed.canMatch(args.shift(), this);

			if (! parsed) {
				return false;
			}

			unparsed = parsed.unparsed.clone();
			this.add(parsed);
			matchCount ++;
		}

		if (! unparsed.isTypeContent('PAREN_CLOSE', ')')) {
			return false;
		}

		unparsed.advance();
		this.unparsed = unparsed;

		return true;
	},
	
	isInherit: function () {
		// Check if any are "inherit"
		return this.list.some(function (value) {
			// If a "value" object
			if (value.isInherit) {
				return value.isInherit();
			}

			// Must be a token
			return value.content != 'inherit';
		});
	},

	scanRules: function () {
		var unparsed = this.unparsed.clone();
		var tokenContent = unparsed.firstToken().content.toLowerCase();
		var rules = this.allowed;

		for (var i = 0; i < rules.length; i ++) {
			var rule = rules[i];
			var values = rule.values;

			for (var j = 0; j < values.length; j ++) {
				var result = this.testRuleValue(values[j], tokenContent, unparsed, rule);

				if (result) {
					this.debug('parse success', result.unparsed);
					return result;
				}
			}
		}

		this.debug('parse fail');
		return null;
	},

	testRuleValidation: function (rule, tokenOrObject) {
		var myself = this;

		rule.validation.forEach(function (validationFunction) {
			// Call function in my context so it can use
			// this.addWarning();
			validationFunction.call(myself, tokenOrObject);
		});
	},

	testRuleValueSuccess: function (unparsedReal, rule) {
		var unparsed = unparsedReal.clone();
		var token = unparsed.advance();
		this.add(token);
		this.testRuleValidation(rule, token);
		this.unparsed = unparsed;
		return this;
	},

	testRuleValue: function (value, tokenContent, unparsed, rule) {
		if (value instanceof RegExp) {
			this.debug('testRuleValue vs RegExp ' + value.toString());

			if (value.test(tokenContent)) {
				return this.testRuleValueSuccess(unparsed, rule);
			}
		} else if (value.parse instanceof Function) {
			this.debug('testRuleValue vs func ' + value.toString());
			var ret = value.parse(unparsed, this.parser, this);

			if (ret) {
				this.add(ret);
				this.testRuleValidation(rule, ret);
				this.unparsed = ret.unparsed;
				return this;
			}
		} else {
			this.debug('testRuleValue vs string ' + value.toString());

			if (value == tokenContent) {
				return this.testRuleValueSuccess(unparsed, rule);
			}
		}

		return null;
	},

	toString: function () {
		this.debug('toString');
		var out = [];

		this.list.forEach(function (value) {
			out.push(value.toString());
		});

		if (this.isFunction) {
			var fn = out.shift();
			out = fn + out.join(this.parser.options.functionComma) + ')';
		} else {
			out = out.join(' ');  // TODO: configurable whitespace?

			if (this.parser.options.valuesLowerCase) {
				out = out.toLowerCase();
			}
		}

		return out;
	},

	warnIfNotInteger: function (token, value) {
		if (arguments.length < 2) {
			value = token.content;
		}

		if (! /^[-+]?[0-9]+$/.test(value)) {
			this.addWarning('only_integers_allowed', token);
		}
	},

	warnIfMixingPercents: function (token, valueList) {
		var listCountPercent = 0;

		valueList.forEach(function (val) {
			if (val.name == 'percent') {
				listCountPercent ++;
			}
		});

		if (listCountPercent != 0 && listCountPercent != valueList.length) {
			this.addWarning('mixing_percents_and_values', token);
		}
	},

	warnIfOutsideRange: function (token, min, max, value) {
		if (arguments.length < 4) {
			value = token.content;
		}

		var v = (+value);

		if (v > max) {
			this.addWarning('out_of_range_max_' + max, token);
			v = min;
		}
		if (v < min) {
			this.addWarning('out_of_range_min_' + min, token);
			v = min;
		}

		return v;
	}
};

exports.baseConstructor = function () {
	return function (parser, container, unparsed) {
		this.container = container;
		this.list = [];
		this.parser = parser;
		this.warningList = [];
		this.unparsed = unparsed;
	};
};

var regexpExpansions = {
	'n': "[0-9]*\\.?[0-9]+",
	'w': "[ \\n\\r\\f\\t]"
};

exports.makeRegexp = function (pattern) {
	// All token pattern matches start at the beginning of the string
	// and must match the entire token
	pattern = "^" + pattern + "$";
	pattern = util.expandIntoRegExpPattern(pattern, regexpExpansions);

	// CSS tokens match insensitively
	return new RegExp(pattern, 'i');
};

exports.simpleParser = function (baseObj) {
	return function (unparsed, parser, container) {
		var simpleObj = new baseObj(parser, container, unparsed);
		simpleObj.debug('parse', unparsed);
		return simpleObj.scanRules();
	};
};

});

require.define("/css/values/background-color.js", function (require, module, exports, __dirname, __filename) {
/* background-color
 *
 * CSS1:  <color> | transparent
 * CSS2:  <color> | transparent | inherit
 * CSS2.1:  Same as CSS2
 * CSS3:  <color>     transparent is part of <color> and inherit was removed
 */
var base = require('./base');
var color = require('./color');
var util = require('../../util');
var validate = require('./validate');

var BackgroundColor = base.baseConstructor();

util.extend(BackgroundColor.prototype, base.base, {
	name: "background-color",

	allowed: [
		{
			validation: [
				validate.minimumCss(2),
				validate.browserUnsupported('IE7'),
				validate.browserQuirk('IE8')  // Requires !DOCTYPE
			],
			values: [
				"inherit"  // Also matches inherit in <color>, so list this first
			]
		},
		{
			validation: [],
			values: [ 
				color,
				'transparent'
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"initial"
			]
		}
	]
});

exports.parse = base.simpleParser(BackgroundColor);

});

require.define("/css/values/color.js", function (require, module, exports, __dirname, __filename) {
/* <color>
 *
 * Colors can be one of 18-ish basic colors, extended colors from CSS3, rgb,
 * rgba, hsl, hsla, 3-digit or 6-digit hex codes.
 */

var base = require('./base');
var hsl = require('./hsl');
var hsla = require('./hsla');
var rgb = require('./rgb');
var rgba = require('./rgba');
var util = require('../../util');
var validate = require('./validate');

var Color = base.baseConstructor();

var colormap = {
	'aliceblue': '#f0f8ff',
	'antiquewhite': '#faebd7',
	'aqua': '#00ffff',
	'aquamarine': '#7fffd4',
	'azure': '#f0ffff',
	'beige': '#f5f5dc',
	'bisque': '#ffe4c4',
	'black': '#000000',
	'blanchedalmond': '#ffebcd',
	'blue': '#0000ff',
	'blueviolet': '#8a2be2',
	'brown': '#a52a2a',
	'burlywood': '#deb887',
	'cadetblue': '#5f9ea0',
	'chartreuse': '#7fff00',
	'chocolate': '#d2691e',
	'coral': '#ff7f50',
	'cornflowerblue': '#6495ed',
	'cornsilk': '#fff8dc',
	'crimson': '#dc143c',
	'cyan': '#00ffff',
	'darkblue': '#00008b',
	'darkcyan': '#008b8b',
	'darkgoldenrod': '#b8860b',
	'darkgray': '#a9a9a9',
	'darkgreen': '#006400',
	'darkgrey': '#a9a9a9',
	'darkkhaki': '#bdb76b',
	'darkmagenta': '#8b008b',
	'darkolivegreen': '#556b2f',
	'darkorange': '#ff8c00',
	'darkorchid': '#9932cc',
	'darkred': '#8b0000',
	'darksalmon': '#e9967a',
	'darkseagreen': '#8fbc8f',
	'darkslateblue': '#483d8b',
	'darkslategray': '#2f4f4f',
	'darkslategrey': '#2f4f4f',
	'darkturquoise': '#00ced1',
	'darkviolet': '#9400d3',
	'deeppink': '#ff1493',
	'deepskyblue': '#00bfff',
	'dimgray': '#696969',
	'dimgrey': '#696969',
	'dodgerblue': '#1e90ff',
	'firebrick': '#b22222',
	'floralwhite': '#fffaf0',
	'forestgreen': '#228b22',
	'fuchsia': '#ff00ff',
	'gainsboro': '#dcdcdc',
	'ghostwhite': '#f8f8ff',
	'gold': '#ffd700',
	'goldenrod': '#daa520',
	'gray': '#808080',
	'green': '#008000',
	'greenyellow': '#adff2f',
	'grey': '#808080',
	'honeydew': '#f0fff0',
	'hotpink': '#ff69b4',
	'indianred': '#cd5c5c',
	'indigo': '#4b0082',
	'ivory': '#fffff0',
	'khaki': '#f0e68c',
	'lavender': '#e6e6fa',
	'lavenderblush': '#fff0f5',
	'lawngreen': '#7cfc00',
	'lemonchiffon': '#fffacd',
	'lightblue': '#add8e6',
	'lightcoral': '#f08080',
	'lightcyan': '#e0ffff',
	'lightgoldenrodyellow': '#fafad2',
	'lightgray': '#d3d3d3',
	'lightgreen': '#90ee90',
	'lightgrey': '#d3d3d3',
	'lightpink': '#ffb6c1',
	'lightsalmon': '#ffa07a',
	'lightseagreen': '#20b2aa',
	'lightskyblue': '#87cefa',
	'lightslategray': '#778899',
	'lightslategrey': '#778899',
	'lightsteelblue': '#b0c4de',
	'lightyellow': '#ffffe0',
	'lime': '#00ff00',
	'limegreen': '#32cd32',
	'linen': '#faf0e6',
	'magenta': '#ff00ff',
	'maroon': '#800000',
	'mediumaquamarine': '#66cdaa',
	'mediumblue': '#0000cd',
	'mediumorchid': '#ba55d3',
	'mediumpurple': '#9370db',
	'mediumseagreen': '#3cb371',
	'mediumslateblue': '#7b68ee',
	'mediumspringgreen': '#00fa9a',
	'mediumturquoise': '#48d1cc',
	'mediumvioletred': '#c71585',
	'midnightblue': '#191970',
	'mintcream': '#f5fffa',
	'mistyrose': '#ffe4e1',
	'moccasin': '#ffe4b5',
	'navajowhite': '#ffdead',
	'navy': '#000080',
	'oldlace': '#fdf5e6',
	'olive': '#808000',
	'olivedrab': '#6b8e23',
	'orange': '#ffa500',
	'orangered': '#ff4500',
	'orchid': '#da70d6',
	'palegoldenrod': '#eee8aa',
	'palegreen': '#98fb98',
	'paleturquoise': '#afeeee',
	'palevioletred': '#db7093',
	'papayawhip': '#ffefd5',
	'peachpuff': '#ffdab9',
	'peru': '#cd853f',
	'pink': '#ffc0cb',
	'plum': '#dda0dd',
	'powderblue': '#b0e0e6',
	'purple': '#800080',
	'red': '#ff0000',
	'rosybrown': '#bc8f8f',
	'royalblue': '#4169e1',
	'saddlebrown': '#8b4513',
	'salmon': '#fa8072',
	'sandybrown': '#f4a460',
	'seagreen': '#2e8b57',
	'seashell': '#fff5ee',
	'sienna': '#a0522d',
	'silver': '#c0c0c0',
	'skyblue': '#87ceeb',
	'slateblue': '#6a5acd',
	'slategray': '#708090',
	'slategrey': '#708090',
	'snow': '#fffafa',
	'springgreen': '#00ff7f',
	'steelblue': '#4682b4',
	'tan': '#d2b48c',
	'teal': '#008080',
	'thistle': '#d8bfd8',
	'tomato': '#ff6347',
	'turquoise': '#40e0d0',
	'violet': '#ee82ee',
	'wheat': '#f5deb3',
	'white': '#ffffff',
	'whitesmoke': '#f5f5f5',
	'yellow': '#ffff00',
	'yellowgreen': '#9acd32'
};


util.extend(Color.prototype, base.base, {
	name: "color",

	allowed: [
		{
			validation: [
				validate.minimumCss(2),
				validate.deprecated(3, 'appearance')
			],
			values: [ 
				'activeborder',
				'activecaption',
				'appworkspace',
				'background',
				'buttonface',
				'buttonhighlight',
				'buttonshadow',
				'buttontext',
				'captiontext',
				'graytext',
				'highlight',
				'highlighttext',
				'inactiveborder',
				'inactivecaption',
				'inactivecaptiontext',
				'infobackground',
				'infotext',
				'menu',
				'menutext',
				'scrollbar',
				'threeddarkshadow',
				'threedface',
				'threedlightshadow',
				'threedshadow',
				'window',
				'windowframe',
				'windowtext'
			]
		},
		{
			validation: [],
			values: [ 
				'aqua',
				'black',
				'blue',
				'fuchsia',
				'gray',
				'green',
				'lime',
				'maroon',
				'navy',
				'olive',
				'red',
				'silver',
				'teal',
				'white',
				'yellow',
				'inherit',
				base.makeRegexp('#[0-9a-f]{3}'),
				base.makeRegexp('#[0-9a-f]{6}'),
				rgb
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [ 
				'purple'
			]
		},
		{
			validation: [
				validate.minimumCss(2.1)
			],
			values: [ 
				'orange'
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				rgba,
				'currentcolor',
				'transparent',
				hsl,
				hsla
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				'aliceblue',
				'antiquewhite',
				'aquamarine',
				'azure',
				'beige',
				'bisque',
				'blanchedalmond',
				'blueviolet',
				'brown',
				'burlywood',
				'cadetblue',
				'chartreuse',
				'chocolate',
				'coral',
				'cornflowerblue',
				'cornsilk',
				'crimson',
				'cyan',
				'darkblue',
				'darkcyan',
				'darkgoldenrod',
				'darkgray',
				'darkgreen',
				'darkgrey',
				'darkkhaki',
				'darkmagenta',
				'darkolivegreen',
				'darkorange',
				'darkorchid',
				'darkred',
				'darksalmon',
				'darkseagreen',
				'darkslateblue',
				'darkslategray',
				'darkslategrey',
				'darkturquoise',
				'darkviolet',
				'deeppink',
				'deepskyblue',
				'dimgray',
				'dimgrey',
				'dodgerblue',
				'firebrick',
				'floralwhite',
				'forestgreen',
				'gainsboro',
				'ghostwhite',
				'gold',
				'goldenrod',
				'greenyellow',
				'grey',
				'honeydew',
				'hotpink',
				'indianred',
				'indigo',
				'ivory',
				'khaki',
				'lavender',
				'lavenderblush',
				'lawngreen',
				'lemonchiffon',
				'lightblue',
				'lightcoral',
				'lightcyan',
				'lightgoldenrodyellow',
				'lightgray',
				'lightgreen',
				'lightgrey',
				'lightpink',
				'lightsalmon',
				'lightseagreen',
				'lightskyblue',
				'lightslategray',
				'lightslategrey',
				'lightsteelblue',
				'lightyellow',
				'limegreen',
				'linen',
				'magenta',
				'mediumaquamarine',
				'mediumblue',
				'mediumorchid',
				'mediumpurple',
				'mediumseagreen',
				'mediumslateblue',
				'mediumspringgreen',
				'mediumturquoise',
				'mediumvioletred',
				'midnightblue',
				'mintcream',
				'mistyrose',
				'moccasin',
				'navajowhite',
				'oldlace',
				'olivedrab',
				'orangered',
				'orchid',
				'palegoldenrod',
				'palegreen',
				'paleturquoise',
				'palevioletred',
				'papayawhip',
				'peachpuff',
				'peru',
				'pink',
				'plum',
				'powderblue',
				'rosybrown',
				'royalblue',
				'saddlebrown',
				'salmon',
				'sandybrown',
				'seagreen',
				'seashell',
				'sienna',
				'skyblue',
				'slateblue',
				'slategray',
				'slategrey',
				'snow',
				'springgreen',
				'steelblue',
				'tan',
				'thistle',
				'tomato',
				'turquoise',
				'violet',
				'wheat',
				'whitesmoke',
				'yellowgreen'
			]
		}
	]
});

exports.parse = base.simpleParser(Color);

});

require.define("/css/values/hsl.js", function (require, module, exports, __dirname, __filename) {
/* hsl( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} )
 *
 * Used to define colors
 */

var base = require('./base');
var number = require('./number');
var percent = require('./percent');
var util = require('../../util');

var HSL = base.baseConstructor();

util.extend(HSL.prototype, base.base, {
	name: "hsl"
});

exports.parse = function (unparsed, parser, container) {
	var hsl = new HSL(parser, container, unparsed);
	hsl.debug('parse', unparsed);

	if (! hsl.functionParser('hsl(', 
		[ number, percent ],
		[ number, percent ],
		[ number, percent ])) {
		return null;
	}

	hsl.warnIfMixingPercents(hsl.list[0], [hsl.list[1], hsl.list[2], hsl[3]]);
	hsl.debug('parse success');
	return hsl;
};

});

require.define("/css/values/number.js", function (require, module, exports, __dirname, __filename) {
/* <number>
 *
 * Numbers can be negative or positive numbers and may be floats.
 */

var base = require('./base');
var util = require('../../util');

var Num = base.baseConstructor();

util.extend(Num.prototype, base.base, {
	name: "number",

	allowed: [
		{
			validation: [],
			values: [ 
				base.makeRegexp('[-+]?{n}')
			]
		}
	],

	getValue: function () {
		return (+ this.list[0]);
	}
});

exports.parse = base.simpleParser(Num);

});

require.define("/css/values/percent.js", function (require, module, exports, __dirname, __filename) {
/* <percent>
 *
 * Percents should be integer values from 0 to 100%.  CSS1 allows floating
 * point numbers, but CSS2 does not.  Allow reading them, but round to the
 * nearest integer.
 */

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Percent = base.baseConstructor();

util.extend(Percent.prototype, base.base, {
	name: "percent",

	allowed: [
		{
			validation: [
				validate.positiveValue()
			],
			values: [ 
				base.makeRegexp('[-+]?{n}%')
			]
		}
	],

	getValue: function () {
		var v = this.list[0].content;
		v = v.substring(0, v.length - 2);
		v = Math.round(+ v);
		return v;
	},

	toString: function () {
		this.debug('toString');
		return this.getValue() + '%';
	}
});

exports.parse = base.simpleParser(Percent);

});

require.define("/css/values/validate.js", function (require, module, exports, __dirname, __filename) {
exports.browserQuirk = function (browserAndVersion) {
	return function (token) {
		this.addWarning('browser_quirk_' + browserAndVersion, token);
	};
};

exports.browserUnsupported = function (browserAndVersion) {
	return function (token) {
		this.addWarning('browser_unsupported_' + browserAndVersion, token);
	};
};

exports.deprecated = function (deprecatedVersion, suggestion) {
	return function (token) {
		var warning = 'deprecated_css_version_3';

		if (suggestion) {
			warning += '_use_' + suggestion;
		}

		this.addWarning(warning, token);
	}
};

exports.maximumCss = function (maxVersion) {
	return function (token) {
		if (this.parser.options.cssLevel > maxVersion) {
			this.addWarning('maximum_css_version_' + maxVersion, token);
		}
	}
};

exports.minimumCss = function (minVersion) {
	return function (token) {
		if (this.parser.options.cssLevel < minVersion) {
			this.addWarning('minimum_css_version_' + minVersion, token);
		}
	}
};

exports.notForwardCompatible = function (badVersion) {
	return function (token) {
		if (this.parser.options.cssLevel <= badVersion) {
			this.addWarning('not_forward_compatible_' + badVersion, token);
		}
	};
};

exports.positiveValue = function () {
	return function (tokenOrObject) {
		var val = null;
		var token = null;

		if (typeof tokenOrObject.getValue == 'function') {
			// One of the "value" objects
			val = tokenOrObject.getValue();
			token = tokenOrObject.firstToken();
		} else {
			// Token, from tokenizer
			val = tokenOrObject.content;
			token = tokenOrObject;
		}

		if (val.toString().charAt(0) == '-') {
			this.addWarning('positive_value_required', token);
		}
	}
};

exports.suggestUsingRelativeUnits = function () {
	return function (token) {
		this.addWarning('suggest_using_relative_units', token);
	};
};

exports.workingDraft = function () {
	return function (token) {
		this.addWarning('working_draft', token);
	};
};

});

require.define("/css/values/hsla.js", function (require, module, exports, __dirname, __filename) {
/* hsla( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} {w})
 *
 * Used to define colors
 */

var base = require('./base');
var number = require('./number');
var percent = require('./percent');
var util = require('../../util');

var HSLA = base.baseConstructor();

util.extend(HSLA.prototype, base.base, {
	name: "hsla"
});

exports.parse = function (unparsed, parser, container) {
	var hsla = new HSLA(parser, container, unparsed);
	hsla.debug('parse', unparsed);

	if (! hsla.functionParser('hsla(', 
		[ number, percent ],
		[ number, percent ],
		[ number, percent ],
		number)) {
		return null;
	}

	// Make sure alpha is 0-1
	hsla.warnIfMixingPercents(hsla.list[0], [hsla.list[1], hsla.list[2], hsla[3]]);
	var alpha = hsla.list[4];
	alpha.content = hsla.warnIfOutsideRange(alpha, 0, 1);
	hsla.debug('parse success');
	return hsla;
};

});

require.define("/css/values/rgb.js", function (require, module, exports, __dirname, __filename) {
/* rgb( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} )
 *
 * Used to define colors
 */

var base = require('./base');
var number = require('./number');
var percent = require('./percent');
var util = require('../../util');

var RGB = base.baseConstructor();

util.extend(RGB.prototype, base.base, {
	name: "rgb"
});

exports.parse = function (unparsed, parser, container) {
	var rgb = new RGB(parser, container, unparsed);
	rgb.debug('parse', unparsed);

	if (! rgb.functionParser('rgb(', 
		[ number, percent ],
		[ number, percent ],
		[ number, percent ])) {
		return null;
	}

	rgb.warnIfMixingPercents(rgb.list[0], [rgb.list[1], rgb.list[2], rgb[3]]);
	rgb.debug('parse success');
	return rgb;
};

});

require.define("/css/values/rgba.js", function (require, module, exports, __dirname, __filename) {
/* rgba( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} {w})
 *
 * Used to define colors
 */

var base = require('./base');
var number = require('./number');
var percent = require('./percent');
var util = require('../../util');

var RGBA = base.baseConstructor();

util.extend(RGBA.prototype, base.base, {
	name: "rgba"
});

exports.parse = function (unparsed, parser, container) {
	var rgba = new RGBA(parser, container, unparsed);
	rgba.debug('parse', unparsed);
	
	if (! rgba.functionParser('rgba(', 
		[ number, percent ],
		[ number, percent ],
		[ number, percent ],
		number)) {
		return null;
	}

	// Make sure alpha is 0-1
	rgba.warnIfMixingPercents(rgba.list[0], [rgba.list[1], rgba.list[2], rgba[3]]);
	var alpha = rgba.list[4];
	alpha.content = rgba.warnIfOutsideRange(alpha, 0, 1);
	rgba.debug('parse success');
	return rgba;
};

});

require.define("/css/values/clear.js", function (require, module, exports, __dirname, __filename) {
/* clear
 *
 * CSS1:  none, left, right, both
 * CSS2:  inherit
 */
var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Clear = base.baseConstructor();

util.extend(Clear.prototype, base.base, {
	name: "clear",

	allowed: [
		{
			validation: [],
			values: [ 
				'none',
				'left',
				'right',
				'both'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(Clear);

});

require.define("/css/values/display.js", function (require, module, exports, __dirname, __filename) {
/* <display>
 *
 * In CSS1 - CSS2.1, it is just <display-type>
 * In CSS3 it is <display-type>? && <template>
 */

var base = require('./base');
var displayType = require('./display-type');
var template = require('./template');
var util = require('../../util');
var validate = require('./validate');

var Display = base.baseConstructor();

util.extend(Display.prototype, base.base, {
	name: "display"
});


exports.parse = function (unparsedReal, parser, container) {
	var display = new Display(parser, container, unparsedReal);
	var displayTypeCount = 0;
	var templateCount = 0;
	var result = true;
	var unparsed = display.unparsed.clone();

	while (unparsed.length() && result) {
		var result = displayType.parse(unparsed, parser, display);

		if (result) {
			displayTypeCount ++;
			
			if (parser.options.cssLevel < 3 && displayTypeCount > 1) {
				display.addWarning('display_multiple_types_css3', result.firstToken());
			}
		} else {
			result = template.parse(unparsed, parser, display);

			if (result) {
				templateCount ++;

				if (parser.options.cssLevel < 3) {
					display.addWarning('display_template_css3', result.firstToken());
				}
			}
		}

		if (result) {
			display.add(result);
			unparsed = result.unparsed.clone();
		}
	}

	if (displayTypeCount == 0 && templateCount == 0) {
		display.debug('parse fail');
		return null;
	}

	display.debug('parse success', unparsed);
	display.unparsed = unparsed;
	return display;
};

});

require.define("/css/values/display-type.js", function (require, module, exports, __dirname, __filename) {
/* <display-type>
 *
 * Per CSS3, this is just a list of possible values.
 */
var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var DisplayType = base.baseConstructor();

util.extend(DisplayType.prototype, base.base, {
	name: "display-type",

	allowed: [
		{
			validation: [],
			values: [ 
				'block',
				'inline',
				'list-item',
				'none'
			]
		},
		{
			validation: [
				validate.minimumCss(2),
				validate.maximumCss(2),
				validate.notForwardCompatible(2.1)
			],
			values: [
				"compact",
				"marker",
				"run-in"
			]
		},
		{
			validation: [
				validate.minimumCss(2),
				validate.browserUnsupported('IE7'),
				validate.browserQuirk('IE8') // !DOCTYPE required
			],
			values: [
				"inherit",
				"inline-table",
				"table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-row",
				"table-row-group"
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"table-footer-group",
				"table-header-group"
			]
		},
		{
			validation: [
				validate.minimumCss(2.1)
			],
			values: [
				"inline-block"
			]
		}
	]
});

exports.parse = base.simpleParser(DisplayType);

});

require.define("/css/values/template.js", function (require, module, exports, __dirname, __filename) {
/* <template>
 *
 * Used by <display> for creating templates
 * [ <string> [ / <row-height> ]? ]+ <col-width>*
 */

var base = require('./base');
var colWidth = require('./col-width');
var rowHeight = require('./row-height');
var util = require('../../util');

var Template = base.baseConstructor();

util.extend(Template.prototype, base.base, {
	name: "template",

	toString: function () {
		this.debug('toString');
		var out = [];

		this.rows.forEach(function (rowDef) {
			var rowOut = "";
			rowDef.forEach(function (rowDefPart) {
				rowOut += rowDefPart.toString();
			});
			out.push(rowOut);
		});

		this.columns.forEach(function (colDef) {
			out.push(colDef.toString());
		});

		return out.join(' ');
	}
});

exports.parse = function (unparsedReal, parser, container) {
	var template = new Template(parser, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	template.debug('parse', unparsed);
	template.rows = [];
	template.columns = [];
	template.addWarning('working_draft', unparsed.firstToken());

	// TODO:  Validate that number of columns are consistent
	// TODO:  Validate that there aren't more column widths than defined
	// TODO:  Should warn if fewer column widths are found (except 0 widths)
	// TODO:  If widths are all percentages, they must add to 100%, keeping
	// in mind that percentages are rounded
	// TODO:  Could trim * at end of column widths or add * to match columns
	while (unparsed.isType('STRING')) {
		// <string>
		var rowDef = [ unparsed.advance() ];

		// Look for the "/" - we might need to undo this
		if (unparsed.isContent('/')) {
			var unparsedBackup = unparsed.clone();
			var slashToken = unparsed.advance();
			var result = rowHeight.parse(unparsed, parser, template);

			if (result) {
				// Successful row height parsing
				rowDef.push(slashToken);
				rowDef.push(result.value);
				template.add(result.value);  // for warnings
				template.rows.push(rowDef);
				unparsed = result.unparsed.clone();
			} else {
				// Need to undo our changes to unparsed tokens
				unparsed = unparsedBackup;
			}
		} else {
			template.rows.push(rowDef);
		}
	}

	// Done parsing [ <string> [ / <row-height> ]? ]+
	if (template.rows.length == 0) {
		// Not a template - no strings found
		template.debug('parse fail');
		return null;
	}

	// Continue with <col-width>*
	var result = true;

	while (unparsed.length() && result) {
		result = colWidth.parse(unparsed, parser, template);

		if (result) {
			template.columns.push(result.value);
			template.add(result.value); // for warnings
			unparsed = result.unparsed.clone();
		}
	}

	template.debug('parse success', unparsed);
	return template;
};

});

require.define("/css/values/col-width.js", function (require, module, exports, __dirname, __filename) {
/* <col-width>
 *
 * CSS3 allows a non-negative <length>, "auto", "fit-content", "max-content",
 * "min-content", "*", or the minmax function (I'm implementing as <minmax>)
 * No other CSS versions do something like this that I've found
 */

var base = require('./base');
var length = require('./length');
var minmax = require('./minmax');
var util = require('../../util');
var validate = require('./validate');

var ColWidth = base.baseConstructor();

util.extend(ColWidth.prototype, base.base, {
	name: "col-width",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [ 
				"auto",
				"fit-content",
				"max-content",
				"min-content",
				"*",
				minmax
			]
		},
		{
			validation: [
				validate.minimumCss(3),
				validate.positiveValue()
			],
			values: [ 
				length
			]
		}
	]
});

exports.parse = base.simpleParser(ColWidth);

});

require.define("/css/values/length.js", function (require, module, exports, __dirname, __filename) {
/* <length>
 *
 * Lengths can be 0 (without a unit identifier) or a UNIT token that represents
 * either an absolute or relative length.
 */

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Length = base.baseConstructor();

util.extend(Length.prototype, base.base, {
	name: "length",

	allowed: [
		{
			validation: [],
			values: [ 
				"0",
				base.makeRegexp('[-+]?{n}(em|ex)')
			]
		},
		{
			validation: [
				validate.suggestUsingRelativeUnits()
			],
			values: [ 
				// px were made an absolute length as of CSS2.1
				base.makeRegexp('[-+]?{n}(in|cm|mm|pt|pc|px)')
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [ 
				base.makeRegexp('[-+]?{n}(ch|rem|vw|vh|vm)')
			]
		}
	],

	getValue: function () {
		return this.firstToken().content;
	}
});

exports.parse = base.simpleParser(Length);

});

require.define("/css/values/minmax.js", function (require, module, exports, __dirname, __filename) {
/* <minmax>
 *
 * Used by <col-width>
 * minmax( WS? p WS? , WS? q WS? )
 */

var base = require('./base');
var util = require('../../util');

var Minmax = base.baseConstructor();

util.extend(Minmax.prototype, base.base, {
	name: "minmax"
});


exports.parse = function (unparsed, parser, container) {
	var minmax = new Minmax(parser, container, unparsed);
	minmax.debug('parse', unparsed);

	if (! minmax.functionParser('minmax(',
		[ length, "max-content", "min-content", "*" ])) {
		return null;
	}

	// TODO:  If P > Q then assume minmax(P,P) - add warning
	minmax.debug('parse success', minmax.unparsed);
	(validate.minimumCss())(3);
	return minmax;
};

});

require.define("/css/values/row-height.js", function (require, module, exports, __dirname, __filename) {
/* <row-height>
 *
 * CSS3 allows a non-negative <length>, "auto" or "*"
 * No other CSS versions do something like this that I've found
 */

var base = require('./base');
var length = require('./length');
var util = require('../../util');
var validate = require('./validate');

var RowHeight = base.baseConstructor();

util.extend(RowHeight.prototype, base.base, {
	name: "row-height",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [ 
				"auto",
				"*"
			]
		},
		{
			validation: [
				validate.minimumCss(3),
				validate.positiveValue()
			],
			values: [ 
				length
			]
		}
	]
});

exports.parse = base.simpleParser(RowHeight);

});

require.define("/css/values/float.js", function (require, module, exports, __dirname, __filename) {
/* float
 *
 * CSS1:  left | right | none
 * CSS2:  left | right | none | inherit
 * CSS2.1:  Same as CSS2
 * CSS3:  [[ left | right | inside | outside ] || [ top | bottom ] || next ] ] | none | inherit
 */
var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Float = base.baseConstructor();

util.extend(Float.prototype, base.base, {
	name: "float"
});

exports.parse = function (unparsedReal, parser, container) {
	var f = new Float(parser, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	f.debug('parse', unparsed);
	var lrio = false;
	var tb = false;
	var n = false;
	var ni = false;
	var keepParsing = true;
	var css3 = false;

	while (keepParsing) {
		if (unparsed.isContent('left') || unparsed.isContent('right')) {
			if (ni || lrio) {
				return null;
			}

			lrio = true;
			f.add(unparsed.advance());
		} else if (unparsed.isContent('inside') || unparsed.isContent('outside')) {
			if (ni || lrio) {
				return null;
			}

			lrio = true;
			css3 = true;
			f.add(unparsed.advance());
		} else if (unparsed.isContent('top') || unparsed.isContent('bottom')) {
			if (ni || tb) {
				return null;
			}

			tb = true;
			css3 = true;
			f.add(unparsed.advance());
		} else if (unparsed.isContent('next')) {
			if (ni || n) {
				return null;
			}

			n = true;
			css3 = true;
			f.add(unparsed.advance());
		} else if (unparsed.isContent('none')) {
			if (ni || lrio || tb || n) {
				return null;
			}

			ni = true;
			f.add(unparsed.advance());
		} else if (unparsed.isContent('inherit')) {
			if (ni || lrio || tb || n) {
				return null;
			}

			ni = true;
			f.add(unparsed.advance());
			(validate.browserQuirk())('IE8'); // !DOCTYPE
			(validate.browserUnsupported())('IE7');
		} else {
			keepParsing = false;
		}
	}

	if (! f.list.length) {
		// No tokens parsed
		return null;
	}

	if (css3) {
		(validate.minimumCss())(3);
	}

	f.debug('parse success', unparsed);
	f.unparsed = unparsed;
	return f;
};

});

require.define("/css/values/font-size.js", function (require, module, exports, __dirname, __filename) {
/* <font-size>
 *
 * CSS1:  xx-small | x-small | small | medium | large | x-large | xx-large
 * CSS1:  larger | smaller | <length> | <percent>
 * CSS2:  inherit
 */
var base = require('./base');
var length = require('./length');
var percent = require('./percent');
var util = require('../../util');
var validate = require('./validate');

var FontSize = base.baseConstructor();

util.extend(FontSize.prototype, base.base, {
	name: "font-size",

	allowed: [
		{
			validation: [
				validate.positiveValue()
			],
			values: [ 
				length
			]
		},
		{
			validation: [],
			values: [ 
				// absolute
				base.makeRegexp('(x?x-)?(small|large)'),
				'medium',
				// relative
				'larger',
				'smaller',
				// Other options
				percent
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(FontSize);

});

require.define("/css/values/font-weight.js", function (require, module, exports, __dirname, __filename) {
/* <font-weight>
 *
 * CSS1:  normal | bold | bolder | lighter
 * CSS1:  100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
 * CSS2:  inherit
 */
var base = require('./base');
var length = require('./length');
var percent = require('./percent');
var util = require('../../util');
var validate = require('./validate');

var FontSize = base.baseConstructor();

// TODO:  "normal" == "400" and "bold" == "700"
util.extend(FontSize.prototype, base.base, {
	name: "font-size",

	allowed: [
		{
			validation: [],
			values: [ 
				'normal',
				'bold',
				'bolder',
				'lighter',
				base.makeRegexp('[0-9]00')
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(FontSize);

});

require.define("/css/values/height.js", function (require, module, exports, __dirname, __filename) {
/* <height>
 *
 * <length> | <percentage> | auto | inherit
 * CSS2.1 adds inherit
 */
var base = require('./base');
var length = require('./length');
var percent = require('./percent');
var util = require('../../util');
var validate = require('./validate');

var Height = base.baseConstructor();

util.extend(Height.prototype, base.base, {
	name: "display-type",

	allowed: [
		{
			validation: [
				validate.positiveValue()
			],
			values: [ 
				length
			]
		},
		{
			validation: [],
			values: [ 
				'auto'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [ 
				percent
			]
		},
		{
			validation: [
				validate.minimumCss(2.1)
			],
			values: [
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(Height);

});

require.define("/css/values/margin-width.js", function (require, module, exports, __dirname, __filename) {
/* <margin-width>
 *
 * Used for matching margin and margin-* properties.
 *
 * CSS1: <length> | <percentage> | auto
 * CSS2: inherit
 */
var base = require('./base');
var length = require('./length');
var percent = require('./percent');
var util = require('../../util');
var validate = require('./validate');

var MarginWidth = base.baseConstructor();

util.extend(MarginWidth.prototype, base.base, {
	name: "margin-width",

	allowed: [
		{
			validation: [],
			values: [ 
				length,
				percent,
				'auto'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'inherit'
			]
		}
	]
});

exports.parse = base.simpleParser(MarginWidth);

});

require.define("/css/values/text-align.js", function (require, module, exports, __dirname, __filename) {
/* text-align
 *
 * CSS1:  left | right | center | justify
 * CSS2:  <string> | inherit
 * CSS2.1:  Removed <string>
 * CSS3:  [ [ start | end | left | right | center ] || <string> ] | justify | match-parent | start end | inherit
 */
var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextAlign = base.baseConstructor();

util.extend(TextAlign.prototype, base.base, {
	name: "text-align"
});

exports.parse = function (unparsedReal, parser, container) {
	var textalign = new TextAlign(parser, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	textalign.debug('parse', unparsed);
	var selrc = false;
	var s = false;
	var jmsi = false;
	var keepParsing = true;
	var css3 = false;

	while (keepParsing) {
		if (unparsed.isContent('left') || unparsed.isContent('right') || unparsed.isContent('center')) {
			if (jmsi || selrc) {
				return null;
			}

			selrc = true;
			textalign.add(unparsed.advance());
		} else if (unparsed.isContent('justify') || unparsed.isContent('inherit')) {
			if (jmsi || s || selrc) {
				return null;
			}

			jmsi = true;
			textalign.add(unparsed.advance());
		} else if (unparsed.isType('STRING')) {
			if (jmsi || s) {
				return null;
			}

			var token = unparsed.advance();

			if (token.content.length > 1) {
				textalign.addWarning('invalid_string', token);
			}

			css3 = true;  // Yes, this could be CSS2, but not CSS2.1
			s = true;
			textalign.add(token);
		} else if (unparsed.isContent('match-parent')) {
			if (jmsi || selrc || s) {
				return null;
			}

			jmsi = true;
			css3 = true;
			textalign.add(unparsed.advance());
		} else if (unparsed.isContent('start')) {
			if (jmsi || selrc) {
				return null;
			}

			css3 = true;
			textalign.add(unparsed.advance());
			if (unparsed.isContent('end')) {
				textalign.add(unparsed.advance());
				jmsi = true;
			} else {
				selrc = true;
			}
		} else if (unparsed.isContent('end')) {
			if (jmsi || selrc) {
				return null;
			}

			selrc = true;
			css3 = true;
			textalign.add(unparsed.advance());
		} else {
			keepParsing = false;
		}
	}

	if (! textalign.list.length) {
		// No tokens parsed
		return null;
	}

	if (css3) {
		(validate.minimumCss())(3);
	}

	textalign.debug('parse success', unparsed);
	textalign.unparsed = unparsed;
	return textalign;
};

});

require.define("/css/values/width.js", function (require, module, exports, __dirname, __filename) {
/* <height>
 *
 * <length> | <percentage> | auto | inherit
 * CSS2.1 adds inherit
 */
var base = require('./base');
var length = require('./length');
var percent = require('./percent');
var util = require('../../util');
var validate = require('./validate');

var DisplayType = base.baseConstructor();

util.extend(DisplayType.prototype, base.base, {
	name: "display-type",

	allowed: [
		{
			validation: [
				validate.positiveValue()
			],
			values: [ 
				length
			]
		},
		{
			validation: [],
			values: [ 
				percent,
				'auto'
			]
		},
		{
			validation: [
				validate.minimumCss(2.1)
			],
			values: [
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(DisplayType);

});

require.define("/css/whitespace.js", function (require, module, exports, __dirname, __filename) {
var base = require('./base');
var util = require('../util');

var Whitespace = base.baseConstructor();

util.extend(Whitespace.prototype, base.base, {
	name: "whitespace",

	toString: function () {
		this.debug('toString', this.list);
		return "";
	}
});

exports.canStartWith = function (token, tokens) {
	return token.type == 'S';
};

exports.parse = function (tokens, parser, container) {
	var whitespace = new Whitespace(parser, container);
	whitespace.debug('parse', tokens);
	whitespace.add(tokens.getToken());
	tokens.next();
	return whitespace;
};

});

require.define("/tokenizer.js", function (require, module, exports, __dirname, __filename) {
var fs = require('fs');
var util = require('./util');
var wsPatternString = "[ \\t\\r\\n\\f]";

var expandPatternToRegExp = function (pattern, expansion) {
	// All tokens match the beginning of the string
	// Also match additional whitespace at the end
	pattern = "^" + pattern + "{w}";
	pattern = util.expandIntoRegExpPattern(pattern, expansion);

	// CSS is case insensitive, mostly
	return new RegExp(pattern, 'i');
};

var getTokenDefs = function () {
	var expansion = {
		escape: "{unicode}|\\\\([\\x20-\\x7e]|{nonascii})",
		h: "[0-9a-f]",
		ident: "[-]?{nmstart}{nmchar}*",
		name: "{nmchar}+",
		nl: "\\n|\\r\\n|\\r|\\f",
		nmchar: "[_a-z0-9-]|{nonascii}|{escape}",
		nmstart: "[_a-z]|{nonascii}|{escape}",
		nonascii: "[\\x80-\\xd7ff\\xe000\\xfffd]",  // Can't include \x10000-\x10ffff -- too high for JavaScript
		num: "[0-9]*\\.?[0-9]+",
		string: "\\\"({stringchar}|\\')*\\\"|\\'({stringchar}|\\\")*\\'",
		stringchar: "{urlchar}| |\\\\{nl}",
		unicode: "\\\\{h}{1,6}({nl}|{wc})?",
		urlchar: "[\\t\x21\x23-\x7e]|{nonascii}|{escape}",
		w: "{wc}*",
		wc: wsPatternString
	};

	// Sorted mostly by having frequently used tokens appear first
	//    leading:  If the first character is in this string, try the pattern
	//    all:  Include this pattern as a fallback if the per-letter matches
	//          do not provide a hit
	//    pattern:  String portion of the RegExp pattern
	var tokens = {
		// Doesn't ever match anything since .leading is "" and .all is false
		S: {
			leading: "",
			all: false,
			pattern: "{wc}+"
		},
		// These must appear before IDENT
		UNIT: {
			leading: ".0123456789-", 
			all: false,
			pattern: "[-+]?{num}({ident}|%)?"
		},  // All forms of numbers and units
		UNICODE_RANGE: {
			leading: "U", 
			all: false,
			pattern: "U\\+({h}|\\?){1,6}(-{h}{1,6})?"
		},

		CLASS: {
			leading: ".", 
			all: false,
			pattern: "\\.{ident}"
		},
		HASH: {
			leading: "#", 
			all: false,
			pattern: "#{name}"
		},
		ATTRIB: {
			leading: "[", 
			all: false,
			pattern: "\\[{w}{ident}{w}([~|^$*]?={w}({ident}|{string}){w})?{w}\\]"
		},
		AT_SYMBOL: {
			leading: "@", 
			all: false,
			pattern: "@{name}"
		},  // All @ symbols
		STRING: {
			leading: "\"'", 
			all: false,
			pattern: "{string}"
		},
		CDO: {
			leading: "<", 
			all: false,
			pattern: "<!--"
		},
		CDC: {
			leading: "-", 
			all: false,
			pattern: "-->"
		},
		COMMENT: {
			leading: "/", 
			all: false,
			pattern: "\\/\\*[^*]*\\*+([^/][^*]*\\*+)*\\/"
		},
		MATCH: {
			leading: "~|^$*=",
			all: false,
			pattern: "[~|^$*]?="
		},  // All of the matching tokens stay here
		BOM: {
			leading: "\xfeff", 
			all: false,
			pattern: "\xfeff"
		},  // Byte order mark
		IMPORTANT: {
			leading: "!",
			all: false,
			pattern: "!{w}important"
		},
		COMBINATOR: {
			leading: "~+>",
			all: false,
			pattern: "[~+>]"
		},
		OPERATOR: {
			leading: "/,",
			all: false,
			pattern: "[/,]"
		},
		COMMA: {
			leading: ",",
			all: false,
			pattern: ","
		},
		COLON: {
			leading: ":",
			all: false,
			pattern: ":"
		},
		SEMICOLON: {
			leading: ";",
			all: false,
			pattern: ";"
		},
		BLOCK_OPEN: {
			leading: "{",
			all: false,
			pattern: "\\{"
		},
		BLOCK_CLOSE: {
			leading: "}",
			all: false,
			pattern: "\\}"
		},
		PAREN_CLOSE: {
			leading: ")",
			all: false,
			pattern: "\\)"
		},
		URL: {
			leading: "uU",
			all: false,
			pattern: "url\\({w}({string}|{urlchar}*){w}\\)"
		},

		// Always test against these patterns
		FUNCTION: {
			leading: "", 
			all: true,
			pattern: "{ident}([\\.]{ident})*\\("
		},  // URI lands in here
		IDENT: {
			leading: "-",
			all: true,
			pattern: "{ident}"
		},
		CHAR: {
			leading: "",
			all: true,
			pattern: "[^'\"]"
		},  // Matches nearly anything - must be near the end
		UNMATCHED: {
			leading: "",
			all: true,
			pattern: "."
		}  // Must be last, shouldn't be hit with valid CSS
	};

	for (var t in tokens) {
		expansion[t] = tokens[t].pattern;
	}

	// Expand all RegExp strings, set initial count
	for (var t in tokens) {
		tokens[t].regexp = expandPatternToRegExp(tokens[t].pattern, expansion);
		tokens[t].count = 0;
	}

	return tokens;
};

var getDefsByLetter = function (tokens) {
	var out = {};
	var all = {};

	for (var tIndex in tokens) {
		var token = tokens[tIndex];
		var letters = token.leading.split('');

		for (var j = 0; j < letters.length; j ++) {
			var letter = letters[j];

			if (! out[letter]) {
				out[letter] = {};
			}
		
			if (! out[letter][tIndex]) {
				out[letter][tIndex] = token;
			}
		}

		if (token.all) {
			all[tIndex] = token;
		}
	}

	for (var letter in out) {
		for (var token in all) {
			out[letter][token] = all[token];
		}
	}

	out[''] = all;

	return out;
};

var defs = getTokenDefs();
var defsByLetter = getDefsByLetter(defs);

var Token = function (line, type, content) {
	this.line = line;
	this.type = type;
	this.content = content;
};

Token.prototype.toString = function () {
	return this.content;
};

var Tokenizer = function (options) {
	this.options = util.setOptions(options);
	this.tokenIndex = 0;
	this.tokens = [];
};

Tokenizer.prototype.addToken = function (line, type, content) {
	var token = new Token(line, type, content);
	this.tokens.push(token);
	defs[type].count ++;
	return content.split(/\r?\n|\r/g).length - 1;
};

Tokenizer.prototype.anyLeft = function () {
	if (this.tokenIndex < this.tokens.length) {
		return true;
	}

	return false;
};

Tokenizer.prototype.getToken = function (offset) {
	if (! offset) {
		offset = 0;
	}

	if (this.tokens[this.tokenIndex + offset]) {
		return this.tokens[this.tokenIndex + offset];
	}

	return null;
};

Tokenizer.prototype.next = function () {
	this.tokenIndex ++;
	return this;
};

Tokenizer.prototype.nextToken = function () {
	this.tokenIndex ++;
	return this.getToken();
};

Tokenizer.prototype.tokenCounts = function () {
	var out = {};

	for (var i in defs) {
		out[i] = defs[i].count;
	}

	return out;
};

Tokenizer.prototype.tokenize = function (str) {
	var match = '';
	var lineNumber = 1;
	var wsAtEnd = new RegExp(wsPatternString + '+$');
	var wsAtStart = new RegExp("^" + wsPatternString + "+");

	matches = str.match(wsAtStart);
	
	if (matches) {
		str = str.substr(matches[0].length);
		lineNumber += this.addToken(lineNumber, "S", matches[0]);
	}

	while (str.length) {
		// Blank out the info
		var type = null;
		var match = '';
		var defsToMatch = defsByLetter[''];
		var firstLetter = str.charAt(0);

		if (defsByLetter[firstLetter]) {
			defsToMatch = defsByLetter[firstLetter];
		}

		// Find the pattern that matches the best
		for (idx in defsToMatch) {
			if (type === null) {
				var matches = str.match(defsToMatch[idx].regexp);

				if (matches) {
					type = idx;
					match = matches[0];
				}
			}
		}

		str = str.substr(match.length);
		var ws = match.match(wsAtEnd);

		if (ws) {
			ws = ws[0];

			if (match != ws) {
				match = match.replace(wsAtEnd, '');
			} else {
				ws = null;
			}
		}

		lineNumber += this.addToken(lineNumber, type, match);

		if (ws) {
			lineNumber += this.addToken(lineNumber, "S", ws);
		}
	}
};

Tokenizer.prototype.toString = function () {
	var tokenList = [];

	this.tokens.forEach(function (token) {
		tokenList.push(JSON.stringify(token));
	});

	return "[\n" + tokenList.join(",\n") + "\n]";
};

exports.tokenize = function (str, options) {
	var cr = new Tokenizer(options);
	cr.tokenize(str);
	return cr;
};

exports.tokenizeFile = function (filename, callback, options) {
	options = util.setOptions(options);
	fs.readFile(filename, options.fileEncoding, function (err, data) {
		if (err) {
			callback(err);
		} else {
			cr = new Tokenizer(options);
			cr.tokenize(data);
			callback(err, cr);
		}
	});
};

});

require.define("fs", function (require, module, exports, __dirname, __filename) {
// nothing to see here... no file methods for the browser

});

require.define("/css/cdc.js", function (require, module, exports, __dirname, __filename) {
var base = require('./base');
var util = require('../util');

var CDC = base.baseConstructor();

util.extend(CDC.prototype, base.base, {
	name: 'cdc',

	toString: function () {
		this.debug('toString', this.list);
		return this.parser.options.cdc;
	}
});

exports.canStartWith = function (token, tokens) {
	return token.type == 'CDC';
};

exports.parse = function (tokens, parser, container) {
	var cdc = new CDC(parser, container);
	cdc.debug('parse', tokens);
	cdc.add(tokens.getToken());
	tokens.next();
	return cdc;
};

});

require.define("/css/cdo.js", function (require, module, exports, __dirname, __filename) {
var base = require('./base');
var util = require('../util');

var CDO = base.baseConstructor();

util.extend(CDO.prototype, base.base, {
	name: "cdo",
	
	toString: function () {
		this.debug('toString', this.list);
		return this.parser.options.cdo;
	}
});

exports.canStartWith = function (token, tokens) {
	return token.type == 'CDO';
};

exports.parse = function (tokens, parser, container) {
	var cdo = new CDO(parser, container);
	cdo.debug('parse', tokens);
	cdo.add(tokens.getToken());
	tokens.next();
	return cdo;
};

});

require.define("/css/ruleset.js", function (require, module, exports, __dirname, __filename) {
var base = require('./base');
var block = require('./block');
var declaration = require('./declaration');
var invalid = require('./invalid');
var selector = require('./selector');
var util = require('../util');

var Ruleset = base.baseConstructor();

util.extend(Ruleset.prototype, base.base, {
	name: "ruleset",
	
	toString: function () {
		this.debug('toString');
		var selAsStrings = [];
		var decAsStrings = [];

		this.selectors.forEach(function (sel) {
			selAsStrings.push(sel.toString());
		});

		out = selAsStrings.join(this.parser.options.selector_comma);
		out = this.addWhitespace('selector', out);

		if (this.block) {
			out += this.block.toString();
		}

		return this.addWhitespace('ruleset', out);
	}
});

exports.canStartWith = selector.canStartWith;

exports.parse = function (tokens, parser, container) {
	var ruleset = new Ruleset(parser, container);
	ruleset.debug('parse', tokens);

	// The current token is the first part of our selector
	ruleset.selectors = [];
	ruleset.block = null;
	ruleset.selectors.push(selector.parse(tokens, parser, ruleset));

	// Add additional selectors
	var nextToken = tokens.getToken();

	while (nextToken && nextToken.type == 'OPERATOR' && nextToken.content == ',') {
		// Consume comma
		nextToken = tokens.nextToken();

		if (nextToken.type == 'S') {
			nextToken = tokens.nextToken();
		}

		// After commas come another selector
		if (! selector.canStartWith(nextToken)) {
			base.unexpectedToken("expected_selector", nextToken);
		}

		ruleset.selectors.push(selector.parse(tokens, parser, ruleset));

		// Don't advance the token pointer - use getToken here
		nextToken = tokens.getToken();
	}

	if (nextToken && nextToken.type == "S") {
		nextToken = tokens.nextToken();
	}

	if (! nextToken || nextToken.type != 'BLOCK_OPEN') {
		parser.addError('block_expected', nextToken);
		var invalidCss = invalid.parse(null, parser, container);

		for (var s in ruleset.selectors) {
			invalidCss.addList(ruleset.selectors[s].list);
		}

		if (nextToken) {
			invalidCss.consume(tokens);
		}

		return invalidCss;
	}

	ruleset.block = block.parse(tokens, parser, ruleset);
	return ruleset;
};

});

require.define("/css/selector.js", function (require, module, exports, __dirname, __filename) {
var base = require('./base');
var invalid = require('./invalid');
var pseudoclass = require('./pseudoclass');
var pseudoelement = require('./pseudoelement');
var util = require('../util');

var Selector = base.baseConstructor();

util.extend(Selector.prototype, base.base, {
	name: "selector",

	toString: function () {
		this.debug('toString', this.list);
		var simpleSelectors = [];
		var building = "";
		var myself = this;

		var done = function () {
			if (building != "") {
				simpleSelectors.push(building);
				building = "";
			}
		};

		this.list.forEach(function (token) {
			switch (token.type) {
				case "S":
					done();
					break;

				case "COMBINATOR":
					building += myself.addWhitespace('combinator', token.content);
					break;

				default:
					building += token.toString();
			}
		});

		done();
		return simpleSelectors.join(this.parser.options.selector_whitespace);
	}
});

exports.canStartWith = function (token, tokens) {
	switch (token.type) {
		case "ATTRIB":
		case "CLASS":
		case "COLON":
		case "COMBINATOR":
		case 'HASH':
		case 'IDENT':
			return true;
	}

	return false;
};

exports.parse = function (tokens, parser, container) {
	var selector = new Selector(parser, container);
	selector.debug('parse', tokens);
	var token = tokens.getToken();

	while (token && (token.type == 'S' || exports.canStartWith(token))) {
		if (token.type == "COMBINATOR") {
			selector.add(token);
			token = tokens.nextToken();

			if (token && token.type == 'S') {
				token = tokens.nextToken();
			}

			if (! token || token.type == 'COMBINATOR' || ! exports.canStartWith(token)) {
				parser.addError('illegal_token_after_combinator', token);
				var invalidCss = invalid.parse(null, parser, container);
				invalidCss.addList(selector.list);
				invalidCss.consume(tokens);
				return invalidCss;
			}
		} else if (token.type == 'COLON') {
			var oldTokens = [ token ];
			var pseudoToUse = pseudoclass;
			var potentialError = 'ident_after_colon';
			token = tokens.nextToken();

			if (token && token.type == 'COLON') {
				potentialError = 'ident_after_double_colon';
				pseudoToUse = pseudoelement;
				oldTokens.push(token);
				token = tokens.nextToken();
			}

			if (! token || token.type != 'IDENT') {
				parser.addError(potentialError, token);
				var invalidCss = invalid.parse(null, parser, container);
				invalidCss.addList(selector.list);
				invalidCss.addList(oldTokens);
				invalidCss.consume(tokens);
				return invalidCss;
			}

			var pseudoCss = pseudoToUse.parse(tokens, parser, this);
			selector.add(pseudoCss);
			token = tokens.getToken();
		} else if (token.type == "S") {
			var nextToken = tokens.getToken(1);

			if (nextToken && nextToken.type != "COMBINATOR") {
				selector.add(token);
			}

			token = tokens.nextToken();
		} else {
			selector.add(token);
			token = tokens.nextToken();
		}
	}

	return selector;
};

});

require.define("/css/pseudoclass.js", function (require, module, exports, __dirname, __filename) {
var base = require('./base');
var util = require('../util');

var PseudoClass = base.baseConstructor();

util.extend(PseudoClass.prototype, base.base, {
	name: "pseudoclass",

	toString: function () {
		this.debug('toString', this.list);
		return ":" + this.list.join("");
	}
});

exports.canStartWith = function (token, tokens) {
	return token.type == "COLON";
};

exports.parse = function (tokens, parser, container) {
	var pseudo = new PseudoClass(parser, container);
	pseudo.debug('parse', tokens);
	var token = tokens.getToken();
	pseudo.add(token);
	tokens.next();
	return pseudo;
};

});

require.define("/css/pseudoelement.js", function (require, module, exports, __dirname, __filename) {
var base = require('./base');
var util = require('../util');

var PseudoElement = base.baseConstructor();

util.extend(PseudoElement.prototype, base.base, {
	name: "pseudoelement",

	toString: function () {
		this.debug('toString', this.list);
		return "::" + this.list.join("");
	}
});

exports.canStartWith = function (token, tokens) {
	return token.type == "COLON";
};

exports.parse = function (tokens, parser, container) {
	var pseudo = new PseudoElement(parser, container);
	pseudo.debug('parse', tokens);
	var token = tokens.getToken();
	pseudo.add(token);
	tokens.next();
	return pseudo;
};

});
