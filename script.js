// 전역 변수
let organizationData = [];
let currentInputMethod = 'manual';
let departmentOrder = []; // 모든 부서 순서 저장 (가로 배열)
let smallDeptOrder = []; // 소수 부서 순서 저장 (합치기/분리 지원)
let schoolName = ''; // 학교명 저장
let schoolPhone = ''; // 대표전화번호 저장

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 학교 비상연락망 생성기가 준비되었습니다!');
    updateGenerateButton();
    
    // 부서명 선택박스 이벤트 추가
    const deptSelect = document.getElementById('department');
    const customDeptInput = document.getElementById('customDepartment');
    
    if (deptSelect) {
        deptSelect.addEventListener('change', function() {
            if (this.value === '기타') {
                customDeptInput.style.display = 'block';
                customDeptInput.focus();
            } else {
                customDeptInput.style.display = 'none';
                customDeptInput.value = '';
            }
        });
    }
});

// 입력 방법 선택 함수들
function showManualInput() {
    switchInputMethod('manual');
    document.getElementById('manualInputSection').style.display = 'block';
    document.getElementById('fileUploadSection').style.display = 'none';
    document.getElementById('sampleDataSection').style.display = 'none';
}

function showFileUpload() {
    switchInputMethod('file');
    document.getElementById('manualInputSection').style.display = 'none';
    document.getElementById('fileUploadSection').style.display = 'block';
    document.getElementById('sampleDataSection').style.display = 'none';
}

function showSampleData() {
    switchInputMethod('sample');
    document.getElementById('manualInputSection').style.display = 'none';
    document.getElementById('fileUploadSection').style.display = 'none';
    document.getElementById('sampleDataSection').style.display = 'block';
}

function switchInputMethod(method) {
    currentInputMethod = method;
    
    // 버튼 활성화 상태 변경
    document.querySelectorAll('.method-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (method === 'manual') {
        document.getElementById('manualBtn').classList.add('active');
    } else if (method === 'file') {
        document.getElementById('fileBtn').classList.add('active');
    } else if (method === 'sample') {
        document.getElementById('sampleBtn').classList.add('active');
    }
}

// 수동 입력 관련 함수들
function addPerson() {
    const deptSelect = document.getElementById('department').value;
    const customDept = document.getElementById('customDepartment').value.trim();
    const department = deptSelect === '기타' ? customDept : deptSelect;
    const position = document.getElementById('position').value;
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const gradeClass = document.getElementById('gradeClass').value.trim();
    
    // 유효성 검사
    if (!department || !position || !name || !phone) {
        alert('❌ 부서명, 직책, 이름, 전화번호는 필수 입력 항목입니다!');
        return;
    }
    
    // 전화번호 형식 검사
    const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
        alert('❌ 전화번호는 010-1234-5678 형식으로 입력해주세요!');
        return;
    }
    
    // 담임인 경우 학년반 필수
    if (position === '담임' && !gradeClass) {
        alert('❌ 담임의 경우 학년반을 입력해주세요! (예: 1-1, 2-3)');
        return;
    }
    
    // 학년반 형식 검사 (담임인 경우)
    if (position === '담임') {
        const gradeClassRegex = /^\d+-\d+$/;
        if (!gradeClassRegex.test(gradeClass)) {
            alert('❌ 학년반은 1-1, 2-3 형식으로 입력해주세요!');
            return;
        }
    }
    
    // 데이터 추가
    const person = {
        department: department,
        position: position,
        name: name,
        phone: phone,
        grade_class: gradeClass
    };
    
    organizationData.push(person);
    
    // 입력 필드 초기화
    document.getElementById('department').value = '';
    document.getElementById('customDepartment').value = '';
    document.getElementById('customDepartment').style.display = 'none';
    document.getElementById('position').value = '';
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('gradeClass').value = '';
    
    // 현재 데이터 목록 업데이트
    updateCurrentDataList();
    updateGenerateButton();
    
    // 성공 메시지
    showSuccessMessage(`✅ ${name}님이 추가되었습니다!`);
}

