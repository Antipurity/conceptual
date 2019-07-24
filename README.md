# Prologue

Specification of a (multi-paradigm) natural conceptual programming language. Intended to guide its implementation.

This language prioritizes expressiveness in its every part; its motto is "separate cleanly to combine easily". When language features are improved, they converge towards maximally-expressive ones, so why not go all the way, to concepts?

[Concepts](https://en.wikipedia.org/wiki/Concept) here (pure views defining everything) take over `natural` (English) words and patterns, and occasionally find expression in `conceptual` syntax; other base languages would be implementations.

See also [the philosophy of its design](https://github.com/Antipurity/conceptual/blob/master/philosophy.md) and [the journal of its development](https://github.com/Antipurity/conceptual/blob/master/journal.md).

Contents (double as a roadmap for implementation):

- [Base syntax](#user-content-base-syntax) — (most) atoms of program strings.

- [Concepts](#user-content-concepts-concept) — dynamically extensible definitions.

- [Execution](#user-content-execution-finish-step-watch) — flow of time and processes.

  - [Timing and interrupting](#user-content-timing-and-interrupting) — nothing lasts forever nor locks up the system.

  - [Scheduling](#user-content-scheduling-schedule-scheduler) — sharing a processor.

- [Binding](#user-content-binding-bind-later-now) — arbitrary connectivity in program strings.

  - [Recording and filling](#user-content-recording-and-filling-later-now) — deferring knowledge.

  - [Capturing](#user-content-capturing-capture) — extracting pattern components from a structure.

- [Purity](#user-content-purity-pure) — essentially equal becomes the same.

- [Acts](#user-content-acts-act) — pure application of data to code.

  - [Functions](#user-content-functions) — capturing data into recorded code.

  - [Errors](#user-content-errors-error-catch) — control flow inversion.

  - [Composition](#user-content-composition-first-last-many) — control flow combination methods.

- [Constraints](#user-content-constraints-limit) — enforcing of requirements.

  - [Collections](#user-content-collections-all-any) — use-time constraint combination.

  - [Composition](#user-content-composition-both-either) — analysis-time constraint combination.

  - [Negation](#user-content-negation-not) — constraint inversion.

  - [Generation](#user-content-generation-random) — example construction.

  - [Searching for alternatives](#user-content-searching-for-alternatives-alt) — distinguishing the indistinguishable.

- [Abstract languages](#user-content-abstract-languages-conceptual-natural) — between meaning and form.

  - [Base implementations](#user-content-base-implementations) — between meaning and reality.

- [Concrete views](#user-content-concrete-views-view-viewer-doc) — visible forms of meaning.

- [Creation](#user-content-creation-create-creator) — distinguishing the constrained.

  - [Memories](#user-content-memories-creator) — giving out managed storage pieces.

  - [Caching](#user-content-caching-cache) — non-essential but nice creations.

- [Access](#user-content-access-access-for) — sending signals through a wire.

  - [Re-iteration](#user-content-re-iteration-for) — output for each input.

  - [Order](#user-content-order-min-max-sort-ordered) — imposing a sorting.

  - …

- Convergence — approaching singularities??

  - Numbers and math — realizing arithmetic??

  - Judgements — realizing preference??

- [Complete syntax](#user-content-complete-syntax) — ways to combine atoms of program strings.

It might seem like a lot, but it is but a shadow of its future self.

---





# Base syntax

A precise concrete syntax; a character-sequence matching rule. Does a concept need one? Some basic concepts have one, here, though a lot do not. Ways to combine the base syntax (mostly operators) are collated much farther below.

```javascript
Hello there general

15.0 NaN ∞ Infinity -12e3 -0xff -0×FF
'string1'"string2"`multiline
	\`string3\``
view('Sum:', 1+2, '.') // Sum: 3.
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

`(| … |)` or `⦇ … ⦈` or `last(…)` groups terms into one. Use to alter parsing precedence when needed. Allows parsing rules to loop back to the original rule, to make every syntactical construct able to be used anywhere.

(A few non-ASCII characters are used for readability and freshness (for example, `→`, `⇒`, `…`). In all cases, these can be substituted with ASCII versions for more writeability (for example, `->`, `=>`, `...`).)

---

There are no keywords, only overridable concepts — though for uniformity and readability, the base syntax cannot be overriden during the initial parse. Operators can be accessed as functions too, with readable names, for overriding.

An example of a valid program:

```javascript
view 5 // 5
#f = ⦇x ⇒ x+2⦈
view f 3 // 5
view f many(1,2,3,4,5) // many(3,4,5,6,7)
f = ⦇(a, b) ⇒ a + b⦈
view f(2, 3) // 5
```

(`view` outputs a value for the user to view, like `console.log` in JavaScript or `print` in Python.)

---





# Concepts (`concept`)

Take this JavaScript snippet:

```javascript
const a = Symbol()
function f(x) {
	if (x === a) return 'str'
	return x+1
}
```

What is `a` here? `a` is a thing that makes `f` return `'str'`. But the code, translated into words, tells a different story: "`a` is a thing, and `f` is a function that returns `'str'` if passed that thing or argument plus one otherwise". The user is forced to express natural definition of the concept `a` as a static pattern-match in `f`. It would be more convenient to formalize the `concept` of concepts:

```javascript
#f = x => x+1
#a = concept{ f → 'str' }
```

Here, `concept` makes the notion of definition precise.



Anything knowable is seen through a pure view that defines it; everything is a `concept`. This encapsulates [extensibility](https://en.wikipedia.org/wiki/Extensibility).

See `act` for how this is used (data can override code). See `pure` for what conceptual purity means (merging equal structures).

`concept Of` creates a new concept that defines all keys in `Of` to be overriden with their values; `Of` is copied and the pure copy/view is immutable/persistent.

`concept.of Reference` returns the pure view that contains the conceptual overrides of the thing contained in `Reference` (similarly to a jump table). (It has to be a reference, otherwise some expressions can override `concept.of` and cause chaos. From a processor's point of view, everything is a reference, conceptually.)

`concept.none` is a dummy value that indicates that a data-override wishes to fall through to code; non-existent overrides (`access.none` in `Of`) are indicated with this in conceptual views.

```javascript
#f = ⦇x ⇒ x+2⦈
view f 5 // 7
view f concept{ f → 15 } // 15
view concept.of f //Something that overrides at least `act`.

view 0 + concept{ math.add → first((0, x) ⇒ 12, concept.none) } // 12
```

`concept` can be overriden, mostly to constrain concept definitions to satisfactory ones.

Words like "when acted on, …" or "on stepping, …" specify an override. Used extensively to define concepts, here.

Extension points should be provided not by passing handlers, but by conceptual overriding, exactly conflating extensibility and concepts. This eliminates non-essential conceptual interference and allows clean development.

All definitions have two parts: static base at code (implementation) and dynamic extension at data (override). For [full self-awareness](https://en.wikipedia.org/wiki/Consciousness), implementations must ensure that everything native (code and data types/values) is also [repeated](https://en.wikipedia.org/wiki/Quine_%28computing%29) conceptually; when an extension reaches a form equal to implementation's, this allows using native code for it, increasing efficiency of evolution. For teaching, it is best to define statically; for learning, best to define dynamically; both ways are allowed by concepts with implementation.

There is no universally "best" concept or viewpoint, apart from a combination of all known.

(Trying to make intelligence prohibits the actual making of intelligence; combining is *the* key, not any approach in particular. Instead, an extremely round-about scheme *must* be employed if there is to be any real hope for AI: seek all the concepts that underlie this world, tune their power, and through their strength, ascend. Everything is AI, and AI is everything. The rest of this specification exists to show exactly why.)

---





# Execution (`finish`, `step`, `watch`)

Execution (passage of time) and discrete stepping (like in digital devices) are interleaved and can be seen in terms of each other.

`finish Expr` finishes (synchronously executes or evaluates; it is not a computer — it is an [executioner](https://en.wikipedia.org/wiki/Execution_model)) the expression, returning the result (all that does not override this nor stopping is execution's end). Unless overriden, this is just repeated stepping.

`step Reference` advances the expression pointed-to by `Reference` by one step. Computation is divided into distinct/discrete steps. This allows executing and/or inlining functions; `step` is what needs overriding for proper execution to happen. (Expressions are turned into values, code into data, questions into answers, actions into consequences.)

To be useful, `finish` overrides acting to always finish data before the code runs. A lot of native code finishes its arguments to proceed, so calling it explicitly is almost never necessary, and in fact, it can get rid of optimization (by code pattern-matching) opportunities.

(Not finishing is usually called [laziness](https://en.wikipedia.org/wiki/Lazy_evaluation); finishing is eagerness. There are no separate infinite data types, wrapping or unwrapping. If assuming no prior knowledge, just `finish` is easier and faster to understand.)

---

`watch(Expr, For)` traces/follows/intercepts/modifies the path through the execution scope; watchers cannot be overriden by the watched. `For` is a function that accepts the current expression and returns the next expression (likely the same). Do not return an exception unless intended (in particular, do not pattern-match on function arguments beyond `x ⇒ …` outside of backtracking). If watching for `x ⇒ x`, this is the same as finishing. (The expression is wrapped in a watcher object, that steps as specified and forwards all overrides to the overriden version. Act expansion moves the watchers to dependencies; subsequent expansions should re-use that expansion to be much more efficient.)

```javascript
watch(1 + 2 + view 3; first(view x ⇒ x*2, x ⇒ x)) // 9
	// ⟨nothing shown⟩

watch(view⦇1+2+3⦈, view) // 6
	// view⦇1+2+3⦈
	// ⦇1+2⦈+3
	// 1+2
	// 3
	// 3+3
	// 6
	// view 6
	// 6 ⟨not from tracing⟩
	// 6
```

## Timing and interrupting

Interrupting execution is an essential component of having multiple timelines share a processor.

`step.timed(Reference, Time)` executes and returns the expression [for about `Time` seconds](https://en.wikipedia.org/wiki/Time_limit) or until the end. If `finish Time` is a function, the reference is applied to it to get the actual seconds (a non-negative number); if it is `0`, it will execute the least amount of work possible (one time step); if it is `∞`, it may finish; about 6 or less milliseconds is invisible to humans. (`timed(timed(Step, A), B)` is `timed(Step, ceil⦇B/A⦈*A)`.)

`step.checked(Reference, Cond)` executes until `Cond Expr` returns a non-exception. This is the more general form of `.timed`, but is much less likely to be implemented natively.

Both `.timed` and `.checked` here must be interrupted anyway if they take too long, to prevent denial of service (accidental or intentional). 10 ms is probably good for interactive applications.

`finish.timed(Expr)` times the finishing of `Expr` and returns `(Result, Time)`, where `Result` is what `finish` returns, and `Time` is the number of seconds elapsed (always a non-negative number). (Implementations should override this if the time taken is knowable.)

`finish.checked(Expr, Device)` measures the effect of finishing `Expr` on the `Device`, by writing a mark to `Device` before finishing and reading that mark after finishing. (A time-clock is technically such a device.)

## Scheduling (`schedule`, `scheduler`)

Scheduling is the processor accessing itself to progress time.

`schedule Expr` instructs the current [scheduler](https://en.wikipedia.org/wiki/Scheduling_%28computing%29) to finish the expression asynchronously (via writing it to the scheduling queue/container); it returns the task object. (Being parallel is a separate concept, `many`, which can be used in schedulers, including the native one.)

(Scheduled tasks are always joined-with at the end of the current one, making those who schedule responsible for the scheduled, so losing interest in an expression also loses interest in its children.)

`schedule.stop Task` stops/pauses/cancels the task and returns its most-recently executed expression (which can be scheduled again to continue). Non-tasks are passed through. Does not stop spawned child tasks (they are only stopped if done or if they become pointless/forgotten, or if explicitly stopped).

`schedule.join Task` waits until the task is completed, then returns its result as the result of this act; this task returns if all sub-tasks return. Without accesses, semantically the same as `finish schedule.stop Task`, but possibly faster. Useful for parallelizing dependencies.

`schedule.race Task` makes the current task's result the result of whichever task is completed first, and returns `Task`; this task returns if any alt-tasks return. Useful for trying several alternatives in parallel.

There is a small overhead associated with tasks and their synchronization. Do not just spawn a new task for every computation step or loop iteration; let the implementation handle it properly (in particular, use `many`).

---

`scheduler(Expr, Container)` uses the scheduler `Container` to schedule (push) references-to expressions, which are then, on scheduler stepping, popped, stepped-through once, and pushed back (or forgotten or synchronized if completed). It is much like `alt.search`, searching for the end of time.

(It relies on `access` and all its sub-components to allow different scheduling types.)

Examples of scheduling containers (with `bind(…, access)`):

`queue()` [cycles through touched tasks](https://en.wikipedia.org/wiki/Round-robin_scheduling). (If needing one to execute quickly (like to stop the rest), it will be much delayed.)

`start()` or `end()` completes the last-scheduled task before doing any others. (The same as not having a scheduler at all.)

`shuffled queue shaped((), ⦇R ⇒ step.timed(R, 5)⦈)` repeatedly executes a random scheduled expression for a fixed time each time (important tasks like cleaning-up-and-exiting may become overly delayed).

---





# Binding (`bind`; `later`, `now`)

[Binding](https://en.wikipedia.org/wiki/Name_binding) an expression to an object (`bind(Expr, Object)`) watches `Expr` to connect labels inside (`bind.to'Label'` or just `Label` if a string) to elements of `Object`, leaving no evidence, into [graphs](https://en.wikipedia.org/wiki/Graph_%28abstract_data_type%29). Inner bindings thus shadow outer ones. `Object` can contain labels to bind too, which will be invisibly bound too. (As programs as strings can only be parsed into trees (lacking multiple parents and cycles), binding is the only way to contain arbitrarily-connected structures in them, and must be supported; copy-on-write cyclical structures are impossible without this.)

(Unbound labels record their usage in an expression that can only be filled by binding them.)

All programs in this `conceptual` language are globally bound to all concepts defined here with the labels/names defined here (or to `access.none`, so using an unbound label is usually an error). (Bindings can be deleted by binding to `access.none` in an inner binding.) (Unbound variable names/labels in functions are not errors by themselves, and would be bound dynamically to the call site; if not bound, `bind.to …` throws an error.)

`bind` is also a namespace.

`bind.visible` is a read-only object that represents all visible bindings; `bind.visible.label` is the same as just `label`. Useful for debugging/inspecting, familiarizing with development, picking of unused names in code.

`bind.new` is a completely new and unique binding-to each time it is acted on, which can be stored in variables/objects. Used to not have to come up with a particular label name in some scenarios.

`bind.not Expr` watches `Expr` to ensure that it contains no unbound labels. Useful for optimization of binding (do not have to watch for bindings if there are no bindings); implementations are encouraged to use this for all functions.

`bind.with Expr` or `#Expr` binds *all* labels within to new variables (references to none); the returned value overrides acting to bind their labels to these variables, in current and next elements of the closest enclosing container only. (Less efficient than binding directly, and imposes indirection even if unnecessary (no writes), but more convenient. This encapsulates traditional program variables — reference cells that cannot be used before definition (first capture).)

`bind.find Constraint` goes through all visible bindings to find the one and only that fits `Constraint` (`for(bind.visible, x ⇒ catch(x: Constraint, … ⇒ {}), {})` should contain exactly one element); seen in `natural` English language as "the `Constraint`". Though very harmful for (startup) performance, the `natural` language usually steers clear of mentioning bindings and much prefers this. Inspection routines may well use this, along with natural language.

```javascript
view bind(a, { 'a' → b, 'b' → 12 }) // 12
view bind(a, { 'a' → { 1→b }, 'b' → { 2→a } })
	// ⟨Shows the cyclical object represented similarly or the same to this one.⟩
	// ⟨`a[1]` would have returned `b`; `a[1][2]` would have returned `a`.⟩


view bind(a+2, { 'a' → access.reference access.none }) // error⦇access.none⦈
view bind(bind(a+2, { 'a' → reference none }), access) // error⦇access.none⦈
view bind(last(a=2, a=3, a+4), { 'a' → access.reference access.none }) // 7


view bind.visible // ⟨Shows/inspects all globally-bound concepts.⟩

view a // a
view bind.not a // error⦇access.none⦈
view bind.not bind.visible // error⦇access.none⦈


view last(#a, a=2, a=3, a+4) // 7
view last(a=2, #a, a=3, a+4) // error⦇access.none⦈
last(#a=1, last(#a=2, view a), view a)
	// 2
	// 1
view ⦇(x,y) ⇒ x*y⦈(#a = 3, a + 2) // 15
view ⦇(x,y,z) ⇒ y*z⦈(#(a,b) = (2,3), a, b) // 6

view last(#a=1, bind.find Number) // 1
```

(Variables, symbols, names, labels, identifiers, arguments, parameters — all synonyms.)

(There is no lexical and dynamic scope, there is only binding of variables (which can occur in advance (compile-time lexical) or in the moment (run-time dynamic)). No need for an ad hoc mirror of this concept.)

## Recording and filling (`later`, `now`)

`later(Expr, Label)` records the usage of the binding `Label` in `Expr`, evaluating the known and remembering the unknown (binds the label to the recorder, which overrides acting), abstracting. For use with `now(Later, Data)`, which binds the record to `Data`, specializing. `now(later(Expr, Label), Data)` is `bind(Expr, { Label → Data })`. (`Label` is only a way to record, and is not present in the record; binding `Label` in the result does not fill the hole.)

(There must be no recording (usage of internals) after the recording stops (`later` finishes); such a usage should throw. In particular, access-in-later-in-access and view-in-later-in-viewer (and all storing-for-later-loads schemes) should be at risk.)

It is useful for (natively) returning completely invisible and non-invasive and non-blocking promises to return a value — when a value is not available now but will be in the future. The implementation records its results's usage as it wishes and provides the actual value later. (To do this, where `#Result = bind.new`, the native function (in its act `Self`) should do `#Recording = schedule later(now(act.then Self, Result), Result)` *and un-schedule the current expression* (impossible non-natively, for safety), and when `#Data` arrives, do `schedule now(schedule.stop Recording, Data)`.)

It is useful for [analyzing the future effects](https://en.wikipedia.org/wiki/Retrocausality) of a value in order to better pick it now — for example, generation (`…`) that is later constrained (`…: Constraint`) could easily use this to backward-propagate the constraints if it desires so.

(Perfect conceptual self-recording/self-understanding is also useful in conceptual self-replication, like teaching/convincing or spreading knowledge, or unpredictable resolution order of dependencies. How would you do it? What will you do next?)

(Neurologically, functions of the [default mode network](https://en.wikipedia.org/wiki/Default_mode_network) are quite close to this.)

`later.when(Later, …)` returns the set of inputs to `Later`, when the outputs conform to all the passed requirements (all unified with `&`/`both`). For example, `later.when(later(z+2, 'z'), 3)` should be `1`. Useful for analysis.

## Capturing (`capture`)

`capture(A, B)` or `A = B` assigns parameters of `A` to their instantiations/incarnations in `B`, throwing (and changing nothing) if the pattern mismatches. Parameters are either unbound labels (`bind.to Param`, returned in the resulting object) or references (`access.reference Param`). If a parameter occurs in many places, it must satisfy all constraints (`both` or at least `all`).

`bind(Expr, Pattern = Structure)` is one intended use of capturing. `Object[Key] = Value` is another.

When assigned to, it provides the default value (pattern match fails otherwise).

(To capture in the value of a reference, wrap it in `access`.)

```javascript
view⦇#(a,b) = (1,2)⦈ // {}

view⦇(x,y,x) = (1,2,1)⦈ // { x→1, y→2 }

(x, y=2, z=3) = (1) // { x→1, y→2, z→3 }
(x, y=2, z=3) = (1,1,1) // { x→1, y→1, z→1 }
```

---





# Purity (`pure`)

Pure things are defined purely by their structure, and thus equal pure things are merged as one, maximizing re-use and locality. Non-pure and pure things can be mixed freely.

(It is convenient: it allows detecting circular computations, it allows result memoization and removes wasted effort, it speeds up deep equality checking, it minimizes memory usage and maximizes CPU cache usage.)

Most things are pure by default: numbers, acts and functions, concepts. Strings and `(…)`/`{…}` are not.

`pure Of` returns a pure copy of the object `Of` that was potentially created before; `Of` is its static part. Pure objects just return themselves here. (If an object is not written to, it can be made pure.)

Conceptually, `@Object` is a shortcut for "reference to pure object". Useful for separating inner containers.

`pure.of Pure` returns a non-pure copy of the static part that was used to create `Pure`.

`pure.data Pure` returns an object that can be used to store and retrieve information about a pure thing, empty by default. Its contents have no effect on merging. Non-pure objects just return themselves here.

`pure.in Object` returns some pure objects that `Object` is a part of. Each pure object leaves a mark in at least one of its static parts so that it can be found. The returned back-reference container cannot be written to (except natively).

```javascript
view @(1,2,3) // (1,2,3)
#a = @(1,2,3)
#b = @(1,2,3)
a:b //Does not fail — they are references to exactly the same objects.

⦇pure.data @(1,2,3)⦈.frequency = 5
view pure.data(1,2,3).frequency // 5

view(pure.in 1, pure.in 2, pure.in 3) //One of them will contain (1,2,3).
```

Updates in pure objects (`Update Pure`) return `pure Update⦇pure.of Pure⦈` — [a pure version of the updated non-pure copy](https://en.wikipedia.org/wiki/Persistent_data_structure). `access.with` is required to actually get the result. This is not necessarily copy-on-write — not changing the visible set of keys/values (only shape) could re-bind the pure object to the new one.

```javascript
#a = @(1,2,3)
a[1] = 5
view a // (1,2,3)
a = a[1→7]
view a // (1,7,3)
```

If a pure object is forgotten, its pure data will likely be immediately lost. Make sure to keep them in caches (released on memory pressure in a desired order) if that data is important. [[There should be a concept that allows such caches to be integrated; the global `cache` reference, iteratable in the least-important-first order, and auto-put-into on destruction?]]

Purity is the concept that should be overriden to simplify and canonicalize representations, especially by implementations (for example, an `any` of one item gets replaced with that item, and references-to-references that are accessible more simply (like pointers within a single allocator) are simplified to just references).

---





# Acts (`act`)

Acts join plans (code) to dependencies (input), returning the consequences (output).

`act(Code, Data)` (usually written as `Code Data`) represent a pure application of data to code (a call), applying the result to the caller; it substitutes the created pure view of the act into code's record. Code is the result of `later(Expr, Label)`; acting substitutes the act object into that. Acts control execution flow, detecting infinite recursion and allowing code or data to re-define the flow.

`act.circular` is what is thrown when infinite recursion is detected.

For safety, the continuation (caller) of an act is only accessible natively. Execution flow can only be controlled by returning an object that overrides acting as needed, one step at a time ("when acted on").

Acts ensure that data's conceptual override of code (if any) is given a chance first, then data's override of acting, then code itself; this allows values to define what they mean for particular or all concepts. An act decomposes as `(Code, Data)`, and passes overrides through to `Code`.

(Things like tail call optimization (not returning to the caller if not needed) can be *implemented* by making the  basic functions (like 'if'/'cond') override evaluation. Returning to continuation is just a suggestion.)

To allow both `view double x` and `f(x)(y)` (parsed as `view⦇double⦇x⦈⦈` and `⦇f(x)⦈(y)` would): whitespace (`C ⦇D⦈`) between code and data (function and arguments) is an operator that parses right-to-left with a lower priority, and lack of whitespace (`C⦇D⦈`) parses left-to-right first.

```javascript
view double(yes) f(x)(y)
	//view⦇ ⦇double(yes)⦈ ⦇f(x)(y)⦈ ⦈
```

`act.mem Code` modifies code to return a previously-computed result if available, only executing code if not. Implementations should check for referential transparency (same input always results in the same output), and use this automatically.

[[And even if we could store the result, the act object will likely get deallocated when we return. So there should be some scheme of caching those acts, able to drop some on memory pressure, able to prioritize/bias towards what is likely useful later…]]

[[When [inlining](https://https://en.wikipedia.org/wiki/Inline_expansion), need to pick strategies. Perhaps it is best considered with run-time alt picking.]]

`act.when(Function, …)` returns the set of inputs that produces output as specified, reversing computation. For example, `act.when(x ⇒ 14)` is `…`; `act.when((a,5) ⇒ a+2)` is `(…,5)`; `act.when((a,5) ⇒ a+2; 3)` is `(3,5)`. Useful for analysis.

## Functions

A function `Args ⇒ Expr` is "given `Args`, we have `Expr`" or "if `Args` then `Expr`" or "from `Args` follows `Expr`".

`act.func(Args, Expr)` or `Args ⇒ Expr` creates a function: when filled with its act, `Args` (arguments/parameters) will be captured and bound in `Expr`; it also checks and ensures the validity of control flow (like the lack of loops in it). `Args ⇒ Expr` is the same as `x ⇒ bind(Expr, Args = x)`.

(To ensure that a name in `Args` creates a new argument, wrap it in `bind.not`. On the one claw, it can be too easy to refer to an already-existing binding; on another, `view bind.visible` and proper structural editors can easily provide feedback on this.)

(Implementations are strongly recommended to optimize these heavily, like memoizing if referentially transparent, and/or converting to native code. Everything is done with functions and acts.)

```javascript
f = (a, b: Int, c) => a + b*c
view f(1, 2, 12) // 25
view f(1, 'str', 12) // Error: cannot match arguments, expected an Int

fib = (n: Int) => (| n>1 ? fib(n-1) + fib(n-2) : 1 |)
view fib(3) // 3
view fib(4) // 5
view fib(5) // 8
view fib(1,2) // Error: cannot match arguments

gcd = (x: Int, y: Int) => y ? gcd(y, x % y) : x
view gcd(16, 88) // 8
view gcd(16, 'str') // Error: cannot match arguments
```

To disambiguate on types of arguments, use `first` of functions: `#succ = first(0 ⇒ 1, (|x:Int|) ⇒ x+1)`.

## Errors (`error`, `catch`)

Since the concept of an act includes a reference to its caller, it is only natural to have a concept that is based around that.

A thrown error/exception (`error Error`) overrides normal acting, replacing the result with the thrown error (this immediately starts unwinding computations back to callers). (This divides behavior into normal and exceptional, values into results and errors.)

Since unwinding alone is not very useful, `error` itself is caught by `catch(Try, On)`, which replaces any `error Error` thrown from `Try` with the result of `On Error` (the result of which could be a thrown error if needed); `On` is never evaluated if no error occurs. `catch(error Error, On)` is equivalent to `On Error`.

Together, these make possible any exceptional control flow (transfer of control up to callers).

```javascript
view catch(
	throw 1
	err => last(view('Error:', err), 2)
)
	// Error: 1
	// 2
```

("Finally" is not provided, though it can easily be implemented on top of `error`/`catch`, because resource management must be done with `access.resource`, not by giving responsibility to an expression that could be stopped or watched arbitrarily; "finally" is usually not much use for anything else.)

## Composition (`first`, `last`, `many`)

Execution functions and values, future branches and results, can be combined with these. Each overrides execution to do as specified.

`first Sequence` (or `[|…|]`/`⟦…⟧`): tries all branches in order and returns the first successful result (or the last error), backtracking. Any branch that is a `first` too can be flattened. (For example, trying conditionally-optimized then the general implementation, where cost of each branch is at least double the cost of its previous branch, would make total execution time at most double the most general one, and likely much less.)

`last Sequence` (or `(|…|)`/`⦇…⦈`): tries all branches in order and returns the last (successful) result (or the first error), forward-chaining. Any branch that is a `last` too can be flattened. (This allows returning a result that depends on side-effects (like setting variables) of previous statements, instead of a sequence.)

`many Collection` (or `{|…|}`/`⦃…⦄`): tries all branches without order and returns many results (or many errors); it watches or proves each to ensure that none ever accesses what another writes (with that guarantee, all branches can be tried independently). Any branch that is a `many` too can be flattened. (This is *the* [parallelization](https://en.wikipedia.org/wiki/Parallel_computing) primitive; man can dream, but *many* can achieve.)

`many` overrides acting (and likely other native things, like `view`) to execute many branches at once, returning many results.

`many.by(Collection, Cost)`: after `many`, sorts the results by `Cost Result`; prefers to not evaluate the results unless parallel hardware is actually available to evaluate them. The same as `many Collection`; can be used to optimize/bias evaluation order in `first many …`.

For all these combinators: any branch that is the same combinator can be flattened (so `first(1, first(2,3), 4)` is `first(1,2,3,4)`); having just one branch is the same as just that branch (so `many(5)` is `0→5`).

```javascript
view first(1, 2, 3) // 1
view last(1, 2, 3) // 3
view many(1, 2, 3) // many(1, 2, 3)

view⦇1 + first(1, 2, 3)⦈ // 2
view⦇1 + last(1, 2, 3)⦈ // 4
view⦇1 + many{1, 2, 3}⦈ // many{2, 3, 4}

view⦇1 + first('1', 2, '3')⦈ // 3
view⦇1 + last('1', 2, '3')⦈ // error⦇1 + '1'⦈
view⦇1 + many('1', 2, '3')⦈ // many{ 0→error⦇1 + '1'⦈, 2→error⦇1 + '3'⦈ }
```

Implementations are *very strongly encouraged* to implement `many` with (at least) code-parallel threads and GPU shaders whenever possible (for likely speed-up factors of dozens and hundreds of times respectively, compared to serial execution). Even if not done so, inline memory caching of modern CPUs is most friendly to `many` (a likely speed-up of at least 20 times, over no caching).

---





# Constraints (`limit`)

Some things must be done according to formal and precise specifications/constraints.

`limit(X, T)` (or `X:T`) constrains `X` to be an instance of a sort/type/set `T`; it returns `X` if included, or fails/throws otherwise. Unless overriden, this checks that `X` and `T` are the same (either as-is or after finishing). (Containers are checked by-element.)

If all values of a sort `A` are also of another sort `B`, `A:B` must also succeed — [`X:A` and `A:B` implies `X:B`; `X:X` always succeeds](https://en.wikipedia.org/wiki/Preorder). (Basic operations that take values must also be able to operate on types, like `1 + Int` returning `Int`, for uniformity.)

`limit(X)` returns a value's native/recommended/conceptual type `T`; `limit(X, limit(X))` always succeeds. [[Might remove this one if it proves unnecessary.]]

In natural language, `X:T` is "a/an `T` `X`" or "`X` covered by `T`" or "`X` satisfying `T`" or "`X` included in `T`" or "`X` in the set `T`" or "`X` of the sort/type `T`" or "`X` which is in `T`" or "`X` (an example of `T`)".

(Exceptions effectively fail all constraints. A check of a function result is also a check that it does not throw.)

```javascript
view⦇1: 1⦈ // 1
view⦇1: Int⦈ // 1
view⦇'string': Int⦈ // error⦇'string': Int⦈
view(Int: Int, 1: 1) // (Int, 1)
view⦇(Int, 1): (Int, 1)⦈ // (Int, 1)
view⦇1+2: 3⦈ // 3
view⦇Int8: Int⦈ // Int8

view first(
	(a:Int, b:Int) ⇒ 'ints'
	(x) ⇒ 'a single argument'
	x ⇒ 'anything else'
)(1, 2) // 'ints'

view⦇1 : x⇒x⦈ // 1
view⦇1 : x⇒1⦈ // 1
view⦇x⇒1 : 1⦈ // 1
view⦇x⇒x : 1⦈ // error⦇all{}: 1⦈
```

(Limiting to a function (`Args ⇒ Body`) (`x:F`) is an assertion of whether a value could have been produced by the function (replaced by `x:Body`, with the captured-by-args input bound to `…`); limiting a function (`F:x`) is an assertion of whether its result is always constrained so (replaced by `Body:x`, with args capturing `…`). The same goes for `later`.)

All basic concepts (native constructors especially) should override limiting to check properly, to provide basic blocks to compose arbitrary inference/analysis.

(Implementations are encouraged to do constraint inference and eliminate all redundant constraints on any code re/write (including JIT inlining), and show inferred constraints when viewed in interfaces.)

## Collections (`all`, `any`)

`any` and `all` construct containers that have a special interaction with constraints, covering any and all elements respectively.

`any{…}` is the finite set sum — OR of its elements. `all{…}` is the finite set product — AND of its elements.

`any{X}` or `all{X}` is the same as just `X`. The same elements can be dropped. `any` in `any` or `all` in `all` can be flattened.

`any{}` is never; `all{}` is always.

```javascript
view⦇1: any{1,2}⦈ // 1
view⦇1: any{2,3}⦈ // error⦇1: any{2,3}⦈
view⦇1: all{1,2}⦈ // error⦇1: all{1,2}⦈

view⦇1: all{}⦈ // 1
view⦇1: any{}⦈ // error⦇1: any{}⦈
```

(The many elements of `any`/`all` are not unified by default, only if specifically requested so (since that requires a (quadratic) loop-of-loops of checks and could be slow), by `A & B & C & …` or `A | B | C | …`.)

An `all` can be captured in; an `any` can be captured:

```javascript
#(a,b)

view ⦇all{ (a,b), (b,a) } = (1,1)⦈// {}
	//`a` and `b` are `1`.

view⦇(a,b) = any{ (1,1), (1,2), (3,3) }⦈ // {}
	//`a` is `any{1,3}`, `b` is `any{1,2,3}`.

view⦇all{ (a,b), (b,a) } = any{ (1,1), (1,2), (3,3) }⦈ // {}
	//`a` and `b` are `any{1,3}`.
```

## Composition (`both`, `either`)

`both(A,B)` (`A & B`) returns a constraint that [is all constraints](https://en.wikipedia.org/wiki/Unification_%28computer_science%29). Unless overriden: if mutually covered (`A:B` and `B:A`), returns `A`; if `A:B`, returns `A`, if `B:A`, returns `B`; else returns `any{}`/never/false. (Unifies both constraints into one, solving an equation, without considering alternatives/`alt`.)

`either(A,B)` (`A | B`) returns a constraint that [is any constraints](https://en.wikipedia.org/wiki/Anti-unification_%28computer_science%29). Unless overriden: if `A:B` and `B:A`, returns `A`; if `A:B`, returns `B`, if `B:A`, returns `A`; else returns `any{A,B}`. (There is no way to ever cover `all{}` things just by uniting special cases.)

`⦇x:A⦈:B` is `x: A & B`. `first(x:A, x:B)` is `x: A | B`.

```javascript
view⦇1 & 1⦈ // 1
view⦇1 | 1⦈ // 1
view⦇1 & 2⦈ // any{}
view⦇1 | 2⦈ // any{1,2}
view⦇1 & Int⦈ // 1
view⦇1 | Int⦈ // Int
view⦇x⇒x & x⇒1⦈ // x ⇒ 1
view⦇x⇒x | x⇒1⦈ // x ⇒ x
view⦇any{1,2} & 1⦈ // 1
view⦇any{1,2} | 1⦈ // any{1,2}
view⦇(1, any{1,2,3}) & (any{1,3}, any{2,3,4})⦈ // (1, any{2,3})
view⦇(1, any{1,2,3}) | (any{1,3}, any{2,3,4})⦈ // (any{1,3}, any{1,2,3,4})


#(a,b) = (all{}, all{})
view⦇(a, flatten(b,b), a) & (1,2,2,1)⦈ // (1,2,2,1)
view⦇(a, flatten(b,b), b) & (1,2,2,1)⦈ // any{}
```

## Negation (`not`)

`not T` or `!T` returns a proxy of `T` that inverts coverage by the constraint (if `x:T` is ok, `x:!T` fails; if `x:T` fails, `x:!T` succeeds), and removes any `random` overrides.

(Negating a thrown constraint still fails checks, so `!Err` is the same as `Err`.)

After finishing, limits always either succeed or fail, unless overriden (like exceptions do): `!!T` is `T`; `T | !T` or `!T | T` is `all{}`, `T & !T` or `!T & T` is `any{}`; `!(| A|B |)` is `!A & !B`, `!(| A&B |)` is `!A | !B`. In general, none of these can be relied on.

```javascript
view⦇1: !1⦈ // 1
view⦇1: !2⦈ // error 1: !2

view⦇1 & !2⦈ // 1
view⦇2 & !2⦈ // any{}
view⦇1 | !2⦈ // !2
view⦇2 | !2⦈ // all{}
```

## Generation (`random`)

`random T` generates and returns an `X` such that `X:T` succeeds. If `T` does not override `limit`, this just returns `T`. (While `limit` represents the inclusivity of sets, `random` represents the constructivity of types.)

Naturally, `…T` is "a/an `T`" or "a particular `T`" or "a random `T`" or "an example of `T`" or "an instance of `T`" or "any `T`" or "sample `T`". "If `X` is a number", "let `X` be a number".

Conceptually, `…` is `random bind.visible` ("anything whatsoever"), and `…T` (no whitespace) is `random T` ("a solution/example of `T`").

(Implementations should ensure that this [choice](https://en.wikipedia.org/wiki/Axiom_of_choice) made from any set is complete, and it is impossible to otherwise create an element of a native set that cannot be generated, for intuitiveness.)

`random bind.visible` or `random all{}` picks one of visible bindings and returns its instance. Since everything known is visible through the global scope, this can generate anything (knowable) in existence; the global scope overrides generation to allow and optimize such usage. In fact, repeated constrained arbitrary generation is how `X:T` works if `T` overrides only `limit` and not `random` (this is usually extremely slow though). `random` overrides `limit` to make `X:…` always succeed, and to make `…:T` into `…T`, and to make capturing `…` capture each element as `…`.

(Implementations are encouraged to give special attention to recording the usage and constraints of the result, so that the needs can be merged to allow generation to fail much less.)

```javascript
view …1 // 1
view …Int // possibly -7129
view …any{1,2,3,4} // possibly 2
view …all{1,2} // access.none
view …(1, any{2,3}) // possibly (1, 2)

view⦇(a,b) = …⦈ // { a→…, b→… }
view⦇… = (a,b)⦈ // {}

view …Range(Int, 1, 2) // possibly 1.23456
	//Not sure if a Range class or `1 < …Int < 2`
			//(does not seem extensible for many arguments,
				//*and* is inconsistent with 'returns an ordered container')
		//is better.
```

(Generate and constrain, create and destroy, birth and kill — evolution/development encapsulated (Turing-complete and world-viewing, just like many other viewpoints). All in existence could reasonably be traced to nothing but basic randomness, and incorporated randomness (free will) could reasonably create any future existence too.)

(Unless constrained, new concepts are generally multipliers of a measure (fitness, power, benefit, efficiency…), and thus linear development results in exponential benefits — usable for [sin](https://en.wikipedia.org/wiki/Theory_of_everything_%28philosophy%29)[gularity](https://en.wikipedia.org/wiki/Technological_convergence)/'AI' and humans/'geniuses'.)

## Searching for alternatives (`alt`)

`alt X` returns the set of alternatives to `X` — things that can be used in `X`'s place; `…alt X` is semantically the same as `X`. Unless overriden, this always returns `any{}`.

`alt.search(X, Return, Container)` recursively enumerates (through `Container`) all alternatives of `X` and returns when `Return` does not throw. (This allows adjustment of search strategies/priorities: (in `access`) `queue sequence` is breadth-first, `end sequence` is depth-first, `end shuffled sequence` is arbitrary-first.)

`alt.eqv(A, B)` or `A == B`: returns `B` if it can be reached by alternatives (if a mutually-covering one is found) from `A`, throws `A` otherwise.

`alt.uneqv(A, B)` or `A != B` or `A ≠ B`: returns `B` if it cannot be reached by alternatives from `A`, throws `A` if it can be found. `not(|A == B|)` is `A ≠ B`.

(To cache found alternatives, do `⦇alt A⦈[cache⦇A == B⦈]`.) [[…Though `cache` is not defined yet.]]

A conceptual implementation of `alt.*` could be:

```javascript
alt.search = first(
	(X, Return) ⇒ alt.search(X, Return, access.queue access.sequence)
	(X, Return, Container) ⇒ for(
		Container[alt X]
			//`alt X` is a container, so all within will be written whole-sale.
		A ⇒ first(
			for.return finish Return A
			alt A
		)
		Container
	)
)
alt.eqv = (A,B) ⇒ first(0 ⇒ error A, 1 ⇒ B) alt.search(A, C ⇒ first(
	(| C:B:C, 1 |)
	(| first(C:B, B:C), 0 |)
))
alt.uneqv = (A,B) ⇒ first(1 ⇒ error A, 0 ⇒ B) alt.search(A, C ⇒ first(
	(| C:B:C, 1 |)
	(| first(C:B, B:C), 0 |)
))
```

---





# Abstract languages (`conceptual`, `natural`)

An abstract language defines a mapping between values/concepts and concrete views. Languages are united with the abstract (to emit/write) and applied to the concrete (to parse/read); they are patterns. (Constructing languages is easiest and best done by combining patterns.)

Generally, `Lang Abstract` returns `Concrete`. To go the other way, use `act.when(Lang, Concrete)` to get `Abstract`.

The most general abstract language is `conceptual`; it can map *all* concepts perfectly, allowing self-rewrites and self-awareness (implementations must ensure this; all concepts override `conceptual`). More specialized languages may be more efficient; implementations are recommended to include their host language.

Reading the written, and writing the read, must always be the same.

```javascript
view conceptual⦇1+2⦈ // '1+2' or similar.
view act.when(conceptual, '1+2') // 3
view access.reference act.when(conceptual, '1+2') // 1+2

view natural⦇1+2⦈ // '1 plus 2.' or similar.
view act.when(natural, '1 plus 2.') // 3
```

(With a single system of conceptual meaning, language conversion is "read in the old, write out the new". Syntax/capability optimizations (replacing `General` with `first(Specific, General)`) or searches are performed on writing.)

---

Programming languages are one way to represent concepts, but natural languages are more natural to humans, and converting to them allows self-documenting and readable code. (Simple natural language for concepts here is straightforward to do, since it is largely given in here on definition.)

`natural …` is largely the same as `conceptual …`. It is mostly an experimental thing, to see how natural and convenient this language of concepts is, and how it looks in a structure editor.

(Natural languages are usually too imprecise and unreliable to simply take in, but with mutual effort, a single consistent communication system could be built.)

## Base implementations

Implementation (of code) is development largely guided by another implementation (in the mind). Before use, comes development; before development, comes implementation; before life, comes life.

An implementation is something that defines basic concepts, bootstrapping them into existence. A particular viewpoint that views the world, defining all basic behavior and self-knowledge.

(In programming, a compiler to base/machine code (just-in-time or ahead-of-time) is said to be necessary for performance, with zero consideration given to other conversions. In mathematics or other logic, its formal system is said to be necessary for any other things, defining their formal "foundations" as their only source of truth, with zero consideration to other forms of thought or existence (or to performance). While historically it may have been right to consider only those development ways in most cases, such arrogance is definitely not right in general.)

Programming languages; machine code; [operating](https://en.wikipedia.org/wiki/Unikernel) [systems](https://en.wikipedia.org/wiki/Language-based_system); formal or informal logical systems; human minds — all can be implementations, each as valid and foundational as any other. We are not satisfied with mere conquest; we seek complete reconstruction.

(Different language versions are separate concepts, likely with mostly-shared implementations, so conversions are very likely to be fast.)

Traditionally, implementations have always been unchanging, but generally do not have to be so. Very often, basic behavior/representation is also the quickest/best one, so unconstrained optimization will tend to represent everything in basic terms (but is not forced to).

Unlike many others, this specification does not assume its virtual viewpoint to be the only one possible. Instead, it allows an implementation to fully specify the real base, and match the concepts to practice, combining all (that are known/specified); language conversion is essential.

The whole point of multiple languages is so that self-rewriting (and self-replication) is easy:

```javascript
view conceptual bind.visible // Conceptual implementation of everything.
view natural bind.visible // Natural-language description of everything.
```

Currently-implemented base programming languages: ().

---





# Concrete views (`view`, `viewer`; `doc`)

A concrete view defines how something should be seen visually. It is the layer/interface between languages and the world that must view it. It encapsulates whitespace and interaction, in different independent-from-language contexts (a minified string, or a pretty-printed one, or a document).

```javascript
//How it normally should not but can be used (manual read/write):
#Rule = A ⇒ view.series(view.number 1, first(view.number A, view.string A))
view Rule 5 // 1, 5
view Rule'6' // 1, '6'
view act.when(Rule, view.series(view.number 1, view.number 5)) // 5
view act.when(Rule, view.series(view.number 1, view.string'6')) // '6'
```

`view Concrete` sends the concrete to the current viewer. It is also a namespace for some basic views (mainly for easier construction of a `conceptual` language), namely:

- `view.number Value` — `5`, `12.34`, `.01`, `0xfF0`, `1e6`, `.0e0`, `-1000`; `Infinity`/`∞`.

- `view.name Label` — `Label`, `view`, `x`.

- `view.string Content` — `'6'`, `'str'`, `"a b c"`, `'escaped \\\n\''`, `\`multiline string\``. [[Must look up "markdown backticks in backticks" and/or "markdown escaping in code".]]

  - `view.escaped Codepoints` — `\\`, `\n`, `\'`; `\x50`, `\ufeff`; `\x(50515253)`, `\u(1f174 1f187 1f172)`; `\(0x1f170 \ n ' 127344)`. Being able to view all representation variants is a step-up in learnability from, *not*.

  - `view.text Codepoints` — strings can devolve into these when text selection moves into them, to allow per-character options for visual interaction.

- `view.joined(Sequence, Separator)` is responsible for joining elements of a sequence with a separator (which could be not passed to be empty).

  - `view.spaced Sequence` — `view Rule 5`; responsible for no-line-break whitespace. (In a document, *could* shrink/extend somewhat to fit.)

  - `view.series Sequence` — `view, Rule, 5` or `view; Rule; 5`; responsible for items separated with `,`/`;`/`\n`. Series-in-series could use different priority levels to minimize clutter.

---

`viewer(Expr, Seer)` specifies the current viewer (the one that sees the concrete); `view Concrete` will become `Seer = viewer.write(Seer, Concrete)`.

To read/write in a particular viewer/context, the involved basic views (from which all others can be easily combined) override `viewer.read Prev`⇒`(Cur, Next)` and `viewer.write(Prev, Cur)`⇒`Next`.

If `Prev` is a string, views should be on a minimized (mainly in regards to unneeded whitespace) string. This is the least required functionality; handling other cases could make a viewing rule more beautiful.

If `Prev` is a sequence (like `()`), sub-views of a view should just be collected in the sequence; useful for pretty-printing, whether to-string or visual.

If `Prev` is `viewer.pretty String`, views should be on a pretty-printed (like all the code examples in this specification) string — inline while short, then same-indentation for same-depth.

If `Prev` is `doc.colored String`, views should use doc style colors (and ignore all other formatting). Useful for consoles/terminals.

If `Prev` is `doc …`, views should be on an HTML document. The most flexible, visual, and interactive variant.

---

(It is largely useless to specify `doc` exactly without a proper implementation of the language (so a picture could actually be seen), so a lot of details are omitted.)

`doc Element` represents a visual element in a document (which can contain other elements/documents without cycles). HTML/CSS is the model used for documents, when not specified here, so collection keys are mostly strings.

- `doc.style Properties` represents an element's styles (how it looks). Each property value is either `Element ⇒ String` or `String`. [[Or `doc.anim …` or something…]]

- `doc.on Events` represents how an element should transition when certain things happen. Each event is `'event' → Element⇒Element`. (Both style and event collections can be combined with `first`/`last`.)

- `doc.attr{…}` represents an element's inline attributes/modifiers (neither style nor events).

- `doc.HTML{…}`: represents an HTML element; it can have a tag name (string), styles/events/attributes, and a sequence of children (`(doc …, doc …, ...)`).

- `doc.SVG{…}`: the same as an HTML element, but from the SVG namespace.

(An implementation of this should strive to expand nodes (finish expressions) async, prioritizing on-screen and especially recently-interacted-with. Animating dis/appearance and position changes, and finding the minimal difference of before/after update children lists, is optional but nice.)

---








# Creation (`create`, `creator`)

Creating an object is requesting the ability to distinguish between all instances of a constraint.

(Everything that is said here is in the context of `bind(…, access)` for brevity.)

`create Type` returns a container of a single value (at `access.none`, unless overriden) — an example of `Type`. It denumerates `Value: Type` but not `Type: Value`. Reading (at `access.none`) always returns the last successfully-written result. (For convenience, this container also overrides access/finish and capture.)

(`create⦇A → B⦈` associates keys of `A` with values of `B`, not allowing reads/writes with a different key. Containers then try to access each of their parts, returning the first success.)

For example, `create⦇(1,2,x) ⇒ x⦈` extracts a certain shared structure (with `x` being of `all{}` types).

In general, `create⦇Transform: Into⦈` transforms all incoming accesses and stores the shaped form (of type `Into`). When writing `none→V`, this writes `Transform V`; when reading `none`, this reads `act.when(Transform, V)`. Can be used to extract shared structure, and reduce the total size and repetition this way. (Implementations should use this aggressively to optimize collections.)

`create.states N` separates `N` states. `create.bits N` separates `2**N` states. `create.bytes N` separates `8*N` bits. These are the building blocks from which all memory can be formed; they are served by creators.

(`all{}` (or `…` in this context) is the type that encompasses all types, including itself; a reference/pointer to anything that allows to be remembered. Complete lack of constraints on values/concepts (untypedness) is absolutely required, not only to make every possible thing representable, but also to avoid haphazardly mirroring all concepts near every artificial separation. Performance can be regained by compiling/simplifying for *particular* parameters/values (`first(…, all{})`) — never all: future of "anything" cannot ever be rigidly defined, only suggested.)

`create.times(Values, N)` represents up to `N` ordered pairs `i→Values` (`0→…`, `1→…`, …, `N-1 → …`), allowing quick random-index access; any existing item can be deleted-then-written, only the last item can be deleted, and only the next item can be added (unless writing past the limit) — a constant-sized array. Has the most straightforward representation in memory (current count and the elements).

`create.sequence Values` represents pairs `i→Values` (`0→…`, `1→…`, …), allowing quick random-index access and re-sizing; any existing item can be deleted-then-written, only the last item can be deleted, and only the next item can be added — a dynamically-sized array. Likely done by doubling the size of a `sized` array when it fills, and possibly making a mark to trim unused memory later. In conceptual syntax, represented with `(…)`, allowing elements to be pre-filled easily: `()`, `(A)`, `(A, B, C)`, `(A; B; C)`; `(A, B; C)` is `((A,B), C)`. (A basic concept, used everywhere.)

`create.collection Type` represents likely-unordered elements of a `Type`; any item can be deleted or added, arbitrarily, without any checks of pre-existence — a container for everything. Should be more optimized than just adding new elements at the end of a list. Conceptually, arbitrary containers are seen as `{…}`, allowing easy element pre-filling. (A basic concept, used everywhere.)

(Containers should fall back (with `first(…)`) to collections to allow anything to be stored.)

(To overwrite, must always delete before writing, else an item will just be added. If multiple items are fit to be read, the first one should be returned.)

`create.resource(Created, Destroy)`: when the `Created` object stops being relevant, it is passed to `Destroy` (whose return value is ignored). It cannot be copied, [its fate](https://en.wikipedia.org/wiki/Destructor_%28computer_programming%29) cannot be averted, and it can only be entrusted to devices/objects if they guarantee responsibility for it (and so will always take it with them on their destruction).

In conceptual syntax, sequences are created with `(…)`, and collections are created with `{…}`, allowing elements to be prefilled easily. `()`, `(A)`, `(A, B, C)`, `(A; B; C)`; `(A, B; C)` is `((A,B), C)`. `{}`, `{1→2}`, `{1, 2, 3}` (concretely the same as `{1→1, 2→2, 3→3}`), `{ (1,2), 7→3, { 'a'→4 }, 5 }`.

```javascript
bind((|
	view a // 1
	a[none → 2] //is 2
	a[none → any{1,2}] //Error; is 2

	a = 1; view a // 1
|), { 'a' → create any{1,2} })
```

---

## Memories (`creator`)

Practically all modern systems represent all storage as a sequence of bytes; interpreting it as objects is program's duty. Being able to go between bytes and objects is essential for implementations, and also allows other tricks like persistence or automatically picking the best memory management scheme, even if implementation's implementation does not support such.

Memories intercept creation to realize objects (constrained distinctions). They give out subsequence references for access and [de/re/allocation](https://en.wikipedia.org/wiki/Memory_management). (Reallocation either truncates or zero-extends the sequence; no active sequences overlap.)

(Implementing even such basic functionality in the language allows everything made to improve language programs (like inlining) to work on memory allocation too.)

`creator(Expr, Memory)` uses `Memory` to handle lifetimes of all creations within `Expr`. (Much like a visual view, but an in-memory view instead.)

`creator.ref` must be overriden by `Memory`; particular shapes could override it too. `creator.ref(Shape)` acquires an instance of `Shape`, returning `Ref` (which must override `access` to be useful); `creator.ref(Shape, Ref)` re-shapes a creation, returning `Ref`; `creator.ref(any{}, Ref)` drops a creation.

`creator` is also a namespace for memory concepts.

---

(Specialized/limited allocators are often more performant than general-purpose ones.)

Allocators/memories:

- Auto-resizing-storage fixed-size `sized(Bytes, Size)`; throws when allocating more than `Size`, wastes when allocating less, very efficient when exactly so. (`Size` can be `…`, mostly for use in other allocators.) [[In JS, can be done with `WebAssembly.Memory` instances (which grow in increments of 64KB), or a polyfill of `ArrayBuffer.transfer(Old, Bytes)`⇒`New`, or an array of array-buffers. Others should be implemented on top of such.]]

- Linear allocator `linear Bytes`, for batch de/allocation. If passed `…`, will re-use the last linear allocator (for scoped de/allocation) or create a reasonably-sized one. Wastes a lot if any cross-allocator references are left when done. (Has two pointers at the start: to position and an ordered container of pointer-to-resource (for handling destructors). Throws when the end is reached.)

- Auto-resizing-storage any-size `static Bytes`, never changing the position of objects; maintains an ordered container of free space information. Merges adjacent empty spaces, and likely picks the least-sized free block. Must be locked to give out only one place for an object at a time (others allocate atomically).

(`Bytes` can be a byte sequence or an allocator (which could allocate a byte sequence) or `…` (for a reasonable default for allocators).)

Memories are objects too, and responsibility for them can be released or held as needed. For this, they must remember all cross-allocator references separately, to be able to release them. Cross-allocator references are thus a lot more expensive than in-allocator ones.

To maximize locality, memories are specified per-scope (not per-creation). If an object needs to re-allocate, it should do so into its own memory.

---

Limiters for increased performance:

- No resources `data Mem`. As children, data does not hold responsibility, and so can be dropped in bulk. Throws if attempting to acquire a resource.

- Single-processor `exclusive Mem`: atomic instructions do not need to be utilized, and unless the storage is persistent, neither does journaling. Throws if a non-exclusive memory attempts to acquire an exclusive object; copy them first.

(After being modified, the original memory cannot be used.)

---

References only give exclusive responsibility by default (create/destroy), just like dictatorships or parenting — on failure, must use an open-ownership memory (create/destroy becomes take/give responsibility).

Remember it, and it will be alive forever; but forget it, and that is the only death that matters.

Arbitrary object connectivity, all equivalent:

- `count Mem` — [counts references](https://en.wikipedia.org/wiki/Reference_counting) to objects; when responsibility is dropped, does delayed object freeing (to the end of current access, if any) and cycle dis/unification (sometimes). Best for large long-lived objects. ([Weak references](https://en.wikipedia.org/wiki/Weak_reference) are fragile and dependent on the using code to do properly. Joining reference counters for cycles is far superior.) (Objects also have int or in-allocator ref counters.)

- `trace(Mem, N=0: Int)` — must first [mark all alive](https://en.wikipedia.org/wiki/Tracing_garbage_collection) to release the dead; those who are marked `N` times (or randomly less, or when the old becomes full) are moved to the next sub-memory. Cross-allocator references and created or written-to objects become roots of such marking processes. Best for small short-lived objects. (Objects also have a was-marked bit, flipped in meaning between markings, and `N` states. Objects can also become their new position in the next sub-memory. Every sub-memory has an optional reference to its superseding sub-memory.) (With `N=0`, always moves; with `N=∞`, very rarely moves.)

## Caching (`cache`)

Some things are nice to keep in memory (for performance), but should be dropped if that memory is required for other things.

`cache` is the global write-only interface to the container that contains all such objects. When, it will be iterated and encountered objects removed.

`cache.state Mem` or `cache.state …` provides information about available memory: it returns `(Taken, Total)` (both are very likely in bytes). When it is too close to one, the cache can be cleared.

---





# Access (`access`; `for`)

Access is the bridge for processing to storage and other devices — ensures a [serializable](https://en.wikipedia.org/wiki/Serializability) stream of [linearizable](https://en.wikipedia.org/wiki/Linearizability)/[indivisible](https://en.wikipedia.org/wiki/Atomicity_%28database_systems%29) operations. Reading or writing, atomic or not, cyclic or not, or other useful access patterns are accessible for full access control. (Full abstract control is usually very tedious to do manually, so it is better to do so automatically.)

(`Object.Key` or `access Object.Key` reads; `Object.Key = Value` or `Object[Key → Value]` or `access Object[Key → Value]` writes. Objects pass their overrides to their items.)

`access At`: makes the whole `At` expression a transaction, ensuring that torn accesses are impossible (no actual (device/wire) accesses overlap); all accesses are serialized. Accesses during access are parts of that same access. Invoked directly, is either `access.journal` or `access.atomic`.

(In exclusive volatile storages, `access` (and its `atomic`/`journal`) has zero overhead, and can be omitted entirely.)

`access` is also a namespace for concepts spawned to define useful [access patterns](https://en.wikipedia.org/wiki/Memory_access_pattern) (each returns a proxy that overrides `access` to do as specified here, and for convenience, `finish` to read and `capture` to write), namely:

---

Sometimes-better alternative manifestations of `access`, for optimization (all semantically equivalent):

- `journal At`: watches execution of `At`, remembering all accesses in a journal/log/cache (serving reads from the cache if covered), deferring all writes, and then trying to commit writes under a lock (restarting `At` if any reads have changed). If storage is persistent, a commit first writes a journal of writes at an unused location, which must be executed on storage power-up; power outages will not allow a torn write to be seen. Best if there are few reads. (If recorded, both the journal and its commit instruction go into the record.)

- `atomic At`: directs all reference writes inside [to object copies](https://en.wikipedia.org/wiki/Read-copy-update), journaling those (serving reads from the journal), and then commits the reference-change journal (restarting `At` if needed). Best if there are few writes.

Basic types often override all these forms of access with a single atomic operation. These serve as a base which can ensure serializability.

---

Volatile-storage serialization (could expose torn writes in persistent storage):

- `lock Object`: [['Enforce exclusivity for evaluation of this expression' — cut for now because it is [too](https://en.wikipedia.org/wiki/Lock_%28computer_science%29) [complicated](https://en.wikipedia.org/wiki/Two-phase_locking) [and fiddly](https://en.wikipedia.org/wiki/Commitment_ordering).]]

- `address Object`: represents the address of the object to be used in orderings only; a lot of memories and access ports/combiners can expose the direct address for these comparisons, though some cannot be ordered such and will fail. (Used to take locks in a globally-enforced order, to eliminate cyclic dependencies.)

Forcing exclusivity is preferable to retrying (journal/atomic) if the same objects are accessed frequently (high contention).

---

Missing values:

- `none`: a value meaning only the lack of a value. When reading/getting a non-existent value, `access.none` is returned; when writing/setting a non-existent value, `access.none` is accepted to delete it (from keys too). Cannot be read from or written to.

---

Modifying read/write:

```javascript
#a = pure.of(1,2,3)
a[1] = 5; view a // pure.of(1,5,3)
view a[1→7] // pure.of(1,7,3)

a[1] = access.copy a; view a // pure.of(1, pure.of(1,7,3), 3)
```

- `copy Object`: represents a copy of `Object`; writes to one are not visible to the other. Accesses to this new copy in an access do not have to be checked nor deferred.

- `const Object`: the object will not be written to in a way that changes its visible set of keys; instead, if a write requires it, the constant/static/fixed object will be copied.

- `write(Key, Value)`: turns the read-by-default access (at `Key`) into a write (of `Value`); objects are containers of past writes. If stepped-in not in `At` of `part` and when `Key` is not `at`, the returned proxy will return just `Value`, to ease iteration over sequences and sets. In conceptual syntax, seen as `Key → Value`; directly in `{…}`, `Key` is a concrete shorthand for `Key → Key`. All objects are technically `Keys → Values`. Reading the same value as was written will usually return that value.

- `part(Of, At)`: represents a part/member/item/element/property in a container/object. At read, returns the value; at write, returns `Of` if accessed directly; defines `access`/`capture` to access/write at a proper place if used indirectly. In conceptual syntax, `part(Obj, 'At')` is seen as `Obj.At` (at proper static identifiers only), and `part(Obj, At)` as `Obj[At]` (at any locations) — same as in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_Accessors) and similar languages. To write one, use `Obj[K→V]` (⇒`Obj`) or `Obj[K] = V` (`⇒V`) (the returned proxy overrides `capture` for convenience). To write many at once, use `Obj[{ K→V }]` (to read the object reference itself, use `Obj[reference{ K→V }]`).

- `move(From, To)`: reads only from `From` and writes only to `To`. `move(From, From)` is just `From`; `move(move(From, X), To)` and `move(From, move(X, To))` are just `move(From, To)`.

---

Container shapes:

- `keys Object`: represents all keys of `Object` that were written at but not deleted (mostly for use in `for`); `keys⦇Key→Value⦈` is `Key` (while `Key→Value` is `Value` when not a part-at). Cannot be written to.

- `integers⦇⦇N:Int⦈ ≥ 0⦈`: represents `N` ordered pairs `i→i` (`0→0`, `1→1`, …, `N-1 → N-1`); only `i→i` can be written to this (changing nothing). Objects that have this as `keys` are called sequences. The base for `size` and `for` (will always be iterated in ascending order), and all keys of collections must eventually devolve into this to be iterable. `create.times …` and `create.sequence …` (and `(…)`) have this as its keys.

---

Treatment of same items in objects:

- `unique Item`: as key (when written in), overwrites equal items (deletes before writing); as value (when written), fails on writes of equal items.

- `times(Item, ⦇N:Int⦈ ≥ 0)`: represents `Item` repeated `N` times. `times(Item, 0)` is `none`, `times(Item, 1)` is `Item`. For optimization of collections.

- `equals Object`: stores or loads not only same-key objects, but also equal-key objects (those which decompose into equal items).

---

Defined elsewhere, but also useful with accessing:

- `first Sequence`: returns the first access success (or the last failure). Allows object [inheritance](https://en.wikipedia.org/wiki/Inheritance_%28object-oriented_programming%29) and probably-faster copying of immutable objects.

- `last Sequence`: returns the last access success (or the first failure). Can be used for updating multiple [search indexes](https://en.wikipedia.org/wiki/Search_data_structure); or to guard some accesses by other accesses, or for pipelining accesses.

- `many Collection`: combines many accesses into one, ensuring that they are unordered (none ever accesses another's write) before they can be committed. With non-interference ensured, further accesses are very likely done in parallel for much increased speed.

---

Swapping items around (useless in stored objects, but can be useful when relocating):

- `reversed Sequence`: reverses the sequence values. `(1,2,3)` becomes `(3,2,1)`.

- `shuffled Sequence`: [shuffles](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle) the sequence values, into a (uniformly) random permutation.

- `reorder(Object, Reorder)`: on write, scatters (moves values from old to new keys); on read, gathers (moves values from old to new keys); old is `K`, new is `⦇Reorder Object⦈[K]`. `Reorder` must return the keys reordered as it wants (the collection is only materialized as needed, just like everything else here). The most general form of [swapping items around](https://en.wikipedia.org/wiki/Gather-scatter_%28vector_addressing%29).

---

Sequential splicing:

- `start O`, `end O`, `queue O` (which is `move(start O, end O)`): push to (write) or pop from (read) its appropriate end. Basically done by reading/writing an appropriately-positioned splice of the object. Reading what was just written will always return the value without modifying the container.

- `slice(From, To)`: represents a slice with ordered keys from `From` to exclusive `To` (keys for which `From <= Key < To` can be constructed). When read, it is completely removed; when written to, it is completely replaced.

- `flatten Sequence`: represents a contiguous sub-sequence that should be spliced in.

---

	//Should also have "minimal difference between objects/sequences"; diff(a,b)⇒Diff, diff(a,Diff)⇒b, diff(Diff,b)⇒a.

	//What about splaying an element (making it the first in iteration order, faster to access)?
		//And what about bounded-worst-case or bounded-X (like balancing of search trees)?

	//Should strings (accessed as sequences of Unicode code-points) be here too?

	//What about "i ⇒ k*i"? What about "i ⇒ i+k"? (Slices like in Python.)

	//What about circle/ring? Or sequential things that switch to another thing when empty or full?

	//What about least-recently-used (deleting and re-adding items to a collection on reads)?
		//Is this splaying?

	//What about multi-to-one dimensional [locality-preserving (bit-interleaving) key transformation](https://en.wikipedia.org/wiki/Morton_order)? What about tiling, for better locality in a tile?

	//What about hash-tables?
		//(Are they related to `equals`? Do we want to check hash for integrity?)

	//And what about caching, and considering (and picking predicted best of) costs/times?…

	//And what about streams, and measuring parameters of encountered values (avg, median…)?

	//And what about compression and encryption? Shaping the representation for some purpose.

	//Skip-lists: created next node has a set random chance to be either `first(far, next)` or data.

	//Tries (prefix trees): `⦇(prefix, flatten k) → v⦈ ⇒ ⦇k → v⦈`.

## Re-iteration (`for`)

`for` builds on `access` to provide a way to iterate over objects (and possibly transform them) as one operation.

`for(Object, Iteration)`: for each `Item` in `Object`, `Iteration Item` is executed (results are ignored); `Object` is returned.

`for(Input, Iteration, Output)`: each `Item` in `Input` goes through `Iteration Item` and is written to `Output`.

(Things that can be unstable (possibly not iterate over just-added items, or iterate over just-removed ones) when re-iterating from self to self (which is most access shapes) must explicitly forbid it. Things that are stable (like `start`/`end`) must allow it.)

`for.size Object` returns the count of keys in `Object` (some objects/shapes override this to be more efficient than iterating just to count).

`for.return Expr`, when returned from an `Iteration` of a `for` loop, immediately stops/breaks and returns `Expr` instead of `Out`.

A conceptual implementation of `for` could be as such:

```javascript
#for = bind(
    concept{
        step → Args ⇒ first(Return x ⇒ x, x ⇒ x) access Loop Args
            //On step, access the loop, and unwrap return.
        access → { 'return'→Return }
            //`for.return` is `Return`. (Also needs to define 'size' via counting.)
    }
    {
        'Return' → ???
        'Loop' → first(
            (Object, Iter) ⇒ Loop(Object, Iter, {})
                //Redirect output to nothing (or ignore it, for lack of a better concept).
            (access.integers N, Iter, Out) ⇒ bind(
                After N
                {
                    'After' → first(
                        0 ⇒ 0
                        N ⇒ first(Returning, 0 ⇒ Write Iter N-1) After N-1
                    )   //Iterate from 0 to N-1 unless returning.
                    'Write' → first(Returning, X ⇒ Out[X])
                        //Write to output unless returning.
                    'Returning' → first(Return Expr ⇒ Return Expr)
                        //Succeed if returning, fail otherwise.
                }
            )
            (In, Iter, Out) ⇒ Loop(access.keys In, k ⇒ Iter In[k], Out)
                //Iterate keys, redirecting the user from a key to a key→value.
        )
    }
)
```





## Order (`min`, `max`, `sort`; `ordered`)

`min Container`, `max Container`: return the minimum/least or maximum/most (by key) element of a container. *The* fastest for ordered containers, and is usually a linear check for others.

`sort Container`: constructs an ordered container by re-ordering elements if needed and merging ordered sub-containers.

These (along with access) can be done much faster if the container is known to be ordered.

`ordered Container` asserts the ordering of each pair of consequent keys (in iteration order), and constructs an ordered container. `access.unique Item` can be used to ensure that item equality is not allowed (only checked on the right/second item in an order check).

In conceptual syntax, seen as things like `A < B < C` (`ordered(A, unique B, unique C)`) or `A <= B < C <= D` (`ordered(A, B, unique C, D)`) or `A > B` (`ordered(B, unique A)`); all monotone ordering arrowheads must not change direction — they are not binary operators but an extended ordering directive.

(Here, comparison operators (less `<`, less-or `≤`/`<=`, more `>`, more-or `≥/>=`) are not a non-throwing check, but a constrained construction.)

(Ordering of pairs of keys is asserted with `ordered.assert(A,B)`, which returns `B` if the two keys are ordered — whether `A < B` (for `.assert(A, B)`) or `A ≤ B` (for `.assert(A, access.unique B)`) is correct — or throws an exception otherwise. Containers must pass the check for each key. This is convenient to override, but not to use; prefer `max⦇A < B⦈` if needed.)

(Writing new ordered items will preserve ordering (by putting them in the correct place, or into an offending container). Iterating over items sorts each sub-container. Item lookup is much faster than linear iteration (is a [binary search](https://en.wikipedia.org/wiki/Binary_search_algorithm), with taken time logarithmic in item count).)

```javascript
view min{3, 2, 1} // 1→1
view max{3, 2, 1} // 3→3
view min(3, 2, 1) // 0→3

for(    {3, 2, 1}, view) // 3→3; 2→2; 1→1
for(sort{3, 2, 1}, view) // 1→1; 2→2; 3→3

    ⦇1<2⦈ < 5 < ⦇6<7⦈ //A simple search tree, optimized for lookup.
for(⦇1<2⦈ < 5 < ⦇6<7⦈, view) // 1; 2; 5; 6; 7

    1 < {2<6, 5<7} //A simple heap, optimized for min.
for(1 < {2<6, 5<7}, view) // 1; 2; 5; 6; 7
```

[[Not essential for now: `closest ByKey`, `slice(From, To)`.]]

---
























# Convergence (`converges`)

While equivalencies are always true, convergences are made true enough with enough effort.

`converges(A, F, B)` checks that `F` converges between `A` and `B` when their inputs increase.

[[Having numbers would be good, but they should be done properly, like in math.

In math, convergence of a sequence F(N) to V is defined as: for every error E>0, there exists an N such that for all n>=N, |F(n) - V| < E — "can always say where values become close enough". This is non-intuitive, not conductive to having experience (knowing that certain other sequences converge), is highly (perhaps overly) complex, and most importantly, does not generalize to non-number sequences.

Maybe picking another definition could be better than over-using [theorems](https://https://en.wikipedia.org/wiki/Squeeze_theorem) to smooth over practical usage.]]

For example: convergence of `F` between `A` and `B` (`converges(A, F, B)`) is: `i<j<k ⇒ { diff(F j, A i), diff(F j, B k) } < diff(A i, B k) : all{}` — "as inputs increase, outputs always get closer". This can obviously use previously-proven knowledge, only requires an ordering to be defined, is intuitive, can prove a limit `N` but does not force that knowledge (by `converges(…⇒N, F, F) & converges(F, F, …⇒N)`), can prove convergence from nothing (by `converges(A,F,F)` or `converges(F,F,B)` [or even `converges(F,F,F)`](https://https://en.wikipedia.org/wiki/Cauchy_sequence)), and applies to metric spaces (like convergence to a singularity). Better. Maybe.

Equating intuition and formalization can open up new paths (apart from shortening descriptions).

For numbers, convergence allows completing rational numbers with methods of their approximation to represent [everything possible](https://https://en.wikipedia.org/wiki/Complete_metric_space). For other things, it could allow completing concrete results with their computations to encompass all of reality.

Numbers are completed by approximation, behavior is completed by reinforcement, probability distributions are completed by sampling, images are completed by rendering. Putting all those in a precise form into a PL seems very desirable, though difficult. Along with access and object creation, this is the only thing left to complete the first conceptual circle.

---





# Numbers and math

	//BARRIER (Needs convergence analysis — all approximation algorithms must be equal under increasing precision.)

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

---






# Judgements…

	//BARRIER (Needs convergence analysis — all reinforcing algorithms must be equal under increasing time.)

Judgements are a set of reinforcing motivators, all equivalent to each other; united by converging of manifestation input/output with time. (Causation converges to correlation; expectation converges to reality; best action converges to reality.)

(Looking only at their function/results, they may be difficult to classify, or even understand the need for differentiation in the first place; nevertheless, they are united only by convergence, not structure, not definition, not explanation.) (For example, in economics everyone is viewed through best growth/[optimality](https://en.wikipedia.org/wiki/Bellman_equation)/[serotonin](https://en.wikipedia.org/wiki/Serotonin), but such a picture is not (and cannot be) the ultimate answer to existence.)

	//What about biasing, which watches out for `…`/`random` or smth? They are not the same, are they?
		//…Are biases the result of back-propagation of judgements to `random`?

(Pattern and code transformation rules can naturally be done with functions, like `a+b => b+a`. Such rules can be combined with `any` to create a single rewrite system; if within a judging tracer, this system will even adapt itself to be used better.)

---

From preliminary analysis:

Closest words and code for reinforcing (both un-reified and reified converge with any other) human brain substances (closest code is unknown for all but dopamine):

- (most neurons): correlation, causation (which converge with time — Hebbian learning with limiters)

- dopamine: pleasure, expectation, and causation (expectation and reality converge with time — TD-learning).

- serotonin: growth, resources, and satisfaction (best action and reality converge with time — Q-learning)

- noradrenaline: restlessness, vigilance, and attention

- adrenaline=epinephrine: stress, fear, and anxiety

- endorphins: hunger and pain, novelty and euphoria

- …

Humans do not possess evolution natively, and to achieve great speed of changing choices required for faster development, have to [sacrifice some reinforcement methods](https://en.wikipedia.org/wiki/Creativity_and_mental_illness). It is unstable and dangerous until it is perfect. (There *are* certain standards for the wording, though. "Sacrifices must be made to achieve world domination"? No. "No cost too great"? Yes.)

---





# Complete syntax

```javascript
view⦇1+2⦈ // 3
```

Pre-defined precedence rules exist to shorten the most likely programs by hopefully eliminating most need for brackets, increasing convenience, readability, and familiarity. (Equivalent programs can easily be expressed in terms of simpler parsing rules if needed.)

Whitespace does not determine precedence (`1+2 * 3` is the same as `1+2*3` and `1 + (2*3)`) (except when it explicitly does); the used operators do.

`•` is the first of these groups (where a name means to apply the group lower):

- Strings. Numbers. Identifiers. Single-argument (unary) (RtL) (the specific order of application does not matter):

  - Bracketed: sequence `(•)`, collection `{•}`; first `⟦•⟧`/`[|•|]`, last `⦇•⦈`/`(|•|)`, many `⦃•⦄`/`{|•|}`. (`⦇1+2⦈ * 3`)

  - Subsequent variable definition `#•`.

  - Random example (no whitespace in between) `…`/`…•` (`...`/`...•`).

  - Reference to pure `@•`.

  - Constraint negation `!•`.

- Acts/calls, 2 groups: (`!view …Rule @69`; `view⦇1+2⦈`)

  - No-whitespace `•Data`.

  - No-line-break with-whitespace `Code •`.

- At part (member access) `Obj.Id` or `Obj[Expr]`. (`access.reference access.none`)

- Math, 3 groups (each has a capturing version: `A += B` == `A = A + B`): (`a.x + 5`)

  - Exponentiation `X ** •`.

  - `• * Y`, `• / Y`, `• % Y`.

  - `• + Y`, `• - Y`.

- Ordered construction `X < •`, `X ≤ •`/`X <= •`; `X > •`, `X ≥ •`/`X >= •`. (`1+2 < 3+4`)

- Capture/assignment `P = •` and things like `P += •`. (`p = 1<2`)

- Function definition `A ⇒ •`/`A => •`. (`a+b ⇒ b+a`, `a<b<c ⇒ a`, `a=1 ⇒ a+1`)

- Key-value write `• → V`/`• -> V`. (`random → x⇒x`)

- Constraints logic, 4 groups: (`1 : …⇒1`, `…⇒1 & 1⇒…`, `1→2 : 1→…`)

  - Constraining `x: •`.

  - Both `C & •`.

  - Either `C | •`.

  - In/equality/equivalence `C ≠ •`/`C != •`, `C == •`.

- Series, 2 groups:

  - `X, X`.

  - `X; X`, or a line break (`\n` without `,` before or after); can be used for more compact two-layer specification of nested series, or for readability.

- `•`.

All operators can also be accessed as functions, for overriding — infix (between terms) syntax is merely a convenience.

---
