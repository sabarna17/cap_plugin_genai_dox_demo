sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'capplugingenaidoxdemo',
            componentId: 'RecipeIngredientsObjectPage',
            contextPath: '/Recipe/ingredients'
        },
        CustomPageDefinitions
    );
});