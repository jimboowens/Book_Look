// console.log('sanity check')
// add aready listener to the whole Dom

$(document).ready(()=>{
    // console.log('sanity check')    
    $('button').click(function(){
        console.log($(this))
        let gridSize = $(this).attr('diff')
        // need to half the gridSize by 2, and then add one because we have to have to have pairs,
        // and we start at zero or do <=.
        // console.log(gridSize)
        $('button').css({
            'transition': 'all 2s',
            'opacity': '0',
            'visibility': 'invisible'
        })
        $('h1').css({
            'transition': 'all 2s',
            'opacity': '0',
            'visibility': 'invisible'
        })
        let cards = []
        for (let i = 1; i <= gridSize/2; i++){
            let monsterNumber="0"+i
            if (i>9){
                monsterNumber = i
            }
            cards.push(`<img src="./images/monsters-${monsterNumber}.png" />`)
            cards.push(`<img src="./images/monsters-${monsterNumber}.png" />`)
        }
        shuffleDeck(cards)
        let memoryHTML=``
        cards.forEach((card)=>{
            memoryHTML+=`
            <div class="card col-sm-3">
                <div class="card-holder">
                    <div class="card-front">${card}</div>
                    <div class="card-back"></div>
                </div>
            </div>
            `    
        })
        $('.memory-game').html(memoryHTML)
        // user just clicked on a card
        $('.card-holder').click(function(){
            $(this).addClass('flip')
            let cardsUp=$('.flip')
            if (cardsUp.length ===2){
                console.log('two cards')
                const card1=cardsUp[0]
                const card2=cardsUp[1]
                if (card1.innerHTML==card2.innerHTML){
                    // match!
                    cardsUp.removeClass('flip')
                    cardsUp.addClass('matched')
                    console.log('match')
                } else{
                    setTimeout(()=>{
                        cardsUp.removeClass('flip')
                    }, 2000)
                    // js is too fast, so we have to make it wait a sec

                }
            }
        })
    }) 
    function shuffleDeck(deckToBeShuffled) {
        // loop. A lot. Like those machines in casinos that 
        // make funny noises.
        for (let i=0; i<35; i++){
            let rand1 = Math.floor(Math.random()*deckToBeShuffled.length)
            let rand2 = Math.floor(Math.random()*deckToBeShuffled.length)
            // we need to switch deckToBeShuffled[rand1] with deckToBeShuffled[rand2].
            // But we have to save the value of the one to keep it for later
            let cardHolder = deckToBeShuffled[rand1]
            deckToBeShuffled[rand1]=deckToBeShuffled[rand2]
            deckToBeShuffled[rand2]= cardHolder 
        }
        return deckToBeShuffled
    }
})