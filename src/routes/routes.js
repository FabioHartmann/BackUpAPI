import { Router } from 'express'

import backup from './../controllers/backup-controller'
import user from './../controllers/user-controler'
import jwt from './../middlewares/authentication'

const router = Router()

router.get('/backup', backup.backup)

router.post('/user', user.createUser)

router.post('/login/', user.login)

router.post('/inserIntoColection',
//  jwt,
  user.insertCardIntoColection)

router.delete('/deleteIntoColection',
//  jwt,
  user.removeCardIntoColection)

router.post('/createDeck',
//  jwt,
  user.createDeck)

router.delete('/deleteDeck',
//  jwt,
  user.deleteDeck)

router.get('/userCardsList/:username',
//  jwt,
  user.userCardsList)

router.get('/singleCard/:card_id', user.singleCard)

router.post('/insertCardIntoDeck',
//  jwt,
  user.insertCardIntoDeck)

router.get('/allCards', user.allCardList)

router.delete('/deleteCardIntoDeck',
//  jwt,
  user.removeCardIntoDeck)

  router.get('/allDecks',
  //jwt,
  user.listAllDeck
  )
  router.get('/deck',
  //jwt,
  user.findDeck
  )
  

export default router
