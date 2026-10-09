package com.winhub.common.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import com.winhub.admin.dto.MenuDto;
import com.winhub.common.service.BasicService;

@Controller
public class BaseController {

    @Autowired
    private BasicService basicService;

    @ModelAttribute("menus")
    public List<MenuDto> getMenus() {
        return basicService.getMenuList();
    }
}