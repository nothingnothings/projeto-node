import EventList from '../../components/EventList/EventList';
import EventsSearch from '../../components/EventsSearch/EventsSearch';

import useSWR from 'swr';

import { useState, useEffect } from 'react';
import { getAllEvents } from '../../helpers/api-util';
import Head from 'next/head';

import { useRouter } from 'next/router';

const AllEventsPage = (props) => {
  // const { allEventsArray } = props;

  // const [allEvents, setAllEvents] = useState(allEventsArray);

  // const filteredEvents = getFilteredEvents();

  // const { data, error } = useSWR(
  //   'https://reactnexteventstest205010-default-rtdb.firebaseio.com/events.json'
  // );

  // useEffect(() => {
  //   if (data) {
  //     const allEventsArray = [];
  //     console.log(allEventsArray);

  //     for (const key in data) {
  //       allEventsArray.push({
  //         id: key,
  //         image: data[key].image,
  //         description: data[key].description,
  //         location: data[key].location,
  //         title: data[key].title,
  //         date: data[key].date,
  //         isFeatured: data[key].isFeatured,
  //       });
  //     }

  //     setAllEvents(allEventsArray);
  //   }
  // }, [data]);

  const router = useRouter();

  const { allEvents } = props;

  const findEventsHandler = (year, month) => {
    const fullPath = `/events/${month}/${year}`;

    router.push(fullPath);
  };

  // if(error) {
  //     return (
  //         <div>Failed to Load</div>
  //     )
  // }

  // if(!allEvents && !data) {
  //     return (
  //           <div>Loading...</div>
  //     )
  // }

  if (!allEvents) {
    return <div>Loading...</div>;
  }

  return ( //'all Events' --> title --> pequena alteração... (isso é para aparecer na 'TAB' do browser...)
    <div>   

<Head>
        <title>All Events</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <meta name="description2" content="EXEMPLO" />
      </Head>
      <EventsSearch onSearch={findEventsHandler} />
      <EventList items={allEvents} />
    </div>
  );
};

export async function getStaticProps(context) {
  // return fetch(
  //   'https://reactnexteventstest205010-default-rtdb.firebaseio.com/events.json'
  // )
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((data) => {
  //     const allEvents = [];

  //     for (const key in data) {
  //       allEvents.push({
  //         id: key,
  //         image: data[key].image,
  //         description: data[key].description,
  //         location: data[key].location,
  //         title: data[key].title,
  //         date: data[key].date,
  //         isFeatured: data[key].isFeatured,
  //       });
  //     }

  //     if (!data) {
  //       return {
  //         notFound: true,
  //       };
  //     }

  //     return {
  //       props: {
  //         allEventsArray: allEvents,
  //       },
  //       revalidate: 1800, //30 min. Página será 're-generated' a cada 30 minutos, at most...
  //     };
  //   });

  const events = await getAllEvents();

  return {
    props: {
      allEvents: events,
    },
  };
}

export default AllEventsPage;
