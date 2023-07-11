export const required = (value) => value.trim() !== '';

export const length = (config) => {
  return (value) => {
    let isValid = true;
    if (config.min) {
      isValid = isValid && value.trim().length >= config.min;
    }
    if (config.max) {
      isValid = isValid && value.trim().length <= config.max;
    }
    return isValid;
  };
};

export const isLetter = (value) => {
  let isValid = true;
  if (!value.match(/^[A-Za-z]+$/)) {
    console.log('INVALID');
    isValid = false;
  } else {
    console.log('TEST');
    return isValid;
  }
};

export const isEqualToPassword = (value, originalPassword) => {
  let isValid = true;
  if (value !== originalPassword) {
    console.log('INVALID');
    isValid = false;
  } else {
    console.log('TEST');
    return isValid;
  }
};

export const email = (value) => {
  return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    value
  );
};
