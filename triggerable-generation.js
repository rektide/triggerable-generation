import Defer from "defer-esm"
import unknownFilter from "./unknown.js"

export let defaults= {
	reducer: unknownFilter
}

export function triggerableGeneration( generator, { reducer}= defaults){
	reducer= reducer|| unknownFilter()

	// create a function that can kick off a new generator
	var defer= Defer()
	function trigger( o){
		if( defer.claimed){
			// loop is waiting for a trigger, tell them
			defer.resolve()
			// start a new cycle
			defer= Defer()
		}else if( !defer.resolved){
			// communicate in advance to our loop that this result is ready
			defer.resolved= true
			// provide it
			defer.resolve()
		} // else we already resolved & are just waiting for asyncGenerator to ask

		// pass through the passed in object
		return o
	}
	async function* asyncGenerator(){
		while( true){
			var gen= generator()
			if( gen.then){
				gen= await gen
			}
			for await( let o of gen){
				if( !reducer|| reducer( o)){
					yield o
				}
			}
			var ready= defer.resolved
			if( !ready){
				// claim whatever becomes ready
				defer.claim= true
				await defer.promise
				// trigger will build the new defer when it signals
			}else{
				// it is ready so loop right now
				// build a new defer for next loop
				defer= Defer()
			}
		}
	}
	return {
		trigger,
		asyncGenerator
	}
}
export default triggerableGeneration
