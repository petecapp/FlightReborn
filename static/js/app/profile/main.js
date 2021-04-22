var Map = require('ti.map');
var win = Titanium.UI.currentWindow;  

var storedId = Titanium.App.Properties.getString("id");
var storedEmail = Titanium.App.Properties.getString("email");
var storedFirstName = Titanium.App.Properties.getString("first_name");
var storedLastName = Titanium.App.Properties.getString("last_name");
var storedUsername = Titanium.App.Properties.getString("username");
var tab = Titanium.UI.currentTab;

Ti.Geolocation.purpose = "Retrieval of fired Rockets";


function setData()
{
	//Rockets Fired and Profile Pic
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open("GET","http://petecapp.com/flight/get_rocket_list_basic.php");
	var params = {
		userId: storedId
	};
	xhr.send(params);
	xhr.onload = function() {
		
		var data = JSON.parse(this.responseText);
		
		//Set rocket count
		rocket_numbers.text = data.markers.length;
		
		//Profile Pic
		for (var i = 0; i < data.markers.length; i++){
			if (data.markers[i].profileImage == null)  
		    {  
		        profileImage.image = '../../images/profile/generic.gif';
		    }  
		    else  
		    {  
		        profileImage.image = 'http://petecapp.com/flight/profile-images/' + data.markers[i].profileImage;
		    } 
		}
	};
	
	//Rockets Fired
	var xhrFired = Titanium.Network.createHTTPClient();
	xhrFired.open("GET","http://petecapp.com/flight/get_rocket_list_fired.php");
	var params = {
		userId: storedId
	};
	xhrFired.send(params);
	xhrFired.onload = function() {
		
		var data = JSON.parse(this.responseText);
		
		//Set rocket count
		rocket_number.text = data.markers.length;
	};
}
setData();

//Rockets Collected Labels
var rocketData = [];
	var rocketsPickedContainer = Ti.UI.createLabel({
		top:175,
		left:45
	});
	var rocket_numbers = Ti.UI.createLabel({
		color: '#000',
		textAlign:'center',
		font:{fontFamily:'Helvetica-Bold',fontWeight:'bold',fontSize:15}
	});
	win.add(rocket_numbers);
	var rockets_picked = Ti.UI.createLabel({
		text: 'Picked Up',
		color: '#a7a7a7',
		top:30,
		textAlign:'center',
		font:{fontFamily:'Helvetica',fontSize:12}
	});
	rocketsPickedContainer.add(rockets_picked);
	rocketsPickedContainer.add(rocket_numbers);
	win.add(rocketsPickedContainer);
	win.setData(rocketData);

// create table view event listener
rocketsPickedContainer.addEventListener('click', function(e)
{	
	// event data
	//Titanium.UI.createAlertDialog({title:'Table View',message:'Latitude ' + e.row.latitude + 'Longitude ' + e.row.longitude}).show();
	
	win = Titanium.UI.createWindow({
    	url: 'rocket-list.js',
    	barColor: '#00b4ff',
    	backButtonTitle:'User',
    	title:'Picked Up',
		backgroundImage: '../../images/page-bg.png',
		tabBarHidden:true
	});
	
    win.pinColor = Map.ANNOTATION_BLUE;
    
    Titanium.UI.currentTab.open(win,{animated:true});
    
});

//Rockets Fired Labels
var rocketDatafired = [];
	var rocketsFiredContainer = Ti.UI.createLabel({
		top:175,
		left:150
	});
	var rocket_number = Ti.UI.createLabel({
		color: '#000',
		textAlign:'center',
		font:{fontFamily:'Helvetica-Bold',fontWeight:'bold',fontSize:15}
	});
	win.add(rocket_number);
	var rockets_pick = Ti.UI.createLabel({
		text: 'Fired',
		color: '#a7a7a7',
		top:30,
		textAlign:'center',
		font:{fontFamily:'Helvetica',fontSize:12}
	});
	rocketsFiredContainer.add(rockets_pick);
	rocketsFiredContainer.add(rocket_number);
	win.add(rocketsFiredContainer);
	win.setData(rocketDatafired);

// create table view event listener
rocketsFiredContainer.addEventListener('click', function(e)
{	
	// event data
	//Titanium.UI.createAlertDialog({title:'Table View',message:'Latitude ' + e.row.latitude + 'Longitude ' + e.row.longitude}).show();
	
	win = Titanium.UI.createWindow({
    	url: 'rocket-list-fired.js',
    	barColor: '#00b4ff',
    	backButtonTitle:'',
    	title:'Picked Up',
		backgroundImage: '../../images/page-bg.png',
		tabBarHidden:true
	});
	
    win.pinColor = Map.ANNOTATION_BLUE;
    
    Titanium.UI.currentTab.open(win,{animated:true});
    
});
//Horizontal Rules
var separatorTop = Ti.UI.createView({
	top:180,
	width:'80%',
	height:1,
	backgroundColor:'#efefef',
});
win.add(separatorTop);
var separatorBottom = Ti.UI.createView({
	top:230,
	width:'80%',
	height:1,
	backgroundColor:'#efefef',
});
win.add(separatorBottom);

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

