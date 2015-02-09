AccountsTemplates.configure({
    // Behaviour
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: true,
    overrideLoginErrors: true,
    sendVerificationEmail: true,
    enforceEmailVerification: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: true,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: true,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,

    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 4000
});

AccountsTemplates.configureRoute('changePwd', {layoutTemplate: 'BareLayout', redirect: '/admin'});
AccountsTemplates.configureRoute('signIn', {layoutTemplate: 'BareLayout', redirect: '/admin'});
AccountsTemplates.configureRoute('forgotPwd', {layoutTemplate: 'BareLayout', redirect: '/'});
AccountsTemplates.configureRoute('enrollAccount', {layoutTemplate: 'BareLayout', redirect: '/admin'});
AccountsTemplates.configureRoute('resetPwd', {layoutTemplate: 'BareLayout', redirect: '/admin'});
AccountsTemplates.configureRoute('verifyEmail', {layoutTemplate: 'BareLayout', redirect: '/admin'});

PlaylistCategories = ['Newscasts','MMORPG','MOBA','Shooter','PC and Console','Card Games'];

UserRoles = ['blog writer','blog editor','reviews writer','reviews editor','admin'];
