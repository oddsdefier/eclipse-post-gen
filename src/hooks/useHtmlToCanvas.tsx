import html2canvas from "html2canvas";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface TextBlock {
	text: string;
	fontSize: number;
	fontStyle: string;
	textAlign: string;
	fontWeight: string;
	letterSpacing: number;
	lineHeight: number;
	paddingY: number;
	fontFamily: string;
	background?: string;
}

const TwitterPreview = ({ dataUrl }: { dataUrl: string }) => {
	return (
		<div className="fixed w-full sm:w-[600px] top-4 left-1/2 transform -translate-x-1/2 z-10 px-4 sm:px-0">
			<img
				src={dataUrl}
				alt="Twitter Post Preview"
				style={{
					width: "100%",
					height: "auto",
					display: "block",
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
			textAlign: "left",
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

		const canvas = await html2canvas(element, {
			width: 1200,
			height: 675,
			useCORS: true,
			scale: 2,
			backgroundColor: "#A1FEA0",
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
				textAlign: "left",
				fontStyle: "normal",
				fontWeight: "normal",
				letterSpacing: -8,
				fontFamily: "GT Alpina Trial",
				lineHeight: 0.8,
				paddingY: 0,
			},
		]);
	};

	const deleteTextBlock = (index: number) => {
		const updatedBlocks = textBlocks.filter((_, i) => i !== index);
		setTextBlocks(updatedBlocks);
	};

	useEffect(() => {
		captureElement();
	}, [textBlocks]);

	const updateTextBlock = (index: number, key: keyof TextBlock, value: string | number) => {
		const updatedBlocks = textBlocks.map((block, i) => (i === index ? { ...block, [key]: value } : block));
		setTextBlocks(updatedBlocks);
	};

	return (
		<div className="relative w-full min-h-screen container mx-auto overflow-hidden">
			<div id="capture" className="absolute z-0 top-0 left-0 right-0 p-10 font-gt flex justify-center items-center w-[1200px] h-[675px]">
				<div className="h-full w-full flex flex-col gap-1 text-left justify-center items-start pb-32 px-5">
					{textBlocks.map((block, index) => (
						<h4
							key={index}
							style={{
								color: "#000",
								letterSpacing: `${block.letterSpacing}px`,
								lineHeight: block.lineHeight,
								textAlign: "left",
								wordBreak: "break-word",
								overflowWrap: "break-word",
								fontSize: `${block.fontSize}rem`,
								fontStyle: block.fontStyle,
								fontWeight: block.fontWeight,
								padding: `${block.paddingY}px `,
								fontFamily: block.fontFamily,
							}}
							className="pb-36">
							<span>{block.text}</span>
						</h4>
					))}
				</div>
			</div>
			<div className="absolute top-0 left-0 right-0 bottom-0 w-screen h-screen bg-green-500 opacity-100 z-10"></div>
			<div className="bg-white z-20 w-full min-h-screen relative pt-[calc(100vw*9/16)] sm:pt-[28rem] pb-16 px-4 sm:px-6">
				{dataUrl && <TwitterPreview dataUrl={dataUrl} />}
				<Accordion type="multiple" className="w-full mt-4">
					{textBlocks.map((block, index) => (
						<AccordionItem key={index} value={`item-${index}`}>
							<AccordionTrigger>Text Block {index + 1}</AccordionTrigger>
							<AccordionContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border p-4 rounded-md bg-gray-100">
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
										<Input type="number" value={block.letterSpacing === 0 ? "" : block.letterSpacing} onChange={(e) => updateTextBlock(index, "letterSpacing", e.target.value === "" ? 0 : Number(e.target.value))} />
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
										<Input type="number" value={block.lineHeight === 0 ? "" : block.lineHeight} onChange={(e) => updateTextBlock(index, "lineHeight", e.target.value === "" ? 0 : Number(e.target.value))} />
									</div>
									<div>
										<Label>Padding Y (px)</Label>
										<Input type="number" value={block.paddingY === 0 ? "" : block.paddingY} onChange={(e) => updateTextBlock(index, "paddingY", e.target.value === "" ? 0 : Number(e.target.value))} />
									</div>
									<div className="flex justify-end">
										<Button onClick={() => deleteTextBlock(index)} className="mt-4 bg-red-500 text-white">
											Delete
										</Button>
									</div>
								</div>
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
}
