document.addEventListener('DOMContentLoaded', function() {

    var access_token = document.location.hash.substring(14, 44);
    console.log(access_token);
    if (access_token === "") {
        window.location.replace(location.protocol + '//' + document.domain + ':' + location.port);
    }

    var subs;

    document.querySelector('#submit').onclick = () => {
        const name = document.querySelector('#title').value;
        document.querySelector('#sub_section').style.display='none';
        document.querySelector('#error').innerHTML = "";
        getUser(access_token, name);

    };

    document.querySelector('#select_sub').onclick = () => {

        let winner = subs[Math.floor(Math.random() * subs.length)].user_name;
        document.querySelector('#winner').innerHTML = `The winner is ${winner}`;
    };

    function getUser(access_token, name) {
        const request = new XMLHttpRequest();
        request.open('GET', `https://api.twitch.tv/helix/users?login=${name}`);

        request.onload = () => {
            console.log(request.status);
            const data = JSON.parse(request.responseText);

            if (request.status === 200 && data.data.length > 0) {
                console.log(data);
                let id = data.data[0].id;
                console.log(id);

                getSubs(access_token, id);
            } else {

                document.querySelector('#error').innerHTML = "Could not find a user with that name. Please try again."
            }
        };

        request.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
        request.setRequestHeader('Client-ID', '8hmoymcr26qiaiomwfmqtrxexi723r');
        request.setRequestHeader('Authorization', `Bearer ${access_token}`);

        request.send();
    };

    function getSubs(access_token, id) {
        const request = new XMLHttpRequest();
        request.open('GET', `https://api.twitch.tv/helix/subscriptions?broadcaster_id=${id}`);

        request.onload = () => {
            const data = JSON.parse(request.responseText);
            console.log(data);
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

});

