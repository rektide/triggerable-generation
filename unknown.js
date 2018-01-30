/**
  Produce a unknownFilter, which returns a filter that will discard (return false) any already seen elements.
*/
export function unknownFilterFactory( existing){
	var known= new WeakSet()
	if( existing&& typeof existing!== "string"&& existing[ Symbol.iterator]){
		try{
			for( var o of existing){
				known.add( o)
			}
		}catch(err){
			known.add( existing)
		}
	}
	function unknownFilter( o){
		var isUnknown= !known.has( o)
		if ( isUnknown){ 
			known.add( o)
		}
		return isUnknown
	}
	return unknownFilter
}
export default unknownFilterFactory
