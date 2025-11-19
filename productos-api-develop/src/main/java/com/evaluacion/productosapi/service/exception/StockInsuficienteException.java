package com.evaluacion.productosapi.service.exception;

public class StockInsuficienteException extends RuntimeException {

    public StockInsuficienteException(Long id) {
        super("Stock insuficiente para el producto con id " + id);
    }
}
