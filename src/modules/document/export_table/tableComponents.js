import PropTypes from 'prop-types';

import TypeTag from '@ui/TypeTag';
import {
  altAnnotationStatusColors,
  AnnotationStatusLabel
} from '@utils/constants';

const ConceptCell = ({data}) => {
  const {canonical_name} = data;

  return (
    <div className="font-sans font-bold text-sm line-clamp-1">
      {canonical_name}
    </div>
  );
};

ConceptCell.propTypes = {
  //NOTE(Rejon): Date comes from AgGridReact "rowData" for row being displayed.
  data: PropTypes.object.isRequired,
  //canonical_name for the annotation being rendered in the row
  canonical_name: PropTypes.string.isRequired
};

ConceptCell.displayName = 'ConceptCell';

const HighlightedTextCell = ({data}) => {
  const {text} = data;

  return <div className="font-serif text-sm line-clamp-1">{text}</div>;
};

HighlightedTextCell.propTypes = {
  //NOTE(Rejon): Date comes from AgGridReact "rowData" for row being displayed.
  data: PropTypes.object.isRequired,
  //Text for the annotation that's rendered in the document.
  text: PropTypes.string.isRequired
};

HighlightedTextCell.displayName = 'HighlightedTextCell';

const TypeCell = ({data}) => {
  const {tag} = data;

  return (
    <div>
      <TypeTag type={tag} size={0} />
    </div>
  );
};

TypeCell.propTypes = {
  //NOTE(Rejon): Date comes from AgGridReact "rowData" for row being displayed.
  data: PropTypes.object.isRequired,
  //Annotation tag/type (ie. Anatomy & Physiology)
  tag: PropTypes.string.isRequired
};

TypeCell.displayName = 'TypeCell';

const IdentifierCell = ({data}) => {
  const {canonical_id} = data;

  return (
    <div className="font-mono text-sm text-grey-500 underline font-normal">
      {canonical_id}
    </div>
  );
};

IdentifierCell.propTypes = {
  //NOTE(Rejon): Date comes from AgGridReact "rowData" for row being displayed.
  data: PropTypes.object.isRequired,
  //ULMS (or other database) identifier for the annotation
  canonical_id: PropTypes.string.isRequired
};

IdentifierCell.displayName = 'IdentifierCell';

const StatusCell = ({data}) => {
  const {status} = data;

  return (
    <div className={`font-inter text-sm ${altAnnotationStatusColors[status]}`}>
      {AnnotationStatusLabel[status]}
    </div>
  );
};

StatusCell.propTypes = {
  //NOTE(Rejon): Date comes from AgGridReact "rowData" for row being displayed.
  data: PropTypes.object.isRequired,
  //Annotation review status
  status: PropTypes.string.isRequired
};

StatusCell.displayName = 'StatusCell';

export {ConceptCell, HighlightedTextCell, TypeCell, IdentifierCell, StatusCell};
