package cih.ma.gestionbackend.Controller;

import cih.ma.gestionbackend.Entity.BonC;
import cih.ma.gestionbackend.Repository.BonC_repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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

    private static final String UPLOAD_DIR = "C:/Users/DELL/Gestion_Stock/GestionBackend/src/main/resources/PDF";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("BonCpdfPath") MultipartFile bonCpdfPath,
                                             @RequestParam("BonLpdfPath") MultipartFile bonLpdfPath,
                                             @RequestParam("dte") String dte,
                                             @RequestParam("numL") String numL) {
        // Validate files
        if (bonCpdfPath.isEmpty() || bonLpdfPath.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("One or both files are empty");
        }
        if (!"application/pdf".equals(bonCpdfPath.getContentType()) || !"application/pdf".equals(bonLpdfPath.getContentType())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only PDF files are allowed");
        }

        // Parse date
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date parsedDate;
        try {
            parsedDate = dateFormat.parse(dte);
        } catch (ParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid date format. Use yyyy-MM-dd.");
        }

        // Save files
        try {
            String bonCpdfFilename = StringUtils.cleanPath(bonCpdfPath.getOriginalFilename());
            String bonLpdfFilename = StringUtils.cleanPath(bonLpdfPath.getOriginalFilename());

            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path bonCpdfFilePath = uploadPath.resolve(bonCpdfFilename).toAbsolutePath().normalize();
            Path bonLpdfFilePath = uploadPath.resolve(bonLpdfFilename).toAbsolutePath().normalize();

            try (InputStream bonCpdfInputStream = bonCpdfPath.getInputStream();
                 InputStream bonLpdfInputStream = bonLpdfPath.getInputStream()) {
                Files.copy(bonCpdfInputStream, bonCpdfFilePath, StandardCopyOption.REPLACE_EXISTING);
                Files.copy(bonLpdfInputStream, bonLpdfFilePath, StandardCopyOption.REPLACE_EXISTING);
            }

            // Save file paths and other details in database
            BonC bonC = new BonC();
            bonC.setDte(parsedDate);
            bonC.setNumL(numL);
            bonC.setBonCpdfPath(bonCpdfFilePath.toString());
            bonC.setBonLpdfPath(bonLpdfFilePath.toString());
            bonCRepository.save(bonC);

            return ResponseEntity.ok("Files uploaded successfully: " + bonCpdfFilePath + ", " + bonLpdfFilePath);
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
        return bonC.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }
    @PutMapping("/{id}")
    public ResponseEntity<String> updateCommande(@PathVariable Long id,
                                                 @RequestParam(value = "BonCpdfPath", required = false) MultipartFile bonCpdfPath,
                                                 @RequestParam(value = "BonLpdfPath", required = false) MultipartFile bonLpdfPath,
                                                 @RequestParam("dte") String dte,
                                                 @RequestParam("numL") String numL) {
        Optional<BonC> optionalBonC = bonCRepository.findById(id);
        if (!optionalBonC.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Command not found");
        }

        BonC bonC = optionalBonC.get();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date parsedDate;
        try {
            parsedDate = dateFormat.parse(dte);
        } catch (ParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid date format. Use yyyy-MM-dd.");
        }

        // Update date and numL
        bonC.setDte(parsedDate);
        bonC.setNumL(numL);

        // Update files if provided
        if (bonCpdfPath != null && !bonCpdfPath.isEmpty()) {
            if (!"application/pdf".equals(bonCpdfPath.getContentType())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only PDF files are allowed");
            }
            try {
                String bonCpdfFilename = StringUtils.cleanPath(bonCpdfPath.getOriginalFilename());
                Path bonCpdfFilePath = Paths.get(UPLOAD_DIR).resolve(bonCpdfFilename).toAbsolutePath().normalize();
                try (InputStream bonCpdfInputStream = bonCpdfPath.getInputStream()) {
                    Files.copy(bonCpdfInputStream, bonCpdfFilePath, StandardCopyOption.REPLACE_EXISTING);
                }
                bonC.setBonCpdfPath(bonCpdfFilePath.toString());
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating BonC PDF file: " + e.getMessage());
            }
        }

        if (bonLpdfPath != null && !bonLpdfPath.isEmpty()) {
            if (!"application/pdf".equals(bonLpdfPath.getContentType())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only PDF files are allowed");
            }
            try {
                String bonLpdfFilename = StringUtils.cleanPath(bonLpdfPath.getOriginalFilename());
                Path bonLpdfFilePath = Paths.get(UPLOAD_DIR).resolve(bonLpdfFilename).toAbsolutePath().normalize();
                try (InputStream bonLpdfInputStream = bonLpdfPath.getInputStream()) {
                    Files.copy(bonLpdfInputStream, bonLpdfFilePath, StandardCopyOption.REPLACE_EXISTING);
                }
                bonC.setBonLpdfPath(bonLpdfFilePath.toString());
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating BonL PDF file: " + e.getMessage());
            }
        }

        bonCRepository.save(bonC);
        return ResponseEntity.ok("Commande updated successfully");
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBonC(@PathVariable Long id) {
        Optional<BonC> bonC = bonCRepository.findById(id);
        if (bonC.isPresent()) {
            // Delete files
            try {
                Path bonCpdfFilePath = Paths.get(bonC.get().getBonCpdfPath()).toAbsolutePath().normalize();
                Path bonLpdfFilePath = Paths.get(bonC.get().getBonLpdfPath()).toAbsolutePath().normalize();
                Files.deleteIfExists(bonCpdfFilePath);
                Files.deleteIfExists(bonLpdfFilePath);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting files: " + e.getMessage());
            }
            bonCRepository.deleteById(id);
            return ResponseEntity.ok("BonC deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("BonC not found");
        }
    }

    @GetMapping("/pdf/{filename:.+}")
    public ResponseEntity<Resource> getPdfFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).toAbsolutePath().normalize();
            System.out.println("File path: " + filePath);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                System.out.println("File exists: " + filePath);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(resource);
            } else {
                System.out.println("File not found: " + filePath);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (MalformedURLException e) {
            System.out.println("Malformed URL exception: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
