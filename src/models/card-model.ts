/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import { Schema, model, Document } from 'mongoose'
import { ObjectID } from 'bson';

export interface CardInterface extends Document {
  id?: string
  name?: string
  type?: string
  desc?: string
  atk?: string
  def?: string
  level?: string
  race?: string
  attribute?: string
  scale?: string
  linkval?: string
  linkmarkers?: string[]
  archetype?: string
  // eslint-disable-next-line camelcase
  card_sets?: cardSet[]
  // eslint-disable-next-line camelcase
  banlist_info?: banlistInfo
  // eslint-disable-next-line camelcase
  card_images?: cardImage[]
}
export class cardSet{
  public set_name?: string
  public set_code?: string
  public set_rarity?: string
  public set_price?: string
}

export class cardImage{
  public id: string
  public image_url:string 
  public image_url_small:string 
}

export class banlistInfo{
  ban_tcg: string
  ban_ocg: string
}

export class cardPrices{
  cardmarket_price: string
  tcgplayer_price: string
  ebay_price: string
  amazon_price: string
}

const Card = new Schema({
  id: {
    type: String,
    validate: {
      validator: async (id): Promise<boolean> => {
        const search = await model('Card').findOne({ id: id });
          console.log(search);
          
        if (search) return false
      },
      msg: 'Carta já adicionada'
    } },
  name: { type: String },
  desc: { type: String },
  atk: { type: String },
  def: { type: String },
  type: { type: String },
  level: { type: String },
  race: { type: String },
  attribute: { type: String },
  scale: { type: String },
  linkval: { type: String },
  linkmarkers: { type: Array },
  archetype: { type: String },
  card_sets: {type: Array},
  banlist_info:{ type: Object},
  card_images: {type: Array},

}, {
  timestamps: false
})
export default model<CardInterface>('Card', Card)
