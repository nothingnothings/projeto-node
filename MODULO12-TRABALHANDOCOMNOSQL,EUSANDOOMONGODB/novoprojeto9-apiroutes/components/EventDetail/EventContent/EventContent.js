import EventContentStyle from './EventContent.module.css';






const EventContent = (props) => {
    return (
        <section className={EventContentStyle.Content} >
            {props.children}
        </section>
    )
}




export default EventContent;