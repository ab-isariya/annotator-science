import {useState} from 'react';
import PropTypes from 'prop-types';

import SmoothCollapse from 'react-smooth-collapse';
import produce from 'immer';
import {useFormContext} from 'react-hook-form';

import Button from '@ui/Button';
import TagWithEntityType from '@ui/TypeTag';
import {annotationQueryState} from '@document/data/useAnnotations';
import {AnnotationStatusLabel} from '@utils/constants';
import {Checkbox} from '@form';
import {NumberCommaSuffix} from '@utils/transformers';
import {useDocument} from '@document';

import {ReactComponent as Chevron} from '@svgs/Chevron.svg';
import {ReactComponent as Close} from '@svgs/Close.svg';

const FormSection = ({label, children, className}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`${className} border-b border-grey-300 mb-8 last:mb-0`}>
      <div
        className="flex items-center justify-between pr-1 mb-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}>
        <h3 className="uppercase font-inter text-sm text-grey-900">{label}</h3>
        <Chevron
          className={`text-grey-500 transform ${
            expanded ? 'rotate-90' : '-rotate-90'
          }`}
        />
      </div>
      <SmoothCollapse
        expanded={expanded}
        allowOverflowWhenOpen={true}
        eagerRender={true}
        className={` transition-all ease-in-out ${
          expanded ? 'opacity-100' : 'opacity-0'
        }`}>
        {children}
      </SmoothCollapse>
    </div>
  );
};

FormSection.propTypes = {
  //Display label for dropdown header
  label: PropTypes.string.isRequired,
  //React children nodes
  children: PropTypes.node,
  // Tailwind Classes
  className: PropTypes.string
};

const FilterForm = ({className}) => {
  const {register, handleSubmit, reset} = useFormContext(); //NOTE(Rejon): Context comes from RightSidebar.js (see line 15)
  const {data: document} = useDocument();

  if (!document) {
    return null; //NOTE(Rejon): This should techincally never render based on logic to show this form inside of the sidebar.
  }

  const clearFilters = () => {
    annotationQueryState.set((prev) =>
      produce(prev, (updated) => {
        updated.filter = [];
      })
    );
    reset(); //<- Reset the form
  };

  const onSubmit = (data) =>
    annotationQueryState.set((prev) =>
      produce(prev, (updated) => {
        updated.isDefault = false;

        updated.filter = Object.keys(data)
          .filter((key) => data[key].length !== 0)
          .map((key) => {
            return {
              field: key,
              op: '==', //NOTE(Rejon): Filters are designed to be matched directly with. There are currently no ">" or "<" filters in the designs.
              value: data[key]
            };
          });
      })
    );

  const entityTypes = document.aggregations.entity_types;
  const reviewStatuses = document.aggregations.progress;

  return (
    <form className={`${className} px-5`} onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-between items-baseline pb-1 border-b border-grey-300 mb-4">
        <h2 className="text-xl">Filters</h2>
        <Close className="text-grey-500 cursor-pointer" />
      </div>
      <div className="flex items-center pb-4 border-b border-grey-300 mb-5">
        <div
          className="text-sm mr-5 text-grey-500 font-inter cursor-pointer"
          onClick={clearFilters}>
          Clear Filters
        </div>
        <Button className="flex-1" primary type="submit">
          Apply Filters
        </Button>
      </div>
      <div className="overflow-auto pb-5">
        <FormSection label="Review Status">
          {reviewStatuses.count.map((count, index) => (
            <Checkbox
              id={`filter-form-review-status-${index}`}
              name={'status'}
              value={reviewStatuses.status[index]}
              key={`filter-form-review-status-${index}`}
              className="items-center mb-4 last:mb-11"
              ref={register}>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm font-inter">
                  {AnnotationStatusLabel[reviewStatuses.status[index]]}
                </div>
                <p>{NumberCommaSuffix(count, 3)}</p>
              </div>
            </Checkbox>
          ))}
        </FormSection>

        <FormSection label="Entity Type">
          {entityTypes.map((item, index) => (
            <Checkbox
              id={`filter-form-entity-type-${index}`}
              name={'tag'}
              value={item.type}
              key={`filter-form-entity-type-${index}`}
              className="items-center mb-4 last:mb-11"
              ref={register}>
              <div className="flex items-center justify-between">
                <TagWithEntityType type="badge" tag={item.type} />
                <p>{item.count_raw}</p>
              </div>
            </Checkbox>
          ))}
        </FormSection>
      </div>
    </form>
  );
};

FilterForm.propTypes = {
  // Tailwind Classes
  className: PropTypes.string
};

export default FilterForm;
