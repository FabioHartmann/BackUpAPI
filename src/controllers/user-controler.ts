import { Request, Response } from 'express';
import * as request from 'request-promise-native'
import User from './../models/user-model'
import Card from './../models/card-model'



class UserController{
  public async createUser (req: Request, res: Response): Promise<void> {
    User.create(req.body).then(() =>{
    return res.status(200).json({ success: true, msg: 'Usuário Incluido' })
   }).catch(() =>{
    return res.status(400).json({ success: true, msg: 'Erro ao incluir' })
   });
  }

  public async login (req: Request, res: Response): Promise<void> {
     User.findOne({username:req.params.user, password:req.params.pass}).then(() =>{
      return res.status(200).json({ success: true, msg: 'Login efetuado' })
    }).catch(() =>{
      return res.status(400).json({ success: true, msg: 'Erro ao logar' })
    });
  }
  
  public async insertCardIntoColection (req: Request, res: Response): Promise<void> { 
  const  newCard = async () => {
    await User.findOneAndUpdate({username:req.body.username}, {$push:{cards:{card_id:req.body.card_id, card_amount:req.body.card_amount}}},
       {upsert:false} );
    }

  const  cardAmountAtualization = async (cardList) =>{ 
    await User.updateOne({username:req.body.username}, {$set:{cards:cardList}});
    }

  let user = await User.findOne({username:req.body.username});
    
  if(user.cards.length === 0){
       newCard().then(() =>{
        return res.status(200).json({ success: true, msg: 'Primeira Carta adicionada com sucesso' })
      })
      .catch(() =>{
        return res.status(400).json({ success: true, msg: 'Erro ao adicionar card' })
       });   
  }else{
     const filteredCard = user.cards.filter((card) => card.card_id === req.body.card_id);
        if((filteredCard.length > 0 )){
             user.cards.forEach((card) =>{                
                if(card.card_id === req.body.card_id){
                   const cardAmount = card.card_amount + req.body.card_amount;
                   card.card_amount=cardAmount;                  
                }
              })
              cardAmountAtualization(user.cards)               
               .then(() =>{
                return res.status(200).json({ success: true, msg:'Quantidade atualizada', object:filteredCard[0] })
              })
              .catch(() =>{
                return res.status(400).json({ success: true, msg: 'Erro ao atualizar número de cartas' })
               });
        }else{
          if(filteredCard.length === 0){
            newCard()
            .then(() =>{
              return res.status(200).json({ success: true, msg: 'Carta adicionada com sucesso' })
            })
            .catch(() =>{
              return res.status(400).json({ success: true, msg: 'Erro ao adicionar card' })
             });
        }

      }};
  
  }

  public async userCardsList (req: Request, res: Response): Promise<void>{
    const user = await User.findOne({username:req.params.username});    
    if(user) res.status(200).json({ success: true, msg: 'Pesquisa concluída', list:user.cards });
  }

  public async singleCard (req: Request, res: Response): Promise<void>{
    const card = await Card.findOne({id:req.params.card_id});    
    if(card) res.status(200).json({ success: true, msg: 'Pesquisa concluída', list:card });
  }
  
  public async allCardList (req: Request, res: Response): Promise<void>{
    const cards = await Card.find();    
    if(cards) res.status(200).json({ success: true, msg: 'Pesquisa concluída', list:cards});
  }

  public async removeCardIntoColection (req: Request, res: Response): Promise<void> { 
    let user = await User.findOne({username:req.body.username});
    const  cardAmountAtualization = async (cardList) =>{ 
      await User.updateOne({username:req.body.username}, {$set:{cards:cardList}});
    }
    const filteredCard = user.cards.filter((card) => card.card_id === req.body.card_id);
    user.cards.forEach((card) =>{                
      if(card.card_id === req.body.card_id){
         const cardAmount = card.card_amount - req.body.card_amount;
         card.card_amount=cardAmount;                  
      }
    })
    cardAmountAtualization(user.cards)               
     .then(() =>{
      return res.status(200).json({ success: true, msg:'Quantidade atualizada', object:filteredCard[0] })
    })
    .catch(() =>{
      return res.status(400).json({ success: true, msg: 'Erro ao atualizar número de cartas' })
     });
  }

  public async createDeck (req: Request, res: Response): Promise<void> { 
  User.findOneAndUpdate({username:req.body.username}, {$push:{decks:{deck_name:req.body.deck_name, deck_cards:[], extra_deck_cards:[], favorite:false}}}, {upsert:true})
  .then(() =>{
    return res.status(200).json({ success: true, msg: 'Deck Incluido' })
  }).catch(() =>{
    return res.status(400).json({ success: true, msg: 'Erro ao incluir' })
    });
  }

  public async deleteDeck (req: Request, res: Response): Promise<void> { 
    const  removeDeck = async (deckList) =>{ 
      await User.updateOne({username:req.body.username}, {$set:{decks:deckList}});
    }
    
    let user = await User.findOne({username:req.body.username} );
  

  for(let i in user.decks){
    console.log(i);
    if(req.body.deck_name === user.decks[i].deck_name){
        user.decks.splice(i,1);
    }   
 }

   removeDeck(user.decks)
    .then(() =>{
      return res.status(200).json({ success: true, msg: 'Deck Excluido'})
     }).catch(() =>{
      return res.status(400).json({ success: false, msg: 'Erro ao excluir'})
     });
  }

