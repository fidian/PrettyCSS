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
"use strict";
require('./shim');
var cssBucket = require('./cssbucket');
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
		cssBucket.parser = this;
		cssBucket.options = this.options;
		cssBucket.tokenizer = tokenizer;
		this.stylesheet = cssBucket.stylesheet.parse(tokens, cssBucket, this);
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
"use strict";

if (! Array.prototype.every) {
	Array.prototype.every = function (callback, context) {
		var l = this.length >>> 0;
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

if (! Array.prototype.filter) {
	Array.prototype.filter = function (callback, context) {
		var l = this.length >>> 0;
		var t = Object(this);
		var newArray = [];

		for (var i = 0; i < l; i ++) {
			if (i in t) {
				var elem = this[i];  // In case the callback changes it
				if (callback.call(context, elem, i, this)) {
					newArray.push(elem);
				}
			}
		}

		return newArray;
	};
}

if (! Array.prototype.some) {
	Array.prototype.some = function (callback, context) {
		var l = this.length >>> 0;
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
		var l = this.length >>> 0;
		var t = Object(this);

		for (var i = 0; i < l; i ++) {
			if (i in t) {
				callback.call(context, this[i], i, this);
			}
		}
	};
}

});

require.define("/cssbucket.js", function (require, module, exports, __dirname, __filename) {
exports.atRule = require('./css/at-rule');
exports.block = require('./css/block');
exports.cdc = require('./css/cdc');
exports.cdo = require('./css/cdo');
exports.comment = require('./css/comment');
exports.fontface = require('./css/fontface');
exports.invalid = require('./css/invalid');
exports.property = require('./css/property');
exports.pseudoclass = require('./css/pseudoclass');
exports.pseudoelement = require('./css/pseudoelement');
exports.ruleset = require('./css/ruleset');
exports.rule = require('./css/rule');
exports.selector = require('./css/selector');
exports.stylesheet = require('./css/stylesheet');
exports.value = require('./css/value');
exports.whitespace = require('./css/whitespace');

});

