import React from 'react'; //PRESENTATIONAL COMPONENT. Serve para wrappar nossas 'PAGES' de 'LOGIN' e 'SIGNUP', adicionar o style de 'auth-form' a eles...

import './Auth.css';

const auth = (props) => {
        return (<section className="auth-form">{props.children}</section>)
}



export default auth;