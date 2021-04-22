var win = Titanium.UI.currentWindow;  

Ti.Geolocation.purpose = "Retrieval of fired Rockets";

Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;	
Titanium.Geolocation.distanceFilter = 10;


Titanium.Geolocation.getCurrentPosition(function(e) {
	
	latitude = e.coords.latitude;
    longitude = e.coords.longitude;
    
    var heading = e.coords.heading;
    
	// LAUNCH BUTTON
	var launchBtn = Titanium.UI.createButton({  
	    title:'Launch',  
	    top:300,
	    right:25,  
	    width:90,  
	    height:35,  
	    borderRadius:1,  
	    font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}  
	});  
	win.add(launchBtn);
	
	var arrow =  Titanium.UI.createImageView({
	    backgroundImage:'../../images/compass/arrow.png',
	    height:78,
	    width:6,
	    top:213,
	    left:112
	});
    win.add(arrow);
    
    //97x58
    var dial =  Titanium.UI.createImageView({
	    backgroundImage:'../../images/compass/dial.png',
	    height:200,
	    width:200,
	    top:155,
	    left:15
	});
    win.add(dial);
    Ti.Geolocation.addEventListener('heading', function(e) {
		if (e.success) {
		var t = Ti.UI.create2DMatrix();
		t = t.rotate(360-e.heading.magneticHeading);
		
		dial.transform = t;
		
		}
	});
	
	
	// SLIDERS
	var sangle = Titanium.UI.createSlider({
		min:0,
		max:90,
		value:0,
		width:275,
		height:'auto',
		top:30
	});
	
	var sspeed = Titanium.UI.createSlider({
		min:0,
		max:1000,
		value:0,
		width:275,
		height:'auto',
		top:80
	});
	
	win.add(sangle);
	win.add(sspeed);
	
	var angleArrow =  Titanium.UI.createImageView({
	    backgroundImage:'../../images/launch/angle-arrow.png',
	    height:61,
	    width:276,
	    top:186,
	    left:15
	});
	win.add(angleArrow);
	sangle.addEventListener('change', function(e) {
		var t = Ti.UI.create2DMatrix();
	    t = t.rotate(-sangle.value);
	 
	    angleArrow.transform = t;
	});
	
	
	
	// LABELS
	var sangleLabel = Ti.UI.createLabel({
		top: 5, width:100, left: 120,
		height:'auto',
		text : 'Angle: 0'
	});
	sangle.addEventListener('change', function(e) {
		sangleLabel.text = "Angle: " + Math.round(sangle.value);
	});
	var sspeedLabel = Ti.UI.createLabel({
		top: 55, width:100, left: 120,
		height:'auto',
		text : 'Speed: 0'
	});
	sspeed.addEventListener('change', function(e) {
		sspeedLabel.text = "Speed: " + Math.round(sspeed.value);
	});
	
	win.add(sangleLabel);
	win.add(sspeedLabel);
	
	// TEXT INPUTS
	var name = Titanium.UI.createTextField({
		color:'#336699',
		top:160,
		left:10,
		width:300,
		height:40,
		hintText:'Rocket Name',
		keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	win.add(name);

	
	//LAUNCH BUTTON TRIGGER CALCULATION FUNCTION
	launchBtn.addEventListener('click', function()
	{
		if (name.value != '')  
	    {  
	        Ti.App.fireEvent('calculate', {});	
	    }  
	    else  
	    {  
	        alert("Rocket Name is required");  
	    }
		
	});
	

	// TRAJECTORY CALCULATIONS
	
	Ti.App.addEventListener('calculate',function(e){
		
	    range  = "cannot solve";
	    height = "";
	    time   = "";
	    speed  = "";
	    dist   = "";
	    brng   = ""; 
	
	    // get init velocity, angle, and height
	    var Vo = parseFloat(Math.round(sspeed.value));
	    var th = parseFloat(Math.round(sangle.value));
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
	    	
	    Ti.API.info('Range ' + range);
	    Ti.API.info('Height ' + height);
	    Ti.API.info('Time ' + time);
	    Ti.API.info('Speed ' + speed);
	    Ti.API.info(heading);
	    //trajectoryInfo.text = 'Range: ' + Math.round(range) + ' meters and ' + Math.round(miles*100)/100 + ' miles';
	    
	    // TRAJECTORY TO LANDING SPOT CALCULATIONS
		if (Titanium.Geolocation.hasCompass)
		{
	        Titanium.Geolocation.showCalibration = false;
	         Titanium.Geolocation.headingFilter = 90;
	 
	        Ti.Geolocation.getCurrentHeading(function(e)
	        {
	             if (e.error)
	             {
	                 currentHeading.text = 'error: ' + e.error;
	                 return;
	             }
	            
	            //var magneticHeading = 90;
	            var magneticHeading = e.heading.magneticHeading;
	            //var accuracy = e.heading.accuracy;
	            //var trueHeading = e.heading.trueHeading;
	            //var timestamp = e.heading.timestamp;
	 
	            //Destination point given distance and bearing from start point
			    Ti.include("../../js_includes/geo.js");
			    Ti.include("../../js_includes/latlon.js");
			    
			    var latStart = Geo.parseDMS(latitude);
			    var lonStart = Geo.parseDMS(longitude);
			    var brng = magneticHeading;
			    var dist = miles;
			    var p1 = new LatLon(latStart, lonStart);
			    var p2 = p1.destinationPoint(brng, dist);
			    var brngFinal = p1.finalBearingTo(p2);
				  
				Ti.API.info('Latitude: ' + p2._lat);
				Ti.API.info('Longitude: ' + p2._lon);
				//landingPoint.text = 'New Location: ' + p2.toString();
				
				
				// SAVE ROCKET IN DATABASE
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

				createReq.open("POST","http://app.gsdesign.com/rockets/post_rocket_launch.php");
				var params = {
					name: name.value,
					lat: p2._lat,
					lng: p2._lon
				};
				createReq.send(params);
				
				// CREATE WINDOW THAT SHOWS MAP OR ROCKET LANDING
				win = Titanium.UI.createWindow({
		        	url: 'rocketLanding.js',
		        	barColor: '#000',
					backgroundImage: '../../images/page-bg.png',
					tabBarHidden:true
				});
				
				win.latitude = p2._lat;
			    win.longitude = p2._lon;
			    win.rocketTitle = name.value;
				
				win.hideTabBar();
				Titanium.UI.currentTab.open(win,{animated:true});
	        });
	    }
	    else
	    {
	        Titanium.API.info("No Compass on device");
	    }
	});
});