function updateCurrentDataList() {
    const listContainer = document.getElementById('currentDataList');
    
    if (organizationData.length === 0) {
        listContainer.innerHTML = '<p style="color: #666; text-align: center;">아직 입력된 데이터가 없습니다.</p>';
        return;
    }
    
    let listHTML = '';
    organizationData.forEach((person, index) => {
        const gradeClassDisplay = person.grade_class ? ` (${person.grade_class})` : '';
        listHTML += `
            <div class="data-item">
                <div class="info">
                    <strong>${person.department}</strong> | ${person.position}${gradeClassDisplay}: ${person.name}
                    <br><small style="color: #666;">${person.phone}</small>
                </div>
                <button class="remove-btn" onclick="removePerson(${index})">삭제</button>
            </div>
        `;
    });
    
    listContainer.innerHTML = listHTML;
}

function removePerson(index) {
    const person = organizationData[index];
    if (confirm(`${person.name}님을 삭제하시겠습니까?`)) {
        organizationData.splice(index, 1);
        updateCurrentDataList();
        updateGenerateButton();
        showSuccessMessage('✅ 삭제되었습니다.');
    }
}

function clearAllData() {
    if (organizationData.length === 0) {
        alert('삭제할 데이터가 없습니다.');
        return;
    }
    
    if (confirm('정말로 모든 데이터를 삭제하시겠습니까?')) {
        organizationData = [];
        departmentOrder = [];
        smallDeptOrder = [];
        schoolName = '';
        schoolPhone = '';
        
        // 학교 정보 입력 필드들 초기화
        const schoolNameInput = document.getElementById('schoolName');
        const schoolPhoneInput = document.getElementById('schoolPhone');
        if (schoolNameInput) {
            schoolNameInput.value = '';
        }
        if (schoolPhoneInput) {
            schoolPhoneInput.value = '';
        }
        
        updateCurrentDataList();
        updateGenerateButton();
        hidePreview();
        showSuccessMessage('✅ 모든 데이터가 삭제되었습니다.');
    }
}

// 파일 업로드 관련 함수들
function handleFileUpload(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
        alert('❌ CSV 파일만 업로드 가능합니다!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            parseCSVData(e.target.result);
        } catch (error) {
            console.error('CSV 파싱 오류:', error);
            alert('❌ CSV 파일을 읽는 중 오류가 발생했습니다. 파일 형식을 확인해주세요.');
        }
    };
    
    reader.readAsText(file, 'UTF-8');
}

function parseCSVData(csvText) {
    const lines = csvText.split('\n');
    const parsedData = [];
    
    // 첫 번째 줄이 헤더인지 확인 (부서명, 직책, 이름, 전화번호, 학년반 포함)
    let startIndex = 0;
    if (lines[0] && (lines[0].includes('부서') || lines[0].includes('직책') || lines[0].includes('이름'))) {
        startIndex = 1; // 헤더 스킵
    }
    
    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
        
        if (columns.length >= 4) {
            const person = {
                department: columns[0] || '',
                position: columns[1] || '',
                name: columns[2] || '',
                phone: columns[3] || '',
                grade_class: columns[4] || ''
            };
            
            // 기본 유효성 검사
            if (person.department && person.position && person.name && person.phone) {
                parsedData.push(person);
            }
        }
    }
    
    if (parsedData.length === 0) {
        alert('❌ 유효한 데이터를 찾을 수 없습니다. CSV 형식을 확인해주세요.');
        return;
    }
    
    // 기존 데이터에 추가할지 물어보기
    if (organizationData.length > 0) {
        if (confirm(`기존 데이터 ${organizationData.length}건에 새로운 데이터 ${parsedData.length}건을 추가하시겠습니까?`)) {
            organizationData = organizationData.concat(parsedData);
        } else {
            organizationData = parsedData;
        }
    } else {
        organizationData = parsedData;
    }
    
    updateCurrentDataList();
    updateGenerateButton();
    showSuccessMessage(`✅ CSV 파일에서 ${parsedData.length}건의 데이터를 불러왔습니다!`);
}

