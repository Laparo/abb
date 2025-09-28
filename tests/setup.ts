// Vitest global setup for Vue + Vuetify
import { config } from '@vue/test-utils'
import { ref } from 'vue'

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

// ----- Nuxt/H3 test globals & mocks -----
// Minimal defineNuxtRouteMiddleware passthrough so middleware files can be imported
;(globalThis as any).defineNuxtRouteMiddleware = (fn: any) => fn

// Minimal navigateTo default (individual tests may vi.mock('#app') for assertions)
if (!(globalThis as any).navigateTo) {
  ;(globalThis as any).navigateTo = (to: any) => to
}

// createError compatible with H3 shape used in app/composables
if (!(globalThis as any).createError) {
  ;(globalThis as any).createError = ({
    statusCode,
    statusMessage,
  }: {
    statusCode?: number
    statusMessage?: string
  }) => {
    const err: any = new Error(statusMessage || 'Error')
    err.statusCode = statusCode || 500
    err.statusMessage = statusMessage
    err.data = { message: statusMessage }
    return err
  }
}

// Mock $fetch with simple URL-based router for unit/integration tests
if (!(globalThis as any).$fetch) {
  const mockFetch = vi.fn(async (input: string) => {
    try {
      // Stream endpoint for videos
      if (/^\/api\/materials\/video\/(\d+)\/stream$/.test(input)) {
        const id = Number(input.match(/video\/(\d+)\/stream/)?.[1] || '0')
        return {
          streamUrl: `https://cdn.example.com/stream/${id}?token=mock`,
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // +2h
        }
      }

      // Course materials listing
      if (/^\/api\/materials\/(\d+)$/.test(input)) {
        const courseId = Number(input.match(/materials\/(\d+)/)?.[1] || '0')
        if (courseId === 999) {
          // Simulate not found
          throw (globalThis as any).createError({
            statusCode: 404,
            statusMessage: 'Course not found',
          })
        }
        return {
          courseTitle: `Course ${courseId}`,
          accessGranted: true,
          materials: [
            {
              id: 1,
              courseId,
              type: 'TEXT',
              title: 'Course Notes',
              url: '/materials/course-notes.pdf',
              isActive: true,
              accessType: 'direct',
            },
            {
              id: 2,
              courseId,
              type: 'VIDEO',
              title: 'Intro Video',
              url: '/videos/intro.mp4',
              isActive: true,
              accessType: 'stream',
              streamUrl: 'https://cdn.example.com/stream/2?token=mock',
              expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            },
          ],
        }
      }

      // Direct text material access
      if (input.startsWith('/materials/')) {
        return 'Mock file content'
      }

      // Fallback
      return {}
    } catch (e) {
      // Simulate $fetch throwing with H3-like error
      const ee: any = e as any
      if (ee && (ee.statusCode || ee.statusMessage || ee.data)) {
        // Already a structured error; rethrow as-is
        throw ee
      }
      const err: any = new Error((e as Error).message)
      err.statusCode = 500
      err.statusMessage = (e as Error).message
      err.data = { message: (e as Error).message }
      throw err
    }
  })

  ;(globalThis as any).$fetch = mockFetch
}

// Mock nuxt-auth useAuth composable used by useAppAuth
if (!(globalThis as any).useAuth) {
  const session = ref<{ user: any } | null>(null)
  const status = ref<'unauthenticated' | 'authenticated' | 'loading'>('unauthenticated')
  ;(globalThis as any).useAuth = () => ({
    data: session,
    status,
    signIn: vi.fn(async () => {
      status.value = 'authenticated'
      session.value = {
        user: { email: 'test@example.com', name: 'Test User', externalId: 'ext-1' },
      }
    }),
    signOut: vi.fn(async () => {
      status.value = 'unauthenticated'
      session.value = null
    }),
  })
}

// --- Minimal Nuxt runtime config mock ---
if (!(globalThis as any).useRuntimeConfig) {
  ;(globalThis as any).useRuntimeConfig = () => ({
    public: {
      apiBase: '',
    },
  })
}

// --- Expose useApiClient via global for auto-import like behaviour in tests ---
try {
  if (!(globalThis as any).useApiClient) {
    const mod = await import('../composables/useApiClient')
    if (mod && typeof (mod as any).useApiClient === 'function') {
      ;(globalThis as any).useApiClient = (mod as any).useApiClient
    }
  }
} catch {
  // ignore import issues; individual tests can mock instead
}
