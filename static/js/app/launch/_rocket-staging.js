var win = Titanium.UI.currentWindow;  

var disp = Ti.UI.createLabel
({
    top:155,
    height: 50,
    width:300,
    text: Ti.Platform.availableMemory
});
win.add(disp);

// We check up on the memory status every second
setInterval
(
    function()
    {
        disp.text=Ti.Platform.availableMemory;
    },
    1000
);

var path = Titanium.Filesystem.resourcesDirectory + Titanium.Filesystem.separator;

Ti.Geolocation.purpose = "Launch Rocket from current position";
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;	
Titanium.Geolocation.distanceFilter = 10;

//TEXT FIELDS
var name = Titanium.UI.createTextField({
	color:'#000000',
	top:10,
	left:10,
	width:300,
	height:30,
	hintText:'Have a name for this thing?',
	font:{fontWeight:'bold',fontSize:14},
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_DONE,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
});
win.add(name);

var value = '';
var hintText = "Have a message to attach?";
 
var hint = Ti.UI.createLabel({
    text: hintText,
    top:-60,
    left:4,
    color: 'gray',
    font:{fontSize:13},
    textAlign: 'left',
    backgroundColor: 'transparent',
    touchEnabled: true
});

var message = Titanium.UI.createTextArea({
	color:'#000000',
	top:60,
	left:6,
	width:200,
	height:95,
	value:value,
	font:{fontSize:14},
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_DONE,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
});

win.add(message);
message.add(hint);

if (message.value.length > 0) {
    hint.hide();
}
 
//*** Hint text appears when TextArea is blank, disappears when text is entered
message.addEventListener('change', function(e) {
    if (e.source.value.length > 0) {
        hint.hide();
    } else {
        hint.show();
    }
});
//*** Make sure that TextArea gets focus if they tap the hint label
hint.addEventListener('click', function(e) {
    message.focus();
});


var character = Ti.UI.createLabel({
	text: '140',
	color: '#7f7f7f',
	textAlign:'right',
	right:110,
	top:125,
	height:40,
	font:{fontSize:11}
});
win.add(character);

name.addEventListener('change', function(e)
{
	e.source.value = e.source.value.slice(0,60);
});

//CHARACTER LIMIT
message.addEventListener('change', function(e)
{
	e.source.value = e.source.value.slice(0,200);
	
	if (e.source.value > 140)
	{
		e.source.value = e.source.value.substring(0, 140);
	}
	else
	{
		character.text = 140 - e.source.value.length;
	}
	if (e.value.length >= 141)
	{
		character.color = '#ff0000';
	}
	else
	{
		character.color = '#7f7f7f';
	}
});

//BUTTONS
var photoButton = Ti.UI.createImageView({
	image:path + 'images/launch/btn-attach-image.png',
	width:84,
	height:84,
	top:60,
	left:225
});
win.add(photoButton);

var angleButton = Ti.UI.createButton({
	backgroundImage: path + 'images/launch/btn-angle.png',
	width:84,
	height:84,
	top:200,
	left:13
});
win.add(angleButton);

var speedButton = Ti.UI.createButton({
	backgroundImage: path + 'images/launch/btn-speed.png',
	width:84,
	height:84,
	top:200,
	left:117
});
win.add(speedButton);

var headingButton = Ti.UI.createButton({
	backgroundImage: path + 'images/launch/btn-heading.png',
	width:84,
	height:84,
	top:200,
	left:222
});
win.add(headingButton);

photoButton.addEventListener('click',function()
	{
	Titanium.Media.openPhotoGallery({
		success:function(event)
		{
			var cropRect = event.cropRect;
			var image = event.media;
	
			// set image view
			Ti.API.debug('Our type was: '+event.mediaType);
			if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
			{
				photoButton.image = image;
			}
			else
			{
				// is this necessary?
			}
	
			Titanium.API.info('PHOTO GALLERY SUCCESS cropRect.x ' + cropRect.x + ' cropRect.y ' + cropRect.y  + ' cropRect.height ' + cropRect.height + ' cropRect.width ' + cropRect.width);
		},
		cancel:function()
		{
	
		},
		error:function(error)
		{
		},
		allowEditing:true,
		mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
	});
});

