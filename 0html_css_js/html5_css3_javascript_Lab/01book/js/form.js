let editingBookId = null;

document.addEventListener("DOMContentLoaded", function () {
  loadBooks();
});

const bookForm = document.getElementById("bookForm"); // HTML id에 맞춤
const submitButton = document.createElement("button");
const cancelButton = document.createElement("button");

// form submit 이벤트
bookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const bookData = {
    title: formData.get("title").trim(),
    author: formData.get("author").trim(),
    isbn: formData.get("isbn").trim(),
    price: formData.get("price").trim(),
    publishDate: formData.get("publishDate").trim(),
  };

  if (!validateBook(bookData)) return;

  if (editingBookId) {
    updateBook(editingBookId, bookData);
  } else {
    createBook(bookData);
  }
});

const API_BASE_URL = "http://localhost:8080";

// 도서 목록 불러오기
function loadBooks() {
  fetch(`${API_BASE_URL}/api/books`)
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "도서 목록 불러오기 실패");
      }
      return response.json();
    })
    .then((books) => renderTable(books))
    .catch((error) => {
      console.error(error);
      alert("도서 목록을 불러오는데 실패했습니다.");
    });
}

// 테이블 렌더링
function renderTable(books) {
  const tablebody = document.getElementById("bookTableBody"); // HTML id에 맞춤
  tablebody.innerHTML = "";

  books.forEach((book) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td>${book.price}</td>
      <td>${book.publishDate}</td>
      <td>
        <button class="edit-btn" onclick="editBook(${book.id})">수정</button>
        <button class="delete-btn" onclick="deleteBook(${book.id}, '${book.title}')">삭제</button>
      </td>
    `;
    tablebody.appendChild(row);
  });
}

// 도서 등록
function createBook(bookData) {
  fetch(`${API_BASE_URL}/api/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "도서 등록 실패");
      }
      return response.json();
    })
    .then(() => {
      bookForm.reset();
      loadBooks();
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
}

// 도서 삭제
function deleteBook(id, title) {
  if (!confirm(`제목 = ${title}을 정말 삭제하시겠습니까?`)) return;

  fetch(`${API_BASE_URL}/api/books/${id}`, { method: "DELETE" })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "도서 삭제 실패");
      }
      loadBooks();
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
}

// 도서 수정 (폼에 값 채우기)
function editBook(id) {
  fetch(`${API_BASE_URL}/api/books/${id}`)
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "존재하지 않는 도서입니다.");
      }
      return response.json();
    })
    .then((book) => {
      bookForm.elements["title"].value = book.title;
      bookForm.elements["author"].value = book.author;
      bookForm.elements["isbn"].value = book.isbn;
      bookForm.elements["price"].value = book.price;
      bookForm.elements["publishDate"].value = book.publishDate;

      editingBookId = id;
      bookForm.querySelector("button[type='submit']").textContent = "수정";

      // cancel 버튼 보이게
      let cancelBtn = document.getElementById("cancel-button");
      if (!cancelBtn) {
        cancelBtn = document.createElement("button");
        cancelBtn.id = "cancel-button";
        cancelBtn.textContent = "취소";
        cancelBtn.type = "button";
        cancelBtn.style.marginLeft = "10px";
        cancelBtn.addEventListener("click", function () {
          bookForm.reset();
          editingBookId = null;
          bookForm.querySelector("button[type='submit']").textContent = "도서 등록";
          cancelBtn.style.display = "none";
        });
        bookForm.appendChild(cancelBtn);
      } else {
        cancelBtn.style.display = "inline-block";
      }
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
}

// 도서 수정 실제 적용
function updateBook(id, bookData) {
  fetch(`${API_BASE_URL}/api/books/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "도서 수정 실패");
      return data;
    })
    .then(() => {
      alert("도서가 수정되었습니다.");
      bookForm.reset();
      editingBookId = null;
      bookForm.querySelector("button[type='submit']").textContent = "도서 등록";

      const cancelBtn = document.getElementById("cancel-button");
      if (cancelBtn) cancelBtn.style.display = "none";

      loadBooks();
    })
    .catch((error) => {
      console.error(error);
      alert(error.message);
    });
}

// 도서 데이터 검증
function validateBook(bookData) {
  if (!bookData.title) return alert("제목을 입력해주세요."), false;
  if (!bookData.author) return alert("저자를 입력해주세요."), false;

  const isbnPattern = /^(?:\d{9}[\dX]|\d{13})$/;
  if (!isbnPattern.test(bookData.isbn)) {
    alert("ISBN은 10자리 또는 13자리만 가능합니다.");
    return false;
  }

  if (!bookData.price) return alert("가격을 입력해주세요."), false;
  if (!bookData.publishDate) return alert("출판일을 입력해주세요."), false;

  return true;
}