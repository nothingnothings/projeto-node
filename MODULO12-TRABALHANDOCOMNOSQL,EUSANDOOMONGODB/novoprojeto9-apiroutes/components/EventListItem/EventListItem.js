
import EventListItemStyle from './EventListItem.module.css';


// import Link from 'next/link';

import Button from '../UI/Button/Button';

import Image from 'next/image';


import ArrowRight from '../icons/arrow-right-icon';

import DateIcon from '../icons/date-icon';

import AddressIcon from '../icons/address-icon';


const EventListItem = (props) => {





    const { title,image, date, location, id } = props;  ////////////alternativa, OBJECT DESTRUCTURING... ---> se voce usar este destructuring aqui, voce pode substituir todos os ''props.event.xxxx''' ali embaixo por coisas como 'title', 'address', tudo diretamente... (essas constantes do array destructuring vao REPRESENTAR esses códigos de 'props.event.xxxx'...)


        console.log('test', title);


    // const humanReadableDate = new Date(props.event.date).toLocaleDateString('en-US',  {

        const humanReadableDate = new Date(date).toLocaleDateString('en-US',  {
       
            day: 'numeric', /////ISSO NOS DEIXA CONFIGURAR A FORMA COMO QUEREMOS CADA 1 DESSES ESPAÇOS NA NOSSA 'STRING' QUE SERÁ A 'DATE....
        month: 'long',
        year: 'numeric'
    });

    console.log(humanReadableDate);


    console.log(props.event);


    // const formattedLocation = props.event.location.replace(', ', '\n');


    const formattedLocation = location.replace(', ', '\n');



    // const exploreLink = `/events/${id}`;  ///isso é a MESMA COISA QUE O CÓDIGO ALI DE BAIXO QUE FOI USADO COM 'href', mas de uma forma diferente...
            // <Link href={exploreLink}>Explore Event</Link> --> tipo assim....


        // console.log(title);


    return (
    //     <li className={EventListItemStyle.ListItem} id={props.event.id} key={props.event.id}>
    //     <img src={props.event.image} alt="event-image"/>
    //     <h1>{props.event.title}</h1>
    //     <p>{props.event.description}</p>
    //     <p>{props.event.location}</p>
    //     <p>{props.event.date}</p>
    //   </li>


//obs: escreva '{'/' + propsComSuaImagem}', e não '{props.suaImagem}'....


    <li id={id} key={id} className={EventListItemStyle.ListItem}> 
    {/* <img src={'/' + image} alt={title} /> */}
    <Image src={'/' + image} alt={title} width={400} height={400} />
    {/* EXEMPLO DE UTILIZAÇÃO DO COMPONENT DE NEXTJS de 'Image'...  OBS::: HEIGHT E WIDTH TEM SEUS VALORES DEFINIDOS EM __PIXELS__...*/}
    {/* <img src={image} alt="event-image" />    ////////////IMAGE ==== EXEMPLO DO USO DE ARRAY DESTRUCTURING PARA ''RESUMIR'' A ESCRITA DO NOSSO USO DE PROPS NESSE ARQUIVO...*/}
    <div className={EventListItemStyle.Content}>
        <div>
            <h2>{title}</h2>
        <div className={EventListItemStyle.Date}>
            <DateIcon/>
    {/* <time>{props.event.date}</time> */}
    <time>{humanReadableDate}</time>
</div>
<div className={EventListItemStyle.Address}>
{/* <address>{props.event.location}</address> */}
<AddressIcon/>
<address>{formattedLocation}</address>
</div>
<div className={EventListItemStyle.actions}>
    {/* <Link href={
        {
            pathname: '/events/[eventId]',
            query: { eventId: props.event.id}
        }
    }>Explore Event</Link> */}


{/* <Link href={
        {
            pathname: '/events/[eventId]',
            query: { eventId: props.event.id}
        }
    }><Button>Explore Event →</Button></Link> */}


<Button eventId={id}>
    
    
    
    
    <span>Explore Event</span>
    <span className={EventListItemStyle.icon}><ArrowRight/></span>
    
    
    
    </Button>



</div>
</div>
</div>
</li>
    )
}





export default EventListItem;