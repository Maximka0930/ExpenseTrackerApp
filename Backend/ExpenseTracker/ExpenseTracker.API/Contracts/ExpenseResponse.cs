namespace ExpenseTracker.API.Contracts
{
    public record ExpenseResponse(
        Guid ExpenseId,
        string Description,
        decimal Amount,
        DateTime ExpenseDate);
}
