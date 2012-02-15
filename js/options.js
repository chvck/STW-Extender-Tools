$(function () {
    var $users = $('#users')
        , $hideUsers = $('#enable_hide_users')
        , $showPosted = $('#enable_show_posted')
        , $hideThreads = $('#enable_hide_threads')
        , $easyQuoting = $('#enable_easy_quoting');

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
  
        if (localStorage.enableEasyQuoting === 'true') {
            $easyQuoting.attr('checked', 'checked');
        } else {
            $easyQuoting.removeAttr('checked');
        }
    }

    function saveOptions() {
        var message = []
            , users = $users.val()
            , $hideUsersChecked = $hideUsers.is(':checked')
            , $showPostedChecked = $showPosted.is(':checked')
            , $hideThreadsChecked = $hideThreads.is(':checked')
            , $easyQuotingChecked = $easyQuoting.is(':checked')
            , hideUsers = localStorage.enableHideUsers
            , showPosted = localStorage.showSomeonePosted
            , hideThreads = localStorage.enableHideThreads
            , easyQuoting = localStorage.enableEasyQuoting
            , messageText = ''
            , $message = $('#status-message');

        if (users) {
            if (localStorage.blockedUsers !== users) {
                message.push('Blocked users updated.');
            }
            localStorage.blockedUsers = users;
        }
                
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

        if ($easyQuotingChecked && String($easyQuotingChecked) !== easyQuoting) {
            message.push('Easy quoting enabled!');
        } else if (String($easyQuotingChecked) !== easyQuoting) {
            message.push('Easy quoting disabled!');
        }
        localStorage.enableEasyQuoting = $easyQuotingChecked;  

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