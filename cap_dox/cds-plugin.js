const cds = require('@sap/cds')
let cap_doxlib = require('./lib_cap_dox')

cds.once('served', async () => {
    for (let srv of cds.services) {
      for (let entity of srv.entities) {
        const cap_doxelements = []
        for (const key in entity.elements) {
          const element = entity.elements[key]
          // check if there is an annotation called cap_dox on the element
          if (element['@cap_dox']) cap_doxelements.push(element.recipe_name)
        }
        if (cap_doxelements.length) {
          srv.before('CREATE', entity, async data => {
            log("B.Trying to Build CAP_DOX Plugin " + cap_doxelements.length)
            let dox_output = await cap_doxlib.post_pdf(data.data.pdf, data.data.fileName)
            console.log(dox_output);

            // data.data.cap_doxid = cap_dox_id
          })
        }
      }
    }
  })