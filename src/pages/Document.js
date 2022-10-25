import Sticky from 'react-sticky-el';

import {DocumentView, LeftSidebar} from '@document';

const Document = () => (
  <div className="flex relative">
    <Sticky className="z-1">
      <LeftSidebar className="inline-flex h-screen max-w-docLeftSidebar" />
    </Sticky>
    <div className="inline-flex flex-1 z-0 flex-col">
      <DocumentView />
    </div>
  </div>
);

export default Document;
