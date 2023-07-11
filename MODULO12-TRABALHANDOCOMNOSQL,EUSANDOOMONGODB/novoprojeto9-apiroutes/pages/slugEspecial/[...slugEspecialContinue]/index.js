// import { useRouter } from 'next/router';
// import { Fragment, useEffect, useState } from 'react';

// import EventList from '../../../components/EventList/EventList';
// import ResultsTitle from '../../../components/ResultsTitle/ResultsTitle';

// import ErrorAlert from '../../../components/UI/ErrorAlert/ErrorAlert';

// import { getFilteredEvents } from '../../../helpers/api-util';

// import Head from 'next/head';

// import useSWR from 'swr';

// import Button from '../../../components/UI/Button/Button';

// const FilteredEventsPage = (props) => {
//   //   const { filteredEvents, year, month } = props;

// //   const { neededEvents } = props;

//   const [allEvents, setAllEvents] = useState();

//   const router = useRouter();

//   const filterData = router.query.slugEspecialContinue;

//   const { data, error } = useSWR(
//     'https://reactnexteventstest205010-default-rtdb.firebaseio.com/events.json'
//   );



//  let pageHeadData = ( ///usado com este '[...slug]' e CLIENTSIDE DATA FETCHING...
//     <Head>
//     <title>{`Events in ${titleDate}`}</title>
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//     <meta name="theme-color" content="#000000" />
//     <meta
//       name="description"
//       content={`A list of filtered events.`}
//     />
//     <meta name="description2" content="EXEMPLO" />
//   </Head>
//   )


//   useEffect(() => {
//     const events = [];
//     for (const key in data) {
//       events.push({
//         id: key,
//         ...data[key],
//       });
//     }

//     setAllEvents(events);
//   }, [data]);



//   if (!data) {
//     return (
//       <Fragment>
//         {pageHeadData}
//     <p>Loading...</p>
//     </Fragment>
    
    
//     )




//   }




//   //ISO Dates (Year and Month)
//   //ISO dates can be written without specifying the day (YYYY-MM):


//     const filteredYear = filterData[0];
//     const filteredMonth = filterData[1];


//     const numYear = +filteredYear;
//     const numMonth = +filteredMonth;


// //   const date = new Date(year, month - 1);


// let pageHeadData = ( ////usado com este '[...slug]'...
//   <Head>
//   <title>{`Events in ${titleDate}`}</title>
//   <meta name="viewport" content="width=device-width, initial-scale=1" />
//   <meta name="theme-color" content="#000000" />
//   <meta
//     name="description"
//     content={`All events in ${titleDate}`}
//   />
//   <meta name="description2" content="EXEMPLO" />
// </Head>
// )





//     if (
//     isNaN(filteredYear) ||
//     isNaN(filteredMonth) ||
//     filteredYear > 2030 ||
//     filteredYear < 2021 ||
//     filteredMonth < 1 ||
//     filteredMonth > 12
//   ) {
//     return  (
//       <Fragment>
//         <ErrorAlert>
//           {pageHeadData}
//           <p>Invalid filter. Please adjust your values!</p>
//         </ErrorAlert>
//           <div className="center">
//               <Button link="/events">Show All Events</Button>
//         </div>
//       </Fragment>
//     )
//   }




//   const filteredEvents = allEvents.filter(
//       (event) => {
//                 const eventDate = new Date(event.date);
//                 return eventDate.getFullYear() === numYear && eventDate.getMonth() === numMonth - 1;
//       }
//   )

//   if (!filteredEvents || filteredEvents.length === 0) {
//     return (
//       <Fragment>
//         <ErrorAlert>
//           {pageHeadData}
//           <p>No events found for the chosen filter!</p>
//         </ErrorAlert>
//         <div className="center">
//           <Button returnToAllEventsButton>Show All Events</Button>
//         </div>
//       </Fragment>
//     );
//   }


//   const date = new Date(numYear, numMonth - 1);

//   return (
//     <div>
//       <Fragment>



// {/* 
//       <Head>
//         <title>{`Events in ${titleDate}`}</title>
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <meta name="theme-color" content="#000000" />
//         <meta
//           name="description"
//           content="Web site created using create-react-app"
//         />
//         <meta name="description2" content="EXEMPLO" />
//       </Head> */}
//       {pageHeadData}
//         <ResultsTitle date={date} />
//         <EventList items={filteredEvents} />
//       </Fragment>
//     </div>
//   );
// };

// export default FilteredEventsPage;



const ExamplePage = () => {
  return (
    <div>

    </div>
  )
}



export default ExamplePage;