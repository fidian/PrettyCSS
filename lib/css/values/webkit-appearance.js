/* <appearance>
 *
 * Browser-specific implementation of appearance
 *
 * button | button-bevel | caret | checkbox | default-button | listbox | listitem | media-fullscreen-button | media-mute-button | media-play-button | media-seek-back-button | media-seek-forward-button | media-slider | media-sliderthumb | menulist | menulist-button | menulist-text | menulist-textfield | none | push-button | radio | searchfield | searchfield-cancel-button | searchfield-decoration | searchfield-results-button | searchfield-results-decoration | slider-horizontal | slider-vertical | sliderthumb-horizontal | sliderthumb-vertical | square-button | textarea | textfield
 *
 * Unsupported in Safari 4
 * scrollbarbutton-down | scrollbarbutton-left | scrollbarbutton-right | scrollbarbutton-up | scrollbargripper-horizontal | scrollbargripper-vertical | scrollbarthumb-horizontal | scrollbarthumb-vertical | scrollbartrack-horizontal | scrollbartrack-vertical
 *
 * I'm guessing this is supported
 * inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var Val = base.baseConstructor();

util.extend(Val.prototype, base.base, {
	name: "webkit-appearance",

	allowed: [
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				'inherit',
				'button',
				'button-bevel',
				'caret',
				'checkbox',
				'default-button',
				'listbox',
				'listitem',
				'media-fullscreen-button',
				'media-mute-button',
				'media-play-button',
				'media-seek-back-button',
				'media-seek-forward-button',
				'media-slider',
				'media-sliderthumb',
				'menulist',
				'menulist-button',
				'menulist-text',
				'menulist-textfield',
				'none',
				'push-button',
				'radio',
				'searchfield',
				'searchfield-cancel-button',
				'searchfield-decoration',
				'searchfield-results-button',
				'searchfield-results-decoration',
				'slider-horizontal',
				'slider-vertical',
				'sliderthumb-horizontal',
				'sliderthumb-vertical',
				'square-button',
				'textarea',
				'textfield'
			]
		},
		{
			validation: [
				validate.browserUnsupported('s4')
			],
			values: [
				'scrollbarbutton-down',
				'scrollbarbutton-left',
				'scrollbarbutton-right',
				'scrollbarbutton-up',
				'scrollbargripper-horizontal',
				'scrollbargripper-vertical',
				'scrollbarthumb-horizontal',
				'scrollbarthumb-vertical',
				'scrollbartrack-horizontal',
				'scrollbartrack-vertical'
			]
		}
	]
});

exports.parse = base.simpleParser(Val);
