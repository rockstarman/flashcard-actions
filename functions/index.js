'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');

const WELCOME_INTENT = 'input.welcome';

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.flashCards = functions.https.onRequest((request, response) => {
    // response.send("Hello from Mandy!");
    console.log('hey its flashcards');

    const app = new App({request, response});

    function welcomeIntent(app) {
        app.tell('hey your first actions on google');
    }

    let actionMap = new Map();
    actionMap.set(WELCOME_INTENT, welcomeIntent);
    app.handleRequest(actionMap);

});
