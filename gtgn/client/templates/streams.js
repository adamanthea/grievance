streamsinstance = null;
Template.streams.rendered = function () {
    streamsinstance = this;
    streamsinstance.fetchstreams();
    streamsinstance.interval = Meteor.setInterval(streamsinstance.fetchstreams, 30000);
    streamsinstance.$('.ui.accordion').accordion('setting', {
        onClose: function () {
            $(this).html('<p>Loading</p>');
        },
        onOpen: function () {
            var sn = '';
            var instance = streamsinstance;
            var self = this;
            _.each(instance.streams, function (channel) {
                var c = _s.replaceAll(channel, ' ', '').toLowerCase();
                if ($(self).hasClass(c)) {
                    sn = c;
                }
            });
            if (sn) {
                $(self).html('<div class="twitch-frame-wrapper"><iframe src="http://www.twitch.tv/' + sn + '/embed" frameborder="0" scrolling="no"></iframe></div>');
            }
        }
    });
}

Template.streams.destroyed = function () {
    var self = this;
    Meteor.clearInterval(self.interval);
}

Template.streams.created = function () {
    var self = this;

    self.streams = ['Grievance','GTGN Streaming','Geeky Barista'];
    self.fetchstreams = function () {
        _.each(self.streams, function (channel) {
            var c = _s.replaceAll(channel, ' ', '').toLowerCase();
            $.ajax({
                url:"https://api.twitch.tv/kraken/streams/"+c,
                type:"GET",
                jsonp: "callback",
                dataType: "jsonp",
                headers: { accept: "application/vnd.twitchtv.v2+json" },
                success: function (data) {
                    console.log(c + ' updated');
                    var ele = $('.gtgn.stream.wrapper.column .ui.accordion .title.' + c + ' span');
                    if (data.stream && data.stream.viewers) {
                        ele.html('Online - ' + data.stream.channel.status + ' - ' + data.stream.viewers + ' Viewers');
                    } else {
                        ele.html('Offline');
                    }
                },
                error: function (e) { console.dir(e); }
            });
        });
    }
}
