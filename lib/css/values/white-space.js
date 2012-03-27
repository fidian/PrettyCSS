/* <white-space>
 *
 * Used for matching white-space values.
 *
 * CSS1: normal | pre | nowrap
 * CSS2: inherit
 * CSS3: pre-wrap | pre-line 
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var WhiteSpace = base.baseConstructor();

util.extend(WhiteSpace.prototype, base.base, {
	name: "white-space",

	allowed: [
		{
			validation: [],
			values: [
				'normal',
				'pre',
				'nowrap'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'inherit'
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				'pre-wrap',
				'pre-line'
			]
		}
	]
});

exports.parse = base.simpleParser(WhiteSpace);
