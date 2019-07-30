# Core

Building something around a small extensible core means that the whole can be learned gradually, and it is effectively as simple or complex as it needs to be. Replacing "something"/"the whole" with "implementation" makes it mean "bootstrapping is maximally easy to start" (with ext.); with "system" — "understanding is easiest to start"; with "view of reality" — "true AI is easiest to start".

The Conceptual core permits full and arbitrary extension of (and access to) syntax, semantics, and the host language, whether statically or dynamically; it also defines the functions needed to do that easily. The rest of the Conceptual language can and should be written using only the core.

Usually, program syntax defines program semantics; code defines data; base implementation defines the language. These are all one-way artificial separations; far more natural would prove adding mechanisms for (re-)defining in the opposite direction — extensibility. With none being more fundamental, none needs to fully realize the other beforehand, and evolution of the whole can happen naturally and gradually.

# Syntax

- **Inspecting**

The precise parsing rules at a point in a program can be hard to remember, so the ability to show them is nice. The label `syntax` binds to the current rule.

By default, it can only show the default parsing rules. Let us explain and describe them first.

Though arrays and labels are technically the only syntax rules necessary to define a language (see Lisp), doing so forces function arguments to be arrays (and the program text to be wrapped in brackets, besides). Since the code/data distinction is so important to us (as are looks, and strings for parsing work), we have more syntax rules in the core than 2. Namely, these are all tried in order (each falls through to the next if it fails):

- Many, `Rule, Rule, Rule`, separated by commas or newlines. `Rule` is Function by default, changed by `#syntax Rule`.

- Function, `Call => Function`, right-to-left.

- Call, `Grouping Call`, left-to-right, without newlines.

- Grouping, `[Function]`, required when operators are in syntax.

- Array, `(Many)`.

- String, `'abc'`.

- Label, `abc`.

See the meta-circular syntax example for what `syntax` actually binds to by default.

- **Changing**

Parsing consumes a part of the program string to produce its meaning (usually its AST, to be analyzed/compiled/executed later) — a process that is seen here as `Program => (Meaning, Rest)`.

To extend a parsing process means to give it a function (via `#syntax Rule` in Many), but function definition generally only happens during execution; so, parsing may need to wait for execution at extension points.

The Many parsing rule is the place where all the extending magic happens (the rest of them just return the required executable representation). When it sees an item of the form `#syntax Rule`, it suspends the whole parsing stack, and puts the instruction to continue (with an updated Rule) as the temporary last array item of the resulting meaning; all the Many parents get a raise-error instruction ("cannot parse parent when its child is not yet parsed; ensure that all `#syntax Rule`s here are evaluated before their parents").

Syntax changes, while arbitrary, are thus scoped and clean.

See pattern-matching (and calls/functions) semantics for how rules are intended to look and work.

(Another scoped way to change syntax is to apply a program string to a rule, assert a whole parse, and return the meaning: `[(M, '') => M][Rule '...']`. It makes a part of host rules bleed into hosted (namely quote-escaping), but it can be done on runtime strings too — using the same Rule functions too.)

# Semantics

- **Calls and functions**

The core provides a Lambda-calculus-like facility; namely, function abstraction `Data => Body` (way nicer-looking than `λData.Body`) and application (call) `Function Data`. Just as in Lambda calculus, these are used to specify arbitrary computations; but they are actually completely different, and more natural and extensible.

Examples first, theory second.

```javascript
//Pretend that the language has comments.
[a => '5'] '2' // '5'

['1' => '2']'1' // '2'
['1' => '2']'2' // <fails>

[(a,b) => (b,a)]('1', '2') // ('2', '1')
[(a,b) => (b,a)]'12' // <fails>

[[A => B] => A]['1' => '2'] // '1'

[act(F,D,T) => act(F,F,T)][act('0', '1')] // act act
```

A function can be thought of as a match-replace rule.

Abstraction/recording is also accessible as `record(Data, Body)`; application/acting — as `act(Function, Data, Then)` (the third parameter is the call-stack moved into call objects, for full control over control flow; non-active acts have a special value for it). (These look far too ugly to *not* have syntax rules for them.)

Records do not merely remember structure; they partially evaluate the body, remembering the result and side-effects of the known, and preserving the unknown for later filling. Records remember *minimal* structure, for fastest acting.

Function/record arguments are captured (see pattern-matching). Bound labels will be remembered, unbound labels will be bound to what is captured, and structures will be destructured (or cause the call to fail). Referring to labels that were not bound is an error.

There is no shadowing, because pattern-matching needs to be able to bind to things. Care is needed to use new names; all pre-existing names are lowercase, and longer than one character.

```javascript
[a => b]'0' // <failed>
[a => a]'0' // '0'

[first((a,b), b) => a]('1', '2') // '1'
[first((a,b), b) => a]'3' // <failed>
[first((a,b), b) => b]'4' // '4'

[first((a,b), b) => first(a,b)]('5', '6') // '5'
[first((a,b), b) => first(a,b)]'7' // '7'
```

