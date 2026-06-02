import { z } from 'zod/v4'

import { registry } from '@docs/registry'

import { MonitorStatus } from '@common/constants/monitor.constant'

import { ListStatusRecordsQuerySchema } from '@modules/status-record/dto/list-status-records.dto'
import { StatusStatsQuerySchema } from '@modules/status-record/dto/status-stats.dto'

import {
  successWrapper,
  unauthorizedResponse,
  validationErrorResponse,
  forbiddenResponse,
  errorResponse
} from './shared'

const StatusRecordSchema = registry.register(
  'StatusRecord',
  z.object({
    id: z.uuid().meta({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }),
    status: z
      .enum(Object.values(MonitorStatus) as [MonitorStatus, ...MonitorStatus[]])
      .meta({ example: MonitorStatus.UP }),
    latency: z.number().nullable().meta({ example: 134, description: 'Response latency in milliseconds' }),
    statusCode: z.number().nullable().meta({ example: 200, description: 'HTTP status code (HTTP/HTTPS checks only)' }),
    message: z.string().nullable().meta({ example: null, description: 'Failure reason when the check is down' }),
    checkedAt: z.iso.datetime().meta({ example: '2024-01-15T10:30:00.000Z' }),
    monitorId: z.uuid().meta({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  })
)

const PaginatedStatusRecordSchema = z.object({
  entries: z.array(StatusRecordSchema),
  limit: z.number().meta({ example: 50 }),
  offset: z.number().meta({ example: 0 }),
  total_count: z.number().optional().meta({ example: 1440 })
})

const StatusStatsSchema = registry.register(
  'StatusStats',
  z.object({
    totalChecks: z.number().meta({ example: 1440 }),
    upChecks: z.number().meta({ example: 1430 }),
    downChecks: z.number().meta({ example: 10 }),
    uptimePercent: z.number().meta({ example: 99.31, description: 'Percentage of up checks within the window' }),
    avgLatency: z.number().nullable().meta({ example: 142, description: 'Average latency in milliseconds' }),
    from: z.iso.datetime().meta({ example: '2024-01-14T10:30:00.000Z' }),
    to: z.iso.datetime().meta({ example: '2024-01-15T10:30:00.000Z' })
  })
)

const notFoundResponse = errorResponse(404, 'Monitor not found', 'Not Found')

registry.registerPath({
  method: 'get',
  path: '/status-records/records',
  tags: ['Status Records'],
  summary: 'List status records for a monitor (paginated)',
  description: `Returns a paginated list of check results for a monitor, newest first.\n\n**Query params**\n\n
  - \`monitorId\` — UUID of the monitor (required)\n
  - \`from\` / \`to\` — ISO date range filter on \`checkedAt\` (optional)\n
  - \`limit\` — items per page (default: 50, max: 500)\n
  - \`offset\` — items to skip (default: 0)`,
  security: [{ bearerAuth: [] }],
  request: {
    query: ListStatusRecordsQuerySchema
  },
  responses: {
    200: {
      description: 'Paginated list of status records',
      content: {
        'application/json': {
          schema: successWrapper(
            z.object({ records: PaginatedStatusRecordSchema }),
            '/status-records/records',
            200,
            'Status records retrieved successfully'
          )
        }
      }
    },
    401: unauthorizedResponse('Missing or invalid access token'),
    403: forbiddenResponse('Monitor belongs to another user'),
    404: notFoundResponse,
    422: validationErrorResponse()
  }
})

registry.registerPath({
  method: 'get',
  path: '/status-records/stats',
  tags: ['Status Records'],
  summary: 'Get uptime stats for a monitor',
  description: `Returns aggregated uptime statistics for a monitor within a time window.\n\n**Query params**\n\n
  - \`monitorId\` — UUID of the monitor (required)\n
  - \`from\` / \`to\` — ISO date range (optional, defaults to the last 24 hours)`,
  security: [{ bearerAuth: [] }],
  request: {
    query: StatusStatsQuerySchema
  },
  responses: {
    200: {
      description: 'Aggregated uptime statistics',
      content: {
        'application/json': {
          schema: successWrapper(
            z.object({ stats: StatusStatsSchema }),
            '/status-records/stats',
            200,
            'Status stats retrieved successfully'
          )
        }
      }
    },
    401: unauthorizedResponse('Missing or invalid access token'),
    403: forbiddenResponse('Monitor belongs to another user'),
    404: notFoundResponse,
    422: validationErrorResponse()
  }
})
