
Emails = new Mongo.Collection("emails");

if (Meteor.isClient) {

    // counter starts at 0
    //Session.setDefault('sent', 0);

    Template.addEmail.helpers({
        sent: function () {
            console.log(Session.get('sent'));
            return Session.get('sent');
        },
        emails: function(){
            return Emails.find();
        }
    });


    Template.addEmail.events({
        "submit .add-email": function (event) {
            // Prevent default browser form submit
            event.preventDefault();

            // Get value from form element
            var email = event.target.email.value;
            var name = event.target.name.value;

            // Insert a task into the collection
            Emails.insert({
                email: email,
                name: name
            });

            // Clear form
            event.target.email.value = "";
            event.target.name.value = "";

            Session.set('sent', 1);

        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function ()
    {

        //remove duplicates
        var exists = [];
        var allEmails = Emails.find().fetch();
        _.each(allEmails, function (item)
        {
            if (exists.indexOf(item.email) > -1)
            {
                Emails.remove(item._id);
            }
            exists.push(item.email);
        });

    });
}
