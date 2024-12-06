import React from "react";
import {
  Select,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  FormHelperText,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

// Custom styled Select component
const StyledSelect = styled(Select)(({ theme, error }) => ({
  backgroundColor: 'white',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: error ? theme.palette.error.main : 'rgba(0, 0, 0, 0.23)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
  },
}));

// Add new styled component for search field
const SearchTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    padding: '4px 8px',
  },
});

const MultiSelectInput = ({
  id,
  label,
  options,
  value,
  onChange,
  isDisabled,
  placeholder = "Select options...",
  noOptionsMessage = "No options available",
  isInvalid = false,
  errorMessage = "",
}) => {
  // Add search state
  const [searchText, setSearchText] = React.useState('');
  
  // Filter options based on search
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle change
  const handleChange = (event) => {
    const selectedValues = event.target.value;
    const selectedOptions = options.filter(option =>
      selectedValues.includes(option.value)
    );
    onChange(selectedOptions);
  };

  // Modified renderValue function
  const renderValue = (selected) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {selected.length > 0 ? (
        <>
          {selected.slice(0, 2).map((value) => (
            <Chip
              key={value}
              label={options.find(opt => opt.value === value)?.label}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '& .MuiChip-deleteIcon': {
                  color: 'white',
                  '&:hover': { color: 'white' },
                },
              }}
            />
          ))}
          {selected.length > 2 && (
            <Box component="span" sx={{ color: 'text.secondary' }}>
              +{selected.length - 2} more
            </Box>
          )}
        </>
      ) : (
        placeholder
      )}
    </Box>
  );

  return (
    <FormControl
      fullWidth
      error={isInvalid}
      disabled={isDisabled}
      sx={{ mb: 2 }}
    >
      {/* Move label outside */}
      <Box sx={{ mb: 1, fontWeight: 500 }}>{label}</Box>
      <StyledSelect
        // Remove label prop since it's now outside
        labelId={`${id}-label`}
        id={id}
        multiple
        value={value?.map(v => v.value) || []}
        onChange={handleChange}
        renderValue={renderValue}
        error={isInvalid}
        // Decrease height
        sx={{ '& .MuiSelect-select': { padding: '8px 14px' } }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 400,
              overflow: 'auto'
            },
          },
        }}
      >
        {/* Add search field at the top of menu */}
        <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1, p: 1 }}>
          <SearchTextField
            size="small"
            fullWidth
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </Box>
        
        {/* Use filteredOptions instead of options */}
        {filteredOptions.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'action.hover',
              },
              '&.Mui-selected:hover': {
                backgroundColor: 'action.selected',
              },
            }}
          >
            <Checkbox
              checked={value?.map(v => v.value).includes(option.value)}
              sx={{ mr: 1 }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <span>{option.label}</span>
              {option.description && (
                <span style={{ fontSize: '0.8em', color: 'text.secondary' }}>
                  {option.description}
                </span>
              )}
            </Box>
          </MenuItem>
        ))}
        
        {filteredOptions.length === 0 && (
          <MenuItem disabled>{searchText ? "No matching options" : noOptionsMessage}</MenuItem>
        )}
      </StyledSelect>
      {isInvalid && errorMessage && (
        <FormHelperText error>{errorMessage}</FormHelperText>
      )}
    </FormControl>
  );
};

export default MultiSelectInput;
