package com.travelagency.api;

import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

public class ApiServer {

    public static void main(String[] args) throws IOException {

        HttpServer server = HttpServer.create(
                new InetSocketAddress(8080), 0
        );

        // Test endpoint
        server.createContext("/api/test", exchange -> {

            String response = """
                    {
                      "status": "success",
                      "message": "Travel Agency Backend is running"
                    }
                    """;

            exchange.getResponseHeaders().set(
                    "Content-Type",
                    "application/json"
            );

            byte[] bytes = response.getBytes();

            exchange.sendResponseHeaders(200, bytes.length);

            try (var output = exchange.getResponseBody()) {
                output.write(bytes);
            }
        });

        // Login endpoint
        server.createContext("/api/login", new LoginHandler());

        server.setExecutor(null);
        server.start();

        System.out.println("======================================");
        System.out.println("Travel Agency Management System");
        System.out.println("Backend API started successfully!");
        System.out.println("Server: http://localhost:8080");
        System.out.println("Login API: POST /api/login");
        System.out.println("======================================");
    }
}