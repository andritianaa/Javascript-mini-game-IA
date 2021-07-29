import java.io.PrintStream;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        /**
         * tableau mitazona count ana matiere
         * le tableau faharoa mitondra ny anarana matière
         * tsy natao tableau 2D satria ny ray int de ny ray String
         * raha hanaovana tri ny tableau ray de ny ray koahatao tri satria mifandray
         **/
        int[] listSerie = new int[4];
        String[] listSerieName = {" ","Scientifique","Litéraire","Neutre"};
        
        /**scanner hanaovana saisie console
          esorina rehefa miditra mobile**/
        Scanner sc = new Scanner(System.in);
        /**
         * initialisena ilay liste ana matière
         * ny contenu an'ny liste ary amin'ny class Liste
         **/
        Liste listeMatiere = new Liste();
        Matiere[] liste = listeMatiere.getListeMatiere();
        /**
         * asesy tsirairay ny matière rehetra de raha tiana dia saisisena 1 ny valeur raha tsy tiana de 0
         * tsy maintsy 0 na 1 ihany ny valeur ampidirina anaty tmp satria "na tiana ilay matière na tsy tiana
         **/
        for(int i = 0; i < liste.length; ++i) {
            int tmp;
            do{
                System.out.println(liste[i].getNom()+" ");
                tmp = sc.nextInt();
                if (tmp == 1) liste[i].setValeur(true);
            }while (tmp!=0 && tmp!=1);
            
            /**
             * izay matière tiana incrémentena anakiray ny valeur an'ny série mifandraika aminazy
             **/
            if      (liste[i].getSerie() == 1 && liste[i].getValeur().equals(true)) listSerie[1]++;
            else if (liste[i].getSerie() == 2 && liste[i].getValeur().equals(true)) listSerie[2]++;
            else if (liste[i].getSerie() == 3 && liste[i].getValeur().equals(true)) listSerie[3]++;
        }
        for(int i=1; i<=listSerie.length-1; i++ ){
                int tmp;
                String temp;
            for(int j=i+1; j<=listSerie.length; j++){
                if(listSerie[i]<listSerie[j]) {
                    tmp = listSerie[i];
                    listSerie[i] = listSerie[j];
                    listSerie[j] = tmp;

                    temp = listSerieName[i];
                    listSerieName[i] = listSerieName[j];
                    listSerieName[j] = temp;
                }
            }
        }


        System.out.println("\n");
        for(int i = 1; i < listSerie.length; ++i) {
            System.out.println(listSerieName[i]+" "+listSerie[i]);
        }
    }
}