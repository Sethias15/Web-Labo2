import Model from './model.js';

export default class Math extends Model {
    constructor() {
        super();

        this.addField('Title', 'string');
        this.addField('Url', 'url');
        this.addField('Error', 'string');
              
        this.setKey("Title");
    }
}