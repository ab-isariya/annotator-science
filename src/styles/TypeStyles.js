import {colors} from '@ui/theme';

import {ReactComponent as AnatomyPhysiology} from '@assets/svgs/types/anatomy_physiology.svg';
import {ReactComponent as CellBiology} from '@assets/svgs/types/cell_biology.svg';
import {ReactComponent as ChemicalsDrugs} from '@assets/svgs/types/chemicals_drugs.svg';
import {ReactComponent as Context} from '@assets/svgs/types/context.svg';
import {ReactComponent as Genetics} from '@assets/svgs/types/genetics.svg';
import {ReactComponent as MedicalConditions} from '@assets/svgs/types/medical_conditions.svg';
import {ReactComponent as MedicalDevices} from '@assets/svgs/types/medical_devices.svg';
import {ReactComponent as MedicalProcedures} from '@assets/svgs/types/medical_procedures.svg';
import {ReactComponent as SpeciesViruses} from '@assets/svgs/types/species_viruses.svg';
import {ReactComponent as QuestionMark} from '@assets/svgs/types/Unassigned.svg';

//NOTE(Rejon): hexTextColor is used on instances where we need to export the colors using HEX values.
//             ie. The colors for the annotation excel table.
const typeStyles = {
  // Anatomy & Physiology
  'anatomy & physiology': {
    activeBg: 'red-50',
    activeBorder: 'red-500',
    hoverBg: 'red-50',
    textColor: 'red-500',
    hexTextColor: colors.red['500'],
    icon: <AnatomyPhysiology />,
    label: 'Anatomy & Physiology'
  },
  // Cell biology
  'cell biology': {
    activeBg: 'green-50',
    activeBorder: 'green-cellBiology',
    hoverBg: 'green-50',
    textColor: 'green-cellBiology',
    hexTextColor: colors.cellBiology,
    icon: <CellBiology />,
    label: 'Cell Biology'
  },
  // Chemicals & Drugs
  'chemicals & drugs': {
    activeBg: 'orange-50',
    activeBorder: 'orange-500',
    hoverBg: 'orange-50',
    textColor: 'orange-500',
    hexTextColor: colors.orange['500'],
    icon: <ChemicalsDrugs />,
    label: 'Chemicals & Drugs'
  },
  // Medical devices
  'medical devices': {
    activeBg: 'purple-50',
    activeBorder: 'purple-500',
    hoverBg: 'purple-50',
    textColor: 'purple-500',
    hexTextColor: colors.purple['500'],
    icon: <MedicalDevices />,
    label: 'Medical Devices'
  },
  // Medical Conditions
  'medical conditions': {
    activeBg: 'blue-50',
    activeBorder: 'blue-500',
    hoverBg: 'blue-50',
    textColor: 'blue-500',
    hexTextColor: colors.blue['500'],
    icon: <MedicalConditions />,
    label: 'Medical Conditions'
  },
  // Genetics and Mutation
  genetics: {
    activeBg: 'green-50',
    activeBorder: 'green-500',
    hoverBg: 'green-50',
    textColor: 'green-500',
    textColorHover: 'green-600',
    hexTextColor: colors.green['500'],
    icon: <Genetics />,
    label: 'Genetics'
  },
  // Medical Procedures
  'medical procedures': {
    activeBg: 'purple-50',
    activeBorder: 'purple-500',
    hoverBg: 'purple-50',
    textColor: 'violet-500',
    hexTextColor: colors.violet['500'],
    textColorHover: null,
    icon: <MedicalProcedures />,
    label: 'Medical Procedures'
  },
  // Species & Viruses
  'species & viruses': {
    activeBg: 'cyan-50',
    activeBorder: 'cyan-500',
    hoverBg: 'cyan-50',
    textColor: 'cyan-500',
    hexTextColor: colors.cyan['500'],
    textColorHover: null,
    icon: <SpeciesViruses />,
    label: 'Species & Viruses'
  },
  // Context
  context: {
    activeBg: 'grey-50',
    activeBorder: 'grey-500',
    hoverBg: 'grey-50',
    textColor: 'grey-500',
    hexTextColor: colors.grey['500'],
    textColorHover: null,
    icon: <Context />,
    label: 'Context'
  },
  // ToDo: remove later, it is removed
  unassigned: {
    activeBg: 'grey-50',
    activeBorder: 'grey-500',
    hoverBg: 'grey-50',
    textColor: 'grey-500',
    hexTextColor: colors.grey['500'],
    textColorHover: null,
    icon: <QuestionMark width="16" height="16" className="text-grey-500" />,
    label: 'Unassigned'
  }
};

export default typeStyles;
