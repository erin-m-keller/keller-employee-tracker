// load environment variables into the application
require('dotenv').config();
// initialize variables
const connection = require('./lib/db'),
      inquirer = require('inquirer'),
      Employee = require('./lib/employee'),
      Department = require('./lib/department'),
      Role = require('./lib/role'),
      asciiArt = `
        .-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-.
        |                                                                            |
        |   ███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗    |
        |   ██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝    |
        |   █████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗      |
        |   ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝      |
        |   ███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗    |
        |   ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝    |
        |                                                                            |
        |   ██████╗  █████╗ ████████╗ █████╗ ██████╗  █████╗ ███████╗███████╗        |
        !   ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔════╝        !
        :   ██║  ██║███████║   ██║   ███████║██████╔╝███████║███████╗█████╗          :
        :   ██║  ██║██╔══██║   ██║   ██╔══██║██╔══██╗██╔══██║╚════██║██╔══╝          :
        :   ██████╔╝██║  ██║   ██║   ██║  ██║██████╔╝██║  ██║███████║███████╗        :
        :   ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝        :
        .                                                                            .
        .   ███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗██████╗            .
        .   ████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗           .
        .   ██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██████╔╝           .
        :   ██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██╔══██╗           :
        !   ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║  ██║           !
        |                                                                            |
        .-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-.
      `;

/**
 * @databaseConnection
 * connect to the database and display
 * a message to the user for success or
 * error. display the ASCII art and start
 * the terminal prompts
 */
connection.connect((err) => {
    // if error, display error message
    if (err) {
        console.error(`Error connecting to ${connection.config.database} database:` + err.stack);
        return;
    }
    // else, display success message
    console.log(`Successfully connected to ${connection.config.database} database.`);
    // display ASCII art
    console.log('\x1b[35m%s\x1b[0m',asciiArt);
    // start the terminal prompts
    terminalPrompts();
});

/**
 * @menuPrompts
 * displays the application menu
 * to the user
 */
const menuPrompts = () => {
    // initialize the variables
    let menuPrompt = [
        {
            name: 'selectedTask',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                { name: '\x1b[33mView All Employees\x1b[0m', value: 'all_emp'},
                { name: '\x1b[33mView Employees by Manager\x1b[0m', value: 'emp_by_mgr'},
                { name: '\x1b[33mView Employees by Department\x1b[0m', value: 'emp_by_dept'},
                { name: '\x1b[32mAdd Employee\x1b[0m', value: 'add_emp'},
                { name: '\x1b[32mDelete Employee\x1b[0m', value: 'delete_emp'},
                { name: '\x1b[32mUpdate Employee Role\x1b[0m', value: 'update_emp_role'},
                { name: '\x1b[32mUpdate Employee Manager\x1b[0m', value: 'update_emp_mgr'},
                { name: '\x1b[33mView All Roles\x1b[0m', value: 'all_roles'},
                { name: '\x1b[32mAdd Role\x1b[0m', value: 'add_role'},
                { name: '\x1b[32mDelete Role\x1b[0m', value: 'delete_role'},
                { name: '\x1b[33mView All Departments\x1b[0m', value: 'all_depts'},
                { name: '\x1b[32mAdd Department\x1b[0m', value: 'add_dept'},
                { name: '\x1b[32mDelete Department\x1b[0m', value: 'delete_dept'},
                { name: '\x1b[31mExit\x1b[0m', value: 'exit'},
            ]
            
        }
    ]
    // return the prompts to @terminalPrompt
    return inquirer.prompt(menuPrompt);
};

/**
 * @terminalPrompts
 * displays the application menu
 * to the user
 */
function terminalPrompts() {
    // prompt the user and get their response
    menuPrompts().then(response => {
        // initialize variables
        let employeeClass = new Employee(),
            departmentClass = new Department(),
            roleClass = new Role();
        // switch the functions based on the user input
        switch (response.selectedTask) {
            // view all employees
            case 'all_emp': {
                employeeClass.viewAllEmp(terminalPrompt);
                break;
            }
            // view employee by manager
            case 'emp_by_mgr': {
                employeeClass.viewEmpByMgr(terminalPrompt);
                break;
            }
            // view employee by department
            case 'emp_by_dept': {
                employeeClass.viewEmpByDept(terminalPrompt);
                break;
            }
            // add an employee
            case 'add_emp': {
                employeeClass.addEmp(terminalPrompt);
                break;
            }
            // delete an employee
            case 'delete_emp': {
                employeeClass.deleteEmp(terminalPrompt);
                break;
            }
            // update employee role
            case 'update_emp_role': {
                employeeClass.updateEmpRole(terminalPrompt);
                break;
            }
            // update employee manager
            case 'update_emp_mgr': {
                employeeClass.updateEmpMgr(terminalPrompt);
                break;
            }
            // view all roles
            case 'all_roles': {
                roleClass.viewAllRoles(terminalPrompt);
                break;
            }
            // add a role
            case 'add_role': {
                roleClass.addRole(terminalPrompt);
                break;
            }
            // delete a role
            case 'delete_role': {
                roleClass.deleteRole(terminalPrompt);
                break;
            }
            // view all departments
            case 'all_depts': {
                departmentClass.viewAllDept(terminalPrompt);
                break;
            }
            // add a department
            case 'add_dept': {
                departmentClass.addDept(terminalPrompt);
                break;
            }
            // delete a department
            case 'delete_dept': {
                departmentClass.deleteDept(terminalPrompt);
                break;
            }
            // exit the application
            case 'exit': {
                connection.end();
                console.log('\x1b[35m%s\x1b[0m','Thank you for using the Employee Database Manager!');
                break;
            }
        }
    }).catch(err => {
        // console log the error
        console.log(`Error: ${err}`)
    });
}
  