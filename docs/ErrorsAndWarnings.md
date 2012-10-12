Error and Warning Codes
=======================

In order to properly use `--ignore` for the command-line interface, you need to know the code for warnings. You can get them with a little trial and error on the live demo and looking at the Errors / Warnings tab, but this might help you get started.

General Format
--------------

The error or warning will either just be the code (eg. `block-expected`) or a code with some value (eg. `browser-only:ie6`).

Browsers
--------

Warnings may refer to browsers for the "value" portion of the code.  Here's a list of the browser abbreviations.

* `c` - Google Chrome
* `ff` - Mozilla Firefox
* `ie` - Microsoft's Internet Explorer
* `o` - Opera
* `s` - Safari

Browsers may additionally have a version number after them, so the value of `ie6` refers to Microsoft's Internet Explorer version 6.

Errors
------

When these are encountered, the output will likely have chunks of CSS removed due to the invalid structure.  The CSS format is invalid and needs to get fixed.

* `block-expected` - After a selector, a ruleset should be followed by an open brace.
* `colon-expected` - After a property name in a declaration, there should be a colon.
* `ident-after-colon` - For selectors, you can use pseudo-elements and pseudo-selectors like ":hover".  After the colon, there should be an IDENT token.
* `ident-after-double-colon` - Like ident-after-colon, you must have an IDENT token after a double colon in the selector.
* `invalid-token` - This is a more generic error where a token was encountered and it wasn't expected.
* `illegal-token-after-combinator` - In a selector, using things like `+` and `>` are combinators.  After a combinator, it is expected to have another selector.
* `selector-expected` - A selector followed by a comma must be followed by another selector.

Warnings
--------

When a warning is generated, it is likely the output CSS will remain the same.  Unlike errors, these are not parsing problems that must be fixed.  Warnings are helpful hints to help avoid breakage, unexpected behavior, fixing typos and providing tips.

When a code could have a value, you'll see `:##` at the end of its name.

* `add-quotes` - To avoid confusion, this value should have quotes.
* `angle` - Angles should start at 0 and be less than 360.
* `autocorrect:##` - A value has been autocorrected.  You will likely want to see what was changed and validate that it looks good.
* `autocorrect-swap` - A value has been autocorrected.  This currently affects background attachments where the value could be misinterpreted in a CSS3 parser.
* `browser-only:##` - This feature only works in one browser.
* `browser-quirk:##` - Behaves poorly in the listed browser.
* `browser-unsupported:##` - Unsupported in the listed browser.
* `css-deprecated:##` - Marked as deprecated in the CSS version specified.
* `css-draft` - This property is only in a working draft and is subject to change.
* `css-maximum:##` - This works only up to a specific version of CSS.  It may still be supported by browsers, but you can start to expect it to not work.
* `css-minimum:##` - This was introduced in a specific CSS version and isn't supported officially before then.
* `css-unsupported:##` - This is not supported in a version of CSS.
* `deprecated:##` - Deprecated and should not be used, but you can use the value portion instead.
* `extra-tokens-after-value` - Extra tokens were found after a valid value.  Browsers may discard this entire property.
* `filter-case-sensitive` - You used the wrong capitalization for a case sensitive property.
* `filter-use-equals-instead` - You must use an equals here instead of colon.
* `font-family-one-generic` - Only one generic font family should be used and it should be at the end
* `inherit-not-allowed` - The value "inherit" is not allowed here.
* `illegal` - This value is illegal.
* `invalid-value` - The value specified at this point is invalid for the property.
* `minmax-p-q` - For minmax(p,q), the p should not be bigger than q.
* `mixing-percentages` - You are not allowed to mix percentages with non-percentage values.
* `not-forward-compatible:##` - This is not compatible with the listed CSS version and forward.
* `range-max:##` - The CSS uses a value that is too large.  The value listed is the maximum.
* `range-min:##` - The CSS uses a value that is too small.  The value listed is the minimum.
* `remove-quotes` - This value should not be quoted.
* `require-integer` - This value must be an integer.
* `require-positive-value` - This value must be positive.
* `require-value` - Properties require a value.
* `reserved` - Reserved for future use.
* `suggest-relative-unit:##` - You should use a relative unit instead of the one specified.  This is a W3C recommendation.
* `suggest-remove-unit:##` - You should remove the listed unit from this property's value.
* `suggest-using:##` - Instead of using what's listed in your CSS, it is suggested you use something else.  The value of this is the alternate value or property name.
* `text-align-invalid-string` - If a string is specified, it must contain just one character.
* `unknown-property:##` - The value part of the warning code is not a known property.
* `wrong-property:##` - This is the wrong property name or is poorly supported and you should use the supplied property instead.