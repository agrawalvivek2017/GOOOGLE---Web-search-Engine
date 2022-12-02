package com.gooogle.se.db;

import com.gooogle.se.Utilities;
import com.gooogle.se.kwic.AlphabetizedLines;
import com.gooogle.se.kwic.Line;
import com.gooogle.se.kwic.NoiseEliminator;

import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

import static com.gooogle.se.db.SQLConnectionManager.TABLE_NAME;

/**
 * Creates indexes
 */
public class AutoFill {
    private List<String[]> allData;

    public AutoFill(List<String[]> cvsData) {
        allData = cvsData;
    }

    private AutoFill() {
    }

    public void createIndexes() {
        SQLConnectionManager.openConnection();
        performQuery("use "+ SQLConnectionManager.SQL_DATABASE);
        Utilities.disableStorage = true;
        for(String[] entry: allData) {
            if (entry[1] != null && !entry[1].isEmpty() && entry[0] != null && !entry[0].isEmpty()) {
                AlphabetizedLines alphabetizedLines = NoiseEliminator.createKWICIndexes(entry[1]);
                String index = mergeIndex(alphabetizedLines);
                insertEntryIntoSearchData(entry, index);
            }
        }
        Utilities.disableStorage=false;
        SQLConnectionManager.closeConnection();
    }

    private void insertEntryIntoSearchData(String[] entry, String index) {
        String title = entry[1].replaceAll("[^a-zA-Z0-9\\s]", "");
        String description = entry[2].replaceAll("[^a-zA-Z0-9\\s]", "");
        String query = "insert into " + TABLE_NAME +  " values('" + entry[0] + "','" + title + "','" + description + "','" + index + "')";
        performQuery(query);
    }

    private void performQuery(String query) {
        try {
            Statement stmt = SQLConnectionManager.getConnection().createStatement();
            stmt.executeUpdate(query);
            System.out.println("query = " + query);
        } catch (SQLException ex) {
            System.out.println("error in doing query = " + query);
            System.out.println(ex.toString());
        }
    }

    public String mergeIndex(AlphabetizedLines alphabetizedLines) {
        String index= "";
        for(Line l: alphabetizedLines.getLines()) {
            index+=l.getLine() + ",";
        }
        return index;
    }

}
