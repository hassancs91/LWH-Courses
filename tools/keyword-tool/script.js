
const resultSection = document.querySelector(".lws-tool-result-section");
const query = document.getElementById("keyword");
const sortBy = document.getElementById("sortBy");
const countryCode = document.getElementById("countryCode");
const loading = document.querySelector(".loading");
const result = document.querySelector(".lws-tool-result");
const popup = document.querySelector(".popup");
let popupClose = "";
let balanceElem = "";
let response="";
let data="";
const API_BASE_URL = "https://learnwithhasan.com/wp-admin/admin-ajax.php";

const loadingTemplate = `<div>
  <i class="fa-solid fa-spinner fa-spin"></i>
  <p>Loading</p>
</div>`;

let tableRows = ``;
let updateTableRows = "";
let prevButton = "";
let nextButton = "";
let keywordData = "";
let resultData = "";

function onFormSubmit(event) {
  console.log("on submit")
  tableRows = "";
  currentPage = 1;
  response=''
  event.preventDefault();
  loading.innerHTML = loadingTemplate;
  result.innerHTML = "";
  result.style.display = "none";
  loading.style.display = "flex";
  resultSection.scrollIntoView({ behavior: "smooth" });

  var formData = new FormData();
  formData.append("action", "custom_tool_seo_keyword_research_basic");
  formData.append("query", query.value);
  formData.append("sortBy", sortBy.value);
  formData.append("countryCode", countryCode.value);

  fetchData(formData);
}

async function fetchData(formData) {
  try {
      response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      data = await response.json();
      resultData = data.result;
      console.log("data we got", data);

      if (!data.success) {
        if (data.message == "LOGIN_FIRST") {
          loading.style.display = "none";
          popup.innerHTML = `
          <div class='popup-container'>
          <i class="close fa-solid fa-xmark"></i>
          <div><img src="https://tools-backend.learnwithhasan.com/assets/images/no-access.png" alt="Login Error"></div>
          <p>You need to login first!</p>
          <a target="_blank" href="https://learnwithhasan.com/user-login">Login</a>
        </div>
          `;
          popup.style.display = "flex";
          popupClose= document.querySelector(".close")
          document
            .querySelector(".popup")
            .addEventListener("click", function (event) {
             
              if (event.target === this || event.target.contains(popupClose)) {
                this.style.display = "none";
              }
            });
          return;
        } else if (data.message == "NO_BALANCE") {
          loading.style.display = "none";
          popup.innerHTML = `
        <div class='popup-container'>
        <i class="close fa-solid fa-xmark"></i>
        <div><img src="https://tools-backend.learnwithhasan.com/assets/images/no-balance.png" alt="Balance Error"></div>
        <p>Not Enough Power Points!</p>
        <a target="_blank" href="https://learnwithhasan.com/points-system">Recharge Me</a>
      </div>
        `;
          popup.style.display = "flex";
          popupClose= document.querySelector(".close")
          document
            .querySelector(".popup")
            .addEventListener("click", function (event) {
             
              if (event.target === this || event.target.contains(popupClose)) {
                this.style.display = "none";
              }
            });
          return;
        } else {
          throw new Error("Something went wrong. Please Try Again!");
        }
      }
      keywordData = resultData.keyword_data;
      console.log(keywordData.length);

      loading.style.display = "none";
      result.style.display = "block";

      showResultUI(keywordData);
      updateTableRow();
      if (keywordData.length > 10) paginationButtons();
    } else {
      throw new Error("Request failed. Please try again!");
    }
  } catch (error) {
    console.error("Error occurred:", error);
    loading.innerHTML = ` <div class="error-msg">
    <img src="https://tools-backend.learnwithhasan.com/assets/images/error-img.png" alt="Error">
    <p class="text-medium">Uh Oh!</p>
    <p>Something went wrong! Please try again</p>
   </div>`;
    return;
  }
  if(response.ok){
    balanceElem = document
    .querySelector(".mycred-my-balance-wrapper")
    .querySelector("div");
 
  if(balanceElem){
    balanceElem.innerText = `${data.new_balance? data.new_balance:balanceElem.innerText}`;
    
  }
  }
}

