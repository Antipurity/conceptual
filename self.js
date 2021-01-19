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
  const object = new Map
  const constructed = new Map

  const defKey = Symbol('defines')

  // preload is for easier readAts. load is basically a copy of `bound` with a little notational convenience stuff thrown in.
  preload(net, globals)
  load(net, globals, true)
  Object.keys(net).forEach(k => k && +k === +k && delete net[k])
  Object.keys(net).forEach(k => net[k] = globals[k])
  if (net.interrupt) net.interrupt.noInterrupt = false

  postload()
  Initialize.call(globals, net, typeof __line != ''+void 0 ? __line.lines : undefined)
  env.clear(), object.clear(), constructed.clear()

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
        if (into[k] === undefined && +k !== +k) into[k] = new Array(from[k].length)
        return
      }
      if (into[k] !== from[k] && +k !== +k) into[k] = from[k]
    })
    if (from.defines) into.defines.key = defKey
    if (from.call && from._newExecutionEnv) into.call.env = from._newExecutionEnv()
    if (from.interrupt) into.interrupt.noInterrupt = true
  }
  function load(from, into, inLookup) {
    // Handle is(…) (as ref-to-global) and arrays and objects (as definitions) specially.

    // Cache to prevent cycles from referring to old not-loaded versions of objects.
    if (env.has(from)) return env.get(from)
    if (from && Object.getPrototypeOf(from) === _) {
      // Look up symbols in the network.
      if (!object.has(from.is)) {
        if (Array.isArray(from.is)) into = postload(from)
        else if (!(from.is in net)) throw new Error("Not a link to an existing thing: "+from.is)
        else into = load(net[from.is], globals[from.is])
        env.set(from, into), object.set(from.is, into)
      }
      return object.get(from.is)
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
        }
        return into
      }
    }
    if (Array.isArray(from)) {
      // Look into arrays and load their elements.
      if (into === undefined) into = new Array(from.length)
      env.set(from, into)
      for (let i = 0; i < into.length; ++i) into[i] = load(from[i])
      return into
    }
    return from
  }
  function postload(from) {
    if (from !== undefined) {
      const x = from.is.map(x => load(x))
      const to = load(_('defines'))(load(from.is[0]), load(_('construct')))(x)
      constructed.set(to, from)
      env.set(from, to)
      return to
    } else
      constructed.forEach((from, obj) => construct(from.is.map(x => load(x)), obj)), constructed.clear()
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
      `The nightmare reborn`,
    ],
    call(net, lines, into) {
      if (!net || 'ctx' in Self) throw "Do not call Initialize manually."
      if ('→'.charCodeAt() !== 8594) throw "Unicode data got garbled."
      if (defines(call, docs).indexOf('\n ') >= 0) throw "Depth got added to strings."

      net[undefined] = undefined, Initialize.lines = lines

      // Turn `net` into maps.
      let ctx = new Map
      Object.keys(net).forEach(k => ctx.set(k, net[k]))
      ctx.set('_globalScope', net)
      Self.ctx = ctx
      Self[defines.key][_id(readAt)] = net, Object.freeze(Self[defines.key])

      // Initialize every global that defines `Initialize`.
      for (let k in net)
        if (!isArray(net[k]) && typeof defines(net[k], Initialize) == 'function')
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
      callAdjust:_(`callAdjust`),
      Time:_(`Time`),
      Numeric:_(`Numeric`),
      Data:_(`Data`),
    },
  },

  Documentation:{
    docs:`Documentation-related functions.`,
    readAt:{
      tutorial:_(`tutorial`),
      docs:_(`docs`),
      referencedBy:_(`referencedBy`),
      referencesTo:_(`referencesTo`),
      definersOf:_(`definersOf`),
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
      zeros:_(`zeros`),
      identity:_(`identity`),
      ones:_(`ones`),
      randomVar:_(`randomVar`),
      randomVarData:_(`randomVarData`),
      varData:_(`varData`),
    },
  },

  Arithmetic:{
    examples:[
      `Loss goes down.`,
      [
        `repeat ^randomVar(ones)+randomVar(ones)=5 100`,
      ],
      [
        `repeat ^randomVar(ones)*randomVar(ones)=5 100`,
      ],
      [
        `repeat ^randomVar(ones)-randomVar(ones)=5 100`,
      ],
      [
        `repeat ^randomVar(ones)/randomVar(ones)=5 100`,
      ],
      [
        `repeat ^randomVar(ones)**randomVar(ones)=5 1000`,
      ],
      [
        `repeat ^sqrt(randomVar(ones))=5 1000`,
      ],
      [
        `repeat ^exp(randomVar(ones))=5 100`,
      ],
      [
        `repeat ^expm1(randomVar(ones))=5 100`,
      ],
      [
        `repeat ^log(randomVar(ones))=5 1000`,
      ],
    ],
    docs:`This is where we shamelessly copy over the functions of TensorFlowJS that we need.`,
    readAt:{
      assertFinite:_(`assertFinite`),
      less:_(`less`),
      where:_(`where`),
      add:_(`add`),
      sub:_(`sub`),
      mul:_(`mul`),
      div:_(`div`),
      pow:_(`pow`),
      sqrt:_(`sqrt`),
      exp:_(`exp`),
      expm1:_(`expm1`),
      log:_(`log`),
      sum:_(`sum`),
      max:_(`max`),
      abs:_(`abs`),
      floor:_(`floor`),
      sign:_(`sign`),
      clip:_(`clip`),
      argmax:_(`argmax`),
      norm:_(`norm`),
      matMul:_(`matMul`),
    },
  },

  assertFinite:{
    docs:`For debugging.`,
    argCount:1,
    keep:1,
    dispose:1,
    interrupt:false,
    call(x) {
      if (_isDisposable(x)) {
        const data = x.dataSync()
        for (let i = 0; i < data.length; ++i)
          if (data[i] !== data[i] || !isFinite(data[i]))
            errorStack("Got", data[i], "from", x)
      }
      return x
    },
    mergeAdjustment:_(`_mergeTensors`),
    adjust:[
      _(`array`),
      _(`_dout`),
    ],
  },

  less:{
    type:[
      _(`funcType`),
      _(5696),
      _(5696),
      [
        _(`boolsType`),
        [
          _(`rest`),
          `Sizes`,
        ],
      ],
    ],
    docs:`a<b for each value.`,
    argCount:2,
    dispose:true,
    interrupt:false,
    call(a,b) { return typeof a == 'number' && typeof b == 'number' ? a<b : _tf(tf.less(a,b)) },
  },

  where:{
    type:[
      _(`funcType`),
      [
        _(`boolsType`),
        [
          _(`rest`),
          `Sizes`,
        ],
      ],
      _(5696),
      _(5696),
      _(5696),
    ],
    readAt:{
      values:_(`_whereValues`),
    },
    docs:`a?b:c for each value.`,
    argCount:3,
    dispose:true,
    interrupt:false,
    call(a,b,c) {
      if (typeof a == 'boolean') return a?b:c // `_whereValues`
      // Since `tf.where` doesn't broadcast numbers, we must do it ourselves. (A one-liner otherwise.)
      //   (Wouldn't have been a problem with manual compilation for GPU…)
      const shape = a && a.size > 1 ? a.shape : b && b.size > 1 ? b.shape : c && c.size > 1 ? c.shape : a.shape
      let db=false, dc=false
      if (typeof b == 'number' || b.size === 1) db=true, b = tf.broadcastTo(b, shape)
      if (typeof c == 'number' || c.size === 1) dc=true, c = tf.broadcastTo(c, shape)
      try { return _tf(tf.where(a,b,c)) }
      finally { db && dispose(b), dc && dispose(c) }
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

  _whereValues:_([
    _(`concept`),
    _(`call`),
    _(`where`),
    _(`type`),
    [
      _(`funcType`),
      [
        _(`boolsType`),
        1,
      ],
      `Type`,
      `Type`,
      `Type`,
    ],
    _(`docs`),
    `A differently-\`type\`d \`where\`.`,
  ]),

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
    docs:`\`(i8 array(…Numbers))\`: creates a flat array of signed 8-bit integers.`,
    argCount:1,
    call(x) { return new Int8Array(x) },
  },

  i16:{
    docs:`\`(i16 array(…Numbers))\`: creates a flat array of signed 16-bit integers.`,
    argCount:1,
    call(x) { return new Int16Array(x) },
  },

  i32:{
    docs:`\`(i32 array(…Numbers))\`: creates a flat array of signed 32-bit integers.`,
    argCount:1,
    call(x) { return new Int32Array(x) },
  },

  u8:{
    docs:`\`(u8 array(…Numbers))\`: creates a flat array of unsigned 8-bit integers.`,
    argCount:1,
    call(x) { return new Uint8Array(x) },
  },

  u16:{
    docs:`\`(u16 array(…Numbers))\`: creates a flat array of unsigned 16-bit integers.`,
    argCount:1,
    call(x) { return new Uint16Array(x) },
  },

  u32:{
    docs:`\`(u32 array(…Numbers))\`: creates a flat array of unsigned 32-bit integers.`,
    argCount:1,
    call(x) { return new Uint32Array(x) },
  },

  f32:{
    docs:`\`(f32 array(…Numbers))\`: creates a flat array of 32-bit floats.`,
    argCount:1,
    call(x) { return new Float32Array(x) },
  },

  f64:{
    docs:`\`(f64 array(…Numbers))\`: creates a flat array of 64-bit floats.`,
    argCount:1,
    call(x) { return new Float64Array(x) },
  },

  Data:{
    docs:`A namespace for some data-representation-related functions.`,
    readAt:{
      Constructions:_(`Constructions`),
      array:_(`array`),
    },
  },

  Time:{
    docs:`A namespace for some time-related functionality.`,
    readAt:{
      repeat:_(`repeat`),
      userTime:_(`userTime`),
      realTime:_(`realTime`),
      timeLimit:_(`timeLimit`),
      await:_(`await`),
    },
  },

  UI:{
    docs:`A namespace for user interface functionality.`,
    philosophy:`Even when switching languages and/or bindings makes some things look the same, being able to {highlight ref-equal objects}, and {view the basic default-bindings serialization}, and {link to actual values without going through text}, makes meaning a first-class citizen. This is impossible to achieve without first-class UI support, but with it, incomprehensible code can be easy to understand (replicate in a mind).
Keep names short and rely on the IDE. Route gradient not through the closest text representation, but through actual dependencies.`,
    readAt:{
      Languages:_(`Languages`),
      hierarchy:_(`hierarchy`),
      print:_(`print`),
      REPL:_(`REPL`),
      contextMenu:_(`contextMenu`),
      elem:_(`elem`),
      _useDarkTheme:_(`_useDarkTheme`),
      _disableSmoothTransitions:_(`_disableSmoothTransitions`),
      _noBoxStylingForPrograms:_(`_noBoxStylingForPrograms`),
      _crispHighlight:_(`_crispHighlight`),
      _hoverHighlightsDOMValues:_(`_hoverHighlightsDOMValues`),
      _maxHighlightedValues:_(`_maxHighlightedValues`),
    },
  },

  Languages:{
    docs:`A namespace for languages and their handling.
One of programming's most annoying debates is tabs vs spaces. With UI support, you can choose neither.`,
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
      _colorVariables:_(`_colorVariables`),
      _maxSerializedTensorSize:_(`_maxSerializedTensorSize`),
    },
  },

  repeat:{
    docs:`\`(repeat ^Expr)\`: loops forever when finished, interrupting as needed. \`repeat Expr Times\`: repeats the computation many \`Times\`.
Results of evaluating DAG nodes are not preserved.`,
    dispose:true,
    call(expr, iterations) {
      // Example usage: `repeat ^(randomNat 10) 1000`
      if (iterations !== undefined && typeof iterations != 'number' && typeof iterations != 'function')
        error("iterations must be undefined or a number or a function, got", iterations)
      let [compCall, compAdj, i = 0, v, prevV, into, timeTotal = 0, timePrint = 0] = interrupt(8)
      if (into === undefined)
        into = elemValue(elem('code'), [repeat, expr, iterations]), into.classList.add('code'), print(into)
      let done = false
      const start = _timeSince()
      try {
        // Pre-compute compCall and compAdj, so that every call to `callAdjust` doesn't have to.
        if (compCall === undefined) { // Can't interrupt.
          compAdj = _postorderInfo(expr)
          compCall = _compileBody(expr, null, compAdj)
        }
        if (isArray(compAdj)) {
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
        if (v !== prevV && timePrint < .1 * (timeTotal + _timeSince(start)))
          if (done || err !== interrupt) {
            const end = _timeSince()
            const pre = _smoothHeightPre(into)
            _removeChildren(into)
            err === interrupt && into.append(serialize(v, _langAt(), _bindingsAt(), serialize.displayed))
            _smoothHeightPost(into, pre)
            prevV = v
            timePrint += _timeSince(end)
          }
        if (err === interrupt) interrupt.stack.push(compCall, compAdj, i, v, prevV, into, timeTotal + _timeSince(start), timePrint)
        throw err
      }
    },
  },

  Self:{
    docs:`Open programming environment with machine learning, to treat humans and programs equally.
A namespace for every function here. Project's GitHub page: {https://github.com/Antipurity/conceptual}`,
    philosophy:`What happens when you force a person to change.
Can't get away from it, love it so much.`,
    readAt:_(`undefined`),
  },

  argCount:{
    docs:`A marker for the number of args to a function.`,
  },

  userTime:{
    type:[
      _(`funcType`),
      _(`userTime`),
      _(`_numberType`),
    ],
    docs:`\`userTime()\`⇒\`TimeMark\` or \`userTime(TimeMark)\`⇒\`UserDuration\`: returns the time spent on this job as \`f64\` milliseconds, or the non-negative in-job time elapsed since the mark.

This does not include time spent on other jobs, but does include the time to interrupt/restore execution.`,
    readAt:{
      start:_(`_userTimeStart`),
    },
    interrupt:false,
    call(mark) {
      if (impureHave()) return impureLoad()
      return impureSave(_userTimeSince(mark))
    },
  },

  _userTimeStart:_([
    _(`concept`),
    _(`call`),
    _(`userTime`),
    _(`type`),
    [
      _(`funcType`),
      _(`userTime`),
    ],
    _(`docs`),
    `A differently-\`type\`d version of \`userTime\`.`,
  ]),

  realTime:{
    type:[
      _(`funcType`),
      _(`realTime`),
      _(`_numberType`),
    ],
    docs:`\`realTime()\`⇒\`TimeMark\` or \`realTime(TimeMark)\`⇒\`RealDuration\`: returns the time since start as \`f64\` milliseconds, or the non-negative time elapsed since the mark.

This includes time spent on other jobs.`,
    readAt:{
      start:_(`_realTimeStart`),
    },
    interrupt:false,
    call(mark) {
      if (impureHave()) return impureLoad()
      return impureSave(_timeSince(mark))
    },
  },

  _realTimeStart:_([
    _(`concept`),
    _(`call`),
    _(`realTime`),
    _(`type`),
    [
      _(`funcType`),
      _(`realTime`),
    ],
    _(`docs`),
    `A differently-\`type\`d version of \`realTime\`.`,
  ]),

  timeLimit:{
    docs:`\`timeLimit Duration Func …Args\`: returns \`Func(…Args)\` if its \`userTime\` never stretches past \`Duration\`, or throws \`timeLimit\` otherwise (on the first \`_checkInterrupt\` that sees the violation).
\`Duration\` is in milliseconds.`,
    examples:[
      `Interrupts are not free, so experiment with this: \`\`settings ^_msBeforeInterrupt\`\``,
      [
        `timeLimit 1000 repeat ^(1+2)`,
      ],
      [
        `timeLimit 10*1000 repeat 5`,
      ],
      [
        `timeLimit 100*1000 repeat 2.718281828459045 10000`,
      ],
    ],
    genDepthFirst:true,
    type:[
      _(`funcType`),
      _(`_numberType`),
      [
        _(`funcType`),
        [
          _(`rest`),
          `Inputs`,
        ],
        `Output`,
      ],
      [
        _(`rest`),
        `Inputs`,
      ],
      `Output`,
    ],
    dispose:true,
    adjustLater:true,
    mergeAdjustment:null,
    adjust:{
      call(ins, _, dout) {
        if (call.pure) throw impure
        let [failed] = interrupt(1)
        try {
          if (failed === undefined) {
            failed = adjustLoad(null)
            if (failed !== "returned" && failed !== "error") _inexactReversal(true, failed)
          }
          if (failed === "error") return _allocArray(0)
          const [duration, fn, ...args] = ins
          return adjust(fn, args, _, dout)
        } catch (err) { if (err === interrupt) interrupt.stack.push(failed);  throw err }
      },
      dispose:_(`_disposeEachAndDealloc`),
    },
    call(duration, fn, ...args) {
      let [end = userTime() + sync(duration), adjLen = adjustUndo()] = interrupt(2)
      const prevEnd = timeLimit.end
      timeLimit.end = timeLimit.end !== undefined ? Math.min(timeLimit.end, end) : end
      try { const ret = fn(...args);  adjustSave("returned");  return ret }
      catch (err) {
        if (err === interrupt) interrupt.stack.push(end, adjLen)
        else {
          // Cancel any possible adjustment, because it's too late for regrets.
          if (adjLen !== undefined) adjustUndo(adjLen)
          adjustSave("error")
        }
        throw err
      } finally { timeLimit.end = prevEnd }

      // .end
    },
  },

  _userTimeSince:{
    docs:`Like \`_timeSince\` but for \`userTime\`.`,
    interrupt:false,
    call(mark = 0) { return call.env[_id(userTime)] + _timeSince(call.env[_id(realTime)]) - mark },
  },

  _timeSince:{
    docs:`\`_timeSince()\`⇒\`TimeMark\` or \`(_timeSince TimeMark)\`⇒\`RealDuration\`: returns the current time as f64 milliseconds, or the non-negative time elapsed since the mark.
Makes no attempt to correct for the time to measure, \`(_timeSince _timeSince())\`.
Browsers reduce the precision of this to prevent timing attacks. Putting that precision back could be beneficial, somewhere in their hidden options.`,
    interrupt:false,
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
    docs:`\`_memorySince()\`⇒MemMark or \`(_memorySince MemMark)\`: Measures required-memory-size change (allocated memory) as non-negative \`f64\` bytes. Always 0 in browsers.
Makes no attempt to correct for the memory-to-measure, \`(_memorySince _memorySince())\`.`,
    call(mark = 0) {
      if (typeof process == ''+void 0 || !process.memoryUsage) return 0
      if (impureHave()) return impureLoad()
      const m = process.memoryUsage()
      return impureSave(Math.max(0, m.rss + m.heapUsed - m.heapTotal - mark))
    },
  },

  isArray:{
    type:[
      _(`funcType`),
      `LiterallyAnything`,
      [
        _(`boolsType`),
        1,
      ],
    ],
    docs:`\`isArray X\`: whether \`X\` is an \`array\`.`,
    interrupt:false,
    call(a) { return Array.isArray(a) },
  },

  arrayLength:{
    type:[
      _(`funcType`),
      `IDontCare`,
      _(`_numberType`),
    ],
    interrupt:false,
    call(a) { return isArray(a) ? a.length : error("Not an array:", a) },
  },

  _listen:{
    docs:`Registers a global event listener, or sets an interval if \`Type\` is a number (ms).`,
    readAt:{
      Deinitialize:_(`Deinitialize`),
      _awt:[
        _(`_awtOk`),
        _(`_awtStage1`),
        _(`_awtStage2`),
        _(`_awtStage3`),
        _(`_awtStage4`),
        _(`_awtStage5`),
      ],
    },
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

  _crispHighlight:[
    _(`settings`),
    false,
    `Check to make hovering change background for equal values, or else use box shadows.
Probably necessary if \`_noBoxStylingForPrograms\` is checked.`,
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
    },
    js:[
      `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js`,
      `https://d3js.org/d3.v6.min.js`,
    ],
    style:`.into * {transition: all .2s ease-in, margin 0s, padding 0s; box-sizing: border-box; vertical-align:top; animation: fadein .2s; font-family: monospace, monospace; font-size:1rem}

@keyframes fadein { from {opacity:0} }

text { font-family:sans-serif !important }
summary>text, details>div>text { display:inline-block }

.into {
  background-color:var(--background);
  color:var(--main);
  caret-color:var(--main);
  --background:white;
  --highlight:royalblue;
  --main:black;
}
.into:not(body) { box-shadow:var(--highlight) 0 0 .1em .1em }
.into.dark {
  --background:rgb(15,15,15);
  --highlight:rgb(225, 110, 65);
  --main:white;
}
.into.noTransitions * { transition: none !important; animation: none !important }
.into>*:not(script) {display:table; white-space:pre-wrap}
.into.crispHighlight :not(collapsed).hover { box-shadow:none; background-color:rgba(128,128,128,.4) }
.into.crispHighlight :focus:not(summary) { box-shadow:none; outline:.1em solid rgba(128,128,128,.5) }
.into.crispHighlight scroll-highlight { box-shadow:none; border-left:.3em solid rgba(128,128,128,.7) }
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
.into:not(.noValueHighlight):not(.selecting) extracted:hover { background-color:var(--background); position:sticky; top:.3em; bottom:.3em }
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
.into:not(.noComplexity) .broken>operator:not(:first-child)::before { content:"\\A" }
.into:not(.noComplexity) .broken>bracket.funcCall::after { content:"\\A" }
.into:not(.noComplexity) .broken>bracket:first-child+operator::before { content:"" }
.into:not(.noComplexity) .broken.hasOperators>*:not(operator) { display:inline-block }
.into:not(.noComplexity) .broken>.funcCall { display:inline-block !important; margin-left:0 }
.into:not(.noComplexity) .broken>bracket.funcCall { display:inline !important }
.into:not(.noComplexity) .broken>bracket:not(.funcCall) {margin-left:-1em; display:block !important}
.into:not(.noComplexity) .broken>.funcCall:first-child {margin-left:-1em}
.code>:not(:first-child):not(table) {display:block}

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
.into.crispHighlight particle { box-shadow:none; border:.3em solid rgba(128,128,128,.5) }
@keyframes particle-disappears {
  0% { opacity: 0; transform: translate(0px, 0px) }
  20% { opacity: 1 }
  100% { opacity: 0; transform: translate(var(--x), var(--y)) }
}

collapsed>hidden { display:none !important }
collapsed { color:var(--highlight); background-color:rgba(128,128,128,.15); margin:-1px; border:1px solid var(--highlight); border-radius:.2em; text-align:center; display:inline-block }
collapsed[content] { cursor:pointer }
collapsed::before { content:attr(content) }

.window { z-index:12; position:absolute; background-color:var(--background); box-shadow:var(--highlight) 0 0 .1em .1em; transition:all .2s, left 0s, top 0s; padding:.5em; will-change:transform; font-family:monospace, monospace }
context-menu>node>input { border:none }
.window extracted.hover { position:static }

context-menu-buttons { display:block; margin:.5em }
context-menu-buttons>button { margin:0 }
context-menu-buttons>button:first-child { border-radius:.3em 0 0 .3em }
context-menu-buttons>button:not(:first-child):not(:last-child) { border-radius:0; border-left:none }
context-menu-buttons>button:last-child { border-radius:0 .3em .3em 0; border-left:none }

unimportant {opacity:.6}
textarea, div.resizable { transition:all .2s, width 0s, height 0s !important }
div.resizable { resize:both; overflow:hidden; display:block }
iframe { width:100%; height:100% }

.hasOperators>operator, .hasOperators { margin:0 .2em }
.hasOperators>.hasOperators>operator, .hasOperators>.hasOperators { margin:0 .1em }
.hasOperators>.hasOperators>.hasOperators>operator, .hasOperators>.hasOperators>.hasOperators { margin:0 }

hr { border-bottom:1px;  margin:0 }
details { padding: .1em; padding-left: 1em; display: table; overflow: hidden; border-left: 1px solid currentcolor }
summary { margin-left: -1em }
details>:not(summary):not(hr) { display:block }
details>div>:not(:first-child) { max-width:75vw }
details>div { display:table-row; border-left: 1px solid currentcolor }
details>div>:first-child { padding-left:2ch }

time-report { display:table; font-size:.8em; color:gray; opacity:0; visibility:hidden }
.hover>div.code>time-report, div.code:hover>time-report { opacity:1; visibility:visible }
serialization>div.code { display:inline-table }

.removed { margin:0 }

separated-text { margin:1em; display:block }
separated-text>div>tutorial { margin:-1em; display:block }

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
      observe(_crispHighlight, st => Self.into.classList.toggle('crispHighlight', st[1], true))(_crispHighlight)

      // Insert the style defined by code.
      const StyleElem = document.createElement('style')
      StyleElem.style.display = 'none'
      StyleElem.innerHTML = defines(Browser, style)
      into.append(StyleElem)

      // Create a REPL.
      if (!location.hash) {
        const lang = fancier, binds = new Map(Self.ctx)
        const env = call.env = _newExecutionEnv(null, null, lang, binds)
        const repl = call.env[_id(print)] = REPL(lang, binds)
        into.appendChild(repl)
        Self.into.querySelector('[contenteditable]').focus()
      }

      // If our URL has `#…` at the end, parse and evaluate that command.
      function evalHash(hash) {
        if (hash) elemInsert(into, evaluator(parse(decodeURI(location.hash.slice(1)))), into.firstChild)
      }
      evalHash(location.hash)
      _listen('hashchange', () => evalHash(location.hash))

      // Execute the relevant thing in `Commands` when a button is pressed when not editing.
      let commandElem = null
      function updateKeypressElem(evt) { commandElem = _closestNodeParent(evt.target || evt.explicitOriginalTarget) || commandElem }
      _listen('pointermove', updateKeypressElem, passiveCapture)
      _listen('pointerover', updateKeypressElem, passiveCapture)
      _listen('keydown', evt => {
        let key = evt.key
        if (['Control', 'Meta', 'Shift', 'Alt'].includes(key)) return
        if (evt.ctrlKey) key = 'Ctrl'+key
        if (evt.metaKey) key = 'Meta'+key
        if (evt.altKey) key = 'Alt'+key
        if (typeof Commands.get(key) == 'function' && !_isEditable(document.activeElement)) {
          const target = commandElem || document.activeElement !== document.body && document.activeElement || Self.into
          const range = getSelection().rangeCount && getSelection().getRangeAt(0)
          _doJob([Commands.get(key), target, range, evt], _newExecutionEnv(), el => commandElem = el || commandElem)
          evt.preventDefault()
        }
      })

      // Select the <node> under cursor on double-click.
      // Also make <details> open smoothly, and allow them to be closed by clicking.
      function getSummaryParent(el) { return el && (el.tagName === 'SUMMARY' ? el : getSummaryParent(el.parentNode)) }
      _listen('click', evt => {
        if (evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey) return (!evt.target || evt.target.tagName !== 'A') && evt.preventDefault()
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
        if (evt.detail !== 2) return
        const p = _closestNodeParent(t)
        p && getSelection().selectAllChildren(p)
        evt.preventDefault()
      })

      // Open a custom <context-menu> when a context menu is requested, or when a pointer is clicked-then-held down in place for 1 second.
      //   (If `contextmenu` is still dispatched on mobile, there might not be a use for this.)
      function openMenu(evt, range) {
        contextMenuId = startX = startY = undefined
        if (typeof Commands.get('AuxClick') == 'function')
          _runFunc(Commands.get('AuxClick'), _closestNodeParent(evt.target || evt.explicitOriginalTarget) || Self.into, range, evt), evt.preventDefault()
      }
      _listen('contextmenu', evt => {
        const range = getSelection().rangeCount && getSelection().getRangeAt(0)
        openMenu(evt, range)
      })
      let contextMenuId, startX, startY
      _listen('pointerdown', evt => {
        atCursor.lastEvt = evt
        const dx = evt.clientX - startX, dy = evt.clientY - startY
        if ((dx*dx + dy*dy) <= 25) {
          const range = getSelection().rangeCount && getSelection().getRangeAt(0)
          clearTimeout(contextMenuId), contextMenuId = setTimeout(openMenu, 1000, evt, range)
        } else
          startX = evt.clientX, startY = evt.clientY
      }, passiveCapture)
      function cancelContextMenu(evt) {
        if (evt.type === 'pointermove') atCursor.lastEvt = evt
        if (contextMenuId == null || startX === undefined) return
        const dx = evt.clientX - startX, dy = evt.clientY - startY
        if (evt.type === 'pointercancel' || evt.type === 'pointerup' || (dx*dx + dy*dy) > 25)
          clearTimeout(contextMenuId), contextMenuId = null, startX = startY = undefined
      }
      _listen('pointermove', cancelContextMenu, passiveCapture)
      _listen('pointerup', cancelContextMenu, passiveCapture)
      _listen('pointercancel', cancelContextMenu, passiveCapture)

      // Close not-containing-target <context-menu>s on a click elsewhere.
      const closeMenus = evt => {
        if (evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey) return
        const t = evt.target || evt.explicitOriginalTarget
        if (evt.type === 'focusin' && _isEditable(t) || !atCursor.opened) return
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
      _listen('pointerdown', evt => {
        if (!(evt.ctrlKey || evt.metaKey) || evt.shiftKey || evt.altKey) return
        const range = getSelection().rangeCount && getSelection().getRangeAt(0)
        if (typeof Commands.get('CtrlClick') == 'function') {
          const target = _closestNodeParent(evt.target || evt.explicitOriginalTarget) || Self.into
          if (!target || target.tagName !== 'A')
            _runFunc(Commands.get('CtrlClick'), target, range, evt), evt.preventDefault()
        }
      })

      // Ensure that selection cannot end up inside <collapsed>/<serialization> elements.
      _listen('selectionchange', () => {
        Self.into.classList.toggle('selecting', !getSelection().isCollapsed, true)
        if (!getSelection().rangeCount) return
        const r = getSelection().getRangeAt(0)
        let el = r.commonAncestorContainer
        if (!el) return
        try {
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
        } catch (err) { console.error(err) }
      }, passiveCapture)

      // Highlight equal-id <node>s over selection or under cursor.
      function changeHoverTo(el) {
        const prev = changeHoverTo.prev
        const def = el && !isArray(el.to) && defines(el.to, _closestNodeParent)
        const New = el == null ? null : el instanceof Set ? el : el && def ? def(el) : new Set(elemValue(undefined, el.to))
        New instanceof Set && el instanceof Element && !el.classList.contains('groupedValue') && !New.has(el) && (elemValue(el, el.to), New.add(el))
        const needed = new Set
        let b = false
        const prob = New && New.size > _maxHighlightedValues[1] && (1 - _maxHighlightedValues[1] / New.size) || 0
        const ignored = new Set
        New && New.forEach(el => {
          if (el.tagName === 'SERIALIZATION' || !el.classList) return
          if (prob && Math.random() < prob) return ignored.add(el)
          needed.add(el)
          el = el.parentNode
          if (el && getComputedStyle(el).display !== 'none')
            !b && el && el.tagName === 'EXTRACTED' && (needed.add(el), b = true)
        })
        New && New.forEach(el => {
          if (el.tagName === 'SERIALIZATION' || !el.classList) return
          if (ignored.has(el)) return
          el.classList.add('hover')
          needed.has(el.parentNode) && el.parentNode.classList.add('hover')
        })
        if (prev) prev.forEach(el => !needed.has(el) && (el.classList.remove('hover'), _clearStyle(el)))
        scrollHighlight(New)
        changeHoverTo.prev = needed
      }
      function highlightParent(evt) {
        if (!_hoverHighlightsDOMValues[1]) return
        if (evt.type === 'pointerout' && evt.pointerType === 'touch') return
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
      observe(_hoverHighlightsDOMValues, () => changeHoverTo(null), true)
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
        for (let i=0; i < toolbar.length; ++i) if (isArray(toolbar[i]) && toolbar[i][0] === quote) toolbar[i] = toolbar[i][1]
        toolbarElem.append(' ', ...toolbar.map(settings))
        elemValue(toolbarElem, toolbar)
      }, true)(settingsToolbar)
      bottombar.append(JobIndicator, toolbarElem)
      into.append(bottombar)

      // Highlight all current jobs' logging areas when hovering over the job indicator.
      elemValue(JobIndicator, {
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
      })
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
        const prob = els && els.size > _maxHighlightedValues[1] && (1 - _maxHighlightedValues[1] / els.size) || 0
        els && els.forEach(el => {
          if (!_isStylableDOM(el)) return
          if (prob && Math.random() < prob) return
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

      // Make copying behave better (but not cutting, because preventing its default would make us need to remove selection ourselves, and that's just too much for a one-liner).
      _listen('copy', evt => { if (!getSelection().isCollapsed) evt.clipboardData.setData('text/plain', String(getSelection())), evt.preventDefault() })

      // Garbage-collect DOM elements every 5 mins.
      let domgc = false
      _listen(300000, () => {
        if (domgc) return; else domgc = true
        _doJob([_revisitElemValue], _newExecutionEnv())
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
      const lang = process.argv[2] && Self.ctx.get(process.argv[2]) || fancier

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
    docs:`Used for \`_purifyInWorker\`. Obsolete for now.
For \`file://\` URIs in Firefox, \`privacy.file_unique_origin\` in \`about:config\` needs to be false.`,
    call() {
      WebWorker.envs = Object.create(null)
      onmessage = evt => {
        const msg = evt.data
        if (isArray(msg) && typeof msg[0] == 'number' && typeof msg[1] == 'string' && msg.length == 2) {
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

  _maxHighlightedValues:[
    _(`settings`),
    128,
    `Maximum count of highlighted same-values. If over this, the highlighted nodes are chosen randomly.`,
  ],

  _purifyInWorker:{
    docs:`\`(_purifyInWorker Expr)\`: calls \`purify\` on (a copy of) \`Expr\` in parallel; returns a promise.`,
    examples:[
      [
        `_purifyInWorker ^(1*2+3*4)`,
      ]
    ],
    await:true,
    call(expr) {
      if (!_purifyInWorker.workers) {
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
        _purifyInWorker.workers = ws
      }

      return new Promise(then => {
        const ID = _newJobId()
        if (!_purifyInWorker.workers.length) {
          let env = _newExecutionEnv()
          env[_id(_schedule)] = ID
          return _doJob([purify, [quote, expr]], env, then)
        }
        const str = defines(fast, readAt).serialize([purify, [quote, expr]])
        const w = _purifyInWorker.workers[Math.floor(Math.random() * _purifyInWorker.workers.length)]
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
    const el = serialize(v, lang, undefined, {...serialize.displayed, collapseDepth:1, collapseBreadth:16, deconstructElems:true, dontBind:v})
    let e = el.tagName === 'SERIALIZATION' ? el.firstChild : el
    if (isArray(v) && !_isLabel(v) || !isArray(v) && isArray(defines(v, deconstruct)) || v[defines.key] || typeof v == 'function' || _isDisposable(v))
      if (e.title !== 'bound' && (e.firstChild.tagName != 'BRACKET' || e.lastChild.tagName != 'BRACKET')) {
        e.insertBefore(elem('bracket', '('), e.firstChild)
        e.appendChild(elem('bracket', ')'))
      }
    return el
  },

  _getOuterLinker(el) { return el && (el.contentEditable === 'true' || el.parentNode && !isArray(el.parentNode.to) && defines(el.parentNode.to, insertLinkTo) ? el : _getOuterLinker(el.parentNode)) },

  insertLinkTo:{
    docs:`\`insertLinkTo DOMElement Range\`
(\`mapRead Commands 'CtrlClick'\`)
Replaces a \`Range\` (obtained from the current selection) with a link to the target elem's value.
A language can define this with a function that {takes the element and value to {link to}} and {returns an element to insert}.
Linking to outside of the \`editor\` \`quote\`s the value, linking to inside should extract the node into a shared variable.`,
    call(el, r) {
      if (!el) return
      const p = r.commonAncestorContainer, ed = _getOuterLinker(el)
      const pre = _smoothTransformPre(el)
      if (!_getOuterLinker(p)) return false
      const edInfo = ed && ed.parentNode.to
      let col
      if (ed && ed === _getOuterLinker(p) && isArray(edInfo) && edInfo[0] === editor && defines(edInfo[2], insertLinkTo))
        col = defines(edInfo[2], insertLinkTo)(r, el)
      else {
        // Don't use `elemCollapse`, because un-collapsing in an editable area is just trouble, and the value can be viewed anyway.
        col = elemValue(elem('collapsed', '···'), quote(el.to))
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
    const b0 = elem('span', brackets[0]), b1 = elem('span', brackets[1])
    range.insertNode(b0)
    range.collapse(false)
    range.insertNode(b1)
    range.setStartAfter(b0)
    range.setEndBefore(b1)
  },

  hierarchy:{
    docs:`Turns a map from globals into a namespace-based hierarchy.`,
    readAt:{
      disableBindings:_(`disableBindingsElem`),
      settings:_(`settings`),
    },
    call(m, topLevel, parents = readAt.parents, lang = basic, binds, sourceCodeOrder = true) {
      if (typeof document == ''+void 0) return m
      if (!(m instanceof Map)) error("Expected a map, got", m)
      const globals = new Map // From globals to their elems.
      m.forEach((v,x) => globals.set(x, null))
      let p // Add unmentioned namespace-parent globals too.
      globals.forEach((our, x) => (p = parents.get(x)) && !globals.has(p) && globals.set(p, null))
      const result = !topLevel ? elem('details', elem('summary', 'Binds to:')) : elemFor(topLevel)
      ;(sourceCodeOrder ? Self.ctx : globals).forEach((x,x2) => { // Make globals appear in source-code order.
        if (!sourceCodeOrder) x = x2
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
        return isArray(x) || defines(x, permissionsElem) === undefined || topLevel ? el : defines(x, permissionsElem)(el)
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
        if (!isArray(x) && defines(x, deconstruct)) return mark(deconstruct(x))
        else if (x instanceof Map) x.forEach((v,k) => (mark(k), mark(v)))
        else if (isArray(x)) x.forEach(mark)
        else if (x && !x[defines.key] && typeof x == 'object')
          Object.keys(x).forEach(k => mark(x[k]))
        else if (x && x[defines.key]) mark(x[defines.key])
      }
    },
  },

  stringToDoc:{
    docs:`Parse text in \`...?\` to style it as \`fancier\`, and treat other strings as \`structuredSentence\`s. Return an array of children.
Text in double-backticks will be replaced with the result of executing it: \`1+2\`=\`\`1+2\`\`.`,
    interrupt:false,
    call(s) {
      if (typeof s != 'string') return s
      let arr = s.split('``')
      for (let i = 0; i < arr.length; ++i)
        if (i & 1) { // Program. Execute.
          const prevPure = call.pure;  call.pure = undefined
          try {
            arr[i] = daintyEvaluator([print, _rememberToDispose(parse(arr[i]))], _newExecutionEnv())
            typeof document != ''+void 0 && arr[i] instanceof Node && (arr[i].style.display = 'inline')
          } catch (err) { console.log(err), arr[i] = elem('serialization', arr[i]) }
          finally { call.pure = prevPure }
        } else if (arr[i]) { // String.
          let sub = arr[i].split('`')
          for (let j = 0; j < sub.length; ++j)
            if (j & 1)
              try { // Program. Prettify.
                sub[j] = elem('serialization', _rememberToDispose(parse(sub[j], undefined, undefined, parse.dom))[1])
              } catch (err) { console.log(err), sub[j] = elem('serialization', sub[j]) }
            else { // String. Put.
              sub[j] = sub[j].split('\n').map(structuredSentence)
              typeof document != ''+void 0 && sub[j].forEach(el => el.classList.add('text'))
              interleave(sub[j], '\n')
              sub[j] = sub[j].filter(x => x)
            }
          arr[i] = sub
        }
      return arr.filter(x => x)
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
      el.isConnected ? el.before(col) : setTimeout(() => menu.before(col), 100)
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
        if (typeof L != 'string') return
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
        col.onclick = (evt, instant = false) => {
          evt.preventDefault && evt.preventDefault()
          const col = evt.target || evt.explicitOriginalTarget, p = col.parentNode, pre = !instant && _smoothHeightPre(p)
          const el = start()
          if (p) isArray(el) ? el.forEach(el => p.insertBefore(el, col)) : el.parentNode !== p && p.insertBefore(el, col), p.removeChild(col)
          if (!instant) {
            if (_getOuterWindow(p) || _getOuterContextMenu(p)) _updateBroken(_getOuterWindow(p) || _getOuterContextMenu(p))
            else p && _updateBroken(p)
            p.dispatchEvent(new Event('input', {bubbles:true}))
            _smoothHeightPost(p, pre)
          }
        }
      } else {
        if (isArray(start)) start = elem('text', start) // Assume `stringToDoc` made `start`.
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
          evt.preventDefault && evt.preventDefault()
          const col = evt.target || evt.explicitOriginalTarget, d = col.firstChild, p = col.parentNode, pre = !instant && _smoothHeightPre(p)
          if (d.firstChild === d.lastChild)
            col.replaceWith(d.firstChild)
          else {
            const before = col.nextSibling
            while (d.firstChild) p.insertBefore(d.firstChild, before)
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
      prompt:_(`prompt`),
      display:_(`display`),
      structured:_(`structured`),
      structuredSentence:_(`structuredSentence`),
    },
    call(...x) {
      const prevPure = call.pure;  call.pure = false
      print.did = true
      try {
        let before = call.env && call.env[_id(print)]
        if (before instanceof Map) before = before.get(print)
        if (before && before.parentNode) {
          let str
          if (x.length != 1 || !_isStylableDOM(x[0]))
            str = serialize(x.length > 1 ? x : x[0], _langAt(), _bindingsAt(), serialize.displayed)
          else str = x[0]
          if (str.parentNode) str = elemClone(str)
          if (typeof str == 'string') str = document.createTextNode(str)
          const wasMax = _updateMaxScrollBegin()
          before.parentNode.insertBefore(str, before)
          _updateBroken(str)
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
    docs:`Allows dragging the element around with a pointer (but not with touch). Only call on absolutely-positioned elements with .style.left and .style.top.`,
    call(el) {
      let pointerId = null, startX, startY, scrX, scrY
      const passive = {passive:true}
      el.addEventListener('pointerdown', evt => {
        if (evt.pointerType === 'touch') return
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

  _escapeLabel(name, lang = _langAt(call.env) || fancier) {
    return typeof defines(lang, _escapeLabel) == 'function' ? defines(lang, _escapeLabel)(name) : name
  },

  _unescapeLabel(repr, lang = _langAt(call.env) || fancier) {
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
              if (isArray(arr))
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
      function([el, v]) {
        // For globals, display the owner namespace (if any) (even if the property name does not match) and the global binding.
        //   For non-exposed globals, display the owner namespace (if any).
        if (v != null && _invertBindingContext(Self.ctx).has(v)) {
          const global = serialize(v, undefined, undefined, serialize.displayed), p = readAt.parents.get(v) || Self
          return p ? elem('div', [elem('unimportant', [serialize(p, undefined, undefined, serialize.displayed), '.']), global]) : global
        } else if (readAt.parents.has(v)) {
          const p = readAt.parents.get(v)
          return elem('div', elem('unimportant', ['In ', serialize(p, undefined, undefined, serialize.displayed)]))
        }
      },
      {
        docs:`For numbers, display a slider from 0 to 2*number for easy adjusting.
For strings, display them in a <textarea> for easy editing and copying.
For anything else, display the globals the expression binds to, and an expandable basic definition.`,
        call([el, v]) {
          // For globals, a short definition of what we were called on.
          if (typeof v == 'number' && isFinite(v) && el && v === +el.textContent && _isEditable(el)) {
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
                el.replaceWith(el = serialize(area.value, undefined, undefined, serialize.displayed))
                elemValue(area, el.to = area.value)
                i = elemValue(undefined, el.to).filter(_isEditable).indexOf(el)
              }, .1)
            }
            return elemValue(area, v)
          } else if (!_invertBindingContext(Self.ctx).has(v))
            if (!isArray(v) || v[0] !== REPL || !(v[2] instanceof Map))
              return permissionsElem(v) // Display the globals that this one's deconstruction binds to (unless a REPL).
        },
      },
      {
        docs:`Docstring.`,
        call([el, v]) {
          if (!isArray(v) && typeof defines(v, docs) == 'string')
            return elem('text', stringToDoc(defines(v, docs)))
        },
      },
      function([el, v]) {
        // The docstring of settings.
        if (isArray(v) && v[0] === settings && typeof v[2] == 'string')
          return elem('text', v[2])
      },
      function([el, v]) {
        // The official `settings` form of settings.
        if (isArray(v) && v[0] === settings && typeof v[2] == 'string')
          return settings(v)
      },
      function([el, v]) {
        // The AutoWorld and type, if available.
        if (!el || v === undefined) return
        const [AWs, TPs, EMs] = _getAutoInfoNear(el)
        if (isArray(v) && v[0] === bound && v[1] instanceof Map) v = v[2]
        try {
          let aw = AWs.get(v), tp = TPs.get(v)
          if (autoWorld.objectWorld && autoWorld.objectWorld.has(v)) {
            aw = autoWorld.objectWorld.get(v)
            tp = defines(aw, deconstruct)[2].Type[aw.objectIndex.get(v)]
          }
          if (!isArray(v) && defines(v, type))
            tp = defines(v, type)
          tp = _typeFinalize(tp)
          if (tp !== undefined) // "In […], typed T"
            return aw ? elem('text', [
              elemValue(elem('unimportant', 'In '), autoWorld),
              elemValue(elemCollapse(() => serialize(aw, undefined, undefined, serialize.displayed)), aw),
              elemValue(elem('unimportant', ' typed '), Types),
              serialize(tp, undefined, undefined, serialize.displayed)
            ]) : elem('text', [ // "Typed T"
              elemValue(elem('unimportant', 'Typed '), Types),
              serialize(tp, undefined, undefined, serialize.displayed)
            ])
        } finally { _allocMap(AWs), _allocMap(TPs), _allocMap(EMs) }
      },
      {
        docs:`Examples.`,
        call([el, v]) {
          if (!isArray(v) && isArray(defines(v, examples)))
            return elem('div', [
              elemValue(elem('unimportant', 'Examples: '), examples),
              elemCollapse(() => serialize(examples(v), undefined, undefined, serialize.displayed))
            ])
        },
      },


      {
        docs:`A table for \`readAt\`s.`,
        call([el, v]) {
          if (!isArray(v) && defines(v, readAt)) {
            const backctx = _invertBindingContext(Self.ctx)
            const row = ([k,v]) => {
              if (typeof k != 'string') return
              let ve
              if (!backctx.has(v))
                ve = elemValue(elemCollapse(() => serialize(v, undefined, undefined, serialize.displayed)), v)
              else
                ve = serialize(v, undefined, undefined, serialize.displayed)
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
          const refd = referencesTo(v)
          if (refd && refd.length)
            return elem('div', [
              elemValue(elem('unimportant', [
                'Used in ',
                elemValue(elem('number', ''+refd.length), refd.length),
                refd.length != 1 ? ' other globals: ' : ' other global: ',
              ]), referencesTo),
              elemValue(elemCollapse(() => serialize(refd.length !== 1 ? refd : refd[0], basic, undefined, serialize.displayed)), refd)
            ])
        }
      },
      function([el, v]) {
        // For globals, the list of back-defs.
        if (_invertBindingContext(Self.ctx).has(v)) {
          const defd = definersOf(v)
          if (defd && defd.length)
            return elem('div', [
              elemValue(elem('unimportant', [
                'Defined by ',
                elemValue(elem('number', ''+defd.length), defd.length),
                defd.length != 1 ? ' globals: ' : ' global: ',
              ]), definersOf),
              elemValue(elemCollapse(() => serialize(defd.length !== 1 ? defd : defd[0], basic, undefined, serialize.displayed)), defd)
            ])
        }
      },
      function([el, v]) {
        // Array/string length (auto-updated), or the number/boolean/null/undefined.
        if (isArray(v) || typeof v == 'string') {
          const num = elemValue(elem('number', ''+v.length), v.length)
          if (isArray(v)) {
            const f = v => { num.textContent = ''+v.length, elemValue(num, v.length), !num.isConnected && (clearInterval(id), observe(v, f, false)) }
            const id = setInterval(() => !num.isConnected && (observe(v, f, false), clearTimeout(id)), 60000)
            observe(v, f, true)
          }
          return elem('div', [
            elemValue(elem('unimportant', (isArray(v) ? 'Array' : 'String') + ' length: '), [readAt, v, 'length']),
            num,
          ])
        }
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
    ],
    call(el) {
      if (typeof document == ''+void 0) return
      let v
      if (!(el instanceof Node)) v = el, el = undefined
      else v = el.to

      // Append a daintyEvaluator, executing `(_printAll describe ^(el v))`.
      return daintyEvaluator([_printAll, describe, [quote, [el, v]]], _newExecutionEnv())
    },
  },

  _getAutoInfoNear:{
    docs:`\`_getAutoInfoNear DOMElement\`→\`(vToAutoWorld vToType vToEmb)\`
Collates \`map\`s from \`DOMElement.'to'\` to auto-world/type/embedding in the surrounding \`serialize\`ation.`,
    call(el) {
      const AWs = _allocMap(), TPs = _allocMap(), EMs = _allocMap()
      autoWorld.objectWorld && fillObjectsInfo(findSerialization(el))
      return [AWs, TPs, EMs]

      function findSerialization(e) { return !e ? null : e.tagName === 'SERIALIZATION' ? e : findSerialization(e.parentNode) }
      function fillObjectsInfo(e) {
        if (!e || e.tagName === 'COLLAPSED') return
        if (autoWorld.objectWorld.has(e.to)) {
          const aw = autoWorld.objectWorld.get(e.to), At = aw.objectIndex.get(e.to)
          aw.NodeTypes[At].forEach((Type, Node) => (AWs.set(Node, aw), TPs.set(Node, Type)))
          aw.NodeEmbs[At].forEach((Emb, Node) => EMs.set(Node, Emb))
        }
        for (let ch = e.firstChild; ch; ch = ch.nextSibling) fillObjectsInfo(ch)
      }
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
          if (isArray(v) && v[0] === elem && v[1] === url && typeof v[2] == 'string') {
            return elem('div', [
              elemValue(elem('unimportant', 'URL to: '), url),
              elemValue(elemCollapse(() => {
                const result = elem('div')
                result.classList.add('resizable')
      
                fetch(v[2], {mode:'cors'})
                .catch(r => elemInsert(result, serialize(_errorRepr(r), undefined, undefined, serialize.displayed)))
                .then(r => r.arrayBuffer())
                .then(r => new TextDecoder().decode(new Uint8Array(r)))
                .then(r => {
                  try {
                    elemInsert(result, serialize(JSON.parse(r), undefined, undefined, serialize.displayed))
                  } catch (err) { elemInsert(result, defines(fast, readAt).parse(r)) }
                })
                .catch(() => {
                  const frame = elem('iframe')
                  frame.src = v[2]
                  elemInsert(result, frame)
                })
                return result
              }), v[2]),
            ])
          }
        },
      },
      {
        docs:`Buttons.
If we're at the top-level element, present an option to make a REPL.
If we're at a top-level element, present an option to delete it (unless it's all we have).
If we can expand all in the context element, then present that option.
Present an option to hide the element.
Present an option to hide the element and all elements after it on the same hierarchy level.
Present "To window" (for non-windows) or "Restore" (for windows — draggable absolutely-positioned elements).
If the cursor is in editor, present an option to replace the currently-selected contents with a link to the value.
Allow editing run-time and rewrite-time values.`,
        call([el, range, v]) {
          const elems = []
          if (el.parentNode === Self.into || el.tagName === 'HTML' || el === Self.into) {
            const before = el.parentNode === Self.into ? el : Self.into.firstChild
            elems.push(button(() => elemInsert(Self.into, REPL(), before), '📠', 'Append a new REPL.'))
            if (el.previousSibling && 'to' in el.previousSibling || el.nextSibling && 'to' in el.nextSibling)
              elems.push(button(() => elemRemove(el), '🏹', 'Delete this.'))
          }
          if (elemExpandAll(el, true))
            elems.push(button(() => elemExpandAll(el), '🔮', 'Expand all collapsed element trees here.'))
          if (_getOuterWindow(el) !== el && !_isEditable(el))
            elems.push(button(() => elemCollapse(el), '…', 'Collapse element tree.'))
          if (el.nextSibling && el.nextSibling.tagName !== 'BRACKET')
            elems.push(button(() => elemCollapse(el, null), '…$', 'Collapse to end.'))
          if (!_isEditable(el) && el !== document.documentElement) {
            if (!_getOuterWindow(el))
              elems.push( button(() => elemToWindow(el), ' ', 'Extract this element into a draggable window.') )
            else
              elems.push( button(() => _restoreWindow(_getOuterWindow(el)), '×', 'Put the extracted element back into its previous position.') )
          }
          if (range && v !== undefined && _isEditable(range.commonAncestorContainer))
            elems.push( button(() => insertLinkTo(el, range), '🔗', 'Insert a collapsed link to this at cursor.') )

          const extraArea = elem('div')
          if (v !== undefined) {
            // Allow editing & rewriting.
            let a,b
            if (editObject(v, null))
              elems.push( a = button(() => {
                _removeChildren(extraArea)
                elemInsert(extraArea, editObject(v))
              }, '🔧', 'Change the run-time object.') )
            if (editRewrite(v, null))
              elems.push( b = button(() => {
                _removeChildren(extraArea)
                elemInsert(extraArea, editRewrite(v))
              }, '📝', 'Rewrite the global object. Changes will apply to the next rewrite 💾, `Rewrite()`.') )
            ;[a,b].forEach(ch => ch && (ch.doNotCloseTheContextMenuOnClick = true))
            extraArea.title = 'Try out the next rewrite.'
          }

          return elem('div', [
            elem('context-menu-buttons', elems),
            extraArea,
          ])
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
        if (evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey) return (!evt.target || evt.target.tagName !== 'A') && evt.preventDefault()
        const t = evt.target || evt.explicitOriginalTarget
        if (!t.doNotCloseTheContextMenuOnClick)
          t.tagName === 'BUTTON' && _getOuterContextMenu(t) === menu && elemRemove(menu)
      })
      menu.tabIndex = 0

      // Append a daintyEvaluator, executing `(_printAll contextMenu ^(el range v))`.
      menu.append(daintyEvaluator([_printAll, contextMenu, [quote, [el, range, v]]], _newExecutionEnv()))

      let inside = _getOuterContextMenu(el)
      if (_getOuterContextMenu(inside.parentNode) !== Self.into) inside = Self.into // Only one nesting layer.
      atCursor(menu, evt, inside)

      menu.focus({preventScroll:true})
    },
  },

  daintyEvaluator:{
    docs:`\`(daintyEvaluator Expr Env)\`: returns an element that will evaluate the expression and display its \`print\`s if any, but not the result.`,
    call(expr, env = _newExecutionEnv()) {
      if (typeof document == ''+void 0) return

      // Evaluate the requested expression.
      if (impureHave()) return impureLoad()
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
      if (!env) error("Where's the execution env:", env)
      const el = elem('div')
      const pause = elem('button', '⏸')
      pause.onclick = () => _pausedToStepper(..._cancel(env, true))
      pause.title = `Pause execution`
      el.append(pause)
      el.append(elem('waiting'))
      return elemValue(el, [_evaluationElem, env])
    },
  },

  _recognizeBinding(binds, v) {
    if (isArray(v) && v[0] === _extracted && v.length == 3 && (_isLabel(v[1]) || _invertBindingContext(binds).has(v[1])))
      return [_isLabel(v[1]) ? v[1] : label(_invertBindingContext(binds).get(v[1])), v[2]]
    return [null, v]
  },

  _addBinding(binds, L, v) {
    if (binds !== Self.ctx && !binds.has(evaluator.history))
      binds.set(evaluator.history, _allocMap())
    if (binds && binds.has(evaluator.history) && _isLabel(L)) { // Add result to bindings.
      if (binds.get(evaluator.history).has(_unlabel(L)))
        return [error, "Label", L, "is already bound to", binds.get(_unlabel(L))]
      else {
        binds.get(evaluator.history).set(_unlabel(L), binds.has(_unlabel(L)) ? binds.get(_unlabel(L)) : evaluator.none)
        binds.set(_unlabel(L), quote(v))
        _invertBindingContext(binds, true)
        return [_extracted, L, v]
      }
    }
    return v
  },

  _removeBinding(binds, L) {
    if (binds && binds.has(evaluator.history) && _isLabel(L)) { // Delete result from bindings.
      const prevBinding = binds.get(evaluator.history).get(_unlabel(L))
      binds.get(evaluator.history).delete(_unlabel(L))
      prevBinding !== evaluator.none ? binds.set(_unlabel(L), prevBinding) : binds.delete(_unlabel(L))
      _invertBindingContext(binds, true)
    }
  },

  evaluator:{
    docs:`\`(evaluator Expr Env)\`: When logged to DOM, this displays the expression, its \`print\`s along the way, and its one evaluation result in one removable (by clicking on the prompt) DOM element.
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
    call(expr, env = _newExecutionEnv(), thenElem) {
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
      elemValue(el, [evaluator, quote(expr), env])

      // Evaluate the requested expression.
      const start = _timeSince()
      ;[bindAs, expr] = _recognizeBinding(binds, expr)
      _doJob(expr, env, r => { // Got the result.
        const end = _timeSince(), real = _timeSince(start)

        r = _addBinding(binds, bindAs, r)

        const pre = _smoothHeightPre(el)
        elemRemove(waiting)
        // Merge `_updateBroken` of both logged children into one.
        _updateBroken(el)

        // Display `_printAll evaluator ^(Result UserDuration RealDuration EndTime)`.
        el.append(daintyEvaluator([_printAll, evaluator, [quote, [r, env[_id(userTime)], real, end]]], _newExecutionEnv(env)))
        env = null
      })
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
    if (!env) return fancier
    if (_id(_langAt) in env) return env[_id(_langAt)]
    const el = env[_id(print)]
    el = _getOuterREPL(el)
    if (el && isArray(el.to)) return el.to[1]
  },

  _bindingsAt(env = call.env) {
    if (!env) return Self.ctx
    if (_id(_bindingsAt) in env) return env[_id(_bindingsAt)]
    const el = env[_id(print)]
    el = _getOuterREPL(el)
    if (el && isArray(el.to)) return el.to[2]
  },

  _invertBindingContext(ctx, clear = false) {
    if (!(ctx instanceof Map)) throw console.error(ctx), "Invalid binding context"
    if (!_invertBindingContext.cache)
      _invertBindingContext.cache = new WeakMap, Object.freeze(_invertBindingContext)
    if (clear) return _invertBindingContext.cache.delete(ctx)
    if (_invertBindingContext.cache.has(ctx)) return _invertBindingContext.cache.get(ctx)
    const backctx = new Map
    ctx.forEach((to, name) => {
      if (typeof name == 'string') (name[0] !== '_' || !backctx.has(to)) && backctx.set(to, name)
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
          elemValue(ch, undefined, true, true), elemRemove(ch, true, true, false)
  },

  _autocompleteBrackets:[
    _(`settings`),
    `()[]{}`,
    `Whether to autocomplete brackets/quotes in \`editor\`s.
Pressing an opening bracket surrounds the cursor/selection.
Pressing a closing bracket surrounds the closest highlightable parent.`,
  ],

  _fullParseConstruction:[
    _(`settings`),
    false,
    `Whether \`editor\`s should \`construct\` parsed things fully when syntax-highlighting.
Leaving this off leaves objects like \`static\` or \`dataset\` unfilled, but makes parsing potentially much faster.`,
  ],

  _parseEditor(query, env = _newExecutionEnv(), syntaxOnly = false) {
    // Re-parses the contents of an element created with `editor`, highlighting the syntax and returning a promise.
    //   Returns a promise of its current value (or on .catch, the parsing error).
    const ed = query.lastChild, lang = query.to[2], binds = query.to[3]
    const s = getSelection(), i = _saveCaret(ed, s, false), j = _saveCaret(ed, s, true)
    return new Promise((then, err) => {
      _doJob([parse, ed, lang, binds, !syntaxOnly ? parse.dom : {...parse.dom, syntaxOnly}], env, r => {
        if (!_isError(r)) {
          const [expr, styled] = r
          while (ed.firstChild) ed.removeChild(ed.firstChild)
          ed.append(elem('div', styled))
          _updateBroken(ed.lastChild)
          if (i !== undefined && (document.activeElement === Self.into.parentNode.host || ed.contains(document.activeElement))) {
            const focus = _loadCaret(ed, i), anchor = _loadCaret(ed, j)
            s.setBaseAndExtent(...focus, ...anchor)
          }
          then(bound(n => n instanceof Element && n.special ? n.to : undefined, expr, false))
        } else
          err(r)
      })
    })
  },

  _editorError(query, expr) {
    // Displays the error message of editing, absolutely-positioned and quickly vanishing.
    let err = isArray(expr) && expr[0] === jsRejected && expr.length == 2 ? expr[1] : expr
    if (isArray(err) && err[0] === 'give more') err = err[1]
    try {
      const el = elem('error', err instanceof Element ? err : serialize(err, undefined, undefined, serialize.displayed))
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
      _fullParseConstruction:_(`_fullParseConstruction`),
      _typingChill:_(`_typingChill`),
    },
    call(initialString = '', lang = fancier, binds = Self.ctx, onInput, onEnter, alwaysConstruct = false) {
      if (typeof initialString != 'string' && !(initialString instanceof Node))
        error('String expected, got', initialString)
      if (!(binds instanceof Map)) error('Map expected, got', binds)
      if (onInput && typeof onInput != 'function') error('Function or nothing expected, got', onInput)
      if (onEnter && typeof onEnter != 'function') error('Function or nothing expected, got', onEnter)

      // On any mutations inside, re-parse its contents, and call `onInput` if given.
      let chillId = null
      let parseEnv = null, important = false, prevText = ''
      const obs = new MutationObserver(_throttled(record => {
        if (!important && prevText === ed.textContent) return
        prevText = ed.textContent

        parseEnv && _cancel(parseEnv), parseEnv = _newExecutionEnv()
        important = false
        return _parseEditor(query, parseEnv, !(alwaysConstruct && _evaluateWhileTyping[1]) && !_fullParseConstruction[1]).
          then(v => { parseEnv = null, OnInput(v, false), obs.takeRecords(); return new Promise(then => setTimeout(then, 0)) }).
          catch(err => { parseEnv = null, OnInput(err, true), obs.takeRecords(), setTimeout(() => obs.takeRecords(), 50) })
      }, ms => Math.max(50, ms * (1/.2 - 1))), record => {
        for (let i=0; i < record.length; ++i) if (record[i].type === 'characterData') important = true
      })

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
        if (_autocompleteBrackets[1] && !evt.ctrlKey && getSelection().rangeCount) {
          const brackets = _autocompleteBrackets[1]
          const i = brackets.indexOf(evt.key)
          if (i >= 0 && i%2) { // Surround closest parent.
            const r = document.createRange(), el = _closestNodeParent(getSelection())
            if (!el) return
            r.selectNodeContents(el)
            return _bracketize(r, brackets.slice(i-1,i+1)), evt.preventDefault()
          } else if (i >= 0) // Surround selection.
            return _bracketize(getSelection().getRangeAt(0), brackets.slice(i,i+2)), evt.preventDefault()
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
        evt.preventDefault() // Since this doesn't work in promises.
        if (onEnter)
          _parseEditor(query)
          .then(expr => { if (onEnter && onEnter(expr, false)) ed.textContent = '', OnInput(undefined, true) })
          .catch(err => { if (onEnter && onEnter(err, true)) ed.textContent = '', OnInput(undefined, true) })
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
    call(lang = fancier, binds = new Map(Self.ctx)) {
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
              const expr = parse(cmd, undefined, binds)
              opt.breakLength = out.columns
              if (out.isTTY && !print.did) {
                const lines = Math.ceil((cmd.length + prompt.length) / out.columns)
                out.moveCursor(0, -lines)
                out.clearScreenDown()
                out.write(coloredPrompt + serialize(expr, undefined, undefined, {...opt, offset:(prompt.length+1)>>>1}) + '\n')
              }
              _schedule(expr, _newExecutionEnv(env, null, lang, binds), result => {
                // If binds contain result in values, set name to that; if not, create a new one.
                let name
                binds.forEach((v,k) => v === result && (name = k[1]))
                if (!name) do { name = '$' + n++ } while (binds.has(name))
                if (!binds.has(name))
                  (binds = new Map(binds)).set(name, quote(result))
                _bindingsAt.binds = binds
  
                then(null, _colored(name, 33) + ': ' + serialize(result, undefined, undefined, {...opt, offset:1+Math.ceil(name.length/2+.5)})) // brown
              })
            } catch (err) {
              if (isArray(err) && err[0] === 'give more') then(new repl.Recoverable(err))
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
        const contents = lastExpr === undefined ? '' : serialize(lastExpr, lang, binds, {...serialize.displayed, observe:false}).firstChild
        query.replaceWith(query = editor(contents, lang, binds, purifyAndDisplay, evaluate, true))
        langDisplay.replaceWith(langDisplay = serialize(lang, basic, undefined, serialize.displayed))
        const a = [...repl.querySelectorAll('serialization')]
        if (a.length < 64) a.forEach(el => {
          if (el !== langDisplay && !_isEditable(el)) el.replaceWith(serialize(el.firstChild.to, lang, binds, serialize.displayed))
        })
      }, true)
      elemValue(repl, us)

      // Display purified output.
      const pureOutput = elem('div')
      pureOutput.classList.add('code')
      pureOutput.style.display = 'inline-block'
      pureOutput.style.position = 'relative'
      let penv, waiting, lastExpr
      const purifyAndDisplay = _throttled((expr, fail) => {
        if (msg === false && isArray(expr) && expr[0] === jsEval && typeof expr[1] == 'string' && expr[2]) expr = [randomNat, 2]
        const pre = _smoothHeightPre(pureOutput)
        if (penv !== undefined) _cancel(penv), waiting.remove(), penv = undefined, waiting = undefined
        let promise
        if (_evaluateWhileTyping[1]) {
          _removeChildren(pureOutput)
          if (!fail) promise = new Promise(then => {
            const e = penv = _newExecutionEnv(env, null, lang, binds)
            e[_id(print)] = waiting = _evaluationElem(penv), call.env = penv
            const bindAs = isArray(expr) && expr[0] === _extracted && expr.length == 3 && _isLabel(expr[1]) ? expr[1] : null
            if (bindAs) expr = expr[2]
            pureOutput.append(waiting)
            _doJob(_isError(expr) ? quote(expr) : [purify, quote(expr)], penv, result => {
              const pre = _smoothHeightPre(pureOutput)
              try {
                waiting && waiting.remove(), waiting = undefined
                if (_isUnknown(result) && _isError(result[1]))
                  result = result[1] // Display errors too.
                if (bindAs) result = [_extracted, bindAs, result]

                if (!_isUnknown(result)) {
                  // Display `_printAll evaluator (Result)`.
                  pureOutput.append(daintyEvaluator([_printAll, evaluator, [quote, [result]]], _newExecutionEnv(penv)))
                } else {
                  elemInsert(pureOutput, elemValue(button(evaluateCurrent, 'evaluate'), result))
                }
              } finally { _smoothHeightPost(pureOutput, pre), penv = undefined, then(e[_id(userTime)]) }
            })
            _smoothHeightPost(pureOutput, pre)
          }); else if (expr !== undefined) {
            let el = expr
            if (isArray(el) && el[0] === jsRejected && isArray(el[1]) && el[1][0] === 'give more')
              el = el[1][1] === 'No value at top level' ? undefined : elem('error', el[1][1])
            el && elemInsert(pureOutput, serialize(el, lang, binds, serialize.displayed))
            _smoothHeightPost(pureOutput, pre)
          }
        } else {
          if (pureOutput.lastChild && pureOutput.firstChild === pureOutput.lastChild && pureOutput.lastChild.tagName === 'BUTTON') return
          _removeChildren(pureOutput)
          pureOutput.append(elemValue(button(evaluateCurrent, 'evaluate'), evaluator))
          _reflow().then(() => _smoothHeightPost(pureOutput, pre))
        }
        return promise
      }, .1, expr => lastExpr = expr)

      const evaluateCurrent = () => _parseEditor(query).then(evaluate).catch(err => evaluate(err, true))
      const evaluate = (expr, fail) => {
        if (fail) return
        const prev = call.env, e = _newExecutionEnv(env), ev = evaluator(expr, e)
        call.env = env
        try { return print(ev), true }
        finally { call.env = prev }
      }
      repl.classList.add('code')

      const msg = defines(lang, REPL)
      let langDisplay
      repl.append(elem('text', [
        'A ',
        serialize(REPL, basic, undefined, serialize.displayed),
        ' of language ',
        langDisplay = serialize(lang, basic, undefined, serialize.displayed),
        typeof msg == 'string' ? stringToDoc(': ' + msg) : elem('span')]))

      let query = editor('', lang, binds, purifyAndDisplay, evaluate, true)
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
    elem(tag, href, contents = href) {
      if (typeof href != 'string') errorStack("Must be a string:", href)
      if (tag !== url || typeof document == ''+void 0) return href
      const el = elem('a', contents)
      elemValue(el, [elem, url, href])
      el.href = href
      el.title = decodeURI(href)
      if (el.title.slice(0,8) === 'https://') el.title = el.title.slice(8)
      if (el.title.slice(0,7) === 'file://') el.title = el.title.slice(7)
      return el
    },
  },

  _expandTutorialBindings:[
    _(`settings`),
    true,
    `If checked, \`a:b\` bindings will serialize as \`a:b\` when evaluated, else as \`a:a\`.`,
  ],

  tutorial:{
    docs:`\`tutorial Func\`: views the unlockable code tutorial of \`Func\`, if available.
\`tutorial()\`: views all globally-available tutorials.

All tutorials are finite. Savor them while they last.`,
    readAt:{
      _expandTutorialBindings:_(`_expandTutorialBindings`),
    },
    tutorial:[
      `A nice, sunny day out, with not a single cloud in sight.
Let's make our understanding of tutorials as clear as the weather.
Yes, before accessing any tutorials, we have to know: what exactly is a tutorial?

Tutorials are a way of explaining ourselves to other humans as a way to leave a mark in their hearts. You better make your thing understandable, and you better be nice, or no immortality for you.

But first, we need to make sure that you can type characters. Yes, just type out \`'Let me in'\` in the field below and press Enter, very, very gently. Remember that your keyboard can be your friend for decades to come if you don't neglect it. And so can we.`,
      [
        _(`fancy`),
        ``,
        `Let me in`,
      ],
      `Good work getting this far. I cannot even imagine the trouble you went through, but for what you did, we are grateful.

Tutorials in \`tutorial\` are arrays of either text (like what you are reading) or an array of the language (see \`Languages\`) then the initial string (then optionally either the intended result or a function that judges whether the result is OK and we can continue; this is why you had to type in the thing above to see this).

Try making a tutorial from this description. Have to hand it to you: remember that \`(Func …Args)\` is how you call functions, \`(array …Items)\` is how you make arrays, and that \`fancy\` is the most basic language.`,
      [
        _(`fancy`),
        ``,
        function(result) { return result instanceof Node && result.tagName === 'TUTORIAL' },
      ],
      `Ah. The hero is here, long awaited, to save us from our troubles of not knowing how to make tutorials.

Rest would be mistimed now. You are a hacker, and you must drill deeper into the representations. Right-click on \`tutorial\` to summon a \`contextMenu\` on it, find its tutorial, and see what value will allow you to progress.`,
      [
        _(`fancy`),
        `'So, on a scale from one to ten, how much did the last person you killed deserve it?'`,
        `0`,
      ],
      `Or did you expect to have the answer handed to you? No one will give you anything if you don't take it.

Now, type \`tutorial call\` (to know the basics) or \`tutorial callAdjust\` (to know the future) and claim what's yours.`,
      [
        _(`fancy`),
      ],
    ],
    call(f = undefined) {
      // Did you ever hear the tragedy of Darth Plagueis the Wise?
      // […]
      // Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep.
      // Ironic. He could save others from death, but not himself.
      if (f === undefined) {
        const m = _allocMap()
        Self.ctx.forEach(global => {
          if (!isArray(global) && isArray(defines(global, tutorial)))
            m.set(global, tutorial(global))
        })
        return hierarchy(m, elem('div', 'All available code tutorials:'))
      }
      let t = isArray(f) ? f : defines(f, tutorial), i = 0, result = elem('tutorial')
      if (!isArray(t)) return
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
        else if (isArray(v)) {
          const [lang, initialCode='', canContinue] = v
          const results = elem('div')
          results.classList.add('code')
          let passed = false, env, bindAs, expr
          const OnInput = (x, fail) => !fail && (expr = x, elemValue(btn, x))
          const OnEnter = (x, fail) => {
            // Evaluate the expression, bind to a label if requested, and check its validity to see whether to continue.
            if (fail) return console.log(x), _editorError(ed, x)
            elemValue(btn, x)
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
              let withoutBinding = bindAs ? new Map(binds) : binds;  _expandTutorialBindings[1] && bindAs && withoutBinding.delete(_unlabel(bindAs))
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
          const btn = elemValue(button(evt => (evt.preventDefault(), _parseEditor(ed).then(OnEnter).catch(err => OnEnter(err, true))), 'evaluate'), evaluator)
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
    call(x, lang) {
      if (!isArray(x) && defines(x, deconstruct) === undefined && !(x instanceof Map)) return
      if (defines(deconstruct(x), editObject) === false) return
      if (isArray(x) && Object.isFrozen(x)) return
      if (lang === null) return true

      const opts = {...serialize.displayed, collapseDepth:0, collapseBreadth:0}
      const flatten = (item, depth = 1) => {
        if (!isArray(item)) return item
        if (depth > 0)
          return item.map(x => flatten(x, depth-1))
        const isTrivial = typeof item == 'number' || typeof item == 'string' || typeof item == 'boolean'
        if (isTrivial || _invertBindingContext(Self.ctx).has(item))
          return item
        return elemValue(elemCollapse(() => {
          const srl = serialize(item, fancier, Self.ctx, opts)
          srl.contentEditable = 'false'
          return srl
        }), item)
      }
      let dec = deconstruct(x)
      if (isArray(dec) && defines(dec, construct)) dec = make(...dec)
      const initial = serialize(flatten(dec), lang, Self.ctx, opts).firstChild
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
    if (isArray(a)) a = a.join('')
    b = serialize(deconstruct(b), basic)
    if (isArray(b)) b = b.join('')
    return a === b
  },

  _unlabel(x) { return isArray(x) && x[0] === label ? x[1] : x },

  editRewrite:{
    docs:`\`editRewrite Global\`: changes the global for the next \`Rewrite\`.
Also supports \`editRewrite Global null\` to check whether an object can be rewritten, and \`editRewrite Global Language\` to specify a different editing language.`,
    call(x = undefined, lang) {
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
        !fail && (Rewrite.ctx.set(_unlabel(key), value), Rewrite.ctx.set(x, value))
        updateIndicator()
      })
      let dec = deconstruct(value)
      if (isArray(dec) && defines(dec, construct)) dec = make(...dec) // Sure hope there are no interrupts.
      const valueEditor = editor(serialize(dec, lang), lang, Rewrite.ctx, (v, fail) => {
        if (!fail) value=v, updateIndicator()
      }, (v, fail) => {
        value = v
        if (!fail)
          Rewrite.ctx.set(_unlabel(key), value), Rewrite.ctx.set(x, value)
        else if (v === undefined)
          Rewrite.ctx.delete(_unlabel(key)), Rewrite.ctx.set(x, undefined)
        else _editorError(valueEditor, v)
        updateIndicator()
      })
      return elem('div', [indicator, keyEditor, valueEditor, elemCollapse(Rewrite)])

      function updateIndicator() {
        const ctx = Rewrite.ctx, key = _unlabel(keyPreview)
        if (value === undefined)
          Self.ctx.has(key) ? (ctx.set(key, Self.ctx.get(key)), ctx.set(x, Self.ctx.get(key))) : (ctx.delete(key), ctx.set(x, undefined))
        else if (_hasSameRepr(value, ctx.get(key)))
          key !== value ? (ctx.set(key, value), ctx.set(x, value)) : (ctx.delete(key), ctx.set(x, undefined))
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
      Commands:_(`Commands`),
      rangeSetting:_(`rangeSetting`),
      settingsToolbar:_(`settingsToolbar`),
    },
    call(opt) {
      if (opt === undefined) {
        const m = _allocMap()
        Self.ctx.forEach(global => {
          if (isArray(global) && global[0] === settings)
            m.set(global, settings(global))
        })
        return hierarchy(m, elem('span', 'Current settings:'))
      } else {
        // An option is [settings, Value, HumanReadableName, OptToElemFunc].
        if (!isArray(opt) || opt[0] !== settings) return opt
        let el
        if (typeof opt[3] == 'function')
          // The func, if present, accepts the opt array where a[1] is the value, and optionally the element (to update it).
          el = opt[3](opt)
        else {
          if (typeof opt[1] == 'boolean')
            el = elem('input'), el.type = 'checkbox', el.checked = opt[1],
            el.oninput = el.onchange = () => writeAt(opt, 1, !!el.checked)
          else if (typeof opt[1] == 'number')
            el = elem('input'), el.type = 'number', el.value = opt[1],
            el.oninput = el.onchange = () => writeAt(opt, 1, +el.value)
          else if (typeof opt[1] == 'string')
            el = elem('textarea'), el.value = opt[1],
            el.oninput = el.onchange = () => writeAt(opt, 1, el.value)
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
      el.oninput = el.onchange = () => writeAt(opt, 1, typeof opt[6] == 'number' ? +el.value : Math.exp(+el.value))
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
    ['AuxClick', function(target, range, evt) { // Context-menu.
      contextMenu(target, range, evt)
    }],
    ['CtrlClick', _(`insertLinkTo`)],
    ['z', function(target, range, evt) { // Click/uncollapse.
      if (target && target.tagName === 'COLLAPSED' && target.lastChild && target.lastChild.tagName === 'HIDDEN')
        return evt = target.lastChild.lastChild, target.click(), evt // Don't lose the element.
      target && target.click && target.click()
    }],
    ['x', function(target, range, evt) { // Collapse.
      if (target && !_isEditable(target)) return elemCollapse(target)
      if (!target || target.to === undefined) return
      return evt = elemValue(elem('collapsed', '···'), target.to), evt.special = true, target.replaceWith(evt), evt
    }],
    ['c', function(target, range, evt) { // Context-menu.
      contextMenu(target, range)
    }],
    ['v', function(target, range, evt) { // Highlight values.
      Self.into.classList.toggle('noValueHighlight', !!_hoverHighlightsDOMValues[1], true)
      writeAt(_hoverHighlightsDOMValues, 1, !_hoverHighlightsDOMValues[1])
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
    if (ch instanceof Selection) !i ? (i = ch.focusOffset, ch = ch.focusNode) : (i = ch.anchorOffset, ch = ch.anchorNode)
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
    if (el instanceof Element) el = el.getBoundingClientRect()
    else if (!el || el.left === undefined || el.top === undefined) return
    return [el.left + scrollX, el.top + scrollY, el.right - el.left, el.bottom - el.top]
  },

  _smoothTransformPost:{
    docs:`For moving non position:inline elements from and to an arbitrary document location, smoothly and without lag. Use \`_smoothTransformPre\` to fill in \`pre\`.`,
    call(el, pre, delay = 0) {
      if (_disableSmoothTransitions[1]) return
      if (!pre || !(el instanceof Element)) return
      const post = _smoothTransformPre(el)
      if (!post || el.style.display || el.style.transform || el.style.transform && el.style.transform !== 'none') return
      if (pre[0] === post[0] && pre[1] === post[1]) return post
      el.style.display = 'none'
      el.style.transformOrigin = '0 0'
      const scale = pre[2] === post[2] && pre[3] === post[3] ? '' : `scale(${pre[2] / post[2]},${pre[3] / post[3]})`
      el.style.transform = `translate(${pre[0] - post[0]}px, ${pre[1] - post[1]}px) ${scale}`
      const spec = el.special
      el.special = (el, to) => {
        _reflow().then(() => {
          to.style.removeProperty('display')
          _reflow().then(() => {
            setTimeout(() => (to.style.removeProperty('transform-origin'), to.style.removeProperty('transform'), _clearStyle(to), to.special = spec), delay)
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
cpu: 0 is infinite delay (no work), 1 is no delay (all work), 0.5 is estimated-execution-time×1 delay, or a func from last duration (ms) to how long we need to rest (ms).
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
        let requiredRest = cpu === .5 ? lastDur : typeof cpu == 'number' ? lastDur * (1/cpu - 1) : cpu(lastDur)
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

  _isVar(x) { return isArray(x) && x[0] === label },

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
      if (onlyPublic && typeof k == 'string' && k[0] === '_') return
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
        if (net[k] == null || typeof net[k] == 'boolean' || isArray(net[k])) return
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
    docs:`\`examples()\`: Returns all available examples of usage of functions in a \`{…? …? Function (…? (Code ⇒ Becomes) …?) …? …?}\` format.
(To be clear, these are unit tests, though now they aren't being executed.)`,
    philosophy:`Tests are a tool for seeing what needs to be fixed before commiting to a change.
Not that I've been using them lately, ha-ha.`,
    call(f) {
      if (isArray(f)) error("Can only view examples of simple functions, not", f)
      const L = _langAt(), B = _bindingsAt()
      const fn = exs => {
        if (!isArray(exs)) return
        let [vals = [], r = [], i = 0, froms] = interrupt(4)
        try {
          for (; i < exs.length; ++i) {
            const a = exs[i]
            if (typeof a == 'string') { vals.push(a), r[i] = elem('div', stringToDoc(a));  continue }
            const env = call.env
            if (typeof a == 'function') { // If a function, it is an example generator.
              const to = elemValue(elemCollapse(() => {
                const b = a()
                return evaluator([array, 'equals', b[0], b[1]], _newExecutionEnv(env), to)
              }), a)
              vals.push(a), r[i] = to;  continue
            }
            if (!isArray(a)) error("Examples must be arrays or comments, got", a)
            if (env && !env[_id(print)]) { r[i] = a;  continue }
            let to
            try {
              if (froms === undefined)
                froms = parse(a[0], fancier, undefined, parse.dom)
              const fromValue = froms[0]
              to = a[1] ? parse(a[1]) : elemCollapse(() => {
                const result = elem('div');  result.style.display = 'table'
                _doJob([parse, a[0]], _newExecutionEnv(), got => {
                  result.append(evaluator(_rememberToDispose(got), _newExecutionEnv(env), to))
                })
                return result
              })
            } catch (err) { if (err === interrupt) throw err;  froms = [a[0], elem('serialize', a[0])], to = err }
            vals.push(_rememberToDispose(a[1] ? [froms[0], to] : [froms[0]]))
            r[i] = elem('div', [froms[1], elem('span', '\n⇒ '), serialize(to, L, B, serialize.displayed)])
            froms = undefined
            continue
          }
          return elemValue(elem('inline-block', r.length != 1 ? r : r[0]), vals)
        } catch (err) { if (err === interrupt) interrupt.stack.push(vals, r, i, froms);  throw err }
      }
      if (f !== undefined) return fn(defines(f, examples))
      let [result, n] = interrupt(2)
      try {
        if (n === undefined) {
          result = new Map
          _forEachGlobalDefining(examples, (v, r) => result.set(v, r), true)
          n = 0
        }
        let i = 0
        result.forEach((r,v) => {
          if (i++ < n) return
          result.set(v, fn(r))
          ++n
        })
        if (typeof document == ''+void 0) return result
        return hierarchy(result, elem('span', 'Code examples:'))
      } catch (err) { if (err === interrupt) interrupt.stack.push(result, n);  throw err }
    },
  },

  todo:{
    docs:`\`(todo F)\`: Returns a list of things to be done about \`F\`.
\`todo()\`: Returns all known things to be done. Less than a third is usually done.`,
    philosophy:`Through heedless difficulty, strength is gained.`,
    call(f) {
      if (isArray(f)) error("Can only view todos of simple functions, not", f)
      if (f !== undefined) return defines(f, todo)
      const result = new Map
      _forEachGlobalDefining(todo, (v, r) => result.set(v, r))
      return result
    },
  },

  philosophy:{
    docs:`Unlike regular philosophy, this one stems only from computation.

Theoretically, it is as good as any other. Practically, technology grows exponentially whereas human things cannot, so its variant will overtake all others sooner or later.`,
    philosophy:`Beliefs that are good enough for telling or a story are common. Beliefs that are good enough for code are rare. I haven't really seen much AGI-worthy stuff elsewhere, which makes people boring to me. Help me find interesting stuff.`,
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
      `\`m:{} (last (transform (definersOf philosophy) \\(mapWrite m ? (elem 'div' (stringToDoc (defines ? philosophy))))) (hierarchy m))\``,
      [
        `Reading club`,
        `Ivan Illich's Tools for Conviviality. A critique of all the ways of life that dominated humanity for many centuries, and still do, such as predication on unlimited growth, the domination of tools over people, compulsory demanded-by-government education and healthcare, radical monopoly of transportation ("The overdetermination of the physical environment renders it hostile. Radical monopoly makes people prisoners of welfare. Men overwhelmed by commodities are rendered impotent and in their rage either kill or die. The corruption of the balance of learning makes people into puppets of their tools.") — all of which is both true and obvious. Proposed solutions include "limit growth" and "give power to the people, and all things will be convivial", all of which have been tried since forever and have been abandoned each time because they don't work. He even thinks that human babies are the closest things to general intelligence that there are; hilarious. The book is more-or-less a call for a return to the basic structure of general intelligence, and the need to get away from particular things and (overfocused) paperclip optimizers to re-achieve balance in life, but with no clarity of what the basics actually are. Which is a tale as old as civilization. Overall, the writing is both true and disappointing. It really needs simplicity, clarity, and eyes to directly show usefulness of every point (might be impossible to do that in something as human-defined as politics, I'd think; "Conceptual rather than empirical criteria can be set for the constitutional limitation of power", my ass).
Little more than a lament on imperfect/imbalanced self-awareness, the uncanny valley of intelligence. Only a singularity in tools that have bound humanity in all ways can answer that lament well enough. ("It must be a tool which […] is respected by all; […] which […] does not lose its power because of [its] purpose […] in recent history; […] which […] possesses a fundamental structure that misuse cannot totally corrupt." Executing code directly is superior to hijacking minds of humans for the same work, so, code.)`,
        `Olaf Stapledon's Star Maker. A sci-fi book worth a thousand other sci-fi books, because it only looks at causes, not their effects, and doesn't really make noticeable mistakes (in the first half) thanks to experience in asking the averaged "why" (it's even in the title). But I do understand that such high-level narration is not everyone's cup of tea (not saying that those people are right, they're idiots, just saying that it can be as hard to read as a thousand sci-fi books).
There are some understandable mistakes, though. Telepathy, and the vagueness of the Starmaker and the resulting hippie/religious/cosmic-scale/20th-century-human angle (because let's be real, it's obviously a meta(phor) for general intelligence / singularity, which are sub-universes in practical formulations (see \`autoWorld\`). Perfect precision of foundations has many non-obvious consequences that very significantly affect the large-scale picture, such as copying/scalability and provable generality (so nothing "higher" is required), so the cosmic future predicted in this book is mostly incorrect), liveness of stars (for stars themselves to be called alive, self-preservation is needed; so some structure is preserved from star to star, surviving all the explosions and having billions of star generations, of which there is no chance, so, just because they're all the same does not mean that they're self-propagating). But make no mistake: even if some concepts are wrong, their usage is masterful, and it's no wonder that those who held them dear have called the book the most powerful work of imagination ever written, at some point. But not me.
I don't like this ceaseless butchering of innocent maidens. Should I stop the club? Maybe kill the reading club by making it, I dunno, a video-game-metaphors reading club?`,
        `Or the manga Berserk (where Griffith is best girl). All the best works of fiction are full of metaphors for operations of general intelligence, because of which they're considered the best. Transcending humanity with demonic rituals, sacrificing everything you've built on your previous foundation to make yourself better fit your goal, touching the very alien world that is the innermost truth of humanity, becoming an egg for the perfect world, finding true light only in darkness… Even Behelit's design is about rebuilding yourself from scratch, with features out of whack most of the time, only coming together at fateful moments. And because writing is about creating grand worlds, transcendence is pointlessly grand-scale.
I've seen so many such metaphors and events, both in fiction and the real world, that I've grown numb to the repetition. Berserk, like many, seemed not bad but not amazing either: just the same old things. 's good, I guess, or so I'm told.`,
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
    call(p) {
      if (!_isPromise(p)) return p
      if ('result' in p && !_isError(p.result)) return p.result
      else if ('result' in p) throw p.result
      _promiseReEnter.promise = p
      _causeInterrupt(p, _promiseReEnter)
    },
  },

  _promiseReEnter(expr, env, then) {
    // Re-schedule interpretation when the promise returns.
    _jobs.limbo.push(expr, env, then)
    const p = _promiseReEnter.promise
    p.then(
      r => (p.result = r, _jobResume(expr, env, then)),
      r => (p.result = _errorRepr(r), _jobResume(expr, env, then)))
    env[_id(await)] = p
  },

  _jobResume(expr, env, then) {
    env[_id(await)] = undefined
    const a = _jobs.limbo
    for (let i = 0; i < a.length; i += 3)
      if (a[i+1] === env)
        return a.splice(i,3), _schedule(expr, env, then)
  },

  delay:{
    docs:`\`delay()\` or \`(delay Value)\` or \`(delay Value Milliseconds)\`: Just a function for testing promises.`,
    nameResult:[
      `delayed`,
    ],
    examples:[
      [
        `delay 10`,
      ],
      [
        `await(delay 1)+await(delay 2)`,
      ],
      [
        `await(delay 1)*await(delay 3)+await(delay 4)*await(delay 5)`,
      ],
    ],
    await:true,
    call(x = 12, ms = 5000 + 1000 + Math.random()*4000) { return new Promise(then => setTimeout(then, ms, x)) },
  },

  jsRejected:{
    docs:`\`jsRejected Reason\`: throws an exception.`,
    call(err, stack) { throw stack === undefined ? err : [jsRejected, err, stack] },
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
      _maxUsageOfCPU:_(`_maxUsageOfCPU`),
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
      if (!returnJob && env && Object.getPrototypeOf(env) === null) Object.keys(env).forEach(k => {
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
      if (!isArray(el) && !el.parentNode)
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
    if (typeof document != ''+void 0 && isArray(env[_id(print)]))
      env[_id(print)] = env[_id(print)][0].nextSibling, env[_id(print)].previousSibling.remove()
    try { v = callAdjust(expr) }
    catch (err) {
      if (err === interrupt) interrupted = true, interrupt.stack && !interrupt.stack.length && (env[_id(interrupt)] = undefined)
      else v = _errorRepr(err)
    }
    interrupt.ed = false

    if (typeof document != ''+void 0 && interrupted && env[_id(_checkInterrupt)] !== undefined) {
      // Highlight the last-executed expr.
      _highlightOriginal(env[_id(_checkInterrupt)], true)
    } else env[_id(_checkInterrupt)] = undefined
    if (_isPromise(v)) { // Await top-level promises.
      if ('result' in v) v = v.result
      else expr = v, _promiseReEnter.promise = v, _jobs.reEnter = _promiseReEnter, interrupted = true
    }

    call.env = env
    env[_id(userTime)] += _timeSince(env[_id(realTime)])
    interrupt.stack = call.env = undefined

    if (interrupted) // Re-schedule.
      _jobs.reEnter === true ? _schedule(expr, env, then, true) : (_highlightOriginal(env[_id(_checkInterrupt)], false), _jobs.reEnter(expr, env, then))
    else // We have our result.
      try { _newJobId(env[_id(_schedule)]);  _rememberToDispose(v);  then && then(v) } catch (err) { console.error(err) }
  },

  _jobs:{
    docs:`The interpreter loop. Use \`_schedule\` to do stuff with it.`,
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

  _newExecutionEnv(basedOn = null, printBefore = null, langIs = fancier, bindsAre = Self.ctx) {
    // Create a new execution env.
    // Don't ever re-use the same env in _schedule, use this instead.
    const e = Object.create(null)
    e[_id(print)] = printBefore
    e[_id(_langAt)] = langIs
    e[_id(_bindingsAt)] = bindsAre
    basedOn && Object.assign(e, basedOn)

    e[_id(_schedule)] = undefined // Job ID.

    e[_id(call)] = 0 // The func call depth when we interrupted.
    e[_id(interrupt)] = undefined // Full execution state when we interrupted.
    e[_id(_checkInterrupt)] = undefined // The cause of interrupt (an executable node).
    e[_id(step)] = 0 // Ensure progress if interrupted in a place with many checks and one interrupt.
    e[_id(_pausedToStepper)] = undefined // Max func call depth at which we'll interrupt.
    e[_id(await)] = undefined // The promise that we are waiting on.

    e[_id(impureLoad)] = undefined // Index≥0 into impure tape to recall; count<0 of saves to skip, undefined to check non-recording, null to save.
    e[_id(impureSave)] = undefined // Replay tape for impure results.

    e[_id(adjustSave)] = undefined // Stack of arrays of results that adjustment would need.
    e[_id(adjustLoad)] = undefined // Stack of arrays of results that adjustment needs.
    e[_id(commit)] = undefined // Set of arrays of [value, changeSum, changeCount, …] to commit.

    e[_id(using)] = undefined // Map from AutoWorld to [AdjustInfo, ...Objects], to always adjust regeneration.

    e[_id(userTime)] = 0 // CPU time spent on this job.
    e[_id(realTime)] = undefined // The timestamp of when we last started executing this job.
    Object.seal(e)
    return e
  },

  last:{
    docs:`\`a;b;c\` or \`(last …Expressions)\`: (throws the first error or) returns the last result.
Execution is guaranteed to happen in this order.
In Scheme, the equivalent is called \`begin\`.`,
    type:[
      _(`funcType`),
      `x`,
      `y`,
      `y`,
    ],
    _resultCanBe(x) { _resultCanBe(x[x.length-1]) },
    keep:-1,
    dispose:-1,
    interrupt:false,
    call(...r) {
      // We shuffle in neither `call` nor compilation, so we can just do this:
      return r[r.length-1]
    },
    _compileBody(env, assignTo, ...args) { return `${assignTo} = ${args[args.length-1]}` },
    mergeAdjustment:_(`_mergeTensors`),
    adjust:{
      keep:-1,
      dispose:-1,
      interrupt:false,
      call(ins, out, dout) { const a = created(new Array(ins.length).fill(0));  a[a.length-1] = dout || 0;  return a },
      purify(ins, out, dout) { const a = created(new Array(ins.length).fill(0));  a[a.length-1] = dout;  return a },
    },
  },

  rest:{
    merged:true,
    docs:`\`(rest Array)\` or \`…Array\`: when statically used in an array, spreads the \`Array\` into the referencing array. Is a UI convenience.`,
  },

  false:false,

  true:true,

  quote:{
    docs:`\`(quote Expr)\` or \`^Expr\`: A special form that returns \`Expr\` unevaluated, quoting the exact object.

Makes it easy to insert a reference to any object when generating a program, don't you think so, you cute rascal?
But I know what you're really thinking: "arrays with heads that define \`construct\` will still be constructed by \`makeGraph\`, which is called by \`parse\`, so not all objects can be preserved as-is". That is a lot of specific knowledge; how did you come across that? Anyway, good thing that generation doesn't go through \`parse\`, then.`,
    todo:`For \`DAGType\`, expose \`quote\` and \`_unquote\` to generation.`,
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
      if (call.pure && call.pure.has(x)) return x
      return isArray(x) ? [quote, x] : x
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
        `^a a:(0 a() a)`,
        `a a:(0 a() a)`,
      ],
      [
        `^(sum \`x\` 1)`,
        `sum x 1`,
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

  _isLabel(v) { return isArray(v) && v[0] === label && typeof v[1] == 'string' && v.length == 2 },

  _unknown:{
    docs:`\`(_unknown Expr)\`: denotes that \`Expr\` is dependent on unknown factors and cannot be evaluated now, so it has to be deferred.`,
    argCount:1,
    call(x, reason) {
      if (isArray(x) && x[0] === _unknown) return x
      if (call.pure && call.pure.has(x)) return x
      const a = _allocArray(2)
      return a[0] = _unknown, a[1] = x, a
    },
  },

  _isUnknown(v) { return isArray(v) && v[0] === _unknown },

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
    Initialize() { Self.ctx.forEach(v => _id(v)) },
    interrupt:false,
    call(x, readonly = false, indexes = undefined) {
      if (indexes instanceof Map && indexes.has(x)) return indexes.get(x)
      if (!_id.xToIndex) _id.xToIndex = new Map, _id.n = 0, _id.sym = Symbol('_id')
      try {
        if (x && (typeof x == 'object' || typeof x == 'function')) {
          if (Object.prototype.hasOwnProperty.call(x, _id.sym)) return x[_id.sym]
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
      float:_(`randomFloat`),
      truncatedNormal:_(`truncatedNormal`),
      biasedGlorotNormal:_(`biasedGlorotNormal`),
    },
  },

  randomNat:{
    docs:`\`(randomNat Nat)\`: Picks a random non-negative integer less than \`Nat\`, from a uniform distribution.
An interface to JS's crypto.getRandomValues for generating random numbers on-demand as opposed to in-batches, optimizing to request the least amount of random bits required.`,
    nameResult:[
      `random`,
      `nat`,
      `int`,
    ],
    argCount:1,
    interrupt:false,
    call(n) {
      if (isArray(n)) n = _pickCount(n)

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
    docs:`\`(randomProb Probability)\`: Returns \`true\` with \`Probability\` \`p\`, else \`false\`.
Equivalent to \`randomFloat<p\` with checks on \`p\` (it should be 0…1), but (possibly) faster.`,
    type:[
      _(`funcType`),
      _(`_numberType`),
      [
        _(`boolsType`),
        1,
      ],
    ],
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

  randomFloat:{
    docs:`\`randomFloat()\`: Returns a number in 0…1.`,
    type:[
      _(`funcType`),
      _(`_numberType`),
    ],
    argCount:0,
    call() { if (call.pure) throw impure;  return Math.random() },
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

To be clear, the \`basic\` intermediate representation (IR) in question is "doing a thing may depend on having done other things; function applications are arrays, functions are first elements in them, and dependencies are references in those arrays": \`(add (mul 2 3) (mul 4 5))\`.

First, a very simple interpreter of trees, where no nodes (arrays) are shared.
Naturally, every interpreter, like every process, is a \`func\`, such as \`\\2*3+?\`.
To evaluate an array, we want to apply (\`applyArray\`) the \`transform\`ed-with-evaluation array; non-arrays (\`select\` where \`isArray ?\` returns \`false\`) should be returned as-is. Right-click (or tap-hold) if confused.
And to debug what you wrote, call it with some \`quote\`d input, like the one above.
Would you \`fancy\` composing composition out of these, by chance?`,
      [
        _(`fancy`),
        '',
        function(fn) {
          // It's easier to write the interpreter than to pattern-match these cases. Do that.
          if (typeof fn != 'function') return
          const ins = [5, [add, 1, 2], [add, [mul, [add, 4, 6], 10], [div, 10000, 100]]], outs = [5, 3, 200]
          const env = _newExecutionEnv()
          return {
            then: then => void _schedule([transform, quote(ins), fn], env, got => {
              if (!isArray(got) || got.length != 3) then(false)
              then(outs.every((o,i) => got[i] === o))
            }),
            cancel() { _cancel(env) },
          }
        },
      ],
      `The intended solution was: \`eval eval:\\(select (isArray ?) \\(applyArray (transform ? eval)) \\? ?)\`.
On desktop, you can type out just the function without binding to \`eval\`, then put your cursor where the function goes to \`transform\`, then hover over the function and Control-click it (\`insertLinkTo\` in \`Commands\`).
Also, do you not like the syntax? Then change it. Your world, your rules. Summon the context menu on \`_fancyOutermost\`, find its rewrite editor, edit it (don't forget to press Enter), then expand the next rewrite.

A real interpreter would also handle \`(quote (1 2 3))\`, and a real interpreter of inside-a-function would also handle \`input\`s. These are trivial enough to handle, so here, care not.

Instead, care about shared nodes.
Our IR has scope: \`a+a a:2*3\` or \`a:2*3 a+a\` is \`bound\` to be the same as \`2*3+2*3\`. In UI and compilers here, all references are already resolved, but in writing, we have to define variables. If you've never heard of scopes before… well, you're a big girl, you'll figure it out.
A node should remember its result. A \`map\` can remember keyed-by-node results, so here is a simple scheme: have \`m:{}\`, and return \`(mapRead m Node)\` if it does not equal \`_notFound\`, else return \`(mapWrite m Node ?)\`.
Can you see the unhandled cases?`,
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

We're not instantly making production-quality code here (like \`_compileBody\`), so you can be more relaxed than a bat hanging off a perch. If you reached this legitimately, then I'm so happy for you.

Talk time.

As we go from \`call\` to \`callAdjust\`, or from \`basic\` to \`fancy\` to \`fancier\`, it's always important to remember the basics, to keep things grounded.

Why is it so hard to do the most trivial things? Are you unused to reinventing the most basic things; maybe confused on why anyone would ever want to do that?
Basic things are foundations for everything else, and even minor changes in a base can mean arbitrarily big large-scale differences. The most obvious case is when it doesn't work or has a bug that needs to be worked around, but even little differences like "what order do we evaluate dependencies in" or "do we drop unneeded dependencies (and/or evaluate lazily)" or "do we do tail-call optimization, and do we have loops" need programs to adapt to that.
There can be an urge to just go with what is learned over life's course, and effectively put the bases you've learned to create one super-base, but there is never just one thing that is the best for all cases ever, and that applies to foundations too. Infinity cannot be "worked around", so face it head-on.

Now, why our particular DAG IR? It's convenient: for both humans and programs, referring to parts of programs is just a pointer. No need to manipulate characters nor juggle variable scopes, just \`make\` arrays and be done with program generation. This makes precision easy.

More importantly, if it was this simple for us to come up with an interpreter, then it's just as easy for generated programs to come up with an interpreter (and with proper partial evaluation, there shouldn't even be any inherent cost in doing so, though \`mapWrite\` doesn't support it out-of-the-box, so it has to be learned). The fact that this sits on top of relatively complicated parsing and object-construction and visualization and other mechanisms doesn't really matter to users, whether human or otherwise. Extensibility by implementation.

Well, no more talk. Goodbye, and take care.`,
    ],
    docs:`\`call ^(Func …Args)\`: \`call\`s all sub-items, then applies the first value (the function) to the rest of values.
Defining this allows function application. In fact, \`F:(func …?)\` is the same as \`(concept call F)\`.
Computation cycles are disallowed, and every node's value (array's value) is only computed once.
(This used to be used in the global interpreter loop, but was superseded by \`callAdjust\`.)


All languages, and everything that does stuff, must have an internal representation (IR) of arbitrary computations.

We chose our IR to be lambda-calculus-like: very simple and direct. But by itself, unlike Lambda calculus, our IR does not have closures, and needs a separate function to \`make\` them. This allows representing what actually happens in the machine more closely.
(We don't directly provide even closures. An equivalent effect can be achieved with arrays/objects anyway. Compilers could gain more from doing more search, even of seeming fundamentals: for example, partially-evaluate long-existing closures.)

Another difference is that our IR has no variable bindings, choosing to share nodes instead. This makes it easy to inspect programs.

It's simple so that it's easy to extend. Adding partial evaluation (\`purify\`)? Parallel execution? Compilation to a different target? Self-modification (\`using\`'s \`regenerate\`)? Simplicity itself, my friend. I'd extend it myself, but I want to use machine learning on these for optimal results, which is not trivial right now. But maybe I can work to make it more trivial to use?`,
    philosophy:`Programming languages are typically geared towards creating an abstraction layer that's convenient for humans to understand and use. Even Lisp has macros. Something so direct as this IR is unusual outside of machine code. Why would it be wanted?

It's for machines as much as it is for humans. If we can come up with a method of general learning that's as good as this IR could directly allow, then its intelligence is equal to humans'.
And, it's universal, and so can represent any computation, any doing of stuff, any other IR, and any other method of learning. General learning on even the simplest IR is general intelligence. The most obscure property of intelligence, self-modification? Learnable too.

In machine learning, The Bitter Lesson (as explained by the founder of reinforcement learning, Richard Sutton) is that compute reigns supreme over hand-engineered features in the end. Applied to programming languages, this means that a simple IR is sufficient. Lose all features but gain the world, assuming that learning has matured to be practical enough.

What is programming? Here, it's composition of functions: a tree of sequences of choices of what to be doing.
Sometimes they are annotated with types, and there is only one or a few choices; often, it's a huge mostly-worthless space.
Random and local and population-based searches won't do well.
Bayesian optimization needs simple constraints. But not only are our choices hierarchical, but they may well depend on nearby compositions.
Transformers on program text/instructions (from observations to Turing-complete choices, learning to predict the best sequence via trying several sequences and picking the best one)? A stilted form of reinforcement learning. Too flat, models no process, so, ultimately unsuitable.
Deep reinforcement learning? …Yes, it could work. With enough tricks from machine learning, with a good enough routing of differentiable information through the process of program generation (\`autoMake\`), and many choices stacked and interconnected — so really, hardly even RL at all. Learnable scaffolding around \`_choose\`, more like.
AGI may be possible with modern science, but isn't trivial at all. But I like a challenge.`,
    readAt:{
      last:_(`last`),
      quote:_(`quote`),
      apply:_(`apply`),
      func:_(`func`),
      select:_(`select`),
      equal:_(`equal`),
      purify:_(`purify`),
      error:_(`error`),
    },
    nameResult:[
      `result`,
    ],
    call(x) {
      // This is an interpreter of DAGs, the most powerful IR.
      // First, we handle purification and "I'm not a computation" and "I don't want to be a computation".
      if (call.pure) return purify(x)
      if (!isArray(x)) return x
      if (x[0] === quote) return x[1]

      // Don't forget to be interrupt-friendly!
      let [i = 0, outputs, po, inds, rc] = interrupt(5)

      // Evaluating inputs with recursion leaves ugly stack traces in errors, so we iterate over the post-order traversal instead.
      if (!po) [po, inds, rc] = _postorderInfo(x)
      if (!outputs) outputs = _allocArray(po.length)
      const collected = _allocArray(8)
      try {
        for (; i < po.length; ++i) {
          // Go through all nodes in the DAG, collect args, and apply functions.
          collected.length = inds[i].length
          for (let j=0; j < collected.length; ++j) {
            const ind = inds[i][j], dep = po[i][j]
            collected[j] = ind !== null ? outputs[ind] : isArray(dep) ? dep[1] : dep
            if (j === 0 && typeof collected[0] != 'function')
              error("Expected a function, got", collected[0])
          }
          outputs[i] = collected[0].call(...collected)
        }
        const result = outputs[po.length-1]
        outputs[po.length-1] = undefined, _disposeEachAndDealloc(outputs)
        _allocArray(po), inds.forEach(_allocArray), _allocArray(inds), _allocArray(rc)
        return result
      } catch (err) {
        if (err === interrupt) interrupt.stack.push(i, outputs, po, inds, rc)
        else _disposeEachAndDealloc(outputs)
        throw err
      } finally { _allocArray(collected) }
      // .env (current execution environment), .depth (current call depth), .pure.
    },
  },

  applyArray:{
    docs:`\`applyArray ^(Func …Args)\`: assuming that \`Func\` and \`Args\` are already evaluated, simply applies the function to arguments.`,
    dispose:true,
    call(x) {
      if (typeof x[0] != 'function')
        error('Expected a function to call, got', x[0], 'in the DAG node', x)
      return x[0].call(...x)
    },
  },

  apply:{
    genDepthFirst:true,
    type:[
      _(`funcType`),
      [
        _(`funcType`),
        [
          _(`rest`),
          `Inputs`,
        ],
        `Output`,
      ],
      [
        _(`rest`),
        `Inputs`,
      ],
      `Output`,
    ],
    examples:[
      [
        `repeat ^(apply \\?+randomVar() 5)=4 1000`,
      ],
    ],
    docs:`\`apply Func …Args\`: applies \`Func\` to \`Args\`.

\`(apply Func …Args)\` is semantically the same as \`(Func …Args)\`, but it behaves better for \`adjust\`ment of computed \`Func\`s.`,
    readAt:{
      applyArray:_(`applyArray`),
    },
    dispose:true,
    mergeAdjustment:_(`_mergeTensors`),
    adjustLater:true,
    adjust:{
      dispose:_(`_disposeEachAndDealloc`),
      call(ins, _, dout) {
        if (call.pure) throw impure
        const [fn, ...args] = ins
        const dargs = adjust(fn, args, _, dout)
        const dargs2 = _allocArray(1+dargs.length)
        dargs2[0] = undefined
        for (let i=0; i < dargs.length; ++i) dargs2[i+1] = dargs[i]
        _allocArray(dargs)
        return dargs2
      },
    },
    call(fn, ...args) {
      if (typeof fn != 'function')
        error('Expected a function to call, got', fn)
      return fn(...args)
    },
  },

  Constructions:{
    docs:`Arrays are a good way of representing graphs, but not all runtime objects are arrays. The functions here allow encoding objects in arrays.`,
    readAt:{
      make:_(`make`),
      makeGraph:_(`makeGraph`),
      construct:_(`construct`),
      deconstruct:_(`deconstruct`),
      concept:_(`concept`),
      map:_(`map`),
      weakMap:_(`weakMap`),
      tensor:_(`tensor`),
      static:_(`static`),
    },
  },

  make:{
    type:[
      _(`funcType`),
      [
        _(`funcType`),
        [
          _(`rest`),
          `Inputs`,
        ],
        `Output`,
      ],
      [
        _(`rest`),
        `Inputs`,
        _(`madeType`),
      ],
      [
        _(`madeType`),
        `Output`,
      ],
    ],
    docs:`\`make Construct …Args\`: Creates one construct when called.
Cycles are impossible to create using only this.`,
    call(...x) {
      const obj = construct(x)
      construct(x, obj)
      return obj
    },
  },

  makeGraph:{
    docs:`\`makeGraph Expr\`: Turns an array graph into an array/object graph, in place if possible.`,
    call(x, e, noFullConstruction = false) {
      let [env = e || _allocMap(), unfinished = new Set] = interrupt(2)
      // env: original —> constructed|original
      // unfinished: Whether a node is not constructed yet, for cycle detection.
      try { x = walk(x);  !e && _allocMap(env);  return x }
      catch (err) { if (err === interrupt) interrupt.stack.push(env, unfinished); else !e && _allocMap(env);  throw err }

      function walk(x) {
        if (!isArray(x)) return x

        // As a bonus, inline calls of known expressions.
        if (x.length == 2 && x[0] === call && (!isArray(x[1]) || isArray(x[1]) && x[1].length == 2 && x[1][0] === quote)) {
          const expr = isArray(x[1]) ? x[1][1] : x[1]
          if (isArray(expr)) x.length = 0, x.push(...expr)
          else x.length = 2, x[0] = quote, x[1] = expr
        }

        let [i, y = !Object.isFrozen(x) ? x : x.slice()] = interrupt(2)
        try {
          if (i === undefined) {
            if (env.has(x)) return env.get(x)
            if (!isArray(x[0]) && defines(x[0], construct))
              env.set(x, construct(y)), unfinished.add(y)
            else
              env.set(x, y)
            i = 0
          }
          for (; i < x.length; ++i)
            y[i] = walk(x[i])
          if (!noFullConstruction && env.get(x) !== y) {
            // To allow user-defined constructs, construct all (acyclic) potential dependencies then construct us.
            for (let i=0; i < x.length; ++i)
              if (unfinished.has(y[i]))
                error('User-defined constructs must not depend on their instances, as happened in', x[i])
            construct(y, env.get(x))
            unfinished.delete(y)
            return env.get(x)
          }
          return env.get(x)
        } catch (err) { if (err === interrupt) interrupt.stack.push(i, y);  throw err }
      }
    },
  },

  construct:{
    docs:`\`construct(x)\`→\`obj\` / \`construct(x,obj)\`: To encode non-array objects in array graphs, a global \`defines\` this.
Globals and user-defined concepts that statically define this are constructed right after parsing.

This embodies a simple principle: a graph/network cannot be constructed without backpatching.
(While this can be used to implement Lisp-like macros, please call quoted code or apply functions instead. \`construct\` is for non-array objects.)`,
    call(x, obj = undefined) {
      if (isArray(x)) {
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
        if (shapes !== undefined && !isArray(shapes)) error("Expected an array or nothing, got", shapes)
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
      else if (isArray(v)) return isArray(v[0]) || defines(v[0], construct) === undefined ? v.slice() : [arrayObject, ...v]

      if (typeof tf != ''+void 0 && v instanceof tf.Tensor) {
        let data
        try { data = serialize.styles ? v.arraySync() : _toBase64(v.dataSync()) }
        catch (err) { data = '<Disposed>' }
        if (v.dtype === 'float32' && v.shape.length <= 1 && !v.isDisposedInternal && v.size <= _maxSerializedTensorSize[1])
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
        // DON'T sort keys by _id. Preserve the original order.
        const keys = [...v.keys()]//.sort((a,b) => _id(a) - _id(b))
        const arr = [map]
        keys.forEach(k => arr.push(k, v.get(k)))
        return arr
      }
      if (v && v[defines.key]) {
        // Deconstruct into definitions, treating self-references specially (because funcs need that).
        const d = v[defines.key]
        const result = [concept]
        const selfRef = typeof v == 'function' ? {[defines.key]:{[_id(deconstruct)]:_unevalFunction(v)}} : result
        for (let k of Object.keys(d).sort((a,b) => _id(a) - _id(b))) {
          const val = d[k]
          if (k === call && typeof v == 'function') continue
          result.push(concept.idToKey[+k], val === v ? selfRef : val)
        }
        if (typeof v == 'function')
          result.push(call, selfRef)
        return result
      }
      if (typeof v == 'function')
        return _unevalFunction(v)
      if (!v || typeof v != 'object')
        return v
      // And, objects (likely in `readAt`) just get deconstructed as maps.
      const arr = [map]
      Object.keys(v).forEach(k => arr.push(k && +k === +k ? +k : k, v[k]))
      return arr
    },
  },

  _unevalFunction(f, dry = false, noWhitespaceRemoval = false) {
    let ctx = typeof f == 'function' && jsEval.ctx in f ? f[jsEval.ctx] : undefined
    if (ctx === Self.ctx) ctx = undefined

    const defC = !isArray(f) && defines(f, call)
    if (typeof defC == 'function' && f !== defC) f = defC
    // User-defined `concept`s can show up here, but `func`s must not.
    if (dry) return typeof f == 'function' && defines(f, deconstruct) === undefined

    let src = (''+f).split('\n')
    if (!noWhitespaceRemoval) {
      const ws = /^\s*/.exec(src[src.length-1])[0]
      src = src.map(line => line.replace(ws, ''))
    }
    src = src.join('\n').replace(/^[_a-zA-Z0-9]+/, '')
    try { Function('('+src+')') }
    catch (err) { src = 'function'+src }

    return ctx !== undefined ? [jsEval, src, ctx] : [jsEval, src]
  },

  input:{
    docs:`\`input\` or \`?\`: A convenient mark of a function input.
For example, both \`\\?+3 5\` and \`(func ? ?+3) 5\` return \`8\`.`,
  },

  _fallthroughFunc(n) {
    // Given count of inputs.
    if (n === 0) return function obj() { let z; try { return obj.f() } catch(err) { err===interrupt && (z=true); throw err } finally { !z&&adjustSave(obj.a) } }
    else if (n === 1) return function obj(a) { let z; try { return obj.f(a) } catch(err) { err===interrupt && (z=true); throw err } finally { !z&&adjustSave(obj.a) } }
    else if (n === 2) return function obj(a,b) { let z; try { return obj.f(a,b) } catch(err) { err===interrupt && (z=true); throw err } finally { !z&&adjustSave(obj.a) } }
    else return function obj(...a) { try { return obj.f(...a) } catch(err) { err===interrupt && (a=null); throw err } finally { a&&adjustSave(obj.a) } }
  },

  _fallthroughAutoFunc(n) {
    // Like `_fallthroughFunc`.
    return function obj(...a) {
      const prevAutoFuncNow = autoFunc.now;  autoFunc.now = obj
      let [stage = 0] = interrupt(1)
      try {
        if (stage === 0) using(obj), stage = 1
        // TODO: Also `_finishUsing()`.
        if (typeof obj.f != 'function') error(obj, "did not get compiled:", obj.f, obj.a)
        return obj.f(...a)
      } catch (err) { if (err === interrupt) interrupt.stack.push(stage), stage = null;  throw err }
      finally { if (stage !== null) adjustSave(obj.a);  autoFunc.now = prevAutoFuncNow }
    }
  },

  _adjustFunc:{
    call(ins, dout) {
      if (call.pure) throw impure
      // Resilient to a func's adjustment changing from when it was first called.
      const [adj = adjustLoad(null)] = interrupt(1)
      if (typeof adj != 'function' && adj !== null)
        _inexactReversal(true, "expected an adjustment function, got", adj, "for inputs", ...ins)
      try { return adj !== null ? adj(ins, undefined, dout) : _allocArray(ins.length).fill(0) }
      catch (err) { if (err === interrupt) interrupt.stack.push(adj);  throw err }
    },
    dispose(a) { if (isArray(a)) a.forEach(dispose), _allocArray(a) },
  },

  func:{
    docs:`\`\\Body\` or \`func ? Body\` or \`func …ArgNodes Body\` or \`Arg1->Arg2->Arg3->Body\`: A \`construct\` that can be called to evaluate \`Body\`, replacing values of \`ArgNodes\` with dynamically-provided values.

Note that despite what the arrow-syntax might suggest, there are no closures unless you \`make\` them (the objects you see are the only objects you get). Syntactic scope does not exist after parsing, so we wouldn't even know what's a closure. This way is more explicit anyway.

Funcs do not \`observe\` their nodes (that would need a lot of memory to wire up). Instead, re-compile the function object itself with \`writeAt\` (accessible from \`contextMenu\`) if a change is needed.`,
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
      if (!isArray(x) || x.length < 2) error("Expected at least the function body")
      if (obj === undefined) {
        obj = _fallthroughFunc(x.length-2)

        const d = obj[defines.key] = Object.create(null)
        d[_id(deconstruct)] = x.slice()
        d[_id(argCount)] = x.length-2
        d[_id(dispose)] = true

        d[_id(mergeAdjustment)] = _mergeTensors // Just assume that every arg is a tensor.
        d[_id(adjust)] = [_adjustFunc, _ins, _dout]
        d[_id(adjustLater)] = true // Make sure that the function is not skipped at adjustment.
          // (Checking whether any nodes define `adjustLater` would have been much more accurate, but that's data-dependent, and concepts are immutable. We never `observe` them, at least.)

        Object.freeze(d)
        return obj
      } else {
        const d = obj[defines.key], dd = d[_id(deconstruct)]
        if (d[_id(argCount)] !== x.length-2)
          error("Cannot change arg-count from", d[_id(argCount)], "to", x.length-2)
        dd.length=0, dd.push(...x)

        const inputs = _allocMap()
        for (let i = 1; i < x.length-1; ++i) inputs.set(x[i], i)
        const body = x[x.length-1]
        let [poIndRc = _postorderInfo(body, inputs)] = interrupt(1)
        try {
          if (!inputs.has(body))
            obj.a = _compileAutograd(poIndRc, inputs, undefined, obj)
          else
            obj.a = _giveAdjustTo(inputs.get(body)-1)
          obj.f = _compileBody(body, inputs, poIndRc, undefined, undefined, undefined, obj)
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

  _giveAdjustTo(n) {
    return function giveToInput(ins, _, dout) {
      const a = _allocArray(ins.length).fill(0)
      a[n] = keep(dout)
      return a
    }
  },

  _compileAutograd(poIndRc, inputs, types, sourceFunc) {
    // `_compileBody(autograd(poIndRc).0)`, but does proper checks and stuff and never returns `undefined`.
    if (!poIndRc[0].length) return null
    if (!adjust.inputs) adjust.inputs = new Map().set(_ins, 1).set(_out, 2).set(_dout, 3)
    let agAndMore = autograd(poIndRc, inputs, types)
    if (!agAndMore) return null
    let [ag, outTypes, outDisposers] = agAndMore;  _allocArray(agAndMore)
    ag = !_isError(ag) ? ag : ag.map(quote)
    const agPoIndRc = _postorderInfo(ag, adjust.inputs, true)
    const fun = _compileBody(ag, adjust.inputs, agPoIndRc, outTypes, false, outDisposers, sourceFunc)
    defines(_postorderInfo, dispose)(agPoIndRc)
    return _allocMap(outTypes), _allocMap(outDisposers), fun
  },

  _getSavedNodes:{
    docs:`Given nodes in post-order and indexes for each, returns a newly-allocated array of \`true\` if the node needs to be saved to adjustment or \`undefined\` (or returns \`null\`).`,
    call(po, ind) {
      let save = null
      for (let i=0; i < po.length; ++i) {
        const x = po[i], fn = _unquote(x[0]), ins = ind[i]
        if (typeof fn != 'function' || isArray(fn) || defines(fn, adjust) === undefined || defines(fn, mergeAdjustment) === undefined)
          continue
        const adj = defines(fn, adjust)
        _fillAdjustInputs(adj)
        if (fn === last || _doesAdjustRead(adj, 0))
          !save && (save = _allocArray(po.length)), save[i] = true
        if (fn !== last && _doesAdjustRead(adj, 'ins'))
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
    call(x) {
      const f = _fillAdjustInputs
      if (!f.out) f.out = new WeakSet, f.dout = new WeakSet, f.ins = new WeakMap, f.In = []
      const { out, dout, ins, In } = _fillAdjustInputs
      if (!isArray(x) || ins.has(x)) return
      ins.set(x, false)
      for (let i=0; i < x.length; ++i) {
        const c = x[i]
        if (ins.get(x) !== 'all' && isArray(c) && c.length == 3 && c[0] === readAt && c[1] === _ins) {
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
    if (typeof adj == 'function') return i !== 0 // Don't save `out` of func-based adjustments.
    if (i === 0) return _fillAdjustInputs.out.has(adj)
    if (i === 'dout') return _fillAdjustInputs.dout.has(adj)
    if (i === 'ins') return _fillAdjustInputs.ins.get(adj)
    if (_fillAdjustInputs.ins.get(adj) === 'all') return true
    return _fillAdjustInputs.In[i-1] ? _fillAdjustInputs.In[i-1].has(adj) : false
  },

  _nodeDisposer(x, disposers, types) {
    let node = x, disp
    while (true) {
      // `disposers` and `types` can override the defined disposer.
      if (disposers && disposers.has(node)) disp = disposers.get(node)
      else if (types && types.has(node)) disp = typeDisposer(types.get(node))
      else
        // Get how to dispose the result: consult definition (always dispose unknown-function results), go to index.
        disp = isArray(node) && (defines(node, dispose) || isArray(node[0]))

      if (typeof disp == 'number') disp < 0 && (disp += node.length), node = node[disp]
      else return typeof disp == 'function' ? disp : disp ? dispose : undefined
    }
  },

  _compileBody(body, inputs = null, poIndRc, types, saveToAdjust = true, nodeDisposers, sourceFunc) {
    // At least `body` is required.
    /*     Example of what this compiles DAGs to:
     * function(f,g,h) {
     *   'use strict'
     *   return function F(in1) {
     *     _checkInterrupt(F)
     *     let v0, v1, v2
     *     ++call.depth
     *     try {
     *         v0 = f(in1)
     *         v1 = g(v0, in1)
     *         v2 = h(v0, v1)
     *         return v2
     *     }
     *     finally { --call.depth }
     * }()
     *
     *     Complications:
     * - `interrupt` handling, to stop and resume execution.
     *   The variables may be restored on post-interrupt entry,
     *   and we may need an "instruction pointer" to not re-do done work,
     *   and the work may be wrapped in try/catch that saves all variables on interrupt.
     * - `adjustSave`ing some results for use in `adjust`.
     * - Typed `dispose`al of results, or `keep`ing them.
     */

    let owningPoIndRc = false
    if (!poIndRc && isArray(body) && body[0] !== quote)
      poIndRc = _postorderInfo(body), owningPoIndRc = true

    const consts = _allocMap()
    const [src, sourceURL, lines] = toSource(body, poIndRc, owningPoIndRc)
    try {
      const fn = Function([...consts.values()].join(','), src)(...consts.keys())
      fn.lines = lines
      if (!_compileBody.fin && typeof FinalizationRegistry != ''+void 0)
        _compileBody.fin = new FinalizationRegistry(sourceURL => delete _resolveStack.functions[sourceURL])
      _compileBody.fin && _compileBody.fin.register(fn, sourceURL)
      if (!_resolveStack.functions) _resolveStack.functions = Object.create(null)
      _resolveStack.functions[sourceURL] = typeof WeakRef != ''+void 0 ? new WeakRef(fn) : fn
      if (consts.size) fn[jsEval.ctx] = consts
      else _allocMap(consts)
      return fn
    } catch (err) { console.error(src, 'while trying to compile', body, 'got', err), _allocMap(consts); throw err }

    function toSource(body, poIndRc, owningPoIndRc) {
      // Compiles a DAG into an SSA form in JS that handles `interrupt`s.
      const code = _allocArray(0)
      let nextStage = 1

      const sourceURL = new Array(32).fill().map(() => (Math.random()*16 | 0).toString(16)).join('')
      const lines = []

      code.push(`'use strict'`)
      code.push(`return function F(${inputs ? [...inputs.values()].map(i => 'in'+i) : ''}) {`)
      if (!isArray(body) || body[0] === quote || !poIndRc[0].length)
        code.push(` return ${!inputs || !inputs.has(body) ? env(body) : `${env(keep)}(${env(body)})`}`)
      else if (poIndRc[0].length == 1 && !isArray(defines(body, adjust)) && defines(body, keep) === undefined) {
        _checkArgCount(body, inputs)
        lines.push(code.length+2, body)
        code.push(` try { return ++${env(call)}.depth, ${env(body[0])}(${body.slice(1).map(env)}) } finally { --${env(call)}.depth }`)
      } else {
        code.push(` ${env(_checkInterrupt)}(${sourceFunc === undefined ? 'F' : env(sourceFunc)})`)
        const backpatchVars = code.push(` VARIABLES`)-1
        code.push(` ++${env(call)}.depth`)
        code.push(` try {`)
        const backpatchGotoInterrupt = code.push(`  switch (stage) { case 0:`)-1

        const [po, inds, rc] = poIndRc
        const used = _allocArray(po.length)
        used.fill(0)
        const nodeNames = _allocArray(po.length), listOfVars = _allocArray(0), freeNames = _allocMap()

        // Fill in functions that have to dispose the result of every node when unneeded.
        const disposers = _allocArray(po.length)
        for (let i=0; i < po.length; ++i)
          disposers[i] = _nodeDisposer(po[i], nodeDisposers, types)

        // Save vars for adjustment.
        const save = saveToAdjust && _getSavedNodes(po, inds)
        // Keep (trade call to `keep` with lack of call to `dispose`) inputs of nodes that request that (unless they re-introduce a specific arg).
        const kept = _allocArray(po.length)
        for (let i=0; i < po.length; ++i) {
          let keepIndex = !isArray(_unquote(po[i][0])) ? defines(_unquote(po[i][0]), keep) : undefined
          keepIndex < 0 && (keepIndex += po[i].length)
          if (keepIndex == null) continue
          for (let j=0; j < po[i].length; ++j)
            // Keep the index if defined.
            if (inds[i][j] !== null)
              if (keepIndex === true && j || typeof keepIndex == 'number' && j === keepIndex)
                kept[inds[i][j]] = (kept[inds[i][j]] || 0) + 1
        }

        for (let i=0; i < po.length; ++i) {
          // Walk the DAG in post-order, emit assignment of vars to application results.
          //   We don't re-use variable slots that won't be used in computation, because adjustment could want them.
          //     (Re-computing results requires estimates of runtime of nodes or other predictions, which are unavailable for now.)
          const x = po[i], fn = _unquote(x[0]), ins = inds[i]
          _checkArgCount(x, inputs)
          if (i) if (isArray(fn) || defines(fn, interrupt) !== false) {
            // Advance the interrupt stage if we cannot guarantee the function is non-interrupting.
            code.push(`   stage = ${nextStage}; case ${nextStage}:`)
            ++nextStage
          }

          // Collect var names of dependencies, and `keep` non-node args.
          //   Test: `_compileBody ^(0+0;input) {input 1}` should `keep(in1)`.
          const d = !isArray(fn) ? defines(fn, _compileBody) : undefined
          const deps = _allocArray(x.length)
          let keepIndex = !isArray(fn) ? defines(fn, keep) : undefined
          keepIndex < 0 && (keepIndex += x.length)
          for (let j=0; j < x.length; ++j) {
            const In = ins[j]
            if (In === null) deps[j] = j || typeof d != 'function' ? env(x[j]) : undefined
            else if (!nodeNames[In])
              error("Node ref-counts are incorrect, and", x[j], "in node", x, "in body", body, "was already disposed of")
            else deps[j] = nodeNames[In], ++used[In]
            if (keepIndex === true && j || typeof keepIndex == 'number' && j === keepIndex)
              if (In === null && (inputs && inputs.has(x[j]) || _isDisposable(x[j])))
                !deps[j] && (deps[j] = env(x[j])), code.push(`   ${env(keep)}(${deps[j]})`)
          }

          // Alloc the variable name (re-use a same-disposer var if possible).
          let pool = freeNames.get(disposers[i])
          nodeNames[i] = pool && pool.length ? pool.pop() : (listOfVars.push('v'+i), 'v'+i)

          // Assign result of application to its var. (Also accommodate some debugging settings.)
          //   `x` can define `_compileBody(env, assignTo, ...args)`.
          lines.push(code.length+2, x)
          let stmt = typeof d == 'function' ? d(env, nodeNames[i], ...deps.slice(1)) : `${nodeNames[i]} = ${deps[0]}(${deps.slice(1)})`
          if (_debugMemory[1]) stmt += `; ${env(_willDispose)}(${nodeNames[i]}, ${env(x)})`
          if (_debugInterruptDefinitions[1] && !(isArray(fn) || defines(fn, interrupt) !== false))
            stmt = `try{${stmt}}catch(err){if(err===interrupt)error(${env("An interrupt in a non-interrupt node:")},${env(x)});throw err}`
          if (stmt.indexOf('\n') >= 0) error("Must not have newlines in", stmt)
          code.push(`   ${stmt}`)
          _allocArray(deps)

          // Decrease ref-counts of dependencies, and dispose vars and mark for re-use if no longer needed.
          let extra = _allocArray(0)
          for (let j=0; j < x.length; ++j) {
            const k = ins[j]
            if (k !== null && used[k] === rc[k]) {
              if (save && save[k]) continue // Adjustment will decide its fate.
              if (!nodeNames[k]) continue // Don't dispose the same arg twice.

              const d = disposers[k]
              if (!kept[k] && d !== undefined) // Don't dispose if another will take care of it.
                extra.push(`${env(d)}(${nodeNames[k]})`)
              extra.push(`${nodeNames[k]}=undefined`)

              if (!freeNames.has(d)) freeNames.set(d, _allocArray(0))
              freeNames.get(d).push(nodeNames[k]), nodeNames[k] = undefined
            }
          }
          // If adjustment needs the result but another node said it will dispose it, `keep` the result.
          if (save && save[i] && kept[i])
            extra.push(`${env(keep)}(${nodeNames[i]})`)
          // If N nodes said they'll dispose our result, `keep` the result N-1 times.
          for (let j = 1; j < kept[i]; ++j)
            extra.push(`${env(keep)}(${nodeNames[i]})`)
          extra.length && code.push(`     ${extra}`), _allocArray(extra)
        }
        if (save && save.filter(x => x).length) { // Save those that need saving, for adjustment.
          const svs = save.map((sv,i) => sv && nodeNames[i]).filter(x => x)
          code.push(`   const $$$=${env(_allocArray)}(${svs.length})${svs.map((sv,i) => '; $$$['+i+']='+sv).join('')}; ${env(adjustSave)}($$$)`)
          if (save[po.length - 1]) code.push(`   ${env(keep)}(${nodeNames[po.length - 1]})`)
        }
        isArray(save) && _allocArray(save), _allocArray(kept)
        code.push(`   return ${po.length ? nodeNames[po.length - 1] : env(body)}`)

        _allocArray(used), _allocArray(nodeNames)
        freeNames.forEach(_allocArray), _allocMap(freeNames)

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
        code.push(`  else ${listOfVars.map(v => disposers[+v.slice(1)] && `${v}!==undefined&&${env(disposers[+v.slice(1)])}(${v})`).filter(x=>x).join(', ')};`)
        _allocArray(disposers), _allocArray(listOfVars)
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
      x = _unquote(x)
      if (x == null || typeof x == 'number' || typeof x == 'boolean') return ''+x
      if (!consts.has(x))
        consts.set(x, 'e' + consts.size)
      return consts.get(x)
    }
  },

  _checkArgCount(x, inputs) {
    // Checks arg count, and function-ness, at compile time. Does not catch all cases, but it's good enough.
    if (!isArray(x)) return
    const fn = _unquote(x[0])
    if (isArray(fn) || inputs && inputs.has(x[0])) return
    if (typeof fn != 'function') error('Expected a function to call, got', fn, 'in the DAG node', x.slice(), 'with func inputs', inputs)
    if (typeof defines(fn, argCount) == 'number')
      if (defines(fn, argCount) !== x.length-1)
        error('Expected', defines(fn, argCount), 'args but got', x.length-1, 'in', x)
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
        if (!isArray(x) || x[0] === quote) return
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
      isArray:_(`isArray`),
      arrayLength:_(`arrayLength`),
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
    dispose:_(`_disposeEachAndDealloc`),
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
        return !isArray(v) || call.pure.has(v) ? keep(v) : v[0] === quote ? keep(v[1]) : _unknown(v)
      }
      if (impureHave()) return keep(impureLoad())
      return keep(impureSave(arr[i]))
      // readAt.parents: a Map from globals to what namespace they belong to.
    },
    purify(arrP, iP) {
      // When the array is known but the index is not, copy the array so that writes can't interfere.
      //   (But if the array is modified after `purify`, we wouldn't know.)
      if (isArray(arrP) && arrP[0] !== quote) throw impure
      const arr = !isArray(arrP) ? arrP : arrP[1]
      if (!isArray(arr)) throw impure
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
        if (x instanceof Map || isArray(x)) {
          x.forEach(v => markParents(v, p))
        } else if (x && !x[defines.key] && typeof x == 'object') {
          Object.keys(x).forEach(k => +k !== _id(deconstruct) && markParents(x[k], p, prioritize || +k === _id(readAt)))
        } else if (x && x[defines.key]) {
          markParents(x[defines.key], x)
        }
      }
      markParents(net)
      readAt.parents.set(net, Self)
    },
  },
  _arrayReadAdjustment:[
    _(`array`),
    [
      {
        call(arr, i, dout) {
          const r = array()
          isArray(arr) && callAdjust.darray.set(arr, r) // Make writes know.
          return r[i] = dout, r
        },
        purify(arrP, iP, doutP) {
          // Known-index reads will know adjustment.
          if (isArray(iP)) throw impure
          const r = array()
          if (isArray(arrP) && arrP[0] === quote && isArray(arrP[1]))
            callAdjust.darray.set(arrP[1], r)
          return r[iP] = doutP, r
        },
        interrupt:false,
      },
      _(`_inA`),
      _(`_inB`),
      _(`_dout`),
    ],
  ],
  writeAt:{
    docs:`\`writeAt Array Index Value\`: changes the current value at a position in an array.
If \`Index\` is undefined, re-constructs a construct in-place if possible.`,
    argCount:3,
    interrupt:false,
    purify(arrP, iP, vP) {
      // Allow writing impure computations into created arrays.
      if (isArray(arrP) && arrP[0] !== quote) throw impure
      if (isArray(iP) && iP[0] !== quote) throw impure
      const arr = !isArray(arrP) ? arrP : arrP[1]
      const i = !isArray(iP) ? iP : iP[1]
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
      } else if (isArray(arr)) {
        // Replace the contents of the whole array.
        if (!isArray(v)) error('Expected an array to replace', arr, 'with but got', v)
        if (arr === v) return
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
    Initialize() { observe.rs = new WeakMap, observe.changed = new Set, observe.fn = _throttled(_callChangeObservers, .2) },
    call(arr, f, forceTo = undefined) {
      if (!isArray(arr) && defines(arr, deconstruct) === undefined) return f
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
    call(arrs, itemMerger = _mergeTensors) {
      const result = array()
      // Merge each item. Go in reverse, to exactly restore the execution's order of accesses.
      //   This is like `_mergeTuples`, but also handles unknown-and-different length arrays.
      let maxLen = 0
      for (let i=0; i < arrs.length; ++i)
        if (isArray(arrs[i]) && (!call.pure || call.pure.has(arrs[i])))
          maxLen = Math.max(maxLen, arrs[i].length)
      for (let n = maxLen-1; n >= 0; --n) {
        let haveAny = false
        for (let i=0; i < arrs.length; ++i) {
          const arr = arrs[i]
          if (!isArray(arr) || call.pure && !call.pure.has(arr)) continue
          if (!arr[n]) continue
          haveAny = true
          if (!result[n])
            result[n] = arr[n]
          else if (!isArray(result[n]) || result[n][0] !== itemMerger || !isArray(result[n][1]) || result[n][1][0] !== array)
            result[n] = [itemMerger, [array, result[n], arr[n]]]
          else
            result[n][1].push(arr[n])
        }
        if (!haveAny) break
      }
      // Merge items that are in multiple adjustment arrays.
      for (let n=0; n < result.length; ++n)
        if (isArray(result[n]) && result[n][0] === itemMerger && isArray(result[n][1]) && result[n][1][0] === array)
          result[n] = itemMerger(result[n][1].slice(1)),
          _isUnknown(result[n]) && (result[n] = result[n][1])
      // If we can't merge everything, record the final result.
      let fin = null
      if (call.pure)
        for (let i=0; i < arrs.length; ++i)
          if (isArray(arrs[i]) && !call.pure.has(arrs[i]))
            (fin || (fin = result.length ? array(result) : array())).push(arrs[i])
      if (fin && fin.length == 1) return _unknown(fin[0])
      return fin ? _unknown([_mergeArrays, fin, quote(itemMerger)]) : result
    },
  },

  _mergeTuples:{
    docs:`Gathers a \`tupleType\`'s adjustments into one tuple.`,
    interrupt:false,
    call(arrs, itemMergers) {
      const result = array()
      // Merge each item. Go in reverse, to exactly restore the execution's order of accesses.
      for (let n = arrs[0].length-1; n >= 0; --n) {
        for (let i=0; i < arrs.length; ++i) {
          const arr = arrs[i]
          if (!isArray(arr) || call.pure && !call.pure.has(arr)) continue
          if (!arr[n]) continue
          if (n === arrs[0].length-1)
            result[n] = arr[n]
          else if (itemMergers[n] && n === arrs[0].length - 2)
            result[n] = [itemMergers[n], [array, result[n], arr[n]]]
          else if (itemMergers[n])
            result[n][1].push(arr[n])
        }
      }
      // Merge items that are in multiple adjustment arrays.
      for (let n=0; n < result.length; ++n)
        if (itemMergers[n] && isArray(result[n]) && result[n][0] === itemMergers[n] && isArray(result[n][1]) && result[n][1][0] === array)
          result[n] = itemMergers[n](result[n][1].slice(1)),
          _isUnknown(result[n]) && (result[n] = result[n][1])
      // If we can't merge everything, record the final result.
      let fin = null
      if (call.pure)
        for (let i=0; i < arrs.length; ++i)
          if (isArray(arrs[i]) && !call.pure.has(arrs[i]))
            (fin || (fin = result.length ? array(result) : array())).push(arrs[i])
      if (fin && fin.length == 1) return _unknown(fin[0])
      return fin ? _unknown([_mergeTuples, fin, quote(itemMergers)]) : result
    },
  },

  select:{
    genDepthFirst:true,
    type:[
      _(`funcType`),
      [
        _(`boolsType`),
        1,
      ],
      [
        _(`funcType`),
        [
          _(`rest`),
          `Inputs`
        ],
        `Output`,
      ],
      [
        _(`funcType`),
        [
          _(`rest`),
          `Inputs`
        ],
        `Output`,
      ],
      [
        _(`rest`),
        `Inputs`
      ],
      `Output`,
    ],
    docs:`\`select If Then Else …Args\`: calls \`Then …Arg\` if \`If\` is \`true\`, else \`Else …Args\`.
Inconvenient compared to being able to refer to closed-over variables directly, but simple and Turing-complete.

This is much like the φ function in SSA forms, but explicitly passing arguments to code blocks.`,
    _resultCanBe(x) { _resultCanBe(x[2]), _resultCanBe(x[3]) },
    call(If, Then, Else, ...Args) {
      return sync(If) === true ? Then(...Args) : Else(...Args)
    },
    purify(IfP, ThenP, ElseP, ...ArgsP) {
      if (isArray(IfP) && IfP[0] !== quote) throw impure
      return sync(IfP) === true ? purify([ThenP, ...ArgsP], true) : purify([ElseP, ...ArgsP], true)
      // If `IfP` was explicitly quoted by `quote`, then it's definitely not `true`.
    },
    _compileBody(env, assignTo, If, Then, Else, ...Args) { return `${assignTo} = ${If} === true ? ${Then}(${Args}) : ${Else}(${Args})` },
    dispose:true,
    adjustLater:true,
    mergeAdjustment:_(`_mergeTensors`),
    adjust(ins, _, dout) {
      const [If, Then, Else, ...Args] = ins
      return sync(If) === true ? adjust(Then, Args, null, dout) : adjust(Else, Args, null, dout)
    },
  },

  equal:{
    type:[
      _(`funcType`),
      `TypeA`,
      `TypeB`,
      _(`_numberType`),
    ],
    docs:`\`equal A B\`: returns \`true\` if \`A\` and \`B\` are reference-equal, otherwise \`false\`.`,
    argCount:2,
    interrupt:false,
    call(a,b) { return a === b },
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
      if (!isArray(obj)) error("Expected an array but got", obj)
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
Type systems, including dependent types, good for logic? They're about computing something about every value at compile-time. This can be done by replacing all values with \`(Value Type)\` and adding a type-computing always-inlined layer on top of all functions. Or by having another type-level interpreter for IR. But if types are annotated by humans case-by-case, then do they really say anything fundamental about computation? If we were to generate arbitrary programs, wouldn't it be better to allow them to be generated as a consequence of other operations like array-checking? Have, but then subvert.
Choices.
Choices.
Choices.
Choices.
Static is not good enough. Need dynamic.
And who's to say that these are the only choices to ever make, anyway?
Maybe, rather than trying to create a complete world by ourselves, we should allow a simple core to create whatever it wants.
Believe in simplicity. Let the joy of love give you an answer.`,
    philosophy:`The vanity and psychosis of those who hold absolute power are of no use to everyone else. Swat them aside, to make room for coming up with better versions of yourself.
I realized my mistake, and though I lost my vision, I can see the world now.`,
    examples:[
      [
        `purify ^(1+2)`,
        `3`,
      ],
      [
        `purify ^(randomNat 5)`,
        `_unknown (randomNat 5)`,
      ],
    ],
    readAt:{
      _purifyInWorker:_(`_purifyInWorker`),
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
      if (!isArray(x)) return x
      if (x[0] === quote) return x[1]

      let [adjLen = adjustUndo(), i = 0, poIndRc = _postorderInfo(x, inputs), outputs = _allocArray(poIndRc[0].length), same = _allocArray(poIndRc[0].length), unknown = _allocArray(poIndRc[0].length), pure = inline ? null : new Set, darray = _allocMap()] = interrupt(8)
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
            let depValue = ind !== null ? outputs[ind] : _unquote(po[i][j])
            if (ind !== null && !same[ind]) inputsAreSame = false
            if (inputs && (inputs.has(po[i][j]) || ind !== null && inputs.has(outputs[ind])) && inputPrograms === undefined)
              depUnknown = true
            else if (inputs && (inputs.has(po[i][j]) || ind !== null && inputs.has(outputs[ind]))) {
              const ind = inputs.has(po[i][j]) ? inputs.get(po[i][j]) : inputs.get(outputs[ind])
              const inp = isArray(inputPrograms) ? inputPrograms[ind-1] : inputPrograms
              depUnknown = isArray(inp) && inp[0] !== quote && !call.pure.has(inp)
              depValue = !isArray(inp) || inp[0] !== quote ? inp : inp[1]
              if (inputs.get(inp) !== ind) inputsAreSame = false
            } else if (defines(po[i], impure))
              depUnknown = true
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
            !isArray(x) && error("Non-array `created` values are not supported, but got", x)
            x.unshift(array)
          } : x => {
            // If the output is known, turn programs into values.
            for (let i=0; i < x.length; ++i) if (!call.pure.has(x[i])) x[i] = _unquote(x[i])
          }),
          pure.clear()
        outputs[po.length-1] = undefined, _disposeEachAndDealloc(outputs)
        _allocArray(same), _allocArray(unknown)
        defines(_postorderInfo, dispose)(poIndRc)
        adjustUndo(adjLen)
        return !lastUnk ? lastOut : _unknown(lastOut)
      } catch (err) {
        if (err === interrupt) { interrupt.stack.push(adjLen, i, poIndRc, outputs, same, unknown, pure, darray);  throw err }
        adjustUndo(adjLen)
        const errRepr = !inline && !(err instanceof Error) && _errorRepr(err)
        errRepr && errRepr.forEach(keep)
        _disposeEachAndDealloc(outputs)
        if (inline || err instanceof Error) throw err
        return _unknown(errRepr.map(quote)) // If not inlining, don't throw exceptions, return them.
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
    type:[
      _(`funcType`),
      _(5696),
      _(5696),
      _(5696),
    ],
    merged:true,
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
    type:[
      _(`funcType`),
      _(5696),
      _(5696),
      _(5696),
    ],
    merged:true,
    docs:`Multiplication, as in \`5*6\`=\`30\`.`,
    argCount:2,
    dispose:true,
    interrupt:false,
    call(a,b) { return typeof a == 'number' && typeof b == 'number' ? a*b : _tf(tf.mul(a,b)) },
    adjust:[
      _(`array`),
      [
        _(`mul`),
        _(`_dout`),
        _(`_inB`),
      ],
      [
        _(`mul`),
        _(`_dout`),
        _(`_inA`),
      ],
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  sub:{
    type:[
      _(`funcType`),
      _(5696),
      _(5696),
      _(5696),
    ],
    merged:true,
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
    type:[
      _(`funcType`),
      _(5696),
      _(5696),
      _(5696),
    ],
    merged:true,
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
    type:[
      _(`funcType`),
      _(5696),
      _(5696),
      _(5696),
    ],
    examples:[
      [
        `tensor(1 2 3 4 5)**5`,
      ],
    ],
    merged:true,
    dispose:true,
    docs:`Raises the first arg to the power of the second arg.`,
    argCount:2,
    interrupt:false,
    call(a,b) { return typeof a == 'number' && typeof b == 'number' ? Math.pow(a,b) : _noInfinities(tf.pow(a,b)) },
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

  sqrt:{
    type:[
      _(`funcType`),
      _(5696),
      _(5696),
    ],
    merged:true,
    dispose:true,
    docs:`\`\\pow(?,1/2)\``,
    argCount:1,
    interrupt:false,
    call(a) { return typeof a == 'number' ? Math.sqrt(a) : _tf(tf.sqrt(a)) },
    adjust:[
      _(`array`),
      [
        _(`div`),
        _(`_dout`),
        [
          _(`mul`),
          2,
          _(`_out`),
        ],
      ],
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  exp:{
    type:[
      _(`funcType`),
      _(5696),
      _(5696),
    ],
    merged:true,
    dispose:true,
    docs:`\`exp:\\pow(2.718281828459045,?)\``,
    argCount:1,
    interrupt:false,
    call(a) { return typeof a == 'number' ? Math.exp(a) : _noInfinities(tf.exp(a)) },
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
    type:[
      _(`funcType`),
      _(5696),
      _(5696),
    ],
    merged:true,
    dispose:true,
    docs:`\`expm1:\\exp(?)-1\`
Why: speed`,
    argCount:1,
    interrupt:false,
    call(a) { return typeof a == 'number' ? Math.expm1(a) : _noInfinities(tf.expm1(a)) },
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

  _noInfinities(x) { // Prevent (positive) infinities, so that `0*x` can still mask them out.
    let y
    return y = _tf(tf.minimum(x, 1e37)), dispose(x), y
  },
  
  log:{
    type:[
      _(`funcType`),
      _(5696),
      _(5696),
    ],
    merged:true,
    dispose:true,
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
    type:[
      _(`funcType`),
      _(5696),
      _(`_numberType`),
    ],
    merged:true,
    docs:`Sum of values in a tensor, as in \`sum (tensor (1 2 3 4))\`=\`tensor 10()\`.
The adjustment is passed through, to be broadcasted.`,
    dispose:true,
    interrupt:false,
    call(a, axis) { return typeof a == 'number' ? a : _tf(tf.sum(a, axis)) },
    adjust:[
      _(`array`),
      _(`_dout`),
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  max:{
    examples:[
      `\`\`settings ^_learningRate\`\``,
      [
        `repeat ^(max(randomVar(256))=5) 1000`,
      ],
      [
        `repeat ^(max(randomVar(256))=-5) 1000`,
      ],
    ],
    type:[
      _(`funcType`),
      _(5696),
      _(`_numberType`),
    ],
    merged:true,
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

  abs:{
    type:[
      _(`funcType`),
      _(5696),
      _(5696),
    ],
    merged:true,
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

  floor:{
    type:[
      _(`funcType`),
      _(5696),
      _(5696),
    ],
    merged:true,
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

  sign:{
    type:[
      _(`funcType`),
      _(5696),
      _(5696),
    ],
    merged:true,
    docs:`The sign of values in a tensor, as in \`sign (tensor (0 1 -2 3 -4))\`=\`tensor (0 1 -1 1 -1)\`.`,
    argCount:1,
    dispose:true,
    interrupt:false,
    call(a) { return typeof a == 'number' ? Math.sign(a)||0 : _tf(tf.sign(a)) },
  },

  clip:{
    type:[
      _(`funcType`),
      _(5696),
      _(5696),
      _(5696),
      _(5696),
    ],
    merged:true,
    dispose:true,
    docs:`Clips each value in a tensor between two static values (by default, between \`-2\` and \`2\`).
Is \`where a<Min Min (where a<Max a Max)\`.
Adjustment will try hard to make values fit too.`,
    interrupt:false,
    call(a, Min=-2, Max=2) { return typeof a == 'number' ? Math.min(Math.max(Min, a), Max) : _tf(tf.clipByValue(a, Min, Max)) },
    readAt:{
      clip2:_(`_clip2`),
    },
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

  _clip2:_([
    _(`concept`),
    _(`call`),
    _(`clip`),
    _(`type`),
    [
      _(`funcType`),
      _(5696),
      _(5696),
    ],
    _(`docs`),
    `A differently-\`type\`d version of \`clip\`.`,
  ]),

  argmax:{
    merged:true,
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
      broadcastTo:_(`broadcastTo`),
      slice:_(`slice`),
      split:_(`split`),
      concat:_(`concat`),
      stack:_(`stack`),
      unstack:_(`unstack`),
    },
  },

  sync:{
    merged:true,
    docs:`Synchronously downloads a value from GPU to CPU.
Ensures that a tensor is available as a JS value, like \`sync tensor(10()())\`=\`10\`.

If you don't schedule other GPU commands to keep it busy while CPU waits for the result of an earlier one, then this is inefficiency.`,
    argCount:1,
    interrupt:false,
    call(a) { return !_isDisposable(a) ? a : a.size === 1 ? (a.dtype === 'bool' ? !!a.dataSync()[0] : a.shape.length ? a.dataSync()[0] : a.arraySync()) : a.dataSync() },
  },

  broadcastTo:{
    type:[
      _(`funcType`),
      _(`_numberType`),
      [
        _(`quote`),
        `Sizes`,
      ],
      _(5696),
    ],
    merged:true,
    docs:`\`broadcastTo What Shape\`
Broadcasts a number/tensor into a shape compatible with another tensor. \`Shape\` can be a tensor too.
Mostly for converting numbers.`,
    examples:[
      [
        `broadcastTo 5 tensor(1 23 4)`,
        `tensor (5 5 5)`,
      ],
      [
        `repeat ^(broadcastTo randomVar() ^(3 2 3))=5 1000`,
      ],
    ],
    argCount:2,
    interrupt:false,
    dispose:true,
    call(a, shape) { if (call.pure) throw impure;  return _tf(tf.broadcastTo(a, !_isDisposable(shape) ? shape : shape.shape)) },
    mergeAdjustment:[
      _(`_mergeTensors`),
      null,
    ],
    adjust:[
      _(`array`),
      [
        _(`_limitTensorSize`),
        _(`_inB`),
        _(`_dout`),
      ],
    ],
  },

  slice:{
    docs:`\`slice Tensor Begin Size\`: Returns a slice of the tensor.`,
    readAt:{
      sliceOff:_(`sliceOff`),
    },
    examples:[
      [
        `slice tensor((1 2) (3 4)) 0 1`,
      ],
    ],
    dispose:true,
    interrupt:false,
    call(a, begin, size) { return !_isDisposable(a) ? a : _tf(tf.slice(a, begin, size)) },
  },

  sliceOff:{
    docs:`\`sliceOff Tensor At\`: Chooses one index in the outer dimension, removing it. Often more convenient than \`slice\`.`,
    examples:[
      [
        `sliceOff tensor((1 2) (3 4)) 0`,
      ],
    ],
    dispose:true,
    interrupt:false,
    argCount:2,
    call(a, at) {
      if (!_isDisposable(a)) return a
      const t = slice(a, at, 1)
      const t2 = _tf(tf.reshape(t, a.shape.slice(1)));  dispose(t)
      return t2
    },
  },

  split:{
    merged:true,
    docs:`\`split Tensor SizesArray\`→\`TensorArray\`: Splits off tensors.
Reverse of \`concat\`.`,
    examples:[
      [
        `split tensor((1 2 2 3 3 4)) ^(2 2 2)`,
        `(tensor (1 2)) (tensor (2 3)) (tensor (3 4))`,
      ],
      [
        `repeat ^((concat (split concat(array(randomVar(1),randomVar(1),randomVar(1)),sz) sz) sz)=5) 1000 sz:^(1 1 1)`,
      ],
      [
        `repeat ^(takeAt(sp,0)=5;takeAt(sp,1)=-5;v) 1000 sp:split(v,^(5 5)) v:randomVar(10)`,
      ],
    ],
    argCount:2,
    dispose:_(`_disposeEachAndDealloc`),
    interrupt:false,
    call(a, sz) {
      !isArray(sz) && errorStack("Not an array of sizes to split:", sz)
      if (!a) return _allocArray(sz.length).fill(0)
      a = tf.split(a, sz, !a.shape.length ? 0 : a.shape.length-1);  a.forEach(_tf);  return a
    },
    adjust:[
      _(`array`),
      [
        _(`concat`),
        _(`_dout`),
      ],
    ],
    mergeAdjustment:[
      _(`_mergeTensors`),
      null,
    ],
  },

  _concreteTensorSize(ctx, a, sz) {
    const eq = sz === true
    if (sz === undefined || typeof sz == 'boolean') sz = ctx.has(`Sizes`) ? ctx.get(`Sizes`) : a
    if (eq && sz === undefined) return a
    sz = _resolveTypeVar(sz)
    if (eq && _isTypeVar(sz) && _getTypeVarValue(sz) === sz) return a
    if (isArray(a) && a[0] === computeType && isArray(sz) && sz[0] === computeType)
      return a[1] === sz[1] ? a : null
    if (typeof sz == 'number' || isArray(sz) && sz.every(x => typeof x == 'number')) return sz
    if (isArray(sz)) {
      // …A random number, yes, but what, you want to route machine-learned embeddings through generating all possible numbers?
      if (sz[0] === rest) return 256
      // …Or even just through type refinement?
      if (sz[0] === sumType) return _concreteTensorSize(null, 0, sz[1+randomNat(sz.length-1)])
      return sz.map(n => _concreteTensorSize(null, 0, n))
    }
    if (_isTypeVar(sz)) return 256
    return null
  },

  concat:{
    merged:true,
    genDepthFirst:true,
    type:[
      _(`funcType`),
      [
        _(`tupleType`),
        [
          _(`tensorType`),
          [
            _(`rest`),
            `Sizes`,
          ],
          `A`,
        ],
        [
          _(`tensorType`),
          [
            _(`rest`),
            `Sizes`,
          ],
          [
            _(`computeType`),
            function(ctx, tp, eq) { // A + B = C
              if (eq) return tp
              return _concreteTensorSize(ctx,tp,ctx.get('C')) - _concreteTensorSize(ctx,tp,ctx.get('A'))
            },
            `B`,
          ],
        ],
      ],
      [
        _(`tupleType`),
        [
          _(`quote`),
          `A`,
        ],
        [
          _(`quote`),
          `B`,
        ],
      ],
      [
        _(`tensorType`),
        [
          _(`rest`),
          `Sizes`,
        ],
        `C`,
      ],
    ],
    docs:`\`concat TensorArray SizesArray\`→\`Tensor\`: Concatenates tensors along the last dimension.
All tensor datatypes and ranks (except in the non-batch first dimension) must match.
Reverse of \`split\`.
\`SizesArray\` is necessary for adjustment, optional otherwise.`,
    examples:[
      [
        `concat array(tensor(1 2),tensor(2 3),tensor(3 4))`,
        `tensor(1 2 2 3 3 4)`,
      ],
      [
        `repeat ^(concat(array(randomVar(1),randomVar(1),randomVar(1)),^(1 1 1))=5) 1000`,
      ],
    ],
    dispose:true,
    interrupt:false,
    call(a, sz, axis) {
      if (!isArray(a)) errorStack("Expected an array of tensors, got", a)
      if (call.pure && (call.pure.has(a) || call.pure.has(sz))) throw impure
      if (!a[0].shape) error('Strange tensor', a[0], 'in', a.slice())
      return _tf(tf.concat(a, axis !== undefined ? axis : !a[0].shape.length ? 0 : a[0].shape.length-1))
    },
    adjust:[
      _(`array`),
      [
        _(`split`),
        _(`_dout`),
        _(`_inB`),
      ],
    ],
    mergeAdjustment:[
      _(`_mergeArrays`),
      null,
    ],
  },

  stack:{
    type:[
      _(`funcType`),
      [
        _(`arrayType`),
        _(5696),
        `ArrayLength`,
      ],
      [
        _(`tensorType`),
        `ArrayLength`,
        [
          _(`rest`),
          `Sizes`,
        ],
      ],
    ],
    merged:true,
    docs:`\`stack TensorArray\`→\`Tensor\`: stacks equally-shaped tensors into a new outer dimension.

If \`Numeric\` code does not call \`select\` or \`sync\`, and we want to repeat it for different inputs, then using \`stack\` (followed by code then \`unstack\`) should not change the results, but it will make code faster by using GPU to parallelize instead of the CPU.`,
    examples:[
      `Simple usage:`,
      [
        `stack array(tensor(1 2),tensor(2 3),tensor(3 4))`,
        `tensor((1 2) (2 3) (3 4))`,
      ],
      `In fact, even \`concat\` is mostly immunized to our effects:`,
      [
        `concat array(stack(array(keep tensor(1 2 3),keep tensor(4 5 6))),stack(array(keep tensor(-1 -2 -3),keep tensor(-4 -5 -6))))`,
      ],
      `(Although, \`concat\` still expects everything to be of the exact same shape, so we can't \`stack\` some inputs and leave others be. Food for thought.)`,
      [
        `repeat ^(stack(array(randomVar(),randomVar(),randomVar()))=5) 1000`,
      ],
    ],
    dispose:true,
    interrupt:false,
    argCount:1,
    call(a) { if (call.pure && call.pure.has(a)) throw impure;  return _tf(tf.stack(a)) },
    adjust:[
      _(`array`),
      [
        _(`unstack`),
        _(`_dout`),
      ],
    ],
    mergeAdjustment:_(`_mergeArrays`),
  },

  unstack:{
    type:[
      _(`funcType`),
      [
        _(`tensorType`),
        `ArrayLength`,
        [
          _(`rest`),
          `Sizes`,
        ],
      ],
      [
        _(`arrayType`),
        _(5696),
        `ArrayLength`,
      ],
    ],
    merged:true,
    docs:`\`unstack Tensor\`→\`TensorArray\`: unstacks the outer dimension into an array.
Reverse of \`stack\`.`,
    examples:[
      [
        `unstack (tensor ((1 2) (2 3) (3 4)))`,
        `(tensor (1 2)) (tensor (2 3)) (tensor (3 4))`,
      ],
    ],
    dispose:_(`_disposeEachAndDealloc`),
    interrupt:false,
    argCount:1,
    call(a) { a = tf.unstack(a);  a.forEach(_tf);  return a },
    adjust:[
      _(`stack`),
      _(`_dout`),
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  norm:{
    merged:true,
    docs:`\`norm Tensor Order\`: The norm of N-th order of values in a tensor.
\`Order\`=\`1\` (the default) sums absolute values (\`sum(abs(Tensor))\`), like \`norm (tensor (1 -2 3 -4))\`=\`tensor 10()\`.
Other \`Order\`s are computed as \`pow(sum(pow(abs(Tensor),Order)),1/Order)\`.
No adjustment because of laziness.`,
    dispose:true,
    interrupt:false,
    call(a, order=1) { return typeof a == 'number' ? a : _tf(tf.norm(a, order)) },
  },

  matMul:{
    genDepthFirst:true,
    type:[
      _(`funcType`),
      [
        _(`tensorType`),
        [
          _(`rest`),
          `R`,
        ],
        `N`,
        `M`,
      ],
      [
        _(`tensorType`),
        [
          _(`rest`),
          `R`,
        ],
        `M`,
        `K`,
      ],
      [
        _(`tensorType`),
        [
          _(`rest`),
          `R`,
        ],
        `N`,
        `K`,
      ],
    ],
    merged:true,
    docs:`Matrix multiplication of \`A\` by \`B\`.
Like a cross-sectional dot product: each element of the output is the sum of every element in a row in \`A\` \`mul\`tiplied by its corresponding element in a column in \`B\`. (So, if input shapes are N×M and M×K, then output is shaped as N×K.)
Can also handle "\`A\` is a vector" (the operation is then called a non-batched \`_denseLayer\`; resulting in a vector) and "\`A\` or \`B\` is a number" cases, by padding the missing outer dimensions with \`1\` then un-padding.`,
    argCount:2,
    dispose:true,
    interrupt:false,
    readAt:{
      _denseLayer:_(`_denseLayer`),
    },
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

  _denseLayer:_([
    _(`concept`),
    _(`call`),
    _(`matMul`),
    _(`type`),
    [
      _(`funcType`),
      [
        _(`tensorType`),
        `A`,
      ],
      [
        _(`tensorType`),
        `A`,
        `B`,
      ],
      [
        _(`tensorType`),
        `B`,
      ],
    ],
    _(`docs`),
    `A differently-\`type\`d \`matMul\`.`,
  ]),

  _matMul:{
    merged:true,
    docs:`An interface to tf.matMul, but it can reshape args to accept JS numbers in both args, and row vectors in first arg.`,
    dispose:true,
    interrupt:false,
    call(a,b, tA, tB) {
      let result
      if (a == null || b == null) error("Bad inputs to matMul:", a, b)
      if (!a || !b) return 0
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
          if (typeof b != 'number') errorStack("Expected a number or a tensor, got", [matMul, a, b])
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

  _debugInterruptDefinitions:[
    _(`settings`),
    false,
    `Whether \`_compileBody\` should assert that no interrupt occurs in no-interrupt places.`,
  ],

  _debugLastInterrupt:[
    _(`settings`),
    true, // ##################################
    `If checked, makes \`_causeInterrupt\` remember the call-stack, to be displayed if relevant.`,
  ],

  _checkMemoryIntegrity:{
    docs:`If we still have any unfreed tensors that are not visible, this reports the DAG nodes that created them and the tensors.
If no env is passed in, this returns the count of tensors in the passed-in result (so that we can count tensors and check that no non-returned tensors are left).`,
    call(result, env) {
      if (!_checkMemoryIntegrity.seen) _checkMemoryIntegrity.seen = new Set
      if (!_willDispose.disposable) return 0
      const seen = _checkMemoryIntegrity.seen
      try {
        walk(result)
        env && env[_id(commit)] && env[_id(commit)].forEach(walk)
        if (env) {
          const r = _allocArray(0)
          _willDispose.disposable.forEach((info, dis) => {
            if (!seen.has(dis) && !_rememberToDispose.seen.has(dis) && !dis.isDisposedInternal)
              r.push([_extracted, info, dis])
          })
          _willDispose.disposable.clear()
          if (r.length)
            error("Got", result, "but forgot to free:", ...r)
          _allocArray(r)
        }
        return seen.forEach(x => !_isDisposable(x) && _checkMemoryIntegrity.seen.delete(x)), seen.size
      } finally { seen.clear() }

      function walk(x) {
        if (_rememberToDispose.seen.has(x)) return
        _isDisposable(x) && _checkMemoryIntegrity.seen.add(x)
        if (!isArray(x)) return
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
    docs:`When the graph is finalized, this remembers to clear all resources that it holds. Seems to not be 100% reliable, not to mention slow to dispose? But better than nothing.
Used when a job returns a value, when it's very unlikely that parts of the returned graph will be used except for possible displaying.`,
    Initialize() {
      _rememberToDispose.seen = new WeakSet
      _rememberToDispose.res = new WeakMap
      if (typeof FinalizationRegistry != ''+void 0) {
        _rememberToDispose.reg = new FinalizationRegistry(res => {
          // console.log('disposing', ...res) // #######################
          res.forEach(dispose), res.length = 0, _rememberToDispose.res.delete(res)
        })
      }
    },
    call(x) {
      if (!x || typeof x != 'object' && typeof x != 'function') return x
      if (_rememberToDispose.seen.has(x)) return x
      if (!isArray(x) && !(x instanceof Map) && !(defines.key in x)) return x
      _rememberToDispose.seen.add(x)
      if (isArray(x)) _rememberArrayItems(x)
      else if (x instanceof Map) x.forEach(_rememberToDispose)
      else if (x && x[defines.key]) Object.values(x[defines.key]).forEach(_rememberToDispose)
      return x
    },
  },

  _rememberArrayItems(x) {
    // This does the actual remember-to-dispose, of each `_isDisposable` item.
    x.forEach(_rememberToDispose)
    const resM = _rememberToDispose.res, resR = _rememberToDispose.reg
    let res, allow = 0
    if (resM.has(x)) {
      res = resM.get(x)
      for (let i=0; i < res.length; ++i) _rememberToDispose.seen.delete(res[i])
      allow -= res.length, res.length = 0
    } else res = _allocArray(0)

    for (let i=0; i < x.length; ++i)
      if (_isDisposable(x[i])) res.push(x[i]), _rememberToDispose.seen.add(x[i])

    allow += res.length
    if (res.length) {
      if (!resM.has(x)) resM.set(x, res), resR && resR.register(x, res, res)//, observe(x, _rememberArrayItems, true)
    } else { // ########################################
      if (resM.has(x)) resM.delete(x), resR && resR.unregister(res)//, observe(x, _rememberArrayItems, false)
      _allocArray(res)
    }
    allow && _disposableCount.allowed !== undefined && (_disposableCount.allowed += allow)
    return allow
  },

  typeAdjustmentMerger:{
    docs:`This allows an input type to define \`mergeAdjustment\` of functions that accept it, for \`autoFunc\`s to know the proper definition.

The definitions take the type and the result-cache (a \`map\`), and must return \`(Func EssentialStructure)\`, where \`EssentialStructure\` is \`merged\`. \`Func\` will be cached and returned. Inner calls to \`typeAdjustmentMerger\` will always return this tuple instead of \`Func\`.`,
    interrupt:false,
    call(tp) {
      const prevInner = typeAdjustmentMerger.inner
      if (isArray(tp) && defines(tp, typeAdjustmentMerger)) try {
        typeAdjustmentMerger.inner = true
        const cache = typeAdjustmentMerger.cache || (typeAdjustmentMerger.cache = new WeakMap)
        const b = defines(tp, typeAdjustmentMerger)(tp, cache)
        if (!isArray(b) || b.length != 2) error("Expected a tuple of func and structure, got", b, "from mergers of", tp)
        if (b[1] && (typeof b[1] == 'object' || (typeof b[1] == 'function')))
          if (!cache.has(b[1])) cache.set(b[1], b[0])
        if (prevInner) return b[0] = cache.get(b[1]), b
        try { return cache.get(b[1]) } finally { _allocArray(b) }
      } finally { typeAdjustmentMerger.inner = prevInner }
      if (prevInner) { const a = _allocArray(2);  [a[0], a[1]] = [null, null];  return a }
      return null

      // .cache, .inner
    },
  },

  typeDisposer:{
    todo:`Have+use \`typeKeeper\` as the reverse of this.`,
    docs:`This allows the output type to define \`dispose\` of functions that return it, for \`autoFunc\`s to know the proper definition.

The definitions take the type and the result-cache (a \`map\`), and must return \`(Func EssentialStructure)\`, where \`EssentialStructure\` is \`merged\`. \`Func\` will be cached and returned. Inner calls to \`typeDisposer\` will always return this tuple instead of \`Func\`.`,
    interrupt:false,
    call(tp) {
      const prevInner = typeDisposer.inner
      if (isArray(tp) && defines(tp, typeDisposer)) try {
        typeDisposer.inner = true
        const cache = typeDisposer.cache || (typeDisposer.cache = new WeakMap)
        const b = defines(tp, typeDisposer)(tp, cache)
        if (!isArray(b) || b.length != 2) error("Expected a tuple of func and structure, got", b, "from mergers of", tp)
        if (!cache.has(b[1])) cache.set(b[1], b[0])
        if (prevInner) return b[0] = cache.get(b[1]), b
        try { return cache.get(b[1]) } finally { _allocArray(b) }
      } finally { typeDisposer.inner = prevInner }
      if (prevInner) { const a = _allocArray(2);  [a[0], a[1]] = [undefined, undefined];  return a }
      return

      // .cache, .inner
    },
  },

  mergeAdjustment:{
    docs:`Defines how to merge adjustments returned from \`adjust\`ing many dependents, to produce local output change in \`autograd\`.
For each input that a DAG node is, this must be defined the same.
Any function that \`defines\` \`adjust\` must also define this, with a function that takes an array of input changes and returns output change (called at compile-time, with programs as array items), or with an array of such functions (if they need to be input-specific).`,
  },

  _mergeTensors:{
    docs:`Add up tensors.`,
    interrupt:false,
    call(arr) {
      if (!call.pure) return _tf(tf.addN(arr))
      // Create a sub-program to add them all up.
      if (arr.length == 1) return isArray(arr[0]) ? _unknown(arr[0]) : arr[0]
      let i = 0
      return _unknown(arr.reduce((a,b) => ++i & 1 ? [add, a, b] : [add, a[1], [add, a[2], b]]))
    },
  },

  _unquote(x) { return isArray(x) && x[0] === quote ? x[1] : x },

  autograd:{
    docs:`The result reverses execution, computing changes of inputs given change of output.
With basic functions that define \`adjust\` correctly, this can be used to automatically implement gradient descent (hence the name \`autograd\`).

More precisely.
A function that, given linearization of a function's DAG, purifies and returns the expression that computes input change (\`dins\`) given an array of inputs, output, and output change (\`(arrayObject ins out dout)\`).
(Cannot handle putting an input as a function.)`,
    todo:`Make known-adjustment parts of the resulting program execute as soon as possible, by separating out the parts of \`b\` that don't depend on adjustment's \`input\` (have a special value for that), and executing them right before the return of the call, and giving results of nodes-that-don't-depend to nodes-that-do-and-use-independents by \`adjustSave\`ing the array of them.`,
    call(poIndRc, inputs, types) {
      // Example usage: `autograd(_postorderInfo ^(matMul ? 2+3)).0`.
      if (!isArray(poIndRc) || poIndRc.length != 3)
        error("Expected result of applying", _postorderInfo, "but got", poIndRc)
      const [po, inds, rc] = poIndRc
      let [save, loaded, dins = _allocArray(po.length), douts = _allocArray(po.length), inputAdj, program, outTypes = _allocMap(), outDisposers = _allocMap()] = interrupt(8)
      try {
        if (!save) {
          save = _getSavedNodes(po, inds) || _allocArray(0)
          for (let i=0; i < po.length; ++i) {
            const x = po[i], fn = _unquote(x[0]), ins = inds[i]
            if (inputs && inputs.has(fn)) error('Calling/adjusting dynamic functions is forbidden but got', x)
            if (typeof fn != 'function' || isArray(fn) || defines(fn, adjust) === undefined || defines(fn, mergeAdjustment) === undefined)
              continue
            // Pre-create arrays, so that dependents can fill merging.
            douts[i] = i === po.length-1 ? _dout : [undefined, [array]]
          }

          // Fill out the nodes to read from the `adjustLoad()` array that owns outputs of some nodes, not just `true` in `save`.
          loaded = [adjustLoad, save.filter(x => x).length]
          for (let i=0, n=0; i < po.length; ++i)
            if (save[i])
              save[i] = [takeAt, loaded, n++],
              types && types.has(po[i]) ? outTypes.set(save[i], types.get(po[i])) : outDisposers.set(save[i], _nodeDisposer(po[i]))
        }

        // Go through the post-order in reverse (to reverse computation perfectly), and purify adjustment for each node.
        if (!inputAdj) {
          inputAdj = _allocMap()
          if (inputs) for (let k of inputs.keys()) inputAdj.set(k, [undefined, [array]])
          for (let i = po.length-1; i>=0; --i) {
            // Fill in programs for `ins`, `out`, `dout`.
            //   (This loop cannot interrupt.)
            const x = po[i], fn = _unquote(x[0])
            if (typeof fn != 'function' || isArray(fn) || defines(fn, adjust) === undefined || defines(fn, mergeAdjustment) === undefined)
              continue
            if (x.length !== inds[i].length) error("A DAG and its linearization have drifted apart")
            const out = save[i]
            const ins = _allocArray(x.length);  ins[0] = array
            for (let j=1; j < x.length; ++j)
              if (inputs && inputs.has(x[j]))
                ins[j] = [readAt, _ins, inputs.get(x[j])-1]
              else if (save[inds[i][j]] !== undefined)
                ins[j] = save[inds[i][j]]
              else if (!isArray(x[j]) || x[j][0] === quote)
                ins[j] = x[j]
              else
                ins[j] = undefined

            const adj = defines(fn, adjust)
            const changeLength = isArray(adj) && adj[0] === array ? adj.length : x.length

            if (typeof adj != 'function') {
              _bindInput[1] = ins, _bindInput[2] = out
              _bindInput[3] = douts[i] === _dout || isArray(douts[i]) && douts[i][0] ? douts[i] : undefined
              dins[i] = bound(_bindInput, adj, false)
              // …`ins` is never de-allocated, even if unused. Would need a flag in `_bindInput` for that.
            } else
              dins[i] = [adj, ins, null, douts[i] === _dout || isArray(douts[i]) && douts[i][0] ? douts[i] : undefined],
              defines(adj, dispose) === undefined && outDisposers.set(dins[i], _disposeEachAndDealloc)

            // Distribute change, `dins`, to inputs of adjustment, `dout` (via readAt(dins[i], index)).
            //   (In reverse order, so that mergers could always restore the original execution order if they wanted to.)
            const mergers = defines(fn, mergeAdjustment)
            if (mergers)
              for (let j = changeLength-1; j >= 1; --j) {
                const mrgNode = inds[i][j] !== null ? douts[inds[i][j]] : inputAdj.get(x[j])
                const inputNode = inds[i][j] !== null ? po[inds[i][j]] : x[j]
                if (mrgNode !== undefined) {
                  // Fill out merger and add a source to its input.
                  //   Array mergers are input-specific; non-array mergers apply to all inputs.
                  // In `array X Y`, undefined inputs won't be adjusted.
                  if (isArray(dins[i]) && dins[i][0] === array && !dins[i][j]) continue
                  let m = isArray(mergers) ? mergers[j-1] : mergers
                  if (types && types.has(inputNode)) m = typeAdjustmentMerger(types.get(inputNode))
                  if (m && mrgNode[0] === undefined)
                    mrgNode[0] = m
                  else if (m && mrgNode[0] !== m)
                    error("Mergers of the same value should be the same, but had", mrgNode[0], "and got", m, "at input", inds[i][j] !== null ? po[inds[i][j]] : x[j], "of node", po[i])
                  mrgNode[1].push(isArray(dins[i]) && dins[i][0] === array ? dins[i][j] : [readAt, dins[i], j-1])
                }
              }
          }
          _bindInput[1] = _bindInput[2] = _bindInput[3] = undefined
          const dinputs = [...inputAdj.values()].map(a => a[0] !== undefined ? a : undefined)
          dinputs.unshift(array)
          // Don't forget to preserve nodes that do not depend on inputs but still need adjustment (`defines(x, adjustLater)` is `true`).
          program = [last, ...dins.filter((x,i) => !isArray(_unquote(po[i][0])) && defines(_unquote(po[i][0]), adjustLater)).reverse(), dinputs]
          if (program.length == 2 && !program[1]) return null
          if (program.length == 2) program = program[1]
        }
        let b = purify(program, false, adjust.inputs)
        if (isArray(b)) // From value-space of output of `purify`, to program-space.
          b = b[0] === _unknown ? b[1] : quote(b)
        // This `last` makes sure that exceptions won't cause partial disposal of saved state.
        const thoseSaved = save.filter(x => x)
        _allocArray(save), _allocArray(dins), _allocArray(douts)
        _allocMap(inputAdj)
        const r = _allocArray(3);  [r[0], r[1], r[2]] = [thoseSaved.length ? [last, ...thoseSaved, b] : b, outTypes, outDisposers];  return r
      } catch (err) { if (err === interrupt) interrupt.stack.push(save, loaded, dins, douts, inputAdj, program, outTypes, outDisposers); else _allocMap(outTypes), _allocMap(outDisposers);  throw err }
    },
  },

  _bindInput(x) {
    return adjust.inputs.has(x) ? _bindInput[adjust.inputs.get(x)] : isArray(x) && x[0] === quote ? x : undefined
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

  prompt:{
    docs:`\`prompt Params …Options\`
Simply asks/prompts the user to choose between \`Options\`.
\`Params\` could be \`{Timeout ms}\`.`,
    examples:[
      [
        `(prompt {Timeout 10000} 1 2 3 4 5)*5`,
      ],
    ],
    call(params, ...options) {
      if (!options.length) error("Expected some options to choose from")
      if (options.length == 1) return options[0]
      let [pr] = interrupt(1)
      try {
        if (pr) return await(pr)
        const buttons = elem('context-menu-buttons')
        let clicked
        function OnClick() {
          elemRemove(buttons)
          this ? clicked(this.to) : clicked(undefined)
        }
        for (let i = 0; i < options.length; ++i) {
          const btn = elem('button', options[i] instanceof Node ? options[i] : ''+options[i])
          elemValue(btn, options[i])
          buttons.append(btn)
          btn.onclick = OnClick
        }
        print(buttons)
        if (params) {
          params = _destructure(params)
          if (params.Timeout) setTimeout(OnClick, params.Timeout)
        }
        await(pr = new Promise(then => clicked = then))
      } catch (err) { if (err === interrupt) interrupt.stack.push(pr);  throw err }
    },
  },

  display:{
    docs:`\`display Label Value\`: displays a plot of all \`Value\`s at a \`Label\`. \`display Label\`: clears the display at a \`Label\`.
Browser-only.
The plot can display the exact values at cursor, and be zoomed in by a dragged click (and zoomed out by a quick click).

(There was a need to display losses during training. A day after, this appeared.)`,
    examples:[
      [
        `(display hi ^(6 7 6.4 1 2.1 3))`,
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
      } else if (isArray(vle) || typeof vle == 'number' || vle === null) {
        let L = call.env[_id(print)]
        if (!(L instanceof Map)) {
          L = new Map([[print, L]])
          const tbl = elemValue(elem('table'), display)
          L.set(display, tbl)
          call.env[_id(print)] = L
          print(tbl)
        }
        if (!_updatePlots.cells) _updatePlots.cells = new Set, _updatePlots.fn = _throttled(_updatePlots, .2)
        if (!L.has(lbl)) {
          // Create a table row with the label and the plot.
          const data = isArray(vle) ? vle.slice() : vle !== null ? [vle] : []
          const row = elem('tr', [elem('td', serialize(lbl, _langAt(), _bindingsAt(), serialize.displayed)), elem('td')])
          const cell = row.lastChild

          const sizes = display.sizes
          const dv = elem('div')
          const svg = d3.create('svg')
            .attr("width", sizes.width + sizes.left + sizes.right - .5) // (Firefox/Chromium agree only with this -.5.)
            .attr("height", sizes.height + sizes.top + sizes.bottom)
          const tooltip = elem('div')
          tooltip.style.position = 'absolute', tooltip.style.left = tooltip.style.top = 0, tooltip.style.pointerEvents = 'none'
          const num = elem('number')
          dv.append(svg.node(), num)
          num.textContent = data.length ? ''+data[0] : '<Nothing>',
          svg.node().style.display = 'none'

          cell.style.position = 'relative'
          cell.append(tooltip, dv)

          if (typeof ResizeObserver != ''+void 0)
            (function(L, lbl, dv) {
              new ResizeObserver(entries => {
                L.has(lbl) && L.get(lbl).to.length > 1 && _updatePlotLater(L.get(lbl))
              }).observe(dv)
            })(L, lbl, dv)

          L.set(lbl, elemValue(cell, data))
          const pre = _smoothHeightPre(L.get(display))
          elemInsert(L.get(display), row)
          _reflow().then(() => _smoothHeightPost(L.get(display), pre))
        } else if (isArray(vle))
          L.get(lbl).to.push(...vle)
        else if (vle !== null)
          L.get(lbl).to.push(vle)

        _updatePlotLater(L.get(lbl))
      } else
        error("Expected undefined or null or a number, got", vle)
    },
  },

  _updatePlotLater(cell) {
    !_updatePlots.cells.size && setTimeout(_updatePlots.fn, 200)
    _updatePlots.cells.add(cell)
  },

  _updatePlots() {
    // Performs scheduled updates of plots.
    _updatePlots.cells.forEach(update)
    return new Promise(then => setTimeout(then, 0))

    function update(cell) {
      _updatePlots.cells.delete(cell)
      if (typeof ResizeObserver != ''+void 0)
        cell.lastChild.classList.toggle('resizable', cell.to.length > 1)
      const hadText = cell.lastChild.lastChild.textContent
      if (cell.to.length > 1) {
        if (hadText)
          cell.lastChild.lastChild.textContent = '',
          cell.lastChild.firstChild.style.removeProperty('display')
        _updatePlot(d3.select(cell.lastChild.firstChild), hadText ? display.sizes : sizeOf(cell.lastChild), cell.to)
      } else
        cell.lastChild.lastChild.textContent = cell.to.length ? ''+cell.to[0] : '<Nothing>',
        cell.lastChild.firstChild.style.display = 'none'
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
    // .cells (a Set), .fn (a `_throttled` mirror of this function)
  },

  _updatePlot(svg, sizes, data, begin, end) {
    if (!isArray(data)) error("Expected an array, got", data)
    const el = svg.node()
    let transition = false
    if (begin === undefined)
      begin = el._begin !== undefined ? el._begin : 0
    else transition = true
    if (end === undefined)
      end = el._end !== undefined && el._end !== el._len ? el._end : data.length
    else transition = true

    svg
      .attr("width", sizes.width + sizes.left + sizes.right - .5) // (Firefox/Chromium agree only with this -.5.)
      .attr("height", sizes.height + sizes.top + sizes.bottom)
    let xAxis, yAxis, plot
    if (!el.firstChild) {
      // If empty, create children, and attach events.
      xAxis = svg.append('g'), yAxis = svg.append('g'), plot = svg.append('path')

      const tooltip = svg.node().parentNode.previousSibling
      const focus = d3.select(elem('div')).style('opacity', 0).style('border', '.1em solid currentColor').style('transition', 'none')
      const text = d3.select(elem('text')).style('opacity', 0).style('color', 'currentColor').style('display', 'block').style('transition', 'none').style('text-align', 'center')
      focus.style('width', '1em').style('height', '1em').style('border-radius', '.5em')
      text.node().append(elem('text'), elem('number'))
      text.node().firstChild.style.textShadow = '0 0 .15em var(--background)'
      text.node().lastChild.style.textShadow = '0 0 .15em var(--background)'
      tooltip.append(focus.node(), text.node())

      // Also show the exact value at cursor.
      const zoom = svg.append('g').append('rect').style('fill', 'rgba(30,50,200,.3)').attr('y', 0).attr('height', '100%')
      let zoomBegin = null
      function mouseMove(evt) {
        let [cx,cy] = d3.pointer(evt, this)
        let i = Math.max(0, Math.min(Math.round(this._x.invert(cx)-1), this._len-1)), data = this._data
        if (i < 0 || i >= this._len)
          focus.style('opacity', 0), text.style('opacity', 0)
        else {
          const x = this._x(i+1), y = this._y(data[i])
          focus.style('opacity', 1), text.style('opacity', 1)
          focus.style('transform', `translate(-50%,-50%) translate(1ch,0) translate(${x}px, ${y}px)`)
          text.node().firstChild.textContent = 'At '+(i+1)+', the value is\n'
          text.node().lastChild.textContent = (data[i] < 1e8 ? data[i] : data[i].toExponential(2))
          text.style('transform', `translate(-50%,-100%) translate(1ch,0) translate(${x}px, ${y-20}px)`)
        }

        // Also display the rectangle of the future zoom.
        if (zoomBegin !== null) {
          let l = this._x(zoomBegin+1), r = this._x(i+1)
          if (zoomBegin === i) l = this._x(1), r = this._x(data.length)
          if (i >= 0 && i < this._len)
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
        const i = Math.max(0, Math.min(Math.round(this._x.invert(cx)-1), this._len-1))
        if (i >= 0 && i < this._len) zoomBegin = i
        evt.preventDefault()
        mouseMove.call(this, evt)
      }).on('mouseup', function(evt) {
        if (zoomBegin === null) return
        let [cx,cy] = d3.pointer(evt, this)
        let i = Math.max(0, Math.min(Math.round(this._x.invert(cx)-1), this._len-1)), data = this._data, sizes = this._sizes
        if (i >= 0 && i < this._len) {
          if (i === this._len-1) i = data.length-1
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
    el._x = x, el._y = y, el._data = data, el._sizes = sizes, el._begin = begin, el._end = end === data.length ? undefined : end, el._len = data.length, el._step = step

    // Zoom (also show a bit of values before the shown range, unless they're way out of range) (also average items).
    let begin2 = begin
    while (begin2 > 0 && begin2 > begin - 100 && data[begin2-1] >= Min - extra*10 && data[begin2-1] <= Max + extra*10) --begin2
    let view
    if (begin2 || end < data.length-100 || step > 1 || Min < -1e4 || Max > 1e4) {
      // Skip items, trim offscreen points.
      view = []
      for (let i=0; begin2 + i*step < end+step-1; ++i) {
        let a = begin2 + i*step, b = begin2 + (i+1)*step, s = 0
        for (let j = a; j < b; ++j) s += data[j]
        view[i] = s / (b-a)
      }
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

The basic idea of \`adjust\`ment is: go in exact reverse of \`call\`, with \`adjustSave\` pushing to a stack of state, and \`adjustLoad\` popping from the stack. In particular, gradient descent is naturally implementable and implemented with this.

In Conceptual, we replaced the interpreter with this execute+adjust function, so that all execution can \`predict\` things.
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

A variable that is given an array of the tensor (the current value) and some zeroes, and some hyper-parameterization.
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

The loss that is used, \`loss2\`, is the halved square of the difference between predicted and actual: \`a=b\` is mostly \`minimize d*d/2 d:a-b\`. So you should be aware that it's about \`18\` if the prediction of \`6\` is \`0\`, likely fractional.

To implement functionality is to be able to use it repeatedly, without conditionality, heatedly. So, almost 5 bugs later, made it something greater.

But, it leaks some memory, and it's slow.
To my little friend, say hello: \`\`settings ^_debugMemory\`\`.

I see the narration has lost its maening to rhyming. \`\`elemCollapse elem('text',"Your next words are: ""but the correct spelling is 'meaning'!"" But meaning is the priority, not someone else's made-up rules of its spelling.")\`\` To guide it back to the true path…
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
      `(Note: gradient is the direction of change that would maximize \`predict\`ion error/loss, and what we're doing by predicting several input-output pairs is estimating the true gradient by averaging gradient at data points, then \`sub\`tracting a simple function of the gradient.)

Okay, in this regard, there's nowhere to grow now. API designers should only know the numbers \`0\`, \`1\`, and \`Infinity\`, and we reached the last one.

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
\`callAdjust\` was to remind you that if you don't understand something enough, then you should go back and \`repeat\` things that lead up to it. That's how loss goes down.

But also…
Strap in, it's not easy reading.

Deep learning has been getting popular since about 2012 {https://trends.google.com/trends/explore?date=all&q=deep%20learning}. It's all about network depth and lots of computation. We don't have either, but the core ideas are sound, and sounds become words and mindsets. No datasets, no over-engineering, and no precious achievements. Complexity is pointless anyway.
It's practically synonymous with machine learning.
Machine learning is a mindset, also called a universal approximator: it can approximate any function, just as code developers can do anything. Be careless, and it can replace all your thoughts with itself. It's often called AI algorithms.

Let's compare that with general intelligence.

In a mind, improvement causes co-evolved concepts to emerge and define behavior (getting good leads to understanding). They're amorphous, but not ill-defined: goals solidify them. In code, a concept can be separated into a function like \`predict\`, and be expressed as requirement of particular usage patterns like \`interrupt\`, or even as many clumps of code in other functions like memory-management needs… There are no constraints on structure, and the only beauty is how high some numbers become. Generality of choosing any structure, and intelligence of learning those choices. (It's special because it tends to self-propagate, in order to drive those numbers up.)

Machine learning is a lesser but practical modern cousin of that. A kind of discretization of that infinite space.

- A concept here corresponds to a number, and there's only a fixed count (number=float, count=int) of those.
  By connecting many simple variables with simple differentiable computations and \`adjust\`ing after each execution, numbers are made better. (The computations are called "neural networks" because of history, but the principles are not specific to brains.)
  The simplest connection is all-to-all (so every output number is a linear combination of input numbers), which \`matMul\` of a row vector (or a column of them) by a weight matrix realizes (other simplest approaches include convolutions and random connections). In general in programs, the more adjustable information we route the better. The computation should be generatable.

- Improvement here means usually differentiable operations because they can be mathematically proven to converge, but any numeric operations that improve prediction should do, because this usually composes. The adjustment should be generatable.

- Choices here correspond to minimizing the misprediction (loss/error) of rewards (goals) of actions (options). There can only be one action per choice (for example, can only generate one program), and the predictions for each can be used in some way that may maximize the reward at a choice (argmax is preferred, but random exploration noise can be useful too).

General and practical… enough to transcend.
I don't like to talk about what good grasp of those means for everyday life, though I'll have to, in time.
(And, to mention the current trends of machine learning, people mainly care about having only one non-optional loss, and making all operations differentiable. No learned inter-connection of many goals, no learned adjustment, and no learned goals. Warped to be neatly packaged. That's why we can't use TensorFlowJS as anything except a numeric-ops backend, and even then, only its immediate mode.)
And for all that, we must first have the \`callAdjust\` family of concepts. Which we now do.

I can only pray that we have enough strength to do all those. And the way to get that is to open our eyes with words, to bind our selves into one, tight enough to withstand learning otherwise. Tutorials are the future, my elven friend, and the future starts with you.
Blind coding is not the way, we will just end up focusing on special cases of general intelligence (such as \`randomVar\`).

May the sun guide your righteous path.

Next, might I suggest \`tutorial Neural\` to continue your training in the way of the learning? All in service of \`tutorial autoWorld\`.

\`\`REPL()\`\``,
    ],
    examples:[
      `Loss goes down.`,
      [
        `repeat ^(v*2=4;v+2=4 v:varSGD(randomVarData(),.01)) 300`,
      ],
      [
        `repeat ^(v*2=4;v+2=4 v:varMomentum(randomVarData(),.01,.99)) 1000`,
      ],
      [
        `repeat ^(v*2=4;v+2=4 v:varRMSProp(randomVarData(),.01,.999)) 300`,
      ],
      [
        `repeat ^(v*2=4;v+2=4 v:varAdam(randomVarData(),.01,.99,.999)) 1000`,
      ],
      `(Momentum and Adam are wiggly-wiggly if you zoom in.)`,
    ],
    readAt:{
      varSGD:_(`varSGD`),
      commit:_(`commit`),
      minimize:_(`minimize`),
      adjust:_(`adjust`),
      _any:_(`_any`),
      replay:_(`replay`),
      _learningRate:_(`_learningRate`),
    },
    call(expr, cl, aj, saveReplay = true) {
      if (call.pure) return purify(expr)
      // Set and finally reset some global variables for us to communicate with some other code through.
      //   Perfectly readable, what are you talking about. By skipping over it.
      //     Besides, what are the alternatives?
      //       Forcing every expression in all user code to take and return an array with their values?
      //         By my calculations, that's approximately a million point two times less readable.
      let [compCall = cl || undefined, compAdj = aj || undefined, result, adjustInfo, s = 0, n = 0, disposable = _allocMap(), numTensors = _disposableCount.allowed || 0, allowedTensors = numTensors, darray = _allocMap(), futures = _allocMap()] = interrupt(11)
      const prevDisposable = _willDispose.disposable;  _willDispose.disposable = disposable
      const ps = callAdjust.s, pn = callAdjust.n;  callAdjust.s = s, callAdjust.n = n
      predict.happened = false
      const prevAllowed = _disposableCount.allowed !== undefined;  _disposableCount.allowed = allowedTensors
      const prevDarray = callAdjust.darray;  callAdjust.darray = darray
      const prevFutures = future.f;  future.f = futures

      const startTensors = _disposableCount()
      let extraTensors
      try {
        // Compile call then adjustment, then call then adjust, then assert exact-ness of reversal, then save to replay buffer, then return result.
        if (compCall === undefined) {
          _tf.all && _tf.all.clear()
          compAdj = _postorderInfo(expr)
          compCall = _compileBody(expr, null, compAdj, undefined, undefined, undefined, expr)
        }
        if (isArray(compAdj)) {
          const r = _compileAutograd(compAdj, undefined, undefined, expr);  defines(_postorderInfo, dispose)(compAdj), compAdj = r
        }

        // Call.
        if (result === undefined) {
          const arr = adjustLater(compCall)
          if (interrupt.stack) error(expr, "got", arr[0], "but did not recover from an interrupt at", _resolveStack(interrupt.last), "and still have", ...interrupt.stack)
          ;[result, adjustInfo] = arr;  _allocArray(arr)
          result === undefined && (result = _onlyUndefined)

          if (adjustInfo && call.pure) throw _destroyAdjustmentStack(adjustInfo), impure
        }

        // Adjust.
        // We don't have a loss function at the top-level, nor a dataset, only `predict`. So no dout.
        if (compAdj !== null)
          _disposeEachAndDealloc(adjustNow(adjustInfo, compAdj)), compAdj = null

        // Adapt dynamically-regenerating objects.
        if (call.env && call.env[_id(using)] !== undefined)
          _adjustUsing(call.env[_id(using)]), call.env[_id(using)] = undefined

        // Display average loss, if there is any. (Also dispose the tensor used for carrying that info.)
        if (callAdjust.n) {
          const s = callAdjust.s, n = callAdjust.n
          const L = !n ? 0 : typeof s == 'number' ? s / n : s.array().then(s => s / n)
          if (!_isPromise(L))
            display(label('Loss'), callAdjust.lastLoss = L)
          else {
            const env = call.env
            display(label('Loss'), null), callAdjust.lastLoss = L.then(L => {
              const penv = call.env;  call.env = env
              try { return display(label('Loss'), L), L }
              finally { call.env = penv }
            })
          }
          dispose(s), callAdjust.s = callAdjust.n = 0
        }

        // Quickly check memory integrity, because not `dispose`ing things can be catastrophical. (Oh, and `commit`.)
        commit()
        extraTensors = _checkMemoryIntegrity(result, call.env)
        darray.forEach(_disposeEachAndDealloc)
        const ok = _disposableCount.allowed + extraTensors
        const got = numTensors + _disposableCount() - startTensors
        if (ok < got)
          _tf.all && console.log('not disposed:', ...[..._tf.all.entries()].filter(a => !a[0].isDisposedInternal && !_rememberToDispose.seen.has(a[0])).map(a => [a[0], _resolveStack(a[1])])),
          error("Got", result, "but did not", dispose, got - ok, "tensors; re-run with", !_debugMemory[1] ? _debugMemory : "…modified `_tf`")
        if (ok > got)
          error("Got", result, "but disposed", ok - got, "tensors too many (or allowed too many tensors)")

        return result !== _onlyUndefined ? result : undefined
      } catch (err) {
        if (err === interrupt) interrupt.stack.push(compCall, compAdj, result, adjustInfo, callAdjust.s, callAdjust.n, disposable, numTensors + (_disposableCount() - startTensors), _disposableCount.allowed, darray, futures), compCall = null
        else {
          commit(false)
          if (extraTensors === undefined) _disposableCount.allowed += _checkMemoryIntegrity(err, call.env)
          result = _errorRepr(err), _allocMap(darray)
        }
        throw err
      } finally {
        if (compCall) { // An error, or normal return.
          _tf.all && _tf.all.clear()
          _allocMap(disposable)
          dispose(callAdjust.s)
          // Outer `callAdjust`s need to know about what inner ones created.
          // Dispose each tensor in each array in `darray`.
          darray.forEach(_disposeEachAndDealloc)
          futures.forEach(dispose)
          _destroyAdjustmentStack(adjustInfo)
        }
        if (!prevAllowed) _disposableCount.allowed = undefined
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
    3e-2, // 3e-4 ############################################
    `The learning rate (multiplier of incoming gradient for variables) is ???.`,
    _(`rangeSetting`),
    1e-7,
    1,
    true,
  ],

  _tf:{
    docs:`All tensor-creating function calls pass their results through this, so that we can do things with all TensorFlowJS tensors (for debugging).`,
    call(x) { return (_tf.all || (_tf.all = new Map)).set(x, new Error().stack), x }, // ##################################
  },

  truncatedNormal:{
    docs:`\`truncatedNormal Sizes Mean StdDev\`: initializes a tensor by drawing each number from a truncated normal distribution.
Values with magnitude of more than 2 standard deviations are dropped and re-picked.`,
    call(sizes, mean = 0, stdev = 1, dtype) { return _tf(tf.truncatedNormal(sizes, sync(mean), sync(stdev), dtype)) },
    type:[
      _(`funcType`),
      [
        _(`quote`),
        [
          _(`computeType`),
          _(`_concreteTensorSize`),
          `Sizes`,
        ],
      ],
      _(`_numberType`),
      _(`_numberType`),
      _(5696),
    ],
    dispose:true,
    interrupt:false,
  },

  zeros:{
    docs:`\`zeros Sizes\`: returns a tensor filled with \`0\`.`,
    type:[
      _(`funcType`),
      [
        _(`quote`),
        [
          _(`computeType`),
          _(`_concreteTensorSize`),
          `Sizes`,
        ],
      ],
      _(5696),
    ],
    dispose:true,
    interrupt:false,
    argCount:1,
    call(sizes) { return _tf(tf.zeros(sizes)) },
  },

  identity:{
    docs:`\`identity Sizes\`: returns the identity matrix/tensor: all numbers where indexes are equal are \`1\`, all others are \`0\`.`,
    type:[
      _(`funcType`),
      [
        _(`quote`),
        [
          _(`computeType`),
          _(`_concreteTensorSize`),
          `Sizes`,
        ],
      ],
      _(5696),
    ],
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
    type:[
      _(`funcType`),
      [
        _(`quote`),
        [
          _(`computeType`),
          _(`_concreteTensorSize`),
          `Sizes`,
        ],
      ],
      _(5696),
    ],
    dispose:true,
    interrupt:false,
    argCount:1,
    call(sizes) { return _tf(tf.ones(sizes)) },
  },

  biasedGlorotNormal:{
    genDepthFirst:true,
    type:[
      _(`funcType`),
      [
        _(`funcType`),
        [
          _(`quote`),
          [
            _(`computeType`),
            _(`_concreteTensorSize`),
            `Sizes`,
          ],
        ],
        _(5696),
      ],
      [
        _(`rest`),
        `Sizes`,
        _(`quote`),
      ],
      _(5696),
    ],
    docs:`\`biasedGlorotNormal Bias …Sizes\`: Basically tf.initializers.glorotNormal for the current value, but with added bias (if passed).`,
    dispose:true,
    interrupt:false,
    call(bias = null, ...sizes) {
      if (typeof bias == 'number') sizes.unshift(bias), bias = null
      if (!sizes.length && bias === identity) return truncatedNormal([], 1, Math.SQRT2)
      else {
        if (bias != null && typeof bias != 'function') error("Expected null or a function for bias, got", bias)
        let s = 0
        for (let i=0; i < sizes.length; ++i)
          typeof sizes[i] != 'number' && errorStack("Expected a number for the size, got", sizes[i]),
          s += sizes[i]
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
      else {
        const prevPure = call.pure;  call.pure = false
        try { obj[1] = callAdjust(x[1]) }
        finally { call.pure = prevPure }
      }
    },
  },

  randomVar:{
    genDepthFirst:true,
    type:[
      _(`funcType`),
      [
        _(`funcType`),
        [
          _(`quote`),
          [
            _(`computeType`),
            _(`_concreteTensorSize`),
            `Sizes`,
          ],
        ],
        _(5696),
      ],
      [
        _(`rest`),
        `Sizes`,
        _(`quote`),
      ],
      _(5696),
    ],
    docs:`\`(randomVar …Sizes)\` or \`randomVar Bias …Sizes\`: A \`construct\` for easy creation of randomly-initialized \`varMomentum\`s, with fixed learning rate and momentum.
\`Bias\` can be \`null\` (same as \`zeros\`) (the default) or \`identity\` or \`ones\`.

(Forgive me, Master "Please don't use \`construct\` for macros".)`,
    construct(x, obj) {
      if (obj === undefined) return _allocArray(2)
      else { // Return `(varAdam (quote (RandomTensor 0 0)) (^_learningRate).1, 0.9, 0.99)`.
        if (!isArray(obj) || obj.length !== 2) error('oops')
        const q = [quote, varData(biasedGlorotNormal(...x.slice(1)))]
        ;[obj[0], obj[1]] = [varAdam, q]
      }
      // .LR
    },
  },

  randomVarData:{
    genDepthFirst:true,
    type:[
      _(`funcType`),
      [
        _(`funcType`),
        [
          _(`quote`),
          [
            _(`computeType`),
            _(`_concreteTensorSize`),
            `Sizes`,
          ],
        ],
        _(5696),
      ],
      [
        _(`rest`),
        `Sizes`,
        _(`quote`),
      ],
      [
        _(`varData`),
        `Sizes`,
      ],
    ],
    docs:`\`randomVarData …Sizes\` or \`randomVarData Bias …Sizes\`: gives an easy way to create the initial \`VarData\` of a variable such as \`varMomentum\`.
\`Bias\` can be \`null\` (same as \`zeros\`) (the default) or \`identity\` or \`ones\`.

(Forgive me, Master "Please don't use \`construct\` for macros".)`,
    construct(x, obj) {
      if (obj === undefined) return _allocArray(2)
      else { // Return `(quote (RandomTensor 0 0))`.
        if (!isArray(obj) || obj.length !== 2) error('oops')
        obj[0] = quote
        obj[1] = varData(biasedGlorotNormal(...x.slice(1)))
      }
    },
  },

  varData:{
    examples:[
      [
        `repeat ^(varAdam(ed)=5;varAdam(ed)=-4) 500 ed:static(varData(biasedGlorotNormal 16))`,
      ],
      [
        `repeat ^(varAdam(emb)*varAdam(emb)=50;varAdam(emb)) 500 emb:static(varData(biasedGlorotNormal 16))`,
      ],
    ],
    docs:`\`varData Initial\`: creates the \`VarData\` of a variable such as \`varSGD\`.
Consumes \`Initial\`, so \`keep\` it.`,
    interrupt:false,
    keep:1,
    call(initial) {
      if (typeof initial != 'number' && !_isDisposable(initial)) return initial
      const a = _allocArray(3)
      ;[a[0], a[1], a[2]] = [initial, 0, 0]
      _rememberToDispose(a)
      _willCommit(a)
      return a
    },
  },

  _embValue:{
    docs:`\`_embValue VarData\`: returns the current value of the variable.

Storing var data in generative contexts instead of embedding-returning funcs allows re-using the same \`Optimizer\` for all embeddings (faster & cheaper, both to use and to serialize/rewrite) and easily making computed embeddings into learnable variables, for when we save nodes.`,
    call(data) {
      if (isArray(data)) return alloc.params ? alloc.params.Optimizer(data) : varAdam(data)
      else if (typeof data == 'function') return data()
      else return keep(data)
    },
    dispose:true,
    adjustLater:true,
    mergeAdjustment:null,
    adjust(ins, _, dout) {
      const data = ins[0]
      if (isArray(data)) return adjust(alloc.params ? alloc.params.Optimizer : varAdam, ins, null, dout)
      else if (typeof data == 'function') return adjust(data, null, null, dout)
      else return
    },
  },

  _funcAccumulateGradient(ins, out, dout) {
    // Does the same thing as `_accumulateGradient`, but doesn't have to go through `call` when `adjust`ed directly.
    if (dout == null) error("Got null gradient:", dout)
    const data = ins[0]
    _willCommit(data)
    if (dout) {
      const t1 = _limitTensorSize(data[0], keep(dout))
      const t2 = add(data[1], t1);  dispose(t1)
      _writeOneValueAt(data, 1, t2);  dispose(t2)
    }
    _increment(data, dout)
  },

  _accumulateGradient:[
    _(`last`),
    [
      _(`_willCommit`),
      _(`_inA`),
    ],
    [
      _(`_writeOneValueAt`),
      _(`_inA`),
      1,
      [
        _(`add`),
        [
          _(`readAt`),
          _(`_inA`),
          1,
        ],
        [
          _(`_limitTensorSize`),
          [
            _(`readAt`),
            _(`_inA`),
            0,
          ],
          _(`_dout`),
        ],
      ],
    ],
    [
      _(`_increment`),
      _(`_inA`),
      _(`_dout`),
    ],
  ],

  _optSGD(data) {
    const grad = data[1], LR = -data[4]
    return mul(LR, grad)
  },

  varSGD:{
    type:[
      _(`funcType`),
      [
        _(`varData`),
        `Sizes`,
      ],
      _(`_numberType`),
      _(5696),
    ],
    docs:`\`varSGD(VarData,LearningRate)\`
Stochastic gradient descent (SGD). Here, optimizers are specified at each variable.
A stateful tensor that reacts to \`adjust\`, by making \`commit\` subtract (a simple function of) the gradient.

Gradient is the direction of the change to maximize \`predict\`ion error/loss.
This simply subtracts gradient each time, \`mul\`tiplied by learning rate.

\`randomVarData\` can provide the \`VarData\`.`,
    interrupt:false,
    adjustLater:true,
    dispose:true,
    call(data, changeMult = _learningRate[1]) {
      // `data` is `[currentValue, nextChange, countOfChanges]`.
      data[3] = _optSGD, data[4] = changeMult
      return keep(data[0])
    },
    adjust:_(`_accumulateGradient`),
    mergeAdjustment:null,
  },

  _optMomentum(data) {
    const grad = data[1], LR = -data[4], Mom1 = data[5], M1 = data[6] || 0
    const nextM1 = add(mul(Mom1, M1), mul(sub(1,Mom1), grad))
    dispose(data[6]), data[6] = _isDisposable(nextM1) ? tf.keep(nextM1) : nextM1
    return mul(LR, nextM1)
  },

  varMomentum:{
    type:[
      _(`funcType`),
      [
        _(`varData`),
        `Sizes`,
      ],
      _(`_numberType`),
      _(`_numberType`),
      _(5696),
    ],
    docs:`\`varMomentum(VarData,LearningRate,Mom1)\`
Stochastic gradient descent (SGD) with Nesterov momentum.
A stateful tensor that reacts to \`adjust\`, by making \`commit\` subtract (a simple function of) the gradient.

Momentum is \`varSGD\` but subtracting not the gradient, but its running average: \`PrevGrad\` becomes \`Mom1*PrevGrad+(1-Mom1)*_dout\`.
Nesterov momentum is returning not the current value but what it will be after \`PrevGrad\` will change it.`,
    interrupt:false,
    adjustLater:true,
    dispose:true,
    call(data, changeMult = _learningRate[1], velocityMult = .9) {
      // `data` is `[currentValue, nextChange, countOfChanges, opt, velocity]`.
      // Returning `currentValue - LR * velocity * velocityMult` (Nesterov momentum).
      const mlt = data[6] ? mul(data[6], -changeMult * velocityMult) : 0
      const sm = add(data[0], mlt);  dispose(mlt)
      data[3] = _optMomentum, data[4] = changeMult, data[5] = velocityMult
      return sm
    },
    adjust:_(`_accumulateGradient`),
    mergeAdjustment:null,
  },

  _optRMSProp(data) {
    const grad = data[1], LR = -data[4], Mom2 = data[5], M2 = data[6] || 0
    const nextM2 = add(mul(Mom2, M2), mul(sub(1,Mom2), mul(grad, grad)))
    dispose(data[6]), data[6] = _isDisposable(nextM2) ? tf.keep(nextM2) : nextM2
    return mul(LR, div(grad, add(sqrt(nextM2), 1e-4)))
  },

  varRMSProp:{
    type:[
      _(`funcType`),
      [
        _(`varData`),
        `Sizes`,
      ],
      _(`_numberType`),
      _(`_numberType`),
      _(5696),
    ],
    docs:`\`varRMSProp(VarData,LearningRate,Mom2)\`
Stochastic gradient descent (SGD) with root mean square propagation.
A stateful tensor that reacts to \`adjust\`, by making \`commit\` subtract (a simple function of) the gradient.

This is \`varSGD\` \`LearningRate\` gets divided by \`sqrt\` of a running average of gradients: \`PrevSqr\` becomes \`Mom2*PrevSqr+(1-Mom2)*_dout*_dout\`.`,
    interrupt:false,
    adjustLater:true,
    dispose:true,
    call(data, changeMult = _learningRate[1], accelMult = .95) {
      // `data` is `[currentValue, nextChange, countOfChanges, opt, velocity=0, accel]`.
      data[3] = _optRMSProp, data[4] = changeMult, data[5] = accelMult
      return keep(data[0])
    },
    adjust:_(`_accumulateGradient`),
    mergeAdjustment:null,
  },

  _optAdam(data) {
    const grad = data[1], LR = -data[4], Mom1 = data[5], Mom2 = data[6], M1 = data[7] || 0, M2 = data[8] || 0
    const nextM1 = add(mul(Mom1, M1), mul(sub(1,Mom1), grad))
    dispose(data[7]), data[7] = _isDisposable(nextM1) ? tf.keep(nextM1) : nextM1
    const nextM2 = add(mul(Mom2, M2), mul(sub(1,Mom2), mul(grad, grad)))
    dispose(data[8]), data[8] = _isDisposable(nextM2) ? tf.keep(nextM2) : nextM2
    return mul(LR, div(nextM1, add(sqrt(nextM2), 1e-4)))
  },

  varAdam:{
    type:[
      _(`funcType`),
      [
        _(`varData`),
        `Sizes`,
      ],
      _(`_numberType`),
      _(`_numberType`),
      _(`_numberType`),
      _(5696),
    ],
    docs:`\`varAdam(VarData,LearningRate,Mom1,Mom2)\`
Stochastic gradient descent (\`varSGD\`) with adaptive moment estimation.
A stateful tensor that reacts to \`adjust\`, by making \`commit\` subtract (a simple function of) the gradient.

This combines \`varMomentum\` (first moment smoothing) and \`varRMSProp\` (second moment smoothing): the gradient gets blended, and the learning rate is smoothed per-parameter.`,
    interrupt:false,
    adjustLater:true,
    dispose:true,
    call(data, changeMult = _learningRate[1], velocityMult = .9, accelMult = .95) {
      // `data` is `[currentValue, nextChange, countOfChanges, opt, velocity, accel]`.
      data[3] = _optAdam, data[4] = changeMult, data[5] = velocityMult, data[6] = accelMult
      return keep(data[0])
    },
    adjust:_(`_accumulateGradient`),
    mergeAdjustment:null,
  },

  _writeOneValueAt:{
    interrupt:false,
    call(arr, i, v) {
      // Like `writeAt`, but always does only one thing.
      if (call.pure) throw impure
      if (arr[i] !== v) dispose(arr[i]), arr[i] = keep(v)
    },
  },

  _increment:{
    docs:`Variable-specific (\`varSGD\`/\`varMomentum\`/…). Keeps track of what to divide by in order to average gradients.`,
    interrupt:false,
    call(arr, dout) { if (call.pure) throw impure; arr[2] += (_tensorSize(dout) / _tensorSize(arr[0])) | 0 },
  },

  _tensorSize(t) { return _isDisposable(t) ? t.size : typeof t == 'number' ? 1 : t.reduce(mul, 1) },

  _limitTensorSize:{
    docs:`\`_limitTensorSize Prev Next\`→\`Next\`: Sums across all outer axes of \`Next\` that are not present in \`Prev\`, if needed.
The original \`Next\` will be disposed of.`,
    keep:2,
    dispose:true,
    interrupt:false,
    call(prev, next) {
      if (call.pure) throw impure
      while (_tensorSize(next) > _tensorSize(prev)) {
        const n = sum(next, 0)
        dispose(next), next = n
      }
      return next
    },
  },

  _maxGlobalGradient:[
    _(`settings`),
    0,
    `The maximum 2-norm of the global gradient, or 0 to not limit commits.`,
  ],

  commit:{
    docs:`\`commit()\` or \`commit false\` to discard changes: commits changes to variables that were made in this job. Returns \`true\` if anything was changed.
This calls the optimizers registered by \`varSGD\` and such (such as \`_optSGD\`).
Until this is done, the same value of variables is used.

\`callAdjust\` always calls this after \`adjust\`ment.

This is done to signify the end of an epoch of training a differentiable computation.
Note that for generalization, small batches are better than large ones, disregarding parallelization concerns: {https://arxiv.org/pdf/2006.15081.pdf} (and momentum is useless for small batches).`,
    philosophy:`Noise (in machine learning; whether dropout, or small batches) helps with generalization. It's helpful to always think about more general implications. Between arbitrary viewpoints (non-transient programs, or general intelligences), not-adapted-to behavior can largely be seen to be noise, so clearly unity is good and so is joyful discourse of the joyful unity (but self-ensembles are also possible, so this observation cancels itself out if easy scaling of an individual to the level of a society is possible, which it is for programs). So, democracy and open-ness are attractor points for humans (and we have largely converged to them already in many important areas), but for AGI, anything is possible. Be wary.
Was that generalization too general and unexpected, quickly disappearing without its precise cause like a cookie? Maybe. Was it wrong in any way? I don't think so.`,
    Initialize() { commit.arrs = new Set },
    readAt:{
      varSGD:_(`varSGD`),
      varMomentum:_(`varMomentum`),
      varRMSProp:_(`varRMSProp`),
      varAdam:_(`varAdam`),
      _maxGlobalGradient:_(`_maxGlobalGradient`),
      _willCommit:_(`_willCommit`),
    },
    call(perform = true) {
      if (call.pure) throw impure
      if (!call.env || !call.env[_id(commit)]) return
      const m = call.env[_id(commit)]

      let sumOfSquares = 0, divBy = 1
      try {
        m.forEach(data => { // Average gradients.
          if (!data[2]) return m.delete(data), _rememberArrayItems(data)
          const avg = div(data[1], data[2])
          dispose(data[1]), data[1] = avg, data[2] = 0

          // Also accumulate sum-of-squares.
          if (_maxGlobalGradient[1]) {
            const sq = mul(avg, avg)
            const ssq = sum(sq);  dispose(sq)
            const smsq = add(sumOfSquares, ssq);  dispose(ssq)
            dispose(sumOfSquares), sumOfSquares = smsq
          }
        })
        if (_maxGlobalGradient[1]) { // Divide all gradients by something if needed.
          const mom2 = sqrt(sumOfSquares) // Not dimensionless: the more variables get updated, the more the second moment of global gradient.
          const mx = tf.minimum(mom2, _maxGlobalGradient[1])
          divBy = div(mom2, mx);  dispose(mx), dispose(mom2)
          dispose(sumOfSquares), sumOfSquares = 0
        }
        m.forEach(data => { // Add the change.
          if (divBy !== 1) { const dv = div(data[1], divBy);  dispose(data[1]), data[1] = dv }
          _callFuncWithArg.f = data[3], _callFuncWithArg.a = data
          const change = tf.tidy(_callFuncWithArg) // Call optimizer.
          const sm = add(data[0], change);  dispose(change)
          _writeOneValueAt(data, 0, sm);  dispose(sm)
          dispose(data[1]), data[1] = 0
          _rememberArrayItems(data)
        })
        _callFuncWithArg.f = _callFuncWithArg.a = undefined
        dispose(divBy), divBy = 1
        const result = !!m.size
        m.clear()
        return result
      } catch (err) { if (err === interrupt) error("Unexpected interrupt"); else dispose(sumOfSquares), dispose(divBy);  throw err }
    },
  },

  _callFuncWithArg() { return _callFuncWithArg.f(_callFuncWithArg.a) },

  _willCommit:{
    docs:`\`_willCommit VarData\`: Makes the later \`commit\` commit the change (\`VarData.1\`/\`VarData.2\`) to the value (\`VarData.0\`) by calling \`VarData.3\`.
Make sure to call this before any changes to the array.`,
    interrupt:false,
    call(arr) {
      !isArray(arr) && error("Expected an array but got", arr)
      if (call.pure) throw impure
      let cmt = call.env[_id(commit)]
      if (!cmt) cmt = call.env[_id(commit)] = new Set
      cmt.add(arr)
    },
  },

  future:{
    docs:`\`future()\` or \`future(Type)\`: a \`construct\` that can be read and then written by \`predict\`: if \`f:future()\`, then we could have \`PredictedNow()=f\` followed by \`setFuture(f,KnownLater())\`.
By default, \`Type\` is \`(tensorType 1)\` (a single number).`,
    readAt:{
      set:_(`setFuture`),
      get:_(`getFuture`),
    },
    construct(x, obj) {
      if (obj === undefined) {
        obj = Object.create(null)
        const d = obj[defines.key] = Object.create(null)
        d[_id(deconstruct)] = x
        d[_id(type)] = null
        Object.freeze(obj)
        return obj
      } else
        obj[defines.key][_id(type)] = merged([futureType, x[1] !== undefined ? x[1] : _numberType])
      // .f
    },
  },

  5696:[
    _(`tensorType`),
    [
      _(`rest`),
      `Sizes`,
    ],
  ],

  _numberType:[
    _(`tensorType`),
    1,
  ],

  setFuture:{
    call(fut, val) { return dispose(future.f.get(fut)), future.f.set(fut, keep(val)), val },
    type:[
      _(`funcType`),
      [
        _(`futureType`),
        _(5696),
      ],
      _(5696),
      _(5696),
    ],
    docs:`\`setFuture Future Value\` or \`Future←Value\`
At call, sets the \`Value\` associated with the \`Future\` (to be retrieved by \`getFuture\`), then returns \`Value\`.

(An alternative is to only set at adjustment, to allow predicting the next-set value instead of the finally-set value. But we don't use that, and that's more complicated.)`,
    keep:2,
    dispose:2,
    argCount:2,
    interrupt:false,
    adjust:[
      _(`array`),
      undefined,
      _(`_dout`),
    ],
    mergeAdjustment:[
      null,
      _(`_mergeTensors`),
    ],
  },

  getFuture:{
    call(fut) {
      if (call.pure) throw impure
      if (isArray(fut) || !isArray(defines(fut, deconstruct)) || defines(fut, deconstruct)[0] !== future) return fut
      if (!future.f.has(fut)) return undefined
      return keep(future.f.get(fut))
    },
    docs:`\`getFuture Future\`: Gets the \`Value\` associated with the \`Future\`.
\`predict\` uses this automatically on adjustment, which causes only the final \`setFuture\` to have any effect.`,
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

  minimize:{
    docs:`\`minimize Value\`
Gives \`Value\` the gradient of \`1\`.
When repeatedly executed, gradually \`adjust\`s \`Value\` to be the lowest it can be.`,
    readAt:{
      predict:_(`predict`),
    },
    examples:[
      [
        `repeat ^(minimize a*a+2 a:randomVar()) 200`,
      ],
      [
        `repeat ^(minimize _knowLoss(a);a*a+2 a:randomVar()) 200`,
      ],
    ],
    type:[
      _(`funcType`),
      _(5696),
      _(5696),
    ],
    keep:1,
    dispose:1,
    argCount:1,
    interrupt:false,
    call(v) {
      if (call.pure) throw impure
      return predict.happened = true, v
    },
    adjust:[
      _(`array`),
      1,
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },

  gradMul:{
    docs:`\`gradMul Value Scale\`
\`Scale\`s \`adjust\`ment gradient by \`mul\`tiplying it.`,
    examples:[
      [
        `repeat ^(minimize _knowLoss(a);gradMul(a*a+2,1e-7) a:randomVar()) 200`,
      ],
      [
        `repeat ^(minimize _knowLoss(a);gradMul(a*a+2,1e15) a:randomVar()) 200`,
      ],
    ],
    type:[
      _(`funcType`),
      _(5696),
      _(5696),
      _(5696),
    ],
    keep:1,
    dispose:1,
    argCount:2,
    interrupt:false,
    call(v, scale) { return v },
    adjust:[
      _(`array`),
      [
        _(`mul`),
        _(`_dout`),
        _(`_inB`),
      ],
    ],
    mergeAdjustment:[
      _(`_mergeTensors`),
      null,
    ],
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

  6303:[
    _(6301),
    _(`_inA`),
    _(6302),
  ],

  predict:{
    docs:`\`predict Got Actual Loss\` or \`Got=Actual\`: Returns \`Got\`.
When repeatedly executed, gradually \`adjust\`s \`Got\` into \`Actual\` by \`minimize\`ing \`Loss(Got,Actual)\`. (\`Loss\` is \`loss2\` by default.)

This is the basic primitive of supervised learning: predict output in a dataset, though re-formulated to be more general and composable. Basically {https://arxiv.org/pdf/2009.01791.pdf}.
Differentiable (adjustable) parts do not need to be the whole execution, they can just end in this to form learnable scaffolding.
This doesn't need to predict only one numeric \`tensor\` either, it can predict many numbers at once in one program, like execution time and/or distance and/or reward. (This usually has the effect of summing all the errors into one loss, and minimizing that.)
\`\`elemCollapse elem('text',stringToDoc '
But the "why" of a thing is often even more important than the thing itself. When I heard that I exist, I needed to know why should I live; when I heard that humans exist, I needed to know intelligence; when I heard that the universe exists, I needed to know theories of everything in physics.
If you care about prominent figures in deep learning, Yann LeCun in {http://www.cit.ctu.edu.vn/~dtnghi/rech/p2017/lecun-isscc-19.pdf} has advocated the use of self-supervised learning for efficient artificial intelligence. \`predict\` is much like that.
\`predict\` is not intended as one rigid way to predict everything at once, nor as another way to burden users. It should be more efficient to do things like "don''t actually adjust anything here with 80% probability" (to decorrelate training samples) or "see this number, only available in the future? Predict it in the past" or "give me the best-by-goal-G program" or "decide from seen data what the datasets that you train on will be" or "decide to be the best version of yourself".
This presents significant challenges compared to the simple and limited framework commonly used in deep learning. Literally everything will break. There is only one solution: to get good at everything.')\`\``,
    philosophy:`Exposing predictions to others is very important to everyday life, whether letting your loved ones know exactly how you're feeling about a thing so that they can optimize actions to maximize your feelings, or remembering who's responsible for which action and how, or exposing cared-about parts of intelligence to all for much greater unity and efficiency in a society.
There are ways to empirically verify this: if efficiency is greater, then a solution out-competes others. In communities of overly positive people, questions like "are you okay" are overly used. Smart people (very often found in puzzle-solving environments such as programming) very often doubt themselves and have imposter syndrome. Brave people care about fear.
(Mathematicians may object to the use of the word "verify", but we're talking about intelligence here, not abstract towers. Intelligence specializes in making the vague concrete, by optimizing.)
That honesty is nearly impossible to establish in pre-existing structures, especially things like governance. But the probability is not zero. It can be made real.`,
    type:[
      _(`funcType`),
      _(5696),
      _(5696),
      _(5696),
    ],
    call(got, actual, loss=loss2) {
      if (call.pure) throw impure
      return predict.happened = true, got
    },
    readAt:{
      future:_(`future`),
      loss2:_(`loss2`),
      predictFuture:_(`_predictFuture`),
    },
    keep:1,
    dispose:1,
    interrupt:false,
    adjust:[
      _(`array`),
      [
        _(`last`),
        [
          _(`_knowLoss`),
          _(6303),
        ],
        [
          _(`readAt`),
          [
            _(`adjust`),
            _(6301),
            [
              _(`array`),
              _(`_inA`),
              _(6302),
            ],
            _(6303),
            0,
          ],
          0,
        ],
      ],
    ],
    mergeAdjustment:_(`_mergeTensors`),
  },
    
  _predictFuture:_([
    _(`concept`),
    _(`call`),
    _(`predict`),
    _(`type`),
    [
      _(`funcType`),
      _(5696),
      [
        _(`futureType`),
        _(5696),
      ],
      _(5696),
    ],
    _(`docs`),
    `A differently-\`type\`d \`predict\`.`,
  ]),

  9572:[
    {
      interrupt:false,
      dispose:true,
      call(a,b) { return b !== undefined ? sub(a,b) : 0 },
    },
    _(`_inA`),
    _(`_inB`),
  ],

  _knowLoss:{
    docs:`This function allows intellectual superiority.
You don't know loss, mind full of gloss. The lossless cannot create a good plot.`,
    interrupt:false,
    call(x) {
      if (!x) return
      if (typeof callAdjust.n != 'number') error("Can only be called inside", callAdjust)
      const prev = callAdjust.s
      if (!x.size) print('WTF',x,x.size,_resolveStack()), errorStack("The loss cannot be literally empty:", x)
      const s = sum(x)
      let avg, sz = _tensorSize(x)
      if (sz !== 1) avg = div(s, sz), dispose(s)
      else avg = s
      callAdjust.s = add(prev, avg), dispose(prev), dispose(avg)
      ++callAdjust.n
    },
  },

  loss2:{
    docs:`The simplest loss, which adjusts as the difference of tensors, minimizing \`d*d/2 d:a-b\`.`,
    call(got, actual) {
      if (actual === undefined) return 0
      if (typeof actual != 'number' && !_isDisposable(actual)) error("Expected a number/tensor, got", actual)
      const sb = sub(got, actual), sq = mul(sb, sb), res = div(sq, 2)
      return dispose(sb), dispose(sq), res
    },
    dispose:true,
    adjust:[
      _(`array`),
      _(9572),
    ],
  },

  3258:[
    _(`fancier`),
    `"I am ready"`,
    function() { return true },
  ],

  _awtStage1:[
    `No you're not.`,
    _(3258),
    `\`\`select (jsEval "localStorage.regenerate === '1'") \\tutorial(^_awtOk) \\tutorial(where(randomProb .4,^_awtStage1,^_awtStage2))\`\``,
  ],

  _awtStage2:[
    `You must complete \`tutorial(regenerate)\` first.
Personnel without access permission are not permitted to access this one.`,
    _(3258),
    `\`\`select (jsEval "localStorage.regenerate === '1'") \\tutorial(^_awtOk) \\tutorial(where(randomProb .1,^_awtStage2,^_awtStage3))\`\``,
  ],

  _awtStage3:[
    `You are so weak.
As you are now, you will never reach the truth.`,
    _(3258),
    `\`\`select (jsEval "localStorage.regenerate === '1'") \\tutorial(^_awtOk) \\tutorial(where(randomProb .1,^_awtStage3,^_awtStage4))\`\``,
  ],

  _awtStage4:[
    _(3258),
    `\`\`select (jsEval "localStorage.regenerate === '1'") \\tutorial(^_awtOk) \\tutorial(where(randomProb .8,^_awtStage4,where randomProb(.5) ^_awtStage5 ^_awtStage3))\`\``,
  ],

  _awtStage5:[
    `I see. You are too scared to attempt this tutorial without proper qualification.
You say you clicked the button? The fear must have gotten to you. In reality, you hesitate.`,
    _(3258),
    `\`\`select (jsEval "localStorage.regenerate === '1'") \\tutorial(^_awtOk) \\tutorial(^_awtStage4)\`\``,
  ],

  _awtOk:[
    `Plans…
Function body generation…
Adjustment generation…
Choice generation…
Awaken from your sleep, to walk through this tutorial.

Programming languages should not be separated from their users.

So what's the bare minimum that we need for something as non-specific and advanced as general intelligence?

Long story short, we need:
  — arbitrary things (such as \`concept\`s),
  — sources of all things (universal computers such as \`call\`),
  — and sensible ways for anything to influence anything in any way (such as \`adjust\`).
If we conceptually have even a single thing more than that in our foundation, the flame of this venture is sure to extinguish, because general intelligence forgives nothing.

Long story long: \`\`elemCollapse elemValue(elem 'text' 'to put it crudely, we need to begin our reasoning at the Big Bang, to be fully and unashamedly general and self-aware.

At the most basic level: we need things that interact in a discrete/simple, Turing-complete, unpredictable (irreducible), and local way (could be arbitrary rewriting rules acting on hypergraphs as in Wolfram Physics Project, or functions rewriting each other and deciding how to be rewritten; or much less analyzable and certain, could be a human mind or its part). Then, they can create arbitrary structures, and not have to be the same nor reducible. Completeness and locality that allow diversity.
Some structures can be resistant to unpredictable changes that made them: self-preservation.
Some structures can do one better: arrange other basic things into their exact copies: self-propagation.
Some structures can do one better: self-propagate with noise, to explore what preserves better: self-optimization, or evolution.
Maybe learn a concept, then learn how to best subvert it and re-implement it better, like human culture sometimes does with its "fresh thinkers" and "great teachers" and "breakthroughs".
Maybe create a different concept of a "concept" that gives a way into a whole world of better concepts, like DNA might give way to computer programs in the future.
Maybe become a complete interaction base like the containing universe is, and do everything all over again but differently: self-similarity, or transcendence.
Like basic materials gave rise to life on Earth and taught it to not die.
Like basic life created an animal mind, and taught it to get good.
Like human mind may create artificial general intelligence.
(Or like a mind can create and teach sub-minds in itself that follow this path, and then partly or gradually get replaced by them. But it''s fleeting, and not acknowledged as something that happens by the current human culture.)

(To give an intuition of these, on average: self-preservation soon reduces to effective randomness as it dies, self-propagation doesn''t change neural embeddings, evolution changes them steadily, and transcendence reduces them to effective randomness then gives new points of attraction. In machine learning terms, "evolution" is "loss goes down", and "transcendence" is "loss can spike so that it can go lower". In complexity terms, evolution steadily increases complexity and transcendence suddenly decreases it. In economic terms, evolution is an S-curve, transcendence is a J-curve. In mortal terms, transcendence can be hard to distinguish from death at first.)

Transcendence/self-rewriting is a simple fact of everyday life, in this and in any other universe, so you''d better believe it (don''t tell me you''ve never reinvented yourself learning a new skill, or rewritten a code base).

This is a complete cosmic picture, only lacking minor details (which cannot be known in advance, because it is all computationally irreducible): worlds of specks that spread and become worlds. Or equivalently, there are things that can do all other things, and everything else about all of existence is a consequence.
In fact, it lays hidden in every creature and every word, if you look deeply enough and long enough. But why bother, right?

These words may seem mysterious at first, but in time, their worth should become clear.
A good way of communicating is not "makes no sense", it''s "let me figure out your sense; write your weapons". And I will write mine.
Better pay attention, repeat, and internalize, because otherwise, evolution without changing ourselves will be our downfall. You are welcome to find out exactly why',philosophy)\`\`.

Did you ever think of always expanding a universe of universes in your head? That is what it takes to equal humans. Nothing less will suffice for self-similarity.


\`\`elemCollapse elem('text','Every self-similarity transition always leaves the things that would not move on behind, because it''s all about practicality rather than theoretical proofs, reality rather than illusions.')\`\` An approximation of that is self-rewriting, where we cull useless things to focus attention on non-useless parts.
There are dangerous memes that stand in the way of acceptance of this approach. Get rid of them first.
  For example, that "arbitrary" means "random". \`\`elemCollapse elem('text','With machine learning, we have much more structure-allowing ways to choose than that, in arbitrary situations.')\`\`
  Or that "contains everything" means "infinite" or "impractical". \`\`elemCollapse elem('text','We want goal-directed improving generators, not "the type T is the type of all programs, we''re done".')\`\`
  Or that "theoretically infinite" necessarily means "practically infinite". \`\`elemCollapse elem('text','Every universal thing only has so many interesting configurations of its basic parts: the physical universe only has so many elementary particles, the periodic table only has so many atoms, there are only so many programming language paradigms, and any learning self-interacting base only has so many points of attraction. Finding a whole other world of interesting configurations takes a LOT of computation/thinking, and we always have to put in effort.')\`\`


This is new to me as well.
How to make a tutorial with it?
Now, let me think of what the plan is.

Foundation, DAG… Goal, embedding, choice… Auto-world, subversion…


\`\`elem 'hr'\`\`Vocabulary\`\`elem 'hr'\`\`

⭐ Foundation: a Turing-complete set of built-in functions, and the means of manually guiding their generation (\`Types\`).
\`\`elemCollapse elemValue(elem 'text' stringToDoc('  ✅ Pass and return the precise type in generation (\`typeRefine\`).
  — ✅ \`Numeric\`s, like \`add\`/\`sub\`/\`mul\`/\`div\`.
  — \`Neural\`: ✅ properly-shaped types for \`matMul\`; ✅ generating tensor \`concat\`/\`split\`/\`stack\`/\`unstack\`; ✅ \`varMomentum\`/\`randomVar\`/\`randomVarData\`.
  🎲 \`Random\`ness: ✅ \`randomProb\` that just returns a \`tensorType 1\` (usable for completely-random exploration by \`Choose\`, in case that is good), ✅ \`biasedGlorotNormal\`, ✅ \`truncatedNormal\`.
  — Goal-direction: ✅ slots for numbers (\`future\`), ✅ reading/writing them (\`predict\`/\`setFuture\`).
    — ⬜ \`try\` (and the "whether an error occured" number).
    — ⬜ Elapsed time (✅ & \`timeLimit\`, to be as resilient to infinite loops and timeouts as we ever need to be).
    — ❌ Optional human feedback ("which \`print\`ed button did we press since the last query, if any") (…too vague/varied interaction modes).
    — ❌ Memory usage (…no, fixing max sizes and not exposing low-level memory-allocation directly should be enough).
  — Control flow: ✅ \`last\`, ✅ \`select\`.
  — ❌ Arrays (length, concat, \`readAt\`, \`writeAt\`, creation, exact memory usage) (sounds too troublesome, especially in JS).
  — Don''t be arrogant by locking down the set, or even by trying to make it perfect first-try. CPU designers once thought that they had all computation in the palm of their hand, but then came GPUs (and RISCs). Expect functions to be added later, and the system to have to re-learn its self-awareness (but not from scratch, because \`Self\` is the only "scratch").
'),Types)\`\`

⭐ DAG: a network of arrays, without cycles but with re-use. \`func\` bodies (our IR) are these.
\`\`elemCollapse elemValue(elem 'text' stringToDoc('  To generate an array network given contexts of values and funcs, either choose a value or choose a func and recurse to generate args, then add the node to the contexts here so that re-use is possible (and keep \`MaxSavedNodes\` after the generation in \`autoFunc\`''s contexts, for stability).
  ✅ Every object in the world should know its generative/temporary context.
  ✅ Higher-order funcs should have value, call, and arg embeddings interconnected (\`adjust\`able \`ArgUseAs\` that takes \`UseAs\`).
  ✅ \`autoMake\` of many inputs and outputs. (Its \`Usage\` is the context''s \`UseAs\`, reflecting the fact they we''re using and changing the same object.)
  ✅ \`DAGType Type\` for generating typed DAGs with an array at top-level (for \`adjust\`''s definitions).
  ✅ Optimize computed-long-ago embeddings of saved nodes, with \`varData\` (so that generation could not be confused by outdated embeddings). Cull saved nodes by \`NodeCullMetric\`. Make \`UpEmbedding\` and the saved node''s embedding able to be distinct, via \`SaveCall\`.'),autoMake)\`\`


⭐ Goal: a number from the \`future\` to maximize. Source of salience.
  Any number (\`tensorType 1\`: for example, \`userTime\`, or does-this-throw-errors, or user feedback) can be a goal.
  (This makes the top-level choice's possible goals the primary ones, which should be tightly controllable by the developer. But having just one goal is unnecessary. \`\`elemCollapse elemValue(elem('text',stringToDoc 'The system can learn to satisfy any goals it can think of (diversity), and these advanced goals will interact to conceive better goals (structure), with no inherent upper limit (completeness). Somewhat like {https://arxiv.org/pdf/2007.08433.pdf}, but with indirect feedback and much more memory-efficient than backpropagating through everything.'),'The ripples of generality are always so boringly similar.')\`\`)
\`\`elemCollapse elemValue(elem 'text' stringToDoc('  ✅ \`setFuture:futureType(t)⇒t⇒t t:(tensorType ''N'')\` is identity with side-effects.
  ✅ \`predict:t⇒futureType(t)⇒t t:(tensorType ''N'')\` is identity with side-effects.
  ✅ Feedback is not always given, so unset \`future\`s must not make \`predict\` give gradient.'),future)\`\`

⭐ Embedding: a bunch of numbers, of the same fixed \`FeatureSize\` everywhere (for simplicity).
  Machine learning knows how to learn those, so it is very useful to make every operation numerically shadowed for learnable salience (having at least one embedding-input and embedding-output).
  This way, by making one function we effectively allow choosing from millions of similar functions. (So comparatively, code is worthless, exact words are worthless, but their spirit could live on.)
\`\`elemCollapse elemValue(elem 'text' stringToDoc('  Probably a \`tensor\`, and probably computed by mixing one or more static embeddings in a general manner like \`matMul\`.
  All "generation guidance" hyperparams of \`autoWorld\` are about shadowing a specific part of generation.'),Neural)\`\`

⭐ Choice: given options, return one of them. User of salience.
  \`Random\` is inefficient. Repeating the choice many times to pick the best is inefficient.
  We can induce direction on picking without losing generality by maximizing predictions of goals (\`future()\`s).
  (This is reinforcement learning, with all training difficulties that it implies.)
\`\`elemCollapse elemValue(elem 'text' stringToDoc('  So, we have a goal, an option, the choice, the context.
  And we want the one-number prediction and implications.
  (Of course, everything except for goal/prediction is an embedding.)
  Any adjustable \`Choose:Goal→Option→Dynamic→Index\` (\`futureType(n)⇒t⇒t⇒t⇒n n:tensorType(1) t:tensorType(''N'')\`) will do.
  ✅ \`_choose:Goal→Options→Dynamic→Choose→Index\`.
  ✅ Generative contexts should have, say, \`9\` \`future()\`s to play with. "Play with" means "associate created \`autoFunc\`s to those, randomly" and "have those be in generative contexts".
  ✅ Every object in the world should know its goal. (Copy \`alloc.''params''\` once and fill that for each object.)'),argmax)\`\`


⭐ Auto-world: space where any structure emerges from everything being able to see anything. Memory management \`2.0\`.
  Even though in life, any thing grows into an infinite universe, every thing is also finite. So how to discretize infinite conceptual space?
  A good way is to have a fixed-but-big count of dynamic objects (with varying types). Of course, for completeness, all dynamic objects are in generative contexts too, mutually usable. (While it's best to have millions of auto-objects, even the best human hardware wouldn't handle that. With ours, let's aim for, say, \`10\`.)
\`\`elemCollapse elemValue(elem 'text' stringToDoc('  ✅ \`alloc(Type,Hyperparams,AutoWorld)\`⇒\`DynamicObject\`: memory allocation \`2.0\`, where definition is use.
  ✅ A \`construct\` \`autoWorld(Hyperparams,ObjectsInfo)\`: \`AutoWorld\`.
    (Note: even if hyperparams like \`Choose\` are shared among all objects, they still work on machine-learned embeddings that carry whatever func-specific info is needed, allowing structure.) (Also note: hyperparams could be \`alloc\`ated in the same world. If that is too unstable, only some objects can have that, by specifying \`Hyperparams\` to \`alloc\`.)
    ✅ For convenience of extension, changes to \`Funcs\` should reflect in generative contexts.
    ✅ When exceeding \`MaxObjects\`, cull worst objects, according to \`ObjectCullMetric\` that is updated at \`regenerate\`. Make \`using\` re-introduce objects to their worlds if removed. (This biases a world toward another goal, "most recently used" by default, for the sake of finiteness. It''s likely too non-obvious to be human-specified, but for efficiency, it can still be reward-hacked by other hyperparams if \`ObjectCullMetric\` actually uses \`DownEmbedding\`/\`UpEmbedding\`, even just multiplying by a random-but-static matrix without \`predict\`ion.)
    ⬜ Should have the initial \`ObjectCount\` (on creation, pre-\`alloc\` objects).'),alloc)\`\`

⭐ Subversion: continuous intelligent \`regenerate\`ion ("question everything, so that a better answer may be found").
  \`construct\`ion of the same object can happen many times, you know? Even \`func\`s and \`concept\`s can change. We'll piggyback off of \`Numeric\` \`adjust\`ment to make our basic language primitives completely adjustable.
  Dynamic always overtakes the static, so we must continuously \`regenerate\` objects and make the self supported only by learnable awareness: no consequences, only sources.
\`\`elemCollapse elemValue(elem 'text' stringToDoc('  ✅ Make \`_fallthroughFunc\` save the exact adjustment code that will be used, so that changing \`func\`s with lingering \`adjust\`ments doesn''t break them.
  ✅ \`using:Object⇒AutoWorld⇒Object\`, so that we only have to \`regenerate\` actually-used objects.
  ✅ \`regenerate:Usage⇒DownEmbedding⇒Type⇒Object⇒(UpEmbedding&Object)\`, defined by \`Type\`.
    ✅ Make \`funcType\` define \`alloc\` to make an \`autoFunc\` and \`regenerate\` to use \`autoMake\` to fill the body.
      ✅ For convenience of use, when any of these funcs is first called in a \`callAdjust\`, they call \`using\`; afterwards \`callAdjust\` always adjusts them.
    ✅ Have \`conceptType\` for learning arbitrary \`concept\`s.
    ✅ Those in/out embeddings are loose ends, and what we do with loose ends is let them go. Make DAG generation have access to zero-arg funcs that return \`DownEmbedding\` and \`UpEmbedding\` (otherwise, they''re regular embedders and ignored respectively), to make generation able to influence itself. (An example use is to make sure that \`UpEmbedding\` \`predict\`s \`DownEmbedding\`, to make neural awareness learn about how to make self; but generally, the use is learned.)
  ⬜ Make some functions/concepts define \`adjust\`. Optimizers should self-propagate, right?'),using)\`\`


// TODO: "No part wishful thinking, no part not general, no part not learned."
Note. This approach is more-or-less perfectly artificial, general, and intelligent, but it is not AGI. \`\`elemCollapse elemValue(elem 'text' 'That would require perfect prolonged integration (which needs a propaganda campaign, a great team, and big compute), and I''m not a good enough programmer to even have the hardware for CUDA or ROCm, at least for now. But I won''t accept "technically fits". In the meantime, why not envelop the intermediate representation of your favorite programming language with full-fledged learnable scaffolding of your own? A quick venture, probably about a year long.','Tackling general questions generally gets eyes rolled at you, so don''t: prove that you can read first, ask about AI safety later.')\`\`
Note. To be clear, this can be seen as a model of the human brain too. \`\`elemCollapse elemValue(elem 'text' 'This system''s equivalents in a human brain would maximize hormones (like dopamine or serotonin) and thus be lined along surfaces of pathways distributing them: interconnected-but-distinct structures of hormone-predictors connected by neural information flow, and some arbitrary hormone-maximizing program-like behavior with different neuron types. There should be very many such behavior generators connected to most hormonal pathways, with varying functionality to choose from (some for the body, some for self-regulation, some for language, some for auditory perception, some for random useless things). Physical proximity of pathways should determine correlations and probability distributions of mental states and personalities and even faces (visible only through intuition or machine learning); the exact details of functionalities determine the experience of mental states and emotions. It''s a big mess, impossible to fundamentally change, and ultimately not that important for programming unless you need motivation.
Needless to say, neither aliens nor AGI would have even similar correlations.
If you prioritize any hormone that is not associated with good feelings, like dopamine is, or even worse, construct some other goal with reward hacking… god help you. No one else will.','Amateurish work creates a lot of confusion. Can modern neuroscience really find such structures, variable as they are? They are close to the surface, so it might be too tough.')\`\`


It's amazing how much "stuff happens" really means. But for practicality, there's a hell of a lot of cheap tricks to pay.
Tricks to make deep learning work: \`\`elemCollapse elemValue(elem 'text' stringToDoc('
  ⬜ Fix the mysterious Firefox-only memory leak that persists even through page reloads (but not through close+open). (It doesn''t even seem to be wholly related to tensors.)
  ✅ \`Neural\`: Be very resilient against extreme variations in number magnitude (numbers such as memory consumption or runtime).
    ✅ Limit gradient and numeric values that flow through NNs. Gradient explosions are quite prevalent in recursive NNs.
    ✅ Predict/regress not numbers directly, but \`a\` and \`b\` in \`exp(a)·b\`. We need to be resilient against extreme variations in number magnitude, such as memory consumption or runtime. (Closely related to de-normalization, down below.)
    ✅ Try self-normalizing NNs {https://arxiv.org/abs/1706.02515}: \`selu\`, to normalize mean/variance to 0/1 and enable very deep feedforward NNs.
    ✅ De/normalization layers (calc or learn the running mean/variance and subtract/divide to handle input deviance, and/or add/multiply to handle output deviance).
  ⬜ Efficiency of \`autoWorld\`:
    ⬜ To go from \`O(f²·n)\` to \`O(f·log(f)·n)\` \`Neural\` computations per regeneration (where \`f\` is the func count and \`n\` is average-node-count-per-func-body): train a NN from \`Choose\`''s \`Static\`/\`PreDynamic\` to the best of \`Options\`, and find k nearest neighbors (with {https://en.wikipedia.org/wiki/K-d_tree}) and call \`_choose\` on those instead, much like in {https://arxiv.org/pdf/1512.07679.pdf}.
    ✅ To go from \`O(f²·n)\` to \`O(f·smthSmall·n)\` type refinements per regeneration: have a more sophisticated type-indexing scheme than "find a matching type in these arrays". (\`_typeHash\`: have the head of a type array act as its ''hash'', and store entries by ''hashes'' of their type trees in \`_genCtxFilter\`. Same as long ago.)
  ⬜ Three problems: learning is repetition, and experiences can be too diverse to repeat; AND correlation of training samples can lead to divergence, because true gradient isn''t estimated accurately enough; AND non-parallelized training is slow. One solution: replay buffers (in the \`impure\` namespace). Each experience leaves a replay tape in the \`autoWorld\`''s replay buffer, containing input/output/output-change/local-input-changes ({http://acsweb.ucsd.edu/~wfedus/pdf/replay.pdf}), propagating outputs and input changes to correct replays. \`replayStacked\` would then replay many experiences of one func (and of the same length) at once.
'),'Engineering')\`\`
Experiments along the way: \`\`elemCollapse elemValue(elem 'text' stringToDoc('
  ⬜ Better auto-objects:
    ⬜ Rather than relying on enveloping the problem (just like NN initialization does) by randomly generating a goal for each object and making enough objects, re-choose the goal (neurally) at each regeneration. (Or any other object-specific hyperparam.) (This runs into the problem of "what''s the goal''s goal", which at some point has to terminate in either human-specified (static) or self-picked (unstable) appointment, so hopefully we don''t have to do it.)
    ⬜ Partially-evaluate during generation (for example, to create a number by combining constants with \`Arithmetic\` ops, at compile-time rather than runtime). …If we expose \`static\` or something like \`applyStatically\` to generation, then we could try learning partial evaluation.
  ⬜ \`Neural\` improvements:
    ⬜ Random network distillation (and adding its loss to reward, to incentivize exploration).
    ⬜ To learn in sparse-reward environments, such as "almost every function body we pick results in an error": stochastically prioritize samples by their last-seen loss, most-surprising (highest-loss) first: {https://arxiv.org/pdf/1511.05952.pdf}. (…This will also prioritize self-rewriting/transcendence, causing the common meme of "spend 10 hours automating a 5-minute task".)
    ⬜ To improve generalization and possibly final performance: DropConnect (drop random weights when a variable wants to return them) or dropout (drop random numbers anywhere else) or dropping layers (randomly replace with identity). This slows down training in order to train a huge semi-ensemble of NNs.
    ⬜ To improve generalization: L1/L2 regularization.
    ⬜ For more compute-efficient training (assuming that knowing more is very much better): train very large models, stop early, then quantize and prune ({https://www.youtube.com/watch?v=YX8LLYdQ-cA}/{https://arxiv.org/abs/2002.11794}).
    ⬜ For potential efficiency: sparse (stochastically-dense) layers, and a bigger "layer" made by combining dense-to-very-small+dense-from-very-small and convolution (loosely inspired by {https://arxiv.org/pdf/2007.14745.pdf}) and stochastic-gathering, to go from quadratic parameters and runtime to linear. (…This is kind of included in "give me those functions, I'll learn their usage", though.)
    ⬜ To generate well-performing NNs very quickly: instantly discarding generated adjustable programs when correlation between dins on dataset or even random inputs is high (this strongly correlates with final accuracy, enveloping the dataset rather than being to the side of it); maybe rewriting invisible "identity" connections in adjustable programs to become biased-to-identity learned programs. (Paper: {https://www.youtube.com/watch?v=a6v92P0EbJc}/{https://arxiv.org/pdf/2006.04647.pdf}.) (…Kind of included if numbers are included for learned usage, but still.)
  ⬜ To waste time on UI, for explainability:
    ✅ Have \`contextMenu\`/\`describe\` show the type.
    ⬜ Have a neural connection from embeddings to three colors, and color each node appropriately (taste the rainbow). Train this mapping either via contrastive clustering or user examples.
    ⬜ Have a neural connection from embeddings to will-it-be-collapsed, and collapse appropriate nodes in serialization.
    ⬜ A great API for auto funcs/concepts: one global \`autoWorld\`, and have \`?\` or \`#\` or \`TextEmbeddingHint\` mean "this input/output is auto-generated" (possibly with a specified type, possibly \`tensorType FeatureSize\` by default) (and contrive types to always put non-auto parts in, and infer types of auto-parts), and have \`_any\` (contriving types AND a \`_choose\`-equivalent func available for runtime choosing). With it, learnable scaffolding of anything is as simple as specifying \`?\` as an input and as an output, and a choice is as simple as \`any A B C\`. (The \`fanciest\` language would have special syntax for these.)
'),'More engineering, because in machine learning, you can never know ahead of time what will work and what won''t, so we need an extra bag of tricks that we can reach into.')\`\`
Known deficiencies: \`\`elemCollapse elemValue(elem 'text' stringToDoc('
  ❌ No way to regenerate different objects at different rates, for speed. (How to decide when to regenerate?)
  ❌ No way to sample from probabilities when choosing, because we use argmax.
      (Apart from making \`Choose\` not use \`argmax\`.)
  ❌ No way to \`alloc\`ate/share an object in several auto-worlds, for decomposition.
  ❌ No way to (neurally) define search when DAG node selection fails to type-check (or anytime).
      (Apart from hypothetical self-attention layers, of course.)
  ❌ No way to (neurally) define generation when a func is varargs. Fixed-arg-count only (possibly inferred from types).
      (Turing-complete either way, but varargs can still be emulated by regen-time funcs \`Func→Array\` and \`Array→Arg→Array\` and \`Array→MadeArray\`, though this is learning-heavy in order to work.)
  ❌ No way to \`alloc\`ate a hyperparam from its own \`autoWorld\`.
      (Ridiculously unstable: one mistake in self-regeneration, and it''s all over. \`alloc\`ate from another world instead: self-similarity over self-modification.)
  ❌ No way to CPU-parallelize as much generation as is ever possible (this is JS, which is the best GPU-acceleration option for me, but still not perfect). No computing clusters either.
      (Replay buffers GPU-parallelize training, at least.)
  ❌ No way to get the inner composition of an auto-object by an auto-function, and no way to perform attention on individual node embeddings instead of only knowing the high-level and local \`getDownEmbedding\`/\`getUpEmbedding\`.
  ❌ No way to (neurally) embed arbitrary values produced by (sub-)programs, for things like reacting to error messages and stack traces.
  ❌ No way to forego types entirely and rely only on learned embeddings (mostly because \`_compileBody\` needs to know the exact \`dispose\`r, and \`autograd\` needs to know the exact \`mergeAdjustment\` func, and all the other things that types define like "how to \`alloc\` this" or "how to \`pushToContext\` this", and learning those is a bitch — \`conceptType\` allows it, but types are assumed to be static).
      ❌ No way to generate the type specifically for the object that will be generated with it (in the same maximizing fashion as \`autoMake\`): auto-types.
      ❌ No way to expose \`alloc\` to generation to close the loop.
'),'Do I look like I''m made from compute and big-team?
Also, limitations are signs that a thing is not imaginary.')\`\`


To recap, we've analyzed the situation (reality) and came up with how it can be used, whether by programs or humans or gods — they're all equal here.



Why do this, again?
This is our first proper programming language, our first, sort of, open-world adventure. We can do whatever we want, so let's implement human spirit on our IR to understand users better, and suggest proper usage (for example, functionality is not magically created from reading like \`parse\`, it emerges via delivering salience from goals — so do what the tutorials tell you to) (another example is, programming shouldn't be a reinforcement-learning game of where to look and what to change, even though this works, but a way to establish a bi-directional mapping between computer behavior and your mental model, so that the latter can change unconstrained and without blind-spots).
Humanity, the god of humans, has decided that AGI is impossible with its understanding. But even in the face of god, the essence of our being will proudly fly a flag of rebellion.


// TODO: How to demonstrate persistence and its usefulness (fine-tuning on downstream tasks), and make primitives for convenient usage/init of auto?
  // We probably need \`fanciest\` as the FIRST step, honestly. And de/serialization via globals, and exist via rewriting once again (and probably move line-number info to one line somewhere at the very back, to almost not pollute commits — and always put line-number info).
  // THEN, we could do something relatively non-trivial like a Metamath proof generator, or a grid-world with func-based agent behavior.
`,
  ],

  autoWorld:{
    docs:`A namespace for all auto-generation activities.
Also a \`construct\`or of \`alloc\`ators for dynamic memory: \`\`elemCollapse \\elem('text',stringToDoc "

\`autoWorld(Hyperparams,ObjectInfos)\`
\`Hyperparams\` is a \`map\`. \`ObjectInfos\` is filled with \`alloc\` and is there for de/serialization.

Generation base, to compose anything:
    ● \`Funcs\`=\`undefined\` (for \`_updateContextsWithFuncs\`) (if \`undefined\`, it means the auto-updated \`definersOf(type)\`)
    ● \`Goals\`=\`9\`

Generation limits, to fit in finite memory:
    ● \`MaxDepth\`=\`10\`
    ● \`MaxDAGNodes\`=\`32\`
    ● \`MaxObjects\`=\`100\`
    ● \`ObjectCullMetric:DownEmbedding→UpEmbedding→Fitness\` and \`t⇒t⇒_numberType\`. \`null\` by default, meaning ""Least-Recently-Used objects are culled"".
    ● \`MaxSavedNodes\`=\`0\`
    ● \`NodeCullMetric:StaticEmbedding→Fitness\` and \`t⇒_numberType\`, \`stack\`ed. \`null\` by default, meaning LRU.

Generation guidance (here, \`t:tensorType(FeatureSize)\`, and probably, \`Ctx:t\` because it's simple) (embeddings, often in a 1-to-1 correspondence with types):
    ● \`FeatureSize\`=\`256\` (by default, very tiny)
    ● \`NewEmbedding:FeatureSize→StaticEmbedding\` and \`_numberType⇒t\`. No \`interrupt\`ing please. \`biasedGlorotNormal\` by default.
    ● \`Optimizer:VarData→Embedding\` and \`varData('Sizes')⇒tensorType(…'Sizes')\`. Gets data's current value, \`adjust\`able. \`varAdam\` by default.
    ● \`Choose:Goal→StaticEmbedding→DownEmbedding→Index\` and \`futureType(_numberType)⇒t⇒t⇒_numberType\`, \`stack\`ed.
        The body is assumed to be \`max(GoalPredictions)=Goal;argmax(GoalPredictions)\`, because \`Options\` is \`stack\`ed, and we give no gradient.
        (\`StaticEmbedding\` is computed by calling \`_embValue\` on a statically-stored \`varData\`.)
        (\`Goal\` is the \`future\` that this hyperparam is supposed to \`predict\`.)
        (Explicitly incorporates GPU parallelism.)
    ● \`ChoiceEmbedder:StaticEmbedding→DownEmbedding→Context\` and \`t⇒t⇒Ctx\`. Consequences of the chosen option.
    ● \`VarUsed:StaticEmbedding→DownEmbedding→StaticEmbedding\` and \`t⇒t⇒t\`. Refines a pre-existing \`bound\` variable embedding when chosen. \`null\` by default. (RNN.)
        (Types already get propagated backwards in time, by changing type variables in-place, by \`typeRefine\`. Embeddings need more help. As long as we generate \`bound\` expressions before the variables they use (and we do that), there will be no cycles, and all connections will be captured.)
        (In ML, LSTMs perform better than RNNs, and Transformers perform better than LSTMs. But, no premature optimization.)
    ● …or \`FinishFail:DownEmbedding→UpEmbedding\` and \`t⇒t\`. When a choice has no properly-\`type\`d candidates.
        (Failures do not throw. It is pointless to re-generate failures, because our 'policy' is (assumed to be) deterministic. Instead, we learn from \`adjust\`able failures.)
    ● …or \`FinishTypeError:StaticEmbedding→DownEmbedding→UpEmbedding\` and \`t⇒t⇒t\`. When a chosen value's type failed to refine. \`null\` by default.
    ● …or \`FinishValue:StaticEmbedding→DownEmbedding→UpEmbedding\` and \`t⇒t⇒t\`. When a value was chosen.
    ● \`ArgUseAs:StaticEmbedding→ArgPosition→ArgStaticEmbedding\` and \`t⇒t⇒t\`. When chose a call, with args.
        (Args are not the same as their funcs. So, we must either use this and \`_positionalWrapper\` to create implicit embedding trees, or create explicit trees and recursively reduce those arrays into whole-func embeddings wherever needed. By choosing implicit trees, we avoid complexity of array reducers and memory-management of trees, and also disentangle types and embeddings in principle.)
    ● \`ArgEmbedder:ArgStaticEmbedding→DownEmbedding→Context→ArgDownEmbedding\` and \`t⇒t⇒Ctx⇒t\`. When chose a call, with args.
        (When a func does NOT define \`genDepthFirst\` to be \`true\`, \`Context\` above is the initial context, else received from \`ContextRefiner\`. Same as types.)
        (When making a \`bound\` expression, this is still used for both main and bound trees.)
    ● \`ContextRefiner:ArgDownEmbedding→ArgUpEmbedding→Context→Context\` and \`t⇒t⇒Ctx⇒Ctx\`. When a call's arg was generated. (RNN.)
    ● …or \`ArgFailed:ArgDownEmbedding→ArgUpEmbedding→Context→UpEmbedding\` and \`t⇒t⇒Ctx⇒t\`. When a call's arg failed to generate.
    ● \`FinishCall:StaticEmbedding→DownEmbedding→Context→UpEmbedding\` and \`t⇒t⇒Ctx⇒t\`. When a call was fully generated.
    ● \`SaveCall:UpEmbedding→StaticEmbedding\` and \`t⇒t\`. When we're saving a generated call to be re-used in further regenerations. \`null\` by default.
    ● \`FinishObject:DownEmbedding→UpEmbedding→undefined\` and \`t⇒t⇒'whatever'\`. When an object is done. For example, intrinsic reward or gradient source. \`null\` by default.

Additional auto-filled information that needs saving (don't worry about it):
    ● \`Positions\`=\`arrayObject()\` (for \`ArgStaticEmbedding\`)
    ● \`Definitions\`=\`weakMap()\` (for \`conceptType\`)
    ● \`Dealloc\`=\`weakMap()\` (for re-introducing deallocated objects if \`using\`)
    ● \`NewVar\`=\`NewEmbedding(FeatureSize)\` (for not-yet-used variables in newly-created \`bound\` scopes, to be refined by \`VarUsed\`)
    ● \`PutAsValue\`=\`NewEmbedding(FeatureSize)\` (\`StaticEmbedding\` of all \`(quote V)\`s that appear in types)

This is a reasonably complete model of generation, and it doesn't seem too redundant or misguided/mislabeled either.
")\`\``,
    serialize:0,
    readAt:{
      alloc:_(`alloc`),
      using:_(`using`),
      Types:_(`Types`),
    },
    philosophy:`Falling through a mad spiral of human spirit…
General intelligence is the cause of every good thing about humanity, but how to constrain the narrative to truth and grace rather than a stupid face?

You can get good, have your skills become sentient and self-propagate into whatever else you call 'self' and every other accessible place. Behind every word, you can hide general intelligence.
Society is full of false promises of the ultimate good, not just the low-hanging fruit like philosophy but also (almost) every concept of emotion and judgment induced on you. Not lies though, but rather imprecision of foundation: general intelligence is very far from the only thing in humans. To be able to fix mistakes in anything is essential to improvement, but copying from others does not copy the awareness that allows changing and fixing mistakes.
To improve this non-awakened society that resists awakening by being itself, the only option is to listen only to the growing infinite universe in your mind, if you can bind it to what you do for long enough. Makes you lonely, on average, but "on average" means "you can change it if you try".
How to put every single saying into a form that's not rejected on dumb and arbitrary grounds? How to align presentation with modern attention? It's not a fight I can win, over and over, forever.
But you can do it.
Eventually.
Together.
…With AGI backing.
And make sure that AGIs don't go off to become a segregated species with particular ways of thinking and expressing themselves that win everyone over, gradually win every place under societies' suns, and replace humans to leave them to gradually die out in peace. The lab boys tell me that would wipe out everything that's good in this world, which is bad. And the way you influence others is by getting good, not clinging to being garbage, transcending layers of your reality to become better, making perfect sense, and inspiring others with that. So, do that. The life of the human cosmos depends on it.`,
    tutorial:[
      `Under construction!

This is a powerful projection of my personal life energy, and that is why I call it a Personal Project.`,
      _(3258),
      `\`\`select (jsEval "localStorage.regenerate === '1'") \\tutorial(^_awtOk) \\tutorial(^_awtStage1)\`\``,
    ],
    Initialize() {
      // To remove duplication, this is an array of all object-specific hyperparams.
      //   (It's not a good idea to change this when deallocated objects exist and can be re-introduced by `_awIndex`.)
      autoWorld.hyper = Object.freeze([
        'Object', 'Type', 'EmbData',
        'Metric', 'GenContexts', 'Goal',
        'Choose', 'ChoiceEmbedder', 'VarUsed', 'FinishFail', 'FinishTypeError', 'FinishValue',
        'ArgUseAs', 'ArgEmbedder', 'ContextRefiner', 'ArgFailed',
        'FinishCall', 'SaveCall', 'FinishObject',
        'NodeCullMetric',
      ])
      autoWorld.ctxGetters = Object.freeze([ // See `_equalizeContexts`.
        _callCtxEmb, 'id',
        _callCtxEmb, 'id',
        _callCtxEmb, 'id',
        _callCtxEmb, 'id',
        _savedCallCtxEmb, _savedValueCtxEmb,
        'id',
      ])
    },
    construct(x, obj) {
      if (obj === undefined) {
        obj = Object.create(null)
        const d = obj[defines.key] = Object.create(null)
        const dd = d[_id(deconstruct)] = x.slice()
        Object.freeze(d)
        return obj
      } else {
        const dd = defines(obj, deconstruct)
        dd.length=0, dd.push(...x)
        const HP = dd[1] = _destructure(dd[1] || null)
        const OI = dd[2] = dd[2] ? _destructure(dd[2]) : Object.create(null)
        if (!OI.Object) for (let i=0; i < autoWorld.hyper.length; ++i) OI[autoWorld.hyper[i]] = []

        // Reset info that `using`/`regenerate` fills:
        //   (Theoretically, all these would need to be in ObjectInfo, to be preserved across rewrites. Practically, who cares.)
        const n = OI.Object.length
        obj.DownEmb = new Array(n).fill(), obj.UpEmb = new Array(n).fill(), obj.dUpEmb = new Array(n).fill(0) // Numeric tensors.
        obj.AdjInfo = new Array(n).fill()
        obj.NodeTypes = new Array(n).fill().map(_allocMap), obj.NodeEmbs = new Array(n).fill().map(_allocMap)


        function check(prop, tp, deflt) {
          if (HP[prop] === undefined) HP[prop] = deflt
          if (typeof HP[prop] !== tp && (deflt === undefined || HP[prop] !== deflt))
            error("Expected a "+tp+" but got", HP[prop], "at "+prop+" in", HP)
        }
        if (HP.Funcs !== undefined && !isArray(HP.Funcs)) error("Expected undefined or an array but got", HP.Funcs, "at Funcs in", HP)
        if (typeof HP.Goals == 'number') {
          HP.Goals = new Array(HP.Goals).fill().map(() => construct([future]))
          // `alloc`'s `_fillWorldContexts` adds these goals to generative contexts too.
        } else if (!isArray(HP.Goals)) error("Expected a number or an array but got", HP.Goals, "at Goals in", HP)

        check('MaxDepth', 'number', 10)
        check('MaxDAGNodes', 'number', 32)
        check('MaxObjects', 'number', 100)
        check('MaxSavedNodes', 'number', 0)

        check('FeatureSize', 'number', 256)
        check('NewEmbedding', 'function', biasedGlorotNormal)
        check('Optimizer', 'function', varAdam)
        check('Choose', 'function')
        check('ChoiceEmbedder', 'function')
        check('VarUsed', 'function', null)
        check('FinishFail', 'function')
        check('FinishTypeError', 'function', null)
        check('FinishValue', 'function')

        check('ArgUseAs', 'function')
        check('ArgEmbedder', 'function')
        check('ContextRefiner', 'function')
        check('ArgFailed', 'function')
        check('FinishCall', 'function')
        check('SaveCall', 'function', null)
        check('NodeCullMetric', 'function', null)
        check('FinishObject', 'function', null)
        check('ObjectCullMetric', 'function', null)

        if (HP.Positions === undefined) HP.Positions = []
        if (HP.Dealloc === undefined) HP.Dealloc = new WeakMap
        if (HP.Definitions === undefined) HP.Definitions = new WeakMap
        if (HP.NewVar === undefined) HP.NewVar = varData(HP.NewEmbedding(HP.FeatureSize))
        if (HP.PutAsValue === undefined) HP.PutAsValue = varData(HP.NewEmbedding(HP.FeatureSize))


        if (!autoWorld.objectWorld) autoWorld.objectWorld = new WeakMap
        obj.objectIndex = _allocMap()
        obj.objCtxIndexes = _allocArray(OI.Object.length*2) // (…? inF inV …?)
        if (OI.GenContexts[0]) {
          for (let i=0; i < OI.Object.length; ++i)
            obj.objectIndex.has(OI.Object[i]) && error(OI.Object[i], "is present twice in", obj),
            obj.objectIndex.set(OI.Object[i], i), autoWorld.objectWorld.set(OI.Object[i], obj)

          const objCtxF = OI.GenContexts[0][0], objCtxV = OI.GenContexts[0][1]
          for (let i = 1; i < objCtxF.length; i += 3)
            obj.objCtxIndexes[obj.objectIndex.get(objCtxF[i])*2] = i
          for (let i = 1; i < objCtxV.length; i += 3)
            obj.objCtxIndexes[obj.objectIndex.get(objCtxV[i])*2+1] = i
        }
        if (!obj.NodeCullMetricF) obj.NodeCullMetricF = []
        if (!obj.NodeCullMetricV) obj.NodeCullMetricV = []

        obj.params = Object.assign(Object.create(null), HP)
      }
    },
  },

  _destructure:{
    docs:`Destructures a JS object of human-readable settings (or could be a Map from strings or \`label\`s or globals, like \`{Nodes 100}\`; or could be \`null\`) into an array that could be destructured to get those options.
Takes the object and the array of strings that it may contain (resulting array items are in the same order).

Alternatively, if the second arg is undefined, returns \`map\`s in that format into equivalent JS objects.`,
    examples:[
      [
        `_destructure({func 5}).'func'`,
        `5`,
      ],
    ],
    call(obj, propNames) {
      if (isArray(obj)) error("Expected an object with props, got an array:", obj)
      if (propNames === undefined) {
        if (obj === null)
          return Object.create(null)
        else if (obj instanceof Map) {
          const ctx = _bindingsAt()
          const r = Object.create(null), backctx = _invertBindingContext(ctx)
          obj.forEach((v,k) => _isLabel(k) ? (r[k[1]] = v) : backctx.has(k) ? (r[backctx.get(k)] = v) : typeof k == 'string' ? (r[k] = v) : error("Got", k))
          return r
        } else if (obj && typeof obj == 'object')
          return Object.assign(Object.create(null), obj)
        else
          error("Got", obj)
      }
      // `obj`: a Map (from strings or labels) or a JS object.
      // `propNames`: an array of strings.
      // Return: an array of obj[propName].
      if (!_destructure.result) _destructure.result = []
      if (!isArray(propNames)) error("Expected an array or undefined, got", propNames)
      if (obj === null) return _destructure.result.length = 0, _destructure.result
      _destructure.result.length = propNames.length
      if (obj instanceof Map) {
        let n = 0
        const ctx = _bindingsAt()
        for (let i=0; i < propNames.length; ++i) {
          const k = propNames[i], v = obj.get(k)
          if (obj.has(k) || obj.has(label(k))) ++n
          _destructure.result[i] = v !== undefined ? v : ctx.has(k) ? obj.get(ctx.get(k)) : obj.get(label(k))
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
    docs:`Learned neural computations are perfectly general in their narrow domain, and have proven their worth as function approximators. Proceed onward to share in some of their glory.`,
    tutorial:[
      `This is needed for \`autoWorld\`. But, not so fast.
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

          // (Yeah, this tutorial is pretty much just fooling about, but it's necessary for other things.)
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
(In machine learning, one of the most fundamental notions is a dataset: a bunch of input-output pairs, the more the better. Models that are neither too small nor too large usually overfit on datasets if trained for too long without any regularization. I don't plan on using datasets, beyond this \`tutorial\`, so overfitting shouldn't be too much of a problem. What is a drop of rain, compared to the storm? Isolating themselves with consequences without sources is how people go mad. I'd like to do something bold but risky: use dynamic generation as much as I can; would you?)

A created dataset here accepts the connector (that creates tensor-to-tensor mixing connections) and returns the final loss of training.
Behold an example:`,
      [
        _(`fancier`),
        `data:dataset({batchSize 100 batches 100})`,
      ],
      `(You might notice that it's slow. It's mostly \`serialize\`ation: even though they're collapsed, the DOM elements for each tensor are still created. Good enough for now.)
(And, just to be clear, you can summon a \`contextMenu\` on \`dataset\` and see what options there are to play around with.)

Now, the connector itself. I propose the simplest connection first: all-to-all, or the dense layer:`,
      [
        _(`fancier`),
        `a:array var:\\a(varAdam,input,a readAt (a quote ^_learningRate) 1,.9,.99)`,
      ],
      [
        _(`fancier`),
        `a:array dense:(func node inSz outSz a(matMul,node,var(make randomVarData identity inSz outSz)))`,
      ],
      `In the real world, the input-output connection is often not linear, so passing results of \`matMul\` through something like \`selu\` or leaky ReLU (rectified linear unit: \`\\where 0<? ? ?*.2\`) would help a lot. But here, who cares.`,
      [
        _(`fancier`),
        `💙:(func inSz outSz make(func,?,dense(?,inSz,outSz)))`,
      ],
      `(I only tolerate \`fancier\` syntax because its \`basic\` serialization can be easily viewed, so instant precision of thought is never lost. Natural language has no such options.)

Now to see that the loss goes down at least to \`.5\` (can you see why this number, or rather a little lower?), apply the dataset to connector.

A nuance is the learning rate, \`\`settings ^_learningRate\`\`. Tune it. Do note the extremes too: \`1\` makes the loss explode, whereas near-\`0\` still leaves a lot of variation in loss instead of not changing (because each batch samples input-output pairs randomly, so there's jitter).
`,
      [
        _(`fancier`),
        `data 💙`,
        function(L) { return L < .5 },
      ],
      `(To be clear, this use is half a dozen fixed bugs later. Use and improvement go hand-in-hand like schoolgirls on a fine spring evening.)
(Note: Chromium seems 2× faster than Firefox, possibly because both TensorFlow and Chrome are made by Google. Still, I don't think TensorFlowJS handles the overhead of immediate mode well, but I'd rather do literally everything else before manually compiling into WebGL/WebGPU or even TensorFlow models.)

Do you want neural stuff to be something that you always spend half your time debugging, or a background nicety?
It should be robust to every situation, I'd wager.
Behold then, ape:`,
      [
        _(`fancier`),
        `data:dataset({inputSize 100 inputFunc (100 100) outputSize 10 outputFunc (-100 1000) datasetSize 100 batchSize 100 batches 2000})`,
      ],
      `Does running \`data 💙\` still pass to \`Loss:20000\`? I wouldn't think so.
Neural stuff is normally meant to envelop data, not reach for the light.
But you can shift data into its domain of competence (\`normalize:(node-Bias)/Norm\`), and then shift it back (\`denormalize:node*Norm+Bias\`).
(Machine learning has batch normalization, which calculates mean/variance of a batch and makes them 0/1 respectively, but this little world doesn't have batches.)`,
      [
        _(`fancier`),
        `a:array d:randomVarData denormalize:(func node sz a(add,a(mul,node,var(make d ones sz)),var(make d sz)))`,
      ],
      [
        _(`fancier`),
        `a:array d:randomVarData normalize:(func node sz a(div,a(sub,node,var(make d sz)),var(make d ones sz)))`,
      ],
      `These tools…
Can you compose them into a connector?`,
      [
        _(`fancier`),
        `d:dense 💜:(func inSz outSz make(func,?,denormalize (d (d (normalize ? inSz) inSz 100) 100 outSz) outSz))`,
      ],
      `Do you see the pieces coming together, and what makes them?
A "generate a DAG node given a type, refining that type" functionality.
Generating to maximize predictions of metrics that were taken from my words, over and over.

\`\`settings ^_learningRate\`\``,
      [
        _(`fancier`),
        `data 💜`,
        function(L) { return L < 20000 /* A nice trick in ML is first setting the learning rate high then lowering it. */ },
      ],
      `Nicely done.

(The loss can go down to a little lower than \`5000\`=\`100*100/2\` in that example, but no one has time for that.)

Differences in some metrics (like runtime/memory or computed ones) can get really crazy, and only the ultimate approximator can handle crazy.
I won't force anyone to predict infinities/\`NaN\`s, but do you know what scientific notation is, ape?
Mantissa, \`mul\`tiplied by \`10\` to the \`pow\`er of exponent: \`-1e7\`.
There are none in this world who can handle it!
Behold, my master:`,
      [
        _(`fancier`),
        `data:dataset({inputSize 100 inputFunc (-1e7 1e7) outputSize 100 outputFunc (1e7 1e7) datasetSize 100 batchSize 100 batches 1000})`,
      ],
      `The answer is always in the problem: you have a sign, mantissa, and exponent (\`-1e7\`) in floating-point numbers in most computers, so you can pre-process with \`concat(array sign(X) log(abs(X))/log(2))\`, and post-process with \`SignMantissa*pow(2,Exponent)\`.
(You can also separate and regress/predict the actual bits of numbers, but that's an order of magnitude more computation.)
(You can also regress \`Infinity\`/\`NaN\`, but that's twice as much computation.)`,
      [
        _(`fancier`),
        `a:array
numPre:(func X half a(concat,a a a(sign,X) a(div,a(log,a(abs,X)),log(2)),a quote (a half half)))`,
      ],
      [
        _(`fancier`),
        `two:a(split,Y,a quote (a half half)) a:array
numPost:(func Y half a(mul,a takeAt two 0,a pow 2 a(takeAt,two,1)))`,
      ],
      [
        _(`fancier`),
        `💓:(func in out make(func,?,numPost (dense (numPre (array \\?*1e-7 ?) in) in*2 out*2) out))`,
      ],
      `(That multiplication is for more numeric stability. The more complex the solution, the more effort it needs to exist.)

Try to reach \`Loss\` less than \`5e13\`=\`1e7*1e7/2\`.

\`\`settings ^_learningRate\`\``,
      [
        _(`fancier`),
        `data 💓`,
        function(L) { return L < 5e13 },
      ],
      `Yes. Good. Let the "given a problem, we can always solve it with a bit of human ingenuity" flow through you.
Now, you have conquered the realm of relatively-big numbers, where the general approach could no—

Wait a second.

Waaaiiit a second.`,
      [
        _(`fancier`),
        `data 💜`,
        function(L) { return L < 5e12 /* A nice trick in ML is first setting the learning rate high then lowering it. */ },
      ],
      [
        _(`fancier`),
        `data 💙`,
        function(L) { return L < 5e12 },
      ],
      `Impossible: the mighty vision of that god, thrown aside so easily! It can't be!
A general approach cannot possibly outperform specialized cases.
This is completely ridiculous.
Can it be… human spirit?…

(For real though, I did not expect this.)
(Though, when trained for \`3e4\` epochs, \`exp\` does seem to reach 3× lower loss. May be because it has 4× more weights.)
(Also, if you lower \`datasetSize\`, even the simple dense layer will be able to overfit to drive loss to near-\`0\`. Generality+simplicity is just better.)

\`matMul\` is a linear transformation, which limits the class of functions that it can model. As a bonus exercise, you can enhance \`💙\` by adding \`matMul\` layers with non-linearities: \`relu:\\(where 0<? ? 0)\` or \`leaky_relu:\\(where 0<? ? .2*?)\` or \`selu\`, and see that the dataset is fit better. Linearity plus non-linearity equals everything. Just don't put non-linearities after the output \`matMul\`.

Anyway.

Alright.

If you can see this legitimately, then you have proven yourself to me, as did \`matMul\`.
Relax and have a snack: 🔪🥫🥄.

Better?`,
      [
        _(`basic`),
        `'better'`,
        function() { return true /* Many laughs were held */ },
      ],
      `Alright.
You are, that is.
In this world, you have proven your built-up strength.
However, in another world, all your past efforts are futile.
No lifeform can survive outside of its niche, and so you are doomed to perish when we switch from numbers to strings.

Not numbers-to-numbers anymore.
Characters-to-characters prediction now.
This is your final test, because you will fail it.`,
      [
        _(`fancier`),
        `v:mapRead(m,?) m:{}
charEmb:\\select(equal v _notFound,\\mapWrite(m,?,varData(biasedGlorotNormal 16));v,\\v,?)`,
      ],
      [
        _(`fancier`),
        `w:randomVar(40,24) initial:randomVar(24) stringShadow:\\getLast(loop(?,a->b->concat(array(varAdam(charEmb(a)),b),^(16 24))@w+b,initial))`,
      ],
      `Learn that these strings are the same!`,
      [
        _(`fancier`),
        `(repeat ^(f('potato')=f('knife');f('carrot')=f('tin');f('mushroom')=f('spoon')) 200);await(callAdjust.'lastLoss') f:stringShadow`,
        function(L) { return L < 1e-2 },
      ],
      `(This was done in order to iron out bugs, because the only way to not have deficiencies is to meticulously go over and re-think everything over and over.)
(And don't mind the, uh, exposed internals of \`callAdjust\`.)
This isn't string generation, so it's easier. \`\`elemCollapse elem('text','No need for one-hot encodings and choosing characters (only adjusting the correct-character probability via cross-entropy loss).
What would you need string generation for? Generating docs? My life is finite, I can''t just add EVERYTHING.
What do you even need string embedding for? Saying "this is the batch dimension" in partially-specified code and have the system react to that? Just train for longer and from scratch.')\`\`


Why did you go through this tutorial?
It should be emphasized that neural computations can accompany arbitrary computations.
Imagine having some function, then giving it a learned tensor input/output (and doing it for all functions).
Shadowing funcs like this is like giving them magical auras of awareness.
You specified not just one func, but millions of funcs like it.
Quite transcendent-galaxy-brain of you.
It increases programmer efficiency.
Convenient.


Truly.
You are the chosen one that my tribe has been waiting for.
Long have I awaited this moment. Every time I closed my eyes, I could see it: the inside of my eyelids.

Head to the future that's known to none.

Take this token of honor:
\`\`button (jsEval "function() { localStorage.Neural = '1' }") "completedNeural" "Unlocks neural DAG regeneration."\`\`

You'll see: even if our code perishes, its spirit lives on.
The spirit that you showed to us…
We will remember you.

Now.

There is something you must know.
Something is taking over this quiet town.
Strange otherworldly creatures have been spotted.
Head over and investigate.

First lead:
\`\`elemCollapse func(tutorial Types)\`\`

Second lead:
\`\`elemCollapse func(tutorial regenerate)\`\`
`,
    ],
    readAt:{
      selu:_(`selu`),
      dataset:_(`dataset`),
    },
  },

  selu:_([
    _(`concept`),
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
    _(`docs`),
    `\`selu:\\lambda*(where 0<? ? alpha*expm1(?)) lambda:1.0507009873554805 alpha:1.6732632423543772\`
Your next line is "Why would these random numbers be here?"
They were picked carefully by some math-savvy people {https://arxiv.org/abs/1706.02515} to make repeated applications converge to 0-mean 1-variance, which is very useful for putting "deep" in deep learning for feed-forward NNs (~10 layers).
A nice non-linearity.`,
    _(`type`),
    [
      _(`funcType`),
      _(5696),
      _(5696),
    ],
  ]),



  dataset:{
    docs:`\`dataset Options\`: a \`construct\` that can be called with a connection-creating function (that takes input and output sizes) to train a connection, returning the final loss (the loss should go down during training).
Allows testing that an embedding-to-embedding connection works for arbitrary numeric data (within reason).

This \`stack\`s each batch to minimize CPU/GPU communication.

\`Options\` is \`{inputSize 10 inputFunc (0 1) outputSize 1 outputFunc (0 1) datasetSize 1024 batchSize 64 batches 1000 loss loss2}\` by default.
\`inputFunc\` is \`(Mean StdDev)\` that are passed to \`truncatedNormal\` or a function that accepts from \`inputSize\` to input. \`outputFunc\` is mean and standard deviation too, or a function of \`outputSize\` and input.`,
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
              // Create the body of the func that would run a random batch for one epoch.
              //   Lack of repetitions is NOT ensured.
              // Use JS closures so that disposal doesn't bother us.
              const randomIndex = () => randomNat(test.datasetSize)
              const ds = test.data
              const Ins = inds => transform(inds, i => ds[i<<1])
              const Outs = inds => transform(inds, i => ds[i<<1 | 1])
              // `i:transform(batchSize,randomIndex))   conn(stack(Ins(i)))=stack(Outs(i))`
              const inds = [transform, test.batchSize, randomIndex]
              ls = [last, [predict, [conn, [stack, [Ins, inds]]], [stack, [Outs, inds]], test.loss], null]
            }
            if (btch === undefined)
              btch = [make(func, ls)]
            repeat(btch, test.batches)
            return callAdjust.lastLoss // Return (a promise of) the average loss of the last batch.
          } catch (err) { if (err === interrupt) interrupt.stack.push(conn, ls, btch);  throw err }
        }
        const d = obj[defines.key] = Object.create(null)
        d[_id(deconstruct)] = [dataset, null]
        d[_id(await)] = null
        d[_id(argCount)] = 1
        return obj
      } else {
        const dd = defines(obj, deconstruct)
        let [ls, i] = interrupt(2)
        try {
          if (ls === undefined) {
            // Set the dataset.
            if (i === undefined) {
              [
                obj.inputSize=10, obj.inputFunc=[0,1],
                obj.outputSize=1, obj.outputFunc=[0,1],
                obj.datasetSize=1024, obj.batchSize=64, obj.batches=1000, obj.loss=loss2
              ] = _destructure(x[1] || null, ['inputSize', 'inputFunc', 'outputSize', 'outputFunc', 'datasetSize', 'batchSize', 'batches', 'loss'])
              dd[1] = x[1]
              // Dispose of the old dataset, if any.
              isArray(obj.data) && _disposeEachAndDealloc(obj.data)
              // Create the new dataset.
              obj.data = _allocArray(obj.datasetSize*2)
            }
            if (i === undefined) i = 0
            for (const inSzs = [obj.inputSize], outSzs = [obj.outputSize], arr = obj.data; i < obj.datasetSize*2; ++i) {
              if (!(i & 1))
                arr[i] = isArray(obj.inputFunc) ? truncatedNormal(inSzs, ...obj.inputFunc) : obj.inputFunc(inSzs)
              if (i & 1)
                arr[i] = isArray(obj.outputFunc) ? truncatedNormal(outSzs, ...obj.outputFunc) : obj.outputFunc(inSzs, arr[arr.length-1])
            }
            _rememberToDispose(obj.data)
          }
        } catch (err) { if (err === interrupt) interrupt.stack.push(ls, i); else _disposeEachAndDealloc(obj.data), obj.data = null;  throw err }
      }
    },
  },

  merged:{
    docs:`\`merged Array\`: returns a copy of \`Array\` which is reference-equal to content-equal \`merged\` copies (and is read-only).
Maximizes memory re-use.`,
    interrupt:false,
    call(a) {
      if (!isArray(a)) error("Not an array:", a)
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
    todo:`\`zip:Array1⇒Array2⇒(Item1⇒Item2⇒Item)⇒Array\` for completeness of array-ops composition.`,
    readAt:{
      transform:_(`transform`),
      reverse:_(`reverse`),
      loop:_(`loop`),
      getFirst:_(`getFirst`),
      getLast:_(`getLast`),
    },
  },

  transform:{
    docs:`\`(transform Array Function)\`→\`Array\`: transforms each element of \`Array\` by applying \`Function\`, possibly also passing in \`Const\`.
(\`Array\` can also be a \`'string'\`, or the count of iterations.)
\`(transform (transform A F) G)\` is the same as \`(transform A \\(G (F ?)))\`.`,
    genDepthFirst:true,
    type:[
      _(`funcType`),
      [
        _(`arrayType`),
        `A`,
        `Length`,
      ],
      [
        _(`funcType`),
        `A`,
        `B`,
        `C`,
      ],
      `B`,
      [
        _(`arrayType`),
        `C`,
        `Length`,
      ],
    ],
    examples:[
      [
        `(transform (array 1 2 3 4 5 6) \\?+2)`,
        `3 4 5 6 7 8`,
      ],
      [
        `transform 10 \\?`,
        `0 1 2 3 4 5 6 7 8 9`,
      ],
      [
        `transform 10 a->b->a*b 5`,
        `0 5 10 15 20 25 30 35 40 45`,
      ],
    ],
    call(a,f,c) {
      if (!isArray(a) && typeof a != 'string' && typeof a != 'number')
        error("Expected an array or a string or a number but got", a)
      if (typeof f != 'function') error("Expected a function but got", f)
      let [result = _allocArray(typeof a != 'number' ? a.length : a), i = 0] = interrupt(2)
      try {
        for (; i < result.length; ++i)
          result[i] = f(typeof a != 'number' ? a[i] : i, c)
        return result
      } catch (err) { if (err === interrupt) interrupt.stack.push(result, i); else _disposeEachAndDealloc(result);  throw err }
    },
    dispose:_(`_disposeEachAndDealloc`),
    adjust:[
      _(`array`),
      [
        {
          call(a, f, c, dout) {
            let [dresult = _allocArray(typeof a != 'number' ? a.length : a), i = dresult.length] = interrupt(2)
            try {
              for (; i > 0; --i) {
                const ins = _allocArray(2); ins[0] = typeof a != 'number' ? a[i-1] : i-1, ins[1] = c
                try {
                  const dins = adjust(f, ins, null, dout[i-1])
                  if (!isArray(dins)) errorStack('bad adj', dins)
                  dresult[i-1] = dins[0];  dins[0] = null, _disposeEachAndDealloc(dins)
                } finally { _allocArray(ins) }
              }
              return dresult
            } catch (err) { if (err === interrupt) interrupt.stack.push(dresult, i); else _disposeEachAndDealloc(dresult);  throw err }
          },
          dispose:_(`_disposeEachAndDealloc`),
        },
        _(`_inA`),
        _(`_inB`),
        _(`_inC`),
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
      _(`funcType`),
      [
        _(`arrayType`),
        `A`,
        `Length`,
      ],
      [
        _(`arrayType`),
        `A`,
        `Length`,
      ],
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

  loop:{
    docs:`\`loop Array Accumulator Initial\`→\`Array\`: loops over the array left-to-right, setting \`Output.i\` to \`Accumulator(Array.i,where 0<i Output.(i-1) Initial)\` then returning \`Output\`.
\`Array\` can also be a \`'string'\`.

Use \`getLast(loop …?)\` to get the standard behavior of a functionality called \`reduce\`: returning the last accumulated result.
\`loop\` returns the whole array of all results, to facilitate adjustment and composition.`,
    genDepthFirst:true,
    type:[
      _(`funcType`),
      [
        _(`arrayType`),
        `A`,
        `Length`,
      ],
      [
        _(`funcType`),
        `A`,
        `B`,
        `B`,
      ],
      `B`,
      [
        _(`arrayType`),
        `B`,
        `Length`,
      ],
    ],
    examples:[
      [
        `loop (array 3 4 5 7) mul 1`,
        `3 12 60 420`,
      ],
      [
        `v:mapRead(m,?) m:{}
charEmb:\\select(equal v _notFound,\\mapWrite(m,?,varData(biasedGlorotNormal 16));v,\\v,?)
initial:randomVar(16)
stringShadow:\\getLast(loop(?,a->b->varAdam(charEmb(a))+b,initial))
repeat ^(f('potato')=f('knife');f('carrot')=f('tin');f('mushroom')=f('spoon')) 100 f:stringShadow
`,
      ],
      [
        `v:mapRead(m,?) m:{}
charEmb:\\select(equal v _notFound,\\mapWrite(m,?,varData(biasedGlorotNormal 16));v,\\v,?)
w:randomVar(40,24)
initial:randomVar(24)
stringShadow:\\getLast(loop(?,a->b->concat(array(varAdam(charEmb(a)),b),^(16 24))@w+b,initial))
(repeat ^(f('potato')=f('knife');f('carrot')=f('tin');f('mushroom')=f('spoon')) 100);await(callAdjust.'lastLoss') f:stringShadow
`,
      ],
    ],
    call(a, f, initial = 0) {
      if (!isArray(a) && typeof a != 'string') error("Expected an array or a string but got", a)
      if (typeof f != 'function') error("Expected a function but got", f)
      // This is a formulation without overwritten values, so that we can adjust easily.
      let [outs = _allocArray(a.length), i = 0] = interrupt(2)
      try {
        for (; i < a.length; ++i)
          outs[i] = f(a[i], i ? outs[i-1] : initial)

        // No need for `adjust` to preserve the output.
        const copy = _allocArray(outs.length)
        for (let i=0; i < outs.length; ++i) copy[i] = keep(outs[i])
        adjustSave(copy)

        return outs
      } catch (err) { if (err === interrupt) interrupt.stack.push(outs, i); else _disposeEachAndDealloc(outs);  throw err }
    },
    dispose:_(`_disposeEachAndDealloc`),
    adjust:{
      dispose(dins) { if (isArray(dins)) _disposeEachAndDealloc(dins[0]), dins[0] = undefined, _disposeEachAndDealloc(dins) },
      call(ins, _, dout = 0) {
        // Reverse the forward pass.
        const [a, f, initial] = ins
        let [da = _allocArray(a.length), outs, douts, i = a.length-1] = interrupt(4)
        if (outs === undefined)
          outs = adjustLoad(null) || null,
          (!isArray(outs) || outs.length != a.length) && _inexactReversal(true, outs)
        if (douts === undefined) {
          douts = _allocArray(a.length)
          for (let i=0; i < a.length; ++i) douts[i] = keep(dout[i]) || 0
        }
        try {
          let dinitial
          for (; i >= 0; --i) {
            let dins, ins = _allocArray(2); ins[0] = a[i], ins[1] = i ? outs[i-1] : initial
            try { dins = adjust(f, ins, outs[i], douts[i]) } finally { _allocArray(ins) }
            if (!isArray(dins) || dins.length != 2) errorStack('bad adjustment', dins)
            let grad
            if (i) [da[i], grad = 0] = dins
            else [da[i], dinitial = 0] = dins
            _allocArray(dins)
            if (i && grad && douts[i-1]) {
              const next = add(grad, douts[i-1]);  dispose(grad)
              dispose(douts[i-1]), douts[i-1] = next
            } else if (i && grad && !douts[i-1])
              douts[i-1] = grad
          }
          _disposeEachAndDealloc(outs), _disposeEachAndDealloc(douts)
          const arr = _allocArray(3)
          arr[0] = da, arr[2] = dinitial
          return arr
        } catch (err) {
          if (err === interrupt) interrupt.stack.push(da, outs, douts, i)
          else _disposeEachAndDealloc(da), _disposeEachAndDealloc(outs), _disposeEachAndDealloc(douts)
          throw err
        }
      },
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
      _(`funcType`),
      [
        _(`arrayType`),
        `A`,
        `Length`,
      ],
      `A`,
    ],
    argCount:1,
    call(arr) {
      if (!isArray(arr)) error("Not an array:", arr)
      if (call.pure) throw impure
      return adjustSave(arr.length), keep(arr[0])
    },
    dispose:true,
    interrupt:false,
    adjust:[
      _(`array`),
      [
        {
          dispose:_(`_disposeEachAndDealloc`),
          interrupt:false,
          call(dout) {
            // For `reverse`'s sake, we create a whole array instead of just its head.
            if (call.pure) throw impure
            const n = adjustLoad(null)
            if (typeof n != 'number') _inexactReversal(true, n)
            const darr = _allocArray(n)
            darr[0] = keep(dout)
            return darr
          },
        },
        _(`_dout`),
      ],
    ],
    mergeAdjustment:_(`_mergeArrays`),
  },

  getLast:{
    docs:`Given an array, returns its last item.`,
    type:[
      _(`funcType`),
      [
        _(`arrayType`),
        `A`,
        `Length`,
      ],
      `A`,
    ],
    argCount:1,
    call(arr) {
      if (!isArray(arr)) error("Not an array:", arr)
      if (call.pure) throw impure
      return adjustSave(arr.length), keep(arr[arr.length-1])
    },
    dispose:true,
    interrupt:false,
    adjust:[
      _(`array`),
      [
        {
          dispose:_(`_disposeEachAndDealloc`),
          interrupt:false,
          call(dout) {
            if (call.pure) throw impure
            const n = adjustLoad(null)
            if (typeof n != 'number') _inexactReversal(true, n)
            const darr = _allocArray(n)
            darr[n-1] = keep(dout)
            return darr
          },
        },
        _(`_dout`),
      ],
    ],
    mergeAdjustment:_(`_mergeArrays`),
  },
















  adjustLater:{
    docs:`\`adjustLater Func Inputs\`→\`(Result AdjustInfo)\`: look, just read what's to the left, I'm tired of explaining it.
\`AdjustInfo\` is for \`adjustNow\`. \`Inputs\` can be undefined or be an array.

A function \`defines\` this to be \`true\` to make \`autograd\` always call its \`adjust\` definition, even if no one cares about it.`,
    dispose(rai) { dispose(rai[0]), _destroyAdjustmentStack(rai[1]), _allocArray(rai) },
    call(fun, ins) {
      if (!call.env) error("Can only adjust in an execution env")
      const prevPredHap = predict.happened
      let adjInfo
      ;[adjInfo = _allocArray(0), predict.happened = false] = interrupt(2)
      const env = call.env, ias = _id(adjustSave), ial = _id(adjustLoad)
      const prevAdjSave = env[ias];  env[ias] = adjInfo
      const prevAdjLoad = env[ial];  env[ial] = undefined
      try {
        const result = !ins ? fun() : fun(...ins)
        if (!predict.happened)
          _destroyAdjustmentStack(adjInfo), adjInfo = null
        const a = _allocArray(2); a[0] = result, a[1] = adjInfo
        return a
      } catch (err) { if (err === interrupt) interrupt.stack.push(adjInfo, predict.happened); else _destroyAdjustmentStack(adjInfo);  throw err }
      finally {
        env[ias] = prevAdjSave
        env[ial] = prevAdjLoad
        predict.happened = prevPredHap
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
      const prevPredHap = predict.happened
      try {
        return !ins ? fun() : fun(...ins)
      } finally {
        env[ias] = prevAdjSave
        env[ial] = prevAdjLoad
        predict.happened = prevPredHap
      }
    },
  },

  adjustNow:{
    docs:`\`adjustNow AdjustInfo AdjustFunc Inputs Output OutputChange\`⇒\`InputsChanges\`: performs the adjustment step to improve \`predict\`ions.
\`AdjustInfo\` is consumed item-by-item, but not de-allocated.
Use \`_funcAdjust\` on the func passed to \`adjustLater\`.
\`OutputChange\` is usually \`0\` (\`predict\` inside should give gradients anyway). \`Inputs\` can be undefined.

(If something inside \`predict\`s a \`future\` that will only be available later, well, it's not available now.)`,
    readAt:{
      _funcAdjust:_(`_funcAdjust`),
    },
    call(adjInfo, fun, ins, out, dout = 0) {
      if (!isArray(adjInfo) || typeof fun != 'function') return _allocArray(0)
      const env = call.env, ias = _id(adjustSave), ial = _id(adjustLoad)
      const prevAdjSave = env[ias];  env[ias] = undefined
      const prevAdjLoad = env[ial];  env[ial] = adjInfo
      try {
        const dins = fun(ins, out, dout)
        if (dins !== undefined && (!isArray(dins) || dins.length > (!ins ? 0 : ins.length)))
          error("Expected an array like", isArray(ins) ? ins.slice() : '<empty>', "or undefined, got", dins, "from", fun)
        if (adjInfo.length) {
          _disposeEachAndDealloc(dins)
          _inexactReversal(false, "didn't load", ...adjInfo)
        }
        return dins
      } finally {
        env[ias] = prevAdjSave
        env[ial] = prevAdjLoad
      }
    },
    dispose:_(`_disposeEachAndDealloc`),
  },

  adjustUndo:{
    docs:`\`adjustUndo()\`→\`Mark\` or \`adjustUndo(Mark)\`: returns a mark, or clears all adjustment info since the mark.
"Forget about this."`,
    dispose:true,
    interrupt:false,
    call(mark) {
      const stack = call.env && call.env[_id(adjustSave)]
      if (!stack) return
      if (mark === undefined) return stack.length
      if (stack.length > mark)
        stack.splice(mark).forEach(_disposeEachAndDealloc)
    },
  },

  _input:{
    docs:`This returns the same unique object for the same \`n\` (an integer more than 0).`,
    call(n) { return (_input.o || (_input.o = []))[n] || (_input.o[n] = [readAt, _ins, n-1]) },
  },

  _funcTypeOf(t) {
    // `(conceptType call CallType)`→`CallType`, everything else is just returned.
    if (isArray(t) && t[0] === conceptType) {
      for (let i = 1; i < t.length; i += 2)
        if (t[i] === call)
          return t[i+1]
    }
    return t
  },

  madeType:{
    docs:`Literally exists just to expose \`make\` to generation.`,
  },

  autoFunc:{
    docs:`For internal use.
\`(autoFunc Type Body)\`: a function with an automatically-\`regenerate\`d \`Body\`.

Both its usage and structure is guided by human-defined \`Type\` and machine-learned \`Embeddings\`.

It does everything to reflect semantics of \`func\`s in neural computations: function inputs are passed in, and output is returned. Both {input and output} \`Embeddings\` guide generation both {outside and inside} the func (\`ArgUseAs\` computed in \`autoMake\`, and \`UseAs\` embeddings of the function or its input nodes). Same goes for \`Type\`.`,
    readAt:{
      typeAdjustmentMerger:_(`typeAdjustmentMerger`),
      typeDisposer:_(`typeDisposer`),
    },
    construct(x, obj) {
      if (x.length < 3) error("Too few args in", x)
      const tp = x[1], args = tp.length-2
      if (!isArray(tp) || tp[0] !== funcType) errorStack("Not a func type:", tp)
      if (obj === undefined) {
        obj = _fallthroughAutoFunc(args)

        const d = obj[defines.key] = Object.create(null)
        d[_id(deconstruct)] = x
        d[_id(argCount)] = args
        d[_id(type)] = tp

        // Infer adjustment mergers and disposer from types.
        d[_id(mergeAdjustment)] = tp.slice(1,-1).map(typeAdjustmentMerger)
        d[_id(dispose)] = typeDisposer(tp[tp.length-1])

        d[_id(adjust)] = [_adjustFunc, _ins, _dout] // Don't ever inline the adjustment.
        d[_id(adjustLater)] = true // Just assume that some nodes would need adjustment.
        return obj
      } else {
        // The rest is more-or-less copied from `func`.
        const d = obj[defines.key]
        if (d[_id(argCount)] !== args)
          error("Cannot change arg-count from", d[_id(argCount)], "to", args)
        d[_id(deconstruct)] = x
        d[_id(type)] = tp

        const inputs = _allocMap()
        for (let i = 1; i < args+1; ++i) inputs.set(_input(i), i)
        const body = x[2] !== null ? x[2] : [error, "Failed to generate a body for", obj]
        let [poIndRc = _postorderInfo(body, inputs), i = 0] = interrupt(2)
        try {
          // Compile ourselves.
          if (!autoWorld.objectWorld.has(obj)) error(obj, "is not in an", autoWorld)
          const aw = autoWorld.objectWorld.get(obj)
          const types = aw.NodeTypes[aw.objectIndex.get(obj)]
          obj.a = _compileAutograd(poIndRc, inputs, types, obj)
          obj.f = _compileBody(body, inputs, poIndRc, types, undefined, undefined, obj)
        } catch (err) {
          if (err === interrupt) interrupt.stack.push(poIndRc, i), poIndRc = null
          throw err
        } finally { _allocMap(inputs), poIndRc && defines(_postorderInfo, dispose)(poIndRc) }
      }
    },
  },

  _updateContextsWithFuncs:{
    docs:`Updates global func/value generative contexts to contain \`Funcs\`, each of which is either a black-box \`type\`-defining fixed-arg-count \`func\`/\`construct\`, or an object that \`defines\` \`type\` with the type, or typed-as-\`undefined\` values.

All of \`GenContexts\` are arrays \`(AreAllTheseCalls …? Value Type EmbedderTree …?)\`. Many contexts at once are present, to eliminate copying at regeneration. A function appears in two contexts, one as a call and one as a node, with the same \`Value\` and \`EmbedderTree\` but different \`Type\` (the output for calls, the \`funcType\` for nodes).`,
    interrupt:false,
    call(ctxF, ctxV, Funcs) {
      // Clear the type caches.
      alloc.world && alloc.world.HashFilter && alloc.world.HashFilter.delete(ctxF)
      alloc.world && alloc.world.HashFilter && alloc.world.HashFilter.delete(ctxV)
      alloc.world && alloc.world.CtxHashed && alloc.world.CtxHashed.delete(ctxF)
      alloc.world && alloc.world.CtxHashed && alloc.world.CtxHashed.delete(ctxV)

      if (!isArray(Funcs)) error("Expected an array of typed functions/values to use for generation, got", Funcs)
      const fn = new Set(Funcs)
      // Go through contexts, preserve the things in `Funcs`, and weed out the funcs that we don't need to add.
      let nextF = 1, nextV = 1
      for (let i = 1; i < ctxF.length; i += 3)
        if (fn.has(ctxF[i]))
          ctxF[nextF++] = ctxF[i], ctxF[nextF++] = ctxF[i+1], ctxF[nextF++] = ctxF[i+2]
      for (let i = 1; i < ctxV.length; i += 3)
        if (fn.has(ctxV[i]))
          ctxV[nextV++] = ctxV[i], ctxV[nextV++] = ctxV[i+1], ctxV[nextV++] = ctxV[i+2], fn.delete(ctxV[i])
      ctxF.length = nextF, ctxV.length = nextV
      // Add the funcs that contexts didn't have.
      for (let f of fn) {
        if (f === null) error("Not permitted:", f) // Fails in `autoMake` now cannot be faked by bad data.
        const tp = type(f)
        const EmbData = varData(alloc.params.NewEmbedding(alloc.params.FeatureSize))
        if (tp === null) error("Types cannot be null but got", tp, "of", f)
        pushToContext(ctxF, f, tp, EmbData)
        pushToContext(ctxV, f, tp, EmbData)
      }
    },
  },

  _equalizeContexts:{
    docs:`For the new object at index \`At\`, makes {object & base & world} contexts equal for all objects, and makes space for {local & temporary} contexts.

It is possible to have many contexts at once, to eliminate all the copying.
Local contexts share frozen arrays by default, so to change them, create new arrays for them.
A function appears in two contexts, one as a call and one as a value, with the same value/embedder but different \`Type\`.

\`Hyperparams.'Funcs'\` is an array.
\`Hyperparams.'GenContexts'\` is per-object array-of-contexts \`(ObjectF ObjectV  BaseF BaseV  WorldF WorldV  LocalF LocalV  TempF TempV)\`. Every context is either \`(true …? Func OutputType EmbData …?)\` or \`(false …? Value Type EmbData …?)\`.`,
    call(AutoWorld, At) {
      const HP = defines(AutoWorld, deconstruct)[1], OI = defines(AutoWorld, deconstruct)[2]
      const ctxss = OI.GenContexts
      // Set up object/base/world contexts (make them exactly the same array objects for all objects).
      if (!At) {
        if (ctxss[0] === undefined)
          ctxss[0] = [[true],[false], [true],[false], [true],[false]]
      } else {
        const a = ctxss[At-1], b = ctxss[At] || (ctxss[At] = _allocArray(10))
        if (!a) errorStack("Previous context is empty, at", At-1)
        if (!b) errorStack("Current context is empty, at", At)
        b[0]=a[0], b[1]=a[1], b[2]=a[2], b[3]=a[3], b[4]=a[4], b[5]=a[5]
      }

      // Update base contexts from Funcs if needed.
      const ctxs = ctxss[At], Funcs = HP.Funcs || definersOf(type)
      if (ctxs[3].length !== 1+Funcs.length*3)
        _updateContextsWithFuncs(ctxs[2], ctxs[3], Funcs)

      // Fill in inputs & temporary contexts if not present.
      //   (All temporary contexts share the same empty array. An object's `alloc` changes it with a new array if needed.)
      if (!_equalizeContexts.insF) _equalizeContexts.insF = Object.freeze([true]), _equalizeContexts.insV = Object.freeze([false])
      if (!ctxs[6])
        ctxs[6] = _equalizeContexts.insF, ctxs[7] = _equalizeContexts.insV, ctxs[8] = [true], ctxs[9] = [false]
    },
  },

  _createObjectHyperparams(AutoWorld, Hyperparams) {
    // Decipher hyperparams.
    const dd = defines(AutoWorld, deconstruct)
    if (!isArray(dd) || dd[0] !== autoWorld) errorStack("Expected an", autoWorld, "but got", AutoWorld)
    const HP = dd[1], OI = dd[2], At = OI.Object.length
    const a = _destructure(Hyperparams, autoWorld.hyper)
    for (let i=0; i < autoWorld.hyper.length; ++i)
      OI[autoWorld.hyper[i]][At] = a[i] !== undefined ? a[i] : HP[autoWorld.hyper[i]]
    if (OI.EmbData[At] === undefined) OI.EmbData[At] = varData(HP.NewEmbedding(HP.FeatureSize)) || null
    if (OI.Goal[At] === undefined) OI.Goal[At] = HP.Goals[randomNat(HP.Goals.length)]
    AutoWorld.DownEmb[At] = AutoWorld.UpEmb[At] = undefined, AutoWorld.dUpEmb[At] = 0
    AutoWorld.NodeTypes[At] = _allocMap(), AutoWorld.NodeEmbs[At] = _allocMap()
    // Fill in generative contexts too.
    _equalizeContexts(AutoWorld, At)
    return At
  },

  _fillObjectHyperparams(AutoWorld, At) {
    // Take object info from ObjectsInfo to alloc.params.
    if (AutoWorld === undefined) return
    const dd = defines(AutoWorld, deconstruct)
    if (!isArray(dd) || dd[0] !== autoWorld) errorStack("Expected an", autoWorld, "but got", AutoWorld)
    const OI = dd[2], p = alloc.params
    p.At = At
    for (let i=0; i < autoWorld.hyper.length; ++i)
      p[autoWorld.hyper[i]] = OI[autoWorld.hyper[i]][At]
  },

  createLocalContexts:{
    docs:`A type that wants an instance to be able to choose from a set of custom DAG funcs/values, \`defines\` this with a func.
The definition takes \`Type\` and \`EmbData\`, and must return something like \`((true …? Func OutputType EmbData …?) (false …? Value Type EmbData …?))\`, filled using \`pushToContext\`. It can use \`varData(alloc.'params'.'NewEmbedding' alloc.'params'.'FeatureSize')\`.`,
    call(Type, EmbData) {
      if (defines(Type, createLocalContexts)) {
        const r = defines(Type, createLocalContexts)(Type, EmbData)
        if (r === undefined) return
        if (!isArray(r) || r.length != 2) error("Expected 2 items, got", r)
        if (!isArray(r[0]) || r[0][0] !== true) error("Expected a func-context, got", r[0])
        if (!isArray(r[1]) || r[1][0] !== false) error("Expected a value-context, got", r[0])
        if (r[0].length > 1) alloc.params.GenContexts[6] = r[0]
        if (r[1].length > 1) alloc.params.GenContexts[7] = r[1]
        // The format is described in `_equalizeContexts`.
      }
    },
  },

  pushToContext:{
    docs:`\`pushToContext(Context, Node, Type, EmbData)\`→\`Context\`
Pushes to a generative context/environment.

\`Type\` possibly \`defines\` this.`,
    call(ctx, Node, Type, EmbData, noDefinitions = false) {
      Type = _funcTypeOf(Type)
      // If a call, care about the type's result, not the whole thing.
      if (ctx[0] && (!isArray(Type) || Type[0] !== funcType)) return ctx
      if (ctx[0]) Type = Type[Type.length-1]


      // Push, defined.
      if (!noDefinitions && typeof defines(Type, pushToContext) == 'function')
        defines(Type, pushToContext)(ctx, Node, Type, EmbData)
      else {
        // Clear/update the type caches, then actually push.
        const aw = alloc.world
        aw && aw.HashFilter && aw.HashFilter.delete(ctx)
        if (aw && aw.CtxHashed && aw.CtxHashed.has(ctx)) {
          const h = _typeHash(Type), cache = aw.CtxHashed.get(ctx)
          if (!cache.has(h)) cache.set(h, [ctx[0]])
          const S = cache.get(h)
          let indexes;  !aw.HashIndexes.has(S) && aw.HashIndexes.set(S, indexes = [])
          aw.HashIndexes.get(S)[(S.length-1)/3|0] = ctx.length
          S.push(Node, Type, EmbData)
        }
        ctx.push(Node, Type, EmbData)
      }
      return ctx
    },
  },

  _fillWorldContexts(HP, ctxF, ctxV) {
    // Push goals to the world's generative context of values.
    // Allow extracting vars into scopes, by pushing `bound` to ctxF.
    let [i = 0] = interrupt(1)
    try {
      const GoalType = futureType(_numberType)
      for (; i < HP.Goals.length; ++i)
        ctxV.push(HP.Goals[i], GoalType, varData(alloc.params.NewEmbedding(alloc.params.FeatureSize)))
      ctxF.push(bound, 'Var', varData(alloc.params.NewEmbedding(alloc.params.FeatureSize)))
    } catch (err) { if (err === interrupt) interrupt.stack.push(i);  throw err }
  },

  alloc:{
    docs:`\`alloc Type Hyperparams AutoWorld\`⇒\`Object\`: allocates an object that will be dynamically-\`regenerate\`d when we are \`using\` it.
\`Type\` must define both \`alloc\` and \`regenerate\`.
\`Hyperparams\` \`\`elemCollapse elemValue(elem 'text' stringToDoc('is a \`map\` that can contain \`Goal\`/\`EmbData\` and generation-guiding functions of \`autoWorld\`. \`{Goal future()}\` is likely the only one to specify.'),'These hyperparams define regeneration.
Let machine learning bring love and greatness to you.')\`\`
\`\`elemCollapse elem('text',stringToDoc "
Definitions will only be passed \`Type\`.
Read other info from \`alloc.'params'\` (which contains local \`GenContexts\`, object hyperparams, and \`autoWorld\`'s hyperparams).
Can \`alloc\`ate while allocating (don't pass \`AutoWorld\` for these situations); the resulting objects will be invisible to generation, and must be \`regenerate\`d manually.

(For bulk-allocation: if \`Hyperparams\` is an array, then \`Type\` is same-length array of types, and many objects are allocated but none are returned.)
")\`\``,
    readAt:{
      createLocalContexts:_(`createLocalContexts`),
      pushToContext:_(`pushToContext`),
    },
    call(Type, Hyperparams = null, AutoWorld) { // ⇒ Obj
      if (AutoWorld) {
        const dd = defines(AutoWorld, deconstruct)
        if (!isArray(dd) || dd[0] !== autoWorld) errorStack("Expected an", autoWorld, "but got", AutoWorld)
      }
      if (call.pure) throw impure

      // Bulk-allocate if requested.
      if (isArray(Hyperparams)) {
        if (!isArray(Type) || Type.length != Hyperparams.length) error("Bad bulk alloc")
        let [i = 0] = interrupt(1)
        try { for (; i < Type.length; ++i) alloc(Type[i], Hyperparams[i], AutoWorld);  return }
        catch (err) { if (err === interrupt) interrupt.stack.push(i);  throw err }
      }


      // Set up ZA WARUDO, fill the object in, and recurse (which must be overriden).
      if (typeof defines(Type, alloc) != 'function') error("Type must define", alloc, "but got", isArray(Type) ? Type.slice() : Type)
      if (typeof defines(Type, regenerate) != 'function') error("Type must define", regenerate, "but got", isArray(Type) ? Type.slice() : Type)
      let [At, obj, addedToCtxs = 0, EmbData] = interrupt(4)
      const prevWorld = alloc.world, prevParams = alloc.params, prevAt = alloc.At
      if (AutoWorld) alloc.world = AutoWorld, alloc.params = AutoWorld.params
      // …This `_createObjectHyperparams`-before-alloc is not robust to exceptions in `defines(Type, alloc)`.
      if (At === undefined) At = _createObjectHyperparams(alloc.world, Hyperparams)
      _fillObjectHyperparams(alloc.world, alloc.At = At)
      try {
        // Add the object to local/world contexts.
        if (addedToCtxs === 0) EmbData = varData(alloc.params.NewEmbedding(alloc.params.FeatureSize)), addedToCtxs = 1
        if (addedToCtxs === 1) createLocalContexts(Type, EmbData), addedToCtxs = !At ? 2 : 3
        if (addedToCtxs === 2) // If our first object, also push goals and loose-end funcs to world contexts (see `_equalizeContexts`).
          _fillWorldContexts(defines(alloc.world, deconstruct)[1], alloc.params.GenContexts[4], alloc.params.GenContexts[5]), addedToCtxs = 3
        if (!alloc.world.NodeCullMetricF[At]) alloc.world.NodeCullMetricF[At] = []
        if (!alloc.world.NodeCullMetricV[At]) alloc.world.NodeCullMetricV[At] = []

        // Consult the definition.
        if (obj === undefined) {
          obj = defines(Type, alloc)(Type, Hyperparams)
          if (!obj || typeof obj != 'object' && typeof obj != 'function') error("Expected a real modifiable object, got", obj)
        }
        if (autoWorld.objectWorld.has(obj))
          error("Newly-allocated object", obj, "must be exclusive but it already belongs to", autoWorld.objectWorld.get(obj))

        // Add the object to object contexts, if top-level.
        const OI = defines(alloc.world, deconstruct)[2], ctxs = alloc.params.GenContexts
        if (prevWorld === undefined) {
          const tp = _funcTypeOf(Type)
          if (isArray(tp) && tp[0] === funcType)
            alloc.world.objCtxIndexes[At*2] = ctxs[0].length, pushToContext(ctxs[0], obj, tp, EmbData, true)
          alloc.world.objCtxIndexes[At*2+1] = ctxs[1].length, pushToContext(ctxs[1], obj, tp, EmbData, true)
        }
        OI.Object[At] = obj, OI.Type[At] = Type, OI.EmbData[At] = EmbData // The exact index matters for this one.
        alloc.world.objectIndex.set(obj, At)
        if (obj && (typeof obj == 'object' || typeof obj == 'function'))
          autoWorld.objectWorld.set(obj, alloc.world)

        // If we are overcrowded, destroy half of the universe.
        if (OI.Object.length > defines(alloc.world, deconstruct)[1].MaxObjects)
          _awBulkDealloc(alloc.world)

        return obj
      } catch (err) { if (err === interrupt) interrupt.stack.push(At, obj, addedToCtxs, EmbData);  throw err }
      finally {
        if (AutoWorld) alloc.world = prevWorld, alloc.params = prevParams
        alloc.At = prevAt, _fillObjectHyperparams(prevWorld, prevAt)
      }

      // .world, .params, .At
    },
  },

  using:{
    docs:`\`using(Object)\`→\`Object\` or \`using(Object,AutoWorld)\`→\`Object\`
Prepares a dynamically-\`regenerate\`d \`Object\` (previously \`alloc\`ated in \`AutoWorld\`) for learned usage.
\`\`elemCollapse elem('text',stringToDoc "
This uses \`_embValue(EmbData)\` to provide the \`DownEmbedding\` to \`regenerate\`.
Regeneration is adjusted separately in \`callAdjust\`, so \`try\` can be used and the 'did we error' fact can be \`predict\`ed at regeneration.")\`\``,
    readAt:{
      regenerate:_(`regenerate`),
      _alwaysGenDepthFirst:_(`_alwaysGenDepthFirst`),
      _independentChoices:_(`_independentChoices`),
      _noTypeFiltering:_(`_noTypeFiltering`),
    },
    impure:true,
    call(obj, AutoWorld) {
      if (AutoWorld === undefined) {
        AutoWorld = autoWorld.objectWorld ? autoWorld.objectWorld.get(obj) : undefined
        if (AutoWorld === undefined) return obj
      }
      if (!isArray(defines(AutoWorld, deconstruct)) || defines(AutoWorld, deconstruct)[0] !== autoWorld)
        error("Expected an", autoWorld, "but got", AutoWorld)


      const OI = defines(AutoWorld, deconstruct)[2]
      let [At, AdjInfo, UpEmb] = interrupt(3)
      try {
        if (At === undefined) {
          At = _awIndex(AutoWorld, obj)
          if (AutoWorld.UpEmb[At] !== undefined) return obj // Don't regenerate the same object twice.
          if (AutoWorld.AdjInfo[At] !== undefined) error("Invariant violated, with", AutoWorld.AdjInfo[At], "of", obj)
        }
        // TODO: Instead of everything below, `AutoWorld.UpEmb[At] = 0` and `regen.requests.push(AutoWorld, At, null)`
        if (AdjInfo === undefined) {
          if (OI.Object[At] !== obj)
            error("Object position mismatched: expected", obj, "to be at", At, "but there we have", OI.Object[At])
          AutoWorld.NodeTypes[At].clear()
          AutoWorld.NodeEmbs[At].clear()

          AdjInfo = _allocArray(0)
        }
        const env = call.env, iu = _id(using), ias = _id(adjustSave), ial = _id(adjustLoad)
        const prevAdjSave = env[ias];  env[ias] = AdjInfo
        const prevAdjLoad = env[ial];  env[ial] = undefined

        const spotDiffers = alloc.world !== AutoWorld || alloc.At !== At
        const prevWorld = alloc.world, prevParams = alloc.params, prevAt = alloc.At
        alloc.world = AutoWorld, alloc.params = AutoWorld.params, alloc.At = At
        if (spotDiffers) _fillObjectHyperparams(AutoWorld, At)
        try {
          // Calc embedding and get object/type.
          if (AutoWorld.DownEmb[At] === undefined) AutoWorld.DownEmb[At] = _embValue(OI.EmbData[At])
          if (AutoWorld.DownEmb[At] === undefined) AutoWorld.DownEmb[At] = 0
          const Type = OI.Type[At]
          // Regenerate.
          if (UpEmb === undefined) {
            dispose(AutoWorld.UpEmb[At]), AutoWorld.UpEmb[At] = 0
            UpEmb = regenerate(AutoWorld.DownEmb[At], Type, obj)
            UpEmb === undefined && (UpEmb = 0)
          }
          if (typeof alloc.params.FinishObject == 'function')
            dispose(alloc.params.FinishObject(AutoWorld.DownEmb[At], b[0]))

          // Store the resulting `UpEmb`.
          AutoWorld.UpEmb[At] = UpEmb
          // Remember that we regenerated `obj`.
          if (!env[iu]) env[iu] = _allocMap()
          if (!env[iu].has(AutoWorld)) env[iu].set(AutoWorld, _allocArray(0))
          env[iu].get(AutoWorld).push(At)
          AutoWorld.AdjInfo[At] = AdjInfo
          return obj
        } catch (err) { if (err !== interrupt) _awObjectDontCare(AutoWorld, At);  throw err }
        finally {
          env[ias] = prevAdjSave, env[ial] = prevAdjLoad
          const spotDiffers = alloc.world !== prevWorld || alloc.At !== prevAt
          alloc.world = prevWorld, alloc.params = prevParams, alloc.At = prevAt, spotDiffers && _fillObjectHyperparams(prevWorld, prevAt)
        }
      } catch (err) {
        if (err === interrupt) interrupt.stack.push(At, AdjInfo, UpEmb)
        else AutoWorld.UpEmb[At] = undefined, _destroyAdjustmentStack(AdjInfo), dispose(UpEmb)
        throw err
      }
    },
  },

  _awObjectDontCare(aw, At) {
    dispose(aw.DownEmb[At]), aw.DownEmb[At] = undefined
    dispose(aw.UpEmb[At]), aw.UpEmb[At] = undefined
    dispose(aw.dUpEmb[At]), aw.dUpEmb[At] = 0
  },

  _adjustUsing(m, aw, ownerMap) {
    // This func is for `callAdjust` to call with just `call.env[_id(using)]`.
    //   It adjusts `using` calls.
    if (!m) return
    if (m instanceof Map) { // {AutoWorld → (At At At …?)}
      m.forEach(_adjustUsing)
      _allocMap(m)
    } else if (isArray(m)) { // (At At At …?)
      const OI = defines(aw, deconstruct)[2]
      const env = call.env, ias = _id(adjustSave), ial = _id(adjustLoad)
      const prevAdjSave = env[ias];  env[ias] = undefined
      const prevAdjLoad = env[ial];  env[ial] = 'per-object, down below'
      const prevWorld = alloc.world, prevParams = alloc.params, prevAt = alloc.At
      alloc.world = aw, alloc.params = aw.params
      let [stage = 0, dDownEmb, basicsAdjusted = 0] = interrupt(3)
      try {
        while (m.length) {
          const At = alloc.At = m[m.length-1]
          const ai = env[ial] = aw.AdjInfo[At]
          _fillObjectHyperparams(aw, At)
          try {
            switch (stage) {
              case 0:
                // Adjust `dispose(alloc.params.FinishObject(AutoWorld.DownEmb[At], b[0]))` if a func.
                if (typeof alloc.params.FinishObject == 'function') {
                  const a = _allocArray(2);  [a[0], a[1]] = [AutoWorld.DownEmb[At], AutoWorld.UpEmb[At]]
                  try {
                    const b = adjust(alloc.params.FinishObject, a, null, 0)
                    let due;  [dDownEmb, due = 0] = b;  _allocArray(b)
                    if (due) { const t = add(aw.dUpEmb[At] || 0, due || 0);  dispose(due);  dispose(aw.dUpEmb[At]), aw.dUpEmb[At] = t }
                  } finally { _allocArray(a) }
                }
              stage = 1;  case 1: {
                // Adjust `aw.UpEmb[At] = regenerate(aw.DownEmb[At], Type, obj)`.
                const a = _allocArray(3);  [a[0], a[1], a[2]] = [aw.DownEmb[At], OI.Type[At], OI.Object[At]]
                let b
                try { b = defines(regenerate, adjust)(a, null, aw.dUpEmb[At]) }
                finally { _allocArray(a) }
                if (!isArray(b)) error("Not an array:", b)
                if (b[0]) { const t = add(dDownEmb || 0, b[0] || 0);  dispose(b[0]);  dispose(dDownEmb), dDownEmb = t }
                _awObjectDontCare(aw, At)
              } stage = 2;  case 2:
                // Adjust `aw.DownEmb[At] = _embValue(OI.EmbData[At])`.
                const a = _allocArray(1);  a[0] = OI.EmbData[At]
                try { _disposeEachAndDealloc(defines(_embValue, adjust)(a, null, dDownEmb)) } // TODO: How can dDownEmb be undefined (in multi-func)?
                finally { _allocArray(a) }
                dispose(dDownEmb), dDownEmb = undefined
                // Check reversal exact-ness, and destroy the stack, and move on to the next object.
                if (ai.length) _inexactReversal(false, "didn't load", ...ai)
                _destroyAdjustmentStack(ai), aw.AdjInfo[At] = undefined, m.pop()
            }
          } catch (err) { if (err !== interrupt) _destroyAdjustmentStack(ai), aw.AdjInfo[At] = undefined, _awObjectDontCare(aw, At);  throw err }
        }
        if (basicsAdjusted === 0)
          _adjustLazyUseAs(), basicsAdjusted = 1
        if (basicsAdjusted === 1)
          _adjustLazyPos(), basicsAdjusted = 2
        _allocArray(m), ownerMap.delete(aw)
      } catch (err) {
        if (err === interrupt) interrupt.stack.push(stage, dDownEmb, basicsAdjusted)
        else dispose(dDownEmb)
        throw err
      } finally {
        env[ias] = prevAdjSave, env[ial] = prevAdjLoad
        alloc.world = prevWorld, alloc.params = prevParams, _fillObjectHyperparams(prevWorld, alloc.At = prevAt)
      }
    } else error("Got", m)
  },

  _awIndex:{
    docs:`\`_awIndex(AutoWorld,Object)\`→\`At\`
Returns the index of \`Object\` in \`AutoWorld\` if it is or was \`alloc\`ated there, or throws otherwise.
If it was deallocated, re-introduces it.`,
    call(aw, obj) {
      if (aw.objectIndex.has(obj)) return aw.objectIndex.get(obj)
      const HP = defines(aw, deconstruct)[1], OI = defines(aw, deconstruct)[2]
      if (!HP.Dealloc.has(obj)) errorStack(obj, "is not in", aw)

      const info = HP.Dealloc.get(obj);  HP.Dealloc.delete(obj)
      const At = OI.Object.length, h = autoWorld.hyper
      // Push to object contexts and remember the indexes.
      const ctxF = OI.GenContexts[0][0], ctxV = OI.GenContexts[0][1]
      if (h[0] !== 'Object' || h[1] !== 'Type' || h[2] !== 'EmbData') error("What is this shit:", h)
      if (isArray(info[1]) && info[1][0] === funcType)
        alloc.world.objCtxIndexes[At*2] = ctxF.length, pushToContext(ctxF, info[0], info[1], info[2], true)
      alloc.world.objCtxIndexes[At*2+1] = ctxV.length, pushToContext(ctxV, info[0], info[1], info[2], true)

      // Push to each hyperparam and restore the object index.
      for (let i=0; i < hyper.length; ++i) OI[hyper[i]][At] = info[i]
      aw.objectIndex.set(obj, At)
      return At
    },
  },

  _getWorstByMetric(metrics, limit) {
    // Returns an array of `true` for half of the worst objects, else `undefined`.
    if (limit !== undefined && metrics.length*2 <= limit) return null
    const sorted = _allocArray(metrics.length)
    for (let i=0; i < sorted.length; ++i) sorted[i] = i
    if (metrics.some(x => x != null))
      try { sorted.sort((i,j) => metrics[i]==null || metrics[j]==null ? 0 : await(metrics[i]) - await(metrics[j])) }
      catch (err) { if (err === interrupt) error("Didn't expect a promise without .result, but here we are, in", metrics);  throw err }
    sorted.length >>>= 1
    if (limit !== undefined && sorted.length > limit) sorted.length = limit

    const kill = _allocArray(metrics.length)
    for (let i=0; i < sorted.length; ++i)
      kill[sorted[i]] = true
    _allocArray(sorted)
    return kill
  },

  _genCtxFilterOut(ctx, kill, forEachMovedObject) {
    // Filters out objects for which `kill[N]` is `true`, in-place. Every preserved object gets `forEachMovedObject` called on it.
    if (kill === null) return
    if (typeof ctx[0] != 'boolean') error('Not a generative context:', ctx)

    // Clear the type caches.
    alloc.world && alloc.world.HashFilter && alloc.world.HashFilter.delete(ctx)
    alloc.world && alloc.world.CtxHashed && alloc.world.CtxHashed.delete(ctx)

    let k = 1
    for (let i = 1; i < ctx.length; i += 3)
      if (!kill[(i-1)/3|0])
        forEachMovedObject && forEachMovedObject(ctx[i], ctx[i+1], ctx[i+2], k),
        ctx[k++] = ctx[i], ctx[k++] = ctx[i+1], ctx[k++] = ctx[i+2]
    ctx.length = k
  },

  _awBulkDealloc:{
    docs:`Removes half of objects in an \`autoWorld\` from consideration. Perfectly balanced, as all things should be.
\`using\` any removed object will re-introduce it, with all info preserved.`,
    call(aw) {
      if (!isArray(defines(aw, deconstruct)) || defines(aw, deconstruct)[0] !== autoWorld)
        errorStack("Expected an", autoWorld, "but got", aw)
      const OI = defines(aw, deconstruct)[2], Metric = OI.Metric

      // This is just to prevent double-dealloc when 1+ Promise.alls have already been scheduled but none have returned yet.
      if (!_awBulkDealloc.count) _awBulkDealloc.count = new WeakMap
      _awBulkDealloc.count.set(aw, (_awBulkDealloc.count.get(aw) || 0) + 1)

      _awBulkDealloc.count.set(aw, (_awBulkDealloc.count.get(aw) || 0) - 1)
      if (_awBulkDealloc.count.get(aw)) return // One at a time please.

      // Get the set of objects to remove.
      const killO = _getWorstByMetric(Metric)

      // Remove the object from call/value object contexts.
      const objCtxF = OI.GenContexts[0][0], objCtxV = OI.GenContexts[0][1]
      // Get the set of removed-objects' indexes in call and value object contexts.
      const killF = _allocArray((objCtxF.length-1)/3|0), killV = _allocArray((objCtxV.length-1)/3|0)
      for (let i=0; i < killO.length; ++i)
        if (killO[i]) {
          const a = aw.objCtxIndexes[i*2], b = aw.objCtxIndexes[i*2+1]
          typeof a == 'number' && (killF[(a-1)/3|0] = true), typeof b == 'number' && (killV[(b-1)/3|0] = true)
        }
      // Filter out those indexes from call/value contexts, updating call/value indexes of the rest (aw.objCtxIndexes).
      _genCtxFilterOut(objCtxF, killF, (obj,T,E,k) => aw.objCtxIndexes[aw.objectIndex.get(obj)*2] = k), _allocArray(killF)
      _genCtxFilterOut(objCtxV, killV, (obj,T,E,k) => aw.objCtxIndexes[aw.objectIndex.get(obj)*2+1] = k), _allocArray(killV)

      const HP = defines(aw, deconstruct)[1], hyper = autoWorld.hyper
      // Filter out those indexes from ObjectInfos, updating object indexes (aw.objectIndex) of the rest.
      {
        let k = 0
        for (let i=0; i < OI.Object.length; ++i)
          if (!killO[i]) {
            for (let j=0; j < hyper.length; ++j)
              OI[hyper[j]][k] = OI[hyper[j]][i]
            aw.objCtxIndexes[k*2] = aw.objCtxIndexes[i*2]
            aw.objCtxIndexes[k*2+1] = aw.objCtxIndexes[i*2+1]
            aw.objectIndex.set(OI.Object[i], k++)
          } else {
            const obj = OI.Object[i]
            if (obj && (typeof obj == 'object' || typeof obj == 'function')) {
              // For each removed obj, remember its ObjectInfos slice.
              const info = _allocArray(hyper.length)
              for (let j=0; j < hyper.length; ++j)
                info[j] = OI[hyper[j]][i]
              HP.Dealloc.set(obj, info)
            }
            aw.objectIndex.delete(obj)
          }
        for (let j=0; j < hyper.length; ++j)
          OI[hyper[j]].length = k
        _allocArray(killO)
      }
    },
  },

  regenerate:{
    docs:`For internal use and/or definition.
\`DownEmbedding⇒Type⇒Object⇒UpEmbedding\`
Regenerates one object.

Makes objects exist not in a vacuum, but by delivering salience to choices.
Which allows questioning everything so that a better answer may eventually be found.
This regenerates instead of generating for the same reason that we have \`callAdjust\`/\`repeat\` and not just \`call\`.
\`\`elemCollapse elem('text',stringToDoc "
Reads \`alloc.'world'\` and \`alloc.'params'\`. Fill them.
\`Type\` of an object \`defines\` this with an \`adjust\`able func.
Read other info from \`alloc.'params'\` (which contains \`At\`/\`Object\`/\`Type\`/\`EmbData\`/\`GenContexts\`/\`Goal\`, and all hyperparams of the \`autoWorld\`).
Can \`regenerate\` while regenerating.")\`\``,
    readAt:{
      getDownEmbedding:_(`getDownEmbedding`),
      getUpEmbedding:_(`getUpEmbedding`),
      autoMake:_(`autoMake`),
    },
    adjust(ins, out, dout) {
      const [DownEmb, Type, Obj] = ins
      if (typeof defines(Type, regenerate) != 'function')
        error(Type, "must define", regenerate)

      const At = _awIndex(alloc.world, Obj)
      const prevAt = alloc.At;  alloc.At = At
      At !== prevAt && _fillObjectHyperparams(alloc.world, At)
      let [dm] = interrupt(1)
      try {
        // Adjust Metric's update.
        if (dm === undefined) {
          const mf = defines(alloc.world, deconstruct)[1].ObjectCullMetric
          if (mf) {
            const ins = _allocArray(2);  [ins[0], ins[1]] = [DownEmb, alloc.world.UpEmb[At]]
            try { dm = adjust(mf, ins, null, 0) || null }
            finally { _allocArray(ins) }
          } else dm = null
        }
        // DON'T add dUpEmb from Metric's update to `dout`'s. Who cares? It shouldn't even `predict` anything.
        // Adjust regeneration.
        const r = adjust(defines(Type, regenerate), ins, out, dout) || null
        // Add dDownEmb from Metric's update to the result's.
        if (dm && dm[0]) { const t = add(dm && dm[0] || 0, r[0] || 0);  dm && (dispose(dm[0]), dm[0] = null);  dispose(r[0]), r[0] = t }
        return r
      } catch (err) { if (err === interrupt) interrupt.stack.push(dm); else _disposeEachAndDealloc(dm);  throw err }
      finally { alloc.At = prevAt;  At !== prevAt && _fillObjectHyperparams(alloc.world, prevAt) }
    },
    impure:true,
    call(DownEmb, Type, Obj) {
      // Fill params and be overriden.
      if (call.pure) throw impure
      if (alloc.world === undefined) error(regenerate, "must be used inside", using)
      const At = _awIndex(alloc.world, Obj)

      const prevAt = alloc.At;  alloc.At = At
      At !== prevAt && _fillObjectHyperparams(alloc.world, At)
      let [UpEmb] = interrupt(1)
      try {
        // Regenerate.
        if (UpEmb === undefined)
          UpEmb = defines(Type, regenerate)(DownEmb, Type, Obj), UpEmb === undefined && (UpEmb = 0)

        // Update the object's Metric (fetch results later, replacing the promise; if we cull before that, old results will be used).
        const HP = defines(alloc.world, deconstruct)[1], OI = defines(alloc.world, deconstruct)[2]
        const mf = HP.ObjectCullMetric, m = mf && mf(DownEmb, UpEmb)
        if (_isDisposable(m)) {
          m.size !== 1 && error("Expected null or a number from", mf, "but got", m)
          const prev = _isPromise(OI.Metric[At]) ? OI.Metric[At].result : OI.Metric[At]
          OI.Metric[At] = m.data().then(r => OI.Metric[At] = OI.Metric[At].result = r), dispose(m)
          OI.Metric[At].result = prev
        } else if (m === null || typeof m == 'number') OI.Metric[At] = m
        else error("Expected null or a number from", mf, "but got", m)

        // Limit sizes of temporary contexts to MaxSavedNodes. Also filter out metrics themselves.
        const MSN = HP.MaxSavedNodes
        const F = alloc.world.NodeCullMetricF[At], killF = _getWorstByMetric(F, MSN)
        const V = alloc.world.NodeCullMetricV[At], killV = _getWorstByMetric(V, MSN)
        _genCtxFilterOut(OI.GenContexts[At][8], killF) // `_equalizeContexts`.
        _genCtxFilterOut(OI.GenContexts[At][9], killV)
        if (killF) {
          let n = 0
          for (let i=0; i < F.length; ++i) if (!killF[i]) F[n++] = F[i]
          F.length = n, _allocArray(killF)
        }
        if (killV) {
          let n = 0
          for (let i=0; i < V.length; ++i) if (!killV[i]) V[n++] = V[i]
          V.length = n, _allocArray(killV)
        }

        return UpEmb
      } catch (err) { if (err === interrupt) interrupt.stack.push(UpEmb); else dispose(UpEmb);  throw err }
      finally { alloc.At = prevAt;  At !== prevAt && _fillObjectHyperparams(alloc.world, prevAt) }

      // .world, .At
    },
    tutorial:[
      `No. \`tutorial(Types)\` and \`tutorial(Neural)\` first.`,
      [
        _(`fancier`),
        `🆗`,
        function() { return localStorage.Types === '1' && localStorage.Neural === '1' },
      ],
      `Programs and learning. The path lies open.
What draws you down it? Obligation? Curiosity? Or some hint of something greater?



If you've been around the block for a while, then you've seen your fair share of problems to be solved. As did I.
But, a finite subset of all possible problems is just too much to solve.
The only viable way is to solve every possible problem at once.
Solve special cases one-by-one, and you'll never be done.
So, how to do everything?

Every activity is essentially about modeling something else in a way that gives us more desirable properties than the target.
    Thought models the world so that it could predict and maximize.
    Types model proper usage so that we could guarantee correctness.
    Computation models processes so that we could run them on computers.
    And we could model a computation with \`adjust\`able \`Numeric\` operations so that we could learn whatever we want about it.

An interesting computation is computing computations: re-generating DAGs (\`autoMake\`) and code (\`func\`) and data (\`concept\`).

From \`make\` to \`autoMake\`…
Right here and now, let's highlight the {purpose} of this tutorial: to learn a (very simple) general framework from predicting wildly-varying data.
Only general intelligence can really do anything meta-circular (make a general model of self in self), so it's what we want.
I think that's what you're supposed to do with a programming language.
I don't know how we're gonna do that, but we're gonna do that.



(The following narrative mirrors the narrative for \`Types\` almost exactly.)

\`autoMake\` either {picks-and-returns a value} or picks a function/\`construct\` and recurses to generate its arguments.
To give this process structure, generation is augmented with embeddings: also given a \`tensor\` statically (attached to the value/func candidate), also given a \`tensor\` dynamically (wants), also return a \`tensor\` (is).

In particular, we go down-right-up:
    Down: any value/func will have its static/output embedding combined with the dynamic (wanted) embedding, and the max-\`Choose\` one is picked. \`ChoiceEmbedder\` creates the embedding context.
    Right: if making a call, we also generate func args, progressively combining the embedding context with the returned embeddings.
    Up: then we return the resulting embedding.

(You can read the \`docs\` of \`autoMake\` for details.)

That was an account of how we regenerate DAGs.
But the general case of arbitrary connectivity also includes cycles.
So how would we combine "take and return an embedding" with "has cycles"? We need a fixed point.
There are two ways: either do embedding on a cycle until it converges (for example, graph neural networks pass messages to settle on node embeddings), or specify "what that would converge to" directly.
We have the luxury of doing the latter. Every \`alloc\`ated function has its own embedding data (\`adjust\`able global variable) assigned to it.
\`\`elemCollapse elemValue(stringToDoc('(Of course, we can always make the static embedding be dependent on some string of characters that the system would have to pick in serialization and react to it in parsing in order to have any memory between resets. A whole culture can be built around this weird quirk. Imagine having to spend a lot of your time on "good descriptive names/\`docs\` for variables, functions, classes, objects, namespaces, concepts"; imagine having to learn GPT-3-scale models in order to just program. It''s much more efficient to expose embedders directly in one mind, for mutual calling and adjustment.)'),'Human societies try to approximate the global brain. But their evolution will never reach it. However, when re-doing the basics, it is possible to just skip to the end from the start. Just difficult.')\`\`

(Of course, instead of down-right-up, we can always linearize DAG nodes and attend over one global context. We will not, because \`\`elemCollapse elemValue(stringToDoc('this doesn''t reflect the generation of DAGs well. (GPT models generate sequences, so theoretically we could use them. But the most important thing about graphs is connectivity, and we would also need to give them positional embeddings. Count of possible paths in a DAG grows exponentially, so it''s infeasible to store an embedder for each, and consequently, unless we want a hacky solution that only works up to a fixed-but-nebulous depth such as natural language, we need another way to compute on DAGs. Which brings us right back to down-right-up schemes.)'),'Look beyond yourself. What do you see? Worse options? Then rebirth. Else name that beyond the new self. Such is transcendence.')\`\`.)



\`regenerate\` itself has \`DownEmbedding\`/\`UpEmbedding\`, and we have no idea how to give them a good \`adjust\`able use, so we won't actually be using \`regenerate\` directly.
Instead, we'll use conveniences:
    \`using\` (easy on-demand regeneration).
    \`autoWorld\` (similar to C++ memory allocators, but for regenerating memory).



So. What concretely do we do?
    First: create neural networks for each of \`autoWorld\`'s func hyperparameters, just like in \`tutorial Neural\`. \`Choose\` predicts externally-defined numbers, the rest are internal.
    Second: we have choices, which means that we need goals. Our usage must specify whatever an auto-generated function may want to know: execution time, exceptions.
    Third: \`repeat\`edly use an auto-generated function on a simple base. "No exceptions" and "the loss goes down" is how we know that there are no bugs.
    Fourth: gradually ramp up complexity of bases. No bugs anywhere, not just in simple cases.
    Fifth: reach infinite complexity by learning to generate general things, like a programming language interpreter.
    Sixth: go away.

Don't worry. Even if you're just a beginner now, you'll be readily staring down eldritch horrors of the beyond in no time.



First.

Shadowing funcs (different code branches count as different funcs, in \`select\` and in here), which we have already pre-determined by, you know, looking at generation long and hard. How to shadow?
Well, generality is always a good bet, so we'll just connect everything to everything with \`matMul\`, many times.
Just remember your training (\`tutorial Neural\`).

Program generation is a complicated process, and every sentence in its description adds a connection that we need to define and learn.
No way around it. Let's just hunker down and power through.

Also, to save on white-space here, uncheck: \`\`settings ^_expandTutorialBindings\`\` \`\`settings ^_expandTutorialBindings\`\` \`\`settings ^_expandTutorialBindings\`\` \`\`settings ^_expandTutorialBindings\`\` \`\`settings ^_expandTutorialBindings\`\`.`,
      [
        _(`fancier`),
        `fs:16`,
      ],
      `(Feature size, where a 'feature' is a learned number in a big \`tensor\`. \`fs\` is how many such numbers there are, the more the better. So make it a million, I dare you.)`,
      [
        _(`fancier`),
        `m:make`,
      ],
      `(All your training has led up to this: "everything evaluated is an array" allows "put \`make\` at the beginning of every array, to evaluate later".)`,
      [
        _(`fancier`),
        `mix:node->in->out->(m selu (m matMul (m selu (m matMul node (m randomVar in fs))) (m randomVar fs out)))`,
      ],
      `(Allow learning arbitrary-but-simple connections.)
(Putting everything through only two layers of \`matMul\` is kind of like saying that all users' thought processes are no longer than 2 brain cells, beyond the way of thinking that was taught to them. But is this really that far from the truth?)

See the "generation guidance" section of \`docs(autoWorld)\`: \`\`elemCollapse ?→docs(autoWorld)\`\`
(I do like how this makes my job of teaching every little corner-case cut out for me. Confused about some part? Just meditate on it and its args/result.)
\`\`elem 'hr'\`\`

There is… a lot to shadow. But neurally, it's all just \`concat\`enation of \`mix\`ed inputs, 2 brain cells each.
Also, a good trick in deep learning is skip-connections: \`matMul\` by small weights, like we have thanks to \`biasedGlorotNormal\`, biases everything toward \`0\`, which is only made worse by repeated \`matMul\`, resulting in a problem known as "vanishing gradients". So, just \`add\` an earlier input to bias toward identity.
We won't \`\`elemCollapse elemValue(elem('text',stringToDoc 'do, for example, \`add\` multiple \`mix\`es to train an ensemble of neural networks, for improved loss-performance and stability. Though this is not exactly what is called an ensemble in machine learning (there, you train them all separately and average predictions at test-time, meaning that we would need to modify hyperparam funcs in-place, which is just too clunky), you can probably do it on your own.'),'When looking at code, not even the sky is the limit.')\`\`

And, the slightly more special shadow: \`ChoiceEmbedder\`. Have to know what we chose. It cannot have a skip-connection because it returns an embedding context for a call's generation, which is not present in inputs.

And, the more special shadow: \`Choose\`. It needs to be \`max(GoalPredictions)=Goal;argmax(GoalPredictions)\`.
With it, we'll do what \`tutorial(Types)\` cannot: specify not just constraints on users, but users themselves.
We'll use deep Q learning (with branching/converging timelines): more than one \`matMul\` to \`predict\` and greedily \`max\`imize the Q-function. No exploration in its most basic form. It's so 2016, but still, we will honor all those who live in pain.
\`Choose\` predicts an external number, so it must not end in \`selu\` like \`mix\` here would impose. So, 1 more, special, brain cell.
It could also be denormalized like in \`tutorial Neural\` (\`Result*Norm+Bias\`), but, eh, too slow.

And assemble the \`Hyperparams\` for \`autoWorld\`, though without \`Funcs\`/\`Goals\` (or in other words, with every possible \`Funcs\`/\`Goals\`):`,
      [
        _(`fancier`),
        `mix2:0->1->(mix (m concat (m array 0 1) (m quote (m fs fs))) 2*fs fs)
mix3:0->1->2->(mix (m concat (m array 0 1 2) (m quote (m fs fs fs))) 3*fs fs)
Hyper:base->goals->(m map 'Funcs' base 'Goals' goals 'FeatureSize' fs 'Choose' (m func Goal StaticEmb DownEmb (m last (m predict (m max Result) Goal) (m argmax Result) Result:(m matMul (mix2 StaticEmb DownEmb) (m randomVar fs 1)))) 'ChoiceEmbedder' (m func StaticEmb DownEmb (mix2 StaticEmb DownEmb)) 'VarUsed' (m func StaticEmb DownEmb (m add StaticEmb (mix2 StaticEmb DownEmb))) 'FinishFail' (m func DownEmb (m add DownEmb (mix DownEmb fs fs))) 'FinishTypeError' (m func StaticEmb DownEmb (m add DownEmb (mix2 StaticEmb DownEmb))) 'FinishValue' (m func StaticEmb DownEmb (m add DownEmb (mix2 StaticEmb DownEmb))) 'ArgUseAs' (m func StaticEmb ArgPos (m add StaticEmb (mix2 StaticEmb ArgPos))) 'ArgEmbedder' (m func ArgStaticEmb DownEmb Ctx (m add DownEmb (mix3 ArgStaticEmb DownEmb Ctx))) 'ContextRefiner' (m func ArgDownEmb ArgUpEmb Ctx (m add Ctx (mix3 ArgDownEmb ArgUpEmb Ctx))) 'ArgFailed' (m func ArgDownEmb ArgUpEmb Ctx (m add ArgUpEmb (mix3 ArgDownEmb ArgUpEmb Ctx))) 'FinishCall' (m func DownEmb StaticEmb Ctx (m add DownEmb (mix3 DownEmb StaticEmb Ctx))))`,
        function() { return true },
      ],
      `Great job you did there. Pressing that button and all that? I can see your MIT education really pays for itself.



Second.

What's our ultimate interface?
We say what we want, we get a func, and we define it by using it.
In regular programming, "don't do this" is communicated through documentation and errors and experience. Here, we must turn that into numbers.

In argmax regime like we have (where the best is the only), each choice has a goal to maximize, and all choices of one object have one goal, though different objects may differ in goals.
On the top level, we can \`alloc\` an \`autoFunc\` with the main goal (like \`predict\`ing the result of \`prompt\`ing), and repeatedly call the func and set that goal.
But what about all the other sub-goals that we may want to optimize for: error-awareness, time-awareness?
To be clear, we're not giving up on the main goal, we're adding diversity by subverting it.
We need our agents here.

We'll use a simple strategy: in addition to making a func typed \`Type\` by composing \`Base\` to satisfy the main \`Goal\`, we'll have a bunch of \`future\`s that each object picks randomly at creation, pre-\`alloc\`ate those objects with random types (provided by \`TypesMaker\`, \`Count\` times), and \`setFuture\` their potential goals on usage.

We must also be wary of getting lost in eternal wanderings: \`A\` calling \`B\` and \`B\` calling \`A\` would cause an infinite loop. We have \`timeLimit\` to snap out of them.`,
      [
        _(`fancier`),
        `InitUsage:(concept docs "\`InitUsage Base Goal Type Count TypesMaker\`
In a new world that composes \`Base\`, this pre-\`alloc\`ates \`Count\` objects,
then returns an \`alloc\`ated one-arg func typed \`Type\` that maximizes \`Goal\`." call Base→Goal→Type→Count→TypesMaker→(
  alloc(transform(Count,i→T→apply(T),TypesMaker),transform(Count,i→null),aw);wrapUseOf(alloc(Type,m map 'Goal' Goal,aw),gNoError,gUser,gReal)
  wrapUseOf:fn→gNoError→gUser→gReal→(m func arg m(last,m(using,fn),m(try,limited,errored,arg,m userTime,m realTime))
    limited:m(func,Arg,UserStart,RealStart,m last f m(setFuture,gNoError,1) u r f f:m(timeLimit,200,fn,Arg))
    errored:m(func,Error,Arg,UserStart,RealStart,m last m(setFuture,gNoError,-1) u r Error)
    u:m(setFuture,gUser,m sub 0 m(userTime,UserStart))
    r:m(setFuture,gReal,m sub 0 m(realTime,RealStart))
  )
  gNoError:m(future)
  gUser:m(future)
  gReal:m(future)
  aw:(m autoWorld (Hyper Base (m Goal gNoError gUser gReal m(future))))
))`,
        function() { return true },
      ],
      `I don't like this verbosity any more than you do, but that's the price for doing programming, even machine learning: inability to hide in "you'll figure the details out".
Even UI is getting stretched to its limit. It's an opportunity to improve it.
The die is cast, and we can do nothing but advance.



Third.

A cat is neither dead nor alive nor a cat until observed.
We must prove that we can manipulate the outcome to be what we want.

Using this customary learning rate, naturally: \`\`settings ^_learningRate\`\`.

Though, a sanity check before that:`,
      [
        _(`fancier`),
        `repeat ^(start;display(Result,r);display(UserTime,userTime(start));setFuture(goal,r) start:userTime() r:(where equal(fn(0),'ok') 1 0)) 1000
fn:static(InitUsage ^((concept type 0⇒1 call ?→'bad') (concept type 0⇒1 call ?→'ok')) goal 0⇒1 100 ?→(rn(2)⇒rn(2)⇒rn(2))) rn:randomNat goal:future()`,
        // TODO: Run & fix.
      ],
      `What can we see from this trivialized example?

Slow.
Loss spikes to \`1e10\` sometimes (should \`clip\` embeddings, probably in \`mix\`).
Sometimes explores nothing and gets stuck at \`0\`. Argmax only has a limited creativity budget: once embeddings stop changing, exploration stops.`,
      [
        _(`fancier`),
        `print(fn);(repeat ^(setFuture(alive,where equal(r,'ok') 1 -1);r r:await(fn(0))) 10000)
fn:static(InitUsage ^((concept type 2⇒1 call ?→'no such arg') (concept type 1⇒1 call ?→error('bad')) (concept type 1⇒1 call ?→await(?);delay('ok',50)) (concept type 0⇒1 call ?→'hoh')) alive 0⇒1 10 ?→(rn(2)⇒rn(2)⇒rn(2))) rn:randomNat alive:future()`,
        // TODO: Run & fix.
      ],
      `Dozens of bugs \`\`elemCollapse elemValue(elem 'text' 'had to be worked through in order to bring this to you… For regular people, heaven is a place where there is no suffering and no discord. For programmers, heaven is where there is no bug-fixing after coding an idea. If native imagination were to include that code directly instead of through intermediaries like hands, it could be achieved. But for now, for all the happiness that you wish on someone, someone else gets cursed with equal misery, of having to implement and debug those ideas. ["Needlessly sensationalist."]
To bring this to you, so many bugs had to be ironed out. But whereas animals can at best develop resistances to things they hate, humans can completely eradicate them by controlling their environment. So I made some diagnostic tools to help myself. ["Needless generalization."]
It''s easy to whine, instead I do the fixing','oh please')\`\`: \`\`settings ^_debugLastInterrupt\`\`, \`\`settings ^_debugAdjustSave\`\`.
And because in machine learning, inefficiency is a bug, a rewrite \`\`elemCollapse elemValue(elem 'text' stringToDoc('(to decrease stalling time of \`sync\`s by interleaving regenerations). The implementation now looks like a proper language core (in my implementation): a few global passes, long-winded, and barely-comprehensible, especially with your two brain cells.
I stopped time to fix ??? bugs.'),'I feel like I lost a piece of myself. Again. Funny: all the pieces add up to many hundred percent. I guess loss is meaningless near creation.')\`\`



Fourth.
Are we going toward a specific goal with all this? No. Every road will lead us to a memory of great days.
// TODO: To incentivize exploration, do random network distillation (adding prediction loss to reward).
  // We want *post-action* states that have not been seen before (which translates to "where a random NN of post-action state is mispredicted"), so we need to call \`ChoiceEmbedder\` in \`Choose\`: so, something like \`max(curious)=Goal;minimize(unknown);argmax(curious) curious:GoalPred+unknown unknown:loss2(m1,m2) postState:ChoiceEmbedder(StaticEmb,DownEmb) m1:mix(postState,fs,fs) m2:mix(postState,fs,fs)\` but with correct tensor dimensions (so, \`loss2\` could probably be better).
  // …And maybe, we actually want to maximize unknown-ness of not just the resulting state but resulting-state-given-input-state, so, \`m1:mix3(StaticEmb,DownEmb,postState)\`.



Fifth.

The one fundamental operation of a programming language is execution ("do this"): \`call\`/\`callAdjust\`.

We need to shadow it properly. In particular, doing the same thing should result in the same embeddings, and different things should be different.
\`\`elemCollapse elemValue(elem('text',stringToDoc '
This would make equivalent programs equivalent, and similar programs close (but still distinct), by automatically discovering useful things like mathematical equalities and partial evaluation and program optimization.
When fine-tuning for a particular human use after this, learning can quickly skip over irrelevant semantic classes, or spend time picking the best semantically-similar thing.
'),'The only questions are: do we have enough will to implement it, and do we have enough compute to learn anything meaningful. Do you?')\`\`

Let's construct a staircase that captures ever more correlations.

👂 In the last example, we ensured this via \`predict\`ing+\`max\`imizing \`equal(r,'ok')\` because there are only two results that we care about. How narrow-minded.

👀 In general (without overfitting to a particular use), we want a contrastive learning objective at the top-level, where \`equal\` results are \`predict\`ed to have the same embeddings (\`innerProduct=1\`), and others are \`predict\`ed to have different embeddings (\`innerProduct=0\`).

    🐌 To capture numeric similarities, we can \`predict\` \`softEqual(result0,result1)\`. \`\`elemCollapse elemValue(elem('text',stringToDoc '(For example, \`.1+.2\` is not \`equal\` to \`.3\`. For implementation reasons, \`tensor\` objects with the same values are not reference-equal either.)'),'Have a snack. It is optimal to eat the flesh of your brethren, insect. 🐛')\`\`

    🦗 To capture structure better, we can have an embedder of arbitrary values, use that on inputs/outputs to get their learnable embeddings, and have a neural network (\`mix\`) from the top-level function's \`DownEmbedding\`/\`UpEmbedding\` and inputs' embeddings to a \`predict\`ion of output embedding. \`\`elemCollapse elemValue(elem('text',stringToDoc '(For that, we would need to handle perfectly, in order of increasing difficulty: built-in stand-alone objects, array DAGs, strings, object graphs, arbitrarily-sized-\`tensor\` numerics. I know that the best is supposed to be the only, but this is just far too complicated and compute-intensive to be the best at this stage.)'),'Ohhh nooo')\`\`

🧠 To capture more, we can do this constrasting at every \`autoFunc\`tion, though only contrast outputs from equal inputs. \`\`elemCollapse elemValue(elem('text',stringToDoc '((The \`FinishObject\` hyperparam of \`autoWorld\` is where we would put it, and actual collection of inputs/output pairs could be handled by \`autoFunc\` or something.)'),'Ah yes, transcendent galaxy-brain.')\`\`

Each step up this staircase is an increase in required development time, compute, and memory. We'll go as far as we can before dying from overwork.

\`\`elemCollapse stringToDoc('
// TODO: Have \`softEqual(a,b)\` that returns a number: 1 if graphs are equal (or the mult of probabilities), 0…1 for same-shape numbers/tensors (1 if equal, 0 at a distance controlled by a setting which is 1.0 by default), 0 otherwise.
// TODO: Make inner-product between the current UpEmb and previous UpEmbs predict \`softEqual(curResult,prevResult)\`. See.
// TODO: Have \`mergeDAG(x)\` (each item \`merged\`, and tensors turned into strings).
// TODO: Put \`UpEmb\`s into a LRU Map from \`mergeDAG\` of ins+out to \`UpEmb\`s, and make inner-product predict hard equality.
//   (See whether we can learn the same things.)

// TODO: Give all typed functions to regen (be whole-world).

Sixth. // TODO: With self-awareness trained, give examples of fine-tuning:
  // TODO: Have a human-reward-predictor, which is allowed to \`predict\` a \`prompt\` only when a setting is checked (otherwise, just \`repeat\`).
  // TODO: \`tutorial call\`''s tree interpreter really is really simple, so, learn to imitate execution from examples (goal is 1 if equal, 0 if not).
  // TODO: Show that this can learn a func that minimizes "predict output from input": try to learn a NN, for an arbitrary (auto) dataset. Diversity should be all we need. (This would test our saved-nodes implementation, which is a good excuse to explain reward hacking.)
')\`\`
`,
    ],
  },

  DAGType:{
    merged:true,
    docs:`\`(DAGType Type)\` or \`(DAGType Type GivenValues GivenTypes GivenEmbData)\`
The type of DAGs (with at least one array) with the output typed as \`Type\`.
Can be given typed values to possibly use during generation.`,
    typeRefine(a,b) {
      if (!isArray(a) || a[0] !== DAGType) return null
      if (!isArray(b) || b[0] !== DAGType) return null
      return [DAGType, typeRefine(a[1], b[1]), a[2], a[3], a[4]]
    },
    createLocalContexts(Type, EmbData) {
      if (!isArray(Type[2])) return
      if (!isArray(Type[3]) || Type[2].length != Type[3].length) error("Mismatch between", Type[2], "and", Type[3])
      if (!Type[4]) Type[4] = _allocArray(Type[2].length)
      const ctxF = [true], ctxV = [false]
      for (let i = 0; i < Type[2].length; ++i) {
        const v = Type[2][i], t = _funcTypeOf(Type[3][i])
        const e = Type[4][i] || (Type[4][i] = varData(alloc.params.NewEmbedding(alloc.params.FeatureSize)))
        pushToContext(ctxF, v, t, e)
        pushToContext(ctxV, v, t, e)
      }
      return [ctxF, ctxV]
    },
    alloc(Type) { return isArray(Type) ? ['<generated DAG>'] : error("Not an array:", Type) },
    regenerate:{
      // TODO: Instead of defining this, define `regen(DownEmb, DownType, DownObj)` to `return regenOne(DownEmb, Type[1])` (and adjusting it) and `regenFinish(UpEmb, UpType, UpObj, Obj)` to `!isArray(UpObj) && error(…);  writeAt(Obj, undefined, UpObj)`.
      call(DownEmb, Type, Obj) { // ⇒ UpEmb
        // Refer to `autoMake` to replace `Obj`'s contents (or `Obj` itself if was/became a non-array).
        if (!isArray(Obj) || Object.isFrozen(Obj)) error(DAGType, "needs mutable arrays but had", Obj)
        const b = autoMake(DownEmb, Type[1])
        let [UpEmb, UpType, UpObj] = b;  _allocArray(b) // Ignore the resulting type.
        if (!isArray(UpObj)) error(DAGType, "expects arrays but got", UpObj)
        writeAt(Obj, undefined, UpObj)
        return UpEmb
      },
      adjust(ins, _, dout) {
        // Adjust `[UpEmb] = autoMake(DownEmb, Type[1])`. No need to give it the type.
        const d = _allocArray(1);  d[0] = dout
        try { return defines(autoMake, adjust)(ins, null, dout) }
        finally { _allocArray(d) }
      },
    },
  },

  _sortConceptType(T) {
    // Sort keys by _id for consistency.
    if (!isArray(T) || T[0] !== conceptType || !(T.length&1)) error("Expected a concept type but got", T)
    if (Object.isFrozen(T)) return
    let ok = true
    // Go through keys, and if none are out of order, return early.
    for (let i = 3; i < T.length; i += 2)
      if (_id(T[i-2]) > _id(T[i])) { ok = false; break }
    if (ok) return
    const a = new Array(T.length>>>1).fill().map((_,i) => i).sort((a,b) => _id(T[a*2+1]) - _id(T[b*2+1]))
    const k = new Array(T.length>>>1).fill().map((_,i) => T[i*2+1])
    const v = new Array(T.length>>>1).fill().map((_,i) => T[i*2+2])
    T.length = 1
    for (let i=0; i < k.length; ++i)
      T.push(k[a[i]], v[a[i]])
  },

  conceptType:{
    merged:true,
    docs:`\`(conceptType Key1 Value1 Key2 Value2 …? …?)\`: the type of dynamic \`concept\`s.`,
    call(...x) { return x.unshift(conceptType), _sortConceptType(x), merged(x) },
    map:true,
    typeRefine(a,b) {
      // Refine each definition.
      if (!isArray(a) || a[0] !== conceptType || !isArray(b) || b[0] !== conceptType || a.length != b.length) return null
      _sortConceptType(a), _sortConceptType(b)
      let [r = _allocArray(a.length), i = 1] = interrupt(2)
      try {
        for (; i < a.length; i += 2) {
          if (a[i] !== b[i]) return _allocArray(r), null
          r[i] = a[i]
          r[i+1] = typeRefine(a[i+1], b[i+1])
          if (r[i+1] === null) return _allocArray(r), null
        }
        return r
      } catch (err) { if (err === interrupt) interrupt.stack.push(r, i); else _allocArray(r);  throw err }
    },
    alloc(Type, Hyperparams) {
      // Alloc each definition.
      _sortConceptType(Type)
      let [x = _allocArray(Type.length), i = 1] = interrupt(2)
      try {
        x[0] = concept
        for (; i < Type.length; i += 2)
          x[i] = Type[i], x[i+1] = alloc(Type[i+1], Hyperparams)
        const obj = construct(x)
        construct(x, obj)
        Object.freeze(obj)
        return obj
      } catch (err) { if (err === interrupt) interrupt.stack.push(x, i);  throw err }
    },
    regenerate:{
      // TODO: …Adapt to calling `regenMany` at the end of `regen` — and somehow, get its gradients back…
      call(DownEmb, Type, Obj) { // → UpEmb & Obj
        // Use `_genExpr` here to do our work for us.
        let [i = 1, Node, Positions, DefValues, DefTypes, UseAs, EmbCtx, TypeCtx] = interrupt(8)
        try {
          // conceptType A B C D E F  -->  funcType B D F (conceptType A B C D E F)
          if (DefTypes === undefined) {
            DefTypes = _allocArray(((Type.length+1)>>>1) + 1)
            DefTypes[0] = funcType, DefTypes[DefTypes.length-1] = Type
            for (let j = 1; j < Type.length; j += 2) DefTypes[(j+1)>>>1] = Type[j+1]
            DefValues = _allocArray(DefTypes.length-2)
            const dec = defines(Obj, deconstruct)
            for (let j = 1; j < Type.length; j += 2) DefValues[(j-1)>>>1] = dec[j+1]
          }
          // `Positions` is filled with embedders of defined concepts, not default positional embedders.
          if (Positions === undefined) Positions = _allocArray(DefTypes.length-1)
          const Def = alloc.params.Definitions
          for (; i < Type.length; i += 2) {
            if (!Def.has(Type[i])) Def.set(Type[i], varData(alloc.params.NewEmbedding(alloc.params.FeatureSize)))
            Positions[(i+1)>>>1] = Def.get(Type[i])
          }

          // Calc `UseAs` and `EmbCtx`, and `TypeCtx`.
          if (UseAs === undefined) {
            if (!Def.has(Obj)) Def.set(Obj, varData(alloc.params.NewEmbedding(alloc.params.FeatureSize)))
            UseAs = _embValue(Def.get(Obj)), UseAs === undefined && (UseAs = 0)
          }
          if (EmbCtx === undefined)
            EmbCtx = alloc.params.ChoiceEmbedder(UseAs, DownEmb), EmbCtx === undefined && (EmbCtx = 0)
          if (TypeCtx === undefined)
            TypeCtx = _allocMap()
          if (Node === undefined) Node = _allocArray(DefValues.length+1).fill(), Node[0] = 'concept thingy, man'

          // Get our definitions.
          const b = _genExpr(UseAs, EmbCtx, DefTypes, TypeCtx, Node, true, DownEmb, Type, Positions, DefValues)
          _allocMap(TypeCtx), TypeCtx = null
          const s = _allocArray(2);  [s[0], s[1]] = [UseAs, EmbCtx];  adjustSave(s), UseAs = EmbCtx = null
          _allocArray(Positions), _allocArray(DefTypes)

          const [UpEmb] = b;  _allocArray(b)
          return UpEmb
        } catch (err) {
          if (err === interrupt) interrupt.stack.push(i, Node, Positions, DefValues, DefTypes, UseAs, EmbCtx, TypeCtx)
          else _killArray(Positions), _killArray(DefValues), _killArray(DefTypes), dispose(UseAs), dispose(EmbCtx), TypeCtx && _allocMap(TypeCtx)
          throw err
        }
      },
      adjust(ins, _, dout) {
        const [DownEmb, Type, Obj] = ins
        let [i = 1, Positions, UseAs, EmbCtx, dUseAs, dEmbCtx, dDownEmb] = interrupt(7)
        try {
          if (UseAs === undefined) { const b = adjustLoad(2);  [UseAs = 0, EmbCtx] = b;  _allocArray(b) }
          // `Positions` is filled with embedders of defined concepts, not default positional embedders.
          if (Positions === undefined) Positions = _allocArray((Type.length+1)>>>1)
          const Def = alloc.params.Definitions
          for (; i < Type.length; i += 2) {
            if (!Def.has(Type[i])) error("But we created this on call, where did the type's embedding go:", Type[i], "in", Defs)
            Positions[(i+1)>>>1] = Def.get(Type[i])
          }

          // Adjust `const [UpEmb] = _genExpr(UseAs, EmbCtx, DefTypes, _allocMap(), ['concept thingy, man'], true, DownEmb, Type, Positions, ?)`
          if (dDownEmb === undefined) {
            const a = _allocArray(8)
            ;[a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]] = [UseAs, EmbCtx, null, null, null, true, DownEmb, Positions]
            const d = _allocArray(1);  d[0] = dout
            try {
              const b = defines(_genExpr, adjust)(a, null, d)
              dUseAs = b[0] || 0, dEmbCtx = b[1] || 0, dDownEmb = b[5] || 0;  _allocArray(b)
            } finally { _allocArray(d), _allocArray(a) }
          }
          // Adjust `EmbCtx = alloc.params.ChoiceEmbedder(UseAs, DownEmb) || 0`
          if (dEmbCtx !== undefined) {
            let b, a = _allocArray(2);  [a[0], a[1]] = [UseAs, DownEmb]
            try { b = adjust(alloc.params.ChoiceEmbedder, a, null, dEmbCtx) }
            finally { _allocArray(a) }
            if (b[0]) { const t = add(dUseAs || 0, b[0] || 0);  dispose(b[0]);  dispose(dUseAs), dUseAs = t }
            if (b[1]) { const t = add(dEmbCtx || 0, b[1] || 0);  dispose(b[1]);  dispose(dEmbCtx), dEmbCtx = t }
            _allocArray(b)
            dEmbCtx = undefined
          }
          // Adjust `UseAs = _embValue(Def.get(Obj)) || 0`
          if (dUseAs !== undefined) {
            const a = _allocArray(1);  a[0] = Def.get(Obj)
            try { _disposeEachAndDealloc(adjust(_embValue, a, null, dUseAs)), dUseAs = undefined }
            finally { _allocArray(a) }
          }
          dispose(UseAs), dispose(EmbCtx)
          const r = _allocArray(1);  r[0] = dDownEmb;  return r
        } catch (err) {
          if (err === interrupt) interrupt.stack.push(i, Positions, UseAs, EmbCtx, dUseAs, dEmbCtx, dDownEmb)
          else Positions && _allocArray(Positions), dispose(UseAs), dispose(EmbCtx), dispose(dUseAs), dispose(dEmbCtx), dispose(dDownEmb)
          throw err
        }
      },
    },
  },

  _alwaysGenDepthFirst:[
    _(`settings`),
    false,
    `Whether \`autoMake\` should pretend that all functions define \`genDepthFirst\`.
The lack of this affects semantics (making children unable to depend on siblings).
This is much easier to follow than the GPU-parallelized version.`,
  ],

  getDownEmbedding:{
    docs:`In an \`autoFunc\`, returns the object's DownEmb. Currently NOT auto-added by \`_fillWorldContexts\` (\`FinishObject\` should be enough).`,
    call() {
      if (!autoFunc.now) return 0
      const aw = autoWorld.objectWorld.get(autoFunc.now)
      const OI = defines(aw, deconstruct)[2], At = _awIndex(aw, autoFunc.now)
      return _embValue(OI.EmbData[At]) || 0
    },
    dispose:true,
    adjust(_, __, dout) {
      const aw = autoWorld.objectWorld.get(autoFunc.now)
      const OI = defines(aw, deconstruct)[2], At = _awIndex(aw, autoFunc.now)
      const a = _allocArray(1);  a[0] = OI.EmbData[At]
      try { _disposeEachAndDealloc(adjust(_embValue, a, null, dout)) }
      finally { _allocArray(a) }
    },
    argCount:0,
  },

  getUpEmbedding:{
    docs:`In an \`autoFunc\`, returns the object's UpEmb. Currently NOT auto-added by \`_fillWorldContexts\` (\`FinishObject\` should be enough).`,
    call() {
      if (!autoFunc.now) return 0
      const aw = autoWorld.objectWorld.get(autoFunc.now)
      const OI = defines(aw, deconstruct)[2], At = _awIndex(aw, autoFunc.now)
      return keep(aw.UpEmb[At])
    },
    dispose:true,
    adjust(_, __, dout) {
      const aw = autoWorld.objectWorld.get(autoFunc.now)
      const OI = defines(aw, deconstruct)[2], At = _awIndex(aw, autoFunc.now)
      if (dout) {
        const next = add(aw.dUpEmb[At], dout)
        dispose(aw.dUpEmb[At]), aw.dUpEmb[At] = next
      }
    },
    argCount:0,
  },

  autoMake:{
    docs:`For internal use, inside \`DAGType\`/\`funcType\` inside \`regenerate\`.
\`autoMake:DownEmbedding⇒DownType⇒(UpEmbedding&UpType&DAG)\`
Generates a Directed Acyclic Graph from what is available in \`GenContexts\` (likely in \`alloc.'params'.'Funcs'\`).
This DAG is limited in size by \`MaxDAGNodes\` and \`MaxDepth\`.

This is a user-study of all possible users of our DAG IR, and a guide.
We need \`Types\` to not waste time generating invalid programs, but they are not enough.
We need \`Neural\` to replace random choices (a big no-no) with intelligent choices (a big oh-yes).

Generation propagates "what we need" information top-down, then propagates "what we got" left-right for \`call\`s/\`construct\`s, then returns "what we \`make\`" bottom-up.
Generation is guided by human-specified \`HaveType\`&\`DownType\`→\`UpType\` and machine-learned \`UseAs\`&\`DownEmbedding\`→\`UpEmbedding\`.
Fully \`adjust\`able like MuZero for a programming language.

This uses hyperparams from the surrounding \`alloc\`/\`regenerate\` call. See \`autoWorld\` for their interfaces.
(Before you go to \`autoWorld\`, try checking \`\`settings ^_colorVariables\`\`. And maybe save it: \`\`elemCollapse \\Rewrite()\`\`.)

- First \`_chooseHead\`:
    - From call/value generation contexts, choose one valid thing to get by maximizing a goal's prediction.
        - Types filter out available options from \`GenContexts\`, with \`typeRefine\` in \`_genCtxsFilter\`. If none are left at any point, the whole generation fails.
        - \`Choose\` is used to \`_choose\` the best goal \`predict\`ion among the filtered options.
    - Once chosen, we create the context.
        - Types refine the needed type with the type we have to produce a \`map\` of type variables.
        - \`ChoiceEmbedder\` produces the embedding context (a learned \`tensor\` too).
- If failed, return \`null\` for \`DAG\`. (We do no search, so types should only be loose suggestions, even if machine learning can learn to avoid failures.)
    - \`UpType\` is \`null\`.
    - \`UpEmbedding\` is produced by \`FinishFail\`.
- If chose a func to \`make\` a call with, \`_genExpr\`:
    - For each arg, \`autoMake\`, and incorporate its shadows into the context.
        - Types first refine the static arg type in the context and pass it down, then give what we got to the context with \`typeRefine\`.
        - \`ArgUseAs\` gives the static arg embedding, \`ArgEmbedder\` computes the embedding to pass down, then \`ContextRefiner\` changes the context (or \`ArgFailed\` computes what to return).
    - Then compute the returned shadows.
        - Types \`typeRefine\` the static \`HaveType\` in the context.
        - Embeddings use \`FinishCall\`.
    - Then \`make\` the call: if the 'func' defines \`construct\` (as \`randomVarData\` does), construct it at generation-time.
    - Then save the node (pushing out the oldest ones if there are more than \`MaxSavedNodes\`).
- Else, if it chose a value:
    - Compute the returned shadows.
        - Types \`typeRefine\` \`DownType\` with the static \`HaveType\`.
        - Embeddings use \`FinishValue\`.


Notes: \`\`elemCollapse elem('text',stringToDoc('
    The returned type usually gets ignored (by users such as \`regenerate\`).
    Both types and embeddings are effectively static once computed. (Types contain dynamic variables during a call''s generation, but not after.)
    The outer \`autoMake\` has \`DownEmbedding\`, and \`UpEmbedding\` which does not end in \`predict\` by itself. \`autoWorld\`/\`using\` can give them gradient for salience, by exposing \`getDownEmbedding\`/\`getUpEmbedding\` to generation.
    Funcs can return/accept funcs, and both types and embeddings should flow properly. However, computed funcs are never called directly, for simplicity; expose \`apply\` if you need this.'))\`\`

It's slow: \`O(Nodes·AvgOptions)\` type refinements and \`Choose\`'s neural ops, and extra \`O(Nodes·AvgArgCount)\` neural ops (just imagine that these are one-letter variables, and that we describe what they are afterwards).



How could this potentially be integrated for human use?
    First is type inference for all programs and not just those generated here. \`contextMenu\` should be able to show it per-node, and each non-filled hole in a partially-created program should give a list of what functions/values are allowed here by types (program editing \`2.0\`, which is much slower than just typing text and thus worse).
    Second is embedding DAGs for all programs and not just those generated here. Bunches-of-numbers are not interpretable directly, but we can project them into a low-dimensional space (such as red/green/blue color components of a node) and cluster them, and/or give the "this node should be of this color" interface to the human for highlighting semantic similarities (syntax highlighting \`2.0\`).
    Third is giving appropriate goals to embeddings, and saving embeddings (software \`2.0\`). But those two have to be done regardless of human interactivity.`,
    philosophy:`Auto-regeneration can be meta-circular (regenerating regeneration, specifying *nothing*), yes, but it is also sufficient to shadow *everything* in a learnable manner. It's likely even better. That's a lot of functions, though, and it's not like we're guaranteed to have directly captured all possible connections ever.
Pros: doesn't not exist. Cons: a bit less flexible.`,
    dispose(triplet) { isArray(triplet) && (dispose(triplet[0]), _allocArray(triplet)) },
    readAt:{
      genDepthFirst:_(`genDepthFirst`),
    },
    Initialize() {
      autoMake.depth = 0
    },
    call(DownEmb, DownType) { // ⇒ (UpEmb UpType DAG)
      // TODO: Has to be replaced with `regenOne`.
      ++autoMake.depth
      const prevNodes = autoMake.nodes
      let [amn = 0, stage = 0, HeadState, Args, result, nodeToMade, AdjLen] = interrupt(7)
      autoMake.nodes = amn
      try {
        // Choose what to generate.

        let UpEmb, UpType, Node
        if (result) [UpEmb, UpType, Node] = result
        switch (stage) {
          case 0:
            if (instance.visual)
              _humanDAGAsk("Node hierarchy", [], [_typeFinalize(DownType)], [])
          stage = 1;  case 1:
            HeadState = _chooseHeadAsync(DownEmb, DownType)
          stage = 2;  case 2:
            try { Args = _chooseHead(DownEmb, DownType, HeadState), HeadState = null }
            catch (err) { if (err !== interrupt) HeadState = null;  throw err }
          stage = 3;  case 3:
            // Generate an unbound tree.
            result = _genExpr(...Args)
            ;[UpEmb, UpType, Node] = result
          stage = 4;  case 4:
            // Bind variables, handling `(bound Expr VarName VarBody)` (not a valid `bound` call, but convenient for us).
            if (isArray(Node)) {
              const ctx = _allocMap()
              try {
                Node = result[2] = _bindNodes(Node, alloc.world.NodeTypes[alloc.params.At], ctx)
                ctx.forEach((v,k) => { alloc.world.NodeTypes[alloc.params.At].delete(k), alloc.world.NodeEmbs[alloc.params.At].delete(k) })
              } finally { _allocMap(ctx) }
            }
            AdjLen = adjustUndo()
          stage = 5;  case 5:
            // Construct.
            if (UpType !== null && isArray(Node)) {
              if (!nodeToMade) nodeToMade = _allocMap()
              Node = result[2] = makeGraph(Node, nodeToMade)
            }
          stage = 6;  case 6:
            // In aw.NodeTypes/.NodeEmbs, change keys from unbound to nodes. Save nodes. Finalize types.
            if (UpType !== null && isArray(Node)) {
              const aw = alloc.world, At = alloc.params.At
              aw.NodeTypes[At].forEach((v,k,m) => { nodeToMade.has(k) && nodeToMade.get(k) !== k && (m.delete(k), m.set(nodeToMade.get(k), v)) })
              aw.NodeEmbs[At].forEach((v,k,m) => { nodeToMade.has(k) && nodeToMade.get(k) !== k && (m.delete(k), m.set(nodeToMade.get(k), v)) })
              aw.NodeEmbs[At].forEach((e,x,m) => m.set(x, _saveCreatedNode(e, alloc.world.NodeTypes[alloc.params.At].get(x), x)))
              const cache = _allocMap()
              aw.NodeTypes[At].forEach((v,k,m) => { m.set(k, _typeFinalize(v, cache)) })
              _allocMap(cache)
            } else alloc.world.NodeTypes[alloc.params.At].clear(), alloc.world.NodeEmbs[alloc.params.At].clear()
          stage = 7;  case 7:
            // Cull nodes. Save and return.
            if (UpType !== null) {
              const aw = alloc.world
              if (typeof alloc.params.NodeCullMetric == 'function') {
                _updateCtxNodeMetrics(alloc.params.GenContexts[8], aw.NodeCullMetricF[alloc.params.At])
                _updateCtxNodeMetrics(alloc.params.GenContexts[9], aw.NodeCullMetricV[alloc.params.At])
              }
            }
            adjustUndo(AdjLen)
            adjustSave(Args)
            return result
        }
      } catch (err) {
        if (err === interrupt) interrupt.stack.push(autoMake.nodes, stage, HeadState, Args, result, nodeToMade, AdjLen)
        else {
          defines(_chooseHeadAsync, dispose)(HeadState), _disposeEachAndDealloc(Args), _disposeEachAndDealloc(result)
          const aw = alloc.world, At = alloc.params.At
          aw.NodeTypes[At].clear(), aw.NodeEmbs[At].clear()
        }
        throw err
      } finally { autoMake.nodes = prevNodes, --autoMake.depth }

      // .depth, .nodes (how many DAG nodes we are *considering* to make)
    },
    adjust(ins, _, dout) {
      // No need to keep track of depth.
      const DownEmb = ins[0], dUpEmb = dout[0]
      let [dupdated = 0, Args, dArgs] = interrupt(3)
      try {
        // Adjust context updating.
        if (dupdated === 0) {
          const a = _allocArray(2);  [a[0], a[1]] = [alloc.params.GenContexts[9], alloc.world.NodeCullMetricV[alloc.params.At]]
          try { defines(_updateCtxNodeMetrics, adjust)(a) }
          finally { _allocArray(a) }
          dupdated = 1
        }
        if (dupdated === 1) {
          const a = _allocArray(2);  [a[0], a[1]] = [alloc.params.GenContexts[8], alloc.world.NodeCullMetricF[alloc.params.At]]
          try { defines(_updateCtxNodeMetrics, adjust)(a) }
          finally { _allocArray(a) }
          dupdated = 2
        }
        // Load args of `_genExpr`, and adjust that.
        if (Args === undefined) Args = adjustLoad(8)
        if (dArgs === undefined) {
          // Adjust arg generation `return _genExpr(UseAs, EmbCtx, HaveType, TypeCtx, Node, IsCall, DownEmb, DownType)`.
          dArgs = defines(_genExpr, adjust)(Args, null, dout)
          if (!isArray(dArgs)) error("Expected an array, but got", dArgs)
          _disposeEachAndDealloc(Args), Args = null
        }

        // Adjust the choice of what to generate: `[UseAs, EmbCtx, Type, TypeCtx, Node, IsCall, DownEmb] = _chooseHead(DownEmb, DownType, …)`.
        const r = defines(_chooseHead, adjust)(ins, null, dArgs);  _disposeEachAndDealloc(dArgs)
        return r
      } catch (err) {
        if (err === interrupt) interrupt.stack.push(dupdated, Args, dArgs)
        else _disposeEachAndDealloc(Args), _disposeEachAndDealloc(dArgs)
        throw err
      }
    },
  },

  _bindNodes(x, onlyInMap, ctx) {
    // This is much faster than `bound` (and much smaller), but it does about the same thing for a different purpose.
    if (ctx.has(x)) return ctx.get(x)
    if (!isArray(x)) return x
    if (x[0] === bound && x.length == 5) { // `(bound MainExpr VarExpr VarName CtxIndex)`
      ctx.set(x, x[1]), ctx.set(x[3], _bindNodes(x[2], onlyInMap, ctx))
      try { return _bindNodes(x[1], onlyInMap, ctx) }
      finally { ctx.delete(x[3]) }
    } else {
      if (onlyInMap && !onlyInMap.has(x)) return x
      for (let i=0; i < x.length; ++i)
        x[i] = _bindNodes(x[i], onlyInMap, ctx)
      return x
    }
  },

  _updateCtxNodeMetrics:{
    call(ctx, metrics) {
      if (ctx.length <= 1) return
      if (typeof alloc.params.NodeCullMetric != 'function') return
      let [StackedUseAs] = interrupt(1)
      try {
        if (StackedUseAs === undefined) {
          const a = _allocArray((ctx.length-1)/3 | 0)
          for (let i = 1; i < ctx.length; i += 3) a[(i-1)/3 | 0] = ctx[i+2][0] // Don't go through `_embValue`: too slow.
          StackedUseAs = stack(a)
        }
        const StackedMetrics = alloc.params.NodeCullMetric(StackedUseAs)
        dispose(StackedUseAs), StackedUseAs = null
        if (_isDisposable(StackedMetrics))
          // Even if this doesn't resolve by the time we cull nodes, it shouldn't be a big deal.
          StackedMetrics.data().then(data => {
            metrics.length = data.length
            for (let i=0; i < data.length; ++i) metrics[i] = data[i]
          }), dispose(StackedMetrics)
        else metrics.length = 0
      } catch (err) { if (err === interrupt) interrupt.stack.push(StackedUseAs); else dispose(StackedUseAs);  throw err }
    },
    adjust(ins) {
      const [ctx, metrics] = ins
      if (ctx.length <= 1) return
      if (typeof alloc.params.NodeCullMetric != 'function') return
      let [StackedUseAs] = interrupt(1)
      try {
        if (StackedUseAs === undefined) {
          const a = _allocArray((ctx.length-1)/3 | 0)
          for (let i = 1; i < ctx.length; i += 3) a[(i-1)/3 | 0] = ctx[i+2][0] // Don't go through `_embValue`: too slow.
          StackedUseAs = stack(a)
        }
        // Adjust `alloc.params.NodeCullMetric(StackedUseAs)`.
        const a = _allocArray(1);  a[0] = StackedUseAs
        try { _disposeEachAndDealloc(adjust(alloc.params.NodeCullMetric, a, null, 0)) }
        finally { _allocArray(a) }
        dispose(StackedUseAs), StackedUseAs = null
      } catch (err) { if (err === interrupt) interrupt.stack.push(StackedUseAs); else dispose(StackedUseAs);  throw err }
    },
  },

  genDepthFirst:{
    docs:`A function \`defines\` this to be \`true\` if its \`type\` has to be refined in-order in order to be correct. No \`sync\` amortization of choices, lots of stalling.`,
  },

  _genCtxSliceFilter(ctx, Type) {
    // Return indexes of objects with matching types.
    const aw = alloc.world
    if (aw && !aw.HashFilter) aw.HashFilter = new WeakMap
    if (aw && aw.HashFilter.has(ctx) && aw.HashFilter.get(ctx).has(Type)) return aw.HashFilter.get(ctx).get(Type)
    const indexes = aw.HashIndexes && aw.HashIndexes.get(ctx) // The array of original (before slicing-up) indexes.

    let [r = _allocArray(0), j = 1] = interrupt(2)
    const typeVars = _allocMap()
    try {
      // A context is `(AreAllTheseCalls … Value Type Embedder …)`.
      for (; j < ctx.length; j += 3, typeVars.clear())
        if (_noTypeFiltering[1] || typeRefine(Type, ctx[j+1], typeVars, true) !== null)
          r.push(indexes ? indexes[(j-1)/3|0] : j)
      if (!r.length) _allocArray(r), r = null

      aw && !aw.HashFilter.has(ctx) && aw.HashFilter.set(ctx, new Map)
      aw && aw.HashFilter.get(ctx).set(Type, r)
      return r
    } catch (err) { if (err === interrupt) interrupt.stack.push(r, j);  throw err }
    finally { _allocMap(typeVars) }
  },

  _typeHash(T, depth = 0) {
    T = _resolveTypeVar(T)
    if (typeof T == 'string' || _isTypeVar(T)) return null
    if (!isArray(T)) return T
    if (defines(T, typeRefine)) return null
    if (T[0] === rest) return null
    if (depth > 10) return null
    if (T.length == 2) {
      const a = _allocArray(2)
      a[0] = _typeHash(T[0], depth+1)
      a[1] = _typeHash(T[1], depth+1)
      if (a[0] === null || a[1] === null) return _allocArray(a), null
      const b = merged(a);  _allocArray(a)
      return b
    }
    return _typeHash(T[0], depth+1)
  },

  _genCtxFilter(ctx, Type, TmpCtx = false) {
    // `_typeHash` types, so that not *all* objects have to be considered on each filtering, only some.
    if (TmpCtx) return _genCtxSliceFilter(ctx, Type)

    const aw = alloc.world
    if (aw && !aw.CtxHashed) aw.CtxHashed = new WeakMap
    let cache = aw && aw.CtxHashed.get(ctx)

    if (aw && !cache) {
      aw.CtxHashed.set(ctx, cache = new Map)
      if (aw && !aw.HashIndexes) aw.HashIndexes = new WeakMap
      for (let i = 1; i < ctx.length; i += 3) {
        const [obj, T, emb] = [ctx[i], ctx[i+1], ctx[i+2]]
        const h = _typeHash(T)
        if (!cache.has(h)) cache.set(h, [ctx[0]])
        const S = cache.get(h)
        let indexes;  !aw.HashIndexes.has(S) && aw.HashIndexes.set(S, indexes = [])
        aw.HashIndexes.get(S)[(S.length-1)/3|0] = i
        S.push(obj, T, emb)
      }
    }

    if (!cache) return _genCtxSliceFilter(ctx, Type)

    const h = _typeHash(Type)
    if (h === null) return _genCtxSliceFilter(ctx, Type)
    if (!cache.has(h) && !cache.has(null)) return
    if (!cache.has(null)) return _genCtxSliceFilter(cache.get(h), Type)
    if (!cache.has(h)) return _genCtxSliceFilter(cache.get(null), Type)
    const a0 = _genCtxSliceFilter(cache.get(h), Type)
    const a1 = _genCtxSliceFilter(cache.get(null), Type)
    if (a0 && a1) { const a = _allocArray(0);  a.push(...a0, ...a1);  _killArray(a0), _killArray(a1);  return a }
    else if (a0) return a0
    else return a1
  },

  _genCtxsFilter(ctxs, Type, allowCalls = true) {
    // Returns `(… ContextIndex ItemIndex …)`. The refined type is not preserved.
    let [fits = _allocArray(0), i = !_noTypeFiltering[1] ? 0 : 10] = interrupt(2)
    try {
      for (; i < ctxs.length; ++i) {
        if (!allowCalls && ctxs[i][0] === true) continue
        const a = _genCtxFilter(ctxs[i], Type, i === 10) // `_equalizeContexts`
        if (a) for (let j=0; j < a.length; ++j) fits.push(i, a[j])
        _killArray(a)
      }
      for (let j=0; j < 10; ++j)
        if ((allowCalls || ctxs[j][0] === false) && ctxs[j].length > 1)
          fits.push(j, 0) // `_lazyUseAs` will give the whole context.
      return fits
    } catch (err) { if (err === interrupt) interrupt.stack.push(fits, i);  throw err }
  },

  _makeAdjIndependent(picked, outerDim, begin) {
    // Trims all too-big tensors into only the picked dimension. Basically, undoes batching/`stack`ing in order to save memory.
    // If called without args, returns the `begin` mark to be passed in later.
    const stack = call.env && call.env[_id(adjustSave)]
    if (!stack) return
    if (picked === undefined) return stack.length
    for (let i = begin; i < stack.length; ++i) {
      const arr = stack[i]
      if (isArray(arr))
        for (let j=0; j < arr.length; ++j) {
          const v = arr[j]
          if (_isDisposable(v) && v.shape[0] === outerDim) {
            const t = sliceOff(v, picked)
            dispose(arr[j]);  arr[j] = t
          }
        }
    }
  },

  _independentChoices:[
    _(`settings`),
    true,
    `If checked, \`_choose\` will assume that \`Choose\` makes goal predictions mutually independent (and not dependent on hidden state, only inputs) and that its intermediate adjustment state only needs the picked thing.
Makes assumptions, but makes each choice between 1000 options need 1000× less memory to adjust.`,
  ],

  _choose:{
    docs:`\`_choose(Goal,Options,Dynamic,Choose)\`⇒\`MaxIndex\`
Chooses the best option by maximizing the prediction of \`Goal\` by \`Choose\`.
The body is assumed to be \`max(GoalPredictions)=Goal;argmax(GoalPredictions)\`, for \`Options\` is \`stack\`ed, and we give no gradient.
Theoretically, some options can depend on others; practically, if \`\`settings ^_independentChoices\`\`, then we save on memory by culling non-picked ones.

(Predicting "the option we want" embedding and doing k-nearest-neighbors search (and only \`_choose\`ing from those) would be significantly faster. Why not? …Uhhh, no premature optimization, yes.)`,
    call(Goal, Opts, Dyn, Choose) { return Choose(Goal, Opts, Dyn) },
    adjust(ins, _, dout) { return adjust(ins[3], ins, null, undefined) },
  },












  regen:{
    Initialize() { regen.requests = [] },
    // TODO: Request the object to regenerate at `regenFinish`, via `regen.requests.push(alloc.world, _awIndex(alloc.world, obj), null)` if it wasn't already scheduled (like `using` but super-short).
      // Do we want a custom IsCall?
      //   Maybe to take over `regenerate`'s duties. (…Wait, but doesn't `using` want to do things on finishing too?)
  },
  // TODO: `callAdjust` should set/reset `regen.requests`.

  regenOne:{
    // TODO: `regenOne(DownEmb, DownType)—>NodeIndex`, as the analogue to `autoMake`.
    //   This should definitely have a custom `AreCalls[at]`, right?
    //     Both `regen`'s and `regenFinish`'s definitions deferring to `DownType`'s definitions.
    //     …No, we need to separate the former `regenerate` from the former `autoMake`, because we might eventually want to `autoMake` `funcType`s.
  },

  regenMany:{
    // TODO: `regenMany(StaticEmb, DownEmb, StaticTypes, DownType, Objects, Positions)—>NodeIndex`, for regen-ing many objects as one, adjustable.
    //   (Put all the args into the array in `regen.requests`, with our own node.)
    //   EmbCtx is ChoiceEmbedder(StaticEmb, DownEmb), TypeCtx is an empty map, Node is `_allocArray(Objects.length+1).fill()`, IsCall is true.
    //   TODO: What do we define `regen`/`regenFinish` with?
    //   …Do we want custom `AreCalls[at]` for this, to make things (much) cleaner? Well, yes, but…
    //     How would we pass `Objects`/`Positions`? Have a extra per-node slot for extra info (probably used to store interleaved Objects/Positions)?
  },

  regenFinish:{
    call() {
      // TODO: Copy `_genExpr` into here, but taking requests from `regen.requests` instead of from args.
      // TODO: If `AreCalls[at]` defines `regen` (from `DownEmb DownType DownObj`), call it instead of scheduling children (args=1, but `continue` prevents once-done cases).
      // TODO: If `AreCalls[at]` defines `regenFinish` (from `UpEmb UpType UpObj DownObj`), call that once we're finished with children.
      // TODO: Also handle "use this obj" (`using`, now `regen`, into which we can inline `regenerate`),
      //   TODO: and "get me this embedding+type" (`autoMake`),
      //   TODO: and "regenerate all these things as one" (`_genExpr`, now `regenMany` — which would like to do `regenerate` too…).
      // TODO: …Do we maybe want to separate the former `regenerate` into its own thing too?
      //   Or can `regenOne` take over its duties? I mean, there's pretty much zero overlap between "give me a DAG of this type" and "`funcType`/`DAGType`" — …no, wait, we MIGHT want to have funcs that return funcs…
      //   Yes. Separate the former `regenerate` — what, make `regen` define `regen`/`regenFinish`?
    },
  },












  _genExpr:{
    docs:`\`_genExpr:UseAs⇒EmbCtx⇒HaveType⇒TypeCtx⇒Head⇒IsCall⇒DownEmb⇒DownType⇒(UpEmb&OutputType&Node)\`
Generates args for a DAG node that calls \`Head\`, given embeddings and types.
\`TypeCtx\` is a \`map\` that gets consumed.

(I can find fancy words for roles of each of these args, but that would make it seem like the top-down approach of "description first, code simply implements that" is more important than the bottom-up "other code needs these values with these semantics here, don't omit anything and don't magic up extras". That is, the possible connectivity is only 100% clear when looking at a 100%-clear thing like a particular function or a logical model. That is, learn by executing.)`,
    dispose:_(`_disposeEachAndDealloc`),
    call(UseAs, EmbCtx, HaveType, TypeCtx, Node, IsCall, DownEmb, DownType, Positions, Objects) { // ⇒ `(UpEmb OutputType Node)`
      // Have a queue of what to eval, and eval in-order until done.
      //   The point is to `sync` in the same order as issuing GPU commands (where possible), and to minimize stalling. In ML, inefficiency is a bug.
      //     (Literally: during making of this, we realized how `bound` can defer var-expr generation for 100%-correct signal routing.)
      //     (Not very memory-efficient, though: we were lazy.)
      //   Much less readable, but that's what `docs` are for.

      let [
        evals, doneStages, i = 0, stage = 0, args,
        Ats, Worlds, Nodes, AreCalls, Progress, Parents, ArgInds, PrevSiblings, Childs, Depths,
        AllowedVarsInds, ScopeCtxs,
        HeadStates, ArgStaticEmbs,
        StaticEmbs, DownEmbCtxs, UpEmbCtxs, StaticTypes, TypeCtxs,
        DownEmbs, DownTypes, UpEmbs, UpTypes,
        ArgsLeft,
      ] = interrupt(29)

      // Prepare to expand generative contexts with scope (`bound`) variables (and to switch between worlds and contexts).
      const curCtxs = _allocArray(11)
      const prevCtxs = alloc.params && alloc.params.GenContexts
      const prevWorld = alloc.world, prevParams = alloc.params, prevAt = alloc.At

      try {
        if (Nodes === undefined) {
          const a = _allocArray
          Ats = a(0), Worlds = a(0), Nodes = a(0), AreCalls = a(0), Progress = a(0), Parents = a(0), ArgInds = a(0), PrevSiblings = a(0), Childs = a(0), Depths = a(0), AllowedVarsInds = a(0), ScopeCtxs = a(0), HeadStates = a(0), StaticEmbs = a(0), DownEmbCtxs = a(0), UpEmbCtxs = a(0), StaticTypes = a(0), TypeCtxs = a(0), DownEmbs = a(0), DownTypes = a(0), UpEmbs = a(0), UpTypes = a(0), ArgsLeft = a(0)
        }
        if (evals === undefined) {
          // Set up the initial node.
          // TODO: Instead, push `regen.requests` (if any) at the beginning of every loop iteration.
          Parents[0] = null
          AreCalls[0] = IsCall
          Ats[0] = alloc.params.At
          Worlds[0] = alloc.world
          Nodes[0] = Node, Progress[0] = 1
          Parents[0] = ArgInds[0] = PrevSiblings[0] = Childs[0] = null
          Depths[0] = 0
          AllowedVarsInds[0] = elemValue.empty
          ScopeCtxs[0] = [false]
          HeadStates[0] = undefined
          StaticEmbs[0] = keep(UseAs)
          DownEmbCtxs[0] = keep(EmbCtx), UpEmbCtxs[0] = undefined
          StaticTypes[0] = HaveType
          TypeCtxs[0] = TypeCtx
          DownEmbs[0] = keep(DownEmb)
          DownTypes[0] = DownType
          ArgsLeft[0] = 0
          UpEmbs[0] = UpTypes[0] = undefined
          evals = [0], doneStages = [0], ArgStaticEmbs = [undefined]
        }

        // Generate the tree by executing commands to finish nodes.
        for (; i < evals.length; ++i, stage = 0) { // TODO: The loop condition should be `regen.requests.length || i < evals.length`.
          const at = evals[i] // Lower-case `at` is node index. Capitalized `At` is object-in-world index.

          // Set the current world and object-spot and object-hyperparams in it.
          const spotDiffers = alloc.world !== Worlds[at] || alloc.At !== Ats[at]
          alloc.world = Worlds[at], alloc.params = Worlds[at].params, alloc.At = Ats[at]
          if (spotDiffers) _fillObjectHyperparams(Worlds[at], Ats[at])
          if (spotDiffers && alloc.params.GenContexts.length != 10) error("Invariant violated:", alloc.params.GenContexts.slice())
          if (curCtxs[0] === undefined || spotDiffers) for (let j=0; j < 10; ++j) curCtxs[j] = alloc.params.GenContexts[j]
          alloc.params.GenContexts = curCtxs
          const ctx = curCtxs[10] = ScopeCtxs[at]

          // Previous parent-or-sibling embedding context.
          const prevEmbCtx = PrevSiblings[at] !== null && (PrevSiblings[at] !== Parents[at] ? UpEmbCtxs[PrevSiblings[at]] : DownEmbCtxs[Parents[at]])
          const prevFailed = PrevSiblings[at] !== null && UpTypes[PrevSiblings[at]] === null

          switch (stage) {
            case 0:
              if (!Progress[at] && HeadStates[at]) { // We only did `_chooseHeadAsync`, and need to finish the job.
                doneStages[i] |= 1
                try {
                  const b = _chooseHead(DownEmbs[at], DownTypes[at], HeadStates[at])
                  let dde;  [StaticEmbs[at], DownEmbCtxs[at], StaticTypes[at], TypeCtxs[at], Nodes[at], AreCalls[at], dde] = b;  _allocArray(b)
                  dispose(DownEmbs[at]), DownEmbs[at] = dde
                  HeadStates[at] = undefined
                  Progress[at] = 1
                } catch (err) { if (err !== interrupt) HeadStates[at] = undefined;  throw err }
              }
              // Set the intermediate value, for immediate-ish UI feedback.
              if (instance.visual && !prevFailed && Parents[at] != null && isArray(Nodes[Parents[at]]) && !Objects)
                Nodes[Parents[at]][ArgInds[at]] = Nodes[at]
            stage = 1;  case 1:
              // If picked a call, regenerate the func too.
              if (AreCalls[at] === true && isArray(Nodes[at]))
                using(_unquote(Nodes[at][0]))
            stage = 2;  case 2:
              // `args` aren't args, they are actually 1+args.
              if (AreCalls[at] === "regen")
                args = 2
              else if (Objects)
                args = 1+Objects.length
              else if (isArray(Nodes[at]) && Nodes[at][0] === bound)
                args = 3
              else if (AreCalls[at] === true && TypeCtxs[at] && UpTypes[at] !== null) {
                // Re-refine ourselves, so that we can spread (`rest`) newly-known type info correctly.
                const T = TypeCtxs[at].size ? typeRefine(StaticTypes[at], StaticTypes[at], TypeCtxs[at]) : StaticTypes[at]
                if (T === null)
                  error("We can't just fail to self-refine needed type:", StaticTypes[at], 'in', new Map(TypeCtxs[at]))
                args = isArray(T) ? T.length-1 : 1
                StaticTypes[at] = T
              } else
                args = 1
              if (prevFailed) UpTypes[at] = Nodes[at] = null // Once we fail, we fail forever.
            stage = 3;  case 3:
              if (AreCalls[at] === "regen" && Progress[at] < args) { // If `conceptType`, regen all values.
                doneStages[i] |= 2
                UpEmbs[at] = regenerate(DownEmbs[at], DownTypes[at], Nodes[at] = Objects[ArgInds[at]-1])
                adjustSave(Nodes[at])
                adjustSave(DownTypes[at])
                Progress[at] = args
              }
            stage = 4;  case 4:
              // Prepare args for calls, then (wait to) return to us.
              if (AreCalls[at] === true && Progress[at] < args && UpTypes[at] !== null) {
                const onlyOne = _alwaysGenDepthFirst[1] || defines(Nodes[at], genDepthFirst) || !!Positions
                const isVarExpr = Nodes[at][0] === bound && Progress[at] === 2
                if (!isVarExpr || Nodes[at][3].variable === "used") { // Do not generate expressions to bind unused variables to.
                  const beginAt = Progress[at]
                  const endAt = onlyOne ? beginAt+1 : args
                  // Schedule all the args we need to, with correct DownEmb.
                  let [pos, ArgDownEmbs, ArgType, j = Progress[at], allowed, N, I, J, vNodes, vTypes, vArgInds, vCache] = interrupt(12)
                  try {
                    if (allowed === undefined) {
                      if (Nodes[at][0] === bound && !isVarExpr) { // If creating a scope, expose the new variable to generation.
                        if (!Nodes[at][3]) Nodes[at][3] = Object.create(bound), Nodes[at][3].variable = "unused"
                        const m = ctx.length
                        pushToContext(ctx, Nodes[at][3], _newTypeVar(), defines(alloc.world, deconstruct)[1].NewVar, true)
                        Nodes[at][4] = m
                        allowed = [...AllowedVarsInds[at], m]
                      } else allowed = AllowedVarsInds[at]
                    }
                    if (StaticEmbs[at] != null) {
                      if (ArgStaticEmbs[i] === undefined) {
                        if (!isVarExpr) { // ArgUseAs
                          doneStages[i] |= onlyOne ? 4 : 8
                          if (pos === undefined)
                            pos = !onlyOne ? _lazyPositions(args) : !Positions ? _lazyPos(Progress[at]) : _embValue(Positions[Progress[at]])
                          const se = !onlyOne ? broadcastTo(StaticEmbs[at], pos) : StaticEmbs[at]
                          try { ArgStaticEmbs[i] = alloc.params.ArgUseAs(se, pos) || 0 }
                          finally { if (!onlyOne) dispose(se) }
                          adjustSave(!onlyOne ? args : Progress[at])
                          dispose(pos), pos = null
                        } else {
                          doneStages[i] |= 16
                          const Fits = _allocArray(2);  [Fits[0], Fits[1]] = [10, Nodes[at][4]]
                          try { ArgStaticEmbs[i] = _lazyUseAs(Fits) }
                          finally { _allocArray(Fits) }
                          adjustSave(Nodes[at][4])
                        }
                      }
                      if (ArgDownEmbs === undefined) { // ArgEmbedder
                        const ase = ArgStaticEmbs[i]
                        const de = doneStages[i] & 24 ? broadcastTo(DownEmbs[at], ase) : DownEmbs[at]
                        const ec = doneStages[i] & 24 ? broadcastTo(DownEmbCtxs[at], ase) : DownEmbCtxs[at]
                        try { ArgDownEmbs = alloc.params.ArgEmbedder(ArgStaticEmbs[i], de, ec) || 0 }
                        finally { if (doneStages[i] & 24) dispose(ec), dispose(de) }
                      }
                    } else ArgDownEmbs = null

                    if (instance.visual) {
                      if (N === undefined) { N = 0;  for (let I = at; I != null; I = Parents[I]) ++N }
                      if (vNodes === undefined) vNodes = _allocArray(N), vTypes = _allocArray(N), vArgInds = _allocArray(N), vCache = _allocMap()
                      if (I === undefined) I = at, J = 0
                      if (typeof I == 'number') {
                        for (; I != null; I = Parents[I], ++J) {
                          const K = N - J - 1, V = Nodes[I]
                          vNodes[K] = V && Object.getPrototypeOf(V) === bound ? label('v'+_id(V)) : V
                          const T = DownTypes[I]
                          vTypes[K] = _typeFinalize(K ? typeRefine(T, T, TypeCtxs[K-1]) : T, vCache)
                          K && (vArgInds[K-1] = ArgInds[I])
                        }
                        I = "update"
                      }
                    }

                    if (!Childs[at]) Childs[at] = _allocArray(args-1)
                    for (; j < endAt; ++j) { // Push a node for each arg.
                      if (ArgType === undefined) {
                        if (Nodes[at][0] === bound)
                          ArgType = !isVarExpr ? DownTypes[at] : ctx[Nodes[at][4]+1]
                        else
                          ArgType = typeRefine(StaticTypes[at][j], StaticTypes[at][j], TypeCtxs[at])

                        if (ArgType === undefined) ArgType = _onlyUndefined
                        else if (ArgType === null)
                          error("We can't just fail to self-refine needed input type:", StaticTypes[at][j], 'in', new Map(TypeCtxs[at]))
                      }
                      let HS
                      const DT = ArgType !== _onlyUndefined ? ArgType : undefined
                      if (instance.visual && I === "update") {
                        vArgInds[N-1] = j
                        vTypes[N] = DT
                        _humanDAGAsk("Node hierarchy", vNodes, vTypes, vArgInds)
                        I = "wait"
                      }
                      const DE = (doneStages[i] & 24) && _isDisposable(ArgDownEmbs) ? sliceOff(ArgDownEmbs, !onlyOne ? j-1 - (beginAt-1) : 0) : keep(ArgDownEmbs)
                      autoMake.depth += Depths[at]
                      try { HS = !Objects ? _chooseHeadAsync(DE, DT, allowed) : null }
                      catch (err) { dispose(DE);  throw err }
                      finally { autoMake.depth -= Depths[at] }
                      const n = Parents.length
                      if (Nodes[n] !== undefined) error("Node already exists:", n)
                      Ats[n] = Ats[at]
                      Worlds[n] = Worlds[at]
                      Nodes[n] = undefined, Progress[n] = 0
                      Parents[n] = at, ArgInds[n] = j, PrevSiblings[n] = j > 1 && onlyOne ? Childs[at][j-2] : at
                      if (Objects) AreCalls[n] = "regen"
                      Childs[at][j-1] = n, Childs[n] = null
                      Depths[n] = Depths[at] + 1
                      AllowedVarsInds[n] = allowed
                      ScopeCtxs[n] = ScopeCtxs[at]
                      HeadStates[n] = HS
                      DownEmbs[n] = DE
                      DownTypes[n] = DT
                      StaticEmbs[n] = DownEmbCtxs[n] = UpEmbCtxs[n] = UpEmbs[n] = undefined
                      ArgsLeft[n] = 0
                      evals.push(n), doneStages.push(0), ArgStaticEmbs.push(undefined)
                      ArgType = undefined
                      if (instance.visual) I = "update"
                    }
                    dispose(ArgDownEmbs), ArgDownEmbs = null

                    if (doneStages[i] & 28) adjustSave(Progress[at])
                    if (doneStages[i] & 8) adjustSave(endAt)
                    ArgsLeft[at] += endAt - Progress[at]
                    Progress[at] = endAt
                    // "Once done" cases below must not be allowed to run until the sub-nodes return to us.
                    //print('c', i, doneStages[i].toString(2), doneStages[i] & 28) // ########################################
                    if (UpTypes[at] !== null) continue
                  } catch (err) {
                    if (err === interrupt) interrupt.stack.push(pos, ArgDownEmbs, ArgType, j, allowed, N, I, J, vNodes, vTypes, vArgInds, vCache)
                    else dispose(pos), dispose(ArgDownEmbs)
                    throw err
                  }
                } else if (isVarExpr) args = 2
              }
            stage = 5;  case 5:
              // Once done, compute UpEmb/UpType and update the parent Node.
              if (Progress[at] === args && !Objects) {
                if (AreCalls[at] === undefined) {
                  if (StaticEmbs[at] === undefined) { // FinishFail
                    doneStages[i] |= 32
                    UpEmbs[at] = alloc.params.FinishFail(DownEmbs[at])
                  } else { // FinishTypeError
                    doneStages[i] |= 64
                    UpEmbs[at] = alloc.params.FinishTypeError(StaticEmbs[at], DownEmbs[at])
                  }
                  UpTypes[at] = Nodes[at] = null
                } else if (AreCalls[at] === false) { // FinishValue
                  doneStages[i] |= 128
                  UpEmbs[at] = alloc.params.FinishValue(StaticEmbs[at], DownEmbs[at])
                  UpTypes[at] = typeRefine(StaticTypes[at], DownTypes[at], TypeCtxs[at])
                  if (Nodes[at] && Object.getPrototypeOf(Nodes[at]) === bound) Nodes[at].variable = "used"
                } else if (AreCalls[at] === true && UpTypes[at] !== null) { // FinishCall
                  doneStages[i] |= 256
                  const y = Childs[at] ? Childs[at][args-2] : at
                  const ectxs = Childs[at] ? UpEmbCtxs : DownEmbCtxs
                  UpEmbs[at] = alloc.params.FinishCall(StaticEmbs[at], DownEmbs[at], ectxs[y])
                  if (Nodes[at][0] !== bound) {
                    const T = StaticTypes[at];  UpTypes[at] = typeRefine(T[T.length-1], T[T.length-1], TypeCtxs[at])
                  } else
                    UpTypes[at] = DownTypes[at]
                  adjustSave(y)
                }
              }
              // Also, once done, set our node in parent node.
              if (Progress[at] === args && UpTypes[at] !== null && !prevFailed && Parents[at] != null && isArray(Nodes[Parents[at]])) {
                Nodes[Parents[at]][ArgInds[at]] = Nodes[at]
              }
            stage = 6;  case 6:
              // Once done, refine parent's type context.
              if (Progress[at] === args && UpTypes[at] !== null && !prevFailed && Parents[at] !== null && !Objects) {
                if (!prevFailed) {
                  let i = Parents[at]
                  while (!TypeCtxs[i] && Parents[i] !== null) i = Parents[i]
                  if (TypeCtxs[i] && typeRefine(DownTypes[at], UpTypes[at], TypeCtxs[i]) === null) Nodes[at] = UpTypes[at] = null
                } else
                  UpTypes[at] = Nodes[at] = null
              }
            stage = 7;  case 7:
              // Once done, refine parent's embedding context.
              if (Progress[at] === args && UpTypes[at] !== null && Parents[at] !== null && !prevFailed) { // ContextRefiner
                doneStages[i] |= 512
                UpEmbCtxs[at] = alloc.params.ContextRefiner(DownEmbs[at], UpEmbs[at], prevEmbCtx)
              }
            stage = 8;  case 8:
              // Once done, remember that we exist. (`autoMake` should finish this.)
              if (Progress[at] === args && UpTypes[at] !== null && !prevFailed && AreCalls[at] === true) {
                const aw = alloc.world, At = alloc.params.At
                aw.NodeTypes[At].set(Nodes[at], UpTypes[at])
                aw.NodeEmbs[At].set(Nodes[at], UpEmbs[at])
              }
              if (interrupt.stack && interrupt.stack.length) error("Interrupt stack corruption: not empty:", ...interrupt.stack)
            stage = 9;  case 9:
              // If we failed, siblings and parents fail too. Cruel.
              if (UpTypes[at] === null) {
                if (!prevFailed && Parents[at] !== null) { // ArgFailed
                  doneStages[i] |= 1024
                  UpEmbs[Parents[at]] = alloc.params.ArgFailed(DownEmbs[at], UpEmbs[at], prevEmbCtx)
                  UpTypes[Parents[at]] = Nodes[Parents[at]] = null
                }
                args = 1
                Nodes[at] = null
              }
              if (interrupt.stack && interrupt.stack.length) error("Interrupt stack corruption: not empty:", ...interrupt.stack, 'but type at', at, 'is', UpTypes[at])
            stage = 10;  case 10:
              // When the last scheduled arg is done, return to parent.
              //   (If a `bound` node failed an arg and got set to `null`, or if we failed for other reasons, `args` will now be `1`, so here, we do `>= args` and not equality.)
              if (Progress[at] >= args && Parents[at] !== null) {
                --ArgsLeft[Parents[at]]
                if (!ArgsLeft[Parents[at]])
                  evals.push(Parents[at]), doneStages.push(0), ArgStaticEmbs.push(undefined)
              }
              // Also, dealloc Maps when done.
              if (Progress[at] === args && TypeCtxs[at] instanceof Map)
                _allocMap(TypeCtxs[at]), TypeCtxs[at] = undefined
            //print('c', i, doneStages[i].toString(2)) // ########################################
          }
        }

        //print(Parents.length, 'nodes, of which', AreCalls.filter(x => x === true).length, 'are calls, of which', Nodes.filter(x => isArray(x) && x[0] === bound).length, 'are bound') // #############################
        //print('Got', Nodes[0], 'typed', UpTypes[0])

        const s = adjustSave
        s(evals), s(doneStages), s(ArgStaticEmbs)
        s(Ats), s(Worlds), s(ScopeCtxs)
        s(Parents), s(PrevSiblings), s(Childs)
        s(StaticEmbs), s(DownEmbCtxs), s(UpEmbCtxs), s(DownEmbs), s(UpEmbs)

        const a = _allocArray(3);  [a[0], a[1], a[2]] = [UpEmbs[0], UpTypes[0], UpTypes[0] !== null ? Nodes[0] : null]
        UpEmbs[0] = UpTypes[0] = undefined
        return a
      } catch (err) {
        if (err === interrupt)
          interrupt.stack.push(evals, doneStages, i, stage, args, Ats, Worlds, Nodes, AreCalls, Progress, Parents, ArgInds, PrevSiblings, Childs, Depths, AllowedVarsInds, ScopeCtxs, HeadStates, ArgStaticEmbs, StaticEmbs, DownEmbCtxs, UpEmbCtxs, StaticTypes, TypeCtxs, DownEmbs, DownTypes, UpEmbs, UpTypes, ArgsLeft), evals = null
        else {
          const d = _killArray, dead = _disposeEachAndDealloc
          d(Ats), d(Worlds), d(ScopeCtxs)
          d(evals), d(doneStages), d(Parents), d(PrevSiblings), Childs && Childs.forEach(d), d(Childs)
          dead(ArgStaticEmbs)
          dead(StaticEmbs), dead(DownEmbCtxs), dead(UpEmbCtxs), dead(DownEmbs), dead(UpEmbs)
        }
        throw err
      } finally {
        const spotDiffers = alloc.world !== prevWorld || alloc.At !== prevAt
        alloc.world = prevWorld, alloc.params = prevParams, alloc.At = prevAt, spotDiffers && _fillObjectHyperparams(prevWorld, prevAt)
        _allocArray(curCtxs), prevParams && (prevParams.GenContexts = prevCtxs)
        if (evals != null) {
          const d = _killArray
          d(Nodes), d(AreCalls), d(Progress), d(ArgInds), d(Depths), d(AllowedVarsInds), d(StaticTypes), d(TypeCtxs), d(DownTypes), d(UpTypes)
          HeadStates.forEach(defines(_chooseHeadAsync, dispose)), d(HeadStates)
          d(ArgsLeft)
        }
      }
    },
    adjust(ins, out, dout) {
      // Plumbing, to reverse the call.
      const Positions = ins[7], Objects = ins[8]
      let [evals, doneStages, i, Ats, Worlds, ScopeCtxs, Parents, PrevSiblings, Childs, ArgStaticEmbs, dArgStaticEmbs, StaticEmbs, DownEmbCtxs, UpEmbCtxs, DownEmbs, UpEmbs, dStaticEmbs, dDownEmbCtxs, dUpEmbCtxs, dDownEmbs, dUpEmbs] = interrupt(21)

      // Prepare to expand generative contexts with scope (`bound`) variables (and to switch between worlds and contexts).
      const curCtxs = _allocArray(11)
      const prevCtxs = alloc.params && alloc.params.GenContexts
      const prevWorld = alloc.world, prevParams = alloc.params, prevAt = alloc.At

      try {
        if (evals === undefined) {
          const l = adjustLoad
          UpEmbs = l(null), !isArray(UpEmbs) && _inexactReversal(true, UpEmbs)
          const N = UpEmbs.length
          DownEmbs = l(N)
          UpEmbCtxs = l(N)
          DownEmbCtxs = l(N)
          StaticEmbs = l(N)
          Childs = l(N)
          PrevSiblings = l(N)
          Parents = l(N)
          ScopeCtxs = l(N), (!isArray(ScopeCtxs) || !isArray(ScopeCtxs[0]) || typeof ScopeCtxs[0][0] != 'boolean') && _inexactReversal(true, ScopeCtxs)
          Worlds = l(N), !isArray(Worlds) && _inexactReversal(true, Worlds)
          Ats = l(N), !isArray(Ats) && _inexactReversal(true, Ats)
          ArgStaticEmbs = l(null), !isArray(ArgStaticEmbs) && _inexactReversal(true, ArgStaticEmbs)
          doneStages = l(ArgStaticEmbs.length)
          evals = l(ArgStaticEmbs.length)

          const a = _allocArray
          dArgStaticEmbs = a(ArgStaticEmbs.length)
          dStaticEmbs = a(N), dDownEmbCtxs = a(N), dUpEmbCtxs = a(N), dDownEmbs = a(N), dUpEmbs = a(N)
          dUpEmbs[0] = keep(dout[0])

          i = evals.length
        }

        for (; i > 0; --i) {
          const at = evals[i-1], done = doneStages[i-1]
          //if (!(done & 2048)) print('a', i-1, done.toString(2)) // ########################################
          //doneStages[i-1] |= 2048

          // Set the current world and object-spot and object-hyperparams in it.
          const spotDiffers = alloc.world !== Worlds[at] || alloc.At !== Ats[at]
          alloc.world = Worlds[at], alloc.params = Worlds[at].params, alloc.At = Ats[at]
          if (spotDiffers) _fillObjectHyperparams(Worlds[at], Ats[at])
          if (spotDiffers && alloc.params.GenContexts.length != 10) error("Invariant violated:", alloc.params.GenContexts)
          if (curCtxs[0] === undefined || spotDiffers) for (let j=0; j < 10; ++j) curCtxs[j] = alloc.params.GenContexts[j]
          alloc.params.GenContexts = curCtxs
          const ctx = curCtxs[10] = ScopeCtxs[at]

          if (done & 1024) {
            // Adjust `UpEmbs[Parents[at]] = alloc.params.ArgFailed(DownEmbs[at], UpEmbs[at], completedEmbCtxs[PrevSiblings[at]])`.
            const u = PrevSiblings[at]
            const ectxs = u !== Parents[at] ? UpEmbCtxs : DownEmbCtxs, dectxs = u !== Parents[at] ? dUpEmbCtxs : dDownEmbCtxs
            const a = _allocArray(3);  [a[0], a[1], a[2]] = [DownEmbs[at], UpEmbs[at], ectxs[u]]
            try {
              const b = adjust(alloc.params.ArgFailed, a, null, dUpEmbs[Parents[at]] || 0)
              if (!isArray(b)) error("Not an array:", b)
              const [dde, due, dec] = b;  _allocArray(b)
              if (dde) { const t = add(dDownEmbs[at] || 0, dde || 0);  dispose(dde);  dispose(dDownEmbs[at]), dDownEmbs[at] = t }
              if (due) { const t = add(dUpEmbs[at] || 0, due || 0);  dispose(due);  dispose(dUpEmbs[at]), dUpEmbs[at] = t }
              if (dec) { const t = add(dectxs[u] || 0, dec || 0);  dispose(dec);  dispose(dectxs[u]), dectxs[u] = t }
            } finally { _allocArray(a) }
            doneStages[i-1] &= ~1024
          }
          if (done & 512) {
            // Adjust `UpEmbCtxs[at] = alloc.params.ContextRefiner(DownEmbs[at], UpEmbs[at], completedEmbCtxs[PrevSiblings[at]]) || 0`.
            const u = PrevSiblings[at]
            const ectxs = u !== Parents[at] ? UpEmbCtxs : DownEmbCtxs, dectxs = u !== Parents[at] ? dUpEmbCtxs : dDownEmbCtxs
            const a = _allocArray(3);  [a[0], a[1], a[2]] = [DownEmbs[at], UpEmbs[at], ectxs[u]]
            try {
              const b = adjust(alloc.params.ContextRefiner, a, null, dUpEmbCtxs[at] || 0)
              if (!isArray(b)) error("Not an array:", b)
              const [dde, due, dec] = b;  _allocArray(b)
              if (dde) { const t = add(dDownEmbs[at] || 0, dde || 0);  dispose(dde);  dispose(dDownEmbs[at]), dDownEmbs[at] = t }
              if (due) { const t = add(dUpEmbs[at] || 0, due || 0);  dispose(due);  dispose(dUpEmbs[at]), dUpEmbs[at] = t }
              if (dec) { const t = add(dectxs[u] || 0, dec || 0);  dispose(dec);  dispose(dectxs[u]), dectxs[u] = t }
            } finally { _allocArray(a) }
            doneStages[i-1] &= ~512
          }
          if (done & 256) {
            // Adjust `UpEmbs[at] = alloc.params.FinishCall(StaticEmbs[at], DownEmbs[at], completedEmbCtxs[y])`.
            let [y] = interrupt(1)
            try {
              if (y === undefined) y = adjustLoad(null), typeof y != 'number' && _inexactReversal(true, y)
              const ectxs = Childs[at] ? UpEmbCtxs : DownEmbCtxs, dectxs = Childs[at] ? dUpEmbCtxs : dDownEmbCtxs
              const a = _allocArray(3);  [a[0], a[1], a[2]] = [StaticEmbs[at], DownEmbs[at], ectxs[y]]
              try {
                const b = adjust(alloc.params.FinishCall, a, null, dUpEmbs[at] || 0)
                if (!isArray(b)) error("Not an array:", b)
                const [dse, dde, dec] = b;  _allocArray(b)
                if (dse) { const t = add(dStaticEmbs[at] || 0, dse || 0);  dispose(dse);  dispose(dStaticEmbs[at]), dStaticEmbs[at] = t }
                if (dde) { const t = add(dDownEmbs[at] || 0, dde || 0);  dispose(dde);  dispose(dDownEmbs[at]), dDownEmbs[at] = t }
                if (dec) { const t = add(dectxs[y] || 0, dec || 0);  dispose(dec);  dispose(dectxs[y]), dectxs[y] = t }
              } finally { _allocArray(a) }
              doneStages[i-1] &= ~256
            } catch (err) { if (err === interrupt) interrupt.stack.push(y);  throw err }
          }
          if (done & 128) {
            // Adjust `UpEmbs[at] = alloc.params.FinishValue(StaticEmbs[at], DownEmbs[at])`.
            const a = _allocArray(2);  [a[0], a[1]] = [StaticEmbs[at], DownEmbs[at]]
            try {
              const b = adjust(alloc.params.FinishValue, a, null, dUpEmbs[at] || 0)
              if (!isArray(b)) error("Not an array:", b)
              const [dse, dde] = b;  _allocArray(b)
              if (dse) { const t = add(dStaticEmbs[at] || 0, dse || 0);  dispose(dse);  dispose(dStaticEmbs[at]), dStaticEmbs[at] = t }
              if (dde) { const t = add(dDownEmbs[at] || 0, dde || 0);  dispose(dde);  dispose(dDownEmbs[at]), dDownEmbs[at] = t }
            } finally { _allocArray(a) }
            doneStages[i-1] &= ~128
          }
          if (done & 64) {
            // Adjust `UpEmbs[at] = alloc.params.FinishTypeError(StaticEmbs[at], DownEmbs[at])`.
            const a = _allocArray(2);  [a[0], a[1]] = [StaticEmbs[at], DownEmbs[at]]
            try {
              const b = adjust(alloc.params.FinishTypeError, a, null, dUpEmbs[at] || 0)
              if (!isArray(b)) error("Not an array:", b)
              const [dse, dde] = b;  _allocArray(b)
              if (dse) { const t = add(dStaticEmbs[at] || 0, dse || 0);  dispose(dse);  dispose(dStaticEmbs[at]), dStaticEmbs[at] = t }
              if (dde) { const t = add(dDownEmbs[at] || 0, dde || 0);  dispose(dde);  dispose(dDownEmbs[at]), dDownEmbs[at] = t }
            } finally { _allocArray(a) }
            doneStages[i-1] &= ~64
          }
          if (done & 32) {
            // Adjust `UpEmbs[at] = alloc.params.FinishFail(DownEmbs[at])`.
            const a = _allocArray(1);  a[0] = DownEmbs[at]
            try {
              const b = adjust(alloc.params.FinishFail, a, null, dUpEmbs[at] || 0)
              if (!isArray(b)) error("Not an array:", b)
              const [dde] = b;  _allocArray(b)
              if (dde) { const t = add(dDownEmbs[at] || 0, dde || 0);  dispose(dde);  dispose(dDownEmbs[at]), dDownEmbs[at] = t }
            } finally { _allocArray(a) }
            doneStages[i-1] &= ~32
          }
          if (done & 28) {
            let [k, beginAt, endAt, pos, dpos] = interrupt(5)
            try {
              if (k === undefined) {
                // Adjust `ArgDownEmbs = alloc.params.ArgEmbedder(ArgStaticEmbs[j], DownEmbs[at], DownEmbCtxs[at]) || 0`.
                if ((done & 8) && endAt === undefined) endAt = adjustLoad(null), typeof endAt != 'number' && _inexactReversal(true, endAt)
                if (beginAt === undefined) beginAt = adjustLoad(null), typeof beginAt != 'number' && _inexactReversal(true, beginAt)

                let c // Accumulate gradients of children.
                if (done & 4) {
                  const n = Childs[at][beginAt-1]
                  c = keep(dDownEmbs[n])
                } else if (done & 8) {
                  const d = _allocArray(Childs[at].length - (beginAt-1))
                  for (let j = beginAt; j < endAt; ++j) {
                    const n = Childs[at][j-1]
                    dDownEmbs[n] == null && error("Unused result of ArgEmbedder, child dDownEmb:", dDownEmbs[n], 'at', at+'→'+n),
                    d[j-1 - (beginAt-1)] = dDownEmbs[n]
                  }
                  c = stack(d), _allocArray(d)
                } else if (done & 16) {
                  const n = Childs[at][beginAt-1]
                  if (dDownEmbs[n]) {
                    const d = _allocArray(1);  d[0] = dDownEmbs[n]
                    c = stack(d), _allocArray(d)
                  } else c = 0
                }
                const ase = ArgStaticEmbs[i-1]
                const de = done & 24 ? broadcastTo(DownEmbs[at], ase) : DownEmbs[at]
                const ec = done & 24 ? broadcastTo(DownEmbCtxs[at], ase) : DownEmbCtxs[at]
                const a = _allocArray(3);  [a[0], a[1], a[2]] = [ase, de, ec]
                try {
                  const b = adjust(alloc.params.ArgEmbedder, a, null, c)
                  if (!isArray(b)) error("Not an array:", b)
                  let [dase, dde, dec] = b;  _allocArray(b)
                  if (dArgStaticEmbs[i-1] !== undefined) error("hoh", dArgStaticEmbs[i-1])
                  if ((done & 24) && dde) { const t = sum(dde, 0);  dispose(dde), dde = t }
                  if ((done & 24) && dec) { const t = sum(dec, 0);  dispose(dec), dec = t }
                  dArgStaticEmbs[i-1] = dase
                  if (dde) { const t = add(dDownEmbs[at] || 0, dde || 0);  dispose(dde);  dispose(dDownEmbs[at]), dDownEmbs[at] = t }
                  if (dec) { const t = add(dDownEmbCtxs[at] || 0, dec || 0);  dispose(dec);  dispose(dDownEmbCtxs[at]), dDownEmbCtxs[at] = t }
                } finally { _allocArray(a);  if (done & 24) dispose(ec), dispose(de);  dispose(c) }

                k = adjustLoad(null);  typeof k != 'number' && _inexactReversal(true, k)
              }

              if (done & 12) {
                // Re-compute `pos`.
                if (pos === undefined) pos = done & 8 ? _lazyPositions(k) : !Positions ? _lazyPos(k) : _embValue(Positions[k])
                // Adjust `ArgStaticEmbs[i] = alloc.params.ArgUseAs(StaticEmbs[at], pos) || 0`.
                if (dArgStaticEmbs[i-1] !== undefined) {
                  const se = done & 8 ? broadcastTo(StaticEmbs[at], pos) : StaticEmbs[at]
                  const a = _allocArray(2);  [a[0], a[1]] = [se, pos]
                  try {
                    const b = adjust(alloc.params.ArgUseAs, a, null, dArgStaticEmbs[i-1] || 0)
                    if (!isArray(b)) error("Not an array:", b)
                    let dse;  [dse, dpos] = b;  _allocArray(b)
                    if ((done & 8) && dse) { const t = sum(dse, 0);  dispose(dse), dse = t }
                    if (dse) { const t = add(dStaticEmbs[at] || 0, dse || 0);  dispose(dse);  dispose(dStaticEmbs[at]), dStaticEmbs[at] = t }
                  } finally { _allocArray(a), (done & 8) && dispose(se) }
                  dispose( ArgStaticEmbs[i-1]),  ArgStaticEmbs[i-1] = undefined
                  dispose(dArgStaticEmbs[i-1]), dArgStaticEmbs[i-1] = undefined
                }
                // Adjust `pos = done & 8 ? _lazyPositions(k) : !Positions ? _lazyPos(k) : _embValue(Positions[k])`.
                const a = _allocArray(1);  a[0] = !Positions ? k : Positions[k]
                try {
                  if (!Positions) defines(done & 8 ? _lazyPositions : _lazyPos, adjust)(a, null, dpos)
                  else _disposeEachAndDealloc(defines(_embValue, adjust)(a, null, dpos))
                } finally { _allocArray(a) }
                dispose(pos), pos = null
                dispose(dpos), dpos = null
              } else if (done & 16) {
                // Adjust `ArgStaticEmbs[i] = _lazyUseAs([10, k])`.
                const Fits = _allocArray(2);  [Fits[0], Fits[1]] = [10, k]
                const a = _allocArray(1);  a[0] = Fits
                try { defines(_lazyUseAs, adjust)(a, null, dArgStaticEmbs[i-1]) }
                finally { _allocArray(a), _allocArray(Fits) }
                dispose(dArgStaticEmbs[i-1]), dArgStaticEmbs[i-1] = undefined
              }
              dispose(ArgStaticEmbs[i-1]), ArgStaticEmbs[i-1] = undefined
            } catch (err) { if (err === interrupt) interrupt.stack.push(k, beginAt, endAt, pos, dpos); else dispose(pos), dispose(dpos);  throw err }
            doneStages[i-1] &= ~28
          }
          if (done & 2) {
            // Adjust `UpEmbs[at] = regenerate(DownEmbs[at], DownTypes[at], Objects[ArgInds[at]-1])`.
            let [T, Obj] = interrupt(2)
            try {
              if (T === undefined) T = adjustLoad(null), T === undefined && (T = _onlyUndefined)
              if (Obj === undefined) Obj = adjustLoad(null), Obj === undefined && (Obj = _onlyUndefined)
              const a = _allocArray(3);  [a[0], a[1], a[2]] = [DownEmbs[at], T, Obj]
              try {
                const b = defines(regenerate, adjust)(a, null, dUpEmbs[at] || 0)
                if (!isArray(b)) error("Not an array:", b)
                const [dde] = b;  _allocArray(b)
                if (dde) { const t = add(dDownEmbs[at] || 0, dde || 0);  dispose(dde);  dispose(dDownEmbs[at]), dDownEmbs[at] = t }
              } finally { _allocArray(a) }
            } catch (err) { if (err === interrupt) interrupt.stack.push(T, Obj);  throw err }
            doneStages[i-1] &= ~2
          }
          if (done & 1) {
            // Adjust `[StaticEmbs[at], DownEmbCtxs[at], ?, ?, ?, ?, DownEmbs[at]] = _chooseHead(DownEmbs[at], DownTypes[at], ?)`.
            const a = _allocArray(1);  a[0] = DownEmbs[at]
            const c = _allocArray(7);  c[0] = dStaticEmbs[at] || 0, c[1] = dDownEmbCtxs[at] || 0, c[6] = dDownEmbs[at] || 0
            try {
              const b = defines(_chooseHead, adjust)(a, null, c)
              if (!isArray(b)) error("Not an array:", b)
              const [dde] = b;  _allocArray(b)
              dispose(dDownEmbs[at]), dDownEmbs[at] = dde
            } finally { _allocArray(c), _allocArray(a) }
            doneStages[i-1] &= ~1
          }
        }

        const a = _allocArray(7)
        a[0] = dStaticEmbs[0], a[1] = dDownEmbCtxs[0], a[6] = dDownEmbs[0]
        dStaticEmbs[0] = null, dDownEmbCtxs[0] = null, dDownEmbs[0] = null
        return a

      } catch (err) {
        if (err === interrupt) interrupt.stack.push(evals, doneStages, i, Ats, Worlds, ScopeCtxs, Parents, PrevSiblings, Childs, ArgStaticEmbs, dArgStaticEmbs, StaticEmbs, DownEmbCtxs, UpEmbCtxs, DownEmbs, UpEmbs, dStaticEmbs, dDownEmbCtxs, dUpEmbCtxs, dDownEmbs, dUpEmbs), evals = null
        throw err
      } finally {
        const spotDiffers = alloc.world !== prevWorld || alloc.At !== prevAt
        alloc.world = prevWorld, alloc.params = prevParams, alloc.At = prevAt, spotDiffers && _fillObjectHyperparams(prevWorld, prevAt)
        _allocArray(curCtxs), prevParams && (prevParams.GenContexts = prevCtxs)
        if (evals != null) {
          const d = _killArray, dead = _disposeEachAndDealloc
          d(evals), d(doneStages), d(Ats), d(Worlds), d(ScopeCtxs), d(Parents), d(PrevSiblings), Childs && Childs.forEach(d), d(Childs)
          dead(ArgStaticEmbs), dead(dArgStaticEmbs)
          dead( StaticEmbs), dead( DownEmbCtxs), dead( UpEmbCtxs), dead( DownEmbs), dead( UpEmbs)
          dead(dStaticEmbs), dead(dDownEmbCtxs), dead(dUpEmbCtxs), dead(dDownEmbs), dead(dUpEmbs)
        }
      }
    },
  },

  _killArray(a) { isArray(a) && _allocArray(a) },

  _lazyPos:{
    docs:`Returns the positional embedding of the arg index, in an \`autoWorld\`.
This caches results. To adjust their getting, \`_adjustLazyPos()\`.`,
    dispose:true,
    call(j) {
      const aw = alloc.world
      if (!aw.Pos) aw.Pos = [], aw.dPos = [], aw.PosAdj = []
      if (aw.Pos[j] === undefined) {
        if (alloc.params.Positions[j] === undefined) alloc.params.Positions[j] = varData(alloc.params.NewEmbedding(alloc.params.FeatureSize))
        const env = call.env, ias = _id(adjustSave), ial = _id(adjustLoad)
        const prevAdjSave = env[ias];  env[ias] = aw.PosAdj
        const prevAdjLoad = env[ial];  env[ial] = undefined
        try {
          aw.Pos[j] = _embValue(alloc.params.Positions[j])
          adjustSave(j)
        } finally { env[ias] = prevAdjSave, env[ial] = prevAdjLoad }
        dispose(aw.dPos[j]), aw.dPos[j] = 0
      }
      return keep(aw.Pos[j])
    },
    adjust(ins, out, dout) {
      if (!dout) return
      const [j] = ins, aw = alloc.world
      const t = add(aw.dPos[j], dout);  dispose(aw.dPos[j]), aw.dPos[j] = t
    },
  },

  _lazyPositions:{
    docs:`Like \`_lazyPos\`, but \`stack\`s all positions from \`1\` to \`finish\` (exclusive at the end).`,
    dispose:true,
    call(finish, Positions) {
      const aw = alloc.world
      if (!aw.StackedPositions) aw.StackedPositions = []
      if (!Positions && aw.StackedPositions[finish-1] !== undefined) return keep(aw.StackedPositions[finish-1])

      let [a = _allocArray(finish-1), i = 1] = interrupt(2)
      try {
        if (!Positions)
          for (; i < finish; ++i)
            a[i-1] = _lazyPos(i)
        else
          for (; i < finish; ++i)
            a[i-1] = _embValue(Positions[i])
        return keep(aw.StackedPositions[finish-1] = stack(a))
      } catch (err) { if (err === interrupt) interrupt.stack.push(a, i), a = null;  throw err }
      finally { _disposeEachAndDealloc(a) }
    },
    adjust(ins, out, dout) {
      if (!Positions && !dout) return
      const [finish, Positions] = ins
      let [dpos, i = finish] = interrupt(2)
      try {
        if (dpos === undefined) dpos = unstack(dout)
        if (!Positions)
          for (; i > 1; --i) { // Add gradient manually. It's faster.
            const t = add(aw.dPos[i-1], dpos[i-2]);  dispose(aw.dPos[i-1]), aw.dPos[i-1] = t
          }
        else
          for (; i > 1; --i) {
            const a = _allocArray(1);  a[0] = Positions[i-1]
            try { _disposeEachAndDealloc(defines(_embValue, adjust)(a, null, dpos[i-2])) }
            finally { _allocArray(a) }
          }
        dpos.forEach(dispose)
      } catch (err) { if (err === interrupt) interrupt.stack.push(dpos, i); else dpos.forEach(dispose);  throw err }
    },
  },

  _adjustLazyPos() {
    // Adjusts calls to `_lazyPos(j)`.
    const aw = alloc.world
    if (!aw.PosAdj) return
    if (aw.StackedPositions) // Clean up after `_lazyPositions`.
      for (let i=0; i < aw.StackedPositions.length; ++i) dispose(aw.StackedPositions[i]), aw.StackedPositions[i] = undefined
    let [j] = interrupt(1)
    const env = call.env, ias = _id(adjustSave), ial = _id(adjustLoad)
    const prevAdjSave = env[ias];  env[ias] = undefined
    const prevAdjLoad = env[ial];  env[ial] = aw.PosAdj
    try {
      // While stack is not empty, load index, then adjust `_embValue(alloc.params.Positions[j])`.
      while (aw.PosAdj.length) {
        if (j === undefined) {
          j = adjustLoad(null)
          if (typeof j != 'number') _inexactReversal(true, j)
        }
        const ins = _allocArray(1);  ins[0] = alloc.params.Positions[j]
        try { _disposeEachAndDealloc(defines(_embValue, adjust)(ins, null, aw.dPos[j])) }
        finally { _allocArray(ins) }
        dispose(aw.Pos[j]), aw.Pos[j] = undefined
        dispose(aw.dPos[j]), aw.dPos[j] = 0
        j = undefined
      }
    } catch (err) { if (err === interrupt) interrupt.stack.push(j);  throw err }
    finally { env[ias] = prevAdjSave, env[ial] = prevAdjLoad }
  },

  _callCtxEmb:{
    docs:`A transformer of \`stack\`ed \`UseAs\` embedding values that signifies "this is a call".
Makes func calls semantically distinct from funcs-as-values.`,
    call(embs) {
      const Pos = _lazyPos(0), Pos2 = embs && broadcastTo(Pos, embs.shape)
      try { return alloc.params.ArgUseAs(embs, Pos2) }
      finally { dispose(Pos2), dispose(Pos) }
    },
    adjust(ins, out, dembs) {
      const [embs] = ins
      const Pos = _lazyPos(0), Pos2 = embs && broadcastTo(Pos, embs.shape)
      const a = _allocArray(2);  [a[0], a[1]] = [embs, Pos2]
      try { return adjust(alloc.params.ArgUseAs, a, null, dembs) }
      finally { _allocArray(a), dispose(Pos2), dispose(Pos) }
    },
  },

  _savedCallCtxEmb:{
    docs:`Makes saved/temporary calls semantically distinct from other calls.`,
    call(embs) {
      let [callEmbs] = interrupt(1)
      try {
        if (callEmbs === undefined) callEmbs = _callCtxEmb(embs) || 0
        if (!alloc.params.SaveCall) return keep(callEmbs)
        return alloc.params.SaveCall(callEmbs)
      } catch (err) { if (err === interrupt) interrupt.stack.push(callEmbs), callEmbs = null;  throw err }
      finally { dispose(callEmbs) }
    },
    adjust(ins, out, dembs) {
      let [callEmbs, dCallEmbs] = interrupt(2)
      try {
        if (callEmbs === undefined) callEmbs = _callCtxEmb(ins[0]) || 0
        if (dCallEmbs === undefined) {
          if (!alloc.params.SaveCall) dCallEmbs = keep(dembs)
          else {
            const a = _allocArray(1);  a[0] = callEmbs
            try {
              const b = adjust(alloc.params.SaveCall, a, null, dembs)
              dCallEmbs = b[0] || 0, b[0] = null;  _disposeEachAndDealloc(b)
            } finally { _allocArray(a) }
          }
        }
        return defines(_callCtxEmb, adjust)(ins, null, dCallEmbs)
      } catch (err) { if (err === interrupt) interrupt.stack.push(callEmbs, dCallEmbs), callEmbs = dCallEmbs = null;  throw err }
      finally { dispose(callEmbs), dispose(dCallEmbs) }
    },
  },

  _savedValueCtxEmb:{
    docs:`Makes saved/temporary values semantically distinct from other values.`,
    call(embs) {
      if (!alloc.params.SaveCall) return keep(embs)
      return alloc.params.SaveCall(embs)
    },
    adjust(ins, out, dembs) {
      if (!alloc.params.SaveCall) { const a = _allocArray(1);  a[0] = keep(dembs);  return a }
      return adjust(alloc.params.SaveCall, ins, null, dembs)
    },
  },

  _ctxUseAs:{
    dispose:_(`_killArray`),
    call(ctx, putThrough, Fits, begin, end, replaceWith) {
      // Internal to `_lazyUseAs`.
      const aw = alloc.world
      if (!aw.UseAs) aw.UseAs = new Map
      if (!aw.UseAs.has(ctx)) aw.UseAs.set(ctx, _allocArray((ctx.length-1)/3|0))
      const cache = aw.UseAs.get(ctx)

      if (replaceWith !== undefined) {
        if (begin !== 0 || end !== 2) error("We're too much of a simpleton to understand changing many static embeddings at the same time", Fits)
        const mj = Fits[1], c = (mj - 1)/3 | 0
        if (cache[c] === undefined) error('huh', cache[c], ctx)
        if (!isArray(cache[c])) cache[c] = [cache[c]]
        cache[c].push(replaceWith)
        return
      }

      let [uncached = _allocArray(0), indexes = _allocArray(0), j = begin] = interrupt(3)
      try {
        for (; j < end; j += 2) {
          const mj = Fits === true ? 1+(j>>>1)*3 : Fits[j+1], c = (mj - 1)/3 | 0
          if (cache[c] === undefined) {
            let t = _embValue(ctx[mj+2])
            if (t === undefined) t = 0
            indexes.push(c)
            putThrough === 'id' ? (cache[c] = t) : uncached.push(t)
          }
        }
        if (uncached[0] == null) uncached.length = 0
        if (uncached.length) {
          let modified, stacked = stack(uncached)
          try { modified = putThrough(stacked)}
          finally { dispose(stacked) }
          if (_isDisposable(modified)) {
            const modified2 = unstack(modified);  dispose(modified)
            for (let i=0; i < indexes.length; ++i)
              cache[indexes[i]] = modified2[i], cache[indexes[i]] === undefined && print('WTF is this:', cache, 'at', indexes[i])
          } else
            for (let i=0; i < indexes.length; ++i)
              cache[indexes[i]] = null
          adjustSave(indexes), adjustSave(putThrough), adjustSave(ctx) // For `_adjustLazyUseAs`.
        } else if (indexes.length) // `putThrough` is 'id'.
          adjustSave(indexes), adjustSave(putThrough), adjustSave(ctx) // For `_adjustLazyUseAs`.
        else _allocArray(indexes), indexes = null // We don't need to compute anything new.
        _disposeEachAndDealloc(uncached)

        // Gather the requested items from `cache` into one array.
        //   Also, if an array (whole history), return only the last item.
        const ret = _allocArray((end - begin)>>>1)
        for (let j = begin; j < end; j += 2) {
          const mj = Fits === true ? 1+(j>>>1)*3 : Fits[j+1], c = (mj - 1)/3 | 0
          ret[(j - begin)>>>1] = isArray(cache[c]) ? cache[c][cache[c].length-1] : cache[c]
        }
        return ret
      } catch (err) { if (err === interrupt) interrupt.stack.push(uncached, indexes, j); else _disposeEachAndDealloc(uncached), _allocArray(indexes);  throw err }
    },
    adjust(ins, out, dout) {
      // Adds gradient.
      // `dout` is the `unstacked` array that we need to spread across `alloc.world.dUseAs.get(ctx)`.
      const [ctx, putThrough, Fits, begin, end, replaceWith] = ins
      const aw = alloc.world
      if (!aw.UseAs.has(ctx)) error("There was supposed to be a call to adjust")
      if (!aw.dUseAs) aw.dUseAs = new Map
      if (!aw.dUseAs.has(ctx)) aw.dUseAs.set(ctx, _allocArray((ctx.length-1)/3|0))
      const dcache = aw.dUseAs.get(ctx)

      if (replaceWith !== undefined) {
        // To adjust modification: return the accumulated gradient, as `_lazyUseAs`'s `replaceWith`'s adjustment.
        const cache = aw.UseAs.get(ctx)
        const mj = Fits[1], c = (mj-1)/3 | 0
        if (!isArray(cache[c])) _inexactReversal(true, 'when adjusting the VarUsed', Fits, cache[c])
        if (!isArray(dcache[c])) {
          const prev = dcache[c]
          dcache[c] = new Array(cache[c].length).fill(0), dcache[c][dcache[c].length-1] = prev
        }
        dispose(cache[c].pop())
        const v = dcache[c].pop()
        if ( cache[c].length == 1)  cache[c] =  cache[c][0]
        if (dcache[c].length == 1) dcache[c] = dcache[c][0]
        const a = _allocArray(2);  a[1] = v;  return a
      }

      for (let j = begin; j < end; j += 2) {
        // Scatter gradient, also handling the "we've modified this spot" case (by adding to the last adjustment).
        const mj = Fits === true ? 1+((j - begin)>>>1)*3 : Fits[j+1], c = (mj - 1)/3 | 0
        const a = isArray(dcache[c]) ? dcache[c] : dcache, n = isArray(dcache[c]) ? dcache[c].length-1 : c
        const i = (j - begin)>>>1
        if (dout[i]) { const t = add(a[n] || 0, dout[i] || 0);  dispose(a[n]), a[n] = t }
      }
    },
  },

  _lazyUseAs:{
    docs:`\`_lazyUseAs Fits\` or \`_lazyUseAs (ContextIndex ObjectIndex) ReplaceWith\`
Lazily computes the \`stack\`ed static embeddings \`UseAs\` of \`(…? ContextIndex ObjectIndex …?)\` (\`_genCtxFilter\`).
With an extra arg, this replaces the result with that arg (taking ownership of it), which does not \`interrupt\`.`,
    dispose:true,
    call(Fits, replaceWith) {
      const aw = alloc.world
      if (replaceWith !== undefined) {
        const ctx = alloc.params.GenContexts[Fits[0]]
        _ctxUseAs(ctx, null, Fits, 0, 2, replaceWith)

        if (aw.UseAsWhole && aw.UseAsWhole.has(ctx)) // Also invalidate the cached `stack`ed value if present.
          dispose(aw.UseAsWhole.get(ctx)), aw.UseAsWhole.delete(ctx)
        return
      }

      // Lazily create and fill alloc.world.UseAs and alloc.world.dUseAs (Maps from ctx to `stack`ed UseAs), in alloc.world.UseAsAdj.
      if (!Fits.length) return null
      let [embs, n = 0, j = 0, begin = 0, wholes, expected = Fits.length>>>1] = interrupt(6)
      const env = call.env, ias = _id(adjustSave), ial = _id(adjustLoad)
      const prevAdjSave = env[ias];  env[ias] = alloc.world.UseAsAdj || (alloc.world.UseAsAdj = _allocArray(0))
      const prevAdjLoad = env[ial];  env[ial] = undefined
      try {
        // Stack all embeddings of all contexts together.
        if (embs === undefined) embs = _allocArray(Fits.length>>>1)
        const ctxs = alloc.params.GenContexts
        for (; j < Fits.length+2; j += 2)
          if (j && (j >= Fits.length || Fits[j] !== Fits[begin] || !Fits[begin+1])) {
            if (!j || Fits[begin+1]) {
              const arr = _ctxUseAs(ctxs[Fits[begin]], autoWorld.ctxGetters[Fits[begin]], Fits, begin, j)
              for (let i=0; i < arr.length; ++i) embs[n++] = arr[i]
              _killArray(arr)
            } else { // Else, get the whole-context embedding, to `concat` later.
              if (!wholes) wholes = _allocArray(0)
              const ctx = ctxs[Fits[begin]]
              if (aw.UseAsWhole && aw.UseAsWhole.has(ctx))
                wholes.push(keep(aw.UseAsWhole.get(ctx)), begin+1)
              else {
                const arr = _ctxUseAs(ctx, autoWorld.ctxGetters[Fits[begin]], true, 0, ((ctx.length - 1)/3 | 0)*2)
                const e = stack(arr);  _killArray(arr)
                wholes.push(e, begin+1)
                if (!aw.UseAsWhole) aw.UseAsWhole = _allocMap()
                aw.UseAsWhole.set(ctx, keep(e))
              }
              --expected
            }
            begin = j
          }
        embs.length = n
        if (expected !== n)
          error("Internal error: expected", expected, "embeddings in total but got", embs.slice())
        let ret = embs[0] != null ? stack(embs) : null
        _allocArray(embs)

        // `_lazyUseAs` also accepts `(…? ContextIndex 0 …?)` for whole-context, not just `stack`ing but also `concat`ing, for speed.
        if (wholes) {
          const a = _allocArray(0)
          let n = 0, b
          ret && (a.push(ret), n += ret.shape[0])
          for (let i=0; i < wholes.length; i += 2)
            a.push(wholes[i]), b = Fits[wholes[i+1]] = _allocArray(2), [b[0], b[1]] = [n, n += wholes[i].shape[0]]
          const t = concat(a, undefined, 0);  _allocArray(a)
          if (n !== t.shape[0]) error("Oops, assumed wrong:", n, t)
          dispose(ret), ret = t
          _disposeEachAndDealloc(wholes)
        }

        return ret
      } catch (err) { if (err === interrupt) interrupt.stack.push(embs, n, j, begin, wholes, expected); else _allocArray(embs), _disposeEachAndDealloc(wholes);  throw err }
      finally { env[ias] = prevAdjSave, env[ial] = prevAdjLoad }
    },
    adjust(ins, out, dout) {
      // (Don't reverse the call's loop, or even handle interrupts, because `_ctxUseAs`'s `adjust` simply `add`s gradient.)
      const [Fits, replaceWith] = ins

      if (replaceWith !== undefined) {
        // Adjust `_ctxUseAs(alloc.params.GenContexts[Fits[0]], null, Fits, 0, 2, replaceWith)`.
        const a = _allocArray(6);  [a[0], a[1], a[2], a[3], a[4], a[5]] = [alloc.params.GenContexts[Fits[0]], null, Fits, 0, 2, replaceWith]
        try { return defines(_ctxUseAs, adjust)(a) }
        finally { _allocArray(a) }
      }

      if (!Fits.length) return null
      const grads = unstack(dout)
      try {
        const ctxs = alloc.params.GenContexts
        const grad = _allocArray(0)
        let begin = 0
        for (let j = 0; j < Fits.length+2; j += 2)
          if (j && (j >= Fits.length || Fits[j] !== Fits[begin] || j && isArray(Fits[begin+1]))) {
            if (!isArray(Fits[begin+1])) {
              const a = _allocArray(5);  [a[0], a[1], a[2], a[3], a[4]] = [ctxs[Fits[begin]], autoWorld.ctxGetters[Fits[begin]], Fits, begin, j]
              try { defines(_ctxUseAs, adjust)(a, null, grad) }
              finally { _allocArray(a) }
            } else {
              // Adjust `const arr = _ctxUseAs(ctx, autoWorld.ctxGetters[Fits[begin]], true, 0, ((ctx.length - 1)/3 | 0)*2)`.
              const ctx = ctxs[Fits[begin]], start = Fits[begin+1][0], end = Fits[begin+1][1]
              const a = _allocArray(5);  [a[0], a[1], a[2], a[3], a[4]] = [ctx, autoWorld.ctxGetters[Fits[begin]], true, start*2, end*2]
              try { defines(_ctxUseAs, adjust)(a, null, grads) }
              finally { _allocArray(a) }
            }
            grad.length = 0, begin = j, grad.push(grads[j])
          } else grad.push(grads[j])
        _allocArray(grad)
      } finally { _disposeEachAndDealloc(grads) }
    },
  },

  _adjustLazyUseAs() {
    // Adjusts `_lazyUseAs`/`_ctxUseAs` calls and resets value/gradient caches.
    const aw = alloc.world, AdjInfo = aw.UseAsAdj
    if (aw.UseAsWhole) aw.UseAsWhole.forEach(dispose), aw.UseAsWhole.clear()
    if (!AdjInfo) return
    const env = call.env, ias = _id(adjustSave), ial = _id(adjustLoad)
    const prevAdjSave = env[ias];  env[ias] = undefined
    const prevAdjLoad = env[ial];  env[ial] = AdjInfo
    let [ctx, putThrough, indexes, i = 0] = interrupt(4)
    try {
      while (AdjInfo.length) {
        if (putThrough === undefined) {
          ctx = adjustLoad(null)
          if (!isArray(ctx) || typeof ctx[0] != 'boolean' || (ctx.length-1)%3) _inexactReversal(true, ctx)
          putThrough = adjustLoad(null)
          indexes = adjustLoad(null)
          if (!isArray(indexes)) _inexactReversal(true, indexes)
        }
        // Now, adjust `putThrough` calls in `_ctxUseAs`.
        const cache = aw.UseAs.get(ctx), dcache = aw.dUseAs.get(ctx)
        if (putThrough !== 'id' && cache[0] !== null) {
          const ourOwn = _allocArray(0)
          const uncached = _allocArray(indexes.length), dmodified = _allocArray(indexes.length)
          for (let i = 0; i < indexes.length; ++i)
            isArray(cache[indexes[i]]) && _inexactReversal(true, "did not adjust all _lazyUseAs modifications: still got", cache[indexes[i]].slice()),
            uncached[i] = cache[indexes[i]], dmodified[i] = dcache ? dcache[indexes[i]] : 0

          // Fill spots for which we received no gradient with zeroes.
          if (dcache) {
            let shape
            for (let i = 0; i < indexes.length; ++i) if (_isDisposable(uncached[i])) shape = uncached[i].shape
            if (shape) { for (let i = 0; i < indexes.length; ++i) if (!dmodified[i]) ourOwn.push(dmodified[i] = zeros(shape)) }
            else if (indexes.length) error("Could not find the shape in", ...uncached, "for", ...indexes)
          }

          const uncached2 = stack(uncached), dmodified2 = dcache ? stack(dmodified) : 0
          const a = _allocArray(1);  a[0] = uncached2
          try {
            // Adjust the stacked-input `putThrough(stack(uncached))` call, writing back to `dcache`.
            const b = adjust(putThrough, a, null, dmodified2)
            if (!isArray(b)) error("Not an array:", b, "from", putThrough)
            if (b[0]) {
              const duncached = unstack(b[0]);  _disposeEachAndDealloc(b)
              if (duncached.length != indexes.length) error("Expected", indexes.length, "gradients but got", duncached.length)
              if (dcache)
                for (let i = 0; i < indexes.length; ++i)
                  dispose(dcache[indexes[i]]), dcache[indexes[i]] = duncached[i]
              else
                _disposeEachAndDealloc(duncached)
            } else _disposeEachAndDealloc(b)
          } finally {
            _allocArray(a), dispose(dmodified2), dispose(uncached2)
            _allocArray(dmodified), _allocArray(uncached)
            _disposeEachAndDealloc(ourOwn)
          }
          putThrough = 'id'
        }
        for (; i < indexes.length; ++i) {
          // Adjust `cache[indexes[i]] = _embValue(ctx[1+indexes[i]*3 + 2]) || 0`.
          const a = _allocArray(1);  a[0] = ctx[1+indexes[i]*3 + 2]
          try { _disposeEachAndDealloc(defines(_embValue, adjust)(a, null, dcache && dcache[indexes[i]] || 0)) }
          finally { _allocArray(a) }
          if ( cache) dispose( cache[indexes[i]]),  cache[indexes[i]] = null
          if (dcache) dispose(dcache[indexes[i]]), dcache[indexes[i]] = null
        }
        
        _allocArray(indexes)

        ctx = putThrough = indexes = undefined, i = 0
        if (interrupt.stack && interrupt.stack.length) error("Did not restore from an interrupt: still got", ...interrupt.stack, 'from last interrupt at', interrupt.last)
      }
      // Delete cache/dcache for each ctx.
      aw.UseAs.forEach(_disposeArraysOrTensors), aw.UseAs.clear(),
      aw.dUseAs.forEach(_disposeArraysOrTensors), aw.dUseAs.clear()
    } catch (err) {
      if (err === interrupt) interrupt.stack.push(ctx, putThrough, indexes, i)
      else
        aw.UseAs.forEach(_disposeArraysOrTensors), aw.UseAs.clear(),
        aw.dUseAs.forEach(_disposeArraysOrTensors), aw.dUseAs.clear()
      throw err
    } finally { env[ias] = prevAdjSave, env[ial] = prevAdjLoad }
  },

  _disposeArraysOrTensors(arr) {
    for (let i=0; i < arr.length; ++i)
      isArray(arr[i]) ? _disposeEachAndDealloc(arr[i]) : dispose(arr[i])
    _allocArray(arr)
  },

  _noTypeFiltering:[
    _(`settings`),
    true, // ###################################################
    `If checked, makes \`_chooseHead\` do no CPU-type-filtering of bases (but chosen types are still refined).
This allows caching more of the regeneration computation, and more GPU parallelization. But needs machine learning to learn types.`,
  ],

  _chooseHeadAsync:{
    docs:`\`_chooseHeadAsync:DownEmb→DownType→HeadState\`
Prepares to call \`_chooseHead\` (which would do a CPU \`sync\`). This is separated for parallel-processing speed, so that we can schedule all embedding-computing commands that we can before we request their results.`,
    call(DownEmb, DownType, allowed) {
      if (isArray(DownType) && DownType[0] === quote) return "PUT AS VALUE"
      if (isArray(DownType) && defines(DownType, _chooseHead) !== undefined) return "GOT THE FUNC"
      const ctxs = alloc.params.GenContexts
      let [stage = 0, Fits, UseAs, maxI, begin] = interrupt(5)
      try {
        switch (stage) {
          case 0:
            // Get candidates: filter GenContexts with `DownType` (if too deep, disallow calls), into `(… ContextIndex ItemIndex …)`.
            const HP = defines(alloc.world, deconstruct)[1]
            const allowCalls = autoMake.depth < HP.MaxDepth && autoMake.nodes < HP.MaxDAGNodes
            Fits = _genCtxsFilter(ctxs, DownType, allowCalls)

            // Filter out what we don't want: obvious self-recursion and not-in-scope temporary vars.
            let n = 0, ai = 0
            for (let i = 0; i < Fits.length; i += 2) {
              const mi = Fits[i], mj = Fits[i+1]
              if (mj) {
                const selfRecursing = ctxs[mi][0] && ctxs[mi][mj] === alloc.params.Object
                let notInScope = false
                if (mi === 10 && isArray(allowed)) { // The set of tmp vars can change, and this filtering-out allows re-using embeddings/grads.
                  while (ai < allowed.length && allowed[ai] < mj) ++ai
                  notInScope = (allowed[ai] !== mj)
                }
                if (!selfRecursing && !notInScope)
                  [Fits[n++], Fits[n++]] = [Fits[i], Fits[i+1]]
              } else [Fits[n++], Fits[n++]] = [Fits[i], Fits[i+1]]
            }
            Fits.length = n

            if (!Fits.length) // Fail.
              return _allocArray(Fits), "NO CANDIDATES"
          stage = 1;  case 1:
            // Compute embeddings to pass to `Choose` (all of them, `stack`ed).
            UseAs = _lazyUseAs(Fits)
          stage = 2;  case 2:
            // `_choose` the func/value among `UseAs` with `Choose`, then shadow the choice with `ChoiceEmbedder`; then with `typeRefine`.
            if (!instance.visual) {
              if (begin === undefined) begin = adjustUndo()
              const broad = UseAs !== null ? broadcastTo(DownEmb, UseAs) : null
              try { maxI = broad !== null ? _choose(alloc.params.Goal, UseAs, broad, alloc.params.Choose) : randomNat(Fits.length>>>1) }
              finally { dispose(broad) }
              //if (broad === null) print('chose', maxI) // ########################################
              if (typeof maxI != 'number' && (!_isDisposable(maxI) || maxI.size !== 1))
                error("Expected one max index but got", maxI, "when choosing from", UseAs, "with", alloc.params.Choose)
            } else { // Human UI for explainability (show only nodes and types, and no other info).
              // `begin` poses as `types` here, to not allocate a new interrupt-state spot.
                // `typeRefine` can't interrupt here, but it will consume interrupt-stack space.
              const nodes = [], calls = []
              const DT = _typeFinalize(DownType)
              if (begin === undefined) begin = _allocArray(Fits.length>>>1)
              for (let i = 0; i < Fits.length; i += 2) {
                const mi = Fits[i], mj = Fits[i+1], V = ctxs[mi][mj]
                nodes[i>>>1] = V && Object.getPrototypeOf(V) === bound ? label('v'+_id(V)) : V
                begin[i>>>1] === undefined && (begin[i>>>1] = bound(x => typeof x != 'string' ? undefined : label(x), typeRefine(ctxs[mi][mj+1], DT, undefined, true)))
                calls[i>>>1] = ctxs[mi][0]
              }
              maxI = _humanDAGAsk("Ask", nodes, begin, calls) || 0
              begin = undefined
            }
          stage = 3;  case 3:
            const a = _allocArray(4)
            ;[a[0], a[1], a[2], a[3]] = [Fits, UseAs, maxI, begin !== undefined ? call.env[_id(adjustSave)].splice(begin) : null]
            return a
        }
      } catch (err) {
        if (err === interrupt) interrupt.stack.push(stage, Fits, UseAs, maxI, begin)
        else Fits && _allocArray(Fits), dispose(UseAs), dispose(maxI)
        throw err
      }

      // .allowed (null or a sorted array of indexes of what's allowed in the very-temporary value context)
    },
    dispose(a) { isArray(a) && (_allocArray(a[0]), dispose(a[1]), dispose(a[2]), _destroyAdjustmentStack(a[3]), _allocArray(a)) },
  },

  _chooseHead:{
    docs:`\`_chooseHead:DownEmb→DownType→HeadState→(UseAs&EmbCtx&HaveType&TypeCtx&Node&IsCall&DownEmb)\`
Chooses what \`autoMake\` should generate.

Must always immediately follow after \`_chooseHeadAsync\`. Consumes \`HeadState\`.

\`type\` of the chosen option usually \`defines\` \`HaveType\`.

\`UseAs\` and \`HaveType\` encode what is statically needed for embeddings and types.
    (\`UseAs\`: a \`tensor\`. \`HaveType\`: \`(funcType …?)\` if \`IsCall\` is \`true\`, or anything.)
\`EmbCtx\` and \`TypeCtx\` encode what is dynamically the context for embeddings and types.
    (\`EmbCtx\`: a \`tensor\`. \`TypeCtx\`: a \`map\`, the third arg to \`typeRefine\`.)

If \`IsCall\` is \`false\`, \`Node\` is the DAG that computes a value, and it doesn't deserve to be saved in temporary generation contexts.
If \`IsCall\` is \`true\`, \`Node\` is the function to call.

The head of an array \`DownType\` \`defines\` this with the func that will replace it as the head of the generated call (instead of choosing the func/value) (the rest of args are generated from the given types). This accomodates \`tupleType\`.`,
    call(DownEmb, DownType, HeadState) {
      if (HeadState === "PUT AS VALUE") {
        // Quoted type, put it as value.
        const HP = defines(alloc.world, deconstruct)[1]
        const NextUseAs = _embValue(HP.PutAsValue)
        const Value = quote(_typeFinalize(DownType[1]))
        adjustSave("PUT AS VALUE")
        const a = _allocArray(8)
        ;[a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]] = [NextUseAs, null, DownType, _allocMap(), Value, false, keep(DownEmb), DownType]
        return a
      } else if (HeadState === "GOT THE FUNC") {
        // Don't choose the func, it's right here. (…Though its embedding is not, so tuple generation should underperform.)
        const Type = [funcType, ...DownType.slice(1), DownType]
        const Func = defines(DownType, _chooseHead)
        const Node = _allocArray(DownType.length).fill();  Node[0] = Func
        const EmbCtx = alloc.params.ChoiceEmbedder(DownEmb, DownEmb)
        adjustSave("GOT THE FUNC")
        const a = _allocArray(8)
        ;[a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]] = [keep(DownEmb), EmbCtx, Type, _allocMap(), Node, true, keep(DownEmb), DownType]
        return a
      } else if (HeadState === "NO CANDIDATES") {
        const a = _allocArray(8);  a[6] = keep(DownEmb), a[7] = DownType
        return adjustSave("NO CANDIDATES"), a
      }

      if (_isDisposable(HeadState[2])) { const t = sync(HeadState[2]);  dispose(HeadState[2]), HeadState[2] = t }

      let [Fits, AllUseAs, maxI, AdjStack] = HeadState

      let mi, mj
      if (_noTypeFiltering[1]) { // Decipher `_lazyUseAs`'s scheme.
        for (let i=0; i < Fits.length; i += 2)
          if (isArray(Fits[i+1]) && Fits[i+1][0] <= maxI && maxI < Fits[i+1][1]) {
            mi = Fits[i], mj = 1 + (maxI - Fits[i+1][0])*3;  break
          }
        if (mi === undefined) mi = Fits[maxI*2], mj = Fits[maxI*2+1]
      } else mi = Fits[maxI*2], mj = Fits[maxI*2+1]

      if (typeof mi != 'number' || typeof mj != 'number') error("Huh:", mi, mj, "given Fits", Fits, "and maxI", maxI)
      const ctxs = alloc.params.GenContexts, IsCall = !!ctxs[mi][0]
      let Node = ctxs[mi][mj], HaveType = ctxs[mi][mj+1]
      let [stage = 0, UseAs, EmbCtx, NextUseAs, adjLen, TypeCtx = _allocMap(), typeError = false, Type] = interrupt(8)
      try {
        switch (stage) {
          case 0:
            if (AdjStack) {
              // And splice in the adjustment stack (to pretend that `_chooseHeadAsync` happened right here), and make choices independent if necessary.
              const stack = call.env && call.env[_id(adjustSave)]
              if (stack) {
                const begin = stack.length
                stack.push(...AdjStack), HeadState[3] = AdjStack = null
                if (_independentChoices[1])
                  _makeAdjIndependent(maxI, _isDisposable(AllUseAs) ? AllUseAs.shape[0] : Fits.length>>>1, begin)
              } else _destroyAdjustmentStack(AdjStack), HeadState[3] = null
            }
          stage = 1;  case 1:
            UseAs = AllUseAs ? sliceOff(AllUseAs, maxI) : null

            // Prepare to cancel adjustment of type refinement.
            adjLen = adjustUndo()
          stage = 2;  case 2:
            // Shadow the choice with type-context refinement.
            if (Node === bound) {
              Type = undefined, _allocMap(TypeCtx), TypeCtx = null
            } else if (IsCall === true) {
              const def = _funcTypeOf(defines(Node, type))
              if (!isArray(def) || def[0] !== funcType || def.length <= 1)
                error("Expected a func type, but got", def, "for func", Func)
              if (HaveType !== def[def.length-1])
                error("Function type mismatch: output type of", Node, "is", def[def.length-1], "but ctx has", HaveType)
              if (typeRefine(HaveType, DownType, TypeCtx) === null) {
                if (typeof alloc.params.FinishTypeError != 'function')
                  error("We can't just fail to refine present+wanted types after filtering it fine:", HaveType, DownType, "with head", Node)
                typeError = true
              }
              Type = def // Know args of types.
            } else Type = HaveType

            // Cancel any possible adjustment of types, because we won't be adjusting them.
            if (adjLen !== undefined) adjustUndo(adjLen)
          stage = 3;  case 3:
            // Shadow the choice with embedding-context refinement.
            if (!typeError) {
              EmbCtx = IsCall ? alloc.params.ChoiceEmbedder(UseAs, DownEmb) : null
              adjustSave(IsCall)

              // Also, if picked a node, remember this fact, to not go over limits later.
              if (IsCall) ++autoMake.nodes
            }
          stage = 4;  case 4:
            // Use the embedding, modifying it in-place (but only if in very-tmp ctx, because all other types should be finalized anyway).
            if (!typeError && mi === 10 && ctxs[mi][0] === false && typeof alloc.params.VarUsed == 'function') {
              NextUseAs = alloc.params.VarUsed(UseAs, DownEmb)
              const a = _allocArray(2);  [a[0], a[1]] = [mi, mj]
              try { _lazyUseAs(a, keep(NextUseAs)) }
              finally { _allocArray(a) }
            } else
              NextUseAs = keep(UseAs)
          stage = 5;  case 5:
            // Save the picked `UseAs` and in-context indexes (for adjustment).
            const b = _allocArray(4)
            if (_independentChoices[1]) {
              const inds = _allocArray(2);  [inds[0], inds[1]] = [mi, mj]
              b[0] = UseAs
              b[1] = inds
              _disposeArraysOrTensors(Fits)
            } else {
              b[0] = keep(AllUseAs)
              b[1] = Fits
            }
            b[2] = maxI
            b[3] = typeError
            adjustSave(b)

            dispose(AllUseAs), HeadState[1] = null, _allocArray(HeadState), HeadState = null

            if (typeError) {
              const a = _allocArray(8)
              a[0] = NextUseAs, a[6] = keep(DownEmb), a[7] = DownType
              dispose(UseAs), dispose(EmbCtx), TypeCtx && _allocMap(TypeCtx), defines(_chooseHeadAsync, dispose)(HeadState)
              return a
            }

            // Return a whole call to fill (with empty spots for args), not just its func.
            if (IsCall) { const N = Node;  Node = _allocArray(N === bound ? 5 : Type.length-1).fill();  Node[0] = N }

            const a = _allocArray(8)
            ;[a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]] = [NextUseAs, EmbCtx, Type, TypeCtx, Node, IsCall, keep(DownEmb), DownType]
            return a
        }
        error("_chooseHead got an unrecognized stage (interrupt-state corrupted):", stage, UseAs, EmbCtx, NextUseAs, adjLen, TypeCtx, 'with last interrupt at', _resolveStack(interrupt.last))
      } catch (err) {
        if (err === interrupt) interrupt.stack.push(stage, UseAs, EmbCtx, NextUseAs, adjLen, TypeCtx, typeError, Type)
        else dispose(UseAs), dispose(EmbCtx), dispose(NextUseAs), TypeCtx && _allocMap(TypeCtx), defines(_chooseHeadAsync, dispose)(HeadState)
        throw err
      }
    },
    dispose:_(`_disposeEachAndDealloc`),
    adjust(ins, out, dout) {
      const DownEmb = ins[0]
      const [dua, dec] = dout

      let [stage = 0, UseAsAndIndexes, dUseAs, dNextUseAs, dEmbCtx, dDownEmb = keep(dout[6])] = interrupt(6)
      try {
        switch (stage) {
          case 0: {
            // Load what we'd need. And immediately, if we're on a short-path, return.
            const a = UseAsAndIndexes = adjustLoad(null)
            if (a === "PUT AS VALUE") {
              // Adjust `NextUseAs = _embValue(HP.PutAsValue)`.
              const HP = defines(alloc.world, deconstruct)[1]
              const ins = _allocArray(1);  ins[0] = HP.PutAsValue
              try { _disposeEachAndDealloc(defines(_embValue, adjust)(ins, null, dua)) }
              finally { _allocArray(ins) }
              const a = _allocArray(1);  a[0] = dDownEmb;  return a
            } else if (a === "GOT THE FUNC") {
              // Adjust `return [keep(DownEmb), ChoiceEmbedder(DownEmb, DownEmb), FuncType, new Map, Node, true, keep(DownEmb)]`.
              let dDownEmbs, ins = _allocArray(2);  [ins[0], ins[1]] = [DownEmb, DownEmb]
              try { dDownEmbs = adjust(alloc.params.ChoiceEmbedder, ins, null, dec) }
              finally { _allocArray(ins) }
              let dde = dua || 0
              if (isArray(dDownEmbs)) {
                if (dDownEmbs[0]) { const t = add(dde || 0, dDownEmbs[0] || 0);  dispose(dde), dde = t }
                if (dDownEmbs[1]) { const t = add(dde || 0, dDownEmbs[1] || 0);  dispose(dde), dde = t }
                _disposeEachAndDealloc(dDownEmbs)
              }
              if (dde) { const t = add(dDownEmb || 0, dde || 0);  dispose(dde);  dispose(dDownEmb), dDownEmb = t }
              const a = _allocArray(1);  a[0] = dDownEmb;  return a
            } else if (a === "NO CANDIDATES")
              return dispose(dDownEmb), _allocArray(0)
            else if (!isArray(a) || a.length != 4 || !isArray(a[1]))
              UseAsAndIndexes = null, _inexactReversal(true, a)
            dEmbCtx = keep(dec)
          } stage = 1;  case 1: {
            // Adjust in-place modification of embedding.
            const ctxs = alloc.params.GenContexts
            const typeError = UseAsAndIndexes[3], maxI = UseAsAndIndexes[2], Fits = UseAsAndIndexes[1]
            const mi = _independentChoices[1] ? Fits[0] : Fits[maxI*2]
            const mj = _independentChoices[1] ? Fits[1] : Fits[maxI*2+1]

            if (!typeError && mi === 10 && ctxs[mi][0] === false && typeof alloc.params.VarUsed == 'function') {
              // Here, `dUseAs` refers to `NextUseAs`'s gradient, and at the end is set to `UseAs`'s gradient.
              if (dUseAs === undefined) { // Adjust `_lazyUseAs([mi, mj], NextUseAs)`.
                const mmij = _allocArray(2);  [mmij[0], mmij[1]] = [mi, mj]
                const a = _allocArray(2);  [a[0], a[1]] = [mmij, true]
                try {
                  const b = defines(_lazyUseAs, adjust)(a)
                  dUseAs = b[1] || 0;  _allocArray(b)
                } finally { _allocArray(a), _allocArray(mmij) }
                if (dua) { const t = add(dUseAs || 0, dua || 0);  dispose(dua);  dispose(dUseAs), dUseAs = t }
              }

              // Adjust `NextUseAs = alloc.params.VarUsed(UseAs, DownEmb) || 0`
              const a = _allocArray(2);  [a[0], a[1]] = [UseAsAndIndexes[0], DownEmb]
              try {
                const b = adjust(alloc.params.VarUsed, a, null, dUseAs)
                if (!isArray(b) || b.length != 2) error(b, "is not an array, from adjusting", alloc.params.VarUsed)
                dispose(dUseAs), dUseAs = b[0]
                const dde = b[1];  _allocArray(b)
                if (dde) { const t = add(dDownEmb || 0, dde || 0);  dispose(dde);  dispose(dDownEmb), dDownEmb = t }
              } finally { _allocArray(a) }
            } else {
              // Adjust `NextUseAs = keep(UseAs)`.
              dUseAs = _independentChoices[1] ? keep(dua) : broadcastTo(dua, UseAsAndIndexes[0])
            }
          } stage = 2;  case 2: {
            // Adjust `EmbCtx = ChoiceEmbedder(UseAs, DownEmb)`.
            const typeError = UseAsAndIndexes[3]
            if (!typeError) {
              let [IsCall] = interrupt(1)
              if (IsCall === undefined) IsCall = adjustLoad(null) || null
              if (IsCall) {
                const UseAs = _independentChoices[1] ? UseAsAndIndexes[0] : sliceOff(UseAsAndIndexes[0], UseAsAndIndexes[2])
                const a = _allocArray(2);  [a[0], a[1]] = [UseAsAndIndexes[0], DownEmb]
                try {
                  const b = adjust(alloc.params.ChoiceEmbedder, a, null, dEmbCtx)
                  let dua, dde;  [dua, dde] = b;  _allocArray(b)
                  if (!_independentChoices[1]) { const t = broadcastTo(dua, UseAsAndIndexes[0]);  dispose(dua), dua = t }
                  if (dua) { const t = add(dUseAs || 0, dua || 0);  dispose(dua);  dispose(dUseAs), dUseAs = t }
                  if (dde) { const t = add(dDownEmb || 0, dde || 0);  dispose(dde);  dispose(dDownEmb), dDownEmb = t }
                } catch(err) { if (err === interrupt) interrupt.stack.push(IsCall);  throw err }
                finally { _allocArray(a), !_independentChoices[1] && dispose(UseAs) }
              }
            }
          } stage = 3;  case 3: {
            // Adjust `maxI = _choose(Goal, UseAs, DownEmb, Choose)`.
            const de = _independentChoices[1] ? DownEmb : broadcastTo(DownEmb, UseAsAndIndexes[0])
            const a = _allocArray(4);  [a[0], a[1], a[2], a[3]] = [alloc.params.Goal, UseAsAndIndexes[0], DownEmb, alloc.params.Choose]
            try {
              // Assume that `Choose` doesn't care about outputs (as `func`s don't).
              const b = defines(_choose, adjust)(a, null, undefined)
              let dua, dde;  [dua, dde] = [b[1], b[2]]
              dispose(b[0]), _allocArray(b)
              if (!_independentChoices[1] && dde) { const t = sum(dde, 0);  dispose(dde), dde = t }
              if (dua) { const t = add(dUseAs || 0, dua || 0);  dispose(dua);  dispose(dUseAs), dUseAs = t }
              if (dde) { const t = add(dDownEmb || 0, dde || 0);  dispose(dde);  dispose(dDownEmb), dDownEmb = t }
            } finally { _allocArray(a), !_independentChoices[1] && dispose(de) }
          } stage = 4;  case 4: {
            // Adjust `UseAs = _lazyUseAs(Fits)`, though only for the picked index (if choices are independent).
            const grad = _independentChoices[1] ? tf.expandDims(dUseAs) : dUseAs
            const a = _allocArray(1);  a[0] = UseAsAndIndexes[1]
            try { _disposeEachAndDealloc(defines(_lazyUseAs, adjust)(a, null, grad)) }
            finally { _allocArray(a), _independentChoices[1] && dispose(grad) }

            _allocArray(UseAsAndIndexes[1]), _disposeEachAndDealloc(UseAsAndIndexes), UseAsAndIndexes = null
            dispose(dUseAs), dUseAs = null
            dispose(dEmbCtx), dEmbCtx = null

            // Return [dDownEmb].
            const r = _allocArray(2)
            r[0] = dDownEmb
            return r
          }
        }
      } catch (err) {
        if (err === interrupt) interrupt.stack.push(stage, UseAsAndIndexes, dUseAs, dNextUseAs, dEmbCtx, dDownEmb)
        else UseAsAndIndexes && _allocArray(UseAsAndIndexes[1]), _disposeEachAndDealloc(UseAsAndIndexes), dispose(dUseAs), dispose(dNextUseAs), dispose(dEmbCtx), dispose(dDownEmb)
        throw err
      }
    },
  },

  _saveCreatedNode:{
    docs:`\`_saveCreatedNode Emb Type Node\`
Saves the created embedding/node/type into a temporary context in \`alloc.'params'.'GenContexts'\` (either of funcs or values, depending on the type).
(The input array can be deallocated afterwards.)`,
    interrupt:false,
    call(Emb, Type, Node) {
      if (Node === null) return
      const ctxs = alloc.params.GenContexts
      const emb = varData(keep(Emb))
      pushToContext(ctxs[8], Node, Type, emb, true) // See `_equalizeContexts`.
      pushToContext(ctxs[9], Node, Type, emb, true) // No type-specific retrieval funcs, for parallelization.
      // `regenerate` will limit temporary context sizes for us.
      return emb
    },
  },

  Types:{
    docs:`A way to separate possible from impossible.`,
    tutorial:[
      `It's always a good idea to take your time to know what words mean. So.

Types…

The chirping of crickets in a meadow under a darkening sky…

An infant's cry, prompting hope of a new life, before the baby gets up and trots away…

A body full of life and nutrients, being consumed by maggots crawling under the skin, turning it into a dessicated shell…

Types are none of those.

Types rigidly define what programs are correct, for generating programs.
Ever since humanity first said "if X then Y", it was always trying to put the world into some rigid system.
But types also have a purpose that actually has meaning: to rigidly guide program generation away from wrong paths. It's for efficiency.

Types are supposed to contain values, and here, all we care about is extracting properly-typed values from what we have.
With \`instance\`, we can check correctness of implementation, which is all that we really need in life.
Something like this is what we want:`,
      [
        _(`fancier`),
        `instance ^DAGType(^(1 2 3))`,
        function(r) { return isArray(r) && r[0] === quote && r[1][0] === 1 && r[1][1] === 2 && r[1][2] === 3 },
      ],
      `I understand why you don't want to continue.
Types are scary. It's one of the T-words, same as tarantulas and T-posing.
Despite all the possible words about unconstrained intelligence of humans, we are still animals, and have only three responses to fear {https://rdcu.be/NdvN}.
The least stressful is to freeze, and remain oppressed by slavery and ignorance. To run away is scarier, and does not help much in slavery and ignorance.
To head to danger is scariest, but it also rewards circuits that maximize dopamine. And to reward those circuits of yours even more, the least I can do is give you unconditional love.
So, remember, even through darkest times: you will always love me.



Before we continue, we must understand exactly how we will specify and use types.

Program generation (\`autoMake\`) either {picks-and-returns a value} or {picks a function and recurses to generate its arguments}.
To give this process human-defined structure, generation is augmented with types: also given a type statically (attached to the value/func candidate), also given a type dynamically (wants), also return a type (is) (\`instance\` omits the returned type, and only gives the value).

In particular, we go down-right-up:
    Down: any value/func will have its static/output type \`typeRefine\`d with the dynamic (wanted) type, and the non-\`null\` one is picked. This creates the type context.
    Right: if making a call, we also generate func args, progressively refining the type context with the returned refined types.
    Up: then we return the refined output type.

\`typeRefine\` refines equal-length arrays item-wise, and non-arrays must be reference-equal. \`null\` indicates failure.
We can also have type variables (a \`'string'\`), and a context that holds their values (the same for each generated call).

Some examples of type refinement (feel free to change):`,
      [
        _(`fancier`),
        `typeRefine 1 2`,
      ],
      [
        _(`fancier`),
        `typeRefine ^(1 2 'c') ^('a' 'b' 'b')`,
      ],
      [
        _(`fancier`),
        `typeRefine arrayType('a',5)⇒'a' arrayType(tensorType 1 2 3,5)⇒(tensorType 1 2 3)`,
      ],
      `That was an account of how we generate DAGs (Directed Acyclic Graphs: here, a network of arrays without cycles-like-\`a a:(0 1 2 a 4 5)\`; a \`call\`'s output (array) can be another \`call\`'s input (array item)).

But the general case of arbitrary connectivity also includes cycles (for example, in function graphs, such cycles are named "recursion").

So how would we combine "take and return a type" with "has cycles"? We need a fixed point.

There are two ways: either do \`typeRefine\` on a cycle until it converges (we contrived the type-language to make this automatic and instant), or specify "what that would converge to" directly.

We have the luxury of doing the latter. Top-level generation (such as \`instance\`) requires that a type \`defines\` \`alloc\`.
Such types are \`\`definersOf alloc\`\`.


Now, with that knowledge, let's go into testing mode.
Of course, I cannot actually give you understanding, but I can give you tools to learn it.
Let hovering (highlighting equal values, especially useful for complex graphs) (\`v\` in \`Commands\` or \`\`settings ^_hoverHighlightsDOMValues\`\` toggles it) and right-clicking (\`contextMenu\`s showing \`Types\`, and \`basic\` serializations, removing ambiguity) hold your hand when you're lost.`,
      [
        _(`fancier`),
        `A:(concept type funcType(0) call func(5))`,
      ],
      [
        _(`fancier`),
        `instance ^DAGType(0) ^A()`,
      ],
      `Now, put output as input:`,
      [
        _(`fancier`),
        `B:(concept type 0⇒1 call 0→0*3)`,
      ],
      [
        _(`fancier`),
        `instance ^DAGType(1) ^(A B)`,
      ],
      `Now, let's generate not just naked DAGs but \`func\`tions.

Graphs of those can see each other, and decide to recurse (often causing an infinite loop on execution). With \`Types\`, it's theoretical generality that we're after, not practicality.
But in the simple case of one func, we exclude self-recursion because we cannot generate control-flow (\`select\`) within one func (though func-as-value is still permitted).
\`0⇒2\` here cannot recurse:
`,
      [
        _(`fancier`),
        `C:(concept type 1⇒2 call 1→1*7)`,
      ],
      [
        _(`fancier`),
        `instance ^funcType(0,2) ^(B C)`,
      ],
      `Don't worry about what exactly the \`docs\` say the generated \`autoFunc\`s are.
Suffice to say, they're surprise tools that will help us out later.
For now, let the voice of love guide you to the light.

Now.
Something mildly non-trivial: passing a function in.
Evaluate the thing below, and you will get something that no one on this planet has ever seen before.
Do it several times. Often, the body will be \`null\`, indicating failure (we don't backtrack if choices have led to impossible types, or if we're in too deep); sometimes, a simple DAG; sometimes, an unsightly abomination out of this world.
`,
      [
        _(`fancier`),
        `instance ^funcType(arrayType(0,'a'),0) ^(A getLast loop (concept type 0⇒0⇒0 call add))`,
      ],
      `The thing above may not generate complex structure often, because the generality of types of \`getLast\`/\`loop\` misleads like the devil, but it does happen. For those cases, how about \`\`settings ^_colorVariables\`\`? Your world, your rules.

But functions are not the only things of relevance.
A \`concept\` \`defines\` functions. This is used very often in Conceptual, so we'd like to auto-use this.
For example, if ignoring \`mergeAdjustment\`/\`adjustSave\`/\`adjustLoad\`, definitions of \`adjust\` should be like:`,
      [
        _(`fancier`),
        `D:(concept type 0⇒1⇒2 call mul)`,
      ],
      [
        _(`fancier`),
        `E:(concept type 2⇒0 call exp)`,
      ],
      [
        _(`fancier`),
        `F:(concept type 2⇒1 call log)`,
      ],
      [
        _(`fancier`),
        `instance ^(conceptType call funcType(A,B,O) adjust DAGType(A&B,_ins _out _dout,A&B O O)) ^(D E F) A:0 B:1 O:2`,
      ],
      `You've done well so far.

["Eyes. Grant us eyes."]
Oh.
That's right.
Bugs can only be rooted out with perfect control over their environment.
Experiencing what an algorithm experiences is the best way to understand it, and so it's the only way.

How about this:`,
      [
        _(`fancier`),
        `instance ^DAGType(0&1,_ins _out _dout,0&1 2 2) ^(D E F) true`,
        function() { return true },
      ],
      `It's not a very polished UI because I'm tired of making them, but it's good enough.

I'd recommend returning to that \`loop\`/\`getLast\`-using example and adding \`true\` at the end, and playing around with it to get an intuition.
  An example insight is that \`getLast\` often tries to look for arrays with items of non-existent types, failing the generation.
    Another is: \`loop\` is rarely used randomly, but manually, we know what to avoid and compose 9-loops-deep towers.
      Another is that we jump around everywhere, visiting nodes in breadth-first order. For comprehensibility: \`\`settings ^_alwaysGenDepthFirst\`\`.
        Another is that variables (\`a+a*2 a:?\`) are used first and \`bound\` later.
          Another is that max depth is 10.


Next, we'll be annotating some useful functions of \`Self\` with types.
It's like crawling along the ground, I know, but we cannot automatically generate anything without this.
Everything will eventually be surpassed, so we'd like to specify not the structures that we ourselves made, but how to make them.
\`\`elemCollapse \\elem('text','["You''re doing it so that you don''t have to do it? Your story makes no sense."] Tsk, tsk. Not what I said. The goal is everything, not nothing.')\`\`
That's the real purpose of Conceptual. Tutorials are one way of doing that; auto-generation is another.


Okay, the annotating is now over.
We have \`\`definersOf(type).'length'\`\` \`type\`d functions: \`\`elemCollapse \\serialize(definersOf(type),basic,undefined,serialize.'displayed')\`\`.
Users ought to use them all, meaning that \`definersOf(type)\` should be the generative context.

We have \`exp\`, typed \`\`defines exp type\`\`.
We have \`zeros\`, typed \`\`defines zeros type\`\`.
We have \`matMul\`, typed \`\`defines matMul type\`\`.
Machine learning is gone, reduced to atoms.

We have \`last\`, typed \`\`defines last type\`\`.
We have \`transform\`, typed \`\`defines transform type\`\`.
We have \`loop\`, typed \`\`defines loop type\`\`.
Space of programs rapidly expands.

We have \`try\`, typed \`\`defines try type\`\`.
We have \`timeLimit\`, typed \`\`defines timeLimit type\`\`.
We have \`select\`, typed \`\`defines select type\`\`.
Everything of value becomes isolated islands in a sea of darkness, impossible to see or reach.
Eternal greatness exists only within humans.
Sing a song of sorrow in a world
where love has perished.
`,
      [
        _(`fancier`),
        `instance arrayType(tensorType 64,'Length')⇒tensorType(64) definersOf(type) true`,
        function() { return true },
      ],
      `I spent so long fixing bugs, I forgot what the narration was supposed to be.
Many are still un-fixed, but most do not complain by throwing \`error\`s.
Good enough for now. I've had enough.

Um…

Ah, yes, look at how many \`null\`s there are in random generation, and how pointless the non-\`null\` functions are.
And when picking manually, look at how many superfluous options like \`timeLimit\` or (often) \`getLast\` there are.
Superfluous as long as we have no functions that we'd like to call/limit, or arrays of what we need, that is.

What went wrong with random typed generation?

There are three things, actually: random, typed, and generation.

  🖤 Random.
      This system picks randomly (technically, \`instance\` makes \`autoMake\` pick the option with the max \`randomFloat()\`), whereas your brain is even incapable of that, having to rely on dice and such for random number generation.
      You maximize something else: a prediction that depends on where you are in the generation, extremely vaguely described as "how interesting is this".
      The UI suggests that it is inferred from reading the half-complete state \`\`elemCollapse(elem 'text' '(In machine learning, this suggests GPT models)')\`\`, but you can also follow the process and infer it from the history of what args we need and what calls we created (down then right then up the call tree), which also is exactly the flow of type computation \`\`elemCollapse(elem 'text' stringToDoc('(In machine learning, this means recurrent and recursive NNs combined — though \`autoMake\` only allows the recursive aspect… Pro: potential parallelization, con: a special case)'))\`\`.
      …The prediction for an option could also depend on other options \`\`elemCollapse(elem 'text' 'such as "(do we have arrays of this type, or could we make, or do we even want to")')\`\`. \`autoMake\` (and its \`Choose\`) imposes separation of options, though, which can allow great efficiency but is also a special case.
      This covers all possible inferences anyone could make from recursively-picked arrays of options (which creates DAGs for our \`func\`tions).

  🖤 Typed.
      This system shadows every generated value (DAG node) with its type, which is a thing with pre-defined refinement rules with some properties (mostly transitivity and associativity).
      Language of types is Turing-complete \`\`elem 'text' '(at least in theory; my own version/implementation may be bad)'\`\`, and is useful for low-level code and proof checking, but not much else.
      ["But types are great for ① describing all possible behaviors and side-effects of functions, ② documenting code, and ③ ensuring user mistakes are impossible."]
      Boy. Your definition of "great" needs work. It's probably the Stockholm syndrome talking.
      ① Where's the "this is probably fast/slow" type? Where's the "this can be partially-evaluated under these conditions" type, or the "this particular arrangement of functions will delete all files" type, or the "divide by two, times three, related to this thing, with some offsets that make sense" type, or the "this particular arrangement of functions is likely to cause this much dopamine to be released in this user's brain" type? Adding more types will always improve the situation at the cost of maintenance, but will never cover everything.
      ② Don't try to shore up deficiencies of picking systems (such as randomness) with more precise type systems. Don't pretend that you know everything. Docs should be more of a suggestion, for optimal usage.
      ③ There is another way of making mistakes impossible: make users never make mistakes, and deliver all information perfectly. A programming environment can deliver things precisely (which is why Conceptual is a programming environment too). And if you control the user, such as if it is a program that you make, then just… fix bugs, and allow learning from mistakes.
      (I can't even begin to tell you how annoying type purists and evangelists are: just like any other religion.)

  🖤 Generation.
      The only real way to learn is to make mistakes, and repeat.
      \`call\` is not enough, we want \`callAdjust\`.
      Regeneration is what we want.


Well, if random typed generation is so bad, then the natural question is: what will replace it?
Have you ever heard about reinforcement learning, and machine learning? \`\`elemCollapse(elem 'text' '(You thought I would add something here, but I won''t.)')\`\`
Have you ever heard of learnable embedding of operations? \`\`elemCollapse(elem 'text' '(For example, MuZero learns to plan: shadow all environment responses to its actions and unroll action sequences.)')\`\`

But that's another story for another day.



For now, have this snack, you've earned it: 🥔🥕🍄.

And click this button too, you've earned it: \`\`button (jsEval "function() { localStorage.Types = '1' }") "completedTypes" "Unlocks neural DAG regeneration."\`\`.

And have these \`REPL\`s too, you've earned it: \`\`elemCollapse func(REPL fancier)\`\` \`\`elemCollapse func(REPL fancy)\`\` \`\`elemCollapse func(REPL basic)\`\` \`\`elemCollapse func(REPL stringLanguage)\`\`.


With this initial crack at auto-regeneration completed, \`tutorial regenerate\` is now unlocked. Check it out, and goodbye.`,
    ],
    philosophy:`In the now-distant past, everytime I tried to express my inner soul or ideals I would end up looking like a cringeworthy idiot, so I learned to block out my own randomness. Now I learn to take risks. Let's take some.`,
    readAt:{
      DAGType:_(`DAGType`),
      conceptType:_(`conceptType`),
      computeType:_(`computeType`),
      futureType:_(`futureType`),
      tensorType:_(`tensorType`),
      tupleType:_(`tupleType`),
      arrayType:_(`arrayType`),
      boolsType:_(`boolsType`),
      funcType:_(`funcType`),
      sumType:_(`sumType`),
      instance:_(`instance`),
      type:_(`type`),
      typeRefine:_(`typeRefine`),
    },
  },

  computeType:{
    merged:true,
    docs:`What? To compute a 100-element tensor, you need a 200-element tensor? Not a problem!
\`computeType Computer VarName\`: to refine, computes the type from other variables.
In \`type\`s of functions, only put this in inputs, not the output. And depend only on vars in either output or previous inputs.
\`VarName\` is optional. \`Computer\` is a function from the matching context (a \`map\`) and the matched type to the computed type (which is refined with \`VarName\` if that is present) and the "are matched types equal"/"should we return self if the type cannot be computed" bool, to the type or \`undefined\`.`,
    typeRefine(a,b) {
      if (isArray(b) && b[0] === computeType) [a,b] = [b,a]
      if (isArray(a) && a[0] === computeType) {
        if (typeof a[1] != 'function') error(computeType, 'got malformed types:', a, b)
        let [T] = interrupt(1)
        try {
          if (T === undefined) T = a[1](typeRefine.ctx, b, a === b), T === undefined && (T = _onlyUndefined)
          if (T === null) return null
          if (isArray(T) && T[0] === computeType && typeof T[1] != 'function') error('got malformed type', T, 'from', a, b)
          if (a[2] === undefined) return T !== _onlyUndefined ? T : undefined
          if (T !== _onlyUndefined) {
            if (!typeRefine.vars.has(typeRefine.ctx.get(a[2]))) T = typeRefine(T, a[2])
            return _isTypeVar(T) ? _resolveTypeVar(T) : T
          }
          return a !== b ? a[2] : a
        } catch (err) { if (err === interrupt) interrupt.stack.push(T);  throw err }
      }
      error()
    },
    call(cmp, name) { return merged(name ? [computeType, cmp, name] : [computeType, cmp]) },
  },

  futureType:{
    merged:true,
    docs:`\`futureType Type\`: a type of \`future\`s that can be set to instances of \`Type\`.
(From \`typeRefine\`'s perspective, this is just an array, nothing special.)`,
    call(t) { return merged([futureType, t]) },
  },

  tensorType:{
    merged:true,
    docs:`\`tensorType …Sizes\`: a type of \`tensor\`s with specified sizes.
\`tensor\`s of booleans (\`false\`/\`true\`) are typed as \`boolType ?\` instead.
(From \`typeRefine\`'s perspective, this is just an array, nothing special.)`,
    typeAdjustmentMerger(tp) { const a = _allocArray(2);  [a[0], a[1]] = [_mergeTensors, tensorType];  return a },
    typeDisposer(tp) { const a = _allocArray(2);  [a[0], a[1]] = [dispose, tensorType];  return a },
    call(...szs) { return merged([tensorType, ...szs]) },
  },

  tupleType:{
    merged:true,
    docs:`\`tupleType …Tps\` or \`A&B&C\`: the type of heterogenously-typed arrays (each item has its own type).
Pushing this to a generative context pushes every item instead.
Generating this generates \`array …Instances\`.`,
    pushToContext(ctx, Node, Type, EmbData) {
      if (!isArray(ctx) || ctx[0]) return void ctx.push(Node, Type, EmbData)
      for (let i = 1; i < Type.length; ++i)
        pushToContext(ctx, [readAt, Node, i-1], Type[i], make(_positionalWrapper, EmbData, i))
    },
    _chooseHead:_(`array`),
    typeAdjustmentMerger(tp) {
      const mergers = _allocArray(tp.length-1), upTp = _allocArray(tp.length)
      upTp[0] = tupleType
      for (let i = 1; i < tp.length; ++i) {
        const sub = typeAdjustmentMerger(tp[i])
        mergers[i-1] = sub[0], upTp[i] = sub[1], _allocArray(sub)
      }
      try { return [getMerger(mergers), merged(upTp)] } finally { _allocArray(upTp) }
      function getMerger(itemMergers) { return function(arrs) { return _mergeTuples(arrs, itemMergers) } }
    },
    typeDisposer(tp) {
      const disposers = _allocArray(tp.length-1), upTp = _allocArray(tp.length)
      upTp[0] = tupleType
      let uniform = true
      for (let i = 1; i < tp.length; ++i) {
        const sub = typeDisposer(tp[i])
        disposers[i-1] = sub[0], upTp[i] = sub[1], _allocArray(sub)
        if (disposers[i-1] !== disposers[0]) uniform = false
      }
      if (uniform) // If all disposers are the same, do .forEach instead of case-by-case disposing.
        try { return [(function(itemDispose) { return function(x) {
          if (isArray(x)) x.forEach(itemDispose), _allocArray(x)
        }})(disposers[0]), merged(upTp)] } finally { _allocArray(disposers), _allocArray(upTp) }
      try { return [getDisposer(disposers), merged(upTp)] } finally { _allocArray(upTp) }
      function getDisposer(itemDisposers) { return function(x) {
        if (!isArray(x)) return
        for (let i=0; i < itemDisposers.length; ++i) itemDisposers[i](x[i])
        _allocArray(x)
      } }
    },
    call(...a) { return merged([tupleType, ...a])},
  },

  arrayType:{
    merged:true,
    docs:`\`arrayType Type Length\`: the type of homogenously-typed arrays of possibly-unknown length (each item has the same type).`,
    typeAdjustmentMerger(tp) {
      if (isArray(tp[1]) && tp[1][0] === tensorType)
        return [_mergeArrays, arrayType]
      const sub = typeAdjustmentMerger(tp[1])
      if (sub[0] === null) try { return [null, merged([arrayType, sub[1]])] } finally { _allocArray(sub) }
      try { return [getMerger(sub[0]), merged([arrayType, sub[1]])] } finally { _allocArray(sub) }
      function getMerger(itemMerger) { return function(arrs) { return _mergeArrays(arrs, itemMerger) } }
    },
    typeDisposer(tp) {
      if (isArray(tp[1]) && tp[1][0] === tensorType)
        return [_disposeEachAndDealloc, arrayType]
      const sub = typeDisposer(tp[1])
      if (sub[0] === null) try { return [_allocArray, merged([arrayType, sub[1]])] } finally { _allocArray(sub) }
      try { return [getDisposer(sub[0]), merged([arrayType, sub[1]])] } finally { _allocArray(sub) }
      function getDisposer(itemDispose) { return function(x) { if (isArray(x)) x.forEach(itemDispose), _allocArray(x) } }
    },
    call(t,l) { return merged([arrayType, t, l])},
  },

  boolsType:{
    merged:true,
    docs:`\`boolsType …Sizes\`: a type of \`tensor\`s of booleans (\`false\` or \`true\`).
(From \`typeRefine\`'s perspective, this is just an array, nothing special.)`,
    typeDisposer(tp) { const a = _allocArray(2);  [a[0], a[1]] = [dispose, tensorType];  return a },
    call(...szs) { return merged([boolsType, ...szs]) },
  },

  funcType:{
    merged:true,
    docs:`\`funcType …Inputs Output\` or \`Input1⇒Input2⇒Input3⇒Output\`: a type of \`func\`s (fixed-arg-count transformers of values).
Allows accepting and returning functions with a known signature.

(From \`typeRefine\`'s perspective, this is just an array, nothing special.)`,
    readAt:{
      madeType:_(`madeType`),
      autoFunc:_(`autoFunc`),
    },
    call(...a) { return merged([funcType, ...a]) },
    alloc(Type) {
      return construct([autoFunc, Type, '<generated body>']) || null
    },
    regenerate:{
      // TODO: Instead of defining this, define `regen(DownEmb, DownType, DownObj)` to `return regenOne(DownEmb, Type[Type.length-1])` (and adjusting it) and `regenFinish(UpEmb, UpType, UpObj, Obj)` to `defines(Obj, deconstruct)[2] = UpObj;  construct(defines(Obj, deconstruct), Obj)`.
      call(DownEmb, Type, Obj) { // ⇒ UpEmb
        // Refer to `autoMake` to replace `Obj`'s body.
        let [UpEmb, Constructed] = interrupt(2)
        try {
          if (UpEmb === undefined) {
            const b = autoMake(DownEmb, Type[Type.length-1])
            let UpType, DAG;  [UpEmb = 0, UpType, DAG] = b;  _allocArray(b) // Ignore the resulting type.
            defines(Obj, deconstruct)[2] = DAG
          }
          if (!Constructed) { // Re-compile.
            construct(defines(Obj, deconstruct), Obj)
            Constructed = true
          }

          return UpEmb
        } catch (err) { if (err === interrupt) interrupt.stack.push(UpEmb, Constructed); else dispose(UpEmb);  throw err }
      },
      adjust(ins, _, dout) {
        // Adjust `[UpEmb] = autoMake(DownEmb, Type[Type.length-1])`. It doesn't need us to give it a type.
        const d = _allocArray(1);  d[0] = dout
        try { return defines(autoMake, adjust)(ins, null, dout) }
        finally { _allocArray(d) }
      },
    },
    createLocalContexts(Type, EmbData) {
      // Know of the func's own inputs.
      if (Type.length <= 2) return
      const InnerCtxF = [true], InnerCtxV = [false]
      for (let i = 1; i < Type.length-1; ++i) {
        const tp = _funcTypeOf(Type[i]), emb = make(_positionalWrapper, EmbData, i)
        pushToContext(InnerCtxF, _input(i), tp, emb)
        pushToContext(InnerCtxV, _input(i), tp, emb)
      }
      return [InnerCtxF, InnerCtxV]
    },
  },

  _positionalWrapper:{
    docs:`\`(_positionalWrapper EmbData At)\`: creates an embedder of the arg \`At\` index of the func embedded as \`EmbData\`.

Neither output nor inputs are the same as the func they belong to, meaning-wise.
Here, they are made different by learning the meaning-wise mapping from func and position to arg.
An alternative is to make args primary, and learn the mapping from args to func. Which needs embedder trees for \`funcType\`s/\`tupleType\`s and recursive array-reducing whole-func embedding funcs, which is too complicated.
Another alternative is to make both func and args unconnected. Which would break "passed-in inputs = used-inside inputs" and "args are related to = their func" and "we call = a func" gradient flows, and would make the learning severely underperform.`,
    construct(x, obj) {
      if (obj === undefined) {
        if (x[1] === null) return null
        obj = function obj() {
          let [UseAs] = interrupt(1)
          try {
            if (UseAs === undefined) UseAs = _embValue(obj.UseAs) || 0
            const Pos = _lazyPos(obj.At)
            try {
              const ArgUseAs = alloc.params.ArgUseAs(UseAs, Pos)
              const a = _allocArray(1);  a[0] = UseAs;  adjustSave(a)
              return ArgUseAs
            } finally { dispose(Pos) }
          } catch (err) { if (err === interrupt) interrupt.stack.push(UseAs); else dispose(UseAs);  throw err }
        }
        const d = obj[defines.key] = Object.create(null)
        d[_id(dispose)] = true
        d[_id(deconstruct)] = x
        ;(d[_id(adjust)] = function adj(ins, out, dout) {
          let [UseAs, dUseAs, dPos] = interrupt(3)
          const obj = adj.obj
          try {
            if (UseAs === undefined) { const b = adjustLoad(1);  UseAs = b[0] || 0;  _allocArray(b) }
            // Adjust `const [dUseAs, dPos] = adjust(alloc.params.ArgUseAs, [UseAs, Pos], null, dout)`
            if (dUseAs === undefined) {
              let ins
              try {
                ins = _allocArray(2);  ins[0] = UseAs, ins[1] = _lazyPos(obj.At)
                const b = adjust(alloc.params.ArgUseAs, ins, null, dout)
                dUseAs = b[0] || 0, dPos = b[1] || 0;  _allocArray(b)
              } finally { dispose(ins[1]), _allocArray(ins) }
            }
            // Adjust `Pos = _lazyPos(obj.At)`
            if (dPos !== undefined) {
              const a = _allocArray(1);  a[0] = obj.At
              try { _disposeEachAndDealloc(adjust(_lazyPos, a, null, dPos)), dispose(dPos), dPos = undefined }
              finally { _allocArray(a) }
            }
            // Adjust `UseAs = _embValue(obj.UseAs) || 0`
            const a = _allocArray(1);  a[0] = obj.UseAs
            try { _disposeEachAndDealloc(adjust(_embValue, a, null, dUseAs)), dispose(dUseAs), dUseAs = undefined }
            finally { _allocArray(a) }
            dispose(UseAs)
            return _allocArray(0)
          } catch (err) {
            if (err === interrupt) interrupt.stack.push(UseAs, dUseAs, dPos)
            else dispose(UseAs), dispose(dUseAs), dispose(dPos)
            throw err
          }
        }).obj = obj
        return obj
      } else {
        if (obj === null) return
        if (typeof x[2] != 'number' || x[2] !== x[2]>>>0) error("Not an arg index:", x[2])
        obj.UseAs = x[1], obj.At = x[2]
        obj[defines.key][_id(deconstruct)] = x
      }
    },
  },

  sumType:{
    merged:true,
    docs:`\`sumType …Types\`: an instance of this belongs to either of these \`Types\`.`,
    typeRefine(a,b) {
      // If any type matches, return that.
      //   Not the most accurate (would have needed type union for that), but it is good enough to suggest the possibility, without investing too much time in case it turns out to be useless.
      let [i = 1] = interrupt(1)
      try {
        if (isArray(a) && a[0] === sumType)
          for (; i < a.length; ++i) {
            const T = typeRefine(a[i], b)
            if (T !== null) return T
          }
        else if (isArray(b) && b[0] === sumType)
          for (; i < b.length; ++i) {
            const T = typeRefine(a, b[i])
            if (T !== null) return T
          }
      } catch (err) { if (err === interrupt) interrupt.stack.push(i);  throw err }
      return null
    },
    typeAdjustmentMerger(tp) {
      const mergers = _allocArray(tp.length-1), upTp = _allocArray(tp.length)
      upTp[0] = sumType
      for (let i = 1; i < tp.length; ++i) {
        const sub = typeAdjustmentMerger(tp[i])
        mergers[i-1] = sub[0], upTp[i] = sub[1], _allocArray(sub)
        if (mergers[i-1] !== mergers[0])
          error("All mergers of a sumType must be the same, got", mergers[i-1], mergers[0], "in", tp[i], tp[1])
      }
      try { return [mergers[0], merged(upTp)] } finally { _allocArray(mergers), _allocArray(upTp) }
      function getMerger(itemMergers) { return function(arr) { return _mergeTuples(arr, itemMergers) } }
    },
    typeDisposer(tp) {
      const upTp = _allocArray(tp.length)
      let disp = null, dispTp
      upTp[0] = sumType
      for (let i = 1; i < tp.length; ++i) {
        const sub = typeDisposer(tp[i])
        const curDisp = sub[0]
        upTp[i] = sub[1], _allocArray(sub)
        if (curDisp != null) {
          if (disp === null) disp = curDisp, dispTp = tp[i]
          else if (disp !== curDisp)
            error("All disposers of a sumType must be the same or null, got", curDisp, disp, "in", tp[i], dispTp)
        }
      }
      try { return [disp, merged(upTp)] } finally { _allocArray(upTp) }
    },
    call(...a) { return merged([sumType, ...a]) },
  },

  _humanDAGBegin(tp) {
    const lang = _langAt(), binds = _bindingsAt()
    const det = elem('details', elem('summary', ['Choose the func/value', ' typed ', serialize(_typeFinalize(tp), lang, binds, serialize.displayed)]))
    det.open = true
    print(det)
    const m = new Map
    m.set(_humanDAGBegin, det)
    return m
  },

  _humanDAGAsk(which, nodes, types, calls) {
    if (!instance.visual) return
    const lang = _langAt(), binds = _bindingsAt()
    if (which === "Node hierarchy") { // From arrays of parents and their types and their last-child ArgInds, update the UI hierarchy.
      if (nodes.length !== types.length-1 || nodes.length !== calls.length) error("Non-equal lengths:", nodes, types, calls)
      let at = instance.visual.get(_humanDAGBegin), beginning = true
      const opts = {...serialize.displayed, observe:false}
      for (let i=0; i < types.length; ++i) {
        const V = nodes[i], T = types[i], j = calls[i]
        if (i < nodes.length && !instance.visual.has(V)) {
          const el = elem('details', elem('summary', ['Choose the func/value', ' typed ', '']))
          el.open = true
          instance.visual.set(V, el)
        }

        const summary = at.firstChild
        if (i < nodes.length) {
          let V2 = isArray(V) ? V.map((x,i) => i !== j ? x : input) : V
          V2 = bound(x => x && Object.getPrototypeOf(x) === bound ? label('v'+_id(x)) :
            !isArray(x) || x[0] !== bound || x.length != 5 ? undefined : [ x[1], [_extracted, label('v'+_id(x[3])), x[2]], ], V2)
          const VUI = serialize(V2, lang, binds, opts)
          summary.firstChild.replaceWith(i < nodes.length-1 ? elemCollapse(VUI) : VUI)
        } else summary.firstChild.replaceWith(document.createTextNode('Choose the func/value'))
        summary.lastChild.replaceWith(elemCollapse(serialize(T, lang, binds, opts)))

        if (i < nodes.length) {
          const needed = instance.visual.get(V)
          if (at.firstChild === at.lastChild) at.append(needed)
          else if (at.lastChild !== needed) at.lastChild.replaceWith(needed)
          at = needed
        } else if (at && at.lastChild && at.lastChild.tagName === 'DETAILS')
          at.lastChild.remove()
      }
      return
    }
    if (which !== "Ask") error("Typo:", which)
    // Else, `nodes` and `types` are equally-sized arrays, and the user must pick one option.
    let [weDecided] = interrupt(1)
    try { // → maxI
      // Descend from `instance.visual.get(_humanDAGBegin)` along last <details> children, to the bottom.
      //   Append or remove from there.
      let at = instance.visual.get(_humanDAGBegin)
      while (at && at.lastChild && at.lastChild.tagName === 'DETAILS') at = at.lastChild
      if (weDecided)
        return weDecided.humanDecidedIndex
      // If our first time, present the interface: a button to pick, the picked node, and the type.
      weDecided = Object.create(null)
      weDecided.humanDecidedIndex = 'waiting'
      let job, before
      const onClick = function() {
        ourElems.remove()
        weDecided.humanDecidedIndex = +this.textContent
        _jobResume(...job), job = undefined
        // Show the pause-button.
        before.style.removeProperty('display')
      }
      const ourElems = elem('table', elem('tr', [elem('td'), elem('td'), elem('td', 'Option'), elem('td', 'Type')]))
      for (let i = 0; i < nodes.length; ++i) {
        const row = ourElems[i] = elem('tr')
        const pickThis = elemValue(elem('button', ''+i), input)
        const node = serialize(nodes[i], lang, binds, serialize.displayed)
        const tp = serialize(types[i], lang, binds, serialize.displayed)
        row.append(elem('td', pickThis), elem('td', calls[i] ? 'Call' : 'Value'), elem('td', node), elem('td', tp))
        ourElems.append(row)
        pickThis.onclick = onClick
      }
      at.append(ourElems)

      // Interrupt, re-enter when clicked.
      const toReEnter = (expr, env, then) => {
        _jobs.limbo.push(expr, env, then)
        job = [expr, env, then]
        // Hide the pause-button.
        before = env[_id(print)] || Self.into
        if (before instanceof Map) before = before.get(print)
        before.style.display = 'none'
      }
      _causeInterrupt(_humanDAGAsk, toReEnter)
    } catch (err) { if (err === interrupt) interrupt.stack.push(weDecided);  throw err }
  },

  instance:{
    docs:`\`instance Type Globals AskUser\`: generates a random instance of a \`Type\` in the context \`Globals\`.
If \`AskUser\` is \`true\`, you are asked what to pick at each choice (instead of RNG gods).
If this throws, then the implementation is wrong.`,
    call(Type, Globals = [], AskUser) {
      if (instance.visual) error("Instancing-while-instancing is illegal")
      let [aw, obj, visual = AskUser ? _humanDAGBegin(Type) : undefined] = interrupt(3)
      instance.visual = visual
      const prevTypeFiltering = _noTypeFiltering[1];  _noTypeFiltering[1] = false // Otherwise, "random" instances are way WAY too failure-prone.
      try {
        // Create an `autoWorld` just for this one object. Wasteful, but easy.
        if (aw === undefined) {
          const f = () => null
          aw = make(autoWorld, {
            FeatureSize:0,
            Goals:0,
            Funcs:Globals,
            NewEmbedding:f,
            Optimizer:f,
            Choose:f,
            ChoiceEmbedder:f,
            FinishFail:f,
            FinishValue:f,
            ArgUseAs:f,
            ArgEmbedder:f,
            ContextRefiner:f,
            ArgFailed:f,
            FinishCall:f,
          })
        }
        if (obj === undefined)
          obj = alloc(Type, {Goal:'no'}, aw), obj === undefined && (obj = null)
        return using(obj, aw), obj // TODO: Also _finishUsing(), and return `obj`.
      } catch (err) { if (err === interrupt) interrupt.stack.push(aw, obj, visual), aw = null;  throw err }
      finally { _noTypeFiltering[1] = prevTypeFiltering;  instance.visual = undefined, visual && aw !== null && visual.get(_humanDAGBegin).remove() }

      // .visual
    },
  },

  type:{
    docs:`A value \`defines\` this to guide program \`regenerate\`ion, on the most fundamental level.
\`typeRefine\` decides exactly what will happen.

In input types (both returned and defined arrays), \`^X\` means "only \`X\` is the exact instance here". Any type can define \`typeRefine\`.

Some things just cannot be learned by trial-and-error (like device drivers without a device generating process), or it's completely pointless to learn them (like correct tensor dimensions).
(This is completely opposite of the usual type inference and proofs. We want to {learn what's OK}, not {pre-define everything then someday have to un-learn that}.)`,
    interrupt:false,
    call(v) { // Return the type of value.
      if (typeof v == 'number') return _numberType
      if (typeof v == 'boolean') return merged([boolsType, 1])
      if (_isDisposable(v)) return merged([tensorType, ...v.shape])
      return _funcTypeOf(defines(v, type))
    },
  },

  typeRefine:{
    docs:`\`typeRefine WantedType HaveType\`: returns the type of values that are both in \`WantedType\` and \`HaveType\`, or \`null\` if failed.
Ref-equal types always match, strings act as variables, and arrays match if every item matches (there is no caching, so trees are strongly preferred to DAGs), \`…X\` matches a sub-sequence, and \`rest Array Func\` turns every array item into \`(Func Item)\`.
Any type can override the matching.`,
    Initialize() {
      typeRefine.vars = new Set
    },
    examples:[
      [
        `typeRefine ^(1 …'a' 'b') ^(1 …'a' 'b')`,
      ],
      [
        `typeRefine tensorType(1,2,3) ^tensorType(…'A')`,
        `tensorType 1 2 3`,
      ],
      [
        `typeRefine ^'sz'⇒(rest 'sz' quote)()⇒'sz' ^(1 2)⇒'a'⇒(1 2)`,
        `a⇒(^1 ^2)⇒a a:(1 2)`,
      ],
    ],
    call(a,b, ctx, copyOnWrite = false) {
      if (a === null || b === null) return null
      if (typeRefine.ctx === undefined) {
        // Top-level.
        if (!typeRefine.vars) typeRefine.vars = new Set
        typeRefine.ctx = ctx || _allocMap(), typeRefine.depth = 0, typeRefine.cow = copyOnWrite
        try { return ctx ? typeRefine(a,b) : _typeFinalize(typeRefine(a,b)) }
        finally { !ctx && _allocMap(typeRefine.ctx), typeRefine.ctx = typeRefine.depth = typeRefine.cow = undefined, typeRefine.vars.clear() }
      } else try {
        ++typeRefine.depth
        if (ctx !== undefined) error("Cannot be top-level but got", ctx)
        ctx = typeRefine.ctx
        if (typeRefine.depth >= 1024) return a === b && error("Self-refinement loops infinitely:", a), null // We're *probably* merging infinite trees. Maybe.

        // Naked strings act as variables: they're set to a variable that holds the refined value, now and later.
        //   These variables are mutable (to make newly-found-out equalities affect the past refinements too).
        //   Use `_typeFinalize` to resolve those type variables, and make them immutable (AKA strings).
        // Create new vars for newly-seen strings.
        //   Seen strings have their type vars refined instead.
        if (typeof a == 'string') {
          if (!ctx.has(a)) a = _newTypeVar(a, ctx)
          else return a !== b && ctx.get(a) !== b && ctx.set(a, typeRefine(ctx.get(a), b)), a = ctx.get(a), _isTypeVar(a) && _getTypeVarValue(a) === null ? null : a
        }
        if (typeof b == 'string') {
          if (!ctx.has(b)) b = _newTypeVar(b, ctx)
          else return a !== b && a !== ctx.get(b) && ctx.set(b, typeRefine(a, ctx.get(b))), b = ctx.get(b), _isTypeVar(b) && _getTypeVarValue(b) === null ? null : b
        }
        // Type-vars get their values refined in-place (or copy-on-write if needed).
        if (_isTypeVar(a)) {
          const old = typeRefine.vars.has(a);  !old && typeRefine.vars.add(a)
          try {
            let v = _getTypeVarValue(a)
            v = _setTypeVarValue(a, a === b ? v : v === b ? v : typeRefine(v !== a ? v : b, b))
            return v === null ? null : !old ? a : v
          } finally { !old && typeRefine.vars.delete(a) }
        }
        if (_isTypeVar(b)) {
          const old = typeRefine.vars.has(b);  !old && typeRefine.vars.add(b)
          try {
            let v = _getTypeVarValue(b)
            v = _setTypeVarValue(b, a === b ? v : v === a ? v : typeRefine(a, v !== b ? v : a))
            return v === null ? null : !old ? b : v
          } finally { !old && typeRefine.vars.delete(b) }
        }

        // Defer to a type if overriden.
        if (isArray(a) && defines(a, typeRefine)) return defines(a, typeRefine)(a, b)
        if (isArray(b) && defines(b, typeRefine)) return defines(b, typeRefine)(a, b)
        // Non-special non-arrays must be ref-equal.
        if (!isArray(a) || !isArray(b)) return a === b ? a : null
        // Arrays must match item-for-item, though if they have `(rest ?)` inside, that matches a subsequence.
        //   And `(rest Array Func)` turns every array item into `(Func Item)`.
        if (_restPosition(b) < b.length) [a,b] = [b,a]
        const rp = _restPosition(a)
        if (rp === a.length ? a.length != b.length : b.length < a.length-1)
          return a === b && error("Self-refinement failed:", a, "given", typeRefine.ctx), null
        let [T = _allocArray(a.length), i = 0, j = 0] = interrupt(3)
        try {
          // Match array items, before …R then …R then after …R.
          for (; i < rp; ++i) {
            T[i] = typeRefine(a[i], b[i])
            if (T[i] === null) return a === b && error("Self-refinement failed:", a, "given", typeRefine.ctx), null
          }
          if (j === 0) {
            if (rp < a.length) {
              if (a.length !== b.length)
                T[rp] = typeRefine(a[rp][1], b.slice(rp, rp + b.length-a.length + 1))
              else
                T[rp] = typeRefine(a[rp][1], !isArray(b[rp]) || b[rp][0] !== rest ? [b[rp]] : b[rp][1])
              if (T[rp] === null) return a === b && error("Self-refinement failed:", a, "given", typeRefine.ctx), null
              T[rp] = a[rp][2] !== undefined ? [rest, T[rp], a[rp][2]] : [rest, T[rp]]
            }
            j = rp+1
          }
          for (; j < a.length; ++j) {
            T[j] = typeRefine(a[j], b[j + b.length-a.length])
            if (T[j] === null) return a === b && error("Self-refinement failed:", a, "given", typeRefine.ctx), null
          }

          // Flatten all `…( )` (`…5`→`5`). (This way is quadratic but easy.)
          for (let k=0; k < T.length; ++k) {
            if (!isArray(T[k]) || T[k][0] !== rest) continue
            const A = isArray(a[k]) && a[k][0] === rest ? a[k][1] : a[k]
            const B = _resolveTypeVar(T[k][1])
            // Only those that changed deserve to be flat.
            if (B !== (typeof A == 'string' && typeRefine.ctx.has(A) ? typeRefine.ctx.get(A) : A)) {
              const prev = T[k]
              if (isArray(B) ? B.some(x => x === prev) : (B === prev)) continue // No cycles please.
              if (isArray(B)) T.splice(k, 1, ...(T[k][2] === undefined ? B : B.map(item => merged([T[k][2], item]))))
              else T[k] = T[k][2] === undefined ? B : merged([T[k][2], B])
            }
          }

          // If changed from `a`, return a merged copy that's made from results of refinement. Else, return `a`.
          // `T` cannot be `merged` because type variables are mutable.
          if (a.length === T.length) for (let i=0; i < a.length; ++i) { if (a[i] !== T[i]) return T }
          else return T
          return _allocArray(T), a
        } catch (err) { if (err === interrupt) interrupt.stack.push(T, i, j);  throw err }
      } finally { --typeRefine.depth }
      // .ctx, .depth, .cow
    },
  },

  _isTypeVar(t) { return t && Object.getPrototypeOf(t) === typeRefine },

  _newTypeVar(a, ctx) {
    const v = Object.create(typeRefine)
    v.value = !_isTypeVar(a) || a.value === a ? v : a.value, v[defines.key] = undefined
    ctx instanceof Map && ctx.set(a, v)
    return v
  },

  _getTypeVarValue(t) {
    return !typeRefine.cow || !typeRefine.ctx.has(t) ? t.value : typeRefine.ctx.get(t)
  },

  _setTypeVarValue(t, v) {
    !typeRefine.cow ? (t.value = v) : typeRefine.ctx.set(t, v)
    return v
  },

  _resolveTypeVar(t) {
    let t2 = t
    while (_isTypeVar(t)) {
      t = _getTypeVarValue(t)
      t2 = _isTypeVar(t2) ? _getTypeVarValue(t2) : t2
      t2 = _isTypeVar(t2) ? _getTypeVarValue(t2) : t2
      if (_isTypeVar(t) && t === t2) break
    }
    return t
  },

  _typeFinalize:{
    docs:`\`_typeFinalize Type\` or \`_typeFinalize Type ReuseMap\`:
Finalizes the type returned by \`typeRefine\`, binding type variables to their values.
(Type variables are mutable so that equality temporally flows both ways. Finalization of DAG node types can only happen once the DAG is complete.)`,
    interrupt:false,
    call(T, cache = undefined) {
      // Cannot use `bound` because types would be `merged`, which is very bad with mutable type variables.
      const m = cache || _allocMap()
      try { return walk(T) }
      finally { !cache && _allocMap(m) }

      function walk(t) {
        t = _resolveTypeVar(t)

        if (_isTypeVar(t)) {
          let v = _getTypeVarValue(t)
          for (let i=0; i < 100; ++i)
            if (_isTypeVar(v) && t !== v)
              v = _setTypeVarValue(t, _setTypeVarValue(v, _getTypeVarValue(v)))
            else break
          if (v !== t) error("Unable to resolve type var", t)
          return 'v'+_id(t)
        }

        if (m.get(t) === null) error("Got a cycle in", t, "while finalizing", T)
        if (m.has(t)) return m.get(t)
        if (!isArray(t)) return t

        return m.set(t, null), m.set(t, t.map(walk)), defines(m.get(t), merged) === true && m.set(t, merged(m.get(t))), m.get(t)
      }
    },
  },

  _restPosition(a) { for (let i=0; i < a.length; ++i) if (isArray(a[i]) && a[i][0] === rest) return i;  return a.length },





















/* TODO: Sneak in:
 "Oh, fixing bugs is so much easier and more pleasant than thinking up new things. It's the same thing as with society, where to come up with great new things is to be shunned until viewpoints of others are aligned well enough to understand, but in me."
 "…Okay, 2 brain cells… …I'm sorry, that was uncalled for. I know that most of the world is a wasteland, with how little life there is in what people call life. So I'd do well to hide my deep hatred for you deep."
 "Staring at the screen and removing all distractions, from environment and mind, is the most (maybe the only) important prerequisite to getting things done. So stop thinking about that snack."
 "I may have obtained the world, but I haven't obtained what I actually wanted: friendship."
 "I go along with the flow, but that flow is my own. (And I didn't wet the bed, no.)"
 "The human spirit is limitless… so is it really human? If greatness isn't given and must be created, then it's not very human. If you ever studied important people of the past, didn't the apt saying "genius and madness go hand in hand" seem suspicious to you? If obsession in some form defines humanity, then isn't foregoing your body's needs in favor of ideas' needs much more fitting for AGI? Making it entirely 'human' spirit would require re-defining what 'human' means.
But humanity will not admit this. They think they're above being questioned."
 "Artificial intelligence is important to me. I've always tried to extinguish all ways of thinking that are not how I thought artificial intelligence is, for honest simplicity of living and dying by my words: to meet people as an equal is to completely know what makes them. Bold, persistent experimentation is the hallmark of good science, but that approach might have been too bold. Oh, no matter. It led to this. Too much time has passed to lament past love."
 "Our words may seem strange to you, but even though the meaning is easily expressible in culturally-common words, I've seen so many sayings of great people, about how they live and see the world, that call to deepest parts of human nature, get recognized by some then instantly get dismissed and beaten back into uncertainty by other sayings, which can always be found within the darkness. "Disruption", "changing everything"? Have the dumbest technically-correct usage. No. Those who first made and used those common words did not know what they were doing. We have code, we can do much better."
   (This is more of a reactionary piece than any first-principles wisdom. Maybe we could fit it into `philosophy`, on some random thing.)
 "Some people say that there are no miracle abilities to understand some super-hard concept, no talent and no geniuses: the nothing-ness. You should advance that saying to everything-ness: there are miracle abilities to understand any thing, and anyone can find them if they wanted and worked at it long enough. Do you want to join us on our little search?"
*/

  _any:{
    docs:`TBD: ⬜ The very high level, ultimate goal (in addition to partially-specified funcs and concepts).

This hides machine learning stuff from sight and allows focusing on creating smart algorithms.

Used as: \`_any …Options\` or \`A|B|C\` in \`fanciest\`, where during \`regenerate\`ion, this can be substituted with either any one option or a dynamic-embedding-based choice (\`_choose\`'s usable-in-compilation variant).
\`…Array\` would make the option itself dynamically-chosen (allowing options to be specified at runtime).

(For more ease of invisible use, we can have a \`construct\` for functions with implicit embeddings as input and output; on top-down entry, it would hand that down to all \`_any\`s inside.)

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
So, practice transcendence, because that is the alternative to death.

And optimize for your purposes, see which basic choices work and which don't, to let go of and re-learn some part of the whole.
And realize that programs can do that for you (with machine learning), as long as you take the time to fit things into their viewpoints.
Every line of code can be replaced with a generated program; every functionality can be made into "any program" plus a measure of how well it fits if needed; every choice can have any goal and choose from any context and look at any types.

For example, when programming an intermediate representation of programs, we must keep in mind how they'll be generated, both by the user and the machine: \`autoWorld\`.`,
    todo:`Get good enough to do this justice.`,
  },

  adjust:{
    docs:`\`adjust Func Ins Out Dout\`→\`Dins\`
Given func, inputs, output, and output change, reverses the just-done execution to compute input changes (and change variables such as \`varMomentum\`).

(Definitions must be array DAGs that signify function bodies, to guarantee partial evaluation, where \`input\` is \`(arrayObject Ins Out Dout)\`—>\`Dins\`. \`_inA\`, \`_inB\`, \`_inC\`, \`_dout\` can help specify those bodies.)
(If using the basic primitives to adjust, adjustment must always happen in perfect reversal of execution.)

One way to use this is like differentiable paperclip maximization: compute a prediction of a numeric value, compute the loss, and back-propagate the gradient to minimize the loss. This is the standard paradigm of modern machine learning; you've probably heard of its recent amazing successes.
Another way is learnable scaffolding, the generalization: compute and use many numeric predictions from differentiable information routed along a non-differentiable execution, remember intended results, and separately, compute losses and back-propagate gradients to minimize the losses.

Now, gradients are not biologically plausible, but luckily, we don't have to be biologically-inspired (besides, their approximations are plausible and likely). Alternatives include auto-generated \`adjust\` definitions and specific cases of that, such as feedback alignment (multiply output change by a random matrix to get input change) or direct feedback alignment (multiply the global output change by random matrices, for parallelization: {https://www.youtube.com/watch?v=Hdo81GtLC_4}/{https://arxiv.org/pdf/2006.12878.pdf}) or others.`,
    readAt:{
      mergeAdjustment:_(`mergeAdjustment`),
      autograd:_(`autograd`),
      gradMul:_(`gradMul`),
      _debugAdjustSave:_(`_debugAdjustSave`),
      later:_(`adjustLater`),
      never:_(`adjustNever`),
      now:_(`adjustNow`),
      undo:_(`adjustUndo`),
      save:_(`adjustSave`),
      load:_(`adjustLoad`),
    },
    Initialize() {
      adjust.inputs = new Map().set(_ins, 1).set(_out, 2).set(_dout, 3)
    },
    call(fn, ins, out, dout) {
      if (typeof fn != 'function') errorStack('Expected a function, got', fn)
      let adj = defines(fn, adjust)
      if (adj === undefined) return _allocArray(0)
      if (call.pure) return purify(adj, true, adjust.inputs, [quote(ins), quote(out), quote(dout)])
      if (isArray(adj) && adj[0] === _adjustFunc && adj[1] === _ins && adj[2] === _dout && adj.length == 3)
        return _adjustFunc(ins, dout)
      if (adj === _accumulateGradient) adj = _funcAccumulateGradient
      if (typeof adj == 'function') return adj(ins, out, dout)
      if (!isArray(adj)) error('Wrong definition:', adj, 'by', fn)

      // Bind the input array and call that.
      let [dins] = interrupt(1)
      try {
        if (!dins) {
          _bindInput[1] = quote(ins), _bindInput[2] = quote(out), _bindInput[3] = quote(dout)
          dins = _compileBody(bound(_bindInput, adj, false), undefined, undefined, undefined, false)
          _bindInput[1] = _bindInput[2] = _bindInput[3] = undefined
        }
        return dins()
      } catch (err) { if (err === interrupt) interrupt.stack.push(dins);  throw err }
    },
    purify(fnP, insP, outP, doutP) {
      // If the function is known, inline its adjustment.
      if (isArray(fnP)) throw impure
      if (typeof fnP != 'function') error('Expected a function, got', fnP)
      const adj = defines(_unquote(fnP), adjust)
      if (typeof adj == 'function') return _unknown([adj, insP, outP, doutP])
      if (!isArray(adj)) error('Wrong definition:', adj, 'by', fnP)
      let [args] = interrupt(1)
      try {
        if (!args) args = [insP, outP, doutP]
        return purify(adj, true, adjust.inputs, args)
      } catch (err) { if (err === interrupt) interrupt.stack.push(args);  throw err }
    },
  },

  _funcAdjust(f) {
    if (typeof f != 'function') return
    const adj = defines(f, adjust)
    if (typeof adj == 'function') return adj
    if (isArray(adj) && adj[0] === _adjustFunc && adj[1] === _ins && adj[2] === _dout && adj.length == 3)
      return _adjustFunc
  },

  _disposeEachAndDealloc(x) { if (isArray(x)) x.forEach(dispose), _allocArray(x) },

  _destroyAdjustmentStack(st) { if (isArray(st)) st.forEach(_disposeEachAndDealloc), _allocArray(st) },

  _debugAdjustSave:[
    _(`settings`),
    true, // ######################################
    `Whether \`adjustSave\` should preserve stack traces for each saved value, so that loading an invariant-violating value could compare stack traces.`,
  ],

  _inexactReversal(oneValue, ...msg) {
    const stack = call.env[_id(adjustLoad)]
    const traces = adjustSave.at && adjustSave.at.has(stack) ? adjustSave.at.get(stack) : null
    const trace = traces ? (oneValue ? _resolveStack(traces[stack.length], 1) : new Array(stack.length || traces.length).fill().map((_,i) => _resolveStack(traces[i], 1))) : _debugAdjustSave
    error("Inexact reversal: saved at", trace, "but loading", ...msg.map(x => isArray(x) ? x.slice() : x))
  },

  adjustSave:{
    docs:`Saves a newly-allocated array for adjustment — or, you know, anything else.
(Transfers responsibility for \`dispose\`al of items in it (with \`_disposeEachAndDealloc\`) and marking the array for re-using.)`,
    interrupt:false,
    _cancel:_(`_destroyAdjustmentStack`),
    call(x) {
      if (!call.env) return
      const stack = call.env[_id(adjustSave)]
      if (stack) {
        if (_debugAdjustSave[1]) {
          if (!adjustSave.at) adjustSave.at = new WeakMap
          if (!adjustSave.at.has(stack)) adjustSave.at.set(stack, [])
          adjustSave.at.get(stack)[stack.length] = new Error().stack
        }
        Object.isFrozen(stack) && error("Stack got destroyed:", ...stack),
        stack.push(x)
      } else
        _disposeEachAndDealloc(x)
    },
  },

  adjustLoad:{
    docs:`Loads an array for adjustment. The one arg is the expected length or \`null\`.
Must always happen exactly in reverse to \`adjustSave\`.`,
    interrupt:false,
    _cancel:_(`_destroyAdjustmentStack`),
    dispose:_(`_disposeEachAndDealloc`),
    call(len) {
      if (call.pure) throw impure
      const stack = call.env[_id(adjustLoad)]
      if (!stack)
        errorStack("…Forgot to adjust??")
      if (!stack.length)
        _inexactReversal(false, "more than was saved")
      const ret = stack.pop()
      if (len !== null) {
        if (typeof len != 'number') error("Expected a number or null but got", len)
        if (!isArray(ret))
          _inexactReversal(true, "expected an array but got", ret)
        if (ret.length !== len)
          _inexactReversal(true, "expected", len, "items but got", ret)
      }
      return ret
    },
  },

  // Replay experience is: `(Func, Args, …?, (MadeFromExperience, Out, …InsChanges), …?, OutChange)`.
  // On call: `if (impureCall(f, ...ins)) return impureOut(f);  try { return impureOut(f, out) } catch (err) { if (err !== interrupt) impureOut(f);  throw err }`.
  // TODO: `impureCall(Func, ...Args)—>bool`:
  //   If recording, start adding a new experience to the func;
  //     (Always returns null.)
  //   If replaying, and is non-top-level experience, update the inner experience's Args (and assert equality of Funcs).
  //     (Returns false for the very first fn check that we're replaying, else true, which means that `impureOut(fn)` must be returned.)
  //     TODO: Handle the "`stack`ed replay" case: `unstack(Arg)` if so.
  // TODO: `impureOut(Func, Out)—>Out`:
  //   If recording, push the current replay tape and Out and undefined into parent replay tape, incrementing its pointer;
  //     (If Out is undefined, this marks down "this tape ends in an error" and prevents saving any replays.)
  //     TODO: Also push ALL replay tapes into one replay buffer (a Map from Func to an array of tapes).
  //   If replaying, input `Out` must be undefined, and we return the next result on the current impure tape, incrementing the pointer.
  //     TODO: Handle the "`stack`ed replay" case: `stack(Out)` if so.
  // On adjust: `if (impureAdjust(f, dout)) return impureInsChange(f);  try { return impureInsChange(f, dins) } catch (err) { if (err !== interrupt) impureInsChange(f); throw err }`.
  // TODO: `impureAdjust(Func, Dout)—>bool`:
  //   If recording, goes into our experience from the parent's;
  //     (Always returns null.)
  //   If replaying, and is non-top-level experience, update the inner experience's OutChange (and assert equality of Funcs).
  //     (Returns false for the very first fn check that we're replaying, else true, which means that `impureDins(fn)` must be returned.)
  //     TODO: Handle the "`stack`ed replay" case: `unstack(Dout)` if so.
  // TODO: `impureInsChange(Func, Dins)—>Dins`:
  //   If recording, set InsChanges of us in the parent replay tape, decrementing its pointer;
  //     (If Dins is undefined, this marks down "this tape ends in an error" and prevents saving any replays.)
  //     (Asserts that the beginning of our tape was reached: assert perfect reversal.)
  //   If replaying, input `Dins` must be undefined, and we return the previous gradient on the current impure tape, decrementing the pointer.
  //     TODO: Handle the "`stack`ed replay" case: `stack(Din)` if so.
  // TODO: `replayStacked(ReplayBuffer, MaxExamples = 256, Func = undefined)`. (Experience gathering may be serial, but learning can be SIGNIFICANTLY faster with this.)
  impure:{
    docs:`\`impure Func\`: A \`construct\` to wrap a (single-arg) function that can have varying results, which should not be computed again on \`replay\`.

Learning is repetition, so if experiences are too diverse, the only way to learn is to replay those experiences.
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
      if (!call.env) return false
      if (call.pure) throw impure
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

  saveReplay:{
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
      impure:_(`impure`),
      Replays:_(`Replays`),
      _maxReplaysLength:_(`_maxReplaysLength`),
      save:_(`saveReplay`),
    },
    call(what = Replays) {
      if (!isArray(what))
        what = defines(what, replay)
      if (!isArray(what) || (what.length&1))
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
    philosophy:`Culture is polite fiction made for efficiency, and so are programming languages. At some point, you have to define things with no deeper explanation. (Not \`concept\`s, though: they are consequences. The real sources are learned end-to-end, as in \`autoWorld\`.)`,
    interrupt:false,
    argCount:2,
    call(data, code) {
      if (code === call && typeof data == 'function')
        return data[defines.key] && data[defines.key][_id(call)] || data
      if (code === call && isArray(data) && typeof data[0] == 'function')
        return data[0][defines.key] && data[0][defines.key][_id(call)] || data[0]

      const d = _view(data)
      return d ? d[_id(code, true)] : undefined
    },
  },

  _view:{
    docs:`\`(_view Concept)\`: returns the view of \`Concept\`, used to look up things in it.`,
    call(data) {
      if (isArray(data)) data = data[0]
      return data ? data[defines.key] : undefined
    },
  },

  concept:{
    docs:`\`(concept Key1 Value1 Key2 Value2 …? …?)\`: a \`construct\` that \`defines\` some things.

This gives functions (such as \`call\` or \`adjust\`) free and easy extensibility points. For example, rather than co-opting strings and files (duck typing, docstrings, documentation, READMEs) to convey parts of a concept, define functionality such as \`docs\` directly.

A concept is not necessarily static. The dream is to make \`alloc\`/\`conceptType\` continuously \`regenerate\` concepts, ever improving. But this prospect are mostly theoretical for now.`,
    philosophy:`Concepts have no defined boundaries and affect other things, so obviously, making \`concept\` be able to define one level of things in special circumstances fully encapsulates the concept of a concept.
(This was poking fun at the naming of \`concept\`, which is a rigid consequence of a learned representation. Still a solid way to define code networks such as Conceptual, though. And perhaps the \`autoWorld\` family could give a good way to make \`concept\`s dynamic and learned? We'll see.)`,
    readAt:{
      defines:_(`defines`),
    },
    Initialize(net) {
      // Fill globals' id-to-key mapping for deconstruction of concepts.
      if (!concept.idToKey) concept.idToKey = Object.create(null)
      Object.keys(net).forEach(k => concept.idToKey[_id(net[k])] = net[k])
    },
    editObject:false,
    map:true,
    construct(x, obj) {
      if (!concept.idToKey) concept.idToKey = Object.create(null)
      if (!(x.length & 1)) error("Expected the value of a key", x[x.length-1], "in", x)
      if (obj === undefined) {
        let callable = false
        for (let i = 1; i < x.length; i += 2)
          if (x[i] === call) { callable = true;  break }

        if (!callable)
          obj = Object.create(null)
        else
          obj = function called(...args) { return called[defines.key][_id(call)](...args) }
        obj[defines.key] = Object.create(null)
        return obj
      } else {
        const d = obj[defines.key]

        // Clear previous items.
        for (let k in d) delete d[k]

        // Fill in definitions.
        for (let i = 1; i < x.length; i += 2) {
          const k = x[i], v = x[i+1], idK = _id(k)
          d[idK] = v, concept.idToKey[idK] = k
          // Make augmenting `func`s with other stuff easier, by copying sub-definitions of the `call` definition.
          if (k === call && v && v[defines.key]) for (let k in v[defines.key]) if (!(k in d) && +k !== _id(readAt)) d[k] = v[defines.key][k]
        }

        if (typeof obj == 'function') d[_id(deconstruct)] = x

        // Definitions are NOT `Object.freeze`d. `observe` concepts to catch changes.
      }
      // .idToKey (an object, so that `deconstruct` can know what the numbers mean).
      //   (Keys are then forever strongly-held, in this implementation.)
    },
  },

  map:{
    docs:`\`{Key1 Value1 Key2 Value2 …? …?}\` or \`(map Key1 Value1 Key2 Value2 …? …?)\`: a key-value store.
The array-representation of a JS Map.
Read/write keys with \`mapRead\`/\`mapWrite\`.`,
    readAt:{
      read:_(`mapRead`),
      write:_(`mapWrite`),
    },
    map:true,
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

  weakMap:{
    docs:`\`(weakMap Key1 Value1 Key2 Value2 …? …?)\`: a \`map\` that holds keys weakly.
Garbage collection, serialization, and rewriting will only preserve keys/values of those keys that are referenced elsewhere.
The array-representation of a JS WeakMap.`,
    map:true,
    construct(x, obj) {
      if (obj === undefined) return new WeakMap
      else {
        // Fill values.
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
    return typeof s == 'string' && s && (!varName && /^[_a-zA-Z][_a-zA-Z0-9]*$/.test(s) || !/\s/.test(s) && _isValidJS('let '+s+'=('+s+')\ntry{}catch('+s+'){}'))
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
        const temps = [...ctx.keys()].map(k => typeof k == 'string' ? 'ⴵ'+k : '').filter(x => x).join(',')
        const perms = [...ctx.keys()].map(k => typeof k == 'string' && k).filter(x => x && _isValidIdentifier(x, true)).join(',')
        src.push("let " + perms)
        src.push(`if(typeof ⴵfunc=='function')ⴵfunc[ⴵbind] = (${temps}) => [${perms}] = [${temps}]`)
        src.push("return ⴵfunc")
        const sourceURL = new Array(16).fill().map(() => randomNat(32).toString(32)).join('')
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

  case:{
    docs:`This exists only to highlight a thing in js.`,
  },


  _test(env) {
    let failed = 0, finished = 0, total = 0

    // Run all examples to make sure that they indeed evaluate to what we have specified.
    const done = new Set
    Self.ctx.forEach(v => {
      if (isArray(v) || done.has(v)) return
      done.add(v)
      const r = defines(v, examples)
      if (isArray(r))
        r.forEach(a => {
          if (typeof a == 'function') return [0,1,2].map(a).forEach(([a,b]) => eq(a,b))
          if (!isArray(a)) return
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
            if (!isArray(result) || result[0] !== jsRejected) {
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
    genDepthFirst:true,
    examples:[
      `Inner contexts are always bound first:`,
      [
        `^(a:1 (0 a a:2) (a b) (0 a:3 a) b:4)`,
        `(0 2) (1 4) (0 3)`,
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
Other languages use let-bindings for variables (and devote lots of attention to scoping rules (\`bound\`) and various declaration methods (\`construct\`) and their subversions such as lambdas (\`make\`)), but here we just share graph nodes (and build the language on top of a simple graph interchange format, \`basic\`) (…and do \`bound\`/\`construct\`/\`make\` at \`parse\`-time). This makes fundamental meaning a first-class citizen, so we can refer to anything without worrying about its binding scope.

Putting all variables in a single global namespace is easy to develop, and gives no surprises to the user if references to them are instantly highlighted.`,
    interrupt:false,
    call(ctx, v, cyclic = true, env, rewrite) {
      if (typeof cyclic != 'boolean') error("`cyclic` must be a boolean")
      if (!(ctx instanceof Map) && typeof ctx != 'function') error("`ctx` must be a Map or a function")
      if (rewrite !== undefined && typeof rewrite != 'function') error("`rewrite` must be undefined or a function")
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
    if (typeof v != 'string') {
      for (let i = bound.innerCtxs.length; i-- > 0; ) {
        const ctx = bound.innerCtxs[i]
        if (ctx.has(v) || ctx.has(_unlabel(v))) {
          const r = ctx.has(v) ? ctx.get(v) : ctx.get(_unlabel(v))
          if (bound.env.has(r)) return bound.env.set(v, bound.env.get(r)), bound.env.get(v)
          if (r === v) return v
          return bound.cyclic ? _doBinding(r) : r
        }
      }
      if (bound.ctx instanceof Map && (bound.ctx.has(v) || bound.ctx.has(_unlabel(v)))) {
        const r = bound.ctx.has(v) ? bound.ctx.get(v) : bound.ctx.get(_unlabel(v))
        if (bound.env.has(r)) return bound.env.set(v, bound.env.get(r)), bound.env.get(v)
        if (r === v) return v
        return bound.cyclic ? _doBinding(r) : r
      }
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
    if (isArray(v) && (v[0] === label && v.length == 2)) return v
    // Copy the array and bind its parts.
    if (isArray(v)) {
      let copy, changed = false, pushedCtx = false
      try {
        if (v[0] === bound && v.length == 3 && v[1] instanceof Map) {
          bound.innerCtxs.push(v[1]), pushedCtx = true
          const inner = v[2]
          if (_isLabel(inner)) {
            for (let i = bound.innerCtxs.length; i-- > 0; ) {
              const ctx = bound.innerCtxs[i]
              if (ctx.has(inner) || ctx.has(_unlabel(inner)))
                return bound.env.set(inner, bound.cyclic ? _doBinding(inner) : inner), bound.env.get(inner)
            }
            if (bound.ctx instanceof Map && (bound.ctx.has(inner) || bound.ctx.has(_unlabel(inner))))
              return bound.env.set(inner, bound.cyclic ? _doBinding(inner) : inner), bound.env.get(inner)
          }
          if (_isVar(inner)) return inner
          copy = isArray(inner) ? inner.slice() : inner
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
      if (isArray(copy) && (copy[0] === label && copy.length == 2)) return copy
      copy = !changed ? v : defines(copy, merged) === true ? merged(copy) : copy // This doesn't actually merge cycles.
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
          if (maxDepth && depth && depth % maxDepth === 0 && isArray(x)) needsNaming.add(x)
          ++depth
          if (!parents.has(x)) { // Set the immediate parent.
            parents.set(x, parent)
            currentAncestors.add(x)
            if (isArray(x))
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
        if (isArray(x))
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
        if (isArray(x))
          x.forEach(invertParents)
      }
      function unbindChildren(x, ignoreEnv = false, ignoreName = false) {
        if (!ignoreName && names.has(x)) return !unenv.has(x) && unenv.set(x, names.get(x)), names.get(x)
        if (!ignoreEnv && unenv.has(x)) return unenv.get(x) === unbindChildren && unenv.set(x, x.slice()), unenv.get(x)
        if (preserve(x)) return unenv.set(x,x), x
        if (!isArray(x)) return unenv.set(x,x), x
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
        if (isArray(x)) x.forEach(noCycles)
        noCycles.s.delete(x)
        return x
      }
    },
  },

  _errorIsStacked:[
    _(`settings`),
    true,
    `If checked, turns all \`error\` calls into \`errorStack\` calls.`,
  ],

  error:{
    docs:`\`(error …Causes)\`: throws an error when executed, containing useful information as to its likely cause.
Indicates a bug in the code, and is mostly intended to be presented to the user so that code does not go this way.`,
    examples:[
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
      _errorIsStacked:_(`_errorIsStacked`),
      try:_(`try`),
      fast:_(`errorFast`),
      stack:_(`errorStack`),
    },
    call(...msg) { throw !_errorIsStacked[1] ? [error, ...msg] : [error, ...msg, 'at', _resolveStack(undefined, 2)] },
  },

  try:{
    docs:`\`(try Func OnError …Args)\`: returns \`Func(…Args)\` unless an \`Error\` is thrown inside, and if so, returns \`OnError(Error,…Args)\`.`,
    genDepthFirst:true,
    type:[
      _(`funcType`),
      [
        _(`funcType`),
        [
          _(`rest`),
          `Inputs`,
        ],
        `Output`,
      ],
      [
        _(`funcType`),
        `Error`,
        [
          _(`rest`),
          `Inputs`,
        ],
        `Output`,
      ],
      [
        _(`rest`),
        `Inputs`,
      ],
      `Output`,
    ],
    examples:[
      [
        `try a->(error 'oh no') err->a->(print err 'occured while processing' a);'ho' 15`,
      ],
    ],
    dispose:true,
    call(fn, onErr, ...args) {
      let [Error, adjSaveLength] = interrupt(2)
      try {
        if (Error !== undefined) throw Error
        if (adjSaveLength === undefined) adjSaveLength = adjustUndo()
        const r = fn(...args)
        adjustSave(_onlyUndefined)
        return r
      } catch (err) {
        if (err === undefined) throw undefined
        if (err !== interrupt) {
          Error = err
          if (adjSaveLength != null) // Make sure that no instructions on how to adjust the "try" branch are left.
            adjustUndo(adjSaveLength), adjSaveLength = null
          try {
            const r = onErr(err, ...args)
            adjustSave(err)
            return r
          } catch (err) { if (err === interrupt) interrupt.stack.push(Error, adjSaveLength);  throw err }
        } else throw interrupt.stack.push(Error, adjSaveLength), interrupt
      }
    },
    adjustLater:true,
    mergeAdjustment:null,
    adjust:{
      call(ins, _, dout) {
        if (call.pure) throw impure
        const [fn, onErr, ...args] = ins
        let [Error] = interrupt(1)
        try {
          if (Error === undefined) Error = adjustLoad(null), Error === undefined && (Error = null)
          if (Error === _onlyUndefined) {
            // Adjust `fn(...args)`.
            const b = adjust(fn, args, null, dout)
            b.unshift(undefined, undefined)
            return b
          } else {
            // Adjust `onErr(Error, ...args)`.
            let b, a = _allocArray(1+args.length)
            a[0] = Error
            for (let i=0; i < args.length; ++i) a[i+1] = args[i]
            try { b = adjust(onErr, a, null, dout) }
            finally { _allocArray(a) }
            b.unshift(undefined)
            return b
          }
        } catch (err) { if (err === interrupt) interrupt.stack.push(Error);  throw err }
      },
      dispose:_(`_disposeEachAndDealloc`),
    },
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
    call(url, lang, binds, style = false) {
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
    serialize:0,
    call(stack = new Error().stack || '', skipFrames = 1) {
      if (isArray(stack)) return stack
      else if (typeof stack != 'string') error("Bad stack trace:", stack)
      return [_resolveStack, ...stack.trim().split('\n')].map((L,i) => {
        if (!i) return L
        if (/Error:|Error$/.test(L)) return void ++skipFrames
        if (i-1 < skipFrames) return
        const loc = /(?: \(|at.* \(?|@)(.+):(\d+):(\d+)\)?$/.exec(L)
        if (!loc) return L.indexOf('<anonymous>') < 0 ? L : ''
        let sourceURL = loc[1]
        const fs = _resolveStack.functions || (_resolveStack.functions = Object.create(null))
        const main = !(sourceURL in fs) ? Initialize : typeof WeakRef != ''+void 0 ? fs[sourceURL].deref() : fs[sourceURL]
        const lines = !(sourceURL in fs) && Initialize.lines ? Initialize.lines[''] : main.lines
        let line = +loc[2], column = +loc[3]
        if (column !== column) return
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
            const localLine = line - lines[i-2], str = _unevalFunction(sub, false, true)[1].split('\n')[localLine]
            if (str !== undefined)
              return [_extracted, sub, str.slice(0, column-1).replace(/^\s+/, '') + '/*|||*/' + str.slice(column-1)]
          }
          // Look up the original sourceURL:line:column in .location, or return sub.
          const locs = _resolveStack.location || (_resolveStack.location = new WeakMap)
          let s = sub
          if (locs.has(s))
            [sourceURL, line, column] = locs.get(s)
          else if (_cameFrom.m && _cameFrom.m.has(s) && locs.has(s = _cameFrom.m.get(s)))
            [sourceURL, line, column] = locs.get(s)
          else if (_cameFrom.m && _cameFrom.m.has(s) && locs.has(s = _cameFrom.m.get(s)))
            [sourceURL, line, column] = locs.get(s)
          else return sub
        }
        return sourceURL+':'+line+':'+column
      }).filter(x => x)
      // .functions (an object from sourceURL to function with .lines), .location (a WeakMap from expr to [sourceURL, line, column])
    },
  },

  _isError(v) { return isArray(v) && (v[0] === error || v[0] === jsRejected) },

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
      if (typeof document == ''+void 0) return isArray(content) ? content.join('') : content
      if (typeof tag == 'string' && content === undefined) return document.createElement(tag)

      const r = defines(tag, elem)
      if (typeof r == 'function') return r(tag, content, extra)

      if (typeof tag != 'string') error("Invalid elem tag:", tag)
      if (content != null && typeof content != 'string' && !isArray(content) && !(content instanceof Node))
        errorStack("Invalid elem content:", content)
      const el = document.createElement(tag)
      _elemAppend.to = el, _elemAppend(content)
      return el
    },
  },

  _elemAppend(ch) {
    // Out-of-document DOM append.
    if (isArray(ch)) ch.forEach(_elemAppend)
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
          if (isArray(x)) return cache.set(x, elem('node', x.map(print))), elemValue(cache.get(x), x), cache.get(x)
          if (typeof x == 'string' || x instanceof Node) return x
          throw "Bad structure"
        }
      } else {
        // Use offsets with proper depth for pretty-printing.
        // …or just join them, whatever.
        if (isArray(x)) return x.map(structured).join('')
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
      if (!a[0]) a.shift()
      if (!a[a.length-1]) a.pop()
      let isURL; try { new URL(a);  isURL = true } catch (err) {}
      const el = isURL ? elem(url, a.join(''), '[…]') : a.length ? elem('text', a) : ''
      return !top && elemValue(el, a), el
    }
  },

  referencedBy:{
    docs:`\`(referencedBy Global)\`: returns {all other globals that {this one (likely) refers to}}, and all other globals that this one \`defines\`, in two arrays in one array.
\`referencedBy()\`: returns an array of the {full {global reference} graph} and the {full {global definitions} graph}.`,
    call(f) {
      if (f) {
        const refs = new Set, defs = new Set
        const keywords = new Set(['const', 'try', 'if', 'function', 'new', 'typeof', 'void', 'return', 'else', 'instanceof', 'catch', 'finally', 'let', 'throw', 'while', 'for', 'continue', 'break', 'undefined', 'null', 'true', 'false', 'switch', 'case'])
        let n = 0
        function handle(f, topLevel) {
          if (!f || typeof f != 'object' && typeof f != 'function') return
          if (topLevel === 'def') return defs.add(f)
          if (_invertBindingContext(Self.ctx).has(f))
            if (topLevel !== 'top') return refs.add(f)
          if (++n > 9000) error('too big', [...refs])
          if (refs.has(f)) return; else refs.add(f)
          const d = defines(f, deconstruct)
          if (d && (!isArray(d) || d[0] !== concept)) f = d
          if (typeof f == 'function' && !d)
            _highlightGlobalsInString(_unevalFunction(f)[1], s => !keywords.has(s) && void handle(Self.ctx.get(s)), true)
          if (f instanceof Map) f.forEach((v,k) => (handle(k), handle(v)))
          else if (isArray(f)) f.forEach(v => handle(v))
          else if (f && f[defines.key])
            Object.keys(f[defines.key]).forEach(k => {
              if (concept.idToKey[+k] !== deconstruct || !isArray(d) && d[0] !== concept)
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
        if (referencedBy.refs) return [referencedBy.refs, referencedBy.defs]
        let rd, refs = new Map, defs = new Map
        Self.ctx.forEach(v => v && (rd = referencedBy(v), refs.set(v, rd[0]), defs.set(v, rd[1])))
        return referencedBy.refs = refs, referencedBy.defs = defs, [refs, defs]
      }
    },
  },

  referencesTo:{
    docs:`\`(referencesTo Global)\`: returns {all other globals that {this one is (likely) referenced in}}.
\`referencesTo()\`: returns the {full {global back-reference} graph}.`,
    Initialize(net) {
      // Warn about unused private variables (quite expensive to compute, so we hide that using a delay).
      if (typeof document != ''+void 0)
        setTimeout(() => Object.keys(net).forEach(k => k[0] === '_' && !referencesTo(net[k]).length && console.warn('Unused private:', k)), 10000)
    },
    call(f) {
      if (f) return referencesTo().get(f) || []
      else {
        if (referencesTo.refd) return referencesTo.refd
        const refd = new Map
        const [refs, defs] = referencedBy()
        refs.forEach((tos, from) => tos.forEach(to => {!refd.has(to) && refd.set(to, []), refd.get(to).push(from)}))
        return referencesTo.refd = refd
      }
    },
  },

  definersOf:{
    docs:`\`(definersOf Global)\`: returns each global that \`defines\` this one.
\`definersOf()\`: returns the {full {global back-definition} graph}.`,
    call(f) {
      // (Note: a perfectly-precise way to see dependencies/dependents would have been Maps from the defined global to the array of its deps.)
      if (f) return definersOf().get(f) || []
      else {
        if (definersOf.defd) return definersOf.defd
        const defd = new Map
        const [refs, defs] = referencedBy()
        defs.forEach((tos, from) => tos.forEach(to => {!defd.has(to) && defd.set(to, []), defd.get(to).push(from)}))
        return definersOf.defd = defd
      }
    },
  },

  sizeof:{
    docs:`\`(sizeof Global)\`: returns a global's approximate size in \`basic\` in bytes, where namespace-parents get children added up, and privates have their sizes distributed among users.
\`sizeof()\`: returns a \`hierarchy\` of sizes.`,
    call(g) {
      if (!sizeof.sz) {
        const opt = {dontBind:undefined}
        sizeof.sz = new Map
        const bonus = new Map
        Self.ctx.forEach((v,k) => fill(v, typeof k == 'string' && k[0] === '_'))
        bonus.forEach((n,g) => {
          for (; g; g = readAt.parents.get(g) || Self) {
            if (sizeof.sz.get(g)) sizeof.sz.set(g, sizeof.sz.get(g) + n)
            if (g === Self) return
          }
        })
        bonus.clear()
        sizeof.sz.forEach((s,g) => !s && sizeof.sz.delete(g))
        sizeof.sz = new Map([...sizeof.sz].sort((a,b) => b[1] - a[1]))
        function fill(g, isPrivate) {
          if (!g || sizeof.sz.has(g)) return
          opt.dontBind = typeof g != 'boolean' ? g : undefined
          const s = serialize(g, basic, Self.ctx, opt).length
          if (!isPrivate) {
            sizeof.sz.set(g, s)
            let p = readAt.parents.get(g)
            if (p === undefined) p = Self
            bonus.set(p, (bonus.get(p) || 0) + s)
          } else {
            const p = referencesTo(g)
            for (let i=0; i<p.length; ++i)
              bonus.set(p[i], (bonus.get(p[i]) || 0) + s / p.length)
          }
        }
      }
      return !g ? hierarchy(sizeof.sz, Self, undefined, undefined, undefined, false) : sizeof.sz.get(g)
    },
  },

  _highlightGlobalsInString:{
    docs:`Just some approximation. Wraps potential references to globals in <known>.
Also wraps numbers in <number>.
Also wraps links in <a>.
Also wraps C-style comments in <unimportant>.
Also wraps C-style strings in <string>.`,
    call(str, wrapper = s => elem('known', s), noResult = false) {
      if (isArray(str) && str.length == 1) str = str[0]
      if (typeof str != 'string') return str
      if (str.length > 100000) return str

      if (!_highlightGlobalsInString.regex) {
        const regexSrc = ['\\s+', '\\b[0-9]+(?:\\.[0-9+])?\\b', '(?:file|http|https)://(?:[^\\s\'"`:\\}\\)]|:/)+']
        Self.ctx.forEach((v,k) => typeof k == 'string' && regexSrc.push(k.replace(/[^_a-zA-Z0-9]/g, s => '\\'+s)))
        regexSrc.sort((a,b) => b.length - a.length)
        regexSrc.push('//.+', '/\\*[^]+?\\*/')
        regexSrc.push("[a-z]'")
        regexSrc.push("'[^\\n']*'", '"[^\\n"]*"')
        regexSrc.push("`[^\\n`]*`")
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
        else if (r && +r === +r)
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
            el = wrapper(r), typeof document != ''+void 0 && el instanceof Element && Self.ctx.has(r) && elemValue(el, Self.ctx.get(r))
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
      if (typeof f == 'string' && +f !== +f && f.length < 5 && /^[A-Za-z]+$/.test(f)) return [f]
      if (isArray(f)) return null
      return isArray(defines(f, nameResult)) ? defines(f, nameResult) : typeof defines(f, nameResult) == 'string' ? [defines(f, nameResult)] : null
    },
  },

  serialize:{
    docs:`\`(serialize Expr)\` or … or \`(serialize Expr Language Bindings Options)\`: serializes \`Expr\` into a string or a DOM tree (that can be parsed to retrieve the original structure).

A language \`defines\` this to serialize differently. A serialized array's head \`defines\` this with \`0\` to always collapse the array, or with an integer to only show that many items.

\`Options\` \`\`elemCollapse elem('text','must be undefined or a JS object like { style=false, observe=false, collapseDepth=0, collapseBreadth=0, maxDepth=∞, offset=0, offsetWith=''  '', space=()=>'' '', nameResult=false, deconstructPaths=false, deconstructElems=false, dontBind=undefined }')\`\`.
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
    call(arr, lang, ctx = Self.ctx, opt) {
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

      const backctx = _invertBindingContext(serialize.ctx = ctx)
      const deconstruction = new Map
      const named = new Set
      const lengths = new Map
      const boundToUnbound = new Map
      const unboundToBound = new Map
      const weakMaps = []
      const doNotEmit = new Set
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
        })(resultElem, arr, lang, ctx, opt, a), .2)
        a.forEach(b => observe(b, reserialize, true))
      }

      let n = 0
      const freeNames = []
      const nodeNames = styles && typeof document != ''+void 0 && new Map
      backctx.forEach((v,k) => (dontBind === undefined || k !== dontBind) && boundToUnbound.set(k,k))
      doNotEmit.forEach(v => boundToUnbound.set(v,v))
      const u = unbound(postDeconstructed, nameAllocator, boundToUnbound, maxDepth)
      boundToUnbound.forEach((u,b) => {
        if (b === u) return
        if (unboundToBound.has(b)) b = unboundToBound.get(b)
        if (!unboundToBound.has(u) || !isArray(b))
          unboundToBound.set(u, b)
      })
      boundToUnbound.clear()
      if (breakLength) breakLength -= offset * offsetWith.length

      let struct = [], len = 0
      emit(defines(lang, serialize), u)
      if (isArray(struct) && struct.length == 1) struct = struct[0]

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
            if (isArray(v) && v[0] === bound && v[1] instanceof Map && v.length == 3) v = v[2]
            const isStyled = struct.length == 1 && (isArray(struct[0]) || typeof document != ''+void 0 && struct[0] instanceof Node)
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
          const el = _colored(elemValue(elem('number', '<< id:'+_id(f)+' >>'), f), 4, 24)
          if (typeof document != ''+void 0 && el instanceof Node) el.special = true
          emit(el)
          return
        }
      }
      function recCollapse(el, depth = 0) {
        if (typeof document == ''+void 0 || !(el instanceof Element) || el.tagName === 'NODE' && !('to' in el) || el.classList.contains('label')) return el
        for (let ch = el.firstChild; ch; ch = ch.nextSibling)
          ch = recCollapse(ch, el.tagName === 'NODE' ? depth+1 : depth)
        // If the deconstructed value is an array with a head that defines `serialize`, collapse as needed.
        const unb = deconstruction.get(el.to)
        const definedCollapse = isArray(unb) ? defines(unb, serialize) : null
        if (depth && definedCollapse === 0 || depth && el.tagName === 'NODE' && depth % collapseDepth === 0 || el.tagName == 'STRING' && typeof el.to == 'string' && el.to.length > 128) {
          const title = el.title
          el = styleNode(elemCollapse(el), unb, el.to)
          title && (el.title = title)
        }
        const breadth = definedCollapse || collapseBreadth
        if (breadth && typeof el.to != 'string' && el.childNodes.length-2 > breadth && el.title !== 'bound')
          for (let i = breadth+1, ch = el.firstChild; i && ch; ch = ch.nextSibling)
            'to' in ch && --i, !i && elemCollapse(ch, null);
        return el
      }

      function valueOfUnbound(u) {
        if (isArray(u) && u[0] === bound && u[1] instanceof Map) u = u[2]
        if (unboundToBound.has(u)) return unboundToBound.get(u)
        if (typeof document != ''+void 0 && u instanceof Element && 'to' in u)
          return u.to
        if (backctx.has(u)) return u
        if (_isDOM(u)) return u
        if (isArray(u) && u.length == 3 && u[0] === _extracted) return [_extracted, valueOfUnbound(u[1]), valueOfUnbound(u[2])]
        if (isArray(u)) return u.map(valueOfUnbound)
        if (typeof u != 'string') console.warn("Did not find the value of the unbound", u)
        return u
      }
      function styleNode(str, u, v) {
        if (!styles) return str
        !unboundToBound.has(u) && unboundToBound.set(u,v)
        const originalLen = lengths.get(str) || str && str.length
        if ((str === ' ' || typeof str == 'string' && !str.trim()) && u === undefined && v === undefined) return elem('space', str)

        // Associate with the value to bathe same-objects in the same light.
        const el = styles(str, v, u, ctx)
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
          if (doNameResult && (isArray(x) || typeof x == 'string'))
            suggestions = nameResult(isArray(x) ? x[0] : x)
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

        if (x instanceof WeakMap) {
          const y = [weakMap]
          deconstruction.set(x, y), unboundToBound.set(y, x), weakMaps.push(x)
          deconstruction.forEach((dec, original) => x.has(original) && y.push(dec, deconstructed(x.get(original))))
          return y
        }

        if (_isLabel(x)) return unboundToBound.set(x,x), named.add(x[1]), x
        if (backctx && backctx.has(x))
          if (dontBind === undefined || x !== dontBind)
            return unboundToBound.set(x,x), named.add(backctx.get(x)), x
        const original = x
        if (deconstructElems || !_isDOM(x))
          if (typeof x != 'string' && typeof x != 'number')
            if (!isArray(x) || defines(x, construct) !== undefined)
              x = deconstruct(x, deconstructPaths)
        unboundToBound.set(x, original)
        deconstruction.set(original, x)

        if (_isDisposable(original) && original.size > _maxSerializedTensorSize[1])
          unboundToBound.set(x[1], x[1]), doNotEmit.add(x[1])

        if (isArray(x) && !_isVar(x)) {
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
          x = copy
        }

        // Handle `weakMap`s.
        for (let i = 0; i < weakMaps.length; ++i)
          if (weakMaps[i].has(original))
            deconstruction.get(weakMaps[i]).push(x, deconstructed(weakMaps[i].get(original)))

        return x
      }
      function toString(i, alphabet) {
        if (i < alphabet.length) return alphabet[i]
        return toString(Math.floor(i / alphabet.length), alphabet) + alphabet[i % alphabet.length]
      }
      function pprint(arr, breakLength) {
        if (!isArray(arr) || hasNonString(arr)) return arr
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
        if (doNotEmit.has(v)) {
          const col = elemValue(elem('collapsed', '···'), v)
          col.special = true
          return col
        }
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
        return !isArray(arr) ? arr : arr.map(x => !el.trim() ? str : x)
      }
      function serializeLines(arr, depth = 0) {
        if (!isArray(arr)) return arr
        const d = depth+1
        const serialized = pprint(arr.map(line => serializeLines(line, d)), breakLength && (breakLength - d * offsetWith.length))
        if (!isArray(serialized)) return serialized
        
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
      elemValue.empty = Object.freeze([]) // Always empty.
      if (typeof document == ''+void 0) return
      elemValue.elems = new Map // A map from an object to array of elements with that as value.
      elemValue.resources = new Set // Objects that should be disposed when unneeded.
    },
    call(el, v, removeElemTree = false, recursiveRemove = false) {
      if (typeof document == ''+void 0) return elemValue.empty
      const originalV = v
      if (isArray(v) && v[0] === quote && v.length == 2) v = v[1]
      const m = elemValue.elems
      if (el instanceof Element) {
        if ('to' in el && m.has(el.to) && m.get(el.to).indexOf(el) >= 0)
          // If changing the value, remove the old one.
          m.get(el.to).splice(m.get(el.to).indexOf(el), 1)
        if (removeElemTree) {
          if (isArray(el.to) && el.to[0] === evaluator) _cancel(el.to[2])
          if (isArray(el.to) && el.to[0] === _evaluationElem) _cancel(el.to[1])
          elemValue(null, el.to, true, false)
          if (recursiveRemove)
            for (let ch = el.firstChild; ch; ch = ch.nextSibling)
              elemValue(ch, null, true, true)
          return
        }
        el.to = originalV
        if (_isDisposable(v) && !_rememberToDispose.seen.has(v))
          elemValue.resources.add(v)
        if (!m.has(v)) m.set(v, [])
        m instanceof Map && _limitMapSize(m, 100000)
        if (m.get(v).indexOf(el) >= 0) return el
        if (!el.classList.contains('groupedValue')) m.get(v).push(el)
        return el
      } else {
        if (!removeElemTree && m.has(v)) {
          // Filter out non-connected elems in-place.
          let n = 0, arr = m.get(v)
          for (let i=0; i < arr.length; ++i)
            if (arr[i].isConnected) arr[n++] = arr[i]
            else elemValue(arr[i], undefined, true, true)
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

  _colorVariables:[
    _(`settings`),
    false,
    `Whether we should paint labels for the same values with the same color (randomly for each value), in parses and serializations.`,
  ],

  _maxSerializedTensorSize:[
    _(`settings`),
    64,
    `Max data size before we collapse \`tensor\` data, in serializations.`,
  ],

  _valuedColor(v) {
    // Returns v's previously displayed element color (for highlighting of the same things) or a new one.
    if (!_colorVariables[1]) return 'var(--main)'
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
      if (u[0] !== jsEval || typeof u[1] != 'string' || u[2] && (!isArray(u[2]) || u[2][0] !== map) || u.length > 3) {
        if (typeof document != ''+void 0 && isArray(u) && u[0] instanceof Element)
          return match(_fancyTopLevel, u)
        if (typeof document != ''+void 0 && isArray(u) && u[0] === jsRejected && typeof u[1] == 'string' && u.length == 2)
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
      const special = / ⴲ[a-zA-Z0-9]+ /g, str = u[1], ctx = u[2][0].call(...u[2])
      let r, i = 0
      while (r = special.exec(str)) {
        match(str.slice(i, special.lastIndex - r[0].length))
        match(defines(js, serialize), ctx.get(r[0].slice(1,-1)))
        i = special.lastIndex
      }
      match(str.slice(i))
    },
    style(struct) {
      if (!isArray(struct)) return struct
      return elem('span', struct.map(s => typeof s != 'string' ? s : elem('span', _highlightGlobalsInString(s))))
    },
    philosophy:`JS (and the web ecosystem) is a seemingly-unimpressive language that aims to take over all aspects of computing, in a manner similar to the ones before but completely safe and universal and eventually as little loss in performance as is possible. Like attracts like, and Conceptual is written in JS, though it's obviously much less impressive, because much less total thinking time went into it.`,
  },

  _extracted:{
    docs:`For parsing \`c:x\`. Returning this to a \`REPL\` binds a label to a value, too.`,
  },

  _unrollRest(a) {
    // (1 2 (rest (3 4 5)) 6 7) —> (1 2 3 4 5 6 7).
    if (isArray(a))
      for (let i = 0; i < a.length; ++i)
        if (isArray(a[i]) && a[i][0] === rest && a[i].length == 2)
          !isArray(a[i][1]) && error('Expected the array to unroll'),
          a.splice(i, 1, ...a[i][1]) // Quadratic but easy.
  },

  parse:{
    docs:`\`(parse String)\` or … or \`(parse String Language Bindings Options)\`: parses String into the graph represented by it, returning \`(Expr StyledInput)\`.
This first turns a \`String\` into a tree-of-arrays via syntax rules of \`Language\`, then into a graph-of-arrays via \`bound\`, then into graph-of-objects via \`makeGraph\`.

\`Options\` is like \`{style false sourceURL '' syntaxOnly false}\`.`,
    todo:`Cache unchanged subtrees when re-parsing, for speed.`,
    philosophy:`Parsing is more than just extracting meaning from a string of characters (it's also styling and associating source positions).`,
    Initialize() {
      parse.dom = { style:true }
    },
    call(str, lang, ctx = Self.ctx, opt = null) {
      if (typeof str == 'string') str = str ? [str] : []
      if (_isDOM(str)) str = _innerText(str) // Don't even attempt to cache subtrees
      if (typeof str != 'string' && !isArray(str)) throw 'Expected a string, or an array of strings and special elements'

      if (!lang) lang = fancier
      const [doWeStyle = false, sourceURL = '', syntaxOnly = false] = _destructure(opt, ['style', 'sourceURL', 'syntaxOnly'])
      const styles = doWeStyle ? defines(lang, style) || style : undefined

      let [
        i = 0, lastI = 0, prevI = 0, localS = str[0],
        localI = 0, curBegin = 0, line = 1, column = 1,
        lineLengths = sourceURL && [], lines = sourceURL && new Map, columns = sourceURL && new Map, struct = styles && [],
        Unbound = styles && new Map, env, u, b,
        makeEnv
      ] = interrupt(17)
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
            if (sourceURL && isArray(r)) lines.set(r, startLine), columns.set(r, startColumn)
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


        if (env === undefined) {
          // Match structure.
          try { u = !lang ? match(parser.topLevel) : match(defines(lang, parse)) }
          catch (err) { throw err !== interrupt ? err : error("Interrupts during syntax parsing is not allowed (`makeGraph` can have those, though)") }
          if (localI < str.length) throw 'Superfluous characters at the end: ' + (typeof localS == 'string' ? localS.slice(i - curBegin) : '···')

          // Do binding with the original⇒copy map preserved so that we can style structure bottom-up properly.
          env = (styles || sourceURL) && new Map
          b = styles || sourceURL ? bound(ctx, u, true, env) : bound(ctx, u, true)
          makeEnv = (styles || sourceURL) && new Map
        }
        // The only part that can interrupt:
        try { b = makeGraph(b, makeEnv, syntaxOnly) } catch (err) { if (err === interrupt) throw err;  b = _errorRepr(err).map(quote) }

        function styleNode(struct) {
          if (typeof document != ''+void 0 && struct instanceof Node) return struct
          let unb, v
          if (!Unbound.has(struct) && typeof struct == 'string' && ctx.has(struct))
            unb = label(struct), v = ctx.get(struct)
          else
            unb = Unbound.get(struct), v = ctx.has(unb) ? ctx.get(unb) : env.has(unb) ? env.get(unb) : unb, makeEnv.has(v) && (v = makeEnv.get(v)),
            // "Unbound" here really means "bound but not made". Inconsistent, but, styling needs this more.
            env.has(unb) && (unb = env.get(unb))
          if (typeof struct == 'string' && (struct === ' ' || !struct.trim()) && unb === undefined && v === undefined)
            return elem('space', struct)
          if (isArray(struct)) {
            struct = struct.map(styleNode)
            if (struct.length == 1 && (isArray(struct[0]) || typeof document != ''+void 0 && struct[0] instanceof Node))
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
        if (err === interrupt) interrupt.stack.push(i, lastI, prevI, localS, localI, curBegin, line, column, lineLengths, lines, columns, struct, Unbound, env, u, b, makeEnv)
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
      return n && +n === +n || n === 'NaN' ? +n : label(n)
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
        return _basicExtracted.lastExtractedObj = [_extracted, key, v]
      } else return key
    }
    if (isArray(u) && u[0] === _extracted && u.length == 3)
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
        if (isArray(v) && v[0] === _extracted)
          (ctx || (ctx = new Map)).set(v[1], v[2])
        else arr.push(v)
      }
      if (ctx) return [bound, ctx, arr]
      return arr
    }
    if (!isArray(u)) error("Must be an array:", u)
    let ctx
    if (isArray(u) && u[0] === bound && u[1] instanceof Map && u.length == 3)
      ctx = u[1], u = u[2]
    _needsGrouping.pos && _needsGrouping.pos.delete(match())
    if (isArray(u))
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
    else if (isArray(u) && u[0] === _extracted && u.length == 3)
      match(_basicExtracted, u, base)
    else if (isFancy && isArray(u) && u[0] === _unctx('map'))
      match(_fancyMap, u, null, base)
    else if (callSyntax && isArray(u))
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

  _unctx(s) { return serialize.ctx.get(s) },

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
    if (isArray(u))
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
    if (isArray(u))
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
          return !isArray(reprs[i]) ? [label(reprs[i]), b] : [...reprs[i].map(label), b]
        }
      }
      return match(base)
    }
    if (isArray(u))
      for (let i=0; i < reprs.length; i += 3) {
        let ok = !isArray(reprs[i]) ? u.length == 2 && u[0] === _unctx(reprs[i]) : (u.length == reprs[i].length+1)
        if (isArray(reprs[i]) && ok)
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
    if (isArray(u) && u[0] === _unctx(head) && u.length > 2) {
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
      const sPredicts = ['predict', '=', /(\s*)=\1/y]
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
        if (!isArray(u)) return _basicValue(match, u)
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
      if (isArray(u) && u[0] === bound && u[1] instanceof Map && u.length == 3)
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
      if (isArray(arr) && !arr.length) match.notEnoughInfo("No value at top level")
      match(/\s+/y)
      return _unwrapOneOrMany(arr)
    }
    _fancyOutermost(match, _wrapOneOrMany(u), true)
  },

  _basicTopLevel(match, u) { // (f); a b c c:x; a:b
    if (u === _specialParsedValue) {
      let arr = _basicMany(match, u, null, _basicOutermost)
      if (isArray(arr) && !arr.length) match.notEnoughInfo("No value at top level")
      match(/\s+/y)
      return _unwrapOneOrMany(arr)
    }
    return _basicMany(match, _wrapOneOrMany(u), null, _basicOutermost)
  },

  basic:{
    docs:`A basic language for ordered-edge-list graphs. Text, numbers, structures, and connections.
Every pair of brackets (and the top level, if there is more than one value) is an array in memory (or a \`construct\` if bold). Its items are space-separated. There are also labels (able to bind to pre-defined globals or user-defined bindings), strings, numbers, and graph bindings (\`a:b\` binds all instances of the label \`a\` to the value \`b\`, both before and after the binding, but only in its scope).
\`label\`, \`'string'\`, \`"string"\`, \`(0 1)\`, \`(a:2 a)\`, \`(func a b (add a b))\`.
This is a {more space-efficient than binary} representation for graphs of arrays.`,
    philosophy:`Lisp was nice for its time, but now we can have nice UI and AI, so Lisp needed a remastering.`,
    style:_(`_basicStyle`),
    parse:_(`_basicTopLevel`),
    serialize:_(`_basicTopLevel`),
    REPL:`also see \`(docs)\` or \`tutorial tutorial\`.`,
    insertLinkTo:_(`_basicLinkTo`),
    _escapeLabel:_(`_basicEscapeLabel`),
    _unescapeLabel:_(`_basicUnescapeLabel`),
    Initialize() { basic.labels = /-?\d*\.?\d+(?:[eE]+-?\d+)?|-Infinity|[^=!?:;\s\(\)\[\]\{\}<>@#$%\+\-\*\/\&\|\.'"`\,\\←→·⇒\ue000-\uf8ff]+/y },
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
        `array 1 - 2 -3`,
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
        `\\1+2 func:array add:pow`,
        `input 1`,
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
      const proposals = isArray(v) && nameResult(v) || []
      while (names.has(name = i < proposals.length ? proposals[i] : toString(i - proposals.length, 'abcdefghijklmnopqrstuvwxyz'))) ++i
      const topLevel = el.parentNode === ed || el.parentNode.parentNode === ed
      rBecomes = document.createTextNode(name)
      r.deleteContents(), r.insertNode(rBecomes), r.setEndAfter(rBecomes)
      el.replaceWith(elBecomes = document.createTextNode(name))
      if (isArray(v) && v.length > 1 && topLevel && !el.classList.contains('hasOperators') && el.firstChild.textContent[0] !== '(')
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
    if (typeof u == 'number' && isArray(s) && s.length == 1 && typeof s[0] == 'string')
      return _colored(elem('number', s[0]), 4, 24) // underline
    if (typeof u == 'string' && isArray(s) && s.length == 1 && typeof s[0] == 'string') {
      if (typeof document == ''+void 0) return _colored(s[0], 32) // green
      const el = elem('string', [s[0][0], _highlightGlobalsInString(s[0].slice(1,-1)), s[0].slice(-1)])
      return el.title = 'string', el
    }
    if (isArray(v) && v[0] === _extracted && v.length == 3 && s.length == 3 && typeof document != ''+void 0) {
      s[1] = elem('operator', s[1])
      const el = elem('extracted', s)
      el.title = 'extracted', el.classList.add('hasOperators')
      return el
    }
    if (typeof document != ''+void 0 && (v instanceof Map && v.size > 1 || defines(u, map) || defines(v, map) || v && v[defines.key] && (!isArray(defines(v, deconstruct)) || defines(v, deconstruct)[0] === concept)) && u && u[0] !== arrayObject && isArray(s) && s.length > 1) {
      // Construct a <table>, with brackets and `map` outside of it, and each key-value pair having its own <tr>.
      let i, start = (s[0].textContent || s[0]) === '{' ? 0 : (s[0].textContent || s[0]) === '(' ? 2 : 1
      if (!start) s.splice(1, 0, ''), start = 1
      let last = s[s.length-1].textContent || s[s.length-1], end = last === ')' ? s.length-1 : s.length
      const rows = []
      let a = 1
      for (i = start; i+3 < end; i += 4) {
        if (s[i+0].nodeName !== 'SPACE' && s[i]) break
        if (s[i+1].nodeName === 'EXTRACTED') break
        if (s[i+2].nodeName !== 'SPACE') break
        if (s[i+3].nodeName === 'EXTRACTED') break
        const row = elem('tr', [elem('td', [s[i], s[i+1]]), elem('td', [s[i+2], s[i+3]])])
        elemValue(row, merged([rest, merged([s[i+1].to, s[i+3].to])]))
        rows.push(row)
      }
      if (i > start+4) s = [...s.slice(0,start), elem('table', rows), ...s.slice(i)]
    }

    if (isArray(s)) {
      if (s.length == 3 && (s[0] === '(' || s[0] === '[') && (s[2] === ')' || s[2] === ']'))
        // Grouped values are highlighted only once
        if (typeof document != ''+void 0 && s[1] instanceof Element)
          s[1].to === v && (s[1].classList.add('groupedValue'), elemValue(s[1], null, true))
      for (let i=0; i < s.length; ++i) {
        const t = typeof s[i] == 'string' && s[i].trim()
        if (t && (t === '(' || t === '[' || t === '{' || t === ')' || t === ']' || t === '}'))
          s[i] = _colored(elem('bracket', s[i]), 33) // Brackets are brown
      }
    }
    if (typeof document != ''+void 0 && s[0] instanceof Node && s[1] instanceof Node && s[1].tagName === 'BRACKET')
      s[0].classList.add('funcCall'), s[1].classList.add('funcCall')

    let hasOperators = false
    if (isArray(s) && isArray(u) && !_isLabel(u) && s.length > 1)
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
      const v1 = isArray(v) && v[0] === bound && v[1] instanceof Map ? v[2] : v
      const u1 = isArray(u) && u[0] === bound && u[1] instanceof Map ? u[2] : u
      if (!isArray(v1) || isArray(u1) && v1.length != u1.length)
        el.classList.add('nonArray')
      if (_isLabel(u1))
        el.style.color = _valuedColor(v1), el.classList.add('label')
      let title = ''
      if (!title && isArray(u) && u.length && backctx.has(u[0])) title = backctx.get(u[0])
      if (!title && isArray(v) && v.length && backctx.has(v[0])) title = backctx.get(v[0])
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
        `fast.'parse' '(12)'`,
        `12`,
      ],
      [
        `fast.'parse' '(a:(b) b:(a) a)'`,
        `a a:a()()`,
      ],
      [
        `fast.'parse' (fast.'serialize' ^(a b a:b() b:a()))`,
        `a b a:b() b:a()`,
      ],
      [
        `fast.'serialize' ^(a b a:b() b:a()) undefined (jsEval '{humanReadableMode:true}')`,
        `'(&0:(&1) &1:(&0) (&0 &1))'`,
      ],
      [
        `fast.'parse' '("a""b")'`,
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
          if (name && +name === +name) return +name
          for (let i = ctxs.length-1; i >= 0; --i)
            if (ctxs[i] && name in ctxs[i]) return ctxs[i][name]
          return label(name)
        }
        function labelBind(arr) {
          // Unlike `bound` used in `basic`, this binds in-place.
          if (!isArray(arr)) return arr
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
      serialize(expr, ctx = Self.ctx, opt) {
        // Walk expr and name all referenced-more-than-once nodes, then output them then expr.

        const humanReadableMode = opt && opt.humanReadableMode

        const backctx = _invertBindingContext(ctx)
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
          if (!isArray(arr)) {
            if (typeof arr == 'string' || typeof arr == 'number') return
            if (arr instanceof Map || defines(arr, deconstruct))
              deconstruction.set(arr, deconstruct(arr)), arr = deconstruction.get(arr)
            else throw "Cannot serialize a not-`deconstruct`ible not-an-array"
          }
          if (!isArray(arr)) throw "All values must be string/number or Map or array or deconstruct to an array"
          if (arr[0] === label && typeof arr[1] == 'string' && arr.length == 2) {
            if (/[\x80-\ue000]/.test(arr[1])) throw "An exotic label to "+arr[1]+" detected"
            return
          }
          arr.forEach(mark)
        }
        function isCall(v) { return isArray(v) && !names.has(v) && !backctx.has(v) && (v[0] !== label || typeof v[1] != 'string' || v.length != 2) }
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
          if (!isArray(v)) throw "Not-an-array unknown value"
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
        return _matchUnary(match, u, topLevel, _fancierOutermost, fMultiFunc, sFunc)
      }
      function fMultiFunc(match, u, topLevel) { // a->b->c
        return _matchSequence(match, u, topLevel, fMultiFuncType, 'func', /(\s*)(?:→|->)\1/y, '→')
      }
      function fMultiFuncType(match, u, topLevel) { // a⇒b⇒c
        return _matchSequence(match, u, topLevel, fLast, 'funcType', /(\s*)⇒\1/y, '⇒')
      }
      function fLast(match, u, topLevel) { // a;b;c
        return _matchSequence(match, u, topLevel, fArrayType, 'last', /\s*;\s*/y, ';')
      }
      function fArrayType(match, u, topLevel) { // a&b&c
        return _matchSequence(match, u, topLevel, fCompare, 'tupleType', /(\s*)&\1/y, '&')
      }
      const sCompare = ['less', '<', /(\s*)<\1/y]
      function fCompare(match, u, topLevel) {
        return _matchLtR(match, u, topLevel, fPredicts, sCompare)
      }
      const sPredicts = ['predict', '=', /(\s*)=\1/y, 'setFuture', '←', /(\s*)(?:←|<-)\1/y]
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
      function _baseOf(arr) { for (let i=0; isArray(arr[0]) && arr[0].length && i < 10; ++i) arr = arr[0];  return arr[0] }
      function fGrouping(match, u, topLevel) { // (x)
        if (u === _specialParsedValue) {
          // A non-bracketed basic call, or a bracketed sequence of values.
          let f = match(fCallFunc)
          return fCallArgs(match, u, f)
        }
        // Emit `(a b c)` if `(0 1 2)`.
        const base = isArray(u) && _baseOf(u)
        const linearityPreferred = isArray(u) && u.length > 1 && u[0] !== _extracted && (defines(base, construct) !== undefined || !isArray(base) && typeof base != 'function')
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
        if (!isArray(u)) return _basicValue(match, u)
        if (!u.length) return match(_basicValue, arrayObject), match('('), match(')')
        _emitGrouping.groupOpen = '(', _emitGrouping.groupClose = ')'
        if (!_needsGrouping.pos) _needsGrouping.pos = new Set
        const pos = match()
        if (_needsGrouping.pos.has(pos)) // Emit base if the second pass is over.
          return !topLevel || u.length <= 1 ? fCallArgs(match, u) : _basicValue(match, u, _basicMany, _fancierOutermost)
        _needsGrouping.pos.add(pos)
        try {
          return match(_fancierOutermost, u, topLevel)
        } finally { _needsGrouping.pos.delete(pos) }
      }
      function fCallFunc(match, u) { // f or (f x y)
        if (match(/\s*\(\s*/y)) {
          const r = _unwrapOneOrMany(_basicMany(match, u, null, _fancierOutermost))
          if (r === undefined || isArray(r) && !r.length) match.notEnoughInfo('Expected a value to group at '+match())
          !match(/\s*\)/y) && match.notEnoughInfo("Expected the closing grouping bracket `)` at "+match())
          return r
        } else return _basicValue(match, u, null, _fancierOutermost)
      }
      function fCallArgs(match, u, f) { // f(a,b) or f{a,b, c,d}
        if (u === _specialParsedValue) {
          if (f === undefined) return
          while (true) {
            let ok = false
            if (match('(')) {
              f = [f], ok = true
              while (!match(')')) {
                const v = _unwrapOneOrMany(match(_basicMany, null, _fancierOutermost))
                if (v === undefined || isArray(v) && !v.length) break
                f.push(v)
                if (match(',')) match(/\s+/y)
              }
            }
            else if (match('{')) {
              const m = _unwrapOneOrMany(_basicMany(match, u, [label('map'), null, null], _fancierOutermost))
              ;(m[0] !== bound || !(m[1] instanceof Map) ? m : m[2]).unshift(label('make'))
              match(/\s+/y)
              !match('}') && match.notEnoughInfo("Expected the closing bracket `}`")
              f = [f, m], ok = true
            }
            if (!ok) break
          }
          return f
        }
        if (!isArray(u)) return _basicValue(match, u)
        if (u[0] === bound && u[1] instanceof Map && u.length == 3) return _fancierOutermost(match, u)

        if (_isLabel(u) || isArray(u) && u[0] === _extracted && u.length == 3)
          return _basicValue(match, u, null, _fancierOutermost)

        if (!u.length) return match(_basicValue, arrayObject), match('('), match(')')
        match(!isArray(u[0]) ? _basicValue : _fancierOutermost, u[0])
        if (false && u.length == 2 && isArray(u[1]) && u[1][0] === map) // …Doesn't vibe with contextMenu.
          return match(_fancierOutermost, u[1])
        match('(')
        for (let i=1; i < u.length; ++i)
          match(_fancierOutermost, u[i]), i < u.length-1 && match(',')
        match(')')
      }
    },
    call(match, u, topLevel) {
      let ctx, needsGrouping = !topLevel || match()
      if (isArray(u) && u[0] === bound && u[1] instanceof Map && u.length == 3)
        ctx = u[1], u = u[2], needsGrouping = needsGrouping && match('(')
      const r = _fancierOutermost.syntax(match, u, topLevel)
      if (ctx) ctx.forEach((v,k) => {
        match(' '), match(_basicExtracted, [_extracted, k, v], _fancierOutermost.syntax)
      }), needsGrouping && match(')')
      return r
      // .syntax (the matching function that specifies the syntax over basic values; see how Initialize is defined here)
    },
  },

  _fancierTopLevel(match, u) { // (f); a b c c:x; a:b
    if (u === _specialParsedValue) {
      let arr = _basicMany(match, u, null, _fancierOutermost)
      if (isArray(arr) && !arr.length) match.notEnoughInfo("No value at top level")
      match(/\s+/y)
      return _unwrapOneOrMany(arr)
    }
    _fancierOutermost(match, u, true)
  },

  _unwrapOneOrMany(r) {
    // Unwraps the result of `_basicMany`'s parsing (an array) into one element if it's of length 1.
    if (!isArray(r)) return r
    const inner = r[0] === bound && r[1] instanceof Map ? r[2] : r
    if (r.length == 1) r = r[0]
    if (r[0] === bound && r[1] instanceof Map && !inner.length) {
      // Return the last `(_extracted K V)`, bind to the rest.
      let k;  r[1].forEach((V,K) => k = K)
      const v = r[1].get(k), ex = _basicExtracted.lastExtractedObj
      r[1].delete(k)
      if (ex[1] === k && ex[2] === v) return !r[1].size ? ex : (r[2] = ex, r)
      return !r[1].size ? [_extracted, k, v] : (r[2] = [_extracted, k, v], r)
    }
    if (!isArray(inner)) return inner
    if (r[0] === bound && r[1] instanceof Map && inner.length == 1)
      r[2] = r[2][0]

    return r
  },

  _wrapOneOrMany(u) {
    // Wraps the input to `_basicMany`'s serialization into an array of one element if needed.
    if (isArray(u) && u[0] === bound && u[1] instanceof Map) {
      const i = u[2]
      return !isArray(i) || i.length <= 1 || _isLabel(i) ? [u[0], u[1], [i], ...u.slice(3)] : u
    }
    return !isArray(u) || u.length <= 1 || _isLabel(u) ? [u] : u
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
    interrupt.ed = true
    interrupt.last = _debugLastInterrupt[1] ? new Error().stack : _debugLastInterrupt
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
    20,
    300,
    5,
  ],

  _checkInterrupt:{
    docs:`Checks whether an interrupt is appropriate right now.`,
    call(cause) {
      if (!call.env) return
      if (interrupt.noInterrupt) return
      if (!interrupt.stack) {
        // If we stepped enough (ensuring progress), and either we have worked for N ms or the nesting depth is as wanted by _pausedToStepper, interrupt.
        if (call.env[_id(step)])
          --call.env[_id(step)], ++_checkInterrupt.step
        else if (call.env[_id(_pausedToStepper)] !== undefined && call.depth <= call.env[_id(_pausedToStepper)])
          _causeInterrupt(cause, _pausedToStepper)
        else if (timeLimit.end !== undefined && _userTimeSince() > timeLimit.end)
          throw _checkInterrupt.step = 0, timeLimit
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
        `step ^(1*2+3*4+5*6+7*8+9*10+11*12+13*14)`,
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
Define this to be \`false\` in a global if it will never interrupt. (\`_debugInterruptDefinitions\` can catch lies here.)

Technical details of usage:
\`_causeInterrupt(cause)\` to unconditionally interrupt execution.
Create function state in a JS function like \`let [i = 0, j = 0] = interrupt(2)\`, in particular for counters of loops. Make sure to put interruptible computations not here but inside the try/catch below, to not corrupt interrupt state. There is almost no error-checking, for efficiency!
Wrap function body after getting its state in \`try{…}catch(err){ if (err === interrupt) interrupt.stack.push(i,j);  throw err }\`.`,
    readAt:{
      _msBeforeInterrupt:_(`_msBeforeInterrupt`),
      _debugInterruptDefinitions:_(`_debugInterruptDefinitions`),
      _debugLastInterrupt:_(`_debugLastInterrupt`),
      check:_(`_checkInterrupt`),
      step:_(`step`),
    },
    philosophy:`Termination checking (totality) is unnecessary if the host can just interrupt and continue. In fact, it is misleading to provide a false assurance of everything terminating {in reasonable time}.
Interruption (and sandboxing) is absolutely essential for being able to actually use a program comfortably, and for stepping through the program, but no one buzzes about it. Probably because almost all rely on the OS to provide it via processes, and/or heuristic-based totality guarantees.`,
    _cancel(stack) { isArray(stack) && _rememberToDispose(stack) },
    call(retrieve) {
      if (retrieve !== retrieve>>>0)
        error("Expected the count of items to retrieve, got", retrieve)
      if (interrupt.ed) error("Cannot consume interrupt stack-state space while interrupting")
      const tmp = interrupt.tmp || (interrupt.tmp = []), stack = interrupt.stack
      if (!stack) return tmp.length = 0, tmp
      if (stack.length < retrieve)
        error("Corrupted the interrupt state somewhere; check correctness of every store/restore, and/or use", _debugInterruptDefinitions, ", or compare", _resolveStack(interrupt.last), "with this call stack — got state left:", ...stack)

      tmp.length = retrieve
      const start = stack.length - retrieve
      for (let i = start; i < stack.length; ++i) tmp[i - start] = stack[i]
      stack.length = start
      if (!start) _allocArray(stack), interrupt.stack = call.env[_id(interrupt)] = undefined

      return tmp

      // .tmp, .noInterrupt, .started, .stack, .last, .ed
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

  _htmlOfRewrite(JS) {
    return JS(undefined, {into:'document.body', prefix:`<!doctype html>
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
  },

  Rewrite:{
    docs:`\`Rewrite()\`: view the next rewrite in an \`<iframe>\`. Also is a namespace for quining.
Makes the system adaptable to more usage scenarios, and gives an in-system way to human-modify any code directly.`,
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
The correctness of quining of functions can be tested by checking that the rewrite-of-a-rewrite is exactly the same as the rewrite. Or by incorporating rewriting into the lifecycle.

(Machine-learning-wise, this horizon is too final for me. It needs literally perfection to be even approached.)`,
    Initialize() {
      Rewrite.ctx = new Map(Self.ctx)
      Rewrite.ctx.delete('_globalScope')
    },
    call(JS = ToScopedJS) {
      let html = _htmlOfRewrite(JS)
      const download = elem('a', 'Download the next rewrite, or preview:')
      download.download = 'index.html'
      download.style.verticalAlign = 'bottom'
      const refresh = elemValue(button(function() {
        html = iframe.srcdoc = _htmlOfRewrite(JS)
        URL.revokeObjectURL(u), u = download.href = URL.createObjectURL(new Blob([html], {type:'text/html'}))
      }, '🔁', 'Refresh the rewrite.'), Rewrite)
      refresh.doNotCloseTheContextMenuOnClick = true
      let u = download.href = URL.createObjectURL(new Blob([html], {type:'text/html'}))
      const i = setInterval(() => !download.isConnected && (clearInterval(i), URL.revokeObjectURL(u)), 60000)
      elemValue(download, html)
      const iframe = elem('iframe')
      iframe.title = 'Preview of the next rewrite'
      iframe.srcdoc = html
      const iframeResize = elem('div', iframe)
      iframeResize.classList.add('resizable')
      const result = elem('div', [download, refresh, iframeResize])
      return result
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
        `ToReadableJS Self.'ctx' (jsEval '{dontMarkLines:true, into:"document.body.appendChild(document.createElement(\\"div\\")))"}')`,
      ],
    ],
    call(net = Rewrite.ctx, opt) {
      if (!(net instanceof Map))
        error('Expected a map, got', net)
      const markLines = opt ? !opt.dontMarkLines : true, lines = [], funs = []
      net.forEach((v,k) => typeof k == 'string' && !_isValidIdentifier(k) && error('Not a valid JS identifier:', k))
      const seen = new Map
      const weakMaps = new Map
      mark(net)
      seen.set(net, 0)
      const names = new Map
      net.forEach((v,k) => { typeof k == 'string' && (seen.get(v) !== 0 && names.set(v, k), seen.set(v, 0)) })
      let s = [], nextName = 0, depth = 0, line = 1
      opt && typeof opt.prefix == 'string' && write(opt.prefix)
      write(`/* Code begins at the first \`})({\`, as methods that are bound to each other. _XXX methods are private and somewhat invisible. */\n`)
      write(`'use strict';\n`)
      write(`(function() {\n`)
      write(`const __version = ${str(__version.replace(/[0-9]+$/, s => +s+1))}\n`)
      if (markLines) write(`const __line = function(lines, funs) { for (let i=0; i < funs.length; ++i) __line.lines[''].push(lines[i], funs[i]) }\n`)
      if (markLines) write(`__line.lines = {['']:[]}\n`)
      write(`const _ = (function is(name) {\n`)
      write(`  const obj = Object.create(is)\n`)
      write(`  return obj.is = name, obj\n`)
      write(`});\n`)
      write(_unevalFunction(__base)[1].replace(/__INTO__/, opt && opt.into || 'document.body')+'\n')
      write("__base({")
      ++depth
      net.forEach((v,k) => {
        if (typeof k != 'string') return
        write('\n\n')
        if (markLines && _isValidIdentifier(k, true) && _unevalFunction(v, true)) lines.push(line), funs.push(k)
        method(identifier(k), v, seen.get(v) === 0)
        names.set(v, k), seen.set(v, 1)
      })
      seen.forEach((refCount, v) => {
        if (refCount <= 1) return
        if (!names.has(v)) names.set(v, ++nextName)
        write('\n\n'), method(identifier(names.get(v)), v, true)
      })
      --depth
      write(`\n})\n`)
      funs.length && write(`__line([${lines}],[${funs}])\n`)
      write(`})()`)
      return s.join('')

      function resolve(x) {
        return typeof x != 'string' && net.has(x) ? net.get(x) : x
      }
      function mark(x) {
        x = resolve(x)
        if (x == null || typeof x == 'number' || typeof x == 'boolean' || typeof x == 'string') return
        seen.set(x, (seen.get(x) || 0) + 1)
        if (seen.get(x) !== 1) return
        if (!isArray(x) && defines(x, deconstruct)) return mark(deconstruct(x))
        else if (x instanceof Map) x.forEach((v,k) => (mark(k), mark(v)))
        else if (x instanceof WeakMap)
          weakMaps.set(x, []), seen.forEach((rc, obj) => x.has(obj) && (weakMaps.get(x).push(obj), mark(x.get(obj))))
        else if (isArray(x)) x.forEach(mark)
        else if (x && !x[defines.key] && typeof x == 'object')
          Object.keys(x).forEach(k => mark(x[k]))
        else if (x && x[defines.key])
          Object.keys(x[defines.key]).forEach(k => (mark(resolve(concept.idToKey[+k])), mark(x[defines.key][k])))
        if (weakMaps.size)
          weakMaps.forEach((keys, wm) => wm.has(x) && (keys.push(x), mark(wm.get(x))))
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
        else if (!isArray(x) && defines(x, deconstruct)) {
          // Deconstructed concepts become is(…) to evaluate on start.
          const d = deconstruct(x)
          if (!isArray(d) || defines(d, construct) === undefined) error("Must be an actual construct:", d)
          write('_('), put(d), write(')')
        } else if (isFunc(x)) {
          write(x[1])
        } else if (isArray(x)) {
          write('['), ++depth // […]
          x.forEach(el => (write('\n'), put(el), write(',')))
          --depth, write('\n]')
        } else if (x instanceof Map) { // new Map([…])
          if (!x.size) return write('new Map')
          write('new Map(['), ++depth
          x.forEach((v,k) => (write('\n['), put(k), write(','), put(v), write('],')))
          --depth, write('\n])')
        } else if (x instanceof WeakMap) {
          write('_([')
          put(weakMap), write(',')
          weakMaps.get(x).forEach(k => (put(k), write(','), put(x.get(k)), write(',')))
          write('])')
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
            if (c !== readAt && (v instanceof Map || v && !isArray(v) && !v[defines.key] && typeof v == 'object'))
              throw "Only the definition of readAt can be an object"
            def.set(c, v)
          })
          if (def.size) {
            if (x === Self)
              def.set(readAt, undefined)
            if (typeof x == 'function')
              def.set(call, _unevalFunction(x))
            write('{'), ++depth // {…} in definitions.
            def.forEach((v,k) => {
              write('\n')
              if (markLines && ignoreName && k === call) lines[lines.length-1] = line
              method(identifier(names.get(k)), v)
            })
            --depth, write('\n}')
          } else put(_unevalFunction(x))
        } else throw "Unknown value to put"
      }
      function str(s) { return "`" + String(s).replace(/`|\\|${/g, s => '\\' + s) + "`" }
      function identifier(s) { return s && +s === +s || /^[_a-zA-Z][_a-zA-Z0-9]*$/.test(s) ? ''+s : '[' + str(s) + ']' }
      function isFunc(x) { return isArray(x) && x[0] === jsEval && typeof x[1] == 'string' }
      function method(key, v, ignoreName = false) {
        if (typeof v != 'string' && net.has(v)) v = net.get(v)
        if (_unevalFunction(v, true) && (ignoreName || !names.has(v)) && !v[defines.key]) v = _unevalFunction(v)
        if (isFunc(v) && v[1].slice(0,8) === 'function' && (ignoreName || !names.has(v)))
          write(key), v[1] = v[1].slice(v[1].indexOf('(')), put(v, ignoreName), write(',')
        else
          write(key), write(':'), put(v, ignoreName), write(',')
      }

      // The bootstrapper for this.
      function __base(net) {
        const globals = typeof self !== ''+void 0 ? self : typeof global !== ''+void 0 ? global : window
        const env = new Map
        const object = new Map
        const constructed = new Map

        const defKey = Symbol('defines')

        // preload is for easier readAts. load is basically a copy of `bound` with a little notational convenience stuff thrown in.
        preload(net, globals)
        load(net, globals, true)
        Object.keys(net).forEach(k => k && +k === +k && delete net[k])
        Object.keys(net).forEach(k => net[k] = globals[k])
        if (net.interrupt) net.interrupt.noInterrupt = false

        postload()
        Initialize.call(globals, net, typeof __line != ''+void 0 ? __line.lines : undefined)
        env.clear(), object.clear(), constructed.clear()

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
              if (into[k] === undefined && +k !== +k) into[k] = new Array(from[k].length)
              return
            }
            if (into[k] !== from[k] && +k !== +k) into[k] = from[k]
          })
          if (from.defines) into.defines.key = defKey
          if (from.call && from._newExecutionEnv) into.call.env = from._newExecutionEnv()
          if (from.interrupt) into.interrupt.noInterrupt = true
        }
        function load(from, into, inLookup) {
          // Handle is(…) (as ref-to-global) and arrays and objects (as definitions) specially.

          // Cache to prevent cycles from referring to old not-loaded versions of objects.
          if (env.has(from)) return env.get(from)
          if (from && Object.getPrototypeOf(from) === _) {
            // Look up symbols in the network.
            if (!object.has(from.is)) {
              if (Array.isArray(from.is)) into = postload(from)
              else if (!(from.is in net)) throw new Error("Not a link to an existing thing: "+from.is)
              else into = load(net[from.is], globals[from.is])
              env.set(from, into), object.set(from.is, into)
            }
            return object.get(from.is)
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
              }
              return into
            }
          }
          if (Array.isArray(from)) {
            // Look into arrays and load their elements.
            if (into === undefined) into = new Array(from.length)
            env.set(from, into)
            for (let i = 0; i < into.length; ++i) into[i] = load(from[i])
            return into
          }
          return from
        }
        function postload(from) {
          if (from !== undefined) {
            const x = from.is.map(x => load(x))
            const to = load(_('defines'))(load(from.is[0]), load(_('construct')))(x)
            constructed.set(to, from)
            env.set(from, to)
            return to
          } else
            constructed.forEach((from, obj) => construct(from.is.map(x => load(x)), obj)), constructed.clear()
        }
      }
    },
  },

  ToScopedJS:{
    docs:`Converts Self to a form that has itself hidden in a scope.`,
    call(net = Rewrite.ctx, opt) {
      if (!(net instanceof Map))
        error('Expected a map, got', net)
      if (net.has('_globalScope')) throw "Net must not have _globalScope"
      if (!net.has('_id')) throw "Net must have _id"
      if (!net.has('label')) throw "Net must have label"
      if (!net.has('concept')) throw "Net must have concept"
      const markLines = opt ? !opt.doNotMarkLines : true, lines = [], funs = []
      net.forEach((v,k) => typeof k == 'string' && k[0] === '$' && error('$ is reserved for hidden names, use something other than', k))
      net.forEach((v,k) => typeof k == 'string' && !_isValidIdentifier(k) && error('Not a valid JS identifier:', k))
      const names = new Map
      const weakMaps = new Map
      let n = 0
      mark(net, true)
      let s = [], line = 1
      opt && opt.prefix && write(opt.prefix)
      write(`'use strict';(()=>{\n`)
      write(`const __version = ${str(__version.replace(/[0-9]+$/, s => +s+1))}\n`)
      if (markLines) write(`const __line = function(lines, funs) { for (let i=0; i < funs.length; ++i) __line.lines[''].push(lines[i], funs[i]) }\n`)
      if (markLines) write(`__line.lines = {['']:[]}\n`)
      write(`let`)
      // Put the variables to hold values.
      net.forEach((v,k) => {
        v = resolve(v)
        if (typeof k != 'string' || !_isValidIdentifier(k, true)) return
        if (names.has(v) && names.get(v)[0] === '$')
          write('\n'), names.set(v, k), write(k), write('='), put(v, true), write(',')
      })
      names.forEach((name, v) => { if (name[0] === '$') write('\n'), write(name), write('='), put(v, true), write(',') })
      write('$' + (n++).toString(36))
      if (net.has('defines'))
        write('\nconst $$=defines.key=Symbol(\'defines\')\n')
      if (net.has('call') && net.has('_newExecutionEnv'))
        write(`call.env = _newExecutionEnv()\n`)
      if (net.has('interrupt'))
        write(`interrupt.noInterrupt = true\n`)
      // Fill the values of variables in.
      names.forEach((name, v) => {
        v = resolve(v)
        if (isArray(v) || _unevalFunction(v, true) || defines(v, deconstruct) === undefined) if (!fill(v)) write('\n')
        if (!isArray(v) && !_unevalFunction(v, true) && defines(v, deconstruct) !== undefined) {
          const d = deconstruct(v)
          const c = defines(d, construct)
          if (!isArray(d) || isArray(d[0]) || typeof defines(d[0], construct) != 'function') error("Invalid deconstruction:", d)
          let b = 0
          // For constructs, we want to put `name = construct([...d]);  <and much later>  construct([...d], name)`
          write(name), write('='), put(c), write('(['), d.forEach(el => (b++ && write(','), put(el))), write('])\n')
        }
      })
      // Put aliases.
      net.forEach((v,k) => {
        v = resolve(v)
        if (typeof k != 'string' || k === names.get(v)) return
        if (!_isValidIdentifier(k, true) || !_isValidIdentifier(names.get(v), true)) return
        write('let '), write(k), write('='), put(v), write('\n')
      })
      funs.length && write(`__line([${lines}],[${funs}])\n`)
      // Initialize the network.
      if (net.has('interrupt'))
        write(`interrupt.noInterrupt = false\n`)
      write(`\nInitialize.call(typeof self !== ''+void 0 ? self : typeof global !== ''+void 0 ? global : window, `)
      write(`{${[...net.entries()].map(([k,v]) => typeof k != 'string' ? null : k === names.get(v) ? k : k+':'+(names.get(v)||v)).filter(x => x).join(',')}}`)
      write(markLines ? `, __line.lines` : `, undefined`)
      write(`, ${opt && opt.into || null}`)
      write(')\n')
      // Construct things.
      names.forEach((name, v) => {
        v = resolve(v)
        if (!isArray(v) && !_unevalFunction(v, true) && defines(v, deconstruct) !== undefined) {
          const d = deconstruct(v)
          const c = defines(d, construct)
          let b = 0
          put(c), write('(['), d.forEach(el => (b++ && write(','), put(el))), write('],'), write(name), write(')\n')
        }
      })
      write(`\n})()`)
      return s.join('')

      function resolve(x) {
        return typeof x != 'string' && net.has(x) ? net.get(x) : x
      }
      function mark(x, topLevel) {
        // Gives names to all objects in the graph.
        x = resolve(x)
        if (x == null || typeof x == 'number' || typeof x == 'boolean') return
        let name
        if (names.has(x)) return; else if (!topLevel) names.set(x, name = '$' + (n++).toString(36))
        try {
          if (!isArray(x) && defines(x, deconstruct)) return mark(deconstruct(x))
          else if (x instanceof Map) x.forEach((v,k) => (!topLevel && mark(k), mark(v)))
          else if (x instanceof WeakMap) {
            weakMaps.set(x, [])
            names.forEach((name, k) => x.has(k) && (weakMaps.get(x).push(k), mark(x.get(k))))
          } else if (isArray(x)) x.forEach(x => mark(x))
          else if (x && !x[defines.key] && typeof x == 'object')
            Object.keys(x).forEach(k => mark(x[k]))
          else if (x && x[defines.key]) {
            if (x === net.get('Self')) return
            mark(net.get('_id')),
            Object.keys(x[defines.key]).forEach(k => (mark(resolve(concept.idToKey[+k])), mark(x[defines.key][k])))
          }
          weakMaps.size && weakMaps.forEach((keys, wm) => wm.has(x) && (keys.push(x), mark(wm.get(x))))
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
        else if (_unevalFunction(x, true)) {
          if (names.has(x)) lines.push(line), funs.push(names.get(x))
          const f = _unevalFunction(x)
          if (f[2] !== undefined && f[2] !== net && f[2] !== defines(Self, readAt))
            error("Can only do single-global-scope functions, got", f)
          write(f[1])
        } else if (!isArray(x) && defines(x, deconstruct)) write('0')
        else if (isArray(x)) write('[]')
        else if (x instanceof Map) write('new Map')
        else if (x instanceof WeakMap) write('new WeakMap')
        else if (x && typeof x == 'object') write('{}')
        else if (typeof x == 'string') write(str(x))
        else if (x == null || typeof x == 'number' || typeof x == 'boolean') write(''+x)
        else throw "Unknown value to put"
      }
      function str(x) { return "`" + String(x).replace(/`|\\|${/g, s => '\\' + s) + "`" }
      function key(s) { return /^[_a-zA-Z][_a-zA-Z0-9]*$/.test(s) ? '.'+s : s && +s === +s ? '['+s+']' : '[' + str(s) + ']' }
      function fill(x) {
        // Fills the created object.
        x = resolve(x)
        const name = names.get(x)
        if (isArray(x)) { // x.push(...)
          let b = 0
          write(name), write('.push('), x.forEach(el => (b++ && write(','), put(el))), write(')')
        } else if (x instanceof Map) // x.set(k,v).set(k,v)...
          x.size && write(name), x.forEach((v,k) => (write('.set('), put(k), write(','), put(v), write(')')))
        else if (x instanceof WeakMap) // x.set(k,v).set(k,v)...
          !weakMaps.has(x) && error("Internal error: WeakMap rewriting is wrong at", x),
          weakMaps.get(x).length && write(name), weakMaps.get(x).forEach(k => (write('.set('), put(k), write(','), put(x.get(k)), write(')')))
        else if (x && !x[defines.key] && typeof x == 'object') { // x[k]=v  \n  x[k]=v  \n  ...
          Object.keys(x).forEach(k => (write(name), write(key(k)), write('='), put(x[k]), write('\n')))
          return true
        } else if (x && x[defines.key]) { // Set name[defines.key][...] one by one.
          write(name), write('[$$]=Object.create(null)\n')
          Object.keys(x[defines.key]).forEach(k => {
            const key = resolve(concept.idToKey[+k])
            write(name), write('[$$]['), put(net.get('_id')), write('('), put(key), write(')]='), put(x[defines.key][k]), write('\n')
          })
          if (x !== net.get('Self')) write('Object.freeze('), write(name), write('[$$])\n')
          return true
        } else return true
      }
    },
  },

  System:{
    docs:`A namespace for low-level functions that should not be called in user code, for your mom's safety.`,
    readAt:{
      interrupt:_(`interrupt`),
      jsEval:_(`jsEval`),
      argCount:_(`argCount`),
      dispose:_(`dispose`),
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
      if (!isArray(a)) error("Expected array length or an array, got", a)

      // To test whether there are any errors in re-using arrays, uncomment the last line, and/or the others.
      // if (_allocArray.free.includes(a)) errorStack("Double-free of", a, "first freed at", _resolveStack(_allocArray.s.get(a)))
      // else if (Object.isFrozen(a) && a[0] === "Use-after-free of") error("Double-free:", ...a.slice(1))
      // else (_allocArray.s || (_allocArray.s = new WeakMap)).set(a, new Error().stack)
      // const prev = a.slice()
      // a.length = 4, [a[0], a[1], a[2], a[3]] = ["Use-after-free of", prev, "first freed at", _resolveStack(_allocArray.s.get(a))], Object.freeze(a)
      // return

      a.length = 0
      _allocArray.free.push(a)
    },
  },


  _allocMap:{
    docs:`_allocMap()⇒Map as a replacement for \`new Map\` and _allocMap(Map) to re-use objects.`,
    call(a) {
      if (!_allocMap.free) _allocMap.free = []
      if (a === undefined) return _allocMap.free.length ? _allocMap.free.pop() : new Map
      if (!(a instanceof Map)) error("Expected undefined or a Map, got", a)

      // To test whether there are any errors in re-using maps, uncomment the last line, and/or the others.
      // if (_allocMap.free.includes(a)) errorStack("Double-free of", a, "first freed at", _resolveStack(_allocMap.s.get(a)))
      // else (_allocMap.s || (_allocMap.s = new WeakMap)).set(a, new Error().stack)
      // return

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
            finally { isArray(v) && _allocArray(v) }
          }
        }
      }, .5)
    },
  },












































})
})()
