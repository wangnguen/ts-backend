import { execFile } from 'node:child_process'
import os from 'node:os'

import { MonitorStatus } from '@common/constants/monitor.constant'

import { Monitor } from '@entities/monitor.entity'

import { CheckerResult, CheckerStatus } from './base.check'

const HOST_REGEX = /^[a-zA-Z0-9.\-_:]+$/

class PingChecker implements CheckerStatus {
  async checkStatus(monitor: Monitor): Promise<CheckerResult> {
    const host = monitor.hostname?.trim()

    if (!host || !HOST_REGEX.test(host)) {
      return {
        status: MonitorStatus.DOWN,
        latency: null,
        message: 'PING monitor requires a valid hostname'
      }
    }

    const isWindows = os.platform() === 'win32'
    const timeoutSec = Math.max(1, monitor.timeout)
    const args = isWindows
      ? ['-n', '1', '-w', String(timeoutSec * 1000), host]
      : ['-c', '1', '-W', String(timeoutSec), host]

    const start = Date.now()

    return new Promise<CheckerResult>((resolve) => {
      execFile('ping', args, { timeout: (timeoutSec + 1) * 1000 }, (error, stdout) => {
        const elapsed = Date.now() - start

        if (error) {
          return resolve({
            status: MonitorStatus.DOWN,
            latency: elapsed,
            message: error.message
          })
        }

        const latency = PingChecker.parseLatency(stdout) ?? elapsed
        resolve({ status: MonitorStatus.UP, latency })
      })
    })
  }

  private static parseLatency(output: string): number | null {
    const match = output.match(/time[=<]\s*(\d+(?:\.\d+)?)\s*ms/i)
    if (!match) return null
    const value = Number(match[1])
    return Number.isFinite(value) ? Math.round(value) : null
  }
}

export default PingChecker
