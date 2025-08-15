namespace ExpenseTracker.DataBase.Entities
{
    public class ExpenseEntity
    {
        public Guid ExpenseId { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime ExpenseDate { get; set; }
    }
}
