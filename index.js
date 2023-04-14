// initialize variables
const inquirer = require('inquirer'),
      mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
});

// connect to the database
connection.connect((error) => {
    if (error) throw error;
    console.log('Connected to MySQL server.');
});

// Create the prompts
const questions = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What would you like the title to be for your application?',
            validate: validateInput // validate the input is not empty
        }
    ])
};

const validateInput = async (input) => {
    // if input has data, return true
    if (input) {
        return true;
    } 
    // else display a message to the user
    return 'You must enter the information.';
};

function init() {
    questions().then(answers => {
        // do something
    }).then(data => {
        // do something
    }).catch(err => {
        // console log the error
        console.log("Error: " + err)
    });
}

// initialize the application
init();