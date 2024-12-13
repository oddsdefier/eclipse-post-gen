import HtmlToCanvas from "@/hooks/useHtmlToCanvas";

export default function ImageGenerator() {
	return (
		<div className="container mx-auto h-screen overflow-hidden">
			<HtmlToCanvas />
		</div>
	);
}
