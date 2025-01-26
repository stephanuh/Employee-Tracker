import inquirer from "inquirer";
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

function mainMenu(): void {
    inquirer
    .prompt([
        {
            type: "list",
            name: "choice",
            message: "--Select the following option--",
            choices: [
                "View all Departments",
                'View all Roles',
                "View all Employees",
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update an Employee Role",
                "Exit"
            ],
        },
    ])
     .then((answers) => {
         if (answers.choice === "View all Departments"){
             viewAllDepartments();
         }
         if (answers.choice === "View all Roles"){
             viewAllRoles();
         }
         if (answers.choice === "View all Employees"){
             viewAllEmployees();
         }
         if (answers.choice === "Add a Department"){
            addDepartment();
         }
        if (answers.choice === "Add a Role"){
             addRole();
    }
        if(answers.choice === "Add an Employee"){
             addAnEmployee();
         }
         if(answers.choice === "Update an Employee Role"){
             updateEmployeeRole();
         }
         if(answers.choice === "Exit"){
             pool.end();
             process.exit();
         }
     });
}
//mainMenu();

//TODO: Implement the following functions
// presented with a formatted table showing department names and department ids
function viewAllDepartments():void {
    pool.query('SELECT * FROM department',
        (err: Error, result: QueryResult) => {
            if (err){
                console.error(err);
            }else if (result){
                console.table(result.rows);
            }
            mainMenu();
        })
}

//presented with the job title, role id, the department that role belongs to, and the salary for that role
function viewAllRoles(): void {
    pool.query(`SELECT 
        title,
         role.id,
        salary, 
        department.name AS department 
        FROM role
        JOIN department on role.department_id = department.id`,
        (err: Error, result: QueryResult) =>{
            if (err){
                console.error(err);
            }else if (result){
                console.table(result.rows);
            }
            mainMenu();
        })
}

//presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewAllEmployees(): void {
    pool.query(`SELECT 
     employee.id, 
     employee.first_name AS "Employee First Name", 
     employee.last_name AS "Employee Last Name",
     role.title,
     department.name AS Department,
     role.salary,
     CONCAT (manager.first_name, ' ', manager.last_name) AS "Manager Name"
     FROM employee
     INNER JOIN role ON employee.role_id = role.id
     INNER JOIN department ON role.department_id = department.id
     LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`,
    (err: Error, result: QueryResult) =>{
        if (err){
            console.error(`Error executing query:`,err);
        }else if (result){
            console.log(`Query executed successfully!`)
            console.table(result.rows);
        }else{
            console.log('No results found.');
        }
        mainMenu();
    });
}
//prompted to enter the name of the department and that department is added to the database
function addDepartment(): void {
    inquirer
    .prompt([{
        type: "input",
        name: "userDepartment",
        message: "Enter the name of the department:"
    }
])
    .then((answers) => {
        const userDepartment = answers.userDepartment;
        pool.query(`INSERT INTO department (name) VALUES ($1)`,
            [userDepartment],
            (err: Error, result: QueryResult) =>{
            if (err){
                console.error(err);
            }else if (result){
                console.log(`Added ${userDepartment} to the database.`);
            }
            mainMenu();
        })
    })
}

//prompted to enter the name, salary, and department for the role and that role is added to the database
function addRole(): void {
    pool.query(`SELECT DISTINCT name FROM DEPARTMENT`,
        (err: Error, result: QueryResult) =>{
        if (err){
            console.error(err);
        }else if(result){
            const departmentsNames = result.rows.map(row => row.name);

            inquirer
            .prompt([{
                type: "input",
                name: "roleName",
                message: "Enter the name of the role:"
            },
        {
            type: "input",
            name: "roleSalary",
            message: "Enter the salary for the role:"
        },
    {
        type: "list",
        name: "roleDepartment",
        message: "Select the department for the role:",
        choices: departmentsNames
    }
])
.then((answers) => {
    const {roleName, roleSalary, roleDepartment} = answers;
    pool.query(`INSERT INTO role (title, salary, department_id) 
        VALUES 
        ($1, $2,(SELECT id FROM department WHERE name = $3))`,
        [roleName, roleSalary, roleDepartment],
        (err: Error, _result: QueryResult) => {
            if (err){
                console.error(err);
            }else{
                console.log(`Added ${roleName} to the database.`);
            }
            mainMenu();
        });
    });
        }else{
            console.log('No departments found.');
            mainMenu();
        }
    })
};

//prompted to enter the employee's first name, last name, role, and manager, and that employee is added to the database
function addAnEmployee(): void {
    pool.query(`SELECT DISTINCT title FROM ROLE`,
        (err: Error, result: QueryResult) =>{
        if(err){
            console.error(err);
        }else if(result){
            const roleTitles = result.rows.map(row => row.title);

            pool.query(`SELECT id, 
                CONCAT (first_name, ' ', last_name) AS "Manager Name" 
                FROM employee`,
                 (err: Error, result: QueryResult) =>{
                if (err){
                    console.error(err);
                }else if (result){
                    const managers = result.rows.map(row => ({ name: row["Manager Name"], value: row.id}));
                    managers.unshift({name: 'None', value: null});

                    inquirer
                    .prompt([{
                        type: "input",
                        name: "firstName",
                        message: "What is the employee's first name?"
                    },
                {
                    type: "input",
                    name: "lastName",
                    message: "What is the employee's last name?"
                },
            {
                type: "list",
                name: "roleName",
                message: "What is the employee's role?",
                choices: roleTitles
            },
        {
            type: "list",
            name: "managerId",
            message: "Who is the employee's manager?",
            choices: managers
        }
    ])
    .then ((answers) =>{
        const {firstName, lastName, roleName, managerId} = answers;
        pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
             VALUES ($1, $2, (SELECT id FROM role WHERE title = $3), $4)`,
            [firstName, lastName, roleName, managerId],
            (err: Error, _result: QueryResult) => {
                if (err){
                    console.error(err);
                }else {
                    console.log(`Added ${firstName} ${lastName} to the database.`)
                }
                mainMenu();
            });
        });
    }});
}});
}

//prompted to select an employee to update and their new role and this information is updated in the database
function updateEmployeeRole(): void {
    pool.query(`SELECT id, 
        CONCAT(first_name, ' ', last_name) AS "Employee Name" 
        From employee`, 
        (err: Error, result: QueryResult) =>{
        if (err){
            console.error(err);
        }else if (result){
            const employees = result.rows.map(row => ({ name: row["Employee Name"], value: row.id}));

            pool.query(`SELECT DISTINCT title FROM role`, 
                (err: Error, result: QueryResult) =>{
                if (err){
                    console.error(err);
                }else if(result){
                    const roleName = result.rows.map(row => row.title);

                    inquirer
                    .prompt([{
                        type: "list",
                        name: "employeeId",
                        message: "What employee would you like to update?",
                        choices: employees
                    },
                {
                    type: "list",
                    name: "roleName",
                    message: "What is the employee's new role?",
                    choices: roleName
                }
            ])
            .then((answers) =>{
                const {employeeId, roleName} = answers;
                pool.query(`UPDATE employee 
                    SET role_id = (SELECT id FROM role WHERE title = $1)
                    WHERE id = $2`,
                    [roleName, employeeId],
                    (err: Error, _result: QueryResult) =>{
                        if (err){
                            console.error(err);
                        }else{
                            console.log(`Updated employee's role.`);
                        }
                        mainMenu();
                    });
                });
            }});
        }});
}

await connectToDb();
mainMenu();
