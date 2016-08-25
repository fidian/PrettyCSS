/* <align-items>
 *
 * CSS3: flex-start | flex-end | center | baseline | stretch | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var AlignItems = base.baseConstructor();

util.extend(AlignItems.prototype, base.base, {
	name: "align-items",

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
				'baseline',
				'stretch',
				'inherit'
			]
		}
	]
});

exports.parse = base.simpleParser(AlignItems);


