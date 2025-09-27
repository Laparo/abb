// Vitest global setup for Vue + Vuetify
import { config } from '@vue/test-utils'

// Silence Vuetify warnings in tests (optional)
config.global.stubs = {
  transition: false,
}

config.global.mocks = {
  // add global mocks if needed
}

// Polyfill visualViewport for Vuetify overlays in JSDOM

// Stub HTMLMediaElement play/pause to avoid jsdom "Not implemented" noise in media tests
if ('HTMLMediaElement' in globalThis) {
  type MediaProto = { play?: () => Promise<void>; pause?: () => void }
  const HTMLMediaElementCtor = (
    globalThis as unknown as { HTMLMediaElement: { prototype: MediaProto } }
  ).HTMLMediaElement
  const proto = HTMLMediaElementCtor.prototype as MediaProto
  Object.defineProperty(proto, 'play', {
    configurable: true,
    writable: true,
    value: vi.fn().mockResolvedValue(undefined),
  })
  Object.defineProperty(proto, 'pause', {
    configurable: true,
    writable: true,
    value: vi.fn(),
  })
}

// Polyfill minimal DataTransfer for drag & drop tests (JSDOM lacks it)
class __TestDataTransfer__ {
  items: { add: (file: File) => void; _files: File[] }
  files: File[]
  constructor() {
    const buf: File[] = []
    this.items = {
      add: (file: File) => buf.push(file),
      _files: buf,
    }
    this.files = buf
  }
}

declare global {
  // augment globalThis typings used in tests
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace globalThis {
    // minimal visualViewport shape for Vuetify
    interface VisualViewportLike {
      addEventListener: (type: string, listener: () => void) => void
      removeEventListener: (type: string, listener: () => void) => void
      width: number
      height: number
      scale: number
      pageLeft: number
      pageTop: number
    }
  }
}

// inject DataTransfer if missing
if (!(globalThis as unknown as Record<string, unknown>).DataTransfer) {
  const g = globalThis as unknown as { DataTransfer?: unknown }
  g.DataTransfer = __TestDataTransfer__
}

// Polyfill visualViewport for Vuetify overlays in JSDOM
const gv = globalThis as unknown as Record<string, unknown>
if (!('visualViewport' in gv)) {
  gv.visualViewport = {
    addEventListener: () => {},
    removeEventListener: () => {},
    width: 1024,
    height: 768,
    scale: 1,
    pageLeft: 0,
    pageTop: 0,
  }
}

// Polyfill URL.createObjectURL / revokeObjectURL for previews
if (!('createObjectURL' in URL)) {
  // @ts-expect-error: define missing API for test environment
  URL.createObjectURL = (blob: Blob) => {
    const file = blob as Blob & { name?: string }
    const name = file.name ?? 'blob'
    return `blob:mock/${name}-${Math.random().toString(36).slice(2)}`
  }
}
if (!('revokeObjectURL' in URL)) {
  // @ts-expect-error: define missing API for test environment
  URL.revokeObjectURL = () => {}
}
