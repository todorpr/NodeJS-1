var prompt = require('prompt');

//
// Start the prompt
//
function initPrompt(user) {
    prompt.start();

//
// Get two properties from the user: username and email
//
    prompt.get([user], function (err, result) {
        //
        // Log the results.
        //
        //console.log('Command-line input received:');
        //console.log('  username: ' + result.username);
        //console.log('  email: ' + result.email);
        initPrompt();
    });

}
initPrompt("Todor");