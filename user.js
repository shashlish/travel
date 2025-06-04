document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Заполнение данных пользователя
    document.getElementById('profile-username').textContent = currentUser.username;
    document.getElementById('join-date').textContent = currentUser.joinDate;
    
    // Выход из системы
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
});