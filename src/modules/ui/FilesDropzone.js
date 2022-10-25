import React from 'react';
import PropTypes from 'prop-types';

import {useDropzone} from 'react-dropzone';

import Stack from '@modules/ui/Stack';

import {blackToBlue500} from '@utils/colorsFilters';
import {ReactComponent as DragAndDrop} from '@assets/svgs/DragAndDrop.svg';
import {ReactComponent as RectangleStroke} from '@assets/svgs/IconBorder-46.svg';

const FilesDropZone = ({onFileDrop, className}) => {
  const {getRootProps, getInputProps} = useDropzone({
    // pdf, docx, doc
    accept:
      'application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword',
    onDrop: onFileDrop
  });

  return (
    <section
      {...getRootProps({
        className: `dropzone h-full min-h-full w-full bg-grey-50 border-blue-500 border-2 border-dashed rounded-md flex items-center justify-center ${
          className ? className : ''
        }`
      })}>
      <input {...getInputProps()} />
      <div className="min-h-full flex flex-col justify-center items-center font-inter">
        <div className="mb-4">
          <Stack>
            <RectangleStroke style={{transform: 'scale(1.3)'}} />
            <DragAndDrop style={{filter: blackToBlue500}} />
          </Stack>
        </div>
        <div className="font-light text-2xl leading-9">
          Drag and drop file or click to upload
        </div>
        <div className="mt-1 font-normal text-base leading-6">
          Only .PDF and .DOCX files will be accepted
        </div>
      </div>
    </section>
  );
};

FilesDropZone.propTypes = {
  //TailwindCSS classnames
  className: PropTypes.string,
  //Callback method that passes back file upload data
  onFileDrop: PropTypes.func.isRequired
};

export default FilesDropZone;
