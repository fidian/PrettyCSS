/* <list-style>
 *
 * CSS1: <list-style-type> | <list-style-position> | <list-style-image>
 * CSS2: inherit
 *
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var ListStyle = base.baseConstructor();

util.extend(ListStyle.prototype, base.base, {
	name: "list-style",

	allowed: [
		{
                        validation: [
                                validate.minimumCss(2)
                        ],
                        values: [
                                "inherit"
                        ]
                },
		{
			validation: [],
			valueObjects:[
				'list-style-type',
				'list-style-position',
				'list-style-image'
			]
		}
	]
});

exports.parse = base.simpleParser(ListStyle);

