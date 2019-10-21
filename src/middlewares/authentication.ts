import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import variables from './../config/variables'

const token = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  let token =req.headers.authorization || req.body.token;
  
  if (!!token) {
    let tokenHash = token.split(' ');    
    try {
      let decoded = await jwt.verify(tokenHash[1], variables.Security.secretKey).user      
      res.locals.user = decoded
      next()
    } catch (error) {
      return res.status(401).send({ msg: 'tokenInvalid()' })
    }
  } else {
    return res.status(401).send({ msg: 'tokenNull()' })
  }
}

export default token
