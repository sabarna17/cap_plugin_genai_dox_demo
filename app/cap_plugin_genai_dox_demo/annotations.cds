using genai_dox_recipe_srv as service from '../../srv/service';
annotate service.Recipe with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'recipe_name',
                Value : recipe_name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'portions',
                Value : portions,
            },
            {
                $Type : 'UI.DataField',
                Label : 'pdf',
                Value : pdf,
            },
            {
                $Type : 'UI.DataField',
                Label : 'fileName',
                Value : fileName,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Detailed Steps',
            ID : 'DetailedSteps',
            Target : '@UI.FieldGroup#DetailedSteps',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Ingredients',
            ID : 'Ingredients',
            Target : 'ingredients/@UI.LineItem#Ingredients',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Recipe Name',
            Value : recipe_name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Portions',
            Value : portions,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Recipe Pdf',
            Value : pdf,
        },
        {
            $Type : 'UI.DataField',
            Label : 'File Name',
            Value : fileName,
        },
    ],
    UI.FieldGroup #DetailedSteps : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : detailed_steps,
                Label : 'Detailed Steps',
            },
        ],
    },
);

annotate service.RecipeIngredients with @(
    UI.LineItem #Ingredients : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
        },
        {
            $Type : 'UI.DataField',
            Value : ingredient,
            Label : 'ingredient',
        },]
);
annotate service.RecipeIngredients with @(
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'General Information',
            ID : 'GeneralInformation',
            Target : '@UI.FieldGroup#GeneralInformation',
        },
    ],
    UI.FieldGroup #GeneralInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : ID,
                Label : 'ID',
            },
            {
                $Type : 'UI.DataField',
                Value : ingredient,
                Label : 'ingredient',
            },],
    }
);
