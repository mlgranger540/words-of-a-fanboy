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
                let fandomName = fandom.fandom_name;
                let fandomImageSrc = fandom.fandom_image.url;
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
            let fandomName = fandom.fandomName;
            let fandomImageSrc = fandom.fandomImageSrc;
            let fandomImageAlt = fandom.fandomImageAlt;

            // Add content to fandom box
            fandomBox += `<div class="fandom-box col-3" style="background-image: url(${fandomImageSrc}); background-size: cover">`;
            fandomBox += `<h4 class="fandom-name">${fandomName}</h4></div>`
        })
        fandomRow.innerHTML = fandomBox;
    })
}
