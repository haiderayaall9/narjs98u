// ===================== إعداد الأسئلة =====================
const questions = document.querySelectorAll('.card');
let currentQuestion = 0;

// عرض السؤال الحالي فقط
function showQuestion(index) {
    questions.forEach((q, i) => {
        q.classList.toggle('active', i === index);
    });
}
showQuestion(currentQuestion);

// ===================== التنقل بين الأسئلة =====================
function nextQuestion() {
    const currentInputs = document.querySelectorAll(`input[name="q${currentQuestion + 1}"]`);
    const answeredCurrent = Array.from(currentInputs).some(input => input.checked);

    if (!answeredCurrent) {
        showAlert("يرجى اختيار إجابة قبل الانتقال للسؤال التالي!");
        return; // يمنع الانتقال
    }

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
}

// ===================== تنبيه مخصص =====================
function showAlert(message) {
    const alertBox = document.getElementById("customAlert");
    document.getElementById("customAlertText").textContent = message;
    alertBox.style.display = "block";
}

function closeAlert() {
    document.getElementById("customAlert").style.display = "none";
}

// ===================== الإعدادات للتقييم =====================
const totalQuestions = 20;

const evaluation = {
    "1_نعم": "مرتفع","2_نعم": "متوسط","3_نعم": "متوسط","4_نعم": "مرتفع","5_نعم": "متوسط",
    "6_نعم": "مرتفع","7_نعم": "مرتفع","8_نعم": "مرتفع","9_نعم": "مرتفع","10_نعم": "مرتفع",
    "11_نعم": "مرتفع","12_نعم": "مرتفع","13_نعم": "مرتفع","14_نعم": "متوسط","15_نعم": "مرتفع",
    "16_نعم": "منخفض","17_نعم": "مرتفع","18_نعم": "مرتفع","19_نعم": "مرتفع","20_نعم": "مرتفع",

    "1_لا": "منخفض","2_لا": "منخفض","3_لا": "منخفض","4_لا": "منخفض","5_لا": "منخفض",
    "6_لا": "منخفض","7_لا": "منخفض","8_لا": "منخفض","9_لا": "منخفض","10_لا": "منخفض",
    "11_لا": "منخفض","12_لا": "منخفض","13_لا": "منخفض","14_لا": "منخفض","15_لا": "منخفض",
    "16_لا": "متوسط","17_لا": "منخفض","18_لا": "منخفض","19_لا": "منخفض","20_لا": "منخفض",
};

let answered = new Set();

// ===================== تحديث progress bar =====================
document.querySelectorAll("input[type=radio]").forEach(radio => {
    radio.addEventListener("change", () => {
        answered.add(radio.name);
        document.getElementById("progressBar").style.width =
            (answered.size / totalQuestions) * 100 + "%";

        // إذا تم الإجابة على السؤال الأخير (السؤال 20)
        if (radio.name === `q${totalQuestions}`) {
            showAlert("لقد تم الإجابة على جميع الأسئلة! يمكنك الآن النزول للأسفل لعرض النتيجة.");
            
            // تمرير المستخدم لمكان النتيجة
            const resultDiv = document.getElementById("result");
            resultDiv.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// ===================== حساب النتيجة =====================
function calculateResult() {

    if (answered.size < totalQuestions) {
        alert("يرجى الإجابة على جميع الأسئلة قبل عرض النتيجة!");
        return;
    }

    let counts = { "منخفض": 0, "متوسط": 0, "مرتفع": 0 };
    let detailedResults = [];

    for (let i = 1; i <= totalQuestions; i++) {
        let ans = document.querySelector(`input[name="q${i}"]:checked`);
        let key = `${i}_${ans.value}`;
        let level = evaluation[key];
        counts[level]++;

        let bg =
            level === "منخفض" ? "#27ae60" :
            level === "متوسط" ? "#f39c12" :
            "#e74c3c";

        detailedResults.push(`
            <div class="question-box" style="background:${bg}">
                <i class="fa-solid fa-check-circle"></i>
                السؤال ${i}: ${level}
            </div>
        `);
    }

    // النتيجة النهائية
    let finalLevel = Object.keys(counts)
        .reduce((a, b) => counts[a] > counts[b] ? a : b);

    let color, icon, title;
    if (finalLevel === "منخفض") {
        color = "#27ae60";
        icon = "fa-face-smile";
        title = "حالة نفسية مستقرة";
    } else if (finalLevel === "متوسط") {
        color = "#f39c12";
        icon = "fa-face-meh";
        title = "ضغط نفسي متوسط";
    } else {
        color = "#e74c3c";
        icon = "fa-face-tired";
        title = "ضغط نفسي مرتفع";
    }

    let resultDiv = document.getElementById("result");

    resultDiv.innerHTML = `
        <div class="result-card">
            <div class="result-header" style="background:${color}">
                <i class="fa-solid ${icon}" style="font-size:60px"></i>
                <h2>${title}</h2>
                <h3>مستوى الضغط: ${finalLevel}</h3>
            </div>

            <div class="result-details">
                <h3 style="text-align:center;color:#333;">
                    النتائج التفصيلية
                </h3>
                <div style="max-height:300px;overflow:auto;">
                    ${detailedResults.join("")}
                </div>
            </div>
        </div>
    `;

    // زر النصائح
    let tipsPage =
        finalLevel === "منخفض" ? "tips.html" :
        finalLevel === "متوسط" ? "tipss.html" :
        "tipsss.html";

    document.getElementById("tipsButtonContainer").innerHTML = `
        <button onclick="goToTips('${tipsPage}')"
        style="
            background:${color};
            color:white;
            border:none;
            padding:12px 25px;
            font-size:18px;
            border-radius:8px;
            cursor:pointer;
            display:block;
            margin:20px auto;">
            <i class="fa-solid fa-lightbulb"></i>
            عرض النصائح المناسبة
        </button>
    `;
}

// ===================== الانتقال لصفحة النصائح =====================
function goToTips(page) {
    window.location.href = page;
}