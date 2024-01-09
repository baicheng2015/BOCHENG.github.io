// -------------------<全局變量定義>-------------------
var isExecuting = false; // 是否正在執行
var shouldStop = false; // 是否需要停止

// -------------------<DOMContentLoaded 函數說明>-------------------
document.addEventListener("DOMContentLoaded", function () {
  // 取得開始按鈕元素
  var startBtn = document.getElementById("startBtn");
  // 給開始按鈕加上點擊事件監聽器
  startBtn.addEventListener("click", function () {
    // 如果目前正在執行，彈出提示訊息
    if (isExecuting) {
      alert("程式執行中");
    } else {
      // 否則，標記正在執行，重置停止標誌，呼叫開始自動化函數
      isExecuting = true;
      shouldStop = false;
      startAutomation();
    }
  });

  // 取得停止按鈕元素
  var stopBtn = document.getElementById("stopBtn");
  // 給停止按鈕加上點擊事件監聽器
  stopBtn.addEventListener("click", function () {
    // 標記停止，並重置正在執行的標誌
    shouldStop = true;
    isExecuting = false;
    // 同時清空表格
    clearTable();
  });

  // 取得重新整理按鈕元素
  var refreshBtn = document.getElementById("refreshBtn");
  // 給重新整理按鈕加上點擊事件監聽器
  refreshBtn.addEventListener("click", function () {
    // 強制重新整理目前頁面
    location.reload(true);
  });
});

// -------------------<startAutomation 函數說明>-------------------
function startAutomation() {
  // 模擬群組內的多個子項目數據
  var groupData = [
    { equipment: "總電來源偵測", status: "", result: "", code: 201 },
    { equipment: "二次測總電送電", status: "", result: "", code: 202 },
    { equipment: "電腦燈送電", status: "", result: "", code: 202 },
    { equipment: "音源輸出送電", status: "", result: "", code: 202 },
    { equipment: "擴大機送電", status: "", result: "", code: 202 },
    { equipment: "燈控台送電", status: "", result: "", code: 202 },
    { equipment: "音控台送電", status: "", result: "", code: 202 },
    { equipment: "電視牆送電", status: "", result: "", code: 202 },
    { equipment: "燈光秀電腦控制主機送電", status: "", result: "", code: 202 },
    { equipment: "客端應用電腦送電", status: "", result: "", code: 202 },
  ];

  // 逐步顯示子項目
  displayGroupDataStepByStep(groupData);
}

// -------------------<displayGroupDataStepByStep 函數說明>-------------------
async function displayGroupDataStepByStep(groupData) {
  // 取得表格元素
  var table = document.getElementById("tableHeader").getElementsByTagName("tbody")[0];

  // 非同步函數
  (async function () {
    // 遍歷每個子項目
    for (const item of groupData) {
      // 如果需要停止，彈出提示訊息並返回
      if (shouldStop) {
        alert("程式已停止");
        return;
      }

      // 延遲 1 秒
      await delay(300);
      // 插入一行
      insertRow(table, item);
    }

    // 延遲 2 秒
    await delay(2000);
    // 更新執行狀態
    updateExecutionStatus(table, "已完成送電");

    // 延遲 2 秒
    await delay(5000);
    // 清空表格
    clearTable(table);

    // 標誌執行結束
    isExecuting = false;
  })();
}

// -------------------<delay 函數說明>-------------------
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// -------------------<insertRow 函數說明>-------------------
function insertRow(table, item) {
  var newRow = table.insertRow(-1);
  var cell1 = newRow.insertCell(0);
  var cell2 = newRow.insertCell(1);
  var cell3 = newRow.insertCell(2);

  // 填充新行的內容
  cell1.innerHTML = item.equipment;
  cell2.innerHTML = item.status;

  // 創建一個空的 span 元素，後續會用來逐步顯示結果
  var resultSpan = document.createElement("span");
  cell3.appendChild(resultSpan);

  // 使用延遲函數逐步顯示結果
  displayResultStepByStep(resultSpan, item.result);
}

// -------------------<displayResultStepByStep 函數說明>"逐步顯示"按鈕-------------------
async function displayResultStepByStep(resultSpan, result) {
  // 將結果按字符拆分
  var characters = result.split("");

  // 遍歷每個字符，每隔一段時間顯示一個字符
  for (const char of characters) {
    // 將字符添加到 span 中
    resultSpan.innerHTML += char;
    // 延遲 1 秒
    await delay(1000);
  }
}

// -------------------<updateExecutionStatus 函數說明>-------------------
function updateExecutionStatus(table, newStatus) {
  // 更新所有行的第3列
  for (var i = 1; i < table.rows.length; i++) {
    table.rows[i].cells[2].innerHTML = newStatus;
  }
}

// -------------------<clearTable 函數說明>"停止"按鈕-------------------
function clearTable() {
  // 取得表格元素
  var table = document.getElementById("tableHeader").getElementsByTagName("tbody")[0];

  // 刪除所有行，保留第一行
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
}