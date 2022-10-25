import {ToastContainer, Zoom} from 'react-toastify';

const Toast = () => {
  const typeClasses = {
    default: 'bg-grey-800',
    success: 'bg-blue-600',
    info: 'bg-grey-800',
    error: 'bg-red-600',
    warning: 'bg-orange-400',
    dark: 'bg-white-600 font-gray-300'
  };

  /**
   * Type comes from the toast call: toast.info is type=info
   * @param type
   * @return {string} - tailwind classes to apply
   */
  const toastTailwindClasses = ({type}) => {
    return (
      typeClasses[type || 'default'] +
      ' relative flex p-1 rounded-md justify-between overflow-hidden cursor-pointer'
    );
  };

  return (
    <ToastContainer
      toastClassName={toastTailwindClasses}
      className="p-0"
      position="bottom-center"
      transition={Zoom}
      progressClassName={'bg-holofoil'}
      // Notifications will be displayed as soon as a slot is free.
      limit={1}
      style={{width: 'auto'}}
      // Alerts include their own close button, and it works
      closeButton={false}
    />
  );
};

export default Toast;
