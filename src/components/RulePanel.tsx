import React, { ReactNode } from "react";
import './styles/RulePanel.css';

interface RulePanelProps {
    number: number,
    className?: string,
    children: ReactNode
}

const RulePanel: React.FC<RulePanelProps> = (props) => {
    return (
        <div id="rulePanel" className={props.className}>
            <label>
                Rule {props.number}
            </label>

            <div>
                {props.children}
            </div>
        </div>
    );
}

export default RulePanel;