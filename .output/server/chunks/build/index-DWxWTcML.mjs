import {
  defineComponent,
  withAsyncContext,
  withCtx,
  createVNode,
  unref,
  createTextVNode,
  toDisplayString,
  createBlock,
  createCommentVNode,
  openBlock,
  Fragment,
  renderList,
  useSSRContext,
} from 'vue'
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer'
import { u as useCourses } from './useCourses-BYQwKJHx.mjs'
import {
  _ as _export_sfc,
  u as useHead,
  V as VContainer,
  a as VRow,
  b as VCol,
  h as VAlert,
  c as VCard,
  d as VCardTitle,
  e as VCardText,
  i as VCardActions,
  f as VBtn,
} from './server.mjs'
import '../nitro/nitro.mjs'
import 'node:http'
import 'node:https'
import 'node:events'
import 'node:buffer'
import 'node:fs'
import 'node:path'
import 'node:crypto'
import 'node:url'
import '@vue/shared'
import 'perfect-debounce'
import '../routes/renderer.mjs'
import 'vue-bundle-renderer/runtime'
import 'unhead/server'
import 'devalue'
import 'unhead/utils'
import 'unhead/plugins'
import 'vue-router'

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'index',
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore
    useHead({ title: 'Kurse' })
    const { list } = useCourses()
    const { data, error } =
      (([__temp, __restore] = withAsyncContext(() => list())),
      (__temp = await __temp),
      __restore(),
      __temp)
    const courses = data.value
    function formatDateRange(start, end) {
      if (!start && !end) return 'Termin wird bekanntgegeben'
      const s = start ? new Date(start).toLocaleDateString('de-DE') : '?'
      const e = end ? new Date(end).toLocaleDateString('de-DE') : '?'
      return `${s} \u2013 ${e}`
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        ssrRenderComponent(
          VContainer,
          _attrs,
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  ssrRenderComponent(
                    VRow,
                    null,
                    {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(
                            ssrRenderComponent(
                              VCol,
                              { cols: '12' },
                              {
                                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                                  if (_push4) {
                                    _push4(
                                      `<h1 class="mb-4" data-v-3aa89bf0${_scopeId3}>Kurse</h1>`
                                    )
                                  } else {
                                    return [createVNode('h1', { class: 'mb-4' }, 'Kurse')]
                                  }
                                }),
                                _: 1,
                              },
                              _parent3,
                              _scopeId2
                            )
                          )
                        } else {
                          return [
                            createVNode(
                              VCol,
                              { cols: '12' },
                              {
                                default: withCtx(() => [
                                  createVNode('h1', { class: 'mb-4' }, 'Kurse'),
                                ]),
                                _: 1,
                              }
                            ),
                          ]
                        }
                      }),
                      _: 1,
                    },
                    _parent2,
                    _scopeId
                  )
                )
                _push2(
                  ssrRenderComponent(
                    VRow,
                    null,
                    {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(
                            ssrRenderComponent(
                              VCol,
                              { cols: '12' },
                              {
                                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                                  if (_push4) {
                                    if (unref(error)) {
                                      _push4(
                                        ssrRenderComponent(
                                          VAlert,
                                          {
                                            type: 'error',
                                            variant: 'tonal',
                                          },
                                          {
                                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                              if (_push5) {
                                                _push5(`${ssrInterpolate(unref(error).message)}`)
                                              } else {
                                                return [
                                                  createTextVNode(
                                                    toDisplayString(unref(error).message),
                                                    1
                                                  ),
                                                ]
                                              }
                                            }),
                                            _: 1,
                                          },
                                          _parent4,
                                          _scopeId3
                                        )
                                      )
                                    } else {
                                      _push4(`<!---->`)
                                    }
                                  } else {
                                    return [
                                      unref(error)
                                        ? (openBlock(),
                                          createBlock(
                                            VAlert,
                                            {
                                              key: 0,
                                              type: 'error',
                                              variant: 'tonal',
                                            },
                                            {
                                              default: withCtx(() => [
                                                createTextVNode(
                                                  toDisplayString(unref(error).message),
                                                  1
                                                ),
                                              ]),
                                              _: 1,
                                            }
                                          ))
                                        : createCommentVNode('', true),
                                    ]
                                  }
                                }),
                                _: 1,
                              },
                              _parent3,
                              _scopeId2
                            )
                          )
                        } else {
                          return [
                            createVNode(
                              VCol,
                              { cols: '12' },
                              {
                                default: withCtx(() => [
                                  unref(error)
                                    ? (openBlock(),
                                      createBlock(
                                        VAlert,
                                        {
                                          key: 0,
                                          type: 'error',
                                          variant: 'tonal',
                                        },
                                        {
                                          default: withCtx(() => [
                                            createTextVNode(
                                              toDisplayString(unref(error).message),
                                              1
                                            ),
                                          ]),
                                          _: 1,
                                        }
                                      ))
                                    : createCommentVNode('', true),
                                ]),
                                _: 1,
                              }
                            ),
                          ]
                        }
                      }),
                      _: 1,
                    },
                    _parent2,
                    _scopeId
                  )
                )
                _push2(
                  ssrRenderComponent(
                    VRow,
                    null,
                    {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`<!--[-->`)
                          ssrRenderList(unref(courses) || [], (c) => {
                            _push3(
                              ssrRenderComponent(
                                VCol,
                                {
                                  key: c.id,
                                  cols: '12',
                                  md: '6',
                                  lg: '4',
                                },
                                {
                                  default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                                    if (_push4) {
                                      _push4(
                                        ssrRenderComponent(
                                          VCard,
                                          {
                                            to: `/courses/${c.id}`,
                                            class: 'h-100',
                                            variant: 'elevated',
                                          },
                                          {
                                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                              if (_push5) {
                                                _push5(
                                                  ssrRenderComponent(
                                                    VCardTitle,
                                                    null,
                                                    {
                                                      default: withCtx(
                                                        (_5, _push6, _parent6, _scopeId5) => {
                                                          if (_push6) {
                                                            _push6(`${ssrInterpolate(c.title)}`)
                                                          } else {
                                                            return [
                                                              createTextVNode(
                                                                toDisplayString(c.title),
                                                                1
                                                              ),
                                                            ]
                                                          }
                                                        }
                                                      ),
                                                      _: 2,
                                                    },
                                                    _parent5,
                                                    _scopeId4
                                                  )
                                                )
                                                _push5(
                                                  ssrRenderComponent(
                                                    VCardText,
                                                    null,
                                                    {
                                                      default: withCtx(
                                                        (_5, _push6, _parent6, _scopeId5) => {
                                                          if (_push6) {
                                                            _push6(
                                                              `<div class="text-body-2" data-v-3aa89bf0${_scopeId5}>${ssrInterpolate(c.description)}</div><div class="text-caption mt-2" data-v-3aa89bf0${_scopeId5}>${ssrInterpolate(formatDateRange(c.startAt, c.endAt))}</div>`
                                                            )
                                                          } else {
                                                            return [
                                                              createVNode(
                                                                'div',
                                                                { class: 'text-body-2' },
                                                                toDisplayString(c.description),
                                                                1
                                                              ),
                                                              createVNode(
                                                                'div',
                                                                { class: 'text-caption mt-2' },
                                                                toDisplayString(
                                                                  formatDateRange(
                                                                    c.startAt,
                                                                    c.endAt
                                                                  )
                                                                ),
                                                                1
                                                              ),
                                                            ]
                                                          }
                                                        }
                                                      ),
                                                      _: 2,
                                                    },
                                                    _parent5,
                                                    _scopeId4
                                                  )
                                                )
                                                _push5(
                                                  ssrRenderComponent(
                                                    VCardActions,
                                                    null,
                                                    {
                                                      default: withCtx(
                                                        (_5, _push6, _parent6, _scopeId5) => {
                                                          if (_push6) {
                                                            _push6(
                                                              ssrRenderComponent(
                                                                VBtn,
                                                                {
                                                                  to: `/courses/${c.id}`,
                                                                  color: 'primary',
                                                                  variant: 'flat',
                                                                },
                                                                {
                                                                  default: withCtx(
                                                                    (
                                                                      _6,
                                                                      _push7,
                                                                      _parent7,
                                                                      _scopeId6
                                                                    ) => {
                                                                      if (_push7) {
                                                                        _push7(`Details`)
                                                                      } else {
                                                                        return [
                                                                          createTextVNode(
                                                                            'Details'
                                                                          ),
                                                                        ]
                                                                      }
                                                                    }
                                                                  ),
                                                                  _: 2,
                                                                },
                                                                _parent6,
                                                                _scopeId5
                                                              )
                                                            )
                                                          } else {
                                                            return [
                                                              createVNode(
                                                                VBtn,
                                                                {
                                                                  to: `/courses/${c.id}`,
                                                                  color: 'primary',
                                                                  variant: 'flat',
                                                                },
                                                                {
                                                                  default: withCtx(() => [
                                                                    createTextVNode('Details'),
                                                                  ]),
                                                                  _: 1,
                                                                },
                                                                8,
                                                                ['to']
                                                              ),
                                                            ]
                                                          }
                                                        }
                                                      ),
                                                      _: 2,
                                                    },
                                                    _parent5,
                                                    _scopeId4
                                                  )
                                                )
                                              } else {
                                                return [
                                                  createVNode(
                                                    VCardTitle,
                                                    null,
                                                    {
                                                      default: withCtx(() => [
                                                        createTextVNode(
                                                          toDisplayString(c.title),
                                                          1
                                                        ),
                                                      ]),
                                                      _: 2,
                                                    },
                                                    1024
                                                  ),
                                                  createVNode(
                                                    VCardText,
                                                    null,
                                                    {
                                                      default: withCtx(() => [
                                                        createVNode(
                                                          'div',
                                                          { class: 'text-body-2' },
                                                          toDisplayString(c.description),
                                                          1
                                                        ),
                                                        createVNode(
                                                          'div',
                                                          { class: 'text-caption mt-2' },
                                                          toDisplayString(
                                                            formatDateRange(c.startAt, c.endAt)
                                                          ),
                                                          1
                                                        ),
                                                      ]),
                                                      _: 2,
                                                    },
                                                    1024
                                                  ),
                                                  createVNode(
                                                    VCardActions,
                                                    null,
                                                    {
                                                      default: withCtx(() => [
                                                        createVNode(
                                                          VBtn,
                                                          {
                                                            to: `/courses/${c.id}`,
                                                            color: 'primary',
                                                            variant: 'flat',
                                                          },
                                                          {
                                                            default: withCtx(() => [
                                                              createTextVNode('Details'),
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
                                                ]
                                              }
                                            }),
                                            _: 2,
                                          },
                                          _parent4,
                                          _scopeId3
                                        )
                                      )
                                    } else {
                                      return [
                                        createVNode(
                                          VCard,
                                          {
                                            to: `/courses/${c.id}`,
                                            class: 'h-100',
                                            variant: 'elevated',
                                          },
                                          {
                                            default: withCtx(() => [
                                              createVNode(
                                                VCardTitle,
                                                null,
                                                {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(c.title), 1),
                                                  ]),
                                                  _: 2,
                                                },
                                                1024
                                              ),
                                              createVNode(
                                                VCardText,
                                                null,
                                                {
                                                  default: withCtx(() => [
                                                    createVNode(
                                                      'div',
                                                      { class: 'text-body-2' },
                                                      toDisplayString(c.description),
                                                      1
                                                    ),
                                                    createVNode(
                                                      'div',
                                                      { class: 'text-caption mt-2' },
                                                      toDisplayString(
                                                        formatDateRange(c.startAt, c.endAt)
                                                      ),
                                                      1
                                                    ),
                                                  ]),
                                                  _: 2,
                                                },
                                                1024
                                              ),
                                              createVNode(
                                                VCardActions,
                                                null,
                                                {
                                                  default: withCtx(() => [
                                                    createVNode(
                                                      VBtn,
                                                      {
                                                        to: `/courses/${c.id}`,
                                                        color: 'primary',
                                                        variant: 'flat',
                                                      },
                                                      {
                                                        default: withCtx(() => [
                                                          createTextVNode('Details'),
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
                                      ]
                                    }
                                  }),
                                  _: 2,
                                },
                                _parent3,
                                _scopeId2
                              )
                            )
                          })
                          _push3(`<!--]-->`)
                        } else {
                          return [
                            (openBlock(true),
                            createBlock(
                              Fragment,
                              null,
                              renderList(unref(courses) || [], (c) => {
                                return (
                                  openBlock(),
                                  createBlock(
                                    VCol,
                                    {
                                      key: c.id,
                                      cols: '12',
                                      md: '6',
                                      lg: '4',
                                    },
                                    {
                                      default: withCtx(() => [
                                        createVNode(
                                          VCard,
                                          {
                                            to: `/courses/${c.id}`,
                                            class: 'h-100',
                                            variant: 'elevated',
                                          },
                                          {
                                            default: withCtx(() => [
                                              createVNode(
                                                VCardTitle,
                                                null,
                                                {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(c.title), 1),
                                                  ]),
                                                  _: 2,
                                                },
                                                1024
                                              ),
                                              createVNode(
                                                VCardText,
                                                null,
                                                {
                                                  default: withCtx(() => [
                                                    createVNode(
                                                      'div',
                                                      { class: 'text-body-2' },
                                                      toDisplayString(c.description),
                                                      1
                                                    ),
                                                    createVNode(
                                                      'div',
                                                      { class: 'text-caption mt-2' },
                                                      toDisplayString(
                                                        formatDateRange(c.startAt, c.endAt)
                                                      ),
                                                      1
                                                    ),
                                                  ]),
                                                  _: 2,
                                                },
                                                1024
                                              ),
                                              createVNode(
                                                VCardActions,
                                                null,
                                                {
                                                  default: withCtx(() => [
                                                    createVNode(
                                                      VBtn,
                                                      {
                                                        to: `/courses/${c.id}`,
                                                        color: 'primary',
                                                        variant: 'flat',
                                                      },
                                                      {
                                                        default: withCtx(() => [
                                                          createTextVNode('Details'),
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
                              }),
                              128
                            )),
                          ]
                        }
                      }),
                      _: 1,
                    },
                    _parent2,
                    _scopeId
                  )
                )
              } else {
                return [
                  createVNode(VRow, null, {
                    default: withCtx(() => [
                      createVNode(
                        VCol,
                        { cols: '12' },
                        {
                          default: withCtx(() => [createVNode('h1', { class: 'mb-4' }, 'Kurse')]),
                          _: 1,
                        }
                      ),
                    ]),
                    _: 1,
                  }),
                  createVNode(VRow, null, {
                    default: withCtx(() => [
                      createVNode(
                        VCol,
                        { cols: '12' },
                        {
                          default: withCtx(() => [
                            unref(error)
                              ? (openBlock(),
                                createBlock(
                                  VAlert,
                                  {
                                    key: 0,
                                    type: 'error',
                                    variant: 'tonal',
                                  },
                                  {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(unref(error).message), 1),
                                    ]),
                                    _: 1,
                                  }
                                ))
                              : createCommentVNode('', true),
                          ]),
                          _: 1,
                        }
                      ),
                    ]),
                    _: 1,
                  }),
                  createVNode(VRow, null, {
                    default: withCtx(() => [
                      (openBlock(true),
                      createBlock(
                        Fragment,
                        null,
                        renderList(unref(courses) || [], (c) => {
                          return (
                            openBlock(),
                            createBlock(
                              VCol,
                              {
                                key: c.id,
                                cols: '12',
                                md: '6',
                                lg: '4',
                              },
                              {
                                default: withCtx(() => [
                                  createVNode(
                                    VCard,
                                    {
                                      to: `/courses/${c.id}`,
                                      class: 'h-100',
                                      variant: 'elevated',
                                    },
                                    {
                                      default: withCtx(() => [
                                        createVNode(
                                          VCardTitle,
                                          null,
                                          {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(c.title), 1),
                                            ]),
                                            _: 2,
                                          },
                                          1024
                                        ),
                                        createVNode(
                                          VCardText,
                                          null,
                                          {
                                            default: withCtx(() => [
                                              createVNode(
                                                'div',
                                                { class: 'text-body-2' },
                                                toDisplayString(c.description),
                                                1
                                              ),
                                              createVNode(
                                                'div',
                                                { class: 'text-caption mt-2' },
                                                toDisplayString(
                                                  formatDateRange(c.startAt, c.endAt)
                                                ),
                                                1
                                              ),
                                            ]),
                                            _: 2,
                                          },
                                          1024
                                        ),
                                        createVNode(
                                          VCardActions,
                                          null,
                                          {
                                            default: withCtx(() => [
                                              createVNode(
                                                VBtn,
                                                {
                                                  to: `/courses/${c.id}`,
                                                  color: 'primary',
                                                  variant: 'flat',
                                                },
                                                {
                                                  default: withCtx(() => [
                                                    createTextVNode('Details'),
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
                        }),
                        128
                      )),
                    ]),
                    _: 1,
                  }),
                ]
              }
            }),
            _: 1,
          },
          _parent
        )
      )
    }
  },
})
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    'pages/courses/index.vue'
  )
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [['__scopeId', 'data-v-3aa89bf0']])

export { index as default }
//# sourceMappingURL=index-DWxWTcML.mjs.map
