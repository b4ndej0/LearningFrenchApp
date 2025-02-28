let currentTopic;
let questions;
let currentQuestionIndex = 0;
let score = 0;
let vocabularyWords = [];

// Function to start Vocabulary (Vegetables)
function startVocabulary() {
  fetch("data/vocabulary-vegetables.json")
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
      <p>${word.french} - ${word.english} <button onclick="playAudio('${word.french}')">🔊 Listen</button></p>
    `;
    wordListDiv.appendChild(wordEntry);
  });
}

// Function to play the pronunciation of a word
function playAudio(word) {
  const speech = new SpeechSynthesisUtterance(word);
  speech.lang = "fr-FR";
  window.speechSynthesis.speak(speech);
}

// Function to start the vocabulary quiz (random 5 words)
function startVocabularyQuiz() {
  document.getElementById("vocabulary").style.display = "none";
  document.getElementById("practice").style.display = "block";

  // Select 5 random words
  const selectedWords = vocabularyWords.sort(() => 0.5 - Math.random()).slice(0, 5);
  questions = selectedWords.map(word => ({
    question: `What is the English meaning of "${word.french}"?`,
    answer: word.english,
    options: shuffleArray([
      word.english,
      getRandomIncorrectAnswer(word.english),
      getRandomIncorrectAnswer(word.english)
    ])
  }));
  currentQuestionIndex = 0;
  score = 0;
  displayQuestion();
}

// Function to display a quiz question
function displayQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById("question").textContent = question.question;
  
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  question.options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () => checkAnswer(option);
    optionsDiv.appendChild(button);
  });

  document.getElementById("feedback").textContent = "";
}

// Function to check the quiz answer
function checkAnswer(selected) {
  const question = questions[currentQuestionIndex];
  const feedback = document.getElementById("feedback");

  if (selected === question.answer) {
    score++;
    feedback.textContent = "Correct!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `Incorrect. The correct answer is "${question.answer}".`;
    feedback.style.color = "red";
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    setTimeout(displayQuestion, 2000);
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

// Function to shuffle array elements
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Function to get a random incorrect answer
function getRandomIncorrectAnswer(correctAnswer) {
  const allEnglishWords = vocabularyWords.map(word => word.english);
  let incorrect;
  do {
    incorrect = allEnglishWords[Math.floor(Math.random() * allEnglishWords.length)];
  } while (incorrect === correctAnswer);
  return incorrect;
}
