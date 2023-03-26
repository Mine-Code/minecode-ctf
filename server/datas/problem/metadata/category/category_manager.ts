import Category from "./category.js";

class CategoryManager {
  categories: Category[];
  constructor() {
    this.categories = [];
  }

  addCategory(category: Category) {
    this.categories.push(category);
  }

  getCategory(id: number): Category | null {
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