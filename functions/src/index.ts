import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { fetchMeetupEvents } from './meetupApi';

admin.initializeApp(functions.config().firebase as admin.AppOptions);
const store = admin.firestore();

exports.refreshMeetupEvents = functions.https.onRequest(async (request, response) => {
  try {
    const events = await fetchMeetupEvents();
    console.log(events[0]);
    const promises = events.map(event =>
      store
        .collection('events')
        .doc(event.id)
        .set(event)
    );
    await Promise.all(promises);

    response.send({ success: `Successfully imported ${events.length} events` });
  } catch (ex) {
    console.error(ex);
    response.status(500).send({ name: ex.name, message: ex.message, stack: ex.stack });
  }
});
