using { genai_dox_recipe as my } from '../db/schema';

@path : '/service/genai_dox_recipe'
service genai_dox_recipe_srv 
{
    @odata.draft.enabled
    entity Recipe as projection on my.Recipe;
    // @odata.draft.enabled
    entity RecipeIngredients as projection on my.RecipeIngredients;
}

annotate my.Recipe with {
  pdf @cap_dox;
};
