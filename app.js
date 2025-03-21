// Fonction pour retourner au menu principal
function returnToMenu() {
  document.getElementById("practice").style.display = "none";
  document.getElementById("main-menu").style.display = "block";
}

// Variables globales
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
const QUESTION_DELAY = 2000;

// Fonction pour démarrer la pratique du Passé Composé
async function startPasseComposePractice() {
  try {
    const response = await fetch("data/passe-compose.json");
    const data = await response.json();
    document.getElementById("practice").style.display = "block";
    document.getElementById("main-menu").style.display = "none";
    questions = data.questions.sort(() => 0.5 - Math.random()).slice(0, 5);
    currentQuestionIndex = 0;
    score = 0;
    displayPasseComposeQuestion();
  } catch (error) {
    console.error("Erreur de chargement des questions :", error);
    // Ajouter un retour visuel pour l'utilisateur
    document.getElementById("feedback").textContent = "Erreur de chargement des questions.";
    document.getElementById("feedback").style.color = "red";
  }
}

// Fonction pour afficher une question du Passé Composé avec le verbe en infinitif et le sujet
function displayPasseComposeQuestion() {
  const question = questions[currentQuestionIndex];
  const verbInfinitive = question.infinitive ? `<strong>Verbe : ${question.infinitive}</strong>` : "";
  const subject = question.subject ? `<strong>${question.subject}</strong>` : "";
  document.getElementById("question").innerHTML = `${verbInfinitive}<br>${subject} ${question.question}`;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = `
    <input type="text" id="userAnswer" placeholder="Écris la conjugaison">
    <button onclick="checkPasseComposeAnswer()">Valider</button>
  `;
  document.getElementById("feedback").textContent = "";
}

// Vérifier la réponse de l'utilisateur pour le Passé Composé
function checkPasseComposeAnswer() {
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
  // Effacer la réponse de l'utilisateur
  document.getElementById("userAnswer").value = "";
  nextPasseComposeQuestion();
}

// Passer à la question suivante
function nextPasseComposeQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    setTimeout(displayPasseComposeQuestion, QUESTION_DELAY);
  } else {
    setTimeout(showResults, QUESTION_DELAY);
  }
}
