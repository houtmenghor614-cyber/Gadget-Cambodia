import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProducts(filters);
        setProducts(data);
        setTotalCount(data.length || 0);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const searchProducts = async (searchTerm) => {
    try {
      setLoading(true);
      const data = await productService.searchProducts(searchTerm);
      setProducts(data);
      return data;
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Failed to search products.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    filters,
    totalCount,
    updateFilters,
    clearFilters,
    searchProducts,
    setProducts,
  };
};

export default useProducts;