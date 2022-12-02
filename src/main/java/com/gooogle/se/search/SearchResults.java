package com.gooogle.se.search;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Comparator;
import java.util.List;

public class SearchResults {
    @JsonProperty("searchResults")
    List<SearchResult> resultList;

    public SearchResults(List<SearchResult> resultList) {
        resultList.sort(new SearchResultComparator());
        this.resultList = resultList;
    }

    public List<SearchResult> getResultList() {
        return resultList;
    }

    static class SearchResultComparator implements Comparator<SearchResult> {
        @Override
        public int compare(SearchResult o1, SearchResult o2) {
            return o1.getTitle().toLowerCase().compareTo(o2.getTitle().toLowerCase());
        }
    }
}
