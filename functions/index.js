'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');

const WELCOME_INTENT = 'input.welcome';

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions


const questionList = [
    {question: "Brown", answer: ["Rhode Island", "Providence"]},
    {question: "Drexel", answer: ["Pennsylvania", "Philadelphia"]},
    {question: "Duke", answer: ["North Carolina", "Durham"]},
    {question: "Gonzaga", answer: ["Washington", "Spokane"]},
    {question: "Rice", answer: ["Texas", "Houston"]},
    {question: "Navy", answer: ["Maryland", "Annapolis"]},
    {question: "Hampton", answer: ["Virginia", "Hampton"]},
    {question: "Emory", answer: ["Georgia", "Atlanta"]},
    {question: "Columbia", answer: ["New York","New York City", "NYC"]},
    {question: "Smith", answer: ["Massachusetts", "Northampton"]}
];



exports.flashCards = functions.https.onRequest((request, response) => {
    // response.send("Hello from Mandy!");
    console.log('hey its flashcards');

    const app = new App({request, response});

    function welcomeIntent(app) {
        app.data = {
            questionList : questionList,
            correctCount : 0,
            wrongCount : 0,
            wrongList : []
        };
        app.ask('Welcome to Flash Cards. For each card, I will say the name of a U.S. college or university, and you tell me which state the college  is in. You can say practice to practice all the cards, or say quiz to take a quiz');
    }


    // function getRandomQuestion

    let actionMap = new Map();
    actionMap.set(WELCOME_INTENT, welcomeIntent);
    app.handleRequest(actionMap);

});