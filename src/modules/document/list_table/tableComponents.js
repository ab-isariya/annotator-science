import PropTypes from 'prop-types';

import produce from 'immer';
import {Link, useHistory} from 'react-router-dom';

import DateTime from 'luxon/src/datetime';
import isNil from 'lodash/isNil';
import {PieChart} from 'react-minimal-pie-chart';

import Button from '@ui/Button';
import FileTypeIcon from '@ui/FileTypeIcon';
import Stack from '@ui/Stack';
import UserIcon from '@ui/UserIcon';
import Tooltip from '@ui/Tooltip';
import {NumberCommaSuffix, datetimeToHuman, round} from '@utils/transformers';
import {documentViewState} from '@document';
import {
  ProcessingState,
  annotationStatusColors,
  DocumentViewTypes
} from '@utils/constants';

import {ReactComponent as Table} from '@assets/svgs/Table.svg';
import {ReactComponent as Delete} from '@assets/svgs/TrashCan.svg';
import {ReactComponent as Close} from '@assets/svgs/Close.svg';
import {ReactComponent as RectangleStroke} from '@assets/svgs/IconBorder-46.svg';

import Processing from '@assets/gif/Processing.gif';

/**
 * Renderer for file name column
 */
const FilenameCellRenderer = (props) => {
  const state = props.data.processing_state;

  const fileComponent = (
    <div className="flex items-center space-x-2.5 font-light">
      <Stack>
        <RectangleStroke className="text-grey-200" />
        <FileTypeIcon
          type={props.data.filetype}
          className={state === ProcessingState.PROCESSED ? 'text-grey-500' : ''}
        />
      </Stack>
      <div className="text-base leading-6">{props.value}</div>
    </div>
  );

  if (state === ProcessingState.PROCESSED) {
    return <Link to={`/document/${props.data.id}`}>{fileComponent}</Link>;
  } else {
    return (
      <div className="cursor-not-allowed text-grey-300">{fileComponent}</div>
    );
  }
};

FilenameCellRenderer.propTypes = {
  //NOTE(Rejon): Date comes from AgGridReact "rowData" for row being displayed.
  data: PropTypes.object,
  value: PropTypes.any
};

/**
 * Renderer for date modified column
 */
const DatetimeCellRenderer = (props) => {
  return (
    <div className="font-light text-base leading-6">
      {datetimeToHuman(props.value, DateTime.DATE_MED)}
      <p className="text-grey-500 text-xs">
        {datetimeToHuman(props.value, DateTime.TIME_SIMPLE)}
      </p>
    </div>
  );
};

DatetimeCellRenderer.propTypes = {
  //NOTE(Rejon): Value comes from AgGridColumn pulling out value for field provided for this column.
  value: PropTypes.string
};

/**
 * Renderer for owner column
 */
const OwnerCellRenderer = (props) => (
  <UserIcon>
    <div className="capitalize text-grey-500 text-xs">
      Uploaded&nbsp;
      {datetimeToHuman(props.data.datetime_created, DateTime.DATE_MED)}
    </div>
  </UserIcon>
);

OwnerCellRenderer.propTypes = {
  //NOTE(Rejon): Date comes from AgGridReact "rowData" for row being displayed.
  data: PropTypes.object
};

/**
 * Renderer for status column
 */
