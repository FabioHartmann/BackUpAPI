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
  // await User.findOneAndRemove({username:req.body.username, decks:[{deck_name:req.body.deck_name}] })
  const c =  await User.findOne({username:req.body.username}).findOneAndRemove({deck_name:req.body.deck_name})
  console.log(c);
    
    // .then(() =>{
    //   return res.status(200).json({ success: true, msg: 'Deck Excluido'})
    //  }).catch(() =>{
    //   return res.status(400).json({ success: false, msg: 'Erro ao excluir'})
    //  });
  }

  public async insertCardIntoDeck (req: Request, res: Response): Promise<void> { 
    const  newCard = async () => {
      await User.findOneAndUpdate({username:req.body.username, decks:{deck_name:req.body.deck_name}},{$set:{decks:{deck_cards:{card_id:req.body.card_id, card_amount:req.body.card_amount}}}},
);

      }
      console.log(newCard);
      
  
    const  cardAmountAtualization = async (cardList) =>{ 
      await User.updateOne({username:req.body.username}, {$set:{decks:cardList}});
      }

    let user = await User.findOne({username:req.body.username} );
    let deck = user.decks.filter((deck) => deck.deck_name === req.body.deck_name);

    if(deck[0].deck_cards.length === 0){ 
      console.log('If de Primeira carta') 
      // console.log(deck );
      console.log(deck)
         newCard()
        //  ARRUMAR A QUERY DO NEWCARD
         .then(() =>{
          return res.status(200).json({ success: true, msg: 'Primeira Carta adicionada com sucesso' })
        })
        .catch(() =>{
          return res.status(400).json({ success: true, msg: 'Erro ao adicionar card' })
         });   
    } else{
      console.log('Else')    
      const filteredCardInDeck = deck[0].deck_cards.filter((card) => card.card_id === req.body.card_id)    
          if((filteredCardInDeck.length > 0 )){
            console.log('Entrei no IF de somar');            
            deck[0].deck_cards.forEach((card) =>{                
                  if(card.card_id === req.body.card_id){
                     const cardAmount = card.card_amount + req.body.card_amount;
                     card.card_amount=cardAmount;                  
                  }
                })
                // cardAmountAtualization(deck[0].deck_cards)               
                //  .then(() =>{
                //   return res.status(200).json({ success: true, msg:'Quantidade atualizada', object:filteredCard[0] })
                // })
                // .catch(() =>{
                //   return res.status(400).json({ success: true, msg: 'Erro ao atualizar número de cartas' })
                //  });
            }else{
             if(filteredCardInDeck.length === 0){
               console.log('Entrei no ELSE de nova Carta');               
    //           newCard()
    //           .then(() =>{
    //             return res.status(200).json({ success: true, msg: 'Carta adicionada com sucesso' })
    //           })
    //           .catch(() =>{
    //             return res.status(400).json({ success: true, msg: 'Erro ao adicionar card' })
    //            });
          }
  
         }
  };
    
  }
}


export default new UserController()