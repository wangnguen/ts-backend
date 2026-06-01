import logger from '@common/config/logger'

import MonitorRepository from '@modules/monitor/monitor.repository'

import { Monitor } from '@entities/monitor.entity'

import CheckRunner from './check-runner'

type ScheduledJob = {
  monitorId: string
  interval: number
  timer: NodeJS.Timeout
}

class SchedulerService {
  private static jobs: Map<string, ScheduledJob> = new Map()

  static async start(): Promise<void> {
    const monitors = await MonitorRepository.findAllActive()
    for (const monitor of monitors) {
      SchedulerService.scheduleMonitor(monitor)
    }
    logger.info(`Scheduler started: ${monitors.length} monitor(s) scheduled`)
  }

  static scheduleMonitor(monitor: Monitor): void {
    if (!monitor.isActive) return

    SchedulerService.unscheduleMonitor(monitor.id)

    const intervalMs = Math.max(1, monitor.interval) * 1000
    const timer = setInterval(() => {
      SchedulerService.executeCheck(monitor.id)
    }, intervalMs)

    SchedulerService.jobs.set(monitor.id, {
      monitorId: monitor.id,
      interval: monitor.interval,
      timer
    })

    SchedulerService.executeCheck(monitor.id)

    logger.debug({ monitorId: monitor.id, interval: monitor.interval }, 'Monitor scheduled')
  }

  static unscheduleMonitor(id: string): void {
    const job = SchedulerService.jobs.get(id)
    if (!job) return
    clearInterval(job.timer)
    SchedulerService.jobs.delete(id)
    logger.debug({ monitorId: id }, 'Monitor unscheduled')
  }

  static rescheduleMonitor(monitor: Monitor): void {
    SchedulerService.unscheduleMonitor(monitor.id)
    if (monitor.isActive) {
      SchedulerService.scheduleMonitor(monitor)
    }
  }

  static stop(): void {
    for (const job of SchedulerService.jobs.values()) {
      clearInterval(job.timer)
    }
    SchedulerService.jobs.clear()
    logger.info('Scheduler stopped')
  }

  private static async executeCheck(monitorId: string): Promise<void> {
    try {
      const monitor = await MonitorRepository.findById(monitorId)
      if (!monitor || !monitor.isActive) {
        SchedulerService.unscheduleMonitor(monitorId)
        return
      }
      await CheckRunner.runCheck(monitor)
    } catch (err) {
      logger.error({ err, monitorId }, 'Scheduled check failed')
    }
  }
}

export default SchedulerService
