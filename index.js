require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('./config');
const bodyParser = require('body-parser');
const rp = require('request-promise');


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
//app.use(express.static('public'));
var email, userid, resp;

//Use the ApiKey and APISecret from config.js
// const payload = {
//     iss: config.APIKey,
//     exp: ((new Date()).getTime() + 5000)
// };
// const token = jwt.sign(payload, config.APISecret);
const payload = {
    iss: process.env.API_KEY,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, process.env.API_SECRET);


//get the form 
app.get('/', (req,res) => {
    res.send(req.body);
    console.log(req.body);
});

//use user from the form and make a post request to /userinfo
app.get('/user', (req, res) => {
  
  //Store the options for Zoom API which will be used to make an API call later.
    const options = {
        //You can use a different uri if you're making an API call to a different Zoom endpoint.
        uri: "https://api.zoom.us/v2/users", 
        qs: {
            status: 'active' 
            },
            auth: {
                'bearer': token
            },
            headers: {
                'User-Agent': 'Zoom-api-Jwt-Request',
                'content-type': 'application/json'
            },
            json: true //Parse the JSON string in the response
    };

    //Use request-promise module's .then() method to make request calls.
    rp(options)
    .then(function (response) {

        console.log(typeof response);
        resp = response
        
        console.log(token);
        res.json(response);
 
    })
    .catch(function (err) {
        // API call failed...
        console.log(err);
    });

});

app.get('/report', function(req, res) {

    const options = {
        //You can use a different uri if you're making an API call to a different Zoom endpoint.
        uri: "https://api.zoom.us/v2/report/daily", 
        qs: {
            status: 'active' 
            },
            auth: {
                'bearer': token
            },
            headers: {
                'User-Agent': 'Zoom-api-Jwt-Request',
                'content-type': 'application/json'
            },
            json: true //Parse the JSON string in the response
    };

    //Use request-promise module's .then() method to make request calls.
    rp(options)
    .then(function (response) {
    
        res.json(response);
 
    })
    .catch(function (err) {
        // API call failed...
        console.log(err);
    });

});


app.get('/meetingreport/:id', function(req, res) {
    const { id } = req.params;

    const options = {
        //You can use a different uri if you're making an API call to a different Zoom endpoint.
        uri: "https://api.zoom.us/v2//report/users/" + id +  "/meetings", 
        qs: {
            status: 'active' 
            },
            auth: {
                'bearer': token
            },
            headers: {
                'User-Agent': 'Zoom-api-Jwt-Request',
                'content-type': 'application/json'
            },
            json: true //Parse the JSON string in the response
    };

    rp(options)
    .then(function (response) {
        res.json(response);
 
    })
    .catch(function (err) {
        // API call failed...
        console.log(err);
    });

})


app.post('/signin', function(req, res) {

    const { email } = req.body;

    // {
    //     "email": "shubhamstyles90113@gmail.com"
    // }

    const options = {
        //You can use a different uri if you're making an API call to a different Zoom endpoint.
        uri: "https://api.zoom.us/v2/users/" + email, 
        qs: {
            status: 'active' 
            },
            auth: {
                'bearer': token
            },
            headers: {
                'User-Agent': 'Zoom-api-Jwt-Request',
                'content-type': 'application/json'
            },
            json: true //Parse the JSON string in the response
    };

    rp(options)
    .then(function (response) {
   
        res.json(response);
 
    })
    .catch(function (err) {
        
        console.log(err);
    });

});

