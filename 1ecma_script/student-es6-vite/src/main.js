// CSS 파일 불러오기
import './css/style.css'

// 모듈들 불러오기 (구조분해할당 사용)
import { apiService } from './modules/api.js'
import { validateStudent } from './modules/validation.js'
import { uiService } from './modules/ui.js'
import { formatDate } from './utils/helpers.js'

// 전역 상태
let editingStudentId = null

// DOM 요소들
let elements = {}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', async () => {
    console.log('페이지가 로드되었습니다.')
    
    // DOM 요소 찾기
    findElements()
    
    // 이벤트 설정
    setupEvents()
    
    // 학생 목록 로드
    await loadStudents()
})

// DOM 요소들 찾기
const findElements = () => {
    elements = {
        form: document.getElementById('studentForm'),
        tableBody: document.getElementById('studentTableBody'),
        submitButton: document.querySelector('button[type="submit"]'),
        cancelButton: document.querySelector('.cancel-btn'),
        errorSpan: document.getElementById('formError')
    }
}

// 이벤트 설정 (화살표 함수 사용)
const setupEvents = () => {
    // 폼 제출 이벤트
    elements.form.addEventListener('submit', async (event) => {
        event.preventDefault()
        await handleFormSubmit()
    })
    
    // 취소 버튼 이벤트
    elements.cancelButton.addEventListener('click', () => {
        resetForm()
    })
}

// 폼 제출 처리 (async/await 사용)
const handleFormSubmit = async () => {
    console.log('폼이 제출되었습니다.')
    
    try {
        // 폼 데이터 가져오기
        const studentData = getFormData()
        
        // 유효성 검사
        const validation = validateStudent(studentData)
        if (!validation.isValid) {
            uiService.showError(validation.message)
            focusField(validation.field)
            return
        }
        
        console.log('검증 완료된 데이터:', studentData)
        
        // 수정 또는 생성 처리
        if (editingStudentId) {
            await updateStudent(editingStudentId, studentData)
        } else {
            await createStudent(studentData)
        }
        
    } catch (error) {
        console.error('폼 제출 오류:', error)
        uiService.showError(error.message)
    }
}

// 폼 데이터 가져오기 (구조분해할당 활용)
const getFormData = () => {
    const formData = new FormData(elements.form)
    
    // 기본값과 함께 구조분해할당
    const name = formData.get('name') || ''
    const studentNumber = formData.get('studentNumber') || ''
    const address = formData.get('address') || ''
    const phoneNumber = formData.get('phoneNumber') || ''
    const email = formData.get('email') || ''
    const dateOfBirth = formData.get('dateOfBirth') || null
    
    return {
        name: name.trim(),
        studentNumber: studentNumber.trim(),
        detailRequest: {
            address: address.trim(),
            phoneNumber: phoneNumber.trim(),
            email: email.trim(),
            dateOfBirth
        }
    }
}

// 새 학생 등록 (async/await)
const createStudent = async (studentData) => {
    console.log('학생 등록 시작')
    
    try {
        uiService.setButtonLoading(elements.submitButton, true, '등록 중...')
        
        const result = await apiService.createStudent(studentData)
        console.log('등록 성공:', result)
        
        uiService.showSuccess('학생이 성공적으로 등록되었습니다!')
        elements.form.reset()
        await loadStudents()
        
    } catch (error) {
        console.error('등록 오류:', error)
        uiService.showError(error.message)
    } finally {
        uiService.setButtonLoading(elements.submitButton, false, '학생 등록')
    }
}

// 학생 정보 수정 (async/await)
const updateStudent = async (studentId, studentData) => {
    console.log('학생 수정 시작:', studentId)
    
    try {
        uiService.setButtonLoading(elements.submitButton, true, '수정 중...')
        
        const result = await apiService.updateStudent(studentId, studentData)
        console.log('수정 성공:', result)
        
        uiService.showSuccess('학생이 성공적으로 수정되었습니다!')
        resetForm()
        await loadStudents()
        
    } catch (error) {
        console.error('수정 오류:', error)
        uiService.showError(error.message)
    } finally {
        uiService.setButtonLoading(elements.submitButton, false, '학생 등록')
    }
}

// 학생 삭제 (전역 함수, async/await)
window.deleteStudent = async (studentId, studentName) => {
    // 템플릿 리터럴 사용
    if (!confirm(`이름 = ${studentName} 학생을 정말로 삭제하시겠습니까?`)) {
        return
    }
    
    console.log('학생 삭제 시작:', studentId)
    
    try {
        await apiService.deleteStudent(studentId)
        console.log('삭제 성공')
        
        uiService.showSuccess('학생이 성공적으로 삭제되었습니다!')
        await loadStudents()
        
    } catch (error) {
        console.error('삭제 오류:', error)
        uiService.showError(error.message)
    }
}

