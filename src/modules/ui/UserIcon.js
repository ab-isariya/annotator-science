import {forwardRef} from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';
import {useOktaAuth} from '@okta/okta-react';

import Stack from '@modules/ui/Stack';
import {useUser} from '@user';

import {ReactComponent as Dashboard} from '@assets/svgs/Dashboard.svg';
import {ReactComponent as Help} from '@assets/svgs/Help.svg';
import {ReactComponent as Logout} from '@assets/svgs/Logout.svg';
import {ReactComponent as User} from '@assets/svgs/User.svg';

const UserIcon = forwardRef(({canShowDropdown, onClick, children}, ref) => {
  const {data: user} = useUser();
  const {oktaAuth} = useOktaAuth();

  const dropdown = (
    // z-50 class is not working
    <div
      className="absolute left-0 w-60 rounded-md shadow-sm bg-white"
      style={{zIndex: 100}}>
      <div
        className=""
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu">
        <Link to="/" role="menuitem">
          <div className="flex items-center space-x-2.5 p-2.5 hover:bg-grey-50">
            <Dashboard /> <div>ScienceIO Dashboard</div>
          </div>
        </Link>

        <Link to="/" role="menuitem">
          <div className="flex items-center space-x-2.5 p-2.5 hover:bg-grey-50">
            <Help /> <div>Help</div>
          </div>
        </Link>

        <div
          className="flex items-center space-x-2.5 p-2.5 hover:bg-grey-50"
          onClick={() => {
            oktaAuth.signOut('/');
            location.reload();
          }}>
          <Logout />
          <div>Logout</div>
        </div>
      </div>
    </div>
  );

  const email = user?.primary_email;

  if (!email)
  {
    return (
      <></>
    );
  }

  return (
    <div className="flex space-x-2.5 items-center">
      {/* TODO BUG: without style, this div is taller than icon */}
      <div className="relative" ref={ref} style={{height: '45px'}}>
        <Stack className={onClick ? 'cursor-pointer' : ''} onClick={onClick}>
          <User />
          <span className="text-base capitalize">
            {email.charAt(0) || ''}
          </span>
        </Stack>
        {canShowDropdown && dropdown}
      </div>

      <div className="text-base capitalize">
        <span className="font-light">{email.split('@')[0]}</span>
        <br />
        {children}
      </div>
    </div>
  );
});

UserIcon.displayName = 'UserIcon';

UserIcon.propTypes = {
  /** Dropdown component to display when clicking on icon */
  canShowDropdown: PropTypes.bool,
  /** Function to trigger display of dropdown component */
  onClick: PropTypes.func,
  //React node children
  children: PropTypes.node
};

export default UserIcon;
