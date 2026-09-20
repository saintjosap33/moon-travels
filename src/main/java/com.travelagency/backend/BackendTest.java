package com.travelagency.backend;

public class BackendTest {

    public static void main(String[] args) {

        CustomerDAO customerDAO = new CustomerDAO();

        System.out.println("Customers in database:");

        for (String customer : customerDAO.getAllCustomers()) {
            System.out.println(customer);
        }
    }
}