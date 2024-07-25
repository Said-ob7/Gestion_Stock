package cih.ma.gestionbackend.Repository;

import cih.ma.gestionbackend.Entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProduitRepository extends JpaRepository<Produit, Long> {
}
