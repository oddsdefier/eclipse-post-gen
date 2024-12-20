import { memo } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface MemoizedSelectProps {
	value: string;
	onValueChange: (value: string) => void;
}

const MemoizedSelect = memo(({ value, onValueChange }: MemoizedSelectProps) => {
	console.log("Rendering Select"); 

	return (
		<Select onValueChange={onValueChange} value={value}>
			<SelectTrigger>
				<SelectValue placeholder="Select font style" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="normal">Normal</SelectItem>
				<SelectItem value="italic">Italic</SelectItem>
			</SelectContent>
		</Select>
	);
});

export default MemoizedSelect;
