import HelperFieldDatasetInput from "./input";


/**
 *
 */
class HelperFieldDatasetNumber extends HelperFieldDatasetInput {

    /**
     * @param {string} name
     * @param {string} title
     */
    constructor(name, title) {

        super('number', name, title);
    }
}

export default HelperFieldDatasetNumber;