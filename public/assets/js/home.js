window.onload = async function(){
    const postsData = await fetch("/getBlogPosts").then((res)=>{
        console.log(res.body);
    });
};
