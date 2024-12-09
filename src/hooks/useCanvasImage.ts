import { useRef, useEffect } from 'react';

interface CanvasImageOptions {
    backgroundColor: string;
    text: string;
    fontSize: number;
}

export function useCanvasImage(options: CanvasImageOptions) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to Twitter post dimensions
        canvas.width = 1200;
        canvas.height = 675;

        // Draw background
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw text
        ctx.fillStyle = 'black'; // Changed to black for better visibility on light background
        ctx.font = `italic ${options.fontSize}px "GT Alpina Trial"`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        // Calculate the maximum width for the text
        const maxWidth = canvas.width * 0.75;
        // Set letter spacing
        ctx.letterSpacing = '-4px'; // Adjust the letter spacing as needed

        // Set line height
        const lineHeight = options.fontSize * 0.8; // Adjust the line height as needed

        // Function to wrap text
        const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
            const words = text.split(' ');
            let line = '';

            words.forEach((word, index) => {
                const testLine = line + word + ' ';
                const testWidth = context.measureText(testLine).width;

                if (testWidth > maxWidth && index > 0) {
                    context.fillText(line, x, y);
                    line = word + ' ';
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            });

            context.fillText(line, x, y);
        };




        // Draw the wrapped text
        wrapText(ctx, options.text, canvas.width / 10, canvas.height / 4, maxWidth, lineHeight);
    }, [options]);

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = 'twitter-post-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return { canvasRef, downloadImage };
}

