// import { useRouter } from 'next/router';
// import { getEventById } from '../../../dummy-data';

import { Fragment, useState } from 'react'; //mesma coisa que 'aux'...

import EventList from '../../../components/EventList/EventList';
import EventSummary from '../../../components/EventDetail/EventSummary/EventSummary';
import EventLogistics from '../../../components/EventDetail/EventLogistics/EventLogistics';
import EventContent from '../../../components/EventDetail/EventContent/EventContent';
import ErrorAlert from '../../../components/UI/ErrorAlert/ErrorAlert';
import Button from '../../../components/UI/Button/Button';

// import { getData } from '../../../getData';

import { getAllEvents } from '../../../helpers/api-util';

import Comments from '../../../components/Input/Comments'

import Head from 'next/head';

import { getEventById } from '../../../helpers/api-util';
import { getFeaturedEvents } from '../../../helpers/api-util';

const EventDetailPage = (props) => {

  const { neededEventData } = props;



  if(!neededEventData) {


    return (
    <div className="center">
    <p>Loading...</p>
    </div>
    )
  }

  return (//em 'Head', observamos um EXEMPLO DE 'ADD DE CONTEÚDO DINÂMICO AO CONTEÚDO DE UM HEAD DE NOSSA PÁGINA'...
    <Fragment>


<Head>
        <title>{neededEventData.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />

<meta
          name="description"
          content={neededEventData.description}
        />
        <meta name="description2" content="EXEMPLO" />
      </Head>
      <EventSummary title={neededEventData.title} />
      <EventLogistics
        date={neededEventData.date}
        address={neededEventData.location}
        image={neededEventData.image}
        imageAlt={neededEventData.title}
      />
      <EventContent>
        <p>{neededEventData.description}</p>
      </EventContent>
      <Comments eventId={neededEventData.id}/>
    </Fragment>
  );
};

export async function getStaticProps(context) {
  const { params } = context;

  const eventId = params.eventId;


  console.log(eventId);

  const eventData = await getEventById(eventId);


  if (!eventData) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      neededEventData: eventData,
    },
    revalidate: 30
  };
}

export async function getStaticPaths(context) {
  const eventData = await getFeaturedEvents();

  const paths = eventData.map((dataObject) => ({
    params: { eventId: dataObject.id.toString() },
  }));

  return {
    paths,
    // fallback: true ///usar quando você quer que o nextjs '''FORCE''' uma página nova quando o usuário digitar bosta no trecho dinâmico da url dessa página...  ///nesse nosso caso, ele vai PROCURAR POR UMA DAS PÁGINAS QUE VOCÊ NÃO ESPECIFICOU COMO 'A SER PRE-RENDERIZADA' anteriormente... (páginas que não estão 'featured', nesse nosso exemplo)....
    // fallback: false, ///usar quando você JÁ ESPECIFICOU TODAS AS PÁGINAS/valores de 'id' POSSÍVEIS NA SUA URL, NESSA DETERMINADA PÁGINA.... --> como aqui já especificamos todas elas por meio de 'paths', deixamos 'fallback: false', o que fará com que SEJA RETORNADA UMA PÁGINA DE ERRO 404 quando o usuário digitar bosta no campo dinâmico da url....
    fallback: true
    //fallback: 'blocking' // fará com que  A PÁGINA __ SÓ SEJA __ EFETIVAMENTE SERVIDA QUANDO __ TODA A 'DATA' __ ESTIVER REALMENTE NO LUGAR... (nada será renderizado até lá, mas você vai RECEBER A PÁGINA COMPLETINHA, SEM PROBLEMAS....)) --> mas vai demorar um pouco mais....
  };
}


export default EventDetailPage;
