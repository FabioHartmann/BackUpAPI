import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import variables from './../config/variables'

const token = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  let token =req.headers.authorization || req.body.token;
  console.log(token);
  
  if (!!token) {
    let tokenHash = token.split(' ');    
    try {
      console.log('passou no try');
      let decoded = await jwt.verify(tokenHash[1], variables.Security.secretKey).user      
      res.locals.user = decoded
      next()
    } catch (error) {
      console.log('passou no cartc');
      return res.status(401).send({ msg: 'tokenInvalid()' })
    }
  } else {
    console.log('passou no else');
    return res.status(401).send({ msg: 'tokenNull()' })
  }
}

export default token
