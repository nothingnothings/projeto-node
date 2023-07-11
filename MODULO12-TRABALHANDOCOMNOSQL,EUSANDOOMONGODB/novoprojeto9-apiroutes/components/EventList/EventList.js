import { getEventById, getFeaturedEvents } from '../../dummy-data';

import { getAllEvents } from '../../dummy-data';


// import { getFilteredEvents } from '../../dummy-data';


// import { getEventByid } from '../../dummy-data';


import EventListItem from '../EventListItem/EventListItem';

import { useRouter } from 'next/router';


import EventListStyle from './EventList.module.css';



// const EventList = (props) => { ///é minha versão do código (que começou a dar problema por causa do SWITCH STATEMENT...)




//     const router = useRouter();

    
//   let list = null;



//   switch (props.listType) {
//     case 'featured':
//       list = getFeaturedEvents().map((event) => {
//         return (
//             <EventListItem event={event}/>
//         );
//       });
//     case 'all':
//       list = getAllEvents().map((event) => {
//         return (
//         //   <li id={event.id} key={event.id}>
//         //     <div>{event.image}</div>
//         //     <h1>{event.title}</h1>
//         //     <p>{event.description}</p>
//         //     <p>{event.location}</p>
//         //     <p>{event.date}</p>
//         //   </li>

//         <EventListItem event={event}/>
//         );
//       });
//       break;
//     case 'filteredEvents':
//       list = getFilteredEvents(router.query).map((event) => {
//         return (
//           // <li id={event.id} key={event.id}>
//           //   <div>{event.image}</div>
//           //   <h1>{event.title}</h1>
//           //   <p>{event.description}</p>
//           //   <p>{event.location}</p>
//           //   <p>{event.date}</p>
//           // </li>
//           <EventListItem event={event}/>
//         );
//       });
//       break;
//     // case 'eventById':
//     //   // list = getEventById(router.query).map((event) => {
//     //     list = props.event.map((event) => {
//     //     return (
//     //     //   <li id={event.id} key={event.id}>
//     //     //     <div>{event.image}</div>
//     //     //     <h1>{event.title}</h1>
//     //     //     <p>{event.description}</p>
//     //     //     <p>{event.location}</p>
//     //     //     <p>{event.date}</p>
//     //     //   </li>
//     //     <EventListItem event={event}/>
//     //     );
//     //   });



//     case 'eventById':
//       list = (
//         <EventListItem event={props.eventData}/>
//       )

//   }



// console.log(list);



//   return <ul className={EventListStyle.List}>{list}</ul>;
// };




const EventList = (props) => { ///VERSÃO DO PROFESSOR DE NOSSO CÓDIGO....


  const { items } = props;


  console.log(props.items);



  return (
    <ul className={EventListStyle.List}>
      {
        items.map(
          (event) => {
            
            return (
              <EventListItem 
              
              id={event.id} 
              title={event.title} 
              location={event.location} 
              date={event.date} 
              image={event.image}
              key={event.id}
              />
            )
          }
        
        )


      }
    </ul>
  )

}









export default EventList;

