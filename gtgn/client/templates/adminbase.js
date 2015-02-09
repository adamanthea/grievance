Template.adminnav.helpers({
    "videos": function () {
        var user = Meteor.user();
        if (user && _.intersection(user.profile.roles, ['admin']).length > 0) {
            return true;
        } else {
            return false;
        }
    },
    "blogs": function () {
        var user = Meteor.user();
        if (user && _.intersection(user.profile.roles, ['admin', 'blog writer', 'blog editor']).length > 0) {
            return true;
        } else {
            return false;
        }
    },
    "reviews": function () {
        var user = Meteor.user();
        if (user && _.intersection(user.profile.roles, ['admin', 'review writer', 'review editor']).length > 0) {
            return true;
        } else {
            return false;
        }
    }
});

Template.adminnav.events({
    "click a.standard.guide.item": function (e, i) {
        e.preventDefault();
        $('.blog.guide.ui.modal').modal('show');
    }
});
