import { d as t, c as o, o as n, w as a, a as s, T as l, U as r, W as u } from '#entry'
const p = t({
  name: 'DefaultLayout',
  __name: 'default',
  setup(c) {
    return (e, d) => (
      n(),
      o(u, null, {
        default: a(() => [
          s(l, { tag: 'main', role: 'main' }, { default: a(() => [r(e.$slots, 'default')]), _: 3 }),
        ]),
        _: 3,
      })
    )
  },
})
export { p as default }
