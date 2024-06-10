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
          
          srv.on('ai_dox_extract', entity, async data => {
          // srv.before('CREATE', entity, async data => {
            
            //   // ID: 'aaf44057-381f-430b-9f1d-91cfdb30d0b6',
              data.data.recipe_name = 'Chicken Sweetcorn Quesadillas';
              data.data.portions = '24 Wedges'
            //   // pdf: <Buffer 25 50 44 46 2d 31 2e 37 0a 0a 34 20 30 20 6f 62 6a 0a 3c 3c 0a 2f 42 69 74 73 50 65 72 43 6f 6d 70 6f 6e 65 6e 74 20 38 0a 2f 43 6f 6c 6f 72 53 70 61 ... 189109 more bytes>,
            //   // fileName: '1_Chicken Sweetcorn Quesadillas.pdf',
              data.data.ingredients = [
                {
                "ingredients": "Alu",
                "quantity": "1kg",
                "alhua": "1 time"
                },
                {
                  "ingredients": "Chicken",
                  "quantity": "2kg"
                },
                {
                  "ingredients": "Onion",
                  "quantity": "1kg"
                }                
              ]
            // }            

            // data.data = await cap_doxlib.entity_mapping_head(dox_output.extraction.headerFields, data.data)
            // data.data = await cap_doxlib.entity_mapping_item(dox_output.extraction.lineItems, data.data)


            // console.log(data.data)
            // log("Starting CAP_DOX Extraction ")
            // let auth_token = await cap_doxlib.auth_token();
            // let job_id = await cap_doxlib.post_job(data.data.pdf, data.data.fileName, auth_token);
            // let dox_output = await cap_doxlib.get_job_status(job_id, auth_token);
            // try{
            //   if(dox_output.status==='DONE'){
            //     data.data = await cap_doxlib.entity_mapping_head(dox_output.extraction.headerFields, data.data)
            //     data.data = await cap_doxlib.entity_mapping_head(dox_output.extraction.lineItems, data.data)
            //   }
            // }
            // catch{
            //   log('something happened')
            // }
          })
        }
      }
    }
  })