# Okta Social Account Linking

This demostration outlines a solution to linking a users federated identity from
a social media provider to an existing identity in Okta.

This project contains two components: a client and a account service.

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

## Client

The client is a simple SPA which represents your frontend application. This will
require the following .env file in the client directory.

```
VUE_APP_ISSUER=https://<your-tenant>.oktacom/oauth2/default
VUE_APP_CLIENT_ID=<your-client-id>
VUE_APP_REDIRECT=http://localhost:8080/implicit/callback
VUE_APP_SCOPE=openid profile
VUE_APP_API_BASE_URI=http://localhost:3000

VUE_APP_LOGIN_IDP_ID=<login-idp-id>
VUE_APP_MATCHING_IDP_ID=<matching-idp-id>
```

This can then be run with the following commands:

```npm install``

```npm run serve```

# Tenant Configuration

The following configuration is required in the tenant.

The Okta profile should be extended with the following attribute
```social_facebook_email```.

Two IDPs must be created for each of the required inbound federation providers
these must be configured with seperate policies:

The first is a matching IDP, this is used within the app to link users with the
configured attribute to their accounts.
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

The second is a general IDP, this is used at sign in to maintain a normal
federated login experiance and to allow customers with linked accounts to use
their social identity to access their existing account.

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