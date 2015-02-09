var re_weburl = new RegExp(
    "^" +
    // protocol identifier
    "(?:(?:https?|ftp)://)" +
    // user:pass authentication
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
    // IP address exclusion
    // private & local networks
    "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
    "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
    "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broacast addresses
    // (first & last IP address of each class)
    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
    // host name
    "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
    // domain name
    "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
    // TLD identifier
    "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
    ")" +
    // port number
    "(?::\\d{2,5})?" +
    // resource path
    "(?:/\\S*)?" +
    "$", "i"
);

Template.myblogposts.helpers({
    posts: function () {
        return Template.instance().posts();
    },
    // the subscription handle
    isReady: function () {
        return Template.instance().ready.get();
    },
    // are there more posts to show?
    hasMorePosts: function () {
        return Template.instance().posts().count() >= Template.instance().limit.get();
    },
    showstate: function () {
        return _s.toSentence(this.state, ', ');
    },
    canedit: function () {
        var user = Meteor.userId();
        if (!_.contains(this.state, 'pending') || canYou(user, ['admin', 'blog editor'])) {
            return true;
        } else {
            return false;
        }
    }
});

Template.myblogposts.events({
    'click .load-more': function (event, instance) {
        event.preventDefault();

        // get current value for limit, i.e. how many posts are currently displayed
        var limit = instance.limit.get();

        // increase limit by 5 and update it
        limit += 5;
        instance.limit.set(limit);
    }
});

Template.myblogposts.created = function () {

    // 1. Initialization

    var instance = this;

    // initialize the reactive variables
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(5);
    instance.ready = new ReactiveVar(false);

    // 2. Autorun

    // will re-run when the "limit" reactive variables changes
    instance.autorun(function () {

        // get the limit
        var limit = instance.limit.get();
        // subscribe to the posts publication
        var subscription = Meteor.subscribe('myblogposts', limit);

        // if subscription is ready, set limit to newLimit
        if (subscription.ready()) {
            instance.loaded.set(limit);
            instance.ready.set(true);
        } else {
            instance.ready.set(false);
        }
    });

    // 3. Cursor

    instance.posts = function() {
        return MyBlogPosts.find({}, {sort: {created_date: -1}, limit: instance.loaded.get()});
    }
};

Template.pendingblogposts.helpers({
    posts: function () {
        return Template.instance().posts();
    },
    // the subscription handle
    isReady: function () {
        return Template.instance().ready.get();
    },
    // are there more posts to show?
    hasMorePosts: function () {
        return Template.instance().posts().count() >= Template.instance().limit.get();
    }
});

Template.pendingblogposts.events({
    'click .load-more': function (event, instance) {
        event.preventDefault();

        // get current value for limit, i.e. how many posts are currently displayed
        var limit = instance.limit.get();

        // increase limit by 5 and update it
        limit += 5;
        instance.limit.set(limit);
    }
});

Template.pendingblogposts.created = function () {

    // 1. Initialization

    var instance = this;

    // initialize the reactive variables
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(5);
    instance.ready = new ReactiveVar(false);

    // 2. Autorun

    // will re-run when the "limit" reactive variables changes
    instance.autorun(function () {

        // get the limit
        var limit = instance.limit.get();
        // subscribe to the posts publication
        var subscription = Meteor.subscribe('pendingblogposts', limit);

        // if subscription is ready, set limit to newLimit
        if (subscription.ready()) {
            instance.loaded.set(limit);
            instance.ready.set(true);
        } else {
            instance.ready.set(false);
        }
    });

    // 3. Cursor

    instance.posts = function() {
        return PendingBlogPosts.find({}, {sort: {created_date: -1}, limit: instance.loaded.get()});
    }
};

Template.publishedblogposts.helpers({
    posts: function () {
        return Template.instance().posts();
    },
    // the subscription handle
    isReady: function () {
        return Template.instance().ready.get();
    },
    // are there more posts to show?
    hasMorePosts: function () {
        return Template.instance().posts().count() >= Template.instance().limit.get();
    }
});

Template.publishedblogposts.events({
    'click .load-more': function (event, instance) {
        event.preventDefault();

        // get current value for limit, i.e. how many posts are currently displayed
        var limit = instance.limit.get();

        // increase limit by 5 and update it
        limit += 5;
        instance.limit.set(limit);
    }
});

Template.publishedblogposts.created = function () {

    // 1. Initialization

    var instance = this;

    // initialize the reactive variables
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(5);
    instance.ready = new ReactiveVar(false);

    // 2. Autorun

    // will re-run when the "limit" reactive variables changes
    instance.autorun(function () {

        // get the limit
        var limit = instance.limit.get();
        // subscribe to the posts publication
        var subscription = Meteor.subscribe('publishedblogposts', limit);

        // if subscription is ready, set limit to newLimit
        if (subscription.ready()) {
            instance.loaded.set(limit);
            instance.ready.set(true);
        } else {
            instance.ready.set(false);
        }
    });

    // 3. Cursor

    instance.posts = function() {
        return PublishedBlogPosts.find({}, {sort: {created_date: -1}, limit: instance.loaded.get()});
    }
};

