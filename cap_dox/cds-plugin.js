const cds = require('@sap/cds')
let cap_doxlib = require('./lib_cap_dox')

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
          const { log } = require("console");
          // srv.before('CREATE', entity, async data => {
          srv.after('READ', entity, async data => {
            log("Starting CAP_DOX Extraction ")
            let auth_token = await cap_doxlib.get_token();
            let dox_output = await cap_doxlib.post_job(data.data.pdf, data.data.fileName, auth_token);
            // console.log(dox_output);
            // log("DATA ", data)

            // log('---------------------')
            // log("Recipe>> ", data)
            // log('---------------------')
            // log("RecipeIngredients>> ")
            
            // let dox_output = ''
            await cap_doxlib.entity_mapping(dox_output, entity)
          })
        }
      }
    }
  })