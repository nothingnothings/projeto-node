import React, { Component, Fragment } from 'react';

import openSocket from 'socket.io-client'; /////NECESSÁRIO PARA SETTAR UMA CONEXÃO 'websockets' entre O BACKEND E NOSSO FRONTEND...

import Post from '../../components/Feed/Post/Post';

import Button from '../../components/Button/Button';

import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';

import Input from '../../components/Form/Input/Input';

import Paginator from '../../components/Paginator/Paginator';

import Loader from '../../components/Loader/Loader';

import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';

import './Feed.css';

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: '',
    postPage: 1,
    postsLoading: true,
    editLoading: false,
  };

  componentDidMount() {
    // fetch('URL')
    fetch('http://localhost:8080/auth/status', {
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch user status.');
        }

        return res.json();
      })
      .then((data) => {
        console.log(data);
        this.setState({ status: data.status });
      })
      .catch(this.catchError);
    this.loadPosts(); //EXECUTADO __ APÓS O FETCH, ACHO...
  const openSocketToOurBackend = openSocket('http://localhost:8080',  //COLOQUE O PATH/ENDEREÇO DE SEU__ SERVIDOR/BACKEND, APP NODEEXPRESS, no nosso caso....
  {transports: ['websocket', 'polling', 'flashsocket']});  ///esse segundo parâmetro serve para CONSERTAR O PROBLEMA DE 'CORS' do nosso app, em relação ao recebimento de requests WEBSOCKET sentido server -> frontend....
 

  openSocketToOurBackend.on('posts',
  
      

  (data) => {/// data é a data QUE ACTUALLY RECEBEMOS DO 'REQUEST DISPARADO POR NOSSO BACKEND', request de tipo 'WEBSOCKET'...

    if (data.action === 'create') { ////vamos querer aceitar data EMITIDA _ APENAS__ DO REQUEST _ DISPARADO POR NOSSO BACKEND QUE TENHA ESSE VALOR de string 'create' DENTRO DE SUA KEY 'action'.... ( ou seja, só aquele código do 'SOCKETIO' que escrevemos la no controller de 'createPost'...)
      console.log('ENTEREDPOST');
      const post = {
        ...data.post
      }
      console.log(post, 'YOURPOST');
      console.log(data.postCreator);
      // post.creator.name = data.postCreator;
      // console.log(post, 'YOURPOST');
      this.addPost(post, data.postCreator);

    }



    if (data.action === 'edit') { ////vamos querer aceitar data EMITIDA _ APENAS__ DO REQUEST _ DISPARADO POR NOSSO BACKEND QUE TENHA ESSE VALOR de string 'create' DENTRO DE SUA KEY 'action'.... ( ou seja, só aquele código do 'SOCKETIO' que escrevemos la no controller de 'createPost'...)
      console.log('ENTEREDPOSTEDIT');
      const post = {
        ...data.post
      }
      console.log(post, 'YOUREDITEDPOST');
      // post.creator.name = data.postCreator;
      // console.log(post, 'YOURPOST');
      this.updatePost(post, data.postCreator);

    }


    if (data.action === 'delete') { ////vamos querer aceitar data EMITIDA _ APENAS__ DO REQUEST _ DISPARADO POR NOSSO BACKEND QUE TENHA ESSE VALOR de string 'create' DENTRO DE SUA KEY 'action'.... ( ou seja, só aquele código do 'SOCKETIO' que escrevemos la no controller de 'createPost'...)
      console.log('ENTEREDPOSTDELETE');
      console.log(data.postId, 'YOURDELETEDPOST');
      // post.creator.name = data.postCreator;
      // console.log(post, 'YOURPOST');
      // this.deletePost(data.postId, data.postCreator); //desistimos deste approach... 
      this.loadPosts() //optamos por esse approach, que vai RECARREGAR (reload) nossa page, e a de todos os outros users.... (approach mais simples, na verdade)...

    }











  }


  );







  ///essa constante que segura o call de 'openSocket' nos fornece VÁRIOS MÉTODOS 'listener', que são EVENT LISTENERS; usaremo-nos para __ FAZER LISTEN TO _ A EVENTS __ DISPARADOS __ por nosso backend... (como o evento 'posts' que escrevemos lá no backend, no controller de 'feed.js', controller de 'createPost'...)


}

  // loadPosts = (direction) => {

  //     // const token = localStorage.getItem('token');  // já vamos obter isso por meio dos PROPS repassados pelo 'App.js'..

  //   if (direction) {
  //     this.setState({ postsLoading: true, posts: [] });
  //   }

  //   let page = this.state.postPage;
  //   console.log(page);

  //   if (direction === 'next') {
  //     page++;
  //     this.setState({ postPage: page });
  //   }

  //   if (direction === 'previous') {
  //     page--;
  //     console.log(this.state.postPage);
  //     this.setState({ postPage: page });
  //     console.log(this.state.postPage);
  //   }

  //   console.log(this.state.postPage, 'NEEDPOSTPAGE');
  //   // fetch('URL')
  //   fetch(`http://localhost:8080/feed/posts?page=${page}`,  //forma correta. (OBS: NÃO É BOM ENCODAR SUA 'TOKEN'/JWT TOKEN de authorization NAS SUAS URL... EM VEZ DISSO, OPTE POR __ ANEXAR/APPENDAR ESSA TOKEN __ LÁ _ NOS HEADERS__ DOS REQUESTS QUE VOCÊ ENVIA, COMO VISTO LOGO ABAIXo...)
  //     {
  //         headers: { //vamos ter que adicionar esse HEADER ESPECÍFICO DE 'Authorization'/token __ _em TODOS OS REQUESTS __ FEITOS NO NOSSO FRONTEND... (menos os de 'login' e 'signup')...
  //           'Authorization': `Bearer ${this.props.token}`, //obs: esse 'Authorization' foi DEFINIDO COMO 'PERMITIDO' lá ___ no 'app.js' DO NOSSO BACKEND, naquele middleware do CORS...
  //           // 'Content-Type': 'application/json' ///PROFESSOR EXPLICA QUE AQUI, NESSE CASE DESSE 'GET REQUEST', não precisamos __ SETTAR 'content-type' como sendo json __ JUSTAMENTE_ PQ NÃO ESTAMOS ENVIANDO NENHUMA DATA CONCRETA, E SIM APENAS UM 'AUTHORIZATION HEADER' no nosso request... (pq REQUESTS DE TIPO GET REALMENTE __ NÃO PODEM/CONSEGUEM ENVIAR BODIES CONSIGO... só headers)...
  //         }
  //     }
  //   ) ///esse request vai ser enviado PRIMEIRAMENTE ao middleware do arquivo 'is-auth', na pasta 'middlewareHelpers'...

  //   // fetch('/feed/posts') //FORMA ERRADA.
  //     .then((res) => {
  //       if (res.status !== 200) {
  //         throw new Error('Failed to fetch posts.');
  //       }
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log('ENTERED25125');
  //       this.setState({
  //         // posts: data.posts,

  //         posts: data.posts.map((post) => {
  //           return {
  //             ...post,
  //             imagePath: post.imageUrl,
  //           };
  //         }),
  //         totalPosts: data.totalItems,
  //         postsLoading: false,
  //       });
  //     })
  //     .catch(this.catchError);
  // };

  loadPosts = async (direction) => {
    // const token = localStorage.getItem('token');  // já vamos obter isso por meio dos PROPS repassados pelo 'App.js'..

    try {
      if (direction) {
        this.setState({ postsLoading: true, posts: [] });
      }

      let page = this.state.postPage;
      console.log(page);

      if (direction === 'next') {
        page++;
        this.setState({ postPage: page });
      }

      if (direction === 'previous') {
        page--;
        console.log(this.state.postPage);
        this.setState({ postPage: page });
        console.log(this.state.postPage);
      }

      console.log(this.state.postPage, 'NEEDPOSTPAGE');
      // fetch('URL')
      const loadedPostsResult = await fetch(
        `http://localhost:8080/feed/posts?page=${page}`, //forma correta. (OBS: NÃO É BOM ENCODAR SUA 'TOKEN'/JWT TOKEN de authorization NAS SUAS URL... EM VEZ DISSO, OPTE POR __ ANEXAR/APPENDAR ESSA TOKEN __ LÁ _ NOS HEADERS__ DOS REQUESTS QUE VOCÊ ENVIA, COMO VISTO LOGO ABAIXo...)
        {
          headers: {
            //vamos ter que adicionar esse HEADER ESPECÍFICO DE 'Authorization'/token __ _em TODOS OS REQUESTS __ FEITOS NO NOSSO FRONTEND... (menos os de 'login' e 'signup')...
            Authorization: `Bearer ${this.props.token}`, //obs: esse 'Authorization' foi DEFINIDO COMO 'PERMITIDO' lá ___ no 'app.js' DO NOSSO BACKEND, naquele middleware do CORS...
            // 'Content-Type': 'application/json' ///PROFESSOR EXPLICA QUE AQUI, NESSE CASE DESSE 'GET REQUEST', não precisamos __ SETTAR 'content-type' como sendo json __ JUSTAMENTE_ PQ NÃO ESTAMOS ENVIANDO NENHUMA DATA CONCRETA, E SIM APENAS UM 'AUTHORIZATION HEADER' no nosso request... (pq REQUESTS DE TIPO GET REALMENTE __ NÃO PODEM/CONSEGUEM ENVIAR BODIES CONSIGO... só headers)...
          },
        }
      ); ///esse request vai ser enviado PRIMEIRAMENTE ao middleware do arquivo 'is-auth', na pasta 'middlewareHelpers'...

      // fetch('/feed/posts') //FORMA ERRADA.
      // .then((res) => {
      if (loadedPostsResult.status !== 200) {
        throw new Error('Failed to fetch posts.');
      }
      // return res.json();

      const manipulatedPostsResult = await loadedPostsResult.json();
      // })
      // .then((data) => {
      // console.log('ENTERED25125');
      this.setState({
        // posts: data.posts,

        posts: manipulatedPostsResult.posts.map((post) => {
          return {
            ...post,
            imagePath: post.imageUrl,
          };
        }),
        totalPosts: manipulatedPostsResult.totalItems,
        postsLoading: false,
      });
      // })
    } catch (err) {
      // console.log('CATCHED');
      this.catchError(); ////não sei se isso está certo.


    }
    // .catch(this.catchError);
  };

  statusUpdateHandler = async (event) => {
    event.preventDefault();

    // console.log(event.target.value);
    try {
      const updateStatusResult = await fetch(
        'http://localhost:8080/auth/status',
        {
          method: 'PATCH',
          body: JSON.stringify({
            status: this.state.status
          }),
          headers: {
            'Authorization': `Bearer ${this.props.token}`,
            'Content-Type': 'application/json' //isto ainda é necessário.... (request de tipo patch/post/put...)
          },
        }
      );

      if (
        updateStatusResult.status !== 200 &&
        updateStatusResult.status !== 201
      ) {
        throw new Error("Can't update status!");
      }
      const manipulatedUpdateStatusResult = await updateStatusResult.json();

      // console.log(manipulatedUpdateStatusResult);
    } catch (err) {
      this.catchError();
    }
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = (postId) => {
    // console.log(postId);

    this.setState((prevState) => {
      const loadedPost = {
        ...prevState.posts.find((post) => post._id === postId),
      };
      // console.log(loadedPost);
      return {
        isEditing: true,
        editPost: loadedPost,
      };
    });

    // console.log(this.state.editPost);
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  // finishEditHandler = (postData) => {
  //   ///usado tanto para o ADD como para o EDIT de posts...
  //   this.setState({ editLoading: true });

  //   //Set up data (with image!)
  //   // let url = 'URL';

  //   ////esse objeto/const de 'formData' JÁ VAI SETTAR AUTOMATICAMENTE OS HEADERS APROPRIADOS PARA ESSE REQUEST, para nós... (não escreva aquele header de 'Content-Type: application/json', pq isso vai QUEBRAR O SEU APP....)
  //   let formData = new FormData(); ///usado para conesguirmos UPLOADAR FILES E 'text inputs' AO MESMO TEMPO, EM UM REUQEST, AO NOSSO BACKEND...
  //   formData.append('title', postData.title);
  //   formData.append('content', postData.content);
  //   formData.append('image', postData.image);

  //   console.log(postData.image);

  //   let url = 'http://localhost:8080/feed/post';
  //   let method = 'POST';

  //   if (this.state.editPost) {
  //     // url = 'URL';
  //     // url = 'http://localhost:8080/feed/post-edit';  ////approach do method 'PATCH', com o POSTID enviado no BODY do request (send no body do request, em vez de o extrair de um SEGMENTO DINÂMICO NA URL)....
  //     // method = 'PATCH';
  //     url = `http://localhost:8080/feed/post/${postData.id}`;
  //     method = 'PUT';
  //     console.log(postData);
  //     // formData = new FormData(); /// approach antiga, do 'formData'.... --> essa approach é usada com o 'createPost', mas não com o EDIT POST...
  //     // formData.append('postId', postData.id); //ver anotação logo acima... approach do método 'patch', antiga, minha, obsoleta.
  //     // formData.append('title', postData.title);
  //     // formData.append('content', postData.content);
  //     // formData.append('image', postData.image);

  //   }

  //   for (var pair of formData.entries()) {
  //     console.log(pair[0] + ', ' + pair[1]);
  //   }

  //   fetch(url, {
  //     method: method,
  //     // body: JSON.stringify(postData),
  //     body: formData, //isso vai conter a DATA EM FORMATO TEXT   __ MAIS__ A image que queremos uploadar...

  //     headers: { //vamos ter que adicionar esse HEADER ESPECÍFICO DE 'Authorization'/token __ _em TODOS OS REQUESTS __ FEITOS NO NOSSO FRONTEND... (menos os de 'login' e 'signup')...
  //       'Authorization': `Bearer ${this.props.token}`, //obs: esse 'Authorization' foi DEFINIDO COMO 'PERMITIDO' lá ___ no 'app.js' DO NOSSO BACKEND, naquele middleware do CORS...
  //       // 'Content-Type': 'application/json' ///PROFESSOR EXPLICA QUE AQUI, NESSE CASE DESSE 'GET REQUEST', não precisamos __ SETTAR 'content-type' como sendo json __ JUSTAMENTE_ PQ NÃO ESTAMOS ENVIANDO NENHUMA DATA CONCRETA, E SIM APENAS UM 'AUTHORIZATION HEADER' no nosso request... (pq REQUESTS DE TIPO GET REALMENTE __ NÃO PODEM/CONSEGUEM ENVIAR BODIES CONSIGO... só headers)...
  //     }

  //     // headers: { ///este código, este SET DE HEADERS, __ NÃO FUNCIONA__ quando estamos lidando com O 'UPLOAD DE TEXT + UPLOAD DE IMAGES/files' ao mesmo tempo... (pq nossas files não conseguem ser convertidas em text...) --> para possibilitar o upload de images + text ao nosso backend, usamos o approach de 'const formData = new FormData()', visto mais acima...
  //     //   'Content-Type':     //'application/json' //só usaríamos isso se NÃO TIVÉSSEMOS UMA IMAGE nesse request que queremos enviar, nesse caso específico (aqui, no caso, temos UMA IMAGE + TEXTDATA... --> por isso vamos usar 'multipart/form-data' como CONTENT TYPE)....
  //     //                       'multipart/form-data'
  //     // }
  //   })
  //     .then((res) => {
  //       if (res.status === 400) {
  //         throw new Error(
  //           'Please input values that are valid and not equal to previous ones.'
  //         );
  //       }
  //         console.log(res.status);
  //       if (res.status !== 200 && res.status !== 201) {
  //         throw new Error('Creating or editing a post failed!');
  //       }

  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log(data.post);
  //       const post = {
  //         _id: data.post._id,
  //         title: data.post.title,
  //         content: data.post.content,
  //         creator: data.post.creator,
  //         createdAt: data.post.createdAt,
  //       };

  //       this.setState((prevState) => {
  //         let updatedPosts = [...prevState.posts];
  //         if (prevState.editPosts) {
  //           const postIndex = prevState.posts.findIndex((post) => {
  //             return post._id === prevState.editPost._id;
  //           });
  //           updatedPosts[postIndex] = post;
  //         } else if (prevState.posts.length < 2) {
  //           updatedPosts = prevState.posts.concat(post);
  //         }
  //         return {
  //           posts: updatedPosts,
  //           isEditing: false,
  //           editPost: null,
  //           editLoading: false,
  //         };
  //       });

  //       this.loadPosts();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       this.setState({
  //         isEditing: false,
  //         editPost: null,
  //         editLoading: false,
  //         error: err,
  //       });
  //       this.loadPosts();
  //     });
  // };

  finishEditHandler = async (postData) => {
    ///usado tanto para o ADD como para o EDIT de posts...

    try {
      this.setState({ editLoading: true });

      //Set up data (with image!)
      // let url = 'URL';

      ////esse objeto/const de 'formData' JÁ VAI SETTAR AUTOMATICAMENTE OS HEADERS APROPRIADOS PARA ESSE REQUEST, para nós... (não escreva aquele header de 'Content-Type: application/json', pq isso vai QUEBRAR O SEU APP....)
      let formData = new FormData(); ///usado para conesguirmos UPLOADAR FILES E 'text inputs' AO MESMO TEMPO, EM UM REUQEST, AO NOSSO BACKEND...
      formData.append('title', postData.title);
      formData.append('content', postData.content);
      formData.append('image', postData.image);

      // console.log(postData.image);

      let url = 'http://localhost:8080/feed/post';
      let method = 'POST';

      if (this.state.editPost) {
        // url = 'URL';
        // url = 'http://localhost:8080/feed/post-edit';  ////approach do method 'PATCH', com o POSTID enviado no BODY do request (send no body do request, em vez de o extrair de um SEGMENTO DINÂMICO NA URL)....
        // method = 'PATCH';
        url = `http://localhost:8080/feed/post/${postData.id}`;
        method = 'PUT';
        // console.log(postData);
        // formData = new FormData(); /// approach antiga, do 'formData'.... --> essa approach é usada com o 'createPost', mas não com o EDIT POST...
        // formData.append('postId', postData.id); //ver anotação logo acima... approach do método 'patch', antiga, minha, obsoleta.
        // formData.append('title', postData.title);
        // formData.append('content', postData.content);
        // formData.append('image', postData.image);
      }

      for (var pair of formData.entries()) {
        // console.log(pair[0] + ', ' + pair[1]);
      }

      const editAndAddResults = await fetch(url, {
        method: method,
        // body: JSON.stringify(postData),
        body: formData, //isso vai conter a DATA EM FORMATO TEXT   __ MAIS__ A image que queremos uploadar...

        headers: {
          //vamos ter que adicionar esse HEADER ESPECÍFICO DE 'Authorization'/token __ _em TODOS OS REQUESTS __ FEITOS NO NOSSO FRONTEND... (menos os de 'login' e 'signup')...
          Authorization: `Bearer ${this.props.token}`, //obs: esse 'Authorization' foi DEFINIDO COMO 'PERMITIDO' lá ___ no 'app.js' DO NOSSO BACKEND, naquele middleware do CORS...
          // 'Content-Type': 'application/json' ///PROFESSOR EXPLICA QUE AQUI, NESSE CASE, não precisamos __ SETTAR 'content-type' como sendo json __ JUSTAMENTE_ PQ  ENVIANDO DATA por meio daquele 'formData.append()'... APENAS precisamos settar, nesse case, UM 'AUTHORIZATION HEADER' no nosso request... (pq REQUESTS DE TIPO GET REALMENTE __ NÃO PODEM/CONSEGUEM ENVIAR BODIES CONSIGO... só headers)...
        },

        // headers: { ///este código, este SET DE HEADERS, __ NÃO FUNCIONA__ quando estamos lidando com O 'UPLOAD DE TEXT + UPLOAD DE IMAGES/files' ao mesmo tempo... (pq nossas files não conseguem ser convertidas em text...) --> para possibilitar o upload de images + text ao nosso backend, usamos o approach de 'const formData = new FormData()', visto mais acima...
        //   'Content-Type':     //'application/json' //só usaríamos isso se NÃO TIVÉSSEMOS UMA IMAGE nesse request que queremos enviar, nesse caso específico (aqui, no caso, temos UMA IMAGE + TEXTDATA... --> por isso vamos usar 'multipart/form-data' como CONTENT TYPE)....
        //                       'multipart/form-data'
        // }
      });
      // .then((res) => {
      if (editAndAddResults.status === 400) {
        throw new Error(
          'Please input values that are valid and not equal to previous ones.'
        );
      }
  
      if (
        editAndAddResults.status !== 200 &&
        editAndAddResults.status !== 201
      ) {
        throw new Error('Creating or editing a post failed!');
      }

      // return res.json();
      // })
      // .then((data) => {


      const manipulatedEditAndAddResults = await editAndAddResults.json();

      const post = {
        _id: manipulatedEditAndAddResults.post._id,
        title: manipulatedEditAndAddResults.post.title,
        content: manipulatedEditAndAddResults.post.content,
        creator: manipulatedEditAndAddResults.post.creator,
        createdAt: manipulatedEditAndAddResults.post.createdAt,
      };

      console.log(post, 'Line');
      this.setState((prevState) => {
        let updatedPosts = [...prevState.posts];
        if (prevState.editPosts) {
          const postIndex = prevState.posts.findIndex((post) => {
            return post._id === prevState.editPost._id;
          });
          updatedPosts[postIndex] = post;
        } else if (prevState.posts.length < 2) {
          updatedPosts = prevState.posts.concat(post);
        }
        return {
          posts: updatedPosts,
          isEditing: false,
          editPost: null,
          editLoading: false,
        };
      });

      this.loadPosts();
      // })
    } catch (err) {
      // .catch((err) => {
      //   console.log(err);
      this.setState({
        isEditing: false,
        editPost: null,
        editLoading: false,
        error: err,
      });
      this.loadPosts();
      // });
    }
  };

  statusInputChangedHandler = (input, value) => {
    this.setState({ status: value });
  };


  addPost = (post, postCreator) => {
    this.setState(prevState => {
                const updatedPosts = [...prevState.posts];

                const yourPost = {
                  ...post
                }
      
                const userId = yourPost.creator.userId;
                yourPost.creator.userId = {
                  userId: userId,
                  name: postCreator
                };
                

                if(prevState.postPage === 1 && prevState.posts.length === 5) {
                    // updatedPosts.pop();
                    // updatedPosts.unshift(post);
                    updatedPosts.unshift(yourPost);
                    updatedPosts.pop();
                } else {
                    // updatedPosts.unshift(post);
                  updatedPosts.unshift(yourPost);
                }
                return {
                    posts: updatedPosts,
                    totalPosts: prevState.totalPosts + 1
                }

    })
}







updatePost = (post, postCreator) => {
  this.setState(prevState => {
              const updatedPosts = [...prevState.posts];

              // const yourPost = {
              //   ...post
              // }
              // console.log(yourPost);
              // const userId = yourPost.creator.userId;
              // yourPost.creator.userId = {
              //   userId: userId,
              //   name: postCreator
              // };
              

              // if(prevState.postPage === 1 && prevState.posts.length === 5) {
              //     // updatedPosts.pop();
              //     // updatedPosts.unshift(post);
              //     // updatedPosts.unshift(yourPost);
              //     updatedPosts.pop();
              // } else {
              //     // updatedPosts.unshift(post);
              //   updatedPosts.unshift(yourPost);
              // }



     const updatedPostIndex = updatedPosts.findIndex(
          (p) => {
                return post._id === p._id
          }
        )

        if (updatedPostIndex > -1) {
          updatedPosts[updatedPostIndex] = post;
        }
              return {
                  posts: updatedPosts,

                  // totalPosts: prevState.totalPosts + 1
              }
  })
}




// deletePost = (postId, posts) => { ///código que eu tentei escrever, mas que não deu tão certo...
//   this.setState(prevState => {

//     const updatedPosts = [...prevState.posts];


//     const databasePosts = posts;



//     const postDeleteIndex = updatedPosts.findIndex(
//       (post) => {
//             return post._id === postId
//       }
//     )

//     const neededDatabasePostIndex = postDeleteIndex + 1;


//       if (postDeleteIndex <= 4) {

//         updatedPosts[postDeleteIndex] = databasePosts[neededDatabasePostIndex];
//       }


//     return {
//         posts: updatedPosts
//         // totalPosts: prevState.totalPosts + 1
//     }
// })

// }





  // deletePostHandler = (postId) => {
  //   this.setState({ postsLoading: true });

  //   fetch(`http://localhost:8080/feed/delete-post/${postId}`, {
  //     // method: 'POST',
  //     method: 'DELETE',

  //     headers: { //vamos ter que adicionar esse HEADER ESPECÍFICO DE 'Authorization'/token __ _em TODOS OS REQUESTS __ FEITOS NO NOSSO FRONTEND... (menos os de 'login' e 'signup')...
  //       'Authorization': `Bearer ${this.props.token}`, //obs: esse 'Authorization' foi DEFINIDO COMO 'PERMITIDO' lá ___ no 'app.js' DO NOSSO BACKEND, naquele middleware do CORS...
  //       // 'Content-Type': 'application/json' ///PROFESSOR EXPLICA QUE AQUI, NESSE CASE DESSE 'GET REQUEST', não precisamos __ SETTAR 'content-type' como sendo json __ JUSTAMENTE_ PQ NÃO ESTAMOS ENVIANDO NENHUMA DATA CONCRETA, E SIM APENAS UM 'AUTHORIZATION HEADER' no nosso request... (pq REQUESTS DE TIPO GET REALMENTE __ NÃO PODEM/CONSEGUEM ENVIAR BODIES CONSIGO... só headers)...
  //     }

  //     // headers: {
  //     //   'Content-Type': 'application/json',
  //     // },
  //     // body: JSON.stringify({ ///Não é mais necessário, pois não vamos mais querer extrair o 'postId' de dentro do BODY DO REQUEST de tipo 'POST', e sim vamos extrair LÁ DA URL DESSE REQUEST de method de tipo 'DELETE' (que nunca aceitam BODIES, deve-se relembrar...)
  //     //   postId: postId,
  //     // }),
  //   })
  //     .then((res) => {
  //       if (res.status !== 200 && res.status !== 201) {
  //         throw new Error('Deleting a post failed!');
  //       }

  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //       this.setState((prevState) => {
  //         const updatedPosts = prevState.posts.filter((post) => {
  //           return post._id !== postId;
  //         });
  //         return { posts: updatedPosts, postsLoading: false };
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       this.setState({ postsLoading: false });
  //     });
  // };

  deletePostHandler = async (postId) => {
    try {
      this.setState({ postsLoading: true });

      const deleteResult = await fetch(
        `http://localhost:8080/feed/delete-post/${postId}`,
        {
          // method: 'POST',
          method: 'DELETE',

          headers: {
            //vamos ter que adicionar esse HEADER ESPECÍFICO DE 'Authorization'/token __ _em TODOS OS REQUESTS __ FEITOS NO NOSSO FRONTEND... (menos os de 'login' e 'signup')...
            Authorization: `Bearer ${this.props.token}`, //obs: esse 'Authorization' foi DEFINIDO COMO 'PERMITIDO' lá ___ no 'app.js' DO NOSSO BACKEND, naquele middleware do CORS...
            // 'Content-Type': 'application/json' ///PROFESSOR EXPLICA QUE AQUI, NESSE CASE DESSE 'GET REQUEST', não precisamos __ SETTAR 'content-type' como sendo json __ JUSTAMENTE_ PQ NÃO ESTAMOS ENVIANDO NENHUMA DATA CONCRETA, E SIM APENAS UM 'AUTHORIZATION HEADER' no nosso request... (pq REQUESTS DE TIPO GET REALMENTE __ NÃO PODEM/CONSEGUEM ENVIAR BODIES CONSIGO... só headers)...
          },

          // headers: {
          //   'Content-Type': 'application/json',
          // },
          // body: JSON.stringify({ ///Não é mais necessário, pois não vamos mais querer extrair o 'postId' de dentro do BODY DO REQUEST de tipo 'POST', e sim vamos extrair LÁ DA URL DESSE REQUEST de method de tipo 'DELETE' (que nunca aceitam BODIES, deve-se relembrar...)
          //   postId: postId,
          // }),
        }
      );

      // .then((res) => {
      if (deleteResult.status !== 200 && deleteResult.status !== 201) {
        throw new Error('Deleting a post failed!');
      }



      this.loadPosts();

      // return res.json();
      // })
      // .then((data) => {
      // console.log(deleteResult);
      // this.setState((prevState) => {


      //   console.log(prevState.posts, postId);
      //   const updatedPosts = prevState.posts.filter((post) => {

      //     return post._id.toString() !== postId.toString();
      //   });




      //   return { posts: updatedPosts, postsLoading: false };
      // });


      // })
    } catch (err) {
      // .catch((err) => {
      console.log(err);
      this.setState({ postsLoading: false });
      // });
    }
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = (error) => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="feed__status">
          <form onSubmit={this.statusUpdateHandler}>
            <Input
              type="text"
              placeholder="Your status"
              control="input"
              onChange={this.statusInputChangedHandler}
              value={this.state.status}
            />
            <Button mode="flat" type="submit">
              Update
            </Button>
          </form>
        </section>
        <section className="feed__control">
          <Button mode="raised" design="accent" onClick={this.newPostHandler}>
            New Post
          </Button>
        </section>
        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: 'center' }}>No posts found.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Paginator
              onPrevious={this.loadPosts.bind(this, 'previous')}
              onNext={this.loadPosts.bind(this, 'next')}
              lastPage={Math.ceil(this.state.totalPosts / 5)}
              currentPage={this.state.postPage}
            >
              {this.state.posts.map((post) => (
                <Post
                  key={post._id}
                  id={post._id}
                  author={post.creator.userId.name}
                  date={new Date(post.createdAt).toLocaleDateString('en-US')}
                  title={post.title}
                  image={post.imageUrl}
                  content={post.content}
                  onStartEdit={this.startEditPostHandler.bind(this, post._id)}
                  onDelete={this.deletePostHandler.bind(this, post._id)}
                  token={this.props.token}
                  userId={this.props.userId}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Feed;
