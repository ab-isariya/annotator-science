import {API_ENDPOINT} from '@config';
import {toast} from 'react-toastify';

/**
 * Downloads the binary file associated with a document
 * for the user to save to their local device.
 *
 * @param {Object} document (id, filename)
 * @param {Object} user - {user_id}
 */
//NOT CURRENTLY USED
export const downloadDocumentFile = async ({id, filename}, user_id, accessToken) => {
  try {
    const res = await fetch(
      `${API_ENDPOINT}/documents/${id}/file?user_id=${user_id}`,
      {
        method: 'GET',
        Authorization: `Bearer ${accessToken}`
      }
    );
  
    const blob = await res.blob(); //Convert file blob from AWS
    const url = window.URL.createObjectURL(blob); //Create downloadable stream
    const link = document.createElement('a'); //Create fake link for downloading
    link.href = url;
    link.setAttribute('download', `${filename}`);
    document.body.appendChild(link);
    link.click(); //Simulate click to open dialogue.
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link); //Destroy blob and anchor link from body
  }
  catch(e) 
  {
    toast.error('There was an error with your request. Please try again.');
  }
};

/**
 * Retrieves list of documents for a given user
 *
 * @param {String} endpoint
 * @param {Object} requestData - {userID, accessToken, docID}
 * @return {Promise<any>}
 */
export const getDocument = async (endpoint, document_id, user_id, accessToken) => {
  try {
    const res = await fetch(
      `${API_ENDPOINT}${endpoint}/${document_id}?user_id=${user_id}`,
      {
        headers: {
          Authorization: accessToken
        },
        method: 'GET'
      }
    );
  
    return await res.json();
  }
  catch(e)
  {
    toast.error('There was an error with your request. Please try again.');
  }
};

/**
 * Retrieves list of documents for a given user
 *
 * @param {String} endpoint
 * @param {Object} userData - {id and accessToken}
 *
 * @return {Promise<any>}
 */
export const getDocumentList = async (endpoint, accessToken, user_id) => {
  let res = [];
  try {
    res = await fetch(`${API_ENDPOINT}${endpoint}?user_id=${user_id}`, {
      headers: {
        Authorization: accessToken
      },
      method: 'GET'
    });

    res = await res.json();
  
    if (res.Code && res.Code === 'BadRequestError')
    {
      throw 'Error';
    }
  }
  catch(e)
  {
    toast.error('There was an error with your request. Please try again.');
    throw e; 
  }

  return res;
};

/**
 * 1) Upload document by first sending a request to /document/upload
 * to get back an S3 presigned URL for uploading a binary.
 *
 * 2) Build form data in the form that S3 expects and upload the file
 *    (see this for more: https://www.webiny.com/blog/upload-files-to-aws-s3-using-pre-signed-post-data-and-a-lambda-function-7a9fb06d56c1)
 *
 * 3) Commit the file in our backend to kickstart the processing pipeline.
 *
 * @param {Array} acceptedFiles
 * @param {Object} user (id, accessToken)
 *
 * @return {Object} post upload document data to provide to ui
 */
export const uploadDocument = async (
  acceptedFiles,
  user_id, 
  accessToken
) => {
  const uploadedFile = acceptedFiles[0];
  const file_name = uploadedFile.name;
  const file_size = uploadedFile.size;
  const file_type = uploadedFile.type;

  try {
    //Get a presigned url for document upload to S3
    const presignedURLRes = await fetch(`${API_ENDPOINT}/document/upload`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken
      },
      method: 'POST',
      body: JSON.stringify({
        file_name,
        file_type,
        file_size,
        user_id
      })
    });

    const {fields, doc_id, url} = await presignedURLRes.json();

    //NOTE(Rejon): Must be formdata or the S3 upload will not accept the data blob.
    const formData = new FormData();

    //Append the data from our presignedURL response to the formdata
    Object.keys(fields).forEach((key) => {
      formData.append(key, fields[key]);
    });

    // Actual file has to be appended last.
    formData.append('file', uploadedFile);

    //Upload new file to S3 Bucket
    await fetch(`${url}`, {
      method: 'POST',
      body: formData
    });

    //Commit document to lambda for processing
    //TODO(Rejon): This needs to return the document object.
    const postUpload = await fetch(
      `${API_ENDPOINT}/document/${doc_id}/commit?user_id=${user_id}`,
      {
        method: 'GET',
        headers: {
          Authorization: accessToken
        }
      }
    );

    //Return new document object
    return await postUpload.json();
  } catch (err) {
    toast.error('There was an error with your request. Please try again.');
    throw err;
  }
};

