

// import ButtonStyle from './Button.module.css';


import Link from 'next/link';


// const Button = (props) => {
//         return (
//             <button className={ButtonStyle.Button}>{props.children}</button>
//         )
// }



// export default Button;






import ButtonStyle from './Button.module.css';



const Button = (props) => {
    // return (
    //     <Link className={ButtonStyle.Button}  //ESTA VERSÃO DE DEFINIÇÃO DE 'ESTILOS DE BUTTON' _NÃO FUNCIONA___ (a definição de um 'estilo de button' diretamente em um component 'Link' __NÃO FUNCIONA__.... devemos seguir o approach de baixo, com a ANCHOR TAG...)
    //href={
    //         {
    //             pathname: '/events/[eventId]',
    //             query: { eventId: props.eventId}
    //         }
    //     }>{props.children}</Link>
    // )



    const { formButton, returnToAllEventsButton } = props;





    if(formButton) {
        return (
            <button className={ButtonStyle.Button} onClick={props.clicked}>{props.children}</button>
        )
    }
            


    if(returnToAllEventsButton) {
        return (
            <Link 
            href= "/events">
            <a className={ButtonStyle.Button}>
                {props.children}
                
                </a> 
                </Link>
        )
    }





        return (
            <Link 
            href={
                {
                    pathname: '/events/[eventId]',
                    query: { eventId: props.eventId}
                }
            }>
            <a className={ButtonStyle.Button}>
                {props.children}
                
                </a> 
                </Link>
        )

    




}




export default Button;