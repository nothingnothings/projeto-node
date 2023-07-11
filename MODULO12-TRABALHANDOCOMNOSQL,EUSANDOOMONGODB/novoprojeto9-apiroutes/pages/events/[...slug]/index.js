import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';

import EventList from '../../../components/EventList/EventList';
import ResultsTitle from '../../../components/ResultsTitle/ResultsTitle';

import ErrorAlert from '../../../components/UI/ErrorAlert/ErrorAlert';
import Head from 'next/head';

import { getFilteredEvents } from '../../../helpers/api-util';

// import { getFilteredEvents } from '../../../dummy-data';

import Button from '../../../components/UI/Button/Button';
// import { getData } from '../../../getData';

const FilteredEventsPage = (props) => {
  const { filteredEvents, year, month } = props;


  //ISO Dates (Year and Month)
  //ISO dates can be written without specifying the day (YYYY-MM):







  const date = new Date(year, month - 1);







  const titleDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
})



const pageHeadData = (
  <Head>
  <title>{`Events in ${titleDate}`}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta
    name="description"
    content="Web site created using create-react-app"
  />
  <meta name="description2" content="EXEMPLO" />
</Head>
)




  if (props.hasError) {
    return (
      <Fragment>
        <ErrorAlert>
          {pageHeadData}
          <p>Invalid filter, please adjust your values!</p>
        </ErrorAlert>
        <div className="center">
          <Button returnToAllEventsButton>Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        <ErrorAlert>
          {pageHeadData}
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className="center">
          <Button returnToAllEventsButton>Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  return (//em 'Head', observamos um EXEMPLO DE 'ADD DE CONTEÚDO DINÂMICO AO CONTEÚDO DE UM HEAD DE NOSSA PÁGINA'...
    <div>
      <Fragment>


      {/* <Head>
        <title>{`Events in ${titleDate}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <meta name="description2" content="EXEMPLO" />
      </Head> */}
      {pageHeadData}
        <ResultsTitle titleDate={titleDate} />
        <EventList items={filteredEvents} />
      </Fragment>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { params } = context;

  // const [month, year] = params.slug;

  const dateFilter = params.slug;

  const filteredYear = dateFilter[1];

  const filteredMonth = dateFilter[0];

  console.log(params, 'LINE');

  const neededEventData = await getFilteredEvents(dateFilter);

  if (
    isNaN(filteredYear) ||
    isNaN(filteredMonth) ||
    filteredYear > 2030 ||
    filteredYear < 2021 ||
    filteredMonth < 1 ||
    filteredMonth > 12
  ) {
    // return { //é uma opção, mostrar uma página de error 404 nessas hipóteses aí... CONTUDO, VAMOS UTILIZAR O OUTRO APPROACH, APPROACH DE RETORNAR UM 'prop' de 'hasError: true' E ENTÃO RENDERIZAR CONDICIONALMENTE conteúdo jsx a partir do status desse prop....
    //   notFound: true
    // }

    return {
      props: {
        hasError: true,
      },
    };
  }

  return {
    props: {
      filteredEvents: neededEventData,
      year: filteredYear,
      month: filteredMonth,
    },
  };
}

export default FilteredEventsPage;
