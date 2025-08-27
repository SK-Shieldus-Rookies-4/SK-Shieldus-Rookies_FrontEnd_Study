// 전역변수
const API_BASE_URL = "http://localhost:8080";

// DOM 요소 가져오기
const bookForm = document.getElementById("bookForm");
const bookTableBody = document.getElementById("bookTableBody");

// 페이지 로드 시 도서 목록 불러오기
document.addEventListener("DOMContentLoaded", function () {
    loadBooks(); // 소문자로 수정
});

// 폼 제출 이벤트
bookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // FormData 생성
    const bookFormData = new FormData(bookForm);

    // 객체 형태로 변환
    const bookData = {
        title: bookFormData.get("title").trim(),
        author: bookFormData.get("author").trim(),
        isbn: bookFormData.get("isbn").trim(),
        price: bookFormData.get("price").trim(),
        publishDate: bookFormData.get("publishDate")
    };

    if (!validateBook(bookData)) return;

    console.log(bookData);
});

// 유효성 검사
function validateBook(book) {
    if (!book.title) { alert("책 제목을 입력해야 합니다."); return false; }
    if (!book.author) { alert("저자를 입력해야 합니다."); return false; }
    if (!book.isbn) { alert("ISBN을 입력해야 합니다."); return false; }
    if (!book.price || Number(book.price) <= 0) { alert("가격은 0보다 큰 숫자여야 합니다."); return false; }
    if (!book.publishDate) { alert("출판일을 입력해야 합니다."); return false; }
    return true;
}

// 도서 목록 불러오기
function loadBooks() {
    fetch(`${API_BASE_URL}/api/books`)
        .then(response => {
            if (!response.ok) throw new Error("도서 목록 불러오기 실패");
            return response.json();
        })
        .then(books => renderBookTable(books))
        .catch(error => {
            console.error(error);
            alert("도서 목록을 불러오는데 실패했습니다.");
        });
}

// 테이블 렌더링
function renderBookTable(books) {
    bookTableBody.innerHTML = "";
    books.forEach(book => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.price}</td>
            <td>${book.publishDate}</td>
            <td>
                <button onclick="editBook(${book.id})">수정</button>
                <button onclick="deleteBook(${book.id})">삭제</button>
            </td>
        `;
        bookTableBody.appendChild(row);
    });
}

// 임시 삭제/수정
function deleteBook(id) { alert(`삭제: ${id}`); }
function editBook(id) { alert(`수정: ${id}`); }