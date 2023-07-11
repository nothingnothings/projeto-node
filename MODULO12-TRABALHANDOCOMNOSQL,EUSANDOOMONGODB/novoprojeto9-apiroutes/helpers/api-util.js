export async function getAllEvents() {
  const response = await fetch(
    'https://reactnexteventstest205010-default-rtdb.firebaseio.com/events.json'
  );
  const data = await response.json();

  const events = [];

  for (const key in data) {
    events.push({
      id: key,
      ...data[key], /////////ISSO É ÚTIL; PROFESSOR USA O SPREAD OPERATOR PARA RESUMIR TODOS AQUELES CAMPOS DE 'location', 'date', 'title', etc etc...
    });
  }

  return events; ///EIS O CÓDIGO EM QUESTÃO.
}

export async function getFeaturedEvents() {
  const allEvents = await getAllEvents(); /////eis o código em questão.

  return allEvents.filter((event) => event.isFeatured);
}

export async function getFilteredEvents(dateFilter) {

  const allEvents = await getAllEvents();

  let filteredEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === parseInt(dateFilter[1]) &&
      eventDate.getMonth() === parseInt(dateFilter[0]) - 1
    );
  });
  return filteredEvents;
}

export async function getEventById(id) {
  const allEvents = await getAllEvents();
  return allEvents.find((event) => event.id === id);
}
