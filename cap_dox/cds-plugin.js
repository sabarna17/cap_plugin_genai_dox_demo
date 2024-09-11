const cds = require('@sap/cds')
let cap_doxlib = require('./lib_cap_dox')
const { log } = require("console");
cds.once('served', async () => {
    var dox_data = {
      'headers': [],
      'items': []
    }
      
    for (let srv of cds.services) {
      for (let entity of srv.entities) {
        const cap_doxelements = []
        for (const key in entity.elements) {
          const element = entity.elements[key]
          // check if there is an annotation called cap_dox on the element
          if (element['@cap_dox']) cap_doxelements.push(element)
        }

        if (cap_doxelements.length) {
          
          srv.before('CREATE', entity, async data => {
          console.log(data.data)
          log("Starting CAP_DOX Extraction ")
          let auth_token = await cap_doxlib.auth_token();
          let job_id = await cap_doxlib.post_job(data.data.pdf, data.data.fileName, auth_token);
          let dox_output = await cap_doxlib.get_job_status(job_id, auth_token);
          try{
              if(dox_output.status==='DONE'){
                  data.data = await cap_doxlib.entity_mapping_head(dox_output.extraction.headerFields, data.data)
                  data.data = await cap_doxlib.entity_mapping_head(dox_output.extraction.lineItems, data.data)
               }
           }
           catch{
              log('something happened')
           }
          })
        }
      }
    }
  })
