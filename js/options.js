$(function () {
    var $users = $('#users')
        , $hideUsers = $('#enable_hide_users')
        , $showPosted = $('#enable_show_posted')
        , $hideThreads = $('#enable_hide_threads')
        , $hideShare = $('#enable_hide_share')
        , $easyQuoting = $('#enable_easy_quoting')
        , $appendQuotes = $('#enable_append_quotes')
		, $addSignature = $('#enable_signature')
		, $signature = $('#signature')
		, $quoteVerb = $('#quoteVerb');

    function restoreOptions() {
        $users.val(localStorage.blockedUsers);
  
        if (localStorage.enableHideUsers === 'true') {
            $hideUsers.attr('checked', 'checked');
        } else {
            $hideUsers.removeAttr('checked');
        }
        
        if (localStorage.showSomeonePosted === 'true') {
            $showPosted.attr('checked', 'checked');
        } else {
            $showPosted.removeAttr('checked');
        }
    
        if (localStorage.enableHideThreads === 'true') {
            $hideThreads.attr('checked', 'checked');
        } else {
            $hideThreads.removeAttr('checked');
        }
  
        if (localStorage.enableHideShare === 'true') {
            $hideShare.attr('checked', 'checked');
        } else {
            $hideShare.removeAttr('checked');
        }

        if (localStorage.enableEasyQuoting === 'true') {
            $easyQuoting.attr('checked', 'checked');
        } else {
            $easyQuoting.removeAttr('checked');
        }
		
        if (localStorage.enableAppendQuotes === 'true') {
            $appendQuotes.attr('checked', 'checked');
        } else {
            $appendQuotes.removeAttr('checked');
        }
		
		$quoteVerb.val(localStorage.quoteVerb);
		
		if (localStorage.enableSignature === 'true') {
            $addSignature.attr('checked', 'checked');
        } else {
            $addSignature.removeAttr('checked');
        }
		
		$signature.val(localStorage.signature);
    }

    function saveOptions() {
        var message = []
            , users = $users.val()
            , $hideUsersChecked = $hideUsers.is(':checked')
            , $showPostedChecked = $showPosted.is(':checked')
            , $hideThreadsChecked = $hideThreads.is(':checked')
            , $hideShareChecked = $hideShare.is(':checked')
            , $easyQuotingChecked = $easyQuoting.is(':checked')
            , $appendQuotesChecked = $appendQuotes.is(':checked')
			, $addSignatureChecked = $addSignature.is(':checked')
			, quoteVerb = $quoteVerb.val()
            , hideUsers = localStorage.enableHideUsers
            , showPosted = localStorage.showSomeonePosted
            , hideThreads = localStorage.enableHideThreads
            , hideShare = localStorage.enableHideShare
            , easyQuoting = localStorage.enableEasyQuoting
            , appendQuotes = localStorage.enableAppendQuotes
			, addSignature = localStorage.enableSignature
			, signature = $signature.val()
            , messageText = ''
            , $message = $('#status-message');

            

        if (localStorage.blockedUsers !== users) {
            message.push('Blocked users updated.');
        }
        localStorage.blockedUsers = users;

                
        if ($hideUsersChecked && String($hideUsersChecked) !== hideUsers) {
            message.push('Block users enabled!');
        } else if (String($hideUsersChecked) !== hideUsers) {
            message.push('Block users disabled!');
        }
        localStorage.enableHideUsers = $hideUsersChecked;
        
                        
        if ($showPostedChecked && String($showPostedChecked) !== showPosted) {
            message.push('Show that someone posted enabled!');
        } else if (String($showPostedChecked) !== showPosted) {
            message.push('Show that someone posted disabled!');
        }
        localStorage.showSomeonePosted = $showPostedChecked;
        
        if ($hideThreadsChecked && String($hideThreadsChecked) !== hideThreads) {
            message.push('Hide blocked users threads enabled!');
        } else if (String($hideThreadsChecked) !== hideThreads) {
            message.push('Hide blocked users threads disabled!');
        }
        localStorage.enableHideThreads = $hideThreadsChecked; 

        if ($hideShareChecked && String($hideShareChecked) !== hideShare) {
            message.push('Hide share button enabled!');
        } else if (String($hideShareChecked) !== hideShare) {
            message.push('Hide share button disabled!');
        }
        localStorage.enableHideShare = $hideShareChecked; 

        if ($easyQuotingChecked && String($easyQuotingChecked) !== easyQuoting) {
            message.push('Easy quoting enabled!');
        } else if (String($easyQuotingChecked) !== easyQuoting) {
            message.push('Easy quoting disabled!');
        }
        localStorage.enableEasyQuoting = $easyQuotingChecked;  
		
        if ($appendQuotesChecked && String($appendQuotesChecked) !== appendQuotes) {
            message.push('Append quotes enabled!');
        } else if (String($appendQuotesChecked) !== appendQuotes) {
            message.push('Append quotes disabled!');
        }
        localStorage.enableAppendQuotes = $appendQuotesChecked;  
		
		if (localStorage.quoteVerb !== quoteVerb) {
            message.push('Quotation verb updated!');
        }
		localStorage.quoteVerb = quoteVerb;  
		
		if ($addSignatureChecked && String($addSignatureChecked) !== addSignature) {
            message.push('Add Signature enabled!');
        } else if (String($addSignatureChecked) !== addSignature) {
            message.push('Add Signature disabled!');
        }
        localStorage.enableSignature = $addSignatureChecked;  
		
		if (localStorage.signature !== signature) {
            message.push('Signature updated!');
        }
		localStorage.signature = signature; 
		

        function hideMessage() {
            $message.fadeOut();
        }
        
        if (message.length > 0) {
            $.each(message, function (index, obj) {
                messageText += obj + '<br>';
            });
            $message.html(messageText).fadeIn();
            setTimeout(hideMessage, 5000);
        }
    }


    (function () {
        $('.buttons .save').live('click', function () {
            saveOptions();
            window.close();
            return false;
        });

        $('.buttons .apply').live('click', function () {
            saveOptions();
            return false;
        });

        $('.buttons .cancel').live('click', function () {
            window.close();
            return false;
        });

        restoreOptions();
    }());
});
