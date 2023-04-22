const connection = require('./db');
const Table = require('cli-table3');
const inquirer = require('inquirer');

const validateId = async (input) => {
    let regex = /^(?:0|[1-9]\d{0,8}|1\d{9}|2[0-1][0-4]\d{7}|214748364[0-7])$/;
    if (regex.test(input)) { return true; }
    return 'You must enter integers. You must enter a number less than or equal to 2147483647.';
};

const validateInput = async (input) => {
    let regex = /^.{1,30}$/;
    if (regex.test(input)) { return true; }
    return 'You must enter a valid name that is less than 30 characters.';
};

const validateSalary = async (input) => {
    let regex = /^\d{1,8}(\.\d{1,2})?$/;
    if (regex.test(input)) { return true; }
    return 'You must enter a valid salary value between 0 and 99999999.';
};

class Role {
    viewAllRoles (callback) {
        let query = `
            SELECT role.id, role.title, dept.name AS department, role.salary
            FROM roles role
            INNER JOIN departments AS dept ON role.department_id = dept.id
            ORDER BY role.id ASC;
        `;
        connection.query(query, (err, result, fields) => {
            if (err) throw err;
            const deptData = result;
            const table = new Table({
                head: ['ID', 'Title', 'Department ID', 'Salary'],
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
            deptData.forEach((row) => {
                table.push([row.id, row.title, row.department, row.salary]);
            });
            console.log(table.toString());
            callback();
        });
    }
    addRole (callback) {
        let query1 = `
            SELECT id, name FROM departments
        `;
        connection.query(query1, (err, result, fields) => {
            if (err) throw err;
            const deptChoices = result.map(role => {
                return { name: role.name, value: role.id }
            });
            let addRolePrompt = [
                {
                    type: 'input',
                    name: 'id',
                    message: 'What is the ID for the role you would like to add?',
                    validate: validateId 
                },
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
                    INSERT INTO roles (id,title,salary,department_id)
                    VALUES (${response.id}, "${response.title}", ${response.salary}, ${response.dept})
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
                    message: 'Select an role to remove from the database:',
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