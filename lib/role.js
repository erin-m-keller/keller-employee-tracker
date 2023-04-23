// initialize variables
const connection = require('./db'),
      Table = require('cli-table3'),
      inquirer = require('inquirer');

/**
 * @validateInput
 * validates input is 30
 * characters or less
 */
const validateInput = async (input) => {
    // initialize variables
    let regex = /^.{1,30}$/;
    // return true if value passes regex test
    if (regex.test(input)) { return true; }
    // else, return error message
    return 'You must enter a valid name that is less than 30 characters.';
};

/**
 * @validateSalary
 * validates input is a
 * valid salary
 */
const validateSalary = async (input) => {
    // initialize variables
    let regex = /^\d{1,8}(\.\d{1,2})?$/;
    // return true if value passes regex test
    if (regex.test(input)) { return true; }
    // else, return error message
    return 'You must enter a valid salary value between 0 and 99999999.';
};

/**
 * @Role
 * This class provides methods to create, 
 * read, update, and delete employee records 
 * in the database
 */
class Role {
    /**
     * @viewAllRoles
     * SQL query returns the id, title, 
     * department name, and salary for 
     * each role saved in the database
     */
    viewAllRoles (callback) {
        // initialize variables
        let query = `
            SELECT role.id, role.title, dept.name AS department, role.salary
            FROM roles role
            INNER JOIN departments AS dept ON role.department_id = dept.id
            ORDER BY role.id ASC;
        `;
        // connect to the database and submit the SQL query
        connection.query(query, (err, result, fields) => {
            // throw error if an error occurs
            if (err) throw err;
            // initialize the variables
            const deptData = result,
                  table = new Table({
                head: ['ID', 'Role', 'Department', 'Salary'],
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
                table.push([row.id, row.title, row.department, row.salary]);
            });
            // display the table in the terminal
            console.log(table.toString());
            // fires off the @terminalPrompts function in index.js to display the menu to the user
            callback();
        });
    }
    /**
     * @addRole
     * SQL query that allows a user
     * to add a new role to the
     * database
     */
    addRole (callback) {
        // initialize variables
        let query1 = `
            SELECT id, name FROM departments
        `;
        // connect to the database and submit the SQL query
        connection.query(query1, (err, result, fields) => {
            // throw error if an error occurs
            if (err) throw err;
            // initialize the variables
            const deptChoices = result.map(role => {
                return { name: role.name, value: role.id }
            }), 
            addRolePrompt = [
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the name of the role you would like to add?',
                    validate: validateInput 
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary of the new role?',
                    validate: validateSalary 
                },
                {
                    type: 'list',
                    name: 'dept',
                    message: 'Select the department for the new role:',
                    choices: deptChoices
                }
            ]
            inquirer.prompt(addRolePrompt).then((response) => {
                let query2 = `
                    INSERT INTO roles (title,salary,department_id)
                    VALUES ('${response.title}', ${response.salary}, '${response.dept}')
                `;
                connection.query(query2, (err, result, fields) => {
                    if (err) throw err;
                    console.log('\x1b[32m%s\x1b[0m',`Successfully added Role: ${response.title}`);
                    callback();
                });
            });
        });
    }
    deleteRole (callback) {
        let query1 = `
            SELECT id, title FROM roles
        `;
        connection.query(query1, (err, result, fields) => {
            if (err) throw err;
            const roleChoices = result.map(emp => {
                return { name: emp.title, value: emp.id }
            });
            let rolePrompt = [
                {
                    type: 'list',
                    name: 'role',
                    message: 'Select a role to remove from the database:',
                    choices: roleChoices
                }
            ]
            inquirer.prompt(rolePrompt).then((response) => {
                console.log(JSON.stringify(response));
                let query2 = `
                    DELETE FROM roles
                    WHERE id = ${response.role};
                `;
                connection.query(query2, (err, result, fields) => {
                    if (err) throw err;
                    console.log('\x1b[32m%s\x1b[0m',`Successfully removed role with the ID: ${response.role}`);
                    callback();
                });
            });
        });
    }
};

module.exports = Role;