// 샘플 데이터 로드
function loadSampleData() {
    const sampleData = [
        // 관리진
        { department: '교무부', position: '교장', name: '김교장', phone: '010-1111-1111', grade_class: '' },
        { department: '교무부', position: '교감', name: '박교감', phone: '010-2222-2222', grade_class: '' },
        
        // 행정실
        { department: '행정실', position: '부장', name: '이행정', phone: '010-2000-2000', grade_class: '' },
        { department: '행정실', position: '부원', name: '정회계', phone: '010-2001-2001', grade_class: '' },
        
        // 교무부
        { department: '교무부', position: '부장', name: '최교무', phone: '010-3333-3333', grade_class: '' },
        { department: '교무부', position: '부원', name: '한선생', phone: '010-4444-4444', grade_class: '' },
        
        // 연구부
        { department: '연구부', position: '부장', name: '윤연구', phone: '010-5555-5555', grade_class: '' },
        { department: '연구부', position: '부원', name: '강선생', phone: '010-6666-6666', grade_class: '' },
        
        // 학생부
        { department: '학생부', position: '부장', name: '정학생', phone: '010-7777-7777', grade_class: '' },
        { department: '학생부', position: '부원', name: '서선생', phone: '010-8888-8888', grade_class: '' },
        { department: '학생부', position: '부원', name: '김선생', phone: '010-8889-8889', grade_class: '' },
        
        // 1학년부
        { department: '1학년부', position: '부장', name: '안1학년', phone: '010-1000-1000', grade_class: '' },
        { department: '1학년부', position: '담임', name: '홍길동', phone: '010-1001-1001', grade_class: '1-1' },
        { department: '1학년부', position: '담임', name: '김영희', phone: '010-1002-1002', grade_class: '1-2' },
        { department: '1학년부', position: '담임', name: '이철수', phone: '010-1003-1003', grade_class: '1-3' },
        { department: '1학년부', position: '담임', name: '박순이', phone: '010-1004-1004', grade_class: '1-4' },
        
        // 2학년부
        { department: '2학년부', position: '부장', name: '신2학년', phone: '010-2000-2000', grade_class: '' },
        { department: '2학년부', position: '담임', name: '박미영', phone: '010-2001-2001', grade_class: '2-1' },
        { department: '2학년부', position: '담임', name: '정수진', phone: '010-2002-2002', grade_class: '2-2' },
        { department: '2학년부', position: '담임', name: '강민호', phone: '010-2003-2003', grade_class: '2-3' },
        { department: '2학년부', position: '담임', name: '조영수', phone: '010-2004-2004', grade_class: '2-4' },
        
        // 3학년부
        { department: '3학년부', position: '부장', name: '임3학년', phone: '010-3000-3000', grade_class: '' },
        { department: '3학년부', position: '담임', name: '윤서연', phone: '010-3001-3001', grade_class: '3-1' },
        { department: '3학년부', position: '담임', name: '조현우', phone: '010-3002-3002', grade_class: '3-2' },
        { department: '3학년부', position: '담임', name: '장미라', phone: '010-3003-3003', grade_class: '3-3' },
        { department: '3학년부', position: '담임', name: '오성민', phone: '010-3004-3004', grade_class: '3-4' },
        
        // 소수 부서들
        { department: '진로상담부', position: '부장', name: '유진로', phone: '010-9001-9001', grade_class: '' },
        { department: '진로상담부', position: '부원', name: '백상담', phone: '010-9002-9002', grade_class: '' },
        
        { department: '방송부', position: '부원', name: '김방송', phone: '010-9003-9003', grade_class: '' },
        
        { department: '도서부', position: '부장', name: '문도서', phone: '010-9004-9004', grade_class: '' },
        { department: '도서부', position: '부원', name: '책관리', phone: '010-9005-9005', grade_class: '' },
        
        { department: '보건실', position: '부원', name: '간호사', phone: '010-9006-9006', grade_class: '' },
        
        { department: '영양실', position: '부장', name: '최영양', phone: '010-9007-9007', grade_class: '' }
    ];
    
    if (organizationData.length > 0) {
        if (confirm('기존 데이터를 모두 삭제하고 샘플 데이터를 불러오시겠습니까?')) {
            organizationData = sampleData;
        } else {
            return;
        }
    } else {
        organizationData = sampleData;
    }
    
    updateCurrentDataList();
    updateGenerateButton();
    showSuccessMessage('✅ 샘플 데이터가 로드되었습니다!');
}

// 조직도 생성
function generateChart() {
    if (organizationData.length === 0) {
        alert('❌ 먼저 데이터를 입력해주세요!');
        return;
    }
    
    // 학교명과 대표전화번호 가져오기
    const schoolNameInput = document.getElementById('schoolName');
    const schoolPhoneInput = document.getElementById('schoolPhone');
    if (schoolNameInput) {
        schoolName = schoolNameInput.value.trim() || '○○학교';
    }
    if (schoolPhoneInput) {
        schoolPhone = schoolPhoneInput.value.trim() || '';
    }
    
    generateOrganizationChart();
    showPreview();
    
    // 페이지 상단으로 스크롤
    document.getElementById('previewSection').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
    
    showSuccessMessage('🎉 조직도가 생성되었습니다!');
}

