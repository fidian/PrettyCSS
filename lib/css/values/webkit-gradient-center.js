/* <webkit-gradient-center>
 *
 * ( <length> | <percentage> ){2} | <webkit-side-or-corner> | center
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "webkit-gradient-center",

	allowed: [
		{
			validation: [],
			values: [
				'center'
			],
			valueObjects: [ 
				'length-percentage2',
				'webkit-side-or-corner'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);
