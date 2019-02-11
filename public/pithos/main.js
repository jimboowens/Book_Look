// $(document).ready(() => {


    // variables for HTML elements that need to be changed with JS
    let backdrop = document.querySelector('.backdrop');
    let cardButtons = document.querySelectorAll('.card');
    let modal1 = document.querySelector('.modal-1');
    let orb1 = document.querySelector('.orb-1');
    let sunButton = document.querySelector('#pithos-logo')
    let animalButton = document.querySelector('#animals');
    let plantButton = document.querySelector('#plants');
    let aboutButton = document.querySelector('#about');
    let main = document.querySelector('.main')
    //booleans for page START (they change when clicking the nav buttons!)
    let animals = true;
    let plants = false;
    let about = false;
    
    // so clicking thebackdrop closes the modal
    $('.backdrop').on('click', function () {
        backdrop.style.display = 'none';
        modal1.style.display = 'none';
    })

//keyframes animation function for backdrop and modal ... can we also change visibility to flex/block here?
function fadeIn() {
    modal1.style.display = 'flex';
    backdrop.style.display = 'block';
    modal1.classList.remove('fade-out-modal')
    modal1.classList.add('fade-in-modal')
    backdrop.classList.remove('fade-out-back')
    backdrop.classList.add('fade-in-back')
}

//can this also turn off visibility and fadeout

function fadeOut() {
    modal1.classList.remove('fade-in-modal')
    modal1.classList.add('fade-out-modal')
    backdrop.classList.remove('fade-in-back')
    backdrop.classList.add('fade-out-back')
    setTimeout(displayNone, 2000)
}

function displayNone() {
    modal1.style.display = 'none';
    backdrop.style.display = 'none';
}
    
    // /looping through both plant and animal objects!
    function farmData() {
            let modal1HTML = "";
            let card1 = document.querySelector('#card1');
            let card2 = document.querySelector('#card2');
            let card3 = document.querySelector('#card3');
            let card4 = document.querySelector('#card4');
            let animalCards = [card1, card2, card3, card4];
            if (animals == true) {
                for (let i = 0; i < critterInfo.length; i++) {
                    $(animalCards[i]).on('click', function () {
                        fadeIn()
                        modal1HTML =
                            `<h3 class="name">${critterInfo[i].critter}</h3> <div class="latin"> ${critterInfo[i].latin}</div>
                    <div class="facts1"> ${critterInfo[i].fact1}</div> <div class="facts2"> ${critterInfo[i].fact2}</div> <div class="orb-1"></div>`
                        $(modal1).html(modal1HTML)
                        $('.orb-1').on('click', function () {
                            modal1HTML = `<div class="myths"> ${critterInfo[i].myth}</div> <div class="symbols">${critterInfo[i].symbolism}</div> <div class="orb-1"></div>`
                            $(modal1).html(modal1HTML)
                            $('.orb-1').on('click', function () {
                                fadeOut()
                            })
                        })
                    })
                }
            } else if (plants == true) {
                let modal1HTML = "";
                let plantCards = [card1, card2, card3, card4]
                console.log("plant")
                for (let i = 0; i < cropInfo.length; i++) {
                    console.log('plant2')
                    $(plantCards[i]).on('click', function () {
                        fadeIn()
                        modal1HTML =
                            `<h3 class="name">${cropInfo[i].crop}</h3> <div class="latin"> ${cropInfo[i].latin}</div>  <div class="origin">${cropInfo[i].nativeTo}</div>
                    <div class="facts1"> ${cropInfo[i].historicalFact}</div> <div class="orb-1"></div>`
                        $(modal1).html(modal1HTML)
                        $('.orb-1').on('click', function () {
                            modal1HTML = `<div class="facts2">${cropInfo[i].medicinal}</div>
                        <div class="myths"> ${cropInfo[i].myth}</div> <div class="orb-1"></div>`
                            $(modal1).html(modal1HTML)
                            $('.orb-1').on('click', function () {
                                fadeOut()
                            })
                        })
                    })
                }
            } else if (about == true){
                let modal1HTML = "";
                let aboutCards = [card1, card2, card3, card4]
                for (let i = 0; i < aboutInfo.length; i++) {
                    $(aboutCards[i]).on('click', function (){
                        fadeIn()
                        modal1HTML = 
                            `<h3 class="name">${aboutInfo[i].name}</h3> <div class="meaning">${aboutInfo[i].meaning}</div> 
                            <div class="origin">${aboutInfo[i].origin}</div> <div class="profile-link">${aboutInfo[i].link} <div class="orb-1"></div>`
                        $(modal1).html(modal1HTML)
                        $('.orb-1').on('click', function(){
                            fadeOut()
                        })
                    })
                }
            }
        }
    
    
    farmData()
    
    
    // button clicks for NAV (to change from animal to plant to about or whatever the user pleases)
    // COULD THIS ALL BE DONE IN A FOR LOOP? ONE FOR EACH BUTTON CLICK? (PLANT/ANIMAL)
    $(plantButton).on('click', function () {
        plants = true;
        animals = false;
        about = false;
        let mainHTML = `
        <div class="circle">
            <div class="card-wrapper">
                <div class="card" id="card1">
                    <div class="card1-background"></div>
                    <div class="card1-image"></div>
                </div>
                <div class="card" id="card2">
                    <div class="card2-background"></div>
                    <div class="card2-image"></div>
                </div>
                <div class="card" id="card3">
                    <div class="card3-background"></div>
                    <div class="card3-image"></div>
                </div>
                <div class="card" id="card4">
                    <div class="card4-background"></div>
                    <div class="card4-image"></div>
                </div>
            </div>
        </div>`
        $(main).html(mainHTML)
        console.log("hi")
        $('.card1-background').css('background-color', 'lightgoldenrodyellow');
        $('.card1-image').css('background', 'url(images/blueberry-sm.png) center center no-repeat');
        $('.card1-image').css('background-size', '70%');
        $('.card2-background').css('background-color', 'lightgoldenrodyellow');
        $('.card2-image').css('background', 'url(images/peach-sm.png) center center no-repeat');
        $('.card2-image').css('background-size', '60%');
        $('.card3-background').css('background-color', 'lightgoldenrodyellow');
        $('.card3-image').css('background', 'url(images/honeybee-sm.png) center center no-repeat');
        $('.card3-image').css('background-size', '70%');
        $('.card4-background').css('background-color', 'lightgoldenrodyellow');
        $('.card4-image').css('background', 'url(images/collards-sm.png) center center no-repeat');
        $('.card4-image').css('background-size', '60%');
        farmData();
    });
    
    $(animalButton).on('click', function () {
        animals = true;
        plants = false;
        about = false;
        let mainHTML = 
        `<div class="circle">
            <div class="card-wrapper">
                <div class="card" id="card1">
                    <div class="card1-background"></div>
                    <div class="card1-image"></div>
                </div>
                <div class="card" id="card2">
                    <div class="card2-background"></div>
                    <div class="card2-image"></div>
                </div>
                <div class="card" id="card3">
                    <div class="card3-background"></div>
                    <div class="card3-image"></div>
                </div>
                <div class="card" id="card4">
                    <div class="card4-background"></div>
                    <div class="card4-image"></div>
                </div>
            </div>
        </div>`
        $(main).html(mainHTML)
        console.log("hi")
        $('.card1-background').css('background-color', 'lightgoldenrodyellow');
        $('.card1-image').css('background', 'url(images/pig-sm.png) center center no-repeat');
        $('.card1-image').css('background-size', '70%');
        $('.card2-background').css('background-color', 'lightgoldenrodyellow');
        $('.card2-image').css('background', 'url(images/bull-sm.png) center center no-repeat');
        $('.card2-image').css('background-size', '80%');
        $('.card3-background').css('background-color', 'lightgoldenrodyellow');
        $('.card3-image').css('background', 'url(images/chicken-sm.png) center center no-repeat');
        $('.card3-image').css('background-size', '60%');
        $('.card4-background').css('background-color', 'lightgoldenrodyellow');
        $('.card4-image').css('background', 'url(images/goat-sm.png) center center no-repeat');
        $('.card4-image').css('background-size', '65%');
        farmData();
    });
    
