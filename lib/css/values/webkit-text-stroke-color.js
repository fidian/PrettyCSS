/* <webkit-text-stroke-color>
 *
 * Browser-specific implementation for special text strokes
 *
 * <color> | currentcolor | -webkit-activelink | -webkit-focus-ring-color | -webkit-link | -webkit-text
 *
 * I'm guessing this is supported
 * inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "webkit-text-stroke-color",

	allowed: [
		{
			validation: [
				validate.browserOnly('s') // Safari 3.0, iOS 2.0
			],
			values: [
				'currentcolor',
				'-webkit-activelink',
				'-webkit-focus-ring-color',
				'-webkit-link',
				'-webkit-text'
			],
			valueObjects: [
				'color'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);