require.define("/css/at-rule.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var base = require('./base');
var util = require('../util');

var At = base.baseConstructor();

util.extend(At.prototype, base.base, {
	name: "at-rule",

	toString: function () {
		this.debug('toString', this.list);
		var ws = this.bucket.options.at_whitespace;
		var out = "";

		this.list.forEach(function (value) {
			if (value.type == "S") {
				out += ws;
			} else {
				out += value.content;
			}
		});

		if (this.block) {
			out += this.block.toString();
		}

		return this.addWhitespace('at', out);
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == 'AT_SYMBOL';
};

exports.parse = function (tokens, bucket, container) {
	var at = new At(bucket, container);
	at.block = null;
	at.debug('parse', tokens);
	var token = tokens.getToken();

	if (token) {
		var type = token.content.toLowerCase();
	}

	// Eat until the first semicolon or the ending of a block
	while (token && token.type != 'SEMICOLON' && token.type != 'BLOCK_OPEN') {
		at.add(token);
		token = tokens.nextToken();
	}

	if (! token) {
		// Finished without hitting a semicolon nor a block
		return at;
	}

	if (token.type == 'SEMICOLON') {
		at.add(token);
		tokens.next();
		return at;
	}

	at.block = bucket.block.parse(tokens, bucket, at);

	switch (type) {
		case '@font-face':
			// Add a font
			at.block.reparseAs('fontface');
			break;

		case '@media':
			// Stylesheet parser
			at.block.reparseAs('stylesheet');
			break;

		default:
			at.debug('Invalid type, so no block parsing for ' + type);
			break;
	}

	return at;
};

});

require.define("/css/base.js", function (require, module, exports, __dirname, __filename) {
"use strict";

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
		var opt = this.bucket.options;
		var out = this.makeString(data);
		return opt[type + '_pre'] + out + opt[type + '_post'];
	},

	convertToString: function (token) {
		// Check if it is a token
		if (token.type && token.line) {
			return token.type + "@" + token.line + ":" + JSON.stringify(token.content);
		}

		// It is probably one of our value objects
		// Avoid the "toString" method since that also calls debug
		var out = token.name;

		if (token.list instanceof Array) {
			out += '(' + token.list.length + ')';
		}

		return out;
	},

	debug: function (message, info) {
		if (! this.bucket.options.debug) {
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
				// Tokenizer object - safe to call toString()
				message += "\n" + JSON.stringify(info.getToken().toString());
			} else if (info instanceof Array) {
				// Array of tokens or CSS objects
				var outArr = [];
				message += "\narray(" + info.length + ")";
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

		this.bucket.parser.debug(message);
	},

	init: function () {
		this.container = null;
		this.list = [];
		this.bucket = null;
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

		var failed = this.parseTokenList.every(function (typeString) {
			var type = typeString;

			if (myself.bucket[typeString]) {
				type = myself.bucket[typeString];
			}

			if (type.canStartWith(token, tokens, myself.bucket)) {
				myself.add(type.parse(tokens, myself.bucket, myself));

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
		var indent = this.bucket.options.indent;

		if (! indent) {
			return str;
		}

		return str.replace(/\n/g, "\n" + indent);
	},

	setBucket: function (bucket) {
		if (! bucket) {
			throw new Error("Invalid bucket");
		}

		this.bucket = bucket;
	},

	setContainer: function (container) {
		if (! container) {
			throw new Error("Invalid container");
		}

		this.container = container;
	},

	toString: function () {
		throw new Error("Did not override toString() of base class");
	}
};

exports.baseConstructor = function () {
	return function (bucket, container) {
		this.init();
		this.setBucket(bucket);
		this.setContainer(container);
		return this;
	};
};

exports.selectorCanStartWith = function (token, tokens, bucket) {
	switch (token.type) {
		case "ATTRIB":
		case "CLASS":
		case "COLON":
		case "COMBINATOR":
		case 'HASH':
		case 'IDENT':
			return true;

		default:
			return false;
	}
};

});

require.define("/util.js", function (require, module, exports, __dirname, __filename) {
"use strict";

exports.setOptions = function (override) {
	if (typeof override != "object") {
		override = {};
	}

	var options = {
		debug: false,
		autocorrect: true,
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

require.define("/css/block.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var base = require('./base');
var util = require('../util');

// Do not use base.baseConstructor() since container is optional here
var Block = function (bucket, container) {
	this.init();
	this.setBucket(bucket);

	if (container) {
		this.setContainer(container);
	}

	return this;
};

util.extend(Block.prototype, base.base, {
	name: "block",

	reparseAs: function (anotherThing) {
		this.debug('reparse as ' + anotherThing, this.list);
		var tempTokenizer = this.bucket.tokenizer.tokenize('', this.bucket.options);
		tempTokenizer.tokens = this.list;
		this.list = [
			this.bucket[anotherThing].parse(tempTokenizer, this.bucket, this)
		];
		this.debug('reparse finish', this.list);
	},

	toString: function () {
		this.debug('toString', this.list);
		var out = this.makeString(this.list);
		out = this.reindent(out);
		out = this.addWhitespace('block', out);
		return out;
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == 'BLOCK_OPEN';
};

exports.parse = function (tokens, bucket, container) {
	var block = new Block(bucket, container);
	var depth = 1;
	block.debug('parse', tokens);

	// Consume open brace
	tokens.next();

	while (tokens.anyLeft()) {
		var token = tokens.getToken();

		if (token.type == 'BLOCK_CLOSE') {
			depth --;

			if (! depth) {
				// Done with this block
				tokens.next();
				return block;
			}
		} else if (token.type == 'BLOCK_OPEN') {
			depth ++;
		}

		block.add(token);
		tokens.next();
	}

	return block;
};

});

require.define("/css/cdc.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var base = require('./base');
var util = require('../util');

var CDC = base.baseConstructor();

util.extend(CDC.prototype, base.base, {
	name: 'cdc',

	toString: function () {
		this.debug('toString', this.list);
		return this.bucket.options.cdc;
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == 'CDC';
};

exports.parse = function (tokens, bucket, container) {
	var cdc = new CDC(bucket, container);
	cdc.debug('parse', tokens);
	cdc.add(tokens.getToken());
	tokens.next();
	return cdc;
};

});

require.define("/css/cdo.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var base = require('./base');
var util = require('../util');

var CDO = base.baseConstructor();

util.extend(CDO.prototype, base.base, {
	name: "cdo",
	
	toString: function () {
		this.debug('toString', this.list);
		return this.bucket.options.cdo;
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == 'CDO';
};

exports.parse = function (tokens, bucket, container) {
	var cdo = new CDO(bucket, container);
	cdo.debug('parse', tokens);
	cdo.add(tokens.getToken());
	tokens.next();
	return cdo;
};

});

require.define("/css/comment.js", function (require, module, exports, __dirname, __filename) {
"use strict";

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

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == 'COMMENT';
};

exports.parse = function (tokens, bucket, container) {
	var comment = new Comment(bucket, container);
	comment.debug('parse', tokens);
	comment.add(tokens.getToken());
	tokens.next();
	return comment;
};

});

require.define("/css/fontface.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var base = require('./base');
var declarationBucket = require('./declarationbucket');
var util = require('../util');

var FontFace = base.baseConstructor();

util.extend(FontFace.prototype, base.base, {
	name: "fontface",

	parseTokenList: [
		'comment',
		'whitespace',
		declarationBucket.fontface,
		'invalid' // Must be last
	],

	toString: function () {
		this.debug('toString');

		var out = '';

		this.list.forEach(function (item) {
			out += item.toString();
		});

		return out;
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return false;  // Should not be used in auto-detection
};

exports.parse = function (tokens, bucket, container) {
	var ff = new FontFace(bucket, container);
	ff.debug('parse', tokens);

	if (! bucket.parser.options.cssLevel || bucket.parser.options.cssLevel == 2.1) {
		bucket.parser.addWarning('css-unsupported:2.1', tokens.getToken());
	}

	while (tokens.anyLeft()) {
		ff.parseTokens(tokens);
	}

	return ff;
};

});

require.define("/css/declarationbucket.js", function (require, module, exports, __dirname, __filename) {
exports.fontface = require('./declarations/fontface');
exports.rule = require('./declarations/rule');

});

require.define("/css/declarations/fontface.js", function (require, module, exports, __dirname, __filename) {
// TODO:  Must specify font-family
// TODO:  Must specify src
// TODO:  inherit is not allowed

"use strict";

var base = require('./base');
var util = require('../../util');

// Mapping properties to value types
var propertyMapping = {
	'font-family': 'font-face-font-family',
	'font-style': 'font-face-font-style',
	'font-variant': 'font-face-font-variant'
};

var Declaration = base.baseConstructor();

util.extend(Declaration.prototype, base.base, {
	name: "declaration-fontface"
});


exports.canStartWith = base.canStartWith;
exports.parse = base.declarationParser(Declaration, propertyMapping);

});

require.define("/css/declarations/base.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var cssBase = require('../base');
var util = require('../../util');
var valueBucket = require('../valuebucket');


var canStartWith = function (token, tokens, bucket) {
	// Needs to match property + S* + COLON
	if (! bucket.property.canStartWith(token, tokens, bucket)) {
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

	return false;
};


var getParser = function (fromMe) {
	switch (typeof fromMe) {
		case 'function':  // eg. simpleWarningFunction('unofficial')
			return fromMe;

		case 'string':  // 'border-single'
			if (! valueBucket[fromMe]) {
				throw new Error('Invalid valueBucket property: ' + fromMe);
			}
			if (! valueBucket[fromMe].parse) {
				throw new Error('Parser not defined for valueBucket[' + fromMe + ']');
			}
			return valueBucket[fromMe].parse;

		default:
			throw new Error('Unhandled "getParser" scenario: ' + typeof fromMe);
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


var remakeProperties = function (inObj) {
	var outObj = {};

	for (var name in inObj) {
		outObj[name] = getParser(inObj[name]);
	}

	return outObj;
};


var parser = function (Declaration, propertyMapping) {
	propertyMapping = remakeProperties(propertyMapping);
	return function (tokens, bucket, container) {
		var declaration = new Declaration(bucket, container);
		declaration.debug('parse', tokens);

		declaration.property = bucket.property.parse(tokens, bucket, declaration);
		var nextToken = tokens.getToken();

		if (! nextToken || nextToken.type != "COLON") {
			bucket.parser.addError('colon-expected', nextToken);
			var invalidCss = bucket.invalid.parse(null, bucket, container);
			invalidCss.addList(declaration.property.list);
			invalidCss.consume(tokens);
			return invalidCss;
		}

		tokens.next();
		declaration.value = bucket.value.parse(tokens, bucket, declaration);

		// See if we can map properties to something we can validate
		var propertyName = declaration.property.getPropertyName().toLowerCase();

		if (! propertyMapping[propertyName]) {
			// Not a known property
			bucket.parser.addWarning('unknown-property:' + propertyName, declaration.property.list[0]);
			return declaration;
		}

		if (declaration.value.getLength() === 0) {
			bucket.parser.addWarning("require-value", declaration.property.list[0]);
			return declaration;
		}

		// Attempt to map the value
		valueBucket.setCssBucket(bucket);
		valueBucket.setDeclaration(declaration);
		var valueParser = propertyMapping[propertyName];
		var result = valueParser(declaration.value.getTokens(), valueBucket, declaration);

		if (! result) {
			// Value did not match expected patterns
			var tokenForError = declaration.value.firstToken();

			if (! tokenForError) {
				tokenForError = declaration.property.list[0];
			}

			bucket.parser.addWarning("invalid-value", tokenForError);
			return declaration;
		}

		result.doWarnings();

		if (result.unparsed.length()) {
			bucket.parser.addWarning("extra-tokens-after-value", result.unparsed.firstToken());
		}

		declaration.value.setTokens([ result, result.unparsed ]);
		return declaration;
	};
};


var simpleWarningFunction = function (warning) {
	return function (actualParser, extra) {
		var realParser = getParser(actualParser);
		return function (unparsedReal, bucket, container) {
			var obj = realParser(unparsedReal, bucket, container);

			if (obj) {
				if ('undefined' != typeof useInstead) {
					warning += ':' + useInstead;
				}

				obj.addWarning(warning, bucket.propertyToken);
			}

			return obj;
		};
	};
};


exports.base = {};

util.extend(exports.base, cssBase.base, {
	name: 'declaration-base',

	toString: function () {
		this.debug('toString');
		var out = this.property.toString();
		out += ":";
		out += this.value.toString();
		out += ":";
		return this.addWhitespace("declaration", out);
	}
});

exports.baseConstructor = cssBase.baseConstructor;
exports.canStartWith = canStartWith;
exports.declarationParser = parser;
exports.deprecated = simpleWarningFunction('deprecated');
exports.unofficial = simpleWarningFunction('unofficial');
exports.wrongProperty = simpleWarningFunction('wrong-property');

});

require.define("/css/valuebucket.js", function (require, module, exports, __dirname, __filename) {
exports['angle'] = require('./values/angle');
exports['attr'] = require('./values/attr');
exports['background-attachment'] = require('./values/background-attachment');
exports['background-clip'] = require('./values/background-clip');
exports['background-color'] = require('./values/background-color');
exports['background-image'] = require('./values/background-image');
exports['background'] = require('./values/background');
exports['background-origin'] = require('./values/background-origin');
exports['background-position'] = require('./values/background-position');
exports['background-repeat'] = require('./values/background-repeat');
exports['background-size'] = require('./values/background-size');
exports['bg-attachment'] = require('./values/bg-attachment');
exports['bg-box'] = require('./values/bg-box');
exports['bg-image'] = require('./values/bg-image');
exports['bg-layer'] = require('./values/bg-layer');
exports['bg-position'] = require('./values/bg-position');
exports['bg-repeat'] = require('./values/bg-repeat');
exports['bg-size'] = require('./values/bg-size');
exports['border-collapse'] = require('./values/border-collapse');
exports['border-color'] = require('./values/border-color');
exports['border-color-single'] = require('./values/border-color-single');
exports['border-radius'] = require('./values/border-radius');
exports['border-radius-single'] = require('./values/border-radius-single');
exports['border-single'] = require('./values/border-single');
exports['border-spacing'] = require('./values/border-spacing');
exports['border-style'] = require('./values/border-style');
exports['border-style-single'] = require('./values/border-style-single');
exports['border-width'] = require('./values/border-width');
exports['border-width-single'] = require('./values/border-width-single');
exports['box-shadow'] = require('./values/box-shadow');
exports['box-shadow-single'] = require('./values/box-shadow-single');
exports['clear'] = require('./values/clear');
exports['color'] = require('./values/color');
exports['col-width'] = require('./values/col-width');
exports['content'] = require('./values/content');
exports['counter'] = require('./values/counter');
exports['cursor'] = require('./values/cursor');
exports['cursor-keyword'] = require('./values/cursor-keyword');
exports['display'] = require('./values/display');
exports['display-type'] = require('./values/display-type');
exports['filter'] = require('./values/filter');
exports['float'] = require('./values/float');
exports['font-face-annotation'] = require('./values/font-face-annotation');
exports['font-face-caps-values'] = require('./values/font-face-caps-values');
exports['font-face-character-variant'] = require('./values/font-face-character-variant');
exports['font-face-common-lig-values'] = require('./values/font-face-common-lig-values');
exports['font-face-contextual-lig-values'] = require('./values/font-face-contextual-lig-values');
exports['font-face-discretionary-lig-values'] = require('./values/font-face-discretionary-lig-values');
exports['font-face-east-asian-variant-values'] = require('./values/font-face-east-asian-variant-values');
exports['font-face-east-asian-width-values'] = require('./values/font-face-east-asian-width-values');
exports['font-face-font-family'] = require('./values/font-face-font-family');
exports['font-face-font-style'] = require('./values/font-face-font-style');
exports['font-face-font-variant'] = require('./values/font-face-font-variant');
exports['font-face-historical-lig-values'] = require('./values/font-face-historical-lig-values');
exports['font-face-numeric-figure-values'] = require('./values/font-face-numeric-figure-values');
exports['font-face-numeric-fraction-values'] = require('./values/font-face-numeric-fraction-values');
exports['font-face-numeric-spacing-values'] = require('./values/font-face-numeric-spacing-values');
exports['font-face-ornaments'] = require('./values/font-face-ornaments');
exports['font-face-styleset'] = require('./values/font-face-styleset');
exports['font-face-stylistic'] = require('./values/font-face-stylistic');
exports['font-face-swash'] = require('./values/font-face-swash');
exports['font-family-generic-name'] = require('./values/font-family-generic-name');
exports['font-family'] = require('./values/font-family');
exports['font-family-name'] = require('./values/font-family-name');
exports['font-family-single'] = require('./values/font-family-single');
exports['font'] = require('./values/font');
exports['font-size'] = require('./values/font-size');
exports['font-style'] = require('./values/font-style');
exports['font-variant-css21'] = require('./values/font-variant-css21');
exports['font-weight'] = require('./values/font-weight');
exports['height'] = require('./values/height');
exports['hsla'] = require('./values/hsla');
exports['hsl'] = require('./values/hsl');
exports['ident'] = require('./values/ident');
exports['length'] = require('./values/length');
exports['line-height'] = require('./values/line-height');
exports['list-style-image'] = require('./values/list-style-image');
exports['list-style'] = require('./values/list-style');
exports['list-style-position'] = require('./values/list-style-position');
exports['list-style-type'] = require('./values/list-style-type');
exports['margin'] = require('./values/margin');
exports['margin-width'] = require('./values/margin-width');
exports['max-length'] = require('./values/max-length');
exports['min-length'] = require('./values/min-length');
exports['minmax'] = require('./values/minmax');
exports['ms-progress-appearance'] = require('./values/ms-progress-appearance');
exports['number'] = require('./values/number');
exports['offset'] = require('./values/offset');
exports['opacity'] = require('./values/opacity');
exports['outline-color'] = require('./values/outline-color');
exports['outline'] = require('./values/outline');
exports['outline-style'] = require('./values/outline-style');
exports['outline-width'] = require('./values/outline-width');
exports['overflow-dimension'] = require('./values/overflow-dimension');
exports['overflow'] = require('./values/overflow');
exports['padding'] = require('./values/padding');
exports['padding-width'] = require('./values/padding-width');
exports['percentage'] = require('./values/percentage');
exports['position'] = require('./values/position');
exports['rgba'] = require('./values/rgba');
exports['rgb'] = require('./values/rgb');
exports['row-height'] = require('./values/row-height');
exports['string'] = require('./values/string');
exports['template'] = require('./values/template');
exports['text-align'] = require('./values/text-align');
exports['text-decoration-blink'] = require('./values/text-decoration-blink');
exports['text-decoration-color'] = require('./values/text-decoration-color');
exports['text-decoration-css2'] = require('./values/text-decoration-css2');
exports['text-decoration-css3'] = require('./values/text-decoration-css3');
exports['text-decoration-css3-line'] = require('./values/text-decoration-css3-line');
exports['text-decoration'] = require('./values/text-decoration');
exports['text-decoration-style'] = require('./values/text-decoration-style');
exports['text-indent'] = require('./values/text-indent');
exports['text-overflow'] = require('./values/text-overflow');
exports['text-shadow'] = require('./values/text-shadow');
exports['text-transform-case'] = require('./values/text-transform-case');
exports['text-transform'] = require('./values/text-transform');
exports['unparsed'] = require('./values/unparsed');
exports['url'] = require('./values/url');
exports['vertical-align'] = require('./values/vertical-align');
exports['visibility'] = require('./values/visibility');
exports['white-space'] = require('./values/white-space');
exports['width'] = require('./values/width');
exports['z-index'] = require('./values/z-index');
exports['zoom'] = require('./values/zoom');

exports.setCssBucket = function (cssBucket) {
	exports.cssBucket = cssBucket;
	exports.parser = cssBucket.parser;
	exports.options = cssBucket.options;
};

exports.setDeclaration = function (declaration) {
	exports.declaration = declaration;
	exports.propertyToken = declaration.property.list[0];
};


});

require.define("/css/values/angle.js", function (require, module, exports, __dirname, __filename) {
/* <angle>
 *
 * Angles can be [ 0 - 360 ) (zero inclusive through 360 non-inclusive).
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Angle = base.baseConstructor();

util.extend(Angle.prototype, base.base, {
	name: "angle",

	allowed: [
		{
			validation: [
				validate.angle()
			],
			values: [ 
				"0",
				base.makeRegexp('[-+]?{n}')
			]
		}
	],

	getValue: function () {
		return +(this.firstToken().content);
	},

	setValue: function (newValue) {
		this.firstToken().content = newValue.toString();
	}
});

exports.parse = base.simpleParser(Angle);

});

require.define("/css/values/base.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var util = require('../../util');
var validate = require('./validate');

exports.base = {
	add: function (t) {
		this.list.push(t);
	},

	addWarning: function (warningCode, token) {
		this.warningList.push([warningCode, token]);
	},

	debug: function (message, tokens) {
		if (! this.bucket.options.debug) {
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
		this.bucket.parser.debug(message);

		if (typeof tokens != "undefined") {
			if (typeof tokens.getTokens != "undefined") {
				this.bucket.parser.debug(tokens.getTokens());
			} else {
				this.bucket.parser.debug(tokens);
			}
		}
	},

	doWarnings: function () {
		var myself = this;
		this.warningList.forEach(function (warningInfo) {
			myself.bucket.parser.addWarning.apply(myself.bucket.parser, warningInfo);
		});

		this.list.forEach(function (item) {
			if (item.doWarnings instanceof Function) {
				item.doWarnings();
			}
		});
	},

	firstToken: function () {
		if (this.list.length) {
			if (this.list[0].firstToken) {
				return this.list[0].firstToken();
			}

			return this.list[0];
		}

		return null;
	},

	fontValidation: function (hitsForCss2Only) {
		var token = this.firstToken();

		if (hitsForCss2Only && hitsForCss2Only > 1) {
			validate.call(this, 'notForwardCompatible', token, 3);
		}

		validate.call(this, 'minimumCss', token, 2);
		validate.call(this, 'unsupportedCss', token, 2.1);
		this.warnIfInherit();
	},

	functionParser: function () {
		if (arguments.length < 1) {
			// Must have function name
			return null;
		}

		var args = Array.prototype.slice.call(arguments);
		var matchCount = 0;
		var listToAdd = [];
		var unparsedCopy = this.unparsed.clone();
		this.isFunction = true;

		while (args.length) {
			if (matchCount > 1) {
				// No comma after function name and first argument
				if (! unparsedCopy.isTypeContent('OPERATOR', ',')) {
					return false;
				}

				unparsedCopy.advance();  // Skip comma and possibly whitespace
			}

			var parsed = unparsedCopy.matchAny(args.shift(), this);

			if (! parsed) {
				return false;
			}

			unparsedCopy = parsed.unparsed;
			listToAdd.push(parsed);
			matchCount ++;
		}

		if (! unparsedCopy.isTypeContent('PAREN_CLOSE', ')')) {
			return false;
		}

		unparsedCopy.advance();  // Skip the close parenthesis
		this.unparsed = unparsedCopy;
		var myself = this;
		listToAdd.forEach(function (item) {
			myself.add(item);
		});

		return true;
	},

	handleAll: function () {
		if (this.unparsed.isContent('all')) {
			this.add(this.unparsed.advance());
			validate.call(this, 'minimumCss', this.firstToken(), 2);
			validate.call(this, 'maximumCss', this.firstToken(), 2);
			validate.call(this, 'notForwardCompatible', this.firstToken(), 3);
			return true;
		}

		return false;
	},
	
	handleInherit: function (validator) {
		if (this.unparsed.isContent('inherit')) {
			this.add(this.unparsed.advance());

			if (typeof validator == 'undefined') {
				validate.call(this, 'minimumCss', this.firstToken(), 2);
			} else {
				validator(this);
			}
			
			return true;
		}

		return false;
	},

	isInherit: function () {
		// Check if any are "inherit"
		var token = null;
		return this.list.some(function (value) {
			// If a "value" object
			if (value.isInherit) {
				token = value.isInherit();
				return !! token;
			}

			// Must be a token
			if (value.content.toLowerCase() == 'inherit') {
				token = value;
				return true;
			}

			return false;
		});
	},

	repeatParser: function (possibilities, maxHits) {
		var myself = this;
		var matches = [];
		var keepGoing = true;

		if (! (possibilities instanceof Array)) {
			possibilities = [ possibilities ];
		}

		while (keepGoing && this.unparsed.length()) {
			var matchedSomething = false;

			// Copy the unparsed tokens in case the comma + parser fail
			var unparsedCopy = this.unparsed.clone();

			if (this.repeatWithCommas && matches.length > 0) {
				if (this.unparsed.isTypeContent('OPERATOR', ',')) {
					this.unparsed.advance();
				} else {
					keepGoing = false;
				}
			}

			if (keepGoing && possibilities.some(function (tryMe) {
				var result = myself.unparsed.match(tryMe, myself);

				if (result) {
					matches.push(result);
					myself.unparsed = result.unparsed;
					return true;
				}

				return false;
			})) {
				// Parsed one successfully
				matchedSomething = true;
			}

			if (! matchedSomething) {
				// Restore if we didn't get a comma + valid thing
				this.unparsed = unparsedCopy;
				keepGoing = false;
			}

			if (maxHits && matches.length >= maxHits) {
				keepGoing = false;
			}
		}

		matches.forEach(function (item) {
			myself.add(item);
		});
		return matches.length;
	},

	scanRules: function () {
		var firstToken = this.unparsed.firstToken();
		var myBucket = this.bucket;

		if (! firstToken) {
			this.debug('parse fail - no tokens');
			return null;
		}

		var tokenContent = firstToken.content.toLowerCase();
		var rules = this.allowed;

		for (var i = 0; i < rules.length; i ++) {
			var rule = rules[i];

			if (! rule.values) {
				rule.values = [];
			}

			if (rule.valueObjects) {
				rule.valueObjects.forEach(function (objectName) {
					rule.values.push(myBucket[objectName]);
				});
				rule.valueObjects = null;
			}
			
			for (var j = 0; j < rule.values.length; j ++) {
				var result = this.testRuleValue(rule.values[j], tokenContent, rule);

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

	testRuleValueSuccess: function (rule) {
		var token = this.unparsed.advance();
		this.add(token);
		this.testRuleValidation(rule, token);
		return this;
	},

	testRuleValue: function (value, tokenContent, rule) {
		if (value instanceof RegExp) {
			this.debug('testRuleValue vs RegExp ' + value.toString());

			if (value.test(tokenContent)) {
				return this.testRuleValueSuccess(rule);
			}
		} else if (value.parse instanceof Function) {
			this.debug('testRuleValue vs func ' + value.toString());
			var ret = value.parse(this.unparsed, this.bucket, this);

			if (ret) {
				this.add(ret);
				this.testRuleValidation(rule, ret);
				this.unparsed = ret.unparsed;
				return this;
			}
		} else {
			this.debug('testRuleValue vs string ' + value.toString());

			if (value == tokenContent) {
				return this.testRuleValueSuccess(rule);
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
			out = fn + out.join(this.bucket.options.functionComma) + ')';
		} else if (this.repeatWithCommas) {
			out = out.join(this.bucket.options.functionComma);

			if (this.bucket.options.valuesLowerCase) {
				out = out.toLowerCase();
			}
		} else {
			out = out.join(' ');  // TODO: configurable whitespace?

			if (this.bucket.options.valuesLowerCase) {
				out = out.toLowerCase();
			}
		}

		return out;
	},

	validateColorValues: function (list) {
		var myself = this;
		var firstOne = this.list[0];
		var firstThree = this.list.slice(1, 4);
		this.warnIfMixingPercents(firstOne, firstThree);

		// The first three will be numbers or percents
		// Values must be positive and between 0-100% or 0-255
		firstThree.forEach(function (token) {
			if (token.name == 'number') {
				myself.warnIfNotInteger(token, token.getValue());
				token.setValue(Math.round(token.getValue()));
				token.setValue(myself.warnIfOutsideRange(token.firstToken(), 0, 255, token.getValue()));
			} else {
				// Percents all must be integers, so the
				// warning is in that object instead
				token.setValue(myself.warnIfOutsideRange(token.firstToken(), 0, 100, token.getValue()));
			}
		});

		// The last one, if it exists, is the alpha
		if (this.list.length < 5) {
			return;
		}

		var alpha = this.list[4];
		alpha.setValue(this.warnIfOutsideRange(alpha, 0, 1, alpha.getValue()));
	},

	warnIfInherit: function () {
		var token = this.isInherit();

		if (token) {
			this.addWarning('inherit-not-allowed', token);
		}
	},

	warnIfMixingPercents: function (token, valueList) {
		var listCountPercent = 0;

		valueList.forEach(function (val) {
			if (val.name == 'percentage') {
				listCountPercent ++;
			}
		});

		if (listCountPercent !== 0 && listCountPercent != valueList.length) {
			this.addWarning('mixing-percentages', token);
		}
	},

	warnIfNotInteger: function (token, value) {
		if (arguments.length < 2) {
			value = token.content;
		}

		if (! (/^[-+]?[0-9]+$/).test(value)) {
			this.addWarning('require-integer', token);
		}
	},

	warnIfOutsideRange: function (token, min, max, value) {
		if (arguments.length < 4) {
			value = token.content;
		}

		var v = (+value);

		if (v > max) {
			this.addWarning('range-max:' + max, token);
			return max;
		}
		if (v < min) {
			this.addWarning('range-min:' + min, token);
			return min;
		}

		return v;
	}
};

exports.baseConstructor = function () {
	return function (bucket, container, unparsed) {
		this.container = container;
		this.list = [];
		this.bucket = bucket;
		this.warningList = [];
		this.unparsed = unparsed.clone();
	};
};

var regexpExpansions = {
	'n': "([0-9]+(\\.[0-9]*)?|[0-9]*\\.?[0-9]+)",  // Number
	'w': "[ \\n\\r\\f\\t]"  // Whitespace, as defined by CSS spec
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
	return function (unparsed, bucket, container) {
		var simpleObj = new baseObj(bucket, container, unparsed);
		simpleObj.debug('parse', simpleObj.unparsed);
		return simpleObj.scanRules();
	};
};

});

require.define("/css/values/validate.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var getTokenAndValue = function (tokenOrObject) {
	var val = null;
	var token = tokenOrObject;

	if (tokenOrObject.firstToken) {
		token = tokenOrObject.firstToken();
	}
	if (typeof tokenOrObject.getValue == 'function') {
		// One of the basic "value" objects
		val = tokenOrObject.getValue();
		token = tokenOrObject.firstToken();
	} else {
		// Token, from tokenizer
		val = tokenOrObject.content;
		token = tokenOrObject;
	}

	return {
		token: token,
		value: val
	};
};

exports.angle = function () {
	return function (token) {
		var a = +(token.content);

		if (a < 0 || a >= 360) {
			this.addWarning('angle', token);
		}

		while (a < 0) {
			a += 360;
		}

		while (a >= 360) {
			a -= 360;
		}

		token.content = a;
	};
};

exports.browserOnly= function (browserAndVersion) {
	return function (token) {
		this.addWarning('browser-only:' + browserAndVersion, token);
	};
};

exports.browserQuirk = function (browserAndVersion) {
	return function (token) {
		this.addWarning('browser-quirk:' + browserAndVersion, token);
	};
};

exports.browserUnsupported = function (browserAndVersion) {
	return function (token) {
		this.addWarning('browser-unsupported:' + browserAndVersion, token);
	};
};

exports.call = function () {
	var args = Array.prototype.slice.call(arguments);
	var context = args.shift();  // Remove context
	var method = args.shift();  // Remove method
	var token = args.shift();

	if (typeof token == 'undefined') {
		token = context.firstToken();
	}

	var func = exports[method].apply(context, args);
	func.call(context, token);
};

exports.deprecated = function (deprecatedVersion, suggestion) {
	return function (tokenOrObject) {
		var warning = 'css-deprecated';
		
		if (deprecatedVersion) {
			warning += ':' + deprecatedVersion;
		}

		var token = tokenOrObject;

		if (tokenOrObject.firstToken) {
			token = tokenOrObject.firstToken();
		}

		this.addWarning(warning, token);
	};
};

exports.maximumCss = function (maxVersion) {
	return function (token) {
		if (! this.bucket.options.cssLevel || this.bucket.options.cssLevel > maxVersion) {
			this.addWarning('css-maximum:' + maxVersion, token);
		}
	};
};

exports.minimumCss = function (minVersion) {
	return function (token) {
		if (! this.bucket.options.cssLevel || this.bucket.options.cssLevel < minVersion) {
			this.addWarning('css-minimum:' + minVersion, token);
		}
	};
};

exports.notForwardCompatible = function (badVersion) {
	return function (token) {
		if (! this.bucket.options.cssLevel || this.bucket.options.cssLevel <= badVersion) {
			this.addWarning('not-forward-compatible:' + badVersion, token);
		}
	};
};

exports.numberPortionIsInteger = function () {
	return function (tokenOrObject) {
		var tv = getTokenAndValue(tokenOrObject);
		var num = tv.value.toString().match(/^[-+]?[0-9]*\.?[0-9]*/);
		
		if (! num || num.toString().indexOf('.') != -1) {
			this.addWarning('require-integer', tv.token);
		}
	};
};

exports.numberPortionIsNotZero = function () {
	return function (tokenOrObject) {
		var tv = getTokenAndValue(tokenOrObject);
		var num = tv.value.toString().match(/^[-+]?[0-9]*\.?[0-9]+/);
		
		if (+num === 0) {
			this.addWarning('suggest-remove-unit:' + this.getUnit(), tv.token);
		}
	};
};

exports.shouldNotBeQuoted = function () {
	return function (token) {
		this.addWarning('remove-quotes', token);
	};
};

exports.positiveValue = function () {
	return function (tokenOrObject) {
		var tv = getTokenAndValue(tokenOrObject);

		if (tv.value.toString().charAt(0) == '-') {
			this.addWarning('require-positive-value', tv.token);
		}
	};
};

exports.reserved = function () {
	return function (token) {
		this.addWarning('reserved', token);
	};
};

exports.suggestUsing = function (propertyName) {
	return function (token) {
		this.addWarning('suggest-using:' + propertyName, token);
	};
};

exports.suggestUsingRelativeUnits = function () {
	return function (token) {
		this.addWarning('suggest-relative-unit:' + this.getUnit(), token);
	};
};


exports.unsupportedCss = function (badVersion) {
	return function (token) {
		if (! this.bucket.options.cssLevel || this.bucket.options.cssLevel == badVersion) {
			this.addWarning('css-unsupported:' + badVersion, token);
		}
	};
};

exports.withinRange = function (min, max) {
	return function (obj) {
		obj.setValue(this.warnIfOutsideRange(obj, min, max, obj.getValue()));
	};
};

exports.workingDraft = function () {
	return function (token) {
		this.addWarning('css-draft', token);
	};
};

});

require.define("/css/values/attr.js", function (require, module, exports, __dirname, __filename) {
/* <attr>
 *
 * attr( WS? IDENT WS? )
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Attr = base.baseConstructor();

util.extend(Attr.prototype, base.base, {
	name: "attr"
});


exports.parse = function (unparsedReal, bucket, container) {
	var attr = new Attr(bucket, container, unparsedReal);
	attr.debug('parse', attr.unparsed);

	if (! attr.functionParser('attr(', bucket['ident'])) {
		attr.debug('parse fail');
		return null;
	}

	attr.debug('parse success');
	return attr;
};

});

require.define("/css/values/background-attachment.js", function (require, module, exports, __dirname, __filename) {
/* background-attachment
 *
 * CSS1:  <bg-attachment>
 * CSS3:  <bg-attachment>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BackgroundAttachment = base.baseConstructor();

util.extend(BackgroundAttachment.prototype, base.base, {
	name: "background-attachment"
});


exports.parse = function (unparsedReal, bucket, container) {
	var ba = new BackgroundAttachment(bucket, container, unparsedReal);
	ba.debug('parse', unparsedReal);

	if (ba.handleInherit()) {
		return ba;
	}

	ba.repeatWithCommas = true;
	var hits = ba.repeatParser(bucket['bg-attachment']);

	if (! hits) {
		ba.debug('parse fail');
		return null;
	}

	if (ba.list.length > 1) {
		validate.call(ba, 'minimumCss', ba.firstToken(), 3);
	}

	ba.warnIfInherit();
	ba.debug('parse success', ba.unparsed);
	return ba;
};

});

require.define("/css/values/background-clip.js", function (require, module, exports, __dirname, __filename) {
/* background-clip
 *
 * CSS3:  <bg-box>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BackgroundClip = base.baseConstructor();

util.extend(BackgroundClip.prototype, base.base, {
	name: "background-clip"
});


exports.parse = function (unparsedReal, bucket, container) {
	var ba = new BackgroundClip(bucket, container, unparsedReal);
	ba.debug('parse', unparsedReal);

	if (ba.handleInherit()) {
		return ba;
	}

	ba.repeatWithCommas = true;
	var hits = ba.repeatParser(bucket['bg-box']);

	if (! hits) {
		ba.debug('parse fail');
		return null;
	}

	ba.warnIfInherit();
	ba.debug('parse success', ba.unparsed);
	return ba;
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

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BackgroundColor = base.baseConstructor();

util.extend(BackgroundColor.prototype, base.base, {
	name: "background-color",

	allowed: [
		{
			validation: [
				validate.minimumCss(2),
				validate.browserUnsupported('ie7'),
				validate.browserQuirk('ie8')  // Requires !DOCTYPE
			],
			values: [
				"inherit"  // Also matches inherit in <color>, so list this first
			]
		},
		{
			validation: [],
			values: [ 
				'transparent'
			],
			valueObjects: [
				'color'
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

require.define("/css/values/background-image.js", function (require, module, exports, __dirname, __filename) {
/* background-image
 *
 * CSS1:  <bg-image>
 * CSS3:  <bg-image>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BackgroundImage = base.baseConstructor();

util.extend(BackgroundImage.prototype, base.base, {
	name: "background-image"
});


exports.parse = function (unparsedReal, bucket, container) {
	var bg = new BackgroundImage(bucket, container, unparsedReal);
	bg.debug('parse', unparsedReal);

	if (bg.handleInherit()) {
		return bg;
	}

	bg.repeatWithCommas = true;
	var hits = bg.repeatParser(bucket['bg-image']);

	if (! hits) {
		bg.debug('parse fail');
		return null;
	}

	if (hits > 1) {
		validate.call(bg, 'minimumCss', bg.firstToken(), 3);
	}

	bg.warnIfInherit();
	bg.debug('parse success', bg.unparsed);
	return bg;
};

});

require.define("/css/values/background.js", function (require, module, exports, __dirname, __filename) {
/* background
 *
 * CSS1:  <bg-layer>
 * CSS3:  <bg-layer>#  (only the last can have background-color)
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Background = base.baseConstructor();

util.extend(Background.prototype, base.base, {
	name: "background"
});


exports.parse = function (unparsedReal, bucket, container) {
	var b = new Background(bucket, container, unparsedReal);
	b.debug('parse', unparsedReal);

	if (b.handleInherit()) {
		return b;
	}

	b.repeatWithCommas = true;
	var hits = b.repeatParser(bucket['bg-layer']);

	if (! hits) {
		b.debug('parse fail');
		return null;
	}

	if (hits > 1) {
		var scanList = b.list.slice(0);
		scanList.pop();
		scanList.forEach(function (e) {
			if (!! e.mustBeFinal) {
				b.addWarning('illegal', e.firstToken());
			}
		});
	}

	b.warnIfInherit();
	b.debug('parse success', b.unparsed);
	return b;
};

});

require.define("/css/values/background-origin.js", function (require, module, exports, __dirname, __filename) {
/* background-origin
 *
 * CSS3:  <bg-box>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BackgroundOrigin = base.baseConstructor();

util.extend(BackgroundOrigin.prototype, base.base, {
	name: "background-origin"
});


exports.parse = function (unparsedReal, bucket, container) {
	var ba = new BackgroundOrigin(bucket, container, unparsedReal);
	ba.debug('parse', unparsedReal);

	if (ba.handleInherit()) {
		return ba;
	}

	ba.repeatWithCommas = true;
	var hits = ba.repeatParser(bucket['bg-box']);

	if (! hits) {
		ba.debug('parse fail');
		return null;
	}

	ba.warnIfInherit();
	ba.debug('parse success', ba.unparsed);
	return ba;
};

});

require.define("/css/values/background-position.js", function (require, module, exports, __dirname, __filename) {
/* background-position
 *
 * CSS1:  <bg-position>
 * CSS3:  <bg-position>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BackgroundPosition = base.baseConstructor();

util.extend(BackgroundPosition.prototype, base.base, {
	name: "background-position"
});


exports.parse = function (unparsedReal, bucket, container) {
	var bp = new BackgroundPosition(bucket, container, unparsedReal);
	bp.debug('parse', unparsedReal);

	if (bp.handleInherit()) {
		return bp;
	}

	bp.repeatWithCommas = true;
	var hits = bp.repeatParser(bucket['bg-position']);

	if (! hits) {
		bp.debug('parse fail');
		return null;
	}

	if (hits > 1) {
		validate.call(bp, 'minimumCss', bp.firstToken(), 3);
	}

	bp.warnIfInherit();
	bp.debug('parse success', bp.unparsed);
	return bp;
};

});

require.define("/css/values/background-repeat.js", function (require, module, exports, __dirname, __filename) {
/* background-repeat
 *
 * CSS1:  <bg-repeat>
 * CSS3:  <bg-repeat>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BackgroundRepeat = base.baseConstructor();

util.extend(BackgroundRepeat.prototype, base.base, {
	name: "background-repeat"
});


exports.parse = function (unparsedReal, bucket, container) {
	var br = new BackgroundRepeat(bucket, container, unparsedReal);
	br.debug('parse', unparsedReal);

	if (br.handleInherit()) {
		return br;
	}

	br.repeatWithCommas = true;
	var hits = br.repeatParser(bucket['bg-repeat']);

	if (! hits) {
		br.debug('parse fail');
		return null;
	}

	if (hits > 1) {
		validate.call(br, 'minimumCss', br.firstToken(), 3);
	}

	br.warnIfInherit();
	br.debug('parse success', br.unparsed);
	return br;
};

});

require.define("/css/values/background-size.js", function (require, module, exports, __dirname, __filename) {
/* background-size
 *
 * CSS3:  <bg-size>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BackgroundSize = base.baseConstructor();

util.extend(BackgroundSize.prototype, base.base, {
	name: "background-size"
});


exports.parse = function (unparsedReal, bucket, container) {
	var bs = new BackgroundSize(bucket, container, unparsedReal);
	bs.debug('parse', unparsedReal);
	
	if (bs.handleInherit()) {
		return bs;
	}

	bs.repeatWithCommas = true;
	var hits = bs.repeatParser(bucket['bg-size']);

	if (! hits) {
		bs.debug('parse fail');
		return null;
	}

	bs.warnIfInherit();
	bs.debug('parse success', bs.unparsed);
	return bs;
};

});

require.define("/css/values/bg-attachment.js", function (require, module, exports, __dirname, __filename) {
/* <bg-attachment>
 *
 * CSS1:  scroll | fixed
 * CSS2:  inherit
 * CSS3:  local
 * Helper for background-attachment in CSS3
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Attachment = base.baseConstructor();

util.extend(Attachment.prototype, base.base, {
	name: "bg-attachment",

	allowed: [
		{
			validation: [],
			values: [ 
				"scroll",
				"fixed"
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [ 
				"inherit"
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [ 
				"local"
			]
		}
	]
});

exports.parse = base.simpleParser(Attachment);

});

require.define("/css/values/bg-box.js", function (require, module, exports, __dirname, __filename) {
/* <bg-box>
 *
 * CSS3:  border-box | padding-box | content-box
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BgBox = base.baseConstructor();

util.extend(BgBox.prototype, base.base, {
	name: "bg-box",

	allowed: [
		{
			validation: [
				validate.minimumCss(3),
				validate.workingDraft()
			],
			values: [
				"border-box",
				"padding-box",
				"content-box",
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(BgBox);

});

require.define("/css/values/bg-image.js", function (require, module, exports, __dirname, __filename) {
/* <bg-image>
 *
 * CSS1:  <url> | none
 * CSS2:  inherit
 * Helper for background-image in CSS3
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BgImage = base.baseConstructor();

util.extend(BgImage.prototype, base.base, {
	name: "bg-image",

	allowed: [
		{
			validation: [],
			values: [ 
				"none"
			],
			valueObjects: [
				'url'
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

exports.parse = base.simpleParser(BgImage);

});

require.define("/css/values/bg-layer.js", function (require, module, exports, __dirname, __filename) {
/* <bg-layer>
 *
 * CSS1: <background-color> || <bg-image> || <bg-repeat> || <bg-attachment> || <bg-position>
 * CSS2: inherit
 * CSS3: The <bg-position> might be followed by: / <bg-size>
 * CSS3: Can have:  <bg-box>{1,2}
 * CSS3: <background-color> can only be specified in the final bg-layer
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BgLayer = base.baseConstructor();

util.extend(BgLayer.prototype, base.base, {
	name: "bg-layer",
	mustBeFinal: false
});


exports.parse = function (unparsedReal, bucket, container) {
	var bl = new BgLayer(bucket, container, unparsedReal);
	var unparsed = bl.unparsed.clone();
	var hasBeenDone = {};
	bl.debug('parse', unparsedReal);

	if (bl.handleInherit()) {
		return bl;
	}

	var standardProcess = function (defObject) {
		if (hasBeenDone[defObject.name]) {
			return false;
		}

		var parsed = defObject.parseFunction(unparsed, bucket, bl);
		
		if (! parsed) {
			return false;
		}

		hasBeenDone[defObject.name] = true;
		bl.add(parsed);
		unparsed = parsed.unparsed;
		return true;
	};

	var colorProcess = function (defObject) {
		if (standardProcess(defObject)) {
			bl.mustBeFinal = true;
			return true;
		}

		return false;
	};

	var positionProcess = function (defObject) {
		if (! standardProcess(defObject)) {
			return false;
		}

		if (unparsed.isContent('/')) {
			// Might need to undo this
			var unparsedBackup = unparsed.clone();
			var slashToken = unparsed.advance();
			var result = bucket['bg-size'].parse(unparsed, bucket, bl);

			if (result) {
				bl.add(slashToken);
				bl.add(result);
				unparsed = result.unparsed;
			} else {
				// Undo
				unparsed = unparsedBackup;
			}
		}

		return true;
	};

	var boxProcess = function (defObject) {
		if (! standardProcess(defObject)) {
			return false;
		}

		// Might have another box
		defObject.name = 'bg-box 2';
		standardProcess(defObject);
		return true;
	};

	var allowedValues = [
		{
			name: 'bg-image',
			parseFunction: bucket['bg-image'].parse,
			processFunction: standardProcess
		},
		{
			name: 'bg-repeat',
			parseFunction: bucket['bg-repeat'].parse,
			processFunction: standardProcess
		},
		{
			name: 'bg-attachment',
			parseFunction: bucket['bg-attachment'].parse,
			processFunction: standardProcess
		},
		{
			name: 'bg-position',
			parseFunction: bucket['bg-position'].parse,
			processFunction: positionProcess 
		},
		{
			name: 'bg-box',
			parseFunction: bucket['bg-box'].parse,
			processFunction: boxProcess
		},
		{
			name: 'background-color',
			parseFunction: bucket['background-color'].parse,
			processFunction: colorProcess
		}
	];
	var keepGoing = true;

	while (keepGoing) {
		keepGoing = allowedValues.some(function (defObject) {
			return defObject.processFunction(defObject);
		});
	}

	if (bl.list.length === 0) {
		bl.debug('parse fail');
		return null;
	}

	bl.debug('parse success', unparsed);
	bl.unparsed = unparsed;
	bl.warnIfInherit();
	return bl;
};

});

require.define("/css/values/bg-position.js", function (require, module, exports, __dirname, __filename) {
/* <bg-position>
 *
 * This one is a bit more complex, so I'm just listing all possible
 * combinations, along with CSS versions.  There's a few abbreviations:
 *    C = center
 *    TB = top | bottom
 *    LR = left | right
 *    PL = <percent> | <length>
 *
 *  CSS  Format
 * ----- -----------
 * 2     inherit
 * 1     C
 * 1     C  C
 * 1-2.1 C  LR
 * 3     C  LR PL
 * 1     C  TB
 * 3     C  TB PL
 * 2.1   C  PL
 * 1     LR
 * 1     LR C
 * 1     LR TB
 * 2.1   LR PL
 * 1     TB
 * 1-2.1 TB C
 * 1-2.1 TB LR
 * 3     TB PL C
 * 3     TB PL LR PL
 * 1     PL
 * 2.1   PL C
 * 2.1   PL TB
 * 1     PL PL
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BgPosition = base.baseConstructor();

util.extend(BgPosition.prototype, base.base, {
	name: "bg-position",
	patterns: {
		"inherit": {
			minimumCss: 2,
			allowInherit: true
		},
		"C": {
			children: {
				"C": {
				},
				"LR": {
					maximumCss: 2.1,
					notForwardCompatible: 3,
					children: {
						"PL": {
							minimumCss: 3
						}
					}
				},
				"TB": {
					children: {
						"PL": {
							minimumCss: 3
						}
					}
				},
				"PL": {
					minimumCss: 2.1
				}
			}
		},
		"LR": {
			children: {
				"C": {
				},
				"TB": {
				},
				"PL": {
					minimumCss: 2.1
				}
			}
		},
		"TB": {
			children: {
				"C": {
					maximumCss: 2.1,
					notForwardCompatible: 3
				},
				"LR": {
					maximumCss: 2.1,
					notForwardCompatible: 3
				},
				"PL": {
					isValid: false,
					children: {
						"C": {
							minimumCss: 3
						},
						"LR": {
							isValid: false,
							children: {
								"PL": {
									minimumCss: 3
								}
							}
						}
					}
				}
			}
		},
		"PL": {
			children: {
				"C": {
					minimumCss: 2.1
				},
				"TB": {
					minimumCss: 2.1
				},
				"PL": {
				}
			}
		}
	}
});


var testPatterns = function (patterns, unparsedReal, bucket, container) {
	var unparsed = unparsedReal.clone();

	for (var pm in patterns) {
		var doesMatch = false;
		var token = null;

		switch (pm) {
			case 'inherit':
				if (unparsed.isContent('inherit')) {
					doesMatch = true;
				}

				break;

			case 'C':
				if (unparsed.isContent('center')) {
					doesMatch = true;
				}

				break;

			case 'TB':
				if (unparsed.isContent([ 'top', 'bottom' ])) {
					doesMatch = true;
				}

				break;

			case 'LR':
				if (unparsed.isContent([ 'left', 'right' ])) {
					doesMatch = true;
				}

				break;

			case 'PL':
				token = unparsed.matchAny([ bucket['percentage'], bucket['length'] ], container);
				
				if (token) {
					doesMatch = true;
				}
				
				break;
				
			default:
				throw new Error('Unknown pattern matching definition: ' + pm);
		}

		if (doesMatch) {
			if (token === null) {
				token = unparsed.advance();
			} else {
				unparsed = token.unparsed;
			}

			if (patterns[pm].children) {
				var tryChild = testPatterns(patterns[pm].children, unparsed, bucket, container);
				
				if (tryChild) {
					tryChild.tokens.unshift(token);
					return tryChild;
				}
			}

			return util.extend({}, patterns[pm], {
				tokens: [ token ],
				unparsed: unparsed
			});
		}
	}

	return null;
};


exports.parse = function (unparsedReal, bucket, container) {
	var bp = new BgPosition(bucket, container, unparsedReal);
	bp.debug('parse', unparsedReal);

	var childDef = testPatterns(bp.patterns, unparsedReal, bucket, bp);

	if (! childDef) {
		bp.debug('parse fail - testPatterns');
		return null;
	}

	childDef.tokens.forEach(function (token) {
		bp.add(token);
	});

	// isValid: boolean -- If present, must be true or must use a child
	if (typeof childDef.isValid != 'undefined' && ! childDef.isValid) {
		bp.debug('parse fail - not valid');
		return null;
	}

	// minimumCss: X -- validate if present
	if (childDef.minimumCss) {
		validate.call(bp, 'minimumCss', bp.firstToken(), childDef.minimumCss);
	}

	// maximumCss: Y -- validate if present
	if (childDef.maximumCss) {
		validate.call(bp, 'maximumCss', bp.firstToken(), childDef.maximumCss);
	}

	// notForwardCompatible: Z -- validate if present
	if (childDef.notForwardCompatible) {
		validate.call(bp, 'notForwardCompatible', bp.firstToken(), childDef.notForwardCompatible);
	}

	// allowInherit: boolean -- Do not allow "inherit" unless this is set and true
	if (! childDef.allowInherit) {
		bp.warnIfInherit();
	}

	bp.unparsed = childDef.unparsed;
	bp.debug('parse success', bp.unparsed);
	return bp;
};

});

require.define("/css/values/bg-repeat.js", function (require, module, exports, __dirname, __filename) {
/* <bg-repeat>
 *
 * CSS1:  repeat | repeat-x | repeat-y | no-repeat
 * CSS2:  inherit
 * Helper for background-repeat in CSS3
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var bgRepeat = base.baseConstructor();

util.extend(bgRepeat.prototype, base.base, {
	name: "bg-repeat",

	allowed: [
		{
			validation: [],
			values: [ 
				"repeat",
				"repeat-x",
				"repeat-y",
				"no-repeat"
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

exports.parse = base.simpleParser(bgRepeat);

});

require.define("/css/values/bg-size.js", function (require, module, exports, __dirname, __filename) {
/* <bg-size>
 *
 * CSS3:  [ <length> | <percentage> | auto ]{1,2} | cover | contain
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BgSize = base.baseConstructor();

util.extend(BgSize.prototype, base.base, {
	name: "bg-size"
});

exports.parse = function (unparsedReal, bucket, container) {
	var bs = new BgSize(bucket, container, unparsedReal);
	bs.debug('parse', unparsedReal);
	var unparsed = unparsedReal.clone();
	validate.call(bs, 'minimumCss', bs.firstToken(), 3);

	if (unparsed.isContent([ 'cover', 'contain' ])) {
		bs.add(unparsed.advance());
		bs.unparsed = unparsed;
		return bs;
	}

	var getLpa = function () {
		var token = unparsed.matchAny([ bucket['length'], bucket['percentage'] ], bs);
		
		if (token) {
			unparsed = token.unparsed;
			validate.call(token, 'positiveValue');
			return token;
		}

		if (unparsed.isContent('auto')) {
			token = unparsed.advance();
			return token;
		}

		return null;
	};

	var result = getLpa();

	if (! result) {
		return null;
	}

	bs.add(result);
	result = getLpa();

	if (result) {
		bs.add(result);
	}

	bs.unparsed = unparsed;
	return bs;
};

});

require.define("/css/values/border-collapse.js", function (require, module, exports, __dirname, __filename) {
/* <border-collapse>
 *
 * CSS2:  collapse | separate | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderCollapse = base.baseConstructor();

util.extend(BorderCollapse.prototype, base.base, {
	name: "border-collapse",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"collapse",
				"separate",
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(BorderCollapse);

});

require.define("/css/values/border-color.js", function (require, module, exports, __dirname, __filename) {
/* <border-color>
 *
 * CSS1:  <color>{1,4}
 * CSS2:  <color>{1,4} | transparent | inherit
 * CSS2.1:  [ <color> | transparent ]{1,4} | inherit
 * CSS3:  <color> | inherit     transparent is part of <color>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderColor = base.baseConstructor();

util.extend(BorderColor.prototype, base.base, {
	name: "border-color"
});

exports.parse = function (unparsedReal, bucket, container) {
	var bc = new BorderColor(bucket, container, unparsedReal);
	bc.debug('parse', unparsedReal);

	if (bc.handleInherit()) {
		return bc;
	}

	var hits = bc.repeatParser([ bucket['border-color-single'] ], 4);

	if (! hits) {
		bc.debug('parse fail');
		return null;
	}

	// Determine minimum CSS level.  If the value is "transparent",
	// it could be just CSS level 2.  In this case, the <color> or
	// <border-color-single> objects could have added a minimum CSS
	// level of 2.1.  Remove that by starting all over and reparsing
	// as just the string "transparent"
	if (hits == 1 && bc.firstToken().content.toLowerCase() == "transparent") {
		bc = new BorderColor(bucket, container, unparsedReal);
		bc.debug("reparse as transparent");
		validate.call(bc, 'minimumCss', bc.firstToken(), 2);
		bc.add(bc.unparsed.advance());
		return bc;
	}

	bc.warnIfInherit();
	return bc;
};

});

require.define("/css/values/border-color-single.js", function (require, module, exports, __dirname, __filename) {
/* <border-color-single>
 *
 * CSS1:  <color>
 * CSS2.1:  transparent | <color>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderColorSingle = base.baseConstructor();

util.extend(BorderColorSingle.prototype, base.base, {
	name: "border-color-single",

	allowed: [
		{
			validation: [
				validate.minimumCss(2.1)
			],
			values: [
				"transparent"
			]
		},
		{
			validation: [],
			valueObjects: [
				'color'
			]
		}
	]
});

exports.parse = base.simpleParser(BorderColorSingle);

});

require.define("/css/values/border-radius.js", function (require, module, exports, __dirname, __filename) {
/* <border-radius>
 *
 * CSS3:  [ <length> | <percentage> ]{1,4} [ / [ <length | <percentage> ]{1,4} ]?
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderRadius = base.baseConstructor();

util.extend(BorderRadius.prototype, base.base, {
	name: "border-radius"
});

exports.parse = function (unparsedReal, bucket, container) {
	var br = new BorderRadius(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	br.debug('parse', unparsedReal);
	validate.call(br, 'minimumCss', br.firstToken(), 3);

	if (br.handleInherit(function () {})) {
		return br;
	}

	var parseUnits = function (maxCount) {
		var result = true;
		var hits = 0;

		while (result && hits < maxCount) {
			result = unparsed.matchAny([ bucket['length'], bucket['percentage'] ], br);

			if (result) {
				unparsed = result.unparsed;
				br.add(result);
				validate.call(result, 'positiveValue');
				hits ++;
			}
		}

		return hits;
	};

	if (! parseUnits(4)) {
		br.debug('parse fail');
		return null;
	}

	if (unparsed.isContent('/')) {
		var unparsedBackup = unparsed.clone();
		var slashToken = unparsed.advance();
		var result = unparsed.matchAny([ bucket['length'], bucket['percentage'] ], br);
		
		if (result) {
			br.add(slashToken);
			br.add(result);
			unparsed = result.unparsed;
			validate.call(result, 'positiveValue');
			parseUnits(3);
		} else {
			// Undo
			unparsed = unparsedBackup;
		}
	}

	br.unparsed = unparsed;
	return br;
};

});

require.define("/css/values/border-radius-single.js", function (require, module, exports, __dirname, __filename) {
/* <border-radius-single>
 *
 * CSS3:  [ <length> | <percentage> ]{1,2}
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderRadiusSingle = base.baseConstructor();

util.extend(BorderRadiusSingle.prototype, base.base, {
	name: "border-radius-single"
});

exports.parse = function (unparsedReal, bucket, container) {
	var brs = new BorderRadiusSingle(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	brs.debug('parse', unparsedReal);
	validate.call(brs, 'minimumCss', brs.firstToken(), 3);

	if (brs.handleInherit(function () {})) {
		return brs;
	}

	var result = unparsed.matchAny([ bucket['length'], bucket['percentage'] ], brs);
	
	if (! result) {
		return null;
	}

	validate.call(brs, 'positiveValue', result.firstToken());
	brs.add(result);
	unparsed = result.unparsed;

	result = unparsed.matchAny([ bucket['length'], bucket['percentage'] ], brs);

	if (result) {
		validate.call(brs, 'positiveValue', result.firstToken());
		brs.add(result);
		unparsed = result.unparsed;
	}

	brs.unparsed = unparsed;
	return brs;
};

});

require.define("/css/values/border-single.js", function (require, module, exports, __dirname, __filename) {
/* <border-single>
 *
 * CSS1:  <border-width-single> || <border-style> || <border-color-single>
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderSingle = base.baseConstructor();

util.extend(BorderSingle.prototype, base.base, {
	name: "border-single"
});


exports.parse = function (unparsedReal, bucket, container) {
	var bs = new BorderSingle(bucket, container, unparsedReal);
	var unparsed = bs.unparsed.clone();
	bs.debug('parse', unparsedReal);

	if (bs.handleInherit()) {
		return bs;
	}

	var hits = unparsed.matchAnyOrder([
		bucket['border-width-single'],
		bucket['border-style'],
		bucket['border-color-single']
	], bs);

	if (! hits) {
		bs.debug('parse fail');
		return null;
	}

	bs.debug('parse success', bs.unparsed);
	bs.warnIfInherit();
	return bs;
};

});

require.define("/css/values/border-spacing.js", function (require, module, exports, __dirname, __filename) {
/* <border-spacing>
 *
 * CSS2:  <length> <length>? | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderSpacing = base.baseConstructor();

util.extend(BorderSpacing.prototype, base.base, {
	name: "border-spacing"
});

exports.parse = function (unparsedReal, bucket, container) {
	var bs = new BorderSpacing(bucket, container, unparsedReal);
	bs.debug('parse', unparsedReal);

	if (bs.handleInherit()) {
		return bs;
	}

	var hits = bs.repeatParser([ bucket['length'] ], 2);

	if (! hits) {
		bs.debug('parse fail');
		return null;
	}

	bs.warnIfInherit();
	return bs;
};

});

require.define("/css/values/border-style.js", function (require, module, exports, __dirname, __filename) {
/* <border-style>
 *
 * CSS1:  <border-style-single>
 * CSS2:  inherit | hidden
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderStyle = base.baseConstructor();

util.extend(BorderStyle.prototype, base.base, {
	name: "border-style",

	allowed: [
		{
			validation: [],
			valueObjects: [
				'border-style-single'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"inherit",
				"hidden"
			]
		}
	]
});

exports.parse = base.simpleParser(BorderStyle);

});

require.define("/css/values/border-style-single.js", function (require, module, exports, __dirname, __filename) {
/* <border-style>
 *
 * Used by border-style as well as outline-style, thus does NOT have
 * "hidden" as an allowed value
 *
 * CSS1:  none | dotted | dashed | solid | double | groove | ridge | inset | outset
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderStyleSingle = base.baseConstructor();

util.extend(BorderStyleSingle.prototype, base.base, {
	name: "border-style-single",

	allowed: [
		{
			validation: [],
			values: [
				"none",
				"dotted",
				"dashed",
				"solid",
				"double",
				"groove",
				"ridge",
				"inset",
				"outset"
			]
		}
	]
});

exports.parse = base.simpleParser(BorderStyleSingle);

});

require.define("/css/values/border-width.js", function (require, module, exports, __dirname, __filename) {
/* border-width
 *
 * CSS1:  <border-width-single>{1,4}
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderWidth = base.baseConstructor();

util.extend(BorderWidth.prototype, base.base, {
	name: "border-width"
});


exports.parse = function (unparsedReal, bucket, container) {
	var bw = new BorderWidth(bucket, container, unparsedReal);
	bw.debug('parse', unparsedReal);

	if (bw.handleInherit()) {
		return bw;
	}

	var hits = bw.repeatParser(bucket['border-width-single'], 4);

	if (! hits) {
		bw.debug('parse fail');
		return null;
	}

	bw.warnIfInherit();
	bw.debug('parse success', bw.unparsed);
	return bw;
};

});

require.define("/css/values/border-width-single.js", function (require, module, exports, __dirname, __filename) {
/* <border-width-single>
 *
 * CSS1:  thin | medium | thick | <length>
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderWidthSingle = base.baseConstructor();

util.extend(BorderWidthSingle.prototype, base.base, {
	name: "border-width-single",

	allowed: [
		{
			validation: [],
			values: [
				"thin",
				"medium",
				"thick"
			],
			valueObjects: [
				'length'
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

exports.parse = base.simpleParser(BorderWidthSingle);

});

require.define("/css/values/box-shadow.js", function (require, module, exports, __dirname, __filename) {
/* <box-shadow>
 *
 * CSS3:  inherit | none | <box-shadow-single>#
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BoxShadow = base.baseConstructor();

util.extend(BoxShadow.prototype, base.base, {
	name: "box-shadow"
});

exports.parse = function (unparsedReal, bucket, container) {
	var bs = new BoxShadow(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	bs.debug('parse', unparsedReal);
	validate.call(bs, 'minimumCss', bs.firstToken(), 3);

	if (bs.handleInherit(function () {})) {
		return bs;
	}

	if (bs.unparsed.isContent('none')) {
		bs.add(bs.unparsed.advance());
		return bs;
	}

	bs.repeatWithCommas = true;

	if (! bs.repeatParser([ bucket['box-shadow-single'] ])) {
		return null;
	}

	bs.warnIfInherit();
	return bs;
};

});

require.define("/css/values/box-shadow-single.js", function (require, module, exports, __dirname, __filename) {
/* <box-shadow-single>
 *
 * Used by box-shadow for a single shadow definition
 *
 * CSS3:  inherit | [ inset? && [ <length>{2,4} && <color>? ] ]
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BoxShadowSingle = base.baseConstructor();

util.extend(BoxShadowSingle.prototype, base.base, {
	name: "box-shadow-single"
});


exports.parse = function (unparsedReal, bucket, container) {
	var bss = new BoxShadowSingle(bucket, container, unparsedReal);
	bss.debug('parse', unparsedReal);
	var insetFound = false;
	validate.call(bss, 'minimumCss', bss.firstToken(), 3);

	if (bss.handleInherit()) {
		return bss;
	}

	if (bss.unparsed.isContent('inset')) {
		insetFound = true;
		bss.add(bss.unparsed.advance());
	}

	var c = bucket['color'].parse(bss.unparsed, bucket, bss);

	if (c) {
		bss.add(c);
		bss.unparsed = c.unparsed;
	}

	var lengths = bss.repeatParser([ bucket['length'] ], 4);

	if (lengths < 2) {
		bss.debug('parse fail');
		return null;
	}

	if (! c) {
		c = bucket['color'].parse(bss.unparsed, bucket, bss);

		if (c) {
			bss.add(c);
			bss.unparsed = c.unparsed;
		}
	}

	if (! insetFound && bss.unparsed.isContent('inset')) {
		bss.add(bss.unparsed.advance());
	}

	bss.warnIfInherit();
	bss.debug('parse success', bss.unparsed);
	return bss;
};

});

require.define("/css/values/clear.js", function (require, module, exports, __dirname, __filename) {
/* clear
 *
 * CSS1:  none, left, right, both
 * CSS2:  inherit
 */

"use strict";

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

require.define("/css/values/color.js", function (require, module, exports, __dirname, __filename) {
/* <color>
 *
 * Colors can be one of 18-ish basic colors, extended colors from CSS3, rgb,
 * rgba, hsl, hsla, 3-digit or 6-digit hex codes.
 *
 * TODO:  Warn about trademarked colors
 * TODO:  Offer conversion to smallest code, all hex, short hex, etc
 */

"use strict";

var base = require('./base');
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
				validate.deprecated(3),
				validate.suggestUsing('appearance')
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
				base.makeRegexp('#[0-9a-f]{6}')
			],
			valueObjects: [
				'rgb'
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
				'currentcolor',
				'transparent'
			],
			valueObjects: [
				'rgba',
				'hsl',
				'hsla'
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

require.define("/css/values/col-width.js", function (require, module, exports, __dirname, __filename) {
/* <col-width>
 *
 * CSS3 allows a non-negative <length>, "auto", "fit-content", "max-content",
 * "min-content", "*", or the minmax function (I'm implementing as <minmax>)
 * No other CSS versions do something like this that I've found
 */

"use strict";

var base = require('./base');
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
				"inherit",
				"*"
			],
			valueObjects: [
				'minmax'
			]
		},
		{
			validation: [
				validate.minimumCss(3),
				validate.positiveValue()
			],
			valueObjects: [ 
				'length'
			]
		}
	]
});

exports.parse = base.simpleParser(ColWidth);

});

require.define("/css/values/content.js", function (require, module, exports, __dirname, __filename) {
/* <content>
 *
 * CSS2:  inherit | normal | none | [ <string> | <url> | <counter> | attr(<identifier>) | open-quote | close-quote | no-open-quote | no-close-quote ]+
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Content = base.baseConstructor();

util.extend(Content.prototype, base.base, {
	name: "content"
});

exports.parse = function (unparsedReal, bucket, container) {
	var content = new Content(bucket, container, unparsedReal);
	content.debug('parse', content.unparsed);

	if (content.handleInherit()) {
		return content;
	}

	validate.call(content, 'minimumCss', content.firstToken(), 2);

	if (content.unparsed.isContent([ 'normal', 'none' ])) {
		content.add(content.unparsed.advance());
		return content;
	}

	var hits = content.repeatParser([
		bucket['string'],
		bucket['url'],
		bucket['counter'],
		bucket['attr'],
		"open-quote",
		"close-quote",
		"no-open-quote",
		"no-close-quote"
	]);

	if (! hits) {
		content.debug('parse fail');
		return null;
	}

	content.warnIfInherit();
	content.debug('parse success');
	return content;
};

});

require.define("/css/values/counter.js", function (require, module, exports, __dirname, __filename) {
/* <counter>
 *
 * counter( WS? IDENT WS? )
 * counter( WS? IDENT WS? , WS? <list-style-type> WS? )
 * counters( WS? IDENT WS? , WS? STRING WS? )
 * counters( WS? IDENT WS? , WS? STRING WS? , WS? <list-style-type> WS? )
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Counter = base.baseConstructor();

util.extend(Counter.prototype, base.base, {
	name: "counter"
});


exports.parse = function (unparsed, bucket, container) {
	var counter = new Counter(bucket, container, unparsed);
	counter.debug('parse', unparsed);

	var result = counter.functionParser('counter(', bucket['ident']);

	if (! result) {
		result = counter.functionParser('counter(', bucket['ident'], bucket['list-style-type']);
	}

	if (! result) {
		result = counter.functionParser('counters(', bucket['ident'], bucket['string']);
	}
	
	if (! result) {
		result = counter.functionParser('counters(', bucket['ident'], bucket['string'], bucket['list-style-type']);
	}
	
	if (! result) {
		counter.debug('parse fail');
		return null;
	}

	counter.debug('parse success');
	counter.warnIfInherit();
	return counter;
};

});

require.define("/css/values/cursor.js", function (require, module, exports, __dirname, __filename) {
/* cursor
 *
 * CSS2:  inherit | [ <uri> , ]* <cursor-keyword>
 * CSS3:  inherit | [ <uri> [ <x> <y> ] , ]* <cursor-keyword>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Cursor = base.baseConstructor();

util.extend(Cursor.prototype, base.base, {
	name: "cursor"
});


exports.parse = function (unparsedReal, bucket, container) {
	var cursor = new Cursor(bucket, container, unparsedReal);
	cursor.debug('parse', unparsedReal);
	var minimumCss = 2;

	if (cursor.handleInherit()) {
		return cursor;
	}

	var uri = bucket['url'].parse(cursor.unparsed, bucket, cursor);

	while (uri) {
		cursor.add(uri);
		cursor.unparsed = uri.unparsed;

		var x = bucket['number'].parse(cursor.unparsed, bucket, cursor);

		if (x) {
			var y = bucket['number'].parse(x.unparsed, bucket, cursor);
			
			if (! y) {
				cursor.debug('parse fail - found X but no Y');
				return null;
			}

			cursor.add(x);
			cursor.add(y);
			cursor.unparsed = y.unparsed;
			minimumCss = 3;
		}

		if (! cursor.unparsed.isTypeContent('OPERATOR', ',')) {
			cursor.debug('parse fail - found URI but no comma');
			return null;
		}

		cursor.add(cursor.unparsed.advance());
		uri = bucket['url'].parse(cursor.unparsed, bucket, cursor);
	}

	var keyword = bucket['cursor-keyword'].parse(cursor.unparsed, bucket, cursor);

	if (! keyword) {
		cursor.debug('parse fail - no cursor keyword');
		return null;
	}
	
	cursor.add(keyword);
	validate.call(cursor, 'minimumCss', cursor.firstToken(), minimumCss);
	cursor.unparsed = keyword.unparsed;
	cursor.warnIfInherit();
	cursor.debug('parse success', cursor.unparsed);
	return cursor;
};

});

require.define("/css/values/cursor-keyword.js", function (require, module, exports, __dirname, __filename) {
/* <cursor-keyword>
 *
 * Used for matching cursor keyword properties.
 *
 * CSS2: auto | crosshair | default | pointer | move | e-resize | ne-resize | nw-resize | n-resize | se-resize | sw-resize | s-resize | w-resize| text | wait | help
 * CSS2.1: progress
 * CSS3: none |context-menu  | cell | vertical-text | alias | copy | no-drop | not-allowed | ew-resize | ns-resize | nesw-resize | nwse-resize | col-resize | row-resize | all-scroll | zoom-in | zoom-out 
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var CursorKeyword = base.baseConstructor();

util.extend(CursorKeyword.prototype, base.base, {
	name: "cursor-keyword",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'auto',
				'crosshair',
				'default',
				'pointer',
				'move',
				'e-resize',
				'ne-resize',
				'nw-resize',
				'n-resize',
				'se-resize',
				'sw-resize',
				's-resize',
				'w-resize',
				'text',
				'wait',
				'help',
				'inherit'
			]
		},
		{
			validation: [
				validate.minimumCss(2.1)
			],
			values: [
				'progress'
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				'context-menu',
				'cell',
				'vertical-text',
				'alias',
				'copy',
				'no-drop',
				'none',
				'not-allowed',
				'ew-resize',
				'ns-resize',
				'nesw-resize',
				'nwse-resize',
				'col-resize',
				'row-resize',
				'all-scroll',
				'zoom-in',
				'zoom-out'
			]
		}
	]
});

exports.parse = base.simpleParser(CursorKeyword);

});

require.define("/css/values/display.js", function (require, module, exports, __dirname, __filename) {
/* <display>
 *
 * In CSS1 - CSS2.1, it is just <display-type>
 * In CSS3 it is <display-type>? && <template>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Display = base.baseConstructor();

util.extend(Display.prototype, base.base, {
	name: "display"
});


exports.parse = function (unparsedReal, bucket, container) {
	var display = new Display(bucket, container, unparsedReal);
	var displayTypeCount = 0;
	var unparsed = display.unparsed;
	display.debug('parse', unparsedReal);

	if (display.handleInherit()) {
		return display;
	}

	var result = bucket['display-type'].parse(unparsed, bucket, display);

	if (result) {
		displayTypeCount ++;
		display.add(result);
		unparsed = result.unparsed;
	}

	result = bucket['template'].parse(unparsed, bucket, display);
	
	if (result) {
		validate.call(display, 'minimumCss', display.firstToken(), 3);
		display.add(result);
		unparsed = result.unparsed;

		if (! displayTypeCount) {
			result = bucket['display-type'].parse(unparsed, bucket, display);
			
			if (result) {
				display.add(result);
				unparsed = result.unparsed;
			}
		}
	} else if (! displayTypeCount) {
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

"use strict";

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
				validate.browserUnsupported('ie7'),
				validate.browserQuirk('ie8') // !DOCTYPE required
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

require.define("/css/values/filter.js", function (require, module, exports, __dirname, __filename) {
/* <filter>
 *
 * Unofficial CSS property that is used by IE
 *
 * One way for IE to set opacity is
 *   filter: progid:DXImageTransform.Microsoft.Alpha(opacity=40)
 * That's huge and prone to errors.  It also needs to be quoted like this
 * for IE 8 and 9
 *   filter: "progid:DXImageTransform.Microsoft.Alpha(opacity=40)"
 * Another way that works in IE 5, 6, 7, 8, and 9 as long as the element has
 * the "hasLayout" property (use "zoom:1" or "width:100%" or another trick)
 *   filter: alpha(opacity=40)
 * http://css-tricks.com/css-transparency-settings-for-all-broswers/
 *
 * A common problem is to use "opacity:40" instead of "opacity=40".
 *
 * TODO:  This is not complete.  As features are used, we can add them here.
 * TODO:  Maybe this would be better to split into filter-alpha and
 * filter-dximagetransform and things like that?
 * TODO:  handle opacity=12% and opacity=0.12 and convert
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Filter = base.baseConstructor();

util.extend(Filter.prototype, base.base, {
	name: "filter",

	toString: function () {
		var out = '';

		this.list.forEach(function (item) {
			out += item.toString();
		});

		return out;
	}
});

var alphaParser = function (filter) {
	filter.add(filter.unparsed.advance());

	// Check for opacity
	if (! filter.unparsed.isContent('opacity')) {
		filter.debug('parse fail - alpha - opacity');
		return null;
	}

	filter.add(filter.unparsed.advance());

	// Check for = or :, if : then warn
	if (filter.unparsed.isContent('=')) {
		filter.add(filter.unparsed.advance());
	} else if (filter.unparsed.isContent(':')) {
		var token = filter.unparsed.advance();
		filter.addWarning('filter-use-equals-instead', token);
		var colonToken = token.clone();
		colonToken.type = 'MATCH';
		colonToken.content = '=';
		filter.add(colonToken);
	} else {
		filter.debug('parse fail - alpha - equals');
		return null;
	}

	// Next up is an integer between 0 and 100
	var number = filter.bucket['number'].parse(filter.unparsed, filter.bucket, filter);
	
	if (! number) {
		filter.debug('parse fail - alpha - number');
		return null;
	}

	filter.warnIfNotInteger(number.firstToken(), number.getValue());
	filter.warnIfOutsideRange(number.firstToken(), 0, 100, number.getValue());
	filter.add(number);
	filter.unparsed = number.unparsed;

	// Next is close parentheis
	if (! filter.unparsed.isContent(')')) {
		filter.debug('parse fail - alpha - paren close');
		return null;
	}

	filter.add(filter.unparsed.advance());

	// TODO:  Warn to use zoom:1 or width:100% or another trick

	// Now return true when this works
	return true;
};

var progidParser = function (filter) {
	filter.add(filter.unparsed.advance());
	
	if (! filter.unparsed.isContent(':')) {
		filter.debug('parse fail - progid - colon');
		return null;
	}

	filter.add(filter.unparsed.advance());

	if (! filter.unparsed.isContent('DXImageTransform.Microsoft.Alpha(')) {
		filter.debug('parse fail - progid - DX');
		return null;
	}

	filter.add(filter.unparsed.advance());

	if (! filter.unparsed.isContent('opacity')) {
		filter.debug('parse fail - progid - opacity');
		return null;
	}

	filter.add(filter.unparsed.advance());

	// Check for = or :, if : then warn
	if (filter.unparsed.isContent('=')) {
		filter.add(filter.unparsed.advance());
	} else if (filter.unparsed.isContent(':')) {
		var token = filter.unparsed.advance();
		filter.addWarning('filter-use-equals-instead', token);
		token.content = '=';
		filter.add(token);
	} else {
		filter.debug('parse fail - progid - equals');
		return null;
	}

	// Next up is an integer between 0 and 100
	var number = filter.bucket.number.parse(filter.unparsed, filter.bucket, filter);
	
	if (! number) {
		filter.debug('parse fail - progid - number');
		return null;
	}

	filter.warnIfNotInteger(number.firstToken(), number.getValue());
	filter.warnIfOutsideRange(number.firstToken(), 0, 100, number.getValue());
	filter.add(number);
	filter.unparsed = number.unparsed;

	// Next is close parentheis
	if (! filter.unparsed.isContent(')')) {
		filter.debug('parse fail - progid - paren close');
		return null;
	}

	filter.add(filter.unparsed.advance());

	// Add warning - should use alpha(opacity=25)
	filter.addWarning('suggest-using:alpha(...)', filter.getFirstToken());

	// TODO:  Warn to use zoom:1 or width:100% or another trick

	// Now return true when this works
	return true;
};

exports.parse = function (unparsedReal, bucket, container) {
	var filter = new Filter(bucket, container, unparsedReal);
	filter.debug('parse', unparsedReal);

	while (filter.unparsed.length()) {
		if (filter.unparsed.isContent('progid')) {
			if (! progidParser(filter)) {
				filter.debug('parse fail - progid');
				return null;
			}
		} else if (filter.unparsed.isContent('alpha(')) {
			if (! alphaParser(filter)) {
				filter.debug('parse fail - alpha');
				return null;
			}
		} else {
			filter.debug('parse fail - unsupported content');
			return null;
		}
	}

	filter.debug('parse success');
	return filter;
};

});

require.define("/css/values/float.js", function (require, module, exports, __dirname, __filename) {
/* float
 *
 * CSS1:  left | right | none
 * CSS2:  left | right | none | inherit
 * CSS2.1:  Same as CSS2
 * CSS3:  [[ left | right | inside | outside ] || [ top | bottom ] || next ] ] | none | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Float = base.baseConstructor();

util.extend(Float.prototype, base.base, {
	name: "float"
});

exports.parse = function (unparsedReal, bucket, container) {
	var f = new Float(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	f.debug('parse', unparsed);
	var lrio = false;
	var tb = false;
	var n = false;
	var ni = false;
	var keepParsing = true;
	var css3 = false;

	while (keepParsing) {
		if (unparsed.isContent([ 'left', 'right' ])) {
			if (ni || lrio) {
				return null;
			}

			lrio = true;
			f.add(unparsed.advance());
		} else if (unparsed.isContent([ 'inside', 'outside' ])) {
			if (ni || lrio) {
				return null;
			}

			lrio = true;
			css3 = true;
			f.add(unparsed.advance());
		} else if (unparsed.isContent([ 'top', 'bottom' ])) {
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
			validate.call(f, 'minimumCss', f.firstToken(), 2);
			validate.call(f, 'browserQuirk', f.firstToken(), 'ie8');  // !DOCTYPE
			validate.call(f, 'browserUnsupported', f.firstToken(), 'ie7');  // !DOCTYPE
			f.add(unparsed.advance());
		} else {
			keepParsing = false;
		}
	}

	if (! f.list.length) {
		// No tokens parsed
		return null;
	}

	if (css3) {
		validate.call(f, 'minimumCss', f.firstToken(), 3);
	}

	f.debug('parse success', unparsed);
	f.unparsed = unparsed;
	return f;
};

});

require.define("/css/values/font-face-annotation.js", function (require, module, exports, __dirname, __filename) {
/* font-face-annotation
 *
 * annotation( WS? <feature-value-name> WS? )
 *
 * feature-value-name is <font-family-single>
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Func = base.baseConstructor();

util.extend(Func.prototype, base.base, {
	name: "font-face-annotation"
});


exports.parse = function (unparsedReal, bucket, container) {
	var f = new Func(bucket, container, unparsedReal);
	f.debug('parse', f.unparsed);

	if (! f.functionParser('annotation(', bucket['font-family-single'])) {
		f.debug('parse fail');
		return null;
	}

	f.debug('parse success');
	return f;
};

});

require.define("/css/values/font-face-caps-values.js", function (require, module, exports, __dirname, __filename) {
/* <font-face-caps-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: small-caps | all-small-caps | petite-caps | all-petite-caps | tilting-caps | unicase
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-historical-lig-values",

	allowed: [
		{
			validation: [],
			values: [
				"historical-ligatures",
				"no-historical-ligatures"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


});

require.define("/css/values/font-face-character-variant.js", function (require, module, exports, __dirname, __filename) {
/* font-face-character-variant
 *
 * character-variant( WS? <feature-value-name> WS? [ COMMA WS? <feature-value-name WS? ]* )
 *
 * feature-value-name is <font-family-single>
 * With commas, this looks like character-variant(<font-family>)
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Func = base.baseConstructor();

util.extend(Func.prototype, base.base, {
	name: "font-face-character-variant"
});


exports.parse = function (unparsedReal, bucket, container) {
	var f = new Func(bucket, container, unparsedReal);
	f.debug('parse', f.unparsed);

	if (! f.functionParser('character-variant(', bucket['font-family'])) {
		f.debug('parse fail');
		return null;
	}

	f.debug('parse success');
	return f;
};

});

require.define("/css/values/font-face-common-lig-values.js", function (require, module, exports, __dirname, __filename) {
/* <font-face-common-lig-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: common-ligatures | no-common-ligatures
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-common-lig-values",

	allowed: [
		{
			validation: [],
			values: [
				"common-ligatures",
				"no-common-ligatures"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


});

require.define("/css/values/font-face-contextual-lig-values.js", function (require, module, exports, __dirname, __filename) {
/* <font-face-contextual-lig-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: contextual-ligatures | no-contextual-ligatures
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-conextual-lig-values",

	allowed: [
		{
			validation: [],
			values: [
				"contextual-ligatures",
				"no-contextual-ligatures"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


});

require.define("/css/values/font-face-discretionary-lig-values.js", function (require, module, exports, __dirname, __filename) {
/* <font-face-discretionary-lig-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: discretionary-ligatures | no-discretionary-ligatures
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-discretionary-lig-values",

	allowed: [
		{
			validation: [],
			values: [
				"discretionary-ligatures",
				"no-discretionary-ligatures"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


});

require.define("/css/values/font-face-east-asian-variant-values.js", function (require, module, exports, __dirname, __filename) {
/* <font-face-east-asian-variant-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: jis78 | jis83 | jis90 | jis04 | simplified | traditional
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-east-asian-variant-values",

	allowed: [
		{
			validation: [],
			values: [
				"jis78",
				"jis83",
				"jis90",
				"jis04",
				"simplified",
				"traditional"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


});

require.define("/css/values/font-face-east-asian-width-values.js", function (require, module, exports, __dirname, __filename) {
/* <font-face-east-asian-width-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: full-width | proportional-width
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-east-asian-width-values",

	allowed: [
		{
			validation: [],
			values: [
				"full-width",
				"proportional-width"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


});

require.define("/css/values/font-face-font-family.js", function (require, module, exports, __dirname, __filename) {
/* font-face-font-family
 *
 * Note:  inherit is not allowed
 *
 * CSS2:  <font-family-single>#
 * CSS3:  <font-family-single>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontFaceFontFamily = base.baseConstructor();

util.extend(FontFaceFontFamily.prototype, base.base, {
	name: "font-face-font-family"
});


exports.parse = function (unparsedReal, bucket, container) {
	var ffff = new FontFaceFontFamily(bucket, container, unparsedReal);
	ffff.debug('parse', unparsedReal);
	ffff.repeatWithCommas = true;
	var hits = ffff.repeatParser(bucket['font-family-single']);

	if (! hits) {
		ffff.debug('parse fail');
		return null;
	}

	ffff.fontValidation(hits);
	ffff.debug('parse success', ffff.unparsed);
	return ffff;
};

});

require.define("/css/values/font-face-font-style.js", function (require, module, exports, __dirname, __filename) {
/* font-face-font-family
 *
 * Note:  inherit is not allowed
 *
 * CSS2:  all | <font-style>#
 * CSS3:  <font-style>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontFaceFontStyle = base.baseConstructor();

util.extend(FontFaceFontStyle.prototype, base.base, {
	name: "font-face-font-style"
});


exports.parse = function (unparsedReal, bucket, container) {
	var fffs = new FontFaceFontStyle(bucket, container, unparsedReal);
	fffs.debug('parse', unparsedReal);

	if (fffs.handleAll()) {
		return fffs;
	}

	fffs.repeatWithCommas = true;
	var hits = fffs.repeatParser(bucket['font-style']);

	if (! hits) {
		fffs.debug('parse fail');
		return null;
	}

	fffs.fontValidation(hits);
	fffs.debug('parse success', fffs.unparsed);
	return fffs;
};

});

require.define("/css/values/font-face-font-variant.js", function (require, module, exports, __dirname, __filename) {
/* font-face-font-variant
 *
 * Note:  inherit is not allowed
 *
 * CSS2:  [ normal | small-caps ]#
 *   This matches <font-variant-css21>
 * CSS3:  normal |
 *        [ <font-face-common-lig-values> ||
 *          <font-face-discretionary-lig-values> ||
 *          <font-face-historical-lig-values> ||
 *          <font-face-contextual-lig-values> ||
 *          <font-face-stylistic> ||
 *          historical-forms ||
 *          <font-face-styleset> ||
 *          <font-face-character-variant> ||
 *          <font-face-swash> ||
 *          <font-face-ornaments> ||
 *          <font-face-annotation> ||
 *          ruby ||
 *          <font-face-caps-values> ||
 *          <font-face-numeric-figure-values> ||
 *          <font-face-numeric-spacing-values> ||
 *          <font-face-numeric-fraction-values> ||
 *          slashed-zero ||
 *          <font-face-east-asian-variant-values> ||
 *          <font-face-east-asian-width-values> ]
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontFaceFontVariant = base.baseConstructor();

util.extend(FontFaceFontVariant.prototype, base.base, {
	name: "font-face-font-variant"
});


exports.parse = function (unparsedReal, bucket, container) {
	var fffv = new FontFaceFontVariant(bucket, container, unparsedReal);
	fffv.debug('parse', unparsedReal);

	fffv.repeatWithCommas = true;
	var hits = fffv.repeatParser(bucket['font-variant-css21']);

	if (hits) {
		fffv.fontValidation(hits);
		fffv.debug('parse success - css2', fffv.unparsed);
		return fffv;
	}

	fffv = new FontFaceFontVariant(bucket, container, unparsedReal);
	hits = fffv.unparsed.matchAnyOrder([
		// Normal was already parsed
		bucket['font-face-common-lig-values'],
		bucket['font-face-discretionary-lig-values'],
		bucket['font-face-historical-lig-values'],
		bucket['font-face-contextual-lig-values'],
		bucket['font-face-stylistic'],
		'historical-forms',
		bucket['font-face-styleset'],
		bucket['font-face-character-variant'],
		bucket['font-face-swash'],
		bucket['font-face-ornaments'],
		bucket['font-face-annotation'],
		'ruby',
		bucket['font-face-caps-values'],
		bucket['font-face-numeric-figure-values'],
		bucket['font-face-numeric-spacing-values'],
		bucket['font-face-numeric-fraction-values'],
		slashed-zero,
		bucket['font-face-east-asian-variant-values'],
		bucket['font-face-east-asian-width-values']
	], fffv);

	if (! hits) {
		fffv.debug('parse fail');
		return null;
	}

	fffv.fontValidation();
	fffv.debug('parse success - css3', fffv.unparsed);
	return fffv;
};

});

require.define("/css/values/font-face-historical-lig-values.js", function (require, module, exports, __dirname, __filename) {
/* <font-face-historical-lig-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: historical-ligatures | no-historical-ligatures
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-historical-lig-values",

	allowed: [
		{
			validation: [],
			values: [
				"historical-ligatures",
				"no-historical-ligatures"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


});

require.define("/css/values/font-face-numeric-figure-values.js", function (require, module, exports, __dirname, __filename) {
/* <font-face-numerical-figure-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: lining-nums | oldstyle-nums
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-numeric-figure-values",

	allowed: [
		{
			validation: [],
			values: [
				"lining-nums",
				"oldstyle-nums"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


});

require.define("/css/values/font-face-numeric-fraction-values.js", function (require, module, exports, __dirname, __filename) {
/* <font-face-numerical-fraction-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: diagonal-fractions | stacked-fractions
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-numeric-fraction-values",

	allowed: [
		{
			validation: [],
			values: [
				"diagonal-fractions",
				"stacked-fractions"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


});

require.define("/css/values/font-face-numeric-spacing-values.js", function (require, module, exports, __dirname, __filename) {
/* <font-face-numerical-spacing-values>
 *
 * This does not emit a CSS3 warning
 *
 * CSS3: proportional-nums | tabular-nums
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "font-face-numeric-spacing-values",

	allowed: [
		{
			validation: [],
			values: [
				"proportional-nums",
				"tabular-nums"
			]
		}
	]
});

exports.parse = base.simpleParser(Val);


});

require.define("/css/values/font-face-ornaments.js", function (require, module, exports, __dirname, __filename) {
/* font-face-ornaments
 *
 * ornaments( WS? <feature-value-name> WS? )
 *
 * feature-value-name is <font-family-single>
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Func = base.baseConstructor();

util.extend(Func.prototype, base.base, {
	name: "font-face-ornaments"
});


exports.parse = function (unparsedReal, bucket, container) {
	var f = new Func(bucket, container, unparsedReal);
	f.debug('parse', f.unparsed);

	if (! f.functionParser('ornaments(', bucket['font-family-single'])) {
		f.debug('parse fail');
		return null;
	}

	f.debug('parse success');
	return f;
};

});

require.define("/css/values/font-face-styleset.js", function (require, module, exports, __dirname, __filename) {
/* font-face-styleset
 *
 * styleset( WS? <feature-value-name> WS? [ COMMA WS? <feature-value-name WS? ]* )
 *
 * feature-value-name is <font-family-single>
 * With commas, this looks like styleset(<font-family>)
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Func = base.baseConstructor();

util.extend(Func.prototype, base.base, {
	name: "font-face-styleset"
});


exports.parse = function (unparsedReal, bucket, container) {
	var f = new Func(bucket, container, unparsedReal);
	f.debug('parse', f.unparsed);

	if (! f.functionParser('styleset(', bucket['font-family'])) {
		f.debug('parse fail');
		return null;
	}

	f.debug('parse success');
	return f;
};

});

require.define("/css/values/font-face-stylistic.js", function (require, module, exports, __dirname, __filename) {
/* font-face-stylistic
 *
 * stylistic( WS? <feature-value-name> WS? )
 *
 * feature-value-name is <font-family-single>
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Func = base.baseConstructor();

util.extend(Func.prototype, base.base, {
	name: "font-face-stylistic"
});


exports.parse = function (unparsedReal, bucket, container) {
	var f = new Func(bucket, container, unparsedReal);
	f.debug('parse', f.unparsed);

	if (! f.functionParser('stylistic(', bucket['font-family-single'])) {
		f.debug('parse fail');
		return null;
	}

	f.debug('parse success');
	return f;
};

});

require.define("/css/values/font-face-swash.js", function (require, module, exports, __dirname, __filename) {
/* font-face-swash
 *
 * swash( WS? <feature-value-name> WS? )
 *
 * feature-value-name is <font-family-single>
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Func = base.baseConstructor();

util.extend(Func.prototype, base.base, {
	name: "font-face-swash"
});


exports.parse = function (unparsedReal, bucket, container) {
	var f = new Func(bucket, container, unparsedReal);
	f.debug('parse', f.unparsed);

	if (! f.functionParser('swash(', bucket['font-family-single'])) {
		f.debug('parse fail');
		return null;
	}

	f.debug('parse success');
	return f;
};

});

require.define("/css/values/font-family-generic-name.js", function (require, module, exports, __dirname, __filename) {
/* <font-family-generic-name>
 *
 * Special keyword-based generic font families.  Since these are keywords, you can not quote them.
 *
 * CSS2:  serif | sans-serif | cursive | fantasy | monospace
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontFamilyGenericName = base.baseConstructor();

util.extend(FontFamilyGenericName.prototype, base.base, {
	name: "font-family-generic-name",

	allowed: [
		{
			validation: [],
			values: [
				"serif",
				"sans-serif",
				"cursive",
				"fantasy",
				"monospace"
			]
		},
		{
			validation: [
				validate.shouldNotBeQuoted()
			],
			values: [
				"'serif'",
				"'sans-serif'",
				"'cursive'",
				"'fantasy'",
				"'monospace'",
				'"serif"',
				'"sans-serif"',
				'"cursive"',
				'"fantasy"',
				'"monospace"'
			]
		},
		{
			validation: [
				validate.reserved()
			],
			values: [
				"initial",
				"default"
			]
		}
	]
});

exports.parse = base.simpleParser(FontFamilyGenericName);

});

require.define("/css/values/font-family.js", function (require, module, exports, __dirname, __filename) {
/* <font-family>
 *
 * CSS1:  [ <font-family-name> | <font-family-generic-name> ]#
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontFamily = base.baseConstructor();

util.extend(FontFamily.prototype, base.base, {
	name: "font-family"
});

exports.parse = function (unparsedReal, bucket, container) {
	var ff = new FontFamily(bucket, container, unparsedReal);
	ff.debug('parse', unparsedReal);

	if (ff.handleInherit()) {
		return ff;
	}

	var genericCount = 0;
	var genericWasLast = false;
	var keepGoing = true;
	ff.repeatWithCommas = true;
	var hits = ff.repeatParser([ bucket['font-family-generic-name'], bucket['font-family-name'] ]);

	if (! hits) {
		return null;
	}

	ff.list.forEach(function (item) {
		if (item.name != 'font-family-generic-name') {
			genericWasLast = false;
		} else {
			genericCount ++;
			genericWasLast = true;
		}
	});

	if (! genericWasLast || genericCount != 1) {
		ff.addWarning('font-family-one-generic', bucket.propertyToken);
	}

	ff.warnIfInherit();

	return ff;
};

});

require.define("/css/values/font-family-name.js", function (require, module, exports, __dirname, __filename) {
/* <font-family-name>
 *
 * Any single font name
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var FontFamilyName = base.baseConstructor();

util.extend(FontFamilyName.prototype, base.base, {
	name: "font-family-name"
});


exports.parse = function (unparsed, bucket, container) {
	// Font family names can be either a quoted string (used verbatim)
	// or at least one token.  If it is not quoted, all whitespace at
	// the beginning and end are removed and whitespace between tokens
	// is changed into single spaces.
	var ffn = new FontFamilyName(bucket, container, unparsed);
	ffn.debug('parse', unparsed);

	if (ffn.unparsed.isType('STRING')) {
		ffn.add(ffn.unparsed.advance());
		ffn.debug('parse success - string');
		return ffn;
	}

	if (! ffn.unparsed.isType('IDENT')) {
		ffn.debug('parse fail');
		return null;
	}

	// CSS3 spec clears up that a font name must be either a string
	// or a series of identifiers
	while (ffn.unparsed.isType('IDENT')) {
		ffn.add(ffn.unparsed.advance());
	}

	ffn.debug('parse success - ident');
	return ffn;
};

});

require.define("/css/values/font-family-single.js", function (require, module, exports, __dirname, __filename) {
/* <font-family-single>
 *
 * CSS1:  [ <font-family-name> | <font-family-generic-name> ]
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var FontFamilySingle = base.baseConstructor();

util.extend(FontFamilySingle.prototype, base.base, {
	name: "font-family-single",

	allowed: [
		{
			validation: [],
			valueObjects: [
				"font-family-name",
				"font-family-generic-name"
			]
		}
	]
});

exports.parse = base.simpleParser(FontFamilySingle);

});

require.define("/css/values/font.js", function (require, module, exports, __dirname, __filename) {
/* <font>
 *
 * CSS1:  [<font-style> || <font-variant> || <font-weight>]? <font-size> [/ <line-height>]? <font-family>
 * CSS2:  caption | icon | menu | message-box | small-caption | status-bar | inherit
 * CSS3:  Limits <font-variant> to just <font-variant-css21>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Font = base.baseConstructor();

util.extend(Font.prototype, base.base, {
	name: "font"
});


exports.parse = function (unparsedReal, bucket, container) {
	var font = new Font(bucket, container, unparsedReal);
	font.debug('parse', unparsedReal);

	if (font.handleInherit()) {
		return font;
	}

	if (font.unparsed.isContent([ 
		'caption',
		'icon',
		'menu',
		'message-box',
		'small-caption',
		'status-bar'
	])) {
		font.add(font.unparsed.advance());
		validate.call(font, 'minimumCss', font.firstToken(), 2);
		return font;
	}

	var hits = font.unparsed.matchAnyOrder([
		bucket['font-style'],
		bucket['font-variant-css21'],
		bucket['font-weight']	
	], font);

	var fs = bucket['font-size'].parse(font.unparsed, bucket, font);

	if (! fs) {
		font.debug('parse fail - no font size', font.unparsed);
		return null;
	}

	font.add(fs);
	font.unparsed = fs.unparsed;

	if (font.unparsed.isContent('/')) {
		font.add(font.unparsed.advance());
		var lh = bucket['line-height'].parse(font.unparsed, bucket, font);

		if (! lh) {
			font.debug('parse fail - no line height');
			return null;
		}

		font.add(lh);
		font.unparsed = lh.unparsed;
	}

	var ff = bucket['font-family'].parse(font.unparsed, bucket, font);

	if (ff) {
		font.add(ff);
		font.unparsed = ff.unparsed;
	}

	font.warnIfInherit();
	font.debug('parse success', font.unparsed);
	return font;
};

});

require.define("/css/values/font-size.js", function (require, module, exports, __dirname, __filename) {
/* <font-size>
 *
 * CSS1:  xx-small | x-small | small | medium | large | x-large | xx-large
 * CSS1:  larger | smaller | <length> | <percentage>
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
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
			valueObjects: [ 
				'length',
				'percentage'
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
				'smaller'
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

require.define("/css/values/font-style.js", function (require, module, exports, __dirname, __filename) {
/* <font-style>
 *
 * CSS1: normal | italic | oblique  
 * CSS2:  inherit
 *
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontStyle = base.baseConstructor();

util.extend(FontStyle.prototype, base.base, {
	name: "font-style",

	allowed: [
		{
			validation: [],
			values: [ 
				'normal',
				'italic',
				'oblique'
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

exports.parse = base.simpleParser(FontStyle);

});

require.define("/css/values/font-variant-css21.js", function (require, module, exports, __dirname, __filename) {
/* <font-variant-css21>
 *
 * CSS1: normal | small-caps
 * CSS2: inherit
 *
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontVariantCss21 = base.baseConstructor();

util.extend(FontVariantCss21.prototype, base.base, {
	name: "font-variant-css21",

	allowed: [
		{
			validation: [],
			values: [ 
				'normal',
				'small-caps'
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

exports.parse = base.simpleParser(FontVariantCss21);

});

require.define("/css/values/font-weight.js", function (require, module, exports, __dirname, __filename) {
/* <font-weight>
 *
 * CSS1:  normal | bold | bolder | lighter
 * CSS1:  100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontSize = base.baseConstructor();

// TODO:  "normal" == "400" and "bold" == "700"
util.extend(FontSize.prototype, base.base, {
	name: "font-weight",

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

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Height = base.baseConstructor();

util.extend(Height.prototype, base.base, {
	name: "height",

	allowed: [
		{
			validation: [
				validate.positiveValue()
			],
			valueObjects: [ 
				'length'	
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
				validate.minimumCss(2),
				validate.positiveValue()
			],
			valueObjects: [ 
				'percentage'
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

require.define("/css/values/hsla.js", function (require, module, exports, __dirname, __filename) {
/* hsla( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} {w})
 *
 * Used to define colors
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var HSLA = base.baseConstructor();

util.extend(HSLA.prototype, base.base, {
	name: "hsla"
});

exports.parse = function (unparsed, bucket, container) {
	var hsla = new HSLA(bucket, container, unparsed);
	hsla.debug('parse', unparsed);

	if (! hsla.functionParser('hsla(', 
		[ bucket['number'], bucket['percentage'] ],
		[ bucket['number'], bucket['percentage'] ],
		[ bucket['number'], bucket['percentage'] ],
		bucket['number'])) {
		return null;
	}

	hsla.validateColorValues();
	hsla.debug('parse success');
	return hsla;
};

});

require.define("/css/values/hsl.js", function (require, module, exports, __dirname, __filename) {
/* hsl( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} )
 *
 * Used to define colors
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var HSL = base.baseConstructor();

util.extend(HSL.prototype, base.base, {
	name: "hsl"
});

exports.parse = function (unparsed, bucket, container) {
	var hsl = new HSL(bucket, container, unparsed);
	hsl.debug('parse', unparsed);

	if (! hsl.functionParser('hsl(', 
		[ bucket['number'], bucket['percentage'] ],
		[ bucket['number'], bucket['percentage'] ],
		[ bucket['number'], bucket['percentage'] ])) {
		return null;
	}

	hsl.validateColorValues();
	hsl.debug('parse success');
	return hsl;
};

});

require.define("/css/values/ident.js", function (require, module, exports, __dirname, __filename) {
/* <ident>
 *
 * Basic data type used in simple parsers
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Ident = base.baseConstructor();

util.extend(Ident.prototype, base.base, {
	name: "ident"
});


exports.parse = function (unparsedReal, bucket, container) {
	var ident = new Ident(bucket, container, unparsedReal);
	ident.debug('parse', unparsedReal);

	if (ident.unparsed.isType('IDENT')) {
		ident.add(ident.unparsed.advance());
		return ident;
	}

	return null;
};

});

require.define("/css/values/length.js", function (require, module, exports, __dirname, __filename) {
/* <length>
 *
 * Lengths can be 0 (without a unit identifier) or a UNIT token that represents
 * either an absolute or relative length.
 */

"use strict";

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
				"0"
			]
		},
		{
			validation: [
				validate.numberPortionIsNotZero()
			],
			values: [
				base.makeRegexp('[-+]?{n}(em|ex)')
			]
		},
		{
			validation: [
				validate.numberPortionIsNotZero(),
				validate.suggestUsingRelativeUnits()
			],
			values: [ 
				// px were made an absolute length as of CSS2.1
				base.makeRegexp('[-+]?{n}(in|cm|mm|pt|pc|px)')
			]
		},
		{
			validation: [
				validate.numberPortionIsNotZero(),
				validate.minimumCss(3)
			],
			values: [ 
				base.makeRegexp('[-+]?{n}(ch|rem|vw|vh|vm)')
			]
		}
	],

	getUnit: function () {
		var out = this.firstToken().content.replace(/[-+0-9.]/g, '');
		return out;
	},

	// Strip unit
	getValue: function () {
		var out = this.firstToken().content.replace(/[^-+0-9.]/g, '');
		return out;
	},

	// Add unit back
	setValue: function (newValue) {
		this.firstToken().content = newValue.toString() + this.getUnit();
	},

	toString: function () {
		this.debug('toString');
		var unit = this.firstToken().content;

		if (this.bucket.options.autocorrect) {
			if (unit.match(/^[-+]?0+([a-z]+)?$/)) {
				unit = '0';  // No need for a unit designator - may actually cause problems
			} else {
				unit = unit.replace(/^-0+/, '-').replace(/^0+/, '');
			}
		}

		return unit;
	}
});

exports.parse = base.simpleParser(Length);

});

require.define("/css/values/line-height.js", function (require, module, exports, __dirname, __filename) {
/* <line-height>
 *
 * CSS1:  normal | <number> | <length> | <percentage>
 * CSS2:  inherit
 * CSS3:  none
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var LineHeight = base.baseConstructor();

util.extend(LineHeight.prototype, base.base, {
	name: "line-height",

	allowed: [
		{
			validation: [],
			values: [
				"normal"
			]
		},
		{
			validation: [
				validate.positiveValue()
			],
			valueObjects: [
				'number',
				'length',
				'percentage'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"inherit"
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"none"
			]
		}
	]
});

exports.parse = base.simpleParser(LineHeight);

});

require.define("/css/values/list-style-image.js", function (require, module, exports, __dirname, __filename) {
 /* <list-style-image>
 *
 * CSS1: <url> | none
 * CSS2: inherit
 * 
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var ListStyleImage = base.baseConstructor();

util.extend(ListStyleImage.prototype, base.base, {
	name: "list-style-image",

	allowed: [
		{
			validation: [],
			values: [
				"none"
			],
			valueObjects: [
				'url'
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

exports.parse = base.simpleParser(ListStyleImage);


});

require.define("/css/values/list-style.js", function (require, module, exports, __dirname, __filename) {
/* <list-style>
 *
 * CSS1: <list-style-type> | <list-style-position> | <list-style-image>
 * CSS2: inherit
 *
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var ListStyle = base.baseConstructor();

util.extend(ListStyle.prototype, base.base, {
	name: "list-style",

	allowed: [
		{
                        validation: [
                                validate.minimumCss(2)
                        ],
                        values: [
                                "inherit"
                        ]
                },
		{
			validation: [],
			valueObjects:[
				'list-style-type',
				'list-style-position',
				'list-style-image'
			]
		}
	]
});

exports.parse = base.simpleParser(ListStyle);


});

require.define("/css/values/list-style-position.js", function (require, module, exports, __dirname, __filename) {
 /* <list-style-position>
 *
 * CSS1: inside | outside
 * CSS2: inherit
 * CSS3: hanging 
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var ListStylePosition = base.baseConstructor();

util.extend(ListStylePosition.prototype, base.base, {
	name: "list-style-position",

	allowed: [
		{
			validation: [],
			values: [
				"inside",
				"outside",
				"none"
			]
		
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"inherit"
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"hanging"
			]
		}
		
	]
});

exports.parse = base.simpleParser(ListStylePosition);


});

require.define("/css/values/list-style-type.js", function (require, module, exports, __dirname, __filename) {
/* <list-style-type>
 *
 * CSS1:  disc | circle | square | decimal | lower-roman | upper-roman | lower-alpha | upper-alpha | none
 * CSS2:  disc | circle | square | decimal | decimal-leading-zero | lower-roman | upper-roman | lower-greek | lower-alpha | lower-latin | upper-alpha | upper-latin | hebrew | armenian | georgian | cjk-ideographic | hiragana | katakana | hiragana-iroha | katakana-iroha | none | inherit
 * CSS2.1:  disc | circle | square | decimal | decimal-leading-zero | lower-roman | upper-roman | lower-greek | lower-latin | upper-latin | armenian | georgian | lower-alpha | upper-alpha | none | inherit
 *
 * And, of course CSS3 - brace yourself
 * CSS3:  <string> | <counter-style> | inline | none
 *  counter-style:  predefined-repeating-style | predefined-numeric-style | predefined-alphabetic-style | predefined-symbolic-style | predefined-nonrepeating-style | predefined-additive-style
 *  predefined-repeating-style:  box | check | circle | diamond | disc | dash | square
 *  predefined-numeric-style:  arabic-indic | bengali | binary | burmese | cambodian | cjk-decimal | decimal | devanagari | eastern-nagari | fullwidth-decimal | gujarati | gurmukhi | kannada | khmer | lower-hexadecimal | lao | lepcha | malayalam | marathi | mongolian | myanmar | new-base-60 | octal | oriya | persian | super-decimal | tamil | telugu | tibetan | thai | upper-hexadecimal
 *  predefined-alphabetic-style:  afar | agaw | ari | blin | cjk-earthly-branch | cjk-heavenly-stem | dizi | fullwidth-lower-alpha | fullwidth-upper-alpha | gedeo | gumuz | hadiyya | harari | hindi | hiragana-iroha | hiragana | kaffa | katakana-iroha | katakana | kebena | kembata | konso | korean-consonant | korean-syllable | kunama | lower-alpha | lower-belorussian | lower-bulgarian | lower-greek | lower-macedonian | lower-oromo-qubee | lower-russian | lower-russian-full | lower-serbo-croatian | lower-ukrainian | lower-ukrainian-full | meen | oromo | saho | sidama | silti | thai-alphabetic | tigre | upper-alpha | upper-belorussian | upper-bulgarian | upper-macedonian | upper-oromo-qubee | upper-russian | upper-russian-full | upper-serbo-croatian | upper-ukrainian | upper-ukrainian-full | wolaita | yemsa
 *  predefined-symbolic-style:  asterisks | footnotes | lower-alpha-symbolic | upper-alpha-symbolic
 *  predefined-nonrepeating-style:  circled-decimal | circled-lower-latin | circled-upper-latin | circled-korean-consonants | circled-korean-syllables | decimal-leading-zero | dotted-decimal | double-circled-decimal | filled-circled-decimal | fullwidth-upper-roman | fullwidth-lower-roman | parenthesized-decimal | parenthesized-lower-latin | parenthesized-hangul-consonants | parenthesized-hangul-syllable | persian-abjad | persian-alphabetic
 *  predefined-additive-style:  hebrew | simple-upper-roman | simple-lower-roman | upper-roman | lower-roman | lower-armenian | upper-armenian | armenian | georgian | ancient-tamil | japanese-informal | japanese-formal | korean-hangul-formal | korean-hanja-informal | korean-hanja-formal | greek
 *  complex-style:  ethiopian-numeric (not ethiopic-numeric) | simp-chinese-informal | simp-chinese-formal | trad-chinese-informal | trad-chinese-formal | cjk-ideographic
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var ListStyleType = base.baseConstructor();

util.extend(ListStyleType.prototype, base.base, {
	name: "list-style-type",

	allowed: [
		{
			validation: [],
			values: [
				"circle",
				"decimal",
				"disc",
				"lower-alpha",
				"lower-roman",
				"none",
				"square",
				"upper-alpha",
				"upper-roman"
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"armenian",
				"decimal-leading-zero",
				"georgian",
				"inherit",
				"lower-greek"
			]
		},
		{
			validation: [
				validate.minimumCss(2),
				validate.unsupportedCss(2.1)  // But they're back in CSS3
			],
			values: [
				"cjk-ideographic",
				"hebrew",
				"hiragana",
				"hiragana-iroha",
				"katakana",
				"katakana-iroha"
			]
		},
		{
			validation: [
				validate.minimumCss(2),
				validate.maximumCss(2.1)
			],
			values: [
				"lower-latin",
				"upper-latin"
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			valueObjects: [
				'string'
			],
			// Keep in mind that no duplicates of above keywords will
			// be added to these lists
			values: [
				// Predefined repeating styles
				"box",
				"check",
				"dash",
				"diamond",

				// Predefined numeric styles
				"arabic-indic",
				"bengali",
				"binary",
				"burmese",
				"cambodian",
				"cjk-decimal",
				"devanagari",
				"eastern-nagari",
				"fullwidth-decimal",
				"gujarati",
				"gurmukhi",
				"kannada",
				"khmer",
				"lao",
				"lepcha",
				"lower-hexadecimal",
				"malayalam",
				"marathi",
				"mongolian",
				"myanmar",
				"new-base-60",
				"octal",
				"oriya",
				"persian",
				"super-decimal",
				"tamil",
				"telugu",
				"thai",
				"tibetan",
				"upper-hexadecimal",

				// Predefined alphabetic styles
				"afar",
				"agaw",
				"ari",
				"blin",
				"cjk-earthly-branch",
				"cjk-heavenly-stem",
				"dizi",
				"fullwidth-lower-alpha",
				"fullwidth-upper-alpha",
				"gedeo",
				"gumuz",
				"hadiyya",
				"harari",
				"hindi",
				"kaffa",
				"kebena",
				"kembata",
				"konso",
				"korean-consonant",
				"korean-syllable",
				"kunama",
				"lower-belorussian",
				"lower-bulgarian",
				"lower-macedonian",
				"lower-oromo-qubee",
				"lower-russian-full",
				"lower-russian",
				"lower-serbo-croatian",
				"lower-ukrainian-full",
				"lower-ukrainian",
				"meen",
				"oromo",
				"saho",
				"sidama",
				"silti",
				"thai-alphabetic",
				"tigre",
				"upper-belorussian",
				"upper-bulgarian",
				"upper-macedonian",
				"upper-oromo-qubee",
				"upper-russian-full",
				"upper-russian",
				"upper-serbo-croatian",
				"upper-ukrainian-full",
				"upper-ukrainian",
				"wolaita",
				"yemsa",

				// Predefined symbolic styles
				"asterisks",
				"footnotes",
				"lower-alpha-symbolic",
				"upper-alpha-symbolic",

				// Predefined nonrepeating styles
				"circled-decimal",
				"circled-korean-consonants",
				"circled-korean-syllables",
				"circled-lower-latin",
				"circled-upper-latin",
				"dotted-decimal",
				"double-circled-decimal",
				"filled-circled-decimal",
				"fullwidth-lower-roman",
				"fullwidth-upper-roman",
				"parenthesized-decimal",
				"parenthesized-hangul-consonants",
				"parenthesized-hangul-syllable",
				"parenthesized-lower-latin",
				"persian-abjad",
				"persian-alphabetic",

				// Predefined additive styles
				"ancient-tamil",
				"greek",
				"japanese-formal",
				"japanese-informal",
				"korean-hangul-formal",
				"korean-hanja-formal",
				"korean-hanja-informal",
				"lower-armenian",
				"simple-lower-roman",
				"simple-upper-roman",
				"upper-armenian",
				
				// Complex styles
				"ethiopian-numeric",  // Careful - not "ethiopic-numeric" regardless what section 10.2 of the spec is named
				"simp-chinese-formal",
				"simp-chinese-informal",
				"trad-chinese-formal",
				"trad-chinese-informal"
			]
		}
	]
});

exports.parse = base.simpleParser(ListStyleType);


});

require.define("/css/values/margin.js", function (require, module, exports, __dirname, __filename) {
/* margin
 *
 * CSS1:  <margin-width>{1,4}
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Margin = base.baseConstructor();

util.extend(Margin.prototype, base.base, {
	name: "margin"
});


exports.parse = function (unparsedReal, bucket, container) {
	var margin = new Margin(bucket, container, unparsedReal);
	margin.debug('parse', unparsedReal);

	if (margin.handleInherit()) {
		return margin;
	}

	var hits = margin.repeatParser(bucket['margin-width'], 4);

	if (! hits) {
		margin.debug('parse fail - too few widths');
		return null;
	}

	margin.warnIfInherit();
	margin.debug('parse success', margin.unparsed);
	return margin;
};

});

require.define("/css/values/margin-width.js", function (require, module, exports, __dirname, __filename) {
/* <margin-width>
 *
 * Used for matching margin and margin-* properties.
 *
 * CSS1: <length> | <percentage> | auto
 * CSS2: inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var MarginWidth = base.baseConstructor();

util.extend(MarginWidth.prototype, base.base, {
	name: "margin-width",

	allowed: [
		{
			validation: [],
			values: [ 
				'auto'
			],
			valueObjects: [
				'length',
				'percentage'
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

require.define("/css/values/max-length.js", function (require, module, exports, __dirname, __filename) {
/* <max-length>
 *
 * Used for the max-width and max-height properties
 *
 * CSS2:  <length> | <percentage> | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var MaxLength = base.baseConstructor();

util.extend(MaxLength.prototype, base.base, {
	name: "max-length",

	allowed: [
		{
			validation: [
				validate.minimumCss(2),
				validate.positiveValue()
			],
			values: [
				"none",
				"inherit"
			],
			valueObjects: [
				'length',
				'percentage'
			]
		}
	]
});

exports.parse = base.simpleParser(MaxLength);

});

require.define("/css/values/min-length.js", function (require, module, exports, __dirname, __filename) {
/* <min-length>
 *
 * Used for the min-width and min-height properties
 *
 * CSS2:  <length> | <percentage> | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var MinLength = base.baseConstructor();

util.extend(MinLength.prototype, base.base, {
	name: "min-length",

	allowed: [
		{
			validation: [
				validate.minimumCss(2),
				validate.positiveValue()
			],
			values: [
				"inherit"
			],
			valueObjects: [
				'length',
				'percentage'
			]
		}
	]
});

exports.parse = base.simpleParser(MinLength);

});

require.define("/css/values/minmax.js", function (require, module, exports, __dirname, __filename) {
/* <minmax>
 *
 * Used by <col-width>
 * minmax( WS? p WS? , WS? q WS? )
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Minmax = base.baseConstructor();

util.extend(Minmax.prototype, base.base, {
	name: "minmax"
});


exports.parse = function (unparsed, bucket, container) {
	var minmax = new Minmax(bucket, container, unparsed);
	minmax.debug('parse', unparsed);

	if (! minmax.functionParser('minmax(',
		[ bucket['length'], "max-content", "min-content", "*" ],
		[ bucket['length'], "max-content", "min-content", "*" ])) {
		return null;
	}

	var P = minmax.list[1];
	var Q = minmax.list[2];

	if (P.name && P.name == 'length' && Q.name && Q.name == 'length') {
		// CSS spec says if P > Q, assume minmax(P,P)
		// TODO:  Find a way to compare across units
		if (P.getUnit() == Q.getUnit() && P.getValue() > Q.getValue()) {
			minmax.addWarning('minmax-p-q', minmax.firstToken());
		}
	}

	minmax.debug('parse success', minmax.unparsed);
	validate.call(minmax, 'minimumCss', minmax.firstToken(), 3);
	return minmax;
};

});

require.define("/css/values/ms-progress-appearance.js", function (require, module, exports, __dirname, __filename) {
/* -ms-progress-appearance
 *
 * IE8:  bar | ring
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var ProgressAppearance = base.baseConstructor();

util.extend(ProgressAppearance.prototype, base.base, {
	name: "ms-progress-appearance",

	allowed: [
		{
			validation: [
				validate.browserOnly('ie8')
			],
			values: [
				"bar",
				"ring"
			]
		
		}
	]
});

exports.parse = base.simpleParser(ProgressAppearance);


});

require.define("/css/values/number.js", function (require, module, exports, __dirname, __filename) {
/* <number>
 *
 * Numbers can be negative or positive numbers and may be floats.
 */

"use strict";

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
		return (+ this.firstToken().content);
	},

	setValue: function (newValue) {
		this.firstToken().content = newValue.toString();
	}
});

exports.parse = base.simpleParser(Num);

});

