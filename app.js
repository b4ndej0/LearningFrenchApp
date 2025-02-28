let currentTopic;
let questions;
let currentQuestionIndex = 0;
let score = 0;
let currentSentence = ""; // Store sentence for repeat function

// Function to start grammar practice
function startPractice(topic) {
  fetch(`data/${topic}.json`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('practice').style.display = 'block';
      document.getElementById('main-menu').style.display = 'none';
      questions = data.questions;
      currentQuestionIndex = 0;
      score = 0;
      displayQuestion();
    })
    .catch(error => console.error("Error loading questions:", error));
}

// Function to display grammar questions
function displayQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById('question').textContent = `Question ${currentQuestionIndex + 1}/${questions.length}: ${question.question}`;
  
  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';
  question.options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.onclick = () => checkAnswer(option);
    optionsDiv.appendChild(button);
  });

  document.getElementById('feedback').textContent = '';
}

// Function to check grammar question answer
function checkAnswer(selected) {
  const question = questions[currentQuestionIndex];
  const feedback = document.getElementById('feedback');

  if (selected === question.answer) {
    score++;
    feedback.textContent = `Correct! ${question.explanation}`;
    feedback.style.color = 'green';
  } else {
    feedback.textContent = `Incorrect. The correct answer is '${question.answer}'. ${question.explanation}`;
    feedback.style.color = 'red';
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    setTimeout(displayQuestion, 2000);
  } else {
    setTimeout(showResults, 2000);
  }
}

// Function to start dictation practice
function startDictationPractice() {
  fetch("data/dictation.json")
    .then(response => response.json())
    .then(data => {
      questions = data.questions;
      currentQuestionIndex = 0;
      score = 0;
      document.getElementById("practice").style.display = "block";
      document.getElementById("main-menu").style.display = "none";
      displayDictationQuestion();
    })
    .catch(error => console.error("Error loading dictation questions:", error));
}

// Function to display dictation question with repeat button
function displayDictationQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById("question").textContent = "Listen and type what you hear:";
  
  // Store sentence for repeat function
  currentSentence = question.sentence;

  // Speak the sentence
  speakSentence(currentSentence);

  // Show input box and repeat button
  document.getElementById("options").innerHTML = `
    <button onclick="repeatAudio()">🔁 Repeat</button>
    <input type="text" id="userAnswer" placeholder="Type here">
    <button onclick="checkDictationAnswer()">Submit</button>
  `;
}

// Function to repeat the sentence
function repeatAudio() {
  if (currentSentence) {
    speakSentence(currentSentence);
  }
}

// Function to check dictation answer
function checkDictationAnswer() {
  const userAnswer = document.getElementById("userAnswer").value.trim();
  const question = questions[currentQuestionIndex];
  const feedback = document.getElementById("feedback");

  if (userAnswer.toLowerCase() === question.answer.toLowerCase()) {
    score++;
    feedback.textContent = "Correct!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `Incorrect. The correct answer was: "${question.answer}".`;
    feedback.style.color = "red";
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    setTimeout(displayDictationQuestion, 2000);
  } else {
    setTimeout(showResults, 2000);
  }
}

// Function to handle speech synthesis
function speakSentence(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "fr-FR";
  window.speechSynthesis.speak(speech);
}

// Function to show final score
function showResults() {
  document.getElementById("practice").innerHTML = `
    <h2>Practice Complete</h2>
    <p>Your score: ${score}/${questions.length}</p>
    <button onclick="location.reload()">Back to Menu</button>
  `;
}
