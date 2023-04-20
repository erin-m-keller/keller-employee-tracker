require('dotenv').config()
const connection = require('./lib/db'),
      inquirer = require('inquirer'),
      Employee = require('./lib/employee'),
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

connection.connect((err) => {
    if (err) {
        console.error(`Error connecting to ${connection.config.database} database:` + err.stack);
        return;
    }
    console.log(`Successfully connected to ${connection.config.database} database.`);
    terminalPrompt();
});

// Create the prompts
const applicationPrompts = () => {
    return inquirer.prompt([
        {
            name: "selectedTask",
            type: "list",
            message: "What would you like to do?",
            choices: [
                { name: "View All Employees", value: "all_emp"},
                { name: "View Employees by Manager (bonus)", value: "emp_by_mgr"},
                { name: "View Employees by Department (bonus)", value: "emp_by_dept"},
                { name: "Add Employee", value: "add_emp"},
                { name: "Delete Employee (bonus)", value: "delete_emp"},
                { name: "Update Employee Role", value: "update_emp_role"},
                { name: "Update Employee Manager (bonus)", value: "update_emp_mgr"},
                { name: "View All Roles", value: "all_roles"},
                { name: "Add Role", value: "add_role"},
                { name: "Delete Role (bonus)", value: "delete_role"},
                { name: "View All Departments", value: "all_depts"},
                { name: "Add Department", value: "add_dept"},
                { name: "Delete Department (bonus)", value: "delete_dpt"},
                { name: "Exit", value: "exit"},
            ]
            
        }
    ])
};

function terminalPrompt() {
    console.log('\x1b[31m%s\x1b[0m',asciiArt);
    applicationPrompts().then(response => {
        let employeeClass = new Employee();
        switch (response.selectedTask) {
            case 'all_emp': {
                employeeClass.viewAllEmployees(terminalPrompt);
                break;
            }
            case 'emp_by_mgr': {
                employeeClass.viewEmployeesByManager(terminalPrompt);
                break;
            }
            case 'emp_by_dept': {
                employeeClass.viewEmployeesByDept(terminalPrompt);
                break;
            }
            case 'add_emp': {
                console.info('Add Employee - TODO');
                break;
            }
            case 'delete_emp': {
                console.info('Delete Employee - TODO (bonus)');
                break;
            }
            case 'update_emp_role': {
                console.info('Update Employee Role - TODO');
                break;
            }
            case 'update_emp_mgr': {
                console.info('Update Employee Manager - TODO (bonus)');
                break;
            }
            case 'all_roles': {
                console.info('View All Roles - TODO');
                break;
            }
            case 'add_role': {
                console.info('Add Role - TODO');
                break;
            }
            case 'delete_role': {
                console.info('Delete Role - TODO (bonus)');
                break;
            }
            case 'all_depts': {
                console.info('View All Departments - TODO');
                break;
            }
            case 'add_dept': {
                console.info('Add Department - TODO');
                break;
            }
            case 'delete_dpt': {
                console.info('Delete Department - TODO (bonus)');
                break;
            }
            case 'exit': {
                console.info('Exit the application - TODO');
                break;
            }
            default:
                // default
            }
    }).catch(err => {
        // console log the error
        console.log(`Error: ${err}`)
    });
}
  