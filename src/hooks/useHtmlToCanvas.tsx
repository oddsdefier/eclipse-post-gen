import { toPng } from "html-to-image";
import { useState, useEffect, useCallback, memo, useMemo, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";

interface TextBlock {
	text: string;
	fontSize: number;
	fontStyle: string;
	textAlign: string;
	fontWeight: string;
	letterSpacing: number;
	lineHeight: number;
	fontFamily: string;
	background?: string;
}

// Memoized TextBlock component with absolute positioning
const TextBlockDisplay = memo(({ block }: { block: TextBlock }) => {
	return (
		<h4
			style={{
				position: "relative", // Changed from absolute to relative
				color: "#000",
				letterSpacing: `${block.letterSpacing}px`,
				lineHeight: block.lineHeight,
				wordBreak: "break-word",
				overflowWrap: "break-word",
				fontSize: `${block.fontSize}rem`,
				fontStyle: block.fontStyle,
				fontWeight: block.fontWeight,
				fontFamily: block.fontFamily,
				width: "100%", // Ensure full width
				willChange: "transform",
				transform: "translateZ(0)", // Force GPU acceleration
				WebkitFontSmoothing: "antialiased", // Better text rendering
				display: "block", // Ensure block display
			}}>
			<span
				style={{
					display: "inline-block", // Better text handling
					maxWidth: "100%", // Prevent overflow
				}}>
				{block.text}
			</span>
		</h4>
	);
});

const TextBlockControls = memo(({ block, onUpdate, onDelete }: { block: TextBlock; onUpdate: (key: keyof TextBlock, value: string | number) => void; onDelete: () => void }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border p-4 rounded-md bg-gray-100">
			<div>
				<Label>Text</Label>
				<Input type="text" value={block.text} onChange={(e) => onUpdate("text", e.target.value)} />
			</div>
			<div>
				<Label>Font Size (rem)</Label>
				<Slider min={1} max={20} step={0.1} value={[block.fontSize]} onValueChange={([value]) => onUpdate("fontSize", value)} />
				<div className="mt-1 text-sm text-gray-500">{block.fontSize.toFixed(1)} rem</div>
			</div>
			<div>
				<Label>Font Style</Label>
				<Select onValueChange={(value) => onUpdate("fontStyle", value)} value={block.fontStyle}>
					<SelectTrigger>
						<SelectValue placeholder="Select font style" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="normal">Normal</SelectItem>
						<SelectItem value="italic">Italic</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div>
				<Label>Font Weight</Label>
				<Select onValueChange={(value) => onUpdate("fontWeight", value)} value={block.fontWeight}>
					<SelectTrigger>
						<SelectValue placeholder="Select font weight" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="normal">Normal</SelectItem>
						<SelectItem value="bold">Bold</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div>
				<Label>Letter Spacing (px)</Label>
				<Slider min={-20} max={20} step={0.5} value={[block.letterSpacing]} onValueChange={([value]) => onUpdate("letterSpacing", value)} />
				<div className="mt-1 text-sm text-gray-500">{block.letterSpacing.toFixed(1)} px</div>
			</div>
			<div>
				<Label>Font Family</Label>
				<Select onValueChange={(value) => onUpdate("fontFamily", value)} value={block.fontFamily}>
					<SelectTrigger>
						<SelectValue placeholder="Select font family" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="GT Alpina Trial">GT Alpina Trial</SelectItem>
						<SelectItem value="Oswald">Oswald</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div>
				<Label>Line Height</Label>
				<Slider min={0.5} max={3} step={0.1} value={[block.lineHeight]} onValueChange={([value]) => onUpdate("lineHeight", value)} />
				<div className="mt-1 text-sm text-gray-500">{block.lineHeight.toFixed(1)}</div>
			</div>
			<div className="flex justify-end">
				<Button onClick={onDelete} className="mt-4 bg-red-500 text-white">
					Delete
				</Button>
			</div>
		</div>
	);
});

// Optimized preview component with IntersectionObserver
const TwitterPreview = memo(({ dataUrl }: { dataUrl: string }) => {
	const [isVisible, setIsVisible] = useState(false);
	const previewRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting);
			},
			{ threshold: 0.1 }
		);

		if (previewRef.current) {
			observer.observe(previewRef.current);
		}

		return () => observer.disconnect();
	}, []);

	if (!isVisible) {
		return <div ref={previewRef} className="h-32" />;
	}

	return (
		<div ref={previewRef} className="fixed w-full sm:w-[600px] top-4 left-1/2 transform -translate-x-1/2 z-10 px-4 sm:px-0">
			<img
				src={dataUrl}
				alt="Twitter Post Preview"
				style={{
					width: "100%",
					height: "auto",
					display: "block",
					willChange: "transform",
				}}
				loading="lazy"
			/>
		</div>
	);
});

