Meteor.startup(function () {
    if(Meteor.users.find().count() === 0) {
        var options = {
            email: 'coolerda@ymail.com',
            profile: {
                roles: ['admin']
            }
        }
        var user = {};

        options.profile.displayname = 'Adamanthea';
        options.profile.gravatar = Gravatar.imageUrl(options.email);

        user._id = Accounts.createUser(options);
        if (!user._id) {
            return {success: false, error: 'Failed Creating User'};
        }
        Accounts.sendEnrollmentEmail(user._id);
        Meteor.users.update({_id: user._id}, {$addToSet: {'profile.roles': user._id}});
    }
});
