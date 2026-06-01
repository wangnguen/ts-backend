import logger from '@common/config/logger'
import { MonitorType } from '@common/constants/monitor.constant'

import MonitorRepository from '@modules/monitor/monitor.repository'
import StatusRecordRepository from '@modules/status-record/status-record.repository'

import { Monitor } from '@entities/monitor.entity'

import { CheckerResult } from '../checkers/base.check'
import HttpChecker from '../checkers/http.check'
import PingChecker from '../checkers/ping.check'
import TcpChecker from '../checkers/tcp.check'

type CheckerFn = (monitor: Monitor) => Promise<CheckerResult>

class CheckRunner {
  static async runCheck(monitor: Monitor): Promise<void> {
    const checker = CheckRunner.checkers[monitor.type] ?? CheckRunner.httpStatusChecker

    let result: CheckerResult
    try {
      result = await checker(monitor)
    } catch (err) {
      result = {
        status: 'down',
        latency: null,
        message: err instanceof Error ? err.message : 'Unknown checker error'
      }
    }

    const checkedAt = new Date()

    await StatusRecordRepository.createStatusRecord({
      monitorId: monitor.id,
      status: result.status,
      latency: result.latency,
      statusCode: result.statusCode ?? null,
      message: result.message ?? null,
      checkedAt
    })

    await MonitorRepository.updateMonitor(monitor.id, {
      currentStatus: result.status,
      lastCheckedAt: checkedAt
    })

    logger.debug({ monitorId: monitor.id, status: result.status, latency: result.latency }, 'Monitor check completed')
  }

  private static httpStatusChecker: CheckerFn = (monitor) => new HttpChecker().checkStatus(monitor)
  private static tcpStatusChecker: CheckerFn = (monitor) => new TcpChecker().checkStatus(monitor)
  private static pingStatusChecker: CheckerFn = (monitor) => new PingChecker().checkStatus(monitor)

  private static checkers: Partial<Record<MonitorType, CheckerFn>> = {
    [MonitorType.HTTP]: CheckRunner.httpStatusChecker,
    [MonitorType.HTTPS]: CheckRunner.httpStatusChecker,
    [MonitorType.TCP]: CheckRunner.tcpStatusChecker,
    [MonitorType.PING]: CheckRunner.pingStatusChecker
  }
}

export default CheckRunner