// 조직도 생성 로직 (모든 부서 가로 배열, 소수 부서 합치기/분리 지원)
function generateOrganizationChart() {
    const chartContainer = document.getElementById('organizationChart');
    
    // 데이터 정리
    const organizedData = organizeDataByDepartment(organizationData);
    
    let chartHTML = '<div class="org-chart">';
    
    // 학교 정보 표시 (이름 + 대표전화)
    if (schoolName || schoolPhone) {
        chartHTML += '<div class="school-info">';
        if (schoolName) {
            chartHTML += `<div class="school-title">${schoolName} 비상연락망</div>`;
        }
        if (schoolPhone) {
            chartHTML += `<div class="school-phone">📞 ${schoolPhone}</div>`;
        }
        chartHTML += '</div>';
    }
    
    // 관리진 (교장, 교감) 추가
    chartHTML += '<div class="management">';
    
    // 교장 찾기
    const principal = organizationData.find(person => person.position === '교장');
    if (principal) {
        chartHTML += `
            <div class="principal">
                <div class="member-info">${principal.position}: ${principal.name}</div>
                <div class="member-phone">${principal.phone}</div>
            </div>
        `;
    }
    
    // 교감 찾기
    const vicePrincipal = organizationData.find(person => person.position === '교감');
    if (vicePrincipal) {
        chartHTML += `
            <div class="vice-principal">
                <div class="member-info">${vicePrincipal.position}: ${vicePrincipal.name}</div>
                <div class="member-phone">${vicePrincipal.phone}</div>
            </div>
        `;
    }
    
    chartHTML += '</div>';
    
    // 부서 정렬 컨트롤 추가 (합치기/분리 안내 제거)
    chartHTML += `
        <div class="sort-controls">
            <button onclick="sortDepartments('default')" class="sort-btn">기본순서</button>
            <button onclick="sortDepartments('name')" class="sort-btn">이름순</button>
            <button onclick="sortDepartments('size')" class="sort-btn">인원순</button>
            <span style="margin-left: 20px; color: #666; font-size: 14px;">💡 부서를 드래그해서 순서를 변경할 수 있습니다</span>
        </div>
    `;
    
    // 모든 부서를 하나의 배열로 통합 (인원수 구분 제거)
    const allDepts = [];
    
    for (const [deptName, members] of Object.entries(organizedData)) {
        const deptMembers = members.filter(m => m.position !== '교장' && m.position !== '교감');
        if (deptMembers.length > 0) {
            allDepts.push({ name: deptName, members: deptMembers });
        }
    }
    
    // 부서 순서 초기화 (인원수 구분 없이)
    if (departmentOrder.length === 0 && smallDeptOrder.length === 0) {
        departmentOrder = allDepts.map(dept => dept.name);
    }
    
    // 모든 부서를 하나의 가로 배열로 통합
    const allDeptKeys = [...departmentOrder, ...smallDeptOrder];
    
    // 모든 부서 가로 배치
    chartHTML += '<div class="departments" id="departmentsContainer">';
    
    allDeptKeys.forEach((deptKey, index) => {
        // 합쳐진 부서인지 확인
        if (deptKey.includes('+')) {
            chartHTML += createCombinedDepartmentHTML(deptKey, allDepts, index);
        } else {
            // 부서 찾기
            const dept = allDepts.find(d => d.name === deptKey);
            if (dept) {
                // 학년부들 특별 처리
                if (dept.name.includes('학년부')) {
                    chartHTML += createGradeDepartmentHTML(dept.name, dept.members, index);
                } else {
                    chartHTML += createDepartmentHTML(dept.name, dept.members, index);
                }
            }
        }
    });
    
    chartHTML += '</div>';
    chartHTML += '</div>';
    
    chartContainer.innerHTML = chartHTML;
    
    // 드래그 앤 드롭 이벤트 추가
    addDragAndDropEvents();
}

