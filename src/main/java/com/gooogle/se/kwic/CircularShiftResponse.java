package com.gooogle.se.kwic;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class CircularShiftResponse {
    @JsonProperty("shuffledInput")
    List<CircularShiftedLine> circularShiftedLines;

    public CircularShiftResponse(List<CircularShiftedLine> circularShiftedLines) {
        this.circularShiftedLines = circularShiftedLines;
    }

    public List<CircularShiftedLine> getCircularShiftedLines() {
        return circularShiftedLines;
    }
}
