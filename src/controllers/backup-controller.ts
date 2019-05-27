import { Request, Response } from 'express'

// import functions from '../backup'

class BackupController {
  public async backup (req: Request, res: Response): Promise<Response> {
    // const request = await functions.script('https://db.ygoprodeck.com/api/v4/cardinfo.php?name=Dark%20Magician')
    // const response = request[0][0].image_url

    // functions.download(response)
    return res.status(400).json({ success: false, content: 'response' })
  }
}

export default new BackupController()
