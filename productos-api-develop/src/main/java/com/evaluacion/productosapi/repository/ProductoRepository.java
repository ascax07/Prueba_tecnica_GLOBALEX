package com.evaluacion.productosapi.repository;

import com.evaluacion.productosapi.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
