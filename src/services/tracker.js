import crypto from 'node:crypto';
import { readStore, writeStore } from './storage.js';
import { scrapeProduct } from './zaraScraper.js';

export function createTracker(config, botRef) {
  function listProducts() {
    return readStore(config.dataFile).products;
  }

  function saveProducts(products) {
    writeStore(config.dataFile, { products });
  }

  async function addProduct(url, chatId) {
    const snapshot = await scrapeProduct(url);
    const products = listProducts();
    const existing = products.find((p) => p.url === url);

    if (existing) {
      if (chatId && !existing.chatIds.includes(chatId)) {
        existing.chatIds.push(chatId);
      }
      saveProducts(products);
      return existing;
    }

    const product = {
      id: crypto.randomUUID(),
      ...snapshot,
      lastPrice: snapshot.price,
      chatIds: [chatId].filter(Boolean)
    };

    products.push(product);
    saveProducts(products);
    return product;
  }

  function getProductsByChatId(chatId) {
    return listProducts().filter((p) => p.chatIds.includes(chatId));
  }

  async function refreshPrices() {
    const products = listProducts();

    for (const product of products) {
      try {
        const fresh = await scrapeProduct(product.url);
        const oldPrice = product.price;

        product.name = fresh.name;
        product.image = fresh.image;
        product.currency = fresh.currency;
        product.price = fresh.price;
        product.checkedAt = fresh.checkedAt;

        if (fresh.price < oldPrice && botRef.current?.isEnabled) {
          await botRef.current.notifyPriceDrop(product, oldPrice);
        }
      } catch (error) {
        product.lastError = error.message;
      }
    }

    saveProducts(products);
    return products;
  }

  return {
    addProduct,
    refreshPrices,
    listProducts,
    getProductsByChatId
  };
}
