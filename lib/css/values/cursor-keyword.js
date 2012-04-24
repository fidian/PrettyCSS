/* <cursor-keyword>
 *
 * Used for matching cursor keyword properties.
 *
 * CSS2: auto | crosshair | default | pointer | move | e-resize | ne-resize | nw-resize | n-resize | se-resize | sw-resize | s-resize | w-resize| text | wait | help
 * CSS2.1: progress
 * CSS3: none |context-menu  | cell | vertical-text | alias | copy | no-drop | not-allowed | ew-resize | ns-resize | nesw-resize | nwse-resize | col-resize | row-resize | all-scroll | zoom-in | zoom-out 
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var CursorKeyword = base.baseConstructor();

util.extend(CursorKeyword.prototype, base.base, {
	name: "cursor-keyword",

	allowed: [
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				'auto',
				'crosshair',
				'default',
				'pointer',
				'move',
				'e-resize',
				'ne-resize',
				'nw-resize',
				'n-resize',
				'se-resize',
				'sw-resize',
				's-resize',
				'w-resize',
				'text',
				'wait',
				'help',
				'inherit'
			]
		},
		{
			validation: [
				validate.minimumCss(2.1)
			],
			values: [
				'progress'
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			values: [
				'context-menu',
				'cell',
				'vertical-text',
				'alias',
				'copy',
				'no-drop',
				'none',
				'not-allowed',
				'ew-resize',
				'ns-resize',
				'nesw-resize',
				'nwse-resize',
				'col-resize',
				'row-resize',
				'all-scroll',
				'zoom-in',
				'zoom-out'
			]
		},
		{
			validation: [
				validate.autoCorrect('pointer'),
				validate.browserOnly('ie'),
				validate.browserUnsupported('ie9')
			],
			values: [
				'hand',
			]
		}
	]
});

exports.parse = base.simpleParser(CursorKeyword);
