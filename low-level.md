A past thought experiment.  
We've removed things that we've implemented (and all the bullshit).  
Low-level thoughts broken apart and suspended outside of time, in endless wait for the future for them to live in, asking to be remembered.

---





# Execution

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





# Numbers and math

(We don't need precise numbers for learning; a small correctly-ordered approximation suffices.)

(But if we did want that, we would have wanted arbitrary-precision ints, and approximated-as-`Mantissa / 2**Exponent` division+operations and error estimation, and operation structures and their simplification and search through their equivalencies.)

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
