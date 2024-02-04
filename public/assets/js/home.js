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
            let title = blog.data.title;
            let rawDate = new Date(blog.data.date_created);
            let day = rawDate.getDate();
            let month = rawDate.toLocaleString('default', { month: 'long' });
            let year = rawDate.getFullYear();
            let dateCreated = day + " " + month + " " + year;
            let content = blog.data.content;
            let tags = blog.data.tags.split(',');
            blogPost.title = title;
            blogPost.dateCreated = dateCreated;
            blogPost.content = content;
            blogPost.tags = tags;
            blogPosts.push(blogPost);
        });
        
        // Add blog posts to article section
        let articleDiv = document.getElementById("article-div");
        let article = '';
        blogPosts.forEach((blog) => {
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
          article += '<article class="inner-panel">';
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
        });
        articleDiv.innerHTML = article;
      });
};
