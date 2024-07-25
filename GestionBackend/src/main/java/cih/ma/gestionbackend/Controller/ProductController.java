package cih.ma.gestionbackend.Controller;
import cih.ma.gestionbackend.Entities.ProductServices;
import cih.ma.gestionbackend.Entities.Produit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin("*")
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
        private ProductServices productService;

        @CrossOrigin(origins = "http://localhost:5174")
        @GetMapping
        public ResponseEntity<List<Produit>> getAllProducts() {
            return new ResponseEntity<>(productService.getAllProducts(), HttpStatus.OK );
        }
        @CrossOrigin(origins = "http://localhost:5174")
        @GetMapping("/{id}")
        public ResponseEntity<Produit> getProductById(@PathVariable Long id) {
            return new ResponseEntity<>(productService.getProductById(id), HttpStatus.OK);
        }
        @CrossOrigin(origins = "http://localhost:5174")

        @PostMapping
        public ResponseEntity<?> addProduct(@RequestBody Produit produit) {
            productService.addProduct(produit);
            return new ResponseEntity<>( HttpStatus.CREATED);
        }
        @CrossOrigin(origins = "http://localhost:5174")
        @PutMapping("/{id}")
        public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Produit productDetails) {
            productService.updateProduct(id, productDetails);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        @CrossOrigin(origins = "http://localhost:5174")
        @DeleteMapping("/{id}")
        public ResponseEntity<?> deleteProduct(@PathVariable Long id) {

            productService.deleteProduct(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }


