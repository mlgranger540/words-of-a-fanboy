window.onload = async function(){
    const postData = await fetch(`/getPost${window.location.pathname}`).then(function(response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
        return response.json();
    }).then(function(res) {
        // Add blog post data from Prismic to post object
        let post = {};
        let id = res.uid;
        let title = res.data.title;
        let rawDate = new Date(res.data.date_created);
        let dayNum = rawDate.getDate();
        let day = ordinalSuffix(dayNum);
        let month = rawDate.toLocaleString('default', { month: 'long' });
        let year = rawDate.getFullYear();
        let dateCreated = day + " " + month + " " + year;
        let content = res.data.content;
        let tags = res.data.tags.split(',');
        post.id = id;
        post.title = title;
        post.dateCreated = dateCreated;
        post.content = content;
        post.tags = tags;

        // Add post to post section
        let articleDiv = document.getElementById("article-div");
        let article = '';
        // Loop through title objects
        let titleObjs = post.title;
        let title2 = [];
        titleObjs.forEach((ttl) => {
            ttl = ttl.text;
            title2.push(ttl);
        });
        // Loop through content objects
        let contentObjs = post.content;
        let paragraphs = [];
        contentObjs.forEach((paragraph) => {
            paragraph = paragraph.text;
            paragraphs.push(paragraph);
        });
        // Loop through tags and add hash
        let tags2 = post.tags;
        let hashtags = [];
        tags2.forEach((tag) => {
            tag = '#' + tag;
            hashtags.push(tag);
        })

        // Add data to article HTML
        article += '<article id="' + id + '" class="inner-panel">';
        article += '<h3><a class="post-title-link" href="/post/' + id + '">' + title2 + '</a></h3>';
        article += '<h4 class="entry-date">' + dateCreated + '</h4>';
        paragraphs.forEach((paragraph) => {
            article += '<p>' + paragraph + '</p>';
        });
        article += '<p class="tag">';
        hashtags.forEach((tag) => {
            article += tag + ' &ensp;';
        });
        article += '</p>';
        article += '</article>';
        articleDiv.innerHTML = article;
    });

    // Add current year to copyright line
    var year = new Date().getFullYear();
    document.getElementById("year").innerHTML = year + " ";
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
