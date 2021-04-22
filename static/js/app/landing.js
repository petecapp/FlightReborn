var win = Titanium.UI.currentWindow;
Ti.UI.setBackgroundColor( '#00b4ff' );

var animation = Titanium.UI.createAnimation();
var flightanimation = Titanium.UI.createAnimation();
animation.opacity = 100;
animation.duration = 750;

flightanimation.top = 85;
flightanimation.duration = 750;

var signupButton = Titanium.UI.createButton({
	title:'Sign Up with Email',
    width:250,
    height:38,
    top: 400,
    borderRadius: 12,
    backgroundImage: 'none',
    backgroundColor: '#009fe1',
    color: '#fff',
	font:{fontSize:16,fontWeight:"bold"},
	opacity:0
});
signupButton.addEventListener('touchstart', function(){
    this.setBackgroundColor('#0184bb');
});
signupButton.addEventListener('touchend', function(){
    this.setBackgroundColor('#009fe1');
});
	
var loginButton = Titanium.UI.createButton({
	title:'Log In',
    width:250,
    height:38,
    top: 450,
    borderRadius: 12,
    backgroundImage: 'none',
    backgroundColor: '#009fe1',
    color: '#fff',
	font:{fontSize:16,fontWeight:"bold"},
	opacity:0
});
loginButton.addEventListener('touchstart', function(){
    this.setBackgroundColor('#0184bb');
});
loginButton.addEventListener('touchend', function(){
    this.setBackgroundColor('#009fe1');
});

var logo =  Titanium.UI.createImageView({
	    backgroundImage:'../images/text-flight@2x.png',
	    height:19,
	    width:121,
	    top:96,
	    left:99
	});
win.add(logo);
logo.animate(flightanimation);

signupButton.addEventListener('click', function()
	{
		var win = Ti.UI.createWindow({
			title:'Sign Up',
			navBarHidden:false,
			barColor: '#00b4ff',
			translucent:false,
			backgroundColor: '#fff',
			url:'account.js'
		});
		var button = Titanium.UI.createButton({
			title:'Close',
			style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
		});
		win.setLeftNavButton(button);
		button.addEventListener('click',function()
		{
			win.close();
		});
		Titanium.UI.currentTab.open(win);
		
	});

loginButton.addEventListener('click', function()
	{
		var win = Ti.UI.createWindow({
			title:'Log In',
			navBarHidden:false,
			barColor: '#00b4ff',
			translucent:false,
			backgroundColor: '#fff',
			url:'login.js'
		});
		var button = Titanium.UI.createButton({
			title:'Cancel',
			style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
		});
		win.setLeftNavButton(button);
		button.addEventListener('click',function()
		{
			win.close();
		});
		Titanium.UI.currentTab.open(win);
		
	});

setTimeout(function()
{
	win.add(signupButton);
	win.add(loginButton);
	signupButton.animate(animation);
	loginButton.animate(animation);
},2000);