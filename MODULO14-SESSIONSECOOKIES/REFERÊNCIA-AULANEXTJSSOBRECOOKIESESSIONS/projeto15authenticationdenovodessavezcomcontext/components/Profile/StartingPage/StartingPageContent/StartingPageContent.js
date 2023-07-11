import StartingPageStyle from './StartingPageContent.module.css';

const StartingPageContent = () => {
  ////SHOW LINK TO LOGIN PAGE IF NOT AUTH

  return (
    <section className={StartingPageStyle.Starting}>
      <h1>Welcome on Board!</h1>
    </section>
  );
};

export default StartingPageContent;
