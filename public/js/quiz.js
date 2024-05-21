console.log("Run: quiz.js");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  getDocs,
  addDoc,
  collection,
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDbgm-9ZvZn6BPyQkt5p-o-GLiR1vJoGXw",
    authDomain: "oslomet-quiz.firebaseapp.com",
    projectId: "oslomet-quiz",
    storageBucket: "oslomet-quiz.appspot.com",
    messagingSenderId: "604545436437",
    appId: "1:604545436437:web:d7240b1af644a6aafef71c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const scoresCollection = collection(db, 'scores');

// Define questions array globally
let questions = [];

// Function to extract collection name from the URL
function getCollectionFromUrl() {
    const url = window.location.href;
    const urlParts = url.split('/');
    const page = urlParts[urlParts.length - 1].split('.')[0];
    return page;
}

// Function to display questions
async function displayQuestions() {
    const collectionName = getCollectionFromUrl();
    console.log(`Running displayQuestions for collection: ${collectionName}`);
  
    const quizContainer = document.getElementById('quiz-container');
  
    // Fetch all the questions from the database and populate the global questions array
    const querySnapshot = await getDocs(collection(db, collectionName));
    questions = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));

    // Randomize the order of questions
    questions.sort(() => Math.random() - 0.5);
  
    // For each question
    questions.forEach((question) => {
        const data = question.data;
        
        // Combine options and correct into an array of objects
        const options = data.options.map((option, index) => ({
            text: option,
            correct: data.correct[index]
        }));
    
        // Randomize the order of options
        options.sort(() => Math.random() - 0.5);
        
        // Create an element for each question
        const questionDiv = document.createElement('div');
        questionDiv.title = `Question ID: ${question.id}`; 
        questionDiv.innerHTML = `
        <h3>${data.question}</h3>
        ${data.image ? `<img src="${data.image}" alt="Question image">` : ''}
        ${options.map((option, index) => `
        <input type="checkbox" id="question-${question.id}-option-${index}" name="question-${question.id}" value="${option.text}" data-correct="${option.correct}">
        <label for="question-${question.id}-option-${index}">${option.text}</label><br>
    `).join('')}
`;
        
        // Add the question to the quiz form
        quizContainer.appendChild(questionDiv);
    });
}

displayQuestions();

// Event listener for quiz submission
document.getElementById('submit-quiz').addEventListener('click', async function() {
    let score = 0;
    let total = 0;
    
    // For each question
    questions.forEach((question) => {
        const data = question.data;
        
        // Initialize correctForThisQuestion as true
        let correctForThisQuestion = true;
        
        // Check each option for each question
        data.options.forEach((option, index) => {
            const checkbox = document.getElementById(`question-${question.id}-option-${index}`);
            const label = document.querySelector(`label[for="question-${question.id}-option-${index}"]`);
            
            // If the user has chosen this option
            if (checkbox.checked) {
                // If the option is incorrect, mark it as incorrect and set correctForThisQuestion to false
                if (checkbox.dataset.correct !== 'true') {
                    correctForThisQuestion = false;
                    label.classList.add('incorrect');
                }
                // If the option is correct, mark it as correct
                else {
                    label.classList.add('correct');
                }
            }
            // If the user has not chosen this option, but it is correct, mark it as correct and set correctForThisQuestion to false
            else if (checkbox.dataset.correct === 'true') {
                correctForThisQuestion = false;
                label.classList.add('correct');
            }
        });
  
        // If the user chose all the correct answers and none of the incorrect answers for this question, increase the score
        if (correctForThisQuestion) {
            score++;
        }
       // Increase the total number of questions
       total++;
    });
    
    // Calculate the percentage of correct answers
    var percentage = Math.round((score / total) * 100);
    
    // Display the score and the percentage
    document.getElementById('results').textContent = `Din score er: ${score} av ${total} som tilsvarer ${percentage}%`;

    await addDoc(scoresCollection, { 
        score: score, 
        total: total, 
        percentage: percentage, 
        collectionName: getCollectionFromUrl()
    });
});