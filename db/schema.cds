namespace genai_dox_recipe;

using { managed, cuid } from '@sap/cds/common';

entity Recipe : cuid, managed {
  @mandatory
  recipe_name  : String;
  portions: String;
  @mandatory
  pdf : Binary @Core.MediaType : 'pdf' @Core.ContentDisposition.Filename : fileName;
  fileName : String(80) default 'recipe.pdf';
  ingredients: Composition of many RecipeIngredients on ingredients.recipe.ID = $self.ID;
}

entity RecipeIngredients : cuid,managed {
  recipe  : Association to Recipe;
  @mandatory
  ingredients  : String;
  portions: String;

}