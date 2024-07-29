package cih.ma.gestionbackend.Controller;

import cih.ma.gestionbackend.Entity.Produit;
import cih.ma.gestionbackend.Entity.ProductType;
import cih.ma.gestionbackend.Repository.ProduitRepository;
import cih.ma.gestionbackend.Repository.ProductTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
    private SimpMessagingTemplate template;

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

    @PostMapping("/add")
    public ResponseEntity<Produit> addProduct(@RequestBody Produit produit) {
        if (produit.getProductType() == null || produit.getProductType().getId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        ProductType productType = productTypeRepository.findById(produit.getProductType().getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid product type ID"));

        produit.setProductType(productType);

        Produit newProduit = produitRepository.save(produit);
        template.convertAndSend("/topic/products", "New product added: " + produit.getNserie());
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
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid product ID"));

        produit.setNserie(produitDetails.getNserie());
        produit.setModel(produitDetails.getModel());

        if (produitDetails.getProductType() != null && produitDetails.getProductType().getId() != null) {
            ProductType productType = productTypeRepository.findById(produitDetails.getProductType().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid product type ID"));
            produit.setProductType(productType);
        }

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
