package com.travelagency.backend;

import com.travelagency.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CustomerDAO {

    public List<String> getAllCustomers() {
        List<String> customers = new ArrayList<>();

        String sql = """
                SELECT Customer_ID, Name, Email, Phone
                FROM customer
                ORDER BY Customer_ID
                """;

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                String customer =
                        rs.getInt("Customer_ID") + " | " +
                        rs.getString("Name") + " | " +
                        rs.getString("Email") + " | " +
                        rs.getString("Phone");

                customers.add(customer);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return customers;
    }

    public boolean addCustomer(String name, String email, String phone) {

        String sql = """
                INSERT INTO customer (Customer_ID, Name, Email, Phone)
                SELECT COALESCE(MAX(Customer_ID), 0) + 1, ?, ?, ?
                FROM customer
                """;

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, name);
            stmt.setString(2, email);
            stmt.setString(3, phone);

            return stmt.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
