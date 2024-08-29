package cih.ma.gestionbackend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity @Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BonLivraison {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    @Lob
    @Column(columnDefinition="LONGBLOB")
    private byte[] data;

    private String N_BL;

    private Date DateLivraison;

}