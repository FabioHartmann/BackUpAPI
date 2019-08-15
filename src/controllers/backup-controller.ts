import { Request, Response } from 'express'
import * as request from 'request-promise-native'

import { CardClass } from './../class/Card-class'
import Card from './../models/card-model'

const getData = async (url: string): Promise<CardClass[]> => {
  const body = await request.get(url)
  const response: CardClass[] = JSON.parse(body)
  return response
}

const waitFor = (ms): Promise<void> => new Promise((resolve): any => setTimeout(resolve, ms))

async function asyncForEach (array, callback): Promise<void> {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)  
  }
}

const insertData = async (list): Promise<void> => {
  await asyncForEach(list, async (card): Promise<void> => {    
    await waitFor(60);
    await Card.create(card);
  })
}

class BackupController {
  public async backup (req: Request, res: Response): Promise<Response> {
    let resultData = await getData('https://db.ygoprodeck.com/api/v5/cardinfo.php?fname=Dark Magician')
      insertData(resultData)
      return res.status(200).json({ success: true, msg: 'Backup concluido' })
  }
}

export default new BackupController()
