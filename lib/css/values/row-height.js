/* <row-height>
 *
 * CSS3 allows a non-negative <length>, "auto" or "*"
 * No other CSS versions do something like this that I've found
 */

var base = require('./base');
var length = require('./length');
var util = require('../../util');
var validate = require('./validate');

var RowHeight = base.baseConstructor();

util.extend(RowHeight.prototype, base.base, {
	name: "row-height",

	allowed: [
		{
			validation: [
				validate.minimumCss(3),
			],
			values: [ 
				"auto",
				"*"
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

exports.parse = base.simpleParser(RowHeight);
