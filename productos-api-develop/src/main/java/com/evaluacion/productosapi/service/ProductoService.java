package com.evaluacion.productosapi.service;

import com.evaluacion.productosapi.entity.Categoria;
import com.evaluacion.productosapi.entity.Producto;
import com.evaluacion.productosapi.repository.ProductoRepository;
import com.evaluacion.productosapi.service.exception.ProductoNoEncontradoException;
import com.evaluacion.productosapi.service.exception.StockInsuficienteException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    public List<Producto> listarPorCategoria(Categoria categoria) {
        return productoRepository.findByCategoria(categoria);
    }

    public Producto obtenerPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ProductoNoEncontradoException(id));
    }

    public Producto crear(Producto producto) {
        producto.setId(null);
        return productoRepository.save(producto);
    }

    public Producto actualizar(Long id, Producto productoActualizado) {
        Producto existente = obtenerPorId(id);
        existente.setNombre(productoActualizado.getNombre());
        existente.setPrecio(productoActualizado.getPrecio());
        existente.setCantidadDisponible(productoActualizado.getCantidadDisponible());
        existente.setDescripcion(productoActualizado.getDescripcion());
        existente.setCategoria(productoActualizado.getCategoria());
        return productoRepository.save(existente);
    }

    public void eliminar(Long id) {
        Producto existente = obtenerPorId(id);
        productoRepository.delete(existente);
    }

    @Transactional
    public Producto vender(Long id, int cantidad) {
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad a vender debe ser mayor que 0");
        }

        Producto producto = obtenerPorId(id);
        int disponible = producto.getCantidadDisponible();

        if (disponible < cantidad) {
            throw new StockInsuficienteException(id);
        }

        producto.setCantidadDisponible(disponible - cantidad);
        // gracias a @Transactional y JPA, el cambio se persiste automáticamente
        return producto;
    }
}
