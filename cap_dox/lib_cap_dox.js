const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const cds = require('@sap/cds')
const { Readable } = require('stream');
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
  mydata.append('options', str(cap_dox_map))
  return mydata
}

async function get_token(){
  var basic_auth = cap_dox_key.uaa.clientid + ':' + cap_dox_key.uaa.clientsecret
  console.log(basic_auth)
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
      // let json_data = JSON.stringify(response.data)
      console.log('Oauth Token Fetched')
      // console.log(JSON.stringify(response.data.access_token));
      return response.data.access_token;
    })
    .catch((error) => {
      console.log(error);
    });
  return 'Bearer' + access_token;
}

async function post_job(job_data, auth_token){
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
      // let json_data = JSON.stringify(response.data)
      console.log('JOB Post ID: ------------------>')
      console.log(JSON.stringify(response.data.id));
      return response.data.id;
    })
    .catch((error) => {
      console.log(error);
    });
  return job_id;
}

async function get_job_status(job_id){

}

module.exports = {
  post_pdf: async function (pdf, fileName) {
    
    // PDF file store in local
    var job_data = await setbody(pdf,fileName);
    // GET latest Oauth2.0 token
    var auth_token = await get_token();
    // POST document and fetch data from schema
    var job_id = await post_job(job_data, auth_token);
    // Assign SAP AI-DOX extracted data to the CDS ODATA Service entities
    
  }
}