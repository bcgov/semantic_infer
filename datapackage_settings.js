let config = require('config');
module.exports = {
	VAR_CLASS_ATTR: config.has('VAR_CLASS_ATTR') ? config.get('VAR_CLASS_ATTR') : 'var_class', 
	RDF_ATTR: config.has('RDF_ATTR') ? config.get('RDF_ATTR') : 'rdfType',
	SAVED_PATH_ATTR: config.has('SAVED_PATH_ATTR') ? config.get('SAVED_PATH_ATTR') : 'saved_path',
	DATA_PACKAGE_INFER_FILE_FILTER: config.has('DATA_PACKAGE_INFER_FILE_FILTER') ? config.get('DATA_PACKAGE_INFER_FILE_FILTER') : '**/*.{csv,CSV,txt,TXT}',
	DATA_PACKAGE_FILE_READ_SAMPLE_SIZE: config.has('DATA_PACKAGE_FILE_READ_SAMPLE_SIZE') ? config.get('DATA_PACKAGE_FILE_READ_SAMPLE_SIZE') : 10,
	DATA_PACKAGE_FILE_RECORD_NUM_RECORDS: config.has('DATA_PACKAGE_FILE_RECORD_NUM_RECORDS') ? config.get('DATA_PACKAGE_FILE_RECORD_NUM_RECORDS') : 0,
	NUM_RECORD_ATTR : config.has('NUM_RECORD_ATTR') ? config.get('NUM_RECORD_ATTR') : 'num_records'
}