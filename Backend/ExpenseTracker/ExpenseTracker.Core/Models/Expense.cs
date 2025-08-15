namespace ExpenseTracker.Core
{
    public class Expense
    {
        public const int MAX_DESCRIPTION_LENGTH = 100;
        public Guid ExpenseId { get; }
        public string Description { get; } = string.Empty;
        public decimal Amount { get; }
        public DateTime ExpenseDate { get; }

        public Expense()
        {
                
        }
        private Expense(Guid expenseId, string description, decimal amount, DateTime expenseDate)
        {
            ExpenseId = expenseId;
            Description = description;
            Amount = amount;
            ExpenseDate = expenseDate;
        }
        public static (Expense exp, string Error) Create(Guid expenseId, string description, decimal amount, DateTime expenseDate)
        {
            string error = string.Empty;
            if(description == string.Empty || description.Length > MAX_DESCRIPTION_LENGTH)
            {
                error += "Описание не может быть пустым или превышать 100 символов!\n";
            }
            if(amount <= 0)
            {
                error += "Сумма не может быть меньше либо равна 0!\n";
            }
            Expense expense = new Expense(expenseId,description,amount,expenseDate);
            return (expense,error);
        }
    }
}
