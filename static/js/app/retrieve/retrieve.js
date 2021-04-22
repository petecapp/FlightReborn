var Map = require('ti.map');
var win = Ti.UI.currentWindow;

Ti.Geolocation.purpose = "Retrieval of fired Rockets";

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
pgLoadInd.show();
Titanium.UI.currentWindow.add(pgLoadInd);

var rocketList = Ti.UI.createTableView({
});

function formatDate()
{
	var date = new Date;
	var datestr = date.getMonth()+'/'+date.getDate()+'/'+date.getFullYear();
	if (date.getHours()>=12)
	{
		datestr+=' '+(date.getHours()==12 ? date.getHours() : date.getHours()-12)+':'+date.getMinutes()+' PM';
	}
	else
	{
		datestr+=' '+date.getHours()+':'+date.getMinutes()+' AM';
	}
	return datestr;
}
var lastRow = 4;

function setData()
{
	Titanium.Geolocation.getCurrentPosition(function(e) {
		var xhr = Titanium.Network.createHTTPClient();
		xhr.setTimeout(30000);
		
		
		xhr.onload = function() {
			
			pgLoadInd.hide();
			
			latitude = e.coords.latitude;
    		longitude = e.coords.longitude;
    		var heading = e.coords.heading;
			
			var data = JSON.parse(this.responseText);
			
			var rocketData = [];
			for (c=0; c<data.markers.length; c++)
			{
				var dist  = Math.round(10*data.markers[c].distance)/10;
				
				var row = Ti.UI.createTableViewRow({selectedBackgroundColor:'#d7f3ff',height:50, latitude:data.markers[c].lat, longitude:data.markers[c].lng, name:data.markers[c].name, message:data.markers[c].message, image:data.markers[c].image, id:data.markers[c].id, dist:dist});
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
				
				//LOCATE ICON
				var locateIcon = Ti.UI.createImageView({image:'../../images/gps-icon.png', left:10,height:19, width:14});
        		row.add(locateIcon);
        		
				rocketData.push(row);
				
				// create table view event listener
				row.addEventListener('click', function(e)
				{	
					// event data
					//Titanium.UI.createAlertDialog({title:'Table View',message:'Latitude ' + e.row.latitude + 'Longitude ' + e.row.longitude}).show();
					
					win = Titanium.UI.createWindow({
			        	url: 'retrieve-from-list.js',
			        	barColor: '#00b4ff',
			        	backButtonTitle:'Retrieve',
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
				    win.pinColor = Map.ANNOTATION_GREEN;
				    
				    Titanium.UI.currentTab.open(win,{animated:true});
				    
				});
			}
			rocketList.setData(rocketData);
		};
		
		var start;
		
		xhr.onerror = function(e)
		{
			var now = new Date();
			var time = (((now - start) / 1000) | 0);
			alert('Registered error: time passed = ' + (now-start) + ' seconds');

		};
		
		xhr.open("GET","http://petecapp.com/flight/get_map_data.php");
		//xhr.open("GET","http://app.gsdesign.com/rockets/get_map_data.php");
		
		var params = {  
            latitude: e.coords.latitude,  
            longitude: e.coords.longitude  
        };  
        
        xhr.send(params);
	});
}

// MAP BUTTON
var mapButton = Titanium.UI.createButton({
    title:'Map',
    color: 'white'
});
win.setRightNavButton(mapButton);

mapButton.addEventListener('click', function(e)
{
	win2 = Titanium.UI.createWindow({
    	url: 'map-view.js',
    	barColor: '#00b4ff',
		backgroundImage: '../../images/page-bg.png',
		tabBarHidden:true
	});
	win2.latitude = latitude;
	win2.longitude = longitude;
	Titanium.UI.currentTab.open(win2,{animated:true});
});

// PULLDOWN REFRESH
var border = Ti.UI.createView({
	backgroundColor:"#00b4ff",
	height:0,
	bottom:0
});

var tableHeader = Ti.UI.createView({
	backgroundColor:"#00a2e5",
	width:320,
	height:60
});

// fake it til ya make it..  create a 2 pixel
// bottom border
tableHeader.add(border);

var arrow = Ti.UI.createView({
	backgroundImage:"../../images/whiteArrow.png",
	width:22,
	height:26,
	bottom:15,
	left:20
});

var statusLabel = Ti.UI.createLabel({
	text:"Pull to reload",
	left:55,
	width:200,
	bottom:30,
	height:"auto",
	color:"#fff",
	textAlign:"center",
	font:{fontSize:13,fontWeight:"bold"}
});

var lastUpdatedLabel = Ti.UI.createLabel({
	text:"Last Updated: "+formatDate(),
	left:55,
	width:200,
	bottom:15,
	height:"auto",
	color:"#fff",
	textAlign:"center",
	font:{fontSize:12}
});

var actInd = Titanium.UI.createActivityIndicator({
	left:20,
	bottom:13,
	width:30,
	height:30
});

tableHeader.add(arrow);
tableHeader.add(statusLabel);
tableHeader.add(lastUpdatedLabel);
tableHeader.add(actInd);

rocketList.headerPullView = tableHeader;


var pulling = false;
var reloading = false;

function beginReloading()
{
	// just mock out the reload
	setTimeout(endReloading,1000);
}

function endReloading()
{
	rocketList.setData([]);
	setData();

	// when you're done, just reset
	rocketList.setContentInsets({top:0},{animated:true});
	reloading = false;
	lastUpdatedLabel.text = "Last Updated: "+formatDate();
	statusLabel.text = "Pull down to refresh...";
	actInd.hide();
	arrow.show();
}
var offset = 0;
rocketList.addEventListener('scroll',function(e)
{
	offset = e.contentOffset.y;
	if (offset <= -65.0 && !pulling)
	{
		var t = Ti.UI.create2DMatrix();
		t = t.rotate(-180);
		pulling = true;
		arrow.animate({transform:t,duration:180});
		statusLabel.text = "Release to refresh...";
	}
	else if (pulling && offset > -65.0 && offset < 0)
	{
		pulling = false;
		var t = Ti.UI.create2DMatrix();
		arrow.animate({transform:t,duration:180});
		statusLabel.text = "Pull down to refresh...";
	}
});

rocketList.addEventListener('dragEnd',function(e)
{
	if (pulling && !reloading && offset <= -65.0)
	{
		reloading = true;
		pulling = false;
		arrow.hide();
		actInd.show();
		statusLabel.text = "Reloading...";
		rocketList.setContentInsets({top:60},{animated:true});
		arrow.transform=Ti.UI.create2DMatrix();
		beginReloading();
	}
});

win.add(rocketList);
setData();

var paused = false;

Titanium.App.addEventListener('pause',function(e)
{
	paused = true;
});

Titanium.App.addEventListener('resume',function(e)
{
	if (paused)
	{
		setData();
	}

});
