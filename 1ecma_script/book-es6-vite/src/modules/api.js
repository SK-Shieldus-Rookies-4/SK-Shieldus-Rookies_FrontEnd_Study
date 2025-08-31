// API 서비스 모듈 - async/await와 구조분해할당 사용

// 서버 API의 기본 URL 주소
const API_BASE_URL = 'http://localhost:8080'

const request = async (endpoint, options = {}) => {
    // 전체 URL 생성
    const url = `${API_BASE_URL}${endpoint}`
    
    const { method = 'GET', body, headers = {} } = options
    

    const requestOptions = {
        method,                          // HTTP 메서드 (GET, POST, PUT, DELETE)
        headers: {
            'Content-Type': 'application/json',  // JSON 데이터 전송을 위한 헤더
            ...headers                   
        }
    }

    if (body) {
        requestOptions.body = JSON.stringify(body)  // JavaScript 객체 → JSON 문자열
    }
    
    try {

        console.log(`API 요청: ${method} ${url}`)
        
        const response = await fetch(url, requestOptions)
        
        if (!response.ok) {

            const errorData = await response.json()
            
            const errorMessage = getErrorMessage(response.status, errorData)

            throw new Error(errorMessage)
        }
        
        if (method === 'DELETE') {
            return null
        }
        
        return await response.json()  // JSON 문자열 → JavaScript 객체
        
    } catch (error) {
        // 10단계: 오류 처리 및 로깅
        console.error('API 요청 오류:', error)

        if (error.name === 'TypeError') {
            throw new Error('네트워크 연결을 확인해주세요.')
        }
        
        throw error
    }
}

const getErrorMessage = (status, errorData) => {
    // 서버에서 보낸 메시지가 있으면 사용하고, 없으면 기본 메시지
    const serverMessage = errorData.message || '알 수 없는 오류가 발생했습니다.'
    
    // HTTP 상태 코드별 메시지 처리
    // 각 상태코드의 의미:
    // 400: Bad Request - 잘못된 요청 형식
    // 404: Not Found - 리소스를 찾을 수 없음
    // 409: Conflict - 데이터 중복 등의 충돌
    // 500: Internal Server Error - 서버 내부 오류
    
    if (status === 400) {
        return `입력데이터 오류 : ${serverMessage}`
    }
    if (status === 404) {
        return `데이터가 존재하지 않음 : ${serverMessage}`
    }
    if (status === 409) {
        return `중복 오류: ${serverMessage}`
    }
    if (status === 500) {
        return `서버 오류: ${serverMessage}`
    }
    
    return `오류 (${status}): ${serverMessage}`
}

// API 서비스 객체 - 모든 학생 관련 API 호출을 담당
export const apiService = {
    // 도서 목록 조회 (async/await)
    // GET /api/books - 모든 도서 정보를 배열로 반환
    getBooks: async () => {
        return await request('/api/books')
    },

    // 특정 도서 조회 (async/await)
    // GET /api/books/{bookId} - ID로 특정 도서 정보 반환
    getBook: async (bookId) => {
        // 1단계: 입력값 검증 - 방어적 프로그래밍
        if (!bookId) {
            throw new Error('도서 ID가 필요합니다.')
        }
        
        // 2단계: 동적 URL 생성하여 요청
        // 예: bookId가 1이면 '/api/books/1'
        return await request(`/api/books/${bookId}`)
    },

    // 도서 생성 (async/await)
    // POST /api/books - 새로운 도서 정보를 서버에 저장
    createBook: async (bookData) => {
        // 1단계: 입력값 검증
        if (!bookData) {
            throw new Error('도서 데이터가 필요합니다.')
        }
        
        // 2단계: POST 요청으로 데이터 전송
        // body에 bookData를 포함하여 서버로 전송
        return await request('/api/books', {
            method: 'POST',
            body: bookData
        })
    },
    
    // 도서 수정 (async/await)
    // PUT /api/books/{bookId} - 기존 도서 정보를 전체적으로 수정
    updateBook: async (bookId, bookData) => {
        // 1단계: 입력값 검증 - 두 개의 매개변수 모두 필요
        if (!bookId) {
            throw new Error('도서 ID가 필요합니다.')
        }
        if (!bookData) {
            throw new Error('학생 데이터가 필요합니다.')
        }
        
        // 2단계: PUT 요청으로 데이터 수정
        // PUT: 리소스 전체를 교체 (PATCH: 부분 수정)
        return await request(`/api/books/${bookId}`, {
            method: 'PUT',
            body: bookData
        })
    },

    // 도서 삭제 (async/await)
    // DELETE /api/books/{bookId} - 특정 도서 정보를 서버에서 삭제
    deleteBook: async (bookId) => {
        // 1단계: 입력값 검증
        if (!bookId) {
            throw new Error('도서 ID가 필요합니다.')
        }
        
        // 2단계: DELETE 요청 실행
        // DELETE 요청은 body가 필요 없으므로 method만 지정
        return await request(`/api/books/${bookId}`, {
            method: 'DELETE'
        })
    }
}

