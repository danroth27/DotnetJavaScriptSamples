import { createReporter } from './reporter';
import { createRules } from './rules';
import { createValidator } from './validation';

const forms = document.forms;

// Look at all the forms in the page
for (const form of forms) {

    // Discover the set of rules for each form
    const rules = createRules(form);

    const reporters: Array<() => boolean> = [];

    // Create and attach a validator that updates the markup on any input change
    for (const rule of rules) {
        const validator = createValidator(rule);
        const reporter = createReporter(validator);
        reporters.push(reporter);

        // Attach the event to all the relevant input elements that might trigger it
        for (const source of rule.changeSources) {
            const input = form.elements.namedItem(source) as HTMLInputElement;
            input.addEventListener('input', (event) => {
                reporter();
            });

            input.addEventListener('change', (event) => {
                reporter();
            });
        }
    }

    // Attach to the form submit event and prevent it if any validator reported an error
    form.addEventListener('submit', (event) => {
        for (const reporter of reporters) {
            if (reporter()) {
                // If the reporter reported an error, prevent form submission.
                event.preventDefault();
            }
        }
    });
}