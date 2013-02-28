var csv = require('csv2array')
var fs = require('fs')

fs.readFile('./Parks_and_Recreation_Facilities.csv', function(err, file){
	if(!err){
		var parks = csv(file)
		var myParks = []
		for(var i=1; i<parks.length-2; i++){
			var unformattedAddress = parks[i][4]
			if(unformattedAddress){
				var latlng =unformattedAddress.substring(unformattedAddress.indexOf('(')+1,unformattedAddress.indexOf(')')).split(', ')
				var park = {
					name:parks[i][0],
					latlng:latlng
				}
				myParks.push(park)
			}
			
		}
		//console.log(parks)
		console.log(JSON.stringify(myParks,null,'\t'))



		fs.writeFile('facilities.js', 'var facilities = '+JSON.stringify(myParks.sort(sortCenters)), function(err){
			console.log("Write err?"+err)
		})
	}
})

function sortCenters(a,b){
	var aList = [a.name,b.name].sort()
	if(a.name===aList[0]){
		return -1
	}else{
		return 1
	}
}