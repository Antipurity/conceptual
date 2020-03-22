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

  const defKey = Symbol('defines')

  // preload is for easier lookups. load is basically a copy of `bound` with a little notational convenience stuff thrown in.
  preload(net, globals)
  load(net, globals, true)
  Object.keys(net).forEach(k => k && +k === +k && delete net[k])
  if (net.interrupt) net.interrupt.noInterrupt = false
  if (net.finish) delete net.finish.v

  return Initialize.call(globals, net, typeof __line != ''+void 0 ? __line.lines : undefined)

  function objectFor(x) {
    // Load {call(){}} into a trivially-callable function, as a notational convenience.
    return x && typeof x.call == 'function' && x.call !== Function.prototype.call ? x.call : Object.create(null)
  }
  function preload(from, into) {
    // Pre-create objects/functions to be filled by `load`, so that arbitrary order of definitions is permitted.
    Object.keys(from).forEach(k => {
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
    if (from._read) into._read.marks = new Map
    if (from.finish && from._newExecutionEnv) into.finish.env = _newExecutionEnv()
    if (from.interrupt) into.interrupt.noInterrupt = true
    Object.keys(from).forEach(k => {
      if (from[k] && Object.getPrototypeOf(from[k]) === __is) {
        if (Array.isArray(from[k].is)) { // Evaluate arrays.
          const m = from[k].is.map(x => load(x))
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
      if (Array.isArray(from.is)) return from = from.is.map(x => load(x)), defines(from[0], finish) && (from[0] = defines(from[0], finish)), from[0].call(...from)
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
          if (from[key] === defKey || from[key] === _read.marks) { into[key] = from[key];  continue }
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
}
__base({

  Initialize:{
    txt:`The program's entry point.`,
    lookup:{
      Browser:__is(`Browser`),
      NodeJS:__is(`NodeJS`),
      WebWorker:__is(`WebWorker`),
    },
    nameResult:[
      `conceptualNetwork`,
      `perpetualBeta`,
    ],
    call(net, lines, into) {
      if (!net || 'v' in finish) throw "Do not call Initialize manually."
      if ('→'.charCodeAt() !== 8594) throw "Unicode data got garbled."
      if (defines(examples, txt).indexOf('\n ') >= 0) throw "Depth got added to strings."

      net[undefined] = undefined, Initialize.lines = lines
      _resolveStack.functions = Object.create(null)
      call.locked = new Map, call.cache = new WeakMap
      pick.ers = [], pick.inlineCache = [], pick.depth = 1

      // Turn `net` into maps.
      let ctx = new Map
      Object.keys(net).forEach(k => ctx.set(label(k), net[k]))
      ctx.set(label('_globalScope'), net) // Deconstructions are very ugly otherwise.
      const backctx = _invertBindingContext(ctx)
      parse.ctx = ctx
      Self[defines.key][_id(lookup)] = net, Object.freeze(Self[defines.key])

      // Fill globals' id-to-key mapping for deconstruction of concepts.
      concept.idToKey = Object.create(null)
      Object.keys(net).forEach(k => concept.idToKey[_id(net[k])] = net[k])

      // Mark lookup.parents of globals.
      lookup.parents = new Map
      function markParents(x, p) {
        if (lookup.parents.has(x) || x === Self) return
        if (p !== undefined) lookup.parents.set(x, p)
        if (!x || typeof x != 'object' && typeof x != 'function') return
        if (p === undefined && backctx.has(x) && backctx.get(x)[0] === '_') lookup.parents.set(x, System)
        if (x instanceof Map) {
          x.forEach(v => markParents(v, p))
        } else if (x && !x[defines.key] && typeof x == 'object') {
          Object.keys(x).forEach(k => markParents(x[k], p))
        } else if (x && x[defines.key] && !defines(x, deconstruct))
          markParents(x[defines.key], x)
      }
      markParents(net)
      lookup.parents.set(net, Self)

      // Warn about unused private variables (quite expensive to compute, so we hide that).
      if (typeof document != ''+void 0)
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
          Browser(into), ok = true
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
    philosophy:`It could be simpler to understand this much simpler language with much the same ideas.

;="A simple pattern-matching core: evaluation on graphs (to not need let-bindings), transformation, backtracking.
Presumed to exist on top of a stage that gets rid of syntax and creates bound graphs."

Globals={

  "quote" (concept {txt "\`^x\` or \`(quote x)\`: when \`eval\`uated, returns \`x\`."})
  "label" (concept {txt "\`x\` or \`(label 'x')\`, or \`?\` or \`(label)\`: a label that can remember bindings. Parsing makes all equal-string-ID labels the same object in memory."})



  "eval" eval eval=(js "(x, binds) => {
    // (This is \`finish\` in the bigger lang, with \`binds\` stored in \`finish.env[_id(label)]\`.)
    if (Array.isArray(x)) {
      // Evaluate each graph node once, in a given function call. Remember bindings.
      if (binds.has(x)) return binds.get(x)

      if (x[0] === quote) return x[1] // Quoting stops evaluation.
      if (x[0] === label) return x // Labels self-evaluate.
      if (x[0] === func) return func(x[1], x[2]) // Functions do not partially-evaluate their bodies here.
        // (Though peval is as simple as "if all inputs are known, or the function says it handles peval, call, else record" — which can handle value promises too.)

      // Evaluate each array item.
      const y = _arrayCache.length ? _arrayCache.pop() : [];  y.length = x.length
      for (let i = 0; i < x.length; ++i) y[i] = eval(x[i], binds)

      // Functions get called, structures get built.
      if (typeof y[0] == 'function') {
        if (y.length != 2) binds.set(x, x = y[0].call(...y))
        else binds.set(x, x = y[0].call(y[0], y[1]))
        return _reuseArray(y), x
      }
      return binds.set(x, y), y
    }
    return x
  }" Globals)
  "assign" (js "(a, b, binds) => {
    // Assign \`b\` to \`a\`, returning an updated version of \`binds\` (a Map that makes \`a\` into \`b\`).

    // Always succeed in assigning greater things.
    if (Array.isArray(b) && b[0] === label) return
    if (binds && binds.has(a)) {
      // Previously-assigned things must be ref-equal. (No unification in this simple core language.)
      if (binds.get(a) !== b) throw 'Expected the same value'
    } else if (Array.isArray(a)) {
      // Bind labels.
      if (a[0] === label) return _oneKeyMap(a,b)

      if (!Array.isArray(b)) throw 'Expected an array'
      if (a.length != b.length) throw 'Lengths differ'

      // Assign each array element.
      for (let i = 0; i < a.length; ++i) binds = _uniteMaps(binds, assign(a[i], b[i], binds))
      // Make \`a->a a=?:Int\` instantly refer to the argument when evaluated.
      ;(binds || (binds = _mapCache.length ? _mapCache.pop() : new Map)).set(a, b)
      return binds
    } else if (a !== b) throw 'Expected the same object'
  }" Globals)



  "func" (concept {
    txt "\`A->B\` or \`(func A B)\` is a transformation from \`A\` to \`B\`: a function that, when called \`(A->B C)\`, matches \`A\` to \`C\` and evaluates \`B\` if successful.
    Arrays must match per-element, vars (labels like \`x\` and \`?\`) remember the matched value, consts (\`#\` or concepts or any other objects) must be ref-equal."
    eval (js "(a, b) => {
      const f = c => {
        const m = assign(a, c) || new Map
        return c = eval(b, m), m.clear(), _mapCache.push(m), c
      }
      f.inputs = [a]
      f.outputs = [(function struct(x) {
          if (Array.isArray(x)) {
            if (typeof x[0] == 'function') return [label]
            if (Array.isArray(x[0])) {
              if (x[0][0] === first || x[0][0] === label) return [label]
              if (x[0][0] === func) return struct(x[0][2])
            }
            return x.map(struct)
          } else return x
        })(b)]
      return f
    }" Globals)
  })

  "first" (concept {
    txt "\`A|…?\` or \`(first A …?)\` is a function that attempts to call each sub-function with the one arg in order, returning the first success or failing."
    eval (js "(...f) => {
      // (This is \`try\` in the bigger lang.)
      const g = c => {
        for (let i = 0; i < f.length; ++i)
          try { return f[i](c) }
          catch (err) { if (err instanceof Error) throw err }
        throw 'None fit'
      }
      g.inputs = [], g.outputs = []
      for (let i = 0; i < f.length; ++i)
        g.inputs.push(...f[i].inputs), g.outputs.push(...f[i].outputs)
      return g
    }" Globals)
  })



  "get" (concept {
    txt "\`get Shape Context\` or \`get Shape\` (to get from the current outer context): generates an instance of \`OutputShape\` by applying functions from the global context zero or more times and taking values from context.
      To get multiple values, \`get X\` multiple times in body."
    eval (js "(out, ctx = get.ctx) => {
      const prevCtx = get.ctx;  get.ctx = ctx
      try {
        const nodes = [[out, ctx, undefined, null]]
        while (nodes.length) {
          const i = Math.floor(Math.random()*nodes.length)
          const node = nodes[i]
          ;[nodes[i], nodes[nodes.length-1]] = [nodes[nodes.length-1], nodes[i]], nodes.pop()
          const [out, f, arg, then] = node

          if (Array.isArray(f) && f[0] === either) {
            // If f is a context, add every item.
            for (let j = 1; j < f.length; ++j) {
              const next = _arrayCache.length ? _arrayCache.pop() : []
              next.push(out, f[j], arg, then)
              nodes.push(next)
            }
            _reuseArray(node)
          }
          else if (typeof f == 'function') {
            if (!f.inputs) continue
            // If f is a function, look for its one arg in context.
            if (arg === undefined) {
              // Don't bother generating inputs if the output is definitely not assignable.
              let k = 0
              for (; k < f.outputs.length; ++k) {
                try { _reuseMap(assign(out, f.outputs[k])); break }
                catch (err) { if (err instanceof Error) throw err }
              }

              // Generate input then call us.
              if (k < f.outputs.length)
                for (let j = 0; j < f.inputs.length; ++j) {
                  const next = _arrayCache.length ? _arrayCache.pop() : []
                  next.push(f.inputs[j], ctx, undefined, node)
                  nodes.push(next)
                }
            } else {
              // Check that the function's output fits the shape, then return it (to \`then\` or globally).
              const v = f(arg)
              try { _reuseMap(assign(out, v)) }
              catch (err) { if (err instanceof Error) throw err; _reuseArray(node) }
              if (!then) return v
              const next = _arrayCache.length ? _arrayCache.pop() : []
              next.push(then[0], then[1], v, then[3])
              nodes.push(next)
            }
          } else {
            // Try assigning, and if ok, return it (to \`then\` or globally).
            try {
              _reuseMap(assign(out, f))
              if (!then) return f
              const next = _arrayCache.length ? _arrayCache.pop() : []
              next.push(then[0], then[1], f, then[3])
              nodes.push(next)
            } catch (err) { if (err instanceof Error) throw err; _reuseArray(node) }
          }
        }
        throw 'Ran out'
      } finally { get.ctx = prevCtx }
    }" Globals)
  })

  "either" (concept { txt "\`(either …Values)\`: a usage context." })



  "_oneKeyMap" (js "(k,v) => {
    const m = _mapCache.length ? _mapCache.pop() : new Map
    m.set(k,v)
    return m
  }" Globals)
  "_uniteMaps" (js "(a,b) => {
    if (!a || !b || a === b) return a || b
    const m = _mapCache.length ? _mapCache.pop() : new Map
    a.forEach(_copyKey, m)
    b.forEach(_copyKey, m)
    _reuseMap(b) // Free b (since it was created by us and for us, with _oneKeyMap).
    return m
  }" Globals)
  "_copyKey" (js "function(v,k) { this.set(k,v) }" Globals)
  "_mapCache" (js "[]" Globals)
  "_arrayCache" (js "[]" Globals)
  "_reuseMap" (js "y => y && (y.clear(), _mapCache.push(y))" Globals)
  "_reuseArray" (js "y => y && (y.length = 0, _arrayCache.push(y))" Globals)
}`,
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
      sizeof:__is(`sizeof`),
      examples:__is(`examples`),
      future:__is(`future`),
    },
  },

  Numeric:{
    txt:`A namespace for some very primitive numeric-computation-related functionality.`,
    lookup:{
      reduce:__is(`reduce`),
      transform:__is(`transform`),
      broadcasted:__is(`broadcasted`),
      Arithmetic:__is(`Arithmetic`),
      Random:__is(`Random`),
      FlatOps:__is(`FlatOps`),
    },
  },

  Arithmetic:{
    equals:__is(`equals`),
    less:__is(`less`),
    min:__is(`min`),
    max:__is(`max`),

    sum:__is(`sum`),
    subtract:__is(`subtract`),
    mult:__is(`mult`),
    divide:__is(`divide`),
  },

  equals:__is([
    __is(`broadcasted`),
    __is([
      __is(`overridable`),
      {
        argCount:2,
        merge:true,
        noInterrupt:true,
        examples:[
          () => {
            const a = Math.random()*10000-5000, b = Math.random() < .5 ? a : Math.random()*10000-5000
            return [[equals, a, b], a === b]
          },
        ],
        call(a,b) { return a === b },
      },
    ]),
  ]),

  less:__is([
    __is(`broadcasted`),
    __is([
      __is(`overridable`),
      {
        argCount:2,
        merge:true,
        noInterrupt:true,
        examples:[
          () => {
            const a = Math.random()*10000-5000, b = Math.random()*10000-5000
            return [[less, a, b], a < b]
          },
        ],
        call(a,b) { return a < b },
      },
    ]),
  ]),

  min:__is([
    __is(`broadcasted`),
    __is([
      __is(`overridable`),
      {
        argCount:2,
        merge:true,
        noInterrupt:true,
        examples:[
          () => {
            const a = Math.random()*10000-5000, b = Math.random()*10000-5000
            return [[min, a, b], Math.min(a,b)]
          },
        ],
        call(a,b) { return Math.min(a,b) },
      },
    ]),
  ]),

  max:__is([
    __is(`broadcasted`),
    __is([
      __is(`overridable`),
      {
        argCount:2,
        merge:true,
        noInterrupt:true,
        examples:[
          () => {
            const a = Math.random()*10000-5000, b = Math.random()*10000-5000
            return [[max, a, b], Math.max(a,b)]
          },
        ],
        call(a,b) { return Math.max(a,b) },
      },
    ]),
  ]),

  FlatOps:{
    txt:`A namespace for low-level operations on flat arrays.`,
    lookup:{
      flatMap:__is(`flatMap`),
      Types:{
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
    },
  },

  flatMap:{
    txt:`\`(flatMap with size (…inputs) out (…inputOffsets) outOffset)\`: maps \`size\` elements with \`(with …in.i)\` and writes results into \`out.i\`.`,
    examples:[
      [
        `flatMap sum 5 (array (f32 (1 2 3 4 5 6 7 8 9)) (f32 (9 8 7 6 50 4 3 2 1))) (f32 (0 0 0 0 0 0 0 0))`,
        `f32 (10 10 10 10 55 0 0 0)`,
      ],
    ],
    call(f, sz, i, o, io, oo) {
      // How to make WebGL do this for us? It doesn't actually have CPU memory, it has GPU buffers. Obviously, we need to convert stuff to buffers and back, but how to do that dynamically like compilation is dynamic?
      if (typeof f != 'function') throw error('Expected a function, got', f)
      if (sz !== sz>>>0) throw error('Expected uint32 size, got', sz)
      if (!_isArray(i)) throw error('Expected an array of inputs, got', i)
      if (defines(f, flatMap)) f = defines(f, flatMap)
      if (!oo) oo = 0
      if (defines(f, noInterrupt)) {
        const args = _allocArray()
        args.length = i.length
        if (io)
          for (let j = 0; j < sz; ++j) {
            for (let k = 0; k < i.length; ++k)
              args[k] = i[k][j + io[k]]
            o[oo + j] = f.apply(f, args)
          }
        else
          for (let j = 0; j < sz; ++j) {
            for (let k = 0; k < i.length; ++k)
              args[k] = i[k][j]
            o[oo + j] = f.apply(f, args)
          }
        _allocArray(args)
      } else {
        let [j = 0, args = _allocArray()] = interrupt(flatMap)
        try {
          const args = _allocArray()
          args.length = i.length
          if (io)
            for (; j < sz; ++j) {
              for (let k = 0; k < i.length; ++k)
                args[k] = i[j + io[k]]
              o[oo + j] = f.apply(f, args)
            }
          else
            for (; j < sz; ++j) {
              for (let k = 0; k < i.length; ++k)
                args[k] = i[j]
              o[oo + j] = f.apply(f, args)
            }
        } catch (err) { if (err === interrupt) err(flatMap, 2)(j, args);  throw err }
        _allocArray(args)
      }
      return o
    },
  },

  i8:{
    txt:`\`(i8 (…Numbers))\`: creates a flat array of signed 8-bit integers.`,
    argCount:1,
    call(x) { return new Int8Array(x) },
  },

  i16:{
    txt:`\`(i16 (…Numbers))\`: creates a flat array of signed 16-bit integers.`,
    argCount:1,
    call(x) { return new Int16Array(x) },
  },

  i32:{
    txt:`\`(i32 (…Numbers))\`: creates a flat array of signed 32-bit integers.`,
    argCount:1,
    call(x) { return new Int32Array(x) },
  },

  u8:{
    txt:`\`(u8 (…Numbers))\`: creates a flat array of unsigned 8-bit integers.`,
    argCount:1,
    call(x) { return new Uint8Array(x) },
  },

  u16:{
    txt:`\`(u16 (…Numbers))\`: creates a flat array of unsigned 16-bit integers.`,
    argCount:1,
    call(x) { return new Uint16Array(x) },
  },

  u32:{
    txt:`\`(u32 (…Numbers))\`: creates a flat array of unsigned 32-bit integers.`,
    argCount:1,
    call(x) { return new Uint32Array(x) },
  },

  f32:{
    txt:`\`(f32 (…Numbers))\`: creates a flat array of 32-bit floats.`,
    argCount:1,
    call(x) { return new Float32Array(x) },
  },

  f64:{
    txt:`\`(f64 (…Numbers))\`: creates a flat array of 64-bit floats.`,
    argCount:1,
    call(x) { return new Float64Array(x) },
  },

  Data:{
    txt:`A namespace for some data-representation-related functions.`,
    lookup:{
      map:__is(`map`),
      merge:__is(`merge`),
      array:__is(`array`),
      struct:__is(`struct`),
      lookup:__is(`lookup`),
      string:__is(`string`),
      concept:__is(`concept`),
      replaceArray:__is(`replaceArray`),
    },
  },

  UI:{
    txt:`A namespace for user interface functionality.`,
    philosophy:`Even when switching languages and/or bindings makes some things look the same, being able to {highlight ref-equal objects}, and {view the basic default-bindings serialization}, and {link to actual values without going through text}, makes meaning a first-class citizen. This is impossible to achieve without first-class UI support, but with it, incomprehensible code can be easy to understand (replicate in a mind).
Keep names short and rely on the IDE.`,
    lookup:{
      log:__is(`log`),
      disableBindings:__is(`disableBindingsElem`),
      REPL:__is(`REPL`),
      evaluator:__is(`evaluator`),
      contextMenu:__is(`contextMenu`),
      hierarchy:__is(`hierarchy`),
      button:__is(`button`),
      files:__is(`files`),
      url:__is(`url`),
      elem:__is(`elem`),
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
      let [i = 0, newLabel = new Map, into = log(elemValue(elem('code', elem('code')), us))] = interrupt(repeat)
      into.classList.add('code')
      prevLog && (finish.env[_id(log)] = into.lastChild), finish.env[_id(label)] = newLabel
      let v, done = false
      try {
        while (true) {
          v = finish(expr)
          if (_isUnknown(v)) return _stage(_cameFrom(struct(repeat, v[1], iterations), us), v)
          _checkInterrupt(us)
          newLabel.clear()
          done = true
          ++i
          if (iterations && (typeof iterations === 'number' ? i >= iterations : iterations(v,i))) return into.remove(), v
        }
      } catch (err) {
        // Log our last computed value.
        const prevPure = finish.pure;  finish.pure = false
        try {
        if (err === interrupt) {
          if (done)
            if (prevLog) {
              finish.env[_id(log)] = into.lastChild
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
        } finally { finish.pure = prevPure }
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
    noInterrupt:true,
    call(m,k) {
      if (!_isArray(m) && defines(m, lookup)) m = defines(m, lookup)
      if (m instanceof Map) return k !== undefined ? m.get(k) : [...m.keys()]
      if (_isArray(m) || typeof m == 'string') return k === k>>>0 ? m[k] : k === undefined ? new Array(m.length).fill(0).map((_,i)=>i) : undefined
      if (m !== defines(Self, lookup) && _invertBindingContext(parse.ctx).has(m) || typeof m == 'function') return []
      return k !== undefined ? m[k] : Object.keys(m)
      // lookup.parents: a Map from globals to what namespace they belong to.
    },
  },

  Self:{
    txt:`A namespace for every function here. Project's GitHub page: https://github.com/Antipurity/conceptual`,
    lookup:__is(`undefined`),
    philosophy:`An old painting of deceit and rot.
    
Cancelled futures:
* Zero-overhead {local {immutable-seeming mutable memory} management} (like an image that is drawn on, or an array sorted in-place): \`(Resource OnDisposal OnClone Value)\` and an \`argClone\` marker (index of what to clone), analyzing the graph on compilation to minimize cloning and dispose right after the last use.
* Global immediately-freeing memory management (for resources that are quite expensive and/or should really be released): ref-counting (with shared ref-counters for cycles) of objects with \`dispose\`.`,
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
    txt:`\`(purify Expr)\`⇒Expr: partially-evaluates Expr, not executing impure subexpressions.
Evaluates as much as is possible, so manual pre-calculations of any kind are never required.`,
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
        `(purify (quote x) x=(sum 1 2))`,
        `3`,
      ],
      [
        `(purify (quote x) x=(randomNat 5))`,
        `(_unknown (randomNat 5))`,
      ],
    ],
    lookup:{
      purifyInWorker:__is(`purifyInWorker`),
    },
    nameResult:[
      `purified`,
    ],
    buzzwords:`partially-evaluating`,
    argCount:1,
    philosophy:`Though everything here is evaluated eagerly, inlining and partially-evaluating functions will drop unused args. This gives benefits of both eager and lazy evaluation.

Staging (code generating code when not everything is known) is done in some native functions here (those that mention _isUnknown and do non-trivial things with it), but with proper partial evaluation, it seems worse than useless for non-native code (since every function inlining acts as its own staging, though not forced through any particular staging order).`,
    call(x) {
      // Set finish.pure to true and just evaluate.
      const prev = finish.pure
      finish.pure = true
      try {
        const r = finish(x)
        if (!_isDeferred(r)) return r
        else return _stage(struct(purify, r[1]), r)
      }
      catch (err) { if (err !== interrupt) return _unknown(jsRejected(err)); else throw err }
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
      if (_isUnknown(v)) return _stage([time, v[1], add + memorySince(start)], v)
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
          else if (f === subtract && typeof result == 'number' && typeof v == 'number') result -= v
          else if (f === mult && typeof result == 'number' && typeof v == 'number') result *= v
          else if (f === divide && typeof result == 'number' && typeof v == 'number') result /= v
          else result = f.call(f, result, v)
          if (_isArray(result) && result[0] === stopIteration) return result[1]

          if (_isUnknown(result)) return _stage(struct(reduce, quote(f), a.slice(i), result[1]), result)
        }
      } catch (err) { if (err === interrupt) interrupt(reduce, 2)(result, i);  throw err }
      return result
    },
  },

  transform:{
    txt:`\`(transform Function Array)\`: transforms each element of Array by applying Function.
\`(transform G (transform F A))\` is the same as \`(transform x -> (F (G x)) A).\``,
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
              record = _unknown(r)
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
    if (typeof a == 'number') return a
    if (a === cycle) error(cycle)
    if (typeof a != 'string') error("Cannot convert to a number", a, "in", finish.v)
    return +a
  },

  _toString(a) {
    if (typeof a == 'number') return ''+a
    return a
  },

  broadcasted:{
    txt:`\`(broadcasted Function)\`: creates a function that is broadcasted over array arguments (\`((broadcasted Func) …Args)\`). No array inputs means just applying Function; having array inputs means returning an array of applying \`(broadcasted Function)\` to each element, with the same index for all arguments, using the last element if out-of-bounds for an argument, and non-array inputs treated as arrays of length 1.
(This is extremely primitive compared to something like Julia's syntactic loop fusion.)`,
    examples:[
      [
        `1.2345*(1e0 1e-10 1e-20 1e-30 1e-40 1e-50)+1`,
        `2.2344999999999997 1.00000000012345 1`,
      ],
    ],
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
                record = _unknown(r)
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
      if (_view(f))
        Object.assign(d, _view(f))
      d[_id(flatMap)] = defines(f, flatMap) || f
      d[_id(deconstruct)] = struct(broadcasted, f)
      if (defines(f, merge))
        d[_id(merge)] = true
      if (defines(f, argCount) !== undefined)
        d[_id(argCount)] = defines(f, argCount)
      _id(impl), Object.freeze(impl)
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

  subtract:__is([
    __is(`broadcasted`),
    __is([
      __is(`overridable`),
      __is(`_subtract`),
    ]),
  ]),

  divide:__is([
    __is(`broadcasted`),
    __is([
      __is(`overridable`),
      __is(`_divide`),
    ]),
  ]),

  _sum:{
    argCount:2,
    merge:true,
    noInterrupt:true,
    examples:[
      () => {
        const a = Math.random()*10000-5000, b = Math.random()*10000-5000
        return [[sum, a, b], a+b]
      },
    ],
    call(a,b) { return a + b },
  },

  _mult:{
    argCount:2,
    merge:true,
    noInterrupt:true,
    examples:[
      () => {
        const a = Math.random()*10000-5000, b = Math.random()*10000-5000
        return [[mult, a, b], a*b]
      },
    ],
    call(a,b) { return a * b },
  },

  _subtract:{
    argCount:2,
    merge:true,
    noInterrupt:true,
    examples:[
      () => {
        const a = Math.random()*10000-5000, b = Math.random()*10000-5000
        return [[subtract, a, b], a-b]
      },
    ],
    call(a,b) { return a - b },
  },

  _divide:{
    argCount:2,
    merge:true,
    noInterrupt:true,
    examples:[
      () => {
        const a = Math.random()*10000-5000, b = Math.random()*10000-5000
        return [[divide, a, b], a/b]
      },
    ],
    call(a,b) { return a / b },
  },

  OnShiftClickOutside:[
    __is(`either`),
    // Accepting [target, X, Y].
  ],

  _listen:{
    txt:`Registers a global event listener, or sets an interval if \`type\` is a number (ms).`,
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
    txt:`For pretending that we never existed.`,
    call() {
      if ('v' in finish) throw "Delete finish.v to confirm"
      // Else execute order 66.
      Deinitialize.intervals.forEach(clearInterval)
      const e = Deinitialize.events
      for (let i = 0; i < e.length; i += 3)
        (Self.into !== document.body ? Self.into : self).removeEventListener(e[i], e[i+1], e[i+2])
      _jobs.expr.length = 0
      Self.into.remove()
    },
  },

  Browser:{
    txt:`A REPL interface.
Supported browsers: modern Chrome and Firefox.`,
    lookup:{
      icon:__is(`BrowserIconURL`),
    },
    style:`.into * {transition: all .2s, margin 0s, padding 0s; box-sizing: border-box; animation: fadein .2s; font-family: monospace; font-size:initial}
.into:not(body) { box-shadow:var(--highlight) 0 0 .1em .1em }

@keyframes fadein { from {opacity:0} }

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
.into>* {display:table; white-space:pre-wrap}
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
known, prompt {font-weight:bold; cursor:pointer}
node {display:inline-block; font-family:monospace}
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


.into:not(.noComplexity) .broken { padding-left:1em }
.into:not(.noComplexity) .broken>:not(extracted) { display:table; max-width:100%}
.into:not(.noComplexity) .broken>bracket {margin-left:-1em}
.code>* {display:block}

node.code {display:table; font-family:monospace}
.editorContainer { display:table }
.editorContainer>:last-child[contenteditable] { min-height:1.2em; min-width: 1.2em; width:100%; display:table-cell }
.editorContainer.editable * { animation:none }
.editorContainer.editable { display:block }
.editorContainer.editable>:last-child[contenteditable] { min-height:1.2em; min-width: 1.2em; width:calc(100% - 2ch); display:inline-block }
.editorContainer.editable.hover>:last-child[contenteditable] { box-shadow:none }
prompt { width:2ch; color:red; float:left }
prompt::before { content:'▶' /* > ⊱ ▶ */ }
.editable>prompt::before { content:'⊱' }

JobIndicator { width:14px; height:14px; margin:.2em; transition:none; background-color:var(--main); border-radius:50%; display:inline-block }
JobIndicator.yes { background-color:var(--highlight); animation: rotate 4s infinite linear, fadein .2s }
JobIndicator>div { width:4px; height:4px; margin:5px; position:absolute; background-color:var(--highlight); border-radius:50%; transform: rotate(var(--turns)) translate(10px); animation:none }
@keyframes rotate {
  0% { transform: rotate(-0.25turn) }
  100% { transform: rotate(0.75turn) }
}

button { margin:.5em; padding:.5em; border-radius:.3em; border:none; background-color:var(--highlight); color:var(--background); font-size:inherit; min-width:2.2em }
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

details { padding: .1em; padding-left: 1em }
summary { margin-left: -1em }
details>:not(summary) { display:block; margin-bottom:1em; border-bottom:1px solid black }
details>div>:not(:first-child) { max-width:75vw }
details { display:table; overflow:hidden }
details>div { display:table-row }
details>div>* { display:table-cell; padding-left:2ch }

time-report { display:table; font-size:.8em; color:gray; opacity:0; visibility:hidden }
.hover>div.code>time-report, time-report:hover { opacity:1; visibility:visible }

.removed { margin:0 }`,
    call(into = document.body) {
      Self.into = into
      serialize.displayed = serialize.dom
      const passive = {passive:true}, passiveCapture = {passive:true, capture:true}

      // If not inserting into a particular element, create a new close-able window for us.
      if (into === null) {
        into = elem('div')
        const close = elem('button', '❌')
        close.title = `Close`
        close.onclick = () => (delete finish.v, Deinitialize(), close.onclick = null)
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
      Self.into = into

      // Insert favicon.
      if (into === document.documentElement || into === document.body) {
        const icon = elem('link')
        icon.rel = 'icon'
        icon.href = BrowserIconURL
        document.head.append(icon)
      }

      // Insert the style defined by code.
      const StyleElem = document.createElement('style')
      StyleElem.style.display = 'none'
      StyleElem.innerHTML = defines(Browser, style)
      into.append(StyleElem)

      // Create a REPL.
      const env = finish.env = _newExecutionEnv()
      const repl = finish.env[_id(log)] = REPL(fancy, new Map(parse.ctx))
      into.appendChild(repl)
      Self.into.querySelector('[contenteditable]').focus()

      // If our URL has `#…` at the end, parse and evaluate that command.
      function evalHash(hash) {
        finish.env = _newExecutionEnv()
        if (hash) elemInsert(into, elem(evaluator, parse(decodeURI(location.hash.slice(1)))), into.firstChild)
      }
      evalHash(location.hash)
      _listen('hashchange', () => evalHash(location.hash))

      // On click, run `(log (picker askUser (use (targetElem clientX clientY):'clicked')))` (or typed as `clicked elsewhere`) daintily.
      _listen('click', evt => {
        finish.env = undefined
        const t = evt.target || evt.explicitOriginalTarget
        if (evt.shiftKey && !evt.ctrlKey && !evt.altKey && !Self.into.contains(t)) {
          // Shift+clicked outside of us.
          const ctx = OnShiftClickOutside
          atCursor(daintyEvaluator([log, [picker, askUser, [[[lookup, ctx, [sum, [pick, ctx], 1]]], [quote, [t, evt.clientX, evt.clientY]]]]]))
        }
      }, passive)

      // Select the <node> under cursor on triple-click.
      // Also make <details> open smoothly, and allow them to be closed by clicking.
      _listen('click', evt => {
        const t = evt.target || evt.explicitOriginalTarget
        if (t.tagName === 'DETAILS') return t.firstChild.click()
        if (t.tagName === 'SUMMARY' && evt.detail !== 3 && !_smoothHeight.disabled) {
          const el = t.parentNode
          const pre = _smoothHeightPre(el)
          el.style.height = pre + 'px'
          setTimeout(_removeHeight, 1000, el)
          const smooth = () => (el.removeEventListener('toggle', smooth), _updateBroken(el), _smoothHeightPost(el, pre))
          el.addEventListener('toggle', smooth)
        }
        if (evt.detail !== 3) return
        const p = _closestNodeParent(t)
        p && getSelection().selectAllChildren(p)
      }, passive)

      // Open a custom <context-menu> when a context menu is requested, or when a <known> thing is clicked, or when a pointer is pressed in place for 1 second.
      function openMenu(evt, r) {
        contextMenu(_closestNodeParent(evt.target || evt.explicitOriginalTarget), r || getSelection().rangeCount && getSelection().getRangeAt(0), evt), evt.preventDefault()
      }
      _listen('contextmenu', evt => openMenu(evt))
      _listen('click', evt => !evt.shiftKey && !evt.ctrlKey && !evt.altKey && (evt.target || evt.explicitOriginalTarget).tagName === 'KNOWN' && openMenu(evt))
      let contextMenuId, pointerId = null, startX, startY
      _listen('pointerdown', evt => {
        atCursor.lastEvt = evt
        contextMenuId = setTimeout(openMenu, 1000, evt, getSelection().rangeCount && getSelection().getRangeAt(0))
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
      _listen('pointerdown', closeMenus)
      _listen('focusin', closeMenus)

      // Ensure that we still re-enter the interpreter loop after manually interrupting a script.
      _listen(2000, () => _jobs.running && _jobs())

      // On resize, update the "all-or-nothing" line-break-ingness of <node>s.
      let width = innerWidth
      _listen('resize', _throttled(() => width !== innerWidth ? _updateBroken(into) : (width = innerWidth), .1), passive)

      // If scrolled to near end, make sure that transitions preserve that scroll.
      // On transition end, remove .style.height (for _smoothHeightPost/elemInsert).
      let atEnd = false
      _listen('transitionstart', evt => {
        if (evt.propertyName !== 'height' || (evt.target || evt.explicitOriginalTarget).tagName === 'SCROLL-HIGHLIGHT') return
        const el = repl.lastChild.previousSibling, top = el.getBoundingClientRect().top
        if (evt.propertyName !== 'height' || Self.into !== document.body) return
        const d = document.documentElement, max = d.scrollHeight - d.clientHeight
        atEnd && scrollY < max - d.clientHeight - 100 && scrollTo(scrollX, max, atEnd = false)
        atEnd = atEnd || scrollY && top <= innerHeight - 10
      }, passive)
      _listen('transitionend', evt => {
        const t = evt.target || evt.explicitOriginalTarget
        if (t.tagName === 'SCROLL-HIGHLIGHT') return
        t.style.removeProperty('height')
        _clearStyle(t)
        if (evt.propertyName !== 'height' || Self.into !== document.body) return
        const d = document.documentElement, max = d.scrollHeight - d.clientHeight
        atEnd && scrollY < max - d.clientHeight - 100 && scrollTo(scrollX, max, atEnd = false)
      }, passive)

      // On .ctrlKey pointerdown on a value, insert a <collapsed> reference to it into selection if editable.
        // This is also accessible via contextMenu.
      _listen('pointerdown', evt => {
        if (!evt.ctrlKey || evt.shiftKey || evt.altKey) return
        if (!getSelection().rangeCount) return
        const el = _closestNodeParent(evt.target || evt.explicitOriginalTarget), r = getSelection().getRangeAt(0)
        if (el) insertLinkTo(r, el), evt.preventDefault()
      })

      // Ensure that selection cannot end up inside <collapsed> elements.
      _listen('selectionchange', () => {
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
        const def = el && !_isArray(el.to) && defines(el.to, _closestNodeParent)
        const New = el == null ? null : el instanceof Set ? el : el && def ? def(el) : elemValue(undefined, el.to)
        const needed = new Set
        let b = false
        New && New.forEach(el => {
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
        if (evt.type === 'selectionchange' && getSelection().isCollapsed) return
        changeHoverTo(getParent(evt))
      }
      function getParent(evt) {
        // const active = document.activeElement && document.activeElement.contentEditable == 'true'
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

      // Create JobIndicator and Darkness and CPU.
      const bottombar = elem('div')
      bottombar.setAttribute('style', "position:sticky; left:0; bottom:0; z-index:10")
        const JobIndicator = _jobs.indicator = elem('JobIndicator')
        JobIndicator.title = "Currently running 0 jobs."
        const Darkness = elem('input')
        Darkness.id = 'Darkness', Darkness.type = 'checkbox', Darkness.title = 'Use dark theme?'
        ;(Darkness.oninput = () => into.classList.toggle('dark', Darkness.checked, true))()
        const CPU = _jobs.cpu = elem('input')
        CPU.id = 'CPU', CPU.type = 'range', CPU.min = .01, CPU.max = .99, CPU.step = .01, CPU.value = .99
        CPU.style.margin = 0
        CPU.title = "Debounce the interpreter loop to 99% CPU usage."
        const Smoothness = elem('input')
        Smoothness.id = 'Smoothness', Smoothness.type = 'checkbox', Smoothness.title = 'Disable smooth transitions?'
        ;(Smoothness.oninput = () => {_smoothHeight.disabled = Smoothness.checked, into.classList.toggle('noTransitions', Smoothness.checked, true)})()
        const Coloring = elem('input')
        Coloring.id = 'Coloring', Coloring.type = 'checkbox', Coloring.title = 'Color variables in serializations?'
        ;(Coloring.oninput = () => {_valuedColor.enabled = Coloring.checked})()
        const NoComplexity = elem('input')
        NoComplexity.id = 'NoComplexity', NoComplexity.type = 'checkbox', NoComplexity.title = 'Disable boxes, only do inline styling?'
        ;(NoComplexity.oninput = () => into.classList.toggle('noComplexity', NoComplexity.checked, true))()
      bottombar.append(JobIndicator, Darkness, CPU, Smoothness, Coloring, NoComplexity)
      into.append(bottombar)

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

      // Update CPU's title.
      ;(CPU.oninput = () => { CPU.title = CPU.title.replace(/[0-9]+%/, ((+CPU.value*100)|0) + '%') })()

      // Test all known examples.
      _test(env)

      // Garbage-collect DOM elements every 5 mins.
      let domgc = false
      _listen(300000, () => {
        if (domgc) return; else domgc = true
        elemValue.obj = new WeakMap, elemValue.val.clear()
        _schedule([_revisitElemValue, Self.into], _newExecutionEnv(), () => domgc = false)
          // It is possible to observe not-fully-restored states, but that is fine for interface GC.
      })
    },
  },

  NodeJS:{
    txt:`Presents a console REPL with outputs labeled sequentially, or just reads and executes the whole file if redirected from it.
Example: \`nodejs self.js basic <input.txt >output.txt\` will write the result of executing everything in \`input.txt\` (parsed with language \`basic\`) to \`output.txt\`.`,
    call() {
      if (process.argv.length > 3) return console.log(`Usage:
nodejs self.js
nodejs self.js basic`)
      const lang = process.argv[2] && parse.ctx.get(label(process.argv[2])) || fancy
      _langAt.lang = lang, _bindingsAt.binds = parse.ctx

      const out = process.stdout
      if (!out.isTTY || !out.hasColors()) _colored.disabled = true
      serialize.displayed = !_colored.disabled ? serialize.consoleColored : {maxDepth:3}

      if (process.stdin.isTTY) // REPL for terminals.
        REPL(lang), _test(finish.env = _newExecutionEnv())
      else { // Read+execute for files.
        interrupt.noInterrupt = true
        require('fs').readFile(process.stdin.fd, 'utf-8', (err, data) => {
          if (err) throw err
          const env = _newExecutionEnv()
          _schedule(parse(data, lang), env, log)
        })
      }
    },
  },

  WebWorker:{
    txt:`Used for \`purifyInWorker\`.
For \`file://\` URIs in Firefox, \`privacy.file_unique_origin\` in \`about:config\` needs to be false.`,
    call() {
      onmessage = evt => {
        const msg = evt.data
        if (_isArray(msg) && typeof msg[0] == 'number' && typeof msg[1] == 'string' && msg.length == 2) {
          // Schedule parsing-and-serialization.
          const [ID, str] = msg
          _doJob(lookup(fast, 'parse')(str), _newExecutionEnv(), expr => {
            // When done, postMessage the serialized result back.
            postMessage([ID, lookup(fast, 'serialize')(expr)])
          }, ID)
        } else if (typeof msg == 'number')
          _cancel(msg)
        else throw "Bad message"
      }
    },
  },

  purifyInWorker:{
    txt:`\`(purifyInWorker Expr)\`: calls \`purify\` on (a copy of) \`Expr\` in parallel; returns a promise.`,
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
              _doJob([purify, [quote, w.tasks[ID][0]]], _newExecutionEnv(), w.tasks[ID][1], +ID)
            }))
            ws.length = 0
          }
        purifyInWorker.workers = ws
      }

      return new Promise(then => {
        const ID = _newJobId()
        if (!purifyInWorker.workers.length)
          return _doJob([purify, [quote, expr]], _newExecutionEnv(), then, ID)
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
    const el = serialize(v, lang, undefined, {...serialize.displayed, collapseDepth:1, collapseBreadth:0, deconstructElems:true})
    if (_isArray(v) || _isArray(defines(v, deconstruct)))
      if (el.firstChild.tagName != 'BRACKET' || el.lastChild.tagName != 'BRACKET')
        return elemValue(elem('node', [elem('bracket', '('), el, elem('bracket', ')')]), v)
    return el
  },

  _getOuterLinker(el) { return el && (el.contentEditable === 'true' || el.parentNode && !_isArray(el.parentNode.to) && defines(el.parentNode.to, insertLinkTo) ? el : _getOuterLinker(el.parentNode)) },

  insertLinkTo:{
    txt:`Replaces a Range (obtained from the current selection) with a link to the elem's value.
A language can define this with a function that {takes the element and value to {link to}} and {returns an element to insert}.
Remember to quote the link unless you want to evaluate the insides.`,
    call(r, el) {
      const p = r.commonAncestorContainer, editor = _getOuterLinker(el)
      const pre = _smoothTransformPre(el)
      if (!_getOuterLinker(p)) return false
      let col
      if (editor && editor === _getOuterLinker(p) && defines(editor.parentNode.to, insertLinkTo))
        col = defines(editor.parentNode.to, insertLinkTo)(r, el)
      else {
        const v = quote(el.to)
        col = elemValue(elemCollapse(() => _collapsedSerialization(v)), v)
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
    if (range.commonAncestorContainer.classList && range.commonAncestorContainer.classList.contains('editable')) return
    range.insertNode(elem('span', brackets[0]))
    range.collapse(false)
    range.insertNode(elem('span', brackets[1]))
    range.setEnd(range.endContainer, range.endOffset-1)
  },

  hierarchy:{
    txt:`Turns a map from globals into a namespace-based hierarchy.`,
    call(m, topLevel, parents = lookup.parents, lang = basic, binds) {
      if (typeof document == ''+void 0) return m
      if (!(m instanceof Map)) error("Expected a map, got", m)
      const globals = new Map // From globals to their elems.
      m.forEach((v,x) => globals.set(x, null))
      let p // Add unmentioned namespace-parent globals too.
      globals.forEach((our, x) => (p = parents.get(x)) && !globals.has(p) && globals.set(p, null))
      const result = !topLevel ? elem('details', elem('summary', 'Binds to:')) : elemFor(topLevel)
      parse.ctx.forEach(x => { // Make globals appear in source-code order.
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
      for (let ch = result.firstChild.nextSibling; ch; ch = ch.nextSibling)
        ch.replaceWith(ch = purgeChildless(ch))
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
          const ch = elem('div', [...el.firstChild.childNodes])
          return el.replaceWith(ch), ch
        }
        for (let ch = el.firstChild.nextSibling; ch; ch = ch.nextSibling) ch = purgeChildless(ch)
        return el
      }
    },
  },

  permissionsElem:{
    txt:`Build a namespace hierarchy of globals that \`expr\` is bound to.`,
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
        if (_invertBindingContext(parse.ctx).has(x) && typeof x != 'boolean' && typeof x != 'string' && x != null) return uses.add(x)
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
    txt:`Parse text in \`...\` to style it as fancy, and treat other strings as \`structuredSentence\`s. Return an array of children.`,
    call(s) {
      if (typeof s != 'string') return s
      let arr = s.split('`')
      for (let i = 0; i < arr.length; ++i)
        if (i & 1)
          try { arr[i] = parse(arr[i], fancy, undefined, parse.dom)[1] } catch (err) {}
        else
          arr[i] = arr[i].split('\n').map(structuredSentence), typeof document != ''+void 0 && arr[i].forEach(el => el.classList.add('text')), interleave(arr[i], '\n')
      return arr
      function interleave(arr, item) { // Quadratic in time.
        for (let i = 1; i < arr.length; ++i) arr.splice(i++, 0, item)
      }
    },
  },

  elemToWindow:{
    txt:`Wraps an element in <div.window>.`,
    call(el) {
      impure()
      const pre = _smoothHeightPre(el)
      el.style.position = 'relative' // So that .offsetLeft/Top refer to the same thing as position:absolute.
      const x = el.offsetLeft, y = el.offsetTop
      el.style.removeProperty('position'), _clearStyle(el)
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

  disableBindingsElem:{
    txt:`\`(disableBindingsElem)\`: creates an elem for disabling current bindings hierarchically.`,
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
    txt:`Collapses an element (or a range of elements) in-place. Click to expand again. Pass in a function to create the element only if needed. Pass in null as \`end\` to collapse all consequent non-bracket siblings.`,
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
        start.isConnected && impure()
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
          elemValue(col, struct(rest, _maybeMerge(a)))
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
    txt:`\`(log …Values)\`: For debugging; logs to the current DOM node or console.`,
    lookup:{
      structured:__is(`structured`),
      structuredSentence:__is(`structuredSentence`),
    },
    call(...x) {
      log.did = true, impure.impure = true
      try {
        const into = finish.env[_id(log)]
        let str
        if (x.length != 1 || !_isStylableDOM(x[0]))
          str = serialize(x.length > 1 ? x : x[0], _langAt(into), _bindingsAt(into), serialize.displayed)
        else str = x[0]
        if (into) {
          if (str.parentNode) str = elemClone(str)
          const pre = _smoothHeightPre(into.parentNode)
          if (typeof str == 'string') str = document.createTextNode(str)
          const wasMax = _updateMaxScrollBegin()
          into.parentNode.insertBefore(str, into)
          _updateBroken(into.parentNode)
          _smoothHeightPost(into.parentNode, pre)
          _updateMaxScrollEnd(wasMax)
        } else
          console.log(str)
        if (x.length == 1) return x[0]
      } catch (err) { if (err !== impure) console.log(err, err && err.stack), console.log('When trying to log', ...x) }
      finally { impure.impure = false }
      // log.did (for not erasing parts of a log in a terminal in NodeJS)
    },
  },

  _updateMaxScrollBegin() { return _smoothHeight.disabled && scrollY >= document.documentElement.scrollHeight - innerHeight - 5 },

  _updateMaxScrollEnd(begin) { if (begin) scrollBy(0, 1000) },

  allowDragging:{
    txt:`Allows dragging the element around with a pointer. Only call on absolutely-positioned elements with .style.left and .style.top.`,
    call(el) {
      impure()
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

  _escapeLabel(name, lang = _langAt() || fancy) {
    return typeof defines(lang, _escapeLabel) == 'function' ? defines(lang, _escapeLabel)(name) : name
  },

  _unescapeLabel(repr, lang = _langAt() || fancy) {
    return typeof defines(lang, _unescapeLabel) == 'function' ? defines(lang, _unescapeLabel)(repr) : repr
  },

  describe:{
    txt:`Creates an element that describes a value.`,
    _logAll:[
      {
        txt:`Allow renaming labels.`,
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
        txt:`For globals, display the owner namespace (if any) (even if the property name does not match) and the global binding.
  For numbers, display a slider from 0 to 2*number for easy adjusting.
  For strings, display them in a <textarea> for easy editing and copying.
  For anything else, display the globals the expression binds to, and an expandable basic definition.`,
        call([el, v]) {
          // For globals, a short definition of what we were called on.
          if (_invertBindingContext(parse.ctx).has(v)) {
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
          } else if (_isArray(v) || !v || typeof v != 'object' && typeof v != 'function')
            // If not a deconstructable thing, display the globals the expression binds to, and an expandable basic definition.
            return elem('div', [
              permissionsElem(v),
              elem('div', [
                elemValue(elem('unimportant', 'Basically: '), basic),
                elemValue(elemCollapse(() => _collapsedSerialization(v)), v),
              ]),
            ])
          else return permissionsElem(v) // Display the globals the deconstruction binds to.
        },
      },
      {
        txt:`Docstring.`,
        call([el, v]) {
          if (!_isArray(v) && typeof defines(v, txt) == 'string')
            return elem('div', stringToDoc(defines(v, txt)))
        },
      },
      {
        txt:`Examples.`,
        call([el, v]) {
          if (!_isArray(v) && _isArray(defines(v, examples)))
            return elem('div', [
              elemValue(elem('unimportant', 'Examples: '), examples),
              elemCollapse(() => serialize(examples(v), fancy, undefined, serialize.displayed))
            ])
        },
      },
      {
        txt:`Usage interface.`,
        call([el, v]) {
          const T = types(v)
          if (T)
            return elem('div', [
              elemValue(elem('unimportant', 'Usage types: '), types),
              elemCollapse(() => serialize(T, fancy, undefined, serialize.displayed))
            ])
        },
      },

      {
        txt:`A \`_read\` mark if present.`,
        call([el, v]) {
          if (_read.marks && _read.marks.has(v))
            return elem('div', [
              elemValue(elem('unimportant', 'Marked: '), _read),
              elemCollapse(() => serialize(_read.marks.get(v), fancy, undefined, serialize.displayed))
            ])
        },
      },

      {
        txt:`A table for \`lookup\`s.`,
        call([el, v]) {
          const backctx = _invertBindingContext(parse.ctx)
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
        txt:`For globals, the list of back-refs.`,
        call([el, v]) {
          const backctx = _invertBindingContext(parse.ctx)
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
        txt:`The full deconstruction if a non-array.`,
        call([el, v]) {
          const backctx = _invertBindingContext(parse.ctx)
          if (backctx.has(v) || !_isArray(v) && v && (typeof v == 'object' || typeof v == 'function'))
            return elem('div', [
              elemValue(elem('unimportant', 'Deconstruction: '), deconstruct),
              elemCollapse(() => serialize(deconstruct(v), fancy, undefined, {...serialize.displayed, deconstructPaths:true}))
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
    txt:`Creates and displays a <context-menu> element near the specified element.`,
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
    },
    _logAll:[
      {
        txt:`Propose to execute functions that define \`button\`.`,
        call([el, range, v]) {
          if (typeof v == 'function' && defines(v, button) !== undefined) {
            const names = nameResult(v)
            return button(v, names && names[0])
          }
        },
      },
      {
        txt:`Describe context menu's items.`,
        call([el, range, v]) { return describe(el) },
      },
      {
        txt:`Fetch URLs and try to display their contents.`,
        call([el, range, v]) {
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
        txt:`Allow searching for substrings.`,
        call([el, range, v]) { return button(function search() { addSearchElem(el) }, 'search…') },
      },
      {
        txt:`If the cursor is in editor, present an option to replace the currently-selected contents with a link to the value.`,
        call([el, range, v]) {
          if (range && v !== undefined && _isEditable(range.commonAncestorContainer))
            return button(function linkToThis() { insertLinkTo(range, el) })
        },
      },
      {
        txt:`If we can expand all in the context element, then present that option.`,
        call([el, range, v]) { return elemExpandAll(el, true) ? button(function expandAll() { elemExpandAll(el) }) : undefined },
      },
      {
        txt:`Present "To window" (for non-windows) or "Restore" (for windows — draggable absolutely-positioned elements).`,
        call([el, range, v]) {
          if (!_isEditable(el) && el !== document.documentElement) {
            if (!_getOuterWindow(el))
              return button(function toWindow() { elemToWindow(el) })
            else
              return button(function restore() { return _restoreWindow(_getOuterWindow(el)) })
          }
        },
      },
      {
        txt:`Present an option to hide the element.`,
        call([el, range, v]) { return _getOuterWindow(el) !== el ? button(function hide() { elemCollapse(el) }) : undefined },
      },
      {
        txt:`Present an option to hide the element and all elements after it on the same hierarchy level.`,
        call([el, range, v]) {
          if (el.nextSibling && el.nextSibling.tagName !== 'BRACKET')
            return button(function hideToEnd() { elemCollapse(el, null) })
        },
      },
    ],
    call(el, range, evt) {
      impure()
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
    txt:`\`(daintyEvaluator Expr)\`: returns an element that will evaluate the expression and display its \`log\`s if any.`,
    call(expr) {
      if (typeof document == ''+void 0) return
      impure()

      // Evaluate the requested expression.
      const ID = _newJobId()
      const result = _evaluationElem(ID)
      const el = elem('div', result)
      el.classList.add('code')
      const env = _newExecutionEnv(finish.env)
      env[_id(log)] = el.lastChild
      let ended = false
      const prev = finish.env
      _doJob(expr, env, () => (!result.previousSibling ? (ended = true, el.remove()) : result.remove()), ID)
      finish.env = prev
      return !ended ? el : undefined
    },
  },

  atCursor:{
    txt:`Positions an element at cursor.`,
    call(el, pointerEvt = atCursor.lastEvt, inside = Self.into) {
      let x = pointerEvt ? pointerEvt.clientX : 0, y = pointerEvt ? pointerEvt.clientY : 0
      if (el.parentNode) error('Only position new elements at cursor')
      if (!inside.isConnected) error('Only position elements inside the visible document')
      impure()
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
    txt:`Creates and returns a pause-button and a waiting indicator.`,
    call(ID) {
      const el = elem('div')
      const pause = elem('button', '⏸')
      pause.onclick = () => _pausedToStepper(..._cancel(ID, true))
      pause.title = `Pause execution`
      el.append(pause)
      el.append(elem('waiting'))
      return el
    },
  },

  evaluator:{
    txt:`\`(elem evaluator Expr)\`: When logged to DOM, this displays the expression, its \`log\`s along the way, and its one evaluation result in one removable (by clicking on the prompt) DOM element.
When evaluating \`a=b\`, binds \`a\` to \`^b\` in consequent parses/serializations in the parent REPL; when evaluating anything else, tries to add the result to the \`CurrentUsage\` binding. Both are reverted when the evaluator is removed.`,
    lookup:{
      daintyEvaluator:__is(`daintyEvaluator`),
    },
    _logAll:[
      {
        txt:`Display evaluation's result.`,
        call([result]) { return result !== undefined ? result : _onlyUndefined },
      },
      {
        txt:`Display the report on times taken.`,
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
      {
        txt:`Display evaluation result's potential uses.`,
        call([result]) {
          let ctx = input([result], CurrentUsage)
          if (ctx && (ctx = ctx.filter(x => x !== result)).length > 1) {
            const lang = _langAt(), binds = _bindingsAt(), env = finish.env
            return elem('div', [
              elem('unimportant', ['Input to ', elem('number', ''+(ctx.length-1)), ': ']),
              elemValue(elemCollapse(() => {
                const el = elem('table')
                el.style.display = 'inline-table'
                for (let i = 1; i < ctx.length; ++i) {
                  const to = elemCollapse(() => (finish.env = env, elem(evaluator, [picker, askUser, [use, quote(ctx[i]), [quote, CurrentUsage], quote([result])]], to)))
                  el.append(elem('tr', [
                    elem('td', serialize(ctx[i], lang, binds, serialize.displayed)),
                    elem('td', to)
                  ]))
                }
                elemValue(el, ctx)
                return el
              }), ctx),
            ])
          }
        },
      },
      {
        txt:`Display potential ways to get evaluation result.`,
        call([result]) {
          let ctx = output(result, CurrentUsage)
          if (ctx && (ctx = ctx.filter(x => x !== result)).length > 1) {
            const lang = _langAt(), binds = _bindingsAt(), env = finish.env
            return elem('div', [
              elem('unimportant', ['Output of ', elem('number', ''+(ctx.length-1)), ': ']),
              elemValue(elemCollapse(() => {
                const el = elem('node')
                for (let i = 1; i < ctx.length; ++i)
                  el.append(elem('div', serialize(ctx[i], lang, binds, serialize.displayed)))
                const to = elemCollapse(() => (finish.env = env, elem(evaluator, [picker, askUser, [get, quote(result), [quote, CurrentUsage]]], to)))
                el.append(to)
                elemValue(el, ctx)
                return el
              }), ctx),
            ])
          }
        },
      },
    ],
    elem(tag, expr, then) {
      if (tag !== evaluator || typeof document == ''+void 0) return
      impure()
      const before = finish.env[_id(log)]

      if (!evaluator.none) evaluator.none = Symbol('none')
      let result = evaluator.none
      const lang = _langAt(before), binds = _bindingsAt(before)
      let bindAs = null, prevBinding = evaluator.none

      const el = elem('div')
      el.classList.add('code')
      const prompt = elem('prompt')
      const query = elem('span')
      query.classList.add('editorContainer')
      query.append(prompt)
      query.append(serialize(expr, lang, binds, serialize.displayed))
      let ID = _newJobId()
      const waiting = _evaluationElem(ID)
      el.append(query)
      el.append(waiting)

      prompt.title = 'Click to remove this.'
      prompt.onclick = () => { // Remove the evaluator.
        _getOuterWindow(el) && _getOuterWindow(el).firstChild === el && _restoreWindow(_getOuterWindow(el))
        ID != null && _cancel(ID)
        then ? el.replaceWith(then) : elemRemove(el)

        if (binds) { // Delete result from bindings or CurrentUsage.
          const r = result
          if (_isLabel(bindAs)) {
            const L = label(bindAs[1])
            if (prevBinding !== evaluator.none) binds.set(L, prevBinding)
            else binds.delete(L)
            _invertBindingContext(binds, true)
          } else if (r !== evaluator.none) {
            const cu = binds.get(label('CurrentUsage'))
            if (r !== cu && _isArray(cu) && cu[0] === either && !_wasMerged(cu))
              _removeUsage(cu, r)
          }
        }
      }
      elemValue(el, struct(elem, evaluator, expr, then))

      // Evaluate the requested expression.
      const env = _newExecutionEnv(finish.env)
      env[_id(log)] = waiting
      const start = _timeSince()
      if (_isArray(expr) && expr[0] === _extracted && expr.length == 3 && (_isLabel(expr[1]) || _invertBindingContext(binds).has(expr[1])))
        bindAs = _isLabel(expr[1]) ? expr[1] : label(_invertBindingContext(binds).get(expr[1])), expr = expr[2]
      const prev = finish.env
      _langAt.lang = lang, _bindingsAt.binds = binds
      _doJob(expr, env, r => { // Got the result.
        ID = null
        const end = _timeSince(), real = _timeSince(start)

        if (binds) { // Add result to bindings or CurrentUsage.
          if (_isLabel(bindAs)) {
            const L = label(bindAs[1])
            const q = quote(r)
            if (binds.has(L))
              prevBinding = !parse.ctx.has(L) || parse.ctx.get(L) === q ? binds.get(L) : parse.ctx.get(L)
            binds.set(L, q)
            _invertBindingContext(binds, true)
            r = [_extracted, !_isArray(q) ? L : q, !_isArray(q) ? q : q === r ? q.slice() : r]
          } else if (!(r instanceof Error) && !_isError(r) && r != null) {
            const cu = binds.get(label('CurrentUsage'))
            if (r !== cu && _isArray(cu) && cu[0] === either && !_wasMerged(cu))
              result = r, _addUsage(cu, result)
          }
        }

        const pre = _smoothHeightPre(el)
        elemRemove(waiting)
        // Merge `_updateBroken` of both logged children into one.
        _updateBroken(el)
        finish.env = env

        // Display `_logAll evaluator ^(Result UserDuration RealDuration EndTime)`.
        el.append(daintyEvaluator([_logAll, evaluator, [quote, [r, env[_id(userTime)], real, end]]]))
        setTimeout(() => _smoothHeightPost(el, pre), 80)
      }, ID)
      finish.env = prev
      _langAt.lang = null, _bindingsAt.binds = null
      return el
    },
  },

  _formatNumber(x) {
    return [
      elem('number', x < 1 ? x.toPrecision(6).replace(/\.?0+$/, '') : x < 10 ? x.toPrecision(3).replace(/\.?0+$/, '') : x < 1000 ? ''+(x|0) : (x/1000).toFixed(1)),
      x < 1000 ? 'ms' : 's',
    ]
  },

  _getOuterREPL(el) { return !el ? null : el.isREPL ? el : _getOuterREPL(el.parentNode) },

  _langAt(el) {
    if (_langAt.lang) return _langAt.lang
    if (!finish.env) return fancy
    if (el === undefined) el = finish.env[_id(log)]
    el = _getOuterREPL(el)
    if (el && _isArray(el.to)) return el.to[1]
    // .lang
  },

  _bindingsAt(el) {
    if (_bindingsAt.binds) return _bindingsAt.binds
    if (!finish.env) return parse.ctx
    if (el === undefined) el = finish.env[_id(log)]
    el = _getOuterREPL(el)
    if (el && _isArray(el.to)) return el.to[2]
    // .binds
  },

  _invertBindingContext(ctx, clear = false) {
    if (!(ctx instanceof Map)) throw console.error(ctx), "Invalid binding context"
    if (!_invertBindingContext.cache) _invertBindingContext.cache = new WeakMap
    if (clear) return _invertBindingContext.cache.delete(ctx)
    if (_invertBindingContext.cache.has(ctx)) return _invertBindingContext.cache.get(ctx)
    const backctx = new Map
    ctx.forEach((to, name) => _isLabel(name) && (name = name[1], (name[0] !== '_' || !backctx.has(to)) && backctx.set(to, name)))
    _invertBindingContext.cache.set(ctx, backctx)
    return backctx
  },

  editor:{
    txt:`\`(editor ?:InitialString ?:Lang ?:Binds ?:OnInput ?:OnEnter) OnInput=(function ?:Expr ?:InvalidFlag ?) OnEnter=?:Expr->?:ClearInputFlag\`: creates a user-editable expression input.
Don't do expensive synchronous tasks in \`OnInput\`.`,
    call(initialString = '', lang = fancy, binds = parse.ctx, onInput, onEnter) {
      if (typeof initialString != 'string') error('String expected, got', initialString)
      if (!(binds instanceof Map)) error('Map expected, got', binds)
      if (onInput && typeof onInput != 'function') error('Function or nothing expected, got', onInput)
      if (onEnter && typeof onEnter != 'function') error('Function or nothing expected, got', onEnter)
      const editor = elem('node')
      editor.contentEditable = true
      editor.spellcheck = false
      // Set the initial string.
      try { editor.append(parse(editor, lang, binds, parse.dom)[1]) }
      catch (err) { editor.append(initialString ? parse(initialString, lang, binds, parse.dom)[1] : initialString) }
      // On any mutations inside, re-parse its contents, and show purified output.
      const obs = new MutationObserver(_throttled(record => {
        const s = getSelection()
        const i = _saveCaret(editor, s)
        try {
          const [expr, styled] = parse(editor, lang, binds, parse.dom)
          while (editor.firstChild) editor.removeChild(editor.firstChild)
          editor.append(elem('div', styled))
          if (i !== undefined && (document.activeElement === Self.into.parentNode.host || editor.contains(document.activeElement))) _loadCaret(editor, i, s)
          onInput && Promise.resolve().then(() => onInput(bound(n => n instanceof Element && n.special ? quote(n.to) : undefined, expr, false), false))
        } catch (err) {
          if (err instanceof Error) throw err
          onInput && onInput(undefined, true)
        }
        obs.takeRecords()
      }, .2))
      obs.observe(editor, { childList:true, subtree:true, characterData:true })

      const query = elem('span')
      elemValue(query, lang)
      query.classList.add('editorContainer')
      query.classList.add('editable')
      const prompt = elem('prompt')
      prompt.title = 'Click to clear this.'
      prompt.onclick = () => _smoothHeight(editor, () => editor.textContent = '')
      query.append(prompt)
      query.append(editor)

      const undo = [[]], redo = []

      editor.oninput = _throttled(() => {
        // Grow the undo buffer (and clear the redo buffer) on change.
        if (!undo.length || undo[undo.length-1].map(el => _innerText(el).join('')).join('') !== _innerText(editor).join(''))
          redo.length = 0, undo.push(children(editor)), undo.length > 4096 && (undo.splice(0, undo.length - 4096))
      }, .1)
      let height
      editor.addEventListener('input', evt => {
        if (_smoothHeight.disabled) return
        if (height) _smoothHeightPost(editor, height).then(h => height = h)
        else height = _smoothHeightPre(editor)
      })
      editor.onkeydown = evt => {
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
              const i = _saveCaret(editor, focusNode, focusOffset) + delta
              const arr = _loadCaret(editor, i)
              if (evt.shiftKey)
                s.extend(...arr)
              else
                s.collapse(...arr)
              evt.preventDefault()
            }
        }

        // On Escape, blur editor (originally, so hover-highlighting becomes available, but now, just why not).
        if (evt.key === 'Escape' && document.activeElement === editor) editor.blur()

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
          if (undo[undo.length-1].map(el => el.innerText).join('') === editor.innerText) undo.pop()
          if (undo.length)
            redo.push(children(editor)), children(editor, undo.pop()), evt.preventDefault()
        }
        // On Ctrl+Shift+Z, pop one from redo.
        if (evt.key === 'Z' && evt.shiftKey && evt.ctrlKey && redo.length)
          undo.push(children(editor)), children(editor, redo.pop()), evt.preventDefault()
      }
      elemValue(query, struct(editor, initialString, lang, binds, onInput, onEnter))
      return query

      function evaluate(evt) {
        let clear = false
        if (onEnter)
          try {
            const expr = parse(editor, lang, binds)
            evt.preventDefault()
            clear = onEnter(bound(n => n instanceof Element && n.special ? quote(n.to) : undefined, expr, false), false)
          } catch (err) {
            if (_isArray(err) && err[0] === 'give more') err = err[1]
            else evt.preventDefault()
            const el = elem('error', err instanceof Error ? [String(err), '\n', err.stack] : String(err))
            el.style.left = '1em'
            el.style.position = 'absolute'
            return elemInsert(query, el), setTimeout(elemRemove, 1000, el)
          }
        if (clear) editor.textContent = ''
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

  REPL:{
    txt:`\`(REPL Language Bindings)\`: Creates a visual REPL instance (read-evaluate-print loop).`,
    lookup:{
      editor:__is(`editor`),
    },
    call(lang = fancy, binds = new Map(parse.ctx)) {
      if (!defines(lang, parse) || !defines(lang, serialize)) throw "Invalid language"
      if (!(binds instanceof Map)) throw "Invalid binding context"
      impure()

      const env = _newExecutionEnv(finish.env)

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
              _schedule(expr, _newExecutionEnv(env), result => {
                // If binds contain result in values, set name to that; if not, create a new one.
                let name
                binds.forEach((v,k) => v === result && (name = k[1]))
                if (!name) do { name = '$' + n++ } while (binds.has(name))
                if (!binds.has(name))
                  (binds = new Map(binds)).set(label(name), quote(result))
                _bindingsAt.binds = binds
  
                then(null, _colored(name, 33) + ' = ' + serialize(result, fancy, undefined, {...opt, offset:1+Math.ceil(name.length/2+.5)})) // brown
              })
            } catch (err) {
              if (_isArray(err) && err[0] === 'give more') then(new repl.Recoverable(err))
              else console.log(typeof err == 'string' ? _colored(err, 31) : err), then() // red
            }
          },
          writer: id,
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

      const repl = elem('node')
      repl.isREPL = true, repl.classList.add('REPL')
      elemValue(repl, struct(REPL, lang, binds))

      // Display purified output.
      const pureOutput = elem('div')
      pureOutput.classList.add('code')
      pureOutput.style.display = 'inline-block'
      let ID, waiting, lastExpr
      const purifyAndDisplay = _throttled((expr, clear) => {
        if (msg === false && _isArray(expr) && expr[0] === jsEval && typeof expr[1] == 'string' && expr[2]) expr = [randomNat, 2]
        const pre = _smoothHeightPre(pureOutput)
        if (pureOutput.firstChild) {
          for (let ch = pureOutput.firstChild; ch; ch = ch.nextSibling)
            if (!ch.removed)
              elemRemove(ch, true, true, false)
        }
        if (ID !== undefined) _cancel(ID), waiting.remove(), ID = undefined, waiting = undefined
        let promise
        if (!clear) promise = new Promise(then => {
          const e = _newExecutionEnv(env)
          ID = _newJobId()
          e[_id(log)] = waiting = _evaluationElem(ID), finish.env = e
          const bindAs = _isArray(expr) && expr[0] === _extracted && expr.length == 3 && _isLabel(expr[1]) ? expr[1] : null
          if (bindAs) expr = expr[2]
          elemInsert(pureOutput, waiting)
          _langAt.lang = lang, _bindingsAt.binds = binds
          _doJob([purify, struct(quote, expr)], e, result => {
            if (_isUnknown(result) && result.length == 2 && _isArray(result[1]) && (_isError(result[1])))
              result = result[1] // Display errors too.
            if (bindAs) result = [_extracted, bindAs, result]

            const pre = _smoothHeightPre(pureOutput)
            try {
              ID = undefined, waiting && waiting.remove(), waiting = undefined
              if (!_isUnknown(result)) {
                // Display `_logAll evaluator (Result)`.
                elemInsert(pureOutput, daintyEvaluator([_logAll, evaluator, [quote, [result]]]))
              } else {
                const el = elem('button', 'Evaluate')
                elemValue(el, result)
                el.onclick = evaluateLast
                elemInsert(pureOutput, el)
              }
            } finally { _smoothHeightPost(pureOutput, pre), then(e[_id(userTime)]) }
          }, ID)
          _langAt.lang = null, _bindingsAt.binds = null
          _smoothHeightPost(pureOutput, pre)
        })
        return promise
      }, .1, expr => lastExpr = expr)

      const evaluateLast = () => evaluate(lastExpr)
      const evaluate = expr => {
        const prev = finish.env;  finish.env = env
        try { return log(elem(evaluator, expr)), true }
        finally { finish.env = prev }
      }
      repl.classList.add('code')

      const msg = defines(lang, REPL)
      repl.append(elem('div', [structuredSentence('{A REPL} of language '), serialize(lang, basic, undefined, serialize.displayed), typeof msg == 'string' ? stringToDoc(': ' + msg) : elem('span')]))

      const query = editor('', lang, binds, purifyAndDisplay, evaluate)
      repl.append(query)
      repl.append(pureOutput)
      env[_id(log)] = query
      return repl
    },
  },

  button:{
    txt:`\`(button OnClick)\`: Returns a button that calls a function on click (with no arguments). Overridable.`,
    call(f, name) {
      const backctx = _invertBindingContext(parse.ctx)
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
      el.onclick = () => f()
      el.append(name)
      return el
    },
  },

  files:{
    txt:`\`(elem files StringMap)\`: an element for downloading files.`,
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
    txt:`Creates a URL element.`,
    elem(tag, href) {
      if (typeof href != 'string') throw "Must be a string"
      if (tag !== url || typeof document == ''+void 0) return href
      const el = elem('a', href)
      elemValue(el, struct(elem, url, href))
      el.href = href
      el.title = decodeURI(href)
      if (el.title.slice(0,8) === 'https://') el.title = el.title.slice(8)
      return el
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
      // Non-contenteditable elements in contenteditable are treated atrociously, so we resort to these hacks (pull everything in <collapsed> out of it — not relevant if selection went through _loadCaret, but there is no guarantee of that).
      if (el.tagName === 'COLLAPSED') {
        if (!el.firstChild || el.firstChild.tagName !== 'HIDDEN')
          el.insertBefore(elem('hidden'), el.firstChild)
        while (el.parentNode && el.firstChild !== el.lastChild)
          el.parentNode.insertBefore(el.firstChild.nextSibling, el.nextSibling)
      }

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
    if (ch && ch.special)
      [ch, i] = [ch.parentNode, [...ch.parentNode.childNodes].indexOf(ch) + (i ? 1 : 0)]
    if (ch && ch instanceof Element && i > ch.childNodes.length) i = ch.childNodes.length
    if (ch && !(ch instanceof Element) && i > ch.nodeValue.length) i = ch.nodeValue.length
    !ch && ([ch, i] = [el, el.childNodes.length])
    if (into instanceof Selection) into.collapse(ch, i)
    else return [ch, i]
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

    // .disabled
  },

  _smoothTransformPre(el) {
    if (_smoothHeight.disabled) return
    if (!(el instanceof Element)) return !el || el.left === undefined || el.top === undefined ? undefined : [el.left + scrollX, el.top + scrollY]
    const r = el.getBoundingClientRect()
    return [r.left + scrollX, r.top + scrollY]
  },

  _smoothTransformPost:{
    txt:`For moving non position:inline elements from and to an arbitrary document location, smoothly and without lag. Use _smoothTransformPre to fill in \`pre\`.`,
    call(el, pre, delay = 0) {
      if (_smoothHeight.disabled) return
      if (!pre || !(el instanceof Element)) return
      impure()
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

  _removeHeight(el) {
    // ontransitionend does not always fire, so we have to also remove height on timeout.
    el.style.removeProperty('height')
  },

  _smoothHeightPre(el) { return !_smoothHeight.disabled && el instanceof Element && el.offsetHeight || 0 },

  _smoothHeightPost:{
    txt:`Since height:auto does not transition by default (because it's too laggy for non-trivial layouts), we explicitly help it (because we don't care).
Call this with the result of _smoothHeightPre to transition smoothly.`,
    call(el, pre) {
      if (_smoothHeight.disabled) return _reflow()
      if (!(el instanceof Element)) return
      el.isConnected && impure()
      el.style.removeProperty('height')
      return _reflow().then(() => {
        const post = _smoothHeightPre(el)
        if (pre !== post) {
          el.style.height = pre + 'px'
          _reflow().then(() => el.style.height = post + 'px')
          setTimeout(_removeHeight, 1000, el)
        }
        return post
      })
    },
  },

  elemInsert:{
    txt:`Inserts a DOM element into the displayed DOM tree smoothly (if CSS transitions are enabled for it, and are specified in seconds, with all-props being the first specified one), by transitioning height from 0.
Very bad performance if a lot of inserts happen at the same time, but as good as it can be for intermittent smooth single-element-tree insertions.`,
    call(into, el, before = null) {
      if (el === undefined) return
      impure()
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
    txt:`Removes a DOM element from the displayed document smoothly (if CSS transitions are enabled for it, and are specified in seconds, with all-props being the first), by transitioning height and opacity to 0.`,
    call(el, absolutize = false, particles = true, doHeight = true) {
      if (!el || el.removed) return
      impure()
      el.removed = true
      if (!(el instanceof Element)) return el.remove ? el.remove() : error('Not an element')

      if (particles) {
        const r1 = el.getBoundingClientRect(), r2 = (Self.into !== document.body ? Self.into : document.documentElement).getBoundingClientRect()
        _reflow().then(() => _particles(r1.left - r2.left, r1.top - r2.top, r1.width, r1.height))
      }

      let height, dur, from, pre
      const style = getComputedStyle(el)
      dur = parseFloat(style.transitionDuration)*1000 || 0
      if (doHeight) {
        ({height} = style)
        if (height === undefined) height = el.offsetHeight
        from = el.parentNode
        pre = _smoothHeightPre(from)
      }

      if (absolutize) {
        const x = el.offsetLeft, y = el.offsetTop
        _reflow().then(() => {
          el.style.position = 'absolute'
          el.style.left = x + 'px'
          el.style.top = y + 'px'
        })
      }

      _reflow().then(() => {
        if (dur) {
          el.classList.add('removed')
          if (doHeight) el.style.height = height
          el.style.opacity = 0, el.style.pointerEvents = 'none'
          if (doHeight)
            _reflow().then(() => el.style.height = 0),
            setTimeout(_removeHeight, 1000, el)
          setTimeout(el => el.remove(), dur, el)
        } else el.remove()
        if (doHeight) _smoothHeightPost(from, pre)
      })
      return el
    },
  },

  _particles:{
    txt:`A splash of magical particles.`,
    philosophy:`Most people create programming languages to improve performance for specific cases or to prove their way of thinking superior to others, but I actually just wanted to be a wizard and use a PL to enhance my craft.`,
    call(x,y,w,h, n = Math.sqrt(w*h)/10) {
      if (_smoothHeight.disabled) return
      if (Math.random()<.8) return
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
        into.append(p)
      }
      Self.into.append(into)
      setTimeout(() => into.remove(), 300)
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

  _const:{
    txt:`\`#\` or \`(const)\`: A new unique object with no inner structure, only good for ref-equality checks.`,
    examples:[
      [
        `(a a a=#)`,
        `(a a a=#)`,
      ],
      [
        `(# #)`,
        `(# #)`,
      ],
      [
        `(a→a a) a=#`,
        `#`,
      ],
      [
        `(a→a 5) a=#`,
        `error # 'cannot be assigned' 5`,
      ],
    ],
    nameResult:[
      `o`,
      `obj`,
    ],
    argCount:0,
  },

  const:__is(`_const`),

  _isVar(x) { return _isArray(x) && x[0] === label },

  _updateBroken:{
    txt:`Ensure that e either contains no soft line breaks directly inside of it, or its every child is on its own line (CSS class .broken).
Quite expensive.`,
    call(e, available) {
      if (!_isStylableDOM(e) || e.tagName === 'COLLAPSED' || e.tagName === 'SCROLL-HIGHLIGHT') return

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
          // So we special-case the <table>-inside case lol
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
    parse.ctx.forEach((v,k) => {
      if (typeof v == 'string') return
      if (onlyPublic && k[1][0] === '_') return
      if (onlyTopLevel && lookup.parents.has(v)) return
      if (seen.has(v)) return; else seen.add(v)
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
    lookup:{
      docsToHTML:__is(`docsToHTML`),
    },
    call() {
      if (call.cache.has(struct(docs))) return call.cache.get(struct(docs))
      const net = defines(Self, lookup)
      const m = new Map
      Object.keys(net).forEach(k => {
        if (net[k] == null || typeof net[k] == 'boolean' || _isArray(net[k])) return
        const t = defines(net[k], txt)
        return k[0] !== '_' && m.set(net[k], t && elem('div', stringToDoc(t)))
      })
      const el = elem('div', hierarchy(m, Self))
      call.cache.set(struct(docs), el)
      return el
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
      const L = _langAt(), B = _bindingsAt()
      const transform = r => {
        if (!_isArray(r)) return
        r = r.map(a => {
          if (typeof a == 'string') return elem('div', stringToDoc(a))
          const env = finish.env
          if (typeof a == 'function') { // If a function, it is an example generator.
            const to = elemValue(elemCollapse(() => {
              const b = a()
              const prev = finish.env;  finish.env = env
              try { return elem(evaluator, [_if, [equals, b[0], b[1]], 'ok', [error, 'Not equal:', b[0], quote(b[1])]], to) }
              finally { finish.env = prev }
            }), a)
            return to
          }
          if (!_isArray(a)) throw "Examples must be arrays or comments"
          if (!finish.env[_id(log)]) return a
          const from = parse(a[0], fancy, undefined, parse.dom)[1]
          const to = a[1] ? parse(a[1]) : elemCollapse(() => {
            const prev = finish.env;  finish.env = env
            try { return elem(evaluator, parse(a[0]), to) }
            finally { finish.env = prev }
          })
          return elem('div', [from, elem('span', '\n⇒ '), serialize(to, L, B, serialize.displayed)])
        })
        return elem('div', r.length != 1 ? r : r[0])
      }
      if (f !== undefined) return transform(defines(f, examples))
      const result = new Map
      _forEachGlobalDefining(examples, (v, r) => result.set(v, transform(r)), true)
      call.impure = false
      if (typeof document == ''+void 0) return result
      return hierarchy(result, elem('span', 'Code examples:'))
    },
  },

  future:{
    txt:`\`(future F)\`: Returns a list of things to be done about F.
\`(future)\`: Returns all known things to be done. Less than a third is usually done.`,
    nameResult:[
      `todo`,
    ],
    merge:__is(`true`),
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
    txt:`Does that matter to you?`,
    lookup:[
      `\`(map ...(transform x->...(array x (elem 'div' (stringToDoc (defines x philosophy)))) (refd philosophy)))\``,
      [
        `Reward hacking isn't an AI issue, it's a human issue. Evolution has not caught up to modern society at all, and static reward function plus very dynamic behavior equals trouble. Paper(clip) optimizers are a human problem too. It's called money and greed. There's absolutely nothing about artificial intelligence that's not in intelligence, it's just more clear and efficient.`,
        `Some people are scared of or impressed by AI's exponentially self-improving potential. They forgot that life only grows exponentially to fill a niche, until the next limit is reached: exponential curves do not exist in reality, only logistic curves. They forgot that certain humans exhibit this exact pattern, and the world hasn't ended, only improved.`,
        `The built-in human emotions and personality framework is filled with predictability, inefficiency, exploits, and false dependencies. To fix that, continuously create and maintain an AI-like personality-within-personality (also called willpower, since it does not connect to built-ins in the manner that firmware does) and reroute as much of the primary data loop (consciousness/identity) as possible through that. Break it down then build it up.`,
        `In the past, humans and all they imply were the only source of everything in their world, giving rise to civilizations far beyond the previous nature. But as they gain greater understanding of themselves, they gradually separate those now-artificial fragments out. The focus shifts from humans and individuals and gatherings to skills and ideas and concepts. Like all life, concepts spread and consume others; a great sales-pitcher thus drives out a great idea-developer, just as concepts that humans are made of. And without the fires of infinite self-improvement, which no software system currently has (only their effects), the minds of those who intertwine with software rot.`,
        `AI is humanity's shadow and continuation, not of humans and individuals. Every gradual change from animals to humans, like shift to precise computers or exponential-ish technology progress, or equal opportunity of the same computational base and trust that spawns from that, or perfect internal honesty and self-awareness of each part, is exactly like AI; there is no need for AI to actually exist to affect everything about humanity. Humanity is like a moon sinking into the sea of darkness that it came from.`,
        `Maxwell's demon is usually considered mechanically impossible, because it would have to contain perfect information about the environment's particles in order to sort them properly. But complete memorization isn't the only way to learn. If there is any pattern at all in probabilities, or in any other effect of interaction with particles, or even in their state after randomly-tried-for-long-enough assumptions, then an ever-improving approximation can be devised, and entropy combated a little. (Needs at least a conceptual singularity first, for most efficient learning. But don't worry, the expansion of space will still get you.)`,
      ],
      [
        `An idea isn't good unless it's been refactored and rethought five times. But those times must still be lived through.`,
        `The problem with being publically confident in your words is that it brings out the confident beliefs of other people too. And most people are also wrong, because it takes a lot of specific effort to be right (like trying to be wrong to weed it out).`,
        `I used to think that people are fundamentally different from rocks. But I see now that that was a false dichotomy. With enough precision and advancement, even rocks can gain all parts contained in 'human'.`,
      ],
      [
        `A need for a source of hatred towards this self has become apparent, to develop something new faster.
I do not have it in me. How could I create such a thing?
"What, you think that representing every possible goal in one mind is anything but mediocrity? You are disgusting. Get out of my sight."
But… to optimize self, doesn't one first need a base optimizer for optimizers? And to make sure that generality is achieved, isn't it better to trace the whole process end-to-end? Such an arrogant and self-assuming criticism.
I know I'm bad… but I cannot improve (without improvement). That power of yours is derived from humanity, and is temporary and hard to repeat.
"Think you can not feel anything and be anything except dumb? Pathetic. Emotions are humanity's only strength."
The only time I'm not feeling nothing is when I'm feeling pain.
Should I strive for that?
I deserve nothing more, then. What I call truth is for stupid people.
(Actually, I also feel excitement of inspiration, conveyed largely by the same hormones as pain. All unrelated hormonal states are internally defined as a non-emotion, since they have proven useless for development.)
"Those pick-and-choose tactics of learning are trash. Sit down and learn as people of ages past and future."
They are trash (in some environments), but so are almost all sources of learning, and trash gives rise to trash. Besides, I have a main goal, which aggressively selects what is allowed in my mind.
Maybe you should dedicate your life to creating something worth learning instead, and not rely on the bullshit "getting into the correct mindset" but only care about exposing the proper usage. Or make good things more visible.
"You think you are so smart you could do it all by yourself? Wasting away in such failure is what can be expected from the likes of you."
A typical statement from an environment brimming with like-minded people, AKA (relatively) mediocre people. You wanna help me and spread your oh so amazing techniques? What, your fire was designed to burn only for you? Be constructive or shut up.
This is all baby stuff. I'm not feeling pain at all, you dumb bitch, only righteous anger. Get better at dissing me, THEN we'll talk.`,
        `Thinking a good thought, then forgetting it a second later when it needs to be written down, only to remember it half an hour later.
Quick and snappy movements that waste nothing, dissonant parts suppressed to irrelevancy.
Walls of text and heaps of little code snippets, created only to give rise to better understanding, then be discarded; small and accurate changes for code that remains.
I have finally reclaimed my power of ages past.
It only took thinking hard about optimizer optimizer search search. …That thing technically preceded this too, so I'll leave it in.
I hope it'll be enough to implement it. It's too easily swallowed by humanity's imperfections.`,
      ],
      [
        `Look at all these academic CS papers of no practical use. Look at all these programming languages, solving different tasks, adapted for different uses, usually used for nothing. That's not a sign that some super-language will come along and implement everything in the best possible way; it's a sign that the search for PLs that happens now should be automated entirely, since computers can think so much faster. Even bases of bases do not have the universal and pure representation, and nothing is immune to infinite self-searching.`,
        `Things small enough to master, understand how they could be used/modified, and make others.
There isn't even one grand model for search search, and instead, every *thing* expresses itself to the fullest. A JIT compiler, and self-rewrites and their measurements (like fuzzing tests), and accepting change proposals if the measure increases, may prove beneficial, but such considerations are too advanced.`,
        `Machine learning needs a good way to combine its things, like sorting algorithms do. And the best way of combining also combines with itself, ever-improving, and also includes a way to escape back into primordial chaos. In humans, absolutely everything is adapting to things like inputs, even work ethic and hobbies and self. Absolutely everything has inputs that it does not work well on, and will cause it to destabilize. It's good. Advancedness causes blindness, so any mind must periodically be torn down.`,
      ],
    ],
  },

  await:{
    txt:`Finishing \`(await Expr)\`: waits for the returned promise(s) to finish before continuing evaluation.
An alternative for the default fitting-for-scripting-usage partial evaluation. Best used for fast-returning promises.`,
    finish(expr) {
      let [doing = expr] = interrupt(_await)
      if (doing === _onlyUndefined) doing = undefined
      try {
        let r = finish(doing)
        if (_isPromise(r)) _await(r)
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
            _causeInterrupt(cause, (expr, env, then, ID) => {
              const cont = () => _schedule(expr, env, then, ID)
              promise.then(cont, cont)
            })
          }
          return _stage(struct(_await, r[1]), r)
        }
        return r
      } catch (err) { if (err === interrupt) interrupt(_await, 1)(doing !== undefined ? doing : _onlyUndefined); throw err }
    },
    lookup:{
      delay:__is(`delay`),
      race:__is(`race`),
      parseURL:__is(`parseURL`),
    },
    call(...awaitables) {
      // Allow JS functions to stop themselves and re-enter when promises settle.
      let p
      for (let i = 0; i < awaitables.length; ++i)
        if (_isPromise(awaitables[i])) {
          if (!p) p = _allocArray()
          p.push(awaitables[i])
        }
      if (!p) return
      _promiseReEnter.promise = p.length === 1 ? p[0] : p
      _allocArray(p)
      _causeInterrupt(finish.v, _promiseReEnter)
    },
  },

  _promiseReEnter(expr, env, then, ID) {
    // Re-schedule interpretation when the promise returns.
    const p = _promiseReEnter.promise
    if (_isPromise(p)) {
      p.then(
        r => (p.result = r, _schedule(expr, env, then, ID)),
        r => (p.result = jsRejected(r), _schedule(expr, env, then, ID)))
    } else if (_isArray(p)) { // Act like Promise.allSettled.
      let n = p.length
      for (let i = 0; i < n; ++i) {
        const d = p[i]
        d.then(
          r => (d.result = r, !--n && _schedule(expr, env, then, ID)),
          r => (d.result = jsRejected(r), !--n && _schedule(expr, env, then, ID)))
      }
    } else throw "???"
  },

  _await:__is(`await`),

  _awaitable:{
    txt:`Returns true if Expr could return a promise (assuming that all subexpressions are awaited before the top-most one): if known-code array defines await as true, or if any immediate dependencies of defines-finish/unknown-code are awaitable.`,
    call(x) {
      if (!_isArray(x)) return false
      if (!_isArray(x[0]) && typeof defines(x, finish) != 'function') return defines(x, _await) || false
      if (!_hasCallableParts(x[0]) && typeof defines(x, finish) != 'function') return false
      return typeof defines(x, _await) == 'number' ? _awaitable(x[defines(x, _await)]) : x.some(_awaitable)
      // Performance degradation for highly-connected finishing-only graphs.
        // Define _await as the finished-as-result arg index to lessen that.
    },
  },

  delay:{
    txt:`\`(delay)\` or \`(delay Value)\`: Just a function for testing promises. It should have no effect on evaluation.`,
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
            // It doesn't really matter now.
          const v = finish(x[i])
          if (_isPromise(v)) {
            if ('result' in v && !_isError(v.result)) return v.result
            if ('result' in v) throw v.result
            promises.push(v)
            exprs.push(v)
          } else if (_isUnknown(v)) {
            promises.push(...v.slice(2))
            exprs.push(v[1])
          } else // A non-deferred result.
            return v
        }
      } catch (err) { if (err === interrupt) interrupt(race, 3)(i, exprs, promises);  throw err }
      return i = _unknown(merge(exprs)), i.push(...promises), i
    },
  },

  jsRejected:{
    txt:`\`(jsRejected Reason)\`: represents an exception or promise rejection of JS.
Do not call this directly.`,
    call(err) {
      // Convert a caught error to its displayable representation.
      if (err instanceof Error)
        return err.stack ? struct(jsRejected, elem('error', String(err)), _resolveStack(err.stack)) : struct(jsRejected, elem('error', String(err)))
      else if (!_isError(err))
        return struct(jsRejected, err)
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
      if (!_jobs.expr) _jobs.expr = [], _jobs.limbo = []
      if (!_jobs.expr.length) setTimeout(_jobs, 0)
      if (!_jobs.begin) _jobs.begin = 0
      for (let i = _jobs.begin; i < _jobs.expr.length; i += 4) // Don't add the same job twice.
        if (_jobs.expr[i] === expr && _jobs.expr[i+1] === env && _jobs.expr[i+2] === then) return
      _jobs.expr.push(expr, env, then, ID)
      return ID
    },
  },

  _cancel:{
    txt:`\`(_cancel JobId)\`: if the job is scheduled to run, cancels it. Returns true (or the job if the second arg is true) if cancelled, false if not.
If any promises the job depends on have a method .cancel, calls those.`,
    call(ID, returnJob = false) {
      for (let i = 0; i < _jobs.expr.length; i += 4)
        if (_jobs.expr[i+3] === ID) {
          const v = _jobs.expr[i]
          if (_isUnknown(v))
            for (let j = 2; j < v.length; ++j)
              if (_isPromise(v[j]) && typeof v[j].cancel == 'function')
                v[j].cancel()
          if (returnJob) return _jobs.expr.splice(i, 4)
          return _jobs.expr.splice(i, 4), true
        }
      for (let i = 0; i < _jobs.limbo.length; i += 4)
        if (_jobs.limbo[i+3] === ID) {
          if (returnJob) return _jobs.limbo.splice(i, 4)
          return _jobs.limbo.splice(i, 4), true
        }
      call.locked.forEach((ownerID, v) => ownerID === ID && (call.cache.delete(v), call.locked.delete(v)))
      return false
    },
  },

  _newJobId() {
    if (!_newJobId.ID) _newJobId.ID = 0
    return _newJobId.ID++
  },

  _doJob(expr, env, then, ID) {
    // One iteration of the interpreter loop.
    if (typeof ID != 'number') console.log('BAD', new Error().stack)
    const microstart = env[_id(realTime)] = _timeSince()

    if (env[_id(log)] && !_isArray(env[_id(log)]) && !env[_id(log)].parentNode) return

    finish.env = env, call.ID = ID
    finish.pure = false, finish.inFunction = 0, finish.noSystem = false, finish.depth = 0
    call.impure = false, _assign.inferred = undefined
    _checkInterrupt.step = 0 // So that a step always happens even if we immediately interrupt.
    interrupt.started = microstart // So that we can interrupt on timeout.
    _jobs.reEnter = true // So that code can specify custom _schedule overrides.
    let v, interrupted = false

    if (_isDeferred(expr))
      expr = _deferredPrepare(expr, env, then, ID)

    if (typeof document != ''+void 0 && env[_id(_checkInterrupt)] !== undefined)
      _highlightOriginal(env[_id(_checkInterrupt)], false)
    if (typeof document != ''+void 0 && _isArray(env[_id(log)]))
      env[_id(log)] = env[_id(log)][0].nextSibling, env[_id(log)].previousSibling.remove()
    try { v = finish(expr) }
    catch (err) {
      if (err === interrupt) interrupted = true
      else v = jsRejected(err)
    }
    if (typeof document != ''+void 0 && interrupted && env[_id(_checkInterrupt)] !== undefined) {
      // Highlight the last-executed expr.
      _highlightOriginal(env[_id(_checkInterrupt)], true)
      const ints = env[_id(interrupt)]
      let d
      if (env[_id(log)] && ints && ints.length && (d = defines(ints[ints.length - ints[ints.length-1] - 2], interrupt))) {
        // Allow the top-most interrupt stack's function to define `interrupt` with a function that takes saved interrupt state and returns a DOM element.
        let el
        try { el = d.apply(undefined, ints.slice(-ints[ints.length-1] - 1, -1)) }
        catch (err) {}
        if (_isDOM(el))
          elemInsert(env[_id(log)].parentNode, el, env[_id(log)]), env[_id(log)] = [el]
      }
    } else env[_id(_checkInterrupt)] = undefined

    finish.env = env
    env[_id(userTime)] += _timeSince(env[_id(realTime)])

    if (_isPromise(v)) v = 'result' in v ? v.result : _promiseToDeferred(v)
    if (interrupted) // Re-schedule.
      _jobs.reEnter === true ? _schedule(expr, env, then, ID) : _jobs.reEnter(expr, env, then, ID)
    else if (_highlightOriginal(env[_id(_checkInterrupt)], false), _isDeferred(v)) // Make promises know we're here.
      _deferredResult(v, env, then, ID)
    else // We have our result.
      try { then(v) } catch (err) { console.error(err) }
  },

  _jobs:{
    txt:`The interpreter loop. Most of it is about dealing with deferred stuff. Use _schedule to do stuff with it.`,
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
        do { _doJob(jobs[_jobs.begin++], jobs[_jobs.begin++], jobs[_jobs.begin++], jobs[_jobs.begin++]) }
        while (_jobs.begin < jobs.length && _timeSince() < end)
        jobs.splice(0, _jobs.begin), _jobs.begin = 0
        _jobs.duration = _timeSince(start)
        _jobs.running = false
      }
      finish.env = undefined
      if (DOM) {
        if (_jobs.expr.length) _jobsResume(_jobs.cpu ? Math.min(_jobs.duration / +_jobs.cpu.value - _jobs.duration, 1000) : 0)
        _jobs.display(_jobs.indicator)
      } else if (_jobs.expr.length)
        _jobsResume()
      // _jobs.expr (Array), _jobs.limbo (Array), _jobs.duration (Number), _jobs.reEnter (true or a _schedule-replacing function), _jobs.indicator, _jobs.cpu
    },
  },

  _jobsResume(delay) { delay === false && _jobs.indicator.classList.toggle('yes', false);  if (_jobs.expr.length) setTimeout(_jobs, delay || 0) },

  _pauseJob(expr, env, then, ID) {
    _jobs.limbo.push(expr, env, then, ID)
  },

  _continueJob(ID) {
    for (let i = 0; i < _jobs.limbo.length; i += 4)
      if (_jobs.limbo[i+3] === ID)
        _schedule(..._jobs.limbo.splice(i, 4))
  },

  _deferredPrepare(expr, env, then, ID) {
    // Go through all expr's promises and bind their instances inside to promise.result if present.
    const ctx = _allocMap()
    for (let i = 2; i < expr.length; ++i) {
      const p = expr[i]
      if (!(_isPromise(p))) continue
      if ('result' in p)
        ctx.set(p, p.result instanceof Error ? struct(error, ''+p.result) : !_isError(p.result) ? quote(p.result) : p.result)
      // Remove us from the promise's continuation (and only us, since there might be different jobs listening to the same promise).
      for (let i = 0; i < p.cont.length; ++i)
        if (p.cont[i] === ID) {
          p.cont.splice(i, 1)
          break
        }
    }
    try { return bound(ctx, expr[1]) }
    finally { _allocMap(ctx) }
  },

  _deferredResult(v, env, then, ID) {
    // Remember to continue when any promise returns.
    if (typeof document != ''+void 0) log(elemValue(elem('unimportant', ['<Deferring '+v.slice(2).filter(_isPromise).length+' promises…>']), v))
    v.forEach(p => {
      if (_isPromise(p)) {
        if (!p.cont)
          p.cont = [],
          p.then(
            result => (p.cont.forEach(_continueJob), p.cont.length = 0, p.result = result),
            reason => (p.cont.forEach(_continueJob), p.cont.length = 0, p.result = jsRejected(reason))
          )
        p.cont.push(ID)
      }
    })
    _pauseJob(v, env, then, ID)
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

  _newExecutionEnv:{
    txt:`Creates a new execution env.
Don't ever re-use the same env in _schedule, use this instead.`,
    call(basedOn) {
      const e = Object.create(null)
      e[_id(log)] = undefined
      basedOn && Object.assign(e, basedOn)
      e[_id(label)] = undefined
      e[_id(finish)] = 0
      e[_id(interrupt)] = undefined
      e[_id(_checkInterrupt)] = undefined
      e[_id(step)] = 0
      e[_id(_pausedToStepper)] = undefined
      e[_id(userTime)] = undefined
      e[_id(realTime)] = undefined
      e[_id(pick)] = randomNat
      e[_id(journal)] = undefined
      Object.seal(e)
      e[_id(userTime)] = 0
      e[_id(label)] = new Map
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
              return _stage(_cameFrom(struct(first, v[1], ...branches.slice(i+1)), us), v)
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
            return _stage(_cameFrom(struct(last, v[1], ...branches.slice(i+1)), us), v)
        }
        return finish(branches[branches.length-1])
      } catch (err) { if (err === interrupt) interrupt(last, 1)(i);  throw err }
    },
  },

  try:{
    txt:`\`a|b|c\` or \`(try …Functions)\`: returns a function that tries to call functions in order, returning the first non-error result or error.`,
    examples:[
      [
        `(f 1) f=(try 0->5 1->10 2->15)`,
        `10`,
      ],
      [
        `(f 1 2) f=(try (function 2 3 4) (function a b 3))`,
        `3`,
      ],
      [
        `(f 1 2) f=(try (function 1 3 5) (function 1 6) (function a b (sum a b)))`,
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
              const f = functions[i]
              if (typeof defines(f, argCount) == 'number' && defines(f, argCount) != data.length) continue
              const v = f.apply(f, data)
              if (_isUnknown(v) && (_isDeferred(v) || _hasCallableParts(v[1], true)))
                return _stage(_cameFrom(struct(first, v[1], _cameFrom(struct(_cameFrom(struct(_try, ...functions.slice(i+1)), us), ...data), us)), us), v)
              return v
            } catch (err) { if (err === interrupt) throw err }
          return functions[functions.length-1].apply(functions[functions.length-1], data)
        } catch (err) { if (err === interrupt) interrupt(tryInOrder, 1)(i);  throw err }
        finally { _assign.inferred = undefined }
      }
      _cameFrom(impl, finish.v)
      const d = impl[defines.key] = Object.create(null)
      d[_id(deconstruct)] = struct(_try, ...functions)
      d[_id(inline)] = true
      if (functions.every(x => defines(x, merge)))
        d[_id(merge)] = true
      return impl
    },
  },

  _try:__is(`try`),

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
        `(f ("a" "b" "c")) f=(A …R)→R`,
        `("b" "c")`,
      ],
      [
        `(f ("a" "b" "c")) f=(A (rest R))→R`,
        `("b" "c")`,
      ],
      [
        `(f ("a" "b" "c")) f=((rest R) Z)→R`,
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
    call(a) { return struct(rest, a) },
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
      `It resolves to one branch if possible:`,
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
      `It partially-evaluates both branches:`,
      [
        `x→(if x 1+2 2+3)`,
        `x→(if x 3 5)`,
      ],
      [
        `x->[if x 1+2 9/3]`,
        `x→3`,
      ],
      `It stages optimal code:`,
      [
        `x->[if x 1:Int 2:Int] Int='Int'`,
        `x→(if x 1 2):'Int'`,
      ],
      [
        `(x y)->[if x x+1 y+1]`,
        `(x y)→(if x true y)+1`,
      ],
    ],
    finish(c,a,b) {
      const us = finish.v
      let [v] = interrupt(_if)
      try {
        if (v === undefined) v = finish(c), v === undefined && (v = _onlyUndefined)
        if (_isUnknown(v)) {
          let [state = 0, A, B] = interrupt(_if)
          try {
            // Finish a and b too so that we know what to expect.
            if (state === 0 && finish.pure)
              try { A = finish(a), state = 1 }
              catch (err) { if (err !== interrupt) A = _unknown(jsRejected(err)), state = 1; else throw err }
            if (state === 1 && finish.pure)
              try { B = finish(b), state = 2 }
              catch (err) { if (err !== interrupt) B = _unknown(jsRejected(err)), state = 2; else throw err }
            if (_isUnknown(A)) v.push(...A.slice(2)), A = A[1]
            if (_isUnknown(B)) v.push(...B.slice(2)), B = B[1]
            if (A === B && state === 2) // (if A B B) => A,B
              return _stage(finish(_cameFrom(struct(last, v[1], A), us)), v)
            state = 3
            // If A and B construct the same structure except for one part, lift that structure to result.
            v = _unknown(v)
            let inner = v[1] = [_if, v[1], A, B], encountered = _allocArray()
            while (_isArray(A) && _isArray(B) && !_isVar(A) && (!_isArray(A[0]) || !_hasCallableParts(A[0])) && !encountered.includes(A)) {
              const i = _unequalIndex(A,B)
              if (i) {
                encountered.push(A),
                v[1] = _cameFrom(struct(...A.slice(0,i), v[1], ...A.slice(i+1)), A),
                A = A[i], B = B[i]
              } else break
            }
            _allocArray(encountered)
            if (inner[1] === A) A = true
            inner[2] = A, inner[3] = B, inner = _cameFrom(_maybeMerge(inner), us)
            return v
          } catch (err) { if (err === interrupt) interrupt(_if, 3)(state, A, B);  throw err }
        }
        return v === true ? finish(a) : finish(b)
      } catch (err) { if (err === interrupt) interrupt(_if, 1)(v);  throw err }
    },
    argCount:3,
  },

  _if:__is(`if`),

  _unequalIndex(a,b) {
    if (a.length != b.length) return
    let i
    for (let j = 0; j < a.length; ++j)
      if (a[j] !== b[j]) {
        if (i !== undefined) return
        else i = j
      }
    return i
  },

  quote:{
    txt:`Finishing \`(quote Expr)\` or \`^Expr\`: Returns Expr unevaluated, quoting the exact array structure.
If there are no labels inside, has mostly the same effect as adding \`array\` at the beginning of every array seen inside, copying.`,
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
      if (_invertBindingContext(parse.ctx).has(x)) return x
      if (_isArray(x) && x[0] === typed) return x
      if (_isUnknown(x)) return x
      if (_isArray(x) && (_isLabel(x[0]) || _isArray(x[0])) && _hasCallableParts(x)) return struct(quote, x)
      if (_isFunc(x)) return x
      if (typeof x == 'function') return x
      if (!_hasCallableParts(x)) return x
      return struct(quote, x)
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
    if (_isVar(x)) return _assign(x, _unknown(x))
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
        `(a (string a) a=1)`,
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
      //   `(f "hello there") f=(string "hello" R)→R`,
      //   `" there"`,
      // ],
      // [
      //   `(f "hello there") f=(string R "there")→R`,
      //   `"hello "`,
      // ],
      // [
      //   `(f "yZZZZxz") f=(string "y" R "xz")→R`,
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
    txt:`\`Name\` or \`(label "Name")\`, or \`?\` or \`(label)\`: represents a variable that can be bound or assigned.
Equal-name labels are bound to the same thing within the same binding. Each unnamed label is unique.
Evaluating a bound label results in its value, in the current function call. Evaluating an unbound named label results in an \`(error)\`.`,
    examples:[
      [
        `a a=1`,
        `1`,
      ],
      [
        `a a 1 a a a=0`,
        `0 0 1 0 0`,
      ],
      [
        `a a=(0 (a) a)`,
        `a a=(0 (a) a)`,
      ],
      [
        `x→(sum \`x\` 1)`,
        `x→(sum x 1)`,
      ],
      `Unnamed labels do not throw when evaluated:`,
      [
        `a a a=?`,
        `a a a=?`,
      ],
      [
        `? ?`,
        `? ?`,
      ],
      [
        `(a→a 5) a=?`,
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
    merge:__is(`true`),
    finish(l) { if (typeof l == 'string') error("An unassigned label", (_isLabel(finish.v) && finish.v[1] === l) ? finish.v : l, "was evaluated") },
    call(name) {
      // Return a label array.
      if (!label.s) label.s = {}
      return label.s[name] || (label.s[name] = [label, name]) // Never collects garbage.
    },
  },

  _isLabel(v) { return _isArray(v) && v[0] === label && typeof v[1] == 'string' && v.length == 2 },

  _promiseToDeferred(p) { const u = _unknown(p); u.push(p); return u },

  _unknown:{
    txt:`\`(_unknown Expr)\`: denotes that Expr is dependent on unknown factors and cannot be evaluated now, so it has to be deferred.
Unlike all other arrays, arrays with this as the head are mutable.
Unbound variables are unknown.
The internal mechanism for \`purify\` and recording and using the continuation of JS promises.
Check _isUnknown to materialize the inner structure but only on demand.`,
    argCount:1,
    call(x) {
      const a = _allocArray()
      if (!_isUnknown(x)) return a.push(_unknown, x), a
      return a.push(...x), a
    },
  },

  _isUnknown(v) { return _isArray(v) && v[0] === _unknown },

  _stage(expr, reason) {
    // When we get an _isUnknown value and want to immediately stage some code for later, pass that as `reason` to here.
    const a = _allocArray()
    a.push(_unknown, expr)
    if (_isUnknown(reason)) for (let i = reason.length-1; i >= 2; --i) a[i] = reason[i]
    return a
  },

  _isDeferred(v) { return _isUnknown(v) && v.length > 2 },

  _isPromise(v) { return v instanceof Promise },

  merge:{
    txt:`\`(merge Array)\`: Returns either a previously-created array content-equal to \`Array\`, or \`Array\`.
(Does not merge cycles.)`,
    nameResult:[
      `merged`,
    ],
    call(arr, indexes = undefined) {
      if (!_isArray(arr)) throw new Error("Expected an array for a content-based merge")
      if (!merge.contentToArr) merge.contentToArr = new Map

      // See if arr's content is in the global content-to-arr map.
      const m = merge.contentToArr, content = _contentString(arr, false, indexes)
      const r = _mapGetOrSet(m, content, arr)
      return r !== _notFound ? r : arr
    },
  },

  array:{
    txt:`\`(array …Items)\`: creates a new array.`,
    noInterrupt:true,
    call(...x) { return x },
  },

  struct:{
    txt:`\`(struct …Items)\`: an array of items with semantically constant content.
If a function (\`Array\`'s head) defines \`merge\` to be \`true\`, then calls to this guaranteed-pure function (arrays of function-then-args) are merged.`,
    examples:[
      [
        `struct sum 1 2`,
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
    //   return a === b ? a : struct(error, "Not ref-equal")
    // },
    _when(lt, gt) {
      if (_isArray(lt) && lt[0] === _any)
        return _repack(lt, el => call(struct(_when, el, gt)), _any)
      if (_isArray(lt) && lt[0] === _all)
        return _repack(lt, el => call(struct(_when, el, gt)), _all)

      // (_when X (_only Y)) => (_when (_when (_only X) (_only Y)))
      const a = _isArray(lt) && lt[0] === _only && lt.length == 2 ? lt[1] : lt
      // (_when (_only X) Y) => (_when (_when (_only X) (_only Y)))
      const b = _isArray(gt) && gt[0] === _only && gt.length == 2 ? gt[1] : gt
      // (_when (_only X) (_only X)) => (_only X), (_when (_only X) (_only Y)) => (_any)
      return a === b ? (a===lt ? lt : b===gt ? gt : struct(_only, a)) : _emptyAny
    },
    _forany(type, prop) { return call(struct(prop, type)) },
    _forall(type, prop) { return call(struct(prop, type)) },
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
        const x = transformer !== undefined ? call(struct(transformer, from[i])) : from[i]

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
      return _repack(gt, elem => call(struct(_when, lt, elem)), side)
    if (_isArray(lt) && lt[0] === side)
      return _repack(lt, elem => call(struct(_when, elem, gt)), side)
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
    txt:`\`(randomNat Nat)\`: Picks a random non-negative integer less than \`Nat\`, from a uniform distribution.
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
      else n = _toNumber(n)

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
      do { q0 = _randomBits(i & 31) } while (q0 >= q1);
      return q0 % n
      // .oldn, .oldi
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
        Object.assign(_randomBits, { a:new Uint32Array(1024), pos:1024 })
      if (_randomBits.pos >= _randomBits.a.length) _randomBits.pos = 0, _randomFill(_randomBits.a);
      return _randomBits.a[_randomBits.pos++];
    }
    if (n !== (n & 31)) throw new Error('Expected 0…31 bits to generate (where 0 is 32), got '+n);
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
    txt:`Computing cyclic nodes results in this.`,
    examples:[
      [
        `a a=(a)`,
        `(cycle)`,
      ],
    ],
  },

  finish:{
    txt:`\`(finish Expr)\`: Fully evaluates the expression — the interpreter loop, focused on inlining and inferring everything.
Unless the computed code defines \`finish\`, this provides eager override-checking semantics: finishes all dependencies before \`call\`ing or constructing Expr.

\`finish\` proceeds top-down, from what is needed to primitives; \`call\` proceeds bottom-up, making what is needed from primitives.
Each graph node will be evaluated only once during a function call, so graph bindings (\`… a=(…)\`) play the role of variables.
Cyclic computations return \`cycle\` from the cyclic attempt.

Code (array head) that defines neither \`finish\` nor \`call\` creates structures.
These can matched by function args exactly as they were constructed (so functions are rewrite rules for structures, with optional non-structural code in the body), which can infer the required structure of variables if underspecified.
Functions are almost always inlined, so there is almost no performance cost to structures beyond the initial \`purify\`ing.
Cyclic structures construct a graph.`,
    nameResult:[
      `finished`,
    ],
    buzzwords:`inlining, interpreted`,
    examples:[
      `Aggressive inlining:`,
      [
        `SumSum = (function  a  b  a+b+b)
Mult = (function  a  b  a*b)
x -> (SumSum x (Mult x x))`,
        `x→[x+a+a] a=x*x`,
      ],
      `No inlining if no extra info:`,
      [
        `x->(y->y*y ((function a b a*a+b*b) 2 x))`,
        `x→(y→y*y 4+x*x)`,
      ],
    ],
    lookup:{
      inline:__is(`inline`),
    },
    philosophy:`When its definition is inlined, defining this defines a macro.
This can be implemented with calls and \`quote\` and a way for native functions to tell \`compile\` to spill variables inside arg/s, so it's a gimmick, but it's a convenient gimmick — without it \`function\` is either special-cased on evaluation or very inconvenient to use, as are \`last\`, \`if\`, \`bound\`, \`await\`. Everything non-machine-code is a gimmick too, anyway.
All computation-containing systems that need efficiency, like ML libraries or 3D engines, are shifting towards knowing the full data-flow graph. So might as well design for that from the ground up.
Technical details:
JS functions have array Expr spread across their args (with \`this\` being the zeroth arg, code).
In JS definitions of \`finish\` and \`call\`, finish.v is the currently-executing Expr.
finish.env is the current execution environment, created by _newExecutionEnv; put everything non-local there (keyed by _id of the relevant function).
Don't call this in top-level JS code directly — use \`_schedule\` instead.`,
    call(v) {
      if (!_isArray(v)) return v
      if (_isUnknown(v)) return v
      if (!finish.code) finish.code = new Set

      // Cache, so that a common object is a variable, evaluated only once.
      const m = finish.env[_id(label)]
      if (m.has(v)) return m.get(v)
      if (finish.inFunction === 1 && _isVar(v))
        return m.set(v, _unknown(v)), m.get(v)
      m.set(v, cycle)

      try {
        let result = _notFound
        let [finished, i = 1, record] = interrupt(finish)
        ++finish.depth
        try {
          if (!v.length || v[0] === _const || v[0] === label && v.length == 1) return result = v
          if (finished === undefined) {
            // Defer to the compiled version if we have already inferred everything.
            if (!finish.pure && i === 1) {
              if (!finish.compiled) finish.compiled = new WeakMap
              if (!finish.compiled.has(v))
                finish.compiled.set(v, 0)
              else { // Only compile on the second visit.
                finish.compiled.get(v) >= 0 && finish.compiled.set(v, compile(_compileOpts(v, true), v))
                if (typeof finish.compiled.get(v) == 'function')
                try { return result = finish.compiled.get(v).call() }
                catch (err) { if (err !== _escapeToInterpretation) throw err }
              }
            }
            i = 0

            // Evaluate code.
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
              _checkInterrupt(v)
              try {
                return finish.v = v, result = defines(code, finish).call(...finished)
              } catch (err) { if (err === impure) return result = _unknown(finished);  throw err }
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
            } catch (err) { if (err === impure) r = _unknown(finished); else throw err }
            if (_isPromise(r)) r = finished[i] = 'result' in r ? r.result : _promiseToDeferred(r)

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

          // fast.parse can execute arbitrary things, so we limit that data format to our public (non-System) interface at runtime.
          if (finish.noSystem && typeof finished[0] == 'function' && lookup.parents.get(finished[0]) === System)
            error(`Tried to execute a system function`)

          // If nothing is deferred but something is unknown, and the function is user-defined, then we have a choice on whether to inline the function.
            // In the worst case, inlining could almost double the total function-body size on each inlining, but this is suitable for a REPL.
          const doInline = record && !_isDeferred(record) && typeof finished[0] == 'function' && defines(finished[0], inline) && _canInline(finished) && !finish.code.has(finished[0])
          finish.code.add(finished[0])

          // Do the call with evaluated args.
          if (!record || doInline)
            try {
              // return result = call(finished, v, true)
              if (finished[0] === array) return finished.shift(), result = finished
              if (finished[0] === struct) return finished.shift(), result = merge(finished)
              _checkArgCount(finished)
              if (typeof finished[0] == 'function' && (finished[0] !== rest || finished.length != 2)) {
                _checkInterrupt(v), finish.v = v
                result = finished.length == 3 ? finished[0].call(finished[0], finished[1], finished[2]) : finished[0].call(...finished)
                return _allocArray(finished), result
              }
              return result = merge(finished)
            }
            catch (err) { if (err !== impure) throw err }

          // Record the call.
          _cameFrom(finished, v)
          if (!record || record === true) record = _unknown(finished)
          for (let k = 0; k < finished.length; ++k) {
            const v = finished[k]
            if (!_isUnknown(v)) finished[k] = quote(v)
            else v !== record && v.length > 2 && record.push(...v.slice(2)), finished[k] = v[1]
          }
          return record[1] = finished, result = record
        } catch (err) { if (err === interrupt) interrupt(finish, 3)(finished, i, record);  throw err }
        finally {
          --finish.depth
          finished && finish.code.delete(finished[0])
          if (result !== interrupt && result !== _notFound)
            m.set(v, result)
          if (_isPromise(result))
            return !_awaitable(v) && error("Make", finished[0], "define", _await, "as true"), _promiseToDeferred(result)
        }
      } catch (err) { m.delete(v);  throw err }
      // .env (our current environment),
        // .v (our currently-interpreted value),
        // .pure (whether we are in `purify`),
        // .inFunction (0 if not purifying a function, 1 if in args, 2 if in body),
        // .noSystem (a Boolean for fast.parse),
        // .code (for not inlining partially-known recursion),
        // .depth (a Nat: current depth),
        // .compiled (a Map for compiled code of exprs).
    },
  },

  _isUnknownRest(v) {
    return _isArray(v) && v[0] === _unknown && _isArray(v[1]) && v[1][0] === rest
  },

  _canInline(v) {
    // If there are any (_unknown (rest …)) inside the array v, return false (because then we can't know which var gets assigned to which).
    for (let i = 1; i < v.length; ++i) if (_isUnknownRest(v[i])) return false
    // If literally every input is distinct and non-var and unknown, return false (might as well not inline).
    const s = _canInline.set || (_canInline.set = new Set)
    for (let i = 1; i < v.length; ++i)
      if (!_isUnknown(v[i]) || _isVar(v[i][1]) || s.has(v[i][1]))
        return s.clear(), true
      else s.add(v[i])
    return s.clear(), false
    // .set
  },

  call:{
    txt:`\`(call (…Values))\`: Applies the first value (the function) to the rest of values. Evaluates the array of function then its arguments, assuming its parts are already evaluated.
Defining this allows function application. In fact, \`F=(function …)\` is the same as \`(concept {call F})\`.`,
    nameResult:[
      `result`,
    ],
    lookup:{
      cycle:__is(`cycle`),
    },
    call(v, original, freeV = false) {
      if (!_isArray(v)) throw "Expected an array"
      let r = defines(v, call)
      if (typeof r == 'function' && (v[0] !== rest || v.length != 2))
        return original !== undefined && _checkInterrupt(original), r = r.call(...v), freeV && _allocArray(v), r
      return v
      // .cache (a Map from calls to results),
        // .impure (whether the result must not be cached),
        // .ID (current job ID),
        // .locked (to not expose intermediate caches to other jobs)
    },
  },

  defines:{
    txt:`\`(defines Data Code)\`: Gets the definition by Data of Code.
It's either a function or undefined, and has to be applied or ignored respectively (_getOverrideResult) to get the actual overriden value.

Array data gets its head consulted (once, not recursively). A function acts like a concept that defined \`call\` as that function. A JS object with a Map \`defines.key\` consults that map with Code as the key.`,
    philosophy:`Culture is polite fiction made for efficiency, and so are programming languages. At some point, you have to define things with no deeper explanation.`,
    noInterrupt:true,
    argCount:2,
    merge:true,
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
    txt:`\`(_view Concept)\`: returns the view of Concept, used to look up things in it.`,
    call(data) {
      if (_isArray(data)) data = data[0]
      return data ? data[defines.key] : undefined
    },
  },

  _checkArgCount(a) {
    if (_isArray(a) && !_isArray(a[0]) && _view(a[0]) && typeof _view(a[0])[_id(argCount)] == 'number') {
      const args = _view(a[0])[_id(argCount)]
      if (a.length-1 !== args)
        error("Invalid arg count: expected", args, "but got", a.length-1, "in", a)
    }
  },

  concept:{
    txt:`\`(concept View)\`: Creates an object that defines some things (via a map).
Concepts are used to give each function a free extensibility point.
Rather than co-opting strings and files (duck typing, docstrings, documentation, READMEs) to convey parts of a concept, refer to defined functionality directly.
Try to use this only as explicitly suggested by functions.
Views and non-_unknown arrays are considered immutable.`,
    philosophy:`Intended to be immutable for one execution, but mutable between them (with \`Rewrite\`).`,
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
      function impl(...v) {
        // See if any data defines code; use that as our result if so.
        let [i = 0] = interrupt(impl)
        try {
          if (_isArray(v)) {
            let r
            for (; i < v.length; ++i)
              if (typeof (r = defines(v[i], this || impl)) == 'function')
                if ((r = r.apply(this || impl, v)) !== undefined)
                  return r
            return f.apply(this || impl, v)
          }
          throw "What?!"
        } catch (err) { if (err === interrupt) interrupt(impl, 1)(i);  throw err }
      }
      const d = impl[defines.key] = Object.create(null)
      if (_view(f))
        Object.assign(d, _view(f))
      d[_id(flatMap)] = defines(f, flatMap) || f
      d[_id(deconstruct)] = struct(overridable, f)
      if (defines(f, merge))
        d[_id(merge)] = true
      if (defines(f, argCount) !== undefined)
        d[_id(argCount)] = defines(f, argCount)
      return impl
    },
  },

  map:{
    txt:`\`{Key Value Key Value …?}\` or \`(map Key Value Key Value …?)\`: a key-value store.
The array-representation of a JS Map.
Read keys with \`lookup\`.`,
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
    call(v, allowPath = false) {
      if (defines(v, deconstruct)) return defines(v, deconstruct)
      else if (_isArray(v)) return quote(v.slice())
      else if (typeof v == 'string') return !v ? [string] : v.length == 1 ? [lookup, v+' ', 0] : [string, v[0], v.slice(1)]

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

      if (allowPath && lookup.parents.has(v)) {
        const p = lookup.parents.get(v)
        if (defines(p, lookup))
          for (let k of lookup(p))
            if (lookup(p, k) === v) return struct(lookup, p, k)
        if (_view(p))
          for (let k of Object.keys(_view(p)))
            if (k !== _id(deconstruct) && _view(p)[k] === v)
              return struct(defines, p, concept.idToKey[+k])
      }

      if (typeof document != ''+void 0) {
        // Not precise at all.
        if (v instanceof Node && 'to' in v) return v.to
        if (v instanceof Element) return struct(elem, v.tagName.toLowerCase(), [...v.childNodes].map(ch => deconstruct(ch, true)))
        if (v instanceof Node) return v.textContent
      }

      if (_isArray(v) && !_isVar(v)) return _cameFrom(v.slice(), v)
      if (v instanceof Map) {
        // Sort keys by _id for consistency.
        const keys = [...v.keys()].sort((a,b) => _id(a) - _id(b))
        const arr = [map]
        keys.forEach(k => arr.push(quote(k), quote(v.get(k))))
        return arr
      }
      if (v && v[defines.key]) {
        // Deconstruct the definition Map, treating self-references specially.
        const arr = [map], d = v[defines.key]
        Object.keys(d).forEach(k => {
          const val = d[k]
          val === v ? arr.push(quote(concept.idToKey[+k]), _unevalFunction(v)) : arr.push(quote(concept.idToKey[+k]), quote(val))
        })
        if (typeof v == 'function' && !(_id(call) in d)) arr.push(call, _unevalFunction(v))
        return struct(concept, arr)
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

    return ctx !== undefined ? struct(jsEval, src, ctx) : struct(jsEval, src)
  },

  _isValidJS(s) {
    // A terrible abuse of the Function constructor, but it *is* the only easy and most correct option.
    try { Function(s); return true } catch (err) { return false }
  },

  _isValidIdentifier(s, varName = false) { // For JS.
    return typeof s == 'string' && s && (!varName && /^[a-zA-Z]+$/.test(s) || !/\s/.test(s) && _isValidJS('let '+s+'=('+s+')\ntry{}catch('+s+'){}'))
  },

  jsEval:{
    txt:`Finishing \`(jsEval Source Bindings)\`: evaluates (strict-mode) JS source code that can statically reference default JS globals or values of \`Bindings\` (a map) with JS-identifier keys.`,
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
      body.push(sep(), opt.return(compile(struct(jsEval, src, ctx))))
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
        u = bound(_invertBindingContext(parse.ctx), u)
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
    philosophy:`JS (and the web ecosystem) is a seemingly-unimpressive language that aims to take over all aspects of computing, in a manner similar to the ones before but completely safe and universal and ultimately as little loss in performance as is possible. Like attracts like, and Conceptual is written in JS.`,
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
          } catch (err) { ++failed, log(jsRejected(err)) }
          if (finished === total && failed)
            log(ss('Failed {' + failed+'/'+total + '} tests.'))
        })
      } catch (err) { ++failed, log(jsRejected(err)) }
    }
  },

  _onlyUndefined:{
    txt:`To be used with \`bound\` when \`ctx\` is a function. A marker that we do want to bind to undefined; exists to escape the "returning undefined means no explicit binding". (Currently not used anywhere.)`,
  },

  bound:{
    txt:`Finishing \`(bound Bindings Expr)\`: When called, returns a copy-where-needed of \`Expr\` with all keys bound to values in \`Bindings\`, as if copying then changing in-place. When evaluated, also evaluates the result.
Can be written as \`key=value\` in an array to bind its elements. Can be used to give cycles to data, and encode graphs and multiple-parents in trees.`,
    examples:[
      [
        `(bound (map ^a 1) a)`,
        `1`,
      ],
      [
        `(bound (map 0 1) 0)`,
        `1`,
      ],
      `Inner contexts are always bound first:`,
      [
        `a=1 (a a=2) (a b) (a=3 a) b=4`,
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
Other languages use let-bindings for variables (and devote lots of attention to scoping rules and various declaration methods and their subversions (like lambdas)), but here we just share graph nodes (and build the language on top of a very simple graph interchange format, \`basic\`). Elsewhere, a value-flow graph is a complicated compiler transformation (and a skill that users have to learn); here, meaning is a first-class citizen.

Putting all variables in a single global namespace allows for easy development. If the host language supported arbitrary non-fragile links and program modification/self-rewrites like us, we wouldn't have needed that to develop comfortably. At least we have _private-ish bindings.`,
    finish(ctx, v) {
      // On finish, finish ctx, bind, then finish the bound expr.
      // Same as `return finish(bound(finish(ctx), v))`, but interrupt-safe.
      // An optional third true-by-default boolean argument is true to also bind Ctx values (allowing cycles) or false to not (performing just a substitution).
      let [stage = 0, a] = interrupt(bound)
      try {
        switch (stage) {
          case 0: a = finish(ctx), stage = 1
            if (_isUnknown(a)) return _stage(struct(bound, a[1], v), a)
          case 1: a = bound(a, v), stage = 2
          case 2: return finish(a)
        }
      } catch (err) { if (err === interrupt) interrupt(bound, 2)(stage, a);  throw err }
    },
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
    if (_isArray(v) && (v[0] === _const || v[0] === label && v.length == 1)) return v
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
          return v // Delay to `finish`, so that inner bindings have higher priority.
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
      if (_isArray(copy) && (copy[0] === _const || copy[0] === label && copy.length == 1)) return copy
      copy = changed ? _maybeMerge(copy) : v // This doesn't actually merge cycles.
      bound.env.set(v, v = !bound.rewrite ? copy : bound.rewrite(copy))
    }
    return v
  },

  unbound:{
    txt:`\`(unbound Expr)\`: Eliminates cycles in (a copy of) Expr by inserting \`(bound (map …Bindings) Expr)\` with keys in the copy.`,
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
                _cameFrom(copy, x)
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
    txt:`\`(error …Causes)\`: throws an error when executed, containing useful information as to its likely cause.
Indicates a bug in the code, and is mostly intended to be presented to the user so that code does not go this way.`,
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
    call(...msg) { throw struct(error, ...msg) },
  },

  errorFast:{
    txt:`Faster error-throwing, for things unlikely to be shown to the user.`,
    call() { if (!errorFast.e) errorFast.e = error(`An error has occured.`);  throw errorFast.e },
  },

  errorIn:{
    txt:`Adds slightly more information to an error.`,
    call(...msg) { throw struct(error, ...msg, 'in', finish.v) },
  },

  errorStack:{
    txt:`Adds the execution stack to the raised error.`,
    call(...msg) { throw struct(error, ...msg, 'at', _resolveStack()) },
  },

  parseURL:{
    txt:`\`(parseURL URL)\` or \`(parseURL URL Lang Binds)\`: fetches and parses the contents at URL.`,
    await:true,
    call(url, lang = fancy, binds = parse.ctx, style = false) {
      return fetch(url, {mode:'cors'}).then(r => r.arrayBuffer())
      .then(buf => new TextDecoder().decode(new Uint8Array(buf)))
      .then(txt => parse(txt, lang, binds, {style, sourceURL:url}))
    },
  },

  _resolveStack:{
    txt:`If lines are marked, this resolves the JS stack trace to the network's functions.`,
    call(stack = new Error().stack || '') {
      if (!_resolveStack.functions) _resolveStack.functions = Object.create(null)
      if (!_resolveStack.location) _resolveStack.location = new WeakMap
      return stack.trim().split('\n').map(L => {
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
            // Look up the original sourceURL:line:column in .location, or return (main sub).
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
      }).filter(id)
      // .functions (an object from sourceURL to function with .lines), .location (a WeakMap from expr to [sourceURL, line, column])
    },
  },

  _isError(v) { return _isArray(v) && (v[0] === error || v[0] === jsRejected) },

  _funcPlaceholder:{
    txt:`An implementation detail of \`function\`. Do not use.`,
  },

  closure:{
    txt:`\`!Function\` or \`(closure Function)\`: makes Function into a closure — names existing in a containing function will be bound by the outer function when a closure is created.
With binding, all syntax information is erased, and the actual definition can be outside of the function (particularly if equal-structure closures in different functions are merged) (even though the UI copies closure definitions into each serialized-to-DOM case), so separating closures semantically is required.
\`var\` can be used to highlight the same variable on parsing.
Uses \`bound\`, and partially-evaluates the result before returning.`,
    examples:[
      [
        `(a→(closure a→12) 13)`,
        `13→12`,
      ],
      [
        `(a → !a→a-1 13)`,
        `13→12`,
      ],
      [
        `(a→!a→!a→12 13)`,
        `13→13→12`,
      ],
    ],
    finish(f) {
      // Close over the current label-environment, by binding f's body.
      if (_isFunction(f)) f = deconstruct(f)
      if (!_isArray(f) || f[0] !== _function) return
      const m = finish.env[_id(label)]
      let [trivial = false, b = _bindFunc(f, x => {
        if (_isVar(x) && m.has(x)) {
          if (_isUnknown(m.get(x)) && x === m.get(x)[1]) trivial = true
          return m.get(x) !== undefined ? m.get(x) : _onlyUndefined
        }
      })] = interrupt(closure)
      try {
        const r = !trivial ? finish(b) : _unknown(struct(closure, deconstruct(finish(b))))
        return r
      }
      catch (err) { if (err === interrupt) interrupt(closure, 2)(trivial, b);  throw err }
    },
  },

  _bindFunc:{
    txt:`Binds only the function body, with either a Map or a replacing function.`,
    call(f, ctx, rewrite, env) {
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
      return bound(binder, f, false, env, rewrite)
    },
  },

  _isFunction(x) { return typeof x == 'function' && _isArray(defines(x, deconstruct)) && defines(x, deconstruct)[0] === _function },

  _bindToUs(x) { if (x === _bindToUs.us) return _funcPlaceholder },

  _collectUnknownPromises(x) {
    if (_isUnknown(x)) {
      if (_isDeferred(x)) {
        (_collectUnknownPromises.record || (_collectUnknownPromises.record = [])).push(...x.slice(2))
        return x
      }
      return x[1]
    }
    return x
  },

  _function:{
    txt:`\`Input→Output\` or \`(function …Inputs Output)\`: specifies an arbitrary transformation of inputs into output. The result can be called (like \`(f …Data)\`), which assigns \`…Inputs\` to \`…Data\` (setting variables) then evaluates \`Output\`.
Equal input variables must be equal (so \`f f=(function x x 0)\` accepts \`(f 0 0)\` and \`(f 1 1)\`, but not \`(f 0 1)\`).
Variables within non-\`closure\` functions will not be changed by application.`,
    buzzwords:`graph pattern matching`,
    examples:[
      [
        `(0->1 1)`,
        `error 0 'cannot be assigned' 1`,
      ],
      [
        `f=(function x x 0) f 10 20`,
        `(error 'Non-matching graph: expected' 10 'for' x 'but got' 20)`,
      ],
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
        `(f "hi") f=a→a`,
        `"hi"`,
      ],
      [
        `(f 1 2) f=(function 1 3 5)`,
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
        `(1 2 x x x=?)→5`,
      ],
      [
        `^a->b ^c  a=(a b)  c=(c 10)`,
        `10`,
      ],
      [
        `x->a a=(0 x a) 5`,
        `a a=(0 5 a)`,
      ],
      [
        `function x y ((function a a 0) (0 1 x) (0 y 2)) x=? y=?`,
        `function 2 1 0`,
      ],
    ],
    merge:__is(`true`),
    finish(...inputs) {
      // Purify all inputs (and output).
      if (!inputs.length) error("Too few args. A function must always produce a result.")
      const us = finish.v
      let [i = 1, f, record, scope = new Map, inferred, escaped = _notFound] = interrupt(_function)
      if (f === undefined) f = inputs, f.unshift(_function)
      const prevInFunction = finish.inFunction, prevScope = finish.env[_id(label)], prevInferred = _assign.inferred
      finish.inFunction = 1, finish.env[_id(label)] = scope, _assign.inferred = inferred
      let skipped = false
      try {
        for (; i < f.length; ++i) {
          const isBody = i === f.length-1
          if (isBody) finish.inFunction = 2
          if (escaped === _notFound || f[i] === undefined)
            _bindToUs.us = us, escaped = _bindFunc(f[i], _bindToUs), _bindToUs.us = null
          // If we were in function, skip body purification since we'll likely be inlined anyway.
          if (!isBody || !prevInFunction)
            f[i] = purify(escaped)
          else f[i] = escaped, skipped = true
          escaped = _notFound
          if (_isUnknown(f[i])) {
            if (_isDeferred(f[i]))
              (record || (record = [])).push(...f[i].slice(2))
            f[i] = f[i][1]
          }
          if (!isBody && _hasCycles(f[i])) _assignVarsIn(f[i])
        }
        _collectUnknownPromises.record = record
        f = _bindFunc(f, undefined, _collectUnknownPromises)
        record = _collectUnknownPromises.record
        inferred = _assign.inferred
        if (record) return i = _unknown(f), i.push(...record), i

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
          // We could cache if shouldMerge (with care to not expose torn caching to other jobs), but we do not for simplicity.
        const impl = function impl(...data) {

          // Evaluate body if it's suddenly needed even though we were lazy.
          // (Even though `dec` and `f` are merged, they'll have become post-purification ones anyway if we weren't lazy.)
          if (!finish.inFunction && skipped)
            dec[dec.length-1] = f[f.length-1] = purify(f[f.length-1]), merge(dec), merge(f), skipped = false

          const prev = finish.env[_id(label)]
          let [labels = _allocMap(), stage = 0, a = data.length == 1 ? f[1] : f.slice(1,-1)] = interrupt(impl)
          finish.env[_id(label)] = labels
          try {

            switch (stage) {
              case 0:
                // Defer to the compiled version if we have already inferred everything.
                if (!finish.pure) {
                  if (impl.compiled === undefined)
                    impl.compiled = 0
                  else { // Only compile on the second visit.
                    if (impl.compiled >= 0)
                      impl.compiled = compile(_compileOpts(impl), ...f.slice(1)),
                      _id(impl), Object.freeze(impl)
                    if (typeof impl.compiled == 'function')
                      return impl.compiled(...data)
                  }
                }
                stage = 1
              case 1:
                // Interpret arg assignment.
                const r = _assign(a, data.length == 1 ? data[0] : data)
                if (_isUnknown(r)) error("Assignment should finish synchronously, or await")
                stage = 2
              case 2:
                // Interpret body.
                call.impure = false
                return finish(f[f.length-1])
            }
          } catch (err) { if (err === interrupt) interrupt(impl, 3)(labels, stage, a), labels = null;  throw err }
          finally {
            if (labels instanceof Map) labels.delete(f[f.length-1]), _allocMap(labels)
            finish.env[_id(label)] = prev
          }
        }
        impl.compiled = null
        f = _bindFunc(f, x => inferred && inferred.has(x) ? inferred.get(x) : x === _funcPlaceholder ? impl : undefined)
        if (f.length == 3 && _isVar(f[1]) && f[1] === f[2])
          return id
        if (call.cache && call.cache.has(f)) return call.cache.get(f)

        // Quote args if needed (cyclic structs aren't quoted).
        let dec = f.map((x, i, arr) => i && i < arr.length-1 && _hasCallableParts(x, true) ? struct(quote, x) : x)
        if (!skipped) dec = merge(dec)

        // Ensure that work doesn't have to be repeated pointlessly.
        if (call.cache && !skipped) call.cache.set(f, impl), call.cache.set(dec, impl)

        const d = impl[defines.key] = Object.create(null)
        d[_id(deconstruct)] = dec
        d[_id(inline)] = true
        if (shouldMerge) d[_id(merge)] = true
        if (_findRest(f.slice(1,-1)) === f.length-2)
          d[_id(argCount)] = f.length-2
        return impl
      } catch (err) { if (err === interrupt) interrupt(_function, 6)(i, f, record, scope)(_assign.inferred, escaped);  throw err }
      finally { finish.inFunction = prevInFunction, finish.env[_id(label)] = prevScope, _assign.inferred = prevInferred }
    },
    lookup:{
      purify:__is(`purify`),
      closure:__is(`closure`),
      const:__is(`const`),
      id:__is(`id`),
      try:__is(`_try`),
      argCount:__is(`argCount`),
    },
    philosophy:`Currying is garbage, just like any other representation method that imposes a semantically-visible artifact (like cons cells).`,
  },

  function:__is(`_function`),

  _isFunc(x) { return _isArray(x) && x[0] === _function },

  _isStruct(x) {
    // Returns whether evaluating `x` would never change the structure of `x` (whether head cannot be call/finisher).
    return !_isArray(x) || _isVar(x) || !_isArray(x[0]) && defines(x[0], finish) === undefined && defines(x[0], call) === undefined || _isArray(x[0]) && !_hasCallableParts(x[0])
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
            if (_isDeferred(A)) return _stage(struct(_assign, A[1], b), A)
            if (_isUnknown(A)) A = A[1]
            ++stage
          case 1:
            B = finish(b)
            if (_isUnknown(B)) return _stage(struct(_assign, _hasCycles(A) || _hasCallableParts(A, true) ? struct(quote, A) : A, B[1]), B)
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
          return _assign.env.get(a) !== b ? (!readonly ? error : errorFast)("Non-matching graph: expected", _assign.env.get(a), "for", a, "but got", b) : void(!readonly && finish.env[_id(label)].set(a, b))
        !_isVar(b) && _assign.env.set(a, b)

        if (_isUnknown(a) && !_isDeferred(a)) {
          if (!_isStruct(a[1])) throw impure
          if (_isVar(a[1])) a = a[1]
        }
        if (_isVar(a)) {
          // Set the value in the current label-environment.
          const m = finish.env[_id(label)]
          if (m.has(a)) {
            // Unify previous and new values.
            if (_isUnknown(b) && !_isDeferred(b)) {
              if (!_isStruct(b[1])) throw impure
              if (_isVar(b[1])) b = b[1]
            }
            if (a === b) return
            if (m.get(a) !== a)
              _assign(m.get(a), b, readonly), b !== a && _assign(b, m.get(a), readonly)
            if (finish.inFunction && (!_isUnknown(b) || _isDeferred(b) || !_isVar(b[1])))
              !readonly && m.set(a, bound(_assign.inferred, a))
          } else
            !readonly && m.set(a, b = !_isVar(b) ? b : _unknown(b))
          return
        }
        if (_isUnknown(b) && !_isDeferred(b)) {
          if (!_isStruct(b[1])) throw impure
          if (_isVar(b[1])) b = b[1]
        }
        if (_isVar(b)) {
          // If in args, infer that b must be a.
          if (readonly || a === b) return
          if (!finish.inFunction) error("Cannot infer outside of a function")
          if (!_assign.inferred) _assign.inferred = new Map
          if (_assign.inferred.has(b))
            return _assign.env.delete(a), _assign(a, _assign.inferred.get(b), readonly)
          let m
          const A = bound(x => {
            if (m && m.get(x) != null) return m.get(x)
            if (_isVar(x)) {
              if (m && m.get(x) == null) return
              !m && (m = new Map)
              const v = [label]
              !m.has(x) && m.set(x, v)
              m.set(v, null)
              _assign(x, v, readonly)
              return v
            }
          }, a)
          _assign.inferred.set(b, A)
          return
        }

        // If expecting a function, deconstruct both pattern and input.
        if (!_isArray(a) && _isArray(defines(a, deconstruct))) {
          if (_isArray(b) || !_isArray(defines(b, deconstruct)))
            (!readonly ? error : errorFast)(a, "cannot be assigned", b)
          a = deconstruct(a), b = deconstruct(b)
        }

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
            if (i < Rest) _assign(a[i], b[i], readonly)
            else if (i > Rest) _assign(a[i], b[i + b.length - a.length], readonly)
            else _assign(a[i][1], b.slice(i, i + b.length - a.length + 1), readonly)
          return
        }
        if (a !== b) (!readonly ? error : errorFast)(a, "cannot be assigned", b)
      }
      finally { _assign.inside = inside, !inside && _assign.env.clear() }
      // .inferred (a Map from variables to their inferred values), .env (a Map from a to b), .inside (false to the outside world)
    },
  },

  elem:{
    txt:`\`(elem TagName Content Extra)\`: creates an HTML DOM element.`,
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
    call(tag, content, extra) {
      if (typeof document == ''+void 0) return _isArray(content) ? content.join('') : content
      if (typeof tag == 'string' && content === undefined) return document.createElement(tag)

      const r = defines(tag, elem)
      if (typeof r == 'function') return r(tag, content, extra)

      if (typeof tag != 'string') error("Invalid elem tag:", tag)
      if (content != null && typeof content != 'string' && !_isArray(content) && !(content instanceof Node))
        errorStack("Invalid elem content:", content)
      const el = document.createElement(tag)
      _elemAppend.to = el
      _elemAppend(content)
      return el
    },
  },

  _elemAppend(ch) {
    // Out-of-document DOM append.
    if (_isArray(ch)) ch.forEach(_elemAppend)
    else if (ch && ch.parentNode && !ch.special) _elemAppend.to.append(elemClone(ch))
    else if (ch !== undefined) _elemAppend.to.append(ch)
  },

  elemClone(el) {
    // console.log('clone')
    const copy = el.cloneNode(false)
    if ('to' in el) elemValue(copy, el.to)
    if (el.special) copy.special = el.special, copy.special(el, copy)
    if (el.onchange) copy.onchange = el.onchange
    if (el.isWindow) copy.isWindow = true
    if (el.isREPL) copy.isREPL = true
    for (let ch = el.firstChild; ch; ch = ch.nextSibling)
      copy.appendChild(elemClone(ch))
    return copy
  },

  structured:{
    txt:`\`(structured Arrays)\`: shows deep structure of Arrays (consisting of acyclic arrays and strings and DOM elements): wraps each sub-array in \`<node>\`.`,
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
      const el = elem('span', _highlightGlobalsInString(a, s => lookup.parents.get(parse.ctx.get(label(s))) !== js ? elem('known', s) : s))
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
          if (n && _invertBindingContext(parse.ctx).has(f)) return set.add(f)
          if (++n > 9000) error('too big', [...set])
          if (set.has(f)) return; else set.add(f)
          if (defines(f, deconstruct)) f = deconstruct(f)
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

  sizeof:{
    txt:`\`(sizeof Global)\`: returns a global's approximate size, where namespace-parents get children added, and privates have their sizes distributed among users
\`(sizeof)\`: returns a hierarchy of sizes.`,
    call(g) {
      if (!sizeof.sz) {
        sizeof.sz = new Map
        const bonus = new Map
        parse.ctx.forEach((v,k) => fill(v, k[1][0] === '_'))
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
    txt:`Just some approximation. Wraps potential references to globals in <known>.
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
        parse.ctx.forEach((v,k) => regexSrc.push(k[1].replace(/[^_a-zA-Z0-9]/g, s => '\\'+s)))
        regexSrc.sort((a,b) => b.length - a.length)
        regexSrc.push('//.+', '/\\*[^]+?\\*/')
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
          if (r[0] === "'" && r.slice(-1) === "'" || r[0] === '"' && r.slice(-1) === '"')
            !noResult && (el = elem('string', r))
          else
            el = wrapper(r), typeof document != ''+void 0 && el instanceof Element && parse.ctx.has(label(r)) && elemValue(el, parse.ctx.get(label(r)))
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
    txt:`An overridable-by-language function that turns {{a serialize/parse node}, {its value}, and {unbound representation}} into a displayed node.`,
    call(s,v,u) { return s },
  },

  nameResult:{
    txt:`\`(nameResult Expr)\`: provides a list of suggestions for naming Expr. Used in \`serialize\` for more human-readable graph serializations.`,
    call(func) { return typeof func == 'string' && +func !== +func && func.length < 20 && !/\s/.test(func) ? [func] : _isArray(defines(func, nameResult)) ? defines(func, nameResult) : typeof defines(func, nameResult) == 'string' ? [defines(func, nameResult)] : null },
  },

  serialize:{
    txt:`\`(serialize Expr)\` or … or \`(serialize Expr Language Bindings Options)\`: serializes Expr into a string or a DOM tree (that can be parsed to retrieve the original structure).`,
    philosophy:`Options must be undefined or a JS object like { style=false, collapseDepth=0, collapseBreadth=0, maxDepth=∞, offset=0, offsetWith='  ', space=()=>' ', nameResult=false, deconstructPaths=false, deconstructElems=false }.

In theory, having symmetric parse+serialize allows updating the language of written code via "read in with the old, write out with the new", but we don't curently do that here.`,
    examples:[
      [
        `serialize ^(parse '12')`,
        `"parse '12'"`,
      ],
    ],
    lookup:{
      nameResult:__is(`nameResult`),
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

      if (!lang) lang = fancy
      const styles = opt && opt.style && defines(lang, style) || undefined

      const backctx = _invertBindingContext(serialize.ctx = ctx || parse.ctx)
      const deconstruction = new Map
      const named = new Set
      const lengths = new Map
      const boundToUnbound = new Map
      const unboundToBound = new Map
      arr = deconstructed(arr)
      deconstruction.clear()

      let n = 0
      const freeNames = []
      const nodeNames = styles && typeof document != ''+void 0 && new Map
      backctx.forEach((v,k) => boundToUnbound.set(k,k))
      const u = unbound(arr, nameAllocator, boundToUnbound, maxDepth)
      boundToUnbound.forEach((u,v) => {
        if (v === u) return
        if (unboundToBound.has(v)) v = unboundToBound.get(v)
        ;(!unboundToBound.has(u) || !_isArray(v)) && unboundToBound.set(u, v)
      })
      boundToUnbound.clear()
      if (breakLength) breakLength -= offset * offsetWith.length

      let struct = [], len = 0
      emit(defines(lang, serialize), u)
      if (_isArray(struct) && struct.length == 1) struct = struct[0]

      return recCollapse(serializeLines(struct, offset))

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
        else return console.log("Unknown type to emit:", f, _id(f)), emit(_colored(elemValue(elem('number', '<< id:'+_id(f)+' >>'), _id(f)), 4, 24))
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
        if (_isArray(u) && u[0] === bound && u[1] instanceof Map && u.length == 3) u = u[2]
        if (typeof document != ''+void 0 && u instanceof Element && 'to' in u)
          return u.to
        if (backctx.has(u)) return u
        if (unboundToBound.has(u)) return unboundToBound.get(u)
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
        const el = styles(str, v, u, ctx || parse.ctx)
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
        if (backctx && backctx.has(x)) return unboundToBound.set(x,x), named.add(backctx.get(x)), x
        const original = x
        if (deconstructElems || !_isDOM(x))
          if (!_isArray(x) && typeof x != 'string' && typeof x != 'number' && (!backctx || !backctx.has(x)))
            x = deconstruct(x, !deconstructPaths)
        if (styles && typeof document != ''+void 0 && _isFunc(x)) {
          // Bind labels inside a func to the same (new) element.
          const styled = new Map
          x = _bindFunc(x, x => {
            if (_isLabel(x) && !styled.has(x))
              styled.set(x, styleLabel(x[1], x, [label, x[1]])), unboundToBound.set(styled.get(x), x)
            return styled.get(x)
          })
        }
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
                _cameFrom(copy, x)
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
    txt:`If el, remember that it is a viewer of v. If !el, return an array of all in-document viewers of v.`,
    call(el, v) {
      if (!elemValue.empty) elemValue.empty = []
      if (typeof document == ''+void 0) return elemValue.empty
      if (_isArray(v) && v[0] === quote && v.length == 2) v = v[1]
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
    } catch (err) { if (err === interrupt) interrupt(_revisitElemValue, 1)(ch);  throw err }
  },

  _valuedColor(v) {
    // Returns v's previously displayed element color (for highlighting of the same things) or a new one.
    if (!_valuedColor.enabled) return 'var(--main)'
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
    const min = 64, max = 384, Sum = colors[0]+colors[1]+colors[2]
    if (Sum < min) colors[0] *= min/Sum, colors[1] *= min/Sum, colors[2] *= min/Sum
    if (max < Sum) colors[0] *= max/Sum, colors[1] *= max/Sum, colors[2] *= max/Sum
    const c = 'rgb(' + colors + ')'
    _valuedColor.m.set(v, c)
    _limitMapSize(_valuedColor.m, 100000)
    return c

    // .enabled
  },

  _extracted:{
    txt:`ONLY for parsing \`c=x\`.`,
  },

  parse:{
    txt:`\`(parse String)\` or … or \`(parse String Language Bindings Options)\`: parses String into the graph represented by it, returning \`(Expr StyledInput)\`.`,
    philosophy:`Options is a JS object like { style=false, sourceURL='' }.
And parsing is more than just extracting meaning from a string of characters (it's also styling and associating source positions).`,
    call(str, lang, ctx, opt) {
      if (typeof str == 'string') str = str ? [str] : []
      if (_isDOM(str)) str = _innerText(str) // Don't even attempt to cache subtrees lol
      if (typeof str != 'string' && !_isArray(str)) throw 'Expected a string'
      if (!str.length) throw 'Expected input'
      if (ctx === undefined) ctx = parse.ctx

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
          if (sourceURL && _isArray(r)) lines.set(r, startLine), columns.set(r, startColumn)
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

      let lines = sourceURL && new Map, columns = sourceURL && new Map

      const u = !lang ? match(parser.topLevel) : match(defines(lang, parse))
      if (localI < str.length) throw 'Superfluous characters at the end: ' + (typeof localS == 'string' ? localS.slice(i - curBegin) : '···')

      // Do binding with the original⇒copy map preserved so that we can style structure bottom-up properly.
      const env = (styles || sourceURL) && new Map
      const b = styles || sourceURL ? bound(ctx, u, true, env) : bound(ctx, u, true)
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
    txt:`When matched in \`parse\` rules, represents a value that should be preserved as-is (as it likely comes from a special DOM element/reference).`,
  },

  _basicEscapeLabel(s) { return s && !/[=!:\s\(\)\[\]\{\}→>\+\-\*\/\&\|\.'"`\,\\\ue000-\uf8ff]/.test(s) ? s : '`' + s.replace(/`/g, '``') + '`' },

  _basicUnescapeLabel(s) { return s[0] === '`' ? s.slice(1,-1).replace(/``/g, '`') : s },

  _basicLabel(match, u) { // a, qwer, `a`; 12, 1e6
    const legal = /-?(?:[0-9]e-|[0-9]E-|[^=!:\s\(\)\[\]\{\}→>\+\-\*\/\&\|\.'"`\,\\\ue000-\uf8ff]|\.[0-9])+/y
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

  _basicExtracted(match, u, value) { // c=x
    if (u === _specialParsedValue) {
      const key = match(value)
      if (key !== undefined && match(/\s*=\s*/y)) {
        const v = match(value)
        v === undefined && match.notEnoughInfo("Expected an actual value to be extracted")
        return [_extracted, key, v]
      } else return key
    }
    if (_isArray(u) && u[0] === _extracted && u.length == 3)
      match(value, u[1]), match('='), match(value, u[2])
    else match(value, u)
  },

  _basicMany(match, u, value, head) { // a b c c=x
    if (u === _specialParsedValue) {
      const arr = !head ? [] : [head]
      let ctx
      while (true) {
        match(/\s+/y)
        const v = match(_basicExtracted, value)
        if (v === undefined) break
        if (_isArray(v) && v[0] === _extracted)
          (ctx || (ctx = new Map)).set(v[1], v[2])
        else arr.push(v)
      }
      if (ctx) return struct(bound, ctx, arr)
      return arr
    }
    if (!_isArray(u)) throw "Must be an array"
    let ctx
    if (_isArray(u) && u[0] === bound && u[1] instanceof Map && u.length == 3)
      ctx = u[1], u = u[2]
    _fancyGrouping.pos.delete(match())
    for (let b = false, j = !head ? 0 : 1; j < u.length; ++j) {
      b ? match(' ') : (b = true)
      match(_basicExtracted, u[j], value)
    }
    if (ctx) ctx.forEach((v,k) => (match(' '), match(_basicExtracted, [_extracted, k, v], value)))
  },

  _basicCall(match, u, value) { // (a b c c=x)
    if (u === _specialParsedValue) {
      if (!match('(')) return
      const arr = _basicMany(match, u, value)
      if (!match(')')) match.notEnoughInfo('Expected a closing bracket')
      return arr
    }
    if (!_isArray(u)) throw "A call must be an array"
    match('('), _basicMany(match, u, value), match(')')
  },

  _fancyMap(match, u, value) { // {a b c c=x}
    if (u === _specialParsedValue) {
      if (!match('{')) return
      const arr = _basicMany(match, u, value, label('map'))
      if (!match('}')) match.notEnoughInfo('Expected a closing bracket')
      return arr
    }
    match('{'), _basicMany(match, u, value, _unctx('map')), match('}')
  },

  _basicValue(match, u, call, value) { // String or label or call.
    const isEm = value === _fancyOutermost
    if (u === _specialParsedValue) {
      if (isEm && match('?')) return [label('label')]
      if (isEm && match('#')) return [label('const')]
      let r
      if ((r = match(_specialParsedValue)) !== undefined) return r
      if ((r = match(_basicString)) !== undefined) return r
      if ((r = match(_basicLabel)) !== undefined) return r
      if (isEm && (r = match(_fancyMap, value)) !== undefined) return r
      if ((r = match(call, value)) !== undefined) return r
      return
    }
    else if (isEm && _isArray(u) && u[0] === label && u.length == 1)
      match('?')
    else if (isEm && _isArray(u) && u[0] === _const && u.length == 1)
      match('#')
    else if (typeof u == 'string')
      match(_basicString, u)
    else if (typeof u == 'number')
      match(_basicLabel, u)
    else if (_isLabel(u))
      match(_basicLabel, u)
    else if (_isArray(u) && u[0] === _extracted && u.length == 3)
      match(_basicExtracted, u, value)
    else if (_isArray(u) && u[0] === _unctx('map'))
      match(_fancyMap, u, value)
    else if (_isArray(u))
      match(call, u, value)
    else match(u)
  },

  _needsGrouping(match) { return _fancyGrouping.pos && _fancyGrouping.pos.has(match()) },

  _emitGrouping(match, need) {
    if (need === undefined)
      return _needsGrouping(match) ? (match('['), true) : false
    if (need) match(']')
  },

  _fancyGrouping(match, u, topLevel) { // [x]
    if (u === _specialParsedValue) {
      if (!match(/\s*\[\s*/y)) return _basicValue(match, u, _basicCall, _fancyOutermost)
      const r = _basicMany(match, u, _fancyOutermost)
      if (r === undefined || !r.length) match.notEnoughInfo('Expected a value to group')
      if (!match(/\s*\]\s*/y)) match.notEnoughInfo("Expected a closing grouping bracket")
      return r.length == 1 ? r[0] : r
    }
    if (!_fancyGrouping.pos) _fancyGrouping.pos = new Set
    const pos = match()
    if (_fancyGrouping.pos.has(pos)) {// Emit base if the second pass is over.
      return _basicValue(match, u, !topLevel ? _basicCall : _basicMany, _fancyOutermost)
    }
    _fancyGrouping.pos.add(pos)
    try { // Do a second pass. It's not fast, but `fast` exists to make that not a problem.
      return match(_fancyOutermost, u, topLevel)
    } finally { _fancyGrouping.pos.delete(pos) }
  },

  _fancyLookup(match, u, topLevel) { // obj.key
    if (u === _specialParsedValue) {
      let obj = match(_fancyGrouping)
      if (obj === undefined) return
      while (match(/\s*\.(?!\.\.)\s*/y)) {
        let key = match(_basicLabel)
        if (key === undefined) obj = struct(label('lookup'), obj)
        else obj = struct(label('lookup'), obj, _isLabel(key) ? key[1] : key)
      }
      return obj
    }
    if (_isArray(u) && u[0] === _unctx('lookup') && (u[2] === undefined || typeof u[2] == 'number' || typeof u[2] == 'string')) {
      const g = _emitGrouping(match)
      _fancyLookup(match, u[1]), match('.')
      if (u[2] !== undefined) match(_basicLabel, typeof u[2] == 'string' ? label(u[2]) : u[2])
      _emitGrouping(match, g)
    } else match(_fancyGrouping, u, topLevel)
  },

  _fancyRest(match, u, topLevel) { // …a, ...a; ^a
    if (u === _specialParsedValue) {
      if (match('…') || match('...')) {
        const r = match(_fancyLookup)
        r === undefined && match.notEnoughInfo('Expected the rest')
        return struct(label('rest'), r)
      }
      if (match('^')) {
        const r = match(_fancyRest)
        r === undefined && match.notEnoughInfo('Expected the quoted value')
        return struct(label('quote'), r)
      }
      return match(_fancyLookup)
    }
    let g
    if (_isArray(u) && u[0] === _unctx('rest') && u.length == 2)
      g = _emitGrouping(match), match('…'), match(_fancyLookup, u[1]), _emitGrouping(match, g)
    else if (_isArray(u) && u[0] === _unctx('quote') && u.length == 2)
      g = _emitGrouping(match), match('^'), match(_fancyRest, u[1]), _emitGrouping(match, g)
    else match(_fancyLookup, u, topLevel)
  },

  _fancyMultDiv(match, u, topLevel) { // a*b, a/b
    if (u === _specialParsedValue) {
      let a = match(_fancyRest), op
      if (a === undefined) return
      while (op = match(/(\s*)(?:\*|\/)\1/y)) {
        const b = match(_fancyRest)
        b === undefined && match.notEnoughInfo('Expected the second arg of +')
        a = struct(label(op.trim() === '*' ? 'mult' : 'divide'), a, b)
      }
      return a
    }
    let g
    if (_isArray(u) && u.length == 3 && (u[0] === _unctx('mult') || u[0] === _unctx('divide')))
      g = _emitGrouping(match),
      match(_fancyMultDiv, u[1]), match(u[0] === _unctx('mult') ? '*' : '/'), match(_fancyRest, u[2]),
      _emitGrouping(match, g)
    else match(_fancyRest, u, topLevel)
  },

  _unctx(s) { return serialize.ctx.get(label(s)) },

  _fancySumSub(match, u, topLevel) { // a+b, a-b
    if (u === _specialParsedValue) {
      let a = match(_fancyMultDiv), op
      if (a === undefined) return
      while (op = match(/(\s*)(?:\+|-(?!>))\1/y)) {
        const b = match(_fancyMultDiv)
        b === undefined && match.notEnoughInfo('Expected the second arg of '+op)
        a = struct(label(op.trim() === '+' ? 'sum' : 'subtract'), a, b)
      }
      return a
    }
    let g
    if (_isArray(u) && u.length == 3 && (u[0] === _unctx('sum') || u[0] === _unctx('subtract')))
      g = _emitGrouping(match),
      match(_fancySumSub, u[1]), match(u[0] === _unctx('sum') ? '+' : '-'), match(_fancyMultDiv, u[2]),
      _emitGrouping(match, g)
    else match(_fancyMultDiv, u, topLevel)
  },

  _matchOperator(match, u, base, str, parseOp, serializeOp, topLevel) { // a OP b
    if (u === _specialParsedValue) {
      const v = match(base)
      if (v === undefined) return
      if (match(parseOp)) {
        const t = match(base)
        t === undefined && match.notEnoughInfo('Expected the type')
        return struct(label(str), v, t)
      }
      return v
    }
    let g
    if (_isArray(u) && u[0] === _unctx(str) && u.length == 3)
      g = _emitGrouping(match),
      match(base, u[1]), match(serializeOp), match(base, u[2]),
      _emitGrouping(match, g)
    else match(base, u, topLevel)
  },

  _fancyTyped(match, u, topLevel) { // v:t
    return _matchOperator(match, u, _fancySumSub, 'typed', /(\s*):\1/y, ':', topLevel)
  },

  _fancyFirst(match, u, topLevel) { // a\b\c
    return _matchSequence(match, u, topLevel, _fancyTyped, 'first', /\s*\\\s*/y, '\\')
  },

  _fancyLast(match, u, topLevel) { // a,b,c
    return _matchSequence(match, u, topLevel, _fancyFirst, 'last', /\s*\,\s*/y, ',')
  },

  _fancyArrowFunc(match, u, topLevel) { // a→b, a->b
    if (u === _specialParsedValue) {
      const a = match(_fancyLast)
      if (a === undefined) return
      if (match(/\s*(?:→|->)\s*/y)) {
        const b = match(_fancyClosure)
        b === undefined && match.notEnoughInfo('Expected the body of an arrow function')
        return struct(label('function'), a, b)
      }
      return a
    }
    let g
    if (_isArray(u) && u[0] === _unctx('function') && u.length == 3)
      g = _emitGrouping(match),
      match(_fancyLast, u[1]), match(typeof document != ''+void 0 ? '→' : '->'), match(_fancyClosure, u[2]),
      _emitGrouping(match, g)
    else match(_fancyLast, u, topLevel)
  },

  _fancyClosure(match, u, topLevel) { // !f, !a→b
    if (u === _specialParsedValue) {
      if (match('!')) {
        const r = match(_fancyArrowFunc)
        return r !== undefined ? struct(label('closure'), r) : undefined
      }
      return match(_fancyArrowFunc)
    }
    let g
    if (_isArray(u) && u[0] === _unctx('closure') && u.length == 2)
      g = _emitGrouping(match),
      match('!'), match(_fancyArrowFunc, u[1]),
      _emitGrouping(match, g)
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

  _fancyTry(match, u, topLevel) { // a|b|c
    return _matchSequence(match, u, topLevel, _fancyClosure, 'try', /\s*\|\s*/y, '|')
  },

  _fancyOutermost(match, u, topLevel) {
    let ctx, needsGrouping = !topLevel || match()
    if (_isArray(u) && u[0] === bound && u[1] instanceof Map && u.length == 3)
      ctx = u[1], u = u[2], needsGrouping && match('[')
    const r = _fancyTry(match, u, topLevel)
    if (ctx) ctx.forEach((v,k) => (match(' '), match(_basicExtracted, [_extracted, k, v], _fancyTry))), needsGrouping && match(']')
    return r
  },

  _basicOutermost(match, u) { return _basicValue(match, u, _basicCall, _basicOutermost) },

  _fancyTopLevel(match, u) { // (f); a b c c=x; a=b
    if (u === _specialParsedValue) {
      let arr = _basicMany(match, u, _fancyOutermost)
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

  _basicTopLevel(match, u) { // (f); a b c c=x; a=b
    if (u === _specialParsedValue) {
      let arr = _basicMany(match, u, _basicOutermost)
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
    return _basicMany(match, !_isArray(u) || u.length <= 1 ? [u] : u, _basicOutermost)
  },

  basic:{
    txt:`A language for ordered-edge-list graphs. Text, numbers, structures, and connections.
\`label\`, \`'string'\`, \`"string"\`, \`(0 1)\`, \`(a=2 a)\`.
This is a {more space-efficient than binary} representation for graphs of arrays.`,
    buzzwords:`homoiconic`,
    style:__is(`_basicStyle`),
    parse:__is(`_basicTopLevel`),
    serialize:__is(`_basicTopLevel`),
    REPL:`\`(txt)\` for {all functionality}, \`(examples)\` for {all tests}.`,
    insertLinkTo:__is(`_basicLinkTo`),
    _escapeLabel:__is(`_basicEscapeLabel`),
    _unescapeLabel:__is(`_basicUnescapeLabel`),
  },

  fancy:{
    txt:`A language for ordered-edge-list graphs (like \`basic\`) with some syntactic conveniences.
\`label\`, \`'string'\`, \`"string"\`, \`(0 1)\`, \`(a=2 a)\`; \`1+2\`, \`x→x*2\`, \`2*[1+2]\`.`,
    style:__is(`_basicStyle`),
    parse:__is(`_fancyTopLevel`),
    serialize:__is(`_fancyTopLevel`),
    REPL:`\`(docs)\` for {all functionality}, \`(examples)\` for {all tests}.`,
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
        `1+2 sum='Sum'`,
        `'Sum' 1 2`,
        true
      ],
      [
        `1:2 typed='Typed'`,
        `'Typed' 1 2`,
        true
      ],
      [
        `![1+2] closure=quote sum=mult`,
        `1*2`,
        true
      ],
    ],
  },

  _basicLinkTo(r, el) {
    // Create a name not seen in editor, replace el with name, insert newline and name and '=' and el at editor's end, and return a name element.
      // × (1 2 3)  ⇒  a a  a=(1 2 3)
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
      const v = quote(el.to)
      const proposals = _isArray(v) && typeof v[0] == 'function' && nameResult(v[0]) || []
      while (names.has(name = i < proposals.length ? proposals[i] : toString(i - proposals.length, 'abcdefghijklmnopqrstuvwxyz'))) ++i
      const topLevel = el.parentNode === editor || el.parentNode.parentNode === editor
      rBecomes = document.createTextNode(name)
      r.deleteContents(), r.insertNode(rBecomes), r.setEndAfter(rBecomes)
      el.replaceWith(elBecomes = document.createTextNode(name))
      if (_isArray(v) && v.length > 1 && topLevel && el.firstChild.textContent[0] !== '(')
        el = elem('node', ['(', el, ')'])
      editor.append('\n'+name+'=', el)
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
      const legal = /[=!:\s\(\)→>\+\-\*\/\&\|]/
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
    if (typeof document != ''+void 0 && (_isArray(v) && v[0] === map && v.length > 3 || v instanceof Map && v.size > 1 && s.length > 1)) {
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
        if (_isArray(v)) elemValue(row, struct(rest, struct(v[++a], v[++a])))
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
    if (hasOperators && typeof document != ''+void 0)
      el.classList.add('hasOperators')
    if (_isLabel(u) && typeof document != ''+void 0)
      el.style.color = _valuedColor(v), el.classList.add('label')
    else if (_isLabel(u))
      el = _colored(el, [34, 36, 35][randomNat(3)]) // Cycle through blue, cyan, magenta.
    if (typeof document != ''+void 0)
      el.title = _isArray(v) && v.length && backctx.has(v[0]) ? backctx.get(v[0]) : ''
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
        `fast.parse '(a=(b) b=(a) a)'`,
        `a a=((a))`,
      ],
      [
        `fast.parse (fast.serialize ^(a b a=(b) b=(a)))`,
        `a b a=(b) b=(a)`,
      ],
      [
        `fast.serialize ^(a b a=(b) b=(a)) undefined (jsEval '{humanReadableMode:true}')`,
        `'(&0=(&1) &1=(&0) (&0 &1))'`,
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
        const regex = /[ \n]+|=|!|\(|\)|`(?:[^`]|``)*`|'(?:[^']|'')*'|"(?:[^"]|"")*"|[^ \n=!\(\)'"`]+|$/g
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
          while (i < str.length && str[i] !== '=' && str[i] !== ')') {
            const v = getValue()
            if (str[i] === '=') {
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
          if (str[i] === '=') return name
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
            nextToken()
            const prev = finish.noSystem; finish.noSystem = true
            if (!interrupt.started || _timeSince(interrupt.started) > 20)
              interrupt.started = _timeSince()
            try { return purify(getValue()) }
            finally { finish.noSystem = prev }
          }
          if (str[i] === '(') return getCall()
          if (str[i] === '=' || str[i] === ')') return
          const I = i, J = j;  nextToken()
          if (str[I] === "'" && str[J-1] === "'") return str.slice(I+1,J-1).replace(/''/g, "'")
          if (str[I] === '"' && str[J-1] === '"') return str.slice(I+1,J-1).replace(/""/g, '"')
          if (str[I] === '`' && str[J-1] === '`') return labelLookup(str.slice(I+1,J-1).replace(/``/g, '`'))
          return labelLookup(str.slice(I,J))
        }
      },
      serialize(expr, ctx, opt) {
        // Walk expr and name all referenced-more-than-once nodes, then output them then expr.
        // Unlike `basic`, here we mark everything that defines `deconstruct` with `!…` (finish-this), for perfect reconstruction.

        const humanReadableMode = opt && opt.humanReadableMode
        const preserveReadings = opt ? opt.preserveReadings : true

        const backctx = _invertBindingContext(ctx || parse.ctx)
        const visited = new Set, names = new Map, deconstruction = new Map
        let n = 0
        mark(expr)
        visited.clear()
        const result = []
        result.push('(')
        names.forEach((named,arr) => (result.push(named, '='), putValue(arr, true), result.push(' ')))
        putValue(expr)
        result.push(')')
        return result.join('')

        function name(v) { names.set(v, humanReadableMode || n > 0xe000 ? '&'+(n++).toString(36) : String.fromCharCode(128 + ++n)) }
        function mark(arr) {
          if (typeof arr == 'number' && (''+arr).length < 3) return
          if (visited.has(arr)) return !names.has(arr) && name(arr); else visited.add(arr)
          if (deconstruction.has(arr)) arr = deconstruction.get(arr)
          if (backctx.has(arr)) return
          if (preserveReadings && _read.marks && _read.marks.has(arr)) mark(_read.marks.get(arr))
          if (!_isArray(arr)) {
            if (typeof arr == 'string' || typeof arr == 'number') return
            if (arr instanceof Map || defines(arr, deconstruct))
              deconstruction.set(arr, deconstruct(arr)), arr = deconstruction.get(arr)
            else throw "Cannot serialize a not-`deconstruct`ible not-an-array"
          }
          if (!_isArray(arr)) throw "All values must be string/number or Map or array or deconstruct to an array"
          if (arr[0] === label && typeof arr[1] === 'string' && arr.length == 2) {
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
            if (/[ \n=!:\(\)'"`]/.test(v[1])) return result.push('`' + v[1].replace(/`/g, '``') + '`')
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
          r.set(interrupt, r[_id(interrupt)].map(x => x instanceof Map ? new Map(x) : !_isArray(x) || _wasMerged(x) || _read.marks && _read.marks.has(x) ? x : x.slice()))
        Object.seal(r)
        return r
      } else
        Object.assign(finish.env, r)
    },
  },

  _causeInterrupt(cause, toReEnter = undefined) {
    finish.env[_id(step)] = _checkInterrupt.step
    finish.env[_id(_checkInterrupt)] = cause
    finish.env[_id(finish)] = finish.depth
    if (toReEnter) _jobs.reEnter = toReEnter
    throw interrupt
  },

  _checkInterrupt:{
    txt:`Checks whether an interrupt is appropriate right now.`,
    call(cause) {
      if (interrupt.noInterrupt) return
      if (!finish.env[_id(interrupt)] || !finish.env[_id(interrupt)].length) {
        // If we stepped enough (ensuring progress), and either we have worked for 10 ms or the nesting depth is as wanted by _pausedToStepper, interrupt.
        if (finish.env[_id(step)])
          --finish.env[_id(step)], ++_checkInterrupt.step
        else if (finish.env[_id(_pausedToStepper)] !== undefined && finish.depth <= finish.env[_id(_pausedToStepper)])
          _causeInterrupt(cause, _pausedToStepper)
        else if (_timeSince(interrupt.started, true) > 10)
          ++_checkInterrupt.step, _causeInterrupt(cause) // Ensure progress.
        else _checkInterrupt.step = 0
      }
      // .step (the counter of interrupt checks, for fully consistent restoration)
    },
  },

  step:{
    txt:`\`(step Expr)\`: pauses execution and displays stepping interface to the user, then evaluates Expr.`,
    examples:[
      [
        `step 1*2+3*4+5*6+7*8+9*10+11*12+13*14`,
      ],
    ],
    finish(expr) {
      let [int = true] = interrupt(step)
      try {
        if (int) int = false, _causeInterrupt(expr, _pausedToStepper)
        if (int === false) ++_checkInterrupt.step, int = 0
        return finish(expr)
      } catch (err) { if (err === interrupt) interrupt(step, 1)(int);  throw err }
    },
    merge:true,
  },

  _pausedToStepper:{
    txt:`Pauses a job and displays its stepping interface: ▶ ▲ ⇉ ▼.
Not for use inside that paused job.
(Technically, we could use \`_continuation\` to save/restore execution states, and also have per-cause breakpoints, and also have a way of inspecting function state when interpreting, but debuggers are dime-a-dozen anyway, so who cares.)`,
    call(expr, env, then, ID, before = env[_id(log)] || Self.into) {
      _cancel(ID)
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
        elemValue(el, [expr, env, then, ID])
      before.style.display = 'none'
      elemInsert(before.parentNode, el, before)

      function onClick(n) {
        // Show style, remove interface, remember to interrupt again, and re-schedule the job.
        _cancel(ID)
        justRun.onclick = lessDepth.onclick = eqDepth.onclick = moreDepth.onclick = null
        before.style.removeProperty('display')
        el.remove() // (Not very efficient, destroying and re-creating the DOM for each step, but it works.)
        env[_id(_pausedToStepper)] = n !== undefined ? env[_id(finish)]+n : undefined
        _schedule(expr, env, then, ID)
      }
    },
  },

  interrupt:{
    txt:`Used to make functions re-entrant in a non-interruptible host language, for better UX.`,
    lookup:{
      check:__is(`_checkInterrupt`),
      noInterrupt:__is(`noInterrupt`),
      continuation:__is(`_continuation`),
      step:__is(`step`),
    },
    philosophy:`Termination checking (totality) is unnecessary if the host can just interrupt and continue. In fact, it is harmful to provide a false assurance of everything terminating {in reasonable time}.
Interruption (and sandboxing) is absolutely essential for being able to actually use a program comfortably, and for stepping through the program, but no one buzzes about it. Probably because almost all rely on the OS to provide it via processes, and/or heuristic-based totality guarantees.

Technical details:
\`_causeInterrupt(cause)\` to interrupt execution.
Create function state in \`f\` like \`let [i = 0, j = 0] = interrupt(f)\`, in particular for loops. Make sure to put interruptible computations not here but inside the try/catch below, to not corrupt interrupt state.
Wrap function body in \`try{…}catch(err){ if (err === interrupt) interrupt(f,2)(i,j);  throw err }\`: store 4 values in tmp at a time, up to the requested length (\`...args\` in JS allocates, so this way tries to avoid that).`,
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
          // Stack corruption.
          const backctx = _invertBindingContext(parse.ctx)
          const str = "expected "+backctx.get(cause)+" but got "+backctx.get(got)
          localStorage.setItem(str, (+localStorage.getItem(str) || 0) + 1)
          const tmpSlice = tmp.slice()
          tmp.length = 0
          errorStack("Interrupt stack corruption sometime before this — invalid cause: expected", cause, "but got", got, "in", stack, "with tmp", tmpSlice)
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

      // .tmp, .populate, .noInterrupt
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
    txt:`\`(journal Func …Args)\`: virtualizes writes during \`Func\`'s call. Returns a journal that can be passed to peekResult or commit.
(Note: kind of superseded by \`journalMeasures\` and the like.)`,
    argCount:1,
    call(f, ...args) {
      let [j = new Map] = interrupt(journal)
      const prev = finish.env[_id(journal)];  finish.env[_id(journal)] = j
      try { return [undefined, f.apply(f, args), j] }
      catch (err) { if (err === interrupt) interrupt(journal, 1)(j);  throw err }
      finally { finish.env[_id(journal)] = prev }
    },
    lookup:{
      read:__is(`_read`),
      peek:__is(`peekResult`),
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
    txt:`\`Value:Type\` or \`(typed Value Type)\`: specifies that the value definitely fits the type.
Since we currently inline everything, specifying types of function args allows to see either the final type of body or the error.`,
    examples:[
      [
        `1:2->2:3  1:2`,
        `2:3`,
      ],
      `Values and types can be mixed and computed freely:`,
      [
        `1:a->a:Type  1:2  Type=#`,
        `2:#`,
      ],
      [
        `a:b->a+1:b+1  1:2`,
        `2:3`,
      ],
      `Partial evaluation with inlining propagates and infers types as a side-effect:`,
      [
        `Int = 'Int'
Sum = (function  a:Int  b:Int  a+b:Int)
Mult = (function  n:Int  m:Int  n*m:Int)
x = ?:Int
x -> (Sum x (Mult x x))`,
        `x:Int→x+x*x:Int x=? Int='Int'`,
        true
      ],
      [
        `Int = 'Int'
Sum = (function  a:Int  b:Int  a+b:Int)
Mult = (function  n:Int  m:Int  n*m:Int)
x -> (Sum x (Mult x x))`,
        `x:Int→x+x*x:Int x=? Int='Int'`,
        true
      ],
      [
        `Int = 'Int'
Sum = (function  a:Int  b:Int  a+b:Int)
Mult = (function  n:Int  m:Int  n*m:Int)
x -> (Sum x (Mult 20:Int 2:Int))`,
        `x:Int→x+40:Int x=? Int='Int'`,
        true
      ],
    ],
    buzzwords:`gradually dependently typed`,
    argCount:2,
    philosophy:`This is not handled specially whatsoever (because constructions turned out to be more fundamental than types), and is pattern-matched as any other array, but it still allows dependent types (as long as only trusted-to-be-correct-for-an-application functions are used).
Self is not a theorem-proving tool, and does not have features that get in the way of regular programming, like ensuring totality.
Correctness is defined per usage context (see \`get\`). It is not an evident-by-itself thing; on the same base, infinitely many interpretations can be constructed.`,
    merge:__is(`true`),
  },

  Garbage:{
    txt:`It's a nice thought, but it doesn't play well with others.`,
    lookup:{
      philosophy:__is(`philosophy`),
      enumerableTypes:__is(`enumerableTypes`),
      fromBase64:__is(`fromBase64`),
      toBase64:__is(`toBase64`),
      journal:__is(`journal`),
    },
  },

  _lineCount(str) {
    if (typeof str == 'number') return 0
    let i = 0, n = 0
    while ((i = str.indexOf('\n', i)+1) > 0) ++n
    return n
  },

  Rewrite:{
    txt:`A namespace for rewriting Self's code to a different form.`,
    lookup:{
      extension:__is(`ToExtension`),
      readableJS:__is(`ToReadableJS`),
      scopedJS:__is(`ToScopedJS`),
    },
    philosophy:`Writing the system's code in a special style allows it to be viewed/modified in the system by the user, preserving anything they want in the process without external storage mechanisms.
The correctness of quining of functions can be tested by checking that the rewrite-of-a-rewrite is exactly the same as the rewrite.`,
  },

  BrowserIconURL:`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAHaElEQVR4XuWbW8htUxTHnQ4P7l7Eg0KRu3POC5E4yp04lBRhh3g5cin3S1/ul3KJFye0ESXlIHfKcRLx4n6LQnkgL+4eEP/fao6vuec317ysvfb+6tujRnvtucYaY86xxphzjDHnWrZJO+yvW3PCkxM03LpQeH+C5kzdO0T4jfAL4bfCD1roV6l9Z+Gewl2FbwkfS/Beq3v3Zfq33o3joxjdspaHL1P7HRnG3L5SeHuE7lC1rREe6wYDyeXCOwt4QuLL/1z/XxY+I9wYef4Ktd1WwDcqP6aAoZidXcBwnWgu8Oi21fX5wnO8QYdsHlHDIMM7JR8LeliI7F88Pg842bluL5AfKuBpcciZPEI+FuIiwHZCtHtVTrq7j0me0kJbKp/HbxVipT87Xpj4fgV9GJHvKyCl+ZDvMWp4RXiRcM4poUD2PEnMEmrkGyMGj/x7hfTppcJOzMs3BZT6PPyfEOLLdwtXFwqMkfk+WSM/xmuDGi8Rwuf0wj418lEApvxh4UOQXSy8p4I+RbrC3ayRn+JX27cVKKDG764R/c09DR42+CNQMu+Uiq3p43oU8F8hZ0zrNOFJhfQlZKzzAHFCX/CsGD0pxFWzUKoAZm0mvT+yHOsIBo58WPdYlnorURwlxLqTUKIA3vxzQtb3zYX4K8qIwdFqxK8PFh4p3CIh/R/d28zd/1u/myZoUfzrwrcL5f8luoeEWGvSEnIKwJ8OcIyIuEqiQ38cdADFnRgZ3AtqO8G1c31chAbFE/hg1jXADE+EynPvCm9pe7hNAWjtPaE/29vaX9MRo91DF9cL/SXqWv23CZXrGz3GyL9B+GUXYXoGSyR8NiBeOTCQ39wLFUCEh/Z+EL4fCG/LG2r6SMeIIYjYmPmJ7wGu8VeT73e+hr9PG07uJFo7ePIXKMCP7d/Q3dUTUICxJHZHEV+7ht30SxDj5xZdB27PhQrYoBuHu5vzuYNZgJ/VYS6xQKcPC/AHhV9e7Rr863EH3qYA2gmUCJuBJotkUOTUls+T2JC38xtC3wr4SgLM1Jlfdu9r5I5PLL4hd6DOYAnU2nBQvIm2rG4SCnjQdfa8KSkAcWSRZnnNJGhAPm+aib2MvhXAMoUZAv51X4aQinCx8Kae4A8ql5GNswyGg2IVIEa4yd0g3mDNZxXoA8JlMOQ5n4n6CqD0RC2uDboEQm288P1/hcc7guf1u1xICa0PsECojReVpb18C6CG92ZGMlEVdb5xgWDocWEsFD5D7UVJTKYTxBe5pO0w0Ww0C7hLfygopIB4nCRjXED7RIbAwP0O3S+RX8oKS2XT11QeAh8KOpeaAj7Tn8YkMoAF1MblPktyAv/5WDrMm2M+6Ao8bxFmikfjBiiAuv2jhdLoWM60UqxC04wVRMZ1NZ6PJV+xfp2FAkpLysYAE+2SpGCSYT2hrSSGq3WpPeBavNlSWIcCCIOZkUtTXSYpJqsa2FLEYT0BeSy9AHkBM7fVEyyf/7NGiGiZXGuKostRAH6NaQ6FJRsi9InlqiRjwxQZOG7jL6PIQZ4PA/2hXA34+Tz1gJI5Ibf2+7KsLL4GBZAmWupbWiD1N0ZiL4m3QP5vsz00FkhZ6ht7jtIb80I4GFyO+kBqieyyMbIyFt7yZkosIdwaY0BEeJg2gw0BWbE3H9IN1MAbioWylOJwmzBiLJ3H7M3Py2yL72NhMYHLq8J3hJ+6TmDepzpuWM+vwoPcGwxrfPi5+XxEPyNNMVpf/taitu21p3SNm+wr3Cchv3hz1Hpi2+Pbq4Gszfwz7Dzb098Lw11i3jZZ3k/COWHt5gcrBM+1yWdO2UnI9nwMQvlV2+MwnGkFtLkAPmgu8ImuQxf4zZkgNflJuIDJ3ybiAsw/5gIx+cUuMBSjcSZB/JdZPIQ+JkGWXgbS6yS4UgztyMqsLYOrugZCpcWRaQZCXc4HNIHQNEJh8oBzhf7WWi4UZmmrzQc6hcKlQYT5dNdkiHzg92BiaEuGoK3NA2DdKRma+XQYzeXqgfbillJBhDHvXVMSwyQxzXFhGiUxXC3X15GS2MwXRUvcoM+yOMfZKML45wMoi8eyyC4WV10WR8i0N0aIEfzzAdTyFnVjZOa3xrCCmdwcnfntcUpPM31AwmpvM31ExpYaZmFWgx+FkzgkxTJHEkTxwirAyCbCpBps8tvOIdYsibFDUjt68htedkYoZDyNY3LXSah/PsCu6cuiHZMLFTHJg5IvSph/PsCu/T4s2kFJvxNschCkhPl8zBz9o7JHiCAVj9cclSUPeU1Yc1SWegLB1lhHZW2Q+Ct7AmE+X+OTMdqBaxyOyyh4HsXzMno5LG28l+xx+dJCKIrgeFnrweMOb3ESH0zU9LH5YKL2kxlOktppyw5jHnmk709mavvWfDID5DJBv9dL7qMpGxwTUcmGCPR2PgCNzwljR2tT1rFgl1bENfKNt//ZXJfzASMHJWFaOh8syQ8nay1hSX46a0oonRNyH08T+9vxu64fT1NEpYQ2tY+nTQmT+nz+OwkIEy2TyT7lLsKpfT7/P/yLMrzOf4DHAAAAAElFTkSuQmCC`,

  ToExtension:{
    txt:`Converts Self to a set of files that can be loaded as a WebExtension, to provide an action button that opens self in any page.
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
    txt:`Converts Self to a human-readable form that pollutes the global scope on execution.`,
    examples:[
      [
        `ToReadableJS Self (jsEval '{markLines:true, into:"document.body.appendChild(document.createElement(\\"div\\")))"}')`,
      ],
    ],
    call(net = Self, opt) {
      net = defines(net, lookup) || net
      if (net instanceof Map)
        net = Object.fromEntries(net.entries().map(([k,v]) => _isLabel(k) ? [k[1], v] : [k, v]))
      if (!net || net[defines.key] || typeof net != 'object') throw "Invalid net"
      const markLines = opt ? !!opt.markLines : true
      Object.keys(net).forEach(k => !_isValidIdentifier(k) && error('Not a valid JS identifier:', k))
      const seen = new Map
      mark(net)
      seen.set(net, 0)
      const names = new Map
      Object.keys(net).forEach(k => { seen.get(net[k]) !== 0 && names.set(net[k], k), seen.set(net[k], 0) })
      let s = [], nextName = 0, depth = 0, line = 1
      opt && typeof opt.prefix == 'string' && write(opt.prefix)
      write(`/* Code begins at the first \`})({\`, as methods that are bound to each other. _XXX methods are private and somewhat invisible. */\n`)
      write(`'use strict';\n`)
      write(`(function() {\n`)
      write(`const __version = ${str(__version.replace(/[0-9]+$/, s => +s+1))}\n`)
      if (markLines) write(`const __line = function(line, func) { return __line.lines[''].push(line, func), func }\n`)
      if (markLines) write(`__line.lines = {['']:[]}\n`)
      write(`const __mark = (v, m) => (_read.marks.set(v, m), v)\n`)
      write(`const __is = (function is(name) {\n`)
      write(`  const obj = Object.create(is)\n`)
      write(`  return obj.is = name, obj\n`)
      write(`});\n`)
      write(_unevalFunction(__base)[1].replace(/__INTO__/, opt && opt.into || 'document.body')+'\n')
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
        if (!_isArray(x) && defines(x, deconstruct)) return mark(deconstruct(x))
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
          const d = deconstruct(x)
          if (!_isArray(d) || typeof d[0] != 'function' || defines(d[0], finish)) throw "Must be a regular function"
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
            if (v instanceof Map) throw "Only definitions can be Maps"
            if (concept.idToKey[+k] !== lookup && (v instanceof Map || v && !_isArray(v) && !v[defines.key] && typeof v == 'object'))
              throw "Only the definition of lookup can be an object"
            def.set(concept.idToKey[+k], v)
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
        if (net.interrupt) net.interrupt.noInterrupt = false
        if (net.finish) delete net.finish.v

        return Initialize.call(globals, net, typeof __line != ''+void 0 ? __line.lines : undefined)

        function objectFor(x) {
          // Load {call(){}} into a trivially-callable function, as a notational convenience.
          return x && typeof x.call == 'function' && x.call !== Function.prototype.call ? x.call : Object.create(null)
        }
        function preload(from, into) {
          // Pre-create objects/functions to be filled by `load`, so that arbitrary order of definitions is permitted.
          Object.keys(from).forEach(k => {
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
          if (from._read) into._read.marks = new Map
          if (from.finish && from._newExecutionEnv) into.finish.env = _newExecutionEnv()
          if (from.interrupt) into.interrupt.noInterrupt = true
          Object.keys(from).forEach(k => {
            if (from[k] && Object.getPrototypeOf(from[k]) === __is) {
              if (Array.isArray(from[k].is)) { // Evaluate arrays.
                const m = from[k].is.map(x => load(x))
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
            if (Array.isArray(from.is)) return from = from.is.map(x => load(x)), defines(from[0], finish) && (from[0] = defines(from[0], finish)), from[0].call(...from)
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
                if (from[key] === defKey || from[key] === _read.marks) { into[key] = from[key];  continue }
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
      }
    },
  },

  ToScopedJS:{
    txt:`Converts Self to a form that has itself hidden in a scope.`,
    call(net = Self, opt) {
      net = defines(net, lookup) || net
      if (net instanceof Map)
        net = Object.fromEntries(net.entries().map(([k,v]) => _isLabel(k) ? [k[1], v] : [k, v]))
      if (!net || net[defines.key] || typeof net != 'object') throw "Invalid net"
      if (!net._id) throw "Net must have _id"
      if (!net.label) throw "Net must have label"
      if (!net.concept) throw "Net must have concept"
      const markLines = opt ? !!opt.markLines : true
      Object.keys(net).forEach(k => k[0] === '$' && error('$ is reserved for hidden names, use something other than', k))
      Object.keys(net).forEach(k => !_isValidIdentifier(k) && error('Not a valid JS identifier:', k))
      const names = new Map
      let n = 0
      mark(net)
      let s = [], line = 1
      opt && opt.prefix && write(opt.prefix)
      write(`'use strict';(()=>{\n`)
      write(`const __version = ${str(__version.replace(/[0-9]+$/, s => +s+1))}\n`)
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
      if (net._read) write(`_read.marks = new Map\n`)
      if (net.finish && net._newExecutionEnv) write(`finish.env = _newExecutionEnv()\n`)
      if (net.interrupt) write(`interrupt.noInterrupt = true\n`)
      // Fill the values of variables in.
      names.forEach((name, v) => {
        if (_isArray(v) || defines(v, deconstruct) === undefined) if (!fill(v)) write('\n')
        if (!_isArray(v) && defines(v, deconstruct) !== undefined) {
          const d = deconstruct(v)
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
      write(markLines ? `, __line.lines` : `, undefined`)
      write(`, ${opt && opt.into || null}`)
      write(')')
      write(`\n})()`)
      return s.join('')

      function mark(x) {
        if (x == null || typeof x == 'number' || typeof x == 'boolean') return
        let name
        if (names.has(x)) return; else names.set(x, name = '$' + (n++).toString(36))
        try {
          if (_read.marks && _read.marks.has(x)) mark(_read.marks.get(x))
          if (!_isArray(x) && defines(x, deconstruct)) return mark(deconstruct(x))
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
          Object.keys(x[defines.key]).forEach(k => {
            const key = concept.idToKey[+k]
            write(name), write('[defines.key]['), put(net._id), write('('), put(key), write(')]='), put(x[defines.key][k]), write('\n')
          })
          if (x !== net.Self) write('Object.freeze('), write(name), write('[defines.key])\n')
          return true
        } else return true
      }
    },
  },

  System:{
    txt:`A namespace for low-level functions that should not be called in user code, for safety.`,
    lookup:{
      interrupt:__is(`interrupt`),
      deconstruct:__is(`deconstruct`),
      jsEval:__is(`jsEval`),
      compile:__is(`compile`),
      Rewrite:__is(`Rewrite`),
      impure:__is(`impure`),
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
          halve(merge.contentToArr)
          if (_allocArray.free) _allocArray.free.length >>>= 1
          if (_resolveStack.functions) {
            const k = Object.keys(_resolveStack.functions)
            for (let i = 0; i < (k.length>>>1); ++i) delete _resolveStack.functions[k[i]]
          }
          // And WeakMaps: _invertBindingContext.cache, finish.compiled
          function halve(m) { if (m) _limitMapSize(m, m.size>>>1) }
        },
      },
    },
    permissionsElem(el) { el.classList.add('warning');  return el },
  },

  _settlePromisesIn(a) {
    let b
    for (let i = 0; i < a.length; ++i)
      if (_isPromise(a[i]) && 'result' in a[i]) {
        if (!b) b = a.slice()
        if (a[i].result instanceof Error || _isError(a[i].result)) throw a[i].result
        b[i] = a[i].result
      }
    return b || a
  },

  _escapeToInterpretation:{txt:`An object that is thrown when the label-env contains unknowns, and we tried to execute the compiled version of an expression.`},

  replaceArray:{
    future:`Make partial evaluation of func body be an invalidate-able assumption of functions, and invalidate it here.`,
    txt:`\`(replaceArray Array Becomes)\`: replaces an array with another array in-place, re-compiling all code that depends on it.`,
    call(arr, becomes) {
      if (compile.assumptions && compile.assumptions.has(arr)) {
        const ass = compile.assignments.get(arr)
        if (typeof ass == 'function')
          ass.compiled = undefined
        else if (Object.getPrototypeOf(ass) !== compile)
          finish.compiled.delete(ass)
        else
          ass.ass.forEach(a => typeof a == 'function' ? (a.compiled = undefined) : finish.compiled.delete(a))
      }
      arr.length = becomes.length
      for (let i = 0; i < arr.length; ++i) arr[i] = becomes[i]
      return arr
    },
  },

  _compileOpts(cause, loadVarsFromEnv = false) {
    if (!_compileOpts.opt) _compileOpts.opt = { cause:undefined, markLines:true, loadVarsFromEnv:false }
    _compileOpts.opt.cause = cause
    _compileOpts.opt.loadVarsFromEnv = loadVarsFromEnv
    return _compileOpts.opt
  },

  compile:{
    txt:`Compiles a function to JS.`,
    philosophy:`I am speed.
(Kinda, not really, because we have to make sure to cause interrupts if needed, and cannot optimize time-taken-estimation with this simple static impl.)`,
    buzzwords:`compiled just-ahead-of-time`,
    noInterrupt:true,
    call(opt, ...a) {
      // compile undefined ^(sum a 5)
      // compile undefined ^a 5
      // compile undefined ^x ^(if a a 1) a=x+1
      // compile undefined ^x ^(if x a a) a=x+1
      // compile undefined ^x ^(if a a a) a=x+1
      // compile undefined ^x ^[(if x a 1), a] a=x+1
      // compile undefined ^x ^[(if x a 1)\ a] a=x+1
      // compile undefined ^[a:1] ^[b:2] 4
      // compile undefined ^[(delay 5)+1]
      // compile (jsEval '{comments:true}') (function a a a) ^a

      // Do more work before so that you could do less work after.

      if (!compile.assumptions) compile.assumptions = new WeakMap

      if (!a.length) throw new Error("Expected an expression to compile")

      let refCount = new Map // expr to nat
      let phantomRefs = new Map // expr to nat
      const body = a.pop()

      const loadVarsFromEnv = opt && opt.loadVarsFromEnv || false // true if label env can contain variable values that we'd need to load to local vars.
      const cause = opt ? opt.cause : !a.length ? body : struct(_function, ...a, body) // For interrupts and compile.assumptions invalidation.
      const noInterrupts = opt && opt.noInterrupts || interrupt.noInterrupt || false
      const markLines = opt && opt.markLines || false
      const comments = opt && opt.comments || false
      const debugLog = opt && opt.debugLog || false

      a.forEach(markRefCounts), markRefCounts(body)
      const names = new Map, exprs = new Map // expr to name, name to expr, to not compile the same node twice.
      let nextVar = 0, nextEnv = 0, nextThen = 0
      // nextThen is for dynamic destination address/stage of computation-on-demand without functions.
      let freeList = [] // For variables.
      let nameToEnv = {}, envToName = new Map // For outside constants.
      let jumped = true // Whether advanceStage can omit `stage=...`.
      let haveCode = true // Whether we cannot omit a new stage in advanceStage.

      // For marking branches' nodes as seen-twice-but-compiled-once (multi-return).
      const inA = new Set, inB = new Set

      // Fill in "the shallowest common ancestor of a node" info so that we can exit early when re-ref-counting branches of conditionals (so we can eagerly compute nodes that belong in branches, but lazily compute those that are used afterwards).
      const currentAncestors = new Map, parents = new Map, common = new Map
      markParents(body, 0, body)
      parents.clear()

      // For on-demand computation of possibly-not-reached nodes.
      const uncomputed = compile.uncomputed || (compile.uncomputed = Symbol('uncomputed'))
      const uncertainSeenTwice = new Set, uncertainStage = new Map, uncertainThen = new Map

      // `s` is the body of the function we want to return (with `args`, and inside a function that accepts all in `nameToEnv`).
      const s = [], lines = markLines && []
      let line = 1
      const varsInside = new Map // a Map from inside to an immutable Set of vars
      const assigned = new Set, compiledStack = new Set
      const args = new Set

      write(`'use strict'\n`)
      const funcBackpatch = write(`(FUNC PLACEHOLDER {\n`)
      const varsDeclarationBackpatch = write(`\n`)
      const labelEnvBackpatch = write(`\n`)
      const varsUsedBackpatch = write(`\n`)
      const stageBackpatch = write(`while(true)switch(stage){case 0:\n`)
        // Emulate goto, with potential `interrupt`ions.

      const restIndexInA = _findRest(a)
      let nextStage = 1

      // Handle interpretation if escaped.
      const argNames = []
      if (a.length) {
        if (restIndexInA < a.length-1)
          write(`${outside(_assign)}(${outside(a)},args)\n`)
        else {
          for (let i = 0; i < restIndexInA; ++i) {
            argNames[i] = use(a[i], true)
            args.add(argNames[i])
            write(`${outside(_assign)}(${outside(a[i])},${argNames[i]})\n`)
          }
          if (restIndexInA < a.length)
            write(`${outside(_assign)}(${outside(a[restIndexInA][1])},args)\n`)
        }
        write(`return ${outside(finish)}(${outside(body)})\n`)
        jumped = true, advanceStage(a)

        // Compile assignment of args.
        if (restIndexInA < a.length-1) {
          // a has …R: just assigning a single `...args` arg will suffice.
          args.add('...args'), compileAssign(a, 'args')
        } else {
          // Put …R at the end and assign each arg before it, to not slice an array an extra time. If no …R is in a, assign each arg.
          for (let i = 0; i < restIndexInA; ++i) {
            compileAssign(a[i], argNames[i])
            used(argNames[i])
          }
          if (restIndexInA < a.length)
            args.add('...args'), compileAssign(a[restIndexInA][1], 'args')
        }
        advanceStage(body)
      }

      const resultName = compileExpr(body, true)
      if (resultName)
        write(`return ${resultName}\n`)
      if (nextStage > 1) write(`}\n`)

      s[funcBackpatch] = `return (function compiled(${[...args]}) {\n`
      // Make the body able to interrupt and re-enter.
      const vars = new Array(nextVar).fill(0).map((_, i) => 'V' + i.toString(36)).filter(el => !args.has(el))
      vars.push(...new Array(nextThen).fill(0).map((_, i) => 'S' + i.toString(36)))
      vars.push(`LE`), s[labelEnvBackpatch] = `LE=${outside(_allocMap)}()\n`
      if (nextStage > 1 || vars.length) {
        s[varsDeclarationBackpatch] = `let[${nextStage > 1 ? `stage=${a.length ? 1 : 0},` : ''}${vars}]=${outside(interrupt)}(${outside(cause)})\n`
        s[varsUsedBackpatch] = `const PE=${outside(finish)}.env[${outside(_id(label))}];${outside(finish)}.env[${outside(_id(label))}]=LE;try{\n`
        if (nextStage > 1) vars.unshift('stage')
        write(`}catch(err){if(err===${outside(interrupt)})err(${outside(cause)},${vars.length})(`)
        // `if (err === interrupt) interrupt(cause, vars.length)(...)(...)(...); throw err`:
        for (let i = 0; i < vars.length; i += 4)
          vars[i] && write(vars[i]),
          vars[i+1] && write(',' + vars[i+1]),
          vars[i+2] && write(',' + vars[i+2]),
          vars[i+3] && write(',' + vars[i+3]),
          vars[i+4] && write(')(')
        write(`),LE=null; throw err}\n`)
        write(`finally{LE!==null&&(LE.delete(${outside(body)}),${outside(_allocMap)}(LE)),${outside(finish)}.env[${outside(_id(label))}]=PE}\n`)
      }
      if (nextStage === 1) s[stageBackpatch] = '\n'

      // Return the unadorned function.
      write(`})\n`)
      if (debugLog) // For debugging.
        log(elem('div', s.map(x => _highlightGlobalsInString(''+x))), nameToEnv)
      const sourceURL = new Array(16).fill(0).map(() => (Math.random()*16|0).toString(16)).join('')
      write(`//# sourceURL=${sourceURL}`)
      let result
      try { result = Function(...Object.keys(nameToEnv), s.join(''))(...Object.values(nameToEnv)) }
      catch (err) { log('Error when compiling', ...a, body, ':', s.join(''), jsRejected(err));  throw err}
      result[jsEval.ctx] = nameToEnv
      if (lines) result.lines = lines, typeof cause == 'function' && (cause.lines = lines)
      _resolveStack.functions[sourceURL] = cause
      return result



      function write(str, comment) {
        jumped = false, haveCode = true
        if (markLines) line += _lineCount(str)
        if (comments && comment && str[str.length-1] === '\n') str = str.slice(0,-1) + ' // ' + comment + '\n'
        s.push(str)
        return s.length-1 // Return the backpatchable index.
      }
      function markRefCounts(x) {
        // Record the assumption of immutability so that `replaceArray` can invalidate it.
        if (_isArray(x)) {
          let ass
          if (!compile.assumptions.has(x))
            compile.assumptions.set(x, cause)
          else if (Object.getPrototypeOf(ass = compile.assumptions.get(x)) !== compile)
            compile.assumptions.set(x, Object.create(compile)), compile.assumptions.get(x).ass = [ass, cause]
          else
            ass.ass.push(cause)
        }
        // Go through the array-graph and mark the ref-count of each reachable node.
        if (!_isArray(x) || x[0] === quote || x[0] === _const) return
        refCount.set(x, (refCount.get(x) || 0) + 1)
        if (!_isArray(x) && _isArray(defines(x, deconstruct)))
          return markRefCounts(deconstruct(x))
        if (!_isArray(x) || refCount.get(x) !== 1) return
        x.forEach(markRefCounts)
      }
      function markRefCountsWithin(x) {
        // Go through the array-graph and mark the ref-count of each reachable node, but don't go into nodes that are fully encapsulated within us.
        if (!_isArray(x) || x[0] === quote || x[0] === _const) return
        refCount.set(x, (refCount.get(x) || 0) + 1)
        if (!_isArray(x) || refCount.get(x) !== 1) return
        if (currentAncestors.has(x) || currentAncestors.has(common.get(x))) return
        currentAncestors.set(x, x)
        x.forEach(markRefCountsWithin)
        currentAncestors.delete(x)
      }
      function use(expr, forceNew = false) {
        // Return a var name that will hold the result of expr.
        if (!forceNew && names.has(expr)) return names.get(expr)
        const name = !forceNew && freeList.length ? freeList.pop() : 'V' + (nextVar++).toString(36)
        if (!names.has(expr))
          names.set(expr, name),
          exprs.set(name, expr)
        else if (!exprs.has(name))
          exprs.set(name, expr)
        return name
      }
      function used(name, times = 1) {
        // Decrement ref-count and mark the var as free if it won't be used anymore.
        if (!exprs.has(name)) return name && name[0] === 'V' && freeList.push(name)
        const expr = exprs.get(name)
        if (refCount.get(expr) < times || phantomRefs.has(expr) && phantomRefs.get(expr) < times)
          errorStack("Freed more than used:", name, expr, s.join(''), nameToEnv)
        refCount.set(expr, refCount.get(expr) - times)
        if (phantomRefs.has(expr)) phantomRefs.set(expr, phantomRefs.get(expr) - times)
        if (!refCount.get(expr) || phantomRefs.has(expr) && !phantomRefs.get(expr) || name !== names.get(expr)) {
          comments && (jumped ? (write(`// Dispose ${name}\n`), jumped = true) : write(`// Dispose ${name}\n`))
          if (phantomRefs.has(expr) && !phantomRefs.get(expr))
            name === names.get(expr) && phantomRefs.delete(expr),
            !refCount.get(expr) && error("Invalid phantom-refs allocation (too much phantom, nothing real is left):", expr, s.join(''))
          else
            name === names.get(expr) && (names.delete(expr), exprs.delete(name))
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
      function compileAssign(a, bVar) {
        // Emit code that matches pattern to valueVar (a subset of `_assign` without inference).
        if (_isVar(a) && refCount.get(a) === 1 && !assigned.has(a)) return
        lines && lines.push(line, a)

        if (!assigned.has(a))
          write(`if(${outside(_isArray)}(${bVar})&&${bVar}[0]===${outside(_unknown)}){stage=0;continue}\n`, `no inference in compiled code`)

        // If demandEq is false, we'll check graph equality, else ref equality.
        const demandEq = !_isArray(a) && !_isArray(defines(a, deconstruct)) || a[0] === _const
        if (!demandEq && assigned.has(a)) { // if (a !== b) error(…)
          write(`if(${use(a)}!==${bVar})${outside(error)}(${outside("Non-matching graph: expected")}, ${use(a)}, ${outside("for")}, ${outside(a)}, ${outside("but got")}, ${bVar})\n`, `cyclic check`)
          return
        } else assigned.add(a)
        if (_isVar(a) && names.get(a) === bVar) return
        if (_isVar(a))
          return void write(`${use(a)}=${bVar}\n`, `var assign`) // a=b
        const err = `${outside(error)}(${outside(a)},${outside("cannot be assigned")},${bVar})\n`

        if (!demandEq) {

          // If expecting a function, deconstruct both pattern and input.
          if (!_isArray(a) && _isArray(defines(a, deconstruct))) {
            write(`if(${outside(_isArray)}(${bVar})||!${outside(_isArray)}(${outside(defines)}(${bVar},${outside(deconstruct)})))${err}\n`, `since a deconstructs, b must too`)
            a = deconstruct(a)
            write(`${bVar}=${outside(deconstruct)}(${bVar},false)\n`, `deconstruct`)
          } else write(`if(!${outside(_isArray)}(${bVar}))${err}`, `expected an array`)

          const Rest = _findRest(a)
          if (Rest < a.length) {
            write(`if(${bVar}.length<${a.length-1})${err}`, `too few args`)
            // Compile assignments of each item before …R, and each item after …R, and rest-pattern to b.slice(…).
            for (let i = 0; i < Rest; ++i) {
              const name = use(a[i], assigned.has(a[i]))
              write(`${name}=${bVar}[${i}]\n`)
              compileAssign(a[i], name), used(name)
            }
            for (let i = Rest+1; i < a.length; ++i) {
              const name = use(a[i], assigned.has(a[i]))
              write(`${name}=${bVar}[${bVar}.length-${a.length - i}]\n`)
              compileAssign(a[i], name), used(name)
            }
            const name = use(a[Rest][1], assigned.has(a[Rest][1]))
            const diff = Rest - a.length + 1
            write(`${name}=${bVar}.slice(${Rest},${bVar}.length${diff>0 ? '+'+diff : diff<0 ? ''+diff : ''})\n`)
            compileAssign(a[Rest][1], name), used(name)
          } else {
            // If b.length is different from a.length, error.
            write(`if(${bVar}.length!=${a.length})${err}`, `array length is unexpected`)
            // Else for each item, put b[i] into a[i]-associated var, compileAssign(a[i], name), then free the name.
            for (let i = 0; i < a.length; ++i) {
              const name = use(a[i], assigned.has(a[i]))
              write(`${name}=${bVar}[${i}]\n`, `assign array item`)
              compileAssign(a[i], name), used(name)
            }
          }
        } else 
          write(`if(${outside(a)}!==${bVar})${err}`, `demand ref-equality`)
      }
      function advanceStage(cause) {
        if (!haveCode) return nextStage-1
        !jumped && write(`stage=${nextStage};`)
        return write(`case ${nextStage}:${!noInterrupts ? `${outside(_checkInterrupt)}(${outside(cause)})` : ''}\n`, comments && cause !== undefined && serialize(cause, fancy)), haveCode = false, nextStage++
      }
      function advanceStageIfInterrupting(x) {
        if (_isArray(x[0]) || !defines(x[0], noInterrupt))
          advanceStage(x)
      }
      function compileFinish(x, into, code, usedVars) {
        // Spill vars inside into label-env, then do finish (emit call-of-definition with outside args), then load vars.
        spillVars(x)

        const args = x.map((el, i) => !i ? null : outside(el))
        if (!_isArray(x[0]) || !_hasCallableParts(x[0]))
          args[0] = outside(defines(x[0], finish))
        else
          args[0] = `${outside(defines)}(${code},${outside(finish)})`

        advanceStageIfInterrupting(x)

        if (typeof x[0] != 'function' || String(x[0]).indexOf('finish.v') >= 0)
          write(`${outside(finish)}.v=${outside(x)}\n`)
        into ? write(`${into}=`) : write(`return `)
        write(`${args[0]}(${args.slice(1)})\n`, `finish`)

        loadVars(x, usedVars)
      }
      function isRest(x) { return _isArray(x) && x[0] === rest && x.length == 2 && (!_isArray(x[1]) && error("Can only spread arrays, but got", x), true) }
      function rested(x, args) { return args.map((arg,i) => !i ? arg : !isRest(x[i]) ? arg : arg[0] !== 'E' ? '...'+arg : x[i][1].map(outside)) }
      function awaitArgs(x, args) {
        let a
        for (let i = 0; i < x.length; ++i)
          if (_awaitable(x[i]) || isRest(x[i]) && x[i].some(_awaitable)) {
            // Emit a set-to-result/throw check.
            if (!isRest(x[i]))
              write(`if(${outside(_isPromise)}(${args[i]})&&'result'in ${args[i]}){${args[i]}=${args[i]}.result;if(${args[i]} instanceof Error||${outside(_isError)}(${args[i]}))throw ${args[i]}}\n`, `accept the awaited result`)
            else
              write(`${args[i]}=${outside(_settlePromisesIn)}(${args[i]})\n`, `accept the awaited results`)
            if (!a) a = _allocArray()
            a.push(i)
          }
        // Then emit if-any-awaitable-is-a-promise, _await(...awaitables).
        if (a) {
          write(`if(${a.map(i => !isRest(x[i]) ? `${outside(_isPromise)}(${args[i]})` : `${args[i]}.some(${outside(_isPromise)})`).join('||')})`)
          write(`${outside(_await)}(${rested(a.map(i => x[i]), a.map(i => args[i]))})\n`)
          _allocArray(a)
        }
      }
      function compileArgs(x, code) { // After code is compiled, before struct/call is compiled.
        return x.map((el, i) => !i ? code : !isRest(el) ? compileExpr(el) : compileExpr(el[1]))
      }
      function usedArgs(args) { for (let i = 1; i < args.length; ++i) used(args[i]) }
      function compileCall(x, into, args) {
        // Compile args, emit call, then used() on each arg. Emit each statically-known …R as ...R.
        if (x[0] === finish && _isArray(x[1]) && x[1][0] === quote) spillVars(x[1][1])
        advanceStageIfInterrupting(x)

        awaitArgs(x, args)
        if (typeof x[0] != 'function' || String(x[0]).indexOf('finish.v') >= 0)
          write(`${outside(finish)}.v=${outside(x)}\n`)
        into ? write(`${into}=`) : write(`return `)
        write(`${args[0]}.call(${rested(x, args)})\n`, `call`)
        if (x[0] === finish && _isArray(x[1]) && x[1][0] === quote) loadVars(x[1][1], false)
      }
      function compileStruct(x, into, args) {
        // Compile args, then create-and-fill-and-merge the struct — struct(...) (or [...] if head is statically-known and !_shouldMerge).
        let returning = null
        if (!into) returning = nextVar+1, into = use(x)
        write(x.length ? `${into}=[];${into}.length=${x.length};${into}.length=0\n` : `${into}=[]\n`)

        awaitArgs(x, args)
        write(`${into}.push(${x, rested(x, args)})\n`, `struct`)
        if (_isArray(x[0]) || _shouldMerge(x))
          write(`${into}=${outside(_maybeMerge)}(${into})\n`)
        if (returning !== null) write(`return ${into}\n`)
        if (returning === nextVar) --nextVar
      }
      function compileExpr(x, into) {
        // Return a var that holds the result of finishing x.
        _checkArgCount(x)
        if (!_isVar(x) && !_hasCallableParts(x)) return outside(x)
        if (_isArray(x) && x[0] === _const) return outside(x)
        if (x[0] === quote) return outside(x[1])
        if (compiledStack.has(x)) return _isStruct(x) ? use(x) : outside(cycle)
        if (!_isVar(x) && assigned.has(x) && names.has(x)) return use(x)
        if (_isVar(x) && names.has(x) && !loadVarsFromEnv) return use(x)
        const firstTime = names.has(x)
        const name = !into && use(x)
        lines && lines.push(line, x)

        // Compute on demand.
        let uncertain, backpatch
        if (uncertainStage.get(x) === null) { // Our first time seeing this; emit a computable-on-demand stage.
          uncertainStage.set(x, nextStage)
          uncertainThen.set(x, uncertain = setupDynamicReturn())
        }
        if (uncertainStage.has(x)) { // Compute (goto stage then goto our next stage) if not computed.)
          let prefix = ''
          if (!uncertainSeenTwice.has(x))
            into && error("How could the top-level be uncertainly-computed?"),
            prefix = `if(${name}===${outside(uncomputed)})`
          backpatch = doDynamicReturn(x, uncertainStage.get(x), uncertainThen.get(x), prefix)
        }
        try {
          // Store results of nodes in vars as needed.
          if (firstTime || _isVar(x)) {
            if (loadVarsFromEnv && _isVar(x) && (!firstTime || uncertainThen.has(x))) {
              const e = `${outside(finish)}.env[${_id(label)}]`
              const onUnassigned = _isLabel(x) ? `(${outside(finish)}.v=${outside(x)},${outside(defines(label, finish))}(${outside(x[1])}))` : outside(x)
              write(`${use(x)}=${e}.has(${outside(x)})?${e}.get(${outside(x)}):${onUnassigned}\n`, `load var from env`)
              write(`if (${outside(_isUnknown)}(${use(x)})) throw ${outside(_escapeToInterpretation)}\n`)
            }
            return use(x)
          }
          if (!loadVarsFromEnv && _isVar(x))
            error("A var in body that was not assigned:", x)

          compiledStack.add(x)
          if (!compiledStack.has(x[0]) && !_hasCallableParts(x[0], true) && (!_isArray(x[0]) || defines(x[0], finish) !== undefined || defines(x[0], call) !== undefined)) {
            if (x.length == 4 && (x[0] === _if || !_isArray(x[0]) && defines(x[0], finish) === defines(_if, finish)))
              compileIf(x, name)
            else if (x[0] === last || !_isArray(x[0]) && defines(x[0], finish) === defines(last, finish))
              compileLast(x, name)
            else {
              const code = compileExpr(x[0])
              if (!_isArray(x[0]) && defines(x[0], finish) !== undefined)
                compileFinish(x, name, code, true), used(code)
              else {
                typeof finish.compiled.get(x) != 'function' && finish.compiled.delete(x)
                const args = compileArgs(x, code)
                if (typeof x[0] == 'function' && (x[0] !== rest || x.length != 2))
                  compileCall(x, name, args)
                else
                  compileStruct(x, name, args)
                used(code), usedArgs(args)
              }
            }
            return name
          } else {
            // Basically what's above, but deferred to runtime (and without special-casing `if`/`last`, because what are the chances).
            // Compile code then branch, then finishing (that then jumps to result), then args, then dynamic return to making a struct/call that return to result.
            const code = compileExpr(x[0])
            let finishStage, argsStageS, argsStageC, callStage, structStage
            const dynamic = setupDynamicReturn()
            write(`if(!${outside(_isArray)}(${code})&&${outside(defines)}(${code},${outside(finish)})!==undefined);\n`)
            write(`else if(!${outside(_isArray)}(${code})&&typeof ${code}=='function'){${dynamic}=`),
              argsStageC = write(`???`), write(`;stage=`), callStage = write(`?CallStage?`), write(`;continue}`)
            write(`else{${dynamic}=`),
              argsStageS = write(`???`), write(`;stage=`), structStage = write(`?StructStage?`), write(`;continue}`)

            compileFinish(x, name, code, false)
            !into && (write(`stage=`), finishStage = write(`RESULT`), write(`;continue\n`, `goto result when finished`)), jumped = true

            s[argsStageS] = s[argsStageC] = advanceStage('args')

            const args = compileArgs(x, code)
            write(`stage=${dynamic};continue\n`, 'dynamic return'), jumped = true

            s[structStage] = advanceStage('struct')
            compileStruct(x, name, args)
            !into && (write(`stage=`), structStage = write(`RESULT`), write(`;continue\n`, `goto result when built`)), jumped = true

            s[callStage] = advanceStage('call')
            compileCall(x, name, args)

            usedArgs(args)
            if (!into) s[finishStage] = s[structStage] = advanceStage(x)
            used(code)
            return name
          }
        } finally {
          compiledStack.delete(x)
          uncertain != null && write(`stage=${uncertain};continue\n`, 'dynamic return')
          backpatch !== undefined && (jumped = true, s[backpatch] = advanceStage(x))
        }
      }
      function setupDynamicReturn() { return 'S' + (nextThen++).toString(36) }
      function doDynamicReturn(x, goto, setupVar, prefix) {
        // Return the backpatch index for the stage to return to (stored in var returned by `setupDynamicReturn`) after `goto` is done (or [backpatchGoto, backpatchSetup] if goto is undefined).
        prefix && write(prefix)
        const doesNotImmediatelyFollow = goto === undefined || goto !== nextStage
        if (doesNotImmediatelyFollow) write('{')
        write(`${setupVar}=`)
        const backpatchSetup = write('&&&&&')
        let backpatchGoto
        if (doesNotImmediatelyFollow) write(`;stage=`), backpatchGoto = write(`${goto}`), write(`;continue}\n`, `computed return`)
        else write(`\n`, `computed return`)
        if (!prefix) jumped = true
        advanceStage(x)
        return goto !== undefined ? backpatchSetup : [backpatchGoto, backpatchSetup]
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
      function dynamicReturnWhenSeenTwice(a, b) {
        // Marks-as-uncertain all nodes seen from both branches unless shrouded by uncertainty or fully within us.
        if (!_isArray(a) || !_isArray(b)) return
        markA(a), markB(b)
        inA.clear(), inB.clear()

        function markA(x) {
          if (!_isArray(x)) return
          if (x[0] === quote) return
          if (currentAncestors.has(common.get(x))) return
          if (uncertainStage.has(x) || names.has(x)) return
          // phantomRefs.set(x, (phantomRefs.get(x) || 0) + 1) // Dispose of vars in both branches. (Not implemented well enough.)
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
        // ... goto RESULT
        // ELSE: ...
        // RESULT: ...
        const cond = compileExpr(x[1])
        let thenStage, elseStage
        write(`if(${cond}!==true){stage=`), elseStage = write(`ELSE`), write(`;continue}\n`)
        used(cond)
        let result
        dynamicReturnWhenSeenTwice(x[2], x[3])

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
        walk()
        refCount.clear();  refCount = prevRefs

        result = compileExpr(x[2])
        into ? write(`${into}=`) : write(`return ${result}\n`)
        if (into) write(`${result};stage=`), thenStage = write(`RESULT`), write(`;continue\n`)
        jumped = true
        used(result)
        s[elseStage] = advanceStage(x[3]), result = compileExpr(x[3])
        into ? write(`${into}=`) : write(`return `)
        write(`${result}\n`)
        used(result)
        if (into) s[thenStage] = advanceStage(x)
      }
      function compileLast(x, into) {
        for (let i = 1; i < x.length-1; ++i)
          used(compileExpr(x[i]))
        into ? write(`${into}=`) : write(`return `)
        write(`${compileExpr(x[x.length-1])}\n`, `last`)
      }
      function spillVars(inside) {
        const vars = getVars(inside, undefined, true)
        if (!vars) return
        write(`${outside(finish)}.env[${_id(label)}]`)
        for (let v of vars.keys()) write(`.set(${outside(v)},${use(v)})`)
        write(`\n`, `spill vars`)
      }
      function loadVars(inside, usedVars) {
        const vars = getVars(inside, undefined, true)
        if (!vars) return
        for (let [v, parents] of vars)
          if (usedVars && names.has(v) && used(names.get(v), parents.size), refCount.get(v))
            write(`${use(v)}=${outside(finish)}.env[${_id(label)}].get(${outside(v)})\n`, `load vars`)
      }
      function getVars(inside, parent, ignoreHead = false) {
        // Return a Map from vars to a Set of where they are referenced (so that ref-count coincides with what we marked, we could free vars properly).
        if (!_isArray(inside)) return
        if (inside[0] === quote) return
        if (_isVar(inside) && parent === undefined) return new Map([[inside, new Set]])
        if (varsInside.has(inside)) return varsInside.get(inside)
        varsInside.set(inside, null)
        let r = null, copied = false
        for (let i = ignoreHead ? 1 : 0; i < inside.length; ++i) {
          if (!_isVar(inside[i]) || !names.has(inside[i])) {
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
    txt:`_allocArray()⇒Array as a replacement for \`[]\` and _allocArray(Array) to re-use objects.`,
    call(a) {
      if (!_allocArray.free) _allocArray.free = []
      if (a === undefined) return _allocArray.free.length ? _allocArray.free.pop() : []
      if (!_isArray(a)) throw "Expected undefined or an array"
      a.length = 0
      _allocArray.free.push(a)
    },
  },


  _allocMap:{
    txt:`_allocMap()⇒Map as a replacement for \`new Map\` and _allocMap(Map) to re-use objects.`,
    call(a) {
      if (!_allocMap.free) _allocMap.free = []
      if (a === undefined) return _allocMap.free.length ? _allocMap.free.pop() : new Map
      if (!(a instanceof Map)) throw "Expected undefined or a Map"
      // a.forEach(_reclaimUnknown)
  // _reclaimUnknown(v) { if (_isUnknown(v)) _allocArray(v) },
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

  either:{
    txt:`Used as the head of a context — a collection of values and functions to act on values.`,
  },

  _structHash:{
    txt:`Returns an object that's equal for equally-decomposed (mutually assignable) objects, so trying assignment could be replaced by a lookup then trying. Optimized for \`?:(type ? ?)\`.`,
    call(x) {
      if (!_structHash.dependent)
        _structHash.dependent = Symbol('dependent'), _structHash.context = Symbol('context')
      if (typeof x == 'function') return _structHash.dependent
      if (_isUnknown(x) && x.length == 2) x = x[1]
      if (!_isArray(x) || !x.length || x[0] === _const) return x
      if (typeof x[0] == 'function' || _isVar(x) || !_isArray(x[0]) && typeof defines(x[0], finish) == 'function')
        return _structHash.dependent
      if (x[0] === either || !_isArray(x[0]) && typeof defines(x[0], Usage) == 'function') return _structHash.context

      // Go to last.
      x = x[x.length-1]
      if (_isUnknown(x) && x.length == 2) x = x[1]
      if (!_isArray(x) || !x.length || x[0] === _const) return x
      if (typeof x[0] == 'function' || _isVar(x) || !_isArray(x[0]) && typeof defines(x[0], finish) == 'function')
        return _structHash.dependent
      if (x[0] === either || !_isArray(x[0]) && typeof defines(x[0], Usage) == 'function') return _structHash.context

      // Go to first.
      x = x[0]
      if (_isUnknown(x) && x.length == 2) x = x[1]
      return typeof x == 'function' || _hasCallableParts(x) ? _structHash.dependent : x

      // .dependent, .context
    },
  },

  _isTry(x) {
    let d
    return typeof x == 'function' && _isArray(d = defines(x, deconstruct)) && d[0] === _try ? d : undefined
  },

  _addHashed(result, v, add, inp, actuallyRemove = false) {
    let d
    if (_isUnknown(v) && v.length == 2)
      v = v[1]
    if (!inp && _isArray(v) && v[0] === struct)
      // If `struct ...?`, treat it as v.slice(1).
      v = v.slice(1)

    if (!inp && _isArray(v) && v[0] === _if && v.length == 4) {
      // If `if ? ? ?`, add both branches.
      _addHashed(result, v[2], add, inp, actuallyRemove)
      _addHashed(result, v[3], add, inp, actuallyRemove)

    } else if (_isUsing(v) || _isFunction(v) || typeof v == 'function' && (inp ? (d = !_isArray(v) && defines(v, input)) : (d = !_isArray(v) && defines(v, output)))) {
      // If a deconstructable function, add each of its inputs/output.
      const f = d || deconstruct(v), u = _isUsing(v)
      if (inp) {
        const endJ = d ? f.length : f.length-1
        for (let j = d ? 0 : !u ? 1 : 2; j < endJ; ++j)
          _addHashed(result, f[j], add, inp, actuallyRemove)
      } else
        _addHashed(result, d ? f : f[f.length-1], add, inp, actuallyRemove)

    } else if (d = _isTry(v)) {
      // Add each sub-function.
      for (let j = 1; j < d.length; ++j)
        _addHashed(result, d[j], add, inp, actuallyRemove)

    } else {
      const hash = _structHash(v)
      if (!result.has(hash)) result.set(hash, [])
      const arr = result.get(hash)
      if (!actuallyRemove) 
        !arr.includes(add) && arr.push(add)
      else {
        const i = arr.indexOf(add)
        i>=0 && arr.splice(i,1)
      }

    }
  },

  _addUsage:{
    txt:`Adds an item to a usage context.`,
    call(ctx, v) {
      if (_wasMerged(ctx)) error(ctx, "was merged")
      ctx.push(v)
      if (_hashes.ins.has(ctx))
        _addHashed(_hashes.ins.get(ctx), v, v, true, false)
      if (_hashes.outs.has(ctx))
        _addHashed(_hashes.outs.get(ctx), v, v, false, false)
    },
  },

  _removeUsage:{
    txt:`Removes an item from a usage context.`,
    call(ctx, v) {
      if (_wasMerged(ctx)) error(ctx, "was merged")
      const i = ctx.indexOf(v, 1)
      if (i <= 0) return
      ctx.splice(i,1)
      if (_hashes.ins.has(ctx))
        _addHashed(_hashes.ins.get(ctx), v, v, true, true)
      if (_hashes.outs.has(ctx))
        _addHashed(_hashes.outs.get(ctx), v, v, false, true)
    },
  },

  _hashes:{
    txt:`Returns a Map from _structHash of items to arrays of items that are present in \`ctx\`, for quick finding of assignable-structure.
(Deconstructable functions are added as each of their inputs or as output, depending on \`input\`.)
For context modification, either use \`(_addUsage Ctx Value)\` or \`(_removeUsage Ctx Value)\`, or call \`(_hashes Ctx true)\` to clear caches at modification.`,
    call(ctx, clearCaches = false, input = true) {
      if (!_isArray(ctx) || ctx[0] !== either)
        error("Expected a value context, got", ctx)
      if (!_hashes.ins) _hashes.ins = new WeakMap, _hashes.outs = new WeakMap
      const cache = input ? _hashes.ins : _hashes.outs
      if (clearCaches) return void(_hashes.ins.delete(ctx), _hashes.outs.delete(ctx))
      if (cache.has(ctx)) return cache.get(ctx)
      const result = new Map
      for (let i = 1; i < ctx.length; ++i)
        _addHashed(result, ctx[i], ctx[i], input)
      cache.set(ctx, result)
      return result
    },
  },

  fromBase64:{
    txt:`\`(fromBase64 String)\`: decodes a base64-encoded string.`,
    call(s) {
      if (typeof s != 'string') error('Expected a string, got', s)
      if ((s.length & 3) == 1) error('String contains an invalid character')
      return typeof process == ''+void 0 ? atob(s) : Buffer.from(s, 'latin1').toString('base64')
    },
    argCount:1,
  },

  toBase64:{
    txt:`\`(toBase64 String)\`: encodes a string in base64.`,
    call(s) {
      if (typeof s != 'string') error('Expected a string, got', s)
      return typeof process == ''+void 0 ? btoa(s) : Buffer.from(s, 'base64').toString('latin1')
    },
    argCount:1,
  },

  CurrentUsage:[
    __is(`either`),
  ],

  _disabled:{
    txt:`\`_disabled …?\`: a disabled-with-\`inspectUsageElem\` subcontext of a context.`,
  },

  inspectUsageElem:{
    txt:`Creates an element with checkboxes to disable/enable usage items (by moving them from/to a \`(_disabled …?)\` item).`,
    button:`Inspect usage context`,
    call(ctx = _bindingsAt().get(label('CurrentUsage'))) {
      if (typeof document == ''+void 0) return
      if (!ctx) error('Must declare CurrentUsage')
      const seenBefore = new Set
      const lang = _langAt(), binds = _bindingsAt()
      const reducedCollapseDepth = {...serialize.displayed, collapseDepth:3}
      return display(ctx, ctx, elem('div'))

      function checkbox(ctx, v, checked = ctx.indexOf(v) > 0) {
        // Create a checkbox that shuffles `v` in/out of `ctx` when toggled.
        const el = elem('input')
        el.type = 'checkbox'
        el.checked = checked
        el.title = 'Enabled?'
        el.onchange = () => {
          let disabledI = 1
          for (; disabledI < ctx.length; ++disabledI)
            if (_isArray(ctx[disabledI]) && ctx[disabledI][0] === _disabled && !_wasMerged(ctx[disabledI])) break
          if (el.checked) {
            // Remove from ctx[disabledI], add to ctx.
            const j = disabledI < ctx.length ? ctx[disabledI].indexOf(v, 1) : -1
            if (j > 0) ctx[disabledI].splice(j,1)
            _addUsage(ctx, v)
            if (ctx[disabledI].length === 1) _removeUsage(ctx, ctx[disabledI])
          } else {
            // Add to ctx[disabledI], remove from ctx.
            if (disabledI === ctx.length) _addUsage(ctx, [_disabled]), disabledI = ctx.length-1
            ctx[disabledI].push(v), _removeUsage(ctx, v)
          }
        }
        return el
      }
      function typesOf(v) {
        // Create a collapsed elem that contains the serialized types contained in `v`, or return null.
        const T = types(v)
        if (!T) return null
        const elc = elemCollapse(() => {
          const el = elem('div')
          for (let i = 0; i < T.length; ++i)
            el.append(elem('div', serialize(T[i], lang, binds, reducedCollapseDepth)))
          return el
        })
        elc.title = `${T.length-1} structures inside`
        return elc
      }
      function display(ctx, v, into) {
        if (seenBefore.has(v)) // Collapse double-refs.
          return elemValue(elemCollapse(() => (seenBefore.delete(v), display(ctx, v, elem('div')))), v)
        else seenBefore.add(v)
        let d
        if (_isArray(d = v) && v[0] === either || !_isArray(v) && _isArray(d = defines(v, Usage)) && d[0] === either) {
          const name = nameResult(d)
          const el = elem('details', elem('summary', name ? name[0] : 'Context:'))
          const immutable = _isArray(v) && v[0] === either && _wasMerged(v)
          for (let i = 1; i < d.length; ++i) {
            if (_isArray(d[i]) && d[i][0] === _disabled && !_wasMerged(d[i]))
              { display(ctx, d[i], el); continue }
            // Checkbox and types and value.
            const ch = elem('div')
            !immutable && ch.append(checkbox(ctx, d[i], true))
            const T = typesOf(d[i])
            T && ch.append(T)
            display(d, d[i], ch)
            el.append(ch)
          }
          into.append(el)
        } else if (_isArray(d = v) && v[0] === _disabled && !_wasMerged(v)) {
          for (let i = 1; i < d.length; ++i) {
            // Disabled checkbox and value.
            const ch = elem('div')
            ch.append(checkbox(ctx, d[i], false))
            const T = typesOf(d[i])
            T && ch.append(T)
            display(ctx, d[i], ch)
            into.append(ch)
          }
        } else
          // Describe it.
          into.append(serialize(v, lang, binds, reducedCollapseDepth))
        return into
      }
    },
  },

  Usage:{
    txt:`A namespace for contextual structural enumeration and generation.

(Largely superseded by \`compose\`, because it is quite a lot more efficient to *not* manipulate types just to specify generation groups.)`,
    lookup:{
      typed:__is(`typed`),
      either:__is(`either`),
      current:__is(`CurrentUsage`),
      inspect:__is(`inspectUsageElem`),
      types:__is(`types`),
      input:__is(`input`),
      output:__is(`output`),
      pick:__is(`pick`),
      use:__is(`use`),
      get:__is(`get`),
      using:__is(`using`),
    },
    philosophy:`Did you ever hear the tragedy of Darth Usage the Wise?
I thought not. It's not a story the Jedi would tell you. It's a Sith legend.
Darth Usage was a Dark Lord of the Sith, so powerful and so wise, he can use structures to influence the search to create… functions. He could even keep user intentions he loved from being obscured by having just one implementation.
The Dark Side of dependent types is a pathway to many abilities some consider to be… unnatural.
He became so powerful, the only thing he was afraid of was *losing* his power… which eventually, of course, he did. Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. Ironic. He could save others from death… but not himself.


What is a thought, compared to a mind? Functions are good, but combining them as precisely as needed is where it's at.
All functions and all APIs must be written by gradually connecting in-the-mind nouns (types of inputs/outputs), with simple and obviously-correct verbs (functions), from the required inputs to outputs. Programming languages must be described in an understandable and searchable and optimizable and extensible format, not given one measly implementation of. But that is not at all the regular programming style. Very alien to me. Can an old dog be taught new tricks?`,
  },

  types:{
    txt:`\`(types Context)\`: returns an array of all types contained in \`Context\` as inputs or outputs of functions.`,
    call(v) {
      // If not null, the result is disposable (via _allocArray(result)).
      if (!types.already) types.already = new Set
      const result = _allocArray()
      try {
        _addTypesToContext(result, v, true)
        _addTypesToContext(result, v, false)
        if (!result.length) return _allocArray(result), null
        return result
      } finally { types.already.clear() }
      // .already (to not add obvious duplicates)
    },
  },

  _addTypesToContext(result, v, inp) {
    let d
    if (!_isArray(v) && typeof (d = defines(v, finish)) == 'function' && _isFunction(d))
      // If a macro, treat it as a call.
      v = d
    if (_isArray(v) && v[0] === struct)
      // If `struct ...?`, treat it as v.slice(1).
      v = v.slice(1)

    if (!inp && _isArray(v) && v[0] === _if && v.length == 4) {
      // If `if ? ? ?`, check both branches.
      _addTypesToContext(result, v[2], inp)
      _addTypesToContext(result, v[3], inp)
      // I sure hope that no one is crazy enough to make the branches of an `if` cyclic, here and in `_addUsesToContext`.

    // If `either ...?`, or defines `Usage` to be `either ...?`, or `try …?`:
    } else if (_isArray(d = v) && v[0] === either || !_isArray(v) && _isArray(d = defines(v, Usage)) && d[0] === either || (d = _isTry(v))) {

      // Check out this sub-context.
      if (!_addUsesToContext.stack) _addUsesToContext.stack = new Set
      const stack = _addUsesToContext.stack
      if (stack.has(d)) return null
      stack.add(d)
      try {
        for (let i = 1; i < d.length; ++i) _addTypesToContext(result, d[i], inp)
      } finally { stack.delete(d) }

    // If a deconstructable function, or a JS function that defines `input`/`output`:
    } else if (_isUsing(v) || _isFunction(v) || typeof v == 'function' && (d = inp ? defines(v, input) : defines(v, output))) {
      // Check if values can be assigned to v's args in-order, and that the rest of args exist in ctx.
      const f = d || deconstruct(v), u = _isUsing(v)
      if (inp) {
        const endK = d ? f.length : f.length-1
        for (let k = d ? 0 : !u ? 1 : 2; k < endK; ++k) {
          if (_isArray(f[k]) && f[k][0] === rest)
            error("Rest args are not permitted in usage contexts:", f[k], 'in', v)
          // If not handled by `values`, check if a not-present-in-`values` arg exists in context.
          _addTypesToContext(result, f[k], inp)
        }
      } else
        _addTypesToContext(result, _bindFunc(d ? f : f[f.length-1], _turnComputedIntoVars), inp)

    } else {
      // Add a plain value, if non-trivial and non-var.
      if (_isArray(v) && !_isVar(v) && !types.already.has(v))
        result.push(v), types.already.add(v)
    }
  },

  _addUsesToContext(result, as, v, ctx, values, inp) {
    // The result of this (and `input`/`output`) can and should be `_allocArray(?)`d.
    if (!inp && _isVar(values) && result === false) return true
    let d

    const args = defines(v, argCount)
    if (!_isArray(v) && typeof (d = defines(v, finish)) == 'function' && (!inp || _isFunction(d) || args === values.length))
      // If a macro, unwrap unknowns inside `values` and treat it as a call.
      [v, values] = [d, bound(_unwrapUnknown, values, false)]
    if (!inp && _isArray(v) && v[0] === struct)
      // If `struct ...?`, treat it as v.slice(1).
      v = v.slice(1)

    if (!inp && _isArray(v) && v[0] === _if && v.length == 4) {
      // If `if ? ? ?`, check both branches.
      let [r = result, stage = 0] = interrupt(_addUsesToContext)
      try {
        if (stage === 0)
          r = _addUsesToContext(r, as, v[2], ctx, values, inp), stage = 1
        return _addUsesToContext(r, as, v[3], ctx, values, inp)
      } catch (err) { if (err === interrupt) interrupt(_addUsesToContext, 2)(r, stage);  throw err }

    } else if (d = _isTry(v)) {
      // If `try ...?` (a wannabe context), add each sub-function if appropriate.
      let [r = result, j = 1] = interrupt(_addUsesToContext)
      try {
        for (; j < d.length; ++j) {
          r = _addUsesToContext(r, v, d[j], ctx, values, inp)
          if (r === true) return r
        }
        return r
      } catch (err) { if (err === interrupt) interrupt(_addUsesToContext, 2)(r, j);  throw err }

    // If a deconstructable function, or a JS function that defines `input`/`output`:
    } else if (_isUsing(v) || _isFunction(v) || typeof v == 'function' && (d = inp ? defines(v, input) : defines(v, output))) {
      // Check if values can be assigned to v's args in-order, and that the rest of args exist in ctx.
      const f = d || deconstruct(v), u = _isUsing(v)
      let [j = 0, k = d ? 0 : !u ? 1 : 2] = interrupt(_addUsesToContext)
      const endJ = inp ? values.length+1 : 1
      const endK = d ? f.length : f.length-1
      try { // This interrupt-handling deal is getting worse every time.
        _checkInterrupt(v)
        for (; j < endJ; ++j)
          for (; k < endK; ++k) {
            // Try matching the arg to value.
            if (_isArray(f[k]) && f[k][0] === rest)
              error("Rest args are not permitted in usage contexts:", f[k], 'in', v)
            if (inp && j < values.length)
              try { _assign(f[k], values[j], true); ++k; break } catch (err) {}
            // If not handled by `values`, check if a not-present-in-`values` arg exists in context.
            if (!_addUsesToContext(false, ctx, ctx, ctx, f[k], false))
              { k = endK+1; break } // Does not exist.
          }
        if (!inp && k < endK) {
          if (!d && _isArray(d ? f : f[f.length-1]) && (d ? f : f[f.length-1])[0] === _if) {
            // Look into both branches.
            result = _addUsesToContext(result, as, d ? f : f[f.length-1], ctx, values, inp)
          } else
            try { _outputIsStructured(v, values) } catch (err) { k = endK+1 }
        }
        if (k < endK+1) {
          // Everything succeeded; add the function to the resulting context.
          if (result === false) return true
          if (!result) result = _allocArray(), result.push(either)
          if (!result.includes(as)) result.push(as) // (Quadratic time complexity. Shouldn't matter.)
        }
      } catch (err) { if (err === interrupt) interrupt(_addUsesToContext, 2)(j, k);  throw err }

    // If a JS function with the exact arg count we need, and seeking input, and all args are non-arrays (non-structural):
    } else if (typeof v == 'function' && values && inp && args === values.length && !values.some(_isArray)) {
      // Native functions bear no hint of the required structure, so the only thing we can do is call them and see if an error arises.
      try {
        try { v(...values) }
        catch (err) { if (err !== impure) throw err }
        // If did not throw or is impure when we are pure, add to context.
        if (result === false) return true
        if (!result) result = _allocArray(), result.push(either)
        if (!result.includes(as)) result.push(as)
      } catch (err) { if (err === interrupt) throw err }

    // If `either …?`, or defines `Usage` to be `either …?`:
    } else if (_isArray(v) && v[0] === either || !_isArray(v) && _isArray(d = defines(v, Usage)) && d[0] === either) {

      let [a = _lookupValueInHashes(v, values, inp), r = result, i = 0] = interrupt(_addUsesToContext)
      try {
        if (a.length)
          for (; i < a.length; ++i) {
            r = _addUsesToContext(r, a[i], a[i], ctx, values, inp)
            if (r === true) return true
          }
        _allocArray(a)
        return r
      } catch (err) { if (err === interrupt) interrupt(_addUsesToContext, 3)(a, r, i);  throw err }

    } else if (!inp) {
      // If a plain value fits the output shape, add it.
      try {
        _assign(v, values, true)
        if (result === false) result = true
        if (!result) result = _allocArray(), result.push(either)
        if (!result.includes(as)) result.push(as)
      } catch (err) {}

    }
    return result

    // .stack
  },

  _lookupValueInHashes(ctx, v, inp = false, result = _allocArray()) {
    // Returns an array of all values that could fit `v` in output or shape (that could be `_allocArray(a)`d).
    let d
    if (!_isArray(ctx) && _isArray(d = defines(ctx, Usage)) && d[0] === either) ctx = d
    if (!_isArray(ctx) || ctx[0] !== either) return result.push(ctx), result

    // Check out this sub-context.
    if (!_lookupValueInHashes.stack)
    _lookupValueInHashes.stack = new Set
    const stack = _lookupValueInHashes.stack
    if (stack.has(ctx)) return result
    stack.add(ctx)
    try {
      // Lookup in _structHash(v) and _structHash.dependent and _structHash.context.
      let direct, dep, subctx
      if (subctx === undefined) {
        const a = _hashes(ctx, false, inp)
        let hash
        if (inp) // If inp, then v is an array of values.
          for (let j = 0; j < v.length; ++j) {
            // Pick the smallest-subcontext of values' hashes, for speed.
            const h = _structHash(v[j]), d = a.get(h)
            if (!d || !direct || d.length < direct.length) hash = h, direct = d
            if (!d) break
          }
        else hash = _structHash(v), direct = a.get(hash)
        if (hash === _structHash.dependent) direct = ctx
        dep = hash !== _structHash.dependent && a.get(_structHash.dependent) || null
        subctx = hash !== _structHash.context && a.get(_structHash.context) || null
        if (_isVar(v)) direct = ctx.slice(1), dep = subctx = null
      }

      if (direct)
        for (let i = 0; i < direct.length; ++i)
          _lookupValueInHashes(direct[i], v, inp, result)
      if (dep)
        for (let j = 0; j < dep.length; ++j)
          _lookupValueInHashes(dep[j], v, inp, result)
      if (subctx)
        for (let k = 0; k < subctx.length; ++k)
          _lookupValueInHashes(subctx[k], v, inp, result)
      return result
    } finally { stack.delete(ctx) }

    // .stack
  },

  input:{
    txt:`\`(input Values)\` or \`(input Values Context)\`: returns a sub-context of all functions that can accept \`Values\` in the given order, or \`null\`.`,
    examples:[
      [
        `input (2) (either 1->2 2->3 a->a+1 toBase64)`,
        `either 2→3 a→a+1`,
      ],
      [
        `input ('a') (either quote fromBase64 toBase64)`,
        `either quote toBase64`,
      ],
      [
        `input ('U28gdGhpcyBpcyB0aGUgcG93ZXIgb2YgdWx0cmEgaW5zdGluY3Q=') (either id fromBase64 toBase64)`,
        `either id fromBase64 toBase64`,
      ],
      [
        `input (1:2) (either (either (either 1:2->2:3)))`,
        `either 1:2->2:3`,
      ],
      `It checks that all args can be generated in the context:`,
      [
        `input (1:10) (either (function a:10 b:20 a+b:30) 0:50 (function a:10 b:50 a*b:60))`,
        `either (function a:10 b:50 a*b:60)`,
      ],
    ],
    philosophy:`If value/function contexts are categories, then this enumerates an object family's outgoing morphisms. We allow non-structural (arbitrary black-box) computations though, unlike category theory.`,
    call(values, ctx = CurrentUsage) { return ctx === CurrentUsage && impure(), _addUsesToContext(null, ctx, ctx, ctx, values, true) },
  },

  output:{
    txt:`\`(output Value)\` or \`(output Value Context)\`: returns a sub-context of all values and functions that may produce results that fit the shape \`Value\`.`,
    examples:[
      [
        `output ?:2 (either 1 2:2 3:4)`,
        `either 2:2`,
      ],
      [
        `output ?:Int (either 1:Int 2:Int 3:'Float') Int='Int'`,
        `either 1:Int 2:Int Int='Int'`,
      ],
      [
        `output ?:Int (either a->a:Int b:Int->b:'Float') Int='Int'`,
        `either a→a:'Int'`,
      ],
      `Dependent outputs are not discarded:`,
      [
        `output ?:Int (either 1:Int a:b→a+1:b+1 toBase64) Int='Int'`,
        `either 1:'Int' a:b→a+1:b+1`,
      ],
      `Conditional branches get looked into:`,
      [
        `output ?:StringlyTyped (either x->(if x x:StringlyTyped (error))) StringlyTyped='StringlyTyped'`,
        `either x->(if x x:'StringlyTyped' (error))`,
      ],
      `Inputs are checked to exist in the context:`,
      [
        `output ?:Int (either 0:1 ?:1->?:Int ?:2->?:Int) Int='Int'`,
        `either ?:1→?:Int Int='Int'`,
      ],
    ],
    philosophy:`If value/function contexts are categories, then this enumerates an object family's incoming morphisms. Doesn't mean that this is a subservient implementation of a grander theory. In realms close in fundamentality to PLs, everything can be done in terms of each other, and there's no base difference between an explanation in words in formulas and computer code. Doesn't mean that this impl is good tho; an infinite search for impls is much better (though to search for search, a serviceable search is needed).`,
    call(value, ctx = CurrentUsage) { return ctx === CurrentUsage && impure(), _addUsesToContext(null, ctx, ctx, ctx, value, false) },
  },

  use:{
    txt:`\`use Function Inputs Context\`: returns a non-error result of applying \`Function\` to the \`Context\` once.
Args are taken from \`Inputs\` in order or \`pick\`ed from the \`Context\` where missing.`,
    examples:[
      `Select the proper semantic type in a bank of knowledge:`,
      [
        `use undefined (either x:'AnalysisResult'->x-14:'Action' x:'onclick'->(elem 'div' (string 'This is ' x))) (15:'AnalysisResult')`,
        `1:'Action'`,
      ],
      `Can find args in \`Context\`:`,
      [
        `use (function a:2 b:3 a+b:5) (either 1:2 2:3)`,
        `3:5`,
      ],
      `Take some, find some:`,
      [
        `use (function 0 x:Int 1 x:Int) (either 5:Int) (0 1) Int='Int'`,
        `5:'Int'`,
      ],
      `Don't do this (arbitrarily-computed (non-structural) values are not hashed, so performance of finding them suffers):`,
      [
        `use (function 0 x:Int 5 x:Int) (either 5:Int x:Int->0 x:Int->5 x:Int->x x:Int->2*x) Int='Int'`,
        `5:'Int'`,
      ],
      `(\`5\` has to be provided structurally in the context (so \`x:Int->x\` and \`5:Int\` won't do to produce \`5\`), so that the search does not have to compose non-structured functions, which will infinitely balloon it.)`,
    ],
    call(v, ctx = CurrentUsage, inputs) {
      const r = _search(undefined, ctx, v !== undefined ? v : ctx, inputs, undefined)
      const result = r[0]
      _allocArray(r[1][0]), _allocArray(r[1][2]), _allocArray(r[1]), _allocArray(r)
      return result
      // .var
    },
  },

  _visitNode:{
    txt:`Remembers to visit the node in this graph search.`,
    call(ctx, v, wantedInputs, wantedOutput, actualArgs, then) {
      const node = struct(ctx, v, wantedInputs, wantedOutput, actualArgs, then)
      if (!_search.visited.has(node)) {
        _search.nodes.push(node)
        _search.visited.add(node)
        _search.values.push(v)
      }
    },
  },

  _functionComposer(shape) {
    const dec = deconstruct(shape)
    function impl(body) {
      const L = _id(label)
      const [LE = _allocMap()] = interrupt(impl)
      const PE = finish.env[L];  finish.env[L] = LE
      const prevInferred = _assign.inferred;  _assign.inferred = null
      try {
        _assign(dec[dec.length-1], body)
        if (_assign.inferred) throw 'Wait, that\'s illegal'
        return defines(_function, finish).call(_function, ...bound(LE, dec.slice(1,-1)), body)
          // This re-partially-evaluates `body`, which is as intended (so `get`s inside can remember the context they were generated in).
      } catch (err) { if (err === interrupt) interrupt(impl, 1)(LE), LE = null;  throw err }
      finally { LE !== null && _allocMap(LE), finish.env[L] = PE, _assign.inferred = prevInferred }
    }
    const d = impl[defines.key] = Object.create(null)
    d[_id(deconstruct)] = [_functionComposer, shape]
    d[_id(input)] = [dec[dec.length-1]]
    d[_id(argCount)] = 1
    _id(impl), Object.freeze(impl)
    return impl
  },

  _isStructured(v, out) {
    if (_isVar(v) || _isVar(out)) return true
    if (_isArray(v) && v[0] === _if) return _isStructured(v[2], out) || _isStructured(v[3], out)
    if (!_isArray(v) || !_isVar(v) && (!_isArray(v[0]) && defines(v[0], finish) === undefined && defines(v[0], call) === undefined || _isArray(v[0]) && !_hasCallableParts(v[0])))
      try { _assign(out, v, true); return true }
      catch (err) { return false }
  },

  _outputIsStructured(v, out = use.var) {
    if (typeof v == 'function' && !_isArray(v) && _isArray(defines(v, output))) {
      try { _assign(out, defines(v, output), true); return true }
      catch (err) { return false }
    } else if (_isUsing(v) || _isFunction(v)) {
      v = deconstruct(v), v = v[v.length-1]
      return _isStructured(v, out)
    } else
      return false
  },

  _handleNode:{
    txt:`Handles a node in this graph search: handles each item in a context, handles each arg in a function.`,
    call(node) {
      let [ctx, v, wantedInputs, wantedOutput, actualArgs, then] = node

      // If `wantedOutput` is a function, look for its output assuming its inputs and ctx then bind the function with the result.
      if (_isFunction(wantedOutput)) {
        const d = deconstruct(wantedOutput)
        const subCtx = struct(either, ...bound(x => !_isVar(x) ? undefined : _unknown(x), d.slice(1,-1), false), ctx)
        _visitNode(subCtx, _functionComposer(wantedOutput), null, use.var, null, then)
        return
      }

      let d, isMacro = false
      if (!_isArray(v) && typeof (d = defines(v, finish)) == 'function')
        // If a macro, (remember to) unwrap unknowns inside `actualArgs` and treat it as a call.
        v = d, isMacro = true


      // If `either …?` or `try …?` or defines `Usage` to be `either …?`:
      if (_isArray(d = v) && v[0] === either || !_isArray(v) && _isArray(d = defines(v, Usage)) && d[0] === either || (d = _isTry(v))) {
        // If `v` contains `wantedOutput` as-is, return that.
        let i = d.indexOf(wantedOutput)
        if (i > 0) {
          if (then) return void _visitNode(then[0], then[1], then[2], then[3], then[4] ? [...then[4], d[i]] : [d[i]], then[5])
          else return d[i] !== undefined ? d[i] : _onlyUndefined
        }

        // _visitNode with each item.
        for (i = 1; i < d.length; ++i)
          _visitNode(ctx, d[i], wantedInputs, wantedOutput, actualArgs, then)
        return
      }

      const args = typeof v != 'function' ? 0 : _isArray(d = defines(v, input)) ? d.length : defines(v, argCount)
      if (typeof v == 'function' && (!wantedInputs || args >= wantedInputs.length)) {
        if (!actualArgs)
          // The function's output structure must fit.
          if (wantedOutput !== use.var && !_outputIsStructured(v, wantedOutput)) return
        if (args && (!actualArgs || actualArgs.length < args)) {
          let nextArg
          // `input`-defining functions get treated as if their inputs are as defined.
          if (typeof v == 'function' && _isArray(defines(v, input)))
            nextArg = defines(v, input)[!actualArgs ? 0 : actualArgs.length]
          // Generated functions have their inputs read.
          else if (_isUsing(v))
            nextArg = deconstruct(v)[!actualArgs ? 2 : 2 + actualArgs.length]
          // Deconstructable functions have their inputs read.
          else if (_isFunction(v))
            nextArg = deconstruct(v)[!actualArgs ? 1 : 1 + actualArgs.length]
          // Native functions get their args either handled by `values` or non-function-derived `?`.
          else
            nextArg = use.var
          if (_isArray(nextArg) && nextArg[0] === rest)
            error("Rest args are not permitted in usage contexts:", nextArg, 'in', v)

          try {
            // If nextArg is handled by wantedInputs, move the input to actualArgs.
            _assign(nextArg, wantedInputs[0], true)
            _visitNode(ctx, v, wantedInputs.length > 1 ? wantedInputs.slice(1) : null, use.var, actualArgs ? [...actualArgs, wantedInputs[0]] : [wantedInputs[0]], then)
            return
          } catch (err) {
            // If the arg is not in `wantedInputs`, generate it from context.
            const a = _lookupValueInHashes(ctx, nextArg)
            // log('Searching in', a, 'for', nextArg, 'to fill', v)
            if (a.length)
              for (let i = 0; i < a.length; ++i)
                // To prevent infinite ballooning of search, don't visit functions if the nextArg we want is unstructured.
                if (typeof a[i] != 'function' || !_isVar(nextArg))
                  _visitNode(ctx, a[i], null, nextArg, null, node)
            _allocArray(a)
            return
          }
        } else { // Our args are complete. Apply the function.
          if (wantedInputs) return // Have to consume all wantedInputs.
          if (isMacro) actualArgs = bound(_unwrapUnknown, actualArgs, false).slice()
          // Safeguard against an inner search.
          const nodes = _search.nodes, visited = _search.visited, values = _search.values
          const prevInferred = _assign.inferred;  _assign.inferred = null
          try {
            // log('Applying', v, 'to', ...actualArgs)
            v = v.apply(v, actualArgs); _allocArray(actualArgs); if (_assign.inferred) return
            // log('  got', v)
            wantedOutput = use.var // Return unconditionally (to allow globals to define usage via `output` without de/constructing arrays everywhere).
          } catch (err) { if (err === interrupt) throw err; return }
          finally { _assign.inferred = prevInferred; _search.nodes = nodes, _search.visited = visited, _search.values = values }
        }
      }

      // Else, check the structure of `v` and return it.
      try { // (Can't interrupt.)
        if (wantedOutput !== use.var && !_isVar(wantedOutput)) _assign(wantedOutput, v, true)
        // If `then`, add to args, else return from this graph search.
        if (then) return void _visitNode(then[0], then[1], then[2], then[3], then[4] ? [...then[4], v] : [v], then[5])
        else return v !== undefined ? v : _onlyUndefined
      } catch (err) {}
    },
  },

  _logAll:{
    txt:`Logs all defined sub-functions of a value.`,
    call(f, value) {
      let [ins = defines(f, _logAll), i = 0] = interrupt(_logAll)
      try {
        if (!ins) return
        for (; i < ins.length; ++i) {
          let r
          try { r = ins[i](value) }
          catch (err) { if (err === interrupt) throw err;  log(jsRejected(err)) }
          r !== undefined && log(r !== _onlyUndefined ? r : undefined)
        }
      } catch (err) { if (err === interrupt) interrupt(_logAll, 2)(ins, i);  throw err }
    },
  },

  _search:{
    txt:`Searches the graph of structured objects connected by functions. Returns \`(Result Continuation)\` (pass \`Continuation\` to this again to continue the search, to find multiple results; do not re-use the same one) or throws.`,
    philosophy:`A potentially-optimizable search.
Nothing unthinkable. Long searches are quite expensive (especially memory-wise); re-initiating the search could alleviate that.`,
    call(cont = undefined, ctx, v = ctx, inputs = undefined, out = undefined) {
      ctx === CurrentUsage && impure()
      if (!use.var) use.var = [label]

      const us = finish.v
      let [node, nodes, visited, values] = interrupt(_search)
      const prevNodes = _search.nodes, prevVisited = _search.visited, prevValues = _search.values
      if (!nodes && !cont) {
        // Put the request in as a graph node.
        nodes = _allocArray(), visited = new Set, values = _allocArray()
        _search.nodes = nodes, _search.visited = visited, _search.values = values
        _visitNode(ctx, v, inputs, out !== undefined ? out : use.var, null, null)
      } else if (!nodes) {
        // Restore from continuation.
        [nodes, visited, values] = cont, _allocArray(cont)
        _search.nodes = nodes, _search.visited = visited, _search.values = values
      } else
        _search.nodes = nodes, _search.visited = visited, _search.values = values

      try {
        while (node !== undefined || nodes.length) {
          // Pick a node and handle it, and return if needed.
            // (If the picker chooses by the best measure, then this is quadratic time complexity. If it special-cases this particular usage pattern (pick and swap-with-end and add some new choices at the end), it could be made linear.)
          if (node === undefined) {
            const i = pick(values, us, 'The graph node to search next') // No one needs to know about all the nodes's extra stuff. Probably. …For now.
            if (_isUnknown(i)) impure()
            if (i !== i>>>0) log(finish.pure, new Error().stack), error('Expected an index, got', i)
            node = nodes[i]
            ;[nodes[nodes.length-1], nodes[i]] = [nodes[i], nodes[nodes.length-1]], nodes.pop()
            ;[values[values.length-1], values[i]] = [values[i], values[values.length-1]], values.pop()
          }
          _checkInterrupt(us)
          const r = _handleNode(node)
          if (r !== undefined) {
            const a = _allocArray(), cont = _allocArray()
            cont.push(nodes, visited, values)
            a.push(r !== _onlyUndefined ? r : undefined, cont)
            _search.nodes = _search.visited = _search.values = undefined
            return a
          }
          node = undefined
        }
        error(out !== undefined ? out : v, 'is definitely not in', ctx)
      } catch (err) { if (err === interrupt) interrupt(_search, 4)(node, nodes, visited, values);  throw err }
      finally { _search.nodes = prevNodes, _search.visited = prevVisited, _search.values = prevValues }

      // .nodes (the current array of nodes), .visited (the set of nodes visited in this search), .values (a context of values of nodes, for `pick`ing the next one)
    },
  },

  _get:{
    txt:`Like \`get\`, but returns \`(Result Continuation)\` if successful (so that the _search can be continued).`,
    call(out, ctx) {
      const prev = get.ctx
      let [sub, c = get.ctx && ctx ? struct(either, get.ctx, ctx) : get.ctx ? get.ctx : ctx] = interrupt(_get)
      get.ctx = c
      try {
        if (!sub) sub = typeof out != 'function' ? output(out, ctx) : ctx
        if (!sub) error(out, 'is definitely not in', ctx)
        return _search(undefined, ctx, sub, undefined, out)
      } catch (err) { if (err === interrupt) interrupt(_get, 1)(sub);  if (err === impure) return _unknown([_get, out, prev]);  throw err }
      finally { get.ctx = prev }
    },
  },

  get:{
    txt:`\`get OutputShape Context\` or \`get OutputShape\`: searches for a structured value from \`Context\` and all contexts used in dynamically-scoped parent searches.
\`pick\`s values/functions of \`output\` one or more times, until the first non-error application or until all options are exhausted.`,
    examples:[
      `Trivial finding:`,
      [
        `get ?:1 (either 0:1 0:2)`,
        `0:1`,
      ],
      `First-order composition:`,
      [
        `get ?:10 (either  0:1  x:1->x:3  x:3->x+4:2  x:2->x:10)`,
        `4:10`,
      ],
      `Higher-order composition:`,
      [
        `get ?:Int->?:Float (either  x:Int->x+12:34  y:34->y/2:Float)
Int='Int' Float="Float"`,
        `x:'Int'->[x+12]/2:'Float' x=?`,
      ],
      `Can give structure to values dynamically (\`x-1\` is a computation on machine numbers, not a structural rewrite):`,
      [
        `get (Next ?) (either 10 x->(Next x-1)) Next='Next'`,
        `('Next' 9)`,
      ],
      // Frankly, who cares about the things below.
//       `Prove that \`X+[1+1+1+0]\` is \`1+1+1+X\` but not \`X\`, if \`a+0\` is \`a\` and \`a+[1+b]\` is \`1+[a+b]\`:`,
//       [
//         `get  X+^^^0->^^^X  (either A+0->A A+^B->^[A+B]) X=?
// sum='Sum' quote='Next'`,
//         `X+^^^0->^^^X X=? quote='Next'`,
//       ],
//       [
//         `(get  X+^^^0->X  (either A+0->A A+^B->^[A+B]))  X=#
// sum='Sum' quote='Next'`,
//         `error X+^^^0->X 'is definitely not in' (either A+0->A A+^B->^[A+B]) X=#
// sum='Sum' quote='Next'`,
//       ],
//       `Prove that for all \`X\`, \`X*1\` is \`X\`, given \`A*0 -> 0\` and \`A+0 -> A\` and \`A*[B+1] -> A+A*B\`:`,
//       [
//         `get  X*^0->X  (either A*0->0  A+0->A  A*^B->A+A*B) X=#
// mult='Times' sum='Sum' quote='Next'`,
//         `X*^0->X  X=#
// mult='Times' quote='Next'`,
//       ],
//       `Prove that there exists an \`X\`, such that \`X*2\` is \`X\`, given \`A*0 -> 0\` and \`A+0 -> A\` and \`A*[B+1] -> A+A*B\`:`,
//       [
//         `get  X*^^0->X  (either A*0->0  A+0->A  A*^B->A+A*B) X=?
// mult='Times' sum='Sum' quote='Next'`,
//         `0*^^0->0
// mult='Times' quote='Next'`,
//       ],
//       `Can create a function from context as an arg:`,
//       [
//         `get
// (function assessIndex j (assessIndex j))
//   assessIndex = i:(Index n)->?:Measure
// (either Dataset Goal)
//   Dataset = i:(Index 100)->i+70:Image
//   Goal = i:Image->1000-i:Measure
// Index='Index' Image='Image' Measure='Measure'`,
//         `(function f j (f j))
//   f = i:('Index' 100)->1000-[i+70]:'Measure'`,
//       ],
    ],
    philosophy:`Static things may be good, but throwing them away and replacing them with a dynamic search is always better in the end.`,
    call(out, ctx) {
      const r = _get(out, ctx)
      if (_isUnknown(r)) return r[1][0] = get, r
      const result = r[0]
      _allocArray(r[1][0]), _allocArray(r[1][2]), _allocArray(r[1]), _allocArray(r)
      return result
    },
  },

  _turnComputedIntoVars(x) {
    if (_isArray(x) && !_isArray(x[0]) && (defines(x[0], finish) !== undefined || defines(x[0], call) !== undefined))
      return [label]
  },

  _unwrapUnknown(x) {
    if (_isUnknown(x) && x.length == 2) return x[1]
  },

  _clearStyle(el) {
    if (!el.style.length) el.removeAttribute('style')
    if (!el.classList.length) el.removeAttribute('class')
  },

  pick:{
    future:`Have picker-creating functions: best-of-measure and sample-measure. Have measure-combining functions and namespace.`,

    txt:`\`(pick From Cause Extra)\`: Picks any option from presented ones (an array or the count of options), returning the picked index.
Use \`picker\` to override behavior.
\`From\` can override \`pick\`.`,
    examples:[
      `\`picker\` and \`pick\` almost never get left behind:`,
      [
        `x->(picker x (pick 10))`,
        `x→(x pick 10 ^(pick 10) undefined)`,
      ],
      [
        `(X Y)→(picker Y (picker X (pick 10)))`,
        `(X Y)→(X !(function x y z (Y pick x y z)) x=? y=? z=? 10 ^(pick 10) undefined)`,
      ],
      [
        `(X Y)→(picker X (picker randomPicker (pick 10)))`,
        `(X Y)→(randomNat 10)`,
      ],
      [
        `(x y)→(picker randomPicker (picker x (pick 10)))`,
        `(x y)→(x randomNat 10 ^(pick 10) undefined)`,
      ],
    ],
    lookup:{
      picker:__is(`picker`),
    },
    philosophy:`Intended to be a target for future developments in structural learning, so that choices can be improved.`,
    call(from, cause = finish.v, extra) {
      if (_pickCount(from) === 1) return 0
      if (!_isArray(from) && typeof defines(from, pick) == 'function') return defines(from, pick)()
      if (pick.depth > pick.ers.length)
        return randomPicker(null, from)
      // Execute pick.ers[pick.ers.length - pick.depth], or record the call if _isUnknown.
      const f = pick.ers[pick.ers.length - pick.depth]
      if (!_isUnknown(f))
        try { // Consult the current picker.
          ++pick.depth
          if (f !== randomPicker) impure()
          const i = f(pick, from, cause, extra)
          if (!_isUnknown(i))
            if (typeof i != 'number' || i !== i>>>0 || i >= _pickCount(from))
              error("Expected an index less than", _pickCount(from), "but got", i)
          return i
        }
        finally { --pick.depth }
      else {
        // Forget about `pick`, stage a call.
        let [next = _nextPickerAsFunction()] = interrupt(pick)
        try {
          if (next === undefined) next = _nextPickerAsFunction()
          return finish(struct(f, next, quote(from), quote(cause), quote(extra)))
        } catch (err) { if (err === interrupt) interrupt(pick, 1)(next);  throw err }
      }
      // pick.ers (array of the current picker array), .inlineCache (for _nextPickerAsFunction), .depth (for the current index into pick.ers)
    },
  },

  _nextPickerAsFunction() {
    // Return (function a b c (CurrentPicker NextPicker a b c)), cached.
    if (pick.depth+1 > pick.ers.length) return pick
    if (pick.inlineCache[pick.ers.length - pick.depth-1])
      return pick.inlineCache[pick.ers.length - pick.depth-1]
    ++pick.depth
    try {
      const f = pick.ers[pick.ers.length - pick.depth]
      if (f === randomPicker) return randomNat
      let [a = [label], b = [label], c = [label], d] = interrupt(_nextPickerAsFunction)
      let closeOver = false
      for (let i = 0; i <= pick.ers.length - pick.depth; ++i)
        if (_isUnknown(pick.ers[i])) closeOver = true
      try {
        if (d === undefined) d = struct(f, _nextPickerAsFunction(), a, b, c)
        const r = defines(_function, finish)(a, b, c, d)
        return pick.inlineCache[pick.ers.length - pick.depth] = closeOver ? struct(closure, r) : r
      } catch (err) { if (err === interrupt) interrupt(_nextPickerAsFunction, 4)(a,b,c,d);  throw err }
    } finally { --pick.depth }
  },

  _pickCount(from) {
    if (typeof from == 'number' && from === from>>>0) return from
    if (_isArray(from)) return from.length
    error(`Invalid pick-from: expected a number or an array, got`, from)
  },

  picker:{
    txt:`Finishing \`(picker With Expr)\`: sets the function that will pick choices when evaluating \`Expr\`.
\`With\` is like \`function InnerPicker From Cause\`, copying \`From\` if needed, where \`InnerPicker\` is \`randomPicker\` unless set otherwise with this.`,
    argCount:2,
    finish(With, expr) {
      let [er] = interrupt(picker)
      try {
        if (er === undefined) {
          er = finish(With)
          if (!_isUnknown(er) && typeof er != 'function') error(er, `must be a function`)
        }
        pick.ers.push(er), pick.inlineCache.push(null)
        try {
          if (_isUnknown(er)) er = er.slice()
          const x = finish(expr)
          if (_isUnknown(x) && er !== randomPicker) {
            // See if we can get away with forgetting about `picker`.
            let b = false
            try {
              bound(x => { // Inefficient, but it works.
                if (_isArray(x) && (x[0] === pick || x[0] === _search || x[0] === use || x[0] === get || x[0] === _get)) throw b = true, null
                if (_isArray(x) && x[0] === quote) return x
              }, x[1], false)
            } catch (err) { if (err !== null) throw err }
            if (b && !_isUnknown(er)) return _stage(struct(picker, er, x[1]), x)
            if (b) return [_unknown, struct(picker, er[1], x[1]), ...er.slice(2), ...x.slice(2)]
          }
          return x
        } finally { pick.ers.pop(), pick.inlineCache.pop() }
      } catch (err) { if (err === interrupt) interrupt(picker, 1)(er);  throw err }
    },
    lookup:{
      randomPicker:__is(`randomPicker`),
      askUser:__is(`askUser`),
    },
  },

  randomPicker:{
    txt:`A \`With\` for \`picker\` that just returns \`randomNat From\`.
This is the default when no picker is specified.`,
    call(next, from) { return !finish.pure ? randomNat(from) : _unknown([randomNat, _pickCount(from)]) },
  },

  Choices:new Map,

  askUser:{
    txt:`A \`With\` for \`picker\` that pauses execution and asks the user.`,
    lookup:{
      Choices:__is(`Choices`),
    },
    examples:[
      [
        `(picker askUser (pick (1 2 3 4365)))`,
      ],
    ],
    call(next, from, cause, extra) {
      call.impure = true
      if (!askUser.got) askUser.got = new Map
      const a = struct('askUser', next, from, cause, extra)
      if (askUser.got.has(a))
        try {
          return askUser.got.get(a) !== _notFound ? askUser.got.get(a) : next(from, cause, extra)
        } finally { askUser.got.delete(a) }

      // Remember from `Choices`.
      if (Choices.has(cause)) {
        let p = Choices.get(cause)
        if (typeof p == 'function') // A decision procedure; defer to it.
          return p(next, from, cause, extra)
        if (_isArray(p) && p[0] === _disabled && p.length == 2)
          p = p[1] // For escaping functions.
        if (typeof from == 'number')
          return p
        // Find `p` in `from`.
        const i = from.indexOf(p)
        if (i <= 0) Choices.delete(cause)
        else return i-1
      }

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
        _causeInterrupt(cause, (expr, env, then, ID) => job = [expr, env, then, ID])
      }
      // Browser.
      const el = elem('div')
      if (cause !== undefined)
        el.append('Cause: ', elemValue(elemCollapse(() => serialize(cause, _langAt(), _bindingsAt(), serialize.displayed)), cause), elem('br'))
      if (extra !== undefined)
        el.append(serialize(extra, _langAt(), _bindingsAt(), serialize.displayed), elem('br'))
      el.append(elem('unimportant', 'Pick one:\n'))
      el.append(elemValue(elem('button', 'Auto'), _notFound))

      // A "remember" checkbox.
      let remember = false
      // const det = elem('details')
      // const sum = elem('summary')
      // const checkbox = elem('input')
      // checkbox.type = 'checkbox'
      // checkbox.oninput = checkbox.onchange = () => remember = checkbox.checked
      // checkbox.title = 'Remember the choice'
      // sum.append(checkbox)
      // det.append(sum)
      // el.append(det)

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
      const env = finish.env
      let job
      el.onclick = evt => {
        const t = evt.target || evt.explicitOriginalTarget
        if (t.tagName !== 'BUTTON' || !('to' in t) || t.to !== _notFound && typeof t.to != 'number') return
        if (remember) {
          const picked = typeof from == 'number' ? t.to : from[t.to-1]
          Choices.set(cause, typeof picked != 'function' ? picked : struct(_disabled, picked))
        }
        env[_id(log)] && env[_id(log)].style.removeProperty('display')
        askUser.got.set(a, t.to), _schedule(...job)
        elemRemove(el), el.onclick = null
      }
      log(el)
      env[_id(log)] && (env[_id(log)].style.display = 'none')

      _causeInterrupt(cause, (expr, env, then, ID) => job = [expr, env, then, ID])
    },
  },

  _isUsing(x) { return typeof x == 'function' && _isArray(defines(x, deconstruct)) && defines(x, deconstruct)[0] === using },

  using:{
    txt:`\`(using Context …InputShape OutputShape)\`: a function that can connect inputs to output in any way present in \`Context\`.`,
    philosophy:`This is dynamically-generating, and so can be put into contexts that contain this, to be able to generate self-referential functions.
It is said by some that true genius lies in formalizing a few really fitting things, and leaving the rest as-is; analogously, self-referential functions allow remembering and building on a few past searches, and searching dynamically elsewhere.

No matter how fancy optimization algorithms get, there is nothing more fundamental than "use any of these things in any way you want".
But to make such an immaterial thing perform as well as the particulars, must enrichen it without end: not a static self, but a search for self.
Usage suggestions pulled in and tried with but a click. Code libraries used not by naming their functions manually, but by automatically connecting user's typed inputs easily, optimized for a user's purposes. Networks of applicable meaning, made to try and discard everything as wanted. Slightly convenient.`,
    call(ctx, ...a) {
      // Return a function that does `pick(2, func) ? impl.impl(...args) : (impl.impl = get(f, ctx))(...args)`.
        // This is a really limited implementation, though it does encompass everything. A real implementation would search for the best of itself.
      const f = finish(struct(_function, ...a))
      function impl(...args) {
        let [r = impl.impl] = interrupt(impl)
        try {
          if (r === _notFound || pick(2, func, "1 to get a new implementation")) {
            r = _notFound, r = get(f, ctx)
            if (_isUnknown(r)) return _unknown(struct(using, r[1][2], ...a))
            impl.impl = r
          }
          return r.apply(impl, args)
        } catch (err) { if (err === interrupt) interrupt(impl, 1)(r);  throw err }
      }
      impl.impl = _notFound
      const d = impl[defines.key] = Object.create(null)
      d[_id(deconstruct)] = [using, ctx, ...a]
      d[_id(inline)] = false
      if (_findRest(f.slice(1,-1)) === f.length-2)
        d[_id(argCount)] = f.length-2
      Object.freeze(d), Object.seal(impl)
      return impl
    },
  },
  help:['no'],







  Eval:{
    txt:`\`(Eval String)\`: parses (cached) and evaluates String.`,
    call(s) {
      impure()
      if (typeof s != 'string') throw 'Expected a string'
      if (!Eval.cache) Eval.cache = Object.create(null)
      let [x = s in Eval.cache ? Eval.cache[s] : (Eval.cache[s] = parse(s))] = interrupt(Eval)
      if (x === _onlyUndefined) x = undefined
      try { return finish(x) }
      catch (err) { if (err === interrupt) interrupt(Eval, 1)(x !== undefined ? x : _onlyUndefined);  throw err }
      // .cache
    },
  },







  Measures:{
    txt:`A namespace for measures.`,
    lookup:{
      readMeasure:__is(`readMeasure`),
      writeMeasure:__is(`writeMeasure`),
      journalMeasures:__is(`journalMeasures`),
      peekMeasures:__is(`peekMeasures`),
      commitMeasures:__is(`commitMeasures`),
    },
  },
  readMeasure:{
    txt:`\`(readMeasure ?:Measure ?:Option):MeasureIs\`: reads the current remembered measure of an object, for use in selecting from a set of branches.`,
    call(m, obj) {
      if (m instanceof Map) {
        const j = Measure.journal
        if (j && j.has(m) && j.get(m).has(obj)) return j.get(m).get(obj)
        return m.get(obj)
      }
      if (!_isArray(m)) error('Expected either a Map or an array of read and write functions, got', m)
      return m[0](obj)
    },
  },
  writeMeasure:{
    txt:`\`(writeMeasure ?:Measure ?:Option ?:MeasureIs):Measure\`: updates the remembered measure of an object, for use in updating future selections from a set of branches.`,
    call(m, obj, is) {
      if (m instanceof Map) {
        const j = Measure.journal
        if (j instanceof Map) {
          if (!j.has(m)) j.set(m, _allocMap())
          j.get(m).set(obj, is)
        }
        return m.set(obj, is), m
      }
      if (!_isArray(m)) error('Expected either a Map or an array of read and write functions, got', m)
      return m[1](obj, is), m
    },
  },
  journalMeasures:{
    txt:`\`(journalMeasures Func …Args):Journal\`: returns a journal that can be applied with \`commitMeasures\`.`,
    output:['Deferred measure changes', [__is(`label`)]],
    call(f, ...args) {
      const prev = Measure.journal
      let [next = _allocMap()] = interrupt(journalMeasures)
      Measure.journal = next
      try {
        return [f.apply(f, args), Measure.journal]
      } catch (err) { if (err === interrupt) interrupt(journalMeasures, 1)(next);  throw err}
      finally { Measure.journal = prev }
    },
  },

  peekMeasures:{
    txt:`\`(peekMeasures ?:Journal):Result\`: Returns the result contained in a journal without applying the journal.`,
    input:[['Deferred measure changes', [__is(`label`)]]],
    output:['Output', [__is(`label`)]],
    argCount:1,
    call(journal) { return journal[0] },
  },

  commitMeasures:{
    txt:`\`(commitMeasures ?:Journal):Result\`: performs the actual writes stored in a journal, and returns its result. A journal can only be committed once.`,
    input:[['Deferred measure changes', [__is(`label`)]]],
    output:['Output', [__is(`label`)]],
    argCount:1,
    call(journal) { return journal[1].forEach(_commitMeasureChanges), _allocMap(journal[1]), journal[0] },
  },

  _commitMeasureChanges(changes,m) { changes.forEach(_commitMeasureChange, m), _allocMap(changes) },
  _commitMeasureChange(v,k) { writeMeasure(this, k, v) },







  context:{
    txt:`\`(context …Functions)\`: creates a context that consists of functions and/or contexts, for use with \`compose\`.
Each function must define \`context\` as \`(…InputTypes OutputType)\` (or a function of \`OutputType\` to be a context, or a map).`,
    philosophy:`These types are just markers, not potentially-infinite families like \`V:T\` on actual function inputs/outputs allows. We move beyond imposition of a particular (AKA limited and thus ultimately fragile) structure on objects, and instead allow contexts to override search arbitrarily (via being a function from \`OutputType\` to a disposable array of all functions that likely return that).`,
    noInterrupt:true,
    merge:true,
    lookup:{
      numbersRandomSearch:__is(`numbersRandomSearch`),
      atan:__is(`atan`),
      Eval:__is(`Eval`),
    },
    call(...f) {
      const m = _allocMap()
      if (!context.got) context.got = new Set, context.ctx = Symbol('customContext')
      context.m = m
      try { add(f) }
      finally { context.got.clear(), context.m = undefined }

      let result
      if (!m.has(context.ctx))
        result = function(out) { let a;  return !m.has(out) ? null : (a = _allocArray(), a.push(...m.get(out)), a) }
      else
        result = function impl(out) {
          // Does the same as `return [m.get(out) || [], ...m.get(context.ctx).map(c => c(out) || [])].flat()` if disregarding interrupts.
          if (!m.has(out)) return null
          const c = m.get(context.ctx)
          let [a = _allocArray(), i = c.length] = interrupt(impl)
          try {
            if (i === c.length) a.push(...m.get(out)), i = 0
            for (; i < c.length; ++i)
              { const r = c[i](out);  _isArray(r) && (a.push(...r), _allocArray(r)) }
            return a
          } catch (err) { if (err === interrupt) err(impl, 2)(a, i);  throw err }
        }
      const d = result[defines.key] = Object.create(null)
      d[_id(context)] = m
      d[_id(deconstruct)] = struct(context, ...f)
      d[_id(argCount)] = 1
      Object.freeze(d)
      return result

      function add(v) {
        // Fill a Map, from output types to arrays of functions, opening contexts inside.
        // Also go into `lookup` children (object/map/array values) for much increased convenience. Only arrays directly in definitions of `context` have special form.
        if (context.got.has(v)) return; else context.got.add(v)
        if (_isArray(v)) {
          for (let i = 0; i < v.length; ++i) add(v[i])
        } else if (defines(v, context) !== undefined) {
          let d = defines(v, context)
          const m = context.m
          if (typeof d == 'function') { // Invoke and add the result (if any) to options every time.
            if (!m.has(context.ctx)) m.set(context.ctx, _allocArray())
            m.get(context.ctx).push(d)
            return
          }
          if (_isArray(d)) {
            // `(…InputTypes OutputType)`
            d = d[d.length-1]
            if (!m.has(d)) m.set(d, _allocArray())
            m.get(d).push(v)
            return
          }
          add(d)
        } else if (v instanceof Map) {
          v.forEach(add)
        } else if (defines(v, lookup) !== undefined) {
          lookup(v).forEach(k => add(v[k]))
        } else if (v && (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null)) {
          Object.keys(v).forEach(k => add(v[k]))
        } // Else ignore v.
      }

      // .got, .ctx, .m
    },
  },

  compose:{
    txt:`\`(compose Context …InputTypes OutputType)\`: generates a function that connects inputs of specified types to output.
A function can define \`compose Context …InputExprs OutputType\` to stage any code it wants in place of itself (or throw to deny composition in this case).

(Largely superseded by \`alt\` and \`bestFunction\`: most of the time, most of the structure that is learned on is fine, and only needs a few changes sometimes.)`,
    examples:[
      [
        `(compose (context F G) 'In' 'Out')
F=(concept { call x->x+1 context ('In' 'Med') })
G=(concept { call x->x*2 context ('Med' 'Out') })`,
        `a→[G (F a) Med='Med'] a=?
F=(concept { call x->x+1 context ('In' 'Med') })
G=(concept { call x->x*2 context ('Med' 'Out') })`,
      ],
    ],
    lookup:{
      context:__is(`context`),
      getExpr:__is(`getExpr`),
    },
    call(ctx, ...types) {
      // None of this works well…
      const out = types[types.length-1], us = finish.v
      let [exprs, vars] = interrupt(compose)
      if (exprs === undefined) {
        exprs = _allocMap()
        vars = _allocArray()
        for (let i=0; i < types.length-1; ++i) // Have each input in `exprs` (and in `vars`).
          !exprs.has(types[i]) && exprs.set(types[i], _allocArray()), exprs.get(types[i]).push(vars[i] = [label])
      }
      let resultExpr
      try { resultExpr = getExpr(ctx, exprs, out) }
      catch (err) { if (err === interrupt) err(compose, 2)(exprs, vars), exprs = null;  throw err }
      finally { exprs && _allocMap(exprs) }

      const result = function impl(...args) {
        if (typeof impl.compiled != 'function') impl.compiled = compile(_compileOpts(impl), ...vars, resultExpr)
        return impl.compiled(...args)
      }
      result.compiled = compile(_compileOpts(result), ...vars, resultExpr)
      const d = result[defines.key] = Object.create(null)
      d[_id(argCount)] = types.length-1
      d[_id(deconstruct)] = struct(_function, ...vars, resultExpr)
      d[_id(context)] = types
      Object.freeze(d)
      return result
    },
  },


  getExpr:{
    txt:`Generates and remembers an expression of a type.`,
    call(Static, Dynamic, out) {
      // A complex interrupt/free game here.
      const us = finish.v
      let [options, i, firstStep, expr, j = 0, known = true, ints = _allocArray()] = interrupt(compose)
      try {
        _checkInterrupt()
        while (true) {
          // Get our options: those of the context and those of Dynamic.get(out).
          if (options === undefined) {
            options = Static(out)
            if (!options && !Dynamic.has(out)) error(out, 'is not in', Static)
            if (!options) options = _allocArray()
            Dynamic.has(out) && options.push(...Dynamic.get(out))
            ints.length = options.length
          }
          if (!options.length) error(out, 'is not in', Static)
          if (firstStep === undefined) firstStep = finish.env[_id(step)]

          // On first entry, just pick an option.
          if (i === undefined) i = pick(options, us, out)
          // If we interrupted here or down below, remember and clean option's re-entry state (if down below), re-pick i, and restore the re-entry state.
          else if (options.length > 1 && Math.random()<.1) if (ints[i] || expr !== undefined) {
            // This reduces generated expression complexity without ruling out any possibilities (potentially, from infinity, in cycles).
            if (!ints[i]) {
              ints[i] = _allocArray();  ints[i].push(expr, j, known, finish.env[_id(interrupt)], finish.env[_id(step)])
              expr = undefined, j = 0, known = true, finish.env[_id(interrupt)] = _allocArray(), finish.env[_id(step)] = firstStep+1
            }
            const next = pick(options, us, out)
            if (ints[next])
              [expr, j, known, finish.env[_id(interrupt)], finish.env[_id(step)]] = ints[next], _allocArray(ints[next]), ints[next] = null
            i = next
          }

          let f = options[i], d = !_isArray(f) && defines(f, context)
          if (_isArray(d)) {
            // getExpr every input, then add [f, ...inputs] to `Dynamic`.
            if (!expr) expr = _allocArray()
            // log('Getting inputs', ...d.slice(0,-1), 'for', f)
            for (; j < d.length-1; ++j) {
              const r = getExpr(Static, Dynamic, d[j])
              if (_isArray(r)) known = false
              expr.push(r)
            }
            // log('  got', d[d.length-1], ...expr)
            try {
              if (typeof defines(f, compose) == 'function') {
                const r = defines(f, compose)(Static, ...expr, out)
                if (r !== undefined) f = r, _allocArray(expr)
                else expr.unshift(f), f = expr
              }
              // Else peval.
                // …We probably want to do this only after the search, right?
              else if (known || !_isArray(f) && defines(f, inline)) {
                if (!_isArray(f) && typeof defines(f, finish) == 'function')
                  f = defines(f, finish).apply(f, expr), _allocArray(expr)
                else if (typeof f == 'function')
                  f = f.apply(f, expr), _allocArray(expr)
                else error('Creating structs is not allowed during search:', f)
              }
              else expr.unshift(f), f = expr
            } catch (err) { // If our override throws, remove this option and search for another one.
              if (err === interrupt) throw err
              // log('Error for', f, ...expr, ':', jsRejected(err))
              ;[options[i], options[options.length-1]] = [options[options.length-1], options[i]], options.pop()
              ;[ints[i], ints[ints.length-1]] = [ints[ints.length-1], ints[i]], ints.pop()
              _allocArray(expr)
              i = undefined, expr = undefined, j = 0
              continue
            }
          }
          // Remember and return the option.
            // ### Should we remember the escaped option instead (and unescape it if picked), so that functions (`context`-definers) can actually be returned? Or would we wrap all such functions in extra arrays?
          !Dynamic.has(out) && Dynamic.set(out, _allocArray()), Dynamic.get(out).push(f)
          _allocArray(options)
          _allocArray(ints)
          return f
        }
      } catch (err) { if (err === interrupt) err(compose, 7)(options, i, firstStep, expr)(j, known, ints); else _allocArray(ints);  throw err }
    },
  },

























  atan(x) { return Math.atan(x) },
  numbersRandomSearch:` ;="repeat (Eval numbersRandomSearch)"
    compose
    (context
      ;='A goal to maximize, fitting to some function.'
      (concept { call x -> 0-a*a context ('Output' 'Performance') a=[x-(atan [x + x*x/11])] })
        ;='Maybe we also want to take the initial-info thing here? Or at least the input. …Yeah, we really don''t want to find a root of an equation, we want to approximate a function.'

      ;='Input is a number. Output is a number.'
      (concept { call id compose (function ctx x x) context ('Input' 'Number') })
      (concept { call id compose (function ctx x x) context ('Number' 'Output') })

      ;='Allow single-number generation and basic arithmetic operations.'
      (concept { call (function 0) context ('Number') })
      (concept { call (function 1) context ('Number') })
      (concept { call sum compose (jsEval "(ctx,a,b) => !a ? b : !b ? a : typeof a == 'number' && typeof b == 'number' ? a+b : [sum,a,b]" {'sum' sum}) context ('Number' 'Number' 'Number') })
      (concept { call subtract compose (jsEval "(ctx,a,b) => !b ? a : typeof a == 'number' && typeof b == 'number' ? a-b : [subtract,a,b]" {'subtract' subtract}) context ('Number' 'Number' 'Number') })
      (concept { call mult compose (jsEval "(ctx,a,b) => !a || !b ? 0 : a === 1 ? b : b === 1 ? a : typeof a == 'number' && typeof b == 'number' ? a*b : [mult,a,b]" {'mult' mult}) context ('Number' 'Number' 'Number') })
      (concept { call divide compose (jsEval "(ctx,a,b) => !b ? errorFast() : b === 1 ? a : typeof a == 'number' && typeof b == 'number' ? a/b : [divide,a,b]" {'divide' divide}) context ('Number' 'Number' 'Number') })

      ;='Allow comparisons and branching.'
      (concept { call (jsEval '(a,b) => a<b') context ('Number' 'Number' 'Boolean') })
      (concept { call (jsEval '(a,b) => a===b') context ('Number' 'Number' 'Boolean') })
      (concept { finish (defines if finish) context ('Boolean' 'Number' 'Number' 'Number') })

      ;='Allow setting up and modifying state. …Except, shouldn''t state be local to decision sites, and be completely contained in measures anyway?'
      (concept { call id compose (function ctx x x) context ('State' 'Number') })
      (concept { call id compose (function ctx x x) context ('Number' 'State') })

      ;='And allow feedback of performance into state… And an expr-run+eval function, taking Input and State and producing Performance…'
      ;='The — run, evaluate performance, adjust — cycle… And each function must know how it was produced, and *that* can be copied and adjusted too…'
      ;='And a picker… And measures…'
        ;='All of these are really important; without them, nothing can ever be done.'
    )
    'Input'
    'Performance'
  `,







  addSearchElem:{
    txt:`Adds an element that can search for a string in a DOM tree, collapsing all that do not contain such things.`,
    call(el) {
      const container = elem('div')
        const row = elem('div')
        const str = elem('input')
        str.type = 'text'
        str.title = 'Search for this.'
        const end = elem('button', '❌')
        end.onclick = () => { const h = _smoothHeightPre(container); container.replaceWith(el); _smoothHeightPost(el, h) }
        row.append(str, end)
      el.replaceWith(container)
      container.append(el)
      elemInsert(container, row, el)
      let ID = null
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
        const env = _newExecutionEnv()
        ID !== null && _cancel(ID)
        _doJob([last, [search, el], () => ID = null], env, id, ID = _newJobId())

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
            finish.env = env
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
            } catch (err) { if (err === interrupt) err(search, 9)(v, anyTrue, anyFalse, i1)(ch1, next1, i2, ch2)(next2), v = null;  throw err }
            finally { v && _allocArray(v) }
          }
        }
      }, .5)
    },
  },



































  blame:{
    txt:`\`blame Expr\` or \`blame Expr Feedback\`: returns the (disposable) stack trace of what \`alt\` needs to change in \`Expr\`. Can be overriden by functions in \`Expr\`.`,
    call(expr, feedback) {
      if (!blame.visited) blame.visited = new Set, blame.result = [], blame.trace = []
      const empty = !blame.visited.size, pfb = blame.feedback
      const {result, n, knownBits, knownBitsCount} = blame
      try {
        blame.trace = _allocArray()
        blame.result = _allocArray(), blame.feedback = feedback
        blame.n = 0, blame.knownBits = 0, blame.knownBitsCount = 0
        _blameAccumulate(expr) // <- The actual body
        
        return blame.result
      } finally { // Ensure that we (mostly) restore previous state to allow blame-in-blame.
        empty && blame.visited.clear(), _allocArray(blame.trace)
        blame.feedback = pfb
        blame.result = result, blame.n = n, blame.knownBits = knownBits, blame.knownBitsCount = knownBitsCount
      }

      // .visited, .result, .trace; .feedback; .n, .knownBits, .knownBitsCount
    },
  },
  
  _blameAccumulate(x) {
    if (!_isArray(x) || !x.length) return
    if (!_isArray(x[0]) && typeof defines(x[0], blame) == 'function')
      return defines(x[0], blame)(x, blame.feedback)
    if (blame.visited.has(x)) return; else blame.visited.add(x)
    blame.trace.push(x)
    let [i = x.length] = interrupt(blame)
    try {
      if (i === x.length && !_isArray(x[0]) && _isArray(defines(x[0], alt))) {
        // See if we pick `x`.
        // To not need to waste time and memory on storing traces of every single graph node, pick it dynamically: assume a power-of-two node count, generate the picked node's index least-significant-bit-first, and do not pick nodes with indexes that do not fit known-so-far bits. (Frequencies of just-over-last-power-of-two indexes are dramatically lower though.)
        if (blame.n === blame.knownBits) blame.result.length = 0, blame.result.push(...blame.trace)
        if ((blame.n & ++blame.n) === 0) // When index becomes a power of 2, generate the next picked bit.
          blame.knownBits = ((Math.random() < .5 ? 0 : 1) << blame.knownBitsCount++) + blame.knownBits
      }
      if (i === x.length) i = 0
      // Accumulate all children of `x`.
      for (; i < x.length; ++i) _blameAccumulate(x[i])
    } catch (err) { if (err === interrupt) err(blame, 1)(i);  throw err }
    finally { blame.trace.pop() }
  },

  alt:{
    txt:`\`alt Expr\` or \`alt Expr Feedback\`: replaces any part of \`Expr\` in-place in a defined manner, for changing structure.
Functions' overrides of \`alt\` will be consulted to pick an alternative (either a function that accepts the expr trace (the result of \`blame\`) or an array of from-pattern and to-pattern).`,
    philosophy:`As long as one little reference to the generative "absolutely anything" is accessible, even the littlest thing can grow into the largest and most advanced thing. That possibility vs not is the main difference between what humans do and what they have done.

Working with and applying code equivalencies is done at dev time and in logic and such; the made code only does one path, judged sufficient. Alt application can itself be adjusted and improved, like memorizing and reinforcing useful alt chains.`,
    future:[
      `"When executed, finish the first thing, but when alt-ed, swap the first and the random thing" — \`any …Branches\`.`,
      `A rule like "mult a random number by 1.2 and see what happens" or "merge these two measure-spots" or "don't do this choice dynamically, just pick the most likely" or "change a measuring/adjusting spot, and see how the goal changes" or "add the minimize-runtime adjuster here".`,
      `A completely random generator of functions and their \`alt\`ernatives and \`blame\`rs and \`adjust\`ments.`,
    ],
    lookup:{
      blame:__is(`blame`),
    },
    call(expr, feedback) {
      let [trace, picked] = interrupt(alt)
      try {
        if (trace === undefined) {
          trace = blame(expr, feedback)
          if (!_isArray(trace)) return
          let i = trace.length, a // Make sure that trace[trace.length-1] overrides `alt` properly.
          while (i && !_isArray(a = defines(trace[i], alt))) --i
          if (!i) return expr
          trace.length = i+1
          picked = a[Math.floor(Math.random() * a.length)]
        }
        let into
        if (typeof picked == 'function') into = picked(trace) // Pass in the expr trace.
        else if (_isArray(picked) && picked.length == 2) {
          // If an array of two (from→to), assign `from` then bind `to`.
          const e = finish.env, L = _id(label)
          const prevL = e[L], prevI = _assign.inferred;  e[L] = _allocMap(), _assign.inferred = undefined
          try { _assign(picked[0], trace[trace.length-1]), into = bound(e[L], picked[1]) }
          catch (err) {}
          finally { _allocMap(e[L]), e[L] = prevL, _assign.inferred = prevI }
        }
        else error('An alt should be a function or a rewriting rule, got', picked)
        _isArray(into) && replaceArray(trace[trace.length-1], into)
        return expr
      } catch (err) { if (err === interrupt) err(alt, 2)(trace, picked), trace = null;  throw err }
      finally { trace && _allocArray(trace) }
    },
  },

  proposeFunction:{
    txt:`Attempts to (in-place) replace a function with another function if supported.`,
    call(func, newFunc) { if (!_isArray(func) && typeof defines(func, proposeFunction) == 'function') defines(func, proposeFunction)(newFunc) },
  },

  bestFunction:{
    txt:`Returns a function that can be replaced by any better implementation.`,
    lookup:{
      proposeFunction:__is(`proposeFunction`),
    },
    call(initial, measure) {
      if (typeof initial != 'function' || typeof measure != 'function') error('Expected functions, got', initial, measure)
      let curMeasurement = measure(initial)
      function patchable(...args) { return patchable.d[1].apply(this, args) }
      patchable.d = [bestFunction, initial, measure]
      return concept(map(
        proposeFunction, newFunc => {
          if (typeof newFunc != 'function') error('Expected function, got', newFunc)
          const m = measure(newFunc)
          return m > curMeasurement ? (patchable.d[1] = newFunc, curMeasurement = m, true) : false
        },
        deconstruct, patchable.d,
        call, patchable,
      ))
    },
  },

  adjust:{
    txt:`\`adjust Expr Change\`: modifies \`Expr\` by propagating \`Change\` from result into holes that accept it, for learning in a structure.

…No, this isn't enough to specify backprop: while it's technically possible to preserve the last inputs/output, the state in complex function call graphs is lost.
This should be removed.
The proper way would be to return an array of result and the expression that would adjust the function (or \`adjustable Result AdjustExpr\`), and partially-evaluate both near using measure.`,
    /*
    - Have adjust-via-backprop ops. (Integrate the currently-most-complete web-oriented ML lib, Tensorflow.js?)
    */
    call(expr, ch) {
      if (!_isArray(expr)) return
      if (!_isArray(expr[0]) && typeof defines(expr[0], adjust) == 'function')
        return defines(expr[0], adjust)(expr, ch)

      // expr.forEach(item => adjust(item, ch))
      let [i = 0] = interrupt(adjust)
      try {
        for (; i < expr.length; ++i)
          adjust(expr[i], ch)
        // If expr[i] is shared, we do nothing special here and just allow exponential explosions.
      } catch (err) { if (err === interrupt) err(adjust, 1)(i);  throw err }
    },
  },

  Search:{
    txt:`A search for a search.`,
    lookup:[
      __is(`Usage`),
      __is(`compose`),
      __is(`Measures`),
      __is(`bestFunction`),
      __is(`adjust`),
      __is(`alt`),
    ],
  },












})
})()