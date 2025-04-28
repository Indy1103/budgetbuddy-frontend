// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '../api/transactions';

export default function DashboardPage() {
  const { token, logout } = useAuth();
  const [txs, setTxs]     = useState([]);
  const [error, setError] = useState(null);

  // Form state
  const [amount, setAmount]         = useState('');
  const [type, setType]             = useState('INCOME');
  const [category, setCategory]     = useState('');
  const [note, setNote]             = useState('');
  const [date, setDate]             = useState('');
  const [formError, setFormError]   = useState(null);
  const [loading, setLoading]       = useState(false);
  const [editingId, setEditingId]   = useState(null);

  // Fetch existing transactions
  useEffect(() => {
    getTransactions(token)
      .then(setTxs)
      .catch(() => setError('Failed to load transactions'));
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

  // Add new transaction
  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!amount || !category || !date) {
      setFormError('Amount, category and date are required.');
      return;
    }
    setLoading(true);
    try {
      const newTx = await createTransaction(
        { amount: parseFloat(amount), type, category, note, date },
        token
      );
      setTxs([newTx, ...txs]);
      resetForm();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  // Update existing transaction
  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!amount || !category || !date) {
      setFormError('Amount, category and date are required.');
      return;
    }
    setLoading(true);
    try {
      await updateTransaction(
        editingId,
        { amount: parseFloat(amount), type, category, note, date },
        token
      );
      setTxs(
        txs.map(tx =>
          tx.id === editingId
            ? { ...tx, amount: parseFloat(amount), type, category, note, date }
            : tx
        )
      );
      resetForm();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to update transaction');
    } finally {
      setLoading(false);
    }
  };

  // Delete a transaction
  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id, token);
      setTxs(txs.filter(tx => tx.id !== id));
    } catch {
      setError('Failed to delete');
    }
  };

  // Start editing mode
  const handleEditClick = (tx) => {
    setAmount(tx.amount.toString());
    setType(tx.type);
    setCategory(tx.category);
    setNote(tx.note || '');
    setDate(tx.date.split('T')[0]);
    setEditingId(tx.id);
    setFormError(null);
  };

  if (error) return <div className="text-red-600 p-6">{error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <button onClick={logout} className="text-sm text-gray-600">
        Log out
      </button>
      <h1 className="text-2xl">Your Transactions</h1>

      {/* Transaction Form (add or edit) */}
      <form
        onSubmit={editingId ? handleUpdate : handleAdd}
        className="space-y-3 border p-4 rounded"
      >
        <h2 className="text-xl">
          {editingId ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        {formError && <div className="text-red-600">{formError}</div>}

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="p-2 border rounded"
          />
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Note (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading
            ? editingId
              ? 'Updating…'
              : 'Adding…'
            : editingId
              ? 'Update Transaction'
              : 'Add Transaction'}
        </button>
      </form>

      {/* Transactions List */}
      <ul className="space-y-2">
        {txs.map(tx => (
          <li key={tx.id} className="flex justify-between items-center border-b py-2">
            <div>
              <strong>{tx.type}</strong>: ${tx.amount.toFixed(2)} — {tx.category}{' '}
              <span className="text-gray-500 text-sm">
                {new Date(tx.date).toLocaleDateString()}
              </span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEditClick(tx)}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(tx.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
