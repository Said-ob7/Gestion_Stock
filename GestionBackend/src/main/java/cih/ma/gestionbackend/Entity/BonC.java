
package cih.ma.gestionbackend.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity @Data
@AllArgsConstructor @NoArgsConstructor
public class BonC {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idbc;
    private String nomC;
    private String numL;
    private String pdfPath;
}
