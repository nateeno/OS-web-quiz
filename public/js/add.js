import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  getDoc,
  doc,
  getDocs,
  collection, 
  addDoc,
  orderBy,
  query, 
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

// CODE FOR add.html 
var optionsCount = 1;

document.getElementById('add-option').addEventListener('click', function() {
    optionsCount++;
    var optionsContainer = document.getElementById('options-container');
    var optionDiv = document.createElement('div');
    optionDiv.classList.add('option');
    optionDiv.innerHTML = `
        <label for="option-${optionsCount}">Option ${optionsCount}:</label><br>
        <input type="text" id="option-${optionsCount}" name="option-${optionsCount}"><br>
        <input type="checkbox" id="correct-${optionsCount}" name="correct-${optionsCount}">
        <label for="correct-${optionsCount}">Correct answer</label><br>
    `;
    optionsContainer.appendChild(optionDiv);
});

document.getElementById('question-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var question = document.getElementById('question').value;
    var options = [];
    var correct = [];
    for (var i = 1; i <= optionsCount; i++) {
        var option = document.getElementById(`option-${i}`).value;
        options.push(option);
        var isCorrect = document.getElementById(`correct-${i}`).checked;
        correct.push(isCorrect);
    }
    
    const data = {
        question: question,
        options: options,
        correct: correct
    };

    clearForm();

    addNewDoc(data);
});




// GENEREL 

async function addNewDoc(data){
    const docRef = await addDoc(collection(db, 'os'),data);
}

function clearForm() {
    document.getElementById('question').value = '';
    
    // Reset optionsCount 
    optionsCount = 1;
    
    // Clear first option 
    document.getElementById(`option-1`).value = '';
    document.getElementById(`correct-1`).checked = false;
    
    // Get the options container
    var optionsContainer = document.getElementById('options-container');
    
    // Get all option divs
    var optionDivs = optionsContainer.getElementsByClassName('option');
    
    // Remove all option divs except the first one
    while(optionDivs.length > 1) {
        optionsContainer.removeChild(optionDivs[1]);
    }
}