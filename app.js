const express = require("express");
const dbModel = require("./db.class");
const db = require("./db.config");
const request = require("request");
const method = new dbModel();
const app = express();

app.use(express.json());
app.use(express.static("./public")); //Default페이지 설정

app.get("/api", async (req, res) => {
  var data = req.query;
  let num = data[0];
  if (num) {
    await method.api();
    await method.apiEth();
    var succ = await method.calculate(data);
    res.send(succ);
  } else {
    res.send("0");
  }
});

app.listen(8080, () => console.log("서버 시작 성공"));
