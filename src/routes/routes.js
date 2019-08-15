import { Router } from 'express'

import backup from './../controllers/backup-controller'
import user from './../controllers/user-controler'

const router = Router()

router.get('/backup', backup.backup)

router.post('/user', user.createUser)

router.get('/login/:user/:pass', user.login)

router.post('/inserIntoColection', user.insertCardIntoColection)

router.delete('/deleteIntoColection', user.removeCardIntoColection)

router.post('/createDeck', user.createDeck)

router.delete('/deleteDeck', user.deleteDeck)

router.get('/userCardsList/:username', user.userCardsList)

router.get('/singleCard/:card_id', user.singleCard)

router.post('/insertCardIntoDeck', user.insertCardIntoDeck)

router.get('/allCards', user.allCardList)
export default router
