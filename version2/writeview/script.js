var postForm = document.getElementById("postForm");

postForm.addEventListener("submit", function(event) {
  event.preventDefault(); // 기본 동작(페이지 새로고침)을 막음
  
  // 입력된 제목과 내용 가져오기
  var title = document.getElementById("title").value;
  var content = document.getElementById("content").value;
  
  // 새로운 글을 생성하고 목록에 추가하는 로직 구현
  // (서버로 전송하거나 로컬 저장소에 저장하는 등의 추가 작업 필요)
  
  // 글 생성 후 화면에 추가하는 예시
  var postItem = document.createElement("li");
  postItem.textContent = title;
  
  var postList = document.getElementById("postList");
  postList.appendChild(postItem);
  
  // 입력 양식 초기화
  postForm.reset();
});
