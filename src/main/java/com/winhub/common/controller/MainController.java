package com.winhub.common.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController extends BaseController{
    
    @GetMapping("/main")
    public String index(Model model) {
        model.addAttribute("currentPage", "MAIN");
        model.addAttribute("pageTitle", "메인 페이지");
        return "admin/main";  
    }
} 