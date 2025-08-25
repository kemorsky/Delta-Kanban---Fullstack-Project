import { LineSpinner } from "ldrs/react";
import 'ldrs/react/LineSpinner.css'

export const TodoModalLoading: React.FC = () => {
    return (
        <div className="bg-secondary mx-auto w-full max-w-[64rem] h-[30rem] p-4 md:rounded-md absolute inset-x-0 top-[0rem] md:top-[2rem] z-50">
            <section className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                <LineSpinner size="36" stroke="3" speed="1" color="white" />
            </section>
        </div>
    )
}