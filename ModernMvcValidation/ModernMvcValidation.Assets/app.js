var $2K9WE$zod = require("zod");

function $1fc979e1244e0595$export$67f7d9d7d20e71af(validator) {
    return function() {
        const result = validator.validate();
        const message = document.querySelector(`[data-valmsg-for="${validator.rules.name}"]`);
        message?.replaceChildren();
        if (result.length === 0) return false;
        else {
            message?.append(result[0]);
            return true;
        }
    };
}


function $1c228307971ee708$export$826a84970f4c98e0(form) {
    let result = [];
    // get all inputs in form
    const inputs = Array.from(form.getElementsByTagName("input"));
    // iterate over each input
    for (const input of inputs){
        if (input.dataset["val"] !== "true") continue;
        let rules = {
            context: {
                get value () {
                    return input.value;
                }
            },
            name: input.name,
            changeSources: [
                input.name
            ],
            type: $1c228307971ee708$var$getRuleType(input)
        };
        if (input.dataset["valRequired"]) rules.required = {
            message: input.dataset["valRequired"]
        };
        if (input.dataset["valLength"]) rules["length"] = {
            parameters: {
                max: input.dataset["valLengthMax"],
                min: input.dataset["valLengthMin"]
            },
            message: input.dataset["valLength"]
        };
        if (input.dataset["valRange"]) rules["range"] = {
            parameters: {
                max: input.dataset["valRangeMax"],
                min: input.dataset["valRangeMin"]
            },
            message: input.dataset["valRange"]
        };
        if (input.dataset["valEqualto"]) {
            const other = input.name.substring(0, input.name.lastIndexOf(".")) + input.dataset["valEqualtoOther"]?.substring(1);
            rules["compare"] = {
                parameters: {
                    other: other
                },
                message: input.dataset["valEqualto"]
            };
            rules.changeSources.push(other);
            Object.defineProperty(rules.context, "other", {
                get: function() {
                    var element = form.elements.namedItem(other);
                    if (element instanceof HTMLInputElement) return element.value;
                },
                enumerable: true
            });
        }
        if (input.dataset["valRegex"]) rules["regex"] = {
            parameters: {
                pattern: input.dataset["valRegexPattern"]
            },
            message: input.dataset["valRegex"]
        };
        if (input.dataset["valPhone"]) rules["phone"] = {
            message: input.dataset["valPhone"]
        };
        if (input.dataset["valUrl"]) rules["url"] = {
            message: input.dataset["valUrl"]
        };
        if (input.dataset["valEmail"]) rules["email"] = {
            message: input.dataset["valEmail"]
        };
        result.push(rules);
    }
    return result;
}
function $1c228307971ee708$var$getRuleType(input) {
    if (input.type === "button" || input.type === "checkbox" || input.type === "color" || input.type === "email" || input.type === "file" || input.type === "hidden" || input.type === "image" || input.type === "month" || input.type === "password" || input.type === "radio" || input.type === "reset" || input.type === "search" || input.type === "submit" || input.type === "tel" || input.type === "text" || input.type === "time" || input.type === "url" || input.type === "week") return "string";
    if (input.type === "date" || input.type === "datetime-local") return "date";
    if (input.type === "number" || input.type === "range") return "number";
    throw new Error("Unknown input type");
}



