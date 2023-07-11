import React from 'react';

import './Input.css';

const filePicker = (props) => {
  return (
    <div className="input">
      <label htmlFor={props.id}>{props.label}</label>
      <input
        className={[
          !props.valid ? 'invalid' : 'valid',
          props.touched ? 'touched' : 'untouched',
        ].join(' ')}
        type="file"
        id={props.id}
        onChange={(event) => {
          console.log(props.id, 'line', event.target.value, 'line', event.target.files)
          props.onChange(props.id, event.target.value, event.target.files);
        }}
        onBlur={props.onBlur}
      />
    </div>
  );
};

export default filePicker;
