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
            let type = blog.data.type;
            let fandoms = blog.data.fandoms;
            post.id = id;
            post.title = title;
            post.dateWritten = dateWritten;
            post.type = type;
            post.fandoms = fandoms;
            posts.push(post);
        })
        
        // Add blog posts to article section
        let articleDiv = document.getElementById("article-div");
        let article = '';
        article += '<div class="inner-panel">';
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
            let fandoms = blog.fandoms;

            // Add data to article HTML
            article += `<article id="${id}" class="inner-panel-thin">`;
            article += `<h3 class="archive-entry-title"><a class="post-title-link" href="/post/${id}">${title}</a><span class="archive-entry-date"> – ${dateWritten}</span></h3>`;
            article += `<h4 class="archive-entry-details">${type}`;
            for (let i = 0; i < fandoms.length; i++) {
                if (fandoms[i].fandom_name !== 'No Fandom') {
                    if (fandoms.length < 2) {
                        article += `: ${fandoms[i].fandom_name} (${fandoms[i].fandom_type})`;
                    } else if (fandoms.length < 3) {
                        if (i < 1) {
                            article += `: ${fandoms[i].fandom_name} (${fandoms[i].fandom_type}) and `;
                        } else {
                            article += `${fandoms[i].fandom_name} (${fandoms[i].fandom_type})`;
                        }
                    } else {
                        if (i < 1) {
                            article += `: ${fandoms[i].fandom_name} (${fandoms[i].fandom_type}), `;
                        } else if (i < (fandoms.length - 2)) {
                            article += `${fandoms[i].fandom_name} (${fandoms[i].fandom_type}), `;
                        } else if (i < (fandoms.length - 1)) {
                            article += `${fandoms[i].fandom_name} (${fandoms[i].fandom_type}) and `;
                        } else {
                            article += `${fandoms[i].fandom_name} (${fandoms[i].fandom_type})`;
                        }
                    }
                }
            }
            article += '</h4></article>';
        })
        article += '</div><div class="separator"><hr></div>';

        // Create pagination div
        let paginationDiv = '';
        paginationDiv += '<div id="pagination" class="pagination"><button id="prev" class="pagination-link" type="button"></button>';
        paginationDiv += '<div id="page-link-div" class="pagination-link"></div>';
        paginationDiv += '<button id="next" class="pagination-link" type="button"></button>';

        // Add articles, pagination and quick nav links to page
        articleDiv.innerHTML = article;
        articleDiv.innerHTML += paginationDiv;

        let prevButton = document.getElementById('prev');
        let nextButton = document.getElementById('next');
        let pageLinkDiv = document.getElementById('page-link-div');

        // Add page number links for number of pages
        for (let i = 0; i < totalPages; i++) {
            // Add active class to current page number link
            if (i === (currentPage - 1)) {
                pageLinkDiv.innerHTML += `<button class="active pagination-link page-link" type="button"><a href="./${i+1}">${i+1}</a></button>`;
            } else {
                pageLinkDiv.innerHTML += `<button class="pagination-link page-link" type="button"><a href="./${i+1}">${i+1}</a></button>`;
            }
        }

        // Function to update previous/next buttons based on the current page
        function updatePagination() {
            // On homepage, disable previous button
            if (currentPage === 1) {
                prevButton.disabled = true;
                nextButton.disabled = false;
                prevButton.innerHTML = '<a>Previous</a>';
                // If there's only one page total, disable next button, otherwise enable it
                if (currentPage === totalPages) {
                    nextButton.disabled = true;
                    nextButton.innerHTML = '<a>Next</a>';
                } else {
                    nextButton.disabled = false;
                    nextButton.innerHTML = `<a href="./${currentPage+1}">Next</a>`;
                }
            // On the last page, disable next button and enable previous
            } else if (currentPage === totalPages) {
                prevButton.disabled = false;
                nextButton.disabled = true;
                prevButton.innerHTML = `<a href="./${currentPage-1}">Previous</a>`;
                nextButton.innerHTML = '<a>Next</a>';
            // On any other pages, enable both buttons and make them link back/forward one page
            } else {
                prevButton.disabled = false;
                nextButton.disabled = false;
                prevButton.innerHTML = `<a href="./${currentPage-1}">Previous</a>`;
                nextButton.innerHTML = `<a href="./${currentPage+1}">Next</a>`;
            };
        }

        // Initial page load 
        updatePagination();
    })

    // Sticky navbar
    var navbar = document.getElementById("navbar");
    var sidebar = document.getElementById("sidebar-panel");
    var navOffsetTop = navbar.offsetTop;
    
    // When scrolling past navbar, add sticky class and remove transparency
    // When scrolling back up, remove sticky class and add transparency
    function stick() {
        if (window.scrollY >= navOffsetTop) {
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
