
const jwt = require('jsonwebtoken');
const Sauce = require('../models/Sauce');



exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
       
        usersLiked: [],
        usersDisliked: [],
        likes: 0,
        dislikes: 0,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    console.log(sauceObject);
    sauce.save()
      .then(() => {
        res.status(201).json({message : 'Sauce enregistrée !'})
      })
      .catch((error) => {
        res.status(400).json( { error })
      });
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
       .then(sauces => res.status(200).json(sauces))
       .catch(error => res.status(400).json({ error }));

};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
       .then(sauce => res.status(200).json(sauce))
       .catch(error => res.status(400).json({ error }));

};

exports.modifySauce = (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  console.log(req.params);
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename} `
    } : {
        ...req.body
    };
    delete sauceObject._userId;
    sauce.findOne({_id: req.params.id})
      .then((sauce) => {
        if(sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Non autorisé'});
        } else {
            Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
             .then(() => res.status(200).json({message : 'Sauce modifiée !'}))
             .catch((error) => {
                res.status(400).json({error})
             })
        }
      })
      .catch((error) => { res.status(400).json({error})});
};

exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({message : 'Sauce supprimée !'}))
      .catch(error => res.status(400).json({ error }));

};

// exports.likeSauce = (req, res, next) => {
//   let likeNb = 0;
//   Sauce.findOne({_id: req.params.id})
//     .then((sauce) => {
//       if(req.auth.userId === null || undefined || "") {
//         res.status(401).json({ message : 'Non autorisé'});
//       } else {
//           if(sauce.usersLiked.indexOf(req.auth.userId) == -1 && sauce.usersDisliked.indexOf(req.auth.userId) == -1 ){
//             if(req.body.like == 1){
          
//               sauce.usersLiked.push(req.auth.userId);
//               sauce.likes += 1;
//               console.log(req.body);
//               console.log("test1");

//             } else if(req.body.like == -1){
         
//               sauce.usersDisliked.push(req.body.userId);
//               sauce.dislikes += 1;
//               console.log(req.body);
//               console.log("test2");
//             }
//           } else if(sauce.usersLiked.indexOf(req.auth.userId != -1 && req.body.likes == 0)){
//               console.log('test6');
//               const index = sauce.usersLiked.findIndex((id) => {
//                 id == req.auth.userId;
//               });
//               console.log(index);
//               console.log(req.auth.userId)
//               console.log(sauce.usersLiked);
//               sauce.usersLiked.splice(index, 1);
//               sauce.likes -= 1;
     
//           } else if(sauce.usersDisliked.indexOf(req.auth.userId != -1 && req.body.like == 0)){
//               const index = sauce.usersDisliked.findIndex(id => {
//               id == req.auth.userId
//               })
//               sauce.usersDisliked.splice(index, 1);
//               sauce.dislikes -= 1;

//           }

//           Sauce.save()
//               .then((res) => res.status(201).json({message: 'Like enregistré !'}))
//               .catch(error => console.log("first"))
//     }
//   })
//   .catch((error) => { console.log(req.params)});
// };

  // exports.likeSauce = (req, res, next) =>{
  //   Sauce.findOne({_id: req.params.id})
  //     .then((Sauce) => {
  //       console.log(req.auth.userId);
  //           if(req.body.like = 1){
  //             console.log("test");
  //             Sauce.findOneAndUpdate({_id: req.params.id},{
  //               $addToSet : {usersLiked : req.auth.userId},
  //               $inc : {likes: req.body.like } 
  //             })
  //             .then(() => {
  //               console.log(Sauce.usersLiked);
  //               console.log(Sauce.likes);
  //               res.status(200).json({message : 'Sauce likés 1!'})
  //             })
  //             .catch((error) => {
  //               res.status(400).json({error})
  //             });
  //           } else if (req.body.like = 0 && Sauce.usersLiked == req.auth.userId){
  //             Sauce.updateOne({_id: req.params.id}, {
  //               $pull : { usersLiked: req.auth.userId},
  //               $set : { likes : { $size: usersLiked }}
  //             })
  //             .then(() => res.status(200).json({message : 'Sauce dislikés !'}))
  //             .catch((error) => {
  //               res.status(400).json({error})
  //             });
  //           }  else if (req.body.like = 0 && Sauce.usersDisliked == req.auth.userId) {
  //           Sauce.updateOne({_id: req.params.id}, {$pull: {usersDisliked: req.auth.userId}})
  //             .then(() => res.status(200).json({message : 'Sauce dislikés !'}))
  //             .catch((error) => {
  //            res.status(400).json({error})
  //           })
  //         } else if(req.body.like = -1){
              
  //             Sauce.updateOne({_id: req.params.id}, {$set: {usersDisliked : req.auth.userId}})
  //             .then(() => res.status(200).json({message : 'Sauce likés 2!'}))
  //             .catch((error) => {
  //               res.status(400).json({error})
  //             });
  //           }
  //     })
  //     .catch((error) => { res.status(400).json({error})});
  // }
  
exports.likeSauce = (req, res, next) => {
  let sauce;
  Sauce.findOne({_id: req.params.id})
    .then((res) => sauce = res)
    .catch((error) => res.status(400).json({ error }))

  if ( req.body.like == 1){
    Sauce.findOneAndUpdate({_id: req.params.id},{
      $addToSet: {usersLiked: req.body.id},
      $inc: {likes: req.body.like}
      })
      .then(() => {
        res.status(200).json({message : "Like enregistré !"})
      })
  } else if( req.body.like == 0){

  } else if( req.body.like == -1){

  }
  
}
