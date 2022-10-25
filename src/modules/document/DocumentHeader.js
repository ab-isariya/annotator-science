import isNil from 'lodash/isNil';
import produce from 'immer';
import {motion} from 'framer-motion';
import {DateTime} from 'luxon';

import Button from '@ui/Button';
import ButtonGroup from '@ui/ButtonGroup';
import FileTypeIcon from '@ui/FileTypeIcon';
import Title from '@ui/Title';
import Tooltip from '@ui/Tooltip';
import TooltipGroup from '@ui/TooltipGroup';
import {annotationQueryState} from '@document/data/useAnnotations';
import {
  documentViewState,
  documentExportTypeState
} from '@document/data/useDocument';
import {DocumentViewTypes, DocumentExportTypes} from '@utils/constants';
import {leftSidebarState} from '@document/LeftSidebar';
import {useDocument, ExportTable_Dropdown} from '@document';

import {ReactComponent as Table} from '@assets/svgs/Table.svg';
import {ReactComponent as Document} from '@assets/svgs/Document.svg';

const DocumentHeader = () => {
  const {data: document} = useDocument();
  const {currentView, agGridApi} = documentViewState.useValue();
  const exportType = documentExportTypeState.useValue();
  const {filter} = annotationQueryState.useValue();

  /**
   * Update the document view using constant values.
   *
   * @param {String} newView
   */
  const setView = (newView) => {
    if (newView === currentView) {
      return;
    }

    if (newView === DocumentViewTypes.TABLE) {
      leftSidebarState.set((prev) =>
        produce(prev, (updated) => {
          updated.documentInfo = null;
        })
      );
    }

    documentViewState.set((prev) =>
      produce(prev, (updated) => {
        updated.currentView = newView;
      })
    );
  };

  /**
   * Export type change callback used with Dropdown
   *
   * @param {String} value - comes from SOR
   */
  const onExportChange = ({value}) => {
    documentExportTypeState.set(DocumentExportTypes[value]);
  };

  /**
   * Exporting the file from our agGrid table in the format we need it in.
   */
  const exportData = () => {
    //If agGrid hasn't mounted, this shouldn't execute
    if (agGridApi !== null) {
      //Take the filename from the document and remove the file ending.
      const _filename = document.filename.substr(
        0,
        document.filename.lastIndexOf('.')
      );

      //Take the current dateformat and format it as YEAR_MONTH_DAY
      //With month and Day having 0's for padding when less than 10
      //so sorting is in natural order on export
      const downloadDate = DateTime.now().toFormat('yyyy_MM_d');

      switch (exportType) {
      case DocumentExportTypes.CSV: {
        //Export CSV File
        agGridApi.exportDataAsCsv({
          fileName: `${_filename}_${downloadDate}.csv`
        });
        break;
      }

      case DocumentExportTypes.TSV: {
        //Export TSV File
        agGridApi.exportDataAsCsv({
          columnSeparator: '\t',
          fileName: `${_filename}_${downloadDate}.tsv`
        });
        break;
      }

      case DocumentExportTypes.XLSX: {
        //Export Excel File
        agGridApi.exportDataAsExcel({
          fileName: `${_filename}_${downloadDate}.xlsx`
        });
        break;
      }
      }
    }
  };

  //Reset filters array and remove all spotlight filters.
  const resetAllFilters = () => {
    annotationQueryState.set((prev) =>
      produce(prev, (updated) => {
        updated.filter = [];
      })
    );
  };

  const SideButtonsVariant = {
    visible: {
      opacity: 1,
      x: 0
    },
    unmount: {
      opacity: 0,
      x: 32
    }
  };

  const isTableView = currentView === DocumentViewTypes.TABLE;

  return (
    <motion.div
      layout
      transition={{
        type: 'ease',
        duration: 0.4,
        layoutX: {duration: 0},
        layoutY: {duration: 0}
      }}
      className={`flex flex-row justify-between relative px-5 py-4 w-full bg-white border-b border-grey-200 border-solid  z-1 rounded-t-md m-auto ${
        isTableView ? '' : 'max-w-docView'
      }`}>
      <motion.div className={'flex flex-row items-center'}>
        {document && (
          <motion.div layout="position">
            <FileTypeIcon
              type={document.filetype}
              className="w-5 mr-3 text-grey-500"
            />
          </motion.div>
        )}
        <Title className="mr-5">
          {document ? (
            <Tooltip
              content={document.filename}
              followCursor={true}
              arrow={false}
              size="small">
              <motion.div layout="position">{document.filename}</motion.div>
            </Tooltip>
          ) : (
            'Loading Document...'
          )}
        </Title>
        <motion.div layout="position">
          <ButtonGroup>
            <TooltipGroup transition={true}>
              <Tooltip content="Document View" placement="top">
                <div
                  className={`p-3 flex items-center hover:bg-grey-50 border-r border-grey-500 cursor-pointer ${
                    !isTableView ? 'text-blue-500 bg-grey-50' : 'text-grey-500'
                  }`}
                  onClick={() => setView(DocumentViewTypes.DOCUMENT)}>
                  <Document />
                </div>
              </Tooltip>
              <Tooltip content="Table View" placement="top">
                <div
                  className={`p-3 flex items-center hover:bg-grey-50 text-grey-500 cursor-pointer ${
                    isTableView ? 'text-blue-500 bg-grey-50' : 'text-grey-500'
                  }`}
                  onClick={() => setView(DocumentViewTypes.TABLE)}>
                  <Table />
                </div>
              </Tooltip>
            </TooltipGroup>
          </ButtonGroup>
        </motion.div>
      </motion.div>
      <motion.div
        layout="position"
        variants={SideButtonsVariant}
        animate={isTableView ? 'visible' : 'unmount'}
        initial={isTableView ? 'visible' : 'unmount'}
        transition={{type: 'ease', duration: 0.32}}
        className="flex items-center">
        {filter.length > 0 && (
          <p
            className="underline font-inter text-sm cursor-pointer text-grey-500 inline-block mr-3"
            onClick={resetAllFilters}>
            Remove filters
          </p>
        )}
        <ExportTable_Dropdown onExportChange={onExportChange} />
        <Button primary disabled={isNil(agGridApi)} onClick={exportData}>
          Export
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default DocumentHeader;
