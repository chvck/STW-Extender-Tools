jQuery(document).ready(function ($) {

    function stringToBool(value) {
        return value === 'true';
    }

    function hidePosts(showSomeonePosted, users) {
        $('.bbp-author-name').each(function () {
            var $parent = $(this).parent().parent()
                , $post = $parent.children('.bbp-reply-content')
                , user = $(this).text();

            if (users && users.indexOf(user) !== -1) {
                $(this).parent().append("&emsp;<span class='unblockUser' style='display:inline; cursor:pointer; color:#333; text-decoration:underline;'>Unblock User</span>");
                if (showSomeonePosted) {
                    $parent.hide();
                    $parent.after("<p class='showLink' style='cursor:pointer; color:#333; text-decoration:underline;'>Show post from " + user + "</p");
                } else {
                    $parent.hide();
                }

            } else {
                $(this).parent().append("&emsp;<span class='hideUser' style='display:inline; cursor:pointer; color:#333; text-decoration:underline;'>Block User</span>");
            }
        });

        $(document).on("click", ".showLink", function () {
            $(this).parent().children().fadeIn();
            $(this).remove();
        });


        $(document).on("click", ".hideUser", function () {
            $(this).attr('class', 'unblockUser');
            $(this).text('Unblock User');
            var user = $(this).parent().children('.bbp-author-name').text();
            if (users.indexOf(user) === -1) {
                chrome.runtime.sendMessage({ msg: 'hide_user', username: user }, function (response) {
                    users = response.result.users;
                });
            }
            var $parent = $(this).parent().parent()
                , $post = $parent.children('.bbp-reply-content');
            if (showSomeonePosted) {
                $parent.fadeOut();
                $parent.after("<p class='showLink' style='cursor:pointer; color:#333; text-decoration:underline;'>Show post from " + user + "</p");
            } else {
                $post.fadeOut();
            }
        });

        $(document).on("click", ".unblockUser", function () {
            $(this).attr('class', 'hideUser');
            $(this).text('Block User');
            var user = $(this).parent().children('.bbp-author-name').text();
            if (users.indexOf(user) != -1) {
                chrome.runtime.sendMessage({ msg: 'unblock_user', username: user }, function (response) {
                    users = response.result.users;
                });
            }
        });
    }

    function hideThreads(users) {
        $('.bbp-author-name').each(function () {
            if (users.indexOf($(this).text()) !== -1) {
                $(this).parent().parent().hide();
            }
        });
    }

    function makeQuoteUsername(username, quoteVerb) {
        var usernameP = $('<p></p>');
        var usernameStrong = $('<strong></string>')
        usernameStrong.text(username + ' ' + quoteVerb)
        usernameP.append(usernameStrong)

        return usernameP;
    }

    function makeQuotePost($post) {
        var $blockQuote = $('<blockquote></blockquote>')
        $post.each(function (key, val) {
            $blockQuote.append($(val).clone());
        })

        return $blockQuote;
    }

    function unNestQuotes($element) {
        return $element.map(function () {
            if ($(this).is('blockquote') || $(this).hasClass('bbcode-quote'))
                return '<blockquote>' + unNestQuotes($(this).children()) + '</blockquote>';
            return $(this).text();
        }).get().join('\n');
    }

    function addEasyQuotes(appendQuotes, quoteVerb) {
        $('.bbp-reply-author').append("&emsp;<span class='easyQuote' style='display:inline; cursor:pointer; color:#333; text-decoration:underline;'>Quote</span>");

        $(document).on("click", ".easyQuote", function () {
            var $parent = $(this).parent().parent(),
                $post = $parent.children('.bbp-reply-content').children('p, blockquote, .bbcode-quote'),
                user = $(this).parent().children('.bbp-author-name').text();

            var $contentBox = $('#bbp_reply_content');
            if ($contentBox) {
                var quote = quote = '[strong]' + user + '[/strong] ' + quoteVerb + ':<blockquote>' + unNestQuotes($post) + '</blockquote>\n\n';

                if (appendQuotes) {
                    quote = $contentBox.val() + '\n' + quote;
                }
                $contentBox.val(quote);
            } else {
                $contentBox = $('#bbp_reply_content_ifr').contents().find('#tinymce');
                if (!appendQuotes) {
                    $contentBox.empty();
                }

                var $usernameQuote = makeQuoteUsername(user, quoteVerb);
                var $postQuote = makeQuotePost($post);
                $contentBox.append($usernameQuote);
                $contentBox.append($postQuote);
            }
            $contentBox.focus();
        });
    }

    function backToForumTops() {
        $('#bbpress-forums .bbp-pagination').after("Return to <a href=\"/forum/\">Overview</a> <a href=\"/forum/forum/bike-chat\">Bike Forum</a> <a href=\"/forum/forum/off-topic\">Chat Forum</a>");
    }

    function addSignature(signature) {
        if (signature != null && signature != '') {
            $('#bbp_reply_submit').click(function () {
                var $form = $(this).parent().parent()
                    , $text = $form.find('#bbp_reply_content').val();
                $('#bbp_reply_content').val($text + '\n' + signature);
            });
        }
    }

    chrome.runtime.sendMessage({ msg: 'get_options' }, function (response) {
        var users = response.result.users;
        var showSomeonePosted = stringToBool(response.result.showSomeonePosted);
        var quoteVerb = response.result.quoteVerb;
        if ((quoteVerb === undefined) || (quoteVerb === "")) {
            quoteVerb = 'wrote';
        }
        var appendQuotes = stringToBool(response.result.enableAppendQuotes);
        var signature = response.result.signature;
        var isTopic = document.URL.indexOf('forum/topic/') != -1;
        var isReplies = document.URL.indexOf('forums/replies/') != -1;
        if (stringToBool(response.result.enableHideUsers) && isTopic) {
            hidePosts(showSomeonePosted, users);
        }
        if (stringToBool(response.result.enableHideThreads) && users && !isTopic && !isReplies) {
            hideThreads(users);
        }
        if (stringToBool(response.result.enableEasyQuoting) && isTopic) {
            addEasyQuotes(appendQuotes, quoteVerb);
        }
        if (stringToBool(response.result.enableSignature) && isTopic) {
            addSignature(signature);
        }
        backToForumTops();

    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.msg === 'add_quote') {
        $('#post_content').val(request.quotetext);
    }
});
