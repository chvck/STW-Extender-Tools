/*
* =====================================================================
* Event bindings.
* =====================================================================
*/

// Any requests send via chrome ext messaging system.
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    if (request.msg === 'get_options') {
        sendResponse({msg: 'ok', result: {
            'users' : localStorage.blockedUsers
            , 'enableHideUsers' : localStorage.enableHideUsers
            , 'enableHideThreads' : localStorage.enableHideThreads
            , 'showSomeonePosted' : localStorage.showSomeonePosted
            , 'enableEasyQuoting' : localStorage.enableEasyQuoting
			, 'quoteVerb'		  : localStorage.quoteVerb
        }, error: null});
        return;
    } else if (request.msg === 'hide_user') {
        localStorage.blockedUsers = localStorage.blockedUsers + ',' + request.username;
        sendResponse({msg: 'ok', result: {
            'users' : localStorage.blockedUsers
        }, error: null});
        return;
    }

    // We need to send a reponse, even if it's empty.
    sendResponse({msg: 'error', result: null, error: 'nothing called!'});
});