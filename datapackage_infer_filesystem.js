const {Package} = require('datapackage');
const {parse} = require('csv-parse');
const fs = require("fs");
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
	const DATA_PACKAGE_ADD_CSV_INFO = settings.DATA_PACKAGE_ADD_CSV_INFO;
	const NUM_RECORD_ATTR = settings.NUM_RECORD_ATTR;
	const NUM_LINES_ATTR = settings.NUM_LINES_ATTR;
	const NUM_EMPTY_LINES_ATTR = settings.NUM_EMPTY_LINES_ATTR;
	const NUM_COMMENT_LINES_ATTR = settings.NUM_COMMENT_LINES_ATTR;
	const NUM_INVALID_FIELD_LENGTH_ATTR = settings.NUM_INVALID_FIELD_LENGTH_ATTR;
	const BYTES_ATTR = settings.BYTES_ATTR;
	var vals = [];
	var fieldVals = [];
	var resourceDataSample = [];
	var i;
	var s;
	var resource;
	
	async function readFirstNBytes(fileLocation, n) {
		const chunks = [];
		for await (let chunk of fs.createReadStream(fileLocation, { start: 0, end: n })) {
			chunks.push(chunk);
		}
		return Buffer.concat(chunks);
	}
	
	async function detectDelimiter(fileLocation) { 
		let firstBytes = await readFirstNBytes(fileLocation, 100);
		let delimiters = {};
		delimiters[","] = firstBytes.toString().split(",").length - 1;
		delimiters["\t"] = firstBytes.toString().split("\t").length - 1;
		delimiters["|"] = firstBytes.toString().split("|").length - 1;
		delimiters[";"] = firstBytes.toString().split(";").length - 1;
		let delimEntries = Object.entries(delimiters);
		delimEntries.sort((a, b) => b[1] - a[1]);
		return delimEntries[0][0];
	}
	
	async function csvInfo(fileLocation) {
		const parser = parse({info: true, bom: true, delimiter: await detectDelimiter(fileLocation)});
		var done = 0; 
		fs.createReadStream(fileLocation)
		.pipe(parser);
		for await (const record of parser) {}
		return parser.info;
	};

	try {
		await dataPackage.infer(DATA_PACKAGE_INFER_FILE_FILTER);
		for (r in dataPackage.descriptor.resources) {
			resource = await dataPackage.resources[r];
			//check for semantic inference only if files are identified as being tabular
			if (resource.tabular) {
				if (DATA_PACKAGE_ADD_CSV_INFO == 1) {
					let info = await csvInfo(resource.descriptor.path);
					dataPackage.descriptor.resources[r][BYTES_ATTR] = info.bytes;
					dataPackage.descriptor.resources[r][NUM_COMMENT_LINES_ATTR] = info.comment_lines;
					dataPackage.descriptor.resources[r][NUM_EMPTY_LINES_ATTR] = info.empty_lines;
					dataPackage.descriptor.resources[r][NUM_INVALID_FIELD_LENGTH_ATTR] = info.invalid_field_length;
					dataPackage.descriptor.resources[r][NUM_LINES_ATTR] = info.lines;
					dataPackage.descriptor.resources[r][NUM_RECORD_ATTR] = info.records;
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