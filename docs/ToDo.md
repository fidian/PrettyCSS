To Do
=====

* `@charset` must be the first thing in the CSS if it is specified at all

* Add conversions between px, em, pt, and %.  See pxtoem.com for some charts.  Default is 16px = 1 em = 12pt.

    * in: inches — 1in is equal to 2.54cm.
    * cm: centimeters
    * mm: millimeters
    * pt: points — the points used by CSS are equal to 1/72nd of 1in.
    * pc: picas — 1pc is equal to 12pt.
    * px: pixel units — 1px is equal to 0.75pt.
    * ex: In the cases where it is impossible or impractical to determine the x-height, a value of 0.5em should be used.
    * em: Base font size
    * %: em * 100, so 100% = 1em

* `font-weight: 550` - if autocorrect, round to 500 or 600 since only multiples of 100 are allowed

* Option for all urls to begin with ... (custom validation)

* Fix the live demo / HTML version to add coloring and whatnot

* Rework how whitespace is added.  Might need to rework selector parser to make a selectors object?

* Comments in some areas are invalid.  Move them to a valid location:

        p /* bad0 */
        a /* bad1 */ { /* good0 */
            padding: /* bad2 */ 8px; /* good1 */
            position: relative /* bad3 */;
        }

* Rework tokens - I have three different implementions

* Move "inherit" to declarations like expression()

* nth-child parsing is off.  Things like ":nth-child( +3N - 2 )" behave poorly.  Need a way to format that whitespace as well.  Treat it like math?  Separate formatter?