  public async insertCardIntoDeck (req: Request, res: Response): Promise<void> { 
    const  newCardIntoMainDeck = async () => {
      await User.updateOne({username:req.body.username, 'decks.deck_name':req.body.deck_name},{$push:{'decks.$.deck_cards':req.body.card}});
    }      
  
    const  cardAmountAtualizationIntoMainDeck = async (cardList) =>{ 
      await User.updateOne({username:req.body.username, 'decks.deck_name':req.body.deck_name}, {$set:{'decks.$.deck_cards':cardList}});
      }

      const  newCardIntoExtraDeck = async () => {
        await User.updateOne({username:req.body.username, 'decks.deck_name':req.body.deck_name},{$push:{'decks.$.extra_deck_cards':req.body.card}});
      }      
    
      const  cardAmountAtualizationIntoExtraDeck = async (cardList) =>{ 
        await User.updateOne({username:req.body.username, 'decks.deck_name':req.body.deck_name}, {$set:{'decks.$.extra_deck_cards':cardList}});
        }

    let user = await User.findOne({username:req.body.username} );
    let deckfound = user.decks.filter((deck) => deck.deck_name === req.body.deck_name);
    
  
    if(req.body.card.type === "Effect Monster"  ||
      req.body.card.type === "Flip Effect Monster"  ||
      req.body.card.type ===  "Flip Tuner Effect Monster" ||
      req.body.card.type === "Gemini Monster" ||
      req.body.card.type === "Normal Monster" ||
      req.body.card.type === "Normal Tuner Monster" ||
      req.body.card.type === "Pendulum Effect Monster" ||
      req.body.card.type ===  "Pendulum Flip Effect Monster" ||
      req.body.card.type ===  "Pendulum Normal Monster" ||
      req.body.card.type ===  "Pendulum Tuner Effect Monster" ||
      req.body.card.type === "Ritual Effect Monster" ||
      req.body.card.type ===  "Ritual Monster" ||
      req.body.card.type ===  "Skill Card" ||
      req.body.card.type ===   "Spell Card" ||
      req.body.card.type ===  "Spirit Monster" ||
      req.body.card.type ===  "Toon Monster" ||
      req.body.card.type === "Trap Card"  ||
      req.body.card.type ===  "Tuner Monster" ||
      req.body.card.type ===  "Union Effect Monster" ||
      req.body.card.type ===   "Union Tuner Effect Monster"
       ){
        const filteredCardInDeck = deckfound[0].deck_cards.filter((card) => {
          return card.card_id === req.body.card.card_id
        }); 
             
            if((filteredCardInDeck.length > 0 )){
               deckfound[0].deck_cards.forEach((card) =>{                
                    if(card.card_id === req.body.card.card_id){
                       const cardAmount = card.card_amount + req.body.card.card_amount;
                       if(cardAmount > 3){
                        card.card_amount = 3;
                       }else{
                        card.card_amount=cardAmount;
                       }
                    }
                  })                
                  cardAmountAtualizationIntoMainDeck(deckfound[0].deck_cards)               
                   .then(() =>{
                    return res.status(200).json({ success: true, msg:'Quantidade atualizada', object:deckfound[0].deck_cards})
                  })
                  .catch(() =>{
                    return res.status(400).json({ success: true, msg: 'Erro ao atualizar número de cartas' })
                   });
              }else{
                 newCardIntoMainDeck()
                 .then(() =>{
                  return res.status(200).json({ success: true, msg: 'Nova Carta adicionada com sucesso' })
                })
                .catch(() =>{
                  return res.status(400).json({ success: true, msg: 'Erro ao adicionar card' });
            })
    
           }
       }else{
        const filteredCardInExtraDeck = deckfound[0].extra_deck_cards.filter((card) => {
          return card.card_id === req.body.card.card_id
        }); 

        if((filteredCardInExtraDeck.length > 0 )){
          deckfound[0].extra_deck_cards.forEach((card) =>{                
               if(card.card_id === req.body.card.card_id){
                  const cardAmount = card.card_amount + req.body.card.card_amount;
                  if(cardAmount > 3){
                   card.card_amount = 3;
                  }else{
                   card.card_amount=cardAmount;
                  }
               }
             })                
             cardAmountAtualizationIntoExtraDeck(deckfound[0].extra_deck_cards)               
              .then(() =>{
               return res.status(200).json({ success: true, msg:'Quantidade atualizada', object:deckfound[0].extra_deck_cards})
             })
             .catch(() =>{
               return res.status(400).json({ success: true, msg: 'Erro ao atualizar número de cartas' })
              });
         }else{
            newCardIntoExtraDeck()
            .then(() =>{
             return res.status(200).json({ success: true, msg: 'Nova Carta adicionada com sucesso' })
           })
           .catch(() =>{
             return res.status(400).json({ success: true, msg: 'Erro ao adicionar card' });
       })
       } 
  };
}
    
  public async removeCardIntoDeck (req: Request, res: Response): Promise<void> {
    const  removeCard = async (cardList) =>{ 
      await User.updateOne({username:req.body.username, 'decks.deck_name':req.body.deck_name}, {$set:{'decks.$.deck_cards':cardList}});
    }

    let user = await User.findOne({username:req.body.username} );
    let deckfound = user.decks.filter((deck) => deck.deck_name === req.body.deck_name);
    
           for(let i in deckfound[0].deck_cards){
              if(req.body.card_id === deckfound[0].deck_cards[i].card_id){
                 deckfound[0].deck_cards.splice(i,1);
              }
           }                      
          removeCard(deckfound[0].deck_cards)               
          .then(() =>{
              return res.status(200).json({ success: true, msg:'Carta Removida.', object:deckfound[0].deck_cards})
            })
          .catch(() =>{
              return res.status(400).json({ success: true, msg: 'Erro ao remover a carta.' })
            });
  };
  }


export default new UserController()
