/* <counter>
 *
 * counter( WS? IDENT WS? )
 * counter( WS? IDENT WS? , WS? <list-style-type> WS? )
 * counters( WS? IDENT WS? , WS? STRING WS? )
 * counters( WS? IDENT WS? , WS? STRING WS? , WS? <list-style-type> WS? )
 */

"use strict";

var base = require('./base');
var ident = require('./ident');
var listStyleType = require('./list-style-type');
var str = require('./string');
var util = require('../../util');

var Counter = base.baseConstructor();

util.extend(Counter.prototype, base.base, {
	name: "counter"
});


exports.parse = function (unparsed, parser, container) {
	var counter = new Counter(parser, container, unparsed);
	counter.debug('parse', unparsed);

	var result = counter.functionParser('counter(', ident);

	if (! result) {
		result = counter.functionParser('counter(', ident, listStyleType);
	}

	if (! result) {
		result = counter.functionParser('counter(', ident, str);
	}
	
	if (! result) {
		result = counter.functionParser('counter(', ident, str, listStyleType);
	}
	
	if (! result) {
		attr.debug('parse fail');
		return null;
	}

	counter.debug('parse success');
	counter.warnIfInherit();
	return counter;
};
