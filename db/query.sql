SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
SELECT * FROM manager;

SELECT role_id, title, salary, department.name FROM role
JOIN department ON role.department_id = department.id;

SELECT 
employee.id, employee.first_name AS "Employee First Name", 
employee.last_name AS "Employee Last Name",
role.title, department.name AS department,
role.salary, CONCAT(manager.first_name, ' ', manager.last_name)
FROM employee
INNER JOIN role ON employee.role_id = role.id
INNER JOIN department ON role.department_id = department.id
LEFT JOIN employee AS manager ON employee.manager_id = manager.id;

