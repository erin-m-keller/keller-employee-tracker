const connection = require('./db');
const Table = require('cli-table3');
const inquirer = require('inquirer');

const validateInput = async (input) => {
    // TODO - ensure input is not NULL or more than 30 characters
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
        let query1 = `
            SELECT DISTINCT emp.manager_id AS id, CONCAT(mgr.first_name, ' ', mgr.last_name) AS name
            FROM employees emp
            JOIN employees mgr ON emp.manager_id = mgr.id
            ORDER BY name ASC;
        `;
        connection.query(query1, (err, result, fields) => {
            if (err) throw err;
            const mgrChoices = result.map(mgr => {
                return { name: mgr.name, value: mgr.id }
            });
            let mgrPrompt = [
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Select a manager to view a list of their employees:',
                    choices: mgrChoices
                }
            ]
            inquirer.prompt(mgrPrompt).then((response) => {
                console.log(JSON.stringify(response));
                let query2 = `
                    SELECT CONCAT(emp.first_name, ' ', emp.last_name) AS employee, CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager
                    FROM employees emp
                    LEFT JOIN employees mgr ON emp.manager_id = mgr.id
                    WHERE mgr.id = ${response.manager}
                    ORDER BY employee ASC;
                `;
                connection.query(query2, (err, result, fields) => {
                    if (err) throw err;
                    const empDeptData = result;
                    const table = new Table({
                        head: ['Employee Name', 'Manager Name'],
                        colWidths: [60, 'auto'],
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
                        table.push([row.employee, row.manager]);
                    });
                    console.log(table.toString());
                    callback();
                });
            });
        });
    }
    viewEmployeesByDept (callback) {
        let query1 = `
            SELECT id, name FROM departments
        `;
        connection.query(query1, (err, result, fields) => {
            if (err) throw err;
            const departmentChoices = result.map(dept => {
                return { name: dept.name, value: dept.id }
            });
            let empPrompt = [
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select a department to view a list of employees:',
                    choices: departmentChoices
                }
            ]
            inquirer.prompt(empPrompt).then((response) => {
                let query2 = `
                    SELECT CONCAT(first_name, ' ', last_name) AS employee, dept.name AS department
                    FROM employees emp
                    INNER JOIN roles AS role ON emp.role_id = role.id
                    INNER JOIN departments AS dept ON role.department_id = dept.id
                    WHERE dept.id = ${response.employee}
                    ORDER BY department ASC;
                `;
                connection.query(query2, (err, result, fields) => {
                    if (err) throw err;
                    const empDeptData = result;
                    const table = new Table({
                        head: ['Employee Name', 'Department'],
                        colWidths: [60, 'auto'],
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
                        table.push([row.employee, row.department]);
                    });
                    console.log(table.toString());
                    callback();
                });
            });
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
                            console.log('\x1b[32m%s\x1b[0m',`Successfully added Employee: ${firstPrompt.first} ${firstPrompt.last}, Role ID: ${firstPrompt.jobTitle}, Manager ID: ${secondPrompt.manager}`);
                            callback();
                        });
                    });
                });
            });
        });
    }
    deleteEmployee (callback) {
        let query1 = `
            SELECT id, CONCAT(first_name, ' ', last_name) AS employee FROM employees
        `;
        connection.query(query1, (err, result, fields) => {
            if (err) throw err;
            const employeeChoices = result.map(emp => {
                return { name: emp.employee, value: emp.id }
            });
            let empPrompt = [
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select an employee to remove from the database:',
                    choices: employeeChoices
                }
            ]
            inquirer.prompt(empPrompt).then((response) => {
                let query2 = `
                    DELETE FROM employees
                    WHERE id = ${response.employee};
                `;
                connection.query(query2, (err, result, fields) => {
                    if (err) throw err;
                    console.log('\x1b[32m%s\x1b[0m',`Successfully removed employee with the ID: ${response.employee}`);
                    callback();
                });
            });
        });
    }
    updateEmployeeRole (callback) {
        let query1 = `
            SELECT id, CONCAT(first_name, ' ', last_name) AS employee FROM employees
        `;
        connection.query(query1, (err, result, fields) => {
            if (err) throw err;
            const employeeChoices = result.map(emp => {
                return { name: emp.employee, value: emp.id }
            });
            let empPrompt = [
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select an employee to update their role:',
                    choices: employeeChoices
                }
            ]
            inquirer.prompt(empPrompt).then((firstPrompt) => {
                let query2 = `
                    SELECT id, title FROM roles
                `;
                connection.query(query2, (err, result, fields) => {
                    if (err) throw err;
                    const roleChoices = result.map(role => {
                        return { name: role.title, value: role.id }
                    });
                    let rolePrompt = [
                        {
                            type: 'list',
                            name: 'jobTitle',
                            message: 'Select a role for the employee:',
                            choices: roleChoices
                        }
                    ]
                    inquirer.prompt(rolePrompt).then((secondPrompt) => {
                        let query3 = `
                            UPDATE employees
                            SET role_id = ${secondPrompt.jobTitle}
                            WHERE id = ${firstPrompt.employee};
                        `;
                        connection.query(query3, (err, result, fields) => {
                            if (err) throw err;
                            console.log('\x1b[32m%s\x1b[0m',`Successfully updated employee with the new Role ID: ${secondPrompt.jobTitle}`);
                            callback();
                        });
                    });
                });
            });
        });
    }
    updateEmployeeManager (callback) {
        let query1 = `
            SELECT id, CONCAT(first_name, ' ', last_name) AS employee FROM employees
        `;
        connection.query(query1, (err, result, fields) => {
            if (err) throw err;
            const employeeChoices = result.map(emp => {
                return { name: emp.employee, value: emp.id }
            });
            let empPrompt = [
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select an employee to update their manager:',
                    choices: employeeChoices
                }
            ]
            inquirer.prompt(empPrompt).then((firstPrompt) => {
                let query2 = `
                    SELECT DISTINCT emp.manager_id AS id, CONCAT(mgr.first_name, ' ', mgr.last_name) AS name
                    FROM employees emp
                    JOIN employees mgr ON emp.manager_id = mgr.id
                    ORDER BY emp.manager_id ASC;
                `;
                connection.query(query2, (err, result, fields) => {
                    if (err) throw err;
                    const managerChoices = result.map(mgr => {
                        return { name: mgr.name, value: mgr.id }
                    });
                    let mgrPrompt = [
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Select a new manager for the employee:',
                            choices: managerChoices
                        }
                    ]
                    inquirer.prompt(mgrPrompt).then((secondPrompt) => {
                        let query3 = `
                            UPDATE employees
                            SET manager_id = ${secondPrompt.manager}
                            WHERE id = ${firstPrompt.employee};
                        `;
                        connection.query(query3, (err, result, fields) => {
                            if (err) throw err;
                            console.log('\x1b[32m%s\x1b[0m',`Successfully updated the employee with the new Manager ID: ${secondPrompt.manager}`);
                            callback();
                        });
                    });
                });
            });
        });
    }
};

module.exports = Employees;