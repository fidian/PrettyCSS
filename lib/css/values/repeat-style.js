/* <repeat-style>
 *
 * CSS1:  repeat | repeat-x | repeat-y | no-repeat
 * CSS2:  inherit
 * Helper for background-repeat in CSS3
 */

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var RepeatStyle = base.baseConstructor();

util.extend(RepeatStyle.prototype, base.base, {
	name: "repeat-style",

	allowed: [
		{
			validation: [],
			values: [ 
				"repeat",
				"repeat-x",
				"repeat-y",
				"no-repeat"
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [ 
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(RepeatStyle);
