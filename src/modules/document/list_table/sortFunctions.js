import {sortedProcessingStatus} from '@utils/constants';
/*
 * @file Sorting functions for columns in ag-grid
 */

/**
 * Sorting function for status column
 *
 * @param {String} valueA - values in the cells to be compared. Typically sorts are done on these values only.
 * @param {String} valueB - values in the cells to be compared. Typically sorts are done on these values only.
 * @param {Object} nodeA - Row Nodes for the rows getting sorted. These can be used if more information, such as data from other columns, are needed for the comparison
 * @param {Object} nodeB - Row Nodes for the rows getting sorted. These can be used if more information, such as data from other columns, are needed for the comparison
 * @param {Boolean} isInverted - true for Ascending, false for Descending.
 * @return {number}
 */

export const statusComparator = (valueA, valueB) =>
  sortedProcessingStatus.indexOf(valueA) -
  sortedProcessingStatus.indexOf(valueB);
