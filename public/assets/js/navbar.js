window.onload = async function(){
    var navbar = document.getElementById("navbar");
    var sidebar = document.getElementById("sidebar-panel");
    var offsetTop = navbar.offsetTop;
    
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
};
