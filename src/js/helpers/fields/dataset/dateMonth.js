import HelperFieldDatasetInput from "./input";


/**
 *
 */
class HelperFieldDatasetDateMonth extends HelperFieldDatasetInput {

    /**
     * @param {string} name
     * @param {string} title
     */
    constructor(name, title) {

        super('month', name, title);
    }
}

export default HelperFieldDatasetDateMonth;