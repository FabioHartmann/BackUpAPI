import { Request, Response } from 'express'
import * as request from 'request-promise-native'

import { CardClass } from './../class/Card-class'
import Card from './../models/card-model'

var assert = require('assert');

const getData = async (url: string): Promise<CardClass[]> => {
  const body = await request.get(url)
  const response: CardClass[] = JSON.parse(body)
  return response
}

class BackupController {
  public async backup (req: Request, res: Response): Promise<any> {
    let resultData = await getData('https://db.ygoprodeck.com/api/v5/cardinfo.php')

    resultData.forEach(async card => {
      var query = {id: card.id};
      await Card.
        updateOne(query, card);      
    });
    
    await Card.insertMany(resultData,{ ordered: false }).then(()=>{
      return res.status(200).json({ success: true, msg: 'Backup Concluído' })
    }).catch((e)=>{
      console.log(e);
      return res.status(401).json({ success: false, msg: 'Falha' })
    })
  }
}



export default new BackupController()