function showResultUI(data) {
  let formattedData = resultData.ai_report.split("\n");
  data.forEach((item) => {
    tableRows += `
    <tr>
        <td data-cell="Keyword">${item.keyword ? item.keyword : "N/A"}</td>
        <td data-cell="CPC">${
          item.CostPerClick ? item.CostPerClick : "N/A"
        }</td>
        <td data-cell="Search Volume">${
          item.searchVolume ? item.searchVolume : "N/A"
        }</td>
        <td data-cell="Ranking Difficulty">${
          item.SeoDifficulty ? item.SeoDifficulty : "N/A"
        }</td>
        <td data-cell="Paid Competitors">${
          item.paidCompetitors ? item.paidCompetitors : "N/A"
        }</td>
    </tr>
    `;
  });
  const tableTemplate = `
  
  <div class="table-container tool-container">
  <div class="flex-justify flex-center">
    <div class="flex-center search-table">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input
        type="text"
        id="search-keyword"
        placeholder="Search keyword"
        onkeyup="filterTable(event)"
      />
    </div>
    <div>
      <span onclick="getCsv()"
        ><i class="fa-solid fa-file-csv csv-icon" title="Get csv"></i
      ></span>
      <span class="lws-tool-copy-icon" onclick="copy()"
      >
      <p class="copy-alert">Copied</p>
      <i
        class="fa-regular fa-copy copy-icon"
        title="Copy to clipboard"
      ></i
    ></span>
    </div>
  </div>

  <div>
    <table id="keyword-table">
      <tr>
        <thead>
          <th onclick="sortTable(event,0)">
            Keyword <i class="fa-solid fa-angle-up sort-icon"></i>
          </th>
          <th onclick="sortTable(event,1)">
            CPC <i class="fa-solid fa-angle-up sort-icon"></i>
          </th>
          <th onclick="sortTable(event,2)">
            Search Volume
            <i class="fa-solid fa-angle-up sort-icon"></i>
          </th>
          <th onclick="sortTable(event,3)">
            Ranking Difficulty
            <i class="fa-solid fa-angle-up sort-icon"></i>
          </th>
          <th onclick="sortTable(event,4)">
            Paid Competitors
            <i class="fa-solid fa-angle-up sort-icon"></i>
          </th>
        </thead>
      </tr>
      ${tableRows}
      
      
     
    </table>
             ${
               data.length > 10
                 ? `
                 <div class="flex-align flex-justify">
                 <div class="pagination">
                   <i class="fa-solid fa-arrow-left" id="prev-button"></i>
                   <i class="fa-solid fa-arrow-right" id="next-button"></i>
                 </div>
                 <p class="pagination">Total pages : ${Math.floor(
                   data.length / 10
                 )}</p>
                </div>
              `
                 : ""
             }
  </div>
</div>
  `;

  result.insertAdjacentHTML("beforeend", tableTemplate);
  if (resultData.ai_report == "") {
    result.insertAdjacentHTML(
      "beforeend",
      `
  <div class="tool-container">
  <p class="text-normal report-heading">AI Analysis not available</p>
  <div class="container-section">
    <div class="sleeping-ai-container">
      <img src="https://tools-backend.learnwithhasan.com/assets/images/sleepingAi.png" alt="AI sleeping image">
      <p class="text-medium">Oops!</p>
      <p>Looks like our AI is taking a Nap! It'll be back with its bright digital mind in no time. </p>
    </div>
  </div>
</div>
  
  `
    );
  } else {
    result.insertAdjacentHTML(
      "beforeend",
      `
    <div class="tool-container">
    <div class="text-normal flex-center report-heading">
    <img src="https://tools-backend.learnwithhasan.com/assets/images/ai-icon.png" alt="" />
    <p >AI Analysis</p>
    </div>
            
            <div class="container-section">
            ${formattedData
              .map(
                (item) => `
            <p class="mb-16">
              ${item}
            </p>`
              )
              .join("")}
            </div>
          </div>
    `
    );
  }
}

