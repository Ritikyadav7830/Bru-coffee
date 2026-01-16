/***************************************
 * AUTH GUARD
 ***************************************/
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "admin-login.html";
}

/***************************************
 * VARIABLES
 ***************************************/
const rowsPerPage = 10;
let currentPage = 1;
let candidates = [];

const tbody = document.getElementById("candidateBody");
const pageNumbers = document.getElementById("pageNumbers");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const number1 = document.querySelector(".number1");

/***************************************
 * FETCH DATA
 ***************************************/
fetch("http://localhost:3000/api/candidates")
  .then(res => res.json())
  .then(result => {
    candidates = result.data || [];
    console.log(candidates);
    if (number1) number1.innerText = candidates.length;
    renderTable();
    updatePagination();
  });

/***************************************
 * RENDER TABLE
 ***************************************/
function renderTable() {
  tbody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  candidates.slice(start, end).forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>${item.fullName || "-"}</td>
        <td>${item.email || "-"}</td>
        <td>
          10th (${item.education?.tenthYear || "-"}),
          12th (${item.education?.twelfthYear || "-"}),
          ${item.education?.graduation?.degree || "-"}
        </td>
        <td>
          ${
            item.pdfUrl
              ? `<button class="download-btn" data-pdf="${item.pdfUrl}">Download CV</button>`
              : `<span style="color:red">No CV</span>`
          }
        </td>
      </tr>
    `;
  });
}

/***************************************
 * PAGINATION
 ***************************************/
function updatePagination() {
  pageNumbers.innerHTML = "";

  const totalPages = Math.ceil(candidates.length / rowsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const span = document.createElement("span");
    span.textContent = i;
    span.className = "page-number" + (i === currentPage ? " active" : "");
    span.onclick = () => {
      currentPage = i;
      renderTable();
      updatePagination();
    };
    pageNumbers.appendChild(span);
  }

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

/***************************************
 * PREV / NEXT
 ***************************************/
prevBtn.onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
    updatePagination();
  }
};

nextBtn.onclick = () => {
  const totalPages = Math.ceil(candidates.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
    updatePagination();
  }
};

/***************************************
 * DOWNLOAD CV (EVENT DELEGATION)
 ***************************************/
tbody.addEventListener("click", (e) => {
  if (e.target.classList.contains("download-btn")) {
    const pdfUrl = e.target.dataset.pdf;

    if (!pdfUrl) {
      alert("PDF not available");
      return;
    }

    const a = document.createElement("a");
    a.href = pdfUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
});


/***************************************
 * LOGOUT
 ***************************************/
document.querySelector(".logOut")?.addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "admin-login.html";
});

/***************************************
 * REFRESH
 ***************************************/
document.querySelector(".refresh")?.addEventListener("click", () => {
  location.reload();
});
