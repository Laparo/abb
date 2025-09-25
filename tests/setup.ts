// Vitest global setup for Vue + Vuetify
import { config } from '@vue/test-utils'

// Silence Vuetify warnings in tests (optional)
config.global.stubs = {
  transition: false,
}

config.global.mocks = {
  // add global mocks if needed
}
