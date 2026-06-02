import { Paginated } from '@common/types'

import MonitorService from '@modules/monitor/monitor.service'

import StatusRecord from '@entities/status-record.entity'

import { ListStatusRecordsQuery, StatusStats, StatusStatsQuery } from './dto'
import StatusRecordRepository from './status-record.repository'

const DEFAULT_STATS_WINDOW_MS = 24 * 60 * 60 * 1000

class StatusRecordService {
  static async listByMonitor(userId: string, query: ListStatusRecordsQuery): Promise<Paginated<StatusRecord>> {
    await MonitorService.getMonitorById(query.monitorId, userId)

    const [entries, total_count] = await StatusRecordRepository.findByMonitor({
      monitorId: query.monitorId,
      from: query.from,
      to: query.to,
      limit: query.limit,
      offset: query.offset
    })

    return { entries, limit: query.limit, offset: query.offset, total_count }
  }

  static async getStats(userId: string, query: StatusStatsQuery): Promise<StatusStats> {
    await MonitorService.getMonitorById(query.monitorId, userId)

    const to = query.to ?? new Date()
    const from = query.from ?? new Date(to.getTime() - DEFAULT_STATS_WINDOW_MS)

    const { total, up, down, avgLatency } = await StatusRecordRepository.getStats({
      monitorId: query.monitorId,
      from,
      to
    })

    const uptimePercent = total > 0 ? Number(((up / total) * 100).toFixed(2)) : 0

    return {
      totalChecks: total,
      upChecks: up,
      downChecks: down,
      uptimePercent,
      avgLatency: avgLatency != null ? Math.round(avgLatency) : null,
      from,
      to
    }
  }
}

export default StatusRecordService
