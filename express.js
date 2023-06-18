const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');




// 필요한 모듈 호출

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//파일을 json으로 받기 위함인가?

// 정적 파일 서비스 설정
app.use('/', express.static(__dirname + '/mainview')); // CSS 파일이 있는 디렉토리
app.use('/writeview', express.static(__dirname + '/writeview'));
app.use('/subview', express.static(__dirname + '/subview'));
app.use('/update', express.static(__dirname + '/writeview'));
app.use('/update', express.static(__dirname + '/subview'));

// 앞에 인자의 홈페이지에 들어왔을 때 뒤에 파일안에 있는 css를 쓰기 위해서 호출한 것. __dirname은 현재 js 위치에요.

// 라우트 및 서버 실행
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/writeview', (req, res) => {
  res.sendFile(__dirname + '/writeview/writingPanel.html')
}) //writeview로 들어왔을 때 이 파일을 보내겠다.

app.get('/test2-1.html', (req, res) => {
  res.sendFile(__dirname + '/login/test2-1.html')
})//로그인 눌렀을 때 이 파일 보내겠다.

app.get('/test2-2.html', (req, res) => {
  res.sendFile(__dirname + '/login/test2-2.html')
})

// 아래 부분은 글쓰기 창에서 upload누르면 자동으로 이게 실행되서 파일 만들고 다른 화면으로 보내는 부분
app.post('/create_process/', (req, res) => {
  const postData = req.body;
  const fileName = postData.title + ".json"; // 파일 제목에 확장자 추가
  const filefield = postData.field;

  const filePath = path.join(__dirname, filefield, 'file', fileName); // 경로 구성

  // 폼 데이터를 파일로 저장하는 로직

  fs.writeFile(filePath, JSON.stringify(postData), 'utf-8', (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    } else {
      const currentTime = new Date();
      fs.utimes(filePath, currentTime, currentTime, (err) => {
        if (err) {
          console.error(err);
        }
      });
      return res.redirect(`/subview/${filefield}`); //다른 창으로 넘기는 부분
    }
  });
});

app.get('/subview/:field/', (req, res) => {
  const title = req.query.title;

  if (title === undefined) {
    subshow(req, res);
  }
  else {
    subshow_two(req, res);
  }
});

// subview를 보여주는 부분
function subshow(req, response) {
  const field = req.params.field
  fs.readdir(__dirname + `/${field}/file`, function (error, filenames) {
    if (error) {
      console.error(error);
      response.status(500).send('Internal Server Error');
      return;
    }

    var fileDataList = [];
    var completedReads = 0;

    // 파일 목록의 각 파일 이름에 대해 처리
    for (const filename of filenames) {
      const filePath = path.join(__dirname, field, 'file', filename);

      // 파일을 비동기적으로 읽어옴
      fs.readFile(filePath, 'utf-8', function (err, fileContent) {
        if (err) {
          console.error(`Error reading file: ${filename}`);
          console.error(err);
        } else {
          try {
            const fileData = {
              filename: filename,
              data: JSON.parse(fileContent)
            };
            fileDataList.push(fileData); // 파일 데이터를 목록에 추가
          } catch (error) {
            console.error(`Error parsing file: ${filename}`);
            console.error(error);
          }
        }

        completedReads++;
        // 모든 파일을 읽은 후에 응답 전송
        if (completedReads === filenames.length) {
          // fileDataList를 정렬하여 원하는 순서로 정렬할 수 있음
          fileDataList.sort((a, b) => a.filename.localeCompare(b.filename));

          // 목록을 생성할 때 파일 데이터의 순서를 유지하도록 수정
          var body = '';
          var i=1;
          for (const fileData of fileDataList) {
            body += ` <tr>
            <td class="tdc">${i}</td>
            <td class="tdc"> <a href="/subview/${field}?title=${fileData.data.title}">${fileData.data.title}</a></td>
            <td class="tdc">${fileData.data.author}</td>
            <td class="tdc">2023-05-29</td>
        </tr>`;
            i++;
      }

          var template = templateHTML(field, body);
          response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          response.end(template);
        }
      });
    }
  });
}
// subview에 해당하는 html부분 


