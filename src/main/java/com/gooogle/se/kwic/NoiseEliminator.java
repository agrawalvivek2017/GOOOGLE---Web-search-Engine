package com.gooogle.se.kwic;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gooogle.se.Utilities;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

public class NoiseEliminator {

    static final String[] STOP_WORDS = {"i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself",
            "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself",
            "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these",
            "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do",
            "does", "did", "doing", "a", "an", "the", "but", "if", "because", "as", "until", "while",
            "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before",
            "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again",
            "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each",
            "few", "more", "most", "other", "some", "such", "no", "nor", "only", "own", "same", "so", "than",
            "too", "very", "s", "t", "can", "will", "just", "don", "should", "now", "and", "or", "not"};
    private static Set<String> STOP_WORDS_SET = new HashSet<>(Arrays.asList(STOP_WORDS));

    public static AlphabetizedLines eliminateNoise(List<Line> lines) {
        List<Line> filtered = new ArrayList<>();
        for(Line l: lines) {
            if(!STOP_WORDS_SET.contains(l.getWords()[0])) {
                filtered.add(l);
            }
        }
        return new AlphabetizedLines(filtered);
    }

    public static AlphabetizedLines createKWICIndexes(String input) {
        CircularShift cs = new CircularShift();
        List<Line> lines = cs.getCircularShifts(input).getCircularShiftedLines().get(0).getShiftedLines();
        Alphabetizer alphabetizer = new Alphabetizer();
        AlphabetizedLines al = alphabetizer.genAlpha(lines);
        return eliminateNoise(al.getLines());
    }
}

