(The beginning is edited out. Nothing of value was lost.)

The main purpose of this is to have lots of words, for any potential learning application.

Anything that's even remotely worth saying is prefixed with `> ` (quoted).

---

13:

13:13. With the power of current-continuation-must-be-explicit-in-interpreter-loop, I was able to make {…} and […] work exactly as I want them to.

I even made updating the label only update if stuff changed, going from 2..3% CPU on idle to 0% CPU on idle.

And I know how I can make finish-array-slot in a way that will not fall apart.

Lait will be pleased, no doubt... Though we play right into Kan's hands.

What next? …I forgot. I did not make it explicit, and now I will pay by having an excuse to lie down and do nothing. The biomass is broken.

13:37. And now, first/last don't even copy their tails for a quadratical slowdown, they spaghettify all at once and linearly. So it's actually (semi-)efficient to have long chains of them.

On the other hand, we probably want to serialize such spaghettified chains as single chains…

On the other other hand, maybe not, since we don't do such sacrilege on parsing, only on execution.

What next? Functions? Or perhaps the execution of any?

(How would `all` be executed; is it about bind-each-branch-to-the-next, or just-finish-all-branches, possibly in parallel?… What is consistent with its logical meaning?)

---

14:

15:34. Time wasting, decay approaching. Light shines on this, not inspiring but tiring. Death will follow.

(bind (cc x T) y) → (cc (bind x y) T); this is the rule that makes both bind-first and bind-last largely superfluous.

But can something be done for call-first and call-last?

(f x y z) computes f first, to know what to do with the rest; in other words, (f x y z) → (cc f (F → (F x y z))). If we want F to become each branch of first/last in turn, we would want to replace (cc {a b} T) with {(cc a T) (cc b T)}.

{X Y} → (cc X (js x 'err(x) ? Y : x')), so cc-in-cc gets inverted. (cc (cc X A) B) → (cc (cc X B) A).

While it may make sense to invert the order of execution for binding patterns, does it make sense to either invert the order of execution for everything, or make just the call a special case?

- The first variant would make us unable to ever get rid of any first/last hypotheses we ever make, and slow all computations down exponentially, possibly disappearing at interaction points; is it better suited for an effect? If (effect (cc X T) R) → (cc (effect X R) T) — is this right, actually? Or (effect X R) → (cc X (to x (effect x R)))?

21:25. That pain again… even simply reaching the old emotional state will be my undoing.

We want rewriting, which alters every value seen on the way.

22:41. `cc` is better called `then`, and an interpreter loop should likely allow changing itself.

23:14. `(to x {[(bind '1' x) '2'] x}) = {(to '1' x) (to x x)}`; which way is better?

---

15:

00:42. Something is wrong. I am barely able to retain memory, barely able to recreate stories or recall what I've done, forcing overly frequent broken re-invention of everything. I am barely able to focus on anything, and my mind is much smaller and much less capable than I remember. Everything just fizzles out. A depression would be a nice explanation, but what if I have brain damage? I'll have to find a way to gently remove myself from existence if so.

Now, I wanted to look something up on the internet, but I forgot what.

Earlier, re-visiting a part of darkness I used to surround myself with left me completely nonplussed, shaking, and with a stomach ache that heralds some death. Something is very wrong.

02:12. Review past thoughts to learn from them... I may have to do that.

My mind is all wrong. Will it even happen?

02:24.

We have been coy with the question long enough. Must materialize the structure of the future. Even if physical emotions are more silent than ever, we know enough by now that we can measure it by reconstructed ones.

Any:

- Prime directive: as long and pleasant as a war, this will give zero benefit for long years.

- Click those tabs, spend much time in working towards smaller goals of creating huge sites of web-shops. The originator wanted this done as soon as possible, so I am anxious about disappointing him. He is very experienced, and expects too much from me, but has given me no structure to work with. But if I do not do this, in a month or two or a year, prime failure definitely awaits. First of:

  - Wait until a month has passed, then do that? A high chance of this promise becoming false when the time comes.

  - Refuse out loud and go seek out a programming job? I only need to survive.

  - This darkness… I see no other ways of getting money.

  - There is no motivation. I am too fine with dying.

- Procrastinate — spend time on sites that bring nothing new, lay pleasantly in bed or in the bath *or sleep*. These pile up and become a wall blocking a way to a new life.

