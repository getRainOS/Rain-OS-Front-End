import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
  chars: string[];
}

const CHARACTERS = '01';
const MIN_SPEED = 4; 
const MAX_SPEED = 12; 
const MIN_LENGTH = 2; 
const MAX_LENGTH = 5;
const FONT_SIZE = 10; // Smaller font for higher resolution feel
const COLUMN_WIDTH = FONT_SIZE + 4;

const Rainfall: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme(); 

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let drops: Drop[] = [];
        let columns = 0;

        const initialize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            // Handle DPI for crispness on Retina screens
            const dpr = window.devicePixelRatio || 1;
            canvas.width = parent.clientWidth * dpr;
            canvas.height = parent.clientHeight * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${parent.clientWidth}px`;
            canvas.style.height = `${parent.clientHeight}px`;
            
            columns = Math.ceil(parent.clientWidth / COLUMN_WIDTH);
            drops = [];
            for (let i = 0; i < columns; i++) {
                // Very sparse init - Reduced by 50% from 0.9975
                if (Math.random() > 0.99875) { 
                    drops.push(createDrop(i, Math.random() * parent.clientHeight));
                }
            }
        };

        const createDrop = (columnIndex: number, startY: number = 0): Drop => {
            const length = Math.floor(Math.random() * (MAX_LENGTH - MIN_LENGTH + 1)) + MIN_LENGTH;
            // Start well above screen to drift in
            const y = startY || -150 - (Math.random() * 200); 
            
            return {
                x: columnIndex * COLUMN_WIDTH,
                y: y,
                length: length,
                speed: Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED,
                chars: Array.from({ length }, () => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]),
            };
        };

        const draw = () => {
            animationFrameId = requestAnimationFrame(draw);
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);

            // Clear background - completely transparent to blend with parent bg
            ctx.clearRect(0, 0, width, height);

            ctx.font = `${FONT_SIZE}px "Roboto Mono", monospace`;
            ctx.textAlign = 'center';

            for (let i = 0; i < drops.length; i++) {
                const drop = drops[i];
                
                for (let j = 0; j < drop.chars.length; j++) {
                    const char = drop.chars[j];
                    const yPos = drop.y + j * (FONT_SIZE + 2);
                    
                    if (yPos > -20 && yPos < height + 20) {
                        // Head of the drop
                        if (j === drop.chars.length - 1) {
                            if (theme === 'dark') {
                                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // Crisp white head
                            } else {
                                ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'; // Dark slate head
                            }
                        } else {
                            // Tail - subtle opacity for texture feel
                            const opacity = (0.05 + (j / drop.chars.length) * 0.15).toFixed(2);
                            if (theme === 'dark') {
                                ctx.fillStyle = `rgba(147, 197, 253, ${opacity})`; // Very light blue/white tint
                            } else {
                                ctx.fillStyle = `rgba(51, 65, 85, ${opacity})`; // Slate tint
                            }
                        }
                        ctx.fillText(char, drop.x + (COLUMN_WIDTH/2), yPos);
                    }
                }
                
                drop.y += drop.speed;
                
                // Animate characters occasionally
                if (Math.random() > 0.9) {
                     drop.chars = Array.from({ length: drop.length }, () => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]);
                }

                if (drop.y - (drop.length * FONT_SIZE) > height) {
                     // Respawn logic - Reduced by 50% from 0.995
                     if (Math.random() > 0.9975) {
                        const newDrop = createDrop(Math.floor(drop.x / COLUMN_WIDTH));
                        drops[i] = newDrop;
                     }
                }
            }
            
            // New drops - Reduced by 50% from 0.995
            if (drops.length < columns && Math.random() > 0.9975) {
                 const emptyCol = Math.floor(Math.random() * columns);
                 drops.push(createDrop(emptyCol));
            }
        };
        
        initialize();
        draw();
        
        const handleResize = () => initialize();
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [theme]); 

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};

export default Rainfall;