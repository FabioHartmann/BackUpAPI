import express from 'express'
import cors from 'cors'
import { connect, ConnectionOptions } from 'mongoose'
import bodyParser from 'body-parser'

import ColorCMD from '../util/ColorCMD'

import jwt from './../middlewares/authentication'
import http from 'http'

// // Rotas
import routes from '../routes/routes'

class App {
    public express: express.Application

    public constructor () {
      this.express = express()
      this.database()
      this.middlewares()
      this.routes()
      this.backup('https://db.ygoprodeck.com/api/v4/cardinfo.php?name=Dark%20Magician')
    }

    private middlewares (): void {
      this.express.use(cors())
      this.express.use(bodyParser.urlencoded({ extended: true }))
      this.express.use(express.json())
    }

    private database (): void {
      const options: ConnectionOptions = {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
      }
      connect('mongodb://localhost/fabio', options)
        .then((): void => {
          ColorCMD('blue', '', '[mongoose] Conectado')
        })
        .catch((err): void => {
          ColorCMD('red', '', `Erro: ${err}`)
        })
    }

    private routes (): void {
      this.express.use('/', routes)
    }

    private backup (url): void {
      this.script(url)
    }

    public async script (url): Promise<void> {
      return new Promise((resolve, reject): void => {
        http.get(url, (res): void => {
          console.log(res)
        })

        let a = true
        if (a) {
          resolve()
        } else {
          reject(new Error('error'))
        }
      })
    }
}

export default new App().express

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
