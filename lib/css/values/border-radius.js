/* <border-radius>
 *
 * CSS3:  [ <length> | <percentage> ]{1,4} [ / [ <length | <percentage> ]{1,4} ]?
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var BorderRadius = base.baseConstructor();

util.extend(BorderRadius.prototype, base.base, {
	name: "border-radius"
});

exports.parse = function (unparsedReal, bucket, container) {
	var br = new BorderRadius(bucket, container, unparsedReal);
	var unparsed = unparsedReal.clone();
	br.debug('parse', unparsedReal);

	if (br.handleInherit()) {
		return br;
	}

	var parseUnits = function (maxCount) {
		var result = true;

		while (result && maxCount) {
			maxCount --;
			result = unparsed.matchAny([ bucket['length'], bucket['percentage'] ], br);

			if (result) {
				unparsed = result.unparsed;
				br.add(result);
				validate.call(result, 'positiveValue');
			}
		}
	};

	parseUnits(4);

	if (unparsed.isContent('/')) {
		var unparsedBackup = unparsed.clone();
		var slashToken = unparsed.advance();
		var result = unparsed.matchAny([ bucket['length'], bucket['percentage'] ], br);
		
		if (result) {
			br.add(slashToken);
			br.add(result);
			unparsed = result.unparsed;
			validate.call(result, 'positiveValue');
			parseUnits(3);
		} else {
			// Undo
			unparsed = unparsedBackup;
		}
	}

	br.unparsed = unparsed;
	validate.call(br, 'minimumCss', br.firstToken(), 3);
	return br;
};
