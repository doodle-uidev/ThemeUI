package com.winhub.admin.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.winhub.admin.dto.MenuDto;
import com.winhub.admin.repository.MenuRepository;
import com.winhub.admin.entity.Menu;
import java.util.ArrayList;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MenuService {
    
    private final MenuRepository menuRepository;
    
    public List<MenuDto> getMenuList() {
        return menuRepository.findAll().stream()
            .map(MenuDto::fromEntity)
            .collect(Collectors.toList());
    }

    public List<MenuDto> searchByNameOrId(String name, String id) {
        return menuRepository.searchByNameOrId(name, id).stream()    
            .map(MenuDto::fromEntity)
            .collect(Collectors.toList());
    }
    
    public List<Menu> saveMenus(List<MenuDto> menuDtos) {
        List<Menu> savedMenus = new ArrayList<>();

        for (MenuDto menuDto : menuDtos) {
            if ("create".equals(menuDto.getState())) {
                // Create new Menu entity
                Menu newMenu = menuDto.toNewEntity();
                savedMenus.add(menuRepository.save(newMenu));
            } else if ("update".equals(menuDto.getState())) {
                // Update existing Menu entity
                Menu existingMenu = menuRepository.findById(menuDto.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Menu not found with id: " + menuDto.getId()));
                menuDto.updateEntity(existingMenu);
                savedMenus.add(existingMenu);
            }
        }

        return savedMenus;
    }

    public void deleteMenus(List<String> ids) {
        menuRepository.updateUseYnToNByIds(ids);
    }
} 