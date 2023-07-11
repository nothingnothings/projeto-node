import NewsletterRegistrationStyle from './NewsletterRegistration.module.css';

import { useRef } from 'react';

import { useState } from 'react';

const NewsletterRegistration = () => {
  //   const [isInvalid, setIsInvalid] = useState(false);
  const inputRef = useRef();

  const registrationHandler = (event) => {
    event.preventDefault();
    const inputData = inputRef.current.value;

    console.log(inputData);

    if (!inputData || inputData.trim() === '' || !inputData.includes('@')) {
      alert('Invalid email entered. Please provide a valid email address');
    } else {
      fetch('/api/newsletter-signup', {
        method: 'POST',
        body: JSON.stringify(inputData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          res.json();
        })
        .then((data) => {
          console.log(data);
        });
    }

    // fetch user input (state or refs)
    // optional: validate input ////fiz + ou -...
    // send valid data to API
  };

  return (
    <section className={NewsletterRegistrationStyle.Newsletter}>
      <h2>Sign up to stay updated!</h2>
      <form onSubmit={registrationHandler}>
        <div className={NewsletterRegistrationStyle.Control}>
          <input
            type="email"
            id="email"
            placeholder="Your email"
            aria-label="Your email"
            ref={inputRef}
          />
          <button onClick={registrationHandler}>Register</button>
        </div>
      </form>
    </section>
  );
};

export default NewsletterRegistration;
