//전역변수
const API_BASE_URL = "http://localhost:8080";

// DOM 요소 가져오기
const bookForm = document.getElementById("bookForm");
const bookTableBody = document.getElementById("bookTableBody"); // 도서 리스트 테이블의 tbody

// 페이지 로드 시 도서 목록 불러오기
document.addEventListener("DOMContentLoaded", function () {
    LoadBooks();
});

// 폼 제출 이벤트
bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("[book] Form이 제출 되었음.....");

    // FormData 생성
    const bookFormData = new FormData(bookForm);
    bookFormData.forEach((value, key) => {
        console.log(`${key} = ${value}`);
    });

    // 객체 형태로 변환
    const bookData = {
        title: bookFormData.get("title").trim(),
        author: bookFormData.get("author").trim(),
        isbn: bookFormData.get("isbn").trim(),
        price: bookFormData.get("price").trim(),
        publishDate: bookFormData.get("publishDate")
    };

    if (!validateBook(bookData)) {
        return;
    }

    console.log(bookData);

});

function validateBook(book) {
    if (!book.title || !book.author || !book.isbn || !book.price || !book.publishDate) {
        alert("모든 필드를 입력해야 합니다.");
        return false;
    }
    return true;
}

function loadBooks() {
    console.log("도서 목록 Load 중...");
    fetch(`${API_BASE_URL}/api/books`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("도서 목록을 불러오는데 실패했습니다.");
            }
            return response.json();
        })
        .then((books) => renderBookTable(books))
        .catch((error) => {
            console.log("Error: " + error);
            alert("도서 목록을 불러오는데 실패했습니다.");
        });       
};

function renderBookTable(books) {
    console.log(books);
    bookTableBody.innerHTML = "";
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
                <button class="delete-btn" onclick="deleteBook(${book.id})">삭제</button>
            </td>
        `;
        bookTableBody.appendChild(row);
    });
}
