const { gsap, imagesLoaded } = window;
const buttons = {
    prev: document.querySelector(".btn-left"),
    next: document.querySelector(".btn-right"),
};

const cardsContainer     = document.querySelector(".cards-wrapper");
const cardInfosContainer = document.querySelector(".info-wrapper");
var page                 = 0;

$.ajax({
   url: ROOT_URL + '/data/projects.json',
   success: function(data) {
       let dataSize = data.length;

       loadCards(0, data);
       buttons.next.addEventListener("click", function () {
           loadCards(page, data);
           page++;
           if (page > dataSize - 1) {
               page = 0;
           }
           swapCards("right")
       });
       buttons.prev.addEventListener("click", function (){
           loadCards(page, data);
           page--;
           if (page < 0) {
               page = dataSize - 1;
           }
           swapCards("left")
       });
   }
});


function loadCards(cardId, data, direction) {
    let dataSize = data.length;
    let previousCardId = cardId - 1;
    let nextCardId     = cardId + 1;
    if (previousCardId < 0) {
        previousCardId = dataSize - 1;
    }
    if (nextCardId > dataSize - 1) {
        nextCardId = 0;
    }

    let prev    = data[previousCardId];
    let next    = data[nextCardId];
    let current = data[cardId];

    $('.previous-card .card-image').css('background-image', 'url(' + ROOT_URL + '/images/' + prev.logo + ')');
    $('.next-card .card-image').css('background-image', 'url(' +  ROOT_URL + '/images/' + next.logo + ')');
    $('.current-card .card-image').css('background-image', 'url(' +  ROOT_URL + '/images/' + current.logo + ')');

    $('.previous-info .name').html(prev.name);
    $('.next-info .name').html(next.name);
    $('.current-info .name').html(current.name);

    $('.previous-info button').off('click');
    $('.next-info button').off('click');
    $('.current-info button').off('click');

    $('.previous-info button').on('click', () => showArticle(prev.identifier));
    $('.next-info button').on('click', () => showArticle(next.identifier));
    $('.current-info button').on('click', () => showArticle(current.identifier));

    if (LANG === 'de') {
        $('.previous-info .description').html(prev.description_de);
        $('.next-info .description').html(next.description_de);
        $('.current-info .description').html(current.description_de);
    } else {
        $('.previous-info .description').html(prev.description_en);
        $('.next-info .description').html(next.description_en);
        $('.current-info .description').html(current.description_en);
    }
}


function swapCards(direction) {
    const currentCart    = cardsContainer.querySelector(".current-card");
    const previousCard   = cardsContainer.querySelector(".previous-card");
    const nextCard       = cardsContainer.querySelector(".next-card");
    changeInfo(direction);
    swapCardsClass();

    removeCardEvents(currentCart);

    function swapCardsClass() {
        currentCart.classList.remove("current-card");
        previousCard.classList.remove("previous-card");
        nextCard.classList.remove("next-card");
        currentCart.style.zIndex = "20";
        if (direction === "right") {
            previousCard.style.zIndex = "20";
            nextCard.style.zIndex = "30";
            currentCart.classList.add("previous-card");
            previousCard.classList.add("next-card");
            nextCard.classList.add("current-card");
        } else if (direction === "left") {
            previousCard.style.zIndex = "30";
            nextCard.style.zIndex = "20";
            currentCart.classList.add("next-card");
            previousCard.classList.add("current-card");
            nextCard.classList.add("previous-card");
        }
    }
}

function changeInfo(direction) {
    let currentInfoEl = cardInfosContainer.querySelector(".current-info");
    let previousInfoEl = cardInfosContainer.querySelector(".previous-info");
    let nextInfoEl = cardInfosContainer.querySelector(".next-info");

    gsap.timeline()
        .to([buttons.prev, buttons.next], {
            duration: 0.2,
            opacity: 0.5,
            pointerEvents: "none",
        })
        .to(
            currentInfoEl.querySelectorAll(".text"),
            {
                duration: 0.4,
                stagger: 0.1,
                translateY: "-120px",
                opacity: 0,
            },
            "-="
        )
        .call(() => {
            swapInfosClass(direction);
        })
        .call(() => initCardEvents())
        .fromTo(
            direction === "right"
                ? nextInfoEl.querySelectorAll(".text")
                : previousInfoEl.querySelectorAll(".text"),
            {
                opacity: 0,
                translateY: "40px",
            },
            {
                duration: 0.4,
                stagger: 0.1,
                translateY: "0px",
                opacity: 1,
            }
        )
        .to([buttons.prev, buttons.next], {
            duration: 0.2,
            opacity: 1,
            pointerEvents: "all",
        });

    function swapInfosClass() {
        currentInfoEl.classList.remove("current-info");
        previousInfoEl.classList.remove("previous-info");
        nextInfoEl.classList.remove("next-info");

        if (direction === "right") {
            currentInfoEl.classList.add("previous-info");
            nextInfoEl.classList.add("current-info");
            previousInfoEl.classList.add("next-info");
        } else if (direction === "left") {
            currentInfoEl.classList.add("next-info");
            nextInfoEl.classList.add("previous-info");
            previousInfoEl.classList.add("current-info");
        }
    }
}

function updateCard(e) {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const centerPosition = {
        x: box.left + box.width / 2,
        y: box.top + box.height / 2,
    };
    let angle = Math.atan2(e.pageX - centerPosition.x, 0) * (35 / Math.PI);
    gsap.set(card, {
        "--current-card-rotation-offset": `${angle}deg`,
    });
    // const currentInfoEl = cardInfosContainer.querySelector(".current-info");
    // gsap.set(currentInfoEl, {
    //     rotateY: `${angle}deg`,
    // });
}

function resetCardTransforms(e) {
    const card = e.currentTarget;
    // const currentInfoEl = cardInfosContainer.querySelector(".current-info");
    gsap.set(card, {
        "--current-card-rotation-offset": 0,
    });
    // gsap.set(currentInfoEl, {
    //     rotateY: 0,
    // });
}

function initCardEvents() {
    const currentCardEl = cardsContainer.querySelector(".current-card");
    currentCardEl.addEventListener("pointermove", updateCard);
    currentCardEl.addEventListener("pointerout", (e) => {
        resetCardTransforms(e);
    });
}

initCardEvents();

function removeCardEvents(card) {
    card.removeEventListener("pointermove", updateCard);
}

function init() {

    let tl = gsap.timeline();

    tl.to(cardsContainer.children, {
        delay: 0.15,
        duration: 0.5,
        stagger: {
            ease: "power4.inOut",
            from: "right",
            amount: 0.1,
        },
        "--card-translateY-offset": "0%",
    })
        .to(cardInfosContainer.querySelector(".current-info").querySelectorAll(".text"), {
            delay: 0.5,
            duration: 0.4,
            stagger: 0.1,
            opacity: 1,
            translateY: 0,
        })
        .to(
            [buttons.prev, buttons.next],
            {
                duration: 0.4,
                opacity: 1,
                pointerEvents: "all",
            },
            "-=0.4"
        );
}

const loadSlider = () => {

    gsap.set(cardsContainer.children, {
        "--card-translateY-offset": "100vh",
    });
    gsap.set(cardInfosContainer.querySelector(".current-info").querySelectorAll(".text"), {
        translateY: "40px",
        opacity: 0,
    });
    gsap.set([buttons.prev, buttons.next], {
        pointerEvents: "none",
        opacity: "0",
    });

    gsap.timeline()
        .to(".loading-wrapper", {
            duration: 0.8,
            opacity: 0,
            pointerEvents: "none",
        })
        .call(() => init());

};

loadSlider();
