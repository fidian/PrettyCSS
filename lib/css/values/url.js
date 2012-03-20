/* <url>
 *
 * url( WS? literal_url WS? )
 * url( WS? STRING WS? )
 */

"use strict";

var base = require('./base');
var util = require('../../util');

var Url = base.baseConstructor();

util.extend(Url.prototype, base.base, {
	name: "url"

	// TODO:  Can remove quotes since URLs should have spaces and close
	// parenthesis changed into hex codes
});


exports.parse = function (unparsed, parser, container) {
	var url = new Url(parser, container, unparsed);
	url.debug('parse', unparsed);

	if (! url.unparsed.isType('URL')) {
		url.debug('parse fail', url.unparsed);
		return null;
	}

	url.add(url.unparsed.advance());
	return url;
};
