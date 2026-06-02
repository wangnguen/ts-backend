import { Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'

import { MonitorStatus } from '@common/constants/monitor.constant'

import StatusRecord from '@entities/status-record.entity'

import AppDataSource from '@databases/data-source'

type RangeFilter = {
  monitorId: string
  from?: Date
  to?: Date
}

class StatusRecordRepository {
  static createStatusRecord(data: Partial<StatusRecord>) {
    const record = this.StatusRecordRepo.create(data)
    return this.StatusRecordRepo.save(record)
  }

  static findByMonitor(filter: RangeFilter & { limit: number; offset: number }) {
    return this.StatusRecordRepo.findAndCount({
      where: this.buildWhere(filter),
      order: { checkedAt: 'DESC' },
      take: filter.limit,
      skip: filter.offset
    })
  }

  static async getStats(filter: RangeFilter) {
    const qb = this.StatusRecordRepo.createQueryBuilder('record').where('record.monitor_id = :monitorId', {
      monitorId: filter.monitorId
    })

    if (filter.from) qb.andWhere('record.checked_at >= :from', { from: filter.from })
    if (filter.to) qb.andWhere('record.checked_at <= :to', { to: filter.to })

    const row = await qb
      .select('COUNT(*)', 'total')
      .addSelect(`SUM(CASE WHEN record.status = :up THEN 1 ELSE 0 END)`, 'up')
      .addSelect(`SUM(CASE WHEN record.status = :down THEN 1 ELSE 0 END)`, 'down')
      .addSelect('AVG(record.latency)', 'avgLatency')
      .setParameters({ up: MonitorStatus.UP, down: MonitorStatus.DOWN })
      .getRawOne<{ total: string; up: string; down: string; avgLatency: string | null }>()

    return {
      total: Number(row?.total ?? 0),
      up: Number(row?.up ?? 0),
      down: Number(row?.down ?? 0),
      avgLatency: row?.avgLatency != null ? Number(row.avgLatency) : null
    }
  }

  private static buildWhere(filter: RangeFilter): FindOptionsWhere<StatusRecord> {
    const where: FindOptionsWhere<StatusRecord> = { monitorId: filter.monitorId }
    if (filter.from && filter.to) where.checkedAt = Between(filter.from, filter.to)
    else if (filter.from) where.checkedAt = MoreThanOrEqual(filter.from)
    else if (filter.to) where.checkedAt = LessThanOrEqual(filter.to)
    return where
  }

  private static get StatusRecordRepo() {
    return AppDataSource.getDataSource().getRepository(StatusRecord)
  }
}

export default StatusRecordRepository
