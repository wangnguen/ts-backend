import { z } from 'zod/v4'

export const StatusStatsQueryBaseSchema = z.object({
  monitorId: z.uuid(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional()
})

export const StatusStatsQueryExample = {
  monitorId: '00000000-0000-0000-0000-000000000000'
} satisfies z.input<typeof StatusStatsQueryBaseSchema>

export const StatusStatsQuerySchema = StatusStatsQueryBaseSchema.meta({
  example: StatusStatsQueryExample
})

export type StatusStatsQuery = z.infer<typeof StatusStatsQuerySchema>

export type StatusStats = {
  totalChecks: number
  upChecks: number
  downChecks: number
  uptimePercent: number
  avgLatency: number | null
  from: Date
  to: Date
}
