DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
    item_id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price DECIMAL (5,2) NOT NULL, 
    stock_quantity INTEGER NOT NULL    
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("Sofa", "Furniture", 1200.99, 150);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("Tea Towel", "Kitchen", 12.99, 200);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("Desk", "Furniture", 499.99, 350);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("Tug-of-War Dog Toy", "Pet Supplies", 19.50, 200);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("Keyboard", "Electronics", 16.50, 75); 

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("Cell Phone", "Electronics", 445.99, 100); 

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("Dining Room Chair", "Furniture", 125.50, 400); 

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("Dry Dog Food", "Pet Supplies", 49.80, 60); 

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("Coffee Maker", "Kitchen", 76.85, 123); 

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUE ("Garden Seeds", "Home & Garden", 1.59, 90); 