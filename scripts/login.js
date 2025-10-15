// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Retrieve registered users from localStorage (stored as an array under 'users')
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Save logged-in user to localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        // Redirect to home page
        window.location.href = 'index.html';
    } else {
        // Show error message if credentials do not match
        const errorDiv = document.getElementById('loginError');
        errorDiv.textContent = "Invalid email or password.";
        errorDiv.classList.remove('hidden');
    }
});