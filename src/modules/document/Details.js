import PropTypes from 'prop-types';

import DateTime from 'luxon/src/datetime';

import {datetimeToHuman, humanFileSize} from '@utils/transformers';
import {leftSidebarState} from '@document/LeftSidebar';
import {useDocument} from '@document';

import {ReactComponent as Collapse} from '@svgs/Collapse.svg';

const Detail = ({label, children}) => (
  <div className="flex items-start mb-3">
    <p className="text-grey-500 text-xs mr-3" style={{minWidth: '80px'}}>
      {label}
    </p>
    <p className="text-sm">{children}</p>
  </div>
);

Detail.propTypes = {
  //Text display label
  label: PropTypes.string.isRequired,
  //Extraneous details or information to display based on the label
  children: PropTypes.node
};

const Details = ({className}) => {
  const {data: document} = useDocument();

  //TODO(Rejon): Need owner, shared with, last exported data to render rest of details.
  return (
    <div className={`p-4 font-inter font-light w-66 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl leading-9"> Details </h2>
        <div
          className="cursor-pointer p-2 pr-0"
          onClick={() => {
            leftSidebarState.set((prev) => ({
              ...prev,
              documentInfo: null
            }));
          }}>
          <Collapse className="text-grey-500" />
        </div>
      </div>

      {document ? (
        <div
          className="overflow-auto mt-4 mb-2.5"
          style={{maxHeight: 'calc(100vh - 58px)'}}>
          {/* <Detail label={'Owner'}> </Detail> */}
          {/* <Detail label={'Shared with'}> </Detail> */}
          <Detail label={'Last Modified'}>
            {datetimeToHuman(document.datetime_modified, DateTime.DATE_FULL)}
            <br />
            {' at '}
            {datetimeToHuman(document.datetime_modified, DateTime.TIME_SIMPLE)}
          </Detail>
          {/* <Detail label={'Last Exported'}></Detail> */}
          <Detail label={'Created'}>
            {datetimeToHuman(document.datetime_created, DateTime.DATE_FULL)}
          </Detail>
          <Detail label={'File Type'}>
            .<span className="uppercase">{document.filetype}</span>
          </Detail>
          <Detail label={'File Size'}>
            {humanFileSize(document.filesize)}
          </Detail>
        </div>
      ) : (
        <div className="overflow-auto px-5 pb-5">Loading Details...</div>
      )}
    </div>
  );
};

Details.propTypes = {
  // Tailwind Classes
  className: PropTypes.string
};

export default Details;
