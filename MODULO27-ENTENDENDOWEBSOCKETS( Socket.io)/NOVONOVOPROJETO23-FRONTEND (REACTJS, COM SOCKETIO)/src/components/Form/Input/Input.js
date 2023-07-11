import React from 'react';

import './Input.css';

const input = (props) => {
  return (<div className="input">
    {props.label && <label htmlFor={props.id}>{props.label}</label>}
    {props.control === 'input' && (
      <input
        className={[
          !props.valid ? 'invalid' : 'valid',
          props.touched ? 'touched' : 'untouched',
        ].join(' ')}
        type={props.type}
        id={props.id}
        required={props.required}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(event) => {
          return props.onChange(props.id, event.target.value, event.target.files);
        }}
        onBlur={props.onBlur}
      />
    )}
    {props.control === 'textarea' && (
      <textarea
        className={[
          !props.valid ? 'invalid' : 'valid',
          props.touched ? 'touched' : 'untouched',
        ].join(' ')}
        id={props.id}
        rows={props.rows}
        required={props.required}
        value={props.value}
        onChange={(event) => {
          props.onChange(props.id, event.target.value, event.target.files);
        }}
        onBlur={props.onBlur}
      />
    )}
  </div>
  )
};

export default input;
