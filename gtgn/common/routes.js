ApplicationController = RouteController.extend({
    action: function () {
        this.render();
    }
});

Router.configure({
    waitOn: function() {
        var subs = [Meteor.subscribe('playlists'), Meteor.subscribe('users'), Meteor.subscribe('columns')];
        return subs;
    },
    layoutTemplate: 'MainLayout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',
    controller: 'ApplicationController'
});
Router.route('/', {
    name: 'home'
});
Router.route('/gdt', {
    name: 'ghostdowntest',
    layoutTemplate: 'BareLayout'
});
Router.route('/videos', {
    name: 'videos'
});
Router.route('/admin', {
    name: 'adminaccount',
    layoutTemplate: 'BareLayout',
    data: function () {
        return Meteor.user();
    }
});
Router.route('/admin/blogs', {
    name: 'adminblog',
    layoutTemplate: 'BareLayout'
});
Router.route('/admin/blogs/:post_id/edit', {
    name: 'admineditblogpost',
    layoutTemplate: 'BareLayout',
    waitOn: function () {
        return Meteor.subscribe('blogpost', this.params.post_id);
    },
    data: function () {
        return Posts.findOne({_id: this.params.post_id});
    }
});
Router.route('/admin/blogs/:post_id/publish', {
    name: 'adminpublishblogpost',
    layoutTemplate: 'BareLayout',
    waitOn: function () {
        return Meteor.subscribe('blogpost', this.params.post_id);
    },
    data: function () {
        return Posts.findOne({_id: this.params.post_id});
    }
});
Router.route('/admin/blogs/:post_id', {
    name: 'adminmanageblogpost',
    layoutTemplate: 'BareLayout',
    waitOn: function () {
        return Meteor.subscribe('blogpost', this.params.post_id);
    },
    data: function () {
        return Posts.findOne({_id: this.params.post_id});
    }
});
Router.route('/admin/blogs/:post_id/editcolumn', {
    name: 'adminupdateblogpostcolumn',
    layoutTemplate: 'BareLayout',
    waitOn: function () {
        return Meteor.subscribe('blogpost', this.params.post_id);
    },
    data: function () {
        return Posts.findOne({_id: this.params.post_id});
    }
});
Router.route('/admin/reviews', {
    name: 'adminreviews',
    layoutTemplate: 'BareLayout'
});
Router.route('/admin/reviews/new', {
    name: 'adminnewreview',
    layoutTemplate: 'BareLayout'
});
Router.route('/admin/reviews/:post_id/edit', {
    name: 'admineditreview',
    layoutTemplate: 'BareLayout'
});
Router.route('/admin/reviews/:post_id', {
    name: 'adminmanagereview',
    layoutTemplate: 'BareLayout'
});
Router.route('/admin/users', {
    name: 'adminusers',
    layoutTemplate: 'BareLayout'
});
Router.route('/admin/users/:user_id', {
    name: 'adminedituser',
    layoutTemplate: 'BareLayout',
    data: function () {
        return Meteor.users.findOne({_id: this.params.user_id});
    }
});
Router.route('/admin/videos', {
    name: 'adminmanageplaylists',
    layoutTemplate: 'BareLayout'
});
Router.route('/admin/videos/:playlist_id', {
    name: 'admineditplaylist',
    data: function () {
        return Playlists.findOne({_id: this.params.playlist_id});
    },
    layoutTemplate: 'BareLayout'
});
Router.route('/videos/:playlist_id', {
    name: 'playlist',
    data: function () {
        return Playlists.findOne({_id: this.params.playlist_id});
    },
    action: function () {
        this.state.set('playlist_id', this.params.playlist_id);
        this.render();
    }
});
Router.route('/streams', {
    name: 'streams'
});
Router.route('/blogs', {
    name: 'blogs'
});
Router.route('/blogs/post/:post_id', {
    name: 'blogpost',
    waitOn: function () {
        return Meteor.subscribe('publicblogpost', this.params.post_id);
    },
    data: function () {
        return Posts.findOne({_id: this.params.post_id});
    }
});
Router.route('/blogs/postsby/:author_id', {
    name: 'blogpostsbyauthor',
    action: function () {
        this.state.set('author_id',this.params.author_id);
        this.render();
    }
});
Router.route('/blogs/postsin/:column_id', {
    name: 'blogpostsbycolumn',
    action: function () {
        this.state.set('column_id',this.params.column_id);
        this.render();
    }
});
Router.route('/sign-out', {
    name: 'signout',
    onBeforeAction: AccountsTemplates.logout
});

var requireLogin = function() {
    if (! Meteor.user()) {
        this.render('accessDenied');
    } else {
        this.next();
    }
}

Router.onBeforeAction('dataNotFound', {
    only: ['playlist']
});

Router.onBeforeAction(requireLogin, {
    only: ['manageplaylists','editplaylist']
});

var setBackground = function () {
    var route = this.route.getName();
    var routes = [
        'adminaccount',
        'adminusers',
        'adminedituser',
        'adminblog',
        'adminnewblogpost',
        'admineditblogpost',
        'adminmanageblogpost',
        'adminpublishblogpost',
        'adminupdateblogpostcolumn',
        'admineditplaylist',
        'adminmanageplaylists',
        'adminreviews',
        'adminnewreview',
        'admineditreview',
        'adminmanagereview',
        'ghostdowntest',
        'atChangePwd',
        'atEnrollAccount',
        'atForgotPwd',
        'atResetPwd',
        'atSignIn',
        'atSignUp',
        'atVerifyEmail'
    ];

    if (_.contains(routes, route)) {
        $('body').addClass('plain');
    } else {
        $('body').removeClass('plain');
    }
    this.next();
};

Router.onBeforeAction(setBackground);

canYou = function(user_id, allowed_roles, return_user) {
    if(!user_id || typeof(user_id) !== 'string') {
        return false;
    }
    if(Meteor.isClient && user_id != Meteor.userId()) {
        return false; // doesn't work for other users on the client
    }
    var u = Meteor.users.findOne({_id: user_id});
    if(typeof(return_user) === 'object' && u) {
        _.extend(return_user, u);
    }
    return !!u && _.intersection(allowed_roles, u.profile.roles).length > 0;
}
