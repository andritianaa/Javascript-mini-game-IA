public class Matiere {
    private String nom;
    private Boolean valeur;
    private int serie;

    public Matiere(String pnom, int pserie) {
        nom = pnom;
        serie = pserie;
        valeur = false;
    }
    /**geter**/
    
    public int getSerie() {
        return serie;
    }
    public String getNom() {
        return nom;
    }
    public Boolean getValeur() {
        return valeur;
    }
    /**seter**/
    public void setValeur(boolean pvaleur) {
        valeur = pvaleur;
    }
}
