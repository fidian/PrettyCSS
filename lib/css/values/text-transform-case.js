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
