public class Liste {
   private Matiere [] listeMatiere;
   public Liste(){
      listeMatiere = new Matiere[]{new Matiere("Maths", 1),
            new Matiere("SVT",1),
            new Matiere("PC",1),
            new Matiere("Philo",2),
            new Matiere("Histogeo",3),
            new Matiere("Anglais",3),
            new Matiere("Francais",2),
            new Matiere("Espagnol",2),
            new Matiere("Allemand",2),
            new Matiere("Malagasy",2),
            new Matiere("EPS", 3)
      };
   }
   public Matiere[] getListeMatiere(){
      return listeMatiere;
   }
}
