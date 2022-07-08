const {Package} = require('datapackage');
const {parse} = require('csv-parse');
const fs = require("fs");
module.exports = {
	datapackage_infer_filesystem: async function(dp_attrs, options={}) {
		return datapackage_infer_filesystem(dp_attrs, options);
	}
};

const datapackage_infer_filesystem = async (dp_attrs, options) => {
	const dataPackage = await Package.load();
	const semantic_infer = require('./semantic_infer').semantic_infer;
	const semanticinfer = new semantic_infer(options);
	const settings = require('./datapackage_settings')(options);
	const VAR_CLASS_ATTR = settings.VAR_CLASS_ATTR;
	const RDF_ATTR = settings.RDF_ATTR;
	const SAVED_PATH_ATTR = settings.SAVED_PATH_ATTR;
	const DATA_PACKAGE_INFER_FILE_FILTER = settings.DATA_PACKAGE_INFER_FILE_FILTER;
	const DATA_PACKAGE_FILE_READ_SAMPLE_SIZE = settings.DATA_PACKAGE_FILE_READ_SAMPLE_SIZE;
	const DATA_PACKAGE_FILE_RECORD_NUM_RECORDS = settings.DATA_PACKAGE_FILE_RECORD_NUM_RECORDS;
	const DATA_PACKAGE_ADD_CSV_INFO = settings.DATA_PACKAGE_ADD_CSV_INFO;
	const NUM_RECORD_ATTR = settings.NUM_RECORD_ATTR;
	const NUM_LINES_ATTR = settings.NUM_LINES_ATTR;
	const NUM_EMPTY_LINES_ATTR = settings.NUM_EMPTY_LINES_ATTR;
	const NUM_COMMENT_LINES_ATTR = settings.NUM_COMMENT_LINES_ATTR;
	const NUM_INVALID_FIELD_LENGTH_ATTR = settings.NUM_INVALID_FIELD_LENGTH_ATTR;
	const BYTES_ATTR = settings.BYTES_ATTR;
	const DATA_PACKAGE_ADD_DELIMETER = settings.DATA_PACKAGE_ADD_DELIMETER;
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
	
	async function csvInfo(fileLocation, delim) {
		const parser = parse({info: true, bom: true, delimiter: delim});
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
				let delimiter = await detectDelimiter(resource.descriptor.path);
				
				if (DATA_PACKAGE_ADD_CSV_INFO == 1 || DATA_PACKAGE_FILE_RECORD_NUM_RECORDS == 1) {
					let info = await csvInfo(resource.descriptor.path, delimiter);
					if (DATA_PACKAGE_FILE_RECORD_NUM_RECORDS == 1 && DATA_PACKAGE_ADD_CSV_INFO == 0) {
						dataPackage.descriptor.resources[r][NUM_RECORD_ATTR] = info.records;
					}
					else {
						dataPackage.descriptor.resources[r][BYTES_ATTR] = info.bytes;
						dataPackage.descriptor.resources[r][NUM_COMMENT_LINES_ATTR] = info.comment_lines;
						dataPackage.descriptor.resources[r][NUM_EMPTY_LINES_ATTR] = info.empty_lines;
						dataPackage.descriptor.resources[r][NUM_INVALID_FIELD_LENGTH_ATTR] = info.invalid_field_length;
						dataPackage.descriptor.resources[r][NUM_LINES_ATTR] = info.lines;
						dataPackage.descriptor.resources[r][NUM_RECORD_ATTR] = info.records;
					}
				}
				if (DATA_PACKAGE_ADD_DELIMETER){
					dataPackage.descriptor.resources[r]["dialect"] = {delimiter: delimiter};
				}
				resourceDataSample = await resource.read({keyed:true,limit:DATA_PACKAGE_FILE_READ_SAMPLE_SIZE,cast:false});
				
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
		console.log(JSON.stringify(dataPackage.descriptor, null, 4));
	} catch(err){console.log('Error occurred: '); console.log(err.message); console.log(dataPackage.errors);}
	
} 