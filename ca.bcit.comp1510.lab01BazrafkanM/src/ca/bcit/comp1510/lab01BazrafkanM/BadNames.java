package ca.bcit.comp1510.lab01BazrafkanM;

public class BadNames {
	public static void main(String[] args) {
        // These compile, but break conventions (style)
        int Total = 5;                 // should be lowercase first letter
        int number_of_things = 10;     // Java prefers camelCase instead of underscores

        // This will NOT compile (illegal name)
        // int class = 3;  // 'class' is a reserved word

        // Correct versions
        int total = 5;
        int numberOfThings = 10;

        System.out.println(total);
        System.out.println(numberOfThings);
    }
}
