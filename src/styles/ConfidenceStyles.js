import {ReactComponent as VeryHigh} from '@assets/svgs/confidence/VeryHigh.svg';
import {ReactComponent as High} from '@assets/svgs/confidence/High.svg';
import {ReactComponent as Moderate} from '@assets/svgs/confidence/Moderate.svg';
import {ReactComponent as Low} from '@assets/svgs/confidence/Low.svg';
import {ReactComponent as VeryLow} from '@assets/svgs/confidence/VeryLow.svg';

const confidenceStyles = {
  very_high: {
    activeBg: 'green-50',
    activeBorder: 'green-500',
    hoverBg: 'green-50',
    textColor: 'green-700',
    icon: <VeryHigh />
  },
  high: {
    //TODO(Rejon): Bg was 70% opacity of green-50. Color will need to be updated in the future.
    activeBg: 'green-50',
    activeBorder: 'green-500',
    hoverBg: 'green-50',
    textColor: 'green-700',
    icon: <High />
  },
  moderate: {
    activeBg: 'yellow-50',
    activeBorder: 'yellow-500',
    hoverBg: 'yellow-50',
    textColor: 'yellow-500',
    icon: <Moderate />
  },
  low: {
    //TODO(Rejon): Figma did not show bar. Bg is a guesstimate.
    activeBg: 'orange-50',
    activeBorder: 'orange-500',
    hoverBg: 'orange-50',
    textColor: 'orange-500',
    icon: <Low />
  },
  very_low: {
    activeBg: 'red-50',
    activeBorder: 'red-500',
    hoverBg: 'red-50',
    textColor: 'red-500',
    icon: <VeryLow />
  }
};

export default confidenceStyles;
