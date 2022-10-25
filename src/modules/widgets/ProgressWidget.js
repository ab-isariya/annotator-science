import isNil from 'lodash/isNil';
import sum from 'lodash/sum';
import zipObject from 'lodash/zipObject';
import {PieChart} from 'react-minimal-pie-chart';
import produce from 'immer';
import {useFormContext} from 'react-hook-form';

import {
  AnnotationFilterKeys,
  AnnotationStatus,
  AnnotationStatusLabel,
  annotationStatusColors,
  sortedAnnotationStatus
} from '@utils/constants';
import Button from '@ui/Button';
import {Checkbox} from '@form';
import Loading from '@ui/Loading';
import {NumberCommaSuffix} from '@utils/transformers';
import Stack from '@ui/Stack';
import Title from '@ui/Title';
import Tooltip from '@ui/Tooltip';
import {
  useDocument,
  spotlightFilterState,
  annotationQueryState
} from '@document';

import {ReactComponent as Filter} from '@svgs/Filter.svg';
import {ReactComponent as FilterFilled} from '@svgs/FilterFilled.svg';

const ProgressWidget = () => {
  const {data: document} = useDocument();
  const {register, reset} = useFormContext();
  const {progress} = spotlightFilterState.useValue();
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
        let isOpen = !isNil(setOpen) ? setOpen : !prev.progress.filterOpen;

        //If filterState doesn't have progress or the filter isn't open.
        //Open it.
        updated.progress = {
          ...prev.progress,
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
    resetObj[AnnotationFilterKeys.Progress] = null;
    //Reset the Spotlight Form
    reset(resetObj);

    //Close the filter
    spotlightFilterState.set((prev) =>
      produce(prev, (updated) => {
        updated.progress = {
          filterOpen: prev.progress.filterOpen
        };
      })
    );

    //Remove the filter from the query
    annotationQueryState.set((prev) =>
      produce(prev, (updated) => {
        //Remove all instances of this filter from the query
        const newFilterQuery = prev.filter.filter(
          (o) => o.field !== AnnotationFilterKeys.Progress
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
    //TODO(Rejon): Need design case for document not being loaded yet.
    return <Loading />;
  }

  const {count: progressCount, status: progressStatus} =
    document.aggregations.progress;

  //Take the status and count arrays and turn them into an object
  //where the key is the status name, and the value is the count.
  const documentProgress = zipObject(progressStatus, progressCount);
  //Current Filter Query for this Widget
  const currentQuery = filter.find(
    (o) => o.field === AnnotationFilterKeys.Progress
  );

  //This widget's filter is active if it has a query.
  const filterActive = currentQuery !== undefined;

  const kepler = {};
  //Remove manual from piechart calculation needs.
  //Manual is NOT rendered in the pie chart.
  Object.keys(documentProgress)
    .filter((item) => item !== AnnotationStatus.MANUAL)
    .forEach((item) => {
      if (filterActive) {
        kepler[item] = currentQuery.value.includes(item)
          ? documentProgress[item]
          : 0;
      } else {
        kepler[item] = documentProgress[item];
      }
    });

  let meterValues;
  let reviewedPercent;
  let paddingAngle = 0;

  if (document.annotations.length) {
    // Number of kepler annotations
    let reviewableCount = sum(Object.values(kepler));

    let reviewedCount = reviewableCount - kepler[AnnotationStatus.NOT_REVIEWED];
    const percentNumber = Math.round((100 * reviewedCount) / reviewableCount);

    reviewedPercent = `${isNaN(percentNumber) ? '0' : percentNumber}%`;

    meterValues = Object.keys(kepler).map((item) => {
      const valueNumber = Math.round(
        (100 * documentProgress[item]) / reviewableCount,
        2
      );
      //If filter is active AND the form is NOT visible,
      //render the pie chart values with consideration for
      //what's currently being filtered
      if (filterActive && !progress.filterOpen) {
        //If our current query includes the current status,
        //use it's values as part of the pie chart
        if (currentQuery?.value.includes(item)) {
          return {
            value: isNaN(valueNumber) ? 0 : valueNumber,
            color: annotationStatusColors[item]
          };
        } else {
          //If this status isn't included in the query, set it to 0 on the Pie Chart.
          return {
            value: 0,
            color: annotationStatusColors[item]
          };
        }
      }
      return {
        //Not filtering, render Pie Chart as expected for all status (except MANUAL)
        value: isNaN(valueNumber) ? 0 : valueNumber,
        color: annotationStatusColors[item]
      };
    });

    // If any value is equal to total, don't show separation
    paddingAngle = Object.values(kepler).some(
      (item) => item === reviewableCount
    )
      ? 0
      : 4;
  } else {
    meterValues = [
      {
        value: 100,
        color: annotationStatusColors['ZERO']
      }
    ];
    reviewedPercent = '-';
  }

  //Render the status' in a specific order based on design spec.
  const typesToShow = sortedAnnotationStatus.filter(
    (o) => o !== AnnotationStatus.MANUAL
  );

  const widgetTitle = (
    <div
      className="flex items-center justify-between mb-3"
      style={{height: '24px'}}>
      <Title size="lg" className="text-grey-900">
        {progress.filterOpen ? 'Filters' : 'Progress'}
      </Title>
      {/* Size defined to make clickable an area larger than icon:
            add onClick to div, not icon
             https://www.figma.com/file/1nNRtyjS81HhHrBLFFIxjp/Collapsible-Widget?node-id=1%3A1425 */}
      <div style={{minWidth: '36px'}}>
        {progress.filterOpen ? (
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

  return (
    <>
      {widgetTitle}

      <div
        className={`flex flex-row items-center ${
          progress.filterOpen ? 'space-x-3' : 'space-x-8'
        } mb-1.5 pb-2 border-b border-grey-200`}>
        <Stack>
          <PieChart
            data={meterValues}
            // Line width of each segment. Percentage of chart's radius
            lineWidth={25.6} // ~10px
            startAngle={-90}
            paddingAngle={paddingAngle}
            style={{height: '77px', width: '77px'}}
          />
          <div className="text-center">
            <h3 className="text-xl leading-5">{reviewedPercent}</h3>
            <p className="text-xxs leading-3">Reviewed</p>
          </div>
        </Stack>

        <div className="w-full">
          {typesToShow.map((key, index) => (
            <div
              className="flex items-center justify-between"
              key={`review-status-sum-${index}`}>
              <div className="flex row">
                {progress.filterOpen && (
                  <Checkbox
                    className={`
                    mr-1
                    ${
                  kepler[key] === 0 ? 'opacity-0 pointer-events-none' : ''
                  }`}
                    id={`progress-widget-${index}`}
                    value={key}
                    key={`progress-widget-${index}`}
                    name={AnnotationFilterKeys.Progress}
                    defaultChecked={currentQuery?.value.includes(key)}
                    ref={register}
                  />
                )}
                <p className="font-normal text-xs">
                  {AnnotationStatusLabel[key]}
                </p>
              </div>
              <p className="font-light text-base">
                {NumberCommaSuffix(kepler[key], 3)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`flex flex-row items-center ${
          progress.filterOpen ? 'space-x-3' : 'space-x-8'
        }`}>
        <div style={{minWidth: '77px'}}>&nbsp;</div>
        <div className="w-full">
          <div
            className="flex items-center justify-between"
            key={'review-status-sum-manual'}>
            <div className="flex row">
              {/* TODO(Rejon): Commenting out for now until we do added annotations. */}
              {progress.filterOpen && (
                <Checkbox
                  className={`
                    mr-1
                    ${
                documentProgress[AnnotationStatus.MANUAL] === 0
                  ? 'opacity-0 pointer-events-none'
                  : ''
                }`}
                  id={`progress-widget-${AnnotationStatus.MANUAL}`}
                  value={AnnotationStatus.MANUAL}
                  key={`progress-widget-${AnnotationStatus.MANUAL}`}
                  name={AnnotationFilterKeys.Progress}
                  defaultChecked={currentQuery?.value.includes(
                    AnnotationStatus.MANUAL
                  )}
                  ref={register}
                />
              )}
              <p className="font-normal text-xs">
                {AnnotationStatusLabel[AnnotationStatus.MANUAL]}
              </p>
            </div>
            <p className="font-light text-base">
              {NumberCommaSuffix(documentProgress[AnnotationStatus.MANUAL], 3)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressWidget;
