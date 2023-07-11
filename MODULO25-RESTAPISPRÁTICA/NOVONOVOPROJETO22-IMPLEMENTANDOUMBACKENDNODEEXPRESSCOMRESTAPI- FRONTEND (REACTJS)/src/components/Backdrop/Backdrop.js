import React from 'react';

import ReactDOM from 'react-dom';

import './Backdrop.css';

const backdrop = (props) => {
  return ReactDOM.createPortal( ///eu me lembro disto.
    <div
      className={['backdrop', props.open ? 'open' : ''].join(' ')}
      onClick={props.onClick}
    />,
    document.getElementById('backdrop-root') ////e disto... (ver arquivo de 'index.html', sua estrutura......)
  );
};


export default backdrop;