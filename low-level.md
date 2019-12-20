A past thought experiment.  
We've removed things that we've implemented (and all the bullshit).  
Low-level thoughts broken apart and suspended outside of time, in endless wait for the future for them to live in, asking to be remembered.

---





# Execution

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

`schedule.wait Task` waits until the task is completed (joins threads), then returns its result as the result of this act; this task returns if all sub-tasks return. Without accesses, semantically the same as `finish schedule.stop Task`, but likely faster. Useful for parallelizing dependencies.

`schedule.race Task` makes the current task's result the result of whichever task is completed first, and returns `Task`; this task returns if any alt-tasks return. Useful for trying several alternatives in parallel.

There is a small overhead associated with tasks and their synchronization. Do not just spawn a new task for every computation step or loop iteration; let the implementation handle it properly (in particular, use `many`).

---

`scheduler(Expr, Container)` uses the scheduler `Container` to schedule (push) references-to expressions, which are then, on scheduler stepping, popped, stepped-through once, and pushed back (or forgotten or synchronized if completed). It is much like `alt.search`, searching for the end of time.

(It relies on `access` and all its sub-components to allow different scheduling types.)

Examples of scheduling containers:

`at.queue()` [cycles through touched tasks](https://en.wikipedia.org/wiki/Round-robin_scheduling). (If needing one to execute quickly (like to stop the rest), it will be much delayed.)

`at.start()` or `at.end()` completes the last-scheduled task before doing any others. (The same as not having a scheduler at all.)

`at.shuffled at.queue at.shaped((), ⦇R => step.timed(R, 5)⦈)` repeatedly executes a random scheduled expression for a fixed time each time (important tasks like cleaning-up-and-exiting-program may become overly delayed).

---





# Constraints (`is`)

Some things must be done according to formal and precise specifications/constraints.

`is(X, T)` (or `X:T`) constrains `X` to be an instance of a sort/type/set `T`; it returns `X` if included, or fails/throws otherwise. Unless overriden, this checks that `X` and `T` are the same (either as-is or after finishing). (Containers are checked by-element.)

If all values of a sort `A` are also of another sort `B`, `A:B` must also succeed — [`X:A` and `A:B` implies `X:B`; `X:X` always succeeds](https://en.wikipedia.org/wiki/Preorder). (Basic operations that take values must also be able to operate on types, like `1 + Int` returning `Int`, for uniformity.)

`is(X)` returns a value's native/recommended/conceptual type `T`; `is(X, is(X))` always succeeds. [[Might remove this one if it proves unnecessary.]]

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
	(a:Int, b:Int) => 'ints'
	(x) => 'a single argument'
	x => 'anything else'
)(1, 2) // 'ints'

view⦇1 : x=>x⦈ // 1
view⦇1 : x=>1⦈ // 1
view⦇x=>1 : 1⦈ // 1
view⦇x=>x : 1⦈ // error⦇all{}: 1⦈
```

(Limiting to a function (`Args => Body`) (`x:F`) is an assertion of whether a value could have been produced by the function (replaced by `x:Body`, with the captured-by-args input bound to `…`); limiting a function (`F:x`) is an assertion of whether its result is always constrained so (replaced by `Body:x`, with args capturing `…`). The same goes for `later`.)

All basic concepts (native constructors especially) should override limiting to check properly, to provide basic blocks to compose arbitrary inference/analysis.

(Implementations are encouraged to do constraint inference and eliminate all redundant constraints on any code re/write (including JIT inlining), and show inferred constraints when viewed in interfaces.)

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
view⦇x=>x & x=>1⦈ // x => 1
view⦇x=>x | x=>1⦈ // x => x
view⦇any{1,2} & 1⦈ // 1
view⦇any{1,2} | 1⦈ // any{1,2}
view⦇(1, any{1,2,3}) & (any{1,3}, any{2,3,4})⦈ // (1, any{2,3})
view⦇(1, any{1,2,3}) | (any{1,3}, any{2,3,4})⦈ // (any{1,3}, any{1,2,3,4})


#(a,b) = (all{}, all{})
view⦇(a, flatten(b,b), a) & (1,2,2,1)⦈ // (1,2,2,1)
view⦇(a, flatten(b,b), b) & (1,2,2,1)⦈ // any{}
```

## Negation (`not`)

`not T` or `!T` returns a proxy of `T` that inverts coverage by the constraint (if `x:T` is ok, `x:!T` fails; if `x:T` fails, `x:!T` succeeds), and removes any `gen` overrides.

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

## Generation (`gen`)

`gen T` generates and returns an `X` such that `X:T` (`is(X,T)`) succeeds. If `T` does not override `is`, this just returns `T`. (While `is` represents the inclusivity of sets, `gen` represents the constructivity of types.)

Naturally, `…T` is "a/an `T`" or "a particular `T`" or "a random `T`" or "an example of `T`" or "an instance of `T`" or "any `T`" or "sample `T`". "If `X` is a number", "let `X` be a number".

(Implementations should ensure that this [choice](https://en.wikipedia.org/wiki/Axiom_of_choice) made from any set is complete, and it is impossible to otherwise create an element of a native set that cannot be generated, for intuitiveness.)

`gen bind.visible` or `gen all{}` picks one of visible bindings and returns its instance. Since everything known is visible through the global scope, this can generate anything (knowable) in existence; the global scope overrides generation to allow and optimize such usage. In fact, repeated constrained arbitrary generation is how `X:T` works if `T` overrides only `is` and not `gen` (this is usually extremely slow though). `gen` overrides `is` to make `X:…` always succeed, and to make `…:T` into `…T`, and to make capturing `…` capture each element as `…`.

(Implementations are encouraged to give special attention to recording the usage and constraints of the result, so that the needs can be merged to allow generation to fail much less.)

```javascript
view …1 // 1
view …Int // possibly -7129
view …any{1,2,3,4} // possibly 2
view …all{1,2} // at.none
view …(1, any{2,3}) // possibly (1, 2)
```

## Searching for alternatives (`alt`)

`alt X` returns the set of alternatives to `X` — things that can be used in `X`'s place; `…alt X` is semantically the same as `X`. Unless overriden, this always returns `any{}`.

`alt.search(X, Return, Container)` recursively enumerates (through `Container`) all alternatives of `X` and returns when `Return` does not throw. (This allows adjustment of search strategies/priorities: (in `at`) `queue sequence` is breadth-first, `end sequence` is depth-first, `end shuffled sequence` is arbitrary-first.)

`alt.eqv(A, B)` or `A == B`: returns `B` if it can be reached by alternatives (if a mutually-covering one is found) from `A`, throws `A` otherwise.

`alt.uneqv(A, B)` or `A != B` or `A ≠ B`: returns `B` if it cannot be reached by alternatives from `A`, throws `A` if it can be found. `not(|A == B|)` is `A ≠ B`.

(To cache found alternatives, do `⦇alt A⦈[cache⦇A == B⦈]`.) [[…Though `cache` is not defined yet.]]

A conceptual implementation of `alt.*` could be:

```javascript
alt.search = first(
	(X, Return) => alt.search(X, Return, at.queue at.sequence)
	(X, Return, Container) => for(
		Container[alt X]
			//`alt X` is a container, so all within will be written whole-sale.
		A => first(
			for.return finish Return A
			alt A
		)
		Container
	)
)
alt.eqv = (A,B) => first(0 => error A, 1 => B) alt.search(A, C => first(
	(| C:B:C, 1 |)
	(| first(C:B, B:C), 0 |)
))
alt.uneqv = (A,B) => first(1 => error A, 0 => B) alt.search(A, C => first(
	(| C:B:C, 1 |)
	(| first(C:B, B:C), 0 |)
))
```

---





# Abstract languages (`conceptual`, `natural`)

[Memory+processor is an abstract language too, fit for implementation, fit for re-creating self in another medium. An assignable store, defined by conversion.]

An abstract language defines a mapping between values/concepts and concrete views. Languages are united with the abstract (to emit/write) and applied to the concrete (to parse/read); they are patterns. (Constructing languages is easiest and best done by combining patterns.)

Generally, `Lang Abstract` returns `Concrete`. To go the other way, use `act.when(Lang, Concrete)` to get `Abstract`.

The most general abstract language is `conceptual`; it can represent all concepts perfectly (implementations must ensure this; all concepts override `conceptual`). More specialized languages may be more efficient and/or able to represent less; implementations are recommended to include their host language.

Reading the written, and writing the read, must always be the same.

```javascript
view conceptual⦇1+2⦈ // '1+2' or similar.
view act.when(conceptual, '1+2') // 3
view at.reference act.when(conceptual, '1+2') // 1+2

view natural⦇1+2⦈ // '1 plus 2.' or similar.
view act.when(natural, '1 plus 2.') // 3
```

(With a single system of conceptual meaning, language conversion is "read in the old, write out the new".)

---

Programming languages are one way to represent concepts, but natural languages are more natural to humans, and converting to them allows self-documenting and readable code. (Simple natural language for concepts here is straightforward to do, since it is largely given in here on definition.)

`natural …` is largely the same as `conceptual …`. It is mostly an experimental thing, to see how natural and convenient this language of concepts is, and how it looks in a structure editor.

(Natural languages are usually too imprecise and unreliable to simply take in, but with mutual effort, a single consistent communication system could be built.)

## Base implementations

Programming languages; machine code; [operating](https://en.wikipedia.org/wiki/Unikernel) [systems](https://en.wikipedia.org/wiki/Language-based_system); formal or informal logical systems; human minds — all can be implementations, each as valid and foundational as any other.

Traditionally, implementations have always been unchanging, but generally do not have to be so. Very often, basic behavior/representation is also the quickest/best one, so unconstrained optimization will tend to represent everything in basic terms (but is not forced to).

An implementation fully specifies the real base, and matches concepts to practice, combining all (that are known/specified); language conversion is fundamental.

The whole point of multiple languages is so that self-rewriting (and self-replication) is easy and a one-liner.

---





# Concrete views (`view`, `viewer`; `doc`)

A concrete view defines how something should be seen visually. It is the layer/interface between languages and the world that must view it. It encapsulates whitespace and interaction, in different independent-from-language contexts (a minified string, or a pretty-printed one, or a document).

```javascript
//How it normally should not but can be used (manual read/write):
#Rule = A => view.series(view.number 1, first(view.number A, view.string A))
view Rule 5 // 1, 5
view Rule'6' // 1, '6'
view act.when(Rule, view.series(view.number 1, view.number 5)) // 5
view act.when(Rule, view.series(view.number 1, view.string'6')) // '6'
```

`view Concrete` sends the concrete to the current viewer. It is also a namespace for some basic views (mainly for easier construction of a `conceptual` language).

(Basically `_log` in the current implementation. Viewers can't be set though, except by creating `evaluator`s.)

---

`viewer(Expr, Seer)` specifies the current viewer (the one that sees the concrete); `view Concrete` will become `Seer = viewer.write(Seer, Concrete)`.

To read/write in a particular viewer/context, the involved basic views (from which all others can be easily combined) override `viewer.read Prev`=>`(Cur, Next)` and `viewer.write(Prev, Cur)`=>`Next`.

If `Prev` is a string, views should be on a minimized (mainly in regards to unneeded whitespace) string. This is the least required functionality; handling other cases could make a viewing rule more beautiful.

If `Prev` is a sequence (like `()`), sub-views of a view should just be collected in the sequence; useful for pretty-printing, whether to-string or visual.

If `Prev` is `viewer.pretty String`, views should be on a pretty-printed (like all the code examples in this specification) string — inline while short, then same-indentation for same-depth.

If `Prev` is `doc.colored String`, views should use doc style colors (and ignore all other formatting). Useful for consoles/terminals.

If `Prev` is `doc …`, views should be on an HTML document. The most flexible, visual, and interactive variant.

---

(It is largely useless to specify `doc` exactly without a proper implementation of the language (so a picture could actually be seen), so a lot of details are omitted.)

(We just have a super basic `elem Tag Content Style` for now.)

`doc Element` represents a visual element in a document (which can contain other elements/documents without cycles). HTML/CSS is the model used for documents, when not specified here, so collection keys are mostly strings.

- `doc.style Properties` represents an element's styles (how it looks). Each property value is either `Element => String` or `String`.

- `doc.on Events` represents how an element should transition when certain things happen. Each event is `'event' → Element=>Element`. (Both style and event collections can be combined with `first`/`last`.)

- `doc.attr{…}` represents an element's inline attributes/modifiers (neither style nor events).

- `doc.HTML{…}`: represents an HTML element; it can have a tag name (string), styles/events/attributes, and a sequence of children (`(doc …, doc …, ...)`).

- `doc.SVG{…}`: the same as an HTML element, but from the SVG namespace.

(An implementation of this should strive to expand nodes (finish expressions) async, prioritizing on-screen and especially recently-interacted-with. Animating dis/appearance and position changes, and finding the minimal difference of before/after update children lists, is nice.)

---








# Allocation (`allocate`, `allocator`)

[Perhaps it would be better for implementations to have the allocator passed directly. …Also, don't allocators mean "accept this thing into us", exactly the same as abstract language conversion?]

Creating an object is requesting the ability to distinguish between all instances of a constraint.

(Everything that is said here is in the context of `bind(…, at)` for brevity.)

`allocate Type` returns a container of a single value (at `at.none`, unless overriden) — an example of `Type`. It denumerates `Value: Type` but not `Type: Value`. Reading (at `at.none`) always returns the last successfully-written result. (For convenience, this container also overrides access/finish and capture.)

(`allocate⦇A → B⦈` associates keys of `A` with values of `B`, not allowing reads/writes with a different key. Containers then try to access each of their parts, returning the first success.)

For example, `allocate⦇(1,2,x) => x⦈` extracts a certain shared structure (with `x` being of `all{}` types).

In general, `allocate⦇Transform: Into⦈` transforms all incoming accesses and stores the shaped form (of type `Into`). When writing `none→V`, this writes `Transform V`; when reading `none`, this reads `act.when(Transform, V)`. Can be used to extract shared structure, and reduce the total size and repetition this way. (Implementations should use this aggressively to optimize collections.)

`allocate.states N` separates `N` states. `allocate.bits N` separates `2**N` states. `allocate.bytes N` separates `8*N` bits. These are the building blocks from which all memory can be formed; they are served by allocators.

(`all{}` (or `…` in this context) is the type that encompasses all types, including itself; a reference/pointer to anything that allows to be remembered. Complete lack of constraints on values/concepts (untypedness) is absolutely required, not only to make every possible thing representable, but also to avoid haphazardly mirroring all concepts near every artificial separation. Performance can be regained by compiling/simplifying for *particular* parameters/values (`first(…, all{})`) — never all: future of "anything" cannot ever be rigidly defined, only suggested.)

`allocate.times(Values, N)` represents up to `N` ordered pairs `i→Values` (`0→…`, `1→…`, …, `N-1 → …`), allowing quick random-index access; any existing item can be deleted-then-written, only the last item can be deleted, and only the next item can be added (unless writing past the limit) — a constant-sized array. Has the most straightforward representation in memory (current count and the elements).

`allocate.sequence Values` represents pairs `i→Values` (`0→…`, `1→…`, …), allowing quick random-index access and re-sizing; any existing item can be deleted-then-written, only the last item can be deleted, and only the next item can be added — a dynamically-sized array. Likely done by doubling the size of a `sized` array when it fills, and possibly making a mark to trim unused memory later. In conceptual syntax, represented with `(…)`, allowing elements to be pre-filled easily: `()`, `(A)`, `(A, B, C)`, `(A; B; C)`; `(A, B; C)` is `((A,B), C)`. (A basic concept, used everywhere.)

`allocate.collection Type` represents likely-unordered elements of a `Type`; any item can be deleted or added, arbitrarily, without any checks of pre-existence — a container for everything. Should be more optimized than just adding new elements at the end of a list. Conceptually, arbitrary containers are seen as `{…}`, allowing easy element pre-filling. (A basic concept, used everywhere.)

(Containers should fall back (with `first(…)`) to collections to allow anything to be stored.)

(To overwrite, must always delete before writing, else an item will just be added. If multiple items are fit to be read, the first one should be returned.)

`allocate.resource(Allocated, Destroy)`: when the `Allocated` object stops being relevant, it is passed to `Destroy` (whose return value is ignored). It cannot be copied, [its fate](https://en.wikipedia.org/wiki/Destructor_%28computer_programming%29) cannot be averted, and it can only be entrusted to devices/objects if they guarantee responsibility for it (and so will always take it with them on their destruction).

In conceptual syntax, sequences are allocated with `(…)`, and collections are allocated with `{…}`, allowing elements to be prefilled easily. `()`, `(A)`, `(A, B, C)`, `(A; B; C)`; `(A, B; C)` is `((A,B), C)`. `{}`, `{1→2}`, `{1, 2, 3}` (concretely the same as `{1→1, 2→2, 3→3}`), `{ (1,2), 7→3, { 'a'→4 }, 5 }`.

```javascript
bind((|
	view a // 1
	a[none → 2] //is 2
	a[none → any{1,2}] //Error; is 2

	a = 1; view a // 1
|), { 'a' → allocate any{1,2} })
```

---

## Memories (`allocator`)

Practically all modern systems represent all storage as a sequence of bytes; interpreting it as objects is program's duty. Being able to go between bytes and objects is essential for implementations, and also allows other tricks like persistence or automatically picking the best memory management scheme, even if implementation's implementation does not support such.

Memories intercept allocation to realize objects (constrained distinctions). They give out subsequence references for access and [de/re/allocation](https://en.wikipedia.org/wiki/Memory_management). (Reallocation either truncates or zero-extends the sequence; no active sequences overlap.)

(Implementing even such basic functionality in the language allows everything made to improve language programs (like inlining) to work on memory allocation too.)

`allocator(Expr, Memory)` uses `Memory` to handle lifetimes of all allocations within `Expr`. (Much like a visual view, but an in-memory view instead.)

`allocator.ref` must be overriden by `Memory`; particular shapes could override it too. `allocator.ref(Shape)` acquires an instance of `Shape`, returning `Ref` (which must override `at` to be useful); `allocator.ref(Shape, Ref)` re-shapes an allocation, returning `Ref`; `allocator.ref(any{}, Ref)` drops an allocation.

`allocator` is also a namespace for memory concepts.

---

(Specialized/limited allocators are often more performant than general-purpose ones.)

Allocators/memories:

- Auto-resizing-storage fixed-size `sized(Bytes, Size)`; throws when allocating more than `Size`, wastes when allocating less, very efficient when exactly so. (`Size` can be `…`, mostly for use in other allocators.)

- Linear allocator `linear Bytes`, for batch de/allocation. If passed `…`, will re-use the last linear allocator (for scoped de/allocation) or allocate a reasonably-sized one. Wastes a lot if any cross-allocator references are left when done. (Has two pointers at the start: to position and an ordered container of pointer-to-resource (for handling destructors). Throws when the end is reached.)

- Auto-resizing-storage any-size `static Bytes`, never changing the position of objects; maintains an ordered container of free space information. Merges adjacent empty spaces, and likely picks the least-sized free block. Must be locked to give out only one place for an object at a time (others allocate atomically).

(`Bytes` can be a byte sequence or an allocator (which could allocate a byte sequence) or `…` (for a reasonable default for allocators).)

Memories are objects too, and responsibility for them can be released or held as needed. For this, they must remember all cross-allocator references separately, to be able to release them. Cross-allocator references are thus a lot more expensive than in-allocator ones.

To maximize locality, memories are specified per-scope (not per-allocation). If an object needs to re-allocate, it should do so into its own memory.

---

Limiters for increased performance:

- No resources `data Mem`. As children, data does not hold responsibility, and so can be dropped in bulk. Throws if attempting to acquire a resource.

- Single-processor `exclusive Mem`: atomic instructions do not need to be utilized, and unless the storage is persistent, neither does journaling. Throws if a non-exclusive memory attempts to acquire an exclusive object; copy them first.

(After being modified, the original memory cannot be used.)

---

Shared ownership:

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





# Access (`at`; `for`)

Access is the bridge for processing to storage and other devices — ensures a [serializable](https://en.wikipedia.org/wiki/Serializability) stream of [linearizable](https://en.wikipedia.org/wiki/Linearizability)/[indivisible](https://en.wikipedia.org/wiki/Atomicity_%28database_systems%29) operations. Reading or writing, atomic or not, cyclic or not, or other useful access patterns are accessible for full access control. (Full abstract control is usually very tedious to do manually, so it is better to do so automatically.)

(`Object.Key` or `at Object.Key` reads; `Object.Key = Value` or `Object[Key → Value]` or `at Object[Key → Value]` writes. Objects pass their overrides to their items.)

`at At`: makes the whole `At` expression a transaction, ensuring that torn accesses are impossible (no actual (device/wire) accesses overlap); all accesses are serialized. Accesses during access are parts of that same access. Invoked directly, is either `at.journal` or `at.atomic`.

(In exclusive volatile storages, `at` (and its `atomic`/`journal`) has zero overhead, and can be omitted entirely.)

`at` is also a namespace for concepts spawned to define useful [access patterns](https://en.wikipedia.org/wiki/Memory_access_pattern) (each returns a proxy that overrides `at` to do as specified here, and for convenience, `finish` to read and `capture` to write), namely:

---

Sometimes-better alternative manifestations of `at`, for optimization (all semantically equivalent):

- `journal At`: watches execution of `At`, remembering all accesses in a journal/log/cache (serving reads from the cache if covered), deferring all writes, and then trying to commit writes under a lock (restarting `At` if any reads have changed). If storage is persistent, a commit first writes a journal of writes at an unused location, which must be executed on storage power-up; power outages will not allow a torn write to be seen. Best if there are few reads. (If recorded, both the journal and its commit instruction go into the record.)

- `atomic At`: directs all reference writes inside [to object copies](https://en.wikipedia.org/wiki/Read-copy-update), journaling those (serving reads from the journal), and then commits the reference-change journal (restarting `At` if needed). Best if there are few writes.

Basic types often override all these forms of access with a single atomic operation. These serve as a base which can ensure serializability.

---

Volatile-storage serialization (could expose torn writes in persistent storage):

- `lock Object`: 'Enforce exclusivity for evaluation of this expression' — [very](https://en.wikipedia.org/wiki/Lock_%28computer_science%29) [complicated](https://en.wikipedia.org/wiki/Two-phase_locking) [and fiddly](https://en.wikipedia.org/wiki/Commitment_ordering), impossible to write randomly and correctly without an implemented formal checker.

- `address Object`: represents the address of the object to be used in orderings only; a lot of memories and access ports/combiners can expose the direct address for these comparisons, though some cannot be ordered such and will fail. (Used to take locks in a globally-enforced order, to eliminate cyclic dependencies.)

Forcing exclusivity is preferable to retrying (journal/atomic) if the same objects are accessed frequently (high contention).

---

Missing values:

- `none`: a value meaning only the lack of a value. When reading/getting a non-existent value, `at.none` is returned; when writing/setting a non-existent value, `at.none` is accepted to delete it (from keys too). Cannot be read from or written to.

---

Modifying read/write:

```javascript
#a = pure.of(1,2,3)
a[1] = 5; view a // pure.of(1,5,3)
view a[1→7] // pure.of(1,7,3)

a[1] = at.copy a; view a // pure.of(1, pure.of(1,7,3), 3)
```

- `write(Key, Value)`: turns the read-by-default access (at `Key`) into a write (of `Value`); objects are containers of past writes. If stepped-in not in `At` of `part` and when `Key` is not `at`, the returned proxy will return just `Value`, to ease iteration over sequences and sets. In conceptual syntax, seen as `Key → Value`; directly in `{…}`, `Key` is a concrete shorthand for `Key → Key`. All objects are technically `Keys → Values`. Reading the same value as was written will usually return that value.

- `part(Of, At)`: represents a part/member/item/element/property in a container/object. At read, returns the value; at write, returns `Of` if accessed directly; defines `at`/`capture` to access/write at a proper place if used indirectly. In conceptual syntax, `part(Obj, 'At')` is seen as `Obj.At` (at proper static identifiers only), and `part(Obj, At)` as `Obj[At]` (at any locations) — same as in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_Accessors) and similar languages. To write one, use `Obj[K→V]` (=>`Obj`) or `Obj[K] = V` (`=>V`) (the returned proxy overrides `capture` for convenience). To write many at once, use `Obj[{ K→V }]` (to read the object reference itself, use `Obj[reference{ K→V }]`).

- `copy Object`: represents a copy of `Object`; writes to one are not visible to the other. Accesses to this new copy in an access do not have to be checked nor deferred.

- `const Object`: the object will not be written to in a way that changes its visible set of keys; instead, if a write requires it, the constant/static/fixed object will be copied.

- `pure Object`: the type of objects compressed in memory: equal instances are ref-equal.

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

```
Should also have "minimal difference between objects/sequences"; diff(a,b)=>Diff, diff(a,Diff)=>b, diff(Diff,b)=>a.

What about splaying an element (making it the first in iteration order, faster to access)?
	And what about bounded-worst-case or bounded-X (like balancing of search trees)?

Should strings (accessed as sequences of Unicode code-points) be here too?

What about "i => k*i" (index stride)? What about "i => i+k" (index shift)? (Slices like in Python.)

What about circle/ring? Or sequential things that switch to another thing when empty or full?
	(Evict-least-recently-used caches are splayed ring buffers.)

What about multi-to-one dimensional [locality-preserving (bit-interleaving) key transformation](https://en.wikipedia.org/wiki/Morton_order)? What about tiling, for better locality in a tile?

What about hash-tables?
	(Are they related to `equals`? Do we want to check hash for integrity?)

And what about caching, and considering (and picking predicted best of) costs/times?…

And what about streams, and measuring parameters of encountered values (avg, median…)?

And what about compression and encryption? Shaping the representation for some purpose; where both a function and its inverse exist.

Skip-lists: created next node has a set random chance to be either `first(far, next)` or data.

Tries (prefix trees): `⦇(prefix, flatten k) → v⦈ => ⦇k → v⦈`.
```





## Order (`min`, `max`, `sort`; `ordered`)

[Wait, why are we putting order not only inside access, but before numbers too?]

`min Container`, `max Container`: return the minimum/least or maximum/most (by key) element of a container. *The* fastest for ordered containers, and is usually a linear check for others.

`sort Container`: constructs an ordered container by re-ordering elements if needed and merging ordered sub-containers.

These (along with access) can be done much faster if the container is known to be ordered.

`ordered Container` asserts the ordering of each pair of consequent keys (in iteration order), and constructs an ordered container. `at.unique Item` can be used to ensure that item equality is not allowed (only checked on the right/second item in an order check).

In conceptual syntax, seen as things like `A < B < C` (`ordered(A, unique B, unique C)`) or `A <= B < C <= D` (`ordered(A, B, unique C, D)`) or `A > B` (`ordered(B, unique A)`); all monotone ordering arrowheads must not change direction — they are not binary operators but an extended ordering directive.

(Here, comparison operators (less `<`, less-or `≤`/`<=`, more `>`, more-or `≥/>=`) are not a non-throwing check, but a constrained construction.)

(Ordering of pairs of keys is asserted with `ordered.assert(A,B)`, which returns `B` if the two keys are ordered — whether `A < B` (for `.assert(A, B)`) or `A ≤ B` (for `.assert(A, at.unique B)`) is correct — or throws an exception otherwise. Containers must pass the check for each key. This is convenient to override, but not to use; prefer `max⦇A < B⦈` if needed.)

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

Also `closest ByKey`, `slice(From, To)`.

---





# Convergence (`converges`)

---





# Numbers and math

[We don't need precise numbers for learning; a small correctly-ordered approximation suffices.]

It is common in languages to assume a certain set of numerical operations is available; this black box is then allowed to fester, into undiagnosable problems. But what if there is no arithmetic unit in implementation? What if there are only a bunch of electric NAND gates and an ability to create/destroy their compositions? What if there are only a bunch of neurons and an ability to reinforce correct randomly-found paths? What if non-standard precision is required (or allowed)?

## Integers (`Int`)

A bit is one of two things, usually named 0 and 1. It is the smallest kind of integer there is, and all other representations can be expressed in terms of it. To increase a bit by 1: 0→1, 1→error; to decrease: 1→0, 0→error.

Other commonly-used integers include a byte (a sequence of 8 bits), int16, int32, int64.

An integer (`Int`) is a sequence of integers (units, like bits or bytes, likely defined by implementation) (decomposes to that sequence, and defines integer operations).

Representing sign (equal/more/less than 0, zero/positive/negative) in two's complement (the most-significant bit is 0 for positive integers, or 1 for negative integers, and the rest of bits are flipped if negative: in four bits, 5 is `0101`, and -5 is `1010`) is convenient.

To increase an integer by 1, the least-significant (right-most in writing) unit is increased by 1; an error sets the unit to least-possible state and propagates the operation to the next-significant unit; decreasing by 1 is the same, but least- and most- are exchanged. These operations can overflow (when trying to propagate to the sign bit); depending on if memory allocation is cheap/allowed, either sign-extending or throwing variants may be preferred (throwing result modulo base; non-throwing modulo base arithmetic is possible but is not composable and can easily hide bugs).

Bitwise operations operate on individual bits with no regard for sign: negation is `~01` → `10`; 'and' is `0011 & 0101` → `0001`; 'or' is `0011 | 0101` → `0111`. Left shift `X << N` shifts bits left `N` places, discarding left-most bits and filling the right-most N bits with `0`; right shift `X >> N` propagates/copies the sign bit, and `X >>> N` fills left-most N bits with `0`. These can be another base for the rest of operations.

In terms of these operations (and/or other bases if available), all other integer operations can be defined, from their definitions:

- `(+)`/`(-)`: adding an integer B to A is adding 1 to A, B times. Decomposed to units and the throwing `(+)`, it adds units least-significant-first, adding 1 to the next step on error. `(-)` is the same but subtracting (or adding `-N` or `~N+1`). `A+B` → `B+A`, `(A+B)+C` → `A+(B+C)`.

- `(*)`: multiplying A by an integer B is adding A to 0, B times. `A*B` → `B*A`, `(A*B)*C` → `A*(B*C)`. Since `A * (2*k) == (2*A) * k == (A+A) * k` and `A * (2*k+1) == (A+A) * k + A`, it can be done much more efficiently with bitwise operations. Division `(/)` is the inverse of multiplication.

- `(**)`: raising A to an integer power of B is multiplying 1 by A, B times. Since `A ** (2*k) == (A**2) ** k == (A*A) ** k` and `A ** (2*k+1) == (A*A) ** k * A`, it can be done much more efficiently with bitwise operations.

- …And all others.

(While defining exponentiation only in terms of adding-1, and the like, may seem inefficient, such definitions are commonplace in formal logic.)

## Numbers (`Number`)

A number is a computation with a fractional result, computed to the satisfactory non-negative uncertainty (uncertainty made certain): manifested like `Number(expr, uncertainty)` or `Number(expr, wrap => ok)`, numbers are fractions of two integers or their unevaluated manifestations. (Integers are thus numbers with zero uncertainty.)

(Not-yet-computed fractions (numbers) can still have their precision changed; realized fractions cannot.)

Since bits are so basic, the divisor `B` in `A/B` is best represented as a power of two. IEEE-754 specifies reasonable bit-lengths for `A / 2**B` approximation/representation in common total bit lengths (mostly 32 and 64), and does some more things (like represent overflow with ±∞, and an invalid operation with NaNs).

By (mathematical) definition, numbers are things that can be approximated by a fraction (`(/)`, reverse of multiplication) of two integers as precisely as needed. Numeric computations are those that compute the number result to a satisfactory precision; a proper analysis is usually only done for basic mathematic operations (like logarithm or sine) and only for machine-precision, but it is possible for any computation.

## Numeric error

Error-computation, to be used in optimization of error…  
Optimize-by-adjusting-input-precision, optimize-by-computation-equivalencing…  
Any way, `Number` optimizes error until it is satisfactory.

## Calculation convergence

[This is great and all, but why.]

While equivalencies are always true, convergences are made true enough with enough effort.

`converges(A, B, C)` checks that `B` converges between `A` and `C` when their inputs increase.

For example: convergence of `B` between `A` and `C` (`converges(A, B, C)`) is: `i<j<k => { diff(A i, B j), diff(B j, C k) } < diff(A i, C k)` — "for all increasing inputs, distance between outputs of increasing inputs decreases" ("as inputs increase, outputs always get closer"). This can obviously use previously-proven knowledge, only requires ordering and distance to be defined, can prove a limit `N` (by `converges(…=>N, F, F) & converges(F, F, …=>N)`), can prove convergence with no knowledge of the limit (by `converges(A,B,B)` or `converges(B,B,C)` [or even `converges(F,F,F)`](https://https://en.wikipedia.org/wiki/Cauchy_sequence)), and applies to metric spaces.

Possibly better than in math, though its utility is questionable in any case. After all, if we can operate on unevaluated representations comfortably, then we don't actually need unnatural constructions to complete the metric space of rational numbers — it is automatically complete.

---





# Complete syntax used here

This isn't even necessary. Programs are about their meaning, not (just) syntax, able to find expression in many base languages.

Pre-defined precedence rules exist to shorten the most likely programs by hopefully eliminating most need for brackets, increasing convenience, readability, and familiarity. (Equivalent programs can easily be expressed in terms of simpler parsing rules if needed.)

Whitespace does not determine precedence (`1+2 * 3` is the same as `1+2*3` and `1 + (2*3)`) (…except when it explicitly does); the used operators do.

`•` is the first of these groups (where a name means to apply the group one lower):

- Strings. Numbers. Identifiers. Single-argument (unary) (RtL) (the specific order of application does not matter):

  - Bracketed: sequence `(•)`, collection `{•}`; first `⟦•⟧`/`[|•|]`, last `⦇•⦈`/`(|•|)`, many `⦃•⦄`/`{|•|}`. (`⦇1+2⦈ * 3`)

  - Subsequent variable definition `#•`.

  - Random example (no whitespace in between) `…`/`…•` (`...`/`...•`).

  - Constraint negation `!•`.

- Acts/calls, 2 groups: (`!view …Rule @69`; `view⦇1+2⦈`)

  - No-whitespace `•Data`.

  - No-line-break with-whitespace `Code •`.

- At part (member access) `Obj.Id` or `Obj[Expr]`. (`at.reference at.none`)

- Math, 3 groups (each has a capturing version: `A += B` == `A = A + B`): (`a.x + 5`)

  - Exponentiation `X ** •`.

  - `• * Y`, `• / Y`, `• % Y`.

  - `• + Y`, `• - Y`.

- Ordered construction `X < •`, `X ≤ •`/`X <= •`; `X > •`, `X ≥ •`/`X >= •`. (`1+2 < 3+4`)

- Capture/assignment `P = •` and things like `P += •`. (`p = 1<2`)

- Function definition `A => •`/`A => •`. (`a+b => b+a`, `a<b<c => a`, `a=1 => a+1`)

- Key-value write `• → V`/`• -> V`. (`random → x=>x`)

- Constraints logic, 4 groups: (`1 : …=>1`, `…=>1 & 1=>…`, `1→2 : 1→…`)

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
