import PropTypes from 'prop-types';

import flatten from 'lodash/flatten';
import {useForm, FormProvider} from 'react-hook-form';

//import {annotationQueryState} from '@document/data/useAnnotations';
import {AnnotationFilterKeys, ConfidenceScore} from '@utils/constants';
import Card from '@ui/Card';
import ConceptsWidget from '@widgets/ConceptsWidget';
import ModelConfidenceWidget from '@widgets/ModelConfidenceWidget';
import ProgressWidget from '@widgets/ProgressWidget';
import Title from '@ui/Title';
import TypesWidget from '@widgets/TypesWidget';
import {leftSidebarState} from '@document/LeftSidebar';
import {useAnnotations, annotationQueryState} from '@document';

import {ReactComponent as Collapse} from '@svgs/Collapse.svg';
import produce from 'immer';

const Spotlight = ({className}) => {
  const {data: annotations} = useAnnotations();
  const methods = useForm();

  /**
   * onSubmit handler method for form wrapper.
   * Gets called when a button of type='submit' is clicked
   * or when we manually submit the form using react-hook-form methods.
   *
   * See "handleSubmit" explanation here: https://react-hook-form.com/api/useform/handlesubmit
   *
   * @param {Object} data - Object with key values of input "name" parameters with array or individual value.
   */
  const onSubmit = (data) => {
    //Go through form data, update filter state for spotlight filter view.
    annotationQueryState.set((prev) =>
      produce(prev, (updated) => {
        updated.isDefault = false;

        updated.filter = flatten(
          Object.keys(data)
            .filter((key) => data[key].length !== 0)
            .map((key) => {
              //NOTE(Rejon): Model Confidence is handled by range, not tag
              if (key === AnnotationFilterKeys.ModelConfidence) {
                //Map through all the tag types provided via model confidence,
                //and return their ranges.
                //TODO(Rejon): This does NOT work on the backend if there are more
                //             than 2 ranges provided because no 1 annotation supports
                //             2 ranges. The endpoint needs to be updated to support this
                //             specific feature.
                //NOTE(Rejon): Commenting this out until we support Checkboxes for ModelConfidenceWidget again.
                // return flatten(
                //   data[key].map((type) => {
                //     const confidenceObj = ConfidenceScore[type];
                //     return [
                //       {
                //         field: key,
                //         op: '>=',
                //         value: confidenceObj.min
                //       },
                //       {
                //         field: key,
                //         op: '<=',
                //         value: confidenceObj.max
                //       }
                //     ];
                //   })
                // );

                //TODO(Rejon): This is temporary and only works as long as we're using Radio's for Model confidence
                const confidenceObj = ConfidenceScore[data[key]];
                return [
                  {
                    field: key,
                    op: '>=',
                    value: confidenceObj.min
                  },
                  {
                    field: key,
                    op: '<=',
                    value: confidenceObj.max
                  }
                ];
              } else {
                return {
                  field: key,
                  op: '==', //NOTE(Rejon): Filters are designed to be matched directly with.
                  value: data[key]
                };
              }
            })
        );
      })
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={`block pt-5 font-inter font-light flex flex-col h-full ${
          className ? className : ''
        }`}>
        <div className="flex justify-between items-center mx-5 flex-auto flex-grow-0 flex-shrink">
          <Title>Spotlight</Title>
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

        <p className="mt-4 mb-2.5 mx-5 text-sm flex-auto flex-grow-0 flex-shrink">
          Displaying All{' '}
          <span className="font-medium">
            {/* TODO(Rejon): Put a spinner instead of empty text */}
            {annotations ? annotations.length : ''}
          </span>
          {/* Line break is on purpose */}
          <br />
          Annotations
        </p>

        <div className="overflow-auto px-5 w-72 pb-6 flex-auto">
          <Card className="mb-2.5 pb-5">
            <ProgressWidget />
          </Card>

          <Card className="mb-2.5" padding="px-0 pt-4">
            <ConceptsWidget />
          </Card>

          <Card className="mb-2.5 pb-5">
            <TypesWidget />
          </Card>

          <Card className="mb-2.5 pb-5">
            <ModelConfidenceWidget />
          </Card>
        </div>
      </form>
    </FormProvider>
  );
};

/** Any additional class to be used. Must be a Tailwind valid class */
Spotlight.propTypes = {
  className: PropTypes.string
};

export default Spotlight;
