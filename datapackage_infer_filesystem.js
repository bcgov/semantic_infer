const {Package} = require('datapackage');

module.exports = {
	datapackage_infer_filesystem: async function(dp_attrs) {
		return datapackage_infer_filesystem(dp_attrs);
	}
};

const datapackage_infer_filesystem = async (dp_attrs) => {
	
	const dataPackage = await Package.load();
	const semanticinfer = require('./semantic_infer');
	const settings = require('./datapackage_settings');
	const VAR_CLASS_ATTR = settings.VAR_CLASS_ATTR;
	const RDF_ATTR = settings.RDF_ATTR;
	const SAVED_PATH_ATTR = settings.SAVED_PATH_ATTR;
	const DATA_PACKAGE_INFER_FILE_FILTER = settings.DATA_PACKAGE_INFER_FILE_FILTER;
	const DATA_PACKAGE_FILE_READ_SAMPLE_SIZE = settings.DATA_PACKAGE_FILE_READ_SAMPLE_SIZE;
	const DATA_PACKAGE_FILE_RECORD_NUM_RECORDS = settings.DATA_PACKAGE_FILE_RECORD_NUM_RECORDS;
	const NUM_RECORD_ATTR = settings.NUM_RECORD_ATTR;
	const util = require('util');
	const exec = util.promisify(require('child_process').exec);
	var vals = [];
	var fieldVals = [];
	var resourceDataSample = [];
	var i;
	var s;
	var resource;
	async function csvRecordCount(fileLocation) {
		const { stdout } = await exec(`cat ${fileLocation} | wc -l`);
		return parseInt(stdout)-1; //assume there is a header row
	};

	try {
		await dataPackage.infer(DATA_PACKAGE_INFER_FILE_FILTER);
		for (r in dataPackage.descriptor.resources) {
			resource = await dataPackage.resources[r];
			//check for semantic inference only if files are identified as being tabular
			if (resource.tabular) {
				if (DATA_PACKAGE_FILE_RECORD_NUM_RECORDS == 1) {
					dataPackage.descriptor.resources[r][NUM_RECORD_ATTR] = await csvRecordCount(resource.descriptor.path);
				}
				resourceDataSample = await resource.read({keyed:true,limit:DATA_PACKAGE_FILE_READ_SAMPLE_SIZE});
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
		if (typeof dp_attrs === 'object' && dp_attrs !== null ) {
			Object.keys(dp_attrs).forEach((key) => {
				dataPackage.descriptor[key] = dp_attrs[key];
			})
		}
		dataPackage.commit();
		console.log(JSON.stringify(dataPackage.descriptor, null, 4));
	} catch(err){console.log('Error occurred: '); console.log(err.message); console.log(dataPackage.errors);}
	
} 