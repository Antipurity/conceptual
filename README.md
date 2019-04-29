# Prologue

(Specification of a natural and expressive conceptual programming language. A bridge to implementations.)

A simple understanding, given a syntax and named a language. Base of bases; pretty boring, especially with how incomplete it is.

A re-thinking of some of programming language theory and practice; often the same, but sometimes puts a little spin on things.

The goal here is to combine intuition, understanding, specification, and implemented functionality, in every single concept; to span eternity. These [concepts](en.wikipedia.org/wiki/Concept) (pure views of everything knowable) take over `natural` (English) words and patterns, and occasionally find expression in `conceptual` syntax; other base languages would be implementations.





# Base syntax

A precise concrete syntax; a character-sequence matching rule. Does a concept need one? To define, to focus, to exist? Some basic concepts have one, here, though a lot do not. Ways to combine the base syntax (mostly operators) are collated much farther below.

```javascript
Hello there general

15.0 NaN ∞ Infinity -12e3 -0xff -0×FF
'string1'"string2"`multiline
	\`string3\``
print('Sum:', 1+2, '.')
	// Sum: 3.
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

`\ … /` or `{| … |}` or `⟨ … ⟩` (we ran out of brackets) groups terms into one. Use to alter parsing precedence when needed. Allows parsing rules to loop back to the original rule, to make every syntactical construct able to be used anywhere.

(A few non-ASCII characters are used for readability and freshness (for example, `→`, `⇒`, `…`). In all cases, these can be substituted with ASCII versions for more writeability (for example, `->`, `=>`, `...`).)





# Execution (`finish`, `watch`)

Execution (passage of time) and discrete stepping (like in digital devices) are interleaved and can be seen in terms of each other.

