/* <transform-function>
 *
 * A collection of transform functions
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "transform-function",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			valueObjects: [
				'matrix',
				'matrix3d',
				'perspective',
				'rotate',
				'rotate3d',
				'rotatex',
				'rotatey',
				'rotatez',
				'scale',
				'scale3d',
				'scalex',
				'scaley',
				'scalez',
				'skewx',
				'skewy',
				'translate',
				'translate3d',
				'translatex',
				'translatey',
				'translatez'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);
