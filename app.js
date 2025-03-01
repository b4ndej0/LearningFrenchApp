let currentTopic;
let questions;
let currentQuestionIndex = 0;
let score = 0;
let vocabularyWords = [];
let dictationSentences = [
  { sentence: "Je vais à l'école demain.", answer: "Je vais à l'école demain." },
  { sentence: "Il fait beau aujourd'hui.", answer: "Il fait beau aujourd'hui." },
  { sentence: "Nous allons en vacances en été.", answer: "Nous allons en vacances en été." },
  { sentence: "J'aime beaucoup les fraises.", answer: "J'aime beaucoup les fraises." },
  { sentence: "Le chat dort sous la table.", answer: "Le chat dort sous la table." }
];

// Function to start Dictation Practice
function startDictationPractice() {
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("dictation").style.display = "block";

  // Select a random dictation sentence
  currentQuestionIndex = Math.floor(Math.random() * dictationSentences.length);
}

// Function to play dictation sentence
function playDictation() {
  let sentence = dictationSentences[currentQuestionIndex].sentence;
  let speech = new SpeechSynthesisUtterance(sentence);
  speech.lang = "fr-FR";
  window.speechSynthesis.speak(speech);
}

// Function to check dictation answer
function checkDictationAnswer() {
  let userAnswer = document.getElementById("dictationAnswer").value.trim();
  let correctAnswer = dictationSentences[currentQuestionIndex].answer;
  let feedback = document.getElementById("dictationFeedback");

  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    feedback.textContent = "Correct!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `Incorrect. The correct sentence was: "${correctAnswer}"`;
    feedback.style.color = "red";
  }
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
