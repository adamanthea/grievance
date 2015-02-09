Template.blogs.helpers({
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

    columns: function () {
        return Columns.find({}, {sort: {name: 1}});
    },

    writers: function () {
        return Meteor.users.find({'profile.roles': 'blog writer'}, {sort: {'profile.displayname': 1}});
    }
});

Template.blogs.events({
    'click .load-more': function (event, instance) {
        event.preventDefault();

        // get current value for limit, i.e. how many posts are currently displayed
        var limit = instance.limit.get();

        // increase limit by 5 and update it
        limit += 5;
        instance.limit.set(limit);
    }
});

Template.blogs.created = function () {

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
        var subscription = Meteor.subscribe('publicblogposts', limit);

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
        return PublicBlogPosts.find({}, {sort: {publish_date: -1}, limit: instance.loaded.get()});
    }
};

Template.blogpostsbyauthor.helpers({
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

    columns: function () {
        return Columns.find({}, {sort: {name: 1}});
    },

    writers: function () {
        return Meteor.users.find({'profile.roles': 'blog writer'}, {sort: {'profile.displayname': 1}});
    },

    author: function () {
        var author_id = Iron.controller().state.get('author_id');
        return Meteor.users.findOne({_id: author_id});
    }
});

Template.blogpostsbyauthor.events({
    'click .load-more': function (event, instance) {
        event.preventDefault();

        // get current value for limit, i.e. how many posts are currently displayed
        var limit = instance.limit.get();

        // increase limit by 5 and update it
        limit += 5;
        instance.limit.set(limit);
    }
});

Template.blogpostsbyauthor.created = function () {

    // 1. Initialization

    var instance = this;

    // initialize the reactive variables
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(5);
    instance.ready = new ReactiveVar(false);
    instance.rc = Iron.controller();

    // 2. Autorun

    // will re-run when the "limit" reactive variables changes
    instance.autorun(function () {

        var author = instance.rc.state.get('author_id')

        // get the limit
        var limit = instance.limit.get();
        // subscribe to the posts publication
        var subscription = Meteor.subscribe('publicblogpostsbyauthor', author, limit);

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
        return PublicBlogPosts.find({}, {sort: {publish_date: -1}, limit: instance.loaded.get()});
    }
};

Template.blogpostsbycolumn.helpers({
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

    columns: function () {
        return Columns.find({}, {sort: {name: 1}});
    },

    writers: function () {
        return Meteor.users.find({'profile.roles': 'blog writer'}, {sort: {'profile.displayname': 1}});
    },

    column: function () {
        var column_id = Iron.controller().state.get('column_id');
        return Columns.findOne({_id: column_id});
    }
});

Template.blogpostsbycolumn.events({
    'click .load-more': function (event, instance) {
        event.preventDefault();

        // get current value for limit, i.e. how many posts are currently displayed
        var limit = instance.limit.get();

        // increase limit by 5 and update it
        limit += 5;
        instance.limit.set(limit);
    }
});

Template.blogpostsbycolumn.created = function () {

    // 1. Initialization

    var instance = this;

    // initialize the reactive variables
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(5);
    instance.ready = new ReactiveVar(false);
    instance.rc = Iron.controller();

    // 2. Autorun

    // will re-run when the "limit" reactive variables changes
    instance.autorun(function () {

        var column = instance.rc.state.get('column_id')

        // get the limit
        var limit = instance.limit.get();
        // subscribe to the posts publication
        var subscription = Meteor.subscribe('publicblogpostsbycolumn', column, limit);

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
        return PublicBlogPosts.find({}, {sort: {publish_date: -1}, limit: instance.loaded.get()});
    }
};

Template.showblogpost.helpers({
    excerpt: function () {
        var re = /^\[break\]$/mi
        var pieces = this.post.publish_body.split(re);
        return pieces[0];
    },
    full: function () {
        var re = /^\[break\]$/mi
        var pieces = this.post.publish_body.split(re);
        return pieces.join('');
    }
});

Template.blogpost.helpers({
    columns: function () {
        return Columns.find({}, {sort: {name: 1}});
    },

    writers: function () {
        return Meteor.users.find({'profile.roles': 'blog writer'}, {sort: {'profile.displayname': 1}});
    }
});
