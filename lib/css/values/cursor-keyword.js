/* <cursor-keyword>
 *
 * Used for matching cursor keyword properties.
 *
 * CSS2: [ [<uri> ,]* [ auto | crosshair | default | pointer | move | e-resize | ne-resize | nw-resize | n-resize | se-resize | sw-resize | s-resize | w-resize| text | wait | help ] ] | inherit 
 * CSS2.1: [progress]
 * CSS3: [ none |context-menu  | cell | vertical-text | alias | copy | no-drop | not-allowed | ew-resize | ns-resize | nesw-resize | nwse-resize | col-resize | row-resize | all-scroll | zoom-in | zoom-out 
] ] | inherit
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var CursorKeyword = base.baseConstructor();

util.extend(MarginWidth.prototype, base.base, {
	name: "cursor-keyword",

	allowed: [
		{
			validation: [],
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
				'help'
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
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
		}
	]
});

exports.parse = base.simpleParser(CursorKeyword);
