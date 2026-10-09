package com.winhub.common.service;

import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.winhub.admin.dto.MenuDto;
import com.winhub.admin.repository.MenuRepository;
import com.winhub.admin.entity.Menu;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;

@Service
@Slf4j
@RequiredArgsConstructor
public class BasicService {
    
    private final MenuRepository menuRepository;
    
    public List<MenuDto> getMenuList() {
        List<Menu> allMenus = menuRepository.findByUseYn("Y");
        log.debug("Found menus: {}", allMenus);
        
        if (allMenus == null || allMenus.isEmpty()) {
            log.debug("No menus found");
            return new ArrayList<>();
        }
        
        List<MenuDto> menuDtos = allMenus.stream()
            .map(menu -> new MenuDto(
                menu.getId(),
                menu.getName(),
                menu.getParentId(),
                menu.getDepth(),
                menu.getUseYn(),
                menu.getUrl(),
                menu.getCreatedBy(),
                menu.getCreatedDate(),
                menu.getModifiedBy(),
                menu.getModifiedDate()
            ))
            .collect(Collectors.toList());
        
        log.debug("Converted to DTOs: {}", menuDtos);
        
        // 최상위 메뉴만 필터링
        List<MenuDto> topMenus = menuDtos.stream()
            .filter(menu -> menu.getDepth().equals("1"))
            .collect(Collectors.toList());
        
        // 각 최상위 메뉴에 하위 메뉴 추가
        for (MenuDto topMenu : topMenus) {
            addSubMenus(topMenu, menuDtos);
        }
        
        return topMenus;
    }
    
    private void addSubMenus(MenuDto parentMenu, List<MenuDto> allMenus) {
        // 2depth: parentId가 현재 메뉴의 id와 일치하는 메뉴
        List<MenuDto> subMenus = allMenus.stream()
            .filter(menu -> menu.getParentId() != null 
                && !menu.getId().equals(menu.getParentId())
                && menu.getParentId().equals(parentMenu.getId())
                && "2".equals(menu.getDepth()))
            .collect(Collectors.toList());

        // 각 2depth 메뉴에 대해 3depth 메뉴 찾기
        for (MenuDto subMenu : subMenus) {
            List<MenuDto> thirdLevelMenus = allMenus.stream()
                .filter(menu -> menu.getParentId() != null 
                    && "3".equals(menu.getDepth())
                    && menu.getParentId().equals(subMenu.getId()))
                .collect(Collectors.toList());
            
            subMenu.setSubMenus(thirdLevelMenus);
        }
        
        parentMenu.setSubMenus(subMenus);
    }
} 