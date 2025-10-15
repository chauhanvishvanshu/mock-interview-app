// Redirect to login page if no user is logged in.
if (!localStorage.getItem('loggedInUser')) {
    window.location.href = 'login.html';
}

// Logout function to clear session and redirect to login page
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}