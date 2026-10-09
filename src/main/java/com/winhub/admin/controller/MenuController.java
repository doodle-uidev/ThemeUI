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
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Controller
@RequestMapping("/menus")
public class MenuController extends BaseController {
    
    @Autowired
    private MenuService menuService;

    @GetMapping("")
    public String menus(Model model) {
        model.addAttribute("currentPage", "MENU");
        model.addAttribute("pageTitle", "메뉴 관리");
        return "admin/menus";  
    }

    @GetMapping("/api/getMenuList")
    @ResponseBody
    public List<MenuDto> getMenuList() {
        return menuService.getMenuList();
    }

    @GetMapping("/api/search")
    @ResponseBody
    public List<MenuDto> searechMenus(@RequestParam String name, @RequestParam String id) {
        return menuService.searchByNameOrId(name, id);
    }

    @PostMapping("/api/save")
    public ResponseEntity<?> saveMenus(@RequestBody List<MenuDto> menus) {
        try {
            List<Menu> savedMenus = menuService.saveMenus(menus);
            return ResponseEntity.ok(savedMenus);
        } catch (RuntimeException e) {
            log.error("Failed to save menus", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(e.getMessage());
        }
    }

    @PostMapping("/api/delete")
    public ResponseEntity<?> deleteMenus(@RequestBody List<Map<String, Object>> requestBody) {
        try {
            // Extract IDs from the request body
            List<String> ids = requestBody.stream()
                                        .map(entry -> (String) entry.get("id"))
                                        .collect(Collectors.toList());

            menuService.deleteMenus(ids);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            log.error("Failed to delete menus", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(e.getMessage());
        }
    }
} 