var win = Titanium.UI.currentWindow;  

var storedId = Titanium.App.Properties.getString("id");
var storedEmail = Titanium.App.Properties.getString("email");
var storedFirstName = Titanium.App.Properties.getString("first_name");
var storedLastName = Titanium.App.Properties.getString("last_name");
var storedUsername = Titanium.App.Properties.getString("username");
var tab = Titanium.UI.currentTab;

Ti.Geolocation.purpose = "Retrieval of fired Rockets";

var scrollView = Titanium.UI.createScrollView({
	contentWidth:'auto',
	contentHeight:600,
	top:0,
	showVerticalScrollIndicator:true,
	showHorizontalScrollIndicator:true
});
var view = Ti.UI.createView({
	backgroundColor:'transparent',
	width:300,
	height:600,
	top:0
});

scrollView.add(view);

		
var rocketList = Ti.UI.createTableView({
	style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
	headerTitle:'Picked up Rockets',
	backgroundColor:'transparent',
	rowBackgroundColor:'white',
	top:200
});

setData();

function setData()
{
	Titanium.Geolocation.getCurrentPosition(function(e) {
		
		latitude = e.coords.latitude;
		longitude = e.coords.longitude;
		var heading = e.coords.heading;
		
		var xhr = Titanium.Network.createHTTPClient();
		xhr.open("GET","http://app.gsdesign.com/rockets/get_rocket_list_for_profile.php");
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
				
				var row = Ti.UI.createTableViewRow({height:50, latitude:data.markers[c].lat, longitude:data.markers[c].lng, name:data.markers[c].name, message:data.markers[c].message, id:data.markers[c].id, dist:dist});
				var rocket_name = Ti.UI.createLabel({
					text: data.markers[c].name,
					color: '#000',
					textAlign:'left',
					left:10,
					top:0,
					height:40,
					font:{fontWeight:'bold',fontSize:13}
				});
				row.add(rocket_name);
				var rocket_message = Ti.UI.createLabel({
					text: 'Message attached',
					color: '#ff950e',
					textAlign:'left',
					left:10,
					top:20,
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
					top:0,
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
			        	barColor: '#000',
			        	backButtonTitle:'User',
			        	title:e.row.name,
						backgroundImage: '../../images/page-bg.png',
						tabBarHidden:true
					});
					
					win.latitude = e.row.latitude;
				    win.longitude = e.row.longitude;
				    win.name = e.row.name;
				    win.message = e.row.message;
				    win.dist = e.row.dist;
				    win.id = e.row.id;
				    win.annotationTitle = e.row.name;
				    win.pinColor = Titanium.Map.ANNOTATION_PURPLE;
				    
				    Titanium.UI.currentTab.open(win,{animated:true});
				    
				});
			}
			rocketList.setData(rocketData);
		};
	});
}

scrollView.add(rocketList);


// REFRESH BUTTON
var refreshButton = Titanium.UI.createButton({
    systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
});
win.setRightNavButton(refreshButton);

refreshButton.addEventListener('click', function(e)
{
	setData();
});

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


var msg = Titanium.UI.createLabel({  
    text:"\n\nYour ID is:\n" + storedId + "\n\nYour email is:\n" + storedEmail + "\n\nYour name is:\n" + storedFirstName + ' ' + storedLastName + "\n\nYour username is:\n" + storedUsername,  
    top:0,   
    width:300,
    color:'#fff',
    font:{fontSize:11},
    height:'auto'  
});  
view.add(msg);

//LOGOUT DIALOG
var optionsDialogOpts = {
	options:['Logout', 'Cancel'],
	cancel:1,
	title:'You are logged in as ' + storedFirstName
};

var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);

// add event listener
dialog.addEventListener('click',function(e)
{
	if (e.index == 0){
		Ti.App.Properties.setString('loggedIn', "no");
	
		Ti.App.Properties.removeProperty('id');
		Ti.App.Properties.removeProperty('email');
		Ti.App.Properties.removeProperty('first_name');
		Ti.App.Properties.removeProperty('last_name');
		Ti.App.Properties.removeProperty('username');
		Ti.App.Properties.removeProperty('password');
		
		Ti.App.fireEvent('logoutNow');
	}
});

var logoutBtn = Titanium.UI.createButton({  
    title:'Log Out',  
    top:10,
    right:25,  
    width:90,  
    height:35,  
    borderRadius:1,  
    font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}  
});

logoutBtn.addEventListener('click', function(e)  
{  
	dialog.show();
});

scrollView.add(logoutBtn);

win.add(scrollView);