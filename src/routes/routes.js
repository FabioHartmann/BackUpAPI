import { Router } from 'express'

import backup from './../controllers/backup-controller'

const router = Router()

// Cliente
router.get('/backup', backup.backup)

export default router
