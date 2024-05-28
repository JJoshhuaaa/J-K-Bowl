const pb = new PocketBase('http://87.106.133.146:8090');

function loadAuthFromLocalStorage() {
    const storedAuth = localStorage.getItem('pb_auth');
    if (storedAuth) {
        pb.authStore.import(JSON.parse(storedAuth));
    }
}

function clearAuthFromLocalStorage() {
    localStorage.removeItem('pb_auth');
}

loadAuthFromLocalStorage();

function showOverlay(username) {
    const overlay = document.getElementById('auth-overlay');
    const usernameSpan = document.getElementById('loggedInUsername');
    usernameSpan.innerText = `Logged in as: ${username}`;
    overlay.classList.remove('hidden');
}

function showOverview(){
    const overview = document.getElementById('overview');
    overview.classList.remove('hidden');
}


function hideOverlay() {
    const overlay = document.getElementById('auth-overlay');
    overlay.classList.add('hidden');
}

function hideOverview(){
    const overview = document.getElementById('overview');
    overview.classList.add('hidden');
}

async function logIn() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        await pb.collection('users').authWithPassword(username, password);

        showOverlay(pb.authStore.model.email);
        showOverview();
        document.getElementById('responseMessage').innerText = "Login successful!";
    } catch (error) {
        console.error('Login failed:', error);
        document.getElementById('responseMessage').innerText = "Login failed!";
    }
}

function logOut() {
    pb.authStore.clear();
    clearAuthFromLocalStorage();
    console.log('Logged out');
    hideOverlay();
    hideOverview();
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-btn');
    logoutButton.addEventListener('click', logOut);

    if (pb.authStore.isValid) {
        showOverlay(pb.authStore.model.email);
        showOverview();
    }
});