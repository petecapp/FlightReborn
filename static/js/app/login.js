var win = Titanium.UI.currentWindow;  

var tabGroup = win.tabGroup;

var username = Titanium.UI.createTextField({  
   value:'',
  width:300,
  height: 40,
  left: 5,
  hintText: 'Username',
  returnKeyType:Titanium.UI.RETURNKEY_NEXT,
  borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE 
});   
  
var password = Titanium.UI.createTextField({  
   value:'',
  height: 40,
  passwordMask: true,
  hintText: 'Password',
  width:300,
  left: 5,
  borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
  returnKeyType:Titanium.UI.RETURNKEY_DONE
});  

/* Authentication */
var loginReq = Titanium.Network.createHTTPClient(); 

username.addEventListener('return', function(event) {
  password.focus();
});

password.addEventListener('return', function(event) {
  if (username.value != '' && password.value != '')  
    {  
        loginReq.open("POST","http://petecapp.com/flight/post_auth.php");  
        var params = {  
            username: username.value,  
            password: Ti.Utils.md5HexDigest(password.value)  
        };  
        loginReq.send(params);
    }  
    else  
    {  
        alert("Username/Password are required");  
    }  
});

var table = Ti.UI.createTableView({
  style: Ti.UI.iPhone.TableViewStyle.GROUPED,
  rowHeight: 40,
  backgroundColor:'transparent',
});

var section = Ti.UI.createTableViewSection({headerTitle: "Sign in"});
    
var row = Ti.UI.createTableViewRow();
row.add(username);
row.hasChild = false;
row.className = "field";
section.add(row);

var prow = Ti.UI.createTableViewRow();
prow.add(password);
prow.hasChild = false;
prow.className = "field";
section.add(prow);
table.setData([section]);

win.add(table);

loginReq.onload = function()  
{  
    var json = this.responseText;  
    var response = JSON.parse(json);  
    if (response.logged == true)  
    {  
        username.blur();  
        password.blur();
        
        Ti.App.Properties.setString('id', response.id);
		Ti.App.Properties.setString('first_name', response.first_name);
		Ti.App.Properties.setString('last_name', response.last_name);
		Ti.App.Properties.setString('email', response.email);	
		Ti.App.Properties.setString('username', response.username);
		Ti.App.Properties.setString('password', password.value);
		Ti.App.Properties.setString('loggedIn', "yes");
        
        Ti.App.fireEvent('grantEntrance');
        
        win.close();
    }  
    else  
    {  
        alert(response.message);
    }  
};  