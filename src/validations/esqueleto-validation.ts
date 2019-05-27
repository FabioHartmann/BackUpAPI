import { Request, Response, NextFunction } from 'express'

class EsqueletoValidation {
  public async vender (req: Request, res: Response, next: NextFunction): Promise<void> {
    next()
  }
}

export default new EsqueletoValidation()
