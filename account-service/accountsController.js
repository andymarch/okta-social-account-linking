'use strict';

const okta = require('@okta/okta-sdk-nodejs');

const client = new okta.Client({
  orgUrl: process.env.ORG_URL,
  token: process.env.API_KEY    // Obtained from Developer Dashboard
});

exports.get_account_details = function(req,res){
    console.log("get account called for "+req.params.accountid)
    client.getUser(req.params.accountid)
    .then(user => {
        res.json(user)
    })
    .catch(error => {
        console.log(error)
    })
}

exports.link_facebook = function(req,res){
    console.log("link account called for "+req.params.accountid+" to "+req.body.facebook_email)
    client.getUser(req.params.accountid)
    .then(user => {
        user.profile.social_facebook_email = req.body.facebook_email;
        user.update()
        .then(user => {
            console.log("Account updated")
            res.json(user)
        })
    })
    .catch(error => {
    console.log(error)
    res.sendStatus(500)
    })
}

exports.unlink_facebook = function(req,res){
    console.log("unlink account called for "+req.params.accountid)
    client.getUser(req.params.accountid)
    .then(user => {
        user.profile.social_facebook_email = "";
        user.update()
        .then(user => res.json(user))
    })
    .catch(error => {
    console.log(error)
    res.sendStatus(500)
})

exports.link_google = function(req,res){
    console.log("link account called for "+req.params.accountid+" to "+req.body.google_email)
    client.getUser(req.params.accountid)
    .then(user => {
        user.profile.social_google_email = req.body.google_email;
        user.update()
        .then(user => {
            console.log("Account updated")
            res.json(user)
        })
    })
    .catch(error => {
    console.log(error)
    res.sendStatus(500)
    })
}

exports.unlink_goolge = function(req,res){
    console.log("unlink account called for "+req.params.accountid)
    client.getUser(req.params.accountid)
    .then(user => {
        user.profile.social_google_email = "";
        user.update()
        .then(user => res.json(user))
    })
    .catch(error => {
    console.log(error)
    res.sendStatus(500)
})
}
}