$(aboutButton).on('click', function () {
    animals = false;
    plants = false;
    about = true;
    let mainHTML = 
        `<div class="circle">
          <div class="card-wrapper">
              <div class="card" id="card1">
                  <div class="card1-background"></div>
                  <div class="card1-image"></div>
              </div>
              <div class="card" id="card2">
                  <div class="card2-background"></div>
                  <div class="card2-image"></div>
              </div>
              <div class="card" id="card3">
                  <div class="card3-background"></div>
                  <div class="card3-image"></div>
              </div>
              <div class="card" id="card4">
                  <div class="card4-background"></div>
                  <div class="card4-image"></div>
              </div>
          </div>
      </div>
    </div>`
        $(main).html(mainHTML)
        console.log("hi")
        $('.card1-background').css('background-color', 'lightgoldenrodyellow');
        $('.card1-image').css('background', 'url(images/katie-icon-vect.png) center center no-repeat');
        $('.card1-image').css('background-size', '70%');
        $('.card2-background').css('background-color', 'lightgoldenrodyellow');
        $('.card2-image').css('background', 'url(images/jason-icon-vect.png) center center no-repeat');
        $('.card2-image').css('background-size', '75%');
        $('.card3-background').css('background-color', 'lightgoldenrodyellow');
        $('.card3-image').css('background', 'url(images/jim-icon-vect.png) center center no-repeat');
        $('.card3-image').css('background-size', '65%');
        $('.card4-background').css('background-color', 'lightgoldenrodyellow');
        $('.card4-image').css('background', 'url(images/pithos-icon-vect.png) center center no-repeat');
        $('.card4-image').css('background-size', '75%');
        farmData();
})
    
    $(sunButton).on('click', function(){
        animals = false;
        plants = false;
        about = false;
        let mainHTML = 
        `<div class="circle">
            <div class="intro-container">
                <div class="intro-logo"></div>
                <p class="intro-text">
                    noun<br>
                    pi·​thos | ˈpiˌthäs, ˈpī<br>
                    plural pithoi<br>
                    Definition of pithos: a very large earthenware jar with a wide round mouth used throughout the ancient Greek world especially for holding and storing large quantities of food (as grain) or liquids (as wine, oil) and sometimes for the burial of the dead.</p>
            </div>
        </div>`
        $(main).html(mainHTML)
    })
