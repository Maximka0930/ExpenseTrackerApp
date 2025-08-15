using ExpenseTracker.Core;
using ExpenseTracker.Core.Abstractions;
using ExpenseTracker.DataBase.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.DataBase.Repositories
{
    public class ExpenseRepository : IExpenseRepository
    {
        private readonly ExpenseTracker_DbContext _db;
        public ExpenseRepository(ExpenseTracker_DbContext db)
        {
            _db = db;
        }

        public async Task<List<Expense>> Get()
        {
            var expenseEntities = await _db.ExpenseEntities
                .AsNoTracking()
                .ToListAsync();

            return expenseEntities
                .Select(e => Expense.Create(
                    e.ExpenseId,
                    e.Description,
                    e.Amount,
                    e.ExpenseDate).exp).ToList();
        }
        public async Task<Guid> Create(Expense expense)
        {
            var expenseEntity = new ExpenseEntity
            {
                ExpenseId = expense.ExpenseId,
                Description = expense.Description,
                Amount = expense.Amount,
                ExpenseDate = expense.ExpenseDate,
            };

            await _db.ExpenseEntities.AddAsync(expenseEntity);
            await _db.SaveChangesAsync();
            return expenseEntity.ExpenseId;
        }
        public async Task<Guid> Update(Guid expenseId, string description, decimal amount, DateTime expenseDate)
        {
            var expenseEntity = await _db.ExpenseEntities
                .Where(e => e.ExpenseId == expenseId)
                .ExecuteUpdateAsync(e => e
                    .SetProperty(e => e.Description, description)
                    .SetProperty(e => e.Amount, amount)
                    .SetProperty(e => e.ExpenseDate, expenseDate));
            return expenseId;

        }
        public async Task<Guid> Delete(Guid expenseId)
        {
            await _db.ExpenseEntities
                .Where(e => e.ExpenseId == expenseId)
                .ExecuteDeleteAsync();
            return expenseId;
        }
    }
}
