package cih.ma.gestionbackend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity @Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BonCommande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    @Lob
    @Column(columnDefinition="BLOB")
    private byte[] data;

    private String N_BC;
}
