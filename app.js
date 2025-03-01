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

// Function to start a grammar practice session (Que vs Qui, Que vs Dont, etc.)
function startPractice(topic) {
  fetch(`data/${topic}.json`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('practice').style.display = 'block';
      document.getElementById('main-menu').style.display = 'none';

      // Select only 5 random questions per session
      questions = data.questions.sort(() => 0.5 - Math.random()).slice(0, 5);
      currentQuestionIndex = 0;
      score = 0;
      displayQuestion();
    })
    .catch(error => console.error("Error loading questions:", error));
}

// Function to start Vocabulary (Any Category)
function startVocabulary(topic) {
  fetch(`data/${topic}.json`)
    .then(response => response.json())
    .then(data => {
      document.getElementById("vocabulary").style.display = "block";
      document.getElementById("main-menu").style.display = "none";
      vocabularyWords = data.words;
      displayVocabularyList(topic);
    })
    .catch(error => console.error("Error loading vocabulary:", error));
}

// Function to display the vocabulary list with audio buttons
function displayVocabularyList(topic) {
  const wordListDiv = document.getElementById("word-list");
  wordListDiv.innerHTML = ""; // Clear previous content

  vocabularyWords.forEach(word => {
    const wordEntry = document.createElement("div");
    wordEntry.classList.add("vocab-item");
    wordEntry.innerHTML = `
      <span>${word.french} - ${word.english}</span>
      <button class="audio-button" onclick="playAudio('${word.french}')">🔊</button>
    `;
    wordListDiv.appendChild(wordEntry);
  });

  // Remove existing Practice button if any
  let existingPracticeButton = document.getElementById("practice-button");
  if (existingPracticeButton) {
    existingPracticeButton.remove();
  }

  // Add the Practice button only once
  const practiceButton = document.createElement("button");
  practiceButton.id = "practice-button";
  practiceButton.textContent = "Practice";
  practiceButton.onclick = function() {
    startVocabularyQuiz(topic);
  };
  wordListDiv.appendChild(practiceButton);
}

// Function to play pronunciation of a word
function playAudio(word) {
  const speech = new SpeechSynthesisUtterance(word);
  speech.lang = "fr-FR";
  window.speechSynthesis.speak(speech);
}

// Function to start the vocabulary quiz
function startVocabularyQuiz(topic) {
  document.getElementById("vocabulary").style.display = "none";
  document.getElementById("practice").style.display = "block";

  fetch(`data/${topic}.json`)
    .then(response => response.json())
    .then(data => {
      const selectedWords = data.words.sort(() => 0.5 - Math.random()).slice(0, 5);
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
    })
    .catch(error => console.error("Error loading vocabulary quiz:", error));
}

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

      // Select only 5 random exercises per session
      questions = data.questions.sort(() => 0.5 - Math.random()).slice(0, 5);
      currentQuestionIndex = 0;
      score = 0;
      displayConjugationQuestion();
    })
    .catch(error => console.error("Error loading conjugation questions:", error));
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
