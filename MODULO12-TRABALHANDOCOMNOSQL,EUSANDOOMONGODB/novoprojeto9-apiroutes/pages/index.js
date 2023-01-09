// import { useEffect, useState } from 'react';
import EventList from '../components/EventList/EventList';

// import useSWR from 'swr';

// import { getFeaturedEvents } from '../dummy-data';


import NewsletterRegistration from '../components/Input/NewsletterRegistration'
import { getFeaturedEvents } from '../helpers/api-util';

import Head from 'next/head';  ///copiar e colar essa tag de 'Head' em todas as nossas páginas, e então fazer alguns pequenos ajustes NAS PÁGINAS DINÂMICAS (e no 'title' de cada página....)


const StartingPage = (props) => {
  const { featuredEvents } = props;

  return (
    <div>
      <NewsletterRegistration />
      <EventList items={featuredEvents} />
      <Head>
        <title>Starting Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <meta name="description2" content="EXEMPLO" />
      </Head>

    </div>
  );
};

export async function getStaticProps(context) {
  const featuredEventsArray = await getFeaturedEvents();

  return {
    props: {
      featuredEvents: featuredEventsArray,
    },
    revalidate: 10,
  };
}

export default StartingPage;
