/* <height>
 *
 * <length> | <percentage> | auto | inherit
 * CSS2.1 adds inherit
 */
var base = require('./base');
var length = require('./length');
var percent = require('./percent');
var util = require('../../util');
var validate = require('./validate');

var Height = base.baseConstructor();

util.extend(Height.prototype, base.base, {
	name: "display-type",

	allowed: [
		{
			validation: [
				validate.positiveValue()
			],
			values: [ 
				length
			]
		},
		{
			validation: [],
			values: [ 
				'auto'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [ 
				percent
			]
		},
		{
			validation: [
				validate.minimumCss(2.1),
			],
			values: [
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(Height);
