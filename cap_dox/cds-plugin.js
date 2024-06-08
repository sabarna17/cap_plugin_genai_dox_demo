const cds = require('@sap/cds')
// console.log('-----------------------')
// console.log(cds.env)
// console.log('-----------------------')
let cap_doxlib = require('./lib_cap_dox')


cds.once('served', async () => {
    // go through all services
    for (let srv of cds.services) {
      // go through all entities
      for (let entity of srv.entities) {
        // go through all elements in the entity and collect those with @cap_dox annotation
        const cap_doxelements = []
        // console.log(entity)
        for (const key in entity.elements) {
          const element = entity.elements[key]
          // check if there is an annotation called cap_dox on the element
          if (element['@cap_dox']) cap_doxelements.push(element.recipe_name)
        }
        if (cap_doxelements.length) {
          console.log("A.Trying to Build CAP_DOX Plugin " + cap_doxelements.length)
          srv.before('CREATE', entity, async data => {
            console.log("B.Trying to Build CAP_DOX Plugin " + cap_doxelements.length)
            let cap_dox_id = await cap_doxlib.post_pdf(data.data.pdf, data.data.fileName)
            console.log(cap_dox_id)
            // data.data.cap_doxid = cap_dox_id
          })
        }
      }
    }
  })