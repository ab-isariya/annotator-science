// See https://www.figma.com/file/DdbiQRZHR33IX83pYJwsNU/2021-Master-Components?node-id=3106%3A23
// for specs on tag styling

//Annotation Background Styles
//NOTE: Text and BG are seperated due to rejected state having "text-black" class override
export const annBGStyles = {
  // Anatomy & Physiology
  'anatomy & physiology': 'hover:bg-red-50',
  // Cell biology
  'cell biology': 'hover:bg-green-50',
  // Chemicals & Drugs
  'chemicals & drugs': 'hover:bg-orange-50',
  // Medical devices
  'medical devices': 'hover:bg-purple-50',
  // Medical Conditions
  'medical conditions': 'hover:bg-blue-50',
  // Genetics and Mutation
  genetics: 'hover:bg-green-50',
  // Medical Procedures
  'medical procedures': 'hover:bg-violet-50',
  // Species & Viruses
  'species & viruses': 'hover:bg-cyan-50',
  // Context
  context: 'hover:bg-grey-50',
  unassigned: 'hover:bg-grey-50'
};

//Annotation Text Styles
//NOTE: Text and BG are seperated due to rejected state having "text-black" class override
export const annTextStyles = {
  // Anatomy & Physiology
  'anatomy & physiology': 'text-red-500',
  // Cell biology
  'cell biology': 'text-green-cellBiology',
  // Chemicals & Drugs
  'chemicals & drugs': 'text-orange-500',
  // Medical devices
  'medical devices': 'text-purple-500',
  // Medical Conditions
  'medical conditions': 'text-blue-500',
  // Genetics and Mutation
  genetics: 'text-green-500 hover:text-green-600',
  // Medical Procedures
  'medical procedures': 'text-violet-500',
  // Species & Viruses
  'species & viruses': 'text-cyan-500',
  // Context
  context: 'text-grey-500'
};

//Annotation text-decoration styles for things like strikethroughs
export const annDecorationStyles = {
  // Anatomy & Physiology
  'anatomy & physiology': 'decoration-color-red-500',
  // Cell biology
  'cell biology': 'decoration-color-green-cellBiology',
  // Chemicals & Drugs
  'chemicals & drugs': 'decoration-color-orange-500',
  // Medical devices
  'medical devices': 'decoration-color-purple-500',
  // Medical Conditions
  'medical conditions': 'decoration-color-blue-500',
  // Genetics and Mutation
  genetics: 'decoration-color-green-600',
  // Medical Procedures
  'medical procedures': 'decoration-color-violet-500',
  // Species & Viruses
  'species & viruses': 'decoration-color-cyan-500',
  // Context
  context: 'decoration-color-grey-500'
};

//Activate Annotation Styles
export const annActiveStyles = {
  // Anatomy & Physiology
  'anatomy & physiology': 'border-red-500 bg-red-50',
  // Cell biology
  'cell biology': 'border-green-cellBiology bg-green-50',
  // Chemicals & Drugs
  'chemicals & drugs': 'border-orange-500 bg-orange-50',
  // Medical devices
  'medical devices': 'border-purple-500 bg-purple-50',
  // Medical Conditions
  'medical conditions': 'border-blue-500 bg-blue-50',
  // Genetics and Mutation
  genetics: 'border-green-600 bg-green-50',
  // Medical Procedures
  'medical procedures': 'border-violet-500 bg-violet-50',
  // Species & Viruses
  'species & viruses': 'border-cyan-500 bg-cyan-50',
  // Context
  context: 'border-grey-500 bg-grey-50'
};

export const statusStyles = {
  ACCEPTED: {
    bg: 'bg-green-400',
    text: 'text-green-400'
  },
  REJECTED: {
    bg: 'bg-red-600',
    text: 'text-red-600'
  },
  NOT_REVIEWED: {
    bg: 'bg-transparent',
    text: 'text-white'
  }
};
