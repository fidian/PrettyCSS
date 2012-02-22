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
	},
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
		var keepGoing = true;

		for (var i = 0; i < this.length; i ++) {
			keepGoing = callback.call(context, this[i], i, this);
			if (! keepGoing) {
				return keepGoing;
			}
		}

		return keepGoing;
	};
}

if (! Array.prototype.forEach) {
	Array.prototype.forEach = function (callback, context) {
		for (var i = 0; i < this.length; i ++) {
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

		while (ptr.container) {
			lead += "....";
			ptr = ptr.container;
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
		comment_post: ""
	};

	return exports.extend({}, options, override);
};

// Extend an object with properties from subsequent objects
// Code based heavily on jQuery's version with far less error checking
exports.extend = (function (undefined) {
	var exProp = function (dest, name, src) {
		// Recurse if merging objects, but not arrays nor functions
		if (typeof src == "object" && ! src instanceof Function && ! src instanceof Array) {
			dest[name] = exObj(dest[name], src);
		} else if (src !== undefined) {
			dest[name] = src;
		}
	};

	var exObj = function () {
		var target = arguments[0] || {},
			i = 1,
			length = arguments.length;

		while (i < arguments.length) {
			var addMe = arguments[i];

			for (var name in addMe) {
				exProp(target, name, addMe[name]);
			}

			exProp(target, "constructor", addMe.constructor);
			exProp(target, "toString", addMe.toString);
			exProp(target, "valueOf", addMe.valueOf);

			i ++;
		}

		return target;
	};

	return exObj;
})();

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
	return declaration;
};

});

require.define("/css/property.js", function (require, module, exports, __dirname, __filename) {
var base = require('./base');
var util = require('../util');

var Property = base.baseConstructor();

util.extend(Property.prototype, base.base, {
	name: "property",

	toString: function () {
		this.debug('toString', this.list);
		return this.addWhitespace('property', this.list);
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

var Value = base.baseConstructor();

util.extend(Value.prototype, base.base, {
	important: false,
	name: "value",

	lastToken: function () {
		if (! this.list.length) {
			return null;
		}

		return this.list[this.list.length - 1];
	},

	/* Sets flags on the object if this has a priority */
	handlePriority: function () {
		var last = this.lastToken();

		if (last && last.type == "IMPORTANT") {
			this.list.pop();
			this.important = true;
			this.removeWhitespaceAtEnd();
		}
	},

	/* Whitespace at the end can be safely removed */
	removeWhitespaceAtEnd: function () {
		last = this.lastToken();

		if (last && last.type == "S") {
			this.list.pop();
		}
	},

	toString: function () {
		this.debug('toString', this.list);
		out = "";
		this.list.forEach(function (v) {
			if (v.content) {
				// Token object
				out += v.content;
			} else {
				// Block
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
	var subPat = /{([a-z][a-z0-9_]*)}/ig;
	pattern += "{w}";  // Also match additional whitespace at the end

	while (pattern.match(subPat)) {
		pattern = pattern.replace(subPat, function (str, p1) {
			if (expansion[p1]) {
				return "(" + expansion[p1] + ")";
			}

			throw "Invalid pattern referenced: " + p1;
		});
	}

	// All tokens match the beginning of the string
	// CSS is case insensitive, mostly
	return new RegExp("^" + pattern, 'i');
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
		num: "[0-9]+|[0-9]*\\.[0-9]+",
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
			pattern: "[-]?{num}({ident}|%)?"
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
