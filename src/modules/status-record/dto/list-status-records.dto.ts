import { z } from 'zod/v4'

export const ListStatusRecordsQueryBaseSchema = z.object({
  monitorId: z.uuid(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  limit: z.coerce.number().int().positive().max(500).default(50),
  offset: z.coerce.number().int().nonnegative().default(0)
})

export const ListStatusRecordsQueryExample = {
  monitorId: '00000000-0000-0000-0000-000000000000',
  limit: 50,
  offset: 0
} satisfies z.input<typeof ListStatusRecordsQueryBaseSchema>

export const ListStatusRecordsQuerySchema = ListStatusRecordsQueryBaseSchema.meta({
  example: ListStatusRecordsQueryExample
})

export type ListStatusRecordsQuery = z.infer<typeof ListStatusRecordsQuerySchema>