const HtmlToCanvas = () => {
	const [dataUrl, setDataUrl] = useState<string | null>(null);
	const [textBlocks, setTextBlocks] = useState<TextBlock[]>([
		{
			text: "ECLIPSE EVERYTHING!",
			fontSize: 6,
			textAlign: "left",
			fontStyle: "normal",
			fontWeight: "normal", // Changed to bold for better visibility
			letterSpacing: -8,
			lineHeight: 0.85, // Adjusted for better readability
			fontFamily: "GT Alpina Trial",
		},
	]);

	const captureTimeoutRef = useRef<NodeJS.Timeout>();

	const captureElement = useCallback(async () => {
		const element = document.getElementById("capture");
		if (!element) return;

		try {
			await document.fonts.ready;
			const url = await toPng(element, {
				width: 1200,
				height: 675,
				cacheBust: true,
				backgroundColor: "#A1FEA0",
			});
			setDataUrl(url);
		} catch (error) {
			console.error("Failed to capture element:", error);
		}
	}, []);

	// More aggressive debouncing for capture
	useEffect(() => {
		if (captureTimeoutRef.current) {
			clearTimeout(captureTimeoutRef.current);
		}

		captureTimeoutRef.current = setTimeout(captureElement, 500);
		return () => {
			if (captureTimeoutRef.current) {
				clearTimeout(captureTimeoutRef.current);
			}
		};
	}, [textBlocks, captureElement]);

	const saveAsPng = useCallback(() => {
		if (!dataUrl) return;
		const link = document.createElement("a");
		link.href = dataUrl;
		const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
		link.download = `yap_${timestamp}.png`;
		link.click();
	}, [dataUrl]);

	const addNewTextBlock = useCallback(() => {
		setTextBlocks((prev) => [
			...prev,
			{
				text: "New Text",
				fontSize: 6,
				textAlign: "left",
				fontStyle: "normal",
				fontWeight: "normal", // Changed to bold for better visibility
				letterSpacing: -8,
				fontFamily: "GT Alpina Trial",
				lineHeight: 0.85, // Better default line height
			},
		]);
	}, []);

	const updateTextBlock = useCallback((index: number, key: keyof TextBlock, value: string | number) => {
		setTextBlocks((prev) => prev.map((block, i) => (i === index ? { ...block, [key]: value } : block)));
	}, []);

	const deleteTextBlock = useCallback((index: number) => {
		setTextBlocks((prev) => prev.filter((_, i) => i !== index));
	}, []);

	// Memoized text blocks display with CSS containment
	const textBlocksDisplay = useMemo(
		() => (
			<div
				className="h-full w-full flex flex-col justify-center items-start px-5"
				style={{
					contain: "layout paint",
					fontFeatureSettings: '"kern" 1', // Enable kerning
					textRendering: "optimizeLegibility", // Better text rendering
				}}>
				{textBlocks.map((block, index) => (
					<TextBlockDisplay key={index} block={block} />
				))}
			</div>
		),
		[textBlocks]
	);

	return (
		<div className="relative w-full min-h-screen container mx-auto overflow-hidden">
			<div id="capture" className="absolute z-0 top-0 left-0 right-0 p-10 font-gt flex justify-center items-center w-[1200px] h-[675px]" style={{ contain: "layout paint" }}>
				{textBlocksDisplay}
			</div>
			<div className="absolute top-0 left-0 right-0 bottom-0 w-screen h-screen bg-green-500 opacity-100 z-10"></div>
			<div className="bg-white z-20 w-full min-h-screen relative pt-[calc(100vw*9/16)] sm:pt-[28rem] pb-16 px-4 sm:px-6">
				{dataUrl && <TwitterPreview dataUrl={dataUrl} />}
				<Accordion type="multiple" className="w-full mt-4">
					{textBlocks.map((block, index) => (
						<AccordionItem key={index} value={`item-${index}`}>
							<AccordionTrigger>{block.text}</AccordionTrigger>
							<AccordionContent>
								<TextBlockControls block={block} onUpdate={(key, value) => updateTextBlock(index, key, value)} onDelete={() => deleteTextBlock(index)} />
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>

				<div className="flex flex-wrap gap-4 mt-6">
					<Button onClick={addNewTextBlock}>Add New Text Block</Button>
					<Button onClick={saveAsPng}>Save as PNG</Button>
				</div>
			</div>
		</div>
	);
};

export default memo(HtmlToCanvas);
