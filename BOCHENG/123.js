// 當 DOM 加載完成後執行
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded 事件被監聽。");

  // 獲取檢查連線按鈕
  var checkConnectionBtn = document.getElementById("checkConnectionBtn");

  // 監聽檢查連線按鈕的點擊事件
  checkConnectionBtn.addEventListener("click", function () {
    // 顯示所有子項目的連線狀態
    displayAllCategories();
  });
});

// 顯示所有子項目的連線狀態
async function displayAllCategories() {
  // 清空表格
  clearTable();
  var table = document.getElementById("tableHeader").getElementsByTagName("tbody")[0];

  // 定義子項目列表
  var categories = [
    "總電來源偵測",
    "二次測總電送電",
    "電腦燈送電",
    "音源輸出送電",
    "擴大機送電",
    "燈控台送電",
    "音控台送電",
    "電視牆送電",
    "燈光秀電腦控制主機送電",
    "客端應用電腦送電",
  ];

  // 遞歸調用帶延遲的發送 POST 請求函數
  sendPostRequestWithDelay(categories, 0, "bocheng");
}

// 帶延遲的發送 POST 請求函數
async function sendPostRequestWithDelay(categories, index, customValue) {
  if (index >= categories.length) {
    // 已經處理完所有項目，結束遞歸
    return;
  }

  var category = categories[index];
  var tr = document.createElement("tr");
  var categoryData = [category, "進入檢查連線程序", "尚未回應", getCurrentTime()];

  // 遍歷子項目數據，創建表格行
  categoryData.forEach(function (data, dataIndex) {
    var td = document.createElement("td");
    td.textContent = data;
    tr.appendChild(td);

    if (dataIndex === 1) {
      // 修改這裡，發送包含兩個值的請求
      sendPostRequest(category, customValue, tr, categories, index);
    }
  });

  var table = document.getElementById("tableHeader").getElementsByTagName("tbody")[0];
  table.appendChild(tr);
}

// 發送 POST 請求函數
async function sendPostRequest(category, customValue, tr, categories, index) {
  try {
    // 發送 POST 請求
    const response = await fetch('http://localhost:3000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ category, customValue })
    });

    // 解析回應
    const result = await response.text();
    // 更新表格行，設定文字顏色為綠色
    updateTableRow(tr, result, 'green');
  } catch (error) {
    console.error('發生錯誤:', error);
    // 更新表格行，設定文字顏色為紅色
    updateTableRow(tr, '發生錯誤', 'red');
  } finally {
    // 等待2秒後，處理下一個項目
    setTimeout(() => {
      sendPostRequestWithDelay(categories, index + 1, customValue);
    }, 2000);
  }
}

// 更新表格行的函數
function updateTableRow(tr, response, color) {
  // 取得表格的第三列（尚未回應）

  var responseTd = tr.getElementsByTagName("td")[2];

  // 更新第三列的內容為回應值，並設定文字顏色
  responseTd.textContent = response;
  responseTd.style.color = color || 'yellow';  // 預設為黃色

  // 如果得到回應，設定定時器在一段時間後將行的顏色還原為白色
  if (color === 'red') {
    setTimeout(() => {
      responseTd.textContent = "失去連線";
      responseTd.style.color = 'red';  // 還原為紅色
    }, 5000);  // 設定為5秒後還原
  } else {
    // 如果得到回應，設定定時器在一段時間後將行的顏色還原為白色
    setTimeout(() => {
      responseTd.textContent = "連線成功";
      responseTd.style.color = 'green';  // 還原為綠色
    }, 10000);  // 設定為10秒後還原
  }
}

// 獲取當前時間的函數
function getCurrentTime() {
  var now = new Date();
  var hours = now.getHours().toString().padStart(2, '0');
  var minutes = now.getMinutes().toString().padStart(2, '0');
  var seconds = now.getSeconds().toString().padStart(2, '0');
  return hours + ":" + minutes + ":" + seconds;
}

// 清空表格的函數
function clearTable() {
  var table = document.getElementById("tableHeader").getElementsByTagName("tbody")[0];
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
}