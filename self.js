/* Code begins at the first `})({`, as methods that are bound to each other. _XXX methods are private and somewhat invisible. */
'use strict';
(function() {
const __is = (function is(name) {
  const obj = Object.create(is)
  return obj.is = name, obj
});
function __base(net) {
  const globals = typeof self !== ''+void 0 ? self : typeof global !== ''+void 0 ? global : window
  const env = new Map

  const defKey = Symbol('defines')

  // preload is for easier lookups. load is basically a copy of `bound` with a little notational convenience stuff thrown in.
  preload(net, globals)
  load(net, globals, true)
  Object.keys(net).forEach(k => k && +k === +k && delete net[k])

  return Initialize.call(globals, net, typeof __line != ''+void 0 ? __line.lines : undefined)

  function objectFor(x) {
    // Load {call(){}} into a trivially-callable function, as a notational convenience.
    return x && typeof x.call == 'function' && x.call !== Function.prototype.call ? x.call : Object.create(null)
  }
  function preload(from, into) {
    // Pre-create objects/functions to be filled by `load`, so that arbitrary order of definitions is permitted.
    Object.keys(from).forEach(k => {
      if (from[k] && Object.getPrototypeOf(from[k]) === Object.prototype) {
        if (into[k] === undefined) into[k] = objectFor(from[k])
        if (typeof into[k] == 'function') into[k].displayName = k
        return
      }
      else if (Array.isArray(from[k])) {
        if (into[k] === undefined) into[k] = []
        return
      }
      if (into[k] !== from[k]) into[k] = from[k]
    })
    if (from.defines) into.defines.key = defKey
    if (from._read) into._read.marks = new Map
    Object.keys(from).forEach(k => {
      if (from[k] && Object.getPrototypeOf(from[k]) === __is) {
        if (Array.isArray(from[k].is)) { // Evaluate arrays.
          const m = from[k].is.map(load)
          defines(m[0], finish) && (m[0] = defines(m[0], finish))
          return from[k] = into[k] = m[0].call(...m)
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
      if (Array.isArray(from.is)) return from = from.is.map(load), defines(from[0], finish) && (from[0] = defines(from[0], finish)), from[0].call(...from)
      else if (!(from.is in net)) throw new Error("Not a link to an existing thing: "+from.is)
      else return load(net[from.is], globals[from.is])
    }
    if (from && Object.getPrototypeOf(from) === Object.prototype) {
      // Load object values: turn {…} into {[defines.key]:{…}}, as a notational convenience.
      if (into === undefined) into = objectFor(from)
      env.set(from, into)

      if (!inLookup) {
        let d
        for (let key of Object.keys(from)) {
          if (from[key] === defKey || from[key] === _read.marks) { into[key] = from[key];  continue }
            // Since objectFor(…) is different for functions, we have to copy.
          const k = load(__is(key))
          if (k !== call || typeof from[key] != 'function')
            (d || (d = Object.create(null)))[_id(k)] = load(from[key], undefined, k === lookup)
        }
        return d && (into[defKey] = into !== Self ? Object.freeze(d) : d), into
      } else {
        for (let k of Object.keys(from)) {
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
}
__base({

  Initialize:{
    txt:`The program's entry point.`,
    lookup:{
      Browser:__is(`Browser`),
      NodeJS:__is(`NodeJS`),
      Extension:__is(`Extension`),
      WebWorker:__is(`WebWorker`),
    },
    nameResult:[
      `conceptualNetwork`,
      `perpetualBeta`,
    ],
    call(net, lines) {
      if (!net || finish.v) throw "Do not call Initialize manually."
      if ('→'.charCodeAt() !== 8594) throw "Unicode data got garbled."
      if (defines(examples, txt).indexOf('\n ') >= 0) throw "Depth got added to strings."
      net[undefined] = undefined, Initialize.lines = lines
      _resolveStack.functions = Object.create(null)
      call.locked = new Map

      // Turn `net` into maps.
      let ctx = new Map, backctx = new Map
      Object.keys(net).forEach(k => (ctx.set(label(k), net[k]), (k[0] !== '_' || !backctx.has(net[k])) && backctx.set(net[k], k)))
      ctx.set(label('_globalScope'), net), backctx.set(net, '_globalScope') // Deconstructions are very ugly otherwise.
      parse.ctx = ctx, serialize.backctx = backctx
      ctx.forEach(v => _isArray(v) && _maybeMerge(v))
      Self[defines.key][_id(lookup)] = net

      // Fill globals' id-to-key mapping.
      concept.idToKey = Object.create(null)
      Object.keys(net).forEach(k => concept.idToKey[_id(net[k])] = net[k])

      // Mark lookup.parents of globals.
      lookup.parents = new Map
      function markParents(x, p) {
        if (lookup.parents.has(x) || x === Self || !x || typeof x != 'object' && typeof x != 'function') return
        if (p !== undefined) lookup.parents.set(x, p)
        if (p === undefined && backctx.has(x) && backctx.get(x)[0] === '_') lookup.parents.set(x, System)
        if (x instanceof Map) {
          x.forEach(v => markParents(v, p))
        } else if (x && !x[defines.key] && typeof x == 'object') {
          Object.keys(x).forEach(k => markParents(x[k], p))
        } else if (x && x[defines.key]) markParents(x[defines.key], x)
      }
      markParents(net)
      lookup.parents.set(net, Self)

      // Warn about unused private variables (quite expensive to compute though).
      setTimeout(() => Object.keys(net).forEach(k => k[0] === '_' && !refd(net[k]).length && console.warn('Unused private:', k)), 10000)

      // Store styling instructions in JS objects.
      serialize.dom = {
        style:true,
        nameResult:true,
        collapseDepth:8,
        collapseBreadth:32,
      }
      serialize.consoleColored = {
        style:true,
        nameResult:true,
        maxDepth:3,
      }
      parse.dom = {
        style:true,
      }

      // Select the appropriate JS-environment-specific entry point.
      let ok = false
      if (this.self && !this.window)
        WebWorker(), ok = true
      else {
        if (this.process)
          NodeJS(), ok = true
        if (this.document)
          Browser(), ok = true
        if (this.browser)
          Extension(), ok = true
      }
      if (!ok)
        throw "What is this JS environment? Submit a bug report so that we know of it."
    },
  },

  Execution:{
    txt:`Execution-related functionality.`,
    lookup:{
      rest:__is(`rest`),
      call:__is(`call`),
      finish:__is(`finish`),
      function:__is(`_function`),
      error:__is(`error`),
      await:__is(`await`),
      repeat:__is(`repeat`),
      Branching:__is(`Branching`),
    },
  },

  Branching:{
    txt:`Branching-related functionality.`,
    lookup:{
      first:__is(`first`),
      last:__is(`last`),
      if:__is(`if`),
    },
  },

  Expression:{
    txt:`Expression-related functionality.`,
    lookup:{
      quote:__is(`quote`),
      finish:__is(`finish`),
      label:__is(`label`),
      bound:__is(`bound`),
      unbound:__is(`unbound`),
      userTime:__is(`userTime`),
      realTime:__is(`realTime`),
      memory:__is(`memory`),
      journal:__is(`journal`),
      graphSize:__is(`graphSize`),
    },
  },

  Documentation:{
    txt:`Documentation-related functions.`,
    lookup:{
      buzzwords:__is(`buzzwords`),
      docs:__is(`docs`),
      txt:__is(`txt`),
      refs:__is(`refs`),
      refd:__is(`refd`),
      examples:__is(`examples`),
      future:__is(`future`),
    },
  },

  Numeric:{
    txt:`A namespace for some very primitive numeric-computation-related functionality.`,
    future:[
      `Zero-overhead typed numeric operations (on i32/i64/f32/f64; const.… and +-*/ and some mathy stuff), compiling to Wasm and WebGL.`,
      `(Dense dims dtype data strides) for tensors.`,
      `Have a named-dimension decorator that re-orders arrays for broadcasted operations as necessary.`,
    ],
    lookup:{
      reduce:__is(`reduce`),
      transform:__is(`transform`),
      broadcasted:__is(`broadcasted`),
      [`+`]:__is(`sum`),
      [`-`]:__is(`sub`),
      [`*`]:__is(`mult`),
      [`/`]:__is(`div`),
      Random:__is(`Random`),
    },
  },

  Data:{
    txt:`A namespace for some data-representation-related functions.`,
    lookup:{
      map:__is(`map`),
      array:__is(`array`),
      merge:__is(`merge`),
      lookup:__is(`lookup`),
      string:__is(`string`),
      concept:__is(`concept`),
      typed:__is(`typed`),
    },
  },

  UI:{
    txt:`A namespace for user interface functionality.`,
    lookup:{
      log:__is(`log`),
      elem:__is(`elem`),
      REPL:__is(`REPL`),
      evaluator:__is(`evaluator`),
      contextMenu:__is(`contextMenu`),
      button:__is(`button`),
      url:__is(`url`),
      structured:__is(`structured`),
      structuredSentence:__is(`structuredSentence`),
    },
  },

  Languages:{
    txt:`A namespace for languages and their handling.`,
    philosophy:`Languages just define how the bound-graph structure gets parsed/serialized, not execution.
Decoupling form from meaning allows composition and trivial changing of forms.`,
    lookup:{
      style:__is(`style`),
      parse:__is(`parse`),
      serialize:__is(`serialize`),
      fast:__is(`fast`),
      basic:__is(`basic`),
      fancy:__is(`fancy`),
      js:__is(`js`),
    },
  },

  inline:{
    txt:`A marker for making a function always inlined. Automatically set to true on user-defined functions.`,
  },

  repeat:{
    txt:`Finishing \`(repeat Expr)\`: loops forever when finished, interrupting as needed. \`repeat Expr Times\`: repeats the computation many \`Times\`.
Label-binding environment is not preserved.`,
    finish(expr, iterations) {
      // repeat (randomNat 10) 1000
      if (iterations !== undefined && typeof iterations != 'number' && typeof iterations != 'function')
        error("iterations must be undefined or a number or a function, got", iterations)
      const prevLog = finish.env[_id(log)], prevLabel = finish.env[_id(label)], us = finish.v
      let [i = 0, newLabel = new Map, into = log(elem('node', [elem('code'), elem('code')]))] = interrupt(repeat)
      prevLog && (finish.env[_id(log)] = into.firstChild), finish.env[_id(label)] = newLabel
      let v, done = false
      try {
        while (true) {
          v = finish(expr)
          if (_isUnknown(v)) return v[1] = _cameFrom(array(repeat, v[1], iterations), us), v
          _checkInterrupt(us)
          newLabel.clear()
          done = true
          ++i
          if (iterations && (typeof iterations === 'number' ? i >= iterations : iterations(v,i))) return into.remove(), v
        }
      } catch (err) {
        if (err === interrupt) {
          if (done)
            if (prevLog) {
              finish.env[_id(log)] = into.lastChild
              const pre = _smoothHeightPre(into)
              for (let ch = into.lastChild.firstChild; ch; ch = ch.nextSibling) elemRemove(ch, true, false)
              log(v)
              _smoothHeightPost(into, pre)
            } else log(v)
          interrupt(repeat, 3)(i, newLabel, into)
        }
        throw err
      }
      finally { finish.env[_id(log)] = prevLog, finish.env[_id(label)] = prevLabel }
    },
  },

  lookup:{
    txt:`\`Map.\` or \`(lookup Map)\`: returns an array of Map's keys.
\`(lookup Map Key)\`: returns the value in Map at Key (neither Key nor Value can be \`undefined\`), or \`undefined\` if not found.
(For string keys, can be written as \`obj.key\`.)`,
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
        `Self.lookup`,
        `lookup`,
      ],
    ],
    lookup:{
      scope:__is(`scope`),
    },
    merge:__is(`true`),
    call(m,k) {
      if (!_isArray(m) && defines(m, lookup)) m = defines(m, lookup)
      if (m instanceof Map) return k !== undefined ? m.get(k) : [...m.keys()]
      if (_isArray(m) || typeof m == 'string') return k === k>>>0 ? m[k] : k === undefined ? new Array(m.length).fill(0).map((_,i)=>i) : undefined
      if (m !== defines(Self, lookup) && serialize.backctx.has(m) || typeof m == 'function') return []
      return k !== undefined ? m[k] : Object.keys(m)
      // lookup.parents: a Map from globals to what namespace they belong to.
    },
  },

  Self:{
    txt:`A namespace for every function here. Project's GitHub page: https://github.com/Antipurity/conceptual`,
    lookup:__is(`undefined`),
  },

  scope:{
    txt:`hello`,
    lookup:{
      a:1,
      b:2,
      c:{
        txt:`hi again`,
      },
    },
  },

  graphSize:{
    txt:`\`(graphSize Expr)\`⇒Nat: returns the number of distinct objects in Expr, going into arrays.`,
    nameResult:[
      `size`,
    ],
    call(x, fitting) {
      const mark = new Set
      let n = 0
      function f(x) { if (!mark.has(x)) mark.add(x), (!fitting || fitting(x)) && ++n, _isArray(x) && x.forEach(f) }
      return f(x), mark.clear(), n
    },
  },

  purify:{
    txt:`\`(purify Expr)\`⇒Expr: partially-evaluates Expr, not executing impure subexpressions.`,
    examples:[
      [
        `x→(sum 1 2)`,
        `x→3`,
      ],
      [
        `(purify 1)`,
        `1`,
      ],
      [
        `(purify (quote x) x:(sum 1 2))`,
        `3`,
      ],
      [
        `(purify (quote x) x:(randomNat 5))`,
        `(_unknown (randomNat 5))`,
      ],
    ],
    nameResult:[
      `purified`,
    ],
    buzzwords:`partially-evaluating`,
    argCount:1,
    lookup:{
      impure:__is(`impure`),
    },
    call(x) {
      // Set finish.pure to true and just evaluate.
      const prev = finish.pure
      finish.pure = true
      try {
        const r = finish(x)
        if (!_isUnknown(r) || !_isDeferred(r)) return r
        else return r[1] = array(purify, r[1]), r
      }
      catch (err) { if (err !== interrupt) return [_unknown, jsRejected(err)]; else throw err }
      finally { finish.pure = prev }
    },
  },

  impure:{
    txt:`\`(impure)\`: signifies that {the current operation} must be {recorded in a pure context} and {not cached in a non-pure one}.`,
    call() {
      if (finish.pure && !impure.impure) throw impure
      else call.impure = true
    },
  },

  argCount:{
    txt:`A marker for the number of args to a function.`,
  },

  userTime:{
    txt:`\`(userTime)\`⇒\`TimeMark\` or \`(userTime TimeMark)\`: returns the time spent on this job as f64 milliseconds, or the non-negative in-job time elapsed since the mark.`,
    call(mark = 0) { return impure(), finish.env[_id(userTime)] + _timeSince(finish.env[_id(realTime)]) - mark },
  },

  realTime:{
    txt:`\`(realTime)\`⇒\`TimeMark\` or \`(realTime TimeMark)\`: returns the time since start as f64 milliseconds, or the non-negative time elapsed since the mark.`,
    call(mark = 0) { return impure(), _timeSince(mark) },
  },

  _timeSince:{
    txt:`\`(_timeSince)\`⇒\`TimeMark\` or \`(_timeSince TimeMark)\`: returns the current time as f64 milliseconds, or the non-negative time elapsed since the mark.
Makes no attempt to correct for the time to measure, \`(_timeSince (_timeSince))\`.
Browsers reduce the precision of this to prevent timing attacks. Putting that precision back could be beneficial.`,
    call(mark = 0) {
      if (typeof performance != ''+void 0 && performance.now) // Browser
        return performance.now() - mark
      else if (typeof process != ''+void 0 && process.hrtime && process.hrtime.bigint()) { // NodeJS
        if (!mark) return process.hrtime.bigint()
        return Math.max(0, Number(process.hrtime.bigint() - mark)/1e6)
      } else if (typeof require != ''+void 0) // NodeJS
        return require('perf_hooks').performance.now() - mark
      else {
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
    txt:`\`(memory.since)\`⇒MemMark or \`(memory.since MemMark)\`: Measures required-memory-size change (allocated memory) as non-negative f64 bytes. Always 0 in browsers.
Makes no attempt to correct for the memory-to-measure, \`(memory.since (memory.since))\`.`,
    call(mark = 0) {
      impure()
      if (typeof process == ''+void 0 || !process.memoryUsage) return 0
      const m = process.memoryUsage()
      return Math.max(0, m.rss + m.heapUsed - m.heapTotal - mark)
    },
  },

  memory:{
    txt:`\`(memory Expr)\`: Returns \`(Result MemoryIncrease)\`. Doesn't work in the browser.
Does not count memory allocated in interruptions (between executions of Expr) as part of the reported result.`,
    nameResult:[
      `resultAndIncrease`,
    ],
    lookup:{
      since:__is(`memorySince`),
    },
    call(x, add = 0) {
      const start = memorySince()
      const v = finish(x)
      if (_isUnknown(v)) return v[1] = [time, v[1], add + memorySince(start)], v
      return [v, memorySince(start) + add]
    },
  },

  _isArray(a) { return Array.isArray(a) },

  stopIteration:{
    txt:`\`(stopIteration Result)\`: when returned to \`reduce\`, iteration gets stopped with this result.`,
  },

  reduce:{
    txt:`\`(reduce Array Function)\` or \`(reduce Array Function Initial)\`: reduces Array with Function, reducing dimensionality (array nestedness) by 1: repeatedly sets Initial to the result of \`(Function Initial Element)\`. If Initial is undefined, it is assumed to be the first array element.`,
    examples:[
      [
        `(reduce sum 1)`,
        `1`,
      ],
      [
        `(reduce sum (1 2 3 4 5))`,
        `15`,
      ],
      [
        `(reduce sum (1 …(2 3 4) 5))`,
        `15`,
      ],
      [
        `(reduce sum (1 (2 3 4) 5))`,
        `(8 9 10)`,
      ],
    ],
    nameResult:[
      `reduced`,
    ],
    lookup:{
      stop:__is(`stopIteration`),
    },
    call(f, a, initial) {
      if (typeof f != 'function') error("Expected a function")
      if (!_isArray(a)) return initial !== undefined ? initial : a
      let [result = initial, i = 0] = interrupt(reduce)
      try {
        for (; i < a.length; ++i) {
          const v = a[i]
          if (result === undefined) result = v
          else if (f === sum && typeof result == 'number' && typeof v == 'number') result += v
          else if (f === sub && typeof result == 'number' && typeof v == 'number') result -= v
          else if (f === mult && typeof result == 'number' && typeof v == 'number') result *= v
          else if (f === div && typeof result == 'number' && typeof v == 'number') result /= v
          else result = f.call(f, result, v)
          if (_isArray(result) && result[0] === stopIteration) return result[1]

          if (_isUnknown(result)) return result[1] = array(reduce, quote(f), a.slice(i), result[1]), result
        }
      } catch (err) { if (err === interrupt) interrupt(reduce, 2)(result, i);  throw err }
      return result
    },
  },

  transform:{
    txt:`\`(transform Function Array)\`: transforms each element of Array by applying Function.
\`(transform G (transform F A))\` is the same as \`(transform (compose F G) A).\``,
    examples:[
      [
        `(transform x→(sum x 2) 1)`,
        `3`,
      ],
      [
        `(transform x→…(0 (mult x 2) 0) (1 …(2 3) 4))`,
        `(0 2 0 0 4 0 0 6 0 0 8 0)`,
      ],
    ],
    nameResult:[
      `transformed`,
      `mapped`,
    ],
    argCount:2,
    call(f,a) {
      if (typeof f != 'function') error("Expected a function but got", f)
      if (!_isArray(a)) return f.call(f, a)
      let [result = [], i = 0, record] = interrupt(transform)
      try {
        for (; i < a.length; ++i) {
          let r = f.call(f, a[i])

          if (_isUnknown(r)) {
            if (!record) {
              for (let k=0; k<i; ++k) result[k] = quote(result[k])
              record = r
            } else
              record.push(...r.slice(2))
            r = r[1]
          } else if (record)
            r = quote(r)

          // Add r to result.
          if (_isArray(r) && r[0] === rest && _isArray(r[1]) && r.length == 2)
            result.push(...r[1])
          else
            result.push(r)
        }
        return !record ? _maybeMerge(result) : (record[1] = result, record)
      } catch (err) { if (err === interrupt) interrupt(transform, 3)(result, i, record);  throw err }
    },
  },

  _toNumber(a) {
    if (_isArray(a)) return a.length == 1 ? _toNumber(a[0]) : a.map(_toNumber)
    if (typeof a == 'number') return a
    if (a === cycle) throw cycle
    if (typeof a != 'string') error("Cannot convert to a number", a, "in", finish.v)
    return +a
  },

  _toString(a) {
    if (typeof a == 'number') return ''+a
    return a
  },

  broadcasted:{
    txt:`\`(broadcasted Function)\`: creates a function that is broadcasted over array arguments (\`((broadcasted Func) …Args)\`). No array inputs means just applying Function; having array inputs means returning an array of applying \`(broadcasted Function)\` to each element, with the same index for all arguments, using the last element if out-of-bounds for an argument, and non-array inputs treated as arrays of length 1.`,
    argCount:1,
    call(f) {
      if (typeof f != 'function') error("Expected a function")
      const impl = function decorated(...args) {
        // Just apply the function if there are no arrays.
        if (!args.some(x => !_isVar(x) && _isArray(x))) return f.call(this, ...args)

        let maxLen = 1
        for (let i = 0; i < args.length; ++i)
          if (!_isVar(args[i]) && _isArray(args[i])) {
            if (!args[i].length) return args[i]
            maxLen = Math.max(maxLen, args[i].length)
          }
        let [k = 0, results = [], record] = interrupt(broadcasted)
        const argsSlice = args.slice()
        try {
          for (; k < maxLen; ++k) {
            // Apply f to a slice of args.
            for (let i = 0; i < args.length; ++i) {
              const el = args[i]
              argsSlice[i] = _isVar(el) || !_isArray(el) ? el : k < el.length ? el[k] : el[el.length-1]
            }
            const r = decorated.apply(this, argsSlice)
            if (_isUnknown(r)) {
              if (!record) {
                for (let k=0; k < results.length; ++k) results[k] = quote(results[k])
                record = r
              } else
                record.push(...r.slice(2))
              r = r[1]
            } else if (record)
              r = quote(r)
            results.push(r)
          }
        } catch (err) { if (err === interrupt) interrupt(broadcasted, 3)(k, results, record);  throw err }
        // Slice off superfluous end results.
        if (record) return record[1] = results, record
        while (results.length > 1 && results[results.length-2] === results[results.length-1]) results.pop()
        return results.length === 1 && !_isArray(results[0]) ? results[0] : results
      }
      _cameFrom(impl, finish.v)
      const d = impl[defines.key] = Object.create(null)
      d[_id(deconstruct)] = array(broadcasted, f)
      if (defines(f, merge))
        d[_id(merge)] = true
      if (defines(f, argCount) !== undefined)
        d[_id(argCount)] = defines(f, argCount)
      return impl
    },
  },

  sum:__is([
    __is(`broadcasted`),
    __is([
      __is(`overridable`),
      __is(`_sum`),
    ]),
  ]),

  mult:__is([
    __is(`broadcasted`),
    __is([
      __is(`overridable`),
      __is(`_mult`),
    ]),
  ]),

  _sum:{
    argCount:2,
    merge:__is(`true`),
    call(a,b) { return _toNumber(a) + _toNumber(b) },
  },

  _mult:{
    argCount:2,
    merge:__is(`true`),
    call(a,b) { return _toNumber(a) * _toNumber(b) },
  },

  sub:__is([
    __is(`broadcasted`),
    __is([
      __is(`overridable`),
      __is(`_subtract`),
    ]),
  ]),

  div:__is([
    __is(`broadcasted`),
    __is([
      __is(`overridable`),
      __is(`_divide`),
    ]),
  ]),

  _subtract:{
    argCount:2,
    merge:__is(`true`),
    call(a,b) { return _isVar(a) || _isVar(b) ? array(_subtract, a, b) : _toNumber(a) - _toNumber(b) },
  },

  _divide:{
    argCount:2,
    merge:__is(`true`),
    call(a,b) { return _isVar(a) || _isVar(b) ? array(_divide, a, b) : _toNumber(a) / _toNumber(b) },
  },

  Extension:{
    txt:`Not implemented.`,
    future:[
      `Into every page, inject a simple script that creates a fixed-position small button in a corner, that requests Self from the extension on click (that creates a REPL in the page's context).`,
      `Allow some flavor of clicking (Shift+click) to refer to the page's elements.`,
    ],
    call() { throw "Being a browser extension not supported for now" },
  },

  Browser:{
    txt:`A REPL interface.
Supported browsers: modern Chrome and Firefox.`,
    style:`* {transition: all .2s, margin 0s, padding 0s; vertical-align: top; box-sizing: border-box}
html { scroll-behavior:smooth }
body {
  background-color:var(--background);
  color:var(--main);
  caret-color:var(--main);
  --background:white;
  --highlight:royalblue;
  --main:black;
}
body.dark {
  --background:rgb(15,15,15);
  --highlight:rgb(225, 110, 65);
  --main:white;
}
:focus {outline:none; box-shadow:var(--highlight) 0 0 .1em .1em}
input[type=range]::-moz-focus-outer { border:0 }
.hover {box-shadow:var(--highlight) 0 0 .1em .1em}
.working {box-shadow:var(--highlight) 0 0 .1em .1em inset}
bracket {color:saddlebrown}
string {color:darkgreen; display:inline-block}
string>string { filter:brightness(150%) }
body.dark string {color: limegreen}
number {color:cornflowerblue}
known, prompt {font-weight:bold; cursor:pointer}
node {display:inline-block; font-family:monospace}
node.text { display:inline }
error {color:red; background-color:var(--background)}
extracted {display:inline-block}
extracted.hover { background-color:var(--background); position:sticky; top:.3em; bottom:.3em; z-index:11 }
.warning { color:darkred }

scroll-highlight { position:fixed; right:0; z-index:13; box-shadow:var(--highlight) 0 0 .2em .2em; will-change:transform }

waiting {
  display: block;
  width: 1.5em;
  height: 1.5em;
  margin: .5em;
  border-radius: 50%;
  border: .2em solid var(--main);
  border-color: transparent var(--main) transparent var(--main);
  animation: waiting-dual-ring 1.2s cubic-bezier(.5,0,0,2.5) infinite, waiting-appears .5s forwards;
}
@keyframes waiting-dual-ring {
  0% { transform: rotate(0deg) }
  100% { transform: rotate(180deg) }
}
@keyframes waiting-appears {
  0% { opacity: 0; height:0 }
  100% { opacity: 1 }
}


.broken { padding-left:1em }
.broken>:not(extracted) { display:table; max-width:100%}
.broken>bracket {margin-left:-1em}
.code>* {display:table}
body>* {display:table; white-space:pre-wrap}

.code {display:block; font-family:monospace}
.replInputContainer { display:table }
.replInputContainer>:last-child[contenteditable] { min-height:1.2em; min-width: 1.2em; width:100%; display:table-cell }
.replInputContainer.editable { display:block }
.replInputContainer.editable>:last-child[contenteditable] { min-height:1.2em; min-width: 1.2em; width:calc(100% - 2ch); display:inline-block }
.replInputContainer.editable.hover>:last-child[contenteditable] { box-shadow:none }
prompt { width:2ch; color:red; float:left }
prompt::before { content:'▶' /* > ⊱ ▶ */ }

#JobIndicator { width:.7em; height:.7em; margin:.25em; transition:none; background-color:var(--main); border-radius:50%; display:inline-block }
#JobIndicator.yes { background-color:var(--highlight); animation: rotate 4s infinite linear }
#JobIndicator>div { width: .2em; height:.2em; margin:.25em; position:absolute; background-color:var(--highlight); border-radius:50%; transform: rotate(var(--turns)) translate(.5em) }
@keyframes rotate {
  0% { transform: rotate(-0.25turn) }
  100% { transform: rotate(0.75turn) }
}

button { margin:.5em; padding:.5em; border-radius:.3em; border:none; background-color:var(--highlight); color:var(--background) }
button:hover, a:hover, collapsed:hover, prompt:hover { filter:brightness(120%) }
button:active, a:active, collapsed:active, prompt:active { filter:brightness(80%) }
button::-moz-focus-inner { border:0 }

table {border-spacing:1ch 0}
table>* {border-spacing:0}
td {padding:0}
td>space { display:none }

particle {
  border-radius:50%;
  width:.1em; height:.1em;
  box-shadow:0 0 .3em .3em var(--highlight);
  position:absolute;
  animation: particle-disappears .5s forwards;
}
@keyframes particle-disappears {
  0% { opacity: 0; transform: translate(0px, 0px) }
  20% { opacity: 1 }
  100% { opacity: 0; transform: translate(var(--x), var(--y)) }
}

collapsed>hidden { display:none !important }
collapsed { background-color:var(--highlight, royalblue); opacity:.5; cursor:pointer; border-radius:.2em; text-align:center; display:inline-block }
collapsed::before { content:'···'; color:var(--background, white) }

.window { z-index:12; position:absolute; background-color:var(--background); overflow:hidden; box-shadow:var(--highlight) 0 0 .1em .1em; transition:all .2s, left 0s, top 0s; padding:.5em; will-change:transform; font-family:monospace }
context-menu>node>input { border:none }
.window extracted.hover { position:static }

unimportant {opacity:.6}
textarea, div.resizable { transition:all .2s, width 0s, height 0s }
div.resizable { resize:both; overflow:hidden; display:block }
iframe { width:100%; height:100% }

.hasOperators>operator, .hasOperators { margin:0 .2em }
.hasOperators>.hasOperators>operator, .hasOperators>.hasOperators { margin:0 .1em }
.hasOperators>.hasOperators>.hasOperators>operator, .hasOperators>.hasOperators>.hasOperators { margin:0 }

details { padding-left: 1em }
summary { margin-left: -1em }
details>:not(summary) { display:block }
details>div>:not(:first-child) { max-width:75vw }
details { display:table; overflow:hidden }
details>div { display:table-row }
details>div>* { display:table-cell }

time-report { font-size:.8em; color:gray; opacity:0; visibility:hidden }
.hover>time-report, time-report:hover { opacity:1; visibility:visible }`,
    call() {
      serialize.displayed = serialize.dom
      const passive = {passive:true}, passiveCapture = {passive:true, capture:true}

      // Insert the style defined by code.
      const StyleElem = document.createElement('style')
      StyleElem.innerHTML = defines(Browser, style)
      document.head.append(StyleElem)

      // Create a REPL.
      const env = finish.env = _newExecutionEnv()
      finish.env[_id(log)] = document.body
      document.body.insertBefore(elem(REPL, fancy), document.body.firstChild)
      document.querySelector('[contenteditable]').focus()

      // If our URL has `#…` at the end, parse and evaluate that command.
      function evalHash(hash) {
        if (hash) elemInsert(document.body, elem(evaluator, parse(decodeURI(location.hash.slice(1)))[0]), document.body.firstChild)
      }
      evalHash(location.hash)
      addEventListener('hashchange', () => evalHash(location.hash))

      // Select the <node> under cursor on triple-click.
      // Also make <details> open smoothly, and allow them to be closed by clicking.
      addEventListener('click', evt => {
        if (evt.target.tagName === 'DETAILS') return evt.target.firstChild.click()
        if (evt.target.tagName === 'SUMMARY' && evt.detail !== 3) {
          const el = evt.target.parentNode
          const pre = _smoothHeightPre(el)
          el.style.height = pre + 'px'
          const smooth = () => (el.removeEventListener('toggle', smooth), _smoothHeightPost(el, pre))
          el.addEventListener('toggle', smooth)
        }
        if (evt.detail !== 3) return
        const p = _closestNodeParent(evt.target)
        p && getSelection().selectAllChildren(p)
      }, passive)

      // Open a custom <context-menu> when a context menu is requested, or when a <known> thing is clicked, or when a pointer is pressed in place for 1 second.
      function openMenu(evt, r) {
        contextMenu(_closestNodeParent(evt.target), evt, r || getSelection().rangeCount && getSelection().getRangeAt(0)), evt.preventDefault()
      }
      addEventListener('contextmenu', evt => openMenu(evt))
      addEventListener('click', evt => !evt.shiftKey && !evt.ctrlKey && !evt.altKey && evt.target.tagName === 'KNOWN' && openMenu(evt))
      let contextMenuId
      addEventListener('pointerdown', evt => contextMenuId = setTimeout(openMenu, 1000, evt, getSelection().rangeCount && getSelection().getRangeAt(0)), passiveCapture)
      addEventListener('pointermove', evt => clearTimeout(contextMenuId), passiveCapture)
      addEventListener('pointerup', evt => clearTimeout(contextMenuId), passiveCapture)
      addEventListener('pointercancel', evt => clearTimeout(contextMenuId), passiveCapture)

      // On resize, update the "all-or-nothing" line-break-ingness of <node>s.
      let width = innerWidth
      addEventListener('resize', _throttled(() => width !== innerWidth ? _updateBroken(document.body) : (width = innerWidth), .1), passive)

      // If scrolled to (near) end, make sure that transitions preserve that scroll.
      let atEnd = false
      addEventListener('transitionstart', () => (atEnd && scrollTo(scrollX, scrollMaxY, atEnd = false), atEnd = atEnd || scrollY && scrollY >= scrollMaxY - 10), passive)
      addEventListener('transitionend', () => atEnd && scrollTo(scrollX, scrollMaxY, atEnd = false), passive)

      // On transition end, remove .style.height (for _smoothHeightPost/elemInsert).
      addEventListener('transitionend', evt => evt.propertyName === 'height' && evt.target.tagName !== 'SCROLL-HIGHLIGHT' && evt.target.style.removeProperty('height'), passive)

      // On .ctrlKey pointerdown on a value, insert a <collapsed> reference to it into selection if editable.
        // This is also accessible via contextMenu.
      addEventListener('pointerdown', evt => {
        if (!evt.ctrlKey || evt.shiftKey || evt.altKey) return
        if (!getSelection().rangeCount) return
        const el = _closestNodeParent(evt.target), r = getSelection().getRangeAt(0)
        if (el) replaceRangeWithLinkTo(r, el)
      }, passive)

      // Ensure that selection cannot end up inside <collapsed> elements.
      addEventListener('selectionchange', () => {
        if (!getSelection().rangeCount) return
        const r = getSelection().getRangeAt(0)
        let el = r.commonAncestorContainer
        if (el && el.tagName === 'COLLAPSED') el.nextSibling ? r.setEndBefore(el.nextSibling) : r.setEndAfter(el)
        if (el) el = el.parentNode
        if (el && el.tagName === 'COLLAPSED') el.nextSibling ? r.setEndBefore(el.nextSibling) : r.setEndAfter(el)
      }, passiveCapture)

      // Highlight equal-id <node>s over selection or under cursor.
      function changeHoverTo(el) {
        const prev = changeHoverTo.prev
        const def = el && defines(el.to, _closestNodeParent)
        const New = el == null ? null : el instanceof Set ? el : el && def ? def(el) : elemValue(undefined, el.to)
        const needed = new Set
        let b = false
        New && New.forEach(el => {
          if (prev && prev.has(el)) needed.add(el)
          else el.classList.add('hover'), needed.add(el)
          el = el.parentNode
          !b && el && el.tagName === 'EXTRACTED' && (el.classList.add('hover'), needed.add(el), b = true)
        })
        if (prev) prev.forEach(el => !needed.has(el) && el.classList.remove('hover'))
        scrollHighlight(New)
        changeHoverTo.prev = needed
      }
      function highlightParent(evt) {
        if (evt.type === 'selectionchange' && getSelection().isCollapsed) return
        changeHoverTo(getParent(evt))
      }
      function getParent(evt) {
        // const active = document.activeElement && document.activeElement.contentEditable == 'true'
        const s = getSelection()
        let el
        if (s.isCollapsed && evt) el = evt.type.slice(-3) !== 'out' ? evt.target : evt.relatedTarget
        else el = s
        return _closestNodeParent(el)
      }
      const highlight = _throttled(highlightParent, .1)
      addEventListener('pointerover', highlight, passiveCapture)
      addEventListener('pointerout', highlight, passiveCapture)
      addEventListener('selectionchange', highlight, passiveCapture)

      // Highlight all current jobs' logging areas when hovering over the job indicator.
      JobIndicator.to = {
        [defines.key]:{
          [_id(_closestNodeParent)]:() => {
            const r = []
            for (let i = 0; i < _jobs.expr.length; i += 4) {
              const env = _jobs.expr[i+1]
              if (env[_id(log)]) r.push(env[_id(log)])
            }
            return r
          }
        }
      }

      // On any element tree mutations inside document.body, re-highlight.
      new MutationObserver(_throttled(record => {
        changeHoverTo(changeHoverTo.prev)
      }, .05))
      .observe(document.body, { childList:true, subtree:true })

      // Show the current highlight on the global scrollbar.
      const scrollHighlights = new Map
      const scrollHighlight = _throttled(function scrollHighlight(els) {
        const free = []
        scrollHighlights.forEach(v => free.push(v)), scrollHighlights.clear()
        els && els.forEach(el => {
          if (!_isStylableDOM(el)) return
          scrollHighlights.set(el, free.length ? free.shift() : document.createElement('scroll-highlight'))
        })
        free.forEach(el => elemRemove(el, false, false))
        if (scrollHighlights.size) {
          updateScrollHighlights()
          scrollHighlights.forEach(v => {
            if (!v.parentNode) v.style.opacity = 0, document.body.append(v)
          })
          document.body.offsetHeight
          scrollHighlights.forEach(v => v.style.opacity !== '' && (v.style.opacity = 1))
        } else if (document.querySelector('scroll-highlight'))
          [...document.querySelectorAll('scroll-highlight')].forEach(el => !el.removed && (console.warn('Dangling scroll highlight:', el), el.remove()))
      }, .2)
      function updateScrollHighlights() {
        if (!scrollHighlights.size) return
        const min = -document.documentElement.scrollTop, max = document.documentElement.scrollHeight + min
        if (max+1 <= min) return
        scrollHighlights.forEach((v,k) => {
          const rect = k.getBoundingClientRect()
          v._top = (rect.top - min) / (max - min), v._height = rect.height / (max - min)
        })
        scrollHighlights.forEach(v => { if (v._top <= 1 && v._height <= 1) v.style.top = v._top*100+'%', v.style.height = v._height*100+'%' })
      }
      addEventListener('resize', _throttled(updateScrollHighlights, .125), passiveCapture)

      // Update CPU's title.
      ;(CPU.oninput = () => { CPU.title = CPU.title.replace(/[0-9]+%/, ((+CPU.value*100)|0) + '%') })()

      // Test all known examples.
      _test(env)
    },
  },

  NodeJS:{
    txt:`This should work. Presents a console REPL with outputs labeled sequentially.`,
    call() {
      let ctx = parse.ctx, env = finish.env = _newExecutionEnv(finish.env)
      _test(env)
      console.log('ctrl-D or .exit to exit, (txt) for all functionality. a, `a`, "s", (0 1), (a:2 a).')
      const repl = require('repl')
      const prompt = '> ', coloredPrompt = _colored(prompt, 31) // red
      const out = process.stdout
      const opt = serialize.displayed = out.isTTY && out.hasColors() ? serialize.consoleColored : {maxDepth:3}
      let n = 0
      opt.breakLength = out.columns
      repl.start({
        eval(cmd, _jsContext, _filename, then) {
          cmd = cmd.trim()
          try {
            log.did = false
            const [expr, styled] = parse(cmd, fancy, ctx)
            opt.breakLength = out.columns
            if (out.isTTY && !log.did) {
              const lines = Math.ceil((cmd.length + prompt.length) / out.columns)
              out.moveCursor(0, -lines)
              out.clearScreenDown()
              out.write(coloredPrompt + serialize(expr, fancy, undefined, {...opt, offset:1}) + '\n')
            }
            _schedule(expr, env, result => {
              // If ctx contains result in values, set name to that; if not, create a new one.
              let name
              ctx.forEach((v,k) => v === result && (name = k))
              if (!name) do { name = '#' + n++ } while (ctx.has(name))
              if (!ctx.has(name))
                (ctx = new Map(ctx)).set(name, quote(result))

              then(null, _colored(name, 33) + ': ' + serialize(result, fancy, undefined, {...opt, offset:1+Math.ceil(name.length/2)})) // brown
            })
          } catch (err) {
            if (_isArray(err) && err[0] === 'give more') then(new repl.Recoverable(err))
            else console.log(typeof err == 'string' ? _colored(err, 31) : err), then() // red
          }
        },
        writer: id,
        completer: cmd => {
          const arr = /[^`:\s\[\]]+$/.exec(cmd)
          const begins = arr ? arr[0] : ''
          const matches = []
          ctx.forEach((_v,k) => k.slice(0, begins.length) === begins && matches.push(k))
          return [matches, begins]
        },
        coloredPrompt,
      }).on('reset', () => { ctx = parse.ctx, n = 0 })
      // Cannot seem to react to SIGINT (and stop execution).
    },
  },

  WebWorker:{
    txt:`Not implemented.`,
    call() {
      // const w = new Worker('self.js')
      // w.onmessageerror = w.onmessage = console.logw.onerror = console.log
        // There is some error, but *what* error? It doesn't tell me anything specific at all.

      console.log('worker')
      onmessage = evt => {
        console.log(evt)
        const msg = evt.data
        if (_isArray(msg) && typeof msg[0] == 'number' && typeof msg[1] == 'string' && msg.length == 2) {
          // Schedule parsing-and-serialization.
          console.log('scheduling')
          const [ID, fastProgramToPurify] = msg
          _schedule([lookup(fast, 'parse'), fastProgramToPurify], _newExecutionEnv(finish.env), expr => {
            // postMessage the serialized result back.
            postMessage([ID, lookup(fast, 'serialize')(expr)])
          }, ID)
        } else if (typeof msg == 'number')
          _cancel(msg)
        else throw "Bad message"
      }
    },
  },

  _colored(str, pre=39, post = 39) {
    // Style a string for ANSI terminals. See `man 4 console_codes`.
    return typeof str != 'string' ? str : ('\x1b['+pre+'m') + str + ('\x1b['+post+'m')
  },

  _collapsedBasicSerialization(v, lang = basic) {
    const el = serialize(v, lang, undefined, {...serialize.displayed, collapseDepth:1, collapseBreadth:0, deconstructElems:true})
    if (el.firstChild.tagName != 'BRACKET' || el.lastChild.tagName != 'BRACKET')
      return elemValue(elem('node', [elem('bracket', '('), el, elem('bracket', ')')]), v)
    return el
  },

  replaceRangeWithLinkTo:{
    txt:`Replaces a Range (obtained from the current selection) with a link to the elem.
A language can define this with a function that {takes the element and value to {link to}} and {returns an element to insert}.
Remember to quote the link unless you want to evaluate the insides.`,
    future:`Allow any valued elem to define linking in it, and have sliders for editing range options and persistent value stores.`,
    call(r, el) {
      const p = r.commonAncestorContainer, editor = _isEditable(el)
      const pre = _smoothTransformPre(el)
      if (!_isEditable(p)) return false
      let col
      if (editor && editor === _isEditable(p) && defines(editor.parentNode.to, replaceRangeWithLinkTo))
        col = defines(editor.parentNode.to, replaceRangeWithLinkTo)(r, el)
      else {
        col = elemValue(elemCollapse(() => _collapsedBasicSerialization(el.to)), el.to)
        col.special = id
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
    while (el && !('to' in el))
      el = el.parentNode
    return el
  },

  _bracketize(range, brackets = '()') {
    // Appends brackets at range's start and end.
    range.insertNode(elem('span', brackets[0]))
    range.collapse(false)
    range.insertNode(elem('span', brackets[1]))
    range.setEnd(range.endContainer, range.endOffset-1)
  },

  permissionsElem:{
    txt:`Build a namespace hierarchy of globals that \`expr\` is bound to.`,
    call(expr, summary = id, topLevel) {
      const uses = new Set, seen = new Set
      mark(expr), seen.clear()
      const globals = new Map
      uses.forEach(x => lookup.parents.has(x) && uses.add(lookup.parents.get(x)))
      if (topLevel) uses.delete(topLevel)
      parse.ctx.forEach(x => uses.has(x) && globals.set(x, null)) // Make globals appear in source-code order.
      uses.clear()
      const result = !topLevel ? elem('details', elem('summary', 'Binds to:')) : elemFor(topLevel)
      globals.forEach((our, x) => {
        if (!our) globals.set(x, our = elemFor(x))
        const p = lookup.parents.get(x)
        if (!p) return result.append(our)
        let their = globals.get(p)
        if (!their) globals.set(p, their = elemFor(p))
        their.append(our)
      })
      for (let ch = result.firstChild.nextSibling; ch; ch = ch.nextSibling)
        ch.replaceWith(ch = purgeChildless(ch))
      if (result.childNodes.length == 1) result.append(elem('div', 'nothing'))
      elemValue(result, expr)
      result.open = true
      return result

      function mark(x) {
        if (seen.has(x)) return; else seen.add(x)
        if (serialize.backctx.has(x) && typeof x != 'boolean' && x != null) return uses.add(x)
        if (!_isArray(x) && defines(x, deconstruct)) return mark(deconstruct(x, false))
        else if (x instanceof Map) x.forEach((v,k) => (mark(k), mark(v)))
        else if (_isArray(x)) x.forEach(mark)
        else if (x && !x[defines.key] && typeof x == 'object')
          Object.keys(x).forEach(k => mark(x[k]))
        else if (x && x[defines.key]) mark(x[defines.key])
      }
      function elemFor(x) {
        const el = elem('details')
        el.append(elem('summary', summary(serialize(x, basic, undefined, serialize.displayed), x)))
        elemValue(el, x)
        return _isArray(x) || defines(x, permissionsElem) === undefined || topLevel ? el : defines(x, permissionsElem)(el)
      }
      function purgeChildless(el) {
        if (el.tagName != 'DETAILS') return el
        if (el.childNodes.length == 1) {
          const ch = elem('div', [...el.firstChild.childNodes])
          return el.replaceWith(ch), ch
        }
        for (let ch = el.firstChild.nextSibling; ch; ch = ch.nextSibling) ch = purgeChildless(ch)
        return el
      }
    },
  },

  stringToDoc:{
    txt:`Parse text in \`...\` to style it as fancy, and treat other strings as \`structuredSentence\`s.`,
    call(s) {
      let arr = s.split('`')
      for (let i = 0; i < arr.length; ++i)
        if (i & 1)
          try { arr[i] = parse(arr[i], fancy, undefined, parse.dom)[1] } catch (err) {}
        else
          arr[i] = arr[i].split('\n').map(structuredSentence), arr[i].forEach(el => el.classList.add('text')), interleave(arr[i], '\n')
      return arr
      function interleave(arr, item) {
        for (let i = 1; i < arr.length; ++i) arr.splice(i++, 0, item)
      }
    },
  },

  elemToWindow:{
    txt:`Wraps an element in <div.window>.`,
    call(el) {
      impure()
      const pre = _smoothHeightPre(el)
      el.style.position = 'relative'
      const x = el.offsetLeft, y = el.offsetTop
      el.style.removeProperty('position')
      const menu = elem('div')
      menu.classList.add('window')
      if (el.to) elemValue(menu, el.to), menu.special = id
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
    txt:`Clicks all <collapsed> elements in the element.`,
    call(el, readonly = false) {
      if (!el) return
      impure()
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
    impure()
    const inside = w.firstChild, preT = _smoothTransformPre(inside), preH = _smoothHeightPre(w.isWindow)
    w.isWindow.remove()
    w.replaceWith(inside)
    _smoothTransformPost(inside, preT), _smoothHeightPost(inside, preH)
  },

  _getOuterWindow(el) { return !el ? null : el.isWindow ? el : _getOuterWindow(el.parentNode) },

  elemCollapse:{
    txt:`Collapses an element (or a range of elements) in-place. Click to expand again. Pass in a function to create the element only if needed. Pass in null as \`end\` to collapse all consequent siblings.`,
    call(start, end = undefined) {
      const col = elem('collapsed')
      if (typeof start == 'function')
        col.append(elem('hidden')),
        col.onclick = evt => {
          const col = evt.target, p = col.parentNode, pre = _smoothHeightPre(p)
          const el = start()
          if (p) _isArray(el) ? el.forEach(el => p.insertBefore(el, col)) : el.parentNode !== p && p.insertBefore(el, col), p.removeChild(col)
          if (_getOuterWindow(p) || _getOuterContextMenu(p)) _updateBroken(_getOuterWindow(p) || _getOuterContextMenu(p)); else if (p) _updateBroken(p)
          p.dispatchEvent(new Event('input', {bubbles:true}))
          _smoothHeightPost(p, pre)
        },
        col.special = (original, copy) => copy.onclick = original.onclick
      else {
        impure()
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
          elemValue(col, array(rest, _maybeMerge(a)))
        }
        col.append(d)
        col.onclick = (evt, instant = false) => {
          const col = evt.target, d = col.firstChild, p = col.parentNode, pre = !instant && _smoothHeightPre(p)
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

  button:{
    txt:`\`(button OnClick)\`: Returns a button that calls a function(s) on click (with no arguments). Overridable.`,
    call(f) {
      let name = serialize.backctx.has(f) ? serialize.backctx.get(f) : f && f.name || 'Click'
      if (typeof defines(f, button) == 'function') return defines(f, button)(f)
      if (f instanceof Node) return f
      if (typeof f != 'function') error("Cannot call not-a-function:", f)

      if (typeof name == 'string')
        name = name.replace(/[A-Z]/g, s => ' '+s.toLowerCase()),
        name = name[0].toUpperCase() + name.slice(1)

      const el = elem('button')
      el.onclick = () => f()
      el.append(name)
      return el
    },
  },

  allowDragging:{
    txt:`Allows dragging the element around with a pointer. Only call on absolutely-positioned elements with .style.left and .style.top.`,
    call(el) {
      impure()
      let pointerId = null, startX, startY, scrX, scrY
      const passive = {passive:true}
      el.addEventListener('pointerdown', evt => {
        if (_isEditable(evt.target) || evt.target.tagName === 'TEXTAREA' || evt.target.classList && evt.target.classList.contains('resizable')) return
        pointerId = evt.pointerId, startX = evt.clientX, startY = evt.clientY, el.setPointerCapture(pointerId)
        scrX = scrollX, scrY = scrollY
        getSelection().collapseToEnd()
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
        el.style.left = x + dx + 'px'
        el.style.top = y + dy + 'px'
        if (evt.clientX || evt.clientY) startX = evt.clientX, startY = evt.clientY
      }
      el.addEventListener('pointermove', move, passive)
      el.addEventListener('pointerup', () => (pointerId = null, removeEventListener('scroll', move, passive)), passive)
      el.addEventListener('pointercancel', () => (pointerId = null, removeEventListener('scroll', move, passive)), passive)
    },
  },

  _isEditable(el) { return el && (el.contentEditable === 'true' ? el : _isEditable(el.parentNode)) },

  _getOuterContextMenu(el) { return !el ? document.body : (el.tagName === 'CONTEXT-MENU' ? el : _getOuterContextMenu(el.parentNode)) },

  describe:{
    txt:`Creates an element that describes a value.`,
    call(el) {
      if (typeof document == ''+void 0) return
      const d = document.createElement('div')
      let v
      if (!(el instanceof Node)) v = el, el = undefined
      else v = el.to

      if (el && el.classList.contains('label')) {
        // Allow renaming labels.
        const inp = elem('input')
        inp.type = 'text'
        const illegal = /[!=:\s\(\)→>\+\-\*\/\&\|\.'"`\,\\]/
        let prev = unescape(el.textContent), updating = false
        inp.value = prev
        const updateGlobal = _throttled(() => (_updateBroken(document.body), updating = false), .05)
        const editor = _isEditable(el)
        inp.oninput = _throttled(() => {
          if (inp.value && +inp.value === +inp.value) return
          let arr = elemValue(undefined, el.to)
          if (!arr && editor) // Restore ourselves when we've lost it because it's cyclic.
            arr = [...editor.querySelectorAll('.label')].filter(x => unescape(x.textContent) === prev)
          const s = escape(inp.value)
          if (_isArray(arr))
            for (let i = 0; i < arr.length; ++i)
              if (arr[i].classList.contains('label') && unescape(arr[i].textContent) === prev)
                arr[i].textContent = s
          prev = inp.value
          if (!updating) setTimeout(updateGlobal, 0), updating = true
        }, .2)
        d.append(inp)
        return d

        function escape(str) { return str && !illegal.test(str) ? str : '`' + str.replace(/`/g, '``') + '`' }
        function unescape(str) { return str[0] === '`' ? str.slice(1,-1).replace(/``/g, '`') : str }
      }
      // A short definition of what we were called on.
      if (v !== undefined) {
        if (serialize.backctx.has(v)) {
          // Display the namespace (if any) (even if the property name does not match) and the global.
          const global = serialize(v, fancy, undefined, serialize.displayed), p = lookup.parents.get(v) || Self
          d.append(p ? elem('div', [elem('unimportant', [serialize(p, fancy, undefined, serialize.displayed), '.']), global]) : global)
        } else if (typeof v == 'string') {
          // Display strings in a <textarea> for easy editing and copying.
          const area = elem('textarea', v)
          if (!_isEditable(el))
            area.readOnly = true
          else if (el) {
            let i = elemValue(undefined, el.to).indexOf(el)
            area.oninput = _throttled(() => {
              if (el && !el.isConnected) el = elemValue(undefined, el.to).filter(_isEditable)[i]
              if (!el) return
              el.replaceWith(el = serialize(area.value, fancy, undefined, serialize.displayed))
              elemValue(area, el.to = area.value), i = elemValue(undefined, el.to).filter(_isEditable).indexOf(el)
            }, .1)
          }
          d.append(elemValue(area, v))
        } else
          // Display the globals the expression binds to, and an expandable basic definition.
          d.append(permissionsElem(v)),
          d.append(elemValue(elemCollapse(() => _collapsedBasicSerialization(v)), v))

        // The docstring.
        if (!_isArray(v) && typeof defines(v, txt) == 'string')
          d.append(elem('div', stringToDoc(defines(v, txt))))

        // For globals only:
        if (serialize.backctx.has(v)) {
          // A table for lookups.
          if (!_isArray(v) && defines(v, lookup)) {
            const row = ([k,v]) => {
              let ve
              if (!serialize.backctx.has(v))
                ve = elemValue(elemCollapse(() => serialize(v, fancy, undefined, serialize.displayed)), v)
              else
                ve = serialize(v, fancy, undefined, serialize.displayed)
              return elem('tr', [elem('td', elem('span', k)), elem('td', ve)])
            }
            let a
            if (v !== Self) a = lookup(v).map(k => [k, lookup(v, k)])
            else a = [...serialize.backctx].filter(([v,k]) => v && v !== true && k[0] !== '_' && !lookup.parents.has(v)).map(([v,k])=>[k,v])
              // For Self, only display public functionality without lookup.parents.
              d.append(elem('table', a.length <= 16 ? a.map(row) : [a.slice(0,16).map(row), elemCollapse(() => a.slice(16).map(row))]))
          }

          // A full deconstruction.
          d.append(elem('div', [
            elemValue(elem('unimportant', 'Deconstruction: '), deconstruct),
            elemCollapse(() => serialize(deconstruct(v, false), fancy, undefined, {...serialize.displayed, deconstructPaths:true}))
          ]))

          // A list of back-refs.
          const Refd = refd(v)
          if (Refd && Refd.length)
            d.append(elem('div', [
              elem('unimportant', [elemValue(elem('span', 'Used'), refd), ' in ']),
              elemValue(elem('number', ''+Refd.length), Refd.length),
              elem('unimportant', ' other globals: '),
              elemCollapse(() => serialize(Refd, fancy, undefined, serialize.displayed))
            ]))
        }

        // Definitions of `describe`.
        const r = !_isArray(v) && defines(v, describe)
        if (typeof r == 'function') d.append(r(v))
      }

      // Default buttons.
      if (!el) return d
      return d
    },
  },

  contextMenu:{
    txt:`Creates and displays a <context-menu> element near the specified element.`,
    lookup:{
      describe:__is(`describe`),
      toWindow:__is(`elemToWindow`),
      allowDragging:__is(`allowDragging`),
      permissions:__is(`permissionsElem`),
      stringToDoc:__is(`stringToDoc`),
      expandAll:__is(`elemExpandAll`),
      replaceRangeWithLinkTo:__is(`replaceRangeWithLinkTo`),
    },
    call(el, evt, range) {
      impure()
      if (!el && evt.target === document.documentElement) el = evt.target
      if (!el) return
      if (!document.body) return
      const v = el.to
      const menu = elem('context-menu')
      menu.classList.add('window')
      allowDragging(menu)

      // Close when unfocused or on a click on a <button> inside.
      function removeOurselves(evt) { (!evt || !_isEditable(evt.relatedTarget) && !menu.contains(evt.relatedTarget)) && elemRemove(menu) }
        // Don't remove when shifting into an editable region, because <iframe>s interact with focus very strangely.
      menu.addEventListener('focusout', removeOurselves)
      menu.addEventListener('click', evt => evt.target.tagName === 'BUTTON' && _getOuterContextMenu(evt.target) === menu && elemRemove(menu))
      menu.tabIndex = 0

      menu.append(describe(el, range))

      // Fetch URLs and try to display their contents.
      if (_isArray(v) && v[0] === elem && v[1] === url && typeof v[2] == 'string' && v.length == 3) {
        impure()
        const result = elem('div')
        result.classList.add('resizable')

        fetch(v[2], {mode:'cors'})
        .catch(r => elemInsert(result, serialize(jsRejected(r), fancy, undefined, serialize.displayed)))
        .then(r => r.arrayBuffer())
        .then(r => new TextDecoder().decode(new Uint8Array(r)))
        .then(r => {
          try {
            elemInsert(result, serialize(JSON.parse(r), fancy, undefined, serialize.displayed))
          } catch (err) { elemInsert(result, lookup(fast, 'parse')(r)) }
            // There are almost definitely some execute-arbitrary-code-while-`purify`ing exploits, but they could be found and fixed if anyone cares.
        })
        .catch(() => {
          const frame = elem('iframe')
          frame.src = v[2]
          elemInsert(result, frame)
          // Since an iframe blurs our menu, we have to listen for removal differently.
          menu.removeEventListener('focusout', removeOurselves)
            // But menu is not defined here, it's a context-menu-only thing. Should we put this in contextMenu?
          function removeOnFocusShift(evt) { !menu.contains(evt.target) && (removeOurselves(), removeEventListener('pointerdown', removeOnFocusShift)) }
          addEventListener('pointerdown', removeOnFocusShift)
        })
        menu.append(result)
      }

      if (range && v !== undefined && _isEditable(range.commonAncestorContainer)) // Link to this
        menu.append(button(function linkToThis() { replaceRangeWithLinkTo(range, el) }))
          // This is also accessible via ctrl-click.
      if (elemExpandAll(el, true))
        menu.append(button(function expandAll() { elemExpandAll(el) }))
      if (!_isEditable(el) && el !== document.documentElement) { // To window \ Restore
        if (!_getOuterWindow(el))
          menu.append(button(function toWindow() { elemToWindow(el) }))
        else
          menu.append(button(function restore() { return _restoreWindow(_getOuterWindow(el)) }))
      }
      menu.append(button(function hide() { elemCollapse(el) })) // Hide
      if (el.nextSibling && el.nextSibling.tagName !== 'BRACKET') // Hide to end
        menu.append(button(function hideToEnd() { elemCollapse(el, null) }))

      const r1 = el.getBoundingClientRect(), r2 = document.documentElement.getBoundingClientRect()
      let x = evt && typeof evt.clientX == 'number' ? evt.clientX : r1.left
      let y = evt && typeof evt.clientY == 'number' ? evt.clientY : r1.top
      const xOk = x < innerWidth * .8, yOk = y < innerHeight * .8
      x -= r2.left, y -= r2.top
      let w, h
      if (!xOk || !yOk) {
        document.body.appendChild(menu)
        w = menu.offsetWidth, h = menu.offsetHeight
        document.body.removeChild(menu)
      }
      if (xOk && yOk) { // Open to bottom-right
        menu.style.left = x + 'px'
        menu.style.top = y + 'px'
        menu.style.borderRadius = '0 1em 1em 1em'
      } else if (xOk) { // Open to top-right
        menu.style.left = x + 'px'
        menu.style.top = y - h + 'px'
        menu.style.borderRadius = '1em 1em 1em 0'
      } else if (yOk) { // Open to bottom-left
        menu.style.left = x - w + 'px'
        menu.style.top = y + 'px'
        menu.style.borderRadius = '1em 0 1em 1em'
      } else { // Open to top-left
        menu.style.left = x - w + 'px'
        menu.style.top = y - h + 'px'
        menu.style.borderRadius = '1em 1em 0 1em'
      }
      let into = _getOuterContextMenu(el)
      if (_getOuterContextMenu(into.parentNode) !== document.body) into = document.body
      if (into !== document.body) {
        menu.style.left = parseFloat(menu.style.left) - into.getBoundingClientRect().left - scrollX + 'px'
        menu.style.top = parseFloat(menu.style.top) - into.getBoundingClientRect().top - scrollY + 'px'
      }
      elemInsert(into, menu)
      menu.focus({preventScroll:true})
    },
  },

  url:{
    txt:`Creates a URL element.`,
    elem(tag, href) {
      if (typeof href != 'string') throw "Must be a string"
      if (tag !== url || typeof document == ''+void 0) return href
      const el = elem('a', href)
      elemValue(el, array(elem, url, href))
      el.href = href
      return el
    },
  },

  evaluator:{
    txt:`\`(elem evaluator Expr Language)\`: When logged to DOM, this displays the expression, its \`log\`s along the way, and its one evaluation result in one removable (by clicking on the prompt) DOM element.`,
    elem(tag, expr, lang) {
      if (tag !== evaluator || typeof document == ''+void 0) return
      impure()

      const el = elem('node')
      const prompt = elem('prompt')
      const query = elem('span')
      query.classList.add('replInputContainer')
      query.append(prompt)
      query.append(serialize(expr, lang, undefined, serialize.displayed))
      el.classList.add('code')
      el.append(query)
      const waiting = elem('waiting')
      waiting.style.display = 'none'
      setTimeout(() => waiting.style.removeProperty('display'), 300)
      el.append(waiting)

      // Evaluate the requested expression.
      const env = _newExecutionEnv(finish.env)
      env[_id(log)] = el
      const start = _timeSince()
      const ID = _schedule(expr, env, v => {
        waiting.remove()
        finish.env = env
        const end = _timeSince(), real = _timeSince(start)
        log(serialize(v, lang, undefined, serialize.displayed))
        const user = env[_id(userTime)], report = _timeSince(end)
        log(elem('time-report', [
          elemValue(elem('span', 'user'), userTime),
          ' ',
          elem('number', user.toFixed(0)),
          'ms, ',
          elemValue(elem('span', 'real'), realTime),
          ' ',
          elem('number', real.toFixed(0)),
          'ms, ',
          elemValue(elem('span', 'report'), serialize),
          ' ',
          elem('number', report.toFixed(0)),
          'ms'
        ]))
      })
      prompt.title = 'Click to remove this.'
      prompt.onclick = () => (_getOuterWindow(el) && _getOuterWindow(el).firstChild === el && _restoreWindow(_getOuterWindow(el)), elemRemove(el), _cancel(ID))
      elemValue(el, concept(new Map()))
      return el
    },
  },

  REPL:{
    txt:`\`(elem REPL Language)\`: Creates a visual REPL instance (read-evaluate-print loop).`,
    future:`Allow changing the (delta of) binding context, by a context-action of an evaluator ("Bind to this as…").`,
    elem(tag, lang) {
      if (!lang) lang = fancy
      if (!defines(lang, parse) || !defines(lang, serialize)) throw "Invalid language"
      if (tag !== REPL || typeof document == ''+void 0) return
      impure()

      const ctx = parse.ctx, env = _newExecutionEnv(finish.env)
      env[_id(Languages)] = lang

      const repl = elem('node')
      const logContainer = elem('code')

      // Display purified output.
      const pureOutput = elem('node')
      pureOutput.classList.add('code')
      let ID, waiting
      let purified
      const purifyAndDisplay = _throttled(expr => {
        if (msg === false && _isArray(expr) && expr[0] === jsEval && typeof expr[1] == 'string' && expr[2]) expr = [randomNat, 1]
        const justClear = expr === purifyAndDisplay
        const pre = _smoothHeightPre(pureOutput)
        let preserved
        if (pureOutput.firstChild) {
          for (let ch = pureOutput.firstChild; ch; ch = ch.nextSibling)
            if (!ch.removed) {
              if (ch.onclick === evaluate && !justClear && !preserved) preserved = ch
              else elemRemove(ch, true, true, false)
            }
        }
        if (ID !== undefined) _cancel(ID), waiting.remove(), ID = undefined, waiting = undefined
        let promise
        if (!justClear) promise = new Promise(then => {
          const e = _newExecutionEnv(env)
          e[_id(log)] = pureOutput, finish.env = e
          ID = _schedule([purify, array(quote, expr)], e, result => {
            if (_isUnknown(result) && result.length == 2 && _isArray(result[1]) && (_isError(result[1]) || result[1][0] === jsRejected))
              result = result[1] // Display errors too.
            purified = result
            const pre = _smoothHeightPre(pureOutput)
            try {
              ID = undefined, waiting && waiting.remove(), waiting = undefined
              if (!_isUnknown(result)) {
                if (preserved)
                  elemRemove(preserved, true, true, false)
                return elemInsert(pureOutput, serialize(result, lang, undefined, serialize.displayed))
              } else {
                if (preserved) return
                const el = elem('button', 'Evaluate')
                el.onclick = evaluate
                elemInsert(pureOutput, el)
              }
            } finally { _smoothHeightPost(pureOutput, pre), then() }
          }), waiting = elem('waiting')
          waiting.style.display = 'none'
          setTimeout(() => waiting && waiting.style.removeProperty('display'), 300)
          pureOutput.append(waiting)
        })
        _smoothHeightPost(pureOutput, pre)
        return promise
      }, .1)

      let replInput = elem('node')
      replInput.contentEditable = true
      replInput.spellcheck = false
      // On any mutations inside, re-parse its contents, and show purified output.
      const obs = new MutationObserver(_throttled(record => {
        const s = getSelection()
        const i = _saveCaret(replInput, s)
        try {
          const [expr, styled] = parse(replInput, lang, ctx, parse.dom)
          const pre = _smoothHeightPre(replInput)
          while (replInput.firstChild) replInput.removeChild(replInput.firstChild)
          replInput.append(structured(styled))
          _smoothHeightPost(replInput, pre)
          if (i !== undefined) _loadCaret(replInput, i, s)
          purifyAndDisplay(bound(expr, n => n instanceof Element && n.special ? n.to : undefined))
        } catch (err) {
          if (err instanceof Error) throw err
          purifyAndDisplay(purifyAndDisplay)
        }
        obs.takeRecords()
      }, .2, () => purified = undefined))
      obs.observe(replInput, { childList:true, subtree:true, characterData:true })

      const query = elem('span')
      elemValue(query, lang)
      query.classList.add('replInputContainer')
      query.classList.add('editable')
      const prompt = elem('prompt')
      prompt.title = 'Click to clear this.'
      prompt.onclick = () => _smoothHeight(replInput, () => replInput.textContent = '')
      query.append(prompt)
      query.append(replInput)
      repl.classList.add('code')
      repl.append(logContainer)
      repl.append(query)
      repl.append(pureOutput)
      env[_id(log)] = logContainer

      const undo = [[]], redo = []

      const msg = defines(lang, REPL)
      logContainer.append(elem('node', [structuredSentence('{A REPL} of language '), serialize(lang, basic, undefined, serialize.displayed), typeof msg == 'string' ? stringToDoc(': ' + msg) : elem('span')]))

      replInput.oninput = _throttled(() => {
        // Grow the undo buffer (and clear the redo buffer) on change.
        if (!undo.length || undo[undo.length-1].map(el => _innerText(el).join('')).join('') !== _innerText(replInput).join(''))
          redo.length = 0, undo.push(children(replInput)), undo.length > 4096 && (undo.splice(0, undo.length - 4096))
        purified = undefined
      }, 1)
      let height
      replInput.addEventListener('input', evt => {
        if (height) height = _smoothHeightPost(replInput, height)
        else height = _smoothHeightPre(replInput)
      })
      replInput.onkeydown = evt => {
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
          if (!focusNode.nodeValue || focusOffset+delta < 0 || focusOffset+delta > focusNode.nodeValue.length) {
            const i = _saveCaret(replInput, focusNode, focusOffset) + delta
            const arr = _loadCaret(replInput, i)
            if (evt.shiftKey)
              s.extend(...arr)
            else
              s.collapse(...arr)
            evt.preventDefault()
          }
        }

        // On Escape, blur replInput (so hover-highlighting becomes available).
        if (evt.key === 'Escape' && document.activeElement === replInput) replInput.blur()

        // Brackets do not enter their character, instead they surround something with that bracket.
        // '(' surrounds the selection in brackets. ')' surrounds the closest highlightable parent in brackets.
        if (!evt.ctrlKey) {
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
          if (undo[undo.length-1].map(el => el.innerText).join('') === replInput.innerText) undo.pop()
          if (undo.length)
            redo.push(children(replInput)), children(replInput, undo.pop()), evt.preventDefault()
        }
        // On Ctrl+Shift+Z, pop one from redo.
        if (evt.key === 'Z' && evt.shiftKey && evt.ctrlKey && redo.length)
          undo.push(children(replInput)), children(replInput, redo.pop()), evt.preventDefault()
      }
      return repl

      function evaluate(evt) {
        const prev = finish.env
        try {
          finish.env = env
          let [expr, styled] = parse(replInput, lang, ctx)

          log(elem(evaluator, bound(expr, n => n instanceof Element && n.special ? n.to : undefined), lang))
        } catch (err) {
          if (_isArray(err) && err[0] === 'give more') err = err[1]
          else evt.preventDefault()
          const el = elem('error', err instanceof Error ? [String(err), '\n', err.stack] : String(err))
          el.style.left = '1em'
          el.style.position = 'absolute'
          return log(el), setTimeout(() => elemRemove(el), 1000)
        } finally { finish.env = prev }
        replInput.textContent = ''
        purifyAndDisplay(purifyAndDisplay)
      }
      function children(el, to) {
        const pre = _smoothHeightPre(el)
        if (!to) return [...el.childNodes].map(elemClone)
        while (el.firstChild) el.removeChild(el.firstChild)
        to.forEach(ch => el.appendChild(ch))
        _smoothHeightPost(el, pre)
      }
    },
  },

  _getNextSibling(el) {
    // Seems to work
    return el.nextSibling || el.parentNode && getComputedStyle(el.parentNode).display !== 'block' && _getNextSibling(el.parentNode) || el.nextSibling
  },

  _visitText:{
    txt:`Calls f(String, TextNode) or f(false, SpecialElem) for each substring in el as parsing sees it.
Return stopIteration to stop iteration.`,
    call(el, f) {
      if (!el) return
      if (el.tagName === 'BR') return f(_getNextSibling(el) ? '\n' : '', el)
      if (!(el instanceof Element)) {
        return f(el.textContent.slice(-1) !== '\n' || _getNextSibling(el) ? el.textContent : el.textContent.slice(0,-1), el)
      }
      if (el.special) return f(false, el)
      for (let ch = el.firstChild; ch; ch = ch.nextSibling) {
        if (_visitText(ch, f) === stopIteration) return stopIteration
        if (_getNextSibling(ch) && (ch.tagName === 'DIV' || ch.tagName === 'P'))
          if (f('\n', _getNextSibling(ch)) === stopIteration) return stopIteration
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
      // Non-contenteditable elements in contenteditable are treated atrociously, so we resort to these hacks.
      if (el.tagName === 'COLLAPSED' && (!el.firstChild || el.firstChild.tagName !== 'HIDDEN'))
        el.insertBefore(elem('hidden'), el.firstChild)
      while (el.tagName === 'COLLAPSED' && el.parentNode && el.firstChild !== el.lastChild)
        el.parentNode.insertBefore(el.firstChild.nextSibling, el.nextSibling)

      return el === ch ? stopIteration : s === false ? ++j : j += s.length
    })
    return j
  },

  _loadCaret(el, index, into) { // → [ch, i]
    if (index < 0) index = 0
    let j = 0, i = 0, result, arr = []
    _visitText(el, (s, el) => {
      arr.push(s)
      const len = s === false ? 1 : s.length
      if (j + len >= index) return result = el, i = index - j, stopIteration
      j += len
    })
    let ch = result
    if (ch && !(ch instanceof Element) && i === ch.nodeValue.length && _getNextSibling(ch)) ch = _getNextSibling(ch), i = 0
    if (index == null) ch = null
    if (ch && !i && ch.special && ch.previousSibling) ch = ch.previousSibling, i = Infinity
    if (ch && ch instanceof Element && i > ch.childNodes.length) i = ch.childNodes.length
    if (ch && !(ch instanceof Element) && i > ch.nodeValue.length) i = ch.nodeValue.length
    if (into instanceof Selection) ch ? into.collapse(ch, i) : into.collapse(el, el.childNodes.length)
    else return ch ? [ch, i] : [el, el.childNodes.length]
  },

  _innerText:{
    txt:`Returns the inner text of an element (in an array with strings and other things), preserving .special elements.`,
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
    _smoothHeightPost(el, pre)
  },

  _smoothTransformPre(el) {
    if (!(el instanceof Element)) return !el || el.left === undefined || el.top === undefined ? undefined : [el.left + scrollX, el.top + scrollY]
    const r = el.getBoundingClientRect()
    return [r.left + scrollX, r.top + scrollY]
  },

  _smoothTransformPost:{
    txt:`For moving non position:inline elements from and to an arbitrary document location, smoothly and without lag. Use _smoothTransformPre to fill in \`pre\`.`,
    call(el, pre, delay = 0) {
      if (!pre || !(el instanceof Element)) return
      impure()
      const post = _smoothTransformPre(el)
      if (!post || el.style.display || el.style.transform || el.style.transform && el.style.transform !== 'none') return
      if (pre[0] === post[0] && pre[1] === post[1]) return post
      el.style.display = 'none'
      el.style.transform = `translate(${pre[0] - post[0]}px, ${pre[1] - post[1]}px)` // Too lazy to scale it (which would require knowing transform-origin).
      el.offsetWidth
      el.style.removeProperty('display')
      el.offsetWidth
      if (delay)
        setTimeout(() => el.style.removeProperty('transform'), delay)
      else el.style.removeProperty('transform')
    },
  },

  _smoothHeightPre(el) { return el instanceof Element && el.offsetHeight || 0 },

  _smoothHeightPost:{
    txt:`Since height:auto does not transition by default (because it's too laggy for non-trivial layouts), we explicitly help it (because we don't care).
Call this with the result of _smoothHeightPre to transition smoothly.`,
    call(el, pre) {
      if (!(el instanceof Element)) return
      impure()
      el.style.removeProperty('height')
      const post = _smoothHeightPre(el)
      if (pre !== post) {
        el.style.height = pre + 'px'
        el.offsetWidth
        el.style.height = post + 'px'
      }
      return post
    },
  },

  elemInsert:{
    txt:`Inserts a DOM element into the displayed DOM tree smoothly (if CSS transitions are enabled for it, and are specified in seconds, with all-props being the first specified one), by transitioning height and opacity from 0.
Very bad performance if a lot of inserts happen at the same time, but as good as it can be for intermittent smooth single-element-tree insertions.`,
    call(into, el, before = null) {
      impure()
      if (el.parentNode) el = elemClone(el)
      if (typeof el == 'string') el = document.createTextNode(el)
      const pre = _smoothHeightPre(into)
      if (_isStylableDOM(el)) el.style.opacity = 0

      into.insertBefore(el, before)
      _updateBroken(el)

      _smoothHeightPost(into, pre)

      if (_isStylableDOM(el)) {
        _smoothHeightPost(el, 0)
        el.style.removeProperty('opacity')
      }
      return el
    },
  },

  elemRemove:{
    txt:`Removes a DOM element from the displayed document smoothly (if CSS transitions are enabled for it, and are specified in seconds, with all-props being the first), by transitioning height and opacity to 0.`,
    call(el, absolutize = false, particles = true, doHeight = true) {
      if (!el || el.removed) return
      impure()
      if (!(el instanceof Element)) return el.remove ? el.remove() : error('Not an element')
      el.removed = true

      if (particles) {
        const r1 = el.getBoundingClientRect(), r2 = document.documentElement.getBoundingClientRect()
        _particles(r1.left - r2.left, r1.top - r2.top, r1.width, r1.height)
      }

      let height, dur, from, pre
      if (doHeight) {
        const style = getComputedStyle(el)
        ;({height} = style)
        dur = parseFloat(style.transitionDuration)*1000 || 0
        from = el.parentNode
        pre = _smoothHeightPre(from)
      }

      if (absolutize) {
        const x = el.offsetLeft, y = el.offsetTop
        el.style.position = 'absolute'
        el.style.left = x + 'px'
        el.style.top = y + 'px'
      }

      if (dur) {
        if (doHeight) el.style.height = height
        el.style.opacity = 0, el.style.pointerEvents = 'none'
        if (doHeight) el.offsetHeight
        if (doHeight) el.style.height = 0
        setTimeout(el => el.remove(), dur, el)
      } else el.remove()
      if (doHeight) _smoothHeightPost(from, pre)
      return el
    },
  },

  _particles:{
    txt:`A splash of magical particles.`,
    philosophy:`Most people create programming languages to improve performance for specific cases or to prove their way of thinking superior to others, but I actually just wanted to be a wizard and use a PL to enhance my craft.`,
    call(x,y,w,h) {
      const n = Math.sqrt(w*h)/10
      for (let i = 0; i < n; ++i) {
        const p = elem('particle')
        p.style.left = x + Math.random() * w + 'px'
        p.style.top = y + Math.random() * h + 'px'
        p.style.setProperty('--x', (Math.random()*20-10) + 'px')
        p.style.setProperty('--y', (Math.random()*20-10) + 'px')
        document.body.append(p)
        setTimeout(() => p.remove(), 500)
      }
    },
  },

  _isDOM(el) { return typeof Node != ''+void 0 && el instanceof Node },

  _isStylableDOM(el) { return typeof Element != ''+void 0 && el instanceof Element },

  _throttled:{
    txt:`Returns a throttled version of a function.
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
        else requiredRest -= _timeSince(lastRun), lastRun = _timeSince()
        if (requiredRest > 2)
          scheduledId == null && (scheduledTime = _timeSince()), scheduledId = setTimeout(runThrottled, Math.max(0, requiredRest))
        else runThrottled(), scheduledTime = _timeSince()
      }
      function runThrottled() {
        scheduledId = null
        const start = _timeSince()
        const r = fun(arg1, arg2)
        if (r instanceof Promise)
          r.then(_result => (lastDur = blend * _timeSince(start) + (1-blend) * _timeSince(start), lastRun = _timeSince()))
        else
          lastDur = blend * _timeSince(start) + (1-blend) * _timeSince(start), lastRun = _timeSince()
        return r
      }
      return throttled
    },
  },

  null:null,

  undefined:undefined,

  _var:{
    txt:`Finishing \`?\` or \`(var)\`: A unique assignable variable.
Unlike a label, this returns itself when evaluated without having been assigned.`,
    examples:[
      [
        `a a a:(var)`,
        `a a a:(var)`,
      ],
      [
        `(var) (var)`,
        `(var) (var)`,
      ],
      [
        `(a→a 5) a:(var)`,
        `5`,
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
    argCount:0,
  },

  var:__is(`_var`),

  _const:{
    txt:`\`(const)\`: A new unique object with no inner structure, only good for ref-equality checks.`,
    examples:[
      [
        `(a a a:(const))`,
        `(a a a:(const))`,
      ],
      [
        `((const) (const))`,
        `((const) (const))`,
      ],
      [
        `(a→a a) a:(const)`,
        `(const)`,
      ],
      [
        `(a→a 5) a:(const)`,
        `error (const) 'cannot be assigned' 5`,
      ],
    ],
    nameResult:[
      `o`,
      `obj`,
    ],
    argCount:0,
  },

  const:__is(`_const`),

  _isVar(x) { return _isLabel(x) || _isArray(x) && x[0] === _var && x.length == 1 },

  log:{
    txt:`\`(log …Values)\`: For debugging; logs to the current DOM node or console.`,
    call(...x) {
      log.did = true, impure.impure = true
      try {
        let str
        if (x.length != 1 || !_isStylableDOM(x[0]))
          str = serialize(x.length > 1 ? x : x[0], finish.env[_id(Languages)] || fancy, undefined, serialize.displayed)
        else str = x[0]
        const into = finish.env[_id(log)]
        if (into)
          elemInsert(into, str)
        else
          console.log(str)
        if (x.length == 1) return x[0]
      } catch (err) { if (err !== impure) console.log(err), console.log(...x) }
      finally { impure.impure = false }
      // log.did (for not erasing parts of a log in a terminal in NodeJS)
    },
  },

  _updateBroken(e, available = e.offsetWidth || 0) {
    // Ensure that e either contains no soft line breaks directly inside of it, or its every child is on its own line (CSS class .broken).
      // Quite expensive: one reflow per newly-broken node.
    if (!_isStylableDOM(e) || e.tagName === 'COLLAPSED') return
    const start = e.offsetLeft
    for (let ch = e.firstChild; ch; ch = ch.nextSibling)
      _updateBroken(ch, ch.offsetParent !== e ? available + start - ch.offsetLeft : available - ch.offsetLeft)
    if (e.tagName !== 'NODE' || e.classList.contains('code')) return
    const parentWidth = e.classList.contains('broken') && (!e.childNodes[2] || e.childNodes[2].tagName !== 'TABLE') ? available : e.offsetWidth
      // Not nearly as accurate as removing .broken would have been (with tables in particular), but much faster.
        // So we special-case the <table>-inside case lol
        // Structural learning at its finest
    let sum = 0
    for (let ch = e.firstChild; ch; ch = ch.nextSibling) sum += ch.offsetWidth
    if ((parentWidth < sum) !== e.classList.contains('broken'))
      e.classList.toggle('broken', parentWidth < sum)
  },

  _forEachGlobalDefining(x, f, onlyPublic = false, onlyTopLevel = false) {
    const seen = new Set
    parse.ctx.forEach((v,k) => {
      if (seen.has(v)) return; else seen.add(v)
      if (onlyPublic && k[1][0] === '_') return
      if (onlyTopLevel && lookup.parents.has(v)) return
      if (defines(v, x) !== undefined) f(v, defines(v, x))
    })
  },

  buzzwords:{
    txt:`\`(buzzwords)\`: returns all buzzwords of Self as a programming language.`,
    merge:__is(`true`),
    call(f) {
      if (_isArray(f)) error("Can only view txt of simple functions, not", f)
      if (f !== undefined) return defines(f, txt)
      const result = ['A ']
      let b = 0
      _forEachGlobalDefining(buzzwords, (v, r) => typeof r == 'string' && (b++ && result.push(', '), result.push(elemValue(elem('node', r), v))))
      result.push(' programming language.')
      return elemValue(elem('node', result), Self)
    },
  },

  docs:{
    txt:`\`(docs)\`: returns a hierarchical documentation elem.`,
    merge:__is(`true`),
    call() {
      const net = defines(Self, lookup)
      const publics = Object.keys(net).filter(k => k[0] !== '_').map(k => net[k])
      const summary = (name, v) => typeof defines(v, txt) != 'string' ? name : [name, ':  ', elemValue(elem('node', stringToDoc(defines(v, txt))), [])]
      const el = permissionsElem(publics, summary, Self)
      call.impure = false
      return el
    },
  },

  txt:{
    txt:`\`(txt)\`: Returns all available textual descriptions of functions in a {(map … Function Description …)} format.`,
    nameResult:[
      `description`,
      `asText`,
    ],
    merge:__is(`true`),
    call(f) {
      if (_isArray(f)) error("Can only view txt of simple functions, not", f)
      if (f !== undefined) return defines(f, txt)
      const result = new Map
      _forEachGlobalDefining(txt, (v, r) => result.set(v, r), true, true)
      return result
    },
  },

  examples:{
    txt:`\`(examples)\`: Returns all available examples of usage of functions in a {(map … Function {(… {(Code ⇒ Becomes)} …)} …)} format.
All these are automatically tested to be correct at launch.`,
    philosophy:`Tests are a tool for seeing what needs to be fixed before commiting to a change.`,
    merge:__is(`true`),
    call(f) {
      if (_isArray(f)) error("Can only view examples of simple functions, not", f)
      if (f !== undefined) return defines(f, examples)
      const result = new Map
      _forEachGlobalDefining(examples, (v, r) => result.set(v, typeof document != ''+void 0 ? r.map(([a,b]) => [parse(a)[0], elem('span', '⇒'), parse(b)[0]]) : r), true)
      call.impure = false
      return result
    },
  },

  future:{
    txt:`\`(future F)\`: Returns a list of things to be done about F.
\`(future)\`: Returns all known things to be done. Less than a third is usually done.`,
    nameResult:[
      `todo`,
    ],
    merge:__is(`true`),
    call(f) {
      if (_isArray(f)) error("Can only view futures of simple functions, not", f)
      if (f !== undefined) return defines(f, future)
      const result = new Map
      _forEachGlobalDefining(future, (v, r) => result.set(v, r))
      return result
    },
  },

  philosophy:{
    txt:`Does that matter to you?`,
    lookup:[
      [
        `These can be funny.`,
        `There is some philosophy surrounding this code, not because it's never been said before, but because the mind walks in places that code can't reach.`,
        [
          `— What exists can be optimized, but what doesn't exist cannot. Premature optimization is evil. Ideas in a human mind are very likely not what they claim they are to the rest of the mind, so it is extremely likely that you'll end up optimizing a valid idea out of existence. (Learning to make labels and implementations agree can help, but is still not a guarantee. Nothing is.)`,
          `— In the end, the best and most capable thing always wins. Might as well try to do as much as possible correctly from the start. (Design for generality first, and derive optimized versions as special cases.)`,
          `— Don't care about all the nice features, care about the cores that allow them. Making choices once presented is easy, it is getting to them that is the hard part. (Don't learn; master.)`,
          `— There are no false trails and things that are so for no reason, and everything can be pursued to its underlying powerful idea(s), leaving an implementation in your personality or a program (or a story or whatever) you've intertwined it with, in the process. No truths nor lies, only evidence you've seen and what you've made of it. Effects and their reasons are intrinsically linked, and metaphors are not meaningless wordplay. (In particular, the only true god of humans is an extremely correct implementation/explanation of their intelligence, and some of physics.) (Believe in yourself.)`,
          `— No idea by itself, no matter how real and underlying and powerful and pure, can compete against multiple ideas that come together. Paperclip maximizers, super-intelligent viruses, one-trick pony philosophers and idea-men, ideas and ideologies and separate forms of governance may struggle as hard as they want, but they will fail against life's unity; saying that a thing that can do everything *will* do everything is just inexperience — do not fall into this trap of infinite generality. (Design for unity, not dominance of a paradigm. Build on top of a popular thing. Do not split across many projects; it's not a sprint, it's a marathon.)`,
          `— A worthwhile mind's most fundamental concepts are basic concepts of a very high-level programming language too. By now, there are no significant holes left in that view, and someone just needs to put together a myriad pieces properly. Communication by a single word with all the meaning, interconnectedness into a global network of all knowledge, eternal improvement and learning, multiple bodies for one mind and multiple minds for one body, reproduction, life after and in death, planning, imagination, logic, emotions — all implemented and practically perfected somewhere in the world, often with its own set of programming languages and frameworks. Finding all these to unite is how humanity would *begin* to create AI: a convenient-to-use singularity is the only first step possible. The picture is about precise enough already, and top-down is very slowly starting to meet the bottom-up.

(To be full, these are the more bottom-up words for the things above: properly-integrated conceptual links, Internet, evolution and more specific optimizers, multiprocessing and scheduling, copying, copying and self-rewriting, virtualization of operations, most of modern maching learning, logic and types and proof assistants, reinforcement learning. This is about as good of a match as it can get. Only with all the pieces can the full picture be seen, as they enrich each other: a nigh-impossible engineering task today, but one that at least someone will have to undertake and complete eventually.)`,
          `— If something is difficult to the point of death wish, then no one has likely done it before, which means that it's worth doing. (…This isn't very difficult without a deadly time limit, though.)`,
        ],
        `Humanity's beauty; amazing…`,
      ],
      [
        `Modern "AI" stands for Approximate Imagination.`,
        `Reward hacking isn't an AI issue (AI would be controlled by more than a static reward function, just like advanced humans), it's a human issue. Drugs and porn and unhealthy addictive habits are obvious, but it is so much more prevalent: art and pretty words, religion and everyday rituals, cooking and fashion — everything is stained in it (though it is a thing subjective to a viewer, impossible to unfailingly pin down). The brightest side of deliberated reward hacking is that (some of) it allows humans to move past their built-in limited ideas of what's good, and find their own meaning despite having been given one; the dark side is that the new ideas are often very wrong. Reward hacking can be both beautiful and grotesque. (Evolution has not caught up to modern society at all, so ugly effects are visible.)`,
        `Paper(clip) optimizers are a human problem too. It's called money and greed. There's absolutely nothing about AI that's not in I, it's just somewhat more clear and efficient.`,
        `AI is usually considered as either slave or master (or transitioning to one of those). That's wrong. Intelligence is total generality, able to include everything, and including everything found useful. Both humans and AI can understand and propose with both words and actions, and consider a problem from every point of view`,
      ],
      `Believing in lies… a recognizable feeling, offering relief and a sense of purpose. A lot of people chase it. Disdainful superiority, reputation, religion, pointless complexity. Easy to manipulate by feeding, if one were so inclined. Done because truth is unknown. Far past these beliefs lies the smoothness of conceptual causality.`,
      `Maxwell's demon is usually considered mechanically impossible, because it would have to contain perfect information about the environment's particles in order to sort them properly. But complete memorization isn't the only way to learn. If there is any pattern at all in probabilities, or in any other effect of interaction with particles, or even in their state after randomly-tried-for-long-enough assumptions, then an ever-improving approximation can be devised, and entropy combated a little. (Needs at least a conceptual singularity first, for most efficient learning. But don't worry, the expansion of space will still get you.)`,
      `All known heavens are little more than metaphors for death from trying to fly too close to the sun. But with a huge amount of effort, that could change: they could be metaphors for a heaven that succeeds at existing.`,
      `Did you ever hear the tragedy of Darth Plagueis the Wise?
I thought not. It's not a story the Jedi would tell you. It's a Sith legend. Darth Plagueis was a Dark Lord of the Sith, so powerful and so wise, he could use the Force to influence midichlorians to create… life. He could even keep the ones he cared about from dying.
The Dark Side of the Force is a pathway to many abilities some consider to be… unnatural.
He became so powerful, the only thing he was afraid of was losing his power, which eventually, of cource, he did. Unfortunately, he taught his apprentice everything he knew, then his apprentice murdered him in his sleep. Ironic. He could save others from death… but not himself.`,
    ],
  },

  await:{
    txt:`Finishing \`(await Expr)\`: waits for the returned promise(s) to finish before continuing evaluation.
An alternative for the default fitting-for-script-usage partial evaluation. Best used for fast-returning promises.`,
    finish(expr) {
      let [doing = expr] = interrupt(_await)
      if (doing === _onlyUndefined) doing = undefined
      try {
        let r = finish(doing)
        if (_isUnknown(r)) {
          if (_isDeferred(r)) {
            let promise
            if (r.length == 3 && r[1] === r[2])
              promise = r[1]
            else
              promise = r.slice(2).filter(_isPromise),
              promise.forEach(p => p.then(result => p.result = result).catch(reason => p.result = jsRejected(reason))),
              promise = Promise.all(promise)
            doing = r[1]
            _jobs.reEnter = (expr, env, then, ID) => promise.then(() => _schedule(expr, env, then, ID)).catch(() => _schedule(expr, env, then, ID))
            throw interrupt
          }
          return r[1] = array(_await, r[1]), r
        }
        return r
      } catch (err) { if (err === interrupt) interrupt(_await, 1)(doing !== undefined ? doing : _onlyUndefined); throw err }
    },
    lookup:{
      delay:__is(`delay`),
      race:__is(`race`),
    },
    call(p) {
      // Allow JS functions to stop themselves and re-enter when the promise fulfills.
      if (!(p instanceof Promise)) return p
      if ('result' in p) return p.result
      _jobsReEnter.promise = p, _jobs.reEnter = _jobsReEnter
      throw interrupt
    },
  },

  _jobsReEnter(expr, env, then, ID) {
    // Re-schedule interpretation when the promise returns.
    const p = _jobsReEnter.promise
    p.then(r => (p.result = r, _schedule(expr, env, then, ID)))
    .catch(r => (p.result = jsRejected(r), _schedule(expr, env, then, ID)))
  },

  _await:__is(`await`),

  delay:{
    txt:`\`(delay)\` or \`(delay Value)\`: Just a function for testing promises. It should have no effect on evaluation.
Examples: \`(delay 1)+(delay 2)\` eventually returns \`3\`. \`(delay 1)*(delay 3)+(delay 4)*(delay 5)\` eventually returns \`23\`.`,
    nameResult:[
      `delayed`,
    ],
    call(x = 12) { return new Promise(then => setTimeout(then, 5000 + 1000 + Math.random()*4000, x)) },
  },

  race:{
    txt:`Finishing \`(race …Exprs)\`: returns the first expression that returns instead of being deferred. The opposite of regular multiple-promise handling, which waits for all to join.`,
    nameResult:[
      `firstOf`,
    ],
    finish(...x) {
      if (this !== race) return
      let [i = 0, exprs = [race], promises = []] = interrupt(race)
      try {
        for (; i < x.length; ++i) {
          // Why not do it in random order? Or some order that measures times and starts with the least-time one, or uses some other performance approximation.
          const v = finish(x[i])
          if (v instanceof Promise) {
            if ('result' in v) return v.result
            promises.push(v)
            exprs.push(v)
          } else if (_isUnknown(v)) {
            promises.push(...v.slice(2))
            exprs.push(v[1])
          } else // A non-deferred result.
            return v
        }
      } catch (err) { if (err === interrupt) interrupt(race, 3)(i, exprs, promises);  throw err }
      return i = [_unknown, merge(exprs)], i.push(...promises), i
    },
  },

  jsRejected:{
    txt:`\`(jsRejected Reason)\`: represents either an exception or promise rejection in JS.`,
    future:`Change the stack to \`(Func Line)\` — which needs to both know the source and locations of functions in the greater source. (Lines with /*here*/ inserted at error spot.)`,
    call(err) {
      // Convert a caught error to its displayable representation.
      if (err instanceof Error)
        return err.stack ? array(jsRejected, elem('error', String(err)), _resolveStack(err.stack)) : array(jsRejected, elem('error', String(err)))
      else if (!_isError(err))
        return array(jsRejected, err)
      else
        return err
    },
  },

  _schedule:{
    txt:`\`(_schedule Expr Env Then)\`⇒JobId: schedule an expression for evaluation, with an environment (defining where its logging should go to, and its current variables, read/write journals, and more; use _newExecutionEnv() for this) and a native function for continuation.
This is a low-level primitive that a user can indirectly interact with. Sub-job scheduling must be implemented in-job, to deny resource denial.`,
    lookup:{
      cancel:__is(`_cancel`),
      jobs:__is(`_jobs`),
    },
    call(expr, env, then, ID = _newJobId()) {
      // Call this to initiate a later evaluation of an expression; the callback will be called with the result.
      if (typeof then != 'function') throw "Expected a function continuation"
      if (!_jobs.expr) _jobs.expr = []
      if (!_jobs.expr.length) setTimeout(_jobs, 0)
      if (!_jobs.begin) _jobs.begin = 0
      for (let i = _jobs.begin; i < _jobs.expr.length; i += 4) // Don't add the same job twice.
        if (_jobs.expr[i] === expr && _jobs.expr[i+1] === env && _jobs.expr[i+2] === then) return
      _jobs.expr.push(expr, env, then, ID)
      return ID
    },
  },

  _cancel:{
    txt:`\`(_cancel JobId)\`: if the job is scheduled to run, cancels it. Returns true if cancelled, false if not.
If any promises the job depends on have a method .cancel, calls those.`,
    call(ID) {
      for (let i = 0; i < _jobs.expr.length; i += 4)
        if (_jobs.expr[i+3] === ID) {
          const v = _jobs.expr[i]
          if (_isUnknown(v))
            for (let j = 2; j < v.length; ++j)
              if (v[j] instanceof Promise && typeof v[j].cancel == 'function')
                v[j].cancel()
          _jobs.expr.splice(i, 4)
          return true
        }
      call.locked.forEach((ownerID, v) => ownerID === ID && (call.cache.delete(v), call.locked.delete(v)))
      return false
    },
  },

  _newJobId() {
    if (!_newJobId.ID) _newJobId.ID = 0
    return _newJobId.ID++
  },

  _jobs:{
    txt:`The interpreter loop. Most of it is about dealing with deferred stuff. Use _schedule to do stuff with it.`,
    call() {
      const DOM = typeof document != ''+void 0
      if (DOM && !_jobs.f) _jobs.f = _throttled(_jobsDisplay, .05)
      if (_jobs.expr.length) {
        let time, start, end
        if (typeof global == ''+void 0) // Browser
          time = performance.now.bind(performance), start = time(), end = start + 10
        else { // NodeJS
          const {performance} = require('perf_hooks')
          time = performance.now, start = time(), end = start + 100
        }
        if (!_jobs.duration) _jobs.duration = 0

        // Ensure that we still re-enter the interpreter loop after manually interrupting a script.
        const EnsuranceId = setTimeout(_jobsResume, 500, false)

        // Execute while checking for end.
        if (DOM) JobIndicator.classList.toggle('yes', true)
        let jobs = _jobs.expr, begin = 0
        do {
          let expr = jobs[begin++], env = jobs[begin++], then = jobs[begin++], ID = jobs[begin++]
          env[_id(realTime)] = _timeSince()
          if (_isDeferred(expr))
            expr = _deferredPrepare(expr, env, then, ID)

          finish.env = env, call.ID = ID
          finish.pure = false, finish.inFunction = 0, finish.noSystem = false, call.impure = false, _assign.inferred = undefined
          _checkInterrupt.stepped = false
          interrupt.started = _timeSince()
          _jobs.reEnter = true
          let v, interrupted
          try { v = finish(expr) }
          catch (err) {
            if (err === interrupt) interrupted = true
            else v = jsRejected(err)
          }
          finish.env = env
          env[_id(userTime)] += _timeSince(env[_id(realTime)])

          if (v instanceof Promise) v = 'result' in v ? v.result : _promiseToDeferred(v)
          if (interrupted) // Re-schedule.
            _jobs.begin = begin, _jobs.reEnter === true ? _schedule(expr, env, then, ID) : _jobs.reEnter(expr, env, then, ID)
          else if (_highlightOriginal(finish.env[_id(_checkInterrupt)], false), _isDeferred(v)) // Make promises know we're here.
            _deferredResult(v, env, then, ID)
          else // We have our result.
            try { then(v) }
            catch (err) { try { then(jsRejected(err)) } catch (err) { console.log(err) } }
        } while (begin < jobs.length && time() < end)
        jobs.splice(0, begin), _jobs.begin = 0
        _jobs.duration = time() - start
        clearTimeout(EnsuranceId)
      }
      if (DOM) {
        JobIndicator.title = JobIndicator.title.replace(/[0-9]+/, _jobs.expr.length>>>2)
        if (_jobs.expr.length) _jobsResume(Math.min(_jobs.duration / (+CPU.value || 1) - _jobs.duration, 1000))
        else JobIndicator.classList.toggle('yes', false)
        _jobs.f(JobIndicator)
      } else if (_jobs.expr.length)
        _jobsResume()
      // _jobs.expr (Array), _jobs.duration (Number), _jobs.reEnter (true or a _schedule-replacing function)
    },
  },

  _jobsResume(delay) { delay === false && JobIndicator.classList.toggle('yes', false);  if (_jobs.expr.length) setTimeout(_jobs, delay || 0) },

  _deferredPrepare(expr, env, then, ID) {
    // Go through all expr's promises and bind their instances inside to promise.result if present.
    const ctx = new Map
    for (let i = 2; i < expr.length; ++i) {
      const p = expr[i]
      if (!(p instanceof Promise)) continue
      if ('result' in p)
        ctx.set(p, p.result)
      // Remove us from the promise's continuation (and only us, since there might be different contexts listening to the same promise).
      for (let i = 0; i < p.cont.length; i += 4)
        if (p.cont[i] === expr && p.cont[i+1] === env && p.cont[i+2] === then && p.cont[i+3] === ID) {
          p.cont.splice(i, 4)
          break
        }
    }
    return bound(expr[1], ctx)
  },

  _deferredResult(v, env, then, ID) {
    // Remember to continue when any promise returns.
    log('<Deferring', v.slice(2).filter(x => x instanceof Promise).length, 'promises…>')
    v.forEach(p => {
      if (p instanceof Promise) {
        if (!p.cont)
          p.cont = [],
          p.then(result => {
            _scheduleAndConsumeMany(p.cont, p.result = result)
          }, reason => {
            _scheduleAndConsumeMany(p.cont, p.result = jsRejected(reason))
          })
        p.cont.push(v, env, then, ID)
      }
    })
  },

  _jobsDisplay(el, n = _jobs.expr.length>>>2) {
    // Creates a <div> inside el for every existing job.
    let ch = el.firstChild || el.appendChild(document.createElement('div')), i = 0
    for (; i < n; ++i, ch = ch.nextSibling || el.appendChild(document.createElement('div')))
      ch.style.setProperty('--turns', -i/n + 'turn')
    for (; i = ch && ch.nextSibling, ch; ch = i) el.removeChild(ch)
  },

  _scheduleAndConsumeMany(a) {
    // A little function for very slight efficiency gains in promise-handling.
    for (let i = 0; i < a.length; i += 4)
      _schedule(a[i], a[i+1], a[i+2], a[i+4])
    a.length = 0
  },

  _highlightOriginal(expr, working) {
    // Add (or remove) .working to DOM elements responsible for expr.
    let arr = elemValue(undefined, expr), i = 0
    while (!arr && i < 16) {
      if (_cameFrom.m && _cameFrom.m.has(expr) && _cameFrom.m.get(expr) !== expr)
        expr = _cameFrom.m.get(expr), arr = elemValue(undefined, expr), ++i
      else break
    }
    if (arr) arr.forEach(el => el.classList.toggle('working', working))
  },

  _newExecutionEnv:{
    txt:`Creates a new execution env.
Don't ever re-use the same env in _schedule, use this instead.`,
    call(basedOn) {
      const e = Object.create(null)
      e[_id(journal)] = undefined
      e[_id(label)] = undefined
      e[_id(Languages)] = undefined
      e[_id(log)] = undefined
      e[_id(interrupt)] = undefined
      e[_id(_checkInterrupt)] = undefined
      e[_id(userTime)] = undefined
      e[_id(realTime)] = undefined
      e[_id(pick)] = randomNat
      Object.seal(e)
      basedOn && Object.assign(e, basedOn)
      e[_id(userTime)] = 0
      e[_id(label)] = new Map
      e[_id(interrupt)] = undefined
      return e
    },
  },

  id:{
    txt:`id: The identity function that just returns x from \`(id x)\`.`,
    argCount:1,
    merge:__is(`true`),
    call(x) { return x },
  },

  first:{
    txt:`Finishing \`a\\b\\c\` or \`(first …Branches)\`: tries to evaluate each expression in order, returning the first non-error result or else error.`,
    examples:[
      [
        `(first "1" "2")`,
        `"1"`,
      ],
      [
        `(first (error) "2")`,
        `"2"`,
      ],
      [
        `x→(first (error) x "1")`,
        `id`,
      ],
      [
        `x→(first (error) x+1 "1")`,
        `x→(first x+1 "1")`,
      ],
    ],
    nameResult:[
      `firstOf`,
      `result`,
    ],
    merge:__is(`true`),
    finish(...branches) {
      const us = finish.v
      let [i = 0] = interrupt(first)
      try {
        for (; i < branches.length-1; ++i) {
          try {
            const v = finish(branches[i])
            if (_isUnknown(v) && (_isDeferred(v) || _hasCallableParts(v[1], true)))
              return v[1] = _cameFrom(array(first, v[1], ...branches.slice(i+1)), us), v
            return v
          } catch (err) { if (err === interrupt) throw err }
        }
        return finish(branches[branches.length-1])
      } catch (err) { if (err === interrupt) interrupt(first, 1)(i);  throw err }
    },
  },

  last:{
    txt:`Finishing \`a,b,c\` or \`(last …Branches)\`: tries to evaluate each expression in order, returning the first error or else the last non-error result.`,
    examples:[
      [
        `(last "1" "2")`,
        `"2"`,
      ],
      [
        `(last (error) "2")`,
        `(error)`,
      ],
      [
        `x→(last "1" x (error) "2")`,
        `x→(error)`,
      ],
      [
        `x→(last "1" x+1 (error) "2")`,
        `x→(last x+1 (error) "2")`,
      ],
    ],
    nameResult:[
      `lastOf`,
      `result`,
    ],
    merge:__is(`true`),
    finish(...branches) {
      const us = finish.v
      if (branches.length == 1) return finish(branches[0])
      let [i = 0] = interrupt(last)
      try {
        for (; i < branches.length-1; ++i) {
          const v = finish(branches[i])
          if (_isUnknown(v) && (_isDeferred(v) || _hasCallableParts(v[1], true)))
            return v[1] = _cameFrom(array(last, v[1], ...branches.slice(i+1)), us), v
        }
        return finish(branches[branches.length-1])
      } catch (err) { if (err === interrupt) interrupt(last, 1)(i);  throw err }
    },
  },

  try:{
    txt:`\`a|b|c\` or \`(try …Functions)\`: returns a function that tries to call functions in order, returning the first non-error result or error.`,
    examples:[
      [
        `(f 1) f:(try 0->5 1->10 2->15)`,
        `10`,
      ],
      [
        `(f 1 2) f:(try (function 2 3 4) (function a b 3))`,
        `3`,
      ],
      [
        `(f 1 2) f:(try (function 1 3 5) (function 1 6) (function a b (sum a b)))`,
        `3`,
      ],
    ],
    merge:__is(`true`),
    call(...functions) {
      for (let i = 0; i < functions.length; ++i)
        if (typeof functions[i] != 'function') throw "Expected a function"
      if (functions.length == 1) return functions[0]

      const impl = function tryInOrder(...data) {
        let [i = 0] = interrupt(tryInOrder)
        const us = finish.v
        try {
          for (; i < functions.length-1; ++i)
            try {
              const v = functions[i].apply(functions[i], data)
              if (_isUnknown(v) && (_isDeferred(v) || _hasCallableParts(v[1], true)))
                return v[1] = _cameFrom(array(first, v[1], _cameFrom(array(_cameFrom(array(_try, ...functions.slice(i+1)), us), ...data), us)), us), v
              return v
            } catch (err) { if (err === interrupt) throw err }
          return functions[functions.length-1].apply(functions[functions.length-1], data)
        } catch (err) { if (err === interrupt) interrupt(tryInOrder, 1)(i);  throw err }
        finally { _assign.inferred = undefined }
      }
      _cameFrom(impl, finish.v)
      const d = impl[defines.key] = Object.create(null)
      d[_id(deconstruct)] = array(_try, ...functions)
      d[_id(inline)] = true
      if (functions.every(x => defines(x, merge)))
        d[_id(merge)] = true
      return impl
    },
  },

  _try:__is(`try`),

  compose:{
    txt:`\`(compose …Functions)\`: returns a function that composes functions left-to-right, passing the output of each function to the next one.`,
    examples:[
      [
        `(f 1) f:(compose a→(mult a 8) b→(sum b 2))`,
        `10`,
      ],
      [
        `((compose f g) 1) f:x→(sum 1 x) g:x→(mult 2 x)`,
        `4`,
      ],
      [
        `compose 1→2 2->3`,
        `1→3`,
      ],
    ],
    merge:__is(`true`),
    call(...functions) {
      // A shorter and less valid version, simpler to understand:
      // return x => { for (let f of functions) x = f(x);  return x }

      // (compose a→b b→c)  ⇒  a→c
      let [i = 0, f = functions] = interrupt(compose)
      try {
        for (; i < f.length-1; ++i) {
          let a = f[i], b = f[i+1]
          if (typeof defines(b, argCount) == 'number' && defines(b, argCount) !== 1) error("argCount of composed functions must be 1")
          if (_isFunction(a) && _isFunction(b)) {
            a = defines(a, deconstruct), b = defines(b, deconstruct)
            if (a[2] === b[1] && a.length == 3 && b.length == 3)
              f.splice(i, 2, defines(_function, finish)(a[1], b[2]))
          }
        }
      } catch (err) { if (err === interrupt) interrupt(compose, 2)(i, f);  throw err }

      for (let i = 0; i < f.length; ++i)
        if (typeof f[i] != 'function') error("Expected a function", f[i])
      if (f.length == 1) return f[0]
      if (!f.length) return id

      const impl = function doInOrder(...data) {
        const us = finish.v
        let [i = 0, v = data.length == 1 ? data[0] : array(rest, data)] = interrupt(doInOrder)
        try {
          for (; i < f.length; ++i) {
            v = _isArray(v) && v[0] === rest && _isArray(v[1]) && v.length == 2 ? f[i].apply(f[i], v[1]) : f[i].call(f[i], v)
            if (i+1 < f.length && _isUnknown(v) && (_isDeferred(v) || _hasCallableParts(v[1], true)))
              return v[1] = _cameFrom(array(_cameFrom(array(compose, ...f.slice(0,i)), us), v[1]), us), v
          }
          return v
        } catch (err) { if (err === interrupt) interrupt(doInOrder, 2)(i,v);  throw err }
      }
      _cameFrom(impl, finish.v)
      const d = impl[defines.key] = Object.create(null)
      d[_id(deconstruct)] = array(compose, ...f)
      d[_id(inline)] = true
      if (functions.every(x => defines(x, merge)))
        d[_id(merge)] = true
      if (defines(f[0], argCount) !== undefined)
        d[_id(argCount)] = defines(f[0], argCount)
      return impl
    },
  },

  rest:{
    txt:`\`(rest Array)\` or \`…Array\`: when statically used in a call, spreads the Array into the user.
When in an array that is assigned to, collects the rest of arguments into an array (can only be used once per array).`,
    philosophy:`cons/car/cdr of the Lisp family are unnatural and unreadable. This is way better.`,
    examples:[
      [
        `(sum (rest (1 2)))`,
        `3`,
      ],
      [
        `R→…R`,
        `R→(rest R)`,
      ],
      [
        `(f ("a" "b" "c")) f:(A …R)→R`,
        `("b" "c")`,
      ],
      [
        `(f ("a" "b" "c")) f:(A (rest R))→R`,
        `("b" "c")`,
      ],
      [
        `(f ("a" "b" "c")) f:((rest R) Z)→R`,
        `("a" "b")`,
      ],
      [
        `(sum …(2 3))`,
        `5`,
      ],
      [
        `(sum …(…(2) 3))`,
        `5`,
      ],
    ],
  },

  _findRest(a) {
    // Find (up to) one `(rest Y)` in a and return its index (or a.length).
    if (!_isArray(a)) error("Finding rest in not-an-array")
    let r = a.length
    for (let i = 0; i < a.length; ++i)
      if (_isArray(a[i]) && a[i][0] === rest && a[i].length == 2) {
        if (r < a.length) error("Two (rest …) in an array")
        r = i
      }
    return r
  },

  false:false,

  true:true,

  if:{
    txt:`Finishing \`(if Condition Then Else)\`: Evaluates \`Condition\`, then evaluates \`Then\` if it was \`true\`, or \`Else\` otherwise.`,
    nameResult:[
      `picked`,
      `result`,
    ],
    examples:[
      [
        `X→(if true X Y)`,
        `id`,
      ],
      [
        `(F Y)→(if false X Y)`,
        `(F Y)→Y`,
      ],
      [
        `(Z X Y)→(if Z X Y)`,
        `(Z X Y)→(if Z X Y)`,
      ],
      [
        `x→(if x 1+2 2+3)`,
        `x→(if x 3 5)`,
      ],
    ],
    finish(c,a,b) {
      const us = finish.v
      let [v = finish(c)] = interrupt(_if)
      try {
        if (_isUnknown(v)) {
          let [state = 0, A, B] = interrupt(_if)
          try {
            if (state === 0 && finish.pure) A = finish(a), state = 1
            if (state === 1 && finish.pure) B = finish(b), state = 2
            if (_isUnknown(A)) v.push(...A.slice(2)), A = A[1]
            if (_isUnknown(B)) v.push(...B.slice(2)), B = B[1]
            if (A === B)
              return v[1] = _cameFrom(array(last, v[1], A), us)
            return v[1] = _cameFrom(array(_if, v[1], A, B), us), v
          } catch (err) { if (err === interrupt) interrupt(_if, 3)(state, A, B);  throw err }
        }
        return v === true ? finish(a) : finish(b)
      } catch (err) { if (err === interrupt) interrupt(_if, 1)(v !== undefined ? v : _onlyUndefined);  throw err }
    },
    argCount:3,
  },

  _if:__is(`if`),

  quote:{
    txt:`Finishing \`(quote Expr)\` or \`^Expr\`: Returns Expr unevaluated, quoting the exact array structure.
If there are no labels inside, has the same effect as adding \`array\` at the beginning of every array seen inside, copying.`,
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
    merge:__is(`true`),
    finish:__is(`id`),
    call(x) { // Value ⇒ Expr
      // Create the `(quote Expr)` representation if needed.
      if (serialize.backctx.has(x)) return x
      if (_isArray(x) && x[0] === typed) return x
      if (_isUnknown(x)) return x
      if (_isArray(x) && (_isLabel(x[0]) || _isArray(x[0])) && _hasCallableParts(x)) return array(quote, x)
      if (_isFunc(x)) return x
      if (typeof x == 'function') return x
      if (!_hasCallableParts(x)) return x
      return array(quote, x)
    },
  },

  _hasCallableParts:{
    txt:`Return true if there are any arrays in the graph that have code that defines finish/call or is cyclic or that are labels (if !ignoreVars).`,
    call(x, ignoreVars = false) {
      if (!_hasCallableParts.env) _hasCallableParts.env = new Set, _hasCallableParts.stack = new Set, _hasCallableParts.inside = false
      if (!_isArray(x)) return
      if (_isVar(x)) return !ignoreVars
      const inside = _hasCallableParts.inside
      _hasCallableParts.inside = true
      try {
        const m = _hasCallableParts.env
        if (_hasCallableParts.stack.has(x)) return true
        if (m.has(x)) return; else m.add(x)
        if (defines(x, finish) !== undefined || defines(x, call) !== undefined) return true
        _hasCallableParts.stack.add(x)
        for (let i = 0; i < x.length; ++i)
          if (_hasCallableParts(x[i], ignoreVars)) return true
          else _hasCallableParts.stack.delete(x)
      }
      finally { _hasCallableParts.inside = inside, !inside && (_hasCallableParts.env.clear(), _hasCallableParts.stack.clear()) }
      // .env, .stack, .inside
    },
  },

  _hasCycles(x) {
    if (!_hasCycles.env) _hasCycles.env = new Set, _hasCycles.inside = false
    if (!_isArray(x)) return
    const inside = _hasCycles.inside
    _hasCycles.inside = true
    try {
      const m = _hasCycles.env
      if (m.has(x)) return true
      m.add(x)
      for (let i = 0; i < x.length; ++i)
        if (_hasCycles(x[i])) return true
      m.delete(x)
    }
    finally { _hasCycles.inside = inside, !inside && _hasCycles.env.clear() }
    // .env, .inside
  },

  _assignVarsIn(x) {
    if (!_hasCycles.env) _hasCycles.env = new Set, _hasCycles.inside = false
    if (_isVar(x)) return _assign(x, [_unknown, x])
    if (!_isArray(x)) return
    const inside = _hasCycles.inside
    _hasCycles.inside = true
    try {
      const m = _hasCycles.env
      if (m.has(x)) return
      m.add(x)
      x.forEach(_assignVarsIn)
    }
    finally { _hasCycles.inside = inside, !inside && _hasCycles.env.clear() }
  },

  string:{
    txt:`\`(string …Strings)\`: represents a string of characters, with the label not bound. Also written as \`'xyz'\` and \`"prequote""postquote"\`.
\`(string "a" "b")\`: strings inside will be joined (into \`"ab"\` here).`,
    examples:[
      [
        `"x"`,
        `"x"`,
      ],
      [
        `(a (string a) a:1)`,
        `(1 "1")`,
      ],
      [
        `(string "a" "b")`,
        `"ab"`,
      ],
      [
        `(string "sum is " (sum 1 2))`,
        `"sum is 3"`,
      ],
      // [
      //   `(f "hello there") f:(string "hello" R)→R`,
      //   `" there"`,
      // ],
      // [
      //   `(f "hello there") f:(string R "there")→R`,
      //   `"hello "`,
      // ],
      // [
      //   `(f "yZZZZxz") f:(string "y" R "xz")→R`,
      //   `"ZZZZ"`,
      // ],
    ],
    nameResult:[
      `joined`,
    ],
    merge:__is(`true`),
    // _assign(a,b) {
    //   if (!_isArray(a) || a[0] !== string || typeof b != 'string') return

    //   // Find the index of the sole non-string in a.
    //   let Rest = a.length
    //   for (let i = 1; i < a.length; ++i)
    //     if (typeof a[i] != 'string') {
    //       if (Rest < a.length) error("Two non-strings in an assigned-to array")
    //         // It is easiest to support only one non-escaped string in assigned-to arrays, and not fiddle with multiple results.
    //       Rest = i
    //     }

    //   // Assign strings.
    //   if (Rest > 2 || Rest < a.length-2) error("There must be only one concrete string before or after non-string")
    //   const start = Rest === 2 ? a[1].length : 0
    //   const end = b.length - (Rest === a.length-2 ? a[a.length-1].length : 0)
    //   if (end < start) error("The assigned string is too short")
    //   // Check that beginnings and ends coincide.
    //   if (Rest === 2 && a[1] !== b.slice(0, start)) error("String prefix is different")
    //   if (Rest === a.length-2 && a[a.length-1] !== b.slice(end)) error("String suffix is different")
    //   // Assign a[Rest]'s pattern to what's in between.
    //   return _assign(a[Rest], b.slice(start, end))
    // },
    call(...s) {
      if (s.length == 1 && typeof s[0] == 'string') return s[0]
      for (let i = 0; i < s.length; ++i) {
        const v = s[i] = _toString(s[i])
        if (typeof v != 'string') error('Not-a-string encountered when joining strings')
      }
      return s.join('')
    },
  },

  label:{
    txt:`\`(label Name)\`: represents a name that can be bound or assigned. Equal-name labels are bound to the same thing within the same binding.
Evaluating an unbound label results in \`(error)\`; evaluating a bound label results in its value, in the current function call.`,
    argCount:1,
    examples:[
      [
        `a a:1`,
        `1`,
      ],
      [
        `0 0 1 0 0`,
        `a a 1 a a a:0`,
      ],
      [
        `a a:(0 (a) a)`,
        `a a:(0 (a) a)`,
      ],
      [
        `x→(sum \`x\` 1)`,
        `x→(sum x 1)`,
      ],
    ],
    merge:__is(`true`),
    finish(l) { error("An unassigned label", (_isLabel(finish.v) && finish.v[1] === l) ? finish.v : l, "was evaluated") },
    call(name) {
      // Return a label array.
      if (!label.s) label.s = {}
      return label.s[name] || (label.s[name] = [label, name]) // Never collects garbage.
    },
  },

  _isLabel(v) { return _isArray(v) && v[0] === label && v.length == 2 },

  _promiseToDeferred(p) { const u = [_unknown, p]; u.push(p); return p },

  _unknown:{
    txt:`\`(_unknown Expr)\`: denotes that Expr is dependent on unknown factors and cannot be evaluated now, so it has to be deferred.
Unlike all other arrays, arrays with this as the head are mutable.
Unbound variables are unknown.
The internal mechanism for \`purify\` and recording and using the continuation of JS promises.
Check _isUnknown to materialize the inner structure only on demand.`,
    examples:[
      [
        `(_unknown 1)`,
        `(_unknown 1)`,
      ],
      [
        `a→(_unknown a)`,
        `id`,
      ],
    ],
    finish() { return finish.v },
  },

  _isUnknown(v) { return _isArray(v) && v[0] === _unknown },

  _isDeferred(v) { return _isUnknown(v) && v.length > 2 },

  _isPromise(v) { return v instanceof Promise },

  merge:{
    txt:`\`(merge Array)\`: Returns either a previously-created array content-equal to Array, or Array.
(Does not merge cycles.)`,
    nameResult:[
      `merged`,
    ],
    call(arr, indexes = undefined) {
      if (!_isArray(arr)) throw new Error("Expected an array for a content-based merge")
      if (!merge.contentToArr) merge.contentToArr = new Map

      // Don't even try to merge cycles.
      if (_id(arr, true, indexes) !== undefined)
        return arr
      // See if arr's content is in the global content-to-arr map.
      const m = merge.contentToArr, content = _contentString(arr, false, indexes)
      const r = _mapGetOrSet(m, content, arr)
      return r !== _notFound ? r : arr
    },
  },

  array:{
    txt:`\`(array …Items)\`: an array of items with semantically constant content.
If a function (\`Array\`'s head) defines \`merge\` to be \`true\`, then calls to this guaranteed-pure function (arrays of function-then-args) are merged.`,
    examples:[
      [
        `array sum 1 2`,
        `sum 1 2`,
      ],
    ],
    merge:__is(`true`),
    noInterrupt:true,
    call(...x) { return _maybeMerge(x) },
  },

  _maybeMerge(x) { return !_isArray(x) || !_shouldMerge(x) ? x : merge(x) },

  _shouldMerge(x) {
    if (_isArray(x) && !_isArray(x[0]) && defines(x, finish) === undefined && defines(x, call) === undefined && !_isVar(x)) return true
    return defines(x, merge) || !_hasCallableParts(x, true)
  },

  _wasMerged(x) {
    if (!_isArray(x)) return
    const content = _contentString(x, true)
    return content !== undefined && merge.contentToArr.get(content) === x
  },

  _mapGetOrSet(m, k, v, limit = 100000) {
    // Return m.get(k) if it's there, or m.set(k, v) and return _notFound if not. Limits map size.
    // (To reduce memory usage, find all uses of this function and reduce the limit.)
    if (m.has(k)) {
      v = m.get(k)
      if (m.size > (limit>>>1)) // Refresh recently-accessed items, so that limiting will evict least-recently-used and not first-added.
        m.delete(k), m.set(k, v)
      return v
    }
    m.set(k, v)
    _limitMapSize(m, limit)
    return _notFound
  },

  _notFound:{
    txt:`A marker for signifying the not-found state, returned from _mapGetOrSet.`,
  },

  _limitMapSize(m, n) {
    if (m.size > n) // Delete the first (least-recently-added) element.
      try { _deleteFirstMapElement.n = m.size-n;  m.forEach(_deleteFirstMapElement) }
      catch (err) { if (err !== null) throw err }
  },

  _deleteFirstMapElement(_v,k,m) { m.delete(k); if (!--_deleteFirstMapElement.n) throw null },

  _id:{
    txt:`Return the unique integer index of an object/value, possibly newly given.`,
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

  _contentString(arr, readonly = false, indexes = undefined) {
    // Return a string uniquely representing the contents of an array.
    if (!_contentString.a) _contentString.a = []
    const a = _contentString.a // Do not allocate new arrays each call, re-use the same empty one.
    try {
      for (let i = 0; i < arr.length; ++i) {
        const n = _id(arr[i], readonly, indexes)
        if (n === undefined) return
        // Encode 48-bit as 3 16-bit utf8 characters. If indexes get larger, we are in big trouble already.
        a.push(String.fromCharCode(n & 65535, (n>>>16) & 65535, ((n/65536)>>>16) & 65535))
      }
      return a.join('')
    } finally { a.length = 0 }
  },

  enumerableTypes:{
    txt:`A namespace for when/forany/forall/only/any/all, none of which we have found a use for, so far.`,
    lookup:{
      when:__is(`_when`),
      forany:__is(`_forany`),
      forall:__is(`_forall`),
      only:__is(`_only`),
      any:__is(`_any`),
      all:__is(`_all`),
    },
  },

  _when:{
    txt:`\`(_when LesserType GreaterType)\`: Returns a type describing when and which elements of Lesser are contained in Greater.
(_when A (_when B C)) is (_when (_when A B) C).
Here, we write (= 1) for (_only 1) — so, we have "=:_only":
For example, (_when (= 1) (= 1)) is (= 1); (_when (= 1) (= 2)) is (_any) — none.
For example, (_when (= 1) (_any (= 1) (= 2))) is (= 1); (_when (= 1) (_any (= 2) (= 3))) is (_any) — none.
For example, (_when (_any (= 1) (= 2) (= 3)) (_any (= 2) (= 3) (= 4))) is (_any (= 2) (= 3)).`,
  },

  _forany:{
    txt:`\`(_forany Type Property)\`: Returns a type describing when any element of Type satisfies a Property (a function from type to type).
(_forany A x→(_when x B)) is (_when A B).
Here, we write =1 for (_only 1):
For example, (_forany =1 x→(_when x =1)) is =1; (_forany =1 x→(_when x =2)) is (_any) — none.
Prove that any of (_any =1 =2 =3) contain 3: (_forany (_any =1 =2 =3) x→(_when =3 x)) is (_any (_when =3 =1) (_when =3 =2) (_when =3 =3)) is =3.
Prove that any of (_any  1 2 3) are 3::x (contain 3)… Become (_any  3::1  3::2  3::3), which becomes 3.
Prove that any of (_any  1 2) are 3::x… Become (_any  3::1  3::2), which becomes (_any).
Prove that any of (_all  1|2|3  3|4|5) are 3::x… Become (_all  3::1|2|3  3::3|4|5), which becomes 3.
Prove that any of (_all  1|2|3  4|5) are 3::x… Become (_all  3::1|2|3  3::4|5), which becomes (_any).`,
  },

  _forall:{
    txt:`\`(_forall Type Property)\`: Returns a type describing when all elements of Type satisfy a Property (a function from type to type).
Here, we write =1 for (_only 1):
For example, (_forall =1 x→(_when x =1)) is =1; (_forall =1 x→(_when x =2)) is (_any) — none.
Prove that all of (_any =1 =2 =3) contain 3: (_forall (_any =1 =2 =3) x→(_when =3 x)) is (_all (_when =3 =1) (_when =3 =2) (_when =3 =3)) is (_any) — no.
Prove that all of (_any  1|2|3  4|5) are 3::x… Become (_all  3::1|2|3  3::4|5), which becomes (_any).
Prove that all of (_all  1|2|3  4|5) are 3::x… Become (_any  3::1|2|3  3::4|5), which becomes 3.`,
  },

  _only:{
    txt:`\`(_only X)\`: A type of things ref-equal to X.`,
    // _assign(a,b) {
    //   // Demand ref-equality.
    //   if (_isArray(a) && a[0] === _only) a = a[1]
    //   if (_isArray(b) && b[0] === _only) b = b[1]
    //   return a === b ? a : array(error, "Not ref-equal")
    // },
    _when(lt, gt) {
      if (_isArray(lt) && lt[0] === _any)
        return _repack(lt, el => call(array(_when, el, gt)), _any)
      if (_isArray(lt) && lt[0] === _all)
        return _repack(lt, el => call(array(_when, el, gt)), _all)

      // (_when X (_only Y)) => (_when (_when (_only X) (_only Y)))
      const a = _isArray(lt) && lt[0] === _only && lt.length == 2 ? lt[1] : lt
      // (_when (_only X) Y) => (_when (_when (_only X) (_only Y)))
      const b = _isArray(gt) && gt[0] === _only && gt.length == 2 ? gt[1] : gt
      // (_when (_only X) (_only X)) => (_only X), (_when (_only X) (_only Y)) => (_any)
      return a === b ? (a===lt ? lt : b===gt ? gt : array(_only, a)) : _emptyAny
    },
    _forany(type, prop) { return call(array(prop, type)) },
    _forall(type, prop) { return call(array(prop, type)) },
  },

  _any:{
    txt:`(_any X Y Z …): A type of things that are either of type X, or of Y, or of Z. The order of types within does not matter.`,
    _when(lt, gt) { return _whenRepack(lt, gt, _any) },
    _forany(type, prop) { if (_isArray(type) && type[0] === _any) return _repack(type, prop, _any) },
    _forall(type, prop) { if (_isArray(type) && type[0] === _any) return _repack(type, prop, _all) },
    call(...x) { return _repack(x, undefined, _any, 0) },
  },

  _all:{
    txt:`(_all X Y Z …): A type of things that are of types X, and of Y, and of Z, all at once. The order of types within does not matter.`,
    _when(lt, gt) { return _whenRepack(lt, gt, _all) },
    _forany(type, prop) { if (_isArray(type) && type[0] === _all) return _repack(type, prop, _all) },
    _forall(type, prop) { if (_isArray(type) && type[0] === _all) return _repack(type, prop, _any) },
    call(...x) { return _repack(x, undefined, _all, 0) },
  },

  _repack(from, transformer, to, fromIndex=1) {
    // We managed to extract almost everything related to _any/_all into this function.
    if (from.length - fromIndex === 0) return to === _any ? _emptyAny : _emptyAll
    const a = to, b = a !== _any ? _any : _all
    // `from` must be an array.
    const already = new Set, onlys = new Set
    // (vwhen X (_any …Elems)) => (_any …(_when X Elem)) — iterate.
    let [i = fromIndex, result] = interrupt(_repack)
    try {
      for (; i < from.length; ++i) {
        const x = transformer !== undefined ? call(array(transformer, from[i])) : from[i]

        // Ignore cyclic parts of proofs (we get induction for free, then).
        if (x === cycle) continue

        // Simplify (_only X)s inside.
        if (_isArray(x) && x.length == 2 && x[0] === _only) {
          if (onlys.has(x[1])) continue // (_any (_only X) (_only X)) => (_any (_only X))
          if (!onlys.size || a === _any) onlys.add(x[1])
          else return _emptyAny // (_all (_only X) (_only Y)) => (_any)
        }

        // (_any … (_any) …) => (_any … …) — do not push. The equal gets ignored.
        if (_isArray(x) && x.length == 1 && x[0] === a) continue
        // (_any … (_all) …) => (_all) — break iteration. The opposite takes over.
        if (_isArray(x) && x.length == 1 && x[0] === b) return x

        if (already.has(x)) continue // No need to add definitely-equal things.
        already.add(x)
        if (!result) result = [a]
        result.push(x)
      }
    } catch (err) { if (err === interrupt) interrupt(_repack, 2)(i, result);  throw err }
    if (!result || result.length == 1) return to === _any ? _emptyAny : _emptyAll // (_any) => (_any)
    if (result.length == 2) return result[1] // (_any X) => X
    return _maybeMerge(result)
  },

  _whenRepack(lt, gt, side) {
    // The definition of (is X (_all …)) is exactly the same as (is X (_any …)), just with _any/_all changed around. They are symmetric in this regard.
    if (_isArray(gt) && gt[0] === side)
      return _repack(gt, elem => call(array(_when, lt, elem)), side)
    if (_isArray(lt) && lt[0] === side)
      return _repack(lt, elem => call(array(_when, elem, gt)), side)
  },

  _emptyAny:[
    __is(`_any`),
  ],

  _emptyAll:[
    __is(`_all`),
  ],

  Random:{
    txt:`Some functions for random number generation.`,
    lookup:{
      nat:__is(`randomNat`),
      prob:__is(`randomProb`),
    },
  },

  randomNat:{
    txt:`\`(randomNat Nat)\`: Picks a random non-negative integer less than n, from a uniform distribution.
An interface to JS's crypto.getRandomValues for generating random numbers on-demand as opposed to in-batches, optimizing to request the least amount of random bits required.
\`(randomNat 1)\` is 0.
\`(randomNat 2)\` is either 0 or 1.`,
    nameResult:[
      `random`,
      `nat`,
      `int`,
    ],
    argCount:1,
    call(n) {
      if (_isArray(n)) return n[randomNat(n.length)]
      n = _toNumber(n)

      if (n !== (n>>>0))
        throw 'Expected uint32 as limit of randomness'
      if (n === 0) return _randomBits()
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
      do { q0 = _randomBits(i) } while (q0 >= q1);
      return q0 % n
    },
  },

  randomProb:{
    txt:`\`(randomProb Probability)\`: Returns true with probability p, else false.
Equivalent to JS 'Math.random() < p' with checks on p (it should be 0…1), but (probably) faster.`,
    nameResult:[
      `passed`,
      `isOk`,
      `bool`,
    ],
    argCount:1,
    call(p) {
      p = _toNumber(p)
      
      if (typeof p != 'number') throw 'Expected a number'
      if (p < 0) throw 'Probability is too low: '+p;
      if (p > 1) throw 'Probability is too high: '+p;
      if (p !== p) throw 'Probability is NaN';
      if (p === 1) return true;
      while (true) {
        const n = Math.floor(p *= 16);
        if (p === n) { // No more precision left; decide now. Special cases of the `r < n` resulting check below.
          if (!n) return false; // 0000
          if (n === n >> 3 << 3) return !_randomBits(1); // 8 — X000
          if (n === n >> 2 << 2) return _randomBits(2) < (n >> 2); // 4, 12 — XX00
          if (n === n >> 1 << 1) return _randomBits(3) < (n >> 1); // 2, 6, 14 — XXX0
        }
        const r = _randomBits(4);
        if (r !== n) return r < n; // XXXX
        else p -= n; // 1/16 chance of continuing computation.
      }
      // Generating (up to) 4 bits at a time is not based on past performance measures, or anything.
      // Using 4 bits at a time consumes on average about double the bits that using 1 bit at a time would, but should be much faster.
    },
  },

  _countBits(n) { let x=0; while (n >>>= 1) ++x;  return x },

  _randomBits(n) { // Returns n || 32 random bits.
    impure()
    if (!n) {
      if (!_randomBits.a)
        Object.assign(_randomBits, { a:new Int32Array(1024), pos:1024 })
      if (_randomBits.pos >= _randomBits.a.length) _randomBits.pos = 0, _randomFill(_randomBits.a);
      return _randomBits.a[_randomBits.pos++];
    }
    if (n !== (n & 31)) throw 'Expected 0…31 bits to generate (where 0 is 32)';
    if (_randomBits.n === void 0) _randomBits.r = _randomBits.n = 0;
    let r = 0;
    if (n > _randomBits.n) r = _randomBits.r, n -= _randomBits.n, _randomBits.r = _randomBits(), _randomBits.n = 32;
    r = (r << n) | (_randomBits.r & ((1 << n) - 1)), _randomBits.n -= n, _randomBits.r >>>= n;
    return r;
  },

  _randomFill(buf) { // Fills a u/int-array or array-buffer with random data.
    impure()
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

  cycle:{
    txt:`Instead of never returning, pure infinite computations return \`cycle\` (and prevent caching until that node is fully returned from).`,
    examples:[
      [
        `f 1 f:1→(f 1)`,
        `cycle`,
      ],
      [
        `a a:(a)`,
        `(cycle)`,
      ],
    ],
  },

  finish:{
    txt:`\`(finish Expr)\`: Fully evaluates the expression — the interpreter loop, focused on re-using computation results and inlining and inferring everything.
Unless the computed code defines \`finish\`, provides eager override-checking semantics: finishes all dependencies before \`call\`ing or constructing Expr.

\`finish\` proceeds top-down, from what is needed to primitives; \`call\` proceeds bottom-up, making what is needed from primitives.
Each node will be evaluated only once during a function call, so graph bindings (\`… a:(…)\`) play the role of variables.
Cyclic computations return \`cycle\`, though cyclic structures construct a graph.`,
    nameResult:[
      `finished`,
    ],
    buzzwords:`staging, inlining, interpreted`,
    examples:[
      [
        `x->(y->1+y 2*x)`,
        `x→1+2*x`,
      ],
      [
        `Sum: (function  a  b  a+b)
  Mult: (function  a  b  a*b)
  x -> (Sum x (Mult x x))`,
        `x→x+x*x`,
      ],
      [
        `x->(x->x*x ((function a b a*a+b*b) 2 x))`,
        `x→(mult a a a:4+x*x)`,
      ],
    ],
    lookup:{
      inline:__is(`inline`),
    },
    philosophy:`When its definition is inlined, this is staging.
Technical details:
JS functions have array Expr spread across their args (with \`this\` being the zeroth arg, code).
In JS definitions of \`finish\` and \`call\`, finish.v is the currently-executing Expr.
finish.env is the current execution environment, created by _newExecutionEnv; put everything non-local there (keyed by _id of the relevant function).
Don't call this in top-level code directly — use \`_schedule\` instead.`,
    call(v) {
      if (v == null) return v
      if (_isUnknown(v)) return v

      // Cache, so that a common object is a variable, evaluated only once.
      const m = finish.env[_id(label)]
      if (m.has(v)) return m.get(v)
      if (finish.inFunction === 1 && _isVar(v)) return m.set(v, [_unknown, v]), m.get(v)
      m.set(v, cycle)

      try {
        let result
        try {
          if (!_isArray(v) || !v.length || v[0] === _const || v[0] === _var) return result = v
          let [finished, i = 0, record] = interrupt(finish)
          try {
            // Evaluate code.
            if (finished === undefined) {
              const code = finish(v[0])
              finished = _allocArray(), finished.length = v.length
              finished[0] = code
              for (let j = 1; j < v.length; ++j) finished[j] = v[j]
            }

            // Check if code defines evaluation (finishing).
            if (i === 0) {
              const code = finished[0]
              if (!_isArray(code) && typeof defines(code, finish) == 'function') {
                _checkArgCount(finished)
                try {
                  return finish.v = v, result = defines(code, finish).call(...finished)
                } catch (err) { if (err === impure) return result = [_unknown, finished];  throw result = err }
              }
            }

            // Allow cyclic structs.
            if (finished[0] !== rest && _isStruct(finished)) m.set(v, finished)

            // Evaluate the data.
            for (; i < finished.length; ++i) {
              const v = finished[i], wasVar = _isVar(v), wasRest = _isArray(v) && v[0] === rest && v.length == 2
              let r
              try {
                r = i > 0 ? (finished[i] = finish(v)) : v
              } catch (err) { if (err === impure) r = [_unknown, finished]; else throw result = err }
              if (r instanceof Promise) r = _promiseToDeferred(r)

              if (_isUnknown(r) && !_isDeferred(record)) record = !wasVar ? r : true
              else if (_isDeferred(r)) record = r
              else if (wasRest) {
                // Unroll `…Array`.
                if (!_isArray(r[1])) error("Expected an array to spread, got", r[1])
                finished.splice(i, 1, ...r[1]), i += r[1].length
              }
            }

            // Do not call structs.
            if (finished[0] !== rest && _isStruct(finished)) return result = finished

            // fast.parse can execute arbitrary things, so we limit that data format to our public interface.
            if (finish.noSystem && lookup.parents.get(finished[0]) === System) error(`Tried to execute a system function`)

            // If nothing is deferred but something is unknown, and the function is user-defined, then we have a choice on whether to inline the function.
              // In the worst case, inlining could almost double the total body size on each inlining, but this is suitable for a REPL.
            const doInline = record && !_isDeferred(record) && typeof finished[0] == 'function' && defines(finished[0], inline) && _canInline(finished) && true

            // Do the call with evaluated args.
            if (!record || doInline)
              try { return finish.v = v, _checkArgCount(finished), result = call(finished, true), result }
              catch (err) { if (err !== impure) throw result = err }

            // Record the call.
            _cameFrom(finished, v)
            if (!record || record === true) record = [_unknown, finished]
            for (let k = 0; k < finished.length; ++k) {
              const v = finished[k]
              if (!_isUnknown(v)) finished[k] = quote(v)
              else v !== record && v.length > 2 && record.push(...v.slice(2)), finished[k] = v[1]
            }
            return record[1] = finished, result = record
          } catch (err) { if (err === interrupt) interrupt(finish, 3)(finished, i, record);  throw err }
        } finally {
          if (result !== interrupt) _cache(m, v, result)
          if (result instanceof Promise) return _promiseToDeferred(result)
        }
      } catch (err) { if (err === interrupt) m.delete(v);  throw err }
      // .env (our current environment), .v (our currently-interpreted value), .pure (whether we are in `purify`), .inFunction (0 if not purifying a function, 1 if in args, 2 if in body), .noSystem (for fast.parse)
    },
  },

  _isUnknownRest(v) {
    return _isArray(v) && v[0] === _unknown && _isArray(v[1]) && v[1][0] === rest
  },

  _canInline(v) {
    // If there are any (_unknown (rest …)) inside the array v, returns false (because then we can't know which var gets assigned to which).
    for (let i = 1; i < v.length; ++i) if (_isUnknownRest(v[i])) return false
    return true
  },

  call:{
    txt:`\`(call (…Values))\`: Applies the first value (the function) to the rest of values. Evaluates the array of function then its arguments, assuming its parts are already evaluated.
Overriding this allows function application. In fact, \`F:(function …)\` is the same as \`(concept (map call F))\`.
Caches results of pure functions.`,
    nameResult:[
      `result`,
    ],
    lookup:{
      cycle:__is(`cycle`),
    },
    call(v, freeV = false) {
      if (!_isArray(v)) throw "Expected an array"
      _checkInterrupt(v)
      let r = defines(v, call)
      if (typeof r == 'function') return r = r.call(...v), freeV && _allocArray(v), r
      return v
      // .cache (a Map from calls to results), .impure (whether the result must not be cached), .ID (current job ID), .locked (to not expose intermediate caches to other jobs)
    },
  },

  defines:{
    txt:`\`(defines Data Code)\`: Gets the definition by Data of Code.
It's either a function or undefined, and has to be applied or ignored respectively (_getOverrideResult) to get the actual overriden value.

Array data gets its head consulted (once, not recursively). A function acts like a concept that defined \`call\` as that function. A JS object with a Map \`defines.key\` consults that map with Code as the key.`,
    philosophy:`Culture is polite fiction made for efficiency, and so are programming languages. At some point, you have to define things with no deeper explanation.`,
    call(data, code) {
      if (code === call && typeof data == 'function') return data
      if (code === call && _isArray(data) && typeof data[0] == 'function') return data[0]

      const d = _view(data)
      return d ? d[_id(code, true)] : undefined
    },
  },

  _view:{
    txt:`\`(_view Concept)\`: returns the view of Concept, used to look up things in it.`,
    call(data) {
      if (_isArray(data)) data = data[0]
      return data ? data[defines.key] : undefined
    },
  },

  _checkArgCount(a) {
    if (_isArray(a) && !_isArray(a[0]) && _view(a[0]) && _view(a[0])[_id(argCount)] !== undefined) {
      const args = _view(a[0])[_id(argCount)]
      if (typeof args == 'number' ? a.length-1 !== args : !args(a.length-1))
        error("Invalid arg count: expected", args, "but got", a.length-1, "in", a)
    }
  },

  _cache(m, expr, result) {
    // Caches result unless in a cycle (cannot cache until all cycle-parents are done evaluating).
    if (_isUnknown(result)) return m.delete(expr)
    if (!m.until || (m.until.delete(expr), !m.until.size))
      m.set(expr, result)
  },

  _maybeUncache(m, expr) {
    const v = _mapGetOrSet(m, expr, cycle)
    if (v !== cycle) return v
    // Prevent premature caching of cycle-dependent results in computation.
    if (!m.until) m.until = new Set
    m.until.add(expr)
    return v
  },

  concept:{
    txt:`\`(concept View)\`: Creates an object that defines some things (via a map).
Concepts are used to give each function a free extensibility point.
Rather than co-opting strings and files (duck typing, docstrings, documentation, READMEs) to convey parts of a concept, refer to defined functionality directly.
Try to use this only as explicitly suggested by functions.
Views and non-_unknown arrays are considered immutable.`,
    examples:[
      [
        `(sum 2 (concept (map sum (function a b 3))))`,
        `3`,
      ],
    ],
    argCount:1,
    lookup:{
      defines:__is(`defines`),
      overridable:__is(`overridable`),
    },
    call(view) {
      if (!(view instanceof Map)) throw "The view must be a Map"
      if (!concept.idToKey) concept.idToKey = Object.create(null) // We don't ever free anything from here.
      const d = Object.create(null)
      view.forEach((v,k) => (d[_id(k)] = v, concept.idToKey[_id(k)] = k))
      Object.freeze(d)
      if (typeof d[_id(call)] != 'function') return {[defines.key]:d}
      const proxy = function called(...args) { return called[defines.key][_id(call)].apply(this, args) }
      proxy[defines.key] = d
      Object.freeze(proxy)
      return proxy
      // concept.idToKey (an object)
    },
  },

  overridable:{
    txt:`\`(overridable Function)\`: creates a function that checks whether any input defines it, otherwise calls the base Function.`,
    argCount:1,
    call(f) {
      if (typeof f != 'function') throw "Expected a function"
      const impl = function overridable(...v) {
        // See if any data defines code; use that as our result if so.
        let [i = 0] = interrupt(overridable)
        try {
          if (_isArray(v)) {
            let r
            for (; i < v.length; ++i)
              if (typeof (r = defines(v[i], this)) == 'function')
                if ((r = r.call(...v)) !== undefined)
                  return r
            return f.apply(this, v)
          }
          throw "What?!"
        } catch (err) { if (err === interrupt) interrupt(overridable, 1)(i);  throw err }
      }
      const d = impl[defines.key] = Object.create(null)
      if (_view(f))
        Object.assign(d, _view(f))
      d[_id(deconstruct)] = array(overridable, f)
      if (defines(f, merge))
        d[_id(merge)] = true
      if (defines(f, argCount) !== undefined)
        d[_id(argCount)] = defines(f, argCount)
      return impl
    },
  },

  map:{
    txt:`\`(map Key Value Key Value …Rest)\`: a key-value store.
The array-representation of a JS Map.
Read keys with \`lookup\`.`,
    merge:__is(`true`),
    call(...kv) {
      // Construct a Map.
      const m = new Map
      for (let i = 0; i < kv.length; i += 2) {
        const k = kv[i]
        if (m.has(k)) error('Duplicate key', k, 'in', m)
        m.set(k, kv[i+1])
      }
      return m
    },
  },

  deconstruct:{
    txt:`\`(deconstruct Object)\`: turn an object into its array-representation (that could be evaluated to re-create that native value).`,
    call(v, allowPath = true) {
      const vv = _view(v) // Override `deconstruct` on a created-from-expr value (like in `function`).
      if (vv && vv[_id(deconstruct)]) v = vv[_id(deconstruct)]
      else if (_isArray(v)) return quote(v)

      if (allowPath && lookup.parents.has(v)) {
        const p = lookup.parents.get(v)
        if (defines(p, lookup))
          for (let k of lookup(p))
            if (lookup(p, k) === v) return array(lookup, p, k)
        if (_view(p))
          for (let k of Object.keys(_view(p)))
            if (k !== _id(deconstruct) && _view(p)[k] === v)
              return array(defines, p, concept.idToKey[+k])
      }

      if (typeof document != ''+void 0) {
        // Not precise at all.
        if (v instanceof Element) return array(elem, v.tagName.toLowerCase(), [...v.childNodes].map(ch => deconstruct(ch)))
        if (v instanceof Node) return v.textContent
      }

      if (_isArray(v) && !_isVar(v)) return v.slice()
      if (v instanceof Map) {
        const arr = [map]
        v.forEach((v,k) => arr.push(quote(k), quote(v)))
        return arr
      }
      if (v && v[defines.key]) {
        // Deconstruct a Map, treating self-references specially.
        const arr = [map], d = v[defines.key]
        Object.keys(d).forEach(k => {
          const val = d[k]
          val === v ? arr.push(quote(concept.idToKey[+k]), _unevalFunction(v)) : arr.push(quote(concept.idToKey[+k]), quote(val))
        })
        if (typeof v == 'function') arr.push(call, _unevalFunction(v))
        return array(concept, arr)
      }
      if (typeof v == 'function')
        return _unevalFunction(v)
      if (v === undefined)
        return [concept, new Map([[txt, `A marker that represents the lack of a conceptual definition or a value.`]])]
      if (!v || typeof v != 'object')
        return v
      const arr = [map]
      Object.keys(v).forEach(k => arr.push(k, quote(v[k])))
      return arr
    },
  },

  _unevalFunction(f) {
    const ctx = jsEval.ctx in f ? f[jsEval.ctx] : defines(Self, lookup)

    // Remove unnecessary whitespace.
    let src = (''+f).split('\n')
    const ws = /^\s*/.exec(src[src.length-1])[0]
    src = src.map(line => line.replace(ws, '')).join('\n')
    src = src.replace(/^[_a-zA-Z]+/, '')
    try { Function('('+src+')') }
    catch (err) { src = 'function'+src }

    return ctx !== undefined ? array(jsEval, src, ctx) : array(jsEval, src)
  },

  _isValidJS(s) {
    // A terrible abuse of the Function constructor, but it *is* the only easy and most correct option.
    try { Function(s); return true } catch (err) { return false }
  },

  _isValidIdentifier(s, varName = false) { // For JS.
    return typeof s == 'string' && s && (!varName && /^[a-zA-Z]+$/.test(s) || !/\s/.test(s) && _isValidJS('let '+s+'=('+s+')\ntry{}catch('+s+'){}'))
  },

  jsEval:{
    txt:`Finishing \`(jsEval Source Ctx)\`: evaluates (strict-mode) JS source code that can statically reference values of Ctx (a map) with JS-identifier keys.`,
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
    finish(src, ctx) {
      // Finish ctx (with arbitrary dependencies) ourselves.
      if (!jsEval.compiled) jsEval.compiled = new WeakMap, jsEval.ctx = Symbol()
      impure()

      // Use options: `{ statementSeparator(){…}, newName(i){…}, exprToSrc(expr), newVar(name, src){…}, scoped(src){…}, return(name){…}, backpatchable(){…}, backpatch(name, src){…}, cacheCompiled(mapName, ofName, varName){…}, link(args, body, filename, structuredBody){…} }`.
      const opt = {
        //debugStructure: struct => log(structured(struct)),
          // Example body:
          // 'use strict'
          // const a=(x=>x)
          // ⴵ0.set(ⴵ2,a) // Associate original with its compiled code.
          // const ⴵ1=(b=>a(12)+b)
          // ⴵ0.set(ⴵ3,ⴵ1)
          // return ⴵ1
        statementSeparator() { return '\n' },
        newName(i) { return ['ⴵ'+i.toString(36)] },
        oldName(name) { return [name] },
        exprToSrc(expr) { return finish(expr) },
          // For the JS case, we probably want this to also treat `jsEval …` as instructions to compile… How?
          // Also, we probably want it to fulfill the role of `funcCode`.
        newVar(name, src) { return ['const ', name, '=', [src]] },
        scoped(src) { return ['(()=>{', src, '\n})()'] },
        return(name) { return ['return ', name] },
        backpatchable() { return 'function ⴵ(...a){return ⴵ.ⴵCODE.apply(this,a)}' },
        backpatch(name, src) { return [name, '.ⴵCODE=', [src]] },
        cacheCompiled(mapName, ofName, varName) { return [mapName, '.set(', ofName, ',', varName, ')'] },
        // Maybe also have sourceMap(value, filename, start:{line,offset, index}, end:{line,offset, index})?
        newFilename() { return 'ⴵFILENAME' },
        link(args, body, filename, struct) {
          return Function(...Object.keys(args), filename ? body + '\n//# '+filename : body)(...Object.values(args))
        },
      }

      // Maybe, by using a configurable language, this could be an arbitrary-imperative-language compiler.

      function highlightRefs(s, env) {
        // Just some approximation. Hope there are no string and comments with vars.
        const a = [s], keys = Object.keys(env)
        for (let i = 0; i < a[a.length-1].length; ++i) {
          const last = a[a.length-1]
          for (let j = 0; j < keys.length; ++j)
            if (last.slice(i, i+keys[j].length) === keys[j]) {
              a.pop(), a.push(last.slice(0,i), env[keys[j]], last.slice(i+keys[j].length))
              i = -1
              break
            }
        }
        return a
      }
      function funcCode(f) {
        // This is language-specific too.
        let s = f+')'
        if (_isValidJS('('+s)) return '('+s
        if (_isValidJS(s = '(function '+s)) return s
        throw "Not a syntactically-correct function: "+f
      }

      const args = Object.create(null), body = ["'use strict'"]
      let env = Object.create(null), backenv = new Map
      const backpatch = new Map
      function sep() { return opt.statementSeparator() }
      let n = 0
      function newName() { return opt.newName(n++) }
      function alloc(v) { const n = newName(); args[n] = v, env[n] = opt.oldName(n); return n }
      const m = jsEval.compiled
      const jsEvalCompiledName = alloc(m)
      function pushCompiledRemembrance(func, name) {
        body.push(sep(), opt.cacheCompiled(jsEvalCompiledName, alloc(func), name))
      }
      function claim(func, name) {
        env[name] = opt.oldName(name)
        backenv.set(func, name)
      }
      function compile(func, name) {
        // Ensure that `func` is available as `name` in code that is pushed to `body` after this.

        if (!name && backenv.has(func)) return backenv.get(func)
        if (!name) name = newName()
        if (name in env) name = env[name]

        // If not (jsEval …), or already compiled, just pass it (or its compiled code) through as an arg.
        if (!_isArray(func) || func[0] !== jsEval || m.has(func)) {
          if (m.has(func)) func = m.get(func)
          const prev = name
          name = alloc(func)
          body.push(sep(), opt.newVar(prev, name))
          claim(func, prev)
          return name
        }

        // If in a cycle, emit a backpatchable function (then backpatch it when its context is fully ready).
        if (backpatch.has(func)) {
          backpatch.set(func, name)
          claim(func, name)
          body.push(sep(), opt.newVar(name, opt.backpatchable()))
          pushCompiledRemembrance(func, name)
          return name
        }
        backpatch.set(func, null)

        let oldEnv, oldName, oldEnd

        // Compile context then push src.
        const ctx = func[2]
        if (ctx instanceof Map)
          ctx.forEach((v,k) => {
            if (!_isValidIdentifier(k)) return
            if (v !== func) compile(v,k)
          })
        else if (_isArray(ctx) && ctx[0] === map) {
          // Ctx is unFinishing, so we could link potentially-circular jsEval dependencies ourselves.
          for (let i = 1; i < ctx.length; i += 2) {
            const ke = ctx[i], ve = ctx[i+1]
            let k
            if (_isArray(ke) && ke[0] === jsEval && ke !== func)
              compile(ke)
            else
              k = finish(ke),
              k = _isValidIdentifier(k) ? k : undefined
            if (k && k in env && !oldEnv) {
              // If a key conflicts, change the name and escape into a hidden function.
              oldEnv = env, env = Object.create(null)
              oldName = name, name = newName()
              oldEnd = body.length
            }
            if (_isArray(ve) && ve[0] === jsEval) {
              if (ve !== func)
                k && (env[k] = opt.oldName(k)),
                compile(ve, k)
            } else
              k && (env[k] = opt.oldName(k)),
              compile(finish(ve), k)
          }
        } else if (ctx === undefined)
          ; // Nothing to compile before func.
        else throw "Function context must be either undefined or a Map or (map …)"

        let src = funcCode(func[1])
        if (opt.debugStructure) src = highlightRefs(src, env)
        if (backpatch.get(func))
          body.push(sep(), opt.backpatch(backpatch.get(func), src))
        else
          body.push(sep(), opt.newVar(name, backenv.has(func) ? backenv.get(func) : src)),
          claim(func, name),
          pushCompiledRemembrance(func, name)

        if (oldEnv) body.push(sep(), opt.return(name)), body.push(sep(), opt.newVar(oldName, opt.scoped(body.splice(oldEnd)))), env = oldEnv
        backpatch.delete(func)
        return name
      }
      function deepJoin(body) {
        if (_isDOM(body)) return body.textContent
        if (_isArray(body))
          return body.map(deepJoin).join('')
        return String(body)
      }
      body.push(sep(), opt.return(compile(array(jsEval, src, ctx))))
      opt.debugStructure && opt.debugStructure(body)
      const linked = opt.link(args, deepJoin(body), opt.newFilename(), body)
      if (typeof linked == 'function') linked[jsEval.ctx] = ctx
      return linked
    },
  },

  instanceof:{
    txt:`This exists only to highlight a thing in js.`,
  },

  continue:{
    txt:`This exists only to highlight a thing in js.`,
  },

  break:{
    txt:`This exists only to highlight a thing in js.`,
  },

  finally:{
    txt:`This exists only to highlight a thing in js.`,
  },

  typeof:{
    txt:`This exists only to highlight a thing in js.`,
  },

  return:{
    txt:`This exists only to highlight a thing in js.`,
  },

  throw:{
    txt:`This exists only to highlight a thing in js.`,
  },

  catch:{
    txt:`This exists only to highlight a thing in js.`,
  },

  while:{
    txt:`This exists only to highlight a thing in js.`,
  },

  void:{
    txt:`This exists only to highlight a thing in js.`,
  },

  else:{
    txt:`This exists only to highlight a thing in js.`,
  },

  for:{
    txt:`This exists only to highlight a thing in js.`,
  },

  let:{
    txt:`This exists only to highlight a thing in js.`,
  },

  new:{
    txt:`This exists only to highlight a thing in js.`,
  },

  switch:{
    txt:`This exists only to highlight a thing in js.`,
  },

  case:{
    txt:`This exists only to highlight a thing in js.`,
  },

  js:{
    txt:`A namespace of everything pertaining to the host language, JavaScript.
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
        u = bound(u, x => serialize.backctx.has(x) ? serialize.backctx.get(x) : undefined)
        if (typeof uneval != ''+void 0) u = [jsEval, uneval(u)]
        else u = [jsEval, JSON.stringify(u)]
      }
      if (typeof document == ''+void 0) {
        if (u.length != 2) throw "Wrong count of args for JS code"
        match(u[1])
        return
      }
      const special = / ⴲ[0-9a-zA-Z]+ /g, str = u[1], ctx = call(u[2])
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
  },

  _test(env) {
    let failed = 0, finished = 0, total = 0

    // Run all examples to make sure that they indeed evaluate to what we have specified.
    const done = new Set
    parse.ctx.forEach(v => {
      if (_isArray(v) || done.has(v)) return
      done.add(v)
      const r = defines(v, examples)
      if (_isArray(r))
        r.forEach(a => {
          if (!_isArray(a)) return
          const [code, becomes] = a
          if (typeof code != 'string' || typeof becomes != 'string') return
          eq(code, becomes)
        })
    })

    function eq(a,b) {
      if (b === undefined) [a,b] = a instanceof Array ? a[0].split('=') : a.split('=')
      ++total
      try {
        a = parse(a)[0], b = parse(b)[0]

        const s = lookup(fast, 'serialize')(a, undefined, true)
        const p2 = lookup(fast, 'parse')(s)
        const s2 = lookup(fast, 'serialize')(p2, undefined, true)
        s !== s2 && error('Fast serialize and s-p-s are not equal:', s+'\n'+s2, '\n', serialize(a), '\n', serialize(p2))

        _schedule(a, _newExecutionEnv(env), result => {
          ++finished
          try {
            const ss = structuredSentence
            const B = serialize(b)
            if (!_isArray(result) || result[0] !== jsRejected) {
              const A = serialize(result)
              if (A !== B) ++failed, log(ss('Not equal:')), log(ss('a'), a, ss('⇒')), log(ss('A'), result, ss('≠')), log(ss('b'), b)
            } else {
              ++failed, log(ss('Got an error'), ...result.slice(1)), log(ss('a'), a), log(ss('b'), b)
            }
            if (finished === total && failed)
              log(ss('Failed {' + failed+'/'+total + '} tests.'))
          } catch (err) { ++failed, log(jsRejected(err)) }
        })
      }
      catch (err) { ++failed, log(jsRejected(err)) }
    }
  },

  _onlyUndefined:{
    txt:`To be used with \`bound\` when \`ctx\` is a function. A marker that we do want to bind to undefined; exists to escape the "returning undefined means no explicit binding". (Currently not used anywhere.)`,
  },

  bound:{
    txt:`Finishing \`(bound Expr Ctx)\`: When called, returns a copy of Expr with all keys bound to values in Ctx, as if copying then changing in-place. When evaluated, also evaluates the result.
Inner contexts are always bound first.
Can be written as \`key:value\` in an array to bind its elements: \`(a b a:0 b:1)\` is \`(0 1)\`, \`a a:(0)\` is \`(0)\`. Can be used to give cycles to data, and encode graphs and multiple-parents in trees.
If Ctx returns non-undefined, its result won't be recursively bound unless cyclic.
\`(bound a (map ^a 1))\` becomes 1, as does \`a a:1\`.
If Ctx is a function, this acts as a rewrite: \`(bound (a b) x→(array sum x 1))\` evaluates \`(((a+1) (b+1))+1)\`.
On finish, finishes Ctx first, then binds Expr, then finishes Expr; finishes the bound Expr to Finishing Ctx.`,
    examples:[
      [
        `(bound 0 (map 0 1))`,
        `1`,
      ],
      [
        `a:1 (a a:2) (a b) (a:3 a) b:4`,
        `(2) (1 4) (3)`,
      ],
    ],
    nameResult:[
      `rewritten`,
      `expr`,
      `copy`,
    ],
    argCount:2,
    finish(v, ctx, cyclic) {
      // On finish, finish ctx, bind, then finish the bound expr.
      // return finish(bound(v, finish(ctx), finish(cyclic))), but interrupt-safe.
      // An optional third true-by-default boolean argument is true to also bind Ctx values (allowing cycles) or false to not (performing just a substitution).
      let [stage = 0, a, b] = interrupt(bound)
      try {
        switch (stage) {
          case 0: a = finish(ctx), stage = 1
          case 1: b = finish(cyclic), stage = 2
          case 2: a = bound(v, a, b), stage = 3
          case 3: return finish(a)
        }
      } catch (err) { if (err === interrupt) interrupt(bound, 3)(stage, a, b);  throw err }
    },
    call(v, ctx, cyclic = true, env, rewrite) {
      if (typeof cyclic != 'boolean') throw "`cyclic` must be a boolean"
      if (!(ctx instanceof Map) && typeof ctx != 'function') throw "`ctx` must be a Map or a function"
      if (rewrite !== undefined && typeof rewrite != 'function') throw "`rewrite` must be undefined or a function"
      bound.ctx = ctx, bound.cyclic = cyclic, bound.env = env, bound.rewrite = rewrite

      if (!bound.cache) bound.cache = new Map, bound.inside = false, bound.innerCtxs = []
      if (!bound.env) bound.env = bound.cache
      try { return _doBinding(v) }
      finally { bound.cache.clear() }
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
    if (_isArray(v) && (v[0] === _const || v[0] === _var)) return v
    // Copy the array and bind its parts.
    if (_isArray(v)) {
      let copy, changed = false, pushedCtx = false
      try {
        if (v[0] === bound && v.length == 3 && v[2] instanceof Map) {
          bound.innerCtxs.push(v[2]), pushedCtx = true
          const inner = v[1]
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
          return v // Delay to `finish`, so that inner bindings have more priority.
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
      if (_isArray(copy) && (copy[0] === _const || copy[0] === _var)) return copy
      copy = changed ? _maybeMerge(copy) : v // This doesn't actually merge cycles.
      bound.env.set(v, v = !bound.rewrite ? copy : bound.rewrite(copy))
    }
    return v
  },

  unbound:{
    txt:`\`(unbound Expr)\`: Eliminates cycles in (a copy of) Expr by inserting \`(bound Expr (map …Bindings))\` with keys in the copy.`,
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
      maxDepth = _toNumber(maxDepth)
      let depth = 0
      markParents(x, 0, x)
      liftChildDependencies(x)
      const children = new Map
      invertParents(x)
      const names = new Map
      return noCycles(unbindChildren(x))

      function preserve(x) { return _isLabel(x) || _isStylableDOM(x) || typeof x == 'number' }
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
      function unbindChildren(x, ignoreName = false) {
        if (!ignoreName && names.has(x)) return names.get(x)
        if (!ignoreName && unenv.has(x)) return unenv.get(x) === unbindChildren && unenv.set(x, x.slice()), unenv.get(x)
        if (preserve(x)) return x
        if (!_isArray(x)) return x
        const ch = children.get(x)
        children.delete(x)
        let copy
        if (ch) {
          const ctx = new Map
          copy = [bound, x, ctx]
          unenv.set(x, copy)
          for (let i = 0; i < ch.length; ++i) {
            let name
            while (!name || currentAncestors.has(name))
              name = nameAllocator(ch[i], undefined)
            if (typeof name == 'string') name = [label, name]
            currentAncestors.add(name)
            names.set(ch[i], name)
          }
          for (let i = 0; i < ch.length; ++i)
            ctx.set(names.get(ch[i]), unbindChildren(ch[i], true))
          if (!ignoreName && names.has(copy[1]))
            copy[1] = names.get(copy[1])
          else
            copy[1] = unbindChildren(copy[1], true)
        } else {
          if (_isVar(x)) return x
          let changed = false
          unenv.set(x, unbindChildren)
          for (let i = 0; i < x.length; ++i) {
            const v = unbindChildren(x[i])
            if (v !== x[i]) {
              if (!changed) {
                copy = unenv.get(x) !== unbindChildren ? unenv.get(x) : x.slice()
                changed = true
                unenv.set(x, copy)
                _cameFrom(copy, x)
              }
              copy[i] = v
            }
          }
          if (!changed) copy = x, unenv.set(x, x)
        }
        if (ch) // Deallocate spots for children.
          ch.forEach(c => (nameAllocator(undefined, names.get(c)), currentAncestors.delete(names.get(c))))
        return copy
      }
      function noCycles(x) {
        // Throw if x has cycles.
        if (!noCycles.s) noCycles.s = new Set
        if (noCycles.s.has(x)) throw "Cycles"
        noCycles.s.add(x)
        if (x instanceof Map) x.forEach(v => v !== x && noCycles(v))
        if (_isArray(x)) x.forEach(noCycles)
        noCycles.s.delete(x)
        return x
      }
    },
  },

  error:{
    txt:`\`(error …Causes)\`: throws an error when executed, containing useful information as to its likely cause.
Indicates a bug in the code, and is mostly intended to be presented to the user.`,
    examples:[
      [
        `((error 'x'))`,
        `(error 'x')`,
      ],
      [
        `sum 1 (error 'bad stuff')`,
        `(error 'bad stuff')`,
      ],
      [
        `sum (mult 3 (error 'uh')) 2`,
        `error 'uh'`,
      ],
    ],
    lookup:{
      jsRejected:__is(`jsRejected`),
      fast:__is(`errorFast`),
      in:__is(`errorIn`),
      stack:__is(`errorStack`),
    },
    merge:__is(`true`),
    call(...msg) { throw array(error, ...msg) },
  },

  errorFast:{
    txt:`Faster error-throwing, for things unlikely to be shown to the user.`,
    call() { if (!errorFast.e) errorFast.e = error(`An error has occured.`);  throw errorFast.e },
  },

  errorIn:{
    txt:`Adds slightly more information to an error.`,
    call(...msg) { throw array(error, ...msg, 'in', finish.v) },
  },

  errorStack:{
    txt:`Adds the execution stack to the raised error.`,
    call(...msg) { throw array(error, ...msg, 'at', _resolveStack()) },
  },

  _resolveStack:{
    txt:`If lines are marked, this resolves the JS stack trace to the network's functions.`,
    call(stack = new Error().stack || '') {
      return stack.trim().split('\n').map(L => {
        const loc = /(?: \(|@)(.+):(\d+):(\d+)\)?$/.exec(L)
        if (!loc) return L
        const sourceURL = loc[1]
        let main = Initialize
        if (_resolveStack.functions[sourceURL]) {
          main = _resolveStack.functions[sourceURL]
        }
        // Else look up globals' lines.
        const line = +loc[2], column = +loc[3]
        const lines = main.lines
        if (lines) {
          for (let i = 0; i < lines.length; i += 2)
            if (lines[i] >= line) break
          const sub = lines[i-1]
          if (main === Initialize && typeof sub == 'function') {
            const localLine = line - lines[i-2], str = _unevalFunction(sub)[1].split('\n')[localLine]
            return [sub, str.slice(0, column) + '/* here */' + str.slice(column)]
          } else
            return [main, sub]
        }
        return loc[1]+':'+loc[2]+':'+loc[3]
      })
      // .functions (an object from sourceURL to function with .lines)
    },
  },

  _isError(v) { return _isArray(v) && v[0] === error },

  _funcPlaceholder:{
    txt:`An implementation detail of \`function\`. Do not use.`,
  },

  closure:{
    txt:`\`(closure Function)\`: makes Function into a closure — names existing in a containing function will be bound by the outer function when a closure is created.
With binding, the actual definition can be outside of the function (particularly if equal-structure closures in different functions are merged) (even though the interface copies closure definitions into each serialized-to-DOM case), so actually separating closures semantically is required. \`var\` can be used to highlight the same variable on parsing.
Uses \`bound\`, and partially-evaluates the result before returning.
Can be written as \`!Function\`.`,
    examples:[
      [
        `(a→(closure a→12) 13)`,
        `13→12`,
      ],
      [
        `(a → !a→12 13)`,
        `13→12`,
      ],
      [
        `(a→!a→!a→12 13)`,
        `13→!13→12`,
      ],
    ],
    finish(f) {
      // Close over the current label-environment, by binding f's body.
      impure()
      if (!_isArray(f) || f[0] !== _function) return
      const [b = _bindFunc(f, finish.env[_id(label)])] = interrupt(closure)
      try { return finish(b) }
      catch (err) { if (err === interrupt) interrupt(closure, 1)(b);  throw err }
    },
  },

  _bindFunc:{
    txt:`Binds only the function body, with either a Map or a replacing function.`,
    call(f, ctx, rewrite) {
      let escaping = true
      const binder = x => {
        // Look up in regular env.
        if (ctx instanceof Map) {
          if (ctx.has(x)) return quote(ctx.get(x))
        } else if (ctx) {
          const r = ctx(x)
          if (r !== undefined) return r
        }
        // Don't go into funcs unless they are closed over (nor into quotes).
        if (!escaping && _isFunc(x) || _isArray(x) && x[0] === quote) return x
        else if (x === closure || _isArray(x) && x[0] === closure) escaping = true
        else escaping = false
      }
      return bound(f, binder, false, undefined, rewrite)
    },
  },

  _isFunction(x) { return typeof x == 'function' && _isArray(defines(x, deconstruct)) && defines(x, deconstruct)[0] === _function },

  _function:{
    txt:`\`Input→Output\` or \`(function …Inputs Output)\`: an arbitrary transformation of inputs into output. It can be called (like \`(f …Data)\`), which assigns …Inputs to …Data (setting variables), and evaluates the function body (Output).
Equal input variables must be ref-equal (so \`f f:(function x x 0)\` accepts \`(f 0 0)\` and \`(f 1 1)\`, but not \`(f 0 1)\`).
Variables within non-\`closure\` functions will not be changed by application.`,
    buzzwords:`graph pattern matching`,
    examples:[
      [
        `(a b)→b`,
        `(function (a b) b)`,
      ],
      [
        `(function a a)`,
        `id`,
      ],
      [
        `a->b`,
        `a→(error 'An unassigned label' b 'was evaluated')`,
      ],
      [
        `(f "hi") f:a→a`,
        `"hi"`,
      ],
      [
        `(f "1" f:x→(f x))`,
        `cycle`,
      ],
      [
        `(f 1 2) f:(function 1 3 5)`,
        `(error 3 'cannot be assigned' 2)`,
      ],
      [
        `x->((function 0 1 2 3) x 1 2)`,
        `0→3`,
      ],
      [
        `x->((function 0 1 2 3) x+1 1 2)`,
        `x->((function 0 1 2 3) x+1 1 2)`,
      ],
      [
        `x->((function (1 2 t t) 3 4 5) x 3 4)`,
        `(1 2 x x x:?)→5`,
      ],
      [
        `^a->b ^c  a:(a b)  c:(c 10)`,
        `10`,
      ],
      [
        `x->a a:(0 x a) 5`,
        `a a:(0 5 a)`,
      ],
      [
        `function x y ((function a a 0) (0 1 x) (0 y 2)) x:? y:?`,
        `function 2 1 0`,
      ],
    ],
    merge:__is(`true`),
    finish(...inputs) {
      // Purify all inputs (and output).
      const us = finish.v
      let [i = 1, j = 1, f, record, scope = new Map, inferred] = interrupt(_function)
      if (f === undefined) f = inputs, f.unshift(_function)
      const prevInFunction = finish.inFunction, prevScope = finish.env[_id(label)], prevInferred = _assign.inferred
      finish.inFunction = 1, finish.env[_id(label)] = scope, _assign.inferred = inferred
      try {
        for (; i < f.length; ++i) {
          const escaped = _bindFunc(f[i], x => x === us ? _funcPlaceholder : undefined)
          if (i === f.length-1) finish.inFunction = 2
          f[i] = purify(escaped)
          if (_isUnknown(f[i])) {
            if (_isDeferred(f[i]))
              (record || (record = [])).push(...f[i].slice(2))
            else f[i] = f[i][1]
          }
          if (_hasCycles(f[i])) _assignVarsIn(f[i])
        }
        f = _bindFunc(f, undefined, x => {
          if (_isUnknown(x)) {
            if (_isDeferred(x)) return (record || (record = [])).push(...x.slice(2)), x
            return x[1]
          }
          return x
        })
        inferred = _assign.inferred
        if (record) return i = [_unknown, f], i.push(...record), i

        // If we simply forward to another same-argCount function, just return that.
        const body = f[f.length-1]
        if (_isArray(body) && body.length == f.length-1 && typeof body[0] == 'function' && defines(body[0], argCount) === f.length-2) {
          justReturnThat: do {
            for (let i = 1; i < body.length; ++i)
              if (body[i] !== f[i] || !_isVar(body[i])) break justReturnThat
            return body[0]
          } while (false)
        }

        const shouldMerge = f.every(_shouldMerge)
        const impl = function impl(...data) {
          // Cache if our calls are merged.
          const v = shouldMerge && array(impl, ...data)
          // Don't expose torn caching to other jobs.
          if (shouldMerge && call.locked.has(v) && call.locked.get(v) !== call.ID) throw interrupt
          // See if we have this call in cache.
          const cache = call.cache || (call.cache = new Map)
          const r = shouldMerge ? _maybeUncache(cache, v) : _notFound
          if (r !== _notFound) return r
          let result = _notFound, interrupted = false

          let [labels = new Map, stage = 0, a = data.length == 1 ? f[1] : f.slice(1,-1)] = interrupt(impl)
          const prev = finish.env[_id(label)]
          finish.env[_id(label)] = labels
          if (shouldMerge) call.locked.set(v, call.ID)
          try {
            // Execute assignment then body.
            switch (stage) {
              case 0:
                const r = _assign(a, data.length == 1 ? data[0] : data)
                if (_isUnknown(r)) error("Assignment should finish synchronously, or await")
                ++stage
              case 1:
                call.impure = false
                return result = finish(f[f.length-1])
            }

          } catch (err) { if (err === interrupt) interrupted = true, interrupt(impl, 3)(labels, stage, a);  throw err }
          finally {
            finish.env[_id(label)] = prev

            if (shouldMerge) {
              if (!interrupted) call.locked.delete(v)
              if (!call.impure && result !== _notFound)
                _cache(cache, v, result)
              else cache.delete(v)
            }
          }
        }
        f = _bindFunc(f, x => inferred && inferred.has(x) ? inferred.get(x) : x === _funcPlaceholder ? impl : undefined)
        if (f.length == 3 && _isLabel(f[1]) && f[1] === f[2])
          return id
        if (call.cache && call.cache.has(f)) return call.cache.get(f)

        // Quote args if needed (cyclic structs aren't quoted).
        const dec = _maybeMerge(f.map((x, i, arr) => i < arr.length-1 && _hasCallableParts(x, true) ? array(quote, x) : x))

        // Ensure that work doesn't have to be repeated pointlessly.
        if (call.cache) call.cache.set(f, impl), call.cache.set(dec, impl)

        const d = impl[defines.key] = Object.create(null)
        d[_id(deconstruct)] = dec
        d[_id(inline)] = true
        if (shouldMerge) d[_id(merge)] = true
        if (_findRest(f.slice(1,-1)) === f.length-2)
          d[_id(argCount)] = f.length-2
        return impl
      } catch (err) { if (err === interrupt) interrupt(_function, 6)(i, j, f, record)(scope, _assign.inferred);  throw err }
      finally { finish.inFunction = prevInFunction, finish.env[_id(label)] = prevScope, _assign.inferred = prevInferred }
    },
    lookup:{
      purify:__is(`purify`),
      closure:__is(`closure`),
      var:__is(`var`),
      const:__is(`const`),
      id:__is(`id`),
      try:__is(`_try`),
      compose:__is(`compose`),
      argCount:__is(`argCount`),
    },
  },

  function:__is(`_function`),

  _isFunc(x) { return _isArray(x) && x[0] === _function },

  _isStruct(x) {
    // Returns whether calling x would return x.
    return !_isArray(x) || _isVar(x) || !_isArray(x[0]) && defines(x[0], finish) === undefined && defines(x[0], call) === undefined || !_hasCallableParts(x)
  },

  _assign:{
    txt:`\`(_assign Pattern Value)\`: deconstructs a pattern; used in function args.
Deconstructs graphs (collecting \`…x\` properly), assigning values to labels in the current function call.
If the structure differs, throws an error.
Infers structural terms where possible.`,
    nameResult:[
      `assigned`,
      `assignmentResult`,
      `equality`,
    ],
      // [
      //   `(_assign a 6), a`,
      //   `6`,
      // ],
    argCount:2,
    finish(a,b) {
      let [stage = 0, A, B] = interrupt(_assign)
      try {
        switch (stage) {
          case 0:
            const prev = finish.inFunction;  finish.inFunction = 1
            try { A = purify(a) }
            finally { finish.inFunction = prev }
            if (_isDeferred(A)) return A[1] = array(_assign, A[1], b), A
            if (_isUnknown(A)) A = A[1]
            ++stage
          case 1:
            B = finish(b)
            if (_isUnknown(B)) return B[1] = array(_assign, _hasCycles(A) || _hasCallableParts(A, true) ? array(quote, A) : A, B[1]), B
            ++stage
          case 2:
            return _assign(A,B)
        }
      } catch (err) { if (err === interrupt) interrupt(_assign, 3)(stage, A, B);  throw err }
    },
    call(a,b, readonly = false) {
      // This is largely self-contained and cannot interrupt.
      if (!_assign.env) _assign.env = new Map, _assign.inside = false
      const inside = _assign.inside
      _assign.inside = true
      try {
        if (_assign.env.has(a) && !_isVar(a))
          return _assign.env.get(a) !== b ? (!readonly ? error : errorFast)("Non-matching graph: expected", _assign.env.get(a), "for", a, "but got", b) : undefined
          // Inference is not as precise as setting _assign.inferred completely symmetrically for a and b (unification), but this is faster.
        _assign.env.set(a, b)

        if (_isUnknown(a) && !_isDeferred(a)) {
          if (!_isStruct(a[1])) throw impure
          if (_isVar(a[1])) a = a[1]
        }
        if (_isVar(a)) {
          // Set the value in the current label-environment.
          const m = finish.env[_id(label)]
          if (m.has(a) && !_isVar(b) && (!_isUnknown(b) || _isDeferred(b) || !_isVar(b[1]))) {
            // Unify previous and new values.
            if (_isUnknown(b) && !_isDeferred(b)) {
              if (!_isStruct(b[1])) throw impure
              if (_isVar(b[1])) b = b[1]
            }
            _assign(m.get(a), b), _assign(b, m.get(a))
            !readonly && m.set(a, bound(a, _assign.inferred))
          } else !readonly && m.set(a, b = !_isVar(b) ? b : [_unknown, b])
          return
        }
        if (_isUnknown(b) && !_isDeferred(b)) {
          if (!_isStruct(b[1])) throw impure
          if (_isVar(b[1])) b = b[1]
        }
        if (_isVar(b)) {
          // Infer that b must be a.
          if (readonly) return
          if (!finish.inFunction) error("Cannot infer outside of a function")
          if (!_assign.inferred) _assign.inferred = new Map
          if (_assign.inferred.has(b)) return _assign.env.delete(a), _assign(a, _assign.inferred.get(b))
          let m
          const A = bound(a, x => {
            if (m && m.get(x) != null) return m.get(x)
            if (_isVar(x)) {
              if (m && m.get(x) == null) return
              !m && (m = new Map)
              const v = [_var]
              !m.has(x) && m.set(x, v)
              m.set(v, null)
              _assign(x, v)
              return v
            }
          })
          _assign.inferred.set(b, A)
          return
        }
        if (a === b) return

        if (_isArray(a) && a[0] !== _const) {
          // Assign each element, mindful of potential `…R` in a.
          if (!_isArray(b)) (!readonly ? error : errorFast)(a, "cannot be assigned", b)

          // Find the index of the sole `…R` in a.
          const Rest = _findRest(a)

          // Check sizes.
          if (b.length < a.length - 1) (!readonly ? error : errorFast)(a, "cannot be assigned", b)
          if (Rest === a.length && a.length != b.length) (!readonly ? error : errorFast)(a, "cannot be assigned", b)

          // Assert array equality.
          for (let i = 0; i < a.length; ++i)
            if (i < Rest) _assign(a[i], b[i])
            else if (i > Rest) _assign(a[i], b[i + b.length - a.length])
            else _assign(a[i][1], b.slice(i, i + b.length - a.length + 1))
          return
        }
        (!readonly ? error : errorFast)(a, "cannot be assigned", b)
      }
      finally { _assign.inside = inside, !inside && _assign.env.clear() }
      // .inferred (a Map from variables to their inferred values), .env (a Map from a to b), .inside (false to the outside world)
    },
  },

  elem:{
    txt:`\`(elem TagName Content Style)\`: creates an HTML DOM element.`,
    nameResult:[
      `element`,
      `DOM`,
      `HTML`,
    ],
    lookup:{
      clone:__is(`elemClone`),
      insert:__is(`elemInsert`),
      remove:__is(`elemRemove`),
      collapse:__is(`elemCollapse`),
      value:__is(`elemValue`),
    },
    call(tag, content) {
      if (typeof document == ''+void 0) return _isArray(content) ? content.join('') : content
      if (typeof tag == 'string' && content === undefined) return document.createElement(tag)

      const r = defines(tag, elem)
      if (typeof r == 'function') return r(tag, content)

      if (typeof tag != 'string') error("Invalid elem tag:", tag)
      if (content != null && typeof content != 'string' && !_isArray(content) && !(content instanceof Node))
        errorStack("Invalid elem content:", content)
      const e = document.createElement(tag)
      _elemAppend(e, content)
      return e
    },
  },

  _elemAppend(p, ch) {
    // Out-of-document DOM append.
    if (_isArray(ch)) return ch.forEach(ch => _elemAppend(p, ch))
    if (ch && ch.parentNode && !ch.special) p.append(elemClone(ch))
    else if (ch !== undefined) p.append(ch)
  },

  elemClone(el) {
    const copy = el.cloneNode(false)
    if ('to' in el) elemValue(copy, el.to)
    if (el.special) copy.special = el.special, copy.special(el, copy)
    for (let ch = el.firstChild; ch; ch = ch.nextSibling)
      copy.appendChild(elemClone(ch))
    return copy
  },

  structured:{
    txt:`\`(structured Arrays)\`: shows deep structure of Arrays (consisting of acyclic arrays and strings and DOM elements): wraps each sub-array in \`<node>\` if we have DOM or pretty-prints it into a string if not.`,
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
        // …or just join them lol.
        if (_isArray(x)) return x.map(structured).join('')
        if (typeof x == 'string') return x
        throw 'Bad structure'
      }
    },
  },

  structuredSentence(str) {
    // '{hello there}, {general kenobi}' — in DOM, each curly-bracketed sentence fragment gets wrapped in a <node>.
    if (typeof document == ''+void 0) return str.replace(/{|}/g, '')
    let i = 0
    return parseStr(true)
    function parseStr(top) {
      const a = ['']
      for (; i < str.length && (i && str[i-1] === ' ' || str[i] !== '}'); ++i)
        if (i+1 < str.length && str[i] === '{' && str[i+1] !== ' ') ++i, a.push(parseStr(), '')
        else a[a.length-1] += str[i]
      if (!a[a.length-1]) a.pop()
      const el = elem('node', _highlightGlobalsInString(a, s => lookup.parents.get(parse.ctx.get(label(s))) !== js ? elem('known', s) : s))
      return !top && elemValue(el, a), el
    }
  },

  refs:{
    txt:`\`(refs Global)\`: returns {{all other globals that} {{this one} (likely) refers to}}.
\`(refs)\`: returns the {full {global reference} graph}.`,
    merge:__is(`true`),
    call(f) {
      if (f) {
        const set = new Set
        const keywords = new Set(['const', 'try', 'if', 'function', 'new', 'typeof', 'void', 'return', 'else', 'instanceof', 'catch', 'finally', 'let', 'throw', 'while', 'for', 'continue', 'break', 'undefined', 'null', 'true', 'false', 'switch', 'case'])
        let n = 0
        function handle(f) {
          if (n && serialize.backctx.has(f)) return set.add(f)
          if (++n > 9000) error('too big', [...set])
          if (set.has(f)) return
          if (defines(f, deconstruct)) f = deconstruct(f, false)
          if (typeof f == 'function') _highlightGlobalsInString(_unevalFunction(f)[1], s => !keywords.has(s) && set.add(parse.ctx.get(label(s))), true)
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
        return merge([...set])
      } else {
        if (refs.cache) return refs.cache
        const r = new Map
        parse.ctx.forEach(v => v && r.set(v, refs(v)))
        return refs.cache = r
      }
    },
  },

  refd:{
    txt:`\`(refd Global)\`: returns {{all other globals that} {{this one} is (likely) referenced in}}.
\`(refd)\`: returns the {full {global back-reference} graph}.`,
    merge:__is(`true`),
    call(f) {
      if (f) {
        return refd().get(f) || []
      } else {
        if (refd.cache) return refd.cache
        const r = new Map
        refs().forEach((tos, from) => tos.forEach(to => {!r.has(to) && r.set(to, []), r.get(to).push(from)}))
        r.forEach((tos, from) => r.set(from, merge(tos)))
        return refd.cache = r
      }
    },
  },

  _highlightGlobalsInString:{
    txt:`Just some approximation. Wraps potential references to globals in <known>.
Also wraps numbers in <number>.
Also wraps links in <a>.
Also wraps C-style comments in <unimportant>.
Also wraps C-style strings in <string>.`,
    call(str, wrapper = s => elem('known', s), noResult = false) {
      if (_isArray(str) && str.length == 1) str = str[0]
      if (typeof str != 'string') return str

      if (!_highlightGlobalsInString.regex) {
        const regexSrc = ['//.+\\n', '/\\*[^]+?\\*/', '[0-9]+(?:\\.[0-9+])?', '(?:file|https)://[^\\s\'"`:]+']
        parse.ctx.forEach((v,k) => regexSrc.push(k[1].replace(/[^_a-zA-Z0-9]/g, s => '\\'+s)))
        regexSrc.sort((a,b) => b.length - a.length)
        regexSrc.push("''[^\\n']*''", '""[^\\n"]*""')
        regexSrc.push("'[^\\n']*'", '"[^\\n"]*"')
        _highlightGlobalsInString.regex = new RegExp(regexSrc.join('|'), 'g')
      }
      const regex = _highlightGlobalsInString.regex
      regex.lastIndex = 0
      if (!regex.test(str)) return str

      const result = !noResult && [str]
      regex.lastIndex = 0
      while (true) {
        const s = !noResult ? result[result.length-1] : str
        let r = regex.exec(s)
        if (!r) break
        r = r[0]
        const end = regex.lastIndex, start = end - r.length
        let el
        if (+r === +r)
          !noResult && (el = elemValue(elem('number', r), +r))
        else if (r.slice(0,8) === 'https://' || r.slice(0,7) === 'file://')
          !noResult && (el = elem(url, r))
        else if (r.slice(0,2) === '//' || r.slice(0,2) === '/*' && r.slice(-2) === '*/')
          !noResult && (el = elem('unimportant', r))
        else {
          if (start > 0 && /[_a-zA-Z0-9\.'"`]/.test(s[start-1])) continue
          if (end < s.length && /[_a-zA-Z0-9:'"`]/.test(s[end])) continue
          if (r[0] === "'" && r.slice(-1) === "'" || r[0] === '"' && r.slice(-1) === '"')
            !noResult && (el = elem('string', r))
          else
            el = wrapper(r), typeof document != ''+void 0 && el instanceof Element && parse.ctx.has(label(r)) && elemValue(el, parse.ctx.get(label(r)))
        }
        if (!noResult) {
          result.pop()
          result.push(s.slice(0,start), el, s.slice(end))
          regex.lastIndex = 0
        }
      }
      return result
    },
  },

  style:{
    txt:`An overridable function that turns {{a serialize/parse node}, {its value}, and {unbound representation}} into a displayed node.`,
    call(s,v,u) { return s },
  },

  nameResult:{
    txt:`\`(nameResult Expr)\`: provides a list of suggestions for naming Expr. Used in \`serialize\` for more human-readable graph serializations.`,
    call(func) { return typeof func == 'string' && +func !== +func && func.length < 20 ? array(func) : defines(func, nameResult  ) },
  },

  serialize:{
    txt:`\`(serialize Expr)\` or … or \`(serialize Expr Language Backctx Options)\`: serializes Expr into a string or a DOM tree (that can be parsed to retrieve the original structure).`,
    philosophy:`Options must be undefined or a JS object like { style=false, collapseDepth=0, collapseBreadth=0, maxDepth=∞, offset=0, offsetWith='  ', space=()=>' ', nameResult=false, deconstructPaths=false, deconstructElems=false }.`,
    examples:[
      [
        `serialize ^(parse '12')`,
        `"parse '12'"`,
      ],
    ],
    lookup:{
      nameResult:__is(`nameResult`),
    },
    call(arr, lang, backctx, opt) {
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

      if (!lang) lang = fancy
      const styles = opt && opt.style ? defines(lang, style) || style : undefined

      if (backctx === undefined) backctx = serialize.backctx
      const deconstruction = new Map
      const named = new Set
      const lengths = new Map
      const boundToUnbound = new Map
      backctx.forEach((v,k) => boundToUnbound.set(k,k))
      const unboundToBound = new Map
      arr = deconstructed(arr)

      let n = 0
      const freeNames = []
      const nodeNames = styles && typeof document != ''+void 0 && new Map
      const u = unbound(arr, nameAllocator, boundToUnbound, maxDepth)
      boundToUnbound.forEach((v,k) => unboundToBound.set(v, k))
      if (breakLength) breakLength -= offset * offsetWith.length

      let struct = []
      useLangToGetStruct(u)
      return recCollapse(serializeLines(struct, offset))

      function useLangToGetStruct(u) {
        function emit(f, u, arg1, arg2) {
          if (typeof f == 'function') {
            let v = valueOfUnbound(u)
            if (!styles) return unenv(u, v) === u ? f(emit, u, arg1, arg2) : ((struct || (struct = [])).push(unenv(u, v)), undefined)
            let prev = struct
            struct = undefined

            const unenved = unenv(u, v)
            let r
            if (unenved === u)
              r = f(emit, u, arg1, arg2)
            else
              struct = [unenved]

            if (struct) {
              if (_isArray(v) && v[0] === bound && v[2] instanceof Map && v.length == 3) v = v[1]
              const isStyled = struct.length == 1 && (_isArray(struct[0]) || typeof document != ''+void 0 && struct[0] instanceof Node)
              // Only style once.
              ;(prev || (prev = [])).push(isStyled ? struct[0] : styleNode(struct, u, v))
            }
            struct = prev
            return r
          } else if (typeof f == 'string') {
            return (struct || (struct = [])).push(styles ? styleNode(f) : f), f
          } else if (typeof document != ''+void 0 && f instanceof Node)
            return (struct || (struct = [])).push(f), f
          else throw console.log("Unknown type to emit:", f, serialize.backctx.get(f)), "Unknown type to emit"
        }
        emit(defines(lang, serialize), u)
        if (_isArray(struct) && struct.length == 1) struct = struct[0]
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

      function valueOfUnbound(u) {
        const b = unboundToBound.has(u) ? unboundToBound.get(u) : u
        return unboundToBound.has(b) ? unboundToBound.get(b) : b
      }
      function styleNode(str, u, v) {
        if (!styles) return str
        const originalLen = lengths.get(str) || str && str.length
        if ((str === ' ' || typeof str == 'string' && !str.trim()) && u === undefined && v === undefined) return elem('space', str)

        // Associate with the value to bathe same-objects in the same light.
        const el = styles(str, v, u)
        if (typeof el == 'object') elemValue(el, v)

        return lengths.set(el, originalLen), el
      }
      function styleLabel(name, u, v) {
        return styleNode(typeof name != 'string' || /^[^=!:\s\(\)→>\+\-\*\/\&\|\.'"`\,\\]+$/.test(name) ? name : '`' + name.replace(/`/g, '``') + '`', u, v)
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
          return x.isConnected ? elemClone(x) : x
        if (deconstruction.has(x)) return deconstruction.get(x) === undefined && deconstruction.set(x, x.slice()), deconstruction.get(x)
        if (_isLabel(x)) return named.add(x[1]), x
        if (backctx && backctx.has(x)) return named.add(backctx.get(x)), x
        const original = x
        if (styles && typeof document != ''+void 0 && _isFunc(x)) {
          // Bind labels inside a func to the same (new) element.
          const styled = new Map
          x = _bindFunc(x, x => {
            if (_isLabel(x) && !styled.has(x)) styled.set(x, styleLabel(x[1], x, [label, x[1]]))
            return styled.get(x)
          })
        }
        if (deconstructElems || !_isDOM(x))
          if (!_isArray(x) && typeof x != 'string' && typeof x != 'number' && (!backctx || !backctx.has(x)))
            x = deconstruct(x, !deconstructPaths)
        if (!unboundToBound.has(x)) unboundToBound.set(x, original)
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
                _cameFrom(copy, x)
                unboundToBound.set(copy, original)
                deconstruction.set(original, copy), deconstruction.set(x, copy)
              }
              copy[i] = v
            }
          }
          return changed ? copy : (deconstruction.set(x,x), x)
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
          const styled = styleNode(joined, arr, valueOfUnbound(arr))
          lengths.set(styled, len)
          return styled
        } else
          return arr
      }
      function hasNonString(r) {
        for (let i = 0; i < r.length; ++i) if (typeof r[i] != 'string') return true
      }
      function unenv(u,v) {
        if (typeof u == 'string' || typeof u == 'number') return u
        if (backctx && backctx.has(v)) {
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
        const serialized = pprint(arr.map(line => serializeLines(line, d) ), breakLength && (breakLength - d * offsetWith.length))
        if (!_isArray(serialized)) return serialized
        
        if (hasNonString(serialized))
          return styleNode(serialized, arr.unbound, valueOfUnbound(arr.unbound))
        else {
          if (serialized[0] === '(') serialized[0] = styleNode('bracket', pad('(', offsetWith.length))
          const s = replaceSpaces(serialized, '\n' + offsetWith.repeat(d)).join('')
          return styleNode(s, arr.unbound, valueOfUnbound(arr.unbound))
        }
      }
    },
  },

  elemValue(el, v) {
    // If el, remember that it is a viewer of v. If !el, return an array of all in-document viewers of v.
    if (typeof document == ''+void 0) return
    const m = v && typeof v == 'object' ? (elemValue.obj || (elemValue.obj = new WeakMap)) : (elemValue.val || (elemValue.val = new Map))
    if (el instanceof Node) {
      el.to = v
      if (!m.has(v)) m.set(v, [])
      m instanceof Map && _limitMapSize(m, 100000)
      if (m.get(v).indexOf(el) >= 0) return el
      m.get(v).push(el)
      return el
    } else {
      if (m.has(v)) m.set(v, m.get(v).filter(el => el.isConnected))
      if (m.has(v) && !m.get(v).length) m.delete(v)
      return m.get(v)
    }
  },

  _valuedColor(v) {
    // Returns v's previously displayed element color (for highlighting of the same things) or a new one.
    if (!_valuedColor.m) _valuedColor.m = new Map
    if (_valuedColor.m.has(v)) {
      const r = _valuedColor.m.get(v)
      _valuedColor.m.delete(v), _valuedColor.m.set(v, r)
      return r
    }
    const prevPure = finish.pure
    finish.pure = false
    const colors = [randomNat(256), randomNat(256), randomNat(256)]
    finish.pure = prevPure
    const min = 64, max = 384, sum = colors[0]+colors[1]+colors[2]
    if (sum < min) colors[0] *= min/sum, colors[1] *= min/sum, colors[2] *= min/sum
    if (max < sum) colors[0] *= max/sum, colors[1] *= max/sum, colors[2] *= max/sum
    const c = 'rgb(' + colors + ')'
    _valuedColor.m.set(v, c)
    _limitMapSize(_valuedColor.m, 100000)
    return c
  },

  _extracted:{
    txt:`ONLY for parsing {c:x}.`,
  },

  parse:{
    txt:`\`(parse String)\` or … or \`(parse String Language Context Options)\`: parses String into the graph represented by it, returning \`(Expr StyledDOM)\`.`,
    philosophy:`Options is a JS object like { style=false }.`,
    call(str, lang, ctx, opt) {
      if (typeof str == 'string') str = str ? [str] : []
      if (_isDOM(str)) str = _innerText(str) // Don't even attempt to cache subtrees lol
      if (!str.length) throw 'Expected input'
      if (ctx === undefined) ctx = parse.ctx

      if (!lang) lang = fancy
      const styles = opt && opt.style ? defines(lang, style) || style : undefined
      const sourceURL = opt && opt.sourceURL || 'yep'

      let i = 0, lastI = 0
      const struct = styles && [], Unbound = styles && new Map

      let line = 1, column = 1, lineLengths = sourceURL && [] // How do we maintain a healthy lining in localUpdate? Seriously.
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

      function match(f, arg1, arg2) {
        // If a function, call it;
          // if _specialParsedValue or string or regex, match and return one if possible;
          // if a number, set global index; if undefined, get global index.
        if (typeof f == 'function') {
          if (localS == null) return
          const start = i, startLen = struct && struct.length
          const startLine = line, startColumn = column
          const r = f(match, _specialParsedValue, arg1, arg2)
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
          lastI = i
          return r
        } else if (f === _specialParsedValue) {
          const s = localS
          if (localS != null && typeof localS != 'string')
            return ++i, struct && lastI < i && struct.push(s), lastI = i, localUpdate(i), s
        } else if (typeof f == 'string') {
          if (typeof localS == 'string' && localS.slice(i - curBegin, i+f.length - curBegin) === f)
            return i += f.length, struct && lastI < i && struct.push(localS.slice(lastI - curBegin, i - curBegin)), lastI = i, localUpdate(i), true
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

      const u = !lang ? match(parser.topLevel) : match(defines(lang, parse))
      if (localI < str.length) throw 'Superfluous characters at the end: ' + (typeof localS == 'string' ? localS.slice(i - curBegin) : '···')

      // Do binding ourselves (and with our own original⇒copy map) so we can style structure bottom-up properly.
      const env = styles && new Map
      const b = styles ? bound(u, ctx, true, env) : bound(u, ctx, true)
      function styleNode(struct) {
        if (typeof document != ''+void 0 && struct instanceof Node) return struct
        let unb, v
        if (!Unbound.has(struct) && typeof struct == 'string' && ctx.has(label(struct)))
          unb = label(struct), v = ctx.get(label(struct))
        else
          unb = Unbound.get(struct), v = ctx.has(unb) ? ctx.get(unb) : env.has(unb) ? env.get(unb) : unb
        if (typeof struct == 'string' && (struct === ' ' || !struct.trim()) && unb === undefined && v === undefined)
          return elem('space', struct)
        if (_isArray(struct)) struct = struct.map(styleNode)
        const s = styles(struct, v, unb)
        if (typeof Element != ''+void 0 && s instanceof Element) elemValue(s, v)
        return s
      }
      styles && Unbound.set(struct, u)
      let styled = styles && styleNode(struct)
      return [b, styled]
    },
  },

  _specialParsedValue:{
    txt:`When matched in \`parse\`, represents a value that should be preserved as-is (as it likely comes from a special DOM element/reference).`,
  },

  _basicLabel(match, u) { // a, qwer, `a`; 12, 1e6
    const legal = /[^!=:\s\(\)→>\+\-\*\/\&\|\.'"`\,\\\ue000-\uf8ff]+/y
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

  _basicExtracted(match, u, value) { // c:x
    if (u === _specialParsedValue) {
      const key = match(value)
      if (key !== undefined && match(/\s*:\s*/y)) {
        const v = match(value)
        v === undefined && match.notEnoughInfo("Expected an actual value to be extracted")
        return [_extracted, key, v]
      } else return key
    }
    if (_isArray(u) && u[0] === _extracted && u.length == 3)
      match(value, u[1]), match(':'), match(value, u[2])
    else match(value, u)
  },

  _basicMany(match, u, value) { // a b c c:x
    if (u === _specialParsedValue) {
      const arr = []
      let ctx
      while (true) {
        match(/\s+/y)
        const v = match(_specialParsedValue) || match(_basicExtracted, value)
        if (v === undefined) break
        if (_isArray(v) && v[0] === _extracted)
          (ctx || (ctx = new Map)).set(v[1], v[2])
        else arr.push(v)
      }
      if (ctx) return array(bound, arr, ctx)
      return arr
    }
    if (!_isArray(u)) throw "Must be an array"
    let ctx
    if (_isArray(u) && u[0] === bound && u.length == 3 && u[2] instanceof Map)
      ctx = u[2], u = u[1]
    let b = false
    if (!_isArray(u)) match(u)
    else
      for (let j = 0; j < u.length; ++j) {
        b ? match(' ') : (b = true)
        match(_basicExtracted, u[j], value)
      }
    if (ctx) ctx.forEach((v,k) => (match(' '), match(_basicExtracted, [_extracted, k, v], value)))
  },

  _basicCall(match, u, value) { // (a b c c:x)
    if (u === _specialParsedValue) {
      if (!match('(')) return
      const arr = _basicMany(match, u, value)
      if (!match(')')) match.notEnoughInfo('Expected a closing bracket')
      return arr
    }
    if (!_isArray(u)) throw "A call must be an array"
    match('('), _basicMany(match, u, value), match(')')
  },

  _basicValue(match, u, call, value) { // String or label or call.
    const isEm = value === _fancyOutermost
    if (u === _specialParsedValue) {
      if (isEm && match('?')) return [_var]
      if (isEm && match('#')) return [_const]
      let r
      if ((r = match(_specialParsedValue)) !== undefined) return r
      if ((r = match(_basicString)) !== undefined) return r
      if ((r = match(_basicLabel)) !== undefined) return r
      if ((r = match(call, value)) !== undefined) return r
      return
    }
    else if (isEm && _isArray(u) && u[0] === _var && u.length == 1)
      match('?')
    else if (isEm && _isArray(u) && u[0] === _const && u.length == 1)
      match('#')
    else if (typeof u == 'string')
      match(_basicString, u)
    else if (typeof u == 'number')
      match(_basicLabel, u)
    else if (_isLabel(u))
      match(_basicLabel, u)
    else if (_isArray(u))
      match(call, u, value)
    else match(u)
  },

  _fancyLookup(match, u, topLevel) { // obj.key
    if (u === _specialParsedValue) {
      let obj = match(_basicValue, _basicCall, _fancyOutermost)
      if (obj === undefined) return
      while (match(/\s*\.(?!\.\.)\s*/y)) {
        let key = match(_basicLabel)
        if (key === undefined) obj = array(lookup, obj)
        else obj = array(lookup, obj, _isLabel(key) ? key[1] : key)
      }
      return obj
    }
    if (_isArray(u) && u[0] === lookup && (u[2] === undefined || typeof u[2] == 'number' || typeof u[2] == 'string')) {
      _fancyLookup(match, u[1]), match('.')
      if (u[2] !== undefined) match(_basicLabel, typeof u[2] == 'string' ? label(u[2]) : u[2])
    } else match(_basicValue, u, !topLevel ? _basicCall : _basicMany, _fancyOutermost)
  },

  _fancyRest(match, u, topLevel) { // …a, ...a; ^a
    if (u === _specialParsedValue) {
      if (match('…') || match('...')) {
        const r = match(_fancyLookup)
        r === undefined && match.notEnoughInfo('Expected the rest')
        return array(rest, r)
      }
      if (match('^')) {
        const r = match(_fancyRest)
        r === undefined && match.notEnoughInfo('Expected the quoted value')
        return array(quote, r)
      }
      return match(_fancyLookup)
    }
    if (_isArray(u) && u[0] === rest && u.length == 2)
      match('…'), match(_fancyLookup, u[1])
    else if (_isArray(u) && u[0] === quote && u.length == 2)
      match('^'), match(_fancyRest, u[1])
    else match(_fancyLookup, u, topLevel)
  },

  _fancyMultDiv(match, u, topLevel) { // a*b, a/b
    if (u === _specialParsedValue) {
      let a = match(_fancyRest), op
      if (a === undefined) return
      while (op = match(/\s*(?:\*|\/)\s*/y)) {
        const b = match(_fancyRest)
        b === undefined && match.notEnoughInfo('Expected the second arg of +')
        a = array(op.trim() === '*' ? mult : div, a, b)
      }
      return a
    }
    if (_isArray(u) && u.length == 3 && (u[0] === mult || u[0] === div))
      match(_fancyMultDiv, u[1]), match(u[0] === mult ? '*' : '/'), match(_fancyRest, u[2])
    else match(_fancyRest, u, topLevel)
  },

  _fancySumSub(match, u, topLevel) { // a+b, a-b
    if (u === _specialParsedValue) {
      let a = match(_fancyMultDiv), op
      if (a === undefined) return
      while (op = match(/\s*(?:\+|-(?!>))\s*/y)) {
        const b = match(_fancyMultDiv)
        b === undefined && match.notEnoughInfo('Expected the second arg of '+op)
        a = array(op.trim() === '+' ? sum : sub, a, b)
      }
      return a
    }
    if (_isArray(u) && u.length == 3 && (u[0] === sum || u[0] === sub))
      match(_fancySumSub, u[1]), match(u[0] === sum ? '+' : '-'), match(_fancyMultDiv, u[2])
    else match(_fancyMultDiv, u, topLevel)
  },

  _matchOperator(match, u, base, funcOp, parseOp, serializeOp, topLevel) { // a OP b
    if (u === _specialParsedValue) {
      const v = match(base)
      if (v === undefined) return
      if (match(parseOp)) {
        const t = match(base)
        t === undefined && match.notEnoughInfo('Expected the type')
        return array(funcOp, v, t)
      }
      return v
    }
    if (_isArray(u) && u[0] === funcOp && u.length == 3)
      match(base, u[1]), match(serializeOp), match(base, u[2])
    else match(base, u, topLevel)
  },

  _fancyTyped(match, u, topLevel) { // v∷t, v::t
    return _matchOperator(match, u, _fancySumSub, typed, /\s*(?:∷|::)\s*/y, '::', topLevel)
  },

  _fancyFirst(match, u, topLevel) { // a\b\c
    return _matchSequence(match, u, topLevel, _fancyTyped, first, /\s*\\\s*/y, '\\')
  },

  _fancyLast(match, u, topLevel) { // a,b,c
    return _matchSequence(match, u, topLevel, _fancyFirst, last, /\s*\,\s*/y, ',')
  },

  _fancyArrowFunc(match, u, topLevel) { // a→b, a->b
    if (u === _specialParsedValue) {
      const a = match(_fancyLast)
      if (a === undefined) return
      if (match(/\s*(?:→|->)\s*/y)) {
        const b = match(_fancyClosure)
        b === undefined && match.notEnoughInfo('Expected the body of an arrow function')
        return array(_function, a, b)
      }
      return a
    }
    if (_isArray(u) && u[0] === _function && u.length == 3)
      match(_fancyLast, u[1]), match(typeof document != ''+void 0 ? '→' : '->'), match(_fancyClosure, u[2])
    else match(_fancyLast, u, topLevel)
  },

  _fancyClosure(match, u, topLevel) { // !f, !a→b
    if (u === _specialParsedValue) {
      if (match('!')) {
        const r = match(_fancyArrowFunc)
        return r !== undefined ? array(closure, r) : undefined
      }
      return match(_fancyArrowFunc)
    }
    if (_isArray(u) && u[0] === closure && u.length == 2)
      match('!'), match(_fancyArrowFunc, u[1])
    else match(_fancyArrowFunc, u, topLevel)
  },

  _matchSequence(match, u, topLevel, base, head, parseSep, separator = parseSep) {
    if (u === _specialParsedValue) {
      const a = match(base)
      if (a === undefined) return
      let arr
      while (match(parseSep)) {
        const b = match(base)
        if (b === undefined) match.notEnoughInfo("Expected the next base value after "+separator)
        if (!arr) arr = [head, a]
        arr.push(b)
      }
      return arr || a
    }
    if (_isArray(u) && u[0] === head && u.length > 2) {
      for (let i = 1; i < u.length; ++i)
        i > 1 && match(separator), match(base, u[i])
    } else match(base, u, topLevel)
  },

  _fancyTry(match, u, topLevel) { // a|b|c
    return _matchSequence(match, u, topLevel, _fancyClosure, _try, /\s*\|\s*/y, '|')
  },

  _fancyOutermost(match, u, topLevel) {
    let ctx
    if (_isArray(u) && u[0] === bound && u.length == 3 && u[2] instanceof Map)
      ctx = u[2], u = u[1]
    const r = _fancyTry(match, u, topLevel)
    if (ctx) ctx.forEach((v,k) => (match(' '), match(_basicExtracted, [_extracted, k, v], _fancyTry)))
    return r
  },

  _basicOutermost(match, u) { return _basicValue(match, u, _basicCall, _basicOutermost) },

  _fancyTopLevel(match, u) { // (f); a b c c:x
    if (u === _specialParsedValue) {
      const arr = _basicMany(match, u, _fancyOutermost)
      match(/\s+/y)

      const inner = _isArray(arr) && arr[0] === bound ? arr[1] : arr
      if (!inner.length) match.notEnoughInfo("No value at top level")
      if (inner.length == 1) {
        if (_isArray(arr) && arr[0] === bound) arr[1] = arr[1][0]
        else return arr[0]
      }

      return arr
    }
    _fancyOutermost(match, !_isArray(u) || u.length <= 1 ? [u] : u, true)
  },

  _basicTopLevel(match, u) { // (f); a b c c:x
    const value = (match, u) => _basicValue(match, u, _basicCall, value)
    if (u === _specialParsedValue) {
      const arr = _basicMany(match, u, _basicOutermost)
      match(/\s+/y)

      const inner = _isArray(arr) && arr[0] === bound ? arr[1] : arr
      if (!inner.length) match.notEnoughInfo("No value at top level")
      if (inner.length == 1) {
        if (_isArray(arr) && arr[0] === bound) arr[1] = arr[1][0]
        else return arr[0]
      }

      return arr
    }
    return _basicMany(match, !_isArray(u) || u.length <= 1 ? [u] : u, _basicOutermost)
  },

  basic:{
    txt:`A language for ordered-edge-list graphs.
label, \`label\`, {'string'}, {"string"}, {(0 1)}, {(a:2 a)}.
This is a {more space-efficient than binary} representation for graphs of arrays.`,
    style:__is(`_basicStyle`),
    parse:__is(`_basicTopLevel`),
    serialize:__is(`_basicTopLevel`),
    REPL:`\`(txt)\` for {all functionality}, \`(examples)\` for {all tests}.`,
    replaceRangeWithLinkTo:__is(`_basicLinkTo`),
  },

  fancy:{
    txt:`A language for ordered-edge-list graphs (like \`basic\`) with some syntactic conveniences.
label, \`label\`, {'string'}, {"string"}, {(0 1)}, {(a:2 a)}; {1+2}, {a→a*2}.`,
    style:__is(`_basicStyle`),
    parse:__is(`_fancyTopLevel`),
    serialize:__is(`_fancyTopLevel`),
    REPL:`\`(docs)\` for {all functionality}, \`(examples)\` for {all tests}.`,
    replaceRangeWithLinkTo:__is(`_basicLinkTo`),
  },

  _basicLinkTo(r, el) {
    // Create a name not seen in editor, replace el with name, insert newline and name and ':' and el at editor's end, and return a name element.
      // × (1 2 3)  ⇒  a a  a:(1 2 3)
    const editor = _isEditable(el), names = new Set
    if (el === editor) return
    _visitText(editor, str => typeof str == 'string' && names.add(str))
    let i = 0, name, rBecomes, elBecomes
    if (el.tagName === 'EXTRACTED') el = el.lastChild
    if (el.parentNode.tagName === 'EXTRACTED' && el.parentNode.parentNode.contains(r.commonAncestorContainer))
      name = _innerText(el.parentNode.firstChild).join('')
    else if (el.classList.contains('label'))
      name = _innerText(el).join('')
    else if (el.tagName === 'NUMBER')
      name = el.innerText
    else {
      const proposals = _isArray(el.to) && typeof el.to[0] == 'function' && nameResult(el.to[0]) || []
      while (names.has(name = i < proposals.length ? proposals[i] : toString(i - proposals.length, 'abcdefghijklmnopqrstuvwxyz'))) ++i
      const topLevel = el.parentNode === editor || el.parentNode.parentNode === editor
      rBecomes = document.createTextNode(name)
      r.deleteContents(), r.insertNode(rBecomes), r.setEndAfter(rBecomes)
      el.replaceWith(elBecomes = document.createTextNode(name))
      if (_isArray(el.to) && el.to.length > 1 && topLevel && el.firstChild.textContent[0] !== '(')
        el = elem('node', ['(', el, ')'])
      editor.append('\n'+name+':', el)
    }
    if (!rBecomes) {
      rBecomes = document.createTextNode(name)
      r.deleteContents(), r.insertNode(rBecomes), r.setEndAfter(rBecomes)
    }
    ensureSpacesAround(editor, rBecomes, elBecomes)


    function toString(i, alphabet) {
      if (i < alphabet.length) return alphabet[i]
      return toString(Math.floor(i / alphabet.length), alphabet) + alphabet[i % alphabet.length]
    }
    function space() { return document.createTextNode(' ') }
    function ensureSpacesAround(el, before1, before2) {
      const legal = /[!=:\s\(\)→>\+\-\*\/\&\|]/
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

  _basicStyle(s,v,u) {
    if (typeof s == 'string' && v === undefined && u === undefined) return s
    if (typeof u == 'number' && _isArray(s) && s.length == 1 && typeof s[0] == 'string')
      return _colored(elem('number', s), 4, 24) // underline
    if (typeof u == 'string' && _isArray(s) && s.length == 1 && typeof s[0] == 'string')
      return _colored(elem('string', [s[0][0], _highlightGlobalsInString(s[0].slice(1,-1)), s[0].slice(-1)]), 32) // green
    if (_isArray(v) && v[0] === _extracted && v.length == 3 && s.length == 3) {
      elemValue(s[2], s[0].to)
      s[1] = elem('operator', s[1])
      const el = elem('extracted', s)
      el.title = 'extracted'
      el.classList.add('hasOperators')
      return el
    }
    if (typeof document != ''+void 0 && (_isArray(v) && v[0] === map && v.length > 3 || v instanceof Map && v.size > 1 && s.length > 1)) {
      // Construct a <table>, with brackets and `map` outside of it, and each key-value pair having its own <tr>.
      let i, start = (s[0].textContent || s[0]) === '(' ? 2 : 1
      let end = (s[s.length-1].textContent || s[s.length-1]) === ')' ? s.length-1 : s.length-2
      const rows = []
      for (i = start; i < end; ) {
        if (i + 4 > s.length) break
        if ((s[i].textContent || s[i]).trim()) break
        if ((s[i+2].textContent || s[i+2]).trim()) break
        if (s[i+1].nodeName === 'EXTRACTED') break
        if (s[i+3].nodeName === 'EXTRACTED') break
        rows.push(elem('tr', [elem('td', [s[i], s[i+1]]), elem('td', [s[i+2], s[i+3]])]))
        i += 4
      }
      s = [...s.slice(0,start), elem('table', rows), ...s.slice(i)]
    }
    if (_isArray(s) && typeof s[0] == 'string' && s[0].trim() === '(' && s[s.length-1] === ')')
      s[0] = _colored(elem('bracket', s[0]), 33), // brown
      s[s.length-1] = _colored(elem('bracket', s[s.length-1]), 33)

    let hasOperators = false
    if (_isArray(s) && _isArray(u) && !_isLabel(u) && s.length > 1)
      for (let i = 0; i < s.length; ++i)
        if (typeof s[i] == 'string')
          s[i] = elem('operator', s[i]), hasOperators = true

    if (_isLabel(u) && serialize.backctx.has(v) && u[1] === serialize.backctx.get(v))
      return _colored(elem('known', s), 1, 0) // bold
    let el = elem('node', s)
    if (hasOperators && typeof document != ''+void 0)
      el.classList.add('hasOperators')
    if (_isLabel(u) && typeof document != ''+void 0)
      el.style.color = _valuedColor(v), el.classList.add('label')
    else if (_isLabel(u))
      el = _colored(el, [34, 36, 35][randomNat(3)]) // Cycle through blue, cyan, magenta.
    if (typeof document != ''+void 0)
      el.title = _isArray(v) && v.length && serialize.backctx.has(v[0]) ? serialize.backctx.get(v[0]) : ''
    return el
  },

  fast:{
    txt:`A \`basic\`-like language that can be parsed and serialized fast.
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
        const regex = /[ \n]+|:|!|\(|\)|`(?:[^`]|``)*`|'(?:[^']|'')*'|"(?:[^"]|"")*"|[^ \n:!\(\)'"`]+|$/g
        let [i = 0, j, ctxs = [ctx], visited = new Set] = interrupt(fast)
        regex.lastIndex = i
        if (j === undefined) regex.test(str), j = regex.lastIndex
        let result
        try { result = getCall() }
        catch (err) { if (err === interrupt) interrupt(fast, 4)(i, j, ctxs, visited);  throw err }
        if (i < str.length) throw "Too much information: " + str.slice(i)
        if (result.length != 1) throw "Wrong count of top-level args"
        return result[0] // That top-level pair of brackets serves as a language marker.

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
              if (!bindings) ctxs[ctxs.length-1] = {}, bindings = []
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
          if (str[i] === '!') {
            const prev = finish.noSystem; finish.noSystem = true
            if (!interrupt.started || _timeSince(interrupt.started) > 20)
              interrupt.started = _timeSince()
            try { return purify(getValue()) }
            finally { finish.noSystem = prev }
          }
          if (str[i] === '(') return getCall()
          if (str[i] === ':' || str[i] === ')') return
          const I = i, J = j;  nextToken()
          if (str[I] === "'" && str[J-1] === "'") return str.slice(I+1,J-1).replace(/''/g, "'")
          if (str[I] === '"' && str[J-1] === '"') return str.slice(I+1,J-1).replace(/""/g, '"')
          if (str[I] === '`' && str[J-1] === '`') return labelLookup(str.slice(I+1,J-1).replace(/``/g, '`'))
          return labelLookup(str.slice(I,J))
        }
      },
      serialize(expr, backctx, opt) {
        // Walk expr and name all referenced-more-than-once nodes, then output them then expr.
        // Unlike `basic`, here we mark everything that defines `deconstruct` with `!…` (finish-this), for perfect reconstruction.

        const humanReadableMode = opt && opt.humanReadableMode
        const preserveReadings = opt ? opt.preserveReadings : true

        if (!backctx) backctx = serialize.backctx
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

        function name(v) { names.set(v, humanReadableMode || n > 10000 ? '&'+(n++).toString(36) : String.fromCharCode(128 + ++n)) }
        function mark(arr) {
          if (deconstruction.has(arr)) arr = deconstruction.get(arr)
          if (visited.has(arr)) return !names.has(arr) && name(arr); else visited.add(arr)
          if (backctx.has(arr)) return
          if (preserveReadings && _read.marks && _read.marks.has(arr)) mark(_read.marks.get(arr))
          if (!_isArray(arr)) {
            if (typeof arr == 'string' || typeof arr == 'number') return
            if (arr instanceof Map || defines(arr, deconstruct))
              deconstruction.set(arr, deconstruct(arr, false)), arr = deconstruction.get(arr)
            else throw "Cannot serialize a not-`deconstruct`ible not-an-array"
          }
          if (!_isArray(arr)) throw "All values must be string/number or Map or array or deconstruct to an array"
          if (arr[0] === label && typeof arr[1] === 'string' && arr.length === 2) {
            if (/[\x80-\u2790]/.test(arr[1])) throw "An exotic label to "+arr[1]+" detected"
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
          if (preserveReadings && !ignoreMark && _read.marks && _read.marks.has(v)) { // Put `!(_read (quote V) (quote _read.marks.get(v)))`.
            result.push('!(_read(quote '), putValue(v, ignoreName, true), result.push(')(quote ')
            putValue(_read.marks.get(v) !== undefined ? _read.marks.get(v) : _onlyUndefined), result.push('))')
            return
          }
          if (deconstruction.has(v)) result.push('!'), v = deconstruction.get(v)
          if (typeof v == 'number') return result.push(''+v)
          if (typeof v == 'string')
            return result.push(v.indexOf("'") < 0 ? "'" + v.replace(/'/g, "''") + "'" : '"' + v.replace(/"/g, '""') + '"')
          if (!_isArray(v)) throw "Not-an-array unknown value"
          if (v[0] === label && typeof v[1] == 'string' && v.length == 2) {
            if (/[ \n:!\(\)'"`]/.test(v[1])) return result.push('`' + v[1].replace(/`/g, '``') + '`')
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
    txt:`\`(_continuation)\`⇒State and \`(_continuation State)\`: saves/restores the environment and interrupt state.`,
    call(state) {
      if (state === undefined) {
        const r = Object.create(null)
        Object.assign(r, finish.env)
        if (_isArray(r[_id(interrupt)]))
          r.set(interrupt, r[_id(interrupt)].map(x => x instanceof Map ? new Map(x) : !_isArray(x) || _wasMerged(x) ? x : x.slice()))
        Object.seal(r)
        return r
      } else
        Object.assign(finish.env, r)
    },
  },

  _checkInterrupt:{
    txt:`Checks whether an interrupt is appropriate right now.`,
    call(cause) {
      if (!finish.env[_id(interrupt)] || !finish.env[_id(interrupt)].length) {
        if (!_checkInterrupt.stepped) _checkInterrupt.stepped = true
        else if (_timeSince(interrupt.started, true) > 10) {
          if (typeof document != ''+void 0) {
            _highlightOriginal(finish.env[_id(_checkInterrupt)], false)
            finish.env[_id(_checkInterrupt)] = cause
            _highlightOriginal(finish.env[_id(_checkInterrupt)], true)
          }
          throw interrupt
        }
      }
      // .stepped (Boolean)
    },
  },

  interrupt:{
    txt:`Used to make functions re-entrant in a non-interruptible language, for better UX.

Technical details:
\`throw interrupt\` to interrupt execution.
Create function state in \`f\` like \`let [i = 0, j = 0] = interrupt(f)\`, in particular for loops.
Wrap function body in \`try{…}catch(err){ if (err === interrupt) interrupt(f,2)(i,j);  throw err }\`: store 4 values in tmp at a time, up to the requested length (\`...args\` in JS allocates, so this way tries to avoid that).`,
    lookup:{
      check:__is(`_checkInterrupt`),
      noInterrupt:__is(`noInterrupt`),
      continuation:__is(`_continuation`),
    },
    philosophy:`This (and sandboxing) is absolutely essential for being able to actually use a language comfortably, but no one buzzes about it. Probably because almost all cheat and rely on the OS to provide it via processes.`,
    call(cause, len = undefined) {
      if (!interrupt.tmp) interrupt.tmp = []
      if (!interrupt.populate) interrupt.populate = (a,b,c,d) => {
        const tmp = interrupt.tmp
        let index = tmp[tmp.length-1]
        if (index < tmp.length-1) tmp[index++] = a
        if (index < tmp.length-1) tmp[index++] = b
        if (index < tmp.length-1) tmp[index++] = c
        if (index < tmp.length-1) tmp[index++] = d
        if (index >= tmp.length-1) {
          if (!finish.env) return
          if (!finish.env[_id(interrupt)]) finish.env[_id(interrupt)] = []
          const stack = finish.env[_id(interrupt)]
          tmp.pop(), stack.push(...tmp), stack.push(tmp.length), tmp.length = 0
        } else
          return tmp[tmp.length-1] = index, interrupt.populate
      }
      const tmp = interrupt.tmp
      if (len === undefined) {
        // Collect items from the stack into tmp and return it.
        if (!finish.env || !finish.env[_id(interrupt)]) return tmp.length = 0, tmp
        const stack = finish.env[_id(interrupt)]
        if (!stack.length) return tmp.length = 0, tmp
        const end = stack.length-1
        const length = stack[end]
        tmp.length = length
        const start = end - length
        for (let i = start; i < end; ++i)
        tmp[i - start] = stack[i]
        stack.length -= length+1

        // Check the cause.
        const got = stack.pop()
        if (got !== cause) {
          const str = "expected "+serialize.backctx.get(cause)+" but got "+serialize.backctx.get(got)
          localStorage.setItem(str, (+localStorage.getItem(str) || 0) + 1)
          const tmpSlice = tmp.slice()
          tmp.length = 0
          error("Interrupt stack corruption sometime before this — invalid cause: expected", cause, "but got", got, "in", stack, "with tmp", tmpSlice)
          // Actually, DON'T sweep this under the rug (tests of `try` are currently the only ones that are affected, and only if run not in isolation; we couldn't fix it)
          // stack.length = tmp.length = 0
        }

        return tmp
      }
      // Return a function that stores 4 values at a time, up to len.
      if (typeof len != 'number') throw "len must be a number"
      tmp.length = len+1
      tmp[len] = 0

      // Allow checking the cause.
      if (!finish.env[_id(interrupt)]) finish.env[_id(interrupt)] = []
      finish.env[_id(interrupt)].push(cause)

      return interrupt.populate
    },
  },

  _read:{
    txt:`\`(_read Value)\`: reads a global marker of Value (initially undefined). (_read Value WillBe): writes it (use _onlyUndefined to write undefined). Can be used to store and update information, preserved between evaluations.`,
    call(v, now = undefined) {
      impure()
      if (!_read.marks) _read.marks = new WeakMap
      const j = finish.env[_id(journal)]
      call.impure = true
      if (!j) {
        // Forward to _read.marks.
        impure()
        if (now === undefined) return _read.marks.get(v)
        else return now !== _onlyUndefined ? _read.marks.set(v, now) : _read.marks.delete(v), v
      } else {
        // Check journal first, then _read.marks. Store reads in the journal too.
        if (now === undefined) return j.has(v) ? j.get(v) : (impure(), j.set(v, _read.marks.get(v)), _read.marks.get(v))
        else return j.set(v, now), v
      }
      // .marks.
    },
  },

  journal:{
    txt:`Finishing \`(journal Expr)\`: virtualizes writes during Expr's evaluation. Returns a journal that can be passed to peekResult or commit.`,
    argCount:1,
    finish(expr) {
      let [j = new Map] = interrupt(journal)
      const prev = finish.env[_id(journal)];  finish.env[_id(journal)] = j
      try { return [undefined, finish(expr), j] }
      catch (err) { if (err === interrupt) interrupt(journal, 1)(j);  throw err }
      finally { finish.env[_id(journal)] = prev }
    },
    lookup:{
      read:__is(`_read`),
      peed:__is(`peekResult`),
      commit:__is(`commit`),
    },
  },

  peekResult:{
    txt:`\`(peekResult Journal)\`: Returns the result contained in a journal.`,
    argCount:1,
    call(journal) { return journal[1] },
  },

  commit:{
    txt:`\`(commit Journal)\`: performs the actual writes stored in a journal, and returns its result.`,
    argCount:1,
    call(journal) {
      journal[2].forEach(_doEachRead)
      return journal[1]
    },
  },

  _doEachRead(mark, v) { _read(v, mark) },

  _cameFrom:{
    txt:`Provides a potential way to tell which value this one came from, by a transformation like \`bound\` or recording.`,
    call(to, from) {
      if (!_cameFrom.m) _cameFrom.m = new WeakMap
      if (to && typeof to == 'object') _cameFrom.m.set(to, from)
      return to
    },
  },

  typed:{
    txt:`\`Value::Type\` or \`(typed Value Type)\`: specifies that the value definitely fits the type.
Since we currently inline everything, specifying types of function args allows to see either the final type of body or the error.`,
    examples:[
      [
        `1::2->2::3  1::2`,
        `2::3`,
      ],
      [
        `1::a->a::Type  1::2  Type:#`,
        `2::#`,
      ],
      [
        `a::b->a+1::b+1  1::2`,
        `2::3`,
      ],
      [
        `Int: 'Int'
Sum: (function  a::Int  b::Int  a+b::Int)
Mult: (function  n::Int  m::Int  n*m::Int)
x: ?::Int
x -> (Sum x (Mult x x))`,
        `x::Int→x+x*x::Int x:? Int:'Int'`,
      ],
      [
        `Int: 'Int'
Sum: (function  a::Int  b::Int  a+b::Int)
Mult: (function  n::Int  m::Int  n*m::Int)
x -> (Sum x (Mult x x))`,
        `x::Int→x+x*x::Int x:? Int:'Int'`,
      ],
      [
        `Int: 'Int'
Sum: (function  a::Int  b::Int  a+b::Int)
Mult: (function  n::Int  m::Int  n*m::Int)
x -> (Sum x (Mult 20::Int 2::Int))`,
        `x::Int→x+40::Int x:? Int:'Int'`,
      ],
    ],
    buzzwords:`gradually dependently typed`,
    argCount:2,
    philosophy:`This is not handled specially whatsoever (because constructions turned out to be more fundamental than types), and is pattern-matched as any other array, but it still allows dependent types (as long as only trusted-to-be-correct-for-an-application functions are used).
Self is not a theorem-proving tool, and does not have features that get in the way of regular programming, like ensuring totality.
Correctness is defined and developed per application. It is not an evident-by-itself thing; on the same base, infinitely many interpretations can be constructed.`,
    merge:__is(`true`),
  },

  Garbage:{
    txt:`It's a nice thought, but it doesn't play well with others.`,
    lookup:{
      philosophy:__is(`philosophy`),
      enumerableTypes:__is(`enumerableTypes`),
    },
  },

  _lineCount(str) {
    let i = 0, n = 0
    while ((i = str.indexOf('\n', i)+1) > 0) ++n
    return n
  },

  SelfToReadableJS:{
    txt:`Converts Self to a human-readable form that pollutes the global scope on execution.`,
    philosophy:`The quining of functions can be tested by checking that the rewrite-of-a-rewrite is exactly the same as the rewrite.`,
    call(markLines = true, net = defines(Self, lookup), prefix) {
      if (!net || net[defines.key] || typeof net != 'object') throw "Invalid net"
      Object.keys(net).forEach(k => !_isValidIdentifier(k) && error('Not a valid JS identifier:', k))
      const seen = new Map
      mark(net)
      seen.set(net, 0)
      const names = new Map
      Object.keys(net).forEach(k => { seen.get(net[k]) !== 0 && names.set(net[k], k), seen.set(net[k], 0) })
      let s = [], nextName = 0, depth = 0, line = 1
      prefix && write(prefix)
      write(`/* Code begins at the first \`})({\`, as methods that are bound to each other. _XXX methods are private and somewhat invisible. */\n`)
      write(`'use strict';\n`)
      write(`(function() {\n`)
      if (markLines) write(`const __line = function(line, func) { return __line.lines[''].push(line, func), func }\n`)
      if (markLines) write(`__line.lines = {['']:[]}\n`)
      write(`const __mark = (v, m) => (_read.marks.set(v, m), v)\n`)
      write(`const __is = (function is(name) {\n`)
      write(`  const obj = Object.create(is)\n`)
      write(`  return obj.is = name, obj\n`)
      write(`});\n`)
      write(_unevalFunction(__base)[1]+'\n')
      write("__base({")
      ++depth
      Object.keys(net).forEach(k => {
        write('\n\n'), method(identifier(k), net[k], seen.get(net[k]) === 0)
        names.set(net[k], k), seen.set(net[k], 1)
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

      function mark(x) {
        if (x == null || typeof x == 'number' || typeof x == 'boolean' || typeof x == 'string') return
        seen.set(x, (seen.get(x) || 0) + 1)
        if (seen.get(x) !== 1) return
        if (!_isArray(x) && defines(x, deconstruct)) return mark(deconstruct(x, false))
        else if (x instanceof Map) x.forEach((v,k) => (mark(k), mark(v)))
        else if (_isArray(x)) x.forEach(mark)
        else if (x && !x[defines.key] && typeof x == 'object')
          Object.keys(x).forEach(k => mark(x[k]))
        else if (x && x[defines.key])
          Object.keys(x[defines.key]).forEach(k => (mark(concept.idToKey[+k]), mark(x[defines.key][k])))
        if (_read.marks.has(x)) mark(_read.marks.get(x))
      }
      function write(str, noDepth = false) {
        if (markLines) line += _lineCount(str)
        s.push(!depth || noDepth ? str : str.replace(/\n(?!\n)/g, '\n'+'  '.repeat(depth)))
      }
      function put(x, ignoreName = false, ignoreMark = false) {
        if (!ignoreMark && _read.marks.has(x))
          write('__mark('), put(x, ignoreName, true), write(','), put(_read.marks.get(x), false, true), write(`)`)
        else if (typeof x == 'string') write(str(x), true)
        else if (x == null || typeof x == 'number' || typeof x == 'boolean') write(''+x)
        else if (!ignoreName && names.has(x))
          write('__is('), write(typeof names.get(x) == 'number' ? ''+names.get(x) : str(names.get(x)), true), write(')')
        else if (!_isArray(x) && defines(x, deconstruct)) {
          // Deconstructed concepts become is(…) to evaluate on start.
          const d = deconstruct(x, false)
          if (!_isArray(d) || typeof d[0] != 'function' || defines(d[0], finish)) throw "Must be a regular function"
          write('__is('), put(d), write(')')
        } else if (isFunc(x)) {
          write(!markLines ? x[1] : '__line(' + line + ',' + x[1] + ')')
        } else if (_isArray(x)) {
          write('['), ++depth // […]
          x.forEach(el => (write('\n'), put(el), write(',')))
          --depth, write('\n]')
        } else if (x instanceof Map) {
          write('{'), ++depth // {…} in definitions.
          x.forEach((v,k) => (write('\n'), method(identifier(names.get(k)), v)))
          --depth, write('\n}')
        } else if (x && !x[defines.key] && typeof x == 'object') {
          write('{'), ++depth // {…} in lookup.
          Object.keys(x).forEach(k => (write('\n'), method(identifier(k), x[k])))
          --depth, write('\n}')
        } else if (typeof x == 'function' || x && x[defines.key]) {
          // Functions get put as-is or as a definition of call.
          let def = new Map
          x[defines.key] && Object.keys(x[defines.key]).forEach(k => {
            const v = x[defines.key][k]
            if (v instanceof Map) throw "Only definitions can be Maps"
            if (concept.idToKey[+k] !== lookup && (v instanceof Map || v && !_isArray(v) && !v[defines.key] && typeof v == 'object'))
              throw "Only the definition of lookup can be an object"
            def.set(concept.idToKey[+k], v)
          })
          if (def) {
            if (x === Self)
              def = new Map(def), def.set(lookup, undefined)
            if (typeof x == 'function')
              def = new Map(def), def.set(call, func(x))
            put(def)
          } else put(func(x))
        } else throw "Unknown value to put"
      }
      function str(s) { return "`" + String(s).replace(/`|\\|${/g, s => '\\' + s) + "`" }
      function identifier(s) { return s && +s === +s || /^[_a-zA-Z]+$/.test(s) ? ''+s : '[' + str(s) + ']' }
      function func(f) { return _unevalFunction(f) }
      function isFunc(x) { return _isArray(x) && x[0] === jsEval && typeof x[1] == 'string' && (x[2] === net || x[2] === defines(Self, lookup)) && x.length == 3 }
      function method(key, v, ignoreName = false) {
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

        const defKey = Symbol('defines')

        // preload is for easier lookups. load is basically a copy of `bound` with a little notational convenience stuff thrown in.
        preload(net, globals)
        load(net, globals, true)
        Object.keys(net).forEach(k => k && +k === +k && delete net[k])

        return Initialize.call(globals, net, typeof __line != ''+void 0 ? __line.lines : undefined)

        function objectFor(x) {
          // Load {call(){}} into a trivially-callable function, as a notational convenience.
          return x && typeof x.call == 'function' && x.call !== Function.prototype.call ? x.call : Object.create(null)
        }
        function preload(from, into) {
          // Pre-create objects/functions to be filled by `load`, so that arbitrary order of definitions is permitted.
          Object.keys(from).forEach(k => {
            if (from[k] && Object.getPrototypeOf(from[k]) === Object.prototype) {
              if (into[k] === undefined) into[k] = objectFor(from[k])
              if (typeof into[k] == 'function') into[k].displayName = k
              return
            }
            else if (Array.isArray(from[k])) {
              if (into[k] === undefined) into[k] = []
              return
            }
            if (into[k] !== from[k]) into[k] = from[k]
          })
          if (from.defines) into.defines.key = defKey
          if (from._read) into._read.marks = new Map
          Object.keys(from).forEach(k => {
            if (from[k] && Object.getPrototypeOf(from[k]) === __is) {
              if (Array.isArray(from[k].is)) { // Evaluate arrays.
                const m = from[k].is.map(load)
                defines(m[0], finish) && (m[0] = defines(m[0], finish))
                return from[k] = into[k] = m[0].call(...m)
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
            if (Array.isArray(from.is)) return from = from.is.map(load), defines(from[0], finish) && (from[0] = defines(from[0], finish)), from[0].call(...from)
            else if (!(from.is in net)) throw new Error("Not a link to an existing thing: "+from.is)
            else return load(net[from.is], globals[from.is])
          }
          if (from && Object.getPrototypeOf(from) === Object.prototype) {
            // Load object values: turn {…} into {[defines.key]:{…}}, as a notational convenience.
            if (into === undefined) into = objectFor(from)
            env.set(from, into)

            if (!inLookup) {
              let d
              for (let key of Object.keys(from)) {
                if (from[key] === defKey || from[key] === _read.marks) { into[key] = from[key];  continue }
                  // Since objectFor(…) is different for functions, we have to copy.
                const k = load(__is(key))
                if (k !== call || typeof from[key] != 'function')
                  (d || (d = Object.create(null)))[_id(k)] = load(from[key], undefined, k === lookup)
              }
              return d && (into[defKey] = into !== Self ? Object.freeze(d) : d), into
            } else {
              for (let k of Object.keys(from)) {
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
      }
    },
  },

  SelfToScopedJS:{
    txt:`Converts Self to a form that has itself hidden in a scope.`,
    call(markLines = true, net = defines(Self, lookup), prefix) {
      if (!net || net[defines.key] || typeof net != 'object') throw "Invalid net"
      if (!net[_id]) throw "Net must have _id"
      if (!net[label]) throw "Net must have label"
      if (!net[concept]) throw "Net must have label"
      Object.keys(net).forEach(k => k[0] === '$' && error('$ is reserved for hidden names, use something other than', k))
      Object.keys(net).forEach(k => !_isValidIdentifier(k) && error('Not a valid JS identifier:', k))
      const names = new Map
      let n = 0
      mark(net)
      let s = [], line = 1
      prefix && write(prefix)
      write(`'use strict';(()=>{\n`)
      if (markLines) write(`const __line = function(line, func) { return __line.lines[''].push(line, func), func }\n`)
      if (markLines) write(`__line.lines = {['']:[]}\n`)
      write(`let`)
      // Put the variables to hold values.
      Object.keys(net).forEach(k => {
        if (!_isValidIdentifier(k, true)) return
        if (names.has(net[k]) && names.get(net[k])[0] === '$')
          write('\n'), names.set(net[k], k), write(k), write('='), put(net[k], true), write(',')
      })
      names.forEach((name, v) => { if (name[0] === '$') write('\n'), write(name), write('='), put(v, true), write(',') })
      write('$' + (n++).toString(36))
      write('\ndefines.key=Symbol(\'defines\')\n')
      write('finish.env=Object.create(null)\n')
      write('finish.env[_id(label)]=new Map\n')
      // Fill the values of variables in.
      names.forEach((name, v) => {
        if (_isArray(v) || defines(v, deconstruct) === undefined) if (!fill(v)) write('\n')
        if (!_isArray(v) && defines(v, deconstruct) !== undefined) {
          const d = deconstruct(v, false)
          const code = defines(d, finish) === undefined ? d[0] : defines(d, finish)
          if (!_isArray(d) || typeof code != 'function') throw "Invalid deconstruction"
          let b = 0
          write(name), write('='), put(code), write('('), d.slice(1).forEach(el => (b++ && write(','), put(el))), write(')\n')
        }
      })
      Object.keys(net).forEach(k => { // Put aliases.
        if (k === names.get(net[k])) return
        if (!_isValidIdentifier(k, true) || !_isValidIdentifier(names.get(net[k]), true)) return
        write('let '), write(k), write('='), put(net[k]), write('\n')
      })
      if (_read.marks) { // Save _read.marks too.
        if (!net._read) throw "The net has _read.marks, so it must have _read too."
        names.forEach((name, v) => {
          if (!_read.marks.has(v)) return
          write(`_read(${name}, ${_read.marks.get(v) !== undefined ? _read.marks.get(v) : _onlyUndefined})\n`)
        })
      }
      write(`\nreturn Initialize.call(typeof self !== ''+void 0 ? self : typeof global !== ''+void 0 ? global : window, `), put(net)
      if (markLines) write(`, __line.lines`)
      write(')')
      write(`\n})()`)
      return s.join('')

      function mark(x) {
        if (x == null || typeof x == 'string' || typeof x == 'number' || typeof x == 'boolean') return
        let name
        if (names.has(x)) return; else names.set(x, name = '$' + (n++).toString(36))
        try {
          if (_read.marks && _read.marks.has(x)) mark(_read.marks.get(x))
          if (!_isArray(x) && defines(x, deconstruct)) return mark(deconstruct(x, false))
          else if (x instanceof Map) x.forEach((v,k) => (mark(k), mark(v)))
          else if (_isArray(x)) x.forEach(mark)
          else if (x && !x[defines.key] && typeof x == 'object')
            Object.keys(x).forEach(k => mark(x[k]))
          else if (x && x[defines.key])
            mark(net._id),
            Object.keys(x[defines.key]).forEach(k => (mark(concept.idToKey[+k]), mark(x[defines.key][k])))
        } finally { names.delete(x), names.set(x, name) } // Ensure that all dependencies of x are ready before x.
      }
      function write(str) {
        if (markLines) line += _lineCount(str)
        s.push(str)
      }
      function put(x, ignoreName = false) {
        if (!ignoreName && names.has(x)) write(names.get(x))
        else if (!_isArray(x) && defines(x, deconstruct)) write('0')
        else if (typeof x == 'function') {
          const f = _unevalFunction(x)
          if (f[2] !== net && f[2] !== defines(Self, lookup)) throw "Can only do single-global-scope functions"
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
        const name = names.get(x)
        if (_isArray(x)) { // x.push(...)
          let b = 0
          write(name), write('.push('), x.forEach(el => (b++ && write(','), put(el))), write(')')
        } else if (x instanceof Map) // x.set(k,v).set(k,v)...
          write(name), x.forEach((v,k) => (write('.set('), put(k), write(','), put(v), write(')')))
        else if (x && !x[defines.key] && typeof x == 'object') { // x[k]=v  \n  x[k]=v  \n  ...
          Object.keys(x).forEach(k => (write(name), write(key(k)), write('='), put(x[k]), write('\n')))
          return true
        } else if (x && x[defines.key]) { // Set name[defines.key][...] one by one.
          write(name), write('[defines.key]=Object.create(null)\n')
          Object.keys[x[defines.key]].forEach(k => {
            const key = concept.idToKey[+k]
            write(name), write('[defines.key]['), put(net._id), write('('), put(key), write(')]='), put(x[defines.key][k]), write('\n')
          })
          write('Object.freeze('), write(name), write('[defines.key])\n')
          return true
        } else return true
      }
    },
  },

  System:{
    txt:`A namespace for low-level functions that must not be called in user code, for safety.`,
    future:`Have a DOM element for SelfTo*. An editable map diff (a table of key, from, to: labeled key becomes the specified value (or '' — deleted), using old labels to refer to potentially-new things), selection of the particular SelfTo*, and the resulting iframe/textarea/link. Also have SelfToGraph and SelfToHTML.`,
    lookup:{
      interrupt:__is(`interrupt`),
      deconstruct:__is(`deconstruct`),
      jsEval:__is(`jsEval`),
      SelfToReadableJS:__is(`SelfToReadableJS`),
      SelfToScopedJS:__is(`SelfToScopedJS`),
      ClearCaches:{
        txt:`When called, clears the oldest half of entries in every cache.`,
        argCount:0,
        call() {
          impure()
          halve(call.cache)
          halve(_id.xToIndex)
          halve(elemValue.obj)
          halve(elemValue.val)
          halve(_valuedColor.m)
          // halve(merge.contentToArr) // Some things could break if we don't merge stuff.
          if (_allocArray.free) _allocArray.free.length >>>= 1
          function halve(m) { if (m) _limitMapSize(m, m.size>>>1) }
        },
      },
    },
    permissionsElem(el) { el.classList.add('warning');  return el },
  },

  _escapeToInterpretation:{
    txt:`This is thrown as an exception to bail out of compiled code into the interpreter, in order to have a simpler (and more space-efficient) compiler.`,
  },
  compile:{
    txt:`Compiles a function to JS.`,
    philosophy:`I am speed.`,
    future:[
      `Inspect output if used in \`finish\`/\`function\`, fix any problems seen, and integrate.`,
      `When preparing for a call/finish, if the expr could return a promise (or always does), collect all Promise args into an array and _await(Promise.all(promises)), and on finish/call's stage, set var to var.result if a promise.`,
      `Zero-overhead {local {immutable-seeming mutable memory} management} (like an image that is drawn on, or an array sorted in-place): argClone marker (index of what to clone), and overridable clone(obj) and dispose(obj), analyzing the graph on compilation to minimize cloning.`,
    ],
    call(opt, ...a) {
      // compile undefined ^(sum a 5)
      // compile undefined ^a 5
      // compile undefined ^x ^(if a a 1) a:x+1
      // compile undefined ^x ^(if x a a) a:x+1
      // compile undefined ^x ^(if a a a) a:x+1
      // compile undefined ^x ^(last (if x a 1) a) a:x+1
      // compile undefined ^x ^(first (if x a 1) a) a:x+1
      // compile undefined ^a::1 ^b::2 4

      // Do more work before so that you could do less work after.
      if (!a.length) throw "Expected an expression to compile"

      let refCount = new Map // expr to nat
      markRefCounts(a)
      const body = a.pop()
      const loadVarsFromEnv = !a.length // true if label env can contain variable values that we'd need to load to local vars.
      const cause = opt ? opt.cause : !a.length ? body : array(_function, ...a, body) // For interrupts.
      const markLines = opt && opt.markLines || false
      const comments = opt && opt.comments || false
      const names = new Map, exprs = new Map // expr to name, name to expr, to not compile the same node twice.
      let nextVar = 0, nextEnv = 0, nextThen = 0
      // nextThen is for dynamic destination address/stage of computation-on-demand without functions.
      let freeList = [] // For variables.
      let nameToEnv = {}, envToName = new Map // For outside constants.
      let jumped = true // Whether advanceStage can omit `stage=...`.

      // For marking branches' nodes as seen-twice-but-compiled-once (multi-return).
      const inA = new Set, inB = new Set

      // Fill in "the shallowest common ancestor of a node" info so that we can exit early when re-ref-counting branches of conditionals (so we can eagerly compute nodes that belong in branches, but lazily compute those that are used afterwards).
      const currentAncestors = new Map, parents = new Map, common = new Map
      markParents(body, 0, body)
      parents.clear()

      // For on-demand computation of possibly-not-reached nodes.
      const uncomputed = Symbol(), uncertainSeenTwice = new Set, uncertainStage = new Map, uncertainThen = new Map

      const s = [], lines = markLines && []
      let line = 1
      const varsInside = new Map // a Map from inside to an immutable Set of vars
      const assigned = new Set, compiledStack = new Set
      const args = new Set

      write(`'use strict'\n`)
      write(`(FUNC PLACEHOLDER {\n`)
      write(`${outside(_checkInterrupt)}(${outside(cause)})\n`)
      write(`VARS PLACEHOLDER\n`)
      write(`try{\n`)

      // Compile assignment of args.
      if (_findRest(a) < a.length-1) {
        // a has …R: just assigning a single `...args` arg will suffice.
        args.add('...args')
        compileAssign(a, 'args')
      } else if (_findRest(a) === a.length-1) {
        // Put …R at the end, to not slice an array an extra time.
        for (let i = 0; i < a.length-1; ++i) {
          const arg = use(a[i], true)
          args.add(arg)
          compileAssign(a[i], arg)
          used(arg)
        }
        args.add('...args')
        compileAssign(a[a.length-1][1], 'args')
      } else // If no …R is in a, assign each arg.
        for (let i = 0; i < a.length; ++i) {
          const arg = use(a[i], true)
          args.add(arg)
          compileAssign(a[i], arg)
          used(arg)
        }
      assigned.clear()

      // Dump all non-var names/exprs, because we now want to execute and not just match.
        // (If assign and body share nodes, having the same ref-counting for both creates a false dependency.)
      names.forEach((name, expr) => !_isVar(expr) && (names.delete(expr), exprs.delete(name)))
      compiledStack.clear()

      let nextStage = 1
      write(`while(true)switch(stage){case 0:\n`) // Emulate goto with potential `interrupt`ions.
      write(`return ${compileExpr(body)}\n`)
      write(`}\n`)

      // `s` is the body of the function we want to return (with `args`, and inside a function that accepts all in `nameToEnv`).
      s[1] = `return (function compiled(${[...args]}) {\n`
      // Make the body able to interrupt and re-enter.
      const vars = new Array(nextVar).fill(0).map((_, i) => 'V' + i.toString(36)).filter(el => !args.has(el))
        // This makes args get re-declared as variables.
      vars.push(...new Array(nextThen).fill(0).map((_, i) => 'S' + i.toString(36)))
      s[3] = `let[stage=0,${vars}]=${outside(interrupt)}(${outside(cause)})\n`
      if (nextStage) vars.unshift('stage')
      write(`}catch(err){if(err===${outside(interrupt)})err(${outside(cause)},${vars.length})(`)
      for (let i = 0; i < vars.length; i += 4) // if (err === interrupt) interrupt(cause, vars.length)(...)(...)(...); throw err
        vars[i] && write(vars[i]),
        vars[i+1] && write(',' + vars[i+1]),
        vars[i+2] && write(',' + vars[i+2]),
        vars[i+3] && write(',' + vars[i+3]),
        vars[i+4] && write(')(')
      write(`); throw err}`)
      // Return the unadorned function.
      write(`})`)
      // log(elem('div', s.map(x => _highlightGlobalsInString(''+x))), nameToEnv) // For debugging.
      const sourceURL = new Array(16).fill(0).map(() => randomNat(16).toString(16)).join('')
      write(`//# sourceURL=${sourceURL}`)
      const result = Function(...Object.keys(nameToEnv), s.join(''))(...Object.values(nameToEnv))
      result[jsEval.ctx] = nameToEnv
      if (lines) result.lines = lines
      return result

      function write(str, comment) {
        jumped = false
        if (markLines) line += _lineCount(str)
        if (comments && comment && str[str.length-1] === '\n') str = str.slice(0,-1) + ' // ' + comment + '\n'
        s.push(str)
        return s.length-1 // Return the backpatchable index.
      }
      function markRefCounts(x) {
        // Go through the array-graph and mark the ref-count of each reachable node.
        refCount.set(x, (refCount.get(x) || 0) + 1)
        if (!_isArray(x) || refCount.get(x) !== 1) return
        if (x[0] === quote) return
        x.forEach(markRefCounts)
      }
      function markRefCountsWithin(x) {
        // Go through the array-graph and mark the ref-count of each reachable node, but don't go into nodes that are fully encapsulated within us.
        refCount.set(x, (refCount.get(x) || 0) + 1)
        if (!_isArray(x) || refCount.get(x) !== 1) return
        if (x[0] === quote) return
        if (currentAncestors.has(x) || currentAncestors.has(common.get(x))) return
        currentAncestors.set(x, x)
        x.forEach(markRefCountsWithin)
        currentAncestors.delete(x)
      }
      function use(expr, forceNew = false) {
        // Return a var name that will hold the result of expr.
        if (!forceNew && names.has(expr)) return names.get(expr)
        const name = !forceNew && freeList.length ? freeList.pop() : 'V' + (nextVar++).toString(36)
        names.set(expr, name)
        exprs.set(name, expr)
        return name
      }
      function used(name, times = 1) {
        // Decrement ref-count and mark the var as free if it won't be used anymore.
        if (!exprs.has(name)) return
        const expr = exprs.get(name)
        if (refCount.get(expr) < times) error("Freed more than used:", name, expr, s.join(''))
        refCount.set(expr, refCount.get(expr) - times)
        if (!refCount.get(expr)) {
          comments && (jumped ? (write(`// Dispose ${name}\n`), jumped = true) : write(`// Dispose ${name}\n`))
          names.delete(expr), exprs.delete(name)
          refCount.delete(expr)
          freeList.push(name)
        }
      }
      function outside(expr) {
        // Pass in expr as an outside value to the function; return the var name.
        if (typeof expr == 'number') return ''+expr
        if (envToName.has(expr)) return envToName.get(expr)
        const name = 'E' + (nextEnv++).toString(36)
        nameToEnv[name] = expr, envToName.set(expr, name)
        return name
      }
      function compileAssign(a, bVar, allowEscape = true) {
        // Emit code that matches pattern to valueVar (a subset of `_assign` without inference).
        if (_isVar(a) && refCount.get(a) === 1) return
        lines && lines.push(line, a)

        write(`if(${outside(_isArray)}(${bVar})&&${bVar}[0]===${outside(_unknown)})`)
        write(allowEscape ? `throw ${outside(_escapeToInterpretation)}\n` : `${outside(error)}(${outside("Code deciding to make the caller infer things is illegal")})\n`, `no inference here`)

        const demandEq = !_isArray(a) || a[0] === _const
        if (!demandEq && assigned.has(a)) { // if (a !== b) error(…)
          write(`if(${use(a)}!==${bVar})${outside(error)}(${outside("Non-matching graph: expected")}, ${use(a)}, ${outside("for")}, ${outside(a)}, ${outside("but got")}, ${bVar})\n`, `cyclic check`)
          return
        } else assigned.add(a)
        if (_isVar(a) && names.get(a) === bVar) return
        if (_isVar(a))
          write(`${use(a)}=${bVar}\n`, `var assign`) // a=b
        const err = `${outside(error)}(${outside(a)},${outside("cannot be assigned")},${bVar})\n`
        if (!demandEq) {
          write(`if(${outside(a)}!==${bVar}){\n`, `destructure array`)
          write(`if(!${outside(_isArray)}(${bVar}))${err}`, `expected an array`)
          const Rest = _findRest(a)
          if (Rest < a.length) {
            write(`if(${bVar}.length<${a.length-1})${err}`, `too few args`)
            // Compile assignments of each item before …R, and each item after …R, and rest-pattern to b.slice(…).
            for (let i = 0; i < Rest; ++i) {
              const name = use(a[i])
              write(`${name}=${bVar}[${i}]\n`)
              compileAssign(a[i], name), used(name)
            }
            for (let i = Rest+1; i < a.length; ++i) {
              const name = use(a[i])
              write(`${name}=${bVar}[${bVar}.length+${i - a.length}]\n`)
              compileAssign(a[i], name), used(name)
            }
            const name = use(a[Rest][1])
            write(`${name}=${bVar}.slice(${i},${bVar}.length+${Rest - a.length + 1})\n`)
            compileAssign(a[Rest][1], name), used(name)
          } else {
            // If b.length is different from a.length, error.
            write(`if(${bVar}.length!=${a.length})${err}`, `array length is unexpected`)
            // Else for each item, put b[i] into a[i]-associated var, compileAssign(a[i], name), then free the name.
            for (let i = 0; i < a.length; ++i) {
              const name = use(a[i])
              write(`${name}=${bVar}[${i}]\n`, `assign array item`)
              compileAssign(a[i], name), used(name)
            }
          }
          write(`}\n`)
        } else 
          write(`if(${outside(a)}!==${bVar})${err}`, `demand ref-equality`)
      }
      function advanceStage(cause) {
        !jumped && write(`stage=${nextStage};`)
        return write(`case ${nextStage}:\n`, comments && cause !== undefined && serialize(cause, fancy)), nextStage++
      }
      function compileFinish(x, into) {
        // Spill vars inside into label-env, then do finish (emit call with outside args, then used() on each arg), then load vars.
        spillVars(x)

        const start = s.length
        const args = x.map((el, i) => !i ? use(el) : outside(el))

        if (start !== s.length)
          if (_isArray(x[0]) || !defines(x[0], noInterrupt))
            advanceStage(x)

        write(`${into}=${outside(defines)}(${args[0]},${outside(finish)})(${args.slice(1)})\n`, `finish`)
        used(args[0])

        loadVars(x)
      }
      function isRest(x) { return _isArray(x) && x[0] === rest && x.length == 2 }
      function compileCall(x, into) {
        // Compile args, emit call, then used() on each arg. Emit each statically-known …R as ...R.
        const start = s.length
        const args = x.map((el, i) => !i || !isRest(el) ? compileExpr(el) : compileExpr(el[1]))

        if (start !== s.length)
          if (_isArray(x[0]) || !defines(x[0], noInterrupt))
            advanceStage(x)

        write(`${into}=${args[0]}(${args.slice(1).map(arg => !isRest(arg) ? arg : '...'+arg)})\n`, `call`)
        args.forEach(used)
      }
      function compileStruct(x, into) {
        // Compile args, then create-and-fill-and-merge the struct — array(...) (or [...] if head is statically-known and !_shouldMerge).
        const args = x.map(el => !isRest(el) ? compileExpr(el) : compileExpr(el[1]))

        write(`${into}=[]\n`)
        write(`${into}.push(${args.map(arg => !isRest(arg) ? arg : '...'+arg)})\n`, `struct`)
        if (_isArray(x[0]) || _shouldMerge(x))
          write(`${into}=${outside(_maybeMerge)}(${args.map(arg => !isRest(arg) ? arg : '...'+arg)})\n`)
        args.forEach(used)
      }
      function markParents(x, _i, parent) {
        // Fill in "the shallowest common ancestor of a node" info.
        if (!_isArray(x)) return
        if (x[0] === quote) return
        if (!parents.has(x)) { // Set the immediate parent.
          parents.set(x, parent)
          currentAncestors.set(x, currentAncestors.size)
          let shallowest = x
          for (let i = 0; i < x.length; ++i) {
            const p = markParents(x[i], 0, x)
            if ((currentAncestors.get(p) || 0) < currentAncestors.get(shallowest))
              shallowest = p
          }
          currentAncestors.delete(x)
          common.set(x, shallowest)
          return shallowest
        } else { // Seen this twice or more; find the least common ancestor.
          let old = parents.get(x)
          while (!currentAncestors.has(old) && parents.has(old) && old !== parents.get(old))
            old = parents.get(old)
          parents.set(x, old)
          return old
        }
      }
      function dynamicReturnWhenSeenTwice(a, ...b) {
        // Marks-as-uncertain all nodes seen from both branches unless shrouded by uncertainty.
        if (!_isArray(a) || !_isArray(b)) return
        markA(a), b.forEach(markB)
        assigned.clear(), inA.clear(), inB.clear()

        function markA(x) {
          if (!_isArray(x)) return
          if (x[0] === quote) return
          if (currentAncestors.has(common.get(x))) return
          if (uncertainStage.has(x) || names.has(x)) return
          if (inA.has(x)) return; else inA.add(x)
          currentAncestors.set(x, x)
          x.forEach(markA)
          currentAncestors.delete(x)
        }
        function markB(x) {
          if (!_isArray(x)) return
          if (x[0] === quote) return
          if (currentAncestors.has(common.get(x))) return
          if (uncertainStage.has(x) || names.has(x)) return
          if (inB.has(x)) return; else inB.add(x)
          if (inA.has(x))
            return uncertainSeenTwice.add(x), uncertainStage.set(x, null), uncertainThen.set(x, null)
          currentAncestors.set(x, x)
          x.forEach(markB)
          currentAncestors.delete(x)
        }
      }
      function compileIf(x, into) {
        // condition = ...
        // if (condition !== true) goto ELSE
        // THEN: ... goto RESULT
        // ELSE: ...
        // RESULT: ...
        const cond = compileExpr(x[1])
        let thenStage, elseStage
        write(`if(${cond}!==true){stage=`), elseStage = write(`ELSE`), write(`;continue}\n`)
        used(cond)
        let result
        dynamicReturnWhenSeenTwice(x[2], x[3])
        result = compileExpr(x[2]), write(`${into}=${result};stage=`), thenStage = write(`RESULT`), write(`;continue\n`), jumped = true

        // Ensure that uncertain-if-computed args get computed once needed, in branches or afterwards.
        // Mark ref-counts in both branches, and for each node less than the global, mark it as uncertain, to be computed on demand.
        const prevRefs = refCount;  refCount = new Map
        markRefCountsWithin(x[2]), markRefCountsWithin(x[3])
        const walk = x => {
          if (!_isArray(x) || !refCount.has(x)) return
          if (refCount.get(x) < prevRefs.get(x) && x[0] !== _if && !uncertainStage.has(x))
            write(`${use(x)}=${outside(uncomputed)}`), uncertainSeenTwice.delete(x), uncertainStage.set(x, null), uncertainThen.set(x, null)
          refCount.delete(x)
          x.forEach(walk)
        }
        refCount.clear();  refCount = prevRefs

        used(names.get(x[2]))
        s[elseStage] = advanceStage(x[3]), result = compileExpr(x[3]), write(`${into}=${result}\n`)
        used(names.get(x[3]))
        s[thenStage] = advanceStage(x)
      }
      function compileLast(x, into) {
        dynamicReturnWhenSeenTwice(x[1], ...x.slice(2))
        for (let i = 1; i < x.length-1; ++i)
          used(compileExpr(x[i]))
        write(`${into}=${compileExpr(x[x.length-1])}\n`, `last`)
      }
      function compileExpr(x, into) {
        // Return a var that holds the result of finishing x.
        if (!_isVar(x) && !_hasCallableParts(x)) return outside(x)
        if (x[0] === quote) return outside(x[0])
        if (compiledStack.has(x)) return _isStruct(x) ? use(x) : outside(cycle)
        const firstTime = names.has(x)
        const name = into === undefined ? use(x) : into
        lines && lines.push(line, x)

        // Compute on demand.
        let uncertain, backpatch
        if (uncertainStage.get(x) === null) { // Our first time seeing this; emit a computable-on-demand stage.
          uncertainStage.set(x, nextStage)
          uncertainThen.set(x, uncertain = 'S' + (nextThen++).toString(36))
        }
        if (uncertainStage.has(x)) { // Compute (goto stage then goto our next stage) if not computed.
          if (!uncertainSeenTwice.has(x))
            write(`if(${name}===${outside(uncomputed)})`)
          write(`{${uncertainThen.get(x)}=`)
          backpatch = write(uncertain || nextStage)
          write(`;stage=${uncertainStage.get(x)};continue}\n`, `computed return`)
          if (uncertainSeenTwice.has(x)) jumped = true
          advanceStage(x)
        }
        // Store results of nodes in vars as needed.
        if (firstTime || _isVar(x)) {
          if (loadVarsFromEnv && _isVar(x) && (!firstTime || uncertainThen.has(x)))
            write(`${use(x)}=${outside(finish)}.env[${_id(label)}].get(${outside(x)})\n`, `load var from env`)
          return use(x)
        }
        if (!loadVarsFromEnv && _isVar(x))
          error("A var in body that was not assigned:", x)

        compiledStack.add(x)
        try {
          if (!compiledStack.has(x[0]) && !_hasCallableParts(x[0], true) && (!_isArray(x[0]) || defines(x[0], finish) !== undefined || defines(x[0], call) !== undefined)) {
            if (x[0] === _if && x.length == 4)
              return compileIf(x, name), name
            else if (x[0] === last)
              return compileLast(x, name), name
            else if (defines(x[0], finish) !== undefined)
              return compileFinish(x, name), name
            else if (defines(x[0], call) !== undefined)
              return compileCall(x, name), name
            else
              return compileStruct(x, name), name
          } else {
            // Basically what's above, but deferred to runtime (and without special-casing `if`/`last`, because what are the chances).
            // First compile finishing of the code, then emit checks, then compile branches (ensuring that each is in a separate interrupt-stage and jumps to the resulting stage) and backpatch.
            const code = compileExpr(x[0])
            let finishStage, callStage, structStage
            write(`if(!${outside(_isArray)}(${code})){\n`, `branch on code`)
            write(`if(${outside(defines)}(${code},${outside(finish)})!==undefined){stage=`), finishStage = write(`FINISH`), write(`;continue}\n`)
            write(`if(${outside(defines)}(${code},${outside(call)})!==undefined){stage=`), callStage = write(`CALL`), write(`;continue}\n`)
            write(`}else{stage=`), structStage = write(`STRUCT`), write(`;continue}\n`)
            jumped = true
            x.forEach(el => dynamicReturnWhenSeenTwice(el, el))
            s[finishStage] = advanceStage(comments && [finish, x]), x.forEach(markRefCounts),
              compileFinish(x, name), write(`stage=`), finishStage = write(`RESULT`), write(`;continue\n`, `goto result`), jumped = true
            s[callStage] = advanceStage(comments && [call, x]), x.forEach(markRefCounts),
              compileCall(x, name), write(`stage=`), callStage = write(`RESULT`), write(`;continue\n`, `goto result`), jumped = true
            s[structStage] = advanceStage(comments && [_isStruct, x]), x.forEach(markRefCounts),
              compileStruct(x, name)
            s[finishStage] = s[callStage] = advanceStage(x)
            for (let i = 0; i < x.length; ++i) used(names.get(x[i]))
            return name
          }
        } finally { uncertain != null && (write(`stage=${uncertain};continue\n`), jumped = true, s[backpatch] = advanceStage()); compiledStack.delete(x) }
      }
      function spillVars(inside) {
        const vars = getVars(inside)
        if (!vars) return
        write(`${outside(finish)}.env[${_id(label)}]`)
        for (let v of vars.keys()) write(`.set(${outside(v)},${use(v)})`)
        write(`\n`, `spill vars`)
      }
      function loadVars(inside) {
        const vars = getVars(inside)
        if (!vars) return
        for (let [v, parents] of vars)
          if (names.has(v) && used(names.get(v), parents.size), refCount.get(v))
            write(`${use(v)}=${outside(finish)}.env[${_id(label)}].get(${outside(v)})\n`, `load vars`)
      }
      function getVars(inside, parent) {
        // Return a Map from vars to a Set of where they are referenced (so that ref-count coincides with what we marked, we could free vars properly).
        if (!_isArray(inside)) return
        if (inside[0] === quote) return
        if (_isVar(inside) && parent === undefined) return new Map([[inside, new Set]])
        if (varsInside.has(inside)) return varsInside.get(inside)
        varsInside.set(inside, null)
        let r = null, copied = false
        for (let i = 0; i < inside.length; ++i) {
          if (!_isVar(inside[i])) {
            let sub = getVars(inside[i], inside)
            if (!r) r = sub
            else if (sub)
              !copied && (r = new Map(r), copied = true),
              sub.forEach((parents, x) => r.set(x, !r.has(x) ? parents : new Set([...r.get(x), ...parents])))
          } else { // Same as the above branch, but create parts of the Map as needed.
            if (!r) r = new Map([[inside[i], new Set([inside])]])
            else if (sub)
              !copied && (r = new Map(r), copied = true),
              r.set(inside[i], !r.has(inside[i]) ? new Set([inside]) : new Set([...r.get(inside[i]), inside]))
          }
        }
        varsInside.set(inside, r)
        return r
      }
    },
  },

  noInterrupt:{
    txt:`A marker that a function cannot interrupt, directly or indirectly.`,
  },

  _allocArray:{
    txt:`_allocArray()⇒Array as a replacement for \`[]\` and _allocArray(Array) to re-use memory.`,
    call(a) {
      if (!_allocArray.free) _allocArray.free = []
      if (!a) return _allocArray.free.length ? _allocArray.free.pop() : []
      if (!_isArray(a)) throw "Expected undefined or an array"
      a.length = 0
      _allocArray.free.push(a)
    },
  },

  either:{
    txt:`Used as the head of a collection of values and functions to act on values.`,
  },

  _structHash:{
    txt:`Returns an object that's equal for equally-decomposed (mutually assignable) objects, so trying assignment could be replaced by a lookup then trying. Optimized for \`?::(type ? ?)\`.`,
    call(x) {
      if (!_structHash.dependent) _structHash.dependent = Symbol('dependent'), _structHash.context = Symbol('context')
      if (!_isArray(x) || !x.length || x[0] === _const) return x
      if (x[0] === either || !_isArray(x[0]) && typeof defines(x[0], uses) == 'function') return _structHash.context
      if (_isVar(x)) return _structHash.dependent
      x = x[x.length-1]
      if (!_isArray(x) || !x.length || x[0] === _const) return x
      if (x[0] === either || !_isArray(x[0]) && typeof defines(x[0], uses) == 'function') return _structHash.context
      if (_isVar(x)) return _structHash.dependent
      x = x[0]
      return _hasCallableParts(x) ? _structHash.dependent : x
      // .dependent, .context
    },
  },

  // And also  a function for constructing and updating structural-hash maps of contexts, yes?

  uses:{
    txt:`(uses Context …Values): returns a sub-context of all functions that can accept every value as one of their args.`,
    call(ctx, ...values) {
      if (!_isArray(ctx) || ctx[0] !== either) error("Expected a context, got", ctx)
      if (!uses.stack) uses.stack = new Set
      if (uses.stack.has(ctx)) return null
      _checkInterrupt()
      let [i = 1, result] = interrupt(uses)
      uses.stack.add(ctx)
      try {
        for (; i < ctx.length; ++i) {
          const v = ctx[i]
          if (_isFunction(v)) {
            // If every value has a place in args, push the function to result.
            // Go through values
              // Go through function args; if we cannot readonly-assign to an arg, continue the ctx-loop.
            if (!result) result = _allocArray(), result.push(either)
            result.push(v)
          }
          if (_isArray(v) && v[0] === either || !_isArray(v) && typeof defines(v, uses) == 'function') {
            const sub = _isArray(v) ? uses(v, ...values) : defines(v, uses).call(undefined, v, ...values)
            // Recurse/call and re-unite.
              // Do we want to maintain a Set to ensure the lack of repetition? Probably not worth the effort, right?
          }
        }
        return result ? merge(result) : null
      } catch (err) { if (err === interrupt) interrupt(uses, 2)(i, result);  throw err }
      finally { uses.stack.delete(ctx) }
      // .stack
    },
  },

  apply:{
    // apply(func, ctx, ...values) — apply a function with all values taken and each arg randomly picked out from ctx.
  },

  pick:{
    txt:`Picks any option from presented ones (an array or the count of options), possibly explicitly attached to a cause.`,
    philosophy:`Intended to be a target for future developments in structural learning, so that choices can be improved.`,
    future:`\`picker (N Cause PrevPicker)→Result Expr\`.
Index-based per-cause choice optimization (a base that could optimize more advanced optimizer families):
\`pick.best Result→Measure Expr\`, blending estimated-measures of all choices made during evaluation into Measure.
\`pick.sample Result→ProbabilityAdjustment Expr\`, adding probability to all.
\`best Metric Expr Repeats=2\`, journaling everything and commiting.`,
    call(from, cause = finish.v) {
      // Just defer to what env demands of us.
        // (It should be completely branch-to-_read-or-randomNat, and generators should only really modify modification.)
        // (Should have a function for that branching, because the current always-random is non-extensible.)
      return finish.env[_id(pick)](from, cause)
    },
  },

  pickExpr:{
    future:[
      `Cached-per-context structural filters (Maps from thing-at-path to arrays): _filterExactType (in a special \`?\` slot if the type contains vars), _filterInputType, _filterOutputType.`,
        // Do we really need _filterOutputType if we will just partially-evaluate everything for max precision?
        // (If not, could just merrily pick+apply-random-function-until-satisfied.)
      `pickExpr(Ctx, Pattern = [typed, [_var], Output]).`,
        // Ctx is just an array of expressions to pick from, right?
      // (The choices should be able to return an unknown, and record the choice, if they want.)
    ], 
  },

  using:{
    future:[
      `Function families \`using …Args Ctx\`, where Ctx could be \`(either  a::In  b::In  x::In->x+1::In  (function  a::In  b::In  a+b::Med)  x::Med->x*2::Output)\`, using \`pick\` to optimize choices.`,
      `\`Output\` to use as the type marker of \`using\`'s output, to separate intermediate computations and result candidates.`,
      `All current REPL outputs as a context. Have contexts be composable — \`either\`?`,
    ],
    philosophy:`No matter how fancy optimization algorithms get, there is nothing more fundamental than "use any of these things in any way you want".
But how to make such an immaterial thing perform as well as the particulars? Must enrichen it without end, I think.

Usage suggestions pulled in and tried with but a click. Code libraries used not by naming their functions manually, but by automatically connecting user's typed inputs easily, optimized for a user's purposes. networks of applicable meaning, made to try and discard everything as wanted. Slightly convenient.`,
  },
})
})()
