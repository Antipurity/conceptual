This is a journal of interesting (at the time) thoughts relating to the development of the Conceptual project.

Why waste life on another? Movement to another foundation will cause a remake.

Newest first.

---

- **Concepts as semantics (1 September 2019)**

Rewriting rules (like `(a,b) => 12`) are pretty cool. We can use them for arbitrary transforms, functions, destructuring (binding), objects (the first of matching keys becomes the resulting value). But why do we ignore the "any semantics can be specified as a bunch of rewriting rules"? It would be great for usability. Concepts (`(concept …, concept …)`) could make it extensible.

Anyway, we *could* specify the whole semantics of the Core as a *single* bunch of semantic rewriting rules, applied only to the currently-looked-at expression, and a way to combine sub-semantics via `concept`.

Uh... The point is, is there really a need for something like `do`? Can't the whole semantics be specified as just `concept` at their core (and very simple symbol-based pattern-matching-replacing), with the rest being extensions of that?

There should be.

Let's try to devise it.

First, let's change the intended core syntax a bit. `[Square brackets]` should be used for arrays, like in JS; `{fancy brackets}` should be used for objects (first-of-members, or just first; `{ 'a'=>1, 'b'=>2 }`), just like in JS. This leaves room for… `(round brackets)` — a Lisp-like way of specifying code+data.

These round brackets are extremely easy to parse. They are *the* best choice for the core of the core. So, for now, we should become basically Lisp that sources out its semantics to data.

(Also, using JS for syntax highlighting is even better-looking with this, probably.)

The rewriting rules for this, in terms of Core, are:

```javascript
(f) => f
(f x) => core f x
(f x y z) => core f(x, y, z)
```

Alternatively, in terms of `call` and `array`:

```javascript
(f) => f
(f x) => (call f x)
(f x y z) => (call f (array x y z))
```

These array expressions (`ax`; `(ax …) => (…)`) *branch to data* by returning the first success of its sub-items:

```javascript
(concept (…items)) => {…items}

(concept (…items)) => (first …items)
```

Now, there are two things that hinders us from making literally-2-parse-rules `ax` and using it to define the rest of the Core:

- `=>`. `(rewrite From To)`? Any shorter name?

- `…`. `flatten` is both too long (should be `_`) and too complicated to define; we should use its particular form, like `(head Head Tail) => _((Head), Tail)`. Any more descriptive name?

- Also, in the `ax` sub-language, we have not decided how to extend syntax, have we? We're gonna need that to promote `ax` from an internal-only or mind-only DSL to Stage-0. Via semantics (`(concept { (eval Rule Program) => … })`), used when we have finished one expression but there is a string left, or what?

(Also, working in the edit-file window... this is even better than using a proper text/program editor. Unless the browser crashes. So, should save. Question answers can be edited in later.)

---

- **Acting is doing (24 August 2019)**

Acts are better thought of as continuation-passing style, the most general form of doing stuff, coalesced into a concept…

But then, do we even need to expose the interpreter loop, if "doing stuff" is acting? We used to use act overriding for errors (to always return), but with functions as definitions, we can literally just match that anything. And don't we wrap the interpreter loop in a continuation anyway, to use it (an async-promise or sync-return-or-throw)? Acting is the more general form of doing stuff than endless repetition.

In fact, acting should probably be called `do(What, With, Then)`; defining doing is how time flow should be done. Time is control. A natural dictionary choice is done.

This even solves the "functions accept act objects instead of data, needed for generality but hampering/murking common use" problem; those that need to have custom caching behavior or alter control flow or something can just define doing, and there is no phantom split of stepping/acting.

(And, capturing should match the control-flow graph and not just look at nesting.)

Now... Now... What is the core? `concept`, `eval`, `do`, `error`, `first`, `last`, `capture`, `flatten`, `record`. 9 things for a pure language.

Damn. Two, these *feel* like a great discovery, a great conceptual leap, the core of cores. Record... Remember... Most holy, most divine, most perfect...

Hopefully.

---

- **More involved parse extension (24 August 2019)**

Extensibility of parsing should be put into the extensibility framework, right? Making it a single modification to array parsing is no good. What about this:

Concepts can define `eval(OldRule, String)→(Meaning, Rest)`; the default parsing rule just repeatedly reads an identifier (characters followed by whitespace or end), looks it up, and parses the rest with the parsing it defines (so, `core …` is how Core programs should be written), till the end. Things can define what comes after them — in a manner that is not necessarily native, but done as natively-constructed conceptual objects in-memory; can the bootstrapping stage get any smaller? Well, this is an easy base for extension, at least.

