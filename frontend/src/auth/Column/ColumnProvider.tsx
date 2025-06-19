import { type PropsWithChildren, useEffect, useState } from "react";
import type { Column } from "../../types/types";
import ColumnContext from "./ColumnContext";
import { fetchColumns } from "../../lib/api";

type ColumnProviderProps = PropsWithChildren;

export default function ColumnProvider({ children }: ColumnProviderProps) {
    const [columns, setColumns] = useState<Column[]>([]);

    useEffect(() => {
      const getColumns = async () => {
        try {
          const columnsData = await fetchColumns();
          setColumns(columnsData);
          console.log(columnsData);
        } catch (error) {
          console.error('Error fetching Columns:', error);
        }
      };
      getColumns().catch(console.error);
    }, []);

    return (
        <ColumnContext.Provider value={{columns, setColumns}}>{children}</ColumnContext.Provider>
    )
}