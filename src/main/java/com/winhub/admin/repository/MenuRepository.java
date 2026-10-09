package com.winhub.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import com.winhub.admin.entity.Menu;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, String> {
    List<Menu> findByUseYn(String useYn);
    List<Menu> findByParentId(String parentId);

    @Query("SELECT m FROM Menu m WHERE (m.name = '' OR m.name LIKE %:name%) AND (m.id = '' OR m.id LIKE %:id%)")
    List<Menu> searchByNameOrId(@Param("name") String name, @Param("id") String id);

    @Modifying
    @Query("UPDATE Menu m SET m.useYn = 'N' WHERE m.id IN (:ids)")
    void updateUseYnToNByIds(@Param("ids") List<String> ids);

    boolean existsByName(String name);

    boolean existsByUrl(String url);
} 