// 글을 눌렀을 때 나오는 부분
function subshow_two(req, response) {
  var field = req.params.field;
  const title = req.query.title;

  fs.readdir(__dirname + `/${field}/file`, function (error, filenames) {
    if (error) {
      console.error(error);
      response.status(500).send('Internal Server Error');
      return;
    }



    fs.readFile(__dirname + `/${field}/file/${title}.json`, 'utf-8', function (err, fileContent) {
      if (err) {
        console.error(`Error reading file: ${title}`);
        console.error(err);
        response.status(500).send('Internal Server Error');
        return;
      }

      try {
        const fileData = JSON.parse(fileContent);
        const title = fileData.title;
        const content = fileData.content;
        const author = fileData.author;
        var body = '';

        var template = templatesubview(fileData);
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(template);
        // 이후에 필요한 처리를 수행합니다.
        // 예를 들어, 응답으로 데이터를 보낼 수 있습니다.

      } catch (error) {
        console.error(`Error parsing file: ${title}`);
        console.error(error);
        response.status(500).send('Internal Server Error');
        return;
      }
    });
  });
}
// 글을 눌렀을 때 내용 html 부분



app.get('/update/:field', (req, res) => {
  var field = req.params.field;
  var title = req.query.title;

  fs.readFile(__dirname + `/${field}/file/${title}.json`, 'utf-8', function (err, fileContent) {
    const fileData = JSON.parse(fileContent);

    var fieldData = fileData.field;
    var body = '';

    var template = update(fileData, fieldData);

    body += template;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(body);
  })
})



app.post('/update_process', (req, res) => {
  const beforetitle = req.query.title;

  var postData = req.body;

  const filefield = postData.field;
  const beforefilePath = path.join(__dirname, filefield, 'file', beforetitle + '.json'); // 경로 구성
  const filePath = path.join(__dirname, postData.field, 'file', postData.title + '.json')
  // 폼 데이터를 파일로 저장하는 로직


  fs.rename(beforefilePath, filePath, (error) => {
    fs.writeFile(filePath, JSON.stringify(postData), 'utf-8', (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      } else {
        const currentTime = new Date();
        fs.utimes(filePath, currentTime, currentTime, (err) => {
          if (err) {
            console.error(err);
          }
        });
        return res.redirect(`/subview/${filefield}`); //다른 창으로 넘기는 부분

      }
    })
  });
});

app.get('/delete_process/:field', (req, res) => {

  var field = req.params.field
  var title = req.query.title
  var path = __dirname + '/' + field + '/file/' + title + '.json'


  fs.unlink(path, (error) => {

    return res.redirect(`/subview/${field}`);

  })

})

var katalog = ` <!DOCTYPE html> 
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>퍼즐프로젝트</title>
    <link href="https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="contentCss.css"> 
    <link rel="stylesheet" href="subviewList.css">
    <link rel="stylesheet" href="mainview/text.css">
    <link rel="stylesheet" href="logo.css">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,200;1,200;1,300&family=PT+Sans:ital,wght@1,700&display=swap"
      rel="stylesheet"
    />
    <script>
function redirectToAbsoluteURL() {
  window.location.href = "http://localhost:3000/index2.html";
}
</script>
</head>
<body>
    <div class="wrap">
        <div class = "inrto_bg" >
        <a id="Logo" href="#" onclick="redirectToAbsoluteURL()">THE<br> PUZZLE</a>
        <div class="header">

                <ul class="nav">
                <li><a href="/subview/BACKEND">BACK END</a></li>
                <li><a href="/subview/FRONTEND">FRONT END</a></li>
                <li><a href="/subview/comunity">COMMUNITY</a></li>
                </ul>
                </div>
            </div>
            <div class="searchArea">
            <form>
                <input type="search" placeholder="Search">
                <button class ="but">검색</button>
            </form>
            </div>`

function templateHTML(field, body) {
  return `${katalog}
  <div class="container">
  <h1 style="color:white;">${field}</h1><br>
  <div class="board">
      <table class ="table">
          <thead class="thead">
              <tr>
                  <td>번호</td>
                  <td>제목</td>
                  <td>글쓴이</td>
                  <td>작성일</td>
              </tr>
          </thead>

                  <tbody class ="tbody">
                  ${body}
                  </tbody>
        </table>  
                  <div class="page-wrap">
                  <button id="buto" onclick="window.location.href='/writeview'">글쓰기</button>
                  <ul class="page-nation">
                      <li><a href="/board/list?p=1">1</a></li>
                      <li><a href="/board/list?p=2">2</a></li>
                      <li><a href="/board/list?p=3">3</a></li>
                      <li><a href="/board/list?p=4">4</a></li>
                      <li><a href="/board/list?p=5">5</a></li>
                  </ul>
              </div>    

</body>

</html>
  `;
}

