This is a tutorial for a language that experiments with new basic ways of writing down programs.

# Setup

It runs [entirely in the browser](https://antipurity.github.io/conceptual), so no installation is required. Ignore the dials under the REPL.

But if executing a file is more familiar to you, then [download Node JS](https://nodejs.org/en/download/), then grab `self.js` from the repo, then execute the file with a terminal command:

```
nodejs self.js <your_file
```

(There is also another way to get `self.js`. Run `(ToReadableJS)` in the language's REPL; then, to bypass quotes-escaping, right-click on the resulting string, click in the textarea, then Ctrl-A Ctrl-C; then Ctrl-V into a file.)

# Basic syntax

There are two things to keep in mind here: *the basic language is concerned with representing arbitrary graphs*, and *a graph node is an array with the executed function as the first element and its inputs following*.

A graph node is specified with `(...?)`, a graph binding is specified with `Label=Is`. Throw in numbers and strings, and that's the whole `basic` sub-language.

```fsharp
> (min 1 2)
1
> (f 1 2) f=(function a b (sum a b))
3
```

Extremely simple, and intended to directly mirror how values are in computer memory. But such minimalism practically requires IDE support.

We'll use `fancy` here (a superset of `basic` with more familiar operators), because it's more convenient.

Graph bindings are used as intermediate variables in functions, but they can also be shared between functions (acting as a separate value in each call):

```fsharp
f = x->a+(min a 0)+10
g = x->a*2
a = 125 - x*x
(f 5)+(g 10)
;='Becomes [100+0+10]+[25*2], then 110+50, then 160.'
```

They also don't need to be specified *before* usage, because you can't define an arbitrary graph without backpatching (`a a=(b) b=(a)`).

Bindings are put in at serialization, and some globals merge their equal usages at parsing, so you may see `(x y) -> [3*x-y]*[3*x+y]` become `(x y) -> [a-y]*[a+y] a=3*x`, with both `3*x`s highlighted on hover in editor to signify the same in-memory value.

There are no closures (unless you use `closure`), and a function does not see its parent function's labels, because there is no difference between defining a function directly in another vs through a binding.

## Sub-languages

Here, "language" is something that defines how to `parse` and `serialize` it — mainly just `basic` and `fancy` for now. Having both abilities allows using whatever terse notation is appropriate, but still giving new users a way to access a more explicit explanation, with direct references to globals and their documentation if needed.

I don't need to explain what those operators do, find out for yourself (by right-clicking an expression and viewing its basic serialization, "Basically: ..." or basically-of "Deconstruction: ..." if it's a non-array object in memory).

## Example comparison with Scheme

Here's how you could define a square-this-number procedure in Scheme:

```scheme
(define square
  (lambda (n)
    (* n n)))
```

Here is how you would do that in `basic` (such as in `REPL basic`):

```fsharp
square = (function x (mult x x))
```

And in `fancy`:

```fsharp
square = x -> x*x
```

How a value is accessed is a matter of syntax and how the program was entered, not semantics.

(This works in the REPL, and binds the label `square` to the quoted result, able to be unbound by clicking on the red triangle to remove it.)

You could define basic Scheme list-manipulation procedures like this:

```fsharp
car = (a ...r) -> a
cdr = (a ...r) -> r
cons = (function a r (array a ...r))
  ;="Using `array` to not treat `a` as the function to call."
```

Having just one `rest` global for basic array manipulation is more convenient than three. (But here, `(...?)` is a contiguous block in-memory.)

## Using the language

The language has too many bugs to be usable.
