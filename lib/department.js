const connection = require('./db');
const Table = require('cli-table3');
const inquirer = require('inquirer');

const validateDept = async (input) => {
    let regex = /^.+$/;
    if (regex.test(input)) { return true; }
    return 'You must enter a name for the department.';
};

class Department {
    viewAllDept (callback) {
        let query = `SELECT * FROM departments`;
        connection.query(query, (err, result, fields) => {
            if (err) throw err;
            const deptData = result;
            const table = new Table({
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
            deptData.forEach((row) => {
                table.push([row.id, row.name]);
            });
            console.log(table.toString());
            callback();
        });
    }
    addDept (callback) {
        let addDeptPrompt = [
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the new department you would like to add?',
                validate: validateDept 
            }
        ]
        inquirer.prompt(addDeptPrompt).then((response) => {
            let query = `
                INSERT INTO departments (name)
                VALUES ('${response.name}')
            `;
            connection.query(query, (err, result, fields) => {
                if (err) throw err;
                console.log('\x1b[32m%s\x1b[0m',`Successfully added the department: ${response.name}`);
                callback();
            });
        });
    }
    deleteDept (callback) {
        let query1 = `
            SELECT id, name FROM departments
        `;
        connection.query(query1, (err, result, fields) => {
            if (err) throw err;
            const deptChoices = result.map(dept => {
                return { name: dept.name, value: dept.id }
            });
            let deptPrompt = [
                {
                    type: 'list',
                    name: 'dept',
                    message: 'Select a department to remove from the database:',
                    choices: deptChoices
                }
            ]
            inquirer.prompt(deptPrompt).then((response) => {
                let query2 = `
                    DELETE FROM departments
                    WHERE id = ${response.dept};
                `;
                connection.query(query2, (err, result, fields) => {
                    if (err) throw err;
                    console.log('\x1b[32m%s\x1b[0m',`Successfully removed department with the ID: ${response.dept}`);
                    callback();
                });
            });
        });
    }
};

module.exports = Department;