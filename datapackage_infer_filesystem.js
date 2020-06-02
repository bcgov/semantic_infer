const {Package} = require('datapackage');

module.exports = {
	datapackage_infer_filesystem: async function() {
		return datapackage_infer_filesystem();
	}
};

const datapackage_infer_filesystem = async () => {
	
	const dataPackage = await Package.load();
	const semanticinfer = require('./semantic_infer');
	const constants = require('./constants');
	const VAR_CLASS_ATTR = constants.VAR_CLASS_ATTR;
	const RDF_ATTR = constants.RDF_ATTR;
	const SAVED_PATH_ATTR = constants.SAVED_PATH_ATTR;
	const DATA_PACKAGE_INFER_FILE_FILTER = constants.DATA_PACKAGE_INFER_FILE_FILTER;
	var vals = [];
	var fieldVals = [];
	var resourceDataSample = [];
	var i;
	var s;
	var resource;
	try {
		await dataPackage.infer(DATA_PACKAGE_INFER_FILE_FILTER);
		for (r in dataPackage.descriptor.resources) {
			resource = await dataPackage.resources[r];
			//check for semantic inference only if files are identified as being tabular
			if (resource.tabular) {
				resourceDataSample = await resource.read(keyed=true,limit=10);
				for (f in resource.schema.fields){
					field = resource.schema.fields[f];
					fieldVals = [];
					for (j = 0; j < resourceDataSample.length; j++){
						fieldVals[j] = resourceDataSample[j][field.name];
					}
					s = semanticinfer.semantically_classify_field(field.name, fieldVals, field.type);
					if (s != 'none') {
						dataPackage.descriptor.resources[r].schema.fields[f][VAR_CLASS_ATTR] = s[VAR_CLASS_ATTR];
						if (RDF_ATTR in s) {
							dataPackage.descriptor.resources[r].schema.fields[f][RDF_ATTR] = s[RDF_ATTR];
						}
					}
				}
			}
		}
		dataPackage.commit();
		console.log(JSON.stringify(dataPackage.descriptor, null, 4));
	} catch(err){console.log('Error occurred: '); console.log(err.message); console.log(dataPackage.errors);}
	
} 