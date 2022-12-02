package com.gooogle.se;

public class EmptyValueException extends RuntimeException {
    public EmptyValueException() {
        super("Null or empty values not allowed");
    }
}
class UnableToCreateFileException extends RuntimeException {
    public UnableToCreateFileException(String exceptionMsg) {
        super("Unable to create File " + exceptionMsg);
    }
}
