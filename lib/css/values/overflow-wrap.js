/* <overflow-wrap>
 *
 * CSS3: inherit | normal | break-word
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "overflow-wrap",

	allowed: [
		{
			validation: [
			],
			values: [
				'normal',
				'inherit',
				'break-word'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);
