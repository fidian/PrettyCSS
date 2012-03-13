/* <margin-width>
 *
 * Used for matching margin and margin-* properties.
 *
 * CSS1: <length> | <percentage> | auto
 * CSS2: inherit
 */
var base = require('./base');
var length = require('./length');
var percentage = require('./percentage');
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
				percentage,
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
