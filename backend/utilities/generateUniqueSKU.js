import Product from "../models/Product.js";

export const generateUniqueSKU = async (category,productTitle) => {

  const categoryPrefix = category.substring(0, 3).toUpperCase();


  const productPrefix = productTitle.trim().replace(/[^a-zA-Z]/g, "").substring(0, 3).toUpperCase();

  let sku;
  let exists = true;

  while (exists) {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();

    sku = `${categoryPrefix}-${productPrefix}-${randomPart}`;

    exists = await Product.exists({ sku });
  }

  return sku;
};