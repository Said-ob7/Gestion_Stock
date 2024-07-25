package cih.ma.gestionbackend.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity @Data
@AllArgsConstructor @NoArgsConstructor @Builder
public class Produit {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String type;
    private String model;
    private String noSerie;
    private int inventaire;


}

