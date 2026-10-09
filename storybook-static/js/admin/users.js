// AG Grid 초기화
const gridOptions = {
    columnDefs: [
        { field: 'id', headerName: 'No.', sortable: true, width: 100 },
        { field: 'username', headerName: '사용자명', sortable: true },
        { field: 'createdAt', headerName: '생성일', sortable: true },
        { field: 'status', headerName: '상태', sortable: true },
        {
            headerName: '관리',
            cellRenderer: params => {
                return `
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editUser(${params.data.id})">수정</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${params.data.id})">삭제</button>
                `;
            }
        }
    ],
    defaultColDef: {
        flex: 1,
        minWidth: 100,
        resizable: true
    },
    pagination: true,
    paginationPageSize: 10,
    domLayout: 'autoHeight'
};

// 그리드 생성 및 데이터 로드
document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#myGrid');
    if (!gridDiv) {
        console.error('Grid container not found');
        return;
    }

    const grid = agGrid.createGrid(gridDiv, gridOptions);
    
    // 데이터 로드
    fetch('/api/users')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            grid.setGridOption('rowData', data);
        })
        .catch(error => {
            console.log('Error loading data:', error);
        });
});

// 사용자 관리 함수들
function addUser() {
    alert('사용자 추가 기능 구현 필요');
}

function editUser(id) {
    alert(`사용자 ${id} 수정 기능 구현 필요`);
}

function deleteUser(id) {
    alert(`사용자 ${id} 삭제 기능 구현 필요`);
} 