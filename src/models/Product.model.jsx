export const createProduct = (product) => {
  return {
    id: product._id,
    
  
    name: product.name?.en || "",
    nameAr: product.name?.ar || "",
    

    price: Number(product.price) || 0,
    discount: Number(product.discounts) || 0,
    finalPrice:
      product.price && product.discounts
        ? product.price - (product.price * product.discounts) / 100
        : Number(product.price) || 0,
    
  
    images: Array.isArray(product.imageUrls) ? product.imageUrls : [],
    image: Array.isArray(product.imageUrls) && product.imageUrls.length > 0
      ? product.imageUrls[0]
      : "",
    
  
    description: product.description?.en || "",
    descriptionAr: product.description?.ar || "",
    

    subcategory: product.subcategoryId?.name?.en || "",
    subcategoryId: typeof product.subcategoryId === 'string' 
      ? product.subcategoryId 
      : product.subcategoryId?._id || "",
    category: product.subcategoryId?.categoryId?.name?.en || "",
    
    
    seller: product.sellerId?.name || product.sellerId || "",
    

    rating:
      Array.isArray(product.reviews) && product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / product.reviews.length
        : 0,
    
   
    brand: product.brand || "",
    stock: Number(product.stock) || 0,
    isVerified: !!product.isVerified,
    createdAt: product.createdAt,
  };
};

