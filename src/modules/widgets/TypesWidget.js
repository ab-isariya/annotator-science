import isNil from 'lodash/isNil';
import map from 'lodash/map';
import produce from 'immer';
import {useFormContext} from 'react-hook-form';

import Button from '@ui/Button';
import {Checkbox} from '@form';
import Loading from '@ui/Loading';
import Title from '@ui/Title';
import Tooltip from '@ui/Tooltip';
import TypeTag from '@ui/TypeTag';
import {AnnotationFilterKeys} from '@utils/constants';
import {NumberCommaSuffix} from '@utils/transformers';
import {
  useDocument,
  spotlightFilterState,
  annotationQueryState
} from '@document';

import {ReactComponent as Filter} from '@svgs/Filter.svg';
import {ReactComponent as FilterFilled} from '@svgs/FilterFilled.svg';

const TypesWidget = () => {
  const {data: document} = useDocument();
  const {register, reset, setValue, watch} = useFormContext(); // retrieve all hook methods
  const {types} = spotlightFilterState.useValue();
  const {filter} = annotationQueryState.useValue();

  if (!document) {
    //TODO(Rejon): Need loading state for this
    return <Loading />;
  }

  const typesArray = document.aggregations.entity_types;

  //Current Filter Query for this Widget
  //Find the filter query based on the filter key for this widget.
  const currentQuery = filter.find(
    (o) => o.field === AnnotationFilterKeys.Types
  );

  //This widget's filter is active if it has a query.
  const filterActive = currentQuery !== undefined;

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
        let isOpen = !isNil(setOpen) ? setOpen : !prev.types.filterOpen;

        //If filterState doesn't have types or the filter isn't open.
        //Open it.
        updated.types = {
          ...prev.types,
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
    resetObj[AnnotationFilterKeys.Types] = null;
    //Reset the Spotlight Form
    reset(resetObj);

    //Close the filter
    spotlightFilterState.set((prev) =>
      produce(prev, (updated) => {
        updated.types = {
          filterOpen: prev.types.filterOpen
        };
      })
    );

    //Remove the filter from the query
    annotationQueryState.set((prev) =>
      produce(prev, (updated) => {
        //Remove all instances of this filter from the query
        const newFilterQuery = prev.filter.filter(
          (o) => o.field !== AnnotationFilterKeys.Types
        );

        updated.filter = newFilterQuery;

        //Reset to default if there are no more filters.
        //NOTE(Rejon): We reset to increase speed of UI update back to normal.
        //             See useAnnotations return statement (line 47) as to why.
        updated.isDefault = newFilterQuery.length === 0;
      })
    );
  };

  /**
   * Toggle for if the select all checkbox to check
   * or un-check all form checkboxes.
   *
   * NOTE(Rejon): Must be placed on the Checkbox component,
   *              NOT a div.
   *
   * See the react-hook-form "setValue" for more: https://react-hook-form.com/api/useform/setvalue
   *
   * @param {Event: HTMLElement} target
   */
  const onSelectAllToggle = ({target}) => {
    if (target.checked) {
      //Update the Spotlight Form for Types to include all types.
      setValue(AnnotationFilterKeys.Types, map(typesArray, 'type'), {
        shouldDirty: true
      });
    } else {
      //Update Spotlight form to include no values.
      //NOTE(Rejon): We don't use "reset" from useFormContext here since the
      //             intended action is to update the form values to unchecked.
      setValue(AnnotationFilterKeys.Types, [], {shouldDirty: true});
    }
  };

  /**
   * Deselect
   *
   * See the react-hook-form "setValue" for more: https://react-hook-form.com/api/useform/setvalue
   *
   * @param {Event: HTMLElement} target
   */
  const onDeselectAll = () => {
    setValue(AnnotationFilterKeys.Types, [], {shouldDirty: true});
  };

  const widgetTitle = (
    <div className="flex items-center justify-between mb-3.5">
      <Title size="lg" className="text-grey-900">
        {types.filterOpen ? 'Filters' : 'Types'}
      </Title>
      {/* Size defined to make clickable an area larger than icon:
            add onClick to div, not icon
             https://www.figma.com/file/1nNRtyjS81HhHrBLFFIxjp/Collapsible-Widget?node-id=1%3A1425 */}
      <div style={{minWidth: '36px'}}>
        {types.filterOpen ? (
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

  //If we don't have any types to render, show "0 Types"
  //instead of rendering a list.
  if (!typesArray.length) {
    return (
      <>
        {widgetTitle}
        <p className="text-xs text-grey-500">
          <span className="font-medium">0</span> Types
        </p>
      </>
    );
  } else {
    //We have entities, render them in the list format we expect.
    const maxWidth = typesArray[0].count_raw; //Entities are sorted by frequency.

    const typesToShow = typesArray.filter(({type}) => {
      //If we're filtering, and the filter form is closed.
      //Show only what we're filtering on
      if (filterActive && !types.filterOpen) {
        return currentQuery.value.includes(type);
      } else {
        return true;
      }
    });

    let formValues =
      watch(AnnotationFilterKeys.Types, undefined) || currentQuery?.value || [];

    return (
      <>
        {widgetTitle}
        {/* Subtext when form is open */}
        {types.filterOpen && (
          <div className="flex row mb-2">
            {/* NOTE(Rejon): We don't use the same Checkbox because the input doesn't support 
                             an intermediate state based on the designs. We fake it with a div.*/}
            {formValues.length === typesArray.length ||
            formValues.length === 0 ? (
                <Checkbox
                  className={'mr-1'}
                  id={'types-select-all'}
                  onChange={onSelectAllToggle}
                  defaultChecked={formValues.length === typesArray.length}
                />
              ) : (
                <div
                  className="cursor-pointer relative rounded-sm w-4 h-4 mr-1 border-2 border-grey-400 bg-grey-400"
                  onClick={onDeselectAll}>
                  <span
                    className="block w-2 bg-white absolute -trans left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{height: '2px'}}></span>
                </div>
              )}

            {/* 0 "X Types" vs. Multiple "Selected X Type(s)" */}
            <p className="text-xs text-grey-500">
              {formValues.length === 0 ? (
                <>
                  <span className="font-medium">{typesArray.length}</span> Types
                </>
              ) : (
                <>
                  Selected{' '}
                  <span className="font-medium">{formValues.length}</span> Type
                  {formValues.length > 1 && 's'}
                </>
              )}
            </p>
          </div>
        )}
        {/* Subtext "Displaying X of Y Types" when filter is active, but form is closed */}
        {!types.filterOpen && filterActive && (
          <div className="flex row mb-2">
            <p className="text-xs text-grey-500">
              Displaying{' '}
              <span className="font-medium">{typesToShow.length}</span> of{' '}
              <span className="font-medium">{typesArray.length}</span> Types
            </p>
          </div>
        )}
        {/* Types list  */}
        {typesToShow.map((entity, index) => {
          const progressValue = (entity.count_raw * 100) / maxWidth;

          return (
            <div className="flex items-center mb-2" key={`type-${entity.type}`}>
              {!types.filterOpen ? (
                <p className="text-grey-500 text-xs min-w-4">{index + 1}</p>
              ) : (
                <Checkbox
                  className={'mr-1'}
                  id={`types-widget-${index}`}
                  value={entity.type}
                  key={`types-widget-${index}`}
                  name={AnnotationFilterKeys.Types}
                  defaultChecked={currentQuery?.value.includes(entity.type)}
                  ref={register}
                />
              )}

              {/* NOTE(Rejon): Don't show the bar if we have filters. */}
              <TypeTag
                badge
                type={entity.type}
                size={
                  filter.length === 0 || types.filterOpen ? progressValue : 0
                }
              />

              {/* Min width from https://www.figma.com/file/DdbiQRZHR33IX83pYJwsNU/2021-Master-Components?node-id=2841%3A177 */}
              <div className="text-right" style={{minWidth: '34px'}}>
                {NumberCommaSuffix(entity.count_raw, 3)}
              </div>
            </div>
          );
        })}
      </>
    );
  }
};

export default TypesWidget;
