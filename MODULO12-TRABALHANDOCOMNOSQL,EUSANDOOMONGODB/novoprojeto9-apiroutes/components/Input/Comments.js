import { useEffect, useState } from 'react';

import CommentList from './CommentList';
import NewComment from './NewComment';

import CommentsStyle from './Comments.module.css';


import Spinner from '../../components/Spinner/Spinner';

const Comments = (props) => {
  const { eventId } = props;

  const [showComments, setShowComments] = useState(false);

  const [commentList, setCommentList] = useState([]);


  const [isLoading, setIsLoading] = useState(false);


  let spinner = null;




  if (
    isLoading) {
   spinner = (<Spinner />)
    }






  useEffect(() => {
    if (showComments) {
      /// se 'showComments' estiver como _TRUE__, E SÓ ___ NESSA HIPÓTESE ESPECÍFICA__, VAMOS QUERER QUE __ O CÓDIGO DE 'FETCH' SEJA EXECUTADO NOVAMENTE...
      setIsLoading(true);
      console.log(commentList);
      fetch(`/api/comments/${eventId}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setIsLoading(false);
          setCommentList(data.list);
          
        });
    }
  }, [showComments]);

  const toggleCommentsHandler = () => {
    setShowComments((prevStatus) => !prevStatus);

    // fetch(`/api/comments/${eventId}`) //////////EXECUTE ISSO EM 'useEffect()', E NÃO AQUI... --> pq é em 'useEffect()' QUE VOCÊ DEVE EXECUTAR O SEU CÓDIGO QUE PRODUZ 'SIDEEFFECTS'...
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((data) => {
    //     console.log(data);
    //     setCommentList(data.list);
    //   });
  };

  const addCommentHandler = (commentData, event) => {
    //send data to API

    // fetch('/api/comments', {
    
    fetch(`/api/comments/${eventId}`, {
      method: 'POST',
      body: JSON.stringify(commentData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  };













  return (
    <section className={CommentsStyle.Comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? 'Hide' : 'Show'} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && <CommentList list={commentList} />}
      {spinner}
    </section>
  );
};

export default Comments;
