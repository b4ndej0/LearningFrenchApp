let currentTopic;
let questions;
let currentQuestionIndex = 0;
let score = 0;
let vocabularyWords = [];

// Function to start Vocabulary (Any Category)
function startVocabulary(topic) {
  fetch(`data/${topic}.json`)
    .then(response => response.json())
    .then(data => {
      document.getElementById("vocabulary").style.display = "block";
      document.getElementById("main-menu").style.display = "none";
      vocabularyWords = data.words;
      displayVocabularyList();
    })
    .catch(error => console.error("Error loading vocabulary:", error));
}

// Function to display the vocabulary list with audio buttons
function displayVocabularyList() {
  const wordListDiv = document.getElementById("word-list");
  wordListDiv.innerHTML = "";
  
  vocabularyWords.forEach(word => {
    const wordEntry = document.createElement("div");
    wordEntry.innerHTML = `
      <p>${word.french} - ${word.english} 
        <button class="audio-button" onclick="playAudio('${word.french}')">🔊</button>
      </p>
    `;
    wordListDiv.appendChild(wordEntry);
  });
}

// Function to play pronunciation of a word
function playAudio(word) {
  const speech = new SpeechSynthesisUtterance(word);
  speech.lang = "fr-FR";
  window.speechSynthesis.speak(speech);
}

// Function to start Future Conjugation Practice
function startConjugationPractice() {
  fetch("data/conjugation-future.json")
    .then(response => response.json())
    .then(data => {
      document.getElementById("practice").style.display = "block";
      document.getElementById("main-menu").style.display = "none";

      // Select 5 random exercises per session
      questions = data.questions.sort(() => 0.5 - Math.random()).slice(0, 5);
      currentQuestionIndex = 0;
      score = 0;
      displayConjugationQuestion();
    })
    .catch(error => console.error("Error loading conjugation questions:", error));
}

// Function to display conjugation question
function displayConjugationQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById("infinitive").textContent = `Infinitive: ${question.infinitive}`;
  document.getElementById("question").textContent = question.sentence.replace("___", "...");

  document.getElementById("options").innerHTML = `
    <input type="text" id="userAnswer" placeholder="Type your answer">
    <button onclick="checkConjugationAnswer()">Submit</button>
  `;
}

// Function to check conjugation answer
function checkConjugationAnswer() {
  const userAnswer = document.getElementById("userAnswer").value.trim().toLowerCase();
  const question = questions[currentQuestionIndex];
  const feedback = document.getElementById("feedback");

  if (userAnswer === question.answer.toLowerCase()) {
    score++;
    feedback.textContent = "Correct!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `Incorrect. The correct answer was: "${question.answer}".`;
    feedback.style.color = "red";
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    setTimeout(displayConjugationQuestion, 2000);
  } else {
    setTimeout(showResults, 2000);
  }
}

// Function to show final score
function showResults() {
  document.getElementById("practice").innerHTML = `
    <h2>Practice Complete</h2>
    <p>Your score: ${score}/${questions.length}</p>
    <button onclick="location.reload()">Back to Menu</button>
  `;
}
