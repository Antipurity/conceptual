This is a journal of interesting (at the time) thoughts relating to the development of the Conceptual PL.

Why waste life on another?

- **Minimalist extensible syntax (23 July 2019)**

To bootstrap syntax, a smaller core that can be built upon is better. (Same as with anything.)

It should be human-readable and not just a be machine format, for convenience.

So, let us define the syntax of 'SyntaxCore' as (each item here is the first success of written and next):

- 'grouping': `[next]` (does not need `Shift` to type, unlike `(...)`).

- 'series': `... ... ...`, separated by whitespace — acts as a scope for syntax extensions: checks each item for "parse the following items with this rule" directives.

- 'labels' — either English letters, numbers, dot; or any characters enclosed in `'` (two consecutive quotes inside are used to escape a quote — no other escaping).

Really, there is no need for any other syntax rules; this is almost extensible-syntax Lisp, but with somewhat nicer brackets and lazy semantics (strictness is optional, being which is always more natural).

(Calls have the function first, operators are calls, each node is interpreted with a global async loop that resolves labels, dispatches to functions, and lazily fills in computed slots back in caller — that is the whole basic functionality, easily fitting on top of a class that extends a native array.)

---

How exactly it allows changing parsing is pretty much just an exposed parser's interface.

Namely, these globals are relevant:

- `use Rule`: uses Rule zero or more times (until the end of the current series is reached, usually `]`) to parse the characters that follow. A Rule returns special parsing instructions that define it.

- `last ... ... ...`: this whole sequence must match one after another when this is returned; rule result is the last match's result. Serial execution.

- `first ... ... ...`: the first that matches is the result. Backtracking.

Lookahead is omitted, because its overuse makes for non-intuitive grammars, and it is unneeded for a minimalistic parsing core.

There are no character ranges either (in the API). Careful thought about exactly what to include is much preferred to broad but ultimately buggy abstractions, like allowing all Unicode letters.

(Standard PL features like variable usage, or exposing the host language's features for use, are omitted here for brevity but are necessary.)

---

# Implementation notes

While premature optimization is the root of all evil, we *are* evil, so thinking about how to not write a pile of shit before trying it is acceptable.

Also, while we have always been avoiding using what other people wrote, we should now be desperate enough to use libraries, which would provide an extremely nice productivity boost, possibly even enough to be productive. [Chevrotain for JS](https://github.com/SAP/chevrotain) looks good.

Still, simply implementing the mini-language above in terms of a parsing library would make its performance bad. To bring out a foreign interface's full potential, the reverse should be done: go through *it* and implement (fully handle, via pattern-matching) *us* for each part.

- In particular, tokenization is an important optimization technique; for us, regular expressions are used as its DSL. Of course, it can always be made into one-char-is-one-token, but a better algorithm for turning an embedded-semantics rule/expression mix into a set of tokens, is preferred. To extract all the tree's strings directly in `first`/`last`, none of which has any prefix/suffix of another as its prefix/suffix; if no parts inside collide, pattern-matching on a parent of all RegExp/Chevrotain parsing parts (`x+`/`(?:xyz)+`/`.AT_LEAST_ONE`; `x*`/`(?:xyz)*`/`.MANY`; `x?`/`(?:xyz)`/`.OPTION`; `x|y|z`/`(?:x|y|z)`/`.OR` — all can be done in terms of and/or here) should be done. Rules and tokens (`.SUBRULE`/`.CONSUME`) should have exactly the same interfaces, only with just different base languages/interfaces; a limited functionality augments the general one for the greater good.

- Repetition and consuming optionally can be useful. Joining items with a separator (in Chevrotain, `.AT_LEAST_ONE_SEP`, `.MANY_SEP`) is useful. LtR/RtL operator parsing (join+reduce, base separated by operators and a per-expression transformation) is useful. They can all be tricky to implement quickly, but they are not essential for minimalism; they should be done in a library.

- In Chevrotain, DSL rules need an incremented numerical suffix when they refer to the same thing. This is not done automatically to allow not using code transformations there, but such a finicky thing should have no place in a public interface.

---

The full minimal list of needed functions/globals:

- Lambda calculus (with many bindings allowed at once): `later Body A B C` to return the recorded partially-evaluated (with side-effects remembered and journaled — here, just advancing on matching a syntax pattern) body for use later, and `Function A B C` or `now [Function A B C]` to fill in the blanks in the record now. This allows actually doing stuff, though inefficiently.

- Style change: `use Rule` (when seen during parsing) executes Rule to match until the end of the current series; `match A B C` (when seen during style change) matches strings (statically-written-here labels), advancing the program position (a side effect) or failing; returns the string that was advanced through; an empty string will match any one character.

- Host access: `host ImplName` to get one implementation global; in JS, this just accesses the `self` object. This access to base allows to regain efficiency with effort. (Operators and other built-into-syntax functionality must be accessible as functions.)

- Array use: `head Arr`/`tail Arr` to return the first or the rest of elements respectively, `headed Head Tail` to combine, copying. This is similar to Lisp's `car`/`cdr`/`cons`.

- Branching: `last A B C` for sequencing operations (returns the last success), `first A B C` for backtracking (returns the first success), `fail` (triggers backtracking). Non-host side-effects (here, only advancing the actual program position on matching) are journaled, and will be visible inside but canceled on failure.

To recap: `later`, `now`; `use`, `match`; `host`; `head`, `tail`, `headed`; `last`, `first`, `fail` — up to 11 globals (9 not during parsing).

---

Executing functions during parsing raises an interesting capability: the ability to execute a yet-incomplete loading program. Normally, to show something as a program loads (like a loading indicator), it is manually split into modules, creating libraries and frameworks for that, but this is automatic.

`first`, `last`, series (array construction) — the only functions accepting many inputs and processing them linearly. These are modularization and partial-execution points when seen during parsing, far more fine-grained than is done manually.

In browsers, HTML and CSS have this ability, but JS does not. This would be more streamlined.

---

Implement... Chevrotain lexer, Chevrotain parser, class Series extends Array, copy and adjust (zero-)delay, make the interpreter, write functions.
