import {
  d as n,
  u,
  c as d,
  o,
  w as a,
  a as l,
  V as r,
  b as i,
  e as t,
  f,
  g as p,
  h as s,
  i as V,
  j as B,
} from '#entry'
const x = n({
  __name: 'index',
  setup(m) {
    return (
      u({ title: 'ABB – Start' }),
      (_, e) => (
        o(),
        d(B, null, {
          default: a(() => [
            l(r, null, {
              default: a(() => [
                l(i, null, {
                  default: a(() => [
                    e[2] || (e[2] = t('h1', { class: 'mb-4' }, 'ABB', -1)),
                    l(f, null, {
                      default: a(() => [
                        l(p, null, {
                          default: a(() => [...(e[0] || (e[0] = [s('Willkommen', -1)]))]),
                          _: 1,
                        }),
                        l(V, null, {
                          default: a(() => [
                            ...(e[1] ||
                              (e[1] = [
                                t('p', null, 'Das ist die ABB-Starterseite.', -1),
                                t(
                                  'p',
                                  null,
                                  [s(' Healthcheck: '), t('code', null, '/api/health')],
                                  -1
                                ),
                              ])),
                          ]),
                          _: 1,
                        }),
                      ]),
                      _: 1,
                    }),
                  ]),
                  _: 1,
                }),
              ]),
              _: 1,
            }),
          ]),
          _: 1,
        })
      )
    )
  },
})
export { x as default }
