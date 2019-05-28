import { Request, Response } from 'express'
import * as request from 'request-promise-native'
import download from 'image-downloader'

import { CardClass } from './../class/Card-class'
// import Card from './../models/card-model'

const getData = async (url: string): Promise<CardClass[]> => {
  const body = await request.get(url)
  const response: CardClass[] = JSON.parse(body)[0]
  return response
}

const downloadImg = async (url: string, dest): Promise<void> => {
  const options = {
    url: url,
    dest: dest
  }

  return new Promise((resolve, reject): any => {
    download.image(options)
      .then((res): void => resolve(res))
      .catch((err): void => reject(err))
  })
}

const downloadList = (list): boolean => {
  let cont = 0

  const interval = setInterval((): void => {
    const card = list[cont]

    if (cont < list.length) {
      downloadImg(card.image_url, `${__dirname}/../img/pics`)
      console.log(cont)
    } else {
      clearInterval(interval)
    }
    cont += 1
  }, 200)
  return true
}

class BackupController {
  public async backup (req: Request, res: Response): Promise<Response> {
    const resultData = await getData('https://db.ygoprodeck.com/api/v4/cardinfo.php?type=spell%20card')
    console.log(resultData.length)

    // resultData.forEach(async (card): Promise<void> => {
    //   const urlImage = card.image_url
    //   // const urlImageSmall = card.image_url_small

    //   const normalImg = await downloadImg(urlImage, `${__dirname}/../img/pics`)
    //   // const smallImg = await downloadImg(urlImageSmall, `${__dirname}/../img/small_pics`)
    //   // const cardCreate = await Card.create(card)

    //   console.log(normalImg)
    //   // console.log(smallImg)
    //   // console.log(cardCreate)
    // })

    downloadList(resultData)
    return res.status(400).json({ success: true, msg: 'Backup concluido' })
  }
}

export default new BackupController()

// https://db.ygoprodeck.com/api/v4/cardinfo.php?name=Dark%20Magician

// download (url) {
//   const options = {
//     url: url,
//     dest: `${__dirname}/img`
//   }

//   return new Promise((resolve, reject) => {
//     download.image(options)
//       .then((res) => {
//         console.log(res)
//         resolve(res)
//       })
//       .catch((err) => {
//         console.log(err)
//         reject(err)
//       })
//   })
// }
