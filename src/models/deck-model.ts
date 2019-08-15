import { Schema, model, Document } from 'mongoose'
import {CardsClass} from '../class/Cards-class'
import { ObjectID } from 'bson';

export interface DeckInterface extends Document {
    _id:String,
    deck_name?:String
    deck_cards?:CardsClass[]
    extra_deck_card?: CardsClass[ ]
    favorite?:boolean 
}


const Deck = new Schema({
  _id: {type: ObjectID, required: true},
  deck_name:{ type: String },
  deck_cards:{ type: Array },
  extra_deck_card:{ type: Array },
  favorite:{ type: Boolean }
}, {
  timestamps: false
})
export default model<DeckInterface>('Deck', Deck)