var win = Titanium.UI.currentWindow;  

var path = Titanium.Filesystem.resourcesDirectory + Titanium.Filesystem.separator;

Ti.App.Properties.removeProperty('angle');

var updatedAngle = Titanium.UI.createLabel({
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
win.add(updatedAngle);

// SLIDERS
var sangle = Titanium.UI.createSlider({
	min:0,
	max:90,
	value:0,
	width:275,
	height:'auto',
	top:275
});
win.add(sangle);

//IMAGES
var angleChart =  Titanium.UI.createImageView({
    backgroundImage:path + 'images/launch/angle-chart.png',
    height:165,
    width:165,
    top:80,
    left:81
});
win.add(angleChart);

var angleArrow =  Titanium.UI.createImageView({
    backgroundImage:path + 'images/launch/angle-arrow.png',
    height:61,
    width:276,
    top:207,
    left:-47
});
win.add(angleArrow);

sangle.addEventListener('change', function(e) {
	var t = Ti.UI.create2DMatrix();
    t = t.rotate(-sangle.value);
 
    angleArrow.transform = t;
    updatedAngle.text = Math.round(sangle.value) + "\u00B0";	
});

var text = Ti.UI.createLabel({
	text:"Use the slider to adjust the angle",
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
	backgroundImage: path + 'images/launch/btn-set-angle.png',
	backgroundSelectedImage: path + 'images/launch/btn-set-angle-over.png',
	height:42,
	width:298,
	top:350,
	color:'#3a3a3a',
	font:{fontSize:16,fontWeight:"bold"}
});
doneButton.addEventListener('click',function()
{
	Ti.App.fireEvent('updateAngle', {angleData: sangle.value});
	Ti.App.Properties.setString('angle', sangle.value);
	win.close();
});
win.add(doneButton);
	





