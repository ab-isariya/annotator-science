import {useState} from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';
import {newRidgeState} from 'react-ridge-state';
import produce from 'immer';

import {Details, Spotlight} from '@document';

import {ReactComponent as Chevron} from '@svgs/Chevron.svg';
import {ReactComponent as Help} from '@svgs/Help.svg';
import {ReactComponent as ScienceIOAnnotateIcon} from '@svgs/ScienceIOAnnotateIcon.svg';
import {ReactComponent as Settings} from '@svgs/Settings.svg';
import {ReactComponent as SpotlightNormal} from '@svgs/SpotlightNormal.svg';
import {ReactComponent as SpotlightHover} from '@svgs/SpotlightHover.svg';
import {ReactComponent as SpotlightActive} from '@svgs/SpotlightActive.svg';
import {ReactComponent as DetailsNormal} from '@svgs/DetailsNormal.svg';
import {ReactComponent as DetailsActive} from '@svgs/DetailsActive.svg';
import {ReactComponent as DetailsHover} from '@svgs/DetailsHover.svg';

export const leftSidebarKey = {
  DOCUMENT_INFO: 'documentInformationOpen',
  SETTINGS: 'settingsOpen',
  SPOTLIGHT: 'spotlight',
  DETAILS: 'details'
};

export const leftSidebarState = newRidgeState(
  {
    documentInfo: null, //null, spotlight, details, ect.
    settingsOpen: false
  },
  {
    onSet: (newState) => {
      localStorage.setItem('@leftSidebarState', JSON.stringify(newState));
    }
  }
);

//Set the initial state for the left sidebar into local storage.
//NOTE(Rejon): Executed in InitializeState util on the first app load.
export const setInitialState = () => {
  const item = localStorage.getItem('@leftSidebarState');
  if (item) {
    const initialState = JSON.parse(item);
    leftSidebarState.set(initialState);
  }
};

const SidebarOption = ({
  className,
  isActive,
  label,
  defaultIcon,
  hoverIcon,
  activeIcon,
  ...otherProps
}) => {
  // Icons will be replaced on active and hover state
  // Doing it with tailwind caused flickering icons
  const [showIcon, setShowIcon] = useState(defaultIcon);

  return (
    <div
      className={`text-center flex flex-col items-center cursor-pointer mb-6 last:mb-0 ${className}`}
      onMouseEnter={() => setShowIcon(hoverIcon)}
      onMouseLeave={() => setShowIcon(defaultIcon)}
      {...otherProps}>
      {isActive ? activeIcon : showIcon}
      {label && (
        <p className={`text-xs font-inter ${isActive && 'font-bold'}`}>
          {label}
        </p>
      )}
    </div>
  );
};

SidebarOption.propTypes = {
  //React SVG Icon to show when active
  activeIcon: PropTypes.node.isRequired,
  // Tailwind Classes
  className: PropTypes.string,
  //Default state SVG icon to show on initial mount
  defaultIcon: PropTypes.node.isRequired,
  //React SVG Icon to show hovering over element
  hoverIcon: PropTypes.node.isRequired,
  //Controlled boolean for if this element is active or not
  isActive: PropTypes.bool.isRequired,
  //Display label rendered below icon
  label: PropTypes.string
};

const LeftSidebar = ({className}) => {
  const [sidebarState, setSidebarState] = leftSidebarState.use();
  const {documentInfo} = sidebarState;
  const setDocumentInfo = (key) => {
    setSidebarState((prev) =>
      produce(prev, (updated) => {
        if (prev.documentInfo === null) {
          updated.documentInfo = key;
        } else {
          //NOTE(Rejon): If our previous state has the same key as a the new
          //             set, toggle the sidebar back to null. Else, set the key.
          updated.documentInfo = prev.documentInfo === key ? null : key;
        }
      })
    );
  };

  const setSettingsOpen = () => {
    setSidebarState((prev) =>
      produce(prev, (updated) => {
        updated.settingsOpen = !prev.settingsOpen;
      })
    );
  };

  // TODO(Rejon): Finish logic for having sliding sidebar children.
  return (
    <div className={`${className} relative  inline-flex`}>
      <div className="flex flex-col justify-between h-full min-w-docLeftSidebar relative border-r border-solid bg-grey-50 border-grey-100">
        <div className="flex flex-col justify-center">
          <Link
            to="/"
            className="flex items-center cursor-pointer py-5 px-1 mb-4">
            <Chevron className="text-grey-500 mr-1" />
            <ScienceIOAnnotateIcon />
          </Link>

          <SidebarOption
            label={'Spotlight'}
            activeIcon={<SpotlightActive width={28} />}
            defaultIcon={<SpotlightNormal width={28} />}
            hoverIcon={<SpotlightHover width={28} />}
            isActive={documentInfo === leftSidebarKey.SPOTLIGHT}
            onClick={() => setDocumentInfo(leftSidebarKey.SPOTLIGHT)}
          />

          <SidebarOption
            label={'Details'}
            activeIcon={<DetailsActive width={28} />}
            defaultIcon={<DetailsNormal width={28} />}
            hoverIcon={<DetailsHover width={28} />}
            isActive={documentInfo === leftSidebarKey.DETAILS}
            onClick={() => setDocumentInfo(leftSidebarKey.DETAILS)}
          />
        </div>

        <div className="text-grey-500 flex flex-col ">
          <div className="px-5 py-5 cursor-pointer">
            <Help className="m-auto" />
          </div>
          <div className="px-5 py-5 cursor-pointer" onClick={setSettingsOpen}>
            <Settings className="m-auto" />
          </div>
        </div>
      </div>

      <div className={`${documentInfo !== null ? ' bg-grey-50' : ''}`}>
        {documentInfo === leftSidebarKey.SPOTLIGHT && <Spotlight />}
        {documentInfo === leftSidebarKey.DETAILS && <Details />}
      </div>

      {/* TODO(Rejon): Add settings sidebar */}
    </div>
  );
};

LeftSidebar.propTypes = {
  // Tailwind Classes
  className: PropTypes.string
};

export default LeftSidebar;
