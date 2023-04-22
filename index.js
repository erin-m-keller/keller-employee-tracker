require('dotenv').config()
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

connection.connect((err) => {
    if (err) {
        console.error(`Error connecting to ${connection.config.database} database:` + err.stack);
        return;
    }
    console.log(`Successfully connected to ${connection.config.database} database.`);
    console.log('\x1b[35m%s\x1b[0m',asciiArt);
    terminalPrompt();
});

// Create the prompts
const menuPrompts = () => {
    let menuPrompt = [
        {
            name: "selectedTask",
            type: "list",
            message: "What would you like to do?",
            choices: [
                { name: "\x1b[33mView All Employees\x1b[0m", value: "all_emp"},
                { name: "\x1b[33mView Employees by Manager\x1b[0m", value: "emp_by_mgr"},
                { name: "\x1b[33mView Employees by Department\x1b[0m", value: "emp_by_dept"},
                { name: "\x1b[32mAdd Employee\x1b[0m", value: "add_emp"},
                { name: "\x1b[32mDelete Employee\x1b[0m", value: "delete_emp"},
                { name: "\x1b[32mUpdate Employee Role\x1b[0m", value: "update_emp_role"},
                { name: "\x1b[32mUpdate Employee Manager\x1b[0m", value: "update_emp_mgr"},
                { name: "\x1b[33mView All Roles\x1b[0m", value: "all_roles"},
                { name: "\x1b[32mAdd Role\x1b[0m", value: "add_role"},
                { name: "\x1b[32mDelete Role\x1b[0m", value: "delete_role"},
                { name: "\x1b[33mView All Departments\x1b[0m", value: "all_depts"},
                { name: "\x1b[32mAdd Department\x1b[0m", value: "add_dept"},
                { name: "\x1b[32mDelete Department\x1b[0m", value: "delete_dept"},
                { name: "\x1b[31mExit\x1b[0m", value: "exit"},
            ]
            
        }
    ]
    return inquirer.prompt(menuPrompt);
};

function terminalPrompt() {
    menuPrompts().then(response => {
        let employeeClass = new Employee(),
            departmentClass = new Department(),
            roleClass = new Role();
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
                employeeClass.addEmployee(terminalPrompt);
                break;
            }
            case 'delete_emp': {
                employeeClass.deleteEmployee(terminalPrompt);
                break;
            }
            case 'update_emp_role': {
                employeeClass.updateEmployeeRole(terminalPrompt);
                break;
            }
            case 'update_emp_mgr': {
                employeeClass.updateEmployeeManager(terminalPrompt);
                break;
            }
            case 'all_roles': {
                roleClass.viewAllRoles(terminalPrompt);
                break;
            }
            case 'add_role': {
                roleClass.addRole(terminalPrompt);
                break;
            }
            case 'delete_role': {
                roleClass.deleteRole(terminalPrompt);
                break;
            }
            case 'all_depts': {
                departmentClass.viewAllDepartments(terminalPrompt);
                break;
            }
            case 'add_dept': {
                departmentClass.addDepartment(terminalPrompt);
                break;
            }
            case 'delete_dept': {
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
  