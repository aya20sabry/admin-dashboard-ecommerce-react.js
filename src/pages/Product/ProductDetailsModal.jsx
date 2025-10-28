import React from "react";

const ProductDetailsModal = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 z-modal bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="bg-white w-full sm:max-w-4xl sm:rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
          <h2
            id="modal-title"
            className="text-lg sm:text-xl font-semibold text-gray-900"
          >
            Product Details
          </h2>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center min-h-touch min-w-touch p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 tap-highlight-transparent touch-manipulation"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
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
                    <div
                      key={i}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition"
                    >
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
                  <p className="text-base sm:text-lg text-gray-600">
                    {product.nameAr}
                  </p>
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
                {product.brand && (
                  <InfoItem label="Brand" value={product.brand} />
                )}
                {product.seller && (
                  <InfoItem label="Seller" value={product.seller} />
                )}
                <InfoItem
                  label="Stock"
                  value={
                    product.stock > 0 ? `${product.stock} pcs` : "Out of stock"
                  }
                  valueClass={
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }
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
              <h4 className="text-base sm:text-lg font-bold mb-3">
                Description:
              </h4>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 py-4 sm:px-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-gray-500"
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
