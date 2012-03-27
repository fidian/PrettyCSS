/* <content>
 *
 * CSS2:  inherit | normal | none | [ <string> | <url> | <counter> | attr(<identifier>) | open-quote | close-quote | no-open-quote | no-close-quote ]+
 */

"use strict";

var attr = require('./attr');
var base = require('./base');
var counter = require('./counter');
var str = require('./string');
var url = require('./url');
var util = require('../../util');
var validate = require('./validate');

var Content = base.baseConstructor();

util.extend(Content.prototype, base.base, {
	name: "content"
});

exports.parse = function (unparsedReal, parser, container) {
	var content = new Content(parser, container, unparsedReal);
	content.debug('parse', content.unparsed);

	if (content.handleInherit()) {
		return content;
	}

	validate.call(content, 'minimumCss', 2);

	if (content.unparsed.isContent([ 'normal', 'none' ])) {
		content.add(content.unparsed.advance());
		return content;
	}

	var hits = content.repeatParser([
		str,
		url,
		counter,
		attr,
		"open-quote",
		"close-quote",
		"no-open-quote",
		"no-close-quote"
	]);

	if (! hits) {
		content.debug('parse fail');
		return null;
	}

	content.warnIfInherit();
	content.debug('parse success');
	return content;
};
