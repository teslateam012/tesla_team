const questionInput = document.getElementById("questionInput");
const opt1 = document.getElementById("opt1");
const opt2 = document.getElementById("opt2");
const opt3 = document.getElementById("opt3");
const opt4 = document.getElementById("opt4");
const questionsList = document.getElementById("questionsList");

let questions = JSON.parse(localStorage.getItem("questions")) || [];

function displayQuestions() {
  questionsList.innerHTML = "";
  questions.forEach((q, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${q.question}</strong><br>
      <ul>
        ${q.options.map(opt => `<li>${opt}${opt === q.correct ? " ✅" : ""}</li>`).join("")}
      </ul>
      <button onclick="deleteQuestion(${index})">حذف</button>
    `;
    questionsList.appendChild(li);
  });
}

function addQuestion() {
  const question = questionInput.value.trim();
  const o1 = opt1.value.trim();
  const o2 = opt2.value.trim();
  const o3 = opt3.value.trim();
  const o4 = opt4.value.trim();

  if (!question || !o1 || !o2 || !o3 || !o4) {
    alert("يرجى تعبئة جميع الحقول!");
    return;
  }

  const newQuestion = {
    question,
    options: shuffleArray([o1, o2, o3, o4]),
    correct: o4
  };

  questions.push(newQuestion);
  localStorage.setItem("questions", JSON.stringify(questions));

  questionInput.value = opt1.value = opt2.value = opt3.value = opt4.value = "";
  displayQuestions();
}

function deleteQuestion(index) {
  if (confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
    questions.splice(index, 1);
    localStorage.setItem("questions", JSON.stringify(questions));
    displayQuestions();
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

displayQuestions();
