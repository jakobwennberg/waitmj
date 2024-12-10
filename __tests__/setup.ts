import { vi } from 'vitest'
import { config } from 'dotenv'

// Load environment variables from .env.test
config({ path: '.env.test' })

// Mock fetch if it doesn't exist
if (!global.fetch) {
  global.fetch = vi.fn()
}