(And again, extension is get-then-branch.)

Functions do not have to be constrained to `Code Data` to be called — that is just the default behavior; they can define the proper syntax after them, like:

```javascript
hex 789abc
[ commaless 1 2 3 4 ]
[ rtl double sqr 12 ]
[ core 34 ]

// comment
string 'ify'
group [1,2,3,4]

json { "a": 12 }
html <br>

core concept[eval(Core, In) => (5, eval(Core, In))] 6 // (5, 6)
  //Wraps the result of the rest in (5, …).
```

(Combining syntaxes is done with `first(…)` to try-in-order, but is more involved to create a sequence — pass A's rest to B: `(Rule, In) => [(result, Rest) => (result, syntax(B, Rest))] syntax(A, In)`.)

(Matching failure should cause an `error(Suggestions, Rest)`; the top level catches those errors, and just continues.)

This removes *all* clunkiness (`#syntax …` in Many) from language-oriented programming, and really makes using a DSL as simple as just thinking its name.

---

- **Thinking about rewriting systems (13 August 2019)**

While the simplest syntax is `(…)`+`name` (nesting and binding), the simplest semantics are `from→to` (match-replace rules, or functions, and pattern-matching).

These rewriting rules are often organized into rewriting systems, where rules can be added to a scope at any time, and any of the ones that can apply, apply. This mirrors how it is done in logic on paper, and is very convenient (like for auto-handling different forms of the same equally: equality is equivalence). But this means giving up precise execution control to "apply any of …", does not allow forbidding nor controlling extension of behavior, and so it seems incompatible with many other basic semantic models. To put it into a singularity, it has to be precise *and* able to search, extensible *and* controlling.

Is there a way to plug holes of rewriting systems? It needs to fundamentally always choose one rule, but have search; it needs to allow re-defining itself. Need to get there from just rules.

Based on the past, a base for the future. It needs a point of configurable transformation: the currently-executed rule (possibly built up from rules and rule combinators, deterministic or probabilistic, just like parser combinators). Since on rule application, we only know the rule and the value (and continuation), values (*all* values) should define that; since a rule *is* arbitrarily-configured transformation, it should be done via a rule.

The extension point here is the value; we need a de/constructor for that (different roles in match and in replace). But we also want to be able to extend that de/constructor, for full control; *but*, that's *2* extension points. The number 2 does not exist in maximally-simple design, only 0/1/∞; so, we need to extend extension itself. We'll cut this one short: de/constructor `concept Defines`, applicable to everything; execution checks itself in that (0→1), and rule application checks the definition of rules by values (1→∞).

This plugs the holes. Though, why would anyone want to *improve* anything that needs such effort? Just focus on reaching on maintaining a level of sophistication: rewriting systems are good enough to be used by humans today.

- **Thinking about acting (9 August 2019)**

Putting responsibility for extending definition onto all functions (all intended to be generated through one source, true, but still) is exactly what we wanted to avoid. It did not seem right to *not* put that in acts anyway. We can do way more in acts than nothing.

Acting should wrap JS functions (that return or throw, access (*take* responsibility for, then drop it) arguments or their parts) to allow much more convenient development.

(Wrap both direct and inverse control flow, intertwining with `error`. Wrap definition, intertwining with `concept`. Use ref-counting to not create a copy on *each* iteration step, and be more efficient. For core functionality, *it makes sense*.)

(Though, "arguments or their parts" — we seem to be unsure about whether to do shallow or deep handling.)

We need a function that is the definition of stepping at acts, `wrap`, that:

- Returns `act(act.then, Result)` to interpreter if successful or if caught `throw result(…)` (`self.result` is part of the JS API for this).

- Returns `error(Err)` to interpreter if caught an error.

- (Cannot think of a good way of requesting an argument properly — don't we need to destructure then restructure an input, where we are not even told which one? If we aim for deep arg requests, anyway. Shallow requests have the same no-extensibility problem, but with less capabilities. …We'll just leave thinking about that to functions — or, to the future.)

- Drops objects that were taken inside; ensures that zero-outside-ref-count objects are freed when the current interpretation step ends (to exploit cache, and to be a little like what needs to be done for parallel sync). …How to ensure that no double-takes happen when we return from requests, or that takes must happen before value use?

Two out of four are unknown. Not good, but can we add them later?

---

Also, right now we demand that definitions are immediately done in terms of base. They should be either functions (executed immediately, wrapped by act) or non-base things (that define stepping in an act). How exactly is code affected? In `call` (essentially a no-object act)… need to open code and look through it. That run-to-completion behavior of a lot of internal searching can be annoying.

- **Thinking about graph/branch search (9 August 2019)**

Purity can be done by overriding `pure` to pattern-match to equal things; `pure Object` does the match or else adds the `Object` pattern to at least one of its components. This is simpler than it was before.

Purity of acts allows immediately cutting off infinite recursion (returning to already-visited states). This means that acting can not only be seen as, but also *be* graph search; we just need to have branch selectors.

Using `first` on every junction makes for depth-first search. Breadth-first has no direct analogue, except for possibly preemptive interleaving of branch executions. (`last` ignores all but one results and is thus not a *search* function.)

The way to choose the branch is, generally, arbitrary; but in all cases, we need to be able to try all the rest if one fails. So branch selection of this graph-search is "the first of some shuffling of an array of branches". For efficiency, the searched graph should have few connections.

Random shuffle is one candidate; sorting is another. They correspond to random and best-first searches respectively.

This approach does not (by itself) handle searches that interleave exploration of sub-branches (by non-push-pop manipulations of the node queue), like breadth-first or beam search. Nor does it (by itself) handle trying several variants *then* evaluating the best. Still, pretty convenient and simple.

Still, integrating search for alternatives as basic functionality seems more important than this trivial thing. Interpreted things always have a chance to be replaced with `alt Thing`; that chance is the system's parameter (potentially optimizable automatically, later).

That "first of reordered array" is just an implementation though. We could want to try randomly rewriting these "any of these" in some way, but the probability distributions could be used elsewhere anyway, so we cannot just pattern-match those away; so we want a separate definition layer, `one(branches, reorderFunc)`.

...This is almost the same as before. This thought is worthless. Go back to acting.

- **first (8 August 2019)**

(A failed experiment. That sharpness of thought has been lost. A shame. It was a favorite of mine. No matter, just need to keep looking for an approach that works.)

Try each item in order, passing the first success to continuation; if all fail, fail too.

Go to 0th, then [return if not failed, else go to 1st then [return if not failed, else go to 2nd then [… else return `fail`]]]. We want to encode this behavior in a function, with all state passing through continuation-closures. Can it be any less efficient? No matter.

[...]

- **Thinking about first/last and branching (4 August 2019)**

`first`/`last` alone cannot repeat `if (!b) …`, and so do not encompass branching, even with `fail`. A fatal oversight. It has to be fixed.

How could branching be augmented to include negation?

- `throw`/`catch`. The usual for exceptional control flow.

- `fail`/`failed`/`nor`. Entangles booleans into where they are not needed.

- `error`, to invert control flow direction. The smallest variant here, but does not allow reacting to errors, merely inverting error-ness; or can we copy it, and do something with branching? Like `first(v, transform[error v])`. So, we can, and this *is* a suitable option.

- `finally` and `fail` with capture (so it can be pattern-matched against). Generalizes to different `fail`ure types gracefully. May open a way to resource destructors and to "past=host=inside, present=finally=edge, future=effect=beyond".

If `error` is viable, then `error` it is. Minimality of core means maximality of capability volume.

- **Acts and arrays (4 August 2019)**

Let's just quickly add acts (objects with function/value/continuation, defining what their functions define) and array support (passing defines to the first item that accepts them):

```javascript
class Act {
  constructor(f, v, then) {
    this.f = f, this.v = v, this.then = then
  }
  [def](f,v) {
    if (!(v instanceof Act)) fail()
    return v.f[def](f,v)
  }
}
self.act = ([f,v,then]) => new Act(f,v,then)

Array.prototype[def] = (f,v) => {
  if (!(v instanceof Array)) fail()
  for (let i = 0; i < v.length; ++i)
    try { return v[i][def](f,v) }
    catch (e) {}
  throw null
}
```

The real work of acting happens in recording; acts are just a middle-man.

(Based on a past, a base for a future — this is the extensibility principle. Potential becomes implemented, multiplying effectiveness, thus allowing exponential improvements. …Though all this is too trivial for that.)

To calculate an act's argument, return `act(step, arg, result => replaceArgWithResult)` from the acting function (…shouldn't `step` here be `finish` though?). Once in an act, one remains in the act.

