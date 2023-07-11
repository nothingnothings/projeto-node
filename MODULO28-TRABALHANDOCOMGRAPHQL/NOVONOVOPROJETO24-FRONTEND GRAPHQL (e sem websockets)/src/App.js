import React, { Component, Fragment } from 'react';

import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import Layout from './components/Layout/Layout';

import Backdrop from './components/Backdrop/Backdrop';

import Toolbar from './components/Toolbar/Toolbar';

import MainNavigation from './components/Navigation/MainNavigation/MainNavigation';

import MobileNavigation from './components/Navigation/MobileNavigation/MobileNavigation';

import ErrorHandler from './components/ErrorHandler/ErrorHandler';

import FeedPage from './pages/Feed/Feed'; ////page component....

import SinglePostPage from './pages/Feed/SinglePost/SinglePost'; //page component (props repassados a ela, como METHODS...)

import LoginPage from './pages/Auth/Login'; ///page component

import SignupPage from './pages/Auth/Signup'; //page component

import './App.css';

class App extends Component {
  state = {
    ////state INICIAL de nosso app...
    showBackdrop: false,
    showMobileNav: false,
    // isAuth: true,
    isAuth: false,
    token: null, ///vamos armazenar a token OBTIDA LÁ NO BACKEND, aqui, no BROWSERSIDE, para ser anexada aos nossos requests QUE VÃO PRECISAR DESSA TOKEN PARA SEREM 'authorized'...
    userId: null,
    authLoading: false,
    error: null,
  };

  componentDidMount() {
    const token = localStorage.getItem('token'); //vai fazer o get de nossa token ao ser montado nosso app ( app geral) 
    const expiryDate = localStorage.getItem('expiryDate');

    if (!token || !expiryDate) { ///if checks preventivos de login (se o user não tiver a token/token tiver expirado, não vamos renderizar o resto do nosso app)...
      return;
    }

    if (new Date(expiryDate) <= new Date()) {
      this.logoutHandler();
      return;
    }

    const userId = localStorage.getItem('userId');
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    this.setState({ isAuth: true, 
      token: token, ///vai fazer o set de nossa token no STATE de nosso frontend, se passarmos por aqueles if checks preventivos....
      
      
      userId: userId }); 
    this.setAutoLogout(remainingMilliseconds);
  }

  mobileNavHandler = (isOpen) => {
    this.setState({ showMobileNav: isOpen, showBackdrop: isOpen });
  };

  backdropClickHandler = () => {
    this.setState({ showMobileNav: false, showBackdrop: false, error: null });
  };

