import React from "react";

const ProductDetailsModal = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-4xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto animate-slide-up">
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-white border-b px-4 py-4 sm:px-6 flex justify-between items-center z-10 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Images */}
            <div className="space-y-3">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((img, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition">
                      <img
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                {product.nameAr && (
                  <p className="text-base sm:text-lg text-gray-600">{product.nameAr}</p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 flex-wrap">
                {product.discount > 0 ? (
                  <>
                    <span className="text-2xl sm:text-3xl font-bold text-green-600">
                      ${product.finalPrice.toFixed(2)}
                    </span>
                    <span className="text-base sm:text-lg line-through text-gray-400">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{product.discount}%
                    </span>
                  </>
                ) : (
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                <InfoItem label="Category" value={product.category} />
                {product.subcategory && (
                  <InfoItem label="Subcategory" value={product.subcategory} />
                )}
                {product.brand && <InfoItem label="Brand" value={product.brand} />}
                {product.seller && <InfoItem label="Seller" value={product.seller} />}
                <InfoItem
                  label="Stock"
                  value={product.stock > 0 ? `${product.stock} pcs` : "Out of stock"}
                  valueClass={product.stock > 0 ? "text-green-600" : "text-red-600"}
                />
                {product.rating > 0 && (
                  <div>
                    <p className="text-gray-600 mb-1">Rating:</p>
                    <p className="font-semibold flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span>{product.rating.toFixed(1)}</span>
                    </p>
                  </div>
                )}
              </div>

              {product.isVerified && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 font-medium flex items-center gap-2 text-sm">
                    <span>✓</span>
                    <span>Verified Product</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-6 border-t pt-6">
              <h4 className="text-base sm:text-lg font-bold mb-3">Description:</h4>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-4 py-4 sm:px-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, valueClass = "text-gray-900" }) => (
  <div>
    <p className="text-gray-600 mb-1">{label}:</p>
    <p className={`font-semibold ${valueClass}`}>{value}</p>
  </div>
);

export default ProductDetailsModal;
