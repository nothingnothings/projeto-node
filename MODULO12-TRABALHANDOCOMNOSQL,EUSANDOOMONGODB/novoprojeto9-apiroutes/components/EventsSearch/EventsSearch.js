import Button from '../UI/Button/Button';

import { useState } from 'react';

import EventsSearchStyle from './EventsSearch.module.css';
// import { useRouter } from 'next/router';

import { useRef } from 'react';

const EventsSearch = (props) => {
  // const router = useRouter();

  const yearRef = useRef();

  const monthRef = useRef();

  const eventDateSubmitHandler = (event) => {
    ////adicionar lógica aqui....
    event.preventDefault();

    const enteredYear = yearRef.current.value;
    const enteredMonth = monthRef.current.value;
    // console.log(router);

    // console.log(`${router.route}/${enteredMonth}/${enteredYear}`);

    // const pushPath = `${router.route}/${enteredMonth}/${enteredYear}`;

    // router.push(pushPath);


    props.onSearch(enteredYear, enteredMonth);
  };

  return (
    <form className={EventsSearchStyle.Form}>
      <div className={EventsSearchStyle.Controls}>
        <div className={EventsSearchStyle.Control}>
          <label htmlFor="year">Year</label>
          <select id="year" ref={yearRef}>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
          </select>
        </div>
        <div className={EventsSearchStyle.Control}>
          <label htmlFor="month">Month</label>
          <select id="month" ref={monthRef}>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
      </div>
      <Button formButton clicked={eventDateSubmitHandler}>
        Find Events
      </Button>
    </form>
  );
};

export default EventsSearch;
