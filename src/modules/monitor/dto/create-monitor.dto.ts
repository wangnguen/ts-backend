import { z } from 'zod/v4'

import { MonitorType } from '@common/constants/monitor.constant'

const CreateMonitorBodyBaseSchema = z
  .object({
    name: z.string().min(1).max(100),
    type: z.enum(Object.values(MonitorType) as [MonitorType, ...MonitorType[]]).default(MonitorType.HTTP),
    target: z.string().min(1).nullable().default(null),
    hostname: z.string().min(1).max(255).nullable().default(null),
    port: z.int().min(1).max(65535).nullable().default(null),
    interval: z.int().positive().default(60),
    timeout: z.int().positive().default(30),
    retries: z.int().nonnegative().default(1),
    isActive: z.boolean().default(true),
    acceptedStatusCodes: z.array(z.int().positive()).default([200, 201, 204]),
    keyword: z.string().nullable().default(null)
  })
  .superRefine((data, ctx) => {
    if (data.type === MonitorType.HTTP || data.type === MonitorType.HTTPS) {
      if (!data.target) {
        ctx.addIssue({ code: 'custom', path: ['target'], message: 'target is required for HTTP/HTTPS monitors' })
      }
    }
    if (data.type === MonitorType.TCP) {
      if (!data.hostname) {
        ctx.addIssue({ code: 'custom', path: ['hostname'], message: 'hostname is required for TCP monitors' })
      }
      if (data.port == null) {
        ctx.addIssue({ code: 'custom', path: ['port'], message: 'port is required for TCP monitors' })
      }
    }
    if (data.type === MonitorType.PING) {
      if (!data.hostname) {
        ctx.addIssue({ code: 'custom', path: ['hostname'], message: 'hostname is required for PING monitors' })
      }
    }
  })

export const CreateMonitorBodyExample = {
  name: 'Production API',
  type: MonitorType.HTTP,
  target: 'https://example.com',
  hostname: null,
  port: null,
  interval: 60,
  timeout: 30,
  retries: 1,
  isActive: true,
  acceptedStatusCodes: [200, 201, 204],
  keyword: null
} satisfies z.input<typeof CreateMonitorBodyBaseSchema>

export const CreateMonitorBodySchema = CreateMonitorBodyBaseSchema.meta({
  example: CreateMonitorBodyExample
})

export type CreateMonitorBody = z.infer<typeof CreateMonitorBodySchema>
