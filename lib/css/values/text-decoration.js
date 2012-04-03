/* <text-decoration>
 *
 * --- handled by text-decoration-css2
 * CSS1:  none | [ underline || overline || line-through || blink ]
 * CSS2:  inherit
 *
 * --- handled by text-decoration-css3
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

exports.parse = base.simpleParser(TextDecoration);