// Filter by search
function filterTable(event) {
  var filter = event.target.value.toLowerCase();
  const table = document.getElementById("keyword-table");
  var rows = table.getElementsByTagName("tr");

  if (keywordData.length > 10) {
    if (filter == "" || filter == " ") {
      nextButton.click();
      prevButton.click();

      return;
    }
  }
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var name = row.getElementsByTagName("td")[0];
    if (name) {
      var text = name.textContent.toLowerCase();
      if (text.includes(filter)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  }

  applyRowColorStyling();
}

// Sort by Column
const sortOrder = {};
function sortTable(event, columnIndex) {
  const table = document.getElementById("keyword-table");
  const rows = Array.from(table.getElementsByTagName("tr"));
  sortIcon = event.currentTarget.querySelector(".sort-icon");

  if (sortIcon) {
    if (sortIcon.style.transform == "rotate(180deg)") {
      sortIcon.style.transform = "rotate(0deg)";
    } else {
      sortIcon.style.transform = "rotate(180deg)";
    }
  }

  const headerRow = rows.shift();

  if (!sortOrder[columnIndex]) {
    sortOrder[columnIndex] = 1;
  } else {
    sortOrder[columnIndex] *= -1;
  }

  rows.sort((a, b) => {
    const cellA = a.getElementsByTagName("td")[columnIndex];
    const cellB = b.getElementsByTagName("td")[columnIndex];

    if (!cellA || !cellB) {
      return 0;
    }

    const textA = cellA.textContent.trim();
    const textB = cellB.textContent.trim();

    const numA = parseFloat(textA);
    const numB = parseFloat(textB);

    if (!isNaN(numA) && !isNaN(numB)) {
      return (numA - numB) * sortOrder[columnIndex];
    } else {
      return textA.localeCompare(textB) * sortOrder[columnIndex];
    }
  });

  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  table.appendChild(headerRow);
  rows.forEach((row) => {
    table.appendChild(row);
  });
  applyRowColorStyling();
}

// Export as Csv
function getCsv() {
  const table = document.getElementById("keyword-table");
  var rows = table.getElementsByTagName("tr");
  var csv = [];

  for (var i = 0; i < rows.length; i++) {
    var row = [];
    var cells = rows[i].querySelectorAll("td, th");

    for (var j = 0; j < cells.length; j++) {
      var cell = cells[j].textContent.trim();
      row.push('"' + cell.replace(/"/g, '""') + '"');
    }

    csv.push(row.join(","));
  }

  var csvContent = csv.join("\n");
  var blob = new Blob([csvContent], { type: "text/csv" });
  var fileName = "keyword.csv";

  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, fileName);
  } else {
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Copy data to clipboard
function copy() {
  const table = document.getElementById("keyword-table");
  const range = document.createRange();
  range.selectNode(table);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand("copy");
  selection.removeAllRanges();
  const copyAlert = document.querySelector(".copy-alert");

  copyAlert.style.display = "block";
  setTimeout(() => {
    copyAlert.style.display = "none";
  }, 2000);
}

// Pagination
const pageSize = 10;
let currentPage = 1;

function updateTableRow() {
  const table = document.getElementById("keyword-table");
  updateTableRows = Array.from(table.querySelectorAll("tr")).slice(1); // Exclude
  const startIndex = (currentPage - 1) * pageSize + 1; // Skip the header row
  const endIndex = startIndex + pageSize - 1;

  updateTableRows.forEach((row, index) => {
    if (index === 0) {
      return;
    }

    if (index >= startIndex && index <= endIndex) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// Pagination buttons
function paginationButtons() {
  prevButton = document.getElementById("prev-button");
  nextButton = document.getElementById("next-button");

  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updateTableRow();
    }
  });

  nextButton.addEventListener("click", () => {
    const maxPage = Math.floor((updateTableRows.length - 1) / pageSize); // Subtract 1 for the header row
    if (currentPage < maxPage) {
      currentPage++;
      updateTableRow();
    }
  });
}

function applyRowColorStyling() {
  var rows = document.querySelectorAll(".lws-tool tr");
  var visibleRows = [];

  rows.forEach(function (row) {
    if (getComputedStyle(row).display !== "none") {
      visibleRows.push(row);
    }
  });

  visibleRows.forEach(function (row, index) {
    if (index % 2 === 0) {
      row.style.backgroundColor = "#F4F7FC";
    } else {
      row.style.backgroundColor = "white";
    }
  });
}