angleButton.addEventListener('click',function()
	{
	var win = Ti.UI.createWindow({
		title:'Angle',
		navBarHidden:false,
		barColor: '#000',
		backgroundImage: path + 'images/launch/retrieve-info-bg.png',
		url:'rocket-properties/angle.js',
		cancel:function()
	    {
	 
	    }
	});
	win.open({modal:true,modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,modalStyle:Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN,navBarHidden:true});
});
speedButton.addEventListener('click',function()
	{
	var win = Ti.UI.createWindow({
		title:'Speed',
		navBarHidden:false,
		barColor: '#000',
		backgroundImage: path + 'images/launch/retrieve-info-bg.png',
		url:'rocket-properties/speed.js'
	});
	win.open({modal:true,modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,modalStyle:Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN,navBarHidden:true});
});
headingButton.addEventListener('click',function()
	{
	var win = Ti.UI.createWindow({
		title:'Heading',
		navBarHidden:false,
		barColor: '#000',
		backgroundImage: path + 'images/launch/retrieve-info-bg.png',
		url:'rocket-properties/heading.js'
	});
	win.open({modal:true,modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,modalStyle:Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN,navBarHidden:true});
});

var angleLabel = Ti.UI.createLabel({
    text:"Angle:",
    height: 50,
    width: 'auto',
    top:275,
	left:5
});
win.add(angleLabel);
var speedLabel = Ti.UI.createLabel({
    text:"Speed:",
    height: 50,
    width: 'auto',
    top:300,
	left:5
});
win.add(speedLabel);
var headingLabel = Ti.UI.createLabel({
    text:"Heading:",
    height: 50,
    width: 'auto',
    top:325,
	left:5
});
win.add(headingLabel);

//UPDATED VALUES FOR ANGLE,SPEED AND HEADING
Ti.App.addEventListener('updateAngle', function(data){
   Ti.API.info( "Angle: " + data.angleData );
   angleLabel.text = 'Angle: ' + data.angleData;
});
Ti.App.addEventListener('updateSpeed', function(data){
   Ti.API.info( "Speed: " + data.speedData );
   speedLabel.text = 'Speed: ' + data.speedData;
});
Ti.App.addEventListener('updateHeading', function(data){
   Ti.API.info( "Heading: " + data.headingData );
   headingLabel.text = 'Heading: ' + Math.round(data.headingData);
});


//LOGOUT DIALOG
var optionsDialogOpts = {
	options:['Launch', 'Cancel'],
	cancel:1,
	title:'Are you sure you are ready?'
};

var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);

// LAUNCH BUTTON
var launchBtn = Titanium.UI.createButton({  
    title:'Launch',  
    top:325,
    right:25,  
    width:90,  
    height:35,  
    borderRadius:1,  
    font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}  
});  
win.add(launchBtn);


    
//LAUNCH BUTTON TRIGGER CALCULATION FUNCTION
launchBtn.addEventListener('click', function()
{
	if (name.value != '')  
    {  
    	dialog.show();
    }  
    else  
    {  
        alert("Rocket Name is required");  
    }
});
// add event listener
dialog.addEventListener('click',function(e)
{
	if (e.index == 0){
		Ti.App.fireEvent('calculate', {});
	}
});



