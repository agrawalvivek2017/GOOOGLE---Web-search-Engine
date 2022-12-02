package com.gooogle.se.kwic;


import com.gooogle.se.Utilities;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class CircularShift {

    @PostMapping(value = "query/getCircularShiftedLine")
    public CircularShiftResponse getCircularShifts(@RequestBody String userInput) {
        List<Line> userInputLines = Utilities.readInput(userInput);
        List<CircularShiftedLine> circularShiftedLines = genCS(userInputLines);
        Utilities.storeLogsForCircularShiftedLines("src/output/CircularShiftsLog.txt", circularShiftedLines);
        return new CircularShiftResponse(circularShiftedLines);
    }

    private List<CircularShiftedLine> genCS(List<Line> lines) {
        List<CircularShiftedLine> shiftedLines = new ArrayList<>();
        for (Line line: lines) {
            shiftedLines.add(new CircularShiftedLine(line));
        }
        return shiftedLines;
    }
}
