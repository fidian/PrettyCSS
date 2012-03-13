/* <padding-width>
 *
 * Used for matching padding and padding-* properties.
 *
 * CSS1: <length> | <percentage> | auto
 * CSS2: inherit
 */
var base = require('./base');
var length = require('./length');
var percentage = require('./percentage');
var util = require('../../util');
var validate = require('./validate');

var PaddingWidth = base.baseConstructor();

util.extend(PaddingWidth.prototype, base.base, {
	name: "padding-width",

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

exports.parse = base.simpleParser(PaddingWidth);
