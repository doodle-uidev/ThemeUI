// Enterprise License 필요... 
// import { themeQuartz, iconSetQuartzBold } from 'ag-grid-community';

// const myTheme = themeQuartz
// 	.withPart(iconSetQuartzBold)
// 	.withParams({
//         accentColor: "#1D4ED8",
//         borderColor: "#5B6A8426",
//         borderRadius: 0,
//         browserColorScheme: "light",
//         cellTextColor: "#20212B",
//         fontFamily: {
//             googleFont: "Inter"
//         },
//         fontSize: 14,
//         headerFontSize: 14,
//         headerVerticalPaddingScale: 0.8,
//         oddRowBackgroundColor: "#EFF5FB",
//         rowVerticalPaddingScale: 0.8,
//         spacing: 8,
//         wrapperBorderRadius: 6
//     });

let gridApi;

const gridOptions = {
  // theme: myTheme,
  columnDefs: [
    { field: "country", width: 150, chartDataType: "category" },
    { field: "gold", chartDataType: "series", sort: "desc" },
    { field: "silver", chartDataType: "series", sort: "desc" },
    { field: "bronze", chartDataType: "series" },
  ],
  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  cellSelection: true,
  enableCharts: true,
  popupParent: document.body,
  onGridReady: (params) => {
    getData().then((rowData) => params.api.setGridOption("rowData", rowData));
  },
 
};

function onChart1() {
  gridApi2.createRangeChart({
    cellRange: {
      rowStartIndex: 0,
      rowEndIndex: 4,
      columns: ["country", "gold", "silver"],
    },
    chartType: "groupedColumn",
    chartThemeOverrides: {
      common: {
        title: {
          enabled: true,
          text: "Top 5 Medal Winners",
        },
      },
    },
  });
}

function onChart2() {
  gridApi2.createRangeChart({
    cellRange: {
      columns: ["country", "bronze"],
    },
    chartType: "groupedBar",
    chartThemeOverrides: {
      common: {
        title: {
          enabled: true,
          text: "Bronze Medal by Country",
        },
      },
    },
    unlinkChart: true,
  });
}

// 그리드 초기화 함수
function initializeGrid() {
    const gridDiv = document.querySelector("#myGrid");
    if (gridDiv) {
        gridApi = agGrid.createGrid(gridDiv, gridOptions);
    }
}

// 페이지 로드 시 myGrid가 있는 경우에만 그리드 초기화
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  if (!gridDiv) {
    console.warn('Grid container not found');
    return;
  }
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
