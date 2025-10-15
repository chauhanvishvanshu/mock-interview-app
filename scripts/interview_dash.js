// Redirect to login page if no user is logged in.
if (!localStorage.getItem('loggedInUser')) {
    window.location.href = 'login.html';
}

// Global variables for interview state
let currentQuestionIndex = 0;
let questions = [];
let score = 0;
let timerDuration = 600; // 10 minutes in seconds
let timerInterval;
let phase = ""; // "auto", "question", "idle", or "completed"
let currentDialogue = null;
const idleVideos = ["videos/idle.webm", "videos/idea.webm", "videos/peace.webm"];
let qaList = []; // Store Q&A data for this session

const avatarVideo = document.getElementById('avatar-video');
const userResponse = document.getElementById('user-response');
const submitAnswerButton = document.getElementById('submit-answer');
const resetTextButton = document.getElementById('reset-text');
const startInterviewButton = document.getElementById('start-interview');
const roleSelect = document.getElementById('role-select');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const toggleMicButton = document.getElementById('toggle-mic-button');


// Speech Recognition Setup for User
let micMuted = false;
let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = function (event) {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + " ";
            }
        }
        if (finalTranscript) {
            // Append recognized text to the answer textarea
            document.getElementById("user-response").value += finalTranscript.trim() + " ";
        }
    };
    recognition.onend = function () {
        console.log("Speech recognition ended.");
    };
}
// Toggle user microphone mute/unmute
toggleMicButton.addEventListener("click", () => {
    micMuted = !micMuted;
    if (micMuted) {
        recognition.stop();
        toggleMicButton.innerHTML = `<i class="fas fa-microphone-slash"></i> <span>Unmute</span>`;
        toggleMicButton.classList.replace("bg-red-600", "bg-green-600");
    } else {
        recognition.start();
        toggleMicButton.innerHTML = `<i class="fas fa-microphone"></i> <span>Mute</span>`;
        toggleMicButton.classList.replace("bg-green-600", "bg-red-600");
    }
});

// Reset Text button clears the answer textarea
resetTextButton.addEventListener("click", () => {
    userResponse.value = "";
});


// Helper: choose a random video from an array of sources
function getRandomVideo(videoArray) {
    const randomIndex = Math.floor(Math.random() * videoArray.length);
    return videoArray[randomIndex];
}

// ------------------------------
// Updated Dialogues with dual text properties
// ------------------------------

// Common Dialogues (first 6)
const commonDialogues = [
    {
        videoSrc: ["videos/1_D.webm", "videos/1_D(1).webm"],
        text: "Hello, and welcome to your AI-powered mock interview!",
        newText: "Hello and welcome to our mock interview session!",
        requiresAnswer: false
    },
    {
        videoSrc: ["videos/2_D.webm", "videos/2_D(1).webm"],
        text: "Before we begin, please state your name.",
        newText: "May I have your name, please?",
        requiresAnswer: true
    },
    {
        videoSrc: ["videos/3_D.webm", "videos/3_D(1).webm"],
        text: "Thank you. Let's get started!",
        newText: "Thanks, Let’s jump right in.",
        requiresAnswer: false
    },
    {
        videoSrc: ["videos/4_D.webm", "videos/4_D(1).webm"],
        text: "Tell me about yourself.",
        newText: "To start, can you share a bit about your background and how you got into your field?",
        requiresAnswer: true
    },
    {
        videoSrc: ["videos/5_D.webm", "videos/5_D(1).webm"],
        text: "Why are you interested in this position?",
        newText: "What are some of the skills you’re most proud of, and why do you enjoy using them?",
        requiresAnswer: true
    },
    {
        videoSrc: ["videos/6_D.webm", "videos/6_D(1).webm"],
        text: "What are your strengths and weaknesses?",
        newText: "When you run into a challenge at work, what’s your first step to find a solution?",
        requiresAnswer: true
    }
];

