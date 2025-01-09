INSERT INTO department (names)
VALUES 
('Engineering'), 
('Finance'), 
('Legal'),
('Sales');

INSERT INTO roles (title, salary, department_id)
VALUES 
('Engineer', 100000, 1),
('Accountant', 75000, 2),
('Lawyer', 120000, 3),
('Salesperson', 80000, 4);
('Sales Lead', 120000, 4);
('Software Engineer', 120000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Doe', 2, 1),
('Alice', 'Smith', 3, NULL),
('Bob', 'Smith', 4, 3),
('Charlie', 'Brown', 5, 4),
('David', 'Brown', 6, 5);