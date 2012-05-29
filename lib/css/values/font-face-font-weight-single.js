/* <font-face-font-weight-single>
 *
 * CSS2:  normal | bold
 * CSS2:  100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

// TODO:  "normal" == "400" and "bold" == "700"
// TODO:  Round numbers to nearest 100
util.extend(Val.prototype, base.base, {
	name: "font-face-font-weight-single",

	allowed: [
		{
			validation: [],
			values: [ 
				'normal',
				'bold',
				base.makeRegexp('[1-9]00')
			]
		}
	]
});

exports.parse = base.simpleParser(Val);
