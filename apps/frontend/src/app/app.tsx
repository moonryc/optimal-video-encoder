import './app.css';
import { useState, useCallback, useMemo } from 'react';
import { ConversionStatus } from '@org/models';
import { useConversionItemsQuery } from './hooks/api/useConversionItemsQuery';
import { useDeleteConversionItemsMutation } from './hooks/api/useDeleteConversionItemsMutation';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import ConversionItemRow from './ConversionItemRow/ConversionItemRow';
import Box from '@mui/material/Box';
import Header from './Header/Header';
import { ConfirmDeleteModal } from './ConfirmDeleteModal/ConfirmDeleteModal';

export function App() {
  const { data, refetch } = useConversionItemsQuery();
  const { mutate: deleteItems, isLoading: isDeleting } =
    useDeleteConversionItemsMutation();

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const selectableItems = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter(
      (item) =>
        item.status !== ConversionStatus.PENDING &&
        item.status !== ConversionStatus.PROCESSING
    );
  }, [data?.items]);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const allSelectableIds = selectableItems.map((item) => item.id);
    const allSelected = allSelectableIds.every((id) => selectedIds.has(id));

    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allSelectableIds));
    }
  }, [selectableItems, selectedIds]);

  const handleToggleDeleteMode = useCallback(() => {
    if (isDeleteMode) {
      setSelectedIds(new Set());
    }
    setIsDeleteMode((prev) => !prev);
  }, [isDeleteMode]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await deleteItems(Array.from(selectedIds));
      setIsConfirmModalOpen(false);
      setIsDeleteMode(false);
      setSelectedIds(new Set());
      await refetch();
    } catch {
      // Error handled by hook
    }
  }, [deleteItems, selectedIds, refetch]);

  const isAllSelected =
    selectableItems.length > 0 &&
    selectableItems.every((item) => selectedIds.has(item.id));
  const isIndeterminate =
    selectedIds.size > 0 && selectedIds.size < selectableItems.length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Optimal Video Encoder</h1>
        </div>
      </header>
      <main className="app-main">
        <Box mx={10} mt={2}>
          <Header
            isDeleteMode={isDeleteMode}
            onToggleDeleteMode={handleToggleDeleteMode}
            onOpenConfirmModal={() => setIsConfirmModalOpen(true)}
            selectedCount={selectedIds.size}
          />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    {isDeleteMode && (
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={isIndeterminate}
                        onChange={handleSelectAll}
                        disabled={selectableItems.length === 0}
                      />
                    )}
                  </TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Time Remaining</TableCell>
                  <TableCell align="right">4k</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items.map((ci) => (
                  <ConversionItemRow
                    key={ci.id}
                    conversionItem={ci}
                    isDeleteMode={isDeleteMode}
                    isSelected={selectedIds.has(ci.id)}
                    onToggleSelect={handleToggleSelect}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </main>
      <ConfirmDeleteModal
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        selectedCount={selectedIds.size}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default App;
