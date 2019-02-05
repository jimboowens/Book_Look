// let value = $('#author').val()
// console.log(value)
document.getElementsByName("author")[0]

$('#author').on('input', function autocompleteTest(input){
    if(input.length>=3){
        console.log('it works')
    }
})

// function autocompleteTest(input){
//     if(input.length>=3){
//         console.log('it works')
//     }
// }