  logoutHandler = () => {
    this.setState({ isAuth: false, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
  };

  // loginHandler = (event, authData) => { ///VERSÃO PROMISES (then e catch) do código...
  //   event.preventDefault();
  //   this.setState({ authLoading: true });
  //   fetch(
  //     'http://localhost:8080/auth/login',

  //     {
  //       body: JSON.stringify({
  //         email: authData.email,
  //         password: authData.password,
  //       }),
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       method: 'POST',
  //       ///EIS O CÓDIGO EM QUESTÃO.
  //     }
  //   )
  //     .then((res) => {
  //       if (res.status === 422) {
  //         throw new Error('Validation failed.');
  //       }

  //       if (res.status !== 200 && res.status !== 201) {
  //         throw new Error('Could not authenticate you!');
  //       }

  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log(data);

  //       this.setState({
  //         isAuth: true,
  //         token: data.token,
  //         authLoading: false,
  //         userId: data.userId,
  //       });
  //       localStorage.setItem('token', data.token);
  //       localStorage.setItem('userId', data.userId);
  //       const remainingMilliseconds = 60 * 60 * 1000; ///3600 segundos, 1 hora.
  //       const expiryDate = new Date(
  //         new Date().getTime() + remainingMilliseconds
  //       );
  //       localStorage.setItem('expiryDate', expiryDate.toISOString());
  //       this.setAutoLogout(remainingMilliseconds);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       this.setState({
  //         isAuth: false,
  //         authLoading: false,
  //         error: err,
  //       });
  //     });
  // };








  loginHandler = async (event, authData) => {



    try {

    
    event.preventDefault();
    this.setState({ authLoading: true });
  //  const loginResult = await fetch(
  //     'http://localhost:8080/auth/login',

  //     {
  //       body: JSON.stringify({
  //         email: authData.email,
  //         password: authData.password,
  //       }),
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       method: 'POST',
  //       ///EIS O CÓDIGO EM QUESTÃO.
  //     }
  //   );
  const graphqlQuery = {
        //sempre será esta estrutura..
    query:  //quando tratamos de umA QUERY PURA, sem 'mutation' ou 'subscription', PODEMOS OMITIR AQUELE 'query' em 'query: `query {}` ' --> colocamos só o OBJETO SOLTO, no caso....
    ///aqui TAMBÉM VAMOS USAR 'VARIABLES GRAPHQL'...
    ` 
       query LoginUserOperation ($email: String!, $password: String!)  {
      loginUser(
        email: $email
        password: $password
     ) {
          token
          userId
        }
    }
    `,

    variables: {
      email: authData.email,
      password: authData.password
    }
  }




//   const graphqlQuery = { ////estrutura CLÁSSICA, sem o uso dos 'GRAPHQL VARIABLES', como os de cima...
//     //sempre será esta estrutura..
// query:  //quando tratamos de umA QUERY PURA, sem 'mutation' ou 'subscription', PODEMOS OMITIR AQUELE 'query' em 'query: `query {}` ' --> colocamos só o OBJETO SOLTO, no caso....
// ///aqui TAMBÉM VAMOS USAR 'VARIABLES GRAPHQL'...
// ` 
//    {
//   loginUser(
//     email: "${authData.email}" 
//     password: "${authData.password}"
//  ) {
//       token
//       userId
//     }
// }
// `,
// }
















  const loginResult = await fetch(
    'http://localhost:8080/graphql',

    {
      body: JSON.stringify(graphqlQuery),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      ///EIS O CÓDIGO EM QUESTÃO.
    }
  );


  const manipulatedLoginResult = await loginResult.json();

  console.log(manipulatedLoginResult)

  // console.log(manipulatedLoginResult);

        if (manipulatedLoginResult.errors && manipulatedLoginResult.errors[0].status) {
          throw new Error('Validation failed. Please make sure that the email has not been used before, and that the inputted data is valid.');
        }

        if (manipulatedLoginResult.errors) {
          throw new Error('Could not log you in!');
        }

  

        // const decryptedResult = await loginResult.json();
        // return res.json();
      // })
      // .then((data) => {
        // console.log(loginResult);

        this.setState({
          isAuth: true,
          // token: decryptedResult.token,
          token: manipulatedLoginResult.data.loginUser.token,
          userId: manipulatedLoginResult.data.loginUser._id,
          authLoading: false,
          // userId: decryptedResult.userId,
        });
        // localStorage.setItem('token', decryptedResult.token);
        // localStorage.setItem('userId', decryptedResult.userId);
        localStorage.setItem('token', manipulatedLoginResult.data.loginUser.token);
        localStorage.setItem('userId', manipulatedLoginResult.data.loginUser.userId);
        const remainingMilliseconds = 60 * 60 * 1000; ///3600 segundos, 1 hora.
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem('expiryDate', expiryDate.toISOString());
        this.setAutoLogout(remainingMilliseconds);
      // })
    } catch(err) {
      console.log(err);
      this.setState({
        isAuth: false,
        authLoading: false,
        error: err,
      });
    }
      // .catch((err) => {

      // });
  };

















  // signupHandler = (event, authData) => { ///CÓDIGO SEM ASYNC/AWAIT...
  //   event.preventDefault();
  //   this.setState({ authLoading: true });
  //   // fetch('URL')
  //   fetch('http://localhost:8080/auth/signup', {
  //     method: 'PUT',
  //     body: JSON.stringify({
  //       name: authData.name,
  //       email: authData.email,
  //       password: authData.password,
  //       confirmPassword: authData.confirmPassword,
  //     }),
  //     headers: {
  //       'Content-Type': 'application/json', ///ESQUECI DE COLOCAR, MAS É ESSENCIAL.
  //     },
  //   })
  //     .then((res) => {
  //       if (res.status === 422) {
  //         throw new Error(
  //           'Validation failed. Make sure the email address is unused.'
  //         );
  //       }

  //       if (res.status !== 200 && res.status !== 201) {
  //         throw new Error('Creating a user failed!');
  //       }

  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //       this.setState({
  //         isAuth: false,
  //         authLoading: false,
  //       });
  //       this.props.history.replace('/'); ///routing prop....
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       this.setState({
  //         isAuth: false,
  //         authLoading: false,
  //         error: err,
  //       });
  //     });
  // };




  // signupHandler = async (event, authData) => { ///versão REST API/restful, ou APLICATIVO CLÁSSICO NODEEXPRESS...

  //   try {

    
  //   event.preventDefault();
  //   this.setState({ authLoading: true });
  //   // fetch('URL')
  //   const fetchedResponse = await fetch('http://localhost:8080/auth/signup', {
  //     method: 'PUT',
  //     body: JSON.stringify({
  //       name: authData.name,
  //       email: authData.email,
  //       password: authData.password,
  //       confirmPassword: authData.confirmPassword,
  //     }),
  //     headers: {
  //       'Content-Type': 'application/json', ///ESQUECI DE COLOCAR, MAS É ESSENCIAL.
  //     },
  //   })
  //     // .then((res) => {
  //       if (fetchedResponse.status === 422) {
  //         throw new Error(
  //           'Validation failed. Make sure the email address is unused.'
  //         );
  //       }

  //       if (fetchedResponse.status !== 200 && fetchedResponse.status !== 201) {
  //         throw new Error('Creating a user failed!');
  //       }

  //       // return res.json();
  //     // })
  //     // .then((data) => {
  //       console.log(fetchedResponse);
  //       this.setState({
  //         isAuth: false,
  //         authLoading: false,
  //       });
  //       this.props.history.replace('/'); ///routing prop....
  //     // })
  //   } catch (err) {
  //     // .catch((err) => {
  //       console.log(err);
  //       this.setState({
  //         isAuth: false,
  //         authLoading: false,
  //         error: err,

  //       })
  //     }
  //   }
  //       // });
  //     // });



      signupHandler = async (event, authData) => { ///versão GRAPHQL do SEND DE REQUESTS a nosso backend.... (endpoint único, method de tipo POST, e inserção de 'GRAPHICAL QUERY' no body do request... são características do graphql no backend....).

        try {
    
        
        event.preventDefault();
        this.setState({ authLoading: true });
        // fetch('URL')
        // const fetchedResponse = await fetch('http://localhost:8080/auth/signup', {


        console.log(authData.email, authData.password, authData.name);
          const graphqlQuery = { ///será INSERIDA NO NOSSO BODY...


              query: `
              mutation CreateUserOperation {
                createUser(userInput: {email: $email, name: $name, password: $password}) {
                  _id
                  email
                }
              }
              `,

              variables: {
                email: authData.email,
                password: authData.password,
                name: authData.name
              }
          }





        //   const graphqlQuery = { ///será INSERIDA NO NOSSO BODY... --> versão clássica, SEM __ AS 'GRAPHQL VARIABLES'...


        //     query: `
        //     mutation {
        //       createUser(userInput: {email: "${
        //         authData.email
        //       }", name:"${authData.name}", password:"${
        //     authData.password
        //   }"}) {
        //         _id
        //         email
        //       }
        //     }
        //     `
        // }











          const fetchedResponse = await fetch('http://localhost:8080/graphql', {
          // method: 'PUT',
          method: 'POST',
          // body: JSON.stringify({
          //   name: authData.name,
          //   email: authData.email,
          //   password: authData.password,
          //   confirmPassword: authData.confirmPassword,
          // }),
          body: JSON.stringify(graphqlQuery), //ainda vamos ter que STRINGIFAR nosso body com a query... (Exatamente como fazíamos/fazemos na REST API/app clássico nodeexpress...)


          headers: {
            'Content-Type': 'application/json', ///ESQUECI DE COLOCAR, MAS É ESSENCIAL. -->ESSE HEADER TAMBÉM É USADO NA VERSÃO 'GRAPHQL' DE backends...
          },
        })


        console.log(fetchedResponse);

            // if (fetchedResponse.status === 422) {
            //   throw new Error(
            //     'Validation failed. Make sure the email address is unused.'
            //   );
            // }
    
            // if (fetchedResponse.status !== 200 && fetchedResponse.status !== 201) {
            //   throw new Error('Creating a user failed!');
            // }


          const manipulatedFetchedResponse = await fetchedResponse.json();


          console.log(manipulatedFetchedResponse);

          if(manipulatedFetchedResponse.errors && manipulatedFetchedResponse[0].status === 422) { ///ERROR HANDLING DO 'GRAPHQL'...
            throw new Error("Validation failed. Make sure the email address is unused!");
      }


      if (manipulatedFetchedResponse.errors) { ///ERROR HANDLING DO GRAPHQL....
        throw new Error('User creation failed.');
      }


      console.log(manipulatedFetchedResponse);
            this.setState({
              isAuth: false,
              authLoading: false,
            });
            this.props.history.replace('/'); ///routing prop....
          // })
        } catch (err) {
          // .catch((err) => {
            console.log(err);
            this.setState({
              isAuth: false,
              authLoading: false,
              error: err,
    
            })
          }
        }

















  setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      this.logoutHandler();
    }, milliseconds);
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  render() {
    let routes = (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => (
            <LoginPage
              {...props} //usado para OBTER OS 'ROUTING-RELATED PROPS'... (para fzer coisas como REDIRECTS...)
              onLogin={this.loginHandler}
              loading={this.state.authLoading}
            />
          )}
        />
        <Route
          path="/signup"
          exact
          render={(props) => (
            <SignupPage
              {...props}
              onLogin={this.signupHandler}
              loading={this.state.authLoading}
            />
          )}
        />
        <Redirect to="/" />
      </Switch>
    );

    if (this.state.isAuth) {
      routes = (
        <Switch>
          <Route
            path="/"
            exact
            render={(props) => (
              <FeedPage userId={this.state.userId} 
              
              token={this.state.token} //prop extremamente importante, usado no método de 'loadPosts()'...
               />
            )}
          />
          <Route
            path="/:postId"
            render={(props) => (
              <SinglePostPage
                {...props}
                userId={this.state.userId}
                token={this.state.token}
              />
            )}
          />
          <Redirect to="/" />
        </Switch>
      );
    }

    return (
      <Fragment>
        {this.state.showBackdrop && (
          <Backdrop onClick={this.backdropClickHandler} />
        )}
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <Layout
          header={
            <Toolbar>
              <MainNavigation
                onOpenMobileNav={this.mobileNavHandler.bind(this, true)}
                onLogout={this.logoutHandler}
                isAuth={this.state.isAuth}
              />
            </Toolbar>
          }
          mobileNav={
            <MobileNavigation
              open={this.state.showMobileNav}
              mobile
              onChooseItem={this.mobileNavHandler.bind(this, false)}
              onLogout={this.logoutHandler}
              isAuth={this.state.isAuth}
            />
          }
        />
        {routes}
      </Fragment>
    );
  }
}

export default withRouter(App);
