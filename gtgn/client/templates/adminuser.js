function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

Template.adduser.rendered = function () {
    this.$('.ui.checkbox').checkbox();
}

Template.adminusers.helpers({
    "users": function () {
        return Meteor.users.find({}, {sort: ["profile.displayname","asc"]});
    }
});

Template.adduser.events({
    "click button[name=submit]": function (e, i) {
        e.preventDefault();
        var options = {};
        var form = $(e.target).closest('.ui.form');
        form.find('.error').removeClass('error');
        options.email = form.find('input[name=email]').val();
        if (!validateEmail(options.email)) {
            form.find('input[name=email]').closest('.field').addClass('error');
            toastr.error('Invalid Email');
            return;
        }
        options.profile = {roles: []};
        form.find('input[type=checkbox]:checked').each(function () {
            options.profile.roles.push($(this).attr('name'));
        });
        if (options.profile.roles.length === 0) {
            toastr.error('You must select at least one role');
            return;
        }
        Meteor.call('AddUser', options, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            } else if (result) {
                toastr.success('User added');
                form.find('input[type=checkbox]:checked').prop('checked', false);
                form.find('input[name=email]').val('');
            }
        });
    }
});

Template.adminedituser.helpers({
    "users": function () {
        return Meteor.users.find({}, {sort: ["profile.displayname","asc"]});
    }
});

Template.edituser.rendered = function () {
    this.$('.ui.checkbox').checkbox();
    this.$('button[name=delete]').popup({on: 'click'});
}

Template.edituser.helpers({
    "blogwriter": function () {
        if (_.contains(this.profile.roles, 'blog writer')) {
            return true;
        } else {
            return false;
        }
    },
    "blogeditor": function () {
        if (_.contains(this.profile.roles, 'blog editor')) {
            return true;
        } else {
            return false;
        }
    },
    "reviewswriter": function () {
        if (_.contains(this.profile.roles, 'reviews writer')) {
            return true;
        } else {
            return false;
        }
    },
    "reviewseditor": function () {
        if (_.contains(this.profile.roles, 'reviews editor')) {
            return true;
        } else {
            return false;
        }
    },
    "admin": function () {
        if (_.contains(this.profile.roles, 'admin')) {
            return true;
        } else {
            return false;
        }
    }
});

Template.edituser.events({
    "click button[name=confirm]": function (e, i) {
        e.preventDefault();
        Meteor.call('DeleteUser', this._id, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            } else if (result) {
                toastr.success('User deleted');
                Router.go('/admin/users');
            }
        });
    },
    "click button[name=submit]": function (e, i) {
        e.preventDefault();
        var options = {};
        var form = $(e.target).closest('.ui.form');
        options.user_id = this._id;
        form.find('.error').removeClass('error');
        options.displayname = form.find('input[name=displayname]').val();
        if (options.displayname.length < 3) {
            form.find('input[name=displayname]').closest('.field').addClass('error');
            toastr.error('Display Name Too Short');
            return;
        }
        options.roles = [];
        form.find('input[type=checkbox]:checked').each(function () {
            options.roles.push($(this).attr('name'));
        });
        if (options.roles.length === 0) {
            toastr.error('You must select at least one role');
            return;
        }
        options.bio = form.find('textarea[name=bio]').val();
        if (options.bio.length < 3) {
            form.find('textarea[name=bio]').closest('.field').addClass('error');
            toastr.error('Bio Too Short');
            return;
        }
        if (options.bio.length > 255) {
            form.find('textarea[name=bio]').closest('.field').addClass('error');
            toastr.error('Bio Too Long');
            return;
        }
        Meteor.call('UpdateUser', options, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            } else if (result) {
                toastr.success('User updated');
                Router.go('/admin/users');
            }
        });
    }
});

Template.editme.events({
    "click button[name=submit]": function (e, i) {
        e.preventDefault();
        var options = {};
        var form = $(e.target).closest('.ui.form');
        options.user_id = this._id;
        form.find('.error').removeClass('error');
        options.displayname = form.find('input[name=displayname]').val();
        if (options.displayname.length < 3) {
            form.find('input[name=displayname]').closest('.field').addClass('error');
            toastr.error('Display Name Too Short');
            return;
        }
        options.bio = form.find('textarea[name=bio]').val();
        if (options.bio.length < 3) {
            form.find('textarea[name=bio]').closest('.field').addClass('error');
            toastr.error('Bio Too Short');
            return;
        }
        if (options.bio.length > 255) {
            form.find('textarea[name=bio]').closest('.field').addClass('error');
            toastr.error('Bio Too Long');
            return;
        }
        Meteor.call('ChangeDisplayName', options, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            } else if (result) {
                toastr.success('User updated');
                Router.go('/admin/users');
            }
        });
    }
});
