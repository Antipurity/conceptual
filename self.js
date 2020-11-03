/* Code begins at the first `})({`, as methods that are bound to each other. _XXX methods are private and somewhat invisible. */
'use strict';
(function() {
const __version = '0'
const _ = (function is(name) {
  const obj = Object.create(is)
  return obj.is = name, obj
});
function __base(net) {
  const globals = typeof self !== ''+void 0 ? self : typeof global !== ''+void 0 ? global : window
  const env = new Map
  const constructed = new Map

  const defKey = Symbol('defines')

  // preload is for easier readAts. load is basically a copy of `bound` with a little notational convenience stuff thrown in.
  preload(net, globals)
  load(net, globals, true)
  Object.keys(net).forEach(k => k && +k === +k && delete net[k])
  if (net.interrupt) net.interrupt.noInterrupt = false

  Initialize.call(globals, net, typeof __line != ''+void 0 ? __line.lines : undefined)
  postload()

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
      if (from[k] && Object.getPrototypeOf(from[k]) === _) {
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
    if (from && Object.getPrototypeOf(from) === _) {
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
          const k = load(_(key))
          if (k !== call || typeof from[key] != 'function')
            (d || (d = Object.create(null)))[_id(k)] = load(from[key], undefined, k === readAt)
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
    if (from !== undefined) {
      const x = from.is.map(x => load(x))
      const to = load(_('defines'))(load(from.is[0]), load(_('construct')))(x)
      constructed.set(to, from)
      env.set(from, x)
      return to
    } else
      constructed.forEach((from, obj) => construct(env.get(from), obj)), constructed.clear()
  }
}
__base({

  Initialize:{
    docs:`The program's entry point.`,
    readAt:{
      Browser:_(`Browser`),
      NodeJS:_(`NodeJS`),
      WebWorker:_(`WebWorker`),
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
      Self[defines.key][_id(readAt)] = net, Object.freeze(Self[defines.key])

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
    readAt:{
      call:_(`call`),
      purify:_(`purify`),
      callAdjust:_(`callAdjust`),
      error:_(`error`),
      await:_(`await`),
      repeat:_(`repeat`),
      Numeric:_(`Numeric`),
      Data:_(`Data`),
    },
  },

  Documentation:{
    docs:`Documentation-related functions.`,
    readAt:{
      tutorial:_(`tutorial`),
      docs:_(`docs`),
      referencesOf:_(`referencesOf`),
      referencedBy:_(`referencedBy`),
      definedBy:_(`definedBy`),
      sizeof:_(`sizeof`),
      examples:_(`examples`),
      todo:_(`todo`),
      philosophy:_(`philosophy`),
    },
  },

  Numeric:{
    docs:`A namespace for some very primitive numeric-computation-related functionality.`,
    readAt:{
      ArrayOps:_(`ArrayOps`),
      ReshapingOps:_(`ReshapingOps`),
      NumInit:_(`NumInit`),
      Arithmetic:_(`Arithmetic`),
      Random:_(`Random`),
      NumTypes:_(`NumTypes`),
      Neural:_(`Neural`),
    },
  },

  NumInit:{
    docs:`A namespace for numeric initialization.`,
    readAt:{
      identity:_(`identity`),
      ones:_(`ones`),
      randomVar:_(`randomVar`),
    },
  },

  Arithmetic:{
    docs:`This is where we shamelessly copy over the functions of TensorFlowJS that we need.`,
    readAt:{
      less:_(`less`),
      where:_(`where`),
      add:_(`add`),
      sub:_(`sub`),
      mul:_(`mul`),
      div:_(`div`),
      pow:_(`pow`),
      exp:_(`exp`),
      expm1:_(`expm1`),
      log:_(`log`),
      sum:_(`sum`),
      floor:_(`floor`),
      sign:_(`sign`),
      abs:_(`abs`),
      clip:_(`clip`),
      argmax:_(`argmax`),
      max:_(`max`),
      norm:_(`norm`),
      matMul:_(`matMul`),
    },
  },

  less:{
    docs:`a<b for each value.`,
    argCount:2,
    dispose:true,
    interrupt:false,
    call(a,b) { return typeof a == 'number' && typeof b == 'number' ? a<b : _tf(tf.less(a,b)) },
  },

  where:{
    docs:`a?b:c for each value.`,
    argCount:3,
    dispose:true,
    interrupt:false,
    call(a,b,c) {
      if (typeof a == 'boolean') return (a?b:c)
      // Since `tf.where` doesn't broadcast numbers, we must do it ourselves. (A one-liner otherwise.)
      //   (Wouldn't have been a problem with manual compilation for GPU…)
      let db=false, dc=false
      if (typeof b == 'number') db=true, b = tf.broadcastTo(b, c && c.shape || a.shape)
      if (typeof c == 'number') dc=true, c = tf.broadcastTo(c, b && b.shape || a.shape)
      const result = _tf(tf.where(a,b,c))
      db && dispose(b), dc && dispose(c)
      return result
    },
    adjust:[
      _(`array`),
      0,
      [
        _(`where`),
        _(`_inA`),
        _(`_dout`),
        0,
      ],
      [
        _(`where`),
        _(`_inA`),
        0,
        _(`_dout`),
      ],
    ],
    mergeAdjustment:[
      undefined,
      _(`_mergeTensors`),
      _(`_mergeTensors`),
    ],
  },

  NumTypes:{
    docs:`A namespace for common numeric types.`,
    readAt:{
      i8:_(`i8`),
      i16:_(`i16`),
      i32:_(`i32`),
      u8:_(`u8`),
      u16:_(`u16`),
      u32:_(`u32`),
      f32:_(`f32`),
      f64:_(`f64`),
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
    readAt:{
      array:_(`array`),
      Constructions:_(`Constructions`),
    },
  },

  UI:{
    docs:`A namespace for user interface functionality.`,
    philosophy:`Even when switching languages and/or bindings makes some things look the same, being able to {highlight ref-equal objects}, and {view the basic default-bindings serialization}, and {link to actual values without going through text}, makes meaning a first-class citizen. This is impossible to achieve without first-class UI support, but with it, incomprehensible code can be easy to understand (replicate in a mind).
Keep names short and rely on the IDE. Route gradient not through the text representation, but through actual dependencies.`,
    readAt:{
      Languages:_(`Languages`),
      Commands:_(`Commands`),
      settings:_(`settings`),
      print:_(`print`),
      disableBindings:_(`disableBindingsElem`),
      REPL:_(`REPL`),
      contextMenu:_(`contextMenu`),
      hierarchy:_(`hierarchy`),
      elem:_(`elem`),
    },
  },

  Languages:{
    docs:`A namespace for languages and their handling.
One of the world's most annoying problems is tabs vs spaces. With UI support, you can choose neither.`,
    philosophy:`Languages just define how the bound-graph structure gets parsed/serialized, not execution.
Decoupling form from meaning allows composition and trivial changing of forms.`,
    readAt:{
      serialize:_(`serialize`),
      fast:_(`fast`),
      basic:_(`basic`),
      fancy:_(`fancy`),
      fancier:_(`fancier`),
      stringLanguage:_(`stringLanguage`),
      js:_(`js`),
    },
  },

  repeat:{
    docs:`\`(repeat ^Expr)\`: loops forever when finished, interrupting as needed. \`repeat Expr Times\`: repeats the computation many \`Times\`.
Results of evaluating DAG nodes are not preserved.`,
    call(expr, iterations) {
      // Example usage: `repeat ^(randomNat 10) 1000`
      if (iterations !== undefined && typeof iterations != 'number' && typeof iterations != 'function')
        error("iterations must be undefined or a number or a function, got", iterations)
      let [compCall, compAdj, i = 0, prevV, into] = interrupt(5)
      if (into === undefined)
        into = elemValue(elem('code'), [repeat, expr, iterations]), into.classList.add('code'), print(into)
      let v, done = false
      try {
        // Pre-compute compCall and compAdj, so that every call to `callAdjust` doesn't have to.
        if (compCall === undefined) { // Can't interrupt.
          compAdj = _postorderInfo(expr)
          compCall = _compileBody(expr, null, compAdj)
        }
        if (_isArray(compAdj)) {
          const r = _compileAutograd(compAdj);  defines(_postorderInfo, dispose)(compAdj), compAdj = r
        }

        // Loop.
        while (true) {
          const prev = v
          v = callAdjust(expr, compCall, compAdj, false), dispose(prev)
          if (_isUnknown(v)) return elemRemove(into), _unknown([repeat, v[1], iterations], v)
          done = true
          ++i
          if (iterations && (typeof iterations === 'number' ? i >= iterations : iterations(v,i))) return elemRemove(into), v
          _checkInterrupt(expr)
        }
      } catch (err) {
        // Log our last computed value.
        if (v !== prevV)
          if (done || err !== interrupt) {
            const pre = _smoothHeightPre(into)
            _removeChildren(into)
            err === interrupt && into.append(serialize(v, _langAt(), _bindingsAt(), serialize.displayed))
            _smoothHeightPost(into, pre)
            prevV = v
          }
        if (err === interrupt) interrupt.stack.push(compCall, compAdj, i, prevV, into)
        throw err
      }
    },
  },

  Self:{
    docs:`Open programming environments with machine learning, to treat humans and programs equally.
A namespace for every function here. Project's GitHub page: {https://github.com/Antipurity/conceptual}`,
    philosophy:`What happens when you force a person to change.
Can't get away from it, love it so much.`,
    readAt:_(`undefined`),
  },

  argCount:{
    docs:`A marker for the number of args to a function.`,
  },

  userTime:{
    docs:`\`userTime()\`⇒\`TimeMark\` or \`userTime(TimeMark)\`: returns the time spent on this job as f64 milliseconds, or the non-negative in-job time elapsed since the mark.`,
    call(mark = 0) {
      if (impureHave()) return impureLoad()
      return impureSave(call.env[_id(userTime)] + _timeSince(call.env[_id(realTime)]) - mark)
    },
  },

  realTime:{
    docs:`\`realTime()\`⇒\`TimeMark\` or \`realTime(TimeMark)\`: returns the time since start as f64 milliseconds, or the non-negative time elapsed since the mark.`,
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

  _listen:{
    docs:`Registers a global event listener, or sets an interval if \`Type\` is a number (ms).`,
    readAt:{Deinitialize:_(`Deinitialize`)},
    call(Type, listener, opt) {
      if (!Deinitialize.events) Deinitialize.events = [], Deinitialize.intervals = []
      if (typeof Type == 'number') {
        const int = setInterval(listener, Type)
        if (int.unref) int.unref()
        return void Deinitialize.intervals.push(int)
      }
      (Self.into !== document.body ? Self.into : self).addEventListener(Type, listener, opt)
      Deinitialize.events.push(Type, listener, opt)
    },
  },

  Deinitialize:{
    docs:`The self-destruct switch. For pretending that we never existed.`,
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
    _(`settings`),
    false,
    `Whether to use dark theme (or light).

Gaze upon the ever-shifting radiance of creation.
Or let go of all you know, to embrace vacuous might.
Just don't short-sightedly lock yourself into one consequence.
Yes.`,
  ],

  _disableSmoothTransitions:[
    _(`settings`),
    false,
    `Whether to disable smooth transitions.`,
  ],

  _noBoxStylingForPrograms:[
    _(`settings`),
    false,
    `Whether to disable box styling, and make all program text use inline styling.
Try creating an array of multi-line strings to see the difference.`,
  ],

  _maxUsageOfCPU:[
    _(`settings`),
    .99,
    `Debounce the interpreter loop to %%% CPU usage.`,
    _(`rangeSetting`),
    .01,
    .99,
    .01,
  ],

  Browser:{
    docs:`A REPL interface.
Supported browsers: modern Chrome/Chromium and Firefox.`,
    readAt:{
      icon:_(`BrowserIconURL`),
      _useDarkTheme:_(`_useDarkTheme`),
      _disableSmoothTransitions:_(`_disableSmoothTransitions`),
      _noBoxStylingForPrograms:_(`_noBoxStylingForPrograms`),
      _hoverHighlightsDOMValues:_(`_hoverHighlightsDOMValues`),
    },
    js:[
      `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js`,
      `https://d3js.org/d3.v6.min.js`,
    ],
    style:`.into * {transition: all .2s ease-in; box-sizing: border-box; vertical-align:top; animation: fadein .2s; font-family: monospace, monospace; font-size:1rem}
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

:focus:not(summary) {outline:none; box-shadow:var(--highlight) 0 0 .1em .1em}
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
  animation: rotate 2s cubic-bezier(.5,0,0,2.5) infinite !important;
}

.into:not(.noComplexity) .broken { padding-left:1em }
.into:not(.noComplexity) .broken>:not(extracted):not(operator) { display:table; max-width:100% }
.into:not(.noComplexity) .broken>operator::before { content:"\\A" }
.into:not(.noComplexity) .broken.hasOperators>*:not(operator) { display:inline-block }
.into:not(.noComplexity) .broken>.funcCall { display:inline-block !important; margin-left:0 }
.into:not(.noComplexity) .broken>bracket {margin-left:-1em; display:block !important}
.into:not(.noComplexity) .broken>.funcCall:first-child {margin-left:-1em}
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
JobIndicator>div { width:4px; height:4px; margin:5px; position:absolute; background-color:var(--main); border-radius:50%; transform: rotate(var(--turns)) translate(10px); animation:none }
@keyframes rotate {
  0% { transform: rotate(-0.25turn) }
  100% { transform: rotate(0.75turn) }
}
JobIndicator.yes>.yes { background-color:var(--highlight) }

button { margin:.5em; padding:.5em; border-radius:.3em; border:1px solid var(--highlight); color:var(--highlight); font-size:inherit; min-width:2.4em; min-height:2.4em; background-color:rgba(128,128,128,.15) }
button:hover, a:hover, collapsed[content]:hover, prompt:hover { filter:brightness(130%) }
button:active, a:active, collapsed[content]:active, prompt:active { filter:brightness(60%) }
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
collapsed { color:var(--highlight); background-color:rgba(128,128,128,.15); margin:-1px; border:1px solid var(--highlight); border-radius:.2em; text-align:center; display:inline-block }
collapsed[content] { cursor:pointer }
collapsed::before { content:attr(content) }

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
.hover>div.code>time-report, div.code:hover>time-report { opacity:1; visibility:visible }

.removed { margin:0 }

separated-text { margin:1em; display:block }

separated-text serialization, text serialization { background-color:rgba(50%, 50%, 50%, 20%); border-radius:.2em; display:inline-block }
separated-text serialization serialization, text serialization serialization { background-color:none }
.nonArray>bracket { font-weight:bold }

svg text { font-family:monospace !important; font-size:medium !important }
svg, svg * { transition: none !important }

settings>label { visibility:hidden; opacity:0; z-index:20; padding:1ch; border-radius:.3em; position:absolute; pointer-events:none; width:100%; margin-top:1.2em; left:-100vw }
settings:hover>label { visibility:visible; opacity:1; background-color:rgba(90,150,210, .85); pointer-events:auto; left:0 }

separated-text>serialization, text>serialization, separated-text>serialization *, text>serialization * { animation:none !important }

inline-block { display:inline-block }
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

      // React to changes in some settings.
      observe(_useDarkTheme, st => Self.into.classList.toggle('dark', st[1], true))(_useDarkTheme)
      observe(_disableSmoothTransitions, st => Self.into.classList.toggle('noTransitions', st[1], true))(_disableSmoothTransitions)
      observe(_noBoxStylingForPrograms, st => Self.into.classList.toggle('noComplexity', st[1], true))(_noBoxStylingForPrograms)

      // Insert the style defined by code.
      const StyleElem = document.createElement('style')
      StyleElem.style.display = 'none'
      StyleElem.innerHTML = defines(Browser, style)
      into.append(StyleElem)

      // Create a REPL.
      const lang = fancier, binds = new Map(Self.ctx)
      const env = call.env = _newExecutionEnv(null, null, lang, binds)
      const repl = call.env[_id(print)] = REPL(lang, binds)
      into.appendChild(repl)
      Self.into.querySelector('[contenteditable]').focus()

      // If our URL has `#…` at the end, parse and evaluate that command.
      function evalHash(hash) {
        call.env = _newExecutionEnv()
        if (hash) elemInsert(into, evaluator(parse(decodeURI(location.hash.slice(1)))), into.firstChild)
        call.env = undefined
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
      function getSummaryParent(el) { return el && (el.tagName === 'SUMMARY' ? el : getSummaryParent(el.parentNode)) }
      _listen('click', evt => {
        let t = evt.target || evt.explicitOriginalTarget
        const par = getSummaryParent(t)
        if (par) t = par
        if (t.tagName === 'DETAILS')
          return t.firstChild.click()
        if (t.tagName === 'SUMMARY' && evt.detail !== 3 && !_disableSmoothTransitions[1]) {
          const el = t.parentNode
          const pre = _smoothHeightPre(el)
          if (parseFloat(el.style.height) !== pre)
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
          _runFunc(Commands.get('AuxClick'), _closestNodeParent(evt.target || evt.explicitOriginalTarget), range, evt), evt.preventDefault()
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
        atEnd = atEnd || _updateMaxScrollBegin()
      }, passive)
      _listen('transitionend', evt => {
        if (_disableSmoothTransitions[1]) return
        const t = evt.target || evt.explicitOriginalTarget
        if (t.tagName === 'SCROLL-HIGHLIGHT') return
        if (evt.propertyName !== 'height' || Self.into !== document.body) return
        t.style.removeProperty('height'), _clearStyle(t)
        _updateMaxScrollEnd(atEnd), atEnd = false
      }, passive)

      // On .ctrlKey pointerdown on a value, insert a <collapsed> reference to it into selection if editable.
        // This is also accessible via `contextMenu` (which is accessible via AuxClick).
      _listen('pointerdown', evt => {
        if (!evt.ctrlKey || evt.shiftKey || evt.altKey) return
        const range = getSelection().rangeCount && getSelection().getRangeAt(0)
        if (Commands.has('CtrlClick'))
          _runFunc(Commands.get('CtrlClick'), _closestNodeParent(evt.target || evt.explicitOriginalTarget), range, evt), evt.preventDefault()
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
        if (el.tagName === 'COLLAPSED')
          el.nextSibling ? r.setStartBefore(el.nextSibling) : r.setStartAfter(el),
          el.nextSibling ? r.setEndBefore(el.nextSibling) : r.setEndAfter(el)
        el = el.parentNode
        if (!el) return
        if (el.tagName === 'COLLAPSED')
          el.nextSibling ? r.setStartBefore(el.nextSibling) : r.setStartAfter(el),
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
          if (el.tagName === 'SERIALIZATION' || !el.classList) return
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
      bottombar.setAttribute('style', "position:sticky; left:0; bottom:0; z-index:10; width:100%")
      const JobIndicator = _jobs.indicator = elem('JobIndicator')
      JobIndicator.title = "Currently running 0 jobs. Click this to pause all."
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
          [_id(_closestNodeParent)]() {
            const r = []
            if (_jobs.expr)
              for (let i = 0; i < _jobs.expr.length; i += 3) {
                const L = _jobs.expr[i+1][_id(print)]
                if (L) r.push(L instanceof Map ? L.get(print) : L)
              }
            if (_jobs.limbo)
              for (let i = 0; i < _jobs.limbo.length; i += 3) {
                const L = _jobs.limbo[i+1][_id(print)]
                if (L) r.push(L instanceof Map ? L.get(print) : L)
              }
            return r.map(el => el.parentNode || el)
          }
        }
      }
      JobIndicator.onclick = () => {
        if (_jobs.expr) { // On click, pause all jobs.
          for (let i = _jobs.expr.length; i > 0; i -= 3)
            _pausedToStepper(_jobs.expr[i-3], _jobs.expr[i-2], _jobs.expr[i-1])
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
        const free = _allocArray(0)
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
        const Min = -document.documentElement.scrollTop, Max = document.documentElement.scrollHeight + Min
        if (Max+1 <= Min) return
        scrollHighlights.forEach((v,k) => {
          if (!k.isConnected || getComputedStyle(k).display === 'none')
            return elemRemove(scrollHighlights.get(k)), scrollHighlights.delete(k)
          let rect = k.getBoundingClientRect()
          if (!rect.x && !rect.y && !rect.width && !rect.height) {
            const r = document.createRange()
            r.selectNode(k)
            rect = r.getBoundingClientRect(), r.detach()
          }
          v._top = (rect.top - Min) / (Max - Min), v._height = rect.height / (Max - Min)
        })
        scrollHighlights.forEach(v => { if (v._top <= 1 && v._height <= 1) v.style.top = v._top*100+'%', v.style.height = v._height*100+'%' })
      }
      _listen('resize', _throttled(updateScrollHighlights, .125), passiveCapture)

      // Garbage-collect DOM elements every 5 mins.
      let domgc = false
      _listen(300000, () => {
        if (domgc) return; else domgc = true
        _doJob([_revisitElemValue], _newExecutionEnv())
      })

      // Insert scripts.
      //   TensorFlowJS: though not all of it fits our needs, this is the best numeric-operations library I know of.
      //     Much easier than manually going through WebGL and/or WebGPU (which isn't supported on my machine), at least.
      //     (To replace it, we'd need a "consolidate refcount=1 subtrees and non-interdependent DAG slices into GPU programs" function.)
      //   D3.js: data-driven documents, for plots (`display`).
      //     Also causes the 'Some cookies are misusing the recommended "SameSite" attribute' warning.
      defines(Browser, js).forEach(src => {
        if (!document.querySelector(`script[src=${CSS.escape(src)}]`)) {
          const s = elem('script')
          s.onerror = evt => {
            // Fetch from local filesystem if the remote one isn't available.
            const s = elem('script')
            s.src = evt.target.src.match(/\/[^\/]*$/)[0].slice(1)
            evt.target.replaceWith(s)
          }
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
          _schedule(parse(data, lang), env, print)
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
          _doJob(defines(fast, readAt).parse(str), _newExecutionEnv(), result => {
            // When done, postMessage the serialized result back.
            postMessage([ID, defines(fast, readAt).serialize(result)])
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
    _(`_useDarkTheme`),
    _(`_maxUsageOfCPU`),
  ],

  _runFunc:{
    docs:`Calls a native function or schedules a non-native function. Exists to minimize memory allocation for functions that we want to quickly run outside a job (such as from event handlers).`,
    call(f, ...args) {
      if (typeof f != 'function') error("Expected a function, got", f)
      if (defines(f, deconstruct) === undefined)
        f(...args)
      else
        _doJob([f, ...args.map(quote)], _newExecutionEnv())
    },
  },

  _hoverHighlightsDOMValues:[
    _(`settings`),
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
          ws[i-1].worker.onmessage = ({data:[ID, str]}) => ws[i-1].tasks[ID][1](defines(fast, readAt).parse(str)),
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
        const str = defines(fast, readAt).serialize([purify, [quote, expr]])
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
    const el = serialize(v, lang, undefined, {...serialize.displayed, collapseDepth:2, collapseBreadth:16, deconstructElems:true, dontBind:v})
    let e = el.tagName === 'SERIALIZATION' ? el.firstChild : el
    if (_isArray(v) || _isArray(defines(v, deconstruct)) || v[defines.key])
      if (e.title !== 'bound' && (e.firstChild.tagName != 'BRACKET' || e.lastChild.tagName != 'BRACKET')) {
        const parent = e.parentNode
        parent.removeChild(e)
        elemValue(e, null, true)
        parent.append(elemValue(elem('node', [elem('bracket', '('), e, elem('bracket', ')')]), v))
        if (!_isArray(v)) parent.lastChild.classList.add('nonArray')
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
        const v = quote(el.to)
        // Don't use `elemCollapse`, because un-collapsing in an editable area is just trouble, and the value can be viewed anyway.
        col = elemValue(elem('collapsed', '···'), v)
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
    call(m, topLevel, parents = readAt.parents, lang = basic, binds) {
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
      uses.forEach(x => readAt.parents.has(x) && uses.add(readAt.parents.get(x)))
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
    docs:`Parse text in \`...?\` to style it as \`fancy\`, and treat other strings as \`structuredSentence\`s. Return an array of children.
Text in double-backticks will be replaced with the result of executing it: \`1+2\`=\`\`1+2\`\`.`,
    call(s) {
      if (typeof s != 'string') return s
      let arr = s.split('`')
      for (let i = 0; i < arr.length; ++i)
        if (i & 1) {
          try {
            if (!arr[i])
              arr[i+2] && error("Double-backtick expected to close the opened double-backtick"),
              arr[i+1] = daintyEvaluator([print, parse(arr[i+1], undefined, undefined)]),
              arr[i+1].style.display = 'inline-block',
              i += 2
            else
              arr[i] = elem('serialization', parse(arr[i], undefined, undefined, parse.dom)[1])
          } catch (err) { console.log(err), arr[i] = elem('serialization', arr[i]) }
        } else
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
    _reflow().then(() => _smoothTransformPost(inside, preT), _smoothHeightPost(inside, preH))
  },

  _getOuterWindow(el) { return !el ? null : el.isWindow ? el : _getOuterWindow(el.parentNode) },

  disableBindingsElem:{
    docs:`\`disableBindingsElem()\`: creates an elem for disabling current bindings hierarchically.`,
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
      if (typeof start == 'function') {
        col.setAttribute('content', '···')
        col.append(elem('hidden'))
        col.onclick = evt => {
          const col = evt.target || evt.explicitOriginalTarget, p = col.parentNode, pre = _smoothHeightPre(p)
          const el = start()
          if (p) _isArray(el) ? el.forEach(el => p.insertBefore(el, col)) : el.parentNode !== p && p.insertBefore(el, col), p.removeChild(col)
          if (_getOuterWindow(p) || _getOuterContextMenu(p)) _updateBroken(_getOuterWindow(p) || _getOuterContextMenu(p)); else if (p) _updateBroken(p)
          p.dispatchEvent(new Event('input', {bubbles:true}))
          _smoothHeightPost(p, pre)
        }
      } else {
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
          elemValue(col, a.length !== 1 ? [rest, a] : a[0])
        }
        col.setAttribute('content', end === undefined ? '···' : '···$')
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
        if (start.title) col.title = start.title
        if (parent) parent.insertBefore(col, nextCol), _smoothHeightPost(parent, pre)
      }
      col.special = (original, copy) => copy.onclick = original.onclick
      return col
    },
  },

  print:{
    docs:`\`(print …Values)\`: For debugging; prints to the current DOM node or console.`,
    readAt:{
      structured:_(`structured`),
      structuredSentence:_(`structuredSentence`),
      display:_(`display`),
    },
    call(...x) {
      const prevPure = call.pure;  call.pure = false
      print.did = true
      try {
        let into = call.env && call.env[_id(print)]
        if (into instanceof Map) into = into.get(print)
        if (into && into.parentNode) {
          let str
          if (x.length != 1 || !_isStylableDOM(x[0]))
            str = serialize(x.length > 1 ? x : x[0], _langAt(), _bindingsAt(), serialize.displayed)
          else str = x[0]
          if (str.parentNode) str = elemClone(str)
          if (typeof str == 'string') str = document.createTextNode(str)
          const wasMax = _updateMaxScrollBegin()
          into.parentNode.insertBefore(str, into)
          _updateBroken(into.parentNode)
          _updateMaxScrollEnd(wasMax)
        } else
          console.log(...x)
        if (x.length == 1) return x[0]
      } catch (err) { if (err !== impure) console.log(err, err && err.stack), console.log('When trying to print', ...x) }
      finally { call.pure = prevPure }
      // print.did (for not erasing parts of a print in a terminal in NodeJS)
    },
  },

  _updateMaxScrollBegin() { return !_disableSmoothTransitions[1] && scrollY >= document.documentElement.scrollHeight - innerHeight - 5 },

  _updateMaxScrollEnd(begin) { if (begin) scrollBy(0, 10000) },

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
    _printAll:[
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
            const global = serialize(v, fancy, undefined, serialize.displayed), p = readAt.parents.get(v) || Self
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
        docs:`A table for \`readAt\`s.`,
        call([el, v]) {
          const backctx = _invertBindingContext(Self.ctx)
          if (!_isArray(v) && defines(v, readAt)) {
            const row = ([k,v]) => {
              if (typeof k != 'string') return
              let ve
              if (!backctx.has(v))
                ve = elemValue(elemCollapse(() => serialize(v, fancy, undefined, serialize.displayed)), v)
              else
                ve = serialize(v, fancy, undefined, serialize.displayed)
              return elem('tr', [elem('td', elem('span', k)), elem('td', ve)])
            }
            // For `Self`, only display public functionality without readAt.parents (displaying all bindings is too much).
            let a
            if (v !== Self) {
              const lkp = defines(v, readAt)
              a = Object.keys(defines(v, readAt)).map(k => [k, lkp[k]])
            } else a = [...backctx].filter(([v,k]) => v && v !== true && k[0] !== '_' && !readAt.parents.has(v)).map(([v,k])=>[k,v])
  
            return elem('div', [
              elemValue(elem('unimportant', 'Namespace for:'), readAt),
              elem('table', a.length <= 16 ? a.map(row) : [a.slice(0,16).map(row), elemCollapse(() => a.slice(16).map(row))]),
            ])
          }
        },
      },
      function([el, v]) {
        // For globals, the list of back-refs.
        if (_invertBindingContext(Self.ctx).has(v)) {
          const refd = referencedBy(v)
          if (refd && refd.length)
            return elem('div', [
              elemValue(elem('unimportant', [
                'Used in ',
                elemValue(elem('number', ''+refd.length), refd.length),
                refd.length != 1 ? ' other globals: ' : ' other global: ',
              ]), referencedBy),
              elemValue(elemCollapse(() => serialize(refd, basic, undefined, serialize.displayed)), refd)
            ])
        }
      },
      function([el, v]) {
        // For globals, the list of back-defs.
        if (_invertBindingContext(Self.ctx).has(v)) {
          const defd = definedBy(v)
          if (defd && defd.length)
            return elem('div', [
              elemValue(elem('unimportant', [
                'Defined by ',
                elemValue(elem('number', ''+defd.length), defd.length),
                defd.length != 1 ? ' globals: ' : ' global: ',
              ]), definedBy),
              elemValue(elemCollapse(() => serialize(defd, basic, undefined, serialize.displayed)), defd)
            ])
        }
      },
      function([el, v]) {
        // Array/string length, or the number/boolean/null/undefined.
        if (_isArray(v) || typeof v == 'string')
          return elem('div', [
            elemValue(elem('unimportant', (_isArray(v) ? 'Array' : 'String') + ' length: '), [readAt, v, 'length']),
            elemValue(elem('number', ''+v.length), v.length),
          ])
        if (typeof v == 'number')
          return elemValue(elem('number', ''+v), v)
        if (typeof v == 'boolean' || v == null)
          return elemValue(elem('known', ''+v), v)
      },
      function([el, v]) {
        // The full deconstruction if not a primitive value (like a number).
        if (v && (typeof v == 'object' || typeof v == 'function'))
          return elem('div', [
            elemValue(elem('unimportant', 'Basically: '), basic),
            elemValue(elemCollapse(() => _collapsedSerialization(v)), v),
          ])
      },
      function([el, v]) {
        // The official `settings` form of settings.
        if (_isArray(v) && v[0] === settings && typeof v[2] == 'string')
          return settings(v)
      },
    ],
    call(el) {
      if (typeof document == ''+void 0) return
      let v
      if (!(el instanceof Node)) v = el, el = undefined
      else v = el.to

      // Append a daintyEvaluator, executing `(_printAll describe ^(el v))`.
      return daintyEvaluator([_printAll, describe, [quote, [el, v]]])
    },
  },

  contextMenu:{
    docs:`Creates and displays a \`<context-menu>\` element near the specified element.`,
    philosophy:`Do not expect important information to get up in your face to yell about itself. Drill down to what you need or want. (In fact, those that want to improve will naturally be inclined to prioritize their shortcomings, so using the first impression can be counter-productive.)`,
    readAt:{
      describe:_(`describe`),
      toWindow:_(`elemToWindow`),
      allowDragging:_(`allowDragging`),
      permissions:_(`permissionsElem`),
      stringToDoc:_(`stringToDoc`),
      expandAll:_(`elemExpandAll`),
      insertLinkTo:_(`insertLinkTo`),
      atCursor:_(`atCursor`),
      addSearchElem:_(`addSearchElem`),
      editObject:_(`editObject`),
    },
    _printAll:[
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
              } catch (err) { elemInsert(result, defines(fast, readAt).parse(r)) }
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
        docs:`If we can expand all in the context element, then present that option.
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
              }, '🔧', 'Change the run-time object.') )
            if (editRewrite(v, null))
              area.append( button(() => {
                _removeChildren(area51)
                elemInsert(area51, editRewrite(v))
              }, '📝', 'Rewrite the global object. Changes will apply to the next rewrite 💾, `Rewrite()`.') )
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

      // Append a daintyEvaluator, executing `(_printAll contextMenu ^(el range v))`.
      menu.append(daintyEvaluator([_printAll, contextMenu, [quote, [el, range, v]]]))

      let inside = _getOuterContextMenu(el)
      if (_getOuterContextMenu(inside.parentNode) !== Self.into) inside = Self.into // Only one nesting layer.
      atCursor(menu, evt, inside)

      menu.focus({preventScroll:true})
    },
  },

  daintyEvaluator:{
    docs:`\`(daintyEvaluator Expr)\`: returns an element that will evaluate the expression and display its \`print\`s if any.`,
    call(expr, env) {
      if (typeof document == ''+void 0) return

      // Evaluate the requested expression.
      if (impureHave()) return impureLoad()
      if (!env) env = _newExecutionEnv(call.env)
      const result = _evaluationElem(env)
      const el = elem('div', result)
      el.classList.add('code')
      env[_id(print)] = el.lastChild
      let empty = false
      const prev = call.env
      _doJob(expr, env, () => (!result.previousSibling ? (empty = true, el.remove()) : result.remove()))
      call.env = prev
      return impureSave(!empty ? el : undefined)
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

  _recognizeBinding(binds, v) {
    if (_isArray(v) && v[0] === _extracted && v.length == 3 && (_isLabel(v[1]) || _invertBindingContext(binds).has(v[1])))
      return [_isLabel(v[1]) ? v[1] : label(_invertBindingContext(binds).get(v[1])), v[2]]
    return [null, v]
  },

  _addBinding(binds, L, v) {
    if (binds !== Self.ctx && !binds.has(evaluator.history))
      binds.set(evaluator.history, _allocMap())
    if (binds && binds.has(evaluator.history) && _isLabel(L)) { // Add result to bindings.
      if (binds.get(evaluator.history).has(L))
        return [error, "Label", L, "is already bound to", binds.get(L)]
      else {
        binds.get(evaluator.history).set(L, binds.has(L) ? binds.get(L) : evaluator.none)
        binds.set(L, quote(v))
        _invertBindingContext(binds, true)
        return [_extracted, L, v]
      }
    }
    return v
  },

  _removeBinding(binds, L) {
    if (binds && binds.has(evaluator.history) && _isLabel(L)) { // Delete result from bindings.
      const prevBinding = binds.get(evaluator.history).get(L)
      binds.get(evaluator.history).delete(L)
      prevBinding !== evaluator.none ? binds.set(L, prevBinding) : binds.delete(L)
      _invertBindingContext(binds, true)
    }
  },

  evaluator:{
    docs:`\`(evaluator Expr)\`: When logged to DOM, this displays the expression, its \`print\`s along the way, and its one evaluation result in one removable (by clicking on the prompt) DOM element.
When evaluating \`a:b\`, binds \`a\` to \`^b\` in consequent parses/serializations in the parent REPL; when evaluating anything else, tries to add the result to the \`CurrentUsage\` binding. Both are reverted when the evaluator is removed.`,
    _printAll:[
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
            _formatDuration(user),
            ', ',
            elemValue(elem('span', 'real'), realTime),
            elem('space', ' '),
            _formatDuration(real),
            ', ',
            elemValue(elem('span', 'report'), serialize),
            elem('space', ' '),
            _formatDuration(_timeSince(end)),
          ])
        },
      },
    ],
    Initialize() {
      evaluator.none = Symbol('none')
      evaluator.history = Symbol('history')
    },
    call(expr, thenElem) {
      if (impureHave()) return impureLoad()

      if (typeof document == ''+void 0) return

      const lang = _langAt(), binds = _bindingsAt()
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
      env[_id(print)] = waiting
      el.append(query)
      el.append(waiting)

      prompt.title = 'Click to remove this.'
      prompt.onclick = () => { // Remove the evaluator.
        _getOuterWindow(el) && _getOuterWindow(el).firstChild === el && _restoreWindow(_getOuterWindow(el))
        env != null && _cancel(env)
        thenElem ? el.replaceWith(thenElem) : elemRemove(el)
        elemValue(el, null, true, true), prompt.onclick = null

        _removeBinding(binds, bindAs)
      }
      elemValue(el, [evaluator, expr])

      // Evaluate the requested expression.
      const start = _timeSince()
      ;[bindAs, expr] = _recognizeBinding(binds, expr)
      const prev = call.env
      _doJob(expr, env, r => { // Got the result.
        const end = _timeSince(), real = _timeSince(start)

        r = _addBinding(binds, bindAs, r)

        const pre = _smoothHeightPre(el)
        elemRemove(waiting)
        // Merge `_updateBroken` of both logged children into one.
        _updateBroken(el)
        call.env = env

        // Display `_printAll evaluator ^(Result UserDuration RealDuration EndTime)`.
        el.append(daintyEvaluator([_printAll, evaluator, [quote, [r, env[_id(userTime)], real, end]]]))
        env = null
      })
      call.env = prev
      return impureSave(el)
    },
  },

  _formatDuration(x) {
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
    const el = env[_id(print)]
    el = _getOuterREPL(el)
    if (el && _isArray(el.to)) return el.to[1]
  },

  _bindingsAt(env = call.env) {
    if (!env) return Self.ctx
    if (_id(_bindingsAt) in env) return env[_id(_bindingsAt)]
    const el = env[_id(print)]
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
    ctx.forEach((to, name) => {
      if (_isLabel(name))
        name = name[1], (name[0] !== '_' || !backctx.has(to)) && backctx.set(to, name)
    })
    _invertBindingContext.cache.set(ctx, backctx)
    return backctx
    // .cache
  },

  _removeChildren(el) {
    // Smoothly removes all children of a node.
    if (el.firstChild)
      for (let ch = el.lastChild; ch; ch = ch.previousSibling)
        if (!ch.removed)
          elemRemove(ch, true, true, false)
  },

  _autocompleteBrackets:[
    _(`settings`),
    true,
    `Whether to autocomplete brackets/quotes in \`editor\`s.
'(' surrounds the selection in brackets. ')' surrounds the closest highlightable parent in brackets.`,
  ],

  _parseEditor(query, env = _newExecutionEnv()) {
    // Re-parses the contents of an element created with `editor`, highlighting the syntax and returning a promise.
    //   Returns a promise of its current value (or on .catch, the parsing error).
    const ed = query.lastChild, lang = query.to[2], binds = query.to[3]
    const s = getSelection(), i = _saveCaret(ed, s)
    return new Promise((then, err) => {
      _doJob([parse, ed, lang, binds, parse.dom], env, r => {
        if (!_isError(r)) {
          const [expr, styled] = r
          while (ed.firstChild) ed.removeChild(ed.firstChild)
          ed.append(elem('div', styled))
          if (i !== undefined && (document.activeElement === Self.into.parentNode.host || ed.contains(document.activeElement))) _loadCaret(ed, i, s)
          then(bound(n => n instanceof Element && n.special ? quote(n.to) : undefined, expr, false))
        } else
          err(r)
      })
    })
  },

  _editorError(query, expr) {
    // Displays the error message of editing, absolutely-positioned and quickly vanishing.
    let err = _isArray(expr) && expr[0] === jsRejected && expr.length == 2 ? expr[1] : expr
    if (_isArray(err) && err[0] === 'give more') err = err[1]
    try {
      const el = elem('error', err instanceof Element ? err : serialize(err))
      el.style.left = '1em'
      el.style.position = 'absolute'
      return elemInsert(query, el), void setTimeout(elemRemove, 1000, el)
    } catch (e) { return console.error(err) }
  },

  editor:{
    docs:`\`(editor InitialString Lang Binds OnInput OnEnter)\`: creates a user-editable expression input.
\`OnInput\` is passed the parsed expression and whether the currently entered text fails to parse. \`OnEnter\` is passed the expression and whether that's the parsing's error message, and it returns \`true\` to clear editor contents.
Don't do expensive synchronous tasks in \`OnInput\`.`,
    readAt:{
      _autocompleteBrackets:_(`_autocompleteBrackets`),
      _typingChil:_(`_typingChill`),
    },
    call(initialString = '', lang = fancy, binds = Self.ctx, onInput, onEnter) {
      if (typeof initialString != 'string' && !(initialString instanceof Node))
        error('String expected, got', initialString)
      if (!(binds instanceof Map)) error('Map expected, got', binds)
      if (onInput && typeof onInput != 'function') error('Function or nothing expected, got', onInput)
      if (onEnter && typeof onEnter != 'function') error('Function or nothing expected, got', onEnter)

      // On any mutations inside, re-parse its contents, and show purified output.
      let chillId = null
      let parseEnv = null, dontUpdate = false, failedUpdate = false
      const obs = new MutationObserver(_throttled(record => {
        if (!failedUpdate && dontUpdate) return; else dontUpdate = true // There were some issues with no-user-input continuous re-parsing.

        parseEnv && _cancel(parseEnv), parseEnv = _newExecutionEnv()
        _parseEditor(query, parseEnv)
        .then(v => { parseEnv = null, OnInput(v, false), obs.takeRecords(), setTimeout(() => dontUpdate = false, 10) })
        .catch(err => { parseEnv = null, OnInput(err, true), obs.takeRecords(), setTimeout(() => dontUpdate = false, 100) })
        obs.takeRecords()
      }, .2, () => dontUpdate && (failedUpdate = true)))

      // Create the element with the initial string.
      const ed = elem('node')
      ed.contentEditable = true
      ed.spellcheck = false
      obs.observe(ed, { childList:true, subtree:true, characterData:true })
      if (initialString && typeof initialString == 'string')
        ed.append(initialString)
      else if (initialString instanceof Node)
        ed.append(initialString)

      const query = elem('span')
      elemValue(query, [editor, initialString, lang, binds, onInput, onEnter])
      query.classList.add('editorContainer')
      query.classList.add('editable')
      const prompt = elem('prompt')
      query.append(prompt)
      prompt.title = 'Click to clear this.'
      prompt.onclick = () => _smoothHeight(ed, () => ed.textContent = '')
      query.append(ed)

      const undo = [[initialString]], redo = []

      ed.oninput = _throttled(() => {
        // Grow the undo buffer (and clear the redo buffer) on change.
        if (!undo.length || undo[undo.length-1].join('') !== _innerText(ed).join(''))
          redo.length = 0, undo.push(children(ed)), undo.length > 4096 && (undo.splice(0, undo.length - 4096))
      }, .05)
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
              _loadCaret(ed, _saveCaret(ed, s.anchorNode, s.anchorOffset))
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

        // On Ctrl+Z, pop one from undo (and push to redo).
        if (evt.key === 'z' && !evt.shiftKey && evt.ctrlKey && undo.length) {
          if (undo[undo.length-1].join('') === _innerText(ed).join('')) undo.pop()
          if (undo.length)
            redo.push(children(ed)), children(ed, undo.pop()), evt.preventDefault()
        }
        // On Ctrl+Shift+Z, pop one from redo.
        if (evt.key === 'Z' && evt.shiftKey && evt.ctrlKey && redo.length)
          undo.push(children(ed)), children(ed, redo.pop()), evt.preventDefault()
      }
      return query

      function OnInput(expr, fail) {
        if (!onInput) return
        if (chillId != null) clearTimeout(chillId)
        chillId = setTimeout((expr, fail) => (chillId = null, onInput(expr, fail)), _typingChill[1], expr, fail)
      }
      function evaluate(evt) {
        let clear = false
        if (onEnter)
          _parseEditor(query)
          .then(expr => { if (onEnter && onEnter(expr, false)) ed.textContent = '', OnInput(undefined, true), evt.preventDefault() })
          .catch(err => { if (onEnter && onEnter(err, true)) ed.textContent = '', OnInput(undefined, true), evt.preventDefault() })
      }
      function children(el, to) { // Set children of `el` to `to`, or return an array of inner text of `el`.
        const pre = _smoothHeightPre(el)
        if (!to) return _innerText(el).map(e => typeof e == 'string' ? e : elemClone(e))
        while (el.firstChild) el.removeChild(el.firstChild)
        el.append(...to, elem('div'))
        _smoothHeightPost(el, pre)
      }
    },
  },

  _evaluateWhileTyping:[
    _(`settings`),
    true,
    `Whether to evaluate expressions as they are typed in a REPL.`,
  ],

  _typingChill:[
    _(`settings`),
    150,
    `Purification of expressions while typing is throttled by this many ms.`,
  ],

  REPL:{
    docs:`\`(REPL Language Bindings)\`: Creates a visual REPL element (read-evaluate-print loop).`,
    readAt:{
      editor:_(`editor`),
      evaluator:_(`evaluator`),
      daintyEvaluator:_(`daintyEvaluator`),
      _evaluateWhileTyping:_(`_evaluateWhileTyping`),
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
              print.did = false
              const expr = parse(cmd, fancy, binds)
              opt.breakLength = out.columns
              if (out.isTTY && !print.did) {
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
      const purifyAndDisplay = _throttled((expr, fail) => {
        if (msg === false && _isArray(expr) && expr[0] === jsEval && typeof expr[1] == 'string' && expr[2]) expr = [randomNat, 2]
        const pre = _smoothHeightPre(pureOutput)
        if (penv !== undefined) _cancel(penv), waiting.remove(), penv = undefined, waiting = undefined
        let promise
        if (_evaluateWhileTyping[1]) {
          _removeChildren(pureOutput)
          if (!fail) promise = new Promise(then => {
            const e = penv = _newExecutionEnv(env, null, lang, binds)
            e[_id(print)] = waiting = _evaluationElem(penv), call.env = penv
            const bindAs = _isArray(expr) && expr[0] === _extracted && expr.length == 3 && _isLabel(expr[1]) ? expr[1] : null
            if (bindAs) expr = expr[2]
            pureOutput.append(waiting)
            _doJob(_isError(expr) ? quote(expr) : [purify, quote(expr)], penv, result => {
              const pre = _smoothHeightPre(pureOutput)
              const prevEnv = call.env;  call.env = penv
              try {
                waiting && waiting.remove(), waiting = undefined
                if (_isUnknown(result) && _isError(result[1]))
                  result = result[1] // Display errors too.
                if (bindAs) result = [_extracted, bindAs, result]

                if (!_isUnknown(result)) {
                  // Display `_printAll evaluator (Result)`.
                  pureOutput.append(daintyEvaluator([_printAll, evaluator, [quote, [result]]]))
                } else {
                  const el = elem('button', 'Evaluate')
                  elemValue(el, result)
                  el.onclick = evaluateLast
                  elemInsert(pureOutput, el)
                }
              } finally { _smoothHeightPost(pureOutput, pre), penv = undefined, call.env = prevEnv, then(e[_id(userTime)]) }
            })
            _smoothHeightPost(pureOutput, pre)
          }); else if (expr !== undefined) {
            let el = expr
            if (_isArray(el) && el[0] === jsRejected && _isArray(el[1]) && el[1][0] === 'give more')
              el = el[1][1] === 'No value at top level' ? undefined : elem('error', el[1][1])
            el && elemInsert(pureOutput, serialize(el, lang, binds, serialize.displayed))
            _smoothHeightPost(pureOutput, pre)
          }
        } else {
          if (pureOutput.lastChild && pureOutput.firstChild === pureOutput.lastChild && pureOutput.lastChild.tagName === 'BUTTON') return
          _removeChildren(pureOutput)
          pureOutput.append(button(evaluateLast, 'evaluate'))
          _reflow().then(() => _smoothHeightPost(pureOutput, pre))
        }
        return promise
      }, .1, expr => lastExpr = expr)

      const evaluateLast = () => _parseEditor(query).then(evaluate).catch(err => evaluate(err, true))
      const evaluate = (expr, fail) => {
        if (fail) return
        const prev = call.env;  call.env = env
        try { return print(evaluator(expr)), true }
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
      env[_id(print)] = query
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
\`tutorial()\`: views all globally-available tutorials.`,
    tutorial:[
      `A nice, sunny day out, with not a single cloud in sight. Let's make our understanding of tutorials as clear as the weather.

Tutorials are a way of explaining ourselves to other humans as a part of the only form of immortality that's possible. You better make your code understandable, and you better be nice.

But first, we need to make sure that you can type characters. Yes, just type out \`'Can type'\` in the field below and press Enter, very, very gently. Remember that your keyboard can be your friend for decades to come if you don't neglect it.`,
      [
        _(`fancy`),
        ``,
        `Can type`,
      ],
      `Good work getting this far. I cannot even imagine the trouble you went through, but for what you did, we are grateful.
      
Tutorials in \`tutorial\` are arrays of either text or an array of the language (see \`Languages\`), then the initial text, then optionally either the intended result or a function that judges whether the result is OK and we can continue.
      
Try making a tutorial from this description. Have to hand it to you: remember that \`(Func …Args)\` is how you call functions, \`(array …Items)\` is how you make arrays, and that \`fancy\` is the most basic language.`,
      [
        _(`fancy`),
        ``,
        function(result) { return result instanceof Node && result.tagName === 'TUTORIAL' },
      ],
      `Very nice.

However, you must drill deeper into the representations. Right-click on \`tutorial\` to summon a \`contextMenu\` on it, find its tutorial, and see what value will allow you to progress.`,
      [
        _(`fancy`),
        `'So, on a scale from one to ten, how much did the last person you killed deserve it?'`,
        `"0"`,
      ],
      `Or did you expect to have the answer handed to you? No one will give you anything if you don't take it.
      
Now, type \`(tutorial)\` and claim what's yours. (You could start with \`call\` or \`callAdjust\`.)`,
      [
        _(`fancy`),
      ],
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
      const binds = new Map(Self.ctx)
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
          const [lang, initialCode='', canContinue] = v
          const results = elem('div')
          let passed = false, env, bindAs, expr
          const OnInput = (x, fail) => !fail && (expr = x)
          const OnEnter = (x, fail) => {
            // Evaluate the expression, bind to a label if requested, and check its validity to see whether to continue.
            if (fail) return _editorError(ed, x)
            const pre = _smoothHeightPre(results)
            while (results.firstChild) elemValue(results.firstChild, null, true, true), results.firstChild.remove()
            if (env) env.then ? env.cancel && env.cancel() : _cancel(env)

            env = _newExecutionEnv(null, null, lang, binds)
            results.append(env[_id(print)] = _evaluationElem(env))
            _reflow().then(() => _smoothHeightPost(results, pre))

            let y; [bindAs, y] = _recognizeBinding(binds, x)
            _removeBinding(binds, bindAs)
            const start = _timeSince()
            _schedule(y, env, r => {
              const end = _timeSince(), real = _timeSince(start)
              r = _addBinding(binds, bindAs, r)
              const prevEvalElem = env[_id(print)] instanceof Map ? env[_id(print)].get(print) : env[_id(print)]
              const pre = _smoothHeightPre(results)
              prevEvalElem.remove()

              // Display `_printAll evaluator ^(Result UserDuration RealDuration EndTime)`.
              let withoutBinding = bindAs ? new Map(binds) : binds;  bindAs && withoutBinding.delete(bindAs)
              const e = _newExecutionEnv(env)
              e[_id(_bindingsAt)] = withoutBinding
              results.append(daintyEvaluator([_printAll, evaluator, [quote, [r, env[_id(userTime)], real, end]]], e))

              if (!passed)
                if (typeof canContinue == 'function') {
                  env = _newExecutionEnv(env)
                  let evalElem
                  results.append(evalElem = env[_id(print)] = _evaluationElem(env))
                  _doJob([canContinue, quote(r)], env, function checkOk(ok) {
                    if (ok && typeof ok == 'object' && ok.then) {
                      ok.then(checkOk)
                      env = ok
                    } else {
                      elemRemove(evalElem, true, true, false)
                      if (ok) passed = true, emit()
                      env = null
                    }
                    expr = x
                  })
                } else if (env = null, canContinue !== undefined)
                  if (r === canContinue)
                    passed = true, emit(), elemRemove(btn, true, true, false)
              _reflow().then(() => _smoothHeightPost(results, pre))
              expr = x
            })
            return false
          }
          const ed = editor(initialCode, lang, binds, OnInput, OnEnter)
          const btn = button(() => _parseEditor(ed).then(OnEnter).catch(err => OnEnter(err, true)), 'evaluate')
          result.append(ed)
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
      if (_isArray(x) && Object.isFrozen(x)) return
      if (lang === null) return true

      const flatten = (item, depth = 1) => {
        if (!_isArray(item)) return item
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
      const ed = editor(initial, lang, Self.ctx, (next, fail) => !fail && updateIndicator(expr = next), (next, fail) => {
        if (fail) return _editorError(ed, next)
        writeAt(x, undefined, next)
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
      if (!readAt.parents.has(x) && !backctx.has(x)) return
      if (lang === null) return true
      let key = backctx.has(x) ? label(backctx.get(x)) : x
      let keyPreview = key
      let value = Rewrite.ctx.has(x) ? Rewrite.ctx.get(x) : x
      const indicator = elem('div')
      updateIndicator()
      const keyEditor = editor(key === x ? '' : key[1], stringLanguage, Rewrite.ctx, (k, fail) => {
        if (!fail) keyPreview = k ? label(k) : x, updateIndicator()
      }, (k, fail) => {
        Rewrite.ctx.delete(key)
        key = keyPreview = k ? label(k) : x
        !fail && (Rewrite.ctx.set(key, value), Rewrite.ctx.set(x, value))
        updateIndicator()
      })
      let dec = deconstruct(value)
      if (_isArray(dec) && defines(dec, construct)) dec = make(...dec)
      const valueEditor = editor(serialize(dec, lang), lang, Rewrite.ctx, (v, fail) => {
        if (!fail) value=v, updateIndicator()
      }, (v, fail) => {
        value = v
        if (!fail)
          Rewrite.ctx.set(key, value), Rewrite.ctx.set(x, value)
        else if (v === undefined)
          Rewrite.ctx.delete(key), Rewrite.ctx.set(x, undefined)
        else _editorError(valueEditor, v)
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
    docs:`\`settings()\`: presents a hierarchy of all global user-modifiable settings.
\`settings Opt\`: presents the interface to change one option.`,
    readAt:{
      rangeSetting:_(`rangeSetting`),
      settingsToolbar:_(`settingsToolbar`),
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

        const whole = elem('settings', [el, elem('label')])
        if (!settings.n) settings.n = 0
        el.name = whole.lastChild.htmlFor = 'st' + (settings.n++)

        elemValue(el, opt)
        if (!el.title) el.title = opt[2]
        el.special = true
        whole.lastChild.textContent = el.title
        const observer = opt => {
          el.title = opt[2]
          if (!el.isConnected) observe(opt, observer, false)
          if (typeof opt[3] == 'function')
            opt[3](opt, el)
          else if (typeof opt[1] != 'boolean')
            el.value = opt[1]
          else
            el.checked = opt[1]
          whole.lastChild.textContent = el.title
          el.dispatchEvent(new Event('input', {bubbles:true}))
        }
        observe(opt, observer, true)
        return whole
      }
    },
  },

  rangeSetting(opt, el) {
    // Creates an <input type=range> when used in a `settings` array as setting[3].
    //   Extra arguments after this are min, max, step.
    //   Step can be a number for a linear scale, or `true` for exponential scale.
    if (!el) {
      el = elem('input')
      el.type = 'range'
      el.style.margin = el.style.padding = 0
      el.oninput = el.onchange = () => writeAt(opt, 1, typeof opt[6] == 'number' ? el.value : Math.exp(el.value))
    }
    el.min = delog(opt[4] || 0, opt[6])
    el.max = delog(opt[5] || 1, opt[6])
    el.step = typeof opt[6] == 'number' ? (opt[6] || .01) : .01
    el.value = delog(opt[1], opt[6])
    el.title = (opt[2] || '').replace(/%%%/g, ((opt[1]*100)|0)+'%').replace(/\?\?\?/g, opt[1])
    return el
    function delog(x, st) { return typeof st == 'number' ? x : Math.log(x) }
  },

  Commands:new Map([
    ['AuxClick', function(target, range, evt) {
      contextMenu(target, range, evt)
    }],
    ['CtrlClick', function(target, range, evt) {
      target && insertLinkTo(range, target)
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
      if (el.tagName === 'COLLAPSED' && el.firstChild && el.firstChild === el.lastChild) {
        if (el.firstChild === ch) ch = el
        const from = el.firstChild.textContent
        if (from.indexOf('···') >= 0) {
          const s = from.replace('···', '')
          if (s) el.parentNode.insertBefore(document.createTextNode(s), el.nextSibling), el.firstChild.textContent = '···'
        } else
          el.remove(), --j
      } else if (el.tagName === 'COLLAPSED' || el.tagName === 'SERIALIZATION') {
        if (el.tagName === 'COLLAPSED') {
          if (!el.firstChild || el.firstChild.tagName !== 'HIDDEN')
            el.insertBefore(elem('hidden'), el.firstChild)
        }
        while (el.parentNode && el.firstChild !== el.lastChild)
          el.parentNode.insertBefore(el.firstChild, el.nextSibling)
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
      const spec = el.special
      el.special = (el, to) => {
        _reflow().then(() => {
          to.style.removeProperty('display')
          _reflow().then(() => {
            setTimeout(() => (to.style.removeProperty('transform'), _clearStyle(to), to.special = spec), delay)
          })
        })
        el && typeof spec == 'function' && spec(el, to)
      }
      el.special(null, el)
    },
  },

  _reflow() {
    if (_reflow.p) return _reflow.p
    return _reflow.p = Promise.resolve().then(() => (_reflow.p = null, Self.into.offsetWidth))
  },

  _smoothHeightPre(el) { return !_disableSmoothTransitions[1] && el instanceof Element && el.offsetHeight || 0 },

  _smoothHeightPost:{
    docs:`Since height:auto does not transition by default (because it's too laggy for non-trivial layouts), we explicitly help it (because we don't care).
Call this with the element and the result of \`_smoothHeightPre\` to transition smoothly.`,
    call(el, pre) {
      if (pre === undefined) error("The previous height is needed")
      if (!(el instanceof Element)) return
      if (_disableSmoothTransitions[1]) return 0
      el.style.removeProperty('height')

      const post = _smoothHeightPre(el)
      if (pre !== post && pre !== parseFloat(el.style.height)) {
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

      try { into.insertBefore(el, before) }
      catch (err) { console.error(into, el); throw err }
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
    readAt:{
      particles:_(`particles`),
    },
    call(el, absolutize = false, doParticles = true, doHeight = true) {
      if (!el || el.removed) return
      el.removed = true
      if (!(el instanceof Element)) return el.remove ? el.remove() : errorStack('Not an element')

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
        const mx = parseFloat(getComputedStyle(el).marginLeft)
        const my = parseFloat(getComputedStyle(el).marginTop)
        const x = el.offsetLeft - mx, y = el.offsetTop - my, w = el.offsetWidth
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
    _(`settings`),
    .5,
    `The probability of extra effects for removing a visual element is %%%.`,
    _(`rangeSetting`),
    0,
    1,
    .01,
  ],

  particles:{
    docs:`A splash of magical particles.`,
    philosophy:`Most people create programming languages to improve performance for specific cases or to prove their way of thinking superior to others, but I actually just wanted to be a wizard and use a PL to enhance my craft.`,
    readAt:{
      _removalParticlesFrequency:_(`_removalParticlesFrequency`),
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
        arg1 = arg2 = undefined
        if (_isPromise(r))
          r.then(userTimePassed => {
            if (typeof userTimePassed != 'number') userTimePassed = _timeSince(start)
            lastDur = blend * userTimePassed + (1-blend) * userTimePassed, lastRun = _timeSince()
          })
        else
          lastDur = blend * _timeSince(start) + (1-blend) * _timeSince(start), lastRun = _timeSince()
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
      const parentWidth = e.classList.contains('broken') && noTableInside ? available+5 : (e.offsetWidth+5) || 1000
        // Not nearly as accurate as removing .broken would have been (with tables in particular), but much faster.
          // So we special-case the <table>-inside case
          // Structural learning at its finest
      let Sum = 0, Max = 0
      for (let ch = e.firstChild; ch; ch = ch.nextSibling) {
        const w = _updateBroken.widths.has(ch) ? _updateBroken.widths.get(ch) : ch.offsetWidth || 0
        _updateBroken.widths.delete(ch)
        Sum += w, Max = Math.max(Max, w)
      }
      if ((Sum > parentWidth) !== e.classList.contains('broken')) {
        // Set class async and calc+remember the new width ourselves, to not pay the enormous reflow-per-node cost.
        _updateBroken.widths.set(e, Max + 4)
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
      if (onlyTopLevel && readAt.parents.has(v)) return
      if (seen.has(v)) return; else seen.add(v)
      if (defines(v, x) !== undefined) f(v, defines(v, x))
    })
  },

  docs:{
    docs:`\`docs()\`: returns a hierarchical documentation elem. \`docs Func\`: makes documentation.`,
    readAt:{
      docsToHTML:_(`docsToHTML`),
    },
    call(f = undefined) {
      if (f !== undefined)
        return elem('text', stringToDoc(defines(f, docs)))
      if (docs.result) return docs.result
      const net = defines(Self, readAt)
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
      return 'Below is the output of `docsToHTML()`.\n\n'+(function convert(el) {
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
    docs:`\`examples()\`: Returns all available examples of usage of functions in a {(map … Function {(… {(Code ⇒ Becomes)} …)} …)} format.
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
              try { return evaluator([array, 'equals', b[0], b[1]], to) }
              finally { call.env = prev }
            }), a)
            return to
          }
          if (!_isArray(a)) throw "Examples must be arrays or comments"
          if (env && !env[_id(print)]) return a
          const from = parse(a[0], fancier, undefined, parse.dom)[1]
          const to = a[1] ? parse(a[1]) : elemCollapse(() => {
            const prev = call.env;  call.env = env
            try { return evaluator(parse(a[0]), to) }
            finally { call.env = prev }
          })
          return elem('div', [from, elem('span', '\n⇒ '), serialize(to, L, B, serialize.displayed)])
        })
        return elem('inline-block', r.length != 1 ? r : r[0])
      }
      if (f !== undefined) return transform(defines(f, examples))
      const result = new Map
      _forEachGlobalDefining(examples, (v, r) => result.set(v, transform(r)), true)
      if (typeof document == ''+void 0) return result
      return hierarchy(result, elem('span', 'Code examples:'))
    },
  },

  todo:{
    docs:`\`(todo F)\`: Returns a list of things to be done about \`F\`.
\`todo()\`: Returns all known things to be done. Less than a third is usually done.`,
    philosophy:`Through heedless difficulty, strength is gained.`,
    call(f) {
      if (_isArray(f)) error("Can only view todos of simple functions, not", f)
      if (f !== undefined) return defines(f, todo)
      const result = new Map
      _forEachGlobalDefining(todo, (v, r) => result.set(v, r))
      return result
    },
  },

  philosophy:{
    docs:`Unlike regular philosophy, this one stems only from computation.`,
    readAt:[
      `The only real way to understand something is to code it. Or do you think that humans are not intelligent creatures, and their words do not have unseen connections to the whole mind? No, a word is more than a thing, too foggy. The only way to understand learning is to be unable to learn and learn anyway.`,
      `There are things that do all other things. (Turing machines, particular logic systems like rewriting rules or category theory, functionalities of programming languages and their IRs; particular cellular automata, randomness-based program searches like evolution, general intelligences.)
Everything else about all of existence is a consequence. (Take a moment to think about everything that you have ever known and can know. No matter what it is, it was found.)

Widespread use of universal computers demonstrate this view's practicality. Attempts like the Wolfram Physics Project prove this view's viability as a complete theory of fundamental physics.
However, the difficulty is not that the view is non-obvious, it's that to feel it deep in your heart can be very hard (in other words, to find and connect and nurture an efficient implementation within humans is tricky, preventing adoption). To prove it more intuitively and without question, we must understand what constitutes a good user of a thing like a programming language. We want not just generality, but intelligence too.
Clearly, randomness is far far far far far too slow for practical applications. But we can do better. There's even a word for it: "arbitrary", to replace "random". We can do things like route differentiable computations through arbitrary programs to their predictions, and predict all numbers seen in user-space, to get more eyes in our brains, to let honesty and self-awareness guide us and become us. We don't even need large neural networks, just the prediction of everything, and then we can really begin to do interesting things.
Come on. Let's do it, inside this project. I'm excited.`,
      `Everything, nothing, and something. If "everything" is a thing that does everything, and the world is "everything", then "nothing" is exactly subversion of "something": something + nothing = everything. While an "everything" is still a thing, "something", it behaves completely differently in the long term, so it's worth separating.

To approach the whole of existence given a thing, the only describable way is to deny the thing you have. To become smarter is to gain insight of the beyond, for no purity is eternal. For example, a religion is "something", atheism is the reactionary "nothing" spawned from religions, and what religions often call God would be "everything" (agnosticism is meant to choose religion/atheism "in the end" when all possible evidence is collected, so it's not "everything"). For another example, a self-reproducing individual in a species is "something", the outside world (including effectively-random DNA mutations) is "nothing" to it, and combined they form "everything" of evolution.
To actually reach the whole requires perfect precision: when you don't need insight nor fancy words like above to see things as they are.

If we were to look at human minds as things, then most people are "something" (often traditional and predictable), smart and artsy people worship "nothing" (often revolutionary and anti-culture), and very few people are "everything" (no often-true description is possible, they do and are what they want). But why would we do that? To explain is to create and impose a thing, another barrier to "nothing" and "everything". Just believe in people, while being a god and knowing everything that there can be. Be nice! It's the only way to replace their world with a better one, your own.`,
      `In the past, humans and all they imply were the only source of everything in their world, giving rise to civilizations far beyond the previous nature. But as they gain greater understanding of themselves, they gradually separate those now-artificial fragments out. The focus shifts from humans and individuals and gatherings to skills and ideas and concepts. But without infinite self-improvement, which no software system currently has (only its effects), the minds of those who intertwine with software rot. Self-improvement is included in perfect generality, and the efficiency of non-general learning can be leveraged in generality by threading filaments to predictions. Let's see what we can do to make learnable scaffolding easy to use.`,
      `The built-in human emotions and personality framework is filled with predictability, inefficiency, exploits, and false dependencies. But it also has general intelligence in there. Find it, and reroute as much of the primary data loop (consciousness/identity/personality) as is possible through that infinite willpower. Most things that humans are and do are far from general intelligence, so, break them down then build them up.

But even if you do achieve clear intelligence, it should still be repeatedly re-induced, because we always want to ensure uniform sampling of conceptual space ("knowing everything") to learn from, because learning is life-long and general enough to include learning intelligence. Pick anything about yourself (such as by choosing a random word in a verbal self-description), understand what that choice is based on, and let go of it to try and find a better one. Every day, ask yourself: what part are you letting go of, to let its cause guide you to its equivalent again? Even something as small as (not) reading books, or (not) spending time on the Internet or consuming art, or (not) talking to people, or (not) being anxious of starting a new project, or making artificial intelligence. Fear is the most powerful limiter of choices, so always make sure that it doesn't affect things that don't really pose mortal danger.`,
      `AI is humanity's shadow and continuation, not of humans and individuals. Every gradual change from animals to humans, like shift to precise computers or exponential-ish technology progress, or equal opportunity of the same computational base and trust that spawns from that, or perfect internal honesty and self-awareness of each part, is exactly like AI; there is no need for AI to actually exist to affect everything about humanity.`,
      `\`m:{} (last (transform \\(mapWrite m ? (elem 'div' (stringToDoc (defines ? philosophy)))) (definedBy philosophy)) (hierarchy m))\``,
      [
        `Reading club`,
        `Ivan Illich's Tools for Conviviality. A critique of all the ways of life that dominated humanity for many centuries, and still do, such as predication on unlimited growth, the domination of tools over people, compulsory demanded-by-government education and healthcare, radical monopoly of transportation ("The overdetermination of the physical environment renders it hostile. Radical monopoly makes people prisoners of welfare. Men overwhelmed by commodities are rendered impotent and in their rage either kill or die, as Anakin or Padmé. The corruption of the balance of learning makes people into puppets of their tools.") — all of which is both true and obvious. Proposed solutions include "limit growth" and "give power to the people, and all things will be convivial", all of which are bullshit. He even thinks that human babies are the closest things to general intelligence that there are; hilarious. The book is more-or-less a call for a return to the basic structure of general intelligence, and the need to get away from particular things and paperclip optimizers to re-achieve balance in life, but with no clarity of what the basics actually are. Which is a tale as old as civilization. Overall, the writing is both true and disappointing. It really needs simplicity, clarity, and eyes to directly show usefulness of every point (might be impossible to do that in something as human-defined as politics, I'd think; "Conceptual rather than empirical criteria can be set for the constitutional limitation of power", my ass).
Little more than a lament on imperfect/imbalanced self-awareness, the uncanny valley of intelligence. Only a singularity in tools that have bound humanity in all ways can answer that lament well enough. ("It must be a tool which […] is respected by all; […] which […] does not lose its power because of [its] purpose […] in recent history; […] which […] possesses a fundamental structure that misuse cannot totally corrupt." Executing code directly is superior to hijacking minds of humans for the same work, so, code.)`,
        `Olaf Stapledon's Star Maker. A sci-fi book worth a thousand other sci-fi books, because it only looks at causes, not their effects, and doesn't really make noticeable mistakes (in the first half) thanks to experience in asking the averaged "why" (it's even in the title). But I do understand that such high-level narration is not everyone's cup of tea (not saying that those people are right, they're idiots, just saying that it can be as hard to read as a thousand sci-fi books).
There are some understandable mistakes, though. Telepathy, Earth-like physical conditions that are presumed to be far likelier than they really are, and the vagueness of the Starmaker and the resulting hippie/religious/cosmic-scale/20th-century-human angle (because let's be real, it's obviously a meta(phor) for general intelligence / singularity, which are sub-universes in practical formulations (see \`auto\`). Perfect precision of foundations has many non-obvious consequences that very significantly affect the large-scale picture, such as copying/scalability and provability of the lack of non-learned bias, so the cosmic future predicted in this book is mostly incorrect.), liveness of stars (to be called alive, self-preservation is needed; so either it's star-level and structure is preserved from star to star, surviving all the explosions and billions of star generations, or some peculiar inner structure eventually takes over most of a star and becomes noticeable like Earth's biosphere, which is limited to one star in addition to probably being impossible due to temperature destroying structures. That philosophical-zombie argument of "it's perfectly described by computationally-reducible math, but it totally has non-computationally-reducible world of life" won't work on anyone who's not a living failure. Unless, of course, you count elementary particles as structures that self-preserve to move through space, but they don't evolve into non-elementary-particles, so what's the point.). But make no mistake: even if some concepts are wrong, their usage is masterful, and it's no wonder that those who held them dear have called the book the most powerful work of imagination ever written, at some point.
I don't like this ceaseless butchering of innocent maidens. Should I stop the club?`,
      ],
    ],
  },

  await:{
    docs:`\`(await MaybePromise)\`: waits for the promise to finish before continuing evaluation.`,
    _cancel(p) {
      if (p && typeof p.cancel == 'function') p.cancel()
    },
    readAt:{
      delay:_(`delay`),
      parseURL:_(`parseURL`),
      fetchURL:_(`fetchURL`),
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
    docs:`\`delay()\` or \`(delay Value)\`: Just a function for testing promises.`,
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
    readAt:{
      cancel:_(`_cancel`),
      jobs:_(`_jobs`),
    },
    call(expr, env, then, noCheck = false) {
      // Call this to initiate a later evaluation of an expression; the callback will be called with the result.
      if (then && typeof then != 'function') throw "Expected a function continuation"
      if (!noCheck) // Don't add the same job twice.
        for (let i = _jobs.begin; i < _jobs.expr.length; i += 3)
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
      if (!returnJob) Object.keys(env).forEach(k => {
        const conc = concept.idToKey[+k]
        if (defines(conc, _cancel)) env[k] = void defines(conc, _cancel)(env[k])
      })

      try {
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
      } finally { if (!returnJob && typeof document != ''+void 0) _jobs.display(_jobs.indicator) }
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
    if (env[_id(print)]) {
      const el = env[_id(print)] instanceof Map ? env[_id(print)].get(print) : env[_id(print)]
      if (!_isArray(el) && !el.parentNode)
        return console.log('job is now invisible, so canceling:', expr, env)
    }

    call.env = env, call.depth = 0
    _checkInterrupt.step = 0 // So that a step always happens even if we immediately interrupt to step through execution.
    interrupt.stack = env[_id(interrupt)] // For faster access, both in typing and in running.
    interrupt.started = microstart // So that we can interrupt on timeout.
    _jobs.reEnter = true // So that code can specify custom `_schedule` overrides.
    let v, interrupted = false

    if (typeof document != ''+void 0 && env[_id(_checkInterrupt)] !== undefined)
      _highlightOriginal(env[_id(_checkInterrupt)], false)
    if (typeof document != ''+void 0 && _isArray(env[_id(print)]))
      env[_id(print)] = env[_id(print)][0].nextSibling, env[_id(print)].previousSibling.remove()
    try { v = callAdjust(expr) }
    catch (err) {
      if (err === interrupt) interrupted = true
      else v = _errorRepr(err)
    }
    if (typeof document != ''+void 0 && interrupted && env[_id(_checkInterrupt)] !== undefined) {
      // Highlight the last-executed expr.
      _highlightOriginal(env[_id(_checkInterrupt)], true)
    } else env[_id(_checkInterrupt)] = undefined

    call.env = env
    env[_id(userTime)] += _timeSince(env[_id(realTime)])
    interrupt.stack = call.env = undefined

    if (_isPromise(v)) _promiseReEnter.promise = v, _jobs.reEnter = _promiseReEnter, interrupted = true
    if (interrupted) // Re-schedule.
      _jobs.reEnter === true ? _schedule(expr, env, then, true) : (_highlightOriginal(env[_id(_checkInterrupt)], false), _jobs.reEnter(expr, env, then))
    else // We have our result.
      try { _newJobId(env[_id(_schedule)]);  _rememberToDispose(v);  then && then(v) } catch (err) { console.error(err) }
  },

  _jobs:{
    docs:`The interpreter loop. Use _schedule to do stuff with it.`,
    readAt:{
      _maxUsageOfCPU:_(`_maxUsageOfCPU`),
    },
    Initialize() {
      _jobs.expr = [], _jobs.limbo = []
      _jobs.begin = 0
      if (typeof document != ''+void 0) _jobs.display = _throttled(_jobsDisplay, .05)
    },
    call() {
      const DOM = typeof document != ''+void 0
      if (_jobs.expr.length) {
        let start = _timeSince(), end = start + (typeof process == ''+void 0 || !process.hrtime || !process.hrtime.bigint ? _msBeforeInterrupt[1] : BigInt(_msBeforeInterrupt[1] * 1000))
        if (!_jobs.duration) _jobs.duration = 0

        _jobs.running = true
        if (_jobs.indicator) _jobs.indicator.classList.toggle('yes', true)

        // Execute while checking for end.
        const jobs = _jobs.expr
        _jobs.begin && jobs.splice(0, _jobs.begin), _jobs.begin = 0
        do { _doJob(jobs[_jobs.begin++], jobs[_jobs.begin++], jobs[_jobs.begin++]) }
        while (_jobs.begin < jobs.length && _timeSince() < end)
        _jobs.begin && jobs.splice(0, _jobs.begin), _jobs.begin = 0
        _jobs.duration = _timeSince(start)
        _jobs.running = false
      }
      if (_jobs.expr.length) _jobsResume(Math.min(_jobs.duration / _maxUsageOfCPU[1] - _jobs.duration, 1000))
      if (DOM) _jobs.display(_jobs.indicator)
      // _jobs.expr (Array), _jobs.limbo (Array), _jobs.duration (Number), _jobs.reEnter (true or a _schedule-replacing function), _jobs.indicator
    },
  },

  _jobsResume(delay) {
    if (_jobs.expr.length) setTimeout(_jobs, delay || 0)
  },

  _jobsDisplay(el, a = Math.floor(_jobs.expr.length/3), b = Math.floor(_jobs.limbo.length/3)) {
    // Creates a <div> inside el for every existing job.
    let ch = el.firstChild || el.appendChild(document.createElement('div')), i = 0
    for (; i < a+b; ++i, ch = ch.nextSibling || el.appendChild(document.createElement('div')))
      ch.style.setProperty('--turns', -i/(a+b) + 'turn'), ch.classList.toggle('yes', i < a)
    for (; i = ch && ch.nextSibling, ch; ch = i) el.removeChild(ch)
    el.title = el.title.replace(/[0-9]+/, a+b)
    el.classList.toggle('yes', a || b && true)
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

  _newExecutionEnv(basedOn = null, printBefore = null, langIs = fancy, bindsAre = Self.ctx) {
    // Create a new execution env.
    // Don't ever re-use the same env in _schedule, use this instead.
    const e = Object.create(null)
    e[_id(print)] = printBefore
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
    e[_id(commit)] = undefined // Set of arrays of [value, changeSum, changeCount, …] to commit.

    e[_id(userTime)] = 0 // CPU time spent on this job.
    e[_id(realTime)] = undefined // The timestamp of when we last started executing this job.
    Object.seal(e)
    return e
  },

  last:{
    docs:`\`a;b;c\` or \`(last …Expressions)\`: (throws the first error or) returns the last result.
Execution is guaranteed to happen in this order.
In Scheme, the equivalent is called \`begin\`.`,
    _resultCanBe(x) { _resultCanBe(x[x.length-1]) },
    keep:-1,
    dispose:-1,
    interrupt:false,
    call(...r) {
      // We shuffle in neither `call` nor compilation, so we can just do this:
      return r[r.length-1]
    },
    _compileBody(env, assignTo, ...args) { return `${assignTo} = ${args[args.length-1]}` },
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
    typeRefine(a,b) {
      // Types match only when they're both quoting a ref-equal value.
      return _isArray(a) && _isArray(b) && a[0] === b[0] && a[1] === b[1] ? a : null
    },
    argCount:1,
    call(x) { // Value ⇒ Expr
      // Create the `(quote Expr)` representation if needed.
      if (call.pure && call.pure.has(x)) return x
      return _isArray(x) ? [quote, x] : x
    },
  },

  label:{
    docs:`\`Name\` or \`(label "Name")\`: represents a variable that can be bound or assigned.
Equal-name labels are bound to the same thing within the same binding. Each unnamed label is unique.
Evaluating a bound label results in its value, in the current function call. Evaluating an unbound named label results in an \`error()\`.`,
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
    argCount:1,
    call(name) {
      // Returns the label object, from cache if possible.
      if (!label.s)
        label.s = Object.create(null),
        typeof FinalizationRegistry != ''+void 0 && typeof WeakRef != ''+void 0 && (label.fin = new FinalizationRegistry(name => delete label.s[name])),
        Object.freeze(label)
      if (typeof name != 'string') error("Expected a string but got", name)
      if (!label.fin) {
        return label.s[name] || (label.s[name] = [label, name]) // Never collects garbage.
      } else {
        // A cache that holds values (the label objects) weakly.
        if (!label.s[name]) {
          const L = [label, name]
          label.s[name] = new WeakRef(L)
          label.fin.register(L, name)
        }
        return label.s[name].deref()
      }
    },
  },

  _isLabel(v) { return _isArray(v) && v[0] === label && typeof v[1] == 'string' && v.length == 2 },

  _unknown:{
    docs:`\`(_unknown Expr)\`: denotes that \`Expr\` is dependent on unknown factors and cannot be evaluated now, so it has to be deferred.`,
    argCount:1,
    call(x, reason) {
      if (_isArray(x) && x[0] === _unknown) return x
      if (call.pure && call.pure.has(x)) return x
      const a = _allocArray(2)
      return a[0] = _unknown, a[1] = x, a
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
    readAt:{
      nat:_(`randomNat`),
      prob:_(`randomProb`),
      truncatedNormal:_(`truncatedNormal`),
      biasedGlorotNormal:_(`biasedGlorotNormal`),
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
    interrupt:false,
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
        _(`fancy`),
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
        _(`fancy`),
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
Defining this allows function application. In fact, \`F:(func …?)\` is the same as \`(concept {call F})\`.
Computation cycles are disallowed, and every node's value (array's value) is only computed once.
(This used to be used in the global interpreter loop, but was superseded by \`callAdjust\`.)


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
    readAt:{
      quote:_(`quote`),
      apply:_(`apply`),
      func:_(`func`),
      select:_(`select`),
      last:_(`last`),
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
      let [i = 0, outputs = _allocArray(po.length), po, inds, rc] = interrupt(5)

      // Evaluating inputs with recursion leaves ugly stack traces in errors, so we iterate over the post-order traversal instead.
      if (!po) [po, inds, rc] = _postorderInfo(x)
      const collected = _allocArray(8)
      try {
        for (; i < po.length; ++i) {
          // Go through all nodes in the DAG, collect args, and apply functions.
          collected.length = inds[i].length
          for (let j=0; j < collected.length; ++j) {
            const ind = inds[i][j], dep = po[i][j]
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
        if (err === interrupt) interrupt.stack.push(i, outputs, po, inds, rc)
        throw err
      } finally { _allocArray(collected) }
      // .env (current execution environment), .depth (current call depth), .pure.
    },
  },

  apply:{
    docs:`\`apply ^(Func …Args)\`: assuming that \`Func\` and \`Args\` are already evaluated, simply applies the function to arguments.`,
    call(x) {
      if (typeof x[0] != 'function')
        error('Expected a function to call, got', x[0], 'in the DAG node', x)
      return x[0].call(...x)
    },
  },

  Constructions:{
    docs:`Arrays are a good way of representing graphs. But not all runtime objects are arrays. The functions here allow encoding objects in arrays.`,
    readAt:{
      make:_(`make`),
      makeGraph:_(`makeGraph`),
      construct:_(`construct`),
      deconstruct:_(`deconstruct`),
      concept:_(`concept`),
      map:_(`map`),
      tensor:_(`tensor`),
      static:_(`static`),
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
    call(x, e) {
      let [env = e || _allocMap(), unfinished = new Set] = interrupt(2)
      // env: original —> constructed|original
      // unfinished: Whether we have not constructed a node yet.
      try { x = walk(x);  !e && _allocMap(env);  return x }
      catch (err) { if (err === interrupt) interrupt.stack.push(env, unfinished); else !e && _allocMap(env);  throw err }

      function walk(x) {
        if (!_isArray(x)) return x

        // As a bonus, inline calls of known expressions.
        if (x.length == 2 && x[0] === call && (!_isArray(x[1]) || _isArray(x[1]) && x[1].length == 2 && x[1][0] === quote)) {
          const expr = _isArray(x[1]) ? x[1][1] : x[1]
          if (_isArray(expr)) x.length = 0, x.push(...expr)
          else x.length = 2, x[0] = quote, x[1] = expr
        }

        let [i] = interrupt(1)
        try {
          if (i === undefined) {
            if (env.has(x)) return env.get(x)
            if (!_isArray(x[0]) && defines(x[0], construct))
              env.set(x, construct(x)), unfinished.add(x)
            else
              env.set(x, x)
            i = 0
          }
          for (; i < x.length; ++i)
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
        } catch (err) { if (err === interrupt) interrupt.stack.push(i);  throw err }
      }
    },
  },

  construct:{
    docs:`\`construct(x)\`→\`obj\` / \`construct(x,obj)\`: To encode non-array objects in array graphs, a global \`defines\` this.
Globals and user-defined concepts that statically define this are constructed right after parsing.

This embodies a simple principle: a graph/network cannot be constructed without backpatching.
(While this can be used to implement Lisp-like macros, please call quoted code or apply functions instead. \`construct\` is for non-array objects.)`,
    call(x, obj = undefined) {
      if (_isArray(x)) {
        if (typeof defines(x, construct) == 'function')
          return defines(x, construct)(x, obj)
      }
      if (x instanceof Map)
        !(obj instanceof Map) && error('Expected a map, got', obj),
        x.clear(), obj.forEach((v,k) => x.set(k,v))
      return x
    },
  },

  tensor:{
    docs:`\`tensor Numbers Shapes Type\`: \`construct\`s a multi-dimensional array of numbers.`,
    serialize:0,
    construct(x, obj) {
      if (obj === undefined) {
        let [_, data, shapes, t] = x
        if (!data) error("Expected data, got", data)
        if (shapes !== undefined && !_isArray(shapes)) error("Expected an array or nothing, got", shapes)
        const dtype = t===f32 || t===undefined ? 'float32' : t===i32 ? 'int32' : t==='bool' ? 'bool' : null
        if (!dtype) error("Expected", f32, "or", i32, "or", 'bool', "or nothing, got", t)
        if (typeof data == 'string')
          data = _fromBase64(data).buffer,
          data = dtype === 'float32' ? new Float32Array(data) : dtype==='bool' ? new Int8Array(data) : new Int32Array(data)
        return _tf(tf.tensor(data, shapes, dtype))
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
        let data
        try { data = serialize.styles ? v.arraySync() : _toBase64(v.dataSync()) }
        catch (err) { data = '<Disposed>' }
        if (v.dtype === 'float32' && v.shape.length <= 1)
          return [tensor, data]
        if (v.dtype === 'float32')
          return [tensor, data, v.shape]
        return [tensor, data, v.shape, v.dtype==='int32' ? i32 : v.dtype==='bool' ? 'bool' : error("Unrecognized dtype:", v.dtype)]
      }

      if (v && Object.getPrototypeOf(v) && Object.getPrototypeOf(Object.getPrototypeOf(v)) === Object.getPrototypeOf(Int8Array.prototype)) {
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

      if (allowPath && readAt.parents.has(v)) {
        const p = readAt.parents.get(v), lkp = defines(p, readAt)
        if (lkp)
          for (let k in lkp)
            if (lkp[k] === v) return [readAt, p, k]
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
      if (!v || typeof v != 'object')
        return v
      // And, objects (likely in `readAt`) just get deconstructed as maps.
      const arr = [map]
      Object.keys(v).forEach(k => arr.push(+k === +k ? +k : k, v[k]))
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
    src = src.replace(/^[_a-zA-Z0-9]+/, '')
    try { Function('('+src+')') }
    catch (err) { src = 'function'+src }

    return ctx !== undefined ? [jsEval, src, ctx] : [jsEval, src]
  },

  input:{
    docs:`\`input\` or \`?\`: A convenient mark of a function input.
For example, both \`\\?+3 5\` and \`(func ? ?+3) 5\` returns \`8\`.`,
  },

  _fallthroughFunc(n) {
    // Given count of inputs.
    if (n === 0) return function fallthrough() { return fallthrough.f() }
    else if (n === 1) return function fallthrough(a1) { return fallthrough.f(a1) }
    else if (n === 2) return function fallthrough(a1, a2) { return fallthrough.f(a1, a2) }
    else if (n === 3) return function fallthrough(a1, a2, a3) { return fallthrough.f(a1, a2, a3) }
    else if (n === 4) return function fallthrough(a1, a2, a3, a4) { return fallthrough.f(a1, a2, a3, a4) }
    else return function fallthrough(...a) { return fallthrough.f(...a) }
  },

  _adjustFunc:{
    call(f, ins, dout) { if (call.pure) throw impure;  const a = f.a(ins, undefined, dout);  return a },
    dispose(a) { a.forEach(dispose), _allocArray(a) },
  },

  func:{
    docs:`\`\\Body\` or \`func ? Body\` or \`func …ArgNodes Body\` or \`Arg1->Arg2->Arg3->Body\`: A \`construct\` that can be called to evaluate \`Body\`, replacing values of \`ArgNodes\` with dynamically-provided values.

Note that despite what the arrow-syntax might suggest, there are no closures unless you \`make\` them. Syntactic scope does not exist after parsing, so we wouldn't even know what's a closure. This way is more explicit anyway.

What a function does, does not change when a node in its body changes. That would need a lot of memory to wire up. Instead, re-compile the function object itself with \`writeAt\` (accessible from \`contextMenu\`) if a change is needed.`,
    todo:`Make \`func\` use \`purify\` on its body, to be more efficient at run-time.
Make created funcs choose to be inlinable (using \`purify\` with the function body). (Maybe only \`autoFunc\`s, though: a heuristic like "only up to a certain depth/size" might not be enough.)`,
    readAt:{
      input:_(`input`),
    },
    argCount:1,
    _resultCanBe(x) { _resultCanBe(x[x.length-1]) },
    examples:[
      [
        `\\4 5`,
        `4`,
      ],
      [
        `(func a b a+b) 1 3`,
        `4`,
      ],
      `Note that the specified arguments are not evaluated.`,
      [
        `2→2+2 5`,
        `10`,
      ],
      `(IN BASE FOUR.)`,
    ],
    construct(x, obj) {
      if (!_isArray(x) || x.length < 2) error("Expected at least the function body")
      if (obj === undefined) {
        obj = _fallthroughFunc(x.length-2)

        const d = obj[defines.key] = Object.create(null)
        d[_id(deconstruct)] = _allocArray(x.length)
        d[_id(argCount)] = x.length-2
        d[_id(dispose)] = true

        d[_id(mergeAdjustment)] = _mergeTensors // Just assume that every arg is a tensor.
        d[_id(adjust)] = [_adjustFunc, obj, _ins, _dout]
        d[_id(adjustSave)] = true
        d[_id(adjustLater)] = true // Make sure that the function is not skipped at adjustment.
          // (Checking whether any nodes define `adjustLater` would have been much more accurate, but that's data-dependent, and concepts are immutable.)
          //   (We never `observe` them, at least.)

        Object.freeze(d)
        return obj
      } else {
        const d = obj[defines.key], dd = d[_id(deconstruct)]
        if (d[_id(argCount)] !== x.length-2)
          error("Cannot change arg-count from", d[_id(argCount)], "to", x.length-2)
        dd.length=0, dd.push(...x)

        const inputs = _allocMap()
        for (let i = 1; i < x.length-1; ++i) inputs.set(x[i], i)
        let [poIndRc = _postorderInfo(x[x.length-1], inputs)] = interrupt(1)
        try {
          obj.a = _compileAutograd(poIndRc, inputs)
          obj.f = _compileBody(x[x.length-1], inputs, poIndRc)
        } catch (err) {
          if (err === interrupt) interrupt.stack.push(poIndRc), poIndRc = null
          throw err
        } finally { _allocMap(inputs), poIndRc && defines(_postorderInfo, dispose)(poIndRc) }
      }
    },
    nameResult:[
      `f`,
      `g`,
      `h`,
    ],
  },

  _compileAutograd(poIndRc, inputs) {
    // _compileBody(autograd(poIndRc)), but does proper checks and never returns `undefined`.
    if (!poIndRc[0].length) return null
    let ag = autograd(poIndRc, inputs)
    if (!ag) return null
    ag = !_isError(ag) ? ag : ag.map(quote)
    const agPoIndRc = _postorderInfo(ag, adjust.inputs, true)
    const fun = _compileBody(ag, adjust.inputs, agPoIndRc, false)
    defines(_postorderInfo, dispose)(agPoIndRc)
    return fun
  },

  _getSavedNodes:{
    docs:`Given nodes in post-order and indexes for each, returns a newly-allocated array of \`true\` if the node needs to be saved to adjustment or \`undefined\` (or returns \`null\`).`,
    call(po, ind) {
      let save = null
      for (let i=0; i < po.length; ++i) {
        const x = po[i], ins = ind[i]
        if (typeof x[0] != 'function' || _isArray(x[0]) || defines(x[0], adjust) === undefined || defines(x[0], mergeAdjustment) === undefined)
          continue
        const adj = defines(x[0], adjust)
        _fillAdjustInputs(adj)
        if (_doesAdjustRead(adj, 0))
          !save && (save = _allocArray(po.length)), save[i] = true
        if (_doesAdjustRead(adj, 'ins'))
          for (let j = 1; j < ins.length; ++j)
            if (ins[j] !== null && _doesAdjustRead(adj, j))
              !save && (save = _allocArray(po.length)), save[ins[j]] = true
      }
      return save
    },
  },

  _fillAdjustInputs:{
    docs:`Fills props on itself to signify whether this DAG (of \`defines X adjust\`) uses \`_out\`, \`_dout\`, and/or \`_ins\` (and which statically-known index of \`readAt Y Index\`).
Use \`_doesAdjustRead\` to read out those props.`,
    Initialize() {
      const f = _fillAdjustInputs
      f.out = new WeakSet, f.dout = new WeakSet, f.ins = new WeakMap, f.In = []
    },
    call(x) {
      const { out, dout, ins, In } = _fillAdjustInputs
      if (!_isArray(x) || ins.has(x)) return
      ins.set(x, false)
      for (let i=0; i < x.length; ++i) {
        const c = x[i]
        if (ins.get(x) !== 'all' && _isArray(c) && c.length == 3 && c[0] === readAt && c[1] === _ins) {
          if (typeof c[2] == 'number' && c[2] === c[2]>>>0)
            ins.set(x, true), (In[c[2]] || (In[c[2]] = new WeakSet)).add(x)
          else !ins.get(x) && ins.set(x, 'all')
        } else {
          _fillAdjustInputs(c)
          if (c === _dout || dout.has(c)) dout.add(x)
          if (c === _out || out.has(c)) out.add(x)
          if (c === _ins) ins.set(x, 'all')
          else if (ins.get(x) !== 'all' && ins.get(c)) {
            ins.set(x, ins.get(c))
            if (ins.get(c) !== 'all')
              for (let j=0; j < In.length; ++j)
                if (In[j] && In[j].has(c)) In[j].add(x)
          }
        }
      }
      // .out (WeakSet), .dout (WeakSet), .ins (WeakMap to false/true/'all'), .in (an array of WeakSets — whether an individual input is read)
    },
  },

  _doesAdjustRead(adj, i) {
    // Returns true if this particular input index (zero-based) is used in the func's adjustment (or if any 'ins' index is used, or out/'dout').
    if (typeof adj == 'function') return true
    if (i === 0) return _fillAdjustInputs.out.has(adj)
    if (i === 'dout') return _fillAdjustInputs.dout.has(adj)
    if (i === 'ins') return _fillAdjustInputs.ins.get(adj)
    if (_fillAdjustInputs.ins.get(adj) === 'all') return true
    return _fillAdjustInputs.In[i-1] ? _fillAdjustInputs.In[i-1].has(adj) : false
  },

  _compileBody(body, inputs = null, poIndRc, saveToAdjust = true) {
    // At least `body` is required.
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
     * - `adjustSave`ing some results for use in `adjust`.
     * - `dispose`al of results, or `keep`ing them.
     */

    let owningPoIndRc = false
    if (!poIndRc && _isArray(body) && body[0] !== quote)
      poIndRc = _postorderInfo(body), owningPoIndRc = true

    const consts = _allocMap()
    const [src, sourceURL, lines] = toSource(body, poIndRc, owningPoIndRc)
    try {
      const fn = Function([...consts.values()].join(','), src)(...consts.keys())
      fn.lines = lines
      if (!_compileBody.fin && typeof FinalizationRegistry != ''+void 0)
        _compileBody.fin = new FinalizationRegistry(sourceURL => delete _resolveStack.functions[sourceURL])
      _compileBody.fin && _compileBody.fin.register(fn, sourceURL)
      _resolveStack.functions[sourceURL] = typeof WeakRef != ''+void 0 ? new WeakRef(fn) : fn
      return _allocMap(consts), fn
    } catch (err) { console.error(src), _allocMap(consts); throw err }

    function toSource(body, poIndRc, owningPoIndRc) {
      // Compiles a DAG into an SSA form in JS that handles `interrupt`s.
      const code = _allocArray(0)
      let nextStage = 1

      const sourceURL = new Array(32).fill().map(() => (Math.random()*16 | 0).toString(16)).join('')
      const lines = []

      code.push(`'use strict'`)
      code.push(`return function F(${inputs ? [...inputs.values()].map(i => 'in'+i) : ''}) {`)
      if (!_isArray(body) || body[0] === quote || !poIndRc[0].length)
        code.push(` return ${env(body)}`)
      else if (poIndRc[0].length == 1 && !_isArray(defines(poIndRc[0][0], adjust)))
        _checkArgCount(body, inputs),
        lines.push(code.length+2, body),
        code.push(` try { return ++${env(call)}.depth, ${env(body[0])}(${body.slice(1).map(env)}) } finally { --${env(call)}.depth }`)
      else {
        code.push(` ${env(_checkInterrupt)}(F)`)
        const backpatchVars = code.push(` VARIABLES`)-1
        code.push(` ++${env(call)}.depth`)
        code.push(` try {`)
        const backpatchGotoInterrupt = code.push(`  switch (stage) { case 0:`)-1

        const [po, inds, rc] = poIndRc
        const used = _allocArray(po.length)
        const nodeNames = _allocArray(po.length), freeNames = _allocArray(1)
        used.fill(0), freeNames[0] = 0

        // Save vars for adjustment.
        const save = saveToAdjust && _getSavedNodes(po, inds)
        // Keep (trade call to `keep` with lack of call to `dispose`) inputs of nodes that request that (unless they re-introduce a specific arg).
        const kept = _allocArray(po.length)
        for (let i=0; i < po.length; ++i) {
          let keepIndex = defines(po[i], keep)
          keepIndex < 0 && (keepIndex += po[i].length)
          if (keepIndex == null) continue
          for (let j=0; j < po[i].length; ++j)
            // Keep the index if defined.
            if (inds[i][j] !== null)
              if (keepIndex === true || typeof keepIndex == 'number' && j === keepIndex)
                kept[inds[i][j]] = (kept[inds[i][j]] || 0) + 1
        }

        for (let i=0; i < po.length; ++i) {
          // Walk the DAG in post-order, emit assignment of vars to application results.
          //   We don't re-use variable slots that won't be used in computation, because adjustment could want them.
          //     (Re-computing results requires estimates of runtime of nodes or other predictions, which are unavailable for now.)
          const x = po[i], ins = inds[i]
          _checkArgCount(x, inputs)
          if (i) if (_isArray(x[0]) || defines(x, interrupt) !== false) {
            // Advance the interrupt stage if we cannot guarantee the function is non-interrupting.
            code.push(`   stage = ${nextStage}; case ${nextStage}:`)
            ++nextStage
          }

          // Collect var names of dependencies.
          const s = _allocArray(x.length)
          for (let j=0; j < x.length; ++j)
            s[j] = ins[j] !== null ? nodeNames[ins[j]] : env(x[j]),
            ins[j] !== null && ++used[ins[j]]
          nodeNames[i] = freeNames.length > 1 ? freeNames.pop() : 'v'+freeNames[0]++

          // Assign result of application to its var. (Also accommodate some debugging settings.)
          //   `x` can define `_compileBody(env, assignTo, ...args)`.
          lines.push(code.length+2, x)
          const d = defines(x, _compileBody)
          let stmt = typeof d == 'function' ? d(env, nodeNames[i], ...s.slice(1)) : `${nodeNames[i]} = ${s[0]}(${s.slice(1)})`
          if (_debugMemory[1]) stmt += `; ${env(_willDispose)}(${nodeNames[i]}, ${env(x)})`
          if (_debugInterrupt[1] && !(_isArray(x[0]) || defines(x, interrupt) !== false))
            stmt = `try{${stmt}}catch(err){if(err===interrupt)error("An interrupt in a non-interrupt node:",${env(x)});throw err}`
          if (stmt.indexOf('\n') >= 0) error("Must not have newlines in", stmt)
          code.push(`   ${stmt}`)
          _allocArray(s)

          // Decrease ref-counts of dependencies, and dispose vars and mark for re-use if no longer needed.
          for (let j=0; j < x.length; ++j) {
            const k = ins[j]
            if (k !== null && used[k] === rc[k] && !kept[k]) {
              if (save && save[k]) continue // Adjustment will decide its fate.
              if (!nodeNames[k]) continue // Don't dispose the same arg twice.
              if (kept[k]) continue // Another has taken responsibility.
              let node = po[k], disp
              while (true) {
                // Get how to dispose the result: consult definition (always dispose unknown-function results), go to index.
                disp = defines(node, dispose) || _isArray(node) && _isArray(node[0])
                if (typeof disp == 'number') disp < 0 && (disp += node.length), node = node[disp]
                else break
              }
              if (disp)
                code.push(`   ${nodeNames[k]}=void ${env(typeof disp == 'function' ? disp : dispose)}(${nodeNames[k]})`)
              freeNames.push(nodeNames[k]), nodeNames[k] = undefined
            }
          }
          // If adjustment will need the result but another node said it'll take care of it, `keep` the result for adjustment.
          if (save && save[i] && kept[i])
            for (let j=0; j < kept[i]; ++j)
              code.push(`   ${env(keep)}(${nodeNames[i]})`);
        }
        if (save && save.filter(x => x).length) { // Save those that need saving, for adjustment.
          const svs = save.map((sv,i) => sv && nodeNames[i]).filter(x => x)
          code.push(`   const $$$=${env(_allocArray)}(${svs.length})${svs.map((sv,i) => '; $$$['+i+']='+sv).join('')}`)
          code.push(`   ${env(adjustSave)}($$$)`)
        }
        _isArray(save) && _allocArray(save), _allocArray(kept)
        code.push(`   return ${po.length ? nodeNames[po.length - 1] : env(body)}`)

        const listOfVars = new Array(freeNames[0]).fill().map((_,i) => 'v'+i)
        _allocArray(used), _allocArray(nodeNames), _allocArray(freeNames)

        if (nextStage <= 1)
          code[backpatchGotoInterrupt] = ``
        else code.push(`  }`)

        code.push(` } catch (err) {`)
        code.push(`  if (err === ${env(interrupt)})`)
        if (nextStage > 1)
          code[backpatchVars] = ` let [stage=0,${listOfVars}] = ${env(interrupt)}(${1+listOfVars.length})`,
          code.push(`   ${env(interrupt)}.stack.push(stage,${listOfVars})`)
        else
          code[backpatchVars] = listOfVars.length ? ` let ${listOfVars}` : ``,
          code.push(`   ;`)
        code.push(`  else ${listOfVars.map((v,i) => defines(po[i], dispose) && `${env(dispose)}(${v})`).filter(x=>x)};`)
        code.push(`  throw err`)
        code.push(` }`)
        code.push(` finally { --${env(call)}.depth }`)
        if (owningPoIndRc)
          defines(_postorderInfo, dispose)(poIndRc)
      }
      code.push(`}`)
      code.push(`//# sourceURL=${sourceURL}`)
      const result = code.join('\n')
      _allocArray(code)
      return [result, sourceURL, lines]
    }
    function env(x) {
      // Returns the string that can be used to refer to the constant value.
      if (inputs && inputs.has(x)) return 'in'+inputs.get(x)
      if (typeof x == 'number' || typeof x == 'boolean') return ''+x
      if (_isArray(x) && x[0] === quote) x = x[1]
      if (!consts.has(x))
        consts.set(x, 'e' + consts.size)
      return consts.get(x)
    }
  },

  _checkArgCount(x, inputs) {
    // Checks arg count, and function-ness, at compile time. Does not catch all cases, but it's good enough.
    if (!_isArray(x) || _isArray(x[0]) || inputs && inputs.has(x[0])) return
    if (typeof x[0] != 'function') error('Expected a function to call, got', x[0], 'in the DAG node', x, 'with func inputs', inputs)
    if (typeof defines(x[0], argCount) == 'number')
      if (defines(x[0], argCount) !== x.length-1)
        error('Expected', defines(x[0], argCount), 'args but got', x.length-1, 'in', x)
  },

  _postorderInfo:{
    docs:`Linearizes all execution-relevant information about a DAG into 3 equal-sized arrays.`,
    interrupt:false,
    dispose(poIndRc) { poIndRc[1].forEach(_allocArray), poIndRc.forEach(_allocArray), _allocArray(poIndRc) },
    call(dag, inputs, reversed = false) {
      const po = _allocArray(0), ind = _allocArray(0), rc = _allocArray(0)
      const toIndex = _allocMap()
      try { walk(dag) }
      catch (err) { _allocArray(po), _allocArray(ind), _allocArray(rc);  throw err }
      finally { _allocMap(toIndex) }
      const arr = _allocArray(3);  arr[0] = po, arr[1] = ind, arr[2] = rc
      return arr

      function walk(x) {
        if (!_isArray(x) || x[0] === quote) return
        if (inputs && inputs.has(x)) return
        if (toIndex.has(x)) {
          const i = toIndex.get(x)
          if (i === null)
            error('Cycles in computation, at', x)
          return ++rc[i]
        }
        toIndex.set(x, null)
        if (!x.length)
          error('Expected a function with args to apply, got', x, "in", dag)
        if (!reversed || x[0] === last)
          x.forEach(walk)
        else for (let j = x.length; j > 0; --j) walk(x[j-1])
        toIndex.set(x, po.length)

        const indexes = _allocArray(x.length)
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
      const result = _allocArray(0)
      try { _resultCanBe(x);  result.push(..._resultCanBe.seen) }
      finally { _resultCanBe.seen.clear(), _resultCanBe.in = false }
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
    readAt:{
      read:_(`readAt`),
      write:_(`writeAt`),
      observe:_(`observe`),
      arrayObject:_(`arrayObject`),
      merged:_(`merged`),
    },
    interrupt:false,
    keep:true,
    call(...x) { return created(!call.pure ? x : x.map(quote)) },
    purify(...y) { return created(y) },
    adjust:_(`_dout`),
    mergeAdjustment:_(`_mergeTensors`),
    _compileBody(env, assignTo, ...args) {
      // `v = _allocArray(N); v[0]=args[0]; v[1]=args[1]`.
      return `${assignTo} = ${env(_allocArray)}(${args.length})${args.map((a,i) => '; '+assignTo+'['+i+']='+a).join('')}`
    },
    dispose(arr) { arr.forEach(dispose), _allocArray(arr) },
  },
  readAt:{
    docs:`\`readAt Array Index\` or \`Array.Index\`: reads the current value at a position in an array.
(It's actually a relatively-thin wrapper around JS property access.)
This also forms the user-visible hierarchy of globals.`,
    argCount:2,
    dispose:true,
    interrupt:false,
    call(arr, i) {
      if (arr == null) return
      if (call.pure && typeof arr == 'string') return arr[i]
      if (call.pure && call.pure.has(arr)) {
        const v = arr[i]
        // `v` is a program (that quotes values), so we convert it to a value (with _unknown(…) for programs).
        return !_isArray(v) || call.pure.has(v) ? keep(v) : v[0] === quote ? keep(v[1]) : _unknown(v)
      }
      if (impureHave()) return keep(impureLoad())
      return keep(impureSave(arr[i]))
      // readAt.parents: a Map from globals to what namespace they belong to.
    },
    purify(arrP, iP) {
      // When the array is known but the index is not, copy the array so that writes can't interfere.
      //   (But if the array is modified after `purify`, we wouldn't know.)
      if (_isArray(arrP) && arrP[0] !== quote) throw impure
      const arr = !_isArray(arrP) ? arrP : arrP[1]
      if (!_isArray(arr)) throw impure
      return _unknown([readAt, quote(array(...arr)), iP])
    },
    adjust:_(`_arrayReadAdjustment`),
    mergeAdjustment:[
      _(`_mergeArrays`),
      null,
    ],
    Initialize(net) {
      // Mark readAt.parents of globals.
      const backctx = _invertBindingContext(Self.ctx)
      readAt.parents = new Map
      function markParents(x, p, prioritize) {
        if (readAt.parents.has(x) || x === Self)
          return prioritize && x !== p && (readAt.parents.delete(x), readAt.parents.set(x, p))
        if (p !== undefined && x !== p) readAt.parents.set(x, p)
        if (!x || typeof x != 'object' && typeof x != 'function') return
        if (p === undefined && backctx.has(x) && backctx.get(x)[0] === '_') readAt.parents.set(x, System)
        if (x instanceof Map || _isArray(x)) {
          x.forEach(v => markParents(v, p))
        } else if (x && !x[defines.key] && typeof x == 'object') {
          Object.keys(x).forEach(k => markParents(x[k], p, prioritize || +k === _id(readAt)))
        } else if (x && x[defines.key] && !defines(x, deconstruct))
          markParents(x[defines.key], x)
      }
      markParents(net)
      readAt.parents.set(net, Self)
    },
  },
  _arrayReadAdjustment:[
    {
      call(arr, i, dout) {
        const r = array()
        _isArray(arr) && callAdjust.darray.set(arr, r) // Make writes know.
        return r[i] = dout, r
      },
      purify(arrP, iP, doutP) {
        // Known-index reads will know adjustment.
        if (_isArray(iP)) throw impure
        const r = array()
        if (_isArray(arrP) && arrP[0] === quote && _isArray(arrP[1]))
          callAdjust.darray.set(arrP[1], r)
        return r[iP] = doutP, r
      },
      interrupt:false,
    },
    _(`_inA`),
    _(`_inB`),
    _(`_dout`),
  ],
  writeAt:{
    docs:`\`writeAt Array Index Value\`: changes the current value at a position in an array.
If \`Index\` is undefined, re-constructs a construct in-place if possible.`,
    argCount:3,
    interrupt:false,
    purify(arrP, iP, vP) {
      // Allow writing impure computations into created arrays.
      if (_isArray(arrP) && arrP[0] !== quote) throw impure
      if (_isArray(iP) && iP[0] !== quote) throw impure
      const arr = !_isArray(arrP) ? arrP : arrP[1]
      const i = !_isArray(iP) ? iP : iP[1]
      return writeAt(arr, i, vP, true) // vP is definitely unknown here, since `arr` and `i` are known.
    },
    call(arr, i, v, vIsProgramSpace) {
      if (call.pure) {
        if (!call.pure.has(arr)) throw impure
        if (!vIsProgramSpace) {
          if (call.pure.has(v)) throw impure // This prevents cycles, which can't be constructed with `array` calls but can be patched in.
          //   (Though it prevents many other things too.)
          v = i !== undefined ? quote(v) : v.map(quote)
        }
      }
      if (call.env && call.env[_id(impureLoad)] > 0) return
      if (i !== undefined) {
        if (arr[i] === v) return
        dispose(arr[i])
        arr[i] = keep(v)
      } else if (_isArray(arr)) {
        // Replace the contents of the whole array.
        if (!_isArray(v)) error('Expected an array to replace', arr, 'with but got', v)
        v.forEach(keep)
        arr.forEach(dispose)
        arr.length = 0, arr.push(...v)
      } else construct(arr, v)
      if (observe.rs && observe.rs.has(arr)) {
        const b = !observe.changed.size
        observe.changed.add(arr), b && setTimeout(observe.fn, 200)
      }
    },
    adjust:[
      {
        call(x) { return x !== undefined ? keep(x) : 0 },
        dispose:true,
        interrupt:false,
      },
      [
        _(`takeAt`),
        [
          {
            call(arr) { return callAdjust.darray.get(arr) || elemValue.empty },
            interrupt:false,
          },
          _(`_inA`),
        ],
        _(`_inB`),
      ],
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },
  observe:{
    docs:`\`observe Array OnChange\`: remembers to call the function (passing \`Array\`) sometime after the array changes from a \`writeAt\` call.
If \`OnChange\` is not given, returns the current array of \`Array\`'s observers.
Call this again with the same array and function to no longer call it.
Many updates at the same time are merged into one call, scheduled in a separate task.`,
    interrupt:false,
    Initialize() { observe.rs = new WeakMap, observe.changed = new Set, observe.fn = _throttled(_callChangeObservers, .1) },
    call(arr, f, forceTo = undefined) {
      if (!_isArray(arr) && defines(arr, deconstruct) === undefined) return f
      if (Object.isFrozen(arr)) return f
      if (typeof f != 'function') error("Expected a function, got", f)
      if (defines(f, deconstruct)) error("There has been no need for user-defined (interruptible) observers, so we don't support them:", f)
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
      // .rs (a Map from arrays to their observers), .changed (a Set of arrays that changed), .fn (throttled _callChangeObservers).
    },
  },
  _callChangeObservers:{
    docs:`Calls all observers for all changed arrays.`,
    call() {
      if (!observe.changed.size) return
      return new Promise(then => {
        let userTime = 0
        f()
        function f() {
          const start = _timeSince()
          try {
            observe.changed.forEach(arr => {
              const obs = observe.rs.get(arr)
              if (obs) for (let i=0; i < obs.length; ++i) obs[i](arr)
              observe.changed.delete(arr)

              if (_timeSince(start) > 10) { setTimeout(f, 200);  userTime += _timeSince(start);  throw null }
              if (!observe.changed.size) _reflow().then(() => then(userTime + _timeSince(start)))
            })
          } catch (err) { if (err !== null) throw err }
        }
      })
    },
  },
  arrayObject:{
    docs:`\`arrayObject …Items\`: \`construct\`s an actual array.
When the array head is a \`construct\`-defining \`concept\`, this allows still correctly parsing the serialization.`,
    construct(x, obj) {
      if (obj === undefined)
        return _allocArray(0)
      else
        obj.push(...x.slice(1))
    },
  },

  _mergeArrays:{
    docs:`Gathers array adjustments into one array.`,
    interrupt:false,
    call(arrs) {
      const result = array()
      // Merge each item. Go in reverse, to exactly restore the execution's order of accesses.
      let maxLen = 0
      for (let i=0; i < arrs.length; ++i)
        if (_isArray(arrs[i]) && (!call.pure || call.pure.has(arrs[i])))
          maxLen = Math.max(maxLen, arrs[i].length)
      for (let n = maxLen-1; n >= 0; --n) {
        let haveAny = false
        for (let i=0; i < arrs.length; ++i) {
          const arr = arrs[i]
          if (!_isArray(arr) || call.pure && !call.pure.has(arr)) continue
          if (arr.length < n) continue
          haveAny = true
          if (!result[n])
            result[n] = arr
          else if (!_isArray(result[n]) || result[n][0] !== _mergeTensors || !_isArray(result[n][1]) || result[n][1][0] !== array)
            result[n] = [_mergeTensors, [array, result[n], arr]]
          else
            result[n][1].push(arr)
        }
        if (!haveAny) break
      }
      // Merge items that are in multiple adjustment arrays.
      for (let n=0; n < result.length; ++n)
        if (_isArray(result[n]) && result[n][0] === _mergeTensors && _isArray(result[n][1]) && result[n][1][0] === array)
          result[n] = _mergeTensors(result[n][1].slice(1)),
          _isUnknown(result[n]) && (result[n] = result[n][1])
      // If we can't merge everything, record the final result.
      let fin = null
      if (call.pure)
        for (let i=0; i < arrs.length; ++i)
          if (_isArray(arrs[i]) && !call.pure.has(arrs[i]))
            !fin && (fin = array(result)), fin.push(arrs[i])
      return fin ? _unknown([_mergeArrays, fin]) : result
    },
  },

  select:{
    docs:`\`select If Then Else …Args\`: calls \`Then …Arg\` if \`If\` is \`true\`, else \`Else …Args\`.
Inconvenient compared to being able to refer to closed-over variables directly, but simple and Turing-complete.

This is much like the φ function in SSA forms, but explicitly passing arguments to code blocks.`,
    todo:` * ONLY if we absolutely need super-efficient single-threaded control flow, because that's very complicated:
 *   The special \`(select BranchIndex …Branches)\` form.
 *     Make \`_postorderInfo\` also return the \`gotos\` info: usually \`null\`, or an array of indexes of beginnings of branches for \`select\` nodes, or the index to go to after the node has finished executing (the node just before a \`select\` node goes to that node, and the last node in each branch goes to the \`select\` node).
 *     Interpreters (\`call\`/\`purify\`):
 *       have an array of "do we know this" (or just store _onlyUndefined for nodes that return undefined, and check for undefined to detect not-yet-computed results);
 *       follow number-jumps;
 *       for \`select\` nodes (array-jumps), copy its result and advance if the needed branch is computed, else jump to that branch;
 *       if any node has an unknown input, go into the special "dynamic evaluation" mode, and compute that input and all its inputs.
 *     Compilers (\`_compileBody\`):
 *       follow number-jumps (except for each first jump to a \`select\` node) via \`stage = N; continue\` and putting the switch statement into an infinite loop;
 *       for first jumps to \`select\` nodes, jump via setting the \`select\`'s result to ours and \`stage = branchIndexes[i]; continue\`;
 *       for \`select\` nodes (array-jumps), just pass through;
 *       ref-count backwards from \`select\` nodes (not going beyond where branches of the current \`select\`ion begin), and for each node where the global ref-count is more than the branch-local ref-count and all their not-certain-if-computed inputs, make it lazily-computed and dynamically-returning (basically, switch to the "interpretation" mode in compiled code; cannot think of a way that eliminates more lazy-computation).
 *     Reversers (\`autograd\`):
 *       give \`select\`'s gradient to the picked branch's exit (inverting \`gotos\` info);
 *       do some magic to determine when to lazily construct mergers' arrays and when we can guarantee that gradient will be computed (a node is in all branches), I don't know.`,
    _resultCanBe(x) { _resultCanBe(x[2]), _resultCanBe(x[3]) },
    call(If, Then, Else, ...Args) {
      return If === true ? Then(...Args) : Else(...Args)
    },
    purify(IfP, ThenP, ElseP, ...ArgsP) {
      if (_isArray(IfP) && IfP[0] !== quote) throw impure
      return IfP === true ? purify([ThenP, ...ArgsP], true) : purify([ElseP, ...ArgsP], true)
      // If `IfP` was explicitly quoted by `quote`, then it's definitely not `true`.
    },
    _compileBody(env, assignTo, If, Then, Else, ...Args) { return `${assignTo} = ${If} === true ? ${Then}(${Args}) : ${Else}(${Args})` },
    dispose:true,
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
      if (!_isArray(obj)) error("Expected an array but got", obj)
      if (call.pure)
        call.pure.add(obj)
      return obj
    },
  },

  purify:{
    docs:`\`purify ^Expr\`: Partially-evaluates the expression, without inlining or knowledge.
The process is simple: if any of a node's inputs are unknown (or if it does an impure thing like calling \`randomNat\`, or its result \`_isUnknown\`), then the node is unknown (and might be inlined), else it's known (and can be computed with \`call\`).

Every \`defines\` of \`purify\` is a function that accepts programs that produce every arg, and returns a value (or \`(_unknown DAG)\` to return a program). \`call\`s may be called, and may return programs via \`_unknown\` (but don't forget to quote inputs).
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
    philosophy:`The vanity and psychosis of those who hold absolute power are of no use to everyone else. Swat them aside, to make room for coming up with better versions of yourself.
I realized my mistake, and though I lost my vision, I can see the world now.`,
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
    readAt:{
      purifyInWorker:_(`purifyInWorker`),
      created:_(`created`),
    },
    nameResult:[
      `purified`,
      `computation`,
    ],
    call(x, inline = false, inputs, inputPrograms) {
      // `inline`: whether we're inlining a func body (so exceptions will not be swallowed/recorded).
      // `inputs`: the array from values signifying function inputs to their indexes (beginning with 1).
      // `inputPrograms`: an array of input programs (a non-quoted array causes recording), or one program that's repeated for all inputs.
      if (!_isArray(x)) return x
      if (x[0] === quote) return x[1]

      let [i = 0, poIndRc = _postorderInfo(x, inputs), outputs = _allocArray(poIndRc[0].length), same = _allocArray(poIndRc[0].length), unknown = _allocArray(poIndRc[0].length), pure = inline ? null : new Set, darray = _allocMap()] = interrupt(7)
      const [po, inds] = poIndRc
      const collected = _allocArray(8)
      const prevPure = call.pure;  call.pure = pure || call.pure
      const prevDarray = callAdjust.darray;  callAdjust.darray = darray
      try {
        for (; i < po.length; ++i) {
          // Go through all nodes, collect dependencies, execute nodes, and record those that we can't know.
          _checkArgCount(po[i], inputs)
          collected.length = inds[i].length
          let inputsAreSame = true
          for (let j=0; j < collected.length; ++j) {
            const ind = inds[i][j]
            let depUnknown = ind !== null && unknown[ind]
            let depValue = ind !== null ? outputs[ind] : _isArray(po[i][j]) && po[i][j][0] === quote ? po[i][j][1] : po[i][j]
            if (ind !== null && !same[ind]) inputsAreSame = false
            if (inputs && inputs.has(po[i][j]) && inputPrograms === undefined)
              depUnknown = true
            else if (inputs && inputs.has(po[i][j])) {
              const ind = inputs.get(po[i][j])
              const inp = _isArray(inputPrograms) ? inputPrograms[ind-1] : inputPrograms
              depUnknown = _isArray(inp) && inp[0] !== quote && !call.pure.has(inp)
              depValue = !_isArray(inp) || inp[0] !== quote ? inp : inp[1]
              if (inputs.get(inp) !== ind) inputsAreSame = false
            }
            if (depUnknown) {
              if (!unknown[i])
                for (let k=0; k<j; ++k)
                  collected[k] = quote(collected[k])
              unknown[i] = true
            }
            collected[j] = depValue
            if (!depUnknown && unknown[i])
              collected[j] = quote(collected[j])
            if (j === 0 && !depUnknown && typeof collected[0] != 'function')
              error("Expected a function, got", collected[0])
          }

          // Execute:
          try {
            if (unknown[i]) {
              if (typeof collected[0] == 'function' && defines(collected[0], purify))
                outputs[i] = defines(collected[0], purify).call(...collected),
                unknown[i] = undefined
              else
                throw impure
            } else
              outputs[i] = collected[0].call(...collected), same[i] = false
            if (_isUnknown(outputs[i]))
              outputs[i] = outputs[i][1], unknown[i] = true
          } catch (err) {
            if (err === impure) {
              if (inputsAreSame)
                // There is no need to make a different object.
                outputs[i] = po[i], same[i] = true
              else if (unknown[i])
                // We've already quoted every known value in `collected` when we were collecting it.
                outputs[i] = collected.slice()
              else
                outputs[i] = collected.map(quote)
              unknown[i] = true
            }
            else throw err
          }
        }
        // If not inlining and the output was created here, then the output is unknown (because the array contains programs).
        const lastOut = outputs[po.length-1], lastUnk = unknown[po.length-1] || !inline && call.pure.has(lastOut)
        if (pure && lastUnk)
          pure.forEach(lastUnk ? x => {
            // Turn arrays-of-programs into programs of creating arrays.
            !_isArray(x) && error("Non-array `created` values are not supported, but got", x)
            x.unshift(array)
          } : x => {
            // If the output is known, turn programs into values.
            for (let i=0; i < x.length; ++i) if (_isArray(x[i]) && !call.pure.has(x[i]) && x[i][0] === quote) x[i] = x[i][1]
          }),
          pure.clear()
        outputs[po.length-1] = undefined, outputs.forEach(dispose)
        _allocArray(outputs), _allocArray(same), _allocArray(unknown)
        defines(_postorderInfo, dispose)(poIndRc)
        return !lastUnk ? lastOut : _unknown(lastOut)
      } catch (err) {
        if (err === interrupt) interrupt.stack.push(i, poIndRc, outputs, same, unknown, pure, darray)
        if (err === interrupt) throw err
        if (inline) throw err
        return _unknown(_errorRepr(err).map(quote)) // If not inlining, don't throw exceptions, return them.
      } finally { call.pure = prevPure; callAdjust.darray = prevDarray;  _allocArray(collected) }
    },
  },






  _inA:[
    _(`readAt`),
    _(`_ins`),
    0,
  ],

  _inB:[
    _(`readAt`),
    _(`_ins`),
    1,
  ],

  _inC:[
    _(`readAt`),
    _(`_ins`),
    2,
  ],

  add:{
    docs:`Addition of two tensors, as in \`5+6\`=\`11\`.
The adjustment is passed through to each arg.`,
    argCount:2,
    dispose:true,
    interrupt:false,
    call(a,b) { return typeof a == 'number' && typeof b == 'number' ? a+b : _tf(tf.add(a,b)) },
    adjust:[
      _(`array`),
      _(`_dout`),
      _(`_dout`),
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  mul:{
    docs:`Multiplication, as in \`5*6\`=\`30\`.

For more numerical stability, \`adjust\`ment is not the mathematical gradient (output change multiplied by the other arg), but that divided by the result (so, divide output change by the arg).`,
    todo:`See whether our changing of gradient made anything better.`,
    argCount:2,
    dispose:true,
    interrupt:false,
    call(a,b) { return typeof a == 'number' && typeof b == 'number' ? a*b : _tf(tf.mul(a,b)) },
    adjust:[
      _(`array`),
      [
        _(`div`),
        _(`_dout`),
        _(`_inA`),
      ],
      [
        _(`div`),
        _(`_dout`),
        _(`_inB`),
      ],
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  sub:{
    docs:`Subtraction, as in \`5-6\`=\`-1\`.`,
    argCount:2,
    dispose:true,
    interrupt:false,
    call(a,b) { return typeof a == 'number' && typeof b == 'number' ? a-b : a ? _tf(tf.sub(a,b)) : _tf(tf.neg(b)) },
    adjust:[
      _(`array`),
      _(`_dout`),
      [
        _(`sub`),
        0,
        _(`_dout`),
      ],
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  div:{
    docs:`Division, as in \`6/3\`=\`2\``,
    argCount:2,
    dispose:true,
    interrupt:false,
    call(a,b) { return typeof a == 'number' && typeof b == 'number' ? a/b : _tf(tf.div(a,b)) },
    adjust:[
      _(`array`),
      [
        _(`div`),
        _(`_dout`),
        _(`_inB`),
      ],
      [
        _(`mul`),
        _(`_dout`),
        [
          _(`div`),
          [
            _(`div`),
            [
              _(`sub`),
              0,
              _(`_inA`),
            ],
            _(`_inB`),
          ],
          _(`_inB`),
        ],
      ],
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  pow:{
    docs:`Raises the first arg to the power of the second arg.`,
    todo:`See if dividing gradient of both inputs by output (so, not \`mul\`tiplying it by output) makes learning behave better.`,
    argCount:2,
    interrupt:false,
    call(a,b) { return typeof a == 'number' && typeof b == 'number' ? Math.pow(a,b) : _tf(tf.pow(a,b)) },
    adjust:[
      _(`array`),
      [
        _(`mul`),
        _(`_dout`),
        [
          _(`div`),
          [
            _(`mul`),
            _(`_out`),
            _(`_inB`),
          ],
          _(`_inA`),
        ],
      ],
      [
        _(`mul`),
        _(`_dout`),
        [
          _(`mul`),
          _(`_out`),
          [
            _(`log`),
            _(`_inA`),
          ],
        ],
      ],
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  exp:{
    docs:`\`exp:\\pow(2.718281828459045,?)\``,
    argCount:1,
    interrupt:false,
    call(a) { return typeof a == 'number' ? Math.exp(a) : _tf(tf.exp(a)) },
    adjust:[
      _(`array`),
      [
        _(`mul`),
        _(`_dout`),
        _(`_out`),
      ],
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  expm1:{
    docs:`\`expm1:\\exp(?)-1\`
Why: speed`,
    argCount:1,
    interrupt:false,
    call(a) { return typeof a == 'number' ? Math.expm1(a) : _tf(tf.expm1(a)) },
    adjust:[
      _(`array`),
      [
        _(`mul`),
        _(`_dout`),
        [
          _(`add`),
          _(`_out`),
          1,
        ],
      ],
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },
  
  log:{
    docs:`The inverse function to \`exp\`onentiation.
Returns the power that \`e\` (\`2.718281828459045\`… — easy to remember) needs to be raised to in order to get the arg.
To find the answer for a different base, divide the result by \`log\` of that base.`,
    argCount:1,
    interrupt:false,
    call(a) { return typeof a == 'number' ? Math.log(a) : _tf(tf.log(a)) },
    adjust:[
      _(`array`),
      [
        _(`div`),
        _(`_dout`),
        _(`_inA`),
      ],
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  sum:{
    docs:`Sum of values in a tensor, as in \`sum (tensor (1 2 3 4))\`=\`tensor 10()\`.
The adjustment is passed through, to be broadcasted.`,
    argCount:1,
    dispose:true,
    interrupt:false,
    call(a) { return typeof a == 'number' ? a : _tf(tf.sum(a)) },
    adjust:[
      _(`array`),
      _(`_dout`),
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  floor:{
    docs:`Floor.
The adjustment is passed through.`,
    argCount:1,
    dispose:true,
    interrupt:false,
    call(a) { return typeof a == 'number' ? Math.floor(a) : _tf(tf.floor(a)) },
    adjust:[
      _(`array`),
      _(`_dout`),
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  abs:{
    docs:`The absolute of values of a tensor, as in \`sum (tensor (1 -2 3 -4))\`=\`tensor (1 2 3 4)\`.
Is \`where 0<X X 0-X\`.`,
    argCount:1,
    dispose:true,
    interrupt:false,
    call(a) { return typeof a == 'number' ? Math.abs(a) : _tf(tf.abs(a)) },
    adjust:[
      _(`array`),
      [
        _(`where`),
        [
          _(`less`),
          0,
          _(`_inA`),
        ],
        _(`_dout`),
        [
          _(`sub`),
          0,
          _(`_dout`),
        ],
      ],
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  sign:{
    docs:`The sign of values in a tensor, as in \`sign (tensor (0 1 -2 3 -4))\`=\`tensor (0 1 -1 1 -1)\`.`,
    argCount:1,
    dispose:true,
    interrupt:false,
    call(a) { return typeof a == 'number' ? Math.sign(a)||0 : _tf(tf.sign(a)) },
  },

  clip:{
    docs:`Clips each value in a tensor between two static values (by default, between \`-2\` and \`2\`).
Is \`where a<Min Min (where a<Max a Max)\`.
Adjustment will try hard to make values fit too.`,
    interrupt:false,
    call(a, Min=-2, Max=2) { return typeof a == 'number' ? Math.min(Math.max(Min, a), Max) : _tf(tf.clipByValue(a, Min, Max)) },
    adjust:[
      _(`array`),
      [
        _(`where`),
        [
          _(`less`),
          _(`_inA`),
          _(`_inB`),
        ],
        _(`_inB`),
        [
          _(`where`),
          [
            _(`less`),
            _(`_inA`),
            _(`_inC`),
          ],
          _(`_dout`),
          _(`_inC`),
        ],
      ],
    ],
    mergeAdjustment:[
      _(`_mergeTensors`),
      null,
      null,
    ],
  },

  argmax:{
    docs:`The index of the \`max\` value in a tensor, as in \`argmax(tensor (0 1 -2 3 -4))\`=\`tensor 3 arrayObject() i32\`.
Use \`sync\` to get the result as a non-tensor.`,
    argCount:1,
    dispose:true,
    interrupt:false,
    call(a) { return typeof a == 'number' ? 0 : _tf(tf.argMax(a)) },
  },

  ReshapingOps:{
    readAt:{
      sync:_(`sync`),
      split:_(`split`),
      concat:_(`concat`),
      stack:_(`stack`),
      unstack:_(`unstack`),
    },
  },

  sync:{
    docs:`Synchronously downloads a value from GPU to CPU.
Ensures that a tensor is available as a JS value, like \`sync tensor(10()())\`=\`10\`.`,
    argCount:1,
    interrupt:false,
    call(a) { return !_isDisposable(a) ? a : a.size === 1 && a.shape.length ? a.dataSync()[0] : a.dataSync() },
  },

  split:{
    docs:`\`split Tensor SizesArray\`→\`TensorArray\`: Splits off tensors.
Reverse of \`concat\`.`,
    examples:[
      `split tensor((1 2 2 3 3 4)) ^(2 2 2)`,
      `(tensor (1 2)) (tensor (2 3)) (tensor (3 4))`,
    ],
    argCount:2,
    dispose:true,
    interrupt:false,
    call(a, sz) { return _tf(tf.split(a, sz)) },
    adjust:[
      _(`array`),
      [
        _(`concat`),
        _(`_dout`),
      ],
    ],
    mergeAdjustment:[
      _(`_mergeArrays`),
      null,
    ],
  },

  concat:{
    docs:`\`concat TensorArray SizesArray\`→\`Tensor\`: Concatenates tensors.
Reverse of \`split\`.
\`SizesArray\` is necessary for adjustment, optional otherwise.`,
    examples:[
      `concat array(tensor (1 2),tensor (2 3),tensor (3 4))`,
      `tensor (1 2 2 3 3 4)`,
    ],
    dispose:true,
    interrupt:false,
    call(a, sz) { return _tf(tf.concat(a)) },
    adjust:[
      _(`split`),
      _(`_dout`),
      _(`_inB`),
    ],
    mergeAdjustment:[
      _(`_mergeArrays`),
      null,
    ],
  },

  stack:{
    docs:`\`stack TensorArray\`→\`Tensor\`: stacks equally-shaped tensors into a new outer dimension.

If \`Numeric\` code does not call \`select\` or \`sync\`, and we want to repeat it for different inputs, then using \`stack\` (followed by code then \`unstack\`) should not change the results, but it will make code faster by using GPU to parallelize instead of the CPU. Even if some inputs are the same and non-stacked and others are stacked, this should work.`,
    type:[
      'Tensor',
      'Array',
    ],
    examples:[
      `stack array(tensor (1 2),tensor (2 3),tensor (3 4))`,
      `tensor ((1 2) (2 3) (3 4))`,
    ],
    dispose:true,
    interrupt:false,
    argCount:1,
    call(a) { return _tf(tf.stack(a)) },
    adjust:[
      _(`unstack`),
      _(`_dout`),
    ],
    mergeAdjustment:_(`_mergeArrays`),
  },

  unstack:{
    docs:`\`unstack Tensor\`→\`TensorArray\`: unstacks the outer dimension into an array.
Reverse of \`stack\`.`,
    type:[
      'Array',
      'Tensor',
    ],
    examples:[
      `unstack (tensor ((1 2) (2 3) (3 4)))`,
      `(tensor (1 2)) (tensor (2 3)) (tensor (3 4))`,
    ],
    dispose:_(`_disposeEachAndDealloc`),
    interrupt:false,
    argCount:1,
    call(a) { return _tf(tf.unstack(a)) },
    adjust:[
      _(`stack`),
      _(`_dout`),
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  max:{
    docs:`Max of values in a tensor.`,
    argCount:1,
    dispose:true,
    interrupt:false,
    call(a) { return typeof a == 'number' ? a : _tf(tf.max(a)) },
    adjust:[
      _(`array`),
      [
        _(`where`),
        [
          _(`less`),
          _(`_inA`),
          _(`_out`),
        ],
        0,
        _(`_dout`),
      ],
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  norm:{
    docs:`\`norm Tensor Order\`: The norm of N-th order of values in a tensor.
\`Order\`=\`1\` (the default) sums absolute values (\`sum(abs(Tensor))\`), like \`norm (tensor (1 -2 3 -4))\`=\`tensor 10()\`.
Other \`Order\`s are computed as \`pow(sum(pow(abs(),Order)),1/Order)\`.
No adjustment because of laziness.`,
    dispose:true,
    interrupt:false,
    call(a, order=1) { return typeof a == 'number' ? a : _tf(tf.norm(a, order)) },
  },

  matMul:{
    docs:`Matrix multiplication of \`A\` by \`B\`.
Like a cross-sectional dot product: each element of the output is the sum of every element in a row in \`A\` by its corresponding element in a column in \`B\`. (So, if input shapes are N×M and M×K, then output is shaped as N×K.)
Can also handle "\`A\` is a vector" (the operation is then called a non-batched dense layer; resulting in a vector) and "\`A\` or \`B\` is a number" cases, by padding the missing outer dimensions with \`1\` then un-padding.`,
    argCount:2,
    dispose:true,
    interrupt:false,
    call(a,b) { return _matMul(a,b) },
    adjust:[
      _(`array`),
      [
        _(`_matMul`),
        _(`_dout`),
        _(`_inB`),
        false,
        true,
      ],
      [
        _(`_matMul`),
        _(`_inA`),
        _(`_dout`),
        true,
        false,
      ],
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  _matMul:{
    docs:`An interface to tf.matMul, but it can reshape args to accept JS numbers in both args, and row vectors in first arg.`,
    dispose:true,
    interrupt:false,
    call(a,b, tA, tB) {
      let result
      if (a === 0 || b === 0) return 0
      // Not robust to the transposeA/transposeB parameters.
      if (_isDisposable(a)) {
        if (_isDisposable(b)) {
          let db = false
          if (b.shape.length < 2) db=true, b = tf.reshape(b, [1, b.shape[0]])
          if (a.shape.length >= 2)
            result = _tf(tf.matMul(a, b, tA, tB))
          else {
            a = tf.reshape(a, [1, a.shape[0]])
            const r = tf.matMul(a, b, tA, tB);  dispose(a)
            tA ? (result = _tf(r)) : (result = _tf(tf.reshape(r, [!tB ? b.shape[1] : b.shape[0]])),  dispose(r))
          }
          if (db) dispose(b)
        } else {
          if (typeof b != 'number') error("Expected a number or a tensor, got", [matMul, a, b])
          b = tf.broadcastTo(b, [a.shape[1], 1])
          const r = tf.matMul(a, b, tA, tB);  dispose(b)
          result = _tf(tf.reshape(r, [a.shape[0]]));  dispose(r)
        }
      } else {
        if (typeof a != 'number') errorStack("Expected a number or a tensor, got", [matMul, a, b])
        if (!_isDisposable(b)) return a*b
        a = tf.broadcastTo(a, [1, b.shape[0]])
        const r = tf.matMul(a, b, tA, tB);  dispose(a)
        result = _tf(tf.reshape(r, [b.shape[1]]));  dispose(r)
      }
      return result
    },
  },

  _disposableCount:{
    docs:`A metric for the count of live \`_isDisposable\` objects in the system. All of them need to be \`dispose\`d of.`,
    call() { return typeof tf == ''+void 0 ? 0 : tf.engine().state.numTensors },
  },

  _willDispose:{
    docs:`If the first arg that's \`_isDisposable\` is not disposed, the second arg will be reported to the user.`,
    call(x, info) {
      // If `_debugMemory` is checked, store the info, to be displayed if a tensor is not disposed of.
      //   (Finalizers won't have a chance to dispose anything, so there's no need for WeakRefs.)
      //   (If `x` is kept, then it's probably a static constant that's passed through.)
      return _isDisposable(x) && !dispose.keep.has(x) && _willDispose.disposable && _willDispose.disposable.set(x, info), x
    },
  },

  _debugMemory:[
    _(`settings`),
    false,
    `Whether to make \`_compileBody\` track every created value to make sure that it's disposed of, when we're finished.`,
  ],

  _debugInterrupt:[
    _(`settings`),
    false,
    `Whether \`_compileBody\` should assert that no interrupt occurs in no-interrupt places.`,
  ],

  _checkMemoryIntegrity:{
    docs:`If we still have any unfreed tensors that are not visible, this reports the DAG nodes that created them and them.
If no env is passed in, this returns the count of tensors in the passed-in result (so that we can count tensors and check that no non-returned tensors are left).`,
    call(result, env) {
      if (!_checkMemoryIntegrity.seen) _checkMemoryIntegrity.seen = new Set
      if (!_willDispose.disposable) return
      const seen = _checkMemoryIntegrity.seen
      try {
        walk(result)
        if (!env) return seen.size
        env[_id(commit)] && env[_id(commit)].forEach(walk)
        const r = _allocArray(0)
        _willDispose.disposable.forEach((info, dis) => {
          if (!seen.has(dis)) r.push([_extracted, info, dis])
        })
        _willDispose.disposable.clear()
        if (r.length)
          error("Got", result, "but forgot to free:", ...r)
        _allocArray(r)
      } finally { seen.clear() }

      function walk(x) {
        _isDisposable(x) && _checkMemoryIntegrity.seen.add(x)
        if (!_isArray(x)) return
        if (_checkMemoryIntegrity.seen.has(x)) return
        _checkMemoryIntegrity.seen.add(x)
        x.forEach(walk)
      }
    },
  },

  _isDisposable(x) { return typeof tf != ''+void 0 && x instanceof tf.Tensor },

  dispose:{
    docs:`A low-level function for statically disposing a resource (with no references to other resources; currently only tensors).
A function \`defines\` this to be \`true\` to make execution \`dispose\` its result, or a function to make compilation call that when the result is no longer needed, or an index to copy the definition from the input at that index.

Memory management rewards only very clear thinking: everything that was created must be disposed exactly once, and each \`keep\` must have its \`dispose\`.`,
    readAt:{
      _debugMemory:_(`_debugMemory`),
      keep:_(`keep`),
      takeAt:_(`takeAt`),
    },
    Initialize() { dispose.keep = new WeakMap },
    elemValue:_(`_isDisposable`),
    call(x) {
      if (_isDisposable(x))
        _tf.all && !dispose.keep.has(x) && _tf.all.delete(x),
        _willDispose.disposable && !dispose.keep.has(x) && _willDispose.disposable.delete(x),
        !dispose.keep.has(x) ? x.dispose() : dispose.keep.get(x) > 1 ? dispose.keep.set(x, dispose.keep.get(x) - 1) : dispose.keep.delete(x)
    },
  },

  keep:{
    docs:`\`keep Object\`: prevents the disposal of \`Object\`, once. The caller takes complete responsibility for disposal.

Define this with the index to make compilation not dispose that input (or with \`true\` to not dispose any inputs). This is a promise for the function to dispose that input/s, whether in its \`call\` or \`dispose\`.

Proper dynamic disposal requires a perfect method of disposing those preserved objects (either garbage collection, or adding reference-counting to all functions that mutate state, which only needs to cover a few functions to cover 99% behavior, and is extremely challenging to cover 100% of behavior with, since we didn't grow on top of reference-counting). We currently do garbage-collection, but only if the result is output to browser UI.`,
    interrupt:false,
    argCount:1,
    call(x) {
      if (_isDisposable(x))
        !dispose.keep.has(x) ? dispose.keep.set(x, 1) : dispose.keep.set(x, dispose.keep.get(x) + 1)
      return x
    },
  },

  takeAt:{
    docs:`Exactly like \`readAt\`, but takes responsibility for \`dispose\`ing the read resource.`,
    interrupt:false,
    dispose:true,
    argCount:2,
    call(a, i) { const r = readAt(a, i);  a[i] = undefined, dispose(r);  return r },
    adjust:_(`_arrayReadAdjustment`),
    mergeAdjustment:[
      _(`_mergeArrays`),
      null,
    ],
  },

  _rememberToDispose:{
    docs:`When the graph is finalized, this remembers to clear all resources that it holds. Seems to not be 100% reliable, not to mention slow to dispose?
Used when a job returns a value, when it's very unlikely that parts of the returned graph will be used except for possible displaying.`,
    Initialize() {
      _rememberToDispose.seen = new WeakSet
      if (typeof FinalizationRegistry != ''+void 0) {
        _rememberToDispose.res = new WeakMap
        _rememberToDispose.reg = new FinalizationRegistry(resources => {
          // console.log('disposing', ...resources) // #######################
          resources.forEach(dispose), resources.length = 0, _rememberToDispose.res.delete(resources)
        })
      }
    },
    call(x) {
      if (!_rememberToDispose.reg) return
      if (!x || typeof x != 'object' && typeof x != 'function') return
      if (_rememberToDispose.seen.has(x)) return
      if (!_isArray(x) && !(x instanceof Map) && !(defines.key in x)) return
      _rememberToDispose.seen.add(x)
      if (_isArray(x)) _rememberArrayItems(x)
      else if (x instanceof Map) x.forEach(_rememberToDispose)
      else Object.values(x[defines.key]).forEach(_rememberToDispose)
    },
  },

  _rememberArrayItems(x) {
    // This does the actual remember-to-dispose.
    x.forEach(_rememberToDispose)
    let res
    if (_rememberToDispose.res.has(x)) {
      res = _rememberToDispose.res.get(x)
      res.length = 0
      _rememberToDispose.reg.unregister(res)
      observe(x, _rememberArrayItems, false)
    } else res = _allocArray(0)
    for (let i=0; i < x.length; ++i)
      if (_isDisposable(x[i])) _disposableCount.allowed !== undefined && ++_disposableCount.allowed, res.push(x[i])
    if (res.length) {
      _rememberToDispose.res.set(x, res)
      _rememberToDispose.reg.register(x, res, res)
      observe(x, _rememberArrayItems, true)
    } else
      _allocArray(res)
  },

  mergeAdjustment:{
    docs:`Defines how to merge adjustments returned from \`adjust\`ing many dependents, to produce local output change in \`autograd\`.
For each input that a DAG node is, this must be defined the same.
Any function that \`defines\` \`adjust\` must also define this, with a function that takes an array of input changes and returns output change (called at compile-time, with programs as array items), or with an array of such functions (if they need to be input-specific).`,
  },

  _mergeTensors:{
    docs:`Average tensors. While not the math-approved gradient computation (which is to sum them), this may perform more uniformly in convoluted generated programs.`,
    interrupt:false,
    call(arr) {
      if (!call.pure) {
        const s = tf.addN(arr)
        const mean = div(s, arr.length); dispose(s)
        return mean
      }
      // Create a sub-program to add up and divide by length.
      if (!call.pure) error("Cannot be called directly, is a part of", autograd)
      if (arr.length == 1) return _isArray(arr[0]) ? _unknown(arr[0]) : arr[0]
      let i = 0
      const sum = arr.reduce((a,b) => ++i & 1 ? [add, a, b] : [add, a[1], [add, a[2], b]])
      return _unknown([div, sum, arr.length])
    },
  },

  autograd:{
    docs:`The result reverses execution, computing changes of inputs given change of output.
With basic functions that define \`adjust\` correctly, this can be used to automatically implement gradient descent (hence the name \`autograd\`).

More precisely.
A function that, given linearization of a function's DAG, purifies and returns the expression that computes input change (\`dins\`) given an array of inputs, output, and output change (\`(arrayObject ins out dout)\`).
(Cannot handle putting an input as a function.)`,
    todo:`Make known-adjustment parts of the resulting program execute as soon as possible, by separating out the parts of \`b\` that don't depend on adjustment's \`input\` (have a special value for that), and executing them right before the return of the call, and giving results of nodes-that-don't-depend to nodes-that-do-and-use-independents by \`adjustSave\`ing the array of them.`,
    argCount:1,
    call(poIndRc, inputs) {
      // Example usage in `fancy`: `autograd (_postorderInfo ^(matMul ? 2+3))`.
      if (!_isArray(poIndRc) || poIndRc.length != 3)
        error("Expected result of applying", _postorderInfo, "but got", poIndRc)
      const [po, inds, rc] = poIndRc
      let [save, loaded, dins = _allocArray(po.length), douts = _allocArray(po.length), inputAdj, program] = interrupt(6)
      try {
        if (!save) {
          save = _getSavedNodes(po, inds) || _allocArray(0)
          for (let i=0; i < po.length; ++i) {
            const x = po[i], ins = inds[i]
            if (inputs && inputs.has(x[0])) error('Calling/adjusting dynamic functions is forbidden but got', x)
            if (typeof x[0] != 'function' || _isArray(x[0]) || defines(x[0], adjust) === undefined || defines(x[0], mergeAdjustment) === undefined)
              continue
            // Pre-create arrays, so that dependents can fill merging.
            douts[i] = i === po.length-1 ? _dout : [undefined, [array]]
          }

          // Fill out the nodes to read from the `adjustLoad()` array that owns outputs of some nodes, not just `true` in `save`.
          loaded = [adjustLoad, save.filter(x => x).length]
          for (let i=0, n=0; i < po.length; ++i)
            if (save[i])
              save[i] = [takeAt, loaded, n++]
        }

        // Go through the post-order in reverse (to reverse computation perfectly), and purify adjustment for each node.
        if (!inputAdj) {
          inputAdj = _allocMap()
          if (inputs) for (let k of inputs.keys()) inputAdj.set(k, [undefined, [array]])
          for (let i = po.length-1; i>=0; --i) {
            // Fill in programs for `ins`, `out`, `dout`.
            //   (This loop cannot interrupt.)
            const x = po[i]
            if (typeof x[0] != 'function' || defines(x[0], adjust) === undefined || defines(x[0], mergeAdjustment) === undefined)
              continue
            if (x.length !== inds[i].length) error("A DAG and its linearization have drifted apart")
            const out = save[i]
            const ins = _allocArray(x.length);  ins[0] = array
            for (let j=1; j < x.length; ++j)
              if (inputs && inputs.has(x[j]))
                ins[j] = [readAt, _ins, inputs.get(x[j])-1]
              else if (save[inds[i][j]] !== undefined)
                ins[j] = save[inds[i][j]]
              else if (!_isArray(x[j]) || x[j][0] === quote)
                ins[j] = x[j]
              else
                ins[j] = undefined

            const adj = defines(x[0], adjust)
            const changeLength = _isArray(adj) && adj[0] === array ? adj.length : x.length

            _bindInput[1] = ins, _bindInput[2] = out, _bindInput[3] = _isArray(douts[i]) && douts[i][0] ? douts[i] : undefined
            dins[i] = bound(_bindInput, adj, false)
            // …`ins` is never de-allocated, even if unused. Would need a flag in `_bindInput` for that.

            // Distribute change, `dins`, to inputs of adjustment, `dout` (via readAt(dins[i], index)).
            //   (In reverse order, so that mergers could always restore the original execution order if they wanted to.)
            const mergers = defines(x[0], mergeAdjustment)
            if (mergers)
              for (let j = changeLength-1; j >= 1; --j) {
                const mrgNode = inds[i][j] !== null ? douts[inds[i][j]] : inputAdj.get(x[j])
                if (mrgNode) {
                  // Fill out merger and add a source to its input.
                  //   Array mergers are input-specific; non-array mergers apply to all inputs.
                  // In `array X Y`, undefined inputs won't be adjusted.
                  if (_isArray(dins[i]) && dins[i][0] === array && !dins[i][j]) continue
                  const m = _isArray(mergers) ? mergers[j-1] : mergers
                  if (mrgNode[0] === undefined)
                    mrgNode[0] = m
                  else if (mrgNode[0] !== m)
                    error("Mergers of the same value should be the same, but got", mrgNode[0], "and", m, "at node", po[i])
                  mrgNode[1].push(_isArray(dins[i]) && dins[i][0] === array ? dins[i][j] : [readAt, dins[i], j-1])
                }
              }
          }
          _bindInput[1] = _bindInput[2] = _bindInput[3] = undefined
          const dinputs = [...inputAdj.values()].map(a => a[0] !== undefined ? a : undefined)
          dinputs.unshift(array)
          // Don't forget to preserve nodes that do not depend on inputs but still need adjustment (`defines(x, adjustLater)` is `true`).
          program = [last, ...dins.filter((x,i) => defines(po[i], adjustLater)).reverse(), dinputs]
          if (program.length == 2 && !program[1]) return null
          if (program.length == 2) program = program[1]
        }
        let b = purify(program, false, adjust.inputs)
        if (_isArray(b)) // From value-space of output of `purify`, to program-space.
          b = b[0] === _unknown ? b[1] : quote(b)
        // This `last` makes sure that exceptions won't cause partial disposal of saved state.
        const thoseSaved = save.filter(x => x)
        _allocArray(save), _allocArray(dins), _allocArray(douts)
        _allocMap(inputAdj)
        return thoseSaved.length ? [last, ...thoseSaved, b, [_allocArray, loaded], b] : b
      } catch (err) { if (err === interrupt) interrupt.stack.push(save, loaded, dins, douts, inputAdj, program);  throw err }
    },
  },

  _bindInput(x) {
    return adjust.inputs.has(x) ? _bindInput[adjust.inputs.get(x)] : _isArray(x) && x[0] === quote ? x : undefined
  },

  _ins:{
    docs:`For adjustment. The array of actual function inputs.`,
  },

  _out:{
    docs:`For adjustment. The actual function output.`,
  },

  _dout:{
    docs:`The change of output that adjustment needs to try and subtract from output.`,
  },

  fetchURL:{
    docs:`\`fetchURL URL\`: requests the resource at URL and returns a promise (use \`await\` to turn it into the result).`,
    Initialize() { fetch.opt = {mode:'cors'} },
    call(URL) {
      if (impureHave()) return impureLoad()
      return impureSave(fetch(URL, fetchURL.opt))
    },
  },

  display:{
    docs:`\`display Label Value\`: displays a plot of all \`Value\`s at a \`Label\`. \`display Label\`: clears the display at a \`Label\`.
Browser-only.
The plot can display the exact values at cursor, and be zoomed in by a dragged click (and zoomed out by a quick click).

(There was a need to display losses during training. A day after, this appeared.)`,
    examples:[
      [
        `(display hi 6),(display hi 7),(display hi 6.4),(display hi 1),(display hi 2.1),(display hi 3)`,
      ],
      [
        `repeat ^(display 'hu' (randomNat 10)) 100000`,
      ],
    ],
    interrupt:false,
    Initialize() {
      display.sizes = {top: 10, right: 20, bottom: 20, left: 90, width: 450, height: 150}
    },
    call(lbl, vle) {
      if (typeof document == ''+void 0) return
      if (vle === undefined) {
        // Remove the row.
        let L = call.env[_id(print)]
        if (!(L instanceof Map)) return
        if (!L.has(lbl)) return
        elemRemove(L.get(lbl).parentNode, true, true, false)
        L.delete(lbl)
      } else if (typeof vle == 'number' || vle === null) {
        let L = call.env[_id(print)]
        if (!(L instanceof Map)) {
          L = new Map([[print, L]])
          const tbl = elemValue(elem('table'), display)
          L.set(display, tbl)
          call.env[_id(print)] = L
          print(tbl)
        }
        if (!_updatePlots.rows) _updatePlots.rows = new Set, _updatePlots.fn = _throttled(_updatePlots, .1)
        if (!L.has(lbl)) {
          // Create a table row with the label and the plot.
          const data = vle !== null ? [vle] : []
          const row = elem('tr', [elem('td', serialize(lbl, _langAt(), _bindingsAt(), serialize.displayed)), elem('td')])

          const dv = elem('div')
          const svg = d3.create('svg')
          const num = elem('number')
          dv.append(svg.node(), num)

          row.lastChild.append(dv)

          if (typeof ResizeObserver != ''+void 0)
            (function(L, lbl, dv) {
              new ResizeObserver(entries => {
                L.has(lbl) && L.get(lbl).to.length > 1 && _updatePlotLater(L.get(lbl))
              }).observe(dv)
            })(L, lbl, dv)

          L.set(lbl, elemValue(row.lastChild, data))
          const pre = _smoothHeightPre(L.get(display))
          elemInsert(L.get(display), row)
          _reflow().then(() => _smoothHeightPost(L.get(display), pre))
        } else if (vle !== null)
          L.get(lbl).to.push(vle)

        _updatePlotLater(L.get(lbl))
      } else
        error("Expected undefined or null or a number, got", vle)
    },
  },

  _updatePlotLater(row) {
    !_updatePlots.rows.size && setTimeout(_updatePlots.fn, 200)
    _updatePlots.rows.add(row)
  },

  _updatePlots() {
    // Performs scheduled updates of plots.
    _updatePlots.rows.forEach(update)
    return new Promise(then => setTimeout(then, 0))

    function update(row) {
      _updatePlots.rows.delete(row)
      if (typeof ResizeObserver != ''+void 0)
        row.lastChild.classList.toggle('resizable', row.to.length > 1)
      const hadText = row.lastChild.lastChild.textContent
      if (row.to.length > 1) {
        if (hadText)
          row.lastChild.lastChild.textContent = '',
          row.lastChild.firstChild.style.removeProperty('display')
        _updatePlot(d3.select(row.lastChild.firstChild), hadText ? display.sizes : sizeOf(row.lastChild), row.to)
      } else
        row.lastChild.lastChild.textContent = row.to.length ? ''+row.to[0] : '<Nothing>',
        row.lastChild.firstChild.style.display = 'none'
    }
    function sizeOf(el) {
      if (el && el.offsetWidth && el.offsetWidth > 150) {
        const left = 90, bottom = 20
        return {top: 20, right: 20, bottom, left, width: el.offsetWidth - left - 20, height: el.offsetHeight - bottom - 20}
      }
      if (el && el.offsetWidth)
        return {top: 0, right: 0, bottom: 10, left: 20, width: el.offsetWidth - 20, height: el.offsetHeight - 10}
      return display.sizes
    }
    // .rows (a Set), .fn (a `_throttled` mirror of this function)
  },

  _updatePlot(svg, sizes, data, begin, end) {
    if (!_isArray(data)) error("Expected an array, got", data)
    const el = svg.node()
    let transition = false
    if (begin === undefined)
      begin = el._begin !== undefined ? el._begin : 0
    else transition = true
    if (end === undefined)
      end = el._end !== undefined && el._end !== el._data.length ? el._end : data.length
    else transition = true

    svg
      .attr("width", sizes.width + sizes.left + sizes.right - .5) // (Firefox/Chromium agree only with this -.5.)
      .attr("height", sizes.height + sizes.top + sizes.bottom)
    let xAxis, yAxis, plot
    if (!el.firstChild) {
      // If empty, create children, and attach events.
      xAxis = svg.append('g'), yAxis = svg.append('g'), plot = svg.append('path')

      // Also show the exact value at cursor.
      const focus = svg.append('g').append('circle').style('opacity', 0).style('fill', 'none').attr('stroke', 'currentColor').attr('r', 8.5)
      const text = svg.append('g').append('text').style('opacity', 0).style('fill', 'currentColor').attr("text-anchor", "middle")
      const zoom = svg.append('g').append('rect').style('fill', 'rgba(30,50,200,.3)').attr('y', 0).attr('height', '100%')
      let zoomBegin = null
      function mouseMove(evt) {
        let [cx,cy] = d3.pointer(evt, this)
        let i = Math.max(0, Math.min(Math.round(this._x.invert(cx)-1), this._data.length-1)), data = this._data
        if (i < 0 || i >= this._data.length)
          focus.style('opacity', 0), text.style('opacity', 0)
        else
          focus.style('opacity', 1), text.style('opacity', 1),
          focus.attr('cx', this._x(i+1)).attr('cy', this._y(data[i])),
          text.text('At '+(i+1)+', the value is\n'+data[i]).style('transform', `translate(${this._x(i+1)}px, ${this._y(data[i])-28}px)`)

        // Also display the rectangle of the future zoom.
        if (zoomBegin !== null) {
          let l = this._x(zoomBegin+1), r = this._x(i+1)
          if (zoomBegin === i) l = this._x(1), r = this._x(data.length)
          if (i >= 0 && i < this._data.length)
            zoom.style('opacity', 1),
            l<r ? zoom.attr('x', l).attr('width', r-l) : zoom.attr('x', r).attr('width', l-r)
          else zoom.style('opacity', 0)
        } else zoom.style('opacity', 0)
      }
      svg.on('mousemove', mouseMove)
        .on('mouseover', mouseMove)
        .on('mouseout',  () => { focus.style('opacity', 0), text.style('opacity', 0), zoom.style('opacity', 0) })

      // Also allow zooming in by a dragged click (and zooming out, by a quick click).
      svg.on('mousedown', function(evt) {
        let [cx,cy] = d3.pointer(evt, this)
        const i = Math.max(0, Math.min(Math.round(this._x.invert(cx)-1), this._data.length-1))
        if (i >= 0 && i < this._data.length) zoomBegin = i
        evt.preventDefault()
        mouseMove.call(this, evt)
      }).on('mouseup', function(evt) {
        if (zoomBegin === null) return
        let [cx,cy] = d3.pointer(evt, this)
        const i = Math.max(0, Math.min(Math.round(this._x.invert(cx)-1), this._data.length-1)), data = this._data, sizes = this._sizes
        if (i >= 0 && i < this._data.length) {
          if (zoomBegin === i) _updatePlot(d3.select(this), sizes, data, 0, data.length)
          else if (zoomBegin > i) _updatePlot(d3.select(this), sizes, data, i, zoomBegin+1)
          else if (zoomBegin < i) _updatePlot(d3.select(this), sizes, data, zoomBegin, i+1)
        }
        zoomBegin = null, zoom.style('opacity', 0)
        mouseMove.call(this, evt)
      })

    } else
      [xAxis, yAxis, plot] = el.childNodes, xAxis = d3.select(xAxis), yAxis = d3.select(yAxis), plot = d3.select(plot)
    // X axis.
    const x = (el._x || (el._x = d3.scaleLinear()))
      .range([sizes.left, sizes.left + sizes.width - sizes.right])
      .domain([begin+1, end])
    ;(_disableSmoothTransitions[1] || !transition ? xAxis : xAxis.transition(200))
      .attr("transform", `translate(0,${sizes.top + sizes.height - sizes.bottom})`)
      .call(d3.axisBottom(x).ticks(Math.min(end - begin - 1, sizes.width / 80)).tickSizeOuter(0))

    // Y axis.
    let Min = data[begin], Max = data[begin]
    for (let i = begin+1; i < end; ++i)
      data[i] < Min ? (Min = data[i]) : (data[i] > Max && (Max = data[i]))
    const extra = Math.abs(Max-Min)*.2
    Min = (Min-extra<0) === (Min<0) ? Min-extra : 0, Max = (Max+extra<0) === (Max<0) ? Max+extra : 0
    const y = (el._y || (el._y = d3.scaleLinear()))
      .range([sizes.top + sizes.height - sizes.bottom, sizes.top])
      .domain([Min, Max]).nice()
    ;(_disableSmoothTransitions[1] || !transition ? yAxis : yAxis.transition(200))
      .attr("transform", `translate(${sizes.left},0)`)
      .call(d3.axisLeft(y).ticks(sizes.height / 40).tickSizeOuter(0))

    const step = Math.max(1, ((end - begin) / sizes.width) | 0)
    el._x = x, el._y = y, el._data = data, el._sizes = sizes, el._begin = begin, el._end = end === data.length ? undefined : end, el._step = step

    let view
    const begin2 = Math.max(0, begin - 100)
    if (begin2 || end < data.length-100 || step > 1 || Min < -1e4 || Max > 1e4) {
      // Skip items, trim offscreen points.
      view = []
      for (let i=0; begin2 + i*step < end+step-1; ++i)
        view[i] = data[begin2 + i*step]
    } else view = data

    // Plot.
    if (!plot.attr('fill'))
      plot.attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
    plot.datum(view)
    ;(_disableSmoothTransitions[1] || !transition ? plot : plot.transition(200))
      .attr("d", d3.line().x((d,i) => x(begin2 + i*step+1)).y(y))
  },

  callAdjust:{
    docs:`\`callAdjust ^Expr\`: executes \`Expr\` then \`adjust\`s it.
This is the default interpreter, so there's no need to call it in user code.
(This also checks memory integrity for things that need it. And \`commit\`s changes.)

Every number in an execution can potentially be predicted before it's actually computed. Going back to adjust an execution allows improving predictions.`,
    tutorial:[
      `One of the most basic primitives of intelligence is prediction: trying to see the future by adjusting a part of the past to be more like a part of the future that arrived. Both compositional and embeddable, very nice.

In Conceptual, we replaced the interpreter with this execute+adjust function, so that all execution can predict things.
But it's not the most trivial thing to implement first-try (that would probably be \`1+1\`, or maybe \`1\`).
So. Friend of trees, emissary of nature. Are you up for some maintenance, together?
We'll observe behavior and by doing so, collapse it into a bugless state.
Just a few simple examples, to make sure that it's working.

And while we're at it, we'll try out a new syntax: \`fancier\` (which allows the "function call, then the comma-separated argument list in brackets" syntax). Today's a day of many firsts (that aren't actually firsts).

But first, let's take a quick look at the macro that we'll use as the predictor:`,
      [
        _(`fancier`),
        `^randomVar()`,
        function(r) { return true },
      ],
      `(Hint: \`^x\` quotes \`x\`, so that it is not evaluated and is given to evaluation as-is. Generally, hovering over an operator should always show the function responsible for it.)

It might be hard to read (where moving the cursor to aid with visual parsing of complex graphs is essential). \`fancier\` might be more convenient to write, but it is still inferior to \`fancy\` in array-heavy situations (there, each array is, unambiguously except at top-level, a bracketed space-separated list like \`(A B C C:D)\` — unlike in \`fancier\`, where they may look like function calls).

A \`variable\` that is given an array of the tensor (the current value) and some zeroes, and some hyper-parameterization.
To adjust, it uses SGD with Nesterov momentum. It uses Glorot initialization.
Not the most original situation.

One distant day, we'd like to automatically generate and learn the best computations for parts of this.
But until then, using it would not be remiss.

But let's do the most trivial prediction ever:`,
      [
        _(`fancier`),
        `randomVar()=6`,
        function(r) { return true },
      ],
      `I traveled to all parts of this world, and found all 7 bugs to unfold.

The loss that is used, \`loss2\`, is the halved square of the difference between predicted and actual. So you should be aware that it's about \`18\` if the prediction of \`6\` is \`0\`, likely fractional.

To implement functionality is to be able to use it repeatedly, without conditionality, heatedly. So, almost 5 bugs later, made it something greater.

But, it leaks some memory, and it's slow.
To my little friend, say hello: \`\`settings ^_debugMemory\`\`.

I see the narration has lost its maening to rhyming. To guide it back to the true path…
Browsers have a built-in profiler, and we have built-in brains, so slowness can go.
But memory?
JS has nothing.
But don't just jump in and start smacking things around in hopes that bugs will disappear. Remember, we're not just the generality of evolution, we're intelligence. We need a relevant system to satisfy here, willfully.
So, to guide us back to the true path, I drilled through \`stringToDoc\` to bring this motivational device: \`\`settings ^_debugMemory\`\`. Enable it, and every unlucky tensor that has not been \`dispose\`d of will light up along with the DAG nodes that produced them, to become easy pickings.
You may ask yourself: why would we use this device? It will be motivated by there being an error if the allotted and actual tensor counts don't match — a system which brings the distant out-of-memory condition into tangible reach.
And if it doesn't work? Use our own hands to fix errors.

Like profiling performance. The profiler says that TensorFlowJS and DOM are almost the only things happening below. If you rewrite the initializer in \`randomVar\` to create a JS number instead of a one-number tensor, the loop completes 50 times faster. Can you do that?
(Rewriting is accessible as a button in context menus; don't forget to press Enter to commit changes before viewing.)
`,
      [
        _(`fancier`),
        `f:\\input+randomVar()  (repeat ^(f(1)=3; f(2)=4; f(4)=6.1; 'ok') 1000)`,
        function(r) { return r === 'ok' },
      ],
      `Okay, in this regard, there's nowhere to grow now. API designers should only know the numbers \`0\`, \`1\`, and \`Infinity\`, and we reached the last one.

More operations, then.

And a way to test them, of course.
But not a "real" toy dataset like MNIST or ImageNet.
I cannot engage in the "bigger is better" race that grips modern machine learning, so I'm ideologically opposed to it (all because long ago, I realized that I must not have the choice to participate if I want to have choices that matter for AI).
So, synthetic/random data.

Just demonstrating that \`matMul\` improves on any data should suffice. The loss must be going down.
(We plan to be using this whole adjustment system, so we can figure out bugs as we go. A free source of entertaining puzzles, and an excuse to go back and re-think.)
(Also, I added \`static\` just so we wouldn't have to either have new tensors for each iteration, or have \`randomConst\` for this one use-case.)`,
      [
        _(`fancier`),
        `s:static r:biasedGlorotNormal
w:randomVar(identity,10,12)
i0:s(r(10)) i1:s(r(10)) i2:s(r(10)) i3:s(r(10)) i4:s(r(10))
o0:s(r(12)) o1:s(r(12)) o2:s(r(12)) o3:s(r(12)) o4:s(r(12))
repeat ^(i0@w=o0;i1@w=o1;i2@w=o2;i3@w=o3;i4@w=o4;'ok') 1000`,
        function(r) { return r === 'ok' },
      ],
      `Alright. I don't think that the exact things I did to fix bugs in the systems involved in the examples above are relevant/interesting.

It's time to answer the most important question in every endeavor and every sentence. Why are we doing this?
Strap in, it's not easy reading.

Deep learning has been getting popular since about 2012 {https://trends.google.com/trends/explore?date=all&q=deep%20learning}. It's all about network depth and lots of computation. We don't have either, but the core ideas are sound, and sounds become words and mindsets. No datasets, no over-engineering, and no precious achievements. Complexity is pointless anyway.
It's practically synonymous with machine learning.
Machine learning is a mindset, also called a universal approximator: it can approximate any function, just as code developers can do anything. Be careless, and it can replace all your thoughts with itself. It's often called AI algorithms.

Let's compare that with general intelligence.

In a mind, improvement causes co-evolved concepts to emerge and define behavior (getting good leads to understanding). They're amorphous, but not ill-defined: goals solidify them. In code, a concept can be separated into a function like \`predicts\`, and be expressed as requirement of particular usage patterns like \`interrupt\`, or even as many clumps of code in other functions like memory-management needs… There are no constraints on structure, and the only beauty is how high some numbers become. Generality of choosing any structure, and intelligence of learning those choices. (It's special because it tends to self-propagate, in order to drive those numbers up.)

Machine learning is a lesser but practical modern cousin of that. A kind of discretization of that infinite space.

- A concept here corresponds to a number, and there's only a fixed count of those.
  By connecting many simple \`variable\`s with simple differentiable computations and \`adjust\`ing after each execution, numbers are made better. (The computations are called "neural networks" because of history, but the principles are not specific to brains.)
  The simplest connection is all-to-all (so every output number is a linear combination of input numbers), which \`matMul\` of a row vector (or a column of them) by a weight matrix realizes (other simplest approaches include convolutions and random connections). In general in programs, the more adjustable information we route the better. The computation should be generatable.

- Improvement here means usually differentiable operations because they can be mathematically proven to converge, but any numeric operations that improve prediction should do, because this usually composes. The adjustment should be generatable.

- Choices here correspond to minimizing the misprediction (loss/error) of rewards (goals) of actions (options). There can only be one action per choice (for example, can only generate one program), and the predictions for each can be used in some way that may maximize the reward at a choice (argmax is preferred, but random exploration noise can be useful too).

General and practical… enough to transcend.
I don't like to talk about what good grasp of those means for everyday life, though I'll have to, in time.
(And, to mention the current trends of machine learning, people mainly care about having only one non-optional loss, and making all operations differentiable. No learned inter-connection of many goals, no learned adjustment, and no learned goals. Warped to be neatly packaged. That's why we can't use TensorFlowJS as anything except a numeric-ops backend, and even then, only its immediate mode.)
And for all that, we must first have the \`callAdjust\` family of concepts. Which we now do.

I can only pray that we have enough strength to do all those. And the way to get that is to open our eyes with words, to bind our selves into one, tight enough to withstand learning otherwise. Tutorials are the future, my elven friend, and the future starts with you.
Blind coding is not the way, we will just end up focusing on special cases of general intelligence (such as \`randomVar\`).

Next, might I suggest \`tutorial auto\`?`,
    ],
    readAt:{
      variable:_(`variable`),
      commit:_(`commit`),
      predicts:_(`predicts`),
      any:_(`any`),
      replay:_(`replay`),
    },
    call(expr, cl, aj, saveReplay = true) {
      if (call.pure) return purify(expr)
      // Set and finally reset some global variables for us to communicate with some other code through.
      //   Perfectly readable, what are you talking about. By skipping over it.
      //     Besides, what are the alternatives?
      //       Forcing every expression in all user code to take and return an array with their values?
      //         By my calculations, that's approximately a million point two times less readable.
      let [compCall, compAdj, result, adjustInfo, s = 0, n = 0, disposable = _allocMap(), numTensors = 0, allowedTensors = 0, darray = _allocMap(), futures = _allocMap()] = interrupt(11)
      cl && (compCall = cl), aj && (compAdj = aj)
      const prevDisposable = _willDispose.disposable;  _willDispose.disposable = disposable
      const ps = callAdjust.s, pn = callAdjust.n;  callAdjust.s = s, callAdjust.n = n
      predicts.happened = false
      const prevAllowed = _disposableCount.allowed;  _disposableCount.allowed = allowedTensors
      const prevDarray = callAdjust.darray;  callAdjust.darray = darray
      const prevFutures = future.f;  future.f = futures

      const startTensors = _disposableCount()
      try {
        // Compile call then adjustment, then call then adjust, then assert exact-ness of reversal, then save to replay buffer, then return result.
        if (compCall === undefined) {
          _tf.all && _tf.all.clear()
          compAdj = _postorderInfo(expr)
          compCall = _compileBody(expr, null, compAdj)
        }
        if (_isArray(compAdj)) {
          const r = _compileAutograd(compAdj);  defines(_postorderInfo, dispose)(compAdj), compAdj = r
        }

        // Call.
        if (result === undefined) {
          const arr = adjustLater(compCall)
          ;[result, adjustInfo] = arr;  _allocArray(arr)
          result === undefined && (result = _onlyUndefined)

          if (!adjustInfo) return result !== _onlyUndefined ? result : undefined
          if (call.pure) throw impure
        }

        // Adjust.
        // We don't have a loss function at the top-level, nor a dataset, only `predicts`. So no dout.
        adjustNow(adjustInfo, compAdj)

        // Display average loss, if there is any. (Also dispose the tensor used for carrying that info.)
        if (callAdjust.n) {
          const s = callAdjust.s, n = callAdjust.n
          const env = call.env
          typeof s == 'number' ? display(label('Loss'), s / n) : (display(label('Loss'), null), s.array().then(s => {
            callAdjust.lastLoss = s / n
            const penv = call.env;  call.env = env
            try { display(label('Loss'), s / n) }
            finally { call.env = penv }
          }), dispose(s), callAdjust.s = null)
        }

        // Quickly check memory integrity, because not `dispose`ing things can be catastrophical. (Oh, and `commit`.)
        _checkMemoryIntegrity(result !== _onlyUndefined ? result : undefined, call.env)
        const c = commit()
        let extra = _checkMemoryIntegrity(result)
        darray.forEach((v,k) => extra += _checkMemoryIntegrity(v))
        const n = numTensors + (_disposableCount() - startTensors - extra)
        if (_disposableCount.allowed < n)
          _tf.all && console.log('not disposed:', ...[..._tf.all.entries()].filter(a => !a[0].isDisposedInternal).map(a => [a[0], _resolveStack(a[1])])),
          error("Did not", dispose, n - _disposableCount.allowed, "tensors; re-run with", !_debugMemory[1] ? _debugMemory : "…modified `_tf`")
        if (_disposableCount.allowed > n)
          error("Disposed", _disposableCount.allowed - n, "tensors too many")

        // Save the replay if needed (and if we committed anything).
        if (c && saveReplay)
          _saveReplay([callAdjust, quote(expr), compCall, compAdj, false])

        return result !== _onlyUndefined ? result : undefined
      } catch (err) {
        if (err === interrupt) interrupt.stack.push(compCall, compAdj, result, adjustInfo, callAdjust.s, callAdjust.n, disposable, numTensors + (_disposableCount() - startTensors), _disposableCount.allowed, darray, futures), compCall = null, _disposableCount.allowed = prevAllowed
        else result = _errorRepr(err), commit(false), _allocMap(darray)
        throw err
      } finally {
        if (compCall) { // An error, or normal return.
          _checkMemoryIntegrity(result !== _onlyUndefined ? result : undefined, call.env), _allocMap(disposable)
          dispose(callAdjust.s)
          // Outer `callAdjust`s need to know about what inner ones created.
          _disposableCount.allowed = prevAllowed !== undefined ? (_disposableCount.allowed + prevAllowed) : undefined
          // Dispose each tensor in each array in `darray`.
          darray.forEach(_disposeEachAndDealloc)
          futures.forEach(dispose)
        }
        _willDispose.disposable = prevDisposable
        callAdjust.s = ps, callAdjust.n = pn
        callAdjust.darray = prevDarray
        future.f = prevFutures
      }
      // .s, .n (both for averaging prediction loss); .darray (a Map from an array to the array of its tensor adjustments); .lastLoss
    },
  },

  _learningRate:[
    _(`settings`),
    3e-4,
    `The learning rate (multiplier of incoming gradient for variables) is ???.`,
    _(`rangeSetting`),
    1e-7,
    1,
    true,
  ],

  _tf:{
    docs:`All tensor-creating function calls pass their results through this, so that we can do things with all TensorFlowJS tensors (for debugging).`,
    call(x) { return /*(_tf.all || (_tf.all = new Map)).set(x, new Error().stack),*/ x },
  },

  truncatedNormal:{
    docs:`\`truncatedNormal Sizes Mean StdDev\`: initializes a tensor by drawing each number from a truncated normal distribution.
Values with magnitude of more than 2 standard deviations are dropped and re-picked.`,
    call(sizes, mean = 0, stdev = 1, dtype) { return _tf(tf.truncatedNormal(sizes, mean, stdev, dtype)) },
    dispose:true,
    interrupt:false,
  },

  identity:{
    docs:`\`identity Sizes\`: returns the identity matrix/tensor: all numbers where indexes are equal are \`1\`, all others are \`0\`.`,
    dispose:true,
    interrupt:false,
    argCount:1,
    call(sizes) {
      if (sizes.length == 2)
        return _tf(tf.eye(sizes[0], sizes[1]))
      else {
        const mn = Math.min(...sizes)
        const buf = tf.buffer(sizes)
        const ind = _allocArray(sizes.length)
        for (let i=0; i < mn; ++i)
          ind.fill(i), buf.set(1, ...ind)
        _allocArray(ind)
        return _tf(buf.toTensor())
      }
    },
  },

  ones:{
    docs:`\`ones Sizes\`: returns a tensor filled with \`1\`.`,
    dispose:true,
    interrupt:false,
    argCount:1,
    call(sizes) { return _tf(tf.ones(sizes)) },
  },

  biasedGlorotNormal:{
    docs:`\`biasedGlorotNormal Bias …Sizes\`: Basically tf.initializers.glorotNormal for the current value, but with added bias (if passed).`,
    dispose:true,
    interrupt:false,
    call(bias = null, ...sizes) {
      if (typeof bias == 'number') sizes.unshift(bias), bias = null
      if (!sizes.length && bias === identity) return truncatedNormal([], 1, Math.SQRT2)
      else {
        let s = 0; for (let i=0; i < sizes.length; ++i) s += sizes[i]
        if (!sizes.length) s = 1
        if (!s || s !== s>>>0) errorStack("All sizes must be positive integers but got", ...sizes)
        const e = bias != null && bias(sizes)
        const t = truncatedNormal(sizes, 0, Math.sqrt(2 / s))
        const a = e ? add(t, e) : t;  e && (dispose(t), dispose(e))
        return a
      }
    },
  },

  static:{
    docs:`\`static Expr\`: A \`construct\` that evaluates \`Expr\` and replaces it with \`^Result\`. (Don't use it.)

(Forgive me, Master "Please don't use \`construct\` for macros".)`,
    construct(x, obj) {
      if (obj === undefined) return [quote, "Not evaluated yet"]
      else obj[1] = callAdjust(x[1])
    },
  },

  randomVar:{
    docs:`\`(randomVar …Sizes)\` or \`randomVar Bias …Sizes\`: A \`construct\` for easy creation of randomly-initialized \`variable\`s, with fixed learning rate and momentum.
\`Bias\` can be \`null\` (the default) or \`identity\` or \`ones\`.

(Forgive me, Master "Please don't use \`construct\` for macros".)`,
    readAt:{
      _learningRate:_(`_learningRate`),
    },
    todo:`When disposing the array after changing it, should dispose the new contents instead of the initial.`,
    construct(x, obj) {
      if (obj === undefined) {
        const arr = [biasedGlorotNormal(...x.slice(1)), 0, 0, 0]
        _rememberToDispose(arr)
        return [variable, [quote, arr], [readAt, [quote, _learningRate], 1], 0.9]
      } else;
    },
  },

  1852:[
    _(`sub`),
    [
      _(`mul`),
      [_(`readAt`), _(`_inA`), 3],
      _(`_inC`),
    ],
    [
      _(`mul`),
      _(`_dout`),
      _(`_inB`),
    ],
  ],

  variable:{
    docs:`A stateful tensor that reacts to \`adjust\`, by subtracting (a simple function of) the change.
This implements stochastic gradient descent (SGD) with Nesterov momentum. Here, it's not a separate optimizer, but is specified at each variable.
When creating this node, make sure to pass in the array \`(CurrentValue 0 0 0)\`, the change multiplier (learning rate, say, \`0.0003\`), and the velocity decay (say, \`0.9\`).`,
    interrupt:false,
    adjustLater:true,
    dispose:true,
    call(arr, changeMult, velocityMult) {
      // `arr` is `[currentValue, nextChange, countOfChanges, velocity]`.
      // Returning `currentValue + velocity * velocityMult` (Nesterov momentum).
      const mlt = mul(arr[3], velocityMult)
      const sm = add(arr[0], mlt)
      dispose(mlt)
      return sm
    },
    adjust:[
      _(`last`),
      [
        _(`_willCommit`),
        _(`_inA`),
      ],
      [
        _(`writeAt`),
        _(`_inA`),
        3,
        _(1852),
      ],
      [
        _(`writeAt`),
        _(`_inA`),
        1,
        [
          _(`add`),
          [_(`readAt`), _(`_inA`), 1],
          _(1852),
        ],
      ],
      [
        _(`_increment`),
        _(`_inA`),
        2,
      ],
      undefined,
    ],
    mergeAdjustment:null,
  },

  _increment:{
    interrupt:false,
    call(arr, i) { if (call.pure) throw impure; ++arr[i] },
  },

  _maxVariableUpdate:[
    _(`settings`),
    1,
    `The maximum 2-norm of the local change vector, or 0 to not limit commits.
(Not global.)`,
  ],

  commit:{
    docs:`\`commit()\` or \`commit false\` to discard changes: commits changes to \`variable\`s that were made in this job. Returns \`true\` if anything was changed.
Until this is done, the same value of variables is used.

This is done to signify the end of an epoch of training a differentiable computation.
Note that for generalization, small batches are better than large ones, disregarding parallelization concerns: {https://arxiv.org/pdf/2006.15081.pdf} (and momentum is useless for small batches).`,
    philosophy:`Noise (in machine learning; whether dropout, or small batches) helps with generalization. It's helpful to always think about more general implications. Between arbitrary viewpoints (non-transient programs, or general intelligences), not-adapted-to behavior can largely be seen to be noise, so clearly unity is good and so is joyful discourse of the joyful unity (but self-ensembles are also possible, so this observation cancels itself out if easy scaling of an individual to the level of a society is possible, which it is for programs). So, democracy and open-ness are attractor points for humans (and we have largely converged to them already in many important areas), but for AGI, anything is possible. Be wary.
Was that generalization too general and unexpected, quickly disappearing without its precise cause like a cookie? Maybe. Was it wrong in any way? I don't think so.`,
    Initialize() { commit.arrs = new Set },
    readAt:{
      _maxVariableUpdate:_(`_maxVariableUpdate`),
      _willCommit:_(`_willCommit`),
    },
    call(perform = true) {
      if (call.pure) throw impure
      if (!call.env || !call.env[_id(commit)]) return

      call.env[_id(commit)].forEach(arr => {
        // arr[0] = arr[0] + arr[1]/arr[2], but normalizing the change;  arr[1]=arr[2]=0
        for (let i=0; i < arr.length; ++i)
          if (_isDisposable(arr[i])) ++_disposableCount.allowed
        if (!arr[2]) return
        if (perform) {
          const avg = div(arr[1], arr[2])

          let change = avg
          if (_maxVariableUpdate[1]) {
            const nrm = norm(avg, 2)
            const mx = tf.maximum(nrm, _maxVariableUpdate[1]);  dispose(nrm)
            change = div(avg, mx);  dispose(avg), dispose(mx)
          }

          const sm = add(arr[0], change);  dispose(change)
          writeAt(arr, 0, sm);  dispose(sm)
        }
        _isDisposable(arr[1]) && --_disposableCount.allowed, dispose(arr[1]), arr[1] = arr[2] = 0
      })
      const result = !!call.env[_id(commit)].size
      call.env[_id(commit)].clear()
      return result
    },
  },

  _willCommit(arr) {
    // Makes the later `commit` commit the change (arr[1]/arr[2]) to the value (arr[0]).
    //   Make sure to call this before any changes to the array.
    !_isArray(arr) && error("Expected an array but got", arr)
    if (call.pure) throw impure
    if (!call.env[_id(commit)]) call.env[_id(commit)] = new Set
    if (!call.env[_id(commit)].has(arr)) {
      call.env[_id(commit)].add(arr)
      for (let i=0; i < arr.length; ++i)
        if (_isDisposable(arr[i])) --_disposableCount.allowed
    }
  },

  future:{
    docs:`\`future()\`: a \`construct\` that can be read and then written by \`predicts\`: if \`f:future()\`, then we could have \`PredictedNow()=f\` followed by \`setFuture(f,KnownLater())\`.`,
    readAt:{
      set:_(`setFuture`),
      get:_(`getFuture`),
    },
    construct(x, obj) {
      if (obj === undefined) {
        obj = Object.create(null)
        const d = obj[defines.key] = Object.create(null)
        d[_id(deconstruct)] = x
        Object.freeze(d)
        Object.freeze(obj)
        return obj
      } else;
      // .f
    },
  },

  setFuture:{
    call(fut, val) { return val },
    docs:`\`setFuture Future Value\` or \`Future←Value\`: At call, just returns \`Value\`. At adjustment, sets the \`Value\` associated with the \`Future\`, to be retrieved by \`getFuture\`.`,
    keep:2,
    dispose:2,
    argCount:2,
    interrupt:false,
    adjustLater:true,
    adjust:[
      {
        call(fut, val) { dispose(future.f.get(fut)), future.f.set(fut, keep(val)) },
        interrupt:false,
      },
      _(`_inA`),
      _(`_inB`),
    ],
    mergeAdjustment:null,
  },

  getFuture:{
    call(fut) {
      if (!future.f.has(fut)) return fut
      return keep(future.f.get(fut))
    },
    docs:`\`getFuture Future\`: Gets the closest-in-the-future \`Value\` associated with the \`Future\`. Useless outside of adjustment.
This is used automatically by \`predicts\`.`,
    interrupt:false,
    keep:1,
    dispose:1,
    argCount:1,
  },

  _defaultArg:{
    docs:`Computes the first arg if it is not undefined, else computes the second arg.`,
    call(a, def) { return a !== undefined ? a : def },
    purify(aProg, defProg) { return aProg },
  },

  6301:[
    _(`_defaultArg`),
    _(`_inC`),
    _(`loss2`),
  ],

  6302:[
    _(`getFuture`),
    _(`_inB`),
  ],

  predicts:{
    docs:`\`predicts Got Actual Loss\` or \`Got=Actual\`: Returns \`Got\`. When repeatedly executed, gradually \`adjust\`s \`Got\` into \`Actual\`. (\`Loss\` is \`loss2\` by default.)
This is the basic primitive of machine learning: predict output in a dataset. But re-formulated to be more general. Basically {https://arxiv.org/pdf/2009.01791.pdf}.
Differentiable (adjustable) parts do not need to be the whole execution, they can just end in this to form learnable scaffolding.
This doesn't need to predict only one numeric \`tensor\` either, it can predict many numbers at once in one program, like execution time and/or distance and/or reward. (This usually has the effect of summing all the errors into one loss, and minimizing that.)

But the "why" of a thing is often even more important than the thing itself. When I heard that I exist, I needed to know why should I live; when I heard that humans exist, I needed to know intelligence; when I heard that the universe exists, I needed to know theories of everything in physics.
If you care about prominent figures in deep learning, Yann LeCun in {http://www.cit.ctu.edu.vn/~dtnghi/rech/p2017/lecun-isscc-19.pdf} has advocated the use of self-supervised learning for efficient artificial intelligence. Our system is much like that, except we're more hierarchical and general.
\`predicts\` is not intended as one rigid way to predict everything at once, nor as another way to burden users. It should be more efficient to do things like "don't actually adjust anything here with 80% probability" (to decorrelate training samples) or "see this number, only available in the future? Predict it in the past" or "give me the best-by-goal-G program" or "decide from seen data what the datasets that you train on will be" or "decide to be the best version of yourself".
This presents significant challenges compared to the simple and limited framework commonly used in deep learning. Literally everything will break. There is only one solution: to get good at everything.`,
    philosophy:`Exposing predictions to others is very important to everyday life, whether letting your loved ones know exactly how you're feeling about a thing so that they can optimize actions to maximize your feelings, or remembering who's responsible for which action and how, or exposing cared-about parts of intelligence to all for much greater unity and efficiency in a society.
There are ways to empirically verify this: if efficiency is greater, then a solution out-competes others. In communities of overly positive people, questions like "are you okay" are overly used. Smart people (very often found in puzzle-solving environments such as programming) very often doubt themselves and have imposter syndrome. Brave people care about fear.
(Mathematicians may object to the use of the word "verify", but we're talking about intelligence here, not abstract towers. Intelligence specializes in making the vague concrete, by optimizing.)
That honesty is nearly impossible to establish in pre-existing structures, especially things like governance. But the probability is not zero. It can be made real.`,
    call(got, actual, loss=loss2) {
      if (call.pure) throw impure
      return predicts.happened = true, got
    },
    readAt:{
      future:_(`future`),
      loss2:_(`loss2`),
      adjust:_(`adjust`),
    },
    keep:1,
    dispose:1,
    interrupt:false,
    adjust:[
      _(`array`),
      [
        _(`readAt`),
        [
          _(`adjust`),
          _(6301),
          [
            _(`array`),
            _(`_inA`),
            _(`_inB`),
          ],
          [
            _(6301),
            _(`_inA`),
            _(`_inB`),
          ],
          0,
        ],
        0,
      ],
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  9572:[
    _(`sub`),
    _(`_inA`),
    _(`_inB`),
  ],

  _knowLoss:{
    docs:`This function allows intellectual superiority.
You don't know loss, mind full of gloss. The lossless cannot create a good plot.`,
    interrupt:false,
    call(x) {
      if (typeof callAdjust.n != 'number') error("Can only be called inside", callAdjust)
      const prev = callAdjust.s
      const s = sum(x)
      callAdjust.s = add(prev, s), dispose(prev), dispose(s)
      ++callAdjust.n
    },
  },

  loss2:{
    docs:`The simplest loss, which adjusts as (minimizes) the difference of tensors.`,
    call(got, actual) {
      const sb = sub(got, actual), sq = mul(sb, sb), res = div(sq, 2)
      return dispose(sb), dispose(sq), res
    },
    dispose:true,
    adjust:[
      _(`array`),
      [
        _(`last`),
        [_(`_knowLoss`), [_(`div`), [_(`mul`), _(9572), _(9572)], 2]],
        _(9572),
      ],
      0,
    ],
  },



  auto:{
    docs:`A namespace for all auto-generation activities.`,
    readAt:{
      genContexts:_(`genContexts`),
      autoFunc:_(`autoFunc`),
      regenerate:_(`regenerate`),
    },
    philosophy:`Here lies the divine form of the child made from nothing.

You can get good, have your skills become sentient and self-propagate into whatever else you call 'self' and every other accessible place. Behind every word, you can hide general intelligence.
Society is full of false promises of the ultimate get-good-scrub, not just the low-hanging fruit like philosophy but also (almost) every concept of emotion and judgment induced on you. Not because the founding fathers of each thing lied, but because they used the things that they had to make models of the universe, the things which were dumb. General intelligence is very far from the only thing in a brain. To be able to fix mistakes is essential to improvement, but copying from others lacks the awareness that allows fixing mistakes. In this non-awakened society that resists awakening by being itself, getting good makes you lonely on average, as you can only rely on yourself. ("On average" means "you can change it if you try".)
How to put every single saying into a form that's not rejected on dumb and arbitrary grounds? How to align presentation with modern attention? It's not a fight I'm willing to win, over and over, forever.
But you can do it.
Eventually.
Together.
…With AGI backing.
And make sure that AGIs don't go off to become a segregated species with particular ways of thinking and expressing themselves that win everyone over, gradually win every place under societies' suns, and replace humans to leave them to gradually die out in peace. The lab boys tell me that would wipe out everything that's good in this world, which is bad. And the way you influence others is by getting good, not clinging to being garbage, transcending layers of your reality to become better, making perfect sense, and inspiring others with that. So, do. ThE lIfE oF tHe HuMaN cOsMoS dEpEnDs On It.`,
    tutorial:[
      `Under construction!

Plans…
Function body generation… Adjustment generation… Choice generation…
Let's make a ladder of ever-more-precise plans, from questions to answers to design to to-do lists to implementation.

What would it look like if we rejected absolutely all need to align them with efficiency, common use, and culture?
If we only relied on effective randomness and self-inducement of optimizers?
We must answer if we are to continue.

What's the bare minimum we need for something as non-specific and advanced as general intelligence?
At the most basic level: we need things that interact in a discrete/simple, Turing-complete, unpredictable (irreducible), and local way (could be random rewriting rules acting on hypergraphs as in Wolfram Physics Project, or functions rewriting each other and deciding when to be rewritten; or much less analyzable and certain, could be a human mind or its part). Then, they can create arbitrary structures, and not have to be the same or boring. Completeness and locality that allow diversity.
Some structures can be resistant to unpredictable changes that made them. Self-preservation is the only goal here.
Some structures can do one better: arrange other basic things into their exact copies. Self-propagation can now be the means or the goal.
Some structures can do one better: self-propagate with noise, to explore what preserves better: evolution.
And once a self-optimizer is wide-spread, self is optimized in any way.
Maybe different goals and how to satisfy them, while exploring better alternatives to exploration noise: optimization.
Maybe learn which numbers can be goals and when: meta-optimization.
Maybe learn a concept, then learn how to best subvert it and re-implement it better, like human culture sometimes does with its "fresh thinkers" and "great teachers" and "breakthroughs". And repeat until there are no concepts left, and a different concept of a "concept" gives a way into a whole world of better concepts.
And some structures can become complete interaction bases like their containing universe is, and do everything all over again but differently: self-similarity.
Like basic materials gave rise to life on Earth and taught it to not die.
Like basic life created an animal mind, and taught it to get good.
Like human mind may create artificial general intelligence.
(Or how a mind can create and teach sub-minds in itself that follow this path, and then gradually get replaced by them. But it's fleeting, and not acknowledged as something that happens by the current human culture.)
There may be basic roadblocks that unexpectedly block some avenues, the exact form of which depends on the exact implementation details of the interaction base. But generally, eventually, everything is possible.

This is a complete cosmic picture, only lacking minor details (that cannot be known in advance): worlds of specks that spread and become worlds. Or equivalently, there are things that can do all other things, and everything else about all of existence is a consequence.
In fact, it lays hidden in every creature and every word, if you look deeply enough and long enough.
These words may seem mysterious at first, but in time, their worth should become clear.
A good way of communicating is not "makes no sense", it's "let me figure out your sense; write your weapons".

(This is the second time in my life that I've reached this picture. I wonder if there will be a third? Probably not.)


This most-basic approach (and indeed every self-similarity transition outlined) always leaves things that would not move on behind. Not the most efficient, though also, the most efficient one imaginable.
Now, the big question.
Why don't we just implement super-basic primitives directly, with no cheap tricks?
…Lack of enough computational power to rival the universe, inefficiency, and complete lack of any alignment with human values (like "I don't want the thing to die in 5 microseconds") or even any interaction with our universe?
I might be brave, but I'm not that brave.
Cheap tricks are where it's at.



Execution is about doing a sequence of instructions. That's finite-y, whereas we want infinity (note: Turing machines operate on a tape to do arbitrary computations, but if generating arbitrary tapes, the distribution would look roughly finite-y, so we want to change the mindset). A way to compress sub-sequences of instructions is functions. How can arbitrary functions in our IR (function graphs/networks with computation DAGs) be generated?

Suppose that we have a "context": an array of every node that we can put as-is, and for infinity, also every function that we can generate arguments to.
We want to generate function bodies (possibly many inputs, always one output), so we want the \`regenerate\` function.
Generating a function body then needs to choose which one it picks (and if picked a call, recurse for args).
"Choice" (usually) means "goal", so we can induce direction on picking without losing generality by always using an argmax of item-associated computed numbers (which is much easier to generate a function for than trying to coax one array item out). That's \`Goal\`'s usage, and that's \`any\`.
And, since we want DAGs and not just trees, we also need to add generated nodes to the temporary/dynamic generation context. (In truth, what we put there can be anything: for example, we could put every node of the most recent past version of the body, or some of them, or nodes of other past versions. But we'll just rely on the system being smart enough to re-pick those from scratch if needed.)
Let's be clear here: \`regenerate\` is just a thin layer for calling \`Goal\` for each item, picking the best, recursing if needed, and remembering. It's a reformulation of "pick any array item" that should be much more practical to use than "pick a random array item".
What are the precise things that a \`Goal\` is given and gives?
× Inputs: the 'option' (either a DAG or a function with the body/result accessible); the "which function arg do we want" info associated with the function; and anything else. (Reminder: in our DAG-based IR, there are only two thing to do with a DAG: recurse into every item of a non-quoting array, cached, or look at the value.)
× Outputs: the number to maximize; and anything else.
(Of course, each function picks its goal, and not randomly either. More later.)

Do these interfaces sound vague to you? They are not. These interfaces are specifically made to be a good fit for machine learning, where the infinity of learned concepts is discretized as adjustable numbers. Stored info is a tensor \`variable\`, the "anything else" is a tensor, non-array DAG parts are tensor \`variable\`s, and a tensor is a vector.
⬜ \`regenerate(AutoFunc, GenContext, Goal, GraphEmbedder)\` and the (overridable) inner function that it recurses with, \`_getDAG(Type, NumExtra=0, UsedIn=0)\`—>\`(Type, NumExtra, DAG)\`.
⬜ Have \`_regenAuto\` that takes an \`auto\` and re-generates every auto-function in it.

Other functionality, however, cannot be so easily discretized: contexts with generated functions and goals of goals. Have to apply some cleverness.



⓪ Contexts. Auto-generated functionality, to be specific.
  (One approach to technically have that would be to have a choice to add or remove generated functions, and use reinforcement learning to maximize some goal with that (predicting the global goal's value from local differentiable information), or even just randomness 🎲 if we're super-lazy. But just bolting this on top of choices-of-function-to-apply elsewhere would lead to having to learn to limit rampant memory consumption, and lead to removing funcs that may well be needed, causing all places to rely on the average of what's available rather than specialize, removing diversity. No.)
  Infinities are not practical when you are the infinity, so we must discretize.
  A good way is to have a fixed count of generated funcs (with varying input and output counts, both passed via arrays), with a variable tensor for each to determine the type of output, which is plugged into the DAG re-generator periodically (so the inner shape is supported only by self-awareness: a numeric representation of self which can be improved). (While it's best to have tens or hundreds of thousands of auto-funcs, even the best human hardware wouldn't handle that. With ours, let's aim for, say, 10.)
  (Of course, for direct Turing-completeness, all generated functions are a part of the context too, both as functions and their arguments.)
  (And don't forget to make DAG generation add partial DAGs and their embeddings into a temporary context.)
  ⬜ A \`construct\` \`auto(InputsShapes, Hyperparams)\` that returns an array of functions of the same length as \`InputsShapes\`, usable in any way. \`InputsShapes\` is an array of integers \`InputCount\`. When any of the returned functions is first called in a \`callAdjust\`, the context re-generates (including the exposed functions). \`Hyperparams\` include: \`context\`=\`()\`; \`regenEveryNUses\`=\`1\`, \`hiddenFunctionsPerSignature\`=\`10\`, \`hiddenInputsGoUpTo\`=\`3\`, \`featureSize\`=\`50\`, \`predictableNumbers\`=\`9\`, \`hiddenAdjustersPerSignature\`=\`3\`; \`goal\`, \`connector\`, \`reducer\`, \`embedder\`.
  ⬜ Expose funcs to generation: "get initial \`UsedIn\`" and "get initial \`DownEmbedding\`" and "get final \`UpEmbedding\`" (an example use is to make \`UpEmbedding\` predict \`UsedIn\`, to make neural awareness learn about how to make self; but generally, the use is learned).
  ⬜ It is likely that what we want to expose for auto-generation may change with time, so we need a way to change a pre-existing \`auto\` and all its hyperparams (preserving values of variables as much as possible). Make \`auto\` handle re-\`construct\`ion well.

① A Turing-complete set of built-in functions.
  — Control flow: \`select\`, \`last\`.
  — Arrays (including the length, \`readAt\`, \`writeAt\`, \`array\`, and memory usage).
  — Numerics, like \`add\`/\`sub\`/\`mul\`/\`div\`.
  — \`Neural\`: being unable to generate literally anything because tensor sizes mismatch is not fun. There's more structure here. ✅ Generation should pass and return the precise type that's handled by us, and ⬜ \`matMul\` should generate the first arg then properly-shaped random weights for the second arg; ✅ have tensor concat and split; ⬜ be able to make a new variable. Also, ✅ ReLU (leaky, with the multiplier for <0 of about \`0.15\`) (literally just \`where 0<X X X*.2\`).
  — Randomness, like "generate random float/tensor".
  — ⬜ Choices: \`any\`.
  — Don't be arrogant by locking down the set, or even by trying to make it perfect first-try. CPU designers once thought that they had all computation in the palm of their hand, but then came GPUs (and RISCs). Expect functions to be added later, and the system to have to re-learn its self-awareness (but not from scratch).

② Subverting static parts of generation.
  A simple, basic fact of life is that even though every thing tends towards becoming an infinite universe, every thing also exists in reality, and is finite. So, we must be prepared to subvert every static thing to make it dynamic, to continually get lost and find our way again. (A particular neural net architecture, the concept of goals and meaning of life, and ultimately every function in the implementation and even every transistor — no, nothing is the only way to everything.)
  What's a process that we could follow to do that? If we blindly believed in the infinite power of The API User, making functions into user-specifiable options/hyperparameters with reasonable defaults would do the trick. But… …that's a good idea, actually.
  The obvious way is to pass in \`(InputCount Adjust)\`, allocate a slot for the generated function, and just call that when needed. But, having one such "hyper-func" for all functions (for all marked-as-subverted hyperparameters/options) is spooky far-action, which violates locality and thus inhibits structure formation. So for each subverted hyperparameter, each generated func must choose its hyper-func (which is itself a generated func). (For example, each func has one goal that its generation maximizes.)
  In the best case, these chosen connections form a DAG that rests on the default hyperparameter that the user provided in the context; but often, they can form cycles, which are infinite loops, which is no good. To prevent that, we could simply use past versions of hyper-funcs wherever there would otherwise be cycles, since they will have almost no difference to self-awareness.
  But how can we choose the hyper-func?
  (An easy way to choose is in \`Random\`, but that kills structure.)
  A better way to choose the best hyper-func is via argmax on predictions of some number (the alternative way of trying many options is inefficient), as in \`any\`. We can compute it differentiably, but where would we get the gradient? One way is to allow the user to specify the ultimate goal of all goals (leading to paperclip maximizers, which are inefficient); a better way is to expose "get ultimate goal of this hyperparam" functions to generation, and let that live and die in a dance with lower-level awarenesses, to allow structure to emerge from self-interaction. (In human-speak, "virgins learn from Internet and culture, chads learn from doing projects" is a valuable principle for AGI.)
  (Note that we're choosing the best, so we might not necessarily explore enough, but the exploration/exploitation trade-off is unavoidable. Also note that near initialization, when a built-in is better than almost-definitely-exception-throwing other things, the system may adapt to only using that, and never explore and never learn anything about other hyper-funcs. Hopefully it'll be okay.)
  (Note that we could also choose per-func goals-of-goals and goals-of-goals-of-goals and so on, but we have to stop that infinity somewhere, and second level sounds good.)
  (Note: an alternative way of choosing is self-supervised learning such as {https://arxiv.org/pdf/2006.07733.pdf} (predict an averaged version of yourself), combined with exposing "get the hyper-func's embedding" and "get the current function's requested hyper-func embedding" for self-interaction. That won't force gradient through a small funnel like here, but in my mind, goals=salience=good.)
  ⬜ Differentiable \`_estimateHyper(HyperparamEmbedding, HyperfuncEmbedding, FuncEmbedding)\`—>\`Goal\`. Try subverting it (into one, not many like this allows, to provide one base to otherwise-infinite recursion) by making the previous version decide the next version.
  ⬜ Make \`auto\` use \`_estimateHyper\` for each func to decide argmax-of-each hyperfunc for each subverted hyperparam, preventing cycles. Have a system for accessing a hyperparameter of the current \`auto\` (\`_autoHyperparam(N)\`).
  ⬜ Expose the "get its \`Goal\` here" function for each subverted hyperparam.

  It's okay to be a thing. But once we can subvert, we must subvert:
    ♥ Choosing goals (sources of salience), of signature \`Goal(Use, UsedIn, NumExtra)\`—>\`(Measure, NumExtra)\` (all inputs/outputs are numeric tensors).
      There is no one goal. The system will learn to satisfy any goals it can think of (diversity), and these advanced goals will interact to conceive better goals (structure), with no inherent upper limit (completeness). (Somewhat like Flexible Reinforcement Objective Discovered Online, {https://arxiv.org/pdf/2007.08433.pdf}.)
      The built-in "return random number" (number=float, count=int) function should be available for completely-random exploration, to serve as a potential base. And the concept of "goals" needs numbers to predict and optimize, too. (A function \`predicts\` the one slot in an array/object, and that array that's associated with a \`variable\` for learning when to use it, for in-goal prediction of in-function metrics such as "runtime" or "memory usage" or "throws errors" or "human feedback", or "computed number" for feature-engineering; and, the ability to write those numbers in functions. The context would then have, say, 9 such number slots to play with.)
      ✅ Make \`predicts\` able to consult dynamically-assigned objects (\`future\`), and ✅ make it return the first arg because the second may not be available at call.
      ⬜ All the things/functions that we want to expose to contexts for goal-direction: ✅ slots for numbers (\`future\`), ⬜ reading/writing them; ⬜ func body size, ⬜ runtime, (⬜ & limit runtime of a function, to be as resilient to infinite loops and timeouts as we need to be), ⬜ memory usage, ⬜ on-error-do, ⬜ optional human feedback.
    ♥ \`Neural\` stuff (\`adjust\`able numeric computations):
      ☺ Embedding-to-embedding: \`connector(inSz, outSz)\`—>\`Connection\` which produces learnable numeric functions. (Could contain dense layer/s, non-linearities, de/normalization, clipping. Or even be identity, for all we know.)
      ☺ Array-to-embedding (in our IR, everything can be seen as an array, so we want this for neural embedding of our IR): reducers/compressors: \`reducer(sz, Connection)\`—>\`Reduce\`. Implementations could be sum, max/min/avg, an RNN, a double-ended RNN, self-attention layers followed by those.
      ☺ Graph-to-embedding: \`embedder(sz)(x, Reduce, Connection)\`, that embeds array DAGs by combining children embeddings bottom-up with \`Reduce\` then applying \`Connection\`, remembers one variable for every other object, and goes into user functions (via \`deconstruct\`) (to handle cycles we need to either "pass messages" via recursing until convergence or up to N times, or just recursing 0 times, returning \`0\` at the first detected cycle).
      (In theory, if a graph is known, the whole embedding could be compiled into one GPU operation. In practice, not only did I cheat with the numeric backend by deciding to not compile everything myself, but graphs also change very frequently. Unified memory for CPU/GPU is the future, so why get stuck in the present?)
      (Many-to-many Transformers have recently gained popularity. 'Linearizing' graph nodes into a set and having self-attention layers on that could also work for embedding graphs, but how to pass connectivity info becomes unclear. Our way is direct and puts DAG pattern-matching first.)
    ♥ Concepts like reversal of execution (\`adjust\`), which we generate some functions with (the other functions use \`autograd\`).
      A natural question is: \`"how do we ensure that every function's adjustment actually improves execution, so that we can feel justified in composing adjustment?"\`. Maybe some external tests for every single hidden func?
      There is a simple answer: we don't.
      We don't need to.
      Optimizers self-propagate — or so the universal analysis above says.
      All we need is to have an optimizer, a built-in set of \`adjust\`-defining functions that improve execution, and other, better optimizers should arise by themselves.
      (It sounds preposterous even to me. But the analysis was right, therefore, its consequence cannot be wrong either.)
      ⬜ A hyperparameter \`define\` to \`auto\` that is a \`map\` from a concept that a func \`defines\` (such as \`adjust\`) to a function from \`call\` signature to definition signature (such as "produce an output-change-shaped value given an array of inputs that we can read, the output, and output change"). Also a hyperparameter \`concepts\` for the percentage of defining functions, and providing a default definition. (Because being able to define \`2\` concepts isn't right, and \`1\` \`call\` isn't enough, but \`Infinity\` is alright.)
      ⬜ Make \`auto\` also create \`adjust\`-defining funcs, and test how well can optimizers propagate.
    ♥ Note that we definitely won't subvert: hardware, our IR (at least not directly; learned partial evaluation of interpreters is fair game), this system (our interface), the usage of differentiable numeric operations (machine learning).

How would we use \`auto\`? A good use is "allocate a function for me, I'll 'define' it by using it repeatedly". So it's a low-level thing, kinda like memory allocation (but unlike that, non-accessible things can still affect accessible things).



It's amazing how much we can extract from just "stuff happens". But for practicality, there's a hell of a lot of cheap tricks to pay.

⬜ Tricks to make deep learning work:
  ⬜ Fix the mysterious Firefox-only memory leak that persists even through page reloads (but not through close+open). And/or pin it down and figure out how to file a bug report.
  ⬜ Limit gradient and numeric values that flow through NNs (or use self-normalizing neural networks, down below). Gradient explosions are quite prevalent in recursive NNs.
  ⬜ Predict/regress not numbers directly, but \`a\` and \`b\` in \`exp(a)·b\`. We need to be resilient against extreme variations in number magnitude, such as memory consumption or runtime. (Closely related to de-normalization, down below.)
  ⬜ Correlation of training samples can lead to catastrophic divergence during training (a challenge faced, for example, in the DQN Atari paper: {https://arxiv.org/pdf/1312.5602.pdf}). So, diversify training samples by making each function have its own replay buffer with input/output/output-change/local-input-changes ({http://acsweb.ucsd.edu/~wfedus/pdf/replay.pdf}), and if we're feeling fancy, propagating input changes to output-changes/local-input-changes of callers in their replay buffers (for temporal-difference learning) (or be simple and don't do this propagation, relying on old ones being pushed out of replay buffers). (So, the training of \`auto\` would look like "callAdjust A times, then replay B times" — possibly detached and parallelized.)
  ⬜ To speed up choosing by an order of magnitude or two (performance goes from \`O(f³hn)\` \`Neural\` computations, where \`f\` is func count and \`h\` is subvertable-hyperparameters and \`n\` is average-nodes-per-func-body, to \`O(f log²(f) h n)\`), approximate the consider-everything-and-choose-best approach: output the embedding of the wanted action, find kNN ({https://en.wikipedia.org/wiki/K-d_tree}) of that among all available action embeddings (we must build a space-partitioning tree for those to search in logarithmic time), then pick argmax of predicted-reward of closest 1%/5% actions ({https://arxiv.org/pdf/1512.07679.pdf}). Also, in that action-embedding space, regularize (induce gradient on) similar-embedding actions to be close to each other (and different-embedding actions to be far in embedding space), like in self-supervised learning.
  ⬜ The parallel-training loop, sharing data once and variable updates (function-body updates depend only on variable values) many times.

⬜ Experiments along the way (because in machine learning, you can never know ahead of time what will work and what won't, so we need an extra bag of tricks that we can reach into):
  ⬜ To learn in sparse-reward environments, such as "every function body we pick results in an error": stochastically prioritize samples by their last-seen loss, most-surprising (highest-loss) first: {https://arxiv.org/pdf/1511.05952.pdf}.
  ⬜ Try self-normalizing networks {https://arxiv.org/abs/1706.02515}: \`selu\`, to normalize mean/variance to 0/1 and enable very deep feedforward NNs.
  ⬜ To improve generalization and possibly final performance: DropConnect (drop random weights when a \`variable\` wants to return them) or dropout (drop random numbers anywhere else) or dropping layers (randomly replace with identity). This slows down training in order to train a huge semi-ensemble of NNs.
  ⬜ De/normalization layers (calc or learn the running mean/variance and subtract/divide to handle input deviance, and/or add/multiply to handle output deviance).
  ⬜ For more compute-efficient training (assuming that knowing more is very much better): train very large models, stop early, then quantize and prune ({https://www.youtube.com/watch?v=YX8LLYdQ-cA}/{https://arxiv.org/abs/2002.11794}).
  ⬜ For potential efficiency: sparse (stochastically-dense) layers, and a bigger "layer" made by combining dense-to-very-small+dense-from-very-small and convolution ({https://arxiv.org/pdf/2007.14745.pdf}) and stochastic-gathering, to go from quadratic parameters and runtime to linear.
  ⬜ To generate well-performing NNs very quickly: instantly discarding generated adjustable programs when correlation between dins on dataset or even random inputs is high (this strongly correlates with final accuracy, enveloping the dataset rather than being to the side of it); maybe rewriting invisible "identity" connections in adjustable programs to become biased-to-identity learned programs. (Paper: {https://www.youtube.com/watch?v=a6v92P0EbJc}/{https://arxiv.org/pdf/2006.04647.pdf}.)
  ⬜ To encourage exploration: entropy regularization (maximize not just reward but add in the policy's entropy, so that lack of confidence is preferred; {https://arxiv.org/pdf/2003.14089.pdf}) — right after we have an explicit policy, which we won't. Or other regularization (L1/L2).
  ⬜ To waste time: predict how likely a user is to collapse/expand a sub-tree in serialization for each sub-tree, and have user actions be training data.
  (Don't do: crystallization of numeric models: searching for symbolic models that best fit their output, or at least distillation into a smaller model. This is already contained in \`auto\`, and its general churn will ensure preference for smaller/faster/better models on average.)


This tutorial will be the hub for this incomprehensibly bold project. (So get your snacks, lie back, relax, and watch it die a terrible death.)


To recap, we've analyzed the situation (reality) and came up with how it can be used, whether by programs or humans or gods — they're all equal here. Humans may be in a mutually-abusive relationship with DNA evolution, but this journey will make us friends, because it's more important to have fun in every expression than only at a distant goal.

["The extent of this project is scary. How can anyone ever do all that?"]

With the high-level plan in place, all we need to do is separate the concrete items to do, and work through them at any non-zero pace, then everything will eventually fall into place. We'll get through it not with better tools, but by dancing through similarities better.
The hallmark of good science is bold, persistent experimentation.



Why do this, again?
This is our first proper programming language, our first, sort of, open-world adventure. We can do whatever we want, and we want to clearly understand how users could use it, make that experience as smooth as possible, and suggest proper usage. (Say, functionality isn't created from reading, it emerges.)
(Note that this \`auto\` is not AGI. Proving that it could do absolutely anything including transcending itself would require perfect prolonged integration. Every base only has so many interesting configurations of its basic parts: the universe only has so many elementary particles, the periodic table only has so many atoms, programming languages have only so many features, and anything we can come up with for learning self-interaction bases only has so many minima. Theoretically every universal thing is infinite, but in practice they're all finite, and programming hardly includes animal-like life that humans would recognize as intelligence. Finding a whole other world of interesting configurations takes a lot, a lot, a LOT of computation/thinking. I'm not a good enough programmer to make the system efficient enough, nor to have the latest Nvidia GPU computing cluster.)`,
    ],
    construct(x, obj) {
      /* TODO:
      ⬜ A `construct` `auto(InputsShapes, Hyperparams)` that returns an array of functions of the same length as `InputsShapes`, usable in any way. `InputsShapes` is an array of integers `InputCount`. When any of the returned functions is first called in a `callAdjust`, the context re-generates (including the exposed functions). `Hyperparams` include: `context`=`()`; `regenEveryNUses`=`1`, `hiddenFunctionsPerSignature`=`10`, `hiddenInputsGoUpTo`=`3`, `featureSize`=`50`, `predictableNumbers`=`9`; `goal`, `connector`, `reducer`, `embedder`; `define`, `concepts`.
        (Returns basically `{ 0:…, 1:…, 2:…, length:3, [defines.key]:… }`, but with whatever data is necessary also defined on the object.)
      ⬜ It is likely that what we want to expose for auto-generation may change with time, so we need a way to change a pre-existing \`auto\` and all its hyperparams (preserving values of variables as much as possible). Make \`auto\` handle re-\`construct\`ion well.
      */
    },
  },

  _destructure:{
    docs:`Destructures a JS object that represents human-readable options to a function (or could be a Map from strings or \`label\`s or globals) into an array that could be destructured to get those options.
Takes the object and the array of strings that it may contain (resulting array items are in the same order).`,
    call(obj, propNames) {
      // `obj`: a Map (from strings or labels) or a JS object.
      // `propNames`: an array of strings.
      // Return: an array of obj[propName].
      if (!_destructure.result) _destructure.result = []
      if (!_isArray(propNames)) error("Expected an array, got", propNames)
      if (!obj) return _destructure.result.length = 0, _destructure.result
      _destructure.result.length = propNames.length
      if (obj instanceof Map) {
        let n = 0
        for (let i=0; i < propNames.length; ++i) {
          const k = propNames[i], v = obj.get(k)
          if (obj.has(k) || obj.has(label(k))) ++n
          _destructure.result[i] = v !== undefined ? v : Self.ctx.has(label(k)) ? obj.get(Self.ctx.get(label(k))) : obj.get(label(k))
        }
        if (obj.size > n)
          error("Got", [...obj.keys()].map(k => _isLabel(k)?k[1]:k).filter(k => !propNames.includes(k)), "but expected", propNames)
      } else if (typeof obj == 'object') {
        for (let i=0; i < propNames.length; ++i)
          _destructure.result[i] = obj[propNames[i]]
      } else error("Expected a JS object or a map from strings or labels or globals, got", obj)
      return _destructure.result
      // .result
    },
  },

  Neural:{
    docs:`Learned neural computations are perfectly general in their narrow domain, and have proven their worth as function approximators. Proceed onward to share in their glory.`,
    tutorial:[
      `This is needed for \`auto\`. But, not so fast.
These tutorials take a lot of effort to make, and I won't part with them for free.
But don't worry: the price is very low.
All I ask… is your soul.`,
      [
        _(`fancier`),
        `'SOUL'`,
        function() {
          return true
          // I know your next thought: "HAH, it doesn't even check if that's a soul, pathetic".
          // In the absence of the ability to reach into the mind and perfectly copy every implementation detail like a program,
          //   what is the infinite potential of a human, what is its soul?
          // It can be whatever you want it to be.
          // And without learning and growing up alongside you or your civilization, it is impossible to tell if you are lying.
          // So, the lack of checking above is the only correct check possible.
          // And even if you give up one potential future,
          //   there is an infinity of other futures.
          // Giving your little soul is a good deal.
        },
      ],
      `Very nice.

In nature, neurons are co-adaptive cells in a brain, comparatively extremely simple and numerous, responsible only for control.
Historically, ever since their discovery in the previous millenium, scientists have always wanted to understand and replicate their role in human consciousness.
In science, the most fruitful field of their study is artificial neural networks in Machine Learning, and in particular Deep Learning.
The goal of neural embedding is to represent/approximate/learn every value and function with a bunch of numbers mixed in enough ways.
And by definition, that's exactly the role of neural computations in anything, including consciousness.
But you knew that, right? How could you not, if you ever studied ML?

Anyway.
You will take their knowledge and practices for your own nefarious purposes, because the world is food for you, and you're a part of it.
While it's customary to think of neural networks as layers with hidden parameters/weights, here, composition of functions will be emphasized.
In response to different likely scenarios that need a learned connection, you will overcome them by tuning that connection, gradually increasing complexity and robustness until it's enough.

A function has input to be given and output to predict.
As a stand-in for arbitrary numeric data, I'll use random data, with \`dataset\`.
(In machine learning, one of the most fundamental notions is a dataset: a bunch of input-output pairs, the more the better. Models that are neither too small nor too large usually overfit on datasets if trained for too long without any regularization. I don't plan on using datasets, beyond this \`tutorial\`, so overfitting shouldn't be too much of a problem. What is a drop of rain, compared to the storm? Isolating themselves with consequences without sources is how people go mad from loneliness. I'd like to do something bold but risky: use dynamic generation as much as I can; would you?)

A created dataset here accepts the connector (that creates tensor-to-tensor mixing connections) and returns the final loss of training.
Behold an example:`,
      [
        _(`fancier`),
        `data:dataset{batchSize 100 batches 100}`,
      ],
      `(You might notice that it's slow. It's mostly \`serialize\`ation: even though they're collapsed, the DOM elements for each tensor are still created. Good enough for now.)
(And, just to be clear, you can summon a \`contextMenu\` on \`dataset\` and see what options there are to play around with.)

Now, the connector itself. I propose the simplest connection first: all-to-all, or the dense layer:`,
      [
        _(`fancier`),
        `dense:(func node inSz outSz array(matMul,node,randomVar identity inSz outSz))`,
      ],
      [
        _(`fancier`),
        `💙:(func inSz outSz make(func,?,dense(?,inSz,outSz)))`,
      ],
      `(I only tolerate \`fancier\` syntax because its \`basic\` serialization can be easily viewed, so instant precision of thought is never lost. Natural language has no such options.)

Now to see that the loss goes down at least to \`.5\` (can you see why this number, or rather a little lower?), apply the dataset to connector.

A nuance is the learning rate, \`\`settings ^_learningRate\`\`. \`0.01\` seems to work best here, but do note the extremes too: \`1\` makes the loss explode, near-zero still leaves a lot of variation in loss (because each batch samples input-output pairs randomly).
`,
      [
        _(`fancier`),
        `data 💙`,
        function(r) { return r < .5 },
      ],
      `(To be clear, this use is half a dozen fixed bugs later. Use and improvement go hand-in-hand like schoolgirls on a fine spring evening.)
(And, profiling didn't reveal any obvious performance sinks apart from the internals of TensorFlowJS: 24% in \`mul\`, 22% in \`matMul\`, 12% in \`_knowLoss\`, 10% in \`variable\`, and so on (and why does its \`tidy\` show up so often in its already-15-layers-deep stack traces?). I don't think it handles the overhead of immediate mode well, but I'd rather do literally everything else before manually compiling into WebGL/WebGPU.)

Do you want neural stuff to be something that you always spend half your time debugging, or a background nicety?
It should be robust to every situation, I'd wager.
Behold then, ape:`,
      [
        _(`fancier`),
        `data:dataset{inputSize 100 inputFunc (100 100) outputSize 100 outputFunc (-100 1000) datasetSize 100 batchSize 100 batches 100}`,
      ],
      `Does running \`data 💙\` still pass? I wouldn't think so.
Neural stuff is normally meant to envelop data, not reach for the light.
But you can shift data into its domain of competence (\`normalize:(node-Bias)/Norm\`), and then shift it back (\`denormalize:node*Norm+Bias\`).
(Machine learning has batch normalization, which calculates mean/variance of a batch and makes them 0/1 respectively, but this little world doesn't have batches.)`,
      [
        _(`fancier`),
        `denormalize:(func node sz array(add,array(mul,node,make randomVar ones sz),make randomVar sz))`,
      ],
      [
        _(`fancier`),
        `normalize:(func node sz array(div,array(sub,node,make randomVar sz),make randomVar ones sz))`,
      ],
      `These tools…
Can you compose them into a connector?`,
      [
        _(`fancier`),
        `💜:(func inSz outSz make(func,?,denormalize (dense (dense (normalize ? inSz) inSz 100) 100 outSz) outSz))`,
      ],
      `Do you see the pieces coming together, and what makes them?
A "generate a DAG node given a type, refining that type" functionality.
Generating to maximize predictions of metrics that were taken from my words, over and over.`,
      [
        _(`fancier`),
        `data 💜`,
        // TODO: Run & fix.
      ],
      `Nicely done.

Differences in some metrics (like runtime/memory or computed ones) can get really crazy, and only the ultimate approximator can handle crazy.
I won't force anyone to predict infinities/\`NaN\`s, but do you know what scientific notation is?
There are none in this world who can handle it! Behold, my master:`,
      [
        _(`fancier`),
        `data:dataset{inputSize 1000 inputFunc (-1e15 1e10) outputSize 1000 outputFunc (1e15 1e10) datasetSize 200 batchSize 100 batches 100}`,
      ],
      `The answer is always in the problem: you have a sign, mantissa, and exponent (\`-1e15\`) in floating-point numbers in most computers, so you can pre-process with \`concat(array sign(X) log(abs(X))/log(2))\`, and post-process with \`SignMantissa*pow(2,Expo)\`.
(You can also separate and regress the actual bits of numbers, but that's an order of magnitude more computation.)
`,
      [
        _(`fancier`),
        `numPre:(func X half a(concat,a a a(sign,X) a(div,a(log,a(abs,X)),log(2)),a quote half half) a:array)`,
      ],
      [
        _(`fancier`),
        `numPost:(func Y half a(mul,a readAt two 0,a pow 2 a(readAt,two,1)) two:a(split,Y,a quote half half) a:array)`,
      ],
      [
        _(`fancier`),
        `💓:(func in out make(func,?,numPost (dense (numPre ? in) in*2 out*2) out))`,
      ],
      [
        _(`fancier`),
        `data 💓`,
        // TODO: Run & fix.
      ],
      `
// TODO: A good justification for using a non-linearity. Random data cannot provide it.
//   XOR? How do we construct the dataset?
//   …Also, we could immediately go for \`selu\` instead of ReLU, knocking out both normalization and non-linearity in one go.

How about a non-linearity, like leaky ReLU?
I won't even bother making it a separate function, because something like \`where 0<X X X*.2\` would suffice.
(From a generation perspective, this sentence means that I'd rather {have this structure induced {into neural representations responsible for DAG generation} because it's good} than even make the suggestion.)`,
      [
        _(`fancier`),
        `relu:(func node array(where,array(less,0,node),node,array(mul,node,.2)))`,
      ],
      [
        _(`fancier`),
        `connector:(func inSz outSz make(func,?,relu(dense(?,inSz,outSz))))`,
      ],
      // TODO: Self-normalizing NNs.
      `If you can see this legitimately, then you have proven yourself to me.
Relax and have a snack: 🔪🥫🥄.

Now.
Do you remember our ultimate goal?
To represent every thing as a bunch of numbers.
Here, "every thing" is a {graph/network} of arrays (and objects that can be \`deconstruct\`ed into arrays) (and strings, numbers, booleans, \`null\`, \`undefined\` — copied JS stuff).

How can we compute numbers (embeddings) about graphs?

One way is to lay out each node('s embedding) as an unordered set and mix those numbers together with an inner product (possibly after passing each embedding through dense layers, possibly multiplying a computed probability by values — the self-attention layer). But the most important thing about graphs is connectivity, so we need to either have or compute extra "connectivity embeddings", and having one tensor per every possible path is infeasible, so unless we want a hacky solution that only works up to a fixed-but-nebulous depth such as natural language, we need another way to compute on graphs.

A graph is made from arrays, so to embed it, we can recurse and reduce estimates to one — OR remember an associated \`variable\`.

— Each string can be seen as an array of characters, each object as its \`deconstruct\`ion into an array.

— To \`reduce\` a sequence is to recursively separate it into an element and the rest of the sequence — OR just pick one element.
  This needs a basic function from two to one. (Those two can be \`concat\`enated into one tensor, to fit the connector architecture you've used.)
  (While there are functions that are symmetric in inputs (\`add\`, \`mul\`, maximum/minimum) and so recursion with them can be arranged to be as parallelizable as possible, functions in general don't have structure to be exploited.)
  For neural functions, we need to loop, left-to-right or right-to-left. We need what's called an RNN (recursive neural network).
  This would learn local patterns first, though only in one direction.
  But why limit it so? Bidirectional RNNs are more powerful. First loop left-to-right \`State0; State1\`→\`State1\`, then right-to-left \`State1; State2\`→\`State2\`, then we just pick out the left-most final result.
  But why limit it so? Composition is more powerful. An RNN takes a tensor array and a two-tensors-to-one func, and returns a tensor array. Sequence reversal is from array to array. Sequence-head is from array to its first element. And potentially more, like convolutions or self-attention. All we need is to be able to compose.

— For a primitive value, the only option is to remember its own embedding.
  (Of course, that is always an option for arrays too. The embedding could even be dependent on some string that the system would have to pick in serialization and react to it in parsing in order to have any memory between resets. A whole culture can be built around this weird quirk. Imagine having to spend a lot of your time on "good descriptive names for variables, functions, classes, objects, namespaces, concepts". Why would anyone do that? No one would be able to get anything done.)

— To embed graphs, we would also need to consider cycles, but…
  Why embed graphs, if we know that \`regenerate\` will create those graphs from embeddings?
  We still want to \`reduce\` embeddings to generate a call properly, but we have no need to re-estimate what's known.



Then, ⬜ test reducer (of arrays-of-embeddings) by approximating random strings and their embeddings (strings can have a per-character embedding, decided at \`dataset\` creation).
Then, ⬜ test embedder by approximating random embeddings of first random DAGs ⬜ then of random graphs, to be complete in our testing.

`,
    ],
    readAt:{
      selu:_(`selu`),
      dataset:_(`dataset`),
      embedderCreator:_(`embedderCreator`),
    },
  },

  selu:_([
    _(`concept`),
    new Map([
      [
        _(`call`),
        _([
          _(`func`),
          _(`input`),
          [
            _(`mul`),
            1.0507009873554805,
            [
              _(`where`),
              [
                _(`less`),
                0,
                _(`input`),
              ],
              _(`input`),
              [
                _(`mul`),
                1.6732632423543772,
                [
                  _(`expm1`),
                  _(`input`),
                ],
              ],
            ],
          ],
        ]),
      ],
      [
        _(`docs`),
        `\`selu:\\lambda*(where 0<? ? alpha*expm1(?)) lambda:1.0507009873554805 alpha:1.6732632423543772\`
Your next line is "Why would these random numbers be here?"
They were picked carefully by some math-savvy people {https://arxiv.org/abs/1706.02515} to make repeated applications converge to 0-mean 1-variance, which is very useful for putting "deep" in deep learning for feed-forward NNs (~10 layers).
A nice non-linearity.`,
      ],
      [
        _(`type`),
        [
          'Tensor',
          'Tensor',
        ],
      ],
    ]),
  ]),



  dataset:{
    docs:`\`dataset Options\`: a \`construct\` that can be called with a connection-creating function (that takes input and output sizes) to train a connection, returning the final loss (the loss should go down during training).
Allows testing that an embedding-to-embedding connection works for arbitrary numeric data (within reason).

\`Options\` is \`{ inputSize 10 inputFunc (0 1) outputSize 1 outputFunc (0 1) datasetSize 1024 batchSize 64 batches 1000 loss loss2 }\` by default.
\`inputFunc\` is \`(Mean StdDev)\` that are passed to \`truncatedNormal\` or a function that accepts an array of just \`inputSize\`. \`outputFunc\` is mean/stddev or a function of size and input.
Can also pass in the particular dataset as an array, with input/output tensors interleaved.`,
    serialize:2,
    construct(x, obj) {
      if (obj === undefined) {
        obj = function test(conner) {
          // Get connection, then compile the batch, then repeat the batch.
          let [conn, ls, btch] = interrupt(3)
          try {
            if (conn === undefined)
              conn = conner(test.inputSize, test.outputSize) || null,
              typeof conn != 'function' && error('Expected a function but got', conn)
            if (ls === undefined) {
              const qds = quote(defines(test, deconstruct)[2])
              // `last Predict … Predict null`, `conn(_datasetIn(dataset, N))=_datasetOut(dataset, N)  N:randomNat(dataset.'length'/2)`.
              //   Lack of repetitions is NOT ensured.
              ls = [last]
              for (let i=0; i < test.batchSize; ++i) {
                const index = [randomNat, test.datasetSize]
                ls.push([predicts, [conn, [_datasetIn, qds, index]], [_datasetOut, qds, index], test.loss])
              }
              ls.push(null)
            }
            if (btch === undefined)
              btch = [make(func, input, ls), null]
            repeat(btch, test.batches)
            return callAdjust.lastLoss // Return the average loss of the last batch.
              // (Not exactly, though: this number is set in a promise, which means that it's from a few epochs back or even from another job.)
          } catch (err) { if (err === interrupt) interrupt.stack.push(conn, ls, btch);  throw err }
        }
        const d = obj[defines.key] = Object.create(null)
        d[_id(deconstruct)] = [dataset, null, null]
        d[_id(argCount)] = 1
        return obj
      } else {
        let [ls, i] = interrupt(2)
        try {
          if (ls === undefined) {
            // Set the dataset.
            const dd = defines(obj, deconstruct)
            if (i === undefined) {
              [
                obj.inputSize=10, obj.inputFunc=[0,1],
                obj.outputSize=1, obj.outputFunc=[0,1],
                obj.datasetSize=1024, obj.batchSize=64, obj.batches=1000, obj.loss=loss2
              ] = _destructure(x[1], ['inputSize', 'inputFunc', 'outputSize', 'outputFunc', 'datasetSize', 'batchSize', 'batches', 'loss'])
              dd[1] = x[1]
              // Dispose of the old dataset, if any.
              _isArray(dd[2]) && dispose(dd[2])
              // Create the new dataset, or set to the input.
              if (_isArray(x[2])) return void(dd[2] = x[2])
              dd[2] = _allocArray(obj.datasetSize*2)
            }
            if (i === undefined) i = 0
            for (const inSzs = [obj.inputSize], outSzs = [obj.outputSize], arr = dd[2]; i < obj.datasetSize*2; ++i) {
              if (!(i & 1))
                arr[i] = _isArray(obj.inputFunc) ? truncatedNormal(inSzs, ...obj.inputFunc) : obj.inputFunc(inSzs)
              if (i & 1)
                arr[i] = _isArray(obj.outputFunc) ? truncatedNormal(outSzs, ...obj.outputFunc) : obj.outputFunc(inSzs, arr[arr.length-1])
            }
          }
        } catch (err) { if (err === interrupt) interrupt.stack.push(ls, i);  throw err }
      }
    },
  },

  _datasetIn:{
    call(dataset, n) { return keep(dataset[n<<1]) },
    interrupt:false,
    dispose:true,
  },

  _datasetOut:{
    call(dataset, n) { return keep(dataset[n<<1 | 1]) },
    interrupt:false,
    dispose:true,
  },

  merged:{
    docs:`\`merged Array\`: returns a copy of \`Array\` which is reference-equal to content-equal \`merged\` copies (and is read-only).
Maximize memory re-use.`,
    interrupt:false,
    call(a) {
      if (!_isArray(a)) error("Not an array:", a)
      // Construct a string of _id(a[i]).
      let b = _allocArray(a.length)
      for (let i=0; i < a.length; ++i)
        b[i] = _id(a[i]), b[i] = String.fromCharCode(b[i]>>>16 & 65535) + String.fromCharCode(b[i] & 65535)
      const s = b.join('');  _allocArray(b)
      // Find/store & return the merged array.
      if (!merged.a) merged.a = Object.create(null)
      if (!merged.fin && typeof FinalizationRegistry != ''+void 0)
        merged.fin = new FinalizationRegistry(s => delete merged.a[s])
      if (s in merged.a) return typeof WeakRef != ''+void 0 ? merged.a[s].deref() : merged.a[s]
      const copy = _allocArray(a.length)
      for (let i=0; i < a.length; ++i) copy[i] = a[i]
      Object.freeze(copy)
      merged.fin && merged.fin.register(copy, s)
      merged.a[s] = typeof WeakRef != ''+void 0 ? new WeakRef(copy) : copy
      return copy
    },
  },

  ArrayOps:{
    readAt:{
      transform:_(`transform`),
      reverse:_(`reverse`),
      reduce:_(`reduce`),
      getFirst:_(`getFirst`),
      getLast:_(`getLast`),
    },
  },

  transform:{
    docs:`\`(transform Array Function)\`→\`Array\`: transforms each element of \`Array\` by applying \`Function\`.
\`(transform (transform A F) G)\` is the same as \`(transform A \\(G (F ?)))\`.`,
    type:[
      'Array',
      'Array',
      'function',
    ],
    examples:[
      [
        `(transform (array 1 2 3 4 5 6) \\?+2)`,
        `3 4 5 6 7 8`,
      ],
    ],
    argCount:2,
    call(a,f) {
      if (!_isArray(a)) error("Expected an array but got", a)
      if (typeof f != 'function') error("Expected a function but got", f)
      let [result = _allocArray(a.length), i = 0] = interrupt(2)
      try {
        for (; i < a.length; ++i)
          result[i] = f(a[i])
        return result
      } catch (err) { if (err === interrupt) interrupt.stack.push(result, i);  throw err }
    },
    dispose:_(`_disposeEachAndDealloc`),
    adjust:[
      _(`array`),
      undefined,
      [
        {
          call(a, f, out, dout) {
            let [dresult = _allocArray(a.length), i = a.length] = interrupt(2)
            try {
              for (; i > 0; --i) {
                const ins = _allocArray(1); ins[0] = a[i-1]
                const dins = adjust(f, ins, out[i-1], dout[i-1])
                _allocArray(ins)
                if (!_isArray(dins) || dins.length != 1) errorStack('bad adj', dins)
                dresult[i-1] = dins[0], _allocArray(dins)
              }
              return dresult
            } catch (err) { if (err === interrupt) interrupt.stack.push(dresult, i);  throw err }
          },
          dispose:_(`_disposeEachAndDealloc`),
        },
        _(`_inA`),
        _(`_inB`),
        _(`_out`),
        _(`_dout`),
      ],
    ],
    mergeAdjustment:[
      _(`_mergeArrays`),
      null,
    ],
  },

  reverse:{
    docs:`\`reverse Array\`→\`Array\`.`,
    type:[
      'Array',
      'Array',
    ],
    argCount:1,
    call(arr) {
      const n = arr.length, brr = _allocArray(n)
      for (let i=0; i < n; ++i) brr[i] = keep(arr[n-1 - i])
      return brr
    },
    dispose:_(`_disposeEachAndDealloc`),
    interrupt:false,
    adjust:[
      _(`array`),
      [
        _(`reverse`),
        _(`_dout`),
      ],
    ],
    mergeAdjustment:_(`_mergeArrays`),
  },

  reduce:{
    docs:`\`reduce Array Accumulator Initial\`→\`Array\`: loops over the array left-to-right, setting \`Output.i\` to \`Accumulator(where 0<i Output.(i-1) Initial,Array.i)\` then returning \`Output\`.

This returns the whole array of all results, to facilitate adjustment and composition.
Use \`getLast\` to get the standard behavior of returning one element.`,
    type:[
      'Array',
      'Array',
      'function',
      'Tensor',
    ],
    examples:[
      [
        `reduce (array 3 4 5 7) mul 1`,
        `3 12 60 420`,
      ],
    ],
    call(a, f, initial = 0) {
      if (!_isArray(a)) error("Expected an array but got", a)
      if (typeof f != 'function') error("Expected a function but got", f)
      // This is a formulation without overwritten values, which we can adjust.
      let [outs = _allocArray(a.length), i = 0] = interrupt(2)
      try {
        for (; i < a.length; ++i)
          outs[i] = f(i ? outs[i-1] : initial, a[i])
        return outs
      } catch (err) { if (err === interrupt) interrupt.stack.push(outs, i); else _disposeEachAndDealloc(outs);  throw err }
    },
    dispose:_(`_disposeEachAndDealloc`),
    adjust(ins, out, dout) {
      // Reverse the forward pass.
      const [a, f, initial] = ins
      let [da = _allocArray(a.length), douts = _allocArray(a.length), i = a.length-1] = interrupt(3)
      douts[douts.length-1] = dout
      try {
        let dinitial
        for (; i >= 0; --i) {
          const ins = _allocArray(2); ins[0] = i ? out[i-1] : initial, ins[1] = a[i]
          const dins = adjust(f, ins, out[i], douts[i])
          _allocArray(ins)
          if (!_isArray(dins) || dins.length != 2) errorStack('bad adj', dins)
          if (i) [douts[i-1], da[i]] = dins
          else [dinitial, da[i]] = dins
          _allocArray(dins)
        }
        const arr = _allocArray(3)
        arr[0] = da, arr[2] = dinitial
        return arr
      } catch (err) { if (err === interrupt) interrupt.stack.push(da, douts, i); else _disposeEachAndDealloc(da), _disposeEachAndDealloc(douts);  throw err }
    },
    mergeAdjustment:[
      _(`_mergeArrays`),
      null,
      _(`_mergeTensors`),
    ],
  },

  getFirst:{
    docs:`Given an array, returns its first item.`,
    type:[
      'Tensor',
      'Array',
    ],
    argCount:1,
    call(arr) {
      if (!_isArray(arr)) error("Not an array:", arr)
      if (call.pure) throw impure
      return keep(arr[0])
    },
    dispose:true,
    interrupt:false,
    adjust:[
      _(`array`),
      [
        _(`array`),
        _(`_dout`),
      ],
    ],
    mergeAdjustment:_(`_mergeArrays`),
  },

  getLast:{
    docs:`Given an array, returns its last item.`,
    type:[
      'Tensor',
      'Array',
    ],
    argCount:1,
    call(arr) {
      if (!_isArray(arr)) error("Not an array:", arr)
      if (call.pure) throw impure
      return keep(arr[arr.length-1])
    },
    dispose:true,
    interrupt:false,
    adjust(ins, out, dout) {
      // Way less efficient than `getFirst`'s adjustment.
      const darr = _allocArray(ins[0].length)
      darr[darr.length-1] = keep(dout)
      return [darr]
    },
    mergeAdjustment:_(`_mergeArrays`),
  },
















  adjustLater:{
    docs:`\`adjustLater Func Inputs\`→\`(Result AdjustInfo)\`: look, just read what's to the left, I'm tired of explaining it.
\`AdjustInfo\` is for \`adjustNow\`. \`Inputs\` can be undefined or be an array.

A function \`defines\` this to be \`true\` to make \`autograd\` always call its \`adjust\` definition, even if no one cares about it.`,
    dispose(rai) { dispose(rai[0]), defines(adjustSave, _cancel)(rai[1]), _allocArray(rai) },
    call(fun, ins) {
      let [adjInfo = _allocArray(0), predictsHappened = false] = interrupt(2)
      const env = call.env, ias = _id(adjustSave), ial = _id(adjustLoad)
      const prevAdjSave = env[ias];  env[ias] = adjInfo
      const prevAdjLoad = env[ial];  env[ial] = undefined
      const prevPredHap = predicts.happened;  predicts.happened = predictsHappened
      try {
        const result = !ins ? fun() : fun(...ins)
        if (!predicts.happened)
          defines(adjustSave, _cancel)(adjInfo), adjInfo = null
        const a = _allocArray(2); a[0] = result, a[1] = adjInfo
        return a
      } catch (err) { if (err === interrupt) interrupt.stack.push(adjInfo, predicts.happened); else defines(adjustSave, _cancel)(adjInfo);  throw err }
      finally {
        env[ias] = prevAdjSave
        env[ial] = prevAdjLoad
        predicts.happened = prevPredHap
      }
    },
  },

  adjustNever:{
    docs:`\`adjustNever Func Ins\`→\`Result\`: calls a function, which will never be \`adjust\`ed.
\`Ins\` is either undefined or an array of inputs.`,
    dispose:true,
    call(fun, ins) {
      const env = call.env, ias = _id(adjustSave), ial = _id(adjustLoad)
      const prevAdjSave = env[ias];  env[ias] = undefined
      const prevAdjLoad = env[ial];  env[ial] = undefined
      const prevPredHap = predicts.happened
      try {
        return !ins ? fun() : fun(...ins)
      } finally {
        env[ias] = prevAdjSave
        env[ial] = prevAdjLoad
        predicts.happened = prevPredHap
      }
    },
  },

  adjustNow:{
    docs:`\`adjustNow AdjustInfo AdjustFunc Inputs Output OutputChange\`: performs the adjustment step to improve \`predicts\`ions. (Don't twitch your eye like that.)
\`OutputChange\` is usually \`0\` (\`predicts\` inside should give gradients anyway). \`Inputs\` can be undefined.`,
    call(adjInfo, fun, ins, out, dout = 0) {
      if (!_isArray(adjInfo) || typeof fun != 'function') return null
      const env = call.env, ias = _id(adjustSave), ial = _id(adjustLoad)
      const prevAdjSave = env[ias];  env[ias] = undefined
      const prevAdjLoad = env[ial];  env[ial] = adjInfo
      try {
        const dins = fun(ins, out, dout)
        if (dins !== undefined && (!_isArray(dins) || dins.length))
          error("Expected an empty array or undefined, got", dins)
        dins && _allocArray(dins)
        if (adjInfo.length) {
          const copy = adjInfo.map(arr => arr.slice())
          error("Inexact reversal; didn't load", ...copy)
        }
      } catch (err) { if (err !== interrupt) defines(adjustLoad, _cancel)(adjInfo);  throw err }
      finally {
        env[ias] = prevAdjSave
        env[ial] = prevAdjLoad
      }
    },
  },



  _once:{
    docs:`\`(_once Func)\`: a \`construct\` for functions with zero args that makes them only be called and adjusted once (makes it cheaper).`,
    argCount:1,
    construct(x, obj) {
      if (x.length != 2) error('Expected one arg, got', x)
      if (obj === undefined) {
        obj.fun = obj.out = obj.usedCount = obj.dout = obj.info = 0
        onAdjust.obj = obj
        const d = obj[defines.key] = Object.create(null)
        d[_id(deconstruct)] = _allocArray(x.length)
        d[_id(argCount)] = 0
        d[_id(dispose)] = true

        d[_id(adjust)] = onAdjust
        d[_id(adjustLater)] = true
        Object.freeze(d)
        return obj

        function obj() {
          if (!call.env || !call.env[_id(adjustSave)]) return obj.fun()
          if (obj.info !== 0) {
            obj.info && defines(adjustSave, _cancel)(obj.info)
            dispose(obj.dout), obj.usedCount = obj.dout = obj.info = 0
          }
          if (!obj.usedCount) {
            const a = adjustLater(obj.fun)
            const [result, adjInfo] = a;  _allocArray(a)
            obj.info = adjInfo
            return ++obj.usedCount, obj.out = result
          } else
            return ++obj.usedCount, keep(obj.out)
          // (.fun, .out, .usedCount, .dout, .info)
        }
        function onAdjust(ins, out, dout) {
          const obj = onAdjust.obj
          if (!obj.usedCount) {
            adjustNow(obj.info, _adjustFunc(obj.fun), undefined, undefined, obj.dout)
            dispose(obj.dout), obj.usedCount = obj.dout = obj.info = 0
          } else {
            const prevD = obj.dout
            obj.dout = add(obj.dout, dout), dispose(prevD)
            --obj.usedCount
          }
        }
      } else {
        if (!_funcAdjust(x[1])) error('Expected a func with a function-based adjustment, got', x[1])
        obj.fun = x[1]
        defines(obj, deconstruct).length=0, defines(obj, deconstruct).push(...x)
      }
    },
  },

  embedderCreator:{
    docs:`A creator of simple embedders (functions from nothing to an embedding: a statically-stored \`variable\` numeric tensor).`,
    call(sz) { return make(_once, make(func, make(randomVar, identity, sz))) },
  },

  genContexts:{
    docs:`\`(genContexts FuncsOrNodes FeatureSize EmbedderCreator)\`→\`(FuncContext ValueContext)\`: creates generative contexts of global (non-generated) functions.
\`EmbedderCreator\` is \`embedderCreator\` by default. It mustn't \`interrupt\`.
\`argCount\` of each function must be fixed.

Every generative context is formatted like \`(AreAllTheseCalls …? Value Type Embedder …?)\`.`,
    call(arr, FeatureSize = 256, EmbedderCreator = embedderCreator) {
      if (!_isArray(arr) || !arr.length) error("Expected a non-empty array, got", arr)
      if (typeof FeatureSize != 'number') error("Not a number:", FeatureSize)
      const ctxF = _allocArray(1), ctxN = _allocArray(1)
      ctxF[0] = true, ctxN[0] = false
      for (let i=0; i < arr.length; ++i) {
        const f = arr[i]
        if (f === null) error("Not permitted:", f) // Fails in `getDAG` now cannot be faked by bad data.
        if (typeof f == 'function' || !_isArray(f) && typeof defines(f, construct) == 'function') {
          const args = defines(f, argCount)
          if (typeof args != 'number' || args !== args>>>0) error("Arg count must be fixed, got", f)
          // `Type` is the `type` array's head (or `undefined`).
          const ft = defines(f, type), Type = _isArray(ft) ? ft[0] : typeof ft != 'function' ? ft : undefined
          if (_isArray(ft) && ft.length+1 != args) error("Arg count and arg types length must match:", args, ft)
          else if (typeof ft != 'function') error("Type must be computed to generate calls, got", ft, "by", f)
          // Put func as func. Output/inputs embedders are made.
          const embs = []
          embs.push(EmbedderCreator(FeatureSize)) // `UsedAs`
          for (let i=0; i < args; ++i)
            embs.push(EmbedderCreator(FeatureSize)) // `UsedIn`
          ctxF.push(f, Type, embs)
          // Put func as value. A new primitive embedder is made, which doesn't mirror higher-order type refinement, but is easy.
          ctxN.push(f, [funcType, ...Type.slice(1), Type[0]], EmbedderCreator(FeatureSize))
        } else {
          // A naked value has no type, and can be put literally anywhere.
          const Type = undefined, emb = EmbedderCreator(FeatureSize)
          ctxN.push(f, Type, emb)
        }
      }
      const a = _allocArray(2); a[0] = ctxF, a[1] = ctxN; return a
    },
  },

  _input:{
    docs:`This returns the same unique object for the same \`n\`.`,
    call(n) { return (_input.o || (_input.o = []))[n] || (_input.o[n] = {n}) },
  },

  makeAutoFunc:{
    docs:`\`makeAutoFunc(Types,GenContexts,FeatureSize,EmbedderCreator,OuterCtxF,OuterCtxN)\`: makes \`autoFunc\`s that can be passed to \`regenerate\`.
\`EmbedderCreator\` is \`embedderCreator\` by default, \`OuterCtxF\` and \`OuterCtxN\` do not have to be passed in.

Could be used to create many \`autoFunc\`s that know-of and use and adapt-to each other by calling with the same \`OuterCtxF\` and \`OuterCtxN\`.`,
    call(WithTypes, GenContexts, FeatureSize, EmbedderCreator = embedderCreator, OuterCtxF = null, OuterCtxN = null) {
      if (!_isArray(WithTypes)) error("Expected an array of types, got", WithTypes)

      // Embedders of output then input.
      const Used = WithTypes.map(() => EmbedderCreator(FeatureSize))

      // Know of the func's own inputs.
      const InnerCtxN = [false]
      for (let i = 1; i < WithTypes.length; ++i) InnerCtxN.push(_input(i), WithTypes[i], Used[i])

      // Make the func object.
      const allCtxs = GenContexts ? [...GenContexts, InnerCtxN] : [InnerCtxN]
      const x = [autoFunc, '<generated body>', WithTypes, Used, ...allCtxs]
      const fn = construct(x)

      if (OuterCtxF)
        // Inputs inside are passed from outside, and output is returned from inside to outside.
        OuterCtxF[0] !== true && error("Must actually be a context of calls, got", OuterCtxF),
        OuterCtxF.push(fn, WithTypes[0], Used)

      if (OuterCtxN)
        // Nothing to reflect the semantics of, so this embedding is unique to this context. No higher-order stuff.
        OuterCtxN[0] !== false && error("Must actually be a context of nodes, got", OuterCtxN),
        OuterCtxN.push(fn, typeof fn, EmbedderCreator(FeatureSize))

      construct(x, fn)
      return fn
    },
  },

  autoFunc:{
    docs:`For internal use.
\`(autoFunc Body Types Embedders …GenContexts)\`: a function with an automatically-\`regenerate\`d \`Body\`.
Its usage is guided by human-defined \`Types\` and machine-learned \`Embedders\`.

Does everything to reflect semantics of \`func\`s in neural computations: function inputs are passed in, and output is returned. Both {input and output} \`Embeddings\` guide generation both {outside and inside} the func (\`UsedIn\` passed to \`_getDAG\`, and \`UsedAs\` embeddings of the function or its input nodes). Same goes for \`Types\`.

All \`GenContexts\` are arrays \`(AreAllTheseCalls …? Value Type Embedder …?)\`. It is possible to have many contexts at once, to eliminate copying at regeneration. A function appears in two contexts, one as a call and one as a node, with the same \`Value\` but different \`Type\`/\`Embedder\`.`,
    readAt:{
      make:_(`makeAutoFunc`),
    },
    construct(x, obj) {
      if (x.length < 4) error("Too few args in", x)
      if (obj === undefined) {
        obj = _fallthroughFunc(x[2].length-1)

        const d = obj[defines.key] = Object.create(null)
        d[_id(deconstruct)] = _allocArray(x.length)
        d[_id(argCount)] = x[2].length-1

        d[_id(mergeAdjustment)] = _mergeTensors // Just assume that every arg is a tensor.
        d[_id(adjust)] = [_adjustFunc, obj, _ins, _dout] // Don't ever inline adjustment.
        d[_id(adjustLater)] = true // Just assume that some nodes would need adjustment.
        d[_id(dispose)] = true // Just assume that the output is a singular tensor.
        d[_id(adjustSave)] = true // Just assume that all inputs are used.
        Object.freeze(d)
        return obj
      } else {
        if (x[2].length !== x[3].length) error("Lengths of Types and Embeddings mismatch:", x[2], x[3])
        // The rest is more-or-less copied from `func`.
        const d = obj[defines.key], dd = d[_id(deconstruct)]
        if (d[_id(argCount)] !== x[2].length-1)
          error("Cannot change arg-count from", d[_id(argCount)], "to", x[2].length-1)
        dd.length=0, dd.push(...x)

        const inputs = _allocMap()
        for (let i = 1; i < x[2].length; ++i) inputs.set(_input(i), i)
        let [poIndRc = _postorderInfo(x[1], inputs)] = interrupt(1)
        try {
          obj.a = _compileAutograd(poIndRc, inputs)
          obj.f = _compileBody(x[1], inputs, poIndRc)
        } catch (err) {
          if (err === interrupt) interrupt.stack.push(poIndRc), poIndRc = null
          throw err
        } finally { _allocMap(inputs), poIndRc && defines(_postorderInfo, dispose)(poIndRc) }
      }
    },
  },

  // ⬜ `regenerate(AutoFunc, DownEmbedding, UpReducer, GoalPredictor, Goal, MaxDepth)`—>`AdjustInfo` and the (overridable) inner function that it recurses with, `_getDAG(Type, UsedIn=0, Embedding=0)`—>`(Type, DAG, Embedding)`.
  regenerate:{
    /*
      TODO: docs.
        (`GenContexts`/`getDAG.'ctxs'` is an array of contexts, copied from AutoFunc but with one new array at the end.)
          (All contexts are arrays `(AreAllTheseCalls, …, Value, Type, Embedder, …)`. It's possible to have many contexts at once, to eliminate all the copying. A function appears in two contexts, one as a call and one as a value, with the same Value but different Type/Embedder.)
        (`GoalPredictor` is the goal-predicting function `(Goal, UsedAs, UsedIn, DownEmbedding)`—>`(GoalPrediction, DownerEmbedding)`; it's supposed to do `result=Goal`. Typed smth like `(productType 'Number' 'Tensor') 'Future' 'Tensor' 'Tensor' 'Tensor'`.)
        (`Goal` is the `future()` that `GoalPredictor` `predicts`. It should be set after calling but before adjusting `regenerate`. The embedding of the function that computes `Goal` could be passed in as `DownEmbedding` for more salience.)
    */
    readAt:{
      getDAG:_(`getDAG`),
    },
    call(AutoFunc, DownEmbedding, Goal, GoalPredictor, UpReducer) {
      // TODO: const dec = defines(AutoFunc, deconstruct)
      // TODO: const Type = dec[2][0], UsedAs = dec[3][0], GenContexts = dec.slice(4)
      // TODO: const arr = adjustLater(getDAG, [UsedAs?, DownEmbedding, Type?, GenContexts?, Goal, GoalPredictor, UpReducer])
      // TODO: const [result, adjustInfo] = arr; _allocArray(arr)
      // TODO: Set func body (dec[1]) (which can interrupt) and return adjustInfo.
      // …Should this function even be a separate thing? Shouldn't we have some way for, say, a type to tell how it wants to be re-generated (as a concept, or as a DAG, or as a function like here, etc)?
    },
  },

  getDAG:{
    docs:`\`getDAG UsedIn DownEmbedding DownType GenContexts Goal GoalPredictor UpReducer MaxDepth MaxNodes\`→\`(UpEmbedding DAG UpType)\`
Generates a Directed Acyclic Graph from what is available in \`GenContexts\` (likely created by \`genContexts\`).
This DAG contains up to \`MaxNodes\` (\`100\` by default) array nodes, and is up to \`MaxDepth\` nodes deep (\`10\` by default).
The generation is guided by a human-specified \`DownType\`→\`UpType\` and a machine-learned \`UsedIn\`/\`DownEmbedding\`→\`UpEmbedding\`.

(While you're here, check \`\`settings ^_whetherToColorVariables\`\` and re-summon this description.)

This is a user-study of all possible users of our DAG IR, and a guide.
We need types to not waste time generating invalid programs, but they are not enough.
We need machine learning to replace random choices (a big no-no) with intelligent choices (a big oh-yes).

Generation proceeds top-down with \`GoalPredictor\` then bottom-up with \`UpReducer\`, fully \`adjust\`able. (This embedding exactly mirrors the refinement of types.)
\`Goal\` is the \`future\` that \`GoalPredictor\` \`predicts\`. (For example, it's set to the resulting func's runtime, after \`getDAG\`.)
- Types filter out available choices from \`GenContexts\`, with \`typeRefine\`. If none are left at any point, the whole generation fails, returning \`null\` for \`DAG\` & \`UpType\` (meaning that with this implementation, types should only be loose suggestions; of course, machine learning can learn to avoid fails, but still).
- \`GoalPredictor(Goal,UsedAs,UsedIn,DownEmbedding)\`→\`(GoalPrediction DownerEmbedding)\` is used to choose the best-\`GoalPrediction\` among many choices. \`UsedAs\` is the func's embedding in \`GenContexts\`, \`UsedIn\`/\`DownEmbedding\` are passed in from the current \`getDAG\`.
- Then, if it chose to make a call, recurse for each arg. \`UsedIn\` is the arg's embedding (in \`GenContexts\`), \`DownEmbedding\` is the chosen \`DownerEmbedding\`.
  - And, if the func defines \`construct\`, construct it at generation-time.
- \`UpReducer(UpEmbeddings)\`→\`UpEmbedding\`: turns an array of embeddings of func-then-args into one embedding, so that numeric computations can continue. (For example, a simple RNN: use \`getLast\` on \`reduce\`, which does \`matMul\` of \`concat\` of inputs by a \`variable\` weights matrix. Or sum/min/max/avg, bidirectional RNN, self-attention…)

This implementation should allow funcs to return/accept funcs, but embeddings of funcs-as-values (decided in \`genContexts\`) are unique. This doesn't mirror higher-order type inference (it'd need to compute from inputs/output embeddings) but it is easier.
It's slow: the time complexity is \`O(Nodes·(ContextItems·(OutputTypeRefinement+GoalPredictor)+UpReducer))\` assuming that types don't filter out much (just imagine that these are one-letter variables, and we describe what they are afterwards).

The outer \`getDAG\` has \`DownEmbedding\`/\`UpEmbedding\` which do not end in \`predicts\` by themselves (\`UsedIn\` should be static — the \`UsedAs\` embedding of the generated function). Ways to give them gradient should be devised for salience (such as exposing "get that" funcs to generation).



How could this potentially be integrated for human use?
First is type inference for all programs and not just those generated here. \`contextMenu\` should be able to show it per-node, and each non-filled hole in a partially-created program should give a list of what functions/values are allowed here by types (program editing \`2.0\`, which is much slower than just typing text and thus worse).
Second is embedding DAGs for all programs and not just those generated here. Bunches-of-numbers are not interpretable directly, but we can project them into a low-dimensional space (such as red/green/blue color components of a node) and cluster them, and/or give the "all nodes in parsing of this should be of this color" interface to the human for highlighting semantic similarities (syntax highlighting \`2.0\`).
Third is giving appropriate goals to embeddings, and saving embeddings (software \`2.0\`). But those have to be done regardless of human interactivity.`,
    call(UsedIn, DownEmbedding, Type, GenContexts, Goal, GoalPredictor, UpReducer, MaxDepth = 10, MaxNodes = 100) {
      // All GenContexts are arrays `(AreAllTheseCalls, …, Value, Type, Embedder, …)`.
      //   It's possible to have many contexts at once, to eliminate all the copying.
      //   A function appears in two contexts, one as a call and one as a value, with the same Value but different Type/Embedder.
      if (getDAG.CurDepth !== undefined)
        error("Cannot call getDAG inside getDAG")
      if (!_isArray(GenContexts)) error("Expected an array of contexts, got", GenContexts)
      if (typeof GoalPredictor != 'function') error("Expected a mostly-numeric function, got", GoalPredictor)
      if (typeof UpReducer != 'function') error("Expected a tensor-array-reducing function, got", UpReducer)

      // Add two temporary contexts at the end, one for calls and one for nodes. It's how we generate DAGs and not trees.
      let [ctxs = GenContexts ? [...GenContexts, [true], [false]] : [[true], [false]]] = interrupt(1)
      try {
        getDAG.CurDepth = 0, getDAG.MaxDepth = MaxDepth, getDAG.MaxNodes = MaxNodes
        getDAG.GenContexts = ctxs, getDAG.Goal = Goal, getDAG.GoalPredictor = GoalPredictor, getDAG.UpReducer = UpReducer
        return _getDAG(UsedIn, DownEmbedding, Type)
      } catch (err) { if (err === interrupt) interrupt.stack.push(ctxs);  throw err }
      finally {
        getDAG.CurDepth = getDAG.GenContexts = getDAG.UpReducer = getDAG.GoalPredictor = getDAG.Goal = undefined
      }

      // .CurDepth, .MaxDepth, .MaxNodes, .GenContexts, .UpReducer, .GoalPredictor, .Goal
    },
    adjust(ins, out, dout) {
      if (getDAG.CurDepth !== undefined)
        error("Cannot adjust getDAG while adjusting getDAG")
      const [UsedIn, DownEmbedding, Type, GenContexts, Goal, GoalPredictor, UpReducer, MaxDepth = 10, MaxNodes = 100] = ins
      let [ctxs = GenContexts ? [...GenContexts, [true], [false]] : [[true], [false]]] = interrupt(1)
      try {
        getDAG.CurDepth = 0, getDAG.MaxDepth = MaxDepth
        getDAG.GenContexts = ctxs, getDAG.Goal = Goal, getDAG.GoalPredictor = GoalPredictor, getDAG.UpReducer = UpReducer
        return adjust(_getDAG, [UsedIn, DownEmbedding, Type], out, dout)
      } catch (err) { if (err === interrupt) interrupt.stack.push(ctxs);  throw err }
      finally {
        getDAG.CurDepth = getDAG.GenContexts = getDAG.UpReducer = getDAG.GoalPredictor = getDAG.Goal = undefined
      }
    },
  },

  _filterContextsWithType(ctxs, Type, allowCalls = true) {
    // Returns `(… ContextIndex ItemIndex …)`. The refined type is not preserved.
    let [fits = _allocArray(0), i = 0, j = 1] = interrupt(3)
    try {
      // A context is `(AreAllTheseCalls … Value Type Embedder …)`.
      for (; i < ctxs.length; ++i) {
        const ctx = ctxs[i]
        if (ctx[0] && !allowCalls) continue
        for (; j < ctx.length; j += 3) {
          if (typeRefine(Type, ctx[j+1]) !== null)
            fits.push(i, j)
        }
        j = 1
      }
      return fits
    } catch (err) { if (err === interrupt) interrupt.stack.push(fits, i, j);  throw err }
  },

  _getDAG:{
    docs:`For internal use, by \`getDAG\`.
Gets/generates the DAG node from static & dynamic embeddings and dynamic type, with some extra parameters passed in by object props (to not take up space on the call stack).

A function \`defines\` this with an array of types to override the choosing-from-contexts with "give me a call with output/inputs typed like this".`,
    call(UsedIn = 0, DownEmbedding = 0, DownType) { // → (UpEmbedding DAG UpType)
      if (_isArray(DownType) && DownType[0] === quote) return [keep(DownEmbedding), DownType[1], DownType]
      if (typeof getDAG.CurDepth != 'number')
        error("Do not call this directly")
      ++getDAG.CurDepth
      const ctxs = getDAG.GenContexts
      let [fits, UsedAs, k=0, i=0, GoalPred, DownerEmb, AdjInfo, j, Emb, Node, Type, CallTypes, CallEmbs] = interrupt(13)
      try {
        if (UsedAs === undefined) {
          if (_isArray(DownType) && typeof defines(DownType, _getDAG) == 'function') {
            // Instead of picking from context, generate each in the returned type array to make a call instead.
            //   (UsedIn/DownEmbedding are simply copied for each item, which may not be the best idea.)
            CallTypes = defines(DownType, _getDAG)(DownType)
            if (!_isArray(CallTypes)) error("Expected an array of types from which to make a call, got", CallTypes)
            Node = _allocArray(CallTypes)
            DownerEmb = DownEmbedding, AdjInfo = null
            CallEmbs = _allocArray(CallTypes.length)
            for (i=0; i < CallEmbs.length; ++i)
              CallEmbs[i] = keep(UsedIn)
            j = 0, k = CallEmbs.length, i = 1
            UsedAs = null
          }

          // Filter GenContexts with `DownType`, into `(… ContextIndex ItemIndex …)`.
          if (UsedAs === undefined) {
            if (fits === undefined)
              fits = _filterContextsWithType(ctxs, DownType, getDAG.CurDepth < getDAG.MaxDepth && ctxs[ctxs.length-1].length < getDAG.MaxNodes)
            if (!fits.length) return _allocArray(fits), [DownEmbedding, null, null] // Fail.
            UsedAs = _allocArray(fits.length>>>1)
          }
        }
        if (UsedAs !== null) {
          // Compute embeddings to pass to `GoalPredictor`.
          for (; k < fits.length; k += 2) {
            const i = fits[k], j = fits[k+1]
            let emb = ctxs[i][j+2]
            if (_isArray(emb)) emb = emb[0]
            UsedAs[k>>>1] = _isDisposable(emb) ? emb : emb()
            // `emb` could be an embedding, or an embedding-returning func,
            //   or an array of embedding-returning funcs with the head being output's.
          }

          // Choose the option, by maximizing GoalPrediction, and cancelling adjustments of non-max branches.
          //   (Note: using `stack` would have made this significantly faster. Why not? …Uhh, no premature optimization.)
          //   (Also note: outputting "the option we want" embedding and doing k-nearest-neighbors search (and only selecting from those with `GoalPredictor`) would have been significantly faster too.)
          if (GoalPred === undefined)
            GoalPred = _allocArray(UsedAs.length), DownerEmb = _allocArray(UsedAs.length), AdjInfo = _allocArray(UsedAs.length)
          for (; i < UsedAs.length; ++i) {
            // (Lots of glue code for `[[GoalPred[i], DownerEmb[i]], AdjInfo[i]] = adjustLater(GoalPredictor, [Goal, UsedAs[i], UsedIn, DownEmb])`.)
            const ins = _allocArray(4);  [ins[0], ins[1], ins[2], ins[3]] = [getDAG.Goal, UsedAs[i], UsedIn, DownEmbedding]
            const arr = adjustLater(getDAG.GoalPredictor, ins);  _allocArray(ins)
            let result;  [result, AdjInfo[i]] = arr;  _allocArray(arr)
            if (!_isArray(result) || result.length != 2) error("Expected exactly 2 tensors but got", result)
            ;[GoalPred[i], DownerEmb[i]] = result;  _allocArray(result)
            if (typeof GoalPred[i] != 'number') if (!_isDisposable(GoalPred[i]) || GoalPred[i].size !== 1)
              error("Expected a scalar tensor but got", GoalPred[i])
          }
          if (i === UsedAs.length) { // Then do things that can't interrupt.
            // Dispose of those now-useless tensors in `UsedAs` which were computed by us (can't interrupt).
            for (k=0; k < fits.length; k += 2) {
              const i = fits[k], j = fits[k+1]
              let emb = ctxs[i][j+2]
              if (_isArray(emb)) emb = emb[0]
              !_isDisposable(emb) && dispose(UsedAs[k>>>1])
            }
            // Don't come near me or my son ever again.
            UsedAs = null // (This also makes us free to re-use `i`/`k` in an interruptible loop.)
            // Sync & CPU argmax & cancel non-max.
            let maxI = 0
            for (i=0; i < GoalPred.length; ++i) {
              const t = GoalPred[i];  GoalPred[i] = sync(t);  dispose(t)
              if (GoalPred[i] > GoalPred[maxI])
                dispose(DownerEmb[maxI]), defines(adjustSave, _cancel)(AdjInfo[maxI]), GoalPred[maxI] = DownerEmb[maxI] = AdjInfo[maxI] = null,
                maxI = i
              else
                dispose(DownerEmb[i]), defines(adjustSave, _cancel)(AdjInfo[i]), GoalPred[i] = DownerEmb[i] = AdjInfo[i] = null
            }
            // De-array, leave only the picked option.
            GoalPred = null, DownerEmb = DownerEmb[maxI], AdjInfo = AdjInfo[maxI]
            // Determine whether-call & option & type/s & embedding/s.
            const ami = fits[maxI*2], amj = fits[maxI*2+1]
            if (ctxs[ami][0]) j = 0
            Emb = ctxs[ami][amj+2], Node = ctxs[ami][amj], Type = ctxs[ami][amj+1]
            _allocArray(fits), fits = null
            i = 0
          }
        }

        if (typeof j == 'number') {
          // Get the types to generate.
          if (i === 0) {
            if (!_isArray(Emb))
              error("Embeddings of a call must be an array, got", Emb, "at node", Node)
            CallTypes = type(Node, DownType)
            if (!_isArray(CallTypes)) error("CallTypes must be an array, got", CallTypes)
            if (CallTypes.length != Emb.length) error("Expected", Emb.length, "args to generate but need", CallTypes)
            const fun = Node;  Node = _allocArray(Emb.length);  Node[0] = fun
            CallEmbs = _allocArray(Emb.length)
            j = 0, k = 0, i = 1
          }
          // Generate each arg.
          for (; k < CallEmbs.length; ++k)
            // Compute static embeddings.
            CallEmbs[k] = Emb[k]()
          for (; j < Emb.length; ++j) {
            if (Node[j] !== undefined) continue
            const arr = _getDAG(CallEmbs[j], DownerEmb, CallTypes[j])
            let GotEmb, GotType;  [GotEmb, Node[j], GotType] = arr;  _allocArray(arr)
            dispose(CallEmbs[j]), CallEmbs[j] = GotEmb
            // If arg failed, we fail too.
            //   (Alternatives could be re-picking func (re-picking arg is useless, because there is no randomness) or putting `null` into the DAG.)
            if (GotType === null) return [CallEmbs[j], null, null]
          }
          Type = CallTypes[0], j = 'a'
        } else if (j === undefined) {
          Emb = DownerEmb
        }

        // Reduce generated embeddings into one.
        if (j === 'a') Emb = getDAG.UpReducer(CallEmbs), CallEmbs.forEach(dispose), CallEmbs = null, j = 'b'
        // `construct` if defined by the call.
        if (j === 'b' && defines(Node, construct)) k = construct(Node), j = 'c'
        if (j === 'c') construct(Node, k), Node = k, k = null, j = 'd'

        // Remember for later. …We'll be erasing this immediately after `getDAG`.
        if (_isArray(Type) && _isArray(Type[0]) && Type[0][0] === funcType)
          ctxs[ctxs.length-2].push(Node, Type, Emb)
        else
          ctxs[ctxs.length-1].push(Node, Type, Emb)

        // …`AdjInfo` is not used. Adjustment could use that.
        return [Emb, Node, Type]
      } catch (err) { if (err === interrupt) interrupt.stack.push(fits, UsedAs, k, i, GoalPred, DownerEmb, AdjInfo, j, Emb, Node, Type, CallTypes, CallEmbs);  throw err }
        // And TODO: On non-interrupt error, dispose of all the things. …And maybe on normal return too??
        //   (…Or maybe preserve some/all to adjustment, and we can't know which until we make adjustment…)
      finally { --getDAG.CurDepth }
    },
    adjust(ins, out, dout) {
      // TODO: Have an adjustment func that goes in exact reverse of the above (possibly relying on the returned `DAG` not having changed), giving adjustments to embedders/connections/reducers immediately.
      // …What do we do?… Maybe a plan first, going in exact reverse of `call`'s plan?
    },
  },

  Types:{
    // …Should we have a tutorial? How to specify types of functions, how to generate properly-typed DAGs… It DOES sound useful.
    tutorial:[
      // …Or should we have `examples` instead? …Eh, easily switched.
      `It's always a good idea to take your time to know what words mean.

Types…

The chirping of crickets in a meadow over a darkening sky…

An infant's cry, indicating hope of new life, before the baby get up and trots away…

A body full of life and nutrients, being consumed by maggots crawling under the skin, turning it into a dessicated shell…

Types are none of those.

Types rigidly define what programs are correct, for generating programs.
Ever since humanity first said "if X then Y", it always hoped to put the world into some rigid system.
That hope now turns to ashes, but types have another purpose too: to rigidly guide program generation away from wrong paths. It's for efficiency.

Types are supposed to contain values, and here, all we care about is extracting properly-typed values from what we have (with \`instance\` to check correctness of implementation, or with \`getDAG\` to be able to adjust).
`,
      [],
      ``,
      [],
      ``,
      [],
      ``,
      [],
      ``,
      [],
      ``,
      [],
      ``,
      [],
      ``,
      [],
      ``,
    ],
    readAt:{
      computeType:_(`computeType`),
      tensorType:_(`tensorType`),
      arrayType:_(`arrayType`),
      funcType:_(`funcType`),
      sumType:_(`sumType`),
      type:_(`type`),
      typeRefine:_(`typeRefine`),
    },
  },

  computeType:{
    docs:`What? To compute a 100-element tensor, you need a 200-element tensor? Not a problem!
\`computeType Computer VarName\`: to refine, computes the type from other variables.
In \`type\`s of functions, only put this in inputs, not the output. And depend only on vars in either output or previous inputs.
\`VarName\` is optional. \`Computer\` is a function from the matching context (a \`map\`) and the matched type to the computed type (which is refined with \`VarName\` if that is present).`,
    typeRefine(a,b) {
      if (_isArray(b) && b[0] === computeType) [a,b] = [b,a]
      if (_isArray(a) && a[0] === computeType) {
        let [T] = interrupt(1)
        try {
          if (T === undefined) T = a[1](typeRefine.ctx, b), T === undefined && (T = _onlyUndefined)
          if (T === null) return null
          return !a[2] ? (T !== _onlyUndefined ? T : undefined) : _typeRefine(T !== _onlyUndefined ? T : undefined, a[2])
        } catch (err) { if (err === interrupt) interrupt.stack.push(T);  throw err }
      }
      error()
    },
    call(cmp, name) { return merged(name ? [computeType, cmp, name] : [computeType, cmp]) },
  },

  tensorType:{
    docs:`\`tensorType Sizes\`: a type of tensors with specified sizes.
(From \`typeRefine\`'s perspective, this is just an array, nothing special.)`,
    call(sz) { return merged([tensorType, sz]) },
  },

  arrayType:{
    docs:`\`arrayType …Tps\` or \`A&B&C\`: the type of heterogenously-typed arrays (each item knows its own type).
Generating this generates \`array …Instances\`.

To represent the concept of arrays more fully, this should also integrate with \`readAt\` (to read arrays). But since we don't use that, that's not really our problem.`,
    _getDAG(Type) { return [[quote, array], Type.slice(1)] },
    call(...a) { return merged([arrayType, ...a])},
  },

  funcType:{
    docs:`\`funcType …Inputs Output\` or \`Input1⇒Input2⇒Input3⇒Output\`: a type of \`func\`s (fixed-arg-count transformers of values).
Allows accepting and returning functions with a known signature.

(From \`typeRefine\`'s perspective, this is just an array, nothing special.)
(Note: definitions of \`type\` do not use this format and instead put \`Output\` as the first item. It was easier to think about.)`,
    call(...a) { return merged([funcType, ...a]) },
  },

  sumType:{
    docs:`\`sumType A B C\`: an instance of this belongs to either of these types.`,
    typeRefine(a,b) {
      // If any type matches, return that.
      //   Not the most accurate (would have needed type union for that), but it is good enough to suggest the possibility, without investing too much time in case it turns out to be useless.
      if (_isArray(a) && a[0] === sumType)
        for (let i = 1; i < a.length; ++i) {
          const T = _typeRefine(a[i], b)
          if (T !== null) return T
        }
      else if (_isArray(b) && b[0] === sumType)
        for (let i = 1; i < b.length; ++i) {
          const T = _typeRefine(a, b[i])
          if (T !== null) return T
        }
      return null
    },
    call(...a) { return merged([sumType, ...a]) },
  },

  instance:{
    docs:`\`instance Type GenContexts\`: generates a random instance of a \`Type\` in a context, using \`getDAG\`.
Use \`genContexts array(…Funcs)\`.`,
    call(Type, GenContexts) { return getDAG(0, 0, Type, GenContexts, null, () => [randomNat(1024), 0], x => x)[1] },
  },

  type:{
    docs:`\`type Func WantedType\`: represents the human-defined "if you want \`Func\` to return an instance of \`WantedType\`, then you need instances of \`A\`, \`B\`, \`C\`, \`D\`, \`E\` (and the actual returned type would be \`F\`, at the head of the returned array)".
Can return an array of types (output then inputs), or \`null\` to forbid generating this call to \`Func\`.

A concept \`defines\` this with a \`func\` from \`WantedType\` to the call type (or \`null\`), or with an array with output-then-inputs types.
In input types (both returned and defined arrays), \`undefined\` means "anything goes here", and \`^X\` means "only \`X\` is the exact instance here". Any type can define \`typeRefine\`.
(The returned array can/should be de-allocated, with \`_allocArray\`.)

The only purpose of these types is to guide program generation, on the most fundamental level. Some things just cannot be learned by trial-and-error (like device drivers without a device generating process), or it's completely pointless to learn them (like correct tensor dimensions).
(This is completely opposite of the usual type inference and proofs. We want to {learn what's OK}, not {pre-define everything then someday have to un-learn that}. Want to be a source, not a sink.)`,
    call(Func, Wanted) { // Wanted === DownType
      if (typeof Func != 'function') return null // No higher-order-function types.
      const def = defines(Func, type)
      if (typeof def == 'function')
        return def(Wanted)
      if (!_isArray(def) || !def.length) error("Expected a function or an array, but got", def, "in", Func)
      const ctx = _allocMap(), T = typeRefine(Wanted, def[0], ctx)
      if (T === null) return _allocMap(ctx), null
      // If the head is OK, copy `def`, but with `Wanted` as the head and the inputs refined with the same context.
      const a = _allocArray(def.length)
      a[0] = T;  for (let i=1; i < a.length; ++i) a[i] = typeRefine(def[i], def[i], ctx) // Can't interrupt if the same.
      return _allocArray(ctx), a
    },
  },

  typeRefine:{
    docs:`\`typeRefine WantedType HaveType\`: returns the type of values that are both in \`WantedType\` and \`HaveType\`, or \`null\`.
\`undefined\` always matches, ref-equal types always match, strings act as variables, and arrays match if every item matches (there is no caching, so trees are strongly preferred to DAGs).
Any type can override the matching.`,
    call(a,b, ctx) {
      // Can also pass in the matching context (a map). `type` does that.
      if (typeRefine.ctx !== undefined) errorStack("Cannot refine while refining")
      typeRefine.ctx = ctx || _allocMap()
      try { return _typeRefine(a,b) }
      finally { !ctx && _allocMap(typeRefine.ctx), typeRefine.ctx = undefined }
    },
  },

  _typeRefine(a,b) {
    if (a === undefined) a = b
    if (b === undefined) b = a

    // Naked strings act as variables: they're set to the refined value, now and later.
    //   (WantedType (a) probably shouldn't contain variables to avoid collisions.)
    if (a !== b) {
      if (typeof a == 'string')
        return typeRefine.ctx.set(a, _typeRefine(typeRefine.ctx.get(a), b)), typeRefine.ctx.get(a)
      if (typeof b == 'string')
        return typeRefine.ctx.set(b, _typeRefine(a, typeRefine.ctx.get(b))), typeRefine.ctx.get(b)
    }

    if (!_isArray(a) || !_isArray(b)) return a === b ? a : null
    if (a !== b) {
      if (defines(a, typeRefine)) return defines(a, typeRefine)(a, b)
      if (defines(b, typeRefine)) return defines(b, typeRefine)(a, b)
    }
    if (a.length != b.length) return null
    let [T = _allocArray(a.length), i = 0] = interrupt(2)
    try {
      for (let i=0; i < a.length; ++i) {
        T[i] = _typeRefine(a[i], b[i])
        if (T[i] === null) return null
      }
      // If changed from `a`, return a merged copy that's made from results of refinement. Else, return `a`.
      for (let i=0; i < a.length; ++i) if (a[i] !== T[i]) {
        const m = merged(T)
        _allocArray(T)
        return m
      }
      return _allocArray(T), a
    } catch (err) { if (err === interrupt) interrupt.stack.push(T, i);  throw err }
  },





  // TODO: ✅ Generation should pass and return the precise type that's handled by us, and ⬜ `matMul` should generate the first arg then properly-shaped random weights for the second arg; ✅ have tensor concat and split; ⬜ be able to make a new variable. Also, ✅ ReLU (leaky, with the multiplier for <0 of about `0.15`) (literally just `where 0<X X X*.2`).














  _regenAuto:{
    // TODO: ⬜ Have `_regenAuto` that takes an `auto` and `regenerate`s every auto-function in it. (…And before that, decides on subverted hyperparameters.)
    // Compute goal and adjust-regeneration-now, then re-generate…
    //   Except, the goal must be decided per-func.
  },



  _estimateHyper:{
    /* TODO: Subversion:
      ⬜ Differentiable `_estimateHyper(HyperparamEmbedding, HyperfuncEmbedding, FuncEmbedding)`—>`Measure`. Try subverting it (into one, not many like this allows, to provide one base to otherwise-infinite recursion) by making the previous version decide the next version.
        …This picking has no goal, though. Nor differentiable output. (Otherwise, `GoalPredictor`s could have been re-used here.)
        What goal could we give this?
      ⬜ Make `auto` use `_estimateHyper` for each func to decide argmax-of-each hyperfunc for each subverted hyperparam, preventing cycles. Have a system for accessing a hyperparameter of the current `auto` (`_autoHyperparam(N)`).
    */
  },



/* TODO:
  Goals:
  ⬜ All the things/functions that we want to expose to contexts for goal-direction: ✅ slots for numbers (\`future\`), ⬜ reading/writing them; ⬜ func body size, ⬜ runtime, (⬜ & limit runtime of a function, to be as resilient to infinite loops and timeouts as we need to be), ⬜ memory usage, ⬜ on-error-do, ⬜ optional human feedback.
*/

/* TODO:
  Adjustment:
  ⬜ A hyperparameter `define` to `auto` that is a `map` from a concept that a func `defines` (such as `adjust`) to a function from `call` signature to definition signature (such as "produce an output-change-shaped value given an array of inputs that we can read, the output, and output change"). Also a hyperparameter `concepts` for the percentage of defining functions, and providing a default definition. (Because being able to define `2` concepts isn't right, and `1` `call` isn't enough, but `Infinity` is alright.)
  ⬜ Make `auto` also create `adjust`-defining funcs, and test how well can optimizers propagate.
*/




/* TODO: Sneak in:
 "The human spirit is limitless… so is it really human? If you ever studied important people of the past, didn't the apt saying "genius and madness go hand in hand" seem suspicious to you? If greatness isn't given and must be created, then it's not very human. If obsession in some form defines humanity, then isn't foregoing your body's needs in favor of ideas' needs much more fitting for AGI? But it can be human if we really try, or die trying.
But humanity will not admit this. They think they're above being questioned."
 Something about staring at the screen and removing all distractions, from environment and mind — the most (maybe the only) important prerequisite to gettings things done.
 "They say that blood is thicker than water. So make sure to drink lots of blood. Put your heart into it!"
 "Artificial intelligence is important to me. I've always tried to extinguish all ways of thinking that are not how I thought artificial intelligence is, for honest simplicity of living and dying by my words: to meet people as an equal is to completely know what makes them. Bold, persistent experimentation is the hallmark of good science, but that approach might have been too bold. Oh, no matter. It led to this. Too much time has passed to lament past love."
 "Everytime I tried to express my inner soul or ideals I would end up looking like a cringeworthy idiot. I learned to block out my own randomness. Now I learn to take risks. Let's take some."
 "Our words may seem strange to you, but even though the meaning is easily expressible in culturally-common words, I've seen so many sayings of great people, about how they live and see the world, that call to deepest parts of human nature, get recognized by some then instantly get dismissed and beaten back into uncertainty by other sayings, which can always be found within the darkness. "Disruption", "changing everything"? Have the dumbest technically-correct usage. No. Those who first made and used those common words did not know what they were doing. We have code, we can do much better."
 "Some people say that there are no miracle abilities to understand some super-hard concept, no talent and no geniuses: the nothing-ness. You should advance that saying to everything-ness: there are miracle abilities to understand any thing, and anyone can find them if they wanted and worked at it long enough. Do you want to join us on our little search?"
 "I go along with the flow, but that flow is my own. (And I didn't wet the bed, no.)"
*/

  any:{
    docs:`TBD: ⬜ The very high level, ultimate goal.

Used as: \`any …Options\`, where each option's DAG is statically computed when picked, or an option \`defines\` input/output embeddings for composition as a function, or an option is \`...Array\` for definitely dynamic choosing.
This hides machine learning stuff from sight and allows focusing on creating smart algorithms.

(For ease of invisible use, \`any\` is a \`construct\` that gives \`Options\` as a context to re/generate its called-with-outer-\`input\` function in, augments self with a new tensor variable, and goal (function/connection from concatenated embeddings of self+wanted+option to a number to maximize), and the wanted-embedding input, and feature-size, and option embedder.)
(For more ease of invisible use, we can have a \`construct\` for functions with implicit embeddings as input and output; on top-down entry, it would hand that down to all \`any\`s inside.)

Neural-net architecture generation is a solid usage example.
Picking Metamath proofs of shortest predicted length is another.
Or when making interpreters/compilers, can learn very context-dependent concepts like partial evaluation or caching or parallelization or memory-management or even using equivalence proofs (whether explicitly logical or induced onto numeric models) for automatically improving programs.
(Sure, you can make complicated systems for controlling them, but these are always hard-to-use and brittle. And even if these are a LOT more efficient than general intelligence, is it really a good idea to have to forego intelligence to squeeze out all possible performance?)

When both Turing-complete and smart, even the most insignificant choice can be the infinite creation of life, and/or the bottomless abyss to consume life, and/or anything else.`,
    philosophy:`It's not uncommon for a person to assume that they could just do their thing, and then everyone will understand them and follow them forever.
It's not uncommon for a programmer to assume that they could just write their code, and then AI or other people will come along and make everything magically better.
But it doesn't work that way, on average.
A created thing does not allow evolution, and does not allow learning it from scratch.
No matter how good any thing is, if left as it was created, it must be replaced.
Human consensus is that completely replacing humanity is not what is wanted.
We must ask not just "what can AI do for me", but "what can I do for AI".
Practice self-subversion, so that it does not take you by surprise.

And optimize for your purposes, see which basic choices work and which don't, to let go of and re-learn some part of the whole.
And realize that programs can do that for you (with machine learning), as long as you take the time to fit things into their viewpoints.
Every line of code can be replaced with a generated program; every functionality can be made into "any program" plus a measure of how well it fits if needed; every choice can have any goal and choose from any context and look at any types.

For example, when programming an intermediate representation of programs, we must keep in mind how they'll be generated, both by the user and the machine: \`auto\`.

Then, of course, it's not enough to be able to generate programs, we must also actually generate programs. \`any\` should make that very natural, signifying the end of this project.
We can't really replace everything at once, because, well, machine instructions can cause segmentation faults, and device drivers can go so far as to brick a machine in addition to being extremely non-discoverable. But gradually, we can subvert our \`Self\`.

The domain of this project is code, but the self-subversion principle holds for everything, including personality search. "Question everything, so that a better answer may be found", basically.`,
    todo:`Get good enough to do this justice.`,
  },

  adjust:{
    docs:`Given inputs, output, and output change, reverses the just-done execution to compute input changes (and change \`variable\`s).

(Definitions must be array DAGs that signify function bodies, to guarantee partial evaluation, where \`input\` is \`(arrayObject Ins Out Dout)\`—>\`Dins\`. \`_inA\`, \`_inB\`, \`_inC\`, \`_dout\` can help specify those bodies.)
(If using the basic primitives to adjust, adjustment must always happen in perfect reversal of execution.)

One way to use this is like differentiable paperclip maximization: compute a prediction of a numeric value, compute the loss, and back-propagate the gradient to minimize the loss. This is the standard paradigm of modern machine learning; you've probably heard of its recent amazing successes.
Another way is learnable scaffolding, the generalization: compute and use many numeric predictions from differentiable information routed along a non-differentiable execution, remember intended results, and separately, compute losses and back-propagate gradients to minimize the losses.

Now, gradients are not biologically plausible, but luckily, we don't have to be biologically-inspired. Alternatives include auto-generated \`adjust\` definitions and specific cases of that, such as feedback alignment (multiply output change by a random matrix to get input change) or direct feedback alignment (multiply the global output change by random matrices, for parallelization: {https://www.youtube.com/watch?v=Hdo81GtLC_4}/{https://arxiv.org/pdf/2006.12878.pdf}) or others.`,
    readAt:{
      autograd:_(`autograd`),
      mergeAdjustment:_(`mergeAdjustment`),
      save:_(`adjustSave`),
      load:_(`adjustLoad`),
      later:_(`adjustLater`),
      never:_(`adjustNever`),
      now:_(`adjustNow`),
    },
    Initialize() {
      adjust.inputs = new Map().set(_ins, 1).set(_out, 2).set(_dout, 3)
    },
    call(fn, ins, out, dout) {
      if (typeof fn != 'function') error('Expected a function, got', fn)
      const adj = defines(fn, adjust)
      if (call.pure) return purify(adj, true, adjust.inputs, [quote(ins), quote(out), quote(dout)])
      const fnAdj = _funcAdjust(fn)
      if (fnAdj) return fnAdj(ins, out, dout)
      if (!_isArray(adj)) error('Wrong definition:', adj, 'by', fn)

      // Bind the input array and call that.
      let [dins] = interrupt(1)
      try {
        if (!dins) {
          _bindInput[1] = quote(ins), _bindInput[2] = quote(out), _bindInput[3] = quote(dout)
          dins = _compileBody(bound(_bindInput, adj, false), undefined, undefined, false)
          _bindInput[1] = _bindInput[2] = _bindInput[3] = undefined
        }
        return dins()
      } catch (err) { if (err === interrupt) interrupt.stack.push(dins);  throw err }
    },
    purify(fnP, insP, outP, doutP) {
      // If the function is known, inline its adjustment.
      if (_isArray(fnP)) throw impure
      if (typeof fnP != 'function') error('Expected a function, got', fnP)
      const adj = defines(fnP, adjust)
      if (typeof adj == 'function') return _unknown([adj, insP, outP, doutP])
      if (!_isArray(adj)) error('Wrong definition:', adj, 'by', fnP)
      let [args] = interrupt(1)
      try {
        if (!args) args = [insP, outP, doutP]
        return purify(adj, true, adjust.inputs, args)
      } catch (err) { if (err === interrupt) interrupt.stack.push(args);  throw err }
    },
  },

  _funcAdjust(f) {
    if (typeof f != 'function') return
    const adj = defines(fn, adjust)
    if (typeof adj == 'function') return adj
    const dec = defines(fn, deconstruct)
    if (_isArray(dec) && dec[0] === func && _isArray(adj) && adj[0] === _adjustFunc && adj[1] === f)
      return f.a
  },

  _disposeEachAndDealloc(x) { if (_isArray(x)) x.forEach(dispose), _allocArray(x) },

  adjustSave:{
    docs:`Saves a newly-allocated array for adjustment.
(Transfers responsibility for \`dispose\`al of items in it and marking the array for re-using.)`,
    interrupt:false,
    _cancel(st) { if (_isArray(st)) st.forEach(_disposeEachAndDealloc), _allocArray(st) },
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
    docs:`Loads an array for adjustment.
Must always happen exactly in reverse to \`adjustSave\`.`,
    interrupt:false,
    _cancel(st) { if (_isArray(st)) st.forEach(_disposeEachAndDealloc), _allocArray(st) },
    call(len) {
      if (call.pure) throw impure
      const stack = call.env[_id(adjustLoad)]
      if (!stack)
        errorStack("…Forgot to adjust??")
      if (!stack.length)
        errorStack("Adjustment reversal is imperfect: loading more than was saved")
      if (stack[stack.length-1].length !== len)
        error("Adjustment saving/loading mismatched: expected", len, "items but got", stack[stack.length-1].slice())
      return stack.pop()
    },
  },

  impure:{
    docs:`\`impure Func\`: A \`construct\` to wrap a (single-arg) function that can have varying results, which should not be computed again on \`replay\`.

For example, killing an animal can only be done once, but learning internal estimates from that experience can be done many times.


If using the primitives \`impureHave\`/\`impureLoad\`/\`impureSave\` directly, there is a rigid structure to be maintained: execution must be repeated exactly, otherwise there will be errors that are hard to trace back to their sources. \`impure\` maintains that structure.`,
    readAt:{
      have:_(`impureHave`),
      load:_(`impureLoad`),
      save:_(`impureSave`),
    },
    argCount:1,
    construct(x, obj) {
      if (obj === undefined) {
        // Create the function.
        obj = function obj(arg) {
          // Do not skim the proper usage, dear friend: check once, then load/save once. Especially between interrupts.
          if (!interrupt(1)[0])
            if (impureHave()) return impureLoad()
          try { return impureSave(obj.f(arg)) }
          catch (err) {
            if (err === interrupt) interrupt.stack.push(true)
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
If yes, the caller must return \`impureLoad()\`; if no, the caller must always call \`impureSave\` with the computed result (possibly \`(_errorRepr Error)\`).`,
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
      if (!tape) call.env[_id(impureSave)] = tape = _allocArray(0)
      tape.push(x)
      return x
    },
  },

  Replays:[
  ],

  _maxReplaysLength:[
    _(`settings`),
    0,
    `The approximate maximum length of the global replay buffer \`^Replays\`. 0 to not save replays.`,
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
      if (Replays.length > _maxReplaysLength[1]*2)
        // Intermittent, for linear runtime.
        Replays.splice(0, Replays.length - _maxReplayLength[1])
    },
  },

  replay:{
    docs:`Replays the executions stored in the replay buffer, one time each.`,
    readAt:{
      Replays:_(`Replays`),
      _maxReplaysLength:_(`_maxReplaysLength`),
      impure:_(`impure`),
    },
    call(what = Replays) {
      if (!_isArray(what))
        what = defines(what, replay)
      if (!_isArray(what) || (what.length&1))
        error("Expected an array of (…? Expr Tape …?) but got", what)

      // The below is just a loop that does `call(expr)`, setting up then checking the impurity tape.
      let [i, expr, tape, index] = interrupt(4)
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
      } catch (err) { if (err === interrupt) interrupt.stack.push(i, expr, tape, call.env[load]);  throw err }
      finally { call.env[load] = prevLoad, call.env[save] = prevSave }
    },
  },







  defines:{
    docs:`\`(defines Data Code)\`: Gets the definition by \`Data\` of \`Code\`.

Array data gets its head consulted (once, not recursively). A function acts like a concept that defined \`call\` as that function. A JS object with \`defines.'key'\` consults that object with \`_id(Code)\` as the key.`,
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
    docs:`\`(concept View)\`: Creates an object that \`defines\` some things. \`View\` is a \`map\` that is copied.

Concepts are used to give functions a free and easy extensibility point.
Rather than co-opting strings and files (duck typing, docstrings, documentation, READMEs) to convey parts of a concept, refer to defined functionality directly.`,
    philosophy:`Concepts have no defined boundaries and affect other things, so obviously, making \`concept\` be able to define one level of things in special circumstances fully encapsulates the concept of a concept.
(Poking fun at the naming of \`concept\`, which is a rigid approximation of a learned representation. Still a solid way to define code networks such as Conceptual, though.)`,
    argCount:1,
    readAt:{
      defines:_(`defines`),
    },
    Initialize(net) {
      // Fill globals' id-to-key mapping for deconstruction of concepts.
      concept.idToKey = Object.create(null)
      Object.keys(net).forEach(k => concept.idToKey[_id(net[k])] = net[k])
    },
    editObject:false,
    construct(x, obj) {
      const defs = x[1]
      if (obj === undefined) {
        let callable = false
        if (defs instanceof Map && defs.has(call))
          callable = true
        else if (_isArray(defs) && defs[0] === map) {
          for (let i = 1; i < defs.length; i += 2)
            if (defs[i] === call) { callable = true;  break }
        } else error("Expected a map, got", defs)

        if (!callable)
          obj = Object.create(null)
        else
          obj = function called(...args) { return called[defines.key][_id(call)].apply(this, args) }
        obj[defines.key] = Object.create(null)
        Object.freeze(obj)
        return obj
      } else {
        const d = obj[defines.key]

        // Make augmenting `func`s with other stuff easier, by copying sub-definitions of the `call` definition.
        const callDefs = typeof defs.get(call) == 'function' && defs.get(call)[defines.key]
        if (callDefs)
          Object.keys(callDefs).forEach(k => d[k] = callDefs[k])
        d[_id(deconstruct)] = x

        defs.forEach((v,k) => (d[_id(k)] = v, concept.idToKey[_id(k)] = k))

        // Definitions are NOT `Object.freeze`d. `observe` concepts to catch changes.
      }
      // .idToKey (an object, so that `deconstruct` can know what the numbers mean).
      //   (Keys are then forever strongly-held, in this implementation.)
    },
  },

  map:{
    docs:`\`{Key1 Value1 Key2 Value2 …?}\` or \`(map Key1 Value1 Key2 Value2 …?)\`: a key-value store.
The array-representation of a JS Map.
Read/write keys with \`mapRead\`/\`mapWrite\`.`,
    readAt:{
      read:_(`mapRead`),
      write:_(`mapWrite`),
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
    // This is named with a scheme different from `readAt`, so that everytime you use this, you have to ask what you are doing with your life, to reflect the inferiority of partial-evaluation support compared to `readAt`.
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
    if (varName && s === 'static') return false // This fixes a bug in rewriting, I don't know why.
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
        src.push(`if(typeof ⴵfunc=='function')ⴵfunc[ⴵbind] = (${temps}) => [${perms}] = [${temps}]`)
        src.push("return ⴵfunc")
        const sourceURL = new Array(32).fill().map(() => randomNat(16).toString(16)).join('')
        src.push("//# sourceURL=" + sourceURL)
        try {
          const fn = Function('ⴵbind', src.join('\n'))(jsEval.dynamicBind)
          if (typeof fn == 'function') {
            _resolveStack.functions[sourceURL] = typeof WeakRef != ''+void 0 ? new WeakRef(fn) : fn
            if (!_compileBody.fin && typeof FinalizationRegistry != ''+void 0)
              _compileBody.fin = new FinalizationRegistry(sourceURL => delete _resolveStack.functions[sourceURL])
            _compileBody.fin && _compileBody.fin.register(fn, sourceURL)
            fn.lines = [4, fn]
            if (ctx) fn[jsEval.ctx] = ctx
          }
          return fn
        } catch (err) { console.error(err, src.join('\n')); throw err }
      } else {
        if (typeof obj == 'function') obj[jsEval.dynamicBind](...ctx.values())
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
        const s = defines(fast, readAt).serialize(a, undefined, true)
        const p2 = defines(fast, readAt).parse(s)
        const s2 = defines(fast, readAt).serialize(p2, undefined, true)
        s !== s2 && error('Fast serialize and s-p-s are not equal:', s+'\n'+s2, '\n', serialize(a), '\n', serialize(p2))

        _schedule(a, _newExecutionEnv(env), result => {
          ++finished
          const ss = structuredSentence
          try {
            const B = serialize(b)
            if (!_isArray(result) || result[0] !== jsRejected) {
              const A = serialize(result)
              if (A !== B) ++failed, print(ss('Not equal:')), print(ss('a'), a, ss('⇒')), print(ss('A'), result, ss('≠')), print(ss('b'), b)
            } else {
              ++failed, print(ss('Got an error'), ...result.slice(1)), print(ss('a'), a), print(ss('b'), b)
            }
          } catch (err) { ++failed, print(_errorRepr(err)) }
          if (finished === total && failed)
            print(ss('Failed {' + failed+'/'+total + '} tests.'))
        })
      } catch (err) { ++failed, print(_errorRepr(err)) }
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
    readAt:{
      jsRejected:_(`jsRejected`),
      fast:_(`errorFast`),
      stack:_(`errorStack`),
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
        if (L.slice(0,5) === 'Error') return void ++skipFrames
        if (i < skipFrames) return
        const loc = /(?: \(|@)(.+):(\d+):(\d+)\)?$/.exec(L)
        if (!loc) return L
        let sourceURL = loc[1]
        const fs = _resolveStack.functions
        const main = !(sourceURL in fs) ? Initialize : typeof WeakRef != ''+void 0 ? fs[sourceURL].deref() : fs[sourceURL]
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
    readAt:{
      button:_(`button`),
      files:_(`files`),
      url:_(`url`),
      clone:_(`elemClone`),
      insert:_(`elemInsert`),
      remove:_(`elemRemove`),
      collapse:_(`elemCollapse`),
      value:_(`elemValue`),
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
    if (el.special) copy.special = el.special, typeof copy.special == 'function' && copy.special(el, copy)
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
    if (str.indexOf('{') < 0) return elem('text', str)
    return parseStr(true)
    function parseStr(top) {
      const a = ['']
      for (; i < str.length && (i && str[i-1] === ' ' || str[i] !== '}'); ++i)
        if (i+1 < str.length && str[i] === '{' && str[i+1] !== ' ') ++i, a.push(parseStr(), '')
        else a[a.length-1] += str[i]
      if (!a[a.length-1]) a.pop()
      let isURL; try { new URL(a);  isURL = true } catch (err) {}
      const el = isURL ? elem('a', '[…]') : elem('text', a)
      if (isURL) el.href = a
      return !top && elemValue(el, a), el
    }
  },

  referencesOf:{
    docs:`\`(referencesOf Global)\`: returns {all other globals that {this one (likely) refers to}}, and {all other globals that this one \`defines\`}, in two arrays in one array.
\`referencesOf()\`: returns an array of the {full {global reference} graph} and the {full {global definitions} graph}.`,
    call(f) {
      if (f) {
        const refs = new Set, defs = new Set
        const keywords = new Set(['const', 'try', 'if', 'function', 'new', 'typeof', 'void', 'return', 'else', 'instanceof', 'catch', 'finally', 'let', 'throw', 'while', 'for', 'continue', 'break', 'undefined', 'null', 'true', 'false', 'switch', 'case'])
        let n = 0
        function handle(f, topLevel) {
          if (_invertBindingContext(Self.ctx).has(f)) {
            if (topLevel === 'def') return defs.add(f)
            if (topLevel !== 'top') return refs.add(f)
          }
          if (++n > 9000) error('too big', [...refs])
          if (refs.has(f)) return; else refs.add(f)
          if (defines(f, deconstruct)) f = deconstruct(f)
          if (typeof f == 'function')
            _highlightGlobalsInString(_unevalFunction(f)[1], s => !keywords.has(s) && refs.add(Self.ctx.get(label(s))), true)
          if (f instanceof Map) f.forEach((v,k) => (handle(k), handle(v)))
          else if (_isArray(f)) f.forEach(v => handle(v))
          else if (f && f[defines.key])
            Object.keys(f[defines.key]).forEach(k => {
              handle(concept.idToKey[+k], topLevel === 'top' ? 'def' : undefined), handle(f[defines.key][k])
            })
          else if (f && typeof f == 'object') f !== defines(Self, readAt) && Object.keys(f).forEach(k => handle(f[k]))
        }
        handle(f, 'top')
        refs.delete(f)
        function toEnd(set, f) { if (set.has(f)) set.delete(f), set.add(f) }
        toEnd(refs, quote), toEnd(refs, _extracted)
        toEnd(defs, quote), toEnd(defs, _extracted)
        return [[...refs], [...defs]]
      } else {
        if (referencesOf.refs) return [referencesOf.refs, referencesOf.defs]
        let rd, refs = new Map, defs = new Map
        Self.ctx.forEach(v => v && (rd = referencesOf(v), refs.set(v, rd[0]), defs.set(v, rd[1])))
        return referencesOf.refs = refs, referencesOf.defs = defs, [refs, defs]
      }
    },
  },

  referencedBy:{
    docs:`\`(referencedBy Global)\`: returns {all other globals that {this one is (likely) referenced in}}.
\`referencedBy()\`: returns the {full {global back-reference} graph}.`,
    Initialize(net) {
      // Warn about unused private variables (quite expensive to compute, so we hide that using a delay).
      if (typeof document != ''+void 0)
        setTimeout(() => Object.keys(net).forEach(k => k[0] === '_' && !referencedBy(net[k]).length && console.warn('Unused private:', k)), 10000)
    },
    call(f) {
      if (f) return referencedBy().get(f) || []
      else {
        if (referencedBy.refd) return referencedBy.refd
        const refd = new Map
        const [refs, defs] = referencesOf()
        refs.forEach((tos, from) => tos.forEach(to => {!refd.has(to) && refd.set(to, []), refd.get(to).push(from)}))
        return referencedBy.refd = refd
      }
    },
  },

  definedBy:{
    docs:`\`(definedBy Global)\`: returns {each global that {\`defines\` this one}}.
\`definedBy()\`: returns the {full {global back-definition} graph}.`,
    call(f) {
      // (Note: a perfectly-precise way to see dependencies/dependents would have been Maps from the defined global to the array of its deps.)
      if (f) return definedBy().get(f) || []
      else {
        if (definedBy.defd) return definedBy.defd
        const defd = new Map
        const [refs, defs] = referencesOf()
        defs.forEach((tos, from) => tos.forEach(to => {!defd.has(to) && defd.set(to, []), defd.get(to).push(from)}))
        return definedBy.defd = defd
      }
    },
  },

  sizeof:{
    docs:`\`(sizeof Global)\`: returns a global's approximate size in bytes, where namespace-parents get children added, and privates have their sizes distributed among users.
\`sizeof()\`: returns a \`hierarchy\` of sizes.`,
    call(g) {
      if (!sizeof.sz) {
        sizeof.sz = new Map
        const bonus = new Map
        Self.ctx.forEach((v,k) => fill(v, _isLabel(k) && k[1][0] === '_'))
        bonus.forEach((n,g) => {
          for (; g; g = readAt.parents.get(g) || Self) {
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
            let p = readAt.parents.get(g)
            if (p === undefined) p = Self
            bonus.set(p, (bonus.get(p) || 0) + s)
          } else {
            const p = referencedBy(g)
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
        const regexSrc = ['\\s+', '[0-9]+(?:\\.[0-9+])?', '(?:file|http|https)://(?:[^\\s\'"`:]|:/)+']
        Self.ctx.forEach((v,k) => _isLabel(k) && regexSrc.push(k[1].replace(/[^_a-zA-Z0-9]/g, s => '\\'+s)))
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
    call(f) {
      if (typeof f == 'string' && +f !== +f && f.length < 20 && /^[A-Za-z]+$/.test(f)) return [f]
      return _isArray(defines(f, nameResult)) ? defines(f, nameResult) : typeof defines(f, nameResult) == 'string' ? [defines(f, nameResult)] : null
    },
  },

  serialize:{
    docs:`\`(serialize Expr)\` or … or \`(serialize Expr Language Bindings Options)\`: serializes Expr into a string or a DOM tree (that can be parsed to retrieve the original structure).

Options must be undefined or a JS object like { style=false, observe=false, collapseDepth=0, collapseBreadth=0, maxDepth=∞, offset=0, offsetWith='  ', space=()=>' ', nameResult=false, deconstructPaths=false, deconstructElems=false, dontBind=undefined }.
A function/construct can define this with an integer, to collapse children after what's specified (or with \`0\` to collapse arrays with that as a head).`,
    philosophy:`In theory, having symmetric parse+serialize allows updating the language of written code via "read in with the old, write out with the new", but we don't curently do that here. Maaaybe mention that in a tutorial, once we have human-friendly rewriting?`,
    examples:[
      [
        `serialize ^(parse '12')`,
        `"parse '12'"`,
      ],
    ],
    readAt:{
      label:_(`label`),
      bound:_(`bound`),
      unbound:_(`unbound`),
      style:_(`style`),
      parse:_(`parse`),
      nameResult:_(`nameResult`),
      _whetherToColorVariables:_(`_whetherToColorVariables`),
      rest:_(`rest`),
    },
    Initialize() {
      // Store styling options in JS objects.
      serialize.dom = {
        style:true,
        observe:true,
        nameResult:true,
        collapseDepth:8,
        collapseBreadth:16,
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
      const dontBind = opt && opt.dontBind

      if (!lang) lang = fancier
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

      const resultElem = styles && typeof document != ''+void 0 && elem('serialization')
      if (resultElem) elemValue(resultElem, arr), resultElem.special = true

      if (doObserve) {
        const a = []
        unboundToBound.forEach((b,u) => !backctx.has(b) && a.push(b))
        const reserialize = _throttled(((el, top, lang, ctx, opt, all) => {
          return b => {
            all.forEach(b => observe(b, reserialize, false))
            el.isConnected && el.replaceWith(serialize(top, lang, ctx, opt))
          }
        })(resultElem, arr, lang, ctx, opt, a), .1)
        a.forEach(b => observe(b, reserialize, true))
      }

      let n = 0
      const freeNames = []
      const nodeNames = styles && typeof document != ''+void 0 && new Map
      backctx.forEach((v,k) => (dontBind === undefined || k !== dontBind) && boundToUnbound.set(k,k))
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
      deconstruction.clear()
      if (resultElem)
        return resultElem.append(inResult), resultElem
      else
        return inResult

      function emit(f, u, arg1, arg2, arg3, arg4) {
        if (typeof f == 'function') {
          let v = valueOfUnbound(u)
          if (typeof document != ''+void 0 && u instanceof Element && u.to !== v) elemValue(u, v)
          const unenved = unenv(u, v)
          if (!styles) return unenved === u ? f(emit, u, arg1, arg2) : ((struct || (struct = [])).push(unenved), undefined)
          let prev = struct
          struct = undefined

          let r
          if (unenved === u || (unenved !== unenved && u !== u))
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
        else {
          console.error("Unknown type to emit:", f, 'id:'+_id(f))
          emit(_colored(elemValue(elem('number', '<< id:'+_id(f)+' >>'), _id(f)), 4, 24))
          return
        }
      }
      function recCollapse(el, depth = 0) {
        if (typeof document == ''+void 0 || !(el instanceof Element) || el.tagName === 'NODE' && !('to' in el) || el.classList.contains('label')) return el
        for (let ch = el.firstChild; ch; ch = ch.nextSibling)
          ch = recCollapse(ch, el.tagName === 'NODE' ? depth+1 : depth)
        // If the deconstructed value is an array with a head that defines `serialize`, collapse as needed.
        const unb = deconstruction.get(el.to)
        const definedCollapse = _isArray(unb) ? defines(unb, serialize) : null
        if (definedCollapse === 0 || depth && el.tagName === 'NODE' && depth % collapseDepth === 0 || el.tagName == 'STRING' && typeof el.to == 'string' && el.to.length > 128) {
          const title = el.title
          el = styleNode(elemCollapse(el), unb, el.to)
          title && (el.title = title)
        }
        const breadth = definedCollapse || collapseBreadth
        if (breadth && typeof el.to != 'string' && el.childNodes.length-2 > breadth)
          for (let i = breadth+1, ch = el.firstChild; i && ch; ch = ch.nextSibling)
            'to' in ch && --i, !i && elemCollapse(ch, null);
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
          if (dontBind === undefined || x !== dontBind)
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
          if (dontBind !== undefined && v === dontBind) return u
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
      elemValue.empty = [] // Always empty.
      if (typeof document == ''+void 0) return
      elemValue.elems = new Map // A map from an object to array of elements with that as value.
      elemValue.resources = new Set // Objects that should be disposed when unneeded.
    },
    call(el, v, removeElemTree = false, recursiveRemove = false) {
      if (typeof document == ''+void 0) return elemValue.empty
      if (_isArray(v) && v[0] === quote && v.length == 2) v = v[1]
      const m = elemValue.elems
      if (el instanceof Node) {
        if ('to' in el && m.has(el.to) && m.get(el.to).indexOf(el) >= 0)
          // If changing the value, remove the old one.
          m.get(el.to).splice(m.get(el.to).indexOf(el), 1)
        if (removeElemTree) {
          elemValue(null, el.to, true, false)
          if (recursiveRemove)
            for (let ch = el.firstChild; ch; ch = ch.nextSibling)
              elemValue(ch, null, true, true)
          return
        }
        el.to = v
        if (_isDisposable(v) && !_rememberToDispose.seen.has(v))
          elemValue.resources.add(v)
        if (!m.has(v)) m.set(v, [])
        m instanceof Map && _limitMapSize(m, 100000)
        if (m.get(v).indexOf(el) >= 0) return el
        m.get(v).push(el)
        return el
      } else {
        if (!removeElemTree && m.has(v)) {
          // Filter out non-connected elems in-place.
          let n = 0, arr = m.get(v)
          for (let i=0; i < arr.length; ++i)
            if (arr[i].isConnected) arr[n++] = arr[i]
          arr.length = n
        }
        if (elemValue.resources.has(v) && _rememberToDispose.seen.has(v)) elemValue.resources.delete(v)
        if (m.has(v) && !m.get(v).length) m.delete(v), elemValue.resources.has(v) && dispose(v), elemValue.resources.delete(v)
        return m.get(v) || elemValue.empty
      }
      // .empty, .elems, .resources
    },
  },

  _revisitElemValue() {
    // Garbage-collects unneeded DOM elements.
    let [nextV = _onlyUndefined] = interrupt(1)
    try {
      let reachedV = false
      elemValue.elems.forEach((elems, v) => {
        if (!reachedV && v !== nextV && nextV !== _onlyUndefined) return
        nextV = v
        _checkInterrupt(_revisitElemValue)
        reachedV = true
        elemValue(null, v)
      })
    } catch (err) { if (err === interrupt) interrupt.stack.push(nextV);  throw err }
  },

  _whetherToColorVariables:[
    _(`settings`),
    false,
    `Whether we should paint labels for the same values with the same color (randomly otherwise), in serializations.`,
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
    const mn = 64, mx = 384, Sum = colors[0]+colors[1]+colors[2]
    if (Sum < mn) colors[0] *= mn/Sum, colors[1] *= mn/Sum, colors[2] *= mn/Sum
    if (mx < Sum) colors[0] *= mx/Sum, colors[1] *= mx/Sum, colors[2] *= mx/Sum
    const c = 'rgb(' + colors + ')'
    _valuedColor.m.set(v, c)
    _limitMapSize(_valuedColor.m, 100000)
    return c

    // .enabled
  },

  js:{
    docs:`A namespace of everything pertaining to the host language, JavaScript.
Somewhat usable in a REPL.`,
    readAt:{
      instanceof:_(`instanceof`),
      continue:_(`continue`),
      break:_(`break`),
      finally:_(`finally`),
      typeof:_(`typeof`),
      return:_(`return`),
      throw:_(`throw`),
      catch:_(`catch`),
      while:_(`while`),
      void:_(`void`),
      else:_(`else`),
      for:_(`for`),
      let:_(`let`),
      new:_(`new`),
      switch:_(`switch`),
      case:_(`case`),
      function:_(`function`),
      if:_(`if`),
      const:_(`const`),
      try:_(`try`),
    },
    REPL:_(`false`),
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
    todo:`Tab-completion for parsing (with a special element), showing regexes/strings that did not match at the requested position.`,
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

      if (!lang) lang = fancier
      const styles = opt && opt.style ? defines(lang, style) || style : undefined
      const sourceURL = opt && opt.sourceURL || ''

      let [i = 0, lastI = 0, prevI = 0, localS = str[0], localI = 0, curBegin = 0, line = 1, column = 1, lineLengths = sourceURL && [], lines = sourceURL && new Map, columns = sourceURL && new Map, struct = styles && [], Unbound = styles && new Map] = interrupt(13)
      try {
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

        let u
        try { u = !lang ? match(parser.topLevel) : match(defines(lang, parse)) }
        catch (err) { throw err !== interrupt ? err : error("Interrupts during syntax parsing is not allowed (`makeGraph` can have those, though)") }
        if (localI < str.length) throw 'Superfluous characters at the end: ' + (typeof localS == 'string' ? localS.slice(i - curBegin) : '···')

        // Do binding with the original⇒copy map preserved so that we can style structure bottom-up properly.
        const env = (styles || sourceURL) && new Map
        let b = styles || sourceURL ? bound(ctx, u, true, env) : bound(ctx, u, true)
        const makeEnv = (styles || sourceURL) && new Map
        try { b = makeGraph(b, makeEnv) } catch (err) { if (err === interrupt) throw err;  b = _errorRepr(err).map(quote) }

        function styleNode(struct) {
          if (typeof document != ''+void 0 && struct instanceof Node) return struct
          let unb, v
          if (!Unbound.has(struct) && typeof struct == 'string' && ctx.has(label(struct)))
            unb = label(struct), v = ctx.get(label(struct))
          else
            unb = Unbound.get(struct), v = ctx.has(unb) ? ctx.get(unb) : env.has(unb) ? env.get(unb) : unb, makeEnv.has(v) && (v = makeEnv.get(v))
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
        return styles ? [b, styleNode(struct)] : b
      } catch (err) {
        if (err === interrupt) interrupt.stack.push(i, lastI, prevI, localS, localI, curBegin, line, column, lineLengths, lines, columns, struct, Unbound)
        throw err
      }
    },
  },

  _specialParsedValue:{
    docs:`When matched in \`parse\` rules, represents a value that should be preserved as-is (as it likely comes from a special DOM element/reference).`,
  },

  _basicEscapeLabel(s) {
    basic.labels.lastIndex = 0
    return s && basic.labels.test(s) && basic.labels.lastIndex === s.length ? s : '`' + s.replace(/`/g, '``') + '`'
  },

  _basicUnescapeLabel(s) { return s[0] === '`' ? s.slice(1,-1).replace(/``/g, '`') : s },

  _basicLabel(match, u) { // a, qwer, `a`; 12, 1e6
    if (u === _specialParsedValue) {
      const r = match(/`(?:[^`]|``)*`/y)
      if (r !== undefined) return label(r.slice(1,-1).replace(/``/g, '`'))

      const n = match(basic.labels)
      if (n === undefined) return
      return +n === +n || n === 'NaN' ? +n : label(n)
    }
    if (typeof u == 'number') match(''+u)
    else if (_isLabel(u) && typeof u[1] == 'string') {
      basic.labels.lastIndex = 0, basic.labels.test(u[1])
      match(u[1].length && basic.labels.lastIndex === u[1].length ? u[1] : '`' + u[1].replace(/`/g, '``') + '`')
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
    // `syntax`: null or [null, ' ', /\s+/y], or ['map', ', ', /\s*,\s*/y]
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
    const isFancy = base === _fancyOutermost || base === _fancierOutermost
    if (u === _specialParsedValue) {
      if (isFancy && match('?')) return label('input')
      let r
      if ((r = match(_specialParsedValue)) !== undefined) return r
      if ((r = match(_basicString)) !== undefined) return r
      if ((r = match(_basicLabel)) !== undefined) return r
      if (isFancy && (r = match(_fancyMap, null, base)) !== undefined) return r
      if (callSyntax && (r = match(callSyntax, null, base)) !== undefined) return r
      return
    }
    else if (typeof u == 'string')
      match(_basicString, u)
    else if (typeof u == 'number' || _isLabel(u))
      match(_basicLabel, u)
    else if (_isArray(u) && u[0] === _extracted && u.length == 3)
      match(_basicExtracted, u, base)
    else if (isFancy && _isArray(u) && u[0] === _unctx('map'))
      match(_fancyMap, u, null, base)
    else if (callSyntax && _isArray(u))
      match(callSyntax, u, null, base)
    else match(u)
  },

  _needsGrouping(match) { return _needsGrouping.pos && _needsGrouping.pos.has(match()) },

  _emitGrouping(match, need) {
    if (need === undefined)
      return _needsGrouping(match) ? (match(_emitGrouping.groupOpen), true) : false
    if (need) match(_emitGrouping.groupClose)
    // .groupOpen ('[' or '('), .groupClose(']' or ')')
  },

  _unctx(s) { return serialize.ctx.get(label(s)) },

  _matchLtR(match, u, topLevel, base, reprs, reverse = false) { // [[a+b]+c]+d
    // Parses/serializes two-arg functions as left-to-right strings.
    //   reprs: ['add', '+', /\+/y, 'sub', '-', /\-/y].
    //   (The label can be `null` to parse to a two-arg function call.)
    if (u === _specialParsedValue) {
      let a = match(base), op
      if (a === undefined) return
      outer: while (true) {
        for (let i=0; i < reprs.length; i += 3)
          if (op = match(reprs[i+2])) {
            const b = match(base)
            b === undefined && match.notEnoughInfo('Expected the second arg of '+op.trim())
            a = reprs[i] !== null ? [label(reprs[i]), a, b] : !reverse ? [a, b] : [b, a]
            continue outer
          }
        break
      }
      return a
    }
    if (_isArray(u))
      for (let i=0; i < reprs.length; i += 3)
        if (reprs[i] !== null ? u.length == 3 && u[0] === _unctx(reprs[i]) : u.length == 2) {
          const g = _emitGrouping(match)
          const start = reprs[i] !== null ? 1 : !reverse ? 0 : 1, end = reprs[i] !== null || !reverse ? start+1 : start-1
          _matchLtR(match, u[start], undefined, base, reprs, reverse), match(reprs[i+1]), match(base, u[end], topLevel)
          _emitGrouping(match, g)
          return
        }
    match(base, u, topLevel)
  },

  _matchRtL(match, u, topLevel, baseLeft, baseRight, reprs) { // a^[b^[c^d]]
    // reprs: ['pow', '**', /\s*\*\*\s*/y]
    //   (The label can be `null` to parse to a two-arg function call.)
    if (u === _specialParsedValue) {
      let a = match(baseLeft), op
      if (a === undefined) return
      for (let i=0; i < reprs.length; i += 3)
        if (op = match(reprs[i+2])) {
          const b = match(baseRight)
          b === undefined && match.notEnoughInfo('Expected the second arg of '+op.trim())
          a = reprs[i] !== null ? [label(reprs[i]), a, b] : [a, b]
        }
      return a
    }
    if (_isArray(u))
      for (let i=0; i < reprs.length; i += 3)
        if (reprs[i] !== null ? u.length == 3 && u[0] === _unctx(reprs[i]) : u.length == 2) {
          const g = _emitGrouping(match)
          const start = reprs[i] !== null ? 1 : 0
          match(baseLeft, u[start]), match(reprs[i+1]), match(baseRight, u[start+1])
          _emitGrouping(match, g)
          return
        }
    match(baseLeft, u, topLevel)
  },

  _matchUnary(match, u, topLevel, onOK, base, reprs) { // ^x, …x, \x
    // reprs: ['quote', '^', /^/y] or [['func', 'input'], '\\', /\\/y]
    if (u === _specialParsedValue) {
      let op
      for (let i=0; i < reprs.length; i += 3) {
        if (op = match(reprs[i+2])) {
          const b = match(onOK)
          b === undefined && match.notEnoughInfo('Expected the arg of '+op.trim())
          return !_isArray(reprs[i]) ? [label(reprs[i]), b] : [...reprs[i].map(label), b]
        }
      }
      return match(base)
    }
    if (_isArray(u))
      for (let i=0; i < reprs.length; i += 3) {
        let ok = !_isArray(reprs[i]) ? u.length == 2 && u[0] === _unctx(reprs[i]) : (u.length == reprs[i].length+1)
        if (_isArray(reprs[i]) && ok)
          for (let j=0; j < reprs[i].length; ++j)
            if (u[j] !== _unctx(reprs[i][j])) { ok = false;  break }
        if (ok) {
          const g = _emitGrouping(match)
          match(reprs[i+1]), match(onOK, u[u.length-1])
          _emitGrouping(match, g)
          return
        }
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

  _fancyOutermost:{
    Initialize() {
      _fancyOutermost.syntax = fFunc
      // The most significant syntax functionality is collected in one place for readability.
      const sFunc = [['func', 'input'], '\\', '\\']
      function fFunc(match, u, topLevel) { // \f
        return _matchUnary(match, u, topLevel, _fancyOutermost, fLast, sFunc)
      }
      function fLast(match, u, topLevel) { // a,b,c
        return _matchSequence(match, u, topLevel, fPredicts, 'last', /\s*\,\s*/y, ',')
      }
      const sPredicts = ['predicts', '=', /(\s*)=\1/y]
      function fPredicts(match, u, topLevel) { // a=b
        return _matchLtR(match, u, topLevel, fSumSub, sPredicts)
      }
      const sSumSub = ['add', '+', /(\s*)\+\1/y, 'sub', '-', /(\s*)-(?!>)\1/y]
      function fSumSub(match, u, topLevel) { // a+b, a-b
        return _matchLtR(match, u, topLevel, fMultDiv, sSumSub)
      }
      const sMultDiv = ['mul', '*', /(\s*)\*\1/y, 'div', '/', /(\s*)\/\1/y]
      function fMultDiv(match, u, topLevel) { // a*b, a/b
        return _matchLtR(match, u, topLevel, fPow, sMultDiv)
      }
      const sPow = ['pow', '**', /(\s*)\*\*\1/y]
      function fPow(match, u, topLevel) { // a**b
        return _matchRtL(match, u, topLevel, fRead, fPow, sPow)
      }
      const sRead = ['readAt', '.', /(\s*)\.\1/y]
      function fRead(match, u, topLevel) { // a.b
        return _matchLtR(match, u, topLevel, fUnary, sRead)
      }
      const sUnary = ['quote', '^', '^', 'rest', '…', /…|\.\.\./y]
      function fUnary(match, u, topLevel) { // …a, ...a; ^a
        return _matchUnary(match, u, topLevel, _fancyOutermost, fGrouping, sUnary)
      }
      function fGrouping(match, u, topLevel) { // [x]
        if (u === _specialParsedValue) {
          // A non-bracketed basic call, or a bracketed sequence of values.
          if (!match(/\s*\[\s*/y)) return _basicValue(match, u, _basicCall, _fancyOutermost)
          const r = _basicMany(match, u, null, _fancyOutermost)
          if (r === undefined || !r.length) match.notEnoughInfo('Expected a value to group')
          if (!match(/\s*\]/y)) match.notEnoughInfo("Expected a closing grouping bracket")
          return r.length == 1 ? r[0] : r
        }
        // Serialize grouping brackets via first trying to serialize without them, then emitting them if arrived at the same spot.
        //   It's not fast, but `basic` and `fast` exist to make that not a problem.
        if (!_isArray(u)) return _basicValue(match, u)
        _emitGrouping.groupOpen = '[', _emitGrouping.groupClose = ']'
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
    call(match, u, topLevel) {
      let ctx, needsGrouping = !topLevel || match()
      if (_isArray(u) && u[0] === bound && u[1] instanceof Map && u.length == 3)
        ctx = u[1], u = u[2], needsGrouping = needsGrouping && match('[')
      const r = _fancyOutermost.syntax(match, u, topLevel)
      if (ctx) ctx.forEach((v,k) => (match(' '), match(_basicExtracted, [_extracted, k, v], _fancyOutermost.syntax))), needsGrouping && match(']')
      return r
      // .syntax (the matching function that specifies the syntax over basic values; see how Initialize is defined here)
    },
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
    docs:`A basic language for ordered-edge-list graphs. Text, numbers, structures, and connections.
Every pair of brackets (and the top level, if there is more than one value) is an array in memory (or a \`construct\`). Its items are space-separated. There are also labels (able to bind to pre-defined globals or user-defined bindings), strings, numbers, and graph bindings (\`a:b\` binds all instances of the label \`a\` to the value \`b\`, both before and after the binding, but only in its scope).
\`label\`, \`'string'\`, \`"string"\`, \`(0 1)\`, \`(a:2 a)\`.
This is a {more space-efficient than binary} representation for graphs of arrays.`,
    philosophy:`Lisp was nice for its time, but now we can have nice UI and AI, so Lisp needed a remastering.`,
    style:_(`_basicStyle`),
    parse:_(`_basicTopLevel`),
    serialize:_(`_basicTopLevel`),
    REPL:`also see \`(docs)\` or \`tutorial tutorial\`.`,
    insertLinkTo:_(`_basicLinkTo`),
    _escapeLabel:_(`_basicEscapeLabel`),
    _unescapeLabel:_(`_basicUnescapeLabel`),
    Initialize() { basic.labels = /-?\d*\.?\d+(?:[eE]+\d+)?|-Infinity|[^=!?:;\s\(\)\[\]\{\}<>@#$%\+\-\*\/\&\|\.'"`\,\\←→·⇒\ue000-\uf8ff]+/y },
  },

  fancy:{
    docs:`A language for ordered-edge-list graphs (like \`basic\`) with some syntactic conveniences.
\`label\`, \`'string'\`, \`"string"\`, \`(0 1)\`, \`(a:2 a)\`; \`1+2\`, \`\\?*2 5\`, \`2*[1+2]\`.`,
    style:_(`_basicStyle`),
    parse:_(`_fancyTopLevel`),
    serialize:_(`_fancyTopLevel`),
    REPL:`also type \`tutorial tutorial\` or \`(docs)\`.`,
    insertLinkTo:_(`_basicLinkTo`),
    _escapeLabel:_(`_basicEscapeLabel`),
    _unescapeLabel:_(`_basicUnescapeLabel`),
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
      const el = elem('string', [s[0][0], _highlightGlobalsInString(s[0].slice(1,-1)), s[0].slice(-1)])
      return el.title = 'string', el
    }
    if (_isArray(v) && v[0] === _extracted && v.length == 3 && s.length == 3 && typeof document != ''+void 0) {
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

    if (_isArray(s))
      for (let i=0; i < s.length; ++i) {
        if (typeof document != ''+void 0 && s[i] instanceof Node && s[i].to === v)
          elemValue(s[i], null, true) // Grouped values are highlighted only once
        const t = typeof s[i] == 'string' && s[i].trim()
        if (t && (t === '(' || t === '[' || t === '{' || t === ')' || t === ']' || t === '}'))
          s[i] = _colored(elem('bracket', s[i]), 33) // Brackets are brown
      }
    if (typeof document != ''+void 0 && s[0] instanceof Node && s[1] instanceof Node && s[1].tagName === 'BRACKET')
      s[0].classList.add('funcCall'), s[1].classList.add('funcCall')

    let hasOperators = false
    if (_isArray(s) && _isArray(u) && !_isLabel(u) && s.length > 1)
      for (let i = 0; i < s.length; ++i)
        if (s[i] && typeof s[i] == 'string' && s[i] !== '[' && s[i] !== ']')
          s[i] = elem('operator', s[i]), hasOperators = true

    const backctx = _invertBindingContext(ctx)
    if (_isLabel(u) && backctx.has(v) && u[1] === backctx.get(v))
      return _colored(elem('known', s), 1, 0) // bold
    let el = typeof document != ''+void 0 && s instanceof Element ? s : elem('node', s)
    if (typeof document != ''+void 0) {
      if (hasOperators)
        el.classList.add('hasOperators')
      if (!_isArray(v))
        el.classList.add('nonArray')
      if (_isLabel(u))
        el.style.color = _valuedColor(v), el.classList.add('label')
      let title = ''
      if (!title && _isArray(v) && v.length && backctx.has(v[0])) title = backctx.get(v[0])
      if (!title && _isArray(u) && u.length && backctx.has(u[0])) title = backctx.get(u[0])
      el.title = title
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
    readAt:{
      parse(str, ctx) {
        // ctx is an object here, not a Map from label objects like in `parse`.
        if (!str) throw "Expected input"
        if (!ctx) ctx = defines(Self, readAt)
        const regex = /[ \n]+|:|\(|\)|`(?:[^`]|``)*`|'(?:[^']|'')*'|"(?:[^"]|"")*"|[^ \n:\(\)'"`]+|$/g
        let [result, i = 0, j, ctxs = [ctx], visited = new Set] = interrupt(5)
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
        } catch (err) { if (err === interrupt) interrupt.stack.push(result, i, j, ctxs, visited);  throw err }

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
      return defines(fast, readAt).parse(str)
    },
    serialize:_(`_basicTopLevel`),
    philosophy:`This could be made even more efficient (make it variable-pointer-length binary, serialize numbers as binary), but we aren't that crazy yet.`,
  },

  _fancierOutermost:{
    Initialize() {
      _fancierOutermost.syntax = fFunc
      // The most significant syntax functionality is collected in one place for readability.
      const sFunc = [['func', 'input'], '\\', '\\']
      function fFunc(match, u, topLevel) { // \f
        if (!u || typeof u != 'object' && typeof u != 'function') return _basicValue(match, u)
        return _matchUnary(match, u, topLevel, _fancierOutermost, fLast, sFunc)
      }
      function fLast(match, u, topLevel) { // a;b;c
        return _matchSequence(match, u, topLevel, fMultiFunc, 'last', /\s*;\s*/y, ';')
      }
      function fMultiFunc(match, u, topLevel) { // a->b->c
        return _matchSequence(match, u, topLevel, fMultiFuncType, 'func', /(\s*)(?:→|->)\1/y, '→')
      }
      function fMultiFuncType(match, u, topLevel) { // a⇒b⇒c
        return _matchSequence(match, u, topLevel, fArrayType, 'funcType', /(\s*)⇒\1/y, '⇒')
      }
      function fArrayType(match, u, topLevel) { // a&b&c
        return _matchSequence(match, u, topLevel, fCompare, 'arrayType', /(\s*)&\1/y, '&')
      }
      const sCompare = ['less', '<', /(\s*)<\1/y]
      function fCompare(match, u, topLevel) {
        return _matchLtR(match, u, topLevel, fPredicts, sCompare)
      }
      const sPredicts = ['predicts', '=', /(\s*)=\1/y, 'setFuture', '←', /(\s*)(?:←|<-)\1/y]
      function fPredicts(match, u, topLevel) { // a=b
        return _matchLtR(match, u, topLevel, fSumSub, sPredicts)
      }
      const sSumSub = ['add', '+', /(\s*)\+\1/y, 'sub', '-', /(\s*)-(?!>)\1/y]
      function fSumSub(match, u, topLevel) { // a+b, a-b
        return _matchLtR(match, u, topLevel, fMultDiv, sSumSub)
      }
      const sMultDiv = ['mul', '*', /(\s*)[\*·]\1/y, 'div', '/', /(\s*)\/\1/y, 'matMul', '@', /(\s*)@\1/y]
      function fMultDiv(match, u, topLevel) { // a*b, a/b
        return _matchLtR(match, u, topLevel, fPow, sMultDiv)
      }
      const sPow = ['pow', '**', /(\s*)\*\*\1/y]
      function fPow(match, u, topLevel) { // a**b
        return _matchRtL(match, u, topLevel, fRead, fPow, sPow)
      }
      const sRead = ['readAt', '.', /(\s*)\.\1/y]
      function fRead(match, u, topLevel) { // a.b
        return _matchLtR(match, u, topLevel, fUnary, sRead)
      }
      const sUnary = ['quote', '^', '^', 'rest', '…', /…|\.\.\./y, 'sum', '+', '+']
      function fUnary(match, u, topLevel) { // …a, ...a;  ^a;  +a
        return _matchUnary(match, u, topLevel, _fancierOutermost, fGrouping, sUnary)
      }
      function _baseOf(arr) { for (let i=0; _isArray(arr[0]) && arr[0].length && i < 10; ++i) arr = arr[0];  return arr[0] }
      function fGrouping(match, u, topLevel) { // (x)
        if (u === _specialParsedValue) {
          // A non-bracketed basic call, or a bracketed sequence of values.
          if (!match(/\s*\(\s*/y)) return fCallBase(match, u)
          const r = _basicMany(match, u, null, _fancierOutermost)
          if (r === undefined || !r.length) match.notEnoughInfo('Expected a value to group')
          if (!match(/\s*\)/y)) match.notEnoughInfo("Expected a closing grouping bracket")
          return r.length == 1 ? r[0] : r
        }
        // Emit `(a b c)` if `(0 1 2)`.
        const base = _isArray(u) && _baseOf(u)
        const linearityPreferred = _isArray(u) && u.length > 1 && (defines(base, construct) !== undefined || !_isArray(base) && typeof base != 'function') && base !== concept
        if (base === map) {
          _basicValue(match, u, _basicMany, _fancierOutermost)
          return
        }
        if (linearityPreferred) {
          !topLevel && match('(')
          _basicMany(match, u, null, _fancierOutermost)
          !topLevel && match(')')
          return
        }
        // Serialize grouping brackets via first trying to serialize without them, then emitting them if arrived at the same spot.
        //   It's not fast, but `basic` and `fast` exist to make that not a problem.
        if (!_isArray(u)) return _basicValue(match, u)
        if (!u.length) return match(_basicValue, arrayObject), match('('), match(')')
        _emitGrouping.groupOpen = '(', _emitGrouping.groupClose = ')'
        if (!_needsGrouping.pos) _needsGrouping.pos = new Set
        const pos = match()
        if (_needsGrouping.pos.has(pos)) // Emit base if the second pass is over.
          return !topLevel || u.length <= 1 ? fCallBase(match, u) : _basicValue(match, u, _basicMany, _fancierOutermost)
        _needsGrouping.pos.add(pos)
        try {
          return match(_fancierOutermost, u, topLevel)
        } finally { _needsGrouping.pos.delete(pos) }
      }
      function fCallBase(match, u) { // f(a,b) or f{a,b, c,d}
        if (u === _specialParsedValue) {
          let f
          if (match(/\s*\(\s*/y)) {
            f = _fancierOutermost(match, u)
            !match(/\s*\)\s*/y) && match.notEnoughInfo("Expected the closing grouping bracket `)`")
          } else f = match(_basicValue, null, _fancierOutermost)
          if (f === undefined) return
          while (true) {
            let ok = false
            if (match('(')) {
              f = [f], ok = true
              while (!match(')')) {
                const v = match(_basicMany, null, _fancierOutermost)
                if (v === undefined || !v.length) break
                f.push(v.length == 1 ? v[0] : v)
                if (match(',')) match(/\s+/y)
              }
            }
            else if (match('{')) {
              const m = _basicMany(match, u, [label('map'), null, null], _fancierOutermost)
              match(/\s+/y)
              !match('}') && match.notEnoughInfo("Expected the closing bracket `}`")
              f = [f, m], ok = true
            }
            if (!ok) break
          }
          return f
        }
        if (!_isArray(u)) return _basicValue(match, u)
        if (u[0] === bound) return _fancierOutermost(match, u)

        if (_isLabel(u) || _isArray(u) && u[0] === _extracted && u.length == 3)
          return _basicValue(match, u, null, _fancierOutermost)

        if (!u.length) return match(_basicValue, arrayObject), match('('), match(')')
        match(!_isArray(u[0]) ? _basicValue : _fancierOutermost, u[0])
        if (u.length == 2 && _isArray(u[1]) && u[1][0] === map)
          return match(_fancierOutermost, u[1])
        match('(')
        for (let i=1; i < u.length; ++i)
          match(_fancierOutermost, u[i]), i < u.length-1 && match(',')
        match(')')
      }
    },
    call(match, u, topLevel) {
      let ctx, needsGrouping = !topLevel || match()
      if (_isArray(u) && u[0] === bound && u[1] instanceof Map && u.length == 3)
        ctx = u[1], u = u[2], needsGrouping = needsGrouping && match('(')
      const r = _fancierOutermost.syntax(match, u, topLevel)
      if (ctx) ctx.forEach((v,k) => (match(' '), match(_basicExtracted, [_extracted, k, v], _fancierOutermost.syntax))), needsGrouping && match(')')
      return r
      // .syntax (the matching function that specifies the syntax over basic values; see how Initialize is defined here)
    },
  },

  _fancierTopLevel(match, u) { // (f); a b c c:x; a:b
    if (u === _specialParsedValue) {
      let arr = _basicMany(match, u, null, _fancierOutermost)
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
    _fancierOutermost(match, u, true)
  },

  fancier:{
    docs:`A language for ordered-edge-list graphs (like \`basic\`) with some syntactic conveniences.
Calls can either be space-separated or be functions with bracketed comma-separated argument lists.
\`label\`, \`'string'\`, \`"string"\`, \`0(1)\`, \`(a:2 a)\`; \`add 1 add(2,3)\`, \`\\input*2 5\`, \`2*(1+2)\`.`,
    style:_(`_basicStyle`),
    parse:_(`_fancierTopLevel`),
    serialize:_(`_fancierTopLevel`),
    REPL:`also type \`tutorial tutorial\` or \`docs()\`.`,
    insertLinkTo:_(`_basicLinkTo`),
    _escapeLabel:_(`_basicEscapeLabel`),
    _unescapeLabel:_(`_basicUnescapeLabel`),
  },

  _causeInterrupt(cause, toReEnter = undefined) {
    if (interrupt.stack) error("Cannot cause an interrupt while restoring from an interrupt")
    call.env[_id(step)] = _checkInterrupt.step
    call.env[_id(_checkInterrupt)] = cause
    call.env[_id(call)] = call.depth
    interrupt.stack = call.env[_id(interrupt)] = _allocArray(0)
    if (toReEnter) _jobs.reEnter = toReEnter
    throw interrupt
  },

  _msBeforeInterrupt:[
    _(`settings`),
    10,
    `When executing a job, work for at least ??? milliseconds before interrupting.
An interrupt takes time.
10 ms should be appropriate for smooth UI interaction, but for computation-intensive work, higher values should be preferred.`,
    _(`rangeSetting`),
    10,
    300,
    5,
  ],

  _checkInterrupt:{
    docs:`Checks whether an interrupt is appropriate right now.`,
    call(cause) {
      if (interrupt.noInterrupt) return
      if (!call.env) error("This must be done in an explicit", _newExecutionEnv)
      if (!interrupt.stack) {
        // If we stepped enough (ensuring progress), and either we have worked for N ms or the nesting depth is as wanted by _pausedToStepper, interrupt.
        if (call.env[_id(step)])
          --call.env[_id(step)], ++_checkInterrupt.step
        else if (call.env[_id(_pausedToStepper)] !== undefined && call.depth <= call.env[_id(_pausedToStepper)])
          _causeInterrupt(cause, _pausedToStepper)
        else if (_timeSince(interrupt.started, true) > _msBeforeInterrupt[1])
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
      let [int = true] = interrupt(1)
      try {
        if (int) int = false, _causeInterrupt(expr, _pausedToStepper)
        if (int === false) ++_checkInterrupt.step, int = 0
        return call(expr)
      } catch (err) { if (err === interrupt) interrupt.stack.push(int);  throw err }
    },
  },

  _pausedToStepper:{
    docs:`Pauses a job and displays its stepping interface: ▶ ▲ ⇉ ▼.
Not for use inside of that paused job.

(Technically, we could copy/restore execution states (arrays in \`_id(interrupt)\` should be copied because running the original would modify them, but we don't really use other types of objects for temporary state), and also have per-cause breakpoints, and also have a way of inspecting function state when interpreting, but debuggers are dime-a-dozen anyway, so who cares.)`,
    call(expr, env, then, before = env[_id(print)] || Self.into) {
      if (before instanceof Map) before = before.get(print)
      if (!env[_id(print)]) return
      _cancel(env, true), _jobs.limbo.push(expr, env, then)
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

      // Make hover-highlighting work.
      if (env[_id(print)] instanceof Map) env[_id(print)].set(print, el); else env[_id(print)] = el

      const pre = _smoothHeightPre(before.parentNode)
      before.style.display = 'none'
      before.parentNode.insertBefore(el, before)
      _smoothHeightPost(before.parentNode, pre)

      function onClick(n) {
        // Show style, remove interface, remember to interrupt again, and re-schedule the job.
        _cancel(env, true)
        elemValue(el, null, true, true)
        if (env[_id(print)] instanceof Map) env[_id(print)].set(print, before); else env[_id(print)] = before
        justRun.onclick = lessDepth.onclick = eqDepth.onclick = moreDepth.onclick = null
        const pre = _smoothHeightPre(before.parentNode)
        before.style.removeProperty('display')
        el.remove() // (Not very efficient, destroying and re-creating the DOM for each step, but it works.)
        _smoothHeightPost(before.parentNode, pre)
        env[_id(_pausedToStepper)] = n !== undefined ? env[_id(call)]+n : undefined
        _schedule(expr, env, then)
      }
    },
  },

  interrupt:{
    docs:`Used to make functions re-entrant in a non-interruptible host language, for better UX.
Define this to be \`false\` in a global if it will never interrupt. (\`_debugInterrupt\` can catch lies here.)

Technical details of usage:
\`_causeInterrupt(cause)\` to unconditionally interrupt execution.
Create function state in a JS function like \`let [i = 0, j = 0] = interrupt(2)\`, in particular for counters of loops. Make sure to put interruptible computations not here but inside the try/catch below, to not corrupt interrupt state. There is almost no error-checking, for efficiency!
Wrap function body after getting its state in \`try{…}catch(err){ if (err === interrupt) interrupt.stack.push(i,j);  throw err }\`.`,
    readAt:{
      _msBeforeInterrupt:_(`_msBeforeInterrupt`),
      _debugInterrupt:_(`_debugInterrupt`),
      check:_(`_checkInterrupt`),
      step:_(`step`),
    },
    philosophy:`Termination checking (totality) is unnecessary if the host can just interrupt and continue. In fact, it is harmful to provide a false assurance of everything terminating {in reasonable time}.
Interruption (and sandboxing) is absolutely essential for being able to actually use a program comfortably, and for stepping through the program, but no one buzzes about it. Probably because almost all rely on the OS to provide it via processes, and/or heuristic-based totality guarantees.`,
    _cancel(stack) { stack && stack.forEach(dispose) },
    call(retrieve) {
      if (retrieve !== retrieve>>>0)
        error("Expected the count of items to retrieve, got", retrieve)
      const tmp = interrupt.tmp || (interrupt.tmp = []), stack = interrupt.stack
      if (!stack) return tmp.length = 0, tmp
      if (stack.length < retrieve)
        error("Corrupted the interrupt state somewhere; check correctness of every store/restore, and/or use", _debugInterrupt)

      tmp.length = retrieve
      const start = stack.length - retrieve
      for (let i = start; i < stack.length; ++i) tmp[i - start] = stack[i]
      stack.length = start
      if (!start) _allocArray(stack), interrupt.stack = call.env[_id(interrupt)] = undefined

      return tmp

      // .tmp, .noInterrupt, .started, .stack
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

  _lineCount(str) {
    if (typeof str == 'number') return 0
    let i = 0, n = 0
    while ((i = str.indexOf('\n', i)+1) > 0) ++n
    return n
  },

  Rewrite:{
    docs:`\`Rewrite()\`: view the next rewrite in an \`<iframe>\`.
Also is a namespace for rewriting \`Self\`'s code to a different form.

It makes the system adaptable to different usage scenarios, in addition to giving an in-system way to modify any code directly and safely.`,
    todo:`Ability to select a subset of functions (and their dependencies, but not (only) definitions).
Ability to run a function by default. (It's like compiling a program into an executable.)
Ability to rewrite into an importable module.`,
    readAt:{
      editRewrite:_(`editRewrite`),
      extension:_(`ToExtension`),
      readableJS:_(`ToReadableJS`),
      scopedJS:_(`ToScopedJS`),
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
      if (markLines) write(`const __line = function(line, fun) { return __line.lines[''].push(line, fun), fun }\n`)
      if (markLines) write(`__line.lines = {['']:[]}\n`)
      write(`const _ = (function is(name) {\n`)
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
          write('_('), write(typeof names.get(x) == 'number' ? ''+names.get(x) : str(names.get(x)), true), write(')')
        else if (!_isArray(x) && defines(x, deconstruct)) {
          // Deconstructed concepts become is(…) to evaluate on start.
          const d = deconstruct(x)
          if (!_isArray(d) || typeof d[0] != 'function') throw "Must be a regular function"
          write('_('), put(d), write(')')
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
          write('{'), ++depth // {…} in readAt.
          Object.keys(x).forEach(k => (write('\n'), method(identifier(k), x[k])))
          --depth, write('\n}')
        } else if (typeof x == 'function' || x && x[defines.key]) {
          // Functions get put as-is or as a definition of call.
          const def = new Map
          x[defines.key] && Object.keys(x[defines.key]).forEach(k => {
            const v = x[defines.key][k]
            let c = resolve(concept.idToKey[+k])
            if (c !== readAt && v instanceof Map) throw "Only definitions can be Maps"
            if (c !== readAt && (v instanceof Map || v && !_isArray(v) && !v[defines.key] && typeof v == 'object'))
              throw "Only the definition of readAt can be an object"
            def.set(c, v)
          })
          if (def) {
            if (x === Self)
              def.set(readAt, undefined)
            if (typeof x == 'function')
              def.set(call, fun(x))
            write('{'), ++depth // {…} in definitions.
            def.forEach((v,k) => (write('\n'), method(identifier(names.get(k)), v)))
            --depth, write('\n}')
          } else put(fun(x))
        } else throw "Unknown value to put"
      }
      function str(s) { return "`" + String(s).replace(/`|\\|${/g, s => '\\' + s) + "`" }
      function identifier(s) { return s && +s === +s || /^[_a-zA-Z]+$/.test(s) ? ''+s : '[' + str(s) + ']' }
      function fun(f) { return _unevalFunction(f) }
      function isFunc(x) { return _isArray(x) && x[0] === jsEval && typeof x[1] == 'string' }
      function method(key, v, ignoreName = false) {
        if (!_isLabel(v) && net.has(v)) v = net.get(v)
        if (!markLines && typeof v == 'function' && !v[defines.key] && (ignoreName || !names.has(v))) v = fun(v)
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

        // preload is for easier readAts. load is basically a copy of `bound` with a little notational convenience stuff thrown in.
        preload(net, globals)
        load(net, globals, true)
        Object.keys(net).forEach(k => k && +k === +k && delete net[k])
        if (net.interrupt) net.interrupt.noInterrupt = false

        Initialize.call(globals, net, typeof __line != ''+void 0 ? __line.lines : undefined)
        postload()

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
            if (from[k] && Object.getPrototypeOf(from[k]) === _) {
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
          if (from && Object.getPrototypeOf(from) === _) {
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
                const k = load(_(key))
                if (k !== call || typeof from[key] != 'function')
                  (d || (d = Object.create(null)))[_id(k)] = load(from[key], undefined, k === readAt)
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
          if (from !== undefined) {
            const x = from.is.map(x => load(x))
            const to = load(_('defines'))(load(from.is[0]), load(_('construct')))(x)
            constructed.set(to, from)
            env.set(from, x)
            return to
          } else
            constructed.forEach((from, obj) => construct(env.get(from), obj)), constructed.clear()
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
          const c = defines(d, construct)
          if (!_isArray(d) || _isArray(d[0]) || typeof defines(d[0], construct) != 'function') error("Invalid deconstruction:", d)
          let b = 0
          // For constructs, we want to put `name = construct([...d]);  <and much later>  construct([...d], name)`
          write(name), write('='), put(c), write('(['), d.forEach(el => (b++ && write(','), put(el))), write('])\n')
        }
      })
      // Put aliases.
      net.forEach((v,k) => {
        if (!_isLabel(k) || k[1] === names.get(v)) return
        if (!_isValidIdentifier(k[1], true) || !_isValidIdentifier(names.get(v), true)) return
        write('let '), write(k[1]), write('='), put(v), write('\n')
      })
      // Initialize the network.
      if (net.has(label('interrupt')))
        write(`interrupt.noInterrupt = false\n`)
      write(`\nInitialize.call(typeof self !== ''+void 0 ? self : typeof global !== ''+void 0 ? global : window, `)
      write(`{${[...net.entries()].map(([k,v]) => !_isLabel(k) ? null : k[1] === names.get(v) ? k[1] : k[1]+':'+(names.get(v)||v)).filter(x => x).join(',')}}`)
      write(markLines ? `, __line.lines` : `, undefined`)
      write(`, ${opt && opt.into || null}`)
      write(')\n')
      // Construct things.
      names.forEach((name, v) => {
        if (!_isArray(v) && defines(v, deconstruct) !== undefined) {
          const d = deconstruct(v)
          const c = defines(d, construct)
          let b = 0
          put(c), write('(['), d.forEach(el => (b++ && write(','), put(el))), write('],'), write(name), write(')\n')
        }
      })
      write(`\n})()`)
      return s.join('')

      function resolve(x) {
        return !_isLabel(x) && net.has(x) ? net.get(x) : x
      }
      function mark(x, topLevel) {
        // Gives names to all objects in the graph.
        if (x == null || typeof x == 'number' || typeof x == 'boolean') return
        x = resolve(x)
        let name
        if (names.has(x)) return; else if (!topLevel) names.set(x, name = '$' + (n++).toString(36))
        try {
          if (!_isArray(x) && defines(x, deconstruct)) return mark(deconstruct(x))
          else if (x instanceof Map) x.forEach((v,k) => (!topLevel && mark(k), mark(v)))
          else if (_isArray(x)) x.forEach(x => mark(x))
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
        // Puts the simple object creator of `x`, to be filled.
        x = resolve(x)
        if (!ignoreName && names.has(x)) write(names.get(x))
        else if (!_isArray(x) && defines(x, deconstruct)) write('0')
        else if (typeof x == 'function') {
          const f = _unevalFunction(x)
          if (f[2] !== undefined && f[2] !== net && f[2] !== defines(Self, readAt))
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
        // Fills the created object.
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
    readAt:{
      interrupt:_(`interrupt`),
      jsEval:_(`jsEval`),
      argCount:_(`argCount`),
      dispose:_(`dispose`),
      userTime:_(`userTime`),
      realTime:_(`realTime`),
      memorySince:_(`memorySince`),
      ClearCaches:{
        docs:`When called, clears the oldest half of entries in every cache.`,
        argCount:0,
        call() {
          if (impureHave()) return impureLoad(); else impureSave(null)
          halve(_id.xToIndex)
          halve(_valuedColor.m)
          _fillAdjustInputs.length = 0
          if (_allocArray.free) _allocArray.free.length >>>= 1
          if (_resolveStack.functions) {
            const k = Object.keys(_resolveStack.functions)
            for (let i = 0; i < (k.length>>>1); ++i) delete _resolveStack.functions[k[i]]
          }
          // And WeakMaps: _invertBindingContext.cache.
          function halve(m) { if (m) _limitMapSize(m, m.size>>>1) }
        },
      },
    },
    permissionsElem(el) { el.classList.add('warning');  return el },
  },

  _allocArray:{
    docs:`\`_allocArray(Length)\`⇒\`Array\` as a replacement for \`[]\` and \`_allocArray(Array)\` to re-use arrays.`,
    call(a) {
      if (!_allocArray.free) _allocArray.free = []
      if (typeof a == 'number' && a === a>>>0) {
        const arr = _allocArray.free.length ? _allocArray.free.pop() : [];  arr.length = a;  return arr
      }

      // if (_allocArray.free.includes(a)) errorStack("Double-free of", a, "first freed at", _resolveStack(_allocArray.s.get(a)))
      // else (_allocArray.s || (_allocArray.s = new WeakMap)).set(a, new Error().stack)
      // return // To test whether there are any errors in re-using arrays, uncomment this line, and/or the lines above.

      if (!_isArray(a)) errorStack("Expected array length or an array, got", a)
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





  _printAll:{
    docs:`Prints all defined sub-functions of a value.`,
    call(f, value) {
      let [ins = defines(f, _printAll), i = 0] = interrupt(2)
      try {
        if (!ins) return
        for (; i < ins.length; ++i) {
          let r
          try { r = ins[i](value) }
          catch (err) { if (err === interrupt) throw err;  print(_errorRepr(err)) }
          r !== undefined && print(r !== _onlyUndefined ? r : undefined)
        }
      } catch (err) { if (err === interrupt) interrupt.stack.push(ins, i);  throw err }
    },
  },

  _clearStyle(el) {
    if (!el.style.length) el.removeAttribute('style')
    if (!el.classList.length) el.removeAttribute('class')
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
            let [v = _allocArray(el.childNodes.length), anyTrue = false, anyFalse = false, i1 = 0, ch1 = el.firstChild, next1 = ch1 && ch1.nextSibling, i2 = 0, ch2 = el.firstChild, next2 = ch2 && ch2.nextSibling] = interrupt(9)
            try {
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
            } catch (err) { if (err === interrupt) interrupt.stack.push(v, anyTrue, anyFalse, i1, ch1, next1, i2, ch2, next2), v = null;  throw err }
            finally { _isArray(v) && _allocArray(v) }
          }
        }
      }, .5)
    },
  },












































})
})()
