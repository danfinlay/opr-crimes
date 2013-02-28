var map;
 var lat = -34.397;
 var lon = 150.644;
beerStyles = ["Light Lager", "Pilsner", "European Amber Lager", "Dark Lager", "Bock", "Light Hybrid Beer", "Amber Hybrid Beer", "English Pale Ale", "Scottish and Irish Ale", "American Ale", "English Brown Ale", "Porter", "Stout", "India Pale Ale (IPA)", "German Wheat and Rye Beer", "Belgian and French Ale","Sour Ale","Belgian Strong Ale","Strong Ale","Fruit Beer", "Spice/Herb/Vegetable Beer", "Smoke-Flavored and Wood-Aged Beer", "Specialty Beer", "Traditional Mead", "Melomel (Fruit Mead)", "Other Mead", "Standard Cider and Perry", "Specialty Cider and Perry", "Wine"];

var myLatlng = new google.maps.LatLng(-34.397,150.644);
 markers = [];


function initialize() {


	console.log("Initialize called.");
  var myOptions = {
    center: myLatlng,
    zoom: 3,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    };
  map = new google.maps.Map(document.getElementById("map_canvas"),
    myOptions);
  return map;
}

function readyFunction(){


console.log("ReadyFunction called.");

var visitor_lat;
var visitor_lon;


myLatlng = new google.maps.LatLng(37.77, -122.419);
displaySwapsNear(myLatlng);


function displaySwapsNear(currentLocation){
  console.log("Displaying swaps near...");

  lat = currentLocation.lat();
  lon = currentLocation.lng();
  var latLng = new google.maps.LatLng(lat, lon);

    var myOptions = {
    zoom: 5,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  }

  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    
     //What to do for each point:
      var latlng = new google.maps.LatLng(lat, lon);

      var marker = new google.maps.Marker({
        position: latlng,
        title: "crime"
      });
      marker.setMap(map);

/**
      var host = placesObjects[i].get("host");
      var hostName = host.get("username");
      var hostId = host.id;
      var hostCell = "<a href = 'user/?id="+hostId+"'>"+hostName+"</a>";
      **/

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

        displaySwapsNear(myLatlng);

        
        //saveNewUserLocation(geoPoint);
      } else {
        alert("Location not found because: " + status);
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
          center: myLatlng,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

displaySwapsNear(myLatlng);


}
}
}


