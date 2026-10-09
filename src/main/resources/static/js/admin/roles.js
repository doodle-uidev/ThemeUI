// 전역 변수
let roleGridApi;
let permissionGridApi;

// 역할 그리드 옵션
const roleGridOptions = {
    columnDefs: [
        { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
        { field: 'roleId', headerName: '역할 ID' },
        { field: 'roleName', headerName: '역할명' },
        { field: 'description', headerName: '설명' },
        { field: 'useYn', headerName: '사용여부' }
    ],
    defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true
    },
    rowSelection: 'multiple',
    onSelectionChanged: onRoleSelectionChanged
};

// 권한 그리드 옵션
const permissionGridOptions = {
    columnDefs: [
        { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
        { field: 'permissionId', headerName: '권한 ID' },
        { field: 'permissionName', headerName: '권한명' },
        { field: 'description', headerName: '설명' },
        { field: 'useYn', headerName: '사용여부' }
    ],
    defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true
    },
    rowSelection: 'multiple'
};

// 역할 선택 시 이벤트
function onRoleSelectionChanged() {
    const selectedRows = roleGridApi.getSelectedRows();
    if (selectedRows.length === 1) {
        loadPermissions(selectedRows[0].roleId);
    }
}

// 권한 목록 로드
function loadPermissions(roleId) {
    axios.get(`/roles/api/search`, {
        params: {
            roleId: roleId
        }
    })
        .then(response => {
            permissionGridApi.setRowData(response.data);
        })
        .catch(error => {
            console.error('Failed to load permissions:', error);
        });
}

// 문서 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', () => {
    // 역할 그리드 초기화
    const roleGridDiv = document.querySelector('#roleGrid');
    roleGridApi = agGrid.createGrid(roleGridDiv, roleGridOptions);

    // 권한 그리드 초기화
    const permissionGridDiv = document.querySelector('#permissionGrid');
    permissionGridApi = agGrid.createGrid(permissionGridDiv, permissionGridOptions);

    // 초기 데이터 로드
    searchRoles();
});

// 역할 검색
function searchRoles() {
    const roleId = document.getElementById('roleId').value;
    const roleName = document.getElementById('roleName').value;

    axios.get('/api/roles/search', {
        params: {
            roleId: roleId,
            roleName: roleName
        }
    })
    .then(response => {
        roleGridApi.setRowData(response.data);
    })
    .catch(error => {
        console.error('Failed to search roles:', error);
    });
}

// 이벤트 리스너 등록
document.getElementById('searchBtn').addEventListener('click', searchRoles);
document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('roleId').value = '';
    document.getElementById('roleName').value = '';
    searchRoles();
});
