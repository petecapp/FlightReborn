var win = Titanium.UI.currentWindow;  

var path = Titanium.Filesystem.resourcesDirectory + Titanium.Filesystem.separator;

var storedId = Titanium.App.Properties.getString("id");

var imageView = Titanium.UI.createImageView ({
		image: 'http://petecapp.com/flight/uploaded-photos/' + win.image,
		top: 60,
		height:320
});
if (win.image == ''){
	//Do Nothing
}
else{
	win.add(imageView);
}
var name = Titanium.UI.createLabel({  
    text:win.name,  
    top:15,   
    width:300,
    color:'#fff',
    font:{fontFamily:'Helvetica-Bold',fontSize:25},
    textAlign:'center',
    height:'auto'  
});  
win.add(name);
var message = Titanium.UI.createLabel({  
    text:win.message,  
    top:60,   
    width:275,
    color:'#fff',
    font:{fontFamily:'Helvetica-Light',fontSize:20},
    textAlign:'center',
    height:'auto'  
});  
win.add(message);
var rocketPositionTitle = Titanium.UI.createLabel({  
    text:"Current Rocket Position:",  
    top:260,  
    left:10,  
    width:300,
    color:'#fff',
    font:{fontSize:16},
    textAlign:'center',
    height:'auto'  
});  
win.add(rocketPositionTitle);
var latLabel = Titanium.UI.createLabel({  
    text:'Latitude - ',  
    top:285,  
    left:107,  
    width:300,
    color:'#fff',
    font:{fontSize:12},
    height:'auto'  
});  
win.add(latLabel);
var lat = Titanium.UI.createLabel({  
    text:win.lat,  
    top:285,  
    left:161,  
    width:300,
    color:'#43c346',
    font:{fontSize:12},
    height:'auto'  
});  
win.add(lat);
var lngLabel = Titanium.UI.createLabel({  
    text:'Longitude - ',  
    top:300,  
    left:100,  
    width:300,
    color:'#fff',
    font:{fontSize:12},
    height:'auto'  
});  
win.add(lngLabel);
var lng = Titanium.UI.createLabel({  
    text:win.lng,  
    top:300,  
    left:165,  
    width:300,
    color:'#43c346',
    font:{fontSize:12},
    height:'auto'  
});  
win.add(lng);

if (win.message == '' | win.message == null){
	message.text  = 'No message attached';
	message.color = '#a9a9a9';
}


// PICK UP BUTTON
var pickUpBtn = Titanium.UI.createButton({  
    backgroundImage: path + 'images/retrieve/btn-pick-up-rocket.png',
	backgroundSelectedImage: path + 'images/retrieve/btn-pick-up-rocket-over.png',
	height:42,
	width:298,
	top:350,
	color:'#3a3a3a',
	font:{fontSize:16,fontWeight:"bold"}
});  
win.add(pickUpBtn);

// Distance Calculator
Titanium.Geolocation.getCurrentPosition(function(e) {
	latitude = e.coords.latitude;
	longitude = e.coords.longitude;
	
	//DESTINATION POINT GIVEN DISTANCE AND BEARING FROM START POINT
	Ti.include("../../js_includes/geo.js");
	Ti.include("../../js_includes/latlon.js");
	    	
    var lat1 = Geo.parseDMS(win.lat);
    var lon1 = Geo.parseDMS(win.lng);
    var lat2 = Geo.parseDMS(latitude);
    var lon2 = Geo.parseDMS(longitude);
    var p1 = new LatLon(lat1, lon1);
    var p2 = new LatLon(lat2, lon2);
    
    var dist = p1.distanceTo(p2);
    var finalDist = Math.round(((dist / 1.609) * 5280) * 1) / 1;
    
	pickUpBtn.addEventListener('click', function()
	{
		if (finalDist <= '50'){
			//alert('worked');
			Ti.App.fireEvent('rocketPickUp', {});
		}
		else {
			alert('You have to be within 50ft to pick this up');
		}
	    
	});
	var distance = Titanium.UI.createLabel({  
	    text:finalDist + ' ft away from current location',  
	    top:320,  
	    left:75,  
	    width:300,
	    color:'#43c346',
	    font:{fontSize:12},
	    height:'auto'  
	});  
	win.add(distance);
});
Ti.App.addEventListener('rocketPickUp',function(e){
	// SAVE RETRIEVED ROCKET IN DATABASE
	var createReq = Titanium.Network.createHTTPClient();
	createReq.onload = function()
	{
		var alertDialog = Titanium.UI.createAlertDialog({
		    title: 'Alert',
		    message: this.responseText,
		    buttonNames: ['OK']
		});
		alertDialog.show();
		
	};
	
	createReq.open("POST","http://petecapp.com/flight/post_rocket_retrieval.php");
	var params = {
		id: win.id,
		userId: storedId
	};
	createReq.send(params);
});