const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const cds = require('@sap/cds')
const cap_dox_key = cds.env.cap_dox_key;
const { Readable } = require('stream');

module.exports = {
    post_pdf: async function(pdf,fileName) {
        let mydata = new FormData();
        fileName = './' + fileName;

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
        await createPdfFile(pdf, fileName);
        mydata.append('file', fs.createReadStream(fileName));
        
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: cap_dox_key.uaa.url + '/oauth/token?grant_type=client_credentials',
            headers: { 
              'Authorization': 'Basic ' + Buffer.from(cap_dox_key.uaa.clientsecret + ':' + cap_dox_key.uaa.clientid).toString('base64'),
              'Accept': 'application/json'
            }
            // ,data : mydata
          };

        let access_token = '';
        access_token = await axios.request(config)
          .then((response) => {
            let json_data = JSON.stringify(response.data)
            console.log('Oauth Token Fetched------------------>')
            console.log(JSON.stringify(response.data.access_token));
            return response.data.access_token;
          })
          .catch((error) => {
            console.log(error);
        });

        

        return 'Bearer' + access_token;
    }
}