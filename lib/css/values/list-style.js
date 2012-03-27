/* <list-style>
 *
 * CSS1: <list-style-type> | <list-style-position> | <list-style-image>
 * CSS2: inherit
 *
 */

"use strict";

var base = require('./base');
var str = require('./string');
var util = require('../../util');
var validate = require('./validate');
var listStyleType = require('./list-style-type');
var listStyleImage = require('./list-style-image');
var listStylePosition = require('./list-style-position');
var ListStyle = base.baseConstructor();

util.extend(ListStyle.prototype, base.base, {
	name: "list-style",

	allowed: [
		{
			validation: [],
			values:[
				listStyleType,
				listStylePosition,
				listStyleImage
			]
		}
	]
});

exports.parse = base.simpleParser(ListStyle);

