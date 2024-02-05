window.onload = async function(){
    const postsData = await fetch("/getBlogPosts").then(function(response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
        return response.json();
    }).then(function(res) {
        // Loop through blog post data from Prismic and add to blog post object
        // then add object to blog posts array
        let blogPosts = [];
        res.forEach((blog) => {
            let blogPost = {};
            let id = blog.uid;
            let title = blog.data.title;
            let rawDate = new Date(blog.data.date_created);
            let dayNum = rawDate.getDate();
            let day = ordinalSuffix(dayNum);
            let month = rawDate.toLocaleString('default', { month: 'long' });
            let year = rawDate.getFullYear();
            let dateCreated = day + " " + month + " " + year;
            let content = blog.data.content;
            let tags = blog.data.tags.split(',');
            blogPost.id = id;
            blogPost.title = title;
            blogPost.dateCreated = dateCreated;
            blogPost.content = content;
            blogPost.tags = tags;
            blogPosts.push(blogPost);
        });
        
        // Add blog posts to article section
        let articleDiv = document.getElementById("article-div");
        let quickNav = document.getElementById("quick-nav");
        let article = '';
        let quickNavLinks = '';
        blogPosts.forEach((blog) => {
            let id = blog.id;
            // Loop through title objects
            let titleObjs = blog.title;
            let titles = [];
            titleObjs.forEach((title) => {
                title = title.text;
                titles.push(title);
            });
            // Loop through content objects
            let contentObjs = blog.content;
            let paragraphs = [];
            contentObjs.forEach((paragraph) => {
                paragraph = paragraph.text;
                paragraphs.push(paragraph);
            });
            let dateCreated = blog.dateCreated;
            // Loop through tags and add hash
            let tags = blog.tags;
            let hashtags = [];
            tags.forEach((tag) => {
                tag = '#' + tag;
                hashtags.push(tag);
            })

            // Add data to article HTML
            article += '<article id="' + id + '" class="inner-panel">';
            article += '<h3>' + titles + '</h3>';
            article += '<h4 class="entry-date">' + dateCreated + '</h4>';
            paragraphs.forEach((paragraph) => {
                article += '<p>' + paragraph + '</p>';
            })
            article += '<p class="tag">';
            hashtags.forEach((tag) => {
                article += tag + '&nbsp;&nbsp;';
            })
            article += '</p>';
            article += '</article>';
            article += '<div class="separator"><hr></div>';

            // Create quick nav links
            quickNavLinks += '<li><a href="#' + id + '">' + titles + '</a></li>';
        });
        articleDiv.innerHTML = article;
        quickNav.innerHTML = quickNavLinks;
    });
};

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
