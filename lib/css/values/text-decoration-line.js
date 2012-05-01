/* <text-decoration-line>
 *
 * CSS3:  inherit | none | [ underline || overline || line-through ]
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "text-decoration-line"
});

exports.parse = function (unparsedReal, bucket, container) {
	var v = new Val(bucket, container, unparsedReal);
	v.debug('parse', unparsedReal);

	if (v.unparsed.isContent([ 'none', 'inherit' ])) {
		v.add(v.unparsed.advance());
	} else {
		// underline || overline || line-through
		var hits = v.unparsed.matchAnyOrder([ 
			'underline', 
			'overline',
			'line-through'
		], v);

		if (! hits) {
			v.debug('parse fail');
			return null;
		}
	}

	validate.call(v, 'minimumCss', v.firstToken(), 3);
	return v;
};
