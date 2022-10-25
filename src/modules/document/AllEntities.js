import {newRidgeState} from 'react-ridge-state';

import {AnnotationQuerier, useAnnotations, useDocument} from '@document';

export const allEntitiesState = newRidgeState({
  showFilters: false
});

const AllEntities = () => {
  const {data: document} = useDocument();
  const {data: annotations} = useAnnotations();

  return (
    <div>
      <div className="border-b border-grey-200 p-5">
        <h2 className="text-xl mb-0.5"> All Entities </h2>

        <p className="text-sm mb-0.5">
          {' '}
          Showing {annotations ? annotations.length : '...'} of{' '}
          {document ? document.annotations.length : '...'} Annotations{' '}
        </p>
        <AnnotationQuerier />
      </div>
      {/*<AnnotationList className="p-5" />*/}
    </div>
  );
};
export default AllEntities;
