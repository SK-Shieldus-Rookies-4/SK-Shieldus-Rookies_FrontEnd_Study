import './css/style.css'

import { apiService } from './modules/api.js'
import { validateBook } from './modules/validation.js'
import { ui } from './modules/ui.js'
import { formatDate } from './utils/helpers.js'

// 전역 상태
let editingBookId = null

// DOM 요소 저장
let elements = {}

// 페이지 로드 후 실행
document.addEventListener('DOMContentLoaded', async () => {
  console.log('페이지 로드 완료')

  findElements()
  setupEvents()
  await loadBooks()
})

// DOM 요소 찾기
const findElements = () => {
  elements = {
    form: document.getElementById('bookForm'),
    tableBody: document.getElementById('bookTableBody'),
    submitButton: document.querySelector('button[type="submit"]'),
    cancelButton: document.querySelector('.cancel-btn'),
    errorSpan: document.getElementById('formError'),
  }
}

// 이벤트 설정
const setupEvents = () => {
  // 책 등록/수정 이벤트
  if (elements.form) {
    elements.form.addEventListener('submit', async (event) => {
      event.preventDefault()
      await handleFormSubmit()
    })
  }

  if (elements.cancelButton) {
    elements.cancelButton.addEventListener('click', () => {
      resetForm()
    })
  }
}

// 폼 제출 처리
const handleFormSubmit = async () => {
  try {
    const bookData = getFormData()

    // 유효성 검사
    const validation = validateBook(bookData)
    if (!validation.isValid) {
      ui.showErrorMessage(validation.message)
      focusField(validation.field)
      return
    }

    if (editingBookId) {
      await updateBook(editingBookId, bookData)
    } else {
      await createBook(bookData)
    }
  } catch (error) {
    console.error('폼 제출 오류:', error)
    ui.showErrorMessage(error.message)
  }
}

// 폼 데이터 가져오기 
const getFormData = () => {
  const form = elements.form;
  const title = form.elements.title.value.trim();
  const author = form.elements.author.value.trim();
  const isbn = form.elements.isbn.value.trim();
  const price = form.elements.price.value.trim();
  const publishDate = form.elements.publishDate.value; // YYYY-MM-DD
  const publisher = form.elements.publisher.value.trim();

  return {
    title,
    author,
    price: price ? Number(price) : null,
    publish_date: publishDate || null,
    publisher_id: null,
    detailRequest: {
      isbn,
      publisher,
      publishDate
    }
  };
};


// 책 등록
const createBook = async (bookData) => {
  try {
    ui.setButtonLoading(elements.submitButton, true, '등록 중...')
    await apiService.createBook(bookData)

    ui.showSuccessMessage('도서가 성공적으로 등록되었습니다.')
    elements.form.reset()
    await loadBooks()
  } catch (error) {
    console.error('등록 오류:', error)
    ui.showErrorMessage(error.message)
  } finally {
    ui.setButtonLoading(elements.submitButton, false, '도서 등록')
  }
}

// updateBook
const updateBook = async (bookId, bookData) => {
  try {
    ui.setButtonLoading(elements.submitButton, true, '수정 중...');
    // bookData 전체를 보내거나 서버가 기대하는 구조로 맞춤
    await apiService.updateBook(bookId, bookData);

    ui.showSuccessMessage('도서가 성공적으로 수정되었습니다.');
    resetForm();
    await loadBooks();
  } catch (error) {
    console.error('수정 오류:', error);
    ui.showErrorMessage(error.message);
  } finally {
    ui.setButtonLoading(elements.submitButton, false, '도서 등록');
  }
};

// 책 삭제
window.deleteBook = async (bookId, bookTitle) => {
  if (!confirm(`"${bookTitle}" 도서를 삭제하시겠습니까?`)) return

  try {
    await apiService.deleteBook(bookId)
    ui.showSuccessMessage('도서가 성공적으로 삭제되었습니다.')
    await loadBooks()
  } catch (error) {
    console.error('삭제 오류:', error)
    ui.showErrorMessage(error.message)
  }
}

// 폼에 데이터 채우기
const fillFormWithBookData = (book) => {
  if (!book) return;

  const form = elements.form;

  form.elements.title.value = book.title || '';
  form.elements.author.value = book.author || '';
  form.elements.isbn.value = book.isbn || '';
  form.elements.price.value = book.price || '';

  // publishDate 처리
  let dateStr = book.publishDate || book.detail?.publishDate || '';
  if (dateStr) {
    // YYYY-MM-DD 형태로 맞추기
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      form.elements.publishDate.value = `${yyyy}-${mm}-${dd}`;
    } else {
      form.elements.publishDate.value = '';
    }
  } else {
    form.elements.publishDate.value = '';
  }

  form.elements.publisher.value = book.detail?.publisher || '';
}

// 책 편집
window.editBook = async (bookId) => {
  try {
    const book = await apiService.getBook(bookId)
    fillFormWithBookData(book)
    setEditMode(bookId)
  } catch (error) {
    console.error('편집 오류:', error)
    ui.showErrorMessage(error.message)
  }
}


// 편집 모드 설정
const setEditMode = (bookId) => {
  editingBookId = bookId
  elements.submitButton.textContent = '도서 수정'
  elements.cancelButton.style.display = 'inline-block'
  elements.form.elements.title.focus()
}

// 폼 리셋
const resetForm = () => {
  elements.form.reset()
  editingBookId = null
  elements.submitButton.textContent = '도서 등록'
  elements.cancelButton.style.display = 'none'
  ui.hideMessage()
  elements.form.elements.title.focus()
}

// 도서 목록 로드
const loadBooks = async () => {
  try {
    const books = await apiService.getBooks()
    renderBookTable(books)
  } catch (error) {
    console.error('목록 로드 오류:', error)
    ui.showErrorMessage(error.message)
    renderErrorTable(error.message)
  }
}

// 도서 테이블 렌더링
const renderBookTable = (books) => {
  elements.tableBody.innerHTML = ''

  if (!books || books.length === 0) {
    renderErrorTable('등록된 도서가 없습니다.')
    return
  }

  for (const book of books) {
    const row = createBookRow(book)
    elements.tableBody.appendChild(row)
  }
}

// 도서 행 생성
const createBookRow = (book) => {
  const { id, title = '', author = '', isbn = '', price = '-', publishDate } = book

  const formattedPrice = price !== '-' ? price.toLocaleString() + '원' : '-'
  const formattedDate = publishDate ? formatDate(publishDate) : '-'

  const row = document.createElement('tr')
  row.innerHTML = `
    <td>${title}</td>
    <td>${author}</td>
    <td>${isbn || '-'}</td>
    <td>${formattedPrice}</td>
    <td>${formattedDate}</td>
    <td class="action-buttons">
      <button class="edit-btn" onclick="editBook(${id})">수정</button>
      <button class="delete-btn" onclick="deleteBook(${id}, '${title}')">삭제</button>
    </td>
  `
  return row
}

// 에러 테이블 렌더링
const renderErrorTable = (errorMessage) => {
  elements.tableBody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align: center; color: #dc3545; padding: 20px;">
                오류: 데이터를 불러올 수 없습니다.<br>
                ${errorMessage}
            </td>
        </tr>
    `
}

// 특정 필드 포커스
const focusField = (fieldName) => {
  const field = elements.form.elements[fieldName]
  if (field) {
    field.focus()
  }
}