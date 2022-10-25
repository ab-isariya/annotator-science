import PropTypes from 'prop-types';

import styled from 'styled-components';

import Tooltip from '@ui/Tooltip';
import TooltipGroup from '@ui/TooltipGroup';
import {AnnotationStatus} from '@utils/constants';
import {colors} from '@ui/theme';

import {ReactComponent as Check} from '@assets/svgs/Check.svg';
import {ReactComponent as Close} from '@assets/svgs/Close.svg';

//Accept Button styles
//Checks for status ACCEPTED and renders the accept toggle
const AcceptButton = styled.div`
  background: ${({status}) =>
    status === AnnotationStatus.ACCEPTED ? colors.green['400'] : 'white'};
  color: ${({status}) =>
    status === AnnotationStatus.ACCEPTED ? colors.white : colors.green['400']};
  transition: all 0.1s ease-in-out;
`;

//Reject Button styles
//Checks for status REJECTED and renders the reject toggle
const RejectButton = styled.div`
  background: ${(props) =>
    props.status === AnnotationStatus.REJECTED ? colors.red['600'] : 'white'};
  color: ${(props) =>
    props.status === AnnotationStatus.REJECTED
      ? colors.white
      : colors.red['600']};
  transition: all 0.1s ease-in-out;
`;

const ReviewToggle = ({status, reviewAnnotation, all, className}) => (
  <div className={`flex ${className}`}>
    <TooltipGroup transition>
      <Tooltip placement="top" content={`Accept ${all ? 'All' : ''}`}>
        <AcceptButton
          status={status}
          className={
            'flex items-center cursor-pointer mr-px rounded-l-md p-2 border border-green-400'
          }
          onClick={(e) => {
            e.stopPropagation();
            reviewAnnotation(AnnotationStatus.ACCEPTED);
          }}>
          <Check />
          {all && <span className="ml-1 font-inter font-semibold">ALL</span>}
        </AcceptButton>
      </Tooltip>
      <Tooltip placement="top" content={`Reject ${all ? 'All' : ''}`}>
        <RejectButton
          status={status}
          className={
            'flex items-center cursor-pointer rounded-r-md ml-px p-2 border border-red-600'
          }
          onClick={(e) => {
            e.stopPropagation();
            reviewAnnotation(AnnotationStatus.REJECTED);
          }}>
          {all && <span className="mr-1 font-inter font-semibold">ALL</span>}
          <Close />
        </RejectButton>
      </Tooltip>
    </TooltipGroup>
  </div>
);

ReviewToggle.propTypes = {
  //Annotation status (See AnnotationStatus in constants.js)
  status: PropTypes.string.isRequired,
  //Function for reviewing an annotation,
  //will most likely always come from an AnnotationCard/ActiveAnnotationCard.
  reviewAnnotation: PropTypes.func.isRequired,
  //Boolean
  all: PropTypes.bool,
  className: PropTypes.string
};

export default ReviewToggle;
