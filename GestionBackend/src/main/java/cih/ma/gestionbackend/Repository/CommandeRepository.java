package cih.ma.gestionbackend.Repository;

import cih.ma.gestionbackend.Entity.Commande;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommandeRepository extends JpaRepository<Commande, Long> {
}