// Role Dialogues
const roleDialogues = {
    developer: [
        {
            videoSrc: ["videos/10_aD.webm", "videos/10_aD(1).webm"],
            text: "What programming languages are you most comfortable with?",
            newText: "As a Developer, can you tell me about a simple project you worked on that you really enjoyed?",
            requiresAnswer: true
        },
        {
            videoSrc: ["videos/11_aD.webm", "videos/11_aD(1).webm"],
            text: "How do you debug a piece of code that isn't working?",
            newText: "What tools or languages did you use in that project, and how did they help you succeed?",
            requiresAnswer: true
        }
    ],
    marketing: [
        {
            videoSrc: ["videos/10_bD.webm", "videos/10_bD(1).webm"],
            text: "How would you create a campaign for a new product?",
            newText: "As a Marketing professional, could you describe a basic campaign or idea that you were excited about?",
            requiresAnswer: true
        },
        {
            videoSrc: ["videos/11_bD.webm", "videos/11_bD(1).webm"],
            text: "What digital marketing tools do you use?",
            newText: "How did you measure the success of that campaign idea, and what did you learn from it?",
            requiresAnswer: true
        }
    ],
    hr: [
        {
            videoSrc: ["videos/10_cD.webm", "videos/10_cD(1).webm"],
            text: "How do you handle workplace conflicts?",
            newText: "As an HR specialist, can you share a moment when you helped improve communication within a team?",
            requiresAnswer: true
        },
        {
            videoSrc: ["videos/11_cD.webm", "videos/11_cD(1).webm"],
            text: "What is your approach to talent acquisition?",
            newText: "What steps did you take to make sure everyone felt heard and valued during that experience?",
            requiresAnswer: true
        }
    ]
};

// Common Ending Dialogues (7 items)
const commonEndingDialogues = [
    {
        videoSrc: ["videos/7_D.webm", "videos/7_D(1).webm"],
        text: "Where do you see yourself in five years?",
        newText: "Looking ahead, where do you see yourself in the next few years?",
        requiresAnswer: true
    },
    {
        videoSrc: ["videos/8_D.webm", "videos/8_D(1).webm"],
        text: "Why should we hire you?",
        newText: "What makes you feel that you would be a great addition to our team?",
        requiresAnswer: true
    },
    {
        videoSrc: ["videos/9_D.webm", "videos/9_D(1).webm"],
        text: "How do you handle tight deadlines?",
        newText: "What drives you to do your best work every day?",
        requiresAnswer: true
    },
    {
        videoSrc: ["videos/12_D.webm", "videos/12_D(1).webm"],
        text: "Describe a time when you faced challenge at work. How did you handle it?",
        newText: "When things get busy or stressful, how do you keep your cool and stay productive?",
        requiresAnswer: true
    },
    {
        videoSrc: ["videos/13_D.webm", "videos/13_D(1).webm"],
        text: "Do you have any questions for me?",
        newText: "Do you have any questions for me about the role or our company?",
        requiresAnswer: true
    },
    {
        videoSrc: ["videos/14_D.webm", "videos/14_D(1).webm"],
        text: "Tell me about a time you worked in a team. What was your role?",
        newText: "Is there anything else you’d like to share about yourself or your work that we haven’t covered?",
        requiresAnswer: true
    },
    {
        videoSrc: ["videos/15_D.webm", "videos/15_D(1).webm"],
        text: "Thank you for completing this mock interview! I hope this session helped you practice your answers and gain confidence. Keep practicing, and good luck with your real interviews!",
        newText: "Thank you for spending this time with me. Best of luck with your career, and I hope you have a fantastic day ahead!",
        requiresAnswer: false
    }
];

// Timer functions
function startTimer() {
    let timeLeft = timerDuration;
    timerDisplay.textContent = formatTime(timeLeft);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            console.log('Time is up!');
        }
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Function to play a random idle animation (loops during idle phase)
function playIdleAnimation() {
    if (phase === "idle") {
        const randomIndex = Math.floor(Math.random() * idleVideos.length);
        avatarVideo.src = idleVideos[randomIndex];
        avatarVideo.play();
    }
}

// Load and play the next dialogue video (updated)
function playNextQuestion() {
    if (currentQuestionIndex < questions.length) {
        userResponse.value = "";
        currentDialogue = questions[currentQuestionIndex];

        // Stop recognition to prevent capturing avatar audio during playback
        if (recognition) recognition.stop();

        // Randomly select one of the video sources and play it
        const chosenVideo = Array.isArray(currentDialogue.videoSrc)
            ? getRandomVideo(currentDialogue.videoSrc)
            : currentDialogue.videoSrc;
        avatarVideo.src = chosenVideo;
        avatarVideo.play();

        // Set transcript based on chosen video file name (newText if contains "(1)")
        const transcript = chosenVideo.includes("(1)") ? currentDialogue.newText : currentDialogue.text;
        document.getElementById("ai-avatar-transcript").textContent = transcript;

        currentQuestionIndex++;
        phase = currentDialogue.requiresAnswer ? "question" : "auto";
    } else {
        clearInterval(timerInterval);
        phase = "completed";
        localStorage.setItem("interviewQA", JSON.stringify(qaList));
        localStorage.setItem("interviewScore", score);
        setTimeout(() => {
            window.location.href = "results.html";
        }, 2000);
    }
}

