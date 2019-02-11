// let backdrop = document.querySelector('.backdrop');
// let modal1 = document.querySelector('.modal-1');
// let orb1 = document.querySelector('.orb-1');
let toggle = 'hidden';
let map = document.querySelector('#map');


$('.backdrop').on('click', function () {
    backdrop.style.display = 'none';
    modal1.style.display = 'none';
    map.style.display = 'none';
    toggle = 'hidden';
})


$('.submit-button').click((event) => {
    event.preventDefault()
    backdrop.style.display = 'block';
    if (toggle == 'hidden'){
        map.style.display = 'block';
        toggle = 'displayed'
    }else{
        map.style.display = 'none';
        toggle = 'hidden'
    }
    let windowWidth = window.innerWidth;
    const mapEdge = $('.circle').offset()
    const mobileMapEdge = $('.compass').offset();
    if (windowWidth > 1024) {
        $('#map').offset({ top: mapEdge.top + 50, left: mapEdge.left + 50 });
    } else if (windowWidth <= 1024 && windowWidth >= 768) {
        $('#map').offset({ top: mapEdge.top + 25, left: mapEdge.left + 25});
    } else if (windowWidth <= 768) {
        $('#map').css('width',  '350');
        $('#map').css('height', '350');
        $('#map').offset({ bottom: mobileMapEdge.top + 100, left: mobileMapEdge.left - 125});
    }
    // const mapEdge = $('.circle').offset()
    // $('#map').offset({ top: mapEdge.top+50, left: mapEdge.left+50 });
})

$(window).resize(function () {
    const mapEdge = $('.circle').offset()
    $('#map').offset({ top: mapEdge.top+50, left: mapEdge.left+50 });
});

farmInfo.forEach(element => {
    let mapURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${element.farmName}&key=${apiKey}`
    // console.log(element)
    $.getJSON(mapURL, (info)=>{
        let address = info.results[0].formatted_address
        let latLong = info.results[0].geometry.location
        element.address = address
        element.latLong = latLong
    })
})
// let apiPromise = new Promise((resolve, reject)=>{
//     resolve(element.latLong)
// })
// apiPromise.then((theDataFromResolve)=>{
//     console.log ('promise worked!')
// })
let windowArr = []
function closeOpenWindows(){
    windowArr.forEach(element=>{
        element.setMap(null)
    })
}

function initMap() {
    var gaMiddle = {lat: 32.838131, lng: -83.634705}
    var map = new google.maps.Map(document.getElementById('map'), {zoom: 7, center: gaMiddle})
    map.setMapTypeId(`terrain`)
    farmInfo.forEach(element => {
        let marker = new google.maps.Marker({
            position: element.latLong,
            map:map,
            icon: `./images/map_icon.png`,
            animation: google.maps.Animation.DROP
        })
        let infoWindow = new google.maps.InfoWindow({
            content: element.blurb
        }) 
        marker.addListener('click', function () {
            closeOpenWindows()
            infoWindow.open(map, marker)
        })
        marker.setMap(map)
        windowArr.push(infoWindow)
    })
}
