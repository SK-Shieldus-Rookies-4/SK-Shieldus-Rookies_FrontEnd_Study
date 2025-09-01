// validation.js

import { stringUtils } from '../utils/helpers'

// 구조 분해 할당
const { isEmpty, safeTrim } = stringUtils

// 정규식 패턴 정의
export const patterns = {
  // ISBN: 10자리 또는 13자리 숫자(하이픈 포함 가능)
  isbn: /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/,
  // 가격: 숫자만 허용
  price: /^[0-9]+$/
}

// 에러 메시지 정의
export const messages = {
  required: {
    title: '도서 제목을 입력해주세요.',
    author: '저자를 입력해주세요.',
    isbn: 'ISBN을 입력해주세요.',
    price: '가격을 입력해주세요.',
    publishDate: '출판일을 입력해주세요.'
  },
  format: {
    isbn: 'ISBN 형식이 올바르지 않습니다. (10자리 또는 13자리 숫자, 하이픈 포함 가능)',
    price: '가격은 숫자만 입력해주세요.'
  },
  logical: {
    publishDate: '출판일은 미래 날짜일 수 없습니다.'
  }
}

// 개별 필드 검증 함수
const validators = {
  // 제목 검증
  title: (title) => {
    if (isEmpty(title)) {
      return { isValid: false, message: messages.required.title, field: 'title' }
    }
    return { isValid: true }
  },

  // 저자 검증
  author: (author) => {
    if (isEmpty(author)) {
      return { isValid: false, message: messages.required.author, field: 'author' }
    }
    return { isValid: true }
  },

  // ISBN 검증
  isbn: (isbn) => {
    if (isEmpty(isbn)) {
      return { isValid: false, message: messages.required.isbn, field: 'isbn' }
    }
    if (!patterns.isbn.test(safeTrim(isbn))) {
      return { isValid: false, message: messages.format.isbn, field: 'isbn' }
    }
    return { isValid: true }
  },

  // 가격 검증
  price: (price) => {
    if (isEmpty(price)) {
      return { isValid: false, message: messages.required.price, field: 'price' }
    }
    if (!patterns.price.test(safeTrim(price))) {
      return { isValid: false, message: messages.format.price, field: 'price' }
    }
    return { isValid: true }
  },

  // 출판일 검증
  publishDate: (publishDate) => {
    if (isEmpty(publishDate)) {
      return { isValid: false, message: messages.required.publishDate, field: 'publishDate' }
    }

    const inputDate = new Date(publishDate)
    const today = new Date()
    if (inputDate > today) {
      return { isValid: false, message: messages.logical.publishDate, field: 'publishDate' }
    }
    return { isValid: true }
  }
}

// 전체 도서 데이터 검증
export const validateBook = (book) => {
  if (!book) {
    return { isValid: false, message: '도서 데이터가 필요합니다.' }
  }

  const { title, author, isbn, price, publishDate } = book

  const fields = ['title', 'author', 'isbn', 'price', 'publishDate']
  for (const field of fields) {
    const result = validators[field](book[field])
    if (!result.isValid) {
      return result
    }
  }

  return { isValid: true }
}

// 개별 필드 검증
export const validateField = (fieldName, value) => {
  const validator = validators[fieldName]
  if (!validator) {
    return { isValid: true, message: '알 수 없는 필드입니다.' }
  }
  return validator(value)
}