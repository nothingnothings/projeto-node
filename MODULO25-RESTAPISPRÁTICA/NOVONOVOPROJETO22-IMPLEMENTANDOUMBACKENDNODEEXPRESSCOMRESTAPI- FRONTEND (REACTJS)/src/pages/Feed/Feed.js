import React, { Component, Fragment } from 'react';

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
    fetch(`http://localhost:8080/feed/status`, {
      headers: {
        Authorization: `Bearer ${this.props.token}`,
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
        this.setState({ status: data.userStatus });
      })
      .catch(this.catchError);
    this.loadPosts(); //EXECUTADO __ APÓS O FETCH, ACHO...
  }

  loadPosts = (direction) => {
    // const token = localStorage.getItem('token');  // já vamos obter isso por meio dos PROPS repassados pelo 'App.js'..

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
    fetch(
      `http://localhost:8080/feed/posts?page=${page}`, //forma correta. (OBS: NÃO É BOM ENCODAR SUA 'TOKEN'/JWT TOKEN de authorization NAS SUAS URL... EM VEZ DISSO, OPTE POR __ ANEXAR/APPENDAR ESSA TOKEN __ LÁ _ NOS HEADERS__ DOS REQUESTS QUE VOCÊ ENVIA, COMO VISTO LOGO ABAIXo...)
      {
        headers: {
          //vamos ter que adicionar esse HEADER ESPECÍFICO DE 'Authorization'/token __ _em TODOS OS REQUESTS __ FEITOS NO NOSSO FRONTEND... (menos os de 'login' e 'signup')...
          Authorization: `Bearer ${this.props.token}`, //obs: esse 'Authorization' foi DEFINIDO COMO 'PERMITIDO' lá ___ no 'app.js' DO NOSSO BACKEND, naquele middleware do CORS...
          // 'Content-Type': 'application/json' ///PROFESSOR EXPLICA QUE AQUI, NESSE CASE DESSE 'GET REQUEST', não precisamos __ SETTAR 'content-type' como sendo json __ JUSTAMENTE_ PQ NÃO ESTAMOS ENVIANDO NENHUMA DATA CONCRETA, E SIM APENAS UM 'AUTHORIZATION HEADER' no nosso request... (pq REQUESTS DE TIPO GET REALMENTE __ NÃO PODEM/CONSEGUEM ENVIAR BODIES CONSIGO... só headers)...
        },
      }
    ) ///esse request vai ser enviado PRIMEIRAMENTE ao middleware do arquivo 'is-auth', na pasta 'middlewareHelpers'...
      // fetch('/feed/posts') //FORMA ERRADA.
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch posts.');
        }
        return res.json();
      })
      .then((data) => {
        console.log('ENTERED25125');
        this.setState({
          // posts: data.posts,

          posts: data.posts.map((post) => {
            return {
              ...post,
              imagePath: post.imageUrl,
            };
          }),
          totalPosts: data.totalItems,
          postsLoading: false,
        });
      })
      .catch(this.catchError);
  };

  statusUpdateHandler = (event) => {
    event.preventDefault();
    console.log(this.state.status);
    fetch(
      `http://localhost:8080/feed/status`,

      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.props.token}`,
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          newStatus: this.state.status
        })
      }
    )
      .then((res) => {

        console.log(res.status);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update status!");
        }
        return res.json();
      })
      .then((data) => {

        window.location.reload(false);
        console.log(data);
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = (postId) => {
    console.log(postId);

    this.setState((prevState) => {
      const loadedPost = {
        ...prevState.posts.find((post) => post._id === postId),
      };
      console.log(loadedPost);
      return {
        isEditing: true,
        editPost: loadedPost,
      };
    });

    console.log(this.state.editPost);
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = (postData) => {
    ///usado tanto para o ADD como para o EDIT de posts...
    this.setState({ editLoading: true });

    //Set up data (with image!)
    // let url = 'URL';

    ////esse objeto/const de 'formData' JÁ VAI SETTAR AUTOMATICAMENTE OS HEADERS APROPRIADOS PARA ESSE REQUEST, para nós... (não escreva aquele header de 'Content-Type: application/json', pq isso vai QUEBRAR O SEU APP....)
    let formData = new FormData(); ///usado para conesguirmos UPLOADAR FILES E 'text inputs' AO MESMO TEMPO, EM UM REUQEST, AO NOSSO BACKEND...
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('image', postData.image);

    console.log(postData.image);

    let url = 'http://localhost:8080/feed/post';
    let method = 'POST';

    if (this.state.editPost) {
      // url = 'URL';
      // url = 'http://localhost:8080/feed/post-edit';  ////approach do method 'PATCH', com o POSTID enviado no BODY do request (send no body do request, em vez de o extrair de um SEGMENTO DINÂMICO NA URL)....
      // method = 'PATCH';
      url = `http://localhost:8080/feed/post/${postData.id}`;
      method = 'PUT';
      console.log(postData);
      // formData = new FormData(); /// approach antiga, do 'formData'.... --> essa approach é usada com o 'createPost', mas não com o EDIT POST...
      // formData.append('postId', postData.id); //ver anotação logo acima... approach do método 'patch', antiga, minha, obsoleta.
      // formData.append('title', postData.title);
      // formData.append('content', postData.content);
      // formData.append('image', postData.image);
    }

    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    fetch(url, {
      method: method,
      // body: JSON.stringify(postData),
      body: formData, //isso vai conter a DATA EM FORMATO TEXT   __ MAIS__ A image que queremos uploadar...

      headers: {
        //vamos ter que adicionar esse HEADER ESPECÍFICO DE 'Authorization'/token __ _em TODOS OS REQUESTS __ FEITOS NO NOSSO FRONTEND... (menos os de 'login' e 'signup')...
        Authorization: `Bearer ${this.props.token}`, //obs: esse 'Authorization' foi DEFINIDO COMO 'PERMITIDO' lá ___ no 'app.js' DO NOSSO BACKEND, naquele middleware do CORS...
        // 'Content-Type': 'application/json' ///PROFESSOR EXPLICA QUE AQUI, NESSE CASE DESSE 'GET REQUEST', não precisamos __ SETTAR 'content-type' como sendo json __ JUSTAMENTE_ PQ NÃO ESTAMOS ENVIANDO NENHUMA DATA CONCRETA, E SIM APENAS UM 'AUTHORIZATION HEADER' no nosso request... (pq REQUESTS DE TIPO GET REALMENTE __ NÃO PODEM/CONSEGUEM ENVIAR BODIES CONSIGO... só headers)...
      },

      // headers: { ///este código, este SET DE HEADERS, __ NÃO FUNCIONA__ quando estamos lidando com O 'UPLOAD DE TEXT + UPLOAD DE IMAGES/files' ao mesmo tempo... (pq nossas files não conseguem ser convertidas em text...) --> para possibilitar o upload de images + text ao nosso backend, usamos o approach de 'const formData = new FormData()', visto mais acima...
      //   'Content-Type':     //'application/json' //só usaríamos isso se NÃO TIVÉSSEMOS UMA IMAGE nesse request que queremos enviar, nesse caso específico (aqui, no caso, temos UMA IMAGE + TEXTDATA... --> por isso vamos usar 'multipart/form-data' como CONTENT TYPE)....
      //                       'multipart/form-data'
      // }
    })
      .then((res) => {
        if (res.status === 400) {
          throw new Error(
            'Please input values that are valid and not equal to previous ones.'
          );
        }
        console.log(res.status);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Creating or editing a post failed!');
        }

        return res.json();
      })
      .then((data) => {
        console.log(data.post);
        const post = {
          _id: data.post._id,
          title: data.post.title,
          content: data.post.content,
          creator: data.post.creator,
          createdAt: data.post.createdAt,
        };

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
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err,
        });
        this.loadPosts();
      });
  };

  statusInputChangedHandler = (input, value) => {

    this.setState({ status: value });
  };

  deletePostHandler = (postId) => {
    this.setState({ postsLoading: true });

    fetch(`http://localhost:8080/feed/delete-post/${postId}`, {
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
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Deleting a post failed!');
        }

        return res.json();
      })
      .then((data) => {
        console.log(data);
        this.setState((prevState) => {
          const updatedPosts = prevState.posts.filter((post) => {
            return post._id !== postId;
          });
          return { posts: updatedPosts, postsLoading: false };
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
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
                  author={post.creator.name}
                  date={new Date(post.createdAt).toLocaleDateString('en-US')}
                  title={post.title}
                  image={post.imageUrl}
                  content={post.content}
                  onStartEdit={this.startEditPostHandler.bind(this, post._id)}
                  onDelete={this.deletePostHandler.bind(this, post._id)}
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
