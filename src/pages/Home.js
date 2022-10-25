import {useEffect, useRef, useState} from 'react';

import {useLocation} from 'react-router-dom';
import {toast} from 'react-toastify';
import {useOktaAuth} from '@okta/okta-react';

import Alert from '@modules/ui/Alert';
import Button from '@modules/ui/Button';
import DocumentsTable from '@document/list_table';
import Label from '@modules/ui/Label';
import StorageInfo from '@modules/ui/StorageInfo';
import TopLoadingBar from '@modules/ui/TopLoadingBar';
import UserIcon from '@modules/ui/UserIcon';
import {uploadDocument} from '@modules/document/api';
import {useAllDocuments} from '@document';
import {useUser} from '@user';

import {blackToWhite} from '@utils/colorsFilters';

import {ReactComponent as MyFilesActive} from '@assets/svgs/MyFilesActive.svg';
import {ReactComponent as MyFilesHover} from '@assets/svgs/MyFilesHover.svg';
import {ReactComponent as MyFilesNormal} from '@assets/svgs/MyFilesNormal.svg';
import {ReactComponent as PlusSign} from '@assets/svgs/PlusSign.svg';
import {ReactComponent as ScienceIOLogo} from '@assets/svgs/ScienceIOAnnotateLogoStacked.svg';
import {ReactComponent as SettingsActive} from '@assets/svgs/SettingsActive.svg';
import {ReactComponent as SettingsHover} from '@assets/svgs/SettingsHover.svg';
import {ReactComponent as SettingsNormal} from '@assets/svgs/SettingsNormal.svg';
import {ReactComponent as UploadIcon} from '@assets/svgs/Upload_Icon.svg';

const Home = () => {
  // Used to determine if this is active page
  const location = useLocation();
  const dropDownRef = useRef(null);

  const {oktaAuth, authState} = useOktaAuth();
  const {data: user, mutate: mutateUser} = useUser();

  const {data: fileList, mutate: mutateFileList} = useAllDocuments();

  const [showModal, setShowModal] = useState(false);

  // Controls for loading bar
  const [completeLoadBar, setCompleteLoadBar] = useState(false);

  const isAuthenticated = authState?.isAuthenticated;
  
  /**
   * When documents are loaded, complete loading gradient
   */
  useEffect(() => {
    if (isAuthenticated) {
      // Complete bar when data is retrieved
      if (fileList !== undefined) {
        setCompleteLoadBar(true);
      }
    } else {
      // Complete bar for anonymous users regardless of data
      setCompleteLoadBar(true);
    }
  }, [fileList, isAuthenticated]);

  /**
   * Uploads files using upload button to backend
   *
   * @param {Object} e - event
   * @return {Promise<void>}
   */
  const upload = async (e) => {
    // Announce it to user
    toast.info(
      <Alert icon={<UploadIcon style={{filter: `${blackToWhite}`}} />}>
        Uploading {e.target.files.length}{' '}
        {e.target.files.length === 1 ? 'Document' : 'Documents'}
      </Alert>,
      {autoClose: false}
    );

    const preFlightView = [...fileList];
    const nowISOTime = new Date().toISOString().slice(0, -1); //NOTE(Rejon): Drop the Z!

    const preFlightFile = {
      datetime_created: nowISOTime,
      datetime_modified: nowISOTime,
      filename: e.target.files[0].name,
      filetype: e.target.files[0].name.split('.').pop(),
      id: `preflight-${fileList.length}`,
      preFlight: true
    };

    //Optimistically update UI immediately
    mutateFileList([...preFlightView, preFlightFile], null, false);

    const upload = await uploadDocument(e.target.files, user.id, user.accessToken);

    // Revalidate user cache to retrieve updated used storage
    mutateUser();

    //Update our UI with new actual data, revalidate on endpoint.
    mutateFileList([...fileList, upload]);
  };

  const iconSize = {width: 46};
  // Icons will be replaced on active and hover state
  // Doing it with tailwind caused flickering icons
  const [FilesIcon, setFilesIcon] = useState(<MyFilesNormal {...iconSize} />);
  const [SettingsIcon, setSettingsIcon] = useState(
    <SettingsNormal {...iconSize} />
  );

  /**
   * Handler to close dropdown when clicking outside
   *
   * @param event
   */
  const handleClickOutside = (event) => {
    if (!dropDownRef.current.contains(event.target)) {
      setShowModal(false);
    }
  };

  /**
   * Add listener when dropdown is open
   */
  useEffect(() => {
    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  return (
    <>
      <TopLoadingBar completeOn={completeLoadBar} />

      {!isAuthenticated && (
        <div className="w-screen h-screen flex justify-center items-center">
          <Button primary onClick={() => oktaAuth.signInWithRedirect('/')}>
            Login
          </Button>
        </div>
      )}

      {isAuthenticated && user && (
        <div className="min-h-screen min-w-screen h-full w-full flex font-sans">
          <div
            style={{width: '180px'}}
            className="bg-grey-50 border-r border-grey-100">
            <div className="h-full flex flex-col justify-between">
              <div className="p-5">
                <ScienceIOLogo />
              </div>

              <div className="h-full px-5 font-inter">
                <UserIcon
                  ref={dropDownRef}
                  onClick={() => setShowModal(!showModal)}
                  canShowDropdown={showModal}>
                  <Label secondary small>
                    Pro User
                  </Label>
                </UserIcon>

                <div className="my-5">
                  <input
                    id="pdf-input"
                    accept=".pdf, .PDF, .docx"
                    name="pdf-input"
                    onChange={upload}
                    type="file"
                    hidden
                  />
                  <label
                    className="w-full flex items-center justify-center space-x-2.5 py-2 bg-blue-500 rounded-md font-inter text-white text-base uppercase font-medium hover:bg-blue-600"
                    htmlFor="pdf-input">
                    <PlusSign /> <div>upload</div>
                  </label>
                </div>

                <div className="flex items-center space-x-2.5 my-5 text-base">
                  {/* If current page */}
                  {location.pathname === '/' ? (
                    <>
                      <MyFilesActive {...iconSize} />
                      <div className="font-medium">My Files</div>
                    </>
                  ) : (
                    <>
                      <div
                        onMouseEnter={() =>
                          setFilesIcon(<MyFilesHover {...iconSize} />)
                        }
                        onMouseLeave={() =>
                          setFilesIcon(<MyFilesNormal {...iconSize} />)
                        }>
                        {FilesIcon}
                      </div>
                      <div className="font-normal">My&nbsp;Files</div>
                    </>
                  )}
                </div>

                <div className="flex items-center space-x-2.5 my-5">
                  {location.pathname === '/settings' ? (
                    <>
                      <SettingsActive {...iconSize} />
                      <div className="font-medium">Settings</div>
                    </>
                  ) : (
                    <>
                      <div
                        onMouseEnter={() =>
                          setSettingsIcon(<SettingsHover {...iconSize} />)
                        }
                        onMouseLeave={() =>
                          setSettingsIcon(<SettingsNormal {...iconSize} />)
                        }>
                        {SettingsIcon}
                      </div>
                      <div className="font-normal">Settings</div>
                    </>
                  )}
                </div>
              </div>

              <StorageInfo
                used={user?.storage?.used || 0}
                total={user?.storage?.total || 0}
              />
            </div>
          </div>

          <DocumentsTable />
        </div>
      )}
    </>
  );
};

export default Home;
