var express = require('express');
var router = express.Router();
//connect to allFunction.js
var testFunction = require('./allFunction');

const assert = require('assert');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://malzano:019236055@seproject-zbimx.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
	//const collection = client.db("SEproject").collection("usernamePassword");
	// perform actions on the collection object
	console.log("Successfully connected to online database");
	client.close();
});

const dbName = 'SEproject'

// home page
router.get('/', function (req, res, next) {
	console.log("Loaded home.js")

	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		var query = {
			'subject': new RegExp(req.query.subject),
			'educational_level': new RegExp(req.query.level),
			'city': new RegExp(req.query.city),
			'rating': new RegExp(req.query.rating),
			'price': new RegExp(req.query.minprice), //Change this to price range please
			//'tutor_id': new RegExp(req.query.tutor_id)
		};
		//TODO: This search uses RegEx, consider changing it to something else later.
		// ** Not completed due to time constraints
		// Look into col.find() and how to use its find operators
		const result = await db.collection('CourseData').find(query).limit(10).toArray();

		// The search added the results to the locals, access them in home.ejs and show the results there
		console.log(req.body.subject, result)
		res.render('home', { searchResults: result});
	});

	//TODO: Handle db connection failed error
});

// tutor's contract page
router.get('/tutors_contract', function (req, res, next) {
	res.render('tutors_contract');
});

// student's contract page
router.get('/students_contract', function (req, res, next) {
	res.render('students_contract');
});

// profile page
router.get('/profile', function (req, res, next) {
	var use = req.cookies.auth;
	if(typeof req.cookies.nextpf != 'undefined') {use = req.cookies.nextpf;}
	client.connect(async function (err) {
		assert.equal(null, err);
		const db = client.db(dbName);
		var query = {
			"username" : use
		};
		//TODO: This search uses RegEx, consider changing it to something else later.
		// ** Not completed due to time constraints
		// Look into col.find() and how to use its find operators
		const resultt = await db.collection('UserData').find(query).limit(1).toArray();

		// The search added the results to the locals, access them in home.ejs and show the results there
		console.log( resultt);
		res.render('profile', { pf: resultt[0] });
	});
	
});

// edit-profile-form
router.post('/profile/edit_profile', [], function (req, res) {
	
	//if(req.cookies.auth == req.body.username)
	
	client.connect(async function (err) {
		//checks for connection error
		assert.equal(null, err);

		//once connected, add a doc to collection 'UserData'
		const db = client.db(dbName);

		db.collection('UserData').update(
			{
				username: req.cookies.auth	//find the user you wanna change here
			},
			{
				$set: {
				'firstname': req.body.firstname,
				'lastname': req.body.lastname,
				'phone': req.body.phone,
				'email': req.body.email,
				'gender': req.body.gender,
				'bio' : req.body.bio
				}
			}
		);
		const result = await db.collection('UserData').find({username : req.cookies.auth}).limit(1).toArray();
		console.log( result);
		res.render('profile',{ pf: result[0] });
	});

});

router.get('/testfunction', function(req, res, next) {
	//use function like this
	testFunction.data.checkcookie(req,res);
  });


module.exports = router;
