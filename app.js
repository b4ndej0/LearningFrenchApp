// Fonction pour démarrer la pratique du Passé Composé
function startPasseComposePractice() {
  fetch("data/passe-compose.json")
    .then(response => response.json())
    .then(data => {
      document.getElementById("practice").style.display = "block";
      document.getElementById("main-menu").style.display = "none";

      // Sélectionner 5 questions aléatoires
      questions = data.questions.sort(() => 0.5 - Math.random()).slice(0, 5);
      currentQuestionIndex = 0;
      score = 0;
      displayPasseComposeQuestion();
    })
    .catch(error => console.error("Erreur de chargement des questions :", error));
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

  nextPasseComposeQuestion();
}

// Passer à la question suivante
function nextPasseComposeQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    setTimeout(displayPasseComposeQuestion, 2000);
  } else {
    setTimeout(showResults, 2000);
  }
}
