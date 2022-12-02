package com.gooogle.se.kwic;

import com.gooogle.se.Utilities;
import com.gooogle.se.db.QueryFilter;
import com.gooogle.se.search.SearchResults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserSearch {
    QueryFilter queryFilter = QueryFilter.getInstance();

    @PostMapping(value = "query/search/and")
    public SearchResults getAndQueryResults(@RequestBody String lines) {
        List<Line> userInputLines = Utilities.readInput(lines);
        return queryFilter.getAndQuery(userInputLines);
    }

    @PostMapping(value = "query/search/or")
    public SearchResults getOrQueryResults(@RequestBody String lines) {
        List<Line> userInputLines = Utilities.readInput(lines);
        return queryFilter.getOrQuery(userInputLines);
    }

    @PostMapping(value = "query/search/not")
    public SearchResults getNotQueryResults(@RequestBody String lines) {
        List<Line> userInputLines = Utilities.readInput(lines);
        return queryFilter.getNotQuery(userInputLines);
    }

}
