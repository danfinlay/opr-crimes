window.map;
 var lat = -34.397;
 var lon = 150.644;

var myLatlng = new google.maps.LatLng(-34.397,150.644);
 markers = [];


function initialize() {

	//console.log("Initialize called.");
  var myOptions = {
    'mapTypeId': google.maps.MapTypeId.ROADMAP,
    'center': myLatlng,
    'zoom': 12
    }
  map = new google.maps.Map(document.getElementById("map_canvas"),
    myOptions);
  //return map;
}

function readyFunction(){
console.log("ReadyFunction called.");

  for(var i=0; i<facilities.length; i++){
    var facility = facilities[i]
    //console.log("facility: "+JSON.stringify(facility))
    $('select#facilities').append('<option value="'+i+'">'+facility.name.substring(0,25)+'</option>')
  }

$('select#facilities').change(function(){
  //console.log("Selection: "+$('select#facilities').val())
  var facility = facilities[$('select#facilities').val()]
  //console.log("Facility: "+JSON.stringify(facility))
  var latlng = facility.latlng
  goToDanLng(latlng)
 // displayNear(myLatlng);
})

function goToDanLng(danLng){
    var myLatlng = new google.maps.LatLng(danLng[0], danLng[1]);
  var myOptions = {
    zoom: 15,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  }
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

      // var marker = new google.maps.Marker({
      //   position: myLatlng,
      //   title: "crime"
      // });
      // marker.setMap(map);
      displayParks(map)
     displayCrimes(map)
}

var visitor_lat;
var visitor_lon;


myLatlng = new google.maps.LatLng(37.8035, -122.2572);
displayNear(myLatlng);


function displayNear(currentLocation){
  console.log("Displaying near...");

  lat = currentLocation.lat();
  lon = currentLocation.lng();
  var latLng = new google.maps.LatLng(lat, lon);
  var myOptions = {
    zoom: 15,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  }

  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
     //What to do for each point:
      var latlng = new google.maps.LatLng(lat, lon);

      // var marker = new google.maps.Marker({
      //   position: latlng,
      //   title: "Park",
      //   icon:'opricon.png'
      // });
      // marker.setMap(map);

      displayParks(map)
      displayCrimes(map)
}


$('#checkButton').click(function(event){
  console.log("Check button clicked");
  event.preventDefault();
  var location = $('#dropoffLocation').attr("value");
  var myLatlng = centerMapOnAddress(location);

});

function saveNewUserLocation(geoPoint){
  var currentUser = Parse.User.current();
  currentUser.set("location", geoPoint);
  currentUser.save(null, {
    success:function(user){
      console.log("Saving user a success!");
    }
  });
}

$('#searchArea').click(function(ev){
  ev.preventDefault()
  var address = $('#where').val()
  centerMapOnAddress(address)
})

function centerMapOnAddress(address){
  console.log("New geocoder requesting...");
   geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        lat = results[0].geometry.location.lat();
        lon = results[0].geometry.location.lng();
        console.log("Geocoder success, user requested lat: "+lat+" lon:"+lon);
        myLatlng = results[0].geometry.location;

        displayNear(myLatlng);
        //saveNewUserLocation(geoPoint);
      } else {
        alert("Location not found because: " + status);
      }
    });
}

function latlngForAddress(address){
   geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        return results[0].geometry.location
        //saveNewUserLocation(geoPoint);
      } else {
        return "err"
      }
    });
}

function tryToSetMap(){

  initialize();

  if(google.loader.ClientLocation)
  {
      visitor_lat = google.loader.ClientLocation.latitude;
      visitor_lon = google.loader.ClientLocation.longitude;
      visitor_city = google.loader.ClientLocation.address.city;
      visitor_region = google.loader.ClientLocation.address.region;
      visitor_country = google.loader.ClientLocation.address.country;
      visitor_countrycode = google.loader.ClientLocation.address.country_code;
      myLatlng = new google.maps.LatLng(visitor_lat, visitor_lon);
    var myOptions = {
      'mapTypeId': google.maps.MapTypeId.ROADMAP,
      'center': myLatlng,
      'zoom': 12
    }
    window.map.setOptions(myOptions)
    //displayNear(myLatlng);
  }
}


centerMapOnAddress("Oakland, CA")
displayCrimes()
displayParks()


}

function displayParks(onMap){
   facilities.forEach(function(facility){

    var myLatlng = new google.maps.LatLng(facility.latlng[0], facility.latlng[1]);

      var marker = new google.maps.Marker({
        position: myLatlng,
        title: facility.name,
        icon:'opricon.png'
      });
      marker.setMap(onMap);
  })
}

function displayCrimes(onMap){
  crimes.forEach(function(crime){
    //console.log(JSON.stringify(crime,null,'\t'))
    var lat = parseFloat(crime.location_1.latitude.slice(0,-1))
    var lng = parseFloat(crime.location_1.longitude.slice(0,-1))

    var latlng = new google.maps.LatLng(lat, lng);

      var marker = new google.maps.Marker({
        position: latlng,
        title: crime.description
      });
      marker.setMap(onMap);
  })
}
