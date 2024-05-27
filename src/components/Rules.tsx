import { useCurrentEditor } from "@tiptap/react";
import React, { ReactNode, useEffect, useState } from "react";
import GraphemeSplitter from "grapheme-splitter";
import RulePanel from "./RulePanel";
import './styles/Rules.css';
import Captcha from "./Captcha";

interface RuleItem {
    number: number;
    description: ReactNode,
    check: () => boolean
}

const Rules: React.FC = () => {
    const editor = useCurrentEditor().editor;
    const splitter = new GraphemeSplitter();

    const [captchaText, setCaptchaText] = useState('');

    const passwordText = () => editor?.getText() ?? '';

    const romanNumerals: {[key: string]: number} = {
        'M': 1000,
        'D': 500,
        'C': 100,
        'L': 50,
        'X': 10,
        'V': 5,
        'I': 1
    }

    const rules: RuleItem[] = [
        {
            number: 1,
            description: "Your password must be at least 5 characters.",
            check: () => splitter.splitGraphemes(passwordText()).length >= 5
        }, {
            number: 2,
            description: "Your password must contain a number.",
            check: () => /\d/.test(passwordText())
        }, {
            number: 3,
            description: "Your password must include an uppercase letter.",
            check: () => /[A-Z]/.test(passwordText())
        }, {
            number: 4,
            description: "Your password must have a special character.",
            check: () => /[^0-9a-z]/i.test(passwordText())
        }, {
            number: 5,
            description: "The digits must sum to 25.",
            check: () => passwordText().match(/[0-9]/g)?.reduce((sum, digit) => sum + parseInt(digit), 0) == 25
        }, {
            number: 6,
            description: "You must include a month in the password.",
            check: () => /january|february|march|april|may|june|july|august|september|october|november|december/i.test(passwordText())
        }, {
            number: 7,
            description: "Your password must have a roman numeral.",
            check: () => /M|D|C|L|X|V|I/.test(passwordText())
        }, {
            number: 8,
            description: "The roman numerals must multiply to 35",
            check: () => 
                (passwordText()
                    .match(/M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})/g)?.filter(Boolean)
                    .reduce((product, numeral) => 
                        product * [...numeral].reduce((sum, char, i, arr) => 
                            sum + (romanNumerals[char] < (romanNumerals[arr[i + 1]] ?? 0) ? -romanNumerals[char] : romanNumerals[char])
                        , 0)
                    , 1) ?? 1) == 35
        }, {
            number: 9,
            description: [
                "Your password must include this CAPTCHA:",
                <Captcha key="captcha" onChange={setCaptchaText} className="captcha"/>
            ],
            check: () => passwordText().includes(captchaText)
        }
    ]

    const [ruleReached, setRuleReached] = useState(1);

    useEffect(() => {
        const handleUpdate = () => {
            let maxReached = 1;
            for (const rule of rules) {
                if (rule.check()) {
                    maxReached = rule.number + 1;
                } else {
                    break;
                }
            }
            setRuleReached(oldRuleReached => Math.max(oldRuleReached, maxReached));
        };

        editor?.on('update', handleUpdate);

        return () => {
            editor?.off('update', handleUpdate);
        };
    }, [editor, ruleReached]);

    return (
        <ul id="rules">
            {rules
                .filter(rule => ruleReached > rule.number)
                .sort((previousRule, currentRule) =>
                    Number(currentRule.check()) - Number(previousRule.check()
                ))
                .map(rule => (
                    <li key={rule.number}>
                        <RulePanel
                            number={rule.number}
                            className={rule.check() ? 'passed' : 'failed'}
                        >
                            {rule.description}
                        </RulePanel>
                    </li>
                ))}
        </ul>
    )
}

export default Rules;
