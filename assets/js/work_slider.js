const { gsap, imagesLoaded } = window;

const buttons = {
    prev: document.querySelector(".btn-left"),
    next: document.querySelector(".btn-right"),
};
const cardsContainer = document.querySelector(".cards-wrapper");
const cardInfosContainer = document.querySelector(".info-wrapper");

buttons.next.addEventListener("click", () => swapCards("right"));
buttons.prev.addEventListener("click", () => swapCards("left"));

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

const waitForImages = () => {
    const images = [...document.querySelectorAll("img")];
    const totalImages = images.length;
    let loadedImages = 0;
    const loaderEl = document.querySelector(".loader span");

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

    images.forEach((image) => {
        imagesLoaded(image, (instance) => {
            if (instance.isComplete) {
                loadedImages++;
                let loadProgress = loadedImages / totalImages;

                gsap.to(loaderEl, {
                    duration: 1,
                    scaleX: loadProgress,
                    backgroundColor: `hsl(${loadProgress * 120}, 100%, 50%`,
                });

                if (totalImages == loadedImages) {
                    gsap.timeline()
                        .to(".loading-wrapper", {
                            duration: 0.8,
                            opacity: 0,
                            pointerEvents: "none",
                        })
                        .call(() => init());
                }
            }
        });
    });
};

waitForImages();
