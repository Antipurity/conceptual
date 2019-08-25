# Core

This is the plan for a minimal pure language core. It covers arbitrary and dynamic self-discovery, syntax, computation, pattern-matching, branching, and partial evaluation in a pure context. The core's simplicity ensures that there are obviously no deficiencies.

Core language concepts overview:

- `concept` to re/define usage of a thing. Extensibility and dynamic self-discovery.

- `eval` for everything about syntax and its evaluation. Inspect or change the current language as it is written. `core` for switching to this language.

- `do` for (continuation-passing style) computation. Control flow and flow control.

  - `error` for reversing control flow.

    - `first` and `last` for branching.

- `record` for creating functions by remembering the unknown.

  - `label` for binding values.

  - `capture` for matching patterns to objects.

    - `flatten` for de/structuring arrays.

Mastering pure programming to see beyond its bounds. Based on a past, this is a base for a future.

---

# Extension

A general principle, that anything created (a past) should leave a hole to allow arbitrary refinement as needed (a future) — branch-to-data; all instances of this are expressed through `concept Redefines` here (`Redefines` is a `Past => Future` function). This dynamic self-discovery is threaded thickly throughout this core: the syntax and the semantics branch-to-data.

Since extensibility is meaningless without what extends it, we won't give any primitive code examples like:

```javascript
core
  //The language is picked; what follows is in that language.
  //The picked here language allows creating any other language.
  //`concept[eval … => …]` allows using created languages.

[a => 8] [concept[x => 5]]
  //Call a function that always returns 8.
  //But its input turns own usage into 5.
  //So the result is 5.
```

Instead, we'll talk about what this concept means.

Building some thing around a small extensible core means that this thing can be learned gradually, and it is effectively as simple or complex as it needs to be. Long-term, it is the easiest path to *anything*, for some start-up time cost: if "that thing" is "implementation", that means "bootstrapping is maximally easy to start getting into"; if it is "system", that means "understanding is easiest to start assimilating"; if it is "view of reality", that means "intelligence is easiest to start making". *Not* trying to go through reconstruction of everything around a proper core indicates blindness to future and potential.

Usually, program syntax defines program semantics; code defines data; etc. These are one-way artificial separations; what is far more natural is adding mechanisms for (re-)defining in the opposite direction — extensibility. With none being more fundamental, none needs to fully realize the other beforehand, and evolution of the whole can happen naturally and gradually.

# Syntax

Allowing runtime extension of parsing means that execution and parsing can flow into each other in the general case, and so cannot be separated into produce-description and act-on-description. So, to extend syntax, we need to extend evaluation of strings.

Evaluation with a parsing rule of a string turns them into the extracted description (meaning) and what else needs to be parsed: `eval(Rule, Program) → (Meaning, Rest)`. Usually, this effectively advances the position in a program, but generally the transformation is arbitrary.

- **Branch-to-data**

Extension of syntax from nothing to something.

The very top level of syntax is intentionally very simple and only allows specifying the language of the rest. Until input's end, it gets an identifier (the longest sequence of non-whitespace characters), looks up its value, then jumps to evaluating with value of the rest (skipping one whitespace character) then to continuing self.

This is intended to allow things like:

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
sentence Sum of two and five.

core
  concept[eval(Core, In) => (5, eval(Core, In))] 6 // (5, 6)
    //Wraps the result of the rest in (5, …).
```

There is not even a need for a language-switch directive; it happens as easily as thinking about a language.

As nothing can be done in just the top-level, you should just put `core …` at the beginning of all programs.

- **Core syntax**

Extension of syntax from something to everything (that is do-able).

Though arrays and labels are technically the only syntax rules necessary to define a language, doing so forces function arguments to be arrays (and the program text to be wrapped in brackets, besides). Since the code/data distinction is so important to us (as are good looks, and strings for parsing work), we have more syntax rules in the core than 2. Namely, these are all tried in order (each falls through to the next if it fails):

- Many, `Rule, Rule, Rule`, separated by commas or newlines.

- Rule, `Call => Rule`, right-to-left.

- Call, `Group Call`, left-to-right, without newlines.

- Group, `[Rule]` (required whenever a syntax has operators). Cannot have many items inside.

- Array, `(Many)`.

- String, `'abc'`.

- Label, `abc`.

Any value can (potentially) re-define parsing; if that happens, we jump to execution of that with a continuation of return-to-parsing. Syntax changes, while arbitrary, are scoped and clean.

See semantics (and calls/functions and pattern-matching) for how syntax rules are intended to look and work.

(Another scoped way to change syntax is to apply a program string to a rule, assert a whole parse, and return the meaning: `[(M, '') => M][eval(Rule, '...')]`. It makes a part of host rules bleed into hosted (namely, quote-escaping), but it can be done on runtime strings too — using the same Rule functions too.)

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

