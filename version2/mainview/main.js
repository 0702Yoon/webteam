let horizontalUnderLine = document.getElementById(
  "horizontal-underline"
); /*menu쪽 밑줄*/
let horizontalMenus = document.querySelectorAll("nav:first-child a");

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".top_nav li");

function activateSection(section) {
  // remove active class from all nav items
  navItems.forEach((item) => {
    item.classList.remove("active");
  });

  // find the corresponding nav item and add active class
  const id = section.getAttribute("id");
  const navItem = document.querySelector(`.top_nav li a[href="#${id}"]`);
  if (navItem) {
    navItem.parentNode.classList.add("active");
  }
}

function activateCurrentSection() {
  // find the section that is currently in view
  const currentSection = [...sections].reverse().find((section) => {
    const rect = section.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
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
window.addEventListener("scroll", activateCurrentSection);

// 뒤집기 버튼 클릭 이벤트 처리

function flip() {
  const container = document.querySelector(".container");
  container.classList.toggle("flip");
}

// 목록 나오게
var communityChild = document.getElementById("communityChild");

var community = document.getElementById("community");

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".top_nav li a");

  function smoothScroll(target) {
    const element = document.querySelector(target);
    element.scrollIntoView({ behavior: "smooth" });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const target = event.target.getAttribute("href");
      smoothScroll(target);
    });
  });
});

function loginWithKakao() {
  Kakao.init("5655e0aa2e406b874cfaff134add8648"); // 카카오 개발자 계정에서 발급받은 API 키로 초기화

  Kakao.Auth.loginForm({
    success: function (authObj) {
      // 로그인에 성공한 경우 처리할 코드
      window.location.href = "index2.html"; // 로그인 성공 시 index2.html로 이동
    },
    fail: function (err) {
      // 로그인에 실패한 경우 처리할 코드
      console.log(err);
    },
  });
}