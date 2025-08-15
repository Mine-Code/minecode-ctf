export default class Metadata {
  name: string;
  author: string;
  description: string;
  flag_hash: string;
  hints: string[];
  files: { [key: string]: string };

  constructor(problem_path: string, _obj: any) {
    this.name = "Dummy Name";
    this.author = "Dummy Author";
    this.description = "Dummy Description";
    this.flag_hash = "Dummy Flag Hash";
    this.hints = [];
    this.files = {};
  }
}
