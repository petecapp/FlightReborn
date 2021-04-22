var win = Titanium.UI.currentWindow;  

var path = Titanium.Filesystem.resourcesDirectory + 
   Titanium.Filesystem.separator;
   
Ti.Geolocation.purpose = "Retrieval of fired Rockets";

Ti.App.Properties.removeProperty('heading');

var updatedHeading = Titanium.UI.createLabel({
	text:'0' + "\u00B0",
	top:10,
	right:125,
    width:300,
    color:'#fff',
    font:{fontSize:50},
    shadowColor:'black',
    shadowOffset:{x:0,y:1},
    textAlign:'right',
    height:'auto' 
});
win.add(updatedHeading);

//COMPASS
var dial =  Titanium.UI.createImageView({
    backgroundImage:path + 'images/compass/dial.png',
    height:181,
    width:181,
    top:74,
    left:69
});
win.add(dial);
var arrow =  Titanium.UI.createImageView({
    backgroundImage:path + 'images/compass/arrow.png',
    height:86,
    width:23,
    top:122,
    left:149
});
win.add(arrow);
var doneButton = Ti.UI.createButton({
	backgroundImage: path + 'images/launch/btn-set-heading.png',
	backgroundSelectedImage: path + 'images/launch/btn-set-heading-over.png',
	height:42,
	width:298,
	top:350,
	color:'#3a3a3a',
	font:{fontSize:16,fontWeight:"bold"}
});
var closeButton = Ti.UI.createButton({
	backgroundImage: path + 'images/launch/btn-set-heading.png',
	backgroundSelectedImage: path + 'images/launch/btn-set-heading-over.png',
	height:42,
	width:298,
	top:350,
	color:'#3a3a3a',
	font:{fontSize:16,fontWeight:"bold"}
});
var text = Ti.UI.createLabel({
	text:"Use the compass to adjust the heading",
	top:305,   
    width:300,
    color:'#fff',
    font:{fontSize:17},
    shadowColor:'black',
    shadowOffset:{x:0,y:1},
    textAlign:'center',
    height:'auto' 
});
win.add(text);
if (Titanium.Geolocation.hasCompass)
{
	win.add(doneButton);
	
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Titanium.Geolocation.showCalibration = false;
		
	Ti.Geolocation.addEventListener('heading', function(e) {
		var magneticHeading = e.heading.magneticHeading;
	    var accuracy = e.heading.accuracy;
	    var trueHeading = e.heading.trueHeading;
	    var timestamp = e.heading.timestamp;
	    
		if (e.success) {
			var t = Ti.UI.create2DMatrix();
			t = t.rotate(360-e.heading.trueHeading);
		
			dial.transform = t;
			updatedHeading.text = Math.round(e.heading.trueHeading) + "\u00B0";	
		}
	});
	doneButton.addEventListener('click',function()
	{
		Ti.Geolocation.getCurrentHeading(function(e)
		{
			if (e.error)
			{
				currentHeading.text = 'error: ' + e.error;
				Ti.API.info("Code translation: "+translateErrorCode(e.code));
				return;
			}
			var x = e.heading.x;
			var y = e.heading.y;
			var z = e.heading.z;
			var magneticHeading = e.heading.magneticHeading;
			var accuracy = e.heading.accuracy;
			var trueHeading = e.heading.trueHeading;
			var timestamp = e.heading.timestamp;

			Ti.App.fireEvent('updateHeading', {headingData: e.heading.trueHeading});
			Ti.App.Properties.setString('heading', e.heading.trueHeading);
			win.close();
		});
	});
}
else
{
	win.add(closeButton);
	
    Titanium.API.info("No Compass on device");
    
	closeButton.addEventListener('click',function()
	{
		Ti.App.fireEvent('updateHeading', {headingData: 240.1235431});
		Ti.App.Properties.setString('heading', 240.1235431);
		win.close();
	});

}



	