/**
 * Query Annotations based on a given query object.
 * See this for more info: https://github.com/ScienceIO/tat-api/pull/20
 * We follow the sqlalchemy-filters filter format: https://github.com/juliotrigo/sqlalchemy-filters#filters-format
 *
 * @param {String} document_id
 * @param {Object} queryObj
 * @param {String} user_id
 * @param {String} accessToken
 *
 * @return {Array} results (array of annotations from query)
 */
export const queryAnnotations = async (
  document_id,
  queryObj,
  user_id,
  accessToken
) => {
  try {
    const res = await fetch(
      `${API_ENDPOINT}/document/${document_id}/annotations`,
      {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id,
          ...queryObj
        }),
        method: 'POST'
      }
    );
    const data = await res.json();
  
    return data.results;
  }
  catch(e)
  {
    toast.error('There was an error with your request. Please try again.');
  }
};

/**
 * Delete a specific document for a given user.
 *
 * @param {string} document_id
 * @param {Object} user (id, accessToken)
 *
 * @return {string} response text
 */
export const deleteDocument = async (
  document_id,
  user_id, 
  accessToken
) => {
  try {
    const res = await fetch(`${API_ENDPOINT}/document/${document_id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken
      },
      body: JSON.stringify({
        user_id
      }),
      method: 'DELETE'
    });
  
    return res.ok;
  }
  catch(e)
  {
    toast.error('There was an error with your request. Please try again.');
  }
};

/**
 * Delete all documents for a given user.
 *
 * @param {string} user_id
 * @param {string} accessToken
 *
 * @return {string} response text
 */
//NOT CURRENTLY USED
export const deleteAllDocuments = async (user_id, accessToken) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/documents?user_id=${user_id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken
      },
      method: 'DELETE'
    });
  
    return await response.text();
  }
  catch(e)
  {
    toast.error('There was an error with your request. Please try again.');
  }
};

/**
 * Updates annotation data based on what's provided.
 *
 * If an annotation has a status of MANUAL it will update
 * canonical_id, canonical_name, tag, and entity_p if
 * they're provided in the body.
 *
 * @param {string} user_id
 * @param {string} accessToken
 * @param {integer} doc_id
 * @param {Array} annotations
 *
 * @return {Object} annotations (the updated annotation array), aggregations (new aggregation data based on update)
 */
export const updateAnnotation = async (
  user_id,
  accessToken,
  doc_id,
  annotations
) => {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/document/${doc_id}/annotation`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessToken
        },
        body: JSON.stringify({
          user_id,
          doc_id,
          annotations
        }),
        method: 'PUT'
      }
    );
  
    return await response.json();
  }
  catch(e)
  {
    toast.error('There was an error with your request. Please try again.');
  }
};

export const getLinker = async (query, accessToken) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/linker?q=${encodeURI(query)}`, {
      headers: {
        Authorization: accessToken
      },
      method: 'GET'
    });
  
    return await response.json();
  }
  catch(e)
  {
    toast.error('There was an error with your request. Please try again.');
  }
};

export const addAnnotations = async (
  user_id,
  accessToken,
  doc_id,
  annotations
) => {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/document/${doc_id}/annotation`,
      {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id,
          doc_id,
          annotations
        }),
        method: 'POST'
      }
    );
  
    return await response.json();
  }
  catch(e)
  {
    toast.error('There was an error with your request. Please try again.');
  }
};
