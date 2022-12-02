package com.gooogle.se.kwic;

import com.gooogle.se.Utilities;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class LineStorage {
   private List<Line> userInputLines;

    @PostMapping(value = "query/saveInput")
    public String saveInput(@RequestBody String userInput) {
        userInputLines = Utilities.readInput(userInput);
        Utilities.storeLogs("src/output/input.txt", userInputLines);
        return userInput;
    }

    public void setChar(int lineNumber, int wordIndex, int charIndex, char value) {
        if (lineNumber < 0 || userInputLines==null || lineNumber > userInputLines.size()) {
            throw new RuntimeException("Wrong line number provided");
        }
        Line line = userInputLines.get(lineNumber);
        line.setChar(wordIndex,charIndex,value);
    }

    public char getChar(int lineNumber, int wordIndex, int charIndex) {
        if (lineNumber < 0 || userInputLines==null || lineNumber > userInputLines.size()) {
            throw new RuntimeException("Wrong line number provided");
        }
        Line line = userInputLines.get(lineNumber);
        return line.getChar(wordIndex,charIndex);
    }
}
