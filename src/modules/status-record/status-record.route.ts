import { Router } from 'express'

import StatusRecordController from './status-record.controller'

const router = Router()

router.get('/records', StatusRecordController.getStatusRecords)
router.get('/stats', StatusRecordController.getStatusStats)

export default router
