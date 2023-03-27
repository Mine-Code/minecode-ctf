import Category from './category/category.js';
import categoryManager from './category/category_manager.js';
import Tasks, { RawTasks } from './tasks/tasks.js';

type RawMetadata = {
  name: string,
  author: string,
  description: string,
  category: number,
  flag_hash: string,
  hints: string[],
  tasks: RawTasks,
  files: {
    [key: string]: string
  }
};

export default class Metadata {
  name: string;
  author: string;
  description: string;
  category: Category;
  flag_hash: string;
  hints: string[];
  public tasks: Tasks;
  files: { [key: string]: string; };

  constructor(problem_path: string, obj: RawMetadata) {
    this.name = obj.name; if (!this.name) {
      throw new Error("Problem name is not specified or empty");
    }

    this.author = obj.author;
    if (!this.author) {
      throw new Error("Problem author is not specified or empty");
    }

    this.description = obj.description;
    if (!this.description && obj.description !== "") {
      console.log(obj);
      throw new Error("Problem description is not specified or empty");
    }

    if (!obj.category && obj.category !== 0) {
      console.log(obj)
      throw new Error("Problem category is not specified or empty");
    }
    const category = categoryManager.getCategory(obj.category);
    if (category === null) {
      throw new Error(`Category ${obj.category} not found`);
    }
    this.category = category;

    this.flag_hash = obj.flag_hash;
    if (!this.flag_hash) {
      throw new Error("Problem flag hash is not specified or empty");
    }

    this.hints = obj.hints;
    if (!this.hints) {
      throw new Error("Problem hints are not specified or empty");
    }

    this.tasks = new Tasks(problem_path, obj.tasks);
    if (!this.tasks) {
      throw new Error("Problem tasks are not specified or empty");
    }

    this.files = obj.files;
    if (!this.files) {
      throw new Error("Problem files are not specified or empty");
    }
  }
};