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
const QUESTION_DELAY = 2000;

// Fonction pour retourner au menu principal
function returnToMenu() {
  document.getElementById("practice").style.display = "none";
  document.getElementById("main-menu").style.display = "block";
  document.getElementById("vocabulary").style.display = "none";
  document.getElementById("dictation").style.display = "none";
}

// Fonction pour démarrer une session de pratique (grammaire, conjugaison, passé composé)
function startPractice(topic) {
  fetch(`data/${topic}.json`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('practice').style.display = 'block';
      document.getElementById('main-menu').style.display = 'none';

      // Sélectionner 5 questions aléatoires
      questions = shuffleArray(data.questions).slice(0, 5);
      currentQuestionIndex = 0;
      score = 0;
      displayQuestion();
    })
    .catch(error => console.error("Erreur de chargement des questions :", error));
}

// Fonction pour afficher une question avec un champ de texte si nécessaire
function displayQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById("question").textContent = question.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = ""; // Efface les anciennes réponses

  if (!question.options) {
    optionsDiv.innerHTML = `
      <input type="text" id="userAnswer" placeholder="Écris ta réponse">
      <button onclick="checkTextAnswer()">Valider</button>
    `;
  } else {
    question.options.forEach(option => {
      const button = document.createElement("button");
      button.textContent = option;
      button.onclick = () => checkAnswer(option);
      optionsDiv.appendChild(button);
    });
  }

  document.getElementById("feedback").textContent = "";
}

// Vérifier une réponse écrite par l'utilisateur
function checkTextAnswer() {
  const userAnswer = document.getElementById("userAnswer").value.trim().toLowerCase();
  const question = questions[currentQuestionIndex];
  const feedback = document.getElementById("feedback");

  if (userAnswer === question.answer.toLowerCase()) {
    score++;
    feedback.textContent = "Correct !";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `Incorrect. La bonne réponse était : "${question.answer}".`;
    feedback.style.color = "red";
  }

  nextQuestion();
}

// Vérifier une réponse pour un exercice à choix multiple
function checkAnswer(selected) {
  const question = questions[currentQuestionIndex];
  const feedback = document.getElementById("feedback");

  if (selected === question.answer) {
    score++;
    feedback.textContent = "Correct !";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `Incorrect. La bonne réponse est : "${question.answer}".`;
    feedback.style.color = "red";
  }

  nextQuestion();
}

// Passer à la question suivante ou afficher les résultats
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    setTimeout(displayQuestion, QUESTION_DELAY);
  } else {
    setTimeout(showResults, QUESTION_DELAY);
  }
}

// Afficher les résultats de l'exercice
function showResults() {
  document.getElementById("practice").innerHTML = `
    <h2>Pratique Terminée</h2>
    <p>Ton score : ${score}/${questions.length}</p>
    <button onclick="location.reload()">Retour au Menu</button>
  `;
}

// Fonction pour démarrer la conjugaison du futur
function startConjugationPractice() {
  fetch("data/conjugation-future.json")
    .then(response => response.json())
    .then(data => {
      document.getElementById("practice").style.display = "block";
      document.getElementById("main-menu").style.display = "none";

      // Sélectionner 5 questions aléatoires
      questions = shuffleArray(data.questions).slice(0, 5);
      currentQuestionIndex = 0;
      score = 0;
      displayConjugationQuestion();
    })
    .catch(error => console.error("Erreur de chargement des questions :", error));
}

// Afficher une question de conjugaison avec le verbe en infinitif
function displayConjugationQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById("question").innerHTML = `<strong>Verbe : ${question.infinitive}</strong><br>${question.question}`;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = `
    <input type="text" id="userAnswer" placeholder="Écris la conjugaison">
    <button onclick="checkConjugationAnswer()">Valider</button>
  `;

  document.getElementById("feedback").textContent = "";
}

// Vérifier une réponse en conjugaison
function checkConjugationAnswer() {
  const userAnswer = document.getElementById("userAnswer").value.trim().toLowerCase();
  const question = questions[currentQuestionIndex];
  const feedback = document.getElementById("feedback");

  if (userAnswer === question.answer.toLowerCase()) {
    score++;
    feedback.textContent = "Correct !";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `Incorrect. La bonne réponse était : "${question.answer}".`;
    feedback.style.color = "red";
  }

  nextQuestion();
}

// Fonction pour mélanger un tableau
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Fonction pour lire un mot en français
function playAudio(word) {
  const speech = new SpeechSynthesisUtterance(word);
  speech.lang = "fr-FR";
  window.speechSynthesis.speak(speech);
}

// Fonction pour démarrer la pratique de la dictée
function startDictationPractice() {
  document.getElementById("dictation").style.display = "block";
  document.getElementById("main-menu").style.display = "none";
  currentQuestionIndex = 0;
  score = 0;
  displayDictationQuestion();
}

// Afficher une phrase de dictée
function displayDictationQuestion() {
  const sentence = dictationSentences[currentQuestionIndex];
  document.getElementById("dictationFeedback").textContent = "";
}

// Vérifier la réponse de la dictée
function checkDictationAnswer() {
  const userAnswer = document.getElementById("dictationAnswer").value.trim();
  const sentence = dictationSentences[currentQuestionIndex];
  const feedback = document.getElementById("dictationFeedback");

  if (userAnswer === sentence.answer) {
    score++;
    feedback.textContent = "Correct !";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `Incorrect. La bonne réponse était : "${sentence.answer}".`;
    feedback.style.color = "red";
  }

  nextDictationQuestion();
}

// Passer à la phrase suivante ou afficher les résultats de la dictée
function nextDictationQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < dictationSentences.length) {
    setTimeout(displayDictationQuestion, QUESTION_DELAY);
  } else {
    setTimeout(showDictationResults, QUESTION_DELAY);
  }
}

// Afficher les résultats de la dictée
function showDictationResults() {
  document.getElementById("dictation").innerHTML = `
    <h2>Dictée Terminée</h2>
    <p>Ton score : ${score}/${dictationSentences.length}</p>
    <button onclick="location.reload()">Retour au Menu</button>
  `;
}

// Fonction pour jouer une phrase de dictée
function playDictation() {
  const sentence = dictationSentences[currentQuestionIndex].sentence;
  playAudio(sentence);
}

// Fonction pour démarrer la pratique du vocabulaire
function startVocabulary(topic) {
  fetch(`data/${topic}.json`)
    .then(response => response.json())
    .then(data => {
      document.getElementById("vocabulary").style.display = "block";
      document.getElementById("main-menu").style.display = "none";
      vocabularyWords = data.words;
      displayVocabularyWords();
    })
    .catch(error => console.error("Erreur de chargement des mots :", error));
}

// Afficher les mots de vocabulaire
function displayVocabularyWords() {
  const wordList = document.getElementById("word-list");
  wordList.innerHTML = "";
  vocabularyWords.forEach(word => {
    const wordItem = document.createElement("div");
    wordItem.textContent = word;
    wordItem.onclick = () => playAudio(word);
    wordList.appendChild(wordItem);
  });
}
