import React from 'react';

import './Toolbar.css';

const toolbar = (props) => {
  return <div className="toolbar">{props.children}</div>;
};

export default toolbar;
