import { RuleSetValidator } from "./validation";

export function createReporter(validator: RuleSetValidator) {
    return function () {
        const result = validator.validate();
        const message = document.querySelector(`[data-valmsg-for="${validator.rules.name}"]`);
        message?.replaceChildren();
        if (result.length === 0) {
            return false;
        }
        else {
            message?.append(result[0]);
            return true;
        }
    }
}