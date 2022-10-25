import {
  annotationStatusColors,
  AnnotationStatus,
  sortedAnnotationStatus,
  altAnnotationStatusColors,
  annotationTypes,
  ProcessingState,
  sortedProcessingStatus,
  ConfidenceScore,
  ConfidenceTypeOrder,
  AnnotationFilterKeys,
  DocumentViewTypes,
  DocumentExportTypes,
  RightSidebarModes,
  SNIPPET_CLAMP
} from '../constants';
import {colors} from '../../ui/theme';
import confidenceStyles from '@styles/ConfidenceStyles';

describe('Annotation Status Constants', () => {
  it('Returns expected annotation status colors', () => {
    expect(annotationStatusColors.ACCEPTED).toBe(colors.green['400']);

    expect(annotationStatusColors.REJECTED).toBe(colors.red['600']);

    expect(annotationStatusColors.NOT_REVIEWED).toBe(colors.grey['200']);

    expect(annotationStatusColors.MANUAL).toBe(colors.blue['500']);

    expect(annotationStatusColors.ZERO).toBe(colors.grey['50']);
  });

  it('Returns Annotation Status as correct backend enum key', () => {
    expect(AnnotationStatus.ACCEPTED).toBe('ACCEPTED');

    expect(AnnotationStatus.NOT_REVIEWED).toBe('NOT_REVIEWED');

    expect(AnnotationStatus.REJECTED).toBe('REJECTED');

    expect(AnnotationStatus.MANUAL).toBe('MANUAL');
  });

  it('Returns Annotation Status sorted as expected by design', () => {
    expect(sortedAnnotationStatus).toStrictEqual([
      'ACCEPTED',
      'REJECTED',
      'NOT_REVIEWED',
      'MANUAL'
    ]);
  });

  it('Returns Text only Annotation Status Colors by design', () => {
    expect(altAnnotationStatusColors.ACCEPTED).toBe('text-green-500');
    expect(altAnnotationStatusColors.REJECTED).toBe('text-red-600');
    expect(altAnnotationStatusColors.NOT_REVIEWED).toBe('text-grey-500');
    expect(altAnnotationStatusColors.MANUAL).toBe('text-black');
  });
});

describe('Annotation Type Tag Constants', () => {
  it('Returns annotation type tags based on Kepler spec', () => {
    expect(annotationTypes.ANATOMY).toBe('anatomy & physiology');
    expect(annotationTypes.CELLBIOLOGY).toBe('cell biology');
    expect(annotationTypes.CHEMICALS).toBe('chemicals & drugs');
    expect(annotationTypes.DEVICES).toBe('medical devices');
    expect(annotationTypes.CONDITIONS).toBe('medical conditions');
    expect(annotationTypes.GENETICS).toBe('genetics');
    expect(annotationTypes.PROCEDURES).toBe('medical procedures');
    expect(annotationTypes.VIRUSES).toBe('species & viruses');
    expect(annotationTypes.CONTEXT).toBe('context');
    expect(annotationTypes.UNASSIGNED).toBe('unassigned');
  });
});

describe('Document Processing Constants', () => {
  it('Returns Processing State based on design spec', () => {
    expect(ProcessingState.CREATED).toBe('CREATED');
    expect(ProcessingState.UPLOADED).toBe('UPLOADED');
    expect(ProcessingState.QUEUED).toBe('QUEUED');
    expect(ProcessingState.FAILED).toBe('FAILED');
    expect(ProcessingState.PROCESSING).toBe('PROCESSING');
    expect(ProcessingState.PROCESSED).toBe('PROCESSED');
  });

  it('Returns Processing State sorted in order by spec', () => {
    expect(sortedProcessingStatus).toStrictEqual([
      'CREATED',
      'UPLOADED',
      'QUEUED',
      'PROCESSING',
      'PROCESSED'
    ]);
  });
});

describe('Confidence Score Constants', () => {
  const expected_score_types = [
    'very_high',
    'high',
    'moderate',
    'low',
    'very_low'
  ];

  it('Returns object keys that match backend keys', () => {
    expect(Object.keys(ConfidenceScore)).toEqual(
      expect.arrayContaining(expected_score_types)
    );
  });

  it('Returns score types in expected order of score ranges', () => {
    expect(ConfidenceTypeOrder).toEqual(expected_score_types);

    let _inOrder = true;

    for (var i = 0; i < expected_score_types.length - 1; i++) {
      if (
        ConfidenceScore[expected_score_types[i]].min <
        ConfidenceScore[expected_score_types[i + 1]].min
      ) {
        _inOrder = false;
        break;
      }
    }

    expect(_inOrder).toBe(true);
  });

  it('Style object keys match backend score category keys', () => {
    expect(Object.keys(confidenceStyles)).toEqual(
      expect.arrayContaining(expected_score_types)
    );
  });
});

describe('Annotation Filtering Keys', () => {
  it('Returns expected form key for spotlight widget', () => {
    expect(AnnotationFilterKeys.ModelConfidence).toBe('entity_p');
    expect(AnnotationFilterKeys.Progress).toBe('status');
    expect(AnnotationFilterKeys.Types).toBe('tag');
    expect(AnnotationFilterKeys.Concepts).toBe('canonical_id');
  });
});

describe('Document View Constants', () => {
  it('Returns all document view types', () => {
    expect(DocumentViewTypes.TABLE).toBe('table');
    expect(DocumentViewTypes.DOCUMENT).toBe('document');
  });

  it('Returns Document Table export types', () => {
    expect(DocumentExportTypes.TSV).toBe('TSV');
    expect(DocumentExportTypes.CSV).toBe('CSV');
    expect(DocumentExportTypes.XLSX).toBe('XLSX');
  });

  it('Returns all right sidebar modes', () => {
    expect(RightSidebarModes.REVIEW).toBe('REVIEW');
    expect(RightSidebarModes.ADD).toBe('ADD');
    expect(RightSidebarModes.EDIT).toBe('EDIT');
  });

  it('Returns a snippet clamp length of 25', () => {
    expect(SNIPPET_CLAMP).toBe(25);
  });
});
