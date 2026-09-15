window.onload = async function(){
    const postsData = await fetch("/getAllPosts").then(function(response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
        return response.json();
    }).then(function(res) {
        // Loop through blog post data from Prismic
        let fandoms = [];
        let fandomTypes = [];
        let postTypes = [];
        res.forEach((blog) => {
            let rawFandoms = blog.data.fandoms;
            rawFandoms.forEach((fandom) => {
                // Add fandom name and image URL to fandom object
                let fandomObj = {};
                let fandomName = fandom.fandom_name;
                let fandomImageSrc = fandom.fandom_image.url;
                fandomObj.fandomName = fandomName;
                fandomObj.fandomImageSrc = fandomImageSrc;
                // If fandom name is not already present in an object in fandoms array, add new fandom object
                if (!fandoms.find(x => x.fandomName === `${fandomName}`)) {
                    if (fandomName !== "No Fandom") {
                        fandoms.push(fandomObj);
                    };
                };
                // If fandom type is not already present in fandom types array, add it
                let fandomType = fandom.fandom_type;
                if (!fandomTypes.includes(fandomType)) {
                    if (fandomType !== "No Fandom") {
                        fandomTypes.push(fandomType);
                    };
                };
            })
            // If post type is not already present in post types array, add it
            let postType = blog.data.type;
            if (!postTypes.includes(postType)) {
                postTypes.push(postType);
            };
        })
        // Sort arrays alphabetically
        fandoms.sort((a, b) => a.fandomName.localeCompare(b.fandomName));
        // fandomTypes.sort((a, b) => a.localeCompare(b));
        console.log(fandomTypes);
        console.log(postTypes);

        let fandomRow = document.getElementById("fandom-row");
        let fandomBox = '';
        fandoms.forEach((fandom) => {
            let fandomName = fandom.fandomName;
            // Make fandom ID by making fandom name lowercase and changing all spaces to hyphens
            let fandomID = fandomName.toLowerCase().replace(/ /g, "-");
            let fandomImageSrc = fandom.fandomImageSrc;

            // Add fandom name and image to fandom box
            fandomBox += '<div class="col-xl-3 col-lg-4 col-md-6 col-12">';
            fandomBox += `<a class="topic-link" href="fandom/${fandomID}">`;
            fandomBox += `<div class="topic-box" style="background-image: url(${fandomImageSrc}); background-size: cover; background-position: center center">`;
            fandomBox += `<h4 class="topic-name">${fandomName}</h4></div></a></div>`;
        })
        fandomRow.innerHTML = fandomBox;

        let fandomTypesRow = document.getElementById("fandom-types-row");
        let fandomTypeBox = '';
        fandomTypes.forEach((type) => {
            // Make fandom type ID by making type lowercase and changing all spaces to hyphens
            let fandomTypeID = type.toLowerCase().replace(/ /g, "-");
            // Add fandom type to fandom type box
            fandomTypeBox += '<div class="col-xl-3 col-lg-4 col-md-6 col-12">';
            fandomTypeBox += `<a class="topic-link" href="fandom-type/${fandomTypeID}">`;
            fandomTypeBox += `<div class="topic-box" style="background-image: url('assets/images/${fandomTypeID}.jpg'); background-size: cover; background-position: center center">`;
            fandomTypeBox += `<h4 class="topic-name">${type}</h4></div></a></div>`;
        })
        fandomTypesRow.innerHTML = fandomTypeBox;

        let postTypesRow = document.getElementById("post-types-row");
        let postTypeBox = '';
        postTypes.forEach((type) => {
            // Make post type ID by making type lowercase and changing all spaces to hyphens
            let postTypeID = type.toLowerCase().replace(/ /g, "-");
            // Add post type to post type box
            postTypeBox += '<div class="col-xl-3 col-lg-4 col-md-6 col-12">';
            postTypeBox += `<a class="topic-link" href="post-type/${postTypeID}">`;
            postTypeBox += `<div class="topic-box"><h4 class="topic-name">${type}</h4></div></a></div>`;
        })
        postTypesRow.innerHTML = postTypeBox;
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