//UPLOADING PHOTO OVERLAY MESSAGE
var updatingWindow = Titanium.UI.createWindow({
	height:100,
	width:200,
	touchEnabled:false
});

var indView = Titanium.UI.createView({
	height:100,
	width:200,
	backgroundColor:'#000',
	borderRadius:10,
	opacity:0.8,
	touchEnabled:false
});
updatingWindow.add(indView);

var pgLoadInd = Titanium.UI.createActivityIndicator({
    height:'auto',
    top:22,
    style:Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN,
    font: {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'},
    color: 'white',
    width: 'auto'
});

var updatingMessage = Titanium.UI.createLabel({
	text:'Updating photo',
	color:'#fff',
	textAlign:'center',
	font:{fontSize:18,fontWeight:'bold'},
	top:25,
	width:'auto'
});
pgLoadInd.show();
updatingWindow.add(pgLoadInd);
updatingWindow.add(updatingMessage);

var animationProperties = {opacity: 0};

var profileImage = Titanium.UI.createImageView ({
		image: '../../images/profile/generic.gif',
		top: 20,
		left:112,
		width:100,
		height:100
});
win.add(profileImage);

var photoDialogOpts = {
	options:['Take Photo', 'Choose From Library', 'Cancel'],
	cancel:2,
	title:'This photo will be public'
};

var photoDialog = Titanium.UI.createOptionDialog(photoDialogOpts);

//UPDATE PROFILE IMAGE
profileImage.addEventListener('click', function()
{
	photoDialog.show();
    
});
// add event listener
photoDialog.addEventListener('click',function(e)
{
	if (e.index === 0){
		Titanium.Media.showCamera({

			success:function(event)
			{
				var cropRect = event.cropRect;
				var image = event.media;
				
				Titanium.Media.saveToPhotoGallery(image);
				
				profileImage.image = image;
				
				var xhr = Titanium.Network.createHTTPClient();
				xhr.onload = function(){
			  		
			  		if(this.responseText != 'false')
					{
						updatingWindow.animate(animationProperties, function(){
							updatingWindow.close();
						});
						
					}
					else
					{
						updatingMessage.text('Houston we have a problem! Please try again later.');
						updatingWindow.open();
						
						updatingWindow.animate(animationProperties, function()
						{
							updatingWindow.close();
							win.close();
						});
					}
			  	};
			  	
			  	// open the client
				xhr.open("POST","http://petecapp.com/flight/post_profile_image.php");
								
				// send the data
				var params = {
					media: profileImage.image,
					userID:storedId
				};
				xhr.send(params);
			},
			cancel:function()
			{
		
			},
			error:function(error)
			{
				// create alert
				var a = Titanium.UI.createAlertDialog({title:'Camera'});
		
				// set message
				if (error.code == Titanium.Media.NO_CAMERA)
				{
					a.setMessage('Device does not have video recording capabilities');
				}
				else
				{
					a.setMessage('Unexpected error: ' + error.code);
				}
		
				// show alert
				a.show();
			},
			allowEditing:true
		});
	}
	else if(e.index === 1){
		Titanium.Media.openPhotoGallery({
			success:function(event)
			{
				var cropRect = event.cropRect;
				var image = event.media;
		
				// set image view
				Ti.API.debug('Our type was: '+event.mediaType);
				if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
				{
					profileImage.image = image;
					var xhr = Titanium.Network.createHTTPClient();
					
					xhr.onload = function(){
				  		
				  		if(this.responseText != 'false')
						{
							updatingWindow.animate(animationProperties, function(){
								updatingWindow.close();
							});
							
						}
						else
						{
							updatingMessage.text('Houston we have a problem! Please try again later.');
							updatingWindow.open();
							
							updatingWindow.animate(animationProperties, function()
							{
								updatingWindow.close();
								win.close();
							});
						}
				  	};
				  	
				  	// open the client
					xhr.open("POST","http://petecapp.com/flight/post_profile_image.php");
									
					// send the data
					var params = {
						media: profileImage.image,
						userID:storedId
					};
					xhr.send(params);
					
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
	}
	
});

var username = Titanium.UI.createLabel({
	text:storedFirstName + ' ' + storedLastName,  
    top:137,
    textAlign:'center',
    color:'#525252',
    font:{fontFamily:'Helvetica-BoldOblique',fontSize:15,fontWeight:'bold'},
    height:'auto' 
});
win.add(username);
var email = Titanium.UI.createLabel({
	text:storedEmail,  
    top:155,
    textAlign:'center',
    color:'#525252',
    font:{fontSize:13},
    height:'auto' 
});
win.add(email);

// var msg = Titanium.UI.createLabel({  
    // text:"\n\nYour ID is:\n" + storedId + "\n\nYour email is:\n" + storedEmail + "\n\nYour username is:\n" + storedUsername,  
    // top:30,   
    // width:300,
    // color:'#fff',
    // font:{fontSize:11},
    // height:'auto'  
// });  
// view.add(msg);

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
    font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}  
});

logoutBtn.addEventListener('click', function(e)  
{  
	dialog.show();
});

win.setLeftNavButton(logoutBtn);
