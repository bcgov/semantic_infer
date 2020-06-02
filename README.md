# semantic_infer
npm module for inferring the semantic types of tabular data fields. Includes support for inferring Frictionless data packages json and incorporating semantic inference into the data package json.

There are 3 ways to use this package: semantic_infer (if you don't need data packages), datapackage_infer (for browser client based data package and semantic inference), and datapackage_infer_filesytem (for file system based data package and semantic inference). 

### semantic_infer only
semantic_infer takes a column name, an array of values and data type as input and returns an object if a match is found else returns 'None'

Example usage:
const semantic_infer = require('./semantic_infer');
var val_arr = ['V8r 1g7', 'V8X 5m2'];
result2 = semanticinfer.semantically_classify_field('Post_CD',val_arr,'string',true);
console.log(result2);

Result:
{
  name: 'Postal code',
  rdfType: 'https://schema.org/postalCode',
  var_class: 'indirect_identifier'
}

### datapackage_infer
Takes a data package with sample data in it and infers the fields, field data types (e.g., integer, string), and semantic types (e.g., postal code).

DataPackage rules: 
* Datapackage object must have a "resources" array. 
* Each resource must have a "name" field.
* Each resource must have a "data" or "path" field (but not both).

Semantic inference rules:
* Only resources with a "data" field will be sematically inferred.  
* Providing a "SAVED_PATH_ATTR" attribute for data resources will result in the "data" field being replaced by a "path" field.

Example usage:
const datapackageinfer = require('./datapackage_infer');
const descriptor = {
  resources: [
  {
  name: 'example',
	saved_path: 'example.csv',
  data: [
        ['height', 'age', 'name'],
        ['180', '18', 'V8R1G6'],
        ['192', '32', 'B4D 4G1'],
      ]
    }
  ]
}
const results = datapackageinfer.infer_datapackage(descriptor,true);

Result:
{
  resources: [
    {
      name: 'example',
      profile: 'tabular-data-resource',
      encoding: 'utf-8',
      schema: { fields [
        { name: 'height', type: 'integer', format: 'default' },
        { name: 'age', type: 'integer', format: 'default' },
        {
          name: 'name',
          type: 'string',
          format: 'default',
          var_class: 'indirect_identifier',
          rdfType: 'https://schema.org/postalCode'
        }
      ],
      missingValues: [ "" ]
      },
      path: 'example.csv'
    }
  ],
  profile: 'data-package'
}

### datapackage_infer_filesystem
Infers data package (including semantic inference) json for all csv and txt files in the current directory and its sub-directories.  

Example usage:
const datapackageinferfilesystem = require('./datapackage_infer_filesystem');
datapackageinferfilesystem.infer_datapackage();
