package cih.ma.gestionbackend.Controller;

import cih.ma.gestionbackend.Entity.Commande;
import cih.ma.gestionbackend.Entity.Produit;
import cih.ma.gestionbackend.Entity.ProductType;
import cih.ma.gestionbackend.Repository.CommandeRepository;
import cih.ma.gestionbackend.Repository.ProduitRepository;
import cih.ma.gestionbackend.Repository.ProductTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/Prod")
public class ProduitController {

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private ProductTypeRepository productTypeRepository;

    @Autowired
    private CommandeRepository commandeRepository;

    @GetMapping
    public ResponseEntity<List<Produit>> getAllProducts() {
        List<Produit> productList = produitRepository.findAll();
        return new ResponseEntity<>(productList, HttpStatus.OK);
    }

    @GetMapping("/types")
    public ResponseEntity<List<ProductType>> getAllProductTypes() {
        List<ProductType> productTypeList = productTypeRepository.findAll();
        return new ResponseEntity<>(productTypeList, HttpStatus.OK);
    }


    @PostMapping("/types")
    public ResponseEntity<?> addType(@RequestBody ProductType productType){
        productTypeRepository.save(productType);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/types/{id}")
    public ResponseEntity<String> deleteType(@PathVariable Long id) {
        ProductType productType = productTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid type ID"));

        // Check if there are any products associated with this type
//        if (!productType.getProducts().isEmpty()) {
//            return new ResponseEntity<>("Type cannot be deleted as it is associated with existing products.", HttpStatus.CONFLICT);
//        }

        productTypeRepository.delete(productType);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }



    @PostMapping("/add")
    public ResponseEntity<Produit> addProduct(@RequestBody Produit produit) {
        if (produit.getProductType() == null || produit.getProductType().getId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        ProductType productType = productTypeRepository.findById(produit.getProductType().getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid product type ID"));

        produit.setProductType(productType);

        if (produit.getCommande() != null && produit.getCommande().getId() != null) {
            Commande commande = commandeRepository.findById(produit.getCommande().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid commande ID"));
            produit.setCommande(commande);
        }

        Produit newProduit = produitRepository.save(produit);
        return new ResponseEntity<>(newProduit, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        Optional<Produit> produitOptional = produitRepository.findById(id);
        if (produitOptional.isPresent()) {
            return new ResponseEntity<>(produitOptional.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produit> updateProduct(@PathVariable Long id, @RequestBody Produit produitDetails) {
        // Find the existing product by ID
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

        // Update product fields
        produit.setNserie(produitDetails.getNserie());
        produit.setModel(produitDetails.getModel());
        produit.setIdentifiant(produitDetails.getIdentifiant());
        produit.setAffectation(produitDetails.getAffectation());
        produit.setDateAffectation(produitDetails.getDateAffectation());

        // Handle ProductType update if provided
        if (produitDetails.getProductType() != null && produitDetails.getProductType().getId() != null) {
            ProductType productType = productTypeRepository.findById(produitDetails.getProductType().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid product type ID"));
            produit.setProductType(productType);
        }

        // Handle Commande update if provided
        if (produitDetails.getCommande() != null && produitDetails.getCommande().getId() != null) {
            Commande commande = commandeRepository.findById(produitDetails.getCommande().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid commande ID"));
            produit.setCommande(commande);
        }

        // Save the updated product
        Produit updatedProduit = produitRepository.save(produit);
        return new ResponseEntity<>(updatedProduit, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

        produitRepository.delete(produit);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
