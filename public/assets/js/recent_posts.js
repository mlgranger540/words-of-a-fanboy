window.onload = async function(){
    const postsData = await fetch("/getRecentPosts").then(function(response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
        return response.json();
    }).then(function(res) {
        // Loop through blog post data from Prismic and add to post object
        // then add object to posts array
        let posts = [];
        res.forEach((blog) => {
            let post = {};
            let id = blog.uid;
            let title = blog.data.title;
            let rawDate = new Date(blog.data.date_written);
            let dayNum = rawDate.getDate();
            let day = ordinalSuffix(dayNum);
            let month = rawDate.toLocaleString('default', { month: 'long' });
            let year = rawDate.getFullYear();
            let dateWritten = day + " " + month + " " + year;
            let rawDateEd = new Date(blog.data.date_edited);
            let dayEdNum = rawDateEd.getDate();
            let dayEd = ordinalSuffix(dayEdNum);
            let monthEd = rawDateEd.toLocaleString('default', { month: 'short' });
            let yearEd = rawDateEd.getFullYear();
            let dateEdited = dayEd + " " + monthEd + " " + yearEd;
            let type = blog.data.type;
            let topics = blog.data.topics;
            let fandoms = blog.data.fandoms;
            let content = blog.data.content;
            post.id = id;
            post.title = title;
            post.dateWritten = dateWritten;
            post.dateEdited = dateEdited;
            post.type = type;
            post.topics = topics;
            post.fandoms = fandoms;
            post.content = content;
            posts.push(post);
        });
        
        // Add blog posts to article section
        let articleDiv = document.getElementById("article-div");
        let quickNav = document.getElementById("quick-nav");
        let article = '';
        let quickNavLinks = '';
        posts.forEach((blog) => {
            let id = blog.id;
            // Loop through title objects
            let titleObjs = blog.title;
            let title = [];
            titleObjs.forEach((ttl) => {
                ttl = ttl.text;
                title.push(ttl);
            });
            let type = blog.type;
            let dateWritten = blog.dateWritten;
            let dateEdited = blog.dateEdited;
            // Loop through content objects
            let contentObjs = blog.content;
            let paragraphs = [];
            contentObjs.forEach((paragraph) => {
                paragraph = paragraph.text;
                paragraphs.push(paragraph);
            });
            let hashtags = [];
            // Loop through fandom objects - if there's a fandom, add hash and add to hashtags
            let fandoms = blog.fandoms;
            fandoms.forEach((fandom) => {
                if (fandom.fandom != 'No Fandom') {
                    fandom = fandom.fandom;
                    fandom = '#' + fandom;
                    hashtags.push(fandom);
                }
            })
            // Loop through topics, add hash and add to hashtags
            let topics = blog.topics;
            topics.forEach((topic) => {
                topic = topic.topic;
                topic = '#' + topic;
                hashtags.push(topic);
            })

            // Add data to article HTML
            article += `<article id="${id}" class="inner-panel">`;
            article += `<h3><a class="post-title-link" href="/post/${id}">${title}</a></h3>`;
            article += `<h4>${type}&ensp;|&ensp;<span class="entry-date">${dateWritten}</span></h4>`;
            // Loop through paragraphs and add first four
            for (let i = 0; i < 4; i++) {
                article += `<p>${paragraphs[i]}</p>`;
            };
            article += '<p class="tbc-dots">...</p>'
            article += '</div>';
            article += `<p class="read-more"><a class="read-more-link" href="/post/${id}">Read More</a></p>`;
            article += '<p class="tag">';
            hashtags.forEach((tag) => {
                article += `${tag}&nbsp;&nbsp;`;
            })
            article += '</p>';
            article += '</article>';
            article += '<div class="separator"><hr></div>';

            // Create quick nav links
            quickNavLinks += '<li><a href="#' + id + '">' + title + '</a></li>';
        });
        articleDiv.innerHTML = article;
        quickNav.innerHTML = quickNavLinks;
    });

    // Sticky navbar
    var navbar = document.getElementById("navbar");
    var sidebar = document.getElementById("sidebar-panel");
    var offsetTop = navbar.offsetTop;
    
    // When scrolling past navbar, add sticky class and remove transparency
    // When scrolling back up, remove sticky class and add transparency
    function stick(){
        if (window.scrollY >= offsetTop) {
            navbar.classList.remove("absolute");
            navbar.classList.add("sticky");
            navbar.style.backgroundColor = "rgba(49, 51, 74, 1)";
            sidebar.classList.add("sticky-2");
        } else {
            navbar.classList.remove("sticky");
            sidebar.classList.remove("sticky-2");
            navbar.classList.add("absolute");
            navbar.style.backgroundColor = "rgba(49, 51, 74, 0.5)";
        }
    }

    window.addEventListener("scroll", stick);

    // Add current year to copyright line
    var year = new Date().getFullYear();
    document.getElementById("year").innerHTML = year + " ";
};

// If collapsed navbar content is visible, make it not visible on click
// If it's not visible, make it visible
function openNav(){
    var collapsedNavbar = document.getElementById("collapsed-content");
    if (collapsedNavbar.style.display === "block") {
        collapsedNavbar.style.display = "none";
    } else {
        collapsedNavbar.style.display = "block";
    }
};

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
};
