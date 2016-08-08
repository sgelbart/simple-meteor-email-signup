
//CREATE A COLLECTION TO HOLD EMAILS AND NAMES
//this is like creating an array of email/name objects (but with LOTS of added functionality!!)
//think of it like:
//[{name:'Sabrina',email:'sabrina@domain.com'},{name:'Brit',email:'brit@domain.com'}]
//it we be saved to the server so that it's shared between mutliple users (so everyone sees the same list)
//and it will also be accessible on the client side (yes, sometimes you'll have stuff that's only on the server or client) 
Emails = new Mongo.Collection("emails");

//this code is only performed inside the browser itself (the client side)
if (Meteor.isClient) {

    //TEMPLATE INTRO
    //templates are peices of html that include variables, if statements, and loops
    //here we'll say what goes into our templates and how our templates will respond to actions
    //you can have mutliple templates with different names to keep them organized
    
    //TEMPLATE HELPERS
    //helpers say WHAT variables get passed to the template
    //here we're defining helpers for our ADDEMAIL template
    //Writing variables from within the helpers helps us keep our code organized and modular
    Template.addEmail.helpers(
        {
            //keep track of if the user has sent the form
            //(so we know when we can hide it)
            sent: function ()
            {
                return Session.get('sent');
            }
        }
    );

    //events say WHEN to take certain actions based on how the user interacts with the template
    Template.addEmail.events(
    {
        //this will be called when you submit form with class 'add-email'
        //"submit" either happens when you click the send button on a form or whne you press enter
        "submit .add-email": function (event)
        {
            // Prevent default browser form submit. Without this it will refresh the page!!!
            event.preventDefault();

            // Insert a task into the collection
            // when we did this it will automaticaly call back to the server to save this too
            Emails.insert({
                email: event.target.email.value, //event.target will be the form. It'll have a property for each field (based on the field's 'name' attribute)
                name: event.target.name.value //you can use chrome dev tools to inspect the event object if you like
            });

            //we want to remember that the form was sent so we know to hide the form
            Session.set('sent', true);

        }
    });

    //say what variables will get passed to the 
    //wondering why we don't define what "emails" are once and use it throughout our code?
    //it's beacuse when you have a large application, you could have lots of different lists of emails used in different places, which would make things confusing
    Template.emailList.helpers(
        {
            emails: function()
            {
                return Emails.find(); //question: why can we use find() here without fetch?? probably because it's client? or maybe because the template automatically pulls it as well?
            }
        }
    );
}

//this code is performed behind the scenes before we send any data to the browser
//code we want to be secure or to happen for multiple users should go here.
if (Meteor.isServer)
{
    //this code only runs when meteor is first starting 
    Meteor.startup(function ()
    {
        //often times you'll want to do things here
        //for now let's just log all the emails to console

        var allEmails = Emails.find().fetch(); //remember to use fetch or else it returns a "cursor" meaning a reference to the db but not the actual objects!

        //cycle through all emails
        _.each(allEmails, function (item)
        {
            //it's useful to know how to do this for debugging!
            console.log(item.email); //this will log to the terminal where you did "meteor" (to run the application)
        });

    });
}
