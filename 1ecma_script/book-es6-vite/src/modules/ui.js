// ui.js

// UI 모듈
export const ui = {
  /**
   * 폼 초기화
   * - 모든 입력 필드를 비우고 초기 상태로 되돌림
   */
  resetForm: (formElement) => {
    if (!formElement) return
    formElement.reset()
  },

  /**
   * 테이블 렌더링
   * - 도서 목록 데이터를 받아 테이블에 표시
   * @param {Array} books 도서 목록
   */
  renderTable: (books = []) => {
    const tableBody = document.getElementById('bookTableBody')
    if (!tableBody) return

    // 기존 행 초기화
    tableBody.innerHTML = ''

    if (books.length === 0) {
      const row = document.createElement('tr')
      const cell = document.createElement('td')
      cell.colSpan = 6
      cell.textContent = '등록된 도서가 없습니다.'
      cell.style.textAlign = 'center'
      row.appendChild(cell)
      tableBody.appendChild(row)
      return
    }

    // 도서 목록을 테이블에 렌더링
    books.forEach((book) => {
      const row = document.createElement('tr')

      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>${book.price ? book.price.toLocaleString() + '원' : '-'}</td>
        <td>${book.publishDate || '-'}</td>
        <td class="action-cell"></td>
      `

      // 액션 버튼 생성
      const actionCell = row.querySelector('.action-cell')
      const deleteButton = ui.createDeleteButton(book.id)
      actionCell.appendChild(deleteButton)

      tableBody.appendChild(row)
    })
  },

  /**
   * 삭제 버튼 생성
   * @param {number} bookId 도서 ID
   * @returns {HTMLButtonElement} 삭제 버튼
   */
  createDeleteButton: (bookId) => {
    const button = document.createElement('button')
    button.textContent = '삭제'
    button.classList.add('delete-btn')

    button.addEventListener('click', () => {
      const event = new CustomEvent('deleteBook', { detail: { id: bookId } })
      document.dispatchEvent(event)
    })

    return button
  },

  /**
   * 폼에 데이터 세팅 (수정 모드에서 사용)
   * @param {Object} book 도서 데이터
   * @param {HTMLFormElement} formElement 폼 요소
   */
  setFormData: (book, formElement) => {
    if (!book || !formElement) return

    formElement.querySelector('#title').value = book.title || ''
    formElement.querySelector('#author').value = book.author || ''
    formElement.querySelector('#isbn').value = book.isbn || ''
    formElement.querySelector('#price').value = book.price || ''
    formElement.querySelector('#publishDate').value = book.publishDate || ''
  },

  /**
   * 성공 메시지 표시
   * - UI에 성공 상태를 시각적으로 보여줌
   */
  showSuccessMessage: (message) => {
    const messageSpan = document.getElementById('messageSpan')
    if (!messageSpan) return
    messageSpan.textContent = message
    messageSpan.style.color = 'green'
  },

  /**
   * 에러 메시지 표시
   * - UI에 에러 상태를 시각적으로 보여줌
   */
  showErrorMessage: (message) => {
    const messageSpan = document.getElementById('messageSpan')
    if (!messageSpan) return
    messageSpan.textContent = message
    messageSpan.style.color = 'red'
  }
}