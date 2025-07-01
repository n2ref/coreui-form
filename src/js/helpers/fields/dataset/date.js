import HelperFieldDatasetInput from "./input";


/**
 *
 */
class HelperFieldDatasetDate extends HelperFieldDatasetInput {

    /**
     * @param {string} name
     * @param {string} title
     */
    constructor(name, title) {

        super('date', name, title);
    }
}

export default HelperFieldDatasetDate;