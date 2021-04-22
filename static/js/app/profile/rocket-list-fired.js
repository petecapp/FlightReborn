var Map = require('ti.map');
var win = Ti.UI.currentWindow;  

var storedId = Titanium.App.Properties.getString("id");

Ti.Geolocation.purpose = "List view of fired rockets";


Titanium.Geolocation.getCurrentPosition(function(e) {
		
	var rocketList = Ti.UI.createTableView({
	});
	
	latitude = e.coords.latitude;
    longitude = e.coords.longitude;
    var heading = e.coords.heading;
	
	
	function setData()
	{
		var xhr = Titanium.Network.createHTTPClient();
		xhr.open("GET","http://petecapp.com/flight/get_rocket_list_for_profile_fired.php");
		var params = {
			userId: storedId,
			latitude: e.coords.latitude,  
            longitude: e.coords.longitude 
		};
		xhr.send(params);
		xhr.onload = function() {
			
			var data = JSON.parse(this.responseText);
			
			var rocketData = [];
			for (c=0; c<data.markers.length; c++)
			{
				//DISTANCE FROM MARKER CALCULATION
				var dist  = Math.round(10*data.markers[c].distance)/10;
				
				var row = Ti.UI.createTableViewRow({selectedBackgroundColor:'#d7f3ff',height:50, latitude:data.markers[c].lat, longitude:data.markers[c].lng, name:data.markers[c].name, message:data.markers[c].message, id:data.markers[c].id, dist:dist});
				var rocket_name = Ti.UI.createLabel({
					text: data.markers[c].name,
					color: '#000',
					textAlign:'left',
					left:35,
					top:0,
					height:40,
					font:{fontWeight:'bold',fontSize:13}
				});
				row.add(rocket_name);
				var rocket_message = Ti.UI.createLabel({
					text: 'Message attached',
					color: '#00b4ff',
					textAlign:'left',
					left:35,
					top:30,
					font:{fontSize:11}
				});
				row.add(rocket_message);
				
				//LOCATE ICON
				var locateIcon = Ti.UI.createImageView({image:'../../images/gps-icon.png', left:10,height:19, width:14});
        		row.add(locateIcon);
				
				if (data.markers[c].message == '' | data.markers[c].message == null){
					rocket_message.text  = 'No message attached';
					rocket_message.color = '#a9a9a9';
				}
				
				var rocket_dist = Ti.UI.createLabel({
					text: dist + ' mi',
					color: '#777777',
					textAlign:'right',
					right:10,
					top:18,
					font:{fontSize:11}
				});
				row.add(rocket_dist);
				rocketData.push(row);
				
				// create table view event listener
				row.addEventListener('click', function(e)
				{	
					// event data
					//Titanium.UI.createAlertDialog({title:'Table View',message:'Latitude ' + e.row.latitude + 'Longitude ' + e.row.longitude}).show();
					
					win = Titanium.UI.createWindow({
			        	url: 'user-rockets.js',
			        	barColor: '#00b4ff',
			        	backButtonTitle:'List',
			        	title:e.row.name,
						backgroundImage: '../../images/page-bg.png',
						tabBarHidden:true
					});
					
					win.latitude = e.row.latitude;
				    win.longitude = e.row.longitude;
				    win.name = e.row.name;
				    win.message = e.row.message;
				    win.image = e.row.image;
				    win.dist = e.row.dist;
				    win.id = e.row.id;
				    win.annotationTitle = e.row.name;
				    win.pinColor = Map.ANNOTATION_BLUE;
				    
				    Titanium.UI.currentTab.open(win,{animated:true});
				    
				});
			}
			rocketList.setData(rocketData);
		};
	}
	
	win.add(rocketList);
	setData();
	
	// REFRESH BUTTON
	var refreshButton = Titanium.UI.createButton({
	    systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
	});
	win.setRightNavButton(refreshButton);
	
	refreshButton.addEventListener('click', function(e)
	{
		setTimeout(function()
		{
			setData();
		},500);
	});
});

