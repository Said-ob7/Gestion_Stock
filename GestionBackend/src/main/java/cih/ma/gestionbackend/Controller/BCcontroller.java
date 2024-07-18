package cih.ma.gestionbackend.Controller;

import cih.ma.gestionbackend.Entity.BonC;
import cih.ma.gestionbackend.Repository.BonC_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bonc")
public class BCcontroller {

    @Autowired
    private BonC_repository bonCRepository;

    private static final String UPLOAD_DIR = "C:\\Users\\pc\\Desktop\\Gestion_Stock\\GestionBackend\\src\\main\\resources\\PDF";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("nomC") String nomC, @RequestParam("numL") String numL) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Empty file");
            }

            // Save the file to the upload directory
            String fileName = file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, fileName);
            Files.write(filePath, file.getBytes());

            // Save the file path in the database
            BonC bonC = new BonC();
            bonC.setNomC(nomC);
            bonC.setNumL(numL);
            bonC.setPdfPath(filePath.toString());
            bonCRepository.save(bonC);

            return ResponseEntity.status(HttpStatus.OK).body("File uploaded successfully: " + filePath);
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
        return bonC.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBonC(@PathVariable Long id) {
        Optional<BonC> bonC = bonCRepository.findById(id);
        if (bonC.isPresent()) {
            // Delete the file
            Path filePath = Paths.get(bonC.get().getPdfPath());
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting file: " + e.getMessage());
            }
            bonCRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.OK).body("BonC deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("BonC not found");
        }
    }
}