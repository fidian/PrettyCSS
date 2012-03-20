/* <border-collapse>
 *
 * CSS2:  collapse | separate | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderCollapse = base.baseConstructor();

util.extend(BorderCollapse.prototype, base.base, {
	name: "border-collapse",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"collapse",
				"separate",
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(BorderCollapse);
