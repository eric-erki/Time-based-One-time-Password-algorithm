var express = require('express');
var session = require('express-session');
var router = express.Router();


router.get('/login', function(req, res, next) {
	res.render('login', {status: 1});
});

router.get('/register', function(req, res, next) {
	res.render('register');
});

/* GET users listing. */
router.post('/registerUser', function(req, res, next) {
	var username = req.body.txtUserName;
	var password = req.body.txtPassword;

	session = req.session;

	session.username = username;
	session.password = password;

	res.redirect('registerTwoFormAuthentication');
});

router.get('/registerTwoFormAuthentication', function(req, res, next) {

	console.log('username = '  + session.username);
	console.log('password = ' + session.password);

	var speakeasy = require("speakeasy");
	var QRCode = require('qrcode');
	var secret = speakeasy.generateSecret({length: 20, name: 'TOTO Authenticator'});
	req.session.secret = secret;

	QRCode.toDataURL(secret.otpauth_url, function(err, data_url) {
	//console.log(data_url);

		res.render('registerTwoFormAuthentication', {imageUrl: data_url });
	});
});

router.post('/validateCode', function(req, res, next) {

	secret = req.session.secret;
	sixDigitCode = req.body.txtCode;
	console.log('secret = ' + secret.base32);

	var speakeasy = require("speakeasy");

	var token = speakeasy.totp({
		secret: secret.base32,
		encoding: 'base32'
	});

	console.log('token = ' + token);

	var verified = speakeasy.totp.verify({ secret: secret.base32,
		encoding: 'base32',
		window: 2,
		token: sixDigitCode 
	});



	res.render('home', {status: verified });
});

router.post('/authenticateUser', function(req, res, next){

	username = req.session.username;
	password = req.session.password;

	formUsername = req.body.txtUserName;
	formPassword = req.body.txtPassword;


	if((username == formUsername) && (password == formPassword)){
		res.redirect('loginWithCode');
	}else{
		res.render('index', {status: 0 });
	}
});

router.get('/loginWithCode', function(req, res, next) {
	res.render('loginWithCode');
});

module.exports = router;