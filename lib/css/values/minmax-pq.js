/* <minmax-pq>
 *
 * The minmax function's parameters (p and q) both allow <length>,
 * "max-content", "min-content", and "*" in CSS3.
 * No other CSS versions do something like this that I've found
 */

var base = require('./value-base');
var length = require('./length');
var util = require('../../util');
var validate = require('./value-validate');

var MinmaxPq = base.baseConstructor();

util.extend(MinmaxPq.prototype, base.base, {
	name: "minmax-pq",

	allowed: [
		{
			validation: [
				validate.minimumCss(3),
			],
			values: [ 
				length,
				"max-content",
				"min-content",
				"*"
			]
		}
	]
});

exports.parse = base.simpleParser(MinmaxPq);
