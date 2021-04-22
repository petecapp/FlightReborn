var Map = require('ti.map');
var win2 = Titanium.UI.currentWindow;  

Ti.Geolocation.purpose = "Retrieval of fired Rockets";

var xhr = Titanium.Network.createHTTPClient();
xhr.open("GET","http://petecapp.com/flight/get_map_data.php");
var params = {  
    latitude: win2.latitude,  
    longitude: win2.longitude  
};  
xhr.send(params);
var pgLoadInd = Titanium.UI.createActivityIndicator({
    bottom:10,
    height:50,
    style:Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN,
    font: {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'},
    color: 'white',
    message: 'Loading...',
    width: 210
});
// Show the activity indicator prior to the send



mapview = Map.createView({
    mapType: Map.STANDARD_TYPE,
    animate:true,
    userLocation:true,
    regionFit: true,
    region: {latitude:win2.latitude, longitude:win2.longitude,      
           latitudeDelta:0.05, longitudeDelta:0.05}
});
xhr.onload = function() {
	pgLoadInd.hide();
	
	var data = JSON.parse(this.responseText);
	
	var pin = [];
	
	for (var i = 0; i < data.markers.length; i++){
		
		//DISTANCE FROM MARKER CALCULATION
		var dist  = Math.round(10*data.markers[i].distance)/10;
		
		//PLOT EACH MARKER
		plotPoints = Map.createAnnotation({
	    	latitude: data.markers[i].lat,
	    	longitude: data.markers[i].lng,
	    	title: data.markers[i].name,
	    	id: data.markers[i].id,
	    	name: data.markers[i].name,
	    	message: data.markers[i].message,
	    	image: data.markers[i].image,
	    	subtitle: dist + ' mi',
	    	rightButton: '../../images/map-arrow.png',
	    	pincolor: Map.ANNOTATION_GREEN,
	    	animate:true
	    });
		mapview.addAnnotation(plotPoints);
	}
	mapview.addEventListener('click',function(e){
	    if (e.clicksource == 'rightButton') {
	        
			win = Titanium.UI.createWindow({
				title:e.annotation.title,
	        	url: 'rocket-info.js',
	        	barColor: '#00b4ff',
				backgroundImage: '../../images/launch/retrieve-info-bg.png',
				tabBarHidden:true
			});
			win.id  = e.annotation.id;
			win.name  = e.annotation.name;
			win.message = e.annotation.message;
			win.image = e.annotation.image;
			win.lat = e.annotation.latitude;
			win.lng = e.annotation.longitude;
			
			win.hideTabBar();
			Titanium.UI.currentTab.open(win,{animated:true});
		}
	});
};
win2.add(mapview);
win2.add(pgLoadInd);
pgLoadInd.show();