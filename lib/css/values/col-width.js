/* <col-width>
 *
 * CSS3 allows a non-negative <length>, "auto", "fit-content", "max-content",
 * "min-content", "*", or the minmax function (I'm implementing as <minmax>)
 * No other CSS versions do something like this that I've found
 */

var base = require('./value-base');
var length = require('./length');
var minmax = require('./minmax');
var util = require('../../util');
var validate = require('./value-validate');

var ColWidth = base.baseConstructor();

util.extend(ColWidth.prototype, base.base, {
	name: "col-width",

	allowed: [
		{
			validation: [
				validate.minimumCss(3),
			],
			values: [ 
				"auto",
				"fit-content",
				"max-content",
				"min-content",
				"*",
				minmax
			]
		},
		{
			validation: [
				validate.minimumCss(3),
				validate.positiveValue(),
			],
			values: [ 
				length,
			]
		}
	]
});

exports.parse = base.simpleParser(ColWidth);
