let config = require('config');
module.exports = {
	VAR_CLASS_ATTR: config.has('VAR_CLASS_ATTR') ? config.get('VAR_CLASS_ATTR') : 'var_class', 
	RDF_ATTR: config.has('RDF_ATTR') ? config.get('RDF_ATTR') : 'rdfType',
	SAVED_PATH_ATTR: config.has('SAVED_PATH_ATTR') ? config.get('SAVED_PATH_ATTR') : 'saved_path',
	DATA_PACKAGE_INFER_FILE_FILTER: config.has('DATA_PACKAGE_INFER_FILE_FILTER') ? config.get('DATA_PACKAGE_INFER_FILE_FILTER') : '**/*.{csv,CSV,txt,TXT}',
	DATA_PACKAGE_FILE_READ_SAMPLE_SIZE: config.has('DATA_PACKAGE_FILE_READ_SAMPLE_SIZE') ? config.get('DATA_PACKAGE_FILE_READ_SAMPLE_SIZE') : 10,
	DATA_PACKAGE_FILE_RECORD_NUM_RECORDS: config.has('DATA_PACKAGE_FILE_RECORD_NUM_RECORDS') ? config.get('DATA_PACKAGE_FILE_RECORD_NUM_RECORDS') : 0,
	DATA_PACKAGE_ADD_CSV_INFO: config.has('DATA_PACKAGE_ADD_CSV_INFO') ? config.get('DATA_PACKAGE_ADD_CSV_INFO') : 0,
	NUM_RECORD_ATTR : config.has('NUM_RECORD_ATTR') ? config.get('NUM_RECORD_ATTR') : 'records',
	NUM_LINES_ATTR : config.has('NUM_LINES_ATTR') ? config.get('NUM_LINES_ATTR') : 'lines',
	NUM_EMPTY_LINES_ATTR : config.has('NUM_EMPTY_LINES_ATTR') ? config.get('NUM_EMPTY_LINES_ATTR') : 'empty_lines',
	NUM_COMMENT_LINES_ATTR : config.has('NUM_COMMENT_LINES_ATTR') ? config.get('NUM_COMMENT_LINES_ATTR') : 'comment_lines',
	NUM_INVALID_FIELD_LENGTH_ATTR : config.has('NUM_INVALID_FIELD_LENGTH_ATTR') ? config.get('NUM_INVALID_FIELD_LENGTH_ATTR') : 'invalid_field_length',
	BYTES_ATTR : config.has('BYTES_ATTR') ? config.get('BYTES_ATTR') : 'bytes'
}