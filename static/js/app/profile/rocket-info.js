var win = Titanium.UI.currentWindow;  

var path = Titanium.Filesystem.resourcesDirectory + Titanium.Filesystem.separator;

var storedId = Titanium.App.Properties.getString("id");

var imageView = Titanium.UI.createImageView ({
		image: 'http://petecapp.com/flight/uploaded-photos/' + win.image,
		top: 60,
		height:320
});
alert('http://petecapp.com/flight/uploaded-photos/' + win.image);
if (win.image == ''){
	//Do Nothing
}
else{
	win.add(imageView);
}

var name = Titanium.UI.createLabel({  
    text:win.name,  
    top:15,   
    width:300,
    color:'#000',
    font:{fontSize:25},
    textAlign:'center',
    height:'auto'  
});  
win.add(name);
var message = Titanium.UI.createLabel({  
    text:win.message,  
    top:60,   
    width:275,
    color:'#000',
    font:{fontSize:20},
    textAlign:'center',
    height:'auto'  
});  
win.add(message);
var rocketPositionTitle = Titanium.UI.createLabel({  
    text:"Current Rocket Position:",  
    top:260,  
    left:10,  
    width:300,
    color:'#000',
    font:{fontSize:16},
    textAlign:'center',
    height:'auto'  
});  
win.add(rocketPositionTitle);
var latLabel = Titanium.UI.createLabel({  
    text:'Latitude - ',  
    top:285,  
    left:107,  
    width:300,
    color:'#000',
    font:{fontSize:12},
    height:'auto'  
});  
win.add(latLabel);
var lat = Titanium.UI.createLabel({  
    text:win.lat,  
    top:285,  
    left:161,  
    width:300,
    color:'#43c346',
    font:{fontSize:12},
    height:'auto'  
});  
win.add(lat);
var lngLabel = Titanium.UI.createLabel({  
    text:'Longitude - ',  
    top:300,  
    left:100,  
    width:300,
    color:'#000',
    font:{fontSize:12},
    height:'auto'  
});  
win.add(lngLabel);
var lng = Titanium.UI.createLabel({  
    text:win.lng,  
    top:300,  
    left:165,  
    width:300,
    color:'#43c346',
    font:{fontSize:12},
    height:'auto'  
});  
win.add(lng);

if (win.message == '' | win.message == null){
	message.text  = 'No message attached';
	message.color = '#a9a9a9';
}
// POST BUTTON
var postNavButton = Titanium.UI.createButton({
    backgroundImage: "../../images/icon-post.png", //just change this property
    width:18,
    height:18
});
win.setRightNavButton(postNavButton);


//SETUP ANIMATION
var modalbackgroundanimation = {duration: 300, opacity: 0.5};
var modalcontaineranimation = {duration: 300, opacity: 100};

var myModal = Ti.UI.createWindow({
    title           : 'My Modal',
    backgroundColor : 'transparent'
});

var wrapperView    = Ti.UI.createView(); // Full screen
var backgroundView = Ti.UI.createView({  // Also full screen
    backgroundColor : '#000',
    opacity         : 0
});
 
var containerView  = Ti.UI.createView({  // Set height appropriately
    height          : 275,
    top:50,
    right:20,
    left:20,
    borderRadius: 3,
    opacity:0,
    backgroundColor : '#FFF'
});
var headerView  = Ti.UI.createView({  // Set height appropriately
    height          : 50,
    top:0,
    right:0,
    left:0,
    backgroundColor : '#00b4ff'
});
var someLabel      = Ti.UI.createLabel({
	color:'000',
    title : 'Here is your modal',
    top   : 40
});
var closeButton    = Ti.UI.createButton({
    title  : 'Close',
    top : 10,
    left:10,
    color:'#fff'
});
var postButton    = Ti.UI.createButton({
    title  : 'Post',
    top : 10,
    right:10,
    color:'#fff'
});
closeButton.addEventListener('click', function () {
    myModal.close();
});
var textfield = Titanium.UI.createTextArea({
    color:'#000',
    height:175,
    font:{fontSize:20},
    top:70,
    left:10,
    right:10,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
 
containerView.add(textfield);

containerView.add(someLabel);

containerView.add(headerView);
headerView.add(closeButton);
headerView.add(postButton);

wrapperView.add(backgroundView);
wrapperView.add(containerView);

myModal.add(wrapperView);

postNavButton.addEventListener('click', function(e)
{
	myModal.open();
	backgroundView.animate(modalbackgroundanimation);
	containerView.animate(modalcontaineranimation);
	textfield.focus();
});


