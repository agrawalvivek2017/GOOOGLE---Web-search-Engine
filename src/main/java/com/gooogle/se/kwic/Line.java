package com.gooogle.se.kwic;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.gooogle.se.EmptyValueException;

public class Line {
    @JsonProperty("line")
    private String line;
    @JsonProperty("words")
    private String[] words;

    public Line(String line) throws EmptyValueException {
        if (line == null || line.trim().isEmpty()) {
            throw new EmptyValueException();
        }
        this.line = line;
        buildWords();
    }

    private void buildWords() {
        words = line.split(" ");
    }

    public String getLine() {
        return this.line;
    }

    public String[] getWords() {
        return words;
    }

    private void validateIndexes(int wordIndex, int c) {
        if (wordIndex <0 || wordIndex > words.length) {
            throw new RuntimeException("Total words in the lines are " + words.length + "but user asked for " + wordIndex);
        }
        if (c<0 || words[wordIndex].length() < c) {
            throw new RuntimeException("Char asked exceeds the word size");
        }
    }

    public char getChar(int wordIndex, int c) {
       validateIndexes(wordIndex,c);
        return words[wordIndex].charAt(c);
    }

    public void setChar(int wordIndex, int c, char value) {
        validateIndexes(wordIndex,c);
        StringBuilder sb = new StringBuilder(words[wordIndex]);
        sb.setCharAt(c, value);
        words[wordIndex] = sb.toString();
        line = getLineFromWords();
    }

    private String getLineFromWords() {
        String modifiedLine = "";
        for(String word:words) {
            modifiedLine+=word + " ";
        }
        return modifiedLine.trim();
    }

}
