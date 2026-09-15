document.querySelector(".control-panel span").onclick = function(){

    let Ready = prompt("Are You Ready?  Type 'Yes' To Continue ")
    
    if(Ready=="Yes" || Ready=="yes" || Ready=="YES" || Ready=="yEs" || Ready=="yeS"){

    }
    else{
        return;
    }

    let yourName = prompt("Enter Your Name!")

    if (yourName==null || yourName=="") {

        document.querySelector(".name span").innerHTML = 'unknown';

        document.getElementById('start').play();
    }
    else{

        document.querySelector(".name span").innerHTML = yourName ; 

        document.getElementById('start').play();
    }

    document.querySelector(".control-panel").remove();
};
let duration = 1000;

let blocksContainer = document.querySelector(".game-container");

let blockss =Array.from(blocksContainer.children);

let orderRange =[...Array(blockss.length).keys()];


shuffle(orderRange);

blockss.forEach((blocks, index) => {
    
    blocks.style.order = orderRange[index];
    
    blocks.addEventListener('click', function(){
        
        flipBlock(blocks);

    })

})

function flipBlock(selectedBlock)
{
    selectedBlock.classList.add('is-flipped');
    
    let allFlippedBlock = blockss.filter(flippedBlock =>  flippedBlock.classList.contains('is-flipped'))
    
    if (allFlippedBlock.length === 2) {
        
        stopClicking()
        
        checkMatchedBlocks(allFlippedBlock[0], allFlippedBlock[1])
        
    }
    
    function stopClicking() {
        
        blocksContainer.classList.add('no-clicking')
        
        setTimeout(() =>  {
                        
            blocksContainer.classList.remove('no-clicking')

        },1500)
        
    }
    
}

function checkMatchedBlocks(firstBlock, secondBlock){
    
    let triesElement = document.querySelector('.tries span')
    
    if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
        
        firstBlock.classList.remove('is-flipped');
        secondBlock.classList.remove('is-flipped');
        
        firstBlock.classList.add('matched');
        secondBlock.classList.add('matched');
        
        document.getElementById('true').play();

        checkWin();
    }
    else{
        triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;
        setTimeout (() => { 
            firstBlock.classList.remove('is-flipped'),
            secondBlock.classList.remove('is-flipped')
        }, 1500);
        
        document.getElementById('wrong').play();

         checkLoss();
    }
    
}

 function shuffle(array){
    let current = array.length,
    temp, 
    random;
    
    while(current > 0){
        
        random = Math.floor(Math.random() * current);

    current--;

    temp = array[current];
    
    array[current] = array[random];
    
    array[random] = temp;
}
return array;
}


document.addEventListener("DOMContentLoaded", function() {
    const tryButton = document.querySelector(".try");
    
    if (tryButton) {
        tryButton.addEventListener("click", function() {
            console.log("تم الضغط على الزر بنجاح!");
            
                let Sure = prompt("Are You Sure You Will lost Your Score?  Type 'Yes' To Continue ")
    
    if(Sure=="Yes" || Sure=="yes" || Sure=="YES" || Sure=="yEs" || Sure=="yeS"){

    }
    else{
        return;
    }

            // 1. تصفير العداد (تأكد أن الكلاس أو العنصر ده هو اللي جواه الرقم عندك)
            const triesSpan = document.querySelector(".tries span"); // عدل دي لو الـ span في مكان تاني
            if (triesSpan) {
                triesSpan.innerHTML = "0";
            }
            
            // 2. خلط الكروت
            if (typeof shuffle === "function" && typeof orderRange !== "undefined") {
               setTimeout(() => {shuffle(orderRange);}, 1000)
               
                // 3. إعادة ترتيب الكروت بصرياً وشيل الكلاسات بتاعت القلب
                const blockss = document.querySelectorAll(".blocks"); // عدل كلاس الكروت لو مختلف
                blockss.forEach((blocks, index) => {
                    blocks.style.order = orderRange[index];
                    setTimeout(() => { blocks.classList.remove("is-flipped", "matched");}, 0)
                });
            }
        });
    } else {
        console.log("عذراً، زرار .try غير موجود في الصفحة!");
    }})

const maxWrongAllowed = 20; 

function checkLoss() {
    let currentTries = parseInt(document.querySelector('.tries span').innerHTML);
    
    if (currentTries >= maxWrongAllowed) {
        const lostPanel = document.getElementById("lost-panel");
        if (lostPanel) lostPanel.style.display = "flex";
        
        document.querySelector('.game-container').classList.add('no-clicking');
        document.getElementById('lost').play();
    }
}

function checkWin() {
    const allBlocks = document.querySelectorAll(".blocks");
    const matchedBlocks = document.querySelectorAll(".blocks.matched");
    
    if (allBlocks.length > 0 && matchedBlocks.length === allBlocks.length) {
        setTimeout(() => {
            const winPanel = document.getElementById("win-panel");
            if (winPanel) winPanel.style.display = "flex";
            
            document.querySelector('.game-container').classList.add('no-clicking');
            document.getElementById('win').play();
        }, 500);
    }
}
// دالة موحدة لإعادة ضبط الجيم وتصفير الدنيا
function restartGame() {
    // 1. إخفاء شاشات الفوز والخسارة
    document.getElementById("win-panel").style.display = "none";
    document.getElementById("lost-panel").style.display = "none";
    
    // 2. تصفير عداد الأخطاء المرئي على الشاشة
    const triesElement = document.querySelector('.tries span');
    if (triesElement) {
        triesElement.innerHTML = "0";
    }
    
    // 3. إزالة كلاس منع النقر عن البورد
    if (typeof blocksContainer !== 'undefined') {
        blocksContainer.classList.remove('no-clicking');
    }
    
    // 4. إعادة خلط وترتيب الكروت من جديد
    if (typeof shuffle === 'function' && typeof orderRange !== 'undefined' && typeof blockss !== 'undefined') {
        shuffle(orderRange);
        blockss.forEach((blocks, index) => {
            blocks.style.order = orderRange[index];
            blocks.classList.remove("is-flipped", "matched");
        });
    } else {
        // لو حابب تريح دماغك وتعمل ريفريش كامل للصفحة كحل سريع وأكيد:
        location.reload();
    }
}

// تفعيل زرار شاشة الفوز
const winBtn = document.getElementById('win-btn');
if (winBtn) {
    winBtn.addEventListener("click", restartGame);
}

// تفعيل زرار شاشة الخسارة
const lostBtn = document.getElementById('lost-btn');
if (lostBtn) {
    lostBtn.addEventListener("click", restartGame);
}