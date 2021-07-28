public class Matiere {
    private String nom;
    private Boolean valeur;
    private int serie;
    
    public Matiere(String pnom) {
        this.nom = pnom;
        this.valeur = false;
    }
    public Matiere(String pnom, int pserie) {
        this.nom = pnom;
        this.serie = pserie;
        this.valeur = false;
    }
    /**geter**/
    
    public int getSerie() {
        return this.serie;
    }
    public String getNom() {
        return this.nom;
    }
    public Boolean getValeur() {
        return this.valeur;
    }
    /**seter**/
    public void setValeur(boolean pvaleur) {
        this.valeur = pvaleur;
    }
}
