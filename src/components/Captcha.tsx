import React, { useEffect, useRef, useState, useCallback } from "react";
import './styles/Captcha.css';

interface Vector2 {
    x: number,
    y: number
}

interface CaptchaProps {
    onChange?: (captcha: string) => void,
    className?: string
}

const Captcha: React.FC<CaptchaProps> = ({ onChange, className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generateCaptchaText = useCallback(() => {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
    }, []);

    const [text, setText] = useState(generateCaptchaText);

    useEffect(() => {
        onChange?.(text);
    }, [text, onChange]);

    const Lerp = (start: number, end: number, time: number): number => start * (1 - time) + end * time;

    const drawCaptcha = useCallback(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (canvas && context) {
            canvas.width = parseInt(window.getComputedStyle(canvas).width);
            canvas.height = parseInt(window.getComputedStyle(canvas).height);

            context.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < 20; i++) {
                context.beginPath();
                context.arc(
                    canvas.width * Math.random(),
                    canvas.height * Math.random(),
                    Math.random() * canvas.height * 0.5,
                    0,
                    2 * Math.PI
                )
                context.fillStyle = `#${Math.round(Math.random() * 16**3).toString(16).padStart(3, '0')}4`;
                context.fill();
            }

            context.lineWidth = 1;
            for (let i = 0; i < Math.random() * 5 + 3; i++) {
                context.beginPath();

                const positions: Vector2[] = Array.from({ length: Math.random() * 5 + 2 }, () => ({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                }));

                context.moveTo(positions[0].x, positions[0].y);
                
                for (let i = 0; i < positions.length - 1; i++) {
                    const startPos = positions[i];
                    const endPos = positions[i + 1];
        
                    for (let t = 0; t <= 1; t += 1 / (Math.random() * 10 + 1)) {
                        context.lineTo(
                            Lerp(startPos.x, endPos.x, t) + Math.random() * canvas.width * 0.2,
                            Lerp(startPos.y, endPos.y, t) + Math.random() * canvas.height * 0.2
                        );
                    }
                }

                context.strokeStyle = `#${Math.round(Math.random() * 16**3).toString(16).padStart(3, '0')}`;
                context.stroke();
            }

            const charWidth = canvas.width / text.length;
            context.lineWidth = 0.2;

            [...text].forEach((char, i) => {
                context.strokeStyle = window.getComputedStyle(canvas).stroke;
                context.font = "italic 3em comic sans";
                context.textAlign = "center";

                context.save();
                context.translate(
                    i * charWidth + charWidth / 2 + (Math.random() - 0.5) * 20,
                    canvas.height * Math.random() * .6 + canvas.height * 0.4
                );
                context.rotate((Math.random() - 0.5) * 1);
                context.strokeText(char, 0, 0);
                context.restore();
            });
        }
    }, [text]);

    useEffect(() => {
        drawCaptcha();
    }, [text, drawCaptcha]);

    const refreshCaptcha = () => {
        setText(generateCaptchaText());
    }

    return (
        <div id="captcha" className={className}>
            <canvas ref={canvasRef} />
            <button onClick={refreshCaptcha}>↺</button>
        </div>
    )
}

export default React.memo(Captcha);
