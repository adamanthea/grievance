UI.registerHelper('equals', function (a, b) {
    return a == b;
});

UI.registerHelper('buildRadioId', function (a, b) {
    return 'r_' + a + '_' + b;
});

UI.registerHelper('oidToString', function (a) {
    return '' + a;
});

UI.registerHelper('addIndex', function (all) {
    return _.map(all, function(val, index) {
        return {index: index, value: val};
    });
});

UI.registerHelper('timeago', function (date) {
    return moment(date).fromNow();
});

UI.registerHelper('prune', function (string) {
    return _s.prune(string, 30);
});

UI.registerHelper('datetostring', function (date) {
    return moment(date).utc().format("MM-DD-YYYY HH:mm");
});

UI.registerHelper("blogeditor", function () {
    var user = Meteor.user();
    if (user && _.intersection(user.profile.roles, ['admin','review editor']).length > 0) {
        return true;
    } else {
        return false;
    }
});

toastr.options.timeOut = 15000;
