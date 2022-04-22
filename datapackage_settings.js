let c = require('./config').config;
const config = new c();

module.exports = function(options){
	function getParameterValue(param, defaultValue) {
		return (options && options[param]) ? options[param] : config.has(param) ? config.get(param) : defaultValue;		
	}
	return {
			VAR_CLASS_ATTR: getParameterValue('VAR_CLASS_ATTR','var_class'),
			RDF_ATTR: getParameterValue('RDF_ATTR','rdfType'),
			SAVED_PATH_ATTR: getParameterValue('SAVED_PATH_ATTR','saved_path'),
			DATA_PACKAGE_INFER_FILE_FILTER: getParameterValue('DATA_PACKAGE_INFER_FILE_FILTER','**/*.{csv,CSV,txt,TXT}'),
			DATA_PACKAGE_FILE_READ_SAMPLE_SIZE: getParameterValue('DATA_PACKAGE_FILE_READ_SAMPLE_SIZE', 10),
			DATA_PACKAGE_FILE_RECORD_NUM_RECORDS: getParameterValue('DATA_PACKAGE_FILE_RECORD_NUM_RECORDS', 0),
			DATA_PACKAGE_ADD_CSV_INFO: getParameterValue('DATA_PACKAGE_ADD_CSV_INFO', 0),
			NUM_RECORD_ATTR: getParameterValue('NUM_RECORD_ATTR','records'),
			NUM_LINES_ATTR: getParameterValue('NUM_LINES_ATTR','lines'),
			NUM_EMPTY_LINES_ATTR: getParameterValue('NUM_EMPTY_LINES_ATTR','empty_lines'),
			NUM_COMMENT_LINES_ATTR: getParameterValue('NUM_COMMENT_LINES_ATTR','comment_lines'),
			NUM_INVALID_FIELD_LENGTH_ATTR: getParameterValue('NUM_INVALID_FIELD_LENGTH_ATTR','invalid_field_length'),
			BYTES_ATTR: getParameterValue('BYTES_ATTR','bytes')
	}
}