import {useState} from 'react';

import isUndefined from 'lodash/isUndefined';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import {toast} from 'react-toastify';

import Alert from '@modules/ui/Alert';
import Button from '@modules/ui/Button';
import FilesDropZone from '@modules/ui/FilesDropzone';
import Modal from '@modules/ui/Modal';
import Stack from '@modules/ui/Stack';
import Title from '@modules/ui/Title';
import {deleteDocument, uploadDocument} from '../api';
import {statusComparator} from './sortFunctions';
import {useAllDocuments} from '@document';
import {useUser} from '@user';
import {
  ActionsCellRenderer,
  AnnotationCountRenderer,
  DatetimeCellRenderer,
  FilenameCellRenderer,
  OwnerCellRenderer,
  StatusCellRenderer
} from './tableComponents';

import {blackToRed500, blackToWhite, toBlack} from '@utils/colorsFilters';
import {ReactComponent as Delete} from '@assets/svgs/TrashCan.svg';
import {ReactComponent as RectangleStroke} from '@assets/svgs/IconBorder-46.svg';
import {ReactComponent as UploadIcon} from '@assets/svgs/Upload_Icon.svg';

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
// When personalizing theme, remember to change the name in the div class too
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import './customTheme.css';

const DocumentsView = () => {
  const {data: user, mutate: mutateUser} = useUser();

  // data should not be undefined but empty
  const {data: files, mutate: mutateView} = useAllDocuments();

  // If user is dragging files to page
  const [dragging, setDragging] = useState(false);

  const [openDeleteModal, setOpenModal] = useState(false);

  const [docId, setDocId] = useState(null);

  /**
   * Delete files
   *
   * @param {String} docId
   * @return {Promise<void>}
   */
  const deleteDoc = async (docId) => {
    // Close modal
    setOpenModal(false);

    // Announce it to user
    // Filter makes non black icon color black and then white
    toast.info(
      <Alert icon={<Delete style={{filter: `${toBlack} ${blackToWhite}`}} />}>
        File Deleted
      </Alert>,
      {autoClose: false}
    );

    // Remove file from array
    const newFileArray = files.filter((item) => item.id !== docId);

    //Optimistically update UI immediately
    mutateView(newFileArray, null, false);

    // Delete file
    await deleteDocument(docId, user.id, user.accessToken);

    // Revalidate user cache to retrieve updated used storage
    mutateUser();

    //Update our UI with new actual data, revalidate on endpoint.
    mutateView();
  };

  /**
   * fires when a dragged item enters a valid drop target
   *
   * @param {Object} e - event
   */
  const handleDragEnter = (e) => {
    if (!dragging) {
      setDragging(true);
    }
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * fires when a dragged item leaves a valid drop target
   *
   * @param {Object} e - event
   */
  const handleDragLeave = (e) => {
    if (dragging) {
      setDragging(false);
    }
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * Init for grid
   *
   * @param params
   */
  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  /**
   * Uploads files dropped in dropzone  to backend
   *
   * @param {Array} acceptedFiles
   * @return {Promise<void>}
   */
  const onFileDrop = async (acceptedFiles) => {
    const preFlightView = [...files];
    const nowISOTime = new Date().toISOString().slice(0, -1); //NOTE(Rejon): Drop the Z!

    const preFlightFile = {
      filename: acceptedFiles[0].name,
      filetype: acceptedFiles[0].name.split('.').pop(),
      id: `preflight-${files.length}`,
      datetime_modified: nowISOTime,
      datetime_created: nowISOTime,
      preFlight: true
    };

    //Optimistically update UI immediately
    mutateView([...preFlightView, preFlightFile], null, false);

    setDragging(false);

    const upload = await uploadDocument(acceptedFiles, user.id, user.accessToken);

    // Announce it to user
    // Filter takes our non black icon to black and then to white
    toast.info(
      <Alert icon={<UploadIcon style={{filter: `${blackToWhite}`}} />}>
        Uploading {acceptedFiles.length}{' '}
        {acceptedFiles.length === 1 ? 'Document' : 'Documents'}
      </Alert>,
      {autoClose: false}
    );

    //Update our UI with new actual data, revalidate on endpoint.
    mutateView([...files, upload]);
  };

  /** Common settings for all columns in grid */
  const colsSettings = {
    cellClass: ['flex', 'items-center'],
    menuTabs: ['filterMenuTab', 'generalMenuTab'],
    resizable: true,
    sortable: true
  };

  return (
    <div className="min-h-screen w-full h-full flex flex-col py-5 px-9">
      {/* Tailwind doesn't set font size for hN*/}
      <Title className="mb-5">
        My Files{' '}
        {!isUndefined(files) && (
          <span className="text-grey-500">({files.length})</span>
        )}
      </Title>

      {!isUndefined(files) && (
        <div
          className="flex-1 flex flex-col items-stretch justify-items-stretch w-full h-full"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}>
          {
            <div
              className={`my-files ag-theme-material w-full h-full ${
                files.length === 0 ? 'ag-empty' : ''
              }`}>
              <AgGridReact
                rowData={files}
                domLayout="autoHeight"
                rowHeight={80}
                frameworkComponents={{
                  customNoRowsOverlay: () => <></>
                }}
                noRowsOverlayComponent={'customNoRowsOverlay'}
                // Always shows hamburger menu
                suppressMenuHide={true}
                pagination={true}
                onGridReady={onGridReady}
                paginationPageSize={8}>
                <AgGridColumn
                  field="filename"
                  headerName="File Name"
                  cellRendererFramework={FilenameCellRenderer}
                  filter="agTextColumnFilter"
                  {...colsSettings}
                />
                <AgGridColumn
                  field="datetime_modified"
                  headerName="Date Modified"
                  cellRendererFramework={DatetimeCellRenderer}
                  filter="agDateColumnFilter"
                  sort="desc"
                  {...colsSettings}
                />
                <AgGridColumn
                  filter="agTextColumnFilter"
                  headerName="Owner"
                  cellRendererFramework={OwnerCellRenderer}
                  {...colsSettings}
                />
                <AgGridColumn
                  field="aggregations.progress.total"
                  headerName="Annotation Count"
                  cellRendererFramework={AnnotationCountRenderer}
                  filter="agNumberColumnFilter"
                  {...colsSettings}
                />
                <AgGridColumn
                  field="processing_state"
                  filter="agTextColumnFilter"
                  headerName="Status"
                  cellRendererFramework={StatusCellRenderer}
                  comparator={statusComparator}
                  {...colsSettings}
                />
                <AgGridColumn
                  headerName=" "
                  menuTabs={[]}
                  cellClass={['flex', 'items-center', 'justify-end']}
                  cellRendererFramework={ActionsCellRenderer}
                  cellRendererParams={{
                    setOpenModal: setOpenModal,
                    setDocId: setDocId
                  }}
                />
              </AgGridReact>

              <Modal open={openDeleteModal} toggleModal={setOpenModal}>
                <div className="flex justify-center p-3">
                  <Stack>
                    <RectangleStroke />
                    <Delete style={{filter: `${toBlack} ${blackToRed500}`}} />
                  </Stack>
                </div>

                <h2 className="font-sans text-2xl leading-9 text-center my-1">
                  Delete File
                </h2>

                <p className="font-inter text-center text-base leading-7">
                  Are you sure you want to complete this action?
                  <br />
                  Once deleted the file cannot be recovered.
                </p>

                <div className="my-5 flex justify-end space-x-2.5">
                  <Button tertiary onClick={() => setOpenModal(false)}>
                    Cancel
                  </Button>
                  <Button primary onClick={() => deleteDoc(docId)}>
                    Delete
                  </Button>
                </div>
              </Modal>
            </div>
          }

          {(dragging || files.length === 0) && (
            <FilesDropZone
              className="mt-4 h-full flex-1"
              onFileDrop={onFileDrop}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentsView;
