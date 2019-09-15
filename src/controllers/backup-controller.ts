import { Request, Response } from 'express'
import * as request from 'request-promise-native'

import { CardClass } from './../class/Card-class'
import Card from './../models/card-model'

const getData = async (url: string): Promise<CardClass[]> => {
  const body = await request.get(url)
  const response: CardClass[] = JSON.parse(body)
  return response
}

class BackupController {
  public async backup (req: Request, res: Response): Promise<any> {
    let resultData = await getData('https://db.ygoprodeck.com/api/v5/cardinfo.php')
      await Card.create(resultData).then(()=>{
        return res.status(200).json({ success: true, msg: 'Backup em Execução' })
      }).catch(()=>{
        return res.status(200).json({ success: true, msg: 'Backup em Execução' })
      })
  }
}

export default new BackupController()
