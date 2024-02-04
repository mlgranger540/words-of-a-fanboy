window.onload = async function(){
    const postsData = await fetch("/getBlogPosts").then(function(response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
        return response.json();
      }).then(function(res) {
        res.forEach(blog => {
            console.log(blog.data.title)
            console.log(blog.data.content)
            console.log(blog.data.tags.split(','))
            console.log(blog.data.created_date)
        });
      })
};
