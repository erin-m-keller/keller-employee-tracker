// initialize variables
const connection = require('./db'),
      Table = require('cli-table3'),
      inquirer = require('inquirer');

/**
 * @validateInput
 * validates input is 30
 * characters or less
 */
const validateDept = async (input) => {
    // initialize variables
    let regex = /^.+$/;
    // return true if value passes regex test
    if (regex.test(input)) { return true; }
    // else, return error message
    return 'You must enter a name for the department.';
};

/**
 * @Department
 * This class provides methods to create, 
 * read, and delete department records 
 * from the departments table in the
 * database
 */
class Department {
    /**
     * @viewAllDept
     * SQL query returns the id, and
     * title from the departments table
     * in the database
     */
    viewAllDept (callback) {
        // initialize variables
        let query = `SELECT * FROM departments`;
        // connect to the database and execute the SQL query
        connection.query(query, (err, result, fields) => {
            // throw error if an error occurs
            if (err) throw err;
            // initialize the variables
            const deptData = result,
            table = new Table({
                head: ['ID', 'Name'],
                colWidths: [10, 30],
                style: {
                    head: ['brightMagenta','bold'],
                    border: ['cyan']
                },
                chars: {
                    'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
                    'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
                    'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
                    'right': '│', 'right-mid': '┤', 'middle': '│'
                }
            });
            // loop through the data to push each row to the table
            deptData.forEach((row) => {
                // push each row to the cli-table
                table.push([row.id, row.name]);
            });
            // display the table in the terminal
            console.log(table.toString());
            // fires off the @terminalPrompts function in index.js to display the menu to the user
            callback();
        });
    }
    /**
     * @addDept
     * Prompts user for the name of the
     * department, then uses an SQL query
     * to insert the department into the
     * departments table in the database
     */
    addDept (callback) {
        // initialize variables
        let addDeptPrompt = [
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the new department you would like to add?',
                validate: validateDept // validates input is 30 characters or less
            }
        ]
        // prompt the user with 1 question, then generate the SQL query
        inquirer.prompt(addDeptPrompt).then((response) => {
            // initialize variables
            let query = `
                INSERT INTO departments (name)
                VALUES ('${response.name}')
            `;
            // connect to the database and execute the SQL query
            connection.query(query, (err, result, fields) => {
                // throw error if an error occurs
                if (err) throw err;
                // log the success message
                console.log('\x1b[32m%s\x1b[0m',`Successfully added the department: ${response.name}`);
                // fires off the @terminalPrompts function in index.js to display the menu to the user
                callback();
            });
        });
    }
    /**
     * @deleteDept
     * Prompts user for the name of the
     * department, then uses an SQL query
     * to delete the department from the
     * departments table in the database
     */
    deleteDept (callback) {
        // initialize variables
        let query1 = `
            SELECT id, name FROM departments
        `;
        // connect to the database and execute the SQL query
        connection.query(query1, (err, result, fields) => {
            // throw error if an error occurs
            if (err) throw err;
            // initialize variables
            const deptChoices = result.map(dept => {
                // set name and value for inquirer list choices; clicking a name returns the ID
                return { name: dept.name, value: dept.id }
            }),
            deptPrompt = [
                {
                    type: 'list',
                    name: 'dept',
                    message: 'Select a department to remove from the database:',
                    choices: deptChoices // generated list of department names, returns department ID
                }
            ]
            // prompt the user with 1 question, then generate the SQL query
            inquirer.prompt(deptPrompt).then((response) => {
                // initialize variables
                let query2 = `
                    DELETE FROM departments
                    WHERE id = ${response.dept};
                `;
                // connect to the database and execute the SQL query
                connection.query(query2, (err, result, fields) => {
                    // throw error if an error occurs
                    if (err) throw err;
                    // log the success message
                    console.log('\x1b[32m%s\x1b[0m',`Successfully removed department with the ID: ${response.dept}`);
                    // fires off the @terminalPrompts function in index.js to display the menu to the user
                    callback();
                });
            });
        });
    }
};

// export the class
module.exports = Department;