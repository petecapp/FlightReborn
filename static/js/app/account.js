var win = Titanium.UI.currentWindow;

/*
* Interface
*/
var scrollView = Titanium.UI.createScrollView({
    contentWidth:'auto',
    contentHeight:'auto',
    top:0,
    showVerticalScrollIndicator:true,
    showHorizontalScrollIndicator:false
});
win.add(scrollView);

var username = Titanium.UI.createTextField({
	color:'#336699',
	top:10,
	left:10,
	width:300,
	height:40,
	hintText:'Username',
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_NEXT,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
scrollView.add(username);

var password1 = Titanium.UI.createTextField({
	color:'#336699',
	top:60,
	left:10,
	width:300,
	height:40,
	hintText:'Password',
	passwordMask:true,
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_NEXT,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
scrollView.add(password1);

var password2 = Titanium.UI.createTextField({
	color:'#336699',
	top:110,
	left:10,
	width:300,
	height:40,
	hintText:'Password Again',
	passwordMask:true,
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_NEXT,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
scrollView.add(password2);

var first_name = Titanium.UI.createTextField({
	color:'#336699',
	top:160,
	left:10,
	width:300,
	height:40,
	hintText:'First Name',
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_NEXT,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
scrollView.add(first_name);

var last_name = Titanium.UI.createTextField({
	color:'#336699',
	top:210,
	left:10,
	width:300,
	height:40,
	hintText:'Last Name',
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_NEXT,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
scrollView.add(last_name);

var email = Titanium.UI.createTextField({
	color:'#336699',
	top:260,
	left:10,
	width:300,
	height:40,
	hintText:'email',
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_DONE,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
scrollView.add(email);

var createBtn = Titanium.UI.createButton({
	title:'Create Account',
	top:310,
	width:130,
	height:35,
	borderRadius:1,
	font:{fontFamily:'Arial',fontWeight:'bold',fontSize:14}
});
scrollView.add(createBtn);

username.addEventListener('return', function(event) {
  password1.focus();
});
password1.addEventListener('return', function(event) {
  password2.focus();
});
password2.addEventListener('return', function(event) {
  first_name.focus();
});
first_name.addEventListener('return', function(event) {
  last_name.focus();
});
last_name.addEventListener('return', function(event) {
  email.focus();
});


var testresults;

function checkemail(emailAddress)
{
	var str = emailAddress;
	var filter = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if (filter.test(str))
	{
		testresults = true;
	}
	else
	{
		testresults = false;
	}
	return (testresults);
};

var createReq = Titanium.Network.createHTTPClient();
createReq.onload = function()
{
	if (this.responseText == "Insert failed" || this.responseText == "That username or email already exists")
	{
		createBtn.enabled = true;
		createBtn.opacity = 1;
		alert(this.responseText);
	} 
	else
	{
		var alertDialog = Titanium.UI.createAlertDialog({
		    title: 'Alert',
		    message: this.responseText,
		    buttonNames: ['OK']
		});
		alertDialog.show();
		alertDialog.addEventListener('click',function(e)
		{
			win.tabGroup.setActiveTab(0);
		});
		win.close();
	}
};

createBtn.addEventListener('click',function(e)
{
	if (username.value != '' && password1.value != '' && password2.value != '' && first_name.value != '' && last_name.value != '' && email.value != '')
	{
		if (password1.value != password2.value)
		{
			alert("Your passwords do not match");
		}
		else
		{
			if (!checkemail(email.value))
			{
				alert("Please enter a valid email");
			}
			else
			{
				createBtn.enabled = false;
				createBtn.opacity = 0.3;
				createReq.open("POST","http://petecapp.com/flight/post_register.php");
				var params = {
					username: username.value,
					password: Ti.Utils.md5HexDigest(password1.value),
					first_name: first_name.value,
					last_name: last_name.value,
					email: email.value
				};
				createReq.send(params);
			}
		}
	}
	else
	{
		alert("All fields are required");
	}
});


