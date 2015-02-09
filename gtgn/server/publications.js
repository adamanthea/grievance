Meteor.publish('playlists', function () {
    return Playlists.find();
});

Meteor.publish('users', function () {
    return Meteor.users.find({}, {fields: {_id: 1, 'profile.displayname': 1, 'profile.gravatar': 1, 'profile.roles': 1, 'profile.bio': 1}});
});

Meteor.publish('publicblogposts', function (limit) {
    var sub = this;
    check(limit, Match.Integer);
    var cur = Posts.find({publish_date: {$lte: new Date()}, state: 'published'}, {fields: {created_date: 0, draft_title: 0, draft_body: 0}, sort: ['publish_date', 'desc'], limit: limit});
    Mongo.Collection._publishCursor(cur, sub, 'publicblogposts');
    return sub.ready();
});

Meteor.publish('publicblogpostsbycolumn', function (column, limit) {
    var sub = this;
    check(limit, Match.Integer);
    check(column, String);
    var cur = Posts.find({column_id: column, publish_date: {$lte: new Date()}, state: 'published'}, {fields: {created_date: 0, draft_title: 0, draft_body: 0}, sort: ['publish_date', 'desc'], limit: limit});
    Mongo.Collection._publishCursor(cur, sub, 'publicblogposts');
    return sub.ready();
});

Meteor.publish('publicblogpostsbyauthor', function (author, limit) {
    var sub = this;
    check(limit, Match.Integer);
    check(author, String);
    var cur = Posts.find({author_id: author, publish_date: {$lte: new Date()}, state: 'published'}, {fields: {created_date: 0, draft_title: 0, draft_body: 0}, sort: ['publish_date', 'desc'], limit: limit});
    Mongo.Collection._publishCursor(cur, sub, 'publicblogposts');
    return sub.ready();
});

Meteor.publish('myblogposts', function (limit) {
    var sub = this;
    check(limit, Match.Integer);
    check(sub.userId, String);

    var cur = Posts.find({author_id: sub.userId}, {sort: ['createdate', 'desc'], limit: limit});

    Mongo.Collection._publishCursor(cur, sub, 'myblogposts');

    return sub.ready();
});

Meteor.publish('pendingblogposts', function (limit) {
    var sub = this;
    check(limit, Match.Integer);
    check(sub.userId, String);
    if (!canYou(sub.userId, ['admin','blog editor'])) {
        return sub.ready();
    }
    var cur = Posts.find({state: 'pending'}, {sort: ['createdate', 'desc'], limit: limit});

    Mongo.Collection._publishCursor(cur, sub, 'pendingblogposts');

    return sub.ready();
});

Meteor.publish('publishedblogposts', function (limit) {
    var sub = this;
    check(limit, Match.Integer);
    check(sub.userId, String);
    if (!canYou(sub.userId, ['admin','blog editor'])) {
        return sub.ready();
    }
    var cur = Posts.find({state: 'published'}, {sort: ['createdate', 'desc'], limit: limit});

    Mongo.Collection._publishCursor(cur, sub, 'publishedblogposts');

    return sub.ready();
});

Meteor.publish('columns', function () {
    return Columns.find();
});

Meteor.publish('blogpost', function (post_id) {
    check(this.userId, String);
    if (!canYou(this.userId, ['admin','blog editor'])) {
        return Posts.find({_id: post_id, author_id: this.userId})
    } else {
        return Posts.find({_id: post_id});
    }
});

Meteor.publish('publicblogpost', function (post_id) {
    return Posts.find({_id: post_id, publish_date: {$lte: new Date()}, state: 'published'}, {fields: {created_date: 0, draft_title: 0, draft_body: 0}});
});
