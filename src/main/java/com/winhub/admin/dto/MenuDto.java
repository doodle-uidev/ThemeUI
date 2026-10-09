package com.winhub.admin.dto;

import java.util.List;
import java.util.ArrayList;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;
import lombok.Setter;
import lombok.AllArgsConstructor;
import com.winhub.admin.entity.Menu;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenuDto {
    private String id;
    private String name;
    private String parentId;
    private String depth;
    private String useYn;
    private String url;
    private String createdBy;
    private String state;
    private LocalDateTime createdDate;
    private String modifiedBy;
    private LocalDateTime modifiedDate;
    private List<MenuDto> subMenus = new ArrayList<>();
    
    @Builder
    public MenuDto(String id, String name, String parentId, String depth, String useYn, String url,
                  String createdBy, LocalDateTime createdDate, String modifiedBy, LocalDateTime modifiedDate) {
        this.id = id;
        this.name = name;
        this.parentId = parentId;
        this.depth = depth;
        this.useYn = useYn;
        this.url = url;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.modifiedBy = modifiedBy;
        this.modifiedDate = modifiedDate;
    }

    public void setSubMenus(List<MenuDto> subMenus) {
        this.subMenus = subMenus;
    }

    public static MenuDto fromEntity(Menu menu) {
        return new MenuDto(
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
        );
    }

    // Method to create a new Menu entity from this DTO
    public Menu toNewEntity() {
        return Menu.builder()
            .id(this.id)
            .name(this.name)
            .url(this.url)
            .parentId(this.parentId)
            .depth(this.depth)
            .useYn(this.useYn)
            .build();
    }

    // Method to update an existing Menu entity with this DTO's data
    public void updateEntity(Menu menu) {
        menu.update(
            this.name,
            this.url,
            this.parentId,
            this.depth,
            this.useYn
        );
    }
} 