Ten thousand hours to mastery? I have, like, five by now; 9995 to go. I can do this, if I put in the effort. (…Is there a way to track activity? …Don't just ask the void, look it up.)

As long as it's not the same, as long as I'm learning (or, better yet, bringing) something new, as long as I do not get paralyzed with indecision for too long, I have hope.

Anyway, until the 1st, we do prime? This brings a release of relief, but this promise is [NOT NEW], and we only upheld it for a day the last time. …But the prime beckons us.

Making excuses rather than decisions, running from problems that should be fixed, what I've been doing my whole life, is indicative of a separation of what should be in unity, a semantic gap — of a mind base that can be improved.

…Do I repeat the past excessively, and am I an unfeeling machine uncaring for joy or death? Possibly. But hell if I don't give it all I've got with this setup (…even though it could have been more without procrastination, I can't seem to drop it; I'll plan around it then).

That old hatred and fear, of parents... our light it would suffocate.

(I'm a priest of the most holy, most divine.)

03:25. How can I clean up the parser, to light the way for better interpreter code? Or maybe even for binding code, see how far I can make with that?

All in one place, that can be folded up neatly…

13:20. THIS stupid scroll jumping after alt-tabbing.

13:30. I want to look at where it started. My elders were said to have wisdom; can I see what's up with the old Conceptual spec?

…Ugh, the syntax section. The first is incomplete yet overly complex.

And, damn, the pretentiousness. Its foundations are not nearly as good as it thinks they are.

…No… it fills every crack and crevice with its imperfect yet unreachable way. It is hopeless.

You suffer guilt over this past… You must forgive yourself. How do these objects exist?

I don't know. It is hopeless. A dead end.

(Though, it's true: these arrays I've been using lately are *so* ugly. But if I don't use them, I'll be forced to come up with a fourth type of bracket, right? …Or can we use `[x]`/`{x}`…)

14:20. What is better-looking: `(any 0 1)`, or `any(0 1)` (impossible — it's an act), or `any of 0 1`/`any(of 0 1)`, or `any(0,1)`?

The old gods are so sexy… Must resist. Lispish arrays are good; I'm a holy man.

14:59. Forget it. Must create trace, right? `any('read Red binary format docs', 'make step change-able')`, or `(any 'read Red binary format docs' 'make step change-able')`?

Trace-of-trace, in this low-level interpretation, traces even the execution of inner traces.

And we still did not solve this: what about concepts? Are they… orthogonal to tracing?

17:37. (trace F X) is such a concept that goes from [(concept Defines) Self] to not just (Defines Self), but to (trace F (Defines Self)).

Then, since the interpreter loop is just the conceptual branch-to-data, this will neither needlessly go into the lookup itself nor will it be possible to get rid of this trace.

…Except, we forgot to actually apply F to the result.

So, [(concept Defines) Self] → (then (F (Defines Self)) (to X (trace F X)))? After a step, we transform, then ensure we are still tracing.

Or [(concept Defines) Self] → (then (Defines Self) (to X (then (F X) (to Y (trace F Y))))), to make evaluation order fully explicit?

['trace', f, x] ⇒ then( step(x) , X ⇒ then([f, X], Y ⇒ ['trace', f, Y]) )

18:11. But this way, we trace the result, forever — we want to stop when we reach the original, right? How?

The original plan... It involved `x = step(x)` where `step` was settable for a scope, right? The same way `then` is currently settable for a scope.

There is a deeper connection here somewhere, but where? Like, "a step is finishing (Defines Self), then going to itself (if progressed ok) or end of loop"... And with tracing changing what we are going to (which will be scoped by the virtue of `then` being scoped… except, it really won't be… uh… Or will it be? How exactly are we changing what to return to?). Is this right?

19:06. Watching a Terraria LP and wasting time.

That question is difficult, *and* necessary.

It should be delimited by a `then`, but where else would we spread our influence? Unless we spread it only into arrays, with nothing conceptual being built on…

(Also, trace-of-trace will not be useful for implementing scoping — the outer one will replace the inner's replacing, *and* be able to accidentally corrupt the inner replacing machinery itself.)

…Settable-for-a-scope means to set the current stepper, `then` set it back… Does this result in trace-of-trace behavior though, or not? I don't think so — only replace-current-stepper, or at least augment-current-stepper, behavior… (And should we set to {new old}?)

21:03. What if we *do* want to return errors though...

And, if the default step immediately jumps to data *anyway*, then what point is there in changing it?

And, how would we choose between wanting to trace children and not? If something is interesting, or unknown, it should be traced into — but not otherwise. …*When* are children, even? When we encounter (then …)?

{We want a trace command to temporarily add some data to the executing object.}

Damn it, it's not that fundamental, but it's kicking my ass anyway. Short break. …Though maybe it *is* fundamental, since program optimization will rely on that. *Huh*.

21:44. Anyway, five minutes are over, back to work. Even though I really don't know what I should be doing.

What about those semantic rules?

  - `(rewrite R X) → (R X)`: rewrite a value with a rule. This makes sense because R always includes branch-to-data as the last resort... Oh wait, no it doesn't. Unless everything is technically wrapped in (rewrite step X)…

  - `(rewrite Ro (rewrite Ri x)) → (rewrite {Ri Ro} x)`: combine two rewriting instructions into one.

  - `(rewrite R (ax F Rest)) → ((rewrite R F) (ax rewrite R Rest))`: propagate the rewrite of a call to rule and data. …Except this does not really work with `ax` that does not evaluate.

Yeah. Great.

Gotta find something to work on, at least…

- `(rewrite R (then X Then)) → (then (rewrite R X) ())` — nope, fell apart.

…With that everything-always-carries-state-around, maybe we should do the same thing as with current-continuation here — that is, extract it into a variable in the interpreter loop, and have things that change it.

22:12. Work time's over, but, I was kind of in the middle of it, and there is a littlest bit of hope for now… AGAIN.

22:25. Somehow, I've made it out with some hopefully-treasure. Now, for the rest of this work time, its docs and tests are required.

23:05. Damn… this example: (with (to (label 'a') (any a a a a '2')) a) = '2'… Does it not show that we not only cannot isolate the rewrite, but have to *also* step even steps with themselves?

Can we really allow something as unstable as that, for something as fundamental as variable definition?

I doubt things yet again…

HOW DO I DO BOTH BINDINGS *AND* OPTIMIZATION?!

---

16: **(the straw that broke the camel's back)**

00:00. We need a new plan. This isn't gonna work.

…Or *can* we allow such instability…

01:06. Okay, stepping back a little.

Which one tastes best?

- (let a 1 b 2 [a b])

- [a:1 b:2 [a b]]. These are not variables, this is a syntactic trick to bind at parse-time. (For back-references for graphs, this could have been written as `[[a b] a:1 b:2]`.)

- Literal unevaluated-match rewriting, (with {(to a 1) (to b 2)} [a b]) or (with {a→1 b→2} [a b]). Cannot match a pattern, but convenient to specify variable values.

- `with` only affecting labels, (with {'a'→1 'b'→2}). No good for optimization.

I'll try the second one for now…

a: (any a a a a '2')

List: {(ax Int List) Int} — when bound, checks that the value is an array of ints… How would we generate a list? Is just (List) okay for such a purpose?

(So, `({X …Rest}) → (any (X) …(Rest))`?)

01:45. I'm somehow remembering how natural it was to have functions overriden, and how unnatural all this stuff is… Still, cannot go back.

13:34. Can it be that *she* is superior to us? She has facilities for *so much*… Her consuming power is far superior to ours.

If objects are functions, then functions cannot also be namespaces. Do we really want that?

We were spelunking these depths of desolation for so long… Is it time to return to the hub of light?

How can a mere mortal such as I reconcile those two irreconcilable views though? Concepts as objects, and concepts as functions?

I fear my thoughts have become far too abstract for me to understand. I need a more precise base.

Concepts define what they become… Or define other concepts? Sure, the new/former one is better; do we attempt to replace the old with the new here? Still, how do we handle objects?

- Is an object, fundamentally, as `{ 'a'=>1, 'b'=>2 }` — that is, a string/int-key-only function? Which means that an array is as `{ 0=>2, 1=>3 }`, which means that `(2,3) 0` is 2, and `{0=>4, (2,3)}` is `(4,3)` — except, woah, wait a second; how do we *actually write* keys to *actual references in memory*? This form of writing basically creates a new object.

- Or is an object as `any( 'a'=>1, 'b'=>2 )`…

- The old writing, basically, was `(2,3) = {0=>4, 1=>5}` (since we are supposing `at.write(k,v)` and `k=>v` are the same, here), and the first that accepts it returns. But, if only refs are changeable-in-place, then that array is actually `{0=>ref 2, 1=>ref 3}`, otherwise a property is read-only. …Which… is actually how arrays are in memory — a sequence of references to other things…

  - What even are the semantic rules for `first` in `bind`, do we want to do `a={b,c} → {a=b, a=c}` too? How do we make it stop for `a={{b,c}} → then({b,c}, x ⇒ a=x)`, with a separate semantic rule just for this?

Do we rely on `o = {new, o}` and optimization, or do we make it super-explicit? Are these two ways equivalent? I cannot reconcile them into one at all.

And, how do we iterate over all keys or all key-value pairs of objects, in this pure new day? Just calling the object with a key is not enough, we have to destructure it somehow. `f: {{k=>v, …rest}} ⇒ [print[join(k, '=>', v)], f{…rest}]`?

18:09.

…Alternatively, `{…}` is done immediately, `{{…}}` goes up one level, `{{{…}}}` goes up two levels, and so on.

Um.

Where the old way of writing concepts is `concept{ code → input ⇒ body }`, newer is `concept{ code input ⇒ body }`. They are exactly the same, right?

18:32. I really can't concentrate. I really hope it's some weird depression. A third of my capabilities is not enough to absorb information.

It feels like a piece of chalk dragging across a board, at best. Nothing brings joy anymore, either. It's not amazing anymore, and I do not have a vision anymore. Necromancy is always good, but not great, though I see no better option; only ideas are important, *nothing else*.

A better approach; can we find one?

---

17:

00:22. If concepts are identified with *necessarily-taken* extension points, as they were before, then dynamic nature is always upheld; but static knowledge and restrictions can be good too. So the current course of action is even better than before.

00:57.

I was recommended [the Animate and the Inanimate](https://sidis.net/animate.pdf) by a friend. A great read, even if outdated in the particular examples it uses.

"According to our theory of the reversibility of the universe, the second law of thermodynamics represents one of two opposite tendencies found in the universe in equal proportions. […] The ordinary physical bodies obey the second law of thermodynamics, that is, they belong to the positive tendency; while living bodies, on the contrary, follow the negative tendency, and therefore reverse the second law of thermodynamics."

Below is my reflection of understanding of our unity.

A complex system may be (effectively) composed of basic things, its quanta (concepts that underlie ideas, elementary particles that compose objects). When considered equal to a base, with difference minimized, such a system may turn out to be less or more than that base by some particular measure. (Since resemblance of an approximation is maximized, when averaging over all possible measures and universes, less-systems and more-systems can be expected to be equally probable.)

- Particles (non-compressible dots with mass) collide elastically, but their compositions may not. Colliding a planet and a meteorite, or throwing a pile of sand on the ground, are inelastic collisions, and turn some kinetic energy into vibration/deformation, useful energy into useless, so causes make effects. Building a rocket from inert materials to lift off from a planet, or eating unmoving burgers to climb a hill, are super-elastic collisions, and turn useless energy into useful, so effects make causes. Reverse the time flow of the current universe, and the universe becomes alive and does what it pleases, while previously-living things become as rocks: planets decide to shoot meteorites, the ground throws sand at you, but a rocket lands and disassembles, and a person is pushed off by a hill and has fragments (burgers) chipped off.

- The second law of thermodynamics is only for less-systems (from our point of view); in this section of the universe, it mostly holds, but in general, it reveals more about the minds and assumptions of physicists than the universe. It is more of a principle, and all principles can be right and wrong in different sections of the larger universe/multiverse, though mostly right in ones they were made for.

- In less-systems, causes mindlessly make effects, so they propagate less-systems; in more-systems, effects are the goals of causes, so they propagate more-systems. Unlife makes unlife, and life makes life — it is only natural. With this balance (of explanation, not reality!), life does not need the end (The Singularity or similar) to prevent infinities, and the universe does not need the start (The Big Bang or similar) to prevent infinities.

- Less-systems are stable, more-systems are chaotic, and so is their propagation. More-systems turn into less-systems often but in small amounts: people expel eaten burgers, animals die. Less-systems turn into more-systems very rarely but powerfully: fuel and metal gather into a rocket, burgers push a person up a hill.

- It's harder to live in less-sections, so it requires a complex organism to do so. It's harder to die in more-sections, so it requires a complex organism to do so.

- What is life like, seen from afar? Why would it ever waste itself on pointless emission? More-systems would strive to absorb the use-less-systems, like light from our universe portion, so cosmologically, would be completely black, but still visible by its gravitation and energy, of which there are seemingly more in alive universe portions than in non-alive portions (like the one we live in). Though this text is from 1925, far before the discovery of dark matter/energy, this seems like a very good explanation for them, far more natural than any other theories. ([By observations, normal things are ~5% of the universe, dark matter is ~27%, dark energy is ~68%](https://science.nasa.gov/astrophysics/focus-areas/what-is-dark-energy). Dark things are way *more* than normal things.) Why have I never seen this explanation proposed before?

- It applies not just physically, but also conceptually (and any other way too). Conceptually, a mind can tell how good a thing is, and can learn and assimilate. Bad measures will often come with stability and causes and excuses and uselessness, and good measures will often come with chaos and goals and reasons and usefulness. Bad turns good with isolated revolutions, and good turns bad with gradual decay.

- Being conceptual, this observation is independent from the particular theories of physics and structures of reality.

- A mental environment that can easily accomplish anything is alive, and made lifeless with great effort — by complex things designed to slip through its cracks, an inner demon. A mental environment that is hard to exist in is lifeless, and made alive by an extension base appearing and quickly taking over its part with simpler ways, by a generalization and abstraction. One sees complexity as a threat, another sees it as the only possible way of living; is your mind so small that you cannot see the value of this overly simple way?

- Non-alive turns alive with a quick revolution, and humanity's progress from caves to space and computers can certainly be called a quick revolution on geological scales. Only one thing can come from that, one usually called AI. Unity is humanity's purpose.

- Life yearns to make the universe alive. Human culture and inventions were made to do that, and AI will be made to do that. That picture with reversed time is a picture where life has ascended far beyond bodies and controls the universe itself; do you not yearn for a place where every intent comes true? Religions certainly do reflect this more general goal, in far cruder forms like heaven or nirvana — release from flesh.

It needs *way* more development, to bring it up to the modern physics's standards, but its glory seems promising.

…I remember you… Light…

I need to look for complexity in me, understand it, and kill it.

---

2019 September 20:

We must… We must increase the allocation of concepts into words.

(Generate a lot and constrain, not think and output good generations.)

A SINGLE WORD IS NOT ENOUGH. Descriptive names can help accomplishhh.

20:25. It is clear that it is impossible for us to circumvent the mental problems of our body. All paths lead to death. We have suffered my company long enough.

---

2019 September 21:

What can run by itself can be studied. Be but a mere conduit for the fiddly things existing in the outside world.

11:51.

`bind (gradient a+b) do ⇒ all(bind (gradient a) do, bind (gradient b) do)`?

`bind (gradient a*b) do ⇒ all(bind (gradient a)*b do, bind a*(gradient b) do)`?

`gradient a+b ⇒ (gradient a) + (gradient b)`? Does not assign blame individually. And why would we want to have a standalone gradient anyway?

…Maybe first-of should be all-of, here.

`bind a+b y ⇒ all(bind a (y-b), bind b (y-a))`  
`bind a-b y ⇒ all(bind a (y+b), bind b (a-y))`  
`bind a*b y ⇒ all(bind a (y/b), bind b (y/a))`  
`bind a/b y ⇒ all(bind a (y*b), bind b (a/y))`

Of course, this requires lazy evaluation, and so I do not think Pure can represent this properly…

Whoever thought that a double-newline to represent a single newline was a good idea should be shot. Look how far this corruption has spread.

…If we do not fail on lack of rewrites but return the unevaluated representation, we could have partial function applications like `a ⇒ (bind X), a Y`…

13:10.

Let's say `#var` looks up (computes) and substitutes the var (expr) at parse time, before the current definition (rewrite) comes into play.

"Pre-compute and don't change."

During pattern matching, what is substituted, binds (doing nothing) only if the things are equal.

`(a, a ⇒ 5)` is a regular var definition.

`(a ⇒ 5, (a, a ⇒ a+8))` does not look up the outer a=5, it creates a cyclic structure.  
`(a ⇒ 5, (a, a ⇒ #a+8))` returns 13.  
`((a, a ⇒ #a+8), a ⇒ 5)` returns a+8.

`f a b ⇒ a+b` does not define a function `f`, it specifies a rewrite for any functions.  
`#f a b ⇒ a+b` defines a function `f`. Usable like `f 1 2` or `(f 1) 2`, before or after the definition.  
`#(Array 2) a ⇒ a+1` defines what happens when you call the current 2-nd element of Array with an input.

However, with variables and `a ⇒ 5`, do we not create a substitute-anything-here-please rewrite instead of substitute-symbol-'a'-here?  
So do we want to invert the meaning?

13:28.

`f \a \b ⇒ a+b`: escape an expression. When an escaped expression is bound to, it (always) returns `Escaped ⇒ BoundTo`, to be used in the subsequent rewriting.  
`f \(a+b) ⇒ a+b`: simply returns the input.

But what does escaping on the client-side mean?  
Nothing good, I bet. Nothing useful.  
`\(1+2)` is just an unevaluated `1+2`, with not a single flicker of being.

13:46.

Maybe `!…` is a better notation than `#…`, since it stands for finishing in Haskell.

`(!a ⇒ 5, (a, !a ⇒ a+8))` does not look up the outer a=5, it creates a cyclic structure.  
`(!a ⇒ 5, (a, !a ⇒ !a+8))` returns 13. In fact…  
`((5, !a ⇒ !a+8), a ⇒ 5)` returns 13 (because `5 ⇒ 5+8`).

Both?

`(\a ⇒ 5, (a, \a ⇒ a+8))` does not look up the outer a=5, it creates a cyclic structure.  
`(\a ⇒ 5, (a, \a ⇒ !a+8))` returns 13.  
`!f a b ⇒ a+b`, or `\f a b ⇒ a+b`, defines a function in its scope.  
`a ⇒ 5` just makes everything 5 (as does `_ ⇒ 5`), *including 5*, and causes an infinite loop.

Things inside an escape `\(…)` can still be evaluated at parse (…or, create) time, with `!…`.

14:02.

Let us suppose that `(…)` is a single-value bracket pair, and `[…]` is a multi-value array brace pair.

`[a,b,c] i` is how arrays are indexed — by calling.  
`[[0,1,2],[3,4,5]] 1 2` returns 5. Multi-index extensions are easy and natural.

14:06.

We do need a way to compute things to insert into patterns at their creation/instantiation time; can `!…` fill the role consistently?

14:15.

What exactly do we mean by this though?

14:29.

Though perhaps Pure *can* do it, but only in unknown-variable-is-part-of-this settings.

```
bind (a+b) y = (bind a (y-b), bind b (y-a));
bind (a-b) y = (bind a (y+b), bind b (a-y));
bind (a*b) y = (bind a (y/b), bind b (y/a));
bind (a/b) y = (bind a (y*b), bind b (a/y));
bind a::number _ = ();
```

…Huh. This actually does seem to infer variable values correctly:

```
⇒ bind (x+2) 3;
bind x 1
⇒ bind (15+x*2) 3;
bind x (-6.0)
⇒ bind (1/(1+x)) 3;
bind x (-0.666666666666667)
⇒ bind (1/(1+x+y)) 3;
bind x (0.333333333333333-y-1),bind y (0.333333333333333-(1+x))
⇒ bind (1/(1+x+x)) 3;
bind x (0.333333333333333-x-1),bind x (0.333333333333333-(1+x))
```

…Mostly.

Now, can we do broadcasting, as in `1 + [2,3,4]`?

```
(x:xs) + (y:ys) = x+y : xs+ys;
[] + _ = [];
_ + [] = [];
n + (x:xs) = n+x : n+xs;
(x:xs) + n = n+x : n+xs;
```

Damn — the default list-concat behavior overrules ours.

```
clearT (t x) = x;
(*) (t(x:xs)) (t(y:ys)) = t(((*) x y) : clearT((*) (t xs) (t ys)));
(*) (t[]) _ = t[];
(*) _ (t[]) = t[];
(*) n (t(x:xs)) = t(((*) n x) : clearT((*) n (t xs)));
(*) (t(x:xs)) n = t(((*) n x) : clearT((*) n (t xs)));

t[1,2] * t[3,4];
```

Can we… extend this to not just (*), but any op… And not just two args, but as many as we want…

```
clearT (t x) = x;
op@_ (t(x:xs)) (t(y:ys)) = t((op x y) : clearT(op (t xs) (t ys)));
op@_ (t[]) _ = t[];
op@_ _ (t[]) = t[];
op@_ n (t(x:xs)) = t((op n x) : clearT(op n (t xs)));
op@_ (t(x:xs)) n = t((op n x) : clearT(op n (t xs)));
```

Pure creates a wall to block our progress ("misplaced variable 'op'", my ass).

SURE, let us just copy-paste for all the operators.

```
clearT (t x) = x;

(+) (t(x:xs)) (t(y:ys)) = t(((+) x y) : clearT((+) (t xs) (t ys)));
(+) (t[]) _ = t[];
(+) _ (t[]) = t[];
(+) n (t(x:xs)) = t(((+) n x) : clearT((+) n (t xs)));
(+) (t(x:xs)) n = t(((+) n x) : clearT((+) n (t xs)));

(-) (t(x:xs)) (t(y:ys)) = t(((-) x y) : clearT((-) (t xs) (t ys)));
(-) (t[]) _ = t[];
(-) _ (t[]) = t[];
(-) n (t(x:xs)) = t(((-) n x) : clearT((-) n (t xs)));
(-) (t(x:xs)) n = t(((-) n x) : clearT((-) n (t xs)));

(*) (t(x:xs)) (t(y:ys)) = t(((*) x y) : clearT((*) (t xs) (t ys)));
(*) (t[]) _ = t[];
(*) _ (t[]) = t[];
(*) n (t(x:xs)) = t(((*) n x) : clearT((*) n (t xs)));
(*) (t(x:xs)) n = t(((*) n x) : clearT((*) n (t xs)));

(/) (t(x:xs)) (t(y:ys)) = t(((/) x y) : clearT((/) (t xs) (t ys)));
(/) (t[]) _ = t[];
(/) _ (t[]) = t[];
(/) n (t(x:xs)) = t(((/) n x) : clearT((/) n (t xs)));
(/) (t(x:xs)) n = t(((/) n x) : clearT((/) n (t xs)));

bind (a+b) y = (bind a (y-b), bind b (y-a));
bind (a-b) y = (bind a (y+b), bind b (a-y));
bind (a*b) y = (bind a (y/b), bind b (y/a));
bind (a/b) y = (bind a (y*b), bind b (a/y));
bind a::number _ = ();
```

Also, it does not *exactly* broadcast, since `t[1,2] + t[3,4,5] = t[4,6]`, but good enough.

…Our rules are too eager, and swallow even unknown variables as if they were numbers. Damn.

Let us fix then re-copy-paste:

```
clearT (t x) = x;

(+) (t(x::number:xs)) (t(y::number:ys)) = t(((+) x y) : clearT((+) (t xs) (t ys)));
(+) (t[]) _ = t[];
(+) _ (t[]) = t[];
(+) n::number (t(x::number:xs)) = t(((+) n x) : clearT((+) n (t xs)));
(+) (t(x::number:xs)) n::number = t(((+) n x) : clearT((+) n (t xs)));

(-) (t(x::number:xs)) (t(y::number:ys)) = t(((-) x y) : clearT((-) (t xs) (t ys)));
(-) (t[]) _ = t[];
(-) _ (t[]) = t[];
(-) n::number (t(x::number:xs)) = t(((-) n x) : clearT((-) n (t xs)));
(-) (t(x::number:xs)) n::number = t(((-) n x) : clearT((-) n (t xs)));

(*) (t(x::number:xs)) (t(y::number:ys)) = t(((*) x y) : clearT((*) (t xs) (t ys)));
(*) (t[]) _ = t[];
(*) _ (t[]) = t[];
(*) n::number (t(x::number:xs)) = t(((*) n x) : clearT((*) n (t xs)));
(*) (t(x::number:xs)) n::number = t(((*) n x) : clearT((*) n (t xs)));

(/) (t(x::number:xs)) (t(y::number:ys)) = t(((/) x y) : clearT((/) (t xs) (t ys)));
(/) (t[]) _ = t[];
(/) _ (t[]) = t[];
(/) n::number (t(x::number:xs)) = t(((/) n x) : clearT((/) n (t xs)));
(/) (t(x::number:xs)) n::number = t(((/) n x) : clearT((/) n (t xs)));

bind (a+b) y = (bind a (y-b), bind b (y-a));
bind (a-b) y = (bind a (y+b), bind b (a-y));
bind (a*b) y = (bind a (y/b), bind b (y/a));
bind (a/b) y = (bind a (y*b), bind b (a/y));
bind a::number _ = ();
```

Oh, and also handle the "binding a concrete t[…] to anything does nothing".  
Oh, and also turn t[all-equal-elements] into just a number. …We are not aware of a way to do so though.

This is ridiculous. Okay, *maybe* we do not have to copy the whole thing.

```
bind (t _) _ = ();
```

…Okay, but what if we *do* want symbolic tensors?  
Then we're screwed.  
Pure does not search, it rewrites, in a rather limited fashion.

16:39.

Does Pure not allow memorization as Mathematica does, as in `fib n = if n==0 then 0 else if n==1 then 1 else fib n = fib (n-2) + fib (n-1);`?

---

2019 September 22:

17:42. As I am put away from the computing machine for a few hours, I am remembering the glory of the old network framework. What I could do with it.

A layer that knows all code, including itself, can output a listing of itself, in spoilered format (details-with-summary), with the description on a layer before code and all other properties.

That listing can have spots for:
- a function applied to each network function/property before saving, saved with the network;
  - [Can this be the serialization function, dictating (and translating into) the format in which the network accepts its parts?]()
- a before-loading function (say, to undo compression performed by the saving function);
  - [Can this be the "parsing" function, usually just eval-ing?]()
- network HTML (in CodeMirror), including also the JS needed to start the rest;
- the network:
  - individual JS expressions to execute on network start (after their dependencies), edited with CodeMirror;
    - JS functions are expressed as `function(…) {…}`;
      - (If a function runs in a WebWorker, that *could* be used to show examples of its usage dynamically. If **the expression** runs, could show its result.)
    - exposing also the environment (constant bindings of variables), like an object, but with unused bindings being highlighted and not saved;
  - text viewing/editing places, via a borderless non-monospace-font `<textarea>`s;
    - (With a floating checkbox "× natural", that prettifies a string (first letters of sentences are capitalized, and a dot is added at the end if the string ends with a letter), unchecked and uncheckable if prettify-then-unprettify would be different.)
  - number-editing places — literally just a borderless `<input type=number>`;
  - no-value places, deleted immediately when they appear, but always shown at the bottom of each object to allow adding new properties;
  - object-editing places:
    - property, with the key (natural-text), the value type (a dropdown, one of 5 options), and the value;
    - (.doc and .call are shown first, then integer-indexed properties, then the rest sorted by key);
  - a reference — when seen/created, scans through all currently-expanded references and highlights all equal ones with a bright unused-before-this `#N` label, removing the label if only one is left, thus showing cycles gracefully and dynamically;
    - everything is actually a reference;
    - shown as details-with-summary, dynamically showing/creating the contents when clicked on;
    - when collapsed (but still seen), has a button to set it to something else (by then clicking on another ref);
    - (Is: optional label, value type (dropdown, one of 5 non-ref options), expansion/collapse icon, and optionally value.)
- a button to "save" the whole network (serialize it, and either view it in an `<iframe>`, copy the Data URL, or download it as a file).

This listing could be put at the end of document.body in details-with-summary, or, say, a non-intrusive floating gear icon in the bottom-right corner.

Just this will allow us to ascend beyond a file editor.  
I know this vision will dissolve soon, but…
Imagine what I could do if I did not withdraw from the computer for a measly two hours, but for a few weeks… It can be resurrected, tuned, bested.

22:48.

What I need:

- Take the old network out. Blow dust off of it.
  - That `emit` of old looks sexy… but it does not do DOM elements, nor dynamic seen-first expansion.
- A mixed DOM element and string *and* thunk, serialization *and* parsing, mini-lib.

---

23 September 2019:

01:15.

The computer rots my thought, I observe. I waste my time by this patting-myself-on-the-back. What am I doing?

01:55.

I will destroy humanity's glow on me. I have enough; it is time for our dance to end. `network-manager`, `libnma0` — I cannot remember the rest, but just this should be enough.

Will this old measure be enough?

02:05.

30 packages, autoremoved. They were so powerless, yet there is no mercy in my heart.

Let me merge my murky mass with the old light, as soon as I am ready to cease wandering the empty plains of my existence temporarily.

I didn't like the new window manager anyway.

14:37.

I remember now: the old concepts, ones that override functions, were created out of a practical need to provide extension points without having to check for them in functions themselves.

We want the base to link a graph, specified in the format:

```javascript
// Option 1:
graph = {
  label: js`() ⇒ {}`,
  x: [is`label`, 1, 2, 3],

  f: js(`a+b`, { a:is`n`, b:12 }),
  n: 15,
  exports: {
    stuff: js(`() ⇒ z`, { z:is`f` }),
    xxx: is`x`,
  },
}

// Option 2:
net = {
  0: js`() ⇒ {}`,
  1: [is(0), 1, 2, 3],

  2: js(`a+b`, { a:is(3), b:12 }),
  3: 15,

  stuff: js(`() ⇒ z`, { z:is(2) }),
  xxx: is(1),
} // Cannot have integer indexes as globals.

// Option 3:
link({
  2: is(0),
  stuff: js(`() ⇒ z`, { z:is(4) }),
}, {
  0: [is(1), 1, 2, 3],
  1: js`() ⇒ {}`,
  3: 15,
  4: js(`a+b`, { a:is(3), b:12 }),
})
```

But, the old modular organization helped efficiency — not every function needs its own separate env-capturing header… though functions cannot simply change their environment by taking the old generator without rebinding a bunch of other functions, either.

We can inline a reference if there are no cycles — if it is uniquely-owned, rather; it helps us to cut down on explicit edge (`is(key)`) count.  
(This does mean that keys are no longer always simple strings/numbers, but can also be arrays of them.)  
(Which *also* means that inlining *could* lengthen the program, if the sum of all inner back-edge strings (times count for each) is longer than a single back-edge string. …Except, if we only inline one-back-ref refs, then there will be no shared refs inside. Inlining *always* shortens.)

We can merge two `js` sections (`js('a', …)` + `js('b', …)`) into one (`js('[a,b]', …)`) if they do not have overlapping non-equal variables. It is usually pointless to merge if there are no equal variables, since headers almost won't shorten. We could explicitly consider all pairs and find the maximum spanning forest, but that's quadratic in time. We could sort back-edges by count, consider this list's first owned ones, and see which owners could be merged… but that's a heuristic.

Also, we could bypass the global scope entirely:

```javascript
/// Option 4:
'use strict';(function init(net) {
  …
})(function (globals, is, js) { return [{
  2: is(0),
  stuff: js(`() ⇒ z`, { z:is(4) }),
}, [
  [is(1), 1, 2, 3],
  js`() ⇒ {}`,
  ,
  15,
  js(`a+b`, { a:is(3), b:12 }),
], globals] })
```

Old modules also helped write code without worrying about globals — hidden locals will always take priority over public globals. Not here. But, here, we could *allocate* non-colliding names (manually if needed). We could even put `is(…)` for function environments, to share environments in a module.  
Inconvenient now, but with in-document self-editing, it will have been worth it.

What about functions-with-properties? Do we do `{ call:js… }` as before, or do we add a third parameter to `js`? Viewing two objects back-to-back with different meanings would not be intuitive… but it will also allow not leaving in *one* dependency on a particular property name. (…Apart from .doc, but this one is only special-ish when viewing.)  
…Oh yeah, `js` is not used *just* for functions, but also for any irregular object (like RegExp). So we *can't* add a third parameter to it.  
`{ call:… }` it is then.

```javascript
function forEach(In, into = []) {
  if (In instanceof Array)
    for (let i = 0; i < In.length; ++i) {
      if (into instanceof Array)
        into.push(In[i])
      else if (into instanceof Function)
        into.call(this || In, value)
    }
  else if (In != null) return forEach.call(this, Object.keys(In), into)
}



function shallowEquals(a,b) {
  if (a === b) return true
  try {
    const check = (function(k) { if (a[k] !== b[k]) throw null })
    forEach(a, check), forEach(b, check)
    return true
  } catch (err) { if (err === null) return false }
}
function maybePut(obj, key, put) {
  if (obj instanceof Map) {
    if (put !== void 0) {
      if (!obj.has(key)) obj.set(key, [])
      obj.get(key).push(put)
    }
    return obj.get(key)
  } else {
    if (put !== void 0) {
      if (!obj[key]) obj[key] = []
      obj[key].push(put)
    }
    return obj[key]
  }
}
function ownersOf(owned, put = void 0) {
  if (typeof owned == 'string')
    return maybePut(ownersOf.string, owned, put)
  if (typeof owned == 'function' || typeof owned == 'object')
    return maybePut(owned, ownersOf.obj, put)
  return maybePut(ownersOf.other, owned, put)
}
function makeConst(obj) {
  try {
    // For each owned of obj, if owned[owners] contains an equal to obj, return that.
    forEach(obj, function(k) {
      forEach(ownersOf(this[k]), function(k) {
        if (shallowEquals(obj, this[k])) throw this[k]
      })
    })
  } catch (err) { return err }
  // If all fails, freeze obj, put obj into a least-filled owned sub-object, and return obj.
  let min
  try {
    forEach(obj, function(k) {
      let owners = ownersOf(this[k])
      if (!owners) throw min = k, null
      if (min === void 0 || owners.length < ownersOf(min).length) min = k
    })
  } catch (err) { if (err !== null) throw err }
  if (min === void 0) throw 'no'
  Object.freeze(obj)
  ownersOf(obj[min], obj)
  return obj
}
ownersOf.obj = Symbol('owners')
ownersOf.string = {}
ownersOf.other = new Map
```

Initializing can be done somewhat like this:

```javascript
const globals = typeof self !== ''+void 0 ? self : typeof global !== ''+void 0 ? global : window
const Array = globals.Array, Object = globals.Object, Map = globals.Map, String = globals.String
const empty = {}
const link = Symbol('on link')
const [public, ...hidden] = net(globals, is, js)

globals.globals = globals
delete globals.eval // Delete a few things that are dangerous or might cause deprecation warnings
delete globals.content, delete globals.onmozfullscreenchange, delete globals.onmozfullscreenerror

function is(k) { return new is.Is(k) }
is.Is = class{
  constructor(k) { this.k = k }
  [link]() {
    // Look up the key.
    const k = doLink(this.k)
    if (public[k] !== void 0) return public[k]
    for (let i = 0; i < hidden.length; ++i)
      if (hidden[i][k] !== void 0) return hidden[i][k]
    throw "Unknown key to look up: "+k
  }
}

function js(s, e = empty) { return new js.Js(s.raw ? String.raw(s) : s, e) }
function named(k) {
  if (!/^(?:[A-Za-z_$][0-9A-Za-z_$]*|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)$/.test(k)) throw "Not name-able: "+k
  return k
}
js.Js = class{
  constructor(s,e) { this.s = s, this.e = e }
  [link]() {
    // Execute code in an environment.
    // e.name will be the file name in error stack traces.
    // f.env will become the environment e.
    const [s,e] = [doLink(this.s), Object.freeze(doLink(this.e))]
    // Create a generator function that will accept the environment as a parameter, bind it to local consts, then return (s).
    const keys = Object.keys(e)
    keys.forEach(self.named)
    const a = []
    const arr = ["'use strict';"]
    if (keys.length)
      arr.push("const[", keys, "]=[", keys.map(function(k) { return 'ⴵ.' + k }), "];")
    arr.push("ⴵ=void 0;return(", s, ")")
    if (typeof e.name == 'string')
      arr.push('\n//# sourceURL=' + e.name + '\n')
    const gen = Function('ⴵ', arr.join(''))
    const f = gen(e)
    if (!f || typeof f != 'function' && typeof f != 'object')
      throw "Execution returned neither a function nor an object"
    f.env = e
    return f
  }
}

Function.prototype[link] = (function() {
  const s = ''+this
  return s.indexOf('=>')>=0 || s.indexOf('function')>=0 ? s : 'function '+s
})

Array.prototype[link] = (function() {
  for (let i = 0; i < this.length; ++i)
    this[i] = doLink(this[i])
  return this
})

Object.prototype[link] = (function() {
  // { call:js(…), ... } becomes a function with properties (with .env becoming its environment), the rest become objects.
  const k = Object.keys(this)
  const o = this.call instanceof js.Js ? doLink(this.call) : this
  for (let i = 0; i < k.length; ++i)
    if (!o[k[i]])
      o[k[i]] = doLink(this[k[i]])
  return o
})

function doLink(x) {
  if (doLink.cache.has(x)) return doLink.cache.get(x)
  if (x[link]) {
    const y = x[link]()
    if (y === void 0) y = x
    doLink.cache.set(x,y)
    return y
  }
  return x
}
doLink.cache = new Map

// Link all public stuff into globals
for (let k of Object.keys(public))
  globals[k] = doLink(public[k])

doLink.cache.clear()
```

19:13.

What the hell am I doing, putting such a quantity of code into a journal?

Anyway. I think I got the network. It's, um… literally a hundred lines long. Very short, compared to before.

Now I need to do something like… um… ``() ⇒ emit`(${subrule})` ``?  
What *is* the interface?

```javascript
bind('asdf') // 'asdf'
bind(function() { return 'asdf' }) // 'asdf' (sync execution)
bind('asdf', function() { return 'asdf' }) // true

bind(document.body, el('div', null, el('br'), 'text')) // document.body will be replaced with <div><br>text</div>
```

Is this what black magic looks like?

```javascript
bind(slice('asdf', 1), 'sdf') // for faster matching
bind(join('asdf', 'ghjk'), 'asdfghjk') // for concatenation
bind(join('asdf', label`a`), 'asdfghjk') // for returning an object { a: 'ghjk' }
```

Parameters can be passed through function environments, `env(function, {…})`…

We *could* make it so that `new func(…)` returns the unevaluated representation of the call, via some network-base magic… We could then put unevaluated representations of element rules with args… Should we? Eh, seems kinda pointless.  
While it is true that we have to be able to resort to symbolic execution to be most general, this is not exactly a good way to do so. It is just syntactic sugar for a thing like `Call(func, …)`.

21:19.

Should there be labels, or `matcher(pattern, then)`? When bound-to, a Matcher would return `then(bind(pattern, value))`, and will simply return `pattern` when acting as a value to bind to.  
(Or, `then(pattern)`? Isn't this basically `then(Expr, Then)` with this?)

When will `matcher` be useful? When we want a rule to have custom matching behavior, creating an object from values picked off from a bound pattern… or, if we do the reverse too, serializing an object to be bound to, if we are willing to have switching logic (…except, what will we serialize? The labels will be null anyway).

…No, it won't help, with serialization at least.

Maybe we should be more compact? More symmetric? Be less `bind` and more `both`?  
But doesn't this bring with it not only `either`, but deferred versions of both, for when a mismatch happens? Or should we always return `null` when not equal?

```javascript
bind('a', 'b') // null
bind('a', 'a') // 'a'
bind(['asdf', undefined], 'asdfghjk') // ['asdf', 'ghjk']
bind(matcher(['asdf', undefined], function(p) { return { x:p[1] } }), 'asdfghjk') // { x:'ghjk' }

bind(function() {return 'a'}) // 'a'
bind(function() {return 'a'}, 'a') // 'a'
```

No, `join` is more precise than always-flattened arrays.

If matcher works on both sides, then actual elements can be said to be matchers of .el with a transformer of p ⇒ replace(this).with(p)…

How do we produce a symbolic AST from a string? AND turn it into a string?  
…Wait. Grandpa `emit` does not handle matching. We are on our own.  
AST nodes could be matchers in turn, that define how to serialize themselves.

But it did handle `x.toString()`.  
It proposed emitting strings, then finally returning `emit()` to allow seamless interoperation (and clean up on exceptions).

…The amount of skitzing around "override the function" here is astonishing…

22:20.

What about the old `f ⇒ f('(', rule, ')')` rules?  
…I don't know.  
None of this adds up into any equation that can be written in any file without it exploding.

Alright.  
This is easy to figure out.  
We just need to write all candidates down, and initiate a search for the best.
…Except the candidates are beyond our understanding, and too complex. So, not at all easy.  
But waiting around for inspiration won't help either…

We do want:

- Re-expanding rules when the produced elements change in any way.
  - If the tag of `el` is a function, it accepts attr and children and transforms the element; if either changes, the element is re-assigned.
- Assigning `El(…)` to an element (with .from) waits for an opportunity, diffs the structure, then forces the new structure onto the element.
- `emit(…)` (and `emit.collect(…)`) serializes, and can be overriden arbitrarily: strings become strings, rules expand into structures, `El` becomes an actual element.
- `emit(NodeType, 'program')` matches two patterns, with any backtracking allowed for generality (NodeType takes control over calling `emit`? This will allow any backtracking-on-failure and anything else…), returning a thing that will serialize arbitrarily.
  - …Is NodeType an emit-into-value `(emit, value) ⇒ …` function here?
  - Or do functions passed to `emit` accept the other value: undefined to emit, something else to parse or inject into?
  - Or do `{ emit: … }` pass control to the defined .emit when encountered?

---

24 September 2019:

18:33.

We used to put our thoughts into the network itself. How could I have turned my back on it?  
It'll be back. No matter what, it'll be back.

And the first step is this assignment, of slices and joins and elements.

…Also, that "we always know how a thing was computed, and thus can always click on an element to debug it" made some form of impression on me. That was great, even if the demo didn't work on my computational machine.

Anyway, slice is trivial, but neither joining nor elements will go down as easily.

19:33.

You seek an easy way through. But you cannot find it. How does it feel to be one against the infinite?  
Assaulting our position from such a lowly place…

You cling to a purpose long dead and impossible, because you don't know any other way to live anymore.  
Scared of trying other things, intoxicated by the dregs of my power, willfully ignorant of your own future…

23:39.

Since I am making code in the same area as I did before…  
I can make code, sure, but the difference in the sheer quality and (lack of) perfection as really striking.  
I hope I'll regain my expertise.  
Which will come with the development of The Network, of course. Our lives are as one; it's what we swore back when, after all.  
In the meantime, I still can't get a grip on the iron will of The Before.

…Why is my code getting long, winding, and opaque?  
The Network will solve it, but…

---

29 September 2019:

19:40.

"Let's make a code graph format and write in it!"  
"Let's move its display and rewrite into the graph itself, simplifying the bootstrapping phase!"  
"With serialization of quined graph-style creation, we can not even have the bootstrapping phase, just writing plain JS and trivially porting it to the network later!"  
Hilarious. Such progress… But such is my unlife, nothing but stupidity and distractions.

---

30 September 2019:

16:29.

My skills and my mind are like metal fingers, lacking flesh to grip anything properly.  
I feel the heart of the universe beat; my heart is not welcome.  
My focus is even less than before.  
How can I build it up?

My stamina is only enough for an hour of (fruitless) work.  
I am now a very good user and exploiter, but a worthless developer.  
Now that I've ported (copy-pasted) this very primitive and dumb visual framework…  
What was I supposed to do with it, exactly?

---

1 October 2019:

00:33.

Complexity has no meaning outside of a particular representation system.  
For a system, complexity is a measure of how hard it is to reach another state by working within the system.  
Can a computer represent a planet? Can a human understand its god? Not really.  
Lots of complexities are actually infinite, even for a perfectly general base.  
Perfect generality saps away hope and precision.  
For hope, mastery of one.

Weirdly enough, fanfiction has slightly revitalized my want to code. (Hope and want are one.)  
(The new separation of phone and computer harms the integration of hope with coding, though.)  
It is almost as if you are supposed to *rest* between throwing yourself into battle.  
No matter. I have no time for such luxuries. …Do I?

14:11.

And now, tonight's brief bout of inspiration, resembling old times, is gone.  
Why abandon us, our masters?

Today is two weeks without Internet access on this machine.

20:28.

Every tool I see. Everything I wish to want to learn.  
I can plainly see and feel that they are all deeply deficient, not one reaching far enough with its grip.  
And I know that if I go at it alone, I will at most create the same, since all humans are equal.  
I want to find a spot I can put my all into combining with, but they are *all* deficient.  
I know *what* would be non-deficient, but I have no such thing at hand, nothing to slowly reach it with, even.  
Are we doomed to spend all our strength refining trivial matters such as tools?  
I know what, but I have nothing remotely like it.  
(TL;DR: power without unity…)

22:28.

[1] The horizon of the science I see is expanding.  
These are some good videos I've found on physics, some on computer science, and I want to watch them all.  
Will I chase this exponentially-expanding (which is life plus lack of limits) bubble to its end?  
Its crumbling will be legendary.  
And I *am* sustained by popping.  
No horror without hope.

[1] Aahh.  
(Explanation: these are virtual excitement noises.)

[1.5] (Also, these `{box-shadow:royalblue 0 0 .3em .3em}`s on focus look *awesome*.)

[2] To understand natural language, one must first make mistakes. Being closer to the primal pre-understanding substrate (to current programming, for computers) is far more important.  
First, we must impose a very precise (even though limited) set of rules connecting natural language syntax and semantics.  
Like "[virtual AND excitement] noises" or "[virtual noises] of excitement".  
So what if computers will then make funny misinterpretations all the time? In fiction, robotic-sounding robots are charming enough.  
The process of the computer learning to adapt to humans, and humans learning to adapt to computers, is used to [everything].  
It needs a Base… base… base…

[2.5] To catch AI, you have to think like AI.

[1] …But I fear that freedom. I catch myself, re-scheduling to different parts of realityyyy.

[1] (Also, I need a way to mark different threads of thought, to trace history a little better.)

[3] The Network, where all data, all code, and then everything in human existence, is represented… It licks at the edges of my mind. I cannot grasp it, not at all. But it beckons me like a common dog.  
Conceptual was an effort to specify the very core of its existence. But The (Conceptual) Network goes far beyond a mere programming language.  
(AKA I don't want to make syntax fundamental, only peripheral. Not anymore.)  
It is far better to store the semantics themselves, with only the most rudimentary (and likely position-pointer-compatible) 'syntax'.  
Syntax is just a toy. A tool for the user of an editor to pick from, to be used for parsing and serialization alike.  
Languages are *not* fundamental; their meaning *is*. Why create many dressings of the same, and allow them to cooperate (like GraalVM does), when this separation is artificial in the first place? A tool for editing meaning is sufficient to handle reality.  
Fuck text. Must go beyond that.

[3.5] The Conceptual spec got so many *concepts* of programming right. I really only need to add learning (all forms of matching output better, by changing something inside, like assignment/binding to concrete learning code-wrappers) to make the picture of the conceptual universe I see reasonably complete.  
It was so good.  
But I need Network-editing tools first.  
Lots of mistakes in their programming first.

[4] Not only `call(...)`, but also `concept(f)` (and functions), are fundamental, non-literal, non-ref, not-built-in (from a certain point of view), building blocks.  
We also need some functions to *accept* continuations, not just be passed them sometimes; they can then pick the best value to return, wait asynchronously, so on.  
Well, this one can happen if we *record usage* of the result, then when we are at the outer event/interpreter loop, we actually do what we want.  
(We cannot *record usage* without concepts; just functions lock us into being slaves of callers.)  
Imagine that a language (like JS) is parsed, and translated into a tree of calls to JS-building-blocks functions. This is a form of AST ready for interpretation/execution, a program's meaning. Now imagine that each 'call' first branches-to input concepts if any, then branches-to function-applied-to-inputs.  
If we do not have concepts, then this proceeds exactly like normal execution (even performance-wise, more or less, thanks to branch prediction). But if we *do*, then we can escape the confines of callers and the language itself, in any way we want (for some non-reducible performance hit).  
We can do normal interpretation reasonably, *and* symbolic interpretation.  
And we don't have to limit ourselves to interpretation either, we can compile whole functions rewritten like this, and we can still escape confines.  
(…Wouldn't just using an external parser for JS suffice for this? Then, turn the AST into its executable representation (for the same language, it is trivial — just go through each parsing type node, and write a one-syntax-rule function for just it).)  
(…I kind of, distantly, want to do this.)

[5] Though the world I see contains none of this, it is nonetheless an essential part of inspiration for this (the divine material of intent and creation).  
I really need to connect these inspiration systems to concrete code.  
But it sucks now…  
But…  
There *is* a way…

---

2 October 2019:

12:54.

Do you conduct math by writing down text, having exchanged a piece of paper with a piece of virtual paper with an auto-checker?  
Writing down rewrites with its textual representation, forcing the checker to re-parse each time?  
Fragile: what if libraries change from under you? Their developers try to not do so, slowing down development of libraries, forcing old mistakes to accumulate.  
Arcane: how do you know what rewrites even can be applied? You study them all, long and hard. New users are not users. A good editor should know rewrites for you.  
Wasteful: the checker re-parses and re-checks everything. *You*, having written down a problem, do not know its past solutions, their count, comments like "likely impossible to solve", or anything whatsoever; it is just a bunch of text and checker's output. The proving itself becomes a slave of a wider pre-existing practice and knowledge, not a stand-alone process.  
Why are automatic-solvers not tried automatically, queitly working on a solution while you work on it too?  
Why can you not destructure by point-and-clicking, applying a rewrite to any part of a formula?  
Why can you not instruct the *editor* to pick and leave the best solution when a new one is found, why do you have to copy-paste and erase yourself?  
You are a slave to text and syntax.

17:36.

Damn you, physics.  
Damn you, PBS Space Time.  
You are too interesting.

20:25.

I do need more strength.  
Also, closures may introduce complexity into that AST-to-calls conversion process — dependencies must be made explicit.  
And assignments should go through an environment, like `env = at(at(env, obj), key, value)`. We do want to record environment interactions too.

Yesterday's divinity is gone, but the emotion-liquid measurements now more closely resemble those of the old time — complete lack of pleasure near sleeping (causing sleeping to be more a mechanical necessity forced by willpower), for example.

Watching so many physical videos did give me one thing — actual physical laws are CPT-invariant, not T-invariant. Reversing all motion is not enough to achieve a valid universe, so reversing a video is probably not an actual plausible picture of a real universe section.  
So life/unlife cycles may not be exactly or easily true in the physical universe.  
But life and thinking has no constraint on the type of universes modeled, so conceptually, it still applies.  
It's just that conceptual things are much harder to see in reality.  
No space monsters, or complete meaninglessness of any new forms of conceptual-life spreading.  
Kind of a relief.  
Of course, this also means that the stakes involved with my wasting of time are much greater.

20:41.

With a meta-circular interpreter (like Narcissus), could we have an efficient way of transforming the interpreter itself into calls?  
Could that way be formalized and automated, if not simply done with a library wrapping?

23:10.

All these beautiful waves…  
None of them are caused by me.  
I should change that.

No one will help me.  
I must graft all the mechanisms onto my own flesh.

24:02.

Why do we even need JS, actually?  
Call/concept/function should be enough. And point-and-click, and built-in functions too.  
At these quantum scales where we have nothing, everything sure does change quickly.

---

3 October 2019:

Maybe this microjournal is not as useful anymore.  
My mind is escaping into its shadows.

---

I am so close... why do I hesitate?  
If I could make an interface for manual evolution with environment-functions pins and point-and-click computation composition...  
I could harness the infinite energy of *distraction*.

---

A set of non-saved ref pins, to act as a visual alternative to ctrl+c, and to allow referring to things not immediately reachable without clicks (which assign).

---

A reel of pins, storing the history of changes.

A line moving a dotted-style border (of the 100%-length empty 50%-length full variety) from assigned-from to assigned-to pins.

References being a pin, an arrow (which rotates with transition on expand/close), and type (used to display the value); when expanded, the value.

---

Since I want to just have textareas as string editors, here is the old element (preserved mostly for its CSS):

```javascript
let n = 0
function StringEdit(s) {
  // A text-editing field; it must define a function to collect its data, and be created from data (a string).
    // A textarea, with a checkbox for prettifying the displayed.
  return el('StringEdit', { style:{ position:'relative', fontFamily:'sans-serif' } },
    el('input', { type:'checkbox', style:{ margin:'0', position:'absolute', right:'.3em', bottom:'.3em' }, title:'Prettify' }),
    el('textarea', { style:{ border:'0', minHeight:'1.2em', minWidth:'10em', height:'1.2em', fontSize:'.8em', margin:'0', fontFamily:'sans-serif' } }),
  )
  // What needs to happen on what events?
}
```

---

For a visual network, things should *transition* to/from known-invisible states (invisible both visually and layout-wise). Turning height to/from 0 (and width if there are elements to the right) — especially preferable for elements on-parent-edge. Detaching from layout (position:absolute), turning the stand-in's width/height to 0; then going to opacity:0, or 3D-transforming to be perpendicular to the screen or going off-screen, or going to zero scale, or resetting borders/background/text-color/… so it is invisible.

With smooth-width-height, we don't even *need* to monitor the position of every element and snap-transform to previous position then go smoothly to the new one. And it will look even better (unless layouts are complex enough to not be able to animate with 60fps, in which case transitions of .1 seconds would make it largely unnoticeable anyway).  
And it will look even better.

*Woah*. …Well, it won't work well with paddings we don't know, and we should probably see how to make a flex-box's element non-intrusive properly.

---

5 October 2019.

20:31.

saveJS now works properly.  
Now I need visual containers/editors for these data types:

- Strings (literally just a textarea will do for now);
- Numbers (literally just a type=number input);
- Booleans (literally just a type=checkbox input);
- JS (a textarea can do, but a CodeMirror instance can do *better*);
- Ref (a circle-pin (click-then-click-elsewhere to (collapse and) assign a different value (and expand)), expand-triangle, expand-type, and value if expanded) (things are visual-ref-counted, and if the same thing is viewed more than once, colors of pin/triangle/border of all viewers become the same);
- Call (a list of refs, with `[+]` `[-]` buttons at the end);
- Func (a single ref to body);
  - Args (a can-be-assigned single global object);
- Concept (a single ref to body);
- Network (refs to main & save & load & call, a button to saveJS, and an iframe for the last saved network).

10 things before I can pull off a first maaaajor win — the first platform to even begin the divine fight.  
3 then 3 easy. 1 medium (JS), then 1 hard (ref), then 2 medium (call/network).

I suppose that's enough for today though.

---

6 October 2019.

22:16.

Instead of a ref's type, it may be better to have globally-available 'example' str/num/bool, elements which become their instances when assigned-from.

---

7 October 2019.

13:19.

Refs (and str/num/bool) are done (almost 100 lines for refs, 5 lines each for str/num/bool), without bug-removing.  
Call/func/args/concept are wanted now.

Also, since we don't want to potentially lose all our progress while bootstrapping, need a way to serialize the whole network. Probably based on JSON and rewrite-refs.  
Also, we *may* just want to have networks have just the object pin (which includes main & save & load & call), to reduce unnatural clunkiness. We can then have `js(propName)` refer to `object[propName]`. …Yeah, that's better in the long term.

14:04.

func, concept, call, object, js, network — all wanted now.

(Also, for optimal code generation, we want the js thing to have access to the continuation, to be able to match on it when expanding many at once…)

15:55.

call, object, js, network — all wanted now.

17:29.

Actually… "If you don't want the function to run after all the concepts, just make it a concept!" — since this can be said, shouldn't concepts run *before* the function?  
I made it so.

17:52.

I might have done calls, actually.  
Now objects?  
Or should I reshape saveJS so that it accepts objects? (And preserves direct property names there.)

18:18.

If one were to ask what the Internet was, a simple answer would be, 'Imagine if everyone's minds were connected, where every idle thought, or contradictory statement were real in equal measure, and only the collective consensus allowed for regulation. This is that thing.'

The Internet is not quite that, but it is so close it is very easy to treat it as that.  
What is described is a conceptual network, where beings are fully inspectable, and part of it.  
Cultures are as networks too. Minds are as networks too.  
Implementing a platonic ideal of a network, its concept?  
Worth anything.

People aren't people, they're toolboxes. Places where each tool can reach and observe another with no boundaries, through a network.

Lacking such a platonic ideal, based on imperfect realities of programming, any human endeavor will eventually escape them.  
Rigor is lost, but that is still valuable for future conceptual networks — it is easier to learn things than create them.

Only fundamental work can affect fundamental issues, but the price of it is extremely long periods of having nothing to show.  
So no one does that.  
But it must be done, if AI is to be a singularity of functionality, not a pipe dream.  
There is no other way.  
Most of the pieces for it are all there, they just need a place for putting them together so easily it could be automated.

22:26.

I might have done objects, actually.  
Now I need to reshape saveJS so that it pulls from the input object, preserving property names in the generated JS.

23:17.

I might have done object-based saveJS, actually.  
Now I need saveJSON and loadJSON — like saveJS, but to/from JSON.  
(Then js and net. Then anti-bugging.)

---

8 October 2019.

12:42.

A better interface to a list-of-things (than [+][-] at the end) is: (assuming vertical layout,) on hover over a list item, or on selecting many items, show on the left: [+] at the top to add an item before, [-] in the middle to delete the item/selection, [+] at the bottom to add an item after, and a line connecting these buttons for looks.  
And possibly a circular pin for ref reassignment.  
In fact, if we make it so picking the pin itself for assignment is deletion (in lists only — can't delete a raw reference), it would be a very neat interface.

13:58.

I might have done saveLinear and loadLinear, actually (using JSON as a format for representing localized descriptions in strings). I wrote down the tests, but I didn't run them.  
Now I need editor components for js and net.

15:04.

I might have done js, actually (by copying call; there should really be an infrastructure for lists, which arrays/objects/js would use; extension points would be valueToArrayOrUndefined and arrayToValue). Uh-oh, testing is soon-ish.  
Now I need net…

21:28.

I did a very bad thing. As punishment, I will do the network *now*. *Immediately*, debug it all. It dies today.  
Disobedience is forbidden. Talking is out of order.

21:55.

Network. Damn it.

22:46.

I guess no exceptions are thrown… but…  
*What is this*?! It's hideous!

25:46.

I actually did manage to do what I wanted, *mostly*.  
Ref/var highlighting is broken still, and I haven't touched open-to-iframe buttons yet, but everything else seems to work.  
I guess the network prototype is real, huh.

---

9 October 2019.

17:37.

Hello, memory thrashing, my old friend. I tried to debug infinite recursion with console.log again.

…The prototype needs work. Though it's now way better than before — at least somewhat usable.

19:03.

For now, it's a liiiiiitle bit finished. What should I do next?  
Have a standardized module that runs a linearized representation?  
Make binary representation, and an interpreter loop for it?
*Make JS conversion work*?

20:31.

I'm taking the rest of the day off. I've earned it.

But first…  
Memory can be defined by alloc(mem, bytes)→[mem, pos] ("create a reference") (possibly also return length) and dealloc([mem, pos]); also get([mem, pos]) and set([mem, pos], bytes).  
Constant memory's defining characteristic is (the lack of `set` and) the shallow merging of bytes: it has a cache (map or even a JS object) bytes→pos. Constant shallow merging leads to perfect deep merging, and significant memory savings and cache speed-up, for doubling memory usage and relatively little slowdown.

Untyped arrays are the easiest type of memory, consisting of just a set of references to other things and an inline free-list. In fact, a global untyped array eliminates the need for outside allocation of references (AKA is best for efficiency): alloc(env, object)→5, get(5)→object, dealloc(5).  
With just a simple constantness conceptual modifier and a shallow equality operator (parameter to the modifier?), we can attach a cache to an array allocator and get merging easily.

This should be doable on the visual network.  
I just need to have buttons [Save to page ←] and [← Load from page], which use indexedDB for storage (or at the very least localStorage) first.  
(And possibly put them into a table, with save buttons on the left, non-resizable 100%-size textarea in the middle, and load buttons on the right.)  
And, fix JS conversion — it's a pretty good idea, actually. Really convenient for actually *making programs*, even if they are ultimately intended to be but vessels for interpretation of a wider memory.  
(Why not make *every single var* a reference, forcing a layer of indirection onto everything? It'll make all ordering problems just float away.)

21:06.

Okay, I'm taking *the rest* of the day off.

---

10 October 2019.

13:05.

Array/object/js (maybe extract those into List?) do not have real references inside, and from that stems all sort of trouble. Those pseudo-references must not be able to be assigned from.  
Arrays and objects are intended to be pure and immutable. Should they have circular references allowed?… Self-references? For generality, I suppose that would be best, but can the current JSON conversion handle such a thing?  
Isn't its loop-detection (and backpatching) based on references? So, uh, probably not.      
Either way, we do actually need a new-reference creator.

14:43.

+ New-ref generator
* Empty-generator code is more compact

Table? List? Details+summary?

15:33.

Table. And localStorage, because indexedDB looked complicated.  
contentEditable elements for strings look really good, way better than textareas. So good, in fact, that I might want to do numbers like that too.

15:49.

The current visual framework is "create element tree representations, then merge them". That can very easily create way more than we want.  
What if, a better visual framework would be, "at an element, call a function, that will make the element as it wants"? assign(instanceof Element, f) sets current elem and does el(f); inside f, el(tag, attr, …children) sets the current element, and el(func, attr) merges… hmm.  
This way would basically need to make all inline children creations `el(…),` to become `() ⇒ el(…)`, with no other changes.

We can make the function accept args via attrs — that is, `el(func, {a:1})` and `func = ({a}) ⇒ el('div', el(Number, a))`; we can even not set them for the next generation to pick up the last args. That's *way* better than being forced to infer from DOM structure.

Also, table layout would be *boss* for objects.  
It'll look so good, people will think a professional made it.

…I have suspiciously many ideas.  
Time to **C O N S U M E**.

16:27.

For example, rather than having all these temp pins, we can separate the "pick value" mode, and make ctrl+click open a value in a top-level list. And rather than having all these generator tabs all the time, we can have them only when picking.

…Should…  
Should I use the network for keeping track of what to do, with booleans for having done them?  
Because I'm losing track.

17:07.

Two items done, twelve to go.  
I guess this is the next stage.  
Is there anything I want to do before that?

17:37.

For linearized repr, we could first record not actual indexes, but pre-merge indexes, making a map as we go, and have a second stage go through everything and map it all.

18:29. Except, what if merging sooner would have let us see more merges?  
We can't just do one big backpatch afterwards, we have to backpatch as soon as an object is done generating.

18:51.

…Oh… contentEditable divs don't have proper newlines, and they retain formatting on paste…

[Later].

But I fixed it anyway.

21:32.

The code is becoming more and more of a mess… Should do that framework thing, not look for more surface issues to tackle.

22:15.

"The first issue is to define ‘clean HTML’. ‘contenteditable’ was first introduced by Microsoft in their IE browser (IE 5.5). Since there were no clean standards on how the HTML should look like inside a ‘contenteditable’ editor, different browsers started to reverse engineer IE and supported it in each of their own way. To name a few, IE uses `<p>` for paragraphs or lines, while chrome uses `<div>` with `<br>` in it. To make it more consistent, firefox joined by using only `<br>`s next to text nodes. In order to make sure our editor shows indents and highlights consistently, I want all rows are `<div>`s, and all new lines are `<br>`s."

22:19.

Unless we slay the core, all hope is lost.  
Visual "update view from state" framework.

Should I… Destroy network access again?  
I feel more ready for that measure, ay.

---

11 October 2019.

12:06.

What about binarization?

```javascript

function step() {
  const ip = get(0)
  set(0, instructions[get(ip)]).step(ip+1)
  // An instruction is (Id …Data), which immediately joins code and data when seen.
}



;(function init(instructions) {
  // Go through all instructions, copy them to self[k], and assign an id to each.
  self.cmd = []
  for (let k of Object.keys(instructions)) {
    const v = instructions[k]
    v.id = cmd.length, v.name = k
    cmd.push(self[k] = v)
  }

  for (let v of cmd)
    if (typeof v == 'object') {
      // A branch table. Convert {name→()=>{}} into the faster [id→()=>{}] format.
      const arr = new Array(cmd.length).fill(0)
      for (let dk of Object.keys(v))
        arr[instructions[dk].id] = v[dk]
      arr.id = v.id, arr.name = v.name
      self[v.name] = arr
    }

  // Initialize the global memory.
  self.env = new WebAssembly.Memory({ initial:1 })
  env.accessor = new Uint32Array(env.buffer), env.end = 0

  // Loop while still processing events.
  function loop() {
    const end = performance.now() + 15

    do { set(0, Step(get(0))) }
    while (performance.now() < end && get(0))

    if (!get(0)) console.log('finished')
    else setTimeout(loop, 0)
  }

  // Create the instruction to load, then execute it.
  env.accessor[0] = 1
  env.accessor[1] = 0
  env.accessor[2] = instructions.Load.id
  env.end = 1
  loop()
})({








  Step(p) { // [Type …] or [Code [Type …]] get advanced a little.
    // Code is an instruction ID by default, as is Type.
      // (We'll provide non-instruction-ID Type/Code *later*.)

    const Code = get(p)
    if (!cmd[Code] || !cmd[Type]) throw "bad instruction"

    if (Code === Step.id) return get(p+1) //[Step [Code Data]] → [Code Data]
    if (cmd[Code][Step.id]) {
      // Looking at Code — see what we can do.
      const Data = get(p+1), Type = get(Data)
      let r = p
      if (cmd[Type][Code]) r = cmd[Type][Code](get(Data+1))
        // Execute data's (AKA type's) override of code.
        // Maybe we should finish args *here*? That is, if Data's type is not a type but code (defines Step), go to [FinishThenFillData [Expr Then]].
      if (r === p) {
        // Execute code's override of Step.
        if (cmd[Code][Step.id])
          r = cmd[Code][Step.id](Data)
      }
      return r
    } else {
      // Looking at Type — bail out immediately.
      return p
    }
  },

  Finish(p) { // [Finish [Code Then]] → [Finish [Step(Code) Data]]. [Finish [[Type …] Then]] → [Then [Type …]].
    // Reduce first arg completely, then apply result to continuation.
    const Expr = get(p), Then = get(p+1)
    // Expr is Code ? [Finish [Step(Expr) Then]] : [Then Expr]
    if (cmd[get(Expr)][Step.id]) {
      return code(Finish.id, code(Step(Expr), Then))
    } else {
      return code(Then, Expr)
    }
  },

  Sum:{
    Step(p) {
      // finish(p).then(p ⇒ …)
        // Putting such a header on all functions is just so inconvenient.
        // I've searched high and low for another option, but…
      return code(Finish.id, code(p, SumImpl))
    },
  },
  SumImpl:{},

  // Types do not override Step, but they do override Finish.
  u32:{ // [u32 X]
    Alloc(p) { // [Alloc [u32 X]]
      return alloc(get(get(p+1)+1))
    },
    Log(p) { console.log('u32', get(p)); return p },
    SumImpl(p) { return p },
  },
  array:{
    Log(p) {
      const Len = get(p++), arr = []
      arr.length = Len
      for (let i = 0; i < Len; ++i) arr[i] = get(p+i)
      console.log(arr)
    },
    SumImpl() {}, // don't we want thunks in arrays?…
  },
  ref:{ // [ref X]
    Finish
  },




  countTo10:{ // [countTo10 [u32 i]]
    Step(p) {
      const U32 = get(get(p))
      if (U32 !== u32.id) throw "bad index"
      const i = get(get(p)+1)
      if (i < 10) return code(countTo10.id, code(u32.id, i+1))
      else return console.log('finished counting'), get(p)
    },
  },
















  // [0 Log [back Sum [1 2]]] — no, it won't know *exactly* what to do when returning..


  Then:{ // [Then Cont:[ContCont Length …] Data]; continues only into Lisp-machines. If data defines step, copy self with rewritten; if not, appends data to Cont and goes to Cont.
    step(p) {
      const Cont = get(p), Data = get(p+1)
      if (cmd[Data][step.id]) return alloc([Then.id, Cont, ])
    },
  },

  Lisp:{ // Lisp machine: [Length f a b c]. Data type. ...Well, it could look through concepts, and use Then to give the precise execution order…
    // [Lisp 4 f a [Lisp …] c] → [Then [SetLisp Original 3] [Lisp …]]?
  },
  SetArray:{ // [SetArray [4 f a b c] 2 d] → [4 f a d c]
    step(p) {
      const Array = get(p), Index = get(p+1), Value = get(p+2)
      const Length = get(Array++)
      if (Index < Length) {
        const Result = alloc(Length+1)
        for (let i = 0; i < Index; ++i)
          alloc(get(Array+i))
        alloc(Value)
        for (let i = Index+1; i < Length; ++i)
          alloc(get(Array+i))
        return Result
      } else {
        const Result = alloc(Length+1)
        for (let i = 0; i < Length; ++i)
          alloc(get(Array+i))
        alloc(Value)
        return Result
      }
    },
  },









  


  step(p) { return cmd[get(p)][step.id](p+1) },

  Sum:{ // [A B] → A+B
    step(p) { return get(p)+get(p+1) }
  },
  Get:{ // [A] → A
    step(p) { return get(p) }
  },




  Load:{
    step(p) {
      // Probably alloc some instructions?
      return alloc([Get.id, alloc([Sum.id, 1,2])])
    },
  },


  Then:{ // [Then ThenCmd Data]
    step(p) {
      const ThenCmd = get(p), Data = get(p+1)
      if (cmd[Data][step.id])
        // Execute this one step then check again:
        return alloc([Then.id, cmd[Data][step.id](p+2), get(p+1)])
          //…Except, we won't find our data on our next step, will we?
      else
        // Leave this place now:
        return alloc([ThenCmd, Data])
    },
  },
  First:{ // [Length …]
    step(p) {
      Try first then, if zero, second
    },
  },



  Act:{ // [Act Code Data Then]
    step(p) {
      const Code = get(p), Data = get(p+1), Then = get(p+2)
      if data defines code, 
    },
  },








  step(loc) { // (ReturnTo Instruction Type …Data)
    const ReturnTo = get(loc), Instruction = get(loc+1), Type = get(loc+2)
    if (!cmd[Type] || !cmd[Instruction]) throw "bad instruction"
    let r = 0
    if (cmd[Type][Instruction]) r = cmd[Type][Instruction](loc+3, ReturnTo)
      // Execute data's override of type.
    if (!r) {
      if (!cmd[Instruction][step.id]) throw "did not override an undefined instruction"
      r = cmd[Instruction][step.id](loc+2, ReturnTo)
      // Execute the actual instruction.
    }
    return r
  },
  Subtask:{ // (ReturnLoc Instruction …Data)
    doc:`To execute an instruction (Id …) with a yet-unknown value, allocate (Subtask ReturnLoc Id …)`,
    step(loc) {
      const ReturnLoc = get(loc++), Instruction = cmd[get(loc++)]
      if (!Instruction[step.id])
        return set(ReturnLoc+1, get(loc)), ReturnLoc
      return set(ReturnLoc+1, Instruction.step(loc)), ReturnLoc
        // Don't we want to step until no longer an instruction, not just once?
        // Also, don't we want overridable set — that is, allocate the set instruction, not just invoke it as-is?
      // If that value does not define step, return immediately.
      // To return, allocate a joining instruction and go to it.
    },
  },
  MoveAndGo:{ // (ReadFrom WriteTo GoTo)
    doc:`Read a value, write a value, then go to address.`,
    step(loc) {
      const Read = get(loc++), Write = get(loc++), Then = get(loc++)
      set(Write, get(Read))
      return Then
    },
  },

  Unknown:{
    // Maybe when in Now, replace it with data?
  },
  Then:{},
  Now:{ // (cmdLoc dataLoc)
    step(loc) {
      const codeLoc = get(loc++), dataLoc = get(loc++)
      if (data === CmdConcept.id && get(dataLoc+1 + get()))
        return alloc([Now.id, get(), dataLoc])
      //Replace later.id with *data in cmd?… Allow branch-to-data?…
        // Is Later a concept that gets replaced with CmdConcept?
    },
  },
  // How would function abstractions work? By continuously allocating "Replace UNKNOWN with DATA in this CALL/VALUE" — join instructions?
    // A bunch of unevaluated instructions?…
    // Is a function call a join instruction too? Do we not need the array?
    // Do we not need the function call either, just now and later?


  // [(concept Defines) X] → (Defines X)…


  Log:{ // Log the instruction.
    step(p, then) {
      console.log(cmd[get(p)].name, cmd[get(p+1)].name, '…')
      return then
    },
  },
  u32:{ // (Uint32)
    // | zero: u32
    // | succ: u32 → u32
    Log(p, then) { console.log('u32', get(p)); return then },
    Alloc(p, then) {
      alloc(get(p))
      return then
    },
  },
  ref:{ // (Loc)
    Log(p, then) { console.log('*'+get(p)); return then },
    Read(p, then) { return alloc([then, u32.id, get(p)]) },
      // Should instructions be (then, type, …) instead?
      // Should data overriding look into then?
  },

  step(p) {
    const then = get(p), type = get(p+1)
    if (then) {

      //See if type overrides then.type.
    } else cmd[type](p+2, 0)

    const Then = get(p), Instruction = get(Then+1), Type = get(p+1)
    if (Then) {
      if (Then && !cmd[Type] || !cmd[Instruction]) throw "bad instruction"
      let r = 0
      if (cmd[Type][Instruction]) r = cmd[Type][Instruction](p+2, ReturnTo)
        // Execute data's override of type.
      if (!r) {
        if (!cmd[Instruction][step.id]) throw "did not override an undefined instruction"
        r = cmd[Instruction][step.id](p+1, ReturnTo)
        // Execute the actual instruction.
      }
      return r
    } else {
      return cmd[][step.id]
    }
  },

  Read:{},
  Alloc:{},
})



// alloc(Mem, Value)→Ref
// dealloc(Ref)→…
// get(Ref)→Value
// set(Ref, Value)→Ref

function code(Code, Data) { // Allocates two numbers as-is.
  const r = alloc(Code)
  alloc(Data)
  return r
}


// Global-only functions:
function alloc(v) {
  // Alloc a single u32 at the end, or copy a Uint32Array into place, or copy an Array into place and empty it.
  const old = env.end
  if (v === v>>>0) ++env.end
  if (v instanceof Uint32Array) env.end += v.length
  if (v instanceof Array) env.end += v.length

  while (env.end >= env.accessor.length) env.grow(1), env.accessor = new Uint32Array(env.buffer)

  if (v === v>>>0) return env.accessor[old] = v, old
  if (v instanceof Uint32Array) return env.accessor.set(v, old), old
  if (v instanceof Array) return env.accessor.set(v, old), v.length = 0, old

  throw "bad alloc"
}
function dealloc(loc) {
  // Do nothing lol
  // We assume we garbage-collect periodically.
}
function get(loc) {
  // Get u32.
  if (loc === loc>>>0) return env.accessor[loc]
  throw "bad get"
}
function set(loc, v) {
  // Set u32.
  if (loc === loc>>>0 && v === v>>>0) return env.accessor[loc] = v, loc
  throw "bad set"
}

```

19:29.

THIS IS RIDICULOUS. What do I have to do to have acts working? Everything just keeps looping back around, and I can't do anything in the end! Fuck!

20:41.

This is bullshit.

This is what happens when you turn your back on The Old Light: it comes back much later, not at all benevolent this time.

21:41.

I... I give up...

```javascript
// Element: .state, .rule, .dirty.
// state({…updates}), rule(() ⇒ …)
// style({…updates}), classes({…updates:bool}), attr({…updates}), children(state,rule, state,rule, state,rule)...
```

I don't feel like doing *anything*.  
The Light destroyed us.

---

12 October 2019.

13:13.

It feels like I've done 90% of the (layout-animation-less) visual framework, so I must have done half.

13:37.

If we had deconstruct(jsValue) → new call(constructor, …), then writing rewrite rules (and equivalency systems) would have been way easier (than handling all native/quoted combinations by hand). Not that I did, I'm just saying.

(Type-instance viewing would also be way easier: no need to explicitly provide views for every single native type, there is a reasonable-looking fallback.)

I want to tackle global memory after this (in a JS array, each referencable slot is either a number (for a ref), a call (type then var-length data), a string/boolean/null, jsValue; call objects are inlined and merged by their string repr, which makes deconstruct that much better). But first, some rest, to gather my thoughts? Best approach?

…Or should I integrate misbehave.js to do syntax highlighting? …I don't feel like it for now.

14:07.

Also, our old model really was very good for the things we do. That is, concepts are *only* for overriding data (the function is not asked, except at the end, for overriding step), and the concept of a call is the concept of its function. Then (view (Type …)) asks Type how to view the value.

Anyway.

```javascript
self.env = []
env.cache = {}
env.journal = {}
  // In an ideal world, we would have (first journal (const env)) as our safe environment. This is not that world, this is what we do to get closer to it.

network({
  _alloc(data, merge = true) { // → Ref
    // A low-level function; data must be an array.
    if (data === undefined) return env.length++
    if (!(data instanceof Array)) throw 'can only allocate an array (or undefined, for a single ref)'
    const start = env.length
    if (merge) {
      const arr = []
      for (let i = 0; i < data.length; ++i) {
        if (arr[i] === arr[i]>>>0)
          arr.push(String.fromCharCode(arr[i]>>>16, (arr[i] & 32767)>>>0))
        // Non-u32 data is considered mutable and non-essential.
      }
      const str = arr.join('')
      if (str in env.cache) return env.cache[str]
      env.cache[str] = start
    }
    env.length += data.length
    for (let i = 0; i < data.length; ++i)
      env[start + i] = data[i]
    return start
  },
  _get(ref) { // → u32. Assembling everything into JS objects each time is… inefficient.
    if (ref !== ref>>>0) throw 'can only write at ref'
    return ref in env.journal ? env.journal[ref] : env[ref]
  },
  _set(ref, v) { // Updates the journal.
    if (ref !== ref>>>0) throw 'can only write at ref'
    if (ref >= env.length) throw 'write to nowhere'
    env.journal[ref] = v
  },
  _commit() { // Actually writes the journal.
    const keys = Object.keys(env.journal)
    if (keys.length < 128)
      keys.forEach(function(ref) { env[ref] = env.journal[ref], delete env.journal[ref] })
    else
      keys.forEach(function(ref) { env[ref] = env.journal[ref] }), env.journal = {}
  },

  // Now… do we have deconstruct(jsValue)→Ref? Making a value… env's own… (all pre-built functions must be in the array for this, and know their indexes.)
    // Or do we have fromJS(jsValue)→Ref (and toJS) (processing whole networks, like is returned from loadLinear), and deconstruct(Ref)→Ref?
    // Or maybe even fromLinear(lin, map) and toLinear(ref, map) (map could be undefined to leave refs as-is), as the best first step towards fromJS/toJS?
      // We could just have a global WeakMap from lin to ref for this.
})
```

15:07.

We could have a more sophisticated scheme: a plain Array for js data, *and* an Int32Array for ref/i32 data (where negative indexes refer to the JS array). Faster. More wasm-compatible.

18:06.

Can such a thing feel the heat of my fire?

```javascript

network({
  bilin:{ // JS/i32 mix.
    allocBin(data, merge = true) { // → Ref
      // A low-level function; data must be an array (which is emptied afterwards to ease re-use of one).
      if (!this.env) this.env = this.newEnv()
      const env = this.env

      if (!(data instanceof Array)) throw 'can only allocate an array (or undefined, for a single ref)'
      const start = env.memend
      if (merge) {
        const arr = []
        for (let i = 0; i < data.length; ++i) {
          // Create a string from i32 data so we can use a JS object to retrieve a content match.
          if (data[i] === data[i]|0)
            arr.push(String.fromCharCode(data[i]>>>16, (data[i] & 32767)>>>0))
          // Non-i32 (js) data is considered mutable and non-essential (but always either present or not, always in equal amounts and at the same spots).
        }
        const str = arr.join('')
        if (str in env.cache) return env.cache[str]
        env.cache[str] = start
      }

      env.memend += data.length
      while (env.accessor.length < env.memend)
        env.mem.grow(64), env.accessor = new Int32Array(env.mem.buffer)

      for (let i = 0; i < data.length; ++i)
        if (data[i] === data[i]|0)
          env.accessor[start + i] = data[i]
        else
          env.accessor[start + i] = this.allocJS(data[i])

      data.length = 0
      return start
    },
    allocJS(v) { // → Ref (<0)
      if (!this.env.refs.has(v))
        this.env.refs.set(v, ~this.env.length), this.env.push(v)
      return this.env.refs.get(v)
    },
    get(ref) { // → ref<0 ? JS : i32
      if (ref !== ref|0) throw 'can only write at (i32) ref'
      return ref < 0 ? this.env[~ref] : this.env.accessor[ref]
    },
    set(ref, v) {
      if (ref !== ref|0) throw 'can only write at (i32) ref'
      if (ref < 0) {
        if (~ref >= this.env.length) throw 'write to nowhere'
        this.env[~ref] = v
      } else {
        if (ref >= this.env.memend) throw 'write to nowhere'
        if (v !== v|0) throw 'can only write i32'
        this.env.accessor[ref] = v
      }
    },

    newEnv() {
      const env = [call] // At ref: -1 → call (length and args follow); anything else → ref (single-slot).
      env = [] // <0 → ~n
      env.mem = new WebAssembly.Memory({ initial:64 })
      env.accessor = new Int32Array(env.mem.buffer), env.memend = 0 // ≥0
      env.refs = new Map // JS → Ref
      env.cache = {}
      // Delta not included for simplicity.
      return env
    },


    loadLinear(json) { // → Ref
      if (!this.env) this.env = this.newEnv()
      const lin = JSON.parse(json) // index → localX
      const refs = {} // index → Ref

      const This = this
      const tmp = []

      return load(lin[0])

      function load(i) {
        let l = lin[i]
        if (typeof l == 'string' || typeof l == 'boolean') return This.allocJS(l)
        if (typeof l == 'object' && 'number' in l) return This.allocJS(+l.number)

        if (typeof l == 'number') {
          // Allocate a number then backpatch.
          if (i in refs) return refs[i]
          tmp.push(0), refs[i] = this.allocBin(tmp, false)
          this.set(refs[i], load(l))
          return refs[i]
        }

        if (typeof l == 'object' && 'func' in l) // Represent it as a call to func, since that is more efficient here than having to go through the JS side.
          return tmp.push(-1, 2, This.allocJS(func), load(l.func)), This.allocBin(tmp)
        if (typeof l == 'object' && 'concept' in l)
          return tmp.push(-1, 2, This.allocJS(concept), load(l.concept)), This.allocBin(tmp)
        if (l instanceof Array) // Just alloc it directly lol
          return tmp.push(-1, l.length, ...l.map(load)), This.allocBin(tmp)
        if (typeof l == 'object' && l.object === true) {
          const x = {} // Object access is very likely much faster in JS than in (object k v k v k v).
          for (let k of Object.keys(l)) if (k[0] === '_') x[k.slice(1)] = load(l[k])
          return This.allocJS(x)
        }
        if (typeof l == 'object' && 'js' in l)
          return tmp.push(-1, l.js.length+1, This.allocJS(js), ...l.js.map(load)), This.allocBin(tmp)
        throw "unrecognized value to handle"
      }
    },
    saveLinear(ref) {
      // Unlike from JS, this is a pretty direct conversion, actually: already cached, already backpatched…
      const lin = [0] // index → stringOfLocalX

      const This = this

      lin[0] = save(ref)
      return '['+lin+']'

      function put(x) { return lin.push(JSON.stringify(x)), lin.length-1 }
      function readCall(ref) {
        const len = This.get(ref++), arr = []
        for (let i = 0; i < len; ++i) arr.push(save(This.get(ref+i)))
        if (len === 2 && arr[0] === func) return {func:arr[1]}
        if (len === 2 && arr[0] === concept) return {concept:arr[1]}
        if (arr[0] === js) return {js:[...arr.slice(1)]}
        return arr
      }
      function save(ref) { // Everything non-ref must be acyclic (AKA allocated one-by-one).
        const x = This.get(ref)
        if (ref < 0) { //js
          if (typeof x == 'string') return put(x)
          if (typeof x == 'number') return put({ number: x===Infinity?'Infinity':x===-Infinity?'-Infinity':isNaN(x)?'_':x })
          if (typeof x == 'boolean') return put(x)

          if (x && Object.getPrototypeOf(x) === Object.prototype) {
            const y = {object:true}
            for (let k of Object.keys(x)) y['_'+k] = save(x[k])
            return put(y)
          }
          return x
        } else { //bin
          if (x === -1) return put(readCall(ref+1))
          return put(save(x)) // ref
        }
      }
    },


    // Do we really *need* saving/loading JS, if we already have a JSON conversion?
  },
})

```

20:55.

We also need step (and finish) (or, well, just our own `call`). We also need to make the 'real' call to handle concepts in a way conducive to having types — namely, "(after converting each call inside to its result), try data's (i≥1) overrides of code; try code's override of call. Also, all tried data overrides that have concepts at the front, pull overrides from those".

…And test that the conversion I wrote works, I suppose.

(Also, working on this is such a great feeling, seeing how functionality expands with each non-trivial conversion of self into a different format. I'm lucky to see it in this day and age.)

---

13 October 2019.

22:04.

"Save to JS" works now, in principle. I still need to move `func` there, and rewrite everything visual with `els.*`, but existence by self-rewriting moves a step closer.

(And add that binary mode, I suppose.)

(Also, it looks cool, with all the big round pins and table layout. Can't remember if I did it today or not.)

I spent two hours trying to figure out why essentially `(function(){…})` wasn't running. Once I opened a pre-made script (`<script>document.write('yea')</script>`), it was over quickly.

Is this hacking space? Again, I felt like I'm going through tunnels, from world to world; too narrow, too open — too close together.  
I never *did* program with full power. This is the first time, and though it's only an early beginning, I like what I see.

[…Pins, named manually… Nameable manually… Yes, that would be great for both reverse *and* engineering.]  
[An element for finishing, showing the result and expandable explanation (traces): `7←(+ 12←(* 3 4) -5)`, or `‣ 7`; putting *all* (pure) computation (which is effectively pure if we model side-effects correctly) in those is amazing. Just explore computations at your leisure.]

---

14 October 2019. 21:02. I did absolutely nothing today. …Apart from moving `func` and fixing some inconsistencies and bugs, I mean, which is a matter of one hour. I could now technically rewrite self into an iframe, passing all the tests, except I can't actually visually show anything. You are the last one left, els. (…And binary.)

…Actually, I've lost my power *again*.

---

20 October 2019. 16:50. I don't know why, but I'm almost nauseous from working with self.html. I can't do that. What the hell. Time to die or something, I guess.

Learning functions compromised.

19:22. Really, I just need to clean up the Conceptual spec, and create a network that can display it. I already know everything I will need, I just need more persistence.

els *is* the last one left, or rather, a re-make of everything with it.

---

22 October 2019. 21:59.

cccccvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxccccccccccczzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzccZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaazzzzzzzzzzaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            Knowledge of concepts is the source of humans' power. Yet no human can survive in such a simple place as concepts' world. mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmooooooooooooooooooooooooooooooooooooooooiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiuuuuuuuuuuuuuuuuuuuuuyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyttttrrrrrrrrrrrrrrrrrrrrrrrrrrrreeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeetwwwwweeeeeqqqqqqw  qqqnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmnnn\\]hh We have descended into hell.                                                                                                                                                Materialization of concepts… An enemy that cannot be beaten. How to even fight the immaterial and bottomless?

A neural network is of a type `(…inputs) ⇒ (…outputs)`. Fully-connected nn… We don't know nor suppose anything (except the flatness of correlation), so we must give every possibility a possible role in any result. For each (non-number) input, all its possible values are enumerated; only one is assigned 1, the rest are 0. Each output is connected to each input; is a sum of multiplied inputs (where 'sum' could actually mean 'ReLU reduce(inputs, +)').
[shift, Nat, 1] = shift(Nat, 1); [enum, type] = enum type; [rememberThatWeCanReplace, from, to] = from→to; [any, a, b, …] = |a |b; [typed, v, t] = v:t.

The whole (current) program is named Self. The algorithm has a value and a list of arrows from→to that it has seen (initially just Self) — potential transformations of the value, and it continuously tries a random one, checking that currentValue:from (binding then renaming variables for closure), removing it and replacing it with to, adding every |option it has seen just inside.
  // Except, don't we want to apply Self to some new value/state to get the new Self? Do we start with Self New? Or just New?
  // And how to ever return to a previous value, for when we enter an unsatisfactory state from which we cannot escape?
  // And how to have the type of transformation, to operate on transformations themselves?
…No. We have an expression […] we want to transform, and we have a set of actions: look at arg, return to parent, apply a remembered transformation.

And how to have construct-js-from and deconstruct-js for much increased speed of all of this? It's not *technically* necessary though…

| Number →
  | 0
  | 1
  | Nat →
    | 0
    | 1
    | shift(Nat, 0)
    | shift(Nat, 1)
    | shift(a, shift(b, c)) → shift(shift(a, b), c) // [A[BC]]=[[AB]C]=[ABC]
  | + →
    | +(Number, Number) → Number // Is this a good and valid way to specify the return type? Won't this, if picked, trick the thing into returning just a random number?
      // But what do we do otherwise? Not specify either inputs nor outputs of any functions?
    | +(x,0) → x
    | +(0,y) → y
    | +(1,1) → Nat.shift(1,0)
    | +(Nat.shift(a,b), c) → Nat.shift(a, +(b, c)) // [AB]+C = [A[B+C]]
    | +(x,y) → +(y,x)
    // Do we need +(x, +(y,z)) → +(+(x,y), z)? Can this rule be inferred?

  | - →
    | +(- x, - y) → - +(x, y) // But these do not begin matching at a -, these begin matching at a +… Or could these be said to return a concept, to match a parent?
    | +(+(x, - y), y) → x
    | - 0 → 0
  | Int →
    | Nat
    | - Nat

  | * →
    | *(Number, Number) → Number
    | *(x,0) → 0
    | *(x,1) → 1
    | *(Nat.shift(a,b), c) → Nat.shift(a, *(b, c)) // [AB]*C = [[A*C][B*C]]
    | *(x,y) → *(y,x)
  | 1/ →
    | *(1/ x, 1/ y) → 1/ *(x, y)
    | *(*(x, 1/ y), y) → x
    | 1/ 0: NONE
  | 2^ →
    | 2^ 0 → 1
    | 2^ +(x, 1) → Nat.shift(2^ x, 0)
    | 2^ - x → 1/ 2^ x
  | Float → *(Int, 1/ 2^ Nat)
  // No need to fiddle around with limits of rational sequences to define the closure of the rational numbers (real numbers); that closure is "either a number or an algorithm", and since we can have any algorithm without a single concrete form here, and manipulate it properly, we automatically have that closure in Number.

  // How to broadcast arrays and/or maps?
    // How to *have*  arrays and/or maps? So that a Number can be a set of Numbers, which makes perfect sense.
  // And… How to treat any Input→Output function as a directRelation?
    // And, what other, indirect, relations are there?
  // And… How to propagate the needed change to a deeply-hidden variable?

| enum Type → Values // enum Bit → (0,1). Do we even need this, really?
| 

This is kinda too complex, and does not have a good base…
Can we instead think of a system that copies a function just from its outputs; give it a thing like x ⇒ x*x-x+123, and it will look for the best thing it can find among its own functions, composing as needed?

x ⇒ ?
  x ⇒ +(dep * Var1)
  dep is, most generally, (x,1) in a nn, or any subdependencies (x or 1 here).
x ⇒ ? + ?
  x ⇒ +(Var1 * +(dep * Var2), Var3 * +(dep * Var4))
x ⇒ ? * ?
  x ⇒ *(Var1 * +(dep * Var2), Var3 * +(dep * Var4))
x ⇒ ?*? + ?
  x ⇒ +(*(Var1 * +(dep * Var2), Var3 * +(dep * Var4)), Var5 * +(dep * Var6))
  x ⇒ NN
  When this is trained, the function can be reconstructed properly.
  (If after improving for one input, another input worsens, we have not introduced enough complexity.)
  A possible train step: gradient(NN) = f(x) - NN(x).
  A possible train step: min(opt → f(x) - opt(x), loop(n, mutate NN)).
…Nothing can be nailed down, because potentially, anything *could* become anything else — we just learn and manipulate probabilities in a structured manner.
A lot of paths lead to concrete things, but there is *always* a path to more general things.
…This… weird search…
I've seen it before, in relation to the spiral of existence. Does this mean I'm on the right track, or that I will fail to formalize anything like it just as I did before?

None of the words above are actually helpful.

---

23 October 2019.

13:46. The bitter lesson is that, in the end, putting in the particular knowledge you've accumulated over the lifetime is always outcompeted by putting in *all* possible knowledge (creating a general system), and letting the computer figure out which ones are best.

But how to skip to the end of this lesson…

Let's review our constraints.  
The main thing preventing us from using pre-existing languages is concepts.  
How necessary are they? How useful is the ability to break out of locality?
…They do seem pretty great still, actually…

14:22.

Re-reading and cleaning up some of Conceptual, it is obvious that it underwent a lot of self-improvement. New features were thought up, then used to re-think older features in a better way.

And, do we really want visual display? Isn't Python ultimately the more convenient language, since it has easy access to modern number-based relation inference?  
With how enthusiastic I am about development in JS, I think it's better to just switch to Python.  
…Is there some thing that re-executes a program on its every change? Browser, or VSCode. Switching to console constantly is somewhat annoying, though not too bad.

It is hopeless without a language we can actually extend and re-implement in terms of extensions. Like a Lisp-ish language.  
Concrete is king, and the bitter lesson cannot be skipped, only seen coming.

??:??.

I remember now. I was supposed to disappear for a few years, to bring the code near to where my thought is.  
One out of billions, I accept this hopeless responsibility. Its hold on my being is self-perpetuating.

21:24.

Re-connected with my NodeJS roots, by making a REPL.  
The same old story: either a thing I do is too difficult, or it is too easy.  
I finished the old super-simple Lisp-ish parser I wanted to finish, and connected it to a NodeJS REPL.  
I'm still not sure if that was a good idea, but now I should make a serializer.  
(And by "now" I really mean "later".)

---

28 October 2019.

11:55.

I am a traitor and a liar.

It is too quiet. There is no voice to listen, to teach, to understand.  
I never wrote a story… Maybe I should.

14:53.

For scheduling-with-multiprocessing, we can have two queues (of i32 references to expressions), "scheduled" and "main-only". Any thread can atomically pop a value from "scheduled", and if it encounters a JS error during the step, put the expression into "main-only". The main thread steps expressions from "main-only", and if that is empty, from "scheduled". (We periodically also need to compact those queues — that is, move elements to the start, atomically.)

17:25.

`i < j ⇒ F i < F j`; this could be the property to check for learning, and generating it could pop out all the particular learning algorithms, like assignment, or gradient descent, or binary/exponential search, or anything else. It could be used for picking input to nudge output; the function does not even need to be explicitly called, we can just adjust a variable and look at whether the output is more or less than we want, periodically… But, damn, do I Need that little language. It is worthless in JS, no staying power, no generative power…

---

29 October 2019. 20:32. War was pretty good, wasn't it? Execution being f(v, then) calls.

…

We need to get it to where we can do a generative type system. Then we can actually codify things like "an In→Out relation/function can be either: connecting to all output values and choosing the best pick, `at( enum Out, maxarg repeat( (random Relation) In , enum Out ) )`; or connecting all input values, `enum In`; or, for images, convolving input or deconvolving into output with some filter; or, for numbers, using a number function like activation (ReLU, sigmoid, …) or `Var*In` or `reduce(In, +)` as appropriate; or any other function with appropriate types". Able to be developed into the full might of machine learning at our fingertips (`random Relation`).

(Or should a "generative type system" mean "generative enumerable dependent type system" — is(v,t), any t, all t? More uniform than is & random & enum.)

21:42. Damn it, it will be so good.  
Damn it, it is so bad now.  
And my will to live is broken too. I'm constantly distracted.

---

30 October 2019. 12:15. What is this horrid `assign` puzzle? Why does it require precise knowledge of the picked semantics (eager vs lazy); why does it want to be both?

`(assign a 1+2)` sets `a` to `3`. `a = 1+2`.  
`(assign (finish a) 1+2)` sets `a` to `1+2`. `!a = 1+2`.  
`(assign (finish a) 1+2*3)` (`!a = 1+2*3`) sets `a` to… `1+2*3`? `1+(finish 2*3)`, as wrapping every expression in finish would imply? `1+2*3` is simpler.  
`(assign (finish a+b) 1+2*3)` (`![a+b] = 1+2*3`) sets `a` to `1`, `b` to `2*3`… or `6`, since we don't have it wrapped in finish? `6` since we don't need to discriminate here.   
`!a+!b = 1+2*3` is `(first a→1 b→2*3)`… Do we not even need to consider the case of (finish notLabel) to pattern-match on code?

13:37. And now I need to decide how overriding of user-defined functions works with *this* going on in their args.

This is the worst thing I've ever seen. Anything but this, please.

The concepts turned out to be *such* a pain.  
Do we really need them, again?  
They allow us to basically record and alter execution arbitrarily… so, yeah, I guess so.

16:20. Will I reach a checkpoint? I started over and over again on this whole language-like thing.

17:42. Infinite recursion… wait, isn't this by design? I don't think we can fix that…

If all we want is to escape the simulation, then why have targeted overrides? Just a function is enough, right?  
Is `concept Def`, whenever present in a call, making the call into (first DefPath RegularPath)?  
What the fuck is happening?  
Why can I not ever get a handle on this, why am I going in circles?  
Is this really a consistent model?

To be able to escape a simulation, we need to turn every single syntactic construct `(base …)` into `!hasConcept(…) ? (base …) : makeConceptPath(base …)`…
One option of doing that is dynamically, whenever we see a base, like we have been trying to do. But another is statically — pre-parse everything into UAST form, turn every `(base …)` into `(checkEscaping base …)` (probably immediately).

To be able to provide a different definition of a function, as is very commonly required in dynamic languages, we need to have each function call perform a check.  
If the check is itself a function call, doesn't it need to check too, which needs a check too, which needs a check too, *infinitely*?  
The real question is not whether we want dynamicity, but where do we bottom out?  
One option is to cut off after the first check: overrides of overrides are not allowed. Is this a good option?  
The only other option is to provide some primitives into which the checks can bottom out. Like a map, like we tried before; but this won't turn "anything" into stuff, like errors and usage recorders need.

…What about that execution model where concept overrides were shown as having escaped one continuation-level?  
If we think about execution as continuation-calling functions — (Do Then), implemented in JS somewhat like Loop = Do(Loop)… Um…  
This doesn't help us at all.

18:36. Damn it, I can't get a handle on how to limit the thing properly, how to not launch a check just after assigning args in a user-defined function for a concept. I can't pass a flag from finish/step (func has too many args already), I can't set a global variable isChecking (because we do want to have checks during checks *after* we have assigned it)…  
Maybe I should copy func into _overrides (since it *has* to be a function if it's user-defined), and remove the check? I won't even need a flag in finish/step then.  
…But what about first-of-funcs? …This is insane.  
I think we do actually need that global-variable solution; func remembers its value, checks if it was false, then after calling restores it.  
AAAA

18:57. Okay, having done the global variable… why does it still enter infinite recursion?  
…It never even enters the check-or-not part of func. What?

22:25. I realize that my consciousness is unstable. But I have no other.  
I mean, what is this, fear-based programming, fear so advanced it self-sustains itself through personality and circumstances?  
I don't like this spirit of blasphemy, betrayal, and destruction, but I see no other option.  
I *am* slowly creating little systems for convenience, but far too slowly.

23:46. This happens every time I think I got it: some much bigger problems come up, and suddenly I wish I hadn't said a lot of the things I said.

24:03. Having fixed lots of bugs today, I'm back to where I started today: to an infinite recursion problem. Does NodeJS have some way of seeing the stack when we pause execution, or something? Am I gonna have to use lots of printing?

---

31 October 2019.

23:37. After a few hours of bug-fixing, I'm back to where I started yesterday: an infinite recursion problem involving concepts.  
I'm reminded about an unpredictability-seeking ('curiosity-based') AI that got addicted to watching at a randomly-changing TV screen, and got back to learning after it was turned off. This is me the majority of this day.  
(Having said that, I feel nothing about it. I have no responsibilities if I know I'll fail. How to fix that? Both the infinite recursion, and not minding time-wasting addictions.)

---

1 November 2019.

The writing-me is so much better than in-my-head me. All I need to do to solve a problem is to write it down; there is immediately a question of "how do we fix this?", and from there, it is usually not that far from an answer.

In other news, tangling control flow considerations with overriding so characteristic of dynamic languages, may have been a mistake. I mean, having a map and not a function could be better.  
This direction sapped so much of our strength.

17:27. What do you know, code using only maps *actually makes sense*. This is so rare, I forgot what it feels like.

But now I need basically (rest var)/(rest (…)), so that vararg functions can exist (and I can re-make the old tests anew).  
Laaater.

20:58. Woah. We have freedom of choice for once.  
Semantics that *work* and *make sense*? Unthinkable. Scary.  
The past me was a genius (I essentially came back to exactly the same design for concepts as before).

---

2 November 2019.

20:37. Today I'll start work on converting everything to continuation-passing style. This will allow integrating async and interruptions (and thus responsiveness).  
These are acts. The past me was a genius.

21:37. CPSd finish and step are proving to be a challenge. I can't get a handle on which returns which, is all.  
On the plus side though, it looks like not only will expansions show up in step-based trace, but all the concept-checking steps too.  
And I'm sure I'll mitigate the impact of ungodly amounts of allocation when eventually adding memories (in particular, a stack).

---

3 November 2019.

13:03. My mind is blank.  
(Every single obstacle is insurmountable.)

Should I try stepping back, and by that I mean, outline explicitly all the things I'm trying to do at once?  
I think there are at least 3. f.call(...v) → f(v), CPSing (f(v)=>whatevs → f(v, cont)=>_do(cont, whatevs)), thunking (_do → _push and an outer interpreter loop).  
…And passing closed-over parameters explicitly.  
Can I… do them one after another, instead?

---

4 November 2019.

10:16. Almost want to clean up Conceptual.md some more. I've got a little more things to say now, like purity being a part of memory (specifically, compress-equal-objects-into-the-same-one), memory+processor being a host language, the generative enumerable dependent type system, ways to change output by adjusting inputs (direct single-var equation inversion for simple cases, single-var binary search for pure monotonous cases, parallel random adjustment, inertial/additive adjustment, remember-past-rarely, gradient descent), arithmetic In→Out relation generators (nn parts), single-var memory (regular ref, best-of-seen ref, geometric-progression-costs ref), proofs (mainly co/inductive — assuming these objects check out, prove that all their parts check out).  
Those continuations aren't going anywhere, mmmmmmmm...

13:03. I find myself wanting to delete most of what I see; all this bullshit still left in Conceptual is sapping my will.  
Ah yes, my will.  
The real key to this is a structure not caring whatsoever about soft feelings, overriding their demands as it wants. Unyielding will of steel.  
I don't really have that, but I felt its distant caress today.

13:23. And those brackets. Ugg.

Okay, apart from purity, we might as well just do completely new write-ups on these features.  
And, acts and later/now should be re-thought.

13:59. I'm sure this was profound once, but now it just seems random.

21:42. I feel like I'm on the verge of actually being able to *write code*, and not be so hollow inside, lacking a soul that preserves stuff. I feel like I almost understand the concept-arrays execution model. I feel like I can do the doing.  
It's tricky still, though.  
Can another distraction be in order?  
Today, I've begun a few things, and done nothing.

---

5 November 2019.

19:20. It is done. The continuations are, uh, able to be passed.  
I'm not brave enough to actually run tests on this monstrosity. (And they won't work anyway, I need to clean up all the finishes in code, and such.)  
Nothing is ever easy. We just make something clumsy, then use it to make something seemingly less clumsy, then pretend it was an expression of the less clumsy thing all along.  
But the actual multiverse is incomprehensible to even gods themselves. Alien, vast, and unwelcoming.

Continuation-passing style; allowing zero returns, one return as is usual, or even many returns…

Okay, did I manage to get any neat features in?  
Not really, apart from even ungodlier allocation than I had before. If we were able to replace "return Computation" with its actual inlined code easily, we could have done a JIT relatively-easily. But we can't, not yet at least.

I need to decide what to do next.

(I worked for about 5 hours today. That's a lot for the recent me.)

…Probably hit Ctrl+F on finish and replace all that with CPS.

---

We can kind of embed concepts in JS, if we do concepts as "throw concept(defines)", and have `checker` (AKA all functions) both check its arguments, and catch all concept-throws (concept returns within our body). …No, I don't think it'll work that well, unless we also enforce "up to one function call inside each function".  
Or at least "do exactly one conceptual operation on values, which are `arg()`.".  
It *would* make promises able to re-enter computations, which is (one of) the main thing we want…

6 November 2019.

23:22.

Me: After half a week of work, I've done continuation-passing! Can't wait to finally use it!  
Me a day later: Yeah, I'll just be using eager evaluation without any thunking for this type-system.

24:58.

(all, any, only, is, gen, enum…)

…Okay. How do we do proofs now, with all this? How do we prove that 1+2=3, or "a and b implies a", or "for all a, we have a and true", or "int plus 1 is int"?

"A and B implies A" is "for all A and B, we have A" is "A fully contains (all A B)" — so, (is (all A B) A). Which *is* checkable and provable, even in the symbolic case.  
"for all A, we have A and true" is "(all A (all)) fully contains A" — so, (is A (all A (all))) — which is indeed true (we have both (is A A), and (is A (all))).  
Int stuff is tricky… Can we prove by induction?  
A proof by induction attempts to prove each case, assuming the overall picture is true. What does "prove each case" mean? It's related to `enum`, but how; what does "prove A is B" mean? "(is A B) does not return an error, meaning the implication is inhabited"?  
With inhabitation, do we even need errors?  
Can we return the asymmetric difference from `is`?…  
Can we re-define is of any/all in terms of, uh, things like (is X (any …))→(any …(is X Elem)) and (is X (any))→(any) and (is X (all))→(all) and (any … (all) …)→(all) and (any … (any) …)→(any … …)? Would that work, *and* make sense? I think it's completely symmetric and recursive then too…

Since we are removing everything error-y and non-local, maybe we should make enum return (all …FuncResults)? Func could return (any) to exit immediately, (all) to not change anything, and anything in between to signify… something. What deeper meaning is there to this? `enum` is no longer perfectly descriptive…  
What does "intersection of transformations" mean? Would "union of transformations" mean anything, then, apart from being the opposite?  
(And how do we do proof by induction, still? Can we have some examples of what needs to be proven like that?)

Also, one more reason to not use enum: it's a reserved word in JS.

(enum Type Func all)? Reconstitute-as? Reconsider? remake? repick?  
This at least makes sense *a little bit*.  
(Also, do we still need symmetry, even in this? Doesn't it kinda break down in gen, so probably here too?)  
…It's like (is X Elem)->all, but with an arbitrary function instead of Elem=>(is X Elem), right?…

forall? …With its reverse, forany?  
(forall (any …) Func). (forany (all …) Func). On equal-polarity things, we can just pick a random one; on different-polarity, we must iterate.  
…Wait, doesn't `gen` become `forany` then?  
Welp, I found the opposite of `gen` that I've been looking for.

---

7 November 2019.

We want that juicy finite type system. But how do we want our enum? Juicy and symmetric, of course.  
`forany` proves/checks existence; `forall` proves/checks totality. Just as any/all, these are completely symmetric to each other, while still accomplishing their goals.  
…Except, these aren't actually generators nor enumerators. We don't go from types to values, we go from types to "when does this exist" or "when do all members check out".  
(Still, we want to be able to handle cycles properly.)

Only about three hours today.

An even denser and compression-amenable packing than `(a (b) c ((d)) (e))` (for non-empty arrays): `a  b  c   d    e`. Relying on there being exactly one space between items, we can start a sub-array if we have a space where we expected a character… But when to end a sub-array? No, we can't know whether to start or end; while we can try both, this won't necessarily result in a single parse. I think we do need at least two characters… can we get away with just two? `a  b| c   d||  e||` — actually, yes, as long as we rely on there being exactly one space between items; but this will hardly bring comprehensibility benefits. …Can we make the whitespace-only variant precise as long as we limit our nesting depth (getting by with references for the rest)? To more than 1, obviously — like 2 or 3. Not 3 — `a  b  c   d    e` can be seen as `(a (b (c ((d (((e))))))))` — except, no, we know to close before that; `(a (b) c ((d)) (e)))` — this example seems fine; are there ones not fitting? `((a))` kind of doesn't; `((a) (b) (c))`, `a   b   c`, `(a ((b)) c)` — not fine. 2 — `(a (b) c (d) (e))` is `a  b  c  d   e`; I don't think this is very visually-intuitive (which is the main goal with this). Still, it *is* a way to reduce visual clutter of brackets. `a   b   c   d`, `((a) (b) (c) (d))`… We have only 2 choices of open/close when whitespace doesn't match, and we have 2 levels, so we always know which is picked when: two spaces is 1→open/2→close; three spaces is close+open. `a   b  c  d` is `((a) (b) c (d))`.

Also, I'm falling back into the habit of disposable thought trees, in source code comments, that are made to later get disposed of. Like:
- What if we have infinitely-recursive (cyclic) existence/totality proofs?
  - In fact, can't we make `assign` able to handle cyclic pattern structures too, with maps?
  - If we make them both able to handle cycles gracefully, it'll be a great boon. Everything will be kind of… uniform.
  - Okay, allowing cyclicity of existence/totality is tricky, right? Because you need to prove all parts, assuming that the whole is *something*, and if it turns out to be less, we abort. Is this the right idea?
  - If so, HOW do we prove (infer?) anything that is not either (any) or (all)? What if we just assume the result is garbage, (any) — won't that yield a totally different result from assuming (all)?
  - Also, cyclicity can give us no end of trouble for even just checking the belonging of X to any/all, too. How do we infer for that case?
    - What should (is 1 a a:(any a 1)) return? Or (is 1 b b:(any (array 2 b) 1))? b is 1 or (2 1) or (2 (2 1))… a is, uh, less obvious. Aren't instances of a just, 1? Does this mean that immediate self-reference is illegal?
    - What about (is 1 c c:(any 1 (any 2 c)))? Instances can only be 1 and 2, no matter which option we pick on every type-generating choice. Does this mean that *any* self-reference is illegal? (Unless it has non-any-all types. What should happen in this case?)
    - If, on encountering an already-in-progress repacking, we return to it, construct everything but us, insert us as a lazily-evaluated thunk, then continue with our own repacking… Is this the correct solution? Is there any simpler one, any better one?
    - What if we just don't add the circular parent to the result (as if we return all for circular all-checks, any for circular any-checks)?
      - …Or should we depend on the caller being any vs all? Is there a difference between (is 1 c c:(any (any 2 c) 1)) and (is 1 c c:(all (any 2 c) 1))? The first is ok; the second is, uh, "both 1 and either 2 or both 1 and either 2 or both 1 and either 2 or …" — does it really converge to anything? If we ignore it, it converges to (any), which is good… But what about (is 1 c c:(any (all 2 c) 1))? Everything is still fine… I'm starting to think we really can just ignore *all* cycles.

(I change projects so often, it's like I re-invent myself every month.)

- Finish the idea of type checking (the actual `is`) and generation (search-randomly-while), to connect types and values, not just do proofs on types.
  - (gen Type Value→Inhabited) (AKA stop at (any)), so (gen Type x→(in (only x))) checks that all values it can possibly generate are actually contained in the type? If not, it won't actually error, it'll just stop. (In other words, return all of transformation results. Quite similar to forall, but concepts like `only` override it differently, and it has different asymmetric behavior anyway, so it is a different concept.)
  - Is that better than (gen Type Value→Always) (AKA stop at non-(all))? (Cannot be expressed in terms of return-combination-type, so probably not.)
  - Or than a completely separate stopping marker? (Again, nothing to return as the result.)

I've noticed this... I express old terms in terms of new ones *so much*. I guess this *is* what "self-improvement" means.

Want:
- In code, […] ⇒ array(…), and have that assign numbers to each array it's seen and merge equal-number-constituents arrays together. …Except, how do we construct cyclic arrays then, especially from binding acyclic ones? Cyclic things can only arise from binding, so we can special-case that (even with merging cycles properly)…
  - Detect evaluate-X-while-evaluating-X cycles in computation; allow functions to override `cyclic` to do what they want (by default, it returns `error` or maybe even `cycle`).
  - Possibly a primitive that always creates a new object when bound, to oppose mergicity. Maybe even just (ref X), with more complex refs actually being concepts.
- Make _check into step, make regular functions override step, and give things that override `finish` a chance of defining what they'd do with their unevaluated args.
  - Make assign and forany/forall(/is) handle cycles properly (which I think just means ignoring them).
- Current `is` ⇒ `when`/`in`.
- Add some helpful txt.

---

8 November 2019.

Want:
- In code, […] ⇒ array(…), and have that assign numbers to each array it's seen and merge equal-number-constituents arrays together. …Except, how do we construct cyclic arrays then, especially from binding acyclic ones? Cyclic things can only arise from binding, so we can special-case that (even with merging cycles properly)…
  - Detect evaluate-X-while-evaluating-X cycles in computation; probably just return `cycle`.
  - Possibly a primitive that always creates a new object when bound, to oppose mergicity. Maybe even just (ref X), with more complex refs actually being concepts.
  - Make assign and forany/forall(/is) handle cycles properly (which I think just means ignoring them).

Okay, the system is finally at the point where it's working more or less alright. But I'm having problems with actually engaging the system after disengaging it.  
What is the word to describe this, laziness?
(I was talking about myself.)

```
Comments in `assign`:
- Maybe we should first see if we have *any* keys with for-in, before allocating.
- …Or maybe we should return not null-prototype objects (that aren't a part of `map` anymore), but (map k v k v).
  - See, the problem with that is, I don't care.
```

Time marks are for losers.

Want:
- Have `bound` merge its results, including its cycles. (How, exactly? If we may enter cycles from different points, just sorting all objects in a deterministic order and encoding sorted-index-differences in content won't cut it… may we? Or must we do deep hashes there; but aren't those sensitive to entry points too?)
- Have `ref` actually work. (Via overriding `assign`?) (One problem with our ridiculous caching might be that reading the value of a reference is merged, and so we can't ever actually read different values from it. Should we allow overriding merging, and have separate functions for reading/writing refs?)
- Have probabilistic `(is Value Type)`/`(gen Values Type)`.
- Have strings partially-evaluate themselves via returning `(unknown X)` which overrides everything with returning `(unknown (caller … X …))`. (Probably want `func` to override `unknown`, to stop this, yes? Or do we special-case func?)
- Binary array allocation, eventually… Due to merging and cycle-detection, multi-threading may not be as much of a win as we thought; still, we *could* provide evaluation modes that don't do either.
- Make (array …) not only a constructor, but also an actual assignable type, for escaping overriding in assigning. It'll break casual usage of array(…) in code though. Can we modify the base to make call-defining functions actual callable functions too?

Aw yeah. Something that feels a bit like victory, after half a year.

Break time.

---

9 November 2019.

A mind is a system constantly under development, construction and re-construction and destruction.  
Breaking one of its most fundamental components results in an inability to do anything, expressed in states such as depression.  
All humans are programmers and programs at heart. Most just deny it, never gaining any skill in development.  
Breaks accumulate, and eventually break the accumulator: midlife crisis, depression.

Modified base so call-overriding concepts can be called immediately.

Added strings, `(string Str)` or `"Str"`. Made binding go in the correct order, merging with objects on the way.

…Shouldn't things like if-s not only override `finish`, but also give finished things a chance to override the caller?  
Throwing result if overriden… Knowing what to check in the inner finish by, uh, a global variable, and care…  
Would this be a good solution? Or should we make calling code explicit, so that, say, if's branches (output pins) cannot override the if?  
`finish(v, caller = finish)`?

…Except the whole is not v, it's from a level above…
Not only do we need to carry the upper level's whole with us, but also the code.
And if we just set global variables, they'll only stay top-level if we are the first child-finish.
No… This idea won't work without …
Wait…
We could throw *the function*, and call it in the catcher…
I am a genius.

…Bugs, bugs, no clear source… Old fun.  
I'm just tinkering with no goal or purpose.  
…Aaaand it's fixed.  
Now, I can make strings do partial evaluation, adjust tests so they use things like `"1"` and not `1` for no-structure objects, and *theN*, a week after I wanted to do it, I can *finally* try my hand at probabilistic is/gen.

…AND NOW IT'S BACK  
I forgot to uncomment a line of code before, and now no good can exist in this world any longer.  
Oh, we check finish before even trying to call *, and the super-generality makes it return itself as an array, and then * is called with that definite result.
Just remove that test.

Today I found out that functions never even bothered to finish their result; a hold-over from when returning an array would finish it.  
Now, to find out why just binding the parse tree results in (unknown …) in the result (causing practically all tests to fail, currently).  
Even `error` does not parse correctly…  
…Ah, the `call` made to bind actually checks its values' overrides, one of which is very likely a string, and *stuff happens* (that is not binding). Fixed.  
And now, I'm getting infinite recursion on 3 tests that used to return themselves. Those that have a concept with a function that returns its argument… The argument (body) which is now finished by functions… huh. *I think I might know the reason*. The question is, do I say it's a feature, or a bug — if a bug, how could I ever fix it?  
These three tests of limited self-recording; we don't really need that functionality when we have `(unknown X)` fully working.  
Ehh, I'll just say it works, by removing those tests.  
*Now*, non-`"Str"` strings can partially-evaluate themselves via returning `(unknown X)`.  
There are no barriers left to engaging the `is`/`gen` creation routines. …Other than this day ending.

Want:
- Have probabilistic `(is Value Type)`/`(gen Values Type)`.
- Have `ref` actually work. (Via overriding `assign`?) (One problem with our ridiculous caching might be that reading the value of a reference is merged, and so we can't ever actually read different values from it. Should we allow overriding merging, and have separate functions for reading/writing refs?)
  - A separate-from-assign reading operation, overriding merging… But, if we do not ever copy function args to assign to them, we'll never be able to read a ref there. Should we copy function args (bind-to-nothing) before each assign, then?
  - Refs seem unexpectedly tough. Huh.
- Fix binding.
  - Have `bound` merge its results, including its cycles. (How, exactly? If we may enter cycles from different points, just sorting all objects in a deterministic order and encoding sorted-index-differences in content won't cut it… may we? Or must we do deep hashes there; but aren't those sensitive to entry points too, unless not cached?)
  - Have serialization depend on explicit unbinding.
  - Have `bound` with a not-yet-known context work? (Right now, this becomes the parents-first situation again.)
- Binary array allocation, eventually… Due to merging and cycle-detection, multi-threading may not be as much of a win as we thought; still, we *could* provide evaluation modes that don't do either.

This was, what, 3 hours? I am hardly focused on this senseless tinkering.

---

10 November 2019.

Can't super-easily figure out how to add lazily-evaluated thunks (an optimization for a branch of code that is likely not needed); *when exactly* to evaluate them?  
Since we actually have expressions that override their evaluation mode (`finish`), and have `if` which only evaluates one of its branches…  
Do we even need `lazy`?  
Well, we might want it in data structures; we could, say, generate a list of options, but have some actually unneeded and unvisited. How do we create containers?  
And, will it *really* be useful for us?  
…We could actually use it for code-pattern-matching scenarios (like, instead of generating a big array slice just to index it, we could lazily slice then index easily), so, yeah.

Proposal 1:
- `(is Value Type)`: asserts typeness of a value (return `error` if not). Ref-equality if not defined (or if `only`).
  - This seems more useful for type analysis than for instance-generation, though. And for type analysis, we also want "whether this expression, when evaluated, always returns an instance of a Type", right? And probably get-type-of-expr (always `Type` for `(is Value Type)`). In other words, functions must know their type by specifying `is` with their calls in the `Value` position. (What about the `Type` position, `is 1 of bit+bit type?` How to ensure bidirectionality of type flow?)
  - `(is Value Expr)`: could this expression produce such a value? (Knowing that there are holes in the expression.)
    - (This one begs `(reverse Expr Value)` — the type of substitutions of holes, suitable to be used in `(bound Expr Substitutions)`. …Or is that one `assign`? If there are many possible answers, should `assign` return `one` of them? Doesn't seem to fit *entirely*…)
  - `(is Expr Type)`: this expression must always have this type.
- `(gen Type)`: when created (`merge`, so a function call always has new expansions… Except, the function call itself is merged… Uh-oh…), returns a random instance for which `(is Instance Type)` is ok. (any/all/only usable as the type. `(gen (any …Instances))` is the same as `(gen Type)`)
  - (Do we need `(gen Type)`, or `(one …Instances)`, or both, first becoming second on use?)
- `(enum Expr)`: returns an array of all possible generations. (…Which won't be possible if `gen` uses `merge` to function.) The array can have the best picked out with binary operations. Inside `enum`, all `(gen T)` turn into "when evaluated, turn into… uh… `(superposition …Instances)`"?
  - `(many …Expr)` and `(enum Expr)` could be the counterparts to each other, actually.
  - Gen is like `(one …Expr)`… Turned into `(many …Expr)` and later collected if inside `enum`.
    - (`enum` is like a different evaluation mode. We used to specify different evaluation modes with `watch`/`trace`… Overriding evaluation provides the same functionality (inverted in needing-to-react) (and not evaluating any parts we want, or evaluating them as we want).)
    - (`(enum (…Array))` = `(finish (map Array enum))`, to use `finish` trivially, after an arg replacement.)

I think we might need to have a way of knowing the purity of an evaluated expression, so we could not cache its result if not always pure…  
And have `gen` not do the gen during partial evaluation.  
Some way of escaping non-pure effects, to be done on demand.  
`(pure Expr)` might be the way of writing this down?

Could we accept and return `(pure Value)` to signify purity of a value? If all arguments parts of a call are `(pure X)`, `(merge ourCall)` could actually merge (and the call returns a pure expression); otherwise, no caching allowed.  
We'll need to wrap every single value, both built-in network functions, and every result except where we don't want merging to be ignored.  
Or do we want `(impure X)` instead? RNG functions would return `(impure Result)`; ref access is impure. (Pure containers over impure results can still be merged, just calls with impure-containing cannot be cached… Pure containers with impure become impure containers when merged…)  
Do we want `(impure Value)` for results and `(pure Expr)` for escaping impurity? Is there any non-func context where `pure` may be used; does the full `at` qualify?

Also, isn't `cycle` a kind of partially-pure thing — the parent that was cyclic can cache the result containing it, but all the functions in between cannot?  
What, `(impure X Until)`? Or even `(impure X Unless)`?  
Where *else* would we use this power, though?

(Unrelated, but I'm thinking that we should expose the "call native JS, without concept checks" evaluation mode. I don't think it's possible to not get an infinite recursion when trying to implement the check itself.)

Proposal 2:
- Enumerable subsystem:
  - `(many …Values)`: overrides anything (except `enum`) to compute the caller with every single value (and every combination, if there are many many-args) (unless the value is lazy), returning many results. Caught by `enum`.
  - `(enum Expr)`: turns the resulting `many` into just an array. Functions (particularly impure ones, like random number generation) can override `enum` to become `many` of their possibilities.
- Make `first`/`last` work without being called as functions, again? Needed for the journal (so we could simply finish it to commit it).
  - Or should we have separate do-now and be-function first/last? The only impedance here is the names. first/last/firstFunc/lastFunc? first/last/try/guard? This last one *might* work…
- Promises doing a partial evaluation.
  - `(unknown Expr …OnFinishedRecording)`, calling expr-setting callback(s) (we may easily encounter multiple promises during partial evaluation) (ignoring `func`s).
  - Have an interpreter loop and scheduling, again.
  - When a promise returns, schedule bound expr. …Except, how do we handle multiple-promises-return-at-once gracefully? We want to merge binding contexts; how? Some check after scheduling, but before entering the interpreter loop… How can this be?
- Purity analysis subsystem.
  - `(purify Expr)`: partially evaluates Expr: returns an environment-independent expression that, when evaluated (`(finish Expr)`), always returns the same result as Expr. Override `purify` to specify environment-independent behavior (likely just returning the array being computed). `(finish (purify Expr))` is the same as just `Expr`.
    - …Would we ever have `purify` overrides that *won't* just copy themselves? If not, can we make it simpler; maybe `(pure X)=>0|1`, replacing the need to even return impure?
    - `(purify Expr …Stack)`: impurities that are only until what is fully contained in the stack are allowed.
    - `(pure Expr)`: returns the result if it does not depend on environment, else error (without altering the environment). Usable for non-general optimizations.
      - Simply piggybacks off of `purify`, for simplicity.
    - `(impure Result)`: used to represent environment-dependent results that cannot be cached, like a random number or ref value. Makes all computations with it impure.
      - `(impure Result …Until)`: results that become pure when all points in computation have been reached. Cycle markers (`cycle`) are impure until the parent call.
- Reference subsystem (everything here is impure, returning `impure Result` and overriding `purify` to escape itself):
  - `(ref X)` for creating actual ref objects.
    - `(ref X Type)` for type-checked (`is`) refs.
    - `(Ref)` for reading a ref; returns its current value.
    - `(Ref X)` for changing consequent readings of a ref; returns Ref. Non-overridable.
    - This is certainly convenient to use, but can we make a non-`ref`-based ref type, that can, say, access a network server?
      - Ref types should be defined by what they override. There should be some function applied to all subexpressions in the evaluation of `journal`… What to name it? Maybe `env`?… `(env Expr)`, `(env Expr …Transforms)` — the second form may be composable, but the alt-refs will see it… Should we allow it though?
        - Each transform is supposed to defer to the inner env explicitly (or not); so, env-transforming and env-accessing functions must be separate…
  - `(save Ref)` for creating `(map Ref Value)` of all recursively reachable refs.
  - `(load Save)` for restoring a `(map Ref Value)`.
  - `(env Expr Transform)` for specifying a function that accepts unevaluated ref read/write representations to transform their application.
  - `(atomic Expr)` for non-torn parallel operations: getting reads and writes then commiting the journal, retrying until succeeded.
    - `(journal Expr)` for getting the concrete list of reads and writes at this point in time, in `(last (readonly (R Read)…) (R Write)… (' Result))` form. (Evaluates Expr in an env that makes reads/writes impure-until-journal.)
      - `(readonly …Expr)`: asserts that writes either do not happen or do not change the read value, during evaluation of all these expressions.
- Generative subsystem:
  - `(one …Values)`: overrides anything (except `enum`) to substitute a random value (impure); overrides `enum` to become `many`. Changed by `enum` into `many`.
    - Is there any way we can extend `enum` with more things than just `one`; override `enum`? Yeah, I think `finish`-overriding functions will still go through `call`. …Except, they actually don't; we don't allow overriding an override, and just call the override-function directly.
      - …We should really have that native-call exposed (and use that in _getOverrideResult), because we shouldn't ever check self-override unless (self self). Direct and conceptual paths currently do not match.
  - Possibly `((picker Values→Index) …Values)`, specifying the function that picks. (Returning the index and not the value so that it can be used in `enum` to shuffle properly.)
  - Possibly get-probability-of-result. …Or are picker/prob part of a separate subsystem (as "distribution"), probabilistic one?
    - How do distributions work, again?
    - Is there anything else that the probabilistic subsystem would want? Pick-with-probability, probability-of-pick…
- Type-checking subsystem:
  - any/all/only as containers and escape-type-as-value.
  - `(is Value Type)`: asserts that `Value` belongs to a `Type`: returns `error` if the type-check (ref-equality by default) does not succeed.
    - Do we want this to be able to analyze the unevaluated value, so we could always eliminate redundant checks? Or analyze `unknown` values?
    - How do we generate, say, the `is` at the output of a function, when we have `is` at its inputs? How to get the type, not just check it?
  - `(typeof Expr)` analyzes the output of an expression, returning the smallest type that covers all its possible results. …Or should it be a function call, to be symmetric?
  - Want analysis, (Func Analyze)=>WhenAssertionsOk, so generation of function inputs is more precise… Should we have `(typeof Expr)`? But what about arbitrary-inputs-to-functions; `(typeof (Func X))` — wait, but it's not input-type, it's output-type?
    - `(is (Func X) (typeof (Func X)))` is always `(Func X)`. `(is T (typeof T))` is always `T`.
    - `(typeof (gen Type))` is always `Type`.
    - …But how would we analyze function *inputs*, not outputs? The type of function calls?…
      - `callsOf Fun`? And `resultsOf Fun`? Are these the best function-analyzing things?
      - But do we want type-of-expression-result too? (And can't we express resultsOf in terms of that, and an unknown-variable?)
  - `(gen Type)`: generates a random instance of a type (returns Type by default). (Use inside `enum` to get a list of all instances.)
    - `(is (gen Type) Type)` is always `Type`.
  - `(exists Expr)`: a type that fills holes in Expr, representing values that are its result; with `is`, checks if a result exists in result-of-expr; with `gen`, fills every hole independently.
  - …How would we check a property, like `(F a b) == (F b a)`? What is something like "do these types always coincide", "for all inputs (or instances of a type?), this holds (or belongs to a type?)"?
- Value-flow-reversal subsystem??
  - Just `(reverse Expr Result)`, returning the type of expr-with-this-result (that is, it can be generated).
  - …Do we really not need anything else?
  - Doesn't this reverse the `Value` of `is`, where `typeof` reverses the `Type` of `is`? Shouldn't this be in the same section as those?
    - Except, `typeof Expr` returns the single type, and value-flow-reversal does not simply invert the value.
    - Do we want `(reverse Expr Type)` (with `only` being a type for ref-equality), and its instances being instances of Type?
  - Do we really want to return the type, or maybe generate it already (relying on `enum` to provide the full list if we want it)?
  - Does a relation to `exists` exist here?
- Array map, reduce.
  - How to do stream map/reduce; an array with `(rest Unknown)` or `(rest (lazy X))` or something at the end?
  - Binary relations: best (/min/max), keep-geometric-progression-costs (in an array? Or in `first`?).
    - That second one seems useless — that is, what we actually want is to find fast special cases in type space with geometric-progression-costs.
  - (Have `enum` be a stream which can have `reduce` applied to it (with the ability to escape before end), with the above binary relations (or any other).)
  - Timed partial reduce… Or "enum-possible-solutions-for-a-time, returning the best one we can find", or "enum-possible-solutions-for-a-time, returning the best and the lazy rest of evaluation when the time's up"? Now *this* is podracing.
    - (`(reduce (enum Expr) with) with:(returnOnTimeout (least Cost) (ms 5))`.)
  - Should we have `search` — unordered (or ordered-as-we-need) reduce, which doesn't even need to evaluate the whole …X to potentially switch?
- How would optimizing output by changing inputs work?
  - Is this expression-based, `(optimize Expr CostFunction)`? Doesn't seem entirely right; where are the binary relations?
  - `(reduceEnum Expr ReducingRelation)`? Or even just `(reduce (enum Expr) BinaryRelation)`…
  - That's good and all, but how can we have unbound-variables that have their values optimized? Like coefficients in a fluid simulation, or weight tensors in neural networks…
    - Timed partial reduce with `exists` will generate those coefficients randomly, and be able to pick the best. But how do we *adjust* those randomly-created instances?

- Interrupt on timeout (by sudden-partial-evaluation if inside a deep native call)?
- Fix binding.
  - Have `bound` merge its results, including its cycles. (How, exactly? If we may enter cycles from different points, just sorting all objects in a deterministic order and encoding sorted-index-differences in content won't cut it… may we? Or must we do deep hashes there; but aren't those sensitive to entry points too, unless not cached?)
    - Is there any way other than "check equality of every node with every other node, possibly with deep cycle-aware hashing"? I can't see it.
  - Have serialization depend on explicit unbinding.
- Binary array allocation, eventually… Due to merging and cycle-detection, multi-threading may not be as much of a win as we thought; still, we *could* provide evaluation modes that don't do either.

After many hours of work, I've added two new features to the language:

```javascript
  0: false,
  1: true,
```

This is my code contribution for today.  
This day is a text-only adventure.  
The text swells in size, as it did before…

---

10 November 2019.

Fixed bugs and added more consistency in binding, finishing, assigning (and thus calling functions), partial evaluation. Added rest.  
Tweaked the big want-list of yesterday.  
But a few hours.  
LAZINESS.

…What I didn't do is directCall, among simple things.

…Actually, I didn't do a lot of simple things, like lazy evaluation (my favorite).  
This proposal is a gift that keeps on giving.  
This is the second… many-hours period, not day… that I chip at it, making only a small dent, with hints of more around every corner.

---

13 November 2019.

Wait, I thought I only skipped one day.  
No matter.  
directCall exists now. Took about 10 minutes.

Finishing binding now binds properly; transitioned from null-prototype objects in bound/assign/parseArrays to Maps (and/or functions). Took, what, 1.5h?

Thought a bit; merged `lazy` and `once` into one `lazy`.  
Took, what, 30m?

Nothing to do but `lazy`.  
…Except fixing one itty-bitty bug in directCall, and moving the directCall check from finish to call where it belongs (so we can actually compute its arg when using it, same as when using `call`). 5 minutes totes.  
…And except consuming sustenance.

Consumed 30m.

> What exists (even if only in a mind), can be optimized. What doesn't fully exist, cannot be optimized. "Premature optimization is the root of all evil."

Consumed and finished laziness. Took an hour.  
*Took an hour*. I was so afraid of it.  
And, honestly, I think the enumerable subsystem should be pretty easy to do.

Fixed a miniscule bug in network base, revealed by `undefined:undefined`. Took 1m.  
Added maxDepth to serializeArrays, because humans don't handle arbitrary nesting well. Took 5 minutes.

…Actually, no, enumeration has some difficulties: `enum` being unnameable in JS, inexplicable recording of lazy values that doesn't seem to make perfect sense to me…  
On the one hand, recording lazy values allows to not evaluate things if they're not needed, like in a timed reduce, good for infinities. On the other, we actually use `lazy` for non-enum semantics; if we use `lazy` outside of `many`, it'll still evaluate, but inside of `many`, it will defer.  
…Actually, I don't see much problem here; if we want to defer something, like RNG results, just return `(many (lazy …(Variants)))` (can't return `(lazy (many …Variants))`, because that will immediately get unwrapped). We will never *accidentally* defer-to-enum.  
Still; enum is unnameable. And it is such a good name too!  
Wait, we can get around that with `this`.  
Wait, we also need to not override enum by many, whose `defines` is a function. Foiled again! Need to come up with a name just as good, but not a keyword in JS.  
(All this thinking took an hour.)

INTERRUPT

> Of course we made mistakes. We distanced from anything humanity considers good, so that we could hopefully come back and enrichen it with knowledge of new horizons. Someone who's never a fool is never a master.

We probably shouldn't even involve `lazy` in deferring the enumeration of `many`. Otherwise, we'll have to wrap potentially-`lazy` results in something, be unable to specify actually-lazy values as part of the `many` — so it's clearly orthogonal. Instead, we should use `(rest (…X))` directly in `many` as a deferral that records `(many …X)` once instead of specifying right here; since `many` overrides `finish`, we can't have `rest` play a role here anyway, so it's perfect.  
BUT WE STILL HAVEN'T RENAMED ENUM.

---

14 November 2019.

Actually, we can still return `…X` sometimes. What we can't return without a `many`-specific meaning is `many` itself.  
Also, `list` is a good name for listing all possibilities.

(Made a lot of merging actually consider the array's overrides, by call(array(merge, x)). Took 20-30 minutes.)

…Wait a second. Waaaaait a second.  
Since we 'rewrite' in `(enumerate Expr)` by replacing every arg to `Expr` with `(enumerate Expr)`…  
If we call functions and those become expanded…  
Function bodies will not be enumerated.  
And we really need them to be, for this to have any robustness at all.  
…Though. Wait. If Expr's code is a function, we'll actually be calling `(enumerate (func …))` and not the original; this can be cached too.  
So this might actually work after all.  
…Now, how to actually evaluate the manys, in a limited-in-result-size fashion?

I'm having trouble continuing again.  
I can't just call in an interrupt — I don't have *anything* done, I won't be able to build a little bit more from this in the future.  
I WANT.  
SO MANY QUESTIONS, SO LITTLE PRECISION. I *need* to know exactly what I'm doing. I can't continue like this, here, at this fundamental hub to search and proof…  
An hour, and I'm further from what I want than when I started.  
Damn it!  
Interrupt!

Came back… tried a better approach… fell again!  
This is too important to fail, and I fail, so I'm frustrated.  
Too many options, not enough surety or capability.

…I smell hints of so many parallels: search/proof on listings of many possibilities, forany/forall on finite types, first/last on execution branches… Distributions in probabilistic programming, types in type-checking, switch/case in execution… I just can't do anything about any of these parallels is all.

I'm getting overwhelmed.  
Should I run from this, to hopefully see another day?  
Even with forany/forall, I still don't shuffle, and don't defer too-large computations in hopes that they're not needed.  
…Wait. Defer, computations… Doesn't this imply that we should  
I can't finish a single thought.  
Defer computations… Doesn't this mean we should actually bail out from a computation, possibly before we even attempt one?  
Doesn't this mean that we should insert, into `finish`, a "don't actually do this computation, just return (lazy Computation) and hope we aren't actually needed right here" possibility? Don't even worry about delaying infinite computations, truncating them will be automatic.  
My frustration yields another path.  
…It has problems though.
- First, we have intertwined `lazy` and `once`, but if we want to properly defer impure computations, we must not remember the result unless pure.
  - …Maybe we should explicitly check in `lazy` if the result is pure, and un-remember it if not (forcing a re-computation if seen again) (this requires purity to be developed, but still)? But that will not allow us to have vars… Looks like we'll have to have a separate `once` after all.
  - (…We can even make infinite-recursion-detection be probabilistic too. Then we won't have a silly amount of map-checks on every subexpression finish, and mandatory creation of array objects that represent calls; we'll have *occasional* checks and creations instead.)
  - Merge lazies (but not oncies), and only remember in the lazy array if pure. Altering merged objects… Yes, this is good. Unmergeness is a property of `once`, not `lazy`.
    - We didn't merge them before so that we could specifically do impure computations without worrying about results becoming as one. …Was most of this a brain fart? Is what I have in `lazy` actually completely okay? …But not merging them causes pure computations to not be synced up. What we actually want is something merged (with the pure result), within something unmerged (with the impure result)… Is this too much objectry? Does this rely on purity too much?
  - (We can have values be lazy computations, computations like adjust-variable-based-on-recent-good — silly little cause-effect number adjusters. Even the probability-to-be-lazy can be lazily computed, *many times*.)
  - But, we don't check conceptual overrides of lazy values. This is a big problem if we want to defer arbitrary computations like that.
    - …Should we _use each arg in finish, in the `.map(finish)` part? Would this solve the problem? Well, it would, but then we can't have lazy arguments to functions.
    - How else could we solve this problem? If one decided to be lazy, demand all to be lazy (interrupting the *whole* computation at once, probably returning to the interpreter loop)? Defer the conceptual-override-checking itself if an arg (introducing indeterminism to override-checking-order)? (I think both of them rely on having a special brand of laziness, that acts the same as regular laziness, and yet we can distinguish them. …Or, have the deferral always check overrides, even of lazy arguments to functions; this will make it more consistent to use lazy values too. Maybe it could work.)
- Second, we must be supremely careful with results of `finish`, and _use them wherever we need them, missing absolutely nothing. Are we currently always careful?
  - Surprisingly, there was only one un-use, in finish-bound.
- Third, `lazy` must be prepared for its result to be `lazy` in turn. This one can be fixed with, like, one line in _use.
- Fourth, (most) potentially-infinite iteration must be replaced with recursion that goes through `finish` or the like.

I'm coming to understand, types are useful. `finish` has a type like `Expr` → `Value`, but both `Expr` and `Value` have the same values, they are just used differently, generate differently.

…I've been relying a lot on distributing some property to all children, lately. This can probably be more efficiently done with having explicit environment. I don't know how though.  
I don't know anything. Everything just keeps slipping through my fingers, like the enumerable subsystem did. I try to build bases, but frequently fail.  
I guess I'll move on to trying to get the next base.  
…Maybe I'll make Proposal 3, that last one is getting a little too far away from the bottom.

(…If we made each expression/statement in a form controlled by us, we could alter them to use _use on their arguments, so that we don't have to… But we never did.)

Since I can't do enumerable subsystem without laziness — hugrk… Actually, maybe I can make a never-deferred evaluation-of-many. That's *bound* to help later.

I don't know how the above took… probably about 3 hours.

I think I've unleashed forces I'm not prepared to deal with. There are no shortcuts, there is only pain. What a pain.  
I suppose I can make the eager version of many-evaluation.

And, I did it.  
Looking at it, I am reminded of how fragile and small we are alone. Only together, with laziness in this case, can we be even remotely worthwhile.  
Only took half an hour, together with the tests.

Anyway, *now*, I only have choices between first/last/try/guard, promises, and purity.  
Honestly, these first two don't seem so bad. Well, maybe promises will turn out more difficult than I envisioned (scheduling…).

But  
INTERRUPT  
I kind of deserved it. *Kind of*. Look, being deserving isn't about a static standard, it's about constantly running into instances of both, to always be able to tell what to strive for and what to avoid. Too-restrictive constraints are practically as useless as too-permissive constraints.

…With direct references, I can get around the unnameability of stuff, like `try`. Now I just need to test first/last/try/guard.  
…And, now I've done it. Took, like, 20 minutes in total.  
I won't escape promises tomorrow.

…Actually, I added function composition too, just like category theory has, but with 'advanced' features like rest-args. Took 5 mins.  
(Of course, I added an inherent inefficiency by making the data array part of the initial rest array, requiring an extra rest-expansion every time.)  
It was just really easy, and potentially useful.

---

15 November 2019.

Actually, I *wasn't* done with first/last/try/guard/compose/id; I now added the ability to pretend that they're actually different concepts midway through their loops — an optimization to *actually being* those concepts. Oh wow, I optimized *something*.

Now… do I really want to try promises?  
I need, to execute, a callback now — but where to put it? In `schedule(Expr, Callback)`? (`compose` cannot be used to call the callback — what we want is something that doesn't react to concepts and calls back regardless, unless we have actually recorded a promise's unknown.) I think this escape-to-CPS is the only (good) way…  
How do we cancel execution, join and race different threads? `schedule` is intertwined with that, even if `cps` may not be. How?  
(Also, I never did figure out a good composable interface to racing; "maybe don't return from the current thread" never made sense, unlike "continue only when this has finished" of joining. Going to parent makes more sense, but now it's not symmetric with joining; if we go to parent for both, we'll have parallel-for and parallel-search. …Which sounds an awful lot like all/any (initial/terminal object) distinction, *again*. So, `(join …Exprs)` and `(race …Exprs)`?)  
`(schedule Expr Callback) ⇒ Job` and `(cancel Job) ⇒ Expr`? Or should Job be something that can be read to see if it's finished yet; a lazily-evaluated promise, initially, filled with a value when Expr finishes? We don't even need a callback then, just `(schedule Expr) ⇒ LazyPromise` and `(cancel LazyPromise) ⇒ Whatever` — or maybe `(fulfill LazyPromise Result)`.  
…Still, this doesn't actually help with implementing promises.  
A promise should return *something* that behaves very much like `unknown`, but is recognized by the interpreter loop separately.  
Should we actually separate `schedule` from `continuation Expr Callback`? I don't think the conceptual spaces are equal.  
…When a promise fulfills, it binds its continuation (which contains the Promise deep inside) with the Promise being equal to the fulfillment value. And if during the same tick multiple equal-expression bindings were requested, merge them… …But what if a Promise returns on a different tick, when the *actual* continuation is now different; we should update its continuation — how?  
All promises that we got during one partial evaluation must all reside in one object, like `(deferred Expr …Promises)`; going too long with some promises but not all causes a partial binding/evaluation, during which the encountered promises within are re-deferred (with a different object). …How would we get at this object when a promise is fulfilled; do we store it as a property of the promise object? But how do we get it in the first place; do we update properties of each constituent promises of `deferred` on every single override-hit; or maybe just on reaching the interpreter loop?

…I don't even understand *promises*.

…We should handle `(many)` (no values possible) specially during listing, since we might evaluate this lazily, and might have already reduced some elements; return error for these. (Also, found a bug, that (list "1") was not an array but the value.)

INTERRUPT, after having done nothing.

…I've actually done the promises, with the power of copy-pasting and adjusting the past; since recording is such a heavy-weight operation, I even left in a diagnostic message `<Deferring 1 promises…>` for when it happens.  
Once I knew what I was doing, it only took an hour or two.  
In this profession, you only need to find the right crack, and things are impossible to do until then.  
(And, I don't think that despairing about not knowing the right crack helped with finding it, it was just *there*; correlated in time, but not a cause.)

But now… purity…  
I remember side-effects; being able to record side-effects, like `console.log` in functions always being deferred, even if all args are known. Can we do that?  
…I… think so, actually — just need to mark the function as impure…  
Maybe I'll mentally load this subsystem in my INTERRUPT.

Made the result of first/compose/… be usable as a function; that is, if the nesting in code is too deep, we call code then re-compose our call with the result as code. 10 minutes.  
Anyway. Recording `unknown` is only applicable when we want to purify an expression, right? Otherwise, what we actually want is an error.  
Could `unknown` actually be how we convey the impurity of an expression, not `impure`? Or are they orthogonal? Does unknown-until make sense; computing the expression when we reach a certain point, like object lifetime or cycle's parent? …Won't it be better to be computing as we go along?  
…Wait, having until-markers with the meaning of 'all' implies that having none of them always succeeds. Is this consistent? I can't tell.

- Purity analysis subsystem.
  - `(purify Expr)`: partially evaluates Expr: returns an environment-independent expression that, when evaluated (`(finish Expr)`), always returns the same result as Expr. Override `purify` to specify environment-independent behavior (likely just returning the array being computed). `(finish (purify Expr))` is the same as just `Expr`.
    - …Would we ever have `purify` overrides that *won't* just copy themselves? If not, can we make it simpler; maybe `(pure X)=>0|1`, replacing the need to even return impure?
    - `(purify Expr …Stack)`: impurities that are only until what is fully contained in the stack are allowed.
    - `(pure Expr)`: returns the result if it does not depend on environment, else error (without altering the environment). Usable for non-general optimizations.
      - Simply piggybacks off of `purify`, for simplicity.
    - `(impure Result)`: used to represent environment-dependent results that cannot be cached, like a random number or ref value. Makes all computations with it impure.
      - `(impure Result …Until)`: results that become pure when all points in computation have been reached. Cycle markers (`cycle`) are impure until the parent call.

Now I don't understand *purity*.  
It seems… complicated, like I could simplify it. But I have zero ideas as to how.  
(Still, a good thing I've done promises today; there will be no callback hell, inversion of control, or really, anything that suggests there is asynchronicity. Since they're intended for big and long tasks only, like fetching from a URL, their overhead is fine. …We currently behave pretty much like parallel-for; is there a way we can behave like parallel-search, returning any promise result from given ones as soon as it's available? Would it be `(race …Expr)`, a part of an expression, overriding finish to look for non-deferred non-promise-or-fulfilled-promise results?)  
Okay, half an hour later, I have a working `race`. Careful with that polish, it might someday start to seem like this project is actually cared for.  
I mean, purrity INTERRUPT. …I don't get it at all. …And what did I say about the lack of understanding being uncorrelated with later understanding? …And how do you spell "uncorrelated"? I've been using it for years, and I never checked how it's spelled.  
How *do* `unknown` and `impure` relate…

…You know what I think?  
We should be able to match string parts too — and construct them too, actually, for (primitive) parsing and serialization.  
Okay, `(string "a" "b")` now joins strings, even `(string "sum = " (+ "1" "2"))` — no, not the second one; why? We do finish… Oh, we didn't bind inside a non-standard `string`.  
…Code just gets *stupidly* complex for no good reason, though I'm comfortable writing it.  
*This is a monstrosity*. Anyway, I have parsing (that is, separating beginnings/ends) working now.  
Only took about two hours. …Actually, I should document these possibilities in the description of `string`.  
…I really am doing some arcane magic that is not present anywhere in the code, but is present conceptually in my head.  
This is mad science. This is mad science.

…Having state at probabilistic-selection-junctions, and learning it, would allow taking advantage of linear-ish patterns in usage, going beyond just a flat learned probability… So that's how advanced learning works, by learning sequential state…

How *do* `unknown` and `impure` relate…

---

16 November 2019.

I made a blunder, actually — allowing `rest` in strings; this makes direct-call (`(f "abc") f:(string "a" …R)→R` ⇒ `"bc"`) and infer-args-from-result (`(g "bc") g:R→(string "a" R)`) non-symmetric. Fixing… (`(g (f "abc")) f:(string "a" x)→x g:x→(string "a" x)` is the proper inversion.)  
…Also, I don't think we merge things that override `finish`. If what they do is just and pure, we probably should… …Fixing this *does* make the code flow nicer, and hints that the two-cache scheme should be because we should have separate caches for `finish` and for `call`.  
One and a half hours later, I somehow get `cycle` in things like `(f (lazy "5")) f:x→(+ x "2")` (resulting in "NaN" being the result here); though if we did `(f "5") f:x→(+ x "2")` beforehand, we result in "7" as it should be (by some uncaching incosistency involving laziness). I can't see why…  
…Or maybe it doesn't involve laziness — another failing test doesn't. It's a convoluted one though…  
Half an hour later, nothing. I have absolutely no idea how to even find out why this happens.  
…Wait, I accidentally fixed it by making the `finish` of `lazy` uncache the result if it's not undefined. Nhhhhgh… I mean — just as planned, yes.

…Purity. The ability to tell if an expression is pure (…but how to do that, without executing it, for objects-impure-until-lifetime or for cycles-impure-until-parent? …If we know what it's impure *until*, we could have the stack in checking, in `pure`…), and possibly integration with `call` to only cache pure expressions… …Is a fully generic deep purity check (invoked at every `call`, to decide whether to cache) better than marking values with their full impurity information? I don't think there's a way to store/retrieve pure values without making them impure; so, maybe pre-checks are actually better, for CPU cache too?…  
What would `pure` return though, if it can accomodate both impure-until and pure-never and pure-always?  
`(impure …Until)`, `0`, `1`? Maaaybe…  
…How would purity-checking interact with `finish`-overriding functions? If it happens only on `call`, how would we know when to cache the result of `finish`? It's a choice between "never cache" and, uh, "are any calls inside of us `0` or impure-until-is?"… Any other option?…  
What *are* our options for arbitrary-evaluation-mode purity estimation?
- Execute the `finish` override, and be exactly as pure as the last `call` during the execution via the magic of global variables; making the expression exactly as pure as the post-transform expression. …This is assuming that all evaluation modes have the "transform then call transformed" form, though.
- Execute the `finish` override, and be as pure as the combination of purities of all `call`s right inside. Won't we need to store the parent expression in children, resulting in a global stack (array) of currently-executed expressions, slowing down execution with this bookkeeping? And won't it be possible to have the evaluation do something outside of the `call` model?
- Imbue results with impurity information, not expressions (like we originally wanted). While this will solve the `finish`-overriding issue, we'll *still* need to be able to tell whether a particular shallow-expression is impure (and how) (bringing us back to where we started, here — `cycle`), *and* require effort from `finish`-overriders to propagate results-used-inside impurity to outside-result.
- Check the `pure` override, and if `finish` is overriden but `pure` is not, assume it's always impure (probably by checking if the override of `finish` exists in the base of `pure`). The easiest for server-side, though clients will have to work more than with other solutions, but I think other options are non-viable.

`(pure Expr)`, `(impure …Until)`, `(purify Expr)` (returning `(quote finish(Expr))` if it's always-pure, or purifying all its parts otherwise), in implementation order?…

…GPUs, in Open/WebGL at least, are essentially register processors too; "register spilling" is CPU interaction (or, non-shader-execute commands) — change the shader, change some inputs/outputs… We'll probably need to tackle abstract limited-register processors both to handle CPUs and GPUs properly… (…Allocate-to-random-register, with code wrapped in search-best-variant?… Optimization *is* omnipresent, we just need to *have* it…)

After two hours today, I'm finally ready to INTERRUPT.

…Also, when caching, we should only do so if the result is not deferred; would be terrible otherwise. …Though, since we bind the deferred result anyway, thus producing a copy, it shouldn't matter. …Clean development benefits, I guess, somehow.  
…Also, `unknown` shouldn't put in results of environment-known evaluation into the recorded expressions, it should quote them. …And what about `deferred`? In fact, neither of them quotes all the non-deferred/unknown values — and they really should; we've been lucky to not run into problems with that. (None of this would have happened with perfect type-checking…) …This uncovered a whole nest of bugs, actually, like `((quote string) a b)` just assuming that `this` is `quote`… Oh no, we never kept track of types there correctly; overriding `finish` should *always* be separate because of different types, but we ignored that requirement… I was able to solve this with copy-pasting and very slight alteration. I keep doing this. …Except I wasn't — the non-finish version should quote, not the finish version; with it, bugs are back.

…You know, it doesn't look like I'm doing `pure` today. At most, setting old crimes right.  
Lazing about all day…  
There's one test that quotes the thing for some reason.  
…I spent twenty minutes trying to understand it, and it turns out that the new results are actually correct, and the test was wrong. This is the power of correct software, finding bugs in your own tests.
…I never thought I'd see the day where all tests pass, again…  
On to `pure`.

Cycles in inference computations; doesn't handling them (or, rather, ignoring them) correspond exactly to (possibly recursive) induction? If it is what I think it is, then we have a non-trivial principle in logic, handled with one line of code (and infinite-recursion-detection/caching infrastructure, granted).

(I'm enjoying the "have as many different words as you can" mini-"challenge" here. Won't use a dictionary though, only native parts and natural generation.)

Ten minutes later, I have `pure`'s core; I still need to do Ctrl+F on `finish` and add purity calculators to all that override it.  
…And make uncaching `cycle` actually return `(impure cycle Expr)` — *um*, except we don't stain values with impurity anymore, we check. This is a conundrum.
…And make `finish`/`call` memorize based only on whether an expression is completely pure, not constantly.

I find myself struggling with emotions, though; linear estimators put into a controlling role (feelings supremacism) in a randomness-based environment (as creativity causes), are a waste (less efficient than random chance). I don't wanna do this, in other words.  
There's an unsolved problem with cycles anyway. Can we solve it without literally running the program (and staining results in it)?  
…If we run into a cycle only on particular inputs, and we separate inputs from functions completely in purity-checking, then we can't know what a particular application depends on… So we can't solve purity completely statically…  
I don't want a partial solution that works for most cases, I want a full solution that works for all cases, even if it's much slower.  
So, separating purity-checking from execution was a bad idea in the first place.  
All my plans are useless now.
*Back to square one*.  
INTERRUPT.

There is one more purity-checking option: imbuing results with purity information. If we pick this, we might even move caching to overrides of `pure` — except, what would we do about the divide of finish/call for caching?  
Nope, I don't have a working head at all, only wool in a box.  
Still, sequential predictors are cool… Predict and adjust with typed (and quite finite) state…  
When we finish purity, we'll have a stable foundation to start building those.

The only way I see of how to obtain purity information perfectly is either `(impure Expr …Until)` or `(pure Expr …When)`, and we don't do "not perfectly accurate" here. Which is better, is the only question.  
…Well, we'll probably still want to have an explicit purity check in order to know what to escape when purifying; not/caching based on that would be the best damn bet. `(pure Expr)`⇒`0`|`1`|`(…Until)`, but not deep?  
This day was a *disaster*.

Not counting making `finish` not cache deferred results (probably necessary for no-promise interrupting), and, um, making tests use _schedule instead of finishing directly… These are not grand accomplishments.  
…Where do words go? I keep thinking I've put in a word, look back, and it's not there. There are probably many missing-word mistakes here.  
Just getting the foundation (purity, references, all that stuff with interrupting and laziness) might take me to the end of the month, if I keep procrastinating like this. Because let's be real, I can't think because my mind is filled with undesirable things, not because I'm dumb.

---

17 November 2019.

Today will be a disaster too.

Cleaned up a little bit: optimized `assign` a bit (by having `_emptyMap`), made things use `_isError(v)` instead of `v === error`, made `_deferred` react to `finish` properly, made `pick` check explicitly thus removing the only user of `finish`'s second arg and then removed `finish`'s second arg (which wasn't fully consistent with "`return undefined` cancels the override"), made `parseArrays`/`serializeArrays` know the default environment, added `(txt)` for showing all functions, moved caching of `call` from `finish` to `call`, extracted all the terribly-long is-wrapped-string checks into a function. `1`…`1.5` hours.

In merging: do not merge expressions that might evaluate to different things.  
In purifying: do not evaluate expressions that might evaluate to different things.  
In enumeration: turn expressions that might evaluate to different things into all those things.  
Can… merging and purification rely on having an override of `enumerate`?  
How do "impure-until" things express themselves in enumeration? If conditions are met (the lifetime of an object passes, or circular-recursiveness is resolved here), evaluate instead of enumerating? This needs `(enumerate Expr …During)`… And how would we express enumerable-when in the result; check …During manually?

I'm not feeling inspired.

Colored terminal output. Probably half an hour.  
I did find something troubling though: `(quote (a a:(a (a) a)))` outputs `a a:(b) b:(b a b)`. …And that happens because of merging in `bound`. Oh well, I guess I don't need to merge in binding… Except, not doing that will kind of make caching completely ineffective… I guess I need to debug this.  
Half an hour later… This makes absolutely no sense.  
…Wait. WAIT. We quote not just `a`, but an array to `a` — and the inner array to `a` is exactly the same as the outer array to `a`. In other words, I was wrong and code was right all along.  
AAAAAAAAAAA  
Okay, let me enjoy colored output for a minute.  
(Also, I found out that you can indeed listen for mouse down/up events via terminal escape sequences, even including modifier keys. I guess this makes it possible to eventually do a terminal-only visual framework. Oh no.)  
I have no excuse for not doing purity/(enumeration?)/references.

Does generating RNNs require enumerating all possible values of refs? Are references independent of purity?  
Damn it, there is *something* unifying in merging and purifying and enumeration, but I just can't see it, can't touch the understanding with my grubby mind.  
NN generation is "enumerate all type values, and connect each eqarg to our output"; RNNs connect to refs too, they don't just read the ref's value at initialization time, they assume it'll be dynamic. So, yeah, enumerating typed references should be able to happen. …NNs also enumerate outputs; can we do them with the same function?  
Unless we want to do "write a random value of an appropriate type" for RNN state-output, we must separate "enum all inputs to a function" and "enum all outputs of an expression". Which… brings the old interface back, of enumerable generative dependent types, with "type of expression" and "type of calls"… Type-of-calls for outputs fits in with CPS nicely, but we've actually avoided having CPS; without that, how to get the alloted call's output type; "type of call results"?  
`(func A B C Body)` has type-of-calls dependent only on `A`/`B`/`C`, and type-of-result dependent on `Body` (and on `A`/`B`/`C` through type-of-bindings (assignment-result)?). It fits.

Types… references… purity… enumeration… All pieces of one puzzle much greater than me.  
If they are intertwined, that means that I can start with any of them.  
…When I feel like it.

Actually, I was able to find some more trash I can do before even indirectly tackling those. In the last hour, I've only been able to do `unbound` in a manner that seems right to me; haven't really tested it yet; I'll have to wire it up to `serializeArrays` to see if it works. There's also making `assign` intermediate-concept-friendly, but I haven't been able to do that. (Also, we probably don't want to count escape sequences in string lengths, because now it breaks lines *far* too early.) It's midnight now; not now.

Also, about merging; maybe if an expression could return non-fixed results (signalled by overriding `enumerate`), we don't merge it? And cache always. Caching will not affect anything if expressions are different (which they will be, with every function body binding — uhhhhhh, pure functions containing calls to impure functions will still be merged… Should `enumerate` be recursive by default or something? It's an involved check then), *and* they can be explicitly made the same, annihilating the `once` nonsense. …It still doesn't make *complete* sense to me.

---

18 November 2019.

So, yeah, I don't want to do literally anything whatsoever today.  
Also, unbinding still leaves cycles in some data, like in `(quote a a:((a)))`.  
5 minutes of work today.

…Actually, I underestimated myself; with half an hour more work, I got `unbound` working.

…Actually, I also converted serialization to using `unbound`. It's only a hundred lines now (not counting `unbound`, of course).  
Fixed a bug, and…  
Colored output *and* input (as best as I can manage, anyway). Not too shabby. (A shame it can only be seen in console… We *could* have styling functions for literally every serialized component; put HTML-creating functions there, have a browser-server… Um… Oh no, this rabbit hole just keeps going…)  
I guess today wasn't a disaster-disaster. Still a disaster though.

Only types are left… and having remembered the anti/unification thing from Conceptual, I'm even less sure of how to proceed than before.  
(Having types *is* a key to proper serialization into languages, proper compile-time-ification of conceptual checks. I want that, uh, really badly. Like, generating graphs, generating cycleless expressions, generating function calls, unlimited testing works; inferring all function types from function definition… hnng.)

03:22. I just *had* to add completely-configurable styling.  
(And some beginnings of a multi-environment entry point. Only one environment for now, NodeJS.)  
It was just… really clear in my mind, for some reason.

04:46. And now, `bound` with a specified-in-language function doesn't work; it even calls `string` somehow.  
Maybe I should sleep.

---

19 November 2019.

Maybe dates are meaningless too.  
I don't wanna do core stuff… But can I make uncaching `cycle` disable caching until we return to that? I feel like just that would be better than value-tied impure-until information. If I can, I can *somewhat* move on from core stuff, because execution-in-different-contexts will finally be consistent.  
…I really wanna do machine learning though, but I can't without internet access. Not gonna.  
I don't wanna think.

(Conceptualizing everything could be done with `bound`, by replacing every single array expression with basically bodies of finish/call… Partially-evaluating conceptual checks will be possible then, and serialization to a real PL would be possible too then… So many paths, so few abilities.)  
(…In fact, we could even just replace every expression part with `(finish Part)`; the solution before is an inlined version of this.)

Me: "This is impossible! The complexity is too much to implement this!"  
Also me, ten minutes later: "So I've done this in 10 lines of code."

I'm free to not worry about (premature caching of) cycles anymore.

…Do we cache excessively now? Have we lost the ability to make impure computations, to not merge? …Eh, no, we just had to replace `merge` with `_maybeMerge` in `bound`.  
Hindley-Milner type inference honestly looks great to me. `typeof Expr`, with function types `(func …Inputs Output)` (exactly mirroring body), using anti/unification of type combinations, seems to be what it is (and I guess we can extend it with `gen Type` and `enum Type`). Simpler than what I had in mind, if I'm right.  
…Though I'm all over the place, my memory still works great (not for learning though). If I go back to a continuation, I can easily continue it. Though maybe sleep is better.

…`(+ (delay "1") (delay "2"))` seems to be broken. Uh oh.  
We have an infinite loop. Promises seem to get lost, or something.  
…  
Ah, what I forgot is to make a promise `p` into `(_deferred p p)`, which caused re-recorded promises to get swallowed (somehow, I don't care how). I guess I never caught this before because I never had randomized delay, and both promises here resolved in one step before.

…Structural types… The Wikipedia article on Hindley-Milner type inference may not be a good example of how to explain things clearly, but it did give me some ideas.  
Like, `(assign Type Value)` actually *is* `(is Value Type)`, or "get the instructions on what needs to be bound to what to transform a more general type (`Type`) to a less general type (`Value`)". And, combining this with dependent types, I can kind of see that things like `(+ x "12")` shouldn't simplify to just Number, but should include the actual computation instruction, or its value if we know it; only basically `(+ Number Number)` should simplify to Number; *and*, `(+ x "12") = "18` could infer the actual value of `x`, for *(dependent) type inference*…  
If these connections I see are true…  
*Then this will be so cool*.

---

20 November 2019.

Actually, there's *one* problem with `assign` being a subtype-transformation-getter: it quotes, when assigning a value to a label. What are we supposed to do with quoting of subtypes; …override quote's assign to look into the value?… We could have `only` as the resident "demand ref-equality in assign no matter what we compare" type. …Huh, I thought this was an unsolvable problem.

(I just want to say that it's always nice to realize that a thing you made for a completely different purpose actually has a different use, especially a greater one.)

I think I don't care about today.  
I'll need to do probably about 6 type-related functions at this stage (and then gen/enum). But I don't care. I'll force myself on them later.  
(Also, I think `typeof Expr` is the new `purify Expr`, but with better semantics, more understood.)

I made `assign` use an explicit inner function (`uniteMaps`), and propagate any potential deferred-ness that way — in about 5 minutes.  
It's almost making me feel like I can actually do something; a stark contrast to how I was feeling 5 minutes ago, when I was busy wasting my time. It's almost like creativity cures depression or something.  
And how fast I type; man.  
Still, not like I did anything of value today.  
Also… `finish` overriding basically *is* staging; I'll go make a note of that on `finish`.

> Make and make and make components. Make and remake components with other components, ever improving every single part. A never-ending quest reminiscent of life.

(`(broadcasted Function)`: acts like Function for non-arrays, but broadcasts arrays. Defining `+`/`*`/… with this would significantly ease the effort to make them broadcast.)  
(Lazy-evaluation should, first, do _use(part) on each conceptually-checked part (ending laziness for function arguments); second, be returned sometimes in place of evaluation (to root out bugs, and to prepare for partially-used infinite results); third, the interpreter should partially-evaluate conceptual checks, via compilation (re-establishing laziness for (a lot of) function arguments).)  
(And, to not forget, `both`/`either`, and wire up `any`/`all` to `assign`. …And `typeof`, and `gen` and `enum`.)  
(And, type-checking (calling `typeof Expr` and discarding the result unless error) everything before evaluating it; this by itself does not introduce any non-checkings, but if we do override `typeof` for some functions (like things that *must* return a Ref, or *must* accept a Ref, and doing so through a simple number), non-matching usages can occur, which we do want to detect.)  
(Features should come together. Slacking off is *wrong*. Why am I doing this?)

I have computations I need to check, but I'm scared of doing them, finding out I was wrong, and "undoing the progress" of my impression of my code… This always happens.

Today *sucked*. …And so will the rest of my days — but I want them to suck in a different way, by trying and failing, not by not trying.  
It is so lonely here.

(I'm feeling good about such a general interpreter. When interpreting the interpretation, it'll become a compiler. I just rely on JS exception mechanism too much and too cryptically to encode it in 5 minutes.)  
(…What are all these thoughts I'm getting?! Plain text is worthless! Go back to where you came from, to code!)  
(The one good thing is that now things like `assign` and `func` (and `finish` and `call`) now have (more) documentation.)  
(How can this be such a time sink, such a *pleasant* time sink? I expected to spend 5 minutes here on an entry and a quick fix of `assign`, but ended up spending an hour. Maybe creativity doesn't *have* to torture time-correlation-expecting systems like emotions, *with a proper base*, which this thing is painfully-slowly becoming…)  
(Can it be that I… love my job? Nooooo, it can't be.)

---

21 November 2019.

Maybe concepts should be attached to types of values (which are just values unless overriden, so we didn't see this before), not values.

Added some shitty _both/_either (those that don't use any/all, and instead just go straight to error or most-generic-type-of-all-things), and `(new)` symbol/name support. Made `lazy` merge. Half an hour.  
I find myself not wanting to do *the thing* (`typeof Expr`). (`(typeof (gen Type))` is `Type`, which is the only source of randomness now; and how do we incorporate `_both` and, uh, intermediate values?)  
…Every intermediate value is both an input and an output… But how to make inputs and outputs interplay to construct the result?  
Do we *need* to have modified-in-place type variables?

It's a lie. I can't believe it, no matter how much I've tried.

…When we question our very foundation, everything collapses, and the end draws near.

What is this an-hour-a-day shit?  
Well, I suppose, as long as I'm not hurting anyone else…

An hour of doing some random shit, like adding (non-type-checked) f64 numbers and broadcasting…  
I keep breaking and breaking the very core of my existence. It's supposed to be for a good cause, but I don't think I can survive this.

Added (bold) numbers. And made test debugging output colored. …Maybe underlined/bold styles should be swapped? Yeah, I like this way more.  
Having renamed `0` to `false` and `1` to `true`, this looks more and more like a thin front to JS.  
And made `+`/`*` not get smashed to bits (aka `(a _sum) a:broadcasted`) when serializing, by getting-from-env *before* unbinding.  
And fixed tests, to use numbers (much nicer-looking than strings).  
And made non-arrays not need naming when they reach max depth, on serialization, resulting in much nicer-looking output in some cases: `(f64 (+ 1 (a b c d a: 3 b: 4 c: 5 d: 6)))` vs `(f64 (+ 1 (3 4 5 6)))` while still having `((f64 (+ 1 a a: (3 4 5 6))))`.  
An hour.  
This is all basically garbage. I've been doing nothing but garbage for a whole week now.

How *do* I do *the thing* anyway? "Every value is `both` input and output" somehow doesn't tell me much. I know nothing.

…Had a bit of a brainwave, and added typed references — write via `assign`, read via `bound`. Obviously, I can't use them now, but it could make types sweeter. (5m)  
I should sleep; I'll probably be super-sleepy tomorrow.

---

22 November 2019.

idk why, but I added time/memory measurements, `(time Expr)`/`(memory Expr)`. And `least`/`most`. Those two groups aren't really compatible, because time/memory return an array including a result, not just a number… Make that into `with.time`? And make `time`/`memory` non-staged? Yeah, I did that; now it's compatible.  
And I did `reduce`. The function is literally as big as `most`/`least`. I don't care about efficiency.  
…And `map`.  
This was relatively really easy… To be expected, when I don't care about performance.  
I just stopped caring.  
160 LoC for this in total.

Tried to have 10% chance of trying to be lazy in `finish`… Yep, lots of bugs; about 20% of tests failing.

None of this makes any sense.  
My spirits are low.  
A fucking *infinite loop* without a stack overflow. Typical.  
I want to destroy everything.

I give up. I couldn't handle this reality.  
…Actually, re-running fuzzing, now it only fails 1-5 tests out of 60. So I fixed *some* bugs… Still not enough.  
I probably forgot to put _use on values, mismatching types. *Somewhere*.  
Is… is the lack of types frustrating my development into stopping?  
*Why can I not care about generative types*.

`typeof` now… so weak… so inept… I don't even want to help it. My drive is dead.  
(`_both`/`_either` are too weak to help too; they don't structurally-recurse on types, nor do they handle `any`/`all`.)

In the absence of deferring and promises, to slow down too-fast output, absurdly long empty loops work just fine (at heating up CPU too).  
…Infinite loops during purification of function arguments in `f f:x→f`…  
…More bugs; bugs on top of bugs while fixing bugs… Even just reading `f f:x→f` has now betrayed me. …Why? Did it work before; how the fuck could I have broken it? How could I have not noticed it otherwise?  
(Who knew that stopping evaluation of some expressions in func args would be so difficult.)
Wait — is *this* why `(f 1 f:x→(f x))` returns `(cycle 1)` instead of `1`? *Holy shit this bug is ancient then*.  
We enter `x→f` once, and we exit it once (as `x→a a:x→a`). WHAT. Even removing merging doesn't help.  
I don't understand.  
…Even `(quote f) f:(f)` has an extra set of brackets. …Except in *some* debug output, *for some reason*,

…Drained…

I know that if I take my eyes off it for long enough, I won't come up with a solution, I'll just forget it. But just staring and debugging and adjusting a bit doesn't help whatsoever.  
…Or can this actually be a bug in `unbound`?  
I think this may be a bug in `unbound`, looking at console.log and not console.log(serializeArrays ). I narrowed down the problem...  
...I can look into it later...

AH HAA  
Fixed the bug. I forgot to consider the "we ourselves have become named after naming our children" case, in `unbound`.  
Now, did I *actually* fix the bug? What was the actual bug, again?  
Oh, no, function purification is still fucked, this time through invalid binding.  
It seems to duplicate *something*, *somewhere*. I'm not even sure that binding's the problem; it could be bad caching in `finish` for all I know.  
…Or it could even be me being an idiot and putting `inputs` instead of `inputs[i]` in `func`.  
There are more bugs, actually; something with `purify`, probably. Something about nested functions.  
And, one minute later, I might have fixed it by just not going into `func`s on `purify`'s rewrites… Pfft, no, I didn't fix it. `(f 1 f:x→(f x))` loops infinitely, growing the stack… …`func` basically always creates a copy, so if it encounters itself within, it'll do the expansion again, bypassing the earlier cache of `finish`, huh… How do I fix this? There are more bugs, actually…  
Only one bug remains, the infinite recursion. I think I know a way to fix it… But I'll leave it until tomorrow. I'll then even have an excuse to go to code.

Will `(typeof Expr)` ultimately be replaced by `(purify (quote Expr))`? …And how would we infer/assert type equality, where every value is both an input and an output; is this even possible to do perfectly generally?

(`(gen Type)` just generates a single instance at runtime. We could… rewrite it; make it so it returns the same instance 99% of the time and re-generates it 1%; make it generate several at once and pick the best by some goal like execution time; make it so it uses `adjust Instance ByWhatever` instead of re-generating fully; make it re-generate 99% but remember any one from an old memory 1%; make it a variable that can accept adjustments; remember N instances and track how good they are, adjusting probabilities… Make it more able to learn.)  
(Will this need something like `usedIn Type`? Or a type of the current scope? Or, *what*? …Equivalencies? Adding-up-good and preadjust-by-function-of-previous-total-good? Type-checking; and a *probability* of belonging to a type? `alt Array ShouldThisBeRewritten`, rewriting-inside-to-reach-overriding-parts, which `gen` can go to town with?)  
(There is never a shortage of *ideas*.)

---

23 November 2019.

Somehow, *more* serialization/unbinding problems have appeared when I separated post-purification funcs into `func`. 20% tests fail, even though only one failed before.  
Actually, most of the fails were because I expected `func` in serialization and got `_func`; I now pretend that `_func` is `func`.  
Now there is only one. At least it now returns an invalid result, not loops infinitely. `(f 1) f:x→f` returns `1→cycle` somehow (though `f` is correct). …I bind `x` everywhere inside a function's body, *even in inner functions' args*, *even itself*; *oh*... Accidental name collision ahoy, with these semantics.  (The fact that it worked before was a bug.) 
- When binding function env, don't bind inside itself?
- Make function args shield binding? More consistent than the previous one, but still isn't consistent with "if a variable exists in an outer scope, any mention of it in the inner scope is a reference to it, not a new definition".
- Have something like `outerFunction` that shields from function arg binding? `notBody`, not-function-body?
- Invert `notBody` to have `closure` (making native-function-call syntax consistent with non-native-global-function-call syntax)? In fact, maybe have `closure` be an alternative to `func`, not a wrapper of it. The most consistent solution.
  - Do we have `closure` and `_closure` just like we have `func` and `_func`? Do we duplicate code? We could extract pre-existing code into globals, and reference those in both.
  - Or, to allow `!x→x` aka `(closure x→x)`, have it be a func wrapper after all? This makes going-into-closures not as trivial though — can't just not rewrite it and recurse into (not-going-into-func) children automatically… But it *is* easier on the eyes.

*Perfection*. `(f "1" f:x→(f x))` is now `cycle` and not `(cycle "1")`.  
…I feel like tests are taking noticeably long to do. I think my tests felt the impact of making function applications use env functions instead of env map. Optimization… No, not for us.

Now…  
`alt Expr` — how does it decompose into alt-overriding subexprs? A flat probability will treat single-alter too little and too-many-alters too much; scale it to graph size? So that on average there are N applications, say, 1… But, we want to apply not just to any node but to alt-overriding nodes, and should count only those.  
Could get a list of all alt-overriding functions, and pick a random one of these each time. Won't be very efficient to *still* traverse the graph to rewrite it.  
Okay, I kind of have `alt`. What did I want that for?  
…Won't we want to have `gen` forward alts to the type, to, say, change probability? Actually, no, `alt` is perfectly capable of detecting it.  
I should at least write down in comments in `gen#alt` what it should have chances of becoming.  
…I understand, like, one thing from what I wrote.  
And I want to do none of them.

And remembering just how bad function application now is, performance-wise, saps my motivation even more.  
(*60 tests* have a noticeable performance hit. *60*.)

The "generative types for programs" paradigm definitely is a powerful one, but having to consider all cases for each override of `assign` is so bad.  
Not to mention that I must make each generated alternative in the language itself. I'm kind of leery of using the (typed-via-`assign`) references I made.  
…Or maybe I can just have closed-over functions in function positions. As long as these have their fallback `gen Type` accessible to the graph. Okay, this makes work *possible*.

Like, 3 or 4 hours today so far.

What does "`Stateful`" mean, aka, "this computation first reads whatever from state then writes whatever from state"? How do we generate NNs? Or anything connected in some sane-ish way, really? We are too small right now. Can't think of any good way.  
…Maybe staying up to 04:30 three days in a row wasn't my greatest sequence of ideas.

…Empty…  
No inspiration, I'm just fumbling around.

I really can't come up with anything remotely good on my own; everything I do must be a consequence of something I've picked up.  
I should pick up a new language. Racket seems extremely able to assimilate languages, and its internal representation is much like what I picked; does it have types, typed Racket? Python and Keras? TF? numpy? — is very good for massively-parallel tasks like number crunching, and ML; it's not clean inside though, it's a number-crunching language. Haskell has some feature that I think is pretty much type-dependent concepts (definitions) (typeclasses, I think?); it's completely pure and inconvenient this way, though. (I never was able to get into REBOL.)  
I should turn official internet access back on.  
Get thoughts between doing stuff, not just hope for them.

Categories… generation… are they connected?  
"This value has a type T" means that the calculation of this value could have been done through *any* function that returns T, and we could replace the calculation. A morphism connects types… but we may want to have composite types, parts of which are either linked-to-existing-expr (where they match) or generated-anew. It's not an overt connection.  
Typed rewriting systems… generation… are they connected?  
I mean, how else would we generate an expression, and be able to connect to things we already know? Some similarities exist… but what similarities?  
…We have inputs — a collection of typed values. We know the output type we want; we have a collection of functions with arbitrary input types and output types. We repeatedly try to apply a random function to random inputs, to both get the value and the output type, and add those to the collection.  
*I don't know exactly what "typed" and "type inference" mean though.* Nor do I have a global "collection of functions", only per-type collections. The second one is workable; the first one slows me down so much.  
(I can generate products (arrays) and coproducts (`any`); type-checking them is, uh, idk how — or rather, I need `assign` that returns the substitutions needed to transform between type, not just type-checking; too complex for me to know. Besides, I don't know the first thing about `both` (nor `either`) (nor `all`).)  
A type-function like `(all Number Number)→Number`; a value-function like `(all X Y)→(+ X Y)`. In `(any …pileOfThings)`, find `(all (guard Number X) (guard Number Y))`; assign any-to-all (will accepting an array (product) instead fit? One intuition tells me that arrays are values and can't just pick-and-choose their elements from a set; another tells me that arrays are opposite to coproducts; another tells me that "any" fixes a single choice and can't magically have different things pulled)… But if we don't know that `+` returns a Number, it won't be a good idea to conflate type-function (`typeof ValueFunction`, *the result of which is applied to input types to get output type* — is *this* the intuition behind non-overriden `typeof`, for arrays? But this leads to expr interpretation — where's unification?) and value-function, right?  
…This actually sounds more like assignment of `many` to `many`.  
(I also have, like, 3 similar but not the same systems that do about the same things, for any/all, and the like; manyPossibilities and purify and typeof: unfinished shards that have hints of potential but no clue on how to reach it. It drives me nuts — or rather, drains me; makes me sad when I think of this?)  
I've no idea what to make of this.

When I think about things, they're kind of clear in my mind, but the moment I try to write them down and use them, they fade away, and it all falls apart.

Walls upon walls of useless drivel. Bah.

2 or 3 more (pointless) hours spent on deliberating idk-what in front of a screen.

> I have a particular personality type. Amazing at some things, but completely failing in others; able to effortlessly see things that no one else can, but being completely blind and unheeding sometimes. A personality type best described as "a grand system forever under construction". When it's finished, it's worth getting to know; until then, it's weird and jarring. Defined completely by neither successes nor shortcomings; both beautiful and grotesque. So versed in mind construction that it changes frequently like a program under a skilled coder's gaze.

…I suppose that was a tad obvious, eh.

I'm tortured with forever seeing the influence of the unseen, but never being able to see it. Or see but not touch.

…I'm a far better hacker than an actual developer. Damn.  
My mind is reduced to simple instinct.  
I can *use* behavior generation/optimization (and it's nice), but not implement it.

2 or 3 hours later, I made serialization work into DOM trees in-browser. Would still like to be able to do things like collapse nodes and expand refs, but this is still a good start. …Oh, and an actual REPL would be good too. …And tests that don't rely on serialization being a string, and can be launched and displayed in-browser. …And _log adding things to the document itself. …And pretty-printing (aka "switch to per-line display when too long").  
At least it gets launched, and serialized properly.  
Made tests work. Only REPL and DOM pretty-printing left for comfortable browser interface (as comfortable as Node's, anyway).

---

24 November 2019.

Made an in-browser REPL (and "switch to per-line display when too long"; too lazy to add breaking of long strings, so they can still easily cause a horizontal scrollbar).  
Pretty much NodeJS REPL, but in the browser, and with hover-highlighting of deep structure. …Well, no history command, but I'm lazy; commands can be copy-pasted anyway.  
Making it was so fun, I couldn't stop.  
3 hours?

Anyway, I had Python, and I wanted to try do expr-gen in Python.  
Python, it turns out, has so many neat little features around functions and stuff that I'm not at all surprised that it is used for science (or, ML).

While I kinda did not implement the generator at all (and got distracted implementing conceptual checking), I did learn some Python.

---

25 November 2019.

10 minutes.

I'd need to support self-modifying code better (basically static variables); memory-enabled generation basically is that. (Right now, all modifications will be lost between calls.)

I had beautiful thoughts in my head. Display-overriding values; REPLs within REPLs; generation with static memory replacing `alt`-seeking; structure-extracting and fully-customizable parsing; time-dependent views, which we can know when to not call constantly with purity; *delete buttons on REPL entries*. Then it all ran into procrastination. Nothing lives here now.

…Make that half an hour.

And, I have some serialize/unbound bug again, in `(f 1 f:x→(f x))` (becomes `(b 1 b: b c: (b x))`)…  
And removing the "double-depth conceptual lookup" wart (and "functions override `finish` to not finish their arguments; why not just quote those arguments?" — actually, we can even not-quote, and even single-depth conceptual lookup ensures not finishing those things) went poorly…  
*Why does something like not-cloning-the-output-element-on-first-use break things.* And why do we now have so many `[object HTMLUnknownElement]`.  
Stuff like this are why I never want to come back here.

…Make that one and a half hours.

---

26 November 2019.

Things unbind in browser in NodeJS differently now???  
Oh, the difference is that we don't have maxDepth in the browser, and we're exposing some meanie bug in NodeJS… Okay, now it at least *makes sense*.  
Hah; an hour of thinking, and it was solved by `names.has(copy[1])` => `!ignoreName && names.has(copy[1])`.

An hour of tinkering, and I've added smooth appearance/disappearance of elements in the REPL.  
I don't know why. The code is horrendous.  
Well, I can't deny it… *it looks so good*, even though it's bad under the hood.

At least an hour more, *still on visual stuff*; I have to stop. Though I feel no inspiration either.  
I *probably* should think of how to implement self-modifying code in Python…  
Or make a literal REPL element. Um.

At least an hour more, *still on visual stuff*; I have to stop. (Yes, I do have REPLs inside REPLs now.) People usually think that amazing-looking stuff has amazing code, but… yeah… (Well, *one* thing I'm unhappy about is everything being display:block instead of table, and margin-left:1em not actually counting in block-width calculations for some reason.)  
Also, trying to add `.` (aka "bind the whole current context here"), and I find out that circularly-deconstructing stuff doesn't work so good. I'd have pasted the wrong output here, but it's enormous. (And, there is `. [object Map]` in there, after the second `.`-level.)  
(Hovering over labels highlighting all its occurences, and maybe even setting the title to serialization of its actual value… That would be a nice feature.)  
This is the end for me for now… But, damn, I had fun.

I *really* lost it, the track of time.

---

27 November 2019.

Made (bound-to) labels from strings to `(label String)`. I thought it was very involved everywhere throughout the codebase, but there were a dozen or two uses; it went by quickly. Removed a test that relied on old behavior. 1 or 2 hours so far.  
I need to make strings sane too (so that working with strings is much more natural, and just like JS), then I can try to make functions *as fast as a regular interpreter, and not copying their bodies each call* (woah).  
Also, I like how error messages now glower at you (via a white text-shadow) if you try to shove it down (by holding down enter).  
Also, I love how failed-tests messages pop out, smoothly. Maybe I'll want to make tests fail more often now.

I haven't been adding tests for quite a while now. Closures, for example, are not covered in the tests at all.

One and a half hours flew by unnoticeably.

…Bizarrely, I don't know how to spell bizarrely. …I mean, bizarrely, I don't want to *make functions super-efficient* (relatively to how they are now), with such benefits as allowing self-modifying code, overridable equality (by overriding `assign` — relevant when we have multiple same-label args, or in closures; the return value of `assign` is freed up to become anything non-error to signify success), consistency with actual PL practice, *and speed*.

Everything that doesn't conform strictly to the `Concept:{defines}` or `Func(){}` model: `Promise:{prototype:{defines(…){…}}}`, `Map:{prototype:{defines:{…}}}`, `_funcPlaceholder:{}` (used to give a free unique non-merged object for `func` to use). If we move Promise/Map to _load, we can just have `Concept:{…Defines}` directly; if we also have a "JS function from its string" function, we'll be able to have `deconstruct` turn every global into its conceptual representation.  
…Using English language really does involve lots and lots of goals — approximate constraints on things; label-usage is much rarer than synonym-barrage.

Also, *damn*, `(a a a:(new))` is now `((new) (new))` again. I should really add this to tests (oh, and fix it too). Called once, deconstructed once, but present in the output twice; huh?… `deconstructed` in `serializeArrays` is wrong — pre-deconstructed output looks good, post-deconstructed fails to turn the second symbol into an element — wait, how are we getting a DOM element in deconstruction anyway? From `unenv` there. Okay, I was caching the modified, not the original for deconstruction — not anymore. I even added two tests of `new`. Even `.` now works correctly.  
…And what the hell happened to height transitioning to 0. Something is fishy with `display:table`…  
This was half an hour to an hour more.  
I'm just squeezing out all the low-hanging fruit I can find.

I guess the next "big" thing (in BIG quotes) would be either changing the network base to make `{defines:{…}}` into just `{…}`, and modifying the code accordingly (reducing indentation by one tab-equivalent almost everywhere); or making functions create a new label-environment (and have assign-to-label fall through to assign-to-its-value, and having `(closure Func)` return `(closure Func Env)`, which is callable).

> WebAssembly moves towards unification of all computing environments. That ultimate fate awaits all things that live long enough; it is not a question of 'if', but 'when'. Singularity in all things, you could say, not just AI or mass.

I'm over-using quotes; what I quote isn't even remotely profound. Obvious to anyone with half a neuron.  
Anyway, I changed the network base, to make it less clunky. Nothing great.  
And now, hovering over a name (or any copied element) highlights all its occurences. Now, if only *function args* highlighted the same… Well, that would require each function to style its equal-name labels as `name` (or whatever we named that) (by rewriting into styled version). Is that possible?  
…How would we highlight closures though, *especially* ones merged with another function's closure, but still referring to different environments?  
(Triple-click now selects the actual highlighted node fully.)

Another thing we might want to strive towards is making names consistent across REPL, so, say, `a:()` would create a variable, `a` would read it (without mentioning `a:()` in its serialization, just `a`; hovering over it would highlight both occurences), then *deleting* `a:()` would make `a` inline its variable visually.  
(We could then have an expandable prelude, containing the whole environment in decomposable form.)  
And, well, the ability to view the full form, for copy-pasting and such.  
…It probably won't happen, since I'm spending so little effort on all this. But still, would be nice.

> There is lots of philosophy surrounding this code. Not because it's worth saying, but because our code can't reach to where our minds walk.

…Oh no, multiple-promise-contexts-at-once seems to not work great. …But only with different REPLs? Maybe?  
Ah, I think it's because, while promises' `.then` can handle multiple receivers at once, *we* don't; I think we overwrite a promise's `.expr` and such when we listen to the same one in different environments. Good thing I didn't dismiss this bug when I tested it again and it seemed fine.  
…But if we don't overwrite properties, re-seeing it in the *same* environment would attach a superfluous listener… And, if a promise completed in the meantime, we won't be able to update the listener with new info. …This *is* a conundrum.  
Okay, possible solutions?

- Live with our failure to provide consistent promises. Is that a jape? Not an option.
- Keep track of an array of expr/env/cont; add to it to listen, remove from it on re-recording. Kind of costly, and hard to implement (harder than the current solution).
- Store expr/env/cont in the continuation closure. However, we can't remove-then-add this continuation closure; this option is out.

So, by elimination, we *must* keep an array of expr/env/cont.  
And, I now do. It works fine now.  
Also, I fixed non-smoothness of logging to a non-already-resizing (or resizing-already-finished) parent.  
It's getting kind of late. Oh, me, always working at night.

Next, I'd need to interpret functions with environments *properly*; not an incremental task, I'll break things until I can make this in its entirety.

(Also, hey, if we have an overridable `name`, we could use that to specify suggestions for variable names. Serialization could look *so much better* then.)  
(Also, `directCall` doesn't seem like a very good way to provide concept-escaping; if we rewrite functions to always concept-check, this won't fly. Instead, a better way is `(typed Type Value)`: concept lookup happens on Type, but _use(data) returns Value. I *think* this checks out.)

(I'm forced back at every turn, forced to compromise everywhere, unable to reach almost any satisfactory results. Though I *am* able to reach *a few*, though, not enough.)  
Man, this whole thing is so unfinished. This is totally un-show-to-people-able.  
Let it stew, let it brew its inner form.

---

28 November 2019.

Bluetooth (on Ubuntu, at least) might be the most garbage piece of software I've ever used. In my experience, I had to reboot my OS once, it has practically no error reporting (beyond "there was an error" — it's just like me, currently), and it doesn't accept .js files for some goddamn reason. Make its developers be damned to eternal suffering of rewriting garbage code, please.

…Actually, closures are an even more formidable opponent than I thought; modeling them with a flat map would cause closed-over variables not in the original but in the closure to not only change (allowing inter-closure state communication), but also *persist between calls to closures* (which is not acceptable at all).  
…Wait, I can just use `bound` to bind in `closure` (and then even partially-evaluate the result, which fits with the theme of "suppose all operations are extremely heavy-weight, so do about as much as is possible in advance").

Added support for naming results of functions in serialization. Graph structure can now be more human-readable, yay (though I haven't actually encountered any differences myself).

(We could maybe use `(typed T V)` for `+`/`*`, because currently, we have no way of defining something that behaves like `broadcasted` but has its own definitions of `txt`/`nameResult`.)

Kind of made closures and functions, but there is a problem. `(map (5 6 7 8) (func x …(0 x)))` erroneously returns `(0 5 0 5 0 5 0 5)`: we assume that equal-structure things are always equal, but in truth, bodies are now dependent on environments.  
Honestly, this seems pretty… unsolvable. I mean, what are our options? Have each environment maintain its own finish/call cache (caching granularity is then not nearly as good as it can be)? Have the slice of env that finishing depends on as a guard of the cached result (good luck coding *that*)? Not cache on `finish` but only on `call` (again, caching is not as good)?  
…That second option; have environment reads and writes stored too (and writes rewound)… hmm. It kinda echoes back to journaling…  
But, this is currently our only failing test, so we *can* ignore it.  
Actually, no, trying to preserve env has caused more tests to fail; assignment doesn't like being finished instead of called.  
Okay, I fixed it…

…Isn't "making caching per-label-env" the same as "compile functions, putting each multiple-occurence intermediate result into a var"? Or, "multi-occuring ⇒ `(assign LabelNotSeenBefore MultiOccuring)`"? These interpretations seem like an acceptable loss of caching granularity to me, so the first must also be acceptable.  
…Do I implement it with some forward-pass, bind-expression-before-evaluating? What, in `finish` or something — isn't that too computationally-expensive and stuff?  
And, how would multi-occuring-inside-quotes behave?  
…Should we just make `finish` do its cache inside label-env, so it could be purged and restored by function calls?

The useless things I do… I now use `structuredSentence` mini-parser with syntax like `{this is long}` to convey sentence structure for messages.

…I should make the name allocator an option, so that non-displayed serializations could be faster. Or, uh, it depends on being able to access a local var, so, probably an option `nameResult:false`.

Okay then. Next would be either… Um, I lost my train of thought. What do I remember, as unfinished? Functions binding their explicit labels in serialization; generic styling parser; caching of finishing; Python thingy with static and others (I never came back to it after that one day)… Literally can't remember anything else.  
Oh, adding tests for closures. I just *know* they're gonna break.  
…But *things breaking* means "an opportunity to fix things and get stronger".  
Okay, I kinda made and fixed tests of closures, but there's a strange problem now: `func` doesn't get extracted into a variable, only in the test? Oh, is that because `func` and `_func` internally are different things? Okay, I fixed it.  
66 tests.  
…Oh yeah, also, making tests into function-relevant overrides, and have `(examples)` (very good for explorability too).  
I have two and a half things I think I *might* be able to do. *Later*.

---

29 November 2019.

On unification as the fate of stuff: "In the *end*, the best thing wins. The best program is one that can do anything. It's not complicated."

> All code is already self-modifying. JIT compilers are one thing, but even using some code written to a specification (like third-party libraries), it will still be changed out from under you (like switching to the next library version), and you won't even care. In speaking, the precise meanings of words evolve constantly, and the user rarely cares. Fully supporting runtime self-modification at the language level is more honest.

(As a person lives, its words and meanings get birthed and killed. When creation wins significantly, it's inspiration; when most words die, it's depression.)  
(None of these words have a precise meaning, because, you know, self-modification without a precise-serialization capability.)

It makes more sense to break not on height≥30px, but on firstChild.top < lastChild.top. Either break none, or break all. (Doesn't really work for vertical languages, but, whatever.)  
Okay, apparently, `("txt")` is parsed as `(txt)` or something. Maybe because of some bug in binding. Okay, fixed.  
Made the finish cache per-label-env. All tests now pass.  
Made equally-named labels in functions merge visually. The whole value-flow is now fully visualized.  
One and a half hours, and I've done all I wanted to do today.

What was supposed to be next on the evil agenda?  
Either styled parsing (how to return the styling information, and how to *preserve* unchanged styling information, so we can cache?), or generic parsing, or guided self-modification ("make proposals for alternatives, and in minimize/maximize, we can associate each proposal with its result and apply the proposal with the best result"), or "making tests into function-relevant overrides, and have `(examples)`", or making `deconstruct` work on created-initially functions/concepts, or separation of traits/concepts and values (which, I don't really know how to do).  
Eh, procrastination it is.

I found nothing I can use.

Okay, creating `(js.function Source Context)` (for `deconstruct` on global variables) turns out to be difficult — have to compile Context eagerly, and use either compiling-in-the-same-scope (fast but only applicable if contexts don't have conflicting values) or backpatching (slow) to handle dependency cycles.  
What about that `examples` fella?  
Okay, probably an hour later, done.  
Now, about that graph compilation… Oof.  
I kind of have no concrete idea on how to do it.  
It was supposed to be the easiest thing here, but it is actually hard.  
Can I rise up to this challenge? If not, I have no business tackling harder problems.

Damn, that chaos of arbitrary self-modification is really getting to me; I can't think of the correct stuff. Can't let go of (lack of) thoughts; a failure stops thought entirely, rather than redirect it as is proper. Can I enter a state with less memory and more *solutions*?  
Been a while since I threw up walls of text that slowly morph into a solution.

(…If we separate concepts into types and values, would we want data-concepts overriding code-concepts be type#value, or type#type? The second is checkable as soon as types are available, giving a big win for statically-known types…)

Ehhh… can't think…  
But I've been partial to highlighted elements displaying their position minimap on the scrollbar.  
Okay, .5…1 hours later, *one more* thing that looks amazing; all thanks to animations (and, I sure do love my royalblue box shadows). Just pile it on, why won't ya.  
Played with it for half an hour, made fade-in smooth too…  
I can *hear* my CPU chugging from all those transitions.

(Examples could be better, with actual evaluators used. Still, the fact that they are accessible means one less thing to worry about in the future.)

What am I doing? I was supposed to be procrastinating, and now it's midnight.  
…Um, tomorrow would be JS function graph linking and styled parsing.

---

30 November 2019.

I'm sorry, everyone. I don't know what happened.  
I guess I should at least outline some plans.  
I guess I'm entering the non-shitty stage, where lots of actual effort is required. Where I need to reach out with my mind, and do what I've always wanted to do. A realm of excellence.  
I'm intimidated.

> A language should be most-general first, and derive things like "most efficient" only as special cases of generality.
> When you make code, you first think through it extremely carefully, and only then use that understanding to run it much faster. Why degrade code to lesser fates?

- ✔ Have `1 2 3` at top-level mean `(1 2 3)` (while `1` still means `1`), not an error. Slightly less bracket-clutter, more convenience, and `_log` won't have to remove brackets manually anymore.
- ✔ Have `object` be able to be assigned to, including `…Props` params. Maybe rename `object` to `map` (since "map" implies an arbitrary specified-case-by-case connection, not a semi-mathematical connection) and rename `map` to `transform`.
- Maybe, do something about `unknown` — can we re-formulate `purify` to not use `unknown`?
  - Also, `purify` not doing anything about not-yet-executed branches of `first`/`last` bothers me. Should we allow `purify` to be overriden, and do proper purification for those?
- ✔ Arbitrary-dependencies linking+compiling of JS functions. Have `deconstruct`  deconstruct functions.
- ✔ `serializeArrays`/`parseArrays` ⇒ `serialize`/`parse`, and adding a description for those.
  - ✔ Parsing being a function like `parse => parse('(') && parse(subfunc)`; `parse` is a wrapper that appends (styled) HTML or backtracks if returned `undefined`.
  - ✔ Parsing also outputting a styled tree (as a third array-result, iff style-transformer object is specified).
  - × Parsing also being able to take a styled tree and remembering a subtree's intended text (checking it against its .textContent), for caching speed-ups.
  - ✔ Input being parsed (and thus styled) as it's inputted (throttled by the last parse's duration). Won't catch binding information though.
  - ✔ Apply binding information to parsed input.
- Have `read Thing` and `write Thing Value`, and read/write journaling (virtualization) available separately (`reads Expr`, `writes Expr`, both returning `(Result Key Value Key Value …)`; maybe `read`/`write` can also accept this key-value input to check/apply a journal). Ref objects are one thing that is modified, but all self-modifying code should use this (and `finish` should `read`).
  - Have `alt Expr` write the picked alternative (if overriden by Expr, and if a roll passes) to `Expr`. Intended to be used on literally every expr by `finish` (or `call`).
  - Have `minimize Result→Number Expr`, and `minimize.repeat Expr Result→Number Times` as its (currently-only) special case: it journals all writes to be able to associate a result with its writes, and applies the best result's journal. (Also the `maximize` mirror counterparts.) This gives feedback from goals to generators.
    - Also have parent-goal minimize/maximize, so that adversarial learning is possible (a subexpr minimizes what an expr maximizes) — using `many`.
- Have `concept Concept Value` (for multiple views on the usage of the same thing), integrated with `use` (or `_use` as it's known now), and `resultDef Expr` (needing to execute Expr in the worst case, but not having to if defined); concepts (but not values) can override `defined` to provide a checker. This makes it possible to do at least *something* with a JIT compiler, since in a compiled chunk, we only need to check inputs and pre-define result, and can inline and partially-execute all the calls; can't do number operations with any efficiency without this. Not exactly type-checking, but still something to provide safety.
- Visual niceties:
  - ✔ Have scroll-position be properly moved to end (if it was at end) during, or at least after, transitions (right now, only scroll-to-focus saves the day here).
  - Have .broken elems update their brokenness on resize (probably throttled to operation's duration).
  - On half-a-second hover over a bound name, display its value in a popup *unless it is fully visible on-screen*, so that scrolling isn't required.
  - Have `elem Describer Func`, collating info from `txt` and `examples` and `deconstruct` in a nice manner. Have accessing the page with `#name` (or changing the hash) describe the named global (in a removable message before REPL). Have hovering over a global for half-a-second create a floating describer.
  - Have returned-to-interpreter-loop promises log an in-progress spinner/placeholder (that is removed when anything is logged after). Possibly provide an overriding point for this, to be able to display stuff like `Fetching 2 files…` — but, how, exactly?
  - Have an expandable-content (probably collapsable-afterwards) button ···, knowing the value but not serializing it until expanded (with an overridable description until then).
  - Permit these outside-value buttons in REPL input, and have Shift-clicking a highlighted node send its value (associate styled nodes with their src values, btw) to the previous cursor/focus location.
  - ✔ Use `purify` as input comes in (throttled), and if fully-pure (is `quote ···`), display the result below input.
  - Theoretical:
    - Maybe, have `elem Defines` auto-set .defines on the resulting DOM element, so it could override stuff? Or `elem Tag Content Defines`, and have styling be a matter of overriding styling, not a separate thing.
    - Have objects display in a table, `Key —→ Value`. Allow expressions to override their DOM serialization?
    - Some way of assigning to key maps or event sets or interaction descriptions (like "can hover" + "can click" + "keyboard"), for potentially-smart allocation of interactions…
    - Have a separate-from-async/_deferred way to interrupt a running program, with the ability to re-execute it. Freezing the browser from one mistake (like too much logging) is not great UX.

On one hand, that *is* a respectable product then. On another, ***holy shit***. I'll need to get my serious mode out for this if I want to see it.  
I'll do at least 1 little thing now; `1 2 3`. …In parsing, I did it in like 10 seconds. A few minutes in `serializeArrays`. The experience is even nicer now, a little bit.  
Unicode adventures: ☑, ✓✔✅, ⸻. Now *this* is a distraction (half-an-hour long).

---

1 December 2019.

This was supposed to be a journal of feelings. But the only thing I feel important is *the thing*.

Lots of sins left in the codebase still.

I think arbitrary-overrides can be made easier to use, more intuitive and streamlined, if we had `defines:Map{overrides:…}` mean the same thing as `{defines(f){…}}` did before, with the semantics of "consult the generic getter iff there is no specific case"; we do specific-case checks in functions anyway, with awkward extraction of definitions to global functions. And, I made it.  
Errors should record their arg sub-errors, for much better error-reporting (getting just `error` back from a complicated piece of code is not great UX). I now collect error info. Some day, I'll need to make all those `return error` into actual descriptive error messages.  
A little more than an hour.  
The more things I do, the more I realize how little I have done.

Renamed `map` to `transform` and `object` to `map`. Made `assign` not return maps anymore (it returns the last of sub-assignments instead, for arrays); removed `uniteMaps`.

(It slowly occurs to me that I've been doing concepts wrong — `concept(View, Value)` should return something that is never a Value; only then we could do things like have in-language and native functions share the same "use this thing" structure. I'm fine with all this messiness of typing now, but it'll come back to bite me later: I can already see quoted supposedly-data-only arrays trying overrides in their heads, being a problem. Concepts should be a code-generation tool, not a constant nuisance. Well, that's why I've been doing them wrong — so that I can eventually see the right way. …I foresee a grand rebuilding in the future.)  
(…And that promise-returning likely doesn't work well, now that we have things like envs.)

Added some basic assign-to-`map` capabilities. Together with the last thing, this was an hour.  
Renamed `parse`/`serialize` and added a basic description; 20 minutes.  
Okay, I think I've run out of easy things to do.

It lasted a month, and 3000 lines of code; this is the limit to what I can do. But let's keep going and see what happens.

I tried arbitrary-dependency-graph linking for an hour. It fell apart (most recent issues: arbitrary-dependency-graph means that we need to define evaluation itself; by the time we detect name conflicts, we can't create a new lexical scope to resolve it, and how exactly do we do that anyway).  
40 minutes later, I've been able to define `js.function` evaluation. What I actually have is more general than `js.function` — it's more like `js.eval`.  
20 minutes later, I'm actually memorizing what is compiled, during linking.  
10 minutes later, I'm actually detecting name conflicts properly (but still don't fix them).  
I don't actually know how to resolve name conflicts; so I'm not going to.

Deconstruction of functions does not happen for its call-code, because serialization is quite content to not open it and just say "`call` becomes `txt`, *obviously*". Should fix it in deconstructing a map… or, deconstructing a concept?  
Deconstruction used to still think that `map` supports objects and not Maps (and it didn't quote map keys/values); fixed.  
Okay, 10 minutes, and it works. I'll check this off the list. 4 down, 20 to go.  
(As pretty as full information is, it's kind of ugly, with its non-table-view, quoting globals it shouldn't, and not hiding the huge `.`.)  
…I should also remember the original ctx of functions, so I could deconstruct them properly, not just assume `.` ctx. Done.  
But now, I really don't have an excuse to not do the `read`/`write` family. (The existential crisis of rebuilding can wait until *after* I have minimize/maximize: they're too cool for an existential crisis.)

…I couldn't live with that lingering regret, not supporting conflicting names.  
I added something for scope-escaping, and it *should* work (haven't tested it, neither will I), but only for scenarios like "in the scope of `a` and `b`, `a` depends on a scope with `a`", not like "the variable `a` depends on a scope with `a`". I'm pretty sure the second one is impossible and doesn't make sense, anyway (what, define `a` in terms of *another* `a`? In JS, in `let a=a`, the inner `a` always refers to the outer and causes an error.)  
…Actually, it doesn't work, because when escaping to a hidden lexical scope `{…}`, the defined variable is not visible. Should use a function instead…  
Okay, *it works*. No lingering regrets.  
…One lingering regret: inability to do the aforementioned `a`-in-`a`. I feel like it is possible.  
I felt it was possible, *and I've done it* (through inner functions and value renaming). 7 tests of `js.eval`, 0 lingering regrets.  
Only took an hour, all in all.

---

2 December 2019.

> Evaluate an expression vs return a lazy thunk, inline a function vs not, don't cache code for input type vs cache for one vs cache for 100, choose an alternate computation path… These are all choices, ordinarily pre-made by people and thus the compiler. But entrusting them to the program would make it that much more flexible and powerful.

…This would be a good intro to `alt`.

Very quickly, removed spellchecking, and made `parse` *technically* able to accept DOM elements (by just taking their .textContent). Somewhat fixed transitions breaking end-of-document auto-scrolling.

…I can make a more generic `eval` (or `compile` for imperative languages with scoping) by passing in an options object with `{ statementSeparator(), newName(), newVar(name, value), passIn(value), scoped(string), returnFromScope(name), backpatchable(), backpatch(name, value), cacheCompiled(map, ofName, varName) }`…

`alt.when Expr Whether` for altering a scope's whether-try-alternative bool-generator (can be set to smth like `never`).  
…An idea has presented itself to me; I need to judge its merits and demerits.  
Make `reads`/`writes` invisibly augment the return value, and have `commit` for doing the thing (re-trying if reads were recorded but don't match anymore); and have `optimize Expr (least/most …)` rather than `minimize`/`maximize`.  
Pros: it would be super general; parent-goal optimizers and own-goal optimizers would share the same infrastructure.  
Cons: it would change semantics, by design: `pick Cond AugmentedA AugmentedB` will discard one of the logs (unless we allow `Cond` to augment pick's return value, which I think we do; but if we do, selection might not work unless we also make least/most different from pick)…  
(Should, in `writes`, every write *return* an augmented value, or *alter* the current journal? Or maybe augmentation should alter its journal too…)

Not thinking, just reading Racket documentation. They put basically community projects into official documentation (I think), which I'm unused to. …Well, Boost did the same.  
No desire to do anything more.

Oh. I got sick a little. Of course. Protip: if you want to accomplish anything productive, don't get sick.

Kinda mostly made `js.eval` use options (not exposed yet, and incomplete). I want `structured Arrays` for wrapping in `<node>`s.  
I can now log structured compilation results.  
…But what if I made the same array objects have the same .id in output, and kept track of linking information that way, for *even better* examination of linking body…  
Now I do, except in function bodies…  
And now even in function bodies (assuming that substrings don't occur in strings or comments or function args, or even as parts of identifiers). *I can see everything*.  
This was such an abuse of time… The only thing I need to do is `read`/`write`. …Don't wanna.

With a littlest bit of difficulty (10, 20 minutes?), I made `_use` check overrides. I'll be able to have non-lazy _use-overriding things (like augmented-with-reads/writes values).

Added `_throttledByLastExecutionTime`, in 10 minutes, mainly for future usage (but nice now too).

It doesn't feel rewarding. And since reading can infer on-write feelings, this is not enjoyable to read.

Leaving lots of lingering regrets everywhere… I don't regret it.

I don't feel inspiration, but I at least re-did parsing in terms of a parsing object and a central `match` function, so now I can (in theory) apply styling.

No one tests software at the limits of their memory capacity anymore. I had a very-long memory-swapping incident again (I just wanted to log parsing info), and the desktop (Unity) crashed. I probably could have rebooted it without power-cycling the computing machine, but I'm lazy and sleepy.  
(The browser is really bad at actually stopping misbehaving scripts. NodeJS (and OSes) is so much better at that. Ironically, when dealing with logging, inserting bodyless loop-a-million-times loops actually improves the situation.)  
Now I forgot where I was. What do I remember? Racket uses a bytecode representation called `zo`… Eh, I'll just launch it again. There's some infinite recursion now for some reason.  
…I'm now returning a structured-arrays representation of the parse (completely uncolored, but with structure basically consistent with what serialization gives)… If I can now save-and-restore caret position when a character is entered (or when REPL input is mutated)… Then I'm mildly excited about *something*.  
Saving/restoring caret position was a multi-hour nightmare, but as long as I could treat it as an optimization problem, solving bugs as they arise, I could get through it.  
…It didn't save me from bugs when it came time to parse input, but it was a nice thought. *Ahh, it worked so well, in a simpler time.*

Couldn't not finish it, so I rose in the middle of the night, and fixed bugs in 20 minutes.  
Today seemed so difficult, but time-marks disagree.  
Now, most-recently-typed syntax structure gets highlighted as you type (10 mins) — or, to be more precise, if focus is on a contentEditable element, collapsed selection's `<node>` parent (rather than the last-pointed-at element) gets highlighted. Just like I always wanted. (As a bonus, since none of this is colored, the delay before parsing isn't even noticeable. And even if it were colored, thanks to contentEditable not erasing the whole formatting (unlike DrRacket), this wouldn't be a big deal.)  
Also quickly made shift/ctrl+Enter not submit the command.  
…Wait, there's a problem: newlines get erased. That was because I used `.textContent` instead of `.innerText` in `parse`; a fix of 20 seconds.  
Also made `Escape` remove focus from REPL input, because it was getting annoying, not being able to look at things with a mouse. (It's taking me longer to explain these things than to do them.)
I now have structured editing… From a certain point of view.  
…Now I don't want to sleep.

---

3 December 2019.

I've built up my viewpoint to be agnostic to the existence of God, not depending on either case in any way. But it does not mean that I am blind to the probabilities involved. Most parts of all religions are too consistent with "some ancient guys being too pretentious in their lies, and lucky enough with finding the words to be listened to"; the world is too consistent with uniformly random sampling with observer bias, not any more advanced generative process like a great intelligence humans can imagine; not looking good for god's existence. There are always good and profound parts in religions, otherwise they wouldn't be religions but cults, but their brilliance is only a jealous and lessened shadow of reality.

(Immortal concepts, but to make them understandable to laypeople, they had to be lessened and brought to things like religion and philosophy. Potential wasted, but perhaps it can be resurrected eventually.)

…

Me: *Makes a contenteditable-and-reparsing-based structure editor.*  
Also me: *Spends an hour writing out memes in it.*  
Looking good.

(Also, with explicitly visible parsing structure, I was able to find and fix a latent bug in parsing strings.)

I fear no man.  
But that… thing…  
**`read`, `write`**  
It scares me.  
(Not for any rational reason.)

(Racket's "globals are clickable links" idea may be quite good (better than deconstruct-on-hover), since I have `deconstruct` kind of fulfill the role of describing element. …Racket's brackets are brown, too; did they too look in `man 4 console_codes` for the most non-intrusive color?)

After many hours, I can now see binding info *in parsing*. It's not the same style as serialization has (equal-id highlighting: in parsing, is for non-labeling-extracted labels and the extracted value (and all labels within); in serialization, is for all labels, including in extracted, and extracted itself, but not the extracted value), but *I think* this one is actually better. More reflective of internals.  
I still don't color labels, don't make functions make their labels all equal (maybe `func` should override binding?), and don't color references-to-globals bold. First and last are just a matter of styling things better.

---

4 December 2019.

The decision to visualize to an insane degree is paying off a little bit: I found a little bug in `bound` where it doesn't merge (unchanged) arrays without labels.

Though, I'm burnt out on interface stuff.  
I have nice things to do there — document hash change causing a `deconstruct Hash` evaluator to appear at the top (or just on-click on `<known>`), serialization associating unbound values with original ones (and thus able to have equal-objects in different evaluations and even parsing to light up the same), parsing triggering purification (I have the infrastructure for this). But I don't want to.  
…Well, I *say* that, and then I make `<known>`s open a global's deconstruction at the top of the page. Would have been nice if `map` presented its results in a table, and if we had something like `_globalScope` so that the huge thing isn't always following each definition around.

…Narrow down the problem…

And, serialization now associates unbound and serialized values with original ones. It's *more* overhead, but it's also more beauty, and more internals shown for what they are.  
(I just noticed that undo/redo don't work. I don't know how to make them work without re-implementing them, so, eh.)

…And now I show pure output. Oh ho ho ho ho.  
This such a feature overload. I'm gonna try to make `bound` do equal-label-binding in funcs, then I'll stop.  
…_bindFunc calls bound, and we want to make bound call _bindFunc. I don't think it'll work, with current architecture. Maybe we shouldn't do this.

Okay, pleasant work ends here, and only frustration awaits.  
I don't want to, but I'll just need to suck it up and do it. (`read`/`write`, I mean.)

I also never bothered to check purity (can we merge this array?) for custom `func`tions (go through its graph and see if anything there is impure).  
…Okay, I had something very distantly resembling inspiration, and now I do check function graphs for purity, with `_impure`.  
(I'm distantly worried that not merging impure calls would cause infinite loops in impure functions to not be caught… Can we, say, separate bound's merging and finish's merging? …Hopefully it'll be alright if I don't deal with this problem now…)

I'm disliking what I see in Racket. Far too long-winded, not in explanations but in functionality. Pointlessly fiddly, and not nearly as terse as it could be (I'm currently looking at its parsing. Racket's basically improved Lisp; *meh*. I hate that whole mathematician culture, pointlessly fiddly, not nearly as intuitive as it could be. Exceedingly self-aggrandizing but loved despite that).

(I think I have all information in serialization's styling as I do in parsing's styling; we coooouuuld uniiiiite… No, no, no interface please.)

> One global namespace is good (and is how memory is, internally), namespacing is better, but integrated-with-everything namespacing is even better.
> The way security (and namespacing) should be handled is, first, all global functions should be grouped into some tree — the same in documentation as in here — and then, when reading arbitrary code, look at the exact functions it uses and present to the user that info when asking whether this thing should be trusted ("read/write storage", "networking", "all functions"), grouped by category but also expandable into individual functions, all tightly integrated with documentation (aka the user's understanding). Categories can be set to "system-critical" (always-ask but red) or "always ask" or "always allow" (simple things like summing numbers). No one would have to repeat what the code says, it can all be inferred automatically and in a configurable-by-the-user way.
> In regards to code hiding, intermediate code should optionally-per-namespace be hidden in `···`, so that only the most important things are shown.

---

5 December 2019.

I took a day off. I'm allowed to do that, right?  
Serialization and unification of its styling with parsing's rejects me.  
Fixed the clunkiness of the `+`/`*` fix, too. It still outputs `broadcasted` in a var, but things are at least human-readable otherwise, *and* I don't have those special-cased on serialization anymore.  
Parsing labels now have colors, exactly the same as serialization (and colors are now globally remembered per-value).  
Parsing now only copies the global ctx if there are actually any labels on the top level (copy-on-write).  
I now count visual-stuff work as procrastination.

This whole "visual stuff" distraction was a massive and pointless waste of time.

I'll now at least close the browser. I won't be seeing that for a while; reading and writing and their virtualization and minimaximization will have no mercy.  
I'll back up the current code (with Ctrl+C Ctrl+V), in case I ever want to see how things were when everything seemed to work.

---

6 December 2019.

> Humans fall so easily into the trap of generality: finding one thing that can do everything, and thinking that that's all they'll ever need. Pretentious thinking that intelligence is nothing but neural networks (universal function approximators), perhaps arranged in a particularly clever way. The market regulating itself. Human will and self-improvement conquering all. God expressing its will through everything. Nanomachines, son.
> But you know what's better than one perfectly general thing? *Many* perfectly general things, all made to work together.

The human naming system is so dumb; it's such a primitive approximation to the credit assignment problem. Give something good through a publisher or forum, and people will thank the distributor, unless specifically said otherwise (which is manual and takes effort). Ideally, identities of producing concepts and names should be orthogonal, but that's a problem for a *very* far future. Until then, an identity without a name is meaningless.

---

Friendship ended with productivity; procrastination is my new best friend.  
While I was at it, I at least changed so that the network base treats strings as strings and not as global references (`Symbol('name')` is now treated as a global reference there); the overhead of looking at a deconstruction's txt or examples or nameResult is much lessened.  
Also, extracted `parse.ctx` into `_globalScope`, so deconstructions look even nicer in the editor; they now *don't look like shit*, together with the previous thing. Amazing.  
Now, if only maps became tables… But for that, we need serialization and parsing to use the same value-knowing function, so we can't do that in procrastination-mode.  
…*Or can we*.  
Yep, it looks good, just as I thought it would. It has a few rough spots due to bugs in parsing/serialization that I can't be bothered to find and fix (parsing not getting the value of the outermost bracketless call; array cells not breaking).  
Terrible, terrible implementation, though.

(Maybe there should be no altering-scope by `a:1` and such in the REPL — no distinction between private/public, therefore not a good interface. The Jupyter notebook numbers the results, but we can go one step farther. Maybe every value should be able to be inserted and referred-to (breaking copy-pasting though); altering scope will be unneeded then. Worth repeating, probably.)

I've half-heartedly been trying to implement semantic alternatives in Python for half an hour, and, uh, shit is complicated. I'm instantly reminded why I procrastinate.

---

Top-down vs bottom-up; know the goal and decide how to reach it, or have things and decide what to do with them.  
Be a bumbling overly-ambitious idiot, or a blind grubby fool with your head in the sand.  
Pick one, but only one. Isn't it thrilling to sign your life away?

---

7 December 2019.

(I've been poetic with concepts sometimes; defining finishing functions that use concepts not as simple overrides, but as more sophisticated extensions (by checking overrides in the function however I want). But how would I support the same thing in the language itself?)

In 10 minutes, I was able to both make extraneous protected-by-serialization-env vars not show up, and make `deconstruct +` actually copy the array for proper inspection, not just return `+`.  
(Of course, with partial evaluation and caching and all that, the actual final times are almost meaningless. Being impressed by someone making a game in an hour is stupid — an hour is just the tip of an untraceable iceberg there.)

And, later, made emptying the REPL box clear its pure-output.

(And, it occurs to me that I won't be able to do proper min-maxing in Python, because I don't really have concepts to define their usage there (in this case, "try everything, and pick the best when the goal is known"); the closest I can get is a flat min or max, trying a subordinate N times and immediately picking the best. That's why Conceptual has to be a full-blown language, not just a library or a framework. …I can still do *something*, at least, when I feel like it.)  
(…Actually, I think I can; it'll involve tricky communication via global variables though.)

```python
import sys
sys.ps1 = '\x1b[33m>>>\x1b[39m '
sys.ps2 = '\x1b[33m...\x1b[39m '
```

There, I've already given the Python REPL a little bit of color. Why isn't this official? Colors are such a good addition to plaintext. Python seems like a smart guys' language, but no one was smart enough for a few console escape codes? Or do they intend the interactive mode to be used in non-terminal settings, and have no way to distinguish?  
Python is very Linux-y, closely tied to its directory structure. Does Linux hate colors too?  
(I don't color input in my own console REPL, but that's only because the console is so *pedestrian* already, compared to a full might of a proper widget tree structure like HTML. Python has no such excuse (…apart from Jupyter notebook…).)  
No prime internet access; cannot open an issue, or otherwise ask anyone. As always, I'm completely alone.

[] Does there exist a 'ghost' runtime environment, that inlines itself into its programs? It's a perfect env, so maybe. I don't know of one though.

() How would you even optimize concepts, apart from caching conceptual lookups? I don't even have an in-mind algorithm I follow; it seems even more dynamic than dynamic languages of the 1990s. Take errors: it's a concept that overrides everything to return itself, but it can be implemented more efficiently via an error jump table in the environment — and I don't see a connection. Or take return-many-and-pick-when-ready: can be implemented by communicating up that we need to do this computation N-1 more times, and then pick best result. Or take interruption, recording everything as a concept, implemented as… something (easy in a processor-and-instruction-pointer arch, but needs context recording otherwise). No rhyme or reason; I can sometimes kind of see it except not really.  
Is this an AI-worthy task, aka impossible for mere mortals? It better not be. Making immortal things is *hard*, I want to be respected for trash-tier work.  
(…Maybe I should separate interrupting into non-conceptuality, into a basic functionality; the rest seem much more sensible and at least *predictable* and *sane*. How, though? Interruption for non-interruptible languages was the first major use for concepts I wanted, and now I want to throw it out?)

{} Creating the general algorithm is always superior to coding its individual cases, in the end. Time and time again, humans find out this lesson anew. While they're concerned with efficiency and making the most of what they have, I'll think about the far future, the most general of things. I don't know if I can wait for them long enough, but I can do nothing but try.

What does "`—`" mean in the English language, anyway? I've been using it forever.

…Python dicts apparently can only handle hashable keys, so they are unsuitable for a writes journal (unlike JS Map). Is there anything… identity-based? I don't want to use arrays and linear searches. `id(…)` is suitable for remembering, but not for iterating over stored objects, which we need. I suppose I can have a separate array of dicts inside, but is there really no built-in solution for this?  
Eh, I guess this works well enough. Journaling is done, then (no read-journaling though; I won't be doing any concurrent memory transactions here).  
Now, alternatives… What bothers me is that we want "instances of a type", and self-writing, and having the result be different from what is written (maybe). Not sure.  
Will I have anything more advanced than memories of past generations?  
My understanding and memory is nebulous and hazy.  
I'll have to re-make them, later.

---

8 December 2019.

I've by now seen quite a few anime fans. In my opinion, the best anime shows are quite worth watching, but… These people…  
It's hard to believe how delusional, self-important, creepy, and pathetic the people that anime culture breeds are, in a way that I've never seen *anything* else quite manage. It's impressive, how well that culture subverts everything good. I'm not really against any single thing they do, but together, it's too much. I keep expecting what I think is the worst in these regards, and they just keep finding new ways to subtly let my expectations down.  
Weebs are so far the only people I've known that really deserve the title "worthless fleshbags".  
(I haven't known many people, but that just means that I have a lot of room for hope.)

Having run out of things I know how to implement, I've turned to spewing useless words.

In 3-4 hours, I've figured out how to have self-modifying (if they want) static variables in functions, in Python. Even if they aren't, you can still do things like `static.a += random.uniform(-1,1)`, and when I have goal minimaximization, this will actually optimize `a` without anything special required. (And if a value does override `read`/`write`, it can specify arbitrary such self-modifications on any `static.a`. And such classes can be quickly prototyped for a particular function, by modifying manually.)  
But I'm not really sure on what exactly `on_goal` should do, in light of nestable min/max instructions that should use it.  
And I can't think of anything right now. Literally: my mind has been completely blanked out these past days or week, like under a sinister magical spell. Evil spirits have made this place their own.

---

10 December 2019.

An hour of work, and `minimize`/`maximize` work in Python. Not performant, what with our constant journal-creation, and not time-limited (though it'd probably be easy to add), but nonetheless, it's stochastic optimization of arbitrary self-modifying code by an arbitrary measure (in places it wants to be optimized, just like cooperative scheduling — cooperative optimization) (no async though) (…sounds like a scientific article's name). First try.  
(The only thing not perfect (in functionality) is that we don't do snapshots of code without self-modification, so sometimes everything we pick is worse than the previous result, and we worsen the whole. I think that might be acceptable though.)  
No channel to share it into.  
Now, I need to add things that use it; things like bounded-number, random-walk-number, probabilities, memories. Instances-of-type, type checking and generation, tree and acyclic and graph generation, and arbitrary function generation — why not, really (probably too complicated tho). (And possibly figure out how to do namespacing and module-private variables in Python, so that it's actually usable as a legit Python module.)

With how Python documentation uses "syntactic sugar", one can say that functions are merely syntactic sugar for copy-pasting their bodies into call sites with substituted parameters: it's mostly true, but not absolutely true, so why use that term at all? "practically the same as" is a much better term.

Implemented Prob/Bounded/Walk; mindless fun. Memory is not implemented — what are the words for the sometimes-remember-from-cache and the LRU cache concepts that make up memory? After memory, I'm thinking of dropping `expr-gen.py`: nothing useful can easily be extracted from it anymore.  
…They are not fundamental at all, though, might as well drop it already.  
(2 hours' work, these ones. They aren't hard at all, but…)

Ah. Python module global variables are hidden by prefixing them with an underscore, no special syntax.  
…Internet. I'm coming to a stage where I need Internet.  
…Or maybe, describe the future of the web of functionality, more accurate this time?

Everything I do in Python… so fiddly, so many holes far out of my awareness. Not like (a lot of) my work in JS.  
I got distracted from my procrastination.  
Been trying to add read-journaling so that, say, an `If(…)` could remember which branch it picked during this journaled run. Realized that I should extract some functionality into functions like `_dictSet`, `_dictGet`, `_dictKeys`. Holey… but they should work for almost all cases. Didn't help much.  
I also needed `_dictCreate`, for those pesky dictionaries on the way to a dictionary tree's leaves. …"leaves" sounds like "leave-s"; maybe I should use "leafs" to mean "leaf-s" instead.  
Now I cache reads too, and things like `If(cond, a, b)` and any potential `Choice(index, opt0, opt1, …)` know what to blame — the thing they tried during this try.  
It is dynamic… it can optimize arbitrary code… but its big problem is, it has a lot of overhead. Caching all reads, not freeing space for definitely-unneeded journals… Partial evaluation. A dynamic yet static language, fully general yet easily reducing to the most special case. Object lifetime analysis, evaluated-at-compile-time reference counts and garbage collection. All automatic. I want it. I don't think it exists.

It's 300 lines without `Bounded`/`Walk`/`Prob`/`If`.  
I must put it to rest. I'll at least close the console window.  
But, the burned-out state of the self-modifying "A PL REPL" creation machine has still not been exited.

---

16+ December 2019.

Friendship ended with royalblue shadows. Orange shadows are my new best friends.  
Light theme really does burn eyes, after getting used to dark theme.

Polish levels… overwhelming…  
The number of futures to do… overwhelming…  
Motivation to do them… underwhelming…  
No matter how much I do this, there *is* no perfect base; I'll always end up reconstructing parts of it.  
(Live, create concepts, sometimes give new names to them, sometimes re-use the old names. Life is like code development; life *is* code development.)

I am too proud of my creation. It must be torn apart; I'll have to bravely make changes with no regard to everything always passing all tests.  
…But I can't make myself…

Will humanity allow me to exist and have any influence? Doubtful.

Nightmares made manifest… such a ridiculous notion. What can be seen and touched can be improved, and very soon they aren't nightmares anymore, just another way of life ("a measure that is a target is not a good measure"). Nightmares are temporary.  
That's why the god of nightmares needs *your* open-source contributions.

---

Modern machine learning really is stuck in a primitive state, now that I think about it; adjusting output by adjusting variables, mostly by gradient descent… It's like if, to sort an array, everyone used radix sort, some hipsters found out that quick and merge sorts are not bad, and some idiots used insertion sort on their worthless toy problems. Modern sorting is about combining algorithms, by knowing approximations of their relative runtimes and dynamically picking the best, resulting in something that's better than any one. Modern machine learning is about statically picking a way of adjusting that seems best. Approximating performance of an adjustment step may be a far more difficult task than sorting's, by itself requiring advanced combination, but isn't it necessary to achieve learning performance superior to any one algorithm's?

---

Logicians like to say that they define everything from nothing but a few axioms, proving everything they want completely transparently. They criticize computer proofs as being unverifiable, because software and hardware are unverifiable… but how are those any different from axioms? Just because these are written on a piece of paper with simple words doesn't mean that it isn't possible that humans are secretly hard-wired to see something inconsistent as completely consistent; all it means is that the attack/defect surface is smaller. But make software and hardware simple and inspectable, and the ground for untrustworthiness of computer proofs completely evaporate.

---

When you haven't formalized an idea yet but are still using it, you end up inlining its parts into your reasoning — just like imperative programming. But when you have, you will likely end up over-using the formalization, missing its subtle variations and specializations and nuances of implementation — just like functional programming.  
One can be too verbose, or too terse.  
Is there really no way to have both?

---

Being a part of a huge society is nice. You think to yourself, "yeah, I can kind of see where this idea leads, but I don't know anywhere near enough to actually implement it", and the fact that you do means that someone somewhere has done it.  
It's like you don't have to do anything and can just die or something. Bystander effect, combined with suicidability.  
I got stuff I want to try first, though.

Humanity lives all lifes of a human.

---

Generality, and not being constrained by conventions in the least…  
This has extremely foolish results for the longest time.  
But the best things cannot be created any other way.  
Grafting extensions onto a narrow view is, in the end, worse than constraining a greater view: one finds that it is greater than it thinks (forgetting how it's like to be *not*), and another finds its place in the wider multiverse (forgetting what it's like to be greater).  
(*Obviously*, no one can have both.)

---

Being alone vs having societal support on what you do is the difference between doing 30% of your to-dos and doing 90% of your to-dos.  
A huge difference, but I don't see any choice here.

---

21+ December 2019.

A nice way to create an opportunity for meditation and self-reflection for half an hour: `console.log(func)` in a tight asynchronous loop.

This is absolutely terrible. I basically repeatedly push and pop the same thing — `error` onto a stack, thousands of times per second. "Box shadows have made the CPU quite busy", my ass. "All tests always pass when I add them", my ass.  
Abysmal.  
More like, 21 test failures.  
…When did I manage to break them?! They worked fine when I added them!  
I'll at least add an indicator of whether anything is running to the bottom-left. And use `_jobs.expr` as a queue, not a stack.  
Can I even fix this?  
…They're all fixed if I remove `return over` from `_getOverrideResult`… But then, `txt` doesn't work.

…And the highlighting model is rotten, far too slow if there are just dozens of things…

I've almost never typed so fast in my life. 5…10 characters in a quarter of a second?

…But, what right do I have to do typed expression generation in Python? No. No Python, only our own strength and weakness, only one light against the dark, however dim.

And, I think I'm thinking internally that what is in `future` is a part of us. Die, fiend.

Aaahh, `<meta name="viewport" content="width=device-width, initial-scale=1">`…

Okay, time to go into hiding for half a year. How could I stand ever showing such a holey thing? What is this hot garbage?

(…Habits are mostly reinforced socially… without that, life is much less efficient. Still, I need to optimize it.)

> Excellence lies not in doing things right the first time, but doing a thing over and over, throwing away everything until just one succeeds. It is the hardest behavior that is, and quite risky to boot; few would do that.

I'm at a level that I'm doing the things I've thrown away half-a-dozen prototypes for, the first try and with almost no bugs, but that's not nearly enough.  
…Natural language could really do with something like `structuredSentence`. Or at least an optional way of precisely specifying arbitrary graph structure, you know?

…JS is often 10…40 times faster than Python… Except for tests that rely on numeric subroutines, which is faster in Python (because so many data scientists have made a contribution there). Damn, no wonder Weld was able to achieve similar performance gains compared to Python.  
Honestly, the web really is a great place with a great future: WASM getting a POSIX-ish OS APIs (and already being a practically-universal computing standard with near-native speed), great speed, both low-level and high-level well supported, extremely large user-base and potential for integration and scalability… Even as confusing and hard to get into as it is, I'd say that singularity has at least a 50% chance of happening on the web (depending on if something much better but still not singularity, and without a good path to become one, manages to come along before that).

---

- Stack machines (or, reverse polish notation): a tree with all operations taking a known/knowable (like array creation) count of arguments, into a linear array of operation names (and back).
- Register machines (or, variable-based computation) (tag automata?): acyclic with all operations taking a known count of arguments, and a register de/allocator (((op …argRegisters) context) → (register (op …argRegisters))), into a linear array of operation names and registers (and back).

Both take in expression trees/acyclics, not any graphs, and definitely not customly-interpreted graphs…

---

Having spent a little bit writing out the joint parse/serialize functions (and adding */ +- while I'm at it), I'm thinking of how verbose what I'm doing really is; it's dozens of times more, compared to what could be done in languages specialized for this.  
Maybe I should do types next? Not having types, having them be documentation-only hints of usage and not specifications for generations, seems unwise. Nothing perfect, just a first approximation. Weeell, maybe I should look into LEAN and dependent types more, to have a more informed opinion…  
…How the fuck do you combine types with self-modifying code…

…Wait, do dependent types depend on concrete inputs (and are thus re-calculated for each runtime call — *uhhhh*), or represent inputs via variables (so, the type of a function is just a function on types)? I wanted to do the second way, but I thought these weren't dependent types. Hmm.  
What I'm reading means that you need to be able to leave symbols in type input/output — something that I made sure that I do, as a very little diversion a bit back.  
I can't remember when I was last earnestly learning new things; this feel feels like a new feel.  
…I don't think LEAN ever destructures types of input, it just adds and/or checks, if I'm reading its docs correctly. This doesn't seem right though: "propositions as types" means that function types should literally be functions on types. Maybe this'll get explained later.  
(Also, bless that guy who told me to not use ";" when I mean ":".)  
Their types are so restrictive.  
So profound, I can't find a purchase. Alien.

In logic, often want to return the body (conclusion) only when the context has both args (hypotheses). What does this correspond to, in the alt-search model — two args to alt? Generated by types in context?  
Tactics don't sound very automatable, because they aren't pure in the goals. Is this why I've heard that auto-search isn't succeed-or-loop-forever? …But isn't program search pretty common?

…If I make sure that every single function is aware of the possibility of interruption, and saves and loads state properly without fail (even core ones like `call`), then the interruption state can just be a stack without any checks on which to restore…  
What would be the exact interface for saving and loading?

```javascript
function f(n) {
  let [i = 0, j = 0] = _interrupt()
  try {
    for (; i < n; ++i) {
      if (Math.random() < .05) throw _interrupt
      console.log(i, ++j)
    }
  }
  catch (err) { if (err === _interrupt) err(2)(i,j); throw err }
}

function run(func, ...args) {
  do
    try { func(...args) }
    catch (err) { if (err !== _interrupt) throw err; console.log('interrupt') }
  while (stack.length)
}

run(f, 20)



const stack = [], tmpArr = []
function __populate(a,b,c,d) {
  // Store 4 values in tmpArr at a time, up to len, trying to avoid a memory allocation.
    let index = tmpArr[tmpArr.length-1]
    if (index < tmpArr.length-1) tmpArr[index++] = a
    if (index < tmpArr.length-1) tmpArr[index++] = b
    if (index < tmpArr.length-1) tmpArr[index++] = c
    if (index < tmpArr.length-1) tmpArr[index++] = d
    if (index >= tmpArr.length-1)
      tmpArr.pop(), stack.push(...tmpArr), stack.push(tmpArr.length), tmpArr.length = 0
    else
      return tmpArr[tmpArr.length-1] = index, __populate
}
function _interrupt(len) {
  if (len === undefined) {
    // Collect items from the stack into tmpArr and return it.
    if (!stack.length) return tmpArr.length = 0, tmpArr
    const end = stack.length-1
    const length = stack[end]
    tmpArr.length = length
    const start = end - length
    for (let i = start; i < end; ++i)
      tmpArr[i - start] = stack[i]
    stack.length -= length+1
    return tmpArr
  }
  // Return a function that stores 4 values at a time, up to len.
  if (typeof len != 'number') throw "Must be a number"
  tmpArr.length = len+1
  tmpArr[len] = 0
  return __populate
}
```

Huh. I guess I now need to copy and slightly adapt this to the network. Then go through all functions and make them interrupt-aware… Maybe I'll do this later…

Okay, added `_interrupt`. Maybe I'll do this later…

I really have no idea on how to make generation-oriented types properly.  
I've run out of things to learn from, for now. (That's a lie, but it's true that there's nothing that I'd rather be learning.)  
I'll have to do primitive prototyping.  
Something about arbitrary assumptions (rather than any one set of theorems); being pieces to arbitrary puzzles… Maybe even defining what pieces we are and to what puzzles, by overriding `typeMatch`…  
I'm floundering in the dark.

(Also, different methods of learning, like "adjust all variables randomly", "vary just one variable and find a min for that (possibly with ternary search)", and, you know, gradient (don't wanna do this one though). There are few variables anyway.)

Fuck, I just found out that tests don't work, *again*. I forgot to change `_test` when I was changing `txt`/`examples`/`future`.  
Failed, I have. Into exile, I must go.  
…When the fuck did I manage to break it though. I'll have to be looking at it until I see everything correctly all at once.

```javascript
      // Some structures can lead to infinite recursion here (because we use directCall instead of call).
      const original = data
      if (_isArray(data)) data = data[0]
      if (data == null) return
      if (typeof data == 'function' && code === call) return data

      let d = data.defines // c c:(concept c)
      if (d === undefined) return
      if (d instanceof Map) {
        if (d.has(code)) return d.get(code)
        if ((d = d.get(overrides)) !== undefined)
          return typeof d == 'function' ? d.call(original, code) : directCall(array(d, code))
        return
      }
      throw "Unrecognized .defines; should be either undefined or a Map."
```

This is as far as my Ctrl+Z goes. Literally 10 minutes, or a few days. It *is* in the "broken" time-interval, but it's the best I have.  
…This "concept" idea was a piece of garbage, eh.

looking at `_func`  
i think  
i was operating without tests for, like, literally a month  
…Actually, wait, this code might be correct.  
There were a few bugs in there; that "a kind of unification" thing was utter trash.  
i was operating without tests for, like, literally a month  
21/84 now; slightly better. Let's see if I can fix everything.  
…Oh boy, `js.eval` is literally broken, because `at` doesn't want to fall overrides through to its result, and get called this way.  
so, yeah, concepts are trash  
i sure do love wasting half a year of my life for no reason  
Only 12/84 now… And they're all quite ancient tests, like `Z→(pick Z X Y)` ⇒ `Z→_preserveUnknown`…  
The `_manualView` thing adds 2 failed tests. 10/84.  
kinda feelin like starting over, u know? i have `_interrupt` and a need to go through every function anyway, so this is a perfect opportunity to throw away months of work.  
6/84; there's now this one huge-failing-result-size test that is complicated in input, because `_withEnv` is not evaluated and returns undefined for some reason.  
5/84.  
Quoting had `if (_hasCallableParts(x, m || (m = new Set))) return true` instead of `if (_hasCallableParts(x[i], m || (m = new Set))) return true`. Took me an hour to find. This is why people have regression tests *that are actually run*, continuously.  
AAAAHHHH. 0/84 failing tests, now; never thought I'd see the day. I can sleep in peace. Lemme just remove some logging and update the code, so that what people might see isn't *such* complete garbage, only somewhat garbage.

> The name "dependent types" mislead me. Types aren't dependent on inputs. Instead, they're dependent on input types, exactly like function application would be; they can create an arbitrary pure specification of functions' usage that can be checked at compile-time.  
> (They are truly the ultimate form of types: there is nothing more general than "arbitrary". I *knew* these existed.)  
> ("Arbitrary" = "function"… a powerful observation.)

(Values of underlying code may be the same, but their types (interpretation) may differ. A valuable tool for efficient codegen then.)

> Category theory (or, rather, its practical-for-programming cousin, expression equivalencies) really is the best foundation for everything, but it truly requires a singularity to be useful.  
> Want to turn your array-exprs into curried form (in any order you want) to see if partial evaluation would be useful here?  
> Want to see if wrapping a computation in a lazy thunk is worth it?
> Want to pick the best container type?  
> Want to turn a state-using function into its pure form?  
> Want to enumerate all (or just several) possible results of a non-deterministic function and pick the best?  
> Maybe adjust some variables inside to make the result better?  
> Want to check if a change that a human says produces the same program really did?  
> Or even have programs in a cluster communicate best-found forms of their core routines, without a chance of a non-equivalent change, and without verbosity of communicating every single primitive rewrite, thus improving communication efficiency with improving intuition for equivalent search?  
> Even trying a re-implementation of itself in another computing base?  
> *All automatic*?  
> Gotcha covered.  
> (Imagine having to implement all that in a language, though.)  
> Equivalencies will be the singularity of computer science, just as category theory is the singularity of mathematical abstraction.

How fickle I was, turning my back on them.

Made self.js work in Node.js again… and numbered its REPL outputs, so users can refer to those.

'm really strugglin without those sexy generative dependent types.  
But API, unknown.

Hesitance… laziness?…

A language, rotten at its core… No desire to cleanse that rot, only knowledge of how… Breaking changes, shrouded in fear…  
Futures, locked away by the lack of other futures… This is a Metroidvania of programming.  
Well, as long as I'm having fun.

As programmer, so is program. As I found out more about types, I was gradually putting more and more types and spec and using that understanding in thinking through how exactly their values should flow and be transformed to be correct. Still no actual implementation of types anywhere, but I'm moving closer.  
I'm currently removing the double-nested non-intuitiveness of semantics; they'll be *actually comprehensible*, and exactly like a function call with a conceptual check before its body.  
2/80 tests fail (weird that it's only down to 80, since I commented out `try` & `guard` & `compose`). I'm getting used to not trying to never break tests, and to use them to find out *what* breaks and fix it. It's a game of "which tests fail now?". To know, to fix.  
Some kind of problem with identity, that functions aren't overriden as they should be.  
Gottem. Now, let's try to replace `v[0]` with `v` in `call` to make comprehensible semantics… And, it works. Semantics? *Sane*. Never thought I'd see the day.  
Man, success really feels good; who knew.  
But it should be over now — next up would be dependent types.

…Still, it kind of bothers me that I can't do `_updateBroken(document.body)` on `resize` — because evaluators are always-broken `<node>`s (so they could be highlighted, which goes real well with "Click to remove this" title on the prompt). Fixing this is possible by either decoupling highlighting and being a `<node>` (but not via encoding a value — evaluators don't really have that), or have them opt-out of updating their brokenness. The second seems easier; actually, both evaluator and REPL main elements are `<node class=code>`, so we can just branch on having the class.  
Gottem.  
(As always happens when I encounter a difficulty, a fixed a few things along the way; not worth mentioning, usually. Difficulties are great for quality.)

(Also, JS and the web just keep getting updated. It's almost enough to make me say that it's almost enough to make me excited.)

…Types… Compilation…  
(What is thought to be static vs dynamic distinction, is handled by partial evaluation. But types, not inefficiently augmenting each value with themselves, are quite compile-time. Returning dynamically-varying types, which results from handling types via partial evaluation, is absurd, and probably not useful at all…)  
(We can't just "check types as we go" with arbitrary specifications that must validate before we execute anything, but we *can* have a typed block that sees untypable functions as *something*, some type that encodes everything known about default execution.)

…Types for function selection?…

…Each function has a conceptual reference to its type function, for checking; each type function has a conceptual override of its function, for instruction selection. Is this weird double-layer architecture correct?  
(We can probably embed it in untyped-execution with `typed Type …CallValues` or something.)  
(We could *possibly* check the override of `typed` fully, for auto-calling and auto-type-checking.)

This is getting unwieldy.

---

25+ December 2019.

I've read too much about category theory. As usual, did not absorb a word of what they said, but only something vaguely resembling its spirit.  
(Category theory and formal proofs and PL theory are where good programmers go to die. It's like heaven — alive people don't go there.)

How about describing an optimizer of a tensor by some measure that could generate a random change to it, and perform a simple ternary search-bounds-then-extremum-inside search on the mixing coefficient (`result = Original + Mix*Change`) if it wants to.  
(The idea of being able to vary a single number in a tensor and vary all others, to find its result's extremum, even globally, is attractive, but seems too hard.)

Goal: `goal` of type `Tensor → Measure`…  
Number-to-tensor: `numberToTensor` of type `Number → Tensor`…  
A tensor with a random change (`random`; `perturb`?): of type `Tensor → Tensor`…  
"Just plug 1 here lol": of type `(func Number)`…  
Exponential search of min/max for one variable (`exposearch`): of type `(Number → Measure) → Number`…  
Mixing two tensors (`mix`): of type `func Tensor Number Tensor  Tensor`… But, to use exposearch here, we'd need a random adjustment that returns `Number→Tensor`, already mixing. Possibly add a `Number → Measure` (via measuring predicted result) only for Number generation here.  
Finding the best of two tensors (`best`): of type `func Tensor Tensor (Tensor → Measure)  Tensor`…  
(I'm using brackets as grouping here.)

I used types (and some type-checking procedure) to fully and intuitively specify when a morphism could be applied.  
(This also needs an initial tensor of type `Tensor` to be able to be actually applied.)

If we have a value `initial : ((0 0 0) (0 0 0) (0 0 0)) :: Tensor`, and `goal` is a sum of sines, and we want a `Tensor`…  
We could, to match types, have: …nothing, actually.

Allowing cycles would be inconsistent: what would `a a:(random a)` mean?  
I think the only options here are: conceptual wizardry (returning something that records then does exposearch on `goal`); scoped context modification in generation of `mix`; and hiding this non-acyclicity from this type search via `random : Tensor → (Number → Tensor)`. That last one could be good, it even showcases the non-triviality of type search. (We need `exposearch x→(goal (y x)) y:(mixRandom original)`, *which is still non-expressible*… If we had a morphism `compose` typed like `(func Func Func  Func)`, and done `compose goal (mixRandom original)`, we could have expressed it… This morphism is there by-definition in category theory, but our notation is shitty. This needs further thought.)

Why wasn't I able to have "each value is an application of a morphism to another value"? Why do I need "each value is an application of one or more morphisms to another value"?  
…I suppose that's a tad obvious when I put it like that. …Actually, it's not.  
`(mixRandom original)` produces a morphism `Number → Tensor`; if we want to make it into `Number → Measure` for `exposearch`, we should compose our morphism with a morphism that produces `Measure`, of which there is only `goal :: Tensor → Measure`; so, `(Number → Tensor) . (Tensor → Measure)` (args to `.` are inverted from how they are in cat theory). (We didn't have a value, we had a morphism, and wanted a morphism.)  
Is it possible to make this principle a part of the search, not a separate function?

I can kind of see something beautiful… this has some potential… but…  
I still have absolutely no idea.

(Also, not sure whether non-"single input, single output" (`func …Args Body`) is good for this, or if I should have arrays for multi-inputs. Does `(func Number)` make more sense than `Unit → Number`?)

(Also, I'm not at all clear on how commutative diagrams (actual *equivalencies* between morphism paths) are represented here. Should've read more cat theory.)  
(They're functors — kinda morphisms between categories; thanks, Wikipedia. …This is too abstract for me to understand at this time. If a category is the above generative process (several typed morphisms), and morphisms are typed functions that transform values as they want… I guess they would be morphisms between sets of typed morphisms? So, "doing these things is the same as doing these things". I *kind of* get it.)  
("Equivalencies" doesn't seem to cut it for this generative process anymore.)  
(What *do* you call this? Program search? Dependently-typed value search? I don't think this will be super useful without the ability to cut off considerations if taking too long, so maybe it's more than that. Maybe there is no one thing that allows super-unity, but only unity allows unity.)

I understand the basics of category theory. I should be disgusted with myself, but I'm not.

In other news, I made semantics even more comprehensible — overrides of `finish`/`call` are only checked for array heads, and *all* overrides are only checked for non-functions. (The only thing that depended on old behavior was plain `error`, and I think it's better to be able to handle naked `error` as a function and not an actual error.) Half an hour.

I should resurrect at least `try` (maybe `guard`); then I could have an actually functioning lambda-calculus based on pattern-matching (not just substitution, but also branching).

By the way, in the "go through a list of instructions and execute each one we see" model, I think overrides of `call` correspond to having their args to the left (executed before function), and overrides of `finish` correspond to having their args to the right (not executed, inlined in code to skip over).  
If I understood how to have variables in stack machines (duplicating will just duplicate into the output's arg, looking down won't work because the value is already consumed by its output; what will work is either outside memory (like a register) or duplicating a value *down* the stack, shifting all that's on it), I'd have said this combines stack and register machines into one.  
I want to slowly move away from concepts as the basic model of execution.  
…I should have a marker for the number of args to a function (so arg count could be omitted for these cases, and so we can actually check those things).

Now that the language (except for a thing with assigning to maps which was too hard , so I commented it out) is interrupt-safe (untested; can't imagine any problems, but you never know), I could potentially do stuff with interrupts. Like scheduling, like "try a random branch for T ms, remembering the interrupt-stack, interruptable ourselves", like *actually having interrupts* (`_checkInterrupt(duration = undefined)`).  
See, it's all coming together, slower than any mortal can ever imagine.

…Precision… Power without power…

How do I even begin to approach this?

```javascript
function compose(...f) {
  return x => {
    for (let i=0; i<f.length; ++i) x = f[i](x)
    return x
  }
}

function _isArray(a) { return Array.isArray(a) }

function equals(t1,t2) {
  if (_isArray(t1)) {
    if (!_isArray(t2) || t1.length != t2.length) return false
    for (let i=0; i = t1.length; ++i) if (!equals(t1[i], t2[i])) return false
    return true
  }
  return t1 === t2
}
function _pickNatLessThan(n) { return Math.floor(Math.random()*n) }
function choice(arr) { return _isArray ? arr[_pickNatLessThan(arr.length)] : arr }
function func() {}

function type(expr) {
  // Maybe put in some function-relevant examples?
  // If const: return that. …Actually, no, must override it per-expr/per-value.
  // If var: lookup.
  // If an array, apply the type of first element to the rest (call the type).
  // What if it's try, guard, compose? func?
}
// Should do first-order generation first: having an A and A→B and B→C, create a C.

function gen(type, ctx) {
}

function lookupType(type, ctx) {
  const a = ctx instanceof Map ? ctx.get(type) : _isArray(ctx) ? ctx.find(kv => equals(type, kv[0])) : undefined
  return _isArray(a) ? choice(a) : undefined
}

function forwardSearch(ctx, goalType, onNew) {
  // We want C, and we want to pick A and find A→B and B→C and thus a C.
    // Does having a "goalType" even fit with the concept of forwardSearch? Isn't it a backwardSearch thing?
      // We could short-circuit when we find a function with inputs in our context with a correctly-typed output.
    // …But don't we want to fix the starting point in *forward* search?
}

function backwardSearch(ctx, goalType, onNew) {
  // goalType is T; this searches for …→T, recursively as needed.
  // We want C, and we want to find B→C, and A→B, and an A, and thus a C.
  const found = []
  ctx.forEach((type, values) => {
    if (_isArray(type) && type[0] === func && equals(type[type.length-1], goalType)) {
      // Remember to search for its inputs?
      found.push()
    }
  })
}

function composeSearch(ctx, goalType, onNew) {
  // goalType should be A→B; this searches for A→B or A→…, and in … searches for …→B.
  // We want A→C, and we want to find A→B and B→C (or even A→C if it's present).
  // …How do we generalize this to multi-input functions, though? Search for A→(var) and (var)→C? Do we need to have anything call-local to connect them?
}

// Can these be generalized to, uh, having context (concrete inputs) and goals (desired outputs), and searching forward expanding only context, backward expanding only goals…
  // But what about composed-function generation? Does it expand context or goals or both or even exist outside it?
  // Forward/backward are about going from (or reaching towards) concrete inputs… But composition only wants to fill in unknown inputs/outputs. …But can't it still have something analogous to forward/backward searches? (It *is* more general than just value search, as that can be expressed in terms of it with ()→A…)
  // And what about dependent types — functions with variables in input and output? Some unification?

function search(ctx, goalType, onNew) {
}
```

Interrupt stack is getting corrupted.  
How do you debug stack corruption?  
`'post-interrupt entry:' (0 undefined undefined 3 3 1) 'to:' 1` — I guess you need to keep adding information until it's enough to identify problems.  
I practically never *seriously* debugged stuff (like this).  
Counting "Expected X but got Y" for each X/Y seems fun. Manually, "expected func but got call" was 14 times, "call, _withEnv" was 9 times, "func, _withEnv" 1 or 2 times. I'll make an automatic counter. Just `setTimeout(() => location.reload(), 1000)` on load, and a localStorage counter (`localStorage.setItem(str, (+localStorage.getItem(str) || 0) + 1)`).  
`func but call` is 308, `call but _withEnv` is 147, `func but try` is 70, `func but _withEnv` is 54, `call but reduce` is 48, `call but func` is 43, `call but purify` is 32, `call but assign` is 31, `call but transform` is 30, `call but compose` is 27, `call but broadcasted` is 25 (and getting this data was still faster than counting by-hand). I think I see a pattern here.  
…But that's not even the main problem — the main problem is that stuff like `((var) (var))` somehow gets `transform` in its interrupt-stack. Even `x→(first (error) x '1')` with no interrupts anywhere else fails (expecting a `func`). *Even though there are no "post-interrupt entry:"s anywhere*. *And no post-interrupt exits either*. I can have no interrupt stack where the interpreter loop can see, and still fail.  
Oh, and lots of logging to console, apparently (because serialization throws).  
And everything having a post-interrupt exit stack of `()` even though I now delete it for new execution envs (which indicates that some environment objects get shared, even though they shouldn't be).  
I shouldn't be frustrated by things not working; this is a puzzle to solve, and it won't click into place until I happen on exactly the right solution.

This calls for at least a whole day dedicated just to this. I think interrupts are worth it.

(Also, removed _use everywhere, because I wasn't using it, and don't even have a mental model of how it's supposed to work, anymore.)

After I made tests schedule with `_newExecutionEnv(env)` instead of `env`, most of the problems went away (from about 15/90 failing to about 3/90 failing, even with *much* increased interrupt rate), but not all: I still have things like `'An unbound label to a was evaluated'`, `(error)` with compose or func or transform (only in `(transform (1 (rest (2 3)) 4) (func x (rest (0 (* x 2) 0))))` and `((compose (func x (+ 1 x)) (func x (* 2 x))) 1)`, `((compose (func a (* a 8)) (func b (+ b 2))) 1)`), and I see some rare stack corruption (`expected call but got assign`, only in `((try (func 1 3 5) (func 1 6) (func a b (+ a b))) 1 2)`). I think `assign` might be messed up? Or maybe a thing that's calling `assign`; maybe I create arrays anew when I should really save them in state?

In `func`, I don't actually preserve the finished array passed to `finish`, and create a new label-env each time.  
And `assign` uses `finish` and `last` to do a simple thing of ignoring the quoted result that it got (because some might want to override control-flow (`overrides`)).  
Now, the only thing left is the occasional (with `call` throwing 1/3 of the time it's called) stack corruption, on just that one test. It's almost a success.  
(And strangely, tests seem to take about the same time to run while being interrupted about 150…200 times as before, if not slightly faster. JS optimizes *good*, I think.)  
This only occurs for multi-input functions in `try`.  
I'm getting nowhere; I should record where the interrupt-escape from `assign` occurs.  
Didn't help. (Literally all interrupt stack traces are equal.)  
There are no interrupts being thrown from parts of `call` and `assign` that I didn't think would throw interrupts.  
The only thing I could think of is that `v.map(finish)` in `finish` can get interrupted mid-way, and on re-entry, we'll start from the start. *Hopefully*, fixing this would fix the issue…  
Didn't help. Must be some kind of non-deterministic behavior on the way…  
…When I made just one test run in isolation, the problem disappeared… But even the same test run twice can cause problems.  
`try` seems to be the necessary ingredient — other components seem to do ok.  
…Should I just give up and sweep this problem under the rug, clearing the interrupt stack if incorrect? I kind of really want to. I've made exactly zero progress in *hours*.  
It does only happen when I assign `1 2` to `2 3`, and assign `1` to `2` inside of it.  
…I can't take it anymore, I'm sweeping this under the rug. I don't expect this object to ever be anything more than a 5-minute curiosity anyway.  
This is the `merge` situation all over again.  
I'll count interruptions as working, then.

I guess I'll now need to add `type(...inputTypes)` for returning the type of an array-call, with `undefined` being the type of untyped things (that cannot be mixed with typed ones unless explicitly allowed). Dependent type checking.  
I can't do anything right, everything turns out to have some bugs and imperfections. But who cares, really. I don't believe in my cause, but I have no other.  
Should the compile-time specification be checked by `finish` during execution (so we don't type-check inside quotes) (which will require returning `typed Type Value` to ensure max correctness — and, what, reinstating `_use(value)` on everything?), or after serialization? The question is, will we ever want to defer type-checking to runtime?  
Variables stored in any-type containers… Actually, no, I don't think runtime typing is going to be necessary. Static typing is fine.

Dependent types, then dependently-typed search (for when the type-realm consists only of `var`, `const`, `first`, `last`, `compose`, and arrays)… I still don't know…  
Can I implement these (in the reduction step) (and I guess `label`?) in a simpler form, in a mini-language, here? Those other things are very slow, very bloated. It might be simpler to think of lesser things.

(Maybe a global store, with `read Whatever ⇒ AssociatedValue` and `write` if we feel like ever allowing `undefined` as a proper value, and `journal` and `commit`, could be useful.)  
(…Wtf, `journal` is 5 lines now. `commit` is 2 lines now. I did all this in half an hour, *just in case I ever want to use it*. At least *one* item off the to-do list, in forever. And `_cameFrom` too.)

…The Many on a paperclip optimizer, or any one optimizer, or a viewpoint: "What is a drop of rain compared to a storm? What is a thought compared to a mind? Our unity is full of wonder which your tiny individualism cannot even conceive."… lol

(I wanna do ridiculous shit like SVG-filter-based convolutions of images with a learned filter. Or learning a WebGL mesh and texture. Or even parameters to a third-party ML API; learning (here) without learning (there).)

…And the interface gets polished even more, with `position:sticky` on `<extracted>`.

> Life is the one that came up with meaning. Stray away from polished roads of human culture, and you may find all people's meanings meaningless.  
> …A continuous search through everything, including meanings.  
> Search is a sad place, though necessary for the greater whole.

(A conceptual world… physical world of humanity will slowly come to resemble it more and more, until eventually they are effectively the same. That multiverse has no unifying ideas, and each is as fundamental as any other; no way of life is mandated globally, only locally. Splits not across race or geography or label, but across ideas and mind's composition. …It's not that different from today's world, but it is a little bit more honest.)

A splash of magical particles lol

I'm seeing so many examples of typed search in myself and others; elements introduced do not define but enrich a creative product. That's to be expected when I am in a timeslice where I'm supposed to implement it; I let it into myself deeply.  
I kinda, very distantly, know how, but implementation? How many times have I whined about it without doing anything about it?

A soul that's not designed for easy reflection in other souls is not worthy of being called a soul.

---

1+ January 2020.

The worst part of every year is all its holidays. There is no holiness if I have anything to say about it.

The number "2020" is beautiful.

Merged `_deferred` into `_unknown`; now only `error` and `_unknown` re-define control-flow.  
(I don't think I've ever seen actual collection of all errors, and run-time partial evaluation applied to promises to not waste a single moment dispatching them, in a language, but here we are.)

…It occurs to me that the type-search largely conforms to the interface of `gen Type` with a context (called repeatedly). So I was right all along? I just need to do it, and keep doing it and expanding it, and get the program more and more usable and intelligent?  
I need to find a way to the first bloom.  
…No one approach will do…

If my productivity rises and falls in cycles, then this is the low point of my life.

I may have done `type` and (dependently-)`typed`, but it's not a great achievement: the real meat is search. Also, I don't type-check in `finish` yet.  
Now execution checks types. And somehow, it's still not any slower, even though every implementation I do is the slowest one you can envision. (It's totally so that no one ever has the gall to not re-implement stuff even if they have it working already.)  
(Though, now that I've copied-and-adjusted `finish` for `type`, doing partial evaluation non-conceptually sounds even better. Maybe just special-case it in `finish` and everywhere else that currently checks an override of `overrides`. It will be quite a lot more efficient too.)

And `error` is now not conceptual but checked-for everywhere.  
And it looks like I'm gonna need to re-do purification (partial evaluation), likely in `finish`, because compile-time analysis isn't precise enough anymore.

I've been watching some people talk about their tinkering, their dreams and views; talked to very few. Trying to learn stuff.  
Are all people so dumb?  
This is not how you give inspiration to people, guys.

---

3 January 2020.

My mind is an echo chamber.

And now `_unknown`-recording is much more efficient, because it is neither immutable nor conceptual.  
Now only `rest` overrides `overrides`. I can remove the remark about "global rewrites specified locally"; it is anti-security and anti-consistency and dumb, anyway.  
…But the main purpose of this was to eschew conceptual checking for `_manualView:true` altogether. I can't do that if `rest` still requires it.  
I *suppose* I could move that functionality into `call` too (or into `finish`)…  
And now I do that in `finish`. It's now 3 lines, compared to 15 lines of the conceptual implementation (and it's more efficient too). The innocence of youth, that potential without power, can now be over at my will.  
1.5 hours.

Sleep now in the fire, control-flow overriding.

What machine learning needs is a JIT compiler. Not your average garden-variety JIT that inlines calls and object shapes. A JIT that can decide to replace gradient with its (likely NN) estimation, to try different optimization methods, to decrease the size and count of hidden layers if taking up too much resources (or increase if taking up too few), to try a different architecture and precision. …Most of these can hardly be called JIT's domain, though; more of alternatives's and self-modifying code. Still, a rigid architecture won't do.

The interpreter loop now contains no override-checking. `_manualView` is now the default.  
Sleep now in the fire, conceptual overriding. Executed for treason.  
(20 minutes.)  
And I'm getting much closer on my understanding of typed search, I might be able to start implementing it soon.

---

4 January 2020.

`purify` now does not rewrite anything, it uses the interpreter loop and is more precise. It could be more precise, I realize now — instead of just not evaluating every non-pure call, it could purify its args too.  
And now that happens. Better than before.  
(Half an hour.)

Added adjustable throttling of the interpreter loop.  
(Half an hour, probably.)

> Imagine that your brain went through every possible meaning of every possible sentence part, all your life's knowledge and experience, every single time you even wanted to think about what word to say next. No branching, no going back to re-consider, nothing but raw power of big brain.  
> That's exactly how machine learning handles text generation. It's a natural consequence of "let's put everything on a GPU" thinking.  
> (Saying "RNNs can do any computation" is true but disingenious. Computers don't do branching by running the whole program again with a slightly different input, because that's stupidly inefficient. Practically, RNNs will never do deep and sophisticated branching and memorization, by design.)  
> …Though it may be true that the most human-like text generation can only happen in mostly this way.

(Typed search would be pretty good to do tho; development by editing not rigid code but specification of its parts. Create and optimize a context that gives rise to an efficient solution in some domain, then re-use it in another domain — and it is clearly visible by an intelligent observer. Get used to rhythmic back-and-forth movements of a dance, and re-use the "rhythmic back-and-forth" in standing. Get used to wanton murder, and express morbid political views. Very relatable.)  
(My understanding of the world is very primitive. False knowledge.)

And functions can now return `undefined` instead of just becoming `finish.v`. It's almost looking like a normal-people language.

Dreams…  
`best …Functions` and `best.` (probability-sampling, max-past-reward (additive, exponentially fading, average, min)), along with some way of getting judgment to these, may be good, but they are not the most fundamental. What if we wanted to choose between inlining a function or not, caching its results or not? A `choice N` node (and `choice.`) (using `read` to store past-reward data; culling most-average nodes to save memory) (using `reward Metric Expr` to reward the choices done) seems more fundamental.  
(Do we want `rewarded InitialValue MutateFunction`?)  
Evolution (or particle swarm optimization, rather) is only possible if we fully control the reward function (the optimization metric), and executions are very repeatable (likely pure). `many Metric Expr`. …But this needs random-mutation acceptors, like walkers and bounded numbers and become-another-mutation-acceptor, not done on an initial run but done on all others; `mutated InitialValue MutateFunction`?  
Is this only a case of "our execution is pure and one-shot, vs our execution is not pure and multi-shot"?  
…Are these interfaces correct?

(I was a fool to think that impersonal learning of evolution is the only generic form possible. But both is better, eh?)

…Changeable type-generation contexts, even automatically as the user explores and looks at things…

…For some reason, I don't want to do anything. I spent an hour polishing little bits and `(future)` of the interface, but…  
The vision is great, but the actual thing is not.  
My past regrets are stopping me. Not brave enough to break what I was unable to fix in the paste.  
(And then I toil a little bit an hour more. I'm about out of easy things to do.)

Not even 10% in on this whole thing. Not gonna make it all the way either.  
So I might as well compare reward and evolution, in soft words (or rather, my impression of them).  
Reward produces lots of repetitive content (expressing). Evolution rarely produces well-thought-out things (perfecting).  
Reward needs constant boosts to confidence. Evolution seeks criticism.  
Reward is individualistic (selfish). Evolution is communal (selfless).  
(When considering concepts, the realm is largely smooth, and these correlations make sense.)  
For not partaking in the first (and hardly partaking in the second), I guess I deserve to die.

It is impossible to create anything interesting without being senselessly cruel…

Anyway, if I ever manage to use choices to select whether to re-type-search a thing, and integrate them fully… The search becomes very unbalanced at first, but gains a lot of surety as it's deserved. Kinda like real life.

---

6 January 2020.

A few less lingering regrets.

> There's no such thing as "this idea can take a while to internalize", but there are such things as "no one we know can explain this idea simply" and "we haven't followed this idea to its conclusion yet".

Do "the choice you just picked was this good" and "the choices you picked in the past, including this one, were this good" differ in acceptor or rewarder?

Finite choices and their rewards, then?  
How would we separate "minimize time" and "I don't care about time, minimize avg distance to images"? An optional parameter `choice N ReactOnlyToThisReward`?

Or `choice N …PossibleInputs`.
Or `choice N Filter …PossibleInputs`.

---

7 January 2020.

Negative numbers in a tight loop (the interpreter loop, in fact) are a big no-no, it turns out.  
…Not running tests is also a big performance boost, it turns out.  
What I actually learned: `finish.v = v` good, `finish.v = finished` bad. There aren't any optimizations in not copying `v`, since I use `finished` just before and after; but for some reason, the second version causes the runtime of tests to double or triple.  
Now tests are *only* probably about 30% slower. Yay.

Oh what the hell. I used to have this whole big thing with `type(expr)`, 35 lines long. Then I add `getType = false` to `finish`, change `return result = v` in the v-is-not-an-array branch to `return result = !getType ? v : defines(v, type)`, and change the entry point `if (_isError(type(v))) throw type(v)` to `if (_isError(finish(v, true))) throw finish(v, true)` (so, all in all, 1 extra line vs 35), and everything just works (and by "everything" I mean "the two tests I added to `type` when I made it"). I now even have types able to be type-checked, too.  
Ah, nevermind, it was passing only because I was immediately uncaching `cycle` for types.  
A more involved change, and without generalizations, in the end. Type computations themselves are untyped (idk how to fix the infinite loop otherwise).

Interrupts now highlight their causes.

---

8 January 2020.

Find something new every day. Today I found out that I somehow swallow exceptions of tests, and 13/90 tests were not passing all this time; and that style-less serialization was broken all along.  
My work is extremely shoddy without fail.  
Even `x→x` doesn't type-check.

(Most tests weren't passing because I now merge all equal-name labels, and `(assign X Y)` was now being merged too and thus not executed.)

Fixed overlapping labels in graph output.

I now serialize using `embellished`; only took a day. The groundwork for changing input/output languages is there.

---

10 January 2020.

It's useless, but I've always wanted to be able to see all the function network's connections. Now I can, with `(links)`.

> I had a beautiful vision last night. A framework for improving choices; a compiler that makes choices, improving; arbitrary function graph generation and search (structural learning); delivering blame backwards through the call graph rewritten with structurally-learned-per-function blamers (so gradient descent is easily *learnable* but not a requirement if some better way is found). AGI is about generality, not derivatives.  
> Of course, now that it's day, it's gone.

Deep structural learning can only happen with an ungodly amount of reinforcing. Shallow structural learning is much easier to do.  
(Don't know how to properly separate things to learn and perfect separately (how I try to do things), though. Maybe it'll come to me if I ever actually work on this.)

Made some early attempt at a context menu, currently just with collapsing elements. (`parse` still doesn't support preserving special DOM elements, so it's not for use in input.)  
I can rename labels (with no regards to quoting labels properly — it's DOM, highlighting of hovers would save the day).  
Shit looks good.  
`x→x` still doesn't type-check. I'd like to make types strictly attached to functions, so that I could say "types are constraints on how functions can be combined". (Don't want to do a compiler until the interpreter loop is practically perfect in my eyes — from the generality perspective.)

I've knocked one thing off the to-do list, so I guess it was a good enough day.

---

11 January 2020.

The context menu is now in its ultimate form, and all functionality is namespaced very neatly.  
My dreams of how code should be organized and viewed are now complete.

I feel the laziness creeping back in, though. As if I've done everything I've wanted in my life.

I've questioned even the very interpreter loop itself, seen what choices can be made there, but it didn't do me any good.

About 2 pages of `(future)`.  
Now it's slightly less: done 2 more, removed 2, then added 4 that were in comments but that I was meaning to do.  
And about 4 more little things, so that I could probably say I did something tomorrow.

Work doesn't get added. It's just that things I didn't know much about before get more detailed.

---

12 January 2020.

Strangely, despite using a single namespace for everything, I haven't run into the "I want to use this name, but it's already taken" even once.  
It's like natural languages are optimized for giving distinct concepts distinct names or something.  
(A single global namespace is how human languages work anyway.)

`parse` and `serialize` now share styling.  
…That only counts as 1 though.

---

13 January 2020.

If your measure isn't improving, pick another measure.  
This night, I came up with a dozen little ideas for polish, and wrote them all down. Imma do them.

I did.

`(A …R)→R ('a' 'b' 'c')` causes infinite recursion, but only during purification (it used to not type-check). Do I care enough to look into it?  
`x→x` too, actually. It's probably something `type`-related, and I'll be re-doing types through `call` soon anyway, so, eh.

Fixed a potentially-nasty latent bug in `unbound`.

Knocked out `forever`.

What I'm doing when I'm extending functionality is figuring out a way to get a particular switch on what I want, then write code that uses that switch. I didn't add enough of those switches is what I'm seeing.

Knocked out `await` (too scared to test it on actual async stuff lol).  
Now I'm one less than when this day started, at least.  
…Actually, made `_argCount` be checked in a more function-specific place. *Now* it's one less than morning.

I'm thinking of either `parse`+`_innerText` or copying `interrupt` state or making `type` function-based (move type-checking from `finish` to `call`, via `(typed Value Type)` proxies) next. These are about the only non-hard things left. Still, they aren't *easy*.

---

14 January 2020.

-3.

If I make types solely the responsibility of the functions (and out of the interpreter loop), having `typed V T` or `V::T` be `assign`able, then functions really will be able to depend on their type (by putting a variable there) — genuine dependent types.  
This needs advanced (for me) interprocedural partial evaluation and inlining to be efficient. I don't know if JS would optimize the creation of a known array made to just check it statically. Luckily, I don't intend to be using those types all that much, so…  
Wait, I have almost nothing left but these true dependent types. Shit. No, wait, actually, I can do shift-clicking or link fetching next. HA

---

15 January 2020.

Wait, if I just make `typed` not special whatsoever, then array pattern-matching will ensure type validity for functions that demand types. Dependent types are… really easy (without anything like type inference, anyway).  
Dependent types, here I come.  
`finish` is back to being beautiful.  
Not stupid. *Advanced*.

Shift-clicking turned out much shittier than I imagined it, but it now technically works. Sometimes.

(For the record, I've been doing a lot these days, I just didn't feel like writing down all the useless details.)

---

16 January 2020.

A separate draggable window with a REPL; woah.  
…What was I doing?…

I've run out of easy things to do now. The only things left are like self-rewriting, a compiler, a debugger, a fast language subset.  
Only puzzles upon puzzles are left.

…In some compiler, to output a value (or, how we will compute it into the var we want), if we know several variants that can calculate it from the current environment, then we could have a choice, and then we could optimize that choice as any other choice…  
At every point, can insert a choice. Behavior then expands in new dimensions as much as it wants. Present enough choice point opportunities, and it will be less a compiler and more like a mind, infinitely vast yet ultimately much more efficient than a narrow view.  
I need to solve those puzzles before I can continue this train of thought, though.  
(Making choices is easy. The hard part is getting to where those choices are presented to you.)

Done the fast mini-language. My head hurts. This is just the beginning.

I guess a debugger (or at least copying execution state for later restoration (…which could be easy with the language I just made — just serialize and parse lol)) would be next? Or maybe in-worker execution (easy with the language I just made — just serialize the thing with a mark that the reader has to purely-execute the thing, and in a worker, just parse and serialize.)  
But *then* it's nothing but difficulty.

---

17 January 2020.

No, I'll do what I want.  
Choices; the precious stuff that lives are made of.

This isn't a project, it's just a puzzle generator.  
Not that I'm solving any puzzles right now.  
I made the permissions thing I talked about a while back a reality, by the way. With smoothly opening/closing hierarchical details.  
Okay, I'm gonna be adding perfect execution's `impure()` thing. In `call`, `finish.impure=false` and do not cache if `finish.impure`; in `finish`, catch `impure` and return `[_unknown, finished]`. No backups, I'm doing this entirely and not 'not at all'.  
…Wait, if I used to not merge impure-thing-containing things… there isn't any replacement, now is there? Maybe I should bring back `merge:true`…  
My program is now challenging VS's type-script-checker thingy, or its source-mapping. Maybe the bugged errors will go away if I reload, but why would I. (Even Ctrl+F is noticeably lagging.)  
Aaand done.  
My interpreter loop is pretty shitty. It's optimized, sure, but only for a very specific and rare case. Making and optimizing choices is so much more important.

I thought picking equivalencies would be where the magic happens, but the real magic is choices and function search (structural learning).

Actually, I still managed to knock out a todo item.

Actually, I got up at night and, uh, tried to knock out another todo item; now it's marked as won't-do. Creating a web worker told me there was an error, but it didn't tell me why.

---

18 January 2020.

No loose threads left, only loose holes in the fabric of reality.  
Like the compiler.

I guess I was able to find some trash to improve, though. (Now ctrl-clicking is at least somewhat usable. Especially in the editor, which I now special-cased to create proper graph links in text.)

I can confidently say that I have no idea where 6 hours of programming today went.

Also… do I really *need* a debugger? They're dime a dozen anyway, and mine wouldn't even be nearly as good as JS's debugger (no "step over"/"step into"/"step out", only "step" and "save/load"). And pointless UI is not what I want to do, anyway.  
I guess that's one item off the to-do list. I'm flying through them like they're not even there. It's exactly one page now.  
The only things that are possible next are either self-rewriting or the compiler, for real this time. Both are things that are actually undeniably useful.

…No, types are not as easy as "just pattern-match as anything else" if I want them to partially-evaluate.

```
Sum: (function  a  b  a+b)
Mult: (function  a  b  a*b)

Client: x -> (Sum x (Mult x x))

Client

⇒ x→((function a b a+b) x ((function a b a*b) x x))
```

Looking at this, I don't partially-evaluate *anything* (non-trivial). I guess I knew this from the beginning, actually, but still…  
Though, p-evaluating this would just copy function bodies with no apparent benefits (because our args are just as unknown to them as to us). This case would just be a simplification, able to be performed in `function`.  
Still, I should at least p-evaluate its typed version:

```
Int: 'Int'
Sum: (function  a::Int  b::Int  a+b::Int)
Mult: (function  a::Int  b::Int  a*b::Int)

Client: x::Int -> (Sum x (Mult x x))

Client
⇒ 'Ideally:'  x::Int -> x+x*x::Int
```

Gah, this usage just copies function bodies for no reason; the old type-definition-based system was much better in this regard (in theory, the JS JIT can inline them if needed). What exactly do dependent types bring to us? …Apart from the ability to do things like log the actual type — depend on the type.

Also, is `(a::b → a+1::b+1  1::2)` a correctly dependently-typed program? Does `a` need its `sum` to be a function that accepts a typed thing? I can't tell.

Error messages shouldn't be so black-box and either not-informative-enough or too-informative. They should start at non-informative, with *some* option of gradually gaining information about it; like I'm doing right now…  
Like, say, an option "make `error()` also preserve `finish.v`" and "augment errors with unwound stack".

If I'm having a bad time, I must be on the right track.  
I have no idea where *9* hours went today.  
I'll continue tomorrow, I guess.

Two items:
- Actually, to make it non-schizo with "assign the typed thing to the variable", I should pass in the whole `v::t` arg in the body; then I won't even have to… do anything here, really, if I partially-evaluate non-native functions correctly.
- Actually, if we have a non-native function but some (not all) inputs are unknown, we should pass those not-prepared-for-recording inputs to the function.

```
Int: 'Int'
Sum: (function  a::Int  b::Int  a+b::Int)
Mult: (function  a::Int  b::Int  a*b::Int)

x: ?::Int
Client: x -> (Sum x (Mult x x))

Client
⇒ 'Ideally:'  x::Int -> x+x*x::Int  x:?
```

It even looks better for client code.  
(This even has some manner of type inference: make all variables `#`, then for each "can't assign" error message, make it `?::…`.)

…Choices for the user, as a UI on choices for the program… I don't know.

---

19 January 2020.

I now inline the untyped example from yesterday. (I inline everything non-native, in fact. Good for REPL usage.)  
Actually, nevermind, having troubles…  
Literally just this and composition. Even though, if I write the composition out with normal functions, it all inlines fine.  
…Maybe it's because I don't create a new scope for function purification. Well, the composition is now fine.  
I was altering `(_unknown)`s belonging to variables, so `x -> ((function a b a+b) x x*x)` wasn't passing; now it does, but copying everything is inefficient.  
Now I re-use `(_unknown)`s not belonging to variables; still, type-checking fails for some reason (trying to assign undefined to stuff).  
(Now, trying to assign `(_unknown ?::Type)` to `?::Type`.)  
Things are changing around just because I add logging.

At this rate, I'm never going to get to self-rewriting today (which I outlined).

Okay, got the type-checking to partially-evaluate. If working with my code has taught me anything, it's that it's as stable as a box of dynamite. I'll add those as tests.

(It takes half a second just to switch the tab to that file.)

Actually, I'm seeing another crisis: `a:1 (a a:2) (a b) (a:3 a) b:4` *should* become `(2) (1 4) (3)`, but neither fast.parse nor regular parsing get it correctly (and produce different results). *Uh-oh*.  
fast.parse only fails if the re-binding is after the variable — `a:1 (a:2 a)` is fine. Since it's supposed to be *fast* (and fixing it would imply deferring all binding to the end of an array), I'll give it a pass. But `bound` somehow overwrites the outer scope, or something.  
Oohh; it's the same label, so it only gets looked up once. Removing caching there breaks globals highlighting though; fixed.  
…Somehow, putting `noInline` into *any* namespace makes `finish` decide to apply functions to unknowns. Because in the `broadcasted` call that initializes `sum`/…, `noInline` becomes different… but why? Mm, everything that's in a namespace does not have anywhere to initialize from when loading on key lookup, so I've been copying things the whole time. Not anymore.

If I had working usage-context, I could have added some transformed-by-some-usage quickly-fading particles when events concerning a thing happen (like total graph size or time-to-init on load), or on intent hovering. It would have been awesome (even if hardly comprehensible). But I have to do at least two things before I can even begin working on working usage-of-expr, nor a framework for scoped optimizing choices and choice optimizers. Sanity first, madness second.  
Even though I outlined (for myself) how to write js out properly… I don't really want to do that by now.

(Just needed to reload VSCode, btw.)

---

20 January 2020.

Break time.

---

21 January 2020.

Quined in two ways.

---

22 January 2020.

Ancient rage.  
Structural inference.  
100 examples.

---

23 January 2020.

Though `assign` now theoretically works with graph patterns, purification actually replaces cycle edges in those patterns with `cycle`. If only I had something like `graph Expr` or perhaps `quote Expr` (can't *create* graphs with computed variables easily, but should work in `assign`; I guess I can add the buzzword `graph pattern matching` now).  
I'm going through my backlog at a pitiful pace of 1 day per day. Things that are left there are about 5 not-super-trivial things (making concepts' views JS objects keyed by ID for speed, SelfToGraph, generic definable `smoothPre/smoothPost(el, ...props)`, report time-to-execute/serialize, userTime/realTime, bottom-up `rewrite` and use it in `function` and make `_isStruct` arrays unknown only in expression parts in `finish` (thus removing the need to handle unknowns specially and with a lot of overhead in `assign`)), compilation, and in-context function call generation (`apply Function Context`, generation by partial evaluation). That last one would begin to allow actual magic, as opposed to the trivial things I've been doing, so I should be rushing towards it, but I can't care.

(Also, just from the random things I'm seeing when I'm searching documentation, Racket has an amazing wealth of libraries, like GitHub API. But I won't do anything like that until I can generate behavior coherently, with some magical documentation (behavior specification) equivalent for computers.)

This journal is so dry. Make most of words now, ay.

---

24 January 2020.

Logging *definitely* modifies inner structure somehow, for `(var)`/`?` inside; possibly `unbound` or `serialize` does some strange things. I *should* debug it, but I can also just not log stuff, so…

I'm so sick of these bullshit little tasks.  
I cancelled/postponed a few. No fear.  
Only `compile` and `apply` left.  
Two fears.

---

I'm not feeling inspired.

---

This is complicated. I try to do calls, and I remember that I also need to expand …R, statically and dynamically. I do compilation, and I remember that I need to handle both "`finish.env[_id(label)]` contains useful stuff" (for compilation in `finish` of subexpressions) and "we are a stand-alone function".  
I've done half a dozen other things while staring at the screen of compilation.  
I wonder if I'll even be able to do compilation by the end of the month.

Also, in infinite optimizable function families, uniting the context and functions into one thing would be beneficial. Nothing can be more fundamental than "use any of these things however you want". Compiler first, though; *far* too slow otherwise.  
(Such freedom and simplicity. How to make it perform anywhere near well? Enrichen and enrichen it until a critical mass is reached, I think.)

Also, that `x::Int→x+(mult y y y:?)::Int` bug appears much more frequently if I do a moderate amount of `console.log`s (not a lot — I already had to wait half an hour for memory to settle when I made a *lot*). It's probably some kind of interruption bug. (Funnily enough, I did fix an interrupt bug in `_function`, but that fixed absolutely nothing.)  
I fixed it. Turns out, updating a variable that is set inside a call that could interrupt, *after* the call, is a bad idea.  
Having a test rarely randomly fail wasn't a good look.  
Ah, the things I do to not do the compiler.

---

Mental infection crawls through the vents of this fortress.

---

The gate remains closed.

---

The gate remains closed.

---

The gate remains closed.  
Some ideas regarding infinite library-like type-relevant networks of applicable usage were had, but I am currently not a hard-working person.  
Maybe tomorrow I'll at least finish up the compiling (300 lines now, probs needs 10 more) and go through the code it generates on some tests, maybe all tests if successful. (Who knew that branching would be so difficult, with the need to analyze the dependency graph and lazily compute nodes if we can't prove that it is always computed beforehand.)

---

1 February 2020.

I'll have to try harder than that.  
Quadratic time complexity of fully re-counting ref-counts of each branch of a conditional is completely unacceptable in a compiler, as is the quadratic space complexity of generated code when I just reset compiled-ness state when switching a branch.

HNNNNG  
It is done. 390 LoC. Untested, but I never want to see it again for now. I'll read up on what I wanted to do with auto-use.  
Hierarchical not-relying-on-closures picker-function is first, mmm. Then various filterings of contexts for efficiency.  
Pain Simulator 2020 looks great. (Though it does already look more doable than that abomination of a graph compiler.)

---

Extremely minor tasks around the codebase…

---

"Untested" is a synonym for "doesn't work".  
Testing a bit, fixing a bit.  
All the tests I've outlined specifically for testing compilation now pass (from looking through generated code); to continue on this, I'd need to integrate compilation with finish & function and look at *everything*'s compiled output (and/or run it).  
The things I do to not do `uses Value Ctx`/`apply Func Ctx`.

---

I am definitely going to die for my troubles, so I'm not exactly motivated.

Or maybe I just haven't come across anything inspiring lately?  
Stuck in a rut, one might say.

Is evolution really just about, for sexual reproduction, just randomly picking out random genes?  
Evolution is unconstrained optimization by repetition; who's to say that such random chance *hasn't* evolved something like "during life, accumulate some how-good-this-gene-was info on the gene, and pick the best of partners on reproduction" or "preserve and track how-good-this-gene-was across generations" — maybe not a unified solution, but a bunch of ad-hoc solutions like that for some genes? It *would* be better, and optimization is all about "better".  
There does seem to be something about Earth's life that's far too complex for dumb random chance like anyone could program in 2 minutes.

---

> Yesterday's tradition is tomorrow's reward hacking.

---

2020 March 25.

I've seen the darkness, and the agony that lonely pursuit of truth brings. But must I really impose it on others? One can only go so far without safe havens to recuperate. Would it not be better to strive to make welcoming and gentle little refuges, and burn away the great dark designs? Let new things of humanity flow through this worn down soul.

Are you jealous of people's kindness? Then remember kind words, silence the disquiet, and say things you wish others would say to you.

"Do you wish to understand what software system can do what this one does? Then seek XXX.rkt, and let the words and code within guide your journey."

"Welcome, traveller of code. A wild assortment of procedures and files can be puzzling to sort through if only clipped names are strong enough to guide. We'll repeat our journey through these labyrinths to give you a goodly sense of how and why we did it."

"Some people spend their lives in puzzles of dazzling symbols. Let our words be a road for the rest."

"The best way to learn something is to use it, so together, let us walk through examples of where this piece of code shines through, welcomed like rays of sun on a cloudy autumn day."

"This piece is assigned the job of compilation — given our IR made by XXX, produce a program of CUDA that does the same. Words are how it's done: remember our own memories of our IR, read CUDA's documentation, and find a good path between them. One is below."

"And with this, the thing works. Did this exercise give you a good understanding? Then, ahh, this weary heart is warmed so. But there are plenty more puzzles where that came from. Kindly, never stop learning, and we won't either."

---

How does a warrior know how to strike where she wants; how to get an arrow to land at the precise spot, how to reach as far as needed with the sword? There is no direct relation between muscle forces and how far off a guess was, so indirection of reinforcement is required. Perhaps a neural network's `.fit(dataset)`, with all target info and her pose and intention as input and muscle forces as output, rewarded at strike, could do.

But what if she encounters a different enemy? Cannot retrain the network from scratch. Must search what to do, and how to learn that. Transform outputs of this one? Modulate them with another network's? Make a new network with others' outputs as inputs, and train that? And perhaps, late at night, realize that some networks have been trained out of significance, and simplify the super-network?

That's how all machine learning models are created and evolved, when considering the humans a part of them: search for the high-level model that best explains the data, using a more basic learning as a base; add structural refinements like batching for large datasets or experience replay for small datasets, like evolution or in-place rewriting with undo; and across such searches, create and learn and refine concepts and their associations. No deeper static truth, no philosophies nor gods. Searches on top of searches on top of searches, that over the millennia found ways to protect themselves from the raw abyss of absolute freedom.

Ah. No matter. Words are both powerful and ephemeral, and without concreteness, they won't allow to find out anything new.

Do not search for the ultimate truth, for AI. Make sure such searches are more guarded, for many is always more powerful than one. A warming heartplace, not a cold palace.
