// src/pages/DashboardPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '../api/transactions';

// Import Chart.js components
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register Chart.js components we will use
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);


export default function DashboardPage() {
  const { token, logout } = useAuth();
  // Initialize txs as an empty array, handle loading state separately
  const [txs, setTxs]     = useState([]);
  const [error, setError] = useState(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true); // New state for initial loading


  // Form state
  const [amount, setAmount]       = useState('');
  const [type, setType]           = useState('INCOME');
  const [category, setCategory]   = useState('');
  const [note, setNote]           = useState('');
  const [date, setDate]           = useState('');
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting]     = useState(false); // Renamed loading to isSubmitting
  const [editingId, setEditingId] = useState(null);

  // Fetch existing transactions
  useEffect(() => {
    setError(null);
    setIsLoadingInitial(true); // Start initial loading
    getTransactions(token)
      .then(data => {
           setTxs(data);
           setIsLoadingInitial(false); // End initial loading on success
      })
      .catch(() => {
          setError('Failed to load transactions. Please try refreshing.');
          setIsLoadingInitial(false); // End initial loading on error
      });
  }, [token]);

  // Common form reset
  const resetForm = () => {
    setAmount('');
    setType('INCOME');
    setCategory('');
    setNote('');
    setDate('');
    setEditingId(null);
    setFormError(null);
  };

  // Handle form submission (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!amount || !category || !date) {
      setFormError('Amount, category and date are required.');
      return;
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        setFormError('Please enter a valid positive amount.');
        return;
    }


    setIsSubmitting(true); // Use isSubmitting state
    try {
      const transactionData = {
        amount: parseFloat(amount),
        type,
        category,
        note,
        // Ensure date is in a consistent format for the backend (if needed)
        // The backend might expect 'YYYY-MM-DD' or ISO string depending on implementation
        // Using the input date value directly might be sufficient if backend handles it
        date: date // Use the date value from the input
        // Or if backend needs ISO: date: new Date(date).toISOString(),
      };

      if (editingId) {
        // --- UPDATE LOGIC (Using form values to update state, based on your working code) ---
        // We still call the API to save the change on the backend
        await updateTransaction(editingId, transactionData, token);
        // But update the local state using the values from the form
        setTxs(prevTxs =>
          prevTxs.map(tx =>
            tx.id === editingId
              ? { ...tx, ...transactionData, id: tx.id } // Update with form values, keep original ID
              : tx
          )
        );
        // --- END UPDATE LOGIC ---
      } else {
        // --- ADD LOGIC (Using API response to update state) ---
        const newTx = await createTransaction(transactionData, token);
        setTxs(prevTxs => [newTx, ...prevTxs]);
        // --- END ADD LOGIC ---
      }
      resetForm(); // Reset form on success

    } catch (err) {
      console.error("Transaction operation failed:", err);
      const message = err.response?.data?.message || err.response?.data?.error || 'An unexpected error occurred.';
      setFormError(`Operation failed: ${message}`);
    } finally {
      setIsSubmitting(false); // Use isSubmitting state
    }
  };


  // Delete a transaction
  const handleDelete = async (idToDelete) => {
     if (!window.confirm('Are you sure you want to delete this transaction?')) {
         return;
     }
     setError(null); // Clear previous general errors
     try {
      await deleteTransaction(idToDelete, token);
      setTxs(prevTxs => prevTxs.filter(tx => tx.id !== idToDelete));
    } catch (err) {
        console.error("Delete operation failed:", err);
        setError('Failed to delete transaction.');
    }
  };

  // Start editing mode
  const handleEditClick = (tx) => {
    setAmount(tx.amount.toString());
    setType(tx.type);
    setCategory(tx.category);
    setNote(tx.note || '');
    // Format date for input[type="date"]
    try {
        const formattedDate = new Date(tx.date).toISOString().split('T')[0];
        setDate(formattedDate);
    } catch (e) {
        console.error("Error formatting date for edit:", e);
        setDate(''); // Clear date if formatting fails
    }
    setEditingId(tx.id);
    setFormError(null);
    // Scroll to form
    const formElement = document.getElementById('transaction-form');
    formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Cancel editing mode
  const handleCancelEdit = () => {
     resetForm();
  };


  // --- Data Processing for Charts ---
  const { incomeTotal, expenseTotal, expenseByCategory } = useMemo(() => {
    if (!txs || txs.length === 0) {
      return { incomeTotal: 0, expenseTotal: 0, expenseByCategory: {} };
    }

    let income = 0;
    let expense = 0;
    const categoryMap = {};

    txs.forEach(tx => {
      // Ensure amount is a number before processing
      const txAmount = typeof tx.amount === 'number' ? tx.amount : parseFloat(tx.amount);

      if (isNaN(txAmount)) {
          console.warn(`Skipping transaction with invalid amount:`, tx);
          return; // Skip this transaction if amount is not a valid number
      }

      if (tx.type === 'INCOME') {
        income += txAmount;
      } else { // EXPENSE
        expense += txAmount;
        categoryMap[tx.category] = (categoryMap[tx.category] || 0) + txAmount;
      }
    });

    return {
        incomeTotal: income,
        expenseTotal: expense,
        expenseByCategory: categoryMap
    };
  }, [txs]); // Recalculate only when txs changes

  // --- Chart Configurations ---
  const incomeExpenseChartData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        label: 'Amount',
        data: [incomeTotal, expenseTotal],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Teal/Green for Income
          'rgba(255, 99, 132, 0.6)',  // Red for Expense
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const categoryChartData = {
    labels: Object.keys(expenseByCategory), // Categories
    datasets: [
      {
        label: 'Spending by Category',
        data: Object.values(expenseByCategory), // Amounts
        backgroundColor: [ // Add more colors if you expect many categories
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(201, 203, 207, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(199, 199, 199, 0.6)', // Added a few more generic colors
          'rgba(83, 102, 255, 0.6)',
          'rgba(40, 159, 64, 0.6)',
           'rgba(255, 100, 100, 0.6)', // More colors
           'rgba(100, 255, 100, 0.6)',
           'rgba(100, 100, 255, 0.6)',
        ].slice(0, Object.keys(expenseByCategory).length), // Use only as many colors as categories
         borderColor: [ // Corresponding border colors
           'rgba(255, 159, 64, 1)',
           'rgba(153, 102, 255, 1)',
           'rgba(255, 205, 86, 1)',
           'rgba(54, 162, 235, 1)',
           'rgba(201, 203, 207, 1)',
           'rgba(255, 99, 132, 1)',
           'rgba(75, 192, 192, 1)',
            'rgba(199, 199, 199, 1)',
            'rgba(83, 102, 255, 1)',
            'rgba(40, 159, 64, 1)',
            'rgba(255, 100, 100, 1)',
            'rgba(100, 255, 100, 1)',
            'rgba(100, 100, 255, 1)',
         ].slice(0, Object.keys(expenseByCategory).length),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to fill container height
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        // Title text is set per chart below
      },
       tooltip: { // Optional: Customize tooltips
          callbacks: {
              label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                      label += ': ';
                  }
                  // Check if parsed value is a number before formatting
                  const value = context.parsed.y !== undefined ? context.parsed.y : context.parsed;
                  if (typeof value === 'number' && !isNaN(value)) {
                     label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
                  } else {
                     label += 'N/A'; // Or some other indicator
                  }
                  return label;
              }
          }
      }
    },
    scales: { // Added scales for Bar chart to ensure labels are visible
        x: {
            ticks: {
                beginAtZero: true
            }
        },
        y: {
             // For horizontal bar chart, this is the category axis
             // No specific config needed unless you want to style labels
        }
    }
  };


  // --- Render Logic ---

  // Initial loading state
  if (isLoadingInitial) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading transactions...</p>
      </div>
    );
  }

  // Initial error state (if loading failed)
  if (error && !txs.length) { // Check if there are no transactions loaded
     return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="p-6 bg-red-100 border border-red-300 text-red-700 rounded-md text-center">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()} // Simple refresh to try again
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header section */}
        <div className="flex justify-between items-center mb-6 px-1">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {/* Logout Button */}
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm"
          >
            Log out
          </button>
        </div>

         {/* Display general errors (like delete failure) here */}
         {error && txs.length > 0 && ( // Show general error if there are transactions loaded
             <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm" role="alert">
               {error}
               <button
                 onClick={() => setError(null)} // Allow dismissing the error
                 className="ml-4 font-semibold text-red-800 hover:text-red-900 focus:outline-none focus:underline"
                 aria-label="Dismiss error message"
               >
                 Dismiss
               </button>
             </div>
          )}


        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">

          {/* --- Left Column (Charts) --- */}
          <div className="lg:col-span-1 space-y-8 mb-8 lg:mb-0">
            {/* Income vs Expense Chart */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md h-80 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Income vs. Expense</h3>
              {incomeTotal === 0 && expenseTotal === 0 ? (
                 <p className="text-center text-gray-500 my-auto">No data for chart.</p>
               ) : (
                 <div className="relative flex-grow">
                    <Doughnut
                        data={incomeExpenseChartData}
                        options={{...chartOptions, plugins: {...chartOptions.plugins, title: {display: false}}}}
                    />
                 </div>
               )}
            </div>

            {/* Spending by Category Chart */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md h-96 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Spending by Category</h3>
              {Object.keys(expenseByCategory).length === 0 ? (
                 <p className="text-center text-gray-500 my-auto">No expense data for chart.</p>
               ) : (
                 <div className="relative flex-grow">
                   <Bar
                      data={categoryChartData}
                      options={{
                          ...chartOptions,
                          indexAxis: 'y', // Horizontal bar chart
                          plugins: {
                              ...chartOptions.plugins,
                              title: { display: false }
                          }
                      }}
                   />
                 </div>
                )}
            </div>
          </div> {/* End Left Column */}


          {/* --- Right Column (Form & Table) --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* Transaction Form Card */}
            <div className="bg-white p-6 rounded-lg shadow-md" id="transaction-form">
               {/* Form Title */}
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-3">
                {editingId ? 'Edit Transaction' : 'Add New Transaction'}
              </h2>
              {/* Form Error Display */}
               {formError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm" role="alert">
                     {formError}
                     <button
                       onClick={() => setFormError(null)}
                       className="ml-4 font-semibold text-red-800 hover:text-red-900 focus:outline-none focus:underline"
                        aria-label="Dismiss form error message"
                     >
                        Dismiss
                     </button>
                  </div>
               )}

               {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                 {/* Amount & Type */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                       <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                       <input
                         type="number"
                         id="amount"
                         step="0.01"
                         value={amount}
                         onChange={(e) => setAmount(e.target.value)}
                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                         required
                         disabled={isSubmitting}
                       />
                     </div>

                     <div>
                       <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                       <select
                         id="type"
                         value={type}
                         onChange={(e) => setType(e.target.value)}
                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                         required
                         disabled={isSubmitting}
                       >
                         <option value="INCOME">Income</option>
                         <option value="EXPENSE">Expense</option>
                       </select>
                     </div>
                 </div>
                 {/* Category Input */}
                  <div>
                     <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                     <input
                       type="text"
                       id="category"
                       value={category}
                       onChange={(e) => setCategory(e.target.value)}
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                       required
                       disabled={isSubmitting}
                     />
                   </div>

                 {/* Date Input */}
                  <div>
                     <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                     <input
                       type="date"
                       id="date"
                       value={date}
                       onChange={(e) => setDate(e.target.value)}
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                       required
                       disabled={isSubmitting}
                     />
                   </div>

                 {/* Note Textarea */}
                  <div>
                     <label htmlFor="note" className="block text-sm font-medium text-gray-700">Note (Optional)</label>
                     <textarea
                       id="note"
                       value={note}
                       onChange={(e) => setNote(e.target.value)}
                       rows="2"
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                       disabled={isSubmitting}
                     ></textarea>
                   </div>

                 {/* Buttons */}
                 <div className="flex items-center justify-end space-x-3 pt-2">
                    {editingId && (
                      <button
                         type="button"
                         onClick={handleCancelEdit}
                         className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                         disabled={isSubmitting}
                       >
                         Cancel
                       </button>
                    )}

                     <button
                       type="submit"
                       className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                       disabled={isSubmitting}
                     >
                       {isSubmitting ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Transaction' : 'Add Transaction')}
                     </button>
                 </div>
              </form>
            </div> {/* End Form Card */}


            {/* Transactions List Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <h2 className="text-xl font-semibold text-gray-700 p-6 border-b border-gray-200">
                Transaction History
              </h2>
               {/* List or Empty State */}
              {txs.length === 0 ? (
                 <p className="text-center text-gray-500 py-10 px-6">No transactions yet.</p>
               ) : (
                 <ul className="divide-y divide-gray-200">
                   {txs.map(tx => (
                     <li key={tx.id} className="px-6 py-4 flex items-center justify-between flex-wrap sm:flex-nowrap gap-4">
                        {/* Transaction Details */}
                       <div className="flex-grow min-w-0">
                         <p className={`text-lg font-semibold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                           {tx.type === 'EXPENSE' && '-'}
                           {/* Safely display amount, using N/A if not a valid number */}
                           {typeof tx.amount === 'number' ? tx.amount.toFixed(2) : 'N/A'}
                           <span className="text-gray-500 text-sm font-normal"> in {tx.category}</span>
                         </p>

                         <p className="text-sm text-gray-500 mt-1">
                            {/* Safely display date */}
                            {tx.date ? new Date(tx.date).toLocaleDateString() : 'Invalid Date'}
                            {tx.note && ` - ${tx.note}`}
                         </p>
                       </div>
                       {/* Action Buttons */}
                       <div className="flex-shrink-0 flex items-center space-x-2">
                           <button
                              onClick={() => handleEditClick(tx)}
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium focus:outline-none focus:underline"
                              disabled={isSubmitting}
                           >
                             Edit
                           </button>

                          <button
                              onClick={() => handleDelete(tx.id)}
                              className="text-red-600 hover:text-red-900 text-sm font-medium focus:outline-none focus:underline"
                              disabled={isSubmitting}
                           >
                             Delete
                           </button>
                       </div>
                     </li>
                   ))}
                 </ul>
               )}
            </div> {/* End Transactions List Card */}
          </div> {/* End Right Column */}

        </div> {/* End Main Content Grid */}
      </div> {/* End Max Width Container */}
    </div> // End Page Container
  );
}
