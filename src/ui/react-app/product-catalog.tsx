/**
 * Product Catalog - Manage products and services
 */

import React, { useState, useEffect } from 'react';

export default function ProductCatalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [showArchived, setShowArchived] = useState(false);

  const filteredProducts = products.filter((product) => {
    if (typeFilter !== 'ALL' && product.type !== typeFilter) return false;
    if (!showArchived && product.isArchived) return false;
    return true;
  });

  return (
    <div className="product-catalog">
      <header>
        <h1>Products & Services</h1>
        <div className="controls">
          <select value={typeFilter} onChange={(e) => setTypeFilter((e.target as HTMLSelectElement).value)}>
            <option value="ALL">All Types</option>
            <option value="PRODUCT">Products</option>
            <option value="SERVICE">Services</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived((e.target as HTMLInputElement).checked)}
            />
            Show Archived
          </label>
          <button className="primary">+ New Product/Service</button>
        </div>
      </header>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-type">
              <span className={`badge ${product.type.toLowerCase()}`}>{product.type}</span>
              {product.isArchived && <span className="badge archived">Archived</span>}
            </div>
            <h3>{product.name}</h3>
            <p className="product-description">{product.description || 'No description'}</p>
            <div className="product-price">
              ${product.unitPrice?.amount.toFixed(2) || '0.00'} {product.unitPrice?.currency}
            </div>
            <div className="product-actions">
              <button>Edit</button>
              {!product.isArchived && <button>Archive</button>}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-state">No products or services found</div>
      )}
    </div>
  );
}
