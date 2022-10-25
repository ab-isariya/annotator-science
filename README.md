# Annotate-client

This is the React Annotate App. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Overview

Staging site: https://staging.annotate.science.io

Stack: [AnnotateStack-staging](https://github.com/ScienceIO/tat-api/blob/staging/cdk/app.py#L36-L42) 

## How to run

First, install all dependencies with `yarn`. If you find an error during installation, try upgrading pip.

`yarn start` will start a development version 

By default, this app will run with the `staging` stack, as set in [config.js](https://github.com/ScienceIO/annotate-client/blob/staging/src/modules/utils/config.js) 

```javascript
export const ENVIRONMENT = 'staging';
export const API_ENDPOINT =
  process.env.REACT_APP_ENDPOINT ||
  `https://annotate.aws.science.io/${ENVIRONMENT}`;
```

If you want to develop locally (for example while running `chalice local` in one of the APIs), set `REACT_APP_ENDPOINT="http://localhost:8000"` in `.env.local` (in the root directory of this repo). 

### Useful Scripts

In the project directory, you can run:

* `yarn start`

  Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

  The page will reload if you make edits.\
You will also see any lint errors in the console.

* `yarn build`

  Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

  The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
