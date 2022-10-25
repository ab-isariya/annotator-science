export const ENVIRONMENT = 'v1';
export const API_ENDPOINT =
  process.env.REACT_APP_ENDPOINT ||
  `https://annotate.aws.science.io/${ENVIRONMENT}`;
