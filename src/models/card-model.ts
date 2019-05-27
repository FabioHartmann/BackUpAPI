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
  linkmarkers?: string
  archetype?: string
  set_tag?: string
  setcode?: string
  ban_tcg?: string
  ban_ocg?: string
  ban_goat?: string
  image_url?: string
  image_url_small?: string
}

const Card = new Schema({
  id: { type: String },
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
  ban_tcg: { type: String },
  ban_ocg: { type: String },
  ban_goat: { type: String },
  image_url: { type: String },
  image_url_small: { type: String }
}, {
  timestamps: false
})
export default model<CardInterface>('Card', Card)
