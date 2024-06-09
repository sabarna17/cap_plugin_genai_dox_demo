const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const cds = require('@sap/cds')
const { Readable } = require('stream');
const { log } = require("console");
const cap_dox_key = cds.env.cap_dox_key
const cap_dox_map = cds.env.cap_dox_map

async function createPdfFile(pdfBuffer, outputPath) {
  return new Promise((resolve, reject) => {
    fs.writeFile(outputPath, pdfBuffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(outputPath);
      }
    });
  });
}

async function setbody(pdf,fileName){
  let mydata = new FormData();
  fileName = './' + fileName;
  await createPdfFile(pdf, fileName);
  mydata.append('file', fs.createReadStream(fileName));  
  mydata.append('options', JSON.stringify(cap_dox_map, null, 2) )
  log(mydata)
  return mydata
}

async function get_token(){
  var basic_auth = cap_dox_key.uaa.clientid + ':' + cap_dox_key.uaa.clientsecret
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: cap_dox_key.uaa.url + '/oauth/token?grant_type=client_credentials',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(basic_auth).toString('base64'),
      'Accept': 'application/json'
    }
  };

  let access_token = '';
  access_token = await axios.request(config)
    .then((response) => {
      console.log('Oauth Token Fetched')
      return response.data.access_token;
    })
    .catch((error) => {
      log(error);
    });
  return 'Bearer ' + access_token;
}

async function post_job(pdf,fileName,auth_token){
  // PDF file store in local
  var job_data = await setbody(pdf,fileName);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: cap_dox_key.endpoints.backend.url +  cap_dox_key.swagger + 'document/jobs',
    headers: { 
      'Authorization': auth_token,
      'Accept': 'application/json'
    },
    data : job_data
  };

  let job_id = '';
  job_id = await axios.request(config)
    .then((response) => {
      log('JOB Post ID: ------------------>')
      log(JSON.stringify(response.data.id));
      return response.data.id;
    })
    .catch((error) => {
      log(error);
    });
  return job_id;
}

async function get_job_status(job_id, auth_token){
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: cap_dox_key.endpoints.backend.url +  cap_dox_key.swagger + 'document/jobs/' + job_id,
    headers: { 'Authorization': auth_token }
  };

  var retry_count = 0;
  for(;;)
  {
    var job_details = await axios.request(config)
    .then((response) => {
      log('JOB Status Data: ------------------>')
      log(JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      log(error);
    });
    var job_status = job_details.status;
    if(job_status){
      if(job_status === 'DONE'){
        return job_details
      }
      else{
        // await setTimeout(1000);
        retry_count = retry_count + 1;
        if(retry_count > 20){
          return job_details
        }
      }
    }
  }
}

module.exports = {
  post_pdf: async function (pdf, fileName) {
    // GET latest Oauth2.0 token
    var auth_token = await get_token();
    // POST document and fetch data from schema
    var job_details = await post_job(pdf, fileName, auth_token);
    return job_details;
  },
  get_job_status: await get_job_status(job_id, auth_token),
  get_token: await get_token(),
  

}