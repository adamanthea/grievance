Template.playlist.created = function () {
    instance = this;

    instance.vid = new ReactiveVar('');

    instance.autorun(function () {
        var pid = Iron.controller().state.get('playlist_id');
        var playlist = Playlists.findOne({_id: pid});

        if (playlist) {

            $.ajax({
                url:"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=" + playlist.youtube_id[0] + "&key=AIzaSyBtEWgZfrMh5p3-KM5jc0rh9ma9wgx7PqA&maxResults=50",
                type:"GET",
                jsonp: "callback",
                dataType: "jsonp",
                success: function (data) {
                    Videos.find().forEach(function(doc){ Videos.remove({_id: doc._id}) });
                      _.each(data.items, function (item) {
                            var id = Videos.insert(item.snippet);
                            if (item.snippet.position === 0) {
                                instance.vid.set(id);
                            }
                      });
                },
                error: function (e) { console.dir(e); }
            });

        }
    });
}

Template.playlist.destroyed = function () {
    Videos.find().forEach(function(doc){ Videos.remove({_id: doc._id}) });
}

Template.playlist.rendered = function () {
    $(this.firstNode).find('.menu .item').tab();
}

Template.playlistnav.rendered = function () {
    var self = this;
    $(self.firstNode).parent('.scrollable').smoothDivScroll({ manualContinuousScrolling: true, hotSpotScrollingStep: 5 });
}

Template.playlist.helpers({
    active: function () {
        var id = Template.instance().vid.get();
        return Videos.findOne({_id: id});
    },
    videos: function () {
        return Videos.find({}, { sort: ['position', 'asc'] });
    },
    bestres: function () {
        var tn = this.thumbnails;
        if (tn.standard) {
            return tn.standard.url;
        }
        if (tn.high) {
            return tn.high.url;
        }
        if (tn.medium) {
            return tn.medium.url;
        }
        if (tn.default) {
            return tn.default.url;
        }
    },
    categories: function () {
        return PlaylistCategories;
    },
    playlists: function () {
        return Playlists.find({category: this.toString()}, { sort: ['name', 'asc'] });
    },
    first: function () {
        if(PlaylistCategories.indexOf(this.toString()) === 0) {
            return "active ";
        } else {
            return "";
        }
    }
});

Template.playlist.events({
    "click .video.card": function (e, i) {
        e.preventDefault();
        i.vid.set(this._id);
    }
});

Template.videos.rendered = function () {
    $(this.firstNode).find('.menu .item').tab();
}

Template.videos.helpers({
    categories: function () {
        return PlaylistCategories;
    },
    first: function () {
        if(PlaylistCategories.indexOf(this.toString()) === 0) {
            return "active ";
        } else {
            return "";
        }
    },
    playlists: function () {
        return Playlists.find({category: this.toString()}, { sort: ['name', 'asc'] });
    }
});

Template.adminmanageplaylists.helpers({
    playlists: function () {
        return Playlists.find({}, { sort: [['category', 'asc'], ['name', 'asc']] });
    }
});

Template.addplaylist.rendered = function () {
    var self = this;
    self.$('.ui.dropdown').dropdown();
}

Template.addplaylist.helpers({
    categories: function () {
        return PlaylistCategories;
    }
});

Template.addplaylist.events({
    "click button[name=add]": function (e, i) {
        e.preventDefault();

        var f = $(e.target).parent('.ui.form');
        var doc = {
            name: f.find("input[name=name]").val(),
            youtube_id: [f.find("input[name=id]").val()],
            icon: f.find("input[name=icon]").val(),
            logo: f.find("input[name=logo]").val(),
            image: f.find("input[name=image]").val(),
            category: f.find("input[name=category]").val()
        }
        debugger;

        Meteor.call('AddPlaylist', doc, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            }
            if (result) {
                toastr.success('Playlist added');
                f.find("input").val('');
                f.find('.ui.dropdown').dropdown('restore defaults');
            }
        });
    }
});

Template.editplaylist.rendered = function () {
    this.$('button[name=delete]').popup({on: 'click'});
}

Template.editplaylist.helpers({
    categories: function () {
        return PlaylistCategories;
    },
    firstplaylist: function () {
        return this.youtube_id[0];
    }
});

Template.editplaylist.events({
    "click button[name=confirm]": function (e, i) {
        e.preventDefault();
        Meteor.call('DeletePlaylist', this._id, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            } else if (result) {
                toastr.success('Playlist deleted');
                Router.go('/admin/videos');
            }
        });
    },
    "click button[name=update]": function (e, i) {
        e.preventDefault();

        var f = $(e.target).parent('.ui.form');
        var doc = {
            name: f.find("input[name=name]").val(),
            youtube_id: [f.find("input[name=id]").val()],
            icon: f.find("input[name=icon]").val(),
            logo: f.find("input[name=logo]").val(),
            image: f.find("input[name=image]").val(),
            category: f.find("input[name=category]").val()
        }
        debugger;

        Meteor.call('UpdatePlaylist', doc, function (error, result) {
            if (error) {
                return toastr.error(error.reason);
            }
            if (result) {
                toastr.success('Playlist updated');
                Router.go('/admin/videos');
            }
        });
    }
});
