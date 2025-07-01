import HelperFieldDatasetInput from "./input";


/**
 *
 */
class HelperFieldDatasetText extends HelperFieldDatasetInput {

    /**
     * @param {string} name
     * @param {string} title
     */
    constructor(name, title) {

        super('text', name, title);
    }
}

export default HelperFieldDatasetText;