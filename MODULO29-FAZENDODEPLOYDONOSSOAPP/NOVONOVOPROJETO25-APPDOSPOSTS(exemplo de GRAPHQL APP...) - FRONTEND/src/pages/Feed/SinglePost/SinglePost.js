import React, { Component } from 'react';

import Image from '../../../components/Image/Image';

import './SinglePost.css';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: '',
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;

    // const graphqlQuery = {


    //   query: `
    //   {
    //     getPost(postId: "${postId}") {
    //             title
    //             content
    //             imageUrl
    //             creator {
    //               name
    //             }
    //             createdAt
    //           }
    //   }
    //   `
    // }




    const graphqlQuery = {


      query: `
      query getPostOperation ($postId: ID!) {
        getPost(postId: $postId) {
                title
                content
                imageUrl
                creator {
                  name
                }
                createdAt
              }
      }
      `,
      variables: {
        postId: postId
      }
    }


    fetch(
      // `http://localhost:8080/feed/post/${postId}`, //versão rest api de nosso código...
      `http://localhost:8080/graphql` //versão graphql....
,
      {
        method: 'POST', //versão graphql
        headers: {
          //vamos ter que adicionar esse HEADER ESPECÍFICO DE 'Authorization'/token __ _em TODOS OS REQUESTS __ FEITOS NO NOSSO FRONTEND... (menos os de 'login' e 'signup')...
          Authorization: `Bearer ${this.props.token}`, //obs: esse 'Authorization' foi DEFINIDO COMO 'PERMITIDO' lá ___ no 'app.js' DO NOSSO BACKEND, naquele middleware do CORS...
          // 'Content-Type': 'application/json' ///PROFESSOR EXPLICA QUE AQUI, NESSE CASE DESSE 'GET REQUEST', não precisamos __ SETTAR 'content-type' como sendo json __ JUSTAMENTE_ PQ NÃO ESTAMOS ENVIANDO NENHUMA DATA CONCRETA, E SIM APENAS UM 'AUTHORIZATION HEADER' no nosso request... (pq REQUESTS DE TIPO GET REALMENTE __ NÃO PODEM/CONSEGUEM ENVIAR BODIES CONSIGO... só headers)...
          'Content-Type': 'application/json' ///versao graphql, precisamos disso....
        },

        body: JSON.stringify(graphqlQuery)
      }
    )
      .then((res) => {
        // if (res.status !== 200) { ////error handling de REST API, e não de GRAPHQL...
        //   throw new Error('Failed to fetch status');
        // }

        return res.json();
      })
      .then((data) => {

        console.log(data);
        if (data.errors) {
          throw new Error('Post fetch has failed.');
        }
        this.setState({
          // title: data.post.title,
          // author: data.post.creator.name,
          // date: new Date(data.post.createdAt).toLocaleDateString('en-US'),
          // image: data.post.imageUrl,
          // content: data.post.content,

          title: data.data.getPost.title,
          author: data.data.getPost.creator.name,
          date: new Date(data.data.getPost.createdAt).toLocaleDateString('en-US'),
          image: data.data.getPost.imageUrl,
          content: data.data.getPost.content,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }


  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image
            contain
            imageUrl={`http://localhost:8080/${this.state.image}`}
          />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
