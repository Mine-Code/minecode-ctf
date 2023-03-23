import categoryManager from './category/category_manager.js';
import Tasks from './tasks/tasks.js';

export default class Metadata {
  /** @argument {string} problem_path */
  /** @argument {object} obj */
  constructor(problem_path, obj) {
    /** @type {String} */
    this.name = obj.name;

    /** @type {String} */
    this.author = obj.author;

    /** @type {String} */
    this.description = obj.description;

    this.category = categoryManager.getCategory(obj.category);

    /** @type {String} */
    this.flag_hash = obj.flag_hash;

    /** @type {String[]} */
    this.hints = obj.hints;

    /** @type {Tasks} */
    this.tasks = new Tasks(problem_path, obj.tasks);

    /** @type {{[key: string]: string}} */
    this.files = obj.files;
  }
};