function $4ec800d34f99d1b1$export$9a4b8a3ca30b6002(rules) {
    let valueValidator = $4ec800d34f99d1b1$var$getInitialValidator(rules);
    if (rules.required) valueValidator = (0, $2K9WE$zod.z).string().min(1, rules.required.message);
    if (rules.regex) {
        if (valueValidator instanceof (0, $2K9WE$zod.ZodString)) valueValidator = valueValidator.regex(new RegExp(rules.regex.parameters?.pattern), {
            message: rules.regex.message
        });
        else throw new Error("Invalid valueValidator type.");
    }
    if (rules.url) {
        if (valueValidator instanceof (0, $2K9WE$zod.ZodString)) valueValidator = valueValidator.url({
            message: rules.url.message
        });
        else throw new Error("Invalid valueValidator type.");
    }
    if (rules.email) {
        if (valueValidator instanceof (0, $2K9WE$zod.ZodString)) valueValidator = valueValidator.email({
            message: rules.email.message
        });
        else throw new Error("Invalid valueValidator type.");
    }
    if (rules.phone) {
        if (valueValidator instanceof (0, $2K9WE$zod.ZodString)) valueValidator = valueValidator.regex(/^\+?[0-9\-\.\(\)]+((ext\.|ext|x)[0-9]+)?$/, {
            message: rules.phone.message
        });
        else throw new Error("Invalid valueValidator type.");
    }
    if (rules.range) {
        const min = (0, $2K9WE$zod.z).coerce.number().optional().parse(rules.range.parameters?.min);
        const max = (0, $2K9WE$zod.z).coerce.number().optional().parse(rules.range.parameters?.max);
        const numberValidator = valueValidator;
        if (min && max) valueValidator = numberValidator.min(min, {
            message: rules.range.message
        }).max(max, {
            message: rules.range.message
        });
        else if (min) valueValidator = numberValidator.max(min, {
            message: rules.range.message
        });
        else if (max) valueValidator = numberValidator.max(max, {
            message: rules.range.message
        });
    }
    if (rules.length) {
        const min = (0, $2K9WE$zod.z).coerce.number().optional().parse(rules.length.parameters?.min);
        const max = (0, $2K9WE$zod.z).coerce.number().optional().parse(rules.length.parameters?.max);
        const numberValidator = valueValidator;
        if (min && max) valueValidator = numberValidator.min(min, {
            message: rules.length.message
        }).max(max, {
            message: rules.length.message
        });
        else if (min) valueValidator = numberValidator.min(min, {
            message: rules.length.message
        });
        else if (max) valueValidator = numberValidator.max(max, {
            message: rules.length.message
        });
    }
    const objectValidator = !rules.compare ? (0, $2K9WE$zod.z).object({
        value: valueValidator
    }) : (0, $2K9WE$zod.z).object({
        value: valueValidator,
        other: (0, $2K9WE$zod.z).string()
    }).refine((val)=>{
        return val.value === val.other;
    }, {
        message: rules.compare.message
    });
    return {
        validate: ()=>{
            const result = objectValidator.safeParse(rules.context);
            if (result.success) return [];
            else {
                const formatted = result.error.errors.map((e)=>e.message);
                return formatted;
            }
        },
        rules: rules
    };
}
function $4ec800d34f99d1b1$var$getInitialValidator(rules) {
    switch(rules.type){
        case "string":
            return (0, $2K9WE$zod.z).string();
        case "number":
            return (0, $2K9WE$zod.z).coerce.number();
        case "boolean":
            return (0, $2K9WE$zod.z).coerce.boolean();
        case "date":
            return (0, $2K9WE$zod.z).coerce.date();
        default:
            return (0, $2K9WE$zod.z).any();
    }
}


const $882b6d93070905b3$var$forms = document.forms;
// Look at all the forms in the page
for (const form of $882b6d93070905b3$var$forms){
    // Discover the set of rules for each form
    const rules = (0, $1c228307971ee708$export$826a84970f4c98e0)(form);
    const reporters = [];
    // Create and attach a validator that updates the markup on any input change
    for (const rule of rules){
        const validator = (0, $4ec800d34f99d1b1$export$9a4b8a3ca30b6002)(rule);
        const reporter = (0, $1fc979e1244e0595$export$67f7d9d7d20e71af)(validator);
        reporters.push(reporter);
        // Attach the event to all the relevant input elements that might trigger it
        for (const source of rule.changeSources){
            const input = form.elements.namedItem(source);
            input.addEventListener("input", (event)=>{
                reporter();
            });
            input.addEventListener("change", (event)=>{
                reporter();
            });
        }
    }
    // Attach to the form submit event and prevent it if any validator reported an error
    form.addEventListener("submit", (event)=>{
        for (const reporter of reporters)if (reporter()) // If the reporter reported an error, prevent form submission.
        event.preventDefault();
    });
}


//# sourceMappingURL=app.js.map
