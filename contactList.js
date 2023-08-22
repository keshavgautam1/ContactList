const express = require('express');
const path = require('path');
const port = 8000;

const db = require('./config/mongoose.js');
// this mongoose require line should be right above express line
const Contact = require('./models/contact');


const app = express();

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded());  //middleware
app.use(express.static('assets'));

/*
//middleware1
app.use(function(req, res, next){
// console.log('middleware 1 called');
    req.myName="keshav";
next();
});

//middleware2
app.use(function(req,res,next){
    // console.log('middleware 2 called');
    console.log('My Name from MW2', req.myName);
next();
});
*/
var contactList =[
    {
        name: "Keshav",
        phone: "1111111111"
    },
    {
        name: "Shaktimaan",
        phone: "0000000000"
    },
    {
        name: "Gangadhar",
        phone: "0000000001"
    }
]

/*
//this is the old way of doing it
app.get('/', function(req, res){
//console.log('from the get route controller:',req.myName);
   
   
    return res.render('home', {
         title: "My Contacts List",
         contact_list: contactList
        });
        
});
*/
//this is the new way of doing it
app.get('/', async function(req, res){
    try {
        const contacts = await Contact.find({});
        return res.render('home', {
            title: "My Contacts List",
            contact_list: contacts
        });
    } catch (err) {
        console.log('Error in fetching contacts from db', err);
        return res.redirect('/');
    }
});



app.get('/practice', function(req, res){
    return res.render('practice',{
       title:"Let us play with ejs" 
    });
});



// this is the old way of doing it
/*
app.post('/creat-contact', function(req, res){
    // return res.redirect('/practice');
    // contactList.push({
    //     name: req.body.name,
    //     phone: req.body.phone
    // });
    //  or we can do this in one line
    // contactList.push(req.body);


    Contact.create({   
        name: req.body.name,
        phone:req.body.phone
    }, function(err, newContact){
        if(err){
            console.log('error in creating a contact!');
            return;
        }
            console.log('**********', newContact);
          return res.redirect('/');        
    });  
*/


// Replace the callback with a promise or async/await
// this is the new way of doing it
app.post('/create-contact', async function(req, res) {
    try {
        const newContact = await Contact.create({
            name: req.body.name,
            phone: req.body.phone
        });
        console.log('New contact created:', newContact);
        return res.redirect('/');
    } catch (err) {
        console.log('Error in creating a contact:', err);
        return res.redirect('/');
    }
});

    // contactList.push(req.body);  


    // return res.redirect('/');
    // return res.redirect('Back');
// });

/*
//delete contact  old method
app.get('/delete-contact', function(req,res){ 
    //get the id from query in the url
    let id = req.query.id; 

// find the contact in the database using id and delete
   Contact.findByIdAndDelete(id, function(err){
    if(err){
        console.log('error in deleting an object from database');
        return;
    }
    console.log('contact deleted successfully');
    return res.redirect('/');
     });
});
*/

app.get('/delete-contact', async function(req, res) {
    try {
        // get the id from query in the URL
        let id = req.query.id;

        // find the contact in the database using id and delete
        await Contact.findByIdAndDelete(id);
        // console.log('Contact deleted successfully');
        return res.redirect('/');
    } catch (err) {
        console.log('Error in deleting an object from the database:', err);
        return res.redirect('/');
    }
});

app.listen(port, function(err){
    if(err){
        console.log('Error in running the server', err);
    }
    console.log('Yup! My  Express Server is running on port:',port);
});