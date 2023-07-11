const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// const orderSchema = new Schema({ ////order schema que EU TENTEI FAZER SOZINHO.... funcionou, mas de forma imperfeita....


// userId: {
//         type: Schema.Types.ObjectId,
//         required: true

// },


//   cart: {
//     // required: true,
//     // type: Schema.Types.ObjectId,
//     // type: Object,

//     products: [
//             {productId: {

//                 required: true, 
//                 type: Schema.Types.ObjectId,
//                 ref: 'Product'
//             },
//           quantity: {
//             required: true,
//             type: Number,
//           }
          
//           }
//     ]
//   },

//   totalPrice: {
//       required: true,
//       type: Number
//   }



// });








const orderSchema = new Schema(  //orderSchema formulado pelo professor... ficou um pouco melhor do que o nosso...
  {


       products: [
         {
           product: {type: Object, required: true, ref: 'Product'},
           quantity: {
             type: Number,
             required: true
           }
         }
       ],


       totalPrice: {
         type: Number, 
         required: true
       },


       user: {

            //  name: {
            //    type: String,
            //    required: true
            //  }, 


             userId: {
               type: Schema.Types.ObjectId,
               required: true,
               ref: 'User' //////eis o código em questão.
             }

       }

  }
)























// orderSchema.methods.addOrder = function(user) {


//         console.log('TEST');
//         this.user = user;

//         return this.save()
//         .then(
//             (result) => {
//                 console.log(result);
//             }
//         )
//         .catch(
//             (err) => {
//                 console.log(err);
//             }
//         )
// }










module.exports = mongoose.model('Order', orderSchema);
