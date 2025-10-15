// Retrieve stored Q&A data and overall score from localStorage
const qaData = JSON.parse(localStorage.getItem("interviewQA") || "[]");
const overallScore = localStorage.getItem("interviewScore") || "0";
document.getElementById("overall-score").textContent = overallScore + "/12";

const qaContainer = document.getElementById("qa-container");
qaData.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "bg-gray-700 p-6 rounded-lg";
    div.innerHTML = `
        <h3 class="text-2xl font-bold text-white mb-2">
          Question ${index + 1}: ${item.question}
        </h3>
        <p class="text-gray-300 mb-2">
          Answer: ${item.answer}
        </p>
        <p class="text-gray-300">
          Score: <span class="text-blue-400 font-bold">${item.score}</span>
        </p>
      `;
    qaContainer.appendChild(div);
});

// Download Report Button Event: generate a PDF report using jsPDF
document.getElementById("download-report-button").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("Interview Report", 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.text("Overall Score: " + overallScore + "/12", 14, y);
    y += 10;

    qaData.forEach((item, index) => {
        doc.text("Question " + (index + 1) + ": " + item.question, 14, y);
        y += 7;
        doc.text("Answer: " + item.answer, 14, y);
        y += 7;
        doc.text("Score: " + item.score, 14, y);
        y += 10;
        if (y > 280) {  // add a new page if needed
            doc.addPage();
            y = 20;
        }
    });

    doc.save("Interview_Report.pdf");
});

// Function to reattempt interview: clear Q&A and score then redirect to dashboard
function reattempt() {
    localStorage.removeItem("interviewQA");
    localStorage.removeItem("interviewScore");
    window.location.href = "interview_dash.html";
}

// Logout function: clear logged-in user and redirect to login page
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}