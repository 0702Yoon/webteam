let horizontalUnderLine = document.getElementById("horizontal-underline"); /*menu쪽 밑줄*/
let horizontalMenus = document.querySelectorAll("nav:first-child a");



const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.top_nav li');

function activateSection(section) {
  // remove active class from all nav items
  navItems.forEach(item => {
    item.classList.remove('active');
  });

  // find the corresponding nav item and add active class
  const id = section.getAttribute('id');
  const navItem = document.querySelector(`.top_nav li a[href="#${id}"]`);
  if (navItem) {
    navItem.parentNode.classList.add('active');
  }
}

function activateCurrentSection() {
  // find the section that is currently in view
  const currentSection = [...sections].reverse().find(section => {
    const rect = section.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  });

  // activate the corresponding nav item
  if (currentSection) {
    activateSection(currentSection);
  }
}

// activate initial section
activateCurrentSection();

// activate section on scroll
window.addEventListener('scroll', activateCurrentSection);


// 뒤집기 버튼 클릭 이벤트 처리

function flip() {
    const container = document.querySelector('.container');
    container.classList.toggle('flip');
  }

  
  // 목록 나오게
  var communityChild = document.getElementById("communityChild");

 var community = document.getElementById("community");



 document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll(".top_nav li a");
  
    function smoothScroll(target) {
      const element = document.querySelector(target);
      element.scrollIntoView({behavior: 'smooth'});
    }
  
    navLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        const target = event.target.getAttribute('href');
        smoothScroll(target);
      });
    });
  });
   




