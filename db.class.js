const db = require("./db.config");
const request = require("request");
const sqlModel = require("./sql.class");
var sql = new sqlModel();

class dbModel {
  async calculate(data) {
    // data안의 계산할 돈을 추출
    var money = data[0];
    //db를 조회해야 되기때문에 배열안에 환율 이름1, 환율 이름2, 환율 이름3, 환율 이름4 추가
    var arr = [data[1], data[2], data[3], data[4]];
    // 빈 배열 만들기
    var c = [];
    // 조회할 데이터가 많기 때문에 for문을 사용하여 진행
    for (let i in arr) {
      async function selRate() {
        try {
          var rate = await sql.select("to_curr", arr[i]);
          return rate;
        } catch (err) {
          return err;
        }
      }
      var rate = await selRate();
      // 추출한 데이터를 c배열에 저장
      c.push(rate[0].currency);

      // 일반 화폐 계산 방법
      if (c.length === arr.length) {
        var target = (money / c[0]) * c[1];
        // ETH 계산 방법
        var ETH = ((money / c[0]) * c[2]) / c[3];
        var succ = JSON.stringify({ form_num: target, eth: ETH });
        return succ;
      }
    }
  }

  // 외부 API의 데이터를 추출하여 DB에 적재
  async api() {
    let table = await sql.checkTable();
    console.log(table);
    if (table == 0) {
      async function creTable() {
        try {
          var create = await sql.creatTable();
          return create;
        } catch (err) {
          console.log("테이블 생성 오류");
        }
      }
      var dataTable = await creTable();
    }
    async function apiData() {
      const currApi =
        "http://data.fixer.io/api/latest?access_key=c8fc05d8b706cbdf56aa003b0f072d72";
      return new Promise((resolve, reject) => {
        request(currApi, (err, res, body) => {
          if (!err && res.statusCode == 200) {
            resolve(body);
          } else {
            reject(err);
          }
        });
      });
    }
    let body = await apiData();
    let res = eval("(" + body + ")");
    let data = res["rates"];
    // DB에 데이터 있는지 조회하기
    async function findData() {
      var sel = await sql.select("to_curr", "ZWL");
      return sel;
    }
    var findData = await findData();
    // DB에 데이터가 없으면 sel의 배열 길이는 0.
    if (findData.length == 0) {
      //데이터가 없기때문에 for문을 이용하여 데이터 적재
      for (let i in data) {
        async function AddData() {
          try {
            var add = await sql.Add("EUR", i, data[i]);
          } catch (err) {
            console.log("일반화폐 데이터 적재 오류");
          }
        }
        AddData();
      }
      return "일반화폐 데이터 적재 성공";
    } else {
      //데이터가 있기 때문에 for문을 이용하여 데이터 업데이트
      for (let i in data) {
        async function UpdateData() {
          try {
            var update = await sql.Update(data[i], "to_curr", i);
          } catch (err) {
            console.log("일반화폐 환율 데이터 업데이트 오류");
          }
        }
        UpdateData();
      }
      console.log("일반화폐 환율 데이터 업데이트 성공");
    }
  }

  // ETH API의 데이터를 추출하여 DB에 적재
  async apiEth() {
    async function apiData() {
      const currApi =
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";
      return new Promise((resolve, reject) => {
        request(currApi, (err, res, body) => {
          if (!err && res.statusCode == 200) {
            resolve(body);
          } else {
            reject(err);
          }
        });
      });
    }
    var body = await apiData();
    var res = eval("(" + body + ")");
    var data = res["USD"];
    let sel = await sql.select("form", "ETH");
    if (sel.length == 0) {
      var add_eth = await sql.Add("ETH", "ETH", data);
      console.log("ETH 환율 적재 성공");
    } else {
      var add_eth = await sql.Update(data, "form", "ETH");
      console.log("ETH 환율 업데이트 성공");
    }
  }
}

module.exports = dbModel;
