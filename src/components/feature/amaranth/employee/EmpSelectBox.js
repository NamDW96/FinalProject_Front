import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const EmpSelectBox = ({ data, width, setCompanySelect, companySelect }) => {
  const handleChange = event => {
    console.log('회사', event.target.value);
    setCompanySelect(event.target.value);
  };

  return (
    <FormControl sx={{ width: width }} size="small">
      <Select
        id="demo-select-small"
        value={companySelect}
        onChange={handleChange}
        displayEmpty
        sx={{
          borderRadius: '0',
          height: '28px',
          fontSize: '0.8rem',
          fontStyle: 'normal',
        }}
        MenuProps={{
          PaperProps: {
            style: {
              width: '190px',
              maxHeight: 250, // 원하는 최대 높이 값으로 변경
            },
          },
        }}
      >
        <MenuItem
          value=""
          style={{
            fontSize: '0.8rem',
            fontStyle: 'normal',
            fontWeight: 'bold',
            borderBottom: '1px solid #CCC',
          }}
        >
          <em>전체</em>
        </MenuItem>
        {data.map(company => (
          <MenuItem
            value={company.co_CD}
            key={company.co_CD}
            style={{
              fontSize: '0.8rem',
              fontWeight: 'bold',
              borderBottom: '1px solid #CCC',
            }}
          >
            {company.co_CD} {company.co_NM}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default EmpSelectBox;