// Event when the avatar video ends
avatarVideo.addEventListener('ended', () => {
    if (phase === "auto") {
        if (currentQuestionIndex === 1) { startTimer(); }
        playNextQuestion();
    } else if (phase === "question") {
        phase = "idle";
        playIdleAnimation();
        // Start recognition for user input once the avatar video ends
        if (recognition) recognition.start();
        console.log("Please answer by speaking or typing and then click 'Submit Answer'.");
    } else if (phase === "idle") {
        playIdleAnimation();
    }
});

// Start Interview button event
startInterviewButton.addEventListener('click', () => {
    const selectedRole = roleSelect.value;
    // Combine all dialogues: common, role-specific, and ending dialogues
    questions = [
        ...commonDialogues,
        ...roleDialogues[selectedRole],
        ...commonEndingDialogues
    ];
    currentQuestionIndex = 0;
    score = 0;
    scoreDisplay.textContent = score;
    startInterviewButton.disabled = true;
    roleSelect.disabled = true;
    playNextQuestion();
});

// Submit Answer button event
submitAnswerButton.addEventListener('click', () => {
    if (recognition) recognition.stop();
    const answer = userResponse.value.trim();
    if (answer !== "") {
        score += 1;
        scoreDisplay.textContent = score;
        if (currentDialogue && currentDialogue.requiresAnswer) {
            qaList.push({ question: currentDialogue.text, answer: answer, score: "1/1" });
        }
    }
    avatarVideo.pause();
    phase = "question";
    playNextQuestion();
});

// Logout function for navigation
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}
// Example JavaScript to handle button actions
document.getElementById('start-interview').addEventListener('click', function () {
    // Hide role selection and suggestions; show digital notes
    document.getElementById('role-selection').classList.add('hidden');
    document.getElementById('suggestions-section').classList.add('hidden');
    document.getElementById('notes-section').classList.remove('hidden');
});

document.getElementById('submit-answer').addEventListener('click', function () {
    // Submit answer logic – no pop-up message
});

document.getElementById('reset-text').addEventListener('click', function () {
    document.getElementById('user-response').value = '';
});

document.getElementById('toggle-mic-button').addEventListener('click', function () {
    const micButton = document.getElementById('toggle-mic-button');
    const micIcon = micButton.querySelector('i');
    const micText = micButton.querySelector('span');

    if (micIcon.classList.contains('fa-microphone-slash')) {
        micIcon.classList.remove('fa-microphone-slash');
        micIcon.classList.add('fa-microphone');
        micButton.classList.replace("bg-red-600", "bg-green-600");
        micText.textContent = 'Unmuted';
    } else {
        micIcon.classList.remove('fa-microphone');
        micIcon.classList.add('fa-microphone-slash');
        micButton.classList.replace("bg-green-600", "bg-red-600");
        micText.textContent = 'Muted';
    }
});

// Digital Notes functionality
document.getElementById('clear-notes').addEventListener('click', function () {
    document.getElementById('notes').value = '';
    localStorage.removeItem('digitalNotes');
});

document.getElementById('toggle-notes-visibility').addEventListener('click', function () {
    const notesTextarea = document.getElementById('notes');
    const toggleButton = document.getElementById('toggle-notes-visibility');
    const toggleIcon = toggleButton.querySelector('i');
    const toggleText = toggleButton.querySelector('span');

    if (notesTextarea.style.display === 'none') {
        notesTextarea.style.display = 'block';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
        toggleButton.classList.replace("bg-blue-600", "bg-yellow-600");
        toggleText.textContent = 'Hide Notes';
    } else {
        notesTextarea.style.display = 'none';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
        toggleButton.classList.replace("bg-yellow-600", "bg-blue-600");
        toggleText.textContent = 'Show Notes';
    }
});

// Load saved notes on page load
window.addEventListener('load', function () {
    const savedNotes = localStorage.getItem('digitalNotes');
    if (savedNotes) {
        document.getElementById('notes').value = savedNotes;
    }
});
  
