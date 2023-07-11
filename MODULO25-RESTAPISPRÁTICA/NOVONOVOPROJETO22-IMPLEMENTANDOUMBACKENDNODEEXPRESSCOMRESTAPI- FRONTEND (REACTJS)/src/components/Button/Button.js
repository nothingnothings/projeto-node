import React from 'react';

import { Link } from 'react-router-dom';

import './button2.css';

const button2 = (props) => {
  return !props.link ? (
    <button
      className={[
        'button2',
        `button2--${props.design}`,
        `button2--${props.mode}`,
      ].join(' ')}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
      type={props.type}
    >
      {props.loading ? 'Loading...' : props.children}
    </button>
  ) : (
    <Link
      className={[
        'button2',
        `button2--${props.design}`,
        `button2--${props.mode}`,
      ].join(' ')}
      to={props.link}
    >
      {props.children}
    </Link>
  );
};



export default button2;