var win = Titanium.UI.currentWindow;  

var path = Titanium.Filesystem.resourcesDirectory + 
   Titanium.Filesystem.separator;

Ti.App.Properties.removeProperty('speed');

var updatedSpeed = Titanium.UI.createLabel({
	text:'0',
	top:7,
	right:125,
    width:300,
    color:'#fff',
    font:{fontSize:50},
    shadowColor:'black',
    shadowOffset:{x:0,y:1},
    textAlign:'right',
    height:'auto' 
});
win.add(updatedSpeed);

// SLIDERS
var sspeed = Titanium.UI.createSlider({
	min:0,
	max:1000,
	value:0,
	width:275,
	height:'auto',
	top:275
});
win.add(sspeed);

//IMAGES
var speedChart =  Titanium.UI.createImageView({
    backgroundImage:path + 'images/launch/speed-chart.png',
    height:193,
    width:70,
    top:60,
    left:200
});
win.add(speedChart);

var speedArrow =  Titanium.UI.createImageView({
    backgroundImage:path + 'images/launch/speed-arrow.png',
    height:32,
    width:153,
    top:230,
    left:50
});
win.add(speedArrow);

sspeed.addEventListener('change', function(e) {
	var t = Ti.UI.create2DMatrix();
    t = t.translate(0, -sspeed.value/6);
 
    speedArrow.transform = t;
    
    updatedSpeed.text = Math.round(sspeed.value);
});

var text = Ti.UI.createLabel({
	text:"Use the slider to adjust the thrust",
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

var doneButton = Ti.UI.createButton({
	backgroundImage: path + 'images/launch/btn-set-speed.png',
	backgroundSelectedImage: path + 'images/launch/btn-set-speed-over.png',
	height:42,
	width:298,
	top:350,
	color:'#3a3a3a',
	font:{fontSize:16,fontWeight:"bold"}
});
doneButton.addEventListener('click',function()
{
	Ti.App.fireEvent('updateSpeed', {speedData: sspeed.value});
	Ti.App.Properties.setString('speed', sspeed.value);
	win.close();
});
win.add(doneButton);

	





