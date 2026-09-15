window.onload = async function(){
    const postData = await fetch(`/getPostsByFandom${window.location.pathname}`).then(function(response) {
        // The response is a Response instance.
        // You parse the data into a useable format using `.json()`
        return response.json();
    }).then(function(res) {
        console.log(res);
    })
}
