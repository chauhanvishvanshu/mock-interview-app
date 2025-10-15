// Login check: if no user is logged in, redirect to login.html
if (!localStorage.getItem('loggedInUser')) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function () {
    const modals = document.querySelectorAll('.modal');
    const questions = document.querySelectorAll('.question');
    const closeButtons = document.querySelectorAll('.close');

    questions.forEach((question) => {
        question.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal');
            document.getElementById(modalId).style.display = "block";
        });
    });

    closeButtons.forEach((btn) => {
        btn.addEventListener('click', function () {
            this.closest('.modal').style.display = "none";
        });
    });

    window.addEventListener('click', function (event) {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    });
});

// Toggle mobile menu
document.getElementById('menu-toggle').addEventListener('click', function () {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu.style.display === "block") {
        mobileMenu.style.display = "none";
    } else {
        mobileMenu.style.display = "block";
    }
});

// Logout function clears the logged-in user and redirects to login page
function logout() {
    // Clear user session or token
    // Redirect to login page
    window.location.href = 'login.html';
}