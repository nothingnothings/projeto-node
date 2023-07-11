

const mongoose = require('mongoose');


const Schema = mongoose.Schema;



const postSchema = new Schema(
    {
        title: {
            required: true,
            type: String
        },
        content: {
            required: true,
            type: String
        },
        imageUrl: {
            required: true,
            type: String
        },
        creator: {
            // required: true,
            // type: Object,
            userId: {
                required: true, 
                type: Schema.Types.ObjectId,
                ref: 'User' ////vai pegar o 'userId' do user que cria um product, eu acho....
              }
        },

    
    },

    {timestamps: true}  ///SEGUNDO PARÂMETRO DO call de 'new Schema()' --> SE DEIXAMOS a key de 'timestamps' como true, FAZEMOS COM QUE  UM TIMESTAMP SEJA ADICIONADO A CADA OBJECT/DOCUMENT 'post', SEMPRE __ QUE UM NOVO _ DOCUMENT FOR ADICIONADO NA NOSSA DATABASE... (isso será usado na propriedade de 'createdAt', de cada POST...)
                        //automaticamente recebemos propriedades 'createdAt' e 'updatedAt' a partir de 'timestamps: true'...
)









module.exports = mongoose.model('Post', postSchema);