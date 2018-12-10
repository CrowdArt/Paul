
'use strict';

const functions = require('firebase-functions');
const {google} = require('googleapis');
const {WebhookClient} = require('dialogflow-fulfillment').v2beta1;

// Enter your calendar ID and service account JSON below.
const calendarId = 'ia19jshbhuoe614mqch1n6kj60@group.calendar.google.com'; // Example: 6ujc6j6rgfk02cp02vg6h38cs0@group.calendar.google.com
const serviceAccount = {
    "type": "service_account",
    "project_id": "reactpageagent-1583c",
    "private_key_id": "60d5488530b2d3c0d5aac04c34ed70a5ed4bbeb0",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCwRk3GqMOnt0+R\njVuBud1q39Ab/qdsTCicwSQVY/65ja8gVU4NfN830vYFNJRbceXvd1h7Qmx1HdZe\nVVOvHKAILRop9tNSTAfiR+G3aXmdS5Zc5mwCDTlEEGuoLECk13a78Rx1gz60+m7n\nk6vLzPWMAwUILo306xo5FkofZ3AHVA2i4YD0iw7v3PxkJ5bzo1nk/4CwdoHYpNxo\nW/o/CSE3op9CbBe95nWDxxntlTBsNC0vgZk81aG7Ew/qbvyp09nwCk0LLH7J8pAp\nRALIUDFxqnUFWMqpwhfssCAAm3ahSqM0UOdjXQZ50witwt5vquiNBr8UOo9y2crf\nPMf+KfHvAgMBAAECggEAGXEcOqcTDjrr9hMT+QZNieZh0BiSK5RWbEGIJro3AqsL\ncrw9Nr8mLJV7QscS/pvS1xw/nhK5OrIixZzFJkoYYvW3iAUC/SbSIHvFfUZw8h39\nxszPHACymjtQfoZcki4zCe9D70YRH+fhZ/UtX43mht3MtSCbBpWERGcOLbgtODFQ\n/YgpSp9pb9E0zDjhenn42XlBv2wgZyQ3LwMLXV0S9fzMdDFy+61iUnwAVJH9FLF/\n8NzVGtT17w3G9I2uLveJ35CsjWs8FIeUrLpNZJmIlwbFMKnhwUx2LnI/MOlbnG8o\nQPvCX13kn22Jp9LYg+mqL54wSxT7u+B8lE6t/MaxCQKBgQDmOAY5jpi4WX8/0LYX\nnoKAaFrAPwgT3nYUGEhnzTk53bWUFtZmR2FrnEC8xt0y1GNqQX8/82bDYgQKijmt\nI/p0SEm3rAVEoKikQkfISeGv+8XUuxQTmBDpDCLzuU4Kr1hLLUCac+qeZNfHS5WK\ngxq7u9azCoNoMnoldG3uJTXRuwKBgQDEA8rGR+nWphmgY/tDGuauCW2yfJXQDPLT\nl6evHx6EL71KXYVQivF1MLmFKedV1LGzoO/BrrSXmgwt0+rdPYqQQGEf/ercTyI2\ne5hir9NlU2BifalNIpMFSDIVs+VmYCGUS7Kz9xlPxQeRPXbn+Ly4U0ZniNr9xA/Z\nQCzIYPWzXQKBgQDllUE/7OCIF1g6/5xX+Y8TFv5JcZJQni0K5Rxvx80l09/citnM\nraqNcgltOLQmmH97201XLRhyCDEXgbj63UJK7Dv3mui2A7Gp/R8wsd0Lbv1epCHl\nWGSkw6GnhEg7h5l5futKHAcBZnd5G/tJYm0qgqwdaIKbSptc9rsaHqmJOQKBgBbl\n+oI/VGnm7Yd3JpsoQVqDb3UyaK3tVVCynrwufnoiuZI+apyGHr75+jI8OvIj7r51\nRozxw9cR/+o6n21JCy7e1nnOR+mEtRJ4Tcz5jVCA9PmMhIKmT1aGoJM4eMwE3udc\nEHxFmYdgFQo6i/F9dU5zK/5cVnjetptCi/i8mvdhAoGBAIudo99UoBc0YrD9illP\nkt5XwfgGl7xM5bX3L/twedi8VufscgjSN3fUTfOcTB5GnHSzrzB/WM8jR3IM4Mt6\nOKJzW2vVgokHVMY8JYNdw4jRXkgood/lM0N+4hmTazjmt0SbAkWwuU76A2QpYwep\nZbRR+gDDbR9F6e2po2guZAD1\n-----END PRIVATE KEY-----\n",
    "client_email": "bike-shop-calendar@reactpageagent-1583c.iam.gserviceaccount.com",
    "client_id": "101587033051519950364",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/bike-shop-calendar%40reactpageagent-1583c.iam.gserviceaccount.com"
  }; // The JSON object looks like: { "type": "service_account", ... }

