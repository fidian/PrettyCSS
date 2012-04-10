/* <list-style-type>
 *
 * CSS1:  disc | circle | square | decimal | lower-roman | upper-roman | lower-alpha | upper-alpha | none
 * CSS2:  disc | circle | square | decimal | decimal-leading-zero | lower-roman | upper-roman | lower-greek | lower-alpha | lower-latin | upper-alpha | upper-latin | hebrew | armenian | georgian | cjk-ideographic | hiragana | katakana | hiragana-iroha | katakana-iroha | none | inherit
 * CSS2.1:  disc | circle | square | decimal | decimal-leading-zero | lower-roman | upper-roman | lower-greek | lower-latin | upper-latin | armenian | georgian | lower-alpha | upper-alpha | none | inherit
 *
 * And, of course CSS3 - brace yourself
 * CSS3:  <string> | <counter-style> | inline | none
 *  counter-style:  predefined-repeating-style | predefined-numeric-style | predefined-alphabetic-style | predefined-symbolic-style | predefined-nonrepeating-style | predefined-additive-style
 *  predefined-repeating-style:  box | check | circle | diamond | disc | dash | square
 *  predefined-numeric-style:  arabic-indic | bengali | binary | burmese | cambodian | cjk-decimal | decimal | devanagari | eastern-nagari | fullwidth-decimal | gujarati | gurmukhi | kannada | khmer | lower-hexadecimal | lao | lepcha | malayalam | marathi | mongolian | myanmar | new-base-60 | octal | oriya | persian | super-decimal | tamil | telugu | tibetan | thai | upper-hexadecimal
 *  predefined-alphabetic-style:  afar | agaw | ari | blin | cjk-earthly-branch | cjk-heavenly-stem | dizi | fullwidth-lower-alpha | fullwidth-upper-alpha | gedeo | gumuz | hadiyya | harari | hindi | hiragana-iroha | hiragana | kaffa | katakana-iroha | katakana | kebena | kembata | konso | korean-consonant | korean-syllable | kunama | lower-alpha | lower-belorussian | lower-bulgarian | lower-greek | lower-macedonian | lower-oromo-qubee | lower-russian | lower-russian-full | lower-serbo-croatian | lower-ukrainian | lower-ukrainian-full | meen | oromo | saho | sidama | silti | thai-alphabetic | tigre | upper-alpha | upper-belorussian | upper-bulgarian | upper-macedonian | upper-oromo-qubee | upper-russian | upper-russian-full | upper-serbo-croatian | upper-ukrainian | upper-ukrainian-full | wolaita | yemsa
 *  predefined-symbolic-style:  asterisks | footnotes | lower-alpha-symbolic | upper-alpha-symbolic
 *  predefined-nonrepeating-style:  circled-decimal | circled-lower-latin | circled-upper-latin | circled-korean-consonants | circled-korean-syllables | decimal-leading-zero | dotted-decimal | double-circled-decimal | filled-circled-decimal | fullwidth-upper-roman | fullwidth-lower-roman | parenthesized-decimal | parenthesized-lower-latin | parenthesized-hangul-consonants | parenthesized-hangul-syllable | persian-abjad | persian-alphabetic
 *  predefined-additive-style:  hebrew | simple-upper-roman | simple-lower-roman | upper-roman | lower-roman | lower-armenian | upper-armenian | armenian | georgian | ancient-tamil | japanese-informal | japanese-formal | korean-hangul-formal | korean-hanja-informal | korean-hanja-formal | greek
 *  complex-style:  ethiopian-numeric (not ethiopic-numeric) | simp-chinese-informal | simp-chinese-formal | trad-chinese-informal | trad-chinese-formal | cjk-ideographic
 */

"use strict";

var base = require('./base');
var util = require('../../util');
var validate = require('./validate');

var ListStyleType = base.baseConstructor();

