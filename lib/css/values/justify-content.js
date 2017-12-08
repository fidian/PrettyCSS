/* <justify-content>
 *
 * CSS3: flex-start | flex-end | center | space-between | space-around | space-evenly | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var JustifyContent = base.baseConstructor();

util.extend(JustifyContent.prototype, base.base, {
	name: "justify-content",

	allowed: [
		{
			validation: [
				validate.minimumCss(3),
				validate.browserUnsupported('ie10'),
			],
			values: [
				'flex-start',
				'flex-end',
				'center',
				'space-between',
				'space-around',
				'space-evenly',
				'inherit'
			]
		}
	]
});

exports.parse = base.simpleParser(JustifyContent);

