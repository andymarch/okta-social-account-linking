'use strict'

module.exports = function(app){
    var account = require('./accountsController');

app.route('/account/:accountid')
    .get(account.get_account_details)

app.route('/account/:accountid/facebook')
    .post(account.link_facebook)
    .delete(account.unlink_facebook)

app.route('/account/:accountid/google')
    .post(account.link_facebook)
    .delete(account.unlink_facebook)
};