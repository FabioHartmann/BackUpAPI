export class CardClass {
    public id?: string
    public name?: string
    public type?: string
    public desc?: string
    public atk?: string
    public def?: string
    public level?: string
    public race?: string
    public attribute?: string
    public scale?: string
    public linkval?: string
    public linkmarkers?: string[]
    public archetype?: string
    // eslint-disable-next-line camelcase
    public card_sets?: cardSet[]
    // eslint-disable-next-line camelcase
    public banlist_info?: banlistInfo
    // eslint-disable-next-line camelcase
    public card_images?: cardImage[]
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