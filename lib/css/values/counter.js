/* <counter>
 *
 * counter( WS? IDENT WS? )
 * counter( WS? IDENT WS? , WS? <list-style-type> WS? )
 * counters( WS? IDENT WS? , WS? STRING WS? )
 * counters( WS? IDENT WS? , WS? STRING WS? , WS? <list-style-type> WS? )
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Counter = base.baseConstructor();

util.extend(Counter.prototype, base.base, {
	name: "counter"
});


exports.parse = function (unparsed, bucket, container) {
	var counter = new Counter(bucket, container, unparsed);
	counter.debug('parse', unparsed);

	var result = counter.functionParser('counter(', bucket['ident']);

	if (! result) {
		result = counter.functionParser('counter(', bucket['ident'], bucket['list-style-type']);
	}

	if (! result) {
		result = counter.functionParser('counters(', bucket['ident'], bucket['string']);
	}
	
	if (! result) {
		result = counter.functionParser('counters(', bucket['ident'], bucket['string'], bucket['list-style-type']);
	}
	
	if (! result) {
		counter.debug('parse fail');
		return null;
	}

	counter.debug('parse success');
	counter.warnIfInherit();
	return counter;
};
