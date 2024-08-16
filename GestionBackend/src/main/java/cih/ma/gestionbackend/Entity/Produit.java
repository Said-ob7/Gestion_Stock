package cih.ma.gestionbackend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nserie;
    private String model;
//    private String N_BC;
//    private String N_BL;

    @ManyToOne
    @JoinColumn(name = "product_type_id")
    private ProductType productType;

    @ManyToOne
    @JoinColumn(name = "commande_id")
    private Commande commande;

    private Integer quantite;

    private String affectation;

    private Date dateAffectation;

//    @PostLoad
//    private void populateN_BC_N_BL() {
//        if (commande != null) {
//            if (commande.getBonCommande() != null) {
//                this.N_BC = commande.getBonCommande().getN_BC();
//            }
//            if (commande.getBonLivraison() != null) {
//                this.N_BL = commande.getBonLivraison().getN_BL();
//            }
//        }
//    }
}
