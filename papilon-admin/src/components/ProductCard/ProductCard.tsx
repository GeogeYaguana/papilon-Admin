import React from 'react';
import { Product } from '../../services/ProductService';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id_producto: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  // Manejo seguro de precio (string -> float -> toFixed(2))
  const price = parseFloat(product.precio || '0').toFixed(2);
  
  return (
    <div className={styles.productCard}>
      <img
        src={product.foto_url || '/img/no-image.png'}
        alt={product.nombre}
        className={styles.productImage}
      />
      <div className={styles.overlay}>
        <button className={styles.editButton} onClick={() => onEdit(product)}>
          Editar
        </button>
        <button className={styles.deleteButton} onClick={() => onDelete(product.id_producto)}>
          Eliminar
        </button>
      </div>
      <div className={styles.productInfo}>
        <h4>{product.nombre}</h4>
        <p>Precio: ${price}</p>
        {product.descuento && <p>Descuento: {product.descuento}%</p>}
      </div>
    </div>
  );
};

export default ProductCard;
