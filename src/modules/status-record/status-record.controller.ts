import { Request, Response } from 'express'

import { ListStatusRecordsQuerySchema, StatusStatsQuerySchema } from './dto'
import StatusRecordService from './status-record.service'

class StatusRecordController {
  static async getStatusRecords(req: Request, res: Response) {
    const query = ListStatusRecordsQuerySchema.parse(req.query)
    const userId = req.user!.id
    const records = await StatusRecordService.listByMonitor(userId, query)
    return res.ok({ records }, { message: 'Status records retrieved successfully' })
  }

  static async getStatusStats(req: Request, res: Response) {
    const query = StatusStatsQuerySchema.parse(req.query)
    const userId = req.user!.id
    const stats = await StatusRecordService.getStats(userId, query)
    return res.ok({ stats }, { message: 'Status stats retrieved successfully' })
  }
}

export default StatusRecordController
