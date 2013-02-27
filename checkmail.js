function checkMail(parse, current_user){
	var Message = Parse.Object.extend("Message");
    msgQuery = new Parse.Query(Message);
    msgQuery.equalTo("recipient", current_user);
    msgQuery.equalTo("new", true);
    msgQuery.first({
      success:function(message){
        if(message){
        console.log("Message returned: "+message.get("subject"));
        $('div.login-zone').prepend('<a href=mymessages.html><img src=orangered.gif></a>&nbsp&nbsp');
      }else{
        console.log("No messages found");
		    $('div.login-zone').prepend('<a href=mymessages.html><img src=greyvelope2.gif></a>&nbsp&nbsp');
      }
      }
    });
}