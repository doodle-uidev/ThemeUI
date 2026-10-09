package com.winhub.admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.winhub.admin.dto.UserDto;
import com.winhub.common.controller.BaseController;

import org.springframework.ui.Model;

import java.util.ArrayList;
import java.util.List;

@Controller
public class UserController extends BaseController{
    
    @GetMapping("/users")
    public String userManagement(Model model) {
        model.addAttribute("currentPage", "USER");
        model.addAttribute("pageTitle", "사용자 관리");
        return "admin/users";
    }

    @GetMapping("/api/users")
    @ResponseBody
    public List<UserDto> getUsers() {
        // 임시 데이터 생성
        List<UserDto> users = new ArrayList<>();
        users.add(new UserDto(1L, "아이언맨", "2023-12-19 15:55", "ACTIVE"));
        users.add(new UserDto(2L, "베트맨", "2023-12-19 15:55", "ACTIVE"));
        users.add(new UserDto(3L, "슈퍼맨", "2023-12-19 15:55", "ACTIVE"));
        return users;
    }
} 