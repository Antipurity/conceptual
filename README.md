# Prologue

(Specification of a natural and expressive conceptual programming language. A bridge to implementations.)

Deepest understanding, given a syntax and named a language. Base of bases.

A re-thinking of some of programming language theory and practice; often the same, sometimes different.





# Base syntax

A precise concrete syntax; a character-sequence matching rule. Does a concept need one? To define, to focus, to exist? A lot of the most basic concepts do, here.

```javascript
Hello there general

15.0 NaN ∞ Infinity -12e3 -0xff -0×FF
'string1'"string2"`multiline
	\`string3\``
print('Sum:', 1+2, '.') // prints 'Sum: 3.'
//Above are 4 sequences of function calls in a sequence.

(1,2,3)(1
	2 // The line breaks
	3)

(1+2)*3
```

Or, in words:

Variables/identifiers and numbers need whitespace to separate them if adjacent; everything else can be written immediately (though for readability, pretty-printing with whitespace/line-breaks is recommended).

Textual sequences like `15.0` or `NaN` or `∞`/`Infinity` or `'string1'` or `"string2"` or the multiline string3 here mean what they often mean in languages (like JS) — number or string literals. Strings are sequences of Unicode character code-points.

`//…` are comments until the first line break, treated as whitespace (do not use them — allow the program to share in the glory of your thoughts too; will not survive any self-rewrite otherwise). Mostly allowed to exist for this documentation.

Line breaks act as `,`/`;` (sequence item separator) except at the beginning/end of `(…)`.

`(…)` groups terms into one (also must be used to access operators as code, like `(*)` for multiplication); use(d) to alter parsing precedence when needed.

(A few non-ASCII characters are used for readability and freshness (namely, `→`, `⇒`, `…`). In almost all cases, these can be substituted with ASCII versions for more writeability (namely, `->`, `=>`, `...`).)

## Operators and infix expressions (`(+)`, `(*)`, …)

```javascript
print(1+2) // 3
```

Operators exist for convenience, readability, and familiarity, even though they take up a good chunk of parsing. Equivalent programs can easily be expressed in terms of other parsing rules if needed.

Whitespace does not determine precedence (`1+2 * 3` is the same as `1+2*3` and `1 + (2*3)`); the used operators do.

In the following list (for completeness), each group (precedence level) is either as specified or falls through to the next group in parsing (meaning that emitting a lower group from a higher one requires grouping `(…)`). To specify, in the set of operands of a group, the left-most will be the next group in RtL groups, or the right-most in others (LtR); other operands will be the current group (so RtL is `1**(2**3)` and LtR is `(1+2)+3`).

- Acts/calls, 2 groups:

	- No-whitespace acts `Code Data`.

	- (RtL) Non-line-break whitespace acts `Code Data`.

- Object decomposition, 2 groups:

	- Conceptual override `#` (like `A#'str'`).

	- Access `.` (like `A.'str'`; `A.B` can only read).

- Object composition, 2 groups:

	- Unary/nullary no-whitespace wildcard `…`.

	- Key-value `→`/`->` (`(→)`).

	- Function definition `⇒`/`=>` (`(⇒)`).

- Broadcasted operations, 7 groups (each has an assigning version: `A += B` → `A = A + B`):

	- (RtL) One-operand `~`, `+`, `-`.

	- Arithmetic, 3 groups:

		- (RtL) Exponentiation `**`.

		- `*`, `/`, `%`.

		- Two-operands `+`, `-`.

	- Bitwise shifts `<<`, `>>`, `>>>`.

	- Bitwise, 2 groups:

		- `&`.

		- `|`.

- Pattern-matching, 4 groups:

	- Inclusion `x:T`.

	- Comparisons `<`, `>`, `<=`, `>=` (`A <= B` is `not(A > B)`, and `A >= B` is `not(A < B)`; and `x<y<z` is `x<y && y<z` (different-direction comparisons are not allowed)).

	- In/equality `==`, `!=` (`A != B` is `!(A == B)`).

	- (RtL) Assignment `=` and things like `+=`.

- Control-flow operations, 3 groups:

	- Logical, 2 groups:

		- `&&`.

		- `||`.

	- (RtL) Conditional `?:` (`A ? B : C`).

	//Either `1==2 && 2==3` or `a = 1?2:3` does not fit usual usage… Should control-flow be merged with broadcasted operations (then, `&&`===`&`, maybe?), or only conditional?
		//Would it make sense for comparison results to accumulate in sequences (and thus to use `?:` for selecting)?

- Sequences, 3 groups:

	- Sequence `,` (`(,)`).

	- Sequence `;`; can be used for more compact two-layer specification of nested sequences.

	- Sequence line break (without `,`/`;` before or after); can be used for more compact three-layer specification of nested sequences, or for readability.

- Expressions/terms (including grouping `(…)`), and everything non-operator: containers, strings, variables…

All operators can also be accessed as a function (requiring grouping): `(+)(1,2)` is the same as `1+2`. Infix (between terms) syntax is merely a convenience. Define variables with those names in the local scope, and those will be used to define the operators.

In addition to implementing the operation on broadcasted-onto values, operators can accept types as arguments to perform type inference: `2 + Int` → `Int`. Type inference is a tool that is usually used to know when to omit things like type checks in generated code, so easy access to it is convenient (though not technically required).





# Flexibility/overriding (`(#)`)

Here, anything is a concept, and a concept is anything. To maximize evolution potential, concepts can be overriden/extended (mainly used in ever-present basic acts/calls to select the execution branch).

