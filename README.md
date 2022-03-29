# semantic_infer
npm module for inferring the semantic types of tabular data fields. Includes support for inferring Frictionless data packages json and incorporating semantic inference into the data package json.

https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md

There are 3 ways to use this package: semantic_infer (if you don't need data packages), datapackage_infer (for browser client based data package and semantic inference), and datapackage_infer_filesytem (for file system based data package and semantic inference). 

Starting with version 1.2.0 You can use a config file to override default values.
### semantic_infer only
semantic_infer takes a column name, an array of values and data type as input and returns an object if a match is found else returns 'None'

#### Example usage:	
~~~~
const semanticinfer = require('semantic_infer');
var val_arr = ['V8r 1g7', 'V8X 5m2'];
result2 = semanticinfer.semantic_infer.semantically_classify_field('Post_CD',val_arr,'string',true);
console.log(result2);	
~~~~

##### Result:	
~~~~
{
  name: 'Postal code',
  rdfType: 'https://schema.org/postalCode',
  var_class: 'indirect_identifier'
}	
~~~~

### datapackage_infer
Takes a data package with sample data in it and infers the fields, field data types (e.g., integer, string), and semantic types (e.g., postal code).

DataPackage rules: 
* Datapackage object must have a "resources" array. 
* Each resource must have a "name" field.
* Each resource must have a "data" or "path" field (but not both).

Semantic inference rules:
* Only resources with a "data" field will be sematically inferred.  
* Providing a "SAVED_PATH_ATTR" attribute for data resources will result in the "data" field being replaced by a "path" field.

#### Example usage:	
~~~~
const semanticinfer = require('semantic_infer');
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
const results = semanticinfer.datapackage_infer.infer_datapackage(descriptor,true);
results.then(function(result) {
	JSON.stringify(result);
}); 
~~~~
##### Result:	
~~~~
{
  "resources": [
    {
      "name": "example",
      "profile": "tabular-data-resource",
      "encoding": "utf-8",
      "schema": { "fields": [
        { "name": "height", "type": "integer", "format": "default" },
        { "name": "age", "type": "integer", "format": "default" },
        {
          "name": "name",
          "type": "string",
          "format": "default",
          "var_class": "indirect_identifier",
          "rdfType": "https://schema.org/postalCode"
        }
      ],
      "missingValues": [ "" ]
      },
      "path": "example.csv"
    }
  ],
  "profile": "data-package"
}
~~~~
### datapackage_infer_filesystem
Infers data package (including semantic inference) json for all csv and txt files in the current directory and its sub-directories.  

#### Example usage:	
~~~~
const semanticinfer = require('./datapackage_infer_filesystem');
semanticinfer.datapackage_infer_filesystem.infer_datapackage_filesystem();	
~~~~
You may optional pass in an object to add to the data package as top level attributes of the data package. 
~~~~
const source = {"sources": [{
  "title": "my source location",
  "path": "path/to/my/datafile"
}]}
semanticinfer.datapackage_infer_filesystem.infer_datapackage_filesystem(source);
~~~~
##### Result:	
~~~~
{
  "resources": [ ... ],
  "profile": "data-package",
  "sources": [{
    "title": "my source location",
    "path": "path/to/my/datafile"
    }
  ]
} 
~~~~
#### How to override default settings
Overriding the default settings are supported by the config npm module.  Create a "config" directory in your project folder and within that folder a "default.json" file with the settings you wish to override.
See semantic_settings.js and datapackage_settings.js files for all the settings that can be overriden. Make sure you have a corresponding pattern for each label if you override semantic settings.  
Example contents of default.json:
~~~~
{
"STRING_HEADER_SEMANTIC_LABELS":[
	{"name":"Phone number","rdfType":"https://schema.org/telephone","var_class":"direct_identifier"},
	{"name":"First name","rdfType":"https://schema.org/givenName","var_class":"direct_identifier"},
	{"name":"Last name","rdfType":"https://schema.org/familyName","var_class":"direct_identifier"},
	{"name":"Middle name","rdfType":"https://schema.org/additionalName","var_class":"direct_identifier"},
	{"name":"Full name","var_class":"direct_identifier"},
	{"name":"Email","rdfType":"https://schema.org/email","var_class":"direct_identifier"},
	{"name":"Postal code","rdfType":"https://schema.org/postalCode","var_class":"indirect_identifier"},
	{"name":"Street address","rdfType":"https://schema.org/streetAddress","var_class":"direct_identifier"},
	{"name":"Gender","rdfType":"https://schema.org/gender","var_class":"research_content"}
	],
	"STRING_HEADER_PATTERNS":[
	"/.*PHONE.*|.*PH.?NUM.*/",
	"/.*FI?R?ST.?NAME|.*NAME.*FI?R?ST.*|F.?NAME|.*GI?VE?N.?NAME|.*NAME.*GI?VE?N.*/i",
	"/.*LA?ST.?NA?ME.*|.*NA?ME.?LA?ST.*|.*SU?RNA?ME.*|.*FAMILY.?NAME.*|.*NAME.*FAMILY.*/i",
	"/.*MID(DLE)?.?NAME.*|.*NAME.?MID(DLE)?.*|PREF(FERRED)?.?NAME/i",
	"/.*FULL.?NA?ME.*|.*NA?ME.*FULL.*/i",
	"/.*EMAIL.*/i",
	"/.*PO?STA?L.?CO?DE?.*|.*POST_CD.*/i",
	"/.*ADDR.*|.*STREET.*/i",
	"/.*SEX.*|.*GE?NDE?R.*/i"
	]
}
~~~~
#### Optional calcuation of number of records in tabular resources
You can optionally calculate the number of records in a CSV by setting DATA_PACKAGE_FILE_RECORD_NUM_RECORDS=1 in your config file.  Works only for linux environments.  