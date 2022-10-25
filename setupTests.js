// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import React from 'react';
import '@testing-library/jest-dom';
import {configure, shallow, render, mount} from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';
import 'jest-prop-type-error';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

global.localStorage = localStorageMock;

require('jest-fetch-mock').enableMocks();

configure({adapter: new Adapter()});

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;

React.useLayoutEffect = React.useEffect;