// Set up Google Calendar service account credentials
const serviceAccountAuth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');
process.env.DEBUG = 'dialogflow:*'; // It enables lib debugging statements

const timeZone = 'America/Los_Angeles';  // Change it to your time zone
const timeZoneOffset = '-07:00';         // Change it to your time zone offset

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });

  function makeAppointment (agent) {
    // Use the Dialogflow's date and time parameters to create Javascript Date instances, 'dateTimeStart' and 'dateTimeEnd',
    // which are used to specify the appointment's time.
    const appointmentDuration = 1;// Define the length of the appointment to be one hour.
    const dateTimeStart = convertParametersDate(agent.parameters.date, agent.parameters.time);
    const dateTimeEnd = addHours(dateTimeStart, appointmentDuration);
    const appointmentTimeString = getLocaleTimeString(dateTimeStart);
    const appointmentDateString = getLocaleDateString(dateTimeStart);
    // Check the availability of the time slot and set up an appointment if the time slot is available on the calendar
    return createCalendarEvent(dateTimeStart, dateTimeEnd).then(() => {
      agent.add(`Got it. I have your appointment scheduled on ${appointmentDateString} at ${appointmentTimeString}. See you soon. Good-bye.`);
    }).catch(() => {
      agent.add(`Sorry, we're booked on ${appointmentDateString} at ${appointmentTimeString}. Is there anything else I can do for you?`);
    });
  }

  let intentMap = new Map();
  intentMap.set('Make Appointment', makeAppointment);  // It maps the intent 'Make Appointment' to the function 'makeAppointment()'
  agent.handleRequest(intentMap);
});

function createCalendarEvent (dateTimeStart, dateTimeEnd) {
  return new Promise((resolve, reject) => {
    calendar.events.list({  // List all events in the specified time period
      auth: serviceAccountAuth,
      calendarId: calendarId,
      timeMin: dateTimeStart.toISOString(),
      timeMax: dateTimeEnd.toISOString()
    }, (err, calendarResponse) => {
      // Check if there exists any event on the calendar given the specified the time period
      if (err || calendarResponse.data.items.length > 0) {
        reject(err || new Error('Requested time conflicts with another appointment'));
      } else {
        // Create an event for the requested time period
        calendar.events.insert({ auth: serviceAccountAuth,
          calendarId: calendarId,
          resource: {summary: 'Bike Appointment',
            start: {dateTime: dateTimeStart},
            end: {dateTime: dateTimeEnd}}
        }, (err, event) => {
          err ? reject(err) : resolve(event);
        }
        );
      }
    });
  });
}

// A helper function that receives Dialogflow's 'date' and 'time' parameters and creates a Date instance.
function convertParametersDate(date, time){
  return new Date(Date.parse(date.split('T')[0] + 'T' + time.split('T')[1].split('-')[0] + timeZoneOffset));
}

// A helper function that adds the integer value of 'hoursToAdd' to the Date instance 'dateObj' and returns a new Data instance.
function addHours(dateObj, hoursToAdd){
  return new Date(new Date(dateObj).setHours(dateObj.getHours() + hoursToAdd));
}

// A helper function that converts the Date instance 'dateObj' into a string that represents this time in English.
function getLocaleTimeString(dateObj){
  return dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, timeZone: timeZone });
}

// A helper function that converts the Date instance 'dateObj' into a string that represents this date in English. 
function getLocaleDateString(dateObj){
  return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: timeZone });
}