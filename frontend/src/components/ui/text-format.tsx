import { Heading1, Heading2, Heading3, Bold, Italic, Underline, Strikethrough, ListCheck, ListOrdered } from "lucide-react";
import { ButtonTextFormat } from "./button";

export default function TextFormat() {

    return (
        <div className="bg-tertiary/80 border border-[#1F2937] rounded p-2 flex items-center justify-start">
            <section className="pr-2 flex gap-1 border-r border-gray-300">
                <ButtonTextFormat>
                    <span className="flex items-center justify-center">
                        <Heading1 className="w-[1.5rem] h-[1.5rem]" />
                    </span>
                </ButtonTextFormat>
                <ButtonTextFormat>
                    <span className="w-full h-full flex items-center justify-center">
                        <Heading2 className="w-[1.5rem] h-[1.5rem]" />
                    </span>
                </ButtonTextFormat>
                <ButtonTextFormat>
                    <span className="flex items-center justify-center">
                        <Heading3 />
                    </span>
                </ButtonTextFormat>
            </section>
            <section className="px-2 flex gap-1 border-r border-gray-300">
                <ButtonTextFormat>
                    <span className="flex items-center justify-center">
                        <Bold />
                    </span>
                </ButtonTextFormat>
                <ButtonTextFormat>                
                    <span className="flex items-center justify-center">
                        <Italic />
                    </span>
                </ButtonTextFormat>
                <ButtonTextFormat>               
                    <span className="flex items-center justify-center">
                        <Underline />
                    </span>
                </ButtonTextFormat>
                <ButtonTextFormat>          
                    <span className="flex items-center justify-center">
                        <Strikethrough />
                    </span>
                </ButtonTextFormat>
            </section>
            <section className="pl-2 flex gap-1 border-gray-300">
                <ButtonTextFormat>           
                    <span className="flex items-center justify-center">
                        <ListCheck />
                    </span>
                </ButtonTextFormat>
                <ButtonTextFormat>
                    <span className="flex items-center justify-center">
                        <ListOrdered />
                    </span>
                </ButtonTextFormat>
            </section>
        </div>
        
    )
}