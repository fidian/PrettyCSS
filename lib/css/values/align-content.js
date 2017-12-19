/* <align-content>
 *
 * CSS3: flex-start | flex-end | center | space-between | space-around | space-evenly | stretch | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var AlignContent = base.baseConstructor();

util.extend(AlignContent.prototype, base.base, {
	name: "align-content",

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
				'stretch',
				'inherit'
			]
		}
	]
});

exports.parse = base.simpleParser(AlignContent);
