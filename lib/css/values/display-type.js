/* <display-type>
 *
 * Per CSS3, this is just a list of possible values.
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var DisplayType = base.baseConstructor();

util.extend(DisplayType.prototype, base.base, {
	name: "display-type",

	allowed: [
		{
			validation: [],
			values: [ 
				'block',
				'inline',
				'list-item',
				'none'
			]
		},
		{
			validation: [
				validate.minimumCss(2),
				validate.maximumCss(2),
				validate.notForwardCompatible(2.1)
			],
			values: [
				"compact",
				"marker",
				"run-in"
			]
		},
		{
			validation: [
				validate.minimumCss(2),
				validate.browserUnsupported('ie7'),
				validate.browserQuirk('ie8') // !DOCTYPE required
			],
			values: [
				"inherit",
				"inline-table",
				"table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-row",
				"table-row-group"
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"table-footer-group",
				"table-header-group"
			]
		},
		{
			validation: [
				validate.minimumCss(2.1)
			],
			values: [
				"inline-block"
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				"flex"
			]
		}
	]
});

exports.parse = base.simpleParser(DisplayType);
