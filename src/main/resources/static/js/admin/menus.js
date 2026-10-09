// 전역 변수
    let gridApi;

    // 그리드 옵션 설정
    const gridOptions = {
        theme: 'legacy',
        columnDefs: [
            { 
                headerCheckboxSelection: true, // 헤더에 체크박스 추가
                checkboxSelection: true,       // 각 행에 체크박스 추가
                width: 50                      // 체크박스 열의 너비 설정
            },
            { field: 'id', headerName: '메뉴ID', sortable: true, editable: isCellEditable, align: 'center' },
            { field: 'name', headerName: '메뉴명', sortable: true, editable: true },
            { field: 'url', headerName: 'URL', sortable: true, editable: true },
            { field: 'parentId', headerName: '상위메뉴ID', sortable: true, editable: true, align: 'center' },
            { field: 'depth', headerName: '메뉴레벨', sortable: true, editable: true, align: 'center' },
            { field: 'useYn', headerName: '사용여부', sortable: true, editable: true, align: 'center',
              cellEditor: 'agSelectCellEditor',
              cellEditorParams: {
                  values: ['Y', 'N']
              }
            },
            { field: 'createdBy', headerName: '생성자', sortable: true, editable: false },
            { field: 'createdDate', headerName: '생성일', sortable: true, editable: false,
              valueFormatter: params => {
                  if (params.value) {
                      return new Date(params.value).toLocaleString();
                  }
                  return '';
              }
            },
            { field: 'modifiedBy', headerName: '수정자', sortable: true, editable: false },
            { field: 'modifiedDate', headerName: '수정일', sortable: true, editable: false,
              valueFormatter: params => {
                  if (params.value) {
                      return new Date(params.value).toLocaleString();
                  }
                  return '';
              }
            },
        ],
        defaultColDef: {
            flex: 1,
            minWidth: 100,
            resizable: true
        },
        rowSelection: 'multiple', // 다중 선택 가능
        pagination: true,
        paginationPageSize: 10,
        domLayout: 'autoHeight',
        editType: 'fullRow',
        onCellValueChanged: params => {
            if (params.data.state !== 'create') {
                params.data.state = 'update';
            }
        }
    };

    // 문서 로드 완료 시 실행
    $(document).ready(function() {
        // 이미 초기화되었는지 확인
        if (!gridApi) {
            // 그리드 초기화
            const gridDiv = document.querySelector('#menuGrid');
            gridApi = agGrid.createGrid(gridDiv, gridOptions);
            
            // 초기 데이터 로드
            searchMenus();
            
            // 메뉴 추가 버튼 이벤트 바인딩
            $('#addMenuBtn').on('click', addMenu);
            
            // 저장 버튼 이벤트 바인딩
            $('#saveMenuBtn').on('click', saveMenuData);
        }
    });


// 메뉴 데이터 로드
function searchMenus() {
    axios.get('/menus/api/search',
        {
            params: {
                name: $('#name').val() ? $('#name').val() : '',
                id: $('#id').val() ? $('#id').val() : ''
            }
        }
    )
        .then(response => {
            console.log('Data received:', response.data);
            // 기존 데이터에 status 필드 추가
            const rowData = response.data.map(item => ({
                ...item,
                status: 'none'  // 초기 상태는 none
            }));
            gridApi.setGridOption('rowData', rowData);
        })
        .catch(error => {
            console.error('Data loading failed:', error);
        });
}

// 특정 조건에 따라 editable 설정
function isCellEditable(params) {
    return params.data?.state === 'create';
}


// 메뉴 추가
function addMenu() {
    const newRow = {
        id: '',
        name: '',
        url: '',
        parentId: '',
        depth: '',
        useYn: 'Y',
        state: 'create'  // 새로운 행 추가 시 create 상태 설정
    };

    gridApi.applyTransaction({
        add: [newRow],
        addIndex: 0
    });
    
    gridApi.startEditingCell({
        rowIndex: 0,
        colKey: 'id'
    });
    
}

// 메뉴 데이터 저장
function saveMenuData() {
    // 편집 모드 종료
    gridApi.stopEditing();

    // 그리드의 모든 행을 가져옴
    const rowData = [];
    gridApi.forEachNode(node => {
        if (node.data.state === 'create' || node.data.state === 'update') {
            rowData.push(node.data);
        }
    });

    if (rowData.length === 0) {
        alert('저장할 데이터가 없습니다.');
        return;
    }

    // 수정된 데이터가 있는 경우 기존 저장 로직 실행

    // 이후 저장 로직...
    if (confirm('저장하시겠습니까?')) {
        axios.post('/menus/api/save', rowData)
        .then(response => {
            console.log('저장 성공:', response);
            alert('메뉴 저장 성공');
            searchMenus(); // 저장 후 다시 로드
        })
        .catch(error => {
            console.error('저장 실패:', error.response?.data || error);
            alert('메뉴 저장 중 오류가 발생했습니다.');
            searchMenus(); // 저장 후 다시 로드
        });
    }
    
}

$('#searchBtn').on('click', searchMenus);
$('#deleteMenuBtn').on('click', deleteMenu);

function deleteMenu() {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
        alert('삭제할 데이터를 선택해주세요.');
        return;
    }
    if (confirm('삭제하시겠습니까?')) {
        // Remove rows in 'create' state
        const rowsToRemove = [];
        gridApi.forEachNode(node => {
            if (node.data.state === 'create') {
                rowsToRemove.push(node.data);
            }
        });

        if (rowsToRemove.length > 0) {
            gridApi.applyTransaction({ remove: rowsToRemove });
        }

        // Proceed with deletion of selected rows
        axios.post('/menus/api/delete', selectedRows)
            .then(response => {
                alert('삭제 성공');
                searchMenus(); // 삭제 후 다시 로드
            })
            .catch(error => {
                console.error('삭제 실패:', error.response?.data || error);
                alert('삭제 중 오류가 발생했습니다.');
                searchMenus(); // 삭제 후 다시 로드
            });
    }
}
