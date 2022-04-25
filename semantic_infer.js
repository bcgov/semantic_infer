const anymatch = require('anymatch');
var settings;

class semantic_infer {

	constructor(options=false) {
		settings = require('./semantic_settings')(options);
		this.DATE_HEADER_SEMANTIC_LABELS = settings.DATE_HEADER_SEMANTIC_LABELS;
		this.DATE_HEADER_PATTERNS = settings.DATE_HEADER_PATTERNS;
		this.INT_HEADER_SEMANTIC_LABELS = settings.INT_HEADER_SEMANTIC_LABELS;
		this.INT_HEADER_PATTERNS = settings.INT_HEADER_PATTERNS;
		this.STRING_HEADER_SEMANTIC_LABELS = settings.STRING_HEADER_SEMANTIC_LABELS;
		this.STRING_HEADER_PATTERNS = settings.STRING_HEADER_PATTERNS;
		this.STRING_VALUE_SEMANTIC_LABELS = settings.STRING_VALUE_SEMANTIC_LABELS;
		this.STRING_VALUE_PATTERNS = settings.STRING_VALUE_PATTERNS;
		this.INT_VALUE_SEMANTIC_LABELS = settings.INT_VALUE_SEMANTIC_LABELS;
		this.INT_VALUE_PATTERNS = settings.INT_VALUE_PATTERNS;
	}
	semantically_classify_field(field_name, field_values, dt, debug = false) {
		let header_result = this.find_header_match_datatype(field_name, dt, debug);
		if (header_result != 'none') {
			return header_result;
		}
		else {
			return this.find_values_match_datatype(field_values, dt, debug);
		}
	}

	find_header_match_datatype(val, dt, debug = false) {
		if (dt == 'integer') {
			return this.find_match(val, this.INT_HEADER_PATTERNS, this.INT_HEADER_SEMANTIC_LABELS, debug);
		}
		if (dt == 'date') {
			return this.find_match(val, this.DATE_HEADER_PATTERNS, this.DATE_HEADER_SEMANTIC_LABELS, debug);
		}
		if (dt == 'string') {
			return this.find_match(val, this.STRING_HEADER_PATTERNS, this.STRING_HEADER_SEMANTIC_LABELS, debug);
		}
		else {
			return 'none'
		}
	}

	find_values_match_datatype(vals, dt, debug = false) {
		let i;
		let max_val;
		let max_key;
		let result;
		let result_arr = [];
		let best_match_arr = [];
		let seen_it_arr = [];
		if (!(Array.isArray(vals))) { return 'none'; } 
		if (vals.length < 1) { return 'none'; }
		if (dt == 'string' || dt == 'integer') {
			for (i = 0; i < vals.length; i++) {
				if (dt == 'string') {
					result = this.find_match(vals[i], this.STRING_VALUE_PATTERNS, this.STRING_VALUE_SEMANTIC_LABELS, debug);
				}
				else {
					result = this.find_match(vals[i], this.INT_VALUE_PATTERNS, this.INT_VALUE_SEMANTIC_LABELS, debug);
				}
				if (result == 'none') { continue; }
				if (result.name in seen_it_arr) {
					seen_it_arr[result.name] = seen_it_arr[result.name] + 1;
				}
				else {
					seen_it_arr[result.name] = 1;
					result_arr[result.name] = result;
				}
			}
			if (debug) { console.log(seen_it_arr); }
			//calculate the percentage for each result name and then compare against threshold
			max_val = 0;
			for (let key in seen_it_arr) {
				let v = seen_it_arr[key]/vals.length;
				if (result_arr[key].th <= v) {
					if (v > max_val) {
						max_val = v;
						max_key = key;
					}					
					return result_arr[max_key];
				}
			}
			return 'none';
		}
		else {
			return 'none';
		}
	}

	find_match(val, patterns, labels, debug = false) {
		let index = anymatch(patterns, val + '', {returnIndex: true});
		if (index != -1) {
			if (debug) { console.log(patterns[index]);}
			return labels[index];
		}
		else {
			return 'none';
		}
	}
}


module.exports = {
	semantic_infer: semantic_infer
};