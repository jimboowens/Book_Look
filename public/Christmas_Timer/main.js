title = "Countdown timer "
position = 0

function scrolltitle() {
   document.title = title.substring(position, title.length) + title.substring(0, position)
   position++
   if (position > title.length) position = 0
   titleScroll = window.setTimeout(scrolltitle,250)
}
scrolltitle()

var button = document.getElementsByClassName('button')[0]
function updateTimer(){
    var now = new Date()
    var nowAsTimestamp = now.getTime()
    var timeRemaining = timeStamp - nowAsTimestamp
    
    var seconds = Math.floor((timeRemaining / 1000) % 60)
	var minutes = Math.floor((timeRemaining / 1000 / 60) % 60)
	var hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24)
	var days = Math.floor((timeRemaining / (1000 * 60 * 60 * 24)) % 7)
    var weeks = Math.floor(timeRemaining / (1000 * 60 * 60 * 24 * 7))
    
    document.querySelector('.seconds').innerHTML = seconds
    document.querySelector('.minutes').innerHTML = minutes
    document.querySelector('.hours').innerHTML = hours
    document.querySelector('.days').innerHTML = days
    document.querySelector('.weeks').innerHTML = weeks
    
    if (seconds > 55){
        document.querySelector('.message').innerHTML = `Hooray, another minute closer to Christmas!`
    } else {
        document.querySelector('.message').innerHTML = ``
    }
}

function newDate(){
    var updatedDate = new Date(prompt("What new date would you like?"))
    timeStamp = updatedDate.getTime()
}

button.addEventListener('click', newDate)
var endDate = new Date("December 25, 2018");
timeStamp = endDate.getTime()
setInterval(updateTimer,1000)

