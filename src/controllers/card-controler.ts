import { Request, Response } from 'express';
import * as request from 'request-promise-native'
import Card from './../models/card-model'


class CardController{
    public async insertCardIntoColection (req: Request, res: Response): Promise<void> {
        
        Card.create(req.body).then(() =>{
        return res.status(200).json({ success: true, msg: 'Usuário Incluido' })
       }).catch(() =>{
        return res.status(400).json({ success: true, msg: 'Erro ao incluir' })
       });
        }
}
export default new CardController()
