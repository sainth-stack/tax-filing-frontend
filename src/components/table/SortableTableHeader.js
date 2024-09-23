import { Box, TableCell, TableSortLabel } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
const SortableTableHeader = ({ columnId, label, order, orderBy, onSort }) => {
    return (
        <TableCell sortDirection={orderBy === columnId ? order : false}>
            <TableSortLabel
                active={orderBy === columnId}
                direction={orderBy === columnId ? order : 'asc'}
                onClick={() => onSort(columnId)}
                IconComponent={() => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ArrowUpwardIcon sx={{ fontSize: 16, color: orderBy === columnId && order === 'asc' ? 'black' : 'gray' }} />
                        <ArrowDownwardIcon sx={{ fontSize: 16, color: orderBy === columnId && order === 'desc' ? 'black' : 'gray' }} />
                    </Box>
                )}
                sx={{
                    opacity: 1,
                    '& .MuiTableSortLabel-icon': {
                        opacity: 1,

                        width: '1em',

                        visibility: 'visible',
                    },
                }}
            >
                {label}
            </TableSortLabel>
        </TableCell>
    );
};

export default SortableTableHeader;
