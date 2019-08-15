import {CardsClass} from './Cards-class';

export class DeckClass{
    _id:String
    deck_name?:String
    deck_cards?:CardsClass[]
    extra_deck_card?: CardsClass[ ]
    favorite?:boolean 
}