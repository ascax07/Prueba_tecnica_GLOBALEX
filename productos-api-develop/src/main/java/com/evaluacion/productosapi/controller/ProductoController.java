package com.evaluacion.productosapi.controller;

import com.evaluacion.productosapi.entity.Categoria;
import com.evaluacion.productosapi.entity.Producto;
import com.evaluacion.productosapi.service.ProductoService;
import com.evaluacion.productosapi.service.exception.ProductoNoEncontradoException;
import com.evaluacion.productosapi.service.exception.StockInsuficienteException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<Producto> listar() {
        return productoService.listarTodos();
    }

    @GetMapping("/{id}")
    public Producto obtener(@PathVariable Long id) {
        return productoService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Producto crear(@Valid @RequestBody Producto producto) {
        return productoService.crear(producto);
    }

    @PutMapping("/{id}")
    public Producto actualizar(@PathVariable Long id,
                               @Valid @RequestBody Producto producto) {
        return productoService.actualizar(id, producto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
    }

    // Extra: vender / restar stock
    @PatchMapping("/{id}/vender")
    public Producto vender(@PathVariable Long id,
                           @RequestParam int cantidad) {
        return productoService.vender(id, cantidad);
    }

    @GetMapping("/categoria/{categoria}")
    public List<Producto> listarPorCategoria(@PathVariable String categoria) {
        try {
            Categoria cat = Categoria.valueOf(categoria.toUpperCase());
            return productoService.listarPorCategoria(cat);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Categoría no válida: " + categoria);
        }
    }
    // // Manejo básico de errores (podrías extraer a @ControllerAdvice)
    // @ExceptionHandler(ProductoNoEncontradoException.class)
    // public ResponseEntity<String> manejarNoEncontrado(ProductoNoEncontradoException ex) {
    //     return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    // }

    // @ExceptionHandler({StockInsuficienteException.class, IllegalArgumentException.class})
    // public ResponseEntity<String> manejarBadRequest(RuntimeException ex) {
    //     return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    // }
}
