'use strict';

const okta = require('@okta/okta-sdk-nodejs');
const { response } = require('express');

const client = new okta.Client({
  orgUrl: process.env.ORG_URL,
  token: process.env.API_KEY    // Obtained from Developer Dashboard
});

exports.get_idps = function(req,res){
    console.log("get idps called for "+req.params.accountid)
    const url = `${client.baseUrl}/api/v1/users/${req.params.accountid}/idps`;
    const request = {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      };
      client.http.http(url, request)
      .then(res => res.text())
      .then(text => {
        console.log(text);
        res.send(text)
      })
      .catch(err => {
        console.error(err);
      });
}

exports.unlink_idp = function(req,res){
    console.log("get idps called for "+req.params.accountid+ " with "+req.params.idpid)
    const url = `${client.baseUrl}/api/v1/idps/${req.params.idpid}/users/${req.params.accountid}`;
    const request = {
        method: 'delete',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      };
      client.http.http(url, request)
      .then(response => res.sendStatus(response.status))
      .catch(err => {
        console.error(err);
      });
}
