
//CREATE A COLLECTION TO HOLD EMAILS AND NAMES
//this basically creates a list of email/name objects (but with LOTS of added functionality!!)
//think of it like:
//[{ name: 'Sabrina', email: 'sabrina@domain.com'}, { name: 'Brit', email: 'brit@domain.com' }]
//it's saved behind the scenes (the backend) so to share it between mutliple users (so everyone sees the same list!)
//and it will also be accessible in the browser (aka client).
Emails = new Mongo.Collection("emails");

//this code is only performed inside the browser itself (the client side) since we don't need it on the server
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
                //SESSION keeps track of variables we want to save for the CURRENT BROWSER SESSION
                //e.g., when you clear your cookies or open a different browser "sent" won't be remembered
                return Session.get('sent');
            }
        }
    );

    //events say WHEN to execute code (based on how the user interacts with the template)
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

    //say what variables will get passed to the emailList template
    //we'll redefine our emails variable here for this template
    Template.emailList.helpers(
        {
            emails: function()
            {
                //here we can also do thinks like sort the list or filter out certain ones etc.
                return Emails.find();
            }
        }
    );
}

//this code is performed behind the scenes before we send any data to the browser
//code we want to be secure should go here.
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
