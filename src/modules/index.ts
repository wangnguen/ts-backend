import { Router } from 'express'
import HealthRoute from './health/health.route'

const routers = Router()

routers.use('/health', HealthRoute)

export default Router().use('/api', routers)
