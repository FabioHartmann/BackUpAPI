import { Schema, model, Document } from 'mongoose'
import {CardsClass} from '../class/Cards-class'
import {DeckClass} from '../class/Deck-class'

export interface UserInterface extends Document {
    username?:String
    email?:String
    password?:String
    cards?: CardsClass[]
    decks?: DeckClass[]
}

const User = new Schema({
 
    username:{ type: String,
        validate: {
        validator: async (username): Promise<boolean> => {
          const search = await model('User').findOne({ username: username })
  
          if (search) return false
        },
        msg: 'Carta já adicionada'
      }
     },
    email:{ type: String },
    password:{ type: String },
    cards:{ type: Array },
    decks:{ type: Array },
}, {
  timestamps: false
})
export default model<UserInterface>('User', User)