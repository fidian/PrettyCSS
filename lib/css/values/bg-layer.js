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
