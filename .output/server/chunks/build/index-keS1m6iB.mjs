import { defineComponent, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue'
import { ssrRenderComponent } from 'vue/server-renderer'
import {
  u as useHead,
  V as VContainer,
  a as VRow,
  b as VCol,
  c as VCard,
  d as VCardTitle,
  e as VCardText,
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
  setup(__props) {
    useHead({ title: 'ABB \u2013 Start' })
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
                              null,
                              {
                                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                                  if (_push4) {
                                    _push4(`<h1 class="mb-4"${_scopeId3}>ABB</h1>`)
                                    _push4(
                                      ssrRenderComponent(
                                        VCard,
                                        null,
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
                                                          _push6(`Willkommen`)
                                                        } else {
                                                          return [createTextVNode('Willkommen')]
                                                        }
                                                      }
                                                    ),
                                                    _: 1,
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
                                                            `<p${_scopeId5}>Das ist die ABB-Starterseite.</p><p${_scopeId5}> Healthcheck: <code${_scopeId5}>/api/health</code></p>`
                                                          )
                                                        } else {
                                                          return [
                                                            createVNode(
                                                              'p',
                                                              null,
                                                              'Das ist die ABB-Starterseite.'
                                                            ),
                                                            createVNode('p', null, [
                                                              createTextVNode(' Healthcheck: '),
                                                              createVNode(
                                                                'code',
                                                                null,
                                                                '/api/health'
                                                              ),
                                                            ]),
                                                          ]
                                                        }
                                                      }
                                                    ),
                                                    _: 1,
                                                  },
                                                  _parent5,
                                                  _scopeId4
                                                )
                                              )
                                            } else {
                                              return [
                                                createVNode(VCardTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode('Willkommen'),
                                                  ]),
                                                  _: 1,
                                                }),
                                                createVNode(VCardText, null, {
                                                  default: withCtx(() => [
                                                    createVNode(
                                                      'p',
                                                      null,
                                                      'Das ist die ABB-Starterseite.'
                                                    ),
                                                    createVNode('p', null, [
                                                      createTextVNode(' Healthcheck: '),
                                                      createVNode('code', null, '/api/health'),
                                                    ]),
                                                  ]),
                                                  _: 1,
                                                }),
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
                                    return [
                                      createVNode('h1', { class: 'mb-4' }, 'ABB'),
                                      createVNode(VCard, null, {
                                        default: withCtx(() => [
                                          createVNode(VCardTitle, null, {
                                            default: withCtx(() => [createTextVNode('Willkommen')]),
                                            _: 1,
                                          }),
                                          createVNode(VCardText, null, {
                                            default: withCtx(() => [
                                              createVNode(
                                                'p',
                                                null,
                                                'Das ist die ABB-Starterseite.'
                                              ),
                                              createVNode('p', null, [
                                                createTextVNode(' Healthcheck: '),
                                                createVNode('code', null, '/api/health'),
                                              ]),
                                            ]),
                                            _: 1,
                                          }),
                                        ]),
                                        _: 1,
                                      }),
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
                            createVNode(VCol, null, {
                              default: withCtx(() => [
                                createVNode('h1', { class: 'mb-4' }, 'ABB'),
                                createVNode(VCard, null, {
                                  default: withCtx(() => [
                                    createVNode(VCardTitle, null, {
                                      default: withCtx(() => [createTextVNode('Willkommen')]),
                                      _: 1,
                                    }),
                                    createVNode(VCardText, null, {
                                      default: withCtx(() => [
                                        createVNode('p', null, 'Das ist die ABB-Starterseite.'),
                                        createVNode('p', null, [
                                          createTextVNode(' Healthcheck: '),
                                          createVNode('code', null, '/api/health'),
                                        ]),
                                      ]),
                                      _: 1,
                                    }),
                                  ]),
                                  _: 1,
                                }),
                              ]),
                              _: 1,
                            }),
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
                      createVNode(VCol, null, {
                        default: withCtx(() => [
                          createVNode('h1', { class: 'mb-4' }, 'ABB'),
                          createVNode(VCard, null, {
                            default: withCtx(() => [
                              createVNode(VCardTitle, null, {
                                default: withCtx(() => [createTextVNode('Willkommen')]),
                                _: 1,
                              }),
                              createVNode(VCardText, null, {
                                default: withCtx(() => [
                                  createVNode('p', null, 'Das ist die ABB-Starterseite.'),
                                  createVNode('p', null, [
                                    createTextVNode(' Healthcheck: '),
                                    createVNode('code', null, '/api/health'),
                                  ]),
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
  ;(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add('pages/index.vue')
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
//# sourceMappingURL=index-keS1m6iB.mjs.map
