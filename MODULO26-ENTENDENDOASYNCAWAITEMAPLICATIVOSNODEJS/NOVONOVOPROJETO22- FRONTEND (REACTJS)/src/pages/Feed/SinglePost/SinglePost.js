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
    fetch(
      `http://localhost:8080/feed/post/${postId}`,

      {
        headers: {
          //vamos ter que adicionar esse HEADER ESPECÍFICO DE 'Authorization'/token __ _em TODOS OS REQUESTS __ FEITOS NO NOSSO FRONTEND... (menos os de 'login' e 'signup')...
          Authorization: `Bearer ${this.props.token}`, //obs: esse 'Authorization' foi DEFINIDO COMO 'PERMITIDO' lá ___ no 'app.js' DO NOSSO BACKEND, naquele middleware do CORS...
          // 'Content-Type': 'application/json' ///PROFESSOR EXPLICA QUE AQUI, NESSE CASE DESSE 'GET REQUEST', não precisamos __ SETTAR 'content-type' como sendo json __ JUSTAMENTE_ PQ NÃO ESTAMOS ENVIANDO NENHUMA DATA CONCRETA, E SIM APENAS UM 'AUTHORIZATION HEADER' no nosso request... (pq REQUESTS DE TIPO GET REALMENTE __ NÃO PODEM/CONSEGUEM ENVIAR BODIES CONSIGO... só headers)...
        },
      }
    )
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch status');
        }

        return res.json();
      })
      .then((data) => {
        this.setState({
          title: data.post.title,
          author: data.post.creator.name,
          date: new Date(data.post.createdAt).toLocaleDateString('en-US'),
          image: data.post.imageUrl,
          content: data.post.content,
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