`finish Expr` finishes (synchronously executes or evaluates; it is not a computer — it is an [executioner](en.wikipedia.org/wiki/Execution_model)) the expression, returning the result (time passes, and this interpreter loop turns expressions into values, code into data, questions into answers, actions into consequences) (all that does not override this is execution's end).

(To be useful, `finish` overrides acting to always finish data before the code runs. A lot of native code finishes its arguments to proceed, so calling it explicitly is almost never necessary, and in fact, it can get rid of optimization (by code pattern-matching) opportunities.)

(There is no fundamental laziness, infinite data types, wrapping or unwrapping. There is only finishing (and not finishing). If assuming no prior knowledge, this is easier and faster to understand.)

`watch(Expr, For)` traces/follows/intercepts/modifies the path through the execution scope. `For` is a function that accepts the current expression and returns the next expression (likely the same). Do not return an exception unless intended (in particular, do not pattern-match on function arguments beyond `x ⇒ …` outside of backtracking). With `x ⇒ x`, this is the same as finishing. (The expression is wrapped in a watcher object, that finishes as specified and forwards all overrides to the overriden version. Act expansion will move the watchers to dependencies; subsequent expansions will re-use that expansion and likely be much more efficient.)

```javascript
watch(1 + 2 + print 3; first(print x ⇒ x*2, x ⇒ x)) // 9
	// ⟨no printing⟩

watch(print⟨1+2+3⟩, print) // 6
	// print⟨1+2+3⟩
	// ⟨1+2⟩+3
	// 1+2
	// 3
	// 3+3
	// 6
	// print 6
	// 6 ⟨not from tracing⟩
	// 6
```

## Timing (`time`)

Executing code takes time. `time Expr` times the finishing of `Expr`; it returns the number of seconds elapsed (a non-negative number). Implementations should override this if the time taken is known or can be known.

## Scheduling (`schedule`, `stop`, `scheduler`)

Scheduling is the processor accessing itself to progress time.

`schedule Expr` instructs the current [scheduler](en.wikipedia.org/wiki/Scheduling_(computing\)) to finish the expression asynchronously (via write `access⟨Step→Expr⟩`); it returns the task object. (Being parallel is a separate concept, `many`, though implementations are likely to use that too here.)

`stop Task` stops/pauses/cancels the task and returns its most-recently executed expression (which can be scheduled again to continue).

`scheduler(Expr, Step)` uses scheduler `Step` for the execution scope to divide execution into steps; it watches `Expr` for scheduling (set) and interruption (get+set) opportunities, executing (get) along the way. It is also a namespace for concepts made to schedule (each overrides `access` to step as specified), namely:

- `….step`: steps through the expression; cannot be scheduled by itself. Only used as a base for constructing schedulers.

- `….timed(Step, Seconds)`: executes and returns the expression [for about `Seconds` seconds](en.wikipedia.org/wiki/Time_limit) or until the end. If `finish Seconds` is a function, the task is applied to it to get the actual seconds (a non-negative number); if it is `0`, it will execute the least amount of work possible (one time step); if it is `∞`, it will finish; about `6` or less milliseconds is invisible to humans. `timed(timed(Step, A), B)` is `timed(Step, ceil⟨B/A⟩*A)`. [Maybe we should use seconds instead of milliseconds?]

- `….until(Step, Cond)`: executes and returns an expression `Expr` until `Cond Expr` returns a non-exception. This is the more general form of `….timed`, but is much less likely to be implemented natively.

- `….split(Step, Ms, Proportions)` or `….split(Step, Ms)`: moves tasks between two queues; when the active one is empty, it becomes filled with inactive tasks `timed` in proportions of `Ms` at filling time (splits equally if `Proportions` is not specified; it is a function that accepts a task and returns its proportion; time of one is its proportion divided by sum of all proportions, parts of `Ms`). Much like [this](en.wikipedia.org/wiki/O(1\)_scheduler). [Can this be made an access thing? Single-threaded prioritization of first-of-many?]

Examples of schedulers (`with(…, scheduler)` and `with(…, access)`): `random timed(step, 5)` repeatedly executes a random scheduled expression for a fixed time each time (important tasks like cleaning-up-and-exiting may become overly delayed); `queue timed(step, ∞)` finishes tasks one-by-one in the order they were scheduled (practically synchronous); `queue step` [cycles through touched tasks]() (beware of having a lot of tasks).en.wikipedia.org/wiki/Round-robin_scheduling

---

[What about inlining? To be used in/with `timed`, after or even before execution, to at least maximize CPU pipelining and minimize allocation/overhead for repeated inlinings.] [Part of acting (the time-step of acting)?]





# Bindings (`bind`; `later`, `now`)

Binding an expression to an object (`bind(Expr, Object)`) watches `Expr` to connect labels inside (`bind.to'Label'` or just `Label` if a string) to elements of `Object`, leaving no evidence, into [graphs](en.wikipedia.org/wiki/Graph_(abstract_data_type\)). Inner bindings thus shadow outer ones. `Object` can contain labels to bind too, which will be invisibly bound too. (As programs as strings can only be parsed into trees (lacking multiple parents and cycles), binding is the only way to contain arbitrarily-connected structures in them, and must be supported; copy-on-write cyclical structures are impossible without this.)

All programs in this `conceptual` language are globally bound to all concepts defined here with the labels/names defined here (or to `access.none`, so using an unbound label is usually an error). (Bindings can be deleted by binding to `access.none` in an inner binding.) (Unbound variable names/labels in functions are not errors by themselves, and would be bound dynamically to the call site.)

`bind` is also a namespace.

Traditional program variables are usually done with references to nothing (usually-hidden reference cells that cannot be used before definition (first capture)); if not written to, they should be bound to the read values directly. `bind.where'Label'` or `@Label` makes this traditional usage more convenient: it overrides acting on the returned label to define a variable in the closest enclosing sequence only.

`bind.new` is a completely new and unique binding-to each time it is acted on, which can be stored in variables/objects. Used to not have to come up with a particular label name in some scenarios.

`bind.visible` is a read-only object that represents all visible bindings; `bind.visible.label` is the same as just `label`. Useful for debugging/inspecting, familiarizing with development, picking of unused names in code.

`bind.not Expr` watches `Expr` to ensure that it contains no unbound labels. Useful for optimization of binding (do not have to watch for bindings if there are no bindings); implementations are encouraged to use this for all functions.

`bind.find Constraint` goes through all visible bindings to find the one and only that fits `Constraint` (`for(bind.visible, x ⇒ ⟨x: Constraint⟩, {})` should contain exactly one element); seen in `natural` English language as "the Constraint". Though very harmful for (startup) performance, the `natural` language usually steers clear of mentioning bindings and much prefers this. Inspection routines may well use this, along with natural language.

```javascript
print bind(a, { 'a' → b, 'b' → 12 }) // 12
print bind(a, { 'a' → { 1→b }, 'b' → { 2→a } })
	// ⟨Prints the cyclical object represented similarly or the same to this one.⟩
	// ⟨`a[1]` would have returned `b`; `a[1][2]` would have returned `a`.⟩

print bind(a+2, { 'a' → access.reference access.none }) // error⟨access.none⟩
print bind(bind(a+2, { 'a' → reference none }), access) // error⟨access.none⟩
print bind(last(a=2, a=3, a+4), { 'a' → access.reference access.none }) // 7

print last(@a, a=2, a=3, a+4) // 7
print last(a=2, @a, a=3, a+4) // error⟨access.none⟩
last(@a=1, last(@a=2, print a), print a)
	// 2
	// 1
print ⟨(x,y) ⇒ x*y⟩(@a = 3, a + 2) // 15


print bind.visible // ⟨Prints/inspects all globally-bound concepts.⟩

print a // a
print bind.not a // error⟨access.none⟩
print bind.not bind.visible // error⟨access.none⟩

print last(@a=1, bind.find Number) // 1
```

(Variables, symbols, names, labels, identifiers, arguments, parameters — all synonyms.)

(There is no lexical and dynamic scope, there is only binding of variables (which can occur in advance (compile-time lexical) or in the moment (run-time dynamic)). No need for an ad hoc mirror of this concept.)

## Recording and filling (`later`, `now`)

`later(Expr, Label)` records the usage of the binding `Label` in `Expr`, evaluating the known and remembering the unknown (binds the label to the recorder, which overrides acting), abstracting. For use with `now(Later, Data)`, which binds the record to `Data`, specializing. `now(later(Expr, Label), Data)` is `bind(Expr, { Label → Data })`. (`Label` is only a way to record, and is not present in the record.)

It is useful for (natively) returning completely invisible and non-invasive and non-blocking promises to return a value — when a value is not available now but will be in the future. The implementation records its results's usage as it wishes and provides the actual value later. (To do this, where `@Result = bind.new`, the native function (in its act `Self`) should do `@Recording = schedule later(now(act.then Self, Result), Result)` *and un-schedule the current expression* (impossible non-natively), and when `@Data` arrives, do `schedule now(stop Recording, Data)`.)

It is useful for analyzing the future effects of a value in order to better pick it now — for example, generation (`…`) that is later constrained (`…: Constraint`) could easily use this to backward-propagate the constraints if it desires so.

(Perfect conceptual self-recording/self-understanding/self-awareness is also useful in conceptual self-replication, like teaching/convincing or spreading knowledge, or unpredictable resolution order of dependencies.)

Who are you? What are you doing here?

[Neurologically, functions of the [default mode network](en.wikipedia.org/wiki/Default_mode_network) seem quite close to this.]





# Access (`access`; `with`, `for`)

Access is the bridge for processing to storage and other devices — ensures a [serializable](en.wikipedia.org/wiki/Serializability) stream of [linearizable](en.wikipedia.org/wiki/Linearizability)/[indivisible](en.wikipedia.org/wiki/Atomicity_(database_systems)) operations. Reading or writing, atomic or not, cyclic or not, or other useful access patterns are accessible for full access control. (Full abstract control is usually very tedious to do manually, so it is better to do so automatically.)

(`Object.Key` or `access Object.Key` reads; `Object.Key = Value` or `Object.⟨Key → Value⟩` or `access Object.⟨Key → Value⟩` writes. Objects pass their overrides to their items.)

`access At`: makes the whole `At` expression a transaction, ensuring that torn accesses are impossible (no actual (device/wire) accesses overlap); all accesses are serialized. Accesses during access are parts of that same access. Invoked directly, is either `access.journal` or `access.atomic`.

(In exclusive volatile storages, `access` (and its `atomic`/`journal`) has zero overhead, and can be omitted entirely.)

`access` is also a namespace for concepts spawned to define useful [access patterns](en.wikipedia.org/wiki/Memory_access_pattern) (each returns a proxy that overrides `access` to do as specified here, and for convenience, `finish` to read and `capture` to write), namely:

---

Sometimes-better alternative manifestations of `access`, for optimization (all semantically equivalent):

- `journal At`: watches execution of `At`, remembering all accesses in a journal/log/cache (serving reads from the cache if covered), deferring all writes, and then trying to commit writes under a lock (restarting `At` if any reads have changed). If storage is persistent, a commit first writes a journal of writes at an unused location, which must be executed on storage power-up; power outages will not allow a torn write to be seen. Best if there are few reads.

- `atomic At`: directs all reference writes inside [to object copies](en.wikipedia.org/wiki/Read-copy-update), journaling those (serving reads from the journal), and then commits the reference-change journal (restarting `At` if needed). Best if there are few writes.

Basic types often override all these forms of access with a single atomic operation. These serve as a base which can ensure serializability.

---

Volatile-storage serialization (can expose torn writes in persistent storage):

- `lock Object`: [Or, 'mutual exclusion'? 'Enforce exclusivity for evaluation of this expression'?] […But what about lock-inside-lock, which can be in different order in different accesses?]

	//There should be two types of locks: locked-to-write and locked-to-read… Or, are these distinguished by the usage? No, these are structural properties…

[It's not really attached though — a lock has to be attached to an object…] [Well, it can be attached to an expression too, right?]

	//It's not really a generic scheme, is it? So, should be attached-to-object failable access modifier? [Never lock after unlocking in an access…]

[Write locks are acquired at start and released at end. Read locks are acquired as they want…]

	//Should `lock Expr` be here too? What will this lock be attached to though, and how will we avoid deadlocking? (Simply imposing a global order on taking locks will not be enough, since they can be reached in an arbitrary manner. Or will scope-ordering be enough? No it won't be, we have to ensure that one cannot do `access(lock A, lock B)` and another `access(lock B, lock A)`.)

- `address Object`: represents the address of the object to be used in orderings only; a lot of memories and access ports/combiners can expose the direct address for these comparisons, though some cannot be ordered such and will fail. (Used to take locks in a globally-enforced order, to eliminate cyclic dependencies.)

Forcing exclusivity is preferable to retrying (journal/atomic) if the same objects are accessed frequently (contention).

---

Viewing values (0, 1, ∞):

- `none`: a value meaning only the lack of a value. When reading/getting a non-existent value, `access.none` is returned; when writing/setting a non-existent value, `access.none` is accepted to delete it (from keys too). Cannot be read from or written to.

- `resource(Create, Destroy)`: finishes `Create` to get the constructed object; when it stops being relevant, it is passed to `Destroy` (whose return value is ignored). It cannot be copied, its fate cannot be averted, and it can only be entrusted to devices/objects if they guarantee responsibility for it (so will always take it with them on their destruction). (Remember it, and it will be alive forever; but forget it, and that is the only death that matters.)

- `reference Object`: represents the whole object, whatever it is. Writes and `capture` will change the object pointed to, not write inside of it. For all those that do not override `access`, this is the same as just `Object`. `Object` is not finished (unless directed so with `finish`) and will only be evaluated on demand. (Particular memory allocators will define their own references that can hold only their objects (which are cheaper than generic references); to store all, they must be able to fall back to this.)

---

Modifying read/write:

- `write(Key, Value)`: turns the read-by-default access (at `Key`) into a write (of `Value`); objects are containers of past writes. If finished not in `At` of `part` and when `Key` is not `at`, the returned proxy will return just `Value`, to ease iteration over sequences and sets. In conceptual syntax, seen as `Key → Value`; directly in `{…}`, `Key` is a concrete shorthand for `Key → Key`. All objects are technically `Keys → Values`. Reading the same value as was written will usually return that value.

- `move(From, To)`: reads only from `From` and writes only to `To`. `move(From, From)` is just `From`; `move(move(From, X), To)` and `move(From, move(X, To))` are just `move(From, To)`.

- `copy Object`: represents a copy of `Object`; writes to one are not visible to the other. Accesses to this new copy in an access do not have to be checked nor deferred.

- `part(Of, At)`: represents a member/item/element/property in a container/object. Defines `access`/`capture` to access/write at a proper place. In conceptual syntax, `part(Obj, 'At')` is seen as `Obj.At` (at proper identifiers only), and `part(Obj, At)` as `Obj[At]` (at any locations) — same as in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_Accessors). To write one, use `Obj[K→V]` or `Obj[K] = V` (the returned proxy overrides `capture` for convenience), which return the written `K→V` (can usually be used as `V`). To write many at once, use `Obj[{ K→V }]` (to read the object reference itself, use `Obj[reference{ K→V }]`).

---

Container shapes (that which remembers past writes (elements)):

- `keys Object`: represents all keys of `Object` that were written at but not deleted (mostly for use in `for`); `keys⟨Key→Value⟩` is `Key` (while `Key→Value` is `Value` when not a part-at). Cannot be written to.

- `integers⟨N:⟨Int≥0⟩⟩`: represents `N` ordered pairs `i→i` (`0→0`, `1→1`, …, `N-1 → N-1`); only `i→i` can be written to this (changing nothing). Objects that have this as `keys` are called sequences. The base for `size` and `for` (will always be iterated in ascending order), and all keys of collections must eventually devolve into this to be iterable.

- `sized⟨N:⟨Int≥0⟩⟩`: represents up to `N` ordered pairs `i→Item` (`0→…`, `1→…`, …, `N-1 → …`); any existing item can be overwritten with a new value, only the last item can be deleted, and only the next item can be added (unless writing past the limit); a constant-sized array. Has the most straightforward representation in memory (current size, capacity, and `N` elements).

- `sequence`: represents pairs `i→Item` (`0→…`, `1→…`, …); any existing item can be overwritten with a new value (or just deleted without writing), only the last item can be deleted, and only the next item can be added; a dynamically-sized array. Likely done by doubling the size of a `sized` array when it fills, and possibly making a mark to trim unused memory later. In conceptual syntax, represented with `(…)` and `,`/`;`/line-breaks, allowing elements to be pre-filled easily: `()`, `(A)`, `(A, B, C)`, `(A; B; C)`; `⟨A, B, C⟩` (but `⟨A⟩` is just `A`); `(A, B; C)` is `((A,B), C)`. (A basic concept, used everywhere.)

- `collection`: represents likely-unordered pairs `…→…`; any item can be deleted or added, arbitrarily. In conceptual syntax, represented with `{…}`: `{}`, `{A}`, `{A, B, C}`, `{A; B; C}` — an arrow-less item like `A` directly in `{…}` is a shortcut for `A→A`; `{ A→B, C→D }`; {A, B; C} is `{{A,B}, C}`; `{1,1,1}`. Nested-without-reference containers are transparent to access, and are allowed for optimization: `{(1,2), 3→4}` is `{ 0→1, 1→2, 3→4 }`; there is no point in nesting collections, only more specific/specialized containers. (A basic concept, used everywhere.) (To overwrite, deleting before writing must always be used, else an item will just be added.)

[Shouldn't it be possible to change shape of semantically-immutable but not memory-immutable objects? Ensuring its decomposition does not change.]

Objects that allow arbitrary writes should be `first(…, collection)`.

---

Treatment of same items in objects:

- `unique Item`: as key (when written in), overwrites equal items (deletes before writing); as value (when written), fails on writes of equal items.

- `times(Item, N:⟨Int≥0⟩)`: represents `Item` repeated `N` times. `times(Item, 0)` is `none`, `times(Item, 1)` is `Item`. For optimization of collections.

---

Defined elsewhere, but can be used with accessing:

- `first Sequence`: returns the first access success (or the last failure). Allows object [inheritance](en.wikipedia.org/wiki/Inheritance_(object-oriented_programming\)) and probably-faster copying of immutable objects.

- `last Sequence`: returns the last access success (or the first failure). Can be used to guard some accesses by other accesses, or for pipelining accesses.

- `many Collection`: combines many accesses into one, ensuring that they are unordered (none ever accesses another's write) before they can be committed. With non-interference ensured, further accesses are very likely done in parallel for much increased speed.

- `concept.defines Object`: represents conceptual overrides of the object/concept. `concept.defines concept Object` is just `Object` (`concept.defines reference concept Object` represents the overrides of the `concept Object` expression itself).

- `pure.in Object`: represents the set of pure objects that `Object` is in (in the form `{ In }`); each pure object is always represented in at least one its item. Only implementations can write to this (in `pure In` or forgetting pure objects).

	//Shouldn't there be a readable/writable portion of purity that can be used to store mutable data, like, in acts, result or known-as or return-to? (Not in copy-on-write/immutability, but in purity.)
		//(So, `pure(Static, Dynamic)`? Or at least `pure{…}` and `pure.with({…}, {…})`…)
		//Named what?
			//pure.mutable?
			//pure.info?
			//pure.data?
			//pure.extra?
			//pure.cache?
				//…Just pick one and stick to it for now?
			//(There appears to be no Wikipedia article for purity, at most pure functions and various philosophical/religious stuff. Strange.)

---

Swapping items around (useless in stored objects, but can be useful when relocating):

- `reversed Sequence`: reverses the sequence values. `(1,2,3)` becomes `(3,2,1)`.

- `shuffled Sequence`: [shuffles](en.wikipedia.org/wiki/Fisher–Yates_shuffle) the sequence values, into a (uniformly) random permutation.

- `sorted Sequence`: sorts the sequence values.

- `reorder(Object, Reorder)`: on write, scatters (moves values from old to new keys); on read, gathers (moves values from old to new keys); old is `K`, new is `⟨Reorder Object⟩[K]`. `Reorder` must return the keys reordered as it wants (the collection is only materialized as needed, just like everything else here). The most general form of [swapping items around](en.wikipedia.org/wiki/Gather-scatter_(vector_addressing\)).

---

Sequential splicing:

	//What is the interface to such splicing? One that can splice in many places at once?
		//And to constructing such a splice (well, it's the same as just splicing)?
		//We can just define one-place splice, and combine them via other concepts to have many…

- `start O`, `end O`, `queue O` (which is `move(start O, end O)`): push to (write) or pop from (read) its appropriate end. Basically done by reading/writing an appropriately-positioned splice of the object. Reading what was just written will always return the value without modifying the container.

- `slice(From, To)`: represents a slice with ordered keys from `From` to exclusive `To` (keys for which `From <= Key < To` can be constructed). […What about the slice's value; what does it mean to write a value-less slice, can it even be done? And what about moving the From to 0 in the read result, or from 0 in the written result; `offset(Object, N)`?]

	//And what about non-splicing slices and splicing (shifting other elements) slices?

- `splice(???)`: 

	//Or maybe it should even be slice(from, to) and replace(slice1, data)? Does not seem very consistent…
		//And what about one-directional and bi-directional splices?
	//(Maybe the Wikipedia article on ropes could help.)

	//And what about `flatten Seq`; is this an access pattern, or merely a matching pattern?
		//We could use `flatten` for multiple-element data to replace with…

---

- //`mod(Object, Value ⇒ Value)`: 

	//Shouldn't read and write be symmetric, to achieve structural extraction/compression?
		//How to ensure such a thing?
		//`structure(Object, Struct)`, where Struct is an object that can only read or write (be, uh, `?` or `Key→?` What is `?`?)?
			//(Any shorter name?)
			//(…So, Struct is an object? Maybe it should devolve into `none`, to signify the hole?)
				//(Would it be able to write unevaluated acts though? Well maybe, if they're accessible objects too…)
				//(Should `none` forward access to act as a proper hole in `Struct` for `Object`?)
				//Can we adapt a `graph` to be what substitutes values for labels in `Struct`?
			//…Is this not completely covered by automatic object decomposition capabilities?
				//Wait, is it, really? Aren't different objects fundamentally different, or are objects, uh, see-through unless a reference, or something?
					//And besides, same constructors do not mean same objects. We *have* to watch out for it explicitly… How?
						//Have to be able to get the constructor of an object, and de-construct it into substitutes… Sorting values by type, and stuff…
						//So, just define `typed(Type, Object)` and let types define how objects are de/constructed when passing through? But, how to get the (likely implementation-defined) object types; is it even needed outside an implementation? …For self-awareness — natives must expose self natively?
		//Like, decorating items that pass through with `unique Item`, for uniquely-keyed collections…

---

	//What about "i ⇒ k*i"? What about "i ⇒ i+k"?

	//What about multi-to-one dimensional [locality-preserving (bit-interleaving) key transformation](en.wikipedia.org/wiki/Morton_order)? What about tiling, for better locality in a tile?

[What about least-recently-used (deleting and re-adding items to a collection on reads)?]

	//Should strings (accessed as sequences of Unicode code-points) be 'here' too?

	//And what about skip-lists?
		//Something about each node being the first of (farthest skip, closer skip, …, data), and each skip being ordered, and node creation having a set random chance to be either first(skip, node) or data…
		//The only thing not present is the random-chance.

	//What about circle/ring? Or sequential things that switch to another thing when empty or full?

	//What about hash-tables?

	//What about prefix and suffix trees?

	//What about rebalancing of totally-ordered trees?

	//(And what about caching, and considering (and picking predicted best of) costs/times?…)
		//(Should there be a global function `time Expr`, that can be overriden to finish faster (sections that are not overriden are executed)?)

	//(And what about streams, and measuring parameters of encountered values (avg, median…)?)

	//(And, things like compression or encryption for accesses sound nice…)

---

`with(Object, At)` does a write to the object just like `at(Object, At)`, but returns `Object` instead of what was written.

`for` builds on `access` to provide a way to iterate over objects (and possibly transform them) as one operation.

`for(Object, Iteration)`: for each `Item` in `Object`, `Iteration Item` is executed (results are ignored); `Object` is returned.

`for(Input, Iteration, Output)`: each `Item` in `Input` goes through `Iteration Item` and is written to `Output`.

`for.size Object` returns the count of keys in `Object` (some objects/shapes override this to be more efficient than iterating just to count).





# Order (`ordered`, `min`, `max`)

Here, comparison operators (less `<`, less-or `≤`/`<=`, more `>`, more-or `≥/>=`) are not a check but a constrained construction.

`order(A,B)` returns `B` if the two items are ordered (whether `A < B` (for `order(A, B)`) or `A ≤ B` (for `order(A, access.unique(B))`) is correct) or throws an exception otherwise. This is convenient to override, but not to use; prefer `order.max⟨A < B⟩`.

`order` is also a namespace for things made to order, namely:

- `min Sequence`, `max Sequence`: 

	//(Shouldn't we have something like `closest` too, for not-necessarily-precise access?)

---

`ordered` imposes a limitation in order to allow quick finding of min/max and items, slicing, and sorting.

`ordered Sequence` returns an object if each two consequent items of `Sequence` are ordered (like `A < B`), or an error if not. `access.unique Item` can be used to ensure that item equality is not allowed (only checked on the right/second item in an order check).

	//…Or should `unique` and even `times` be here, not under `access`?
		//What would we use `times` for in ordering, though?

	//This two-item check seems much more convenient to override than the whole `ordered`; should it have an accessible function?
		//Should it be `order`, and should the rest be in its shadow?

In conceptual syntax, seen as things like `A < B < C` (`ordered(A, unique(B), unique(C))`) or `A <= B < C <= D` (`ordered(A, B, unique(C), D)`) or `A > B` (`ordered reverse(B, A)`); all ordering must be ordered in one direction.

	//Should `ordered` just be an `access` thing?

	//Should we have `slice` and `sort` here? What about the `sorted` access pattern, is it real?

	//Also, what about `Range(A,B)`? Seems like it fits well with the order.





# Matching and capturing (`match`, `capture`)

//== just checks equality, = fails if not equal (but references override it to behave like write).
//any, all, not… Are these matching/equality constructs, or acting-overriding things?





# Purity (`pure`)





# Acts and functions (`act`)

Acts join plans to dependencies (input), returning the consequences (output).

`act(Code, Data)` (usually written as `Code Data`) represent an application of data to code (a call), applying the result to the caller; it substitutes the created pure view of the act into code's record. Code is the result of `later(Expr, Label)`; acting substitutes the act object into that. Acts control execution flow, detecting infinite recursion and allowing code or data to re-define the flow.

For safety, the continuation (caller) of an act is only accessible natively. Execution flow can only be controlled by returning an object that overrides acting as needed, one step at a time ("when acted on").

Acts ensure that data's conceptual override of code (if any) is given a chance first, then data's override of acting, then code itself; this allows values to define what they mean for particular or all concepts. An act decomposes as `(Code, Data)`, and passes overrides through to `Code`.

(Things like tail call optimization (not returning to the caller if not needed) can be *implemented* by making the  basic functions (like 'if'/'cond') override evaluation. Returning to continuation is just a suggestion.)

To allow both `print double x` and `f(x)(y)` (parsed as `print⟨double⟨x⟩⟩` and `⟨f(x)⟩(y)` would): whitespace (`C ⟨D⟩`) between code and data (function and arguments) is an operator that parses right-to-left with a lower priority, and lack of whitespace (`C⟨D⟩`) parses left-to-right first. [Not exactly sure how convenient this is, compared to LtR for both.]

```javascript
print double(yes) f(x)(y)
	//print⟨ ⟨double(yes)⟩ ⟨f(x)(y)⟩ ⟩
```

`act.mem Code` [or should it be just `mem Code` for ease of access?] modifies code to return a previously-computed result if available, only executing code if not. [What about checking for things like lacking side-effects?… Referential transparency? Is that a sufficient criterion for memoization?]

[And even if we could store the result, the act object will likely get deallocated when we return. So there should be some scheme of caching those acts, able to drop some on memory pressure, able to prioritize/bias towards what is likely useful later…]

[Also, what about inlining? In particular, during watching, so we could decide what to inline?]

## Functions

[act.func(Args, Expr) for capturing-args… Watched-memoized-with-deoptimization-fallback…]

	//This section on functions must be rewritten.

Functions (`A=>B`) here are an advanced thing that combines code and pattern assignment, and forces memoization and requesting of all arguments. This allows much greater flexibility and convenience than if functions were a fundamental concept.

	//Memoization should only happen if all parts are memoized or referentially-transparent or such (watch out for that). To *force* memoization, `act.mem` exists.

A function is something executed with some particular input; an act, a join point to the interpreter, a lazily-evaluated value. Called like `Func Input`; defined like `Input => Body` or with `⇒` (likely bound in a var to be useful).

```javascript
print 15 // 15
print\a => a+2/ // a => a+2
print \a => a+2/ 13 // 15
```

On application, `Input` gets set (with `=`) to the passed input in a new lexical scope, allowing pattern capturing (this is not a base concept here but a combination, allowing at least double the flexibility):

```javascript
f = (a, b: Int, c) => a + b*c
print f(1, 2, 12) // 25
print f(1, 'str', 12) // Error: cannot match arguments, expected an Int

fib = (n: Int) => \ n>1 ? fib(n-1) + fib(n-2) : 1 /
print fib(3) // 3
print fib(4) // 5
print fib(5) // 8
print fib(1,2) // Error: cannot match arguments

gcd = (x: Int, y: Int) => y ? gcd(y, x % y) : x
print gcd(16, 88) // 8
print gcd(16, 'str') // Error: cannot match arguments
```

To disambiguate on types of arguments, use `first` of functions (defined elsewhere): `@succ = first(0 ⇒ 1, \x:Int/ ⇒ x+1)`.

## Errors (`error`, `catch`)

Since the concept of an act includes a reference to its caller, it is only natural to have a concept that is based around that.

A thrown error/exception (`error Error`) overrides normal acting, replacing the result with the thrown error (this immediately starts unwinding computations back to callers). (This divides behavior into normal and exceptional, values into results and errors.)

Since unwinding alone is not very useful, `error` itself is caught by `catch(Try, On)`, which replaces any `error Error` thrown from `Try` with the result of `On Error` (the result of which could be a thrown error if needed); `On` is never evaluated if no error occurs. `catch(error Error, On)` is equivalent to `On Error`.

Together, these make possible any exceptional control flow (transfer of control up to callers).

```javascript
print catch(
	throw 1
	err => last(print('Error:', err), 2)
)
	// Error: 1
	// 2
```

("Finally" is not provided, though it can easily be implemented on top of `error`/`catch`, because resource management must be done with `access.resource`, not by giving responsibility to an expression that could be stopped or watched arbitrarily; "finally" is usually not much use for anything else.)

## Composition (`first`, `last`, `many`)

Execution/future branches/functions and results/values can be combined with these. Each overrides `finish` and `act` (and likely other native things, like `print`) to do as specified.

`first Sequence`: tries all variants in order and returns the first successful result (or the last error), backtracking. Any variant that is a `first` too can be flattened. (For example, trying conditionally-optimized then the general implementation, where cost of each branch is at least double the cost of its previous branch, would make total execution time at most double the most general one, and likely much less.)

`last Sequence`: tries all variants in order and returns the last (successful) result (or the first error). Any variant that is a `last` too can be flattened. (This allows returning a result that depends on side-effects (like setting variables) of previous statements, instead of a sequence.)

`many Collection`: tries all variants without order and returns many results (or many errors); it watches each to ensure that none ever accesses what another writes (with that guarantee, all variants can be tried independently). Any variant that is a `many` too can be flattened. (This is *the* [parallelization](en.wikipedia.org/wiki/Parallel_computing) primitive; [man can dream, but many can achieve](en.wikipedia.org/wiki/System_Shock_2).)

`many.by(Collection, Cost)`: after `many`, sorts the results by `Cost Result`; prefers to not evaluate the results unless parallel hardware is actually available to evaluate them. The same as `many Collection`; can be used to optimize/bias evaluation order in `first many …`.

For all these combinators: any variant that is the same function can be flattened (so `first(1, first(2,3), 4)` is `first(1,2,3,4)`); having just one variant is the same as just that variant (so `many(5)` is `5`).

```javascript
print first(1, 2, 3) // 1
print last(1, 2, 3) // 3
print many(1, 2, 3) // many(1, 2, 3)

print⟨1 + first(1, 2, 3)⟩ // 2
print⟨1 + last(1, 2, 3)⟩ // 4
print⟨1 + many{1, 2, 3}⟩ // many{2, 3, 4}

print⟨1 + first('1', 2, '3')⟩ // 3
print⟨1 + last('1', 2, '3')⟩ // ⟨error⟨1 + '1'⟩⟩
print⟨1 + many('1', 2, '3')⟩ // ⟨error⟨1 + '1'⟩, error⟨1 + '3'⟩⟩
```

Implementations are *very strongly encouraged* to implement `many` with (at least) code-parallel threads and GPU shaders whenever possible (for likely speed-up factors of dozens and hundreds of times respectively, compared to serial execution). Even if not done so, inline memory caching of modern CPUs is most friendly to `many` (a likely speed-up of at least 20 times, over no caching).





# Concepts (`concept`)





# Generating and constraining (`random`, `limit`)





# Conceptual extensibility (`(#)`)

	//…Or should only *some* things be concepts?
		//Defined by whether it was created with (#), or by whether it overrides (#)?…

	//(#) should be something like `concept`, for naturality…

Here, anything is a concept, and a concept is anything. To maximize evolution potential, concepts can be overriden/[extended](en.wikipedia.org/wiki/Extensibility) by what is newly-created (mainly used in ever-present basic acts/calls to select the execution branch). Extension points and concepts are one-to-one.

Concepts are completely separated (quantified), yet they play off of each other to create something seemingly greater (due to concepts that can combine all in one place, included in minds or here); union usually allows for an exponential increase in power with linear development. (Exactly as predicted for AI/singularity, but accessible to humans too.)

Things (objects, values) exist, but concepts can also be overriden for code by data (all definitions have two parts then: static base (at code) and dynamic extension (at data)). Everything is accessed through a pure immutable (copy-on-write) `#` layer, with the same interface as `[]` (member access), but with a different meaning. (The associated-by-reference data (like `[]`) may be mutable, but `#` is not.) (All values (even numbers and strings) are defined solely by their overrides.)

(Nothing that is said here is an absolute rule forever, it's just a suggestion (including this rule). Complete freedom, yet exactness.)

(There are no keywords, only overridable concepts — though for uniformity and readability, the base syntax cannot be overriden during the initial parse. Definition through extension should be preferred over pattern-matching in base, because users can look at it easily. For full self-awareness, implementations must ensure that all that is defined statically/concretely (like native code or data types) [also exists dynamically/conceptually](en.wikipedia.org/wiki/Quine_(computing\)). For teaching and efficiency, behavior is best mentioned along with the base.)

	//That's a good point; conceptual overrides of a concept (backrefs) should be viewable (though not matched in base, for efficiency), and this graph should be undirected, for maximum flexibility… And it would be best if creation of backrefs was able to be deferred to when needed, for maximum efficiency… How to have both?

Overriding of concepts is a low-level (basic) concept: `(#)` has the interface `first((Data) ⇒ …Code, (Data, Code) ⇒ Override, (Data, Code, Override) ⇒ Data)`. `(#)(Data)` is get all keys, `Data#Code` or `(#)(Data, Code)` is get/read/lookup (returns `none` if the key does not exist), and `(#)(Data, Code, Override)` is set/write/change (copy-modified). (The `#` operator can be overriden too (allowing things like proxies and adapting conceptual storage methods).)

To cancel an override and call the original concept base, return `none` from `Override`; to clear an override, use `(#)(Data, Code, none)`.

(Nothing more and nothing less is overriden; clean development. Conceptual overriding avoids name collisions by referring directly to things that need different behavior, unlike duck typing, which refers to names/strings which can coincide. `(#)` also makes conceptual development natural; if a concept is accessible, it can be developed further without going into it and altering the insides.)

(Complete lack of constraints on values/concepts (compositionality perfected — untypedness) is absolutely required, not only to make every possible thing representable (the only type is "literally anything whatsoever", the rest are optimizations), but also to avoid haphazardly mirroring all concepts near every artificial separation (like programming languages usually do with idea/design/compile/run-time things like intuition/theory/types/values). Performance can be regained by compiling/simplifying for *particular* parameters/values — never all: future of "anything" cannot ever be rigidly defined, only suggested. There is no universally "best" concept or prediction.)





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

`pure{'a':2}`, except ()/{}/acts/… are pure by default… Non-pure and pure objects can be mixed freely…

	//Yeah, we *could* define literally everything as words and functions, and only worry about syntax (which devolves into those words) later.





# Pattern-matching

Patterns are rules that match (`==`) and capture (`=`), constrain (`:`) and generate (`…`). Often, they can be used as shapes too.

Assignment, equality, inclusion, construction, execution — these are the main ways that pattern-matching constructs are consumed/eliminated/used. Put together, they allow pattern-matching (concepts separated for greater extensibility/evolvability).

(Pattern and code transformation rules can naturally be done with functions, like `a+b => b+a`. Such rules can be combined with `any` to create a single rewrite system; if within a judging tracer, this system will even adapt itself to be used better.)

(Successive logical constraints on variables (newly known is both old and constraint) can be written as `X = all{X, constraint}`. When doing type inference of variables, each assignment (newly known is either old or type) alters the type like `T = any{T, type}`. Here, intuition is design, design is implementation.)

	//(What exactly does "pattern-matching error" mean, in code?)

## Match and capture (`(==)`, `(=)`)

`A == B` (matching/equality) returns the match onto `A` of `B` (checks if and how much B is A). `A = B` (capture/assignment) returns the capture onto `A` of `B` (returning the captured scope or a pattern-matching error).

(`A` is more prioritized for overriding (due to how sequences pass their overrides); put the more trusted object first (likely the one that is the most sizable in-place), even though most results of most overrides are order-independent.)

If not overriden, `(==)` returns `all{}` (always/true) for same objects or same finished objects or deeply-equal (through access) objects, and `any{}` (never/false) otherwise. Patterns infer the matching cases in more detail.

If not overriden, `(=)` throws — use on patterns only.

## Constraining and generating (`(:)`, `(…)`)

	//Should these two really be in pattern-matching? Or in another category altogether?
		//Or maybe `,`/`{}`/`→` should override :/… too, to make them as recursive as ==/=.

`X:T` constrains values to those that pass `T`'s check (included in the set `T`). `…T` generates a value that passes `T`'s check (an instance of the type `T`). They allow (conceptual) evolution/development. (Generate and constrain, create and destroy, birth and kill; for efficiency, free will.)

	//Also probably want a type like range(0, 10, Int), for random-number generation…
		//(Or, `range(Int, 0, 10)`, for better overriding trust distribution?)
		//(*Another* pattern?)
	//Or should comparison operators actually be patterns, and have some interaction with types in …T?
		//(What interaction, defined how?)
		//(`0 <= …Int < 10` or `…(0 <= Int < 10)` *does* look good…)

---

`X:T` (or `(:)(X,T)`), when acted on, asserts that `X` is included in `T` and returns `X`; if not overriden, this throws a pattern-matching error unless reference-equal. Used to easily insert tests and type checks wherever needed.

```javascript
print(15: Int) // 15
print('string': Int) // (error)
print(Int: Int, 1:1) // (Int, 1)
print(1+2: 3) // 3

print(Int8: Int) // Int8
print first(
	(a:Int, b:Int) ⇒ 'ints'
	(x) ⇒ 'single argument'
	x ⇒ 'anything else'
)(1, 2) // 'ints'
```

In natural language, `X:T` is "a `T` `X`" or "`X` satisfying `T`" or "`X` included in `T`" or "`X` which is in `T`" or "`X` (an example of `T`)" or "`X` of type `T`".

(Implementations are strongly encouraged to do test and type inference and eliminate all redundant constraints (whenever checked type is included in inferred) on any code re/write (including JIT inlining), or show these constraints when viewed in interfaces.)

Some concept groups are defined not by what they are, but by what they do.

(Types and sets are usually seen as opposed. In type theory, types are properties of values (exactly one type per value, restricting the 'belongs to'), which is convenient for constructive type checking and inference and induction, at the cost of an `Int8` not directly being an `Int`. In set theory, sets are (possibly-overlapping, possibly-infinite, but non-constructive, restricting the 'example of') collections of values. Here, 'example of' and 'included in' are two non-restricted concepts, separated cleanly to combine easily; types and sets shall fuse and give birth to a world.)

---

	//(…Doesn't making `(a)` a sequence kind of break grouping — how to make `print(1+2+3)` or smth print just the one value?)
		//*could* make () be grouping, [] be sequence, and . be access…
	//…Also, `last Sequence`, the opposite of `first Sequence` — where does it fit in?

	//(Also, `flatten Sequence` for pattern-matching and acting…)

`…T`, if not overriden, repeatedly generates anything in existence (`X`) and returns iff (if and only if) it is included in `T` (`X:T`). This is extremely slow — prefer generating only from those concepts which override generation.

	//I'm worried that this includes "repeatedly"; should this be another concept instead?
		//What would be the use case?

`…`/`...`/`…all{}` (wildcard) stands for anything whatsoever (including a potentially-empty sequence); `…T`/`...T` (no space) stands for anything included in `T` (if not specified, `T` stands for "anything whatsoever").

```javascript
print …1 // 1
print …Int // possibly -7129
print …any{1,2,3,4} // possibly 2
print …all{1,2} // none
print …(1 < Int < 2) // possibly 1.23456

print (… ⇒ 12)'zzz' // 12
print ((…a) ⇒ a)(1, 2, 3) // (1, 2, 3)
print ((x, …, y) ⇒ {x, y})(1, 2, 3, 4, 5) // {1, 5}
```

Naturally, `…T` is "a/an `T`" or "a particular `T`" or "a random `T`" or "an example of `T`" or "an instance of `T`" or "any `T`" or "sample `T`". "If `X` is a number", "let `X` be a number".

(Override `(…)` for `T` with random example generation; no need to re-override `…`'s overrides, since overrides do not override overrides of overriden.)

`X == …T` is the same as `X:T` ("`X` is a number" is the same as "number includes `X`"). On capturing (`=`) or shaping (`allocate`), propagates the override to `X`. Used in any other concept than `=`/`allocate` (including `finish`), an instance is generated; this can always be done if `:` is defined (by infinitely generating anything and constraining), though frequently overriden for efficiency.

	//Should it really generate when-acted-on, or just when finished?
		//Don't really want to generate before the function even requests it, right?

	//Sequence-flattening here does not seem like something natural, since we treat sequences in patterns with respect now and do not allow (x,y) to capture (1,2,3).
		//Do we do something else for that?
	//And just passing override for `allocate` does not seem right either, since Int and …Int in shapes are supposed to be totally different.

	//Do we want to just make `…T` be basically the new substitute for `random T`?

(In shapes: `allocate String` returns a constant reference to the `String` concept; `allocate …String` returns a reference to a string; `allocate any{ 1, 2, …String }` returns a reference to either 1 or 2 or a string.)

(`…:T` should be replaced with `…T` on execution.)

	//Can it be done by overrides, of `:` by `…`?

(All in existence could reasonably be traced to nothing but basic randomness. Evolution is Turing-complete too.)

---

	//Inference (analysis, back-chaining): `when(Expr, Result)` to infer when the result would be of the type specified (like `Int < 5`); specifies types/sets of parameters/holes (inline change-able values)?
		//(Marginal distribution returns { value→probability } — like all-results inference…)

	//Finishing a raw variable has no purpose, right? Could be used to define new variables for all consequent statements in the current sequence, right?
		//(Or maybe `var: Type`… But then, don't we have a use for that?)

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

Nested sequences are effectively flattened into one sequence in `=`/`==`. Sequences only match sequences.

(Possibly, `=` is emit, and `==` is parse… Except, won't emit (of concrete syntax trees) be better served as `==`-dependent function, possibly even not overriden by nodes?)

	//How to specify the return type for parse, or the type-check/match for emit, in languages?
		//This closer-to-language just creates the syntax tree of a thing.
			//(Concrete ←→ abstract syntax trees, here?)





# Judgements…

Judgements are a set of reinforcing motivators, all equivalent to each other; united by converging of manifestation input/output with time. (Causation converges to correlation; expectation converges to reality; best action converges to reality.)

(Looking only at their function/results, they may be difficult to classify, or even understand the need for differentiation in the first place; nevertheless, they are united only by convergence, not structure, not definition, not explanation.) (For example, in economics everyone is viewed through best growth/[optimality](en.wikipedia.org/wiki/Bellman_equation)/[serotonin](en.wikipedia.org/wiki/Serotonin), but such a picture is not (and cannot be) the ultimate answer to existence.)

	//What about biasing, which watches out for `…`/`random` or smth? They are not the same, are they?
		//…Are biases the result of back-propagation of judgements to `random`?

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

		//It requires analysis of convergence of approximation algorithms.

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

## Concrete representations

An abstract tree stores only what is important. A language, when applied to an abstract tree, returns a concrete tree. A viewing method (representation), when applied to a concrete tree, turns it into a print-able representation. So, for reading/writing, nodes of the abstract tree should override a language to return the correct flattened pattern.

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

	//Wouldn't it be better to allocate by-bits, not by-bytes? (More precise and does not need workarounds for bit-packing.)

Allocators are responsible for giving out sequence references for access and re/allocation. (Reallocation either truncates or zero-extends the sequence; no active sequences overlap.)

Most general memory has multiple readers and writers, `deallocate`-overriding objects, no constraints on mutability or reference cycles or exclusivity, and no fixed object size or de/allocation pattern. It must make every access atomic, visit the entire object graph before any deallocations, and keep track of all allocation information.

Byte allocators are specified for the evaluation of an expression with `allocator(Alloc, Expr)`; `Alloc` will then be the first to accept allocation requests (then previously-specified ones up the scope chain, ending at the global byte allocator). Allocators override `allocate`, which accepts an unsigned integer `Bytes` and optionally a previously-allocated reference, and returns the re/de/allocated reference; this is used by implementations of writing accesses (or for defining memories for constructing allocator instances).

	//But, `catch`/`finally` puts the expression to execute first; should we do the same?
		//(In allocator, printer, with, trace…)

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

References manage lifetime of resources (objects). Remember it, and it will be alive forever, but forget it, and that is the only death that matters.

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

	//What about property-maintaining nodes, maintaining indexes of collections?
		//Shapes (of {…}) (all shapes must satisfy get-after-set and iteration-after-set tests):
			//- key→value, as the base for all maps/dictionaries.
			//- (…) (or, a number, length?…) (or, `sequence Type`?): least overhead (best iteration), worst access/min/max. Best used as a base case for when there are few items.
			//- Parent <= …Children (or, L<=V or V<=R): best min(/max), worst access.
			//- Sorted (like Left <= Value <= Right) (or always L<=V<=R, because there is only one value (which could be a sequence, just like L/R)?): best sort, ok access/min/max.
			//- Hashed (?…): best access, worst sort/min/max.
			//- first: for combining shapes (like in update-then-previous-version) — worst iteration; looks at each in order to access, does merge-sort to sort, and min/max to min/max.
			//- Pattern-matching stuff (any, all, …, and maybe `:`?)…
				//(`Number` is just that value with no allocated footprint, but `…Number` allocates.)
			//- All types that want to be are shapes too, but they do not pass the tests. Hmm.
				//(Don't they do so by overriding `allocate`? Is this shapes — where do tests fit though?)
					//(Maybe composite-collection-shapes should be in their own test-def namespace…)
			//- Technically, anything else that passes tests too, but do you really want to generate such code repeatedly and randomly?
		//What about multi-index containers? Cannot just stack indexes linearly, since we want references to multi-index nodes and not just their data.
			//Can't they be done with overriding different operations just like `[]`?





# Operators and infix expressions (`(+)`, `(*)`, …)

```javascript
print(1+2) // 3
```

Operators exist for convenience, readability, and familiarity, even though they take up a good chunk of parsing. Equivalent programs can easily be expressed in terms of other parsing rules if needed.

Whitespace does not determine precedence (`1+2 * 3` is the same as `1+2*3` and `1 + (2*3)`); the used operators do.

In the following list (for completeness), each group (precedence level) is either as specified or falls through to the next group in parsing (meaning that emitting a lower group from a higher one requires grouping `(…)`). To specify, in the set of operands of a group, the left-most will be the next group in RtL groups, or the right-most in others (LtR); other operands will be the current group (so RtL is `1**(2**3)` and LtR is `(1+2)+3`).

- Acts/calls, 2 groups:

	- No-whitespace acts `Code Data`.

	- (RtL) No-line-break with-whitespace acts `Code Data`.

- Object decomposition, 2 groups:

	- Conceptual override `#` (like `A#'str'`).

	- Access `[]` (like `A['str']`; `A[B]` can only read, use the concept in an act to do other things).

- Object composition, 2 groups:

	- Key-value `→`/`->` (`(→)`).

	- Function definition `⇒`/`=>` (`(⇒)`).

- Broadcasted operations, 7 groups (each has an assigning version: `A += B` → `A = A + B`):

	- (RtL) unary `~`, `+`, `-`; unary/nullary no-whitespace wildcard `…` […Should all these really be in the operator precedence order?] [Should these be in a separate global-group right after access?].

	- Arithmetic, 3 groups:

		- (RtL) Exponentiation `**`.

		- `*`, `/`, `%`.

		- Two-operands `+`, `-`.

	- Bitwise shifts `<<`, `>>`, `>>>`.

	- Bitwise, 2 groups:

		- `&`.

		- `|`.

- Pattern-matching, 4 groups:

	- Comparisons `<`, `>`, `<=`, `>=`.

		//1 < 2 < x < 4 < 5; 2<x<4. Should non-comparing things throw an error, and comparing return… one of the values — which one though?
			//x: (1 < 2 < Int < 5); x: (3<=Int<=4)…
			//first(x: (0 < Number < 1) ⇒ x*2, …)

	- Inclusion `x:T`. [Should maybe also include `…`, but this priority for that seems unnatural…]

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
