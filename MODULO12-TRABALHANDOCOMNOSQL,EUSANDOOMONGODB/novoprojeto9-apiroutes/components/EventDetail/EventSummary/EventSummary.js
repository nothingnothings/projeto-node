
import EventSummaryStyle from './EventSummary.module.css';



const EventSummary = (props) => {
    const {title} = props;





    return (
        <section className={EventSummaryStyle.Summary}>
            <h1>{title}</h1>
        </section>
    )
}



export default EventSummary;