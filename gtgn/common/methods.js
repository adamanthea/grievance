Meteor.methods({
    "AddPlaylist": function (playlist) {
        check(Meteor.userId(), String);
        check(playlist, {
            name: String,
            youtube_id: [String],
            icon: String,
            logo: String,
            image: String,
            category: String
        });

        if (!_.contains(PlaylistCategories, playlist.category)) {
            throw new Meteor.Error(602, "Invalid Category");
        }

        if (!canYou(Meteor.userId(), ['admin'])) {
            throw new Meteor.Error(403, "Insufficient Permissions");
        }

        return Playlists.insert(playlist);
    },
    "UpdatePlaylist": function (playlist_id, playlist) {
        check(Meteor.userId(), String);
        check(playlist_id, String);
        check(playlist, {
            name: String,
            youtube_id: [String],
            icon: String,
            logo: String,
            image: String,
            category: String
        });

        if (!_.contains(PlaylistCategories, playlist.category)) {
            throw new Meteor.Error(602, "Invalid Category");
        }

        if (!canYou(Meteor.userId(), ['admin'])) {
            throw new Meteor.Error(403, "Insufficient Permissions");
        }

        var exists = Playlists.findOne({_id: playlist_id});
        if (!exists) {
            throw new Meteor.Error(404, "Playlist not found");
        }

        return Playlists.update({_id: playlist_id},{$set: playlist});
    },
    "DeletePlaylist": function (playlist_id) {
        check(Meteor.userId(), String);
        check(playlist_id, String);

        if (!canYou(Meteor.userId(), ["admin"])) {
            throw new Meteor.Error(403, "Insufficient Permissions");
        }

        return Playlists.remove({_id: post_id});
    },
    "AddUser": function (options) {
        check(Meteor.userId(), String);
        check(options, {
            email: String,
            profile: {
                roles: [String]
            }
        });

        if (!canYou(Meteor.userId(), ['admin'])) {
            throw new Meteor.Error(403, 'Insufficient Permissions');
        }

        if (_.intersection(options.profile.roles, UserRoles).length !== options.profile.roles.length) {
            throw new Meteor.Error(404, 'One or more roles are invalid');
        }

        if (Meteor.isServer) {
            var user = {};

            options.profile.displayname = 'Anonymous';
            options.profile.gravatar = Gravatar.imageUrl(options.email);
            options.profile.bio = '';

            user._id = Accounts.createUser(options);
            if (!user._id) {
                return {success: false, error: 'Failed Creating User'};
            }
            Accounts.sendEnrollmentEmail(user._id);
            Meteor.users.update({_id: user._id}, {$addToSet: {'profile.roles': user._id}});
        }

        return {success: true};
    },
    "ChangeDisplayName": function (options) {
        check(Meteor.userId(), String);
        check(options, {
            user_id: String,
            displayname: String,
            bio: String
        });

        if (!canYou(Meteor.userId(), [options.user_id, 'admin'])) {
            throw new Meteor.Error(403, "Insufficient Permissions");
        }

        var user = Meteor.users.findOne({_id: options.user_id});
        if (!user) {
            throw new Meteor.Error(404, "User Not Found");
        }

        var exists = Meteor.users.findOne({'profile.displayname': options.displayname});
        if (exists) {
            throw new Meteor.Error(403, "Display Name Taken");
        }

        var s = Meteor.users.update({_id: options.user_id}, {$set: {'profile.displayname': options.displayname, 'profile.bio': options.bio}});
        if (s && Meteor.isServer) {
            Meteor.defer(function () {
                Posts.update({author_id: options.user_id}, {$set: {author_name: options.displayname, author_bio: options.bio}}, {multi: true});
            });
        }
        return s;
    },
    "UpdateUser": function (options) {
        check(Meteor.userId(), String);
        check(options, {
            user_id: String,
            displayname: String,
            bio: String,
            roles: [String]
        });

        if (!canYou(Meteor.userId(), ['admin'])) {
            throw new Meteor.Error(403, "Insufficient Permissions");
        }

        if (Meteor.userId() === options.user_id && !_.contains(options.roles, 'admin')) {
            throw new Meteor.Error(403, "You cannot revoke your own admin rights");
        }

        var user = Meteor.users.findOne({_id: options.user_id});
        if (!user) {
            throw new Meteor.Error(404, "User Not Found");
        }

        var exists = Meteor.users.findOne({'profile.displayname': options.displayname});
        if (exists && exists._id !== user._id) {
            throw new Meteor.Error(403, "Display Name Taken");
        }

        if (_.intersection(options.roles, UserRoles).length !== options.roles.length) {
            throw new Meteor.Error(404, 'One or more roles are invalid');
        }

        options.roles.push(options.user_id);
        var s = Meteor.users.update({_id: options.user_id}, {$set: {'profile.roles': options.roles, 'profile.displayname': options.displayname, 'profile.bio': options.bio}});
        if (s && Meteor.isServer) {
            Meteor.defer(function () {
                Posts.update({author_id: options.user_id}, {$set: {author_name: options.displayname, author_bio: options.bio}}, {multi: true});
            });
        }
        return s;
    },
    "DeleteUser": function (user_id) {
        check(Meteor.userId(), String);
        check(user_id, String);

        if (!canYou(Meteor.userId(), ['admin'])) {
            throw new Meteor.Error(403, "Insufficient Permissions");
        }

        if (Meteor.userId() === user_id) {
            throw new Meteor.Error(403, "You cannot delete yourself");
        }

        var user = Meteor.users.findOne({_id: options.user_id});
        if (!user) {
            throw new Meteor.Error(404, "User Not Found");
        }

        return Meteor.users.remove({_id: user_id});
    },
    "CreateColumn": function (name) {
        check(Meteor.userId(), String);
        check(name, String);

        if (!canYou(Meteor.userId(), ['admin'])) {
            throw new Meteor.Error(403, "Insufficient Permissions");
        }

        var exists = Columns.findOne({name: name});
        if (exists) {
            throw new Meteor.Error(403, "Column Already Exists");
        }

        return Columns.insert({name: name});
    },
    "CreateBlogPost": function (options) {
        check(Meteor.userId(), String);
        check(options, {
            column_id: String,
            hero: String
        });

        var user = {};
        if (!canYou(Meteor.userId(), ['admin','blog editor','blog writer'], user)) {
            throw new Meteor.Error(403, "Insufficient Permissions");
        }

        var column = Columns.findOne({_id: options.column_id});
        if (!column) {
            throw new Meteor.Error(404, "Column does not exist");
        }

        options.column_name = column.name;
        options.author_name = user.profile.displayname;
        options.author_id = user._id;
        options.author_gravatar = user.profile.gravatar;
        options.author_bio = user.profile.bio;
        options.created_date = new Date();
        options.state = ['draft'];
        options.type = 'blog';

        return Posts.insert(options);
    },
    "UpdateBlogPostColumn": function (post_id, options) {
        check(Meteor.userId(), String);
        check(post_id, String);
        check(options, {
            column_id: String,
            hero: String
        });

        var user = {};
        if (!canYou(Meteor.userId(), ['admin','blog editor','blog writer'], user)) {
            throw new Meteor.Error(403, "Insufficient Permissions");
        }

        var column = Columns.findOne({_id: options.column_id});
        if (!column) {
            throw new Meteor.Error(404, "Column does not exist");
        }

        var post = Posts.findOne({_id: post_id});
        if (!post) {
            throw new Meteor.Error(404, "Post not found");
        }

        if (_.intersection(post.state, ["pending","published"]).length > 0 && !canYou(Meteor.userId(), ["blog editor", "admin"])) {
            throw new Meteor.Error(403, "Insufficient Permissions");
        }

        options.column_name = column.name;

        return Posts.update({_id: post_id}, {$set: options});
    },
    "SaveBlogPost": function (post_id, options) {
        check(Meteor.userId(), String);
        check(post_id, String);
        check(options, {
            draft_title: String,
            draft_body: String
        });

        var post = Posts.findOne({_id: post_id});
        if (!post) {
            throw new Meteor.Error(404, "Post not found");
        }

        if (!canYou(Meteor.userId(), [post.author_id, "blog editor", "admin"])) {
            throw new Meteor.Error(403, "Insufficient Permissions");
        }

        if (_.contains(post.state, "pending") && !canYou(Meteor.userId(), ["blog editor", "admin"])) {
            throw new Meteor.Error(403, "Insufficient Permissions");
        }

        return Posts.update({_id: post_id}, {$set: options, $addToSet: {state: 'draft'}});
    },
    "SubmitBlogPost": function (post_id) {
        check(Meteor.userId(), String);
        check(post_id, String);

        var post = Posts.findOne({_id: post_id});
        if (!post) {
            throw new Meteor.Error(404, "Post not found");
        }

        if (!canYou(Meteor.userId(), [post.author_id, "blog editor", "admin"])) {
            throw new Meteor.Error(403, "Insufficient Permissions");
        }

        return Posts.update({_id: post_id}, {$pullAll: {state: ['draft','rejected']}, $addToSet: {state: 'pending'}});
    },
    "PublishBlogPost": function (post_id, publish_date) {
        check(Meteor.userId(), String);
        check(post_id, String);
        check(publish_date, String);

        var pd = moment(publish_date, "MM-DD-YYYY HH:mm");

        if (!pd.isValid()) {
            throw new Meteor.Error(404, "Invalid Publish Date")
        }

        var post = Posts.findOne({_id: post_id});
        if (!post) {
            throw new Meteor.Error(404, "Post not found");
        }

        if (!canYou(Meteor.userId(), ["blog editor", "admin"])) {
            throw new Meteor.Error(403, "Insufficient Permissions");
        }

        if (Posts.update({_id: post_id}, {$set: {publish_date: pd.utc().toDate(), publish_title: post.draft_title, publish_body: post.draft_body}, $pullAll: {state: ['draft', 'pending', 'rejected']}})) {
            return Posts.update({_id: post_id}, {$addToSet: {state: 'published'}});
        }
    },
    "RejectBlogPost": function (post_id) {
        check(Meteor.userId(), String);
        check(post_id, String);

        var post = Posts.findOne({_id: post_id});
        if (!post) {
            throw new Meteor.Error(404, "Post not found");
        }

        if (!canYou(Meteor.userId(), ["blog editor", "admin"])) {
            throw new Meteor.Error(403, "Insufficient Permissions");
        }

        return Posts.update({_id: post_id}, {$pullAll: {state: ['draft','pending']}, $addToSet: {state: 'rejected'}});
    },
    "DeleteBlogPost": function (post_id) {
        check(Meteor.userId(), String);
        check(post_id, String);

        if (!canYou(Meteor.userId(), ["admin"])) {
            throw new Meteor.Error(403, "Insufficient Permissions");
        }

        return Posts.remove({_id: post_id});
    }
});
