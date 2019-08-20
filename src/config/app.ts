import express from 'express'
import cors from 'cors'
import { connect, ConnectionOptions } from 'mongoose'
import bodyParser from 'body-parser'

import ColorCMD from '../util/ColorCMD'

// // Rotas
import routes from '../routes/routes'

class App {
    public express: express.Application

    public constructor () {
      this.express = express()
      this.database()
      this.middlewares()
      this.routes()
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
      connect('mongodb://localhost:27017/cards', options)
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
}

export default new App().express
