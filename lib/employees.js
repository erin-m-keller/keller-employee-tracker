const connection = require('./db');
const Table = require('cli-table3');
const inquirer = require('inquirer');

const validateInput = async (input) => {
    // if input has data, return true
    if (input) {
        return true;
    } 
    // else display a message to the user
    return 'You must enter the information.';
};

class Employees {
    viewAllEmployees (callback) {
        let query = `
            SELECT emp.id, emp.first_name, emp.last_name, role.title, dept.name AS department, role.salary, CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager
            FROM employees emp
            INNER JOIN roles role ON emp.role_id = role.id
            INNER JOIN departments dept ON role.department_id = dept.id
            LEFT JOIN employees mgr ON emp.manager_id = mgr.id
            ORDER BY emp.id ASC;
        `;
        connection.query(query, (err, result, fields) => {
            if (err) throw err;
            const empData = result;
            const table = new Table({
                head: ['ID', 'Employee First Name', 'Employee Last Name', 'Role', 'Department', 'Salary', 'Manager'],
                colWidths: [10, 30, 30, 30, 30, 12, 60],
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
            empData.forEach((row) => {
                table.push([row.id, row.first_name, row.last_name, row.title, row.department, row.salary, row.manager]);
            });
            console.log(table.toString());
            callback();
        });
    }
    viewEmployeesByManager (callback) {
        let query = `
            SELECT empMgr.first_name AS first, empMgr.last_name AS last, GROUP_CONCAT(CONCAT(emp.first_name, ' ', emp.last_name) SEPARATOR ' | ') AS list
            FROM employees emp
            LEFT JOIN employees AS empMgr ON emp.manager_id = empMgr.id
            GROUP BY emp.manager_id
            ORDER BY first ASC;
        `;
        connection.query(query, (err, result, fields) => {
            if (err) throw err;
            const mgrData = result;
            const table = new Table({
                head: ['Manager First Name', 'Manager Last Name', 'Employee List'],
                colWidths: [30, 30, 'auto'],
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
            mgrData.forEach((row) => {
                table.push([row.first, row.last, row.list]);
            });
            console.log(table.toString());
            callback();
        });
    }
    viewEmployeesByDept (callback) {
        let query = `
            SELECT emp.first_name AS first, emp.last_name AS last, dept.name AS department
            FROM employees emp
            INNER JOIN roles AS role ON emp.role_id = role.id
            INNER JOIN departments AS dept ON role.department_id = dept.id
            ORDER BY department ASC;
        `;
        connection.query(query, (err, result, fields) => {
            if (err) throw err;
            const empDeptData = result;
            const table = new Table({
                head: ['Employee First Name', 'Employee Last Name', 'Department'],
                colWidths: [30, 30, 'auto'],
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
            empDeptData.forEach((row) => {
                table.push([row.first, row.last, row.department]);
            });
            console.log(table.toString());
            callback();
        });
    }
    addEmployee (callback) {
        let query1 = `
            SELECT id, title FROM roles
        `;
        connection.query(query1, (err, result, fields) => {
            if (err) throw err;
            const roleChoices = result.map(role => {
                return { name: role.title, value: role.id }
            });
            let addEmpPrompt = [
                {
                    type: 'input',
                    name: 'first',
                    message: 'What is the first name of the new employee?',
                    validate: validateInput 
                },
                {
                    type: 'input',
                    name: 'last',
                    message: 'What is the last name of the new employee?',
                    validate: validateInput 
                },
                {
                    type: 'list',
                    name: 'jobTitle',
                    message: 'Select a role for the employee:',
                    choices: roleChoices
                }
            ]
            inquirer.prompt(addEmpPrompt).then((firstPrompt) => {
                let query2 = `
                    SELECT id, CONCAT(first_name, ' ', last_name) AS manager FROM employees
                `;
                connection.query(query2, (err, result, fields) => {
                    if (err) throw err;
                
                    const mgrChoices = result.map(role => {
                        return {
                            name: role.manager,
                            value: role.id
                        }
                    });
                    let mgrPrompt = [
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Select a Manager for the employee:',
                            choices: mgrChoices
                        }
                    ];
                    inquirer.prompt(mgrPrompt).then((secondPrompt) => {
                        let query3 = `
                            INSERT INTO employees (first_name, last_name, role_id, manager_id)
                            VALUES ("${firstPrompt.first}", "${firstPrompt.last}", ${firstPrompt.jobTitle}, ${secondPrompt.manager})
                        `;
                        connection.query(query3, (err, result, fields) => {
                            if (err) throw err;
                            console.log(`Successfully added ${firstPrompt.first} ${firstPrompt.last} - ${firstPrompt.jobTitle} - ${secondPrompt.manager}`);
                            callback();
                        });
                    });
                });
            });
        });
    }

};

module.exports = Employees;