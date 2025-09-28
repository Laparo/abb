// Temporary shims until dependencies are installed. Keep minimal.
declare module 'nuxt/config' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const defineNuxtConfig: (config: any) => any
}

// Global macro fallbacks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const defineNuxtConfig: (config: any) => any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function defineEventHandler(handler: any): any

declare module '#app' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function defineNuxtPlugin(fn: any): any
}

declare module 'vuetify' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function createVuetify(options?: any): any
}

declare module 'vitest/config' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const defineConfig: (config: any) => any
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const describe: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const it: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const expect: any
}

declare module '@playwright/test' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const test: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const expect: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function defineConfig(config: any): any
}
