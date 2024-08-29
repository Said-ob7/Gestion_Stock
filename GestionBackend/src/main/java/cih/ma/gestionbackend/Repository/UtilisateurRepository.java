package cih.ma.gestionbackend.Repository;

import cih.ma.gestionbackend.Entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
}
