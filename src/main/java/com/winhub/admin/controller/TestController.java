package com.winhub.admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import com.winhub.common.controller.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import com.winhub.admin.service.MenuService;

@Slf4j
@Controller
@RequestMapping("/test")
public class TestController extends BaseController {

    @GetMapping("")
    public String menus(Model model) {
        model.addAttribute("currentPage", "TEST");
        model.addAttribute("pageTitle", "테스트 페이지");
        return "admin/test";  
    }

} 