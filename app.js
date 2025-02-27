let currentTopic;
let questions;
let currentQuestionIndex = 0;
let score = 0;

function showTopic(topic) {
  document.querySelectorAll('.topic-explanation').forEach(el => el.style.display = 'none');
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById(topic + '-explanation').style.display = 'block';
}

function startPractice(topic) {
  currentTopic = topic;
  fetch('questions.json')
    .then(response => response.json())
    .then(data => {
      questions = data[topic].questions;
      currentQuestionIndex = 0;
      score = 0;
      document.getElementById('practice').style.display = 'block';
      document.querySelectorAll('.topic-explanation').forEach(el => el.style.display = 'none');
      displayQuestion();
    })
    .catch(error => {
      console.error('Error loading questions:', error);
      document.getElementById('practice').innerHTML = '<p>Error loading questions. Please try again later.</p>';
    });
}

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

function checkAnswer(selected) {
  const question = questions[currentQuestionIndex];
  const feedback = document.getElementById('feedback');
  if (selected === question.answer) {
    score++;
    feedback.textContent = `Correct! ${question.explanation}`;
    feedback.style.color = 'green';
  } else {
    feedback.textContent = `Incorrect. ${question.explanation}`;
    feedback.style.color = 'red';
  }
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    setTimeout(displayQuestion, 2000); // Wait 2 seconds before next question
  } else {
    setTimeout(() => {
      document.getElementById('practice').innerHTML = `
        <h2>Practice Complete</h2>
        <p>Your score: ${score}/${questions.length}</p>
        <button onclick="location.reload()">Back to Menu</button>
      `;
    }, 2000);
  }
}