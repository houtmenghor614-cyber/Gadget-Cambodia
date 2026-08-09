import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import ErrorMessage from '../common/ErrorMessage';
import { FaArrowLeft, FaArrowRight, FaTh, FaList } from 'react-icons/fa';

const ProductList = ({ 
  products, 
  loading, 
  error, 
  onRetry,
  title,
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showCategory = false
}) => {
  const [viewMode, setViewMode] = useState('grid');

  if (loading) {
    return (
      <div>
        {title && <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ErrorMessage message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  const gridClasses = viewMode === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8'
    : 'space-y-6';

  return (
    <div>
      {/* Header with title and view controls */}
      <div className="flex items-center justify-between mb-6">
        {title && (
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        )}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 mr-2">
            {products.length} products
          </span>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === 'grid' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-label="Grid view"
          >
            <FaTh />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === 'list' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-label="List view"
          >
            <FaList />
          </button>
        </div>
      </div>

      {/* Product Grid/List */}
      <div className={gridClasses}>
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            viewMode={viewMode}
            showCategory={showCategory}
          />
        ))}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaArrowLeft className="w-4 h-4" />
          </button>
          
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            if (
              page === 1 ||
              page === totalPages ||
              Math.abs(page - currentPage) <= 2
            ) {
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            }
            if (page === currentPage - 3 || page === currentPage + 3) {
              return <span key={page} className="px-2">...</span>;
            }
            return null;
          })}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;