// 학생 편집 모드 (전역 함수, async/await)
window.editStudent = async (studentId) => {
    console.log('학생 편집 시작:', studentId)
    
    try {
        const student = await apiService.getStudent(studentId)
        console.log('학생 정보:', student)
        
        fillFormWithStudentData(student)
        setEditMode(studentId)
        
    } catch (error) {
        console.error('편집 오류:', error)
        uiService.showError(error.message)
    }
}

// 폼에 학생 데이터 채우기 (구조분해할당)
const fillFormWithStudentData = (student) => {
    // 구조분해할당으로 데이터 추출 (기본값 설정)
    const { name = '', studentNumber = '', detail = {} } = student
    const { address = '', phoneNumber = '', email = '', dateOfBirth = '' } = detail
    
    // form elements에 값 설정
    elements.form.elements.name.value = name
    elements.form.elements.studentNumber.value = studentNumber
    elements.form.elements.address.value = address
    elements.form.elements.phoneNumber.value = phoneNumber
    elements.form.elements.email.value = email
    elements.form.elements.dateOfBirth.value = dateOfBirth
}

// 편집 모드 설정 (화살표 함수)
const setEditMode = (studentId) => {
    editingStudentId = studentId
    elements.submitButton.textContent = '학생 수정'
    elements.cancelButton.style.display = 'inline-block'
    elements.form.elements.name.focus()
}

// 폼 리셋 (화살표 함수)
const resetForm = () => {
    elements.form.reset()
    editingStudentId = null
    elements.submitButton.textContent = '학생 등록'
    elements.cancelButton.style.display = 'none'
    uiService.hideMessage()
    elements.form.elements.name.focus()
}

// 학생 목록 로드 (async/await)
const loadStudents = async () => {
    console.log('학생 목록 불러오는 중...')
    
    try {
        const students = await apiService.getStudents()
        console.log(`${students.length}명의 학생 데이터를 받았습니다.`)
        
        renderStudentTable(students)
        
    } catch (error) {
        console.error('목록 로드 오류:', error)
        uiService.showError(error.message)
        renderErrorTable(error.message)
    }
}

// 학생 목록 테이블 렌더링 (화살표 함수)
const renderStudentTable = (students) => {
    // 테이블 내용 초기화
    elements.tableBody.innerHTML = ''
    
    // 학생이 없는 경우 등록된 학생이 없습니다.
    if (students.length === 0) {
        renderErrorTable('등록된 학생이 없습니다.')
        return
    }
    
    // 각 학생 행 생성 (일반적인 for 루프 사용)
    //for (let i = 0; i < students.length; i++) {
        // const student = students[i]
    for(let student of students) {
        const row = createStudentRow(student)
        elements.tableBody.appendChild(row)
    }    
    //}
}

// 학생 행 생성 (구조분해할당과 템플릿 리터럴)
const createStudentRow = (student) => {
    // 구조분해할당으로 데이터 추출
    const { id, name = '', studentNumber = '', detail } = student
    
    // detail이 있는 경우 구조분해할당, 없으면 기본값
    let address = '-'
    let phoneNumber = '-'
    let email = '-'
    let formattedDate = '-'
    
    if (detail) {
        address = detail.address || '-'
        phoneNumber = detail.phoneNumber || '-'
        email = detail.email || '-'
        formattedDate = detail.dateOfBirth ? formatDate(detail.dateOfBirth) : '-'
    }
    
    const row = document.createElement('tr')
    
    // 템플릿 리터럴 사용
    row.innerHTML = `
        <td>${name}</td>
        <td>${studentNumber}</td>
        <td>${address}</td>
        <td>${phoneNumber}</td>
        <td>${email}</td>
        <td>${formattedDate}</td>
        <td class="action-buttons">
            <button class="edit-btn" onclick="editStudent(${id})">수정</button>
            <button class="delete-btn" onclick="deleteStudent(${id}, '${name}')">삭제</button>
        </td>
    `
    
    return row
}

// 에러 테이블 렌더링 (템플릿 리터럴)
const renderErrorTable = (errorMessage) => {
    elements.tableBody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; color: #dc3545; padding: 20px;">
                오류: 데이터를 불러올 수 없습니다.<br>
                ${errorMessage}
            </td>
        </tr>
    `
}

// 필드에 포커스 주기 (화살표 함수)
const focusField = (fieldName) => {
    const field = elements.form.elements[fieldName]
    if (field) {
        field.focus()
    }
}