function templatesubview(fileData) {
  return `  ${katalog}
  <div class="black">
  <div class="content2">
    <div class="head2">
      <span class="bold">진행 상태: 상태(모집중)</span>
      <span class="bold">모집 분야: ${fileData.field}</span>
    </div>
  
    <table class="content">
      <tr height="50px"></tr>
      <tr>
        <th>제목</th>
        <th width="50px">:</th>
        <td>${fileData.title}</td>
      </tr>
      <tr height="30px"></tr>
      <tr>
        <th>작성자</th>
        <th width="50px">:</th>
        <td>${fileData.author}</td>
      </tr>
      <tr height="30px"></tr>
      <tr>
        <th>모집 내용</th>
        <th width="50px">:</th>
        <td>${fileData.content}</td>
      </tr>
      <tr height="30px"></tr>
      <tr>
        <th>태그</th>
        <th width="50px">:</th>
        <td width="800px">${fileData.tag}</td>
      </tr>
      <tr height="30px"></tr>
      <tr>
        <th width="180px">카카오톡 링크</th>
        <th width="50px">:</th>
        <td><a href="#"> https://open.kakao.com/o/gqjrlq8e</a></td>
      </tr>
      <tr height="100px"></tr>
      <tr>
        <td colspan="3">
          <div class='delete'>
            <button id="buto" onclick="window.location.href='/delete_process/${fileData.field}?title=${fileData.title}'">삭제하기</button>
          </div>
          <div class='modify'>
            <button id="buto" onclick="window.location.href='/update/${fileData.field}?title=${fileData.title}'">수정하기</button>
          </div>
        </td>
      </tr>
    </table>
  </div>
</div>
`
}

function update(fileData, fieldData) {
  return `<!DOCTYPE html> 
  <html lang="en">
  <head>
      <link href="https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="logo.css">
      <link rel="stylesheet" href="style.css">
      <link rel="stylesheet" href="style2.css">
      <script>
      function redirectToAbsoluteURL() {
        window.location.href = "http://localhost:3000/index2.html";
      }
      </script>
  </head>
  <body>
      <div class="wrap">
          <div class = "inrto_bg" >
          <a id="Logo" href="#" onclick="redirectToAbsoluteURL()">THE<br> PUZZLE</a>
              <div class="header">
                  <ul class="nav">
                      <li><a href="/subview/BACKEND">BACK END</a></li>
                      <li><a href="/subview/FRONTEND">FRONT END</a></li>
                      <li><a href="/subview/comunity">COMMUNITY</a></li>
                  </ul>
                  </div>
              </div>
  
     <!-- 글쓰기 패널 -->
     
     <div>
      <form action="/update_process/?title=${fileData.title}" method="post">
          <br>
              <table class="write">
                  <tr height="80px">
                      <td><h2><b>모집 글 수정하기!</b></h2></td>
                  </tr>
                  <tr>
                      <td>
                      <select class="select" name="field" id="fieldSelect">
                           <option value="">--모집글의 종류를 선택해주세요--</option>
                          <option value="BACKEND">BACK END</option>
                          <option value="FRONTEND">FRONT END</option>
                          <option value="comunity">COMMUNITY</option>
                      </select>
                   </td>
                  </tr>
                  <tr>
                      <td><input name="author" placeholder="작성자 이름" value="${fileData.author}"></td>   
                      
                  </tr>
                  <tr>
                      <td><input type="text" name="title" placeholder="제목을 입력해주세요" value="${fileData.title}"></td>
                  </tr>
                  <tr>
                      <td><textarea style="overflow-x: hidden;" type="text" class="text" placeholder="내용을 입력해주세요" name="content" >${fileData.content}</textarea></td>
                  </tr>
                  <tr>
                      <td ><input type="text" placeholder="태그를 달아주세요" name="tag" value = "${fileData.tag}"></td>
                  </tr>
                  <tr>
                      <td><input placeholder="카카오톡 링크를 입력하세요"></td>
                  </tr>
                  <tr>
                      <td><input type="file"></td>
                  </tr>
                  <tr height="30px"></tr>
              </table>
             
              <div class="Submit">
                  <tr>
                      <td class="td"><button  type="submit">Upload</button></td>
                  </tr>
              </form>
              </div>
          </div>
      

<script>
var fieldData = "${fieldData}"; // fieldData 변수의 값을 JavaScript로 가져온다고 가정합니다.
var selectElement = document.getElementById("fieldSelect");

// fieldData 값에 해당하는 옵션을 선택합니다.
if (fieldData == "BACKEND") {
  selectElement.value = "BACKEND";
} else if (fieldData == "FRONTEND") {
  selectElement.value = "FRONTEND";
}
</script>
  </body>
  </html>`}

app.listen(3000, () => {
  console.log('서버가 실행되었습니다.');
});
