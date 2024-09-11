const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const cds = require('@sap/cds')
const { Readable } = require('stream');
const { log } = require("console");
const cap_dox_key = cds.env.cap_dox_key
const cap_dox_config = cds.env.cap_dox_config

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

async function setbody(pdf,fileName,auth_token){
  let mydata = new FormData();
  fileName = './' + fileName;
  await createPdfFile(pdf, fileName);
  mydata.append('file', fs.createReadStream(fileName));  
  cap_dox_job = {
    "schemaId": await get_schema(auth_token),
    "clientId":cap_dox_config.clientId,
    "documentType": cap_dox_config.documentType
  }
  mydata.append('options', JSON.stringify(cap_dox_job, null, 2) )
  // log(mydata)
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

async function get_schema(auth_token){
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: cap_dox_key.endpoints.backend.url +  cap_dox_key.swagger + 'schemas?clientId=' + cap_dox_config.clientId,
    headers: {
      'Authorization': auth_token,
      'Accept': 'application/json'
    }
  };

  let schemaId = '';
  schemaId = await axios.request(config)
    .then((response) => {
      for (let item of response.data.schemas){
        // log('------------',item,'-------------',item.documentType)
        if((item.name === cap_dox_config.schemaName) && (item.documentType === cap_dox_config.documentType)) {
          return item.id;
        } 
      }
    })
    .catch((error) => {
      log(error);
  });
  log('Schema ID: ', schemaId)
  return schemaId;
}

async function post_job(pdf,fileName,auth_token){
  // PDF file store in local
  var job_data = await setbody(pdf,fileName,auth_token);
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
        // await setTimeout(() =>{ console.log('5 seconds have passed!'); }, 5000);
        retry_count = retry_count + 1;
        if(retry_count > 100){
          return job_details
        }
      }
    }
  }
}

async function entity_mapping_head_def(headerFields, entity){
  for(let item of headerFields){
    entity[item.name] = item.rawValue
  }
  return entity
}

async function entity_mapping_item_def(lineItems, entity){
  let ingredients = [];
  let ingredient = {};
  for(let item of lineItems){
    for(let item_properties of item){
      ingredient[item_properties.name] = item_properties.rawValue
    }
    ingredients.push(ingredient)
  }
  entity.ingredients = ingredients
  // log(entity)
  return entity
}

module.exports = {  
  auth_token: async function() { 
    return await get_token();
  },
  schema_id: async function(){
    return await get_schema();
  },
  post_job: async function(pdf, fileName, auth_token){
    return await post_job(pdf, fileName, auth_token)
  },
  get_job_status: async function(job_id, auth_token){
    return await get_job_status(job_id, auth_token);
  }, 
  entity_mapping_head: async function(dox_output, entity) {
    return await entity_mapping_head_def(dox_output, entity)
  },
  entity_mapping_item: async function(dox_output, entity) {
    return await entity_mapping_item_def(dox_output, entity)
  }  
}