const StatusCellRenderer = (props) => {
  if (isNil(props.data.aggregations)) {
    return null; //TODO(Rejon): Good place for skeleton loading or a spinner.
  }

  const state = props.value;

  if (state === ProcessingState.PROCESSING) {
    return (
      <div className="flex space-x-2.5 items-center">
        <div className="max-w-icon48">
          <img src={Processing} alt="Processing gif" />
        </div>
        <div>
          <p className="font-light text-base">{state}</p>
          <p className="whitespace-normal text-grey-500 font-normal text-xs">
            This may take a few minutes.
          </p>
        </div>
      </div>
    );
  } else if (state === ProcessingState.FAILED) {
    return (
      <div className="flex space-x-2.5 items-center">
        <div className="p-4 rounded-full border-red-600 border">
          <Close className="transform scale-110 text-red-600" />
        </div>
        <div>
          <p className="font-light text-base">ERROR</p>
          <p className="whitespace-normal text-grey-500 font-normal text-xs">
            Delete file and reupload
          </p>
        </div>
      </div>
    );
  } else if (state === ProcessingState.PROCESSED) {
    const progress = props.data.aggregations.progress;
    const annotationsCount = progress.total;

    //NOTE(Rejon): Can't always predict position, find it.
    const posOfNotReviewed = progress.status.indexOf('NOT_REVIEWED');
    // All annotations but unreviewed
    const completedAnnNumber =
      annotationsCount - progress.count[posOfNotReviewed];

    const meterValues = progress.status.map((item, index) => {
      return {
        value: round((100 * progress.count[index]) / annotationsCount, 2),
        color: annotationStatusColors[item]
      };
    });

    return (
      <div className="flex space-x-2.5 items-center font-inter font-light">
        <Tooltip
          placement="bottom"
          content={`${Math.round(
            (100 * completedAnnNumber) / annotationsCount
          )}% of annotations have been reviewed`}>
          <Stack>
            <PieChart
              data={meterValues}
              lineWidth={25}
              className="max-w-icon48" // Icons size
            />
            <div className="font-xs leading-4">
              {Math.round((100 * completedAnnNumber) / annotationsCount)}%
            </div>
          </Stack>
        </Tooltip>
        <div className="">
          <p className="font-light text-base">
            {NumberCommaSuffix(progress.count[posOfNotReviewed], 3)}
          </p>
          <p className="font-normal text-xs text-grey-500">To Review</p>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

StatusCellRenderer.propTypes = {
  //NOTE(Rejon): Data comes from AgGridReact "rowData" for row being displayed.
  data: PropTypes.object.isRequired,
  value: PropTypes.any
};

const AnnotationCountRenderer = ({value, data}) => {
  const status = data.processing_state;

  return (
    <>
      <div className="font-light text-base">
        {status === ProcessingState.PROCESSED ? (
          <>{NumberCommaSuffix(value, 3)}</>
        ) : (
          '-'
        )}
      </div>
      <div className="ffont-normal text-xs text-grey-500">Total</div>
    </>
  );
};

AnnotationCountRenderer.propTypes = {
  //NOTE(Rejon): Date comes from AgGridReact "rowData" for row being displayed.
  value: PropTypes.number,
  //NOTE(Rejon): Data comes from AgGridReact "rowData" for row being displayed.
  data: PropTypes.object.isRequired
};

/**
 * Renderer for actions (last unnamed) column
 */
const ActionsCellRenderer = ({data, setOpenModal, setDocId}) => {
  let history = useHistory();

  const id = data.id;
  const state = data.processing_state;

  //Disable Export action if Processing or Failed state
  const exportIsDisabled =
    state === ProcessingState.PROCESSING || state === ProcessingState.FAILED;

  //Disable delete is file is currently processing
  const deleteIsDisabled = state === ProcessingState.PROCESSING;

  /**
   * Open's document page on the table view.
   *
   */
  const openDocumentTable = () => {
    documentViewState.set((prev) =>
      produce(prev, (updated) => {
        updated.currentView = DocumentViewTypes.TABLE;
      })
    );
    history.push(`/document/${data.id}`);
  };

  return (
    <div className="flex space-x-1.5">
      <Tooltip content="Table View" placement="bottom">
        <Button
          tertiary
          icon
          disabled={exportIsDisabled}
          className={`text-grey-500 ${exportIsDisabled && 'opacity-50'}`}
          onClick={openDocumentTable}>
          <Table />
        </Button>
      </Tooltip>
      <Button
        tertiary
        icon
        disabled={deleteIsDisabled}
        onClick={() => {
          // Open modal
          setOpenModal(true);
          // Set documentId to delete for parent modal to see
          setDocId(id);
        }}>
        <Delete />
      </Button>
    </div>
  );
};

ActionsCellRenderer.displayName = 'ActionsCellRenderer';

ActionsCellRenderer.propTypes = {
  //NOTE(Rejon): Date comes from AgGridReact "rowData" for row being displayed.
  data: PropTypes.object.isRequired,
  //function for opening a modal when an action is triggered
  setOpenModal: PropTypes.func.isRequired,
  //setDocId state coming from index.js for the table component
  setDocId: PropTypes.func.isRequired
};

export {
  ActionsCellRenderer,
  AnnotationCountRenderer,
  DatetimeCellRenderer,
  FilenameCellRenderer,
  OwnerCellRenderer,
  StatusCellRenderer
};
