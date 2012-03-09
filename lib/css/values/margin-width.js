/* <margin-width>
 *
 * Used for matching margin and margin-* properties.
 *
 * CSS1: <length> | <percentage> | auto
 * CSS2: inherit
 */
var base = require('./base');
var length = require('./length');
var percent = require('./percent');
var util = require('../../util');
var validate = require('./validate');

var MarginWidth = base.baseConstructor();

util.extend(MarginWidth.prototype, base.base, {
	name: "margin-width",

	allowed: [
		{
			validation: [],
			values: [ 
				length,
				percent,
				'auto'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'inherit'
			]
		}
	]
});

exports.parse = base.simpleParser(MarginWidth);
