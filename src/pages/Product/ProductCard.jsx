import React from "react";

const ProductCard = ({ product, onViewDetails, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1 border border-gray-100">
      {/* صورة المنتج */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* محتوى الكارد */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base md:text-lg mb-3 line-clamp-2 text-center">
          {product.name}
        </h3>

        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors duration-200"
          >
            👁️ 
          </button>
          <button
            onClick={() => onEdit(product)}
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition-colors duration-200"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg transition-colors duration-200"
          >
            🗑️ 
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
