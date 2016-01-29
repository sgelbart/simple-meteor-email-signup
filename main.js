Emails = new Mongo.Collection("emails");

if (Meteor.isClient) {

    Session.setDefault('sent', false); //note: this isn't needed here but good for reference

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
            // Prevent default browser form submit
            event.preventDefault();

            // Get value from form element
            var email = event.target.email.value; //note: you could combine this with the next line but this makes it easier to debug
            var name = event.target.name.value;

            // Insert a task into the collection
            Emails.insert({
                email: email,
                name: name
            });

            // Clear form (not critical since we're hiding)
            event.target.email.value = "";
            event.target.name.value = "";

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

        /**
         * REMOTES DUPLICATES
         * Can take off if you'd like (doesn't hurt anything though!)
         * Note: a better way to do this would be to prevent the user from submitting form if it's a duplicate
         * a good tool would be aldeed-simpleschema or autoform
         *
         * @type {Array}
         */

        var exists = []; //keep track of which emails we've already found

        var allEmails = Emails.find().fetch(); //remember to use fetch or else it returns a "cursor" meaning a reference to the db but not the actual objects!

        //cycle through all emails
        _.each(allEmails, function (item)
        {
            //check if the email is already in the exists array
            if (exists.indexOf(item.email) > -1) //index of returns the spot in the array, so can return 0 meaning it's the first item! We should use -1 (meaning it's not in the array)
            {
                Emails.remove(item._id);

                console.log('deleted extra email:'+item.email); //this will log to the same terminal you did "meteor" (to run the application)
            }
            //add to exists array
            exists.push(item.email);
        });

    });
}
