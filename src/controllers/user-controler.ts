import { Request, Response } from 'express';
import * as request from 'request-promise-native'
import User from './../models/user-model'
import Card from './../models/card-model'
import jwt from 'jsonwebtoken'
import util from './../util/util'
import variables from './../config/variables'


class UserController{

  public async createUser (req: Request, res: Response): Promise<void> {
    const user = {
      username: req.body.username,
      password: util.encode(req.body.password),
      email: req.body.email
    }

    const sameUsername = await User.findOne({username:req.body.username});
    const sameEmail = await User.findOne({email:req.body.email});  
    

    if (!sameUsername && !sameEmail){
      await User.create(user).then(() =>{
      return res.status(200).json({ success: true, msg: 'Usuário Incluido' })
      }).catch(() =>{
      return res.status(400).json({ success: false, msg: 'Erro ao incluir' })});
    }else{
      await User.findOne({username:req.body.username}).then(() =>{
      return res.status(200).json({ success: true, msg: 'Usuário Já existe' })
      }).catch(() =>{
      return res.status(400).json({ success: false, msg: 'Falha de conexão' })});

    }
  }

  public async login (req: Request, res: Response): Promise<Response> {    
    const acces = await User.findOne({
      username: req.body.username,
      password: util.encode(req.body.password)
    })    

    if (!acces) return res.status(200).json({ success: false, msg: 'Usuário ou senha incorretos' })
    const user = {
      id: acces._id,
      user: acces.username
    }
    const token = jwt.sign({ user }, variables.Security.secretKey, {
      expiresIn: 14400
    })
    console.log(token);
    
    return res.status(200).json({ success: true, _token: token })
  }
  
