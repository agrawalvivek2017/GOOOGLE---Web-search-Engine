package com.gooogle.se.kwic;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CircularShiftedLine {
    @JsonProperty("circularShiftedLines")
    private List<Line> shiftedLines;
    @JsonProperty("inputLine")
    private Line line;

    public CircularShiftedLine(Line line) {
        if (line == null) {
            throw  new RuntimeException("Invalid line");
        }
        this.line = line;
        shiftedLines = performRightShifts();
    }

    private List<Line> performRightShifts() {
        List<Line> shiftedLines = new ArrayList<>();
        ArrayDeque<String> dq = new ArrayDeque<>(Arrays.asList(line.getWords()));
        shiftedLines.add(line);
        for (int i=0;i<line.getWords().length-1;i++) {
            dq.addLast(dq.pollFirst());
            shiftedLines.add(getLine(dq));
        }
        return shiftedLines;
    }

    public List<Line> getShiftedLines() {
        return this.shiftedLines;
    }

    private Line getLine(ArrayDeque<String> list) {
        StringBuilder line = new StringBuilder();
        for(String word: list) {
            line.append(word).append(" ");
        }
        return new Line(line.toString().trim());
    }
}
