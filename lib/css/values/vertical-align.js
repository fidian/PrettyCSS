/* <vertical-align>
 * 
 * Used for matching values for vertical-align property..
 *
 * CSS1: baseline | sub | super | top | text-top | middle | bottom | text-bottom | <percentage>
 * CSS2: <length> | inherit
 * CSS3: auto | use-script | central
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var VerticalAlign = base.baseConstructor();

util.extend(VerticalAlign.prototype, base.base, {
	name: 'vertical-align',

	allowed: [
		{
			validation: [],
			values: [				 			
				'baseline',
				'sub',
				'super',
				'top',
				'text-top',
				'middle',
				'bottom',
				'text-bottom'
			],
			valueObjects: [
				'percentage'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'inherit'
			],
			valueObjects: [
				'length'
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [				
				'auto',
				'use-script',
				'central'
			]
		},
		{
			validation: [
				validate.autoCorrect('middle'),
			],
			values: [
				'center'
			]
		}
	]
});

exports.parse = base.simpleParser(VerticalAlign);
