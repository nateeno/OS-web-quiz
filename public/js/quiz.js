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
                <input type="checkbox" id="question-${question.id}-option-${index}" name="question-${question.id}" value="${option.text}" data-correct="${option.correct}">
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
        
        var correctForThisQuestion = true;
        
        // Sjekk hvert alternativ for hvert spørsmål
        data.options.forEach((option, index) => {
            const checkbox = document.getElementById(`question-${doc.id}-option-${index}`);
            const label = document.querySelector(`label[for="question-${doc.id}-option-${index}"]`);
            
            // Hvis brukeren har valgt dette alternativet
            if (checkbox.checked) {
                // Hvis alternativet er feil, marker det som feil og sett correctForThisQuestion til false
                if (checkbox.dataset.correct !== 'true') {
                    correctForThisQuestion = false;
                    label.classList.add('incorrect');
                }
                // Hvis alternativet er riktig, marker det som riktig
                else {
                    label.classList.add('correct');
                }
            }
            // Hvis brukeren ikke har valgt dette alternativet, men det er riktig, marker det som riktig og sett correctForThisQuestion til false
            else if (checkbox.dataset.correct === 'true') {
                correctForThisQuestion = false;
                label.classList.add('correct');
            }
        });
  
        // Hvis brukeren valgte alle de riktige svarene og ingen av de gale svarene for dette spørsmålet, øk scoren
        if (correctForThisQuestion) {
            score++;
        }
  
        // Øk det totale antall spørsmål
        total++;
    });
    // Beregn prosentdelen av korrekte svar
    var percentage = Math.round((score / total) * 100);
    
    // Vis scoren og prosentdelen
    document.getElementById('results').textContent = `Din score er: ${score} av ${total} som tilsvarer ${percentage}%`;
  });

/*
GAMMEL: Her er det minus og pluss om hverandre 



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
                if (checkbox.dataset.correct === 'true') {
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
            else if (checkbox.dataset.correct === 'true') {
                label.classList.add('correct');
            }
  
            // Øk det totale antall spørsmål hvis alternativet er korrekt
            if (checkbox.dataset.correct === 'true') {
                total++;
            }
        });
    });
    // Beregn prosentdelen av korrekte svar
    var percentage = Math.round((score / total) * 100);
    
    // Vis scoren og prosentdelen
    document.getElementById('results').textContent = `Din score er: ${score} av ${total} som tilsvarer ${percentage}%`;
  });
*/ 