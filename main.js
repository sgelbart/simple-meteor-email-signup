Emails = new Mongo.Collection("emails");

if (Meteor.isClient) {

    Template.addEmail.helpers(
        {
            sent: function ()
            {
                return Session.get('sent'); //since we're using session sent here this value will automatically update
            }
        }
    );


    Template.addEmail.events(
    {
        //this will be called when you submit the form with the class 'add-email'
        "submit .add-email": function (event)
        {
            // Prevent default browser form submit. Without this it will refresh the page!!!
            event.preventDefault();

            // Insert a task into the collection
            Emails.insert({
                email: event.target.email.value, //event.target will be the form, when the form is submitted it'll have a property for each field (based on the 'name' attribute)
                name: event.target.name.value
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
            console.log(item.email); //this will log to the same terminal you did "meteor" (to run the application)
        });

    });
}
