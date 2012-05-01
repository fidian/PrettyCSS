/* <appearance>
 *
 * CSS3: normal | icon | window | document | workspace | desktop | tooltip | dialog | button | push-button | hyperlink | radio-button | checkbox | menu | menubar | pull-down-menu | pop-up-menu | list-menu | radio-group | checkbox-group | outline-tree | field | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "appearance",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				'normal',
				'icon',
				'window',
				'document',
				'workspace',
				'desktop',
				'tooltip',
				'dialog',
				'button',
				'push-button',
				'hyperlink',
				'radio-button',
				'checkbox',
				'menu',
				'menubar',
				'pull-down-menu',
				'pop-up-menu',
				'list-menu',
				'radio-group',
				'checkbox-group',
				'outline-tree',
				'field',
				'inherit'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);
