export default class Metadata {
    name;
    author;
    description;
    flag_hash;
    hints;
    files;
    constructor(problem_path, _obj) {
        this.name = "Dummy Name";
        this.author = "Dummy Author";
        this.description = "Dummy Description";
        this.flag_hash = "Dummy Flag Hash";
        this.hints = [];
        this.files = {};
    }
}
