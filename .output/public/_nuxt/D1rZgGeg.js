import {
  d as z,
  u as F,
  k as I,
  l as K,
  r as d,
  c as _,
  w as e,
  j as L,
  o as g,
  a,
  V as k,
  b as V,
  e as b,
  m as C,
  h as u,
  t as c,
  n as s,
  f as w,
  i as x,
  g as M,
  p as B,
  q as Z,
  s as j,
  v as D,
  x as q,
} from '#entry'
import { u as H } from './WsTczmci.js'
const J = () => ({
    create: async (o) => await $fetch('/api/bookings', { method: 'POST', body: o }),
  }),
  O = { class: 'mb-2' },
  P = { class: 'text-caption' },
  W = z({
    __name: '[id]',
    async setup(h) {
      let o, v
      F({ title: 'Kursdetails' })
      const A = I(),
        y = Number(A.params.id),
        { getById: E } = H(),
        { data: T, error: U } = (([o, v] = K(() => E(y))), (o = await o), v(), o),
        i = T.value,
        n = d(''),
        f = d(!1),
        r = d(''),
        m = d(!1),
        { create: N } = J()
      async function S() {
        if (((r.value = ''), (m.value = !1), !n.value)) {
          r.value = 'Bitte E-Mail-Adresse eingeben.'
          return
        }
        f.value = !0
        try {
          ;(await N({ userEmail: n.value, courseId: y }), (m.value = !0))
        } catch (l) {
          r.value = l?.data?.message || l?.message || 'Fehler bei der Buchung'
        } finally {
          f.value = !1
        }
      }
      function R(l, t) {
        if (!l && !t) return 'Termin wird bekanntgegeben'
        const p = l ? new Date(l).toLocaleDateString('de-DE') : '?',
          $ = t ? new Date(t).toLocaleDateString('de-DE') : '?'
        return `${p} – ${$}`
      }
      return (l, t) => (
        g(),
        _(L, null, {
          default: e(() => [
            a(k, null, {
              default: e(() => [
                a(
                  V,
                  { cols: '12' },
                  {
                    default: e(() => [
                      a(
                        C,
                        { variant: 'text', to: '/courses' },
                        {
                          default: e(() => [
                            ...(t[1] || (t[1] = [u('← Zurück zur Übersicht', -1)])),
                          ]),
                          _: 1,
                        }
                      ),
                      b('h1', O, c(s(i)?.title || 'Kurs'), 1),
                    ]),
                    _: 1,
                  }
                ),
              ]),
              _: 1,
            }),
            a(k, null, {
              default: e(() => [
                a(
                  V,
                  { cols: '12', md: '8' },
                  {
                    default: e(() => [
                      a(w, null, {
                        default: e(() => [
                          a(x, null, {
                            default: e(() => [
                              b('p', null, c(s(i)?.description), 1),
                              b('p', P, ' Zeitraum: ' + c(R(s(i)?.startAt, s(i)?.endAt)), 1),
                            ]),
                            _: 1,
                          }),
                        ]),
                        _: 1,
                      }),
                    ]),
                    _: 1,
                  }
                ),
                a(
                  V,
                  { cols: '12', md: '4' },
                  {
                    default: e(() => [
                      a(w, null, {
                        default: e(() => [
                          a(M, null, {
                            default: e(() => [...(t[2] || (t[2] = [u('Buchen', -1)]))]),
                            _: 1,
                          }),
                          a(x, null, {
                            default: e(() => [
                              a(
                                Z,
                                {
                                  modelValue: s(n),
                                  'onUpdate:modelValue':
                                    t[0] || (t[0] = (p) => (j(n) ? (n.value = p) : null)),
                                  label: 'E-Mail',
                                  type: 'email',
                                  density: 'comfortable',
                                },
                                null,
                                8,
                                ['modelValue']
                              ),
                              s(r)
                                ? (g(),
                                  _(
                                    D,
                                    { key: 0, type: 'error', class: 'mt-2', variant: 'tonal' },
                                    { default: e(() => [u(c(s(r)), 1)]), _: 1 }
                                  ))
                                : B('', !0),
                              s(m)
                                ? (g(),
                                  _(
                                    D,
                                    { key: 1, type: 'success', class: 'mt-2', variant: 'tonal' },
                                    {
                                      default: e(() => [
                                        ...(t[3] || (t[3] = [u('Buchung erfolgreich!', -1)])),
                                      ]),
                                      _: 1,
                                    }
                                  ))
                                : B('', !0),
                            ]),
                            _: 1,
                          }),
                          a(q, null, {
                            default: e(() => [
                              a(
                                C,
                                { loading: s(f), color: 'primary', variant: 'flat', onClick: S },
                                {
                                  default: e(() => [...(t[4] || (t[4] = [u('Jetzt buchen', -1)]))]),
                                  _: 1,
                                },
                                8,
                                ['loading']
                              ),
                            ]),
                            _: 1,
                          }),
                        ]),
                        _: 1,
                      }),
                    ]),
                    _: 1,
                  }
                ),
              ]),
              _: 1,
            }),
          ]),
          _: 1,
        })
      )
    },
  })
export { W as default }
