import { u as y } from './WsTczmci.js'
import {
  d as D,
  u as w,
  l as b,
  c as d,
  w as e,
  j as k,
  o as n,
  a as t,
  V as u,
  b as i,
  e as c,
  p as A,
  n as _,
  v as B,
  h as f,
  t as l,
  y as h,
  F as N,
  z as T,
  f as $,
  g as E,
  i as L,
  x as S,
  m as F,
  _ as K,
} from '#entry'
const R = { class: 'text-body-2' },
  j = { class: 'text-caption mt-2' },
  z = D({
    __name: 'index',
    async setup(H) {
      let o, m
      w({ title: 'Kurse' })
      const { list: V } = y(),
        { data: x, error: p } = (([o, m] = b(() => V())), (o = await o), m(), o),
        C = x.value
      function g(r, s) {
        if (!r && !s) return 'Termin wird bekanntgegeben'
        const a = r ? new Date(r).toLocaleDateString('de-DE') : '?',
          v = s ? new Date(s).toLocaleDateString('de-DE') : '?'
        return `${a} – ${v}`
      }
      return (r, s) => (
        n(),
        d(k, null, {
          default: e(() => [
            t(u, null, {
              default: e(() => [
                t(
                  i,
                  { cols: '12' },
                  {
                    default: e(() => [
                      ...(s[0] || (s[0] = [c('h1', { class: 'mb-4' }, 'Kurse', -1)])),
                    ]),
                    _: 1,
                  }
                ),
              ]),
              _: 1,
            }),
            t(u, null, {
              default: e(() => [
                t(
                  i,
                  { cols: '12' },
                  {
                    default: e(() => [
                      _(p)
                        ? (n(),
                          d(
                            B,
                            { key: 0, type: 'error', variant: 'tonal' },
                            { default: e(() => [f(l(_(p).message), 1)]), _: 1 }
                          ))
                        : A('', !0),
                    ]),
                    _: 1,
                  }
                ),
              ]),
              _: 1,
            }),
            t(u, null, {
              default: e(() => [
                (n(!0),
                h(
                  N,
                  null,
                  T(
                    _(C) || [],
                    (a) => (
                      n(),
                      d(
                        i,
                        { key: a.id, cols: '12', md: '6', lg: '4' },
                        {
                          default: e(() => [
                            t(
                              $,
                              { to: `/courses/${a.id}`, class: 'h-100', variant: 'elevated' },
                              {
                                default: e(() => [
                                  t(E, null, { default: e(() => [f(l(a.title), 1)]), _: 2 }, 1024),
                                  t(
                                    L,
                                    null,
                                    {
                                      default: e(() => [
                                        c('div', R, l(a.description), 1),
                                        c('div', j, l(g(a.startAt, a.endAt)), 1),
                                      ]),
                                      _: 2,
                                    },
                                    1024
                                  ),
                                  t(
                                    S,
                                    null,
                                    {
                                      default: e(() => [
                                        t(
                                          F,
                                          {
                                            to: `/courses/${a.id}`,
                                            color: 'primary',
                                            variant: 'flat',
                                          },
                                          {
                                            default: e(() => [
                                              ...(s[1] || (s[1] = [f('Details', -1)])),
                                            ]),
                                            _: 1,
                                          },
                                          8,
                                          ['to']
                                        ),
                                      ]),
                                      _: 2,
                                    },
                                    1024
                                  ),
                                ]),
                                _: 2,
                              },
                              1032,
                              ['to']
                            ),
                          ]),
                          _: 2,
                        },
                        1024
                      )
                    )
                  ),
                  128
                )),
              ]),
              _: 1,
            }),
          ]),
          _: 1,
        })
      )
    },
  }),
  G = K(z, [['__scopeId', 'data-v-3aa89bf0']])
export { G as default }
