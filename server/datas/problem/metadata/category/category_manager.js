import Category from "./category.js";

class CategoryManager {
  constructor() {
    /** @type {Category[]} */
    this.categories = [];
  }

  /** @argument {Category} category */
  addCategory(category) {
    this.categories.push(category);
  }

  /**
   * @argument {number} id
   * @returns {Category | null}
   */
  getCategory(id) {
    return this.categories.find((category) => category.id === id) || null;
  }
}

const categoryManager = new CategoryManager();
categoryManager.addCategory(new Category(0, "Binary Exploitation"));
categoryManager.addCategory(new Category(1, "Forensics"));
categoryManager.addCategory(new Category(2, "Cryptography"));
categoryManager.addCategory(new Category(3, "Reverse Engineering"));
categoryManager.addCategory(new Category(4, "General Skills"));

export default categoryManager;