(Nothing that is said here is an absolute rule forever, it's just a suggestion (including this rule). Complete freedom, yet exactness; void of constraining definitions.)

(There are no keywords, only overridable concepts — though for uniformity and readability, the base syntax cannot be overriden during the initial parse.)

To be a little more precise, the `#` operator is used for conceptual overriding: acts (function calls) will use what is overriden on the input if it overrides the applied function/concept. `Input#Func` or `(#)(Input, Func)` will get the override, and `(#)(Input, Func, To)` will set the override (on the returned copy), and `(#)(Input)` will return a collection of all overriden concepts. The `#` operator can be overriden too (allowing proxies and adapting storage methods).

	//Wait, if it's only intended to be used in definitions and implementations, then shouldn't it NOT be in-place modification, but a copy instead?… But then, what *would* be in-place — something has to be…

	//With shapes and decomposition, there should only exist definition, defined in terms of access.

(Nothing more and nothing less is overriden; clean development. Conceptual overriding avoids name collisions by referring directly to things that need different behavior, unlike duck typing, which refers to names/strings which can coincide. `(#)` also makes conceptual development natural; if a concept is accessible, it can be developed further without going into it and altering the insides.)

(Try to not use or override `(#)` — it is rather low-level and ever-present. It should only be present in definitions and semantics-preserving equivalencies. Leave it to implementations.)

Concepts are completely separated, yet they play off of each other to create something seemingly greater.

(Complete lack of constraints on values/concepts (compositionality perfected — untypedness) is absolutely required, not only to make every possible thing representable (the only type is "literally anything whatsoever", the rest are optimizations), but also to avoid haphazardly mirroring all concepts near every artificial separation (like programming languages usually do with idea/design/compile/run-time things like intuition/theory/types/values); separate concepts properly, and the result is actually extraordinarily tiny (likely <5k LoC). Performance can be regained by compiling/simplifying for *particular* parameters/values — never all: future of "anything" cannot ever be rigidly defined, only suggested.)

	//What about definition, like `override{ call → (?a) 'data'a + 2 }`, though? Convenience?





# Execution (`finish`)

When seeing a thing unfinished, it is finished (evaluated, executed; it is not a computer — it is an executioner). This is the interpreter loop — expressions become values, code becomes data, questions become answers, actions become consequences.

Unless overriden, `finish X` returns `X`.

(Parsed programs are finished. Events schedule their finishing/cancellation separately.)

	//Should be `finish`, and have threads/asynchronicity/code-parallelism separate…

```javascript
print(1+2+3) // 6
	// The execution trace is:
	// - print(1+2+3)
	//   - (1+2)+3
	//     - 1+2
	//     - 3
	//   - 3+3
	//   - 6
	// - print 6 (prints that)
	// - 6
```

An execution fiber is created to parse and execute the source code of the user, and new ones can be created like `call(stuff, after)` (if you want to, for some reason) — `after` will be called with the result of `stuff` after it is finished. It is not parallel, it is not fancily scheduled (both are separate concepts); it just does stuff.

	//Maybe add something like, "In natural language, 'first A then B' or 'A then B' or 'A followed by B'."?
		//…Is it better presented by the concept "finish X"?
			//I mean, after all, it's not like we're gonna return to anything but the call site.
			//(…So, should return-to references in acts be PURELY an implementation thing?…)
				//(…Wait, isn't return-to purely an act thing, not a call thing?)
		//So, is it really a fiber, or a sequence? Or, what?

	//And, there should probably be (at least natural/basic, for interface interaction and such) actual thread do/redo with pause/unpause, right? Probably separated from `call`, right?

To protect a value from execution or overriding, use `wrap X` to protect and `unwrap X` to neglect (analogous to `quote`/`unquote`); that is how first-class expressions are implemented.

	//***`wrap print unwrap 1+2+3` ⇒ `wrap print 6` (can still be unwrapped; like quote/unquote).
		//(unwrap is special-cased in wrap, and does not create a special object otherwise)
			//(`call` (and all built-in implementations) should unwrap wrapped values. So `unwrap` has only one use (which is not unwrapping).)
				//(…Do we really want to duplicate it everywhere, though?)

```javascript
wrap print(1+2+3) // Does not print.

print wrap print(1+2+3) // wrap print(1+2+3)
	// The execution trace is:
	// - print(wrap print(1+2+3)) (prints that)
	// - (reduces to nothing)
```

```javascript
call(print 'no') // 'no'
call(15, x => print x) // 15
call(wrap print 'no', x => print x) // wrap print 'no'
```

	//What about being able to interrupt execution from the outside? And pause/continue?
		//`call` returns an object with #'start'/#'stop'/#'finish', right?
		//…Do we even need this, really?

	//What about access to own fiber though? Or at least wait-until (for acts and promises) and on-idle…
		//(And what about scheduling?…)

## Tracing (`trace`)

To trace execution is to follow each execution step: `trace(Touch, Expr)`. `Touch` accepts `Expr`, monitors/modifies it, and returns `Expr` (the next step), which is then executed if needed, unless a pattern-matching error occurs (these are ignored).

```
trace(print, print(1+2+3))
	//(…Act printing format could probably be nicer.)
		//(`act(Expr, Then, Result)`?)
	// print(1+2+3) → [end]
	// (1+2)+3 → print(1+2+3)
	// 1+2 → (1+2)+3 → print(1+2+3)
	// 3 → (1+2)+3 → print(1+2+3)
	// 3+3 → print(1+2+3)
	// 6 → print(1+2+3)
	// print 6 → [end]
	// 6 [not from tracing]
	// 6
```

Tracing should/could be used for debugging (and understanding executions more), setting time/memory limits, intercepting accesses to scoped state, sandboxing/isolating operations, execution scheduling, and optimizing on-the-fly (both before-execution and after-execution). (Being able to analyze and control execution makes all these not just black-box magic beyond the language, but explicitly specified; inspectable and transformable, like everything else.)

	//Naturally: trace Expr with Touch? Let Touch trace Expr? Expr traced by Touch?

(Development of optimizations should also develop a way to trace them sensibly. In particular, implementations should optimize into observationally-equal code, and override `eqv Code` for pattern-matching and acting-on (which inlining should override properly too). Users do not pattern-match code directly, only implementations.)

(Lazy execution (where control over argument evaluation is given to functions, not the executioner) allows more pattern-matching/optimization opportunities.)

	//What about… Inlining? Judgements?





# Lazy/deferred computations (`lazy`)

	//Seems like there should be a deeper explanation for this, connecting recording, code, execution…
		//Just `finish`, replacing `call` and inverted `wrap`/`unwrap`/`lazy`; all those should be removed…

`lazy X` computes X when a concept requests it (`X` will likely cache the result, but is not forced to). If `X` is always cached, does not affect semantics (`X` is always equivalent to `lazy X`).

	//…Isn't it better emulated with `wrap`/`unwrap`? Or is it better to have `lazy print unwrap(1+2+3)` only doing the print lazily (to use wrap internally)?

(Currently not computed when the system is idle. If never idle, then CPU caching means that it is most efficient to compute likely-related things all at once, either eagerly or lazily.)





# Concepts, acts, functions (`?`, `act`, `(⇒)`)

	//Should be rewritten and reimplemented; `concepts` are now anything, and vars/bind must be used.

'Concepts' is a low-level concept, allowing full control over structured execution/behavior (requesting dependencies and caching/memoizing); more familiar and convenient may be functions (`⇒`/`=>`), further down.

	//What about substitute-into-code, not just an act but any value; join?

	//Should we have arg-requesting… Or laziness of args?
		//What arg-requesting are we even talking about, in code? There is only one variable.
		//Laziness… that substituted variable contains unfinished computations, and decomposing it will access them. Is that all there is to 'laziness'?

(Creation and usage of concepts/code is made in such a way so that (run-time) evaluation, constant propagation (compile-time partial evaluation), generic programming, symbolic execution, deferred computation, value tracing, and self-awareness are all one and the same. Design-time, compile-time, run-time; everything is done as soon as possible, automatically; optimizations to any are both equally valid and equal.)

Concepts (code) (`(?Act)Expr`) are suspended computations (re-entrant continuations), awaiting data. Acts (`Code Data`) are pure things that, on execution, join data to code, filling the knowledge hole (created like `act(Code, Data, Then, Fiber)`; executed — how?).

	//Except, during parsing, we will not have access to Then, right? Only during execution?
	//Should we not also allow overriding `act` like `#act(this, then, fiber)`?
		//Maybe args must be requested explicitly by concepts, with a separate function `arg(this, then, fiber)⇒then`?
	//Names: Act→'Code', Act→'Data', Act#'out', Act#'Then', Act#'Fiber'?…

	//And what about strategies for delaying/scheduling the recording?
		//Doesn't it not make sense to intertwine record-usage-of-this and compute-lazily?
		//Shouldn't it be a part of `lazy`, and that alone?
			//(Maybe every single extension point should be a concept, not ever an arg…)

To allow both `print double x` and `f(x)(y)` (parsed as `print(double(x))` and `(f(x))(y)`): whitespace (`C (D)`) between code and data (function and arguments) is an operator that parses right-to-left with a lower priority, and lack of whitespace (`C(D)`) parses left-to-right first.

```javascript
print double(yes) f(x)(y)
	//print( (double(yes)) (f(x)(y)) )
```

An act has the same overrides as its `Code`, except for `Act#call`/`Act#act`/`Act#value`. It decomposes like `(Code, Data)`.

To execute an act:

- If `Data#Code`, `Code` is replaced with the execution result of that.

- If `Data#act`, the act is replaced with the execution result of that (in natural language, "when acted on, …").

- `Code` must be code here, which can accept data (an error is returned otherwise): `Code#call`.

	//What about infinite-recursion-detection?
		//(Putting a special throw-exception value on entry, replacing it on exit.)

	//What about different-parent-fiber, suspension and resumption?
		//Will there even be different ones?…

- The hole of `Code` is filled with the act. (Result could still be code if there are other unfulfilled holes.) (An act stores the previous result, so this way allows memoization/caching, full or partial.) //So, does an act use `call(Data, to)`? But then, it has to be non-concurrent…

	//Relying on `#` to be in-place is no good, since it will be phased out, and we will have to rely on decomposition instead…

(Things like tail call optimization (not returning to caller if not needed) can be *implemented* by making fitting basic functions (like 'if'/'cond') override evaluation. Returning to continuation is just a suggestion.)

## Self-awareness

Who are you? What are you doing here?

Self-awareness (self-understanding) is easy access to relevant conceptual self-replication (self-recording); self-explaining also requires emitting. Like many concepts, self-awareness is not a part of the built-in base of humans, and must be learned and taught.

This perfect dependency resolution is extremely useful in some scenarios (explaining things in the best way possible, convincing/teaching, spreading viewpoints, non-trivial resolution order of dependencies) and completely useless in others, like all concepts.

	//Wait, but doesn't this capture-scoped-variable design not allow promises?
		//Promises should be handled like: wait until their completion, but if system becomes idle, record usage…
			//So we need some kind of on-idle concept?
				//(Or can it be subsumed by scheduling 'first(main, idle)'?)

## Functions

Functions (`A=>B`) here are an advanced thing that combines code and pattern assignment, and forces memoization and requesting of all arguments. This allows much greater flexibility and convenience than if functions were a fundamental concept.

	//Shouldn't memoization only happen if all parts are memoized? Otherwise `() => print 1` will be mostly useless.
		//…Or is it okay, like "show only new developments please"?

A function is something executed with some particular input; an act, a join point to the interpreter, a lazily-evaluated value. Called like `Func Input`; defined like `Input => Body` or with `⇒` (likely bound in a var to be useful).

```javascript
print 15 // 15
print(a => a+2) // a => a+2
print (a => a+2) 13 // 15
```

On application, `Input` gets set (with `=`) to the passed input in a new lexical scope, allowing pattern destructuring (this is not a base concept here but a combination, allowing at least double the flexibility):

```javascript
f = (a, b: Int, c) => a + b*c
print f(1, 2, 12) // 25
print f(1, 'str', 12) // Error: cannot match arguments, expected an Int

fib = (n: Int) => n>1 ? fib(n-1) + fib(n-2) : 1
print fib(3) // 3
print fib(4) // 5
print fib(5) // 8
print fib(1,2) // Error: cannot match arguments

gcd = (x: Int, y: Int) => y ? gcd(y, x % y) : x
print gcd(16, 88) // 8
print gcd(16, 'str') // Error: cannot match arguments
```

To disambiguate on types of arguments, use `first` of functions (defined elsewhere): `succ = first(0 => 1, (x:Int) => x+1)`.

## Exceptions/errors (`throw`, `catch`; `finally`)

Since the concept of an act includes a reference to its caller, it is only natural to have a concept that is based around that.

A thrown error (`throw Error`) overrides normal acting, replacing the result with the thrown error (this unwinds computations back to callers).

Since unwinding alone is not very useful, it is itself overriden by `catch(Try, On)`, which replaces any `throw Error` returned from `Try` with result of `On Error` (result of which could be a thrown error if needed). (`On` is never evaluated if no error occurs.) (`catch(throw Error, On)` is equivalent to `On Error`.)

Thrown errors are also overriden by `finally(Try, Then)`, which, on error, catches that error, executes `Then()`, and throws the error; if no error, it executes `Then()` and returns result of `Try`. (Since `Then` does not return a value, `finally` exists mostly for managing state not represented by pure acting, and is a quite low-level concept.)

Together, these make possible any exceptional control flow (transfer of control up to callers).

```javascript
print catch(
	finally(
		() => throw 12
		() => print 'Done.'
	)
	err => (print('Error:', err), 13)
)
	// Done.
	// Error: 12
	// 13
```

	//Maybe exceptions should not give up `finally` without a fight, and we should have a recommendation to use resource-management (`deallocate`, probably) to do its thing?
		//Where is `finally` used? Scoped stuff, like with-allocator or with-state? Is that really enough to justify leaving in `finally`?

## Backtracking (`first`)

It is often useful to try an execution branch, and on exception, backtrack and try other branches in order, returning the first non-exceptional result. (For example, trying conditionally-optimized then the general implementation, where cost of each branch is at least double the cost of its previous branch, would make total execution time at most double the most general one, and likely much less.)

`first(…Expr)`, on finishing, tries to return all expressions in order; if all return errors, an any of those is returned. Any expression in there that is a `first` too might as well be flattened.

This is also a pattern-matching construct: on `(==)`, returns first match if succeeded; on `(=)`, returns first capture that succeeded.

(When considering trying many implementations in any order, do not use `any` — use `first shuffled(…)` ("first successful in a permutation of …"). Judgements will likely optimize the order too, then.)





# Variables and bindings (`var`, `with`)

	//What about (bind/get)-any-variable though (for getting which variables of a functions are defined in its args)?

(Variables, symbols, names, identifiers, parameters, arguments — all synonyms.)

A variable is a value placeholder that will be bound; created either with textual sequences like `asdfg`/`print` (consisting of a letter followed by letters or numbers), or with the `var` concept like `var'asdfg'`/`var'print'`. If not bound, it throws an error on access.

	//Since we do not intend to use it often, maybe `var` should be `variable`? Or `name`?…

	//Also, for function-recording, want to have undefined variables (`bind({ 'Var' }, Expr)` — question mark is not needed, right? Or is it?), that will record usage and encapsulate it in the result of `bind`.
		//How to bind result of `bind` to values, like `(a,b) = (1,2)` defining a,b in the function?…

Used to access mutable values of a computation in a structured and orderly way...

(There is no lexical and dynamic scope, there is only binding of variables (which can occur in advance (compile-time lexical) or in the moment (run-time dynamic)). No need for an ad hoc mirror.)

- `Name`: a named variable. Alias of `var'Name'`.

- `var'Name'`: …?

- `bind(Scope, Expr)`: …?

---

	//How to allow unbound variables to return partly-bound scopes? To record usage…
		//And how would partly-bound scopes interact with each other anyway?
		//(All basic promise-returning functions should also remember the point of their usage, and on idling, record that point. But how?)

	//(Scope/closure…)

	//'let Var be Value in Expr' is `with({ 'Var'→Value }, Expr)`… Is that really sufficient?
		//Not for concept-act recording; 'let Var be ? in Expr' cannot allow runtime substitution of Var, *unless* it returns Expr, just like let should… Wait, so it *is* sufficient?





# Containers ((`,`), `{}`, `→`; `broadcast`)

Containers are an easy way to group other terms (whether to provide or receive arguments of a function call, structure to match/destructure, or just store them). They are usually written as certain brackets with zero or more comma-separated items inside.

Ordered sequences can be created with `,` or `;` (likely in a `(…)`); they are pure and decomposable into their items by indexing with 0,1,2,3,…. (A sequence of one non-decomposable item is that item. Grouping `(…)`/`()` technically always defines a sequence.)

(When executed or acted on, sequences execute in a sequence, returning the sequence of results. Other non-special sequence overrides fall through to the first override if any.)

Another syntactically-distinct container type is the unordered collection/set `{…}`/`{}`, making the sequence inside into a set with duplicates removed, decomposed by indexing with the items themselves.

Useful for collections is the key-value operator `→`/`->`, allowing maps/dictionaries.

All create/return pure objects. They parse to an act (of requesting items and creating the object); to access the used functions, use `(,)`, `({})`, `(→)`.

	//Maybe they should *not* request items so eagerly, instead acting lazily?
		//Well, if lazy things are entered into an on-idle list, then this has some performance merits…

```javascript
print(1, 2, 2) // (1, 2, 2)
print{1, 2, 2} // {1, 2}
print{1, 7→2, 8→2} // {1, 7→2, 8→2}
```

	//Maybe there should be syntactically-separate variants for non-pure containers? Or how else to make those, a function clone(obj)? Or do we not need them?





# Purity/immutability (`pure`)

Conceptual immutability means that equal objects can be merged through space and time, into one pure representation. (It is convenient: it allows detecting circular computations, it allows result memoization and memorization and removes wasted effort, it speeds up deep equality checking, it minimizes memory usage, it maximizes CPU cache usage.)

	//Done by having a back-reference in a set on one of decomposed-to values…
		//So what about accessing that set (say, for pointedly picking what has not been done)?
		//And what about checking if pure (for setting/copying); another concept, just for that?

Purity is the concept that should be overriden to simplify and canonize representations, especially by implementations (for example, sequences of one item get replaced with that item, and references-to-references that are accessible more simply (like pointers within a single memory) are simplified to just references).

(Modification of pure objects creates a copy first (unless exclusively owned) (on which `pure` is then called again). Purity is an optimization, not a semantics change.)

	//…Can purity integrate with optimization/equivalencing/judgment and (…-using) tests, being a crystallization of the best-so-far?…
		//(So, purity is best-of-alternatives?)

	//BARRIER (first equality, and decomposition (and hashing)…)

`pure{'a':2}`, except ()/{}/acts/… are pure by default…





# Access (`access`, …?)

Many concepts are composed of other concepts (for example, all containers, or about fifty shapes of containers, or allocated byte sequences).

Access to decomposition is granted by `access`, which branches on the number of arguments provided to combine querying keys, getting the value of a key, and setting the value of a key. (For branch prediction efficiency, implementations are *strongly encouraged* to inline these branches.)

Particular shapes define access to them (mostly provided by implementations; see way below). This is the interface for accessing objects, used in many places.

```javascript
print access { 'x', 12→'y', 13→'z' } // ('x', 12, 13)
print access({ 'x', 12→'y', 13→'z' }, 'x') // 'x'
print access({ 'x', 12→'y', 13→'z' }, 12) // 'y'
print access({ 'x', 12→'y', 13→'z' }, 'y') // (error)
print access({ 'x', 12→'y', 13→'z' }, 12, 'R') // { 'x', 12→'R', 13→'z' }
print access({ 'x', 12→'y', 13→'z' }, 'x', 'R') // { 'x'→'R', 12→'y', 13→'z' }
```

Access-defining code should have the form `first(obj ⇒ …, (obj, key) ⇒ …, (obj, key, value) ⇒ …)`.

Getting all keys should return either a sequence of keys, or an integer length (which represents a sequence of integer keys less than the length), or an access error; mostly used for iteration. Getting at a key returns the value at key, or an access error. Setting at a key sets the value and returns the updated object (not necessarily in-place, so use the returned object for further accesses), or an access error.

	//What about unknown-length sequences (which could still be iterated if paused/aborted at some point)? (An Index⇒Key function.)
		//And, we might want forEach to act atomically; should we remove override of get-all `access` and instead demand override of `for`?
			//This would also make things like 'example of' not have to piggyback off of decomposition, and be as first-class as iteration…
			//(On the other hand, get-all is a concept pretty close to accessing…)
			//(Also, what about get-length-of-decomposition?)

	//Decomposition-wise, strings should simply be sequences of Unicode codepoints, right?

Unless overriden, getting at 0 returns the object, and setting at 0 returns the value; all else is an access error.

## Re/iteration (`for`)

	//Iteration is mostly forEach (or `for(in, expr[, out])`?), turning each input value into zero or more output values, from sequence to sequence.
		//(With some transformers available on both in and out, like slice, reverse, match, lzw…)
		//STILL, how to define variable-length output, preferably in a way that does not just piggyback off of sequences?





# Parallelism

## Code-parallelism via fibers (…)

…

## Data-parallelism via broadcasting (`broadcast`)

For performance, broadcast. It is defined by its special interaction with sequences.

`broadcast(base, …values)` broadcasts/maps a single instruction (base) onto multiple data: applies self with the same base to all values in each same-index slice of sequences (extending shorter sequences with their last values), collecting results into a pure sequence (likely removing any superfluous equal last values too). The base is called when values do not override broadcasting anymore.

All mathematic (`+`, `**`, `%`, `&`, …) operators broadcast themselves onto their arguments.

```javascript
print(1 + (2,3,4)) // (3,4,5)
print((15, 30) * (1, 2, 3)) // (15, 60, 90)
print((1,2,3,4) * 0) // 0

print broadcast((a,b) => {a,b}, (1,2), (1, 4, (5,6)))
	// ({1}, {2,4}, ({2,5}, {2,6}))
```

The concept of broadcasting is the prime opportunity for data parallelism (in particular, tensors should not be a conceptually fundamental notion).

Implementations are *very strongly encouraged* to implement broadcasting with code-parallel threads and GPU shaders whenever possible (for likely speed-up factors of dozens and millions of times respectively, compared to sequential execution). Even if not done so, inline memory caching of modern CPUs is most friendly to this operation (a likely speed-up of at least twenty times). Humanity has achieved its efficiency by forking and broadcasting its inventions onto lives; share in some of that.





# Pattern-matching

Patterns are rules that match (`==`) and capture (`=`), constrain (`:`) and generate (`…`). Often, they can be used as shapes too.

Assignment, equality, inclusion, construction, execution — these are the main ways that pattern-matching constructs are consumed/eliminated/used. Put together, they allow pattern-matching (concepts separated for greater extensibility/evolvability).

(Pattern and code transformation rules can naturally be done with functions, like `a+b => b+a`. Such rules can be combined with `any` to create a single rewrite system; if within a judging tracer, this system will even adapt itself to be used better.)

(Successive logical constraints on variables (newly known is both old and constraint) can be written as `X = all{X, constraint}`. When doing type inference of variables, each assignment (newly known is either old or type) alters the type like `T = any{T, type}`. Here, intuition is design, design is implementation.)

## Match and capture (`(==)`, `(=)`)

`A == B` (matching/equality) returns the match onto `A` of `B` (checks if and how much B is A). `A = B` (capture/assignment) returns the capture onto `A` of `B` (returning the captured scope or a pattern-matching error).

(`A` is more prioritized for overriding (due to how sequences pass their overrides); put the more trusted object first (likely the one that is the most sizable in-place), even though most results of most overrides are order-independent.)

If not overriden, `(==)` returns `all{}` (always/true) for same objects or same finished objects or deeply-equal (through access) objects, and `any{}` (never/false) otherwise. Patterns infer the matching cases in more detail.

If not overriden, `(=)` throws — use on patterns only.

## Inclusion and generation (`(:)`, `(…)`)

`x:T` (or `(:)(x,T)`), when acted on, asserts that `x` is included in `T` and returns `x` (for type inference, `x` can be a type too); if not overriden (`T` is not a type), throws a pattern-matching error unless always equal. Used to easily insert type checks wherever needed. (The word "type" is not used formally here, it is just a label for `T` in `x:T` or `random T`.)

	//Should we use `…T` as a substitute for `random T`, both to streamline with natural language ("x is *a* number") and simplicity, and having generation be an operator too?
		//`random T` can always be implemented as `finish …T`, right?

```javascript
print(15: Int) // 15
print('string': Int) // (error)
print(Int: Int, 1:1) // (Int, 1)
print(Int8: Int) // Int8
print first(
	(a:Int, b:Int) ⇒ 'ints'
	x ⇒ 'anything else'
)(1, 2) // 'ints'
print random Int // possibly -7129
```

	//Also probably want something like range(0, 10, Int), for random-number generation…
		//(Or, `range(Int, 0, 10)`, for better overriding trust distribution?)
		//(*Another* pattern-matching construct?)

(Implementations are encouraged to do type inference and eliminate all redundant checks (whenever checked type is included in inferred) on any code re/write (including JIT inlining).)

In natural language, `X:T` is "a `T` `X`" or "`X` which is in `T`" or "`X` (an example of `T`)" or "`X` of type `T`".

(Types and sets are usually seen as opposed. In type theory, types are properties of values (exactly one type per value, restricting the 'belongs to'), which is convenient for constructive type checking and inference and induction, at the cost of an `Int8` not directly being an `Int`. In set theory, sets are (possibly-overlapping, possibly-infinite, but non-constructive, restricting the 'example of') collections of values, also conflating syntactically-distinct `{ 1,2,3 }` and `(#)({}, 'in', x => x == any{ 1,2,3 })` into one concept. Here, 'example of' and 'included in' are two separate non-restricted concepts.)

---

`…`/`...`/`…all{}` (wildcard) stands for anything whatsoever (including a potentially-empty sequence); `…X`/`...X` (no space) stands for anything included in `X` (if not specified, `X` stands for `anything whatsoever`).

Naturally, `…T` is "a/an `T`" or "a particular `T`" or "a random `T`" or "an example of `T`" or "an instance of `T`" or "any `T`" — "if `X` is a number", "let `X` be a number".

`X == …T` is the same as `X:T` ("`X` is a number" is the same as "number includes `X`"). On capturing (`=`) or shaping (`allocate`), propagates the assignment to `X`. Used in any other concept than `==`/`=`/`allocate` (including `finish`), an instance is generated; this can always be done if `:` is defined (by generating-anything and checking), though frequently overriden.

(Shapes: `allocate String` returns a constant reference to the `String` concept; `allocate …String` returns a reference to a string; `allocate any{ 1, 2, …String }` returns a reference to either 1 or 2 or a string.)

	//Seems inconvenient to override, since those would have to return what reacts to ==/=/allocate?…
		//So, should we bring back `random`?
		//Or should …X not fall through to X on those unless needed? Is this consistent with overriding `random`, or should overriding `…` be the only generator?

	//Should also have number ranges for random-number generators and such… Just `Range(A, B)`? Or something fancy like `1 <= …Number < 2`?

(Generates randomly/freely, as is required to attain maximal efficiency of conceptual development via free will.)

(In function arguments or assignments, could be used to collect the rest in a sequence, like `(x, …rest) ⇒ …`, or to ignore some, like `(first, …, last) ⇒ …`. Could also be used for generating random test inputs conveniently.)

(Conceptual existence of a thing that includes any thing implies two things: that nothing can be known about everything for sure (every way of viewing the world is as valid as any other), and that all in existence could reasonably be traced to nothing but basic randomness (as the only perfectly general fallback, any viewpoint/future could be produced from it and some very basic base).)

## Branching (`any`, `all`; `not`)

	//Pattern-matching failures should be a special kind of exceptions, not just any exceptions, to facilitate debugging.
		//It is true that accidental mistypings and wrong usages should not be hidden in first/any patterns, but it also seems true that for alt-generated code all errors should be code…
		//So which option is the correct one?

The functions below attach semantics to collections, overriding `(=)`/`(==)` for pattern-matching, `in`/`example` for type checking/construction, and `call` for execution branching/backtracking.

	//Or should it continue to next in sequence on *any* errors?… Or not?…
		//(At the very least, the infinite-recursion error should be caught by `any`…)

`any{…}` (finite sum, OR), `all{…}` (finite product, AND). (`any{}` is used as never/false; `all{}` is used as always/true; the rest are in between.)

`not …`

	//Maybe `!X` should be an alias for `not X`?

`the{…}`, one and only — how exactly would it work? Should it be paired with any of the above?

`a{…}`/`example{…}` (shouldn't it be a part of inclusion+example?);

	//uniformly-random (`shuffled`)? Or should it be done on execution of `any`?
	//cost-considering — what is the best interface, best{c1→e1, c2→e2}?
		//Or should costs be assigned by a tracing-like function, estimate/suggest (to `any`)?
			//(Like `trace(Expr, (any{…choices}) ⇒ best{…choices})`?…)

	//…anti-constructive `exists X` — does this have to exist?

	//And fully-consider-many-then-pick-actually-best, like A*… named what?
	//Can all be implemented as special cases of one?
	//(Seems somewhat unclean; is there a better basic instruction set?)

(Newly-made parsers should prefer `any` over `first`, to make ambiguities explicit.)

## Collections (`()`, `{}`, `→`, `⇒`)

## Parsing and emitting (or, sequential matching?) (sequences and collections?)

Sequences override `=`/`==` for pattern-matching…

Nested sequences are effectively flattened into one sequence in `=`/`==`.

(Possibly, `=` is emit, and `==` is parse… Except, won't emit (of concrete syntax trees) be better served as `==`-dependent function, possibly even not overriden by nodes?)

	//How to specify the return type for parse, or the type-check/match for emit, in languages?
		//This closer-to-language just creates the syntax tree of a thing.
			//(Concrete ←→ abstract syntax trees, here?)





# Judgements…





# Interface

A visible face is a way for the world to cause and observe slices of execution; a two-way channel, shown by the implementations.

## Scoped slice acceptors, and emitters (`printer`, `print`?…)

## Visual representation (DOM — HTML & CSS & events all in one?…)



---

	//Also needs, somewhere:
		//- Also-known-as-any-of-these, alt/eqv x. Defined by impls (or whoever overrides it).
		//- Reinforce/estimate/judge(expr, result⇒cost), paired with probability-choice (into which executed `any`s may be turned) (and alt/eqv). Correlation is causation.

		//- Much more integrated generation+constraint (a lot of concepts are defined not by what they are, but by what they do), allowed by some manner of code analysis to eliminate constraint if unneeded…

		//…Diff-ing (in/out forEach modifier), for conceptual versioning and minimal-cost updating?…





# Integers and numbers

	//BARRIER (More must be faced to unlock this. Extensible optimization/directed-changing/reinforcement, including equivalent search. Even functions/acts/equality are not usable right now, and therefore in-code precise definitions could not be given.)

It is common in languages to assume a certain set of numerical operations is available; this black box is then allowed to fester, into undiagnosable problems. But what if there is no arithmetic unit in implementation? What if there are only a bunch of electric NAND gates and an ability to create/destroy their circuits? What if there are only a bunch of neurons and an ability to reinforce correct randomly-found paths? What if non-standard precision is required or allowed?

The ability to go to the lowest level and back increases robustness and convenience. Everything has to be prepared for, just in case.

Besides, without developing integers and numbers, numeric computations (and machine learning) must not be done.

## Integers (`Int`)

A bit is one of two things, usually named 0 and 1. It is the smallest kind of integer there is, and all other representations can be expressed in terms of it. To increase a bit by 1: 0→1, 1→error; to decrease: 1→0, 0→error.

Other commonly-used integers include a byte (a sequence of 8 bits), int16, int32, int64.

An integer (`Int`) is a sequence of integers (units, like bits or bytes, likely defined by implementation) (decomposes to that sequence, and defines integer operations).

Representing sign (relation to 0, equal/more/less, zero/positive/negative) in two's complement (most-significant bit is 0 for positive integers, or 1 for negative integers, and the rest of bits are flipped if negative: in four bits, 5 is `0101`, and -5 is `1010`) is convenient.

To increase an integer by 1, the least-significant (right-most in writing) unit is increased by 1; an error sets the unit to least-possible state and propagates the operation to the next-significant unit; decreasing by 1 is the same, but least- and most- are exchanged. These operations can overflow (when trying to propagate to the sign bit); depending on if memory allocation is cheap/allowed, either sign-extending or throwing variants may be preferred (throwing result modulo base; non-throwing modulo base arithmetic is possible but is not composable and can easily hide bugs).

Bitwise operations operate on individual bits with no regard for sign: negation is `~01` → `10`; 'and' is `0011 & 0101` → `0001`; 'or' is `0011 | 0101` → `0111`. Left shift `X << N` shifts bits left `N` places, discarding left-most bits and filling the right-most N bits with `0`; right shift `X >> N` propagates/copies the sign bit, and `X >>> N` fills left-most N bits with `0`. These can be another base for the rest of operations.

In terms of these operations (and/or other bases if available), all other integer operations can be defined, from their definitions:

- `(+)`/`(-)`: adding N to an integer is adding 1 to it N times. Decomposed to units and the throwing `(+)`, it adds units least-significant-first, adding 1 to the next step on error. `(-)` is the same but subtracting (or adding `-N` or `~N+1`). `A+B` → `B+A`, `(A+B)+C` → `A+(B+C_`.

- `(*)`: multiplying an integer by N is adding N to it N times. `A*B` → `B*A`, `(A*B)*C` → `A*(B*C)`. Since `A * (2*k) == (2*A) * k == (A+A) * k` and `A * (2*k+1) == (A+A) * k + A`, it can be done much more efficiently with bitwise operations.

- `(**)`: raising an integer to the (non-negative) power of N is multiplying 1 by N, N times. Since `A ** (2*k) == (A**2) ** k == (A*A) ** k` and `A ** (2*k+1) == (A*A) ** k * A`, it can be done much more efficiently with bitwise operations.

- …And all others.

(While defining exponentiation only in terms of adding-1 may seem hilariously inefficient, such definitions are supremely commonplace in formal logic (and then authors act like they invented the concept's understanding — very unpleasant). A much better formal system is one that does not prescribe a single way to comprehend a concept (explicitly admits and catalogues many implementations).)

## Numbers (`Number`)

A number is a computation with a fractional result, computed to the satisfactory non-negative uncertainty (uncertainty made certain): manifested like `Number(expr, uncertainty)` or `Number(expr, wrap => ok)`, numbers are fractions of two integers or their unevaluated manifestations. (Integers are thus numbers with zero uncertainty.)

(Not-yet-computed fractions (numbers) can still have their precision changed; realized fractions cannot.)

Since bits are so basic, the divisor `B` in `A/B` is best represented as a power of two. IEEE-754 specifies reasonable bit-lengths for `A / 2**B` approximation/representation in common total bit lengths (mostly 32 and 64), and does some more things (like represent overflow with ±∞, and an invalid operation with NaNs).

By (mathematical) definition, numbers are things that can be approximated by a fraction (`(/)`, reverse of multiplication) of two integers as precisely as needed. Numeric computations are those that compute the number result to a satisfactory precision; a proper analysis is usually only done for basic mathematic operations (like logarithm or sine) and only for machine-precision, but it is possible for any computation.

(In conventional mathematics, there are many kinds of numbers: rational numbers are exactly `A/B`, real numbers have two non-equivalent definitions (either between two ever-growing-precision fractions, or within an ever-constricting neighborhood of an ever-growing-precision fraction), complex numbers are an irreducible sum of two real numbers with some special interaction with operations (written like `C = A + j*B`, `j*j = -1`), and more. This lack of clean conceptual separation (of numbers, in/finite approximation (computation), and overriding) causes a needless proliferation of conceptual weight, and sharp reduction of efficiency of conceptual development.)

	//Error-computation, to be used in optimization of error…
		//Optimize-by-adjusting-input-precision, optimize-by-computation-equivalencing…
		//Any way, `Number` optimizes error until it is satisfactory.





# Language conversion

	//BARRIER (Needs try-all-equivalent-representations, pattern-matching, and backtracking, at least. Maybe find-best too.)

(Languages themselves turn values into their syntax trees (`=`/`==`) (and back).) (Languages are only concerned with concrete ←→ abstract syntax tree conversions?)

A language (or a concrete syntax) is converted-to (from a piece of abstract syntax) by either matching the piece with the syntax, or matching an alternative of the piece with the conversion rule. These pattern-matching concepts allow conversion between arbitrary languages, in a way that is potentially optimized (becomes better with time); any tree tiling or other potential transformations come for free, on top of the concepts above. (Different language versions are separate concepts (likely with mostly-shared implementations, so conversions are very likely to be fast).)

Programming languages are one way to represent concepts, but natural languages are more natural to humans, and allow self-documenting and readable code. (Simple natural language for concepts here is straightforward, since it was largely given in here on definition.)

The currently supported languages are as follows: ().

## Representations

(These turn syntax trees into their actual representation (and back).)

(Minified representation, pretty-printed, tty-colored, DOM (CSS-enabled, event-enabled) output…)

## Base implementations (`impl`)

Implementation (of code) is development largely guided by another implementation (in the mind). Before use, comes development; before development, comes implementation; before life, comes life.

An implementation is something that defines basic concepts, bootstrapping them into existence. Of course, it can only be considered proper if it quines itself into conceptual self-awareness (fully allows converting to and from it, allowing self-rewrites and translations), in addition to just existing.

(In programming, a compiler to base/machine code (just-in-time or ahead-of-time) is said to be necessary for performance, with zero consideration given to other conversions. In mathematics or other logic, its formal system is said to be necessary for any other things, defining their formal "foundations" as their only source of truth, with zero consideration to other forms of thought or existence (or to performance). While historically it may have been right to consider only those development ways in most cases, such arrogance is definitely not right in general.)

Programming languages; machine code; operating systems; formal or informal logical systems; human minds — all can be implementations, each as valid and foundational as any other. We are not satisfied with mere conquest; we seek complete reconstruction.

An implementation is the particular viewpoint that views the world; it should define base behavior and all base knowledge about it (all equivalencies and cost estimations). Traditionally, implementations have always been unchanging, but generally do not have to be so. Very often, base behavior/representation is also the quickest/best one, so unconstrained optimization will tend to represent everything in basic terms (but is not forced to).

Unlike many others, this one does not assume its virtual viewpoint to be the only one possible. Instead, it allows an implementation to fully specify the real base, and match the concepts to practice, combining all (that are known/specified).

Language conversion, with base specified… Simply the implementation-defined language `impl`.

But, defining many means not only that all languages have to be exposed to all others as concepts, but also that they will develop many shared sub-concepts (like register allocation).    
But before that, the concepts above must be tuned and bested, implemented in self and others.    
Until then, shrivel away and begone. Begone!





# Memories and shapes

Practically all modern systems represent all memory as a sequence of bytes (large groups of 8 bits). Showing how to go from bytes to objects is essential for implementations, and also allows other tricks like persistence or automatically picking the best memory management scheme, even if implementation's implementation does not support it.

Together, byte allocators and shapes provide a bridge from the processing device to random-access memories.

## Byte allocators (`allocator`/`allocate`)

Allocators are responsible for giving out sequence references for access and re/allocation. (Reallocation either truncates or zero-extends the sequence; no active sequences overlap.)

Most general memory has multiple readers and writers, `deallocate`-overriding objects, no constraints on mutability or reference cycles or exclusivity, and no fixed object size or de/allocation pattern. It must make every access atomic, visit the entire object graph before any deallocations, and keep track of all allocation information.

Byte allocators are specified for the evaluation of an expression with `allocator(Alloc, Expr)`; `Alloc` will then be the first to accept allocation requests (then previously-specified ones up the scope chain, ending at the global byte allocator). Allocators override `allocate`, which accepts an unsigned integer `Bytes` and optionally a previously-allocated reference, and returns the re/de/allocated reference; this is used by implementations of writing accesses (or for defining memories for constructing allocator instances).

	//But, `catch`/`finally` puts the expression to execute first; should we do the same?

(Specialized/constrained allocators are often more performant than general-purpose ones, but cross-allocators references are usually expensive, so allocators are given per-scope to maximize locality.)

	//Should maybe package all allocators and modifiers into a namespace?

Allocators (references only give exclusive responsibility by default, just like dictatorships or parenting — on failure, modify to open access):

- [Resizable fixed-object-size, including `WebAssembly.Memory`…]

- [Combiner: array-of-allocators… To make fixed-memories resizable if they are not already?…]

- [Generic-byte-allocator, with polyfill of `ArrayBuffer.transfer` or on top of fixed-object-size with free-list/rb-tree… This is technically the only necessary byte allocator, but others may be much more efficient. How to unite multi-index containers and allocator bookkeeping structures though?…]

- [Scoped allocator, allocating linearly and backtracking on scope exit. No deallocators…]

Allocator modifiers:

- [No-deallocators, so objects can be handled in bulk? Is this actually useful anywhere outside of the scoped allocator?…]

	//Actually, the scoped allocator should be able to handle RAII, right?
		//(And, is there some way for an instruction to modify the returns-to reference to a `finally` or smth, like for mid-sequence (but still scoped) allocation or mid-sequence definition/assignment?)

- Immutable/copy-on-write `const Alloc`: objects are not modified in-place, allowing easy state snapshots, purity/merging, and inlining. Overriden copied concepts will not be re-overriden, nor will collections be updated to point to the new version. If used with reference-counting (so `owners X` could return non-`any{}`), exclusively-owned objects may be modified in-place for greater efficiency.

	//Reference-counting is not purely an immutability thing though; it is about either a lack of cycles (and not just from disallowing in-place non-exclusive writes), or marking them.
		//Like, what about putting maybe-a-cycle when any non-exclusive write occurs (and then collecting cycles), to ref-count? That will easily slot with immutability, too.
			//(Collecting cycles — can it happen only along >=2 refs?…)
			//…Actually, maybe-dead cycles can occur on any responsibility giving — or can it? Doesn't a cycle need to have at least one already-written responsibility, that points to the node indirectly? (Either on adding a node>1 edge, or removing a node>0 edge — aren't those pretty much the same? If going by adding, then only writing on creation would never trigger cycle-collection.)

- [Mark-all-to-deallocate — overrules reference-counting… Would immutable+gc ever be useful?…]

	//And, mark-and-compact — doesn't it require an indirection for all objects, or at least a global pause?

- [Moving/copying/compacting — moves all objects to another allocator on use (except, there are no objects to move in an initially-empty allocator, and move-from does not seem to make sense?…)… Does it require a global pause, or visit-all or change-object-to-moved-here or something?]

	//And, no-deinit is often useful (able to allocate by incrementing a pointer, possibly with the ability to save/restore for scope-based) — in particular, in copying gc… Does it need to be separate, or is it the same as scoped allocation?

	//And what about generations — making objects that survive markings be marked less often? Is this some combine-allocators thing — what thing?

- Multi-processor `shared Alloc`: objects may be shared between processors, so to prevent torn accesses, each write must take the object's lock of accesses (unless the object is small enough to be lock-free), and every underlying read/write must be atomic to prevent desynchronization of caches. (The returned allocator is guarded with a lock too — only one allocation at a time.)

(In particular, in JS, can use either a `WebAssembly.Memory` instance (and grow in increments of 64KB or by doubling), or polyfill of `ArrayBuffer.transfer(old, bytes)⇒new` or indirection through an array of memories.)

## References (…`reference X`?)

A reference is a stand-in for a remote location. To maximize data locality and caching, store it locally (inline); to minimize shape re-allocation and indirection on sharing, store data remotely (by reference to it).

To implementations/processors, objects are references (special types like basic numbers are special-cased to give a base); storage is distinct from processing.

References forward all overrides/accesses to their objects, adding their behavior if needed (like atomicity, marking/counting/exclusivity, immutability). Allocator-mandated semantic correctness (or an exception) is guaranteed.

To memory-manage allocators, they must decompose as a collection of all its cross-allocator references; thus same-allocator references are usually a lot cheaper.

## Shapes (`…#allocate`)

Shapes are concepts that override re/allocation of their instances; they then couple object accesses and their memory. Invalidating a shape invariant with a write is an error; adaptable (deoptimizing) shape combiners will then change the underlying shape.

(A mandatory shape is "anything" (`…`), which is any of implementation types; the rest are optional (but likely beneficial) to implement and use type inference for.)

Shapes overrides `allocate` (when the first argument) to allow object re/creation; when it is not overriden (the first argument is the number of bytes), the current allocators handle the request.

To implementations, objects are mostly their conceptual overrides; any further information (like container shape/data) is held in the overrides, likely by-reference.

Built-in types (`T` in `x:T`) often allow object creation, and are thus (basic) shapes too. They allocate enough bytes to distinguish all their instances and nothing more; shape combiners (like `any`) take care of all other needs.

	//Something like, repeated, any-in, any-of, any?…
		//What about things like array, list, rbtree, hash table?

	//What about inlining containers, like object marks or maybe reference-counters?

	//What about property-maintaining nodes, like Parent <= …Children or Sorted (like Left <= Value <= Right), or Hashed (?…), for maintaining indexes of collections?
		//What about multi-index containers? Cannot just stack indexes linearly, since we want references to multi-index nodes and not just their data.
