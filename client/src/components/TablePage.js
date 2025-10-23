import React, { useState, useEffect, useMemo } from 'react';
import './TablePage.css'; // We'll create this CSS file later

const initialData = [
  { id: 1, fname: 'Andrei ', lname: 'Masharin', type: 'Owner, Tenant', phone: '777-444-6556', unit: '432', community: 'Los Alisos', address: '2400 Harbor Boulevard ', city: 'Costa Mesa', state: 'CA', zip: '94454' },
  { id: 2, fname: 'Anje', lname: 'Keizer', type: 'N/A', phone: '713-810-8418', unit: '343', community: 'Cameron', address: '3848 Michael Street', city: 'Hendley', state: 'NE', zip: '68946' },
  { id: 3, fname: 'Arina', lname: 'Belomestnykh', type: 'Owner, Tenant', phone: '937-755-9651', unit: '454', community: 'Fort Kent', address: '1918 Crim Lane', city: 'New Madison', state: 'OH', zip: '45346' },
  { id: 4, fname: 'Darius', lname: 'Cummings', type: 'N/A', phone: '937-755-9651', unit: '123', community: 'Dennehotso', address: '3848 Michael Street', city: 'Costa Mesa', state: 'NE', zip: '68946' },
  { id: 5, fname: 'Francisco', lname: 'Maia', type: 'Owner, Tenant', phone: '937-755-9651', unit: '565', community: 'Cameron', address: '3848 Michael Street', city: 'Hendley', state: 'NE', zip: '45346' },
  { id: 6, fname: 'Chinelo', lname: 'Chyke', type: 'N/A', phone: '937-755-9651', unit: '545', community: 'Dennehotso', address: '3848 Michael Street', city: 'Costa Mesa', state: 'NE', zip: '68946' },
  { id: 7, fname: 'Andrei ', lname: 'Masharin', type: 'Owner, Tenant', phone: '777-444-6556', unit: '432', community: 'Los Alisos', address: '2400 Harbor Boulevard ', city: 'Costa Mesa', state: 'CA', zip: '94454' },
  { id: 8, fname: 'Anje', lname: 'Keizer', type: 'N/A', phone: '713-810-8418', unit: '343', community: 'Cameron', address: '3848 Michael Street', city: 'Hendley', state: 'NE', zip: '68946' },
  { id: 9, fname: 'Arina', lname: 'Belomestnykh', type: 'Owner, Tenant', phone: '937-755-9651', unit: '454', community: 'Fort Kent', address: '1918 Crim Lane', city: 'New Madison', state: 'OH', zip: '45346' },
  { id: 10, fname: 'Darius', lname: 'Cummings', type: 'N/A', phone: '937-755-9651', unit: '123', community: 'Dennehotso', address: '3848 Michael Street', city: 'Costa Mesa', state: 'NE', zip: '68946' },
  { id: 11, fname: 'Francisco', lname: 'Maia', type: 'Owner, Tenant', phone: '937-755-9651', unit: '565', community: 'Cameron', address: '3848 Michael Street', city: 'Hendley', state: 'NE', zip: '45346' }
];

const columns = [
  { dataField: 'id', text: 'ID', headerClasses: 'header-id', bodyClasses: 'body-id' },
  { dataField: 'fname', text: 'First Name', headerClasses: 'header-fname', bodyClasses: 'body-fname' },
  { dataField: 'lname', text: 'Last Name', headerClasses: 'header-lname', bodyClasses: 'body-lname' },
  { dataField: 'type', text: 'Type', headerClasses: 'header-type', bodyClasses: 'body-type' },
  { dataField: 'phone', text: 'Phone', headerClasses: 'header-phone', bodyClasses: 'body-phone' },
  { dataField: 'unit', text: 'Unit', headerClasses: 'header-unit', bodyClasses: 'body-unit' },
  { dataField: 'community', text: 'Community', headerClasses: 'header-community', bodyClasses: 'body-community' },
  { dataField: 'address', text: 'Address', headerClasses: 'header-address', bodyClasses: 'body-address' },
  { dataField: 'city', text: 'City', headerClasses: 'header-city', bodyClasses: 'body-city' },
  { dataField: 'state', text: 'State', headerClasses: 'header-state', bodyClasses: 'body-state' },
  { dataField: 'zip', text: 'Zip', headerClasses: 'header-zip', bodyClasses: 'body-zip' }
];


const TablePage = () => {
  const [data, setData] = useState(initialData.map(row => ({ ...row, id: row.id || Math.random() })));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState(columns.map(col => col.dataField));

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleColumnToggle = (dataField) => {
    if (selectedColumns.includes(dataField)) {
      setSelectedColumns(selectedColumns.filter(col => col !== dataField));
    } else {
      setSelectedColumns([...selectedColumns, dataField]);
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(row =>
      selectedColumns.some(col =>
        row[col] && row[col].toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, selectedColumns]);

  const handleRowRemove = (idToRemove) => {
    setData(prevData => prevData.filter(row => row.id !== idToRemove));
  };

  // Convert jQuery's operateFormatter into a React component
  const OperateDropdown = ({ row, onRemove }) => (
    <div className="dropdown-container">
      <button className="btn btn-link dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i className="fa fa-ellipsis-h"></i>
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a className="dropdown-item" href="#">Action</a>
        <a className="dropdown-item" href="#">Another action</a>
        <a className="dropdown-item" href="#" onClick={() => onRemove(row.id)}>Remove</a>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="dropdown ml-2">
            <button className="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
              Columns
            </button>
            <ul className="dropdown-menu">
              {columns.map(col => (
                <li key={col.dataField}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={col.dataField}
                      checked={selectedColumns.includes(col.dataField)}
                      onChange={() => handleColumnToggle(col.dataField)}
                    />
                    <label className="form-check-label">
                      {col.text}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              {columns.map(col => (
                <th key={col.dataField} className={col.headerClasses}>{col.text}</th>
              ))}
              <th>Actions</th> {/* Actions column */}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(row => (
                <tr key={row.id}>
                  {columns.map(col => (
                    <td key={col.dataField} className={col.bodyClasses}>{row[col.dataField]}</td>
                  ))}
                  <td><OperateDropdown row={row} onRemove={handleRowRemove} /></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="text-center">No matching records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePage;
