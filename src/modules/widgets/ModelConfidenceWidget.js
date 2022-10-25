import isNil from 'lodash/isNil';
import maxBy from 'lodash/maxBy';
import produce from 'immer';
import {useFormContext} from 'react-hook-form';

import {
  AnnotationFilterKeys,
  ConfidenceTypeOrder,
  ConfidenceScore as CONFIDENCE_SCORE_CONSTANTS
} from '@utils/constants';
import Button from '@ui/Button';
import {Radio} from '@form';
import ConfidenceScoreLabel from '@ui/ConfidenceScoreLabel';
import ConfidenceScoreBar from '@modules/ui/ConfidenceScoreBar';
import Loading from '@ui/Loading';
import Title from '@ui/Title';
import Tooltip from '@ui/Tooltip';
import {
  useDocument,
  spotlightFilterState,
  annotationQueryState
} from '@document';
import {NumberCommaSuffix} from '@utils/transformers';

import {ReactComponent as Filter} from '@svgs/Filter.svg';
import {ReactComponent as FilterFilled} from '@svgs/FilterFilled.svg';

const ModelConfidenceWidget = () => {
  const {data: document} = useDocument();
  const {register, reset} = useFormContext(); // retrieve all hook methods
  const {modelConfidence} = spotlightFilterState.useValue();
  const {filter} = annotationQueryState.useValue();

  /**
   * Toggle whether the form for applying filters is open or not.
   * Can be set to a specific state if the setOpen parameter is provided.
   *
   *
   * @param {Boolean} setOpen
   */
  const toggleFilterState = (setOpen) => {
    spotlightFilterState.set((prev) =>
      produce(prev, (updated) => {
        let isOpen = !isNil(setOpen)
          ? setOpen
          : !prev.modelConfidence.filterOpen;

        //If filterState doesn't have model confidence or the filter isn't open.
        //Open it.
        updated.modelConfidence = {
          ...prev.modelConfidence,
          //NOTE(Rejon): If setOpen is provided then we don't toggle based
          //             on current state, but set based on boolean provided
          filterOpen: isOpen
        };
      })
    );
  };

  /**
   * Clear the filter from the spotlight form,
   * close the filter form on this widget,
   * remove the filter from the annotationQueryState.
   */
  const onClearFilter = () => {
    let resetObj = {};
    resetObj[AnnotationFilterKeys.ModelConfidence] = null;
    //Reset the Spotlight Form
    reset(resetObj);

    //Close the filter
    spotlightFilterState.set((prev) =>
      produce(prev, (updated) => {
        updated.modelConfidence = {
          filterOpen: prev.modelConfidence.filterOpen
        };
      })
    );

    //Remove the filter from the query
    annotationQueryState.set((prev) =>
      produce(prev, (updated) => {
        //Remove all instances of this filter from the query
        const newFilterQuery = prev.filter.filter(
          (o) => o.field !== AnnotationFilterKeys.ModelConfidence
        );

        updated.filter = newFilterQuery;

        //Reset to default if there are no more filters.
        //NOTE(Rejon): We reset to increase speed of UI update back to normal.
        //             See useAnnotations return statement (line 47) as to why.
        updated.isDefault = newFilterQuery.length === 0;
      })
    );
  };

  if (!document) {
    return <Loading />;
  }

  const {confidence_scores} = document.aggregations;
  const filterActive =
    filter.find((o) => o.field === AnnotationFilterKeys.ModelConfidence) !==
    undefined;

  //Current Filter Query for this Widget
  //TODO(Rejon): Revisit this when fixing the widget for the default checked issue.
  // const currentQuery = filter.find(
  //   (o) => o.field === AnnotationFilterKeys.ModelConfidence
  // );

  //
  /**
   * Widget Title Component
   * Renders the Title, and the Filter Buttons
   *
   * NOTE(Rejon): Height 24px inlined is to stop title from increasing in height
   */
  const widgetTitle = (
    <div
      className="flex items-center justify-between mb-3"
      style={{height: '24px'}}>
      <Title size="lg" className="text-grey-900">
        {modelConfidence.filterOpen ? 'Filters' : 'Model Confidence'}
      </Title>
      {/* Size defined to make clickable an area larger than icon:
            add onClick to div, not icon
             https://www.figma.com/file/1nNRtyjS81HhHrBLFFIxjp/Collapsible-Widget?node-id=1%3A1425 */}
      <div style={{minWidth: '36px'}}>
        {modelConfidence.filterOpen ? (
          <div className="flex flex-row items-center">
            <div
              className="font-inter text-sm mr-2 text-grey-500 cursor-pointer"
              onClick={() => toggleFilterState(false)}>
              Cancel
            </div>
            <Button
              className="text-sm border border-grey-500 px-2 py-1"
              onClick={() => {
                toggleFilterState(false);
              }}
              type="submit">
              Apply
            </Button>
          </div>
        ) : filterActive ? (
          <div className="flex flex-row items-center">
            <div
              className="font-inter text-sm mr-2 text-grey-500 cursor-pointer"
              onClick={() => onClearFilter()}>
              Clear
            </div>
            <FilterFilled
              onClick={() => toggleFilterState()}
              className="ml-auto text-blue-500 cursor-pointer"
            />
          </div>
        ) : (
          <Tooltip content="Filter" placement="left">
            <Filter
              onClick={() => toggleFilterState()}
              className="ml-auto cursor-pointer text-grey-500"
            />
          </Tooltip>
        )}
      </div>
    </div>
  );

  //TODO(Rejon): Update this to use the largest value from an array when changing in for real data.
  const maxWidth = maxBy(confidence_scores, (o) => o.count_raw).count_raw;

  //If we have filters, we'll only want certain types to show
  //when the filter is closed, and for certain checkboxes to be
  //checked by default.
  //NOTE(Rejon): There is a specific order to render the elements in.
  const typesToShow = ConfidenceTypeOrder.filter((_type) => {
    //Get only the filters for entity_p
    const queryFilters = filter.filter(
      (o) => o.field === AnnotationFilterKeys.ModelConfidence
    );

    //There are no current filters that use this widget.
    //Return all types
    if (queryFilters.length === 0) {
      return true;
    }

    //Find the min for our current type out of the filters.
    //Min should have '>=' operation and the value should match our constant min.
    const min = queryFilters.find(
      (o) => o.op === '>=' && CONFIDENCE_SCORE_CONSTANTS[_type].min === o.value
    );
    //Find the max for our current type out of the filters.
    //Max should have '<=' operation and the value should match our constant min.
    const max = queryFilters.find(
      (o) => o.op === '<=' && CONFIDENCE_SCORE_CONSTANTS[_type].max === o.value
    );

    //We've found our type if we have a min and max value match.
    return min !== undefined && max !== undefined;
  });

  //NOTE(Rejon): This is a temporary mimic function of the above typesToShow for
  //             ensuring there's only 1 Radio option
  const activeScoreCat = ConfidenceTypeOrder.filter((_type) => {
    //Get only the filters for entity_p
    const queryFilters = filter.filter(
      (o) => o.field === AnnotationFilterKeys.ModelConfidence
    );

    //There are no current filters that use this widget.
    //Return all types
    if (queryFilters.length === 0) {
      return false;
    }

    //Find the min for our current type out of the filters.
    //Min should have '>=' operation and the value should match our constant min.
    const min = queryFilters.find(
      (o) => o.op === '>=' && CONFIDENCE_SCORE_CONSTANTS[_type].min === o.value
    );
    //Find the max for our current type out of the filters.
    //Max should have '<=' operation and the value should match our constant min.
    const max = queryFilters.find(
      (o) => o.op === '<=' && CONFIDENCE_SCORE_CONSTANTS[_type].max === o.value
    );

    //We've found our type if we have a min and max value match.
    return min !== undefined && max !== undefined;
  });

  //Filters are active, and filters isn't open.
  //Show only what we've got active.
  if (filter.length > 0 && !modelConfidence.filterOpen) {
    return (
      <>
        {widgetTitle}
        {typesToShow.map((_type) => {
          //NOTE(Rejon): We're sorting off the expected order using type keys,
          //             and then running a find through the backend to find
          //             the object in question.
          const {count_raw, type} = confidence_scores.find(
            (o) => o.type === _type
          );
          const progressValue = (count_raw * 100) / maxWidth;

          return (
            <div
              className="flex items-center mb-2.5"
              key={`type-to-show-${type}`}>
              <ConfidenceScoreLabel
                type={type}
                className="block mr-1 flex items-center justify-center"
              />
              <ConfidenceScoreBar
                type={type}
                size={filter.length === 0 ? progressValue : 0}
              />
              {/* Min width from https://www.figma.com/file/DdbiQRZHR33IX83pYJwsNU/2021-Master-Components?node-id=2841%3A177 */}
              <div className="text-right" style={{minWidth: '34px'}}>
                {NumberCommaSuffix(count_raw, 4, 1000)}
              </div>
            </div>
          );
        })}
      </>
    );
  }

  return (
    <>
      {widgetTitle}
      {ConfidenceTypeOrder.map((_type, index) => {
        //NOTE(Rejon): We're sorting off the expected order using type keys,
        //             and then running a find through the backend to find
        //             the object in question.
        const {count_raw, type} = confidence_scores.find(
          (o) => o.type === _type
        );
        const progressValue = (count_raw * 100) / maxWidth;

        return (
          <div className="flex items-center mb-2.5" key={`type-${type}`}>
            {modelConfidence.filterOpen && (
              <Radio
                className={`
                mr-2
                ${count_raw === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                id={`model-confidence-widget-${index}`}
                value={type}
                key={`model-confidence-widget-${index}`}
                name={AnnotationFilterKeys.ModelConfidence}
                defaultChecked={
                  activeScoreCat.indexOf(_type) !== -1 && filter.length > 0
                }
                ref={register}
              />
            )}
            {!modelConfidence.filterOpen && (
              <ConfidenceScoreLabel
                type={type}
                className="block mr-1 flex items-center justify-center"
              />
            )}

            <ConfidenceScoreBar
              type={type}
              size={
                //If there's no filters OR our Filter is open, show the Bar.
                filter.length === 0 || modelConfidence.filterOpen
                  ? progressValue
                  : 0
              }
            />

            {/* Min width from https://www.figma.com/file/DdbiQRZHR33IX83pYJwsNU/2021-Master-Components?node-id=2841%3A177 */}
            <div className="text-right" style={{minWidth: '34px'}}>
              {NumberCommaSuffix(count_raw, 4, 1000)}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ModelConfidenceWidget;
