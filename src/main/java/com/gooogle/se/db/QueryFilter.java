package com.gooogle.se.db;

import com.gooogle.se.kwic.Line;
import com.gooogle.se.search.SearchResult;
import com.gooogle.se.search.SearchResults;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class QueryFilter {

    private static QueryFilter queryFilter;

    public static synchronized QueryFilter getInstance() {
        if (queryFilter == null) {
            queryFilter = new QueryFilter();
        }
        return queryFilter;
    }

    public SearchResults getAndQuery(List<Line> lines) {
        SQLConnectionManager.openConnection();
        performUpdateQuery("use " + SQLConnectionManager.SQL_DATABASE);
        String query = createAndQuery(lines);
        SearchResults searchResults = getSearchResults(query);
        System.out.println("Size = " + searchResults.getResultList().size());
        SQLConnectionManager.closeConnection();
        return searchResults;
    }

    public SearchResults getOrQuery(List<Line> lines) {
        SQLConnectionManager.openConnection();
        performUpdateQuery("use " + SQLConnectionManager.SQL_DATABASE);
        String query = createOrQuery(lines);
        SearchResults searchResults = getSearchResults(query);
        System.out.println("Size = " + searchResults.getResultList().size());
        SQLConnectionManager.closeConnection();
        return searchResults;
    }

    public SearchResults getNotQuery(List<Line> lines) {
        SQLConnectionManager.openConnection();
        performUpdateQuery("use " + SQLConnectionManager.SQL_DATABASE);
        String query = createNotQuery(lines);
        SearchResults searchResults = getSearchResults(query);
        System.out.println("Size = " + searchResults.getResultList().size());
        SQLConnectionManager.closeConnection();
        return searchResults;
    }

    private String createAndQuery(List<Line> lines) {
        String query = "select URL, Title, Description from " + SQLConnectionManager.TABLE_NAME + " where ";
        for (int i = 0; i < lines.size(); i++) {
            String line = lines.get(i).getLine().replaceAll(" ", "%") + "%";
            query += "indexdata like " + "'" + line + "'" + " OR description like " + "'" + line + "'";
            if (i != lines.size() - 1) {
                query += " OR ";
            }
        }
        return query + " limit 30";
    }

    private String createNotQuery(List<Line> lines) {
        String query = "select URL, Title, Description from " + SQLConnectionManager.TABLE_NAME + " where ";
        for (int i = 0; i < lines.size(); i++) {
            String line = lines.get(i).getLine().replaceAll(" ", "%") + "%";
            query += "indexdata not like " + "'" + line + "'" + " OR description not like " + "'" + line + "'";
            if (i != lines.size() - 1) {
                query += " OR ";
            }
        }
        return query + " limit 30";
    }

    private String createOrQuery(List<Line> lines) {
        String query = "select URL, Title, Description from " + SQLConnectionManager.TABLE_NAME + " where ";
        String[] line = lines.get(0).getWords();
        for (int i = 0; i < line.length; i++) {
            String word = "%" + line[i] + "%";
            query += "indexdata like " + "'" + word + "'" + " OR description like " + "'" + word + "'";
            if (i != line.length - 1) {
                query += " OR ";
            }
        }
        return query + " limit 30";
    }

    private SearchResults getSearchResults(String query) {
       ResultSet rs = performExecuteQuery(query);
       List<SearchResult> results = new ArrayList<>();
       try {
           if (rs != null) {
               while (rs.next()) {
                  String url = rs.getString(1);
                  String title = rs.getString(2);
                  String description = rs.getString(3);
                  results.add(new SearchResult(url,title,description));
               }
           }
       } catch (SQLException e) {
            e.printStackTrace();
        }
       return new SearchResults(results);
    }

    private ResultSet performExecuteQuery(String query) {
        try {
            Statement stmt = SQLConnectionManager.getConnection().createStatement();
            System.out.println("Executing query =" + query);
            return stmt.executeQuery(query);
        } catch (SQLException ex) {
            System.out.println(ex.toString());
        }
        return null;
    }

    private void performUpdateQuery(String query) {
        try {
            Statement stmt = SQLConnectionManager.getConnection().createStatement();
            stmt.executeUpdate(query);
            System.out.println("query = " + query);
        } catch (SQLException ex) {
            System.out.println("error in doing query = " + query);
            System.out.println(ex.toString());
        }
    }


}
