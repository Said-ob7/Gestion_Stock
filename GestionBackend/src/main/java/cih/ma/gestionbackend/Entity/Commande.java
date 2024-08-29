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
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bon_commande_id", referencedColumnName = "id")
    private BonCommande bonCommande;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bon_livraison_id", referencedColumnName = "id")
    private BonLivraison bonLivraison;

    @Temporal(TemporalType.TIMESTAMP)
    private Date uploadDate;
}
