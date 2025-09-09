package ca.bcit.comp1510.lab01BazrafkanM;
/**
 * Demonstrates the different behaviours of the + operator.
 * @MelinaBazrafkan BCIT
 * @version 2025
 */
public class Plus {
	/**
     * Drives the program.
     * @param args unused
     */
    public static void main(String[] args) {
        System.out.println("This is a long string that is the" +
                " concatenation of two shorter strings.");
        System.out.println("The first computer was invented about " + 70 +
                " years ago");
        System.out.println("8 plus 5 is " + 8 + 5);
        System.out.println("8 plus 5 is " + (8 + 5));
        System.out.println(8 + 5 + " equals 8 plus 5.");
    }

}
