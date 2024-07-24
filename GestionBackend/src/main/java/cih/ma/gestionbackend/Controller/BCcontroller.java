package cih.ma.gestionbackend.Controller;

import cih.ma.gestionbackend.Entity.BonC;
import cih.ma.gestionbackend.Repository.BonC_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bonc")
@CrossOrigin(origins = "http://localhost:3000") // Adjust the origin to match your front-end URL
public class BCcontroller {

    @Autowired
    private BonC_repository bonCRepository;

    private static final String UPLOAD_DIR = "C:\\Users\\pc\\Desktop\\Gestion_Stock\\GestionBackend\\src\\main\\resources\\PDF";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("bonCommande") MultipartFile bonCommande,
                                             @RequestParam("bonLivraison") MultipartFile bonLivraison,
                                             @RequestParam("dte") String dte,
                                             @RequestParam("numL") String numL) {
        try {
            if (bonCommande.isEmpty() || bonLivraison.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Empty file(s)");
            }
            if (!"application/pdf".equals(bonCommande.getContentType()) || !"application/pdf".equals(bonLivraison.getContentType())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only PDF files are allowed");
            }

            // Parse the date
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date parsedDate;
            try {
                parsedDate = dateFormat.parse(dte);
            } catch (ParseException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid date format");
            }

            // Save the files to the upload directory
            String bonCommandeFileName = bonCommande.getOriginalFilename();
            String bonLivraisonFileName = bonLivraison.getOriginalFilename();
            Path bonCommandeFilePath = Paths.get(UPLOAD_DIR, bonCommandeFileName).toAbsolutePath().normalize();
            Path bonLivraisonFilePath = Paths.get(UPLOAD_DIR, bonLivraisonFileName).toAbsolutePath().normalize();
            Files.write(bonCommandeFilePath, bonCommande.getBytes());
            Files.write(bonLivraisonFilePath, bonLivraison.getBytes());

            // Save the file paths and other details in the database
            BonC bonC = new BonC();
            bonC.setDte(parsedDate);
            bonC.setNumL(numL);
            bonC.setBonCpdfPath(bonCommandeFilePath.toString());
            bonC.setBonLpdfPath(bonLivraisonFilePath.toString());
            bonCRepository.save(bonC);

            return ResponseEntity.status(HttpStatus.OK).body("Files uploaded successfully: " + bonCommandeFilePath + ", " + bonLivraisonFilePath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading file: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<BonC>> getAllBonCs() {
        List<BonC> bonCs = bonCRepository.findAll();
        return ResponseEntity.ok(bonCs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BonC> getBonCById(@PathVariable Long id) {
        Optional<BonC> bonC = bonCRepository.findById(id);
        if (bonC.isPresent()) {
            return ResponseEntity.ok(bonC.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBonC(@PathVariable Long id) {
        Optional<BonC> bonC = bonCRepository.findById(id);
        if (bonC.isPresent()) {
            // Delete the files
            try {
                Path bonCFilePath = Paths.get(bonC.get().getBonCpdfPath()).toAbsolutePath().normalize();
                Path bonLFilePath = Paths.get(bonC.get().getBonLpdfPath()).toAbsolutePath().normalize();
                Files.deleteIfExists(bonCFilePath);
                Files.deleteIfExists(bonLFilePath);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting files: " + e.getMessage());
            }
            bonCRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body("BonC deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("BonC not found");
        }
    }

    @GetMapping("/pdf/{filename:.+}")
    public ResponseEntity<Resource> getPdfFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).toAbsolutePath().normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
