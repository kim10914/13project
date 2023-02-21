const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

app.set("views", path.join(__dirname, "views")); //뷰 엔진 사용을 위한 뷰를 설정한다.
app.set("view engine", "ejs"); //뷰 파일을 처리하기 위한 특수 엔진 사용.
app.use(express.static("public")); //정적인 파일을 불러온다.
app.use(express.urlencoded({ extended: false })); //extended:false 로 설정한 곳으로 전달한다.

app.get("/", function (req, res) {
  res.render("index"); //html내용을 응답으로 보낸다.(개꿀 장점 코드 짧아진다.)
});

app.get("/recommend", function (req, res) {
  res.render("recommend");
});

//"/recommend"를 get으로 요청했지만 post로도 요청이 가능하다 get = X
app.post("/recommend", function (req, res) {
  const restaurant = req.body; //body에 JSON데이터를 담을때 사용
  const filePath = path.join(__dirname, "data", "restaurants.json"); //경로설정 data > restaurants.json

  const fileData = fs.readFileSync(filePath); //filePath의 정보를 불러온다.
  const storedRestaurants = JSON.parse(fileData); //자바스크립트 배열로 변환

  storedRestaurants.push(restaurant); //새로운 레스토랑을 배열에 푸쉬한다.
  fs.writeFileSync(filePath, JSON.stringify(storedRestaurants)); //filePath에 JSON형식으로 restaurant을 입력한다.

  res.redirect("/confirm"); //입력 완료시 "/confirm"으로 url을 변경한다.
});

app.get("/confirm", function (req, res) {
  res.render("confirm");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/restaurants", function (req, res) {
  const filePath = path.join(__dirname, "data", "restaurants.json"); //경로설정 data > restaurants.json

  const fileData = fs.readFileSync(filePath); //filePath의 정보를 불러온다.
  const storedRestaurants = JSON.parse(fileData); //자바스크립트 배열로 변환

  res.render("restaurants", { numberOfRestaurants: storedRestaurants.length , restaurants : storedRestaurants }); //numberOfRestaurants, restaurants의 값을 restaurants에 전송
});

app.listen(3000);
