/**
 * Make a child prototype from a parent.
 *
 * var Parent = (function () {});
 * var Child = (function () {}).childOf(Parent);
 *
 * @param Function parentObj Parent object that the child childOf 
 */
Function.prototype.childOf = function (parentObj) {
	function I(){};
	I.prototype = parentObj.prototype;
	I.prototype.constructor = parentObj;
	this.prototype = new I;
	this._superObj = parentObj;

	this.prototype._super = function (method) {
		var f = arguments.callee.caller;
	
		if (f._superBase) {
			// Get back to original constructor
			f = f._superBase;
		}
	
		if (! f._superObj) {
			// Constructor has no super, thus don't call anything
			return null;
		}
	
		if (method) {
			// Call the specified method
			f = f._superObj.prototype[method];
		} else {
			// Call the constructor
			f = f._superObj;
		}
	
		return f.apply(this, Array.prototype.slice.call(arguments, 1));
	};

	return this;
};


/**
 * Extend an object's prototype by adding/overriding with the passed in object.
 * Probably used with childOf() method.
 *
 * var Parent = (function () {});
 * var Child = (function () {}).childOf(Parent).extendPrototype({
 *    someProperty: someValue
 * });
 */
Function.prototype.extendPrototype = function (obj) {
	var extendIt = function (dest, src, key) {
		if (! src.hasOwnProperty(key)) {
			return;
		}

		var x = src[key];

		if (typeof(x) == "function") {
			// Just don't use one function object in multiple classes
			x._superBase = dest;
		}

		dest.prototype[key] = x;
	};

	for (var key in obj) {
		extendIt(this, obj, key);
	}

	// Browsers may not include constructor, toString, and valueOf keys
	// inside the above "for" loop even if they are explicitly declared
	for (var key in ["constructor", "toString", "valueOf"]) {
		extendIt(this, obj, key);
	}

	return this;
};

/**
 * Date.parse with progressive enhancement for ISO-8601
 * © 2010 Colin Snover <http://zetafleet.com>
 * Released under MIT license.
 */
(function () {
	'use strict';
	var origParse = Date.parse;
	Date.parse = function (date) {
		var timestamp = origParse(date), minutesOffset = 0, struct;
		if (isNaN(timestamp) && (struct = /(\d{4})-?(\d{2})-?(\d{2})(?:[T ](\d{2}):?(\d{2}):?(\d{2})?(?:\.(\d{3,}))?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?))/.exec(date))) {
		if (struct[8] !== 'Z') {
			minutesOffset = +struct[10] * 60 + (+struct[11]);

			if (struct[9] === '+') {
				minutesOffset = 0 - minutesOffset;
			}
		}

	timestamp = Date.UTC(+struct[1], +struct[2] - 1, +struct[3], +struct[4], +struct[5] + minutesOffset, +struct[6], +(struct[7]?struct[7]:'.000').substr(0, 3));
 }

	return timestamp;
 };
 }());
