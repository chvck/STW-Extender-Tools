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
            , 'enableHideShare' : localStorage.enableHideShare
            , 'showSomeonePosted' : localStorage.showSomeonePosted
            , 'enableEasyQuoting' : localStorage.enableEasyQuoting
			, 'enableSignature'   : localStorage.enableSignature
			, 'quoteVerb'		  : localStorage.quoteVerb
			, 'signature'		  : localStorage.signature
        }, error: null});
        return;
    } else if (request.msg === 'hide_user') {
        localStorage.blockedUsers = localStorage.blockedUsers + ',' + request.username;
        sendResponse({msg: 'ok', result: {
            'users' : localStorage.blockedUsers
        }, error: null});
        return;
    } else if (request.msg === 'unblock_user') {
        localStorage.blockedUsers = localStorage.blockedUsers.replace( ',' + request.username, "");
        sendResponse({msg: 'ok', result: {
            'users' : localStorage.blockedUsers
        }, error: null});	
	}

    // We need to send a reponse, even if it's empty.
    sendResponse({msg: 'error', result: null, error: 'nothing called!'});
});
