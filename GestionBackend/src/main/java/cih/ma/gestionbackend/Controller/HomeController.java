package cih.ma.gestionbackend.Controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class HomeController {

    @PreAuthorize("hasRole('client-user')")
    @GetMapping
    public String hello(){
        return "Hello this is Home";
    }


    @PreAuthorize("hasRole('client-admin')")
    @GetMapping("/api/v1/ADMIN")
    public String hello_2(){
        return "Hello to ADMIN";
    }
}
