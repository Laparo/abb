import {
  A as S,
  B as p,
  C as L,
  D as $,
  E as V,
  G as q,
  H,
  I as A,
  J as R,
  K as W,
  r as G,
  L as T,
  M as J,
  N as Q,
  O as X,
  n as Y,
  P as Z,
  Q as I,
  R as x,
  S as K,
} from '#entry'
function k(n) {
  return typeof n == 'string' ? `'${n}'` : new ee().serialize(n)
}
const ee = (function () {
    class n {
      #e = new Map()
      compare(e, t) {
        const s = typeof e,
          i = typeof t
        return s === 'string' && i === 'string'
          ? e.localeCompare(t)
          : s === 'number' && i === 'number'
            ? e - t
            : String.prototype.localeCompare.call(this.serialize(e, !0), this.serialize(t, !0))
      }
      serialize(e, t) {
        if (e === null) return 'null'
        switch (typeof e) {
          case 'string':
            return t ? e : `'${e}'`
          case 'bigint':
            return `${e}n`
          case 'object':
            return this.$object(e)
          case 'function':
            return this.$function(e)
        }
        return String(e)
      }
      serializeObject(e) {
        const t = Object.prototype.toString.call(e)
        if (t !== '[object Object]')
          return this.serializeBuiltInType(t.length < 10 ? `unknown:${t}` : t.slice(8, -1), e)
        const s = e.constructor,
          i = s === Object || s === void 0 ? '' : s.name
        if (i !== '' && globalThis[i] === s) return this.serializeBuiltInType(i, e)
        if (typeof e.toJSON == 'function') {
          const r = e.toJSON()
          return (
            i + (r !== null && typeof r == 'object' ? this.$object(r) : `(${this.serialize(r)})`)
          )
        }
        return this.serializeObjectEntries(i, Object.entries(e))
      }
      serializeBuiltInType(e, t) {
        const s = this['$' + e]
        if (s) return s.call(this, t)
        if (typeof t?.entries == 'function') return this.serializeObjectEntries(e, t.entries())
        throw new Error(`Cannot serialize ${e}`)
      }
      serializeObjectEntries(e, t) {
        const s = Array.from(t).sort((r, c) => this.compare(r[0], c[0]))
        let i = `${e}{`
        for (let r = 0; r < s.length; r++) {
          const [c, o] = s[r]
          ;((i += `${this.serialize(c, !0)}:${this.serialize(o)}`), r < s.length - 1 && (i += ','))
        }
        return i + '}'
      }
      $object(e) {
        let t = this.#e.get(e)
        return (
          t === void 0 &&
            (this.#e.set(e, `#${this.#e.size}`), (t = this.serializeObject(e)), this.#e.set(e, t)),
          t
        )
      }
      $function(e) {
        const t = Function.prototype.toString.call(e)
        return t.slice(-15) === '[native code] }'
          ? `${e.name || ''}()[native]`
          : `${e.name}(${e.length})${t.replace(/\s*\n\s*/g, '')}`
      }
      $Array(e) {
        let t = '['
        for (let s = 0; s < e.length; s++)
          ((t += this.serialize(e[s])), s < e.length - 1 && (t += ','))
        return t + ']'
      }
      $Date(e) {
        try {
          return `Date(${e.toISOString()})`
        } catch {
          return 'Date(null)'
        }
      }
      $ArrayBuffer(e) {
        return `ArrayBuffer[${new Uint8Array(e).join(',')}]`
      }
      $Set(e) {
        return `Set${this.$Array(Array.from(e).sort((t, s) => this.compare(t, s)))}`
      }
      $Map(e) {
        return this.serializeObjectEntries('Map', e.entries())
      }
    }
    for (const a of ['Error', 'RegExp', 'URL'])
      n.prototype['$' + a] = function (e) {
        return `${a}(${e})`
      }
    for (const a of [
      'Int8Array',
      'Uint8Array',
      'Uint8ClampedArray',
      'Int16Array',
      'Uint16Array',
      'Int32Array',
      'Uint32Array',
      'Float32Array',
      'Float64Array',
    ])
      n.prototype['$' + a] = function (e) {
        return `${a}[${e.join(',')}]`
      }
    for (const a of ['BigInt64Array', 'BigUint64Array'])
      n.prototype['$' + a] = function (e) {
        return `${a}[${e.join('n,')}${e.length > 0 ? 'n' : ''}]`
      }
    return n
  })(),
  te = [
    1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635,
    1541459225,
  ],
  ae = [
    1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548,
    -1424204075, -670586216, 310598401, 607225278, 1426881987, 1925078388, -2132889090, -1680079193,
    -1046744716, -459576895, -272742522, 264347078, 604807628, 770255983, 1249150122, 1555081692,
    1996064986, -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585,
    113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051,
    -2117940946, -1838011259, -1564481375, -1474664885, -1035236496, -949202525, -778901479,
    -694614492, -200395387, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571,
    1322822218, 1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872,
    -1866530822, -1538233109, -1090935817, -965641998,
  ],
  se = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
  j = []
class ne {
  _data = new z()
  _hash = new z([...te])
  _nDataBytes = 0
  _minBufferSize = 0
  finalize(a) {
    a && this._append(a)
    const e = this._nDataBytes * 8,
      t = this._data.sigBytes * 8
    return (
      (this._data.words[t >>> 5] |= 128 << (24 - (t % 32))),
      (this._data.words[(((t + 64) >>> 9) << 4) + 14] = Math.floor(e / 4294967296)),
      (this._data.words[(((t + 64) >>> 9) << 4) + 15] = e),
      (this._data.sigBytes = this._data.words.length * 4),
      this._process(),
      this._hash
    )
  }
  _doProcessBlock(a, e) {
    const t = this._hash.words
    let s = t[0],
      i = t[1],
      r = t[2],
      c = t[3],
      o = t[4],
      m = t[5],
      l = t[6],
      f = t[7]
    for (let u = 0; u < 64; u++) {
      if (u < 16) j[u] = a[e + u] | 0
      else {
        const d = j[u - 15],
          y = ((d << 25) | (d >>> 7)) ^ ((d << 14) | (d >>> 18)) ^ (d >>> 3),
          w = j[u - 2],
          B = ((w << 15) | (w >>> 17)) ^ ((w << 13) | (w >>> 19)) ^ (w >>> 10)
        j[u] = y + j[u - 7] + B + j[u - 16]
      }
      const _ = (o & m) ^ (~o & l),
        h = (s & i) ^ (s & r) ^ (i & r),
        v = ((s << 30) | (s >>> 2)) ^ ((s << 19) | (s >>> 13)) ^ ((s << 10) | (s >>> 22)),
        g = ((o << 26) | (o >>> 6)) ^ ((o << 21) | (o >>> 11)) ^ ((o << 7) | (o >>> 25)),
        D = f + g + _ + ae[u] + j[u],
        b = v + h
      ;((f = l), (l = m), (m = o), (o = (c + D) | 0), (c = r), (r = i), (i = s), (s = (D + b) | 0))
    }
    ;((t[0] = (t[0] + s) | 0),
      (t[1] = (t[1] + i) | 0),
      (t[2] = (t[2] + r) | 0),
      (t[3] = (t[3] + c) | 0),
      (t[4] = (t[4] + o) | 0),
      (t[5] = (t[5] + m) | 0),
      (t[6] = (t[6] + l) | 0),
      (t[7] = (t[7] + f) | 0))
  }
  _append(a) {
    ;(typeof a == 'string' && (a = z.fromUtf8(a)),
      this._data.concat(a),
      (this._nDataBytes += a.sigBytes))
  }
  _process(a) {
    let e,
      t = this._data.sigBytes / 64
    a ? (t = Math.ceil(t)) : (t = Math.max((t | 0) - this._minBufferSize, 0))
    const s = t * 16,
      i = Math.min(s * 4, this._data.sigBytes)
    if (s) {
      for (let r = 0; r < s; r += 16) this._doProcessBlock(this._data.words, r)
      ;((e = this._data.words.splice(0, s)), (this._data.sigBytes -= i))
    }
    return new z(e, i)
  }
}
class z {
  words
  sigBytes
  constructor(a, e) {
    ;((a = this.words = a || []), (this.sigBytes = e === void 0 ? a.length * 4 : e))
  }
  static fromUtf8(a) {
    const e = unescape(encodeURIComponent(a)),
      t = e.length,
      s = []
    for (let i = 0; i < t; i++) s[i >>> 2] |= (e.charCodeAt(i) & 255) << (24 - (i % 4) * 8)
    return new z(s, t)
  }
  toBase64() {
    const a = []
    for (let e = 0; e < this.sigBytes; e += 3) {
      const t = (this.words[e >>> 2] >>> (24 - (e % 4) * 8)) & 255,
        s = (this.words[(e + 1) >>> 2] >>> (24 - ((e + 1) % 4) * 8)) & 255,
        i = (this.words[(e + 2) >>> 2] >>> (24 - ((e + 2) % 4) * 8)) & 255,
        r = (t << 16) | (s << 8) | i
      for (let c = 0; c < 4 && e * 8 + c * 6 < this.sigBytes * 8; c++)
        a.push(se.charAt((r >>> (6 * (3 - c))) & 63))
    }
    return a.join('')
  }
  concat(a) {
    if (
      ((this.words[this.sigBytes >>> 2] &= 4294967295 << (32 - (this.sigBytes % 4) * 8)),
      (this.words.length = Math.ceil(this.sigBytes / 4)),
      this.sigBytes % 4)
    )
      for (let e = 0; e < a.sigBytes; e++) {
        const t = (a.words[e >>> 2] >>> (24 - (e % 4) * 8)) & 255
        this.words[(this.sigBytes + e) >>> 2] |= t << (24 - ((this.sigBytes + e) % 4) * 8)
      }
    else
      for (let e = 0; e < a.sigBytes; e += 4)
        this.words[(this.sigBytes + e) >>> 2] = a.words[e >>> 2]
    this.sigBytes += a.sigBytes
  }
}
function re(n) {
  return new ne().finalize(n).toBase64()
}
function C(n) {
  return re(k(n))
}
const ie = { trailing: !0 }
function oe(n, a = 25, e = {}) {
  if (((e = { ...ie, ...e }), !Number.isFinite(a)))
    throw new TypeError('Expected `wait` to be a finite number')
  let t,
    s,
    i = [],
    r,
    c
  const o = (f, u) => (
      (r = ce(n, f, u)),
      r.finally(() => {
        if (((r = null), e.trailing && c && !s)) {
          const _ = o(f, c)
          return ((c = null), _)
        }
      }),
      r
    ),
    m = function (...f) {
      return (
        e.trailing && (c = f),
        r ||
          new Promise((u) => {
            const _ = !s && e.leading
            ;(clearTimeout(s),
              (s = setTimeout(() => {
                s = null
                const h = e.leading ? t : o(this, f)
                c = null
                for (const v of i) v(h)
                i = []
              }, a)),
              _ ? ((t = o(this, f)), u(t)) : i.push(u))
          })
      )
    },
    l = (f) => {
      f && (clearTimeout(f), (s = null))
    }
  return (
    (m.isPending = () => !!s),
    (m.cancel = () => {
      ;(l(s), (i = []), (c = null))
    }),
    (m.flush = () => {
      if ((l(s), !c || r)) return
      const f = c
      return ((c = null), o(this, f))
    }),
    m
  )
}
async function ce(n, a, e) {
  return await n.apply(a, e)
}
const le = Symbol.for('nuxt:client-only'),
  ue = (n) => n === 'defer' || n === !1
function fe(...n) {
  const a = typeof n[n.length - 1] == 'string' ? n.pop() : void 0
  de(n[0], n[1]) && n.unshift(a)
  let [e, t, s = {}] = n
  const i = S(() => p(e))
  if (typeof i.value != 'string') throw new TypeError('[nuxt] [useAsyncData] key must be a string.')
  if (typeof t != 'function')
    throw new TypeError('[nuxt] [useAsyncData] handler must be a function.')
  const r = L()
  ;((s.server ??= !0),
    (s.default ??= ye),
    (s.getCachedData ??= N),
    (s.lazy ??= !1),
    (s.immediate ??= !0),
    (s.deep ??= $.deep),
    (s.dedupe ??= 'cancel'),
    s._functionName,
    r._asyncData[i.value])
  const c = { cause: 'initial', dedupe: s.dedupe }
  r._asyncData[i.value]?._init ||
    ((c.cachedData = s.getCachedData(i.value, r, { cause: 'initial' })),
    (r._asyncData[i.value] = U(r, i.value, t, s, c.cachedData)))
  const o = r._asyncData[i.value]
  o._deps++
  const m = () => r._asyncData[i.value].execute(c),
    l = s.server !== !1 && r.payload.serverRendered
  {
    let _ = function (d) {
      const y = r._asyncData[d]
      y?._deps && (y._deps--, y._deps === 0 && y?._off())
    }
    const h = V()
    if ((h && l && s.immediate && !h.sp && (h.sp = []), h && !h._nuxtOnBeforeMountCbs)) {
      h._nuxtOnBeforeMountCbs = []
      const d = h._nuxtOnBeforeMountCbs
      ;(q(() => {
        ;(d.forEach((y) => {
          y()
        }),
          d.splice(0, d.length))
      }),
        H(() => d.splice(0, d.length)))
    }
    const v = h && (h._nuxtClientOnly || A(le, !1))
    l && r.isHydrating && (o.error.value || o.data.value != null)
      ? ((o.pending.value = !1), (o.status.value = o.error.value ? 'error' : 'success'))
      : h && ((!v && r.payload.serverRendered && r.isHydrating) || s.lazy) && s.immediate
        ? h._nuxtOnBeforeMountCbs.push(m)
        : s.immediate && m()
    const g = Z(),
      D = R(
        i,
        (d, y) => {
          if ((d || y) && d !== y) {
            const w = r._asyncData[y]?.data.value !== $.value,
              B = r._asyncDataPromises[y] !== void 0
            y && _(y)
            const O = { cause: 'initial', dedupe: s.dedupe }
            if (!r._asyncData[d]?._init) {
              let P
              ;(y && w
                ? (P = r._asyncData[y]?.data.value)
                : ((P = s.getCachedData(d, r, { cause: 'initial' })), (O.cachedData = P)),
                (r._asyncData[d] = U(r, d, t, s, P)))
            }
            ;(r._asyncData[d]._deps++, (s.immediate || w || B) && r._asyncData[d].execute(O))
          }
        },
        { flush: 'sync' }
      ),
      b = s.watch
        ? R(s.watch, () => {
            o._execute({ cause: 'watch', dedupe: s.dedupe })
          })
        : () => {}
    g &&
      W(() => {
        ;(D(), b(), _(i.value))
      })
  }
  const f = {
      data: E(() => r._asyncData[i.value]?.data),
      pending: E(() => r._asyncData[i.value]?.pending),
      status: E(() => r._asyncData[i.value]?.status),
      error: E(() => r._asyncData[i.value]?.error),
      refresh: (..._) => r._asyncData[i.value].execute(..._),
      execute: (..._) => r._asyncData[i.value].execute(..._),
      clear: () => F(r, i.value),
    },
    u = Promise.resolve(r._asyncDataPromises[i.value]).then(() => f)
  return (Object.assign(u, f), u)
}
function E(n) {
  return S({
    get() {
      return n()?.value
    },
    set(a) {
      const e = n()
      e && (e.value = a)
    },
  })
}
function de(n, a) {
  return !(
    typeof n == 'string' ||
    (typeof n == 'object' && n !== null) ||
    (typeof n == 'function' && typeof a == 'function')
  )
}
function F(n, a) {
  ;(a in n.payload.data && (n.payload.data[a] = void 0),
    a in n.payload._errors && (n.payload._errors[a] = $.errorValue),
    n._asyncData[a] &&
      ((n._asyncData[a].data.value = void 0),
      (n._asyncData[a].error.value = $.errorValue),
      (n._asyncData[a].pending.value = !1),
      (n._asyncData[a].status.value = 'idle')),
    a in n._asyncDataPromises &&
      (n._asyncDataPromises[a] && (n._asyncDataPromises[a].cancelled = !0),
      (n._asyncDataPromises[a] = void 0)))
}
function he(n, a) {
  const e = {}
  for (const t of a) e[t] = n[t]
  return e
}
function U(n, a, e, t, s) {
  n.payload._errors[a] ??= $.errorValue
  const i = t.getCachedData !== N,
    r = e,
    c = t.deep ? G : T,
    o = s != null,
    m = n.hook('app:data:refresh', async (f) => {
      ;(!f || f.includes(a)) && (await l.execute({ cause: 'refresh:hook' }))
    }),
    l = {
      data: c(o ? s : t.default()),
      pending: T(!o),
      error: J(n.payload._errors, a),
      status: T('idle'),
      execute: (...f) => {
        const [u, _ = void 0] = f,
          h = u && _ === void 0 && typeof u == 'object' ? u : {}
        if (n._asyncDataPromises[a]) {
          if (ue(h.dedupe ?? t.dedupe)) return n._asyncDataPromises[a]
          n._asyncDataPromises[a].cancelled = !0
        }
        if (h.cause === 'initial' || n.isHydrating) {
          const g =
            'cachedData' in h
              ? h.cachedData
              : t.getCachedData(a, n, { cause: h.cause ?? 'refresh:manual' })
          if (g != null)
            return (
              (n.payload.data[a] = l.data.value = g),
              (l.error.value = $.errorValue),
              (l.status.value = 'success'),
              Promise.resolve(g)
            )
        }
        ;((l.pending.value = !0), (l.status.value = 'pending'))
        const v = new Promise((g, D) => {
          try {
            g(r(n))
          } catch (b) {
            D(b)
          }
        })
          .then(async (g) => {
            if (v.cancelled) return n._asyncDataPromises[a]
            let D = g
            ;(t.transform && (D = await t.transform(g)),
              t.pick && (D = he(D, t.pick)),
              (n.payload.data[a] = D),
              (l.data.value = D),
              (l.error.value = $.errorValue),
              (l.status.value = 'success'))
          })
          .catch((g) => {
            if (v.cancelled) return n._asyncDataPromises[a]
            ;((l.error.value = X(g)), (l.data.value = Y(t.default())), (l.status.value = 'error'))
          })
          .finally(() => {
            v.cancelled || ((l.pending.value = !1), delete n._asyncDataPromises[a])
          })
        return ((n._asyncDataPromises[a] = v), n._asyncDataPromises[a])
      },
      _execute: oe((...f) => l.execute(...f), 0, { leading: !0 }),
      _default: t.default,
      _deps: 0,
      _init: !0,
      _hash: void 0,
      _off: () => {
        ;(m(),
          n._asyncData[a]?._init && (n._asyncData[a]._init = !1),
          i ||
            Q(() => {
              n._asyncData[a]?._init ||
                (F(n, a), (l.execute = () => Promise.resolve()), (l.data.value = $.value))
            }))
      },
    }
  return l
}
const ye = () => $.value,
  N = (n, a, e) => {
    if (a.isHydrating) return a.payload.data[n]
    if (e.cause !== 'refresh:manual' && e.cause !== 'refresh:hook') return a.static.data[n]
  }
function M(n, a, e) {
  const [t = {}, s] = typeof a == 'string' ? [{}, a] : [a, e],
    i = S(() => p(n)),
    r = S(() => p(t.key) || '$f' + C([s, typeof i.value == 'string' ? i.value : '', ..._e(t)]))
  if (!t.baseURL && typeof i.value == 'string' && i.value[0] === '/' && i.value[1] === '/')
    throw new Error('[nuxt] [useFetch] the request URL must not start with "//".')
  const {
      server: c,
      lazy: o,
      default: m,
      transform: l,
      pick: f,
      watch: u,
      immediate: _,
      getCachedData: h,
      deep: v,
      dedupe: g,
      ...D
    } = t,
    b = I({ ...x, ...D, cache: typeof t.cache == 'boolean' ? void 0 : t.cache }),
    d = {
      server: c,
      lazy: o,
      default: m,
      transform: l,
      pick: f,
      immediate: _,
      getCachedData: h,
      deep: v,
      dedupe: g,
      watch: u === !1 ? [] : [...(u || []), b],
    }
  if (!_) {
    let B = function () {
      d.immediate = !0
    }
    ;(R(r, B, { flush: 'sync', once: !0 }), R([...(u || []), b], B, { flush: 'sync', once: !0 }))
  }
  let y
  return fe(
    u === !1 ? r.value : r,
    () => {
      ;(y?.abort?.(
        new DOMException(
          'Request aborted as another request to the same endpoint was initiated.',
          'AbortError'
        )
      ),
        (y = typeof AbortController < 'u' ? new AbortController() : {}))
      const B = p(t.timeout)
      let O
      return (
        B &&
          ((O = setTimeout(
            () => y.abort(new DOMException('Request aborted due to timeout.', 'AbortError')),
            B
          )),
          (y.signal.onabort = () => clearTimeout(O))),
        (t.$fetch || globalThis.$fetch)(i.value, { signal: y.signal, ...b }).finally(() => {
          clearTimeout(O)
        })
      )
    },
    d
  )
}
function _e(n) {
  const a = [p(n.method)?.toUpperCase() || 'GET', p(n.baseURL)]
  for (const e of [n.params || n.query]) {
    const t = p(e)
    if (!t) continue
    const s = {}
    for (const [i, r] of Object.entries(t)) s[p(i)] = p(r)
    a.push(s)
  }
  if (n.body) {
    const e = p(n.body)
    if (!e) a.push(C(e))
    else if (e instanceof ArrayBuffer)
      a.push(
        C(Object.fromEntries([...new Uint8Array(e).entries()].map(([t, s]) => [t, s.toString()])))
      )
    else if (e instanceof FormData) {
      const t = {}
      for (const s of e.entries()) {
        const [i, r] = s
        t[i] = r instanceof File ? r.name : r
      }
      a.push(C(t))
    } else if (K(e)) a.push(C(I(e)))
    else
      try {
        a.push(C(e))
      } catch {
        console.warn('[useFetch] Failed to hash body', e)
      }
  }
  return a
}
const ge = () => ({
  list: async () => {
    const { data: e, error: t } = await M('/api/courses', '$xdzWn17RwL')
    return { data: e, error: t }
  },
  getById: async (e) => {
    const { data: t, error: s } = await M(`/api/courses-${e}`, '$lHign-pojF')
    return { data: t, error: s }
  },
})
export { ge as u }