Acts and records exist here to allow arbitrary computation, so they are the ones to target to make any computation extensible. `concept Redefines` is how data that defines its use is written; `Redefines` is a function that matches the act that this data was found in, to replace it with whatever it wants; failure to redefine causes a fall-through to regular control flow.

Acting can then be thought to be wrapped in a `Then`-handling version of `first(Code[concept Def] => Def[Code[concept Def]], Code Data => ...)`.

(Arrays defer to the first redefining item. Acts defer to code alone.)

```javascript
[R => (
    R('1', '2') // '1'
    R[concept[R Self => '3']] // '3'
    R('4', concept[R X => X], '5') // ('4', concept[R X => X], '5')
)][(a,b) => a]

[concept Redefines => Redefines] '12' // <some function>
act[concept[act Self => '12']] // '12'
```

Extensibility makes it always possible to add or change a definition, with either the code→data or the data→code avenue. This means that viruses and other ill-intentioned things always have an easy in. The key to the language *not* automatically making all its programs one giant security risk, is literally perfect control and robustness: no crashes, no possibility of side-effects escaping where they should not, everything is designed with arbitrary code in mind. Simplicity helps with ensuring that there are obviously no deficiencies.

- **Pattern-matching**

Pattern-matching is a powerful paradigm that subsumes functionalities of assignment/binding and branching in a much more streamlined and easy-to-invert form. It can even handle parsing and array destructuring naturally, making it a perfect fit for a language core that allows extending parsing.

```javascript
[a => (a,a)]'1' // ('1', '1')
[(a,a) => a]'1' // <failed>
[(a,a) => a]('1', '1') // '1'
[concept a => '2']'1' // '2'

first((a) => a, (a,b) => b)('1', 
2') // '2'

flatten('<', 'br', '>') // '<br>'
[flatten('<', x, '>') => x]'<br>' // 'br'

[flatten('123', Rest) => Rest]'12345' // '45'
[flatten(first'123', Rest) => Rest]'12345' // '2345'
```

Though it is easy enough to just use it in function args, extensibility demands it to be accessible directly, as `capture(Structure, Object)`. Matching is assignment *extended with* some structural forms.

- Binding is done with `label 'abc'` or `abc`; when a label is unbound, it is bound to what it captures, via having it be returned as a part of the `Label => Value` function that results from `capture`.

- `first(…)` returns the first success (of matching or acting or execution); `last(…)` returns the last success. Matching failures unwind to the first enclosing `first(…)` to try the next branch. Between this backtracking and sequential/guarded execution, these two cover branching; for example, "if A then B else C" is `first(last(A,B), C)`.

- Working with arrays is done via `flatten(…)` (strings are arrays of characters). Sub-arrays will be destructured on capture; unbound variables outside of brackets can be used to capture 'the rest'.

- Generally, every built-in function must also redefine capture for its results, to give full destructuring capabilities to the user. This is too trivial to mention each here in detail, though.

Ordinarily, all these extensions would not be seen separately from pattern-matching, easily resulting in a behemoth of a definition that pushes non-familiar users away (or a good description and a behemoth of implementation, increasing both effort needed and bugs). Here, we can see how extensibility of capturing allows separating everything nicely and cleanly, for gradual digestion.

- **Side-effects and hosts**

Even if a program is completely pure, its environment has no such guarantees; still, we often want to act like we own the host and not the other way around, undoing or delaying any side-effects as we please (like in partial evaluation, or synchronizing parallel memory accesses).

`effect(Value, Changes)` allows putting knowledge about prior side-effects into a value; `Changes` is a function that can transform every expression that executes after (or fail, to leave the control flow be).


All operations on effectful values preserve effects; the only way to clear them is with an enclosing `host(Handler, Expr)`. `Handler` is a function that transforms effects on each expression the interpreter loop encounters within, `Changes => Changes` (on failure, fall through to the nearest enclosing host).

Generally, effectful built-in functions produce virtual effect descriptions, and the main host takes care of them and turns them into reality. Not only can/should the host be described in the language it hosts (with small hidden functions-ports), but the current host can be redefined arbitrarily (say, `host(x=>x, ...)` will virtualize all effects, which can then be collected and maybe used).

Convoluted, but this allows to both have side-effects *and* not worry about them.

(Separation into small ports is done so that safety can be gained. If the host language is already safe, and cannot crash nor never return, nothing prevents from exposing it wholesale, through one big port. Development can then be done metacircularly through that.)

- **Little things**

- There were once several small utility functions, but then we covered everything. So this section is for comments.

- Failures (value-less exceptions) can be implemented in the language (via the third arg to `act`), but without array destructuring, `first`/`last`/`flatten` cannot be.

- Check-and-bind can be useful (like `which: first'123'`), but it would bring too much with it for this small core.

- The binding of labels, and the interpreter loop, play a big role in this, but they are not exposed for extension. Maybe they should be, though isn't this long enough already?

- References can be useful. Releasing captured resources on function exit can be useful. Match-all and match-none (and match-any) can be useful (especially for unifying several label instances). *Numbers* can be useful. But this is a *minimalistic* core.

