import { ZodNumber, ZodString, ZodTypeAny, z } from "zod";
import { RuleSet } from "./rules"

export type RuleSetValidator = {
    validate: () => string[];
    rules: RuleSet;
}

export function createValidator(rules: RuleSet): RuleSetValidator {
    let valueValidator: ZodTypeAny = getInitialValidator(rules);
    if (rules.required) {
        valueValidator = z.string().min(1, rules.required.message);
    }

    if (rules.regex) {
        if (valueValidator instanceof ZodString) {
            valueValidator = valueValidator.regex(new RegExp(rules.regex.parameters?.pattern!), { message: rules.regex.message });
        } else {
            throw new Error('Invalid valueValidator type.');
        }
    }

    if (rules.url) {
        if (valueValidator instanceof ZodString) {
            valueValidator = valueValidator.url({ message: rules.url.message });
        } else {
            throw new Error('Invalid valueValidator type.');
        }
    }

    if (rules.email) {
        if (valueValidator instanceof ZodString) {
            valueValidator = valueValidator.email({ message: rules.email.message });
        } else {
            throw new Error('Invalid valueValidator type.');
        }
    }

    if (rules.phone) {
        if (valueValidator instanceof ZodString) {
            valueValidator = valueValidator.regex(/^\+?[0-9\-\.\(\)]+((ext\.|ext|x)[0-9]+)?$/, { message: rules.phone.message });
        } else {
            throw new Error('Invalid valueValidator type.');
        }
    }

    if (rules.range) {
        const min = z.coerce.number().optional().parse(rules.range.parameters?.min);
        const max = z.coerce.number().optional().parse(rules.range.parameters?.max);
        const numberValidator = valueValidator as ZodNumber;
        if (min && max) {
            valueValidator = numberValidator.min(min, { message: rules.range.message }).max(max, { message: rules.range.message });
        } else if (min) {
            valueValidator = numberValidator.max(min, { message: rules.range.message });
        } else if (max) {
            valueValidator = numberValidator.max(max, { message: rules.range.message });
        }
    }

    if (rules.length) {
        const min = z.coerce.number().optional().parse(rules.length.parameters?.min);
        const max = z.coerce.number().optional().parse(rules.length.parameters?.max);
        const numberValidator = valueValidator as ZodNumber;
        if (min && max) {
            valueValidator = numberValidator.min(min, { message: rules.length.message }).max(max, { message: rules.length.message });
        } else if (min) {
            valueValidator = numberValidator.min(min, { message: rules.length.message });
        } else if (max) {
            valueValidator = numberValidator.max(max, { message: rules.length.message });
        }
    }

    const objectValidator = !rules.compare ?
        z.object({
            value: valueValidator
        }) :
        z.object({
            value: valueValidator,
            other: z.string()
        }).refine(val => {
            return val.value === val.other;
        }, { message: rules.compare.message });

    return {
        validate: () => {
            const result = objectValidator!.safeParse(rules.context);
            if (result.success) {
                return [];
            } else {
                const formatted = result.error.errors.map(e => e.message);
                return formatted;
            }
        },
        rules: rules
    }
}

function getInitialValidator(rules: RuleSet): z.ZodTypeAny {
    switch (rules.type) {
        case 'string':
            return z.string();
        case 'number':
            return z.coerce.number();
        case 'boolean':
            return z.coerce.boolean();
        case 'date':
            return z.coerce.date();
        default:
            return z.any();
    }
}