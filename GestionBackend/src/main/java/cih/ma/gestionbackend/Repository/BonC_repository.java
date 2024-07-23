package cih.ma.gestionbackend.Repository;

import cih.ma.gestionbackend.Entity.BonC;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BonC_repository extends JpaRepository<BonC,Long> {
    // List<BonC> findAll();
}