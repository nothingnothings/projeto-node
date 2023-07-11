const { buildSchema } = require('graphql'); ////é este package que te deixa DEFNIIR O 'SCHEMA' do seu SERVIÇO graphQL...
/// 'buildSchema' NOS DEIXA __ CONSTRUIR _ UM SCHEMA, SCHEMA QUE SERÁ A COISA QUE O GRAPHQL VAI ENTENDER, VAI CONSEGUIR PARSEAR... --> só as possibilidades que escrevermos dentro desse schema serão CONSIDERADAS pelo graphql, NO PARSE DOS INCOMING REQUEST BODIES/queries nos incoming requests (request bodies)..



///esse setup é parecido com o DO MONGOOSE, eu acho... (mas não passamos um OBJETO ao 'schema creator', E SIM __ UMA STRING... string com TEMPLATE LITERAL....)







module.exports = buildSchema( /// NO CALL DESSA FUNÇAÕ SEMPRE VAMOS PASSAR UMA STRING, STRING QUE SERÁ um TEMPLATE LITERAL (para que consigamos escrever a string em MÚLTIPLAS LINHAS)... 
      //no nome desse 'type' você pode escrever o que quiser, pode ser 'type Exemplo', 'type RootExemplo', qualquer coisa mesmo...
      ///mas é dentro desse '...query' que você vai escrever TODAS AS QUERIES QUE VOCÊ PODERÁ TER NO SEU APP, NO FINAL DAS CONTAS....
      ///'STRING' --> define ___O  TIPO __ DE DATA_ QUE VAMOS PERMITIR QUE SEJA RETORNADA __ POR MEIO DESSE QUERY Aí (no caso, o query da key 'hello')....
      ///é importante destacar que o __ VALOR_ dessa string (E de qualquer outro data type) VAI SER __ DEFINIDO LÁ NOS 'RESOLVERS' (Que são basicamente controllers, no final das contas)...
         ///para tornar um DATA TYPE de algum subquery/key __ ABSOLUTAMENTE 'REQUIRED', você pode adicionar um '!' (bang) DEPOIS __ DO VALOR.... (ex: 'String!')....
      
      

         //queries são o formato 'padrão' de handling de requests, no GRAPHQL...
//       `       
//    type TestQuery { 
//       textTest: String!
//       views: Int!
//    }





//    type RootQuery { 
//          hello: String!
//    }


//    type RootQuery2 {
//       hello2: TestQuery!
//    }


//     schema {
//          query: RootQuery
        
//     }
 
//  `





////ver aula 'Definindo um schema de MUTATION'...




`       

type SinglePostData {
      imageUrl: String!
      title: String!
      _id: ID!
      content: String!
      creator: Creator!
      createdAt: String!
}



type Post {
   _id: ID!
   title: String
   content: String!
   imageUrl: String!
   creator: User!
   createdAt: String!
   updatedAt: String!
}


type PostsData {
      posts: [Post!]!
      totalItems: Int!
      page: Int!
}

type SimplePost {
      postId: ID!
}


type PostData {
      post: Post!
      creator: Creator!
}




type Creator {
      _id: ID!
      name: String!
}

type User {
   _id: ID!
   name: String!
   email: String!
   password: String
   status: String!
   posts: [Post!]!
}


type AuthData {
      userId: String!
      token: String!
}


input UserInputData {
      email: String!
      name: String!
      password: String!
}

input UserPostInputData {
      title: String!
      content: String!
      imageUrl: String!
}

type RootMutation {
      createUser(userInput: UserInputData): User!
      createPost(userInput: UserPostInputData): Post!
      updatePost(userInput: UserPostInputData, postId: ID!): Post!
      deletePost(postId: ID!): ID!
      updateUserStatus(status: String!): String!
}

type PostAuth {
      created: Boolean!
}


type UserStatus {
      status: String!
}



type RootQuery {
      loginUser(email: String!, password: String!): AuthData!
      getPosts(pageNumber: Int!): PostsData!
      getCreationStatus(userId: ID!, postId: ID!): PostAuth
      getPost(postId: ID!): Post!
      getStatus: String!
}



 schema {
             mutation: RootMutation
             query: RootQuery
 }

`




)























// {
//     query {
//         user {
//             name
//             age
//         }
//     }

// }


// --> portanto, aqui temos:


// 1) operação de tipo QUERY (quer fazer GET de dados)....





// 2) endpoint 'USER', que deve ser algo que já settamos anteriormente no backend... (endpoints disponíveis/permitidos)....





// 3) POR FIM, 


// 'NAME' e 'AGE' 



// são OS __ FIELDS_ QUE VAMOS __ QUERER __ EXTRAIR__, 

// LÁ 



// __ DESSE 


// ENDPOINT __ DE 


// 'user'...  

// (

// vamos querer, nesse exemplo,

// SÓ O 'NAME' E A 'AGE',



// DEIXANDO DE LADO COISAS COMO 

// 'address',



// 'email', '_id',


// etc etc.... 





// )
