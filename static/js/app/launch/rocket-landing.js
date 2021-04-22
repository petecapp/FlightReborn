var Map = require('ti.map');
var win = Titanium.UI.currentWindow;  

var mapview = Map.createView({
    mapType: Map.STANDARD_TYPE,
    region: {latitude:win.latitude, longitude:win.longitude, 
            latitudeDelta:0.05, longitudeDelta:0.05},
    animate:true,
    regionFit:true,
    userLocation:true
});

var rocketLanding = Map.createAnnotation({
	latitude: win.latitude,
	longitude: win.longitude,
    title: win.rocketTitle,
    subtitle: 'Location Here',
    pincolor: Map.ANNOTATION_RED,
    animate: true
});
mapview.addAnnotation(rocketLanding);

win.add(mapview);

// LAUNCH BUTTON
var finishedBtn = Ti.UI.createButton({  
    title:'Take me Back',  
    top:325,
    right:25,  
    width:90,  
    height:35,  
    borderRadius:1,  
    font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}  
});  
win.add(finishedBtn);

finishedBtn.addEventListener('click', function(e)
{
	if(Ti.currentWindow.rocketStagingWin) { // 2 windows deep
    Ti.currentWindow.rocketStagingWin.close();
}
	win.close();
});
