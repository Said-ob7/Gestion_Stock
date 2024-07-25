package cih.ma.gestionbackend.Controller;

import cih.ma.gestionbackend.Entity.Produit;
import cih.ma.gestionbackend.Repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Prod")
public class ProduitController {

    @Autowired
    private ProduitRepository produitRepository;


    @GetMapping
    public ResponseEntity<List<Produit>> getAllProducts(){
        List<Produit> ProductList = produitRepository.findAll();

        return new ResponseEntity<>(ProductList,HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Produit> AddProduct(@RequestBody Produit produit){

        System.out.println(produit.getNserie() + produit.getModel() + produit.getType());
        Produit Newproduit = produitRepository.save(produit);

        return new ResponseEntity<>(Newproduit,HttpStatus.CREATED);
    }
}
