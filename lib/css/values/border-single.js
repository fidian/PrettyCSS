/* <border-single>
 *
 * CSS1:  <border-width-single> || <border-style> || <border-color-single>
 * CSS2:  inherit
 */

var base = require('./base');
var borderColorSingle = require('./border-color-single');
var borderStyle = require('./border-style');
var borderWidthSingle = require('./border-width-single');
var util = require('../../util');
var validate = require('./validate');

var BorderSingle = base.baseConstructor();

util.extend(BorderSingle.prototype, base.base, {
	name: "border-single"
});


exports.parse = function (unparsedReal, parser, container) {
	var bs = new BorderSingle(parser, container, unparsedReal);
	var unparsed = bs.unparsed.clone();
	var hasBeenDone = {};
	bs.debug('parse', unparsedReal);

	if (unparsed.isContent('inherit')) {
		bs.add(unparsed.advance());
		bs.unparsed = unparsed;
		return bs;
	}

	var allowedValues = [
		{
			name: 'borderWidthSingle',
			parseFunction: borderWidthSingle.parse
		},
		{
			name: 'borderStyle',
			parseFunction: borderStyle.parse
		},
		{
			name: 'borderColorSingle',
			parseFunction: borderColorSingle.parse
		}
	];
	var keepGoing = true;

	while (keepGoing) {
		keepGoing = allowedValues.some(function (defObject) {
			if (hasBeenDone[defObject.name]) {
				return false;
			}

			var parsed = defObject.parseFunction(unparsed, parser, bs);
			
			if (! parsed) {
				return false;
			}

			hasBeenDone[defObject.name] = true;
			bs.add(parsed);
			unparsed = parsed.unparsed;
			return true;
		});
	}

	if (bs.list.length == 0) {
		bs.debug('parse fail');
		return null;
	}

	bs.debug('parse success', unparsed);
	bs.warnIfInherit();
	bs.unparsed = unparsed;
	return bs;
}
