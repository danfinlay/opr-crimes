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
Parse.initialize("WEILBDv4Rm48Fd5Yc1H13ApCArM7EJmiQrcmmZrY", "oS3nPSJ5kcfw8tLKnYkAAAR5GtUsK85XmzIyo7aV");


  (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=317251165036208";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

  window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({
      appId      : '317251165036208', // App ID
      channelUrl : 'channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });
};

  // Load the SDK Asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));





  
var visitor_lat;
var visitor_lon;

var currentUser = Parse.User.current();
if (currentUser) {
    // do stuff with the user
    console.log("User identified. "+ currentUser.get("username"));
    $('div.login-zone').html('Welcome, <a id = "myAccount" href="myaccount.html">'+currentUser.get("username")+'</a>!&nbsp;&nbsp;&nbsp;<a id = "logoutButton" href="logout.html">Log out</a>');
    checkMail(Parse, currentUser);
    var location = currentUser.get("location");
    if (location) {
      lat = location.latitude;
      lon = location.longitude;
      console.log("Initial location found: Lat="+lat+" Lon="+lon);
      myLatlng = new google.maps.LatLng(lat, lon);
      displaySwapsNear(myLatlng);
    } else {
      console.log("User location not found.");
      tryToSetMap();
    }
  }else{
    myLatlng = new google.maps.LatLng(37.77, -122.419);
    displaySwapsNear(myLatlng);
}




function displaySwapsNear(currentLocation){
  console.log("Displaying swaps near...");

  lat = currentLocation.lat();
  lon = currentLocation.lng();
  var latLng = new google.maps.LatLng(lat, lon);
  var point = new Parse.GeoPoint({latitude:lat, longitude:lon});

  var Beer = Parse.Object.extend("Beer");
  var query = new Parse.Query(Beer);
  query.near("location", point);
  query.limit(20);
  query.include("creator");
  query.equalTo("available", true);
  query.find({
    success: function(beers){
      console.log("Finding swaps a success!.  Found "+beers.length);

    var myOptions = {
    zoom: 5,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  }

  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

      $('table').text('');

      $('table').append('<tr><th>Beer Name</th><th>Style</th><th>Creator</th><th>Description</th></tr>');
    for (var i = 0; i<beers.length; i++) {
      console.log("Enumerating beer #" + i);
      var swap = beers[i];
      var location = swap.get("location");
      var parsedLocation = location.toJSON();
      lat = parsedLocation["latitude"];
      lon = parsedLocation["longitude"];
      console.log("lat and lon:" + lat+ "  "+lon);
      var latlng = new google.maps.LatLng(lat, lon);


      var marker = new google.maps.Marker({
        position: latlng,
        title: swap.get("title")
      });
      marker.setMap(map);


/**
      var host = placesObjects[i].get("host");
      var hostName = host.get("username");
      var hostId = host.id;
      var hostCell = "<a href = 'user/?id="+hostId+"'>"+hostName+"</a>";
      **/

      var beer = beers[i];
      $('table').append('<tr><td><a href=beer.html?id='+beer.id+'>'+beer.get("name")+"</a></td><td>"+beerStyles[beer.get("style")-1]+"</td><td><a href=user.html?id="+beer.get("creator").id+">"+beer.get("creator").get("username")+"</a></td><td>"+beer.get("description").substr(0, 250)+"</td></tr>");
      

    }
  },
  error: function(placesObjects, error){
    console.log("Finding swaps gave error: "+error.message);
    initialize();
  }
});

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

        var geoPoint = new Parse.GeoPoint({latitude:lat, longitude:lon});
        //saveNewUserLocation(geoPoint);
      } else {
        alert("Location not found because: " + status);
      }
    });
}


$('#logoutButton').live("click", function(event){
  event.preventDefault();
console.log("Log out clicked");
Parse.User.logOut();
window.location.href = "index.html";
});
$('#myAccount').click(function(event){
console.log("My account clicked.");
});




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
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

var Swap = Parse.Object.extend("Swap");

var currentLocation = new Parse.GeoPoint({latitude: visitor_lat, longitude: visitor_lon});
var swapQuery = new Parse.Query(Swap);
displaySwapsNear(myLatlng);
}
}
}


