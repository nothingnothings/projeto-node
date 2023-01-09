import { useState, useRef } from 'react';
import classes from './auth-form.module.css';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);



  const emailRef = useRef();

  const passwordRef = useRef();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  const submitHandler = (event) => {
    event.preventDefault();


    if (!isLogin) {
      const enteredEmail = emailRef.current.value;
      const enteredPassword = passwordRef.current.value;

      fetch('/api/auth/signup', {
  
        method: 'POST',
        body: 
         JSON.stringify( ///necessário
           {
            email: enteredEmail,
            password: enteredPassword
           }
         ) 
        ,
        headers: {
          'Content-Type': 'application/json'
        }
  
      })
      .then(
        (res) => {
                console.log(res);
                if (res.ok) {
                  console.log('LINE');
                  return res.json();
                }
             
              return res;
        }
      )
      .catch(
        (data) => {
          console.log(data);
        }
        
      )
    }

  
}

  

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form     onSubmit={
      (event) => {
        submitHandler(event)
      }
    }>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required  ref={passwordRef}/>
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
