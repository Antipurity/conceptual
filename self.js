/* Code begins at the first `})({`, as methods that are bound to each other. _XXX methods are private and somewhat invisible. */
'use strict';
(function() {
const __version = '0'
const __is = (function is(name) {
  const obj = Object.create(is)
  return obj.is = name, obj
});
function __base(net) {
  const globals = typeof self !== ''+void 0 ? self : typeof global !== ''+void 0 ? global : window
  const env = new Map
  const constructed = new Map

  const defKey = Symbol('defines')

  // preload is for easier lookups. load is basically a copy of `bound` with a little notational convenience stuff thrown in.
  preload(net, globals)
  load(net, globals, true)
  postload()
  Object.keys(net).forEach(k => k && +k === +k && delete net[k])
  if (net.interrupt) net.interrupt.noInterrupt = false

  return Initialize.call(globals, net, typeof __line != ''+void 0 ? __line.lines : undefined)

  function objectFor(x) {
    // Load {call(){}} into a trivially-callable function, as a notational convenience.
    return x && typeof x.call == 'function' && x.call !== Function.prototype.call ? x.call : Object.create(null)
  }
  function preload(from, into) {
    // Pre-create objects/functions to be filled by `load`, so that arbitrary order of definitions is permitted.
    Object.keys(from).forEach(k => {
      if (k in into) try { delete into[k] } catch (err) {}
      if (from[k] instanceof Map) {
        if (into[k] === undefined) into[k] = new Map
        return
      } else if (from[k] && Object.getPrototypeOf(from[k]) === Object.prototype) {
        if (into[k] === undefined) into[k] = objectFor(from[k])
        if (typeof into[k] == 'function') into[k].displayName = k
        return
      } else if (Array.isArray(from[k])) {
        if (into[k] === undefined && +k !== +k) into[k] = []
        return
      }
      if (into[k] !== from[k] && +k !== +k) into[k] = from[k]
    })
    if (from.defines) into.defines.key = defKey
    if (from.call && from._newExecutionEnv) into.call.env = from._newExecutionEnv()
    if (from.interrupt) into.interrupt.noInterrupt = true
    Object.keys(from).forEach(k => {
      if (from[k] && Object.getPrototypeOf(from[k]) === __is) {
        if (Array.isArray(from[k].is)) { // Evaluate arrays.
          return from[k] = into[k] = postload(from[k])
        }
        else if (!(from[k].is in net)) throw new Error("Not a link to an existing thing: "+from[k].is)
        else from[k] = into[k] = load(from[from[k].is], into[from[k].is])
      }
    })
  }
  function load(from, into, inLookup) {
    // Handle is(…) (as ref-to-global) and arrays and objects (as definitions) specially.

    // Cache to prevent cycles from referring to old not-loaded versions of objects.
    if (env.has(from)) return env.get(from)
    if (from && Object.getPrototypeOf(from) === __is) {
      // Look up symbols in the network.
      if (Array.isArray(from.is)) return postload(from)
      else if (!(from.is in net)) throw new Error("Not a link to an existing thing: "+from.is)
      else return load(net[from.is], globals[from.is])
    }
    if (from instanceof Map) {
      // Load keys and values.
      if (into === undefined) into = new Map
      env.set(from, into)
      from.forEach((v,k) => into.set(load(k), load(v)))
      return into
    } else if (from && Object.getPrototypeOf(from) === Object.prototype) {
      // Load object values: turn {…} into {[defines.key]:{…}}, as a notational convenience.
      if (into === undefined) into = objectFor(from)
      env.set(from, into)

      if (!inLookup) {
        let d
        for (let key of Object.keys(from)) {
          if (from[key] === defKey) { into[key] = from[key];  continue }
            // Since objectFor(…) is different for functions, we have to copy.
          const k = load(__is(key))
          if (k !== call || typeof from[key] != 'function')
            (d || (d = Object.create(null)))[_id(k)] = load(from[key], undefined, k === lookup)
        }
        return d && (into[defKey] = into !== Self ? Object.freeze(d) : d), into
      } else {
        for (let k of Object.keys(from)) if (+k !== +k) {
          const loaded = load(from[k], into[k])
          if (loaded !== into[k]) into[k] = loaded
          from[k] = into[k]
        }
        return into
      }
    }
    if (Array.isArray(from)) {
      // Look into arrays and load their elements.
      if (into === undefined) into = []
      into.length = from.length
      env.set(from, into)
      for (let i = 0; i < into.length; ++i) into[i] = load(from[i])
      return into
    }
    return from
  }
  function postload(from, obj) {
    if (from !== undefined)
      constructed.set(load('defines')(from, load('construct'))(from.is.map(x => load(x))), from)
    else
      constructed.forEach((from, obj) => construct(env.get(from), obj))
  }
}
__base({

  Initialize:{
    docs:`The program's entry point.`,
    lookup:{
      Browser:__is(`Browser`),
      NodeJS:__is(`NodeJS`),
      WebWorker:__is(`WebWorker`),
    },
    nameResult:[
      `Nightmare reborn`,
    ],
    call(net, lines, into) {
      if (!net || 'ctx' in Self) throw "Do not call Initialize manually."
      if ('→'.charCodeAt() !== 8594) throw "Unicode data got garbled."
      if (defines(call, docs).indexOf('\n ') >= 0) throw "Depth got added to strings."

      net[undefined] = undefined, Initialize.lines = lines

      // Turn `net` into maps.
      let ctx = new Map
      Object.keys(net).forEach(k => ctx.set(label(k), net[k]))
      ctx.set(label('_globalScope'), net)
      Self.ctx = ctx
      Self[defines.key][_id(lookup)] = net, Object.freeze(Self[defines.key])

      // Initialize every global that defines `Initialize`.
      for (let k in net)
        if (typeof defines(net[k], Initialize) == 'function')
          defines(net[k], Initialize)(net)

      // Select the appropriate JS-environment-specific entry point.
      let ok = false
      if (this.self && !this.window)
        WebWorker(), ok = true
      else {
        if (this.process)
          NodeJS(), ok = true
        if (this.document)
          Browser(into), ok = true
      }
      if (!ok)
        throw "What is this JS environment? Submit a bug report so that we know of it."
    },
  },

  Execution:{
    docs:`Execution-related functionality.`,
    lookup:{
      call:__is(`call`),
      error:__is(`error`),
      await:__is(`await`),
      repeat:__is(`repeat`),
      Numeric:__is(`Numeric`),
      Data:__is(`Data`),
    },
  },

  Documentation:{
    docs:`Documentation-related functions.`,
    lookup:{
      tutorial:__is(`tutorial`),
      docs:__is(`docs`),
      refs:__is(`refs`),
      refd:__is(`refd`),
      sizeof:__is(`sizeof`),
      examples:__is(`examples`),
      future:__is(`future`),
    },
  },

  Numeric:{
    docs:`A namespace for some very primitive numeric-computation-related functionality.`,
    lookup:{
      transform:__is(`transform`),
      Arithmetic:__is(`Arithmetic`),
      Random:__is(`Random`),
      NumTypes:__is(`NumTypes`),
    },
  },

  Arithmetic:{
    equals:__is(`equals`),
    less:__is(`less`),
    min:__is(`min`),
    max:__is(`max`),

    add:__is(`add`),
    sub:__is(`sub`),
    mul:__is(`mul`),
    div:__is(`div`),
    pow:__is(`pow`),
  },

  equals:{
    argCount:2,
    interrupt:false,
    examples:[
      () => {
        const a = Math.random()*10000-5000, b = Math.random() < .5 ? a : Math.random()*10000-5000
        return [[equals, a, b], a === b]
      },
    ],
    call(a,b) { return a === b },
  },

  less:{
    argCount:2,
    interrupt:false,
    examples:[
      () => {
        const a = Math.random()*10000-5000, b = Math.random()*10000-5000
        return [[less, a, b], a < b]
      },
    ],
    call(a,b) { return a < b },
  },

  min:{
    argCount:2,
    interrupt:false,
    examples:[
      () => {
        const a = Math.random()*10000-5000, b = Math.random()*10000-5000
        return [[min, a, b], Math.min(a,b)]
      },
    ],
    call(a,b) { return Math.min(a,b) },
  },

  max:{
    argCount:2,
    interrupt:false,
    examples:[
      () => {
        const a = Math.random()*10000-5000, b = Math.random()*10000-5000
        return [[max, a, b], Math.max(a,b)]
      },
    ],
    call(a,b) { return Math.max(a,b) },
  },

  NumTypes:{
    docs:`A namespace for common numeric types.`,
    lookup:{
      i8:__is(`i8`),
      i16:__is(`i16`),
      i32:__is(`i32`),
      u8:__is(`u8`),
      u16:__is(`u16`),
      u32:__is(`u32`),
      f32:__is(`f32`),
      f64:__is(`f64`),
    },
  },

  i8:{
    docs:`\`(i8 (…Numbers))\`: creates a flat array of signed 8-bit integers.`,
    argCount:1,
    call(x) { return new Int8Array(x) },
  },

  i16:{
    docs:`\`(i16 (…Numbers))\`: creates a flat array of signed 16-bit integers.`,
    argCount:1,
    call(x) { return new Int16Array(x) },
  },

  i32:{
    docs:`\`(i32 (…Numbers))\`: creates a flat array of signed 32-bit integers.`,
    argCount:1,
    call(x) { return new Int32Array(x) },
  },

  u8:{
    docs:`\`(u8 (…Numbers))\`: creates a flat array of unsigned 8-bit integers.`,
    argCount:1,
    call(x) { return new Uint8Array(x) },
  },

  u16:{
    docs:`\`(u16 (…Numbers))\`: creates a flat array of unsigned 16-bit integers.`,
    argCount:1,
    call(x) { return new Uint16Array(x) },
  },

  u32:{
    docs:`\`(u32 (…Numbers))\`: creates a flat array of unsigned 32-bit integers.`,
    argCount:1,
    call(x) { return new Uint32Array(x) },
  },

  f32:{
    docs:`\`(f32 (…Numbers))\`: creates a flat array of 32-bit floats.`,
    argCount:1,
    call(x) { return new Float32Array(x) },
  },

  f64:{
    docs:`\`(f64 (…Numbers))\`: creates a flat array of 64-bit floats.`,
    argCount:1,
    call(x) { return new Float64Array(x) },
  },

  Data:{
    docs:`A namespace for some data-representation-related functions.`,
    lookup:{
      array:__is(`array`),
      lookup:__is(`lookup`),
    },
  },

  UI:{
    docs:`A namespace for user interface functionality.`,
    philosophy:`Even when switching languages and/or bindings makes some things look the same, being able to {highlight ref-equal objects}, and {view the basic default-bindings serialization}, and {link to actual values without going through text}, makes meaning a first-class citizen. This is impossible to achieve without first-class UI support, but with it, incomprehensible code can be easy to understand (replicate in a mind).
Keep names short and rely on the IDE. Route gradient not through the text representation, but through actual dependencies.`,
    lookup:{
      Languages:__is(`Languages`),
      Commands:__is(`Commands`),
      settings:__is(`settings`),
      log:__is(`log`),
      disableBindings:__is(`disableBindingsElem`),
      REPL:__is(`REPL`),
      contextMenu:__is(`contextMenu`),
      hierarchy:__is(`hierarchy`),
      elem:__is(`elem`),
    },
  },

  Languages:{
    docs:`A namespace for languages and their handling.
One of the world's most annoying problems is tabs vs spaces. With UI support, you can choose neither.`,
    philosophy:`Languages just define how the bound-graph structure gets parsed/serialized, not execution.
Decoupling form from meaning allows composition and trivial changing of forms.`,
    lookup:{
      serialize:__is(`serialize`),
      fast:__is(`fast`),
      basic:__is(`basic`),
      fancy:__is(`fancy`),
      stringLanguage:__is(`stringLanguage`),
      js:__is(`js`),
    },
  },

  repeat:{
    docs:`\`(repeat ^Expr)\`: loops forever when finished, interrupting as needed. \`repeat Expr Times\`: repeats the computation many \`Times\`.
Label-binding environment is not preserved.`,
    call(expr, iterations) {
      // repeat (randomNat 10) 1000
      if (iterations !== undefined && typeof iterations != 'number' && typeof iterations != 'function')
        error("iterations must be undefined or a number or a function, got", iterations)
      const prevLog = call.env[_id(log)], prevLabel = call.env[_id(label)]
      let [i = 0, newLabel = new Map, into = log(elemValue(elem('code', elem('code')), us))] = interrupt(repeat)
      into.classList.add('code')
      prevLog && (call.env[_id(log)] = into.lastChild), call.env[_id(label)] = newLabel
      let v, done = false
      try {
        while (true) {
          v = call(expr)
          if (_isUnknown(v)) return _unknown([repeat, v[1], iterations], v)
          _checkInterrupt(expr)
          newLabel.clear()
          done = true
          ++i
          if (iterations && (typeof iterations === 'number' ? i >= iterations : iterations(v,i))) return into.remove(), v
        }
      } catch (err) {
        // Log our last computed value.
        const prevPure = call.pure;  call.pure = false
        try {
        if (err === interrupt) {
          if (done)
            if (prevLog) {
              call.env[_id(log)] = into.lastChild
              const pre = _smoothHeightPre(into)
              for (let ch = into.firstChild; ch && ch.nextSibling; ch = ch.nextSibling)
                elemRemove(ch, true, false)
              log(v)
              _smoothHeightPost(into, pre)
            } else log(v)
          interrupt(repeat, 3)(i, newLabel, into)
        } else {
          const pre = _smoothHeightPre(into)
          for (let ch = into.firstChild; ch && ch.nextSibling; ch = ch.nextSibling)
            elemRemove(ch, true, false)
          _smoothHeightPost(into, pre)
        }
        } finally { call.pure = prevPure }
        throw err
      }
      finally { call.env[_id(log)] = prevLog, call.env[_id(label)] = prevLabel }
    },
  },

  lookup:{
    docs:`\`Map.\` or \`(lookup Map)\`: returns an array of Map's keys.
\`(lookup Map Key)\`: returns the value in Map at Key (neither Key nor Value can be \`undefined\`), or \`undefined\` if not found.
(For string keys, can be written as \`obj.key\`.)`,
    Initialize(net) {
      // Mark lookup.parents of globals.
      const backctx = _invertBindingContext(Self.ctx)
      lookup.parents = new Map
      function markParents(x, p, prioritize) {
        if (lookup.parents.has(x) || x === Self)
          return prioritize && (lookup.parents.delete(x), lookup.parents.set(x, p))
        if (p !== undefined) lookup.parents.set(x, p)
        if (!x || typeof x != 'object' && typeof x != 'function') return
        if (p === undefined && backctx.has(x) && backctx.get(x)[0] === '_') lookup.parents.set(x, System)
        if (x instanceof Map || _isArray(x)) {
          x.forEach(v => markParents(v, p))
        } else if (x && !x[defines.key] && typeof x == 'object') {
          Object.keys(x).forEach(k => markParents(x[k], p, prioritize || +k === _id(lookup)))
        } else if (x && x[defines.key] && !defines(x, deconstruct))
          markParents(x[defines.key], x)
      }
      markParents(net)
      lookup.parents.set(net, Self)
    },
    examples:[
      [
        `lookup (map 1 2 3 4 5 6 7 8)`,
        `1 3 5 7`,
      ],
      [
        `lookup (map 1 2 3 4 5 6 7 8) 1`,
        `2`,
      ],
      [
        `lookup Self 'lookup'`,
        `lookup`,
      ],
    ],
    interrupt:false,
    call(m,k) {
      if (!_isArray(m) && defines(m, lookup)) m = defines(m, lookup)
      if (m instanceof Map) return k !== undefined ? m.get(k) : [...m.keys()]
      if (_isArray(m) || typeof m == 'string') return k === k>>>0 ? m[k] : k === undefined ? new Array(m.length).fill(0).map((_,i)=>i) : undefined
      if (m !== defines(Self, lookup) && _invertBindingContext(Self.ctx).has(m) || typeof m == 'function') return []
      return k !== undefined ? m[k] : Object.keys(m)
      // lookup.parents: a Map from globals to what namespace they belong to.
    },
  },

  Self:{
    docs:`Open programming environments with machine learning, to treat humans and programs equally.
A namespace for every function here. Project's GitHub page: https://github.com/Antipurity/conceptual`,
    philosophy:`What happens when you force a person to change.`,
    lookup:__is(`undefined`),
  },

  argCount:{
    docs:`A marker for the number of args to a function.`,
  },

  userTime:{
    docs:`\`(userTime)\`⇒\`TimeMark\` or \`(userTime TimeMark)\`: returns the time spent on this job as f64 milliseconds, or the non-negative in-job time elapsed since the mark.`,
    call(mark = 0) {
      if (impureHave()) return impureLoad()
      return impureSave(call.env[_id(userTime)] + _timeSince(call.env[_id(realTime)]) - mark)
    },
  },

  realTime:{
    docs:`\`(realTime)\`⇒\`TimeMark\` or \`(realTime TimeMark)\`: returns the time since start as f64 milliseconds, or the non-negative time elapsed since the mark.`,
    call(mark = 0) {
      if (impureHave()) return impureLoad()
      return impureSave(_timeSince(mark))
    },
  },

  _timeSince:{
    docs:`\`(_timeSince)\`⇒\`TimeMark\` or \`(_timeSince TimeMark)\`: returns the current time as f64 milliseconds, or the non-negative time elapsed since the mark.
Makes no attempt to correct for the time to measure, \`(_timeSince (_timeSince))\`.
Browsers reduce the precision of this to prevent timing attacks. Putting that precision back could be beneficial.`,
    call(mark = 0) {
      if (typeof performance != ''+void 0 && performance.now) // Browser
        return performance.now() - mark
      else if (typeof process != ''+void 0 && process.hrtime && process.hrtime.bigint) { // NodeJS
        if (!mark) return process.hrtime.bigint()
        return Math.max(0, Number(process.hrtime.bigint() - mark)/1e6)
      } else if (typeof require != ''+void 0) { // NodeJS
        if (!_timeSince.now) _timeSince.now = require('perf_hooks'), _timeSince.now = _timeSince.performance.now.bind(_timeSince.now)
        return _timeSince.now() - mark
      } else {
        // Ensure monotonicity with Date.now().
        if (_timeSince.prev == null) _timeSince.prev = Date.now(), _timeSince.add = 0
        const n = Date.now()
        if (_timeSince.prev > n) _timeSince.add += _timeSince.prev - n
        return (_timeSince.prev = n) + _timeSince.add - mark
      }
      // .prev, .add
    },
  },

  memorySince:{
    docs:`\`(memory.since)\`⇒MemMark or \`(memory.since MemMark)\`: Measures required-memory-size change (allocated memory) as non-negative f64 bytes. Always 0 in browsers.
Makes no attempt to correct for the memory-to-measure, \`(memory.since (memory.since))\`.`,
    call(mark = 0) {
      if (typeof process == ''+void 0 || !process.memoryUsage) return 0
      if (impureHave()) return impureLoad()
      const m = process.memoryUsage()
      return impureSave(Math.max(0, m.rss + m.heapUsed - m.heapTotal - mark))
    },
  },

  _isArray(a) { return Array.isArray(a) },

  transform:{
    docs:`\`(transform Function Array)\`: transforms each element of Array by applying Function.
\`(transform G (transform F A))\` is the same as \`(transform \\(F (G ?)) A).\``,
    examples:[
      [
        `(transform \?+2 (array 1 2 3 4 5 6))`,
        `3 4 5 6 7 8`,
      ],
    ],
    nameResult:[
      `transformed`,
      `mapped`,
    ],
    argCount:2,
    call(f,a) {
      if (typeof f != 'function') error("Expected a function but got", f)
      if (!_isArray(a)) error("Expected an array but got", a)
      let [result = _allocArray(), i = 0] = interrupt(transform)
      result.length = a.length
      try {
        for (; i < a.length; ++i)
          result[i] = f.call(f, a[i])
        return result
      } catch (err) { if (err === interrupt) interrupt(transform, _tmp().length=0, _tmp().push(result, i));  throw err }
    },
  },

  mul:{
    argCount:2,
    interrupt:false,
    examples:[
      () => {
        const a = Math.random()*10000-5000, b = Math.random()*10000-5000
        return [[mul, a, b], a*b]
      },
    ],
    call(a,b) { return a * b },
  },

  sub:{
    argCount:2,
    interrupt:false,
    examples:[
      () => {
        const a = Math.random()*10000-5000, b = Math.random()*10000-5000
        return [[sub, a, b], a-b]
      },
    ],
    call(a,b) { return a - b },
  },

  div:{
    argCount:2,
    interrupt:false,
    examples:[
      () => {
        const a = Math.random()*10000-5000, b = Math.random()*10000-5000
        return [[div, a, b], a/b]
      },
    ],
    call(a,b) { return a / b },
  },

  _listen:{
    docs:`Registers a global event listener, or sets an interval if \`type\` is a number (ms).`,
    lookup:{Deinitialize:__is(`Deinitialize`)},
    call(type, listener, opt) {
      if (!Deinitialize.events) Deinitialize.events = [], Deinitialize.intervals = []
      if (typeof type == 'number') {
        const int = setInterval(listener, type)
        if (int.unref) int.unref()
        return void Deinitialize.intervals.push(int)
      }
      (Self.into !== document.body ? Self.into : self).addEventListener(type, listener, opt)
      Deinitialize.events.push(type, listener, opt)
    },
  },

  Deinitialize:{
    docs:`For pretending that we never existed.`,
    call() {
      if ('ctx' in Self) throw "Delete Self.ctx to confirm"
      // Else execute order 66.
      Deinitialize.intervals.forEach(clearInterval)
      const e = Deinitialize.events
      for (let i = 0; i < e.length; i += 3)
        (Self.into !== document.body ? Self.into : self).removeEventListener(e[i], e[i+1], e[i+2])
      _jobs.expr.length = 0
      Self.into.remove()
    },
  },

  _useDarkTheme:[
    __is(`settings`),
    false,
    `Whether to use dark theme (or light).

Gaze upon the ever-shifting radiance of creation.
Or let go of all you know, to embrace vacuous might.
Just don't short-sightedly lock yourself into one consequence.`,
  ],

  _disableSmoothTransitions:[
    __is(`settings`),
    false,
    `Whether to disable smooth transitions.`,
  ],

  _noBoxStylingForPrograms:[
    __is(`settings`),
    false,
    `Whether to disable box styling, and make all program text use inline styling.
Try creating an array of multi-line strings to see the difference.`,
  ],

  _maxUsageOfCPU:[
    __is(`settings`),
    .99,
    `Debounce the interpreter loop to %%% CPU usage.`,
    __is(`rangeSetting`),
    .01,
    .99,
    .01,
  ],

  Browser:{
    docs:`A REPL interface.
Supported browsers: modern Chrome/Chromium and Firefox.`,
    lookup:{
      icon:__is(`BrowserIconURL`),
      _useDarkTheme:__is(`_useDarkTheme`),
      _disableSmoothTransitions:__is(`_disableSmoothTransitions`),
      _noBoxStylingForPrograms:__is(`_noBoxStylingForPrograms`),
      _hoverHighlightsDOMValues:__is(`_hoverHighlightsDOMValues`),
    },
    js:[
      `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js`,
    ],
    style:`.into * {transition: all .2s ease-in; box-sizing: border-box; vertical-align:top; animation: fadein .2s; font-family: monospace, monospace; font-size:.85rem}
.into:not(body) { box-shadow:var(--highlight) 0 0 .1em .1em }

@keyframes fadein { from {opacity:0} }

text { font-family:sans-serif !important }

.into {
  background-color:var(--background);
  color:var(--main);
  caret-color:var(--main);
  --background:white;
  --highlight:royalblue;
  --main:black;
}
.into.noTransitions * { transition: none !important; animation: none !important }
.into.dark {
  --background:rgb(15,15,15);
  --highlight:rgb(225, 110, 65);
  --main:white;
}
.into>*:not(script) {display:table; white-space:pre-wrap}
.into.noComplexity:not(.dark) :not(collapsed).hover { box-shadow:none; background-color:#ccc }
.into.noComplexity.dark :not(collapsed).hover { box-shadow:none; background-color:#333 }
.into.noComplexity string, .into.noComplexity node, into.noComplexity.extracted { display:inline }

:focus {outline:none; box-shadow:var(--highlight) 0 0 .1em .1em}
input[type=range]::-moz-focus-outer { border:0 }
.hover {box-shadow:var(--highlight) 0 0 .1em .1em}
.working {box-shadow:var(--highlight) 0 0 .1em .1em inset}
bracket {color:saddlebrown}
.into.dark bracket {color:royalblue}
string {color:darkgreen; display:inline-block}
string>string { filter:brightness(150%) }
.into.dark string {color: limegreen}
number {color:cornflowerblue}
prompt {font-weight:bold; cursor:pointer}
known {font-weight:bold}
node {display:inline-block; font-family:monospace, monospace}
node.text { display:inline }
error {color:red; background-color:var(--background)}
extracted {display:inline-block}
extracted.hover { background-color:var(--background); position:sticky; top:.3em; bottom:.3em; z-index:11 }
.warning { color:darkred }

scroll-highlight { position:fixed; right:0; z-index:13; box-shadow:var(--highlight) 0 0 .2em .2em; will-change:transform }

waiting {
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  margin: 1.2em;
  border-radius: 50%;
  border: .2em solid var(--main);
  border-color: transparent var(--main) transparent var(--main);
  animation: waiting-dual-ring 1.2s cubic-bezier(.5,0,0,2.5) infinite, waiting-appears .5s forwards !important;
}
@keyframes waiting-dual-ring {
  0% { transform: rotate(0deg) }
  100% { transform: rotate(180deg) }
}
@keyframes waiting-appears {
  0% { opacity: 0; height:0 }
  100% { opacity: 1 }
}


.into:not(.noComplexity) .broken { padding-left:1em }
.into:not(.noComplexity) .broken>:not(extracted) { display:table; max-width:100%}
.into:not(.noComplexity) .broken>bracket {margin-left:-1em}
.code>* {display:block}

node.code {display:table; font-family:monospace, monospace}
.editorContainer { display:table }
.editorContainer>:last-child[contenteditable] { min-height:1.2em; min-width: 1.2em; width:100%; display:table-cell }
.editorContainer.editable * { animation:none }
.editorContainer.editable { display:block }
.editorContainer.editable>:last-child[contenteditable] { min-height:1.2em; min-width: 1.2em; width:calc(100% - 2ch); display:inline-block }
.editorContainer.editable.hover>:last-child[contenteditable] { box-shadow:none }
prompt { width:2ch; color:red; float:left }
prompt::before { content:'▶' /* > ⊱ ▶ */ }
.editable>prompt::before { content:'⊱' }

edit-object>.editorContainer.editable { display:inline-block }

JobIndicator { width:14px; height:14px; margin:.2em; transition:none; background-color:var(--main); border-radius:50%; display:inline-block }
JobIndicator.yes { background-color:var(--highlight); animation: rotate 4s infinite linear, fadein .2s !important }
JobIndicator>div { width:4px; height:4px; margin:5px; position:absolute; background-color:var(--highlight); border-radius:50%; transform: rotate(var(--turns)) translate(10px); animation:none }
@keyframes rotate {
  0% { transform: rotate(-0.25turn) }
  100% { transform: rotate(0.75turn) }
}

button { margin:.5em; padding:.5em; border-radius:.3em; border:1px solid var(--highlight); color:var(--highlight); font-size:inherit; min-width:2.4em; min-height:2.4em }
button:hover, a:hover, collapsed:hover, prompt:hover { filter:brightness(120%) }
button:active, a:active, collapsed:active, prompt:active { filter:brightness(80%) }
button::-moz-focus-inner { border:0 }

table {border-spacing:0}
table>* {border-spacing:0}
td {padding:0 0 0 1ch}
td>space { display:none }

particle {
  border-radius:50%;
  width:.1em; height:.1em;
  box-shadow:0 0 .3em .3em var(--highlight);
  position:absolute;
  animation: particle-disappears .5s forwards !important;
}
@keyframes particle-disappears {
  0% { opacity: 0; transform: translate(0px, 0px) }
  20% { opacity: 1 }
  100% { opacity: 0; transform: translate(var(--x), var(--y)) }
}

collapsed>hidden { display:none !important }
collapsed { background-color:var(--highlight, royalblue); opacity:.5; cursor:pointer; border-radius:.2em; text-align:center; display:inline-block }
collapsed::before { content:'···'; color:var(--background, white) }

.window { z-index:12; position:absolute; background-color:var(--background); overflow:hidden; box-shadow:var(--highlight) 0 0 .1em .1em; transition:all .2s, left 0s, top 0s; padding:.5em; will-change:transform; font-family:monospace, monospace }
context-menu>node>input { border:none }
.window extracted.hover { position:static }

unimportant {opacity:.6}
textarea, div.resizable { transition:all .2s, width 0s, height 0s }
div.resizable { resize:both; overflow:hidden; display:block }
iframe { width:100%; height:100% }

.hasOperators>operator, .hasOperators { margin:0 .2em }
.hasOperators>.hasOperators>operator, .hasOperators>.hasOperators { margin:0 .1em }
.hasOperators>.hasOperators>.hasOperators>operator, .hasOperators>.hasOperators>.hasOperators { margin:0 }

hr { border-top:1px;  margin:0 }
details { padding: .1em; padding-left: 1em; display: table; overflow: hidden }
summary { margin-left: -1em }
details>:not(summary):not(hr) { display:block }
details>div>:not(:first-child) { max-width:75vw }
details>div { display:table-row }
details>div>:first-child { padding-left:2ch }

time-report { display:table; font-size:.8em; color:gray; opacity:0; visibility:hidden }
.hover>div.code>time-report, time-report:hover { opacity:1; visibility:visible }

.removed { margin:0 }

separated-text { margin:1em; display:block }
text>span { font-family:sans-serif }

separated-text>serialization, text>serialization { background-color:rgba(50%, 50%, 50%, 20%); border-radius:.2em }
.nonArray>bracket { font-weight:bold }
`,

    call(into = document.body) {
      Self.into = into
      serialize.displayed = serialize.dom
      const passive = {passive:true}, passiveCapture = {passive:true, capture:true}

      // If not inserting into a particular element, create a new close-able window for us.
      if (into === null) {
        Self.into = into = elem('div')
        const close = elem('button', '❌', 'Close')
        close.title = `Close`
        close.onclick = () => (delete Self.ctx, Deinitialize(), close.onclick = null)
        into.append(close)
        into.style.position = 'absolute'
        into.style.left = scrollX + innerWidth/2 + 'px'
        into.style.top = scrollY + innerHeight/2 + 'px'
        allowDragging(into)
        const doc = document.body
        const parent = doc.attachShadow ? doc.appendChild(document.createElement('div')).attachShadow({mode:'closed'}) : doc
        parent.appendChild(into)
      }
      into.classList.add('into')

      // Initialize some settings.
      observe(_useDarkTheme, st => Self.into.classList.toggle('dark', st[1], true))(_useDarkTheme)
      observe(_disableSmoothTransitions, st => Self.into.classList.toggle('noTransitions', st[1], true))(_disableSmoothTransitions)
      observe(_noBoxStylingForPrograms, st => Self.into.classList.toggle('noComplexity', st[1], true))(_noBoxStylingForPrograms)

      // Insert the style defined by code.
      const StyleElem = document.createElement('style')
      StyleElem.style.display = 'none'
      StyleElem.innerHTML = defines(Browser, style)
      into.append(StyleElem)

      // Create a REPL.
      const lang = fancy, binds = new Map(Self.ctx)
      const env = call.env = _newExecutionEnv(null, null, lang, binds)
      const repl = call.env[_id(log)] = REPL(lang, binds)
      into.appendChild(repl)
      Self.into.querySelector('[contenteditable]').focus()

      // If our URL has `#…` at the end, parse and evaluate that command.
      function evalHash(hash) {
        call.env = _newExecutionEnv()
        if (hash) elemInsert(into, evaluator(parse(decodeURI(location.hash.slice(1)))), into.firstChild)
      }
      evalHash(location.hash)
      _listen('hashchange', () => evalHash(location.hash))

      // Execute the relevant thing in `Commands` when a button is pressed when not editing.
      //   (It's like Vim's normal mode, but without argument chaining, at least for now. A tutorial would suit it well.)
      _listen('keydown', evt => {
        if (_getOuterREPL(evt.target)) return
        let key = evt.key
        if (['Control', 'Meta', 'Shift', 'Alt'].includes(key)) return
        if (evt.ctrlKey) key = 'Ctrl'+key
        if (evt.metaKey) key = 'Meta'+key
        if (evt.altKey) key = 'Alt'+key
        if (Commands.has(key)) {
          const range = getSelection().rangeCount && getSelection().getRangeAt(0)
          const env = _newExecutionEnv()
          _doJob([Commands.get(key), _closestNodeParent(evt.target || evt.explicitOriginalTarget), range, evt], env),
          evt.preventDefault()
        }
      })

      // Select the <node> under cursor on triple-click.
      // Also make <details> open smoothly, and allow them to be closed by clicking.
      _listen('click', evt => {
        let t = evt.target || evt.explicitOriginalTarget
        if (t.parentNode && t.parentNode.tagName === 'SUMMARY')
          t = t.parentNode
        if (t.tagName === 'DETAILS')
          return t.firstChild.click()
        if (t.tagName === 'SUMMARY' && evt.detail !== 3 && !_disableSmoothTransitions[1]) {
          const el = t.parentNode
          const pre = _smoothHeightPre(el)
          el.style.height = pre + 'px'
          const smooth = () => (el.removeEventListener('toggle', smooth), _updateBroken(el), _smoothHeightPost(el, pre))
          el.addEventListener('toggle', smooth)
        }
        if (evt.detail !== 3) return
        const p = _closestNodeParent(t)
        p && getSelection().selectAllChildren(p)
      }, passive)

      // Open a custom <context-menu> when a context menu is requested, or when a pointer is held down in place for 1 second.
      function openMenu(evt, range) {
        if (Commands.has('AuxClick'))
          Commands.get('AuxClick')(_closestNodeParent(evt.target || evt.explicitOriginalTarget), range, evt), evt.preventDefault()
      }
      _listen('contextmenu', evt => {
        const range = getSelection().rangeCount && getSelection().getRangeAt(0)
        openMenu(evt, range)
      })
      let contextMenuId, pointerId = null, startX, startY
      _listen('pointerdown', evt => {
        atCursor.lastEvt = evt
        const range = getSelection().rangeCount && getSelection().getRangeAt(0)
        contextMenuId = setTimeout(openMenu, 1000, evt, range)
        pointerId = evt.pointerId, startX = evt.clientX, startY = evt.clientY
      }, passiveCapture)
      function cancelContextMenu(evt) {
        if (evt.type === 'pointermove') atCursor.lastEvt = evt
        if (contextMenuId == null) return
        const dx = evt.clientX - startX, dy = evt.clientY - startY
        if (evt.type === 'pointercancel' || evt.type === 'pointerup' || evt.pointerId != pointerId || (dx*dx + dy*dy) > 25)
          clearTimeout(contextMenuId), contextMenuId = null
      }
      _listen('pointermove', cancelContextMenu, passiveCapture)
      _listen('pointerup', cancelContextMenu, passiveCapture)
      _listen('pointercancel', cancelContextMenu, passiveCapture)

      // Close not-containing-target <context-menu>s on a click elsewhere.
      const closeMenus = evt => {
        const t = evt.target || evt.explicitOriginalTarget
        if (_isEditable(t) || !atCursor.opened) return
        const bad = atCursor.opened.filter(el => !el.contains(t))
        atCursor.opened = atCursor.opened.filter(el => el.contains(t))
        bad.forEach(elemRemove)
      }
      _listen('pointerdown', closeMenus, passive)
      _listen('focusin', closeMenus, passive)

      // Ensure that we still re-enter the interpreter loop after manually interrupting a script.
      _listen(2000, () => _jobs.running && _jobs())

      // On resize, update the "all-or-nothing" line-break-ingness of <node>s.
      let width = innerWidth
      _listen('resize', _throttled(() => width !== innerWidth ? _updateBroken(into) : (width = innerWidth), .1), passive)

      // If scrolled to near end, make sure that transitions preserve that scroll.
      // On transition end, remove .style.height (for _smoothHeightPost/elemInsert).
      let atEnd = false
      _listen('transitionstart', evt => {
        if (_disableSmoothTransitions[1]) return
        if (evt.propertyName !== 'height' || (evt.target || evt.explicitOriginalTarget).tagName === 'SCROLL-HIGHLIGHT') return
        const el = repl.lastChild.previousSibling, top = el.getBoundingClientRect().top
        if (evt.propertyName !== 'height' || Self.into !== document.body) return
        const d = document.documentElement, max = d.scrollHeight - d.clientHeight
        atEnd && scrollY < max - d.clientHeight - 100 && scrollTo(scrollX, max, atEnd = false)
        atEnd = atEnd || scrollY && top <= innerHeight - 10
      }, passive)
      _listen('transitionend', evt => {
        if (_disableSmoothTransitions[1]) return
        const t = evt.target || evt.explicitOriginalTarget
        if (t.tagName === 'SCROLL-HIGHLIGHT') return
        if (evt.propertyName !== 'height' || Self.into !== document.body) return
        t.style.removeProperty('height')
        _clearStyle(t)
        const d = document.documentElement, max = d.scrollHeight - d.clientHeight
        atEnd && scrollY < max - d.clientHeight - 100 && scrollTo(scrollX, max, atEnd = false)
      }, passive)

      // On .ctrlKey pointerdown on a value, insert a <collapsed> reference to it into selection if editable.
        // This is also accessible via contextMenu.
        // TODO: Put it in `Commands`, under `CtrlClick`.
        //   TODO: Have `_runFunc(f, ...args)` that just calls if a define-less func, else does _doJob with a new env. Use that for AuxClick.
      _listen('pointerdown', evt => {
        if (!evt.ctrlKey || evt.shiftKey || evt.altKey) return
        if (!getSelection().rangeCount) return
        const el = _closestNodeParent(evt.target || evt.explicitOriginalTarget), r = getSelection().getRangeAt(0)
        if (el) insertLinkTo(r, el), evt.preventDefault()
      })

      // Ensure that selection cannot end up inside <collapsed>/<serialization> elements.
      _listen('selectionchange', () => {
        if (!getSelection().rangeCount) return
        const r = getSelection().getRangeAt(0)
        let el = r.commonAncestorContainer
        if (!el) return
        if (el === _isEditable(el) && r.startContainer === r.endContainer) {
          if (r.startOffset === 0 && r.endOffset === el.childNodes.length && el.lastChild) {
            while (el.lastChild) el = el.lastChild
            r.setEndAfter(el)
          }
        }
        if (el.tagName === 'COLLAPSED' || el.tagName === 'SERIALIZATION')
          el.nextSibling ? r.setEndBefore(el.nextSibling) : r.setEndAfter(el)
        el = el.parentNode
        if (!el) return
        if (el.tagName === 'COLLAPSED' || el.tagName === 'SERIALIZATION')
          el.nextSibling ? r.setEndBefore(el.nextSibling) : r.setEndAfter(el)
      }, passiveCapture)

      // Highlight equal-id <node>s over selection or under cursor.
      function changeHoverTo(el) {
        const prev = changeHoverTo.prev
        const def = el && !_isArray(el.to) && defines(el.to, _closestNodeParent)
        const New = el == null ? null : el instanceof Set ? el : el && def ? def(el) : elemValue(undefined, el.to)
        const needed = new Set
        let b = false
        New && New.forEach(el => {
          if (el.tagName === 'SERIALIZATION') return
          if (prev && prev.has(el)) needed.add(el)
          else el.classList.add('hover'), needed.add(el)
          el = el.parentNode
          !b && el && el.tagName === 'EXTRACTED' && (el.classList.add('hover'), needed.add(el), b = true)
        })
        if (prev) prev.forEach(el => !needed.has(el) && (el.classList.remove('hover'), _clearStyle(el)))
        scrollHighlight(New)
        changeHoverTo.prev = needed
      }
      function highlightParent(evt) {
        if (!_hoverHighlightsDOMValues[1]) return
        if (evt.type === 'selectionchange' && getSelection().isCollapsed) return
        changeHoverTo(getParent(evt))
      }
      function getParent(evt) {
        const s = getSelection()
        let el
        if (s.isCollapsed && evt) el = evt.type.slice(-3) !== 'out' ? evt.target || evt.explicitOriginalTarget : evt.relatedTarget
        else el = s
        return _closestNodeParent(el)
      }
      const highlight = _throttled(highlightParent, .1)
      _listen('pointerover', highlight, passiveCapture)
      _listen('pointerout', highlight, passiveCapture)
      _listen('selectionchange', highlight, passiveCapture)

      // Create the toolbar.
      const bottombar = elem('div')
      bottombar.setAttribute('style', "position:sticky; left:0; bottom:0; z-index:10")
      const JobIndicator = _jobs.indicator = elem('JobIndicator')
      JobIndicator.title = "Currently running 0 jobs."
      const toolbarElem = elem('span')
      observe(settingsToolbar, function onChange(toolbar) {
        while (toolbarElem.firstChild)
          toolbarElem.removeChild(toolbarElem.firstChild)
        toolbarElem.append(' ', ...toolbar.map(settings))
        elemValue(toolbarElem, toolbar)
      }, true)(settingsToolbar)
      bottombar.append(JobIndicator, toolbarElem)
      into.append(bottombar)

      // Highlight all current jobs' logging areas when hovering over the job indicator.
      JobIndicator.to = {
        [defines.key]:{
          [_id(_closestNodeParent)]:() => {
            const r = []
            if (_jobs.expr)
              for (let i = 0; i < _jobs.expr.length; i += 3) {
                const env = _jobs.expr[i+1]
                if (env[_id(log)]) r.push(env[_id(log)])
              }
            return r
          }
        }
      }

      // On any element tree mutations inside `into`, re-highlight.
      const mo = new MutationObserver(_throttled(record => {
        changeHoverTo(changeHoverTo.prev)
      }, .05));
      [...into.childNodes].forEach(ch => mo.observe(ch, { childList:true, subtree:true }))

      // Show the current highlight on the global scrollbar.
      const scrollHighlights = new Map
      const scrollHighlight = _throttled(function scrollHighlight(els) {
        const free = _allocArray()
        scrollHighlights.forEach(v => free.push(v)), scrollHighlights.clear()
        let n = 0
        els && els.forEach(el => {
          if (!_isStylableDOM(el) || n++ > 100) return
          const h = free.length ? free.shift() : document.createElement('scroll-highlight')
          scrollHighlights.set(el, h)
        })
        free.forEach(el => elemRemove(el, false, false, false)), _allocArray(free)
        if (scrollHighlights.size) {
          updateScrollHighlights()
          scrollHighlights.forEach(v => {!v.parentNode && (v.style.opacity = 0, into.append(v))})
          _reflow().then(() => scrollHighlights.forEach(v => v.style.opacity !== '' && (v.style.removeProperty('opacity'))))
        } else if (into.querySelector('scroll-highlight'))
          [...into.querySelectorAll('scroll-highlight')].forEach(el => !el.removed && (console.error('Dangling scroll highlight:', el), el.remove()))
      }, .2)
      function updateScrollHighlights() {
        if (!scrollHighlights.size) return
        const min = -document.documentElement.scrollTop, max = document.documentElement.scrollHeight + min
        if (max+1 <= min) return
        scrollHighlights.forEach((v,k) => {
          if (!k.isConnected || getComputedStyle(k).display === 'none')
            return elemRemove(scrollHighlights.get(k)), scrollHighlights.delete(k)
          let rect = k.getBoundingClientRect()
          if (!rect.x && !rect.y && !rect.width && !rect.height) {
            const r = document.createRange()
            r.selectNode(k)
            rect = r.getBoundingClientRect(), r.detach()
          }
          v._top = (rect.top - min) / (max - min), v._height = rect.height / (max - min)
        })
        scrollHighlights.forEach(v => { if (v._top <= 1 && v._height <= 1) v.style.top = v._top*100+'%', v.style.height = v._height*100+'%' })
      }
      _listen('resize', _throttled(updateScrollHighlights, .125), passiveCapture)

      // Garbage-collect DOM elements every 5 mins.
      let domgc = false
      _listen(300000, () => {
        if (domgc) return; else domgc = true
        elemValue.obj = new WeakMap, elemValue.val.clear()
        const oldResources = elemValue.resources;  elemValue.resources = new Set
        _schedule([_revisitElemValue, Self.into], _newExecutionEnv(), () => {
          domgc = false
          oldResources.forEach(r => !elemValue.resources.has(r) && dispose(r))
        })
          // It is possible to observe not-fully-restored states, but that is fine for interface GC.
      })

      // Insert scripts.
      //   TensorFlowJS: though not all of it fits our needs, this is the best numeric-operations library I know of.
      //     Much easier than manually going through WebGL and/or WebGPU (which isn't supported on my machine), at least.
      defines(Browser, js).forEach(src => {
        if (!document.querySelector(`script[src=${CSS.escape(src)}]`)) {
          const s = elem('script')
          s.src = src
          document.head.append(s)
        }
      })
    },
  },

  NodeJS:{
    docs:`Presents a console REPL with outputs labeled sequentially, or just reads and executes the whole file if redirected from it.
Example: \`nodejs self.js basic <input.txt >output.txt\` will write the result of executing everything in \`input.txt\` (parsed with language \`basic\`) to \`output.txt\`.`,
    call() {
      if (process.argv.length > 3) return console.log(`Usage:
nodejs self.js
nodejs self.js basic`)
      const lang = process.argv[2] && Self.ctx.get(label(process.argv[2])) || fancy

      const out = process.stdout
      if (!out.isTTY || !out.hasColors()) _colored.disabled = true
      serialize.displayed = !_colored.disabled ? serialize.consoleColored : {maxDepth:3}

      if (process.stdin.isTTY) // REPL for terminals.
        REPL(lang), _test(call.env = _newExecutionEnv(null, null, lang, Self.ctx))
      else { // Read+execute for files.
        interrupt.noInterrupt = true
        require('fs').readFile(process.stdin.fd, 'utf-8', (err, data) => {
          if (err) throw err
          const env = _newExecutionEnv(null, null, lang, Self.ctx)
          _schedule(parse(data, lang), env, log)
        })
      }
    },
  },

  WebWorker:{
    docs:`Used for \`purifyInWorker\`.
For \`file://\` URIs in Firefox, \`privacy.file_unique_origin\` in \`about:config\` needs to be false.`,
    call() {
      WebWorker.envs = Object.create(null)
      onmessage = evt => {
        const msg = evt.data
        if (_isArray(msg) && typeof msg[0] == 'number' && typeof msg[1] == 'string' && msg.length == 2) {
          // Schedule parsing-and-serialization.
          const [ID, str] = msg
          let env = _newExecutionEnv()
          WebWorker.envs[ID] = env
          _doJob(lookup(fast, 'parse')(str), _newExecutionEnv(), result => {
            // When done, postMessage the serialized result back.
            postMessage([ID, lookup(fast, 'serialize')(result)])
            delete WebWorker.envs[ID]
          }, ID)
        } else if (typeof msg == 'number') {
          _cancel(WebWorker.envs[msg])
          delete WebWorker.envs[msg]
        }
        else throw "Bad message"
      }
    },
  },

  settingsToolbar:[
    __is(`_useDarkTheme`),
    __is(`_maxUsageOfCPU`),
  ],

  _hoverHighlightsDOMValues:[
    __is(`settings`),
    true,
    `Whether to highlight the same values associated with DOM nodes on hover.
The \`_closestNodeParent\` is shown by this.`,
  ],

  purifyInWorker:{
    docs:`\`(purifyInWorker Expr)\`: calls \`purify\` on (a copy of) \`Expr\` in parallel; returns a promise.`,
    examples:[
      [
        `purifyInWorker ^[1*2+3*4]`,
      ]
    ],
    await:true,
    call(expr) {
      if (!purifyInWorker.workers) {
        const ws = []
        for (let i = navigator.hardwareConcurrency-1; i; --i)
          ws[i-1] = {
            worker:new Worker('self.js'), // Assuming our script's name here.
            tasks:{},
          },
          ws[i-1].worker.onmessage = ({data:[ID, str]}) => ws[i-1].tasks[ID][1](lookup(fast, 'parse')(str)),
          ws[i-1].worker.onerror = () => {
            ws.forEach(w => Object.keys(w.tasks).forEach(ID => {
              let env = _newExecutionEnv()
              env[_id(_schedule)] = +ID
              _doJob([purify, [quote, w.tasks[ID][0]]], env, w.tasks[ID][1])
            }))
            ws.length = 0
          }
        purifyInWorker.workers = ws
      }

      return new Promise(then => {
        const ID = _newJobId()
        if (!purifyInWorker.workers.length) {
          let env = _newExecutionEnv()
          env[_id(_schedule)] = ID
          return _doJob([purify, [quote, expr]], env, then)
        }
        const str = lookup(fast, 'serialize')([purify, [quote, expr]])
        const w = purifyInWorker.workers[Math.floor(Math.random() * purifyInWorker.workers.length)]
        w.worker.postMessage([ID, str])
        w.tasks[ID] = [expr, then]
      })
    },
  },

  _colored(str, pre=39, post = 39) {
    // Style a string for ANSI terminals. See `man 4 console_codes`.
    if (_colored.disabled) return str
    return typeof str != 'string' ? str : ('\x1b['+pre+'m') + str + ('\x1b['+post+'m')
  },

  _collapsedSerialization(v, lang = basic) {
    const el = serialize(v, lang, undefined, {...serialize.displayed, collapseDepth:2, collapseBreadth:0, deconstructElems:true, dontBindTopLevel:true})
    let e = el.tagName === 'SERIALIZATION' ? el.firstChild : el
    if (_isArray(v) || _isArray(defines(v, deconstruct)))
      if (e.firstChild.tagName != 'BRACKET' || e.lastChild.tagName != 'BRACKET') {
        const parent = e.parentNode
        parent.removeChild(e)
        parent.append(elemValue(elem('node', [elem('bracket', '('), e, elem('bracket', ')')]), v))
      }
    return el
  },

  _getOuterLinker(el) { return el && (el.contentEditable === 'true' || el.parentNode && !_isArray(el.parentNode.to) && defines(el.parentNode.to, insertLinkTo) ? el : _getOuterLinker(el.parentNode)) },

  insertLinkTo:{
    docs:`Replaces a Range (obtained from the current selection) with a link to the elem's value.
A language can define this with a function that {takes the element and value to {link to}} and {returns an element to insert}.
Remember to quote the link unless you want to evaluate the insides.`,
    call(r, el) {
      const p = r.commonAncestorContainer, ed = _getOuterLinker(el)
      const pre = _smoothTransformPre(el)
      if (!_getOuterLinker(p)) return false
      const edInfo = ed && ed.parentNode.to
      let col
      if (ed && ed === _getOuterLinker(p) && _isArray(edInfo) && edInfo[0] === editor && defines(edInfo[2], insertLinkTo))
        col = defines(edInfo[2], insertLinkTo)(r, el)
      else {
        console.log('no linker found at', r, el) // ######################## TODO: test that this at least kinda works.
        const v = quote(el.to)
        col = elemValue(elemCollapse(() => _collapsedSerialization(v)), v)
        col.special = true
        r.deleteContents()
        r.insertNode(col)
        r.setEndAfter(col)
      }
      p.dispatchEvent(new Event('input', {bubbles:true}))
      _smoothTransformPost(col, pre, 100)
    },
  },

  _closestNodeParent(el) {
    if (el instanceof Selection) el = el.rangeCount ? el.getRangeAt(0).commonAncestorContainer : null
    while (el && !('to' in el || el.tagName === 'SERIALIZATION'))
      el = el.parentNode
    return el
  },

  _bracketize(range, brackets = '()') {
    // Appends brackets at range's start and end.
    if (range.commonAncestorContainer.classList && range.commonAncestorContainer.classList.contains('editable')) return
    range.insertNode(elem('span', brackets[0]))
    range.collapse(false)
    range.insertNode(elem('span', brackets[1]))
    range.setEnd(range.endContainer, range.endOffset-1)
  },

  hierarchy:{
    docs:`Turns a map from globals into a namespace-based hierarchy.`,
    call(m, topLevel, parents = lookup.parents, lang = basic, binds) {
      if (typeof document == ''+void 0) return m
      if (!(m instanceof Map)) error("Expected a map, got", m)
      const globals = new Map // From globals to their elems.
      m.forEach((v,x) => globals.set(x, null))
      let p // Add unmentioned namespace-parent globals too.
      globals.forEach((our, x) => (p = parents.get(x)) && !globals.has(p) && globals.set(p, null))
      const result = !topLevel ? elem('details', elem('summary', 'Binds to:')) : elemFor(topLevel)
      Self.ctx.forEach(x => { // Make globals appear in source-code order.
        if (topLevel && x === topLevel || !globals.has(x)) return
        let our = globals.get(x)
        if (!our) globals.set(x, our = elemFor(x))
        const p = parents.get(x)
        if (!p) return result.append(our)
        let their = globals.get(p)
        if (!their) globals.set(p, their = elemFor(p))
        their.append(our)
      })
      m.forEach((_,x) => { // Add anything we missed from going through globals to the top-level.
        if (topLevel && x === topLevel || globals.has(x)) return
        let our = globals.get(x)
        if (!our) globals.set(x, our = elemFor(x))
        result.append(our)
      })
      for (let ch = result.firstChild.nextSibling; ch; ch = ch.nextSibling) {
        ch.replaceWith(ch = purgeChildless(ch))
        ch = result.insertBefore(elem('hr'), ch.nextSibling)
      }
      if (result.childNodes.length == 1) result.append(elem('div', 'nothing'))
      result.open = true
      return result

      function elemFor(x) {
        const el = elem('details')
        const xEl = _isDOM(x) ? x : serialize(x, lang, binds, serialize.displayed)
        const v = m.get(x)
        el.append(elem('summary', v === undefined ? xEl : [xEl, ':  ', _isDOM(v) ? v : serialize(v, lang, binds, serialize.displayed)]))
        elemValue(el, x)
        return _isArray(x) || defines(x, permissionsElem) === undefined || topLevel ? el : defines(x, permissionsElem)(el)
      }
      function purgeChildless(el) {
        if (el.tagName != 'DETAILS') return el
        if (el.childNodes.length == 1) {
          const chs = [...el.firstChild.childNodes]
          while (el.firstChild.firstChild) el.firstChild.removeChild(el.firstChild.firstChild)
          const ch = elem('div', chs)
          elemValue(ch, el.to)
          return el.replaceWith(ch), ch
        }
        for (let ch = el.firstChild.nextSibling; ch; ch = ch.nextSibling) {
          ch = purgeChildless(ch)
          ch = el.insertBefore(elem('hr'), ch.nextSibling)
        }
        return el
      }
    },
  },

  permissionsElem:{
    docs:`Build a namespace hierarchy of globals that \`expr\` is bound to.`,
    call(expr, topLevel) {
      const uses = new Set, seen = new Set
      mark(expr), seen.clear()
      uses.forEach(x => lookup.parents.has(x) && uses.add(lookup.parents.get(x)))
      if (topLevel) uses.delete(topLevel)
      const m = new Map
      uses.forEach(x => m.set(x, undefined))
      return hierarchy(m, topLevel)

      function mark(x) {
        if (seen.has(x)) return; else seen.add(x)
        if (_invertBindingContext(Self.ctx).has(x) && typeof x != 'boolean' && typeof x != 'string' && x != null) return uses.add(x)
        if (!_isArray(x) && defines(x, deconstruct)) return mark(deconstruct(x))
        else if (x instanceof Map) x.forEach((v,k) => (mark(k), mark(v)))
        else if (_isArray(x)) x.forEach(mark)
        else if (x && !x[defines.key] && typeof x == 'object')
          Object.keys(x).forEach(k => mark(x[k]))
        else if (x && x[defines.key]) mark(x[defines.key])
      }
    },
  },

  stringToDoc:{
    docs:`Parse text in \`...\` to style it as fancy, and treat other strings as \`structuredSentence\`s. Return an array of children.`,
    call(s) {
      if (typeof s != 'string') return s
      let arr = s.split('`')
      for (let i = 0; i < arr.length; ++i)
        if (i & 1)
          try { arr[i] = elem('serialization', parse(arr[i], fancy, undefined, parse.dom)[1]) } catch (err) {}
        else
          arr[i] = arr[i].split('\n').map(structuredSentence), typeof document != ''+void 0 && arr[i].forEach(el => el.classList.add('text')), interleave(arr[i], '\n')
      return arr
      function interleave(arr, separator) {
        arr.length = arr.length*2 - 1
        for (let i=arr.length-1; i>0; --i)
          arr[i] = !(i&1) ? arr[i>>>1] : separator
      }
    },
  },

  elemToWindow:{
    docs:`Wraps an element in \`<div.window>\`.`,
    call(el) {
      const pre = _smoothHeightPre(el)
      el.style.position = 'relative' // So that .offsetLeft/Top refer to the same thing as position:absolute.
      const x = el.offsetLeft, y = el.offsetTop
      el.style.removeProperty('position'), _clearStyle(el)
      const menu = elem('div')
      menu.classList.add('window')
      if (el.to) elemValue(menu, el.to), menu.special = true
      const col = elemCollapse(() => {
        const pre = _smoothTransformPre(menu)
        menu.replaceWith(el)
        _smoothTransformPost(el, pre)
        return el
      })
      elemValue(col, el.to)
      el.before(col)
      menu.isWindow = col
      el.replaceWith(menu)
      menu.style.left = x + 'px', menu.style.top = y + 'px'
      allowDragging(menu)
      menu.append(el)
      _smoothHeightPost(col, pre)
      return menu
    },
  },

  elemExpandAll:{
    docs:`Clicks all <collapsed> elements in the element.`,
    call(el, readonly = false) {
      if (!el) return
      if (el.tagName === 'COLLAPSED' && el.onclick && readonly) return true
      if (!(el instanceof Element)) return
      let chs
      if (el.tagName === 'COLLAPSED' && el.onclick) chs = [...el.firstChild.childNodes], el.onclick({target:el}, true)
      else chs = [...el.childNodes]
      for (let i = 0; i < chs.length; ++i) if (elemExpandAll(chs[i], readonly)) return true
    },
  },

  _restoreWindow(w) {
    if (!w) return
    const inside = w.firstChild, preT = _smoothTransformPre(inside), preH = _smoothHeightPre(w.isWindow)
    w.isWindow.remove()
    w.replaceWith(inside)
    _smoothTransformPost(inside, preT), _smoothHeightPost(inside, preH)
  },

  _getOuterWindow(el) { return !el ? null : el.isWindow ? el : _getOuterWindow(el.parentNode) },

  disableBindingsElem:{
    docs:`\`(disableBindingsElem)\`: creates an elem for disabling current bindings hierarchically.`,
    call() {
      const binds = _bindingsAt()
      const m = new Map
      binds.forEach(addCheckbox)
      return elemValue(hierarchy(m, elem('span', 'Bindings:')), binds)

      function addCheckbox(v, L) {
        const el = elem('input')
        el.type = 'checkbox'
        el.checked = true
        el.onchange = function() {
          this.checked ? binds.set(L, v) : binds.delete(L);
          if (this.parentNode.tagName === 'SUMMARY') {
            [...this.parentNode.parentNode.querySelectorAll('input[type=checkbox]')].forEach(
              el => el !== this && (el.checked = this.checked, el.onchange())
            )
          }
        }
        m.set(v, el)
      }
    },
  },

  elemCollapse:{
    docs:`Collapses an element (or a range of elements) in-place. Click to expand again. Pass in a function to create the element only if needed. Pass in null as \`end\` to collapse all consequent non-bracket siblings.`,
    call(start, end = undefined) {
      const col = elem('collapsed')
      if (typeof start == 'function')
        col.append(elem('hidden')),
        col.onclick = evt => {
          const col = evt.target || evt.explicitOriginalTarget, p = col.parentNode, pre = _smoothHeightPre(p)
          const el = start()
          if (p) _isArray(el) ? el.forEach(el => p.insertBefore(el, col)) : el.parentNode !== p && p.insertBefore(el, col), p.removeChild(col)
          if (_getOuterWindow(p) || _getOuterContextMenu(p)) _updateBroken(_getOuterWindow(p) || _getOuterContextMenu(p)); else if (p) _updateBroken(p)
          p.dispatchEvent(new Event('input', {bubbles:true}))
          _smoothHeightPost(p, pre)
        },
        col.special = (original, copy) => copy.onclick = original.onclick
      else {
        const parent = start.parentNode, pre = parent && _smoothHeightPre(parent)
        let nextCol = end !== undefined ? end : start.nextSibling
        const d = elem('hidden')
        if (end === undefined)
          d.append(start), 'to' in start && elemValue(col, start.to)
        else {
          const a = []
          for (let el = start, next = start.nextSibling; end !== undefined && el && el !== end; [el, next] = [next, next && next.nextSibling]) {
            d.append(el)
            'to' in el && a.push(el.to)
            if (next && next.tagName === 'BRACKET' && !next.nextSibling) end = next, nextCol = next
          }
          elemValue(col, rest(a))
        }
        col.append(d)
        col.onclick = (evt, instant = false) => {
          const col = evt.target || evt.explicitOriginalTarget, d = col.firstChild, p = col.parentNode, pre = !instant && _smoothHeightPre(p)
          if (d.firstChild === d.lastChild)
            col.replaceWith(d.firstChild)
          else {
            while (d.firstChild) p.insertBefore(d.firstChild, nextCol)
            p.removeChild(col)
          }
          if (!instant) {
            if (_getOuterWindow(p) || _getOuterContextMenu(p)) _updateBroken(_getOuterWindow(p) || _getOuterContextMenu(p)); else if (p) _updateBroken(p)
            _smoothHeightPost(p, pre)
          }
        }
        col.special = (original, copy) => copy.onclick = original.onclick
        if (parent) parent.insertBefore(col, nextCol), _smoothHeightPost(parent, pre)
      }
      return col
    },
  },

  log:{
    docs:`\`(log …Values)\`: For debugging; logs to the current DOM node or console.`,
    lookup:{
      structured:__is(`structured`),
      structuredSentence:__is(`structuredSentence`),
    },
    call(...x) {
      const prevPure = call.pure
      log.did = true, call.pure = false
      try {
        let str
        if (x.length != 1 || !_isStylableDOM(x[0]))
          str = serialize(x.length > 1 ? x : x[0], _langAt(), _bindingsAt(), serialize.displayed)
        else str = x[0]
        const into = call.env[_id(log)]
        if (into) {
          if (str.parentNode) str = elemClone(str)
          if (typeof str == 'string') str = document.createTextNode(str)
          const wasMax = _updateMaxScrollBegin()
          into.parentNode.insertBefore(str, into)
          _updateBroken(into.parentNode)
          _updateMaxScrollEnd(wasMax)
        } else
          console.log(str)
        if (x.length == 1) return x[0]
      } catch (err) { if (err !== impure) console.log(err, err && err.stack), console.log('When trying to log', ...x) }
      finally { call.pure = prevPure }
      // log.did (for not erasing parts of a log in a terminal in NodeJS)
    },
  },

  _updateMaxScrollBegin() { return _disableSmoothTransitions[1] && scrollY >= document.documentElement.scrollHeight - innerHeight - 5 },

  _updateMaxScrollEnd(begin) { if (begin) scrollBy(0, 1000) },

  allowDragging:{
    docs:`Allows dragging the element around with a pointer. Only call on absolutely-positioned elements with .style.left and .style.top.`,
    call(el) {
      let pointerId = null, startX, startY, scrX, scrY
      const passive = {passive:true}
      el.addEventListener('pointerdown', evt => {
        const t = evt.target || evt.explicitOriginalTarget
        if (_isEditable(t) || t.tagName === 'KNOWN' || t.tagName === 'TEXTAREA' || t.tagName === 'BUTTON' || t.tagName === 'INPUT' || t.tagName === 'DETAILS' || t.tagName === 'SUMMARY' || t.tagName === 'COLLAPSED' || t.classList && t.classList.contains('resizable')) return
        if (_closestNodeParent(t) && _closestNodeParent(t) !== el) return
        pointerId = evt.pointerId, startX = evt.clientX, startY = evt.clientY, el.setPointerCapture(pointerId)
        scrX = scrollX, scrY = scrollY
        getSelection().rangeCount && getSelection().collapseToEnd()
        evt.stopPropagation(), _getOuterContextMenu(document.activeElement) === _getOuterContextMenu(el) && evt.preventDefault()
        addEventListener('scroll', move, passive)
      })
      function move(evt) {
        if (!el.isConnected) return removeEventListener('scroll', move, passive)
        if (pointerId == null || evt.pointerId !== pointerId && evt.pointerId !== undefined) return
        const x = parseFloat(el.style.left), y = parseFloat(el.style.top)
        let dx = evt.clientX != null ? evt.clientX - startX : 0, dy = evt.clientY != null ? evt.clientY - startY : 0
        dx += scrollX - scrX, dy += scrollY - scrY
        scrX = scrollX, scrY = scrollY
        if (dx) el.style.left = x + dx + 'px'
        if (dy) el.style.top = y + dy + 'px'
        if (dx) el.style.maxWidth = innerWidth - (x + dx) - 16 + 'px'
        if (evt.clientX || evt.clientY) startX = evt.clientX, startY = evt.clientY
      }
      el.addEventListener('pointermove', move, passive)
      el.addEventListener('pointerup', () => (pointerId = null, removeEventListener('scroll', move, passive)), passive)
      el.addEventListener('pointercancel', () => (pointerId = null, removeEventListener('scroll', move, passive)), passive)
    },
  },

  _isEditable(el) { return el && (el.contentEditable === 'true' ? el : _isEditable(el.parentNode)) },

  _getOuterContextMenu(el) { return !el ? Self.into : (el.tagName === 'CONTEXT-MENU' ? el : _getOuterContextMenu(el.parentNode)) },

  _escapeLabel(name, lang = _langAt(call.env) || fancy) {
    return typeof defines(lang, _escapeLabel) == 'function' ? defines(lang, _escapeLabel)(name) : name
  },

  _unescapeLabel(repr, lang = _langAt(call.env) || fancy) {
    return typeof defines(lang, _unescapeLabel) == 'function' ? defines(lang, _unescapeLabel)(repr) : repr
  },

  describe:{
    docs:`Creates an element that describes a value.`,
    _logAll:[
      {
        docs:`Allow renaming labels.`,
        call([el, v]) {
          if (el && el.classList.contains('label')) {
            // Allow renaming labels.
            const inp = elem('input')
            inp.type = 'text'
            let prev = _unescapeLabel(el.textContent, el), updating = false
            inp.value = prev
            const updateGlobal = _throttled(() => (_updateBroken(Self.into), updating = false), .05)
            const editor = _isEditable(el)
            inp.oninput = _throttled(() => {
              if (inp.value && +inp.value === +inp.value) return
              let arr = elemValue(undefined, el.to)
              if (!arr && editor) // Restore ourselves when we've lost it because it's cyclic.
                arr = [...editor.querySelectorAll('.label')].filter(x => _unescapeLabel(x.textContent, x) === prev)
              if (_isArray(arr))
                for (let i = 0; i < arr.length; ++i)
                  if (arr[i].classList.contains('label') && _unescapeLabel(arr[i].textContent, arr[i]) === prev)
                    arr[i].textContent = _escapeLabel(inp.value, arr[i])
              prev = inp.value
              if (!updating) setTimeout(updateGlobal, 0), updating = true
            }, .2)
            return inp
          }
        },
      },
  
      {
        docs:`For globals, display the owner namespace (if any) (even if the property name does not match) and the global binding.
For numbers, display a slider from 0 to 2*number for easy adjusting.
For strings, display them in a <textarea> for easy editing and copying.
For anything else, display the globals the expression binds to, and an expandable basic definition.`,
        call([el, v]) {
          // For globals, a short definition of what we were called on.
          if (_invertBindingContext(Self.ctx).has(v)) {
            // For globals, display the owner namespace (if any) (even if the property name does not match) and the global.
            const global = serialize(v, fancy, undefined, serialize.displayed), p = lookup.parents.get(v) || Self
            return p ? elem('div', [elem('unimportant', [serialize(p, fancy, undefined, serialize.displayed), '.']), global]) : global
          } else if (typeof v == 'number' && isFinite(v) && el && v === +el.textContent && _isEditable(el)) {
            // Display a slider from 0 to 2*number for easy adjusting.
            const range = elem('input', ''+v)
            range.type = 'range'
            range.min = v > 0 ? 0 : 2*v
            range.max = v > 0 ? 2*v : 0
            range.step = .01
            range.value = v
            let i = elemValue(undefined, el.to).indexOf(el)
            range.oninput = () => {
              if (el && !el.isConnected) el = elemValue(undefined, el.to).filter(_isEditable)[i]
              if (!el) return
              el.replaceWith(el = elemValue(elem('number', ''+range.value), el.to = +range.value))
              i = elemValue(undefined, el.to).filter(_isEditable).indexOf(el)
            }
            return range
          } else if (typeof v == 'string') {
            // Display strings in a <textarea> for easy editing and copying.
            const area = elem('textarea', v)
            if (!_isEditable(el))
              area.readOnly = true
            else if (el) {
              let i = elemValue(undefined, el.to).filter(_isEditable).indexOf(el)
              area.oninput = _throttled(() => {
                if (el && !el.isConnected) el = elemValue(undefined, el.to).filter(_isEditable)[i]
                if (!el) return
                el.replaceWith(el = serialize(area.value, fancy, undefined, serialize.displayed))
                elemValue(area, el.to = area.value)
                i = elemValue(undefined, el.to).filter(_isEditable).indexOf(el)
              }, .1)
            }
            return elemValue(area, v)
          } else return permissionsElem(v) // Display the globals the deconstruction binds to.
        },
      },
      {
        docs:`Docstring.`,
        call([el, v]) {
          if (!_isArray(v) && typeof defines(v, docs) == 'string')
            return elem('text', stringToDoc(defines(v, docs)))
        },
      },
      {
        docs:`Examples.`,
        call([el, v]) {
          if (!_isArray(v) && _isArray(defines(v, examples)))
            return elem('div', [
              elemValue(elem('unimportant', 'Examples: '), examples),
              elemCollapse(() => serialize(examples(v), fancy, undefined, serialize.displayed))
            ])
        },
      },


      {
        docs:`A table for \`lookup\`s.`,
        call([el, v]) {
          const backctx = _invertBindingContext(Self.ctx)
          if (!_isArray(v) && defines(v, lookup)) {
            const row = ([k,v]) => {
              if (typeof k != 'string') return
              let ve
              if (!backctx.has(v))
                ve = elemValue(elemCollapse(() => serialize(v, fancy, undefined, serialize.displayed)), v)
              else
                ve = serialize(v, fancy, undefined, serialize.displayed)
              return elem('tr', [elem('td', elem('span', k)), elem('td', ve)])
            }
            // For `Self`, only display public functionality without lookup.parents (displaying all bindings is too much).
            let a
            if (v !== Self) a = lookup(v).map(k => [k, lookup(v, k)])
            else a = [...backctx].filter(([v,k]) => v && v !== true && k[0] !== '_' && !lookup.parents.has(v)).map(([v,k])=>[k,v])
  
            return elem('div', [
              elemValue(elem('unimportant', 'Namespace for:'), lookup),
              elem('table', a.length <= 16 ? a.map(row) : [a.slice(0,16).map(row), elemCollapse(() => a.slice(16).map(row))]),
            ])
          }
        },
      },
      {
        docs:`For globals, the list of back-refs.`,
        call([el, v]) {
          const backctx = _invertBindingContext(Self.ctx)
          if (backctx.has(v)) {
            const Refd = refd(v)
            if (Refd && Refd.length)
              return elem('div', [
                elemValue(elem('unimportant', [
                  'Used in ',
                  elemValue(elem('number', ''+Refd.length), Refd.length),
                  Refd.length != 1 ? ' other globals: ' : ' other global: ',
                ]), refd),
                elemCollapse(() => serialize(Refd, fancy, undefined, serialize.displayed))
              ])
          }
        },
      },
      {
        docs:`The full deconstruction if a non-array.`,
        call([el, v]) {
          const backctx = _invertBindingContext(Self.ctx)
          if (backctx.has(v) || v && (typeof v == 'object' || typeof v == 'function'))
            return elem('div', [
              elemValue(elem('unimportant', 'Basically: '), basic),
              elemValue(elemCollapse(() => _collapsedSerialization(v)), v),
            ])
        },
      },
    ],
    call(el) {
      if (typeof document == ''+void 0) return
      let v
      if (!(el instanceof Node)) v = el, el = undefined
      else v = el.to

      // Append a daintyEvaluator, executing `(_logAll describe ^(el v))`.
      return daintyEvaluator([_logAll, describe, [quote, [el, v]]])
    },
  },

  contextMenu:{
    docs:`Creates and displays a \`<context-menu>\` element near the specified element.`,
    future:`Remove most buttons, and add tutorials on how to add them. Hide complexity if the user doesn't care about it.`,
    philosophy:`Do not expect important information to get up in your face to yell about itself. Drill down to what you need or want. (In fact, those that want to improve will naturally be inclined to prioritize their shortcomings, so using the first impression can be counter-productive.)`,
    lookup:{
      describe:__is(`describe`),
      toWindow:__is(`elemToWindow`),
      allowDragging:__is(`allowDragging`),
      permissions:__is(`permissionsElem`),
      stringToDoc:__is(`stringToDoc`),
      expandAll:__is(`elemExpandAll`),
      insertLinkTo:__is(`insertLinkTo`),
      atCursor:__is(`atCursor`),
      addSearchElem:__is(`addSearchElem`),
      editObject:__is(`editObject`),
    },
    _logAll:[
      {
        docs:`Propose to execute functions that define \`button\`.`,
        call([el, range, v]) {
          if (typeof v == 'function' && defines(v, button) !== undefined) {
            const names = nameResult(v)
            return button(v, names && names[0])
          }
        },
      },
      {
        docs:`Describe context menu's items.`,
        call([el, range, v]) { return describe(el) },
      },
      {
        docs:`Fetch URLs and try to display their contents.`,
        call([el, range, v]) {
          if (_isArray(v) && v[0] === elem && v[1] === url && typeof v[2] == 'string' && v.length == 3) {
            const result = elem('div')
            result.classList.add('resizable')
  
            fetch(v[2], {mode:'cors'})
            .catch(r => elemInsert(result, serialize(_errorRepr(r), fancy, undefined, serialize.displayed)))
            .then(r => r.arrayBuffer())
            .then(r => new TextDecoder().decode(new Uint8Array(r)))
            .then(r => {
              try {
                elemInsert(result, serialize(JSON.parse(r), fancy, undefined, serialize.displayed))
              } catch (err) { elemInsert(result, lookup(fast, 'parse')(r)) }
            })
            .catch(() => {
              const frame = elem('iframe')
              frame.src = v[2]
              elemInsert(result, frame)
            })
            return result
          }
        },
      },
      {
        docs:`Allow searching for substrings.
If we can expand all in the context element, then present that option.
Present an option to hide the element.
Present an option to hide the element and all elements after it on the same hierarchy level.
Present "To window" (for non-windows) or "Restore" (for windows — draggable absolutely-positioned elements).
If the cursor is in editor, present an option to replace the currently-selected contents with a link to the value.
Allow editing run-time and rewrite-time values.`,
        call([el, range, v]) {
          const elems = [
            elemExpandAll(el, true) ? button(() => elemExpandAll(el), '🔮', 'Expand all collapsed element trees here.') : undefined,
            _getOuterWindow(el) !== el ? button(() => elemCollapse(el), '…', 'Collapse element tree.') : undefined,
            el.nextSibling && el.nextSibling.tagName !== 'BRACKET' ? button(() => elemCollapse(el, null), '…$', 'Collapse to end.') : undefined,
          ].filter(x => x)
          if (!_isEditable(el) && el !== document.documentElement) {
            if (!_getOuterWindow(el))
              elems.push( button(() => elemToWindow(el), ' ', 'Extract this element into a draggable window.') )
            else
              elems.push( button(() => _restoreWindow(_getOuterWindow(el)), '×', 'Put the extracted element back into its previous position.') )
          }
          if (range && v !== undefined && _isEditable(range.commonAncestorContainer))
            elems.push( button(() => insertLinkTo(range, el), '🔗', 'Insert a collapsed link to this at cursor.') )

          if (v !== undefined) {
            // Allow editing & rewriting.
            const area = elem('span')
            const area51 = elem('div')
            if (editObject(v, null))
              area.append( button(() => {
                _removeChildren(area51)
                elemInsert(area51, editObject(v))
              }, '📝', 'Edit the run-time object.') )
            if (editRewrite(v, null))
              area.append( button(() => {
                _removeChildren(area51)
                elemInsert(area51, editRewrite(v))
              }, '📂', 'Rewrite the global object. Changes will apply to the next rewrite, `(Rewrite)`.') )
            ;[...area.childNodes].forEach(ch => ch.doNotCloseTheContextMenuOnClick = true)
            area.append(area51)
            area.lastChild.title = 'Try out the next rewrite'
            elems.push(area)
          }

          return elem('div', elems)
        },
      },
    ],
    call(el, range, evt) {
      if (!el && (evt.target || evt.explicitOriginalTarget) === document.documentElement)
        el = evt.target || evt.explicitOriginalTarget
      if (!el) return
      const v = el.to
      const menu = elem('context-menu')
      menu.classList.add('window')
      allowDragging(menu)

      // Close (when unfocused or) on a click on a <button> inside.
      menu.addEventListener('click', evt => {
        const t = evt.target || evt.explicitOriginalTarget
        if (!t.doNotCloseTheContextMenuOnClick)
          t.tagName === 'BUTTON' && _getOuterContextMenu(t) === menu && elemRemove(menu)
      })
      menu.tabIndex = 0

      // Append a daintyEvaluator, executing `(_logAll contextMenu ^(el range v))`.
      menu.append(daintyEvaluator([_logAll, contextMenu, [quote, [el, range, v]]]))

      let inside = _getOuterContextMenu(el)
      if (_getOuterContextMenu(inside.parentNode) !== Self.into) inside = Self.into // Only one nesting layer.
      atCursor(menu, evt, inside)

      menu.focus({preventScroll:true})
    },
  },

  daintyEvaluator:{
    docs:`\`(daintyEvaluator Expr)\`: returns an element that will evaluate the expression and display its \`log\`s if any.`,
    call(expr) {
      if (typeof document == ''+void 0) return

      // Evaluate the requested expression.
      const env = _newExecutionEnv(call.env)
      const result = _evaluationElem(env)
      const el = elem('div', result)
      if (impureHave()) return impureLoad()
      el.classList.add('code')
      env[_id(log)] = el.lastChild
      let ended = false
      const prev = call.env
      _doJob(expr, env, () => (!result.previousSibling ? (ended = true, el.remove()) : result.remove()))
      call.env = prev
      return impureSave(!ended ? el : undefined)
    },
  },

  atCursor:{
    docs:`Positions an element at cursor (as pointed out by an event).`,
    call(el, pointerEvt = atCursor.lastEvt, inside = Self.into) {
      let x = pointerEvt ? pointerEvt.clientX : 0, y = pointerEvt ? pointerEvt.clientY : 0
      if (el.parentNode) error('Only position new elements at cursor')
      if (!inside.isConnected) error('Only position elements inside the visible document')
      const r = (inside !== document.body ? inside : document.documentElement).getBoundingClientRect()

      if (!atCursor.opened) atCursor.opened = []

      // Position at an appropriate corner of itself.
      el.style.position = 'absolute'
      const xOk = x < innerWidth * .8, yOk = y < innerHeight * .8
      x -= r.left, y -= r.top
      el.style.left = x + 'px'
      el.style.top = y + 'px'
      if (xOk && yOk) { // Open to bottom-right
        el.style.borderRadius = '0 1em 1em 1em'
      } else if (xOk) { // Open to top-right
        el.style.transform = 'translate(0, -100%)'
        el.style.borderRadius = '1em 1em 1em 0'
      } else if (yOk) { // Open to bottom-left
        el.style.transform = 'translate(-100%, 0)'
        el.style.borderRadius = '1em 0 1em 1em'
      } else { // Open to top-left
        el.style.transform = 'translate(-100%, -100%)'
        el.style.borderRadius = '1em 1em 0 1em'
      }
      el.style.maxWidth = innerWidth - parseFloat(el.style.left) - 16 + 'px'
      inside.append(el)

      // Remove on clicking/focusing elsewhere.
      atCursor.opened.push(el)

      // .lastEvt, .opened
    },
  },

  _evaluationElem:{
    docs:`Creates and returns a pause-button and a waiting indicator.`,
    call(env) {
      const el = elem('div')
      const pause = elem('button', '⏸')
      pause.onclick = () => _pausedToStepper(..._cancel(env, true))
      pause.title = `Pause execution`
      el.append(pause)
      el.append(elem('waiting'))
      return el
    },
  },

  evaluator:{
    docs:`\`(evaluator Expr)\`: When logged to DOM, this displays the expression, its \`log\`s along the way, and its one evaluation result in one removable (by clicking on the prompt) DOM element.
When evaluating \`a=b\`, binds \`a\` to \`^b\` in consequent parses/serializations in the parent REPL; when evaluating anything else, tries to add the result to the \`CurrentUsage\` binding. Both are reverted when the evaluator is removed.`,
    _logAll:[
      {
        docs:`Display evaluation's result.`,
        call([result]) { return result !== undefined ? result : _onlyUndefined },
      },
      {
        docs:`Display the report on times taken.`,
        call([result, user, real, end]) {
          if (user != null) return elem('time-report', [
            elemValue(elem('span', 'user'), userTime),
            elem('space', ' '),
            _formatNumber(user),
            ', ',
            elemValue(elem('span', 'real'), realTime),
            elem('space', ' '),
            _formatNumber(real),
            ', ',
            elemValue(elem('span', 'report'), serialize),
            elem('space', ' '),
            _formatNumber(_timeSince(end)),
          ])
        },
      },
    ],
    Initialize() {
      evaluator.none = Symbol('none')
      evaluator.history = Symbol('history')
    },
    call(expr, then) {
      if (impureHave()) return impureLoad()

      if (typeof document == ''+void 0) return
      const before = call.env[_id(log)]

      const lang = _langAt(), binds = _bindingsAt()
      if (binds !== Self.ctx && !binds.has(evaluator.history))
        binds.set(evaluator.history, _allocMap())
      let bindAs = null, prevBinding = evaluator.none

      const el = elem('div')

      el.classList.add('code')
      const prompt = elem('prompt')
      const query = elem('span')
      query.classList.add('editorContainer')
      query.append(prompt)
      query.append(serialize(expr, lang, binds, serialize.displayed))
      let env = _newExecutionEnv(call.env)
      const waiting = _evaluationElem(env)
      env[_id(log)] = waiting
      el.append(query)
      el.append(waiting)

      prompt.title = 'Click to remove this.'
      prompt.onclick = () => { // Remove the evaluator.
        _getOuterWindow(el) && _getOuterWindow(el).firstChild === el && _restoreWindow(_getOuterWindow(el))
        env != null && _cancel(env)
        then ? el.replaceWith(then) : elemRemove(el)

        if (binds && binds.has(evaluator.history)) { // Delete result from bindings.
          if (_isLabel(bindAs)) {
            const L = bindAs
            if (prevBinding !== evaluator.none) binds.set(L, prevBinding)
            else binds.delete(L)
            _invertBindingContext(binds, true)
          }
        }
      }
      elemValue(el, [evaluator, expr, then])

      // Evaluate the requested expression.
      const start = _timeSince()
      if (_isArray(expr) && expr[0] === _extracted && expr.length == 3 && (_isLabel(expr[1]) || _invertBindingContext(binds).has(expr[1])))
        bindAs = _isLabel(expr[1]) ? expr[1] : label(_invertBindingContext(binds).get(expr[1])), expr = expr[2]
      const prev = call.env
      _doJob(expr, env, r => { // Got the result.
        const end = _timeSince(), real = _timeSince(start)

        if (binds && binds.has(evaluator.history)) { // Add result to bindings.
          if (_isLabel(bindAs) && binds.get(evaluator.history).has(bindAs))
            r = [error, "Label", bindAs, "is already bound to", binds.get(bindAs)]
          else if (_isLabel(bindAs)) {
            const L = bindAs
            const q = quote(r)
            binds.get(evaluator.history).set(L, binds.has(L) ? binds.get(L) : evaluator.none)
            binds.set(L, q)
            _invertBindingContext(binds, true)
            r = [_extracted, q, r]
          }
        }

        const pre = _smoothHeightPre(el)
        elemRemove(waiting)
        // Merge `_updateBroken` of both logged children into one.
        _updateBroken(el)
        call.env = env

        // Display `_logAll evaluator ^(Result UserDuration RealDuration EndTime)`.
        el.append(daintyEvaluator([_logAll, evaluator, [quote, [r, env[_id(userTime)], real, end]]]))
        env = null
      })
      call.env = prev
      return impureSave(el)
    },
  },

  _formatNumber(x) {
    // Turns the number of milliseconds to a mostly-human-readable representation.
    return [
      elem('number', x < 1 ? x.toPrecision(6).replace(/\.?0+$/, '') : x < 10 ? x.toPrecision(3).replace(/\.?0+$/, '') : x < 1000 ? ''+(x|0) : (x/1000).toFixed(1)),
      x < 1000 ? 'ms' : 's',
    ]
  },

  _getOuterREPL(el) { return !el ? null : el.isREPL ? el : _getOuterREPL(el.parentNode) },

  _langAt(env = call.env) {
    if (!env) return fancy
    if (_id(_langAt) in env) return env[_id(_langAt)]
    const el = env[_id(log)]
    el = _getOuterREPL(el)
    if (el && _isArray(el.to)) return el.to[1]
  },

  _bindingsAt(env = call.env) {
    if (!env) return Self.ctx
    if (_id(_bindingsAt) in env) return env[_id(_bindingsAt)]
    const el = env[_id(log)]
    el = _getOuterREPL(el)
    if (el && _isArray(el.to)) return el.to[2]
  },

  _invertBindingContext(ctx, clear = false) {
    if (!(ctx instanceof Map)) throw console.error(ctx), "Invalid binding context"
    if (!_invertBindingContext.cache)
      _invertBindingContext.cache = new WeakMap, Object.freeze(_invertBindingContext)
    if (clear) return _invertBindingContext.cache.delete(ctx)
    if (_invertBindingContext.cache.has(ctx)) return _invertBindingContext.cache.get(ctx)
    const backctx = new Map
    ctx.forEach((to, name) => _isLabel(name) && (name = name[1], (name[0] !== '_' || !backctx.has(to)) && backctx.set(to, name)))
    _invertBindingContext.cache.set(ctx, backctx)
    return backctx
    // .cache
  },

  _removeChildren(el) {
    // Smoothly removes all children of a node.
    if (el.firstChild)
      for (let ch = el.firstChild; ch; ch = ch.nextSibling)
        if (!ch.removed)
          elemRemove(ch, true, true, false)
  },

  _autocompleteBrackets:[
    __is(`settings`),
    true,
    `Whether to autocomplete brackets/quotes in \`editor\`s.
'(' surrounds the selection in brackets. ')' surrounds the closest highlightable parent in brackets.`,
  ],

  editor:{
    docs:`\`(editor InitialString Lang Binds OnInput OnEnter)\`: creates a user-editable expression input.
\`OnInput\` is passed the parsed expression and whether the currently entered text fails to parse. \`OnEnter\` is passed the expression (always successfully-parsed), and it returns \`true\` to clear editor contents.
Don't do expensive synchronous tasks in \`OnInput\`.`,
    future:`Harden all/important \`parse\`s against interrupts, by moving them into \`_schedule\`/\`_doJob\` in \`editor\`.`,
    lookup:{
      _autocompleteBrackets:__is(`_autocompleteBrackets`),
    },
    call(initialString = '', lang = fancy, binds = Self.ctx, onInput, onEnter) {
      if (typeof initialString != 'string' && !(initialString instanceof Node))
        error('String expected, got', initialString)
      if (!(binds instanceof Map)) error('Map expected, got', binds)
      if (onInput && typeof onInput != 'function') error('Function or nothing expected, got', onInput)
      if (onEnter && typeof onEnter != 'function') error('Function or nothing expected, got', onEnter)

      // On any mutations inside, re-parse its contents, and show purified output.
      const obs = new MutationObserver(_throttled(record => {
        const s = getSelection()
        const i = _saveCaret(ed, s)
        try {
          const [expr, styled] = parse(ed, lang, binds, parse.dom)
          while (ed.firstChild) ed.removeChild(ed.firstChild)
          ed.append(elem('div', styled))
          if (i !== undefined && (document.activeElement === Self.into.parentNode.host || ed.contains(document.activeElement))) _loadCaret(ed, i, s)
          onInput && Promise.resolve().then(() => onInput(bound(n => n instanceof Element && n.special ? quote(n.to) : undefined, expr, false), false))
        } catch (err) {
          if (err instanceof Error) throw err
          onInput && onInput(undefined, true)
        }
        obs.takeRecords()
      }, .2))

      // Create the element with the initial string.
      const ed = elem('node')
      ed.contentEditable = true
      ed.spellcheck = false
      if (initialString && typeof initialString == 'string')
        ed.append(parse(initialString, lang, binds, parse.dom)[1])
      else if (initialString instanceof Node)
        ed.append(initialString)
      obs.observe(ed, { childList:true, subtree:true, characterData:true })

      const query = elem('span')
      elemValue(query, lang)
      query.classList.add('editorContainer')
      query.classList.add('editable')
      const prompt = elem('prompt')
      query.append(prompt)
      prompt.title = 'Click to clear this.'
      prompt.onclick = () => _smoothHeight(ed, () => ed.textContent = '')
      query.append(ed)

      const undo = [[]], redo = []

      ed.oninput = _throttled(() => {
        // Grow the undo buffer (and clear the redo buffer) on change.
        if (!undo.length || undo[undo.length-1].map(el => _innerText(el).join('')).join('') !== _innerText(ed).join(''))
          redo.length = 0, undo.push(children(ed)), undo.length > 4096 && (undo.splice(0, undo.length - 4096))
      }, .1)
      let height
      ed.addEventListener('input', evt => {
        if (_disableSmoothTransitions[1]) return
        if (height) height = _smoothHeightPost(ed, height)
        else height = _smoothHeightPre(ed)
      })
      ed.onkeydown = evt => {
        if (evt.altKey) return

        // Arrows in contenteditable move the caret like a buffoon, so we help them.
        if (!evt.ctrlKey && (evt.key === 'ArrowLeft' || evt.key === 'ArrowRight')) {
          const s = getSelection()
          let focusNode = s.focusNode, focusOffset = s.focusOffset
          if (!s.isCollapsed && !evt.shiftKey && s.rangeCount) {
            const r = s.getRangeAt(0)
            if (evt.key === 'ArrowLeft')
              focusNode = r.startContainer, focusOffset = r.startOffset
            else
              focusNode = r.endContainer, focusOffset = r.endOffset
          }
          const delta = !s.isCollapsed && !evt.shiftKey ? 0 : evt.key === 'ArrowLeft' ? -1 : 1
          if (focusNode)
            if (!focusNode.nodeValue || focusOffset+delta < 0 || focusOffset+delta > focusNode.nodeValue.length) {
              const i = _saveCaret(ed, focusNode, focusOffset) + delta
              const arr = _loadCaret(ed, i)
              if (evt.shiftKey)
                s.extend(...arr)
              else
                s.collapse(...arr)
              evt.preventDefault()
            }
        }

        // On Escape, blur editor (originally, so hover-highlighting becomes available, but now, just why not).
        if (evt.key === 'Escape' && document.activeElement === ed) ed.blur()

        // Brackets do not enter their character, instead they surround something with that bracket.
        // '(' surrounds the selection in brackets. ')' surrounds the closest highlightable parent in brackets.
        if (_autocompleteBrackets[1] && !evt.ctrlKey) {
          const brackets = '(){}[]\'\'""'
          const i = brackets.indexOf(evt.key)
          if (i >= 0 && i%2) {
            const r = document.createRange(), el = _closestNodeParent(getSelection())
            if (!el) return
            r.selectNodeContents(el)
            return _bracketize(r, brackets.slice(i-1,i+1)), evt.preventDefault()
          } else if (i >= 0 && getSelection().rangeCount) {
            return _bracketize(getSelection().getRangeAt(0), brackets.slice(i,i+2)), evt.preventDefault()
          }
        }
        // On Enter (unless with Shift or Ctrl), evaluate the expression.
        if (evt.key === 'Enter' && !evt.shiftKey && !evt.ctrlKey) evaluate(evt)

        // On Ctrl+Z, pop one from undo.
        if (evt.key === 'z' && !evt.shiftKey && evt.ctrlKey && undo.length) {
          if (undo[undo.length-1].map(el => el.innerText).join('') === ed.innerText) undo.pop()
          if (undo.length)
            redo.push(children(ed)), children(ed, undo.pop()), evt.preventDefault()
        }
        // On Ctrl+Shift+Z, pop one from redo.
        if (evt.key === 'Z' && evt.shiftKey && evt.ctrlKey && redo.length)
          undo.push(children(ed)), children(ed, redo.pop()), evt.preventDefault()
      }
      elemValue(query, [editor, initialString, lang, binds, onInput, onEnter])
      return query

      function evaluate(evt) {
        let clear = false
        if (onEnter)
          try {
            const expr = parse(ed, lang, binds)
            evt.preventDefault()
            clear = onEnter(bound(n => n instanceof Element && n.special ? quote(n.to) : undefined, expr, false), false)
          } catch (err) {
            if (_isArray(err) && err[0] === 'give more') err = err[1]
            else evt.preventDefault()
            try {
              const el = elem('error', err instanceof Error ? [String(err), '\n', err.stack] : String(err))
              el.style.left = '1em'
              el.style.position = 'absolute'
              return elemInsert(query, el), setTimeout(elemRemove, 1000, el)
            } catch (e) { console.error(err) }
          }
        if (clear) ed.textContent = ''
        onInput && onInput(undefined, true)
      }
      function children(el, to) { // Set children of `el` to `to`.
        const pre = _smoothHeightPre(el)
        if (!to) return [...el.childNodes].map(elemClone)
        while (el.firstChild) el.removeChild(el.firstChild)
        to.forEach(ch => el.appendChild(ch))
        _smoothHeightPost(el, pre)
      }
    },
  },

  _evaluateWhileTyping:[
    __is(`settings`),
    true,
    `Whether to evaluate results of expressions as they are typed in a REPL.`,
  ],

  REPL:{
    docs:`\`(REPL Language Bindings)\`: Creates a visual REPL element (read-evaluate-print loop).`,
    lookup:{
      editor:__is(`editor`),
      evaluator:__is(`evaluator`),
      daintyEvaluator:__is(`daintyEvaluator`),
      _evaluateWhileTyping:__is(`_evaluateWhileTyping`),
    },
    call(lang = fancy, binds = new Map(Self.ctx)) {
      if (!defines(lang, parse) || !defines(lang, serialize)) throw "Invalid language"
      if (!(binds instanceof Map)) throw "Invalid binding context"

      let env = _newExecutionEnv(null, null, lang, binds)

      if (typeof document == ''+void 0) { // NodeJS
        // Use the `repl` module to display colored prompts and command inputs/outputs.
        const msg = defines(lang, REPL)
        const repl = require('repl')
        const out = process.stdout
        if (!out.isTTY || !out.hasColors()) _colored.disabled = true
        const prompt = '> ', coloredPrompt = _colored(prompt, 31) // red
        const opt = serialize.displayed
        console.log('ctrl-D or .exit to exit.')
        console.log('A ' + serialize(REPL, basic, undefined, opt) + ' of language ' + serialize(lang, basic, undefined, opt) + (typeof msg == 'string' ? stringToDoc(': ' + msg).join('') : ''))
        const originalBinds = binds
        let n = 0
        opt.breakLength = out.columns
        repl.start({
          eval(cmd, _jsContext, _filename, then) {
            cmd = cmd.trim()
            try {
              log.did = false
              const expr = parse(cmd, fancy, binds)
              opt.breakLength = out.columns
              if (out.isTTY && !log.did) {
                const lines = Math.ceil((cmd.length + prompt.length) / out.columns)
                out.moveCursor(0, -lines)
                out.clearScreenDown()
                out.write(coloredPrompt + serialize(expr, fancy, undefined, {...opt, offset:(prompt.length+1)>>>1}) + '\n')
              }
              _schedule(expr, _newExecutionEnv(env, null, lang, binds), result => {
                // If binds contain result in values, set name to that; if not, create a new one.
                let name
                binds.forEach((v,k) => v === result && (name = k[1]))
                if (!name) do { name = '$' + n++ } while (binds.has(name))
                if (!binds.has(name))
                  (binds = new Map(binds)).set(label(name), quote(result))
                _bindingsAt.binds = binds
  
                then(null, _colored(name, 33) + ': ' + serialize(result, fancy, undefined, {...opt, offset:1+Math.ceil(name.length/2+.5)})) // brown
              })
            } catch (err) {
              if (_isArray(err) && err[0] === 'give more') then(new repl.Recoverable(err))
              else console.log(typeof err == 'string' ? _colored(err, 31) : err), then() // red
            }
          },
          writer: x => x,
          completer: cmd => {
            const arr = /[^`=\s\[\]]+$/.exec(cmd)
            const begins = arr ? arr[0] : ''
            const matches = []
            binds.forEach((_v,k) => k.slice(0, begins.length) === begins && matches.push(k))
            return [matches, begins]
          },
          coloredPrompt,
        }).on('reset', () => { binds = originalBinds, n = 0 }) // .clear
        // Cannot seem to react to SIGINT (and stop execution).
        return
      }
      // Else Browser

      if (impureHave()) return impureLoad()

      const repl = elem('node')
      repl.isREPL = true, repl.classList.add('REPL')
      const us = [REPL, lang, binds]
      observe(us, function onChange(us) {
        if (!repl.isConnected) return observe(us, onChange, false)
        lang = us[1], binds = us[2]
        env = _newExecutionEnv(null, null, lang, binds)
        query.replaceWith(editor('', lang, binds, purifyAndDisplay, evaluate))
        ;[...repl.querySelectorAll('serialization')].forEach(ch => ch.replaceWith(serialize(ch.to, lang, binds, serialize.displayed)))
      }, true)
      elemValue(repl, us)

      // Display purified output.
      const pureOutput = elem('div')
      pureOutput.classList.add('code')
      pureOutput.style.display = 'inline-block'
      pureOutput.style.position = 'relative'
      let penv, waiting, lastExpr
      const purifyAndDisplay = _throttled((expr, clear) => {
        if (msg === false && _isArray(expr) && expr[0] === jsEval && typeof expr[1] == 'string' && expr[2]) expr = [randomNat, 2]
        const pre = _smoothHeightPre(pureOutput)
        if (penv !== undefined) _cancel(penv), waiting.remove(), penv = undefined, waiting = undefined
        let promise
        if (_evaluateWhileTyping[1]) {
          _removeChildren(pureOutput)
          if (!clear) promise = new Promise(then => {
            const e = penv = _newExecutionEnv(env, null, lang, binds)
            e[_id(log)] = waiting = _evaluationElem(penv), call.env = penv
            const bindAs = _isArray(expr) && expr[0] === _extracted && expr.length == 3 && _isLabel(expr[1]) ? expr[1] : null
            if (bindAs) expr = expr[2]
            pureOutput.append(waiting)
            _doJob([purify, quote(expr)], penv, result => {
              if (_isUnknown(result) && result.length == 2 && _isArray(result[1]) && (_isError(result[1])))
                result = result[1] // Display errors too.
              if (bindAs) result = [_extracted, bindAs, result]

              const pre = _smoothHeightPre(pureOutput)
              try {
                penv = undefined, waiting && waiting.remove(), waiting = undefined
                if (!_isUnknown(result)) {
                  // Display `_logAll evaluator (Result)`.
                  pureOutput.append(daintyEvaluator([_logAll, evaluator, [quote, [result]]]))
                } else {
                  const el = elem('button', 'Evaluate')
                  elemValue(el, result)
                  el.onclick = evaluateLast
                  elemInsert(pureOutput, el)
                }
              } finally { _smoothHeightPost(pureOutput, pre), then(e[_id(userTime)]) }
            })
            _smoothHeightPost(pureOutput, pre)
          })
        } else {
          if (pureOutput.lastChild && pureOutput.firstChild === pureOutput.lastChild && pureOutput.lastChild.tagName === 'BUTTON') return
          _removeChildren(pureOutput)
          pureOutput.append(button(evaluateLast, 'evaluate'))
          _reflow().then(() => _smoothHeightPost(pureOutput))
        }
        return promise
      }, .1, expr => lastExpr = expr)

      const evaluateLast = () => evaluate(lastExpr)
      const evaluate = expr => {
        const prev = call.env;  call.env = env
        try { return log(evaluator(expr)), true }
        finally { call.env = prev }
      }
      repl.classList.add('code')

      const msg = defines(lang, REPL)
      repl.append(elem('text', [
        'A ',
        serialize(REPL, basic, undefined, serialize.displayed),
        ' of language ',
        serialize(lang, basic, undefined, serialize.displayed),
        typeof msg == 'string' ? stringToDoc(': ' + msg) : elem('span')]))

      const query = editor('', lang, binds, purifyAndDisplay, evaluate)
      repl.append(query)
      repl.append(pureOutput)
      env[_id(log)] = query
      return impureSave(repl)
    },
  },

  button:{
    docs:`\`(button OnClick)\`: Returns a button that calls a function on click (with no arguments). Overridable.`,
    call(f, name, title) {
      const backctx = _invertBindingContext(Self.ctx)
      if (typeof name != 'string' && !_isDOM(name)) name = backctx.has(f) ? backctx.get(f) : f && f.displayName || f && f.name
      if (!name) name = 'Execute'
      if (typeof defines(f, button) == 'function') return defines(f, button)()
      else if (typeof defines(f, button) == 'string') name = defines(f, button)
      if (f instanceof Node) return f
      if (typeof f != 'function') error("Cannot call not-a-function:", f)

      if (typeof name == 'string')
        name = name.replace(/[A-Z]/g, s => ' '+s.toLowerCase()),
        name = name[0].toUpperCase() + name.slice(1)

      const el = elem('button')
      if (title) el.title = title
      el.onclick = f
      el.append(name)
      return el
    },
  },

  files:{
    docs:`\`(elem files StringMap)\`: an element for downloading files.`,
    elem(tag, content, name = 'Files:') {
      if (tag != files) error('...')
      const el = elem('details', elem('summary', name))
      if (content instanceof Map)
        content.forEach((value, name) => _appendFile(el, name, value) )
      else if (typeof content == 'object' && !content[defines.key])
        Object.keys(content).forEach(k => _appendFile(el, k, content[k]))
      else error('...')
      el.open = true
      return el
    },
  },

  url:{
    docs:`Creates a URL element.`,
    elem(tag, href) {
      if (typeof href != 'string') throw "Must be a string"
      if (tag !== url || typeof document == ''+void 0) return href
      const el = elem('a', href)
      elemValue(el, [elem, url, href])
      el.href = href
      el.title = decodeURI(href)
      if (el.title.slice(0,8) === 'https://') el.title = el.title.slice(8)
      return el
    },
  },

  tutorial:{
    docs:`\`tutorial Func\`: views the unlockable code tutorial of \`Func\`, if available.
\`(tutorial)\`: views all globally-available tutorials.`,
    tutorial:[
      `A nice, sunny day out, with not a single cloud in sight. Let's make our understanding of tutorials as clear as the weather.

Tutorials are a way of explaining ourselves to other humans as a part of the only form of immortality that's possible. You better make your code understandable, and you better be nice.

But first, we need to make sure that you can type characters. Yes, just type out \`'Can type'\` in the field below and press Enter, very, very gently. Remember that your keyboard can be your friend for decades to come if you don't neglect it.`,
      [
        __is(`fancy`),
        ``,
        `Can type`,
      ],
      `Good work getting this far. I cannot even imagine the trouble you went through, but for what you did, we are grateful.
      
Tutorials in \`tutorial\` are arrays of either text or an array of the language (see \`Languages\`), then the initial text, then optionally either the intended result or a function that judges whether the result is OK and we can continue.
      
Try making a tutorial from this description. Have to hand it to you: remember that \`(Func …Args)\` is how you call functions, \`(array …Items)\` is how you make arrays, and that \`fancy\` is the most basic language.`,
      [
        __is(`fancy`),
        ``,
        function(result) { return result instanceof Node && result.tagName === 'TUTORIAL' },
      ],
      `Very nice.

However, you must drill deeper into the representations. Right-click on \`tutorial\` to summon a \`contextMenu\` on it, find its tutorial, and see what value will allow you to progress.`,
      [
        __is(`fancy`),
        `'So, on a scale from one to ten, how much did the last person you killed deserve it?'`,
        `0`,
      ],
      `Or did you expect to have the answer handed to you? No one will give you anything if you don't take it.
      
Now, type \`(tutorial)\` and claim what's yours.`,
      [],
    ],
    call(f = undefined) {
      if (f === undefined) {
        const m = _allocMap()
        Self.ctx.forEach(global => {
          if (!_isArray(global) && _isArray(defines(global, tutorial)))
            m.set(global, tutorial(global))
        })
        return hierarchy(m, elem('div', 'All available code tutorials:'))
      }
      let t = _isArray(f) ? f : defines(f, tutorial), i = 0, result = elem('tutorial')
      if (!_isArray(t)) return
      emit()
      return result

      function emit(toEnd = true) {
        if (toEnd) {
          const pre = _smoothHeightPre(result)
          while (emit(false));
          _reflow().then(() => _smoothHeightPost(result, pre))
          setTimeout(() => result.style.removeProperty('height'), 1000)
          return
        }
        if (i >= t.length) return false
        let v = t[i++]
        if (typeof v == 'string')
          result.append(elem('separated-text', stringToDoc(v)))
        else if (_isArray(v)) {
          const [lang, initialCode, canContinue] = v
          const results = elem('div')
          let passed = false, env, expr
          const OnInput = x => expr = x
          const OnEnter = x => {
            // Evaluate the expression and check its validity.
            const pre = _smoothHeightPre(results)
            _removeChildren(results)
            if (env) env.then ? env.cancel && env.cancel() : _cancel(env)

            env = _newExecutionEnv(null, null, lang, Self.ctx)
            elemInsert(results, env[_id(log)] = _evaluationElem(env))
            _smoothHeightPost(results, pre)

            _schedule(x, env, result => {
              const prevEvalElem = env[_id(log)]
              if (!passed)
                if (typeof canContinue == 'function') {
                  elemRemove(env[_id(log)])
                  env = _newExecutionEnv(env)
                  let evalElem
                  results.append(evalElem = env[_id(log)] = _evaluationElem(env))
                  _schedule([canContinue, quote(result)], env, function checkOk(ok) {
                    if (ok && typeof ok == 'object' && ok.then) {
                      ok.then(checkOk)
                      env = ok
                    } else {
                      elemRemove(evalElem)
                      if (ok) passed = true, emit(), elemRemove(btn)
                      env = null
                    }
                    expr = x
                  })
                } else if (env = null, canContinue !== undefined)
                  if (result === canContinue)
                    passed = true, emit(), elemRemove(btn)
              const pre = _smoothHeightPre(results)
              elemRemove(prevEvalElem)
              elemInsert(results, serialize(result, lang, null, serialize.displayed))
              _smoothHeightPost(results, pre)
              expr = x
            })
            return false
          }
          const btn = button(() => OnEnter(expr), 'evaluate')
          result.append(editor(initialCode, lang, Self.ctx, OnInput, OnEnter))
          result.append(btn)
          result.append(results)
          if (canContinue !== undefined) return false
        } else
          error('Expected a string or a (Language InitialCode CanContinueFunc) array but got', v)
        return true
      }
    },
  },

  editObject:{
    docs:`\`editObject Object\`: allows the user to edit the runtime object in-place.
\`editObject Object null\` checks whether the object is editable.
\`editObject Object Language\` specifies the editor's language.`,
    call(x, lang = fancy) {
      if (!_isArray(x) && defines(x, deconstruct) === undefined && !(x instanceof Map)) return
      if (defines(deconstruct(x), editObject) === false) return
      if (lang === null) return true

      const flatten = (item, depth = 1) => {
        if (depth > 0)
          return item.map(x => flatten(x, depth-1))
        const isTrivial = typeof item == 'number' || typeof item == 'string' || typeof item == 'boolean'
        if (isTrivial || _invertBindingContext(Self.ctx).has(item))
          return item
        return elemValue(elemCollapse(() => {
          const srl = serialize(item, fancy, Self.ctx, serialize.displayed)
          srl.contentEditable = 'false'
          return srl
        }), item)
      }
      let dec = deconstruct(x)
      if (_isArray(dec) && defines(dec, construct)) dec = make(...dec)
      const initial = serialize(flatten(dec), lang, Self.ctx, serialize.displayed).firstChild
      const indicator = elem('span')
      let expr = x
      const ed = editor(initial, lang, Self.ctx, next => next !== undefined && updateIndicator(expr = next), next => {
        _isArray(x) ? writeAt(x, undefined, next) : construct(x, next)
        expr = next, updateIndicator()
      })
      const observer = () => {
        if (!ed.isConnected) observe(x, observer, false)
        else updateIndicator()
      }
      observe(x, observer, true)
      updateIndicator()
      return elem('edit-object', [indicator, ed])

      function updateIndicator() {
        if (Object.getPrototypeOf(x) !== Object.getPrototypeOf(expr))
          indicator.textContent = '❌ ', indicator.title = 'Invalid type.'
        else if (_hasSameRepr(x, expr))
          indicator.textContent = '✅ ', indicator.title = 'Up-to-date.'
        else
          indicator.textContent = '⬜ ', indicator.title = 'Changed. Can commit this.'
      }
    },
  },

  _hasSameRepr(a, b) {
    a = serialize(deconstruct(a), basic)
    if (_isArray(a)) a = a.join('')
    b = serialize(deconstruct(b), basic)
    if (_isArray(b)) b = b.join('')
    return a === b
  },

  editRewrite:{
    docs:`\`editRewrite Global\`: changes the global for the next \`Rewrite\`.
Also supports \`editRewrite Global null\` to check whether an object can be rewritten, and \`editRewrite Global Language\` to specify a different editing language.`,
    call(x = undefined, lang = fancy) {
      const backctx = _invertBindingContext(Self.ctx)
      if (typeof x != 'object' && typeof x != 'function') return
      if (!lookup.parents.has(x) && !backctx.has(x)) return
      if (lang === null) return true
      let key = backctx.has(x) ? label(backctx.get(x)) : x
      let keyPreview = key
      let value = Rewrite.ctx.has(x) ? Rewrite.ctx.get(x) : x
      const indicator = elem('div')
      updateIndicator()
      const keyEditor = editor(key === x ? '' : key[1], stringLanguage, Rewrite.ctx, k => {
        if (k !== undefined) keyPreview = k ? label(k) : x, updateIndicator()
      }, k => {
        Rewrite.ctx.delete(key)
        key = keyPreview = k ? label(k) : x
        value !== undefined && (Rewrite.ctx.set(key, value), Rewrite.ctx.set(x, value))
        updateIndicator()
      })
      let dec = deconstruct(value)
      if (_isArray(dec) && defines(dec, construct)) dec = make(...dec)
      const valueEditor = editor(serialize(dec, lang), lang, Rewrite.ctx, v => {
        if (v !== undefined) value=v, updateIndicator()
      }, v => {
        value = v
        if (v !== undefined)
          Rewrite.ctx.set(key, value), Rewrite.ctx.set(x, value)
        else
          Rewrite.ctx.delete(key), Rewrite.ctx.set(x, undefined)
        updateIndicator()
      })
      const rewritePreview = elemCollapse(function() {
        const close = button(() => result.replaceWith(rewritePreview), '❌', 'Collapse the preview.')
        close.doNotCloseTheContextMenuOnClick = true
        const result = elem('div', [close, Rewrite()])
        return result
      })
      return elem('div', [indicator, keyEditor, valueEditor, rewritePreview])

      function updateIndicator() {
        const ctx = Rewrite.ctx, key = keyPreview
        if (value === undefined)
          Self.ctx.has(key) ? ctx.set(key, Self.ctx.get(key)) : ctx.delete(key)
        else if (_hasSameRepr(value, ctx.get(key)))
          key !== value ? ctx.set(key, value) : ctx.delete(key)
        _invertBindingContext(ctx, true)
        if (_isLabel(key) ? _hasSameRepr(value, Self.ctx.get(key)) : !ctx.has(key))
          indicator.textContent = '✅ ', indicator.title = 'Up-to-date, non-edited.'
        else if (ctx.get(key) === value)
          indicator.textContent = '➕ ', indicator.title = 'Changed from self. Changes will be seen in the next rewrite.'
        else
          indicator.textContent = '⬜ ', indicator.title = 'Changed from the rewrite. Can commit this.'
      }
    },
  },

  settings:{
    docs:`\`(settings)\`: presents a hierarchy of all global user-modifiable settings.
\`settings Opt\`: presents the interface to change one option.`,
    lookup:{
      rangeSetting:__is(`rangeSetting`),
      settingsToolbar:__is(`settingsToolbar`),
    },
    call(opt) {
      if (opt === undefined) {
        const m = _allocMap()
        Self.ctx.forEach(global => {
          if (_isArray(global) && global[0] === settings)
            m.set(global, settings(global))
        })
        return hierarchy(m, elem('span', 'Current settings:'))
      } else {
        // An option is [settings, Value, HumanReadableName, OptToElemFunc].
        if (!_isArray(opt) || opt[0] !== settings) return
        let el
        if (typeof opt[3] == 'function')
          // The func, if present, accepts the opt array where a[1] is the value, and optionally the element (to update it).
          el = opt[3](opt)
        else {
          if (typeof opt[1] == 'boolean')
            el = elem('input'), el.type = 'checkbox', el.checked = opt[1],
            el.onchange = () => writeAt(opt, 1, el.checked)
          else if (typeof opt[1] == 'number')
            el = elem('input'), el.type = 'number', el.value = opt[1],
            el.onchange = () => writeAt(opt, 1, +el.value)
          else if (typeof opt[1] == 'string')
            el = elem('textarea'), el.value = opt[1],
            el.onchange = () => writeAt(opt, 1, el.value)
          else
            error('Cannot infer the visual type of', opt[1])
        }
        elemValue(el, opt)
        if (!el.title) el.title = opt[2]
        el.special = true
        const observer = opt => {
          el.title = opt[2]
          if (!el.isConnected) observe(opt, observer, false)
          if (typeof opt[3] == 'function')
            opt[3](opt, el)
          else if (typeof opt[1] != 'boolean')
            el.value = opt[1]
          else
            el.checked = opt[1]
          el.dispatchEvent(new Event('input', {bubbles:true}))
        }
        observe(opt, observer, true)
        return el
      }
    },
  },

  rangeSetting(opt, el) {
    // Creates an <input type=range> when used in a `settings` as setting[3].
    //   Extra arguments after this are min, max, step.
    if (!el) {
      el = elem('input')
      el.type = 'range'
      el.style.margin = el.style.padding = 0
      el.oninput = el.onchange = () => writeAt(opt, 1, el.value)
    }
    const min = el.min = opt[4] || 0
    const max = el.max = opt[5] || 1
    el.step = opt[6] || .01
    el.value = opt[1]
    el.title = (opt[2] || '').replace(/%%%/g, ((opt[1]*100)|0)+'%')
    return el
  },

  Commands:new Map([
    ['AuxClick', function(target, range, evt) {
      contextMenu(target, range, evt)
    }],
  ]),

  _getNextSibling(el) {
    // Seems to work.
    return el.nextSibling || el.parentNode && getComputedStyle(el.parentNode).display !== 'block' && _getNextSibling(el.parentNode) || el.nextSibling
  },

  _stopIteration:{
    docs:`A marker for stopping iteration.`,
  },

  _visitText:{
    docs:`Calls f(String, TextNode) or f(false, SpecialElem) for each substring in el as parsing sees it.
Return \`_stopIteration\` to stop iteration.`,
    call(el, f) {
      if (!el) return
      if (el.tagName === 'BR') return f(_getNextSibling(el) ? '\n' : '', el)
      if (!(el instanceof Element)) {
        return f(el.textContent.slice(-1) !== '\n' || _getNextSibling(el) ? el.textContent : el.textContent.slice(0,-1), el)
      }
      if (el.special) return f(false, el)
      for (let ch = el.firstChild; ch; ch = ch.nextSibling) {
        if (_visitText(ch, f) === _stopIteration) return _stopIteration
        if (_getNextSibling(ch) && (ch.tagName === 'DIV' || ch.tagName === 'P'))
          if (f('\n', _getNextSibling(ch)) === _stopIteration) return _stopIteration
      }
    },
  },

  _saveCaret(el, ch, i) { // → index
    if (ch instanceof Selection && !ch.rangeCount) return 0
    if (ch instanceof Selection) i = ch.focusOffset, ch = ch.focusNode
    if (ch instanceof Element) ch = i < ch.childNodes.length ? ch.childNodes[i] : _getNextSibling(ch), i = 0
    if (ch && ch.parentNode.special) i = i ? ch.parentNode.childNodes.length : 0, ch = ch.parentNode
    while (!i && ch && ch.firstChild && !ch.special) ch = ch.firstChild

    let j = i || 0
    _visitText(el, (s, el) => {
      // Non-contenteditable elements in contenteditable are treated atrociously, so we resort to these hacks (pull everything in <collapsed> out of it — not relevant if selection went through _loadCaret, but there is no guarantee of that).
      if (el.tagName === 'COLLAPSED' || el.tagName === 'SERIALIZATION') {
        if (el.tagName === 'COLLAPSED')
          if (!el.firstChild || el.firstChild.tagName !== 'HIDDEN')
            el.insertBefore(elem('hidden'), el.firstChild)
        while (el.parentNode && el.firstChild !== el.lastChild)
          el.parentNode.insertBefore(el.firstChild.nextSibling, el.nextSibling)
      }

      return el === ch ? _stopIteration : s === false ? ++j : j += s.length
    })
    return j
  },

  _loadCaret(el, index, into) { // → [ch, i]
    if (index < 0) index = 0
    let j = 0, i = 0, result, arr = []
    _visitText(el, (s, el) => {
      arr.push(s)
      const len = s === false ? 1 : s.length
      if (j + len >= index) return result = el, i = index - j, _stopIteration
      j += len
    })
    let ch = result
    if (ch && !(ch instanceof Element) && i === ch.nodeValue.length && _getNextSibling(ch)) ch = _getNextSibling(ch), i = 0
    if (index == null) ch = null
    if (ch && ch.special)
      [ch, i] = [ch.parentNode, [...ch.parentNode.childNodes].indexOf(ch) + (i ? 1 : 0)]
    if (ch && ch instanceof Element && i > ch.childNodes.length) i = ch.childNodes.length
    if (ch && !(ch instanceof Element) && i > ch.nodeValue.length) i = ch.nodeValue.length
    !ch && ([ch, i] = [el, el.childNodes.length - (el.lastChild && !el.lastChild.textContent ? 1 : 0) || 0])
    if (into instanceof Selection) into.collapse(ch, i)
    else return [ch, i]
  },

  _innerText:{
    docs:`Returns the inner text of an element (in an array with strings and other things), preserving .special elements.`,
    call(el) {
      const a = [], str = []
      let s
      _visitText(el, (s, el) => s === false ? (str.length && (s = str.join(''), s && a.push(s), str.length = 0), a.push(el)) : str.push(s))
      str.length && (s = str.join(''), s && a.push(s), str.length = 0)
      return a
    },
  },

  _smoothHeight(el, f) {
    const pre = _smoothHeightPre(el)
    f()
    _reflow().then(() => _smoothHeightPost(el, pre))
  },

  _smoothTransformPre(el) {
    if (_disableSmoothTransitions[1]) return
    if (!(el instanceof Element)) return !el || el.left === undefined || el.top === undefined ? undefined : [el.left + scrollX, el.top + scrollY]
    const r = el.getBoundingClientRect()
    return [r.left + scrollX, r.top + scrollY]
  },

  _smoothTransformPost:{
    docs:`For moving non position:inline elements from and to an arbitrary document location, smoothly and without lag. Use _smoothTransformPre to fill in \`pre\`.`,
    call(el, pre, delay = 0) {
      if (_disableSmoothTransitions[1]) return
      if (!pre || !(el instanceof Element)) return
      const post = _smoothTransformPre(el)
      if (!post || el.style.display || el.style.transform || el.style.transform && el.style.transform !== 'none') return
      if (pre[0] === post[0] && pre[1] === post[1]) return post
      el.style.display = 'none'
      el.style.transform = `translate(${pre[0] - post[0]}px, ${pre[1] - post[1]}px)` // Too lazy to scale it (which would require knowing transform-origin).
      _reflow().then(() => {
        el.style.removeProperty('display')
        _reflow().then(() => {
          if (delay)
            setTimeout(() => (el.style.removeProperty('transform'), _clearStyle(el)), delay)
          else el.style.removeProperty('transform'), _clearStyle(el)
        })
      })
    },
  },

  _reflow() {
    if (_reflow.p) return _reflow.p
    return _reflow.p = Promise.resolve().then(() => (_reflow.p = null, Self.into.offsetWidth))
  },

  _smoothHeightPre(el) { return !_disableSmoothTransitions[1] && el instanceof Element && el.offsetHeight || 0 },

  _smoothHeightPost:{
    docs:`Since height:auto does not transition by default (because it's too laggy for non-trivial layouts), we explicitly help it (because we don't care).
Call this with the result of _smoothHeightPre to transition smoothly.`,
    call(el, pre) {
      if (!(el instanceof Element)) return
      if (_disableSmoothTransitions[1]) return 0
      el.style.removeProperty('height')

      const post = _smoothHeightPre(el)
      if (pre !== post) {
        el.style.height = pre + 'px'
        _reflow().then(() => el.style.height = post + 'px')
      }
      return post
    },
  },

  elemInsert:{
    docs:`Inserts a DOM element into the displayed DOM tree smoothly (if CSS transitions are enabled for it, and are specified in seconds, with all-props being the first specified one), by transitioning height from 0.
Very bad performance if a lot of inserts happen at the same time, but as good as it can be for intermittent smooth single-element-tree insertions.`,
    call(into, el, before = null) {
      if (el === undefined) return
      if (el.parentNode) el = elemClone(el)
      if (typeof el == 'string') el = document.createTextNode(el)
      const pre = _smoothHeightPre(into)
      const wasMax = _updateMaxScrollBegin()

      into.insertBefore(el, before)
      _updateBroken(into)
 
      _smoothHeightPost(into, pre)
      _updateMaxScrollEnd(wasMax)

      if (_isStylableDOM(el))
        _smoothHeightPost(el, 0)
      return el
    },
  },

  elemRemove:{
    docs:`Removes a DOM element from the displayed document smoothly (if CSS transitions are enabled for it, and are specified in seconds, with all-props being the first), by transitioning height and opacity to 0.`,
    lookup:{
      particles:__is(`particles`),
    },
    call(el, absolutize = false, doParticles = true, doHeight = true) {
      if (!el || el.removed) return
      el.removed = true
      if (!(el instanceof Element)) return el.remove ? el.remove() : error('Not an element')

      if (doParticles) {
        const r1 = el.getBoundingClientRect(), r2 = (Self.into !== document.body ? Self.into : document.documentElement).getBoundingClientRect()
        _reflow().then(() => particles(r1.left - r2.left, r1.top - r2.top, r1.width, r1.height))
      }

      let height, dur, from, pre
      const style = getComputedStyle(el)
      dur = parseFloat(style.transitionDuration)*1000 || 0
      if (doHeight) {
        height = style.height
        if (height === undefined) height = el.offsetHeight
        from = el.parentNode
        pre = _smoothHeightPre(from)
      }

      if (absolutize) {
        const x = el.offsetLeft, y = el.offsetTop, w = el.offsetWidth
        el.style.position = 'absolute'
        el.style.left = x + 'px'
        el.style.top = y + 'px'
        el.style.width = w+1 + 'px'
      }

      _reflow().then(() => {
        if (dur) {
          el.classList.add('removed')
          if (doHeight) el.style.height = height
          el.style.opacity = 0, el.style.pointerEvents = 'none'
          if (doHeight)
            _reflow().then(() => el.style.height = 0)
          setTimeout(el => el.remove(), dur, el)
        } else el.remove()
        if (doHeight) _smoothHeightPost(from, pre)
      })
      return el
    },
  },

  _removalParticlesFrequency:[
    __is(`settings`),
    .5,
    `The probability of extra effects for removing a visual element is %%%.`,
    __is(`rangeSetting`),
    0,
    1,
    .01,
  ],

  particles:{
    docs:`A splash of magical particles.`,
    philosophy:`Most people create programming languages to improve performance for specific cases or to prove their way of thinking superior to others, but I actually just wanted to be a wizard and use a PL to enhance my craft.`,
    lookup:{
      _removalParticlesFrequency:__is(`_removalParticlesFrequency`),
    },
    call(x,y,w,h, n = Math.sqrt(w*h)/10 * Math.random()) {
      if (_disableSmoothTransitions[1]) return
      if (Math.random() < 1 - _removalParticlesFrequency[1]) return
      const into = document.createElement('div')
      into.style.left = x + 'px'
      into.style.top = y + 'px'
      into.style.position = 'absolute'
      for (let i = 0; i < n; ++i) {
        const p = document.createElement('particle')
        p.style.left = Math.random() * w + 'px'
        p.style.top = Math.random() * h + 'px'
        p.style.setProperty('--x', (Math.random()*20-10) + 'px')
        p.style.setProperty('--y', (Math.random()*20-10) + 'px')
        p.style.scale = 2 / (1 + Math.random()*5)
        into.append(p)
      }
      Self.into.append(into)
      setTimeout(() => into.remove(), 300)
    },
  },

  _isDOM(el) { return typeof Node != ''+void 0 && el instanceof Node },

  _isStylableDOM(el) { return typeof Element != ''+void 0 && el instanceof Element },

  _throttled:{
    docs:`Returns a throttled version of a function.
For non-critical potentially-long tasks. Tries to adjust CPU consumption (counting time in between as rest).
cpu: 0 is infinite delay (no work), 1 is no delay (all work), 0.5 is estimated-execution-time×1 delay.
Return a promise to measure non-sync time.`,
    call(fun, cpu = .5, everyTime) {
      const blend = .3 // 1 to always estimate the next time as exactly the previous time.
      let lastDur = 0
      let scheduledTime = _timeSince(), scheduledId = null
      let lastRun = _timeSince()
      let arg1, arg2
      function throttled(x,y) {
        if (everyTime) everyTime(x,y)
        arg1 = x, arg2 = y
        const target = typeof cpu == 'number' ? cpu : cpu()
        let requiredRest = target === .5 ? lastDur : lastDur/target - lastDur
        if (scheduledId) clearTimeout(scheduledId), requiredRest -= _timeSince(scheduledTime)
        else requiredRest -= Math.min(_timeSince(lastRun), 2000), lastRun = _timeSince()
        if (requiredRest > 2)
          scheduledId == null && (scheduledTime = _timeSince()), scheduledId = setTimeout(runThrottled, Math.max(0, requiredRest))
        else runThrottled(), scheduledTime = _timeSince()
      }
      function runThrottled() {
        scheduledId = null
        const start = _timeSince()
        const r = fun(arg1, arg2)
        if (_isPromise(r))
          r.then(userTimePassed => {
            if (typeof userTimePassed != 'number') userTimePassed = _timeSince(start)
            lastDur = blend * userTimePassed + (1-blend) * userTimePassed, lastRun = _timeSince()
          })
        else
          lastDur = blend * _timeSince(start) + (1-blend) * _timeSince(start), lastRun = _timeSince()
        return r
      }
      return throttled
    },
  },

  null:null,

  undefined:undefined,

  _isVar(x) { return _isArray(x) && x[0] === label },

  _updateBroken:{
    docs:`Ensure that e either contains no soft line breaks directly inside of it, or its every child is on its own line (CSS class .broken).
Quite expensive.`,
    call(e, available) {
      if (!_isStylableDOM(e) || e.tagName === 'COLLAPSED' || e.tagName === 'SCROLL-HIGHLIGHT' || e.removed) return

      // Throttle outselves a bit.
      if (!_updateBroken.el) _updateBroken.el = new Set, _updateBroken.widths = new Map
      if (available === undefined) {
        _updateBroken.widths.clear()
        for (let p = e; p; p = p.parentNode)
          if (_updateBroken.el.has(p)) return
        _updateBroken.el.add(e)
        if (_updateBroken.el.size === 1)
          Promise.resolve().then(() => { _updateBroken.el.forEach(e => _updateBroken(e, null)), _updateBroken.el.clear() })
      }

      if (!e.isConnected) return
      if (available == null) available = e.offsetWidth || 0
      const start = e.offsetLeft || 0
      for (let ch = e.firstChild; ch; ch = ch.nextSibling)
        _updateBroken(ch, (ch.offsetParent !== e ? start : 0) + available - (ch.offsetLeft || 0))
      if (e.tagName !== 'NODE' || e.classList.contains('code')) return
      const noTableInside = !e.childNodes[1] || !e.childNodes[2] || e.childNodes[1].tagName !== 'TABLE' && e.childNodes[2].tagName !== 'TABLE'
      const parentWidth = e.classList.contains('broken') && noTableInside ? available+1 : e.offsetWidth+1 || 1000
        // Not nearly as accurate as removing .broken would have been (with tables in particular), but much faster.
          // So we special-case the <table>-inside case
          // Structural learning at its finest
      let Sum = 0, max = 0
      for (let ch = e.firstChild; ch; ch = ch.nextSibling) {
        const w = _updateBroken.widths.has(ch) ? _updateBroken.widths.get(ch) : ch.offsetWidth || 0
        _updateBroken.widths.delete(ch)
        Sum += w, max = Math.max(max, w)
      }
      if ((Sum > parentWidth) !== e.classList.contains('broken')) {
        // Set class async and calc+remember the new width ourselves, to not pay the enormous reflow-per-node cost.
        _updateBroken.widths.set(e, max + 4)
        Promise.resolve().then(() => e.classList.toggle('broken', Sum > parentWidth))
      }

      // .el (a Set of nodes to update later), .widths (a Map from children to their width-if-broken approximations)
    },
  },

  _forEachGlobalDefining(x, f, onlyPublic = false, onlyTopLevel = false) {
    const seen = new Set
    Self.ctx.forEach((v,k) => {
      if (typeof v == 'string') return
      if (onlyPublic && k[1][0] === '_') return
      if (onlyTopLevel && lookup.parents.has(v)) return
      if (seen.has(v)) return; else seen.add(v)
      if (defines(v, x) !== undefined) f(v, defines(v, x))
    })
  },

  docs:{
    docs:`\`(docs)\`: returns a hierarchical documentation elem. \`docs Func\`: makes documentation.`,
    lookup:{
      docsToHTML:__is(`docsToHTML`),
    },
    call(f = undefined) {
      if (f !== undefined)
        return elem('text', stringToDoc(defines(f, docs)))
      if (docs.result) return docs.result
      const net = defines(Self, lookup)
      const m = new Map
      Object.keys(net).forEach(k => {
        if (net[k] == null || typeof net[k] == 'boolean' || _isArray(net[k])) return
        const t = defines(net[k], docs)
        return k[0] !== '_' && m.set(net[k], t && elem('text', stringToDoc(t)))
      })
      const el = elem('div', hierarchy(m, Self))
      return docs.result = el
      // .result
    },
  },

  docsToHTML:{
    call() {
      return 'Below is the output of `(docsToHTML)`.\n\n'+(function convert(el) {
        if (!(el instanceof Element)) return el.nodeValue
        if (!el.firstChild) return ''
        let tag = el.tagName.toLowerCase(), suffix = ''
        let tag2 = ''
        if (tag === 'node') tag = 'code'
        if (tag === 'known') tag = 'b'
        if (tag === 'details') tag2 = tag, tag = 'blockquote', suffix = '<hr>'
        else if (el.parentNode && el.parentNode.tagName === 'DETAILS' && tag != 'summary')
          tag2 = 'blockquote'
        if (tag === 'space' || tag === 'span') tag = ''
        let start = tag ? `<${tag}>` : '', end = tag ? `</${tag}>` : ''
        if (tag2)
          start += `<${tag2}${tag2 === 'details' && el.open ? ' open' : ''}>`, end = `</${tag2}>` + end
        return `${start}${[...el.childNodes].map(convert).join('')}${suffix}${end}`
      })(docs())
    },
  },

  examples:{
    docs:`\`(examples)\`: Returns all available examples of usage of functions in a {(map … Function {(… {(Code ⇒ Becomes)} …)} …)} format.
All these are automatically tested to be correct at launch.`,
    philosophy:`Tests are a tool for seeing what needs to be fixed before commiting to a change.`,
    call(f) {
      if (_isArray(f)) error("Can only view examples of simple functions, not", f)
      const L = _langAt(), B = _bindingsAt()
      const transform = r => {
        if (!_isArray(r)) return
        r = r.map(a => {
          if (typeof a == 'string') return elem('div', stringToDoc(a))
          const env = call.env
          if (typeof a == 'function') { // If a function, it is an example generator.
            const to = elemValue(elemCollapse(() => {
              const b = a()
              const prev = call.env;  call.env = env
              try { return evaluator(['equals', b[0], b[1]], to) }
              finally { call.env = prev }
            }), a)
            return to
          }
          if (!_isArray(a)) throw "Examples must be arrays or comments"
          if (env && !env[_id(log)]) return a
          const from = parse(a[0], fancy, undefined, parse.dom)[1]
          const to = a[1] ? parse(a[1]) : elemCollapse(() => {
            const prev = call.env;  call.env = env
            try { return evaluator(parse(a[0]), to) }
            finally { call.env = prev }
          })
          return elem('div', [from, elem('span', '\n⇒ '), serialize(to, L, B, serialize.displayed)])
        })
        return elem('div', r.length != 1 ? r : r[0])
      }
      if (f !== undefined) return transform(defines(f, examples))
      const result = new Map
      _forEachGlobalDefining(examples, (v, r) => result.set(v, transform(r)), true)
      if (typeof document == ''+void 0) return result
      return hierarchy(result, elem('span', 'Code examples:'))
    },
  },

  future:{
    docs:`\`(future F)\`: Returns a list of things to be done about F.
\`(future)\`: Returns all known things to be done. Less than a third is usually done.`,
    nameResult:[
      `todo`,
    ],
    philosophy:`Through heedless difficulty, strength is gained.`,
    call(f) {
      if (_isArray(f)) error("Can only view futures of simple functions, not", f)
      if (f !== undefined) return defines(f, future)
      const result = new Map
      _forEachGlobalDefining(future, (v, r) => result.set(v, r))
      return result
    },
  },

  philosophy:{
    docs:`Unlike regular philosophy, this one stems only from computation.`,
    lookup:[
      `The only real way to understand something is to code it. Or do you think that humans are not intelligent creatures, and their words do not have unseen connections to the whole mind? No, a word is more than a thing, too foggy. The only way to understand learning is to be unable to learn and learn anyway.`,
      `There are things that do all other things. (Turing machines, particular logic systems like rewriting rules or category theory, functionalities of programming languages and their IRs; particular cellular automata, randomness-based program searches like evolution, general intelligences.)
Everything else about all of existence is a consequence. (Take a moment to think about everything that you have ever known and can know. No matter what it is, it was found.)

Widespread use of universal computers demonstrate this view's practicality. Attempts like the Wolfram Physics Project prove this view's viability as a complete theory of fundamental physics.
However, the difficulty is not that the view is non-obvious, it's that to feel it deep in your heart can be very hard (in other words, to find and connect and nurture an efficient implementation within humans is tricky, preventing adoption). To prove it more intuitively and without question, we must understand what constitutes a good user of a thing like a programming language.
Clearly, randomness is far far far far far too slow for practical applications. But we can do better. There's even a word for it: "arbitrary", to replace "random". We can do things like route differentiable computations through arbitrary programs to their predictions, and predict all numbers seen in user-space, to get more eyes in our brains, to let honesty and self-awareness guide us and become us. We don't even need large neural networks, just the prediction of everything, and then we can really begin to do interesting things.
Come on. Let's do it, inside this project. I'm excited.`,
      `Everything, nothing, and something. If "everything" is a thing that does everything, and the world is "everything", then "nothing" is exactly subversion of "something". While an "everything" is still a thing, "something", it behaves completely differently in the long term.

To approach the whole of existence given a thing, the only describable way is to deny the thing you have. To become smarter is to gain insight of the beyond, for no purity is eternal.
To actually reach the whole requires perfect precision. When you don't need insight nor fancy words to see things as they are.

If we were to look at human minds as things, then most people are "something" (often traditional and predictable), smart and artsy people worship "nothing" (often revolutionary and anti-culture), and very few people are "everything" (no often-true description is possible, they do and are what they want). But why would we do that? To explain is to create and impose a thing, another barrier to "nothing" and "everything". Just believe in people, while being a god and knowing everything that there can be. Be nice! It's the only way to replace their world with a better one, your own.`,
      `In the past, humans and all they imply were the only source of everything in their world, giving rise to civilizations far beyond the previous nature. But as they gain greater understanding of themselves, they gradually separate those now-artificial fragments out. The focus shifts from humans and individuals and gatherings to skills and ideas and concepts. But without infinite self-improvement, which no software system currently has (only its effects), the minds of those who intertwine with software rot. Self-improvement is included in perfect generality, and the efficiency of non-general learning can be leveraged in generality by threading filaments to predictions. Let's see what we can do to make learnable scaffolding easy to use.`,
      `The built-in human emotions and personality framework is filled with predictability, inefficiency, exploits, and false dependencies. But it also has general intelligence in there. Find it, and reroute as much of the primary data loop (consciousness/identity/personality) as is possible through that infinite willpower. Most things that humans are and do are far from general intelligence, so, break them down then build them up.`,
      `AI is humanity's shadow and continuation, not of humans and individuals. Every gradual change from animals to humans, like shift to precise computers or exponential-ish technology progress, or equal opportunity of the same computational base and trust that spawns from that, or perfect internal honesty and self-awareness of each part, is exactly like AI; there is no need for AI to actually exist to affect everything about humanity.`,
      `\`m:(map) (last (transform \(mapWrite m ? (elem 'div' (stringToDoc (defines ? philosophy)))) (refd philosophy)) (hierarchy m))\``,
    ],
  },

  await:{
    docs:`\`(await MaybePromise)\`: waits for the promise to finish before continuing evaluation.`,
    _cancel(p) {
      if (p && typeof p.cancel == 'function') p.cancel()
    },
    lookup:{
      delay:__is(`delay`),
      parseURL:__is(`parseURL`),
    },
    call(awaitable) {
      if (!_isPromise(awaitable)) return awaitable
      if ('result' in awaitable) return awaitable.result
      _promiseReEnter.promise = awaitable
      _causeInterrupt(awaitable, _promiseReEnter)
    },
  },

  _promiseReEnter(expr, env, then) {
    // Re-schedule interpretation when the promise returns.
    _jobs.limbo.push(expr, env, then)
    const p = _promiseReEnter.promise
    p.then(
      r => (p.result = r, _jobResume(expr, env, then)),
      r => (p.result = _errorRepr(r), _jobResume(expr, env, then)))
    call.env[_id(await)] = p
  },

  _jobResume(expr, env, then) {
    env[_id(await)] = undefined
    const a = _jobs.limbo
    for (let i = 0; i < a.length; i += 3)
      if (a[i+1] === env)
        return a.splice(i,3), _schedule(expr, env, then)
  },

  delay:{
    docs:`\`(delay)\` or \`(delay Value)\`: Just a function for testing promises. It should have no effect on evaluation.`,
    nameResult:[
      `delayed`,
    ],
    examples:[
      [
        `(delay 1)+(delay 2)`,
      ],
      [
        `(delay 1)*(delay 3)+(delay 4)*(delay 5)`,
      ],
    ],
    await:true,
    call(x = 12) { return new Promise(then => setTimeout(then, 5000 + 1000 + Math.random()*4000, x)) },
  },

  jsRejected:{
    docs:`\`jsRejected Reason\`: throws an exception.`,
    call(err) { throw err },
  },

  _errorRepr(err) {
    // Convert a caught error to its displayable representation.
    if (err instanceof Error)
      return err.stack ? [jsRejected, elem('error', String(err)), _resolveStack(err.stack, 0)] : [jsRejected, elem('error', String(err))]
    else if (!_isError(err))
      return [jsRejected, err]
    else
      return err
  },

  _schedule:{
    docs:`\`(_schedule Expr Env Then)\`⇒JobId: schedule an expression for evaluation, with an environment (defining where its logging should go to, and its current variables, read/write journals, and more; use _newExecutionEnv() for this) and a native function for continuation.
This is a low-level primitive that a user can indirectly interact with. Sub-job scheduling must be implemented in-job, to deny resource denial.`,
    lookup:{
      cancel:__is(`_cancel`),
      jobs:__is(`_jobs`),
    },
    call(expr, env, then) {
      // Call this to initiate a later evaluation of an expression; the callback will be called with the result.
      if (then && typeof then != 'function') throw "Expected a function continuation"
      for (let i = _jobs.begin; i < _jobs.expr.length; i += 3) // Don't add the same job twice.
        if (_jobs.expr[i] === expr && _jobs.expr[i+1] === env && _jobs.expr[i+2] === then) return
      if (!_jobs.running && _jobs.expr.length <= _jobs.begin) setTimeout(_jobs, 0)
      if (env[_id(_schedule)] === undefined)
        env[_id(_schedule)] = _newJobId()
      _jobs.expr.push(expr, env, then)
    },
  },

  _cancel:{
    docs:`\`(_cancel JobEnv)\`: if the job is scheduled to run, cancels it. Returns true (or the job if the second arg is true) if cancelled, false if not.
If any promises the job depends on have a method .cancel, calls those.`,
    call(env, returnJob = false) {
      Object.keys(env).forEach(k => {
        const conc = concept.idToKey[+k]
        if (defines(conc, _cancel)) env[k] = void defines(conc, _cancel)(env[k])
      })

      let a = _jobs.expr
      for (let i = 0; i < a.length; i += 3)
        if (a[i+1] === env) {
          if (returnJob) return a.splice(i, 3)
          return a.splice(i, 3), true
        }
      a = _jobs.limbo
      for (let i = 0; i < a.length; i += 3)
        if (a[i+1] === env) {
          if (returnJob) return a.splice(i, 3)
          return a.splice(i, 3), true
        }
      return false
    },
  },

  _newJobId(i) {
    // Allocates a new job ID (for _schedule), or de-allocates a finished job's ID.
    if (!_newJobId.ID) _newJobId.ID = [0]
    const ID = _newJobId.ID
    if (typeof i == 'number')
      i !== ID[0]-1 ? ID.push(i) : --ID[0]
    else
      return ID.length > 1 ? ID.pop() : ID[0]++
  },

  _doJob(expr, env, then) {
    // One iteration of the interpreter loop.
    const microstart = env[_id(realTime)] = _timeSince()

    // Cancel invisible jobs.
    if (env[_id(log)] && !_isArray(env[_id(log)]) && !env[_id(log)].parentNode) return

    call.env = env, call.depth = 0
    _checkInterrupt.step = 0 // So that a step always happens even if we immediately interrupt to step through execution.
    interrupt.started = microstart // So that we can interrupt on timeout.
    _jobs.reEnter = true // So that code can specify custom `_schedule` overrides.
    let v, interrupted = false

    if (typeof document != ''+void 0 && env[_id(_checkInterrupt)] !== undefined)
      _highlightOriginal(env[_id(_checkInterrupt)], false)
    if (typeof document != ''+void 0 && _isArray(env[_id(log)]))
      env[_id(log)] = env[_id(log)][0].nextSibling, env[_id(log)].previousSibling.remove()
    try {
      v = call(expr)
      _saveReplay(expr, env)
    }
    catch (err) {
      if (err === interrupt) interrupted = true
      else v = _errorRepr(err)
    }
    if (typeof document != ''+void 0 && interrupted && env[_id(_checkInterrupt)] !== undefined) {
      // Highlight the last-executed expr.
      _highlightOriginal(env[_id(_checkInterrupt)], true)
      // TODO: …Should we just not highlight anything, since we removed `_cameFrom`?…
      // ##########################
    } else env[_id(_checkInterrupt)] = undefined

    call.env = env
    env[_id(userTime)] += _timeSince(env[_id(realTime)])

    if (_isPromise(v)) _promiseReEnter.promise = v, _jobs.reEnter = _promiseReEnter, interrupted = true
    if (interrupted) // Re-schedule.
      _jobs.reEnter === true ? _schedule(expr, env, then) : (_highlightOriginal(env[_id(_checkInterrupt)], false), _jobs.reEnter(expr, env, then))
    else // We have our result.
      try { _newJobId(env[_id(_schedule)]);  then && then(v) } catch (err) { console.error(err) }
  },

  _jobs:{
    docs:`The interpreter loop. Use _schedule to do stuff with it.`,
    lookup:{
      _maxUsageOfCPU:__is(`_maxUsageOfCPU`),
    },
    Initialize() {
      _jobs.expr = [], _jobs.limbo = []
      _jobs.begin = 0
    },
    call() {
      const DOM = typeof document != ''+void 0
      if (DOM && !_jobs.display) _jobs.display = _throttled(_jobsDisplay, .1)
      if (_jobs.expr.length) {
        let start = _timeSince(), end = start + (typeof process == ''+void 0 || !process.hrtime || !process.hrtime.bigint ? 10 : BigInt(100 * 1000))
        if (!_jobs.duration) _jobs.duration = 0

        _jobs.running = true

        // Execute while checking for end.
        if (_jobs.indicator) _jobs.indicator.classList.toggle('yes', true)
        let jobs = _jobs.expr
        _jobs.begin && jobs.splice(0, _jobs.begin), _jobs.begin = 0
        do { _doJob(jobs[_jobs.begin++], jobs[_jobs.begin++], jobs[_jobs.begin++]) }
        while (_jobs.begin < jobs.length && _timeSince() < end)
        jobs.splice(0, _jobs.begin), _jobs.begin = 0
        _jobs.duration = _timeSince(start)
        _jobs.running = false
      }
      call.env = undefined
      if (DOM) {
        if (_jobs.expr.length) _jobsResume(Math.min(_jobs.duration / _maxUsageOfCPU[1] - _jobs.duration, 1000))
        _jobs.display(_jobs.indicator)
      } else if (_jobs.expr.length)
        _jobsResume()
      // _jobs.expr (Array), _jobs.limbo (Array), _jobs.duration (Number), _jobs.reEnter (true or a _schedule-replacing function), _jobs.indicator
    },
  },

  _jobsResume(delay) {
    delay === false && _jobs.indicator && _jobs.indicator.classList.toggle('yes', false)
    if (_jobs.expr.length) setTimeout(_jobs, delay || 0)
  },

  _jobsDisplay(el, n = _jobs.expr.length>>>2) {
    // Creates a <div> inside el for every existing job.
    let ch = el.firstChild || el.appendChild(document.createElement('div')), i = 0
    for (; i < n; ++i, ch = ch.nextSibling || el.appendChild(document.createElement('div')))
      ch.style.setProperty('--turns', -i/n + 'turn')
    for (; i = ch && ch.nextSibling, ch; ch = i) el.removeChild(ch)
    el.title = el.title.replace(/[0-9]+/, n)
    if (!n) el.classList.toggle('yes', false)
  },

  _highlightOriginal(expr, working) {
    // Add (or remove) .working to DOM elements responsible for expr.
    let arr = elemValue(undefined, expr), i = 0
    while (!arr && i < 16) {
      if (_cameFrom.m && _cameFrom.m.has(expr) && _cameFrom.m.get(expr) !== expr)
        expr = _cameFrom.m.get(expr), arr = elemValue(undefined, expr), ++i
      else break
    }
    if (arr) arr.forEach((el, i) => i < 16 && el.classList.toggle('working', working))
  },

  _newExecutionEnv(basedOn = null, logBefore = null, langIs = fancy, bindsAre = Self.ctx) {
    // Creatse a new execution env.
    // Don't ever re-use the same env in _schedule, use this instead.
    const e = Object.create(null)
    e[_id(log)] = logBefore
    e[_id(_langAt)] = langIs
    e[_id(_bindingsAt)] = bindsAre
    basedOn && Object.assign(e, basedOn)

    e[_id(label)] = _allocMap()
    e[_id(_schedule)] = undefined

    e[_id(call)] = 0 // The func call depth when we interrupted.
    e[_id(interrupt)] = undefined // Full execution state when we interrupted.
    e[_id(_checkInterrupt)] = undefined // The cause of interrupt (an executable node).
    e[_id(step)] = 0
    e[_id(_pausedToStepper)] = undefined // Max func call depth at which we'll interrupt.
    e[_id(await)] = undefined // The promise that we are waiting on.

    e[_id(impureLoad)] = undefined // Index≥0 into impure tape to recall; count<0 of saves to skip, undefined to check non-recording, null to save.
    e[_id(impureSave)] = undefined // Replay tape for impure results.

    e[_id(adjustSave)] = undefined // Stack of arrays of results that adjustment would need.
    e[_id(adjustLoad)] = undefined // Stack of arrays of results that adjustment needs.

    e[_id(userTime)] = 0 // CPU time spent on this job.
    e[_id(realTime)] = undefined // The timestamp of when we last started executing this job.
    Object.seal(e)
    return e
  },

  last:{
    docs:`\`a,b,c\` or \`(last …Expressions)\`: returns the last result (the first error or else the last non-error result).
In Scheme, this is called \`begin\`.`,
    nameResult:[
      `lastOf`,
      `result`,
    ],
    _resultCanBe(x) { _resultCanBe(x[x.length-1]) },
    call(...r) {
      // We shuffle in neither `call` nor compilation, so we can just do this:
      return r[r.length-1]
    },
  },

  rest:{
    docs:`\`(rest Array)\` or \`…Array\`: when statically used in an array, spreads the \`Array\` into the referencing array. Is a UI convenience.`,
    call(a) { return [rest, a] },
  },

  false:false,

  true:true,

  quote:{
    docs:`\`(quote Expr)\` or \`^Expr\`: A special form that returns \`Expr\` unevaluated, quoting the exact object.

Makes it easy to insert a reference to any object when generating a program, don't you think so, you cute rascal?
But I know what you're really thinking: "arrays with heads that define \`construct\` will still be constructed by \`makeGraph\`, which is called by \`parse\`, so not all objects can be preserved as-is". That is a lot of specific knowledge; how did you come across that? Anyway, good thing that generation doesn't go through \`parse\`, then.`,
    examples:[
      [
        `(quote x)`,
        `x`,
      ],
    ],
    nameResult:[
      `quoted`,
      `exactly`,
    ],
    argCount:1,
    call(x) { // Value ⇒ Expr
      // Create the `(quote Expr)` representation if needed.
      return _isArray(x) || x === input ? [quote, x] : x
    },
  },

  label:{
    docs:`\`Name\` or \`(label "Name")\`, or \`?\` or \`(label)\`: represents a variable that can be bound or assigned.
Equal-name labels are bound to the same thing within the same binding. Each unnamed label is unique.
Evaluating a bound label results in its value, in the current function call. Evaluating an unbound named label results in an \`(error)\`.`,
    examples:[
      [
        `a a:1`,
        `1`,
      ],
      [
        `a a 1 a a a:0`,
        `0 0 1 0 0`,
      ],
      [
        `^a a:(0 (a) a)`,
        `a a:(0 (a) a)`,
      ],
      [
        `^(sum \`x\` 1)`,
        `^(sum x 1)`,
      ],
    ],
    nameResult:[
      `x`,
      `y`,
      `z`,
      `w`,
      `a`,
      `b`,
      `c`,
      `d`,
      `variable`,
    ],
    call(name) {
      if (!label.s) label.s = Object.create(null), Object.freeze(label)
      return label.s[name] || (label.s[name] = [label, name]) // Never collects garbage.
    },
  },

  _isLabel(v) { return _isArray(v) && v[0] === label && typeof v[1] == 'string' && v.length == 2 },

  _unknown:{
    docs:`\`(_unknown Expr)\`: denotes that \`Expr\` is dependent on unknown factors and cannot be evaluated now, so it has to be deferred.`,
    argCount:1,
    call(x, reason) {
      if (_isArray(x) && x[0] === _unknown) return x
      const a = _allocArray()
      return a.push(_unknown, x), a
    },
  },

  _isUnknown(v) { return _isArray(v) && v[0] === _unknown },

  _isPromise(v) { return v instanceof Promise },

  _notFound:{
    docs:`A marker for signifying the not-found state.`,
  },

  _limitMapSize(m, n) {
    if (m.size > n) // Delete the first (least-recently-added) element.
      try { _deleteFirstMapElement.n = m.size-n;  m.forEach(_deleteFirstMapElement) }
      catch (err) { if (err !== null) throw err }
  },

  _deleteFirstMapElement(_v,k,m) { m.delete(k); if (!--_deleteFirstMapElement.n) throw null },

  _id:{
    docs:`Return the unique integer index of an object/value, possibly newly given.`,
    call(x, readonly = false, indexes = undefined) {
      if (indexes instanceof Map && indexes.has(x)) return indexes.get(x)
      if (!_id.xToIndex) _id.xToIndex = new Map, _id.n = 0, _id.sym = Symbol('_id')
      try {
        if (x && (typeof x == 'object' || typeof x == 'function')) {
          if (x[_id.sym] !== undefined) return x[_id.sym]
          if (!readonly) return x[_id.sym] = _id.n++
          else return
        }
      } catch (err) {}
      const m = _id.xToIndex
      if (m.has(x)) return m.get(x)
      if (!readonly) {
        let n
        m.set(x, n = _id.n++)
        _limitMapSize(m, 1000000)
        return n
      }
      // _id.xToIndex (a Map from x to result), _id.n (the next index to allocate), _id.sym (a key for the index)
    },
  },

  Random:{
    docs:`Some functions for random number generation.`,
    lookup:{
      nat:__is(`randomNat`),
      prob:__is(`randomProb`),
    },
  },

  randomNat:{
    docs:`\`(randomNat Nat)\`: Picks a random non-negative integer less than \`Nat\`, from a uniform distribution.
An interface to JS's crypto.getRandomValues for generating random numbers on-demand as opposed to in-batches, optimizing to request the least amount of random bits required.`,
    examples:[
      [
        `Random.nat 1`,
        `0`,
      ],
    ],
    nameResult:[
      `random`,
      `nat`,
      `int`,
    ],
    argCount:1,
    call(n) {
      if (_isArray(n)) n = _pickCount(n)

      if (n !== (n>>>0))
        throw 'Expected uint32 as limit of randomness'
      if (n === 0) return _randomBits(0)
      if (n === 1) return 0
      if (!(n & (n-1))) return _randomBits(_countBits(n))

      let i=0, q0=0, q1=0;
      if (randomNat.oldn === n) i = randomNat.oldi, q0 = (1 << i) % n;
      else {
        i = _countBits(n) + 1, q0 = (1 << i) % n, q1 = 2*q0, q1>=n && (q1-=n);
        "Expected bit-cost of i: i / (1 - (2**i)%n/(2**i)). Seek while next is less."
        while (true) {
          if (i >= 32) { i = 32; break }
          'These are tricks to express comparisons by that formula in int arithmetic.'
          if (i <= 15) {
            if ((1<<(2*i+1)) <= ( q1*(i<<i) - q0*((i+1)<<(i+1)) )) break;
          } else if (i <= 20) {
            if ((1<<(2*i-9)) <= ( q1*(i<<(i-9)) - q0*((i+1)<<(i-8)) )) break;
          } else if (i <= 25) {
            if ((1<<(2*i-19)) <= ( q1*(i<<(i-19)) - q0*((i+1)<<(i-18)) )) break;
          } else {
            if (i*(1-(2*2**i)%n/(2*2**i)) <= (i+1)*(1-(2**i)%n/(2**i))) break;
          }
          ++i, q0 = q1, q1 *= 2, q1>=n && (q1-=n);
        }
        randomNat.oldn = n, randomNat.oldi = i;
      }
      q1 = (i < 32 ? 1 << i : 2 ** i) - q0;
      do { q0 = _randomBits(i & 31) } while (q0 >= q1);
      return q0 % n
      // .oldn, .oldi
    },
  },

  randomProb:{
    docs:`\`(randomProb Probability)\`: Returns true with probability p, else false.
Equivalent to JS 'Math.random() < p' with checks on p (it should be 0…1), but (probably) faster.`,
    nameResult:[
      `passed`,
      `isOk`,
      `bool`,
    ],
    argCount:1,
    call(p) {
      if (typeof p != 'number') throw 'Expected a number'
      if (p < 0) throw 'Probability is too low: '+p;
      if (p > 1) throw 'Probability is too high: '+p;
      if (p !== p) throw 'Probability is NaN';
      if (p === 1) return true;
      while (true) {
        const n = Math.floor(p *= 16);
        if (p === n) { // No more precision left; decide now. Special cases of the `r < n` resulting check below.
          if (!n) return false; // 0000
          if (n === n >> 3 << 3) return !_randomBits(1); // 8 — ?000
          if (n === n >> 2 << 2) return _randomBits(2) < (n >> 2); // 4, 12 — ??00
          if (n === n >> 1 << 1) return _randomBits(3) < (n >> 1); // 2, 6, 10, 14 — ???0
        }
        const r = _randomBits(4);
        if (r !== n) return r < n; // ????
        else p -= n; // 1/16 chance of continuing computation.
      }
      // Generating (up to) 4 bits at a time is not based on past performance measures, or anything.
      // Using 4 bits at a time consumes on average about double the bits that using 1 bit at a time would, but should be much faster.
    },
  },

  _countBits(n) { let x=0; while (n >>>= 1) ++x;  return x },

  _randomBits(n) { // Returns n || 32 random bits.
    if (impureHave()) return impureLoad()
    if (n !== (n & 31)) throw impureSave(new Error('Expected 0…31 bits to generate (where 0 is 32), got '+n))
    if (!n) {
      if (!_randomBits.a)
        Object.assign(_randomBits, { a:new Uint32Array(1024), pos:1024 })
      if (_randomBits.pos >= _randomBits.a.length) _randomBits.pos = 0, _randomFill(_randomBits.a);
      return impureSave(_randomBits.a[_randomBits.pos++])
    }
    if (_randomBits.n === void 0) _randomBits.r = _randomBits.n = 0;
    let r = 0;
    if (n > _randomBits.n) r = _randomBits.r, n -= _randomBits.n, _randomBits.r = _randomBits(0), _randomBits.n = 32;
    r = (r << n) | (_randomBits.r & ((1 << n) - 1)), _randomBits.n -= n, _randomBits.r >>>= n;
    return impureSave(r)
  },

  _randomFill(buf) { // Fills a u/int-array or array-buffer with random data.
    buf = new Uint8Array(buf.buffer || buf);
    let bytes = buf.byteLength
    if (typeof crypto!==''+void 0 && crypto.getRandomValues) {
      const quota = 65536, n = Math.floor(bytes/quota);
      let src = n && new Uint8Array(quota), i;
      for (i = 0; i < n; ++i)
        crypto.getRandomValues(src), buf.set(src, i*quota);
      src = new Uint8Array(bytes - n*quota);
      crypto.getRandomValues(src), buf.set(src, n*quota);
    } else
      for (let i = 0; i < buf.length; ++i)
        buf[i] = (Math.random() * Math.pow(2,32)) >>> 0;
    return buf;
  },

  call:{
    tutorial:[
      `Do you know how easy it is to make an interpreter of the DAG IR we use? Let's see.

To be clear, the intermediate representation (IR) in question is "doing a thing may depend on having done other things; function applications are arrays, functions are first elements in them, and dependencies are references in those arrays".

First, a very simple interpreter of trees, where no nodes (arrays) are shared. To evaluate an array, we want to \`apply\` the \`transform\`ed-with-evaluation array; non-arrays (\`select\` where \`_isArray ?\` returns \`false\`) should be returned as-is. Would you kindly compose composition out of these, please?`,
      [
        __is(`fancy`),
        '',
        function(fn) {
          // It's easier to write the interpreter than to pattern-match these cases.
          if (typeof fn != 'function') return
          const ins = [5, [add, 1, 2], [add, [mul, [add, 4, 6], 10], [div, 10000, 100]]], outs = [5, 3, 200]
          const env = _newExecutionEnv()
          return {
            then: then => void _schedule([transform, fn, quote(ins)], env, got => {
              if (!_isArray(got) || got.length != 3) then(false)
              then(outs.every((o,i) => got[i] === o))
            }),
            cancel() { _cancel(env) },
          }
        },
      ],
      `The intended solution was: \`eval eval:\\(select (_isArray ?) \\(apply (transform eval ?)) \\? ?)\`.
On desktop, you can type out just the function without binding to \`eval\`, then put your cursor where the function goes to \`transform\`, then hover over the function and Control-click it.
Also, do you not like the syntax? Then change it. Your world, your rules. Summon the context menu on \`_fancyOutermost\`, find its rewrite editor, edit it (don't forget to press Enter), then expand the next rewrite.

A real interpreter would also handle \`quote (1 2 3)\`, and a real interpreter of inside-a-function would also handle \`input\`. These are trivial enough to handle, so here, care not.

Instead, care about shared nodes. A node should remember its result. A \`map\` can remember keyed-by-node results, so here is a simple scheme: have \`m:{}\`, and return \`(mapRead m Node)\` if it does not equal \`_notFound\`, else return \`(mapWrite m Node …?)\`.
Can you see the unhandled cases?
`,
      [
        __is(`fancy`),
        '',
        function(fn) {
          // No solution awaits you. Don't learn by imitating, learn by doing.
          // The ability to just do it is in everyone, and you can do whatever you want to too.
          let n = 0
          const f = () => { ++n }
          const node1 = [f]
          if (typeof fn != 'function') return
          const env = _newExecutionEnv()
          return {
            then: then => void _schedule([fn, [last, node1, [f], node1, node1]], env, () => then(n === 2)),
            cancel() { _cancel(env) },
          }
        },
      ],
      `You are correct. Cycles would loop forever, and functions that share nodes (such as in recursion) will only evaluate them once.
The former can be fixed by pre-storing the marker value "we are computing this node, do not rely on its results". The latter can be fixed by having the reference to the current map be mutable, and set/reset on function entry/exit.

We're not instantly making production-quality code here, so you can be more relaxed than a bat hanging off a perch. If you reached this legitimately, then I'm so happy for you.

Talk time.

Why is it so hard to do the most trivial things? Are you unused to reinventing the most basic things; maybe confused on why anyone would ever want to do that?
Basic things are foundations for everything else, and even minor changes in a base can mean arbitrarily big large-scale differences. The most obvious case is when it doesn't work or has a bug that needs to be worked around, but even little differences like "what order do we evaluate dependencies in" or "do we drop unneeded dependencies (and/or evaluate lazily)" or "do we do tail-call optimization, and do we have loops" need programs to adapt to that.
There can be an urge to just go with what is learned over life's course, and effectively put the bases you've learned to create one super-base, but there is never just one thing that is the best for all cases ever, and that applies to foundations too. Infinity cannot be "worked around", so face it head-on.

Now, why our particular DAG IR? Programs are straightforward to generate with it: while knowing the EXACT computation that produces a value, we can just create an array to signify a call with that value. Neither manipulating characters nor juggling variable scopes is required! Only pointer manipulation, same for both humans and machines.

And, if it was this simple for us to come up with an interpreter, then it's just as easy for generated programs to come up with an interpreter (and with proper partial evaluation, there shouldn't even be any inherent cost in doing so, though \`mapWrite\` doesn't support it out-of-the-box). The fact that this sits on top of relatively complicated parsing and object-construction and visualization and other mechanisms doesn't really matter to users, whether human or otherwise. Extensibility by implementation.

Well, no more words. Goodbye, and take care.
`
    ],
    docs:`\`call ^(Func …Args)\`: \`call\`s all sub-items, then applies the first value (the function) to the rest of values.
Defining this allows function application. In fact, \`F:(function …)\` is the same as \`(concept {call F})\`.
Computation cycles are disallowed, and every node's value (array's value) is only computed once.


All languages, and everything that does stuff, must have an internal representation (IR) of arbitrary computations.

We chose our IR to be lambda-calculus-like: very simple and direct. But by itself, unlike Lambda calculus, our IR does not have closures, and needs a separate function to make them. This allows representing what actually happens in the machine more closely.
(We don't directly provide even closures. An equivalent effect can be achieved with arrays/objects anyway. Compilers could gain more from doing more search, even of seeming fundamentals: for example, partially-evaluate long-existing closures.)

Another difference is that our IR has no variable bindings, choosing to share nodes instead. This makes it easy to generate and inspect programs.

It's simple so that it's easy to extend. Adding partial evaluation? Parallel execution? Compilation to a different target? Self-modification? Simplicity itself, my friend. I'd extend it myself, but I want to use machine learning on these for optimal results, which is not trivial right now. But maybe I can work to make it more trivial to use?
`,
    philosophy:`Programming languages are typically geared towards creating an abstraction layer that's convenient for humans to understand and use. Even Lisp has macros. Something so direct as this IR is unusual outside of machine code. Why would it be wanted?

It's for machines as much as it is for humans. If we can come up with a method of general learning that's as good as this IR could directly allow, then its intelligence is equal to humans'.
And, it's universal, and so can represent any computation, any doing of stuff, any other IR, and any other method of learning. General learning on even the simplest IR is general intelligence. The most obscure property of intelligence, self-modification? Learnable too.

In machine learning, The Bitter Lesson (as explained by the founder of reinforcement learning, Richard Sutton) is that compute reigns supreme over hand-engineered features in the end. Applied to programming languages, this means that a simple IR is sufficient. Lose all features but gain the world, assuming that learning has matured to be practical enough.

What is programming? Here, it's composition of functions: a tree of sequences of choices of what to be doing.
Sometimes they are annotated with types, and there is only one or a few choices; often, it's a huge mostly-worthless space.
Random and local and population-based searches won't do well.
Bayesian optimization needs simple constraints. But not only are our choices hierarchical, but they may well depend on nearby compositions.
Transformers on program text (from observations to Turing-complete choices, learning to predict the best sequence via trying several sequences and picking the best one)? And what will you do when it fails? It doesn't guarantee precision. Call it personal preference if you want, but I don't like this one.
Deep reinforcement learning? …Yes, it could work. With enough tricks from machine learning, with a good enough routing of differentiable information.
AGI may be possible with modern science, but isn't trivial at all. But I like a challenge.

...

…I've been asked why I don't like the Transformer (where CPU communication is almost not required, so training/inference speed is much higher) architecture by itself.
Its current uses follow the "learn output sequence from input sequence directly". If you want originality, don't live to repeat others!
I've known humans that rely on being like that for their daily life.
They're often unable to quickly internalize novel viewpoints, and at best repeat my words when I introduce something new (at worst, if I'm not hitting the meaningless style and terminology just right, then I'm ignored entirely). Learning foundations instead of their consequences is an alien lifeform to them, and they're amazed by how little mistakes I make once I know stuff and how much I know. Sometimes, I see that they have original viewpoints, but when they share their inspirations, their views turn out to be a banal mix of interesting things they've seen. Maybe I just prefer a world where everyone is right in a different way, to a world where everyone is wrong if you dig deep enough.
It's much more efficient to learn to repeat rather than understand, so the whole human society is like this.`,
    lookup:{
      quote:__is(`quote`),
      apply:__is(`apply`),
      func:__is(`func`),
      select:__is(`select`),
      last:__is(`last`),
      Constructions:__is(`Constructions`),
    },
    nameResult:[
      `result`,
    ],
    call(x) {
      // This is an interpreter of DAGs, the most powerful IR.
      // First, we handle purification and "I'm not a computation" and "I don't want to be a computation".
      if (call.pure) return purify(x)
      if (!_isArray(x)) return x
      if (x[0] === quote) return x[1]

      // Don't forget to be interrupt-friendly!
      let [i = 0, outputs = _allocArray(), po, inds, rc] = interrupt(call)

      // Evaluating inputs with recursion leaves ugly stack traces in errors, so we iterate over the post-order traversal instead.
      if (!po) [po, inds, rc] = _postorderAndIndexesAndRefs(x)
      outputs.length = po.length
      const collected = _allocArray()
      try {
        for (; i < po.length; ++i) {
          // Go through all nodes in the DAG, collect args, and apply functions.
          collected.length = inds[i].length
          for (let j=0; j < collected.length; ++j) {
            const ind = inds[i][j], dep = po[i][j]
            if (dep === input) error("`input` only has meaning in `func`, but found it in", po[i])
            collected[j] = ind !== null ? outputs[ind] : _isArray(dep) ? dep[1] : dep
            if (j === 0 && typeof collected[0] != 'function')
              error("Expected a function, got", collected[0])
          }
          outputs[i] = collected[0].call(...collected)
        }
        const result = outputs[po.length-1]
        outputs[po.length-1] = undefined, outputs.forEach(dispose)
        _allocArray(po), inds.forEach(_allocArray), _allocArray(inds), _allocArray(rc)
        return result
      } catch (err) {
        if (err === interrupt) interrupt(call, _tmp().length=0, _tmp().push(i, outputs, po, inds, rc))
        throw err
      } finally { _allocArray(collected) }
      // .env (current execution environment), .depth (current call depth), .pure.
    },
  },

  apply:{
    docs:`\`apply ^(Func …Args)\`: assuming that \`Func\` and \`Args\` are already evaluated, simply applies the function to arguments.`,
    call(x) {
      if (typeof x[0] != 'function')
        error('Expected a function to call, got', x[0])
      return x[0].call(...x)
    },
  },

  Constructions:{
    docs:`Arrays are a good way of representing graphs. But not all runtime objects are arrays. The functions here allow encoding objects in arrays.`,
    lookup:{
      make:__is(`make`),
      makeGraph:__is(`makeGraph`),
      construct:__is(`construct`),
      deconstruct:__is(`deconstruct`),
      concept:__is(`concept`),
      map:__is(`map`),
    },
  },

  make:{
    docs:`\`make Construct …Args\`: Creates one construct when called.
Cycles are impossible to create using only this.`,
    call(...x) {
      const obj = construct(x)
      construct(x, obj)
      return obj
    },
  },

  makeGraph:{
    docs:`\`makeGraph Expr\`: Turns an array graph into an array/object graph, in place.`,
    future:`Make this, \`parse\`, and all their uses interrupt-proof.`,
    call(x) {
      const env = _allocMap() // original —> constructed|original
      const unfinished = new Set // Whether we have not constructed a node yet.
      x = walk(x)
      _allocMap(env)
      return x

      function walk(x) {
        if (!_isArray(x)) return x
        if (env.has(x)) return env.get(x)
        if (!_isArray(x[0]) && defines(x[0], construct))
          env.set(x, construct(x)), unfinished.add(x)
        else
          env.set(x, x)
        for (let i = 0; i < x.length; ++i)
          x[i] = walk(x[i])
        if (env.get(x) !== x) {
          // To allow user-defined constructs, construct all (acyclic) potential dependencies then construct us.
          for (let i=0; i < x.length; ++i)
            if (unfinished.has(x[i]))
              error('User-defined constructs must not depend on their instances, as happened in', x[i])
          construct(x, env.get(x))
          unfinished.delete(x)
          return env.get(x)
        }
        return x
      }
    },
  },

  construct:{
    docs:`\`construct(x)—>obj / construct(x, obj)\`: To encode non-array objects in array graphs, a global defines this.
Globals and user-defined concepts that statically define this are constructed.

This embodies a simple principle: a graph cannot be constructed without backpatching.
(While this can be used to implement Lisp-like macros, please call quoted code or apply functions instead. \`construct\` is for non-array objects.)`,
    call(x, obj = undefined) {
      if (_isArray(x)) {
        if (typeof defines(x, construct) == 'function')
          x = defines(x, construct)(x, obj)
        return x
      }
      if (x instanceof Map)
        !(obj instanceof Map) && error('Expected a map, got', obj),
        x.clear(), obj.forEach((v,k) => x.set(k,v))
      return x
    },
  },

  tensor:{
    docs:`\`tensor Data Shapes Type\`: \`construct\`s a multi-dimensional array of numbers.`,
    construct(x, obj) {
      if (obj === undefined) {
        let [_, data, shapes, t] = x
        if (!data) error("Expected data, got", data)
        if (shapes !== undefined && !_isArray(shapes)) error("Expected an array or nothing, got", shapes)
        const dtype = t===f32 || t===undefined ? 'float32' : t===i32 ? 'int32' : null
        if (!dtype) error("Expected", f32, "or", i32, "or nothing, got", t)
        if (typeof data == 'string')
          data = dtype === 'float32' ? new Float32Array(_fromBase64(data).buffer) : new Int32Array(_fromBase64(data).buffer)
        return tf.tensor(data, shapes, dtype)
      }
    },
  },

  _toBase64(typedArray) { // -> base64
    const bytes = new Uint8Array(typedArray.buffer)
    const arr = [];  arr.length = bytes.length
    for (let i=0; i < arr.length; ++i)
      arr[i] = String.fromCharCode(bytes[i])
    return btoa(arr.join(''))
  },

  _fromBase64(base64) { // -> bytes
    const str = atob(base64)
    const bytes = new Uint8Array(str.length)
    for (let i=0; i < str.length; ++i)
      bytes[i] = str.charCodeAt(i)
    return bytes
  },

  deconstruct:{
    docs:`\`(deconstruct Object)\`: turn an object into its array-representation (that could be evaluated to re-create that native value).`,
    call(v, allowPath = false) {
      if (defines(v, deconstruct)) return defines(v, deconstruct)
      else if (_isArray(v)) return _isArray(v[0]) || defines(v[0], construct) === undefined ? v.slice() : [arrayObject, ...v]

      if (typeof tf != ''+void 0 && v instanceof tf.Tensor) {
        const data = serialize.styles ? Array.from(v.dataSync()) : _toBase64(v.dataSync())
        if (v.dtype === 'float32' && v.shape.length <= 1)
          return [tensor, data]
        if (v.dtype === 'float32')
          return [tensor, data, v.shape]
        return [tensor, data, v.shape, v.dtype==='int32' ? i32 : error("Unrecognized dtype:", v.dtype)]
      }

      if (Object.getPrototypeOf(Object.getPrototypeOf(v)) === Object.getPrototypeOf(Int8Array.prototype)) {
        if (v instanceof Int8Array)
          return [i8, Array.from(v)]
        if (v instanceof Int16Array)
          return [i16, Array.from(v)]
        if (v instanceof Int32Array)
          return [i32, Array.from(v)]
        if (v instanceof Uint8Array)
          return [u8, Array.from(v)]
        if (v instanceof Uint16Array)
          return [u16, Array.from(v)]
        if (v instanceof Uint32Array)
          return [u32, Array.from(v)]
        if (v instanceof Float32Array)
          return [f32, Array.from(v)]
        if (v instanceof Float64Array)
          return [f64, Array.from(v)]
      }

      if (allowPath && lookup.parents.has(v)) {
        const p = lookup.parents.get(v)
        if (defines(p, lookup))
          for (let k of lookup(p))
            if (lookup(p, k) === v) return [lookup, p, k]
        if (_view(p))
          for (let k of Object.keys(_view(p)))
            if (k !== _id(deconstruct) && _view(p)[k] === v)
              return [defines, p, concept.idToKey[+k]]
      }

      if (typeof document != ''+void 0) {
        // Not precise at all.
        if (v instanceof Node && 'to' in v) return v.to
        if (v instanceof Element) return [elem, v.tagName.toLowerCase(), [...v.childNodes].map(ch => deconstruct(ch, allowPath))]
        if (v instanceof Node) return v.textContent
      }

      if (v instanceof Map) {
        // Sort keys by _id for consistency.
        const keys = [...v.keys()].sort((a,b) => _id(a) - _id(b))
        const arr = [map]
        keys.forEach(k => arr.push(k, v.get(k)))
        return arr
      }
      if (v && v[defines.key]) {
        // Deconstruct the definition Map, treating self-references specially.
        const m = new Map, d = v[defines.key]
        const result = [concept, m]
        const selfRef = typeof v == 'function' ? {[defines.key]:{[_id(deconstruct)]:_unevalFunction(v)}} : result
        Object.keys(d).forEach(k => {
          const val = d[k]
          val === v ? m.set(concept.idToKey[+k], selfRef) : m.set(concept.idToKey[+k], val)
        })
        if (typeof v == 'function')
          m.set(call, selfRef)
        return result
      }
      if (typeof v == 'function')
        return _unevalFunction(v)
      if (v === undefined)
        return [concept, new Map([[docs, `A marker that represents the lack of a conceptual definition or a value.`]])]
      if (!v || typeof v != 'object')
        return v
      // And, objects (likely in `lookup`) just get deconstructed as maps.
      const arr = [map]
      Object.keys(v).forEach(k => arr.push(k, v[k]))
      return arr
    },
  },

  _unevalFunction(f) {
    let ctx = jsEval.ctx in f ? f[jsEval.ctx] : undefined
    if (ctx === Self.ctx) ctx = undefined

    // Remove unnecessary whitespace.
    let src = (''+f).split('\n')
    const ws = /^\s*/.exec(src[src.length-1])[0]
    src = src.map(line => line.replace(ws, '')).join('\n')
    src = src.replace(/^[_a-zA-Z]+/, '')
    try { Function('('+src+')') }
    catch (err) { src = 'function'+src }

    return ctx !== undefined ? [jsEval, src, ctx] : [jsEval, src]
  },

  input:{
    docs:`\`input\`: Represents input of the innermost function.
For example, \`(func input+3) 5\` returns \`8\`.`,
  },

  func:{
    docs:`\`\\Body\` or \`func Body\`: A construct that can be called to evaluate \`Body\`.
This has one \`input\`; see \`multifunc\` for multi-input functions.

What a function does, does not change when a node in its body changes. That would need a lot of memory to wire up. Instead, re-compile the function object itself with \`writeAt\` if a change is needed.`,
    future:`Created functions could choose to be inlinable, and use \`purify\` for partial evaluation.`,
    lookup:{
      input:__is(`input`),
      multifunc:__is(`multifunc`),
    },
    argCount:1,
    _resultCanBe(x) { _resultCanBe(x[1]) },
    construct(x, obj) {
      if (obj === undefined) {
        obj = arg => obj.f(arg)
        const d = obj[defines.key] = Object.create(null)
        d[_id(deconstruct)] = x
        d[_id(argCount)] = 1

        const rcb = _resultCanBe(x[1])
        d[_id(dispose)] = rcb.some(x => defines(x, dispose))
        _allocArray(rcb)

        Object.freeze(d)
        return obj
      } else {
        obj.f = _compileBody(x[1])
      }
    },
    nameResult:[
      `f`,
      `g`,
      `h`,
    ],
  },

  _compileBody(body, allowInput = true, poIndRc) {
    /*     Example of what this compiles DAGs to:
     * function(f,g,h) {
     *   'use strict'
     *   return function F(input) {
     *     _checkInterrupt(F)
     *     let v0, v1, v2
     *     ++call.depth
     *     try {
     *         v0 = f(input)
     *         v1 = g(v0, input)
     *         v2 = h(v0, v1)
     *         return v2
     *     }
     *     finally { --call.depth }
     * }
     *
     *     Complications:
     * - `interrupt` handling, to stop and resume execution.
     *   The variables may be restored on post-interrupt entry,
     *   and we may need an "instruction pointer" to not re-do done work,
     *   and the work may be wrapped in try/catch that saves all variables on interrupt.
     */
    let owningPoIndRc = false
    if (!poIndRc && _isArray(body) && body[0] !== quote)
      poIndRc = _postorderAndIndexesAndRefs(body), owningPoIndRc = true

    const consts = _allocMap()
    const [src, sourceURL, lines] = toSource(body, poIndRc, owningPoIndRc)
    try {
      const fn = Function([...consts.values()].join(','), src)(...consts.keys())
      fn.lines = lines
      _resolveStack.functions[sourceURL] = fn
      return fn
    } catch (err) { console.error(src); throw err }

    function toSource(body, poIndRc, owningPoIndRc) {
      // Compiles a DAG into an SSA form in JS that handles `interrupt`s.
      const code = _allocArray()
      let nextStage = 1

      const sourceURL = new Array(32).fill().map(() => (Math.random()*16 | 0).toString(16)).join('')
      const lines = []

      code.push(`'use strict'`)
      code.push(`return function F(${allowInput ? 'input' : ''}) {`)
      if (!_isArray(body) || body[0] === quote)
        code.push(` return ${env(body)}`)
      else {
        code.push(` ${env(_checkInterrupt)}(F)`)
        const backpatchVars = code.push(` VARIABLES`)-1
        code.push(` ++${env(call)}.depth`)
        code.push(` try {`)
        const backpatchGotoInterrupt = code.push(`  switch (stage) { case 0:`)-1

        const [po, ind, rc] = poIndRc
        const used = _allocArray()
        const nodeNames = _allocArray(), freeNames = _allocArray()
        used.length = po.length, used.fill(0), freeNames.push(0)

        // Save vars for adjustment.
        let save
        for (let i=0; i < po.length; ++i)
          if (typeof po[i][0] != 'function' || defines(po[i][0], adjust) === undefined) { save = null;  break }
        if (save !== null) save = _allocArray(), save.length = po.length
        if (save)
          for (let i=0; i < po.length; ++i) {
            if (defines(po[i][0], adjustLoad))
              save[i] = true
            if (defines(po[i][0], adjustSave))
              for (let j=0; j < po[i].length; ++j)
                if (ind[i][j] !== null)
                  save[ind[i][j]] = true
          }

        for (let i=0; i < po.length; ++i) {
          // Walk the DAG in post-order, emit assignment of vars to application results.
          //   We don't re-use variable slots that won't be used in computation, because adjustment could want them.
          //     (Re-computing results requires estimates of runtime of nodes or other predictions, which are unavailable for now.)
          const x = po[i], ins = ind[i]
          _checkArgCount(x)
          if (_isArray(x[0]) || defines(x, interrupt) !== false) {
            // Advance the interrupt stage if we cannot guarantee the function is non-interrupting.
            code.push(`   stage = ${nextStage}; case ${nextStage}:`)
            ++nextStage
          }
          lines.push(code.length+3, x)

          // Collect var names of dependencies, then assign application result to a var.
          const s = _allocArray()
          for (let j=0; j < x.length; ++j)
            s.push( ins[j] !== null ? nodeNames[ins[j]] : env(x[j]) ),
            ins[j] !== null && ++used[ins[j]]
          nodeNames[i] = freeNames.length > 1 ? freeNames.pop() : 'v'+freeNames[0]++
          code.push(`   ${nodeNames[i]} = ${s[0]}(${s.slice(1)})`)
          _allocArray(s)

          // Decrease ref-counts of dependencies, and dispose vars and mark for re-use if no longer needed.
          for (let j=0; j < x.length; ++j)
            if (ins[j] !== null && used[ins[j]] === rc[ins[j]] && (!save || !save[ins[j]]))
              if (defines(po[ins[j]], dispose))
                code.push(`   ${nodeNames[ins[j]]} = ${env(dispose)}(${nodeNames[ins[j]]})`),
                freeNames.push(nodeNames[ins[j]])
        }
        if (save) // Save those that need saving, for adjustment.
          code.push(`   const $$$=${env(_allocArray)}()`),
          code.push(`   $$$.push(${save.filter(x => x).map((sv,i) => sv && nodeNames[i])})`),
          code.push(`   ${env(adjustSave)}($$$)`)
        code.push(`   return ${nodeNames[po.length - 1]}`)

        const listOfVars = new Array(freeNames[0]).fill().map((_,i) => 'v'+i)
        _allocArray(used), _allocArray(nodeNames), _allocArray(freeNames)

        if (nextStage <= 1)
          code[backpatchGotoInterrupt] = ``
        else code.push(`  }`)

        code.push(` } catch (err) {`)
        code.push(`  if (err === ${env(interrupt)})`)
        if (nextStage > 1)
          code[backpatchVars] = ` let [stage=0,${listOfVars}] = ${env(interrupt)}(F)`,
          code.push(`   err(F, ${env(_tmp())}.length=0, ${env(_tmp())}.push(stage,${listOfVars}))`)
        else
          code[backpatchVars] = ` let ${listOfVars}`,
          code.push(`   ;`)
        code.push(`  else ${listOfVars.map((v,i) => defines(po[i], dispose) && `${env(dispose)}(${v})`).filter(x=>x)};`)
        code.push(`  throw err`)
        code.push(` }`)
        code.push(` finally { --${env(call)}.depth }`)
        if (owningPoIndRc)
          _allocArray(po), ind.forEach(_allocArray), _allocArray(ind), _allocArray(rc)
      }
      code.push(`}`)
      code.push(`//# sourceURL=${sourceURL}`)
      const result = code.join('\n')
      _allocArray(code)
      return [result, sourceURL, lines]
    }
    function env(x) {
      // Returns the string that can be used to refer to the constant value.
      if (!allowInput && x === input)
        error(x, "is not allowed but is seen anyway")
      else if (x === input) return 'input'
      if (_isArray(x) && x[0] === quote) x = x[1]
      if (!consts.has(x))
        consts.set(x, 'env' + consts.size)
      return consts.get(x)
    }
  },

  _checkArgCount(x) {
    // Checks arg count, and function-ness, at compile time. Does not catch all cases, but it's good enough.
    if (!_isArray(x) || _isArray(x[0])) return
    if (typeof x[0] != 'function') error('Expected a function to call, got', x[0])
    if (typeof defines(x[0], argCount) == 'number')
      if (defines(x[0], argCount) !== x.length-1)
        error('Expected', defines(x[0], argCount), 'args but got', x.length-1, 'in', x)
  },

  _postorderAndIndexesAndRefs:{
    docs:`Linearizes all execution-relevant information about a DAG into 3 equal-sized arrays.`,
    interrupt:false,
    call(dag) {
      const po = _allocArray(), ind = _allocArray(), rc = _allocArray()
      const toIndex = _allocMap()
      try { walk(dag) }
      catch (err) { _allocArray(po), _allocArray(ind), _allocArray(rc);  throw err }
      finally { _allocMap(toIndex) }
      return [po, ind, rc]

      function walk(x) {
        if (!_isArray(x) || x[0] === quote) return
        if (toIndex.has(x)) {
          const i = toIndex.get(x)
          if (i === null)
            error('Cycles in computation, at', x)
          return ++rc[i]
        }
        toIndex.set(x, null)
        if (!x.length)
          error('Expected a function with args to apply, got', x)
        x.forEach(walk)
        toIndex.set(x, po.length)

        const indexes = _allocArray();  indexes.length = x.length
        for (let j=0; j < x.length; ++j) indexes[j] = toIndex.has(x[j]) ? toIndex.get(x[j]) : null
        po.push(x), ind.push(indexes), rc.push(1)
      }
    },
  },

  _resultCanBe(x) {
    // Returns all nodes that the result can be, intended for checking definitions of all possible branches.
    if (!_resultCanBe.seen) _resultCanBe.seen = new Set
    if (!_resultCanBe.in) {
      _resultCanBe.in = true
      const result = _allocArray()
      try { _resultCanBe(x);  result.push(..._resultCanBe.seen) }
      finally { _resultCanBe.seen.clear(),  _resultCanBe.in = false }
      return result
    } else {
      // Defer to `defines(x, _resultCanBe)`, which will call us for each node that the result can be.
      if (_resultCanBe.seen.has(x)) return
      _resultCanBe.seen.add(x)
      const d = defines(x, _resultCanBe)
      if (d) d(x)
    }
  },
  

  array:{
    docs:`\`(array …Items)\`: creates a new array.
The same as \`(make arrayObject …Items)\`.`,
    lookup:{
      read:__is(`readAt`),
      write:__is(`writeAt`),
      observe:__is(`observe`),
      arrayObject:__is(`arrayObject`),
    },
    interrupt:false,
    call(...x) { return created(x) },
    purify(...y) { return created(y) },
  },
  readAt:{
    docs:`\`read Array Index\`: reads the current value at a position in an array.`,
    argCount:2,
    interrupt:false,
    call(arr, i) {
      if (call.pure && call.pure.has(arr)) {
        const v = arr[i]
        // `v` is a program (that quotes values), so we convert it to a value (with _unknown(…) for programs).
        return !_isArray(v) ? v : v[0] === quote ? v[1] : _unknown(v)
      }
      if (impureHave()) return impureLoad()
      return impureSave(arr[i])
    },
  },
  writeAt:{
    docs:`\`write Array Index Value\`: changes the current value at a position in an array.
If \`Index\` is undefined, re-constructs a construct in-place if possible.`,
    argCount:3,
    interrupt:false,
    call(arr, i, v) {
      if (call.pure) {
        if (!call.pure.has(arr)) throw impure
        if (call.pure.has(v)) throw impure // This prevents cycles, which can't be constructed with `array` calls.
        //   (Though it prevents many other things too.)
        v = i !== undefined ? quote(v) : v.map(quote)
      }
      if (call.env && call.env[_id(impureLoad)] > 0) return
      if (i !== undefined) {
        if (arr[i] === v) return
        arr[i] = v
      } else {
        // Replace the contents of the whole array.
        if (!_isArray(arr)) error('Expected an array but got', arr)
        if (!_isArray(v)) error('Expected an array to replace', arr, 'with but got', v)
        arr.length = 0, arr.push(...v)
      }
      if (observe.rs && observe.rs.has(arr))
        !observe.changed.size && _schedule([_callChangeObservers], _newExecutionEnv()),
        observe.changed.add(arr)
    },
  },
  observe:{
    docs:`\`observe Array OnChange\`: remembers to call the function (passing \`Array\`) sometime after the array changes from a \`writeAt\` call.
If \`OnChange\` is not given, returns the current array of \`Array\`'s observers.
Call this again with the same array and function to no longer call it.
Many updates at the same time are merged into one call, scheduled in a separate task.`,
    interrupt:false,
    call(arr, f, forceTo = undefined) {
      if (!_isArray(arr) && defines(arr, deconstruct) === undefined) return
      if (!observe.rs) observe.rs = new WeakMap, observe.changed = new Set
      if (!observe.rs.has(arr)) observe.rs.set(arr, [])
      const obs = observe.rs.get(arr)
      if (f === undefined) return obs
      const i = obs.indexOf(f)
      if (forceTo === undefined)
        i >= 0 ? obs.splice(i, 1) : obs.push(f)
      else if (forceTo === false)
        i >= 0 && obs.splice(i, 1)
      else if (forceTo === true)
        i < 0 && obs.push(f)
      else
        error('Expected undefined/false/true, got', forceTo)
      if (!obs.length) observe.rs.delete(arr)
      return f
      // .rs (a Map from arrays to their observers), .changed (a Set of arrays that changed).
    },
  },
  _callChangeObservers:{
    docs:`Calls all observers for all changed arrays.`,
    call() {
      let [i = 0] = interrupt(_callChangeObservers)
      try {
        observe.changed.forEach(arr => {
          const obs = observe.rs.get(arr)
          for (; i < obs.length; ++i)
            obs[i](arr)
          i = 0, observe.changed.delete(arr)
        })
      } catch (err) { if (err === interrupt) interrupt(_callChangeObservers, _tmp().length=0, _tmp().push(i));  throw err }
    },
  },
  arrayObject:{
    docs:`\`arrayObject …Items\`: \`construct\`s an actual array.
When the array head is a \`construct\`-defining \`concept\`, this allows still correctly parsing the serialization.`,
    construct(x, obj) {
      if (obj === undefined)
        return _allocArray()
      else
        obj.push(...x.slice(1))
    },
  },


  select:{
    docs:`\`select If Then Else …Args\`: calls \`Then …Arg\` if \`If\` is \`true\`, else \`Else …Args\`.
Inconvenient compared to being able to refer to closed-over variables directly, but simple and Turing-complete.

This is much like the φ function in SSA forms, but explicitly passing arguments to code blocks.`,
    _resultCanBe(x) { _resultCanBe(x[2]), _resultCanBe(x[3]) },
    call(If, Then, Else, ...Args) {
      return If === true ? Then(...Args) : Else(...Args)
    },
  },

  multifunc:{
    docs:`\`multifunc Func\`: A construct that, when called, turns multiple args into one array to call \`Func\` with.
In JS: \`(...args) => f(args)\`.`,
    argCount:1,
    _resultCanBe(x) { _resultCanBe(x[1]) },
    construct(x, obj) {
      if (obj === undefined) {
        obj = (...args) => f.f(args)
        const d = obj[defines.key] = Object.create(null)
        d[_id(deconstruct)] = x
        Object.freeze(d)
        return obj
      } else {
        obj.f = x[1]
        Object.seal(obj)
      }
    },
  },





  created:{
    docs:`Marks an array as created and owned locally.
Reading from and writing to such arrays during \`purify\` is allowed, even unknown values, though only at known indices. They will be created at runtime, but only if needed.
(Non-arrays are harder to support, because they couldn't be changed in-place into arrays that compute them, so why bother.)`,
    examples:[
      [
        `purify ^(readAt (array 1 2 3) 0)`,
        `1`,
      ],
      [
        `purify ^(readAt (array ?+1) 0)`,
        `_unknown ?+1`,
      ],
      [
        `purify ^(array 1+1+?)`,
        `array 2+input`,
      ],
    ],
    call(obj) {
      if (!_isArray(obj)) error("Only arrays are supported, but got", obj)
      if (call.pure)
        call.pure.add(obj)
      return obj
    },
  },

  purify:{
    docs:`\`purify ^Expr\`: Partially-evaluates the expression, without inlining or knowledge.
The process is simple: if any of a node's inputs are unknown (or if it does an impure thing like calling \`randomNat\`, or its result \`_isUnknown\`), then the node is unknown (and might be inlined), else it's known (and can be computed with \`call\`).

Every \`define\` of \`purify\` is a function that accepts programs that produce every arg, and returns a value (or \`(_unknown DAG)\` to return a program).
We do not automatically allow inlining \`func\`s (only explicitly \`purify\`ing function bodies), because inlining everything causes exponential explosions of code size (and infinite loops for recursion unless handled), which is very bad user UX. If we could have machine-learned the best inlining, we would have, but as it is, no. So, \`purify\` usually acts as just a constant-propagator.


Take a moment to think of what low-level features are close to this.
Compiling the partial evaluation, to make it faster? Probably overkill, since it's faster to interpret what's only needed once.
Function optimizer? Picking the best equivalency, in a definition of \`purify\`. Likely best with machine learning, likely useless without.
Lazy evaluation? If an argument is statically seen to be unused, then partial evaluation will automatically drop it. Creating thunks is not always efficient, particularly for numerically-heavy workloads, so unless the machinery can learn the best for each case, we won't create thunks.
Asynchronous workflows? \`await\` can wait for a result, but to truly ensure that no time is wasted, delayed results should be treated as unknown and partially-evaluated. Good if a task takes a day, but for common use-cases, far too slow. Likely best with machine learning, likely useless without.
Type systems, including dependent types, good for logic? They're about computing something about every value at compile-time. This can be done by replacing all values with \`(Value Type)\` and adding a type-computing always-inlined layer on top of all functions. Or by having another type-level interpreter for IR. But if types are annotated by humans case-by-case, then do they really say anything fundamental about computation? If we were to generate arbitrary programs, wouldn't it be better to allow them to be generated as a consequence of other operations like array-checking, not their own separate thing? No, we won't have types except as hints.
Choices.
Choices.
Choices.
Choices.
Static is not good enough. Need dynamic.
And who's to say that these are the only choices to ever make, anyway?
Maybe, rather than trying to create a complete world by ourselves, we should allow a simple core to create whatever it wants.
Believe in simplicity.`,
    future:`Make \`func\` use \`purify\`, to be more efficient at run-time. (Maybe delay until we can make intelligent choices, though.)`,
    philosophy:`The vanity and psychosis of those who hold absolute power are of no use to everyone else. Swat them aside, to make room for coming up with better versions of yourself.
I realized my mistake, and though I lost my vision, I can see everything now.`,
    examples:[
      [
        `purify ^[1+2]`,
        `3`,
      ],
      [
        `purify ^(randomNat 5)`,
        `_unknown (randomNat 5)`,
      ],
    ],
    lookup:{
      purifyInWorker:__is(`purifyInWorker`),
      created:__is(`created`),
    },
    nameResult:[
      `purified`,
      `computation`,
    ],
    call(x, inputKnown = false, inputValue = input) {
      if (!_isArray(x)) return x
      if (x[0] === quote) return x[1]
      let [i = 0, outputs = _allocArray(), unknown, po, inds, pure = call.pure ? null : new Set] = interrupt(purify)
      if (!po) [po, inds] = _postorderAndIndexesAndRefs(x)
      outputs.length = po.length
      // `unknown` is an array of booleans of length `po.length`, but we only create it on-demand, to optimize for nothing-unknown cases.
      const collected = _allocArray()
      const prevPure = call.pure;  call.pure = pure || call.pure
      try {
        for (; i < po.length; ++i) {
          // Go through all nodes, collect dependencies, execute nodes, and record those that we can't know.
          collected.length = inds[i].length
          for (let j=0; j < collected.length; ++j) {
            const ind = inds[i][j]
            let depUnknown = ind !== null && unknown && unknown[ind]
            let depValue = ind !== null ? outputs[ind] : _isArray(po[i][j]) ? po[i][j][1] : po[i][j]
            if (po[i][j] === input)
              depUnknown = !inputKnown, depValue = inputValue
            if (depUnknown) {
              if (!unknown || !unknown[i])
                for (let k=0; k<j; ++k)
                  collected[k] = quote(collected[k])
              !unknown && (unknown = _allocArray(), unknown.length = po.length), unknown[i] = true
            }
            collected[j] = depValue
            if (ind !== null && !depUnknown && unknown && unknown[i])
              collected[j] = quote(collected[j])
            if (j === 0 && typeof collected[0] != 'function')
              error("Expected a function, got", collected[0])
          }

          // Execute:
          try {
            if (unknown && unknown[i]) {
              if (typeof collected[0] == 'function' && defines(collected[0], purify))
                outputs[i] = defines(collected[0], purify).call(...collected),
                unknown && (unknown[i] = undefined)
              else
                throw impure
            } else
              outputs[i] = collected[0].call(...collected)
            if (_isUnknown(outputs[i]))
              outputs[i] = outputs[i][1], !unknown && (unknown = _allocArray(), unknown.length = po.length), unknown[i] = true
          } catch (err) {
            if (err === impure) {
              if (unknown && unknown[i])
                // We've already quoted every known value in `collected` when we were collecting it.
                outputs[i] = collected.slice()
              else
                outputs[i] = collected.map(quote)
              !unknown && (unknown = _allocArray(), unknown.length = po.length), unknown[i] = true
            }
            else throw err
          }
        }
        const lastOut = outputs[po.length-1], lastUnk = unknown && unknown[po.length-1] || call.pure.has(lastOut)
        if (pure)
          pure.forEach(x => _isArray(x) ? x.unshift(array) : error("Non-array `created` values are not supported, but got", x)),
          pure.clear()
        outputs[po.length-1] = undefined, outputs.forEach(dispose)
        _allocArray(outputs), unknown && _allocArray(unknown)
        _allocArray(po), inds.forEach(_allocArray), _allocArray(inds)
        return !lastUnk ? lastOut : _unknown(lastOut)
      } catch (err) {
        if (err === interrupt) interrupt(purify, _tmp().length=0, _tmp().push(i, outputs, unknown, po, inds, pure))
        if (err === interrupt) throw err
        return _unknown(_errorRepr(err)) // Don't throw exceptions, return them. Might be a pain point sometimes.
      } finally { call.pure = prevPure;  _allocArray(collected) }
    },
  },




/* TODO: ML integration.
  - `autograd(fn)—>func` so that we don't *always* have to write adjust defini
tions. `adjust(fn, ins, out, dout)` for actual first-order adjustment. `_adjus
tMaxMagnitude = (…, 1, …)` and `_adjustMultiplier = (…, .1, …)`, to control th
e adjustment.
  - `loss2(result, assigned)` that can return undefined in 33% rolls (for dive
rsifying training data), the default for op loss assignment.
  - `_defaultNN(inputSz, outputSz)` for densely-connected NN autofunc creator.
  - `rnnEnv(nn, featureSize)` and its ops: `choice(env)(...options)` and `choi
ce(env) = actual` (`assign(choice(env), actual)`).
    - …Though, with total control of IR, do we really want RNN envs? Maybe it 
would be better to try to generate programs that predict every numeric result,
and maybe even bools and strings too?… To route in every way, not just an RNN…
    - More NN ops: `num(...sizes)(env)`.
    - Mixing computations and states into RNN envs: `_envMix(env, stateOrFunc,
ins = undefined)`.
    - Function decorators (for recursivity of RNNs): `_envEnter(env, initialSt
ate)` and `_envExit(env)`, and `envFunction(env, fn)` construction with those.
  - …Do stuff, in tutorials, like instruction-generation or Metamath or optimi
zing built-in primitives like peval or `replay` with our ML?
*/

// (The interpreter loop should handle three distinct execution traces: impure-replay tape, gradient tape, and the interrupt stack.)
  // (And, they all should have definitions in execution env.)

  // …Can't we have expert distillation, where choices in different execution branches synchronize their predictions? Yeah, it should be a basic thing, because it can't be properly imitated otherwise.

  add:{
    docs:`Adds two tensors together.
The adjustment is passed through to each arg.`,
    argCount:2,
    interrupt:false,
    dispose:true,
    call(a,b) {
      return tf.add(a,b)
    },
    adjust:[
      __is(`array`),
      [
        __is(`readAt`),
        __is(`input`),
        2,
      ],
      [
        __is(`readAt`),
        __is(`input`),
        2,
      ],
    ],
  },

  dispose:{
    docs:`A low-level function for statically disposing an object.
A function \`defines\` this to be \`true\` to make execution \`dispose\` its result.

Note that this is only for disposal which we can statically determine, at compile-time. Storing a tensor in an array won't work.
What about dynamic disposal? There would need to be a "please preserve this" function, and a perfect method of disposing those preserved objects (either garbage collection, or adding reference-counting to all functions that mutate state, which only needs to cover a few functions to cover 99% behavior, and is extremely challenging to cover 100% of behavior with, since we didn't grow on top of reference-counting).`,
    elemValue(x) {
      return typeof tf != ''+void 0 && x instanceof tf.Tensor
    },
    call(x) {
      return void(typeof tf != ''+void 0 && x instanceof tf.Tensor && x.dispose())
    },
  },

  // TODO: Have definable merger `mergeAdjustments(arrayOfDins)—>dout`, defined by functions that return said dins, and which must be defined equally if many functions use the same node (able to be a function or an array, for each input). Called/emitted even if only one function uses a node.
  //   TODO: Have `_mergeTensors` for all functions that take tensors (purified to nothing if there is only one node), returning avg.
  //   TODO: Have `_mergeArrays` for all functions that take arrays (`readAt`; its adjustment can return just the adjustment and index).
  // TODO: Make a backprop 'compiler' into our DAG IR, failing if any node is non-adjusting, merging (same-merger functions can be used together) and inlining adjustments.
  //   `autograd(expr)`.
  // TODO: Successfully backprop through `a+b`.

  // TODO: the "Composing a learner out of smaller learners, such as in gradient descent, is efficient. We can route differentiable information through arbitrary programs, as long as it all ends up predicting something (computing losses to back-propagate)." `assign` function.

  // "They say that blood is thicker than water. So make sure to drink lots of blood. Put your heart into it!"
  // For a complicated step in a tutorial, have a "safe word" (a long UUID string), established long before.

  adjust:{
    docs:``, // TODO: note how adjustment must always happen in perfect reversal of execution, otherwise there will be very non-obvious errors.
    lookup:{
      save:__is(`adjustSave`),
      load:__is(`adjustLoad`),
    },
    call(fn, ins, out, dout) {
      if (typeof fn != 'function') error('Expected a function, got', fn)
      const d = defines(fn, adjust)
      return d(ins, out, dout)
    },
  },

  // TODO: `callAdjust(expr)` that compiles `expr` and its adjustment, sets adjustSave in env, calls `expr`, transfers adjustSave to adjustLoad in env, calls adjustment, assert exact-ness of reversal, saves the compiled expr and its adjustment in the replay buffer, then returns the result of calling `expr`.

  adjustSave:{
    docs:`Saves a newly-allocated array for adjustment.
(Transfers responsibility for \`dispose\`al of items in it and marking the array for re-using.)
A function \`defines\` this to be \`true\` to save its inputs to adjustment.`,
    call(x) {
      if (!_isArray(x))
        error("Can only save (newly-allocated) arrays for adjustment (transferring responsibility for disposal), got", x)
      if (!call.env) return
      const stack = call.env[_id(adjustSave)]
      if (stack)
        stack.push(x)
      else
        x.forEach(dispose), _allocArray(x)
    },
  },

  adjustLoad:{
    docs:`Loads an array for adjustment. Be responsible for it, honey.
Must always be exactly in reverse to \`adjustSave\`.
A function \`defines\` this to be \`true\` to save its output to adjustment. Look, we only have one global namespace, so name space is at a premium.`,
    call() {
      const stack = call.env[_id(adjustLoad)]
      if (!stack)
        error("…Forgot to adjust??")
      if (!stack.length)
        error("Adjustment reversal is imperfect: loading more than was saved")
      return stack.pop()
    },
  },

  impure:{
    docs:`\`impure Func\`: A \`construct\` to wrap a (single-arg) function that can have varying results, which should not be computed again on \`replay\`.

For example, killing an animal can only be done once, but learning internal estimates from that experience can be done many times.


If using the primitives \`impureHave\`/\`impureLoad\`/\`impureSave\` directly, there is a rigid structure to be maintained: execution must be repeated exactly, otherwise there will be errors that are hard to trace back to their sources. \`impure\` maintains that structure.`,
    lookup:{
      have:__is(`impureHave`),
      load:__is(`impureLoad`),
      save:__is(`impureSave`),
    },
    argCount:1,
    construct(x, obj) {
      if (obj === undefined) {
        // Create the function.
        obj = arg => {
          // Do not skim the proper usage, dear friend: check once, then load/save once. Especially between interrupts.
          if (!interrupt(impure)[0])
            if (impureHave()) return impureLoad()
          try { return impureSave(obj.f(arg)) }
          catch (err) {
            if (err === interrupt) interrupt(impure, _tmp().length=0, _tmp().push(true))
            else impureSave(_errorRepr(err))
            throw err
          }
        }

        const d = obj[defines.key] = Object.create(null)
        d[_id(deconstruct)] = x
        d[_id(argCount)] = 1
        Object.freeze(d)
        return obj
      } else {
        // Set the function that we call.
        obj.f = x[1]
      }
    },
  },

  impureHave:{
    docs:`Checks if we are replaying a past experience.
If yes, the caller must return \`(impureLoad)\`; if no, the caller must always call \`impureSave\` with the computed result (possibly \`(_errorRepr Error)\`).`,
    interrupt:false,
    call() {
      // For potential partial evaluation.
      if (call.pure) throw impure
      if (!call.env) return false
      const index = call.env[_id(impureLoad)]
      if (index != null) {
        if (index < 0)
          return --call.env[_id(impureLoad)], false
        return true
      }
      // If we are the outermost check, await a save; if we are loading after the outermost check, remember to skip 1 save.
      call.env[_id(impureLoad)] = index !== null ? null : -1
      return false
    },
  },

  impureLoad:{
    docs:`Checks if we are replaying a past experience.
If replaying, this returns the past result; if not, returns \`undefined\`, and the caller must always call \`impureSave\` with its result.`,
    interrupt:false,
    call() {
      const index = call.env[_id(impureLoad)]
      if (index != null) {
        if (index < 0)
          error("Raw `impureLoad`; use `impureHave`")
        const tape = call.env[_id(impureSave)]
        if (!tape || tape.length <= index)
          error("Wrong handling of impurities: on replay, attempted to load more than was saved")
        const result = tape[call.env[_id(impureLoad)]++]
        if (_isError(result)) throw result
        return result
      }
      error("Raw `impureLoad`; use `impureHave`")
    },
  },

  impureSave:{
    docs:`Saves (and returns) the result to replay the experience later.`,
    interrupt:false,
    call(x) {
      if (!call.env) return x
      const index = call.env[_id(impureLoad)]
      if (index != null && !(index < 0))
        error("Wrong handling of impurities: attempted to save while replaying")
      if (index != null) {
        // Skip saving inner impurities (because they'll already be saved by the outer impurity).
        if (index === -1)
          call.env[_id(impureLoad)] = null
        else
          ++call.env[_id(impureLoad)]
        return x
      }
      if (index === undefined)
        error("Wrong handling of impurities: trying to save without a prior load")
      call.env[_id(impureLoad)] = undefined
      let tape = call.env[_id(impureSave)]
      if (!tape) call.env[_id(impureSave)] = tape = _allocArray()
      tape.push(x)
      return x
    },
  },

  Replays:[
  ],

  _maxReplaysLength:[
    __is(`settings`),
    0,
    `The approximate maximum length of the global replay buffer \`^Replays\`.`,
  ],

  _saveReplay:{
    docs:`Potentially saves a replay in the global replay buffer.`,
    call(expr, env) {
      if (!_maxReplaysLength[1]) return
      const index = env[_id(impureLoad)], tape = env[_id(impureSave)]
      if (index === null)
        error("Expected an `impureSave`, but execution terminated")
      if (index != null && index < 0)
        error("Expected", -index+1, "more `impureSave`s, but evaluation concluded")
      if (index !== undefined)
        error("What is this:", index)
      if (!tape) return
      Replays.push(expr, tape)
      const max = _maxReplaysLength[1]
      if (Replays.length > max*2)
        // Intermittent, for linear runtime.
        Replays.splice(0, Replays.length - max)
    },
  },

  replay:{
    docs:`Replays the executions stored in the replay buffer, one time each.`,
    lookup:{
      Replays:__is(`Replays`),
      _maxReplaysLength:__is(`_maxReplaysLength`),
      impure:__is(`impure`),
    },
    call(what = Replays) {
      if (!_isArray(what))
        what = defines(what, replay)
      if (!_isArray(what) || (what.length&1))
        error("Expected an array of (…? Expr Tape …?) but got", what)

      // The below is just a loop that does `call(expr)`, setting up then checking the impurity tape.
      let [i, expr, tape, index] = interrupt(replay)
      if (i === undefined)
        i = 0, expr = what[0], tape = what[1], index = 0
      const load = _id(impureLoad), save = _id(impureSave)
      const prevLoad = call.env[load], prevSave = call.env[save]
      try {
        for (; i < what.length; ++i, expr = what[i*2], tape = what[i*2+1], index) {
          call.env[load] = index, call.env[save] = tape
          call(expr)
          index = call.env[load]
          if (typeof index != 'number') error("How did things come to this:", index)
          if (index !== tape.length)
            error("Wrong handling of impurities: on replay, attempted to load less than was saved")
        }
        // Note: can return avg loss and/or avg update magnitude, to know more numbers.
      } catch (err) { if (err === interrupt) interrupt(replay, _tmp().length=0, _tmp().push(i, expr, tape, call.env[load]));  throw err }
      finally { call.env[load] = prevLoad, call.env[save] = prevSave }
    },
  },







  defines:{
    docs:`\`(defines Data Code)\`: Gets the definition by Data of Code.
It's either a function or undefined, and has to be applied or ignored respectively (_getOverrideResult) to get the actual overriden value.

Array data gets its head consulted (once, not recursively). A function acts like a concept that defined \`call\` as that function. A JS object with a Map \`defines.key\` consults that map with Code as the key.`,
    philosophy:`Culture is polite fiction made for efficiency, and so are programming languages. At some point, you have to define things with no deeper explanation.`,
    interrupt:false,
    argCount:2,
    call(data, code) {
      if (code === call && typeof data == 'function')
        return data[defines.key] && data[defines.key][_id(call)] || data
      if (code === call && _isArray(data) && typeof data[0] == 'function')
        return data[0][defines.key] && data[0][defines.key][_id(call)] || data[0]

      const d = _view(data)
      return d ? d[_id(code, true)] : undefined
    },
  },

  _view:{
    docs:`\`(_view Concept)\`: returns the view of Concept, used to look up things in it.`,
    call(data) {
      if (_isArray(data)) data = data[0]
      return data ? data[defines.key] : undefined
    },
  },

  concept:{
    docs:`\`(concept View)\`: Creates an object that defines some things (an immutable map, but used for other purposes than \`map\`).
Concepts are used to give functions a free and easy extensibility point.
Rather than co-opting strings and files (duck typing, docstrings, documentation, READMEs) to convey parts of a concept, refer to defined functionality directly.`,
    philosophy:`Concepts have no defined boundaries and affect other things, so obviously, making \`concept\` be able to define one level of things in special circumstances fully encapsulates the concept of a concept.
(Poking fun at the naming of this.)`,
    argCount:1,
    lookup:{
      defines:__is(`defines`),
    },
    Initialize(net) {
      // Fill globals' id-to-key mapping for deconstruction of concepts.
      concept.idToKey = Object.create(null)
      Object.keys(net).forEach(k => concept.idToKey[_id(net[k])] = net[k])
    },
    editObject:false,
    construct(x, obj) {
      const defs = x[1]
      let callable = true
      if (defs instanceof Map)
        callable = defs.has(call)
      else if (_isArray(defs) && defs[0] === map) {
        callable = false
        for (let i = 1; i < defs.length; i += 2)
          if (defs[i] === callable) { callable = true;  break }
      }
      if (obj === undefined) {
        if (!callable)
          obj = Object.create(null)
        else
          obj = function called(...args) { return called[defines.key][_id(call)].apply(this, args) }
        obj[defines.key] = Object.create(null)
        Object.freeze(obj)
        return obj
      } else {
        const d = obj[defines.key]
        defs.forEach((v,k) => (d[_id(k)] = v, concept.idToKey[_id(k)] = k))
        Object.freeze(d)
      }
      // .idToKey (an object, so that `deconstruct` can know what the numbers mean).
    },
  },

  map:{
    docs:`\`{Key1 Value1 Key2 Value2 …?}\` or \`(map Key1 Value1 Key2 Value2 …?)\`: a key-value store.
The array-representation of a JS Map.
Read/write keys with \`mapRead\`/\`mapWrite\`, or read keys with \`lookup\`.`,
    lookup:{
      read:__is(`mapRead`),
      write:__is(`mapWrite`),
    },
    construct(x, obj) {
      if (obj === undefined) {
        // Pre-fill keys (with undefined).
        obj = _allocMap()
        for (let i = 1; i < x.length; i += 2)
          obj.set(x[i], undefined)
        return obj
      } else {
        // Fill values.
        obj.clear()
        for (let i = 1; i < x.length; i += 2) {
          if (obj.has(x[i])) error('Duplicate key', x[i], 'in', obj)
          obj.set(x[i], x[i+1])
        }
      }
    },
  },

  mapRead(m, k) {
    if (impureHave()) return impureLoad()
    return impureSave(m.has(k) ? m.get(k) : _notFound)
  },

  mapWrite(m, k, v) {
    if (call.pure) throw impure
    if (impureHave()) return impureLoad()
    _invertBindingContext(m, true)
    v !== _notFound ? m.set(k, v) : m.delete(k)
    return impureSave(v)
  },

  _isValidJS(s) {
    // A terrible abuse of the Function constructor, but it *is* the only easy and most correct option.
    try { Function(s); return true } catch (err) { return false }
  },

  _isValidIdentifier(s, varName = false) { // For JS.
    return typeof s == 'string' && s && (!varName && /^[a-zA-Z]+$/.test(s) || !/\s/.test(s) && _isValidJS('let '+s+'=('+s+')\ntry{}catch('+s+'){}'))
  },

  jsEval:{
    docs:`\`(jsEval Source Bindings)\`: evaluates (strict-mode) JS source code that can statically reference default JS globals or values of \`Bindings\` (a map) with JS-identifier keys.`,
    examples:[
      [
        `(jsEval '(x) { return x+5 }') 5`,
        `10`,
      ],
      [
        `(jsEval '(x) { return x+a+5 }' (map 'a' 10)) 5`,
        `20`,
      ],
      [
        `(jsEval 'b=>a+b' (map 'a' 'q')) 'w'`,
        `'qw'`,
      ],
      [
        `(jsEval 'b=>a(12)+b' (map 'a' (jsEval 'x=>x' (map)))) 'w'`,
        `'12w'`,
      ],
      [
        `jsEval 'a(12)+13' (map 'a' (jsEval 'x=>x' (map)))`,
        `25`,
      ],
      [
        `( jsEval '(x) { return x+a()+b+5 }' (map 'b' 1 'a' (jsEval 'x=>b' (map 'b' (jsEval '10')))) ) 0`,
        `16`,
      ],
      [
        `( jsEval '(x) { return x+a()+5 }' (map 'a' (jsEval 'x=>a' (map 'a' (jsEval '10')))) ) 0`,
        `15`,
      ],
    ],
    Initialize() {
      jsEval.ctx = Symbol('ctx')
      jsEval.dynamicBind = Symbol('dynamicBind')
    },
    construct(x, obj) {
      const ctx = x[2] !== undefined ? x[2] : Self.ctx
      if (obj === undefined) {
        if (typeof x[1] != 'string')
          error('Expected a string but got', x[1])
        if (ctx !== undefined && !(ctx instanceof Map))
          error('Expected nothing or a copied map but got', ctx)
        // Already link the function, but also remember how to dynamic-bind on it to set local vars representing map keys.
        const src = []
        src.push("'use strict';")
        src.push(`let ⴵfunc = ${x[1]}`)
        const temps = [...ctx.keys()].map(k => _isLabel(k) ? 'ⴵ'+k[1] : '').filter(x => x).join(',')
        const perms = [...ctx.keys()].map(k => _isLabel(k) && k[1]).filter(x => x && _isValidIdentifier(x, true)).join(',')
        src.push("let " + perms)
        src.push(`ⴵfunc[ⴵbind] = (${temps}) => [${perms}] = [${temps}]`)
        src.push("return ⴵfunc")
        const sourceURL = new Array(32).fill().map(() => randomNat(16).toString(16)).join('')
        src.push("//# sourceURL=" + sourceURL)
        try {
          const fn = Function('ⴵbind', src.join('\n'))(jsEval.dynamicBind)
          _resolveStack.functions[sourceURL] = fn
          fn.lines = [4, fn]
          if (ctx) fn[jsEval.ctx] = ctx
          return fn
        } catch (err) { console.error(src.join('\n')); throw err }
      } else {
        obj[jsEval.dynamicBind](...ctx.values())
      }
    },
  },

  instanceof:{
    docs:`This exists only to highlight a thing in js.`,
  },

  continue:{
    docs:`This exists only to highlight a thing in js.`,
  },

  break:{
    docs:`This exists only to highlight a thing in js.`,
  },

  finally:{
    docs:`This exists only to highlight a thing in js.`,
  },

  typeof:{
    docs:`This exists only to highlight a thing in js.`,
  },

  return:{
    docs:`This exists only to highlight a thing in js.`,
  },

  throw:{
    docs:`This exists only to highlight a thing in js.`,
  },

  catch:{
    docs:`This exists only to highlight a thing in js.`,
  },

  while:{
    docs:`This exists only to highlight a thing in js.`,
  },

  void:{
    docs:`This exists only to highlight a thing in js.`,
  },

  else:{
    docs:`This exists only to highlight a thing in js.`,
  },

  for:{
    docs:`This exists only to highlight a thing in js.`,
  },

  let:{
    docs:`This exists only to highlight a thing in js.`,
  },

  new:{
    docs:`This exists only to highlight a thing in js.`,
  },

  switch:{
    docs:`This exists only to highlight a thing in js.`,
  },

  function:{
    docs:`This exists only to highlight a thing in js.`,
  },

  if:{
    docs:`This exists only to highlight a thing in js.`,
  },

  const:{
    docs:`This exists only to highlight a thing in js.`,
  },

  try:{
    docs:`This exists only to highlight a thing in js.`,
  },

  case:{
    docs:`This exists only to highlight a thing in js.`,
  },


  _test(env) {
    let failed = 0, finished = 0, total = 0

    // Run all examples to make sure that they indeed evaluate to what we have specified.
    const done = new Set
    Self.ctx.forEach(v => {
      if (_isArray(v) || done.has(v)) return
      done.add(v)
      const r = defines(v, examples)
      if (_isArray(r))
        r.forEach(a => {
          if (typeof a == 'function') return [0,1,2].map(a).forEach(([a,b]) => eq(a,b))
          if (!_isArray(a)) return
          const [code, becomes] = a
          if (typeof code != 'string' || typeof becomes != 'string') return
          eq(parse(code), parse(becomes))
        })
    })

    function eq(a,b) {
      ++total
      try {
        const s = lookup(fast, 'serialize')(a, undefined, true)
        const p2 = lookup(fast, 'parse')(s)
        const s2 = lookup(fast, 'serialize')(p2, undefined, true)
        s !== s2 && error('Fast serialize and s-p-s are not equal:', s+'\n'+s2, '\n', serialize(a), '\n', serialize(p2))

        _schedule(a, _newExecutionEnv(env), result => {
          ++finished
          const ss = structuredSentence
          try {
            const B = serialize(b)
            if (!_isArray(result) || result[0] !== jsRejected) {
              const A = serialize(result)
              if (A !== B) ++failed, log(ss('Not equal:')), log(ss('a'), a, ss('⇒')), log(ss('A'), result, ss('≠')), log(ss('b'), b)
            } else {
              ++failed, log(ss('Got an error'), ...result.slice(1)), log(ss('a'), a), log(ss('b'), b)
            }
          } catch (err) { ++failed, log(_errorRepr(err)) }
          if (finished === total && failed)
            log(ss('Failed {' + failed+'/'+total + '} tests.'))
        })
      } catch (err) { ++failed, log(_errorRepr(err)) }
    }
  },

  _onlyUndefined:{
    docs:`To be used with \`bound\` when \`ctx\` is a function. A marker that we do want to bind to undefined; exists to escape the "returning undefined means no explicit binding". (Currently not used anywhere.)`,
  },

  bound:{
    docs:`\`(bound Bindings Expr)\`: When called, returns a copy-where-needed of \`Expr\` with all keys bound to values in \`Bindings\`, as if copying then changing in-place. When evaluated, also evaluates the result.
Can be written as \`key:value\` in an array to bind its elements. Can be used to give cycles to data, and encode graphs and multiple-parents in trees.`,
    examples:[
      [
        `(bound (map ^a 1) ^a)`,
        `1`,
      ],
      [
        `(bound (map 0 1) 0)`,
        `1`,
      ],
      `Inner contexts are always bound first:`,
      [
        `a:1 (a a:2) (a b) (a:3 a) b:4`,
        `(2) (1 4) (3)`,
        true
      ],
    ],
    nameResult:[
      `rewritten`,
      `expr`,
      `copy`,
    ],
    argCount:2,
    philosophy:`Nothing is more general than a graph, so in general, nothing is more convenient and powerful than a language built on graphs.
Other languages use let-bindings for variables (and devote lots of attention to scoping rules and various declaration methods and their subversions like lambdas), but here we just share graph nodes (and build the language on top of a simple graph interchange format, \`basic\`). The fundamental meaning is a first-class citizen.

Putting all variables in a single global namespace is easy to develop, and gives no surprises to the user if references to them are instantly highlighted.`,
    call(ctx, v, cyclic = true, env, rewrite) {
      if (typeof cyclic != 'boolean') throw "`cyclic` must be a boolean"
      if (!(ctx instanceof Map) && typeof ctx != 'function') throw "`ctx` must be a Map or a function"
      if (rewrite !== undefined && typeof rewrite != 'function') throw "`rewrite` must be undefined or a function"
      const prevCtx = bound.ctx, prevCyclic = bound.cyclic, prevEnv = bound.env, prevRewrite = bound.rewrite
      bound.ctx = ctx, bound.cyclic = cyclic, bound.env = env, bound.rewrite = rewrite

      if (!bound.cache) bound.cache = new Map, bound.inside = false, bound.innerCtxs = []
      if (!bound.env) bound.env = !bound.cache.size ? bound.cache : new Map
      try { return _doBinding(v) }
      finally { bound.cache.clear(); bound.ctx = prevCtx, bound.cyclic = prevCyclic, bound.env = prevEnv, bound.rewrite = prevRewrite }
      // .cache, .innerCtxs; .ctx, .cyclic, .env, .rewrite to pass args on.
    },
  },

  _doBinding(v) {
    // Self-contained, and cannot interrupt.
    if (bound.env.has(v)) return bound.env.get(v)

    // Lookup in bound.innerCtxs or bound.ctx (or call bound.ctx on v).
    for (let i = bound.innerCtxs.length; i-- > 0; )
      if (bound.innerCtxs[i].has(v)) {
        const r = bound.innerCtxs[i].get(v)
        if (bound.env.has(r)) return bound.env.set(v, bound.env.get(r)), bound.env.get(v)
        if (r === v) return v
        return bound.cyclic ? _doBinding(r) : r
      }
    if (bound.ctx instanceof Map && bound.ctx.has(v)) {
      const r = bound.ctx.get(v)
      if (bound.env.has(r)) return bound.env.set(v, bound.env.get(r)), bound.env.get(v)
      if (r === v) return v
      return bound.cyclic ? _doBinding(r) : r
    }
    if (!(bound.ctx instanceof Map)) {
      let r = bound.ctx.call(undefined, v)
      if (r !== undefined) {
        if (r === _onlyUndefined) r = undefined
        if (bound.env.has(r)) return bound.env.set(v, bound.env.get(r)), bound.env.get(v)
        if (r === v) return v
        return bound.env.set(v, bound.cyclic ? _doBinding(r) : r), bound.env.get(v)
      }
    }
    if (_isArray(v) && (v[0] === label && v.length == 2)) return v
    // Copy the array and bind its parts.
    if (_isArray(v)) {
      let copy, changed = false, pushedCtx = false
      try {
        if (v[0] === bound && v.length == 3 && v[1] instanceof Map) {
          bound.innerCtxs.push(v[1]), pushedCtx = true
          const inner = v[2]
          if (_isLabel(inner)) {
            for (let i = bound.innerCtxs.length; i-- > 0; )
              if (bound.innerCtxs[i].has(inner))
                return bound.env.set(inner, bound.cyclic ? _doBinding(inner) : inner), bound.env.get(inner)
            if (bound.ctx instanceof Map && bound.ctx.has(inner))
              return bound.env.set(inner, bound.cyclic ? _doBinding(inner) : inner), bound.env.get(inner)
          }
          if (_isVar(inner)) return inner
          copy = _isArray(inner) ? inner.slice() : inner
          bound.env.set(v, copy)
          v = inner
        } else if (v[0] === bound && v.length == 3)
          return v[2] = quote(v[2]), v // Delay to `call`, so that inner bindings have higher priority.
        else
          copy = v.slice(), bound.env.set(v, copy)
        _cameFrom(copy, v)
        bound.env.set(v, copy)
        for (let i = 0; i < copy.length; ++i) {
          const r = _doBinding(copy[i])
          if (copy[i] !== r)
            changed = true, copy[i] = r
        }
      } finally { if (pushedCtx) bound.innerCtxs.pop() }
      if (_isArray(copy) && (copy[0] === label && copy.length == 2)) return copy
      copy = changed ? copy : v // This doesn't actually merge cycles.
      bound.env.set(v, v = !bound.rewrite ? copy : bound.rewrite(copy))
    }
    return v
  },

  unbound:{
    docs:`\`(unbound Expr)\`: Eliminates cycles in (a copy of) Expr by inserting \`(bound (map …Bindings) Expr)\` with keys in the copy.`,
    nameResult:[
      `acyclic`,
      `withoutCycles`,
      `exprWithVars`,
      `copy`,
    ],
    call(x, nameAllocator, unenv = new Map, maxDepth = 0) {
      // nameAllocator is a function(Object, Free) that either returns a new unique name (if !Free) or can mark a previously-allocated name as free.
      const currentAncestors = new Set, needsNaming = new Set
      const parents = new Map
      if (nameAllocator === undefined) {
        let n = 0
        nameAllocator = (_, undo) => undo === undefined && 'v'+n++
      }
      let depth = 0
      markParents(x, 0, x)
      liftChildDependencies(x)
      const children = new Map
      invertParents(x)
      const names = new Map
      const result = unbindChildren(x)
      return noCycles(result)

      function preserve(x) { return _isLabel(x) || _isStylableDOM(x) || typeof x == 'string' && x.length<=2 || typeof x == 'number' }
      function markParents(x, _i, parent) {
        if (preserve(x)) return
        if (unenv.has(x)) return
        try {
          if (maxDepth && depth && depth % maxDepth === 0 && _isArray(x)) needsNaming.add(x)
          ++depth
          if (!parents.has(x)) { // Set the immediate parent.
            parents.set(x, parent)
            currentAncestors.add(x)
            if (_isArray(x))
              x.forEach(markParents)
            currentAncestors.delete(x)
          } else { // Seen this twice or more; find the least common ancestor.
            needsNaming.add(x)
            let old = parents.get(x)
            while (!currentAncestors.has(old) && parents.has(old) && old !== parents.get(old))
              old = parents.get(old)
            parents.set(x, old)
          }
        } finally { --depth }
      }
      function liftChildDependencies(x, p) { // If a needsNaming subtree has needsNaming nodes, lift their parents to the outermost one.
        if (preserve(x)) return
        if (currentAncestors.has(x)) return
        if (unenv.has(x)) return
        if (needsNaming.has(x)) {
          const prev = parents.get(x)
          if (p !== undefined && !currentAncestors.has(parents.get(x))) parents.set(x, p)
          if (prev !== x) p = prev
        }
        currentAncestors.add(x)
        if (_isArray(x))
          for (let i = 0; i < x.length; ++i)
            liftChildDependencies(x[i], p)
        currentAncestors.delete(x)
      }
      function invertParents(x) { // From deep parent refs, to lists of deep children.
        if (preserve(x)) return
        if (currentAncestors.has(x)) return
        if (unenv.has(x)) return
        currentAncestors.add(x)
        if (needsNaming.has(x)) {
          const p = parents.get(x)
          if (!children.has(p)) children.set(p, [])
          children.get(p).push(x)
        }
        parents.delete(x)
        if (_isArray(x))
          x.forEach(invertParents)
      }
      function unbindChildren(x, ignoreEnv = false, ignoreName = false) {
        if (!ignoreName && names.has(x)) return !unenv.has(x) && unenv.set(x, names.get(x)), names.get(x)
        if (!ignoreEnv && unenv.has(x)) return unenv.get(x) === unbindChildren && unenv.set(x, x.slice()), unenv.get(x)
        if (preserve(x)) return unenv.set(x,x), x
        if (!_isArray(x)) return unenv.set(x,x), x
        const ch = children.get(x)
        children.delete(x)
        let copy
        if (ch) {
          const ctx = new Map
          copy = [bound, ctx, x]
          unenv.set(x, copy)
          for (let i = 0; i < ch.length; ++i) {
            let name
            while (!name || currentAncestors.has(name))
              name = nameAllocator(ch[i], undefined)
            if (typeof name == 'string') name = [label, name]
            currentAncestors.add(name)
            if (x === ch[i]) unenv.set(copy, x)
            unenv.set(ch[i], name)
            names.set(ch[i], name)
          }
          for (let i = 0; i < ch.length; ++i)
            ctx.set(unenv.get(ch[i]), unbindChildren(ch[i], true, true))
          if (!ignoreName && names.has(x))
            copy[2] = names.get(x)
          else
            copy[2] = unbindChildren(x, true, true)
        } else {
          if (_isVar(x)) return unenv.set(x,x), x
          let changed = false
          unenv.set(x, unbindChildren)
          for (let i = 0; i < x.length; ++i) {
            const v = unbindChildren(x[i])
            if (v !== x[i]) {
              if (!changed) {
                copy = unenv.get(x) !== unbindChildren ? unenv.get(x) : x.slice()
                changed = true
                unenv.set(x, copy)
              }
              copy[i] = v
            }
          }
          if (!changed && unenv.get(x) === unbindChildren) copy = x, unenv.set(x, x)
        }
        if (ch) // Deallocate spots for children.
          ch.forEach(c => (nameAllocator(undefined, names.get(c)), currentAncestors.delete(names.get(c))))
        return copy
      }
      function noCycles(x) {
        // Throw if x has cycles.
        if (!noCycles.s) noCycles.s = new Set
        if (unenv.has(x)) return x
        if (noCycles.s.has(x)) throw console.trace("Cycles", result), "Cycles"
        noCycles.s.add(x)
        if (x instanceof Map) x.forEach(v => v !== x && noCycles(v))
        if (_isArray(x)) x.forEach(noCycles)
        noCycles.s.delete(x)
        return x
      }
    },
  },

  error:{
    docs:`\`(error …Causes)\`: throws an error when executed, containing useful information as to its likely cause.
Indicates a bug in the code, and is mostly intended to be presented to the user so that code does not go this way.`,
    examples:[
      [
        `((error 'x'))`,
        `(error 'x')`,
      ],
      [
        `add 1 (error 'bad stuff')`,
        `(error 'bad stuff')`,
      ],
      [
        `add (mul 3 (error 'uh')) 2`,
        `error 'uh'`,
      ],
    ],
    lookup:{
      jsRejected:__is(`jsRejected`),
      fast:__is(`errorFast`),
      stack:__is(`errorStack`),
    },
    call(...msg) { throw [error, ...msg] },
  },

  errorFast:{
    docs:`Faster error-throwing, for things unlikely to be shown to the user.`,
    call() { if (!errorFast.e) errorFast.e = error(`An error has occured.`);  throw errorFast.e },
  },

  errorStack:{
    docs:`Adds the execution stack to the raised error.`,
    call(...msg) { throw [error, ...msg, 'at', _resolveStack(undefined, 2)] },
  },

  parseURL:{
    docs:`\`(parseURL URL)\` or \`(parseURL URL Lang Binds)\`: fetches and parses the contents at URL.`,
    await:true,
    call(url, lang = fancy, binds = Self.ctx, style = false) {
      return fetch(url, {mode:'cors'}).then(r => r.arrayBuffer())
      .then(buf => new TextDecoder().decode(new Uint8Array(buf)))
      .then(txt => parse(txt, lang, binds, {style, sourceURL:url}))
    },
  },

  _resolveStack:{
    docs:`If lines are marked, this resolves the JS stack trace to the network's functions.`,
    Initialize() {
      _resolveStack.functions = Object.create(null)
      _resolveStack.location = new WeakMap
    },
    call(stack = new Error().stack || '', skipFrames = 1) {
      return stack.trim().split('\n').map((L,i) => {
        if (i < skipFrames) return
        const loc = /(?: \(|@)(.+):(\d+):(\d+)\)?$/.exec(L)
        if (!loc) return L
        let sourceURL = loc[1]
        const main = _resolveStack.functions[sourceURL] || Initialize
        let line = +loc[2], column = +loc[3]
        if (column !== column) return
        const lines = main.lines
        if (lines) {
          // let i
          // for (i = 0; i < lines.length; i += 2)
          //   if (lines[i] >= line) break
          // Or, in binary search:
          let l = 0, r = lines.length>>>1
          while (l < r) {
            const m = (l+r)>>>1
            if (lines[m<<1] < line) l = m+1
            else r = m
          }
          let i = l<<1
          if (lines[i] < line) ++i
          const sub = lines[i-1]
          if (main === Initialize && typeof sub == 'function' && (typeof document == ''+void 0 || sourceURL === String(document.location))) {
            const localLine = line - lines[i-2], str = _unevalFunction(sub)[1].split('\n')[localLine]
            return [sub, str.slice(0, column) + '/* here */' + str.slice(column)]
          } else {
            // Look up the original sourceURL:line:column in .location, or return sub.
            const locs = _resolveStack.location
            let s = sub
            if (locs.has(s))
              [sourceURL, line, column] = locs.get(s)
            else if (_cameFrom.m && _cameFrom.m.has(s) && locs.has(s = _cameFrom.m.get(s)))
              [sourceURL, line, column] = locs.get(s)
            else if (_cameFrom.m && _cameFrom.m.has(s) && locs.has(s = _cameFrom.m.get(s)))
              [sourceURL, line, column] = locs.get(s)
            else return sub
          }
        }
        return sourceURL+':'+line+':'+column
      }).filter(x => x)
      // .functions (an object from sourceURL to function with .lines), .location (a WeakMap from expr to [sourceURL, line, column])
    },
  },

  _isError(v) { return _isArray(v) && (v[0] === error || v[0] === jsRejected) },

  elem:{
    docs:`\`(elem TagName Content Extra)\`: creates an HTML DOM element.`,
    nameResult:[
      `element`,
      `DOM`,
      `HTML`,
    ],
    lookup:{
      button:__is(`button`),
      files:__is(`files`),
      url:__is(`url`),
      clone:__is(`elemClone`),
      insert:__is(`elemInsert`),
      remove:__is(`elemRemove`),
      collapse:__is(`elemCollapse`),
      value:__is(`elemValue`),
    },
    call(tag, content, extra) {
      if (typeof document == ''+void 0) return _isArray(content) ? content.join('') : content
      if (typeof tag == 'string' && content === undefined) return document.createElement(tag)

      const r = defines(tag, elem)
      if (typeof r == 'function') return r(tag, content, extra)

      if (typeof tag != 'string') error("Invalid elem tag:", tag)
      if (content != null && typeof content != 'string' && !_isArray(content) && !(content instanceof Node))
        errorStack("Invalid elem content:", content)
      const el = document.createElement(tag)
      _elemAppend.to = el, _elemAppend(content)
      return el
    },
  },

  _elemAppend(ch) {
    // Out-of-document DOM append.
    if (_isArray(ch)) ch.forEach(_elemAppend)
    else if (ch && ch.parentNode) _elemAppend.to.append(elemClone(ch))
    else if (ch !== undefined) _elemAppend.to.append(ch)
  },

  elemClone(el) {
    const copy = el.cloneNode(false)
    if ('to' in el) elemValue(copy, el.to)
    if (el.special) copy.special = el.special, typeof copy == 'function' && copy.special(el, copy)
    if (el.onchange) copy.onchange = el.onchange
    if (el.isWindow) copy.isWindow = true
    if (el.isREPL) copy.isREPL = true
    for (let ch = el.firstChild; ch; ch = ch.nextSibling)
      copy.appendChild(elemClone(ch))
    return copy
  },

  structured:{
    docs:`\`(structured Arrays)\`: shows deep structure of \`Arrays\` (consisting of acyclic or tree arrays and strings and DOM elements): wraps each sub-array in \`<node>\`.`,
    call(x) {
      // structured (('Hello there.') ' ' ('General Kenobi!'))
      if (typeof Node != ''+void 0) {
        // Turn arrays into <node>s.
        const cache = new Map
        return print(x)
        function print(x) {
          if (cache.has(x)) return cache.get(x)
          if (_isArray(x)) return cache.set(x, elem('node', x.map(print))), elemValue(cache.get(x), x), cache.get(x)
          if (typeof x == 'string' || x instanceof Node) return x
          throw "Bad structure"
        }
      } else {
        // Use offsets with proper depth for pretty-printing.
        // …or just join them, whatever.
        if (_isArray(x)) return x.map(structured).join('')
        if (typeof x == 'string') return x
        throw 'Bad structure'
      }
    },
  },

  structuredSentence(str) {
    // '{hello there}, {general kenobi}' — in DOM, each curly-bracketed sentence fragment gets wrapped in a <span>.
    if (typeof document == ''+void 0) return str.replace(/{|}/g, '')
    let i = 0
    return parseStr(true)
    function parseStr(top) {
      const a = ['']
      for (; i < str.length && (i && str[i-1] === ' ' || str[i] !== '}'); ++i)
        if (i+1 < str.length && str[i] === '{' && str[i+1] !== ' ') ++i, a.push(parseStr(), '')
        else a[a.length-1] += str[i]
      if (!a[a.length-1]) a.pop()
      const el = elem('text', a)
      return !top && elemValue(el, a), el
    }
  },

  refs:{
    docs:`\`(refs Global)\`: returns {{all other globals that} {{this one} (likely) refers to}}.
\`(refs)\`: returns the {full {global reference} graph}.`,
    call(f) {
      if (f) {
        const set = new Set
        const keywords = new Set(['const', 'try', 'if', 'function', 'new', 'typeof', 'void', 'return', 'else', 'instanceof', 'catch', 'finally', 'let', 'throw', 'while', 'for', 'continue', 'break', 'undefined', 'null', 'true', 'false', 'switch', 'case'])
        let n = 0
        function handle(f) {
          if (n && _invertBindingContext(Self.ctx).has(f)) return set.add(f)
          if (++n > 9000) error('too big', [...set])
          if (set.has(f)) return; else set.add(f)
          if (defines(f, deconstruct)) f = deconstruct(f)
          if (typeof f == 'function') _highlightGlobalsInString(_unevalFunction(f)[1], s => !keywords.has(s) && set.add(Self.ctx.get(label(s))), true)
          if (f instanceof Map) f.forEach((v,k) => (handle(k), handle(v)))
          else if (_isArray(f)) f.forEach(handle)
          else if (f && f[defines.key])
            Object.keys(f[defines.key]).forEach(k => (handle(concept.idToKey[+k]), handle(f[defines.key][k])))
          else if (f && typeof f == 'object') f !== defines(Self, lookup) && Object.keys(f).forEach(k => handle(f[k]))
        }
        handle(f)
        if (set.has(quote)) set.delete(quote), set.add(quote)
        if (set.has(_extracted)) set.delete(_extracted), set.add(_extracted)
        set.delete(f)
        return [...set]
      } else {
        if (refs.cache) return refs.cache
        const r = new Map
        Self.ctx.forEach(v => v && r.set(v, refs(v)))
        return refs.cache = r
      }
    },
  },

  refd:{
    docs:`\`(refd Global)\`: returns {{all other globals that} {{this one} is (likely) referenced in}}.
\`(refd)\`: returns the {full {global back-reference} graph}.`,
    Initialize(net) {
      // Warn about unused private variables (quite expensive to compute, so we hide that).
      if (typeof document != ''+void 0)
        setTimeout(() => Object.keys(net).forEach(k => k[0] === '_' && !refd(net[k]).length && console.warn('Unused private:', k)), 10000)
    },
    call(f) {
      if (f) {
        return refd().get(f) || []
      } else {
        if (refd.cache) return refd.cache
        const r = new Map
        refs().forEach((tos, from) => tos.forEach(to => {!r.has(to) && r.set(to, []), r.get(to).push(from)}))
        r.forEach((tos, from) => r.set(from, tos))
        return refd.cache = r
      }
    },
  },

  sizeof:{
    docs:`\`(sizeof Global)\`: returns a global's approximate size, where namespace-parents get children added, and privates have their sizes distributed among users
\`(sizeof)\`: returns a hierarchy of sizes.`,
    call(g) {
      if (!sizeof.sz) {
        sizeof.sz = new Map
        const bonus = new Map
        Self.ctx.forEach((v,k) => fill(v, k[1][0] === '_'))
        bonus.forEach((n,g) => {
          for (; g; g = lookup.parents.get(g) || Self) {
            if (sizeof.sz.get(g)) sizeof.sz.set(g, sizeof.sz.get(g) + n)
            if (g === Self) return
          }
        })
        bonus.clear()
        sizeof.sz.forEach((s,g) => !s && sizeof.sz.delete(g))
        function fill(g, isPrivate) {
          if (!g || sizeof.sz.has(g)) return
          const s = serialize(deconstruct(g)).length
          if (!isPrivate) {
            sizeof.sz.set(g, s)
            let p = lookup.parents.get(g)
            if (p === undefined) p = Self
            bonus.set(p, (bonus.get(p) || 0) + s)
          } else {
            const p = refd(g)
            for (let i=0; i<p.length; ++i)
              bonus.set(p[i], (bonus.get(p[i]) || 0) + s / p.length)
          }
        }
      }
      return !g ? hierarchy(sizeof.sz, Self) : sizeof.sz.get(g)
    },
  },

  _highlightGlobalsInString:{
    docs:`Just some approximation. Wraps potential references to globals in <known>.
Also wraps numbers in <number>.
Also wraps links in <a>.
Also wraps C-style comments in <unimportant>.
Also wraps C-style strings in <string>.`,
    call(str, wrapper = s => elem('known', s), noResult = false) {
      if (_isArray(str) && str.length == 1) str = str[0]
      if (typeof str != 'string') return str
      if (str.length > 100000) return str

      if (!_highlightGlobalsInString.regex) {
        const regexSrc = ['\\s+', '[0-9]+(?:\\.[0-9+])?', '(?:file|https)://(?:[^\\s\'"`:]|:/)+']
        Self.ctx.forEach((v,k) => regexSrc.push(k[1].replace(/[^_a-zA-Z0-9]/g, s => '\\'+s)))
        regexSrc.sort((a,b) => b.length - a.length)
        regexSrc.push('//.+', '/\\*[^]+?\\*/')
        regexSrc.push("[a-z]'")
        regexSrc.push("'[^\\n']*'", '"[^\\n"]*"')
        regexSrc.push("`[^`]*`")
        _highlightGlobalsInString.regex = new RegExp(regexSrc.join('|'), 'g')
      }
      const regex = _highlightGlobalsInString.regex
      regex.lastIndex = 0
      if (!regex.test(str)) return str

      const result = !noResult && [str]
      regex.lastIndex = 0
      while (true) {
        const s = !noResult ? result[result.length-1] : str
        if (typeof s != 'string') break
        let r = regex.exec(s)
        if (!r) break
        r = r[0]
        const end = regex.lastIndex, start = end - r.length
        let el
        if (r === ' ' || r && !r.trim())
          !noResult && (el = elem('space', r))
        else if (+r === +r)
          !noResult && (el = elemValue(elem('number', r), +r))
        else if (r.slice(0,8) === 'https://' || r.slice(0,7) === 'file://')
          !noResult && (el = elem(url, r))
        else if (r.slice(0,2) === '//' || r.slice(0,2) === '/*' && r.slice(-2) === '*/')
          !noResult && (el = elem('unimportant', r))
        else {
          if (start > 0 && /[_a-zA-Z0-9\.'"`]/.test(s[start-1])) continue
          if (end < s.length && /[_a-zA-Z0-9:'"`]/.test(s[end])) continue
          if (r[0] === "'" && r.slice(-1) === "'" || r[0] === '"' && r.slice(-1) === '"' || r[0] === "`" && r.slice(-1) === "`")
            !noResult && (el = elem('string', r))
          else if (r.length != 2 || r[1] !== "'")
            el = wrapper(r), typeof document != ''+void 0 && el instanceof Element && Self.ctx.has(label(r)) && elemValue(el, Self.ctx.get(label(r)))
          else
            el = r
        }
        if (!noResult) {
          result.pop()
          start && result.push(s.slice(0, start))
          result.push(el)
          end < s.length && result.push(s.slice(end))
          regex.lastIndex = 0
        }
      }
      return result
    },
  },

  style:{
    docs:`An overridable-by-language function that turns {{a serialize/parse node}, {its value}, and {unbound representation}} into a displayed node.`,
    call(s,v,u) { return s },
  },

  nameResult:{
    docs:`\`(nameResult Expr)\`: provides a list of suggestions for naming Expr. Used in \`serialize\` for more human-readable graph serializations.`,
    call(func) { return typeof func == 'string' && +func !== +func && func.length < 20 && !/\s/.test(func) ? [func] : _isArray(defines(func, nameResult)) ? defines(func, nameResult) : typeof defines(func, nameResult) == 'string' ? [defines(func, nameResult)] : null },
  },

  serialize:{
    docs:`\`(serialize Expr)\` or … or \`(serialize Expr Language Bindings Options)\`: serializes Expr into a string or a DOM tree (that can be parsed to retrieve the original structure).

Options must be undefined or a JS object like { style=false, observe=false, collapseDepth=0, collapseBreadth=0, maxDepth=∞, offset=0, offsetWith='  ', space=()=>' ', nameResult=false, deconstructPaths=false, deconstructElems=false, dontBindTopLevel=false }.`,
    philosophy:`In theory, having symmetric parse+serialize allows updating the language of written code via "read in with the old, write out with the new", but we don't curently do that here. Maaaybe mention that in a tutorial, once we have human-friendly rewriting?`,
    examples:[
      [
        `serialize ^(parse '12')`,
        `"parse '12'"`,
      ],
    ],
    lookup:{
      label:__is(`label`),
      bound:__is(`bound`),
      unbound:__is(`unbound`),
      style:__is(`style`),
      parse:__is(`parse`),
      nameResult:__is(`nameResult`),
      _whetherToColorVariables:__is(`_whetherToColorVariables`),
      rest:__is(`rest`),
    },
    Initialize() {
      // Store styling options in JS objects.
      serialize.dom = {
        style:true,
        observe:true,
        nameResult:true,
        collapseDepth:8,
        collapseBreadth:32,
      }
      serialize.consoleColored = {
        style:true,
        nameResult:true,
        maxDepth:3,
      }
    },
    call(arr, lang, ctx, opt) {
      let breakLength = opt && opt.breakLength
      const collapseDepth = opt && opt.collapseDepth || 0
      const collapseBreadth = opt && opt.collapseBreadth || 0
      const maxDepth = opt && opt.maxDepth
      const offset = opt && opt.offset !== undefined ? opt.offset : 0
      const offsetWith = opt && opt.offsetWith !== undefined ? opt.offsetWith : '  '
      const space = opt && opt.space !== undefined ? opt.space : () => ' '
      const doNameResult = opt && opt.nameResult
      const deconstructPaths = opt && opt.deconstructPaths || false
      const deconstructElems = opt && opt.deconstructElems || false
      const doObserve = opt && opt.observe || false
      const dontBindTopLevel = opt && opt.dontBindTopLevel || false

      if (!lang) lang = fancy
      const styles = opt && opt.style && defines(lang, style) || undefined

      const backctx = _invertBindingContext(serialize.ctx = ctx || Self.ctx)
      const deconstruction = new Map
      const named = new Set
      const lengths = new Map
      const boundToUnbound = new Map
      const unboundToBound = new Map
      let postDeconstructed
      const prevSrlzStyles = serialize.styles;  serialize.styles = styles
      try { postDeconstructed = deconstructed(arr) }
      finally { serialize.styles = prevSrlzStyles }
      deconstruction.clear()

      const resultElem = styles && typeof document != ''+void 0 && elem('serialization')
      if (resultElem) elemValue(resultElem, arr), resultElem.special = true

      if (doObserve) {
        const reserialize = _throttled(((el, arr, lang, ctx, opt) => {
          return b => el.isConnected ? el.replaceWith(serialize(arr, lang, ctx, opt && {...opt, observe:false})) : observe(b, reserialize, false)
        })(resultElem, arr, lang, ctx, opt), .1)
        unboundToBound.forEach((b,u) => {
          if (!backctx.has(b)) observe(b, reserialize, true)
        })
      }

      let n = 0
      const freeNames = []
      const nodeNames = styles && typeof document != ''+void 0 && new Map
      backctx.forEach((v,k) => (!dontBindTopLevel || k !== arr) && boundToUnbound.set(k,k))
      const u = unbound(postDeconstructed, nameAllocator, boundToUnbound, maxDepth)
      boundToUnbound.forEach((u,b) => {
        if (b === u) return
        _isArray(b) && b[0] === bound && ([u,b] = [b, valueOfUnbound(u)])
        if (unboundToBound.has(b)) b = unboundToBound.get(b)
        if (!unboundToBound.has(u) || !_isArray(b))
          unboundToBound.set(u, b),
          _isArray(u) && u[0] === bound && u[1] instanceof Map && u.length == 3 && unboundToBound.set(u[2], b)
      })
      boundToUnbound.clear()
      if (breakLength) breakLength -= offset * offsetWith.length

      let struct = [], len = 0
      emit(defines(lang, serialize), u)
      if (_isArray(struct) && struct.length == 1) struct = struct[0]

      const inResult = recCollapse(serializeLines(struct, offset))
      if (resultElem)
        return resultElem.append(inResult), resultElem
      else
        return inResult

      function emit(f, u, arg1, arg2, arg3, arg4) {
        if (typeof f == 'function') {
          let v = valueOfUnbound(u)
          if (typeof document != ''+void 0 && u instanceof Element && u.to !== v) elemValue(u, v)
          if (!styles) return unenv(u, v) === u ? f(emit, u, arg1, arg2) : ((struct || (struct = [])).push(unenv(u, v)), undefined)
          let prev = struct
          struct = undefined

          const unenved = unenv(u, v)
          let r
          if (unenved === u)
            r = f(emit, u, arg1, arg2, arg3, arg4)
          else
            struct = [unenved]

          if (struct) {
            if (_isArray(v) && v[0] === bound && v[1] instanceof Map && v.length == 3) v = v[2]
            const isStyled = struct.length == 1 && (_isArray(struct[0]) || typeof document != ''+void 0 && struct[0] instanceof Node)
            // Only style once.
            ;(prev || (prev = [])).push(isStyled ? struct[0] : styleNode(struct, u, v))
          }
          struct = prev
          return r
        } else if (typeof f == 'string') {
          len += f.length
          return (struct || (struct = [])).push(styles ? styleNode(f) : f), f
        } else if (typeof document != ''+void 0 && f instanceof Node)
          return ++len, (struct || (struct = [])).push(f), f
        else if (f === undefined)
          return len
        else return console.warn("Unknown type to emit:", f, _id(f)), emit(_colored(elemValue(elem('number', '<< id:'+_id(f)+' >>'), _id(f)), 4, 24))
      }
      function recCollapse(el, depth = 0) {
        if (!collapseDepth) return el
        if (typeof document == ''+void 0 || !(el instanceof Element) || el.tagName === 'NODE' && !('to' in el) || el.classList.contains('label')) return el
        if ((depth+1) % collapseDepth === 0)
          for (let ch of el.childNodes)
            recCollapse(ch, el.tagName === 'NODE' ? depth+1 : depth)
        else
          for (let ch = el.firstChild; ch; ch = ch.nextSibling)
            recCollapse(ch, el.tagName === 'NODE' ? depth+1 : depth)
        if (el.tagName === 'NODE')
          if (depth && depth % collapseDepth === 0) el = elemCollapse(el)
        if (collapseBreadth && typeof el.to != 'string')
          for (let i = Math.max(0, Math.floor((el.childNodes.length-2) / collapseBreadth)); i; --i)
            elemCollapse(el.childNodes[i * collapseBreadth], null)
        return el
      }

      function valueOfUnbound(u, depth = 0) {
        if (depth>2) return
        if (unboundToBound.has(u)) return unboundToBound.get(u)
        if (typeof document != ''+void 0 && u instanceof Element && 'to' in u)
          return u.to
        if (backctx.has(u)) return u
        if (_isDOM(u)) return u
        if (_isArray(u) && u.length == 1 && u[0] !== u) return valueOfUnbound(u[0], depth+1)
        if (_isArray(u) && u.length == 3 && u[0] === _extracted) return [_extracted, valueOfUnbound(u[1]), valueOfUnbound(u[2])]
        if (_isArray(u) && u[0] === label) return u
        return u // Deconstructions.
      }
      function styleNode(str, u, v) {
        if (!styles) return str
        !unboundToBound.has(u) && unboundToBound.set(u,v)
        const originalLen = lengths.get(str) || str && str.length
        if ((str === ' ' || typeof str == 'string' && !str.trim()) && u === undefined && v === undefined) return elem('space', str)

        // Associate with the value to bathe same-objects in the same light.
        const el = styles(str, v, u, ctx || Self.ctx)
        if (_isStylableDOM(el)) elemValue(el, v)

        return lengths.set(el, originalLen), el
      }
      function styleLabel(name, u, v) {
        return styleNode(_escapeLabel(name, lang), u, v)
      }
      function nameAllocator(x, free) {
        if (free === undefined) {
          // Try names, first suggestions by `nameResult` then previously-freed non-suggestion things then in-sequence.
          let s, suggested = false, suggestedI = 0, suggestions
          if (doNameResult && (_isArray(x) || typeof x == 'string'))
            suggestions = nameResult(_isArray(x) ? x[0] : x)
          do {
            if (suggestions && suggestedI < suggestions.length) suggested = true, s = suggestions[suggestedI++]
            else if (suggested = false, freeNames.length) s = freeNames.pop()
            else s = toString(n++, 'abcdefghijklmnopqrstuvwxyz')
          } while (named.has(s) || backctx && backctx.has(s))
          named.add(s)
          if (suggested) lengths.set(s,s)
          const styled = styleLabel(s, [label, s], x)
          if (typeof document != ''+void 0 && styled instanceof Node) nodeNames.set(styled, s)
          return styled
        } else {
          if (typeof document != ''+void 0 && free instanceof Node) free = nodeNames.get(free)
          if (_isLabel(free)) free = free[1]
          named.delete(free)
          if (lengths.get(free) === free) return lengths.delete(free)
          freeNames.push(free)
        }
      }
      function deconstructed(x) {
        // Return a copy of x with non-array non-string non-backctx things deconstructed.
        if (!deconstructElems && typeof document != ''+void 0 && x instanceof Element)
          return x.parentNode && x.isConnected && boundToUnbound.set(x, x = elemClone(x)), x
        if (deconstruction.has(x)) {
          if (deconstruction.get(x) === undefined) deconstruction.set(x, x.slice())
          x = deconstruction.get(x)
          if (deconstruction.has(x) && deconstruction.get(x) === undefined) deconstruction.set(x, x.slice())
          if (deconstruction.has(x)) x = deconstruction.get(x)
          return x
        }
        if (_isLabel(x)) return unboundToBound.set(x,x), named.add(x[1]), x
        if (backctx && backctx.has(x))
          if (!dontBindTopLevel || x !== arr)
            return unboundToBound.set(x,x), named.add(backctx.get(x)), x
        const original = x
        if (deconstructElems || !_isDOM(x))
          if (typeof x != 'string' && typeof x != 'number')
            if (!_isArray(x) || defines(x, construct) !== undefined)
              x = deconstruct(x, deconstructPaths)
        unboundToBound.set(x, original)
        deconstruction.set(original, x)
        if (_isArray(x)) {
          if (_isVar(x)) return x
          let copy, changed = false
          deconstruction.set(x, undefined)
          for (let i = 0; i < x.length; ++i) {
            const v = deconstructed(x[i])
            if (v !== x[i]) {
              if (!changed) {
                copy = deconstruction.get(x) || x.slice()
                changed = true
                unboundToBound.set(copy, original)
                deconstruction.set(original, copy), deconstruction.set(x, copy)
              }
              copy[i] = v
            }
          }
          if (!changed) deconstruction.set(x,x), copy = x
          return copy
        }
        return x
      }
      function toString(i, alphabet) {
        if (i < alphabet.length) return alphabet[i]
        return toString(Math.floor(i / alphabet.length), alphabet) + alphabet[i % alphabet.length]
      }
      function pprint(arr, breakLength) {
        if (!_isArray(arr) || hasNonString(arr)) return arr
        // Either join arr (of strings) inline, or realize it is too long.
        if (!arr.length) return arr
        let len
        if (breakLength != null) {
          len = lengths.get(arr[0]) || arr[0].length
          for (let i = 1; i < arr.length; ++i) {
            if (i > 1 && i < arr.length-1) len += space(arr[i-1], arr[i]).length || 0
            len += lengths.get(arr[i]) || arr[i].length
            if (breakLength != null && len >= breakLength) break
          }
        }
        if (breakLength == null || len + offsetWith.length-1 < breakLength) {
          const joined = arr.join('')
          const styled = styleNode(joined, arr, valueOfUnbound(arr.unbound))
          lengths.set(styled, len)
          return styled
        } else
          return arr
      }
      function hasNonString(r) {
        for (let i = 0; i < r.length; ++i) if (typeof r[i] != 'string') return true
      }
      function unenv(u,v) {
        if (backctx && backctx.has(v)) {
          if (dontBindTopLevel && v === arr) return u
          named.add(backctx.get(v))
          const name = backctx.get(v)
          return styleLabel(name, label(name), v)
        }
        return u
      }
      function pad(s, len) { return s.length >= len ? s : s + ' '.repeat(len - s.length) }
      function replaceSpaces(arr, str) {
        return !_isArray(arr) ? arr : arr.map(x => !el.trim() ? str : x)
      }
      function serializeLines(arr, depth = 0) {
        if (!_isArray(arr)) return arr
        const d = depth+1
        const serialized = pprint(arr.map(line => serializeLines(line, d)), breakLength && (breakLength - d * offsetWith.length))
        if (!_isArray(serialized)) return serialized
        
        if (hasNonString(serialized))
          return styleNode(serialized, arr.unbound, valueOfUnbound(arr.unbound))
        else {
          if (serialized[0] === '(') serialized[0] = pad('(', offsetWith.length)
          const s = replaceSpaces(serialized, '\n' + offsetWith.repeat(d)).join('')
          return styleNode(s, arr.unbound, valueOfUnbound(arr.unbound))
        }
      }
    },
  },

  elemValue:{
    docs:`If el, remember that it is a viewer of v. If !el, return an array of all in-document viewers of v.`,
    Initialize() {
      elemValue.obj = new WeakMap // from an object to array of elements with that as value.
      elemValue.val = new Map // from a value to array of elements with that as value.
      elemValue.resources = new Set // Objects that should be disposed when unneeded.
    },
    call(el, v) {
      if (!elemValue.empty) elemValue.empty = []
      if (typeof document == ''+void 0) return elemValue.empty
      if (_isArray(v) && v[0] === quote && v.length == 2) v = v[1]
      const m = v && typeof v == 'object' ? elemValue.obj : elemValue.val
      if (el instanceof Node) {
        if ('to' in el && m.has(el.to) && m.get(el.to).indexOf(el) >= 0)
          // If changing the value, remove the old one.
          m.get(el.to).splice(m.get(el.to).indexOf(el), 1)
        el.to = v
        if (defines(dispose, elemValue)(v))
          elemValue.resources.add(v)
        if (!m.has(v)) m.set(v, [])
        m instanceof Map && _limitMapSize(m, 100000)
        if (m.get(v).indexOf(el) >= 0) return el
        m.get(v).push(el)
        return el
      } else {
        if (m.has(v)) m.set(v, m.get(v).filter(el => el.isConnected))
        if (m.has(v) && !m.get(v).length) m.delete(v)
        return m.get(v) || elemValue.empty
      }
      // .empty (just an always-empty array), .obj, .val
    },
  },

  _revisitElemValue(el) {
    // Garbage-collects unneeded DOM elements.
    // After replacing elemValue.obj (WeakMap) and elemValue.val (Map) with clean versions, call this on Self.into.
    let [ch] = interrupt(_revisitElemValue)
    try {
      _checkInterrupt(_revisitElemValue)
      if (ch === undefined && el instanceof Node && 'to' in el)
        elemValue(el, el.to)
      if (ch === undefined) ch = el.firstChild
      for (; ch; ch = ch.nextSibling)
        _revisitElemValue(ch)
    } catch (err) { if (err === interrupt) interrupt(_revisitElemValue, _tmp().length=0, _tmp().push(ch));  throw err }
  },

  _whetherToColorVariables:[
    __is(`settings`),
    false,
    `Whether we should paint labels for the same values into the same color, in serializations.`,
  ],

  _valuedColor(v) {
    // Returns v's previously displayed element color (for highlighting of the same things) or a new one.
    if (!_whetherToColorVariables[1]) return 'var(--main)'
    if (!_valuedColor.m) _valuedColor.m = new Map
    if (_valuedColor.m.has(v)) {
      const r = _valuedColor.m.get(v)
      _valuedColor.m.delete(v), _valuedColor.m.set(v, r)
      return r
    }
    const prevPure = call.pure
    call.pure = false
    const colors = [randomNat(256), randomNat(256), randomNat(256)]
    call.pure = prevPure
    const min = 64, max = 384, Sum = colors[0]+colors[1]+colors[2]
    if (Sum < min) colors[0] *= min/Sum, colors[1] *= min/Sum, colors[2] *= min/Sum
    if (max < Sum) colors[0] *= max/Sum, colors[1] *= max/Sum, colors[2] *= max/Sum
    const c = 'rgb(' + colors + ')'
    _valuedColor.m.set(v, c)
    _limitMapSize(_valuedColor.m, 100000)
    return c

    // .enabled
  },

  js:{
    docs:`A namespace of everything pertaining to the host language, JavaScript.
Somewhat usable in a REPL.`,
    lookup:{
      instanceof:__is(`instanceof`),
      continue:__is(`continue`),
      break:__is(`break`),
      finally:__is(`finally`),
      typeof:__is(`typeof`),
      return:__is(`return`),
      throw:__is(`throw`),
      catch:__is(`catch`),
      while:__is(`while`),
      void:__is(`void`),
      else:__is(`else`),
      for:__is(`for`),
      let:__is(`let`),
      new:__is(`new`),
      switch:__is(`switch`),
      case:__is(`case`),
      function:__is(`function`),
      if:__is(`if`),
      const:__is(`const`),
      try:__is(`try`),
    },
    REPL:__is(`false`),
    parse(match) {
      const struct = [jsEval, '']
      let n = 0, ctx, expr = ''
      while (true) {
        const str = match(/[^]*/y)
        if (str && str.indexOf('ⴲ')>=0) throw "ⴲ is used internally; use another char eternally"
        if (str) expr += str
        const r = match(_specialParsedValue)
        if (r !== undefined) {
          const name = 'ⴲ'+(n++).toString(36)
          expr += ' '+name+' ', (ctx || (ctx = new Map)).set(name, r.to)
        }
        if (str === undefined && r === undefined) break
      }
      struct[1] = expr
      if (ctx) struct[2] = ctx
      return struct
    },
    serialize(match, u) {
      if (u[0] !== jsEval || typeof u[1] != 'string' || u[2] && (!_isArray(u[2]) || u[2][0] !== map) || u.length > 3) {
        if (typeof document != ''+void 0 && _isArray(u) && u[0] instanceof Element)
          return match(_fancyTopLevel, u)
        if (typeof document != ''+void 0 && _isArray(u) && u[0] === jsRejected && typeof u[1] == 'string' && u.length == 2)
          return match(elem('error', u[1]))
        u = bound(_invertBindingContext(Self.ctx), u)
        if (typeof uneval != ''+void 0) u = [jsEval, uneval(u)]
        else u = [jsEval, JSON.stringify(u)]
      }
      if (typeof document == ''+void 0) {
        if (u.length != 2) throw "Wrong count of args for JS code"
        match(u[1])
        return
      }
      const special = / ⴲ[0-9a-zA-Z]+ /g, str = u[1], ctx = u[2][0].call(...u[2])
      let r, i = 0
      while (r = special.exec(str)) {
        match(str.slice(i, special.lastIndex - r[0].length))
        match(defines(js, serialize), ctx.get(r[0].slice(1,-1)))
        i = special.lastIndex
      }
      match(str.slice(i))
    },
    style(struct) {
      if (!_isArray(struct)) return struct
      return elem('span', struct.map(s => typeof s != 'string' ? s : elem('span', _highlightGlobalsInString(s))))
    },
    philosophy:`JS (and the web ecosystem) is a seemingly-unimpressive language that aims to take over all aspects of computing, in a manner similar to the ones before but completely safe and universal and ultimately as little loss in performance as is possible. Like attracts like, and Conceptual is written in JS.`,
  },

  _extracted:{
    docs:`ONLY for parsing \`c:x\`. …I guess returning this to a \`REPL\` binds a label to a value, too.`,
    call(c,x) { return [_extracted, c, x] },
  },

  _unrollRest(a) {
    // (1 2 (rest (3 4 5)) 6 7) —> (1 2 3 4 5 6 7).
    if (_isArray(a))
      for (let i = 0; i < a.length; ++i)
        if (_isArray(a[i]) && a[i][0] === rest && a[i].length == 2)
          !_isArray(a[i][1]) && error('Expected the array to unroll'),
          a.splice(i, 1, ...a[i][1])
  },

  parse:{
    docs:`\`(parse String)\` or … or \`(parse String Language Bindings Options)\`: parses String into the graph represented by it, returning \`(Expr StyledInput)\`.`,
    future:`Tab-completion for parsing (with a special element), showing regexes/strings that did not match at the requested position.`,
    philosophy:`Options is a JS object like { style=false, sourceURL='' }.
And parsing is more than just extracting meaning from a string of characters (it's also styling and associating source positions).`,
    Initialize() {
      parse.dom = {
        style:true,
      }
    },
    call(str, lang, ctx, opt) {
      if (typeof str == 'string') str = str ? [str] : []
      if (_isDOM(str)) str = _innerText(str) // Don't even attempt to cache subtrees
      if (typeof str != 'string' && !_isArray(str)) throw 'Expected a string, or an array of strings and special elements'
      if (ctx === undefined) ctx = Self.ctx

      if (!lang) lang = fancy
      const styles = opt && opt.style ? defines(lang, style) || style : undefined
      const sourceURL = opt && opt.sourceURL || ''

      let i = 0, lastI = 0
      const struct = styles && [], Unbound = styles && new Map

      let line = 1, column = 1, lineLengths = sourceURL && []
      let prevI = 0, localS = str[0], localI = 0, curBegin = 0
      function localUpdate(newI) {
        // Update localS/localI/curBegin to match the index.
        let prev = prevI;  prevI = newI
        while (newI < curBegin && localI > 0) {
          moveLines(prev, prev = curBegin)
          localS = str[--localI]
          curBegin -= typeof localS == 'string' ? localS.length : 1
        }
        while (newI >= curBegin + (typeof localS == 'string' ? localS.length : 1) && localI < str.length) {
          const next = curBegin + (typeof localS == 'string' ? localS.length : 1)
          moveLines(prev, prev = next)
          curBegin = next
          localS = str[++localI]
        }
        moveLines(prev, newI)
      }
      function moveLines(prevI, newI) {
        if (!sourceURL) return
        if (typeof localS != 'string') return column += newI - prevI
        for (let i = prevI; i < newI; ++i)
          if (localS[i - curBegin] === '\n') lineLengths[line++] = column, column = 1
          else ++column
        for (let i = prevI; i-- > newI; )
          if (localS[i - curBegin] === '\n') column = lineLengths[--line]
          else --column
      }

      function match(f, arg1, arg2, arg3, arg4) {
        // If a function, call it;
          // if _specialParsedValue or string or regex, match and return one if possible;
          // if a number, set global index; if undefined, get global index.
        if (typeof f == 'function') {
          const start = i, startLen = struct && struct.length
          const startLine = line, startColumn = column
          const r = f(match, _specialParsedValue, arg1, arg2, arg3, arg4)
          _unrollRest(r)
          if (start < i) {
            if (struct) {
              localUpdate(lastI)
              lastI < i && typeof localS == 'string' && struct.push(localS.slice(lastI - curBegin, i - curBegin))
              if (startLen < struct.length-1 || typeof struct[startLen] == 'string') {
                const a = struct.splice(startLen)
                Unbound.set(a, r), struct.push(a)
              }
            }
            localUpdate(i)
          }
          if (sourceURL && _isArray(r)) lines.set(r, startLine), columns.set(r, startColumn)
          lastI = i
          return r
        } else if (f === _specialParsedValue) {
          const s = localS
          if (localS != null && typeof localS != 'string') {
            return ++i, struct && lastI < i && struct.push(s), lastI = i, localUpdate(i), s
          }
        } else if (typeof f == 'string') {
          if (typeof localS == 'string' && localS.slice(i - curBegin, i+f.length - curBegin) === f)
            return i += f.length, struct && lastI < i && struct.push(localS.slice(lastI - curBegin, i - curBegin)), lastI = i, localUpdate(i), f || true
          return false
        } else if (f instanceof RegExp) {
          if (typeof localS != 'string') return
          if (!f.sticky) throw "Matched regexp must be sticky"
          f.lastIndex = i - curBegin
          const r = f.exec(localS)
          if (r)
            return i+=r[0].length, struct && lastI < i && struct.push(localS.slice(lastI - curBegin, i - curBegin)), lastI = i, localUpdate(i), r[0]
        } else if (typeof f == 'number') {
          if (f !== f>>>0) throw "A number must be an index"
          i = f, localUpdate(i)
        } else if (f === undefined)
          return i
        else throw "Invalid argument to match"
      }
      match.notEnoughInfo = msg => { throw localI === str.length ? ['give more', msg] : msg }

      let lines = sourceURL && new Map, columns = sourceURL && new Map

      const u = !lang ? match(parser.topLevel) : match(defines(lang, parse))
      if (localI < str.length) throw 'Superfluous characters at the end: ' + (typeof localS == 'string' ? localS.slice(i - curBegin) : '···')

      // Do binding with the original⇒copy map preserved so that we can style structure bottom-up properly.
      const env = (styles || sourceURL) && new Map
      let b = styles || sourceURL ? bound(ctx, u, true, env) : bound(ctx, u, true)
      try { b = makeGraph(b) } catch (err) { console.error('When parsing', ...str, ':\n', err) } // This swallowing is not user-friendly.

      function styleNode(struct) {
        if (typeof document != ''+void 0 && struct instanceof Node) return struct
        let unb, v
        if (!Unbound.has(struct) && typeof struct == 'string' && ctx.has(label(struct)))
          unb = label(struct), v = ctx.get(label(struct))
        else
          unb = Unbound.get(struct), v = ctx.has(unb) ? ctx.get(unb) : env.has(unb) ? env.get(unb) : unb
        if (typeof struct == 'string' && (struct === ' ' || !struct.trim()) && unb === undefined && v === undefined)
          return elem('space', struct)
        if (_isArray(struct)) {
          struct = struct.map(styleNode)
          if (struct.length == 1 && (_isArray(struct[0]) || typeof document != ''+void 0 && struct[0] instanceof Node))
            return struct[0]
        }
        if (sourceURL && lines.has(unb))
          (_resolveStack.location || (_resolveStack.location = new WeakMap)).set(v, [sourceURL, lines.get(unb), columns.get(unb)])
        const s = styles(struct, v, unb, ctx)
        if (typeof Element != ''+void 0 && s instanceof Element) elemValue(s, v)
        return s
      }
      styles && Unbound.set(struct, u)
      let styled = styles && styleNode(struct)
      return styles ? [b, styled] : b
    },
  },

  _specialParsedValue:{
    docs:`When matched in \`parse\` rules, represents a value that should be preserved as-is (as it likely comes from a special DOM element/reference).`,
  },

  _basicEscapeLabel(s) { return s && !/[=!:\s\(\)\[\]\{\}>\+\-\*\/\&\|\.'"`\,\\\ue000-\uf8ff]/.test(s) ? s : '`' + s.replace(/`/g, '``') + '`' },

  _basicUnescapeLabel(s) { return s[0] === '`' ? s.slice(1,-1).replace(/``/g, '`') : s },

  _basicLabel(match, u) { // a, qwer, `a`; 12, 1e6
    const legal = /-?(?:[0-9]e-|[0-9]E-|[^=!:\s\(\)\[\]\{\}>\+\-\*\/\&\|\.'"`\,\\\ue000-\uf8ff]|\.[0-9])+/y
    if (u === _specialParsedValue) {
      const r = match(/`(?:[^`]|``)*`/y)
      if (r !== undefined) return label(r.slice(1,-1).replace(/``/g, '`'))

      const n = match(legal)
      if (n === undefined) return
      return +n === +n || n === 'NaN' ? +n : label(n)
    }
    if (typeof u == 'number') match(''+u)
    else if (_isLabel(u) && typeof u[1] == 'string') {
      legal.lastIndex = 0, legal.test(u[1])
      match(u[1].length && legal.lastIndex === u[1].length ? u[1] : '`' + u[1].replace(/`/g, '``') + '`')
    } else console.error('Invalid label', u), error("Invalid label", u)
  },

  _basicString(match, u) { // '...''...' or "...""..."
    if (u === _specialParsedValue) {
      let r = match(/'(?:[^']|'')*'/y)
      if (r !== undefined) return r.slice(1,-1).replace(/''/g, "'")
      r = match(/"(?:[^"]|"")*"/y)
      if (r !== undefined) return r.slice(1,-1).replace(/""/g, '"')
      return
    }
    // Unquote with both quotes, and return the min-length one.
    if (typeof u != 'string') throw "Expected a string"
    const a = '"' + u.replace(/"/g, '""') + '"'
    const b = "'" + u.replace(/'/g, "''") + "'"
    return match(a.length < b.length ? a : b)
  },

  _basicExtracted(match, u, base) { // c:x
    if (u === _specialParsedValue) {
      const key = match(base)
      if (key !== undefined && match(/\s*:\s*/y)) {
        const v = match(base)
        v === undefined && match.notEnoughInfo("Expected an actual value to be extracted")
        return [_extracted, key, v]
      } else return key
    }
    if (_isArray(u) && u[0] === _extracted && u.length == 3)
      match(base, u[1]), match(':'), match(base, u[2])
    else match(base, u)
  },

  _basicMany(match, u, syntax, base) { // a b c c:x
    // syntax: [null, ' ', /\s+/y], or ['map', ', ', /\s*,\s*/y]
    if (u === _specialParsedValue) {
      const arr = !syntax || !syntax[0] ? [] : [syntax[0]]
      let ctx
      while (true) {
        match(syntax && syntax[2] || /\s+/y)
        const v = match(_basicExtracted, base)
        if (v === undefined) break
        if (_isArray(v) && v[0] === _extracted)
          (ctx || (ctx = new Map)).set(v[1], v[2])
        else arr.push(v)
      }
      if (ctx) return [bound, ctx, arr]
      return arr
    }
    if (!_isArray(u)) throw "Must be an array"
    let ctx
    if (_isArray(u) && u[0] === bound && u[1] instanceof Map && u.length == 3)
      ctx = u[1], u = u[2]
    _needsGrouping.pos && _needsGrouping.pos.delete(match())
    if (_isArray(u))
      for (let b = false, j = !syntax || !syntax[0] ? 0 : 1; j < u.length; ++j) {
        b ? match(syntax && syntax[1] || ' ') : (b = true)
        match(_basicExtracted, u[j], base)
      }
    else
      match(_basicExtracted, u, base)
    if (ctx) ctx.forEach((v,k) => (match(syntax && syntax[1] || ' '), match(_basicExtracted, [_extracted, k, v], base)))
  },

  _basicCall(match, u, _, base) { // (a b c c:x)
    return _matchBracketed(match, u, _basicMany, null, '(', ')', base)
  },

  _fancyMap(match, u, _, base) { // {a b c c:x}
    return _matchBracketed(match, u, _basicMany, 'map', '{', '}', base)
  },

  _matchBracketed(match, u, base, head, open, close, arg1, arg2) { // (base)
    if (u === _specialParsedValue) {
      if (!match(open)) return
      const arr = base(match, u, head && [label(head)], arg1, arg2)
      if (!match(close)) match.notEnoughInfo('Expected a closing bracket')
      return arr
    }
    match(open), base(match, u, head && [_unctx(head)], arg1, arg2), match(close)
  },

  _basicValue(match, u, callSyntax, base) { // String or label or call.
    const isEm = base !== _basicOutermost
    if (u === _specialParsedValue) {
      if (isEm && match('?')) return label('input')
      let r
      if ((r = match(_specialParsedValue)) !== undefined) return r
      if ((r = match(_basicString)) !== undefined) return r
      if ((r = match(_basicLabel)) !== undefined) return r
      if (isEm && (r = match(_fancyMap, null, base)) !== undefined) return r
      if ((r = match(callSyntax, null, base)) !== undefined) return r
      return
    }
    else if (typeof u == 'string')
      match(_basicString, u)
    else if (typeof u == 'number' || _isLabel(u))
      match(_basicLabel, u)
    else if (_isArray(u) && u[0] === _extracted && u.length == 3)
      match(_basicExtracted, u, base)
    else if (_isArray(u) && u[0] === _unctx('map'))
      match(_fancyMap, u, null, base)
    else if (_isArray(u))
      match(callSyntax, u, null, base)
    else match(u)
  },

  _needsGrouping(match) { return _needsGrouping.pos && _needsGrouping.pos.has(match()) },

  _emitGrouping(match, need) {
    if (need === undefined)
      return _needsGrouping(match) ? (match('['), true) : false
    if (need) match(']')
  },

  pow(a,b) {
    return Math.pow(a,b)
  },

  _unctx(s) { return serialize.ctx.get(label(s)) },

  _matchLtR(match, u, topLevel, base, reprs) { // [[a+b]+c]+d
    // Parses/serializes two-arg functions as left-to-right strings.
    //   reprs: ['add', '+', /\+/y, 'sub', '-', /\-/y].
    if (u === _specialParsedValue) {
      let a = match(base), op
      if (a === undefined) return
      outer: while (true) {
        for (let i=0; i < reprs.length; i += 3)
          if (op = match(reprs[i+2])) {
            const b = match(base)
            b === undefined && match.notEnoughInfo('Expected the second arg of '+op.trim())
            a = [label(reprs[i]), a, b]
            continue outer
          }
        break
      }
      return a
    }
    for (let i=0; i < reprs.length; i += 3) {
      if (_isArray(u) && u.length == 3 && u[0] === _unctx(reprs[i])) {
        const g = _emitGrouping(match)
        _matchLtR(match, u[1], topLevel, base, reprs), match(reprs[i+1]), match(base, u[2])
        _emitGrouping(match, g)
        return
      }
    }
    match(base, u, topLevel)
  },

  _matchRtL(match, u, topLevel, baseLeft, baseRight, reprs) { // a^[b^[c^d]]
    // reprs: ['pow', '**', /\s*\*\*\s*/y]
    if (u === _specialParsedValue) {
      let a = match(baseLeft), op
      if (a === undefined) return
      for (let i=0; i < reprs.length; i += 3)
        if (op = match(reprs[i+2])) {
          const b = match(baseRight)
          b === undefined && match.notEnoughInfo('Expected the second arg of '+op.trim())
          a = [label(reprs[i]), a, b]
        }
      return a
    }
    if (_isArray(u) && u.length == 3)
      for (let i=0; i < reprs.length; i += 3)
        if (u[0] === _unctx(reprs[i])) {
          const g = _emitGrouping(match)
          match(_matchRtL, u[1], topLevel, baseLeft, baseRight, reprs), match(reprs[i+1]), match(baseRight, u[2])
          _emitGrouping(match, g)
          return
        }
    match(baseLeft, u, topLevel)
  },

  _matchUnary(match, u, topLevel, base, reprs) { // ^x, …x, \x
    // reprs: ['quote', '^', /^/y]
    if (u === _specialParsedValue) {
      let op
      for (let i=0; i < reprs.length; i += 3) {
        if (op = match(reprs[i+2])) {
          const b = match(base)
          b === undefined && match.notEnoughInfo('Expected the arg of '+op.trim())
          return [label(reprs[i]), b]
        }
      }
      return match(base)
    }
    if (_isArray(u) && u.length == 2)
      for (let i=0; i < reprs.length; i += 3)
        if (u[0] === _unctx(reprs[i])) {
          const g = _emitGrouping(match)
          match(reprs[i+1]), match(base, u[1])
          _emitGrouping(match, g)
          return
        }
    base(match, u, topLevel)
  },

  _matchSequence(match, u, topLevel, base, head, parseSep, separator = parseSep) {
    if (u === _specialParsedValue) {
      const a = match(base)
      if (a === undefined) return
      let arr
      while (match(parseSep)) {
        const b = match(base)
        if (b === undefined) match.notEnoughInfo("Expected the next base value after "+separator)
        if (!arr) arr = [label(head), a]
        arr.push(b)
      }
      return arr || a
    }
    if (_isArray(u) && u[0] === _unctx(head) && u.length > 2) {
      const g = _emitGrouping(match)
      for (let i = 1; i < u.length; ++i)
        i > 1 && match(separator), match(base, u[i])
      _emitGrouping(match, g)
    } else match(base, u, topLevel)
  },

  _fancyOutermost(match, u, topLevel) {
    let ctx, needsGrouping = !topLevel || match()
    if (_isArray(u) && u[0] === bound && u[1] instanceof Map && u.length == 3)
      ctx = u[1], u = u[2], needsGrouping = needsGrouping && match('[')
    const r = fancyFunc(match, u, topLevel)
    if (ctx) ctx.forEach((v,k) => (match(' '), match(_basicExtracted, [_extracted, k, v], fancyFunc))), needsGrouping && match(']')
    return r

    // It's not efficient, but the important thing is that it's quite readable.
    function fancyFunc(match, u, topLevel) { // \f
      return _matchUnary(match, u, topLevel, fancyLast, ['func', '\\', '\\'])
    }
    function fancyLast(match, u, topLevel) { // a,b,c
      return _matchSequence(match, u, topLevel, fancySumSub, 'last', /\s*\,\s*/y, ',')
    }
    function fancySumSub(match, u, topLevel) { // a+b, a-b
      return _matchLtR(match, u, topLevel, fancyMultDiv, ['add', '+', /(\s*)\+\1/y, 'sub', '-', /(\s*)-(?!>)\1/y])
    }
    function fancyMultDiv(match, u, topLevel) { // a*b, a/b
      return _matchLtR(match, u, topLevel, fancyPow, ['mul', '*', /(\s*)\*\1/y, 'div', '/', /(\s*)\/\1/y])
    }
    function fancyPow(match, u, topLevel) { // a**b
      return _matchRtL(match, u, topLevel, fancyRead, fancyPow, ['pow', '**', /(\s*)\*\*\1/y])
    }
    function fancyRead(match, u, topLevel) { // a.b
      return _matchLtR(match, u, topLevel, fancyRest, ['readAt', '.', /(\s*)\.\1/y])
    }
    function fancyRest(match, u, topLevel) { // …a, ...a; ^a
      return _matchUnary(match, u, topLevel, fancyGrouping, ['quote', '^', '^', 'rest', '…', /…|\.\.\./y])
    }
    function fancyGrouping(match, u, topLevel) { // [x]
      if (u === _specialParsedValue) {
        if (!match(/\s*\[\s*/y)) return _basicValue(match, u, _basicCall, _fancyOutermost)
        const r = _basicMany(match, u, null, _fancyOutermost)
        if (r === undefined || !r.length) match.notEnoughInfo('Expected a value to group')
        if (!match(/\s*\]\s*/y)) match.notEnoughInfo("Expected a closing grouping bracket")
        return r.length == 1 ? r[0] : r
      }
      // Serialize grouping brackets via first trying to serialize without them, then emitting them if arrived at the same spot.
      //   It's not fast, but `basic` and `fast` exist to make that not a problem.
      if (!_needsGrouping.pos) _needsGrouping.pos = new Set
      const pos = match()
      if (_needsGrouping.pos.has(pos)) { // Emit base if the second pass is over.
        return _basicValue(match, u, !topLevel ? _basicCall : _basicMany, _fancyOutermost)
      }
      _needsGrouping.pos.add(pos)
      try {
        return match(_fancyOutermost, u, topLevel)
      } finally { _needsGrouping.pos.delete(pos) }
    }
  },

  _basicOutermost(match, u) { return _basicValue(match, u, _basicCall, _basicOutermost) },

  _fancyTopLevel(match, u) { // (f); a b c c:x; a:b
    if (u === _specialParsedValue) {
      let arr = _basicMany(match, u, null, _fancyOutermost)
      match(/\s+/y)
      if (!_isArray(arr)) return arr

      if (!arr.length) match.notEnoughInfo("No value at top level")
      if (arr.length == 1) arr = arr[0]
      const inner = arr[0] === bound ? arr[2] : arr
      if (arr[0] === bound && arr[1] instanceof Map && arr[1].size == 1 && !inner.length)
        return [_extracted, ...arr[1].keys(), ...arr[1].values()]
      if (!_isArray(inner)) return inner
      if (arr[0] === bound && arr[1] instanceof Map && inner.length == 1)
        arr[2] = arr[2][0]

      return arr
    }
    _fancyOutermost(match, !_isArray(u) || u.length <= 1 ? [u] : u, true)
  },

  _basicTopLevel(match, u) { // (f); a b c c:x; a:b
    if (u === _specialParsedValue) {
      let arr = _basicMany(match, u, null, _basicOutermost)
      match(/\s+/y)
      if (!_isArray(arr)) return arr

      if (!arr.length) match.notEnoughInfo("No value at top level")
      if (arr.length == 1) arr = arr[0]
      const inner = arr[0] === bound ? arr[2] : arr
      if (arr[0] === bound && arr[1] instanceof Map && arr[1].size == 1 && !inner.length)
        return [_extracted, ...arr[1].keys(), ...arr[1].values()]
      if (!_isArray(inner)) return inner
      if (arr[0] === bound && arr[1] instanceof Map && inner.length == 1)
        arr[2] = arr[2][0]

      return arr
    }
    return _basicMany(match, !_isArray(u) || u.length <= 1 ? [u] : u, null, _basicOutermost)
  },

  basic:{
    docs:`A language for ordered-edge-list graphs. Text, numbers, structures, and connections.
\`label\`, \`'string'\`, \`"string"\`, \`(0 1)\`, \`(a:2 a)\`.
This is a {more space-efficient than binary} representation for graphs of arrays.`,
    philosophy:`Lisp was nice for its time, but now we can have nice UI and AI, so Lisp needed a remastering.`,
    style:__is(`_basicStyle`),
    parse:__is(`_basicTopLevel`),
    serialize:__is(`_basicTopLevel`),
    REPL:`also see \`(docs)\` or \`tutorial tutorial\`.`,
    insertLinkTo:__is(`_basicLinkTo`),
    _escapeLabel:__is(`_basicEscapeLabel`),
    _unescapeLabel:__is(`_basicUnescapeLabel`),
  },

  fancy:{
    docs:`A language for ordered-edge-list graphs (like \`basic\`) with some syntactic conveniences.
\`label\`, \`'string'\`, \`"string"\`, \`(0 1)\`, \`(a:2 a)\`; \`1+2\`, \`\\?*2 5\`, \`2*[1+2]\`.`,
    style:__is(`_basicStyle`),
    parse:__is(`_fancyTopLevel`),
    serialize:__is(`_fancyTopLevel`),
    REPL:`also type \`tutorial tutorial\` or \`(docs)\`.`,
    insertLinkTo:__is(`_basicLinkTo`),
    _escapeLabel:__is(`_basicEscapeLabel`),
    _unescapeLabel:__is(`_basicUnescapeLabel`),
    examples:[
      `Binary operators must have the same whitespace characters before and after:`,
      [
        `1 - 2 -3`,
        `-1 -3`,
        true
      ],
      `Operators' labels can be re-bound:`,
      [
        `1+2 add:array`,
        `1 2`,
        true
      ],
      [
        `\[1+2] func:quote add:mul`,
        `1*2`,
        true
      ],
    ],
  },

  _basicLinkTo(r, el) {
    // Create a name not seen in editor, replace el with name, insert newline and name and ':' and el at editor's end, and return a name element.
      // × (1 2 3)  ⇒  a a  a:(1 2 3)
    const ed = _isEditable(el), names = new Set
    if (el === ed) return
    _visitText(ed, str => typeof str == 'string' && names.add(str))
    let i = 0, name, rBecomes, elBecomes
    if (el.tagName === 'EXTRACTED') el = el.lastChild
    if (el.parentNode.tagName === 'EXTRACTED' && el.parentNode.parentNode.contains(r.commonAncestorContainer))
      name = _innerText(el.parentNode.firstChild).join('')
    else if (el.classList.contains('label'))
      name = _innerText(el).join('')
    else if (el.tagName === 'NUMBER')
      name = el.innerText
    else {
      const v = el.to
      const proposals = _isArray(v) && nameResult(v) || []
      while (names.has(name = i < proposals.length ? proposals[i] : toString(i - proposals.length, 'abcdefghijklmnopqrstuvwxyz'))) ++i
      const topLevel = el.parentNode === ed || el.parentNode.parentNode === ed
      rBecomes = document.createTextNode(name)
      r.deleteContents(), r.insertNode(rBecomes), r.setEndAfter(rBecomes)
      el.replaceWith(elBecomes = document.createTextNode(name))
      if (_isArray(v) && v.length > 1 && topLevel && !el.classList.contains('hasOperators') && el.firstChild.textContent[0] !== '(')
        el = elem('node', ['(', el, ')'])
      ed.append('\n'+name+':', el)
    }
    if (!rBecomes) {
      rBecomes = document.createTextNode(name)
      r.deleteContents(), r.insertNode(rBecomes), r.setEndAfter(rBecomes)
    }
    ensureSpacesAround(ed, rBecomes, elBecomes)


    function toString(i, alphabet) {
      if (i < alphabet.length) return alphabet[i]
      return toString(Math.floor(i / alphabet.length), alphabet) + alphabet[i % alphabet.length]
    }
    function space() { return document.createTextNode(' ') }
    function ensureSpacesAround(el, before1, before2) {
      const legal = /[=!:\s\(\)>\+\-\*\/\&\|]/
      let spaceBefore = true, spaceAfter = false
      _visitText(el, (str, ch) => {
        if (spaceAfter)
          str && !legal.test(str[0]) && ch.parentNode.insertBefore(space(), ch),
          spaceBefore = true, spaceAfter = !str
        if (ch === before1)
          !spaceBefore && before1.parentNode.insertBefore(space(), before1), spaceAfter = true
        if (ch === before2)
          !spaceBefore && before2.parentNode.insertBefore(space(), before2), spaceAfter = true
        spaceBefore = !str || legal.test(str[str.length-1])
      })
    }
  },

  _basicStyle(s,v,u, ctx) {
    if (typeof s == 'string' && v === undefined && u === undefined) return s
    if (typeof u == 'number' && _isArray(s) && s.length == 1 && typeof s[0] == 'string')
      return _colored(elem('number', s[0]), 4, 24) // underline
    if (typeof u == 'string' && _isArray(s) && s.length == 1 && typeof s[0] == 'string') {
      if (typeof document == ''+void 0) return _colored(s[0], 32) // green
      return elem('string', [s[0][0], _highlightGlobalsInString(s[0].slice(1,-1)), s[0].slice(-1)])
    }
    if (_isArray(v) && v[0] === _extracted && v.length == 3 && s.length == 3 && typeof document != ''+void 0) {
      elemValue(s[2], s[0].to)
      s[1] = elem('operator', s[1])
      const el = elem('extracted', s)
      el.title = 'extracted', el.classList.add('hasOperators')
      return el
    }
    if (typeof document != ''+void 0 && v instanceof Map && v.size > 1 && s.length > 1) {
      // Construct a <table>, with brackets and `map` outside of it, and each key-value pair having its own <tr>.
      let i, start = (s[0].textContent || s[0]) === '{' ? 0 : (s[0].textContent || s[0]) === '(' ? 2 : 1
      if (!start) s.splice(1, 0, ''), start = 1
      let end = (s[s.length-1].textContent || s[s.length-1]) === ')' ? s.length-1 : s.length-2
      const rows = []
      let a = 1
      for (i = start; i < end; ) {
        if (i + 4 > s.length) break
        if ((s[i].textContent || s[i]).trim()) break
        if ((s[i+2].textContent || s[i+2]).trim()) break
        if (s[i+1].nodeName === 'EXTRACTED') break
        if (s[i+3].nodeName === 'EXTRACTED') break
        const row = elem('tr', [elem('td', [s[i], s[i+1]]), elem('td', [s[i+2], s[i+3]])])
        if (_isArray(v)) elemValue(row, rest([v[++a], v[++a]]))
        else elemValue(row, [label])
        rows.push(row)
        i += 4
      }
      if (i > start) s = [...s.slice(0,start), elem('table', rows), ...s.slice(i)]
    }
    const A = s[0], B = s[s.length-1]
    if (_isArray(s) && typeof s[0] == 'string' && (A === '(' || A === '[' || A === '{') && (B === ')' || B === ']' || B === '}'))
      s[0] = _colored(elem('bracket', s[0]), 33), // brown
      s[s.length-1] = _colored(elem('bracket', s[s.length-1]), 33)

    let hasOperators = false
    if (_isArray(s) && _isArray(u) && !_isLabel(u) && s.length > 1)
      for (let i = 0; i < s.length; ++i)
        if (s[i] && typeof s[i] == 'string' && s[i] !== '[' && s[i] !== ']')
          s[i] = elem('operator', s[i]), hasOperators = true

    const backctx = _invertBindingContext(ctx)
    if (_isLabel(u) && backctx.has(v) && u[1] === backctx.get(v))
      return _colored(elem('known', s), 1, 0) // bold
    let el = elem('node', s)
    if (typeof document != ''+void 0) {
      if (hasOperators)
        el.classList.add('hasOperators')
      if (!_isArray(v))
        el.classList.add('nonArray')
      if (_isLabel(u))
        el.style.color = _valuedColor(v), el.classList.add('label')
      el.title = _isArray(u) && u.length && backctx.has(u[0]) ? backctx.get(u[0]) : ''
    } else {
      if (_isLabel(u))
        el = _colored(el, [34, 36, 35][randomNat(3)]) // Cycle through blue, cyan, magenta.
    }
    return el
  },

  stringLanguage:{
    docs:`Whatever you type in is just one string.`,
    parse(match, u) {
      return match(/[^]*/y) || ''
    },
    serialize(match, u) {
      if (typeof u != 'string')
        error('Expected a string, got', u)
      return match(u)
    },
  },

  fast:{
    docs:`A \`basic\`-like language that can be parsed and serialized fast.
Intended to only be used for internal inter-memory communication (of generic bound graphs).
Does not merge the parsed arrays.`,
    examples:[
      [
        `fast.parse '(12)'`,
        `12`,
      ],
      [
        `fast.parse '(a:(b) b:(a) a)'`,
        `a a:((a))`,
      ],
      [
        `fast.parse (fast.serialize ^(a b a:(b) b:(a)))`,
        `a b a:(b) b:(a)`,
      ],
      [
        `fast.serialize ^(a b a:(b) b:(a)) undefined (jsEval '{humanReadableMode:true}')`,
        `'(&0:(&1) &1:(&0) (&0 &1))'`,
      ],
      [
        `fast.parse '("a""b")'`,
        `'a"b'`,
      ],
    ],
    lookup:{
      parse(str, ctx) {
        // ctx is an object here, not a Map from label objects like in `parse`.
        if (!str) throw "Expected input"
        if (!ctx) ctx = defines(Self, lookup)
        const regex = /[ \n]+|:|\(|\)|`(?:[^`]|``)*`|'(?:[^']|'')*'|"(?:[^"]|"")*"|[^ \n:\(\)'"`]+|$/g
        let [result, i = 0, j, ctxs = [ctx], visited = new Set] = interrupt(fast)
        regex.lastIndex = i
        if (j === undefined) regex.test(str), j = regex.lastIndex
        try {
          if (result === undefined)
            result = getCall()
          if (i < str.length) throw "Too much information: " + str.slice(i)
          if (result.length != 1) throw "Wrong count of top-level args"
          return makeGraph(result[0]) // Note: This is unsafe.
          //   (To make it safe, inspect all available functions, and make the dangerous ones unable to execute here.)
          // That top-level pair of brackets serves as a language marker.
        } catch (err) { if (err === interrupt) interrupt(fast, _tmp().length=0, _tmp().push(result, i, j, ctxs, visited));  throw err }

        function nextToken() { [i, j] = [j, (regex.test(str), regex.lastIndex)] }

        function getCall() {
          if (str[i] !== '(') throw "Expected an opening bracket"
          nextToken()
          const arr = []
          let bindings
          ctxs.push(bindings)
          while (i < str.length && str[i] !== ':' && str[i] !== ')') {
            const v = getValue()
            if (str[i] === ':') {
              if (typeof v != 'string') throw "Only labels can be bound"
              nextToken()
              if (!bindings) ctxs[ctxs.length-1] = Object.create(null), bindings = []
              const k = getValue()
              bindings.push(v)
              ctxs[ctxs.length-1][v] = k
            } else
              arr.push(v)
            skipWs()
          }
          if (bindings) {
            // Scoped binding is convenient, but the most general way to do it involves either
              // walking the graph each time (simple) or copying backpatching information to parents (complicated).
              // So we make fast.serialize put every node in the top-level namespace.
            for (let j = 0; j < bindings.length; ++j)
              ctxs[ctxs.length-1][bindings[j]] = labelBind(ctxs[ctxs.length-1][bindings[j]])
            for (let j = 0; j < arr.length; ++j)
              arr[j] = labelBind(arr[j])
            visited.clear()
          }
          ctxs.pop()
          nextToken()
          return arr
        }
        function labelLookup(name) {
          // If a name defined in an outer scope is later re-bound by the inner scope, this will bind to the outer before we know it.
            // This language is supposed to be fast, so we just left this in. It is not a problem with how we serialize things here.
          if (str[i] === ':') return name
          if (+name === +name) return +name
          for (let i = ctxs.length-1; i >= 0; --i)
            if (ctxs[i] && name in ctxs[i]) return ctxs[i][name]
          return label(name)
        }
        function labelBind(arr) {
          // Unlike `bound` used in `basic`, this binds in-place.
          if (!_isArray(arr)) return arr
          if (arr[0] === label && typeof arr[1] === 'string' && arr.length === 2) {
            const ctx = ctxs[ctxs.length-1]
            return arr[1] in ctx ? ctx[arr[1]] : arr
          }
          if (visited.has(arr)) return arr; else visited.add(arr)
          for (let j = 0; j < arr.length; ++j)
            arr[j] = labelBind(arr[j])
          return arr
        }
        function skipWs() { if (str[i] === ' ' || !str.slice(i,j).trim()) nextToken() }
        function getValue() {
          if (i >= str.length) throw "Expected a value"
          skipWs()
          if (str[i] === '(') return getCall()
          if (str[i] === ':' || str[i] === ')') return
          const I = i, J = j;  nextToken()
          if (str[I] === "'" && str[J-1] === "'") return str.slice(I+1,J-1).replace(/''/g, "'")
          if (str[I] === '"' && str[J-1] === '"') return str.slice(I+1,J-1).replace(/""/g, '"')
          if (str[I] === '`' && str[J-1] === '`') return labelLookup(str.slice(I+1,J-1).replace(/``/g, '`'))
          return labelLookup(str.slice(I,J))
        }
      },
      serialize(expr, ctx, opt) {
        // Walk expr and name all referenced-more-than-once nodes, then output them then expr.

        const humanReadableMode = opt && opt.humanReadableMode

        const backctx = _invertBindingContext(ctx || Self.ctx)
        const visited = new Set, names = new Map, deconstruction = new Map
        let n = 0
        mark(expr)
        visited.clear()
        const result = []
        result.push('(')
        names.forEach((named,arr) => (result.push(named, ':'), putValue(arr, true), result.push(' ')))
        putValue(expr)
        result.push(')')
        return result.join('')

        function name(v) { names.set(v, humanReadableMode || n > 0xe000 ? '&'+(n++).toString(36) : String.fromCharCode(128 + ++n)) }
        function mark(arr) {
          if (typeof arr == 'number' && (''+arr).length < 3) return
          if (visited.has(arr)) return !names.has(arr) && name(arr); else visited.add(arr)
          if (deconstruction.has(arr)) arr = deconstruction.get(arr)
          if (backctx.has(arr)) return
          if (!_isArray(arr)) {
            if (typeof arr == 'string' || typeof arr == 'number') return
            if (arr instanceof Map || defines(arr, deconstruct))
              deconstruction.set(arr, deconstruct(arr)), arr = deconstruction.get(arr)
            else throw "Cannot serialize a not-`deconstruct`ible not-an-array"
          }
          if (!_isArray(arr)) throw "All values must be string/number or Map or array or deconstruct to an array"
          if (arr[0] === label && typeof arr[1] == 'string' && arr.length == 2) {
            if (/[\x80-\ue000]/.test(arr[1])) throw "An exotic label to "+arr[1]+" detected"
            return
          }
          arr.forEach(mark)
        }
        function isCall(v) { return _isArray(v) && !names.has(v) && !backctx.has(v) && (v[0] !== label || typeof v[1] != 'string' || v.length != 2) }
        function putCall(v) {
          result.push('(')
          for (let i = 0; i < v.length; ++i)
            i && !isCall(v[i-1]) && !isCall(v[i]) && result.push(' '), putValue(v[i])
          result.push(')')
        }
        function putValue(v, ignoreName = false, ignoreMark = false) {
          if (!ignoreName && names.has(v)) return result.push(names.get(v))
          if (backctx.has(v)) return result.push(backctx.get(v))
          if (deconstruction.has(v)) v = deconstruction.get(v)
          if (typeof v == 'number') return result.push(''+v)
          if (typeof v == 'string')
            return result.push(v.indexOf("'") < 0 ? "'" + v.replace(/'/g, "''") + "'" : '"' + v.replace(/"/g, '""') + '"')
          if (!_isArray(v)) throw "Not-an-array unknown value"
          if (v[0] === label && typeof v[1] == 'string' && v.length == 2) {
            if (/[ \n:\(\)'"`]/.test(v[1])) return result.push('`' + v[1].replace(/`/g, '``') + '`')
            return result.push(v[1])
          }
          return putCall(v)
        }
      },
    },
    parse(match) {
      // Just forward a string to fast.parse.
      const str = match(/[^]*/y) || ''
      if (match(_specialParsedValue)) throw "`fast` is string-only"
      return lookup(basicFast, 'parse')(str)
    },
    serialize:__is(`_basicTopLevel`),
    philosophy:`This could be made even more efficient (make it variable-pointer-length binary, serialize numbers as binary), but we aren't that crazy yet.`,
  },

  _continuation:{
    docs:`\`(_continuation)\`⇒State and \`(_continuation State)\`: saves/restores the environment and interrupt state.`,
    call(state) {
      if (state === undefined) {
        const r = Object.create(null)
        Object.assign(r, call.env)
        if (_isArray(r[_id(interrupt)]))
          r.set(interrupt, r[_id(interrupt)].map(x => x instanceof Map ? new Map(x) : !_isArray(x) ? x : x.slice()))
        Object.seal(r)
        return r
      } else
        Object.assign(call.env, r)
    },
  },

  _causeInterrupt(cause, toReEnter = undefined) {
    call.env[_id(step)] = _checkInterrupt.step
    call.env[_id(_checkInterrupt)] = cause
    call.env[_id(call)] = call.depth
    if (toReEnter) _jobs.reEnter = toReEnter
    throw interrupt
  },

  _checkInterrupt:{
    docs:`Checks whether an interrupt is appropriate right now.`,
    call(cause) {
      if (interrupt.noInterrupt) return
      if (!call.env[_id(interrupt)] || !call.env[_id(interrupt)].length) {
        // If we stepped enough (ensuring progress), and either we have worked for 10 ms or the nesting depth is as wanted by _pausedToStepper, interrupt.
        if (call.env[_id(step)])
          --call.env[_id(step)], ++_checkInterrupt.step
        else if (call.env[_id(_pausedToStepper)] !== undefined && call.depth <= call.env[_id(_pausedToStepper)])
          _causeInterrupt(cause, _pausedToStepper)
        else if (_timeSince(interrupt.started, true) > 10)
          ++_checkInterrupt.step, _causeInterrupt(cause) // Ensure progress.
        else _checkInterrupt.step = 0
      }
      // .step (the counter of interrupt checks, for fully consistent restoration)
    },
  },

  step:{
    docs:`\`(step ^Expr)\`: pauses execution and displays stepping interface to the user, then evaluates Expr.`,
    examples:[
      [
        `step ^[1*2+3*4+5*6+7*8+9*10+11*12+13*14]`,
      ],
    ],
    call(expr) {
      let [int = true] = interrupt(step)
      try {
        if (int) int = false, _causeInterrupt(expr, _pausedToStepper)
        if (int === false) ++_checkInterrupt.step, int = 0
        return call(expr)
      } catch (err) { if (err === interrupt) interrupt(step, _tmp().length=0, _tmp().push(int));  throw err }
    },
  },

  _pausedToStepper:{
    docs:`Pauses a job and displays its stepping interface: ▶ ▲ ⇉ ▼.
Not for use inside that paused job.
(Technically, we could use \`_continuation\` to save/restore execution states, and also have per-cause breakpoints, and also have a way of inspecting function state when interpreting, but debuggers are dime-a-dozen anyway, so who cares.)`,
    call(expr, env, then, before = env[_id(log)] || Self.into) {
      _cancel(env)
      env[_id(_pausedToStepper)] = Infinity
      // Hide `before`, and insert a <div> with <button>s inside.
      const el = elem('div')
        const justRun = elem('button', '▶')
        justRun.onclick = () => onClick()
        justRun.title = `Run normally`
        const lessDepth = elem('button', '▲')
        lessDepth.onclick = () => onClick(-1)
        lessDepth.title = `Step out
(Decrease function call depth)`
        const eqDepth = elem('button', '⇉')
        eqDepth.onclick = () => onClick(0)
        eqDepth.title = `Step over
(Equal function call depth)`
        const moreDepth = elem('button', '▼')
        moreDepth.onclick = () => onClick(Infinity)
        moreDepth.title = `Step in
(Increase function call depth)`
        el.append(justRun, lessDepth, eqDepth, moreDepth)
        elemValue(el, [expr, env, then])
      before.style.display = 'none'
      elemInsert(before.parentNode, el, before)

      function onClick(n) {
        // Show style, remove interface, remember to interrupt again, and re-schedule the job.
        _cancel(env)
        justRun.onclick = lessDepth.onclick = eqDepth.onclick = moreDepth.onclick = null
        before.style.removeProperty('display')
        el.remove() // (Not very efficient, destroying and re-creating the DOM for each step, but it works.)
        env[_id(_pausedToStepper)] = n !== undefined ? env[_id(call)]+n : undefined
        _schedule(expr, env, then)
      }
    },
  },

  _tmp() {
    // A little convenience method for getting `interrupt.tmp` in less characters.
    return interrupt.tmp
  },

  interrupt:{
    docs:`Used to make functions re-entrant in a non-interruptible host language, for better UX.
Define this to be \`false\` in a global if it will never interrupt.`,
    lookup:{
      check:__is(`_checkInterrupt`),
      continuation:__is(`_continuation`),
      step:__is(`step`),
    },
    philosophy:`Termination checking (totality) is unnecessary if the host can just interrupt and continue. In fact, it is harmful to provide a false assurance of everything terminating {in reasonable time}.
Interruption (and sandboxing) is absolutely essential for being able to actually use a program comfortably, and for stepping through the program, but no one buzzes about it. Probably because almost all rely on the OS to provide it via processes, and/or heuristic-based totality guarantees.

Technical details:
\`_causeInterrupt(cause)\` to interrupt execution.
Create function state in \`f\` like \`let [i = 0, j = 0] = interrupt(f)\`, in particular for loops. Make sure to put interruptible computations not here but inside the try/catch below, to not corrupt interrupt state.
Wrap function body after getting its state in \`try{…}catch(err){ if (err === interrupt) interrupt(f, _tmp().length=0, _tmp().push(i,j));  throw err }\` (\`...args\` in JS allocates, so this way tries to avoid that).`,
    Initialize() {
      interrupt.tmp = []
    },
    _cancel(stack) {
      // Dispose of all values (not lengths, nor causes) in the stack.
      if (!stack || !stack.length) return
      let end = stack.length-1
      while (end) {
        // stack[end] is the length.
        // stack[end - length] is the first item.
        // stack[end - length - 1] is the (cause or) previous length.
        const length = stack[end]
        const start = end - length
        for (let i = start; i < end; ++i)
          dispose(stack[i])
        end = start-1
        // --end // No causes.
      }
    },
    call(cause, got = undefined) {
      if (got === undefined) {
        // Collect items from the stack into tmp and return it.
        const tmp = interrupt.tmp
        if (!call.env || !call.env[_id(interrupt)]) return tmp.length = 0, tmp
        const stack = call.env[_id(interrupt)]
        if (!stack.length) return tmp.length = 0, tmp
        const end = stack.length-1
        const length = stack[end]
        tmp.length = length
        const start = end - length
        for (let i = start; i < end; ++i)
          tmp[i - start] = stack[i]
        stack.length = start

        /*
        // Check the cause.
        const got = stack.pop()
        if (got !== cause) {
          // Stack corruption.
          const tmpSlice = tmp.slice()
          tmp.length = 0
          errorStack("Interrupt stack corruption sometime before this — invalid cause: expected", cause, "but got", got, "in", stack, "with interrupt state", tmpSlice)
        }
        */

        return tmp
      }

      // Else store the contents of `interrupt.tmp` in the interrupt stack.

      if (!call.env[_id(interrupt)]) call.env[_id(interrupt)] = []
      const stack = call.env[_id(interrupt)]
      // stack.push(cause) // Allow checking the cause, so that debugging is easier.
      stack.push(...interrupt.tmp, interrupt.tmp.length), interrupt.tmp.length = 0

      // .tmp, .noInterrupt
    },
  },

  _cameFrom:{
    docs:`Provides a potential way to tell which value this one came from, by a transformation like \`bound\` or recording.`,
    call(to, from) {
      if (!_cameFrom.m) _cameFrom.m = new WeakMap
      if (to && typeof to == 'object') _cameFrom.m.set(to, from)
      return to
    },
  },

  Garbage:{
    docs:`It's a nice thought, but it doesn't play well with others.`,
    lookup:{
      philosophy:__is(`philosophy`),
      askUser:__is(`askUser`),
    },
  },

  _lineCount(str) {
    if (typeof str == 'number') return 0
    let i = 0, n = 0
    while ((i = str.indexOf('\n', i)+1) > 0) ++n
    return n
  },

  Rewrite:{
    docs:`\`(Rewrite)\`: view the next rewrite in an \`<iframe>\`.
Also is a namespace for rewriting \`Self\`'s code to a different form.

This makes \`Self\` open in the sense of "you can easily change any part of it to whatever you want, without anyone telling you to".`,
    lookup:{
      editRewrite:__is(`editRewrite`),
      extension:__is(`ToExtension`),
      readableJS:__is(`ToReadableJS`),
      scopedJS:__is(`ToScopedJS`),
    },
    philosophy:`Writing the system's code in a particular style allows it to be viewed/modified in the system by the user, preserving anything they want in the process without external storage mechanisms.
The correctness of quining of functions can be tested by checking that the rewrite-of-a-rewrite is exactly the same as the rewrite. Or by incorporating rewriting into the lifecycle.`,
    Initialize() {
      Rewrite.ctx = new Map(Self.ctx)
      Rewrite.ctx.delete(label('_globalScope'))
    },
    call() {
      const html = ToScopedJS(undefined, {into:'document.body', prefix:`<!doctype html>
<head>
  <meta charset=utf-8>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Conceptual</title>
  <link rel=icon type=image/png href=${BrowserIconURL}>
</head>
<body onerror="document.body.append(event, document.createElement('br'))">
  <noscript>This requires JS to run, and a fairly modern browser.</noscript>
  <script>
`}) + `  </${''}script>
</body>`
      const download = elem('a')
      download.download = 'index.html'
      const u = URL.createObjectURL(new Blob([html], {type:'text/html'}))
      download.href = u
      const i = setInterval(() => !download.isConnected && (clearInterval(i), URL.revokeObjectURL(u)), 60000)
      download.textContent = 'Download the next rewrite as an HTML file, or preview:'
      elemValue(download, html)
      const iframe = elem('iframe')
      iframe.title = 'Preview of the next rewrite'
      iframe.srcdoc = html
      const result = elem('div', iframe)
      result.classList.add('resizable')
      return elem('div', [download, result])
    },
  },

  BrowserIconURL:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAHaElEQVR4XuWbW8htUxTHnQ4P7l7Eg0KRu3POC5E4yp04lBRhh3g5cin3S1/ul3KJFye0ESXlIHfKcRLx4n6LQnkgL+4eEP/fao6vuec317ysvfb+6tujRnvtucYaY86xxphzjDHnWrZJO+yvW3PCkxM03LpQeH+C5kzdO0T4jfAL4bfCD1roV6l9Z+Gewl2FbwkfS/Beq3v3Zfq33o3joxjdspaHL1P7HRnG3L5SeHuE7lC1rREe6wYDyeXCOwt4QuLL/1z/XxY+I9wYef4Ktd1WwDcqP6aAoZidXcBwnWgu8Oi21fX5wnO8QYdsHlHDIMM7JR8LeliI7F88Pg842bluL5AfKuBpcciZPEI+FuIiwHZCtHtVTrq7j0me0kJbKp/HbxVipT87Xpj4fgV9GJHvKyCl+ZDvMWp4RXiRcM4poUD2PEnMEmrkGyMGj/x7hfTppcJOzMs3BZT6PPyfEOLLdwtXFwqMkfk+WSM/xmuDGi8Rwuf0wj418lEApvxh4UOQXSy8p4I+RbrC3ayRn+JX27cVKKDG764R/c09DR42+CNQMu+Uiq3p43oU8F8hZ0zrNOFJhfQlZKzzAHFCX/CsGD0pxFWzUKoAZm0mvT+yHOsIBo58WPdYlnorURwlxLqTUKIA3vxzQtb3zYX4K8qIwdFqxK8PFh4p3CIh/R/d28zd/1u/myZoUfzrwrcL5f8luoeEWGvSEnIKwJ8OcIyIuEqiQ38cdADFnRgZ3AtqO8G1c31chAbFE/hg1jXADE+EynPvCm9pe7hNAWjtPaE/29vaX9MRo91DF9cL/SXqWv23CZXrGz3GyL9B+GUXYXoGSyR8NiBeOTCQ39wLFUCEh/Z+EL4fCG/LG2r6SMeIIYjYmPmJ7wGu8VeT73e+hr9PG07uJFo7ePIXKMCP7d/Q3dUTUICxJHZHEV+7ht30SxDj5xZdB27PhQrYoBuHu5vzuYNZgJ/VYS6xQKcPC/AHhV9e7Rr863EH3qYA2gmUCJuBJotkUOTUls+T2JC38xtC3wr4SgLM1Jlfdu9r5I5PLL4hd6DOYAnU2nBQvIm2rG4SCnjQdfa8KSkAcWSRZnnNJGhAPm+aib2MvhXAMoUZAv51X4aQinCx8Kae4A8ql5GNswyGg2IVIEa4yd0g3mDNZxXoA8JlMOQ5n4n6CqD0RC2uDboEQm288P1/hcc7guf1u1xICa0PsECojReVpb18C6CG92ZGMlEVdb5xgWDocWEsFD5D7UVJTKYTxBe5pO0w0Ww0C7hLfygopIB4nCRjXED7RIbAwP0O3S+RX8oKS2XT11QeAh8KOpeaAj7Tn8YkMoAF1MblPktyAv/5WDrMm2M+6Ao8bxFmikfjBiiAuv2jhdLoWM60UqxC04wVRMZ1NZ6PJV+xfp2FAkpLysYAE+2SpGCSYT2hrSSGq3WpPeBavNlSWIcCCIOZkUtTXSYpJqsa2FLEYT0BeSy9AHkBM7fVEyyf/7NGiGiZXGuKostRAH6NaQ6FJRsi9InlqiRjwxQZOG7jL6PIQZ4PA/2hXA34+Tz1gJI5Ibf2+7KsLL4GBZAmWupbWiD1N0ZiL4m3QP5vsz00FkhZ6ht7jtIb80I4GFyO+kBqieyyMbIyFt7yZkosIdwaY0BEeJg2gw0BWbE3H9IN1MAbioWylOJwmzBiLJ3H7M3Py2yL72NhMYHLq8J3hJ+6TmDepzpuWM+vwoPcGwxrfPi5+XxEPyNNMVpf/taitu21p3SNm+wr3Cchv3hz1Hpi2+Pbq4Gszfwz7Dzb098Lw11i3jZZ3k/COWHt5gcrBM+1yWdO2UnI9nwMQvlV2+MwnGkFtLkAPmgu8ImuQxf4zZkgNflJuIDJ3ybiAsw/5gIx+cUuMBSjcSZB/JdZPIQ+JkGWXgbS6yS4UgztyMqsLYOrugZCpcWRaQZCXc4HNIHQNEJh8oBzhf7WWi4UZmmrzQc6hcKlQYT5dNdkiHzg92BiaEuGoK3NA2DdKRma+XQYzeXqgfbillJBhDHvXVMSwyQxzXFhGiUxXC3X15GS2MwXRUvcoM+yOMfZKML45wMoi8eyyC4WV10WR8i0N0aIEfzzAdTyFnVjZOa3xrCCmdwcnfntcUpPM31AwmpvM31ExpYaZmFWgx+FkzgkxTJHEkTxwirAyCbCpBps8tvOIdYsibFDUjt68htedkYoZDyNY3LXSah/PsCu6cuiHZMLFTHJg5IvSph/PsCu/T4s2kFJvxNschCkhPl8zBz9o7JHiCAVj9cclSUPeU1Yc1SWegLB1lhHZW2Q+Ct7AmE+X+OTMdqBaxyOyyh4HsXzMno5LG28l+xx+dJCKIrgeFnrweMOb3ESH0zU9LH5YKL2kxlOktppyw5jHnmk709mavvWfDID5DJBv9dL7qMpGxwTUcmGCPR2PgCNzwljR2tT1rFgl1bENfKNt//ZXJfzASMHJWFaOh8syQ8nay1hSX46a0oonRNyH08T+9vxu64fT1NEpYQ2tY+nTQmT+nz+OwkIEy2TyT7lLsKpfT7/P/yLMrzOf4DHAAAAAElFTkSuQmCC`,

  ToExtension:{
    docs:`Converts Self to a set of files that can be loaded as a WebExtension, to provide an action button that opens self in any page.
(In Firefox, these can be loaded temporarily in about:debugging.)`,
    call(net = Self, opt) {
      const execOnClickSrc = `browser.browserAction.onClicked.addListener(tab => browser.tabs.executeScript({file:browser.runtime.getURL('self.js'), runAt:"document_start"}))`
      const manifest = {
        version:'0',
        manifest_version:2,
        content_security_policy:"script-src 'self' 'unsafe-eval'; object-src 'self';",
        homepage_url:"https://github.com/Antipurity/conceptual",
        icons: { 64:'icon.png' },
        name:"REPL",
        description:"Allows opening a REPL in pages",
        permissions:["activeTab"],
        web_accessible_resources:['self.js'],
        browser_action:{
          default_icon:'icon.png',
          default_title:"Open a REPL in this page",
        },
        background:{
          scripts:["execonclick.js"],
          persistent:false,
        },
      }
      return elem(files, {
        ['manifest.json']:JSON.stringify(manifest),
        ['self.js']:ToScopedJS(net, opt),
        ['execonclick.js']:execOnClickSrc,
        ['icon.png']:BrowserIconURL,
      })
    },
  },

  ToReadableJS:{
    docs:`Converts Self to a human-readable form that pollutes the global scope on execution.`,
    examples:[
      [
        `ToReadableJS Self (jsEval '{markLines:true, into:"document.body.appendChild(document.createElement(\\"div\\")))"}')`,
      ],
    ],
    call(net = Rewrite.ctx, opt) {
      if (!(net instanceof Map))
        error('Expected a map, got', net)
      const markLines = opt ? !!opt.markLines : true
      net.forEach((v,k) => _isLabel(k) && !_isValidIdentifier(k[1]) && error('Not a valid JS identifier:', k))
      const seen = new Map
      mark(net)
      seen.set(net, 0)
      const names = new Map
      net.forEach((v,k) => { _isLabel(k) && seen.get(v) !== 0 && names.set(v, k[1]), _isLabel(k) && seen.set(v, 0) })
      let s = [], nextName = 0, depth = 0, line = 1
      opt && typeof opt.prefix == 'string' && write(opt.prefix)
      write(`/* Code begins at the first \`})({\`, as methods that are bound to each other. _XXX methods are private and somewhat invisible. */\n`)
      write(`'use strict';\n`)
      write(`(function() {\n`)
      write(`const __version = ${str(__version.replace(/[0-9]+$/, s => +s+1))}\n`)
      if (markLines) write(`const __line = function(line, func) { return __line.lines[''].push(line, func), func }\n`)
      if (markLines) write(`__line.lines = {['']:[]}\n`)
      write(`const __is = (function is(name) {\n`)
      write(`  const obj = Object.create(is)\n`)
      write(`  return obj.is = name, obj\n`)
      write(`});\n`)
      write(_unevalFunction(__base)[1].replace(/__INTO__/, opt && opt.into || 'document.body')+'\n')
      write("__base({")
      ++depth
      net.forEach((v,k) => {
        if (!_isLabel(k)) return
        write('\n\n'), method(identifier(k[1]), v, seen.get(v) === 0)
        names.set(v, k[1]), seen.set(v, 1)
      })
      seen.forEach((refCount, v) => {
        if (refCount <= 1) return
        if (!names.has(v)) names.set(v, ++nextName)
        write('\n\n'), method(identifier(names.get(v)), v, true)
      })
      --depth
      write(`\n})\n`)
      write(`})()`)
      return s.join('')

      function resolve(x) {
        return !_isLabel(x) && net.has(x) ? net.get(x) : x
      }
      function mark(x) {
        x = resolve(x)
        if (x == null || typeof x == 'number' || typeof x == 'boolean' || typeof x == 'string') return
        seen.set(x, (seen.get(x) || 0) + 1)
        if (seen.get(x) !== 1) return
        if (!_isArray(x) && defines(x, deconstruct)) return mark(deconstruct(x))
        else if (x instanceof Map) x.forEach((v,k) => (mark(k), mark(v)))
        else if (_isArray(x)) x.forEach(mark)
        else if (x && !x[defines.key] && typeof x == 'object')
          Object.keys(x).forEach(k => mark(x[k]))
        else if (x && x[defines.key])
          Object.keys(x[defines.key]).forEach(k => (mark(resolve(concept.idToKey[+k])), mark(x[defines.key][k])))
      }
      function write(str, noDepth = false) {
        if (markLines) line += _lineCount(str)
        s.push(!depth || noDepth ? str : str.replace(/\n(?!\n)/g, '\n'+'  '.repeat(depth)))
      }
      function put(x, ignoreName = false, ignoreMark = false) {
        x = resolve(x)
        if (typeof x == 'string') write(str(x), true)
        else if (x == null || typeof x == 'number' || typeof x == 'boolean') write(''+x)
        else if (!ignoreName && names.has(x))
          write('__is('), write(typeof names.get(x) == 'number' ? ''+names.get(x) : str(names.get(x)), true), write(')')
        else if (!_isArray(x) && defines(x, deconstruct)) {
          // Deconstructed concepts become is(…) to evaluate on start.
          const d = deconstruct(x)
          if (!_isArray(d) || typeof d[0] != 'function') throw "Must be a regular function"
          write('__is('), put(d), write(')')
        } else if (isFunc(x)) {
          write(!markLines ? x[1] : '__line(' + line + ',' + x[1] + ')')
        } else if (_isArray(x)) {
          write('['), ++depth // […]
          x.forEach(el => (write('\n'), put(el), write(',')))
          --depth, write('\n]')
        } else if (x instanceof Map) { // new Map([…])
          if (!x.size) return write('new Map')
          write('new Map(['), ++depth
          x.forEach((v,k) => (write('\n['), put(k), write(','), put(v), write('],')))
          --depth, write('\n])')
        } else if (x && !x[defines.key] && typeof x == 'object') {
          write('{'), ++depth // {…} in lookup.
          Object.keys(x).forEach(k => (write('\n'), method(identifier(k), x[k])))
          --depth, write('\n}')
        } else if (typeof x == 'function' || x && x[defines.key]) {
          // Functions get put as-is or as a definition of call.
          const def = new Map
          x[defines.key] && Object.keys(x[defines.key]).forEach(k => {
            const v = x[defines.key][k]
            let c = resolve(concept.idToKey[+k])
            if (c !== lookup && v instanceof Map) throw "Only definitions can be Maps"
            if (c !== lookup && (v instanceof Map || v && !_isArray(v) && !v[defines.key] && typeof v == 'object'))
              throw "Only the definition of lookup can be an object"
            def.set(c, v)
          })
          if (def) {
            if (x === Self)
              def.set(lookup, undefined)
            if (typeof x == 'function')
              def.set(call, func(x))
            write('{'), ++depth // {…} in definitions.
            def.forEach((v,k) => (write('\n'), method(identifier(names.get(k)), v)))
            --depth, write('\n}')
          } else put(func(x))
        } else throw "Unknown value to put"
      }
      function str(s) { return "`" + String(s).replace(/`|\\|${/g, s => '\\' + s) + "`" }
      function identifier(s) { return s && +s === +s || /^[_a-zA-Z]+$/.test(s) ? ''+s : '[' + str(s) + ']' }
      function func(f) { return _unevalFunction(f) }
      function isFunc(x) { return _isArray(x) && x[0] === jsEval && typeof x[1] == 'string' }
      function method(key, v, ignoreName = false) {
        if (!_isLabel(v) && net.has(v)) v = net.get(v)
        if (!markLines && typeof v == 'function' && !v[defines.key] && (ignoreName || !names.has(v))) v = func(v)
        if (!markLines && isFunc(v) && v[1].slice(0,8) === 'function' && (ignoreName || !names.has(v)))
          write(key), v[1] = v[1].slice(v[1].indexOf('(')), put(v, ignoreName), write(',')
        else
          write(key), write(':'), put(v, ignoreName), write(',')
      }

      // The bootstrapper for this.
      function __base(net) {
        const globals = typeof self !== ''+void 0 ? self : typeof global !== ''+void 0 ? global : window
        const env = new Map
        const constructed = new Map

        const defKey = Symbol('defines')

        // preload is for easier lookups. load is basically a copy of `bound` with a little notational convenience stuff thrown in.
        preload(net, globals)
        load(net, globals, true)
        postload()
        Object.keys(net).forEach(k => k && +k === +k && delete net[k])
        if (net.interrupt) net.interrupt.noInterrupt = false

        return Initialize.call(globals, net, typeof __line != ''+void 0 ? __line.lines : undefined)

        function objectFor(x) {
          // Load {call(){}} into a trivially-callable function, as a notational convenience.
          return x && typeof x.call == 'function' && x.call !== Function.prototype.call ? x.call : Object.create(null)
        }
        function preload(from, into) {
          // Pre-create objects/functions to be filled by `load`, so that arbitrary order of definitions is permitted.
          Object.keys(from).forEach(k => {
            if (k in into) try { delete into[k] } catch (err) {}
            if (from[k] instanceof Map) {
              if (into[k] === undefined) into[k] = new Map
              return
            } else if (from[k] && Object.getPrototypeOf(from[k]) === Object.prototype) {
              if (into[k] === undefined) into[k] = objectFor(from[k])
              if (typeof into[k] == 'function') into[k].displayName = k
              return
            } else if (Array.isArray(from[k])) {
              if (into[k] === undefined && +k !== +k) into[k] = []
              return
            }
            if (into[k] !== from[k] && +k !== +k) into[k] = from[k]
          })
          if (from.defines) into.defines.key = defKey
          if (from.call && from._newExecutionEnv) into.call.env = from._newExecutionEnv()
          if (from.interrupt) into.interrupt.noInterrupt = true
          Object.keys(from).forEach(k => {
            if (from[k] && Object.getPrototypeOf(from[k]) === __is) {
              if (Array.isArray(from[k].is)) { // Evaluate arrays.
                return from[k] = into[k] = postload(from[k])
              }
              else if (!(from[k].is in net)) throw new Error("Not a link to an existing thing: "+from[k].is)
              else from[k] = into[k] = load(from[from[k].is], into[from[k].is])
            }
          })
        }
        function load(from, into, inLookup) {
          // Handle is(…) (as ref-to-global) and arrays and objects (as definitions) specially.

          // Cache to prevent cycles from referring to old not-loaded versions of objects.
          if (env.has(from)) return env.get(from)
          if (from && Object.getPrototypeOf(from) === __is) {
            // Look up symbols in the network.
            if (Array.isArray(from.is)) return postload(from)
            else if (!(from.is in net)) throw new Error("Not a link to an existing thing: "+from.is)
            else return load(net[from.is], globals[from.is])
          }
          if (from instanceof Map) {
            // Load keys and values.
            if (into === undefined) into = new Map
            env.set(from, into)
            from.forEach((v,k) => into.set(load(k), load(v)))
            return into
          } else if (from && Object.getPrototypeOf(from) === Object.prototype) {
            // Load object values: turn {…} into {[defines.key]:{…}}, as a notational convenience.
            if (into === undefined) into = objectFor(from)
            env.set(from, into)

            if (!inLookup) {
              let d
              for (let key of Object.keys(from)) {
                if (from[key] === defKey) { into[key] = from[key];  continue }
                  // Since objectFor(…) is different for functions, we have to copy.
                const k = load(__is(key))
                if (k !== call || typeof from[key] != 'function')
                  (d || (d = Object.create(null)))[_id(k)] = load(from[key], undefined, k === lookup)
              }
              return d && (into[defKey] = into !== Self ? Object.freeze(d) : d), into
            } else {
              for (let k of Object.keys(from)) if (+k !== +k) {
                const loaded = load(from[k], into[k])
                if (loaded !== into[k]) into[k] = loaded
                from[k] = into[k]
              }
              return into
            }
          }
          if (Array.isArray(from)) {
            // Look into arrays and load their elements.
            if (into === undefined) into = []
            into.length = from.length
            env.set(from, into)
            for (let i = 0; i < into.length; ++i) into[i] = load(from[i])
            return into
          }
          return from
        }
        function postload(from, obj) {
          if (from !== undefined)
            constructed.set(load('defines')(from, load('construct'))(from.is.map(x => load(x))), from)
          else
            constructed.forEach((from, obj) => construct(env.get(from), obj))
        }
      }
    },
  },

  ToScopedJS:{
    docs:`Converts Self to a form that has itself hidden in a scope.`,
    call(net = Rewrite.ctx, opt) {
      if (!(net instanceof Map))
        error('Expected a map, got', net)
      if (net.has(label('_globalScope'))) throw "Net must not have _globalScope"
      if (!net.has(label('_id'))) throw "Net must have _id"
      if (!net.has(label('label'))) throw "Net must have label"
      if (!net.has(label('concept'))) throw "Net must have concept"
      const markLines = opt ? !!opt.markLines : true
      net.forEach((v,k) => _isLabel(k) && k[1][0] === '$' && error('$ is reserved for hidden names, use something other than', k))
      net.forEach((v,k) => _isLabel(k) && !_isValidIdentifier(k[1]) && error('Not a valid JS identifier:', k))
      const names = new Map
      let n = 0
      mark(net, true)
      let s = [], line = 1
      opt && opt.prefix && write(opt.prefix)
      write(`'use strict';(()=>{\n`)
      write(`const __version = ${str(__version.replace(/[0-9]+$/, s => +s+1))}\n`)
      if (markLines) write(`const __line = function(line, func) { return __line.lines[''].push(line, func), func }\n`)
      if (markLines) write(`__line.lines = {['']:[]}\n`)
      write(`let`)
      // Put the variables to hold values.
      net.forEach((v,k) => {
        if (!_isLabel(k) || !_isValidIdentifier(k[1], true)) return
        if (names.has(v) && names.get(v)[0] === '$')
          write('\n'), names.set(v, k[1]), write(k[1]), write('='), put(v, true), write(',')
      })
      names.forEach((name, v) => { if (name[0] === '$') write('\n'), write(name), write('='), put(v, true), write(',') })
      write('$' + (n++).toString(36))
      if (net.has(label('defines')))
        write('\nconst $$=defines.key=Symbol(\'defines\')\n')
      if (net.has(label('call')) && net.has(label('_newExecutionEnv')))
        write(`call.env = _newExecutionEnv()\n`)
      if (net.has(label('interrupt')))
        write(`interrupt.noInterrupt = true\n`)
      // Fill the values of variables in.
      names.forEach((name, v) => {
        if (_isArray(v) || defines(v, deconstruct) === undefined) if (!fill(v)) write('\n')
        if (!_isArray(v) && defines(v, deconstruct) !== undefined) {
          const d = deconstruct(v)
          if (!_isArray(d) || typeof d[0] != 'function') throw "Invalid deconstruction"
          let b = 0
          // For constructs, we want to put `name = construct([...d]);  <and much later>  construct([...d], name)`
          const c = defines(d, construct)
          write(name), write('='), put(c), write('(['), d.forEach(el => (b++ && write(','), put(el))), write('])\n')
        }
      })
      // Construct things.
      names.forEach((name, v) => {
        if (!_isArray(v) && defines(v, deconstruct) !== undefined) {
          const d = deconstruct(v)
          const c = defines(d, construct)
          put(c), write('(['), d.forEach(el => (b++ && write(','), put(el))), write('], '), write(name), write(')\n')
        }
      })
      // Put aliases.
      net.forEach((v,k) => {
        if (!_isLabel(k) || k[1] === names.get(v)) return
        if (!_isValidIdentifier(k[1], true) || !_isValidIdentifier(names.get(v), true)) return
        write('let '), write(k[1]), write('='), put(v), write('\n')
      })
      write(`\nreturn Initialize.call(typeof self !== ''+void 0 ? self : typeof global !== ''+void 0 ? global : window, `)
      write(`{${[...net.entries()].map(([k,v]) => !_isLabel(k) ? null : k[1] === names.get(v) ? k[1] : k[1]+':'+(names.get(v)||v)).filter(x => x).join(',')}}`)
      write(markLines ? `, __line.lines` : `, undefined`)
      write(`, ${opt && opt.into || null}`)
      write(')')
      write(`\n})()`)
      return s.join('')

      function resolve(x) {
        return !_isLabel(x) && net.has(x) ? net.get(x) : x
      }
      function mark(x, topLevel) {
        if (x == null || typeof x == 'number' || typeof x == 'boolean') return
        x = resolve(x)
        let name
        if (names.has(x)) return; else if (!topLevel) names.set(x, name = '$' + (n++).toString(36))
        try {
          if (!_isArray(x) && defines(x, deconstruct)) return mark(deconstruct(x))
          else if (x instanceof Map) x.forEach((v,k) => (!topLevel && mark(k), mark(v)))
          else if (_isArray(x)) x.forEach(mark)
          else if (x && !x[defines.key] && typeof x == 'object')
            Object.keys(x).forEach(k => mark(x[k]))
          else if (x && x[defines.key]) {
            if (x === net.get(label('Self'))) return
            mark(net.get(label('_id'))),
            Object.keys(x[defines.key]).forEach(k => (mark(resolve(concept.idToKey[+k])), mark(x[defines.key][k])))
          }
        } finally { names.delete(x), !topLevel && names.set(x, name) } // Ensure that all dependencies of x are ready before x.
      }
      function write(str) {
        if (markLines) line += _lineCount(str)
        s.push(str)
      }
      function put(x, ignoreName = false) {
        x = resolve(x)
        if (!ignoreName && names.has(x)) write(names.get(x))
        else if (!_isArray(x) && defines(x, deconstruct)) write('0')
        else if (typeof x == 'function') {
          const f = _unevalFunction(x)
          if (f[2] !== undefined && f[2] !== net && f[2] !== defines(Self, lookup))
            error("Can only do single-global-scope functions, got", f)
          write(!markLines ? f[1] : '__line(' + line + ',' + f[1] + ')')
        } else if (_isArray(x)) write('[]')
        else if (x instanceof Map) write('new Map')
        else if (x && typeof x == 'object') write('{}')
        else if (typeof x == 'string') write(str(x))
        else if (x == null || typeof x == 'number' || typeof x == 'boolean') write(''+x)
        else throw "Unknown value to put"
      }
      function str(x) { return "`" + String(x).replace(/`|\\|${/g, s => '\\' + s) + "`" }
      function key(s) { return /^[_a-zA-Z]+$/.test(s) ? '.'+s : s && +s === +s ? '['+s+']' : '[' + str(s) + ']' }
      function fill(x) {
        x = resolve(x)
        const name = names.get(x)
        if (_isArray(x)) { // x.push(...)
          let b = 0
          write(name), write('.push('), x.forEach(el => (b++ && write(','), put(el))), write(')')
        } else if (x instanceof Map) // x.set(k,v).set(k,v)...
          x.size && write(name), x.forEach((v,k) => (write('.set('), put(k), write(','), put(v), write(')')))
        else if (x && !x[defines.key] && typeof x == 'object') { // x[k]=v  \n  x[k]=v  \n  ...
          Object.keys(x).forEach(k => (write(name), write(key(k)), write('='), put(x[k]), write('\n')))
          return true
        } else if (x && x[defines.key]) { // Set name[defines.key][...] one by one.
          write(name), write('[$$]=Object.create(null)\n')
          Object.keys(x[defines.key]).forEach(k => {
            const key = resolve(concept.idToKey[+k])
            write(name), write('[$$]['), put(net.get(label('_id'))), write('('), put(key), write(')]='), put(x[defines.key][k]), write('\n')
          })
          if (x !== net.get(label('Self'))) write('Object.freeze('), write(name), write('[$$])\n')
          return true
        } else return true
      }
    },
  },

  System:{
    docs:`A namespace for low-level functions that should not be called in user code, for safety.`,
    lookup:{
      interrupt:__is(`interrupt`),
      jsEval:__is(`jsEval`),
      argCount:__is(`argCount`),
      userTime:__is(`userTime`),
      realTime:__is(`realTime`),
      memorySince:__is(`memorySince`),
      ClearCaches:{
        docs:`When called, clears the oldest half of entries in every cache.`,
        argCount:0,
        call() {
          if (impureHave()) return impureLoad(); else impureSave(null)
          halve(_id.xToIndex)
          halve(elemValue.obj)
          halve(elemValue.val)
          halve(_valuedColor.m)
          if (_allocArray.free) _allocArray.free.length >>>= 1
          if (_resolveStack.functions) {
            const k = Object.keys(_resolveStack.functions)
            for (let i = 0; i < (k.length>>>1); ++i) delete _resolveStack.functions[k[i]]
          }
          // And WeakMaps: _invertBindingContext.cache.
          //   (And label.s, which can't be halved to ensure safety.)
          function halve(m) { if (m) _limitMapSize(m, m.size>>>1) }
        },
      },
    },
    permissionsElem(el) { el.classList.add('warning');  return el },
  },

  _allocArray:{
    docs:`_allocArray()⇒Array as a replacement for \`[]\` and _allocArray(Array) to re-use objects.`,
    call(a) {
      if (!_allocArray.free) _allocArray.free = []
      if (a === undefined) return _allocArray.free.length ? _allocArray.free.pop() : []
      if (!_isArray(a)) throw "Expected undefined or an array"
      a.length = 0
      _allocArray.free.push(a)
    },
  },


  _allocMap:{
    docs:`_allocMap()⇒Map as a replacement for \`new Map\` and _allocMap(Map) to re-use objects.`,
    call(a) {
      if (!_allocMap.free) _allocMap.free = []
      if (a === undefined) return _allocMap.free.length ? _allocMap.free.pop() : new Map
      if (!(a instanceof Map)) throw "Expected undefined or a Map"
      a.clear()
      _allocMap.free.push(a)
    },
  },

  _appendFile(to, name, value) {
    if (typeof name != 'string') error("Filename must be a string, got", name)
    if (typeof value == 'string') {
      const ch = elem('a', name)
      ch.download = name
      ch.href = value.slice(0,5) === 'data:' ? value : 'data:,' + encodeURIComponent(value) // Content sniffing (like here) is bad.
      to.append(ch)
    } else if (value instanceof Map || typeof value == 'object' && !value[defines.key])
      to.append(defines(files, elem)(files, value, name))
    else
      error("Unknown file content type:", value)
  },





  _logAll:{
    docs:`Logs all defined sub-functions of a value.`,
    call(f, value) {
      let [ins = defines(f, _logAll), i = 0] = interrupt(_logAll)
      try {
        if (!ins) return
        for (; i < ins.length; ++i) {
          let r
          try { r = ins[i](value) }
          catch (err) { if (err === interrupt) throw err;  log(_errorRepr(err)) }
          r !== undefined && log(r !== _onlyUndefined ? r : undefined)
        }
      } catch (err) { if (err === interrupt) interrupt(_logAll, _tmp().length=0, _tmp().push(ins, i));  throw err }
    },
  },

  _clearStyle(el) {
    if (!el.style.length) el.removeAttribute('style')
    if (!el.classList.length) el.removeAttribute('class')
  },






  askUser:{
    docs:`A \`With\` for \`picker\` that pauses execution and asks the user.
Preserved for now, because giving the user choices is a valuable idea for explaining (but should be reworked).`,
    call(next, from, cause, extra) {
      if (!askUser.got) askUser.got = new Map
      const a = ['askUser', next, from, cause, extra]
      if (askUser.got.has(a))
        try {
          return askUser.got.get(a) !== _notFound ? askUser.got.get(a) : next(from, cause, extra)
        } finally { askUser.got.delete(a) }

      if (typeof document == ''+void 0) {
        // NodeJS.
        const rl = require('readline').createInterface({ input:process.stdin, output:process.stdout })
        let job
        log('A choice from' + _pickCount(from), from)
        if (cause !== undefined) log('  Cause:', cause)
        if (extra !== undefined) log(extra)
        rl.question(acceptChoice)
        function acceptChoice(str) {
          const i = +str
          if (!(i >= 0) || !(i < _pickCount(from)))
            rl.question('Must be a number from 0 to ' + _pickCount(from) + ': ', acceptChoice)
          else
            askUser.got.set(a, i), _schedule(...job)
        }
        _causeInterrupt(cause, (expr, env, then) => job = [expr, env, then])
      }
      // Browser.
      const el = elem('div')
      if (cause !== undefined)
        el.append('Cause: ', elemValue(elemCollapse(() => serialize(cause, _langAt(), _bindingsAt(), serialize.displayed)), cause), elem('br'))
      if (extra !== undefined)
        el.append(serialize(extra, _langAt(), _bindingsAt(), serialize.displayed), elem('br'))
      el.append(elem('unimportant', 'Pick one:\n'))
      el.append(elemValue(elem('button', 'Auto'), _notFound))

      // A table of choices.
      if (_isArray(from)) {
        const table = elem('table')
        for (let i = 0; i < from.length; ++i) {
          const tr = elemValue(elem('tr', [
            elem('td', elemValue(elem('button', ''+i), i)),
            elem('td', serialize(from[i], _langAt(), _bindingsAt(), serialize.displayed))
          ]), from[i])
          table.append(tr)
        }
        el.append(table)
      } else {
        for (let i = 0; i < from; ++i)
          el.append(elemValue(elem('button', ''+i), i))
      }
      const env = call.env
      let job
      el.onclick = evt => {
        const t = evt.target || evt.explicitOriginalTarget
        if (t.tagName !== 'BUTTON' || !('to' in t) || t.to !== _notFound && typeof t.to != 'number') return
        env[_id(log)] && env[_id(log)].style.removeProperty('display')
        askUser.got.set(a, t.to), _schedule(...job)
        elemRemove(el), el.onclick = null
      }
      log(el)
      env[_id(log)] && (env[_id(log)].style.display = 'none')

      _causeInterrupt(cause, (expr, env, then) => job = [expr, env, then])
    },
  },

















  addSearchElem:{
    docs:`Adds an element that can search for a string in a DOM tree, collapsing all that do not contain such things.`,
    call(el) {
      const container = elem('div')
        const row = elem('div')
        const str = elem('input')
        str.type = 'text'
        str.title = 'Search for this.'
        const end = elem('button', '❌')
        end.onclick = () => { const h = _smoothHeightPre(container); container.replaceWith(el); _smoothHeightPost(el, h) }
        end.style.margin = 0
        row.append(str, end)
      el.replaceWith(container)
      container.append(el)
      elemInsert(container, row, el)
      let env = null
      str.oninput = _throttled(() => {
        const s = str.value
        const bad = [-1];  bad.length = s.length
        for (let i = 1, j = 0; i < s.length; ++i, ++j) {
          if (s[i] === s[j])
            bad[i] = bad[j]
          else {
            bad[i] = j
            while (j > 0 && s[i] !== s[j]) j = bad[j]
          }
        }
        let i = 0
        env !== null && _cancel(env)
        env = _newExecutionEnv()
        env[_id(_schedule)] = _newJobId()
        _doJob([last, [search, el], () => env = null], env)

        function search(el) {
          // Return true if el contains s (if any children return true, or if we're a text node and have a match inside), else false.
          if (!el.childNodes.length && el.nodeValue) {
            // Search the string.
            if (!s.length) return true
            let result = false
            for (let j = 0; j < el.nodeValue.length; ++i, ++j) {
              if (s[i] === el.nodeValue[j]) {
                if (i === s.length-1) result = true, i = bad[i]
              } else
                i = bad[i], i >= 0 && (--i, --j)
            }
            return result
          } else {
            // If some children are true and others are false, collapse the false children. Return whether any children are true.
            // If we are collapsed and want to return true, un-collapse us.
            //call.env = env
            Math.random()<.01 && _checkInterrupt()
            let [v = _allocArray(), anyTrue = false, anyFalse = false, i1 = 0, ch1 = el.firstChild, next1 = ch1 && ch1.nextSibling, i2 = 0, ch2 = el.firstChild, next2 = ch2 && ch2.nextSibling] = interrupt(search)
            try {
              v.length = el.childNodes.length
              for (; ch1; [ch1, next1] = [next1, next1 && next1.nextSibling], ++i1)
                v[i1] = search(ch1), v[i1] ? (anyTrue = true) : (anyFalse = true)
              if (anyTrue && anyFalse)
                for (; ch2; [ch2, next2] = [next2, next2 && next2.nextSibling], ++i2) {
                  const t = ch2.tagName
                  if (t === 'DETAILS')
                    ch2.open !== v[i2] && ch2.firstChild.click()
                  else if (!v[i2] && !ch2.nodeValue && t !== 'COLLAPSED' && t !== 'BRACKET' && t !== 'SPACE' && t !== 'NUMBER' && t !== 'STRING' && t !== 'KNOWN' && t !== 'SUMMARY' && t !== 'TR' && t !== 'TD')
                    elemCollapse(ch2)
                }
              if (anyTrue && el.tagName === 'DETAILS')
                !el.open && el.firstChild.click && el.firstChild.click()
              if (anyTrue && el.tagName === 'COLLAPSED')
                el.click()
              return anyTrue
            } catch (err) { if (err === interrupt) interrupt(search, _tmp().length=0, _tmp().push(v, anyTrue, anyFalse, i1, ch1, next1, i2, ch2, next2)), v = null;  throw err }
            finally { v && _allocArray(v) }
          }
        }
      }, .5)
    },
  },












































})
})()
