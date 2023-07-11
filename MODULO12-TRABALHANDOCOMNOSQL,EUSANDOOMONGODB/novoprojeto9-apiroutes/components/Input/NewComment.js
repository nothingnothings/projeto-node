import { useRef, useState } from 'react';

import NewCommentStyle from './NewComment.module.css';

const NewComment = (props) => {
  const [isInvalid, setIsInvalid] = useState(false);

  const emailInputRef = useRef();
  const nameInputRef = useRef();
  const commentInputRef = useRef();

  const sendCommentHandler = (event) => {
    event.preventDefault();

    const enteredMail = emailInputRef.current.value;
    const enteredName = nameInputRef.current.value;
    const enteredComment = commentInputRef.current.value;

    if (
      !enteredMail ||
      enteredMail.trim() === '' ||
      !enteredMail.includes('@') ||
      !enteredName ||
      enteredName.trim() === '' ||
      !enteredComment ||
      enteredComment.trim() === ''
    ) {
      setIsInvalid(true);
      return;
    }

    props.onAddComment({
      email: enteredMail,
      name: enteredName,
      text: enteredComment,
      id: new Date() * Math.random()
    });
  };

  return (
    <form
      className={NewCommentStyle.Form}
      onSubmit={(event) => {
        sendCommentHandler(event);
      }}
    >
      <div className={NewCommentStyle.Row}>
        <div className={NewCommentStyle.Control}>
          <label htmlFor="email">Your email</label>
          <input type="email" id="email" ref={emailInputRef} />
        </div>
        <div className={NewCommentStyle.Control}>
          <label htmlFor="name">Your name</label>
          <input type="text" id="name" ref={nameInputRef} />
        </div>
        <div className={NewCommentStyle.Control}>
          <label htmlFor="comment">Your comment</label>
          <textarea id="comment" ref={commentInputRef} rows="5" />
        </div>
        {isInvalid && <p>Please enter a valid email address and comment!</p>}
        <button>Submit</button>
      </div>
    </form>
  );
};

export default NewComment;
