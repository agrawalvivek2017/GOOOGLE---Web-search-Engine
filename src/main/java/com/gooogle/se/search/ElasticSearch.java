package com.gooogle.se.search;

import com.gooogle.se.Utilities;
import com.gooogle.se.db.AutoFill;
import com.gooogle.se.db.QueryFilter;
import com.gooogle.se.kwic.Line;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
public class ElasticSearch {

    private static ElasticSearch search  = new ElasticSearch();

    public static void main(String[] args) {
        search.printFileNames();
//        List<Line> l =  Utilities.readInput("artificial intelligence\nintelligence artificial");
//        QueryFilter qf =QueryFilter.getInstance();
//        qf.getNotQuery(l);
    }

    public void loadFile(String url, String filename) {
        InputStream in = null;
        try {
            in = new URL(url).openStream();
            Files.copy(in, Paths.get("/Users/abhishekdua/Desktop/utdallas_education/software-architecture/WebSearchEngine/src/data/"+filename), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void printFileNames() {
        File folder = new File("/Users/abhishekdua/Desktop/utdallas_education/software-architecture/WebSearchEngine/src/data/");
        File[] listOfFiles = folder.listFiles();
        for (File file : listOfFiles) {
            if (file.isFile()) {
                if(file.getName().contains(".csv")) {
                    System.out.println("Reading from " + file.getName());
                    List<String[]> allData = read(file);
                    AutoFill autoFill = new AutoFill(allData);
                    autoFill.createIndexes();
                }
            }
        }
    }



    private List<String[]> read(File file) {
        FileReader filereader = null;
        List<String[]> allData = null;
        try {
            filereader = new FileReader(file);
            // create csvReader object and skip first Line
            CSVReader csvReader = new CSVReaderBuilder(filereader)
                    .withSkipLines(1)
                    .build();
            allData = csvReader.readAll();
            String[] firstEntry = allData.get(0);
            for(String item: firstEntry) {
                System.out.println(item);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return allData;
    }


}