Template.addblog.rendered = function () {
    this.$('.ui.dropdown').dropdown();
}

Template.addblog.helpers({
    columns: function () {
        return Columns.find({}, {sort: ['name', 'asc']});
    }
});

Template.addblog.events({
    "click button[name=next]": function (e, i) {
        e.preventDefault();
        var options = {};
        var form = $(e.target).closest('.ui.form');
        form.find('.error').removeClass('error');
        options.column_id = form.find('input[name=column]').val();
        if(!options.column_id || !Columns.find({_id: options.column_id})) {
            form.find('input[name=column]').closest('.field').addClass('error');
            toastr.error('Invalid Column');
            return;
        }
        options.hero = form.find('input[name=hero]').val();
        if(!options.hero || !re_weburl.test(options.hero)) {
            form.find('input[name=hero]').closest('.field').addClass('error');
            toastr.error('Invalid Hero Image URL');
            return;
        }
        Meteor.call('CreateBlogPost', options, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            } else if (result) {
                Router.go('/admin/blogs/' + result + "/edit");
            }
        });
    }
});

Template.editblogcolumn.rendered = function () {
    this.$('.ui.dropdown').dropdown();
}

Template.editblogcolumn.helpers({
    columns: function () {
        return Columns.find({}, {sort: ['name', 'asc']});
    }
});

Template.editblogcolumn.events({
    "click button[name=next]": function (e, i) {
        e.preventDefault();
        var self = this;
        var options = {};
        var form = $(e.target).closest('.ui.form');
        form.find('.error').removeClass('error');
        options.column_id = form.find('input[name=column]').val();
        if(!options.column_id || !Columns.find({_id: options.column_id})) {
            form.find('input[name=column]').closest('.field').addClass('error');
            toastr.error('Invalid Column');
            return;
        }
        options.hero = form.find('input[name=hero]').val();
        if(!options.hero || !re_weburl.test(options.hero)) {
            form.find('input[name=hero]').closest('.field').addClass('error');
            toastr.error('Invalid Hero Image URL');
            return;
        }
        Meteor.call('UpdateBlogPostColumn', self._id, options, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            } else if (result) {
                Router.go('/admin/blogs/' + self._id);
            }
        });
    }
});

Template.addcolumn.events({
    "click button[name=addcolumn]": function (e, i) {
        e.preventDefault();
        var form = $(e.target).closest('.ui.form');
        form.find('.error').removeClass('error');
        var column = form.find('input[name=columnname]').val();
        if(!column || column.length < 3) {
            form.find('input[name=columnname]').closest('.field').addClass('error');
            toastr.error('Column name too short');
            return;
        }

        Meteor.call('CreateColumn', column, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            } else if (result) {
                toastr.success('Column added');
                form.find('input[name=columnname]').val('');
            }
        });
    }
});

Template.adminblog.helpers({
    admin: function () {
        var user = Meteor.user();
        return _.contains(user.profile.roles, 'admin');
    }
});

Template.admineditblogpost.rendered = function () {
    if (this.data.draft_title) {
        $('#entry-title').val(this.data.draft_title);
    }

    if (this.data.draft_body) {
        GhostDownEditor.editor.setValue(this.data.draft_body);
    }
}

Template.admineditblogpost.helpers({
    pending: function () {
        return _.contains(this.state, 'pending');
    }
})

