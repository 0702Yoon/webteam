// 로그인 성공 후 index2.html 페이지에서 실행할 함수
function greetUser(nickname) {
  document.getElementById("greeting").textContent = nickname + "님 안녕하세요";
}

// 카카오 로그아웃 버튼 클릭 시 처리하는 함수
function kakaoLogout() {
  Kakao.Auth.logout(function () {
    // 로그아웃 성공 시 index.html로 이동
    window.location.href = "index.html";
  });
}

// 페이지 로드 시 호출될 함수
function initialize() {
  Kakao.init("5655e0aa2e406b874cfaff134add8648"); // 카카오 앱의 JavaScript 키를 사용하여 Kakao.init()을 호출

  // 카카오 로그인한 사용자의 닉네임 받아오기
  Kakao.API.request({
    url: "/v2/user/me",
    success: function (response) {
      greetUser(response.properties.nickname);
    },
    fail: function (error) {
      console.log("Failed to get user info: " + JSON.stringify(error));
    },
  });

  // 카카오 로그아웃 버튼에 이벤트 리스너 등록
  document
    .getElementById("kakao-logout-btn")
    .addEventListener("click", kakaoLogout);
}

// 페이지 로드 시 초기화 함수 호출
window.onload = initialize;

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
