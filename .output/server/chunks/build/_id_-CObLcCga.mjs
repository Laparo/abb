import {
  defineComponent,
  withAsyncContext,
  ref,
  withCtx,
  createTextVNode,
  unref,
  createVNode,
  toDisplayString,
  isRef,
  createBlock,
  createCommentVNode,
  openBlock,
  useSSRContext,
} from 'vue'
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer'
import { useRoute } from 'vue-router'
import { u as useCourses } from './useCourses-BYQwKJHx.mjs'
import {
  u as useHead,
  V as VContainer,
  a as VRow,
  b as VCol,
  f as VBtn,
  c as VCard,
  e as VCardText,
  d as VCardTitle,
  g as VTextField,
  h as VAlert,
  i as VCardActions,
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

const useBookings = () => {
  const create = async (input) => {
    return await $fetch('/api/bookings', {
      method: 'POST',
      body: input,
    })
  }
  return { create }
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: '[id]',
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore
    useHead({ title: 'Kursdetails' })
    const route = useRoute()
    const id = Number(route.params.id)
    const { getById } = useCourses()
    const { data, error } =
      (([__temp, __restore] = withAsyncContext(() => getById(id))),
      (__temp = await __temp),
      __restore(),
      __temp)
    const course = data.value
    const email = ref('')
    const booking = ref(false)
    const bookError = ref('')
    const bookSuccess = ref(false)
    const { create } = useBookings()
    async function book() {
      var _a
      bookError.value = ''
      bookSuccess.value = false
      if (!email.value) {
        bookError.value = 'Bitte E-Mail-Adresse eingeben.'
        return
      }
      booking.value = true
      try {
        await create({ userEmail: email.value, courseId: id })
        bookSuccess.value = true
      } catch (e) {
        bookError.value =
          ((_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) ||
          (e == null ? void 0 : e.message) ||
          'Fehler bei der Buchung'
      } finally {
        booking.value = false
      }
    }
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
                                  var _a, _b
                                  if (_push4) {
                                    _push4(
                                      ssrRenderComponent(
                                        VBtn,
                                        {
                                          variant: 'text',
                                          to: '/courses',
                                        },
                                        {
                                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                            if (_push5) {
                                              _push5(`\u2190 Zur\xFCck zur \xDCbersicht`)
                                            } else {
                                              return [
                                                createTextVNode(
                                                  '\u2190 Zur\xFCck zur \xDCbersicht'
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
                                    _push4(
                                      `<h1 class="mb-2"${_scopeId3}>${ssrInterpolate(((_a = unref(course)) == null ? void 0 : _a.title) || 'Kurs')}</h1>`
                                    )
                                  } else {
                                    return [
                                      createVNode(
                                        VBtn,
                                        {
                                          variant: 'text',
                                          to: '/courses',
                                        },
                                        {
                                          default: withCtx(() => [
                                            createTextVNode('\u2190 Zur\xFCck zur \xDCbersicht'),
                                          ]),
                                          _: 1,
                                        }
                                      ),
                                      createVNode(
                                        'h1',
                                        { class: 'mb-2' },
                                        toDisplayString(
                                          ((_b = unref(course)) == null ? void 0 : _b.title) ||
                                            'Kurs'
                                        ),
                                        1
                                      ),
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
                                default: withCtx(() => {
                                  var _a
                                  return [
                                    createVNode(
                                      VBtn,
                                      {
                                        variant: 'text',
                                        to: '/courses',
                                      },
                                      {
                                        default: withCtx(() => [
                                          createTextVNode('\u2190 Zur\xFCck zur \xDCbersicht'),
                                        ]),
                                        _: 1,
                                      }
                                    ),
                                    createVNode(
                                      'h1',
                                      { class: 'mb-2' },
                                      toDisplayString(
                                        ((_a = unref(course)) == null ? void 0 : _a.title) || 'Kurs'
                                      ),
                                      1
                                    ),
                                  ]
                                }),
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
                              {
                                cols: '12',
                                md: '8',
                              },
                              {
                                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                                  if (_push4) {
                                    _push4(
                                      ssrRenderComponent(
                                        VCard,
                                        null,
                                        {
                                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                            if (_push5) {
                                              _push5(
                                                ssrRenderComponent(
                                                  VCardText,
                                                  null,
                                                  {
                                                    default: withCtx(
                                                      (_5, _push6, _parent6, _scopeId5) => {
                                                        var _a, _b, _c, _d, _e, _f
                                                        if (_push6) {
                                                          _push6(
                                                            `<p${_scopeId5}>${ssrInterpolate((_a = unref(course)) == null ? void 0 : _a.description)}</p><p class="text-caption"${_scopeId5}> Zeitraum: ${ssrInterpolate(formatDateRange((_b = unref(course)) == null ? void 0 : _b.startAt, (_c = unref(course)) == null ? void 0 : _c.endAt))}</p>`
                                                          )
                                                        } else {
                                                          return [
                                                            createVNode(
                                                              'p',
                                                              null,
                                                              toDisplayString(
                                                                (_d = unref(course)) == null
                                                                  ? void 0
                                                                  : _d.description
                                                              ),
                                                              1
                                                            ),
                                                            createVNode(
                                                              'p',
                                                              { class: 'text-caption' },
                                                              ' Zeitraum: ' +
                                                                toDisplayString(
                                                                  formatDateRange(
                                                                    (_e = unref(course)) == null
                                                                      ? void 0
                                                                      : _e.startAt,
                                                                    (_f = unref(course)) == null
                                                                      ? void 0
                                                                      : _f.endAt
                                                                  )
                                                                ),
                                                              1
                                                            ),
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
                                                createVNode(VCardText, null, {
                                                  default: withCtx(() => {
                                                    var _a, _b, _c
                                                    return [
                                                      createVNode(
                                                        'p',
                                                        null,
                                                        toDisplayString(
                                                          (_a = unref(course)) == null
                                                            ? void 0
                                                            : _a.description
                                                        ),
                                                        1
                                                      ),
                                                      createVNode(
                                                        'p',
                                                        { class: 'text-caption' },
                                                        ' Zeitraum: ' +
                                                          toDisplayString(
                                                            formatDateRange(
                                                              (_b = unref(course)) == null
                                                                ? void 0
                                                                : _b.startAt,
                                                              (_c = unref(course)) == null
                                                                ? void 0
                                                                : _c.endAt
                                                            )
                                                          ),
                                                        1
                                                      ),
                                                    ]
                                                  }),
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
                                      createVNode(VCard, null, {
                                        default: withCtx(() => [
                                          createVNode(VCardText, null, {
                                            default: withCtx(() => {
                                              var _a, _b, _c
                                              return [
                                                createVNode(
                                                  'p',
                                                  null,
                                                  toDisplayString(
                                                    (_a = unref(course)) == null
                                                      ? void 0
                                                      : _a.description
                                                  ),
                                                  1
                                                ),
                                                createVNode(
                                                  'p',
                                                  { class: 'text-caption' },
                                                  ' Zeitraum: ' +
                                                    toDisplayString(
                                                      formatDateRange(
                                                        (_b = unref(course)) == null
                                                          ? void 0
                                                          : _b.startAt,
                                                        (_c = unref(course)) == null
                                                          ? void 0
                                                          : _c.endAt
                                                      )
                                                    ),
                                                  1
                                                ),
                                              ]
                                            }),
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
                          _push3(
                            ssrRenderComponent(
                              VCol,
                              {
                                cols: '12',
                                md: '4',
                              },
                              {
                                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                                  if (_push4) {
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
                                                          _push6(`Buchen`)
                                                        } else {
                                                          return [createTextVNode('Buchen')]
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
                                                            ssrRenderComponent(
                                                              VTextField,
                                                              {
                                                                modelValue: unref(email),
                                                                'onUpdate:modelValue': ($event) =>
                                                                  isRef(email)
                                                                    ? (email.value = $event)
                                                                    : null,
                                                                label: 'E-Mail',
                                                                type: 'email',
                                                                density: 'comfortable',
                                                              },
                                                              null,
                                                              _parent6,
                                                              _scopeId5
                                                            )
                                                          )
                                                          if (unref(bookError)) {
                                                            _push6(
                                                              ssrRenderComponent(
                                                                VAlert,
                                                                {
                                                                  type: 'error',
                                                                  class: 'mt-2',
                                                                  variant: 'tonal',
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
                                                                        _push7(
                                                                          `${ssrInterpolate(unref(bookError))}`
                                                                        )
                                                                      } else {
                                                                        return [
                                                                          createTextVNode(
                                                                            toDisplayString(
                                                                              unref(bookError)
                                                                            ),
                                                                            1
                                                                          ),
                                                                        ]
                                                                      }
                                                                    }
                                                                  ),
                                                                  _: 1,
                                                                },
                                                                _parent6,
                                                                _scopeId5
                                                              )
                                                            )
                                                          } else {
                                                            _push6(`<!---->`)
                                                          }
                                                          if (unref(bookSuccess)) {
                                                            _push6(
                                                              ssrRenderComponent(
                                                                VAlert,
                                                                {
                                                                  type: 'success',
                                                                  class: 'mt-2',
                                                                  variant: 'tonal',
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
                                                                        _push7(
                                                                          `Buchung erfolgreich!`
                                                                        )
                                                                      } else {
                                                                        return [
                                                                          createTextVNode(
                                                                            'Buchung erfolgreich!'
                                                                          ),
                                                                        ]
                                                                      }
                                                                    }
                                                                  ),
                                                                  _: 1,
                                                                },
                                                                _parent6,
                                                                _scopeId5
                                                              )
                                                            )
                                                          } else {
                                                            _push6(`<!---->`)
                                                          }
                                                        } else {
                                                          return [
                                                            createVNode(
                                                              VTextField,
                                                              {
                                                                modelValue: unref(email),
                                                                'onUpdate:modelValue': ($event) =>
                                                                  isRef(email)
                                                                    ? (email.value = $event)
                                                                    : null,
                                                                label: 'E-Mail',
                                                                type: 'email',
                                                                density: 'comfortable',
                                                              },
                                                              null,
                                                              8,
                                                              ['modelValue', 'onUpdate:modelValue']
                                                            ),
                                                            unref(bookError)
                                                              ? (openBlock(),
                                                                createBlock(
                                                                  VAlert,
                                                                  {
                                                                    key: 0,
                                                                    type: 'error',
                                                                    class: 'mt-2',
                                                                    variant: 'tonal',
                                                                  },
                                                                  {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(
                                                                        toDisplayString(
                                                                          unref(bookError)
                                                                        ),
                                                                        1
                                                                      ),
                                                                    ]),
                                                                    _: 1,
                                                                  }
                                                                ))
                                                              : createCommentVNode('', true),
                                                            unref(bookSuccess)
                                                              ? (openBlock(),
                                                                createBlock(
                                                                  VAlert,
                                                                  {
                                                                    key: 1,
                                                                    type: 'success',
                                                                    class: 'mt-2',
                                                                    variant: 'tonal',
                                                                  },
                                                                  {
                                                                    default: withCtx(() => [
                                                                      createTextVNode(
                                                                        'Buchung erfolgreich!'
                                                                      ),
                                                                    ]),
                                                                    _: 1,
                                                                  }
                                                                ))
                                                              : createCommentVNode('', true),
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
                                                                loading: unref(booking),
                                                                color: 'primary',
                                                                variant: 'flat',
                                                                onClick: book,
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
                                                                      _push7(`Jetzt buchen`)
                                                                    } else {
                                                                      return [
                                                                        createTextVNode(
                                                                          'Jetzt buchen'
                                                                        ),
                                                                      ]
                                                                    }
                                                                  }
                                                                ),
                                                                _: 1,
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
                                                                loading: unref(booking),
                                                                color: 'primary',
                                                                variant: 'flat',
                                                                onClick: book,
                                                              },
                                                              {
                                                                default: withCtx(() => [
                                                                  createTextVNode('Jetzt buchen'),
                                                                ]),
                                                                _: 1,
                                                              },
                                                              8,
                                                              ['loading']
                                                            ),
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
                                                    createTextVNode('Buchen'),
                                                  ]),
                                                  _: 1,
                                                }),
                                                createVNode(VCardText, null, {
                                                  default: withCtx(() => [
                                                    createVNode(
                                                      VTextField,
                                                      {
                                                        modelValue: unref(email),
                                                        'onUpdate:modelValue': ($event) =>
                                                          isRef(email)
                                                            ? (email.value = $event)
                                                            : null,
                                                        label: 'E-Mail',
                                                        type: 'email',
                                                        density: 'comfortable',
                                                      },
                                                      null,
                                                      8,
                                                      ['modelValue', 'onUpdate:modelValue']
                                                    ),
                                                    unref(bookError)
                                                      ? (openBlock(),
                                                        createBlock(
                                                          VAlert,
                                                          {
                                                            key: 0,
                                                            type: 'error',
                                                            class: 'mt-2',
                                                            variant: 'tonal',
                                                          },
                                                          {
                                                            default: withCtx(() => [
                                                              createTextVNode(
                                                                toDisplayString(unref(bookError)),
                                                                1
                                                              ),
                                                            ]),
                                                            _: 1,
                                                          }
                                                        ))
                                                      : createCommentVNode('', true),
                                                    unref(bookSuccess)
                                                      ? (openBlock(),
                                                        createBlock(
                                                          VAlert,
                                                          {
                                                            key: 1,
                                                            type: 'success',
                                                            class: 'mt-2',
                                                            variant: 'tonal',
                                                          },
                                                          {
                                                            default: withCtx(() => [
                                                              createTextVNode(
                                                                'Buchung erfolgreich!'
                                                              ),
                                                            ]),
                                                            _: 1,
                                                          }
                                                        ))
                                                      : createCommentVNode('', true),
                                                  ]),
                                                  _: 1,
                                                }),
                                                createVNode(VCardActions, null, {
                                                  default: withCtx(() => [
                                                    createVNode(
                                                      VBtn,
                                                      {
                                                        loading: unref(booking),
                                                        color: 'primary',
                                                        variant: 'flat',
                                                        onClick: book,
                                                      },
                                                      {
                                                        default: withCtx(() => [
                                                          createTextVNode('Jetzt buchen'),
                                                        ]),
                                                        _: 1,
                                                      },
                                                      8,
                                                      ['loading']
                                                    ),
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
                                      createVNode(VCard, null, {
                                        default: withCtx(() => [
                                          createVNode(VCardTitle, null, {
                                            default: withCtx(() => [createTextVNode('Buchen')]),
                                            _: 1,
                                          }),
                                          createVNode(VCardText, null, {
                                            default: withCtx(() => [
                                              createVNode(
                                                VTextField,
                                                {
                                                  modelValue: unref(email),
                                                  'onUpdate:modelValue': ($event) =>
                                                    isRef(email) ? (email.value = $event) : null,
                                                  label: 'E-Mail',
                                                  type: 'email',
                                                  density: 'comfortable',
                                                },
                                                null,
                                                8,
                                                ['modelValue', 'onUpdate:modelValue']
                                              ),
                                              unref(bookError)
                                                ? (openBlock(),
                                                  createBlock(
                                                    VAlert,
                                                    {
                                                      key: 0,
                                                      type: 'error',
                                                      class: 'mt-2',
                                                      variant: 'tonal',
                                                    },
                                                    {
                                                      default: withCtx(() => [
                                                        createTextVNode(
                                                          toDisplayString(unref(bookError)),
                                                          1
                                                        ),
                                                      ]),
                                                      _: 1,
                                                    }
                                                  ))
                                                : createCommentVNode('', true),
                                              unref(bookSuccess)
                                                ? (openBlock(),
                                                  createBlock(
                                                    VAlert,
                                                    {
                                                      key: 1,
                                                      type: 'success',
                                                      class: 'mt-2',
                                                      variant: 'tonal',
                                                    },
                                                    {
                                                      default: withCtx(() => [
                                                        createTextVNode('Buchung erfolgreich!'),
                                                      ]),
                                                      _: 1,
                                                    }
                                                  ))
                                                : createCommentVNode('', true),
                                            ]),
                                            _: 1,
                                          }),
                                          createVNode(VCardActions, null, {
                                            default: withCtx(() => [
                                              createVNode(
                                                VBtn,
                                                {
                                                  loading: unref(booking),
                                                  color: 'primary',
                                                  variant: 'flat',
                                                  onClick: book,
                                                },
                                                {
                                                  default: withCtx(() => [
                                                    createTextVNode('Jetzt buchen'),
                                                  ]),
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
                              {
                                cols: '12',
                                md: '8',
                              },
                              {
                                default: withCtx(() => [
                                  createVNode(VCard, null, {
                                    default: withCtx(() => [
                                      createVNode(VCardText, null, {
                                        default: withCtx(() => {
                                          var _a, _b, _c
                                          return [
                                            createVNode(
                                              'p',
                                              null,
                                              toDisplayString(
                                                (_a = unref(course)) == null
                                                  ? void 0
                                                  : _a.description
                                              ),
                                              1
                                            ),
                                            createVNode(
                                              'p',
                                              { class: 'text-caption' },
                                              ' Zeitraum: ' +
                                                toDisplayString(
                                                  formatDateRange(
                                                    (_b = unref(course)) == null
                                                      ? void 0
                                                      : _b.startAt,
                                                    (_c = unref(course)) == null ? void 0 : _c.endAt
                                                  )
                                                ),
                                              1
                                            ),
                                          ]
                                        }),
                                        _: 1,
                                      }),
                                    ]),
                                    _: 1,
                                  }),
                                ]),
                                _: 1,
                              }
                            ),
                            createVNode(
                              VCol,
                              {
                                cols: '12',
                                md: '4',
                              },
                              {
                                default: withCtx(() => [
                                  createVNode(VCard, null, {
                                    default: withCtx(() => [
                                      createVNode(VCardTitle, null, {
                                        default: withCtx(() => [createTextVNode('Buchen')]),
                                        _: 1,
                                      }),
                                      createVNode(VCardText, null, {
                                        default: withCtx(() => [
                                          createVNode(
                                            VTextField,
                                            {
                                              modelValue: unref(email),
                                              'onUpdate:modelValue': ($event) =>
                                                isRef(email) ? (email.value = $event) : null,
                                              label: 'E-Mail',
                                              type: 'email',
                                              density: 'comfortable',
                                            },
                                            null,
                                            8,
                                            ['modelValue', 'onUpdate:modelValue']
                                          ),
                                          unref(bookError)
                                            ? (openBlock(),
                                              createBlock(
                                                VAlert,
                                                {
                                                  key: 0,
                                                  type: 'error',
                                                  class: 'mt-2',
                                                  variant: 'tonal',
                                                },
                                                {
                                                  default: withCtx(() => [
                                                    createTextVNode(
                                                      toDisplayString(unref(bookError)),
                                                      1
                                                    ),
                                                  ]),
                                                  _: 1,
                                                }
                                              ))
                                            : createCommentVNode('', true),
                                          unref(bookSuccess)
                                            ? (openBlock(),
                                              createBlock(
                                                VAlert,
                                                {
                                                  key: 1,
                                                  type: 'success',
                                                  class: 'mt-2',
                                                  variant: 'tonal',
                                                },
                                                {
                                                  default: withCtx(() => [
                                                    createTextVNode('Buchung erfolgreich!'),
                                                  ]),
                                                  _: 1,
                                                }
                                              ))
                                            : createCommentVNode('', true),
                                        ]),
                                        _: 1,
                                      }),
                                      createVNode(VCardActions, null, {
                                        default: withCtx(() => [
                                          createVNode(
                                            VBtn,
                                            {
                                              loading: unref(booking),
                                              color: 'primary',
                                              variant: 'flat',
                                              onClick: book,
                                            },
                                            {
                                              default: withCtx(() => [
                                                createTextVNode('Jetzt buchen'),
                                              ]),
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
                          default: withCtx(() => {
                            var _a
                            return [
                              createVNode(
                                VBtn,
                                {
                                  variant: 'text',
                                  to: '/courses',
                                },
                                {
                                  default: withCtx(() => [
                                    createTextVNode('\u2190 Zur\xFCck zur \xDCbersicht'),
                                  ]),
                                  _: 1,
                                }
                              ),
                              createVNode(
                                'h1',
                                { class: 'mb-2' },
                                toDisplayString(
                                  ((_a = unref(course)) == null ? void 0 : _a.title) || 'Kurs'
                                ),
                                1
                              ),
                            ]
                          }),
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
                        {
                          cols: '12',
                          md: '8',
                        },
                        {
                          default: withCtx(() => [
                            createVNode(VCard, null, {
                              default: withCtx(() => [
                                createVNode(VCardText, null, {
                                  default: withCtx(() => {
                                    var _a, _b, _c
                                    return [
                                      createVNode(
                                        'p',
                                        null,
                                        toDisplayString(
                                          (_a = unref(course)) == null ? void 0 : _a.description
                                        ),
                                        1
                                      ),
                                      createVNode(
                                        'p',
                                        { class: 'text-caption' },
                                        ' Zeitraum: ' +
                                          toDisplayString(
                                            formatDateRange(
                                              (_b = unref(course)) == null ? void 0 : _b.startAt,
                                              (_c = unref(course)) == null ? void 0 : _c.endAt
                                            )
                                          ),
                                        1
                                      ),
                                    ]
                                  }),
                                  _: 1,
                                }),
                              ]),
                              _: 1,
                            }),
                          ]),
                          _: 1,
                        }
                      ),
                      createVNode(
                        VCol,
                        {
                          cols: '12',
                          md: '4',
                        },
                        {
                          default: withCtx(() => [
                            createVNode(VCard, null, {
                              default: withCtx(() => [
                                createVNode(VCardTitle, null, {
                                  default: withCtx(() => [createTextVNode('Buchen')]),
                                  _: 1,
                                }),
                                createVNode(VCardText, null, {
                                  default: withCtx(() => [
                                    createVNode(
                                      VTextField,
                                      {
                                        modelValue: unref(email),
                                        'onUpdate:modelValue': ($event) =>
                                          isRef(email) ? (email.value = $event) : null,
                                        label: 'E-Mail',
                                        type: 'email',
                                        density: 'comfortable',
                                      },
                                      null,
                                      8,
                                      ['modelValue', 'onUpdate:modelValue']
                                    ),
                                    unref(bookError)
                                      ? (openBlock(),
                                        createBlock(
                                          VAlert,
                                          {
                                            key: 0,
                                            type: 'error',
                                            class: 'mt-2',
                                            variant: 'tonal',
                                          },
                                          {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(unref(bookError)), 1),
                                            ]),
                                            _: 1,
                                          }
                                        ))
                                      : createCommentVNode('', true),
                                    unref(bookSuccess)
                                      ? (openBlock(),
                                        createBlock(
                                          VAlert,
                                          {
                                            key: 1,
                                            type: 'success',
                                            class: 'mt-2',
                                            variant: 'tonal',
                                          },
                                          {
                                            default: withCtx(() => [
                                              createTextVNode('Buchung erfolgreich!'),
                                            ]),
                                            _: 1,
                                          }
                                        ))
                                      : createCommentVNode('', true),
                                  ]),
                                  _: 1,
                                }),
                                createVNode(VCardActions, null, {
                                  default: withCtx(() => [
                                    createVNode(
                                      VBtn,
                                      {
                                        loading: unref(booking),
                                        color: 'primary',
                                        variant: 'flat',
                                        onClick: book,
                                      },
                                      {
                                        default: withCtx(() => [createTextVNode('Jetzt buchen')]),
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
    'pages/courses/[id].vue'
  )
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0
}

export { _sfc_main as default }
//# sourceMappingURL=_id_-CObLcCga.mjs.map
