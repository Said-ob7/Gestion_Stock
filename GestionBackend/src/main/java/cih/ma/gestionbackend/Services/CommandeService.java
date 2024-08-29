package cih.ma.gestionbackend.Services;

import cih.ma.gestionbackend.Entity.BonCommande;
import cih.ma.gestionbackend.Entity.BonLivraison;
import cih.ma.gestionbackend.Entity.Commande;
import cih.ma.gestionbackend.Repository.CommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CommandeService {

    @Autowired
    private CommandeRepository commandeRepository;

    // Method to save or update a Commande
    public Commande save(Commande commande) {
        return commandeRepository.save(commande);
    }

    public void deleteCommande(Long id) {
        commandeRepository.deleteById(id);
    }

    public Commande saveCommande(String description, MultipartFile bonCommandeFile, MultipartFile bonLivraisonFile, String nBc, String nBl, Date dateLivraison) throws IOException {
        BonCommande bonCommande = new BonCommande();
        bonCommande.setFileName(bonCommandeFile.getOriginalFilename());
        bonCommande.setN_BC(nBc); // Set the N_BC value
        bonCommande.setData(bonCommandeFile.getBytes());

        BonLivraison bonLivraison = new BonLivraison();
        bonLivraison.setFileName(bonLivraisonFile.getOriginalFilename());
        bonLivraison.setN_BL(nBl); // Set the N_BL value
        bonLivraison.setData(bonLivraisonFile.getBytes());
        bonLivraison.setDateLivraison(dateLivraison);

        Commande commande = new Commande();
        commande.setDescription(description);
        commande.setBonCommande(bonCommande);
        commande.setBonLivraison(bonLivraison);
        commande.setUploadDate(new Date());

        return commandeRepository.save(commande);
    }

    public Optional<Commande> getCommande(Long id) {
        return commandeRepository.findById(id);
    }

    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }
}
