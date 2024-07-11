package cih.ma.gestionbackend.Controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/")
public class HomeController {

    @PreAuthorize("hasRole('client_user')")
    @GetMapping
    public String hello(){
        return "Hello this is Home";
    }


    @PreAuthorize("hasRole('client_admin')")
    @GetMapping("/ADMIN")
    public String hello_2(){
        return "Hello to ADMIN";
    }
}
