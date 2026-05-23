import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'

import env from '@common/config/env'
import logger from '@common/config/logger'

import AppDataSource from '@databases/data-source'

import app from './app'

const bootstrap = async () => {
  const storageDir = path.resolve(env.STORAGE_DIR)
  try {
    fs.mkdirSync(storageDir, { recursive: true })
    fs.accessSync(storageDir, fs.constants.W_OK)
    logger.info(`Storage directory ready: ${storageDir}`)
  } catch (err) {
    logger.fatal({ err, storageDir }, 'Storage directory is not writable — check STORAGE_DIR and permissions')
    process.exit(1)
  }

  await AppDataSource.connect()

  const server = app.listen(env.PORT, () => {
    logger.info(`Server is running on port ${env.PORT}`)
  })

  const gracefulShutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`)

    server.close(async () => {
      try {
        const dataSource = AppDataSource.getDataSource()
        if (dataSource.isInitialized) {
          await dataSource.destroy()
          logger.info('Database connection closed')
        }
      } catch (err) {
        logger.error(err, 'Error closing database connection')
      }
      logger.info('Server closed')
      process.exit(0)
    })

    setTimeout(() => {
      logger.error('Forced shutdown after timeout')
      process.exit(1)
    }, 10_000)
  }

  process.on('SIGINT', () => gracefulShutdown('SIGINT'))
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
}

bootstrap().catch((err) => {
  logger.fatal(err, 'Failed to start server')
  process.exit(1)
})
