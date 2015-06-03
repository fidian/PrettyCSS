Command Line
============

The command-line client is typically invoked by just running `prettycss`, but your installation may change things.  Examples on this page will assume that you've installed the program so that it is in your path and it is called `prettycss`.

Help!
-----

I would suggest you look at the option reference to get a list of options as the first thing you do.  It's easy:

```
prettycss --help
```

Pretty Print A File
-------------------

```
prettycss myfile.css > myfile_pretty.css
```

This will always write out a new file.  I strongly suggest using `diff` or a similar tool to confirm the changes are good before you blindly use the generated file.  This is because if you are missing a brace or have other structural problems, then chunks of your CSS will be missing.  They would be ignored by browsers too, but you'll likely want to fix the structure instead of having it just automatically removed.  Thus, we have the option to stop when we encounter a warning or error.

```
prettycss -s myfile.css > myfile_pretty.css
```

Now nothing will be written to stdout (thus myfile_pretty.css will have zero bytes) when there are errors or warnings.

Ignoring Some Warnings
----------------------

There are a lot of warnings in the tool.  I welcome additions, in case you want to help other web developers from making the same mistakes.  Also, some things can get automatically corrected and perhaps you'll just accept the changes and not worry about seeing the warnings.

```
prettycss --ignore=autocorrect --ignore=autocorrect-swap \
    --ignore=browser-unsupported:ie7 --ignore=browser-quirk:ie7 \
    --ignore=suggest-relative-unit --ignore=unofficial \
    myfile.css > myfile_pretty.css
```

This is very similar to the command that my work is currently using when pretty printing their CSS files.  Their target is IE8 (thus we don't care about IE7), let the pretty printer autocorrect things, ignore the W3C recommendation about relative units and ignore the unofficial things that browsers understand but are not in the CSS spec.

This example shows you how to ignore various codes, and some of those codes have associated values.  For instance, you can use `--ignore=browser-unsupported` to ignore all warnings about browsers not supporting some aspect of CSS, or `--ignore=browser-unsupported:ie7` to only ignore those warnings that relate to Internet Explorer 7.

You will also want to check out the [Error and Warning Codes].

Specifying Beautifier Config Options
------------------------------------

All of the options that are described in [Beautifier Options] can be specified in a JSON file.

```
prettycss --config my_custom_configuration.json myfile.css > myfile_pretty.css
```

[Beautifier Options]: BeautifierOptions.md
[Error and Warning Codes]: ErrorsAndWarnings.md
