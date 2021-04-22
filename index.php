<?php
  
// Starting the session, to use and
// store data in session variable
session_start();
   
// If the session variable is empty, this 
// means the user is yet to login
// User will be sent to 'login.php' page
// to allow the user to login
if (!isset($_SESSION['username'])) {
    $_SESSION['msg'] = "You have to log in first";
    header('location: login.php');
}
   
// Logout button will destroy the session, and
// will unset the session variables
// User will be headed to 'login.php'
// after loggin out
if (isset($_GET['logout'])) {
    session_destroy();
    unset($_SESSION['username']);
    header("location: login.php");
}
?>
<!doctype html>
<html>
<head>

    <title>Skeleton Site</title>

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta name="description" content="">

    <meta property="og:site_name" content="">
    <meta property="og:title" content="">
    <meta property="og:description" content="">
    <meta property="og:image" content="">
    <meta property="og:type" content="website">
    <meta property="og:url" content="">

    <link rel="canonical" href="">

    <link rel="apple-touch-icon" href="static/img/favicons/touch-icon.png">
    <link rel="icon" href="static/img/favicons/touch-icon.png">
    <link rel="shortcut icon" href="static/img/favicons/favicon.ico">

    <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,400italic|Open+Sans+Condensed:300,300italic|Roboto:400,400italic' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="static/css/styles.min.css" type="text/css" media="all" />
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body>

    <header class="cd-header">
        <div class="cd-logo"><a href="#0">FLIGHT</a></div>
        <a class="cd-primary-nav-trigger" href="#0">
            <span class="cd-menu-text">NAV</span><span class="cd-menu-icon"></span>
        </a> <!-- cd-primary-nav-trigger -->
    </header>

    <nav>
        <ul class="cd-primary-nav">
            <li><a href="#0">Account</a></li>
            <li><a href="#0">Launch</a></li>
            <li><a href="#0">Retrieve</a></li>
        </ul>
    </nav>

    <div class="container cd-main-content">
        <div class="row">
            <div class="col-sm-12">
                <div class="header">
        <h2>Login Here!</h2>
    </div>
       
    <div class="content">
   
        <!-- Creating notification when the
                user logs in -->
          
        <!-- Accessible only to the users that
                have logged in already -->
        <?php if (isset($_SESSION['success'])) : ?>
            <div class="error success" >
                <h3>
                    <?php
                        echo $_SESSION['success']; 
                        unset($_SESSION['success']);
                    ?>
                </h3>
            </div>
        <?php endif ?>
   
        <!-- information of the user logged in -->
        <!-- welcome message for the logged in user -->
        <?php  if (isset($_SESSION['username'])) : ?>
            <p>
                Welcome 
                <strong>
                    <?php echo $_SESSION['username']; ?>
                </strong>
            </p>
            <p> 
                <a href="index.php?logout='1'" style="color: red;">
                    Click here to Logout
                </a>
            </p>
        <?php endif ?>
    </div>
            </div>
        </div>
    </div>

    <script type="text/javascript" src="static/vendor/jquery/dist/jquery.min.js"></script>
    <script type="text/javascript" src="static/vendor/modernizr/modernizr.js"></script>
    <script type="text/javascript" src="static/js/main.min.js"></script>
</body>

</html>