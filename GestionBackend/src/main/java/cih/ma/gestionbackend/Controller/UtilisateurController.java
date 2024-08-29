package cih.ma.gestionbackend.Controller;

import cih.ma.gestionbackend.Entity.Produit;
import cih.ma.gestionbackend.Entity.Utilisateur;
import cih.ma.gestionbackend.Repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/User")
public class UtilisateurController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;


    @GetMapping
    public ResponseEntity<List<Utilisateur>> getAllUsers() {
        List<Utilisateur> utilisateurList = utilisateurRepository.findAll();
        return new ResponseEntity<>(utilisateurList, HttpStatus.OK);
    }


    @PostMapping("/add")
    public ResponseEntity<Utilisateur> AddUser(@RequestBody Utilisateur utilisateur){
        Utilisateur newUser = utilisateurRepository.save(utilisateur);

        return new ResponseEntity<>(newUser, HttpStatus.CREATED);

    }
}
