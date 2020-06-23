document.addEventListener('DOMContentLoaded', function() {

    var access_token = document.location.hash.substring(14, 44);
    if (access_token === "") {
        window.location.replace(location.protocol + '//' + document.domain + ':' + location.port);
    }

    var subs;

    validateAccessToken(access_token);

    // check if user access token is valid. If not, send the user back. Otherwise, get the users subscribers.
    function validateAccessToken(access_token) {
        const request = new XMLHttpRequest();
        request.open('GET', `https://id.twitch.tv/oauth2/validate`);

        request.onload = () => {
            const data = JSON.parse(request.responseText);

            if (request.status === 200) {
                let login = data.login;
                let id = data.user_id;

                document.querySelector('#greet').innerHTML = `Hi, ${login}`;

                getSubs(access_token, id);
            } else {

                window.location.replace(location.protocol + '//' + document.domain + ':' + location.port);
            }
        };

        request.setRequestHeader('Authorization', `OAuth ${access_token}`);

        request.send();

    };

    // pick a random subscriber from a list of all subscribers
    document.querySelector('#select_sub').onclick = () => {

        let winner = subs[Math.floor(Math.random() * subs.length)].user_name;
        document.querySelector('#winner').innerHTML = `The winner is ${winner}`;
    };

    // get a users list of subscribers
    function getSubs(access_token, id) {
        const request = new XMLHttpRequest();
        request.open('GET', `https://api.twitch.tv/helix/subscriptions?broadcaster_id=${id}`);

        request.onload = () => {
            const data = JSON.parse(request.responseText);
            if (request.status === 200) {
                let subLen = data.data.length;

                document.querySelector('#sub_section').style.display='block';
                document.querySelector('#sub_count').innerHTML = `Your channel has ${subLen} subscriber(s)`;

                subs = data.data;

                if (subLen > 0) {
                    document.querySelector('#select_sub').style.display = 'inline';
                }

            } else {
                document.querySelector('#error').innerHTML = "Please enter the username or display name of your Twitch account."
            }

        };

        request.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
        request.setRequestHeader('Client-ID', '8hmoymcr26qiaiomwfmqtrxexi723r');
        request.setRequestHeader('Authorization', `Bearer ${access_token}`);

        request.send();

    };

    // revoke the user access token when the user leaves or closes the window
    window.onbeforeunload = function() {
        const request = new XMLHttpRequest();
        request.open('POST', `https://id.twitch.tv/oauth2/revoke?client_id=8hmoymcr26qiaiomwfmqtrxexi723r&token=${access_token}`);

        request.onload = () => {
            
        };

        request.send();

    };

});

