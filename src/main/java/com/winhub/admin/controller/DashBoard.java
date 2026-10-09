package com.winhub.admin.controller;

import java.util.List;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import com.winhub.admin.dto.MenuDto;
import com.winhub.admin.entity.Menu;
import com.winhub.common.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import com.winhub.admin.service.MenuService;

@Slf4j
@Controller
@RequestMapping("/dashboard")
public class DashBoard extends BaseController {
    
    @Autowired
    private MenuService menuService;

    @GetMapping("")
    public String menus(Model model) {
        model.addAttribute("currentPage", "MENU");
        return "admin/dashboard";
    }

} 