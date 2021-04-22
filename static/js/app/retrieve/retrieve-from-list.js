var Map = require('ti.map');
var win = Titanium.UI.currentWindow;  

var pinRegion = {
    latitude:win.latitude,
    longitude:win.longitude,
    latitudeDelta:0.05,
    longitudeDelta:0.05
};

var mapview = Map.createView({
mapType: Map.STANDARD_TYPE,
animate:true,
userLocation:true,
regionFit: true,
region: pinRegion
});
// var blob = Ti.UI.createImageView({
	// image:"../../images/retrieve/icon-rocket.png"
// }).toBlob();
var plotPoints = Map.createAnnotation({
	latitude: win.latitude,
	longitude: win.longitude,
	title: win.name,
	name: win.name,
	id: win.id,
	message: win.message,
	//image: blob,
	attachedImage: win.image,
	subtitle: win.dist + ' mi',
	rightButton: '../../images/map-arrow.png',
	pincolor: win.pinColor,
	animate:true
});

win.add(mapview);
mapview.addAnnotation(plotPoints);

plotPoints.addEventListener('click',function(e){
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
		win.message  = e.annotation.message;
		win.image = e.annotation.attachedImage;
		win.lat = e.annotation.latitude;
		win.lng = e.annotation.longitude;
		
		Titanium.UI.currentTab.open(win,{animated:true});
	}
});




