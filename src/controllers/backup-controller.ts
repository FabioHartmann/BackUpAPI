import { Request, Response } from 'express'
import * as request from 'request-promise-native'
import download from 'image-downloader'

import { CardClass } from './../class/Card-class'
import Card from './../models/card-model'

const getData = async (url: string): Promise<CardClass[]> => {
  const body = await request.get(url)
  const response: CardClass[] = JSON.parse(body)[0]
  return response
}

const waitFor = (ms): Promise<void> => new Promise((resolve): any => setTimeout(resolve, ms))

async function asyncForEach (array, callback): Promise<void> {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
const downloadImg = async (list, dest): Promise<void> => {
  let cont = 0
  await asyncForEach(list, async (link): Promise<void> => {
    await waitFor(60)
    await download.image({ url: link, dest: dest })
      .then((res): void => console.log('Imagem', cont))
      .catch((err): void => console.log(err))
    cont += 1
  })
}

const insertData = async (list): Promise<void> => {
  let cont = 0
  await asyncForEach(list, async (card): Promise<void> => {
    await waitFor(60)
    await Card.create(card)
    console.log('Carta', cont)
    cont += 1
  })
}

class BackupController {
  public async backup (req: Request, res: Response): Promise<void> {
    let resultData = await getData('https://db.ygoprodeck.com/api/v5/cardinfo.php?name=dark magician')
    if (req) {
      insertData(resultData)
      return res.status(200).json({ success: false, msg: 'Backup concluido' })
    }
    console.log(resultData.length)

    // const normalImg = resultData.map((card): string => card.image_url)
    // const smallImg = resultData.map((card): string => card.image_url_small)

    // downloadImg(normalImg, `${__dirname}/../img/pics`)
    //   .then((): Promise<void> => {
    //     return downloadImg(smallImg, `${__dirname}/../img/small_pics`)
    //   })
    //   .then((): Promise<void> => {
    //     return insertData(resultData)
    //   })
    //   .then((): Response => {
    //     return res.status(400).json({ success: false, msg: 'Backup concluido' })
    //   })
    //   .catch((): Response => {
    //     return res.status(400).json({ success: false, msg: 'Erro no backup' })
    //   })
  }
}

export default new BackupController()