require.define("/css/values/offset.js", function (require, module, exports, __dirname, __filename) {
/* <offset>
 *
 * Used for the left, right, top and bottom properties
 *
 * CSS2:  <length> | <percentage> | auto | inherit
 * CSS3:  Drops support for auto
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Offset = base.baseConstructor();

util.extend(Offset.prototype, base.base, {
	name: "offset",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"auto",
				"inherit"
			],
			valueObjects: [
				'length',
				'percentage'
			]
		}
	]
});

exports.parse = base.simpleParser(Offset);

});

require.define("/css/values/opacity.js", function (require, module, exports, __dirname, __filename) {
/* <opacity>
 *
 * CSS3: inherit | <alphavalue>
 *
 * <alphavalue> is a number from 0.0 to 1.0
 *
 * TODO:  Should also specify "filter: alpha(opacity=40)" for IE8 and earlier
 * TODO:  Check if "filter: progid:DXImageTransform.Microsoft.Alpha(opacity=40)"
 * is still used?  Should work through IE8 according to MSDN
 * http://msdn.microsoft.com/en-us/library/ms532967(v=vs.85).aspx
 * TODO:  Point to this reference:
 * http://css-tricks.com/css-transparency-settings-for-all-broswers/
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Opacity = base.baseConstructor();

util.extend(Opacity.prototype, base.base, {
	name: "opacity",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				'inherit'
			]
		},
		{
			validation: [
				validate.minimumCss(3),
				validate.withinRange(0.0, 1.0)
			],
			valueObjects: [
				'number'
			]
		}
	]
});

exports.parse = base.simpleParser(Opacity);

});

require.define("/css/values/outline-color.js", function (require, module, exports, __dirname, __filename) {
/* <outline-color>
 *
 * Used for matching outline-color properties.
 *
 * CSS2: <color> | invert | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var OutlineColor = base.baseConstructor();

util.extend(OutlineColor.prototype, base.base, {
	name: "outline-color",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'invert',
				'inherit'
			],
			valueObjects: [
				'color'
			]
		}
	]
});

exports.parse = base.simpleParser(OutlineColor);

});

require.define("/css/values/outline.js", function (require, module, exports, __dirname, __filename) {
/* <outline>
 *
 * CSS2: [ <outline-width> || <outline-style> || <outline-color> ] | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Outline = base.baseConstructor();

util.extend(Outline.prototype, base.base, {
	name: "outline"
});


exports.parse = function (unparsedReal, bucket, container) {
	var outline = new Outline(bucket, container, unparsedReal);
	var unparsed = outline.unparsed.clone();
	outline.debug('parse', unparsedReal);

	if (outline.handleInherit()) {
		return outline;
	}

	var hits = unparsed.matchAnyOrder([
		bucket['outline-width'],
		bucket['outline-style'],
		bucket['outline-color']	
	], outline);

	if (! hits) {
		outline.debug('parse fail');
		return null;
	}

	outline.debug('parse success', outline.unparsed);
	outline.warnIfInherit();
	return outline;
};

});

require.define("/css/values/outline-style.js", function (require, module, exports, __dirname, __filename) {
/* <outline-style>
 *
 * Used for matching outline-style properties.
 *
 * CSS2: <border-style-single> | inherit
 * CSS3: auto
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var OutlineStyle = base.baseConstructor();

util.extend(OutlineStyle.prototype, base.base, {
	name: "outline-style",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'inherit'
			],
			valueObjects: [
				'border-style-single'
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				'auto'
			]
		}	
	]
});

exports.parse = base.simpleParser(OutlineStyle);

});

require.define("/css/values/outline-width.js", function (require, module, exports, __dirname, __filename) {
/* <outline-width>
 *
 * Used for matching outline-width properties.
 *
 * CSS2: <border-width> | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var OutlineWidth = base.baseConstructor();

util.extend(OutlineWidth.prototype, base.base, {
	name: "outline-width",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'inherit'
			],
			valueObjects: [
				'border-width-single'
			]
		}	
	]
});

exports.parse = base.simpleParser(OutlineWidth);

});

require.define("/css/values/overflow-dimension.js", function (require, module, exports, __dirname, __filename) {
/* <overflow-dimension>
 *
 * Used for the overflow-x and overflow-y properties
 *
 * CSS3:  visible | hidden | scroll | auto | no-display | no-content | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var OverflowDimension = base.baseConstructor();

util.extend(OverflowDimension.prototype, base.base, {
	name: "overflow-dimension",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"visible",
				"hidden",
				"scroll",
				"auto",
				"no-display",
				"no-content",
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(OverflowDimension);

});

require.define("/css/values/overflow.js", function (require, module, exports, __dirname, __filename) {
/* <overflow>
 *
 * CSS2:  visible | hidden | scroll | auto | inherit
 * CSS3:  <overflow-dimension>{1,2}
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Overflow = base.baseConstructor();

util.extend(Overflow.prototype, base.base, {
	name: "overflow"
});

exports.parse = function (unparsedReal, bucket, container) {
	var overflow = new Overflow(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	overflow.debug('parse', unparsedReal);

	if (overflow.handleInherit()) {
		return overflow;
	}

	// Check for CSS2 definition
	// Don't use overflowDimension here since that will add a
	// CSS3 warning automatically
	var result = unparsed.matchAny([ 'visible', 'hidden', 'scroll', 'auto' ], overflow);

	if (result) {
		overflow.add(result);
		overflow.unparsed = result.unparsed;
		validate.call(overflow, 'minimumCss', overflow.firstToken(), 2);

		if (! result.unparsed.firstToken()) {
			// No more tokens, so this is CSS 2
			return overflow;
		}
	} else {
		overflow = null;
	}

	// Tokens were left over, so this could be CSS3.
	// Start again with a new copy of the unparsed tokens.
	var overflow3 = new Overflow(bucket, container, unparsedReal);
	unparsed = unparsedReal.clone();
	result = bucket['overflow-dimension'].parse(unparsed, bucket, overflow3);
	
	if (! result) {
		return overflow;
	}

	// The CSS3 warning is added automatically by overflowDimension
	overflow3.add(result);
	unparsed = result.unparsed;
	result = bucket['overflow-dimension'].parse(unparsed, bucket, overflow3);

	if (result) {
		overflow3.add(result);
		unparsed = result.unparsed;
	}

	overflow3.unparsed = unparsed;
	overflow3.warnIfInherit();

	if (overflow && overflow.unparsed.length() == overflow3.unparsed.length()) {
		return overflow;
	}

	return overflow3;
};

});

require.define("/css/values/padding.js", function (require, module, exports, __dirname, __filename) {
/* padding
 *
 * CSS1:  <padding-width>{1,4}
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Padding = base.baseConstructor();

util.extend(Padding.prototype, base.base, {
	name: "padding"
});


exports.parse = function (unparsedReal, bucket, container) {
	var padding = new Padding(bucket, container, unparsedReal);
	padding.debug('parse', unparsedReal);

	if (padding.handleInherit()) {
		return padding;
	}

	var hits = padding.repeatParser(bucket['padding-width'], 4);

	if (! hits) {
		padding.debug('parse fail - too few widths');
		return null;
	}

	padding.warnIfInherit();
	padding.debug('parse success', padding.unparsed);
	return padding;
};

});

require.define("/css/values/padding-width.js", function (require, module, exports, __dirname, __filename) {
/* <padding-width>
 *
 * Used for matching padding and padding-* properties.
 *
 * CSS1: <length> | <percentage> | auto
 * CSS2: inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var PaddingWidth = base.baseConstructor();

util.extend(PaddingWidth.prototype, base.base, {
	name: "padding-width",

	allowed: [
		{
			validation: [
				validate.positiveValue()
			],
			values: [ 
				'auto'
			],
			valueObjects: [
				'length',
				'percentage'
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

exports.parse = base.simpleParser(PaddingWidth);

});

require.define("/css/values/percentage.js", function (require, module, exports, __dirname, __filename) {
/* <percentage>
 *
 * Percentages should be integer values from 0.  CSS1 allows floating
 * point numbers, but CSS2 does not.  Allow reading them, but round to the
 * nearest integer.
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Percentage = base.baseConstructor();

util.extend(Percentage.prototype, base.base, {
	name: "percentage",

	allowed: [
		{
			validation: [
				validate.numberPortionIsInteger()
			],
			values: [ 
				base.makeRegexp('[-+]?{n}%')
			]
		}
	],

	getValue: function () {
		var v = this.firstToken().content;
		v = v.substr(0, v.length - 1);
		return v;
	},

	setValue: function (newValue) {
		this.firstToken().content = newValue.toString() + '%';
	},

	toString: function () {
		this.debug('toString');
		var v = this.getValue();

		if (this.bucket.options.autocorrect) {
			v = Math.round(v);
		}

		return v + '%';
	}
});

exports.parse = base.simpleParser(Percentage);

});

require.define("/css/values/position.js", function (require, module, exports, __dirname, __filename) {
/* <position>
 *
 * CSS2: static | relative | absolute | fixed | inherit
 * CSS3: center | page | same | "<letter>"
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Position = base.baseConstructor();

util.extend(Position.prototype, base.base, {
	name: "position",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [ 
				"static",
				"relative",
				"absolute",
				"fixed",
				"inherit"
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [ 
				"center",
				"page",
				"same",

				// Should be matching on something better.  CSS3 spec says
				// any single letter, digit, or Unicode character category
				// of Lu, Ll, Lt or Nd
				base.makeRegexp('"\\S"'),
				base.makeRegexp("'\\S'")
			]
		}
	]
});

exports.parse = base.simpleParser(Position);

});

require.define("/css/values/rgba.js", function (require, module, exports, __dirname, __filename) {
/* rgba( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} {w})
 *
 * Used to define colors
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var RGBA = base.baseConstructor();

util.extend(RGBA.prototype, base.base, {
	name: "rgba"
});

exports.parse = function (unparsed, bucket, container) {
	var rgba = new RGBA(bucket, container, unparsed);
	rgba.debug('parse', unparsed);
	
	if (! rgba.functionParser('rgba(', 
		[ bucket['number'], bucket['percentage'] ],
		[ bucket['number'], bucket['percentage'] ],
		[ bucket['number'], bucket['percentage'] ],
		bucket['number'])) {
		return null;
	}

	rgba.validateColorValues();
	rgba.debug('parse success');
	return rgba;
};

});

require.define("/css/values/rgb.js", function (require, module, exports, __dirname, __filename) {
/* rgb( {w} {n} %? {w} , {w} {n} %? {w} , {w} {n} %? {w} )
 *
 * Used to define colors
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var RGB = base.baseConstructor();

util.extend(RGB.prototype, base.base, {
	name: "rgb"
});

exports.parse = function (unparsed, bucket, container) {
	var rgb = new RGB(bucket, container, unparsed);
	rgb.debug('parse', unparsed);

	if (! rgb.functionParser('rgb(', 
		[ bucket['number'], bucket['percentage'] ],
		[ bucket['number'], bucket['percentage'] ],
		[ bucket['number'], bucket['percentage'] ])) {
		return null;
	}

	rgb.validateColorValues();
	rgb.debug('parse success');
	return rgb;
};

});

require.define("/css/values/row-height.js", function (require, module, exports, __dirname, __filename) {
/* <row-height>
 *
 * CSS3 allows a non-negative <length>, "auto" or "*"
 * No other CSS versions do something like this that I've found
 */

"use strict";

var base = require('./base');
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
			valueObjects: [ 
				'length'
			]
		}
	]
});

