package cih.ma.gestionbackend.Entities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ProductServices {
    @Autowired
    private RepositoryProduct Repositoryproduct;

    public List<Produit> getAllProducts() {
        return Repositoryproduct.findAll();
    }

    public Produit getProductById(Long id) {
        return Repositoryproduct.findById(id).orElse(null);
    }

    public Produit addProduct(Produit produit) {
        return Repositoryproduct.save(produit);
    }

    public Produit updateProduct(Long id, Produit productDetails) {
        Produit produit = Repositoryproduct.findById(id).orElse(null);
        if (produit != null) {
            produit.setModel(productDetails.getModel());
            produit.setNoSerie(productDetails.getNoSerie());
            produit.setInventaire(productDetails.getInventaire());
            produit.setType(productDetails.getType());
            return Repositoryproduct.save(produit);
        }
        return null;
    }

    public void deleteProduct(Long id) {
        Repositoryproduct.deleteById(id);
    }
}