app.post('/createUser', function(req, res) {

    const { email, first_name, last_name } = req.body;

    // body of the post
    // {
    //     "email": "shubhamstyles90113@gmail.com",
    //     "first_name": "Shubham",
    //     "last_name": "Kumar"
    // }

    const options = {
        method: 'POST',
        uri: "https://api.zoom.us/v2/users", 
        qs: {
            status: 'active' 
            },
            auth: {
                'bearer': token
            },
            headers: {
                'User-Agent': 'Zoom-api-Jwt-Request',
                'content-type': 'application/json'
            },
            body: {
                "action": "create",
                "user_info": {
                    "email": email,
                    "type": 1,
                    "first_name": first_name,
                    "last_name": last_name
                }
            },
            json: true //Parse the JSON string in the response
    };

    rp(options)
    .then(function (response) {
   
        console.log(typeof response);
        resp = response
 
        //console.log(token);
        res.json("Success");
 
    })
    .catch(function (err) {
        // API call failed...
        console.log(err);
    });
});

app.delete('/delete/:id', function(req, res) {
    const { id } = req.params; // email id of user is provided to delete their zoom account

    const options = {
        //You can use a different uri if you're making an API call to a different Zoom endpoint.
        uri: "https://api.zoom.us/v2/users/" + id, 
        qs: {
            status: 'active' 
            },
            auth: {
                'bearer': token
            },
            headers: {
                'User-Agent': 'Zoom-api-Jwt-Request',
                'content-type': 'application/json'
            },
            json: true //Parse the JSON string in the response
    };

    rp(options)
    .then(function (response) {
        res.json("Successfully deleted the user");
 
    })
    .catch(function (err) {
        // API call failed...
        console.log(err);
    });
})

app.get('/meetings', function(req, res) {

    const email = process.env.HOST_EMAIL;

    const options = {
        //You can use a different uri if you're making an API call to a different Zoom endpoint.
        uri: "https://api.zoom.us/v2/users/" + email + "/meetings", 
        qs: {
            status: 'active' 
            },
            auth: {
                'bearer': token
            },
            headers: {
                'User-Agent': 'Zoom-api-Jwt-Request',
                'content-type': 'application/json'
            },
            json: true //Parse the JSON string in the response
    };

    rp(options)
    .then(function (response) {
    
        res.json(response);
 
    })
    .catch(function (err) {
        // API call failed...
        console.log(err);
    });
});

app.post('/createMeeting', function(req, res) {

    const { topic, password } = req.body;

    const email = process.env.HOST_EMAIL;

    const options = {
        method: 'POST',
        uri: "https://api.zoom.us/v2/users/" + email + "/meetings", 
        qs: {
            status: 'active' 
            },
            auth: {
                'bearer': token
            },
            headers: {
                'User-Agent': 'Zoom-api-Jwt-Request',
                'content-type': 'application/json'
            },
            body: {
                "topic": topic,
                "type": 8,
                "start_time": new Date(),
                "duration": 60,
                "password": password,
                "recurrence": {
                    "type": "1",
                    "repeat_interval": "1",
                    "weekly_days": "4",
                    "monthly_day": 30,
                    "monthly_week": "4",
                    "monthly_week_day": "4",
                    "end_times": 1,
                    "end_date_time": "2021-07-04T16:20:00Z"
                },
                "settings": {
                    "host_video": true,
                    "participant_video": true,
                    "cn_meeting": false,
                    "in_meeting": false,
                    "join_before_host": false,
                    "mute_upon_entry": false,
                    "watermark": false,
                    "use_pmi": false,
                    "approval_type": 0,
                    "registration_type": 1,
                    "audio": "both",
                    "auto_recording": "none",
                    "alternative_hosts": "",
                    "close_registration": true,
                    "waiting_room": true,
                    "contact_name": "Umesh",
                    "contact_email": "abc@gmail.com",
                    "registrants_email_notification": true,
                    "meeting_authentication": true,
                    "authentication_option": "",
                    "authentication_domains": ""
                }
            },
            json: true //Parse the JSON string in the response
    };

    rp(options)
    .then(function (response) {
   
        console.log(typeof response);
        resp = response
 
        //console.log(token);
        res.json("Successfully created a new meeting");
 
    })
    .catch(function (err) {
        // API call failed...
        console.log(err);
    });

})


app.listen(3000, () => console.log('Server is running on port 3000'));