exports.parse = base.simpleParser(RowHeight);

});

require.define("/css/values/string.js", function (require, module, exports, __dirname, __filename) {
/* <string>
 *
 * Basic data type used in simple parsers
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Str = base.baseConstructor();

util.extend(Str.prototype, base.base, {
	name: "string"
});


exports.parse = function (unparsedReal, bucket, container) {
	var str = new Str(bucket, container, unparsedReal);
	str.debug('parse', unparsedReal);

	if (str.unparsed.isType('STRING')) {
		str.add(str.unparsed.advance());
		return str;
	}

	return null;
};

});

require.define("/css/values/template.js", function (require, module, exports, __dirname, __filename) {
/* <template>
 *
 * Used by <display> for creating templates
 * [ <string> [ / <row-height> ]? ]+ <col-width>*
 */

"use strict";

var base = require('./base');
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

exports.parse = function (unparsedReal, bucket, container) {
	var template = new Template(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	var result = null;
	template.debug('parse', unparsed);
	template.rows = [];
	template.columns = [];
	template.addWarning('css-draft', unparsed.firstToken());

	// TODO:  Validate that number of columns are consistent
	// TODO:  Validate that there aren't more column widths than defined
	// TODO:  Should warn if fewer column widths are found (except 0 widths)
	// TODO:  If widths are all percentages, they must add to 100%, keeping
	// in mind that percentages might round poorly (do they round or are
	// they trimmed?  Spec doesn't say)
	// TODO:  Could trim * at end of column widths or add * to match columns
	while (unparsed.isType('STRING')) {
		// <string>
		var rowDef = [ unparsed.advance() ];

		// Look for the "/" - we might need to undo this
		if (unparsed.isContent('/')) {
			var unparsedBackup = unparsed.clone();
			var slashToken = unparsed.advance();
			result = bucket['row-height'].parse(unparsed, bucket, template);

			if (result) {
				// Successful row height parsing
				rowDef.push(slashToken);
				rowDef.push(result);
				template.add(result);  // for warnings
				template.rows.push(rowDef);
				unparsed = result.unparsed;
			} else {
				// Need to undo our changes to unparsed tokens
				unparsed = unparsedBackup;
			}
		} else {
			template.rows.push(rowDef);
		}
	}

	// Done parsing [ <string> [ / <row-height> ]? ]+
	if (template.rows.length === 0) {
		// Not a template - no strings found
		template.debug('parse fail');
		return null;
	}

	// Continue with <col-width>*
	result = true;

	while (unparsed.length() && result) {
		result = bucket['col-width'].parse(unparsed, bucket, template);

		if (result) {
			template.columns.push(result);
			template.add(result); // for warnings
			unparsed = result.unparsed.clone();
		}
	}

	template.debug('parse success', unparsed);
	template.unparsed = unparsed;
	template.warnIfInherit();
	return template;
};

});

require.define("/css/values/text-align.js", function (require, module, exports, __dirname, __filename) {
/* text-align
 *
 * CSS1:  left | right | center | justify
 * CSS2:  <string> | inherit
 * CSS2.1:  Removed <string>
 * CSS3:  [ [ start | end | left | right | center ] || <string> ] | justify | match-parent | start end | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextAlign = base.baseConstructor();

util.extend(TextAlign.prototype, base.base, {
	name: "text-align"
});

exports.parse = function (unparsedReal, bucket, container) {
	var textalign = new TextAlign(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	textalign.debug('parse', unparsed);
	var selrc = false;
	var s = false;
	var jmsi = false;
	var keepParsing = true;
	var css3 = false;

	while (keepParsing) {
		if (unparsed.isContent([ 'left', 'right', 'center' ])) {
			if (jmsi || selrc) {
				return null;
			}

			selrc = true;
			textalign.add(unparsed.advance());
		} else if (unparsed.isContent([ 'justify', 'inherit' ])) {
			if (jmsi || s || selrc) {
				return null;
			}

			jmsi = true;
			validate.call(textalign, 'minimumCss', textalign.firstToken(), 2);
			textalign.add(unparsed.advance());
		} else if (unparsed.isType('STRING')) {
			if (jmsi || s) {
				return null;
			}

			var token = unparsed.advance();

			if (token.content.length != 1) {
				textalign.addWarning('text-align-invalid-string', token);
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
		validate.call(textalign, 'minimumCss', textalign.firstToken(), 3);
	}

	textalign.debug('parse success', unparsed);
	textalign.unparsed = unparsed;
	return textalign;
};

});

require.define("/css/values/text-decoration-blink.js", function (require, module, exports, __dirname, __filename) {
/* <text-decoration-blink>
 *
 * Used to add consistent validation rules for the "blink" value
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextDecorationBlink = base.baseConstructor();


util.extend(TextDecorationBlink.prototype, base.base, {
	name: "text-decoration-blink",
	allowed: [
		{
			validation: [
				validate.browserUnsupported('ie'),
				validate.browserUnsupported('c'),
				validate.browserUnsupported('s')
			],
			values: [
				"blink"
			]
		}
	]
});

exports.parse = base.simpleParser(TextDecorationBlink);

});

require.define("/css/values/text-decoration-color.js", function (require, module, exports, __dirname, __filename) {
/* <text-decoration-color>
 *
 * CSS3:  <color>
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextDecorationColor = base.baseConstructor();

util.extend(TextDecorationColor.prototype, base.base, {
	name: "text-decoration-color",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"inherit"
			],
			valueObjects: [
				'color'
			]
		}
	]
});

exports.parse = base.simpleParser(TextDecorationColor);

});

require.define("/css/values/text-decoration-css2.js", function (require, module, exports, __dirname, __filename) {
/* <text-decoration-css2>
 *
 * CSS1:  none | [ underline || overline || line-through || blink ]
 * CSS2:  inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextDecorationCss2 = base.baseConstructor();

util.extend(TextDecorationCss2.prototype, base.base, {
	name: "text-decoration-css2"
});

exports.parse = function (unparsedReal, bucket, container) {
	var tdc2 = new TextDecorationCss2(bucket, container, unparsedReal);
	var unparsed = tdc2.unparsed.clone();
	tdc2.debug('parse', unparsedReal);

	if (tdc2.handleInherit(function (obj) {
		validate.call(obj, 'minimumCss', obj.firstToken(), 2);
		validate.call(obj, 'browserUnsupported', obj.firstToken(), 'ie7');
		validate.call(obj, 'browserQuirk', obj.firstToken(), 'ie8'); // !DOCTYPE needed
	})) {
		return tdc2;
	}

	if (unparsed.isContent('none')) {
		// none
		tdc2.add(unparsed.advance());
		tdc2.unparsed = unparsed;
	} else {
		// underline || overline || line-through || blink
		var hits = unparsed.matchAnyOrder([ 
			'underline', 
			'overline',
			'line-through',
			bucket['text-decoration-blink']	
		], tdc2);
		if (! hits) {
			tdc2.debug('parse fail - matched nothing');
			return null;
		}
	}

	return tdc2;
};

});

require.define("/css/values/text-decoration-css3.js", function (require, module, exports, __dirname, __filename) {
/* <text-decoration-css3>
 *
 * CSS3:  <text-decoration-css3-line> || <text-decoration-style> || <text-decoration-color> || blink
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextDecorationCss3 = base.baseConstructor();

util.extend(TextDecorationCss3.prototype, base.base, {
	name: "text-decoration-css3"
});

exports.parse = function (unparsedReal, bucket, container) {
	var tdc3 = new TextDecorationCss3(bucket, container, unparsedReal);
	var unparsed = tdc3.unparsed.clone();
	tdc3.debug('parse', unparsedReal);
	validate.call(tdc3, 'minimumCss', tdc3.firstToken(), 3);

	var hits = unparsed.matchAnyOrder([
		bucket['text-decoration-css3-line'],
		bucket['text-decoration-style'],
		bucket['text-decoration-color'],
		bucket['text-decoration-blink']
	], tdc3);

	if (! hits) {
		return null;
	}

	return tdc3;
};

});

require.define("/css/values/text-decoration-css3-line.js", function (require, module, exports, __dirname, __filename) {
/* <text-decoration-css3-line>
 *
 * Supporting object to make text-decoration-css3 easier
 * 
 * none | [ underline || overline || line-through ]
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextDecorationCss3Line = base.baseConstructor();

util.extend(TextDecorationCss3Line.prototype, base.base, {
	name: "text-decoration-css3-line"
});

exports.parse = function (unparsedReal, bucket, container) {
	var tdl = new TextDecorationCss3Line(bucket, container, unparsedReal);
	tdl.debug('parse', unparsedReal);

	if (tdl.unparsed.isContent('none')) {
		tdl.add(tdl.unparsed.advance());
		return tdl;
	}

	var hits = tdl.unparsed.matchAnyOrder([ 'underline', 'overline', 'line-through' ], tdl);

	if (! hits) {
		return null;
	} 

	return tdl;
};

});

require.define("/css/values/text-decoration.js", function (require, module, exports, __dirname, __filename) {
/* <text-decoration>
 *
 * --- handled by text-decoration-css2
 * CSS1:  none | [ underline || overline || line-through || blink ]
 * CSS2:  inherit
 *
 * --- handled by text-decoration-css3
 * CSS3:  <text-decoration-line> || <text-decoration-style> || <text-decoration-color> || blink
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextDecoration = base.baseConstructor();

util.extend(TextDecoration.prototype, base.base, {
	name: "text-decoration",

	allowed: [
		{
			validation: [],
			valueObjects: [
				'text-decoration-css2',
				'text-decoration-css3'
			]
		}
	]
});

exports.parse = function (unparsedReal, bucket, container) {
	var td = new TextDecoration(bucket, container, unparsedReal);
	td.debug('parse', unparsedReal);
	var tdc2 = bucket['text-decoration-css2'].parse(unparsedReal, bucket, td);
	
	if (tdc2 && ! tdc2.unparsed.length()) {
		td.add(tdc2);
		td.unparsed = tdc2.unparsed;
		return td;
	}

	var tdc3 = bucket['text-decoration-css3'].parse(unparsedReal, bucket, td);

	if (tdc3) {
		td.add(tdc3);
		td.unparsed = tdc3.unparsed;
	} else if (tdc2) {
		td.add(tdc2);
		td.unparsed = tdc2.unparsed;
	} else {
		return null;
	}

	return td;
};

});

require.define("/css/values/text-decoration-style.js", function (require, module, exports, __dirname, __filename) {
/* <text-decoration-style>
 *
 * CSS3:  solid | double | dotted | dashed | wavy
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextDecorationStyle = base.baseConstructor();

util.extend(TextDecorationStyle.prototype, base.base, {
	name: "text-decoration-style",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"solid",
				"double",
				"dotted",
				"dashed",
				"wavy",
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(TextDecorationStyle);

});

require.define("/css/values/text-indent.js", function (require, module, exports, __dirname, __filename) {
/* <text-indent>
 *
 * CSS1: <length> | <percentage>
 * CSS2: inherit
 * CSS3: hanging | each-line
 *
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextIndent = base.baseConstructor();

util.extend(TextIndent.prototype, base.base, {
	name: "text-indent",

	allowed: [
		{
			validation: [],
			valueObjects: [ 
				'length',
				'percentage'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [ 
				"inherit"
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"hanging",
				"each-line"		
			]
		}
	]
});

exports.parse = base.simpleParser(TextIndent);

});

require.define("/css/values/text-overflow.js", function (require, module, exports, __dirname, __filename) {
/* <text-overflow>
 *
 * CSS3:  inherit | [ clip | ellipsis | <string> ]{1,2}
 *
 * TODO:  If text-overflow or -o-text-overflow is used and the other isn't
 * set, suggest to use both.
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextOverflow = base.baseConstructor();

util.extend(TextOverflow.prototype, base.base, {
	name: "text-overflow"
});

exports.parse = function (unparsedReal, bucket, container) {
	var to = new TextOverflow(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	to.debug('parse', unparsedReal);
	validate.call(to, 'minimumCss', to.firstToken(), 3);

	if (to.handleInherit(function () {})) {
		return to;
	}

	var result = unparsed.matchAny([ 'clip', 'ellipsis', bucket['string'] ], to);

	if (! result) {
		to.debug('parse fail');
		return null;
	}

	to.add(result);
	unparsed = result.unparsed;
	result = unparsed.matchAny([ 'clip', 'ellipsis', bucket['string'] ], to);

	if (result) {
		to.add(result);
		unparsed = result.unparsed;
	}

	to.unparsed = unparsed;
	to.warnIfInherit();
	return to;
};

});

require.define("/css/values/text-shadow.js", function (require, module, exports, __dirname, __filename) {
/* <text-shadow>
 *
 * CSS3: none | [ <length>{2,3} && <color>? ]#
 * 
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextShadow = base.baseConstructor();

util.extend(TextShadow.prototype, base.base, {
	name: "text-shadow"
});


exports.parse = function (unparsedReal, bucket, container) {
	var ts = new TextShadow(bucket, container, unparsedReal);
	ts.debug('parse', unparsedReal);
	var noneFound = false;
	validate.call(ts, 'minimumCss', ts.firstToken(), 3);

	if (ts.handleInherit(function () {})) {
		return ts;
	}

	if (ts.unparsed.isContent('none')) {
		noneFound = true;
		ts.add(ts.unparsed.advance());
		return ts;
	}

	var c = bucket['color'].parse(ts.unparsed, bucket, ts);

	if (c) {
		ts.add(c);
		ts.unparsed = c.unparsed;
	}

	var lengths = ts.repeatParser([ bucket['length'] ], 3);

	if (lengths < 2) {
		ts.debug('parse fail');
		return null;
	}

	if (! c) {
		c = bucket['color'].parse(ts.unparsed, bucket, ts);

		if (c) {
			ts.add(c);
			ts.unparsed = c.unparsed;
		}
	}

	if (! noneFound && ts.unparsed.isContent('none')) {
		ts.add(ts.unparsed.advance());
	}

	ts.warnIfInherit();
	ts.debug('parse success', ts.unparsed);
	return ts;
};

});

require.define("/css/values/text-transform-case.js", function (require, module, exports, __dirname, __filename) {
/* <text-transform-case>
 *
 * Used for matching text capitalization in text-transform
 *
 * CSS1: capitalize | uppercase | lowercase
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextTransformCase = base.baseConstructor();

util.extend(TextTransformCase.prototype, base.base, {
	name: "text-transform-case",

	allowed: [
		{
			validation: [],
			values: [
				'capitalize',
				'uppercase',
				'lowercase'
			]
		}
	]
});

exports.parse = base.simpleParser(TextTransformCase);

});

require.define("/css/values/text-transform.js", function (require, module, exports, __dirname, __filename) {
/* text-transform
 *
 * CSS1:  capitalize | uppercase | lowercase | none
 * CSS2:  inherit
 * CSS3:  none | [ [ capitalize | uppercase | lowercase ] || full-width || full-size-kana ]
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var TextTransform = base.baseConstructor();

util.extend(TextTransform.prototype, base.base, {
	name: "text-transform"
});


exports.parse = function (unparsedReal, bucket, container) {
	var tt = new TextTransform(bucket, container, unparsedReal);
	tt.debug('parse', unparsedReal);
	var unparsed = unparsedReal.clone();

	if (tt.handleInherit()) {
		return tt;
	}

	if (unparsed.isContent('none')) {
		tt.add(unparsed.advance());
		tt.unparsed = unparsed;
		return tt;
	}

	var hits = unparsed.matchAnyOrder([
		bucket['text-transform-case'],
		"full-width",
		"full-size-kana" ], tt);

	if (! hits) {
		tt.debug('parse fail');
		return null;
	}

	tt.list.forEach(function (token) {
		if (token.content) {
			// Regular token - must be a string
			validate.call(tt, 'minimumCss', tt.firstToken(), 3);
		}
	});
	tt.debug('parse success', tt.unparsed);
	tt.warnIfInherit();
	return tt;
};

});

require.define("/css/values/unparsed.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var base = require('./base');
var util = require('../../util');

var Unparsed = function (list, bucket, container) {
	this.list = list;
	this.bucket = bucket;
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

	clone: function () {
		return new Unparsed(this.list.slice(0), this.bucket, this.container);
	},

	getTokens: function () {
		return this.list;
	},

	isContent: function (content) {
		if (content instanceof Array) {
			var myself = this;

			return content.some(function (contentElement) {
				return myself.isContent(contentElement);
			});
		}

		return this.list.length && this.list[0].content.toLowerCase() == content;
	},

	isTypeContent: function (type, content) {
		if (type instanceof Array || content instanceof Array) {
			return this.isType(type) && this.isContent(content);
		}

		return this.list.length && this.list[0].type == type && this.list[0].content.toLowerCase() == content;
	},

	isType: function (type) {
		if (type instanceof Array) {
			var myself = this;

			return type.some(function (typeElement) {
				return myself.isContent(typeElement);
			});
		}

		return this.list.length && this.list[0].type == type;
	},

	length: function () {
		return this.list.length;
	},

	match: function (against, container) {
		if (typeof against == 'string') {
			if (this.isContent(against)) {
				var tokens = this.clone();
				var v = tokens.advance();
				v.unparsed = tokens;
				return v;
			}
		} else if (typeof against == 'object') {
			if (typeof against.parse == 'function') {
				var parse = against.parse(this, this.bucket, container);

				if (parse) {
					return parse;
				}
			} else {
				throw new Error("match against object without parse");
			}
		} else {
			throw new Error("match against " + (typeof against));
		}

		return null;
	},

	// [ a | b | c ]
	matchAny: function (possibilities, container) {
		if (! container) {
			throw new Error('No container passed to matchAny()');
		}

		if (! (possibilities instanceof Array)) {
			possibilities = [ possibilities ];
		}

		var result = null;

		while (! result && possibilities.length) {
			var t = possibilities.shift();
			result = this.match(t, container);
		}

		return result;
	},

	// [ a || b || c ]
	matchAnyOrder: function (possibilities, container) {
		if (! container) {
			throw new Error('No container passed to matchAnyOrder()');
		}

		var matches = [];
		var unparsed = this.clone();
		var foundOne = true;

		while (foundOne && unparsed.length() && possibilities.length) {
			foundOne = false;
			possibilities = possibilities.filter(function (value) {
				var result = unparsed.match(value, container);

				if (result) {
					matches.push(result);
					unparsed = result.unparsed;
					foundOne = true;
					return false;  // No longer should match this possibility
				}

				return true;  // Try this one again later
			});
		}

		matches.forEach(function (item) {
			container.add(item);
		});

		container.unparsed = unparsed;

		return matches.length;
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

require.define("/css/values/url.js", function (require, module, exports, __dirname, __filename) {
/* <url>
 *
 * url( WS? literal_url WS? )
 * url( WS? STRING WS? )
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Url = base.baseConstructor();

util.extend(Url.prototype, base.base, {
	name: "url"

	// TODO:  Can remove quotes since URLs should have spaces and close
	// parenthesis changed into hex codes
});


exports.parse = function (unparsed, bucket, container) {
	var url = new Url(bucket, container, unparsed);
	url.debug('parse', unparsed);

	if (! url.unparsed.isType('URL')) {
		url.debug('parse fail', url.unparsed);
		return null;
	}

	url.add(url.unparsed.advance());
	url.debug('parse success');
	return url;
};

});

require.define("/css/values/vertical-align.js", function (require, module, exports, __dirname, __filename) {
/* <vertical-align>
 * 
 * Used for matching values for vertical-align property..
 *
 * CSS1: baseline | sub | super | top | text-top | middle | bottom | text-bottom | <percentage>
 * CSS2: <length> | inherit
 * CSS3: auto | use-script | central
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var VerticalAlign = base.baseConstructor();

util.extend(VerticalAlign.prototype, base.base, {
	name: 'vertical-align',

	allowed: [
		{
			validation: [],
			values: [				 			
				'baseline',
				'sub',
				'super',
				'top',
				'text-top',
				'middle',
				'bottom',
				'text-bottom'
			],
			valueObjects: [
				'percentage'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'inherit'
			],
			valueObjects: [
				'length'
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [				
				'auto',
				'use-script',
				'central'
			]
		}
	]
});

exports.parse = base.simpleParser(VerticalAlign);

});

require.define("/css/values/visibility.js", function (require, module, exports, __dirname, __filename) {
/* <visibility>
 *
 * Used for matching visibility properties.
 *
 * CSS2: visible | hidden | collapse | inherit
 * 
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Visibility = base.baseConstructor();

util.extend(Visibility.prototype, base.base, {
	name: "visibility",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'visible',
				'hidden',
				'collapse',	
				'inherit'
			]
		}
		
	]
});

exports.parse = base.simpleParser(Visibility);

});

require.define("/css/values/white-space.js", function (require, module, exports, __dirname, __filename) {
/* <white-space>
 *
 * Used for matching white-space values.
 *
 * CSS1: normal | pre | nowrap
 * CSS2: inherit
 * CSS3: pre-wrap | pre-line 
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var WhiteSpace = base.baseConstructor();

util.extend(WhiteSpace.prototype, base.base, {
	name: "white-space",

	allowed: [
		{
			validation: [],
			values: [
				'normal',
				'pre',
				'nowrap'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'inherit'
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				'pre-wrap',
				'pre-line'
			]
		}
	]
});

exports.parse = base.simpleParser(WhiteSpace);

});

require.define("/css/values/width.js", function (require, module, exports, __dirname, __filename) {
/* <width>
 *
 * <length> | <percentage> | auto | inherit
 * CSS2.1 adds inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Width = base.baseConstructor();

util.extend(Width.prototype, base.base, {
	name: "width",

	allowed: [
		{
			validation: [
				validate.positiveValue()
			],
			valueObjects: [ 
				'length',
				'percentage'
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
				validate.minimumCss(2.1)
			],
			values: [
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(Width);

});

require.define("/css/values/z-index.js", function (require, module, exports, __dirname, __filename) {
/* <z-index>
 *
 * CSS2: auto | <integer> | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var ZIndex = base.baseConstructor();

util.extend(ZIndex.prototype, base.base, {
	name: "z-index",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'auto',
				'inherit'
			]
		},
		{
			validation: [
				validate.minimumCss(2),
				validate.numberPortionIsInteger()
			],
			valueObjects: [
				'number'
			]
		}
	]
});

exports.parse = base.simpleParser(ZIndex);

});

require.define("/css/values/zoom.js", function (require, module, exports, __dirname, __filename) {
/* <zoom>
 *
 * Used for matching zoom properties.
 * 
 * CSS1: <number> | <percentage> | normal
 * 
 * TODO:  If this is set to a non-zero value, also set -moz-transform
 * http://www.fix-css.com/2011/05/css-zoom/
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Zoom = base.baseConstructor();

util.extend(Zoom.prototype, base.base, {
	name: "zoom",

	allowed: [
		{
			validation: [
			],
			values: [
				'normal'
			],
			valueObjects: [
				'number',
				'percentage'
			]
		}
	]
});

exports.parse = base.simpleParser(Zoom);

});

require.define("/css/declarations/rule.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var base = require('./base');
var util = require('../../util');

// Mapping properties to value types
var propertyMapping = {
	'background': 'background',
	'background-attachment': 'background-attachment',
	'background-clip': 'background-clip',
	'-khtml-background-clip': base.deprecated('background-clip', 'background-clip'),
	'-moz-background-clip': base.deprecated('background-clip', 'background-clip'),
	'-webkit-background-clip': base.deprecated('background-clip'),
	'background-color': 'background-color',
	'background-image': 'background-image',
	'background-origin': 'background-origin',
	'background-position': 'background-position',
	'background-repeat': 'background-repeat',
	'background-size': 'background-size',
	'border': 'border-single',
	'border-bottom': 'border-single',
	'border-bottom-left-radius': 'border-radius-single',
	'-khtml-border-bottom-left-radius': base.deprecated('border-radius-single', 'border-bottom-left-radius'),
	'-moz-border-radius-bottomleft': base.deprecated('border-radius-single', 'border-bottom-left-radius'),
	'-webkit-border-bottom-left-radius': base.deprecated('border-radius-single', 'border-bottom-left-radius'),
	'border-bottom-right-radius': 'border-radius-single',
	'-khtml-border-bottom-right-radius': base.deprecated('border-radius-single', 'border-bottom-right-radius'),
	'-moz-border-radius-bottomright': base.deprecated('border-radius-single', 'border-bottom-right-radius'),
	'-webkit-border-bottom-right-radius': base.deprecated('border-radius-single', 'border-bottom-right-radius'),
	'border-bottom-style': 'border-style',
	'border-bottom-width': 'border-width-single',
	'border-collapse': 'border-collapse',
	'border-color': 'border-color',
	'border-left': 'border-single',
	'border-left-style': 'border-style',
	'border-left-width': 'border-width-single',
	'border-radius': 'border-radius',
	'-khtml-border-radius': base.deprecated('border-radius', 'border-radius'),
	'-moz-border-radius': base.deprecated('border-radius', 'border-radius'),
	'-o-border-radius': base.wrongProperty('border-radius', 'border-radius'), // This was never supported in Opera
	'-webkit-border-radius': base.deprecated('border-radius', 'border-radius'),
	'border-right': 'border-single',
	'border-right-style': 'border-style',
	'border-right-width': 'border-width-single',
	'border-spacing': 'border-spacing',
	'border-style': 'border-style',
	'border-top': 'border-single',
	'border-top-left-radius': 'border-radius-single',
	'-khtml-border-top-left-radius': base.deprecated('border-radius-single', 'border-top-left-radius'),
	'-moz-border-radius-topleft': base.deprecated('border-radius-single', 'border-top-left-radius'),
	'-webkit-border-top-left-radius': base.deprecated('border-radius-single', 'border-top-left-radius'),
	'border-top-right-radius': 'border-radius-single',
	'-khtml-border-top-right-radius': base.deprecated('border-radius-single', 'border-top-right-radius'),
	'-moz-border-radius-topright': base.deprecated('border-radius-single', 'border-top-right-radius'),
	'-webkit-border-top-right-radius': base.deprecated('border-radius-single', 'border-top-right-radius'),
	'border-top-style': 'border-style',
	'border-top-width': 'border-width-single',
	'border-width': 'border-width',
	'bottom': 'offset',
	'box-shadow': 'box-shadow',
	'-moz-box-shadow': 'box-shadow',
	'-webkit-box-shadow': 'box-shadow',
	'clear': 'clear',
	'color': 'color',
	'content': 'content',
	'cursor': 'cursor',
	'display': 'display',
	'filter': base.unofficial('filter', 'ie'),
	'-ms-filter': base.wrongProperty('filter', 'filter'),  // IE supports filter better than -ms-filter
	'float': 'float',
	'font': 'font',
	'font-family': 'font-family',
	'font-size': 'font-size',
	'font-style': 'font-style',
	'font-weight': 'font-weight',
	'height': 'height',
	'left': 'offset',
	'line-height': 'line-height',
	'list-style': 'list-style',
	'list-style-image': 'list-style-image',
	'list-style-position': 'list-style-position',
	'list-style-type': 'list-style-type',
	'margin': 'margin',
	'margin-bottom': 'margin-width',
	'margin-left': 'margin-width',
	'margin-right': 'margin-width',
	'margin-top': 'margin-width',
	'max-height': 'max-length',
	'max-width': 'max-length',
	'min-height': 'min-length',
	'min-width': 'min-length',
	'opacity': 'opacity',
	'outline': 'outline',
	'outline-color': 'outline-color',
	'outline-style': 'outline-style',
	'outline-width': 'min-length',
	'overflow': 'overflow',
	'overflow-x': 'overflow-dimension',
	'overflow-y': 'overflow-dimension',
	'padding': 'padding',
	'padding-bottom': 'padding-width',
	'padding-left': 'padding-width',
	'padding-right': 'padding-width',
	'padding-top': 'padding-width',
	'position': 'position',
	'progress-appearance': base.wrongProperty('ms-progress-appearance', 'ms-progress-appearance'),
	'-ms-progress-appearance': 'ms-progress-appearance',
	'right': 'offset',
	'scrollbar-3dlight-color': 'color',
	'-ms-scrollbar-3dlight-color': base.wrongProperty('color', 'scrollbar-3dlight-color'), // Only in IE8 standards mode
	'scrollbar-arrow-color': 'color',
	'-ms-scrollbar-arrow-color': base.wrongProperty('color', 'scrollbar-arrow-color'), // Only in IE8 standards mode
	'scrollbar-base-color': 'color',
	'-ms-scrollbar-base-color': base.wrongProperty('color', 'scrollbar-base-color'), // Only in IE8 standards mode
	'scrollbar-darkshadow-color': 'color',
	'-ms-scrollbar-darkshadow-color': base.wrongProperty('color', 'scrollbar-darkshadow-color'), // Only in IE8 standards mode
	'scrollbar-face-color': 'color',
	'-ms-scrollbar-face-color': base.wrongProperty('color', 'scrollbar-face-color'), // Only in IE8 standards mode
	'scrollbar-highlight-color': 'color',
	'-ms-scrollbar-highlight-color': base.wrongProperty('color', 'scrollbar-highlight-color'), // Only in IE8 standards mode
	'scrollbar-shadow-color': 'color',
	'-ms-scrollbar-shadow-color': base.wrongProperty('color', 'scrollbar-shadow-color'), // Only in IE8 standards mode
	'scrollbar-track-color': 'color',
	'-ms-scrollbar-track-color': base.wrongProperty('color', 'scrollbar-track-color'), // Only in IE8 standards mode
	'text-align': 'text-align',
	'text-decoration': 'text-decoration',
	'text-decoration-color': 'text-decoration-color',
	'text-decoration-style': 'text-decoration-style',
	'text-indent': 'text-indent',
	'text-overflow': 'text-overflow',
	'text-shadow': 'text-shadow',
	'-o-text-overflow': 'text-overflow',
	'text-transform': 'text-transform',
	'top': 'offset',
	'vertical-align': 'vertical-align',
	'visibility': 'visibility',
	'white-space': 'white-space',
	'width': 'width',
	'z-index': 'z-index',
	'zoom': base.unofficial('zoom', 'ie'),
	'-ms-zoom': base.wrongProperty('zoom', 'ie') // Only in IE8 standards mode
};

var Declaration = base.baseConstructor();

util.extend(Declaration.prototype, base.base, {
	name: "declaration-rule"
});


exports.canStartWith = base.canStartWith;
exports.parse = base.declarationParser(Declaration, propertyMapping);

});

require.define("/css/invalid.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var base = require('./base');
var util = require('../util');

var Invalid = base.baseConstructor();

util.extend(Invalid.prototype, base.base, {
	name: "invalid",

	consume: function (tokens) {
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

		this.add(this.bucket.block.parse(tokens, this.bucket, this));
	},

	toString: function () {
		this.debug('toString', this.list);
		return "";  // Remove invalid declarations
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return true;  // Invalid things can be anything
};

exports.parse = function (tokens, bucket, container) {
	var invalid = new Invalid(bucket, container);
	invalid.debug('parse', tokens);
	invalid.block = null;

	if (tokens) {
		bucket.parser.addError('invalid-token', tokens.getToken());
		invalid.consume(tokens);
	}

	return invalid;
};

});

require.define("/css/property.js", function (require, module, exports, __dirname, __filename) {
"use strict";

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

		if (this.bucket.options.propertiesLowerCase) {
			propertyName = propertyName.toLowerCase();
		}
		
		return this.addWhitespace('property', propertyName);
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == 'IDENT';
};

exports.parse = function (tokens, bucket, container) {
	var property = new Property(bucket, container);
	property.debug('parse', tokens);
	property.add(tokens.getToken());
	var nextToken = tokens.nextToken();

	if (nextToken && nextToken.type == 'S') {
		tokens.next();
	}
	
	return property;
};

});

require.define("/css/pseudoclass.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var base = require('./base');
var util = require('../util');

var Pseudoclass = base.baseConstructor();

util.extend(Pseudoclass.prototype, base.base, {
	name: "pseudoclass",

	toString: function () {
		this.debug('toString', this.list);
		return ":" + this.list.join("");
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == "COLON";
};

exports.parse = function (tokens, bucket, container) {
	var pseudo = new Pseudoclass(bucket, container);
	pseudo.debug('parse', tokens);
	var token = tokens.getToken();
	pseudo.add(token);
	tokens.next();
	return pseudo;
};

});

require.define("/css/pseudoelement.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var base = require('./base');
var util = require('../util');

var Pseudoelement = base.baseConstructor();

util.extend(Pseudoelement.prototype, base.base, {
	name: "pseudoelement",

	toString: function () {
		this.debug('toString', this.list);
		return "::" + this.list.join("");
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == "COLON";
};

exports.parse = function (tokens, bucket, container) {
	var pseudo = new Pseudoelement(bucket, container);
	pseudo.debug('parse', tokens);
	var token = tokens.getToken();
	pseudo.add(token);
	tokens.next();
	return pseudo;
};

});

require.define("/css/ruleset.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var base = require('./base');
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

		var out = selAsStrings.join(this.bucket.options.selector_comma);
		out = this.addWhitespace('selector', out);

		if (this.block) {
			out += this.block.toString();
		}

		return this.addWhitespace('ruleset', out);
	}
});

exports.canStartWith = base.selectorCanStartWith;

exports.parse = function (tokens, bucket, container) {
	var ruleset = new Ruleset(bucket, container);
	ruleset.debug('parse', tokens);

	// The current token is the first part of our selector
	ruleset.selectors = [];
	ruleset.block = null;
	ruleset.selectors.push(bucket.selector.parse(tokens, bucket, ruleset));

	// Add additional selectors
	var nextToken = tokens.getToken();

	var makeInvalid = function () {
		var invalidCss = bucket.invalid.parse(null, bucket, container);

		for (var s in ruleset.selectors) {
			invalidCss.addList(ruleset.selectors[s].list);
		}

		if (nextToken) {
			invalidCss.consume(tokens);
		}

		return invalidCss;
	};

	while (nextToken && nextToken.type == 'OPERATOR' && nextToken.content == ',') {
		// Consume comma
		nextToken = tokens.nextToken();

		if (nextToken.type == 'S') {
			nextToken = tokens.nextToken();
		}

		// After commas come another selector
		if (! bucket.selector.canStartWith(nextToken, tokens, bucket)) {
			bucket.parser.addError("selector-expected", nextToken);
			return makeInvalid();
		}

		ruleset.selectors.push(bucket.selector.parse(tokens, bucket, ruleset));

		// Don't advance the token pointer - use getToken here
		nextToken = tokens.getToken();
	}

	if (nextToken && nextToken.type == "S") {
		nextToken = tokens.nextToken();
	}

	if (! nextToken || nextToken.type != 'BLOCK_OPEN') {
		bucket.parser.addError('block-expected', nextToken);
		return makeInvalid();
	}

	ruleset.block = bucket.block.parse(tokens, bucket, ruleset);
	ruleset.block.reparseAs('rule');
	return ruleset;
};

});

require.define("/css/rule.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var base = require('./base');
var declarationBucket = require('./declarationbucket');
var util = require('../util');

var Rule = base.baseConstructor();

util.extend(Rule.prototype, base.base, {
	name: "rule",

	parseTokenList: [
		'comment',
		'whitespace',
		declarationBucket.rule,
		'invalid' // Must be last
	],

	toString: function () {
		this.debug('toString');

		var out = '';

		this.list.forEach(function (item) {
			out += item.toString();
		});

		return out;
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return false;  // Should not be used in auto-detection
};

exports.parse = function (tokens, bucket, container) {
	var rd = new Rule(bucket, container);
	rd.debug('parse', tokens);

	while (tokens.anyLeft()) {
		rd.parseTokens(tokens);
	}

	return rd;
};

});

require.define("/css/selector.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var base = require('./base');
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
			if (building !== "") {
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
					break;
			}
		});

		done();
		return simpleSelectors.join(this.bucket.options.selector_whitespace);
	}
});

exports.canStartWith = base.selectorCanStartWith;

exports.parse = function (tokens, bucket, container) {
	var selector = new Selector(bucket, container);
	selector.debug('parse', tokens);
	var token = tokens.getToken();

	while (token && (token.type == 'S' || exports.canStartWith(token, tokens, bucket))) {
		if (token.type == "COMBINATOR") {
			selector.add(token);
			token = tokens.nextToken();

			if (token && token.type == 'S') {
				token = tokens.nextToken();
			}

			if (! token || token.type == 'COMBINATOR' || ! exports.canStartWith(token, tokens, bucket)) {
				bucket.parser.addError('illegal-token-after-combinator', token);
				var invalidCss1 = bucket.invalid.parse(null, bucket, container);
				invalidCss1.addList(selector.list);
				invalidCss1.consume(tokens);
				return invalidCss1;
			}
		} else if (token.type == 'COLON') {
			var oldTokens = [ token ];
			var pseudoToUse = bucket.pseudoclass;
			var potentialError = 'ident-after-colon';
			token = tokens.nextToken();

			if (token && token.type == 'COLON') {
				potentialError = 'ident-after-double-colon';
				pseudoToUse = bucket.pseudoelement;
				oldTokens.push(token);
				token = tokens.nextToken();
			}

			if (! token || token.type != 'IDENT') {
				bucket.parser.addError(potentialError, token);
				var invalidCss2 = bucket.invalid.parse(null, bucket, container);
				invalidCss2.addList(selector.list);
				invalidCss2.addList(oldTokens);
				invalidCss2.consume(tokens);
				return invalidCss2;
			}

			var pseudoCss = pseudoToUse.parse(tokens, bucket, this);
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

require.define("/css/stylesheet.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var base = require('./base');
var util = require('../util');

// Do not use base.baseConstructor() since container is optional here
var Stylesheet = function (bucket, container) {
	this.init();
	this.setBucket(bucket);

	if (container) {
		this.setContainer(container);
	}

	return this;
};

util.extend(Stylesheet.prototype, base.base, {
	name: "stylesheet",

	parseTokenList: [
		'atRule',
		'cdc',
		'cdo',
		'comment',
		'ruleset',
		'whitespace',
		'invalid' // Must be last
	],

	toString: function () {
		this.debug(this.name);
		this.debug('toString');
		var out = this.makeString(this.list);
		out = out.replace(/^[ \n\r\t\f]*|[ \n\r\t\f]*$/g, '');
		return out;
	}
});

exports.canStartWith = function (token, tokens, bucket) {
	return false;  // Not used in automatic pattern matching
};

exports.parse = function (tokens, bucket, container) {
	var styles = new Stylesheet(bucket, container);
	styles.debug('parse', tokens);

	while (tokens.anyLeft()) {
		styles.parseTokens(tokens);
	}

	return styles;
};

});

require.define("/css/value.js", function (require, module, exports, __dirname, __filename) {
"use strict";

var base = require('./base');
var util = require('../util');
var valueBucket = require('./valuebucket');
var unparsed = require('./values/unparsed');

var Value = base.baseConstructor();

util.extend(Value.prototype, base.base, {
	important: false,
	name: "value",

	firstToken: function () {
		return this.list[0];
	},

	getTokens: function () {
		valueBucket.setCssBucket(this.bucket);
		var t = new valueBucket.unparsed.constructor(this.list, valueBucket, this);
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
		var last = this.lastToken();

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
		var out = "";
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
			out += this.bucket.options.important;
		}

		return this.addWhitespace('value', out);
	}
});


exports.canStartWith = function (token, tokens, bucket) {
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

exports.parse = function (tokens, bucket, container) {
	var value = new Value(bucket, container);
	value.debug('parse', tokens);
	var token = tokens.getToken();

	if (token && token.type == "S") {
		token = tokens.nextToken();
	}

	while (isPartOfValue(token)) {
		if (token.type == 'BLOCK_OPEN') {
			value.add(bucket.block.parse(tokens, bucket, value));
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
"use strict";

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

exports.canStartWith = function (token, tokens, bucket) {
	return token.type == 'S';
};

exports.parse = function (tokens, bucket, container) {
	var whitespace = new Whitespace(bucket, container);
	whitespace.debug('parse', tokens);
	whitespace.add(tokens.getToken());
	tokens.next();
	return whitespace;
};

});

require.define("/tokenizer.js", function (require, module, exports, __dirname, __filename) {
"use strict";

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
		num: "([0-9]+(\\.[0-9]*)?|[0-9]*\\.?[0-9]+)",
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
			leading: ".0123456789-+", 
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

	for (var t1 in tokens) {
		expansion[t1] = tokens[t1].pattern;
	}

	// Expand all RegExp strings, set initial count
	for (var t2 in tokens) {
		tokens[t2].regexp = expandPatternToRegExp(tokens[t2].pattern, expansion);
		tokens[t2].count = 0;
	}

	return tokens;
};

var getDefsByLetter = function (tokens) {
	var out = {};
	var all = {};

	for (var tIndex in tokens) {
		var token1 = tokens[tIndex];
		var letters = token1.leading.split('');

		for (var j = 0; j < letters.length; j ++) {
			var letter1 = letters[j];

			if (! out[letter1]) {
				out[letter1] = {};
			}
		
			if (! out[letter1][tIndex]) {
				out[letter1][tIndex] = token1;
			}
		}

		if (token1.all) {
			all[tIndex] = token1;
		}
	}

	for (var letter2 in out) {
		for (var token2 in all) {
			out[letter2][token2] = all[token2];
		}
	}

	out[''] = all;

	return out;
};

var defs = getTokenDefs();
var defsByLetter = getDefsByLetter(defs);

var Token = function (line, charNum, type, content) {
	this.line = line;
	this.charNum = charNum; 
	this.type = type;
	this.content = content;
};

Token.prototype.clone = function () {
	var newToken = new Token(this.line, this.charNum, this.type, this.content);
	return newToken;
};

Token.prototype.toString = function () {
	return this.content;
};

var Tokenizer = function (options) {
	this.options = util.setOptions(options);
	this.tokenIndex = 0;
	this.tokens = [];
};

Tokenizer.prototype.addToken = function (tokenSpot, type, content) {
	var token = new Token(tokenSpot.line, tokenSpot.charNum, type, content);
	this.tokens.push(token);
	defs[type].count ++;
	
	var splitByLine = content.split(/\r?\n|\r/g);
	if (splitByLine.length > 1) {
		tokenSpot.line += splitByLine.length - 1;
		tokenSpot.charNum = 1;
	}
	tokenSpot.charNum += splitByLine[splitByLine.length - 1].length;
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
	var tokenSpot = {
		line: 1,
		charNum: 1
	};
	var wsAtEnd = new RegExp(wsPatternString + '+$');
	var wsAtStart = new RegExp("^" + wsPatternString + "+");

	matches = str.match(wsAtStart);
	
	if (matches) {
		str = str.substr(matches[0].length);
		this.addToken(tokenSpot, "S", matches[0]);
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
		for (var idx in defsToMatch) {
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

		this.addToken(tokenSpot, type, match);

		if (ws) {
			this.addToken(tokenSpot, "S", ws);
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
	str = str.replace(/^\uFEFF/, '');  // Remove UTF byte order mark
	cr.tokenize(str);
	return cr;
};

exports.tokenizeFile = function (filename, callback, options) {
	options = util.setOptions(options);
	fs.readFile(filename, options.fileEncoding, function (err, data) {
		if (err) {
			callback(err);
		} else {
			var cr = new Tokenizer(options);
			cr.tokenize(data);
			callback(err, cr);
		}
	});
};

});

require.define("fs", function (require, module, exports, __dirname, __filename) {
// nothing to see here... no file methods for the browser

});
