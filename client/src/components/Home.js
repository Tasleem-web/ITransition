import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDrugAction,
  fetchDrugConfigAction,
  updateColumnOrderAction,
} from '../store/actions/drugActions';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import './Home.css';
import Pagination from './Pagination';
import { usePagination } from '../hooks/usePagination';

function Home() {
  const dispatch = useDispatch();
  const drugsList = useSelector((state) => state.list);
  const columnConfig = useSelector((state) => state.config);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [visibleColumns, setVisibleColumns] = useState([]);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const selectedFieldsForSearch = useMemo(() => {
    return visibleColumns.map((col) => col.field);
  }, [visibleColumns]);

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dragOverItem.current = index;
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');

    if (!columnConfig || columnConfig.length === 0) {
      console.error('Column configuration not loaded yet.');
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    if (dragItem.current === null || dragOverItem.current === null) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    const visibleColumns = [...columnConfig]
      .filter((col) => col.visible)
      .sort((a, b) => {
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return a.id - b.id;
      });

    if (visibleColumns.length === 0) {
      return;
    }

    const newOrderedVisibleColumns = [...visibleColumns];
    const draggedColumn = newOrderedVisibleColumns[dragItem.current];
    newOrderedVisibleColumns.splice(dragItem.current, 1);
    newOrderedVisibleColumns.splice(dragOverItem.current, 0, draggedColumn);

    const updatedNewConfig = columnConfig.map((col) => {
      const newIndex = newOrderedVisibleColumns.findIndex(
        (vCol) => vCol.field === col.field
      );
      if (newIndex !== -1) {
        return { ...col, order: newIndex + 1 };
      }
      return col;
    });

    dispatch(updateColumnOrderAction(updatedNewConfig));

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleColumnToggle = (field) => {
    const updatedConfig = columnConfig.map((col) =>
      col.field === field ? { ...col, visible: !col.visible } : col
    );
    dispatch(updateColumnOrderAction(updatedConfig));
  };

  const handleSortingChange = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const sortedAndFilteredData = useMemo(() => {
    let filtered = drugsList;

    if (searchTerm && selectedFieldsForSearch.length > 0) {
      filtered = filtered.filter((row) =>
        selectedFieldsForSearch.some(
          (col) =>
            row[col] &&
            row[col].toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        let comparison = 0;
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else if (sortField === 'launchDate') {
          comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
        } else {
          comparison = aValue.toString().localeCompare(bValue.toString());
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [drugsList, searchTerm, selectedFieldsForSearch, sortField, sortOrder]);

  const pagination = usePagination(sortedAndFilteredData, 10);
  const {
    currentData,
    totalItems,
    startItem,
    endItem,
    currentPageNumber,
    totalPages
  } = pagination;


  useEffect(() => {
    if (columnConfig.length > 0) {
      setVisibleColumns(
        columnConfig.filter((col) => col.visible).sort((a, b) => a.order - b.order)
      );
    }
  }, [columnConfig]);

  useEffect(() => {
    dispatch(fetchDrugAction());
    dispatch(fetchDrugConfigAction());
  }, [dispatch]);

  if (!drugsList || drugsList.length === 0 || columnConfig.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Drugs List</h2>
        <p>No drugs found or still loading...</p>
      </div>
    );
  }

  return (
    <div className="container pt-3">
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
                <i className="fa fa-sliders"></i> Adjust Columns
              </button>
              <div className={`dropdown-menu end-0 ${isDropdownOpen ? 'show' : ''}`}>
                <div className="px-3">
                  <h6 className="dropdown-header px-0">Select Columns to Search</h6>
                  {columnConfig.map((col) => (
                    <div key={col.field} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`check-${col.field}`}
                        checked={col.visible}
                        onChange={() => handleColumnToggle(col.field)}
                      />
                      <label className="form-check-label" htmlFor={`check-${col.field}`}>
                        {col.label}
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
          <thead className="table-light">
            <tr>
              {visibleColumns.map((col, index) => (
                <th
                  key={col.field}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onClick={() => handleSortingChange(col.field)}
                  className={dragOverItem.current === index ? 'drag-over-effect' : ''}
                >
                  <div className="d-flex align-items-center">
                    <span>{col.label}</span>
                    <span className="ms-2">
                      {sortField === col.field ? (
                        sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                      ) : (
                        <FaSort className="text-muted" />
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((drug, rowIndex) => (
              <tr key={drug.id}>
                {visibleColumns.map((col) => (
                  <td key={`${drug.id}-${col.field}`}>
                    {col.field === 'launchDate' ? (
                      drug.launchDate ? new Date(drug.launchDate).toLocaleDateString(navigator.language) : 'N/A'
                    ) : (
                      drug[col.field]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {
        currentData.length > 0 && (
          <Pagination pagination={pagination} />
        )
      }
    </div>
  );
}

export default Home;
