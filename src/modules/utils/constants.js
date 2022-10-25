import {colors} from '@ui/theme';
import {ReactComponent as IconDocx} from '@assets/svgs/IconDocx.svg';
import {ReactComponent as IconPdf} from '@assets/svgs/IconPdf.svg';

/*
 * Entity/Annotation Status enum
 * See tat-api/annotate_api/chalicelib/database/utils.py
 */
export const AnnotationStatus = {
  ACCEPTED: 'ACCEPTED',
  NOT_REVIEWED: 'NOT_REVIEWED', //DEFAULT
  REJECTED: 'REJECTED',
  MANUAL: 'MANUAL'
};

/** Labels for Entity/Annotation status' */
export const AnnotationStatusLabel = {
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  NOT_REVIEWED: 'To Review',
  MANUAL: 'Added'
};

//NOTE(Rejon): Progress Type aggregations aren't sorted on the backend,
//             this array also helps controls the expected order for Progress Types
export const sortedAnnotationStatus = [
  AnnotationStatus.ACCEPTED,
  AnnotationStatus.REJECTED,
  AnnotationStatus.NOT_REVIEWED,
  AnnotationStatus.MANUAL
];

/** Color codes specifically used for PieChart components. */
export const annotationStatusColors = {
  ACCEPTED: colors.green['400'],
  REJECTED: colors.red['600'],
  NOT_REVIEWED: colors.grey['200'],
  MANUAL: colors.blue['500'],
  ZERO: colors.grey['50'] // no annotations
};

// Color codes for statuses rendered using only Text
export const altAnnotationStatusColors = {
  ACCEPTED: 'text-green-500',
  REJECTED: 'text-red-600',
  NOT_REVIEWED: 'text-grey-500',
  MANUAL: 'text-black'
};

//Annotation type tags based on Kepler spec.
export const annotationTypes = {
  ANATOMY: 'anatomy & physiology',
  CELLBIOLOGY: 'cell biology',
  CHEMICALS: 'chemicals & drugs',
  DEVICES: 'medical devices',
  CONDITIONS: 'medical conditions',
  GENETICS: 'genetics',
  PROCEDURES: 'medical procedures',
  VIRUSES: 'species & viruses',
  CONTEXT: 'context',
  UNASSIGNED: 'unassigned'
};

/*
 * Document processing state
 * See tat-api/annotate_api/chalicelib/database/utils.py
 *
 * Sorted values used in src/modules/document/table/sortFunctions.js
 */
export const ProcessingState = {
  CREATED: 'CREATED',
  UPLOADED: 'UPLOADED',
  QUEUED: 'QUEUED',
  FAILED: 'FAILED',
  PROCESSING: 'PROCESSING',
  PROCESSED: 'PROCESSED'
};

//Processing State sorted
export const sortedProcessingStatus = [
  'CREATED',
  'UPLOADED',
  'QUEUED',
  'PROCESSING',
  'PROCESSED'
];

/*
 * Annotation confidence scores based on Kepler scoring rubric
 */
export const ConfidenceScore = {
  very_high: {
    label: 'Very High',
    max: 1,
    min: 0.99,
    tooltipText: 'Very High Confidence',
    score_cat: 'VERY_HIGH'
  },
  high: {
    label: 'High',
    max: 0.98,
    min: 0.9,
    tooltipText: 'High Confidence',
    score_cat: 'HIGH'
  },
  moderate: {
    label: 'Moderate',
    max: 0.89,
    min: 0.7,
    tooltipText: 'Moderate Confidence',
    score_cat: 'MODERATE'
  },
  low: {
    label: 'Low',
    max: 0.69,
    min: 0.5,
    tooltipText: 'Low Confidence',
    score_cat: 'LOW'
  },
  very_low: {
    label: 'Very Low',
    max: 0.49,
    min: 0,
    tooltipText: 'Very Low Confidence',
    score_cat: 'VERY_LOW'
  }
};

//NOTE(Rejon): Confidence Type aggregations don't sort on the backend,
//             this controls the expected sort order if confidence type
//             is ever listed together.
export const ConfidenceTypeOrder = [
  'very_high',
  'high',
  'moderate',
  'low',
  'very_low'
];

// Keys that correspond to the backend model for filtering Annotations
// based on the client side modules they're used in.
export const AnnotationFilterKeys = {
  ModelConfidence: 'entity_p',
  Progress: 'status',
  Types: 'tag',
  Concepts: 'canonical_id'
};

//Possible view states for the document view.
export const DocumentViewTypes = {
  TABLE: 'table',
  DOCUMENT: 'document'
};

//Possible Document Export table options
export const DocumentExportTypes = {
  TSV: 'TSV',
  CSV: 'CSV',
  XLSX: 'XLSX'
};

//Lenght that a snippet should be.
export const SNIPPET_CLAMP = 25;

//Right sidebar view modes.
export const RightSidebarModes = {
  REVIEW: 'REVIEW',
  ADD: 'ADD',
  EDIT: 'EDIT'
};

//Supported upload file type icons.
export const FileTypes = {
  'docx': IconDocx,
  'pdf': IconPdf
};
