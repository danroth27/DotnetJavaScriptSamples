
type RuleDefinition = {
    message: string,
    parameters?: { [key: string]: string | undefined }
}

export type RuleSet = {
    context: { [key: string]: string },
    name: string,
    changeSources: string[],
    type: 'string' | 'number' | 'boolean' | 'date',
    required?: RuleDefinition,
    length?: RuleDefinition,
    regex?: RuleDefinition,
    compare?: RuleDefinition,
    range?: RuleDefinition,
    phone?: RuleDefinition,
    email?: RuleDefinition,
    url?: RuleDefinition,
}

export function createRules(form: HTMLFormElement): RuleSet[] {

    let result = [];

    // get all inputs in form
    const inputs = Array.from(form.getElementsByTagName('input'));

    // iterate over each input
    for (const input of inputs) {
        if (input.dataset['val'] !== 'true') {
            continue;
        }

        let rules: RuleSet = {
            context: {
                get value() {
                    return input.value;
                }
            },
            name: input.name,
            changeSources: [input.name],
            type: getRuleType(input)
        };

        if (input.dataset['valRequired']) {
            rules.required = {
                message: input.dataset['valRequired']
            };
        }
        if (input.dataset['valLength']) {
            rules['length'] = {
                parameters: {
                    max: input.dataset['valLengthMax'],
                    min: input.dataset['valLengthMin'],
                },
                message: input.dataset['valLength']
            };
        }
        if (input.dataset['valRange']) {
            rules['range'] = {
                parameters: {
                    max: input.dataset['valRangeMax'],
                    min: input.dataset['valRangeMin'],
                },
                message: input.dataset['valRange']
            };
        }
        if (input.dataset['valEqualto']) {
            const other = input.name.substring(0, input.name.lastIndexOf('.')) + input.dataset['valEqualtoOther']?.substring(1);
            rules['compare'] = {
                parameters: {
                    other: other,
                },
                message: input.dataset['valEqualto']
            };
            rules.changeSources.push(other);
            Object.defineProperty(rules.context, 'other', {
                get: function () {
                    var element = form.elements.namedItem(other);
                    if (element instanceof HTMLInputElement) {
                        return element.value;
                    }
                },
                enumerable: true
            });
        }
        if (input.dataset['valRegex']) {
            rules['regex'] = {
                parameters: {
                    pattern: input.dataset['valRegexPattern'],
                },
                message: input.dataset['valRegex']
            };
        }
        if (input.dataset['valPhone']) {
            rules['phone'] = {
                message: input.dataset['valPhone']
            };
        }
        if (input.dataset['valUrl']) {
            rules['url'] = {
                message: input.dataset['valUrl']
            };
        }
        if (input.dataset['valEmail']) {
            rules['email'] = {
                message: input.dataset['valEmail']
            };
        }

        result.push(rules);
    }

    return result;
}

function getRuleType(input: HTMLInputElement): "string" | "number" | "date" {
    if (input.type === 'button' ||
        input.type === 'checkbox' ||
        input.type === 'color' ||
        input.type === 'email' ||
        input.type === 'file' ||
        input.type === 'hidden' ||
        input.type === 'image' ||
        input.type === 'month' ||
        input.type === 'password' ||
        input.type === 'radio' ||
        input.type === 'reset' ||
        input.type === 'search' ||
        input.type === 'submit' ||
        input.type === 'tel' ||
        input.type === 'text' ||
        input.type === 'time' ||
        input.type === 'url' ||
        input.type === 'week') {
        return 'string';
    }
    if (input.type === 'date' ||
        input.type === 'datetime-local') {
        return 'date';
    }
    if (input.type === 'number' ||
        input.type === 'range') {
        return 'number';
    }

    throw new Error('Unknown input type');
}
