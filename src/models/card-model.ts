/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import { Schema, model, Document } from 'mongoose'

export interface CardInterface extends Document {
  id?: string
  name?: string
  desc?: string
  atk?: string
  def?: string
  type?: string
  level?: string
  race?: string
  attribute?: string
  scale?: string
  linkval?: string
  linkmarkers?: Array<any>
  archetype?: string
  card_sets?: Array<any>
  banlist_info?: object
  card_images?: Array<any>
}

const Card = new Schema({
  id: {
    type: String,
    validate: {
      validator: async (id): Promise<boolean> => {
        const search = await model('Card').findOne({ id: id })

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
  linkmarkers: { type: String },
  archetype: { type: String },
  set_tag: { type: String },
  setcode: { type: String },
  banlist_info:{ type: Object},
  card_images: {type: Array},

}, {
  timestamps: false
})
export default model<CardInterface>('Card', Card)
