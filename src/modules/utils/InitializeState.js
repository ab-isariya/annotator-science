/* istanbul ignore file */
import {setInitialState as SpotlightInitialize} from '@document/data/useSpotlight';
import {setInitialState as LeftSidebarInitialize} from '@document/LeftSidebar';
import {setInitialState as DocumentViewInitialize} from '@document/data/useDocument';
import {setInitialState as UseAnnotationsInitialize} from '@document/data/useAnnotations';

export default () => {
  SpotlightInitialize();
  LeftSidebarInitialize();
  DocumentViewInitialize();
  UseAnnotationsInitialize();
};
