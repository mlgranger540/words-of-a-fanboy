window.onload = async function(){
    const postsData = await fetch("/getPostsWithFandoms").then(function(response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
        return response.json();
    }).then(function(res) {
        // Loop through blog post data from Prismic and add fandom name and image info to fandom object
        let fandoms = [];
        res.forEach((blog) => {
            let rawFandoms = blog.data.fandoms;
            rawFandoms.forEach((fandom) => {
                let fandomObj = {};
                let fandomID = fandom.fandom_id;
                let fandomName = fandom.fandom_name;
                let fandomImageSrc = fandom.fandom_image.url;
                fandomObj.fandomID = fandomID;
                fandomObj.fandomName = fandomName;
                fandomObj.fandomImageSrc = fandomImageSrc;
                // If fandom name is not already present in an object in fandoms array, add new fandom object
                if (!fandoms.find(x => x.fandomName === `${fandomName}`)) {
                    fandoms.push(fandomObj);
                }
            })
        })
        // Sort fandoms array alphabetically by fandom name
        fandoms.sort((a, b) => a.fandomName.localeCompare(b.fandomName));

        let fandomRow = document.getElementById("fandom-row");
        let fandomBox = '';
        fandoms.forEach((fandom) => {
            let fandomID = fandom.fandomID;
            let fandomName = fandom.fandomName;
            let fandomImageSrc = fandom.fandomImageSrc;

            // Add content to fandom box
            fandomBox += '<div class="col-xl-3 col-lg-4 col-md-6 col-12">';
            fandomBox += `<a class="fandom-link" href="fandom/${fandomID}">`;
            fandomBox += `<div class="fandom-box" style="background-image: url(${fandomImageSrc}); background-size: cover; background-position: center center">`;
            fandomBox += `<h4 class="fandom-name">${fandomName}</h4></div></a></div>`;
        })
        fandomRow.innerHTML = fandomBox;
    })

    // Sticky navbar
    var navbar = document.getElementById("navbar");
    var offsetTop = navbar.offsetTop;
    
    // When scrolling past navbar, add sticky class and remove transparency
    // When scrolling back up, remove sticky class and add transparency
    function stick(){
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
