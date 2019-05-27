import mongoose from 'mongoose'
import md5 from 'md5'

import { IdOptions } from './../class/class'

class Util {
  public emailValidation (email: string): boolean {
    let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (regex.test(email)) {
      return true
    } else {
      return false
    }
  }

  public cpfValidation (cpf: string): boolean {
    var Soma
    var Resto
    Soma = 0
    if (cpf === '00000000000') return false

    for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i)
    Resto = (Soma * 10) % 11

    if ((Resto === 10) || (Resto === 11)) Resto = 0
    if (Resto !== parseInt(cpf.substring(9, 10))) return false

    Soma = 0
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i)
    Resto = (Soma * 10) % 11

    if ((Resto === 10) || (Resto === 11)) Resto = 0
    if (Resto !== parseInt(cpf.substring(10, 11))) return false
    return true
  }

  public dateValidation (date): boolean {
    let ExpReg = new RegExp('(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}')
    let splitDate = date.split('/')
    let erro = false

    if (date.search(ExpReg) === -1) {
      erro = true
    } else if (((splitDate[1] === 4) || (splitDate[1] === 6) || (splitDate[1] === 9) || (splitDate[1] === 11)) && (splitDate[0] > 30)) {
      erro = true
    } else if (splitDate[1] === 2) {
      if ((splitDate[0] > 28) && ((splitDate[2] % 4) !== 0)) {
        erro = true
      }
      if ((splitDate[0] > 29) && ((splitDate[2] % 4) === 0)) {
        erro = true
      }
    }

    if (erro) {
      return false
    }

    return true
  }

  public celValidation (celular: string): boolean {
    let regex = /^\(\d{2}\)[\s\S](9|)[6789]\d{3}-\d{4}$/
    return regex.test(celular)
  }

  public dateConvert (date): string {
    let splitDate = date.split('/')
    return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`
  }

  public async idValidation (id, model: string): Promise<IdOptions> {
    if (!mongoose.Types.ObjectId.isValid(id)) return { result: false, m: 'idInvalid(model)' }

    const validation = await mongoose.model(model).findOne({ _id: id })

    if (validation) return { result: true, m: '' }
    else return { result: false, m: `Id do ${model} inexistente` }
  }

  public encode (password: string): string {
    let teste = md5(password)
    return teste
  }
}

export default new Util()