  public async insertCardIntoColection (req: Request, res: Response): Promise<void> {     
  const  newCard = async () => {
    await User.findOneAndUpdate({username:req.body.username}, {$push:{cards:{card:req.body.card, card_amount:req.body.card_amount}}},
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
     const filteredCard = user.cards.filter((card) => card.card.id === req.body.card.id);     
        if((filteredCard.length > 0 )){
             user.cards.forEach((card) =>{                
                if(card.card.id === req.body.card.id){
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

  public async userCardsList (req: Request, res: Response): Promise<Response>{
    const pageNumber = parseInt(req.query.pageNumber);
    const size = parseInt(req.query.size);


    const pagination = {
      skip:null,
      limit:null,
    };
    const filter : Filter = {
      username:req.params.username,
      card:{

      },
    }
    if (req.query.name) {
      filter.card.name = req.query.name
     }
     if (req.query.race) {
      filter.card.race = req.query.race
     }
     if (req.query.attribute) {
      filter.card.attribute = req.query.attribute
     }
     if (req.query.type) {
      filter.card.type = req.query.type
     }
     if (req.query.archetype) {
      filter.card.archetype = req.query.archetype
     }
     if (req.query.level) {
      filter.card.level = req.query.level
     }
     
    
    if(pageNumber < 0 || pageNumber === 0) {
      let response = {"error" : true,"message" : "invalid page number, should start with 1"};
      return res.json(response);
    }
    
    pagination.skip = size * (pageNumber - 1);
    pagination.limit = size*pageNumber;

    const user = await User.find({ username: filter.username });

    const list = user[0].cards.filter(item => {
      let TMP = true;      
      Object.keys(filter.card).forEach(key => {
        if (item.card[key] !== filter.card[key]) {
          TMP = false;
        }
      })
      return TMP;
    });
    const numberOfCards = list.length;

    const cardList = list.slice(pagination.skip, pagination.limit)
    
    if(numberOfCards  && cardList.length > 0) res.status(200).send({
      success: true,
      msg: 'Pesquisa concluída',
      list:cardList,
      cardNumber:numberOfCards
        });

    if(numberOfCards  && cardList.length === 0) res.status(200).send({
      success: false,
      msg: 'Pesquisa Com erro',
      list:cardList,
      cardNumber:numberOfCards
      });  

    if(!numberOfCards) res.status(200).send({
      success: false,
      msg: 'Card do not exists',
      list:list,
      cardNumber:numberOfCards
        });
  }

  public async singleCard (req: Request, res: Response): Promise<void>{
    const card = await Card.findOne({id:req.params.card_id}); 
    const userCard = await User.findOne({username:req.query.username});
    
    const cardExist = userCard.cards.filter((element)=>{
      if(element.card.id === card.id && element.card_amount >0){
        return true;
      }
    })
    
    let cardExists = false;
    if(cardExist.length > 0){
        cardExists = true;
    }

    if(card) res.status(200).json({ success: true, msg: 'Pesquisa concluída', list:card, userOwnThisCard:cardExists});

  }
  
  public async allCardList (req: Request, res: Response): Promise<Response>{
      const pageNumber = parseInt(req.query.pageNumber);
      const size = parseInt(req.query.size);

      const pagination = {
        skip:null,
        limit:null,
      };
      const filter : Filter = {

      }
      if (req.query.name) {
        filter.name = req.query.name
       }
       if (req.query.race) {
        filter.race = req.query.race
       }
       if (req.query.attribute) {
        filter.attribute = req.query.attribute
       }
       if (req.query.type) {
        filter.type = req.query.type
       }
       if (req.query.archetype) {
        filter.archetype = req.query.archetype
       }
       if (req.query.level) {
        filter.level = req.query.level
       }
       
      
      if(pageNumber < 0 || pageNumber === 0) {
        let response = {"error" : true,"message" : "invalid page number, should start with 1"};
        return res.json(response);
      }
      
      pagination.skip = size * (pageNumber - 1);
      pagination.limit = size;
      
      const numberOfCards = await Card.countDocuments(filter, (error, count) =>{
        if(error){
          console.log('Erro' + error);
        }
        return count
      })
      const cards = await Card.find(filter, '', pagination, (error, results) =>{
        if(error){
          console.log('Erro' + error);
        }        
        return results
      });

    if(numberOfCards) res.status(200).send({
      success: true,
      msg: 'Pesquisa concluída',
      list:cards,
      cardNumber:numberOfCards
        });

    if(!numberOfCards) res.status(200).send({
      success: false,
      msg: 'Card do not exists',
      list:cards,
      cardNumber:numberOfCards
        });

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
    const card = await  Card.findOne({id:req.body.card.card_id});

    const cardObject = {
      card,
      card_amount: req.body.card.card_amount,
    }

    const  newCardIntoMainDeck = async () => {
      console.log('Nova carta no deck:');
      await User.updateOne({username:req.body.username, 'decks.deck_name':req.body.deck_name},{$push:{'decks.$.deck_cards':cardObject}});
    }      
  
    const  cardAmountAtualizationIntoMainDeck = async (cardList) =>{ 
      console.log('Atualizando quantidade no main deck:');
      await User.updateOne({username:req.body.username, 'decks.deck_name':req.body.deck_name}, {$set:{'decks.$.deck_cards':cardList}});
      }

      const  newCardIntoExtraDeck = async () => {
        console.log('Nova carta no deck:');
        await User.updateOne({username:req.body.username, 'decks.deck_name':req.body.deck_name},{$push:{'decks.$.extra_deck_cards':cardObject}});
      }      
    
      const  cardAmountAtualizationIntoExtraDeck = async (cardList) =>{ 
        console.log('Atualizando quantidade no extr deck:');

        await User.updateOne({username:req.body.username, 'decks.deck_name':req.body.deck_name}, {$set:{'decks.$.extra_deck_cards':cardList}});
        }        


    let user = await User.findOne({username:req.body.username} );
    let deckfound = user.decks.filter((deck) => deck.deck_name === req.body.deck_name);

    let totalCards = 0;
    deckfound[0].deck_cards.forEach((card) =>{                
     totalCards = totalCards + card.card_amount;
      })
//talvez terá que somar com a carta incluída nesse exato momento

    let totalExtraCards = 0;
    deckfound[0].extra_deck_cards.forEach((card) =>{                
      totalExtraCards = totalExtraCards + card.card_amount;
       }) 
 
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
        if((totalCards===60) ||
        (totalCards === 59 && req.body.card.card_amount > 1) ||
        (totalCards === 58 && req.body.card.card_amount > 2)){
          await User.findOne({username:req.body.username}).then(()=>{
            return res.status(200).json({ success: true, msg: 'Voce já possui essas cartas', cards: deckfound[0].deck_cards})
          })
        }else{
          const filteredCardInDeck = deckfound[0].deck_cards.filter((card) => {
            console.log(card.card.id);
            
            return card.card.id === req.body.card.card_id
          }); 
              if((filteredCardInDeck.length > 0 )){
                 deckfound[0].deck_cards.forEach((card) =>{                
                      if(card.card.id === req.body.card.card_id){
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
        }
        
       }else{
         if((totalExtraCards===15) ||
        (totalExtraCards === 14 && req.body.card.card_amount > 1) ||
        (totalExtraCards === 13 && req.body.card.card_amount > 2)){
          await User.findOne({username:req.body.username}).then(()=>{
            return res.status(200).json({ success: true, msg: 'VocÊ já possui essas cartas', cards: deckfound[0].extra_deck_cards})
          })
      }else{
      
      const filteredCardInExtraDeck = deckfound[0].extra_deck_cards.filter((card) => {
        return card.card.id === req.body.card.card_id
      }); 

      if((filteredCardInExtraDeck.length > 0 )){
        deckfound[0].extra_deck_cards.forEach((card) =>{                
            if(card.card.id === req.body.card.card_id){
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
        if(cardObject.card_amount > 3){
          cardObject.card_amount = 3;
        }
          newCardIntoExtraDeck()
          .then(() =>{
          return res.status(200).json({ success: true, msg: 'Nova Carta adicionada com sucesso' })
        })
        .catch(() =>{
          return res.status(400).json({ success: true, msg: 'Erro ao adicionar card' });
    })
    } 
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
  }

  public async listAllDeck (req: Request, res: Response): Promise<Response> {
    const pageNumber = parseInt(req.query.pageNumber);
      const size = parseInt(req.query.size);
      const queryType = parseInt(req.query.type);
    
      const pagination = {
        skip:null,
        limit:null,
      }

      const filter ={
        deck_name: req.query.name,
        username:req.query.username
      }       

      if(pageNumber < 0 || pageNumber === 0) {
        let response = {"error" : true,"message" : "invalid page number, should start with 1"};
        return res.json(response);
      }

      pagination.skip = size * (pageNumber - 1);
      pagination.limit = size;
      

      //Se type =1 vai trazer os decks filtrados.
      //Se não, trás todos decks do user


      if(queryType === 1){        
       const user = await User.find({ username: filter.username });
       let newList = [];
       const list = user[0].decks.forEach(item => {
           if(item.deck_name.toLowerCase().includes(filter.deck_name.toLowerCase())){
              newList.push(item);
              return item;
             };
            }); 
            if(newList.length > 0){
            return res.status(200).json({ success: true, msg: 'Decks encontrados', decks:newList, listSize:newList.length  });
          }else{
            return res.status(200).json({ success: false, msg: 'Decks Não encontrados', decks:newList });
          }
      }else{ 
         const user = await User.find({username:filter.username}, 'decks');          
          if(user[0].decks.length > 0){
           return res.status(200).json({ success: true, msg: 'Decks encontrados', decks:user[0].decks, listSize:user[0].decks.length });
         }else{
           return res.status(200).json({ success: true, msg: 'Não há decks'});
         }
      }
  }

  public async findDeck (req: Request, res: Response): Promise<Response> {
      const username = req.query.username;
      const name = req.query.name;

      const user = await User.find({ username: username });
    
      const deck = user[0].decks.filter((deck) =>{
        if (deck.deck_name.toLowerCase() === name.toLowerCase()){
          return true
        }
      })

  
      return res.status(200).json({ success: true, msg: 'Deck encontrado', deck:deck });

  }

}


export default new UserController()

interface Filter {
  attribute ?:string,
  name ?:string,
  race ?:string,
  level ?: string,
  archetype ?: string,
  type ?:string,
  username ?:string,
  card ?: any,
}