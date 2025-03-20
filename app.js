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

// Fonction pour démarrer une session de pratique (grammaire, conjugaison, passé composé)
function startPractice(topic) {
  fetch(`data/${topic}.json`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('practice').style.display = 'block';
      document.getElementById('main-menu').style.display = 'none';

      // Sélectionner 5 questions aléatoires
      questions = data.questions.sort(() => 0.5 - Math.random()).slice(0, 5);
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

  // Si la question demande une saisie utilisateur (passé composé, conjugaison), affiche un champ de texte
  if (!question.options) {
    optionsDiv.innerHTML = `
      <input type="text" id="userAnswer" placeholder="Écris ta réponse">
      <button onclick="checkTextAnswer()">Valider</button>
    `;
  } else {
    // Sinon, affiche les boutons de choix multiple
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
    setTimeout(displayQuestion, 2000);
  } else {
    setTimeout(showResults, 2000);
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

// Fonction pour démarrer un quiz de vocabulaire
function startVocabularyQuiz(topic) {
  document.getElementById("vocabulary").style.display = "none";
  document.getElementById("practice").style.display = "block";

  fetch(`data/${topic}.json`)
    .then(response => response.json())
    .then(data => {
      const selectedWords = data.words.sort(() => 0.5 - Math.random()).slice(0, 5);
      questions = selectedWords.map(word => ({
        question: `Que signifie "${word.french}" en anglais ?`,
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
    .catch(error => console.error("Erreur de chargement du quiz de vocabulaire :", error));
}

// Fonction pour démarrer la conjugaison du futur
function startConjugationPractice() {
  fetch("data/conjugation-future.json")
    .then(response => response.json())
    .then(data => {
      document.getElementById("practice").style.display = "block";
      document.getElementById("main-menu").style.display = "none";

      // Sélectionner 5 questions aléatoires
      questions = data.questions.sort(() => 0.5 - Math.random()).slice(0, 5);
      currentQuestionIndex = 0;
      score = 0;
      displayConjugationQuestion();
    })
    .catch(error => console.error("Erreur de chargement des questions :", error));
}

// Afficher une question de conjugaison (avec saisie)
function displayConjugationQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById("question").textContent = question.question;

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

// Fonction pour récupérer une réponse incorrecte
function getRandomIncorrectAnswer(correctAnswer) {
  const allEnglishWords = vocabularyWords.map(word => word.english);
  let incorrect;
  do {
    incorrect = allEnglishWords[Math.floor(Math.random() * allEnglishWords.length)];
  } while (incorrect === correctAnswer);
  return incorrect;
}

// Fonction pour lire un mot en français
function playAudio(word) {
  const speech = new SpeechSynthesisUtterance(word);
  speech.lang = "fr-FR";
  window.speechSynthesis.speak(speech);
}
