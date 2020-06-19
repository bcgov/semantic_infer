let config = require('config');
module.exports = {
	VAR_CLASS_ATTR: config.has('VAR_CLASS_ATTR') ? config.get('VAR_CLASS_ATTR') : 'var_class', 
	RDF_ATTR: config.has('RDF_ATTR') ? config.get('RDF_ATTR') : 'rdfType',
	SAVED_PATH_ATTR: config.has('SAVED_PATH_ATTR') ? config.get('SAVED_PATH_ATTR') : 'saved_path',
	DATA_PACKAGE_INFER_FILE_FILTER: config.has('DATA_PACKAGE_INFER_FILE_FILTER') ? config.get('DATA_PACKAGE_INFER_FILE_FILTER') : '**/*.{csv,CSV,txt,TXT}',
}