/* <bg-box>
 *
 * CSS3:  border-box | padding-box | content-box
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BgBox = base.baseConstructor();

util.extend(BgBox.prototype, base.base, {
	name: "bg-box",

	allowed: [
		{
			validation: [
				validate.minimumCss(3),
				validate.workingDraft()
			],
			values: [
				"border-box",
				"padding-box",
				"content-box",
				"inherit"
			]
		}
	]
});

exports.parse = base.simpleParser(BgBox);
