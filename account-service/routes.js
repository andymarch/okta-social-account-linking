'use strict'

module.exports = function(app){
    var account = require('./accountsController');

app.route('/account/:accountid/idps')
    .get(account.get_idps)

app.route('/account/:accountid/:idpid')
    .delete(account.unlink_idp)
};

