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
 * @Employee
 * This class provides methods to create, 
 * read, update and delete employee records 
 * from the employees table in the
 * database
 */
class Employee {
    /**
     * @viewAllEmp
     * SQL query returns the id, 
     * employee first name, employee
     * last name, role title, department
     * name, salary and manager name
     * from the employees table
     * in the database
     */
    viewAllEmp (callback) {
        // initialize variables
        let query = `
            SELECT emp.id, emp.first_name, emp.last_name, role.title, dept.name AS department, role.salary, CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager
            FROM employees emp
            INNER JOIN roles role ON emp.role_id = role.id
            INNER JOIN departments dept ON role.department_id = dept.id
            LEFT JOIN employees mgr ON emp.manager_id = mgr.id
            ORDER BY emp.id ASC;
        `;
        // connect to the database and execute the SQL query
        connection.query(query, (err, result, fields) => {
            // throw error if an error occurs
            if (err) throw err;
            // initialize variables
            const empData = result,
            table = new Table({
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
            // loop through the data to push each row to the table
            empData.forEach((row) => {
                // push each row to the cli-table
                table.push([row.id, row.first_name, row.last_name, row.title, row.department, row.salary, row.manager]);
            });
            // display the table in the terminal
            console.log(table.toString());
            // fires off the @terminalPrompts function in index.js to display the menu to the user
            callback();
        });
    }
    /**
     * @viewEmpByMgr
     * SQL query returns distinct
     * manager from the employees
     * table, displays a prompt for
     * the user to select the manager
     * and then uses an SQL query
     * to return a table with the 
     * manager name and their employees
     */
    viewEmpByMgr (callback) {
        // initialize variables
        let query1 = `
            SELECT DISTINCT emp.manager_id AS id, CONCAT(mgr.first_name, ' ', mgr.last_name) AS name
            FROM employees emp
            JOIN employees mgr ON emp.manager_id = mgr.id
            ORDER BY name ASC;
        `;
        // connect to the database and execute the SQL query
        connection.query(query1, (err, result, fields) => {
            // throw error if an error occurs
            if (err) throw err;
            // initialize variables
            const mgrChoices = result.map(mgr => {
                // set name and value for inquirer list choices; clicking a name returns the ID
                return { name: mgr.name, value: mgr.id }
            }),
            mgrPrompt = [
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Select a manager to view a list of their employees:',
                    choices: mgrChoices // generated list of manager names, returns manager ID
                }
            ]
            // prompt the user with 1 question, then generate the SQL query
            inquirer.prompt(mgrPrompt).then((response) => {
                // initialize variables
                let query2 = `
                    SELECT CONCAT(emp.first_name, ' ', emp.last_name) AS employee, CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager
                    FROM employees emp
                    LEFT JOIN employees mgr ON emp.manager_id = mgr.id
                    WHERE mgr.id = ${response.manager}
                    ORDER BY employee ASC;
                `;
                // connect to the database and execute the SQL query
                connection.query(query2, (err, result, fields) => {
                    // throw error if an error occurs
                    if (err) throw err;
                    // initialize variables
                    const empDeptData = result,
                    table = new Table({
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
                    // loop through the data to push each row to the table
                    empDeptData.forEach((row) => {
                        // push each row to the cli-table
                        table.push([row.employee, row.manager]);
                    });
                    // display the table in the terminal
                    console.log(table.toString());
                    // fires off the @terminalPrompts function in index.js to display the menu to the user
                    callback();
                });
            });
        });
    }
    /**
     * @viewEmpByDept
     * SQL query returns department
     * from the departments table, 
     * displays a prompt for the user
     * to select the department and then
     * uses an SQL query to return a table 
     * with the employee name and their
     * department
     */
    viewEmpByDept (callback) {
        // inititalize variables
        let query1 = `
            SELECT id, name FROM departments
        `;
        // connect to the database and execute the SQL query
        connection.query(query1, (err, result, fields) => {
            // throw error if an error occurs
            if (err) throw err;
            // initialize variables
            const departmentChoices = result.map(dept => {
                // set name and value for inquirer list choices; clicking a name returns the ID
                return { name: dept.name, value: dept.id }
            }),
            empPrompt = [
                {
                    type: 'list',
                    name: 'department',
                    message: 'Select a department to view the list of employees assigned to that department:',
                    choices: departmentChoices // generated list of department names, returns department ID
                }
            ]
            // prompt the user with 1 question, then generate the SQL query
            inquirer.prompt(empPrompt).then((response) => {
                // initialize variables
                let query2 = `
                    SELECT CONCAT(first_name, ' ', last_name) AS employee, dept.name AS department
                    FROM employees emp
                    INNER JOIN roles AS role ON emp.role_id = role.id
                    INNER JOIN departments AS dept ON role.department_id = dept.id
                    WHERE dept.id = ${response.department}
                    ORDER BY department ASC;
                `;
                // connect to the database and execute the SQL query
                connection.query(query2, (err, result, fields) => {
                    // throw error if an error occurs
                    if (err) throw err;
                    // initialize variables
                    const empDeptData = result,
                    table = new Table({
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
                    // loop through the data to push each row to the table
                    empDeptData.forEach((row) => {
                        // push each row to the cli-table
                        table.push([row.employee, row.department]);
                    });
                    // display the table in the terminal
                    console.log(table.toString());
                    // fires off the @terminalPrompts function in index.js to display the menu to the user
                    callback();
                });
            });
        });
    }
    /**
     * @addEmp
     * Prompts user for the first name,
     * last name, and role for a new 
     * employee. then uses an SQL query
     * to insert the employee into the
     * employees table in the database
     */
    addEmp (callback) {
        // initialize variables
        let query1 = `
            SELECT id, title FROM roles
        `;
        // connect to the database and execute the SQL query
        connection.query(query1, (err, result, fields) => {
            // throw error if an error occurs
            if (err) throw err;
            // initialize variables
            const roleChoices = result.map(role => {
                // set name and value for inquirer list choices; clicking a name returns the ID
                return { name: role.title, value: role.id }
            }),
            addEmpPrompt = [
                {
                    type: 'input',
                    name: 'first',
                    message: 'What is the first name of the new employee?',
                    validate: validateInput // validates input is 30 characters or less
                },
                {
                    type: 'input',
                    name: 'last',
                    message: 'What is the last name of the new employee?',
                    validate: validateInput // validates input is 30 characters or less
                },
                {
                    type: 'list',
                    name: 'roleTitle',
                    message: 'Select a role for the employee:',
                    choices: roleChoices // generated list of roles, returns role ID
                }
            ]
            // prompt the user with 3 questions, then generate the SQL query
            inquirer.prompt(addEmpPrompt).then((firstPrompt) => {
                // initialize variables
                let query2 = `
                    SELECT id, CONCAT(first_name, ' ', last_name) AS manager FROM employees
                `;
                // connect to the database and execute the SQL query
                connection.query(query2, (err, result, fields) => {
                    // throw error if an error occurs
                    if (err) throw err;
                    // initialize variables
                    const mgrChoices = result.map(role => {
                        // set name and value for inquirer list choices; clicking a name returns the ID
                        return { name: role.manager, value: role.id }
                    }),
                    mgrPrompt = [
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Select a Manager for the employee:',
                            choices: mgrChoices
                        }
                    ];
                    // prompt the user with 1 question, then generate the SQL query
                    inquirer.prompt(mgrPrompt).then((secondPrompt) => {
                        // initialize variables
                        let query3 = `
                            INSERT INTO employees (first_name, last_name, role_id, manager_id)
                            VALUES ('${firstPrompt.first}', '${firstPrompt.last}', ${firstPrompt.roleTitle}, ${secondPrompt.manager})
                        `;
                        // connect to the database and execute the SQL query
                        connection.query(query3, (err, result, fields) => {
                            // throw error if an error occurs
                            if (err) throw err;
                            // log the success message
                            console.log('\x1b[32m%s\x1b[0m',`Successfully added Employee: ${firstPrompt.first} ${firstPrompt.last}, Role ID: ${firstPrompt.jobTitle}, Manager ID: ${secondPrompt.manager}`);
                            // fires off the @terminalPrompts function in index.js to display the menu to the user
                            callback();
                        });
                    });
                });
            });
        });
    }
    /**
     * @deleteEmp
     * Prompts user to select an
     * employee to delete from the
     * employees table in the database
     */
    deleteEmp (callback) {
        // initialize variables
        let query1 = `
            SELECT id, CONCAT(first_name, ' ', last_name) AS employee FROM employees
        `;
        // connect to the database and execute the SQL query
        connection.query(query1, (err, result, fields) => {
            // throw error if an error occurs
            if (err) throw err;
            // initialize variables
            const employeeChoices = result.map(emp => {
                // set name and value for inquirer list choices; clicking a name returns the ID
                return { name: emp.employee, value: emp.id }
            }),
            empPrompt = [
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select an employee to remove from the database:',
                    choices: employeeChoices // generated list of employee names, returns employee ID
                }
            ]
            // prompt the user with 1 question, then generate the SQL query
            inquirer.prompt(empPrompt).then((response) => {
                // initialize variables
                let query2 = `
                    DELETE FROM employees
                    WHERE id = ${response.employee};
                `;
                // connect to the database and execute the SQL query
                connection.query(query2, (err, result, fields) => {
                    // throw error if an error occurs
                    if (err) throw err;
                    // log the success message
                    console.log('\x1b[32m%s\x1b[0m',`Successfully removed employee with the ID: ${response.employee}`);
                    // fires off the @terminalPrompts function in index.js to display the menu to the user
                    callback();
                });
            });
        });
    }
    /**
     * @updateEmpRole
     * Prompts user to select an
     * employee to update their 
     * role in the employees
     * table within the database
     */
    updateEmpRole (callback) {
        // initialize variables
        let query1 = `
            SELECT id, CONCAT(first_name, ' ', last_name) AS employee FROM employees
        `;
        // connect to the database and execute the SQL query
        connection.query(query1, (err, result, fields) => {
            // throw error if an error occurs
            if (err) throw err;
            // initialize variables
            const employeeChoices = result.map(emp => {
                // set name and value for inquirer list choices; clicking a name returns the ID
                return { name: emp.employee, value: emp.id }
            }),
            empPrompt = [
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select an employee to update their role:',
                    choices: employeeChoices // generated list of employee names, returns employee ID
                }
            ]
            // prompt the user with 1 question, then generate the SQL query
            inquirer.prompt(empPrompt).then((firstPrompt) => {
                // initialize variables
                let query2 = `
                    SELECT id, title FROM roles
                `;
                // connect to the database and execute the SQL query
                connection.query(query2, (err, result, fields) => {
                    // throw error if an error occurs
                    if (err) throw err;
                    // initialize variables
                    const roleChoices = result.map(role => {
                        // set name and value for inquirer list choices; clicking a name returns the ID
                        return { name: role.title, value: role.id }
                    }),
                    rolePrompt = [
                        {
                            type: 'list',
                            name: 'roleTitle',
                            message: 'Select a role for the employee:',
                            choices: roleChoices
                        }
                    ]
                    // prompt the user with 1 question, then generate the SQL query
                    inquirer.prompt(rolePrompt).then((secondPrompt) => {
                        // initialize variables
                        let query3 = `
                            UPDATE employees
                            SET role_id = ${secondPrompt.roleTitle}
                            WHERE id = ${firstPrompt.employee};
                        `;
                        // connect to the database and execute the SQL query
                        connection.query(query3, (err, result, fields) => {
                            // throw error if an error occurs
                            if (err) throw err;
                            // log the success message
                            console.log('\x1b[32m%s\x1b[0m',`Successfully updated employee with the new Role ID: ${secondPrompt.roleTitle}`);
                            // fires off the @terminalPrompts function in index.js to display the menu to the user
                            callback();
                        });
                    });
                });
            });
        });
    }
    /**
     * @updateEmpMgr
     * Prompts user to select an
     * employee to update their 
     * manager in the employees
     * table within the database
     */
    updateEmpMgr (callback) {
        // initialize variables
        let query1 = `
            SELECT id, CONCAT(first_name, ' ', last_name) AS employee FROM employees
        `;
        // connect to the database and execute the SQL query
        connection.query(query1, (err, result, fields) => {
            // throw error if an error occurs
            if (err) throw err;
            // initialize variables
            const employeeChoices = result.map(emp => {
                // set name and value for inquirer list choices; clicking a name returns the ID
                return { name: emp.employee, value: emp.id }
            }),
            empPrompt = [
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select an employee to update their manager:',
                    choices: employeeChoices
                }
            ]
            // prompt the user with 1 question, then generate the SQL query
            inquirer.prompt(empPrompt).then((firstPrompt) => {
                // initialize variables
                let query2 = `
                    SELECT DISTINCT emp.manager_id AS id, CONCAT(mgr.first_name, ' ', mgr.last_name) AS name
                    FROM employees emp
                    JOIN employees mgr ON emp.manager_id = mgr.id
                    ORDER BY emp.manager_id ASC;
                `;
                // connect to the database and execute the SQL query
                connection.query(query2, (err, result, fields) => {
                    // throw error if an error occurs
                    if (err) throw err;
                    // initialize variables
                    const managerChoices = result.map(mgr => {
                        // set name and value for inquirer list choices; clicking a name returns the ID
                        return { name: mgr.name, value: mgr.id }
                    }),
                    mgrPrompt = [
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Select a new manager for the employee:',
                            choices: managerChoices
                        }
                    ]
                    // prompt the user with 1 question, then generate the SQL query
                    inquirer.prompt(mgrPrompt).then((secondPrompt) => {
                        // initialize variables
                        let query3 = `
                            UPDATE employees
                            SET manager_id = ${secondPrompt.manager}
                            WHERE id = ${firstPrompt.employee};
                        `;
                        // connect to the database and execute the SQL query
                        connection.query(query3, (err, result, fields) => {
                            // throw error if an error occurs
                            if (err) throw err;
                            // log the success message
                            console.log('\x1b[32m%s\x1b[0m',`Successfully updated the employee with the new Manager ID: ${secondPrompt.manager}`);
                            // fires off the @terminalPrompts function in index.js to display the menu to the user
                            callback();
                        });
                    });
                });
            });
        });
    }
};

// export the class
module.exports = Employee;