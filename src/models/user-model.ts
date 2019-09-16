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
    cards:{ type: [
      {card: {
         id: { type: String },
         race: { type: String },
         linkmarkers:{ type:Array},
         name: { type: String },
         type: { type: String },
         desc: { type: String },
         atk: { type: String },
         def: { type: String },
         level: { type: String },
         attribute: { type: String },
         scale: { type: String },
         linkval: { type: String },
         archetype: { type: String },
         // eslint-disable-next-line camelcase
         card_sets: { type:Array},
         // eslint-disable-next-line camelcase
         banlist_info: { type:Object},
         // eslint-disable-next-line camelcase
         card_images: { type:Array},
       },
       card_amount:{type:Number},
        }
    ] },
    decks:{ type: Array },
}, {
  timestamps: false
})
export default model<UserInterface>('User', User)