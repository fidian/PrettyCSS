/* <background-clip-deprecated>
 *
 * Same as <background-clip> except emits deprecated notice
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BackgroundClipDeprecated = base.baseConstructor();

util.extend(BackgroundClipDeprecated.prototype, base.base, {
	name: "background-clip-deprecated",

	allowed: [
		{
			validation: [
				validate.deprecated(null, "background-clip")
			],
			valueObjects: [
				'background-clip'
			]
		}
	]
});

exports.parse = base.simpleParser(BackgroundClipDeprecated);
