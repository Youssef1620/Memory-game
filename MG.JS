// =========================
// Memory Game - Complete JS
// =========================

// =========================
// عناصر الصفحة
// =========================

const gameContainer =
    document.getElementById("game-container");

const startPanel =
    document.getElementById("start-panel");

const winPanel =
    document.getElementById("win-panel");

const lostPanel =
    document.getElementById("lost-panel");

const startButton =
    document.getElementById("start-btn");

const winButton =
    document.getElementById("win-btn");

const lostButton =
    document.getElementById("lost-btn");

const tryAgainButton =
    document.getElementById("try-again-btn");

const playerNameElement =
    document.getElementById("player-name");

const triesElement =
    document.getElementById("tries-count");

const musicToggle =
    document.getElementById("music-toggle");

const backgroundMusic =
    document.getElementById("music");

const difficultyInputs = Array.from(
    document.querySelectorAll(
        "input[data-difficulty]"
    )
);

// =========================
// متغيرات اللعبة
// =========================

let selectedDifficulty =
    difficultyInputs.find(
        (input) => input.checked
    )?.value || "20";

let maxWrongAllowed =
    Number(selectedDifficulty);

let musicEnabled = true;
let gameRound = 0;

const duration = 1000;

let blocks = [];
let orderRange = [];

// =========================
// بيانات الكروت
// =========================

const cardsData = [
    {
        name: "apple",
        image: "images/apple (3).png",
        alt: "Apple"
    },
    {
        name: "pineapple",
        image: "images/pineapple_4791196.png",
        alt: "Pineapple"
    },
    {
        name: "mango",
        image: "images/Mango.png",
        alt: "Mango"
    },
    {
        name: "blueberry",
        image: "images/blueberrygit add.png",
        alt: "Blueberry"
    },
    {
        name: "orange",
        image: "images/Orange.png",
        alt: "Orange"
    },
    {
        name: "grapes",
        image: "images/Grapes.png",
        alt: "Grapes"
    },
    {
        name: "strawberry",
        image: "images/strawberry_19024878.png",
        alt: "Strawberry"
    },
    {
        name: "banana",
        image: "images/banana_433682.png",
        alt: "Banana"
    },
    {
        name: "kiwi",
        image: "images/kiwi.png",
        alt: "Kiwi"
    },
    {
        name: "melon",
        image: "images/fruit_13768533.png",
        alt: "Melon"
    }
];

// =========================
// إنشاء الكروت
// =========================

function createCards() {
    if (!gameContainer) {
        return;
    }

    // إذا كانت الكروت موجودة في HTML لا تنشئها مرة أخرى
    let existingBlocks =
        gameContainer.querySelectorAll(".blocks");

    if (existingBlocks.length === 0) {
        const allCards = [
            ...cardsData,
            ...cardsData
        ];

        allCards.forEach((card) => {
            const block =
                document.createElement("article");

            block.className = "blocks";
            block.dataset.technology = card.name;

            block.innerHTML = `
                <div class="front-blocks face"></div>

                <div class="back-blocks face">
                    <img
                        src="${card.image}"
                        alt="${card.alt}">
                </div>
            `;

            gameContainer.appendChild(block);
        });
    }

    blocks = Array.from(
        gameContainer.querySelectorAll(".blocks")
    );

    orderRange = blocks.map(
        (_, index) => index
    );

    blocks.forEach((block) => {
        block.addEventListener(
            "click",
            () => {
                flipBlock(block);
            }
        );
    });
}

// =========================
// تشغيل الأصوات
// =========================

function playSound(id) {
    const sound =
        document.getElementById(id);

    if (!sound) {
        return;
    }

    sound.currentTime = 0;

    const playPromise =
        sound.play();

    if (
        playPromise &&
        typeof playPromise.catch === "function"
    ) {
        playPromise.catch(() => {});
    }
}

