import produce from 'immer';
import {useFormContext} from 'react-hook-form';

import {
  ActiveAnnotationCard,
  rightSidebarState,
  annotationQueryState,
  useAnnotations
} from '@document';
import Loading from '@ui/Loading';
import Stack from '@ui/Stack';

import {ReactComponent as CloseIcon} from '@svgs/Close.svg';
import {ReactComponent as RectangleFlowerStroke} from '@svgs/RectangleFlower_Stroke.svg';
import {ReactComponent as SearchNoResults} from '@svgs/Search_NoResults.svg';

const AnnotationList = (props) => {
  const {data: annotations} = useAnnotations();
  const {activeAnnotation} = rightSidebarState.useValue();
  const {reset} = useFormContext();

  if (!annotations) {
    //TODO(Rejon): Needs loading state
    return <Loading />;
  }

  const clearFilters = () => {
    annotationQueryState.set((prev) =>
      produce(prev, (updated) => {
        updated.filter = [];
      })
    );
    reset();
  };

  if (annotations.length === 0) {
    return (
      <div className="mt-9 flex items-center flex-col px-5">
        <div className="flex justify-center flex-col items-center">
          <Stack className=" mb-2">
            <RectangleFlowerStroke className="text-grey-200" />
            <SearchNoResults className="text-blue-500 transform absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          </Stack>
        </div>
        <h3 className="text-xl mb-2">No Annotations Found</h3>
        <p className="mb-7 text-grey-500 font-inter px-3 text-center">
          We couldn't find any results that matched your current filters
        </p>
        <button
          onClick={clearFilters}
          className="text-grey-500 flex items-center text-sm font-inter">
          <CloseIcon className="mr-2" />
          Clear Filters
        </button>
      </div>
    );
  }

  const setActiveAnnotation = (annotation) => {
    rightSidebarState.set((prev) =>
      produce(prev, (updated) => {
        updated.annotation = {...annotation};
      })
    );
  };

  return (
    <div {...props}>
      {annotations.map((ann, index) => (
        <ActiveAnnotationCard
          key={`annotation-list-card-${index}`}
          onClick={() => setActiveAnnotation(ann)}
          expanded={
            activeAnnotation.annotation &&
            activeAnnotation.annotation.id === ann.id
          }
          {...ann}
        />
      ))}
    </div>
  );
};

export default AnnotationList;