Conceptually, returning that allows args to re-define stepping to re-define returning; but what does that mean for our JS code? Should we check re-definition in acts; how? Having questions is unprofessional for the explainer, and they must be answered.

- **The interpreter loop (1 August 2019)**

No flights of fancy; pursue only code. Achievement is only meaningful if done while bound in every way needed.

So, let us do the very base, "doing stuff", that will serve as a base for doing stuff. The language will be driven by a simple asynchronous interpreter loop.

HTML, JS… Most accessible, and so a suitable base.

We want two text areas, one for inputting code and the other for showing progress and results. We also want to be able to adjust CPU usage, because if we don't do that here, no one will do it.

Nothing fancy, just some almost-styleless HTML:

```html
<!DOCTYPE html>
<head>
  <meta charset=utf8>
	<title>Loop until exception</title>
</head>
<body style='width:100%;font-family:monospace'>
  CPU usage: <input id=timeUsed type=range min=0 max=100 step=1 value=20> <div id=timeUsedLabel></div>
  <br>

  <textarea id=codeArea style="width:50%;margin:0"></textarea>
  <textarea id=resultArea style="width:50%;margin:0" readonly></textarea>

	<script src=../core.js></script>
</body>
```

We'll bind to elements directly in JS. Ugly and non-modern, but we are much more concerned with the very basics.