Template.admineditblogpost.events({
    "click button[name=save]": function (e, i) {
        e.preventDefault();
        var self = this;
        var options = {};
        options.draft_title = $('#entry-title').val();
        if (!options.draft_title || options.draft_title.length < 3) {
            return toastr.error('Title too short');
        }
        options.draft_body = GhostDownEditor.editor.getValue();
        if (!options.draft_body || options.draft_body.length < 10) {
            return toastr.error('Body too short');
        }

        Meteor.call('SaveBlogPost', self._id, options, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            } else if (result) {
                toastr.success('Post saved');
                Router.go('/admin/blogs/' + self._id);
            }
        });
    },
    "click button[name=publish]": function (e, i) {
        e.preventDefault();
        var self = this;
        var options = {};
        options.draft_title = $('#entry-title').val();
        if (!options.draft_title || options.draft_title.length < 3) {
            return toastr.error('Title too short');
        }
        options.draft_body = GhostDownEditor.editor.getValue();
        if (!options.draft_body || options.draft_body.length < 10) {
            return toastr.error('Body too short');
        }

        Meteor.call('SaveBlogPost', self._id, options, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            } else if (result) {
                toastr.success('Post saved');
                Router.go('/admin/blogs/' + self._id + "/publish");
            }
        });
    },
    "click button[name=reject]": function (e, i) {
        e.preventDefault();
        var self = this;
        var options = {};
        options.draft_title = $('#entry-title').val();
        if (!options.draft_title || options.draft_title.length < 3) {
            return toastr.error('Title too short');
        }
        options.draft_body = GhostDownEditor.editor.getValue();
        if (!options.draft_body || options.draft_body.length < 10) {
            return toastr.error('Body too short');
        }
        Meteor.call('SaveBlogPost', self._id, options, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            } else if (result) {
                toastr.success('Post saved');
                Meteor.call('RejectBlogPost', self._id, function (error, result) {
                    if (error) {
                        return toastr.error(error.reason);
                    } else if (result) {
                        toastr.success('Post rejected');
                        Router.go('/admin/blogs');
                    }
                });
            }
        });
    },
    "click button[name=submit]": function (e, i) {
        e.preventDefault();
        var self = this;
        var options = {};
        options.draft_title = $('#entry-title').val();
        if (!options.draft_title || options.draft_title.length < 3) {
            return toastr.error('Title too short');
        }
        options.draft_body = GhostDownEditor.editor.getValue();
        if (!options.draft_body || options.draft_body.length < 10) {
            return toastr.error('Body too short');
        }

        Meteor.call('SaveBlogPost', self._id, options, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            } else if (result) {
                toastr.success('Post saved');
                debugger;
                Meteor.call('SubmitBlogPost', self._id, function (error, result) {
                    if (error) {
                        return toastr.error(error.reason);
                    } else if (result) {
                        toastr.success('Post submitted for review');
                        Router.go('/admin/blogs/' + self._id);
                    }
                });
            }
        });

    }
});

Template.adminmanageblogpost.rendered = function () {
    this.$('.ui.dropdown').dropdown();
}

Template.adminmanageblogpost.helpers({
    editable: function () {
        var user = Meteor.userId();
        if (!_.contains(this.state, 'pending') || canYou(user, ['admin', 'blog editor'])) {
            return true;
        } else {
            return false;
        }
    },
    reviewable: function () {
        var user = Meteor.userId();
        if (_.contains(this.state, 'draft') && !canYou(user, ['admin', 'blog editor'])) {
            return true;
        } else {
            return false;
        }
    },
    publishable: function () {
        var user = Meteor.userId();
        if (_.intersection(this.state, ['draft','pending']).length > 0 && canYou(user, ['admin', 'blog editor'])) {
            return true;
        } else {
            return false;
        }
    },
    rejectable: function () {
        var user = Meteor.userId();
        if (_.contains(this.state, 'pending') && canYou(user, ['admin', 'blog editor'])) {
            return true;
        } else {
            return false;
        }
    },
    canupdatecolumn: function () {
        var user = Meteor.userId();
        if (_.intersection(this.state, ['pending','published']).length === 0 || canYou(user, ['admin', 'blog editor'])) {
            return true;
        } else {
            return false;
        }
    },
    admin: function () {
        var user = Meteor.user();
        return _.contains(user.profile.roles, 'admin');
    }
});

Template.adminmanageblogpost.events({
    "click button[name=edit]": function (e, i) {
        e.preventDefault();
        Router.go('/admin/blogs/' + this._id + "/edit");
    },
    "click button[name=publish]": function (e, i) {
        e.preventDefault();
        Router.go('/admin/blogs/' + this._id + "/publish");
    },
    "click button[name=editcolumn]": function (e, i) {
        e.preventDefault();
        Router.go('/admin/blogs/' + this._id + "/editcolumn");
    },
    "click button[name=reject]": function (e, i) {
        e.preventDefault();
        Meteor.call('RejectBlogPost', this._id, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            } else if (result) {
                toastr.success('Post rejected');
                Router.go('/admin/blogs');
            }
        });
    },
    "click button[name=confirm]": function (e, i) {
        e.preventDefault();
        Meteor.call('DeleteBlogPost', this._id, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            } else if (result) {
                toastr.success('Post deleted');
                Router.go('/admin/blogs');
            }
        });
    },
    "click button[name=submit]": function (e, i) {
        e.preventDefault();
        Meteor.call('SubmitBlogPost', this._id, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            } else if (result) {
                toastr.success('Post submitted for review');
                Router.go('/admin/blogs');
            }
        });
    }
});

Template.publishblog.events({
    "click button[name=publish]": function (e, i) {
        e.preventDefault();
        var self = this;
        var form = $(e.target).closest('.ui.form');
        var date = form.find("input[name=publishdate]").val();
        if(!date || !moment(date, "MM-DD-YYYY HH:mm").isValid()) {
            form.find('input[name=publishdate]').closest('.field').addClass('error');
            toastr.error('Invalid date');
            return;
        }
        Meteor.call('PublishBlogPost', self._id, date, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            } else if (result) {
                toastr.success('Post published');
                Router.go('/admin/blogs/' + self._id);
            }
        });
    }
})
