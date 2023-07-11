






export const getData = () => {
   return fetch(
        'https://reactnexteventstest205010-default-rtdb.firebaseio.com/events.json'
      )
        .then((response) => {
          // console.log(response);
    
          return response.json();
        })
        .then((data) => {
          const events = [];
          for (const key in data) {
            events.push({
              id: key,
              image: data[key].image,
              description: data[key].description,
              location: data[key].location,
              title: data[key].title,
              date: data[key].date,
              isFeatured: data[key].isFeatured,
            });
          }
          return events;
        })
}