// 합쳐진 부서 HTML 생성 (모든 부서 지원, 인원수 무관)
function createCombinedDepartmentHTML(deptKey, allDepts, index) {
    const [dept1Name, dept2Name] = deptKey.split('+');
    
    // 모든 부서에서 찾기
    const dept1 = allDepts.find(d => d.name === dept1Name);
    const dept2 = allDepts.find(d => d.name === dept2Name);
    
    if (!dept1 || !dept2) return '';
    
    let html = `<div class="department combined" draggable="true" data-dept-index="${index}" data-dept-key="${deptKey}" ondblclick="separateCombinedDept(${index})">`;
    html += `<div class="department-header">${dept1.name} / ${dept2.name}</div>`;
    
    // 첫 번째 부서 구성원
    dept1.members.forEach(member => {
        const gradeClass = member.grade_class ? ` (${member.grade_class})` : '';
        html += `
            <div class="department-member">
                <span class="member-info">[${dept1.name}] ${member.position}: ${member.name}${gradeClass}</span>
                <span class="member-phone">${member.phone}</span>
            </div>
        `;
    });
    
    // 구분선과 두 번째 부서
    html += `<div class="combined-section">`;
    dept2.members.forEach(member => {
        const gradeClass = member.grade_class ? ` (${member.grade_class})` : '';
        html += `
            <div class="department-member">
                <span class="member-info">[${dept2.name}] ${member.position}: ${member.name}${gradeClass}</span>
                <span class="member-phone">${member.phone}</span>
            </div>
        `;
    });
    html += '</div>';
    
    html += '</div>';
    return html;
}

