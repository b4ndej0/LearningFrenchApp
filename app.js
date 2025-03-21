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

function displayConjugationQuestion() {
  const question = questions[currentQuestionIndex];

  // Vérifier si l'infinitif et le sujet existent pour éviter les erreurs
  const verbInfinitive = question.infinitive ? `<strong>Verbe : ${question.infinitive}</strong><br>` : "";
  const subject = question.subject ? `<strong>${question.subject}</strong>` : "";

  // Afficher le verbe en infinitif + la phrase avec le sujet
  document.getElementById("question").innerHTML = `${verbInfinitive}${subject} ${question.question}`;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = `
    <input type="text" id="userAnswer" placeholder="Écris la conjugaison">
    <button onclick="checkConjugationAnswer()">Valider</button>
  `;

  document.getElementById("feedback").textContent = "";
}

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

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    setTimeout(displayConjugationQuestion, 2000);
  } else {
    setTimeout(showResults, 2000);
  }
}

function showResults() {
  document.getElementById("practice").innerHTML = `
    <h2>Pratique Terminée</h2>
    <p>Ton score : ${score}/${questions.length}</p>
    <button onclick="location.reload()">Retour au Menu</button>
  `;
}
