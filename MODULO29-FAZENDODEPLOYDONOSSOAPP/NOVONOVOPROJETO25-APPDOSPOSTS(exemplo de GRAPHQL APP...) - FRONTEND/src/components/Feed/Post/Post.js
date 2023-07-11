import React from 'react';

import Button from '../../Button/Button';

import { Fragment } from 'react';

import { useEffect, useState } from 'react';

// import Image from '../../Image/Image';

import './Post.css';

const post = (props) => {




  const [created, setCreated] = useState(false);


  // const[loadedPostData, setLoadedPostData] = useState(false);



  // useEffect(() => {
  
  //   const creationStatus = editAndDeleteDisplayer();
  //   console.log(creationStatus);
  //    setCreated(creationStatus);
  //   // setCreated(true);
  //    console.log(created);
  // }, [loadedPostData]);
  



  



  useEffect(() => {
    (async () => {
      // const postUserIdResult = await fetch(`http://localhost:8080/feed/post/buttons/${props.id}`, {

      const userId = localStorage.getItem('userId');


        const graphqlQuery = {
          query: `
         query getCreationStatusOperation ($userId: ID!, $postId: ID!) {
            getCreationStatus(userId: $userId, postId: $postId) {
                  created
            }
          } 
          `,
          variables: {
            userId: userId,
            postId: props.id
          }
        }


        const postUserIdResult = await fetch(`http://localhost:8080/graphql`, { ///versão graphql...
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${props.token}`,
      },
      body: 
      // JSON.stringify({
      //   userId: props.userId,
      // }),
            JSON.stringify(graphqlQuery),
    });
    const manipulatedPostUserIdResult = await postUserIdResult.json();


    // console.log(manipulatedPostUserIdResult);
      // console.log(manipulatedPostUserIdResult.data.created);
      // setLoadedPostData(true);


    


      setCreated(manipulatedPostUserIdResult.data.getCreationStatus.created);

    })()

  }, [])











  // const editAndDeleteDisplayer = async () => {
  //   const postUserIdResult = await fetch(`http://localhost:8080/feed/post/buttons/${props.id}`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${props.token}`,
  //     },
  //     body: JSON.stringify({
  //       userId: props.userId,
  //     }),
  //   });


  //   const manipulatedPostUserIdResult = await postUserIdResult.json();

  //   console.log(manipulatedPostUserIdResult);
  //     console.log(manipulatedPostUserIdResult.created);
  //     setLoadedPostData(true);
  //   return manipulatedPostUserIdResult.created;
  // };

  return (
    <article className="post">
      <header className="post__header">
        <h3 className="post__meta">
          Posted by {props.author} on {props.date}
        </h3>
        <h1 className="post__title">{props.title}</h1>
      </header>
      {/* <div className="post__image">
      <Image imageUrl={`http://localhost:8080/${props.image}`} contain />
    </div> */}
      {/* <div className="post__content">{props.content}</div> */}
      <div className="post__actions">
        <Button mode="flat" link={props.id}>
          View
        </Button>
        {created ? (
          <Fragment>
            <Button mode="flat" onClick={props.onStartEdit}>
              Edit
            </Button>
            <Button mode="flat" design="danger" onClick={props.onDelete}>
              Delete
            </Button>
          </Fragment>
        ) : null}
      </div>
    </article>
  );
};

export default post;
