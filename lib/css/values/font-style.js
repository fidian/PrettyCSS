/* <font-style>
 *
 * CSS1: normal | italic | oblique  
 * CSS2:  inherit
 *
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var FontStyle = base.baseConstructor();

util.extend(FontStyle.prototype, base.base, {
	name: "font-style",

	allowed: [
		{
			validation: [],
			values: [ 
				'normal',
				'italic',
				'oblique'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(FontStyle);
