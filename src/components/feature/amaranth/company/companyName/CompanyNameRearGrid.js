import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { GridView, LocalDataProvider } from 'realgrid';
import { useForm } from 'react-hook-form';
//import './FundTypeSearch.css';

import {
  companyNameLayout,
  companyNamecolumns,
  companyNamefields,
} from './Realgrid-Data-CompanyName';
import './Paging.css';

const CompanyNameRearGrid = ({
  //   loadRowData,
  //   CASH_CD,
  //   LEVEL_CD,
  //   onChangeOpenPost,
  //   marsterGrid,
  //   setMarsterGrid,
  //   setSearchGrid,
  //   excelExport,
  //   excelImport,
  //   setMenuGrid,
  //   inputData,
  //   setreqCASH_CD,
  setCompanyNameGrid,
  onChangeOpenCompanyName,
  onCompleteCompanyName,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
    clearErrors,
    setValue,
    setError,
  } = useForm({
    mode: 'onChange',
  });
  const [dataProvider, setDataProvider] = useState(null);
  const [gridView, setGridView] = useState(null);
  const realgridElement = useRef(null);
  const [searchDetailLow, setSearchDetailLow] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const onChangeModalClose = () => {
    setModalOpen(false);
  };
  const ModalOpenButton = () => {
    setDetailModalOpen(!detailModalOpen);
  };

  // const loadRowData = CATEGORY => {
  //   return new Promise((resolve, reject) => {
  //     authAxiosInstance(
  //       'system/admin/groupManage/ChangeHistorySelect/' + CATEGORY
  //     )
  //       .then(response => {
  //         console.log('로드?', response.data);
  //         resolve(response.data);
  //       })
  //       .catch(error => {
  //         console.error(error);
  //         reject(error);
  //       });
  //   });
  // };

  useEffect(() => {
    // RealGrid 컨테이너 엘리먼트를 참조합니다.
    const container = realgridElement.current;

    // 데이터 프로바이더 및 그리드 뷰를 초기화합니다.
    const provider = new LocalDataProvider(true);
    const grid = new GridView(container);

    //타 컴포넌트에서도 서치 그리드를 참조(공유) 가능하게 전역 state변수 초기화
    setCompanyNameGrid(prveData => ({
      ...prveData,
      grid: grid,
      provider: provider,
    }));

    // 그리드에 데이터 소스를 설정합니다.
    grid.setDataSource(provider);

    // 필드 및 열 정의를 설정합니다.
    provider.setFields(companyNamefields);
    grid.setColumns(companyNamecolumns);

    // 그리드의 컬럼 레이아웃을 설정합니다.
    grid.setColumnLayout(companyNameLayout);

    //마운트 시 로드될 행 데이터 출력

    // loadRowData(CATEGORY)
    //   .then(loadData => {
    //     grid.closeProgress();
    //     provider.fillJsonData(loadData, { fillMode: 'set' });
    //     grid.setCurrent({
    //       itemIndex: 0,
    //       column: 'CASH_FG',
    //     });
    //     grid.setFocus();
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
    // provider.fillJsonData([{ company: 'd', bno: 'd', cno: 'o' }], {
    //   fillMode: 'set',
    // });

    // 컬럼 레이아웃에 있는 특정 클럼의 너비를 수정
    //grid.layoutByColumn('LEVEL_CD').cellWidth = 60;

    //헤더 컬럼 클릭시 컬럼값 별 정렬 기능 여부
    grid.setSortingOptions({ enabled: true });

    // 그리드의 상태 바를 숨깁니다.
    grid.setStateBar({ visible: false });

    // 그리드의 고정 옵션을 설정합니다.
    grid.setFixedOptions({ rowEditable: true });

    // 정렬 옵션을 비활성화합니다.
    grid.setSortingOptions({ enabled: false });

    //행 번호를 1부터 시작하게 설정합니다.
    grid.setRowIndicator({ zeroBase: false, visible: false });

    //그리드 체크바 비활성화
    grid.setCheckBar({ visible: false });

    //그리드 푸터 생성 비활성화
    grid.setFooter({ visible: false });

    //상위자금과목명 입력 비활성화
    // grid.columnByName('SUM_NM').editable = false;

    // 행 수정 데이터 기능 비활성화
    grid.setEditOptions({ editable: false });

    //페이징 처리
    grid.setPaging(true, 12);

    //(컬럼 너비) + (행 높이) 자동 조절 설정
    grid.setDisplayOptions({
      fitStyle: 'evenFill',
      rowHeight: 30,
      useFocusClass: true,
    });

    //헤더 높이 자동 조절 설정
    grid.setHeader({ height: 30 });

    grid.setContextMenu([
      {
        label: '엑셀 내보내기',
        tag: 'excelExport',
      },
      {
        label: '엑셀 가져오기',
        tag: 'excelImport',
      },
    ]);

    // // 그리드 내에서 컨텍스트 메뉴 항목이 클릭될 때 실행되는 함수를 정의합니다.
    // grid.onContextMenuItemClicked = function (grid, item, clickData) {
    //   //handleXlsFile; excelExport excelImport
    //   if (item.tag === 'excelExport') {
    //     excelExport(grid);
    //   } else if (item.tag === 'excelImport') {
    //     setMenuGrid(prveData => ({
    //       ...prveData,
    //       grid: grid,
    //     }));
    //     handleFileInputClick(grid);
    //   }
    // };
    // // 그리드 내에서 컨텍스트 메뉴 팝업이 열릴 때 실행되는 함수를 정의합니다.
    // grid.onContextMenuPopup = function (grid, x, y, elementName) {
    //   if (elementName.cellType === 'data') {
    //     // 데이터 셀에서 컨텍스트 메뉴 팝업을 엽니다.
    //     //setDataCellContextMenu(grid);
    //   } else {
    //     return false;
    //   }
    // };

    //특정 행의 자금종목코드 데이터 불러오기 기능
    grid.onCellDblClicked = function (grid, clickData) {
      console.log('더블클릭', clickData);
      const rowvalue = grid.getValues(grid.getCurrent().itemIndex);
      console.log(grid.getCurrent().itemIndex, rowvalue);

      onCompleteCompanyName(rowvalue);
      onChangeOpenCompanyName();
    };

    grid.onKeyDown = (grid, event) => {
      const rowvalue = grid.getValues(grid.getCurrent().itemIndex);
      if (event.key === 'Enter') {
        onCompleteCompanyName(rowvalue);
        onChangeOpenCompanyName();
      } else if (event.key === 'Escape') {
        onChangeOpenCompanyName();
      }
    };

    // 데이터 프로바이더와 그리드 뷰를 상태에 저장합니다.
    setDataProvider(provider);
    setGridView(grid);

    // 컴포넌트가 언마운트될 때 정리 작업을 수행합니다.
    return () => {
      provider.clearRows();
      grid.destroy();
      provider.destroy();
    };
  }, []); // useEffect는 한 번만 실행되도록 빈 배열을 의존성으로 설정합니다.

  return (
    <>
      <div ref={realgridElement} className="companyNameView"></div>
    </>
  );
};

export default CompanyNameRearGrid;
