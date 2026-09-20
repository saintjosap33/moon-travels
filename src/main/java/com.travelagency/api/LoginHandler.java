package com.travelagency.api;

import com.travelagency.DatabaseConnection;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.sql.*;

public class LoginHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {

        if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
            sendResponse(exchange, 405,
                    "{\"status\":\"error\",\"message\":\"POST method required\"}");
            return;
        }

        String body = new String(
                exchange.getRequestBody().readAllBytes(),
                StandardCharsets.UTF_8
        );

        String username = getJsonValue(body, "username");
        String password = getJsonValue(body, "password");

        if (username == null || password == null) {
            sendResponse(exchange, 400,
                    "{\"status\":\"error\",\"message\":\"Username and password are required\"}");
            return;
        }

        String sql = """
                SELECT u.User_ID, u.Username, r.Role_Name
                FROM `user` u
                JOIN role r ON u.Role_ID = r.Role_ID
                WHERE u.Username = ? AND u.Password = ?
                """;

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, username);
            stmt.setString(2, password);

            try (ResultSet rs = stmt.executeQuery()) {

                if (rs.next()) {

                    String response = String.format(
                            "{\"status\":\"success\",\"userId\":%d,\"username\":\"%s\",\"role\":\"%s\"}",
                            rs.getInt("User_ID"),
                            rs.getString("Username"),
                            rs.getString("Role_Name")
                    );

                    sendResponse(exchange, 200, response);

                } else {

                    sendResponse(exchange, 401,
                            "{\"status\":\"error\",\"message\":\"Invalid username or password\"}");
                }
            }

        } catch (SQLException e) {

            e.printStackTrace();

            sendResponse(exchange, 500,
                    "{\"status\":\"error\",\"message\":\"Database error\"}");
        }
    }

    private String getJsonValue(String json, String key) {

        String search = "\"" + key + "\"";
        int keyPosition = json.indexOf(search);

        if (keyPosition == -1) {
            return null;
        }

        int colonPosition = json.indexOf(":", keyPosition);

        if (colonPosition == -1) {
            return null;
        }

        int firstQuote = json.indexOf("\"", colonPosition);

        if (firstQuote == -1) {
            return null;
        }

        int secondQuote = json.indexOf("\"", firstQuote + 1);

        if (secondQuote == -1) {
            return null;
        }

        return json.substring(firstQuote + 1, secondQuote);
    }

    private void sendResponse(
            HttpExchange exchange,
            int statusCode,
            String response) throws IOException {

        exchange.getResponseHeaders().set(
                "Content-Type",
                "application/json"
        );

        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);

        exchange.sendResponseHeaders(statusCode, bytes.length);

        try (OutputStream output = exchange.getResponseBody()) {
            output.write(bytes);
        }
    }
}
