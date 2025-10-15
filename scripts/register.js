// Handle registration form submission
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Retrieve the current users list from localStorage (or initialize as empty array)
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if email is already registered
    if (users.some(user => user.email === email)) {
        const errorDiv = document.getElementById('registerError');
        errorDiv.textContent = "This email is already registered.";
        errorDiv.classList.remove('hidden');
        return;
    }

    // Create new user object; assign a default role of "user"
    const newUser = { name, email, password, role: "user" };

    // Add new user to the array and save it to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Log in the new user by setting the loggedInUser flag in localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));

    // Redirect to home page
    window.location.href = 'index.html';
});