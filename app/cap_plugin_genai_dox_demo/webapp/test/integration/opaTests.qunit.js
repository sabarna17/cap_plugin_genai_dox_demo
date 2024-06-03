sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'capplugingenaidoxdemo/test/integration/FirstJourney',
		'capplugingenaidoxdemo/test/integration/pages/RecipeList',
		'capplugingenaidoxdemo/test/integration/pages/RecipeObjectPage',
		'capplugingenaidoxdemo/test/integration/pages/RecipeIngredientsObjectPage'
    ],
    function(JourneyRunner, opaJourney, RecipeList, RecipeObjectPage, RecipeIngredientsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('capplugingenaidoxdemo') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheRecipeList: RecipeList,
					onTheRecipeObjectPage: RecipeObjectPage,
					onTheRecipeIngredientsObjectPage: RecipeIngredientsObjectPage
                }
            },
            opaJourney.run
        );
    }
);