First though, we should talk about how Core objects will be represented in host (JS), and how extensibility will be handled. There isn't much to say: since a function is supposed to represent "transform/change input arbitrarily", we'll demand every JS thing that Core can touch to have a function in its `def` slot:

```javascript
self.def = Symbol('defines')
  //{ [def](what) {…} } is the definition layer.
```

We intend to have no "base" level internally, and do everything through the definition layer (since in JS, we can do that except with null/undefined, by modifying native prototypes). Functions would define the interpreter loop, exposed through the `step` function.

We want to have native helpers to call and to throw exceptions, because we are likely to do that a lot:

```javascript
self.fail = e => { throw e == null ? null : e instanceof Error ? e : new Error(String(e)) }
self.call = (f,v) => v[def](f, v)(v)
```

Let us also define points for extension:

```javascript
self.step = {}
self.parse = {}
self.serialize = {}
```

Calling defers to the definition of code by data. Failing wraps a message in `Error` for better error-stack reporting, unless it is `null` (we will want fast non-specific failures too). Functions are defined at definition site, not at base, so we just make them unique objects. What would have been `f(v)` is properly written `call(f,v)`, for this implementation.

(Words are tools for verifying that code is obviously correct. Already, code has improved from being explained.)

Finally, we can move on to what we are here for — interpretation.

We want a value that continuously changes, and asynchronicity; when the inputted code changes, the loop is restarted. The simplest variant would look somewhat like this (wrapped to not let variables escape into the surrounding global scope):

```javascript
;(() => {
  let x, id
  let show = x => {
    try {
      resultArea.value = call(serialize, x)
    } catch (e) {
      resultArea.value = '[Cannot serialize]'
    }
  }


  //delay so that definitions can go after this, not before.  
  requestAnimationFrame(codeArea.onchange = () => {
    //restart the loop.
    try {
      show(x = call(parse, codeArea.value))
    } catch (e) {
      x = null, show('cannot parse')
    }
    cancelAnimationFrame(id)
    id = requestAnimationFrame(function loop(start) {
      id = null
      try {
        x = call(step, x)
      } catch (e) {return show(x)}
      show(x)
      id = requestAnimationFrame(loop)
    })
  })
})()
```

However, things are not that simple. The basic structure is good, but it neither limits its CPU time usage, nor batches quick steps together.

Let us batch first, since that is the simplest: we just need to figure out our budget each frame, and loop the stepping until we are out of time. The `loop` now becomes

```javascript
function loop(start) {
  id = null
  let max = timeUsed.value / 100
  let end = start + 10
    //limit to 10 ms to ensure smoothness.

  //iterate until we are out of budget for this frame:
  do {
    //do one interpretation step (loop iteration).
    try {
      x = call(step, x)
    } catch (e) {
      return show(x)
    }
  } while (performance.now() < end)
  show(x)
  id = requestAnimationFrame(loop)
}
```

Now, let's add some error-reporting to round it out (these should only be seen during development, so if they *are* seen, they can be altered to include more information if needed):

```javascript
function loop(start) {
  id = null
  let end = start + 10
    //limit to 10 ms to ensure smoothness.

  //iterate until we are out of budget for this frame:
  do {
    //do one interpretation step (loop iteration).
    try {
      x = call(step, x)
    } catch (e) {
      try {
        return show(x)
      } catch (e) {
        show('cannot show result/error')
      }
    }
  } while (performance.now() < end)
  try {
    show(x)
  } catch (e) { show('cannot show mid-calc expression') }
  id = requestAnimationFrame(loop)
}
```

Second, we want to budget time usage; we cannot predict how much time a piece of code will take, but we *do* have a number we can adjust that directly correlates with time used — time budget. We want actual and desired time used to converge, so with time the actual must be becoming closer to the desired, forgetting the past. Exponential decay (each step, multiply by a number from 0 to 1) seems like a good way to forget for now.

