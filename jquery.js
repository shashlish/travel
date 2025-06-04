

$(document).ready(function() {
   
    $('nav ul li a').css('font-weight', 'bold');
    
   
    $('footer').css({
        'padding': '20px 0',
        'font-size': '1.1em'
    });
    
   
    $('.gallery img').attr('title', 'Click to enlarge');
    
   
    $('h1').hide().fadeIn(1500);
    $('section').hide().slideDown(1000);
    
   
    $('#add-tip').click(function() {
        $('.pro-tips-container').append('<div class="pro-tip"><h3>New Travel Tip</h3><ul><li>Always carry a photocopy of your passport</li></ul></div>');
    });
    
    $('#remove-tip').click(function() {
        $('.pro-tip').last().remove();
    });
    
    
    $('.gallery img').hover(
        function() {
            $(this).css('transform', 'scale(1.05)');
        },
        function() {
            $(this).css('transform', 'scale(1)');
        }
    );
    
   
    $('.login-form').submit(function(e) {
        e.preventDefault();
        alert('Login form submitted!');
    });
    
    $('.contact-form').submit(function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will contact you soon.');
        $(this).trigger('reset');
    });
});


$('#compare-prices').click(function() {
    const price1 = parseFloat($('#flight1').val());
    const price2 = parseFloat($('#flight2').val());
    
    if (isNaN(price1) || isNaN(price2)) {
        $('#comparison-result').html('<div class="alert alert-danger">Please enter valid prices for both flights</div>');
        return;
    }
    
    let result;
    if (price1 > price2) {
        result = `Flight 1 is $${(price1 - price2).toFixed(2)} more expensive than Flight 2`;
    } else if (price2 > price1) {
        result = `Flight 2 is $${(price2 - price1).toFixed(2)} more expensive than Flight 1`;
    } else {
        result = 'Both flights have the same price!';
    }
    
    $('#comparison-result').html(`<div class="alert alert-info">${result}</div>`);
});

$(document).ready(function() {
    const allDestinations = [
        'Bali, Indonesia', 
        'Santorini, Greece', 
        'Kyoto, Japan',
        'Machu Picchu, Peru', 
        'Venice, Italy', 
        'Serengeti, Tanzania',
        'Great Barrier Reef, Australia', 
        'Banff, Canada', 
        'Dubai, UAE',
        'Rio de Janeiro, Brazil',
        'Paris, France',
        'Rome, Italy',
        'New York, USA',
        'Barcelona, Spain',
        'Cape Town, South Africa',
        'Sydney, Australia',
        'Tokyo, Japan',
        'London, UK',
        'Prague, Czech Republic',
        'Istanbul, Turkey',
        'Bangkok, Thailand',
        'Marrakech, Morocco',
        'Queenstown, New Zealand',
        'Reykjavik, Iceland',
        'Hanoi, Vietnam'
    ];

    function getRandomDestinations() {
        const shuffled = [...allDestinations];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, 10);
    }

    function generateDestinationCards() {
        const container = $('#dynamic-destinations');
        container.empty(); 
        
        const currentDestinations = getRandomDestinations();

        currentDestinations.forEach((destination, index) => {
            const bgColor = index % 2 === 0 ? '#FFE4B5' : '#FFDAB9';
            const card = `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="destination-card" 
                         style="background: ${bgColor}; 
                                padding: 15px; 
                                border-radius: 8px;
                                cursor: pointer;
                                transition: transform 0.3s;">
                        <h4>${index+1}. ${destination}</h4>
                        <p class="mb-0">Rank: ${index+1}</p>
                    </div>
                </div>
            `;
            container.append(card);
        });

        $('.destination-card').hover(
            function() {
                $(this).css('transform', 'translateY(-5px)');
            },
            function() {
                $(this).css('transform', 'none');
            }
        );
    }

    generateDestinationCards();

    $('#refresh-destinations').on('click', function() {
        const $btn = $(this);
        $btn.html('<i class="fas fa-spinner fa-spin"></i> Refreshing...')
           .prop('disabled', true);
        
        $('#dynamic-destinations').fadeOut(300, function() {
            generateDestinationCards();
            $(this).fadeIn(300, function() {
                $btn.html('<i class="fas fa-sync-alt"></i> Refresh Destinations')
                   .prop('disabled', false);
            });
        });
    });
});


// 2. Аудио-эффект (добавить в jquery.js)
function playClickSound() {
    const audio = new Audio('sounds/click.wav'); // Создайте папку /sounds
    audio.play().catch(e => console.log("Audio play failed:", e));
}

// Обновите клик-обработчики:
$('#add-tip, #remove-tip, #compare-prices').click(function() {
    playClickSound();
});

// Для страницы Sales & Offers
$(document).ready(function() {
    // Таймер обратного отсчета для акции
    function updateCountdown() {
        let hours = 23 - new Date().getHours();
        let minutes = 59 - new Date().getMinutes();
        let seconds = 59 - new Date().getSeconds();
        
        // Добавляем ведущие нули
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        
        $("#countdown-timer").text(hours + ":" + minutes + ":" + seconds);
    }
    
    // Обновляем каждую секунду
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Инициализация
    
    // Анимация карточек предложений
    $(".offer-card").hover(
        function() {
            $(this).css("transform", "translateY(-10px)");
            $(this).find(".offer-badge").css("transform", "scale(1.1)");
        },
        function() {
            $(this).css("transform", "translateY(0)");
            $(this).find(".offer-badge").css("transform", "scale(1)");
        }
    );
    
    // Подписка на рассылку
    $(".newsletter-form").submit(function(e) {
        e.preventDefault();
        const email = $(this).find("input[type='email']").val();
        if (email) {
            $(this).html('<div class="alert alert-success">Thank you for subscribing!</div>');
            setTimeout(() => {
                $(this).html(`
                    <div class="form-group">
                        <input type="email" class="form-control" placeholder="Enter your email">
                        <button type="submit" class="btn btn-primary">Subscribe</button>
                    </div>
                `);
            }, 3000);
        }
    });

    // Для страницы User Page
    // Управление wishlist
    $(".wishlist-item .btn-danger").click(function(e) {
        e.stopPropagation();
        if (confirm("Remove this item from your wishlist?")) {
            $(this).closest(".wishlist-item").fadeOut(300, function() {
                $(this).remove();
            });
        }
    });

    // Анимация карточек поездок
    $(".trip-card").hover(
        function() {
            $(this).css("box-shadow", "0 8px 16px rgba(0,0,0,0.2)");
        },
        function() {
            $(this).css("box-shadow", "none");
        }
    );

    // Подтверждение бронирования из wishlist
    $(".wishlist-item .btn-primary").click(function(e) {
        e.stopPropagation();
        const destination = $(this).siblings("h5").text();
        alert(`Redirecting to booking page for ${destination}`);
    });
});