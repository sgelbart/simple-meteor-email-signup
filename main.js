Emails = new Mongo.Collection("emails");

//this code is performed inside the browser itself (the client side)
if (Meteor.isClient) {

    //helpers say WHAT variables get passed to the template
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
            Emails.insert({
                email: event.target.email.value, //event.target will be the form. It'll have a property for each field (based on the field's 'name' attribute)
                name: event.target.name.value //you can use chrome dev tools to inspect the event object if you like
            });

            Session.set('sent', true);

        }
    });

    Template.emailList.helpers(
        {
            emails: function()
            {
                return Emails.find(); //question: why can we use find() here without fetch?? probably because it's client? or maybe because the template automatically pulls it as well?
            }
        }
    );
}

//this code is performed before behind the scenes before we send any data to the browser
//code we want to be secure or to happen for multiple users should go here.
if (Meteor.isServer)
{
    Meteor.startup(function ()
    {

        //often times you'll want to do things here
        //for now let's just log all the emails to console

        var allEmails = Emails.find().fetch(); //remember to use fetch or else it returns a "cursor" meaning a reference to the db but not the actual objects!

        //cycle through all emails
        _.each(allEmails, function (item)
        {
            console.log(item.email); //this will log to the terminal where you did "meteor" (to run the application)
        });

    });
}
