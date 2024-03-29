let c = require('./config').config;
const config = new c();
function regexFromString (string) {
  var match = /^\/(.*)\/([a-z]*)$/.exec(string)
  return new RegExp(match[1], match[2])
}
function arrayOfRegexes (arr) {
	var newArr = [];
	for (var i in arr) {
		newArr[i] = regexFromString(arr[i]);
	}
	return newArr;
}

module.exports = function(options){
	function getParameterValue(param, defaultValue, isRegex=false) {
		if (isRegex){
			return (options && options[param]) ? arrayOfRegexes(options[param]) : config.has(param) ? arrayOfRegexes(config.get(param)) : defaultValue;	
		}
		else {
			return (options && options[param]) ? options[param] : config.has(param) ? config.get(param) : defaultValue;	
		}
	}	
	return {
		DATE_HEADER_SEMANTIC_LABELS: getParameterValue('DATE_HEADER_SEMANTIC_LABELS',[
		{name:'Birth date',rdfType:'https://schema.org/birthDate',var_class:'indirect_identifier'},
		{name:'Death date',rdfType:'https://schema.org/deathDate',var_class:'indirect_identifier'},
		{name:'Marriage date',var_class:'indirect_identifier'},
		{name:'Divorce date',var_class:'indirect_identifier'}
		]),
		DATE_HEADER_PATTERNS: getParameterValue('DATE_HEADER_PATTERNS',[
		/BI?RTH.?(DT|DATE)|(DT|DATE).*BI?RTH|DOB/i,
		/D(EA)?TH.?(DT|DATE)|(DT|DATE).*D(EA)?TH/i,
		/MA?RR(IA)?GE?.?(DT|DATE)|(DT|DATE).*MA?RR(IA)?GE?/i,
		/DI?VO?RCE?.?(DT|DATE)|(DT|DATE).*DI?VO?RCE?/i
		], true),
		INT_HEADER_SEMANTIC_LABELS: getParameterValue('INT_HEADER_SEMANTIC_LABELS',[
		{name:'Phone number',rdfType:'https://schema.org/telephone',var_class:'direct_identifier'},
		{name:'PHN',var_class:'direct_identifier'},
		{name:'PEN',var_class:'direct_identifier'}
		]),
		INT_HEADER_PATTERNS: getParameterValue('INT_HEADER_PATTERNS',[
		/.*PHONE.*|.*PH.?NUM.*/i,
		/^PHN$/i,
		/^PEN$/i
		], true),
		STRING_HEADER_SEMANTIC_LABELS: getParameterValue('STRING_HEADER_SEMANTIC_LABELS',[
		{name:'Phone number',rdfType:'https://schema.org/telephone',var_class:'direct_identifier'},
		{name:'First name',rdfType:'https://schema.org/givenName',var_class:'direct_identifier'},
		{name:'Last name',rdfType:'https://schema.org/familyName',var_class:'direct_identifier'},
		{name:'Middle name',rdfType:'https://schema.org/additionalName',var_class:'direct_identifier'},
		{name:'Full name',var_class:'direct_identifier'},
		{name:'Email',rdfType:'https://schema.org/email',var_class:'direct_identifier'},
		{name:'Postal code',rdfType:'https://schema.org/postalCode',var_class:'indirect_identifier'},
		{name:'Street address',rdfType:'https://schema.org/streetAddress',var_class:'direct_identifier'},
		{name:'Gender',rdfType:'https://schema.org/gender',var_class:'research_content'}
		]),
		STRING_HEADER_PATTERNS: getParameterValue('STRING_HEADER_PATTERNS',[
		/.*PHONE.*|.*PH.?NUM.*/,
		/.*FI?R?ST.?NAME|.*NAME.*FI?R?ST.*|F.?NAME|.*GI?VE?N.?NAME|.*NAME.*GI?VE?N.*/i,
		/.*LA?ST.?NA?ME.*|.*NA?ME.?LA?ST.*|.*SU?RNA?ME.*|.*FAMILY.?NAME.*|.*NAME.*FAMILY.*/i,
		/.*MID(DLE)?.?NAME.*|.*NAME.?MID(DLE)?.*|PREF(FERRED)?.?NAME/i,
		/.*FULL.?NA?ME.*|.*NA?ME.*FULL.*/i,
		/.*EMAIL.*/i,
		/.*PO?STA?L.?CO?DE?.*|.*POST_CD.*/i,
		/.*ADDR.*|.*STREET.*/i,
		/.*SEX.*|.*GE?NDE?R.*/i
		], true),
		STRING_VALUE_SEMANTIC_LABELS: getParameterValue('STRING_VALUE_SEMANTIC_LABELS',[
		{name:'Postal code',rdfType:'https://schema.org/postalCode',var_class:'indirect_identifier',th:1},
		{name:'Gender',rdfType:'https://schema.org/gender',var_class:'research_content',th:0.4},
		{name:'SIN',var_class:'direct_identifier',th:0.4},
		{name:'Phone number',rdfType:'https://schema.org/telephone',var_class:'direct_identifier',th:0.4},
		{name:'PHN',var_class:'direct_identifier',th:0.8}
		]),
		STRING_VALUE_PATTERNS: getParameterValue('STRING_VALUE_PATTERNS',[
		/[A-Z]\d[A-Z]\s?\d[A-Z]\d/i,
		/^MALE$|^FEMALE$|^M$|^F$/i,
		/\d{3}.?\d{3}.?\d{3}/i,
		/\+?1?.?\d{3}.?\d{3}.?\d{4}(x\d{3})?/i,
		/^9\d{9}$/
		], true),
		INT_VALUE_SEMANTIC_LABELS: getParameterValue('INT_VALUE_SEMANTIC_LABELS',[
		{name:'PHN',var_class:'direct_identifier',th:1},
		{name:'PEN',var_class:'direct_identifier',th:1}
		]),
		INT_VALUE_PATTERNS: getParameterValue('INT_VALUE_PATTERNS',[
		/^9\d{9}$/,
		/^\d{9}$/
		], true)
	}
};