'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');

const WELCOME_INTENT = 'input.welcome';
const USER_SELECT_TYPE_INTENT = 'input.selectedType';
const ASK_QUESTIONS_INTENT = 'input.askQuestions';
const TEST_TYPE_ARGUMENT = 'testType';



const questionList = [
    {question: "Brown", answer: ["Rhode Island", "Providence"]},
    {question: "Drexel", answer: ["Pennsylvania", "Philadelphia"]},
    {question: "Duke", answer: ["North Carolina", "Durham"]},
    {question: "Gonzaga", answer: ["Washington", "Spokane"]},
    {question: "Holy Cross", answer: ["Massachusetts", "Worcester"]},
    {question: "Villanova", answer: ["Pennsylvania", "Villanova"]},
    {question: "Hampton", answer: ["Virginia", "Hampton"]},
    {question: "Emory", answer: ["Georgia", "Atlanta"]},
    {question: "Columbia", answer: ["New York"]},
    {question: "Smith", answer: ["Massachusetts", "Northampton"]}
];

exports.flashCards = functions.https.onRequest((request, response) => {
    console.log('hey its flashcards');

    const app = new App({request, response});

    function welcomeIntent(app) {
        app.data = {
            questionList: questionList,
            correctCount: 0,
            wrongCount: 0,
            wrongList: []
        };
        app.ask('Welcome to Flash Cards. For each card, I will say the name of a U.S. college or university, and you tell me which state the college is in.  You can say practice to practice all the cards, or say quiz to take a quiz. say Practice or Quiz');
    }

    function userSelectTypeIntent(app) {
        let userSelectedType = app.getArgument(TEST_TYPE_ARGUMENT);
        if (userSelectedType === 'practice') {
            app.ask('Okay lets practice, i will ask you all ten questions. Answer by saying the name of a U.S State. Are you ready to start?');
        } else {
            app.ask('Okay, I will ask you 5 questions! Answer by saying the name of a U.S State.  Ready to start the quiz?');
        }
    }

    function askQuestionsIntent(app) {
        let testType = app.getArgument(TEST_TYPE_ARGUMENT);
        let output;

        if (testType === 'practice') {
            output = askPracticeQuestions(app);
        } else {
            output = askQuizQuestions(app);
        }
        app.ask(output);
    }


    let actionMap = new Map();
    actionMap.set(WELCOME_INTENT, welcomeIntent);
    actionMap.set(USER_SELECT_TYPE_INTENT, userSelectTypeIntent);
    actionMap.set(ASK_QUESTIONS_INTENT, askQuestionsIntent);
    app.handleRequest(actionMap);

});

function askPracticeQuestions(app) {
    app.data['currentQuestionIndex'] = 0;

    if (app.data['wrongList'].length > 0) {  // we have taken the practice already and need to repeat
        app.data['sessionQuestionList'] = randomizeArray(app.data['wrongList'], 10);  // only practice those answered wrong
        app.data['wrongList'] = [];
        app.data['wrongCount'] = 0;
        app.data['correctCount'] = 0;
    } else {
        app.data['sessionQuestionList'] = randomizeArray(app.data['questionList'], 10);
    }
    let say = 'First question of ' + app.data['sessionQuestionList'].length + ', ';
    say += 'Where is ' + app.data['sessionQuestionList'][0].question + '?';
    return say;
}

function askQuizQuestions(app) {
    let numOfQuestions = 5;

    app.data['currentQuestionIndex'] = 0;
    app.data['wrongCount'] = 0;
    app.data['correctCount'] = 0;

    app.data['sessionQuestionList'] = randomizeArray(app.data['questionList'], numOfQuestions);

    return 'where is ' + app.data['sessionQuestionList'][0].question + '?';
}

function randomizeArray(myArray, recordCount) { // Fisher-Yates shuffle
    var sliceLimit = myArray.length;
    if (recordCount) {
        sliceLimit = recordCount;
    }
    var m = myArray.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = myArray[m];
        myArray[m] = myArray[i];
        myArray[i] = t;
    }
    return myArray.slice(0, sliceLimit);

}

