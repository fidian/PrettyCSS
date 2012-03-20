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
var backgroundColor = require('./background-color');
var bgAttachment = require('./bg-attachment');
var bgBox = require('./bg-box');
var bgImage = require('./bg-image');
var bgPosition = require('./bg-position');
var bgRepeat = require('./bg-repeat');
var bgSize = require('./bg-size');
var util = require('../../util');
var validate = require('./validate');

var BgLayer = base.baseConstructor();

util.extend(BgLayer.prototype, base.base, {
	name: "bg-layer",
	mustBeFinal: false
});


exports.parse = function (unparsedReal, parser, container) {
	var bl = new BgLayer(parser, container, unparsedReal);
	var unparsed = bl.unparsed.clone();
	var hasBeenDone = {};
	bl.debug('parse', unparsedReal);

	if (unparsed.isContent('inherit')) {
		bl.add(unparsed.advance());
		bl.unparsed = unparsed;
		validate.call(bl, 'minimumCss', 2);
		return bl;
	}

	var standardProcess = function (defObject) {
		if (hasBeenDone[defObject.name]) {
			return false;
		}

		var parsed = defObject.parseFunction(unparsed, parser, bl);
		
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
			var result = bgSize.parse(unparsed, parser, bl);

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
		standardProcess(defObject);
		return true;
	};

	var allowedValues = [
		{
			name: 'backgroundColor',
			parseFunction: backgroundColor.parse,
			processFunction: colorProcess
		},
		{
			name: 'bgImage',
			parseFunction: bgImage.parse,
			processFunction: standardProcess
		},
		{
			name: 'bgRepeat',
			parseFunction: bgRepeat.parse,
			processFunction: standardProcess
		},
		{
			name: 'bgAttachment',
			parseFunction: bgAttachment.parse,
			processFunction: standardProcess
		},
		{
			name: 'bgPosition',
			parseFunction: bgPosition.parse,
			processFunction: positionProcess 
		},
		{
			name: 'bgBox',
			parseFunction: bgBox.parse,
			processFunction: boxProcess
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
