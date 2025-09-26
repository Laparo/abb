// Minimal stubs for Nitro/H3 auto-imported globals used in server/api handlers.
// Attach to globalThis so that files using them without import work in Vitest.

type H3Event = {
  context?: { params?: Record<string, string> }
  params?: Record<string, string>
  body?: unknown
}

type H3Globals = {
  defineEventHandler: <TEvent extends H3Event, TResp>(
    fn: (e: TEvent) => Promise<TResp> | TResp
  ) => (e: TEvent) => Promise<TResp> | TResp
  createError: (args: {
    statusCode?: number
    statusMessage?: string
  }) => Error & { statusCode?: number }
  getRouterParam: (event: H3Event, key: string) => string | undefined
  readBody: <T>(event: H3Event) => Promise<T | undefined>
}

const g = globalThis as unknown as H3Globals

g.defineEventHandler = function defineEventHandler<TEvent extends H3Event, TResp>(
  fn: (e: TEvent) => Promise<TResp> | TResp
) {
  return fn
}

g.createError = ({
  statusCode,
  statusMessage,
}: {
  statusCode?: number
  statusMessage?: string
}) => {
  const err = new Error(statusMessage || 'Error') as Error & { statusCode?: number }
  err.statusCode = statusCode
  return err
}

g.getRouterParam = (event: H3Event, key: string) => {
  return event?.context?.params?.[key] ?? event?.params?.[key]
}

g.readBody = async <T>(event: H3Event) => event?.body as T | undefined
