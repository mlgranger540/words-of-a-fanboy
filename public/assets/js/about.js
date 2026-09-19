window.onload = async function(){
    const postData = await fetch("/getAboutInfo/about_info/about").then(function(response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
        return response.json();
    }).then(function(res) {
        let content1HTML = res.content1;
        let content2HTML = res.content2;

        let contentPara1 = document.getElementById("content-1");
        let contentPara2 = document.getElementById("content-2");
        contentPara1.innerHTML = content1HTML;
        contentPara2.innerHTML = content2HTML;
    })

    // Sticky navbar
    var navbar = document.getElementById("navbar");
    var offsetTop = navbar.offsetTop;
    
    // When scrolling past navbar, add sticky class and remove transparency
    // When scrolling back up, remove sticky class and add transparency
    function stick() {
        if (window.scrollY >= offsetTop) {
            navbar.classList.remove("absolute");
            navbar.classList.add("sticky");
            navbar.style.backgroundColor = "rgba(49, 51, 74, 1)";
        } else {
            navbar.classList.remove("sticky");
            navbar.classList.add("absolute");
            navbar.style.backgroundColor = "rgba(49, 51, 74, 0.5)";
        }
    }

    window.addEventListener("scroll", stick);

    // Add current year to copyright line
    var year = new Date().getFullYear();
    document.getElementById("year").innerHTML = year + " ";
}

// If collapsed navbar content is visible, make it not visible on click
// If it's not visible, make it visible
function openNav(){
    var collapsedNavbar = document.getElementById("collapsed-content");
    if (collapsedNavbar.style.display === "block") {
        collapsedNavbar.style.display = "none";
    } else {
        collapsedNavbar.style.display = "block";
    }
}
