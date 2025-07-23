import questions from './questions.js';

let quizQuestions = shuffleArray(questions).slice(0, 10);

let current = 0;
let score = 0;
let timer;
let countdown = 10;

const warningSound = new Audio("https://www.soundjay.com/button/sounds/beep-07.mp3");

function startQuestion() {
  if (current >= quizQuestions.length) {
    showResult();
    return;
  }

  const q = quizQuestions[current];
  document.getElementById("questionBox").innerText = q.question;

  const optionsBox = document.getElementById("optionsBox");
  optionsBox.innerHTML = "";
  const shuffledOptions = shuffleArray([...q.answers]);

  shuffledOptions.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.className = "option-btn";
    btn.onclick = () => {
      clearInterval(timer);
      if (opt === q.correct) score++;
      current++;
      startQuestion();
    };
    optionsBox.appendChild(btn);
  });

  countdown = 10;
  const timerEl = document.getElementById("timer");
  timerEl.innerText = countdown;
  timerEl.style.color = "#d35400";

  timer = setInterval(() => {
    countdown--;
    timerEl.innerText = countdown;

    if (countdown === 3) {
      warningSound.play();
    }

    if (countdown <= 3) {
      timerEl.style.color = "red";
    } else {
      timerEl.style.color = "#d35400";
    }

    if (countdown === 0) {
      clearInterval(timer);
      current++;
      startQuestion();
    }
  }, 1000);

  document.getElementById("progress").innerText = `السؤال ${current + 1} من ${quizQuestions.length}`;
}

function showResult() {
  document.getElementById("questionBox").style.display = "none";
  document.getElementById("optionsBox").style.display = "none";
  document.getElementById("timer").style.display = "none";
  document.getElementById("progress").style.display = "none";

  const quizContainer = document.querySelector(".quiz-container");
  quizContainer.innerHTML = `<div class="result-box" style="font-size: 24px; color: #ff7700; text-align: center; margin-top: 40px;">
    انتهت الأسئلة! نتيجتك: ${score} من ${quizQuestions.length}
  </div>`;

  let contestantData = JSON.parse(localStorage.getItem('currentContestant'));
  if (contestantData) {
    contestantData.score = score;
    contestantData.time = contestantData.time || new Date().toLocaleString();

    let allParticipants = JSON.parse(localStorage.getItem('contestantResults')) || [];
    const index = allParticipants.findIndex(p => p.name === contestantData.name && p.phone === contestantData.phone);
    if (index !== -1) {
      allParticipants[index] = contestantData;
    } else {
      allParticipants.push(contestantData);
    }
    localStorage.setItem('contestantResults', JSON.stringify(allParticipants));

    fetch("https://script.google.com/macros/s/AKfycbyp4f65IwRjSRcD-1uYpO1ep0ihgEiJkrBGadyOMSYw215aoGPmhDnusFMEb05rqEmYDQ/exec", {
      method: "POST",
      body: JSON.stringify(contestantData),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => console.log("✅ تم الإرسال إلى Google Sheet"))
    .catch(err => console.error("❌ فشل الإرسال إلى Google Sheet", err));
  }

  setTimeout(() => {
    window.location.href = "index.html";
  }, 5000);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

startQuestion();
