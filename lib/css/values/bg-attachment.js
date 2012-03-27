/* <bg-attachment>
 *
 * CSS1:  scroll | fixed
 * CSS2:  inherit
 * CSS3:  local
 * Helper for background-attachment in CSS3
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Attachment = base.baseConstructor();

util.extend(Attachment.prototype, base.base, {
	name: "bg-attachment",

	allowed: [
		{
			validation: [],
			values: [ 
				"scroll",
				"fixed"
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [ 
				"inherit"
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [ 
				"local"
			]
		}
	]
});

exports.parse = base.simpleParser(Attachment);
