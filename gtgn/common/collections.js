Playlists = new Mongo.Collection('playlists');
Posts = new Mongo.Collection('posts');
Columns = new Mongo.Collection('columns');

Meteor.users.deny({update: function () { return true; }});

if (Meteor.isClient) {
    Videos = new Mongo.Collection(null);
    MyBlogPosts = new Mongo.Collection('myblogposts');
    PendingBlogPosts = new Mongo.Collection('pendingblogposts');
    PublishedBlogPosts = new Mongo.Collection('publishedblogposts');
    PublicBlogPosts = new Mongo.Collection('publicblogposts');
}
