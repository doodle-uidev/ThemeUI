package com.winhub.admin.entity;

import com.example.common.entity.BaseEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;
import lombok.Builder;

@Entity
@Table(name = "TB_MENUS")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Menu extends BaseEntity {
    @Id
    @Column(length = 50)
    private String id;
    
    private String name;
    private String parentId;  
    private String depth;  // 메뉴 depth
    private String useYn;    
    private String url;
    
    @Transient  // DB 컬럼으로는 생성하지 않음
    private String state;

    @Builder
    public Menu(String id, String name, String url, String parentId, String depth, String useYn) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.parentId = parentId;
        this.depth = depth;
        this.useYn = useYn;
    }

    public void update(String name, String url, String parentId, String depth, String useYn) {
        this.name = name;
        this.url = url;
        this.parentId = parentId;
        this.depth = depth;
        this.useYn = useYn;
    }
} 