We need variables to hold past used and total time, start of last frame (to calculate total time), and exponential decay's coefficient (.9 seems as good as any):

```javascript
let lastStart = performance.now(), used = 0, total = 0
const rememberCoef = .9
```

Let's call `max` the desired `used / total`. Time that will be added to both `used` and `total` is (at least) `T` (time budget); we want the new time ratio to remain `max`: `max = (used + T) / (total + T)`; solving this for `T` yields `T = (total*max - used) / (1 - max)`.

The loop now becomes:

```javascript
function loop(start) {
  id = null
  let max = timeUsed.value / 100
  let end = start + Math.min(10, (total * max - used) / (1 - max))
    //limit to 10 ms to ensure smoothness (less than 1 animation frame, minus any browser work).

  //iterate until we are out of budget for this frame:
  do {
    //do one interpretation step (loop iteration).
    try {
      x = call(step, x)
    } catch (e) {
      try {
        return show(x)
      } catch (e) {
        show('cannot show result/error')
      }
    }
  } while (performance.now() < end)
  try {
    show(x)
  } catch (e) { show('cannot show mid-calc expression') }
  id = requestAnimationFrame(loop)

  //adjust times
  used *= rememberCoef, total *= rememberCoef
  used += performance.now() - start
  total += performance.now() - lastStart
  lastStart = start
  //show times
  timeUsedLabel.textContent = `${max*100}% needed, ${used/total*100}% actual`
}
```

Now, it needs something trivial to parse/serialize. Let's just add JS numbers and strings:

```javascript
String.prototype[def] = f => {
  document.body.append(''+f)
  if (f == parse) return v => {
    if (!isNaN(+v)) return +v
    fail()
  }
  if (f == serialize) return v => {
    document.body.append('3', v)
    return v
  }
  fail()
}
Number.prototype[def] = f => {
  if (f == serialize) return v => {
    return ''+v
  }
  fail()
}
```

This concludes the interpreter loop.

- **English punctuation/sentence structure (31 July 2019)**

English has 5+ precedence levels used to specify tree structures without recursive rules (namely, bracket analogues). In order of descending preference and ascending pause-length-in-speech: "-", " ", ",", ";", ".". Sentences have special parsing rules that handle "?!..." and being at the end; they should still be treated as operator+operands for most convenient semantic pattern-matching. There could also be further levels of word tree separation — paragraphs, line-separated blocks, chapters. " " should be the most common separator used.

(This is a codification of the fact that English is intended to be *spoken*, not too slow and not too fast, with different relative pause lengths conveying sentence structure. Computation/thinking delays add to pauses too.)

This should ease parsing English a bit.

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

- Implementation notes

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

Implement... Chevrotain lexer, Chevrotain parser, class Series extends Array, copy and adjust (zero-)delay, make the interpreter, write functions. To do.

---

- **Multibase JIT compilers/intetpreters (1 July 2019)**

Traditionally, compilation is a full translation to one base language of some intermediate representation (IR), and interpretation is a slow one-by-one translation (via calls to pre-compiled functions) to one base language; things in between (like JIT inlining) are seen as unimportant implementation details. But today, just one base language may not be enough to get full efficiency --- at the very least, CPUs/GPUs exist; quantum computers will require different base languages; and, programming environments may have different usable base languages with different capabilities (like JavaScript and WebAssembly and experimental developments in browsers). A non-traditional approach to program execution may prove much better.

Suppose that a language is a function that takes a (ready-to-interpret) IR node and returns its description in the language (a mix of strings and return-to-interpreter IR continuations). Suppose that we have some strategy for expanding IR continuations in those descriptions (say, breadth-first search until the total size is over 2KB). Then, program execution is repeated and cached translation into any of base languages. Compilation/interpretation arise from particular (quite rigid --- can be way more flexible here) expansion strategies. No functions, only code generation (and built-in base evaluation).

(There are more details on the need to avoid re-expanding the same node and avoid exponential expansion sizes (via variables), but my finger is tired anyway.)

The best base language for a piece of code can be picked now. Different bases can be used as one. Continuous search/optimization for better equivalent programs can be done (unlike with pure compilation). Structured and beautiful output of executed code is possible. A meta-circular language implementation with a primitive interpreter can self-rewrite into any base language and be more efficient (which is why I'm doing the "first shitty implementation"). And that's with little more than macro-expansion, not full-blown arbitrary language translation.

One IR and one unifying language can be a power like no other. Just one language can be enough for everything; making any more is ultimately a wasted effort. Why work on different languages, making power without unity?
