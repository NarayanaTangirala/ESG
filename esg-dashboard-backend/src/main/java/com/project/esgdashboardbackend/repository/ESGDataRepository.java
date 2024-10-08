package com.project.esgdashboardbackend.repository;

import com.project.esgdashboardbackend.model.ESGData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ESGDataRepository extends JpaRepository<ESGData, Long> {

    ESGData findByCompanyName(String companyName);

    List<String> findAllBy();
}
