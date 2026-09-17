window.onload = async function(){
    const postsData = await fetch(`/getRecentPosts${window.location.pathname}`).then(function(response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
        return response.json();
    }).then(function(res) {
        // Get posts from paginated response
        let results = res.results;
        let totalPages = res.total_pages;
        let currentPage = res.page;
        // Loop through blog post data from Prismic and add to post object
        // then add object to posts array
        let posts = [];
        results.forEach((blog) => {
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
        })
        
        // Add blog posts to article section
        let articleDiv = document.getElementById("article-div");
        let quickNav = document.getElementById("quick-nav");
        let article = '';
        let quickNavLinks = '';
        posts.forEach((blog) => {
            let id = blog.id;
            // Loop through title objects and push to title array
            let titleObjs = blog.title;
            let title = [];
            titleObjs.forEach((ttl) => {
                ttl = ttl.text;
                title.push(ttl);
            });
            let type = blog.type;
            let dateWritten = blog.dateWritten;
            let dateEdited = blog.dateEdited;
            // Loop through content objects and push to paragraphs array
            let contentObjs = blog.content;
            let paragraphs = [];
            contentObjs.forEach((paragraph) => {
                paragraph = paragraph.text;
                paragraphs.push(paragraph);
            });
            let hashtags = [];
            // Loop through fandom objects - if there's a fandom, add hash and push to hashtags array
            let fandoms = blog.fandoms;
            fandoms.forEach((fandom) => {
                if (fandom.fandom_name !== 'No Fandom') {
                    fandom = fandom.fandom_name;
                    fandom = '#' + fandom;
                    if (!hashtags.includes(fandom)) {
                        hashtags.push(fandom);
                    }
                }
            })
            // Loop through topics, add hash and push to hashtags array
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
                if (paragraphs[i] === undefined) {
                    break;
                } else {
                    article += `<p>${paragraphs[i]}</p>`;
                }
            };
            article += '<p class="tbc-dots">...</p>';
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
            quickNavLinks += `<li><a href="#${id}">${title}</a></li>`;
        })

        // Create pagination div
        let paginationDiv = '';
        paginationDiv += '<div id="pagination" class="pagination"><button id="prev" class="pagination-link" type="button"></button>';
        paginationDiv += '<div id="page-link-div" class="pagination-link"></div>';
        paginationDiv += '<button id="next" class="pagination-link" type="button"></button>';

        // Add articles, pagination and quick nav links to page
        articleDiv.innerHTML = article;
        articleDiv.innerHTML += paginationDiv;
        quickNav.innerHTML = quickNavLinks;

        let prevButton = document.getElementById('prev');
        let nextButton = document.getElementById('next');
        let pageLinkDiv = document.getElementById('page-link-div');

        // Add page number links for number of pages
        for (let i = 0; i < totalPages; i++) {
            // Make first page number link to home
            if (i < 1) {
                // Add active class to current page number link
                if (i === (currentPage - 1)) {
                    pageLinkDiv.innerHTML += `<button class="active pagination-link page-link" type="button"><a href="./">${i+1}</a></button>`;
                } else {
                    pageLinkDiv.innerHTML += `<button class="pagination-link page-link" type="button"><a href="./">${i+1}</a></button>`;
                }
            } else {
                // Add active class to current page number link
                if (i === (currentPage - 1)) {
                    pageLinkDiv.innerHTML += `<button class="active pagination-link page-link" type="button"><a href="./page-${i+1}">${i+1}</a></button>`;
                } else {
                    pageLinkDiv.innerHTML += `<button class="pagination-link page-link" type="button"><a href="./page-${i+1}">${i+1}</a></button>`;
                }
            }
        }

        // Function to update previous/next buttons based on the current page
        function updatePagination() {
            // On homepage, disable previous button and enable next
            if (currentPage === 1) {
                prevButton.disabled = true;
                nextButton.disabled = false;
                prevButton.innerHTML = '<a>Previous</a>';
                nextButton.innerHTML = `<a href="./page-${currentPage+1}">Next</a>`;
            // On page 2, make previous button link to home
            } else if (currentPage === 2) {
                prevButton.disabled = false;
                nextButton.disabled = false;
                prevButton.innerHTML = '<a href="./">Previous</a>';
                // If there are only two pages total, disable next button, otherwise enable it
                if (currentPage === totalPages) {
                    nextButton.disabled = true;
                    nextButton.innerHTML = '<a>Next</a>';
                } else {
                    nextButton.disabled = false;
                    nextButton.innerHTML = `<a href="./page-${currentPage+1}">Next</a>`;
                }
            // On the last page, disable next button and enable previous
            } else if (currentPage === totalPages) {
                prevButton.disabled = false;
                nextButton.disabled = true;
                prevButton.innerHTML = `<a href="./page-${currentPage-1}">Previous</a>`;
                nextButton.innerHTML = '<a>Next</a>';
            // On any other pages, enable both buttons and make them link back/forward one page
            } else {
                prevButton.disabled = false;
                nextButton.disabled = false;
                prevButton.innerHTML = `<a href="./page-${currentPage-1}">Previous</a>`;
                nextButton.innerHTML = `<a href="./page-${currentPage+1}">Next</a>`;
            };
        }

        // Initial page load 
        updatePagination();
    })

    // Sticky navbar
    var navbar = document.getElementById("navbar");
    var sidebar = document.getElementById("sidebar-panel");
    var navOffsetTop = navbar.offsetTop;
    var navbarHeight = navbar.offsetHeight;
    var sidebarOffsetTop = sidebar.offsetTop;
    
    // When scrolling past navbar, add sticky class and remove transparency
    // When scrolling back up, remove sticky class and add transparency
    function stick() {
        if (window.scrollY >= navOffsetTop) {
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

    // function stickSide() {
    //     if (window.scrollY + navbarHeight >= sidebarOffsetTop) {
    //         sidebar.classList.add("sticky-2");
    //     } else {
    //         sidebar.classList.remove("sticky-2");
    //     }
    // }

    window.addEventListener("scroll", stick);
    // window.addEventListener("scroll", stickSide);

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
