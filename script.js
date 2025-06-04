window.onload = function() {
    const isHomePage = window.location.pathname.includes('travel_guide.html') || 
                      window.location.pathname.endsWith('/');
    
    if (isHomePage) {
        let visitorCount = localStorage.getItem('visitorCount') || 0;
        visitorCount++;
        localStorage.setItem('visitorCount', visitorCount);
        
        // alert(`Welcome to Travel Guide! You're visitor #${visitorCount}. Explore amazing destinations with us.`);
    }
};

function redirectToContact() {
    window.location.href = "contact.html";
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    // Общие элементы
    const websiteName = "Travel Guide Krut 01";
    
    // Для главной страницы (travel_guide.html)
    // Определяем, что это главная страница, по наличию специфичного элемента header
    const isTravelGuidePage = document.querySelector('header h1') && document.querySelector('header h1').textContent.includes('Travel Guide');

    if (isTravelGuidePage) {
        const randomDiscount = Math.floor(Math.random() * 30) + 5;
        const discountBanner = document.getElementById('discount-banner');
        if (discountBanner) { 
            discountBanner.textContent = `Special ${randomDiscount}% off for today only!`;
        }
        
        // Инициализация менеджера направлений
        if (typeof destinationManager !== 'undefined' && destinationManager.init) {
            destinationManager.init();
            destinationManager.render();
        }
        
        // Обработчик добавления направления
        const addDestinationBtn = document.getElementById('add-destination');
        if (addDestinationBtn) {
            addDestinationBtn.addEventListener('click', () => {
                const input = document.getElementById('destination-input');
                if (typeof destinationManager !== 'undefined' && destinationManager.addDestination && input) {
                    if (destinationManager.addDestination(input.value)) {
                        input.value = '';
                    }
                }
            });
        }

        // Обработчик удаления последнего направления
        const removeDestinationBtn = document.getElementById('remove-destination');
        if (removeDestinationBtn) {
            removeDestinationBtn.addEventListener('click', () => {
                if (typeof destinationManager !== 'undefined' && destinationManager.removeLastDestination) {
                    destinationManager.removeLastDestination();
                }
            });
        }
        
        // Обработчик для кнопки "Get Your Travel Number"
        const generateNumberBtn = document.getElementById('generate-number');
        if (generateNumberBtn) {
            generateNumberBtn.addEventListener('click', function() {
                const randomNumber = Math.floor(Math.random() * 100) + 1; // Число от 1 до 100
                const numberResultDiv = document.getElementById('number-result');
                if (numberResultDiv) {
                    numberResultDiv.textContent = `Your lucky travel number is: ${randomNumber}`;
                    if (randomNumber > 70) {
                        numberResultDiv.style.color = 'green';
                        numberResultDiv.textContent += " - Great for travel!";
                    } else if (randomNumber > 30) {
                        numberResultDiv.style.color = 'orange';
                        numberResultDiv.textContent += " - Good potential!";
                    } else {
                        numberResultDiv.style.color = 'red';
                        numberResultDiv.textContent += " - Maybe plan carefully.";
                    }
                }
            });
        }

        // Обработчик для кнопки "Get New Travel Deal"
        const updateDealBtn = document.getElementById('update-deal-btn');
        if (updateDealBtn) {
            updateDealBtn.addEventListener('click', function() {
                updateTravelDeal();
            });
        }
        // Вызов функции при загрузке страницы
        updateTravelDeal();

        // ------------- API Integration for Featured Countries on Home Page (Static) -------------
        const featuredCountriesContainer = document.getElementById('featured-countries-list');
        let featuredCountriesLoadingMessage = document.getElementById('featured-countries-loading');

        // Убедимся, что сообщение о загрузке существует и корректно отображается/скрывается
        if (!featuredCountriesLoadingMessage && featuredCountriesContainer) {
            featuredCountriesLoadingMessage = document.createElement('p');
            featuredCountriesLoadingMessage.id = 'featured-countries-loading';
            featuredCountriesLoadingMessage.classList.add('text-info');
            featuredCountriesContainer.prepend(featuredCountriesLoadingMessage);
        }
        if (featuredCountriesLoadingMessage) { 
             featuredCountriesLoadingMessage.textContent = 'Загрузка избранных стран...';
             featuredCountriesLoadingMessage.style.display = 'none'; 
        }
       
        async function loadFeaturedCountries() {
            if (!featuredCountriesContainer) {
                console.warn('Элемент #featured-countries-list не найден.');
                return;
            }

            featuredCountriesContainer.innerHTML = ''; 
            if (featuredCountriesLoadingMessage) {
                featuredCountriesLoadingMessage.textContent = 'Загрузка избранных стран...';
                featuredCountriesLoadingMessage.style.display = 'block';
            }
            

            const apiUrl = 'https://restcountries.com/v3.1/all'; 

            try {
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const countries = await response.json(); 
                const shuffledCountries = countries.sort(() => 0.5 - Math.random());
                const selectedCountries = shuffledCountries.slice(0, 3); // Выбираем 3 случайные страны

                if (featuredCountriesLoadingMessage) {
                    featuredCountriesLoadingMessage.style.display = 'none';
                }
                

                if (selectedCountries.length === 0) {
                    featuredCountriesContainer.innerHTML = '<p class="text-warning">Не удалось найти избранные страны.</p>';
                    return;
                }

                selectedCountries.forEach(country => {
                    const countryName = country.name?.common || 'Неизвестная страна';
                    const flagUrl = country.flags?.svg || 'https://via.placeholder.com/150';
                    const capital = country.capital?.[0] || 'N/A';
                    const population = country.population ? `Население: ${country.population.toLocaleString()}` : 'Население: N/A';

                    const countryCard = `
                        <div class="col-md-4 mb-4">
                            <div class="card h-100">
                                <img src="${flagUrl}" class="card-img-top" alt="Flag of ${countryName}" style="height: 150px; object-fit: cover;">
                                <div class="card-body">
                                    <h5 class="card-title">${countryName}</h5>
                                    <p class="card-text">Столица: ${capital}</p>
                                    <p class="card-text"><small class="text-muted">${population}</small></p>
                                    <a href="https://en.wikipedia.org/wiki/${countryName.replace(/ /g, '_')}" target="_blank" class="btn btn-sm btn-info">Подробнее</a>
                                </div>
                            </div>
                        </div>
                    `;
                    featuredCountriesContainer.innerHTML += countryCard;
                });

            } catch (error) {
                console.error('Ошибка при загрузке избранных стран из API:', error);
                if (featuredCountriesLoadingMessage) {
                    featuredCountriesLoadingMessage.style.display = 'none';
                }
                
                featuredCountriesContainer.innerHTML = '<p class="text-danger">Не удалось загрузить избранные страны. Пожалуйста, попробуйте позже.</p>';
            }
        }

        loadFeaturedCountries(); // Загружаем избранные страны при загрузке главной страницы
    }

    // Для страницы tips.html
    if (window.location.pathname.includes('tips.html')) {
        // Обработчики для добавления/удаления советов
        document.getElementById('add-tip')?.addEventListener('click', function() {
            const proTipsContainer = document.querySelector('.pro-tips-container');
            const newTip = document.createElement('div');
            newTip.classList.add('pro-tip');
            newTip.innerHTML = `
                <h3>New Custom Tip</h3>
                <ul>
                    <li>Remember to enjoy every moment!</li>
                    <li>Always check local customs.</li>
                </ul>
            `;
            proTipsContainer.appendChild(newTip);
            alert('New tip added!');
        });

        document.getElementById('remove-tip')?.addEventListener('click', function() {
            const proTipsContainer = document.querySelector('.pro-tips-container');
            const lastTip = proTipsContainer.lastElementChild;
            if (lastTip && lastTip.classList.contains('pro-tip')) { 
                lastTip.remove();
                alert('Last tip removed!');
            } else {
                alert('No more tips to remove!');
            }
        });

        // Обработчик для конвертера валют
        document.getElementById('convert-currency')?.addEventListener('click', function() {
            const amount = parseFloat(document.getElementById('amount').value);
            const fromCurrency = document.getElementById('fromCurrency').value;
            const toCurrency = document.getElementById('toCurrency').value;
            const conversionResult = document.getElementById('conversion-result');

            if (isNaN(amount) || amount <= 0) {
                conversionResult.textContent = 'Пожалуйста, введите корректную сумму.';
                conversionResult.style.color = 'red';
                return;
            }

            const exchangeRates = {
                'USD': {'EUR': 0.92, 'KZT': 445, 'GBP': 0.79},
                'EUR': {'USD': 1.09, 'KZT': 485, 'GBP': 0.86},
                'KZT': {'USD': 0.0022, 'EUR': 0.0020, 'GBP': 0.0017},
                'GBP': {'USD': 1.27, 'EUR': 1.16, 'KZT': 565}
            };

            if (fromCurrency === toCurrency) {
                conversionResult.textContent = `${amount} ${fromCurrency} = ${amount} ${toCurrency}`;
                conversionResult.style.color = 'black';
                return;
            }

            const rate = exchangeRates[fromCurrency][toCurrency];
            if (rate) {
                const convertedAmount = (amount * rate).toFixed(2);
                conversionResult.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
                conversionResult.style.color = 'green';
            } else {
                conversionResult.textContent = 'Невозможно конвертировать эти валюты.';
                conversionResult.style.color = 'red';
            }
        });

        // Обработчик для сравнения цен на авиабилеты
        document.getElementById('compare-prices')?.addEventListener('click', function() {
            const flight1Price = parseFloat(document.getElementById('flight1').value);
            const flight2Price = parseFloat(document.getElementById('flight2').value);
            const comparisonResult = document.getElementById('comparison-result');

            if (isNaN(flight1Price) || isNaN(flight2Price) || flight1Price < 0 || flight2Price < 0) {
                comparisonResult.textContent = 'Пожалуйста, введите корректные цены.';
                comparisonResult.style.color = 'red';
                return;
            }

            if (flight1Price < flight2Price) {
                comparisonResult.textContent = `Рейс 1 (${flight1Price}$) дешевле Рейса 2 (${flight2Price}$) на ${flight2Price - flight1Price}$.`;
                comparisonResult.style.color = 'green';
            } else if (flight2Price < flight1Price) {
                comparisonResult.textContent = `Рейс 2 (${flight2Price}$) дешевле Рейса 1 (${flight1Price}$) на ${flight1Price - flight2Price}$.`;
                comparisonResult.style.color = 'green';
            } else {
                comparisonResult.textContent = `Цены на оба рейса одинаковые: ${flight1Price}$.`;
                comparisonResult.style.color = 'blue'; 
            }
        });
        
        // --------------- Удаленная логика для API стран на странице tips.html ---------------
        // Весь блок, отвечающий за loadRandomCountriesForTips() и refreshDestinationsBtn, удален.
        // -----------------------------------------------------------------------------------
    }

    // Для страницы user.html
    if (window.location.pathname.includes('user.html')) {
        const tripCards = document.querySelectorAll('.trip-card');
        const hotels = ['Grand Hyatt', 'Ritz-Carlton', 'Hilton', 'Marriott', 'Holiday Inn'];
        const airlines = ['Qatar Airways', 'Emirates', 'Turkish Airlines', 'Lufthansa', 'American Airlines'];

        tripCards.forEach(card => {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) + 1); 
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 7) + 3); 

            card.querySelector('.trip-details h5').textContent = `Ваша поездка на ${startDate.toLocaleDateString('ru-RU', { month: 'long', day: 'numeric' })}`;
            card.querySelector('.trip-details p:nth-of-type(1)').textContent = 
                `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
            card.querySelector('.trip-details p:nth-of-type(2)').textContent = 
                `Отель: ${hotels[Math.floor(Math.random() * hotels.length)]}`;
            card.querySelector('.trip-details p:nth-of-type(3)').textContent = 
                `Рейс: ${airlines[Math.floor(Math.random() * airlines.length)]}${Math.floor(Math.random() * 900) + 100}`;
        });
        
        // Обработчики для wishlist (дублируется из jquery.js, но на всякий случай)
        $(".wishlist-item .btn-danger").click(function(e) {
            e.stopPropagation();
            if (confirm("Remove this item from your wishlist?")) {
                $(this).closest(".wishlist-item").fadeOut(300, function() {
                    $(this).remove();
                });
            }
        });
        
        $(".wishlist-item .btn-primary").click(function(e) {
            e.stopPropagation();
            const destination = $(this).siblings("h5").text();
            alert(`Redirecting to booking page for ${destination}`);
        });
    }
});

// Функции для travel_guide.html
function updateTravelDeal() {
    const deals = [
        { title: "Летнее приключение в Таиланде", description: "Насладитесь пляжами и культурой. Скидка 20%!", image: "images/im1.jpg" },
        { title: "Зимний отдых в Альпах", description: "Идеально для лыжников и любителей снега. Включены ски-пассы!", image: "images/im2.jpg" },
        { title: "Исследование Древнего Рима", description: "Погрузитесь в историю с эксклюзивным туром. Скидка 15%!", image: "images/im3.jpg" },
        { title: "Сафари по Африке", description: "Увидеть дикую природу вблизи. Незабываемый опыт!", image: "images/im4.jpg" },
        { title: "Круиз по Карибскому морю", description: "Отдых на роскошном лайнере. Все включено!", image: "images/im5.jpg" }
    ];

    const currentDealDiv = document.getElementById('current-deal');
    if (currentDealDiv) {
        const randomIndex = Math.floor(Math.random() * deals.length);
        const deal = deals[randomIndex];

        currentDealDiv.innerHTML = `
            <img src="${deal.image}" alt="${deal.title}" class="deal-image">
            <h3>${deal.title}</h3>
            <p>${deal.description}</p>
            <button class="btn btn-success">Забронировать сейчас</button>
        `;
    }
}

// Вспомогательные функции (если используются)
function getRandomFutureDate() {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + Math.floor(Math.random() * 3) + 1);
    return endDate.toLocaleDateString('en-GB');
}

// Объект для управления направлениями на главной странице (travel_guide.html)
const destinationManager = {
    destinations: [],
    init: function() {
        const storedDestinations = localStorage.getItem('destinations');
        if (storedDestinations) {
            this.destinations = JSON.parse(storedDestinations);
        } else {
            this.destinations = [
                'Париж, Франция',
                'Токио, Япония',
                'Нью-Йорк, США',
                'Сидней, Австралия',
                'Рио-де-Жанейро, Бразилия'
            ];
        }
    },
    render: function() {
        const listElement = document.getElementById('destinations-list');
        if (listElement) {
            listElement.innerHTML = '';
            this.destinations.forEach(dest => {
                const li = document.createElement('li');
                li.textContent = dest;
                listElement.appendChild(li);
            });
            this.save();
        }
    },
    addDestination: function(newDestination) {
        if (newDestination && !this.destinations.includes(newDestination)) {
            this.destinations.push(newDestination);
            this.render();
            alert(`Направление "${newDestination}" добавлено!`);
            return true;
        } else {
            alert('Пожалуйста, введите уникальное название направления.');
            return false;
        }
    },
    removeLastDestination: function() {
        if (this.destinations.length > 0) {
            const removed = this.destinations.pop();
            this.render();
            alert(`Направление "${removed}" удалено!`);
            return true;
        } else {
            alert('Нет направлений для удаления.');
            return false;
        }
    },
    save: function() {
        localStorage.setItem('destinations', JSON.stringify(this.destinations));
    }
};

// Инициализация менеджера направлений (если это travel_guide.html)
if (document.querySelector('header h1') && document.querySelector('header h1').textContent.includes('Travel Guide')) {
    // destinationManager.init() и .render() теперь вызываются в основном DOMContentLoaded блоке для home page
}