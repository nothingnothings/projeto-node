
import Button from '../UI/Button/Button';



import ResultsTitleStyle from './ResultsTitle.module.css';








const ResultsTitle = (props) => { //ISO Dates (Year and Month)
                                    //ISO dates can be written without specifying the day (YYYY-MM):
    



    
     const { titleDate } = props;





    //  const humanReadableDate = new Date(date).toLocaleDateString('en-US', {
    //     month: 'long',
    //     year: 'numeric'
    // })

        // console.log(humanReadableDate)



    




        



    // console.log(humanReadableDate);


    return (
        <section className={ResultsTitleStyle.Title}>
            <h1>Events in {titleDate}</h1>
            <Button returnToAllEventsButton>Show all events</Button>
        </section>
    )
}



export default ResultsTitle;