import html2canvas from "html2canvas";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface TextBlock {
	text: string;
	fontSize: number;
	fontStyle: string;
	textAlign: string;
	fontWeight: string;
	letterSpacing: number;
	lineHeight: number;
	paddingY: number;
	fontFamily: string; // New property for font family
}

const TwitterPreview = ({ dataUrl }: { dataUrl: string }) => {
	return (
		<div className="max-w-2xl mx-auto">
			<img
				src={dataUrl}
				alt="Twitter Post Preview"
				style={{
					width: "600px",
					height: "auto",
					borderRadius: "12px",
					margin: "20px auto",
					display: "block",
					boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
				}}
			/>
		</div>
	);
};

export default function HtmlToCanvas() {
	const [dataUrl, setDataUrl] = useState<string | null>(null);
	const [textBlocks, setTextBlocks] = useState<TextBlock[]>([
		{
			text: "ECLIPSE EVERYTHING!",
			fontSize: 12,
			textAlign: "left", // Ensure default alignment is left
			fontStyle: "italic",
			fontWeight: "normal",
			letterSpacing: -8,
			lineHeight: 0.8,
			paddingY: 0,
			fontFamily: "GT Alpina Trial",
		},
	]);

	const captureElement = async () => {
		const element = document.getElementById("capture");
		if (!element) {
			throw new Error("Element not found");
		}

		await document.fonts.ready;

		element.style.display = "block";
		const canvas = await html2canvas(element, {
			width: 1200,
			height: 675,
			useCORS: true,
			scale: 2,
		});

		const dataUrl = canvas.toDataURL("image/png");
		setDataUrl(dataUrl);
	};
	const saveAsPng = () => {
		if (!dataUrl) return;
		const link = document.createElement("a");
		link.href = dataUrl;
		const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
		link.download = `yap_${timestamp}.png`;
		link.click();
	};

	const addNewTextBlock = () => {
		setTextBlocks([
			...textBlocks,
			{
				text: "New Text",
				fontSize: 6,
				textAlign: "left", // Ensure new blocks are left-aligned
				fontStyle: "normal",
				fontWeight: "normal",
				letterSpacing: -8,
				fontFamily: "GT Alpina Trial",
				lineHeight: 0.8,
				paddingY: 20,
			},
		]);
	};

	useEffect(() => {
		captureElement();
	}, [textBlocks]);

	const updateTextBlock = (index: number, key: keyof TextBlock, value: string | number) => {
		const updatedBlocks = textBlocks.map((block, i) => (i === index ? { ...block, [key]: value } : block));
		setTextBlocks(updatedBlocks);
	};

	return (
		<div className="relative w-full h-full">
			<div id="capture" className="absolute top-0 left-0 right-0 p-10 font-gt flex justify-center items-center bg-[#A1FEA0] w-[1200px] h-[675px]">
				<div className="h-full w-full flex flex-col gap-4 text-left justify-center items-start pb-32 px-10">
					{textBlocks.map((block, index) => (
						<h4
							key={index}
							style={{
								color: "#000",
								letterSpacing: `${block.letterSpacing}px`,
								lineHeight: block.lineHeight,
								textAlign: "left", // Force left alignment
								wordBreak: "break-word",
								overflowWrap: "break-word",
								fontSize: `${block.fontSize}rem`,
								fontStyle: block.fontStyle,
								fontWeight: block.fontWeight,
								padding: `${block.paddingY}px `,
								fontFamily: block.fontFamily, // Apply the selected font family
							}}
							className="pb-36">
							<span>{block.text}</span>
						</h4>
					))}
				</div>
			</div>

			<div className="w-screen h-screen bg-gray-200 absolute top-0 left-0 z-0"></div>
			<div className="bg-white z-20 w-full h-screen relative p-4 overflow-y-scroll">
				{dataUrl && <TwitterPreview dataUrl={dataUrl} />}

				{textBlocks.map((block, index) => (
					<div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border p-4 rounded-md">
						<div>
							<Label>Text</Label>
							<Input type="text" value={block.text} onChange={(e) => updateTextBlock(index, "text", e.target.value)} />
						</div>
						<div>
							<Label>Font Size (rem)</Label>
							<Input type="number" value={block.fontSize} onChange={(e) => updateTextBlock(index, "fontSize", Number(e.target.value))} />
						</div>
						<div>
							<Label>Font Style</Label>
							<Select onValueChange={(value) => updateTextBlock(index, "fontStyle", value)} value={block.fontStyle}>
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
							<Select onValueChange={(value) => updateTextBlock(index, "fontWeight", value)} value={block.fontWeight}>
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
							<Input type="number" value={block.letterSpacing} onChange={(e) => updateTextBlock(index, "letterSpacing", Number(e.target.value))} />
						</div>
						<div>
							<Label>Font Family</Label>
							<Select onValueChange={(value) => updateTextBlock(index, "fontFamily", value)} value={block.fontFamily}>
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
							<Input type="number" step="0.1" value={block.lineHeight} onChange={(e) => updateTextBlock(index, "lineHeight", Number(e.target.value))} />
						</div>
						<div>
							<Label>Padding Y (px)</Label>
							<Input type="number" value={block.paddingY} onChange={(e) => updateTextBlock(index, "paddingY", Number(e.target.value))} />
						</div>
					</div>
				))}

				<Button onClick={addNewTextBlock} className="mt-4 mr-4">
					Add New Text Block
				</Button>
				<Button onClick={saveAsPng} className="mt-4">
					Save as PNG
				</Button>
			</div>
		</div>
	);
}
