Beautifier Options
==================

These are the options that are available to tweak the parsing and the beautified output.  You can specify them via [command line] in a JSON file or as an options object when using the [functions] directly.

The options object that can be passed into `parse()` and `parseFile()` can have the following properties, which primarily regulate whitespace in generated output.  In general, properties ending in `_pre` would be the whitespace that comes before something and ones ending in `_post` is the whitespace that happens afterwards.  More complex things will have a layout diagram explaining where they would be applied.  Default values are listed in this document.

```
atblock_post: "\n}"
atblock_pre: "{\n\t"
at_post: ""
at_pre: ""
at_whitespace: " "
```

These govern how an `@rule` and any block it has are formatted.  `atblock_pre` must contain `{` and `atblock_post` must contain `}` to be valid.

```
 @media print { display: none; }
^      ^     ^^^              ^^ ^
|      |      |               |  at_post
|      |      |               atblock_post
|      |      atblock_pre
|      at_whitespace
at_pre
```

```
autocorrect: true
```

If `true`, minor things will be autocorrected.  As a principle, nothing should be autocorrected unless it can not cause issues with the CSS.

```
block_post: "\n}"
block_pre: "{"
```

This regulates the spacing around and including the braces, thus `block_pre` must contain `{` and `block_post` must contain `}`.  See the `selector_` properties for more information.

```
a { display: none; }
 ^^^              ^^^
 block_pre        block_post
```

```
cdc: "\n-->"
cdo: "<!--\n"
```

The CDC and CDO tokens are for comment delimiters, the closing and opening (respectively).  You can completely ignore them, since that is what CSS-compliant browsers are told to do.  They are only allowed in specific locations of the file, and they do not need to be balanced.  I suggest removing them, since all browsers you're probably trying to use will support CSS.

If you do specify them, they must be an empty string, whitespace, or a CDC/CDO token with optional whitespace before and after.

```
combinator_post: ' '
combinator_pre: ' '
```

Spacing before and after a combinator.  Combinators are symbols in the selectors, like `+` and `>`.  See the `selector_*` properties for more information.

```
comment_post: ""
comment_pre: "  "
```

Spacing before and after comments.  For reference, only `/*` and `*/` style comments are valid in CSS, and they are only allowed in some locations.  See also the `topcomment_*` whitespace settings.

```
cssLevel: 3
```

This is your target CSS level.  It regulates warnings that may be reported back to the Parser object.

```
debug: false
```

Enabling this will write lots and lots of output to the console.  I don't think it will work well in a browser, unless you make console.log() work.  It is mainly to debug why some objects are not parsing token streams well and I suggest you don't turn it on.

```
declaration_post: ''
declaration_pre: ''
```

Whitespace surrounding the entire declaration.  This would show up before the selector and after the ruleset.  See the `selector_*` properties for more information.

```
fileEncoding: "utf-8"
```

This is only used with `parseFile()` and I strongly suggest you keep your CSS files in UTF-8.  It tends to work the best across browsers.

```
functionComma: ", "
functionSpace: " "
```

This setting regulates the comma and the whitespace around the comma for functions that take multiple parameters.  The `functionComma` setting must at least have a comma and the `functionSpace` setting needs at least one whitespace character.

```
a { color: rgb(10, 20, 30); }
                 ^^  ^^
                 functionComma
                 
span { background-image: linear-gradient(to top, black); }
                                           ^
                                           functionSpace
```

```
important: " !important"
```

An `important` token is replaced by this string.  You can have whitespace before the exclamation point, before the word, and after the word.  To generate valid CSS, this must include at least the exclamation point and the word "important".

```
indent: "\t"
```

When blocks are encountered, their contents are indented.  Likewise, blocks inside of blocks are indented twice, and so on.  By changing the whitespace setting for `indent`, you can use tabs, spaces, or completely eliminate all indentation.

```
keyframe_post: ""
keyframe_pre: "\n"
keyframeselector_post: ""
keyframeselector_pre: ""
```

Keyframes define animations in CSS3.

```
@keyframes mymove {   from {top:0px;} }
                   ^ ^    ^          ^
                   | |    |          keyframe_post
                   | |    keyframe_selector_post
                   | keyframe_selector_pre
                   keyframe_pre
```

```
propertiesLowerCase: true
```

If `true`, change properties into lowercase versions.  Technically, CSS is supposed to be case-insensitive.

```
property_post: ""
property_pre: "\n"
```

A property name in CSS.  You may be familiar with things like `padding`, `margin`, `display`, `color`, `font` and `background`.  See the layout example for the `selector_*` properties.

```
ruleset_post: ""
ruleset_pre: ""
```

A ruleset is a selector, an open block, a set of properties and values, then a closing block.  See the layout example for the `selector_*` properties.

```
selector_comma: ", ", // Must contain comma
selector_post: " "
selector_pre: ""
selector_whitespace: " ", // Must contain whitespace
```

Selectors get some special treatment, since they can be a little complex.  I'll show that a bit in the formatting example.  The `selector_comma` property must have a comma and `selector_whitespace` must contain whitespace.  This is one of the few places where whitespace is mandatory.

```
 p a, p > span.hd { display : none; }
1 2 3+ 4 5       6++       7 8     9+
```

1. ruleset_pre + selector_pre
2. selector_whitespace
3. selector_comma
4. combinator_pre
5. combinator_post
6. selector_post + block_pre + indent + declaration_pre + property_pre
7. property_post
8. value_pre
9. value_post+declaration_post + block_post + ruleset_post

```
stylesheet_post: ""
stylesheet_pre: ""
stylesheet_whitespace: "\n\n"
```

Governs the whitespace before the stylesheet, after the stylesheet, and between things in the stylesheet.  "Things" are CDO, CDC, rulesets (selector + block of properties), @at rules, and other parsed objects.  Whitespace at the end of the file is automatically trimmed.

```
topcomment_post: ""
topcomment_pre: ""
```

Special formatting rules for comments at the top level of the stylesheet.  This way you can specify different rules for comments that are inside of a block versus comments that are governing sections of a file.  See also the `comment_*` properties.

```
value_post: ""
value_pre: " "
```

Whitespace surrounding values.  This would be immediately after the colon between the property name and the value and also after the semicolon after a value.  See the `selector_*` properties for an example of where this setting is applied.

```
valuesLowerCase: true
```

When this is true, values for known properties are changed to lowercase when appropriate.  Values that would change meaning when changed to lowercase or values for unknown properties are untouched.

[Command Line]: CommandLine.md
[Functions]: Functions.md