function startBackgroundMusic() {
    if (
        !backgroundMusic ||
        !musicEnabled
    ) {
        return;
    }

    backgroundMusic.loop = true;

    // مستوى الصوت نصف القوة
    backgroundMusic.volume = 0.5;

    const musicPromise =
        backgroundMusic.play();

    if (
        musicPromise &&
        typeof musicPromise.catch === "function"
    ) {
        musicPromise.catch(() => {});
    }
}

function stopBackgroundMusic() {
    if (!backgroundMusic) {
        return;
    }

    backgroundMusic.pause();
}

function updateMusicSwitch() {
    if (!musicToggle) {
        return;
    }

    musicToggle.classList.toggle(
        "is-on",
        musicEnabled
    );

    musicToggle.setAttribute(
        "aria-pressed",
        String(musicEnabled)
    );

    musicToggle.setAttribute(
        "aria-label",
        musicEnabled
            ? "Turn background music off"
            : "Turn background music on"
    );

    const stateText =
        musicToggle.querySelector(
            ".switch-state"
        );

    if (stateText) {
        stateText.textContent =
            musicEnabled ? "On" : "Off";
    }
}

// زر تشغيل وإيقاف الموسيقى
if (musicToggle) {
    musicToggle.addEventListener(
        "click",
        () => {
            musicEnabled = !musicEnabled;

            updateMusicSwitch();

            if (musicEnabled) {
                startBackgroundMusic();
            } else {
                stopBackgroundMusic();
            }
        }
    );
}

// =========================
// اختيار مستوى الصعوبة
// =========================

function syncDifficultyControls() {
    maxWrongAllowed =
        Number(selectedDifficulty);

    difficultyInputs.forEach((input) => {
        input.checked =
            input.value === selectedDifficulty;
    });
}

difficultyInputs.forEach((input) => {
    input.addEventListener(
        "change",
        () => {
            selectedDifficulty =
                input.value;

            syncDifficultyControls();
        }
    );
});

// =========================
// خلط الكروت
// =========================

function shuffle(array) {
    let current = array.length;

    while (current > 0) {
        const random = Math.floor(
            Math.random() * current
        );

        current--;

        const temporary =
            array[current];

        array[current] =
            array[random];

        array[random] =
            temporary;
    }
}

function arrangeBlocks() {
    shuffle(orderRange);

    blocks.forEach((block, index) => {
        block.style.order =
            orderRange[index];
    });
}

// =========================
// إظهار وإخفاء الشاشات
// =========================

function showPanel(panel) {
    if (!panel) {
        return;
    }

    panel.style.display = "flex";

    panel.setAttribute(
        "aria-hidden",
        "false"
    );
}

function hidePanel(panel) {
    if (!panel) {
        return;
    }

    panel.style.display = "none";

    panel.setAttribute(
        "aria-hidden",
        "true"
    );
}

// =========================
// تعطيل الضغط مؤقتًا
// =========================

function stopClicking() {
    if (!gameContainer) {
        return;
    }

    gameContainer.classList.add(
        "no-clicking"
    );

    setTimeout(() => {
        gameContainer.classList.remove(
            "no-clicking"
        );
    }, 1500);
}

// =========================
// زر البداية
// =========================

if (startButton) {
    startButton.addEventListener(
        "click",
        () => {
            // يبدأ مباشرة بدون كتابة Yes
            const enteredName =
                prompt("Enter Your Name!");

            const playerName =
                enteredName === null ||
                enteredName.trim() === ""
                    ? "unknown"
                    : enteredName.trim();

            if (playerNameElement) {
                playerNameElement.textContent =
                    playerName;
            }

            hidePanel(startPanel);

            startBackgroundMusic();

            playSound("start-sound");
        }
    );
}

// =========================
// قلب الكارت
// =========================

