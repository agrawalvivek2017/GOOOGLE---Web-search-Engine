package com.gooogle.se.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public final class SQLConnectionManager {
    public static final String SQL_USERNAME = "root";
    public static final String SQL_PASSWORD = "";
    public static final String SQL_DATABASE = "searchengine";
    public static final String TABLE_NAME = "searchdata";
    private static Connection connection;
    private static SQLConnectionManager connectionManager;

    public static synchronized void openConnection() {
        try {
            if(connection == null) {
                Class.forName("com.mysql.cj.jdbc.Driver");
                connection = DriverManager.getConnection("jdbc:mysql://localhost", SQL_USERNAME, SQL_PASSWORD);
            }
        } catch (SQLException | ClassNotFoundException ex) {
            System.out.println(ex.toString());
        }
    }

    public static Connection getConnection() {
        return connection;
    }

    public static boolean isConnectionOpen() {
        return (connection != null);
    }

    public static void closeConnection() {
        try {
            if (connection != null)
                connection.close();
        } catch (SQLException ex) {
            System.out.println(ex.toString());
        }
        connection = null;
    }
}
