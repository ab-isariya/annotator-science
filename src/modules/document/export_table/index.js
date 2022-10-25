import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import produce from 'immer';

import TypeStyles from '@styles/TypeStyles';
import {annotationQueryState} from '@document/data/useAnnotations';
import {
  annotationTypes,
  AnnotationStatus,
  annotationStatusColors
} from '@utils/constants';
import {
  ConceptCell,
  HighlightedTextCell,
  TypeCell,
  IdentifierCell,
  StatusCell
} from './tableComponents';
import {useAnnotations, useDocument} from '@document/';
import {documentViewState} from '@document/data/useDocument';
import {statusComparator} from './sortFunctions';

import SortUnsorted from '@svgs/Sort_Unsorted.svg';

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
// When personalizing theme, remember to change the name in the div class too
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import './customTheme.css';
import {isNil} from 'lodash';

const ExportAnnotations_Table = () => {
  const {data: _document} = useDocument();
  const {data: annotations} = useAnnotations();
  const {filter} = annotationQueryState.useValue();

  /**
   * Init for grid
   *
   * @param params
   */
  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
    params.api.hidePopupMenu();

    documentViewState.set((prev) =>
      produce(prev, (updated) => {
        updated.agGridApi = params.api;
      })
    );
  };

  /** Common settings for all columns in grid */
  const colsSettings = {
    cellClass: ['flex', 'items-center'],
    menuTabs: ['filterMenuTab', 'generalMenuTab'],
    resizable: true
  };

  //See this: https://www.ag-grid.com/react-grid/excel-export-styles/ for
  //how to manage/create excel cell styles.
  const excelStyles = [
    {
      id: 'anatomy_physiology',
      font: {color: TypeStyles[annotationTypes.ANATOMY]['hexTextColor']}
    },
    {
      id: 'cell_biology',
      font: {color: TypeStyles[annotationTypes.CELLBIOLOGY]['hexTextColor']}
    },
    {
      id: 'chemicals_drugs',
      font: {color: TypeStyles[annotationTypes.CHEMICALS]['hexTextColor']}
    },
    {
      id: 'medical_devices',
      font: {color: TypeStyles[annotationTypes.DEVICES]['hexTextColor']}
    },
    {
      id: 'medical_conditions',
      font: {color: TypeStyles[annotationTypes.CONDITIONS]['hexTextColor']}
    },
    {
      id: 'genetics',
      font: {color: TypeStyles[annotationTypes.GENETICS]['hexTextColor']}
    },
    {
      id: 'procedures',
      font: {color: TypeStyles[annotationTypes.PROCEDURES]['hexTextColor']}
    },
    {
      id: 'viruses',
      font: {color: TypeStyles[annotationTypes.VIRUSES]['hexTextColor']}
    },
    {
      id: 'context',
      font: {color: TypeStyles[annotationTypes.CONTEXT]['hexTextColor']}
    },
    {
      id: 'unassigned',
      font: {color: TypeStyles[annotationTypes.UNASSIGNED]['hexTextColor']}
    },
    {
      id: AnnotationStatus.ACCEPTED,
      font: {color: annotationStatusColors[AnnotationStatus.ACCEPTED]}
    },
    {
      id: AnnotationStatus.REJECTED,
      font: {color: annotationStatusColors[AnnotationStatus.REJECTED]}
    },
    {
      id: AnnotationStatus.NOT_REVIEWED,
      font: {color: annotationStatusColors[AnnotationStatus.NOT_REVIEWED]}
    },
    {
      id: AnnotationStatus.MANUAL,
      font: {color: annotationStatusColors[AnnotationStatus.MANUAL]}
    },
    {
      id: 'boldText',
      font: {bold: true}
    }
  ];

  //NOTE(Rejon): I replace "&" and spaces with "_" since these are class names applied to an excel file.
  //Rules for which cellClass to render for type tags.
  const tagCellClassRules = {
    anatomy_physiology: (params) => params.value === annotationTypes.ANATOMY,
    cell_biology: (params) => params.value === annotationTypes.CELLBIOLOGY,
    chemicals_drugs: (params) => params.value === annotationTypes.CHEMICALS,
    medical_devices: (params) => params.value === annotationTypes.DEVICES,
    medical_conditions: (params) => params.value === annotationTypes.CONDITIONS,
    genetics: (params) => params.value === annotationTypes.GENETICS,
    procedures: (params) => params.value === annotationTypes.PROCEDURES,
    viruses: (params) => params.value === annotationTypes.VIRUSES,
    context: (params) => params.value === annotationTypes.CONTEXT,
    unassigned: (params) => params.value === annotationTypes.UNASSIGNED
  };

  //Rules for which cellClass to render for statuses.
  const statusCellClassRules = {
    ACCEPTED: (params) => params.value === AnnotationStatus.ACCEPTED,
    NOT_REVIEWED: (params) => params.value === AnnotationStatus.NOT_REVIEWED,
    REJECTED: (params) => params.value === AnnotationStatus.REJECTED,
    MANUAL: (params) => params.value === AnnotationStatus.MANUAL
  };

  const onGridSizeChanged = (params) => {
    var gridWrapper = document.getElementById('grid-wrapper');

    if (isNil(gridWrapper)) {
      return;
    }

    var gridWidth = gridWrapper.offsetWidth;
    var columnsToShow = [];
    var columnsToHide = [];
    var totalColsWidth = 0;
    var allColumns = params.columnApi.getAllColumns();
    for (var i = 0; i < allColumns.length; i++) {
      var column = allColumns[i];
      totalColsWidth += column.getMinWidth();
      if (totalColsWidth > gridWidth) {
        columnsToHide.push(column.colId);
      } else {
        columnsToShow.push(column.colId);
      }
    }
    params.columnApi.setColumnsVisible(columnsToShow, true);
    params.columnApi.setColumnsVisible(columnsToHide, false);
    params.api.sizeColumnsToFit();
  };

  function iconText() {
    return `<img class="ml-1" style="width: 10px" src="${SortUnsorted}"/>`;
  }

  return (
    <div
      className="w-full h-full flex flex-col py-5 px-9"
      style={{maxHeight: 'calc(100vh - 75px)'}}>
      {/* TODO(Rejon): Put "Exporting X Annotations" */}

      {annotations && (
        <div id="grid-wrapper" className="">
          {
            <div
              className={'ag-theme-material w-full relative'}
              style={{height: 'calc(100vh - 75px - 3rem)'}}>
              <p
                className="absolute left-0 z-1 font-inter text-base text-grey-500 font-light"
                style={{top: '17px'}}>
                Exporting{' '}
                {filter.length > 0 && (
                  <>
                    <span className="font-bold">{annotations.length}</span> of
                  </>
                )}{' '}
                <span className="font-bold">
                  {_document.annotations.length}
                </span>{' '}
                Concept{_document.annotations.length !== 1 && <span>s</span>}
              </p>
              <AgGridReact
                rowData={annotations}
                rowHeight={40}
                headerHeight={40}
                icons={{
                  sortUnSort: iconText
                }}
                excelStyles={excelStyles}
                domLayout="normal"
                onGridSizeChanged={onGridSizeChanged}
                frameworkComponents={{
                  customNoRowsOverlay: () => <></>
                }}
                noRowsOverlayComponent={'customNoRowsOverlay'}
                pagination={true}
                suppressContextMenu={true}
                onGridReady={onGridReady}
                paginationPageSize={50}>
                <AgGridColumn
                  field="canonical_name"
                  headerName="Concept"
                  suppressMenu={true}
                  sortable={true}
                  unSortIcon={true}
                  wrapText={true}
                  cellClassRules={{
                    boldText: () => true
                  }}
                  cellRendererFramework={ConceptCell}
                  filter="agTextColumnFilter"
                  {...colsSettings}
                />
                <AgGridColumn
                  field="text"
                  headerName="Highlighted Text"
                  wrapText={true}
                  suppressMenu={true}
                  sortable={true}
                  unSortIcon={true}
                  cellRendererFramework={HighlightedTextCell}
                  filter="agTextColumnFilter"
                  {...colsSettings}
                />
                <AgGridColumn
                  filter="agTextColumnFilter"
                  field="tag"
                  cellClassRules={tagCellClassRules}
                  suppressMenu={true}
                  sortable={true}
                  unSortIcon={true}
                  headerName="Type"
                  cellRendererFramework={TypeCell}
                  {...colsSettings}
                />
                <AgGridColumn
                  field="canonical_id"
                  headerName="Identifier"
                  suppressMenu={true}
                  cellRendererFramework={IdentifierCell}
                  sortable={true}
                  unSortIcon={true}
                  filter="agTextColumnFilter"
                  {...colsSettings}
                />
                <AgGridColumn
                  field="status"
                  filter="agTextColumnFilter"
                  suppressMenu={true}
                  headerName="Status"
                  cellClassRules={statusCellClassRules}
                  sortable={true}
                  unSortIcon={true}
                  cellRendererFramework={StatusCell}
                  comparator={statusComparator}
                  {...colsSettings}
                />
              </AgGridReact>
            </div>
          }
        </div>
      )}
    </div>
  );
};

export default ExportAnnotations_Table;
