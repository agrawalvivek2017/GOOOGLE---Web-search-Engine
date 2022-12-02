package com.gooogle.se.kwic;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class AlphabetizedLines {
    @JsonProperty("sortedLines")
    private List<Line> lines;

    public AlphabetizedLines(List<Line> lines) {
        this.lines = lines;
    }

    public List<Line> getLines() {
        return lines;
    }
}
