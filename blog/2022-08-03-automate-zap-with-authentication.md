---
title: Automate ZAP with Authentication
author: Rebecca Falke (and much input from Max Maass)
author_title: Core Developer
author_url: https://github.com/rebeccan
author_image_url: https://avatars.githubusercontent.com/u/5824721?s=400&u=0e2d51378109239b2e5822a2c9a43b04b96c43fb&v=4
tags:
- secureCodeBox
- OWASP ZAP automation
- Authentication
description: This post describes how to automate ZAP to authenticate against an API
---

## Introduction what we will do here
Working with ZAP and authentication cannot be done manually in some cases. For example, if we cannot intercept a UI's webbrowser, but imported the API by an OpenAPI spec and want to start an automatic scan, ZAP needs to know how to authenticate. Another example are short-lived JWTs which need frequent rotation / reauthentication. 
In this tutorial we will add a script to ZAP that fetches a JWT from an endpoint using username and password in the request body.
The JWT will be added to the header as a Bearer token by another script to each request ZAP sends.

## Add your authentication script and load it into the context

First of all, open the ZAP scripting tab. Also not the console output is useful for debugging. ![Scripting tab](/img/blog/2022-08-03-0-scripting-console.PNG)

Add a script called `TokenEndpointUsernamePasswordBody.js` that will handle the authentication. ![Add script](/img/blog/2022-08-03-1-add-script.PNG)

Add the following content:
```javascript
// The authenticate function will be called for authentications made via ZAP.

var HttpRequestHeader = Java.type('org.parosproxy.paros.network.HttpRequestHeader');
var HttpHeader = Java.type('org.parosproxy.paros.network.HttpHeader');
var URI = Java.type('org.apache.commons.httpclient.URI');
var ScriptVars = Java.type('org.zaproxy.zap.extension.script.ScriptVars');

// The authenticate function is called whenever ZAP requires to authenticate, for a Context for which this script
// was selected as the Authentication Method. The function should send any messages that are required to do the authentication
// and should return a message with an authenticated response so the calling method.
//
// NOTE: Any message sent in the function should be obtained using the 'helper.prepareMessage()' method.
//
// Parameters:
//        helper - a helper class providing useful methods: prepareMessage(), sendAndReceive(msg), getHttpSender()
//        paramsValues - the values of the parameters configured in the Session Properties -> Authentication panel.
//                    The paramsValues is a map, having as keys the parameters names (as returned by the getRequiredParamsNames()
//                    and getOptionalParamsNames() functions below)
//        credentials - an object containing the credentials values, as configured in the Session Properties -> Users panel.
//                    The credential values can be obtained via calls to the getParam(paramName) method. The param names are the ones
//                    returned by the getCredentialsParamsNames() below
// Curl:
// curl -X POST -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "grant_type=client_credentials" --data-urlencode "client_id=<username>" --data-urlencode "client_secret=<password>" <tokenendpoint

function authenticate(helper, paramsValues, credentials) {
  print("\nAuthenticating via JavaScript script...");

  var endpoint = paramsValues.get("EndpointForAuthentication");
  print("\nAuth endpoint is " + endpoint);

  var requestUri = new URI(endpoint, false);
  var requestMethod = HttpRequestHeader.POST;
  var requestHeader = new HttpRequestHeader(requestMethod, requestUri, HttpHeader.HTTP11);
  var msg = helper.prepareMessage();
  msg.setRequestHeader(requestHeader);

  var username = credentials.getParam("username");
  var password = credentials.getParam("password")
  print("Authenticate with username: " +  username);

  msg.setRequestBody("grant_type=client_credentials&client_id=" + username + "&client_secret=" + password);
  msg.getRequestHeader().setContentLength(msg.getRequestBody().length());

  helper.sendAndReceive(msg);

  var response = msg.getResponseBody().toString();
  print("\nResponse is: " + response);
  var json = JSON.parse(response);

  var token = json.access_token;
  print("\n Endpoint returned token: " + token);

  ScriptVars.setGlobalVar("access_token", token);

  return msg;
}

// This function is called during the script loading to obtain a list of the names of the required configuration parameters,
// that will be shown in the Session Properties -> Authentication panel for configuration. They can be used
// to input dynamic data into the script, from the user interface (e.g. a login URL, name of POST parameters etc.)
function getRequiredParamsNames(){
  return ["EndpointForAuthentication"];
}

// This function is called during the script loading to obtain a list of the names of the optional configuration parameters,
// that will be shown in the Session Properties -> Authentication panel for configuration. They can be used
// to input dynamic data into the script, from the user interface (e.g. a login URL, name of POST parameters etc.)
function getOptionalParamsNames(){
  return [];
}

// This function is called during the script loading to obtain a list of the names of the parameters that are required,
// as credentials, for each User configured corresponding to an Authentication using this script 
function getCredentialsParamsNames(){
  return ["username", "password"];
}

// This optional function is called during the script loading to obtain the logged in indicator.
// NOTE: although optional this function must be implemented along with the function getLoggedOutIndicator().
//function getLoggedInIndicator() {
//    return "LoggedInIndicator";
//}

// This optional function is called during the script loading to obtain the logged out indicator.
// NOTE: although optional this function must be implemented along with the function getLoggedInIndicator().
//function getLoggedOutIndicator() {
//    return "LoggedOutIndicator";
//}
```

Double click on Standard-Context and go to `Authentication`. Load the script `TokenEndpointUsernamePasswordBody.js` and add the required parameters, e.g. endpoint. For Logged-out pattern, you can click on a response text later and add it.
![Load TokenEndpointUsernamePasswordBody.js](/img/blog/2022-08-03-3-load-script.PNG)

Add user(s) with the username and password under users (in double click standard context).
![Add users](/img/blog/2022-08-03-4-add-user.PNG)

# Enable the script that grabs the access_token and sets the header
The script AddBearerTokenHeader.js (should already be existent in ZAP) runs on each request, grabs the `access_token` and adds it to each request header. The scripts needs to be enabled in order to run. ![Enable script AddBearerTokenHeader.js](/img/blog/2022-08-03-2-bearer.PNG)

# Enable User mode
![Add users](/img/blog/2022-08-03-5-user-mode.PNG)

# Logged-out pattern
Click on an endpoint / request and click "resend". If you get a response indicating that you are not logged in, you add the response's text to the logged-out pattern.
![Logged-out pattern](/img/blog/2022-08-03-6-logged-out.PNG)

ZAP will now always run your authentication script once a response indicates that we are logged out. If you send the request manually (e.g. with resend), then you need to click on resend again, because only after the second time the new access_token was set again by the authentication script.

Hopefully this guide helps to do some awesome testing :-)
