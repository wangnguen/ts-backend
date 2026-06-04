import axios from 'axios'

import { MonitorStatus } from '@common/constants/monitor.constant'

import { Monitor } from '@entities/monitor.entity'

import { CheckerResult, CheckerStatus } from './base.check'

class HttpChecker implements CheckerStatus {
  async checkStatus(monitor: Monitor): Promise<CheckerResult> {
    if (!monitor.target) {
      return {
        status: MonitorStatus.DOWN,
        latency: null,
        message: 'HTTP monitor requires target'
      }
    }

    const start = Date.now()
    try {
      const response = await axios(monitor.target, {
        timeout: monitor.timeout * 1000,
        validateStatus: () => true
      })
      const latency = Date.now() - start

      const isStatusAccepted = monitor.acceptedStatusCodes?.length
        ? monitor.acceptedStatusCodes.includes(response.status)
        : response.status >= 200 && response.status < 300

      const isKeywordMatch = monitor.keyword
        ? typeof response.data === 'string' && response.data.includes(monitor.keyword)
        : true

      return {
        status: isStatusAccepted && isKeywordMatch ? MonitorStatus.UP : MonitorStatus.DOWN,
        latency,
        statusCode: response.status
      }
    } catch (error) {
      return {
        status: MonitorStatus.DOWN,
        latency: Date.now() - start,
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

export default HttpChecker
