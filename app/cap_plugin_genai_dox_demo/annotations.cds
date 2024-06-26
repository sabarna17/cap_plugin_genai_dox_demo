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
            Label : 'Ingredients',
            ID : 'Ingredients',
            Target : 'ingredients/@UI.LineItem#Ingredients',
        },
    ],
    UI.LineItem : [
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
);

annotate service.RecipeIngredients with @(
    UI.LineItem #Ingredients : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : 'ID',
        },{
            $Type : 'UI.DataField',
            Value : ingredients,
            Label : 'ingredients',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'quantity',
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
            },{
                $Type : 'UI.DataField',
                Value : ingredients,
                Label : 'ingredients',
            },
            {
                $Type : 'UI.DataField',
                Value : quantity,
                Label : 'quantity',
            },],
    }
);