function flipBlock(selectedBlock) {
    if (
        !gameContainer ||
        selectedBlock.classList.contains(
            "matched"
        ) ||
        selectedBlock.classList.contains(
            "is-flipped"
        ) ||
        gameContainer.classList.contains(
            "no-clicking"
        )
    ) {
        return;
    }

    selectedBlock.classList.add(
        "is-flipped"
    );

    const flippedBlocks =
        blocks.filter((block) =>
            block.classList.contains(
                "is-flipped"
            )
        );

    if (flippedBlocks.length !== 2) {
        return;
    }

    stopClicking();

    checkMatchedBlocks(
        flippedBlocks[0],
        flippedBlocks[1]
    );
}

// =========================
// فحص تطابق الكروت
// =========================

function checkMatchedBlocks(
    firstBlock,
    secondBlock
) {
    const firstCard =
        firstBlock.dataset.technology;

    const secondCard =
        secondBlock.dataset.technology;

    // إذا كان الكارتان متطابقين
    if (firstCard === secondCard) {
        firstBlock.classList.remove(
            "is-flipped"
        );

        secondBlock.classList.remove(
            "is-flipped"
        );

        firstBlock.classList.add(
            "matched"
        );

        secondBlock.classList.add(
            "matched"
        );

        playSound("matched-sound");

        checkWin();

        return;
    }

    // إذا كان الكارتان غير متطابقين
    if (triesElement) {
        const currentTries =
            Number(
                triesElement.textContent
            ) || 0;

        triesElement.textContent =
            String(currentTries + 1);
    }

    playSound("wrong-sound");

    checkLoss();

    setTimeout(() => {
        firstBlock.classList.remove(
            "is-flipped"
        );

        secondBlock.classList.remove(
            "is-flipped"
        );
    }, duration);
}

// =========================
// فحص الخسارة
// =========================

function checkLoss() {
    const currentTries =
        Number(
            triesElement?.textContent
        ) || 0;

    if (
        currentTries <
        maxWrongAllowed
    ) {
        return;
    }

    showPanel(lostPanel);

    if (gameContainer) {
        gameContainer.classList.add(
            "no-clicking"
        );
    }

    playSound("lost-sound");
}

// =========================
// فحص الفوز
// =========================

function checkWin() {
    const matchedBlocks =
        blocks.filter((block) =>
            block.classList.contains(
                "matched"
            )
        );

    if (
        matchedBlocks.length !==
        blocks.length
    ) {
        return;
    }

    const currentRound =
        gameRound;

    setTimeout(() => {
        // منع ظهور شاشة فوز قديمة
        // بعد بدء جولة جديدة
        if (
            currentRound !==
            gameRound
        ) {
            return;
        }

        showPanel(winPanel);

        if (gameContainer) {
            gameContainer.classList.add(
                "no-clicking"
            );
        }

        playSound("win-sound");
    }, 500);
}

// =========================
// إعادة تشغيل اللعبة
// =========================

function restartGame() {
    gameRound++;

    hidePanel(winPanel);
    hidePanel(lostPanel);

    if (triesElement) {
        triesElement.textContent = "0";
    }

    if (gameContainer) {
        gameContainer.classList.remove(
            "no-clicking"
        );
    }

    blocks.forEach((block) => {
        block.classList.remove(
            "is-flipped",
            "matched"
        );
    });

    syncDifficultyControls();

    arrangeBlocks();

    if (musicEnabled) {
        startBackgroundMusic();
    }
}

// زر إعادة اللعب من شاشة الفوز
if (winButton) {
    winButton.addEventListener(
        "click",
        restartGame
    );
}

// زر إعادة اللعب من شاشة الخسارة
if (lostButton) {
    lostButton.addEventListener(
        "click",
        restartGame
    );
}

// زر Try Again الموجود أسفل اللعبة
if (tryAgainButton) {
    tryAgainButton.addEventListener(
        "click",
        restartGame
    );
}

// =========================
// تشغيل اللعبة
// =========================

createCards();

syncDifficultyControls();

updateMusicSwitch();

arrangeBlocks();