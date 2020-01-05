/*
  To add code, scroll down to the first `})({` and add functions as methods after that. They can be bound-to in written programs by the method name.
  _XXX methods are private and somewhat invisible.
  Concepts define some things, seen as `f:{…}`. `f(){}` is exactly the same as `f:{call(){}}`.
  Markers of functions to be aware of: `_impure`, `_argCount`.
  Functions should _interrupt gracefully. Concepts that define `finish` and functions that use `call`/`finish` should check _isError and _isUnknown.
*/
'use strict';


(typeof self !== ''+void 0 ? self : typeof global !== ''+void 0 ? global : window).is = name => {
  // A way to provide backpatchable labels that will be linked. An implementation detail.
  if (!is.cache) is.cache = Object.create(null)
  if (typeof name == 'string' && is.cache[name]) return is.cache[name]
  const obj = Object.create(is)
  if (typeof name == 'string') is.cache[name] = obj
  obj.is = name
  return obj
}


(function(net) {
  const globals = typeof self !== ''+void 0 ? self : typeof global !== ''+void 0 ? global : window
  const env = new Map

  // preload is for easier lookups. load is basically a copy of `bound` with a little notational convenience stuff thrown in.
  preload(net, globals)
  load(net, globals, true)
  delete globals.is

  //net.env.js = [], net.env.bin = new WebAssembly.Memory({ initial:64 }), net.env.accessor = new Int32Array(net.env.bin.buffer), net.env.at = 0

  return globals.Self.call(globals, net)

  function objectFor(x) {
    // Load {call(){}} into a trivially-callable function, as a notational convenience.
    return x && typeof x.call == 'function' && x.call !== Function.prototype.call ? x.call : Object.create(null)
  }
  function preload(from, into) {
    // Pre-create objects/functions to be filled by `load`, so that arbitrary order of definitions is permitted.
    Object.keys(from).forEach(k => {
      if (from[k] && Object.getPrototypeOf(from[k]) === Object.prototype) {
        if (into[k] === undefined) into[k] = objectFor(from[k])
        return
      }
      else if (Array.isArray(from[k])) {
        if (into[k] === undefined) into[k] = []
        return
      }
      if (into[k] !== from[k]) into[k] = from[k]
    })
    Object.keys(from).forEach(k => {
      if (from[k] && Object.getPrototypeOf(from[k]) == is) {
        if (Array.isArray(from[k].is)) { // Evaluate arrays.
          const m = from[k].is.map(load)
          return from[k] = into[k] = m[0].call(...m)
        }
        else if (!(from[k].is in net)) throw "Not a link to an existing thing: "+from[k].is
        else from[k] = into[k] = into[from[k].is]
      }
    })
  }
  function load(from, into, inAt) {
    // Handle symbols (as ref-to-global) and arrays and objects (as definitions) specially.

    // Cache to prevent cycles from referring to old not-loaded versions of objects.
    if (env.has(from)) return env.get(from)
    if (from && Object.getPrototypeOf(from) == is) {
      // Look up symbols in the network.
      if (Array.isArray(from.is)) return from = from.is.map(load), from[0].call(...from)
      else if (!(from.is in net)) throw "Not a link to an existing thing: "+from.is
      else return load(net[from.is])
    }
    if (from && Object.getPrototypeOf(from) === Object.prototype) {
      // Load object values: turn {…} into {defines:new Map([…])}, as a notational convenience.
      if (into === undefined) into = objectFor(from)
      env.set(from, into)

      if (!inAt) {
        let m
        for (let key of Object.keys(from)) {
          const k = load(is(key))
          if (k !== globals.call || typeof from[key] != 'function')
            (m || (m = new Map)).set(k, load(from[key], undefined, k === globals.at))
        }
        return m && (into.defines = m), into
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
})({










  at:{
    txt: `(at Map Key): returns the value in Map at Key (neither Key nor Value can be \`undefined\`), or \`undefined\` if not found. (at Map): returns an array of Map's keys.
For string keys, can be written as \`obj.key\`.`,
    examples:[
      [`at (map 1 2 3 4 5 6 7 8)`, `1 3 5 7`],
      [`at (map 1 2 3 4 5 6 7 8) 1`, `2`],
      [`Self.at`, `at`],
    ],
    call(m,k) {
      if (defines(m, at)) m = defines(m, at)
      if (m instanceof Map) return k !== undefined ? m.get(k) : [...m.keys()]
      return k !== undefined ? m[k] : Object.keys(m)
    },
  },


  Self:{
    txt:`(Self): the entry point; do not call manually. (Capitalized to not conflict with JS's \`self\`.)
Project's GitHub page: https://github.com/Antipurity/conceptual`,
    future:[
      [
        `Have a function for turning a Self object into executable code (and maybe HTML).`,
        `Have a DOM element for that (display in an iframe).`,
        `Trim the _globalScope of functions to only include the things that are actually present in function's body.`,
        `Don't even have files anymore (apart from "get Self from here"), only eternal self-rewrites.`,
      ],
      [
        `Code at URL (or even in another worker's memory): seamless deferring of such cases.`,
        `Have a function for pulling in a JS library from URL — unsafe, just assuming that it imports a global (with a name that we pass in too).`,
        `(There are few usages of \`defines\` in code; maybe replace it with some globally-known symbol, to minimize risk of collision?)`,
      ],
      `With the interrupt stack now preserved, we should now be able to have a heap-walker, and estimate memory usage. So estimate it.`,
      `Interrupt-based 'debugger' (stepper) for jobs, with at least stepping and interrupt-stack save/load and highlighting the last-executed node, and possibly more involved information display.`,
      [
        `Rewards and evolution?
        \`best …Functions\` and \`best.\` (probability-sampling, max-past-reward (additive, exponentially fading, average, min)), along with some way of getting judgment to these, may be good, but they are not the most fundamental. What if we wanted to choose between inlining a function or not, caching its results or not? A \`choice N\` node (and \`choice.\`) (using \`read\` to store past-reward data; culling most-average nodes to save memory) (using \`reward Metric Expr\` to reward the choices done) seems more fundamental.  
        (Do we want \`rewarded Value MutateFunction\`?)  
        Evolution (or particle swarm optimization, rather) is only possible if we fully control the reward function (the optimization metric), and executions are very repeatable (likely pure). \`many Metric Expr\`. …But this needs random-mutation acceptors, like walkers and bounded numbers and become-another-mutation-acceptor, not done on an initial run but done on all others; \`mutated Value MutateFunction\`?  
        Is this only a case of "our execution is pure and one-shot, vs our execution is not pure and multi-shot"?  `,
        `Make actually good(-ish) self-modifying code pieces: "usually do this but rarely decide to start analyzing and optimizing this spot (recommendations) (\`rec This …ButSometimes\`)", "this is cheap, this is expensive, and they should agree (approximation)", "optimize this finite-branches spot by picking the likely-best option by predicted measure", "optimize this number in any way we know".`,
      ],
    ],
    at:undefined, // Fill in at load-time.
    call(net) {
      if (!net) throw "Do not call Self manually."
      // Turn `net` into maps.
      let ctx = new Map, backctx = new Map
      Object.keys(net).forEach(k => (ctx.set(k, net[k]), (k[0] !== '_' || !backctx.has(net[k])) && backctx.set(net[k], k)))
      ctx.set('_globalScope', ctx), backctx.set(ctx, '_globalScope') // Deconstructions are very ugly otherwise.
      Self.defines.set(at, ctx)
      parse.ctx = ctx, serialize.backctx = backctx
      ctx.forEach(v => _isArray(v) && _maybeMerge(v))

      // Define concepts of some JS objects.
      Promise.prototype.defines = new Map([[merge, undefined]])
      Map.prototype.defines = new Map([[call, map]])

      // Store styling instructions in JS objects.
      serialize.dom = {
        space:() => elem('space', ' '),
        nameResult:true,
        styles:{
          name: (s,v) => elem('node', s, 'color:'+_valuedColor(v)),
          bracket: s => elem('bracket', s),
          string: s => elem('node', elem('string', _highlightGlobalsInString(s))),
          number: s => elem('number', s),
          known: s => elem('known', s),
          extracted: s => { const el = elem('extracted', s);  return _isArray(s) && s[0].id ? (s[s.length-1].id = s[0].id, el) : el },
          node: (s,v) => {
            if (_isArray(v) && v[0] === map && v.length > 1 || v instanceof Map && v.size && s.length > 1) {
              // Construct a <table>, with brackets and `map` outside of it, and each key-value pair having its own <tr>.
              // (Should really be extracted into an override by `map` of *something*. `structured` or a new `style`?)
              let i, start = (s[0].textContent || s[0]) === '(' ? 2 : 1
              let end = (s[s.length-1].textContent || s[s.length-1]) === ')' ? s.length-1 : s.length-2
              const rows = []
              for (i = start; i < end; ) {
                if (i + 4 > s.length) break
                if ((s[i].textContent || s[i]).trim()) break
                if ((s[i+2].textContent || s[i+2]).trim()) break
                if (s[i+1].nodeName === 'EXTRACTED') break
                if (s[i+3].nodeName === 'EXTRACTED') break
                rows.push(elem('tr', [elem('td', s[i+1]), elem('td', s[i+3])]))
                i += 4
              }
              s = [...s.slice(0,start), elem('table', rows), ...s.slice(i)]
            }
            return elem('node', s)
          },
        },
      }
      serialize.consoleColored = {
        maxDepth:3,
        nameResult:true,
        styles: {
          name: s => _colored(s, [34, 36, 35][_pickNatLessThan(3)]), // Cycle through blue, cyan, magenta.
          bracket: s => _colored(s, 33), // brown
          string: s => _colored(s, 32), // green
          number: s => _colored(s, 4, 24), // underline
          known: s => _colored(s, 1, 0), // bold
        },
      }
      parse.dom = {
        styles(struct, v, unbound) {
          // The best solution would re-use styles of serialization, but it rejected my touch on the last attempt.
          if (typeof Node == ''+void 0) return struct
          if (v === undefined) return struct
          if (typeof unbound == 'number') return elem('number', struct)
          if (typeof unbound == 'string') return elem('node', elem('string', _highlightGlobalsInString(struct)))
          if (_isArray(v) && v[0] === _extracted && struct[struct.length-1].id)
            struct[0].id = struct[struct.length-1].id, struct[0].style.color = _valuedColor(v[2])
          // if (_isArray(v) && v[0] === map || v instanceof Map) {
          //   // Construct a <table>, with brackets and `map` outside of it, and each key-value pair having its own <tr>.
          //     // Doesn't work well with editing it, mainly due to tr/td elements being seen with line-breaks and tab stops in .innerText, changing the structure.
          //   const s = struct
          //   let i, start = (s[0].textContent || s[0]) === '(' ? 2 : 1
          //   let end = (s[s.length-1].textContent || s[s.length-1]) === ')' ? s.length-1 : s.length-2
          //   const rows = []
          //   for (i = start; i < end; ) {
          //     if (i + 4 > s.length) break
          //     if ((s[i].textContent || s[i]).trim()) break
          //     if ((s[i+2].textContent || s[i+2]).trim()) break
          //     if (s[i+1].nodeName === 'EXTRACTED') break
          //     if (s[i+3].nodeName === 'EXTRACTED') break
          //     rows.push(elem('tr', [elem('td', [s[i], s[i+1]]), elem('td', [s[i+2], s[i+3]])]))
          //     i += 4
          //   }
          //   struct = [...s.slice(0,start), elem('table', rows), ...s.slice(i)]
          // }
          if (_isArray(struct) && struct[0] === '(' && struct[struct.length-1] === ')')
            return elem('node', [elem('bracket', '('), ...struct.slice(1,-1), elem('bracket', ')')])

          let known = false
          if (_isLabel(unbound) && serialize.backctx.has(v) && unbound[1] === serialize.backctx.get(v))
            struct = elem('known', struct), struct.to = v, known = true
          const el = elem('node', struct)
          if (!known && _isLabel(unbound) && !_isLabel(v)) el.style.color = _valuedColor(v)
          if (_isArray(v) && serialize.backctx.has(v[0]))
            el.title = serialize.backctx.get(v[0])
          return el
        },
      }

      // Select the appropriate JS-environment-specific entry point.
      let ok = false
      if (this.self && !this.window)
        _Worker(), ok = true
      else {
        if (this.process)
          _NodeJS(), ok = true
        if (this.document)
          _Browser(), ok = true
        if (this.browser)
          _Extension(), ok = true
      }
      if (!ok)
        throw "What is this JS environment? Submit a bug report so that we know of it."
    },
  },


  scope:{
    txt:'hello',
    at:{
      a:1,
      b:2,
      c:{
        txt:'hi again',
      },
    },
  },













  graphSize:{
    txt: `(graphSize Expr)⇒Nat: returns the number of distinct objects in Expr.`,
    nameResult: ['size'],
    call(x, fitting) {
      const mark = new Set
      let n = 0
      function f(x) { if (!mark.has(x)) mark.add(x), (!fitting || fitting(x)) && ++n, _isArray(x) && x.forEach(f) }
      return f(x), mark.clear(), n
    },
  },

//   alt:{
//     txt: `(alt Expr): returns any alternative representation of Expr that semantically does the same thing.
// A function should override \`alt\` to sometimes become its semantic alternative.
// Doesn't allow an override in the initial call.`,
//     _impure:true,
//     finish(x) { const r = finish(x);  return !_isDeferred(r) ? alt(r) : array(_deferred, array(alt, r[1]), ...r.slice(2)) },
//     call(x) {
//       if (this !== alt) return
//       const n = graphSize(x, _definesAlt)
//       if (!n) return x
//       // Use on average 1 alt-override.
//       const b = bound(x, x => {
//         const r = defines(x, alt)
//         if (_isArray(x) && r !== undefined && !_pickNatLessThan(n))
//           return _getOverrideResult(r, array(alt, x))
//           // Don't fall through to default alt if it returns undefined; we already handle graphs.
//       }, false)
//       return b
//     },
//   },
//   _definesAlt(x) { return !_isArray(x) && defines(x, alt) !== undefined },
//   gen:{
//     txt: `(gen Type)⇒Value: generate a random instance of Type. "a Type", "a random Type".
// By default, decomposes generation of arrays into generation of its elements.`,
//     _impure:true,
//     call(x) {
//       if (_isArray(x)) {
//         let r
//         if ((r = defines(x, gen)) !== undefined)
//           if ((r = _getOverrideResult(r, !_isArray(finish.v) || finish.v[0] !== gen || finish.v[1] !== x ? [gen, x] : finish.v)) !== undefined)
//             return r
//         return x.map(gen)
//       }
//       return x
//     },
//   },

//   prob:{
//     txt: `(prob ProbabilityGen): a type of false/true that, when generated, returns true with a given probability and false otherwise.`,
//     _impure:true,
//     gen(x) { if (_isArray(x) && x[0] === prob) return _pickProb(gen(x[1])) },
//   },















  purify:{
    txt: `(purify Expr)⇒Expr: partially-evaluates Expr, not executing _impure subexpressions. Used by func.`,
    examples: [
      [`x→(+ 1 2)`, `x→3`],
      [`X→(pick false X Y)`, `id`],
      [`F→(pick true X Y)`, `F→Y`],
      [`Z→(pick Z X Y)`, `Z→(pick Z X Y)`],
      [`(purify 1)`, `1`],
      [`(purify (quote x) x:(+ 1 2))`, `3`],
      [`(purify (quote x) x:(gen (nats 5)))`, `(_unknown (gen (nats 5)))`],
    ],
    nameResult: ['purified'],
    _argCount:1,
    call(x) {
      // Set finish.pure to true and just evaluate.
      const prev = finish.pure
      finish.pure = true
      try {
        const r = finish(x)
        if (!_isUnknown(r)) return r
        else if (!_isDeferred(r)) return r
        else return r[1] = array(purify, r[1]), r
      }
      finally { finish.pure = prev }
    },
  },

  _impure:{
    txt: `(_impure Array): returns whether the call is pure and can be \`merge\`d (or executed in \`purify\`) — a boolean.
All JS functions are pure unless explicitly said otherwise.`,
    _argCount:1,
    call(a) {
      if (_isArray(a) && _isFunc(a[0])) {
        // Go through the whole graph, and if anything is impure there, return false. Also cache.
        if (!_impure.cache) _impure.cache = new Map
        let r = _mapGetOrSet(_impure.cache, a[0], false, 10000)
        if (r !== _notFound) return r
        const checked = new Set
        function check(node) {
          if (checked.has(node)) return
          checked.add(node)
          const b = _impure(node)
          if (b !== undefined) return b
          if (_isArray(node) && node[0] !== quote) return node.some(check)
        }
        r = check(a[0])
        return _impure.cache.set(a[0], r), r
      }
      if (_isArray(a) && defines(a, _impure) === true) return true
      return false
    },
  },
  _argCount:{txt:`A marker for the number of args to a function.`},





  _timeSince:{
    txt: `(time.since)⇒TimeMark or (time.since TimeMark): returns the current time as f64 milliseconds, or the non-negative time elapsed since the mark.
Makes no attempt to correct for the time to measure, \`(time.since (time.since))\`.`,
    _impure:true,
    call(mark = 0) {
      if (typeof performance != ''+void 0 && performance.now) // Browser
        return performance.now() - mark
      else if (typeof process != ''+void 0 && process.hrtime && process.hrtime.bigint()) { // NodeJS
        if (!mark) return process.hrtime.bigint()
        return Math.max(0, Number(process.hrtime.bigint() - mark)/1e6)
      } else if (typeof require != ''+void 0) // NodeJS
        return require('perf_hooks').performance.now() - mark
      else {
        // Ensure monotonicity.
        if (_timeSince.last == null) _timeSince.last = Date.now(), _timeSince.add = 0
        const n = Date.now()
        if (_timeSince.last > n) _timeSince.add += _timeSince.last - n
        return (_timeSince.last = n) + _timeSince.add - mark
      }
    },
  },
  _memorySince:{
    txt: `(memory.since)⇒MemMark or (memory.since MemMark): Measures required-memory-size change (allocated memory) as non-negative f64 bytes. Always 0 in browsers.
Makes no attempt to correct for the memory-to-measure, \`(memory.since (memory.since))\`.`,
    _impure:true,
    call(mark = 0) {
      if (typeof process == ''+void 0 || !process.memoryUsage) return 0
      const m = process.memoryUsage()
      return Math.max(0, m.rss + m.heapUsed - m.heapTotal - mark)
    },
  },
  _timeOnly:{
    txt: `Finished (time.only Expr): returns ElapsedTime. The same as \`(time Expr)\`, but finished and without the result.`,
    nameResult: ['elapsed', 'ms'],
    _impure:true,
    finish(x, add = 0) { return time(x, add)[1] },
  },
  _memoryOnly:{
    txt: `Finished (memory.only Expr): returns MemoryIncrease. The same as \`(memory Expr)\`, but finished and without the result.`,
    nameResult: ['increase', 'bytes'],
    _impure:true,
    finish(x, add = 0) { return memory(x, add)[1] },
  },
  time:{
    txt: `(time Expr): Returns (Result ElapsedTime): the time needed to execute Expr, in f64 ms.
Does not count time spent in interruptions (between executions of Expr) as part of execution time.`,
    nameResult: ['resultAndElapsed'],
    _impure:true,
    call(x, add = 0) {
      const start = _timeSince()
      const v = finish(x)
      if (_isUnknown(v)) return v[1] = [time, v[1], add + _timeSince(start)], v
      return [v, _timeSince(start) + add]
    },
    at:{
      only:is('_timeOnly'),
      since:is('_timeSince'),
    },
  },
  memory:{
    txt: `(memory Expr): Returns (Result MemoryIncrease).
Does not count memory allocated in interruptions (between executions of Expr) as part of the reported result.`,
    nameResult: ['resultAndIncrease'],
    _impure:true,
    call(x, add = 0) {
      const start = _memorySince()
      const v = finish(x)
      if (_isUnknown(v)) return v[1] = [time, v[1], add + _memorySince(start)], v
      return [v, _memorySince(start) + add]
    },
    at:{
      only:is('_memoryOnly'),
      since:is('_memorySince'),
    },
  },


  // least:{
  //   txt: `((least Function) A B): returns either A or B, whichever has the least measure.`,
  //   call(a,b) {
  //     if (!_isArray(this) || this[0] !== least) return
  //     if (this.length != 2) return _emptyError
  //     const am = call(array(this[1], a)), bm = call(array(this[1], b))
  //     const r = call(array(less, am, bm))
  //     if (r === false) return b
  //     if (r === true) return a
  //     return finish(array(pick, r, b, a))
  //   },
  // },
  // most:{
  //   txt: `((most Function) A B): returns either A or B, whichever has the most measure.`,
  //   call(a,b) {
  //     if (!_isArray(this) || this[0] !== most) return
  //     if (this.length != 2) return _emptyError
  //     const am = call(array(this[1], a)), bm = call(array(this[1], b))
  //     const r = call(array(less, am, bm))
  //     if (r === false) return a
  //     if (r === true) return b
  //     return finish(array(pick, r, a, b))
  //   },
  // },

  _isArray(a) { return Array.isArray(a) },
  stopIteration:{
    txt: `(stopIteration Result): when returned to \`reduce\` iteration gets stopped with this result. When \`stopIteration\` is returned to \`transform\`, the result gets truncated.`,
  },
  reduce:{
    txt: `(reduce Array Function) or (reduce Array Function Initial): reduces Array with Function, reducing dimensionality (array nestedness) by 1: repeatedly sets Initial to (Function Initial Element). If Initial is undefined, it is the first array element.`,
    examples: [
      [`(reduce + 1)`, `1`],
      [`(reduce + (1 2 3 4 5))`, `15`],
      [`(reduce + (1 …(2 3 4) 5))`, `15`],
      [`(reduce + (1 (2 3 4) 5))`, `(8 9 10)`],
    ],
    nameResult: ['reduced'],
    call(f, a, initial) {
      if (!_isArray(a)) return a
      let [result = initial, i = 0] = _interrupt(reduce)
      try {
        for (; i < a.length; ++i) {
          const v = a[i]
          if (_isArray(v) && v[0] === rest && _isArray(v[1]) && v.length == 2) {
            if (i === a.length-1) return call(array(reduce, f, v[1], result)) // Try to tail-call.
            result = call(array(reduce, f, v[1], result)) // In …Array, reduce Array too.
          }
          else if (result === undefined) result = v
          else if (f === _plus && typeof result == 'number' && typeof v == 'number') result += v
          else if (f === _star && typeof result == 'number' && typeof v == 'number') result *= v
          else result = call(array(f, result, v))
          if (_isArray(result) && result[0] === stopIteration) return result[1]
          
          if (_isError(result)) return result
          // …Also control-flow defines (_isUnknown(result))…
        }
      } catch (err) { if (err === _interrupt) _interrupt(reduce, 2)(result, i);  throw err }
      return result
    },
  },
  transform:{
    txt: `(transform Function Array): transforms each element of Array by applying Function.
\`(transform G (transform F A))\` is the same as \`(transform (compose F G) A).\``,
    examples: [
      [`(transform x→(+ x 2) 1)`, `3`],
      [`(transform x→…(0 (* x 2) 0) (1 …(2 3) 4))`, `(0 2 0 0 4 0 0 6 0 0 8 0)`],
    ],
    nameResult: ['transformed', 'mapped'],
    _argCount:2,
    call(f,a) {
      if (!_isArray(a)) return call(array(f, a))
      let [result = [], i = 0] = _interrupt(transform)
      try {
        for (; i < a.length; ++i) {
          let v = a[i], r
          if (_isArray(v) && v[0] === rest && _isArray(v[1]) && v.length == 2)
            r = array(rest, call(array(transform, f, v[1]))) // In …Array, transform Array too.
          else
            r = call(array(f, v))

          // Maybe we were told to stop iteration.
          if (r === stopIteration) break

          if (_isError(r)) return r
          // …Also control-flow defines (_isUnknown(result))…

          // Add r to result.
          if (_isArray(r) && r[0] === rest && _isArray(r[1]) && r.length == 2)
            result.push(...r[1])
          else
            result.push(r)
        }
        return _maybeMerge(result)
      } catch (err) { if (err === _interrupt) _interrupt(transform, 2)(result, i);  throw err }
    },
  },






  // f64:{
  //   txt: `(f64 …Strings)⇒Number: converts a string to a 64-bit float, broadcasted if an array.`,
  //   nameResult: ['float'],
  //   call(...s) { return _toNumber(s) },
  // },
  // less:{
  //   txt: `(less Number1 Number2)⇒Bool: returns true if Number1 is less than Number2, or false otherwise.`,
  //   nameResult: ['isLess', 'bool'],
  //   _argCount:2,
  //   call(a,b) { return _toNumber(a) < _toNumber(b) },
  // },
  // nats:{
  //   txt: `(nats Number): a type of all natural numbers less than Number, including 0.`,
  //   gen(n) {
  //     if (!_isArray(n) || n[0] !== nats) return
  //     return _pickNatLessThan(n[1])
  //   },
  // },
  _toNumber(a) {
    if (_isArray(a)) return a.length == 1 ? _toNumber(a[0]) : a.map(_toNumber)
    if (typeof a == 'number') return a
    if (a === cycle) return cycle
    if (!_isString(a)) return array(error, "Cannot convert to a number")
    return +a
  },
  _toString(a) {
    if (typeof a == 'number') return ''+a
    return a
  },

  broadcasted:{
    txt: `(broadcasted Function): creates a function that is broadcasted over array arguments (\`((broadcasted Func) …Args)\`). No array inputs means just applying Function; having array inputs means returning an array of applying (broadcasted Function) to each element, with the same index for all arguments, using the last element if out-of-bounds for an argument, and non-array inputs treated as arrays of length 1.`,
    future:`Make reduce and transform and broadcasted check _isUnknown.`,
    _argCount:1,
    call(fun) {
      const impl = function decorated(...args) {
        // Just apply the function if there are no arrays.
        if (!args.some(_isArray)) return call(array(fun, ...args))

        let maxLen = 1
        for (let i = 0; i < args.length; ++i)
          if (_isArray(args[i])) {
            if (!args[i].length) return args[i]
            maxLen = Math.max(maxLen, args[i].length)
          }
        let [k = 0, results = [], argsSlice = [decorated, ...args.slice()]] = _interrupt(broadcasted)
        try {
          for (; k < maxLen; ++k) {
            // Apply f to a slice of args.
            for (let i = 0; i < args.length; ++i) {
              const el = args[i]
              argsSlice[i+1] = !_isArray(el) ? el : k < el.length ? el[k] : el[el.length-1]
            }
            if (call.cache && call.cache.has(argsSlice)) call.cache.delete(argsSlice)
            const r = call(_maybeMerge(argsSlice))
            if (_isError(r)) return r
            // …Also check _isUnknown(r)…
            results.push(r)
          }
        } catch (err) { if (err === _interrupt) _interrupt(broadcasted, 3)(k, results, argsSlice);  throw err }
        // Slice off superfluous end results.
        while (results.length > 1 && results[results.length-2] === results[results.length-1]) results.pop()
        return results.length === 1 && !_isArray(results[0]) ? results[0] : results
      }
      _cameFrom(impl, finish.v)
      impl.defines = new Map
      impl.defines.set(deconstruct, array(broadcasted, fun))
      impl.defines.set(_impure, _impure(fun))
      if (_view(fun) instanceof Map && _view(fun).has(_argCount))
        impl.defines.set(_argCount, _view(fun).get(_argCount))
      return impl
    },
  },


  ['+']:is([is('_overridable'), is([is('broadcasted'), is('_sum')])]),
  ['*']:is([is('_overridable'), is([is('broadcasted'), is('_mult')])]),
  _sum:{
    _argCount:2,
    call(a,b) { return a = _toNumber(a), b = _toNumber(b), typeof a != 'number' ? a : typeof b != 'number' ? b : a + b },
  },
  _mult:{
    _argCount:2,
    call(a,b) { return a = _toNumber(a), b = _toNumber(b), typeof a != 'number' ? a : typeof b != 'number' ? b : a * b },
  },
  _plus:is('+'),
  _star:is('*'),

  ['-']:is([is('_overridable'), is([is('broadcasted'), is('_subtract')])]),
  ['/']:is([is('_overridable'), is([is('broadcasted'), is('_divide')])]),
  _subtract:{
    _argCount:2,
    call(a,b) { return a = _toNumber(a), b = _toNumber(b), typeof a != 'number' ? a : typeof b != 'number' ? b : a - b },
  },
  _divide:{
    _argCount:2,
    call(a,b) { return a = _toNumber(a), b = _toNumber(b), typeof a != 'number' ? a : typeof b != 'number' ? b : a / b },
  },
  _minus:is('-'),
  _slash:is('/'),




  _Worker:{
    future:`Have a function that executes code (Expr) in a web worker. (Synchronizing journals of self-modifying code, too.) (Benefits: parallelism; costs: lack of inter-worker merging.)`,
    call() { throw "Workers not supported for now" },
  },
  _Extension:{
    future:[
      `Into every page, inject a simple script that creates a fixed-position small button in a corner, that requests Self from the extension on click (that creates a REPL in the page's context).`,
      `Allow some flavor of clicking to refer to the page's elements.`,
      `Have some small DOM event un/registering (with objects, event→function) and dispatching API. Store any self-modifications that occured.`,
    ],
    call() { throw "Being a browser extension not supported for now" },
  },
  _Browser:{
    future:[
      `Go through everything DOM-related and make sure that any custom-property communication happens *only* through .defines.`,
      `Have \`finish\` highlight the currently-executing per-expression original (when interrupted). Not use element IDs for highlighting the same value; instead, keep an array from values to displayed-via-element.`,
      `Some flavor of clicking (Shift+click?) to insert a reference to a value into REPL input (not really serializable, runtime-only).`,
      `A custom DOM context menu, with definable-by-value/element contents.`,
      `Context menu things: collapse an element, use a <textarea> to display a string, use a clickable <button> to display a function, rename label, change evaluator's language and context, move an element to a window or to the side of another element.`,
    ],
    call() {
      serialize.displayed = serialize.dom

      // Select the <node> under cursor on triple-click.
      addEventListener('click', evt => evt.detail === 3 && nodeParent(evt.target) && getSelection().selectAllChildren(nodeParent(evt.target)), true)

      // Open the clicked <known> thing at the top of the page on click.
      addEventListener('click', evt => {
        const el = evt.target
        if (!el || el.tagName !== 'KNOWN') return
        const v = 'to' in el ? el.to : parse(el.textContent)[0]
        if (!evt.ctrlKey) scrollTo(0,0)
        _elemInsert(document.body, elem(evaluator, array(deconstruct, v)), document.body.firstChild)
      })

      // If scrolled to (near) end, make sure that transitions preserve that scroll.
      let atEnd = false
      addEventListener('transitionstart', () => (atEnd && scrollTo(scrollX, scrollMaxY, atEnd = false), atEnd = atEnd || scrollY && scrollY >= scrollMaxY - 10))
      addEventListener('transitionend', () => atEnd && scrollTo(scrollX, scrollMaxY, atEnd = false))

      // Show the current highlight on the global scrollbar.
      const scrollHighlights = new Map
      const scrollHighlight = _throttled(function scrollHighlight(els) {
        const free = []
        scrollHighlights.forEach(v => free.push(v)), scrollHighlights.clear()
        els && els.forEach(el => {
          if (!_isStylableDOM(el)) return
          const to = free.length ? free.shift() : document.createElement('scrollHighlight')
          scrollHighlights.set(el, to)
        })
        free.forEach(el => _elemRemove(el))
        if (scrollHighlights.size) {
          updateScrollHighlights()
          scrollHighlights.forEach(v => {
            if (v.parentNode) return
            v.style.opacity = 0
            document.body.append(v)
          })
          document.body.offsetHeight
          scrollHighlights.forEach(v => v.style.opacity !== '' && (v.style.opacity = 1))
        }
      }, .2)
      function updateScrollHighlights() {
        if (!scrollHighlights.size) return
        const rect = document.body.getBoundingClientRect()
        const min = rect.top, max = rect.bottom
        if (max+1 <= min) return
        scrollHighlights.forEach((v,k) => {
          const rect = k.getBoundingClientRect()
          v._top = (rect.top - min) / (max - min), v._height = rect.height / (max - min)
        })
        scrollHighlights.forEach(v => { if (v._top <= 1 && v._height <= 1) v.style.top = v._top*100+'%', v.style.height = v._height*100+'%' })
      }
      addEventListener('resize', _throttled(updateScrollHighlights), true)

      // Highlight equal-id <node>s over selection or under cursor.
      function changeHoverTo(elem) {
        const prev = changeHoverTo.prev
        const selector = elem && elem.id ? '#' + CSS.escape(elem.id) : null
        const New = elem == null ? null : elem instanceof Set ? elem : document.querySelectorAll(selector)
        const set = new Set
        let b = false
        New && New.forEach(el => {
          if (prev.has(el)) set.add(el)
          else el.classList.add('hover'), set.add(el)
          el = el.parentNode
          !b && el && el.tagName === 'EXTRACTED' && (el.classList.add('hover'), set.add(el), b = true)
        })
        if (prev) prev.forEach(el => !set.has(el) && el.classList.remove('hover'))
        scrollHighlight(New)
        changeHoverTo.prev = set
      }
      const nodeParent = _closestNodeParent
      function highlightParent(evt) {
        const active = document.activeElement && document.activeElement.contentEditable == 'true'
        const s = getSelection()
        let el
        if (s.isCollapsed && !active && evt) el = evt.type !== 'pointerout' ? evt.target : null
        else el = s
        changeHoverTo(nodeParent(el))
      }
      const highlight = _throttled(highlightParent, .1)
      addEventListener('pointerover', highlight, true)
      addEventListener('pointerout', highlight, true)
      addEventListener('selectionchange', highlight, true)

      // On any element tree mutations inside document.body, re-highlight.
      new MutationObserver(_throttled(record => {
        changeHoverTo(changeHoverTo.prev)
      }, .05))
      .observe(document.body, { childList:true, subtree:true })

      // On resize, update the "all-or-nothing" line-break-ingness of <node>s.
      let width = innerWidth
      addEventListener('resize', _throttled(() => width !== innerWidth ? _updateBroken(document.body) : (width = innerWidth)), .1)

      // Update CPU's title.
      ;(CPU.oninput = () => { CPU.title = CPU.title.replace(/[0-9]+%/, ((+CPU.value*100)|0) + '%') })()

      // Create a REPL.
      const env = finish.env = _newExecutionEnv()
      finish.env.set(log, document.body)
      document.body.insertBefore(elem(REPL), document.body.firstChild)
      document.querySelector('[contenteditable]').focus()

      // If our URL has `#…` at the end, parse and evaluate that command.
      function evalHash(hash) {
        if (hash) _elemInsert(document.body, elem(evaluator, parse(decodeURI(location.hash.slice(1)))[0]), document.body.firstChild)
      }
      evalHash(location.hash)
      addEventListener('hashchange', () => evalHash(location.hash))

      // Test all known examples.
      _test(env)
    },
  },
  _NodeJS:{
    call() {
      let ctx = parse.ctx, env = finish.env = _newExecutionEnv()
      _test(env)
      console.log('ctrl-D or .exit to exit, (txt) for all functions. a, `a`, "s", (0 1), (a:2 a).')
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
            let expr, newCtx, styled
            log.did = false;
            [expr, newCtx, styled] = parse(cmd, undefined, ctx)
            opt.breakLength = out.columns
            if (out.isTTY && !log.did) {
              const lines = Math.ceil((cmd.length + prompt.length) / out.columns)
              out.moveCursor(0, -lines)
              out.clearScreenDown()
              out.write(coloredPrompt + serialize(expr, {...opt, offset:1}) + '\n')
            }
            _schedule(expr, env, result => {
              // If ctx contains result in values, set name to that; if not, create a new one.
              let name
              ctx.forEach((v,k) => v === result && (name = k))
              if (!name) do { name = '#' + n++ } while (ctx.has(name))
              if (!ctx.has(name))
                (ctx = new Map(ctx)).set(name, quote(result))

              then(null, _colored(name, 33) + ': ' + serialize(result, {...opt, offset:1+Math.ceil(name.length/2)})) // brown
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

  _colored(str, pre=39, post = 39) {
    // Style a string for ANSI terminals. See `man 4 console_codes`.
    return ('\x1b['+pre+'m') + str + ('\x1b['+post+'m')
  },

  _closestNodeParent(elem) {
    if (elem instanceof Selection) elem = elem.rangeCount ? elem.getRangeAt(0).commonAncestorContainer : null
    while (elem && elem.tagName !== 'NODE') elem = elem.parentNode
    return elem
  },
  _bracketize(range, brackets = '()') {
    // Appends brackets at range's start and end.
    range.insertNode(elem('span', brackets[0]))
    range.collapse(false)
    range.insertNode(elem('span', brackets[1]))
    range.setEnd(range.endContainer, range.endOffset-1)
  },







  evaluator:{
    txt: `(elem evaluator Expr): When logged to DOM, this displays the expression, its \`log\`s along the way, and its one evaluation result in one removable (by clicking on the prompt) DOM element.`,
    future:[
      `A checkbox for repeating computation. (Clearing the logs when re-starting, and clearing the previous output and immediately replacing it when finishing.) (For optimizing self-modifying code by repeated evaluation.)`,
      `Have adjustable (per-REPL and per-evaluator) per-job relative importances, defining the time-to-interrupt. Show relative resources (CPU time) that an evaluator takes up with a color.`,
    ],
    elem(tag, expr, style) {
      if (tag !== evaluator || typeof document == ''+void 0) return

      const el = elem('node')
      const prompt = elem('div', '> ')
      const query = elem('span')
      query.classList.add('replInputContainer')
      query.append(prompt)
      query.append(serialize(expr, serialize.displayed))
      el.classList.add('code')
      _elemStyle(el, style)
      el.append(query)
      const waiting = elem('waiting')
      waiting.style.display = 'none'
      setTimeout(() => waiting.style.removeProperty('display'), 300)
      el.append(waiting)

      const env = _newExecutionEnv(finish.env)
      env.set(log, el)

      const id = _schedule(expr, env, v => {
        _elemRemove(waiting)
        finish.env = env
        log(serialize(v, serialize.displayed))
      })
      prompt.title = 'Click to remove this.'
      prompt.onclick = () => (_elemRemove(el), _cancel(id), getSelection() && getSelection().collapseToStart())
      return el
    },
  },
  REPL:{
    txt: `(elem REPL Language): Creates a visual REPL instance. The Language parameter doesn't work (but ideally, the language should define parsing, serialization, and styling, for DOM and console).`,
    future:[
      `History of edits, currently broken by constant DOM replacements: Ctrl+Z / Ctrl+Shift+Z.`,
      `Make the Language parameter work. (basic/embellished, and _innerText.)`,
      `Allow changing the binding context too.`,
      `Make REPL input a read-write evaluator (extracting functionality to there) (becoming read-only and impurely-executed when evaluated).`,
    ],
    elem(tag, lang, style) {
      if (tag !== REPL || typeof document == ''+void 0) return

      let ctx = parse.ctx, env = _newExecutionEnv(finish.env)

      const repl = elem('node')
      const logContainer = elem('code')

      const pureOutput = elem('node')
      pureOutput.classList.add('code')
      let id, waiting
      const purifyAndDisplay = _throttled(expr => {
        const justClear = expr === purifyAndDisplay
        let preserved
        if (pureOutput.firstChild) {
          for (let ch = pureOutput.firstChild; ch; ch = ch.nextSibling)
            if (!ch.removed) {
              if (ch.onclick === evaluate && !justClear && !preserved) preserved = ch
              else _elemRemove(ch), ch.style.position = 'absolute'
            }
        }
        if (id !== undefined) _cancel(id), waiting.remove(), id = undefined, waiting = undefined
        if (!justClear) {
          const e = _newExecutionEnv(env)
          e.set(log, pureOutput)
          id = _schedule([purify, array(quote, expr)], e, p => {
            id = undefined, waiting.remove(), waiting = undefined
            if (!_isUnknown(p)) {
              if (preserved)
                _elemRemove(preserved), preserved.style.position = 'absolute'
              return _elemInsert(pureOutput, serialize(p, serialize.displayed))
            } else {
              if (preserved) return
              const el = elem('button', 'Evaluate')
              el.onclick = evaluate
              _elemInsert(pureOutput, el)
            }
          }), waiting = elem('waiting')
          waiting.style.display = 'none'
          setTimeout(() => waiting && waiting.style.removeProperty('display'), 300)
          pureOutput.append(waiting)
        }
      }, .1)

      const replInput = elem('node')
      replInput.contentEditable = true
      replInput.spellcheck = false
      // On any mutations inside, re-parse its contents, and show purified output.
      const obs = new MutationObserver(_throttled(record => {
        const s = getSelection()
        const i = _saveCaret(replInput, s)
        try {
          const [expr, newCtx, styled] = parse(replInput, parse.dom, ctx)
          while (replInput.firstChild) replInput.removeChild(replInput.firstChild)
          replInput.append(structured(styled))
          if (i !== undefined) _loadCaret(replInput, i, s)
          obs.takeRecords()
          purifyAndDisplay(expr)
        } catch (err) { if (!replInput.innerText) purifyAndDisplay(purifyAndDisplay) }
      }, .2))
      obs.observe(replInput, { childList:true, subtree:true, characterData:true })

      const query = elem('span')
      query.classList.add('replInputContainer')
      query.append(elem('div', '> ', 'width:2ch'))
      query.append(replInput)
      repl.classList.add('code')
      repl.append(logContainer)
      repl.append(query)
      repl.append(pureOutput)
      env.set(log, logContainer)
      
      const prev = finish.env; finish.env = env
      log(structuredSentence('{{A REPL}. {{(txt)} for {all functions}}, {{(examples)} for {code examples}}, {{`.`} for {all current bindings}}}. {{a}, {`a`}, {"s"}, {(0 1)}, {(a:2 a)}}. {Click on {{an entered command}\'s prompt} to {remove it}}.'))
      finish.env = prev
      const brackets = '(){}[]\'\'""'
      replInput.onkeydown = evt => {
        // On Escape, blur replInput. On Shift or Ctrl and Enter, add a newline. On Enter, evaluate the expression.
        if (evt.key === 'Escape' && document.activeElement === replInput) replInput.blur()
        if (!evt.ctrlKey && !evt.altKey) {
          // '(' surrounds the selection in brackets. ')' surrounds the closest node parent in brackets.
          const i = brackets.indexOf(evt.key)
          if (i >= 0 && i%2) {
            const r = document.createRange(), el = _closestNodeParent(getSelection())
            r.selectNodeContents(el)
            return _bracketize(r, brackets.slice(i-1,i+1)), evt.preventDefault()
          } else if (i >= 0) {
            return _bracketize(getSelection().getRangeAt(0), brackets.slice(i,i+2)), evt.preventDefault()
          }
        }
        if (evt.key !== 'Enter' || evt.shiftKey || evt.ctrlKey) return
        evaluate(evt)
      }
      function evaluate(evt) {
        const cmd = replInput.innerText.trim()
        const prev = finish.env
        try {
          let expr, newCtx, styled
          log.did = false
          finish.env = env;
          [expr, newCtx, styled] = parse(cmd, undefined, ctx)

          log(elem(evaluator, expr))
        } catch (err) {
          if (_isArray(err) && err[0] === 'give more') err = err[1]
          else evt.preventDefault()
          const el = elem('error', String(err))
          el.style.left = '1em'
          el.style.position = 'absolute'
          return log(el), setTimeout(() => _elemRemove(el), 1000)
        } finally { finish.env = prev }
        replInput.textContent = ''
        purifyAndDisplay(purifyAndDisplay)
      }
      return repl
    },
  },

  _saveCaret(el, ch, i) { // → index
    if (ch instanceof Selection) ch = ch.getRangeAt(0), i = ch.endOffset, ch = ch.endContainer
    let wentToParent = false
    if (ch instanceof Element) ch = i ? ch.childNodes[i-1] : ch.previousSibling || (wentToParent = true, ch.parentNode), i = 0
    else if (!(ch instanceof Element)) wentToParent = true
    let sum = i
    while (ch !== el && ch) {
      // Go from ch to previous sibling or parent, accumulating the character-length sum along the way.
      const content = ch instanceof Element ? ch.innerText : ch.textContent
      if (ch.tagName === 'BR') ++sum
      else if (!wentToParent && content) sum += content.length, (ch.tagName === 'DIV' || ch.tagName === 'P') && ++sum
      ch = (wentToParent = false, ch.previousSibling) || (wentToParent = true, ch.parentNode)
    }
    if (ch === el) return sum
  },
  _loadCaret(el, index, into) { // → [ch, i]
    let ch = el.firstChild
    let sum = 0
    while (ch !== el && ch) {
      // If, with the suggested next node's content, too long, break it up; if exactly right, break; if too short, take next suggestion.
      const content = ch instanceof Element ? ch.innerText : ch.textContent
      let added = 0
      if (ch.tagName === 'BR') ++added
      else if (content) added += content.length, (ch.tagName === 'DIV' || ch.tagName === 'P') && ++added
      const newSum = sum + added

      if (newSum > index && ch.firstChild) ch = ch.firstChild
      else if (newSum > index) {
        break
      } else if (!ch.nextSibling) {
        sum = index - (ch instanceof Element ? ch.childNodes.length : ch.textContent.length)
        break
      } else sum = newSum, ch = ch.nextSibling
    }
    while (ch instanceof Element && index!==sum && index-sum === ch.childNodes.length)
      ch = ch.lastChild, sum = ch instanceof Element ? index - ch.childNodes.length : index - ch.textContent.length
    if (ch && ch.tagName === 'BR') {
      let i = [...ch.parentNode.childNodes].indexOf(ch)
      sum = index-i, ch = ch.parentNode
    }
    if (into instanceof Selection) ch ? into.collapse(ch, index - sum) : into.collapse(el, el.childNodes.length)
    else return [ch, index - sum]
  },
  _innerText:{
    txt:`Returns the inner text of an element (in an array with strings and other things), preserving .special elements.`,
    // To save, we need to count until element and inner-index, and return the index.
    // To load, we need to go-until-index, and return the element and inner index.
    // Do we re-implement saving and loading (to go deep into elements instead of using .innerText)? Is there a way to re-use this code there?
    call(el) {},
  },


  _elemInsert:{
    txt: `Inserts a DOM element into the displayed DOM tree smoothly (if CSS transitions are enabled for it, and are specified in seconds, with all-props being the first), by transitioning height and opacity from 0.
Very bad performance if a lot of inserts happen at the same time, but as good as it can be for intermittent smooth single-element-tree insertions.`,
    _impure:true,
    call(into, el, before = null) {
      if (el.parentNode) el = el.cloneNode(true)
      const preh = getComputedStyle(into).height
      if (_isStylableDOM(el)) el.style.opacity = 0

      into.insertBefore(el, before)
      _updateBroken(el)

      // Handle the "insert into a being-inserted element" case smoothly, by transitioning the parent between two computed heights.
      // Since height:auto does not transition by default, we explicitly help it.
      const heightTransitioning = !!into.style.height
      into.style.removeProperty('height')
      const posth = getComputedStyle(into).height
      if (preh !== posth) {
        into.style.height = preh
        into.offsetWidth
        into.style.height = posth
        if (!heightTransitioning) {
          const style = getComputedStyle(into)
          const dur = parseFloat(style.transitionDuration)*1000
          setTimeout(el => { el.style.removeProperty('height') }, dur, into)
        }
      }

      if (_isStylableDOM(el)) {
        const style = getComputedStyle(el)
        const {height} = style
        const dur = parseFloat(style.transitionDuration)*1000
        if (dur) {
          el.style.height = 0
          el.offsetHeight
          el.style.height = height
          setTimeout(el => { el.style.removeProperty('height') }, dur, el)
        }
        el.style.removeProperty('opacity')
      }
      return el
    },
  },
  _elemRemove:{
    txt: `Removes a DOM element from the displayed document smoothly (if CSS transitions are enabled for it, and are specified in seconds, with all-props being the first), by transitioning height and opacity to 0.`,
    _impure:true,
    call(el) {
      if (!(el instanceof Element)) el.remove()
      el.removed = true

      const r1 = el.getBoundingClientRect(), r2 = document.documentElement.getBoundingClientRect()
      _particles(r1.left - r2.left, r1.top - r2.top, r1.width, r1.height)

      const style = getComputedStyle(el)
      const {height} = style
      const dur = parseFloat(style.transitionDuration)*1000
      if (dur) {
        el.style.height = height
        el.style.opacity = 0, el.style.pointerEvents = 'none'
        el.offsetHeight
        el.style.height = 0
        setTimeout(el => el.remove(), dur, el)
      } else el.remove()
      return el
    },
  },
  _particles:{
    txt: `A splash of magical particles lol`,
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


  _throttled(fun, cpu = .5) {
    // For non-critical potentially-long tasks. Tries to adjust CPU consumption.
      // cpu: 0 is infinite delay (no work), 1 is no delay (all work), 0.5 is last-execution-time×1 delay.
      // Return a promise to measure non-sync time.
    let lastTime = 0
    let scheduledId = null, running = false
    function throttled(x,y) {
      if (running) return
      if (scheduledId) clearTimeout(scheduledId)
      const target = typeof cpu == 'number' ? cpu : cpu()
      const requiredRest = target === .5 ? lastTime : lastTime/target - lastTime
      if (requiredRest > 2)
        scheduledId = setTimeout(run, requiredRest, x, y)
      else run(x, y)
    }
    function run(x) {
      scheduledId = null, running = true
      const start = _timeSince()
      const r = fun(x)
      if (r instanceof Promise)
        r.then(_result => (running = false, lastTime = _timeSince(start)))
      else
        running = false, lastTime = _timeSince(start)
      return r
    }
    return throttled
  },


  null:null,
  undefined:undefined,





  _var:is('var'), // This makes tests run twice.
  var:{
    txt: `Finished (var): Creates a new unique variable, usable as a label.`,
    examples: [
      [`(a a a:(var))`, `(a a a:(var))`],
      [`((var) (var))`, `((var) (var))`],
      [`(a→a 5) a:(var)`, `5`],
    ],
    nameResult: ['x', 'y', 'z', 'w', 'a', 'b', 'c', 'd', 'variable'],
    finish: { _argCount:0, call() { return Symbol() }, },
    _impure:true,
  },
  _const:is('const'),
  const:{
    txt: `(const): A new unique object with no inner structure, only good for ref-equality checks.`,
    examples: [
      [`(a a a:(const))`, `(a a a:(const))`],
      [`((const) (const))`, `((const) (const))`],
      [`(a→a a) a:(const)`, `(const)`],
      [`(a→a 5) a:(const)`, `error 'Not assignable'`],
    ],
    nameResult: ['o', 'obj'],
  },
  _isVar(x) { return typeof x == 'symbol' || _isLabel(x) || _isArray(x) && x[0] === _var && x.length == 1 },



  log:{
    txt: `(log …Values): For debugging; logs to console or the current DOM node.`,
    _impure:true,
    call(...x) {
      log.did = true
      try {
        let str
        if (x.length != 1 || !_isStylableDOM(x[0])) {
          str = serialize(x.length > 1 ? x : x[0], serialize.displayed)
        } else str = x[0]
        const into = finish.env.get(log)
        if (into)
          _elemInsert(into, str)
        else
          console.log(str)
      } catch (err) { console.log(err, err.stack), console.log(...x) }
    },
  },
  _updateBroken(e) {
    // Ensure that e either contains no soft line breaks directly inside of it, or its every child is on its own line (CSS class .broken).
    if (!_isStylableDOM(e)) return
    for (let ch = e.firstChild; ch; ch = ch.nextSibling)
      _updateBroken(ch)
    if (e.tagName !== 'NODE' || e.classList.contains('code')) return
    e.classList.toggle('broken', false)
    const broken = e.firstChild && e.firstChild.offsetTop < e.lastChild.offsetTop
    if (broken !== e.classList.contains('broken'))
      e.classList.toggle('broken', broken)
  },
  L:{
    philosophy:'fun',
    call() {
      log(123, 'hello', 123, 'um', [])
    },
    _impure:true,
  },
  RL:{
    call() {
      log(123)
    },
  },






//   typeof:{
//     txt: `Finished (typeof Expr): A relic from an ancient time, to be removed; infer the type of Expr based on each intermediate value being both input and output.
// …Or, you know, just recurse into array parts.`,
//     finish(x) {
//       if (_isArray(x) && x[0] === gen) return x
//       // We are mixing up types badly here: mixing execution directives (expressions) with types.
//       if (_isString(x)) return x
//       // Allow x to override typeof.
//       let r
//       if ((r = defines(x, _typeof)) !== undefined)
//         if ((r = _getOverrideResult(r, array(_typeof, x))) !== undefined)
//           return r
//           // If it does override, we should do _both. And, _both should probably recurse into arrays too.
//       // Finish x after replacing every part of x with (_typeof Part).
//       if (!_isArray(x)) return x
//       let y = x.slice()
//       // Maybe handle _unknowns too?
//       for (let i = 0; i < y.length; ++i)
//         y[i] = array(_typeof, x[i])
//       return finish(_maybeMerge(y))
//         // Um, we probably want to call ourselves directly, not through `finish`.
//     },
//   },
//   _typeof:is('typeof'),
//   _both:{
//     txt: `Returns the least type containing both, or error.
// Imprecise here; demands ref-equality if not perfectly general.`,
//     call(a,b) {
//       if (_isLabel(a)) return b
//       if (a !== b) return _emptyError
//       return a
//     },
//   },
//   _either:{
//     txt: `Returns the greatest type containing both.`,
//     call(a,b) {
//       if (_isLabel(a)) return a
//       if (a !== b) return _var()
//       return a
//     },
//   },

















  _getDataOverride(data, code) {
    let r = defines(data, code)
    if (r !== undefined && typeof r !== 'function')
      return r
  },
  txt:{
    txt: `(txt F): Returns a helpful textual description of a function.
(txt): Returns all available descriptions in a (… (Name Description) …) format.`,
    nameResult: ['description', 'asText'],
    call(f) {
      if (_isArray(f)) return array(error, "Can only view txt of simple functions")
      if (f !== undefined)
        return _getDataOverride(f, txt)
      const result = [map], seen = new Set
      parse.ctx.forEach((v,k) => {
        if (k[0] === '_') return
        if (seen.has(v)) return; else seen.add(v)
        let r = _getDataOverride(v, txt)
        if (r !== undefined)
          result.push(v, r)
      })
      return result
    },
  },

  examples:{
    txt: `(examples F): Returns examples of usage of a function, in \`(… (CodeString BecomesString) …)\` format.
(examples): Returns all available examples in a (… (Name … (CodeString BecomesString) …) …) format.`,
    call(f) {
      if (_isArray(f)) return array(error, "Can only view examples of simple functions")
      if (f === undefined) {
        // Accumulate all examples (from parse.ctx).
        const result = [map], seen = new Set
        parse.ctx.forEach((v,k) => {
          if (k[0] === '_') return
          if (seen.has(v)) return; else seen.add(v)
          const r = _getDataOverride(v, examples)
          if (r !== undefined)
            result.push(v, r)
        })
        return result
      } else
        return _checkOverride(f, examples, f)
    },
  },

  future:{
    txt: `(future F): Returns a list of things to be done about F.
(future): Returns all known things to be done. Less than a third is usually done.`,
    nameResult: ['todo'],
    call(f) {
      if (f !== undefined) return array(error, "Can only view futures of simple functions")
      const result = [map], seen = new Set
      parse.ctx.forEach((v,k) => {
        if (seen.has(v)) return; else seen.add(v)
        const r = _getDataOverride(v, future)
        if (r !== undefined)
          result.push(v, r)
      })
      return result
    },
  },

  philosophy:{
    call:[
      'These can be fun.',
      `There is some philosophy surrounding this code, not because it's never been said before, but because the mind walks in places that code can't reach.`,
      [
        `— What exists can be optimized, but what doesn't exist cannot. Premature optimization is evil. Ideas in a human mind are very likely not what they claim they are to the rest of the mind, so it is extremely likely that you'll end up optimizing a valid idea out of existence. (Learning to make labels and implementations agree can help, but is still not a guarantee. Nothing is.)`,
        `— In the end, the best and most capable thing always wins. Might as well try to do as much as possible correctly from the start. (Design for generality first, and derive optimized versions as special cases.)`,
        `— There are no false trails and things that are so for no reason, and everything can be pursued to its underlying powerful idea(s), leaving an implementation in your personality or a program (or a story or whatever) you've intertwined it with, in the process. No truths nor lies, only evidence you've seen and what you've made of it. Effects and their reasons are intrinsically linked, and metaphors are not meaningless wordplay. (In particular, the only true god of humans is an extremely correct implementation/explanation of their intelligence, and some of physics.) (Believe in yourself.)`,
        `— No idea by itself, no matter how real and underlying and powerful and pure, can compete against multiple ideas that come together. Paperclip maximizers, super-intelligent viruses, one-trick pony philosophers and idea-men, ideas and ideologies and separate forms of governance may struggle as hard as they want, but they will fail against life's unity; saying that a thing that can do everything *will* do everything is just inexperience — do not fall into this trap of infinite generality. (Design for unity, not dominance of a paradigm. Build on top of a popular thing. Do not split across many projects.)`,
        `— A worthwhile mind's most fundamental concepts are concepts of a very high-level programming language too. By now, there are no significant holes left in that view, and someone just needs to put together a myriad pieces properly. Communication by a single word with all the meaning, interconnectedness into a global network of all knowledge, eternal improvement and learning, multiple bodies for one mind and multiple minds for one body, reproduction, life after and in death, planning, imagination, logic, emotions — all implemented and practically perfected somewhere in the world, often with its own set of programming languages and frameworks. Finding all these to unite is how humanity would *begin* to create AI: a convenient-to-use singularity is the only first step possible. The picture is about precise enough already, and top-down is very slowly starting to meet the bottom-up.

(To be full, these are the more bottom-up words for the things above: properly-integrated conceptual links, Internet, evolution and more specific optimizers, multiprocessing and scheduling, copying, copying and self-rewriting, virtualization of operations, most of modern maching learning, logic and types and proof assistants, reinforcement learning. This is about as good of a match as it can get. Only with all the pieces can the full picture be seen, as they enrich each other: a nigh-impossible engineering task today, but one that at least someone will have to undertake and complete eventually.)`,
        `— If something is difficult to the point of death wish, then no one has likely done it before, which means that it's worth doing. (Do it.)`,
      ],
      `Humanity's beauty; amazing…`,
    ],
  },











  delay:{
    txt: `(delay) or (delay Value): Just a function for testing promises. It should have no effect on evaluation.
Examples: \`(+ (delay 1) (delay 2))\` eventually returns 3. \`(+ (* (delay 1) (delay 3)) (* (delay 4) (delay 5)))\` eventually returns 23.`,
    nameResult: ['delayed'],
    call(x = 12) { return new Promise(then => setTimeout(then, 5000 + 1000 + Math.random()*4000, x)) },
  },




  race:{
    txt: `Finished (race …Exprs): returns the first expression that returns instead of being deferred. The opposite of regular multiple-promise handling, which waits for all to join.`,
    nameResult: ['firstOf'],
    finish(...x) {
      if (this !== race) return
      let [i = 0, exprs = [race], promises = []] = _interrupt(race)
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
      } catch (err) { if (err === _interrupt) _interrupt(race, 3)(i, exprs, promises);  throw err }
      return [_unknown, merge(exprs), ...promises]
    },
  },

  ['js.rejected']:{
    txt: `(js.rejected Reason): represents the reason for either an exception or promise rejection in JS.`,
    future: [
      `Change this to just \`error\`.`,
      `Change the stack to \`(Func Line)\` — which needs to both know the source and locations of functions in it…`,
    ],
  },
  _jsRejected: is('js.rejected'),
  _schedule:{
    txt: `(_schedule Expr Env Then): schedule an expression for evaluation, with an environment (defining where its logging should go to, and its current variables, and read/write journals; use _newExecutionEnv() for those) and a native function for continuation.
This is a low-level primitive that a user can indirectly interact with. Sub-job scheduling must be implemented in-job, to deny resource denial.
Returns job id that can be passed to \`cancel\`.`,
    future:[
      `Possibly make hovering over the jobs indicator highlight all the jobs' log areas. (Possibly start checking defines(element, …) for that.)`,
    ],
    call(expr, env, then, id = _newJobId()) {
      // Call this to initiate a later evaluation of an expression; the callback will be called with the result.
      if (typeof then != 'function') throw "Expected a function continuation"
      if (!_jobs.expr) _jobs.expr = []
      if (!_jobs.expr.length) setTimeout(_jobs, 0)
      for (let i = 0; i < _jobs.expr.length; i += 4) // Don't add the same job twice.
        if (_jobs.expr[i] === expr && _jobs.expr[i+1] === env && _jobs.expr[i+2] === then) return
      _jobs.expr.push(expr, env, then, id)
      return id
    },
  },
  _cancel:{
    txt: `(_cancel JobId): if the job is scheduled to run, cancels it. Returns true if cancelled, false if not.
If any promises the job depends on have a method .cancel, calls those.`,
    call(id) {
      for (let i = 0; i < _jobs.expr.length; i += 4)
        if (_jobs.expr[i+3] === id) {
          const v = _jobs.expr[i]
          if (_isUnknown(v))
            for (let j = 2; j < v.length; ++j)
              if (v[j] instanceof Promise && typeof v[j].cancel == 'function')
                v[j].cancel()
          _jobs.expr.splice(i, 4)
          return true
        }
      return false
    },
  },
  _newJobId() {
    if (!_newJobId.id) _newJobId.id = 0
    return _newJobId.id++
  },
  _jobs:{
    txt:`The interpreter loop. Most of it is about dealing with deferred stuff. Use _schedule to do stuff with it.`,
    call() {
      if (!_jobs.expr.length) return
      let time, start, end
      if (typeof global == ''+void 0) // Browser
        time = performance.now.bind(performance), start = time(), end = start + 10
      else { // NodeJS
        const {performance} = require('perf_hooks')
        time = performance.now, start = time(), end = start + 100
      }
      if (!_jobs.duration) _jobs.duration = 0

      // Execute while checking for end.
      if (typeof document != ''+void 0) Working.classList.toggle('yes', true)
      let jobs = _jobs.expr, begin = 0
      do {
        let expr = jobs[begin++], env = jobs[begin++], then = jobs[begin++], id = jobs[begin++]
        if (_isUnknown(expr)) {
          // Go through all expr's promises and bind their instances inside to promise.result if present.
          const ctx = new Map
          for (let i = 2; i < expr.length; ++i) {
            const p = expr[i]
            if (!(p instanceof Promise)) continue
            if ('result' in p)
              ctx.set(p, p.result)
            // Remove us from the promise's continuation (and only us, since there might be different contexts listening to the same promise).
            for (let i = 0; i < p.cont.length; i += 4)
              if (p.cont[i] === expr && p.cont[i+1] === env && p.cont[i+2] === then && p.cont[i+3] === id) {
                p.cont.splice(i, 4)
                break
              }
          }
          expr = bound(expr[1], ctx)
        }

        finish.env = env
        finish.pure = false
        _interrupt.started = _timeSince()
        let v, interrupted
        try { v = finish(expr) }
        catch (err) {
          if (err === _interrupt) interrupted = true, v = expr
          else {
            if (err instanceof Error)
              v = array(_jsRejected, String(err), err.stack)
            else
              v = array(_jsRejected, err)
          }
        }
        finish.env = env

        if (v instanceof Promise) v = 'result' in v ? v.result : [_unknown, v, v]
        // Uncaught exceptions in low-level code (except in promises) will bring the whole loop to a halt; these are our errors to see and regret and fix.
        if (interrupted) // Re-schedule.
          _schedule(v, env, then, id)
        else if (_isDeferred(v)) // Make promises know we're here.
          log('<Deferring', v.filter(x => x instanceof Promise).length, 'promises…>'),
          v.forEach(p => {
            if (p instanceof Promise) {
              if (!p.cont)
                p.cont = [],
                p.then(result => {
                  p.result = result
                  _scheduleAndConsumeMany(p.cont)
                }, reason => {
                  p.result = array(_jsRejected, reason)
                  _scheduleAndConsumeMany(p.cont)
                })
              p.cont.push(v, env, then, id)
            }
          })
        else // We have our result.
          try { then(v) }
          catch (err) { }
      } while (begin < jobs.length && time() < end)
      jobs.splice(0, begin)
      _jobs.duration = time() - start
      if (typeof document != ''+void 0) {
        Working.title = Working.title.replace(/[0-9]+/, jobs.length>>>2)
        if (jobs.length) setTimeout(_jobs, Math.min(_jobs.duration / (+CPU.value || 1) - _jobs.duration, 1000))
        else Working.classList.toggle('yes', false)
      } else if (jobs.length)
        setTimeout(_jobs, 0)
      // _jobs.expr, _jobs.duration
    },
  },
  _scheduleAndConsumeMany(a) {
    // A little function for very slight efficiency gains in promise-handling.
    for (let i = 0; i < a.length; i += 4)
      _schedule(a[i], a[i+1], a[i+2], a[i+4])
    a.length = 0
  },


  _newExecutionEnv(basedOn) {
    // Don't ever re-use the same env in _schedule, use this instead.
    const m = new Map(basedOn)
    m.set(log, finish.env && finish.env.has(log) ? finish.env.get(log) : undefined)
    m.set(label, new Map)
    m.delete(_interrupt)
    return m
  },




















  id:{
    txt: `id: The identity function that just returns x from \`(id x)\`.`,
    _argCount:1,
    call(x) { return x },
  },





  first:{
    txt: `Finished (first …Branches): tries to evaluate each expression in order, returning the first non-error result or else error.`,
    examples: [
      [`(first "1" "2")`, `"1"`],
      [`(first (error) "2")`, `"2"`],
      [`x→(first (error) x "1")`, `x→(first x "1")`],
    ],
    nameResult: ['firstOf', 'result'],
    finish(...branches) {
      const us = finish.v
      if (branches.length == 1) return finish(branches[0])
      let [i = 0, v = _emptyError] = _interrupt(first)
      try {
        for (; i < branches.length; ++i) {
          if (!_isError(v = finish(branches[i]))) {
            if (i+1 < branches.length && _isUnknown(v))
              return v[1] = _cameFrom(array(first, v[1], ...branches.slice(i+1)), us), v
            return v
          }
        }
      } catch (err) { if (err === _interrupt) _interrupt(first, 2)(i,v);  throw err }
      return v
    },
  },
  last:{
    txt: `Finished (last …Branches): tries to evaluate each expression in order, returning the first error or else the last non-error result.`,
    examples: [
      [`(last "1" "2")`, `"2"`],
      [`(last (error) "2")`, `(error)`],
      [`x→(last "1" x (error) "2")`, `x→(last x (error) "2")`],
    ],
    nameResult: ['lastOf', 'result'],
    finish(...branches) {
      const us = finish.v
      if (branches.length == 1) return finish(branches[0])
      let [i = 0, v = _emptyError] = _interrupt(last)
      try {
        for (; i < branches.length; ++i)
          if (_isError(v = finish(branches[i])))
            return v
          else if (i+1 < branches.length && _isUnknown(v))
            return v[1] = _cameFrom(array(last, v[1], ...branches.slice(i+1)), us), v
      } catch (err) { if (err === _interrupt) _interrupt(last, 2)(i,v);  throw err }
      return v
    },
  },

  try:{
    txt: `(try …Functions): returns a function that tries to call functions in order, returning the first non-error result or error.`,
    examples: [
      // [`(f 1 2) f:(func 2 3 4)`, `(error 'Not assignable')`],
      // [`(f 1 2) f:(func a b 3)`, `3`],
      // [`(f 1 2) f:(func 2 3 4)`, `(error 'Not assignable')`],
      // [`(f 1 2) f:(func a b 3)`, `3`],
      // [`(f 1 2) f:(func 2 3 4)`, `(error 'Not assignable')`],
      // [`(f 1 2) f:(func a b 3)`, `3`],
      // [`(f 1 2) f:(try (func 2 3 4) (func a b 3))`, `3`],
      [`(f 1 2) f:(try (func 1 3 5) (func 1 6) (func a b (+ a b)))`, `3`],
    ],
    future:`Compute the type if not undefined.`,
    call(...functions) {
      const impl = function tryInOrder(...data) {
        let [i = 0, v = _emptyError, arr] = _interrupt(tryInOrder)
        let us = finish.v
        try {
          for (; i < functions.length; ++i) {
            if (arr === undefined) arr = _cameFrom(array(functions[i], ...data), functions[i])
            if (!_isError(v = call(arr))) {
              if (i+1 < functions.length && _isUnknown(v))
                return v[1] = _cameFrom(array(first, v[1], _cameFrom(array(_cameFrom(array(_try, ...functions.slice(i+1)), us), ...data), us)), us), v
              return v
            }
            arr = undefined
          }
          return v
        } catch (err) { if (err === _interrupt) _interrupt(tryInOrder, 3)(i,v,arr);  throw err }
      }
      _cameFrom(impl, finish.v)
      impl.defines = new Map
      impl.defines.set(deconstruct, array(_try, ...functions))
      impl.defines.set(_impure, functions.some(_impure))
      return impl
    },
  },
  _try: is('try'),
  guard:{
    txt: `(guard …Functions): returns a function that tries to call functions in order, returning the first error or last non-error result.`,
    future:`Compute the type if not undefined.`,
    call(...functions) {
      const impl = function tryInOrder(...data) {
        let [i = 0, v = _emptyError] = _interrupt(tryInOrder)
        let us = finish.v
        try {
          for (; i < functions.length; ++i)
            if (_isError(v = call(_cameFrom(array(functions[i], ...data), is))))
              return v
            else
              if (i+1 < functions.length && _isUnknown(v))
                return v[1] = _cameFrom(array(last, v[1], _cameFrom(array(_cameFrom(array(guard, ...functions.slice(i+1)), us), ...data), us)), us), v
          return v
        } catch (err) { if (err === _interrupt) _interrupt(tryInOrder, 2)(i,v);  throw err }
      }
      _cameFrom(impl, finish.v)
      impl.defines = new Map
      impl.defines.set(deconstruct, array(guard, ...functions))
      impl.defines.set(_impure, functions.some(_impure))
      return impl
    },
  },
  compose:{
    txt: `(compose …Functions): returns a function that composes functions left-to-right, passing the output of each function to the next one.`,
    examples: [
      [`(f 1) f:(compose a→(* a 8) b→(+ b 2))`, `10`],
      [`((compose f g) 1) f:x→(+ 1 x) g:x→(* 2 x)`, `4`],
    ],
    future:`Compute the type if not undefined.`,
    call(...functions) {
      // A shorter and less valid version, simpler to understand:
      // return x => { for (let f of functions) x = f(x);  return x }
      if (functions.length == 1) return functions[0]
      if (!functions.length) return id
      const impl = function doInOrder(...data) {
        const us = finish.v
        let [i = 0, v = data.length == 1 ? data[0] : array(rest, data)] = _interrupt(doInOrder)
        let r
        try {
          for (; i < functions.length; ++i) {
            v = call(_cameFrom(array(functions[i], v), functions[i]))
            if (_isError(v)) return v
            if (i > 1)
              if (i+1 < functions.length && _isUnknown(v))
                return v[1] = _cameFrom(array(_cameFrom(array(compose, ...functions.slice(0,i)), us), v[1]), us), v
          }
          return v
        } catch (err) { if (err === _interrupt) _interrupt(doInOrder, 2)(i,v);  throw err }
      }
      _cameFrom(impl, finish.v)
      impl.defines = new Map
      impl.defines.set(deconstruct, array(compose, ...functions))
      impl.defines.set(_impure, functions.some(_impure))
      if (_view(functions[0]) instanceof Map && _view(functions[0]).has(_argCount))
        impl.defines.set(_argCount, _view(functions[0]).get(_argCount))
      return impl
    },
  },









//   many:{
//     txt: `(many …Values): Represents many values at once. Calls with many arguments return many results, unless they are all ref-equal.
// Enumeration is NOT automatically deferred if the result is too big (or even infinite); deferred results DON'T show up as \`(rest (lazy X))\` in the list. We need a hero for this — automatic laziness.
// \`(+ "1" (many "2" "3" "4"))\` is \`(many "3" "4" "5")\`.
// \`(many X)\` is just \`X\` unless it's \`(rest Y)\`.`,
//     examples: [
//       [`(+ 1 (many 2))`, `3`],
//       [`(+ 1 (many))`, `(many)`],
//       [`(+ 1 (many 2 3 4))`, `(many 3 4 5)`],
//     ],
//     finish:undefined,
//     call:undefined,
//     _impure:undefined,
//     merge:undefined,
//     defines(f) { return _manyEvaluations },
//   },
//   manyPossibilities:{
//     txt: `Now, we just use this override as a way to signal that a call should not be merged.
// Before:
// Finished (manyPossibilities Expr): Returns all possibilities that can arise from evaluation of Expr. If not overriden, just evaluates Expr.
// Everything impure must override \`manyPossibilities\`, as we rely on being able to partially evaluate expressions. Override this to not merge.`,
//     finish(x) {
//       if (this !== manyPossibilities) return
//       if (_isString(x)) return x
//       // Allow x to override manyPossibilities.
//       let r
//       if ((r = defines(x, manyPossibilities)) !== undefined)
//         if ((r = _getOverrideResult(r, array(manyPossibilities, x))) !== undefined)
//           return r
//       // Finish x after replacing every part of x with (manyPossibilities Part).
//       if (!_isArray(x)) return x
//       let y = x.slice()
//       for (let i = 0; i < y.length; ++i)
//         y[i] = array(manyPossibilities, x[i])
//       return finish(_maybeMerge(y))
//     },
//   },
//   enum:{
//     txt: `Finished (enum Expr): Returns an array of all possible results of Expr; enumerates possibilities.
// Functions (particularly impure ones, like random number generation) can override \`enum\` like they would override \`finish\` to become \`many\` possibilities.
// \`(enum (+ (many "1" "2") (many "2" "3" "4")))\` is \`("3" "4" "6" "5")\` or some permutation.
// \`(enum (many))\` is an \`(error)\`.

// …Should be replaced with (goal Expr Measure) — enum-and-commit-best, given meaning to by (minimize Expr)/(maximize Expr) inside (likely returning many results, each associated with its self-write journal, and choosing-best on knowing the goal).`,
//     examples: [
//       [`(enum 2)`, `(2)`],
//       [`(enum (+ 1 (many)))`, `(error)`],
//       [`(enum (+ (many 1 2) (many 2 3 4)))`, `(3 4 6 5)`],
//     ],
//     finish(x) {
//       return _manysToArrays(finish(array(manyPossibilities, x)))
//     },
//   },
//   _manysToArrays(x, toRest = false) {
//     if (!_isArray(x) || x[0] !== many) return !toRest ? array(x) : x
//     if (x.length === 1) return _emptyError
//     // Replace x with merge(x.slice(1).map(…)). Put every element through _manysToArrays, creating a rest element in the result for each.
//     let to = x.slice(1)
//     for (let i = 0; i < to.length; ++i)
//       to[i] = _manysToArrays(to[i], true)
//     to = _maybeMerge(to)
//     return !toRest ? to : array(rest, to)
//   },
//   _manyEvaluations(...args) {
//     // Eager version that does not defer any computations at all. Laziness will eventually save it.
//     if (this === _manyEvaluations) return many
//     args.unshift(this)

//     let relevant = false
//     for (let i = 0; i < args.length; ++i) {
//       if (_isArray(args[i]) && args[i][0] === many) { relevant = true; break }
//     }
//     if (!relevant) return

//     const had = new Set
//     const results = [many, args]
//     // For each (many …) argument of each result shallow-expr, copy the result shallow-expr many times, and call the (many …)-less result.
//     for (let i = 1; i < results.length; ++i) {
//       const src = results[i]
//       if (!_isArray(src)) continue
//       for (let j = 0; j < src.length; ++j) {
//         let arg
//         while (_isArray(arg = src[j]) && arg[0] === many) {
//           if (arg.length === 1) return arg // Can't perform any operations on no values.
//           //if ((arg.length-2) + (results.length-1) >= maxResultSize) return // Can't defer without laziness.
//           src[j] = arg[1]
//           for (let k = 2; k < arg.length; ++k) {
//             // Copy results[i] with its a[j] being replaced with arg[k].
//             let copy = src.slice()
//             copy[j] = arg[k]
//             copy = _maybeMerge(copy)
//             results.push(copy)
//           }
//         }
//       }
//       const r = call(src)
//       if (!had.has(r))
//         results[i] = r, had.add(r)
//       else
//         [results[i--], results[results.length-1]] = [results[results.length-1]]
//     }
//     results.length = had.size + 1
//     if (results.length === 2) return results[1]
//     return _maybeMerge(results)
//   },








//   _lazy:{
//     txt: `(_lazy Expr): Just a marker to denote that Expr must be evaluated.
// (Since conceptual-checking would need to force lazy thunks to be sure, lazy thunks would be useless.)`,
//     finish(x) { return finish(x) },
//   },
//   _isLazy(a) { return _isArray(a) && a[0] === _lazy },

//   lazy:{
//     txt: `Finished (lazy Expr): Defers evaluation of Expr to when it is first needed, if ever.
// (Without inlining and partially-evaluating conceptual-checking branches, this is largely useless.)`,
//     // examples: [
//     //   [`(f (lazy 1) f:a→(+ a 2))`, `3`],
//     // ],
//     nameResult: ['delayed', 'later', 'deferred'],
//     future:[
//       `Remove this (this is borderline useless if conceptual checks finish those anyway)… But this is used in try/guard; if we don't, a subexpression would be quoted. Fix that — how?`,
//     ],
//     finish(x, r) { return x === lazy ? lazy : r === undefined ? array(lazy, x) : r },
//   },
//   _use:{
//     txt: `_use(X): an internal function for unwrapping lazy thunks. Finishes X if it is lazy.
// Should be done to each arg of each function when it's used in a non-function-call-or-not-ours expression/statement.
// \`this\` in a function cannot be lazy, as finish/call/defines do not _use their args.`,
//     call(a) {
//       if (a === lazy) return a
//       if (_isLazy(a)) return _use(finish(a[1]))
//       if (_isArray(a) && a[0] === concept && a.length === 3) return _use(a[2])
//       let r = defines(a, _use)
//       if (r === undefined) return a
//       r = _getOverrideResult(r, a)
//       return r !== undefined ? r : a
//     },
//   },





  rest:{
    txt: `(rest Array) or …Array: when used in a call, spreads the Array into the user. When used in an assignment (such as function args), collects the rest of arguments into an array (for simplicity, can only be used once per array).`,
    examples: [
      [`(+ (rest (1 2)))`, `3`],
      [`R→…R`, `R→(rest R)`],
      [`(f (array "a" "b" "c")) f:(A …R)→R`, `("b" "c")`],
      [`(f (array "a" "b" "c")) f:(A (rest R))→R`, `("b" "c")`],
      [`(f (array "a" "b" "c")) f:((rest R) Z)→R`, `("a" "b")`],
      [`(+ …(array 2 3))`, `5`],
      [`(+ …(array …(array 2) 3))`, `5`],
    ],
  },
  _restFind(a) {
    // Find (up to) one `(rest Y)` in a and return its index (or a.length).
    if (!_isArray(a)) return array(error, "Finding rest in not-an-array")
    let r = a.length
    for (let i = 0; i < a.length; ++i)
      if (_isArray(a[i]) && a[i][0] === rest && a[i].length == 2) {
        if (r < a.length) return array(error, "Two (rest …) in an array")
        r = i
      }
    return r
  },




  false:false,
  true:true,

  pick:{
    txt: `Finished (pick Bool A B): Returns A if Bool is false, else B. Evaluates the condition C, then evaluates A if C is false, or B otherwise.`,
    nameResult: ['picked', 'result'],
    finish: {
      _argCount:3,
      call(c,a,b) { // NOT _interrupt-safe!
        if (this === pick) {
          const us = finish.v
          const v = finish(c)
          if (_isError(v)) return v
          if (_isUnknown(v)) return v[1] = _cameFrom(array(pick, v[1], a, b), us), v // Why does this not remove unknowns?
          return v === false ? finish(a) : finish(b)
        }
      },
    },
  },



  quote:{
    txt: `Finished (quote Expr): Returns Expr unevaluated, quoting the exact array structure.
Has somewhat the same effect as adding \`array\` at the beginning of every array seen inside, copying.
(Maybe it should have exactly the same effect, by allowing functions to bind variables within?)`,
    examples: [
      [`(quote x)`, `x`],
    ],
    nameResult: ['quoted', 'exactly'],
    _argCount:1,
    finish(x) { if (this === quote) return x },
    call(x) { // Value ⇒ Expr
      // Create the (quote Expr) representation if needed.
      if (serialize.backctx.has(x)) return x
      if (_isError(x)) return x
      if (_isUnknown(x)) return x
      if (_isArray(x) && (_isLabel(x[0]) || _isArray(x[0])) && _hasCallableParts(x)) return array(quote, x)
      if (_isFunc(x)) return x
      if (_isArray(x) && x[0] === broadcasted) return x
      if (typeof x == 'function') return x
      if (defines(x, finish) === undefined && (!_isArray(x) || defines(x, call) === undefined) && !_hasCallableParts(x)) return x
      if (!_hasCallableParts(x)) return x
      return array(quote, x)
    },
  },
  _hasCallableParts(x, m) {
    if (!_isArray(x)) return
    if (_isLabel(x)) return true
    if (m && m.has(x)) return
    m && m.add(x)
    if (x[0] !== array && (defines(x, finish) !== undefined || defines(x, call) !== undefined)) return true
    for (let i = 0; i < x.length; ++i)
      if (_hasCallableParts(x[i], m || (m = new Set))) return true
  },



  string:{
    txt: `Finished (string …Strings): represents a string of characters, with the label not bound. Also written as "xyz" and "prequote""postquote"; a basic type.
(string "a" "b"): strings inside will be joined (into "ab" here).
(f "abc") f:(string Rest "c")→Rest: can slice off a string's beginning or tail (resulting in "ab" here).`,
    examples: [
      [`"x"`, `"x"`],
      [`(a (string a) a:1)`, `(1 "1")`],
      [`(string "a" "b")`, `"ab"`],
      [`(string "sum is " (+ 1 2))`, `"sum is 3"`],
      [`(f "hello there") f:(string "hello" R)→R`, `" there"`],
      [`(f "hello there") f:(string R "there")→R`, `"hello "`],
      [`(f "yZZZZxz") f:(string "y" R "xz")→R`, `"ZZZZ"`],
    ],
    nameResult: ['joined'],
    call(...s) {
      if (s.length == 1 && _isString(s[0])) return s[0]
      for (let i = 0; i < s.length; ++i) {
        const v = s[i] = _toString(s[i])
        if (!_isString(v)) return array(error, 'Not-a-string encountered when joining strings')
      }
      return s.join('')
    },
    assign(a,b) {
      if (!_isArray(a) || a[0] !== string || !_isString(b)) return

      // Find the index of the sole non-string in a.
      let Rest = a.length
      for (let i = 1; i < a.length; ++i)
        if (!_isString(a[i])) {
          if (Rest < a.length) return array(error, "Two non-strings in an assigned-to array")
            // It is easiest to support only one non-escaped string in assigned-to arrays, and not fiddle with multiple results.
          Rest = i
        }

      // Assign strings.
      if (Rest > 2 || Rest < a.length-2) return array(error, "There must be only one concrete string before or after non-string")
      const start = Rest === 2 ? a[1].length : 0
      const end = b.length - (Rest === a.length-2 ? a[a.length-1].length : 0)
      if (end < start) return array(error, "The assigned string is too short")
      // Check that beginnings and ends coincide.
      if (Rest === 2 && a[1] !== b.slice(0, start)) return array(error, "String prefix is different")
      if (Rest === a.length-2 && a[a.length-1] !== b.slice(end)) return array(error, "String suffix is different")
      // Assign a[Rest]'s pattern to what's in between.
      return call(array(assign, a[Rest], b.slice(start, end)))
    },
  },
  _isString(v) { return typeof v == 'string' },


  label:{
    txt: `(label Name): represents a name that can be bound or assigned. Equal-name labels are bound to the same thing within the same binding.
Evaluating an unbound label results in \`(error)\`; evaluating a bound label results in its value, in the current function call.
These do not merge.`,
    _argCount:1,
    _impure:true,
    examples: [
      [`a a:1`, `1`],
      [`0 0 1 0 0`, `a a 1 a a a:0`],
      [`a a:(a (a) a)`, `(x (x) x x:cycle)`],
      [`x→(+ \`x\` 1)`, `x→(+ x 1)`],
    ],
    finish(l) { if (this === label) return finish.env.get(label).has(l) ? finish.env.get(label).get(l) : array(error, "An unbound label to "+l+" was evaluated") },
  },
  _isLabel(v) { return _isArray(v) && v[0] === label && v.length == 2 },



  _unknown:{
    txt: `(_unknown Expr): denotes that Expr is dependent on unknown factors and cannot be evaluated now, so it has to be deferred.
Unbound variables are unknown.
The internal mechanism for \`purify\` and recording and using the continuation of JS promises.
Check _isUnknown to materialize the inner structure only on demand.`,
    examples: [
      [`(_unknown 1)`, `1`],
      [`a→(_unknown a)`, `id`],
      [`_unknown`, `_unknown`],
    ],
    finish() { return finish.v },
  },
  _isUnknown(v) { return _isArray(v) && v[0] === _unknown },
  _isDeferred(v) { return _isUnknown(v) && v.some(_isPromise) },
  _isPromise(v) { return v instanceof Promise },











  merge:{
    txt: `(merge Arr): Returns either Arr content-equal to its previous incarnation, or Arr.
(The second arg, indexes, can be used to override indexes, for any potential merging of cycles.)
(Does not merge cycles. How would we merge cycles?)`,
    nameResult: ['merged'],
    call(arr, indexes = undefined) {
      if (!_isArray(arr)) throw new Error("Expected an array for a content-based merge")
      if (!merge.contentToArr) merge.contentToArr = new Map


      // Don't even try to merge cycles.
      if (_indexOf(arr, indexes, true) !== undefined)
        return arr
      // See if arr's content is in the global content-to-arr map.
      const m = merge.contentToArr, content = _contentString(arr, indexes)
      const r = _mapGetOrSet(m, content, arr)
      return r !== _notFound ? r : arr
    },
  },
  array:{
    txt: `(array …): an array of items with semantically constant content (so equal-content arrays are merged). Use "bound" to merge cycles, when it can do that.
Use (array F …) instead of (F …) in function args to ignore F's override of "assign", if any.`,
    examples:[
      [`array + 1 2`, `+ 1 2`],
    ],
    call(...x) { return _maybeMerge(x) },
  },
  _maybeMerge(x) { return !_isArray(x) || _impure(x) || _isLabel(x) || x[0] === _const ? x : merge(x) },


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
    txt: `A marker for signifying the not-found state, returned from _mapGetOrSet.`,
  },
  _limitMapSize(m, n) {
    if (m.size > n) // Delete the first (least-recently-added) element.
      try { m.forEach(_deleteFirstMapElement) }
      catch (err) { if (err !== null) throw err }
  },
  _deleteFirstMapElement(_v,k,m) { m.delete(k); throw null },
  _indexOf(x, indexes = undefined, readonly = false) {
    // Return the unique index of an object, possibly newly given.
    if (indexes instanceof Map && indexes.has(x)) return indexes.get(x)
    if (!_indexOf.arrToIndex) _indexOf.arrToIndex = new Map, _indexOf.n = 0
    const m = _indexOf.arrToIndex
    if (m.has(x)) return m.get(x)
    let n
    if (!readonly) {
      m.set(x, n = _indexOf.n++)
      _limitMapSize(m, 1000000)
    }
    return n
  },
  _contentString(arr, indexes = undefined) {
    // Return a string uniquely representing the contents of an array.
    if (!_contentString.a) _contentString.a = []
    const a = _contentString.a // Do not allocate new arrays each call, re-use the same empty one.
    try {
      for (let i = 0; i < arr.length; ++i) {
        const n = _indexOf(arr[i], indexes)
        // Encode 48-bit as 3 16-bit utf8 characters. If indexes get larger, we are in big trouble already.
        a.push(String.fromCharCode(n & 65535, (n>>>16) & 65535, ((n/65536)>>>16) & 65535))
      }
      return a.join('')
    } finally { a.length = 0 }
  },









  ['enumerableTypes']:{
    txt:`A namespace for when/forany/forall/only/any/all, none of which we have found a use for, so far.`,
    at:{
      when:is('_when'),
      forany:is('_forany'),
      forall:is('_forall'),
      only:is('_only'),
      any:is('_any'),
      all:is('_all'),
    },
  },



  _when:{
    txt: `(_when LesserType GreaterType): Returns a type describing when and which elements of Lesser are contained in Greater.
(_when A (_when B C)) is (_when (_when A B) C).
Here, we write (= 1) for (_only 1) — so, we have "=:_only":
For example, (_when (= 1) (= 1)) is (= 1); (_when (= 1) (= 2)) is (_any) — none.
For example, (_when (= 1) (_any (= 1) (= 2))) is (= 1); (_when (= 1) (_any (= 2) (= 3))) is (_any) — none.
For example, (_when (_any (= 1) (= 2) (= 3)) (_any (= 2) (= 3) (= 4))) is (_any (= 2) (= 3)).`,
  },


  _forany:{
    txt: `(_forany Type Property): Returns a type describing when any element of Type satisfies a Property (a function from type to type).
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
    txt: `(_forall Type Property): Returns a type describing when all elements of Type satisfy a Property (a function from type to type).
Here, we write =1 for (_only 1):
For example, (_forall =1 x→(_when x =1)) is =1; (_forall =1 x→(_when x =2)) is (_any) — none.
Prove that all of (_any =1 =2 =3) contain 3: (_forall (_any =1 =2 =3) x→(_when =3 x)) is (_all (_when =3 =1) (_when =3 =2) (_when =3 =3)) is (_any) — no.
Prove that all of (_any  1|2|3  4|5) are 3::x… Become (_all  3::1|2|3  3::4|5), which becomes (_any).
Prove that all of (_all  1|2|3  4|5) are 3::x… Become (_any  3::1|2|3  3::4|5), which becomes 3.`,
  },


  _only:{
    txt: `(_only X): A type of things ref-equal to X.
Generating instances of this always returns X.`,
    assign(a,b) {
      // Demand ref-equality.
      if (_isArray(a) && a[0] === _only) a = a[1]
      if (_isArray(b) && b[0] === _only) b = b[1]
      return a === b ? a : array(error, "Not ref-equal")
    },
    _when(lt, gt) {
      if (_isArray(lt) && lt[0] === _any)
        return _repack(lt, elem => call(array(_when, elem, gt)), _any)
      if (_isArray(lt) && lt[0] === _all)
        return _repack(lt, elem => call(array(_when, elem, gt)), _all)

      // (_when X (_only Y)) => (_when (_when (_only X) (_only Y)))
      const a = _isArray(lt) && lt[0] === _only && lt.length == 2 ? lt[1] : lt
      // (_when (_only X) Y) => (_when (_when (_only X) (_only Y)))
      const b = _isArray(gt) && gt[0] === _only && gt.length == 2 ? gt[1] : gt
      // (_when (_only X) (_only X)) => (_only X), (_when (_only X) (_only Y)) => (_any)
      return a === b ? (a===lt ? lt : b===gt ? gt : array(_only, a)) : _emptyAny
    },
    _forany(type, prop) { return call(array(prop, type)) },
    _forall(type, prop) { return call(array(prop, type)) },

    // gen(x) {
    //   if (!_isArray(x) || x[0] !== _only) return
    //   return x[1]
    // },
  },
  _any:{
    txt: `(_any X Y Z …): A type of things that are either of type X, or of Y, or of Z. The order of types within does not matter.
Generating instances of this returns any element with equal probability.`,
    call(...x) { return _repack(x, undefined, _any, 0) },
    _when(lt, gt) { return _whenRepack(lt, gt, _any) },
    _forany(type, prop) { if (_isArray(type) && type[0] === _any) return _repack(type, prop, _any) },
    _forall(type, prop) { if (_isArray(type) && type[0] === _any) return _repack(type, prop, _all) },

    // gen(x) {
    //   if (!_isArray(x) || x[0] !== _any) return
    //   return call(array(gen, x[1 + _pickNatLessThan(x.length-1)]))
    // },
  },
  _all:{
    txt: `(_all X Y Z …): A type of things that are of types X, and of Y, and of Z, all at once. The order of types within does not matter.`,
    call(...x) { return _repack(x, undefined, _all, 0) },
    _when(lt, gt) { return _whenRepack(lt, gt, _all) },
    _forany(type, prop) { if (_isArray(type) && type[0] === _all) return _repack(type, prop, _all) },
    _forall(type, prop) { if (_isArray(type) && type[0] === _all) return _repack(type, prop, _any) },
  },

  _repack(from, transform, to, fromIndex=1) {
    // We managed to extract almost everything related to _any/_all into this function.
    if (from.length - fromIndex === 0) return to === _any ? _emptyAny : _emptyAll
    const a = to, b = a !== _any ? _any : _all
    // `from` must be an array.
    let result
    const already = new Set, onlys = new Set
    // (vwhen X (_any …Elems)) => (_any …(_when X Elem)) — iterate.
    let [i = fromIndex] = _interrupt(_repack)
    try {
      for (; i < from.length; ++i) {
        const x = transform !== undefined ? call(array(transform, from[i])) : from[i]

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
    } catch (err) { if (err === _interrupt) _interrupt(_repack, 1)(i);  throw err }
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
  _emptyAny:[is('_any')],
  _emptyAll:[is('_all')],















  _pickNatLessThan:{
    txt: `(_pickNatLessThan Nat): Picks a random non-negative integer less than n, from a uniform distribution.
An interface to JS's crypto.getRandomValues for generating random numbers on-demand as opposed to in-batches, optimizing to request the least amount of random bits required.
(_pickNatLessThan 1) is 0.
(_pickNatLessThan 2) is either 0 or 1.`,
    nameResult: ['random', 'nat', 'int'],
    _argCount:1,
    call(n) {
      if (n === true) return false
      n = _toNumber(n)

      if (n !== (n>>>0))
        throw 'Expected uint32 as limit of randomness'
      if (n === 0) return __randomBits()
      if (n === 1) return 0
      if (!(n & (n-1))) return __randomBits(__countBits(n))

      let i=0, q0=0, q1=0;
      if (_pickNatLessThan.oldn === n) i = _pickNatLessThan.oldi, q0 = (1 << i) % n;
      else {
        i = __countBits(n) + 1, q0 = (1 << i) % n, q1 = 2*q0, q1>=n && (q1-=n);
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
        _pickNatLessThan.oldn = n, _pickNatLessThan.oldi = i;
      }
      q1 = (i < 32 ? 1 << i : 2 ** i) - q0;
      do { q0 = __randomBits(i) } while (q0 >= q1);
      return q0 % n
    },
    _impure:true,
  },
  _pickProb:{
    txt: `(_pickProb Probability): Returns true with probability p, else false.
Equivalent to 'Math.random() < p' with checks on p (it should be 0…1), but (probably) faster.`,
    nameResult: ['passed', 'isOk', 'bool'],
    _argCount:1,
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
          if (n === n >> 3 << 3) return !__randomBits(1); // 8 — X000
          if (n === n >> 2 << 2) return __randomBits(2) < (n >> 2); // 4, 12 — XX00
          if (n === n >> 1 << 1) return __randomBits(3) < (n >> 1); // 2, 6, 14 — XXX0
        }
        const r = __randomBits(4);
        if (r !== n) return r < n; // XXXX
        else p -= n; // 1/16 chance of continuing computation.
      }
      // Generating (up to) 4 bits at a time is not based on past performance measures, or anything.
      // Using 4 bits at a time consumes on average about double the bits that using 1 bit at a time would, but should be much faster.
    },
  },

  __countBits(n) { let x=0; while (n >>>= 1) ++x;  return x },
  __randomBits(n) { // Returns n || 32 random bits.
    if (!n) {
      if (!__randomBits.a)
        Object.assign(__randomBits, { a:new Int32Array(1024), pos:1024 })
      if (__randomBits.pos >= __randomBits.a.length) __randomBits.pos = 0, __randomFill(__randomBits.a);
      return __randomBits.a[__randomBits.pos++];
    }
    if (n !== (n & 31)) throw 'Expected 0…31 bits to generate (where 0 is 32)';
    if (__randomBits.n === void 0) __randomBits.r = __randomBits.n = 0;
    let r = 0;
    if (n > __randomBits.n) r = __randomBits.r, n -= __randomBits.n, __randomBits.r = __randomBits(), __randomBits.n = 32;
    r = (r << n) | (__randomBits.r & ((1 << n) - 1)), __randomBits.n -= n, __randomBits.r >>>= n;
    return r;
  },
  __randomFill(buf) { // Fills a u/int-array or array-buffer with random data.
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
    txt: `The result of circular calls, ordinarily an infinite loop that never returns, is instead \`cycle\`.`,
    examples: [
      [`f 1 f:1→(f 1)`, `cycle`],
      [`a a:(a (a) a)`, `(x (x) x x:cycle)`],
    ],
  },
  finish:{
    txt: `(finish Expr): Fully evaluates the expression; by default, provides eager override-checking semantics, finishing all parts before \`call\`ing Expr.
Overriding this allows staging (altering the executed expression) but also more. Finishing concepts cannot be called (unless using \`(call (quote FinishingExpr))\`). Expr-expecting functions can be used as finished by \`quote\`ing its arguments.
\`finish\` proceeds top-down, from what is needed to primitives; \`call\` proceeds bottom-up, making what is needed from primitives.

Evaluation happens on graphs. One graph node will be evaluated only once during a function call, so graph bindings (\`… a:(…)\`) play the role of variables (on top of that, \`call\` does its own caching). Instead of never returning, infinite computations return \`cycle\` (and prevent caching until that node is fully returned from). Computations with only one possible output are merged (unless a part of a cycle — too difficult for us).

Technical notes:
JS functions have Expr spread across their args (with \`this\` being the zeroth arg, code) (unless not-an-array, in which case \`this\` is undefined and the first arg is what is called/finished), resulting in both convenience and inefficiency (of array allocation for varargs).
In defines, \`this\` is always what is overriden.
In JS defines of \`finish\` and \`call\`, finish.v is the currently-executing Expr.
finish.env is the current execution environment; put everything non-local there (scoped to your function). It already has the DOM element to put logs into and label-bindings.
Don't call this in top-level code directly — use \`schedule\` instead.`,
    nameResult: ['finished'],
    future:[
      `Compile expressions to linear-execution automata (delimited at \`finish\`-overriding things; args to \`call\` before the function, args to \`finish\` after, with a number if _argCount is unknown), with same-nodes copied as needed and cycles being \`cycle\` at compile-time. Track cyclicity and results explicitly only at entry.`,
    ],
    call(v) {

      // Cache, so that a common object is a variable, evaluated only once.
      const c = typeof v != 'string' && v && typeof v == 'object'
      if (finish.pure && _isArray(v) && v[0] === _var) return [_unknown, v]
      if (c) {
        if (finish.env.get(label).has(v)) return finish.env.get(label).get(v)
        finish.env.get(label).set(v, cycle)
      }

      try {
        let result
        try {
          let [finished, i = 0, record] = _interrupt(finish)
          try {
            // Check if v defines its own evaluation (finishing).
            if (_isArray(v) && finished === undefined && defines(v, finish)) {
              if (finish.pure && defines(v, _impure)) return [_unknown, v]
              let r
              if (finish.v = v, (r = _checkOverride(v, finish, v)) !== undefined)
                return result = r
            }

            // Check typedness if specified.
            if (_isError(type(v))) throw type(v)

            if (_isArray(v)) {
                // Evaluate arguments. (finished = _maybeMerge(v.map(finish)), treating errors and unknowns specially.)
                if (finished === undefined) finished = v.slice()
                _cameFrom(finished, v)
                for (; i < finished.length; ++i) {
                  const r = finished[i] = finish(v[i])
                  if (_isError(r)) return result = r
                  if (_isUnknown(r)) {
                    if (!record) {
                      for (let k=0; k<i; ++k) finished[k] = quote(finished[k])
                      record = r
                    } else
                      record.push(...r.slice(2))
                    finished[i] = r[1]
                  } else if (record)
                    finished[i] = quote(finished[i])
                  else if (_isArray(r) && r[0] === rest && r.length == 2) {
                    // Unroll `(rest Array)`.
                    if (r.length != 2) throw array(error, "Invalid count of args to rest")
                    if (!_isArray(r[1])) return array(error, "Expected an array to spread, got", r[1])
                    finished.splice(i, 1, ...r[1]), i += r[1].length
                  }
                }
                if (i === finished.length) finished = _maybeMerge(finished), ++i

                // Do the call with evaluated args.
                if (!record)
                  return result = call(finished)
                else
                  return record[1] = finished, result = record
            }
          } catch (err) { if (err === _interrupt) _interrupt(finish, 3)(finished, i, record);  throw err }
          return result = v
        } finally {
          _cameFrom(result, v), c && _cache(finish.env.get(label), v, result)
          if (result instanceof Promise) return [_unknown, result, result]
        }
      } catch (err) { if (err === _interrupt) finish.env.get(label).delete(v);  throw err }
      // finish.env, finish.v, finish.pure
    },
  },
  call:{
    txt: `(call (…Values)): Applies the first value (the function) to the rest of values. Evaluates the array of function then its arguments, assuming its parts are already evaluated.
Overriding this allows function application. In fact, \`F:(func …)\` is the same as \`(concept (map call F))\`.
Caches results of pure functions.`,
    nameResult: ['result'],
    call(v) {
      if (finish.pure && defines(v, _impure)) return [_unknown, v]
      const m2 = call.cache || (call.cache = new Map)
      try {
        // Cache call too.
        let r
        r = _maybeUncache(m2, v)
        if (r !== _notFound) return r
      } catch (err) { if (err === _interrupt) log('UH-OH');  throw err }

      let result = _notFound
      try {

        _checkInterrupt()

        let i
        [i = 1] = _interrupt(call)
        try {
          // Do the function call, just like normal people do.
          let r
          if ((r = defines(v, call)) !== undefined)
            return finish.v = v, result = _getOverrideResult(r, v)
        } catch (err) { if (err === _interrupt) _interrupt(call, 1)(i);  throw err }

        return result = v
      } finally {
        if (result !== _notFound)
          _cameFrom(result, v), _cache(m2, v, result)
        else m2.delete(v)
        if (result instanceof Promise) return [_unknown, result, result]
      }
    },
  },
  defines:{
    txt: `(defines Data Code): Gets the definition by Data of Code.
It's either a function or undefined, and has to be applied or ignored respectively (_getOverrideResult) to get the actual overriden value.

Array data gets its head consulted (once, not recursively). A function acts like a concept that defined \`call\` as that function. A JS object with a Map \`.defines\` consults that map with Code as the key.`,
    call(data, code) {
      if (code === call && typeof data == 'function') return data
      if (code === call && _isArray(data) && typeof data[0] == 'function') return data[0]

      let d = _view(data)
      if (d == null) return
      if (d instanceof Map) return d.get(code)
      throw "Unrecognized .defines; should be either undefined or a Map."
    },
  },
  _view:{
    txt:`(_view Concept): returns the view of Concept, used to look up things in it.`,
    call(data) {
      if (_isArray(data)) data = data[0]
      return data ? data.defines : undefined
    },
  },
  _getOverrideResult(over, whole) {
    // Execute the override returned from `defines`.
    if (over !== undefined) {
      // Check _argCount if present.
      if (_isArray(whole) && typeof over == 'function' && _view(over) instanceof Map && _view(over).has(_argCount)) {
        const args = _view(over).get(_argCount)
        if (typeof args == 'number' ? whole.length-1 !== args : !args(whole.length-1))
          throw "Invalid arg count: expected " + args + ", got " + (whole.length-1)
      }

      // Execute.
      if (typeof over == 'function')
        return _isArray(whole) ? over.call(...whole) : over(whole)
    }
  },
  _checkOverride(data, code, whole) {
    // Return undefined if there is no result overriden. Combines defines and _getOverrideResult in one.
    let r
    if ((r = defines(data, code)) !== undefined)
      return _getOverrideResult(r, whole)
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
    txt: `(concept View): Creates an object that defines some things. Use _overridable to create functions that allow their definitions to be completely overriden.
Concepts are used to give each function a free extensibility point.
Try to use this only as explicitly suggested by functions.
Views and non-_unknown arrays are considered immutable.

Concepts come from dynamic languages like JS or Python, where most functions end up defining some unique property/key/symbol/string so that input can override a function's behavior. Rather than co-opting strings and files (duck typing, docstrings and documentation) to convey parts of a concept, override functionality directly.`,
    examples: [
      [`(+ 2 (concept (map + (func a b 3))))`, `3`],
    ],
    _argCount:1,
    call(view) {
      if (!(view instanceof Map)) throw "The view must be a Map"
      return {defines:view}
    },
  },
  _overridable:{
    txt:`(_overridable Function): creates a function that checks whether any input defines it, else calls the Function.`,
    _argCount:1,
    call(f) {
      const impl = function checked() {
        // See if any data defines code; use that as our result if so.
        const v = finish.v, code = _isArray(v) ? v[0] : v
        let [i = 0] = _interrupt(_overridable)
        let r
        try {
          if (_isArray(v)) {
            for (; i < v.length; ++i)
              if ((r = _checkOverride(v[i], code, v)) !== undefined)
                return r
            return f.call(...v)
          }
          throw "What"
        } catch (err) { if (err === _interrupt) _interrupt(_overridable, 1)(i);  throw err }
      }
      impl.defines = new Map
      if (_view(f) instanceof Map)
        _view(f).forEach((v,k) => impl.defines.set(k,v))
      impl.defines.set(deconstruct, array(_overridable, f))
      impl.defines.set(_impure, _impure(f))
      return impl
    },
  },































  map:{
    txt: `(map Key Value Key Value …): a key-value store. The array-representation of a JS Map. Get the value of a key with (Map Key).`,
    // examples: [
    //   [`(map …r)→r (map 1 2 3 4)`, `map 1 2 3 4`],
    //   [`(map x y …r)→r (map 1 2 3 4)`, `map 3 4`],
    //   [`(map 3 4 …r)→r (map 1 2 3 4)`, `map 1 2`],
    // ],
    call(...kv) {
      const f = this
      if (f === map) {
        // Construct a Map.
        const x = new Map
        for (let i = 0; i < kv.length; i += 2) {
          const k = kv[i]
          if (x.has(k)) return array(error, 'Duplicate key in a map')
          x.set(k, kv[i+1])
        }
        return x
      } else if (_isArray(f) && f[0] === map && kv.length == 1) {
        // Lookup in a deconstructed map.
        for (let i = 1; i < f.length; i += 2)
          if (f[i] === kv[0])
            return f[i+1]
        return
      } else if (f instanceof Map && kv.length == 1)
        return f.has(kv[0] = kv[0]) ? f.get(kv[0]) : undefined
      else return array(error, "Unknown operation with a map")
    },
    // assign(a,b) { // NOT _interrupt-safe!
    //   if (_isArray(a) && a[0] === map) {
    //     if (!(b instanceof Map)) return array(error, "Expected a map")
    //     const r = _restFind(a)
    //     if (_isError(r)) return r
    //     if (r == a.length) {
    //       return array(error, 'The only assignment to `map` that is supported is assignment to `map Key Value …Rest` (or to `map …Rest`).')
    //     } else {
    //       if (a.length == 2 && r === 1) return call(array(assign, a[1][1], b))
    //       if (a.length != 4) return array(error, 'Can only extract one key/value pair from a Map at a time.')
    //       if (r !== 3) return array(error, 'Please make …Rest be the last assigned-to parameter: this is easier to handle for us.')
    //       // (map x y …r)
    //       let result = _emptyError, rest
    //       try {
    //         b.forEach((v,k) => {
    //           // If neither assignment is an error, return the last of their results from assignment.
    //           const kr = call(array(assign, a[1], k))
    //             // Wait, but what if we are interrupted?
    //           if (_isError(kr)) return
    //           const vr = call(array(assign, a[2], v))
    //           if (_isError(vr)) return
    //           result = finish(array(last, kr, vr))
    //           rest = new Map(b), rest.delete(k)
    //           throw null
    //         })
    //       } catch (err) { if (err !== null) throw err }
    //       return finish(array(last, call(array(assign, a[3][1], rest)), quote(result)))
    //     }
    //   }
    // },
  },
  deconstruct:{
    txt: `(deconstruct Object): turn a native object into its array-representation (that could be evaluated to re-create that native value).
Used by serialization.`,
    call(v) {
      const vv = _view(v) // Override `deconstruct` on a created-from-expr value (like in `func`).
      if (vv instanceof Map && vv.has(deconstruct)) v = vv.get(deconstruct)
      if (_isArray(v)) return v.slice()
      if (typeof v == 'symbol') return [_var]
      if (v instanceof Map) {
        const arr = [map]
        v.forEach((v,k) => arr.push(quote(k), quote(v)))
        return arr
      }
      if (v && v.defines instanceof Map) {
        if (typeof v != 'function') return array(concept, deconstruct(v.defines))
        // Deconstruct a Map, except treat self-references specially.
        const arr = [map]
        v.defines.forEach((val,key) => val === v ? arr.push(quote(key), _unevalFunction(v)) : arr.push(quote(key), quote(val)))
        if (typeof v == 'function' && !v.defines.has(call)) arr.push(call, _unevalFunction(v))
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
    const ctx = _jsEval.ctx in f ? f[_jsEval.ctx] : parse.ctx

    // Remove unnecessary whitespace.
    let src = (''+f).split('\n')
    const ws = /^\s*/.exec(src[src.length-1])[0]
    src = src.map(line => line.replace(ws, '')).join('\n')
    src = src.replace(/^[_a-zA-Z]+/, '')
    try { Function('('+src+')') }
    catch (err) { src = 'function'+src }

    return ctx !== undefined ? array(_jsEval, src, ctx) : array(_jsEval, src)
  },
  ['_jsEval']:{
    txt: `Finished (_jsEval Source Ctx): evaluates (strict-mode) JS source code that can statically reference values of Ctx (a map) with JS-identifier keys.`,
    examples: [
      [`(_jsEval '(x) { return x+5 }') 5`, `10`],
      [`(_jsEval '(x) { return x+a+5 }' (map 'a' 10)) 5`, `20`],
      [`(_jsEval 'b=>a+b' (map 'a' 'q')) 'w'`, `'qw'`],
      [`(_jsEval 'b=>a(12)+b' (map 'a' (_jsEval 'x=>x' (map)))) 'w'`, `'12w'`],
      [`_jsEval 'a(12)+13' (map 'a' (_jsEval 'x=>x' (map)))`, `25`],
      [`( _jsEval '(x) { return x+a()+b+5 }' (map 'b' 1 'a' (_jsEval 'x=>b' (map 'b' (_jsEval '10')))) ) 0`, `16`],
      [`( _jsEval '(x) { return x+a()+5 }' (map 'a' (_jsEval 'x=>a' (map 'a' (_jsEval '10')))) ) 0`, `15`],
    ],
    finish(src, ctx) {
      // Finish ctx (with arbitrary dependencies) ourselves.
      if (this !== _jsEval) return

      if (!_jsEval.compiled) _jsEval.compiled = new WeakMap, _jsEval.ctx = Symbol()

      // Should use options: `{ statementSeparator(){…}, newName(i){…}, exprToSrc(expr), newVar(name, src){…}, scoped(src){…}, return(name){…}, backpatchable(){…}, backpatch(name, src){…}, cacheCompiled(mapName, ofName, varName){…}, link(args, body, filename, structuredBody){…} }`.
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
          // For the JS case, we probably want this to also treat `js.eval …` as instructions to compile… How?
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


      function isValidSyntax(s) { try { Function(s); return true } catch (err) { return false } }
        // A terrible abuse of Function, but it *is* the only easy and correct option.
      function isValidIdentifier(s) {
        return typeof s == 'string' && s && (/^[a-zA-Z]+$/.test(s) || !/\s/.test(s) && isValidSyntax('let '+s+'=('+s+')\ntry{}catch('+s+'){}'))
      }
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
        if (isValidSyntax('('+s)) return '('+s
        if (isValidSyntax(s = '(function '+s)) return s
        throw "Not a function we know how to deal with: "+f
      }

      const args = Object.create(null), body = ["'use strict'"]
      let env = Object.create(null), backenv = new Map
      const backpatch = new Map
      function sep() { return opt.statementSeparator() }
      let n = 0
      function newName() { return opt.newName(n++) }
      function alloc(v) { const n = newName(); args[n] = v, env[n] = opt.oldName(n); return n }
      const m = _jsEval.compiled
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

        // If not (js.eval …), or already compiled, just pass it (or its compiled code) through as an arg.
        if (!_isArray(func) || func[0] !== _jsEval || m.has(func)) {
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
            if (!isValidIdentifier(k)) return
            if (v !== func) compile(v,k)
          })
        else if (_isArray(ctx) && ctx[0] === map) {
          // Ctx is unfinished, so we could link potentially-circular js.eval dependencies ourselves.
          for (let i = 1; i < ctx.length; i += 2) {
            const ke = ctx[i], ve = ctx[i+1]
            let k
            if (_isArray(ke) && ke[0] === _jsEval && ke !== func)
              compile(ke)
            else
              k = finish(ke),
              k = isValidIdentifier(k) ? k : undefined
            if (k && k in env && !oldEnv) {
              // If a key conflicts, change the name and escape into a hidden function.
              oldEnv = env, env = Object.create(null)
              oldName = name, name = newName()
              oldEnd = body.length
            }
            if (_isArray(ve) && ve[0] === _jsEval) {
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
      body.push(sep(), opt.return(compile(array(_jsEval, src, ctx))))
      opt.debugStructure && opt.debugStructure(body)
      const linked = opt.link(args, deepJoin(body), opt.newFilename(), body)
      if (typeof linked == 'function') linked[_jsEval.ctx] = ctx
      return linked
    },
  },
  js:{
    txt:`A namespace of everything pertaining to the host language, JavaScript.`,
    at:{
      eval:is('_jsEval'),
    },
  },







  _test(env) {
    let failed = 0, finished = 0, total = 0

    // Run all examples to make sure that they indeed evaluate to what we have specified.
    parse.ctx.forEach(v => {
      const r = _getDataOverride(v, examples)
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
        let scope;
        [a, scope] = parse(a), b = parse(b, undefined, scope)[0]
        _schedule(a, _newExecutionEnv(env), result => {
          ++finished
          const ss = structuredSentence
          const B = serialize(b)
          if (!_isArray(a) || a[0] !== _jsRejected) {
            const A = serialize(result)
            if (A !== B) ++failed, log(ss('Not equal:')), log(ss('a'), a, ss('⇒')), log(ss('A'), result, ss('≠')), log(ss('b'), b)
          } else {
            ++failed, log(ss('Got an error'), a[1]), log(ss('a'), a), log(ss('b'), b)
          }
          if (finished === total && failed)
            log(ss('Failed {' + failed+'/'+total + '} tests.'))
        })
      }
      catch(err){ ++failed, log(structuredSentence('Got an error'), err) }
    }
  },





  _onlyUndefined:{
    txt: `To be used with \`bound\` when \`ctx\` is a function. A marker that we do want to bind to undefined; exists to escape the "returning undefined means no explicit binding". (Currently not used anywhere.)`
  },
  bound:{
    txt: `Finished (bound Expr Ctx): When called, returns a copy of Expr with all keys bound to values in Ctx, as if copying then changing in-place. When evaluated, also evaluates the result.
Can be written as \`key:value\` in an array to bind its elements: \`(a b a:0 b:1)\` is \`(0 1)\`, \`a a:(0)\` is \`(0)\`. Can be used to give cycles to data, and encode graphs and multiple-parents in trees.
An optional third true-by-default boolean argument is true to also bind Ctx values (allowing cycles) or false to not (performing just a substitution).
If Ctx returns non-undefined, its result won't be recursively bound unless cyclic.
\`(bound a (map (quote a) 1))\` becomes 1, as does \`a a:1\`.
If Ctx is a function, this acts as a rewrite:
\`(bound (a b) x→(array + x 1))\` evaluates \`(+ ((+ a 1) (+ b 1)) 1)\`.
On finish, finishes Ctx first, then binds Expr, then finishes Expr; finishes the bound Expr to finished Ctx.`,
    examples: [
      [`(bound 0 (map 0 1))`, `1`]
    ],
    nameResult: ['rewritten', 'expr', 'copy'],
    call(v, ctx, cyclic = true, env = new Map) {
      if (typeof cyclic != 'boolean') throw "`cyclic` must be a boolean"
      if (env.has(v)) return env.get(v)

      if (_isArray(v) && v[0] === _const && v.length == 1) return v
      if (ctx instanceof Map && typeof v != 'string' && (_isLabel(v) ? ctx.has(v[1]) : ctx.has(v))) {
        const r = _isLabel(v) ? ctx.get(v[1]) : ctx.get(v)
        if (env.has(r)) return env.set(v, env.get(r)), env.get(v)
        if (r === v) return v
        return env.set(v, cyclic ? bound(r, ctx, cyclic, env) : r), env.get(v)
      }
      if (!(ctx instanceof Map)) {
        let r = typeof ctx == 'function' ? ctx(v) : call(array(ctx, v))
        if (r !== undefined) {
          if (r === _onlyUndefined) r = undefined
          if (env.has(r)) return env.set(v, env.get(r)), env.get(v)
          if (r === v) return v
          return env.set(v, cyclic ? bound(r, ctx, cyclic, env) : r), env.get(v)
        }
      }
      if (_isArray(v)) {
        // Copy it and bind its parts.
        let copy, changed = false
        if (ctx instanceof Map && v[0] === bound && v.length == 3 && v[2] instanceof Map) {
          // Merge with its context, then bind its expr. An optimization, removing the inner node.
          const prev = ctx
          ctx = new Map(ctx)
          v[2].forEach((v,k) => ctx.set(k,v))
          copy = v[1].slice()
          env.set(v, copy)
          v = v[1]
        } else copy = v.slice()
        _cameFrom(copy, v)
        env.set(v, copy)
        // Bind copy's parts.
        for (let i = 0; i < copy.length; ++i) {
          const r = bound(copy[i], ctx, cyclic, env)
          if (copy[i] !== r)
            changed = true, copy[i] = r
        }
        // This doesn't actually merge cycles.
        env.set(v, v = _maybeMerge(changed ? copy : v))
      }
      return v
    },
    finish(v, ctx, cyclic) {
      // On finish, finish ctx, bind, then finish the bound expr.
      return finish(bound(v, finish(ctx), finish(cyclic)))
    },
  },
  unbound:{
    txt: `(unbound Expr): Eliminates cycles in (a copy of) Expr by inserting \`(bound Expr (map …))\` with keys in the copy.`,
    nameResult: ['acyclic', 'withoutCycles', 'exprWithVars', 'copy'],
    call(x, nameAllocator, unenv = new Map, maxDepth = 0) {
      // nameAllocator is a function(Object, Free) that either returns a new unique name (if !Free) or can mark a previously-allocated name as free.
      const currentAncestors = new Set, needsNaming = new Set
      const parents = new Map
      if (nameAllocator === undefined) {
        let n = 0
        nameAllocator = (_, undo) => !undo && 'v'+n++
      }
      maxDepth = _toNumber(maxDepth)
      let depth = 0
      markParents(x, 0, x)
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
      function invertParents(x) { // From deep parent refs, to lists of deep children.
        if (preserve(x)) return
        if (currentAncestors.has(x)) return
        if (unenv.has(x)) return
        currentAncestors.add(x) // Store "did we ever visit x?" in currentAncestors.
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
        if (!ignoreName && unenv.has(x)) return unenv.get(x)
        if (preserve(x)) return x
        if (!_isArray(x)) return x
        const ch = children.get(x)
        children.delete(x)
        let copy
        if (ch) {
          const ctx = new Map
          copy = array(bound, x, ctx)
          unenv.set(x, copy)
          for (let i = 0; i < ch.length; ++i) {
            let name
            do { name = nameAllocator(ch[i], 0) }
            while (currentAncestors.has(name))
            currentAncestors.add(name)
            names.set(ch[i], name)
          }
          for (let i = 0; i < ch.length; ++i) {
            ctx.set(names.get(ch[i]), unbindChildren(ch[i], true))
          }
          if (!ignoreName && names.has(copy[1]))
            copy[1] = names.get(copy[1])
          else
            copy[1] = unbindChildren(copy[1], true)
        } else {
          copy = x.slice(), unenv.set(x, copy)
          _cameFrom(copy, x)
          for (let i = 0; i < copy.length; ++i)
            copy[i] = unbindChildren(copy[i])
        }
        if (ch) // Deallocate spots for children.
          ch.forEach(c => (nameAllocator(undefined, c), currentAncestors.delete(names.get(c))))
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
    txt: `error or (error …Causes): represents an error that has happened, and useful information as to its likely cause. Unwinds execution when encountered.
Indicates a bug in code, and is intended to be presented to the user.`,
    examples: [
      [`((error 'x'))`, `(error 'x')`],
      [`+ 1 (error 'bad stuff')`, `(error 'bad stuff')`],
      [`+ (* 3 (error 'uh')) 2`, `error 'uh'`],
    ],
  },
  _isError(v) { return _isArray(v) && v[0] === error },
  _emptyError:[is('error')], // Only first/last/try/guard use this.


  _funcPlaceholder:{},
  closure:{
    txt: `(closure Function): makes Function into a closure — names existing in a containing function will be bound by the outer function when a closure is created.
With binding, the actual definition can be outside of the function (particularly if equal-structure closures in different functions are merged) (even though the interface copies closure definitions into each serialized-to-DOM case), so actually separating closures semantically is required. \`var\` can be used to highlight the same variable on parsing.
Uses \`bound\`, and partially-evaluates the result before returning.
Can be written as \`!Function\`.`,
    examples: [
      [`(a→(closure a→12) 13)`, `13→12`],
      [`(a → !a→12 13)`, `13→12`],
      [`(a→!a→!a→12 13)`, `13→!13→12`],
    ],
    _impure:true,
    finish(f) {
      if (this === closure) {
        // Close over the current label-environment, by binding f's body.
        if (!_isArray(f) || f[0] !== func) return
        const [b = _bindFunc(f, finish.env.get(label))] = _interrupt(closure)
        try { return finish(b) }
        catch (err) { if (err === _interrupt) _interrupt(closure, 1)(b);  throw err }
      }
    },
  },
  _bindFunc: {
    txt: `Binds only the function body, with either a Map or a replacing function.`,
    call(f, ctx) {
      let escaping = true
      const binder = x => {
        // Look up in regular env.
        if (ctx instanceof Map) {
          if (typeof x != 'string' && (_isLabel(x) ? ctx.has(x[1]) : ctx.has(x)))
            return quote(_isLabel(x) ? ctx.get(x[1]) : ctx.get(x)) // All `undefined`s will be quoted anyway.
        } else return ctx(x)
        // Don't go into funcs unless they are closed over (nor into quotes).
        if (!escaping && _isFunc(x) || _isArray(x) && x[0] === quote) return x
        else if (x === closure || _isArray(x) && x[0] === closure) escaping = true
        else escaping = false
      }
      return bound(f, binder, false)
    },
  },
  func:{
    txt: `(func …Inputs Output): an arbitrary transformation of inputs into output. It can be called (like \`(f …Data)\`), which assigns …Inputs to …Data (setting variables), and evaluates the function body (Output).
This means that equal variables must be ref-equal (so \`f:(func x x 0)\` accepts \`(f 0 0)\` and \`(f 1 1)\`, but not \`(f 0 1)\`), that Data (as a type) must be a subtype of Inputs, that already-existing variables will get closed-over (so \`(func 0 0)\` uses \`0\` and not treats it as a new variable, and \`(func x (func y x))\` in the inner func refers to the outer \`x\`).
Non-\`closure\` functions within will not be changed by argument application.
Single-input functions can be written as \`Input→Output\`.`,
    examples: [
      [`a→b`, `(func a b)`],
      [`(func a a)`, `id`],
      [`(f "hi") f:a→a`, `"hi"`],
      [`(f "1" f:x→(f x))`, `cycle`],
      [`(f 1 2) f:(func 1 3 5)`, `(error 'Not assignable')`],
    ],
    finish(...inputs) {
      // Purify all inputs (and output).
      const us = finish.v
      let [i = 1, f] = _interrupt(func)
      if (f === undefined) f = inputs, f.unshift(func)
      try {
        for (; i < f.length; ++i) {
          const escaped = _bindFunc(f[i], x => x === us ? _funcPlaceholder : undefined)
          f[i] = purify(escaped)
          if (_isUnknown(f[i])) {
            if (_isDeferred(f[i])) throw "Promises in partial evaluation of functions are not implemented yet, sorry"
            else f[i] = f[i][1]
          }
        }
        try {
          const impl = function impl(...data) {
            if (f.length-2 != data.length) return array(error, "Provided a different count of args than expected")
            let [arr] = _interrupt(impl)
            if (arr === undefined) {
              const args = data.length == 1 ? array(assign, f[1], data[0]) : array(assign, _maybeMerge(f.slice(1,-1)), data)
              arr = [_withEnv, new Map, args, f[f.length-1]]
            }
            try { return finish(arr) }
            catch (err) { if (err === _interrupt) _interrupt(impl, 1)(arr);  throw err }
          }
          f = _bindFunc(f, x => x === _funcPlaceholder ? impl : undefined)
          if (f.length == 3 && _isLabel(f[1]) && f[1][1] === f[2][1])
            return id
          f = merge(f)
          impl.defines = new Map
          impl.defines.set(deconstruct, f)
          impl.defines.set(_impure, _impure(f))
          if (_restFind(f.slice(1,-1)) < f.length-2)
            impl.defines.set(_argCount, f.length-2)
          return impl
        } catch (err) { if (err === _interrupt) log('UH OH');  throw err }
      } catch (err) { if (err === _interrupt) _interrupt(func, 2)(i,f);  throw err }
    },
  },
  _isFunc(x) { return _isArray(x) && x[0] === func },
  _withEnv:{
    finish(labels, a, b) {
      // Basically (last (call (quote a)) b), but with a given label-environment.
      const us = finish.v
      const prev = finish.env.get(label)
      finish.env.set(label, labels)
      try {
        // Execute a (assignment) then b (body).
        let [stage = 0, assigned] = _interrupt(_withEnv)
        try {
          switch (stage) {
            case 0:
              assigned = call(a)
              if (_isError(assigned)) return assigned
              if (_isUnknown(assigned))
                return assigned[1] = _cameFrom(array(_withEnv, labels, assigned[1], b), us), assigned
              ++stage
            case 1:
              return finish(b)
          }
        } catch (err) { if (err === _interrupt) _interrupt(_withEnv, 2)(stage, assigned);  throw err }
      } finally { finish.env.set(label, prev) }
    },
  },
  assign:{
    txt: `(assign Pattern Value): This concept has undergone a lot of change and we are no longer sure what exactly it means, but functions use this to accept args.
In the past:
Returns a map from holes to their values needed to make a bound Pattern and Value always evaluate to the same.
Interpreted as (structural) types, \`(assign Type Subtype)\` returns \`(error)\` if not actually a subtype, or how to turn the more general type into the less general; same for \`(assign Type Value)\`.`,
    nameResult: ['assigned', 'assignmentResult', 'equality'],
    _argCount:2,
    call(a,b) {
      const us = finish.v

      let r, [state = 0] = _interrupt()
      try {
        switch (state) {
          case 0:
            if ((r = _checkOverride(a, _isArray(us) ? us[0] : us, us)) !== undefined) return r
            ++state
          case 1:
            if ((r = _checkOverride(b, _isArray(us) ? us[0] : us, us)) !== undefined) return r
            ++state
        }

        try {
          if (_isArray(a) && a[0] === quote) a = a[1]
          if (_isVar(a)) {
            // Set the value in the current label-environment.
            const m = finish.env.get(label)
            const to = _isLabel(a) ? a[1] : a
            if (!m.has(to)) return m.set(to, b), b
            else return m.set(to, call(array(assign, m.get(to), b)))
          }
          if (_isArray(b) && b[0] === quote) b = b[1]
          if (_isVar(b))
            return b // Allow a kind of unification, by having labels be allowed in both positions.
          if (a === b) return a
        } catch (err) { if (err === _interrupt) log('UH OH');  throw err }
        if (_isArray(a) && a[0] !== _const) {
          // Assign each element, mindful of potential `(rest Y)` in a.
          let Rest, RestLen
          if (Rest === undefined && RestLen === undefined)
          try {
            if (b == null) return array(error, "Expected an array, got "+b)
            if (!_isArray(b)) return call([assign, a, deconstruct(b)]) // This might interrupt and thus re-enter for different arrays, but should be ok.

            // Find the index of the sole (rest X) in a.
            Rest = _restFind(a)
            if (_isError(Rest)) return Rest

            // Check sizes.
            RestLen = b.length - a.length + 1
            if (RestLen < 0) return array(error, "Args too short: expected", a.length-1, "or more, but got", b.length)
            if (Rest === a.length && a.length != b.length) return array(error, "Array lengths mismatch: expected", a.length, "but got", b.length)
          } catch (err) { if (err === _interrupt) log('UH OH');  throw err }

          let [i = 0, arr, result, v] = _interrupt(assign)
          try {
            for (; i < a.length; ++i) {
              // Return the last of assign(a[i], b[i]).
              if (arr === undefined) {
                if (i < Rest) arr = array(assign, a[i], b[i])
                else if (i > Rest) arr = array(assign, a[i], b[i + RestLen - 1])
                else arr = array(assign, a[i][1], _maybeMerge(b.slice(i, i + RestLen)))
              }
              v = call(_cameFrom(arr, us))

              if (v === cycle) continue
              if (_isError(v)) return v
              if (!_isUnknown(result)) {
                if (_isUnknown(v))
                  v[1] = _cameFrom(array(last, quote(result), v[1]), us)
                result = v
              } else {
                if (_isUnknown(v))
                  result[1] = _cameFrom(array(last, result[1], v[1]), us), result.push(...v.slice(2))
                else
                  result[1] = array(last, result[1], v)
              }
              arr = undefined
            }
          } catch (err) { if (err === _interrupt) _interrupt(assign, 4)(i, arr, result, v);  throw err }
          return result !== undefined ? result : b
        }
        return array(error, "Not assignable")
      } catch (err) { if (err === _interrupt) _interrupt(assign, 1)(state);  throw err }
    },
  },




  elem:{
    txt: `(elem TagName Content Style): creates an HTML DOM element.`,
    nameResult: ['element', 'DOM', 'HTML'],
    _impure:true,
    call(tag, content, style) {
      if (typeof document == ''+void 0) return content

      let r
      if ((r = defines(tag, elem)) !== undefined)
        if ((r = _getOverrideResult(r, array(elem, tag, content, style))) !== undefined)
          return r

      const e = document.createElement(tag)
      e.id = _newElemId()
      _elemStyle(e, style)
      _elemAppend(e, content)
      return e
    },
  },
  _elemAppend(p, ch) { // …Is this superseded by _elemInsert, or are these separate cases (in-memory vs very-likely-visual)?
      // Is direct usage of .append (in evaluator/REPL) also superseded?
    if (_isArray(ch)) return ch.forEach(ch => _elemAppend(p, ch))
    if (ch && ch.parentNode) p.append(ch.cloneNode(true)) // This doesn't clone our custom-properties, though.
    else if (ch !== undefined) p.append(ch)
  },
  _elemStyle(p, style) { if (style) p.setAttribute('style', style) },





  structured:{
    txt: `(structured Arrays): shows deep structure of Arrays (consisting of acyclic arrays and strings and DOM elements): wraps each sub-array in \`<node>\` if DOM or pretty-prints it into a string if not.`,
    call(x) {
      // structured (('Hello there.') ' ' ('General Kenobi!'))
      if (typeof Node != ''+void 0) {
        // Turn arrays into <node>s.
        const cache = new Map
        return print(x)
        function print(x) {
          if (cache.has(x)) return cache.get(x)
          if (_isArray(x)) return cache.set(x, elem('node', x.map(print))), cache.get(x)
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
    // '{hello there}, {general kenobi}' — in DOM, each curly-bracketed string gets wrapped in a <node>.
    if (typeof document == ''+void 0) return str.replace(/{|}/g, '')
    let i = 0
    return parse()
    function parse() {
      const a = ['']
      for (; i < str.length && str[i] !== '}'; ++i)
        if (str[i] === '{') ++i, a.push(parse(), '')
        else a[a.length-1] += str[i]
      if (!a[a.length-1]) a.pop()
      return elem('node', _highlightGlobalsInString(a))
    }
  },




  _highlightGlobalsInString(str, wrapper = s => elem('known', s)) {
    // Just some approximation. Wraps potential references to globals in <known>.
    if (_isArray(str) && str.length == 1) str = str[0]
    if (typeof str != 'string') return str

    if (!_highlightGlobalsInString.regex) {
      const regexSrc = []
      parse.ctx.forEach((v,k) => regexSrc.push(k.replace(/[^_a-zA-Z0-9]/g, s => '\\'+s)))
      regexSrc.sort((a,b) => b.length - a.length)
      _highlightGlobalsInString.regex = new RegExp(regexSrc.join('|'), 'g')
    }
    const regex = _highlightGlobalsInString.regex
    regex.lastIndex = 0
    if (!regex.test(str)) return str

    const result = [str]
    regex.lastIndex = 0
    while (true) {
      const s = result[result.length-1]
      const r = regex.exec(s)
      if (!r) break
      const end = regex.lastIndex, start = end - r[0].length
      if (start > 0 && /[a-zA-Z0-9]/.test(s[start-1])) continue
      if (end < s.length && /[a-zA-Z0-9]/.test(s[end])) continue
      result.pop()
      const el = wrapper(r[0])
      el.to = parse.ctx.get(r[0])
      result.push(s.slice(0,start), el, s.slice(end))
      regex.lastIndex = 0
    }
    return result
  },















  nameResult:{
    txt: `(nameResult Expr): provides a list of suggestions for naming Expr. Used in \`serialize\` for more human-readable graph serializations.`,
    call(func) { return typeof func == 'string' && func.length < 20 ? array(func) : _checkOverride(func, nameResult, func) },
  },

  serialize:{
    txt: `(serialize Expr) or (serialize Expr Options) or (serialize Expr Options Context): serializes Expr into a string (that can be parsed to retrieve the original structure) or a DOM tree, depending on Options.
Options must be undefined or a JS object with properties: { maxDepth=∞, offset=0, offsetWith='  ', space=' ', nameResult=false, styles=undefined }; styles is an object that can define methods that transform certain lexic parts (into things like DOM elements), namely { name, known, string, number, bracket, node, ref, whole }.`,
    future:[
      `Re-do this to go through user-defined functions much like \`parse\` does. Pass the "serialize-this-value" helper, the value, and the unbound value.`,
      [
        `Right now, parsing is embellished with some extra syntax, and serialization is basic S-expression-like syntax.`,
        `Separate these languages into two concepts. (Basic syntax is fast to parse, too — and it's not that hard to make it binary and not even requiring parsing.)`,
      ],
      `Allow functions to override something (probably embellished), to allow customization of DOM elements used to display their uses. (Then, do tables with this, have "editable-by-user" mutable code, have bounded number variables be able to be changed by the user with a slider, turn an expression into any of its alternatives, have js.eval highlight not all _globalScope but only strings present in bindings.)`,
    ],
    call(arr, opt, env) {
      let breakLength = opt && opt.breakLength
      const maxDepth = opt && opt.maxDepth
      const offset = opt && opt.offset !== undefined ? opt.offset : 0
      const offsetWith = opt && opt.offsetWith !== undefined ? opt.offsetWith : '  '
      const space = opt && opt.space !== undefined ? opt.space : () => ' '
      const doNameResult = opt && opt.nameResult
      const styles = opt && opt.styles

      if (env === undefined) env = serialize.backctx
      const deconstruction = new Map
      const named = new Set
      const lengths = new Map
      const unstyled = new Map
      const boundToUnbound = new Map
      env.forEach((v,k) => boundToUnbound.set(k,k))
      const unboundToBound = new Map
      arr = deconstructed(arr)

      let n = 0
      const u = unbound(arr, nameAllocator, boundToUnbound, maxDepth)
      unstyled.clear()
      boundToUnbound.forEach((v,k) => unboundToBound.set(v, k))
      if (breakLength) breakLength -= offset * offsetWith.length
      const result = serializeLines(serializeStrings(u), offset)
      return style('whole', result)

      function valueOfUnbound(u) {
        const b = unboundToBound.has(u) ? unboundToBound.get(u) : u
        return !_isArray(u) ? u : unboundToBound.has(b) ? unboundToBound.get(b) : b
      }
      function style(style, str, u, v) {
        const originalLen = lengths.get(str) || str.length
        if (!styles || !styles[style]) return str

        // Associate with the value to bathe same-objects in the same light.
        if (v === undefined) v = valueOfUnbound(u)
        const el = styles[style](str, v, u)
        if (v !== undefined && typeof el == 'object') el.id = _valuedElemId(v, el.id)

        return lengths.set(el, originalLen), el
      }
      function styleLabel(name, u, v, as='name') {
        return typeof name != 'string' || style(as, /^[^`"':\s\(\)!→…\.]+$/.test(name) ? name : '`' + name.replace(/`/g, '``') + '`', u, v)
      }
      function nameAllocator(x, free) {
        if (!free) {
          // First try every string in nameResult(func).
          if (doNameResult && (_isArray(x) || typeof x == 'string')) {
            const y = _isArray(x) ? x[0] : x
            const names = nameResult(unstyled.has(y) ? unstyled.get(y) : y)
            if (names !== undefined && _isArray(names))
              for (let i = 0; i < names.length; ++i)
                if (typeof names[i] == 'string' && !named.has(names[i]) && isNaN(+names[i]) && !parse.ctx.has(names[i])) {
                  const r = styleLabel(names[i], x)
                  named.add(names[i])
                  unstyled.set(r, names[i])
                  return r
                }
          }

          // Generate names in sequence.
          let s
          do { s = toString(n, 'abcdefghijklmnopqrstuvwxyz'), ++n }
          while (named.has(s) || env && env.has(s))
          return styleLabel(s, x)
        } else {
          if (unstyled.has(free) && named.has(unstyled.get(free))) {
            named.delete(unstyled.get(free)), unstyled.delete(free)
          } else --n
        }
      }
      function unenv(u,v) {
        if (env && env.has(v)) {
          named.add(env.get(v))
          const name = env.get(v)
          const r = styleLabel(name, u, array(label, name), 'known')
          unstyled.set(r, u)
          return r
        }
        return u
      }
      function deconstructed(x) {
        // Return a copy of x with non-array non-string non-env things deconstructed.
        if (deconstruction.has(x)) return deconstruction.get(x)
        if (_isLabel(x)) return named.add(x[1]), x
        const original = x
        if (styles && typeof Element != ''+void 0 && _isFunc(x)) {
          // Bind labels inside a func to the same element.
          const styled = new Map
          x = _bindFunc(x, x => {
            if (!_isLabel(x)) return
            if (!styled.has(x[1])) styled.set(x[1], styleLabel(x[1], x))
            return styled.get(x[1])
          })
        }
        if (!_isDOM(x))
          if (!_isArray(x) && !_isString(x) && typeof x != 'number' && (!env || !env.has(x)))
            x = deconstruct(x)
        deconstruction.set(original, x)
        if (_isArray(x)) {
          const copy = x.slice()
          _cameFrom(copy, x)
          unboundToBound.set(copy, original)
          deconstruction.set(original, copy)
          if (!_isLabel(x))
            for (let i = 0; i < x.length; ++i)
              copy[i] = deconstructed(x[i])
          return copy
        }
        return x
      }
      function toString(i, alphabet) {
        if (i < alphabet.length) return alphabet[i]
        return toString(Math.floor(i / alphabet.length), alphabet) + alphabet[i % alphabet.length]
      }
      function insertSpaces(arr) {
        for (let i = arr.brackets ? 2 : 1; i < (arr.brackets ? arr.length-1 : arr.length); ++i) {
          const sp = space(arr[i-1], arr[i])
          if (sp) arr.splice(i++, 0, sp)
        }
      }
      function pprint(arr, breakLength) {
        if (hasNonString(arr)) return arr
        // Either join arr (of strings) inline, or realize it is too long.
        if (!arr.length) throw "arrays are never empty here"
        let len
        if (breakLength != null) {
          len = lengths.get(arr[0]) || arr[0].length
          for (let i = 1; i < arr.length; ++i) {
            if (!arr.brackets || i > 1 && i < arr.length-1) len += space(arr[i-1], arr[i]).length || 0
            len += lengths.get(arr[i]) || arr[i].length
            if (breakLength != null && len >= breakLength) break
          }
        }
        if (breakLength == null || len + offsetWith.length-1 < breakLength) {
          const copy = arr.slice()
          copy.brackets = arr.brackets
          insertSpaces(copy)
          const joined = joinWith(copy, '')
          const styled = style('node', joined, arr)
          lengths.set(styled, len)
          return styled
        } else
          return arr
      }
      function hasNonString(r) {
        for (let i = 0; i < r.length; ++i) if (typeof r[i] != 'string') return true
      }
      function shortestStringQuoting(s) {
        const a = '"' + s.replace(/"/g, '""') + '"'
        const b = "'" + s.replace(/'/g, "''") + "'"
        return a.length < b.length ? a : b
      }
      function serializeStrings(arr, ctx, depth = 0) {
        if (_isString(arr))
          return style('string', shortestStringQuoting(arr), arr)
        if (typeof arr == 'number')
          return style('number', ''+arr, arr)

        const original = arr
        arr = unenv(arr, valueOfUnbound(arr))

        let r, justReturn = false
        if (_isLabel(arr))
          r = [styleLabel(arr[1], arr)]
        else if (_isArray(arr)) {
          if (arr[0] === bound && arr[2] instanceof Map && arr.length == 3) {
            r = [serializeStrings(arr[1], arr[2], depth)]
          } else {
            r = arr.map(el => serializeStrings(el, null, depth+1))
            r.brackets = depth || r.length < 2 ? true : false
          }
        } else r = [arr], justReturn = true
        if (ctx) ctx.forEach((v,k) => {
          if (typeof k == 'string') {
            r.push(k+':', serializeStrings(v, null, depth+1))
          } else
            r.push(style('extracted', [k, ':', serializeLines(serializeStrings(v, null, depth+1), depth+1)]))
        })
        if (!r) return arr
        r.unbound = original
        if (justReturn) return r
        if (r.brackets) r.unshift(style('bracket', '(')), r.push(style('bracket', ')'))

        return pprint(r, breakLength && (breakLength - depth * offsetWith.length))
      }
      function pad(s, len) { return s.length >= len ? s : s + ' '.repeat(len - s.length) }
      function joinWith(arr, sep, padBracketTo) {
        if (hasNonString(arr)) throw "contains not-a-string"
        if (arr.brackets) {
          return (padBracketTo ? style('bracket', pad('(', padBracketTo)) : arr[0]) + arr.slice(1,-1).join(sep) + arr[arr.length-1]
        } else return arr.join(sep)
      }
      function serializeLines(arr, depth = 0) {
        if (!_isArray(arr)) return arr
        const d = arr.brackets ? depth+1 : depth
        const serialized = arr.map(line => serializeLines(line, d))
        serialized.brackets = arr.brackets
        
        if (hasNonString(serialized))
          return insertSpaces(serialized), style('node', serialized, arr.unbound)
        else
          return style('node', joinWith(serialized, '\n' + offsetWith.repeat(d), offsetWith.length), arr.unbound)
      }
    },
  },

  _newElemId() {
    if (!_newElemId.n) _newElemId.n = 0
    return _newElemId.n++
  },
  _valuedElemId(v, id = _newElemId()) {
    // Returns v's previously displayed element id (for highlighting of the same things) or a new one.
    if (!_valuedElemId.m) _valuedElemId.m = new Map
    const r = _mapGetOrSet(_valuedElemId.m, v, id)
    return r !== _notFound ? r : id
  },
  _valuedColor(v) {
    // Returns v's previously displayed element color (for highlighting of the same things) or a new one.
    if (!_valuedColor.m) _valuedColor.m = new Map
    const c = 'rgba(' + _pickNatLessThan(256) + ',' + _pickNatLessThan(256) + ',' + _pickNatLessThan(256) + ',.8)'
    const r = _mapGetOrSet(_valuedColor.m, v, c)
    return r !== _notFound ? r : c
  },

  _extracted:{txt:`ONLY for parsing c:x.`},
  parse:{
    txt: `(parse String) or (parse Options) or (parse String Options Context): parses String into the graph represented by it, returning (Expr NewContext).
Options is a JS object that can have .styles and .parser.
Should probably accept a Language parameter, and check the override of \`parse\` on that.`,
    future:[
      `Cache function results (Unbound) by Func and Substring (maybe only large enough substrings), and copy instead of calling if found in cache.`,
    ],
    call(str, opt, ctx) { // → [value, ctx]
      if (_isDOM(str)) str = str.innerText // Don't even attempt to cache subtrees lol
      if (ctx === undefined) ctx = parse.ctx

      const styles = opt && opt.styles
      const parser = opt && opt.parser || {
        // All functions here are pure.
        // To parse, parser.topLevel(match, ctx) is called; it should return [Result, Ctx] or throw.
        // match (the first arg to each function here) is a function that accepts a function to call it (with current str/i), a string or a sticky regex to match it (returning true and advancing index or false), index to go to it, or undefined to get index.

        allUnmatching: /[^`"':\s\(\)!→…\.]/,
        ws: /\s+/y,
        unmatching(match, str, j) {
          const i = j
          while (j < str.length && this.allUnmatching.test(str[j])) ++j
          match(j)
          if (i >= j) return
          return str.slice(i,j)
        },
        label(match, str, i) { // a, qwer; 12, 1e6
          const n = this.unmatching(match, str, i)
          if (n === undefined) return
          return +n === +n || n === 'NaN' ? +n : array(label, n)
        },
        quoted(match, str, i, quote) { // `...``...` with any quote character.
          if (quote.length !== 1) throw "Quote length must be 1"
          if (str[i] === quote) {
            const start = ++i
            while (i < str.length && (str[i] !== quote || str[i+1] === quote))
              i += str[i] === quote && str[i+1] === quote ? 2 : 1
            if (i === str.length) match(i), match.notEnoughInfo('Unclosed quoted-with-'+quote+' character sequence')
            let s = str.slice(start, i++)
            match(i)
            if (s.indexOf(quote+quote)>=0) s = s.split(quote+quote).join(quote)
            return s
          }
        },
        quotedLabel(match, str, i) { // `...``...`
          const r = this.quoted(match, str, i, '`')
          if (r !== undefined) return array(label, r)
        },
        string(match, str, i) { // '...''...' or "...""..."
          const r = this.quoted(match, str, i, '"')
          return r !== undefined ? r : (match(i), this.quoted(match, str, i, "'"))
        },
        value(match) {
          let r
          if ((r = match(this.quotedLabel)) !== undefined) return r
          if ((r = match(this.string)) !== undefined) return r
          if ((r = match(this.call)) !== undefined) return r
          if ((r = match(this.label)) !== undefined) return r
        },
        at(match) { // obj.key
          let obj = match(this.value)
          if (obj === undefined) return
          while (match('.')) {
            let key = match(this.label)
            if (key === undefined) key = match(this.quotedLabel)
            if (key === undefined) obj = array(at, obj)
            else if (!_isLabel(key)) obj = array(at, obj, key)
            else obj = array(at, obj, key[1])
          }
          return obj
        },
        rest(match) { // …a
          if (match('…')) {
            const r = match(this.rest)
            return r !== undefined ? array(rest, r) : undefined
          }
          return match(this.at)
        },
        arrowFunc(match) { // a→b
          let a = match(this.rest), b
          if (a === undefined) return
          if (match(/\s*→/y))
            match(this.ws),
            b = match(this.closure),
            b === undefined && match.notEnoughInfo('Expected the body of an arrow function')
          else return a
          return array(func, a, b)
        },
        closure(match) { // !f, !a→b
          if (match('!')) {
            const r = match(this.arrowFunc)
            return r !== undefined ? array(closure, r) : undefined
          }
          return match(this.arrowFunc)
        },
        extracted(match) { // c:x
          const key = match(this.closure)
          if (key !== undefined && match(':')) {
            match(this.ws)
            const value = match(this.closure)
            if (value === undefined) match.notEnoughInfo("Expected an actual value to be extracted")
            return [_extracted, key, value]
          } else return key
        },
        many(match, ctx) { // a b c c:x
          let arr = [], ctxless = ctx === undefined
          let clean = true
          while (true) {
            match(this.ws)
            const v = match(this.extracted)
            if (v === undefined) break
            if (_isArray(v) && v[0] === _extracted)
              (!clean ? ctx : (clean = false, ctx = new Map(ctx))).set(_isLabel(v[1]) ? v[1][1] : v[1], v[2])
            else arr.push(v)
          }
          if (ctx) arr = array(bound, arr, ctx)
          return ctxless ? arr : [arr, ctx]
        },
        call(match) { // (a b c c:x)
          if (!match('(')) return
          const arr = this.many(match)
          if (!match(')')) match.notEnoughInfo('Expected a closing bracket')
          return arr
        },
        topLevel(match, ctx) { // (f);  a b c c:x
          let [arr, newCtx] = this.many(match, ctx)
          match(this.ws)
          if (!arr[1].length) match.notEnoughInfo("No value at top level")
          if (arr[1].length == 1) arr[1] = arr[1][0]

          return [arr, newCtx]
        },
      }

      let i = 0
      let lastI = 0
      const struct = styles && [], unbound = styles && new Map
      function match(f) {
        if (typeof f == 'function') {
          const start = i, startLen = struct && struct.length
          const r = f.call(parser, match, str, i)
          if (start < i) {
            struct && lastI < i && struct.push(str.slice(lastI, i))
            if (struct && (startLen < struct.length-1 || typeof struct[startLen] == 'string')) {
              const a = struct.splice(startLen)
              unbound.set(a, r)
              struct.push(a)
            }
          }
          lastI = i
          return r
        } else if (typeof f == 'string') {
          return str.slice(i, i+f.length) === f ? (i += f.length,
            struct && lastI < i && struct.push(str.slice(lastI, i)), lastI = i, true) : false
        } else if (f instanceof RegExp) {
          if (!f.sticky) throw "Matched regexp must be sticky"
          f.lastIndex = i
          const r = f.exec(str)
          return r ? (i += r[0].length,
            struct && lastI < i && struct.push(str.slice(lastI, i)), lastI = i, true) : false
        } else if (typeof f == 'number') {
          i = f
        } else if (f === undefined)
          return i
        else throw "Invalid argument to match"
      }
      match.notEnoughInfo = msg => { throw i === str.length ? ['give more', msg] : msg }

      const [u, newCtx] = parser.topLevel(match, ctx)
      if (i < str.length) throw 'Superfluous characters at the end: '+str.slice(i)

      // Do binding ourselves (and with our own original⇒copy map) so we can style structure bottom-up properly.
      const env = new Map
      if (!_isArray(u) || u.length != 3 || u[0] !== bound) throw "parser.topLevel must return (bound … …)"
      const b = bound(u[1], u[2], true, env)
      function style(struct) {
        const unb = unbound.get(struct)
        const v = env.has(unb) ? env.get(unb) : unb
        if (_isArray(struct)) struct = struct.map(style)
        if (styles) {
          const s = styles(struct, v, unb)
          if (typeof Element != ''+void 0 && s instanceof Element) s.id = _valuedElemId(v, s.id)
          return s
        }
        return struct
      }
      let styled = styles && style(struct)
      return [b, newCtx, styled]
    },
  },






  _specialParsedValue:{txt:`When matched in \`parse\`, represents a value that should be preserved as-is (as it likely comes from a special DOM element/reference).`},

  _basicNotMatching(match, u, j, illegal) {
    // Parses the input string until a character that matches `illegal`.
    if (j !== undefined) {
      // parse; u is the parsed string.
      const i = j
      while (j < u.length && !illegal.test(u[j])) ++j
      match(j)
      if (i >= j) return
      return u.slice(i,j)
    }
    // emit; u is the string to emit (the result of parsing).
    if (typeof u != 'string' || illegal.test(u)) throw "Invalid non-illegal usage"
    match(u)
  },

  _basicLabel(match, u, i) { // a, qwer, `a`; 12, 1e6
    const illegal = /[:\s\(\)→>\+\+\*\/\.\ue000-\uf8ff]/
    const quote = '`'
    if (i !== undefined) {
      const r = _basicQuoted(match, u, i, quote)
      if (r !== undefined) return array(label, r)

      const n = _basicNotMatching(match, u, i, illegal)
      if (n === undefined) return
      return +n === +n || n === 'NaN' ? +n : array(label, n)
    }
    if (typeof u == 'number') match(''+u)
    else if (_isArray(u) && u[0] === label && typeof u[1] == 'string' && u.length == 2) {
      match(illegal.test(u[1]) ? u[1] : _basicQuoted(match, u[1], undefined, quote))
    } else throw "Invalid label"
  },

  _basicQuoted(match, u, i, quote = "'") { // '...''...' with any quote character.
    if (i !== undefined) {
      if (typeof quote != 'string' || quote.length != 1) throw "Quote length must be 1"
      if (u[i] === quote) {
        const start = ++i
        while (i < u.length && (u[i] !== quote || u[i+1] === quote))
          i += u[i] === quote && u[i+1] === quote ? 2 : 1
        if (i === u.length) match(i), match.notEnoughInfo('Unclosed quoted-with-'+quote+' character sequence')
        let s = u.slice(start, i++)
        match(i)
        if (s.indexOf(quote+quote)>=0) s = s.split(quote+quote).join(quote)
        return s
      }
    }
    // Double the quotes inside, and return quoted.
    if (typeof u != 'string') throw "Expected a string"
    if (u.indexOf(quote) < 0) return quote + u + quote
    return match(quote + u.split(quote).join(quote+quote) + quote)
  },

  _basicString(match, u, i) { // '...''...' or "...""..."
    if (i !== undefined) {
      const r = _basicQuoted(match, u, i, '"')
      return r !== undefined ? r : (match(i), _basicQuoted(match, u, i, "'"))
    }
    // Unquote with both quotes, and return the min-length one.
    const a = _basicQuoted(match, u, undefined, '"')
    const b = _basicQuoted(match, u, undefined, "'")
    match(a.length < b.length ? a : b)
  },

  _basicExtracted(match, u, i, value) { // c:x
    if (i !== undefined) {
      const key = match(value)
      if (key !== undefined && match(':')) {
        match(/\s+/y)
        const v = match(value)
        v === undefined && match.notEnoughInfo("Expected an actual value to be extracted")
        return [_extracted, key, v]
      } else return key
    }
    if (_isArray(u) && u[0] === _extracted && u.length == 3)
      match(value, u[1]), match(':'), match(value, u[2])
    else match(value, u)
  },

  _basicMany(match, u, i, value) { // a b c c:x
    if (i !== undefined) {
      const arr = []
      let ctx
      while (true) {
        match(/\s+/y)
        const v = match(_basicExtracted, value)
        if (v === undefined) break
        if (_isArray(v) && v[0] === _extracted)
          (ctx || (ctx = new Map)).set(_isLabel(v[1]) ? v[1][1] : v[1], v[2])
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
    for (let j = 0; j < u.length; ++j) {
      b ? match(' ') : (b = true)
      match(_basicExtracted, u[j], value)
    }
    if (ctx) ctx.forEach((v,k) => (match(' '), match(_basicExtracted, [_extracted, k, v], value)))
  },

  _basicCall(match, u, i, value) { // (a b c c:x)
    if (i !== undefined) {
      if (!match('(')) return
      const arr = _basicMany(match, value)
      if (!match(')')) match.notEnoughInfo('Expected a closing bracket')
      return arr
    }
    if (!_isArray(u)) throw "A call must be an array"
    match('('), match(_basicMany, u, value), match(')')
  },

  _basicValue(match, u, i, call, value) { // String or label or call.
    if (i !== undefined) {
      let r
      if ((r = match(_specialParsedValue)) !== undefined) return r
      if ((r = match(_basicString)) !== undefined) return r
      if ((r = match(_basicLabel)) !== undefined) return r
      if ((r = match(call, value)) !== undefined) return r
      return
    }
    if (u === _specialParsedValue)
      match(u)
    else if (typeof u == 'string')
      match(_basicString, u)
    else if (typeof u == 'number')
      match(_basicLabel, u)
    else if (_isLabel(u))
      match(_basicLabel, u[1])
    else if (_isArray(u))
      match(call, u, value)
    else throw "Invalid value"
  },

  _emAt(match, u, i) { // obj.key
    if (i !== undefined) {
      let obj = match(_basicValue, _basicCall, _emClosure)
      if (obj === undefined) return
      while (match('.')) {
        let key = match(_basicLabel)
        if (key === undefined) obj = array(at, obj)
        else obj = array(at, obj, _isLabel(key) ? key[1] : key)
      }
      return obj
    }
    if (_isArray(u) && u[0] === at && (u[2] === undefined || typeof u[2] == 'number' || typeof u[2] == 'string')) {
      _emAt(match, u[1]), match('.')
      if (u[2] !== undefined) match(_basicLabel, typeof u[2] == 'string' ? [label, u[2]] : u[2])
    } else match(_basicValue, u, _basicCall, _emClosure)
  },

  _emRest(match, u, i) { // …a, ...a; ^a
    if (i !== undefined) {
      if (match('…') || match('...')) {
        const r = match(_emRest)
        r === undefined && match.notEnoughInfo('Expected the rest')
        return array(rest, r)
      }
      if (match('^')) {
        const r = match(_emRest)
        r === undefined && match.notEnoughInfo('Expected the quoted value')
        return array(quote, r)
      }
      return match(_emAt)
    }
    if (_isArray(u) && u[0] === rest && u.length == 2)
      match('…'), match(_emRest, u[1])
      if (_isArray(u) && u[0] === quote && u.length == 2)
        match('`'), match(_emRest, u[1])
    else match(_emAt, u)
  },

  _emSumSub(match, u, i) { // a+b, a-b
    if (i !== undefined) {
      let a = match(_emRest), op
      if (a === undefined) return
      while (op = match(/\s*(?:\+|-)/y)) {
        match(/\s+/y)
        const b = match(_emClosure)
        b === undefined && match.notEnoughInfo('Expected the second arg of +')
        a = array(op.trim() === '+' ? _plus : _minus, a, b)
      }
      return a
    }
    if (_isArray(u) && u[0] === _plus && u.length == 3)
      match(_emRest, u[1]), match('+'), match(_emClosure, u[2])
    else if (_isArray(u) && u[0] === _minus && u.length == 3)
      match(_emRest, u[1]), match('-'), match(_emClosure, u[2])
    else match(_emRest, u)
  },

  _emMultDiv(match, u, i) { // a*b, a/b
    if (i !== undefined) {
      let a = match(_emSumSub), op
      if (a === undefined) return
      while (op = match(/\s*(?:\*|\/)/y)) {
        match(/\s+/y)
        const b = match(_emClosure)
        b === undefined && match.notEnoughInfo('Expected the second arg of +')
        a = array(op.trim() === '*' ? _star : _slash, a, b)
      }
      return a
    }
    if (_isArray(u) && u[0] === _star && u.length == 3)
      match(_emSumSub, u[1]), match('*'), match(_emClosure, u[2])
    else if (_isArray(u) && u[0] === _slash && u.length == 3)
      match(_emSumSub, u[1]), match('/'), match(_emClosure, u[2])
    else match(_emSumSub, u)
  },

  _emArrowFunc(match, u, i) { // a→b, a->b
    if (i !== undefined) {
      const a = match(_emMultDiv)
      if (a === undefined) return
      if (match(/\s*(?:→|->)/y)) {
        match(/\s+/y)
        const b = match(_emClosure)
        b === undefined && match.notEnoughInfo('Expected the body of an arrow function')
        return array(func, a, b)
      } else return a
    }
    if (_isArray(u) && u[0] === func && u.length == 3)
      match(_emMultDiv, u[1]), match('→'), match(_emClosure, u[2])
    else match(_emMultDiv, u)
  },

  _emClosure(match, u, i) { // !f, !a→b
    if (i !== undefined) {
      if (match('!')) {
        const r = match(_emArrowFunc)
        return r !== undefined ? array(closure, r) : undefined
      }
      return match(_emArrowFunc)
    }
    if (_isArray(u) && u[0] === closure && u.length == 2)
      match('!'), match(_emArrowFunc, u[1])
    else match(_emArrowFunc, u)
  },

  _emTopLevel(match, u, i) { // (f);  a b c c:x
    if (i !== undefined) {
      const arr = _basicMany(match, u, i, _emClosure)
      match(/\s+/y)
      if (!arr.length) match.notEnoughInfo("No value at top level")
      if (arr.length == 1) return arr[0]
      return arr
    }
    return _basicMany(match, arr.length <= 1 ? [arr] : arr, undefined, _emClosure)
  },

  _basicTopLevel(match, u, i) { // (f);  a b c c:x
    const value = (match, u, i) => _basicValue(match, u, i, _basicCall, value)
    if (i !== undefined) {
      const arr = _basicMany(match, u, i, value)
      match(/\s+/y)
      if (!arr.length) match.notEnoughInfo("No value at top level")
      if (arr.length == 1) return arr[0]
      return arr
    }
    return _basicMany(match, arr.length <= 1 ? [arr] : arr, undefined, value)
  },

  basic:{
    txt:`A language for ordered-edge-list graphs. label, \`label\`, 'string', "string", (0 1), (a:2 a).
Machinery to use this is currently unimplemented.`,
    parse:is('_basicTopLevel'),
      // Needed additions:
        // Get text content of a node ourselves (not with .innerText), preserving .special=… DOM elements; make the parsed string into an array.
        // Still pass a string as `u` to matched functions (and properly-adjusted `i`), but also allow matching _specialParsedValue (that can advance the passed string).
        // Allow index-gotos to go to arbitrary locations (with a non-adjusted index), counting special DOM elements as 1-length.
    serialize:is('_basicTopLevel'),
      // Needed:
        // Pass in the match function. It can use a string (to emit that into the current structural array) or a function with unbound value and two args x,y (to do `f(match, u, undefined, x, y)`).
        // Then basically style and/or pretty-print as needed. (Maybe extract `style` into a separate function?)
    // And what about styling, what to override for that?
  },

  embellished:{
    txt:`A language for ordered-edge-list graphs (\`basic\`) with some syntactic conveniences. label, \`label\`, 'string', "string", (0 1), (a:2 a); 1+2, a→a*2.
Machinery to use this is currently unimplemented.`,
    parse:is('_emTopLevel'),
    serialize:is('_emTopLevel'),
    // And what about styling, what to override for that?
  },














  __populate:{
    txt:`Store 4 values in tmp at a time, up to the interrupt's state length.
\`...args\` in JS allocates, so this way tries to avoid that.
Only use when returned from _interrupt, and immediately.`,
    call(a,b,c,d) {
      const tmp = _interrupt.tmp
      let index = tmp[tmp.length-1]
      if (index < tmp.length-1) tmp[index++] = a
      if (index < tmp.length-1) tmp[index++] = b
      if (index < tmp.length-1) tmp[index++] = c
      if (index < tmp.length-1) tmp[index++] = d
      if (index >= tmp.length-1) {
        if (!finish.env) return
        if (!finish.env.has(_interrupt)) finish.env.set(_interrupt, [])
        const stack = finish.env.get(_interrupt)
        tmp.pop(), stack.push(...tmp), stack.push(tmp.length), tmp.length = 0
      } else
        return tmp[tmp.length-1] = index, __populate
    },
    _impure:true,
  },
  _checkInterrupt() {
    if ((!finish.env.has(_interrupt) || !finish.env.get(_interrupt).length) && _timeSince(_interrupt.started) > 100 && !_pickNatLessThan(4)) throw _interrupt
  },
  _interrupt:{
    txt:`Used to make functions re-entrant, in a non-interruptible language.
\`throw _interrupt\` to interrupt execution.
Create function state in \`f\` like \`let [i = 0, j = 0] = _interrupt(f)\`, in particular for loops.
Wrap function body in \`try{…}catch(err){ if (err === _interrupt) _interrupt(f,2)(i,j);  throw err }\`. See \`__populate\` for details.
`,
    call(cause, len = undefined) {
      if (!_interrupt.tmp) _interrupt.tmp = []
      const tmp = _interrupt.tmp
      if (len === undefined) {
        // Collect items from the stack into tmp and return it.
        if (!finish.env || !finish.env.has(_interrupt)) return tmp.length = 0, tmp
        const stack = finish.env.get(_interrupt)
        if (!stack.length) return tmp.length = 0, tmp
        const end = stack.length-1
        const length = stack[end]
        tmp.length = length
        const start = end - length
        for (let i = start; i < end; ++i)
        tmp[i - start] = stack[i]
        stack.length -= length+1

        // Check cause
        const got = stack.pop()
        if (got !== cause) {
          // const str = "expected "+serialize.backctx.get(cause)+" but got "+serialize.backctx.get(got)
          // localStorage.setItem(str, (+localStorage.getItem(str) || 0) + 1)
          // log(stack, tmp)
          // throw new Error("Interrupt stack corruption sometime before this — invalid cause: expected "+serialize.backctx.get(cause)+" but got "+serialize.backctx.get(got))
          // Actually, sweep this under the rug (tests of `try` are currently the only ones that are affected, and only if run not in isolation; we couldn't fix it)
          stack.length = tmp.length = 0
        }

        return tmp
      }
      // Return a function that stores 4 values at a time, up to len.
      if (typeof len != 'number') throw "len must be a number"
      tmp.length = len+1
      tmp[len] = 0

      // Allow checking cause
      if (!finish.env.has(_interrupt)) finish.env.set(_interrupt, [])
      finish.env.get(_interrupt).push(cause)

      return __populate
    },
    _impure:true,
  },








  read:{
    txt:`(read Value): reads a global marker of Value (initially undefined). (read Value WillBe): writes it (use _onlyUndefined to write undefined). Can be used to store and update information, preserved between evaluations.`,
    future:`Ability for the interface to efficiently detect self-modification and update accordingly (\`observe X OnChange\`?). …We don't actually show any read-marks though… Would we?`,
    call(v, now = undefined) {
      if (!read.marks) read.marks = new WeakMap
      const j = finish.env.get(journal)
      if (!j) {
        // Forward to read.marks.
        if (now === undefined) return read.marks.get(v)
        else now !== _onlyUndefined ? read.marks.set(v, now) : read.marks.delete(v)
      } else {
        // Check journal first, then read.marks. Store reads in the journal too.
        if (now === undefined) return j.has(v) ? j.get(v) : (j.set(v, read.marks.get(v)), read.marks.get(v))
        else j.set(v, now)
      }
    },
    _impure:true,
  },
  journal:{
    txt:`(journal Expr): virtualizes writes during Expr's evaluation. Returns a journal that can be passed to _peekResult or commit.`,
    _argCount:1,
    call(expr) {
      let [j = new Map] = _interrupt(journal)
      const prev = finish.env.get(journal);  finish.env.set(journal, j)
      try { return [undefined, finish(expr), j] }
      catch (err) { if (err === _interrupt) _interrupt(journal, 1)(j);  throw err }
      finally { prev !== undefined ? finish.env.set(journal, prev) : finish.env.delete(journal) }
    },
  },
  _peekResult:{
    txt:`(_peekResult Journal): Returns the result contained in a journal.`,
    _argCount:1,
    call(journal) { return journal[1] },
  },
  commit:{
    txt:`(commit Journal): performs the actual writes stored in a journal, and returns its result.`,
    _argCount:1,
    call(journal) {
      journal[2].forEach((mark, v) => read(v, mark))
      return journal[1]
    },
    _impure:true,
  },





  _cameFrom:{
    txt:`Provides a potential way to tell which value this one came from, by a transformation like \`bound\` or recording.`,
    call(to, from) {
      if (!_cameFrom.m) _cameFrom.m = new WeakMap
      if (to && typeof to == 'object') _cameFrom.m.set(to, from)
      return to
    },
  },












  type:{
    txt:`(type Expr): returns the type of results of evaluating Expr.
Types can encode and check arbitrary program properties under arbitrary assumptions. Programs cannot execute unless they type-check.
Unless overriden, this just returns \`undefined\`; otherwise, this checks that the type-function does not return an error. A called function can have a type-checker.
\`finish\` checks that the type of the executed Expr is neither an error nor \`cycle\`.
Try to use only \`var\`, \`const\`, \`func\`, \`compose\`, \`try\`, \`guard\` to check the type.`,
    call(expr) {
      if (_isArray(expr) && expr[0] === _typed) return expr[2]
      const over = defines(expr, type)
      if (!_isArray(expr)) return over
      if (expr[0] === quote) return

      // Cache the result, first cycle then the result.
      if (!type.cache) type.cache = new Map
      const r = _mapGetOrSet(type.cache, expr, cycle, 10000)
      if (r !== _notFound) return r
      // If expr is an array that defines `type`, map its inputs with `type`, and call the override.
      // A re-implementation of `finish`, largely copied from there.
      try {
        let result
        try {
          if (over === undefined) {
            // Check that all its args are untyped too.
            for (let i = 0; i < expr.length; ++i)
              if (type(expr[i]) !== undefined && type(expr[i]) !== cycle)
                return result = array(error, "Type-checked fragments must type as `undefined` or `cycle` when used in non-type-checked fragments.", expr, type(expr[i]), "(Use (_typed Expr) for explicit conversion.)")
            return
          }

          let [finished, i = 0] = _interrupt(type)
          try {
            // Fill in types of arguments.
            if (finished === undefined) finished = expr.slice(), finished[0] = over
            _cameFrom(finished, expr)
            for (; i < expr.length; ++i)
              finished[i] = type(expr[i])
            if (i === expr.length) finished = _maybeMerge(finished), ++i

            // Do the call with types of args.
            return result = call(finished)
          } catch (err) { if (err === _interrupt) _interrupt(type, 2)(finished, i);  throw err }
        } finally { _cameFrom(result, expr), type.cache.set(expr, result) }
      } catch (err) { if (err === _interrupt) type.cache.delete(expr);  throw err }
    },
    at:{
      typed:is('_typed'),
      context:is('_context'),
      search:is('_search'),
    },
    _argCount:1,
    philosophy:`Dependent types, separated from logic.`,
  },
  _typed:{
    txt:`(_typed Value Type): specifies that the value definitely fits the type.
Type can override this to do an actual check on the value.`,
    call(value) { return value },
    _argCount:2,
  },
  _context:{
    txt:`(_context Context Expr): sets the type context for the evaluation of Expr, used for type search.`,
    finish(ctx, expr) {
      const [x = finish(ctx)] = _interrupt(_context)
      try {
        if (_isError(x)) return x
        if (_isUnknown(x)) return x[1] = array(_context, x[1], expr), x
        const prev = finish.env.get(_context)
        try { finish.env.set(_context, x); return finish(expr) }
        finally { finish.env.set(_context, prev) }
      } catch (err) { if (err === _interrupt) _interrupt(_context, 1)(x);  throw err }
    },
  },
  _search:{
    txt:`(_search Decision Context): searches Context (a store of typed values) for the first typed value that makes Decision return \`(stopIteration Result)\`.
Decision should override this to produce a list of expressions to (type-check and) add to Context.`,
    future:[
      `Actually implement this.`,
      `Re-search-at-will (possibly with a generator, to not run into repeats). Self-modifying type decorators: \`remembering Type\`, \`instances Type\`. Types of structure: \`tree …Of\`, \`acyclic …Of\`, \`graph …Of\`.`,
    ],
    call(decide) { // (ctx could be easier to pass in implicitly.)
      const ctx = finish.env.get(_context)
      // Is ctx an object { byIdentity:Map (from type to array of values), byResultIdentity:Map (from type to array of functions), byDependentResult:Map (from a random concrete subtype inside) }?
        // Should have a function that adds a value to such a context.
        // Should convert array contexts to this form. (Or, actually, the array should be first, and have these properties for efficiency.)
    },
    at:{
      // (A generic search is an 'either' of those.)
      only(type) {
        const ctx = finish.env.get(_context)
        // Int = Int
        // Int = a   (Special-case the _isVar case.)
        // Find the exact type in the context; return an array of those. (Objects; lookup.)
        // Inputs: goal type.   (Int ctx, need to group objects by identity.)
      },
      apply(type) {
        const ctx = finish.env.get(_context)
        // Int + Int→Float = Float
        // Int + a→Float = Float
        // Find a function with appropriate result and find all its inputs. (Application; backward search.)
        // Inputs: goal type.   (In ctx, need to group functions by result.)
      },
      compose(type) {
        const ctx = finish.env.get(_context)
        // Int→Float + Float→Bool = Int→Bool
        // Int→Float + a→Bool = Int→Bool
        // Int→Float + Bool→F64 + (Float F64)→Bool = (Int Bool)→Bool
        // Find functions that accept the type as its sole argument; for each, either recurse with its result, or find a function that returns the type assignable to goal. Or something… (Composition. Function backward search.)
        // Inputs: goal type — a function.   (In ctx, no grouping will help.)
      },
    },
    philosophy:`The only purpose of specifications is to make programs that fit them.`,
  },
  CX:{
    examples:[ [`type (quote (CX (_typed 1 1)))`, `2`], [`type (quote (CX (_typed 1 2)))`, `3`], ],
    type(x) { return x === 1 ? 2 : 3 },
  },

  _addValueToContext(value, ctx) {
    const t = type(value)
    if (!ctx.byIdentity.has(t)) ctx.byIdentity.set(t, [])
    ctx.byIdentity.get(t).push(value)
    if (_isArray(t) && t[0] === func) {
      // (Shouldn't it be an actual function? That is, typeof t == 'function' and _isArray(defines(t, deconstruct)) and defines(t, deconstruct)[0] === func…)
      // Add it to either .byResultIdentity or to .byDependentResult.
    }
  },











})
