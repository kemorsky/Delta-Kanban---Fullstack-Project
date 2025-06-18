import {useContext, createContext} from "react";
import type { Column } from "../../types/types";

type ColumnContext = {
    columns: Column[];
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>
}

const ColumnContext = createContext<ColumnContext | null>(null);

export const useColumns = () => {
    const context = useContext(ColumnContext);
    if (context === null || undefined) {
        throw new Error ("useColumns must be used within a ColumnProvider");
    }

    return {columns: context.columns, setColumns: context.setColumns}
}

export default ColumnContext;