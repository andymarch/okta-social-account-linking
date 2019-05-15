# Okta Social Account Linking

This demostration outlines a solution to linking a users federated identity from
a social media provider to an existing identity in Okta.

This project contains two components: a client and an account service.

## Account Service

The account service is a node server which provides the trusted backend to
interact with Okta. To configure this server you will need to create the
following .env file in the account-service directory.

```
ISSUER=https://<your-tenant>.okta.com/oauth2/default
CLIENT_ID=<your-client-id>
ORG_URL=https://<your-tenant>.okta.com
API_KEY=<okta-API-token>
FRONTEND_ADDRESS=http://localhost:8080
SCOPE=profile
```

This can then be run with the following two commands

```npm install```

```npm run start```

This service adds and removes values from a user's Okta profile to be used
during account linking

## Client

The client is a SPA which represents your frontend application. This will
require the following .env file in the client directory.

```
VUE_APP_ISSUER=https://<your-tenant>.oktacom/oauth2/default
VUE_APP_CLIENT_ID=<your-client-id>
VUE_APP_REDIRECT=http://localhost:8080/implicit/callback
VUE_APP_SCOPE=openid profile
VUE_APP_API_BASE_URI=http://localhost:3000

VUE_APP_LOGIN_IDP_ID=<login-idp-id>
VUE_APP_MATCHING_IDP_ID=<matching-idp-id>
VUE_APP_FACEBOOK_APP_ID=<your facebook app id>
```

This can then be run with the following commands:

```npm install``

```npm run serve```

User's will login through this application to access their profile to link and
unlink their Facebook account.

This SPA uses a custom callback function to catch the OAuth error that
provisioning is disabled and redirect the user to link an existing account or
create a new social mastered account.

Once the user has accessed their profile page they may see a box to complete
their Facebook email address. This calls the account service to update their
profile, after which they will be logged out and asked to sign in using this
address.

This demo takes advantage of the Facebook JS SDK, if the user is already logged
into Facebook and has granted permission to the application (i.e. they
previously tried to login with Facebook) their email address is automatically
completed and can be linked wihtout form filling. This SDK could also be used to
perform progressive profiling of data which the application's scopes grant it
access to such as name or age.

# Tenant Configuration

The following configuration is required in the tenant.

The Okta profile should be extended with the following attribute
```social_facebook_email```.

Two IDPs must be created for each of the required inbound federation providers
these must be configured with seperate policies:

The first is the signin IDP, this is used within the widget to login users who
have already linked their facebook account via the custom attribute.

```
"policy": {
        "provisioning": {
            "action": "DISABLED",
            "profileMaster": false,
            "groups": {
                "action": "NONE"
            },
            "conditions": {
                "deprovisioned": {
                    "action": "NONE"
                },
                "suspended": {
                    "action": "NONE"
                }
            }
        },
        "accountLink": {
            "filter": null,
            "action": "AUTO"
        },
        "subject": {
            "userNameTemplate": {
                "template": "idpuser.email"
            },
            "filter": null,
            "matchType": "CUSTOM_ATTRIBUTE",
            "matchAttribute": "social_facebook_email"
        },
        "maxClockSkew": 0
    },
```

The second is a matching IDP, this is used within the app to link users with the
configured attribute to their accounts. This can also create new users for
accounts which the user expects to have mastered by the social provider.

```
    "policy": {
        "provisioning": {
            "action": "AUTO",
            "profileMaster": false,
            "groups": {
                "action": "NONE"
            },
            "conditions": {
                "deprovisioned": {
                    "action": "NONE"
                },
                "suspended": {
                    "action": "NONE"
                }
            }
        },
        "accountLink": {
            "filter": null,
            "action": "DISABLED"
        },
        "subject": {
            "userNameTemplate": {
                "template": "idpuser.email"
            },
            "filter": null,
            "matchType": "CUSTOM_ATTRIBUTE",
            "matchAttribute": "social_facebook_email"
        },
        "maxClockSkew": 0
    },
```