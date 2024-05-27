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

interface RulesProps {
    setBold: (enabled: boolean) => void,
    setItalic: (enabled: boolean) => void,
    setStrikeThrough: (enabled: boolean) => void,
    setUnderline: (enabled: boolean) => void,
    setFontFamily: (enabled: boolean) => void,
    setFontSize: (enabled: boolean) => void,
    setTextColor: (enabled: boolean) => void,
    setHiglightColor: (enabled: boolean) => void
}

const Rules: React.FC<RulesProps> = (props) => {
    const editor = useCurrentEditor().editor;
    const splitter = new GraphemeSplitter();

    const [captchaText, setCaptchaText] = useState('If eMpty is coMpleted for 1 fraMe');
    const [todaysWordle, setTodaysWordle] = useState('');

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

    const atomicNumbers: { [key: string]: number } = {
        'H': 1, 'He': 2, 'Li': 3, 'Be': 4, 'B': 5, 'C': 6, 'N': 7, 'O': 8,
        'F': 9, 'Ne': 10, 'Na': 11, 'Mg': 12, 'Al': 13, 'Si': 14, 'P': 15,
        'S': 16, 'Cl': 17, 'Ar': 18, 'K': 19, 'Ca': 20, 'Sc': 21, 'Ti': 22,
        'V': 23, 'Cr': 24, 'Mn': 25, 'Fe': 26, 'Co': 27, 'Ni': 28, 'Cu': 29,
        'Zn': 30, 'Ga': 31, 'Ge': 32, 'As': 33, 'Se': 34, 'Br': 35, 'Kr': 36,
        'Rb': 37, 'Sr': 38, 'Y': 39, 'Zr': 40, 'Nb': 41, 'Mo': 42, 'Tc': 43,
        'Ru': 44, 'Rh': 45, 'Pd': 46, 'Ag': 47, 'Cd': 48, 'In': 49, 'Sn': 50,
        'Sb': 51, 'Te': 52, 'I': 53, 'Xe': 54, 'Cs': 55, 'Ba': 56, 'La': 57,
        'Ce': 58, 'Pr': 59, 'Nd': 60, 'Pm': 61, 'Sm': 62, 'Eu': 63, 'Gd': 64,
        'Tb': 65, 'Dy': 66, 'Ho': 67, 'Er': 68, 'Tm': 69, 'Yb': 70, 'Lu': 71,
        'Hf': 72, 'Ta': 73, 'W': 74, 'Re': 75, 'Os': 76, 'Ir': 77, 'Pt': 78,
        'Au': 79, 'Hg': 80, 'Tl': 81, 'Pb': 82, 'Bi': 83, 'Po': 84, 'At': 85,
        'Rn': 86, 'Fr': 87, 'Ra': 88, 'Ac': 89, 'Th': 90, 'Pa': 91, 'U': 92,
        'Np': 93, 'Pu': 94, 'Am': 95, 'Cm': 96, 'Bk': 97, 'Cf': 98, 'Es': 99,
        'Fm': 100, 'Md': 101, 'No': 102, 'Lr': 103, 'Rf': 104, 'Db': 105, 'Sg': 106,
        'Bh': 107, 'Hs': 108, 'Mt': 109, 'Ds': 110, 'Rg': 111, 'Cn': 112, 'Nh': 113,
        'Fl': 114, 'Mc': 115, 'Lv': 116, 'Ts': 117, 'Og': 118
    };

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
            check: () => new RegExp(captchaText, "i").test(passwordText())
        }, {
            number: 10,
            description: "Your password must include todays wordle answer",
            check: () => new RegExp(todaysWordle, "i").test(passwordText())
        }, {
            number: 11,
            description: "Your password must contain a 2 letter symbol from the periodic table",
            check: () => new RegExp(Object.keys(atomicNumbers).filter(key => key.length > 1).join('|')).test(passwordText())
        }
    ]

    const [ruleReached, setRuleReached] = useState(0);

    useEffect(() => {
        const date = new Date();
        fetch(`https://neal.fun/api/password-game/wordle?date=${
            [
            date.getFullYear()
                .toString()
                .padStart(2, '0'),
            (date.getMonth() + 1)
                .toString()
                .padStart(2, '0'),
            date.getDate()
                .toString()
                .padStart(2, '0')
            ].join('-')
        }`).then(responce => responce.json())
            .then(data => 
                setTodaysWordle(data.answer?.toLowerCase() ?? '')
            )

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
    }, [editor, ruleReached, captchaText]);

    useEffect(() => {
        if (ruleReached > rules.length)
            Object.values(props).forEach(fn => {
                fn(true)
            });
    }, [props, ruleReached])

    return (
        <ul id="rules">
            {rules
                .filter((_, i) => i < ruleReached)
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
                )
            )}
            
            {ruleReached > rules.length && <li key="completed">
                Thats all the current rules!
                Thanks for testing <b style={{color: "#f00"}}>❤</b>
            </li>}
        </ul>
    )
}

export default Rules;
