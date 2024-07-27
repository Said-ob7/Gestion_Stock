package cih.ma.gestionbackend.Services;

import cih.ma.gestionbackend.Entity.BonCommande;
import cih.ma.gestionbackend.Entity.BonLivraison;
import cih.ma.gestionbackend.Entity.Commande;
import cih.ma.gestionbackend.Repository.CommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class CommandeService {

    @Autowired
    private CommandeRepository commandeRepository;

    public Commande saveCommande(String description, MultipartFile bonCommandeFile, MultipartFile bonLivraisonFile) throws IOException {
        BonCommande bonCommande = new BonCommande();
        bonCommande.setFileName(bonCommandeFile.getOriginalFilename());
        bonCommande.setData(bonCommandeFile.getBytes());

        BonLivraison bonLivraison = new BonLivraison();
        bonLivraison.setFileName(bonLivraisonFile.getOriginalFilename());
        bonLivraison.setData(bonLivraisonFile.getBytes());

        Commande commande = new Commande();
        commande.setDescription(description);
        commande.setBonCommande(bonCommande);
        commande.setBonLivraison(bonLivraison);

        return commandeRepository.save(commande);
    }

    public Optional<Commande> getCommande(Long id) {
        return commandeRepository.findById(id);
    }

    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }
}
