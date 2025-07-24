let questions = shuffleArray(window.questions).slice(0, 10);

let current = 0;
let score = 0;
let timer;
let countdown = 10;

const warningSound = new Audio("https://www.soundjay.com/button/sounds/beep-07.mp3");

function startQuestion() {
  if (current >= questions.length) {
    showResult();
    return;
  }

  const q = questions[current];
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

    if (countdown === 3) warningSound.play();
    if (countdown <= 3) timerEl.style.color = "red";
    else timerEl.style.color = "#d35400";

    if (countdown === 0) {
      clearInterval(timer);
      current++;
      startQuestion();
    }
  }, 1000);

  document.getElementById("progress").innerText = `السؤال ${current + 1} من ${questions.length}`;
}

function showResult() {
  document.getElementById("questionBox").style.display = "none";
  document.getElementById("optionsBox").style.display = "none";
  document.getElementById("timer").style.display = "none";
  document.getElementById("progress").style.display = "none";

  const quizContainer = document.querySelector(".quiz-container");
  quizContainer.innerHTML = `
    <div class="result-box" style="font-size: 24px; color: #ff7700; text-align: center; margin-top: 40px;">
      انتهت الأسئلة! نتيجتك: ${score} من ${questions.length}
    </div>
  `;

  sendToGoogleSheet(score);

  setTimeout(() => {
    window.location.href = "index.html";
  }, 5000);
}

function sendToGoogleSheet(score) {
  const contestant = JSON.parse(localStorage.getItem('currentContestant'));
  
  if (!contestant) {
    console.error("❌ لم يتم العثور على بيانات المتسابق في localStorage");
    return;
  }

  const webAppURL = "https://script.google.com/macros/s/AKfycbwYGnJbbnZ0vFfHUoT3TIznHqPxkiCK2xH4t0KO0U64OkSbUX1wRybE7idyXQcx7VE/exec";

  console.log("📤 جاري إرسال البيانات إلى Google Sheet...", {
    name: contestant.name,
    phone: contestant.phone,
    universityId: contestant.universityId,
    score: score
  });

  fetch(webAppURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: contestant.name,
      phone: contestant.phone,
      universityId: contestant.universityId,
      score: score
    })
  })
  .then(res => res.text())
  .then(txt => {
    console.log("✅ تم الإرسال إلى Google Sheet:", txt);
  })
  .catch(err => {
    console.error("❌ خطأ أثناء الإرسال إلى Google Sheet:", err);
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

startQuestion();
