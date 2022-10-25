import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import Button from '@modules/ui/Button';
import {humanFileSize} from '@utils/transformers';

import {ReactComponent as Storage} from '@assets/svgs/Storage.svg';

const MeterContainer = styled.div`
  height: 16px;
`;

const MeterDiv = styled.div`
  background: rgb(169, 185, 236);
  background: linear-gradient(
    18deg,
    rgba(169, 185, 236, 1) 0%,
    rgba(152, 147, 247, 1) 16%,
    rgba(118, 135, 242, 1) 30%,
    rgba(83, 139, 231, 1) 44%,
    rgba(75, 158, 218, 1) 58%,
    rgba(124, 198, 199, 1) 100%
  );
  width: ${(props) => `${props.size}%`};
`;

/**
 * Displays storage used by user
 *
 * @param {Number} used - space used by user, in bytes
 * @param {Number} total - total space available to user, in bytes
 */
const StorageInfo = ({used, total}) => {
  const meterWidthPercentage = (100 * used) / total;

  return (
    <div className="m-2.5 p-4 bg-white rounded-md">
      <div className="flex items-center space-x-2.5 font-inter font-light text-base leading-6">
        <Storage />
        <div>Storage</div>
      </div>

      <div className="mt-2.5 mb-1 font-inter font-normal text-sm leading-5 text-blue-500">
        <b className="font-medium">{humanFileSize(used)}</b> of{' '}
        {humanFileSize(total)}
      </div>

      <MeterContainer className="relative bg-grey-100 rounded-md my-0.5">
        <MeterDiv
          className="h-full relative overflow-hidden rounded-md"
          size={meterWidthPercentage}>
          &nbsp;
        </MeterDiv>
      </MeterContainer>

      <p className="mb-4 font-inter font-normal text-xs leading-4">
        5Mb/doc upload limit
      </p>

      <Button secondary fullWidth>
        Upgrade
      </Button>
    </div>
  );
};

StorageInfo.propTypes = {
  /** space used by user, in bytes */
  used: PropTypes.number.isRequired,
  /** total space available to user, in bytes */
  total: PropTypes.number.isRequired
};

export default StorageInfo;
