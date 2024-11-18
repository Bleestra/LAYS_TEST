document.addEventListener("DOMContentLoaded", function () {
    var startDiv = document.getElementById('start');
    var gameDiv = document.getElementById('game');
    var finishDiv = document.getElementById('finish');
    var player = document.querySelector('#game img[src="player.png"]');
    var catches = [
        document.querySelector('#game img[src="catch1.png"]'),
        document.querySelector('#game img[src="catch2.png"]'),
        document.querySelector('#game img[src="catch3.png"]')
    ];

    var caughtCount = 0;
    var targetScore = 3; // Определение количества пойманных элементов для победы
    var isDragging = false; // Флаг для определения, удерживается ли игрок

    // Инициализация: скрываем игровые и конечные экраны
    gameDiv.style.display = 'none';
    finishDiv.style.display = 'none';

    // Запуск игры по клику
    startDiv.addEventListener('click', function () {
        startDiv.style.display = 'none';
        gameDiv.style.display = 'block';

        // Открытие URL клика через MRAID, если реклама видима
        if (mraid.isViewable()) {
            document.getElementById("click_area").href = yandexHTML5BannerApi.getClickURLNum(1);
        }

        startGame();
    });

    function startGame() {
        // Начальная позиция игрока
        player.style.position = 'absolute';
        player.style.bottom = '10px';
        player.style.left = '0px';

        // Универсальная функция для движения игрока
        function movePlayer(x) {
            var rect = gameDiv.getBoundingClientRect();
            var adjustedX = x - rect.left;

            // Устанавливаем пределы движения от -100 до 300
            player.style.left = Math.max(-100, Math.min(300, adjustedX - player.width / 2)) + 'px';
        }

        // Управление с помощью мыши
        player.addEventListener('mousedown', function (e) {
            e.preventDefault();
            isDragging = true; // Устанавливаем флаг удержания
        });

        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                movePlayer(e.clientX);
            }
        });

        document.addEventListener('mouseup', function () {
            isDragging = false; // Сбрасываем флаг удержания
        });

        // Управление с помощью касания
        player.addEventListener('touchstart', function (e) {
            e.preventDefault();
            isDragging = true; // Устанавливаем флаг удержания
        });

        document.addEventListener('touchmove', function (e) {
            if (isDragging) {
                var touch = e.touches[0];
                movePlayer(touch.clientX);
            }
        });

        document.addEventListener('touchend', function () {
            isDragging = false; // Сбрасываем флаг удержания
        });

        // Начинаем сбрасывать первый элемент
        dropElement(caughtCount);
    }

    function resetElement(elem) {
        elem.style.position = 'absolute';
        elem.style.top = '-50px';
        elem.style.left = Math.random() * 200 + 'px';
    }

    function dropElement(index) {
        if (index >= catches.length) return;

        var elem = catches[index];
        resetElement(elem);

        elem.style.display = 'block';
        var dropInterval = setInterval(function () {
            var top = parseFloat(elem.style.top);
            elem.style.top = top + 2 + 'px';

            // Проверка столкновения
            if (isCollision(player, elem)) {
                clearInterval(dropInterval);
                caughtCount++;
                elem.style.display = 'none';

                // Завершаем игру при достижении цели, иначе сбрасываем следующий элемент
                if (caughtCount === targetScore) {
                    endGame();
                } else {
                    dropElement(caughtCount);
                }
            }

            // Сброс элемента, если он вышел за пределы экрана
            if (top > 600) {
                resetElement(elem);
            }
        }, 16);
    }

    function isCollision(player, element) {
        var playerRect = player.getBoundingClientRect();
        var elementRect = element.getBoundingClientRect();

        return !(
            playerRect.right < elementRect.left ||
            playerRect.left > elementRect.right ||
            playerRect.bottom < elementRect.top ||
            playerRect.top > elementRect.bottom
        );
    }

    function endGame() {
        gameDiv.style.display = 'none';
        finishDiv.style.display = 'block';
    }
});
