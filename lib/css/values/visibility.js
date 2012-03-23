/* <visibility>
 *
 * Used for matching visibility properties.
 *
 * CSS2: visible | hidden | collapse | inherit
 * 
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Visibility = base.baseConstructor();

util.extend(Visibility.prototype, base.base, {
	name: "visibility",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'visible',
				'hidden',
				'collapse',	
				'inherit'
			]
		}
		
	]
});

exports.parse = base.simpleParser(Visibility);
