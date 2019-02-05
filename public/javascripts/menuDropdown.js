
function menuDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
    // $('#myDropdown').show();
  }
  
  // Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
        }
    }
}

function genreDropdown() {
    document.getElementById("my-genre-dropdown").classList.toggle("show");
    // $('#myDropdown').show();
  }

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}


$(function rating() {
    let userLiked = 1;
    $("#likeId").click(function () {
        var input = $(this).find('.likeClass');
        input.val(parseInt(input.val())+ 1);
        userLiked = 1;
    });
    $("#dislikeId").click(function () {
        var input = $(this).find('.dislikeClass');
        input.val(input.val() - 1);
        userLiked = 0;
    });
});




function empty() {
    var x;
    x = document.getElementById("titleId").value;
    if (x == "") {
        alert("Don't forget a book title!");
        return false;
    };
}