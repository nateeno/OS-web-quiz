console.log("Run: add.js");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

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

const storage = getStorage(app);

// CODE FOR add.html 
var optionsCount = 1;

document.getElementById('add-option').addEventListener('click', function () {
    optionsCount++;
    var optionsContainer = document.getElementById('options-container');
    var optionDiv = document.createElement('div');
    optionDiv.classList.add('option');
    optionDiv.innerHTML = `
        <label for="option-${optionsCount}">Svar alternativ ${optionsCount}:</label><br>
        <input type="text" id="option-${optionsCount}" name="option-${optionsCount}"><br>
        <input type="checkbox" id="correct-${optionsCount}" name="correct-${optionsCount}">
        <label for="correct-${optionsCount}">Er dette alternative riktig?</label><br>
    `;
    optionsContainer.appendChild(optionDiv);
});

document.getElementById('question-form').addEventListener('submit', async function (e) {
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

    // Get the file from the file input
    var file = document.getElementById('image').files[0];

    // Check if a file was selected
    if (file) {
        // Create a storage ref
        var storageRef = ref(storage, 'os/' + file.name);

        // Upload file
        var uploadTask = uploadBytesResumable(storageRef, file);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                // Handle unsuccessful uploads
                console.error('Upload failed:', error);
            },
            () => {
                // Handle successful uploads on complete
                // Get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);

                    // Add the download URL to the data
                    data.image = downloadURL;

                    // Clear the form
                    clearForm();

                    // Retrieve the selected database name
                    var dbSelection = document.getElementById('db-selection').value;

                    // Pass the selected database name to the addNewDoc function
                    addNewDoc(data, dbSelection);
                });
            }
        );
    } else {
        // If no file was selected, just clear the form and add the new document
        clearForm();

        // Retrieve the selected database name
        var dbSelection = document.getElementById('db-selection').value;

        // Pass the selected database name to the addNewDoc function
        addNewDoc(data, dbSelection);
    }
});

// GENEREL 

async function addNewDoc(data, dbName) {
    const docRef = await addDoc(collection(db, dbName), data);
}

function clearForm() {
    document.getElementById('question').value = '';

    // Reset optionsCount 
    optionsCount = 1;

    // Clear first option 
    document.getElementById(`option-1`).value = '';
    document.getElementById(`correct-1`).checked = false;

    // Clear file input
    document.getElementById('image').value = '';

    // Get the options container
    var optionsContainer = document.getElementById('options-container');

    // Get all option divs
    var optionDivs = optionsContainer.getElementsByClassName('option');

    // Remove all option divs except the first one
    while (optionDivs.length > 1) {
        optionsContainer.removeChild(optionDivs[1]);
    }
}

async function deleteQuestionById(id) {
    const collectionName = 'os'                     // <- HUSK Å BYTT
    await deleteDoc(doc(db, collectionName, id));
    console.log("Removed: " + id + " from " + collectionName)
}

// deleteQuestionById('ID');
