import net from 'node:net'

import { MonitorStatus } from '@common/constants/monitor.constant'

import { Monitor } from '@entities/monitor.entity'

import { CheckerResult, CheckerStatus } from './base.check'

class TcpChecker implements CheckerStatus {
  async checkStatus(monitor: Monitor): Promise<CheckerResult> {
    const { hostname, port } = monitor
    if (!hostname || !port) {
      return {
        status: MonitorStatus.DOWN,
        latency: null,
        message: 'TCP monitor requires hostname and port'
      }
    }

    const start = Date.now()

    return new Promise<CheckerResult>((resolve) => {
      const socket = new net.Socket()
      let settled = false

      const finish = (result: CheckerResult) => {
        if (settled) return
        settled = true
        socket.destroy()
        resolve(result)
      }

      socket.setTimeout(monitor.timeout * 1000)

      socket.once('connect', () => {
        finish({ status: MonitorStatus.UP, latency: Date.now() - start })
      })

      socket.once('timeout', () => {
        finish({
          status: MonitorStatus.DOWN,
          latency: Date.now() - start,
          message: `TCP connect timeout after ${monitor.timeout}s`
        })
      })

      socket.once('error', (err) => {
        finish({
          status: MonitorStatus.DOWN,
          latency: Date.now() - start,
          message: err.message
        })
      })

      socket.connect(port, hostname)
    })
  }
}

export default TcpChecker
