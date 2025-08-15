namespace ExpenseTracker.API.Contracts
{
    public record ExpenseRequest(
        string Description,
        decimal Amount,
        DateTime ExpenseDate);
}