// TRAJECTORY CALCULATIONS
Ti.App.addEventListener('calculate',function(e){
	Titanium.Geolocation.getCurrentPosition(function(e) {

		latitude = e.coords.latitude;
		longitude = e.coords.longitude;
		var rocketAngle = Titanium.App.Properties.getString("angle");
		var rocketSpeed = Titanium.App.Properties.getString("speed");
		var rocketHeading = Titanium.App.Properties.getString("heading");
		
	    range  = "cannot solve";
	    height = "";
	    time   = "";
	    speed  = "";
	    dist   = "";
	    brng   = ""; 
	
	    // get init velocity, angle, and height
	    var Vo = parseFloat(Math.round(rocketSpeed));
	    var th = parseFloat(Math.round(rocketAngle));
	    var Yo = parseFloat(Math.round(0));
		
		if ((th > 90.0)||(th < 0.0)||(Vo < 0.0)) return;
	
	    th = (Math.PI/180.0)*th;              // convert to radians
	
	    var Ge = parseFloat(9.81);            // acceleration of gravity -- meters/sec/sec
	    var Vx = Vo*Math.cos(th);             // init horizontal velocity
	    var Vy = Vo*Math.sin(th);             // init vertical velocity
	
	    var hgt = Yo + Vy*Vy/(2*Ge);          // max height
	
	    if (hgt < 0.0) return;
	
	    var upt = Vy/Ge;                      // time to max height
	    var dnt = Math.sqrt(2*hgt/Ge);        // time from max height to impact
	    var rng = Vx*(upt + dnt);             // horizontal range at impact
	
	    // flight time to impact, speed at impact
	    var imp = upt + dnt;
	    var spd = Math.sqrt((Ge*dnt)*(Ge*dnt) + Vx*Vx);
	
		range  = Math.round(100000.0*rng)/100000.0;
	    height = Math.round(100000.0*hgt)/100000.0;
	    time   = Math.round(100000.0*imp)/100000.0;
	    speed  = Math.round(100000.0*spd)/100000.0;
		miles  = range * 0.00062137119;
	    
	    Ti.API.info('------------------------------');
	    
	    Ti.API.info('Range ' + range);
	    Ti.API.info('Height ' + height);
	    Ti.API.info('Time ' + time);
	    Ti.API.info('Speed ' + speed);
	    Ti.API.info('Miles ' + miles);
	    
	    Ti.API.info('------------------------------');
	    
	    Ti.API.info(rocketAngle);
	    Ti.API.info(rocketSpeed);
	    Ti.API.info(rocketHeading);
	    //trajectoryInfo.text = 'Range: ' + Math.round(range) + ' meters and ' + Math.round(miles*100)/100 + ' miles';
	    
 		//DESTINATION POINT GIVEN DISTANCE AND BEARING FROM START POINT
	    Ti.include("../../js_includes/geo.js");
	    Ti.include("../../js_includes/latlon.js");
	    
	    
	    
	    var latStart = Geo.parseDMS(latitude);
	    var lonStart = Geo.parseDMS(longitude);
	    var brng = Math.round(rocketHeading);
	    var dist = miles;
	    var p1 = new LatLon(latStart, lonStart);
	    var p2 = p1.destinationPoint(brng, dist);
	    var brngFinal = p1.finalBearingTo(p2);
		  
		Ti.API.info('Latitude: ' + p2._lat);
		Ti.API.info('Longitude: ' + p2._lon);
		//landingPoint.text = 'New Location: ' + p2.toString();
		
		// SAVE ROCKET IN DATABASE
		var xhr = Titanium.Network.createHTTPClient();
		
		xhr.open("POST","http://app.gsdesign.com/rockets/post_rocket_launch.php");
		var params = {
			name: name.value,
			message: message.value,
			lat: p2._lat,
			lng: p2._lon
		};
		xhr.send(params);
		
		xhr.onload = function()
		{
			if (this.responseText == "Insert Failed")
			{
				// window container
				var calculateWindow = Titanium.UI.createWindow({
					height:100,
					width:200,
					touchEnabled:false
				});
		
				// black view
				var indView = Titanium.UI.createView({
					height:100,
					width:200,
					backgroundColor:'#000',
					borderRadius:10,
					opacity:0.8,
					touchEnabled:false
				});
				calculateWindow.add(indView);
		
				// message
				var calculateMessage = Titanium.UI.createLabel({
					text:'Houston we have a problem! Please try again later.',
					color:'#fff',
					textAlign:'center',
					font:{fontSize:18,fontWeight:'bold'},
					height:'auto',
					width:'auto'
				});
				calculateWindow.add(calculateMessage);
				calculateWindow.open();
		
				var animationProperties = {delay: 3000, duration: 2000, opacity: 0};
				
				calculateWindow.animate(animationProperties, function()
				{
					calculateWindow.close();
					win.close();
				});
			}
			else
			{
				// window container
				var calculateWindow = Titanium.UI.createWindow({
					height:100,
					width:200,
					touchEnabled:false
				});
		
				// black view
				var indView = Titanium.UI.createView({
					height:100,
					width:200,
					backgroundColor:'#000',
					borderRadius:10,
					opacity:0.8,
					touchEnabled:false
				});
				calculateWindow.add(indView);
				
				// page load indicator
				var pgLoadInd = Titanium.UI.createActivityIndicator({
				    height:'auto',
				    top:22,
				    style:Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN,
				    font: {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'},
				    color: 'white',
				    width: 'auto'
				});
				
				// message
				var calculateMessage = Titanium.UI.createLabel({
					text:'Calculating',
					color:'#fff',
					textAlign:'center',
					font:{fontSize:18,fontWeight:'bold'},
					top:25,
					width:'auto'
				});
				pgLoadInd.show();
				calculateWindow.add(pgLoadInd);
				calculateWindow.add(calculateMessage);
				calculateWindow.open();
		
				var animationProperties = {delay: 3000, duration: 2000, opacity: 0};
				
				calculateWindow.animate(animationProperties, function()
				{
					// CREATE WINDOW THAT SHOWS MAP OR ROCKET LANDING
					win = Titanium.UI.createWindow({
			        	url: 'rocket-landing.js',
			        	barColor: '#000',
						backgroundImage: '../../images/page-bg.png',
						tabBarHidden:true,
						navBarHidden:true,
						rocketStagingWin:Titanium.UI.currentWindow
					});
					
					win.latitude = p2._lat;
				    win.longitude = p2._lon;
				    win.rocketTitle = name.value;
					
					win.open({modal:true,modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,modalStyle:Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN,navBarHidden:true});
					
					calculateWindow.close();
					
				});
			}
		};
	});
});
