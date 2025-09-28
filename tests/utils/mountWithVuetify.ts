import { mount, type MountingOptions, type VueWrapper } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import type { Component } from 'vue'

/**
 * Mount a Vue component with a Vuetify plugin instance pre-configured.
 */
export type VuetifyThemeOption = 'light' | 'dark'

// TODO: tighten the generic typing without relying on `any`; VTU's complex generics make this
// helper tricky to type strictly across Options API and SFCs. For now, we accept `any` here
// in test-only utility code with a clear migration note.
export function mountWithVuetify<T extends Component>(
  component: T,
  options: MountingOptions<InstanceType<any>> = {},
  theme: VuetifyThemeOption = 'light'
): VueWrapper<any> {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: theme,
    },
  })

  return mount(component as any, {
    ...options,
    global: {
      plugins: [vuetify, ...(options.global?.plugins ?? [])],
      ...(options.global || {}),
    },
  })
}
