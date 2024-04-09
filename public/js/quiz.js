console.log("Run: quiz.js");

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


async function getIdEn() {
  const docID1 = await getDoc(doc(db, 'os', 'en'));
  console.log("Id 1: " + docID1.data().navn);
}
//getIdEn();


async function displayQuestions() {
  console.log("Kjører displayQuestions")
  const quizContainer = document.getElementById('quiz-container');

  // Hent alle spørsmålene fra databasen
  const querySnapshot = await getDocs(collection(db, 'os'));

  // Legg alle spørsmålene i en array
  const questions = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));

  // Randomiser arrayen
  questions.sort(() => Math.random() - 0.5);

  questions.forEach((question) => {
      const data = question.data;
      
      // Kombiner options og correct i en array av objekter
      const options = data.options.map((option, index) => ({
          text: option,
          correct: data.correct[index]
      }));
      
      // Randomiser options arrayen
      options.sort(() => Math.random() - 0.5);
      
      // Opprett et element for hvert spørsmål
      const questionDiv = document.createElement('div');
      questionDiv.innerHTML = `
          <h2>${data.question}</h2>
          ${options.map((option, index) => `
              <input type="checkbox" id="question-${question.id}-option-${index}" name="question-${question.id}" value="${option.text}">
              <label for="question-${question.id}-option-${index}">${option.text}</label><br>
          `).join('')}
      `;
      
      // Legg til spørsmålet til quiz-formen
      quizContainer.appendChild(questionDiv);
  });
}

displayQuestions();

document.getElementById('submit-quiz').addEventListener('click', async function() {
  // Hent alle spørsmålene fra databasen
  const querySnapshot = await getDocs(collection(db, 'os'));
  
  var score = 0;
  var total = 0;
  
  querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Sjekk hvert alternativ for hvert spørsmål
      data.options.forEach((option, index) => {
          const checkbox = document.getElementById(`question-${doc.id}-option-${index}`);
          const label = document.querySelector(`label[for="question-${doc.id}-option-${index}"]`);
          
          // Hvis brukeren har valgt dette alternativet
          if (checkbox.checked) {
              // Hvis alternativet er riktig, øk scoren og marker det som riktig
              if (data.correct[index]) {
                  score++;
                  label.classList.add('correct');
              }
              // Hvis alternativet er feil, reduser scoren og marker det som feil
              else {
                  score--;
                  label.classList.add('incorrect');
              }
          }
          // Hvis brukeren ikke har valgt dette alternativet, men det er riktig, marker det som riktig
          else if (data.correct[index]) {
              label.classList.add('correct');
          }

          // Øk det totale antall spørsmål hvis alternativet er korrekt
          if (data.correct[index]) {
              total++;
          }
      });
  });
  
  // Vis scoren
  document.getElementById('results').textContent = `Your score: ${score} out of ${total}`;
});