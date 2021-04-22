var win = Titanium.UI.currentWindow;  
Ti.Geolocation.purpose = "Retrieval of fired Rockets";

Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;	
Titanium.Geolocation.distanceFilter = 10;

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

//COMPASS
var dial =  Titanium.UI.createImageView({
    backgroundImage:'../../images/compass/dial.png',
    height:200,
    width:200,
    top:100,
    left:55
});
win.add(dial);
var arrow =  Titanium.UI.createImageView({
    backgroundImage:'../../images/compass/arrow.png',
    height:78,
    width:6,
    top:158,
    left:152
});
win.add(arrow);

Titanium.Geolocation.getCurrentPosition(function(e) {
	
	latitude = e.coords.latitude;
    longitude = e.coords.longitude;
    
    var heading = e.coords.heading;
	
	Ti.Geolocation.addEventListener('heading', function(e) {
		if (e.success) {
			var t = Ti.UI.create2DMatrix();
			t = t.rotate(360-e.heading.magneticHeading);
		
			dial.transform = t;
		}
	});
	//LAUNCH BUTTON TRIGGER CALCULATION FUNCTION
	launchBtn.addEventListener('click', function()
	{
		Ti.App.fireEvent('calculate', {});
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
	    var Vo = parseFloat(Math.round(win.speed));
	    var th = parseFloat(Math.round(win.angle));
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
		// if (Titanium.Geolocation.hasCompass)
		// {
	        // Titanium.Geolocation.showCalibration = false;
	         // Titanium.Geolocation.headingFilter = 90;
// 	 
	        // Ti.Geolocation.getCurrentHeading(function(e)
	        // {
	             // if (e.error)
	             // {
	                 // currentHeading.text = 'error: ' + e.error;
	                 // return;
	             // }
	            
	            var magneticHeading = 90;
	            //var magneticHeading = e.heading.magneticHeading;
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
					name: win.name,
					message: win.message,
					lat: p2._lat,
					lng: p2._lon
				};
				createReq.send(params);
				
				//THIS VAR IS CREATED TO PASS THE NAME OF THE ROCKET. IT WILL NOT PASS WIN.NAME
				var rocketname = win.name;
				
				// CREATE WINDOW THAT SHOWS MAP OR ROCKET LANDING
				win = Titanium.UI.createWindow({
		        	url: 'rocket-landing.js',
		        	barColor: '#000',
					backgroundImage: '../../images/page-bg.png',
					tabBarHidden:true,
					navBarHidden:true
				});
				
				win.latitude = p2._lat;
			    win.longitude = p2._lon;
			    win.rocketTitle = rocketname;
				
				win.hideTabBar();
				Titanium.UI.currentTab.open(win,{animated:true});
	        //});
	    // }
	    // else
	    // {
	        // Titanium.API.info("No Compass on device");
	    // }
	});
});

	





