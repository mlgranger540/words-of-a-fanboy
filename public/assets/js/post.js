window.onload = async function(){
    const postData = await fetch(`/getPost${window.location.pathname}`).then(function(response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
        return response.json();
    }).then(function(res) {
        let doc = res.document;
        // Add blog post data from Prismic to post object
        let post = {};
        let id = doc.uid;
        let rawTitle = doc.data.title;
        let rawDate = new Date(doc.data.date_written);
        let dayNum = rawDate.getDate();
        let day = ordinalSuffix(dayNum);
        let month = rawDate.toLocaleString('default', { month: 'long' });
        let year = rawDate.getFullYear();
        let dateWritten = day + " " + month + " " + year;
        let rawDateEd = new Date(doc.data.date_edited);
        let dayEdNum = rawDateEd.getDate();
        let dayEd = ordinalSuffix(dayEdNum);
        let monthEd = rawDateEd.toLocaleString('default', { month: 'short' });
        let yearEd = rawDateEd.getFullYear();
        let dateEdited = dayEd + " " + monthEd + " " + yearEd;
        let type = doc.data.type;
        let rawTopics = doc.data.topics;
        let rawFandoms = doc.data.fandoms;
        let contentHTML = res.content;
        post.id = id;
        post.rawTitle = rawTitle;
        post.dateWritten = dateWritten;
        post.dateEdited = dateEdited;
        post.type = type;
        post.rawTopics = rawTopics;
        post.rawFandoms = rawFandoms;
        post.contentHTML = contentHTML;

        // Add post to post section
        let articleDiv = document.getElementById("article-div");
        let article = '';
        // Loop through title objects and push to title array
        let title = [];
        rawTitle.forEach((ttl) => {
            ttl = ttl.text;
            title.push(ttl);
        })
        // Update page title with selected post title
        document.title = title + " | In the Words of a Fanboy";
        let hashtags = [];
        // Loop through fandom objects - if there's a fandom, add hash
        rawFandoms.forEach((fandom) => {
            if (fandom.fandom_name !== 'No Fandom') {
                fandom = fandom.fandom_name;
                fandom = '#' + fandom;
                // If it's not already in the list, and push to hashtags array
                if (!hashtags.includes(fandom)) {
                    hashtags.push(fandom);
                }
            }
        })
        // Loop through topics, add hash and push to hashtags array
        rawTopics.forEach((topic) => {
            topic = topic.topic;
            topic = '#' + topic;
            hashtags.push(topic);
        })

        // Add data to article HTML
        article += `<article id="${id}" class="inner-panel-clear col-lg-10 col-12">`;
        article += `<h3><a class="post-title-link" href="/post/${id}">${title}</a></h3>`;
        article += `<h4><span class="entry-date">${dateWritten}</span></h4>`;
        article += `<h4>${type}`;
        for (let i = 0; i < rawFandoms.length; i++) {
            if (rawFandoms[i].fandom_name !== 'No Fandom') {
                if (rawFandoms.length < 2) {
                    article += `: ${rawFandoms[i].fandom_name} (${rawFandoms[i].fandom_type})`;
                    if (rawFandoms[i].series_number !== null) {
                        article += ` ${rawFandoms[i].series_number}`;
                    }
                    if (rawFandoms[i].section_number !== null) {
                        article += ` ${rawFandoms[i].section_number}`;
                    }
                } else if (rawFandoms.length < 3) {
                    if (i < 1) {
                        article += `: ${rawFandoms[i].fandom_name} (${rawFandoms[i].fandom_type}) and `;
                    } else {
                        article += `${rawFandoms[i].fandom_name} (${rawFandoms[i].fandom_type})`;
                    }
                } else {
                    if (i < 1) {
                        article += `: ${rawFandoms[i].fandom_name} (${rawFandoms[i].fandom_type}), `;
                    } else if (i < (rawFandoms.length - 2)) {
                        article += `${rawFandoms[i].fandom_name} (${rawFandoms[i].fandom_type}), `;
                    } else if (i < (rawFandoms.length - 1)) {
                        article += `${rawFandoms[i].fandom_name} (${rawFandoms[i].fandom_type}) and `;
                    } else {
                        article += `${rawFandoms[i].fandom_name} (${rawFandoms[i].fandom_type})`;
                    }
                }
            }
        }
        article += `</h4>`;
        article += contentHTML;
        article += '<p class="tag">';
        hashtags.forEach((tag) => {
            article += `${tag} &ensp;`;
        })
        article += '</p>';
        article += '</article>';
        articleDiv.innerHTML = `<div id="post-background" class="row">${article}</div>`;
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

// Add ordinal suffixes to numbers in date
function ordinalSuffix(day){
    if (day % 10 == 1 && day != 11){
        return day + 'st';
    } else if (day % 10 == 2 && day != 12){
        return day + 'nd';
    } else if (day % 10 == 3 && day != 13){
        return day + 'rd';
    } else {
        return day + 'th';
    }
}
