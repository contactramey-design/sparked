import type { IncomingMessage, ServerResponse } from 'node:http'

type NextFn = (err?: unknown) => void
export function ttsMiddleware(): (req: IncomingMessage, res: ServerResponse, next: NextFn) => void | Promise<void>
