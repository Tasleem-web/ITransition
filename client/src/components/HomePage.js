import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDrugAction, fetchDrugConfigAction } from '../store/actions/drugActions';
import usePagination from '../hooks/usePagination';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import './HomePage.css';

function HomePage() {
  const dispatch = useDispatch();
  const drugsList = useSelector((state) => state.list);
  const drugsConfigList = useSelector((state) => state.config);

  const columns = [
    { dataField: 'id', text: 'Drug ID' },
    { dataField: 'code', text: 'Drug Code' },
    { dataField: 'name', text: 'Drug Name' },
    { dataField: 'company', text: 'Company Name' },
    { dataField: 'launchDate', text: 'Launch Date' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState(columns.map(col => col.dataField));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleColumnToggle = (dataField) => {
    if (selectedColumns.includes(dataField)) {
      setSelectedColumns(selectedColumns.filter(col => col !== dataField));
    } else {
      setSelectedColumns([...selectedColumns, dataField]);
    }
    setCurrentPage(1);
  };

  const handleSortingChange = (dataField) => {
    const isAsc = sortField === dataField && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(dataField);
  };

  const sortedAndFilteredData = useMemo(() => {
    let filtered = drugsList;

    if (searchTerm) {
      filtered = filtered.filter(row =>
        selectedColumns.some(col =>
          row[col] && row[col].toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    const mappedData = filtered.map(drug => ({
      ...drug,
      name: `${drug.name}`
    }));

    if (sortField) {
      mappedData.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        let comparison = 0;

        if (sortField === 'id' || sortField === 'code') {
          comparison = aValue - bValue;
        } else if (sortField === 'launchDate') {
          comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
        } else {
          comparison = aValue.toString().localeCompare(bValue.toString());
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return mappedData;
  }, [drugsList, searchTerm, selectedColumns, sortField, sortOrder]);

  useEffect(() => {
    dispatch(fetchDrugAction());
    dispatch(fetchDrugConfigAction());
  }, [dispatch]);

  const {
    currentData,
    maxPage,
    jump,
    next,
    prev,
    paginationRange
  } = usePagination({ data: sortedAndFilteredData, itemsPerPage: 10, currentPage, setCurrentPage });

  if (!drugsList || drugsList.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Drugs List</h2>
        <p>No drugs found or still loading...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div id="toolbar" className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="dropdown-container dropdown">
              <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <i className="fa fa-sliders"></i> Advanced Search
              </button>
              <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                <div className="p-3">
                  <h6 className="dropdown-header">Select Columns to Search</h6>
                  {columns.map(col => (
                    <div key={col.dataField} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`check-${col.dataField}`}
                        checked={selectedColumns.includes(col.dataField)}
                        onChange={() => handleColumnToggle(col.dataField)}
                      />
                      <label className="form-check-label" htmlFor={`check-${col.dataField}`}>
                        {col.text}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-4">Drugs List</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              {selectedColumns.map(colField => {
                const col = columns.find(c => c.dataField === colField);
                return (
                  <th key={col.dataField} onClick={() => handleSortingChange(col.dataField)}>
                    <div className="d-flex align-items-center">
                      <span>{col.text}</span>
                      <span className="ms-2">
                        {sortField === col.dataField ? (
                          sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                        ) : (
                          <FaSort className="text-muted" />
                        )}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {currentData.map((drug) => (
              <tr key={drug.id}>
                {selectedColumns.map((colField) => {
                  switch (colField) {
                    case 'launchDate':
                      return (
                        <td key={`${drug.id}-${colField}`}>
                          {drug.launchDate ? new Date(drug.launchDate).toLocaleDateString(navigator.language) : 'N/A'}
                        </td>
                      );
                    case 'name':
                      return (
                        <td key={`${drug.id}-${colField}`}>{drug.name}</td>
                      );
                    default:
                      return (
                        <td key={`${drug.id}-${colField}`}>
                          {drug[colField]}
                        </td>
                      );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls mt-3">
        <button
          className="btn btn-outline-primary"
          onClick={prev}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {paginationRange.map((page, index) => (
          page === '...' ? (
            <span key={index} className="page-dots">...</span>
          ) : (
            <button
              key={page}
              className={`btn ${currentPage === page ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => jump(page)}
            >
              {page}
            </button>
          )
        ))}
        <button
          className="btn btn-outline-primary"
          onClick={next}
          disabled={currentPage === maxPage}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default HomePage;
