const animateButton = (element) => {

    element.preventDefault;

    element.target.classList.remove('animate');
    
    element.target.classList.add('animate');
    setTimeout(function(){
        element.target.classList.remove('animate');
    },700);
}
  
let particleButtons = document.getElementsByClassName('particle-button');
  
for (var i = 0; i < particleButtons.length; i++) {
    particleButtons[i].addEventListener('click', animateButton, false);
}