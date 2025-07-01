import HelperFieldDatasetInput from "./input";


/**
 *
 */
class HelperFieldDatasetDatetime extends HelperFieldDatasetInput {

    /**
     * @param {string} name
     * @param {string} title
     */
    constructor(name, title) {

        super('datetime-local', name, title);
    }
}

export default HelperFieldDatasetDatetime;