package cih.ma.gestionbackend.Controller;

import cih.ma.gestionbackend.Entity.BonCommande;
import cih.ma.gestionbackend.Entity.BonLivraison;
import cih.ma.gestionbackend.Entity.Commande;
import cih.ma.gestionbackend.Services.CommandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/commande")
public class CommandeController {

    @Autowired
    private CommandeService commandeService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadCommande(
            @RequestParam("description") String description,
            @RequestParam("bonCommande") MultipartFile bonCommandeFile,
            @RequestParam("bonLivraison") MultipartFile bonLivraisonFile,
            @RequestParam("nBC") String nBc,
            @RequestParam("nBL") String nBl,
            @RequestParam("dateLivraison") @DateTimeFormat(pattern="yyyy-MM-dd") Date dateLivraison
    )
    {
        try {
            Commande commande = commandeService.saveCommande(description, bonCommandeFile, bonLivraisonFile, nBc, nBl, dateLivraison);
            return ResponseEntity.ok("Commande uploaded successfully: " + commande.getId());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload commande");
        }
    }

    @GetMapping
    public ResponseEntity<List<Commande>> getAllCommandes() {
        List<Commande> commandes = commandeService.getAllCommandes();
        return ResponseEntity.ok(commandes);
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<Commande> viewCommande(@PathVariable Long id) {
        Optional<Commande> commandeOptional = commandeService.getCommande(id);
        return commandeOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body(null));
    }

    @GetMapping("/download/bonCommande/{id}")
    public ResponseEntity<byte[]> downloadBonCommande(@PathVariable Long id) {
        Optional<Commande> commandeOptional = commandeService.getCommande(id);
        if (commandeOptional.isPresent() && commandeOptional.get().getBonCommande() != null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + commandeOptional.get().getBonCommande().getFileName() + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(commandeOptional.get().getBonCommande().getData());
        } else {
            return ResponseEntity.status(404).body(null);
        }
    }

    @GetMapping("/download/bonLivraison/{id}")
    public ResponseEntity<byte[]> downloadBonLivraison(@PathVariable Long id) {
        Optional<Commande> commandeOptional = commandeService.getCommande(id);
        if (commandeOptional.isPresent() && commandeOptional.get().getBonLivraison() != null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + commandeOptional.get().getBonLivraison().getFileName() + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(commandeOptional.get().getBonLivraison().getData());
        } else {
            return ResponseEntity.status(404).body(null);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Commande> updateCommande(@PathVariable Long id, @RequestBody Commande updatedCommande) {
        Optional<Commande> existingCommande = commandeService.getCommande(id);
        if (existingCommande.isPresent()) {
            Commande commande = existingCommande.get();
            commande.setDescription(updatedCommande.getDescription());
            commande.getBonCommande().setN_BC(updatedCommande.getBonCommande().getN_BC());
            commande.getBonLivraison().setN_BL(updatedCommande.getBonLivraison().getN_BL());
            Commande savedCommande = commandeService.save(commande);
            return ResponseEntity.ok(savedCommande);
        } else {
            return ResponseEntity.status(404).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCommande(@PathVariable Long id) {
        Optional<Commande> existingCommande = commandeService.getCommande(id);
        if (existingCommande.isPresent()) {
            commandeService.deleteCommande(id);
            return ResponseEntity.ok("Commande deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Commande not found");
        }
    }
}