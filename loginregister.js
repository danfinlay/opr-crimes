

function codeAddress(address, user) {
  console.log("New geocoder requesting...");
   geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        lat = results[0].geometry.location.lat();
        lon = results[0].geometry.location.lng();
        console.log("Geocoder success.  Lat: "+lat+" Lon: "+lon);
        var location = new Parse.GeoPoint({latitude:lat, longitude:lon});
        user.set("location", location);
        user.save(null, {
            success:function(user){
              console.log("User saved successfully.");
              window.location.href = "myaccount.html";
            },
            error:function(user, error){
              console.log("Save failed.");
              console.log("Error returned: "+error.code+"  "+error.message);
              $('this').append("<div class = error>"+error+"</div>");
            }
          });
      } else {
        alert("Location not found because: " + status);
      }
    });
  }


function readyFunction(){

console.log("Readyfunction called");
 Parse.initialize("WEILBDv4Rm48Fd5Yc1H13ApCArM7EJmiQrcmmZrY", "oS3nPSJ5kcfw8tLKnYkAAAR5GtUsK85XmzIyo7aV");


window.fbAsyncInit = function() {
  console.log("fbAsyncInit called.");
    Parse.FacebookUtils.init({
      appId      : '317251165036208', // App ID
      channelUrl : 'channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });

$('.fb-login-button').live("click", function(event){
  Parse.FacebookUtils.logIn("email", {
    success: function(user) {
      console.log("User fetched."+user.getUsername());
      if (!user.existed()) {
        console.log("User didn't exist, fetching data...");
        console.log('Welcome!  Fetching your information.... ');
        var authData = user.get("authData").facebook.access_token;
        console.log("Auth data: "+authData);
        FB.api('/me?access_token='+authData, function(response) {
          var location = response.location.name;
          
          user.set("username", response.name);
          user.set("email", response.email);
          user.set("allowsNewsletters", true);
          user.set("allowsNotifications", true);
          codeAddress(location, user);
          user.set("location", geoPoint);
          console.log("Saving...");
          

        });
      } else {
        console.log("Already logged in");
        window.location.href = "index.html";
        //
      }
    },
    error: function(user, error) {
      alert("User cancelled the Facebook login or did not fully authorize.");
    }
  });
});
  
};

// Load the SDK Asynchronously
(function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "http://connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
 }(document));

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=317251165036208";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


//Log in pressed:
$('input#login-button').live("click", function(event){
  console.log("Log in clicked");
  event.preventDefault();
var username = $('body .loginbox #username').attr("value");
var password = $('body .loginbox #password').attr("value");
console.log("Attempting to log in with "+username);
  Parse.User.logIn(username, password, {
    success:function(user){
  window.location.href = "index.html";
    },
    error:function(user, error){
      console.log("Error returned: "+error);
      $('this').append("<div class = error>"+error+"</div>");
    }
  });
});





//Register pressed:
$('input#register-button').live("click", function(event){
  console.log("Register clicked");
  event.preventDefault();

  var zip = $('body .registerbox #zip').attr("value");
  var username = $('body .registerbox #username').attr("value");
  var password = $('body .registerbox #password').attr("value");
  var confirm = $('body .registerbox #verify').attr("value");
  var email = $('body .registerbox #email').attr("value");
    
  var user = new Parse.User();
  user.set("username", username);
  user.set("password", password);
  user.set("email", email);
  user.set("zip", parseInt(zip));
  user.set("location", loc);
  codeAddress(zip, user);
});



}