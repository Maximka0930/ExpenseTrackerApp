using ExpenseTracker.Core;
using ExpenseTracker.Core.Abstractions;

namespace ExpenseTracker.Application.Services
{
    public class ExpenseService : IExpenseService
    {
        private readonly IExpenseRepository _expenseRepository;
        public ExpenseService(IExpenseRepository expenseRepository)
        {
            _expenseRepository = expenseRepository;
        }
        public async Task<List<Expense>> GetExpenses()
        {
            return await _expenseRepository.Get();
        }
        public async Task<Guid> CreateExpense(Expense expense)
        {
            return await _expenseRepository.Create(expense);
        }
        public async Task<Guid> UpdateExpense(Guid expenseId, string description, decimal amount, DateTime expenseDate)
        {
            return await _expenseRepository.Update(expenseId, description, amount, expenseDate);
        }
        public async Task<Guid> DeleteExpense(Guid expenseId)
        {
            return await _expenseRepository.Delete(expenseId);
        }
    }
}
