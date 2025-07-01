import HelperFieldDatasetInput from "./input";


/**
 *
 */
class HelperFieldDatasetDateWeek extends HelperFieldDatasetInput {

    /**
     * @param {string} name
     * @param {string} title
     */
    constructor(name, title) {

        super('week', name, title);
    }
}

export default HelperFieldDatasetDateWeek;