util.extend(ListStyleType.prototype, base.base, {
	name: "list-style-type",

	allowed: [
		{
			validation: [],
			values: [
				"circle",
				"decimal",
				"disc",
				"lower-alpha",
				"lower-roman",
				"none",
				"square",
				"upper-alpha",
				"upper-roman"
			]
		},
		{
			validation: [
				validate.minimumCss(2)
			],
			values: [
				"armenian",
				"decimal-leading-zero",
				"georgian",
				"inherit",
				"lower-greek"
			]
		},
		{
			validation: [
				validate.minimumCss(2),
				validate.unsupportedCss(2.1)  // But they're back in CSS3
			],
			values: [
				"cjk-ideographic",
				"hebrew",
				"hiragana",
				"hiragana-iroha",
				"katakana",
				"katakana-iroha"
			]
		},
		{
			validation: [
				validate.minimumCss(2),
				validate.maximumCss(2.1)
			],
			values: [
				"lower-latin",
				"upper-latin"
			]
		},
		{
			validation: [
				validate.minimumCss(3)
			],
			valueObjects: [
				'string'
			],
			// Keep in mind that no duplicates of above keywords will
			// be added to these lists
			values: [
				// Predefined repeating styles
				"box",
				"check",
				"dash",
				"diamond",

				// Predefined numeric styles
				"arabic-indic",
				"bengali",
				"binary",
				"burmese",
				"cambodian",
				"cjk-decimal",
				"devanagari",
				"eastern-nagari",
				"fullwidth-decimal",
				"gujarati",
				"gurmukhi",
				"kannada",
				"khmer",
				"lao",
				"lepcha",
				"lower-hexadecimal",
				"malayalam",
				"marathi",
				"mongolian",
				"myanmar",
				"new-base-60",
				"octal",
				"oriya",
				"persian",
				"super-decimal",
				"tamil",
				"telugu",
				"thai",
				"tibetan",
				"upper-hexadecimal",

				// Predefined alphabetic styles
				"afar",
				"agaw",
				"ari",
				"blin",
				"cjk-earthly-branch",
				"cjk-heavenly-stem",
				"dizi",
				"fullwidth-lower-alpha",
				"fullwidth-upper-alpha",
				"gedeo",
				"gumuz",
				"hadiyya",
				"harari",
				"hindi",
				"kaffa",
				"kebena",
				"kembata",
				"konso",
				"korean-consonant",
				"korean-syllable",
				"kunama",
				"lower-belorussian",
				"lower-bulgarian",
				"lower-macedonian",
				"lower-oromo-qubee",
				"lower-russian-full",
				"lower-russian",
				"lower-serbo-croatian",
				"lower-ukrainian-full",
				"lower-ukrainian",
				"meen",
				"oromo",
				"saho",
				"sidama",
				"silti",
				"thai-alphabetic",
				"tigre",
				"upper-belorussian",
				"upper-bulgarian",
				"upper-macedonian",
				"upper-oromo-qubee",
				"upper-russian-full",
				"upper-russian",
				"upper-serbo-croatian",
				"upper-ukrainian-full",
				"upper-ukrainian",
				"wolaita",
				"yemsa",

				// Predefined symbolic styles
				"asterisks",
				"footnotes",
				"lower-alpha-symbolic",
				"upper-alpha-symbolic",

				// Predefined nonrepeating styles
				"circled-decimal",
				"circled-korean-consonants",
				"circled-korean-syllables",
				"circled-lower-latin",
				"circled-upper-latin",
				"dotted-decimal",
				"double-circled-decimal",
				"filled-circled-decimal",
				"fullwidth-lower-roman",
				"fullwidth-upper-roman",
				"parenthesized-decimal",
				"parenthesized-hangul-consonants",
				"parenthesized-hangul-syllable",
				"parenthesized-lower-latin",
				"persian-abjad",
				"persian-alphabetic",

				// Predefined additive styles
				"ancient-tamil",
				"greek",
				"japanese-formal",
				"japanese-informal",
				"korean-hangul-formal",
				"korean-hanja-formal",
				"korean-hanja-informal",
				"lower-armenian",
				"simple-lower-roman",
				"simple-upper-roman",
				"upper-armenian",
				
				// Complex styles
				"ethiopian-numeric",  // Careful - not "ethiopic-numeric" regardless what section 10.2 of the spec is named
				"simp-chinese-formal",
				"simp-chinese-informal",
				"trad-chinese-formal",
				"trad-chinese-informal"
			]
		}
	]
});

exports.parse = base.simpleParser(ListStyleType);

