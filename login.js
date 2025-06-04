document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    // Проверка авторизации при загрузке
    if (localStorage.getItem('currentUser')) {
        window.location.href = 'user.html';
    }
    
    // Валидация формы
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Симуляция успешного входа
            const userData = {
                username: document.getElementById('username').value,
                joinDate: new Date().toLocaleDateString()
            };
            
            // Сохраняем данные пользователя
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            // Перенаправляем на страницу пользователя
            window.location.href = 'user.html';
        }
    });
    
    // Функция валидации
    function validateForm() {
        let isValid = true;
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        
        // Валидация имени пользователя
        if (username.value.length < 3 || username.value.length > 20) {
            document.getElementById('username-error').textContent = 
                'Username must be between 3 and 20 characters';
            username.classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('username-error').textContent = '';
            username.classList.remove('is-invalid');
        }
        
        // Валидация пароля
        if (password.value.length < 6) {
            document.getElementById('password-error').textContent = 
                'Password must be at least 6 characters';
            password.classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('password-error').textContent = '';
            password.classList.remove('is-invalid');
        }
        
        return isValid;
    }
    
    // Обработка "Забыли пароль?"
    document.getElementById('forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        alert('Password reset functionality would be implemented here');
    });
});