// 학년부 전용 HTML 생성 (담임 반별 정렬)
function createGradeDepartmentHTML(deptName, members, index) {
    let html = `<div class="department grade-dept" draggable="true" data-dept-index="${index}" data-dept-key="${deptName}">`;
    html += `<div class="department-header">${deptName}</div>`;
    
    // 담임과 일반 교사 분리
    const homerooms = members.filter(m => m.position === '담임' && m.grade_class);
    const others = members.filter(m => m.position !== '담임' || !m.grade_class);
    
    // 일반 부장/부원 먼저 표시
    others.forEach(member => {
        html += `
            <div class="department-member">
                <span class="member-info">${member.position}: ${member.name}</span>
                <span class="member-phone">${member.phone}</span>
            </div>
        `;
    });
    
    // 담임들을 학년-반 순서로 정렬
    const sortedHomerooms = sortHomeroomsByGradeClass(homerooms);
    
    // 담임들 표시
    sortedHomerooms.forEach(member => {
        const gradeClass = member.grade_class || '';
        html += `
            <div class="department-member homeroom">
                <span class="member-info">
                    <span class="homeroom-class">${gradeClass}</span> 담임: ${member.name}
                </span>
                <span class="member-phone">${member.phone}</span>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// 일반 부서 HTML 생성
function createDepartmentHTML(deptName, members, index) {
    let html = `<div class="department" draggable="true" data-dept-index="${index}" data-dept-key="${deptName}">`;
    html += `<div class="department-header">${deptName}</div>`;
    
    members.forEach(member => {
        html += `
            <div class="department-member">
                <span class="member-info">${member.position}: ${member.name}</span>
                <span class="member-phone">${member.phone}</span>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// 담임들을 학년-반 순서로 정렬하는 함수
function sortHomeroomsByGradeClass(homerooms) {
    return homerooms.sort((a, b) => {
        const parseGradeClass = (gradeClass) => {
            if (!gradeClass) return { grade: 999, class: 999 };
            const match = gradeClass.match(/(\d+)-(\d+)/);
            if (!match) return { grade: 999, class: 999 };
            return { 
                grade: parseInt(match[1]), 
                class: parseInt(match[2]) 
            };
        };
        
        const aGC = parseGradeClass(a.grade_class);
        const bGC = parseGradeClass(b.grade_class);
        
        // 학년 먼저 비교, 같으면 반 비교
        if (aGC.grade !== bGC.grade) {
            return aGC.grade - bGC.grade;
        }
        return aGC.class - bGC.class;
    });
}

// 부서별 데이터 정리
function organizeDataByDepartment(data) {
    const organized = {};
    
    data.forEach(person => {
        if (!organized[person.department]) {
            organized[person.department] = [];
        }
        organized[person.department].push(person);
    });
    
    // 각 부서 내에서 직책별 정렬
    for (const dept in organized) {
        organized[dept].sort((a, b) => {
            const order = { '교장': 0, '교감': 1, '부장': 2, '부원': 3, '담임': 4 };
            return order[a.position] - order[b.position];
        });
    }
    
    return organized;
}

// 드래그 앤 드롭 기능 추가
function addDragAndDropEvents() {
    // 모든 부서 드래그앤드롭
    const departments = document.querySelectorAll('.department');
    departments.forEach(dept => {
        dept.addEventListener('dragstart', handleDragStart);
        dept.addEventListener('dragover', handleDragOver);
        dept.addEventListener('drop', handleDrop);
        dept.addEventListener('dragend', handleDragEnd);
    });
}

let draggedElement = null;

// 부서 드래그앤드롭 핸들러들
function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    e.dataTransfer.dropEffect = 'move';
    
    // 모든 부서가 합치기 가능
    if (draggedElement && draggedElement !== this) {
        const draggedKey = draggedElement.dataset.deptKey;
        const targetKey = this.dataset.deptKey;
        
        if (draggedKey && targetKey) {
            // 이미 합쳐진 부서는 더 이상 합칠 수 없음
            if (draggedKey.includes('+') || targetKey.includes('+')) {
                this.classList.add('cannot-combine');
            } else {
                this.classList.add('can-combine');
            }
        } else {
            this.classList.add('drag-over');
        }
    }
    
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== this) {
        const draggedIndex = parseInt(draggedElement.dataset.deptIndex);
        const targetIndex = parseInt(this.dataset.deptIndex);
        const draggedKey = draggedElement.dataset.deptKey;
        const targetKey = this.dataset.deptKey;
        
        // 모든 부서가 합치기 가능
        if (draggedKey && targetKey && !draggedKey.includes('+') && !targetKey.includes('+')) {
            // 두 부서를 합치기
            const combinedKey = `${draggedKey}+${targetKey}`;
            
            // 일반 부서 목록에서 제거
            departmentOrder = departmentOrder.filter(key => key !== draggedKey && key !== targetKey);
            
            // 소수 부서 목록에서도 제거
            smallDeptOrder = smallDeptOrder.filter(key => key !== draggedKey && key !== targetKey);
            
            // 합쳐진 부서를 smallDeptOrder에 추가
            smallDeptOrder.push(combinedKey);
            
            generateOrganizationChart();
            showSuccessMessage('✅ 두 부서가 합쳐졌습니다! 더블클릭으로 분리할 수 있습니다.');
            return false;
        }
        
        // 일반적인 순서 변경
        const allDeptKeys = [...departmentOrder, ...smallDeptOrder];
        const draggedItem = allDeptKeys[draggedIndex];
        
        // 드래그된 부서가 일반 부서인지 소수 부서인지 확인
        if (departmentOrder.includes(draggedItem)) {
            // 일반 부서 순서 변경
            const deptIndex = departmentOrder.indexOf(draggedItem);
            departmentOrder.splice(deptIndex, 1);
            
            if (targetIndex < departmentOrder.length) {
                departmentOrder.splice(targetIndex, 0, draggedItem);
            } else {
                departmentOrder.push(draggedItem);
            }
        } else {
            // 소수 부서 순서 변경
            const deptIndex = smallDeptOrder.indexOf(draggedItem);
            smallDeptOrder.splice(deptIndex, 1);
            
            const adjustedTargetIndex = targetIndex - departmentOrder.length;
            if (adjustedTargetIndex >= 0 && adjustedTargetIndex < smallDeptOrder.length) {
                smallDeptOrder.splice(adjustedTargetIndex, 0, draggedItem);
            } else {
                smallDeptOrder.push(draggedItem);
            }
        }
        
        // 조직도 다시 생성
        generateOrganizationChart();
        showSuccessMessage('✅ 부서 순서가 변경되었습니다!');
    }
    
    return false;
}

function handleDragEnd(e) {
    // 모든 드래그 스타일 제거
    document.querySelectorAll('.department').forEach(dept => {
        dept.classList.remove('dragging', 'drag-over', 'can-combine', 'cannot-combine');
    });
}

// 합쳐진 부서 분리 함수
function separateCombinedDept(index) {
    const allDeptKeys = [...departmentOrder, ...smallDeptOrder];
    const deptKey = allDeptKeys[index];
    
    if (!deptKey || !deptKey.includes('+')) {
        return; // 합쳐진 부서가 아님
    }
    
    const [dept1Name, dept2Name] = deptKey.split('+');
    
    // 합쳐진 부서를 smallDeptOrder에서 제거
    const smallIndex = smallDeptOrder.indexOf(deptKey);
    if (smallIndex >= 0) {
        smallDeptOrder.splice(smallIndex, 1);
        
        // 개별 부서들을 다시 추가
        smallDeptOrder.splice(smallIndex, 0, dept1Name, dept2Name);
        
        generateOrganizationChart();
        showSuccessMessage('✅ 합쳐진 부서가 분리되었습니다!');
    }
}

// 부서 정렬 기능
function sortDepartments(type) {
    const organizedData = organizeDataByDepartment(organizationData);
    
    // 모든 부서 키 통합
    const allKeys = [...departmentOrder, ...smallDeptOrder];
    
    switch(type) {
        case 'name':
            // 합쳐진 부서를 분리하고 이름순으로 정렬
            const separated = [];
            allKeys.forEach(key => {
                if (key.includes('+')) {
                    const [dept1, dept2] = key.split('+');
                    separated.push(dept1, dept2);
                } else {
                    separated.push(key);
                }
            });
            const sortedByName = [...new Set(separated)].sort();
            departmentOrder = sortedByName;
            smallDeptOrder = [];
            break;
            
        case 'size':
            // 인원수순으로 정렬
            const separatedBySize = [];
            allKeys.forEach(key => {
                if (key.includes('+')) {
                    const [dept1, dept2] = key.split('+');
                    separatedBySize.push(dept1, dept2);
                } else {
                    separatedBySize.push(key);
                }
            });
            const uniqueBySize = [...new Set(separatedBySize)].sort((a, b) => {
                const getMemberCount = (deptKey) => {
                    return organizedData[deptKey] ? organizedData[deptKey].filter(m => m.position !== '교장' && m.position !== '교감').length : 0;
                };
                return getMemberCount(b) - getMemberCount(a);
            });
            departmentOrder = uniqueBySize;
            smallDeptOrder = [];
            break;
            
        case 'default':
        default:
            // 기본 순서로 리셋 (합쳐진 부서도 분리)
            departmentOrder = [];
            smallDeptOrder = [];
            break;
    }
    
    generateOrganizationChart();
    showSuccessMessage(`✅ ${type === 'name' ? '이름순' : type === 'size' ? '인원순' : '기본순서'}로 정렬되었습니다!`);
}

// UI 상태 관리 함수들
function updateGenerateButton() {
    const generateBtn = document.getElementById('generateBtn');
    if (organizationData.length > 0) {
        generateBtn.disabled = false;
        generateBtn.textContent = `🎨 조직도 생성하기 (${organizationData.length}명)`;
    } else {
        generateBtn.disabled = true;
        generateBtn.textContent = '🎨 조직도 생성하기';
    }
}

function showPreview() {
    document.getElementById('previewSection').style.display = 'block';
}

function hidePreview() {
    document.getElementById('previewSection').style.display = 'none';
}

function editMode() {
    hidePreview();
    document.querySelector('.input-method-section').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// 유틸리티 함수들
function showSuccessMessage(message) {
    // 토스트 메시지
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        font-weight: 600;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;
    
    // 애니메이션 스타일 추가
    if (!document.querySelector('#toast-animation')) {
        const style = document.createElement('style');
        style.id = 'toast-animation';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        if (toast && toast.parentNode) {
            toast.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 3000);
}

// 모달 관련 함수들
function showSampleForm() {
    document.getElementById('sampleFormModal').style.display = 'flex';
}

function closeSampleForm() {
    document.getElementById('sampleFormModal').style.display = 'none';
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('sampleFormModal');
    if (event.target === modal) {
        closeSampleForm();
    }
}

// 출력 관련 함수들
function printChart() {
    window.print();
}

function downloadPDF() {
    alert('💡 PDF 다운로드 방법:\n\n1. 아래 "인쇄하기" 버튼을 클릭하세요\n2. 프린터 선택에서 "PDF로 저장" 또는 "Microsoft Print to PDF"를 선택하세요\n3. 저장할 위치를 선택하고 저장하세요');
}